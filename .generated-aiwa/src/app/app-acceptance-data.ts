import type {
  ToolcraftComponentAcceptance,
  ToolcraftControlSectionInventoryEntry,
  ToolcraftProductReadiness,
  ToolcraftTransferMode,
} from "./acceptance/types";
import { appSchema } from "./app-schema";

const posterBrowser = {
  budget: "standard",
  file: "e2e/app-poster.spec.ts",
  testName: "browser: a brief generates an editable poster",
} as const;

const exportBrowser = {
  budget: "extended-io",
  file: "e2e/app-poster.spec.ts",
  testName: "browser: poster export uses the generated frame",
} as const;

const infinityBrowser = {
  budget: "standard",
  file: "e2e/app-poster.spec.ts",
  testName: "browser: infinity keeps the poster frame",
} as const;

const starterPersistenceSlices =
  appSchema.persistence.storage === "localStorage"
    ? appSchema.persistence.include
    : [];

const loopProof = {
  direction: "forward-only",
  durationChange: "reproved-after-edit",
  reversePlayback: "forbidden",
  seam: "first-last-match",
} as const;

function controlRow(
  id: string,
  target: string,
  componentType: string,
  userAction: string,
  extra: Partial<ToolcraftComponentAcceptance> = {},
): ToolcraftComponentAcceptance {
  return {
    automated: true,
    automatedTestName: "publishes the poster studio contract",
    browser: posterBrowser,
    componentType,
    evidence: "product-output",
    expectedObservable: `${target} changes the generated poster.`,
    fixture: "feature announcement poster",
    id,
    kind: "control",
    target,
    userAction,
    ...extra,
  };
}

export const appTransferMode: ToolcraftTransferMode = {
  animationIntent: {
    loopDuration: {
      evidence:
        "The poster motion is one four-second forward cycle so the opening and closing frames share the resting pose.",
      seconds: 4,
      source: "product-derived",
    },
    mode: "timeline-playback",
  },
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
    {
      alternative: {
        reason: "Canvas handles would duplicate the pad and cover the poster.",
        surface: "canvas",
      },
      capability: "direct-spatial-edit",
      evidence: {
        detail: "Marketers nudge the headline from the panel after the poster exists.",
        source: "usability-analysis",
      },
      id: "place-claim",
      reason: "The headline pad moves the claim without covering the poster.",
      surface: "panel",
      target: "place.claim",
    },
    {
      alternative: {
        reason: "A second canvas drag would fight the headline pad and the poster.",
        surface: "canvas",
      },
      capability: "direct-spatial-edit",
      evidence: {
        detail: "The graphic is positioned from the same placement group as the headline.",
        source: "usability-analysis",
      },
      id: "place-mark",
      reason: "The graphic pad keeps placement next to the other offsets.",
      surface: "panel",
      target: "place.mark",
    },
    {
      alternative: {
        reason: "Canvas dragging the action line would repeat the placement pads.",
        surface: "canvas",
      },
      capability: "direct-spatial-edit",
      evidence: {
        detail: "The action line is nudged from the placement section with the other pieces.",
        source: "usability-analysis",
      },
      id: "place-ask",
      reason: "The action pad stays with the other placement offsets.",
      surface: "panel",
      target: "place.ask",
    },
    {
      alternative: {
        reason: "Editing the headline on the canvas would duplicate the copy field.",
        surface: "canvas",
      },
      capability: "property-edit",
      evidence: {
        detail: "Marketers rewrite the generated headline in the copy section.",
        source: "usability-analysis",
      },
      id: "edit-headline",
      reason: "The headline field is the place marketers change the claim.",
      selectionScope: { mode: "global" },
      surface: "panel",
      target: "copy.title",
    },
  ],
  mode: "product",
  productName: "AIWA Cover Studio",
  productSummary: "A brief generates an on-brand poster marketers can edit and export.",
  requestedBehavior:
    "Generate a poster from a brief, then let marketers rewrite copy, nudge pieces, add a simple motion loop, and export a PNG.",
  viewInteraction: {
    mode: "non-spatial",
    reason: "The poster is a flat frame. There is no rotatable model.",
  },
};

