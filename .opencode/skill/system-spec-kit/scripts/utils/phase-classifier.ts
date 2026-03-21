// ───────────────────────────────────────────────────────────────
// MODULE: Phase Classifier (re-export shim)
// ───────────────────────────────────────────────────────────────
// Canonical implementation moved to lib/phase-classifier.ts.
// This shim preserves backward compatibility for existing importers.

export type {
  PhaseClassifierExchangeInput,
  PhaseClassificationResult,
} from '../lib/phase-classifier';

export {
  classifyConversationExchanges,
  classifyConversationPhase,
} from '../lib/phase-classifier';
