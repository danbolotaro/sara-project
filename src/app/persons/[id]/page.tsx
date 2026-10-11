"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Person, EncounterWithPerson } from "@/types";
import { formatDate } from "@/lib/utils";
import { useResource } from "@/lib/useResource";
import { EncontroCard } from "@/components/EncontroCard";
import { LoadingState } from "@/components/LoadingState";
import { LoadErrorState, StateMessage } from "@/components/StateMessage";

export default function PersonDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const person = useResource<Person>(`/api/persons/${id}`);
  const encounters = useResource<EncounterWithPerson[]>(
    `/api/encounters?person_id=${id}`
  );

  const reloadAll = () => {
    person.reload();
    encounters.reload();
  };

  if (person.resource.status === "notFound") {
    return (
      <StateMessage
        title="Pessoa não encontrada"
        description="Ela pode ter sido excluída."
        actionLabel="Ver pessoas"
        actionHref="/persons"
      />
    );
  }

  if (
    person.resource.status === "loading" ||
    encounters.resource.status === "loading"
  ) {
    return <LoadingState />;
  }

  if (
    person.resource.status !== "ready" ||
    encounters.resource.status !== "ready"
  ) {
    return <LoadErrorState onRetry={reloadAll} />;
  }

  const personData = person.resource.data;
  const encounterList = encounters.resource.data;
  const lastEncounter = encounterList.length > 0 ? encounterList[0] : null;

  return (
    <div className="detail-page">
      <h1 className="detail-name">{personData.name}</h1>

      <div className="detail-header-row">
        <div className="detail-header-info">
          <p className="detail-info">
            <span className="detail-info-label">Idade:</span>{" "}
            {personData.age ? `${personData.age} Anos` : "—"}
          </p>
          <p className="detail-info">
            <span className="detail-info-label">Gênero:</span>{" "}
            {personData.gender || "—"}
          </p>
        </div>
        <Link href={`/persons/${id}/more`} className="btn btn-secondary btn-compact">
          Mais
        </Link>
      </div>

      {lastEncounter && (
        <div className="highlight-card">
          <div className="highlight-row">
            <span className="highlight-label">Último encontro</span>
            <span className="highlight-value">{formatDate(lastEncounter.date)}</span>
          </div>
          <div className="highlight-row">
            <span className="highlight-label">Local</span>
            <span className="highlight-value">{lastEncounter.location || "—"}</span>
          </div>
        </div>
      )}

      <h2 className="section-title">Encontros</h2>

      {encounterList.length === 0 && (
        <StateMessage title="Nenhum encontro registrado" />
      )}

      <div className="card-list">
        {encounterList.map((encounter) => (
          <EncontroCard key={encounter.id} encounter={encounter} showPerson={false} />
        ))}
      </div>
    </div>
  );
}
