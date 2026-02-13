export class Api {
    static baseUrl = process.env.DB_HOST + "/api";

    static async post(url, data, jwt) {
        const res = await fetch(`${Api.baseUrl}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": jwt ? `Bearer ${jwt}` : ""
            },
            body: data instanceof FormData ? data : JSON.stringify(data),
        });

        const dataRes = await res.json();

        return {
            statusCode: res.status,
            data: dataRes,
        };
    }

    static async postFiles(url, data, jwt) {
        const res = await fetch(`${Api.baseUrl}${url}`, {
            method: "POST",
            headers: {
                "Authorization": jwt ? `Bearer ${jwt}` : ""
                // No establezcas manualmente 'Content-Type' para FormData
            },
            body: data, // Aquí usamos 'data' directamente sin JSON.stringify
        });
    
        const dataRes = await res.json();
    
        return {
            statusCode: res.status,
            data: dataRes,
        };
    }

    static async delete(url, jwt) {
        const res = await fetch(`${Api.baseUrl}${url}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": jwt ? `Bearer ${jwt}` : ""
            }
        });

        const dataRes = await res.json();

        return {
            statusCode: res.status,
            data: dataRes,
        };
    }
}