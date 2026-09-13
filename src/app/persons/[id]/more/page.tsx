"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Person } from "@/types";

export default function PersonMorePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/persons/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setPerson(null);
          toast.error("Pessoa não encontrada");
        } else {
          setPerson(data);
        }
      })
      .catch(() => {
        setPerson(null);
        toast.error("Erro ao carregar dados");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    await fetch(`/api/persons/${id}`, { method: "DELETE" });
    toast.success("Pessoa excluída com sucesso");
    router.push("/persons");
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (!person) return null;

  return (
    <div className="detail-page">
      <h1 className="detail-name">{person.name}</h1>

      {/* Ações */}
      <div className="detail-center-actions">
        <Link href={`/persons/${id}/edit`} className="btn-edit">
          Editar
        </Link>
        <button className="btn-delete-small" onClick={() => setShowConfirm(true)}>
          Excluir
        </button>
      </div>

      {/* Card com dados básicos */}
      <div className="info-card">
        <div className="info-card-row">
          <span className="info-card-label">Idade:</span>
          <span className="info-card-value">{person.age ? `${person.age} anos` : "—"}</span>
        </div>
        <div className="info-card-row">
          <span className="info-card-label">Gênero:</span>
          <span className="info-card-value">{person.gender || "—"}</span>
        </div>
        <div className="info-card-row">
          <span className="info-card-label">Cidade Natal:</span>
          <span className="info-card-value">{person.hometown || "—"}</span>
        </div>
      </div>

      {/* Seção História */}
      <div className="info-section">
        <span className="info-section-label">História:</span>
        <p className="info-section-value">{person.story || ""}</p>
      </div>

      {/* Seção Contatos */}
      <div className="info-section">
        <span className="info-section-label">Contatos:</span>
        <p className="info-section-value">{person.contacts || ""}</p>
      </div>

      {showConfirm && (
        <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p>Tem certeza que deseja excluir esta pessoa e todos os seus encontros?</p>
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
