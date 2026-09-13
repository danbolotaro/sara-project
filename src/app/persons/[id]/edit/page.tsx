"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PersonForm } from "@/components/PersonForm";
import { Person, PersonCreate } from "@/types";

export default function EditPersonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (data: PersonCreate) => {
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/persons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao atualizar pessoa");
      }

      toast.success("Pessoa atualizada com sucesso");
      router.push(`/persons/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar");
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (!person) return null;

  return (
    <PersonForm
      person={person}
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
    />
  );
}
