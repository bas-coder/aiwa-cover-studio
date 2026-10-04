import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Download, Locator, Page } from "@playwright/test";

import { appSchema } from "../src/app/app-schema";
import { aiwaPalette } from "../src/app/brand-profile";
import {
  bannerAccentSample,
  bannerPlateFractions,
  bannerSceneRect,
} from "../src/app/banner-geometry";
import { expectToolcraftAcceptanceOutcome } from "./browser-acceptance-outcome-helpers";
import { expectToolcraftProductObservableToChange } from "./product-observable-helpers";
import { expectToolcraftBackgroundOutputSemantics } from "./browser-background-output-evidence";
import {
  expectToolcraftInfinityCanvasBackgroundEvidence,
  expectToolcraftInfinityCanvasImageExportEvidence,
  expectToolcraftInfinityCanvasModeEvidence,
  observeInfinityCanvas,
  observeInfinityCanvasBackground,
} from "./browser-infinity-canvas-evidence";
import { inspectToolcraftImageDownload } from "./image-artifact-inspection";
import { expectToolcraftImageExportArtifact } from "./browser-media-export-evidence";
import {
  createToolcraftBrowserProofSession,
  runToolcraftBrowserAction,
  type ToolcraftBrowserProofSession,
} from "./browser-proof-session";
import { dragToolcraftCanvasViewport } from "./performance-canvas-helpers";
import { expect, test } from "./toolcraft-product-test";

const fourKLongEdge = 4096;
const openGraphWidth = 1200;
const openGraphHeight = 630;
const coverWidth = 1600;
const coverHeight = 900;
const changedColor = "#112233";
const proofToken = "hf_test_token";
const rejectedStatus = 401;
const stableProof = { stabilityIntervalMs: 0, stabilitySamples: 2 } as const;
const sceneRect = bannerSceneRect({
  height: openGraphHeight,
  width: openGraphWidth,
});
const backdropRgba = rgbaFromHex(aiwaPalette.backdrop);
const accentRgba = rgbaFromHex(aiwaPalette.accent);
const defaultExportSize = imageExportSize(openGraphWidth, openGraphHeight);
const tinyPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

function rgbaFromHex(
  hex: string,
): readonly [number, number, number, number] {
  const channels = Number.parseInt(hex.slice(1), 16);
  return [
    (channels >> 16) & 255,
    (channels >> 8) & 255,
    channels & 255,
    255,
  ];
}

function imageExportSize(width: number, height: number): {
  height: number;
  width: number;
} {
  const pixelRatio = fourKLongEdge / Math.max(width, height);
  return width >= height
    ? {
        height: Math.max(1, Math.round(height * pixelRatio)),
        width: fourKLongEdge,
      }
    : {
        height: fourKLongEdge,
        width: Math.max(1, Math.round(width * pixelRatio)),
      };
}

async function startBanner(page: Page): Promise<ToolcraftBrowserProofSession> {
  await page.goto("/");
  const session = await createToolcraftBrowserProofSession(page);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("[data-art-source]")).toHaveAttribute(
    "data-art-source",
    "local",
  );
  return session;
}

async function replaceField(control: Locator, value: string): Promise<void> {
  const input = control.locator("input").first();
  await input.fill(value);
  await input.press("Enter");
}

async function chooseOption(
  control: Locator,
  page: Page,
  label: string,
): Promise<void> {
  await control.getByRole("combobox").click();
  await page.getByRole("option", { name: label, exact: true }).click();
}

async function readField(page: Page, target: string): Promise<string> {
  return page
    .locator(`[data-toolcraft-control-target="${target}"] input`)
    .first()
    .inputValue();
}

async function readCombobox(page: Page, target: string): Promise<string> {
  return (
    await page
      .locator(`[data-toolcraft-control-target="${target}"]`)
      .getByRole("combobox")
      .innerText()
  ).trim();
}

async function clickSwitch(control: Locator): Promise<void> {
  await control.getByRole("switch").click();
}

