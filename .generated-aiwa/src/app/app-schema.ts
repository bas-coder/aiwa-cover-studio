import { defineToolcraft, imageExportModule, layersModule, mediaSourceModule, timelineModule, videoExportModule } from "@/toolcraft/runtime";

import appDefaults from "./app-defaults.json" with { type: "json" };
import { appIdentity } from "./app-identity";

export const appSchema = defineToolcraft({
  defaults: appDefaults,
  base: {
    canvas: {
      enabled: true,
      size: { height: 630, unit: "px", width: 1200 },
      upload: true,
    },
    identity: appIdentity,
    panels: {
      controls: {
        sections: [
          { id: "brand.background", title: "Background", controls: {
            includeBackground: { applicability: { mode: "always" }, defaultValue: true, label: "Include", orderRole: "primary", performanceRole: "responsiveness", target: "export.includeBackground", type: "switch" },
            backgroundColor: { applicability: { mode: "always" }, defaultValue: "#17120f", label: "Color", orderRole: "color", performanceRole: "responsiveness", target: "appearance.background", type: "color" },
          }, layoutGroups: [{ controls: ["includeBackground", "backgroundColor"], layout: "inline", columns: 2 }] },
          { id: "brief", title: "Creative Brief", description: "Choose the output context, then generate constrained AIWA variations.", controls: {
            category: { applicability: { mode: "always" }, defaultValue: "brand", label: "Category", orderRole: "mode", performanceRole: "responsiveness", target: "brief.category", type: "select", options: ["Blog post","Brand","Changelog","Ebook","Event","Feature","Funding","New month","Hiring","Meme","New employee","Integration","New video","Partnership","Podcast","Promotion","Question","Review","Showcase","Webinar"].map(label => ({ label, value: label.toLowerCase().replaceAll(" ", "-") })) },
            platform: { applicability: { mode: "always" }, defaultValue: "Open Graph", label: "Platform", orderRole: "primary", performanceRole: "responsiveness", target: "brief.platform", type: "select", options: ["Open Graph","LinkedIn","X","Instagram","WhatsApp Status","YouTube","Custom"].map(value => ({ label: value, value })) },
            variations: { applicability: { mode: "always" }, defaultValue: "2", label: "Variations", orderRole: "detail", performanceRole: "responsiveness", target: "variation.count", type: "segmented", options: ["1","2","3","4"].map(value => ({ label: value, value })) },
            intensity: { applicability: { mode: "always" }, defaultValue: "balanced", label: "Direction", orderRole: "mode", performanceRole: "responsiveness", target: "brief.intensity", type: "segmented", options: [{label:"Safe",value:"conservative"},{label:"Balanced",value:"balanced"},{label:"Bold",value:"experimental"}] },
            generate: { applicability: { mode: "always" }, actions: [{ icon: "wand-sparkles", label: "Generate variations", value: "generate.variations" }], defaultValue: null, label: false, orderRole: "action", target: "brief.actions", type: "actions" },
          } },
          { id: "copy", title: "Copy", controls: {
            eyebrow: { applicability: { mode: "always" }, commitMode: "content", defaultValue: "AIWA intelligence", label: "Eyebrow", orderRole: "input", performanceRole: "responsiveness", target: "copy.eyebrow", textValueKind: "single-line", type: "text" },
            title: { applicability: { mode: "always" }, commitMode: "content", defaultValue: "A better way to build what matters", label: "Headline", orderRole: "primary", performanceRole: "responsiveness", target: "copy.title", textValueKind: "multiline", type: "code", keyframeable: false },
            subtitle: { applicability: { mode: "always" }, commitMode: "content", defaultValue: "Turn focused ideas into high-quality experiences with an AI-assisted creative system built for your brand.", label: "Supporting copy", orderRole: "input", performanceRole: "responsiveness", target: "copy.subtitle", textValueKind: "multiline", type: "code" },
            cta: { applicability: { mode: "always" }, commitMode: "content", defaultValue: "Explore the story", label: "CTA", orderRole: "input", performanceRole: "responsiveness", target: "copy.cta", textValueKind: "single-line", type: "text" },
          } },
          { id: "composition", title: "Composition", controls: {
            layout: { applicability: { mode: "always" }, defaultValue: "editorial", label: "Layout", orderRole: "mode", performanceRole: "responsiveness", target: "composition.layout", type: "select", options: [{label:"Editorial",value:"editorial"},{label:"Centered",value:"centered"},{label:"Split",value:"split"}] },
            visualStyle: { applicability: { mode: "always" }, defaultValue: "focus-card", label: "Visual treatment", orderRole: "mode", performanceRole: "responsiveness", target: "composition.visualStyle", type: "select", options: [{label:"Focus card",value:"focus-card"},{label:"Workflow nodes",value:"workflow"},{label:"Product object",value:"product-object"}] },
            unlocked: { applicability: { mode: "always" }, defaultValue: false, label: "Unlock layout", orderRole: "advanced", performanceRole: "responsiveness", target: "composition.unlocked", type: "switch" },
            guides: { applicability: { mode: "always" }, defaultValue: true, label: "Guides", orderRole: "detail", performanceRole: "responsiveness", target: "composition.guides", type: "switch" },
            crop: { applicability: { mode: "always" }, defaultValue: false, label: "Crop preview", orderRole: "detail", performanceRole: "responsiveness", target: "composition.cropPreview", type: "switch" },
            seed: { applicability: { mode: "always" }, defaultValue: 1, label: "Variation", min: 1, max: 24, step: 1, sliderValueKind: "discrete", orderRole: "strength", performanceRole: "responsiveness", target: "variation.seed", type: "slider", keyframeable: false },
          }, layoutGroups: [{ controls: ["guides","crop"], layout: "inline", columns: 2 }] },
          { id: "media", title: "Source Image", controls: {
            source: { applicability: { mode: "always" }, assetKind: "image", defaultValue: null, hardMaxItems: 4, label: "Upload", multiple: true, orderRole: "input", performanceRole: "responsiveness", target: "media.source", type: "fileDrop" },
          } },
          { id: "motion", title: "Motion", controls: {
            preset: { applicability: { mode: "always" }, defaultValue: "drift", label: "Preset", orderRole: "mode", performanceRole: "responsiveness", target: "motion.preset", type: "select", options: [{label:"Subtle drift",value:"drift"},{label:"Reveal",value:"reveal"},{label:"Pulse",value:"pulse"}] },
            amount: { applicability: { mode: "always" }, defaultValue: 28, label: "Amount", min: 0, max: 100, step: 1, unit: "%", orderRole: "strength", performanceRole: "responsiveness", target: "motion.amount", type: "slider", keyframeable: true },
          } },
          { id: "quality", title: "Quality", description: "Fast, explainable checks for hierarchy, legibility, overflow, logo safety, and crop risk.", controls: {
            checks: { applicability: { mode: "always" }, actions: [{ icon: "check", label: "Run quality checks", value: "quality.check" }], defaultValue: null, label: false, orderRole: "action", target: "quality.actions", type: "actions" },
          } },
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
  modules: [mediaSourceModule(), layersModule(), timelineModule({ mode: "keyframes", defaultDurationSeconds: 6 }), imageExportModule(), videoExportModule()],
});
