// ───────────────────────────────────────────────────────────────
// MODULE: edge-metadata sanitizer (010/007/T-D R-007-P2-3)
// ───────────────────────────────────────────────────────────────
// Read-path allowlist for `reason` / `step` strings on edges.
// Allowlist: single-line, length ≤ 200, no control characters
// (\x00-\x1F, \x7F). Failures return null (not the raw value).

import { describe, it, expect } from 'vitest';
import { sanitizeEdgeMetadataString } from '../lib/code-graph-db.js';

describe('sanitizeEdgeMetadataString — R-007-P2-3 control-character allowlist', () => {
  it('returns the value unchanged for legitimate single-line strings', () => {
    expect(sanitizeEdgeMetadataString('structured-structural-extraction')).toBe('structured-structural-extraction');
    expect(sanitizeEdgeMetadataString('extract')).toBe('extract');
    expect(sanitizeEdgeMetadataString('Heuristic resolver: name-match against module exports')).toBe('Heuristic resolver: name-match against module exports');
  });

  it('returns null for non-string inputs', () => {
    expect(sanitizeEdgeMetadataString(null)).toBe(null);
    expect(sanitizeEdgeMetadataString(undefined)).toBe(null);
    expect(sanitizeEdgeMetadataString(42)).toBe(null);
    expect(sanitizeEdgeMetadataString(true)).toBe(null);
    expect(sanitizeEdgeMetadataString({})).toBe(null);
    expect(sanitizeEdgeMetadataString([])).toBe(null);
  });

  it('returns null for the empty string', () => {
    expect(sanitizeEdgeMetadataString('')).toBe(null);
  });

  it('returns null for strings longer than 200 chars', () => {
    expect(sanitizeEdgeMetadataString('x'.repeat(200))).toBe('x'.repeat(200));
    expect(sanitizeEdgeMetadataString('x'.repeat(201))).toBe(null);
    expect(sanitizeEdgeMetadataString('x'.repeat(2000))).toBe(null);
  });

  it('returns null for strings containing control characters \\x00-\\x1F', () => {
    // BEL (0x07)
    expect(sanitizeEdgeMetadataString('normal\x07bytes')).toBe(null);
    // NUL (0x00)
    expect(sanitizeEdgeMetadataString('with\x00null')).toBe(null);
    // newline (0x0A)
    expect(sanitizeEdgeMetadataString('multi\nline')).toBe(null);
    // tab (0x09)
    expect(sanitizeEdgeMetadataString('with\ttab')).toBe(null);
    // carriage return (0x0D)
    expect(sanitizeEdgeMetadataString('with\rcr')).toBe(null);
    // ESC (0x1B) — used in ANSI escape sequences
    expect(sanitizeEdgeMetadataString('\x1b[31mred\x1b[0m')).toBe(null);
  });

  it('returns null for strings containing DEL (\\x7F)', () => {
    expect(sanitizeEdgeMetadataString('with\x7fdel')).toBe(null);
  });

  it('accepts unicode and high-code-point characters above the control band', () => {
    expect(sanitizeEdgeMetadataString('ünïçödé reason')).toBe('ünïçödé reason');
    expect(sanitizeEdgeMetadataString('emoji 🦀 in reason')).toBe('emoji 🦀 in reason');
    expect(sanitizeEdgeMetadataString('arrow → step')).toBe('arrow → step');
  });

  it('rejects mixed legitimate + control-char content (no partial sanitization)', () => {
    // The allowlist is all-or-nothing: any control char drops the whole
    // string to null. This avoids partial-leak semantics.
    expect(sanitizeEdgeMetadataString('legitimate prefix\x07followed by injected bytes')).toBe(null);
  });

  // 008/D7 regression: the read-path sanitizer is wired at three sites
  // (rowToEdge → code-graph-db.ts, edgeMetadataOutput → query.ts, and
  // formatContextEdge → code-graph-context.ts). Each site has its own
  // local sanitizer function (not yet DRY'd to the shared export);
  // assert the local sanitizer name is present in each file so a
  // refactor that drops a call site fails this test.
  it('a sanitizer is referenced at each of 3 documented read-path sites (D7 coverage)', async () => {
    const fs = await import('node:fs/promises');
    const sites: Array<{ path: string; mustContain: string[] }> = [
      {
        path: '../lib/code-graph-db.ts',
        mustContain: ['sanitizeEdgeMetadataString'],
      },
      {
        path: '../handlers/query.ts',
        mustContain: ['sanitizeEdgeMetadataReadString'],
      },
      {
        path: '../lib/code-graph-context.ts',
        mustContain: ['sanitizeContextEdgeString'],
      },
    ];
    for (const site of sites) {
      const url = new URL(site.path, import.meta.url);
      const src = await fs.readFile(url, 'utf8');
      for (const needle of site.mustContain) {
        expect(src.includes(needle)).toBe(true);
      }
    }
  });

  // 008/D7 regression: rowToEdge must not throw on malformed metadata
  // JSON. Previously a single bad row would crash relationship and
  // blast_radius queries.
  it('rowToEdge tolerates malformed metadata JSON without throwing (D7 hardening)', async () => {
    const fs = await import('node:fs/promises');
    const url = new URL('../lib/code-graph-db.ts', import.meta.url);
    const src = await fs.readFile(url, 'utf8');
    // Verify the rowToEdge function wraps JSON.parse in try/catch.
    const rowToEdgeIdx = src.indexOf('function rowToEdge');
    expect(rowToEdgeIdx).toBeGreaterThan(-1);
    const rowToEdgeBody = src.slice(rowToEdgeIdx, rowToEdgeIdx + 800);
    expect(rowToEdgeBody.includes('JSON.parse')).toBe(true);
    // The hardening uses try/catch around JSON.parse so malformed JSON
    // doesn't propagate out of the read path.
    expect(rowToEdgeBody.includes('try') && rowToEdgeBody.includes('catch')).toBe(true);
  });
});
