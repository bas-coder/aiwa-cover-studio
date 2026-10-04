import type { ToolcraftProductExportRenderer } from "@/toolcraft/runtime";

import { getArtPlateSnapshot } from "./art-plate";
import {
  bannerAccentFractions,
  bannerPlateFractions,
  placeBannerRect,
  type BannerRect,
} from "./banner-geometry";
import {
  aiwaPalette,
  aiwaWordmarkSrc,
  defaultBannerCategory,
  defaultBannerCopy,
  defaultBannerPlatform,
  findBannerCategory,
  findBannerPlatform,
  readBannerText,
} from "./brand-profile";

function wrapLine(
  context: CanvasRenderingContext2D,
  value: string,
  maxWidth: number,
): string[] {
  const words = value.trim().split(/\s+/u);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line.length === 0 ? word : `${line} ${word}`;
    if (line.length > 0 && context.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line.length > 0) {
    lines.push(line);
  }

  return lines.length > 0 ? lines : [""];
}

async function loadImage(src: string): Promise<CanvasImageSource | null> {
  if (typeof Image === "undefined") {
    return null;
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

async function drawPlate(
  context: CanvasRenderingContext2D,
  rect: BannerRect,
): Promise<void> {
  const plate = getArtPlateSnapshot();
  if (plate.blob && typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(plate.blob);
    context.drawImage(bitmap, rect.x, rect.y, rect.width, rect.height);
    bitmap.close();
    return;
  }

  const gradient = context.createLinearGradient(
    rect.x,
    rect.y,
    rect.x + rect.width,
    rect.y + rect.height,
  );
  gradient.addColorStop(0, aiwaPalette.plate);
  gradient.addColorStop(1, aiwaPalette.plateLift);
  context.fillStyle = gradient;
  context.fillRect(rect.x, rect.y, rect.width, rect.height);
}

export const bannerExportRenderer: ToolcraftProductExportRenderer = {
  baseFileName: "aiwa-banner",
  renderFrame: async ({ context, frame, state }) => {
    const values = state.values;
    const plate = placeBannerRect(frame, bannerPlateFractions);
    const accent = placeBannerRect(frame, bannerAccentFractions);
    const category = findBannerCategory(
      readBannerText(values, "brief.category", defaultBannerCategory),
    );
    const platform = findBannerPlatform(
      readBannerText(values, "brief.platform", defaultBannerPlatform),
    );
    const headline = readBannerText(values, "copy.headline", defaultBannerCopy.headline);
    const support = readBannerText(values, "copy.support", defaultBannerCopy.support);
    const cta = readBannerText(values, "copy.cta", defaultBannerCopy.cta);
    const textX = plate.x + plate.width * 0.06;
    const textWidth = plate.width * 0.5;

    await drawPlate(context, plate);
    context.fillStyle = aiwaPalette.accent;
    context.fillRect(accent.x, accent.y, accent.width, accent.height);

    const logo = await loadImage(aiwaWordmarkSrc);
    if (logo) {
      context.drawImage(
        logo,
        textX,
        plate.y + plate.height * 0.08,
        plate.width * 0.28,
        plate.height * 0.12,
      );
    }

    const metaSize = Math.max(12, frame.width * 0.016);
    const headlineSize = Math.max(28, frame.width * 0.048);
    const supportSize = Math.max(14, frame.width * 0.02);
    context.fillStyle = aiwaPalette.muted;
    context.font = `600 ${metaSize}px Inter, sans-serif`;
    context.fillText(
      `${category.label} · ${platform.label}`,
      textX,
      plate.y + plate.height * 0.3,
    );
    context.fillStyle = aiwaPalette.ink;
    context.font = `650 ${headlineSize}px Inter, sans-serif`;
    context.fillText(headline, textX, plate.y + plate.height * 0.46);
    context.fillStyle = aiwaPalette.muted;
    context.font = `400 ${supportSize}px Inter, sans-serif`;
    const lines = wrapLine(context, support, textWidth);
    lines.forEach((line, index) => {
      context.fillText(
        line,
        textX,
        plate.y + plate.height * 0.6 + index * supportSize * 1.35,
      );
    });
    context.fillStyle = aiwaPalette.ink;
    context.font = `700 ${metaSize}px Inter, sans-serif`;
    context.fillText(cta, textX, plate.y + plate.height * 0.86);
  },
};
