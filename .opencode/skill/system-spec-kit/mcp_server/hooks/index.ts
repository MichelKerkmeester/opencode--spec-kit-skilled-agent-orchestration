// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────
export {
  extractContextHint,
  getConstitutionalMemories,
  clearConstitutionalCache,
  autoSurfaceMemories,
  autoSurfaceAtToolDispatch,
  autoSurfaceAtCompaction,
  MEMORY_AWARE_TOOLS,
  // T018: Session tracking for session_health tool
  recordToolCall,
  getSessionTimestamps,
  getLastActiveSessionId,
  isSessionPrimed,
  getCodeGraphStatusSnapshot,
} from './memory-surface.js';
export { buildMutationHookFeedback } from './mutation-feedback.js';
// Gemini hooks are standalone scripts invoked directly by Gemini CLI — not barrel-exported
export {
  appendAutoSurfaceHints,
  syncEnvelopeTokenCount,
  serializeEnvelopeWithTokenCount,
} from './response-hints.js';