async function exportPng(control: Locator, page: Page): Promise<Download> {
  const download = page.waitForEvent("download");
  await control.getByRole("button", { name: "Export PNG" }).click();
  return download;
}

async function captureOutputIdentity(page: Page) {
  return page.evaluateHandle(() => ({
    host: document.querySelector("[data-toolcraft-product-scene]"),
    output: document.querySelector("[data-toolcraft-product-output]"),
  }));
}

async function compareOutputIdentity(
  page: Page,
  identity: Awaited<ReturnType<typeof captureOutputIdentity>>,
) {
  return page.evaluate(
    (baseline) => ({
      productHostPreserved:
        baseline.host !== null &&
        baseline.host === document.querySelector("[data-toolcraft-product-scene]"),
      productOutputPreserved:
        baseline.output !== null &&
        baseline.output === document.querySelector("[data-toolcraft-product-output]"),
    }),
    identity,
  );
}

test("browser: banner controls change the poster", async ({ page }) => {
  const session = await startBanner(page);
  const fast = stableProof;

  await expectToolcraftProductChange(session, "brief.category", async (control) => {
    await chooseOption(control, page, "Event");
  }, "brief.category");
  await expectToolcraftProductChange(session, "brief.platform", async (control) => {
    await chooseOption(control, page, "Story");
  }, "brief.platform");
  await expectToolcraftProductChange(session, "copy.headline", async (control) => {
    await replaceField(control, "Ship the work");
  }, "brief.headline");
  await expectToolcraftProductChange(session, "copy.support", async (control) => {
    await replaceField(control, "A shorter supporting line");
  }, "brief.support");
  await expectToolcraftProductChange(session, "copy.cta", async (control) => {
    await replaceField(control, "Join");
  }, "brief.cta");

  await expectToolcraftAcceptanceOutcome(
    () => readField(page, "art.token"),
    session.controlAction("art.token", (control) => replaceField(control, proofToken)),
    { evidenceType: "command-side-effect", requirementId: "art.token", ...fast },
  );
  await expectToolcraftAcceptanceOutcome(
    () => readField(page, "art.model"),
    session.controlAction("art.model", (control) =>
      replaceField(control, "example/aiwa-banners"),
    ),
    { evidenceType: "command-side-effect", requirementId: "art.model", ...fast },
  );
  await expectToolcraftAcceptanceOutcome(
    () => readField(page, "art.direction"),
    session.controlAction("art.direction", (control) =>
      replaceField(control, "Hard rim light"),
    ),
    { evidenceType: "command-side-effect", requirementId: "art.direction", ...fast },
  );
  await expectToolcraftAcceptanceOutcome(
    () =>
      page
        .locator('[data-toolcraft-control-target="appearance.background"]')
        .getByRole("textbox", { name: /hex/i })
        .inputValue(),
    session.controlAction("appearance.background", async (control) => {
      const input = control.getByRole("textbox", { name: /hex/i });
      await input.fill(changedColor);
      await input.press("Enter");
    }),
    { evidenceType: "command-side-effect", requirementId: "background.color", ...fast },
  );
  await expectToolcraftAcceptanceOutcome(
    () => readCombobox(page, "export.image.format"),
    session.controlAction("export.image.format", (control) =>
      chooseOption(control, page, "JPG"),
    ),
    { evidenceType: "command-side-effect", requirementId: "export.format", ...fast },
  );
  await expectToolcraftAcceptanceOutcome(
    () => readCombobox(page, "export.image.resolution"),
    session.controlAction("export.image.resolution", (control) =>
      chooseOption(control, page, "2K"),
    ),
    { evidenceType: "command-side-effect", requirementId: "export.resolution", ...fast },
  );
});

async function expectToolcraftProductChange(
  session: ToolcraftBrowserProofSession,
  target: string,
  run: (control: Locator) => Promise<void>,
  requirementId: string,
): Promise<void> {
  await expectToolcraftProductObservableToChange(
    session,
    session.controlAction(target, run),
    { requirementId, ...stableProof },
  );
}

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
    { requirementId: "background.include", ...stableProof },
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
    {
      backgroundExcluded,
      backgroundRestored,
      infinite,
    },
    {
      expectedBackgroundColor: aiwaPalette.backdrop,
      requirementId: "background.include",
      target: "export.includeBackground",
    },
  );
});

