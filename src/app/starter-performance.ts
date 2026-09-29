import {
  defineToolcraftPerformance,
  type ToolcraftEnvelopePerformanceConfig,
} from "@repo/toolcraft-runtime";

export const starterPerformance: ToolcraftEnvelopePerformanceConfig =
  defineToolcraftPerformance({
    rendererStrategy: "none",
    scenarios: [],
    usesCustomRenderer: false,
    workloadEnvelope: { dimensions: [] },
  });
