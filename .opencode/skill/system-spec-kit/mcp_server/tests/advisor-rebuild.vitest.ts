// ───────────────────────────────────────────────────────────────────
// MODULE: Advisor Rebuild Tests
// ───────────────────────────────────────────────────────────────────

import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { rebuildAdvisorIndex } from '../skill_advisor/handlers/advisor-rebuild.js';
import type { AdvisorStatusOutput } from '../skill_advisor/schemas/advisor-tool-schemas.js';

function status(freshness: AdvisorStatusOutput['freshness'], generation: number): AdvisorStatusOutput {
  return {
    freshness,
    generation,
    trustState: {
      state: freshness,
      reason: null,
      generation,
      checkedAt: '2026-04-29T12:00:00.000Z',
      lastLiveAt: freshness === 'live' ? '2026-04-29T12:00:00.000Z' : null,
    },
    lastGenerationBump: '2026-04-29T12:00:00.000Z',
    lastScanAt: '2026-04-29T12:00:00.000Z',
    skillCount: generation,
    laneWeights: {
      explicit_author: 0.45,
      lexical: 0.3,
      graph_causal: 0.1,
      derived_generated: 0.05,
      semantic_shadow: 0,
    },
  };
}

describe('advisor_rebuild handler', () => {
  it('rebuilds stale advisor state through the explicit repair path', () => {
    const readStatus = vi.fn()
      .mockReturnValueOnce(status('stale', 1))
      .mockReturnValueOnce(status('live', 2));
    const indexSkills = vi.fn(() => ({
      scannedFiles: 1,
      indexedFiles: 1,
      skippedFiles: 0,
      indexedNodes: 1,
      indexedEdges: 0,
      rejectedEdges: 0,
      deletedNodes: 0,
      warnings: [],
    }));
    const publishGeneration = vi.fn();

    const result = rebuildAdvisorIndex({}, {
      workspaceRoot: '/workspace/project',
      readStatus,
      indexSkills,
      publishGeneration,
      sourceSignature: vi.fn(() => 'source-signature'),
    });

    expect(result).toMatchObject({
      rebuilt: true,
      skipped: false,
      reason: 'stale',
      freshnessBefore: 'stale',
      freshnessAfter: 'live',
      generationBefore: 1,
      generationAfter: 2,
      skillCount: 2,
    });
    expect(indexSkills).toHaveBeenCalledWith('/workspace/project/.opencode/skill');
    expect(publishGeneration).toHaveBeenCalledWith({
      workspaceRoot: '/workspace/project',
      changedPaths: ['/workspace/project/.opencode/skill'],
      reason: 'advisor_rebuild',
      state: 'live',
      sourceSignature: 'source-signature',
    });
  });

  it('keeps advisor_status diagnostic-only by skipping live state without force', () => {
    const readStatus = vi.fn(() => status('live', 3));
    const indexSkills = vi.fn();

    const result = rebuildAdvisorIndex({}, {
      workspaceRoot: '/workspace/project',
      readStatus,
      indexSkills,
    });

    expect(result).toMatchObject({
      rebuilt: false,
      skipped: true,
      reason: 'status-live',
      freshnessBefore: 'live',
      freshnessAfter: 'live',
    });
    expect(indexSkills).not.toHaveBeenCalled();
  });

  it('uses workspaceRoot from the public rebuild input when provided', () => {
    const alternateRoot = mkdtempSync(join(tmpdir(), 'advisor-rebuild-alternate-'));
    const readStatus = vi.fn()
      .mockReturnValueOnce(status('absent', 0))
      .mockReturnValueOnce(status('live', 1));
    const indexSkills = vi.fn(() => ({
      scannedFiles: 1,
      indexedFiles: 1,
      skippedFiles: 0,
      indexedNodes: 1,
      indexedEdges: 0,
      rejectedEdges: 0,
      deletedNodes: 0,
      warnings: [],
    }));
    const publishGeneration = vi.fn();

    const result = rebuildAdvisorIndex({ workspaceRoot: alternateRoot, force: true }, {
      workspaceRoot: '/workspace/default',
      readStatus,
      indexSkills,
      publishGeneration,
      sourceSignature: vi.fn(() => 'alt-source-signature'),
    });

    expect(result.rebuilt).toBe(true);
    expect(readStatus).toHaveBeenNthCalledWith(1, { workspaceRoot: alternateRoot });
    expect(indexSkills).toHaveBeenCalledWith(`${alternateRoot}/.opencode/skill`);
    expect(publishGeneration).toHaveBeenCalledWith(expect.objectContaining({
      workspaceRoot: alternateRoot,
      changedPaths: [`${alternateRoot}/.opencode/skill`],
    }));
  });
});
