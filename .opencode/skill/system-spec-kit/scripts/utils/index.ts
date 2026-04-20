// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. INDEX
// ───────────────────────────────────────────────────────────────
// Barrel export for utility modules (logger, path, validation, file helpers)
export { structuredLog } from './logger.js';
export type { LogLevel, LogEntry } from './logger.js';

export { sanitizePath, getPathBasename } from './path-utils.js';
export {
  buildWorkspaceIdentity,
  getWorkspacePathVariants,
  isSameWorkspacePath,
  toWorkspaceRelativePath,
  normalizeAbsolutePath,
} from './workspace-identity.js';
export type { WorkspaceIdentity } from './workspace-identity.js';

export {
  buildSpecAffinityTargets,
  evaluateCollectedDataSpecAffinity,
} from './spec-affinity.js';
export type {
  SpecAffinityTargets,
  SpecAffinityEvaluation,
} from './spec-affinity.js';

export {
  validateDataStructure,
} from './data-validator.js';
export type { ValidatedData } from './data-validator.js';

export {
  transformKeyDecision,
  buildSessionSummaryObservation,
  buildTechnicalContextObservation,
  normalizeInputData,
  validateInputData,
  transformOpencodeCapture,
  transformOpenCodeCapture,
} from './input-normalizer.js';
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
} from './input-normalizer.js';

export {
  coerceFactToText,
  coerceFactsToText,
} from './fact-coercion.js';
export type {
  CoercedFact,
  FactDropReason,
  FactDropLogContext,
} from './fact-coercion.js';

export {
  promptUser,
  promptUserChoice,
} from './prompt-utils.js';

export {
  toRelativePath,
  getDescriptionTierRank,
  validateDescription,
  isDescriptionValid,
  cleanDescription,
} from './file-helpers.js';

export {
  detectToolCall,
  isProseContext,
  classifyConversationPhase,
} from './tool-detection.js';
export type { ToolUsage, ToolConfidence, ToolCallRecord, ConversationPhase } from './tool-detection.js';

export {
  formatTimestamp,
  truncateToolOutput,
  summarizeExchange,
} from './message-utils.js';

export {
  validateNoLeakedPlaceholders,
  validateAnchors,
} from './validation-utils.js';

export {
  sanitizeToolDescription,
  sanitizeToolInputPaths,
  normalizeToolStatus,
  isApiErrorContent,
} from './tool-sanitizer.js';
export type { ToolStatus } from './tool-sanitizer.js';

export {
  normalizeMemoryNameCandidate,
  slugify,
  isContaminatedMemoryName,
  isGenericContentTask,
  pickBestContentName,
  ensureUniqueMemoryFilename,
  generateContentSlug,
} from './slug-utils.js';

export {
  getSourceCapabilities,
} from './source-capabilities.js';
export type {
  SourceInputMode,
  KnownDataSource,
  SourceCapabilities,
} from './source-capabilities.js';
