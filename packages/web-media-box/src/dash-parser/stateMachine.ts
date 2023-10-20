const PARSE_EMPTY_SPACE_STATE = 1;
const PARSE_TAG_KEY_STATE = 2;
const PARSE_ATTRIBUTE_KEY_STATE = 3;
const PARSE_TAG_BODY_STATE = 4;
const PARSE_ATTRIBUTE_VALUE_STATE = 5;
const PARSE_QUOTED_STRING_ATTRIBUTE_VALUE = 6;

export interface TagInfo {
  tagKey: string;
  tagValue: string | null;
  tagAttributes: Record<string, string>;
  hasChildren: boolean;
}

type TagInfoCallback = (tagInfo: TagInfo, parentTagInfo: TagInfo | null) => void;

export type StateMachineTransition = (char: string) => void;

export default function createStateMachine(tagInfoCallback: TagInfoCallback): StateMachineTransition {
  let currentState = PARSE_EMPTY_SPACE_STATE;

  let lastChar: string | null = null;
  let currentTagKey = '';
  let currentTagValue = '';
  let currentAttributeKey = '';
  let currentAttributeValue = '';
  let hasChildren = true;
  let currentTagAttributeKeyValueMap: Record<string, string> = {};

  const stateMachine: Record<number, (char: string) => void> = {
    [PARSE_EMPTY_SPACE_STATE]: (char) => {
      if (char === '<') {
        currentState = PARSE_TAG_KEY_STATE;

        if (currentTagKey) {
          tagInfoCallback(
            {
              tagKey: currentTagKey,
              tagValue: currentTagValue || null,
              tagAttributes: currentTagAttributeKeyValueMap,
              hasChildren,
            },
            null
          ); // TODO: parent
          currentTagKey = '';
          currentTagValue = '';
          currentTagAttributeKeyValueMap = {};
          hasChildren = true;
        }
      }
    },
    [PARSE_TAG_KEY_STATE]: (char) => {
      if (char === '?') {
        currentState = PARSE_EMPTY_SPACE_STATE;
        return;
      }

      if (char === '!') {
        currentState = PARSE_EMPTY_SPACE_STATE;
        return;
      }

      if (char === '/') {
        currentState = PARSE_EMPTY_SPACE_STATE;
        hasChildren = lastChar === '<';
        return;
      }

      if (char === ' ') {
        currentState = PARSE_ATTRIBUTE_KEY_STATE;
        return;
      }

      if (char === '>') {
        currentState = PARSE_TAG_BODY_STATE;
        return;
      }

      currentTagKey += char;
    },
    [PARSE_ATTRIBUTE_KEY_STATE]: (char) => {
      if (char === '=') {
        currentState = PARSE_ATTRIBUTE_VALUE_STATE;
        return;
      }

      currentAttributeKey += char;
    },
    [PARSE_ATTRIBUTE_VALUE_STATE]: (char) => {
      if (char === '"') {
        currentState = PARSE_QUOTED_STRING_ATTRIBUTE_VALUE;
      }
    },
    [PARSE_QUOTED_STRING_ATTRIBUTE_VALUE]: (char) => {
      if (char === '"') {
        currentState = PARSE_TAG_KEY_STATE;
        currentTagAttributeKeyValueMap[currentAttributeKey] = currentAttributeValue;
        currentAttributeKey = '';
        currentAttributeValue = '';
        return;
      }

      currentAttributeValue += char;
    },
    [PARSE_TAG_BODY_STATE]: (char) => {
      if (char === '\n') {
        currentState = PARSE_EMPTY_SPACE_STATE;
        return;
      }

      if (char === '<') {
        currentState = PARSE_TAG_KEY_STATE;

        if (currentTagKey) {
          tagInfoCallback(
            {
              tagKey: currentTagKey,
              tagValue: currentTagValue || null,
              tagAttributes: currentTagAttributeKeyValueMap,
              hasChildren,
            },
            null
          ); // TODO: parent
          currentTagKey = '';
          currentTagValue = '';
          currentTagAttributeKeyValueMap = {};
          hasChildren = true;
        }
        return;
      }

      currentTagValue += char;
    },
  };

  return (char: string) => {
    stateMachine[currentState](char);
    lastChar = char;
  };
}

// TODO: add paren node support

