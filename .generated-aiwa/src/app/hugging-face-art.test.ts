import { afterEach, describe, expect, it, vi } from "vitest";

import { clearArtPlate, getArtPlateSnapshot, setArtPlate } from "./art-plate";
import {
  artPromptGuard,
  buildArtPrompt,
  defaultHuggingFaceModelId,
} from "./brand-profile";
import {
  huggingFaceImageEndpoint,
  isRasterImageBytes,
  requestHuggingFaceArt,
} from "./hugging-face-art";

const pngBytes = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
]);

describe("AIWA art prompt", () => {
  it("keeps the brand palette and forbids text and logos", () => {
    const prompt = buildArtPrompt({
      category: "funding",
      direction: "A thin arc of light",
      platform: "linkedin",
    });

    expect(prompt).toContain("#17120F");
    expect(prompt).toContain("#F59900");
    expect(prompt).toContain("#AC0000");
    expect(prompt).toContain("assured, expansive, and steady");
    expect(prompt).toContain("LinkedIn");
    expect(prompt).toContain("A thin arc of light");
    expect(prompt).toContain(artPromptGuard);
  });

  it("category changes the poster label and prompt tone", () => {
    const brand = buildArtPrompt({
      category: "brand",
      direction: "",
      platform: "open-graph",
    });
    const webinar = buildArtPrompt({
      category: "webinar",
      direction: "",
      platform: "open-graph",
    });

    expect(brand).toContain("confident, warm, and unmistakable");
    expect(webinar).toContain("instructional, seated, and focused");
  });
});

describe("Hugging Face art request", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    clearArtPlate();
  });

  it("builds the public inference endpoint", () => {
    expect(huggingFaceImageEndpoint(defaultHuggingFaceModelId)).toBe(
      `https://router.huggingface.co/hf-inference/models/${defaultHuggingFaceModelId}`,
    );
    expect(huggingFaceImageEndpoint("not a model")).toBeNull();
  });

  it("recognizes png, jpeg, and webp signatures", () => {
    expect(isRasterImageBytes(pngBytes)).toBe(true);
    expect(isRasterImageBytes(Uint8Array.from([0xff, 0xd8, 0xff, 0x00]))).toBe(true);
    expect(isRasterImageBytes(Uint8Array.from([0x52, 0x49, 0x46, 0x46]))).toBe(true);
    expect(isRasterImageBytes(Uint8Array.from([0x7b, 0x22]))).toBe(false);
  });

  it("token stays off the poster and a missing token keeps the local plate", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await requestHuggingFaceArt({
      modelId: defaultHuggingFaceModelId,
      prompt: "plate",
      token: "  ",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("local brand plate");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("model id is a panel setting and a rejected response keeps the local plate", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ error: "unauthorized" }), {
          headers: { "content-type": "application/json" },
          status: 401,
        }),
      ),
    );

    const result = await requestHuggingFaceArt({
      modelId: "your-name/aiwa-banners",
      prompt: "plate",
      token: "hf_test",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("did not return an image");
    }
  });

  it("generate and export share the sticky footer image bytes", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(pngBytes, {
          headers: { "content-type": "image/png" },
          status: 200,
        }),
      ),
    );

    const result = await requestHuggingFaceArt({
      modelId: defaultHuggingFaceModelId,
      prompt: buildArtPrompt({
        category: "brand",
        direction: "Soft orange light",
        platform: "open-graph",
      }),
      token: "hf_test",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      await setArtPlate(result.blob);
      expect(getArtPlateSnapshot().blob).toBe(result.blob);
      expect(getArtPlateSnapshot().objectUrl?.startsWith("data:image/png;base64,")).toBe(
        true,
      );
      expect(getArtPlateSnapshot().revision).toBe(1);
    }
  });
});
