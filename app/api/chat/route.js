import { NextResponse } from "next/server";

const allowedOrigins = [
  "https://www.naseemahmad.com", // your React site domain
];

export async function OPTIONS(req) {
  const origin = req.headers.get("origin");
  const response = new NextResponse(null, { status: 204 });

  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

export async function POST(req) {
  const origin = req.headers.get("origin");
  const headers = new Headers();

  if (allowedOrigins.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  try {
    const { message } = await req.json();

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await openaiRes.json();
    return new NextResponse(JSON.stringify({ reply: data.choices?.[0]?.message?.content || "No response" }), {
      headers,
      status: 200,
    });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: err.message }), { headers, status: 500 });
  }
}
