"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { EncounterForm } from "@/components/EncounterForm";
import { Person, Encounter, EncounterCreate } from "@/types";
import { apiFetch, errorMessage, jsonRequest } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import { LoadingState } from "@/components/LoadingState";
import { LoadErrorState, StateMessage } from "@/components/StateMessage";

export default function NewEncounterPage() {
  const router = useRouter();
  const { resource, reload } = useResource<Person[]>("/api/persons");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: EncounterCreate) => {
    setIsSubmitting(true);

    try {
      const encounter = await apiFetch<Encounter>(
        "/api/encounters",
        jsonRequest("POST", data)
      );
      toast.success("Encontro cadastrado com sucesso");
      router.push(`/encounters/${encounter.id}`);
    } catch (error) {
      toast.error(errorMessage(error, "Erro ao cadastrar encontro"));
      setIsSubmitting(false);
    }
  };

  if (resource.status === "loading") return <LoadingState />;
  if (resource.status !== "ready") return <LoadErrorState onRetry={reload} />;

  if (resource.data.length === 0) {
    return (
      <StateMessage
        title="Nenhuma pessoa cadastrada"
        description="Cadastre uma pessoa antes de registrar um encontro."
        actionLabel="Cadastrar pessoa"
        actionHref="/persons/new"
      />
    );
  }

  return (
    <EncounterForm
      persons={resource.data}
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
    />
  );
}
