import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeIntersectionObserver } from '../../../testing/fake-intersection-observer';
import { InfiniteScroll } from './infinite-scroll';

@Component({
  imports: [InfiniteScroll],
  template: `
    <div
      appInfiniteScroll
      rootMargin="123px"
      [scrollDisabled]="disabled()"
      (scrolled)="scrolledCount = scrolledCount + 1"
    ></div>
  `,
})
class Host {
  readonly disabled = signal(false);
  scrolledCount = 0;
}

describe('InfiniteScroll', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  beforeEach(async () => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('should observe the host element with the given root margin when rendered', () => {
    const observer = FakeIntersectionObserver.last;

    expect(observer.observe).toHaveBeenCalledWith(fixture.nativeElement.querySelector('div'));
    expect(observer.options?.rootMargin).toBe('123px');
  });

  it('should emit scrolled when the sentinel enters the viewport', () => {
    FakeIntersectionObserver.last.trigger(true);

    expect(host.scrolledCount).toBe(1);
  });

  it('should not emit when the sentinel leaves the viewport', () => {
    FakeIntersectionObserver.last.trigger(false);

    expect(host.scrolledCount).toBe(0);
  });

  it('should not emit when scrolling is disabled', async () => {
    host.disabled.set(true);
    await fixture.whenStable();

    FakeIntersectionObserver.last.trigger(true);

    expect(host.scrolledCount).toBe(0);
  });

  it('should re-observe the sentinel when scrolling is enabled again', async () => {
    const observer = FakeIntersectionObserver.last;
    host.disabled.set(true);
    await fixture.whenStable();
    observer.observe.mockClear();

    host.disabled.set(false);
    await fixture.whenStable();

    expect(observer.unobserve).toHaveBeenCalledTimes(1);
    expect(observer.observe).toHaveBeenCalledTimes(1);
  });

  it('should disconnect the observer when destroyed', () => {
    const observer = FakeIntersectionObserver.last;

    fixture.destroy();

    expect(observer.disconnect).toHaveBeenCalled();
  });
});
