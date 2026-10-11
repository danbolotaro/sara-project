"use client";

import { useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  message,
  busy,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open || busy) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div className="confirm-overlay" onClick={busy ? undefined : onCancel}>
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-message"
        onClick={(event) => event.stopPropagation()}
      >
        <p id="confirm-dialog-message">{message}</p>
        <div className="confirm-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={busy}
            autoFocus
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
