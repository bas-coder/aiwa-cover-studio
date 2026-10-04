import { bannerAccentSample } from "../src/app/banner-geometry";
import { expectToolcraftAcceptanceOutcome } from "./browser-acceptance-outcome-helpers";
import { expectToolcraftImageExportArtifact } from "./browser-media-export-evidence";
import { runToolcraftBrowserAction } from "./browser-proof-session";
import {
  bannerAccentRgba,
  bannerBackdropRgba,
  bannerDefaultExportSize,
  bannerPlateBounds,
  bannerProofToken,
  bannerRejectedStatus,
  bannerStableProof,
  bannerTinyPng,
  exportPng,
  readField,
  replaceField,
  startBanner,
} from "./app-banner-test-support";
import { expect, test } from "./toolcraft-product-test";

test("browser: art settings stay off the poster", async ({ page }) => {
  const session = await startBanner(page);

  await expectToolcraftAcceptanceOutcome(
    () => readField(page, "art.token"),
    session.controlAction("art.token", (control) =>
      replaceField(control, bannerProofToken),
    ),
    {
      evidenceType: "command-side-effect",
      requirementId: "art.token",
      ...bannerStableProof,
    },
  );
  await expectToolcraftAcceptanceOutcome(
    () => readField(page, "art.model"),
    session.controlAction("art.model", (control) =>
      replaceField(control, "example/aiwa-banners"),
    ),
    {
      evidenceType: "command-side-effect",
      requirementId: "art.model",
      ...bannerStableProof,
    },
  );
  await expectToolcraftAcceptanceOutcome(
    () => readField(page, "art.direction"),
    session.controlAction("art.direction", (control) =>
      replaceField(control, "Hard rim light"),
    ),
    {
      evidenceType: "command-side-effect",
      requirementId: "art.direction",
      ...bannerStableProof,
    },
  );
});

test("browser: image export writes the banner plate", async ({ page }) => {
  const session = await startBanner(page);
  await page.route("https://router.huggingface.co/**", async (route) => {
    const rejected =
      route.request().headers().authorization ===
      `Bearer ${bannerProofToken}-rejected`;
    if (rejected) {
      await route.fulfill({
        body: JSON.stringify({ error: "unauthorized" }),
        contentType: "application/json",
        status: bannerRejectedStatus,
      });
      return;
    }
    await route.fulfill({
      body: bannerTinyPng,
      contentType: "image/png",
      status: 200,
    });
  });

  await runToolcraftBrowserAction(
    session.controlAction("art.generate", async (control) => {
      await control.getByRole("button", { name: "Generate art" }).click();
    }),
  );
  await expect(page.locator("[data-art-source]")).toHaveAttribute(
    "data-art-source",
    "local",
  );

  await runToolcraftBrowserAction(
    session.controlAction("art.token", (control) =>
      replaceField(control, `${bannerProofToken}-rejected`),
    ),
  );
  await runToolcraftBrowserAction(
    session.controlAction("art.generate", async (control) => {
      await control.getByRole("button", { name: "Generate art" }).click();
    }),
  );
  await expect(page.locator("[data-art-source]")).toHaveAttribute(
    "data-art-source",
    "local",
  );

  await runToolcraftBrowserAction(
    session.controlAction("art.token", (control) =>
      replaceField(control, bannerProofToken),
    ),
  );
  await runToolcraftBrowserAction(
    session.controlAction("art.generate", async (control) => {
      await control.getByRole("button", { name: "Generate art" }).click();
    }),
  );
  await expect(page.locator("[data-art-source]")).toHaveAttribute(
    "data-art-source",
    "model",
  );

  await expectToolcraftImageExportArtifact(
    session.controlAction("art.generate", (control) => exportPng(control, page)),
    {
      backgroundRgba: bannerBackdropRgba,
      expectedBounds: bannerPlateBounds,
      expectedHeight: bannerDefaultExportSize.height,
      expectedMediaType: "image/png",
      expectedPixels: [
        {
          rgba: bannerAccentRgba,
          xRatio: bannerAccentSample.xRatio,
          yRatio: bannerAccentSample.yRatio,
        },
      ],
      expectedWidth: bannerDefaultExportSize.width,
      page,
      requirementId: "art.generate",
    },
  );
});
