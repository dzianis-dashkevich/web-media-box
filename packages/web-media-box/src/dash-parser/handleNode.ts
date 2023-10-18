import { ParsedManifest, Attributes } from "./types/parsedManifest";
import { parseUTCTimingScheme } from "./utils/parseUTCTimingScheme";
import { Representation } from './types/parsedManifest';
import { parseAttributes } from './parseAttributes';
import { constructTemplateUrl } from "./segments/segmentTemplate";

interface HandlerParams {
  node: Element,
  parentNode: Element | null,
  manifest: ParsedManifest,
  oldAttributes: Attributes,
  newAttributes: Attributes
}

export interface HandlerReponse {
  stopIteration?: boolean,
  attributes?: Attributes,
  baseUrl?: string,
}

interface Handlers {
  [key: string]: (params: HandlerParams) => HandlerReponse
}

const handlers: Handlers = {
  MPD(params: HandlerParams): HandlerReponse {
    let { node, manifest, oldAttributes, newAttributes } = params;

    // Add attributes at the manifest level.
    manifest.attributes = newAttributes;

    const response: HandlerReponse = {
      // do not send these attributes further
      attributes: {}
    }

    return response;
  },

  PERIOD(params: HandlerParams): HandlerReponse {
    // TODO: handle period
    let { node, manifest, oldAttributes, newAttributes } = params;

    // somehow clear oldAttributes
    // manifest.attributes = newAttributes;
    // newAttributes.tagName = node.tagName;
    // newAttributes = {};

    // const response: HandlerReponse = {
    //   // do not send these attributes further
    //   attributes: {}
    // }

    // return response;
  },

  ADAPTIONSET(params: HandlerParams): HandlerReponse {
    let { node, manifest, oldAttributes, newAttributes } = params;

    // somehow clear oldAttributes
    // manifest.attributes = newAttributes;
    // newAttributes.tagName = node.tagName;
    // newAttributes = {};

    // const response: HandlerReponse = {
    //   // do not send these attributes further
    //   attributes: {}
    // }

    // return response;
  },

  SEGMENTTEMPLATE(params: HandlerParams): HandlerReponse {
    let { node, parentNode, manifest, oldAttributes, newAttributes } = params;

    if (parentNode?.tagName === 'REPRESENTATION') {
      const rep = manifest.representations[manifest.representations.length - 1];
      if (rep.attributes?.media) {
        const templateValues = {
          RepresentationID: rep.attributes.id,
          Bandwidth: rep.attributes.bandwidth || 0
        };

        // TODO: generate segments
        const x = constructTemplateUrl(rep.attributes.media as string, templateValues);
        rep.attributes.URL = x;
      }
    }
    else {
      // media and initialization will be set. Ensure we check this in Representation
    }

    return {};
  },

  BASEURL(params: HandlerParams): HandlerReponse {
    // TODO: handle base URL

    // if child, get last representation and update it
    let { node, manifest, oldAttributes, newAttributes } = params;

    // somehow clear oldAttributes
    // manifest.attributes = newAttributes;
    // newAttributes.tagName = node.tagName;
    // newAttributes = {};

    // const response: HandlerReponse = {
    //   // do not send these attributes further
    //   attributes: {}
    // }

    // return response;
  },

  REPRESENTATION(params: HandlerParams): HandlerReponse {
    const { node, manifest, oldAttributes, newAttributes } = params;
    newAttributes.tagName = node.tagName;
    console.log(node.tagName);
    // This means there is a SegmentTemplate.
    if (oldAttributes.media) {
      const templateValues = {
        RepresentationID: oldAttributes.id,
        Bandwidth: oldAttributes.bandwidth || 0
      };
  
      // TODO: generate segments

      const x = constructTemplateUrl(oldAttributes.media as string, templateValues);
      newAttributes.URL = x;
    }
    const rep: Representation = {
      attributes: {...oldAttributes, ...newAttributes}
    }

    manifest.representations.push(rep);

    return {};
  },

  UTCTIMING(params: HandlerParams): HandlerReponse {
    const { node, manifest } = params;
    manifest.utcTimingScheme = parseUTCTimingScheme(node);

    const response: HandlerReponse = {
      // UTCTiming will have no children
      stopIteration: true,
    }

    return response;
  },

  /**
   * Default handler for an unknown node. Acts as a no-op.
   */
   DEFAULT(): HandlerReponse {
    return {};
  }
};

/**
 * Handles a node while iterating through the tree of XML Nodes from the MPD file.
 * A function is selected by the name of the node.
 * Based on the type of node, we store and parse different data.
 *
 * @param node The node to parse attributes from
 */
 export const handleNode = (
    node: Element,
    parentNode: Element | null,
    manifest: ParsedManifest,
    oldAttributes: Attributes,
    newAttributes: Attributes
  ): HandlerReponse => {
  const nodeName = node.tagName;

  const handlerFn: (params: HandlerParams) => HandlerReponse = handlers[nodeName] || handlers.DEFAULT;
  return handlerFn({ node, parentNode, manifest, oldAttributes, newAttributes });
};