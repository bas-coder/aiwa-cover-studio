import { composeToolcraftApp } from "@/toolcraft/runtime/react";

import { appSchema } from "./app-schema";
import { exportRenderer } from "./export-renderer";
import { ProductScene } from "./product-scene";
import { gradeCover } from "./quality";

export const appComposition = composeToolcraftApp(appSchema, {
  actions: {
    onPanelAction: ({ action, dispatch, reportFeedback, state }) => {
      if (action.value === "generate.variations") {
        const current = Number(state.values["variation.seed"] ?? 1);
        dispatch({
          type: "controls.setValue",
          target: "variation.seed",
          value: current >= 24 ? 1 : current + 1,
          label: "Generate variation",
        });
        reportFeedback({
          code: "variation-ready",
          message:
            "A new deterministic variation is ready. Copy, layout, and motion remain fully editable.",
        });
      }
      if (action.value === "quality.check") {
        const result = gradeCover(state.values);
        reportFeedback({
          code: "quality-result",
          message: result.issues.length
            ? `Quality ${result.score}/100 — ${result.issues.join(" ")}`
            : `Quality ${result.score}/100 — Ready to export.`,
        });
      }
    },
  },
  scene: {
    canvasContent: <ProductScene />,
    rasterFrameRenderer: exportRenderer,
    renderDefaultCanvasMedia: true,
  },
});
