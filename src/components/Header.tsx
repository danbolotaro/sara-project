"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const isPersons = pathname.startsWith("/persons");
  const isEncounters = pathname.startsWith("/encounters");

  return (
    <header className="header">
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
    </header>
  );
}