export const appAcceptance: readonly ToolcraftComponentAcceptance[] = [
  {
    automated: true,
    automatedTestName: "declares production reload coverage for the starter schema",
    browser: {
      budget: "extended-io",
      file: "e2e/app-persistence.spec.ts",
      testName: "browser: app restores exact canvas, values, and panel workspace slices after reload",
    },
    componentType: "persistence",
    evidence: "persistence-state",
    expectedObservable:
      "Canvas size and zoom, their runtime values, and the moved and collapsed Controls workspace remain visibly restored after a real browser reload.",
    fixture: "poster runtime persisted workspace",
    id: "persistence.reload",
    kind: "runtime",
    persistenceCoverage: "reload",
    persistenceSlices: starterPersistenceSlices,
    target: "canvas.size.width",
    userAction: "Edit Canvas width and zoom, move and collapse Controls, wait for persistence, and reload the page.",
  },
  {
    automated: true,
    automatedTestName: "publishes the poster studio contract",
    browser: posterBrowser,
    componentType: "timeline",
    evidence: "timeline-output",
    expectedObservable: "Playback moves the poster and returns to the same pose at the seam.",
    fixture: "four second poster loop",
    id: "timeline.playback",
    kind: "runtime",
    target: "timeline.playback",
    timelineCoverage: "playback",
    timelineLoopProof: loopProof,
    timelinePlaybackCoverage: "all-playback-behavior",
    userAction: "Play the timeline and confirm the poster rests at the start and end.",
  },
  {
    automated: true,
    automatedTestName: "publishes the poster studio contract",
    browser: infinityBrowser,
    componentType: "canvas",
    evidence: "viewport-side-effect",
    expectedObservable: "Infinity removes the artboard clip while the poster frame stays in place.",
    fixture: "poster scene bounds",
    id: "canvas.infinity-mode",
    infinityCanvasCoverage: "mode-continuity-and-restoration",
    kind: "runtime",
    target: "canvas.infinity",
    userAction: "Turn Infinity canvas on and off and confirm the poster frame remains.",
  },
  {
    automated: true,
    automatedTestName: "publishes the poster studio contract",
    browser: exportBrowser,
    componentType: "canvas",
    evidence: "exported-bytes",
    expectedObservable: "Infinity export uses the same poster frame as the live canvas.",
    fixture: "poster scene bounds export",
    id: "canvas.infinity-export",
    infinityCanvasCoverage: "scene-bounds-image-export",
    kind: "runtime",
    target: "canvas.infinity",
    userAction: "Export the poster with Infinity canvas on.",
  },
  controlRow(
    "brand.include-background",
    "export.includeBackground",
    "switch",
    "Toggle Background and confirm the field appears or drops out.",
    { backgroundOutputCoverage: "all-required-background-output" },
  ),
  controlRow(
    "brand.background-color",
    "appearance.background",
    "color",
    "Change Background color and confirm the field color changes.",
  ),
  controlRow(
    "brief.text",
    "brief.text",
    "code",
    "Replace the brief and generate again.",
  ),
  controlRow(
    "brief.generate",
    "design.generate",
    "actions",
    "Click Generate and confirm the poster uses the brief.",
  ),
  controlRow(
    "copy.eyebrow",
    "copy.eyebrow",
    "text",
    "Rewrite the eyebrow and confirm the poster updates.",
  ),
  controlRow(
    "copy.title",
    "copy.title",
    "code",
    "Rewrite the headline and confirm the poster updates.",
    { interactionId: "edit-headline" },
  ),
  controlRow(
    "copy.support",
    "copy.subtitle",
    "code",
    "Rewrite the support line and confirm the poster updates.",
  ),
  controlRow(
    "copy.action",
    "copy.cta",
    "text",
    "Rewrite the action line and confirm the poster updates.",
  ),
  controlRow(
    "placement.arrangement",
    "design.arrangement",
    "segmented",
    "Choose Editorial, Split, and Poster and confirm the layout changes.",
    { optionCoverage: ["editorial", "split", "poster"] },
  ),
  controlRow(
    "placement.claim",
    "place.claim",
    "vector",
    "Nudge the headline pad and confirm the claim moves with the gesture.",
    {
      controlPartCoverage: ["vector.x", "vector.y"],
      interactionId: "place-claim",
    },
  ),
  controlRow(
    "placement.mark",
    "place.mark",
    "vector",
    "Nudge the graphic pad and confirm the mark moves with the gesture.",
    {
      controlPartCoverage: ["vector.x", "vector.y"],
      interactionId: "place-mark",
    },
  ),
  controlRow(
    "placement.ask",
    "place.ask",
    "vector",
    "Nudge the action pad and confirm the action line moves with the gesture.",
    {
      controlPartCoverage: ["vector.x", "vector.y"],
      interactionId: "place-ask",
    },
  ),
  controlRow(
    "motion.enabled",
    "motion.enabled",
    "switch",
    "Turn Loop on and confirm the poster motion starts from rest.",
  ),
  controlRow(
    "motion.apply",
    "motion.apply",
    "actions",
    "Click Add motion and confirm the existing poster starts moving.",
  ),
  controlRow(
    "export.format",
    "export.image.format",
    "select",
    "Choose PNG and JPG.",
    { optionCoverage: ["png", "jpg"] },
  ),
  controlRow(
    "export.resolution",
    "export.image.resolution",
    "select",
    "Choose 2K, 4K, and 8K.",
    { optionCoverage: ["2k", "4k", "8k"] },
  ),
  controlRow(
    "export.png",
    "actions.output",
    "panelActions",
    "Export the poster and confirm the file matches the canvas.",
    {
      actionCoverage: ["export.png"],
      browser: exportBrowser,
      evidence: "exported-bytes",
      exportArtifactCoverage: "all-required-image-export-behavior",
    },
  ),
];

