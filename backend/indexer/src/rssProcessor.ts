import Parser from "rss-parser";

type CustomFeed = Parser.Output<{
  "content:encoded"?: string;
}>;

const parser = new Parser<CustomFeed>();

const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, "");
};

export const fetchRssData = async (rssUrl: string) => {
  const feed = await parser.parseURL(rssUrl);
  const items = feed.items.map((item) => ({
    title: item.title || "No Title",
    description: stripHtmlTags(
      item.contentSnippet || item.content || "No Description"
    ),
    content: stripHtmlTags(
      item["content:encoded"] || item.content || "No Content"
    ),
    link: item.link || "No Link",
    pubDate: item.pubDate || "No Date",
  }));

  return items;
};
