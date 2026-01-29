import { describe, it, expect } from 'vitest';
import { parseInputValue } from '@/components/base/input/parseInputValue';

describe('parseInputValue', () => {
  it('returns string by default', () => {
    expect(parseInputValue(' hi ')).toBe(' hi ');
  });

  it('trims when trim modifier is enabled', () => {
    expect(parseInputValue(' hi ', { trim: true })).toBe('hi');
  });

  it('converts to number when number modifier is enabled', () => {
    expect(parseInputValue('12.5', { number: true })).toBe(12.5);
  });

  it('returns null for empty when number modifier is enabled', () => {
    expect(parseInputValue('', { number: true })).toBe(null);
  });

  it('applies trim before number when both enabled', () => {
    expect(parseInputValue('  42  ', { trim: true, number: true })).toBe(42);
  });
});
