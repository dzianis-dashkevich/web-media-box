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


export type EventScheme = {
  id?: string,
  schemeIdUri?: string,
  value: string | number,
  start: number,
  end: number,
  messageData?: string,
  contentEncoding?: string,
  presentationTimeOffest?: string | number
}

export type UTCTimingScheme = {
  schemeIdUri: string,
  method?: string,
  value?: string | number,
  [key: string]: unknown
}

export interface ParsedManifest {
  attributes?: Attributes,
  representations: Array<Representation>,
  uri: string,
  utcTimingScheme?: UTCTimingScheme,
  events?: Array<EventScheme>,
  [key: string]: unknown;
}
