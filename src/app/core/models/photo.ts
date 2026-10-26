export interface Photo {
  readonly id: string;
  readonly url: string;
  readonly width: number;
  readonly height: number;
}

export function isPhoto(value: unknown): value is Photo {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['id'] === 'string' &&
    typeof candidate['url'] === 'string' &&
    typeof candidate['width'] === 'number' &&
    typeof candidate['height'] === 'number'
  );
}
