import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs';

import { FavoritesStore } from '../../core/state/favorites-store';

export type HeaderSection = 'photos' | 'favorites';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, MatToolbar, MatButton, MatIcon, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly router = inject(Router);
  protected readonly favoritesCount = inject(FavoritesStore).count;

  protected readonly activeSection$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map((event) => event.urlAfterRedirects),
    startWith(this.router.url),
    map((url): HeaderSection =>
      url.includes('/favorites') || url.includes('/photos/') ?
        'favorites' : 'photos',
    ),
    distinctUntilChanged(),
  );
}
