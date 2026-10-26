import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { Photo } from '../../core/models/photo';
import { FavoritesStore } from '../../core/state/favorites-store';
import { PhotoStreamStore } from '../../core/state/photo-stream-store';
import { InfiniteScroll } from '../../shared/directives/infinite-scroll';
import { Loader } from '../../shared/ui/loader/loader';
import { PhotoGrid } from '../../shared/ui/photo-grid/photo-grid';

@Component({
  selector: 'app-photos-page',
  imports: [PhotoGrid, Loader, InfiniteScroll, MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photos-page.html',
  styleUrl: './photos-page.scss',
})
export class PhotosPage {
  protected readonly stream = inject(PhotoStreamStore);
  protected readonly favorites = inject(FavoritesStore);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  protected readonly streamState = toSignal(this.stream.state$, { requireSync: true });

  protected addToFavorites(photo: Photo) {
    const added = this.favorites.add(photo);
    const message = added ? 'Added to favorites' : 'Already in favorites';
    this.snackBar
      .open(message, 'View', { duration: 2500 })
      .onAction()
      .pipe(switchMap(() => this.router.navigate(['/favorites'])))
      .subscribe();
  }
}
