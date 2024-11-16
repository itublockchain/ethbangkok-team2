import { uploadFile } from "./akaveClient";
import { fetchRssData } from "./rssProcessor";

const createDocument = async (data: object, name: string) => {
  try {
    await uploadFile(name, data, `${name + new Date().toISOString()}`);
  } catch (error) {
    console.error("Error saving document:", error);
  }
};

const main = async () => {
  const rssUrl = "https://filecoinfoundation.medium.com/feed";
  try {
    const url = new URL(rssUrl);
    const domain = url.hostname;
    console.log("Domain:", domain);
    const rssItems = await fetchRssData(rssUrl);
    await createDocument(rssItems, domain);
  } catch (error) {
    console.error("Error processing RSS:", error);
  }
};

main();
