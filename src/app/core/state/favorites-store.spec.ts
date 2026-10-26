import { TestBed } from '@angular/core/testing';

import { makePhoto } from '../../../testing/photo.factory';
import { FAVORITES_STORAGE_KEY, FavoritesStore } from './favorites-store';

describe('FavoritesStore', () => {
  function createStore(): FavoritesStore {
    return TestBed.inject(FavoritesStore);
  }

  function saved(): unknown {
    return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? 'null');
  }

  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => vi.restoreAllMocks());

  it('should start empty when storage has no favorites', () => {
    const store = createStore();

    expect(store.favorites()).toEqual([]);
    expect(store.count()).toBe(0);
  });

  it('should restore favorites when storage contains saved photos', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([makePhoto('a'), makePhoto('b')]));

    const store = createStore();

    expect(store.favorites().map((photo) => photo.id)).toEqual(['a', 'b']);
    expect(store.isFavorite('a')).toBe(true);
  });

  it('should skip invalid entries when storage contains malformed photos', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([makePhoto('a'), { id: 1 }, null]));

    const store = createStore();

    expect(store.favorites().map((photo) => photo.id)).toEqual(['a']);
  });

  it('should start empty when storage contains invalid JSON', () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, '{not json');

    const store = createStore();

    expect(store.favorites()).toEqual([]);
    expect(console.warn).toHaveBeenCalled();
  });

  it('should add and persist a photo when it is not a favorite yet', () => {
    const store = createStore();
    const photo = makePhoto('a');

    expect(store.add(photo)).toBe(true);

    expect(store.favorites()).toEqual([photo]);
    expect(store.ids().has('a')).toBe(true);
    expect(saved()).toEqual([photo]);
  });

  it('should not duplicate a photo when it is already a favorite', () => {
    const store = createStore();
    store.add(makePhoto('a'));

    expect(store.add(makePhoto('a'))).toBe(false);

    expect(store.count()).toBe(1);
  });

  it('should remove and persist when the photo is a favorite', () => {
    const store = createStore();
    store.add(makePhoto('a'));
    store.add(makePhoto('b'));

    expect(store.remove('a')).toBe(true);

    expect(store.favorites().map((photo) => photo.id)).toEqual(['b']);
    expect(saved()).toEqual([makePhoto('b')]);
  });

  it('should return false when removing a photo that is not a favorite', () => {
    const store = createStore();

    expect(store.remove('missing')).toBe(false);
  });

  it('should keep the in-memory state when writing to storage fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const store = createStore();

    store.add(makePhoto('a'));

    expect(store.isFavorite('a')).toBe(true);
    expect(console.warn).toHaveBeenCalled();
  });
});
