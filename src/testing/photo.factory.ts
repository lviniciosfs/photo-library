import { Photo } from '../app/core/models/photo';

export function makePhoto(id: string, width = 200, height = 300): Photo {
  return {
    id,
    width,
    height,
    url: `https://picsum.photos/seed/${encodeURIComponent(id)}/${width}/${height}`,
  };
}
