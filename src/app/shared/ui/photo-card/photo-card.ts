import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';

import { Photo } from '../../../core/models/photo';

@Component({
  selector: 'app-photo-card',
  imports: [NgOptimizedImage, MatIcon, MatRipple],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './photo-card.html',
  styleUrl: './photo-card.scss',
})
export class PhotoCard {
  readonly photo = input.required<Photo>();
  readonly actionLabel = input.required<string>();
  readonly favorite = input(false);
  readonly priority = input(false);

  readonly selected = output<Photo>();
}
