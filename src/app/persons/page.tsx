"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Person } from "@/types";
import { PessoaCard } from "@/components/PessoaCard";

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/persons")
      .then((res) => res.json())
      .then((data) => setPersons(data))
      .catch(() => {
        setPersons([]);
        toast.error("Erro ao carregar pessoas");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {loading && <div className="loading">Carregando...</div>}

      {!loading && persons.length === 0 && (
        <Link href="/persons/new" className="register-bar">
          <span>Cadastrar nova pessoa</span>
          <span className="register-bar-icon">+</span>
        </Link>
      )}

      {!loading && persons.length > 0 && (
        <>
          {persons.map((person) => (
            <PessoaCard key={person.id} person={person} />
          ))}
          <Link href="/persons/new" className="register-bar">
            <span>Cadastrar nova pessoa</span>
            <span className="register-bar-icon">+</span>
          </Link>
        </>
      )}
    </>
  );
}
