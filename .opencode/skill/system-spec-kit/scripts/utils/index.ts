// --- 1. INDEX ---
// Barrel export for utility modules (logger, path, validation, file helpers)
export { structuredLog } from './logger';
export type { LogLevel, LogEntry } from './logger';

export { sanitizePath, getPathBasename } from './path-utils';

export {
  ARRAY_FLAG_MAPPINGS,
  PRESENCE_FLAG_MAPPINGS,
  ensureArrayOfObjects,
  hasArrayContent,
  validateDataStructure,
} from './data-validator';
export type { ValidatedData } from './data-validator';

export {
  transformKeyDecision,
  buildSessionSummaryObservation,
  buildTechnicalContextObservation,
  normalizeInputData,
  validateInputData,
  transformOpencodeCapture,
  transformOpenCodeCapture,
} from './input-normalizer';
export type {
  Observation,
  UserPrompt,
  RecentContext,
  FileEntry,
  RawInputData,
  DecisionItemObject,
  NormalizedData,
  CaptureExchange,
  CaptureToolCall,
  OpencodeCapture,
  TransformedCapture,
} from './input-normalizer';

export {
  requireInteractiveMode,
  promptUser,
  promptUserChoice,
} from './prompt-utils';

export {
  toRelativePath,
  isDescriptionValid,
  cleanDescription,
} from './file-helpers';

export {
  detectToolCall,
  isProseContext,
  classifyConversationPhase,
} from './tool-detection';
export type { ToolUsage, ToolConfidence, ToolCallRecord, ConversationPhase } from './tool-detection';

export {
  formatTimestamp,
  truncateToolOutput,
  summarizeExchange,
  extractKeyArtifacts,
} from './message-utils';
export type {
  TimestampFormat,
  ToolCall,
  Message,
  ExchangeSummary,
  FileArtifact,
  CommandArtifact,
  ErrorArtifact,
  KeyArtifacts,
} from './message-utils';

export {
  validateNoLeakedPlaceholders,
  validateAnchors,
  logAnchorValidation,
} from './validation-utils';
