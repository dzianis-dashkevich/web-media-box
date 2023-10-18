import createStateMachine from './stateMachine.ts';
import type { StateMachineTransition } from './stateMachine.ts';
import { noop } from '../utils/fn.ts';
import { ignoreTagWarn, missingTagValueWarn, unsupportedTagWarn } from './utils/warn.ts';

import {
  // EXT_X_DEFINE,
  EXT_X_DISCONTINUITY_SEQUENCE,
  EXT_X_ENDLIST,
  EXT_X_I_FRAMES_ONLY,
  EXT_X_INDEPENDENT_SEGMENTS,
  EXT_X_MEDIA_SEQUENCE,
  EXT_X_PART_INF,
  EXT_X_PLAYLIST_TYPE,
  EXT_X_SERVER_CONTROL,
  EXT_X_START,
  EXT_X_TARGETDURATION,
  EXT_X_VERSION,
  EXTINF,
  EXT_X_BYTERANGE,
  EXT_X_DISCONTINUITY,
  EXT_X_KEY,
  EXT_X_MAP,
  EXT_X_GAP,
  EXT_X_BITRATE,
  EXT_X_PART,
  EXT_X_PROGRAM_DATE_TIME,
} from './consts/tags.ts';
import type {
  CustomTagMap,
  DebugCallback,
  ParserOptions,
  TransformTagAttributes,
  TransformTagValue,
  WarnCallback,
} from './types/parserOptions';
import type { Segment, ParsedPlaylist } from './types/parsedPlaylist';
import {
  EmptyTagProcessor,
  ExtXEndList,
  ExtXIframesOnly,
  ExtXIndependentSegments,
  ExtXDiscontinuity,
  ExtXGap,
} from './tags/emptyTagProcessors.ts';
import {
  ExtXBitrate,
  ExtXByteRange,
  ExtInf,
  ExtXDiscontinuitySequence,
  ExtXMediaSequence,
  ExtXPlaylistType,
  ExtXTargetDuration,
  ExtXVersion,
  TagWithValueProcessor,
  ExtXProgramDateTime,
} from './tags/tagWithValueProcessors.ts';
import {
  ExtXPartInf,
  ExtXServerControl,
  ExtXStart,
  TagWithAttributesProcessor,
  ExtXKey,
  ExtXMap,
  ExtXPart,
} from './tags/tagWithAttributesProcessors.ts';

const defaultSegment: Segment = {
  duration: 0,
  isDiscontinuity: false,
  isGap: false,
  uri: '',
};

class Parser {
  private readonly warnCallback: WarnCallback;
  private readonly debugCallback: DebugCallback;
  private readonly customTagMap: CustomTagMap;
  private readonly ignoreTags: Set<string>;
  private readonly transformTagValue: TransformTagValue;
  private readonly transformTagAttributes: TransformTagAttributes;
  private readonly emptyTagMap: Record<string, EmptyTagProcessor>;
  private readonly tagValueMap: Record<string, TagWithValueProcessor>;
  private readonly tagAttributesMap: Record<string, TagWithAttributesProcessor>;

  protected readonly parsedPlaylist: ParsedPlaylist;
  protected currentSegment: Segment;

  public constructor(options: ParserOptions) {
    this.warnCallback = options.warnCallback || noop;
    this.debugCallback = options.debugCallback || noop;
    this.customTagMap = options.customTagMap || {};
    this.ignoreTags = options.ignoreTags || new Set();
    this.transformTagValue = options.transformTagValue || ((tagKey, tagValue) => tagValue);
    this.transformTagAttributes = options.transformTagAttributes || ((tagKey, tagAttributes) => tagAttributes);

    this.parsedPlaylist = {
      m3u: false,
      independentSegments: false,
      endList: false,
      iFramesOnly: false,
      segments: [],
      custom: {},
    };

    this.currentSegment = { ...defaultSegment };

    this.emptyTagMap = {
      [EXT_X_INDEPENDENT_SEGMENTS]: new ExtXIndependentSegments(this.warnCallback),
      [EXT_X_ENDLIST]: new ExtXEndList(this.warnCallback),
      [EXT_X_I_FRAMES_ONLY]: new ExtXIframesOnly(this.warnCallback),
      [EXT_X_DISCONTINUITY]: new ExtXDiscontinuity(this.warnCallback),
      [EXT_X_GAP]: new ExtXGap(this.warnCallback)
    };

    this.tagValueMap = {
      [EXT_X_VERSION]: new ExtXVersion(this.warnCallback),
      [EXT_X_TARGETDURATION]: new ExtXTargetDuration(this.warnCallback),
      [EXT_X_MEDIA_SEQUENCE]: new ExtXMediaSequence(this.warnCallback),
      [EXT_X_DISCONTINUITY_SEQUENCE]: new ExtXDiscontinuitySequence(this.warnCallback),
      [EXT_X_PLAYLIST_TYPE]: new ExtXPlaylistType(this.warnCallback),
      [EXTINF]: new ExtInf(this.warnCallback),
      [EXT_X_BYTERANGE]: new ExtXByteRange(this.warnCallback),
      [EXT_X_BITRATE]: new ExtXBitrate(this.warnCallback),
      [EXT_X_PROGRAM_DATE_TIME]: new ExtXProgramDateTime(this.warnCallback),
    };

    this.tagAttributesMap = {
      [EXT_X_START]: new ExtXStart(this.warnCallback),
      [EXT_X_PART_INF]: new ExtXPartInf(this.warnCallback),
      [EXT_X_SERVER_CONTROL]: new ExtXServerControl(this.warnCallback),
      [EXT_X_KEY]: new ExtXKey(this.warnCallback),
      [EXT_X_MAP]: new ExtXMap(this.warnCallback),
      [EXT_X_PART]: new ExtXPart(this.warnCallback)
    };
  }

