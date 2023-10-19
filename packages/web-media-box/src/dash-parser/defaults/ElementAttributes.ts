// All fields we want to retiive from specific Nodes
// Note not all are required.

export interface Attribute {
  name: string,
  required: boolean,
  default?: unknown
}

export const MPDAttributes: Array<Attribute> = [
  { name: 'id', required: false },
  { name: 'profiles', required: true},
  { name: 'type', required: false, default: 'static' },
  { name: 'availabilityStartTime', required: false},
  { name: 'publishTime', required: false },
  { name: 'mediaPresentationDuration', required: false },
  { name: 'minBufferTime', required: true },
  { name: 'xmlns', required: false },
  { name: 'xmlns:xsi', required: false },
  { name: 'xsi:schemaLocation', required: false }
];

export const AdaptationSetAttributes: Array<Attribute> = [
  { name: 'mimeType', required: true },
  { name: 'contentType', required: true },
  { name: 'subsegmentAlignment', required: false, default: 'false' },
];

export const PeriodAttributes: Array<Attribute> = [
  { name: 'id', required: false },
  { name: 'start', required: false },
  { name: 'duration', required: false },
];

export const BaseURLAttributes: Array<Attribute> = [
  { name: 'id', required: true },
]

export const RepresentationAttributes: Array<Attribute> = [
  { name: 'id', required: true },
  { name: 'bandwidth', required: true },
  { name: 'codecs', required: false },
  { name: 'width', required: false },
  { name: 'height', required: false },
  { name: 'frameRate', required: false },
  { name: 'sar', required: false },
  { name: 'scanType', required: false },
]




