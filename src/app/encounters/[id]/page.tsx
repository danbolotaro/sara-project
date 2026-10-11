"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { EncounterWithPerson } from "@/types";
import { formatDate } from "@/lib/utils";
import { apiFetch, errorMessage } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { InfoSection } from "@/components/InfoSection";
import { LoadingState } from "@/components/LoadingState";
import { LoadErrorState, StateMessage } from "@/components/StateMessage";

export default function EncounterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { resource, reload } = useResource<EncounterWithPerson>(
    `/api/encounters/${id}`
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await apiFetch(`/api/encounters/${id}`, { method: "DELETE" });
      toast.success("Encontro excluído com sucesso");
      router.push("/encounters");
    } catch (error) {
      toast.error(errorMessage(error, "Erro ao excluir encontro"));
      setDeleting(false);
    }
  };

  if (resource.status === "loading") return <LoadingState />;

  if (resource.status === "notFound") {
    return (
      <StateMessage
        title="Encontro não encontrado"
        description="Ele pode ter sido excluído."
        actionLabel="Ver encontros"
        actionHref="/encounters"
      />
    );
  }

  if (resource.status !== "ready") return <LoadErrorState onRetry={reload} />;

  const encounter = resource.data;

  return (
    <div className="detail-page">
      <Link href={`/persons/${encounter.person_id}`} className="person-link">
        {encounter.person?.name}
      </Link>

      <div className="detail-center-actions">
        <Link href={`/encounters/${id}/edit`} className="btn btn-secondary btn-compact">
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
          <span className="info-card-label">Data</span>
          <span className="info-card-value">{formatDate(encounter.date)}</span>
        </div>
        <div className="info-card-row">
          <span className="info-card-label">Local</span>
          <span className="info-card-value">{encounter.location || "—"}</span>
        </div>
      </div>

      <InfoSection label="Pedido de Oração" value={encounter.prayer_request} />
      <InfoSection label="Informações" value={encounter.notes} />
      <InfoSection label="Contatos" value={encounter.contacts} />

      <ConfirmDialog
        open={showConfirm}
        message="Tem certeza que deseja excluir este encontro?"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
