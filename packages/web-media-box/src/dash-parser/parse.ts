import type { ParsedManifest } from "./types/parsedManifest";
import type { DebugCallback, ParserOptions, WarnCallback } from "./types/parserOptions";

import {
  ADAPTIONSET,
  MPD
} from "./consts/tags";
import {
  AdaptionSetProcessor,
  MPDProcessor,
  NodeWithAttributesProcessor
} from "./nodes/nodesWithAttributes";
import { noop } from "../utils/fn";
import { NodeProcessor } from "./nodes/nodeProcessor";

class Parser {
  // We will keep the state of the iteration here, so we can use information
  // even after we have iterated over a node.

  private currentNode: Element;
  private readonly warnCallback: WarnCallback;
  private readonly debugCallback: DebugCallback;
  private readonly nodeProcessorMap: Record<string, NodeWithAttributesProcessor>;

  protected readonly parsedManifest: ParsedManifest;

  public constructor(mpd: string, options: ParserOptions) {
    this.warnCallback = options.warnCallback || noop;
    this.debugCallback = options.debugCallback || noop;
    this.currentNode = {} as Element;

    this.parsedManifest = {
      uri: '',
      representations: [],
    };

    this.nodeProcessorMap = {
      [MPD]: new MPDProcessor(this.warnCallback),
      [ADAPTIONSET]: new AdaptionSetProcessor(this.warnCallback),
    };
  
    const doc = new DOMParser().parseFromString(mpd, 'text/xml');

    this.iterateXMLNodes(doc);
  }

    // also going to need to keep track of BaseURL
  protected iterateXMLNodes(xmlDocument: XMLDocument): void {
    // TODO: Maybe use some sort of object to check state of the parser
    // depth, bredth, current period, adaptionset, base URL, ect.
    // const parserState: ParserState = {
    //   node: xmlDocument,
    //   baseURL: '',
    //   attributes: {}
    // }

    const iterateNode = (node: Node | Element, attributes?: object, baseUrl?: string): void => {
      // Display node name and attributes
      // 1 is equivalent to Node.ELEMENT_NODE

      if (node.nodeType == 1) {
        const elementNode = node as Element;
        this.currentNode = elementNode;
        const name = elementNode.nodeName;


        const Processor = this.nodeProcessorMap[name];

        if (Processor) {
          Processor.process(this.parsedManifest, this.currentNode);
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        // Do nothing on text nodes
      }

      // Recursively iterate child nodes
      for (let i = 0; i < node.childNodes.length; i++) {
        iterateNode(node.childNodes[i], attributes);
      }
    }

    // Start iteration from the root node
    iterateNode(xmlDocument);
  }

  public outputManifest = (): ParsedManifest => {
    return this.parsedManifest;
  }
}


export default function parse(mpd: string) {
  const parser = new Parser(mpd, {});

  return parser.outputManifest();
}
