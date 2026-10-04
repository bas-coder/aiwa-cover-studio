import type {
  ToolcraftComponentAcceptance,
  ToolcraftControlSectionInventoryEntry,
  ToolcraftInteractionOwnershipEntry,
  ToolcraftProductReadiness,
  ToolcraftTransferMode,
} from "./acceptance/types";
import { appSchema } from "./app-schema";
import {
  bannerCategories,
  bannerPlatforms,
} from "./brand-profile";

const persistenceSlices =
  appSchema.persistence.storage === "localStorage"
    ? appSchema.persistence.include
    : [];

const posterTest = {
  budget: "standard" as const,
  file: "e2e/app-banner.spec.ts" as const,
  testName: "browser: banner controls change the poster",
};

const exportTest = {
  budget: "extended-io" as const,
  file: "e2e/app-banner.spec.ts" as const,
  testName: "browser: image export writes the banner plate",
};

const backgroundTest = {
  budget: "standard" as const,
  file: "e2e/app-banner.spec.ts" as const,
  testName: "browser: background exclusion hides the preview fill",
};

const infinityModeTest = {
  budget: "standard" as const,
  file: "e2e/app-banner.spec.ts" as const,
  testName: "browser: infinity keeps the banner frame",
};

const infinityExportTest = {
  budget: "extended-io" as const,
  file: "e2e/app-banner.spec.ts" as const,
  testName: "browser: infinity export uses the banner scene bounds",
};

function ownership(
  entry: ToolcraftInteractionOwnershipEntry,
): ToolcraftInteractionOwnershipEntry {
  return entry;
}

const panelAlternative = {
  reason: "The canvas shows the finished poster and does not edit this value.",
  surface: "canvas" as const,
};

export const appTransferMode: ToolcraftTransferMode = {
  animationIntent: { mode: "none" },
  mode: "new-toolcraft-app",
  referenceInputs: [],
};

