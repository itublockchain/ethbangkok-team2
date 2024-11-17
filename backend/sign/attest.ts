import { signClient, signSchema } from "./signClient";

import { privateKeyToAccount } from "viem/accounts";
import {
  delegateSignSchema,
  EvmChains,
  delegateSignAttestation,
} from "@ethsign/sp-sdk";

import dotenv from "dotenv";
dotenv.config();

const privateKey = process.env.PRIVATE_KEY!;
const account = privateKeyToAccount(`0x${privateKey}`);

export async function attest(
  data: {
    title: string;
    content: string;
    link: string;
  }[],
  name: string
) {
  const info = await delegateSignSchema(signSchema, {
    delegationAccount: account,
    chain: EvmChains.polygonAmoy,
  });
  const delegateCreateSchemaRes = await signClient.createSchema(info.schema);

  for (const entry of data) {
    const infoAttestation = await delegateSignAttestation(
      {
        schemaId: delegateCreateSchemaRes.schemaId,
        data: {
          title: entry.title,
          content: entry.content,
          link: entry.link,
        },
        indexingValue: name,
      },
      {
        chain: EvmChains.polygonAmoy,
        delegationAccount: account,
      }
    );

    const delegationCreateAttestationRes = await signClient.createAttestation(
      infoAttestation.attestation,
      {
        delegationSignature: infoAttestation.delegationSignature,
      }
    );
    console.log(delegationCreateAttestationRes);
  }
}
