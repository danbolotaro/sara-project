import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const SESSION_COOKIE = "sara_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const digestA = createHash("sha256").update(a).digest();
  const digestB = createHash("sha256").update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.APP_PASSWORD && process.env.SESSION_SECRET);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.APP_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

export function createSessionToken(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET não configurado");
  const expiresAt = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expiresAt}.${sign(expiresAt, secret)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  const secret = process.env.SESSION_SECRET;
  if (!secret || !token) return false;

  const [expiresAt, signature, ...rest] = token.split(".");
  if (!expiresAt || !signature || rest.length > 0) return false;
  if (!safeEqual(signature, sign(expiresAt, secret))) return false;

  const expiration = Number(expiresAt);
  return Number.isFinite(expiration) && expiration > Date.now();
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
}
