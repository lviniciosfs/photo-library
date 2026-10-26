import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { makePhoto } from '../../../testing/photo.factory';
import { FavoritesStore } from '../../core/state/favorites-store';
import { Header } from './header';

@Component({ template: '' })
class Blank {}

describe('Header', () => {
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Blank },
          { path: 'favorites', component: Blank },
          { path: 'photos/:id', component: Blank },
        ]),
      ],
    });
    fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
  });

  async function navigate(url: string): Promise<void> {
    await TestBed.inject(Router).navigateByUrl(url);
    await fixture.whenStable();
  }

  function link(name: string): HTMLAnchorElement {
    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
    const match = links.find((anchor) => anchor.textContent?.includes(name));
    if (!match) {
      throw new Error(`Link ${name} not found`);
    }
    return match;
  }

  it('should render links to photos and favorites when created', () => {
    expect(link('Photos').getAttribute('href')).toBe('/');
    expect(link('Favorites').getAttribute('href')).toBe('/favorites');
  });

  it('should highlight Photos when on the photostream', async () => {
    await navigate('/');

    expect(link('Photos').getAttribute('aria-current')).toBe('page');
    expect(link('Photos').classList).toContain('header-link--active');
    expect(link('Favorites').getAttribute('aria-current')).toBeNull();
  });

  it('should highlight Favorites when on the favorites page', async () => {
    await navigate('/favorites');

    expect(link('Favorites').getAttribute('aria-current')).toBe('page');
    expect(link('Photos').getAttribute('aria-current')).toBeNull();
  });

  it('should keep Favorites highlighted when on a single photo page', async () => {
    await navigate('/photos/abc');

    expect(link('Favorites').getAttribute('aria-current')).toBe('page');
  });

  it('should show the favorites count when favorites exist', async () => {
    TestBed.inject(FavoritesStore).add(makePhoto('a'));
    await fixture.whenStable();

    expect(link('Favorites').textContent).toContain('(1)');
  });
});
