import { IndexService } from "@ethsign/sp-sdk";
const data = [
  {
    attestationId: "0x102",
    txHash:
      "0xd2e0cc432bf0e763ebd30c1a200c8709fd456cb1a5e13dc68ee15d458ccf3d46",
    indexingValue: "filecoin_medium",
  },
  {
    attestationId: "0x103",
    txHash:
      "0xe7e94c5725338e897e3e7c0118a659061a1def5704f65c09ab1e7109878d914f",
    indexingValue: "filecoin_medium",
  },
  {
    attestationId: "0x104",
    txHash:
      "0xe1d55770f88c67b79fa6b926481cddc972ca740c84869234ae1d97b76fcac0d2",
    indexingValue: "filecoin_medium",
  },
  {
    attestationId: "0x105",
    txHash:
      "0x7fa6472fe67726dec64c9706533a98e7409e670d09ab884d41e689b1c7e363a6",
    indexingValue: "filecoin_medium",
  },
  {
    attestationId: "0x106",
    txHash:
      "0x0f1d10fc509191884d80c0f12b63205bf09c1445da6050801f66eca6a3342287",
    indexingValue: "filecoin_medium",
  },
  {
    attestationId: "0x107",
    txHash:
      "0x13e300ce1c01005a7ef3ae074240627b8d915aeef04fc22dcf35a9e7e38b31d4",
    indexingValue: "filecoin_medium",
  },
  {
    attestationId: "0x108",
    txHash:
      "0x87a258f1891541039e3ac71cbf4ee8eea68e063c90c38cb662020b1debd3d2f3",
    indexingValue: "filecoin_medium",
  },
  {
    attestationId: "0x109",
    txHash:
      "0xca69dc2989aab8d09e9277506050f4540d978049f40216de680be7a4019034e2",
    indexingValue: "filecoin_medium",
  },
  {
    attestationId: "0x10a",
    txHash:
      "0x6a806562a9d94ca9190b3ab9dda12fdcce9ff365fee26a2856b133a27d11fc87",
    indexingValue: "filecoin_medium",
  },
  {
    attestationId: "0x10b",
    txHash:
      "0x708f88b30f909a210244676faf3371b2f9cd5696a5b70c28740878436c123e95",
    indexingValue: "filecoin_medium",
  },
];

const indexService = new IndexService("testnet");

async function getAttestationByID(attestationId: string) {
  const attestation = await indexService.queryAttestation(attestationId);
  console.log(attestation);
}

async function main() {
  for (const entry of data) {
    await getAttestationByID(entry.attestationId);
  }
}

main().catch(console.error);
