"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PersonForm } from "@/components/PersonForm";
import { PersonCreate } from "@/types";

export default function NewPersonPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PersonCreate) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao cadastrar pessoa");
      }

      const person = await res.json();
      toast.success("Pessoa cadastrada com sucesso");
      router.push(`/persons/${person.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cadastrar");
      setIsLoading(false);
    }
  };

  return (
    <PersonForm onSubmit={handleSubmit} isLoading={isLoading} />
  );
}
