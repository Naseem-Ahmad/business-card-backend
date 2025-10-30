import { NextResponse } from "next/server";

const allowedOrigins = [
  "https://www.naseemahmad.com",
  "http://localhost:3000",
];

// Handle preflight (CORS)
export async function OPTIONS(req) {
  const origin = req.headers.get("origin");
  const response = new NextResponse(null, { status: 204 });

  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

// Handle GET request → increments visitor counter
export async function GET(req) {
  const origin = req.headers.get("origin");
  const headers = new Headers();

  if (allowedOrigins.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  const WORKSPACE = "Naseem Ahmad's Workspace"; // 🔹 Change this to your workspace name
  const COUNTER = "first-counter-1472";         // 🔹 Change this to your counter name
  const API_KEY = process.env.COUNTERAPI_KEY; // ✅ store in .env.local

  try {
    const response = await fetch(`https://api.counterapi.dev/v2/${WORKSPACE}/${COUNTER}/up`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Accept": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return new NextResponse(JSON.stringify({ error: data.error }), { headers, status: response.status });
    }

    // Return updated count
    return new NextResponse(JSON.stringify({ count: data.value }), { headers, status: 200 });
  } catch (err) {
    console.error("Visitor counter error:", err);
    return new NextResponse(JSON.stringify({ error: err.message }), { headers, status: 500 });
  }
}
