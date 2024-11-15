use http_body_util::Empty;
use hyper::{body::Bytes, Request, StatusCode};
use hyper_util::rt::TokioIo;
use tokio_util::compat::{FuturesAsyncReadCompatExt, TokioAsyncReadCompatExt};
use serde_json::json;

use tlsn_common::config::ProtocolConfig;
use tlsn_core::{request::RequestConfig, transcript::TranscriptCommitConfig};
use tlsn_examples::run_notary;
use tlsn_formats::http::{DefaultHttpCommitter, HttpTranscript};
use tlsn_prover::{Prover, ProverConfig};

const SERVER_DOMAIN: &str = "example.com";
const USER_AGENT: &str = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36";

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();

    let (prover_socket, notary_socket) = tokio::io::duplex(1 << 16);
    tokio::spawn(run_notary(notary_socket.compat()));

    let config = ProverConfig::builder()
        .server_name(SERVER_DOMAIN)
        .protocol_config(
            ProtocolConfig::builder()
                .max_sent_data(1024)
                .max_recv_data(4096)
                .build()?,
        )
        .build()?;

    let prover = Prover::new(config).setup(prover_socket.compat()).await?;
    let client_socket = tokio::net::TcpStream::connect((SERVER_DOMAIN, 443)).await?;
    let (mpc_tls_connection, prover_fut) = prover.connect(client_socket.compat()).await?;
    let mpc_tls_connection = TokioIo::new(mpc_tls_connection.compat());
    let prover_task = tokio::spawn(prover_fut);
    let (mut request_sender, connection) = hyper::client::conn::http1::handshake(mpc_tls_connection).await?;
    tokio::spawn(connection);

    let request = Request::builder()
        .uri("/")
        .header("Host", SERVER_DOMAIN)
        .header("Accept", "*/*")
        .header("Accept-Encoding", "identity")
        .header("Connection", "close")
        .header("User-Agent", USER_AGENT)
        .body(Empty::<Bytes>::new())?;

    println!("Starting an MPC TLS connection with the server");
    let response = request_sender.send_request(request).await?;
    println!("Got a response from the server");
    assert!(response.status() == StatusCode::OK);

    let prover = prover_task.await??;
    let mut prover = prover.start_notarize();
    let transcript = HttpTranscript::parse(prover.transcript())?;
    let mut builder = TranscriptCommitConfig::builder(prover.transcript());
    DefaultHttpCommitter::default().commit_transcript(&mut builder, &transcript)?;
    prover.transcript_commit(builder.build()?);

    let config = RequestConfig::default();
    let (attestation, secrets) = prover.finalize(&config).await?;

    let json_output = json!({
        "attestation": bincode::serialize(&attestation)?,
        "secrets": bincode::serialize(&secrets)?,
    });

    tokio::fs::write("output.json", serde_json::to_string_pretty(&json_output)?).await?;
    println!("JSON output saved to output.json");

    Ok(())
}

