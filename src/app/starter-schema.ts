import { defineToolcraft, mediaSourceModule } from "@repo/toolcraft-runtime";

import appDefaults from "./app-defaults.json" with { type: "json" };
import { starterAppIdentity } from "./starter-identity";

export const starterSchema = defineToolcraft({
  defaults: appDefaults,
  base: {
    canvas: {
      enabled: true,
      upload: true,
    },
    identity: starterAppIdentity,
    panels: {
      controls: {
        sections: [],
        title: "Controls",
      },
    },
    toolbar: {
      history: true,
      radar: true,
      zoom: true,
    },
  },
  modules: [mediaSourceModule()],
});
