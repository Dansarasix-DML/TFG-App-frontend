export async function handler(req, { params }) {
  const response = await fetch(
    `https://gameverse-api-mx1g.onrender.com/api/${params.path.join("/")}`,
    {
      method: req.method,
      headers: {
        "Authorization": req.headers.get("authorization") || "",
        "Content-Type": req.headers.get("content-type") || "",
      },
      body: req.method !== "GET" && req.method !== "DELETE"
        ? req.body
        : undefined,
    }
  );

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
