import { NextResponse } from "next/server";

const allowedOrigins = [
  "www.businesscard.naseemahmad.com/",
  "www.businesscard.naseemahmad.com/",
  "www.naseemahmad.com",
  "http://localhost:5173",
];

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

export async function GET(req) {
  const origin = req.headers.get("origin");
  const headers = new Headers();

  if (allowedOrigins.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  const WORKSPACE = "naseem-ahmads-team-1472";   // ✅ Corrected
  const COUNTER = "first-counter-1472";          // ✅ Corrected
  const API_KEY = process.env.COUNTERAPI_KEY;    // (if you created one)

  try {
    const res = await fetch(
      `https://api.counterapi.dev/v2/${WORKSPACE}/${COUNTER}/up`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }), // optional
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("CounterAPI error:", data);
      return new NextResponse(JSON.stringify({ error: data.message }), {
        headers,
        status: res.status,
      });
    }

    const count = data?.data?.up_count ?? 0;
    return new NextResponse(JSON.stringify({ count }), {
      headers,
      status: 200,
    });
  } catch (err) {
    console.error("Visitor counter error:", err);
    return new NextResponse(JSON.stringify({ error: err.message }), {
      headers,
      status: 500,
    });
  }
}
