"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { EncounterForm } from "@/components/EncounterForm";
import { Person, Encounter, EncounterCreate } from "@/types";
import { apiFetch, errorMessage, jsonRequest } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import { LoadingState } from "@/components/LoadingState";
import { LoadErrorState, StateMessage } from "@/components/StateMessage";

export default function EditEncounterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const encounter = useResource<Encounter>(`/api/encounters/${id}`);
  const persons = useResource<Person[]>("/api/persons");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reloadAll = () => {
    encounter.reload();
    persons.reload();
  };

  const handleSubmit = async (data: EncounterCreate) => {
    setIsSubmitting(true);

    try {
      await apiFetch(`/api/encounters/${id}`, jsonRequest("PUT", data));
      toast.success("Encontro atualizado com sucesso");
      router.push(`/encounters/${id}`);
    } catch (error) {
      toast.error(errorMessage(error, "Erro ao atualizar encontro"));
      setIsSubmitting(false);
    }
  };

  if (encounter.resource.status === "notFound") {
    return (
      <StateMessage
        title="Encontro não encontrado"
        description="Ele pode ter sido excluído."
        actionLabel="Ver encontros"
        actionHref="/encounters"
      />
    );
  }

  if (
    encounter.resource.status === "loading" ||
    persons.resource.status === "loading"
  ) {
    return <LoadingState />;
  }

  if (
    encounter.resource.status !== "ready" ||
    persons.resource.status !== "ready"
  ) {
    return <LoadErrorState onRetry={reloadAll} />;
  }

  return (
    <EncounterForm
      encounter={encounter.resource.data}
      persons={persons.resource.data}
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
    />
  );
}
