"use client";

import { useSyncExternalStore } from "react";

import {
  useToolcraftEvaluatedValues,
  useToolcraftSelector,
} from "@/toolcraft/runtime/react";

import { getArtPlateSnapshot, subscribeArtPlate } from "./art-plate";
import {
  bannerAccentFractions,
  bannerPlateFractions,
  placeBannerRect,
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

const localArtSource = "local";
const modelArtSource = "model";

function wrapCopy(value: string, limit: number): string[] {
  const words = value.trim().split(/\s+/u);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line.length === 0 ? word : `${line} ${word}`;
    if (line.length > 0 && next.length > limit) {
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

export function BannerScene() {
  const values = useToolcraftEvaluatedValues();
  const size = useToolcraftSelector((state) => state.canvas.size);
  const plate = useSyncExternalStore(subscribeArtPlate, getArtPlateSnapshot, getArtPlateSnapshot);
  const frame = { height: size.height, width: size.width, x: 0, y: 0 };
  const plateRect = placeBannerRect(frame, bannerPlateFractions);
  const accentRect = placeBannerRect(frame, bannerAccentFractions);
  const category = findBannerCategory(
    readBannerText(values, "brief.category", defaultBannerCategory),
  );
  const platform = findBannerPlatform(
    readBannerText(values, "brief.platform", defaultBannerPlatform),
  );
  const headline = readBannerText(values, "copy.headline", defaultBannerCopy.headline);
  const support = wrapCopy(
    readBannerText(values, "copy.support", defaultBannerCopy.support),
    42,
  );
  const cta = readBannerText(values, "copy.cta", defaultBannerCopy.cta);
  const textX = plateRect.x + plateRect.width * 0.06;
  const headlineSize = Math.max(28, size.width * 0.048);
  const supportSize = Math.max(14, size.width * 0.02);
  const metaSize = Math.max(12, size.width * 0.016);

  return (
    <svg
      data-art-source={plate.objectUrl ? modelArtSource : localArtSource}
      data-toolcraft-product-output=""
      height="100%"
      overflow="visible"
      viewBox={`0 0 ${size.width} ${size.height}`}
      width="100%"
    >
      <rect
        fill="transparent"
        height={size.height}
        width={size.width}
        x={0}
        y={0}
      />
      <defs>
        <linearGradient id="aiwa-plate" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={aiwaPalette.plate} />
          <stop offset="1" stopColor={aiwaPalette.plateLift} />
        </linearGradient>
      </defs>
      {plate.objectUrl ? (
        <image
          height={plateRect.height}
          href={plate.objectUrl}
          preserveAspectRatio="xMidYMid slice"
          width={plateRect.width}
          x={plateRect.x}
          y={plateRect.y}
        />
      ) : (
        <rect
          fill="url(#aiwa-plate)"
          height={plateRect.height}
          width={plateRect.width}
          x={plateRect.x}
          y={plateRect.y}
        />
      )}
      <rect
        fill={aiwaPalette.accent}
        height={accentRect.height}
        width={accentRect.width}
        x={accentRect.x}
        y={accentRect.y}
      />
      <image
        height={plateRect.height * 0.12}
        href={aiwaWordmarkSrc}
        width={plateRect.width * 0.28}
        x={textX}
        y={plateRect.y + plateRect.height * 0.08}
      />
      <text
        fill={aiwaPalette.muted}
        fontFamily="Inter, sans-serif"
        fontSize={metaSize}
        x={textX}
        y={plateRect.y + plateRect.height * 0.3}
      >
        {`${category.label} · ${platform.label}`}
      </text>
      <text
        data-toolcraft-product-text=""
        fill={aiwaPalette.ink}
        fontFamily="Inter, sans-serif"
        fontSize={headlineSize}
        fontWeight={650}
        x={textX}
        y={plateRect.y + plateRect.height * 0.46}
      >
        {headline}
      </text>
      {support.map((line, index) => (
        <text
          fill={aiwaPalette.muted}
          fontFamily="Inter, sans-serif"
          fontSize={supportSize}
          key={`${line}-${index}`}
          x={textX}
          y={plateRect.y + plateRect.height * 0.6 + index * supportSize * 1.35}
        >
          {line}
        </text>
      ))}
      <text
        fill={aiwaPalette.ink}
        fontFamily="Inter, sans-serif"
        fontSize={metaSize}
        fontWeight={700}
        x={textX}
        y={plateRect.y + plateRect.height * 0.86}
      >
        {cta}
      </text>
    </svg>
  );
}
