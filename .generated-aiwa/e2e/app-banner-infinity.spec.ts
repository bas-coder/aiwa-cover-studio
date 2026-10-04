import { appSchema } from "../src/app/app-schema";
import {
  expectToolcraftInfinityCanvasImageExportEvidence,
  expectToolcraftInfinityCanvasModeEvidence,
  observeInfinityCanvas,
} from "./browser-infinity-canvas-evidence";
import { inspectToolcraftImageDownload } from "./image-artifact-inspection";
import { runToolcraftBrowserAction } from "./browser-proof-session";
import { dragToolcraftCanvasViewport } from "./performance-canvas-helpers";
import {
  bannerBackdropRgba,
  bannerDefaultExportSize,
  bannerOpenGraphSize,
  bannerSceneWorldRect,
  captureOutputIdentity,
  clickSwitch,
  compareOutputIdentity,
  exportThrough,
  startBanner,
} from "./app-banner-test-support";
import { expect, test } from "./toolcraft-product-test";

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
      expectedFiniteSize: bannerOpenGraphSize,
      expectedSceneRect: bannerSceneWorldRect,
      requirementId: "infinity.mode",
      target: "canvas.infinity",
    },
  );
});

test("browser: infinity export uses the banner scene bounds", async ({ page }) => {
  const session = await startBanner(page);
  const finiteDownload = await exportThrough(session, page);
  const finite = await inspectToolcraftImageDownload({
    backgroundRgba: bannerBackdropRgba,
    download: finiteDownload,
    page,
  });
  await runToolcraftBrowserAction(
    session.controlAction("canvas.infinity", clickSwitch),
  );
  const infiniteDownload = await exportThrough(session, page);
  const infinite = await inspectToolcraftImageDownload({
    backgroundRgba: bannerBackdropRgba,
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
      expectedSize: bannerDefaultExportSize,
      requirementId: "infinity.export",
      target: "canvas.infinity",
    },
  );
});
