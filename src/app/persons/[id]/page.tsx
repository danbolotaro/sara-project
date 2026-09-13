"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Person, EncounterWithPerson } from "@/types";
import { formatDate } from "@/lib/utils";

export default function PersonDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [person, setPerson] = useState<Person | null>(null);
  const [encounters, setEncounters] = useState<EncounterWithPerson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/persons/${id}`).then((r) => r.json()),
      fetch(`/api/encounters?person_id=${id}`).then((r) => r.json()),
    ])
      .then(([personData, encountersData]) => {
        if (personData.error) {
          setPerson(null);
          toast.error("Pessoa não encontrada");
        } else {
          setPerson(personData);
          setEncounters(Array.isArray(encountersData) ? encountersData : []);
        }
      })
      .catch(() => {
        setPerson(null);
        toast.error("Erro ao carregar dados");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Carregando...</div>;
  if (!person) return null;

  const lastEncounter = encounters.length > 0 ? encounters[0] : null;

  return (
    <div className="detail-page">
      <h1 className="detail-name">{person.name}</h1>

      <div className="detail-header-row">
        <div className="detail-header-info">
          <p className="detail-info">Idade: {person.age ? `${person.age} Anos` : "—"}</p>
          <p className="detail-info">Gênero: {person.gender || "—"}</p>
        </div>
        <div className="detail-header-actions">
          <Link href={`/persons/${id}/more`} className="btn-details">
            Mais
          </Link>
        </div>
      </div>

      {lastEncounter && (
        <div className="highlight-card">
          <div className="highlight-row">
            <span className="highlight-label">Último encontro:</span>
            <span className="highlight-value">{formatDate(lastEncounter.date)}</span>
          </div>
          <div className="highlight-row">
            <span className="highlight-label">Local:</span>
            <span className="highlight-value">{lastEncounter.location || "—"}</span>
          </div>
        </div>
      )}

      <h2 className="section-title">Encontros</h2>

      {encounters.length === 0 && (
        <div className="empty-state">Nenhum encontro registrado</div>
      )}

      {encounters.map((enc) => (
        <div key={enc.id} className="card">
          <div className="card-info">
            <span className="card-row">
              <span className="card-label">Data: </span>
              {formatDate(enc.date)}
            </span>
            <span className="card-row">
              <span className="card-label">Local: </span>
              {enc.location || "—"}
            </span>
          </div>
          <Link href={`/encounters/${enc.id}`} className="btn-details">
            Detalhes
          </Link>
        </div>
      ))}
    </div>
  );
}
