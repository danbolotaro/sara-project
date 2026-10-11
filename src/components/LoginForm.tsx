"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  redirectTo: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fail = (message: string) => {
    setError(message);
    setIsSubmitting(false);
    inputRef.current?.focus();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!password) {
      fail("Informe a senha");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        fail(data?.error || "Não foi possível entrar");
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch {
      fail("Falha de conexão com o servidor");
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="login-brand">SARA</h1>
        <p className="login-subtitle">
          Sistema de Apoio e Registro de Acolhimento
        </p>

        <div className="form-group">
          <label className="form-label" htmlFor="login-password">
            Senha
          </label>
          <input
            ref={inputRef}
            id="login-password"
            type="password"
            className="form-input"
            autoComplete="current-password"
            autoFocus
            value={password}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "login-error" : undefined}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
          />
          {error && (
            <span id="login-error" className="form-error" role="alert">
              {error}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
