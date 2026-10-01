import { describe, expect, it } from "vitest";

import {
  appAcceptance,
  validateProductAcceptanceCoverage,
} from "./app-acceptance";
import { appPerformance } from "./app-performance";
import { appSchema } from "./app-schema";

describe("appSchema", () => {
  it("publishes the poster studio contract", () => {
    expect(appSchema.canvas.upload).toBe(false);
    expect(appSchema.canvas.size).toMatchObject({ height: 630, width: 1200 });
    expect(appSchema.panels.layers).toBeUndefined();
    expect(appSchema.panels.timeline?.mode).toBe("playback");
    expect(appSchema.panels.timeline?.defaultDurationSeconds).toBe(4);
    expect(appSchema.assembly.components).toEqual([
      "canvas",
      "controlsPanel",
      "timelinePanel",
      "toolbar",
    ]);
    expect(appSchema.assembly.capabilities).toContain("timeline.playback");
    expect(appSchema.modulePlan.capabilities.map(({ capabilityId }) => capabilityId)).toContain(
      "artifact.image-export",
    );
    expect(appSchema.assembly.capabilities).not.toContain("timeline.keyframes");
    expect(appSchema.assembly.capabilities).not.toContain("artifact.video-export");
    expect(appSchema.assembly.commands).toContain("timeline.setCurrentTime");
    expect(appSchema.assembly.commands).not.toContain("media.importBatch");
    expect(appSchema.panels.controls?.sections[1]?.title).toBe("Settings");
  });

  it("keeps the marketer flow in product sections after Setup", () => {
    const titles = appSchema.panels.controls?.sections.map((section) => section.title) ?? [];
    expect(titles).toContain("Start");
    expect(titles).toContain("Copy");
    expect(titles).toContain("Placement");
    expect(titles).toContain("Motion");
    expect(titles).not.toContain("Creative Brief");
  });

  it("keeps starter performance paths empty until the generated product adds controls", () => {
    expect(appPerformance.scenarios).toEqual([]);
    expect(appPerformance.workloadEnvelope.dimensions.map(({ id }) => id)).toEqual([
      "imageResolution",
    ]);
  });

  it("declares production reload coverage for the starter schema", () => {
    expect(appSchema.persistence.storage).toBe("localStorage");
    if (appSchema.persistence.storage !== "localStorage") {
      throw new Error("The poster studio must persist user settings in localStorage.");
    }
    expect(appSchema.persistence.include).toContain("canvas");
    expect(appAcceptance.find((entry) => entry.id === "persistence.reload")).toMatchObject({
      automated: true,
      browser: {
        budget: "extended-io",
        file: "e2e/app-persistence.spec.ts",
      },
      evidence: "persistence-state",
      kind: "runtime",
      persistenceCoverage: "reload",
      persistenceSlices: appSchema.persistence.include,
      target: "canvas.size.width",
    });
    expect(validateProductAcceptanceCoverage()).toEqual([]);
  });
});
