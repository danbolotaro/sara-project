"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Person } from "@/types";
import { apiFetch, errorMessage } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { InfoSection } from "@/components/InfoSection";
import { LoadingState } from "@/components/LoadingState";
import { LoadErrorState, StateMessage } from "@/components/StateMessage";

export default function PersonMorePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { resource, reload } = useResource<Person>(`/api/persons/${id}`);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await apiFetch(`/api/persons/${id}`, { method: "DELETE" });
      toast.success("Pessoa excluída com sucesso");
      router.push("/persons");
    } catch (error) {
      toast.error(errorMessage(error, "Erro ao excluir pessoa"));
      setDeleting(false);
    }
  };

  if (resource.status === "loading") return <LoadingState />;

  if (resource.status === "notFound") {
    return (
      <StateMessage
        title="Pessoa não encontrada"
        description="Ela pode ter sido excluída."
        actionLabel="Ver pessoas"
        actionHref="/persons"
      />
    );
  }

  if (resource.status !== "ready") return <LoadErrorState onRetry={reload} />;

  const person = resource.data;

  return (
    <div className="detail-page">
      <h1 className="detail-name">{person.name}</h1>

      <div className="detail-center-actions">
        <Link href={`/persons/${id}/edit`} className="btn btn-secondary btn-compact">
          Editar
        </Link>
        <button
          type="button"
          className="btn btn-danger-outline btn-compact"
          onClick={() => setShowConfirm(true)}
        >
          Excluir
        </button>
      </div>

      <div className="info-card">
        <div className="info-card-row">
          <span className="info-card-label">Idade</span>
          <span className="info-card-value">{person.age ? `${person.age} anos` : "—"}</span>
        </div>
        <div className="info-card-row">
          <span className="info-card-label">Gênero</span>
          <span className="info-card-value">{person.gender || "—"}</span>
        </div>
        <div className="info-card-row">
          <span className="info-card-label">Cidade Natal</span>
          <span className="info-card-value">{person.hometown || "—"}</span>
        </div>
      </div>

      <InfoSection label="História" value={person.story} />
      <InfoSection label="Contatos" value={person.contacts} />

      <ConfirmDialog
        open={showConfirm}
        message="Tem certeza que deseja excluir esta pessoa e todos os seus encontros?"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
