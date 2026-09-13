import Link from "next/link";
import { EncounterWithPerson } from "@/types";
import { formatDate } from "@/lib/utils";

interface EncontroCardProps {
  encounter: EncounterWithPerson;
}

export function EncontroCard({ encounter }: EncontroCardProps) {
  return (
    <div className="card">
      <div className="card-info">
        <span className="card-row">
          <span className="card-label">Pessoa: </span>
          {encounter.person?.name || "—"}
        </span>
        <span className="card-row">
          <span className="card-label">Data: </span>
          {formatDate(encounter.date)}
        </span>
        <span className="card-row">
          <span className="card-label">Local: </span>
          {encounter.location || "—"}
        </span>
      </div>
      <Link href={`/encounters/${encounter.id}`} className="btn-details">
        Detalhes
      </Link>
    </div>
  );
}
