export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function jsonRequest(method: string, data: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch {
    throw new ApiError(0, "Falha de conexão com o servidor");
  }

  if (response.status === 401) {
    const from = `${window.location.pathname}${window.location.search}`;
    window.location.assign(`/login?from=${encodeURIComponent(from)}`);
    throw new ApiError(401, "Sessão expirada. Entre novamente.");
  }

  const data = await response.json().catch(() => null);

  if (response.status >= 500) {
    throw new ApiError(response.status, "Erro no servidor. Tente novamente.");
  }

  if (!response.ok) {
    throw new ApiError(response.status, data?.error || "Erro inesperado");
  }

  return data as T;
}