async function inspectExcludedCorner(download: Download, page: Page) {
  const inspected = await inspectToolcraftImageDownload({
    backgroundRgba: backdropRgba,
    download,
    page,
  });
  return {
    backgroundAlpha: inspected.observation.normalizedPixels[3] ?? 255,
    byteLength: inspected.inspection.byteLength,
    height: inspected.inspection.height,
    mediaType: inspected.inspection.mediaType,
    width: inspected.inspection.width,
  };
}

test("browser: image export writes the banner plate", async ({ page }) => {
  const session = await startBanner(page);
  await page.route("https://router.huggingface.co/**", async (route) => {
    const request = route.request();
    const failed = request.headers().authorization === `Bearer ${proofToken}-rejected`;
    if (failed) {
      await route.fulfill({
        body: JSON.stringify({ error: "unauthorized" }),
        contentType: "application/json",
        status: rejectedStatus,
      });
      return;
    }
    await route.fulfill({
      body: tinyPng,
      contentType: "image/png",
      status: 200,
    });
  });

  await session
    .controlAction("art.generate", async (control) => {
      await control.getByRole("button", { name: "Generate art" }).click();
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
      replaceField(control, `${proofToken}-rejected`),
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
    session.controlAction("art.token", (control) => replaceField(control, proofToken)),
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
      backgroundRgba: backdropRgba,
      expectedBounds: bannerPlateFractions,
      expectedHeight: defaultExportSize.height,
      expectedMediaType: "image/png",
      expectedPixels: [
        {
          rgba: accentRgba,
          xRatio: bannerAccentSample.xRatio,
          yRatio: bannerAccentSample.yRatio,
        },
      ],
      expectedWidth: defaultExportSize.width,
      page,
      requirementId: "art.generate",
    },
  );
});

test("browser: infinity keeps the banner frame", async ({ page }) => {
  const session = await startBanner(page);
  const persistenceKey =
    appSchema.persistence.storage === "localStorage"
      ? appSchema.persistence.key
      : "";
  const before = await observeInfinityCanvas(page);
  const initialIdentity = await captureOutputIdentity(page);
  await runToolcraftBrowserAction(
    session.controlAction("canvas.infinity", clickSwitch),
  );
  const enabled = await observeInfinityCanvas(page);
  const beforeToEnabled = await compareOutputIdentity(page, initialIdentity);
  await dragToolcraftCanvasViewport(page, { x: 96, y: -64 });
  await expect(page.locator('[data-slot="toolcraft-runtime-app"]')).toHaveAttribute(
    "data-toolcraft-persistence-status",
    "success",
  );
  const afterPan = await observeInfinityCanvas(page);
  await expect
    .poll(() =>
      page.evaluate((key) => {
        const raw = localStorage.getItem(key);
        if (!raw) return "";
        const snapshot = JSON.parse(raw) as {
          state?: { canvas?: { mode?: string; offset?: { x?: number } } };
        };
        return `${snapshot.state?.canvas?.mode ?? ""}:${snapshot.state?.canvas?.offset?.x ?? ""}`;
      }, persistenceKey),
    )
    .toContain("infinite");
  await runToolcraftBrowserAction(session.reload(), "reload");
  const afterReload = await observeInfinityCanvas(page);
  const restoredIdentity = await captureOutputIdentity(page);
  await runToolcraftBrowserAction(
    session.controlAction("canvas.infinity", clickSwitch),
  );
  const restored = await observeInfinityCanvas(page);
  const afterReloadToRestored = await compareOutputIdentity(page, restoredIdentity);
  await page.getByRole("button", { name: "Undo" }).click();
  const undone = await observeInfinityCanvas(page);
  const restoredToUndone = await compareOutputIdentity(page, restoredIdentity);
  await page.getByRole("button", { name: "Redo" }).click();
  const redone = await observeInfinityCanvas(page);
  const undoneToRedone = await compareOutputIdentity(page, restoredIdentity);
  await initialIdentity.dispose();
  await restoredIdentity.dispose();

  await expectToolcraftInfinityCanvasModeEvidence(
    {
      afterPan,
      afterReload,
      before,
      enabled,
      redone,
      restored,
      undone,
    },
    {
      afterReloadToRestored,
      beforeToEnabled,
      restoredToUndone,
      undoneToRedone,
    },
    {
      expectedFiniteSize: { height: openGraphHeight, width: openGraphWidth },
      expectedSceneRect: sceneRect,
      requirementId: "infinity.mode",
      target: "canvas.infinity",
    },
  );
});

