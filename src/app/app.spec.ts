import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { FakeIntersectionObserver } from '../testing/fake-intersection-observer';
import { App } from './app';
import { routes } from './app.routes';
import { FavoritesPage } from './features/favorites/favorites-page';
import { PhotoDetailPage } from './features/photo-detail/photo-detail-page';
import { PhotosPage } from './features/photos/photos-page';

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
      ],
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it('should render the header and the main outlet when created', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('app-header')).not.toBeNull();
    expect(element.querySelector('main router-outlet')).not.toBeNull();
  });

  it('should show the photostream when navigating to the root path', async () => {
    const harness = await RouterTestingHarness.create();

    await expect(harness.navigateByUrl('/', PhotosPage)).resolves.toBeInstanceOf(PhotosPage);
  });

  it('should show the favorites page when navigating to /favorites', async () => {
    const harness = await RouterTestingHarness.create();

    await expect(harness.navigateByUrl('/favorites', FavoritesPage)).resolves.toBeInstanceOf(
      FavoritesPage,
    );
  });

  it('should bind the route id when navigating to /photos/:id', async () => {
    const harness = await RouterTestingHarness.create();

    const page = await harness.navigateByUrl('/photos/abc', PhotoDetailPage);

    expect(page.id()).toBe('abc');
  });

  it('should redirect to the photostream when the url is unknown', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/does-not-exist');

    expect(TestBed.inject(Router).url).toBe('/');
  });
});
