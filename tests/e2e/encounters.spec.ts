import { test, expect } from "@playwright/test";
import {
  cleanup,
  createEncounterViaApi,
  createPersonViaApi,
  idFromUrl,
  uniqueName,
  type Created,
} from "./helpers";

const created: Created[] = [];

test.afterEach(async ({ request }) => {
  await cleanup(request, created);
});

test.describe("Encontros", () => {
  test("cadastrar novo encontro", async ({ page, request }) => {
    const personName = uniqueName("Ana");
    const personId = await createPersonViaApi(request, { name: personName });
    created.push({ type: "person", id: personId });
    const location = uniqueName("Praça Central");

    await page.goto("/encounters");
    await page.getByRole("link", { name: /Cadastrar novo encontro/ }).click();
    await expect(page).toHaveURL(/\/encounters\/new$/);

    await page.getByLabel("Pessoa").selectOption({ label: personName });
    await page.getByLabel("Data").fill("2026-09-12T14:30");
    await page.getByLabel("Local").fill(location);
    await page.getByLabel("Pedido de Oração").fill("Saúde da família");
    await page.getByRole("button", { name: "Cadastrar" }).click();

    await expect(page.getByText("Encontro cadastrado com sucesso")).toBeVisible();
    const id = await idFromUrl(page, "encounters");
    created.push({ type: "encounter", id });

    await expect(page.getByRole("link", { name: personName })).toBeVisible();
    await expect(page.getByText("12/09/26 - 14:30")).toBeVisible();
    await expect(page.getByText(location)).toBeVisible();
    await expect(page.getByText("Saúde da família")).toBeVisible();
    await page.goto(`/persons/${personId}`);
    const highlight = page.locator(".highlight-card");
    await expect(highlight).toContainText("12/09/26 - 14:30");
    await expect(highlight).toContainText(location);
  });

  test("não cadastra encontro sem pessoa e data", async ({ page, request }) => {
    const personId = await createPersonViaApi(request, { name: uniqueName("Carlos") });
    created.push({ type: "person", id: personId });

    await page.goto("/encounters/new");
    await page.getByLabel("Data").fill("");
    await page.getByRole("button", { name: "Cadastrar" }).click();

    const errors = page.locator(".form-error");
    await expect(errors.filter({ hasText: "Selecione uma pessoa" })).toBeVisible();
    await expect(errors.filter({ hasText: "Data é obrigatória" })).toBeVisible();
    await expect(page).toHaveURL(/\/encounters\/new$/);
  });

  test("excluir encontro", async ({ page, request }) => {
    const personId = await createPersonViaApi(request, { name: uniqueName("Lucas") });
    created.push({ type: "person", id: personId });
    const location = uniqueName("Igreja");
    const id = await createEncounterViaApi(request, {
      person_id: personId,
      date: new Date().toISOString(),
      location,
    });
    created.push({ type: "encounter", id });

    await page.goto(`/encounters/${id}`);
    await expect(page.getByText(location)).toBeVisible();

    await page.getByRole("button", { name: "Excluir" }).click();
    await page.locator(".confirm-dialog").getByRole("button", { name: "Excluir" }).click();

    await expect(page.getByText("Encontro excluído com sucesso")).toBeVisible();
    await expect(page).toHaveURL(/\/encounters$/);
    await expect(page.getByText("Carregando...")).toBeHidden();
    await expect(page.getByText(location)).toHaveCount(0);
  });
});
