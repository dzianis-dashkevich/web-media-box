import type { ParsedManifest } from '../types/parsedManifest';
import { NodeProcessor } from './nodeProcessor';
import { missingRequiredAttributeWarn } from '../utils/warn';
import { parseAttributes } from '../parseAttributes';

export abstract class NodeWithAttributesProcessor extends NodeProcessor {
  public process(manifest: ParsedManifest): void {

    // create attributes from expected attributes
    const atts: Record<string, unknown> = {};

    this.expectedAttributes.forEach((attribute) => {
      const value = this.node.getAttribute(attribute.name);

      if (attribute.required && !value) {
        this.warnCallback(missingRequiredAttributeWarn(this.node.nodeName, attribute.name));
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
  protected safeProcess(attributes: Record<string, unknown>, manifest: ParsedManifest): void {
    manifest.attributes = attributes;
  }
}

export class AdaptionSetProcessor extends NodeWithAttributesProcessor {
  protected safeProcess(attributes: Record<string, unknown>, manifest: ParsedManifest): void {
    // TODO: manifestattributes = attributes;
  }
}

// TODO: all additions to the manifest will be done here.