import parse from '@/dash-parser/parse';
import { testString } from '@/dash-parser/examples/mpd';
import { describe, it, expect } from 'bun:test';

describe('dash-parser spec', () => {
  // TODO: create valid tests
  // Should fail, check console for the data
  it('testString should give us JSON', () => {
    const parsed = parse(testString, { uri: 'www.example.com'});
    expect(parsed).toBe([]);
  });
});
