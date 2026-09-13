"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { EncounterWithPerson } from "@/types";
import { EncontroCard } from "@/components/EncontroCard";

export default function EncountersPage() {
  const [encounters, setEncounters] = useState<EncounterWithPerson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/encounters")
      .then((res) => res.json())
      .then((data) => setEncounters(data))
      .catch(() => {
        setEncounters([]);
        toast.error("Erro ao carregar encontros");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {loading && <div className="loading">Carregando...</div>}

      {!loading && encounters.length === 0 && (
        <Link href="/encounters/new" className="register-bar">
          <span>Cadastrar novo encontro</span>
          <span className="register-bar-icon">+</span>
        </Link>
      )}

      {!loading && encounters.length > 0 && (
        <>
          {encounters.map((encounter) => (
            <EncontroCard key={encounter.id} encounter={encounter} />
          ))}
          <Link href="/encounters/new" className="register-bar">
            <span>Cadastrar novo encontro</span>
            <span className="register-bar-icon">+</span>
          </Link>
        </>
      )}
    </>
  );
}
