// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------

export {
  extractContextHint,
  getConstitutionalMemories,
  clearConstitutionalCache,
  autoSurfaceMemories,
  autoSurfaceAtToolDispatch,
  autoSurfaceAtCompaction,
  MEMORY_AWARE_TOOLS,
} from './memory-surface';
export { buildMutationHookFeedback } from './mutation-feedback';
export {
  appendAutoSurfaceHints,
  syncEnvelopeTokenCount,
  serializeEnvelopeWithTokenCount,
} from './response-hints';
