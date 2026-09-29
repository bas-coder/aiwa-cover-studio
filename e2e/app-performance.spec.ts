import { expect, test } from "@playwright/test";

import { deriveToolcraftPerformancePaths } from "@repo/toolcraft-runtime";

import { starterPerformance } from "../src/app/starter-performance";
import { starterSchema } from "../src/app/starter-schema";
import {
  appPerformanceCanvasBacking,
  appPerformancePathAdapters,
} from "./app-performance-path-adapters";
import {
  compileToolcraftPerformancePathAdapterMatrix,
  getToolcraftPerformancePathTestName,
} from "./performance-path-adapter-matrix";
import { runToolcraftPerformancePath } from "./performance-path-helpers";
import { attachToolcraftPerformanceEnvironmentEvidence } from "./performance-environment-evidence";

const performancePaths = deriveToolcraftPerformancePaths(
  starterSchema,
  starterPerformance,
);

test.setTimeout(180_000);

test("browser perf: toolcraft environment", async ({ page }) => {
  await page.goto("/");
  await attachToolcraftPerformanceEnvironmentEvidence(page);
});

test("browser perf: toolcraft adapter catalog", () => {
  compileToolcraftPerformancePathAdapterMatrix({
    adapters: appPerformancePathAdapters,
    canvasBacking: appPerformanceCanvasBacking,
    paths: performancePaths,
    schema: starterSchema,
  });
});

for (const path of performancePaths) {
  test(getToolcraftPerformancePathTestName(path), async ({ page }) => {
    const [entry] = compileToolcraftPerformancePathAdapterMatrix({
      adapters: appPerformancePathAdapters.filter(
        (adapter) => adapter.pathId === path.id,
      ),
      canvasBacking: appPerformanceCanvasBacking,
      paths: [path],
      schema: starterSchema,
    });
    if (!entry) {
      throw new Error(`Missing compiled performance path "${path.id}".`);
    }
    await runToolcraftPerformancePath(
      page,
      starterSchema,
      starterPerformance,
      entry,
    );
  });
}

test("browser perf: declared renderer layer selectors are present", async ({ page }) => {
  if (!starterPerformance.usesCustomRenderer) {
    return;
  }

  const visibleLayers =
    starterPerformance.rendererTechnique?.layers?.filter((layer) => layer.uiSelector) ?? [];

  await page.goto("/");

  for (const layer of visibleLayers) {
    await expect(
      page.locator(layer.uiSelector!).first(),
      `renderer layer "${layer.id}" should exist at ${layer.uiSelector}`,
    ).toBeVisible();
  }
});
