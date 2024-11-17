import { updateString } from "./daClient";
import data from "../filecoinfoundation.medium.com2024-11-16T21:11:21.093Z.json";

export async function pushData() {
  if (!data || !Array.isArray(data)) {
    console.error("Data is not an array or is empty:", data);
    return;
  }

  const dataArray = [];
  for (const item of data) {
    try {
      const itemJSON = JSON.stringify({
        title: item.title,
        content: item.content,
      });
      const sizeInKB = (itemJSON.length / 1024).toFixed(2);
      console.log(`Item size: ${sizeInKB} KB`);

      dataArray.push(itemJSON);
    } catch (error) {
      console.error("Error processing item:", error);
    }
  }
  await updateString(dataArray);
}

pushData().catch(console.error);
