import { expect, test } from "@playwright/test";

test("home to quiz to result to add to cart to WhatsApp link", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your moment, Mrennett.");

  // Quiz: pick the first answer each time and finish
  await page.getByRole("link", { name: "Find your scent" }).first().click();
  await expect(page).toHaveURL(/\/quiz$/);
  for (let i = 0; i < 3; i++) {
    await expect(page.getByText(`Question ${i + 1} of 3`)).toBeVisible();
    await page.getByRole("radio").nth(1).check();
    await page.getByRole("button", { name: i === 2 ? "See my scent" : "Next" }).click();
  }
  await expect(page).toHaveURL(/\/quiz\/result\?m=(calm|bright|fresh)/);
  await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();

  // Add the first recommended product to the ritual
  await page.getByRole("button", { name: /^Add to ritual:/ }).first().click();
  await page.getByRole("button", { name: /^Open your ritual, 1 item/ }).click();
  const dialog = page.getByRole("dialog", { name: /Your ritual/ });
  await expect(dialog).toBeVisible();

  // WhatsApp hand-off
  const wa = dialog.getByRole("link", { name: "Order on WhatsApp" });
  const href = await wa.getAttribute("href");
  expect(href).toMatch(/^https:\/\/wa\.me\/254700000000\?text=/);
  const text = decodeURIComponent(href!.split("text=")[1]);
  expect(text).toContain("1 x");
  expect(text).toContain("delivery area");

  expect(errors, errors.join("\n")).toEqual([]);
});

test("cart survives a reload and quantity can change", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("button", { name: /^Add to ritual:/ }).first().click();
  await page.reload();
  await page.getByRole("button", { name: /^Open your ritual, 1 item/ }).click();
  await page.getByRole("button", { name: /^Increase quantity/ }).click();
  await expect(page.getByRole("dialog").getByText("Your ritual (2)")).toBeVisible();
});

test("shop filter by place", async ({ page }) => {
  await page.goto("/shop?place=hands");
  await expect(page.getByText("Showing 1 of 4 products")).toBeVisible();
});
