import { describe, expect, it } from "vitest";

import { starterSchema } from "../starter-schema";
import { getToolcraftPersistenceCoverageResult } from "./runtime-coverage";
import {
  starterProductReadiness,
  starterTransferMode,
} from "../starter-acceptance-data";
import {
  getBlockingToolcraftAcceptanceMessages,
  runToolcraftAcceptanceValidators,
  type ToolcraftAcceptanceValidationContext,
} from "./validation-pipeline";

const context: ToolcraftAcceptanceValidationContext = {
  acceptance: [],
  controls: [],
  hasVideoExportAction: false,
  layersEnabled: false,
  persistence: getToolcraftPersistenceCoverageResult({
    acceptance: [],
    schema: starterSchema,
  }),
  productReadiness: starterProductReadiness,
  schema: starterSchema,
  sectionInventory: [],
  timelineMode: null,
  transferMode: starterTransferMode,
};

describe("Toolcraft acceptance validation pipeline", () => {
  it("reports heuristics without turning them into blocking errors", () => {
    const diagnostics = runToolcraftAcceptanceValidators(context, [
      {
        path: "schema.panels.controls.sections",
        ruleId: "controls-layout-heuristics",
        validate: () => ["Prefer a more cohesive section grouping."],
      },
    ]);

    expect(diagnostics).toEqual([
      {
        message: "Prefer a more cohesive section grouping.",
        path: "schema.panels.controls.sections",
        ruleId: "controls-layout-heuristics",
        severity: "warning",
      },
    ]);
    expect(getBlockingToolcraftAcceptanceMessages(diagnostics)).toEqual([]);
  });

  it("keeps invariant diagnostics blocking", () => {
    const diagnostics = runToolcraftAcceptanceValidators(context, [
      {
        path: "schema.panels.controls",
        ruleId: "controls-section-inventory-required",
        validate: () => ["A product controls section inventory is required."],
      },
    ]);

    expect(getBlockingToolcraftAcceptanceMessages(diagnostics)).toEqual([
      "A product controls section inventory is required.",
    ]);
  });
});
