export interface ArtPlateSnapshot {
  blob: Blob | null;
  objectUrl: string | null;
  revision: number;
}

const emptyArtPlate: ArtPlateSnapshot = {
  blob: null,
  objectUrl: null,
  revision: 0,
};

let artPlate: ArtPlateSnapshot = emptyArtPlate;
const listeners = new Set<() => void>();

function publish(next: ArtPlateSnapshot): void {
  artPlate = next;
  for (const listener of listeners) {
    listener();
  }
}

export function getArtPlateSnapshot(): ArtPlateSnapshot {
  return artPlate;
}

export function subscribeArtPlate(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function bytesToDataUrl(bytes: Uint8Array, mediaType: string): string {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index] ?? 0);
  }
  return `data:${mediaType};base64,${btoa(binary)}`;
}

export async function setArtPlate(blob: Blob): Promise<void> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const mediaType = blob.type.startsWith("image/") ? blob.type : "image/png";

  publish({
    blob,
    objectUrl: bytesToDataUrl(bytes, mediaType),
    revision: artPlate.revision + 1,
  });
}

export function clearArtPlate(): void {
  if (!artPlate.blob && !artPlate.objectUrl) {
    return;
  }

  publish({
    blob: null,
    objectUrl: null,
    revision: artPlate.revision + 1,
  });
}
