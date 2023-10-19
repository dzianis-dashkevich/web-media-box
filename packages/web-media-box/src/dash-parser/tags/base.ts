import type { WarnCallback } from '@/dash-parser/types/parserOptions';
import type { TagInfo } from '@/dash-parser/stateMachine.ts';
import { ADAPTATION_SET, BASE_URL, MPD, PERIOD, REPRESENTATION } from '@/dash-parser/consts/tags.ts';

export abstract class TagProcessor {
  protected readonly warnCallback: WarnCallback;
  protected abstract readonly tag: string;

  public constructor(warnCallback: WarnCallback) {
    this.warnCallback = warnCallback;
  }

  public abstract process(tagInfo: TagInfo, parentTagInfo: TagInfo | null): void;
}

export class Mpd extends TagProcessor {
  protected readonly tag = MPD;

  public process(tagInfo: TagInfo, parentTagInfo: TagInfo | null): void {}
}

export class Period extends TagProcessor {
  protected readonly tag = PERIOD;

  public process(tagInfo: TagInfo, parentTagInfo: TagInfo | null): void {}
}

export class AdaptationSet extends TagProcessor {
  protected readonly tag = ADAPTATION_SET;

  public process(tagInfo: TagInfo, parentTagInfo: TagInfo | null): void {}
}

export class BaseUrl extends TagProcessor {
  protected readonly tag = BASE_URL;

  public process(tagInfo: TagInfo, parentTagInfo: TagInfo | null): void {}
}

export class Representation extends TagProcessor {
  protected readonly tag = REPRESENTATION;

  public process(tagInfo: TagInfo, parentTagInfo: TagInfo | null): void {}
}
