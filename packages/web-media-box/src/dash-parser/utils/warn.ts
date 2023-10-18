const skipProcessing = (tag: string, reason: string) => `Skip processing ${tag}. Reason: ${reason}.`;

export const missingRequiredAttributeWarn = (tag: string, attribute: string) =>
  skipProcessing(tag, `No required ${attribute} attribute`);
