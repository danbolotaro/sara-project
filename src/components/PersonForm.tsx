"use client";

import { useState } from "react";
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
  const [name, setName] = useState(person?.name || "");
  const [gender, setGender] = useState(person?.gender || "");
  const [age, setAge] = useState(person?.age?.toString() || "");
  const [hometown, setHometown] = useState(person?.hometown || "");
  const [story, setStory] = useState(person?.story || "");
  const [contacts, setContacts] = useState(person?.contacts || "");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Nome é obrigatório");
      return;
    }

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
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="person-name">Nome:</label>
        <input
          id="person-name"
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error && <span className="form-error">{error}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="person-gender">Gênero:</label>
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
        <label className="form-label" htmlFor="person-age">Idade:</label>
        <input
          id="person-age"
          type="number"
          className="form-input"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="person-hometown">Cidade Natal:</label>
        <input
          id="person-hometown"
          type="text"
          className="form-input"
          value={hometown}
          onChange={(e) => setHometown(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="person-story">História:</label>
        <textarea
          id="person-story"
          className="form-textarea"
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="person-contacts">Contatos de Família/Amigos:</label>
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
          className="btn-form-cancel"
          onClick={() => router.push("/persons")}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-form-submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : person ? "Salvar" : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
