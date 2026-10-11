import Link from "next/link";
import { EncounterWithPerson } from "@/types";
import { formatDate } from "@/lib/utils";

interface EncontroCardProps {
  encounter: EncounterWithPerson;
  showPerson?: boolean;
}

export function EncontroCard({ encounter, showPerson = true }: EncontroCardProps) {
  const date = formatDate(encounter.date);
  const location = encounter.location || "Local não informado";

  return (
    <article className="card">
      <div className="card-info">
        <span className="card-title">
          {showPerson ? encounter.person?.name || "Pessoa não identificada" : date}
        </span>
        {showPerson && <span className="card-meta">{date}</span>}
        <span className="card-meta">{location}</span>
      </div>
      <Link href={`/encounters/${encounter.id}`} className="btn btn-secondary btn-compact">
        Detalhes
      </Link>
    </article>
  );
}
