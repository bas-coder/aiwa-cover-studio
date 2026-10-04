import { describe, expect, it } from "vitest";

import {
  appAcceptance,
  validateProductAcceptanceCoverage,
} from "./app-acceptance";
import { appPerformance } from "./app-performance";
import { appSchema } from "./app-schema";

describe("appSchema", () => {
  it("publishes the AIWA banner contract without layers, timeline, or video", () => {
    expect(appSchema.canvas.enabled).toBe(true);
    expect(appSchema.canvas.upload).toBe(false);
    expect(appSchema.canvas.sizing).toEqual({ mode: "editable-output" });
    expect(appSchema.canvas.size).toEqual({
      height: 630,
      unit: "px",
      width: 1200,
    });
    expect(appSchema.panels.layers).toBeUndefined();
    expect(appSchema.panels.timeline).toBeUndefined();
    expect(appSchema.modulePlan.modules.map(({ id }) => id)).toEqual([
      "image-export",
    ]);
    expect(
      appSchema.modulePlan.capabilities.map(({ capabilityId }) => capabilityId),
    ).toContain("artifact.image-export");
    expect(appSchema.assembly.capabilities).not.toContain("timeline.playback");
    expect(appSchema.assembly.capabilities).not.toContain("timeline.keyframes");
  });

  it("background include is the runtime background switch", () => {
    const setup = appSchema.panels.controls?.sections.find(
      (section) => section.id === "runtime.setup",
    );
    expect(setup?.controls.includeBackground).toMatchObject({
      target: "export.includeBackground",
      type: "switch",
    });
    expect(setup?.controls.background).toMatchObject({
      target: "appearance.background",
      type: "color",
    });
  });

  it("generate and export share the sticky footer", () => {
    const footer = appSchema.panels.controls?.sections
      .flatMap((section) => Object.values(section.controls))
      .find((control) => control.type === "panelActions");

    expect(footer?.target).toBe("art.generate");
    expect(
      footer?.actions?.map((action) =>
        typeof action === "string" ? action : action.value,
      ),
    ).toEqual(expect.arrayContaining(["art.generate", "export.png"]));
  });

  it("keeps banner performance paths empty until a measured iteration is requested", () => {
    expect(appPerformance.scenarios).toEqual([]);
    expect(appPerformance.workloadEnvelope).toEqual({ dimensions: [] });
    expect(appPerformance.usesCustomRenderer).toBe(false);
  });

  it("declares production reload coverage for the banner schema", () => {
    expect(appSchema.persistence.storage).toBe("localStorage");
    if (appSchema.persistence.storage !== "localStorage") {
      throw new Error("The banner must persist user settings in localStorage.");
    }
    expect(appSchema.persistence.include).toContain("canvas");
    expect(appSchema.persistence.include).toContain("values");
    expect(
      appAcceptance.find((entry) => entry.id === "persistence.reload"),
    ).toMatchObject({
      automated: true,
      evidence: "persistence-state",
      kind: "runtime",
      persistenceCoverage: "reload",
      persistenceSlices: appSchema.persistence.include,
    });
    expect(validateProductAcceptanceCoverage()).toEqual([]);
  });
});
