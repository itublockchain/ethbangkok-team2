import { Keyring } from "@polkadot/api";
import { SDK } from "avail-js-sdk";
import { WaitFor } from "avail-js-sdk/sdk/transactions";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import dotenv from "dotenv";
dotenv.config();

const seed = process.env.SEED!;
const providerEndpoint = "wss://turing-rpc.avail.so/ws";

export const updateString = async () => {
  const bool = await cryptoWaitReady();
  if (!bool) {
    console.log("cryptoWaitReady failed");
    process.exit(1);
  }
  const account = new Keyring({ type: "sr25519" }).addFromUri(seed);
  const sdk = await SDK.New(providerEndpoint);
  const result0 = await sdk.api.rpc.chain.getBlock(
    "0x881815209435bfb1084b795c90336f910ad2c38b9fa40e2dd87852b9df353e51"
  );
  /*   console.log("result0: ", result0);
   */

  for (let i = 0; i < result0.block.extrinsics.length; i++) {
    console.log(result0.block.extrinsics[i].data.toString());
  }
};

updateString();
