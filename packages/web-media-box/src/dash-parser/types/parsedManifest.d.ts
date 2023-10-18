export type Segment = {
  duration: number;
  url: string;
}

export type Attributes = Record<string, unknown>;

export type Representation = {
  id?: string,
  codecs?: string,
  bandwidth?: number,
  initialization?: string,
  segments?: Array<Segment>,
  attributes: Attributes,
  [key: string]: unknown;
}

export type AdaptionSet = {
  mimeType: string,
  contentType: string,
  subsegmentAlignment: boolean,

}

export type UTCTimingScheme = {
  schemeIdUri: string,
  method: string,
  value: string | number,
  [key: string]: unknown
}

export interface ParsedManifest {
  attributes?: Attributes,
  representations: Array<Representation>,
  uri: string,
  utcTimingScheme?: UTCTimingScheme,
  [key: string]: unknown;
}
