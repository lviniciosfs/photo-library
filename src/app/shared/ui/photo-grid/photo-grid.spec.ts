import { ComponentFixture, TestBed } from '@angular/core/testing';

import { makePhoto } from '../../../../testing/photo.factory';
import { PhotoGrid } from './photo-grid';

describe('PhotoGrid', () => {
  const photos = [makePhoto('a'), makePhoto('b'), makePhoto('c')];
  let fixture: ComponentFixture<PhotoGrid>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(PhotoGrid);
    fixture.componentRef.setInput('photos', photos);
    fixture.componentRef.setInput('actionLabel', 'Open photo');
    fixture.componentRef.setInput('favoriteIds', new Set(['b']));
    await fixture.whenStable();
  });

  it('should render one card per photo when given photos', () => {
    expect(fixture.nativeElement.querySelectorAll('app-photo-card')).toHaveLength(3);
  });

  it('should mark only favorite photos when favorite ids are given', () => {
    const cards: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('app-photo-card');

    expect(cards[0].querySelector('.photo-card-badge')).toBeNull();
    expect(cards[1].querySelector('.photo-card-badge')).not.toBeNull();
  });

  it('should emit the clicked photo when a card is clicked', () => {
    const selected = vi.fn();
    fixture.componentInstance.photoSelected.subscribe(selected);

    fixture.nativeElement.querySelectorAll('button')[2].click();

    expect(selected).toHaveBeenCalledWith(photos[2]);
  });

  it('should render an empty list when there are no photos', async () => {
    fixture.componentRef.setInput('photos', []);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('li')).toHaveLength(0);
  });
});
