export type CreativeIntensity = "conservative" | "balanced" | "experimental";

export type CreativeDirection = Readonly<{
  accent: string;
  angle: number;
  motif: "beam" | "grid" | "halo";
  titleScale: number;
}>;

const accents = ["#ff9e2c", "#ffb64d", "#f47a28", "#ffd08a"] as const;
const motifs = ["beam", "grid", "halo"] as const;

function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function directCreative(input: {
  category: string;
  intensity: CreativeIntensity;
  seed: number;
}): CreativeDirection {
  const value = hash(`${input.category}:${input.intensity}:${input.seed}`);
  const energy = input.intensity === "conservative" ? 0.82 : input.intensity === "experimental" ? 1.18 : 1;
  return {
    accent: accents[value % accents.length],
    angle: -12 + ((value >>> 5) % 25),
    motif: motifs[(value >>> 9) % motifs.length],
    titleScale: energy,
  };
}

export interface ImageGenerationAdapter {
  generate(prompt: string, signal: AbortSignal): Promise<Blob>;
  readonly provider: "huggingface" | "replicate" | "custom";
}

export const deterministicFallback = {
  id: "aiwa-deterministic-v1",
  mode: "local" as const,
};
