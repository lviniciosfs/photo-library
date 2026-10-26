import { ComponentFixture, TestBed } from '@angular/core/testing';

import { makePhoto } from '../../../../testing/photo.factory';
import { PhotoCard } from './photo-card';

describe('PhotoCard', () => {
  const photo = makePhoto('abc');
  let fixture: ComponentFixture<PhotoCard>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(PhotoCard);
    fixture.componentRef.setInput('photo', photo);
    fixture.componentRef.setInput('actionLabel', 'Add to favorites');
    await fixture.whenStable();
  });

  function button(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  it('should render the photo lazily when given a photo', () => {
    const image: HTMLImageElement = fixture.nativeElement.querySelector('img');

    expect(image.src).toBe(photo.url);
    expect(image.getAttribute('loading')).toBe('lazy');
    expect(button().getAttribute('aria-label')).toBe('Add to favorites');
  });

  it('should emit the photo when clicked', () => {
    const selected = vi.fn();
    fixture.componentInstance.selected.subscribe(selected);

    button().click();

    expect(selected).toHaveBeenCalledWith(photo);
  });

  it('should show the favorite badge when the photo is a favorite', async () => {
    expect(fixture.nativeElement.querySelector('.photo-card-badge')).toBeNull();

    fixture.componentRef.setInput('favorite', true);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.photo-card-badge')).not.toBeNull();
  });
});
