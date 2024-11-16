import { Keyring } from "@polkadot/api";
import { SDK } from "avail-js-sdk";
import { WaitFor } from "avail-js-sdk/sdk/transactions";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import dotenv from "dotenv";
dotenv.config();

const seed = process.env.SEED!;
const providerEndpoint = "wss://turing-rpc.avail.so/ws";

export const updateString = async (data: string) => {
  const bool = await cryptoWaitReady();
  if (!bool) {
    console.log("cryptoWaitReady failed");
    process.exit(1);
  }
  const account = new Keyring({ type: "sr25519" }).addFromUri(seed);
  const sdk = await SDK.New(providerEndpoint);

  const result = await sdk.tx.dataAvailability.submitData(
    data,
    WaitFor.BlockInclusion,
    account,
    { app_id: 199 }
  );
  if (result.isErr) {
    console.log(result.reason);
    process.exit(1);
  }

  console.log("Data=" + result.txData.data);
  console.log(
    "Who=" + result.event.who + ", DataHash=" + result.event.dataHash
  );
  console.log("result: ", result);
  process.exit();
};

updateString("Hello, world!");
