import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';

import { FavoritesStore } from '../../core/state/favorites-store';
import { Loader } from '../../shared/ui/loader/loader';

export const DETAIL_PHOTO_WIDTH = 1200;
export const DETAIL_PHOTO_HEIGHT = 1800;

export type PhotoLoadStatus = 'loading' | 'loaded' | 'error';

@Component({
  selector: 'app-photo-detail-page',
  imports: [NgOptimizedImage, Loader, MatButton, MatIcon, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photo-detail-page.html',
  styleUrl: './photo-detail-page.scss',
})
export class PhotoDetailPage {
  readonly id = input.required<string>();

  protected readonly photoWidth = DETAIL_PHOTO_WIDTH;
  protected readonly photoHeight = DETAIL_PHOTO_HEIGHT;

  private readonly favorites = inject(FavoritesStore);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly photoUrl = computed(() => this.buildPhotoURL());
  protected readonly isFavorite = computed(() => this.favorites.ids().has(this.id()));
  protected readonly loadStatus = linkedSignal<string, PhotoLoadStatus>({
    source: this.id,
    computation: () => 'loading',
  });

  protected removeFromFavorites() {
    if (this.favorites.remove(this.id())) {
      this.snackBar.open('Removed from favorites', undefined, { duration: 2500 });
    }
    this.router.navigate(['/favorites']);
  }

  private buildPhotoURL(){
    return `https://picsum.photos/seed/${encodeURIComponent(this.id())}/${DETAIL_PHOTO_WIDTH}/${DETAIL_PHOTO_HEIGHT}`
  }
}
