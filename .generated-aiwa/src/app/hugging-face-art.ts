import {
  huggingFaceInferenceOrigin,
} from "./brand-profile";

const pngSignature = [0x89, 0x50, 0x4e, 0x47] as const;
const jpegSignature = [0xff, 0xd8, 0xff] as const;
const webpSignature = [0x52, 0x49, 0x46, 0x46] as const;

const modelIdPattern = /^[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*$/u;

export interface HuggingFaceArtRequest {
  modelId: string;
  prompt: string;
  token: string;
}

export type HuggingFaceArtResult =
  | { blob: Blob; ok: true }
  | { message: string; ok: false };

export const localPlateMessage =
  "The local brand plate stays in place.";

export function huggingFaceImageEndpoint(modelId: string): string | null {
  const id = modelId.trim();
  if (!modelIdPattern.test(id)) {
    return null;
  }

  return `${huggingFaceInferenceOrigin}${id}`;
}

function startsWith(bytes: Uint8Array, signature: readonly number[]): boolean {
  if (bytes.length < signature.length) {
    return false;
  }

  return signature.every((value, index) => bytes[index] === value);
}

export function isRasterImageBytes(bytes: Uint8Array): boolean {
  return (
    startsWith(bytes, pngSignature) ||
    startsWith(bytes, jpegSignature) ||
    startsWith(bytes, webpSignature)
  );
}

export async function requestHuggingFaceArt(
  request: HuggingFaceArtRequest,
): Promise<HuggingFaceArtResult> {
  if (request.token.trim().length === 0) {
    return {
      message: `Add a Hugging Face token to paint a new plate. ${localPlateMessage}`,
      ok: false,
    };
  }

  const endpoint = huggingFaceImageEndpoint(request.modelId);
  if (!endpoint) {
    return {
      message: `Enter a Hugging Face model id such as organization/name. ${localPlateMessage}`,
      ok: false,
    };
  }

  try {
    const response = await fetch(endpoint, {
      body: JSON.stringify({ inputs: request.prompt }),
      headers: {
        Accept: "image/png",
        Authorization: `Bearer ${request.token.trim()}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const bytes = new Uint8Array(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || !contentType.startsWith("image/") || !isRasterImageBytes(bytes)) {
      return {
        message: `The model did not return an image. ${localPlateMessage}`,
        ok: false,
      };
    }

    return {
      blob: new Blob([bytes], { type: contentType.split(";")[0] || "image/png" }),
      ok: true,
    };
  } catch {
    return {
      message: `The image request did not complete. ${localPlateMessage}`,
      ok: false,
    };
  }
}
