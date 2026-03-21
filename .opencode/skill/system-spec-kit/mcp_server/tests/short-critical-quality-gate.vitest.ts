// TEST: Short-Critical Quality Gate Exception (REQ-D4-003)
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  isSaveQualityGateExceptionsEnabled,
  countStructuralSignals,
  isShortCriticalException,
  validateStructural,
  SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS,
  MIN_CONTENT_LENGTH,
} from '../lib/validation/save-quality-gate';

/* ───────────────────────────────────────────────────────────────
   HELPERS
----------------------------------------------------------------*/

function enableExceptions(): void {
  vi.stubEnv('SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS', 'true');
}

function disableExceptions(): void {
  vi.stubEnv('SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS', 'false');
}

function shortContent(len: number = 20): string {
  return 'x'.repeat(len);
}

/* ───────────────────────────────────────────────────────────────
   TESTS
----------------------------------------------------------------*/

describe('Short-Critical Gate Exception — Feature Flag', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('isSaveQualityGateExceptionsEnabled returns true by default (graduated)', () => {
    vi.stubEnv('SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS', '');
    expect(isSaveQualityGateExceptionsEnabled()).toBe(true);
  });

  it('isSaveQualityGateExceptionsEnabled returns true when set to "true"', () => {
    vi.stubEnv('SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS', 'true');
    expect(isSaveQualityGateExceptionsEnabled()).toBe(true);
  });

  it('isSaveQualityGateExceptionsEnabled returns true when set to "1"', () => {
    vi.stubEnv('SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS', '1');
    expect(isSaveQualityGateExceptionsEnabled()).toBe(true);
  });

  it('isSaveQualityGateExceptionsEnabled returns false when set to "false"', () => {
    vi.stubEnv('SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS', 'false');
    expect(isSaveQualityGateExceptionsEnabled()).toBe(false);
  });
});

describe('Short-Critical Gate Exception — Constants', () => {
  it('SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS is 2', () => {
    expect(SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS).toBe(2);
  });

  it('MIN_CONTENT_LENGTH is 50', () => {
    expect(MIN_CONTENT_LENGTH).toBe(50);
  });
});

describe('Short-Critical Gate Exception — countStructuralSignals', () => {
  it('returns 0 when all signals are absent', () => {
    expect(countStructuralSignals({ title: null, specFolder: null })).toBe(0);
  });

  it('returns 0 when all signals are empty strings', () => {
    expect(countStructuralSignals({ title: '', specFolder: '', anchor: '' })).toBe(0);
  });

  it('counts title as 1 signal', () => {
    expect(countStructuralSignals({ title: 'Decision: Use TypeScript', specFolder: null })).toBe(1);
  });

  it('counts specFolder as 1 signal', () => {
    expect(countStructuralSignals({ title: null, specFolder: '022-hybrid-rag' })).toBe(1);
  });

  it('counts anchor as 1 signal', () => {
    expect(countStructuralSignals({ title: null, specFolder: null, anchor: 'D4-DECISION-001' })).toBe(1);
  });

  it('returns 2 when title + specFolder present', () => {
    expect(countStructuralSignals({
      title: 'Decision: Use FSRS',
      specFolder: '022-hybrid-rag',
    })).toBe(2);
  });

  it('returns 3 when all three signals present', () => {
    expect(countStructuralSignals({
      title: 'Decision: Use FSRS',
      specFolder: '022-hybrid-rag',
      anchor: 'D4-001',
    })).toBe(3);
  });

  it('trims whitespace before counting', () => {
    expect(countStructuralSignals({ title: '  ', specFolder: '  ' })).toBe(0);
    expect(countStructuralSignals({ title: ' Decision Title ', specFolder: ' spec ' })).toBe(2);
  });
});

