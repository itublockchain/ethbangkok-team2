import { privateKeyToAccount } from "viem/accounts";
import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  Schema,
  OnChainSchema,
} from "@ethsign/sp-sdk";
import dotenv from "dotenv";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;

export const signSchema: OnChainSchema = {
  name: "LibreNews Schema",
  data: [
    {
      name: "title",
      type: "string",
    },
    {
      name: "content",
      type: "string",
    },
    {
      name: "link",
      type: "string",
    },
  ],
};

export const signClient = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.polygonAmoy,
  account: privateKeyToAccount(`0x${privateKey}`),
});
