import type { Download, Locator, Page } from "@playwright/test";

import { aiwaPalette } from "../src/app/brand-profile";
import {
  bannerPlateFractions,
  bannerSceneRect,
} from "../src/app/banner-geometry";
import { expectToolcraftProductObservableToChange } from "./product-observable-helpers";
import { inspectToolcraftImageDownload } from "./image-artifact-inspection";
import {
  createToolcraftBrowserProofSession,
  runToolcraftBrowserAction,
  type ToolcraftBrowserProofSession,
} from "./browser-proof-session";
import { expect } from "./toolcraft-product-test";

const fourKLongEdge = 4096;
const openGraphWidth = 1200;
const openGraphHeight = 630;

export const bannerStableProof = {
  stabilityIntervalMs: 0,
  stabilitySamples: 2,
} as const;

export const bannerSceneWorldRect = bannerSceneRect({
  height: openGraphHeight,
  width: openGraphWidth,
});

export const bannerOpenGraphSize = {
  height: openGraphHeight,
  width: openGraphWidth,
} as const;

export const bannerBackdropRgba = rgbaFromHex(aiwaPalette.backdrop);
export const bannerAccentRgba = rgbaFromHex(aiwaPalette.accent);
export const bannerDefaultExportSize = imageExportSize(
  openGraphWidth,
  openGraphHeight,
);
export const bannerPlateBounds = bannerPlateFractions;
export const bannerChangedColor = "#112233";
export const bannerProofToken = "hf_test_token";
export const bannerRejectedStatus = 401;
export const bannerTinyPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);
export const bannerCoverSize = { height: 1080, width: 1920 } as const;
export const bannerBackdrop = aiwaPalette.backdrop;

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

export async function startBanner(
  page: Page,
): Promise<ToolcraftBrowserProofSession> {
  await page.goto("/");
  const session = await createToolcraftBrowserProofSession(page);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("[data-art-source]")).toHaveAttribute(
    "data-art-source",
    "local",
  );
  return session;
}

export async function replaceField(control: Locator, value: string): Promise<void> {
  const input = control.locator("input").first();
  await input.fill(value);
  await input.press("Enter");
}

export async function chooseOption(
  control: Locator,
  page: Page,
  label: string,
): Promise<void> {
  await control.getByRole("combobox").click();
  await page.getByRole("option", { name: label, exact: true }).click();
}

export async function readField(page: Page, target: string): Promise<string> {
  return page
    .locator(`[data-toolcraft-control-target="${target}"] input`)
    .first()
    .inputValue();
}

export async function readCombobox(page: Page, target: string): Promise<string> {
  return (
    await page
      .locator(`[data-toolcraft-control-target="${target}"]`)
      .getByRole("combobox")
      .innerText()
  ).trim();
}

export async function clickSwitch(control: Locator): Promise<void> {
  await control.getByRole("switch").click();
}

export async function exportPng(control: Locator, page: Page): Promise<Download> {
  const download = page.waitForEvent("download");
  await control.getByRole("button", { name: "Export PNG" }).click();
  return download;
}

export async function exportThrough(
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

export async function expectBannerProductChange(
  session: ToolcraftBrowserProofSession,
  target: string,
  run: (control: Locator) => Promise<void>,
  requirementId: string,
): Promise<void> {
  await expectToolcraftProductObservableToChange(
    session,
    session.controlAction(target, run),
    {
      requirementId,
      selector: "[data-toolcraft-product-output]",
      ...bannerStableProof,
    },
  );
}

export async function captureOutputIdentity(page: Page) {
  return page.evaluateHandle(() => ({
    host: document.querySelector("[data-toolcraft-product-scene]"),
    output: document.querySelector("[data-toolcraft-product-output]"),
  }));
}

export async function compareOutputIdentity(
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

export async function inspectExcludedCorner(download: Download, page: Page) {
  const inspected = await inspectToolcraftImageDownload({
    backgroundRgba: bannerBackdropRgba,
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
