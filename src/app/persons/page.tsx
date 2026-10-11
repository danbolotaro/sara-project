"use client";

import Link from "next/link";
import { Person } from "@/types";
import { useResource } from "@/lib/useResource";
import { PessoaCard } from "@/components/PessoaCard";
import { LoadingState } from "@/components/LoadingState";
import { LoadErrorState, StateMessage } from "@/components/StateMessage";

export default function PersonsPage() {
  const { resource, reload } = useResource<Person[]>("/api/persons");

  if (resource.status === "loading") return <LoadingState />;
  if (resource.status !== "ready") return <LoadErrorState onRetry={reload} />;

  const persons = resource.data;

  return (
    <>
      <h1 className="page-title">Pessoas</h1>

      {persons.length === 0 && (
        <StateMessage
          title="Nenhuma pessoa cadastrada"
          description="Cadastre a primeira pessoa para começar."
        />
      )}

      <div className="card-list">
        {persons.map((person) => (
          <PessoaCard key={person.id} person={person} />
        ))}
      </div>

      <Link href="/persons/new" className="register-bar">
        <span>Cadastrar nova pessoa</span>
        <span className="register-bar-icon" aria-hidden="true">+</span>
      </Link>
    </>
  );
}
