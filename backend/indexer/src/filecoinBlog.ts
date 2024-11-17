import axios from "axios";
import { parseStringPromise } from "xml2js";
import * as cheerio from "cheerio";
import { uploadFile } from "./akaveClient";
import { attest } from "../../sign/attest";

const RSS_FEED_URL = "https://filecoin.io/blog/feed/index.xml";

interface BlogItem {
  title: string;
  description: string;
  content: string;
  link: string;
  pubDate: string;
  images: string[];
}

const createDocument = async (data: object, name: string) => {
  try {
    await uploadFile(name, data, `${name + new Date().toISOString()}`);
  } catch (error) {
    console.error("Error saving document:", error);
  }
};

const fetchContentAndThumbnailFromPage = async (
  url: string
): Promise<{ content: string; thumbnail: string }> => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract thumbnail (OG image or first image)
    const thumbnail =
      $('meta[property="og:image"]').attr("content") ||
      $("img").first().attr("src") ||
      "";

    // Extract and clean the content (plaintext without HTML tags)
    const content =
      $(".blog-content").text() ||
      $("article").text() ||
      $("body").text() ||
      "";

    // Handle relative URLs for the thumbnail
    const resolvedThumbnail = thumbnail.startsWith("http")
      ? thumbnail
      : `${new URL(url).origin}${thumbnail}`;

    return {
      content: content.trim(),
      thumbnail: resolvedThumbnail,
    };
  } catch (error) {
    console.error(
      `Error fetching content and thumbnail for URL: ${url}`,
      error
    );
    return { content: "", thumbnail: "" }; // Fallback to empty values if error occurs
  }
};

const normalizeUrl = (url: string): string => {
  if (!url.startsWith("http")) {
    return `https://${url}`;
  }
  if (url.includes("https://https://")) {
    return url.replace("https://https://", "https://");
  }

  if (url.includes("https://filecoin.io")) {
    return url.replace("https://filecoin.io", "");
  }
  return url;
};

const fetchAndParseRSS = async (): Promise<BlogItem[]> => {
  try {
    const response = await axios.get(RSS_FEED_URL);
    const parsedData = await parseStringPromise(response.data, {
      explicitArray: false,
    });

    const items = parsedData.rss.channel.item;
    const itemArray = Array.isArray(items) ? items : [items];
    const first10Items = itemArray.slice(0, 1);

    const blogItems: BlogItem[] = await Promise.all(
      first10Items.map(async (item) => {
        const normalizedLink = normalizeUrl(item.link);
        const { content, thumbnail: images } =
          await fetchContentAndThumbnailFromPage(normalizedLink);

        return {
          title: item.title || "",
          description: item.description || "",
          content,
          link: normalizedLink,
          pubDate: item.pubDate || "",
          images: [images, images],
        };
      })
    );
    //await attest(blogItems, "filecoin_blog");

    await createDocument(blogItems, "filecoin_blog");
    return blogItems;
  } catch (error) {
    console.error("Error fetching or processing the RSS feed:", error);
    throw error;
  }
};

fetchAndParseRSS();
