import type { ToolcraftProductExportRenderer } from "@/toolcraft/runtime";
import { directCreative, type CreativeIntensity } from "./creative-director";

function read(values: Record<string, unknown>, key: string, fallback: string) {
  return typeof values[key] === "string" ? String(values[key]) : fallback;
}

function wrap(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = value.split(/\s+/); let line = ""; let row = 0;
  for (const word of words) {
    const next = `${line} ${word}`.trim();
    if (line && ctx.measureText(next).width > maxWidth) { ctx.fillText(line, x, y + row * lineHeight); row += 1; line = word; } else line = next;
  }
  ctx.fillText(line, x, y + row * lineHeight);
}

export const exportRenderer: ToolcraftProductExportRenderer = {
  baseFileName: "aiwa-cover",
  renderFrame({ context: ctx, frame, state, timelineProgress }) {
    const v = state.values;
    const d = directCreative({ category: read(v, "brief.category", "brand"), intensity: read(v, "brief.intensity", "balanced") as CreativeIntensity, seed: Number(v["variation.seed"] ?? 1) });
    const { x, y, width: w, height: h } = frame;
    const gradient = ctx.createLinearGradient(x, y, x + w, y + h); gradient.addColorStop(0, "#17120f"); gradient.addColorStop(1, "#24180f"); ctx.fillStyle = gradient; ctx.fillRect(x, y, w, h);
    ctx.save();
    ctx.translate(x + w * .72, y + h * .48); ctx.rotate(-.045);
    ctx.fillStyle = "rgba(30,26,23,.96)"; ctx.strokeStyle = d.accent; ctx.lineWidth = Math.max(1, w * .0015);
    ctx.beginPath(); ctx.roundRect(-w * .16, -h * .20, w * .32, h * .40, w * .025); ctx.fill(); ctx.stroke();
    const visualGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, w * .15); visualGlow.addColorStop(0, `${d.accent}55`); visualGlow.addColorStop(1, "transparent"); ctx.fillStyle = visualGlow; ctx.fillRect(-w * .22, -h * .32, w * .44, h * .64);
    ctx.fillStyle = d.accent; ctx.beginPath(); ctx.arc(-w * .08, -h * .08, w * .037, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.13)"; ctx.fillRect(-w * .08, h * .03, w * .16, h * .018); ctx.fillRect(-w * .08, h * .075, w * .10, h * .014);
    ctx.restore();
    ctx.save(); ctx.globalAlpha = .17; ctx.strokeStyle = d.accent; ctx.lineWidth = Math.max(14, w * .025); ctx.beginPath(); ctx.arc(x + w * .92, y + h * .84, w * .24, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    const pad = w * .075; ctx.fillStyle = d.accent; ctx.font = `700 ${Math.max(12, w * .017)}px Inter, sans-serif`; ctx.fillText(read(v, "copy.eyebrow", "AIWA INTELLIGENCE").toUpperCase(), x + pad, y + h * .34);
    ctx.fillStyle = "#fff8ef"; ctx.font = `650 ${Math.max(38, w * .07 * d.titleScale)}px Bricolage Grotesque, Inter, sans-serif`; wrap(ctx, read(v, "copy.title", "A better way to build what matters"), x + pad, y + h * .47 + Math.sin(timelineProgress * Math.PI * 2) * h * .008, w * .47, w * .066);
    ctx.fillStyle = "#d8cec4"; ctx.font = `400 ${Math.max(14, w * .021)}px Inter, sans-serif`; wrap(ctx, read(v, "copy.subtitle", "Turn focused ideas into high-quality experiences with an AI-assisted creative system built for your brand."), x + pad, y + h * .75, w * .58, w * .032);
    ctx.strokeStyle = d.accent; ctx.lineWidth = 2; const cta = read(v, "copy.cta", "Explore the story"); ctx.font = `700 ${Math.max(12, w * .017)}px Inter, sans-serif`; const ctaW = ctx.measureText(cta).width + w * .035; ctx.strokeRect(x + pad, y + h * .86, ctaW, h * .065); ctx.fillStyle = "#fff8ef"; ctx.fillText(cta, x + pad + w * .0175, y + h * .902);
  },
};