describe('Short-Critical Gate Exception — isShortCriticalException', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // ── Flag OFF (default) ──

  it('returns false when flag is OFF even with all conditions met', () => {
    disableExceptions();
    expect(isShortCriticalException({
      contextType: 'decision',
      title: 'Decision: Use FSRS',
      specFolder: '022-hybrid-rag',
    })).toBe(false);
  });

  // ── Flag ON, contextType variations ──

  it('returns false when contextType is not decision', () => {
    enableExceptions();
    expect(isShortCriticalException({
      contextType: 'implementation',
      title: 'Some Title',
      specFolder: '022-spec',
    })).toBe(false);
  });

  it('returns false when contextType is null', () => {
    enableExceptions();
    expect(isShortCriticalException({
      contextType: null,
      title: 'Some Title',
      specFolder: '022-spec',
    })).toBe(false);
  });

  it('returns false when contextType is undefined', () => {
    enableExceptions();
    expect(isShortCriticalException({
      contextType: undefined,
      title: 'Some Title',
      specFolder: '022-spec',
    })).toBe(false);
  });

  it('returns false when contextType is constitutional (not decision)', () => {
    enableExceptions();
    // Only decision qualifies for this specific exception
    expect(isShortCriticalException({
      contextType: 'constitutional',
      title: 'Some Title',
      specFolder: '022-spec',
    })).toBe(false);
  });

  // ── Flag ON, contextType=decision, structural signal count ──

  it('returns false when only 1 structural signal (title only)', () => {
    enableExceptions();
    expect(isShortCriticalException({
      contextType: 'decision',
      title: 'Decision Title',
      specFolder: null,
    })).toBe(false);
  });

  it('returns false when only 1 structural signal (specFolder only)', () => {
    enableExceptions();
    expect(isShortCriticalException({
      contextType: 'decision',
      title: null,
      specFolder: '022-spec',
    })).toBe(false);
  });

  it('returns false when 0 structural signals', () => {
    enableExceptions();
    expect(isShortCriticalException({
      contextType: 'decision',
      title: null,
      specFolder: null,
    })).toBe(false);
  });

  it('returns true when contextType=decision AND title+specFolder present', () => {
    enableExceptions();
    expect(isShortCriticalException({
      contextType: 'decision',
      title: 'Decision: Use FSRS',
      specFolder: '022-hybrid-rag',
    })).toBe(true);
  });

  it('returns true when contextType=decision AND title+anchor present', () => {
    enableExceptions();
    expect(isShortCriticalException({
      contextType: 'decision',
      title: 'Decision Title',
      specFolder: null,
      anchor: 'D4-001',
    })).toBe(true);
  });

  it('returns true when contextType=decision AND specFolder+anchor present', () => {
    enableExceptions();
    expect(isShortCriticalException({
      contextType: 'decision',
      title: null,
      specFolder: '022-hybrid-rag',
      anchor: 'D4-001',
    })).toBe(true);
  });

  it('returns true when all 3 structural signals present', () => {
    enableExceptions();
    expect(isShortCriticalException({
      contextType: 'decision',
      title: 'Decision Title',
      specFolder: '022-hybrid-rag',
      anchor: 'D4-001',
    })).toBe(true);
  });
});

