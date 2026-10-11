"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Person, PersonCreate } from "@/types";

interface PersonFormProps {
  person?: Person;
  onSubmit: (data: PersonCreate) => Promise<void>;
  isLoading: boolean;
}

const GENDER_OPTIONS = ["Masculino", "Feminino"];

export function PersonForm({ person, onSubmit, isLoading }: PersonFormProps) {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(person?.name || "");
  const [gender, setGender] = useState(person?.gender || "");
  const [age, setAge] = useState(person?.age?.toString() || "");
  const [hometown, setHometown] = useState(person?.hometown || "");
  const [story, setStory] = useState(person?.story || "");
  const [contacts, setContacts] = useState(person?.contacts || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Nome é obrigatório");
      nameRef.current?.focus();
      return;
    }

    setError("");

    await onSubmit({
      name: name.trim(),
      gender: gender || undefined,
      age: age ? parseInt(age) : undefined,
      hometown: hometown.trim() || undefined,
      story: story.trim() || undefined,
      contacts: contacts.trim() || undefined,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h1 className="page-title">{person ? "Editar pessoa" : "Nova pessoa"}</h1>
      <p className="form-hint">
        <span className="form-required" aria-hidden="true">*</span> Campo obrigatório
      </p>

      <div className="form-group">
        <label className="form-label" htmlFor="person-name">
          Nome <span className="form-required" aria-hidden="true">*</span>
        </label>
        <input
          ref={nameRef}
          id="person-name"
          type="text"
          className="form-input"
          value={name}
          aria-required="true"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "person-name-error" : undefined}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
        />
        {error && (
          <span id="person-name-error" className="form-error" role="alert">
            {error}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="person-gender">Gênero</label>
        <select
          id="person-gender"
          className="form-select"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Selecione</option>
          {GENDER_OPTIONS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="person-age">Idade</label>
        <input
          id="person-age"
          type="number"
          inputMode="numeric"
          className="form-input"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="person-hometown">Cidade Natal</label>
        <input
          id="person-hometown"
          type="text"
          className="form-input"
          value={hometown}
          onChange={(e) => setHometown(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="person-story">História</label>
        <textarea
          id="person-story"
          className="form-textarea"
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="person-contacts">Contatos de Família/Amigos</label>
        <textarea
          id="person-contacts"
          className="form-textarea"
          value={contacts}
          onChange={(e) => setContacts(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => router.push("/persons")}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Salvando..." : person ? "Salvar" : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
