import { expect, test, type Page } from "@playwright/test";
import { starterAcceptance } from "../src/app/starter-acceptance";
import { starterPerformance } from "../src/app/starter-performance";
import { starterSchema } from "../src/app/starter-schema";
import { getToolcraftInfinityOverflowErrors } from "../src/app/acceptance/infinity-overflow";
import { attachToolcraftBrowserRuntimeEvidence } from "./browser-runtime-evidence";
import { runInfinityOverflowRecipe } from "./browser-infinity-overflow-recipe";
import type { ToolcraftInfinityEdgeProbe } from "./browser-infinity-overflow-pixels";
export type { ToolcraftInfinityEdgeProbe } from "./browser-infinity-overflow-pixels";

export async function expectToolcraftInfinityOverflowEvidence(page: Page, options: {
  requirementId: string;
  prepare: () => Promise<void>;
  probes: readonly ToolcraftInfinityEdgeProbe[];
}): Promise<void> {
  const entry = starterAcceptance.find(entry => entry.id === options.requirementId);
  const pipeline = starterPerformance.rendererPipeline;
  if (!entry?.infinityOverflowCoverage || !entry.browser || !pipeline) throw new Error("Infinity overflow proof requires a registered acceptance case and renderer pipeline.");
  expect(entry.browser.testName, "Overflow evidence belongs to its registered browser test").toBe(test.info().title);
  expect(getToolcraftInfinityOverflowErrors({ acceptance: starterAcceptance, rendererPipeline: pipeline, schema: starterSchema })).toEqual([]);
  await runInfinityOverflowRecipe(page, { ...options, coverage: entry.infinityOverflowCoverage, pipeline, schema: starterSchema });
  await attachToolcraftBrowserRuntimeEvidence({ evidenceType: "infinity-output-overflow", requirementId: entry.id, target: entry.target });
}
