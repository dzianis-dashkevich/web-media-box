import { OperationType } from "../consts/sourceBuffer";

export interface SourceBufferOperation {
  type: OperationType;
  operation: () => Promise<void>;
};

export interface SourceBufferWrapper {
  buffer: SourceBuffer;
  opsQueue: Array<SourceBufferOperation>;
};