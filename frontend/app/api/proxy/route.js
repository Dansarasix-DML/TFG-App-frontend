
export async function POST(req, { params }) {
  const body = await req.text();

  const response = await fetch(
    `https://gameverse-api-mx1g.onrender.com/api/${params.path.join("/")}`,
    {
      method: "POST",
      headers: {
        "Content-Type": req.headers.get("content-type") || "application/json",
        "Authorization": req.headers.get("authorization") || "",
      },
      body
    }
  );

  return new Response(await response.text(), {
    status: response.status,
    headers: { "Content-Type": "application/json" }
  });
}
