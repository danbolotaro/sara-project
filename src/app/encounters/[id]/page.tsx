"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { EncounterWithPerson } from "@/types";
import { formatDate } from "@/lib/utils";

export default function EncounterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [encounter, setEncounter] = useState<EncounterWithPerson | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/encounters/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setEncounter(null);
          toast.error("Encontro não encontrado");
        } else {
          setEncounter(data);
        }
      })
      .catch(() => {
        setEncounter(null);
        toast.error("Erro ao carregar dados");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    await fetch(`/api/encounters/${id}`, { method: "DELETE" });
    toast.success("Encontro excluído com sucesso");
    router.push("/encounters");
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (!encounter) return null;

  return (
    <div className="detail-page">
      {/* Nome da pessoa clicável */}
      <Link href={`/persons/${encounter.person_id}`} className="person-link" style={{ display: "block" }}>
        {encounter.person?.name}
      </Link>

      {/* Ações */}
      <div className="detail-center-actions">
        <Link href={`/encounters/${id}/edit`} className="btn-edit">
          Editar
        </Link>
        <button className="btn-delete-small" onClick={() => setShowConfirm(true)}>
          Excluir
        </button>
      </div>

      {/* Card com data e local */}
      <div className="info-card">
        <div className="info-card-row">
          <span className="info-card-label">Data:</span>
          <span className="info-card-value">{formatDate(encounter.date)}</span>
        </div>
        <div className="info-card-row">
          <span className="info-card-label">Local:</span>
          <span className="info-card-value">{encounter.location || "—"}</span>
        </div>
      </div>

      {/* Seção Pedido de Oração */}
      <div className="info-section">
        <span className="info-section-label">Pedido de Oração:</span>
        <p className="info-section-value">{encounter.prayer_request || ""}</p>
      </div>

      {/* Seção Informações */}
      <div className="info-section">
        <span className="info-section-label">Informações:</span>
        <p className="info-section-value">{encounter.notes || ""}</p>
      </div>

      {showConfirm && (
        <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p>Tem certeza que deseja excluir este encontro?</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowConfirm(false)} disabled={deleting}>
                Cancelar
              </button>
              <button className="btn-confirm-delete" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
