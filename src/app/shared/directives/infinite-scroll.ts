import {
  afterNextRender,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
  untracked,
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScroll {
  readonly scrollDisabled = input(false);
  readonly rootMargin = input('300px');

  readonly scrolled = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => {
      this.observer = new IntersectionObserver((entries) => this.onIntersection(entries), {
        rootMargin: this.rootMargin(),
      });
      this.observer.observe(this.host.nativeElement);
    });

    effect(() => {
      if (!this.scrollDisabled()) {
        untracked(() => this.reobserve());
      }
    });

    inject(DestroyRef).onDestroy(() => {
      this.observer?.disconnect();
      this.observer = null;
    });
  }

  private onIntersection(entries: IntersectionObserverEntry[]) {
    const latest = entries[entries.length - 1];
    if (latest?.isIntersecting && !this.scrollDisabled()) {
      this.scrolled.emit();
    }
  }

  private reobserve() {
    if (!this.observer) {
      return;
    }
    const element = this.host.nativeElement;
    this.observer.unobserve(element);
    this.observer.observe(element);
  }
}
