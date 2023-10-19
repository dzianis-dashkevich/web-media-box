import type { WarnCallback } from '@/dash-parser/types/parserOptions';
import type { TagInfo } from '@/dash-parser/stateMachine.ts';
import { ADAPTATION_SET, BASE_URL, MPD, PERIOD, REPRESENTATION } from '@/dash-parser/consts/tags.ts';
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
  private static readonly ID = 'id';
  private static readonly TYPE = 'type';
  private static readonly AVAILABILITY_START_TIME = 'availabilityStartTime';
  private static readonly AVAILABILITY_END_TIME = 'availabilityEndTime';

  protected readonly tag = MPD;

  process(
    tagInfo: TagInfo,
    parentTagInfo: TagInfo | null,
    parsedManifest: ParsedManifest,
    sharedState: SharedState,
    pendingProcessors: PendingProcessors
  ): void {
    const attributes = formatAttributes(tagInfo.tagAttributes, MPDAttributes);
    sharedState.attributes = attributes;

    //TODO: continue
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