  protected readonly tagInfoCallback = (
    tagKey: string,
    tagValue: string | null,
    tagAttributes: Record<string, string>
  ): void => {
    this.debugCallback(`Received tag info from scanner: `, { tagKey, tagValue, tagAttributes });

    if (this.ignoreTags.has(tagKey)) {
      return this.warnCallback(ignoreTagWarn(tagKey));
    }

    //1. Process simple tags without values or attributes:
    if (tagKey in this.emptyTagMap) {
      const emptyTagProcessor = this.emptyTagMap[tagKey];
      return emptyTagProcessor.process(this.parsedPlaylist, this.currentSegment);
    }

    //2. Process tags with values:
    if (tagKey in this.tagValueMap) {
      tagValue = this.transformTagValue(tagKey, tagValue);

      if (tagValue === null) {
        return this.warnCallback(missingTagValueWarn(tagKey));
      }

      const tagWithValueProcessor = this.tagValueMap[tagKey];
      return tagWithValueProcessor.process(tagValue, this.parsedPlaylist, this.currentSegment);
    }

    //3. Process tags with attributes:
    if (tagKey in this.tagAttributesMap) {
      tagAttributes = this.transformTagAttributes(tagKey, tagAttributes);
      const tagWithAttributesProcessor = this.tagAttributesMap[tagKey];

      return tagWithAttributesProcessor.process(tagAttributes, this.parsedPlaylist, this.currentSegment);
    }

    //4. Process custom tags:
    if (tagKey in this.customTagMap) {
      const customTagProcessor = this.customTagMap[tagKey];

      return customTagProcessor(tagKey, tagValue, tagAttributes, this.parsedPlaylist.custom);
    }

    // 5. Unable to process received tag:
    this.warnCallback(unsupportedTagWarn(tagKey));
  };

  protected readonly uriInfoCallback = (uri: string): void => {
    this.currentSegment.uri = uri;

    // TODO: consider using shared private object instead of polluting parsed playlist object, since it is public interface
    // Apply the EXT-X-BITRATE value from previous segments to this segment as well,
    // as long as it doesn't have an EXT-X-BYTERANGE tag applied to it.
    // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.4.8
    if (this.parsedPlaylist.currentBitrate && !this.currentSegment.byteRange) {
      this.currentSegment.bitrate = this.parsedPlaylist.currentBitrate;
    }

    this.parsedPlaylist.segments.push(this.currentSegment);
    this.currentSegment = { ...defaultSegment };
  };
}

export class FullPlaylistParser extends Parser {
  public parseFullPlaylist(playlist: string): ParsedPlaylist {
    const stateMachine = createStateMachine(this.tagInfoCallback, this.uriInfoCallback);
    const length = playlist.length;

    for (let i = 0; i < length; i++) {
      stateMachine(playlist[i]);
    }

    return this.parsedPlaylist;
  }
}

export class ProgressiveParser extends Parser {
  private stateMachine: StateMachineTransition | null = null;

  public push(chunk: Uint8Array): void {
    if (this.stateMachine === null) {
      this.stateMachine = createStateMachine(this.tagInfoCallback, this.uriInfoCallback);
    }

    for (let i = 0; i < chunk.length; i++) {
      this.stateMachine(String.fromCharCode(chunk[i]));
    }
  }

  public done(): ParsedPlaylist {
    this.stateMachine = null;

    return this.parsedPlaylist;
  }
}
