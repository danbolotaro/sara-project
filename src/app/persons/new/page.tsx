"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PersonForm } from "@/components/PersonForm";
import { Person, PersonCreate } from "@/types";
import { apiFetch, errorMessage, jsonRequest } from "@/lib/api";

export default function NewPersonPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PersonCreate) => {
    setIsLoading(true);

    try {
      const person = await apiFetch<Person>(
        "/api/persons",
        jsonRequest("POST", data)
      );
      toast.success("Pessoa cadastrada com sucesso");
      router.push(`/persons/${person.id}`);
    } catch (error) {
      toast.error(errorMessage(error, "Erro ao cadastrar pessoa"));
      setIsLoading(false);
    }
  };

  return (
    <PersonForm onSubmit={handleSubmit} isLoading={isLoading} />
  );
}
