import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Photo } from '../../../core/models/photo';
import { PhotoCard } from '../photo-card/photo-card';

@Component({
  selector: 'app-photo-grid',
  imports: [PhotoCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="photo-grid" role="list">
      @for (photo of photos(); track photo.id) {
        <li class="photo-grid-item">
          <app-photo-card
            [photo]="photo"
            [actionLabel]="actionLabel()"
            [favorite]="favoriteIds().has(photo.id)"
            [priority]="$index < priorityCount()"
            (selected)="photoSelected.emit($event)"
          />
        </li>
      }
    </ul>
  `,
  styleUrl: './photo-grid.scss',
})
export class PhotoGrid {
  readonly photos = input.required<readonly Photo[]>();
  readonly actionLabel = input.required<string>();
  readonly favoriteIds = input<ReadonlySet<string>>(new Set());
  readonly priorityCount = input(6);

  readonly photoSelected = output<Photo>();
}