export const appProductReadiness: ToolcraftProductReadiness = {
  exportIntent: {
    image: { mode: "toolcraft-default" },
    svg: { mode: "not-requested" },
    video: { mode: "not-requested" },
  },
  interactionOwnership: [
    ownership({
      alternative: panelAlternative,
      capability: "property-edit",
      evidence: {
        detail: "The brief is typed copy, so the panel is the usable editing surface.",
        source: "usability-analysis",
      },
      id: "choose-category",
      reason: "Category chooses a tone for the plate and is clearer as a labeled list.",
      selectionScope: { mode: "global" },
      surface: "panel",
      target: "brief.category",
    }),
    ownership({
      alternative: panelAlternative,
      capability: "property-edit",
      evidence: {
        detail: "Platform names the channel. Pixel size stays in Setup, not on the canvas.",
        source: "usability-analysis",
      },
      id: "choose-platform",
      reason: "A labeled platform list is easier to scan than a canvas gesture.",
      selectionScope: { mode: "global" },
      surface: "panel",
      target: "brief.platform",
    }),
    ownership({
      alternative: panelAlternative,
      capability: "property-edit",
      evidence: {
        detail: "Headline text must stay exact, so it is typed in the panel.",
        source: "usability-analysis",
      },
      id: "edit-headline",
      reason: "Typing the headline in the panel keeps the letters exact and editable.",
      selectionScope: { mode: "global" },
      surface: "panel",
      target: "copy.headline",
    }),
    ownership({
      alternative: panelAlternative,
      capability: "property-edit",
      evidence: {
        detail: "Supporting copy is a paragraph, so the panel owns the text.",
        source: "usability-analysis",
      },
      id: "edit-support",
      reason: "The supporting line is typed copy and does not need a canvas handle.",
      selectionScope: { mode: "global" },
      surface: "panel",
      target: "copy.support",
    }),
    ownership({
      alternative: panelAlternative,
      capability: "property-edit",
      evidence: {
        detail: "The CTA is a short label typed beside the other banner copy.",
        source: "usability-analysis",
      },
      id: "edit-cta",
      reason: "The call to action is typed copy and stays locked as real text.",
      selectionScope: { mode: "global" },
      surface: "panel",
      target: "copy.cta",
    }),
    ownership({
      alternative: panelAlternative,
      capability: "precise-value-entry",
      evidence: {
        detail: "The token is a secret string and must not be painted on the canvas.",
        source: "usability-analysis",
      },
      id: "edit-token",
      reason: "A token field in the panel keeps the secret out of the poster.",
      selectionScope: { mode: "global" },
      surface: "panel",
      target: "art.token",
    }),
    ownership({
      alternative: panelAlternative,
      capability: "precise-value-entry",
      evidence: {
        detail: "The model id is a Hugging Face path pasted after training.",
        source: "user-request",
      },
      id: "edit-model",
      reason: "Pasting a model id is a precise panel field, not a canvas edit.",
      selectionScope: { mode: "global" },
      surface: "panel",
      target: "art.model",
    }),
    ownership({
      alternative: panelAlternative,
      capability: "property-edit",
      evidence: {
        detail: "Art direction is a short note for the background plate.",
        source: "usability-analysis",
      },
      id: "edit-direction",
      reason: "Direction is written in the panel and only affects the generated plate.",
      selectionScope: { mode: "global" },
      surface: "panel",
      target: "art.direction",
    }),
    ownership({
      alternative: {
        reason: "The canvas displays the plate and does not start a network request.",
        surface: "canvas",
      },
      capability: "command",
      evidence: {
        detail: "Generate is a panel action that calls the selected Hugging Face model.",
        source: "user-request",
      },
      id: "generate-art",
      reason: "Generating the plate is a command next to the token and model fields.",
      surface: "panel",
      target: "art.generate",
    }),
  ],
  mode: "product",
  productName: "AIWA Banners",
  productSummary:
    "Paints a brand-constrained art plate from a Hugging Face model and locks the AIWA logo and type on top.",
  requestedBehavior:
    "Ask for a Hugging Face token, generate the banner art from a Hugging Face model, and keep logo and copy as real overlays.",
  viewInteraction: {
    mode: "non-spatial",
    reason:
      "The banner is a flat poster. There is no camera, model orbit, or three-dimensional scene.",
  },
};

