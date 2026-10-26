import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  imports: [MatProgressSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loader" role="status" aria-live="polite">
      <mat-progress-spinner mode="indeterminate" [diameter]="diameter()" />
      <span class="loader-label">{{ label() }}</span>
    </div>
  `,
  styleUrl: './loader.scss',
})
export class Loader {
  readonly label = input('Loading...');
  readonly diameter = input(40);
}
