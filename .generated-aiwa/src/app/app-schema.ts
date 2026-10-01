import { defineToolcraft, imageExportModule, timelineModule } from "@/toolcraft/runtime";

import appDefaults from "./app-defaults.json" with { type: "json" };
import { appIdentity } from "./app-identity";
import { posterInk, sampleBrief, sampleDesign } from "./design-model";

const restingPoint = { x: 0, y: 0 };

export const appSchema = defineToolcraft({
  defaults: appDefaults,
  base: {
    canvas: {
      enabled: true,
      size: { height: 630, unit: "px", width: 1200 },
      upload: false,
    },
    identity: appIdentity,
    panels: {
      controls: {
        sections: [
          {
            controls: {
              backgroundColor: {
                applicability: { mode: "always" },
                defaultValue: posterInk,
                label: "Color",
                orderRole: "color",
                performanceRole: "responsiveness",
                target: "appearance.background",
                type: "color",
              },
              includeBackground: {
                applicability: { mode: "always" },
                defaultValue: true,
                label: "Include",
                orderRole: "primary",
                performanceRole: "responsiveness",
                target: "export.includeBackground",
                type: "switch",
              },
            },
            id: "brand.background",
            layoutGroups: [
              {
                columns: 2,
                controls: ["includeBackground", "backgroundColor"],
                layout: "inline",
              },
            ],
            title: "Background",
          },
          {
            controls: {
              brief: {
                applicability: { mode: "always" },
                commitMode: "content",
                defaultValue: sampleBrief,
                description: "Use Kind, Claim, Proof, and Ask lines. Generate builds the poster from those lines.",
                label: "Brief",
                orderRole: "input",
                performanceRole: "responsiveness",
                target: "brief.text",
                textValueKind: "multiline",
                type: "code",
              },
            },
            description: "Paste the brief, generate the poster, rewrite the words, then export.",
            id: "brief",
            title: "Start",
          },
          {
            controls: {
              generate: {
                actions: [{ icon: "wand-sparkles", label: "Generate", value: "design.generate" }],
                applicability: { mode: "always" },
                defaultValue: null,
                label: false,
                orderRole: "action",
                performanceRole: "responsiveness",
                target: "design.generate",
                type: "actions",
              },
            },
            id: "generate",
            title: "Generate",
          },
          {
            controls: {
              action: {
                applicability: { mode: "always" },
                commitMode: "content",
                defaultValue: sampleDesign.copy.ask,
                label: "Action",
                orderRole: "input",
                performanceRole: "responsiveness",
                target: "copy.cta",
                textValueKind: "single-line",
                type: "text",
              },
              eyebrow: {
                applicability: { mode: "always" },
                commitMode: "content",
                defaultValue: sampleDesign.copy.eyebrow,
                label: "Eyebrow",
                orderRole: "input",
                performanceRole: "responsiveness",
                target: "copy.eyebrow",
                textValueKind: "single-line",
                type: "text",
              },
            },
            id: "copy",
            title: "Copy",
          },
          {
            controls: {
              title: {
                applicability: { mode: "always" },
                commitMode: "content",
                defaultValue: sampleDesign.copy.claim,
                label: false,
                orderRole: "input",
                performanceRole: "responsiveness",
                target: "copy.title",
                textValueKind: "multiline",
                type: "code",
              },
            },
            id: "headline",
            title: "Headline",
          },
          {
            controls: {
              support: {
                applicability: { mode: "always" },
                commitMode: "content",
                defaultValue: sampleDesign.copy.proof,
                label: false,
                orderRole: "input",
                performanceRole: "responsiveness",
                target: "copy.subtitle",
                textValueKind: "multiline",
                type: "code",
              },
            },
            id: "support",
            title: "Support",
          },
          {
            controls: {
              arrangement: {
                applicability: { mode: "always" },
                defaultValue: sampleDesign.arrangement,
                label: false,
                options: [
                  { label: "Editorial", value: "editorial" },
                  { label: "Split", value: "split" },
                  { label: "Poster", value: "poster" },
                ],
                orderRole: "mode",
                performanceRole: "responsiveness",
                target: "design.arrangement",
                type: "segmented",
              },
            },
            id: "arrangement",
            title: "Arrangement",
          },
          {
            controls: {
              askPlace: {
                applicability: { mode: "always" },
                coordinateMode: "screen",
                defaultValue: restingPoint,
                label: "Action",
                orderRole: "spatial",
                performanceRole: "responsiveness",
                target: "place.ask",
                type: "vector",
              },
              claimPlace: {
                applicability: { mode: "always" },
                coordinateMode: "screen",
                defaultValue: restingPoint,
                label: "Headline",
                orderRole: "spatial",
                performanceRole: "responsiveness",
                target: "place.claim",
                type: "vector",
              },
              markPlace: {
                applicability: { mode: "always" },
                coordinateMode: "screen",
                defaultValue: restingPoint,
                label: "Graphic",
                orderRole: "spatial",
                performanceRole: "responsiveness",
                target: "place.mark",
                type: "vector",
              },
            },
            id: "placement",
            title: "Placement",
          },
          {
            controls: {
              enabled: {
                applicability: { mode: "always" },
                defaultValue: false,
                description: "Plays a short fade, slide, scale, and mask shift on the poster you already have.",
                label: "Loop",
                orderRole: "primary",
                performanceRole: "responsiveness",
                target: "motion.enabled",
                type: "switch",
              },
              apply: {
                actions: [{ icon: "play", label: "Add motion", value: "motion.apply" }],
                applicability: { mode: "always" },
                defaultValue: null,
                label: false,
                orderRole: "action",
                performanceRole: "responsiveness",
                target: "motion.apply",
                type: "actions",
              },
            },
            id: "motion",
            title: "Motion",
          },
        ],
        title: "AIWA Cover Studio",
      },
    },
    toolbar: {
      history: true,
      radar: true,
      zoom: true,
    },
  },
  modules: [
    timelineModule({ defaultDurationSeconds: 4, mode: "playback" }),
    imageExportModule(),
  ],
});
