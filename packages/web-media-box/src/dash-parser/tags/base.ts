import type { WarnCallback } from '@/dash-parser/types/parserOptions';
import type { TagInfo } from '@/dash-parser/stateMachine.ts';
import { ADAPTATION_SET, BASE_URL, MPD, PERIOD, REPRESENTATION } from '@/dash-parser/consts/tags.ts';
import type { ParsedManifest } from '@/dash-parser/types/parsedManifest';
import type { SharedState } from '@/dash-parser/types/sharedState';
import type { PendingProcessors } from '@/dash-parser/pendingProcessors.ts';

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
    parentTagInfo: TagInfo | null,
    parsedManifest: ParsedManifest,
    sharedState: SharedState,
    pendingProcessors: PendingProcessors
  ): void {}
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
