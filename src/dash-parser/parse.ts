import { Attributes, ParsedManifest } from "./types/parsedManifest";
import { testString } from "./examples/mpd";
import { handleNode } from "./handleNode";
import { parseAttributes } from "./parseAttributes";

/**
 * Parses a MPD manifest file.
 *
 * @param manifest A string containing the XML of a DASH manifest.
 */
export default function parse(manifest: string, url: string): ParsedManifest {
  const initialParsedManifest: ParsedManifest = {
    uri: url || '',
    representations: [],
  };

  const doc = new DOMParser().parseFromString(manifest, 'text/xml');

  return iterateXMLNodes(doc, initialParsedManifest);
}

// also going to need to keep track of BaseURL
function iterateXMLNodes(xmlDocument: XMLDocument, manifest: ParsedManifest): ParsedManifest {
  // TODO: Maybe use some sort of object to check state of the parser
  // depth, bredth, current period, adaptionset, base URL, ect.
  // const parserState: ParserState = {
  //   node: xmlDocument,
  //   parentNode: null,
  //   baseURL: '',
  //   attributes: {}
  // }

  function iterateNode(node: Node | Element, parentNode: Element | null, attributes?: any, baseUrl?: string): void {
    // Display node name and attributes
    // 1 is equivalent to Node.ELEMENT_NODE
    let newAttributes = {} as Attributes
    let response;

    if (node.nodeType == 1) {
      const elementNode = node as Element;

      newAttributes = parseAttributes(elementNode) as Attributes;

      response = handleNode(elementNode, parentNode, manifest, attributes, newAttributes);

      if (response?.attributes) {
        // Overwrite what attributes should continue to be passed on.
        newAttributes = response.attributes; 
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      // Do nothing on text nodes
    }

    // Recursively iterate child nodes
    if (!response?.stopIteration) {
      for (let i = 0; i < node.childNodes.length; i++) {
        iterateNode(node.childNodes[i], node as Element, {...attributes, ...newAttributes});
      }
    }
  }

  // Start iteration from the root node
  iterateNode(xmlDocument, null);

  return manifest;
}
