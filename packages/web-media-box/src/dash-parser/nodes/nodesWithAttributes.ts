import type { EventScheme, ParsedManifest, UTCTimingScheme } from '../types/parsedManifest';
import { NodeProcessor } from './nodeProcessor';
import { missingRequiredAttributeWarn } from '../utils/warn';
import { parseAttributes } from '../parseAttributes';
import { parseUTCTimingScheme } from '../utils/parseUTCTimingScheme';
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

export class SegmentTemplateProcessor extends NodeWithAttributesProcessor {
  protected readonly expectedAttributes = SegmentTemplateAttributes;

  protected safeProcess(attributes: Record<string, unknown>, manifest: ParsedManifest): void {
    // TODO
  }
}

export class UTCTimingProcessor extends NodeWithAttributesProcessor {
  protected readonly expectedAttributes = UTCTimingAttributes;

  protected safeProcess(attributes: Record<string, unknown>, manifest: ParsedManifest): void {
    manifest.utcTimingScheme = parseUTCTimingScheme(attributes) as UTCTimingScheme;
  }
}

export class EventStreamProcessor extends NodeWithAttributesProcessor {
  protected readonly expectedAttributes = EventStreamAttributes;

  protected safeProcess(attributes: Record<string, unknown>, manifest: ParsedManifest): void {
    // TODO: We will store event data in the state
  }
}

export class EventProcessor extends NodeWithAttributesProcessor {
  protected readonly expectedAttributes = EventAttributes;

  protected safeProcess(attributes: Record<string, unknown>, manifest: ParsedManifest): void {
    if (!manifest?.events?.length) {
      manifest.events = [];
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

    manifest.events.push(event as EventScheme);
  }
}
