import axios from "axios";

export const getNews = async () => {
    const res = axios.get("https://jsonplaceholder.typicode.com/posts");
    return (await res).data;
}
