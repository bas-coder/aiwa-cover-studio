# AIWA Cover Studio — implementation plan

Verification tier: Tier 4, first product delivery. Run `pnpm install`, `pnpm ai:check`, `pnpm verify:delivery`, and `pnpm dev`. No measured performance run is authorized; use functional verification plus manual browser inspection and the Sites build/publish workflow.

1. Assemble the Toolcraft shell with media, layers, timeline, PNG, and WebM-capable video export modules.
2. Model AIWA-specific brief, copy, composition, motion, and quality controls as schema-owned controls.
3. Render a responsive, editable AIWA cover scene and a matching deterministic raster export.
4. Add deterministic creative-direction and quality-grading adapters with provider-neutral AI integration seams.
5. Validate locally, inspect in a real browser, then register and publish the static build with Sites.

Constraints: preserve the parent `uploads`, `inspiration`, and `rep` folders; protect supplied logos; use local persistence; report that no representative examples were available because `rep` is empty. GIF export is not offered because the current Toolcraft runtime supports MP4/WebM.
