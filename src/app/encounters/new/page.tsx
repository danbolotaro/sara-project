"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { EncounterForm } from "@/components/EncounterForm";
import { Person, EncounterCreate } from "@/types";

export default function NewEncounterPage() {
  const router = useRouter();
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/persons")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setPersons(list);
        if (list.length === 0) {
          toast.error("Cadastre uma pessoa primeiro");
          router.push("/encounters");
        }
      })
      .catch(() => {
        setPersons([]);
        toast.error("Erro ao carregar pessoas");
        router.push("/encounters");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (data: EncounterCreate) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/encounters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao cadastrar encontro");
      }

      const encounter = await res.json();
      toast.success("Encontro cadastrado com sucesso");
      router.push(`/encounters/${encounter.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cadastrar");
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (persons.length === 0) return null;

  return (
    <EncounterForm
      persons={persons}
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
    />
  );
}
