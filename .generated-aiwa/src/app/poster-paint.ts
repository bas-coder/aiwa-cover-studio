import {
  boxesFor,
  headlineScaleFor,
  motionWave,
  nudgeBox,
  posterAccent,
  posterCream,
  posterMutedOnInk,
  posterMutedOnPaper,
  readPoint,
  supportScaleFor,
  themeForBackground,
  type FractionBox,
  type PosterArrangement,
  type PosterBoxes,
  type PosterTheme,
} from "./design-model";

const claimShift = 0.012;
const markShift = 0.01;
const markScaleAmount = 0.045;
const askFade = 0.28;
const patternShift = 18;

export interface PosterMotion {
  askOpacity: number;
  claimOffsetY: number;
  markOffsetX: number;
  markScale: number;
  patternOffset: number;
  wave: number;
}

export interface PosterFrame {
  arrangement: PosterArrangement;
  ask: string;
  background: string;
  boxes: PosterBoxes;
  claim: string;
  claimScale: number;
  eyebrow: string;
  motion: PosterMotion;
  proof: string;
  supportScale: number;
  theme: PosterTheme;
}

function readText(values: Record<string, unknown>, target: string, fallback: string): string {
  const value = values[target];
  return typeof value === "string" && value.trim() ? value : fallback;
}

function readArrangement(value: unknown): PosterArrangement {
  if (value === "poster" || value === "split" || value === "editorial") return value;
  return "editorial";
}

export function readPosterFrame(
  values: Record<string, unknown>,
  progress: number,
): PosterFrame {
  const arrangement = readArrangement(values["design.arrangement"]);
  const background = readText(values, "appearance.background", "#14110e");
  const claim = readText(values, "copy.title", "A clearer way to say it");
  const resting = boxesFor(arrangement);
  const motionEnabled = values["motion.enabled"] === true;
  const wave = motionEnabled ? motionWave(progress) : 0;
  const boxes: PosterBoxes = {
    ...resting,
    ask: nudgeBox(resting.ask, readPoint(values["place.ask"])),
    claim: nudgeBox(resting.claim, readPoint(values["place.claim"])),
    mark: nudgeBox(resting.mark, readPoint(values["place.mark"])),
  };

  return {
    arrangement,
    ask: readText(values, "copy.cta", "Learn more"),
    background,
    boxes,
    claim,
    claimScale: headlineScaleFor(arrangement, claim),
    eyebrow: readText(values, "copy.eyebrow", "AIWA"),
    motion: {
      askOpacity: 1 - Math.abs(wave) * askFade,
      claimOffsetY: wave * -claimShift,
      markOffsetX: wave * markShift,
      markScale: 1 + Math.abs(wave) * markScaleAmount,
      patternOffset: wave * patternShift,
      wave,
    },
    proof: readText(values, "copy.subtitle", ""),
    supportScale: supportScaleFor(arrangement),
    theme: themeForBackground(background),
  };
}

function wrapLines(
  context: CanvasRenderingContext2D,
  value: string,
  maxWidth: number,
): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && context.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function fillLines(
  context: CanvasRenderingContext2D,
  lines: readonly string[],
  x: number,
  y: number,
  lineHeight: number,
  align: CanvasTextAlign,
): void {
  context.textAlign = align;
  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
  context.textAlign = "left";
}

function paintMesh(
  context: CanvasRenderingContext2D,
  frame: { height: number; width: number; x: number; y: number },
  poster: PosterFrame,
): void {
  const { height, width, x, y } = frame;
  const shift = poster.motion.wave * width * 0.015;
  const glow = context.createRadialGradient(
    x + width * 0.78 + shift,
    y + height * 0.42,
    0,
    x + width * 0.78,
    y + height * 0.42,
    width * 0.38,
  );
  glow.addColorStop(0, "rgba(232,106,31,0.28)");
  glow.addColorStop(1, "rgba(232,106,31,0)");
  context.fillStyle = glow;
  context.fillRect(x, y, width, height);

  const second = context.createRadialGradient(
    x + width * 0.12,
    y + height * 0.9,
    0,
    x + width * 0.12,
    y + height * 0.9,
    width * 0.28,
  );
  second.addColorStop(0, "rgba(247,241,232,0.08)");
  second.addColorStop(1, "rgba(247,241,232,0)");
  context.fillStyle = second;
  context.fillRect(x, y, width, height);
}

function paintPattern(
  context: CanvasRenderingContext2D,
  frame: { height: number; width: number; x: number; y: number },
  box: FractionBox,
  poster: PosterFrame,
): void {
  const { height, width, x, y } = frame;
  const left = x + (box.x + poster.motion.markOffsetX) * width;
  const top = y + box.y * height;
  const boxWidth = box.w * width;
  const boxHeight = box.h * height;
  context.save();
  context.beginPath();
  context.rect(left, top, boxWidth, boxHeight);
  context.clip();
  context.fillStyle = poster.theme === "paper" ? "rgba(20,17,14,0.18)" : "rgba(247,241,232,0.22)";
  const gap = Math.max(10, width * 0.014);
  const offset = poster.motion.patternOffset;
  for (let row = 0; row < boxHeight + gap; row += gap) {
    for (let column = 0; column < boxWidth + gap; column += gap) {
      context.beginPath();
      context.arc(left + column + offset, top + row, Math.max(1.1, width * 0.0016), 0, Math.PI * 2);
      context.fill();
    }
  }
  context.restore();
}

