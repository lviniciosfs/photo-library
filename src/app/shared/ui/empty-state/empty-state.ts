import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  imports: [MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty-state">
      <mat-icon class="empty-state-icon" aria-hidden="true">{{ icon() }}</mat-icon>
      <p class="empty-state-message">{{ message() }}</p>
      <ng-content />
    </div>
  `,
  styleUrl: './empty-state.scss',
})
export class EmptyState {
  readonly message = input.required<string>();
  readonly icon = input('photo_library');
}
