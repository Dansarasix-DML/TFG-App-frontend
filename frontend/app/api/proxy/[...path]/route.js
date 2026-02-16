const BACKEND_URL = "https://gameverse-api-mx1g.onrender.com/api";

async function handler(req, { params }) {
  const url = `${BACKEND_URL}/${params.path.join("/")}`;

  const response = await fetch(url, {
    method: req.method,
    headers: {
      authorization: req.headers.get("authorization") || "",
      // 🔥 NO fuerces content-type aquí
    },
    body: req.body, // 🔥 PASAR STREAM DIRECTO
    duplex: "half", // 🔥 obligatorio en Node 18+ para streams
  });

  const data = await response.arrayBuffer();

  return new Response(data, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/json",
    },
  });
}

export { handler as GET };
export { handler as POST };
export { handler as PUT };
export { handler as PATCH };
export { handler as DELETE };
