"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  if (pathname === "/login") return null;

  const isPersons = pathname.startsWith("/persons");
  const isEncounters = pathname.startsWith("/encounters");

  const handleLogout = async () => {
    setIsLeaving(true);

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error();
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Não foi possível sair");
      setIsLeaving(false);
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <span className="header-brand">SARA</span>
        <nav className="header-nav">
          <Link
            href="/persons"
            className={`header-link ${isPersons ? "active" : ""}`}
          >
            Pessoas
          </Link>
          <Link
            href="/encounters"
            className={`header-link ${isEncounters ? "active" : ""}`}
          >
            Encontros
          </Link>
        </nav>
        <button
          type="button"
          className="header-logout"
          onClick={handleLogout}
          disabled={isLeaving}
        >
          Sair
        </button>
      </div>
    </header>
  );
}