describe('Short-Critical Gate Exception — validateStructural integration', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  const shortDoc = shortContent(25); // below MIN_CONTENT_LENGTH of 50
  const longDoc = shortContent(60);  // above MIN_CONTENT_LENGTH

  // ── Normal (non-decision) behavior unchanged ──

  it('rejects short content for non-decision contextType', () => {
    enableExceptions();
    const result = validateStructural({
      title: 'Some Title',
      content: shortDoc,
      specFolder: '022-spec',
      contextType: 'implementation',
    });
    expect(result.pass).toBe(false);
    expect(result.reasons.some(r => r.includes('Content too short'))).toBe(true);
  });

  it('passes long content for non-decision contextType', () => {
    enableExceptions();
    const result = validateStructural({
      title: 'Some Title',
      content: longDoc,
      specFolder: '022-spec',
      contextType: 'implementation',
    });
    // May still fail on other structural reasons but not content length
    expect(result.reasons.every(r => !r.includes('Content too short'))).toBe(true);
  });

  // ── Exception: flag OFF ──

  it('rejects short content for decision type when flag is OFF', () => {
    disableExceptions();
    const result = validateStructural({
      title: 'Decision Title',
      content: shortDoc,
      specFolder: '022-spec',
      contextType: 'decision',
    });
    expect(result.pass).toBe(false);
    expect(result.reasons.some(r => r.includes('Content too short'))).toBe(true);
  });

  // ── Exception: flag ON, not enough signals ──

  it('rejects short content for decision type with only 1 structural signal', () => {
    enableExceptions();
    const result = validateStructural({
      title: 'Decision Title',
      content: shortDoc,
      specFolder: '',           // empty — not a signal
      contextType: 'decision',
    });
    expect(result.pass).toBe(false);
    expect(result.reasons.some(r => r.includes('Content too short'))).toBe(true);
  });

  // ── Exception: flag ON, decision, 2+ signals → bypass ──

  it('passes short content for decision type with 2 structural signals', () => {
    enableExceptions();
    const result = validateStructural({
      title: 'Decision: adopt FSRS hybrid decay',
      content: shortDoc,
      specFolder: '022-hybrid-rag',
      contextType: 'decision',
    });
    // The short-content reason should NOT appear (exception applies)
    expect(result.reasons.every(r => !r.includes('Content too short'))).toBe(true);
  });

  it('passes short content for decision type with 3 structural signals', () => {
    enableExceptions();
    const result = validateStructural({
      title: 'Decision: adopt FSRS',
      content: shortDoc,
      specFolder: '022-hybrid-rag',
      contextType: 'decision',
      anchor: 'D4-DECISION-001',
    });
    expect(result.reasons.every(r => !r.includes('Content too short'))).toBe(true);
  });

  // ── Other structural checks remain enforced even with exception ──

  it('still rejects missing title even when short-critical exception applies', () => {
    enableExceptions();
    const result = validateStructural({
      title: null,           // missing title
      content: shortDoc,
      specFolder: '022-hybrid-rag',
      contextType: 'decision',
      anchor: 'D4-001',     // 2 signals: specFolder + anchor
    });
    expect(result.reasons.some(r => r.includes('Title is missing'))).toBe(true);
  });

  it('still rejects invalid specFolder even when exception applies to content length', () => {
    enableExceptions();
    const result = validateStructural({
      title: 'Decision Title',
      content: shortDoc,
      specFolder: 'invalid spec folder with spaces!',
      contextType: 'decision',
    });
    // specFolder format is invalid — this reason should appear
    expect(result.reasons.some(r => r.includes('Invalid spec folder format'))).toBe(true);
  });

  // ── Warn-only: long content still passes normally ──

  it('long content passes normally for decision type regardless of flag', () => {
    enableExceptions();
    const result = validateStructural({
      title: 'Decision Title',
      content: longDoc,
      specFolder: '022-spec',
      contextType: 'decision',
    });
    expect(result.reasons.every(r => !r.includes('Content too short'))).toBe(true);
  });
});

describe('Short-Critical Gate Exception — contextType passthrough in runQualityGate', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('QualityGateParams accepts contextType field (compile-time check)', () => {
    // This test verifies the interface shape at runtime by calling validateStructural
    // with contextType. If the interface did not include contextType, TypeScript
    // would have flagged this at compile time and the test file would not compile.
    enableExceptions();
    const result = validateStructural({
      title: 'Test',
      content: shortContent(10),
      specFolder: '022-spec',
      contextType: 'decision',
    });
    // We're testing that the function accepts the param without throwing
    expect(result).toBeDefined();
    expect(typeof result.pass).toBe('boolean');
  });
});
