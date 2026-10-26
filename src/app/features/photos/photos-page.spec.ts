import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { provideRouter, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { FakeIntersectionObserver } from '../../../testing/fake-intersection-observer';
import { makePhoto } from '../../../testing/photo.factory';
import { PhotoApi } from '../../core/api/api';
import { Photo } from '../../core/models/photo';
import { FavoritesStore } from '../../core/state/favorites-store';
import { PhotosPage } from './photos-page';

describe('PhotosPage', () => {
  let fixture: ComponentFixture<PhotosPage>;
  let element: HTMLElement;
  let responses: Subject<Photo[]>[];
  let snackBarAction: Subject<void>;
  let openSnackBar: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    responses = [];
    snackBarAction = new Subject<void>();
    openSnackBar = vi.fn(
      () => ({ onAction: () => snackBarAction }) as unknown as MatSnackBarRef<TextOnlySnackBar>,
    );

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: MatSnackBar, useValue: { open: openSnackBar } },
        {
          provide: PhotoApi,
          useValue: {
            getRandomPhotos: () => {
              const response = new Subject<Photo[]>();
              responses.push(response);
              return response;
            },
          },
        },
      ],
    });
    fixture = TestBed.createComponent(PhotosPage);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  afterEach(() => vi.unstubAllGlobals());

  async function respond(index: number, photos: Photo[]): Promise<void> {
    responses[index].next(photos);
    responses[index].complete();
    await fixture.whenStable();
  }

  it('should request the first page and show the loader when opened', () => {
    expect(responses).toHaveLength(1);
    expect(element.querySelector('app-loader')).not.toBeNull();
  });

  it('should render photos and hide the loader when the page arrives', async () => {
    await respond(0, [makePhoto('a'), makePhoto('b')]);

    expect(element.querySelectorAll('app-photo-card')).toHaveLength(2);
    expect(element.querySelector('app-loader')).toBeNull();
  });

  it('should load the next page when the user scrolls to the end of the list', async () => {
    await respond(0, [makePhoto('a')]);

    FakeIntersectionObserver.last.trigger(true);
    await fixture.whenStable();

    expect(responses).toHaveLength(2);
    expect(element.querySelector('app-loader')).not.toBeNull();
  });

  it('should not load another page when the user scrolls while a page is loading', () => {
    FakeIntersectionObserver.last.trigger(true);

    expect(responses).toHaveLength(1);
  });

  it('should add the photo to favorites and confirm when a photo is clicked', async () => {
    await respond(0, [makePhoto('a')]);

    element.querySelector('button')?.click();
    await fixture.whenStable();

    expect(TestBed.inject(FavoritesStore).isFavorite('a')).toBe(true);
    expect(openSnackBar).toHaveBeenCalledWith('Added to favorites', 'View', { duration: 2500 });
    expect(element.querySelector('.photo-card-badge')).not.toBeNull();
  });

  it('should tell the user when the clicked photo is already a favorite', async () => {
    await respond(0, [makePhoto('a')]);
    const button = element.querySelector('button');

    button?.click();
    button?.click();

    expect(openSnackBar).toHaveBeenLastCalledWith('Already in favorites', 'View', {
      duration: 2500,
    });
    expect(TestBed.inject(FavoritesStore).count()).toBe(1);
  });

  it('should navigate to favorites when the snackbar action is clicked', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await respond(0, [makePhoto('a')]);
    element.querySelector('button')?.click();

    snackBarAction.next();

    expect(navigate).toHaveBeenCalledWith(['/favorites']);
  });

  it('should show an error with retry when loading fails', async () => {
    responses[0].error(new Error('network'));
    await fixture.whenStable();

    const alert = element.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Could not load photos');

    alert?.querySelector('button')?.click();
    expect(responses).toHaveLength(2);
  });
});
