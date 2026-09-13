"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Person, Encounter, EncounterCreate } from "@/types";

interface EncounterFormProps {
  encounter?: Encounter;
  persons: Person[];
  onSubmit: (data: EncounterCreate) => Promise<void>;
  isLoading: boolean;
}

export function EncounterForm({
  encounter,
  persons,
  onSubmit,
  isLoading,
}: EncounterFormProps) {
  const router = useRouter();
  const [personId, setPersonId] = useState(encounter?.person_id || "");
  const [date, setDate] = useState(
    encounter?.date ? encounter.date.slice(0, 16) : ""
  );
  const [location, setLocation] = useState(encounter?.location || "");
  const [prayerRequest, setPrayerRequest] = useState(
    encounter?.prayer_request || ""
  );
  const [notes, setNotes] = useState(encounter?.notes || "");
  const [contacts, setContacts] = useState(encounter?.contacts || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!personId) newErrors.personId = "Selecione uma pessoa";
    if (!date) newErrors.date = "Data é obrigatória";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="encounter-person">Pessoa:</label>
        <select
          id="encounter-person"
          className="form-select"
          value={personId}
          onChange={(e) => setPersonId(e.target.value)}
        >
          <option value="">Selecione uma pessoa</option>
          {persons.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.personId && (
          <span className="form-error">{errors.personId}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="encounter-date">Data:</label>
        <input
          id="encounter-date"
          type="datetime-local"
          className="form-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && <span className="form-error">{errors.date}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="encounter-location">Local:</label>
        <input
          id="encounter-location"
          type="text"
          className="form-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="encounter-prayer">Pedido de Oração:</label>
        <textarea
          id="encounter-prayer"
          className="form-textarea"
          value={prayerRequest}
          onChange={(e) => setPrayerRequest(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="encounter-notes">Informações:</label>
        <textarea
          id="encounter-notes"
          className="form-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="encounter-contacts">Contatos:</label>
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
          className="btn-form-cancel"
          onClick={() => router.push("/encounters")}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-form-submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : encounter ? "Salvar" : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
