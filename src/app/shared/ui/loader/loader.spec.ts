import { TestBed } from '@angular/core/testing';

import { Loader } from './loader';

describe('Loader', () => {
  it('should show a spinner with the default label when no label is given', async () => {
    const fixture = TestBed.createComponent(Loader);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('[role="status"]')?.textContent).toContain('Loading...');
    expect(element.querySelector('mat-progress-spinner')).not.toBeNull();
  });

  it('should show the custom label when a label is given', async () => {
    const fixture = TestBed.createComponent(Loader);
    fixture.componentRef.setInput('label', 'Fetching');
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Fetching');
  });
});
