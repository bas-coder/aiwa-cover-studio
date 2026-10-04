import { composeToolcraftApp } from "@/toolcraft/runtime/react";

import { clearArtPlate, setArtPlate } from "./art-plate";
import { bannerExportRenderer } from "./banner-export";
import { bannerSceneRect } from "./banner-geometry";
import { BannerScene } from "./banner-scene";
import {
  buildArtPrompt,
  defaultBannerCategory,
  defaultBannerCopy,
  defaultBannerPlatform,
  defaultHuggingFaceModelId,
  readBannerText,
} from "./brand-profile";
import { requestHuggingFaceArt } from "./hugging-face-art";
import { appSchema } from "./app-schema";

const startedProgress = 0.15;
const finishedProgress = 1;

export const appComposition = composeToolcraftApp(appSchema, {
  actions: {
    onPanelAction: async ({ action, reportFeedback, reportProgress, state }) => {
      if (action.value !== "art.generate") {
        return;
      }

      const values = state.values;
      reportProgress(startedProgress);
      const result = await requestHuggingFaceArt({
        modelId: readBannerText(values, "art.model", defaultHuggingFaceModelId),
        prompt: buildArtPrompt({
          category: readBannerText(values, "brief.category", defaultBannerCategory),
          direction: readBannerText(values, "art.direction", defaultBannerCopy.direction),
          platform: readBannerText(values, "brief.platform", defaultBannerPlatform),
        }),
        token: readBannerText(values, "art.token", ""),
      });

      if (!result.ok) {
        clearArtPlate();
        reportFeedback({ code: "art-local", message: result.message });
        return;
      }

      await setArtPlate(result.blob);
      reportProgress(finishedProgress);
      reportFeedback({
        code: "art-ready",
        message: "The art plate is ready. Logo and type stay locked on top.",
      });
    },
  },
  scene: {
    canvasContent: <BannerScene />,
    rasterFrameRenderer: bannerExportRenderer,
    renderDefaultCanvasMedia: false,
    sceneBoundsProvider: ({ state }) => [bannerSceneRect(state.canvas.size)],
  },
});
