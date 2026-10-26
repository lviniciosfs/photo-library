import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

import { Photo } from '../../core/models/photo';
import { FavoritesStore } from '../../core/state/favorites-store';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { PhotoGrid } from '../../shared/ui/photo-grid/photo-grid';

@Component({
  selector: 'app-favorites-page',
  imports: [PhotoGrid, EmptyState, MatButton, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page" aria-labelledby="favorites-title">
      <h1 id="favorites-title" class="visually-hidden">Favorites</h1>

      @if (favorites().length > 0) {
        <app-photo-grid
          [photos]="favorites()"
          actionLabel="Open photo"
          (photoSelected)="open($event)"
        />
      } @else {
        <app-empty-state message="No favorites yet. Click a photo in the photostream to save it here.">
          <a matButton="filled" routerLink="/">Browse photos</a>
        </app-empty-state>
      }
    </section>
  `,
})
export class FavoritesPage {
  private readonly router = inject(Router);
  protected readonly favorites = inject(FavoritesStore).favorites;

  protected open(photo: Photo) {
    void this.router.navigate(['/photos', photo.id]);
  }
}
