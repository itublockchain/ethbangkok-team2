import axios from "axios";
import { AKAVE_API_URL as API_BASE_URL } from "@/config";

async function Request(
    endpoint: string, // API endpoint'i (örn. /users)
  ): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`);
      return response.data;
    } catch (error: any) {
      console.error(error.response ? error.response.data : error.message);
    }
  }
  
  export { Request };