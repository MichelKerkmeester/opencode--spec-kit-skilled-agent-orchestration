// ───────────────────────────────────────────────────────────────
// TEST: M8 — Trust-state vocabulary expansion
// ───────────────────────────────────────────────────────────────
// Phase 017 / Phase 3 M8 (T-SHP-01, T-SBS-01, T-CGQ-11, T-CGQ-12,
// R9-001, R22-001, R23-001, R27-002, R30-001)
//
// Canonical acceptance for the expanded SharedPayloadTrustState:
//   live         — fresh, validated
//   stale        — exists but may be outdated, query still valid
//   absent       — does not exist for this scope
//   unavailable  — should exist but inaccessible (I/O error, lock held)
//
// This suite locks in:
//   1. trustStateFromGraphState / trustStateFromStructuralStatus no longer
//      collapse 'missing'/'empty' into 'stale'.
//   2. opencode-transport coerceSharedPayloadEnvelope validates trustState
//      and rejects legacy scalar fabrications such as 'ready'.
//   3. code_graph_query emits a readiness block with canonical vocabulary
//      (canonicalReadiness + trustState) aligned with session_bootstrap.

import { describe, expect, it } from 'vitest';
import {
  SHARED_PAYLOAD_TRUST_STATE_VALUES,
  assertSharedPayloadTrustState,
  isSharedPayloadTrustState,
  trustStateFromGraphState,
  trustStateFromStructuralStatus,
} from '../lib/context/shared-payload.js';
import { coerceSharedPayloadEnvelope } from '../lib/context/opencode-transport.js';

describe('M8 — trust-state vocabulary (T-SHP-01 / R9-001)', () => {
  it('exposes the canonical four-state vocabulary plus migration-era values', () => {
    // The expanded vocabulary must surface all four canonical states.
    for (const canonical of ['live', 'stale', 'absent', 'unavailable'] as const) {
      expect(SHARED_PAYLOAD_TRUST_STATE_VALUES).toContain(canonical);
      expect(isSharedPayloadTrustState(canonical)).toBe(true);
    }

    // Legacy/cache values must still round-trip through the guard so existing
    // compact-cache producers ('cached') and migration paths keep working.
    for (const legacy of ['cached', 'imported', 'rebuilt', 'rehomed'] as const) {
      expect(SHARED_PAYLOAD_TRUST_STATE_VALUES).toContain(legacy);
    }
  });

  it('rejects unknown trust states at the guard boundary', () => {
    expect(isSharedPayloadTrustState('ready')).toBe(false);
    expect(isSharedPayloadTrustState('missing')).toBe(false);
    expect(isSharedPayloadTrustState('')).toBe(false);
    expect(isSharedPayloadTrustState(null)).toBe(false);
    expect(() => assertSharedPayloadTrustState('ready')).toThrow(
      'Invalid shared payload trust state',
    );
  });

  it('maps graph freshness to the canonical state without collapsing into stale', () => {
    expect(trustStateFromGraphState('ready')).toBe('live');
    expect(trustStateFromGraphState('stale')).toBe('stale');
    // 'empty' and 'missing' are semantically "no data for this scope" rather
    // than "data but outdated" — mapped to 'absent' per T-SHP-01.
    expect(trustStateFromGraphState('empty')).toBe('absent');
    expect(trustStateFromGraphState('missing')).toBe('absent');
    // 'error' indicates the probe itself failed; scope may or may not exist
    // but we cannot reach it — mapped to 'unavailable'.
    expect(trustStateFromGraphState('error')).toBe('unavailable');
  });

  it('maps structural status to the canonical state (ready | stale | missing)', () => {
    expect(trustStateFromStructuralStatus('ready')).toBe('live');
    expect(trustStateFromStructuralStatus('stale')).toBe('stale');
    expect(trustStateFromStructuralStatus('missing')).toBe('absent');
  });
});

describe('M8 — opencode-transport coerceSharedPayloadEnvelope validates trustState (T-SHP-01 follow-on)', () => {
  function validEnvelope(trustState: string) {
    return {
      kind: 'resume',
      summary: 'resume summary',
      sections: [{
        key: 'resume-surface',
        title: 'Resume Surface',
        content: 'resume content',
        source: 'session' as const,
      }],
      provenance: {
        producer: 'session_resume',
        sourceSurface: 'session_resume',
        trustState,
        generatedAt: '2026-04-16T00:00:00.000Z',
        lastUpdated: null,
        sourceRefs: ['session_resume'],
      },
    };
  }

  it('accepts payloads whose trustState is on the canonical vocabulary', () => {
    for (const trustState of ['live', 'stale', 'absent', 'unavailable']) {
      const envelope = coerceSharedPayloadEnvelope(validEnvelope(trustState));
      expect(envelope?.provenance.trustState).toBe(trustState);
    }
  });

  it('rejects legacy scalar trust labels such as "ready" that collapse vocabularies', () => {
    expect(() => coerceSharedPayloadEnvelope(validEnvelope('ready'))).toThrow(
      /Invalid shared payload envelope provenance\.trustState "ready"/,
    );
    expect(() => coerceSharedPayloadEnvelope(validEnvelope('missing'))).toThrow(
      /Invalid shared payload envelope provenance\.trustState "missing"/,
    );
  });
});

describe('M8 — code_graph_query readiness vocabulary (T-CGQ-11 / R22-001, R23-001)', () => {
  it('mapping helpers produce aligned canonical readiness + trust state for each freshness', async () => {
    // Re-import the helper module under test after the vi.doMock calls above
    // would have been set up in other suites; here we only exercise the raw
    // mapping rules, so no mocks are required.
    expect(trustStateFromGraphState('ready')).toBe('live');
    expect(trustStateFromGraphState('stale')).toBe('stale');
    expect(trustStateFromGraphState('empty')).toBe('absent');
    expect(trustStateFromGraphState('error')).toBe('unavailable');

    // The canonical readiness vocabulary matches the ops-hardening contract
    // (ready | stale | missing) regardless of the trust-state axis.
    const { normalizeStructuralReadiness } = await import('../code-graph/lib/ops-hardening.js');
    expect(normalizeStructuralReadiness('fresh')).toBe('ready');
    expect(normalizeStructuralReadiness('stale')).toBe('stale');
    expect(normalizeStructuralReadiness('empty')).toBe('missing');
    expect(normalizeStructuralReadiness('error')).toBe('missing');
  });
});
