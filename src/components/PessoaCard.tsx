import Link from "next/link";
import { Person } from "@/types";

interface PessoaCardProps {
  person: Person;
}

export function PessoaCard({ person }: PessoaCardProps) {
  return (
    <div className="card">
      <div className="card-info">
        <span className="card-row">
          <span className="card-label">Nome: </span>
          {person.name}
        </span>
        <span className="card-row">
          <span className="card-label">Gênero: </span>
          {person.gender || "—"}
        </span>
        <span className="card-row">
          <span className="card-label">Idade: </span>
          {person.age ? `${person.age} anos` : "—"}
        </span>
      </div>
      <Link href={`/persons/${person.id}`} className="btn-details">
        Detalhes
      </Link>
    </div>
  );
}