test("browser: infinity export uses the banner scene bounds", async ({ page }) => {
  const session = await startBanner(page);
  const finiteDownload = await exportThrough(session, page);
  const finite = await inspectToolcraftImageDownload({
    backgroundRgba: backdropRgba,
    download: finiteDownload,
    page,
  });
  await runToolcraftBrowserAction(
    session.controlAction("canvas.infinity", clickSwitch),
  );
  const infiniteDownload = await exportThrough(session, page);
  const infinite = await inspectToolcraftImageDownload({
    backgroundRgba: backdropRgba,
    download: infiniteDownload,
    page,
  });

  await expectToolcraftInfinityCanvasImageExportEvidence(
    {
      finite: {
        byteLength: finite.inspection.byteLength,
        decodedPixelHash: finite.inspection.decodedPixelHash,
        height: finite.inspection.height,
        width: finite.inspection.width,
      },
      infinite: {
        byteLength: infinite.inspection.byteLength,
        decodedPixelHash: infinite.inspection.decodedPixelHash,
        height: infinite.inspection.height,
        width: infinite.inspection.width,
      },
    },
    {
      expectedSize: defaultExportSize,
      requirementId: "infinity.export",
      target: "canvas.infinity",
    },
  );
});

test("browser: cover captures the banner plate", async ({ page }) => {
  const session = await startBanner(page);
  await runToolcraftBrowserAction(
    session.controlAction("canvas.size.width", (control) =>
      replaceField(control, String(coverWidth)),
    ),
  );
  await runToolcraftBrowserAction(
    session.controlAction("canvas.size.height", (control) =>
      replaceField(control, String(coverHeight)),
    ),
  );
  const download = await exportThrough(session, page);
  const coverDirectory = path.join(process.cwd(), "public", "toolcraft");
  await mkdir(coverDirectory, { recursive: true });
  await download.saveAs(path.join(coverDirectory, "cover.png"));
  const coverState = {
    canvas: { height: coverHeight, unit: "px", width: coverWidth },
    values: {
      "appearance.background": aiwaPalette.backdrop,
      "art.direction": "Soft orange light across a dark field",
      "brief.category": "brand",
      "brief.platform": "x",
      "copy.cta": "Learn more",
      "copy.headline": "Build what matters",
      "export.includeBackground": true,
    },
  };
  await writeFile(
    path.join(process.cwd(), "app-cover-state.json"),
    `${JSON.stringify(coverState, null, 2)}\n`,
  );
  await writeFile(
    path.join(process.cwd(), "app-cover.json"),
    `${JSON.stringify(
      {
        asset: "public/toolcraft/cover.png",
        generation: {
          description:
            "Actual app result at the recorded settings; 16:9 output capture, no editor UI.",
          kind: "app-composition",
          source: "src/app/app-composition.tsx",
          state: "app-cover-state.json",
        },
        title: "AIWA Banners",
        version: 1,
      },
      null,
      2,
    )}\n`,
  );
});

async function exportThrough(
  session: ToolcraftBrowserProofSession,
  page: Page,
): Promise<Download> {
  const pending = page.waitForEvent("download");
  await runToolcraftBrowserAction(
    session.controlAction("art.generate", async (control) => {
      await control.getByRole("button", { name: "Export PNG" }).click();
    }),
  );
  return pending;
}
