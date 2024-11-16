import Parser from "rss-parser";
import fs from "fs";

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
    title: item.title || null,
    description: stripHtmlTags(item.contentSnippet || item.content || ""),
    content: stripHtmlTags(item["content:encoded"] || item.content || ""),
    link: item.link || null,
    pubDate: item.pubDate || null,
  }));

  return items;
};
