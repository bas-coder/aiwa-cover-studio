export const posterInk = "#14110e";
export const posterPaper = "#f4efe8";
export const posterAccent = "#e86a1f";
export const posterCream = "#f7f1e8";
export const posterMutedOnInk = "#d8cfc4";
export const posterMutedOnPaper = "#5e534a";

const claimWordLimit = 10;
const proofWordLimit = 22;
const askWordLimit = 5;
const posterClaimWordMax = 4;
const editorialClaimWordMax = 8;
const headlineToSupportRatio = 2;
const paperLuminanceThreshold = 0.62;
const nudgeFraction = 0.06;
const frameInset = 0.02;
const frameLimit = 0.92;
const seamEpsilon = 1e-6;

const supportScaleByArrangement = {
  editorial: 0.02,
  poster: 0.022,
  split: 0.02,
} as const;

const headlineScaleByArrangement = {
  editorial: { floor: 0.05, start: 0.064, step: 0.0015 },
  poster: { floor: 0.068, start: 0.086, step: 0.004 },
  split: { floor: 0.044, start: 0.056, step: 0.0015 },
} as const;

export const sampleBrief = [
  "Kind: Feature announcement",
  "Audience: Product marketers",
  "Claim: Every conversation in one shared inbox",
  "Proof: Replies, assignments, and context stay in one place.",
  "Ask: Try the shared inbox",
].join("\n");

export type PosterArrangement = "editorial" | "poster" | "split";
export type PosterTheme = "ink" | "paper";

export interface PosterCopy {
  ask: string;
  claim: string;
  eyebrow: string;
  proof: string;
}

export interface FractionBox {
  h: number;
  w: number;
  x: number;
  y: number;
}

export interface PosterBoxes {
  ask: FractionBox;
  claim: FractionBox;
  eyebrow: FractionBox;
  logo: FractionBox;
  mark: FractionBox;
  proof: FractionBox;
}

export interface PosterPoint {
  x: number;
  y: number;
}

export interface PosterDesign {
  arrangement: PosterArrangement;
  background: string;
  copy: PosterCopy;
  headlineScale: number;
  issues: readonly string[];
}

const labeledKeys = {
  ask: ["ask", "cta", "action"],
  claim: ["claim", "headline"],
  kind: ["kind", "category"],
  proof: ["proof", "support", "detail"],
} as const;

const editorialBoxes: PosterBoxes = {
  ask: { h: 0.06, w: 0.36, x: 0.07, y: 0.84 },
  claim: { h: 0.28, w: 0.48, x: 0.07, y: 0.36 },
  eyebrow: { h: 0.04, w: 0.4, x: 0.07, y: 0.3 },
  logo: { h: 0.05, w: 0.18, x: 0.07, y: 0.08 },
  mark: { h: 0.5, w: 0.26, x: 0.62, y: 0.22 },
  proof: { h: 0.12, w: 0.42, x: 0.07, y: 0.68 },
};

const posterBoxes: PosterBoxes = {
  ask: { h: 0.06, w: 0.4, x: 0.3, y: 0.78 },
  claim: { h: 0.3, w: 0.76, x: 0.12, y: 0.34 },
  eyebrow: { h: 0.04, w: 0.4, x: 0.3, y: 0.26 },
  logo: { h: 0.05, w: 0.18, x: 0.08, y: 0.08 },
  mark: { h: 0.28, w: 0.22, x: 0.7, y: 0.08 },
  proof: { h: 0.1, w: 0.5, x: 0.25, y: 0.66 },
};

const splitBoxes: PosterBoxes = {
  ask: { h: 0.06, w: 0.36, x: 0.06, y: 0.82 },
  claim: { h: 0.3, w: 0.46, x: 0.06, y: 0.32 },
  eyebrow: { h: 0.04, w: 0.4, x: 0.06, y: 0.24 },
  logo: { h: 0.05, w: 0.18, x: 0.06, y: 0.08 },
  mark: { h: 0.44, w: 0.24, x: 0.68, y: 0.28 },
  proof: { h: 0.12, w: 0.42, x: 0.06, y: 0.66 },
};

function words(value: string): string[] {
  return value.trim().split(/\s+/).filter(Boolean);
}

