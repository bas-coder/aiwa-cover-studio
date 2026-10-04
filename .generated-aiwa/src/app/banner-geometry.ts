export interface BannerRect {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface BannerFractions {
  height: number;
  width: number;
  x: number;
  y: number;
}

export const bannerPlateFractions: BannerFractions = {
  height: 0.8,
  width: 0.84,
  x: 0.08,
  y: 0.1,
};

export const bannerAccentFractions: BannerFractions = {
  height: 0.16,
  width: 0.18,
  x: 0.62,
  y: 0.22,
};

export const bannerAccentSample = {
  xRatio: bannerAccentFractions.x + bannerAccentFractions.width / 2,
  yRatio: bannerAccentFractions.y + bannerAccentFractions.height / 2,
} as const;

export function placeBannerRect(
  frame: BannerRect,
  fractions: BannerFractions,
): BannerRect {
  return {
    height: frame.height * fractions.height,
    width: frame.width * fractions.width,
    x: frame.x + frame.width * fractions.x,
    y: frame.y + frame.height * fractions.y,
  };
}

export function bannerSceneRect(size: {
  height: number;
  width: number;
}): BannerRect {
  return {
    height: size.height,
    width: size.width,
    x: -size.width / 2,
    y: -size.height / 2,
  };
}
