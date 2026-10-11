"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Person, Encounter, EncounterCreate } from "@/types";
import { toDateTimeLocalValue } from "@/lib/utils";

interface EncounterFormProps {
  encounter?: Encounter;
  persons: Person[];
  onSubmit: (data: EncounterCreate) => Promise<void>;
  isLoading: boolean;
}

type FieldErrors = { personId?: string; date?: string };

export function EncounterForm({
  encounter,
  persons,
  onSubmit,
  isLoading,
}: EncounterFormProps) {
  const router = useRouter();
  const personRef = useRef<HTMLSelectElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const [personId, setPersonId] = useState(encounter?.person_id || "");
  const [date, setDate] = useState(() =>
    encounter?.date
      ? encounter.date.slice(0, 16)
      : toDateTimeLocalValue(new Date())
  );
  const [location, setLocation] = useState(encounter?.location || "");
  const [prayerRequest, setPrayerRequest] = useState(
    encounter?.prayer_request || ""
  );
  const [notes, setNotes] = useState(encounter?.notes || "");
  const [contacts, setContacts] = useState(encounter?.contacts || "");
  const [errors, setErrors] = useState<FieldErrors>({});

  const clearError = (field: keyof FieldErrors) => {
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FieldErrors = {};

    if (!personId) newErrors.personId = "Selecione uma pessoa";
    if (!date) newErrors.date = "Data é obrigatória";

    if (newErrors.personId || newErrors.date) {
      setErrors(newErrors);
      if (newErrors.personId) personRef.current?.focus();
      else dateRef.current?.focus();
      return;
    }

    setErrors({});

    await onSubmit({
      person_id: personId,
      date: new Date(date).toISOString(),
      location: location.trim() || undefined,
      prayer_request: prayerRequest.trim() || undefined,
      notes: notes.trim() || undefined,
      contacts: contacts.trim() || undefined,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h1 className="page-title">{encounter ? "Editar encontro" : "Novo encontro"}</h1>
      <p className="form-hint">
        <span className="form-required" aria-hidden="true">*</span> Campos obrigatórios
      </p>

      <div className="form-group">
        <label className="form-label" htmlFor="encounter-person">
          Pessoa <span className="form-required" aria-hidden="true">*</span>
        </label>
        <select
          ref={personRef}
          id="encounter-person"
          className="form-select"
          value={personId}
          aria-required="true"
          aria-invalid={Boolean(errors.personId)}
          aria-describedby={errors.personId ? "encounter-person-error" : undefined}
          onChange={(e) => {
            setPersonId(e.target.value);
            clearError("personId");
          }}
        >
          <option value="">Selecione uma pessoa</option>
          {persons.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.personId && (
          <span id="encounter-person-error" className="form-error" role="alert">
            {errors.personId}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="encounter-date">
          Data <span className="form-required" aria-hidden="true">*</span>
        </label>
        <input
          ref={dateRef}
          id="encounter-date"
          type="datetime-local"
          className="form-input"
          value={date}
          aria-required="true"
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? "encounter-date-error" : undefined}
          onChange={(e) => {
            setDate(e.target.value);
            clearError("date");
          }}
        />
        {errors.date && (
          <span id="encounter-date-error" className="form-error" role="alert">
            {errors.date}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="encounter-location">Local</label>
        <input
          id="encounter-location"
          type="text"
          className="form-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="encounter-prayer">Pedido de Oração</label>
        <textarea
          id="encounter-prayer"
          className="form-textarea"
          value={prayerRequest}
          onChange={(e) => setPrayerRequest(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="encounter-notes">Informações</label>
        <textarea
          id="encounter-notes"
          className="form-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="encounter-contacts">Contatos</label>
        <textarea
          id="encounter-contacts"
          className="form-textarea"
          value={contacts}
          onChange={(e) => setContacts(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => router.push("/encounters")}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Salvando..." : encounter ? "Salvar" : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
