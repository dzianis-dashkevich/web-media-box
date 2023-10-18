import type { WarnCallback } from '../types/parserOptions';
import type { Attribute } from '../defaults/ElementAttributes';

export class NodeProcessor {
  protected readonly warnCallback: WarnCallback;
  protected readonly expectedAttributes: Array<Attribute>;
  protected readonly node: Element;

  public constructor(node: Element, expectedAttributes: Array<Attribute>, warnCallback: WarnCallback) {
    this.node = node;
    this.expectedAttributes = expectedAttributes;
    this.warnCallback = warnCallback;
  }
}
