import { getToolcraftFiniteArtboardRect } from "@/toolcraft/runtime";
import { composeToolcraftApp } from "@/toolcraft/runtime/react";

import { appSchema } from "./app-schema";
import { composeDesign } from "./design-model";
import { exportRenderer } from "./export-renderer";
import { ProductScene } from "./product-scene";

const restingPoint = { x: 0, y: 0 };
const loopStartSeconds = 0;

export const appComposition = composeToolcraftApp(appSchema, {
  actions: {
    onPanelAction: ({ action, dispatch, reportFeedback, state }) => {
      if (action.value === "design.generate") {
        const brief = state.values["brief.text"];
        const design = composeDesign(typeof brief === "string" ? brief : "");
        if (design.issues.length > 0) {
          reportFeedback({
            code: "poster-held",
            message: design.issues.join(" "),
          });
          return;
        }
        dispatch({
          label: "Generate poster",
          type: "controls.apply",
          values: {
            "appearance.background": design.background,
            "copy.cta": design.copy.ask,
            "copy.eyebrow": design.copy.eyebrow,
            "copy.subtitle": design.copy.proof,
            "copy.title": design.copy.claim,
            "design.arrangement": design.arrangement,
            "place.ask": restingPoint,
            "place.claim": restingPoint,
            "place.mark": restingPoint,
          },
        });
        reportFeedback({
          code: "poster-ready",
          message: "Poster ready. Rewrite the words or nudge the pieces, then export.",
        });
      }

      if (action.value === "motion.apply") {
        dispatch({
          label: "Add motion",
          target: "motion.enabled",
          type: "controls.setValue",
          value: true,
        });
        dispatch({
          currentTimeSeconds: loopStartSeconds,
          type: "timeline.setCurrentTime",
        });
        dispatch({
          isPlaying: true,
          type: "timeline.setPlaying",
        });
        reportFeedback({
          code: "motion-ready",
          message: "Motion is playing on the current poster.",
        });
      }
    },
  },
  scene: {
    canvasContent: <ProductScene />,
    rasterFrameRenderer: exportRenderer,
    renderDefaultCanvasMedia: false,
    sceneBoundsProvider: ({ state }) => [getToolcraftFiniteArtboardRect(state.canvas.size)],
  },
});
