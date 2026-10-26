import { inject, Injectable } from '@angular/core';
import { defer, map, Observable, timer } from 'rxjs';

import { Photo } from '../models/photo';

@Injectable({ providedIn: 'root' })
export class PhotoApi {

  getRandomPhotos(count: number = 10): Observable<Photo[]> {
    return defer(() => {
      const photos = Array.from({ length: count }, () => this.createRandomPhoto());
      return timer(300).pipe(map(() => photos));
    });
  }

  private createRandomPhoto(): Photo {
    const id = crypto.randomUUID();
    return {
      id,
      width: 200,
      height: 300,
      url: `https://picsum.photos/seed/${encodeURIComponent(id)}/200/300`,
    };
  }
}
