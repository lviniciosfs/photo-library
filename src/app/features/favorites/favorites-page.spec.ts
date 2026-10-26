import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { makePhoto } from '../../../testing/photo.factory';
import { FavoritesStore } from '../../core/state/favorites-store';
import { FavoritesPage } from './favorites-page';

describe('FavoritesPage', () => {
  let fixture: ComponentFixture<FavoritesPage>;
  let element: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(FavoritesPage);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should show the empty state with a link to photos when there are no favorites', () => {
    expect(element.querySelector('app-empty-state')).not.toBeNull();
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/');
    expect(element.querySelector('app-photo-grid')).toBeNull();
  });

  it('should list all favorite photos when favorites exist', async () => {
    const store = TestBed.inject(FavoritesStore);
    store.add(makePhoto('a'));
    store.add(makePhoto('b'));
    await fixture.whenStable();

    expect(element.querySelectorAll('app-photo-card')).toHaveLength(2);
    expect(element.querySelector('app-empty-state')).toBeNull();
  });

  it('should open the single photo page when a favorite is clicked', async () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    TestBed.inject(FavoritesStore).add(makePhoto('a'));
    await fixture.whenStable();

    element.querySelector('button')?.click();

    expect(navigate).toHaveBeenCalledWith(['/photos', 'a']);
  });
});
