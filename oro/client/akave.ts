import { Request } from "@/utils/akave";

export const getNews = async (domain: string) => {
    const requestList: string[] = [];
    const responseList: any[] = [];

    // İlk istek: Dosya listesini al
    const response = await Request(`/buckets/${domain}/files`);
    response.data.map((data: any) => {
        requestList.push(`/buckets/${domain}/files/${data["Name"]}/download`);
    });

    // Paralel olarak tüm istekleri at
    try {
        const responses = await Promise.all(
            requestList.map((url) => Request(url)) // Tüm URL'lere istek at
        );

        // Yanıtları responseList'e ekle
        responses.forEach((response) => {
            responseList.push(response);
        });
        
        return responseList;
    } catch (error) {
        console.error("Bir istek başarısız oldu:", error);
    }

    return responseList;
};