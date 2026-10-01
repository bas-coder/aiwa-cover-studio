import { getToolcraftTimelineLoopProgress, type ToolcraftProductExportRenderer } from "@/toolcraft/runtime";

import { paintPoster, readPosterFrame } from "./poster-paint";

export const exportRenderer: ToolcraftProductExportRenderer = {
  baseFileName: "aiwa-cover",
  renderFrame({ context, frame, state }) {
    const progress = getToolcraftTimelineLoopProgress({
      currentTimeSeconds: state.timeline.currentTimeSeconds,
      durationSeconds: state.timeline.durationSeconds,
    });
    paintPoster(context, frame, readPosterFrame(state.values, progress));
  },
};
