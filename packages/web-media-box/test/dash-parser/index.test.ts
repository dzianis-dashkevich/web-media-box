import { FullManifestParser } from '@/dash-parser/parse';
import { testMPD } from './examples/mpd';
import { describe, it, expect } from 'bun:test';

describe('dash-parser spec', () => {
  // TODO: create valid tests
  it('testString should give us JSON', () => {
    const p = new FullManifestParser({});
    const parsed = p.parseFullManifestString(testMPD);
    expect(parsed.type).toBe('static');
  });
});
