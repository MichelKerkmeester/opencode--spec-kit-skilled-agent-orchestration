// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. INDEX
// ───────────────────────────────────────────────────────────────
// Barrel export for utility modules (logger, path, validation, file helpers)
export { structuredLog } from './logger';
export type { LogLevel, LogEntry } from './logger';

export { sanitizePath, getPathBasename } from './path-utils';
export {
  buildWorkspaceIdentity,
  getWorkspacePathVariants,
  isSameWorkspacePath,
  toWorkspaceRelativePath,
  findNearestOpencodeDirectory,
  normalizeAbsolutePath,
} from './workspace-identity';
export type { WorkspaceIdentity } from './workspace-identity';

export {
  buildSpecAffinityTargets,
  evaluateCollectedDataSpecAffinity,
  evaluateSpecAffinityText,
  matchesSpecAffinityFilePath,
  matchesSpecAffinityText,
  extractSpecIds,
  normalizePathLike,
  normalizeText,
} from './spec-affinity';
export type {
  SpecAffinityTargets,
  SpecAffinityEvaluation,
} from './spec-affinity';

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
  coerceFactToText,
  coerceFactsToText,
} from './fact-coercion';
export type {
  CoercedFact,
  FactDropReason,
  FactDropLogContext,
} from './fact-coercion';

export {
  requireInteractiveMode,
  promptUser,
  promptUserChoice,
} from './prompt-utils';

export {
  toRelativePath,
  getDescriptionTierRank,
  validateDescription,
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

export {
  sanitizeToolDescription,
  sanitizeToolInputPaths,
  normalizeToolStatus,
  isApiErrorContent,
} from './tool-sanitizer';
export type { ToolStatus } from './tool-sanitizer';

export {
  GENERIC_MEMORY_DESCRIPTION,
  LEGACY_GENERIC_MEMORY_TRIGGER_PHRASES,
  hasLegacyGenericTriggerPhrases,
  hasGenericMemoryDescription,
  sanitizeMemoryFrontmatterTitle,
  deriveMemoryDescription,
  deriveMemoryTriggerPhrases,
} from './memory-frontmatter';
