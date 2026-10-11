import { test as setup, expect } from "@playwright/test";
import { STORAGE_STATE } from "../../playwright.config";

setup("autenticar com a senha do app", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Senha").fill(process.env.APP_PASSWORD ?? "");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/\/persons$/);
  await page.context().storageState({ path: STORAGE_STATE });
});
