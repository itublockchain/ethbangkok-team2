import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

// Define an interface for your news item
interface NewsItem {
  title: string;
  content: string;
  id?: number; // Optional in the source JSON
}

// Load and parse the JSON file dynamically
const newsFilePath = path.join(
  __dirname,
  "../indexer/filecoinfoundation.medium.com2024-11-16T12:58:04.572Z.json"
);

let newsData: NewsItem[] = JSON.parse(fs.readFileSync(newsFilePath, "utf8"));

// Add a unique ID to each item dynamically without overwriting
newsData = newsData.map((item, index) => ({
  id: index + 1, // Dynamically assign IDs
  ...item, // Spread other properties
}));

app.get("/", (req: any, res: any) => {
  console.log("req: ", req);
  return res.send("<h1>Hello World</h1>");
});

// Define a route to fetch content by ID
app.get("/:id", (req: any, res: any) => {
  const id = parseInt(req.params.id, 10);
  console.log("id: ", id);
  const newsItem = newsData.find((item) => item.id === id);
  console.log("newsItem: ", newsItem);

  if (!newsItem) {
    return res.status(404).send("<h1>404 - Content Not Found</h1>");
  }

  return res.send(`
    <html>
      <head>
        <title>${newsItem.title}</title>
      </head>
      <body>
        <h1>${newsItem.title}</h1>
        <p>${newsItem.content}</p>
      </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
