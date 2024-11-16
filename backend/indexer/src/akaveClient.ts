import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const API_URL = "http://localhost:8000";

// Add type for API error
interface ApiError {
  response?: {
    data: any;
  };
  message: string;
}

async function apiRequest(method: string, endpoint: string, data: any = null) {
  try {
    const response = await axios({
      method,
      url: `${API_URL}${endpoint}`,
      data,
    });
    console.log(response.data);
  } catch (error) {
    console.error(
      (error as ApiError)?.response?.data || (error as ApiError).message
    );
    throw error;
  }
}

async function uploadFile(
  bucketName: string,
  jsonData: object,
  fileName: string
) {
  const form = new FormData();
  // Convert JSON to string and create a Buffer
  const jsonBuffer = Buffer.from(JSON.stringify(jsonData));
  form.append("file", jsonBuffer, `${fileName}.json`);
  fs.writeFileSync(`./${fileName}.json`, jsonBuffer);
  try {
    const response = await axios.post(
      `${API_URL}/buckets/${bucketName}/files`,
      form,
      {
        headers: form.getHeaders(),
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error(
      (error as ApiError)?.response?.data || (error as ApiError).message
    );
    throw error;
  }
}

async function downloadFile(
  bucketName: string,
  fileName: string,
  outputDir: string
) {
  try {
    const response = await axios.get(
      `${API_URL}/buckets/${bucketName}/files/${fileName}/download`,
      {
        responseType: "blob",
      }
    );
    console.log(`File downloaded: ${fileName}`);
    fs.writeFileSync(`./${outputDir}/${fileName}`, response.data);
  } catch (error) {
    console.error(
      (error as ApiError)?.response?.data || (error as ApiError).message
    );
    throw error;
  }
}

export { apiRequest, uploadFile, downloadFile };