function clampWords(value: string, maxWords: number): string {
  return words(value).slice(0, maxWords).join(" ");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function labeled(source: string, keys: readonly string[]): string | undefined {
  const pattern = new RegExp(`^(?:${keys.join("|")})\\s*:\\s*(.+)$`, "im");
  const match = source.match(pattern);
  const value = match?.[1]?.trim();
  return value ? value : undefined;
}

function sentences(source: string): string[] {
  return source
    .split(/\n+|(?<=[.!?])\s+/)
    .map((line) =>
      line.replace(
        /^(?:kind|audience|claim|headline|proof|support|detail|ask|cta|action)\s*:\s*/i,
        "",
      ).trim(),
    )
    .filter(Boolean);
}

function eyebrowFrom(kind: string): string {
  const lower = kind.toLowerCase();
  if (/\b(feature|announce|launch)\b/.test(lower)) return "New feature";
  if (/\b(hire|hiring|role|job)\b/.test(lower)) return "We're hiring";
  if (/\b(event|webinar)\b/.test(lower)) return "Upcoming";
  return "AIWA";
}

export function synthesizeBrief(brief: string): PosterCopy {
  const loose = sentences(brief);
  const claim = labeled(brief, labeledKeys.claim) ?? loose[0] ?? "";
  const proof = labeled(brief, labeledKeys.proof) ?? loose[1] ?? "";
  const ask = labeled(brief, labeledKeys.ask) ?? loose[2] ?? "Learn more";
  const kind = labeled(brief, labeledKeys.kind) ?? brief;

  return {
    ask: clampWords(ask, askWordLimit) || "Learn more",
    claim: clampWords(claim, claimWordLimit) || "A clearer way to say it",
    eyebrow: eyebrowFrom(kind),
    proof: clampWords(proof, proofWordLimit),
  };
}

export function chooseArrangement(claim: string): PosterArrangement {
  const count = words(claim).length;
  if (count <= posterClaimWordMax) return "poster";
  if (count <= editorialClaimWordMax) return "editorial";
  return "split";
}

export function headlineScaleFor(
  arrangement: PosterArrangement,
  claim: string,
): number {
  const scale = headlineScaleByArrangement[arrangement];
  const count = Math.max(1, words(claim).length);
  return Math.max(scale.floor, scale.start - count * scale.step);
}

export function supportScaleFor(arrangement: PosterArrangement): number {
  return supportScaleByArrangement[arrangement];
}

export function assessPoster(
  copy: PosterCopy,
  arrangement: PosterArrangement,
): string[] {
  const issues: string[] = [];
  const claimWords = words(copy.claim).length;
  if (claimWords < 2 || claimWords > claimWordLimit) {
    issues.push("Headline needs two to ten words.");
  }
  if (words(copy.proof).length > proofWordLimit) {
    issues.push("Support copy is too long.");
  }
  const headlineScale = headlineScaleFor(arrangement, copy.claim);
  const supportScale = supportScaleFor(arrangement);
  if (headlineScale < supportScale * headlineToSupportRatio) {
    issues.push("Headline is not large enough against the support line.");
  }
  return issues;
}

export function backgroundForBrief(brief: string): string {
  return /\b(light|paper|white)\b/i.test(brief) ? posterPaper : posterInk;
}

export function composeDesign(brief: string): PosterDesign {
  const copy = synthesizeBrief(brief);
  const arrangement = chooseArrangement(copy.claim);
  return {
    arrangement,
    background: backgroundForBrief(brief),
    copy,
    headlineScale: headlineScaleFor(arrangement, copy.claim),
    issues: assessPoster(copy, arrangement),
  };
}

export function boxesFor(arrangement: PosterArrangement): PosterBoxes {
  if (arrangement === "poster") return posterBoxes;
  if (arrangement === "split") return splitBoxes;
  return editorialBoxes;
}

export function readPoint(value: unknown): PosterPoint {
  if (typeof value !== "object" || value === null) return { x: 0, y: 0 };
  const point = value as { x?: unknown; y?: unknown };
  return {
    x: typeof point.x === "number" ? point.x : 0,
    y: typeof point.y === "number" ? point.y : 0,
  };
}

export function nudgeBox(box: FractionBox, point: PosterPoint): FractionBox {
  return {
    ...box,
    x: clamp(box.x + point.x * nudgeFraction, frameInset, frameLimit),
    y: clamp(box.y + point.y * nudgeFraction, frameInset, frameLimit),
  };
}

export function motionWave(progress: number): number {
  const cycle = Math.sin(progress * Math.PI * 2);
  return Math.abs(cycle) < seamEpsilon ? 0 : cycle;
}

export function themeForBackground(color: string): PosterTheme {
  const hex = color.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return "ink";
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  return luminance > paperLuminanceThreshold ? "paper" : "ink";
}

export const sampleDesign = composeDesign(sampleBrief);
