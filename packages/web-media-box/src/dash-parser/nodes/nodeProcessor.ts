import type { WarnCallback } from '../types/parserOptions';

export class NodeProcessor {
  protected readonly warnCallback: WarnCallback;

  public constructor(warnCallback: WarnCallback) {
    this.warnCallback = warnCallback;
  }
}
