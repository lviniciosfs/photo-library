import { computed, inject, Injectable, InjectionToken, signal } from '@angular/core';

import { isPhoto, Photo } from '../models/photo';

export const FAVORITES_STORAGE_KEY = 'photo-library.favorites';

export const FAVORITES_STORAGE = new InjectionToken<Storage>('FAVORITES_STORAGE', {
  providedIn: 'root',
  factory: () => localStorage,
});

@Injectable({ providedIn: 'root' })
export class FavoritesStore {
  private readonly storage = inject(FAVORITES_STORAGE);
  private readonly state = signal<readonly Photo[]>(this.restore());

  readonly favorites = this.state.asReadonly();
  readonly ids = computed(() => new Set(this.state().map((photo) => photo.id)));
  readonly count = computed(() => this.state().length);

  isFavorite(id: string): boolean {
    return this.ids().has(id);
  }

  add(photo: Photo): boolean {
    if (this.isFavorite(photo.id)) {
      return false;
    }
    this.saveOnLocalStorage([...this.state(), photo]);
    return true;
  }

  remove(id: string): boolean {
    if (!this.isFavorite(id)) {
      return false;
    }
    this.saveOnLocalStorage(this.state().filter((photo) => photo.id !== id));
    return true;
  }

  private saveOnLocalStorage(favorites: readonly Photo[]) {
    this.state.set(favorites);
    try {
      this.storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.warn('Could not persist favorites.', error);
    }
  }

  private restore(): Photo[] {
    try {
      const raw = this.storage.getItem(FAVORITES_STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(isPhoto) : [];
    } catch (error) {
      console.warn('Could not restore favorites, starting with an empty list.', error);
      return [];
    }
  }
}
