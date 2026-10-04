export const missingBrandGuidePath = "C:\\Projects\\AIWA Banners\\Brand Guide";

export const aiwaPalette = {
  accent: "#F59900",
  accentDeep: "#AC0000",
  backdrop: "#0E0C0B",
  ink: "#FFF8EF",
  muted: "#D8CEC4",
  plate: "#17120F",
  plateLift: "#2A1810",
} as const;

export const aiwaWordmarkSrc = "/brand/wordmark.svg";
export const aiwaLogomarkSrc = "/brand/logomark.svg";

export const defaultHuggingFaceModelId = "black-forest-labs/FLUX.1-schnell";

export const huggingFaceInferenceOrigin =
  "https://router.huggingface.co/hf-inference/models/";

export interface BannerCategory {
  folder: string;
  label: string;
  tone: string;
  value: string;
}

export const bannerCategories: readonly BannerCategory[] = [
  { folder: "blog post", label: "Blog post", tone: "editorial, quiet, and spacious", value: "blog-post" },
  { folder: "brand", label: "Brand", tone: "confident, warm, and unmistakable", value: "brand" },
  { folder: "changelog & updates", label: "Changelog", tone: "precise, technical, and calm", value: "changelog" },
  { folder: "ebooks and bonuses", label: "Ebook", tone: "generous, printed, and inviting", value: "ebook" },
  { folder: "events", label: "Event", tone: "gathered, lively, and anticipatory", value: "event" },
  { folder: "feature announcment", label: "Feature", tone: "clear, product-focused, and bright", value: "feature" },
  { folder: "funding announcement", label: "Funding", tone: "assured, expansive, and steady", value: "funding" },
  { folder: "happy new month", label: "New month", tone: "fresh, hopeful, and light", value: "new-month" },
  { folder: "hiring role", label: "Hiring", tone: "open, human, and energetic", value: "hiring" },
  { folder: "meme", label: "Meme", tone: "playful, graphic, and bold", value: "meme" },
  { folder: "new employee", label: "New hire", tone: "welcoming, personal, and warm", value: "employee" },
  { folder: "new integration", label: "Integration", tone: "connected, systematic, and crisp", value: "integration" },
  { folder: "new video", label: "New video", tone: "cinematic, dark, and focused", value: "video" },
  { folder: "partnerships", label: "Partnership", tone: "shared, balanced, and collaborative", value: "partnership" },
  { folder: "podcast", label: "Podcast", tone: "spoken, intimate, and rhythmic", value: "podcast" },
  { folder: "promotions", label: "Promotion", tone: "direct, vivid, and urgent", value: "promotion" },
  { folder: "question", label: "Question", tone: "curious, open, and spare", value: "question" },
  { folder: "reviews", label: "Review", tone: "trusted, considered, and clear", value: "review" },
  { folder: "showcase", label: "Showcase", tone: "gallery-like, polished, and proud", value: "showcase" },
  { folder: "webinar", label: "Webinar", tone: "instructional, seated, and focused", value: "webinar" },
];

export interface BannerPlatform {
  height: number;
  label: string;
  value: string;
  width: number;
}

export const bannerPlatforms: readonly BannerPlatform[] = [
  { height: 630, label: "Open Graph", value: "open-graph", width: 1200 },
  { height: 627, label: "LinkedIn", value: "linkedin", width: 1200 },
  { height: 900, label: "X", value: "x", width: 1600 },
  { height: 1080, label: "Instagram", value: "instagram", width: 1080 },
  { height: 1920, label: "Story", value: "story", width: 1080 },
];

export const defaultBannerCategory = "brand";
export const defaultBannerPlatform = "open-graph";

export const defaultBannerCopy = {
  cta: "Learn more",
  direction: "Soft orange light across a dark field",
  headline: "Build what matters",
  support: "Turn a focused idea into a sharp AIWA banner without redrawing the logo.",
} as const;

export const artPromptGuard =
  "Do not render text, letters, words, numbers, logos, wordmarks, watermarks, or signage.";

export interface BannerPromptInput {
  category: string;
  direction: string;
  platform: string;
}

export function readBannerText(
  values: Readonly<Record<string, unknown>>,
  target: string,
  fallback: string,
): string {
  const value = values[target];
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

export function findBannerCategory(value: string): BannerCategory {
  return (
    bannerCategories.find((category) => category.value === value) ??
    bannerCategories.find((category) => category.value === defaultBannerCategory) ??
    bannerCategories[0]!
  );
}

export function findBannerPlatform(value: string): BannerPlatform {
  return (
    bannerPlatforms.find((platform) => platform.value === value) ??
    bannerPlatforms.find((platform) => platform.value === defaultBannerPlatform) ??
    bannerPlatforms[0]!
  );
}

export function buildArtPrompt(input: BannerPromptInput): string {
  const category = findBannerCategory(input.category);
  const platform = findBannerPlatform(input.platform);
  const direction = input.direction.trim();

  return [
    "Abstract photographic background plate for an AIWA banner.",
    `Dark ground near ${aiwaPalette.plate}.`,
    `Orange-to-red accent from ${aiwaPalette.accent} to ${aiwaPalette.accentDeep}.`,
    `Category tone: ${category.tone}.`,
    `Channel: ${platform.label}, ${platform.width} by ${platform.height}.`,
    "Leave a clear dark area on the left for type that will be added later.",
    direction,
    artPromptGuard,
  ]
    .filter((part) => part.length > 0)
    .join(" ");
}
