import { FullPlaylistParser, ProgressiveParser } from '@/hls-parser';
import type { Mock } from 'bun:test';
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import type { ParsedPlaylist } from '@/hls-parser/types/parsedPlaylist';

describe('hls-parser spec', () => {
  let fullPlaylistParser: FullPlaylistParser;
  let progressivePlaylistParser: ProgressiveParser;
  let warnCallback: Mock<(warn: string) => void>;

  const testAllCombinations = (playlist: string, cb: (parsed: ParsedPlaylist) => void): void => {
    const buffer = new Uint8Array(playlist.split('').map((char) => char.charCodeAt(0)));

    cb(fullPlaylistParser.parseFullPlaylistString(playlist));
    cb(fullPlaylistParser.parseFullPlaylistBuffer(buffer));

    progressivePlaylistParser.pushString(playlist);
    cb(progressivePlaylistParser.done());

    progressivePlaylistParser.pushBuffer(buffer);
    cb(progressivePlaylistParser.done());
  };

  beforeEach(() => {
    warnCallback = mock(() => {});

    fullPlaylistParser = new FullPlaylistParser({
      warnCallback,
      // debugCallback: (debug, info): void => console.log('Full Playlist Parser debug: ', debug, info),
    });
    progressivePlaylistParser = new ProgressiveParser({
      warnCallback,
      // debugCallback: (debug, info): void => console.log('Progressive Playlist Parser debug: ', debug, info),
    });
  });

  describe('#EXT-X-VERSION', () => {
    it('should be undefined if it is not presented in playlist', () => {
      const playlist = `#EXTM3U`;

      testAllCombinations(playlist, (parsed) => {
        expect(parsed.version).toBeUndefined();
      });
    });

    it('should parse value from playlist to a number', () => {
      const playlist = `#EXTM3U\n#EXT-X-VERSION:4`;

      testAllCombinations(playlist, (parsed) => {
        expect(parsed.version).toBe(4);
      });
    });

    it('should not pare value from playlist if it is not possible to cast to number', () => {
      const playlist = `#EXTM3U\n#EXT-X-VERSION:X`;

      testAllCombinations(playlist, (parsed) => {
        expect(parsed.version).toBeUndefined();
      });
      expect(warnCallback).toHaveBeenCalledTimes(4);
    });
  });

  describe('#EXT-X-INDEPENDENT-SEGMENTS', () => {
    it('should be false by default', () => {
      const playlist = `#EXTM3U`;

      testAllCombinations(playlist, (parsed) => {
        expect(parsed.independentSegments).toBe(false);
      });
    });

    it('should be true if presented in a playlist', () => {
      const playlist = `#EXTM3U\n#EXT-X-INDEPENDENT-SEGMENTS`;

      testAllCombinations(playlist, (parsed) => {
        expect(parsed.independentSegments).toBe(true);
      });
    });
  });

  describe('#EXT-X-START', () => {
    it('should be undefined by default', () => {
      const playlist = `#EXTM3U`;

      testAllCombinations(playlist, (parsed) => {
        expect(parsed.start).toBeUndefined();
      });
    });

    it('should parse values from a playlist', () => {
      const playlist = '#EXTM3U\n#EXT-X-START:TIME-OFFSET=12,PRECISE=YES';

      testAllCombinations(playlist, (parsed) => {
        expect(parsed.start?.timeOffset).toBe(12);
        expect(parsed.start?.precise).toBe(true);
      });
    });

    it('should not parse values if required attributes are not presented', () => {
      const playlist = '#EXTM3U\n#EXT-X-START:PRECISE=YES';

      testAllCombinations(playlist, (parsed) => {
        expect(parsed.start).toBeUndefined();
      });
    });

    it('precise should fallback to false if not presented', () => {
      const playlist = '#EXTM3U\n#EXT-X-START:TIME-OFFSET=12';

      testAllCombinations(playlist, (parsed) => {
        expect(parsed.start?.timeOffset).toBe(12);
        expect(parsed.start?.precise).toBe(false);
      });
    });
  });
});
