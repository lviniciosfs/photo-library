import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter, Router } from '@angular/router';

import { makePhoto } from '../../../testing/photo.factory';
import { FavoritesStore } from '../../core/state/favorites-store';
import { PhotoDetailPage } from './photo-detail-page';

describe('PhotoDetailPage', () => {
  let fixture: ComponentFixture<PhotoDetailPage>;
  let element: HTMLElement;
  let store: FavoritesStore;
  let openSnackBar: ReturnType<typeof vi.fn>;

  async function render(id: string): Promise<void> {
    fixture = TestBed.createComponent(PhotoDetailPage);
    fixture.componentRef.setInput('id', id);
    element = fixture.nativeElement;
    await fixture.whenStable();
  }

  beforeEach(() => {
    openSnackBar = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: MatSnackBar, useValue: { open: openSnackBar } },
      ],
    });
    store = TestBed.inject(FavoritesStore);
  });

  it('should show the photo in large size when opened with an id', async () => {
    await render('abc');

    const image: HTMLImageElement | null = element.querySelector('img');
    expect(image?.src).toBe('https://picsum.photos/seed/abc/1200/1800');
  });

  it('should show the remove button when the photo is a favorite', async () => {
    store.add(makePhoto('abc'));
    await render('abc');

    expect(element.querySelector('button')?.textContent).toContain('Remove from favorites');
  });

  it('should remove the photo and go back to favorites when remove is clicked', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    store.add(makePhoto('abc'));
    await render('abc');

    element.querySelector('button')?.click();

    expect(store.isFavorite('abc')).toBe(false);
    expect(openSnackBar).toHaveBeenCalledWith('Removed from favorites', undefined, {
      duration: 2500,
    });
    expect(navigate).toHaveBeenCalledWith(['/favorites']);
  });

  it('should show a hint and a link back when the photo is not a favorite', async () => {
    await render('unknown');

    expect(element.querySelector('button')).toBeNull();
    expect(element.querySelector('.detail-hint')).not.toBeNull();
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/favorites');
  });

  it('should show the loader and hide the image when the photo is still loading', async () => {
    await render('abc');

    expect(element.querySelector('app-loader')).not.toBeNull();
    expect(element.querySelector('img')?.classList).toContain('detail-image--hidden');
    expect(element.querySelector('.detail-frame')?.getAttribute('aria-busy')).toBe('true');
  });

  it('should hide the loader and show the image when the photo has loaded', async () => {
    await render('abc');

    element.querySelector('img')?.dispatchEvent(new Event('load'));
    await fixture.whenStable();

    expect(element.querySelector('app-loader')).toBeNull();
    expect(element.querySelector('img')?.classList).not.toContain('detail-image--hidden');
    expect(element.querySelector('.detail-frame')?.getAttribute('aria-busy')).toBe('false');
  });

  it('should show an error instead of the loader when the photo fails to load', async () => {
    await render('abc');

    element.querySelector('img')?.dispatchEvent(new Event('error'));
    await fixture.whenStable();

    expect(element.querySelector('app-loader')).toBeNull();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Could not load');
  });

  it('should show the loader again when the id changes to another photo', async () => {
    await render('abc');
    element.querySelector('img')?.dispatchEvent(new Event('load'));
    await fixture.whenStable();

    fixture.componentRef.setInput('id', 'xyz');
    await fixture.whenStable();

    expect(element.querySelector('app-loader')).not.toBeNull();
  });
});
