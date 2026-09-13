"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { EncounterForm } from "@/components/EncounterForm";
import { Person, Encounter, EncounterCreate } from "@/types";

export default function EditEncounterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/encounters/${id}`).then((r) => r.json()),
      fetch("/api/persons").then((r) => r.json()),
    ])
      .then(([encounterData, personsData]) => {
        if (encounterData.error) {
          setEncounter(null);
          toast.error("Encontro não encontrado");
        } else {
          setEncounter(encounterData);
        }
        setPersons(Array.isArray(personsData) ? personsData : []);
      })
      .catch(() => {
        setEncounter(null);
        toast.error("Erro ao carregar dados");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: EncounterCreate) => {
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/encounters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao atualizar encontro");
      }

      toast.success("Encontro atualizado com sucesso");
      router.push(`/encounters/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar");
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (!encounter) return null;

  return (
    <EncounterForm
      encounter={encounter}
      persons={persons}
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
    />
  );
}