export const appControlSectionInventory: readonly ToolcraftControlSectionInventoryEntry[] = [
  {
    entity: "Background",
    entityId: "background",
    finiteSelectors: [
      {
        reason: "Include the runtime field behind the poster.",
        role: "parameter",
        target: "export.includeBackground",
      },
    ],
    groupingReason: "The field switch and color travel together into Setup.",
    id: "brand.background",
    targets: ["export.includeBackground", "appearance.background"],
    title: "Background",
  },
  {
    entity: "Brief",
    entityId: "brief",
    finiteSelectors: [],
    groupingReason: "The brief is the source the poster is generated from.",
    id: "brief",
    targets: ["brief.text"],
    title: "Start",
  },
  {
    entity: "Generate",
    entityId: "generate",
    finiteSelectors: [],
    groupingReason: "Generate is the command that turns the brief into a poster.",
    id: "generate",
    targets: ["design.generate"],
    title: "Generate",
  },
  {
    entity: "Copy",
    entityId: "copy",
    finiteSelectors: [],
    groupingReason: "Eyebrow and action are the short lines around the headline.",
    id: "copy",
    targets: ["copy.eyebrow", "copy.cta"],
    title: "Copy",
  },
  {
    entity: "Headline",
    entityId: "headline",
    finiteSelectors: [],
    groupingReason: "The headline is the dominant line marketers rewrite.",
    id: "headline",
    targets: ["copy.title"],
    title: "Headline",
  },
  {
    entity: "Support",
    entityId: "support",
    finiteSelectors: [],
    groupingReason: "The support line is the proof under the headline.",
    id: "support",
    targets: ["copy.subtitle"],
    title: "Support",
  },
  {
    entity: "Arrangement",
    entityId: "arrangement",
    finiteSelectors: [
      {
        reason: "Arrangement changes the poster layout without hiding other edits.",
        role: "parameter",
        target: "design.arrangement",
      },
    ],
    groupingReason: "Arrangement chooses editorial, split, or poster framing.",
    id: "arrangement",
    targets: ["design.arrangement"],
    title: "Arrangement",
  },
  {
    entity: "Placement",
    entityId: "placement",
    finiteSelectors: [],
    groupingReason: "The headline, graphic, and action offsets are one nudge task.",
    id: "placement",
    targets: ["place.claim", "place.mark", "place.ask"],
    title: "Placement",
  },
  {
    entity: "Motion",
    entityId: "motion",
    finiteSelectors: [
      {
        reason: "Loop turns the existing poster motion on or off.",
        role: "parameter",
        target: "motion.enabled",
      },
    ],
    groupingReason: "The loop switch and Add motion act on the poster that already exists.",
    id: "motion",
    targets: ["motion.enabled", "motion.apply"],
    title: "Motion",
  },
  {
    entity: "Image export",
    entityId: "image-export",
    finiteSelectors: [
      {
        reason: "Format chooses PNG or JPG for the same poster.",
        role: "parameter",
        target: "export.image.format",
      },
      {
        reason: "Resolution chooses the long edge of the still export.",
        role: "parameter",
        target: "export.image.resolution",
      },
    ],
    groupingReason: "Format and resolution are the still-export settings for the poster.",
    id: "runtime.image-export",
    targets: ["export.image.format", "export.image.resolution"],
    title: "Image Export",
  },
];
