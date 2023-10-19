import type { WarnCallback } from '@/dash-parser/types/parserOptions';
import type { TagInfo } from '@/dash-parser/stateMachine.ts';
import {
  ADAPTATION_SET,
  BASE_URL,
  MPD,
  PERIOD,
  REPRESENTATION,
  UTC_TIMING,
  EVENT_STREAM,
  EVENT }
from '@/dash-parser/consts/tags.ts';
import type { ManifestType, ParsedManifest } from '@/dash-parser/types/parsedManifest';
import type { SharedState } from '@/dash-parser/types/sharedState';
import type { PendingProcessors } from '@/dash-parser/pendingProcessors.ts';
import type { EventScheme, ParsedManifest, UTCTimingScheme } from '../types/parsedManifest';
import { missingRequiredAttributeWarn } from '@/dash-parser/utils/warn.ts';
import { parseAttributes } from '@/dash-parser/parseAttributes';
import { parseUTCTimingScheme } from '@/dash-parser/utils/parseUTCTimingScheme';
import {
  MPDAttributes,
  AdaptationSetAttributes,
  Attribute,
  PeriodAttributes,
  BaseURLAttributes,
  UTCTimingAttributes,
  EventStreamAttributes,
  EventAttributes,
  SegmentTemplateAttributes
} from '@/dash-parser/consts/attributes.ts';

/**
 * 
 * @param attributes The list of attributes taken from the tag
 * @param expectedAttributes The expected attributes based on the DASH spec
 * @returns A parsed and formatted list attributes.
 */
const formatAttributes = (
  attributes: Record<string, unknown>,
  expectedAttributes: Array<Attribute>,
  tagName: string
  ):Record<string, unknown> => {
  const atts: Record<string, unknown> = {};

  expectedAttributes.forEach((expected) => {
    const value = attributes[expected.name];

    if (expected.required && value == null) {
      missingRequiredAttributeWarn(tagName, expected.name);
      return;
    }

    if (value == null && expected.default) {
      atts[expected.name] = expected.default;
    }

    if (value) {
      atts[expected.name] = value;
    }
  })

  // Format the retrieved attributes
  return parseAttributes(atts);
}

export abstract class TagProcessor {
  protected readonly warnCallback: WarnCallback;
  protected abstract readonly tag: string;

  public constructor(warnCallback: WarnCallback) {
    this.warnCallback = warnCallback;
  }

  public abstract process(
    tagInfo: TagInfo,
    parentTagInfo: TagInfo | null,
    parsedManifest: ParsedManifest,
    sharedState: SharedState,
    pendingProcessors: PendingProcessors
  ): void;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public processPending(
    tagInfo: TagInfo,
    parentTagInfo: TagInfo | null,
    requiredChildren: Map<string, TagInfo | null>
  ): void {
    // specific processor will override
  }
}

export class Mpd extends TagProcessor {
  protected readonly tag = MPD;

  process(
    tagInfo: TagInfo,
    sharedState: SharedState,
  ): void {
    const attributes = formatAttributes(tagInfo.tagAttributes, MPDAttributes, tagInfo.tagName);
    sharedState.attributes = attributes;
  }
}

export class Period extends TagProcessor {
  protected readonly tag = PERIOD;

  process(
    tagInfo: TagInfo,
    parentTagInfo: TagInfo | null,
    parsedManifest: ParsedManifest,
    sharedState: SharedState,
    pendingProcessors: PendingProcessors
  ): void {}
}

export class AdaptationSet extends TagProcessor {
  protected readonly tag = ADAPTATION_SET;

  process(
    tagInfo: TagInfo,
    parentTagInfo: TagInfo | null,
    parsedManifest: ParsedManifest,
    sharedState: SharedState,
    pendingProcessors: PendingProcessors
  ): void {}
}

export class BaseUrl extends TagProcessor {
  protected readonly tag = BASE_URL;

  process(
    tagInfo: TagInfo,
    parentTagInfo: TagInfo | null,
    parsedManifest: ParsedManifest,
    sharedState: SharedState,
    pendingProcessors: PendingProcessors
  ): void {}
}

export class Representation extends TagProcessor {
  protected readonly tag = REPRESENTATION;

  process(
    tagInfo: TagInfo,
    parentTagInfo: TagInfo | null,
    parsedManifest: ParsedManifest,
    sharedState: SharedState,
    pendingProcessors: PendingProcessors
  ): void {}
}

export class UTCTiming extends TagProcessor {
  protected readonly tag = UTC_TIMING;

  process(
    tagInfo: TagInfo,
    parsedManifest: ParsedManifest,
  ): void {
    const attributes = formatAttributes(tagInfo.tagAttributes, UTCTimingAttributes, tagInfo.tagName);
    parsedManifest.utcTimingScheme = attributes;
  }
}

export class EventStream extends TagProcessor {
  protected readonly tag = EVENT_STREAM;

  process(
    tagInfo: TagInfo,
    parentTagInfo: TagInfo | null,
    parsedManifest: ParsedManifest,
    sharedState: SharedState,
    pendingProcessors: PendingProcessors
  ): void {
    
  }
}

export class Event extends TagProcessor {
  protected readonly tag = EVENT;

  process(
    tagInfo: TagInfo,
    parentTagInfo: TagInfo | null,
    parsedManifest: ParsedManifest,
    sharedState: SharedState,
    pendingProcessors: PendingProcessors
  ): void {
    const attributes = formatAttributes(tagInfo.tagAttributes, EventAttributes, tagInfo.tagName);

    if (parsedManifest.events?.length) {
      parsedManifest.events = [];
    }

    // TODO: use data from state to finish this.

    // const presentationTime = attributes.presentationTime || 0;
    const presentationTime = 0;
    // const timescale = eventStreamAttributes.timescale || 1;
    const timescale = 1;
    const duration = attributes.duration as number || 0;
    // const start = (presentationTime / timescale) + period.attributes.start;
    const start = 0;

    const event = {
      schemeIdUri: attributes.schemeIdUri,
      // value: eventStreamAttributes.value,
      id: attributes.id,
      start,
      end: start + (duration / timescale),
      // messageData: getContent(event) || eventAttributes.messageData,
      messageData: attributes.messageData
      // contentEncoding: eventStreamAttributes.contentEncoding,
      // presentationTimeOffset: eventStreamAttributes.presentationTimeOffset || 0
    };

    parsedManifest.events.push(event as EventScheme);
  }
}


