import Logger from "@/utils/logger";
import type { SourceBufferOperation, SourceBufferWrapper } from "./types/bufferOperation";
import { OperationType } from "./consts/sourceBuffer";

// TODO: Implement SourceBufferWrapper and promise queue logic.
export default class MseManager {
  private readonly logger: Logger;
  private mediaSource: MediaSource;
  private sourceBuffers: Map<string, SourceBufferWrapper>;
  private sourceOpen: Promise<void>;

  public constructor(logger: Logger) {
    this.logger = logger.createSubLogger('MseManager');
    //TODO: ManagedMediaSource
    this.mediaSource = new MediaSource();
    this.sourceOpen = this.initMediaSource();
    this.sourceBuffers = new Map();
  }

  public initBuffers(mimeCodecs: Array<string>) {
    mimeCodecs.forEach((mimeCodec) => {
      if (MediaSource.isTypeSupported(mimeCodec)) {
        const mimeType = mimeCodec.substring(0, mimeCodec.indexOf(';'));
        this.addSourceBuffer(mimeType);
      } else {
        this.logger.warn(`MediaSource cannot create SourceBuffer for type ${mimeCodec}`);
      }
    });
  }

  public appendData(mimeType: string, data: ArrayBuffer) {
    const bufferWrapper = this.sourceBuffers.get(mimeType);
    if (bufferWrapper) {
      const buffer = bufferWrapper.buffer;
      const queue = bufferWrapper.queue;
      const operation = (): Promise<void> => {
        return new Promise((resolve, reject) => {
          const removeAllEventListeners = () => {
            buffer.removeEventListener('updateend', updateEnd);
            buffer.removeEventListener('error', onError);
            buffer.removeEventListener('abort', onAbort);
          };
          // TODO: handle update/updatestart events
          const updateEnd = () => {
            removeAllEventListeners();
            this.logger.debug(`Append complete to ${mimeType} SourceBuffer`);
            resolve();
          };
          const onError = (event: Event) => {
            removeAllEventListeners();
            this.logger.warn(`Error ${event} appending to SourceBuffer of type ${mimeType}`);
            reject();
          };
          const onAbort = (event: Event) => {
            removeAllEventListeners();
            this.logger.debug(`Aborted ${event} appending to SourceBuffer of type ${mimeType}`);
            reject();
          }
          buffer.addEventListener('updateend', updateEnd);
          buffer.addEventListener('error', onError);
          buffer.addEventListener('abort', onAbort);
          try {
            buffer.appendBuffer(data);
          } catch (error) {
            this.logger.warn(`${error} cannot append data for ${mimeType} to the SourceBuffer`);
          }
        });
      }
      const appendOperation: SourceBufferOperation = {
        type: OperationType.APPEND,
        operation
      };
      queue.push(appendOperation);
      // TODO: process queue
    }
  }

  private async initMediaSource(): Promise<void> {
    return new Promise((resolve) => {
      const sourceOpen = () => {
        this.mediaSource.removeEventListener('sourceopen', sourceOpen);
        resolve();
      };
      this.mediaSource.addEventListener('sourceopen', sourceOpen);
    });
  }

  private addSourceBuffer(mimeCodec: string) {
    this.sourceOpen.then(() => { 
      const buffer = this.mediaSource.addSourceBuffer(mimeCodec);
      const wrappedBuffer: SourceBufferWrapper = {
        buffer,
        queue: new Array<SourceBufferOperation>()
      }; 
      this.sourceBuffers.set(mimeCodec, wrappedBuffer);
    });
  }

  private processQueue(bufferWrapper: SourceBufferWrapper) {
    if (bufferWrapper.queue.length > 0) {
      const bufferOperation = bufferWrapper.queue.shift();
      if (bufferOperation) {
        bufferOperation.operation().then(() => {
            this.processQueue(bufferWrapper);
        });
      }
    }
  }
}
