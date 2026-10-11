"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PersonForm } from "@/components/PersonForm";
import { Person, PersonCreate } from "@/types";
import { apiFetch, errorMessage, jsonRequest } from "@/lib/api";
import { useResource } from "@/lib/useResource";
import { LoadingState } from "@/components/LoadingState";
import { LoadErrorState, StateMessage } from "@/components/StateMessage";

export default function EditPersonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { resource, reload } = useResource<Person>(`/api/persons/${id}`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: PersonCreate) => {
    setIsSubmitting(true);

    try {
      await apiFetch(`/api/persons/${id}`, jsonRequest("PUT", data));
      toast.success("Pessoa atualizada com sucesso");
      router.push(`/persons/${id}`);
    } catch (error) {
      toast.error(errorMessage(error, "Erro ao atualizar pessoa"));
      setIsSubmitting(false);
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

  return (
    <PersonForm
      person={resource.data}
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
    />
  );
}
