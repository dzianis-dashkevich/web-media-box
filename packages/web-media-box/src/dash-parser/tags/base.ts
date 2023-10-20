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

export abstract class TagProcessor {
  protected readonly warnCallback: WarnCallback;
  protected abstract readonly tag: string;
  protected abstract readonly requiredAttributes: Set<string>;

  public process(
    tagInfo: TagInfo,
    parentTagInfo: TagInfo | null,
    parsedManifest: ParsedManifest,
    sharedState: SharedState,
    pendingProcessors: PendingProcessors): void {
    let isRequiredAttributedMissed = false;

    this.requiredAttributes.forEach((requiredAttribute) => {
      const hasRequiredAttribute = requiredAttribute in tagInfo.attributes;

      if (!hasRequiredAttribute) {
        this.warnCallback(missingRequiredAttributeWarn(this.tag, requiredAttribute));
        isRequiredAttributedMissed = true;
      }
    });

    if (isRequiredAttributedMissed) {
      return;
    }

    return this.safeProcess(tagInfo, parentTagInfo, parsedManifest, sharedState, pendingProcessors);
  }

  public processPending(
    tagInfo: TagInfo,
    parentTagInfo: TagInfo | null,
    requiredChildren: Map<string, TagInfo | null>
  ): void {
    // specific processor will override
  }

  protected abstract safeProcess(
    tagInfo: TagInfo,
    parentTagInfo: TagInfo | null,
    parsedManifest: ParsedManifest,
    sharedState: SharedState,
    pendingProcessors: PendingProcessors): void;

  public constructor(warnCallback: WarnCallback) {
    this.warnCallback = warnCallback;
  }
}

export class Mpd extends TagProcessor {
  private static readonly ID = 'id';
  private static readonly PROFILES = 'profiles';
  private static readonly TYPE = 'type';
  private static readonly AVAILABILITY_START_TIME = 'availabilityStartTime';
  private static readonly PUBLISH_TIME = 'publishTime';
  private static readonly MEDIA_PRESENTATION_TIME = 'mediaPresentationDuration';
  private static readonly MIN_BUFFER_TIME = 'minBufferTime';
  private static readonly XMLNS = 'xmlns';
  private static readonly XMLNS_XSI = 'xmlns:xsi';
  private static readonly XSI_SCHEMA_LOCATION = 'xsi:schemaLocation';

  protected readonly requiredAttributes = new Set([Mpd.PROFILES, Mpd.MIN_BUFFER_TIME]);
  protected readonly tag = MPD;

  protected safeProcess(tagInfo: TagInfo, sharedState: SharedState): void {
      const attributes = parseAttributes(tagInfo.tagAttributes);
      sharedState.mpdAttributes = {
        id: attributes[Mpd.ID],
        profiles: attributes[Mpd.PROFILES],
        type: attributes[Mpd.TYPE] || 'static',
        availabilityStartTime: attributes[Mpd.AVAILABILITY_START_TIME],
        publishTime: attributes[Mpd.PUBLISH_TIME],
        mediaPresentationDuration: attributes[Mpd.MEDIA_PRESENTATION_TIME],
        xmlns: attributes[Mpd.XMLNS],
        'xmlns:xsi': attributes[Mpd.XMLNS_XSI],
        'xsi:schemaLocation': attributes[Mpd.XSI_SCHEMA_LOCATION],
      };
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
    const attributes = parseAttributes(tagInfo.tagAttributes);

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


