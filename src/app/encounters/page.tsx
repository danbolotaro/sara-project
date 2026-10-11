"use client";

import Link from "next/link";
import { EncounterWithPerson } from "@/types";
import { useResource } from "@/lib/useResource";
import { EncontroCard } from "@/components/EncontroCard";
import { LoadingState } from "@/components/LoadingState";
import { LoadErrorState, StateMessage } from "@/components/StateMessage";

export default function EncountersPage() {
  const { resource, reload } =
    useResource<EncounterWithPerson[]>("/api/encounters");

  if (resource.status === "loading") return <LoadingState />;
  if (resource.status !== "ready") return <LoadErrorState onRetry={reload} />;

  const encounters = resource.data;

  return (
    <>
      <h1 className="page-title">Encontros</h1>

      {encounters.length === 0 && (
        <StateMessage
          title="Nenhum encontro cadastrado"
          description="Registre o primeiro encontro para começar."
        />
      )}

      <div className="card-list">
        {encounters.map((encounter) => (
          <EncontroCard key={encounter.id} encounter={encounter} />
        ))}
      </div>

      <Link href="/encounters/new" className="register-bar">
        <span>Cadastrar novo encontro</span>
        <span className="register-bar-icon" aria-hidden="true">+</span>
      </Link>
    </>
  );
}
