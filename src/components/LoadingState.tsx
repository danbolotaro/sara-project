export function LoadingState() {
  return (
    <div className="loading" role="status">
      <span className="sr-only">Carregando...</span>
      <div className="skeleton skeleton-card" />
      <div className="skeleton skeleton-card" />
      <div className="skeleton skeleton-card" />
    </div>
  );
}
