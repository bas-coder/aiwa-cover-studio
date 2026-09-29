import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import type { ToolcraftEnvelopePerformanceConfig } from "@repo/toolcraft-runtime";

import { parseRendererProviderCatalog } from "../toolcraft/renderer-providers/provider-config.mjs";
import {
  starterAcceptance,
  starterControlSectionInventory,
  starterProductReadiness,
  starterTransferMode,
  validateProductAcceptanceCoverage,
  validateToolcraftAcceptanceCoverage,
} from "./starter-acceptance";
import { getToolcraftRendererProviderConfigurationErrors } from "./acceptance/renderer-provider";
import { starterSchema } from "./starter-schema";
import { schemaHasProductSurface } from "./starter-acceptance.schema-test-utils";
import { starterPerformance } from "./starter-performance";

const appDir = dirname(fileURLToPath(import.meta.url));
const projectDir = join(appDir, "../..");
const rendererTechnique: ToolcraftEnvelopePerformanceConfig["rendererTechnique"] =
  starterPerformance.rendererTechnique;

describe("Toolcraft starter base acceptance coverage", () => {
  it("validates the real renderer provider configuration", () => {
    const performanceSource = readFileSync(
      join(projectDir, "src/app/starter-performance.ts"),
      "utf8",
    );
    const catalogSource = JSON.parse(
      readFileSync(
        join(projectDir, "src/toolcraft/renderer-providers/catalog.json"),
        "utf8",
      ),
    ) as unknown;
    const provider = parseRendererProviderCatalog(catalogSource).providers.vgpu;
    const packageJson = JSON.parse(
      readFileSync(join(projectDir, "package.json"), "utf8"),
    ) as { dependencies?: Record<string, string> };

    expect(
      getToolcraftRendererProviderConfigurationErrors({
        catalog: catalogSource,
        gpu: rendererTechnique?.gpu,
        packageJson,
      }),
    ).toEqual([]);
    if (starterProductReadiness.mode === "starter") {
      expect(starterPerformance).not.toHaveProperty("rendererTechnique");
      expect(performanceSource).not.toMatch(
        /rendererTechnique|integrations\/vgpu/u,
      );
      for (const dependency of provider.dependencies) {
        expect(packageJson.dependencies?.[dependency.name]).toBeUndefined();
      }
    }
  });

  it("requires acceptance coverage for every visible schema control", () => {
    expect(validateProductAcceptanceCoverage()).toEqual([]);
  });

  it("validates equivalent product data independently from object identity", () => {
    const clonedSchema = structuredClone(starterSchema);
    const clonedAcceptance = structuredClone(starterAcceptance);
    const clonedTransferMode = structuredClone(starterTransferMode);
    const clonedSectionInventory = structuredClone(
      starterControlSectionInventory,
    );
    const clonedProductReadiness = structuredClone(starterProductReadiness);

    expect(
      validateToolcraftAcceptanceCoverage({
        acceptance: clonedAcceptance,
        productReadiness: clonedProductReadiness,
        schema: clonedSchema,
        sectionInventory: clonedSectionInventory,
        transferMode: clonedTransferMode,
      }),
    ).toEqual(validateProductAcceptanceCoverage());
  });

  it("requires generated product apps to publish a control section inventory", () => {
    if (!schemaHasProductSurface()) {
      expect(starterControlSectionInventory).toEqual([]);
      return;
    }

    expect(
      starterControlSectionInventory.length,
      "Product apps must export starterControlSectionInventory so section grouping decisions are machine-checkable.",
    ).toBeGreaterThan(0);
    expect(validateProductAcceptanceCoverage()).toEqual([]);
  });
});
