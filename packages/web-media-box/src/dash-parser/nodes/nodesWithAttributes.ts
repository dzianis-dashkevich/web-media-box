import type { ParsedManifest } from '../types/parsedManifest';
import { NodeProcessor } from './nodeProcessor';
import { missingRequiredAttributeWarn } from '../utils/warn';
import { parseAttributes } from '../parseAttributes';
import {
  MPDAttributes,
  AdaptationSetAttributes,
  Attribute,
  PeriodAttributes,
  BaseURLAttributes
} from "../defaults/ElementAttributes";

export abstract class NodeWithAttributesProcessor extends NodeProcessor {
  protected abstract readonly expectedAttributes: Array<Attribute>;

  public process(manifest: ParsedManifest, node: Element): void {

    // create attributes from expected attributes
    const atts: Record<string, unknown> = {};

    this.expectedAttributes.forEach((attribute) => {
      const value = node.getAttribute(attribute.name);

      if (attribute.required && value == null) {
        this.warnCallback(missingRequiredAttributeWarn(node.nodeName, attribute.name));
        return;
      }

      if (value) {
        atts[attribute.name] = value;
      }

      if (!value && attribute.default) {
        atts[attribute.name] = attribute.default;
      }
    })
    
    // Format the retrieved attributes
    const formattedAttributes = parseAttributes(atts);

    return this.safeProcess(formattedAttributes, manifest);
  }

  protected abstract safeProcess(nodeAttributes: Record<string, unknown>, manifest: ParsedManifest): void;
}

export class MPDProcessor extends NodeWithAttributesProcessor {
  protected readonly expectedAttributes = MPDAttributes;

  protected safeProcess(attributes: Record<string, unknown>, manifest: ParsedManifest): void {
    // TODO: this currently just shows we are sucessfully updating the parsed manifest.
    manifest.attributes = attributes;
  }
}

export class AdaptionSetProcessor extends NodeWithAttributesProcessor {
  protected readonly expectedAttributes = AdaptationSetAttributes;

  protected safeProcess(attributes: Record<string, unknown>, manifest: ParsedManifest): void {
    // TODO
  }
}

export class PeriodProcessor extends NodeWithAttributesProcessor {
  protected readonly expectedAttributes = PeriodAttributes;

  protected safeProcess(attributes: Record<string, unknown>, manifest: ParsedManifest): void {
    // TODO
  }
}

export class BaseURLProcessor extends NodeWithAttributesProcessor {
  protected readonly expectedAttributes = BaseURLAttributes;

  protected safeProcess(attributes: Record<string, unknown>, manifest: ParsedManifest): void {
    // TODO
  }
}

export class RepresentationProcessor extends NodeWithAttributesProcessor {
  protected readonly expectedAttributes = BaseURLAttributes;

  protected safeProcess(attributes: Record<string, unknown>, manifest: ParsedManifest): void {
    // TODO
  }
}
