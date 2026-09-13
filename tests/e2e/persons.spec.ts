import { test, expect } from "@playwright/test";
import { cleanup, createPersonViaApi, idFromUrl, uniqueName, type Created } from "./helpers";

const created: Created[] = [];

test.afterEach(async ({ request }) => {
  await cleanup(request, created);
});

test.describe("Pessoas", () => {
  test("cadastrar nova pessoa", async ({ page }) => {
    const name = uniqueName("Maria");

    await page.goto("/persons");
    await page.getByRole("link", { name: /Cadastrar nova pessoa/ }).click();
    await expect(page).toHaveURL(/\/persons\/new$/);

    await page.getByLabel("Nome:").fill(name);
    await page.getByLabel("Gênero:").selectOption("Feminino");
    await page.getByLabel("Idade:").fill("30");
    await page.getByLabel("Cidade Natal:").fill("Recife");
    await page.getByRole("button", { name: "Cadastrar" }).click();

    await expect(page.getByText("Pessoa cadastrada com sucesso")).toBeVisible();
    const id = await idFromUrl(page, "persons");
    created.push({ type: "person", id });

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    await expect(page.getByText("Idade: 30 Anos")).toBeVisible();
    await expect(page.getByText("Gênero: Feminino")).toBeVisible();

    await page.goto("/persons");
    await expect(page.getByText(name)).toBeVisible();
  });

  test("não cadastra pessoa sem nome", async ({ page }) => {
    await page.goto("/persons/new");

    await page.getByRole("button", { name: "Cadastrar" }).click();

    await expect(page.locator(".form-error")).toHaveText("Nome é obrigatório");
    await expect(page).toHaveURL(/\/persons\/new$/);
  });

  test("editar pessoa", async ({ page, request }) => {
    const id = await createPersonViaApi(request, { name: uniqueName("João"), age: 40 });
    created.push({ type: "person", id });
    const newName = uniqueName("João Editado");

    await page.goto(`/persons/${id}`);
    await page.getByRole("link", { name: "Mais" }).click();
    await page.getByRole("link", { name: "Editar" }).click();
    await expect(page).toHaveURL(new RegExp(`/persons/${id}/edit$`));

    await page.getByLabel("Nome:").fill(newName);
    await page.getByLabel("Idade:").fill("41");
    await page.getByRole("button", { name: "Salvar" }).click();

    await expect(page.getByText("Pessoa atualizada com sucesso")).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/persons/${id}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(newName);
    await expect(page.getByText("Idade: 41 Anos")).toBeVisible();
  });

  test("excluir pessoa (cancelar e confirmar)", async ({ page, request }) => {
    const name = uniqueName("Pedro");
    const id = await createPersonViaApi(request, { name });
    created.push({ type: "person", id });

    await page.goto(`/persons/${id}/more`);
    const dialog = page.locator(".confirm-dialog");

    // Cancelar mantém a pessoa
    await page.getByRole("button", { name: "Excluir" }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Cancelar" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);

    // Confirmar exclui
    await page.getByRole("button", { name: "Excluir" }).click();
    await dialog.getByRole("button", { name: "Excluir" }).click();

    await expect(page.getByText("Pessoa excluída com sucesso")).toBeVisible();
    await expect(page).toHaveURL(/\/persons$/);
    await expect(page.getByText("Carregando...")).toBeHidden();
    await expect(page.getByText(name)).toHaveCount(0);
  });
});
