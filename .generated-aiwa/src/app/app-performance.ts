import {
  defineToolcraftPerformance,
  type ToolcraftEnvelopePerformanceConfig,
} from "@/toolcraft/runtime";

export const appPerformance: ToolcraftEnvelopePerformanceConfig =
  defineToolcraftPerformance({
    rendererStrategy: "none",
    scenarios: [],
    usesCustomRenderer: false,
    workloadEnvelope: {
      dimensions: [
        {
          defaultValue: 4096,
          id: "imageResolution",
          interactiveMax: 8192,
          mapping: "direct",
          source: { kind: "schema-target", target: "export.image.resolution" },
          unit: "px",
        },
      ],
    },
  });
