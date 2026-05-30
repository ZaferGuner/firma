import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Base64url to Uint8Array decoder for edge runtime
 */
function base64urlToBytes(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Cryptographic Edge-compatible JWT/Session Verification
 */
async function verifyEdgeToken(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }
    
    const [header, body, signature] = parts;
    const textToSign = `${header}.${body}`;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify", "sign"]
    );

    const signatureBytes = base64urlToBytes(signature);
    const dataBytes = encoder.encode(textToSign);

    // Verify HMAC-SHA256 signature
    const isValid = await crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      signatureBytes as any,
      dataBytes as any
    );

    if (!isValid) {
      return false;
    }

    // Parse payload details
    const payloadStr = atob(body.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadStr);

    // Check expiration timestamp
    if (Date.now() >= payload.exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 1. Bypass authentication check specifically for the login API route
  if (pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const tokenCookie = request.cookies.get("admin_session")?.value;
  const loginUrl = new URL("/admin/login", request.url);
  const isApi = pathname.startsWith("/api/");

  if (!tokenCookie) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized Session Missing" }, { status: 401 });
    }
    return NextResponse.redirect(loginUrl);
  }

  // Read environment variable secret key
  const secretKey = process.env.AUTH_SECRET || "fallback_auth_secret_if_undefined_dev";

  const isValid = await verifyEdgeToken(tokenCookie, secretKey);
  if (!isValid) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized Token Compromised or Expired" }, { status: 401 });
    }
    const response = NextResponse.redirect(loginUrl);
    // Flush invalid session cookie
    response.cookies.delete("admin_session");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/edit/:path*",
    "/admin/inquiries/:path*",
    "/admin/inquiries",
    "/admin/settings/:path*",
    "/admin/settings",
    "/api/admin/:path*",
  ],
};
