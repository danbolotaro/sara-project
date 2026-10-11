"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";

export type Resource<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "notFound" }
  | { status: "error" };

export function useResource<T>(url: string) {
  const [resource, setResource] = useState<Resource<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setResource({ status: "loading" });

    apiFetch<T>(url)
      .then((data) => {
        if (active) setResource({ status: "ready", data });
      })
      .catch((error) => {
        if (!active) return;
        const notFound = error instanceof ApiError && error.status === 404;
        setResource({ status: notFound ? "notFound" : "error" });
      });

    return () => {
      active = false;
    };
  }, [url, attempt]);

  const reload = useCallback(() => setAttempt((current) => current + 1), []);

  return { resource, reload };
}
