export type QualityResult = Readonly<{ issues: readonly string[]; score: number }>;

export function gradeCover(values: Record<string, unknown>): QualityResult {
  const title = String(values["copy.title"] ?? "").trim();
  const subtitle = String(values["copy.subtitle"] ?? "").trim();
  const cta = String(values["copy.cta"] ?? "").trim();
  const issues: string[] = [];
  if (title.length < 8) issues.push("Strengthen the headline with a clearer promise.");
  if (title.length > 72) issues.push("Shorten the headline to protect hierarchy and crops.");
  if (subtitle.length > 130) issues.push("Trim supporting copy for small-format legibility.");
  if (!cta) issues.push("Add a concise call to action.");
  return { issues, score: Math.max(52, 100 - issues.length * 12) };
}
