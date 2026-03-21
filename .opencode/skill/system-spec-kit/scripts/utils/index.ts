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
  normalizeAbsolutePath,
} from './workspace-identity';
export type { WorkspaceIdentity } from './workspace-identity';

export {
  buildSpecAffinityTargets,
  evaluateCollectedDataSpecAffinity,
} from './spec-affinity';
export type {
  SpecAffinityTargets,
  SpecAffinityEvaluation,
} from './spec-affinity';

export {
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
  NormalizedUserPrompt,
  UserPrompt,
  RecentContext,
  NormalizedFileEntry,
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
} from './message-utils';

export {
  validateNoLeakedPlaceholders,
  validateAnchors,
} from './validation-utils';

export {
  sanitizeToolDescription,
  sanitizeToolInputPaths,
  normalizeToolStatus,
  isApiErrorContent,
} from './tool-sanitizer';
export type { ToolStatus } from './tool-sanitizer';

export {
  normalizeMemoryNameCandidate,
  slugify,
  isContaminatedMemoryName,
  isGenericContentTask,
  pickBestContentName,
  ensureUniqueMemoryFilename,
  generateContentSlug,
} from './slug-utils';

export {
  getSourceCapabilities,
} from './source-capabilities';
export type {
  SourceInputMode,
  KnownDataSource,
  SourceCapabilities,
} from './source-capabilities';
