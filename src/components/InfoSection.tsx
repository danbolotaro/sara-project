interface InfoSectionProps {
  label: string;
  value: string | null;
}

export function InfoSection({ label, value }: InfoSectionProps) {
  return (
    <section className="info-section">
      <h2 className="info-section-label">{label}</h2>
      {value ? (
        <p className="info-section-value">{value}</p>
      ) : (
        <p className="info-section-empty">Não informado</p>
      )}
    </section>
  );
}
