# Toolcraft App Agent Worklog

## Status

Mode: product

Active change: cover-studio-generate

## Decisions

### Renderer

- Decision: DOM poster preview and one canvas export painter share the same poster frame.
- Reason: Marketers need the canvas and the PNG to be the same design.
- Evidence: `src/app/poster-paint.ts`, `src/app/product-scene.tsx`, `src/app/export-renderer.ts`.

### View Interaction

- Decision: non-spatial.
- Reason: The poster is a flat frame. There is no rotatable model.
- Evidence: `appProductReadiness.viewInteraction` in `src/app/app-acceptance-data.ts`.

### Interaction Ownership

- Decision: Copy and placement offsets are panel edits. The canvas shows the poster.
- Reason: Marketers rewrite words and nudge pieces without a second set of canvas handles.
- Evidence: `appProductReadiness.interactionOwnership`.

### Timeline

- Decision: Playback timeline, 4 seconds, forward loop, first and last frames identical.
- Reason: One motion control plays a short slide, scale, fade, and mask shift without keyframe editing.
- Evidence: `timelineModule` in `src/app/app-schema.ts` and `motionWave` in `src/app/design-model.ts`.

### Layers

- Decision: Layers stay off.
- Reason: The request is one generated poster with copy and placement edits, not a layer stack.
- Evidence: `appSchema.panels.layers` is unset.

### Controls

- Decision: Start, Copy, Placement, and Motion replace category, seed, guides, and layout-unlock controls.
- Reason: The user is a marketer who brings a brief, then edits the result.
- Evidence: `src/app/app-schema.ts` and `src/app/design-model.ts`.

### Export

- Decision: Image export stays on. SVG and video stay off.
- Reason: The request is to export the poster. It does not ask for SVG or video.
- Evidence: `imageExportModule()` in `src/app/app-schema.ts` and `exportIntent` in `src/app/app-acceptance-data.ts`.

### Performance

- Decision: Controls are responsiveness edits. No measured pass.
- Reason: This change is the generator and the marketer flow.
- Evidence: `src/app/app-performance.ts`.

## Decision Trail

### Cover studio generate

- Change ID: cover-studio-generate
- Request: Build the tool so a marketer's brief generates a designed poster they can edit and export.
- Task type: product behavior
- User-visible result: The opening poster is a feature announcement. Generate reads the brief. Copy fields and placement pads edit that poster. Add motion plays a seamless loop. Export PNG uses the same frame.
- Source/reference checked: Existing Cover Studio scene, Jitter preset motion (move, scale, opacity), and published hierarchy practice for a dominant headline.
- Reference inputs: none
- Docs/contracts read: `docs/toolcraft/workflow.md`, `docs/toolcraft/core/control-selection.md`, `docs/toolcraft/core/layout.md`, `docs/toolcraft/core/timeline-animation.md`, `docs/toolcraft/core/setup-export.md`, `docs/toolcraft/core/runtime-boundary.md`, `docs/toolcraft/renderer-technique.md`
- Contract rules applied: `controls-product-coverage`, `controls-section-inventory-required`, `interaction-surface-ownership`, `renderer-view-interaction`, `timeline-mode-choice`, `output-export-required`, `layers-enable-only-when-needed`
- View interaction intent: non-spatial, because the poster is a flat frame.
- Interaction ownership: panel owns headline copy and the headline, graphic, and action offsets. Canvas does not repeat those edits.
- Decision: The tool composes the poster from the brief. Image models are not the designer.
- Alternatives rejected: Recoloring one card from a seed. Hand-drawing a single poster outside the tool.
- State/output mapping: `brief.text` feeds `composeDesign`. That writes copy, arrangement, field color, and resets offsets. The scene and export renderer both read those values through `readPosterFrame`.
- Verification: Composer unit test passed. Schema, acceptance coverage, and performance gates passed. Browser load showed the sample feature poster, a headline edit, Generate restoring that poster, a short claim switching to the poster arrangement, and Add motion moving the headline.
- Risks: Freeform briefs without Claim, Proof, and Ask lines get a rougher headline. A photograph slot is not in this pass.

## Evidence

- Source reviewed: `src/app/design-model.ts`, `src/app/poster-paint.ts`, `src/app/app-schema.ts`
- Contract applied: control selection, layout, timeline, setup export, runtime boundary

## Verification

Verification tier: Tier 3
Reason: Poster generator, panel edits, playback motion, and image export.
Run: composer unit test, schema and acceptance coverage, performance gates, and a Chromium pass of the sample poster, headline edit, Generate, short-claim arrangement, and Add motion.
Skip: measured performance and the full delivery receipt. Image export was visible as Export PNG; the downloaded file was not decoded in this pass.

## Risks

- Risk: Freeform briefs are less reliable than labeled ones. Photography is not placed yet.
