export interface Start {
  timeOffset: number;
  precise: boolean;
}

export interface PartInf {
  partTarget: number;
}

export interface ServerControl {
  canSkipUntil?: number;
  canSkipDateRanges: boolean;
  holdBack?: number;
  partHoldBack?: number;
  canBlockReload: boolean;
}

export interface Encryption {
  method: 'NONE' | 'AES-128' | 'SAMPLE-AES';
  uri?: string;
  iv?: string;
  keyFormat?: string;
  keyFormatVersions: number[];
}

export interface MediaInitializationSection {
  uri: string;
  byteRange?: ByteRange;
}

export interface ByteRange {
  length: number;
  offset: number;
}

export interface PartialSegment {
  uri: string;
  duration: number;
  byteRange?: ByteRange;
  independent?: boolean;
  isGap?: boolean;
}

export interface Segment {
  duration: number;
  title?: string;
  programDateTime?: number;
  byteRange?: ByteRange;
  bitrate?: number;
  uri: string;
  isDiscontinuity: boolean;
  isGap: boolean;
  parts?: PartialSegment[];
}

export type RenditionType = 'AUDIO' | 'VIDEO' | 'SUBTITLES' | 'CLOSED-CAPTIONS';

export interface Rendition {
  type: RenditionType;
  uri?: string;
  groupId: string;
  language?: string;
  assocLanguage?: string;
  name: string;
  stableRenditionId?: string;
  default: boolean;
  autoSelect: boolean;
  forced: boolean;
  inStreamId?: string;
  characteristics?: string[];
  channels?: string[];
}

export type GroupId = string;
export type RenditionGroup = Array<Rendition>;

export interface RenditionGroups {
  audio: Record<GroupId, RenditionGroup>;
  video: Record<GroupId, RenditionGroup>;
  subtitles: Record<GroupId, RenditionGroup>;
  closedCaptions: Record<GroupId, RenditionGroup>;
}

export enum Cue {
  PRE = 'PRE',
  POST = 'POST',
  ONCE = 'ONCE'
}

export interface DateRange {
  id: string;
  class?: string;
  startDate: string;
  cue?: Cue[];
  endDate?: string;
  duration?: number;
  plannedDuration?: number;
  clientAttributes: Record<string, string | number>;
  scte35Cmd?: number;
  scte35Out?: number;
  scte35In?: number;
  endOnNext: boolean;
}

export type PlaylistType = 'EVENT' | 'VOD';

export interface ParsedPlaylist {
  // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.1.1
  m3u: boolean;
  // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.1.2
  version?: number;
  // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.2.1
  independentSegments: boolean;
  // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.2.2
  start?: Start;
  // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.2.3
  // define?: null;
  // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.3.1
  targetDuration?: number;
  // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.3.2
  mediaSequence?: number;
  // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.3.3
  discontinuitySequence?: number;
  // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.3.4
  endList: boolean;
  // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.3.5
  playlistType?: PlaylistType;
  // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.3.6
  iFramesOnly: boolean;
  // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.3.7
  partInf?: PartInf;
  // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.3.8
  serverControl?: ServerControl;
  encryption?: Encryption;
  mediaInitializationSection?: MediaInitializationSection;
  segments: Array<Segment>;
  custom: Record<string, unknown>;
  renditionGroups: RenditionGroups;
  // Used to persist EXT_X_BITRATE across segments
  currentBitrate?: number;
  // https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis#section-4.4.5.1
  dateRanges: DateRange[];
}
