export type WarnCallback = (warn: string) => void;
export type DebugCallback = (...debug: Array<unknown>) => void;

export type TransformTagValue = (tagKey: string, tagValue: string | null) => string | null;
export type TransformTagAttributes = (tagKey: string, tagAttributes: Record<string, string>) => Record<string, string>;

export interface ParserOptions {
  warnCallback?: WarnCallback;
  debugCallback?: DebugCallback;
  transformTagValue?: TransformTagValue;
  transformTagAttributes?: TransformTagAttributes;
}