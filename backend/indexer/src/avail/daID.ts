import { Keyring } from "@polkadot/api";
import { SDK } from "avail-js-sdk";
import { WaitFor } from "avail-js-sdk/sdk/transactions";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  const bool = await cryptoWaitReady();
  if (!bool) {
    console.log("cryptoWaitReady failed");
    process.exit(1);
  }

  const seed = process.env.SEED!;
  console.log(seed);
  const account = new Keyring({ type: "sr25519" }).addFromUri(seed);
  console.log(account);
  const providerEndpoint = "wss://turing-rpc.avail.so/ws";
  const sdk = await SDK.New(providerEndpoint);

  const key = "ethbangkok-oro";

  const result = await sdk.tx.dataAvailability.createApplicationKey(
    key,
    WaitFor.BlockInclusion,
    account
  );
  if (result.isErr) {
    console.log(result.reason);
    process.exit(1);
  }

  console.log(
    "Key=" +
      result.event.key +
      ", Owner=" +
      result.event.owner +
      ", Id=" +
      result.event.id
  );
  console.log("TxHash=" + result.txHash + ", BlockHash=" + result.blockHash);

  process.exit();
};
main();