export const appAcceptance: readonly ToolcraftComponentAcceptance[] = [
  {
    automated: true,
    automatedTestName: "declares production reload coverage for the banner schema",
    browser: {
      budget: "extended-io",
      file: "e2e/app-persistence.spec.ts",
      testName:
        "browser: app restores exact canvas, values, and panel workspace slices after reload",
    },
    componentType: "persistence",
    evidence: "persistence-state",
    expectedObservable:
      "Canvas size and zoom, their runtime values, and the moved and collapsed Controls workspace remain visibly restored after a real browser reload.",
    fixture: "banner runtime persisted workspace",
    id: "persistence.reload",
    kind: "runtime",
    persistenceCoverage: "reload",
    persistenceSlices,
    target: "canvas.size.width",
    userAction:
      "Edit Canvas width and zoom, move and collapse Controls, wait for persistence, and reload the page.",
  },
  {
    automated: true,
    automatedTestName: "background include is the runtime background switch",
    backgroundOutputCoverage: "all-required-background-output",
    browser: backgroundTest,
    componentType: "switch",
    evidence: "product-output",
    expectedObservable:
      "Turning Background off hides the Setup fill in preview and exports transparent edges around the plate.",
    fixture: "default banner with background included",
    id: "background.include",
    kind: "control",
    target: "export.includeBackground",
    userAction: "Turn Background off and export a PNG.",
  },
  {
    automated: true,
    automatedTestName: "background color is the runtime backdrop",
    browser: posterTest,
    componentType: "color",
    evidence: "command-side-effect",
    expectedObservable: "The Background color value changes and the Setup fill uses that color.",
    fixture: "default backdrop color",
    id: "background.color",
    kind: "control",
    target: "appearance.background",
    userAction: "Change Background color.",
  },
  {
    automated: true,
    automatedTestName: "category changes the poster label and prompt tone",
    browser: posterTest,
    componentType: "select",
    evidence: "product-output",
    expectedObservable: "Each category changes the poster label and the art prompt tone.",
    fixture: "brand category",
    id: "brief.category",
    interactionId: "choose-category",
    kind: "control",
    optionCoverage: bannerCategories.map((category) => category.value),
    target: "brief.category",
    userAction: "Choose another category.",
  },
  {
    automated: true,
    automatedTestName: "platform changes the poster channel label",
    browser: posterTest,
    componentType: "select",
    evidence: "product-output",
    expectedObservable: "Each platform changes the channel name locked on the poster.",
    fixture: "Open Graph platform",
    id: "brief.platform",
    interactionId: "choose-platform",
    kind: "control",
    optionCoverage: bannerPlatforms.map((platform) => platform.value),
    target: "brief.platform",
    userAction: "Choose another platform.",
  },
  {
    automated: true,
    automatedTestName: "headline changes the locked poster type",
    browser: posterTest,
    componentType: "text",
    evidence: "product-output",
    expectedObservable: "The poster headline uses the typed value.",
    fixture: "default headline",
    id: "brief.headline",
    interactionId: "edit-headline",
    kind: "control",
    target: "copy.headline",
    userAction: "Edit the headline.",
  },
  {
    automated: true,
    automatedTestName: "support changes the locked poster type",
    browser: posterTest,
    componentType: "text",
    evidence: "product-output",
    expectedObservable: "The poster supporting line uses the typed value.",
    fixture: "default supporting copy",
    id: "brief.support",
    interactionId: "edit-support",
    kind: "control",
    target: "copy.support",
    userAction: "Edit the supporting copy.",
  },
  {
    automated: true,
    automatedTestName: "cta changes the locked poster type",
    browser: posterTest,
    componentType: "text",
    evidence: "product-output",
    expectedObservable: "The poster CTA uses the typed value.",
    fixture: "default CTA",
    id: "brief.cta",
    interactionId: "edit-cta",
    kind: "control",
    target: "copy.cta",
    userAction: "Edit the CTA.",
  },
  {
    automated: true,
    automatedTestName: "token stays off the poster",
    browser: posterTest,
    componentType: "text",
    evidence: "command-side-effect",
    expectedObservable: "The token value is stored without being drawn on the poster.",
    fixture: "empty token",
    id: "art.token",
    interactionId: "edit-token",
    kind: "control",
    target: "art.token",
    userAction: "Type a Hugging Face token.",
  },
  {
    automated: true,
    automatedTestName: "model id is a panel setting",
    browser: posterTest,
    componentType: "text",
    evidence: "command-side-effect",
    expectedObservable: "The model id value changes and Generate will call that model.",
    fixture: "default FLUX.1-schnell model",
    id: "art.model",
    interactionId: "edit-model",
    kind: "control",
    target: "art.model",
    userAction: "Edit the model id.",
  },
  {
    automated: true,
    automatedTestName: "direction is included in the art prompt",
    browser: posterTest,
    componentType: "text",
    evidence: "command-side-effect",
    expectedObservable: "The direction value is kept for the next Generate request.",
    fixture: "default art direction",
    id: "art.direction",
    interactionId: "edit-direction",
    kind: "control",
    target: "art.direction",
    userAction: "Edit the art direction.",
  },
  {
    actionCoverage: ["art.generate", "export.png"],
    automated: true,
    automatedTestName: "generate and export share the sticky footer",
    browser: exportTest,
    componentType: "panelActions",
    evidence: "exported-bytes",
    expectedObservable:
      "Export PNG writes the plate, logo, and type. Generate replaces only the plate when the model returns an image.",
    exportArtifactCoverage: "all-required-image-export-behavior",
    fixture: "local brand plate",
    id: "art.generate",
    interactionId: "generate-art",
    kind: "control",
    target: "art.generate",
    userAction: "Generate art, then export a PNG.",
  },
  {
    automated: true,
    automatedTestName: "image format selects png or jpg",
    browser: posterTest,
    componentType: "select",
    evidence: "command-side-effect",
    expectedObservable: "Format selects PNG or JPG for the next image export.",
    fixture: "png format",
    id: "export.format",
    kind: "control",
    optionCoverage: ["png", "jpg"],
    target: "export.image.format",
    userAction: "Change Image Export format.",
  },
  {
    automated: true,
    automatedTestName: "image resolution selects a long-edge preset",
    browser: posterTest,
    componentType: "select",
    evidence: "command-side-effect",
    expectedObservable: "Resolution selects the 2K, 4K, or 8K long edge.",
    fixture: "4k resolution",
    id: "export.resolution",
    kind: "control",
    optionCoverage: ["2k", "4k", "8k"],
    target: "export.image.resolution",
    userAction: "Change Image Export resolution.",
  },
  {
    automated: true,
    automatedTestName: "infinity preserves the banner world frame",
    browser: infinityModeTest,
    componentType: "canvas",
    evidence: "viewport-side-effect",
    expectedObservable:
      "Infinity removes the artboard chrome and keeps the banner world frame, view, and output identity.",
    fixture: "1200 by 630 banner",
    id: "infinity.mode",
    infinityCanvasCoverage: "mode-continuity-and-restoration",
    kind: "runtime",
    target: "canvas.infinity",
    userAction: "Turn on Infinity canvas, pan, reload, then undo and redo the mode.",
  },
  {
    automated: true,
    automatedTestName: "infinity export uses the banner scene bounds",
    browser: infinityExportTest,
    componentType: "canvas",
    evidence: "exported-bytes",
    expectedObservable:
      "Infinity still export uses the banner scene bounds rather than the dormant artboard chrome.",
    fixture: "1200 by 630 banner",
    id: "infinity.export",
    infinityCanvasCoverage: "scene-bounds-image-export",
    kind: "runtime",
    target: "canvas.infinity",
    userAction: "Export a PNG in finite mode and again in Infinity.",
  },
];

