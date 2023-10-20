import type { TagInfo } from '@/dash-parser/stateMachine.ts';
import { TagProcessor } from '@/dash-parser/tags/base.ts';

export class PendingProcessors {
  private readonly pendingMap: Map<TagInfo, PendingProcess> = new Map();

  public getPendingProcessFor(tagInfo: TagInfo): PendingProcess | null {
    const pendingProcess = this.pendingMap.get(tagInfo);

    return pendingProcess ?? null;
  }

  public setPendingProcessFor(tagInfo: TagInfo, pendingProcess: PendingProcess): void {
    this.pendingMap.set(tagInfo, pendingProcess);
  }

  public removePendingProcessFor(tagInfo: TagInfo): void {
    this.pendingMap.delete(tagInfo);
  }
}

export class PendingProcess {
  private readonly waitingForMap: Map<string, TagInfo | null> = new Map();
  private readonly tagProcessor: TagProcessor;
  private readonly tagInfo: TagInfo;
  private readonly parentTagInfo: TagInfo | null;

  public constructor(
    tagProcessor: TagProcessor,
    tagInfo: TagInfo,
    parentTagInfo: TagInfo | null,
    waitingForSet: Set<string>
  ) {
    this.tagProcessor = tagProcessor;
    this.tagInfo = tagInfo;
    this.parentTagInfo = parentTagInfo;
    waitingForSet.forEach((tagKey) => {
      this.waitingForMap.set(tagKey, null);
    });
  }

  public isRequiredChild(tagInfo: TagInfo): boolean {
    return this.waitingForMap.has(tagInfo.tagKey);
  }

  public updateChildAvailability(tagInfo: TagInfo): void {
    this.waitingForMap.set(tagInfo.tagKey, tagInfo);
  }

  public getIsAllRequiredDataAvailable(): boolean {
    for (const val of this.waitingForMap.values()) {
      if (val === null) {
        return false;
      }
    }

    return true;
  }

  public process(): void {
    this.tagProcessor.processPending(this.tagInfo, this.parentTagInfo, this.waitingForMap);
  }
}