import { test, expect } from "@playwright/test";

test("homepage sections and local images load", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  for (const selector of [
    ".hero",
    "#about",
    "#sponsors",
    ".video-section",
    "#inspiration",
    ".gallery-desktop",
    "#route",
    "#updates",
    ".mission",
    ".donation",
    ".designer",
    ".site-footer",
  ])
    await expect(page.locator(selector)).toHaveCount(1);
  await expect(page.locator(".polaroid")).toHaveCount(14);
  await page.evaluate(async () => {
    for (const img of document.images) {
      img.loading = "eager";
      await img.decode().catch(() => {});
    }
  });
  const broken = await page
    .locator("img")
    .evaluateAll((imgs) =>
      imgs
        .filter((img) => !(img as HTMLImageElement).naturalWidth)
        .map((img) => (img as HTMLImageElement).src),
    );
  expect(broken).toEqual([]);
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("updates expand and collapse", async ({ page }) => {
  await page.goto("/diary");
  const button = page.locator(".show-more");
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("link", { name: "Read the full original diary" }),
  ).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#post-expanded")).toHaveCount(0);
});

test("video activates on demand", async ({ page }) => {
  await page.route("https://www.youtube.com/**", (route) =>
    route.fulfill({
      body: "<html><body>Video embed</body></html>",
      contentType: "text/html",
    }),
  );
  await page.goto("/");
  await expect(page.locator("iframe")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Play Just Phil Ride introduction" })
    .click();
  await expect(page.getByTitle("Just Phil Ride introduction")).toHaveAttribute(
    "src",
    /aZ_3eYiq4q0\?autoplay=1/,
  );
});

test("mobile menu, gallery and page widths", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Route", exact: true })
    .click();
  await expect(page).toHaveURL(/#route$/);
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}px`,
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".gallery-mobile")).toBeVisible();
  expect(
    await page
      .locator(".gallery-mobile")
      .evaluate((e) => e.scrollWidth > e.clientWidth),
  ).toBe(true);
});

test("contact route has accessible required fields", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Contact Phil",
  );
  await expect(page.getByLabel("Email Address")).toHaveAttribute(
    "type",
    "email",
  );
  await expect(page.getByLabel("Email Address")).toHaveAttribute(
    "required",
    "",
  );
  await expect(page.getByLabel("Your Message")).toHaveAttribute("required", "");
  await page.getByLabel("Email Address").fill("invalid");
  expect(
    await page
      .getByLabel("Email Address")
      .evaluate((el: HTMLInputElement) => el.checkValidity()),
  ).toBe(false);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("desktop photos can be dragged", async ({ page }) => {
  await page.goto("/");
  const photo = page.locator(".photo-drag").first();
  await photo.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  const before = await photo.boundingBox();
  expect(before).not.toBeNull();
  const x = before!.x + before!.width / 2,
    y = before!.y + before!.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 60, y + 35, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  const after = await photo.boundingBox();
  expect(after!.x - before!.x).toBeGreaterThan(30);
});

test("reduced motion keeps content visible and ambient video paused", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero-logo img")).toBeVisible();
  await page.locator(".donation-video").scrollIntoViewIfNeeded();
  expect(
    await page
      .locator(".donation-video video")
      .evaluate((video: HTMLVideoElement) => video.paused),
  ).toBe(true);
});
