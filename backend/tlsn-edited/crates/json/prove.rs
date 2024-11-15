use http_body_util::Empty;
use hyper::{body::Bytes, Request, StatusCode};
use hyper_util::rt::TokioIo;
use tokio_util::compat::{FuturesAsyncReadCompatExt, TokioAsyncReadCompatExt};

use axum::routing::post;
use axum::{Json, Router};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tlsn_common::config::ProtocolConfig;
use tlsn_core::{request::RequestConfig, transcript::TranscriptCommitConfig};
use tlsn_examples::run_notary;
use tlsn_formats::http::{DefaultHttpCommitter, HttpCommit, HttpTranscript};
use tlsn_prover::{Prover, ProverConfig};

#[derive(Deserialize)]
struct CreateProof {
    domain: String,
}

#[derive(Serialize)]
struct ProofResponse {
    domain: String,
    attestation: Vec<u8>,
    secrets: Vec<u8>,
}

const USER_AGENT: &str = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36";

async fn create_proof(
    Json(payload): Json<CreateProof>,
) -> Result<Json<ProofResponse>, ()> {
    let domain = payload.domain;
    let new_domain = domain.as_str();
    let (prover_socket, notary_socket) = tokio::io::duplex(1 << 16);
    tokio::spawn(run_notary(notary_socket.compat()));
    let config = ProverConfig::builder()
    .server_name(new_domain)
    .protocol_config(
        ProtocolConfig::builder()
            .max_sent_data(1024)
            .max_recv_data(4096)
            .build()
            .map_err(|e| {
                (
                )
            })?,
    )
    .build();
    println!("config: {:?}", config);

    let prover = Prover::new(config.unwrap())
    .setup(prover_socket.compat())
    .await
    .map_err(|e| {
    (
        )
    })?;
    println!("prover created.");
    let client_socket = tokio::net::TcpStream::connect((new_domain, 443))
    .await
    .map_err(|e| {
        println!("error: {:?}", e);

        (

        )
    })?;

    let (mpc_tls_connection, prover_fut) =
        prover.connect(client_socket.compat()).await.map_err(|e| {
            println!("error: {:?}", e);

            (
               
            )
        })?;
    let mpc_tls_connection = TokioIo::new(mpc_tls_connection.compat());
        println!("mpc_tls_connection: ");

    let prover_task = tokio::spawn(prover_fut);

    let (mut request_sender, connection) =
        hyper::client::conn::http1::handshake(mpc_tls_connection)
            .await
            .map_err(|e| {
                println!("error: {:?}", e);

                (
                    
                )
            })?;

    tokio::spawn(connection);

    let request = Request::builder()
        .uri("/")
        .header("Host", new_domain)
        .header("Accept", "*/*")
        .header("Accept-Encoding", "identity")
        .header("Connection", "close")
        .header("User-Agent", USER_AGENT)
        .body(Empty::<Bytes>::new())
        .map_err(|e| {
            (
                
            )
        })?;
        println!("request sending");
    let response = request_sender.send_request(request).await.map_err(|e| {
        println!("error: {:?}", e);

        (
            
        )
    })?;
    println!("response received");
    if response.status() != StatusCode::OK {
        println!("error: {:?}", response.status());
        println!("response: {:?}", response);
        return Err((
            
        ));
    }
    let prover = prover_task.await.map_err(|e| {
        println!("error: {:?}", e);

        (
            
        )
    })?;
    println!("prover task: ");
    let mut prover = prover.unwrap().start_notarize();

    let transcript = HttpTranscript::parse(prover.transcript()).map_err(|e| {
        println!("error: {:?}", e);

        (
            
        )
    })?;
    println!("transcript:",);
    let mut builder = TranscriptCommitConfig::builder(prover.transcript());
    DefaultHttpCommitter::default()
        .commit_transcript(&mut builder, &transcript)
        .map_err(|e| {
            println!("error: {:?}", e);

            (
                
            )
        })?;

    prover
        .transcript_commit(builder.build().map_err(|e| {
            println!("error: {:?}", e);

            (
            
            )
        })?);

    let config = RequestConfig::default();

    let (attestation, secrets) = prover.finalize(&config).await.map_err(|e| {
        println!("error: {:?}", e);
        (
          
        )
    })?;
    println!("attestation created successfully");

    Ok(Json(ProofResponse {
        domain: domain.to_string(),
        attestation: bincode::serialize(&attestation).map_err(|e| {
            (

            )
        })?,
        secrets: bincode::serialize(&secrets).map_err(|e| {
            (

            )
        })?,
    }))
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/proof", post(
        create_proof
    ));

    let addr = SocketAddr::from(([127, 0, 0, 1], 2000));
    println!("Listening on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