function paintMark(
  context: CanvasRenderingContext2D,
  frame: { height: number; width: number; x: number; y: number },
  box: FractionBox,
  poster: PosterFrame,
): void {
  const { height, width, x, y } = frame;
  const centerX = x + (box.x + box.w / 2 + poster.motion.markOffsetX) * width;
  const centerY = y + (box.y + box.h / 2) * height;
  const radius = Math.min(box.w * width, box.h * height) * 0.42;
  context.save();
  context.translate(centerX, centerY);
  context.scale(poster.motion.markScale, poster.motion.markScale);
  context.strokeStyle = poster.theme === "paper" ? "#14110e" : posterCream;
  context.lineWidth = Math.max(1.5, width * 0.0014);
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.stroke();
  context.strokeStyle = posterAccent;
  context.lineWidth = Math.max(4, width * 0.006);
  context.lineCap = "round";
  context.beginPath();
  context.arc(0, radius * 0.08, radius * 0.72, Math.PI * 0.15, Math.PI * 1.35);
  context.stroke();
  context.fillStyle = posterAccent;
  context.beginPath();
  context.arc(radius * 0.62, -radius * 0.48, radius * 0.1, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

export function paintPoster(
  context: CanvasRenderingContext2D,
  frame: { height: number; width: number; x: number; y: number },
  poster: PosterFrame,
): void {
  const { height, width, x, y } = frame;
  const ink = poster.theme === "paper" ? "#14110e" : posterCream;
  const muted = poster.theme === "paper" ? posterMutedOnPaper : posterMutedOnInk;
  const align: CanvasTextAlign = poster.arrangement === "poster" ? "center" : "left";

  if (poster.arrangement === "split") {
    context.fillStyle = poster.theme === "paper" ? "rgba(20,17,14,0.06)" : "rgba(247,241,232,0.06)";
    context.fillRect(x + width * 0.58, y, width * 0.42, height);
  }

  paintMesh(context, frame, poster);
  paintPattern(context, frame, poster.boxes.mark, poster);
  paintMark(context, frame, poster.boxes.mark, poster);

  const logo = poster.boxes.logo;
  context.fillStyle = ink;
  context.font = `600 ${Math.max(12, width * 0.018)}px Inter, sans-serif`;
  context.fillText("AIWA", x + logo.x * width, y + (logo.y + logo.h) * height);

  const eyebrow = poster.boxes.eyebrow;
  context.fillStyle = posterAccent;
  context.font = `700 ${Math.max(11, width * 0.014)}px Inter, sans-serif`;
  context.textAlign = align;
  context.fillText(
    poster.eyebrow.toUpperCase(),
    x + (align === "center" ? (eyebrow.x + eyebrow.w / 2) * width : eyebrow.x * width),
    y + (eyebrow.y + eyebrow.h) * height,
  );
  context.textAlign = "left";

  const claim = poster.boxes.claim;
  const claimX = x + (align === "center" ? (claim.x + claim.w / 2) * width : claim.x * width);
  const claimY = y + (claim.y + poster.motion.claimOffsetY) * height + width * poster.claimScale;
  context.fillStyle = ink;
  context.font = `600 ${Math.max(28, width * poster.claimScale)}px Palatino Linotype, Palatino, Georgia, serif`;
  const claimLines = wrapLines(context, poster.claim, claim.w * width);
  fillLines(context, claimLines, claimX, claimY, width * poster.claimScale * 1.05, align);

  if (poster.proof) {
    const proof = poster.boxes.proof;
    const proofX = x + (align === "center" ? (proof.x + proof.w / 2) * width : proof.x * width);
    context.fillStyle = muted;
    context.font = `400 ${Math.max(13, width * poster.supportScale)}px Inter, sans-serif`;
    const proofLines = wrapLines(context, poster.proof, proof.w * width);
    fillLines(
      context,
      proofLines,
      proofX,
      y + proof.y * height + width * poster.supportScale,
      width * poster.supportScale * 1.35,
      align,
    );
  }

  const ask = poster.boxes.ask;
  const askX = x + (align === "center" ? (ask.x + ask.w / 2) * width : ask.x * width);
  const askY = y + (ask.y + ask.h * 0.7) * height;
  context.save();
  context.globalAlpha = poster.motion.askOpacity;
  context.fillStyle = ink;
  context.font = `650 ${Math.max(12, width * 0.016)}px Inter, sans-serif`;
  context.textAlign = align;
  context.fillText(poster.ask, askX, askY);
  const askWidth = context.measureText(poster.ask).width;
  const underlineX = align === "center" ? askX - askWidth / 2 : askX;
  context.strokeStyle = posterAccent;
  context.lineWidth = Math.max(2, width * 0.002);
  context.beginPath();
  context.moveTo(underlineX, askY + width * 0.008);
  context.lineTo(underlineX + askWidth, askY + width * 0.008);
  context.stroke();
  context.restore();
}
