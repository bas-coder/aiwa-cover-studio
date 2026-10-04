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

export function setArtPlate(blob: Blob): void {
  if (artPlate.objectUrl) {
    URL.revokeObjectURL(artPlate.objectUrl);
  }

  const objectUrl =
    typeof URL.createObjectURL === "function" ? URL.createObjectURL(blob) : null;

  publish({
    blob,
    objectUrl,
    revision: artPlate.revision + 1,
  });
}

export function clearArtPlate(): void {
  if (!artPlate.blob && !artPlate.objectUrl) {
    return;
  }

  if (artPlate.objectUrl) {
    URL.revokeObjectURL(artPlate.objectUrl);
  }

  publish({
    blob: null,
    objectUrl: null,
    revision: artPlate.revision + 1,
  });
}
