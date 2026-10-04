import {
  defineToolcraftPerformance,
  type ToolcraftEnvelopePerformanceConfig,
} from "@/toolcraft/runtime";

const imageExportResolutionTarget = "export.image.resolution";
const imageExportResolutionDimensionId = "image-export-long-edge";
const imageExportLongEdgeUnit = "px";
const defaultImageExportLongEdgePx = 4096;
const maximumImageExportLongEdgePx = 8192;

export const appPerformance: ToolcraftEnvelopePerformanceConfig =
  defineToolcraftPerformance({
    rendererStrategy: "none",
    scenarios: [],
    usesCustomRenderer: false,
    workloadEnvelope: {
      dimensions: [
        {
          batchMax: maximumImageExportLongEdgePx,
          defaultValue: defaultImageExportLongEdgePx,
          id: imageExportResolutionDimensionId,
          mapping: "direct",
          source: {
            kind: "schema-target",
            target: imageExportResolutionTarget,
          },
          unit: imageExportLongEdgeUnit,
        },
      ],
    },
  });
