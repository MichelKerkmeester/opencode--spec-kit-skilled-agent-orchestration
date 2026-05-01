// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Metadata Shape Tests
// ───────────────────────────────────────────────────────────────
// F-004-A4-03: metadata getters distinguish absent vs corrupt-JSON vs
// invalid-shape. The legacy *() functions still return null on any
// non-resolved state; the new *WithDiagnostics() companions return the
// discriminated kind.

import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  closeDb,
  getLastDetectorProvenanceSummary,
  getLastDetectorProvenanceSummaryWithDiagnostics,
  getLastGoldVerification,
  getLastGoldVerificationWithDiagnostics,
  getLastGraphEdgeEnrichmentSummary,
  getLastGraphEdgeEnrichmentSummaryWithDiagnostics,
  initDb,
  setCodeGraphMetadata,
} from '../lib/code-graph-db.js';

afterEach(() => {
  try {
    closeDb();
  } catch {
    /* singleton cleanup */
  }
});

describe('F-004-A4-03: metadata read distinguishes absent / corrupt / invalid', () => {
  it('returns absent when no row exists (DetectorProvenanceSummary)', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-meta-absent-1-'));
    try {
      initDb(tempDir);
      // legacy returns null on absent
      expect(getLastDetectorProvenanceSummary()).toBeNull();
      // diagnostic distinguishes absent
      const result = getLastDetectorProvenanceSummaryWithDiagnostics();
      expect(result.kind).toBe('absent');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('returns corrupt when JSON.parse fails', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-meta-corrupt-1-'));
    try {
      initDb(tempDir);
      setCodeGraphMetadata('last_detector_provenance_summary', 'not-valid-json{');

      // legacy returns null
      expect(getLastDetectorProvenanceSummary()).toBeNull();
      // diagnostic returns corrupt with raw payload
      const result = getLastDetectorProvenanceSummaryWithDiagnostics();
      expect(result.kind).toBe('corrupt');
      if (result.kind === 'corrupt') {
        expect(result.raw).toBe('not-valid-json{');
      }
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('returns invalid-shape when JSON parses but schema mismatches', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-meta-shape-1-'));
    try {
      initDb(tempDir);
      // valid JSON but missing expected `dominant` and `counts` keys
      setCodeGraphMetadata('last_detector_provenance_summary', JSON.stringify({ unrelated: true }));

      expect(getLastDetectorProvenanceSummary()).toBeNull();
      const result = getLastDetectorProvenanceSummaryWithDiagnostics();
      expect(result.kind).toBe('invalid-shape');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('returns resolved on a valid record (DetectorProvenanceSummary)', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-meta-resolved-1-'));
    try {
      initDb(tempDir);
      const summary = { dominant: 'ast' as const, counts: { ast: 5 } };
      setCodeGraphMetadata('last_detector_provenance_summary', JSON.stringify(summary));

      // legacy returns the parsed value
      const legacy = getLastDetectorProvenanceSummary();
      expect(legacy).toEqual(summary);

      const result = getLastDetectorProvenanceSummaryWithDiagnostics();
      expect(result.kind).toBe('resolved');
      if (result.kind === 'resolved') {
        expect(result.value).toEqual(summary);
      }
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('GraphEdgeEnrichmentSummary distinguishes absent vs corrupt vs resolved', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-meta-enrich-1-'));
    try {
      initDb(tempDir);
      // absent
      expect(getLastGraphEdgeEnrichmentSummaryWithDiagnostics().kind).toBe('absent');

      // corrupt
      setCodeGraphMetadata('last_graph_edge_enrichment_summary', '{not json');
      expect(getLastGraphEdgeEnrichmentSummaryWithDiagnostics().kind).toBe('corrupt');
      expect(getLastGraphEdgeEnrichmentSummary()).toBeNull();

      // resolved
      const enrichment = { edgeEvidenceClass: 'import' as const, numericConfidence: 0.9 };
      setCodeGraphMetadata('last_graph_edge_enrichment_summary', JSON.stringify(enrichment));
      const resolved = getLastGraphEdgeEnrichmentSummaryWithDiagnostics();
      expect(resolved.kind).toBe('resolved');
      if (resolved.kind === 'resolved') {
        expect(resolved.value).toEqual(enrichment);
      }
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('GoldVerification distinguishes absent vs corrupt vs resolved', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-meta-gold-1-'));
    try {
      initDb(tempDir);
      expect(getLastGoldVerificationWithDiagnostics().kind).toBe('absent');

      setCodeGraphMetadata('last_gold_verification', 'not-json{');
      expect(getLastGoldVerificationWithDiagnostics().kind).toBe('corrupt');
      expect(getLastGoldVerification()).toBeNull();

      // primitive (number) is invalid-shape (must be object)
      setCodeGraphMetadata('last_gold_verification', '42');
      expect(getLastGoldVerificationWithDiagnostics().kind).toBe('invalid-shape');

      const verification = { passed: true, executedAt: '2026-05-01T00:00:00Z' };
      setCodeGraphMetadata('last_gold_verification', JSON.stringify(verification));
      const resolved = getLastGoldVerificationWithDiagnostics();
      expect(resolved.kind).toBe('resolved');
      if (resolved.kind === 'resolved') {
        expect(resolved.value).toEqual(verification);
      }
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
