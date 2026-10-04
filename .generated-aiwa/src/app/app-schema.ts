import { defineToolcraft, imageExportModule } from "@/toolcraft/runtime";

import appDefaults from "./app-defaults.json" with { type: "json" };
import { appIdentity } from "./app-identity";
import {
  aiwaPalette,
  bannerCategories,
  bannerPlatforms,
  defaultBannerCategory,
  defaultBannerCopy,
  defaultBannerPlatform,
  defaultHuggingFaceModelId,
  findBannerPlatform,
} from "./brand-profile";

const openGraph = findBannerPlatform(defaultBannerPlatform);

const always = { mode: "always" as const };

export const appSchema = defineToolcraft({
  defaults: appDefaults,
  base: {
    canvas: {
      draggable: true,
      enabled: true,
      size: {
        height: openGraph.height,
        unit: "px",
        width: openGraph.width,
      },
      sizing: { mode: "editable-output" },
      upload: false,
    },
    identity: appIdentity,
    panels: {
      controls: {
        sections: [
          {
            controls: {
              backgroundColor: {
                applicability: always,
                defaultValue: aiwaPalette.backdrop,
                label: "Color",
                orderRole: "color",
                performanceRole: "responsiveness",
                target: "appearance.background",
                type: "color",
              },
              includeBackground: {
                applicability: always,
                defaultValue: true,
                label: "Include",
                orderRole: "primary",
                performanceRole: "responsiveness",
                target: "export.includeBackground",
                type: "switch",
              },
            },
            description:
              "Runtime uses this pair as the Setup background behind the banner plate.",
            id: "brand.background",
            title: "Background",
          },
          {
            controls: {
              category: {
                applicability: always,
                defaultValue: defaultBannerCategory,
                description: "Sets the art-plate tone from the matching inspiration folder.",
                label: "Category",
                options: bannerCategories.map((category) => ({
                  label: category.label,
                  value: category.value,
                })),
                orderRole: "input",
                performanceRole: "responsiveness",
                target: "brief.category",
                type: "select",
              },
              platform: {
                applicability: always,
                defaultValue: defaultBannerPlatform,
                description:
                  "Names the channel in the prompt and on the poster. Canvas width and height in Setup own the pixel size.",
                label: "Platform",
                options: bannerPlatforms.map((platform) => ({
                  label: platform.label,
                  value: platform.value,
                })),
                orderRole: "input",
                performanceRole: "responsiveness",
                target: "brief.platform",
                type: "select",
              },
              headline: {
                applicability: always,
                commitMode: "content",
                defaultValue: defaultBannerCopy.headline,
                label: "Headline",
                orderRole: "input",
                performanceRole: "responsiveness",
                target: "copy.headline",
                textValueKind: "single-line",
                type: "text",
              },
              support: {
                applicability: always,
                commitMode: "content",
                defaultValue: defaultBannerCopy.support,
                description: "Supporting line under the headline.",
                label: "Support",
                orderRole: "input",
                performanceRole: "responsiveness",
                target: "copy.support",
                textValueKind: "single-line",
                type: "text",
              },
              cta: {
                applicability: always,
                commitMode: "content",
                defaultValue: defaultBannerCopy.cta,
                label: "CTA",
                orderRole: "input",
                performanceRole: "responsiveness",
                target: "copy.cta",
                textValueKind: "single-line",
                type: "text",
              },
            },
            description: "Choose the channel and write the type that stays sharp on the banner.",
            id: "brief",
            title: "Brief",
          },
          {
            controls: {
              token: {
                applicability: always,
                commitMode: "setting",
                defaultValue: "",
                description:
                  "Stored in this browser with the other settings and included in settings export. It is never written into the project.",
                label: "Token",
                orderRole: "input",
                performanceRole: "responsiveness",
                target: "art.token",
                textValueKind: "single-line",
                type: "text",
              },
              model: {
                applicability: always,
                commitMode: "setting",
                defaultValue: defaultHuggingFaceModelId,
                description:
                  "Paste a fine-tuned Hugging Face model id after training. Generate uses this id with the token.",
                label: "Model",
                orderRole: "input",
                performanceRole: "responsiveness",
                target: "art.model",
                textValueKind: "single-line",
                type: "text",
              },
              direction: {
                applicability: always,
                commitMode: "content",
                defaultValue: defaultBannerCopy.direction,
                description: "Short direction for the background plate only.",
                label: "Direction",
                orderRole: "input",
                performanceRole: "responsiveness",
                target: "art.direction",
                textValueKind: "single-line",
                type: "text",
              },
            },
            description:
              "The model paints only the background plate. Logo and type stay as real overlays.",
            id: "art",
            title: "Art",
          },
          {
            controls: {
              generate: {
                actions: [
                  {
                    icon: "wand-sparkles",
                    label: "Generate art",
                    value: "art.generate",
                  },
                ],
                applicability: always,
                defaultValue: null,
                label: false,
                orderRole: "action",
                performanceRole: "responsiveness",
                target: "art.generate",
                type: "panelActions",
              },
            },
            id: "art.command",
            title: "Generate",
          },
        ],
        title: "AIWA Banners",
      },
    },
    toolbar: {
      history: true,
      radar: true,
      theme: true,
      zoom: true,
    },
  },
  modules: [imageExportModule()],
});
