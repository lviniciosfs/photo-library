import { isPhoto } from './photo';

describe('isPhoto', () => {
  it('should accept a value when it has all photo fields', () => {
    expect(isPhoto({ id: '1', url: 'u', width: 1, height: 2 })).toBe(true);
  });

  it('should reject a value when a field is missing or has a wrong type', () => {
    expect(isPhoto({ id: '1', url: 'u', width: '1', height: 2 })).toBe(false);
    expect(isPhoto({ id: '1', width: 1, height: 2 })).toBe(false);
  });

  it('should reject a value when it is not an object', () => {
    expect(isPhoto(null)).toBe(false);
    expect(isPhoto('photo')).toBe(false);
  });
});
