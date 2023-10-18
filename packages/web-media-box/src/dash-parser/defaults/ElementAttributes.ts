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
]

// export const MPDAttributes = {
//   id?: string,
//   profiles: string,
//   type: string,
//   availabilityStartTime?: number,
//   publishTime?: string,
//   mediaPresentationDuration: number,
//   minBufferTime: string,
//   xmlns?: string,
//   'xmlns:xsi'?: string,
//   'xsi:schemaLocation'?: string
// }

// export const MPDAttributes = {
//   id?: string,
//   profiles: string,
//   type: string,
//   availabilityStartTime?: number,
//   publishTime?: string,
//   availabilityStartTime: string,
//   mediaPresentationDuration: number,
//   minBufferTime: string,
//   xmlns?: string,
//   'xmlns:xsi'?: string,
//   'xsi:schemaLocation'?: string
// }

// export type PeriodAttributes = {
//   id?: string,
//   start?: number,
// }

// export type AdaptationSetAttributes = {
//   mimeType: string,
//   contentType: string,
//   subsegmentAlignment: string,
//   subsegmentStartsWithSAP: string,
//   par: string
// }

// export type BaseURLAttributes = {
//   serviceLocation?: string,
// }




