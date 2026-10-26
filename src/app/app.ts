import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header />
    <main class="app-main">
      <router-outlet />
    </main>
  `,
  styleUrl: './app.scss',
})
export class App {}
