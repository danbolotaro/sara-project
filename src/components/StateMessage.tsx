import Link from "next/link";

interface StateMessageProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function StateMessage({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: StateMessageProps) {
  return (
    <div className="state-message">
      <p className="state-message-title">{title}</p>
      {description && <p className="state-message-text">{description}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn btn-secondary">
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionHref && onAction && (
        <button type="button" className="btn btn-secondary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function LoadErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <StateMessage
      title="Não foi possível carregar"
      description="Verifique sua conexão e tente novamente."
      actionLabel="Tentar novamente"
      onAction={onRetry}
    />
  );
}
