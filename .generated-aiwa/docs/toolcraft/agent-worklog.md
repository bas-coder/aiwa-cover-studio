# Toolcraft App Agent Worklog

Active change: hf-brand-art

## Status

Mode: product

Verification tier: Tier 4
Reason: First product delivery of AIWA banners with a Hugging Face art plate, locked logo and type, and PNG export.
Run: one bare `pnpm verify:delivery`, then `pnpm dev`, and a browser check of Generate.
Skip: measured performance. First delivery runs none.

## Decision Trail

### Delivery 1 - Hugging Face banner art

- Change ID: hf-brand-art
- Request: Ask for a Hugging Face token and generate the banner art from a Hugging Face model, then lock the AIWA logo and type on top. Training stays on Hugging Face.
- Task type: first product delivery
- User-visible result: The poster shows a local orange brand plate until Generate receives an image. Logo, headline, support, and CTA stay as real overlays. PNG export draws the same plate.
- Source/reference checked: uploads/wordmark.svg, uploads/logomark.svg, uploads/brand.pdf, inspiration category folders, and the generated AIWA studio. The folder C:\Projects\AIWA Banners\Brand Guide is not in this workspace.
- Reference inputs: none
- Docs/contracts read: workflow, runtime boundary, assembly, control selection, layout, setup export, media upload, schema reference, component rules, renderer technique, performance, and acceptance testing guidance already applied to this app.
- Contract rules applied: runtime-shell-required, canvas-no-app-ui, controls-product-coverage, output-export-required, controls-section-inventory-required, renderer-view-interaction, interaction-surface-ownership, persistence-policy-explicit, workflow-required
- View interaction intent: non-spatial, because the banner is a flat poster with no camera or model orbit.
- Interaction ownership: Brief, token, model, direction, and Generate are panel operations. The canvas shows the poster and does not repeat those edits.
- Decision: The image model paints only the background plate. Official logo and type stay as SVG and text. The model id defaults to black-forest-labs/FLUX.1-schnell and can be replaced with a fine-tuned Hugging Face id. A missing or rejected token clears any generated plate and leaves the local brand plate.
- Alternatives rejected: In-app training, a diffusion pass that draws the whole banner, video export, layers, and timeline. The generated art is held for the session instead of a user upload workflow.
- State/output mapping: Schema values own the brief, token, model, and direction. Generate posts to router.huggingface.co and stores the image bytes in a session plate. The scene and raster export read that plate, then paint the logo and type. Setup owns canvas size, background, and image export.
- Performance intent: ordinary-product-work
- Verification: Focused unit tests mock the Hugging Face response. Protected delivery owns the browser proof for controls, background, export, and Infinity.
- Risks: The token is a schema value, so this browser persists it and settings export can include it. It is never committed. FLUX.1-schnell may be gated and then the local plate remains. The Windows Brand Guide folder was not available, so the palette comes from the wordmark SVG and the category tones come from the inspiration folders. The brand PDF text could not be extracted.

## Decisions

### Renderer

- Decision: DOM SVG poster plus one raster export renderer.
- Reason: Logo and type must stay sharp, and PNG export must draw the same plate.
- Evidence: src/app/banner-scene.tsx and src/app/banner-export.ts.

### View Interaction

- Decision: non-spatial.
- Reason: The banner is a flat poster with no 3D scene.
- Evidence: appProductReadiness.viewInteraction in src/app/app-acceptance-data.ts.

### Interaction Ownership

- Decision: Panel owns brief, token, model, direction, and Generate.
- Reason: Those are typed values and a network command. The canvas only shows the result.
- Evidence: interactionOwnership in src/app/app-acceptance-data.ts.

### Timeline

- Decision: No timeline.
- Reason: The request is a still banner, not animation or video export.
- Evidence: appSchema modules are image export only.

### Layers

- Decision: No layers.
- Reason: The request does not ask for a layer workflow.
- Evidence: appSchema does not enable the layers panel.

### Controls

- Decision: Brief, art, and a runtime background pair.
- Reason: Category, platform, copy, token, model, and direction are the requested tasks.
- Evidence: src/app/app-schema.ts and the control section inventory.

### Export

- Decision: PNG image export only.
- Reason: Image export is the product default. SVG and video were not requested.
- Evidence: imageExportModule and exportIntent in app readiness.

### Performance

- Decision: Responsiveness controls only, with no measured workload.
- Reason: First delivery does not authorize a performance iteration.
- Evidence: src/app/app-performance.ts.

## Evidence

- Source reviewed: wordmark SVG colors #F59900 and #AC0000, inspiration folders, and the generated studio route that already mounts appComposition.
- Contract applied: product output stays in the scene, background stays in Setup, and the token is described as browser-persisted.

## Verification

Focused checks cover the prompt, the mocked Hugging Face call, and acceptance coverage. The protected delivery command owns the full functional and browser proof.

## Risks

- Risk: The token is a schema value, so this browser persists it and settings export can include it. It is never committed.
- Risk: FLUX.1-schnell may be gated, and a rejected response leaves the local orange plate.
- Risk: The Windows Brand Guide folder is not in this workspace, so the palette comes from the wordmark and category tones come from the inspiration folders.
- Risk: The generated plate lasts for the session and is not a saved media upload.
