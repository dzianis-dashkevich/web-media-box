import type { WarnCallback } from '../types/parserOptions';
import type { Attribute } from '../defaults/ElementAttributes';

export class NodeProcessor {
  protected readonly warnCallback: WarnCallback;

  public constructor(warnCallback: WarnCallback) {
    this.warnCallback = warnCallback;
  }
}
