import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  checkPassword,
  createSessionToken,
  isAuthConfigured,
  sessionCookieOptions,
} from "@/lib/session";

export async function POST(request: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: "Autenticação não configurada no servidor" },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!password) {
    return NextResponse.json({ error: "Informe a senha" }, { status: 400 });
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    SESSION_COOKIE,
    createSessionToken(),
    sessionCookieOptions()
  );
  return response;
}
