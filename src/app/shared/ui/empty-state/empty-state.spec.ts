import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { EmptyState } from './empty-state';

@Component({
  imports: [EmptyState],
  template: `<app-empty-state message="Nothing here"><a id="cta">Go</a></app-empty-state>`,
})
class Host {}

describe('EmptyState', () => {
  it('should render the message and projected action when used', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.empty-state-message')?.textContent).toBe('Nothing here');
    expect(element.querySelector('#cta')).not.toBeNull();
  });
});
