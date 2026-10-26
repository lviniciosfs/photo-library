import { inject, Injectable } from '@angular/core';
import {
  catchError,
  exhaustMap,
  map,
  Observable,
  of,
  scan,
  shareReplay,
  startWith,
  Subject,
} from 'rxjs';

import { PhotoApi } from '../api/api';
import { Photo } from '../models/photo';

export const LOAD_PHOTOS_ERROR = 'Could not load photos. Please try again.';

export interface PhotoStreamState {
  readonly photos: readonly Photo[];
  readonly loading: boolean;
  readonly error: string | null;
}

export const INITIAL_PHOTO_STREAM_STATE: PhotoStreamState = {
  photos: [],
  loading: false,
  error: null,
};

type StateUpdate = (state: PhotoStreamState) => PhotoStreamState;

const loadStarted: StateUpdate = (state) => ({ ...state, loading: true, error: null });

const loadSucceeded =
  (photos: readonly Photo[]): StateUpdate =>
  (state) => ({ ...state, loading: false, photos: [...state.photos, ...photos] });

const loadFailed: StateUpdate = (state) => ({
  ...state,
  loading: false,
  error: LOAD_PHOTOS_ERROR,
});

@Injectable({ providedIn: 'root' })
export class PhotoStreamStore {
  private readonly api = inject(PhotoApi);
  private readonly loadRequests = new Subject<void>();

  readonly state$: Observable<PhotoStreamState> = this.loadRequests.pipe(
    startWith(undefined),
    exhaustMap(() =>
      this.api.getRandomPhotos().pipe(
        map(loadSucceeded),
        catchError(() => of(loadFailed)),
        startWith(loadStarted),
      ),
    ),
    scan((state, update) => update(state), INITIAL_PHOTO_STREAM_STATE),
    startWith(INITIAL_PHOTO_STREAM_STATE),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  loadMore() {
    this.loadRequests.next();
  }
}
