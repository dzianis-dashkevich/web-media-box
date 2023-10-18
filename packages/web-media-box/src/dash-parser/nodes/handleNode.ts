// import type { Attributes, ParsedManifest } from "../types/parsedManifest";
// import { parseUTCTimingScheme } from "../utils/parseUTCTimingScheme";
// import { Representation } from '../types/parsedManifest';
// import { constructTemplateUrl } from "../segments/segmentTemplate";
// import { getContent } from "../utils/xml";
// import { resolveURL } from "../utils/url";
// import { MPDProcessor } from "./nodesWithAttributes";
// import { AdaptationSetAttributes, MPDAttributes } from '../defaults/ElementAttributes'
// interface HandlerParams {
//   node: Element,
//   parentNode: Element | null,
//   manifest: ParsedManifest,
//   oldAttributes: Attributes
// }

// export interface HandlerReponse {
//   stopIteration?: boolean,
//   attributes?: Attributes,
// }

// interface Handlers {
//   [key: string]: (params: HandlerParams) => HandlerReponse
// }

// const handlers: Handlers = {
//   MPD(params: HandlerParams): HandlerReponse {
//     let { node, manifest, oldAttributes } = params;

//     const processor = new MPDProcessor(node, MPDAttributes, () => {}, );
//     processor.process(manifest);

//     return {};
//   },

//   PERIOD(params: HandlerParams): HandlerReponse {
//     // TODO: handle period
//     let { node, manifest, oldAttributes } = params;

//     // somehow clear oldAttributes
//     // manifest.attributes = newAttributes;
//     // newAttributes.tagName = node.tagName;
//     // newAttributes = {};

//     // const response: HandlerReponse = {
//     //   // do not send these attributes further
//     //   attributes: {}
//     // }

//     // return response;
//   },

//   ADAPTIONSET(params: HandlerParams): HandlerReponse {
//     let { node, manifest, oldAttributes } = params;

//     // const processor = new AdaptionSetProcessor(node, AdaptationSetAttributes, () => {});
//     // processor.process(manifest);

//     return {};
//   },

//   SEGMENTTEMPLATE(params: HandlerParams): HandlerReponse {
//     let { node, parentNode, manifest, oldAttributes } = params;

//     if (parentNode?.nodeName === 'REPRESENTATION') {
//       const rep = manifest.representations[manifest.representations.length - 1];
//       if (rep.attributes?.media) {
//         const templateValues = {
//           RepresentationID: rep.attributes.id,
//           Bandwidth: rep.attributes.bandwidth || 0
//         };

//         // TODO: generate segments
//         const x = constructTemplateUrl(rep.attributes.media as string, templateValues);
//         rep.attributes.URL = x;
//       }
//     }
//     else {
//       // media and initialization will be set. Ensure we check this in Representation
//     }

//     return {};
//   },

//   BASEURL(params: HandlerParams): HandlerReponse {
//     // TODO: Handle multiple BaseURLs. This will mean we need to iterate over every
//     // AdaptionSet below it and create new representations/segments

//     // if child, get last representation and update it
//     let { node, parentNode, manifest, oldAttributes } = params;

//     // Create the new baseURL, combining with the old value.
//     let originalBaseURL = oldAttributes.baseUrl;
//     const baseURLContent = getContent(node) || '';
//     const url = resolveURL(baseURLContent, originalBaseURL as string);

//     if (parentNode?.nodeName === 'REPRESENTATION') {
//       const rep = manifest.representations[manifest.representations.length - 1];
//       rep.attributes.URL = url;
      
//       // Update the BaseURL in the representation
//       return {}
//     } else {
//       return {
//         attributes: { baseURL: url }
//       };
//     }

//   },

//   REPRESENTATION(params: HandlerParams): HandlerReponse {
//     const { node, manifest, oldAttributes } = params;
//     console.log(node.nodeName);

//     // This means there is a SegmentTemplate.
//     if (oldAttributes.media) {
//       const templateValues = {
//         RepresentationID: oldAttributes.id,
//         Bandwidth: oldAttributes.bandwidth || 0
//       };
  
//       // TODO: generate segments

//       const x = constructTemplateUrl(oldAttributes.media as string, templateValues);
//       let originalBaseURL = oldAttributes.baseUrl;
//       const baseURLContent = getContent(node) || '';
//       const url = resolveURL(baseURLContent, originalBaseURL as string);
//       // newAttributes.URL = url;
//     }

//     // const rep: Representation = {
//     //   attributes: {...oldAttributes, ...newAttributes}
//     // }

//     // manifest.representations.push(rep);

//     return {};
//   },

//   UTCTIMING(params: HandlerParams): HandlerReponse {
//     const { node, manifest } = params;
//     manifest.utcTimingScheme = parseUTCTimingScheme(node);

//     const response: HandlerReponse = {
//       // UTCTiming will have no children
//       stopIteration: true,
//     }

//     return response;
//   },

//   /**
//    * Default handler for an unknown node. Acts as a no-op.
//    */
//    DEFAULT(): HandlerReponse {
//     return {};
//   }
// };

// /**
//  * Handles a node while iterating through the tree of XML Nodes from the MPD file.
//  * A function is selected by the name of the node.
//  * Based on the type of node, we store and parse different data.
//  *
//  * @param node The node to parse attributes from
//  */
//  export const handleNode = (
//     node: Element,
//     parentNode: Element | null,
//     manifest: ParsedManifest,
//     oldAttributes: Attributes
//   ): HandlerReponse => {
//   const nodeName = node.nodeName;

//   const handlerFn: (params: HandlerParams) => HandlerReponse = handlers[nodeName] || handlers.DEFAULT;
//   return handlerFn({ node, parentNode, manifest, oldAttributes });
// };

// TODO: Keeping this for now, as we will need some of this code for the new processors.