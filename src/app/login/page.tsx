import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Entrar - SARA",
};

function resolveRedirect(from: string | string[] | undefined): string {
  if (typeof from !== "string") return "/persons";
  if (!from.startsWith("/")) return "/persons";
  if (from.startsWith("//") || from.startsWith("/\\")) return "/persons";
  return from;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string | string[] }>;
}) {
  const { from } = await searchParams;

  return <LoginForm redirectTo={resolveRedirect(from)} />;
}
