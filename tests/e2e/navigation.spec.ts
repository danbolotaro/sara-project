import { test, expect } from "@playwright/test";

test.describe("Navegação", () => {
  test("home redireciona para /persons com aba Pessoas ativa", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/persons$/);
    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "Pessoas" })).toHaveClass(/active/);
    await expect(header.getByRole("link", { name: "Encontros" })).not.toHaveClass(/active/);
  });

  test("header navega para Encontros", async ({ page }) => {
    await page.goto("/persons");

    await page.locator("header").getByRole("link", { name: "Encontros" }).click();

    await expect(page).toHaveURL(/\/encounters$/);
    await expect(page.getByRole("link", { name: /Cadastrar novo encontro/ })).toBeVisible();
  });
});
