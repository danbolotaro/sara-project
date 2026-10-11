import Link from "next/link";
import { Person } from "@/types";

interface PessoaCardProps {
  person: Person;
}

export function PessoaCard({ person }: PessoaCardProps) {
  const details = [person.gender, person.age ? `${person.age} anos` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="card">
      <div className="card-info">
        <span className="card-title">{person.name}</span>
        <span className="card-meta">
          {details || "Sem informações adicionais"}
        </span>
      </div>
      <Link href={`/persons/${person.id}`} className="btn btn-secondary btn-compact">
        Detalhes
      </Link>
    </article>
  );
}
