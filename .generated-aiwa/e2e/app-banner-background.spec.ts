import { expectToolcraftAcceptanceOutcome } from "./browser-acceptance-outcome-helpers";
import { expectToolcraftBackgroundOutputSemantics } from "./browser-background-output-evidence";
import {
  expectToolcraftInfinityCanvasBackgroundEvidence,
  observeInfinityCanvasBackground,
} from "./browser-infinity-canvas-evidence";
import { runToolcraftBrowserAction } from "./browser-proof-session";
import {
  bannerBackdrop,
  bannerChangedColor,
  bannerStableProof,
  clickSwitch,
  exportPng,
  inspectExcludedCorner,
  startBanner,
} from "./app-banner-test-support";
import { expect, test } from "./toolcraft-product-test";

test("browser: background color changes the backdrop", async ({ page }) => {
  const session = await startBanner(page);

  await expectToolcraftAcceptanceOutcome(
    () =>
      page
        .locator('[data-toolcraft-control-target="appearance.background"]')
        .getByRole("textbox", { name: /hex/i })
        .inputValue(),
    session.controlAction("appearance.background", async (control) => {
      const input = control.getByRole("textbox", { name: /hex/i });
      await input.fill(bannerChangedColor);
      await input.press("Enter");
    }),
    {
      evidenceType: "command-side-effect",
      requirementId: "background.color",
      ...bannerStableProof,
    },
  );
});

test("browser: background exclusion hides the preview fill", async ({ page }) => {
  const session = await startBanner(page);
  const preview = session.observe((root) => {
    const layer = root.querySelector<HTMLElement>(
      "[data-toolcraft-finite-background-layer]",
    );
    return {
      backgroundVisible: layer !== null,
      outputSignature: layer?.style.backgroundColor || "hidden",
    };
  });

  await expectToolcraftBackgroundOutputSemantics(
    preview,
    session.controlAction("export.includeBackground", clickSwitch),
    { backgroundVisible: false, outputSignature: "hidden" },
    session.controlAction("art.generate", (control) => exportPng(control, page)),
    (artifact) => inspectExcludedCorner(artifact, page),
    { requirementId: "background.include", ...bannerStableProof },
  );

  await runToolcraftBrowserAction(
    session.controlAction("canvas.infinity", clickSwitch),
  );
  await expect(page.locator("[data-toolcraft-canvas-mode]")).toHaveAttribute(
    "data-toolcraft-canvas-mode",
    "infinite",
  );
  await runToolcraftBrowserAction(
    session.controlAction("export.includeBackground", clickSwitch),
  );
  const infinite = await observeInfinityCanvasBackground(page);
  await runToolcraftBrowserAction(
    session.controlAction("export.includeBackground", clickSwitch),
  );
  const backgroundExcluded = await observeInfinityCanvasBackground(page);
  await runToolcraftBrowserAction(
    session.controlAction("export.includeBackground", clickSwitch),
  );
  const backgroundRestored = await observeInfinityCanvasBackground(page);
  await expectToolcraftInfinityCanvasBackgroundEvidence(
    { backgroundExcluded, backgroundRestored, infinite },
    {
      expectedBackgroundColor: bannerBackdrop,
      requirementId: "background.include",
      target: "export.includeBackground",
    },
  );
});
