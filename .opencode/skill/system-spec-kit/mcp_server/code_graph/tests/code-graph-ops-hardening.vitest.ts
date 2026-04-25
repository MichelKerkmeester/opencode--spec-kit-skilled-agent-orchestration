// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Ops Hardening Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import {
  buildCodeGraphOpsContract,
  createMetadataOnlyPreview,
  normalizeStructuralReadiness,
} from '../lib/ops-hardening.js';

describe('code graph ops hardening', () => {
  it('normalizes graph freshness into canonical readiness', () => {
    expect(normalizeStructuralReadiness('fresh')).toBe('ready');
    expect(normalizeStructuralReadiness('stale')).toBe('stale');
    expect(normalizeStructuralReadiness('empty')).toBe('missing');
    expect(normalizeStructuralReadiness('error')).toBe('missing');
  });

  it('builds a hardening contract with repair and export/import guidance', () => {
    const contract = buildCodeGraphOpsContract({
      graphFreshness: 'stale',
      sourceSurface: 'session_bootstrap',
    });

    expect(contract.readiness.canonical).toBe('stale');
    expect(contract.doctor.surface).toBe('memory_health');
    expect(contract.exportImport.rawDbDumpAllowed).toBe(false);
    expect(contract.previewPolicy.mode).toBe('metadata-only');
  });

  it('builds metadata-only previews for artifact-safe surfacing', () => {
    const preview = createMetadataOnlyPreview({
      path: '/tmp/output/report.pdf',
      sizeBytes: 1024,
      mimeType: 'application/pdf',
      lastModified: '2026-04-03T15:00:00.000Z',
    });

    expect(preview.mode).toBe('metadata-only');
    expect(preview.fileName).toBe('report.pdf');
    expect(preview.kind).toBe('binary');
    expect(preview.rawContentIncluded).toBe(false);
  });
});
