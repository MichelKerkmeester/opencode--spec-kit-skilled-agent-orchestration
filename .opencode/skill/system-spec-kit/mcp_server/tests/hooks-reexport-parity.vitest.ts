import { describe, expect, expectTypeOf, it } from 'vitest';

import * as claudeShared from '../hooks/claude/shared.js';
import * as geminiShared from '../hooks/gemini/shared.js';
import {
  escapeProvenanceField,
  sanitizeRecoveredPayload,
  wrapRecoveredCompactPayload,
  type RecoveredCompactMetadata,
} from '../hooks/shared-provenance.js';

describe('hook re-export parity', () => {
  it('keeps Claude and Gemini provenance helpers identical to the Copilot baseline', () => {
    expect(claudeShared.escapeProvenanceField).toBe(escapeProvenanceField);
    expect(claudeShared.sanitizeRecoveredPayload).toBe(sanitizeRecoveredPayload);
    expect(claudeShared.wrapRecoveredCompactPayload).toBe(wrapRecoveredCompactPayload);

    expect(geminiShared.escapeProvenanceField).toBe(escapeProvenanceField);
    expect(geminiShared.sanitizeRecoveredPayload).toBe(sanitizeRecoveredPayload);
    expect(geminiShared.wrapRecoveredCompactPayload).toBe(wrapRecoveredCompactPayload);
  });

  it('keeps the re-exported metadata type aligned across runtimes', () => {
    expectTypeOf<claudeShared.RecoveredCompactMetadata>().toEqualTypeOf<RecoveredCompactMetadata>();
    expectTypeOf<geminiShared.RecoveredCompactMetadata>().toEqualTypeOf<RecoveredCompactMetadata>();
  });
});
