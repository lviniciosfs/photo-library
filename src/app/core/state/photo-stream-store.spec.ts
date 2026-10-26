import { TestBed } from '@angular/core/testing';
import { Subject, Subscription } from 'rxjs';

import { makePhoto } from '../../../testing/photo.factory';
import { PhotoApi } from '../api/api';
import { Photo } from '../models/photo';
import {
  INITIAL_PHOTO_STREAM_STATE,
  LOAD_PHOTOS_ERROR,
  PhotoStreamState,
  PhotoStreamStore,
} from './photo-stream-store';

describe('PhotoStreamStore', () => {
  let responses: Subject<Photo[]>[];
  let store: PhotoStreamStore;
  let states: PhotoStreamState[];
  let subscription: Subscription;

  beforeEach(() => {
    responses = [];
    states = [];
    const api: Pick<PhotoApi, 'getRandomPhotos'> = {
      getRandomPhotos: () => {
        const response = new Subject<Photo[]>();
        responses.push(response);
        return response;
      },
    };
    TestBed.configureTestingModule({ providers: [{ provide: PhotoApi, useValue: api }] });
    store = TestBed.inject(PhotoStreamStore);
  });

  afterEach(() => subscription?.unsubscribe());

  function connect() {
    subscription = store.state$.subscribe((state) => states.push(state));
  }

  function latest() {
    return states[states.length - 1];
  }

  function respond(index: number, photos: Photo[]) {
    responses[index].next(photos);
    responses[index].complete();
  }

  it('should not request photos when nobody subscribes to the state', () => {
    store.loadMore();

    expect(responses).toHaveLength(0);
  });

  it('should emit the initial state and request the first page when subscribed', () => {
    connect();

    expect(states[0]).toEqual(INITIAL_PHOTO_STREAM_STATE);
    expect(responses).toHaveLength(1);
    expect(latest().loading).toBe(true);
  });

  it('should append photos and stop loading when a page arrives', () => {
    connect();
    respond(0, [makePhoto('a')]);
    store.loadMore();
    respond(1, [makePhoto('b'), makePhoto('c')]);

    expect(latest().photos.map((photo) => photo.id)).toEqual(['a', 'b', 'c']);
    expect(latest().loading).toBe(false);
  });

  it('should ignore loadMore when a request is already in progress', () => {
    connect();

    store.loadMore();
    store.loadMore();

    expect(responses).toHaveLength(1);
  });

  it('should expose an error and stop loading when the request fails', () => {
    connect();

    responses[0].error(new Error('network'));

    expect(latest().error).toBe(LOAD_PHOTOS_ERROR);
    expect(latest().loading).toBe(false);
  });

  it('should keep the loaded photos when a later request fails', () => {
    connect();
    respond(0, [makePhoto('a')]);
    store.loadMore();

    responses[1].error(new Error('network'));

    expect(latest().photos.map((photo) => photo.id)).toEqual(['a']);
  });

  it('should clear the error and load again when loading is retried', () => {
    connect();
    responses[0].error(new Error('network'));

    store.loadMore();

    expect(responses).toHaveLength(2);
    expect(latest().error).toBeNull();
    expect(latest().loading).toBe(true);
  });

  it('should replay the current state without a new request when subscribed again', () => {
    connect();
    respond(0, [makePhoto('a')]);
    subscription.unsubscribe();

    const replayed: PhotoStreamState[] = [];
    subscription = store.state$.subscribe((state) => replayed.push(state));

    expect(responses).toHaveLength(1);
    expect(replayed).toHaveLength(1);
    expect(replayed[0].photos.map((photo) => photo.id)).toEqual(['a']);
  });
});
