import Parser from "rss-parser";
import fs from "fs/promises";

type CustomFeed = Parser.Output<{
  "content:encoded"?: string;
}>;

const parser = new Parser<CustomFeed>();

// HTML etiketlerini temizler
const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, "");
};

// HTML içinden görsel URL'lerini çeker
const extractImageUrls = (html: string): string[] => {
  const imgTags = html.match(/<img[^>]+src="([^">]+)"/g) || [];
  return imgTags.map((imgTag) => {
    const match = imgTag.match(/src="([^">]+)"/);
    return match ? match[1] : "";
  });
};

export const fetchRssData = async (rssUrl: string, outputFilePath?: string) => {
  try {
    const feed = await parser.parseURL(rssUrl);
    const items = feed.items.map((item) => {
      const contentHtml = item["content:encoded"] || item.content || "";
      const images = extractImageUrls(contentHtml);

      return {
        title: item.title || null,
        description: stripHtmlTags(item.contentSnippet || item.content || ""),
        content: stripHtmlTags(contentHtml),
        link: item.link || null,
        pubDate: item.pubDate || null,
        images, // Görsel URL'leri listesi
      };
    });

    // Eğer bir dosya yolu sağlanmışsa, JSON olarak kaydet
    if (outputFilePath) {
      await fs.writeFile(outputFilePath, JSON.stringify(items, null, 2), "utf-8");
      console.log(`RSS data has been saved to ${outputFilePath}`);
    }

    return items;
  } catch (error) {
    console.error("Error fetching RSS data:", error);
    throw error;
  }
};