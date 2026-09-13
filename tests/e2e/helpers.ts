import { expect, type APIRequestContext, type Page } from "@playwright/test";

export type Created = { type: "person" | "encounter"; id: string };

// Prefixo facilita identificar (e apagar) dados de teste no Supabase
export function uniqueName(label: string): string {
  return `[E2E] ${label} ${Date.now()}`;
}

export async function createPersonViaApi(
  request: APIRequestContext,
  data: { name: string; gender?: string; age?: number; hometown?: string }
): Promise<string> {
  const res = await request.post("/api/persons", { data });
  expect(res.status(), await res.text()).toBe(201);
  return (await res.json()).id;
}

export async function createEncounterViaApi(
  request: APIRequestContext,
  data: { person_id: string; date: string; location?: string }
): Promise<string> {
  const res = await request.post("/api/encounters", { data });
  expect(res.status(), await res.text()).toBe(201);
  return (await res.json()).id;
}

export async function cleanup(request: APIRequestContext, created: Created[]) {
  // Encontros antes das pessoas (FK person_id)
  const ordered = [
    ...created.filter((c) => c.type === "encounter"),
    ...created.filter((c) => c.type === "person"),
  ];
  for (const c of ordered) {
    const url = `/api/${c.type === "person" ? "persons" : "encounters"}/${c.id}`;
    // API responde 200 mesmo quando o delete não remove nada: confirma com GET e tenta de novo
    for (let attempt = 0; attempt < 3; attempt++) {
      await request.delete(url);
      if ((await request.get(url)).status() === 404) break;
    }
    expect.soft((await request.get(url)).status(), `limpeza falhou: ${url}`).toBe(404);
  }
  created.length = 0;
}

// Aguarda redirect para /<prefix>/<uuid> e retorna o uuid
export async function idFromUrl(
  page: Page,
  prefix: "persons" | "encounters"
): Promise<string> {
  const re = new RegExp(`/${prefix}/([0-9a-f-]{36})$`);
  await page.waitForURL(re);
  return page.url().match(re)![1];
}
