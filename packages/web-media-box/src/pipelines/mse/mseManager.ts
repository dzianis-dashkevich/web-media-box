import Logger from "@/utils/logger";

// TODO: Implement SourceBufferWrapper and promise queue logic.
export default class MseManager {
  private readonly logger: Logger;
  private mediaSource: MediaSource;
  private sourceBuffers: Map<string, SourceBuffer>;
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

  public async appendData(mimeType: string, data: ArrayBuffer): Promise<void> {
    return new Promise((resolve) => {
      const buffer = this.sourceBuffers.get(mimeType);
      if (buffer) {
        // TODO: handle error/abort/update/updatestart events
        const updateEnd = () => {
          buffer.removeEventListener('updateend', updateEnd);
          this.logger.debug(`Append complete to ${mimeType} SourceBuffer`);
          resolve();
        };
        buffer.addEventListener('updateend', updateEnd);
        try {
          buffer.appendBuffer(data);
        } catch (error) {
          this.logger.warn(`${error} cannot append data for ${mimeType} to the SourceBuffer`);
        }
      }
    });
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
      const sourceBuffer = this.mediaSource.addSourceBuffer(mimeCodec);
      this.sourceBuffers.set(mimeCodec, sourceBuffer);
    });
  }
}
