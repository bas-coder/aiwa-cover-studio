import { describe, expect, it } from "vitest";

import {
  starterProductReadiness,
  starterTransferMode,
} from "./starter-acceptance";
import {
  schemaHasSvgExportPanelAction,
  schemaHasVideoExportPanelAction,
} from "./acceptance/output-export";
import { schemaHasProductSurface } from "./starter-acceptance.schema-test-utils";
import { starterSchema } from "./starter-schema";

describe("Toolcraft product readiness", () => {
  it("defaults generated apps to new Toolcraft assembly mode", () => {
    if (starterProductReadiness.mode !== "starter") {
      return;
    }

    expect(starterTransferMode).toEqual({
      animationIntent: { mode: "none" },
      mode: "new-toolcraft-app",
      referenceInputs: [],
    });
  });

  it("makes the no-reference decision explicit", () => {
    if (starterProductReadiness.mode !== "starter") {
      return;
    }

    expect(starterTransferMode.referenceInputs).toEqual([]);
  });

  it("allows neutral readiness only while the product surface is absent", () => {
    if (starterProductReadiness.mode === "product") {
      expect(starterProductReadiness.exportIntent).toBeDefined();
      if (starterProductReadiness.exportIntent.image.mode === "toolcraft-default") {
        expect(starterProductReadiness.exportIntent.image).toEqual({
          mode: "toolcraft-default",
        });
      }
      expect(starterProductReadiness.exportIntent.video.mode).toBe(
        schemaHasVideoExportPanelAction(starterSchema)
          ? "user-requested"
          : "not-requested",
      );
      expect(starterProductReadiness.exportIntent.svg.mode).toBe(
        schemaHasSvgExportPanelAction(starterSchema)
          ? "user-requested"
          : "not-requested",
      );
      expect(starterProductReadiness.productName.trim()).not.toBe("");
      expect(starterProductReadiness.productSummary.trim()).not.toBe("");
      expect(starterProductReadiness.requestedBehavior.trim()).not.toBe("");
      expect(starterProductReadiness.interactionOwnership).toBeDefined();
      expect(starterProductReadiness.viewInteraction).toBeDefined();
      expect(
        schemaHasProductSurface(),
        "Product readiness requires product surface: controls, layers, timeline, canvas content, default-media suppression, or acceptance coverage.",
      ).toBe(true);
      expect(
        starterSchema.panels.controls,
        "Generated product apps must define a controls panel so runtime Setup, product controls, background, export settings, and sticky export actions are visible.",
      ).toBeTruthy();
      expect(starterSchema.panels.controls?.sections[1]?.title).toBe("Settings");
      return;
    }

    expect(starterProductReadiness.reason.trim()).not.toBe("");
    expect(
      schemaHasProductSurface(),
      "Neutral starter readiness must not be used after adding product controls, timeline, layers, canvas content, default-media suppression, or acceptance coverage.",
    ).toBe(false);
  });
});
