import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SARA - Sistema de Apoio e Registro de Acolhimento",
  description: "Aplicação para registro de pessoas e encontros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Header />
        <main className="page-content">
          {children}
        </main>
      </body>
    </html>
  );
}
