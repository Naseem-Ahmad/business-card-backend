import { NextResponse } from "next/server";

const allowedOrigins = [
  "https://www.naseemahmad.com",
  "http://localhost:3000",
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

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await res.json();

    // 🧠 Add this line to see what you’re getting from OpenAI
    console.log("OpenAI API response:", data);

    if (!res.ok) {
      return new NextResponse(JSON.stringify({ error: data.error }), { headers, status: res.status });
    }

    const reply = data?.choices?.[0]?.message?.content || "No response from model";
    return new NextResponse(JSON.stringify({ reply }), { headers, status: 200 });
  } catch (err) {
    console.error("Chat API error:", err);
    return new NextResponse(JSON.stringify({ error: err.message }), { headers, status: 500 });
  }
}
