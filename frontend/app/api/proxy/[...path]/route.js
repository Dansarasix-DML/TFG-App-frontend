const BACKEND_URL = "https://gameverse-api-mx1g.onrender.com/api";

async function handler(req, { params }) {
  const url = `${BACKEND_URL}/${params.path.join("/")}`;

  const headers = new Headers();
  
  const auth = req.headers.get("authorization");
  if (auth) headers.set("Authorization", auth);

  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  let body;

  if (req.method !== "GET" && req.method !== "DELETE") {
    if (contentType?.includes("application/json")) {
      body = JSON.stringify(await req.json());
    } else {
      body = await req.arrayBuffer(); // 🔥 clave para FormData
    }
  }

  const response = await fetch(url, {
    method: req.method,
    headers,
    body,
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export { handler as GET };
export { handler as POST };
export { handler as PUT };
export { handler as PATCH };
export { handler as DELETE };
