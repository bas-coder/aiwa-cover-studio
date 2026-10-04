import { describe, expect, it, vi } from "vitest";

import { getToolcraftImageExportSize } from "@/toolcraft/runtime/export";

import { appComposition } from "./app-composition";
import { appPerformance } from "./app-performance";
import { appSchema } from "./app-schema";
import { bannerSceneRect } from "./banner-geometry";
import {
  aiwaPalette,
  buildArtPrompt,
  defaultBannerCopy,
  defaultBannerPlatform,
  defaultHuggingFaceModelId,
  findBannerPlatform,
  readBannerText,
} from "./brand-profile";
import { huggingFaceImageEndpoint, requestHuggingFaceArt } from "./hugging-face-art";

const squareFrame = { height: 100, width: 100, x: 0, y: 0 };
const openGraph = findBannerPlatform(defaultBannerPlatform);

function controlByTarget(target: string) {
  const sections = appSchema.panels.controls?.sections ?? [];
  for (const section of sections) {
    for (const control of Object.values(section.controls)) {
      if (control.target === target) {
        return control;
      }
    }
  }

  throw new Error(`Missing control for ${target}.`);
}

function exportLongEdge(resolution: "2k" | "4k" | "8k"): number {
  const size = getToolcraftImageExportSize({
    frame: squareFrame,
    resolution,
    state: appSchema as never,
  });
  return Math.max(size.width, size.height);
}

describe("banner acceptance runtime", () => {
  it("background color is the runtime backdrop", () => {
    expect(controlByTarget("appearance.background")).toMatchObject({
      defaultValue: aiwaPalette.backdrop,
      target: "appearance.background",
      type: "color",
    });
  });

  it("platform changes the poster channel label", () => {
    const story = findBannerPlatform("story");
    const prompt = buildArtPrompt({
      category: "brand",
      direction: "",
      platform: story.value,
    });

    expect(story.label).toBe("Story");
    expect(prompt).toContain(`${story.label}, ${story.width} by ${story.height}`);
    expect(prompt).not.toContain(openGraph.label);
    expect(controlByTarget("brief.platform").defaultValue).toBe(defaultBannerPlatform);
  });

  it("headline changes the locked poster type", () => {
    const headline = "Ship the work";
    expect(readBannerText({ "copy.headline": headline }, "copy.headline", defaultBannerCopy.headline)).toBe(
      headline,
    );
    expect(controlByTarget("copy.headline").defaultValue).toBe(defaultBannerCopy.headline);
  });

  it("support changes the locked poster type", () => {
    const support = "A shorter line for the plate.";
    expect(readBannerText({ "copy.support": support }, "copy.support", defaultBannerCopy.support)).toBe(
      support,
    );
    expect(controlByTarget("copy.support").defaultValue).toBe(defaultBannerCopy.support);
  });

  it("cta changes the locked poster type", () => {
    const cta = "Start now";
    expect(readBannerText({ "copy.cta": cta }, "copy.cta", defaultBannerCopy.cta)).toBe(cta);
    expect(controlByTarget("copy.cta").defaultValue).toBe(defaultBannerCopy.cta);
  });

  it("token stays off the poster", async () => {
    const token = "hf_test_token";
    const prompt = buildArtPrompt({
      category: "brand",
      direction: defaultBannerCopy.direction,
      platform: defaultBannerPlatform,
    });
    let seenUrl = "";
    let seenInit: RequestInit | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        seenUrl = String(input);
        seenInit = init;
        return new Response(null, { status: 500 });
      }),
    );

    await requestHuggingFaceArt({
      modelId: defaultHuggingFaceModelId,
      prompt,
      token,
    });

    expect(prompt).not.toContain(token);
    expect(seenUrl).toBe(huggingFaceImageEndpoint(defaultHuggingFaceModelId));
    expect(JSON.parse(String(seenInit?.body))).toEqual({ inputs: prompt });
    expect(seenInit?.headers).toMatchObject({ Authorization: `Bearer ${token}` });
    expect(controlByTarget("art.token").defaultValue).toBe("");
    vi.unstubAllGlobals();
  });

  it("model id is a panel setting", () => {
    const modelId = "your-name/aiwa-banners";
    expect(controlByTarget("art.model").defaultValue).toBe(defaultHuggingFaceModelId);
    expect(huggingFaceImageEndpoint(modelId)).toBe(
      `https://router.huggingface.co/hf-inference/models/${modelId}`,
    );
  });

  it("direction is included in the art prompt", () => {
    const direction = "A thin copper arc";
    expect(
      buildArtPrompt({
        category: "brand",
        direction,
        platform: defaultBannerPlatform,
      }),
    ).toContain(direction);
    expect(controlByTarget("art.direction").defaultValue).toBe(defaultBannerCopy.direction);
  });

  it("image format selects png or jpg", () => {
    const format = controlByTarget("export.image.format");
    expect(format.type).toBe("select");
    expect(format.defaultValue).toBe("png");
    expect(format.options?.map((option) => option.value)).toEqual(["png", "jpg"]);
  });

  it("image resolution selects a long-edge preset", () => {
    const resolution = controlByTarget("export.image.resolution");
    const dimension = appPerformance.workloadEnvelope.dimensions[0];

    expect(resolution.type).toBe("select");
    expect(resolution.defaultValue).toBe("4k");
    expect(resolution.options?.map((option) => option.value)).toEqual(["2k", "4k", "8k"]);
    expect(dimension).toMatchObject({
      batchMax: exportLongEdge("8k"),
      defaultValue: exportLongEdge("4k"),
      source: { kind: "schema-target", target: "export.image.resolution" },
    });
    expect(exportLongEdge("2k")).toBeLessThan(exportLongEdge("4k"));
  });

  it("infinity preserves the banner world frame", () => {
    expect(bannerSceneRect(openGraph)).toEqual({
      height: openGraph.height,
      width: openGraph.width,
      x: -openGraph.width / 2,
      y: -openGraph.height / 2,
    });
  });

  it("infinity export uses the banner scene bounds", () => {
    const provideBounds = appComposition.sceneBoundsProvider;
    if (!provideBounds) {
      throw new Error("The banner scene must declare scene bounds.");
    }

    const bounds = provideBounds({
      state: {
        canvas: {
          size: {
            height: openGraph.height,
            unit: "px",
            width: openGraph.width,
          },
        },
      },
    } as Parameters<typeof provideBounds>[0]);

    expect(bounds).toEqual([bannerSceneRect(openGraph)]);
  });
});