export const appControlSectionInventory: readonly ToolcraftControlSectionInventoryEntry[] = [
  {
    entity: "Banner backdrop",
    entityId: "banner-backdrop",
    finiteSelectors: [
      {
        reason: "Background include proves whether the Setup fill is exported around the plate.",
        role: "parameter",
        target: "export.includeBackground",
      },
    ],
    groupingReason:
      "These two controls are the runtime background pair behind the banner plate.",
    id: "brand.background",
    targets: ["export.includeBackground", "appearance.background"],
    title: "Background",
  },
  {
    entity: "Creative brief",
    entityId: "creative-brief",
    finiteSelectors: [
      {
        reason: "Category sets the plate tone and the poster label without hiding other brief fields.",
        role: "parameter",
        target: "brief.category",
      },
      {
        reason: "Platform names the channel on the poster without changing the other brief fields.",
        role: "parameter",
        target: "brief.platform",
      },
    ],
    groupingReason:
      "Category, platform, and the locked type are one writing task for the banner.",
    id: "brief",
    targets: [
      "brief.category",
      "brief.platform",
      "copy.headline",
      "copy.support",
      "copy.cta",
    ],
    title: "Brief",
  },
  {
    entity: "Art plate",
    entityId: "art-plate",
    finiteSelectors: [],
    groupingReason:
      "Token, model, and direction exist only to request a background plate.",
    id: "art",
    targets: ["art.token", "art.model", "art.direction"],
    title: "Art",
  },
  {
    entity: "Image export",
    entityId: "image-export",
    finiteSelectors: [
      {
        reason: "Format chooses PNG or JPG for the next still export.",
        role: "parameter",
        target: "export.image.format",
      },
      {
        reason: "Resolution chooses the long-edge preset for the next still export.",
        role: "parameter",
        target: "export.image.resolution",
      },
    ],
    groupingReason: "Format and resolution are the still-export settings for the banner.",
    id: "runtime.image-export",
    targets: ["export.image.format", "export.image.resolution"],
    title: "Image Export",
  },
];
