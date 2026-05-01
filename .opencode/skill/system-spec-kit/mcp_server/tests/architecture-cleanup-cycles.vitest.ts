// ───────────────────────────────────────────────────────────────
// MODULE: Architecture Dependency Cycle Verification (Phase 049-006)
// ───────────────────────────────────────────────────────────────
// Verifies that the dependency-graph cycles flagged in packet 046 §17 have
// been broken by extracting shared types into neutral seam modules. The
// tests confirm:
//   - StructuralBootstrapContract is exported from the new type seam.
//   - session-snapshot and memory-surface still expose the type at their
//     original paths via re-export.
//   - CommunityResult / CommunitySummary live in the neutral graph types
//     module and the original locations re-export them.
//   - context-server.ts no longer exports `getDetectedRuntime`.

import { describe, expect, it } from 'vitest';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// F-017-D2-01: type-only seam.
import type { StructuralBootstrapContract as ContractFromSeam } from '../lib/session/structural-bootstrap-contract.js';
import type { StructuralBootstrapContract as ContractFromSnapshot } from '../lib/session/session-snapshot.js';

// F-017-D2-02: type-only seam.
import type {
  CommunityResult as CommunityResultFromSeam,
  CommunitySummary as CommunitySummaryFromSeam,
} from '../lib/graph/community-types.js';
import type { CommunityResult as CommunityResultFromDetection } from '../lib/graph/community-detection.js';
import type { CommunitySummary as CommunitySummaryFromSummaries } from '../lib/graph/community-summaries.js';

describe('F-017-D2-01: StructuralBootstrapContract cycle break', () => {
  it('the seam type is structurally identical to the snapshot re-export', () => {
    // Type-level assertion: assigning one to the other compiles iff they
    // are structurally compatible. Runtime check just confirms the test
    // ran under TS.
    const sample: ContractFromSeam = {
      status: 'ready',
      summary: 'test',
      recommendedAction: 'noop',
      sourceSurface: 'session_bootstrap',
    };
    const aliased: ContractFromSnapshot = sample;
    expect(aliased.status).toBe('ready');
  });

  it('memory-surface imports the contract from the seam, not from session-snapshot', () => {
    const memorySurfacePath = resolve(__dirname, '../hooks/memory-surface.ts');
    const source = readFileSync(memorySurfacePath, 'utf8');
    expect(source).toContain("from '../lib/session/structural-bootstrap-contract.js'");
    expect(source).not.toMatch(/import\s+type\s*\{\s*StructuralBootstrapContract\s*\}\s+from\s+'\.\.\/lib\/session\/session-snapshot\.js'/);
  });
});

describe('F-017-D2-02: Community types cycle break', () => {
  it('CommunityResult type is structurally compatible across seam and original sites', () => {
    const sample: CommunityResultFromSeam = {
      communityId: 1,
      memberIds: [10, 20],
      size: 2,
      density: 0.5,
    };
    const aliased: CommunityResultFromDetection = sample;
    expect(aliased.communityId).toBe(1);
  });

  it('CommunitySummary type is structurally compatible across seam and original sites', () => {
    const sample: CommunitySummaryFromSeam = {
      communityId: 1,
      summary: 'cluster',
      memberCount: 2,
      memberIds: [10, 20],
    };
    const aliased: CommunitySummaryFromSummaries = sample;
    expect(aliased.summary).toBe('cluster');
  });

  it('community-storage imports both shared types from the seam', () => {
    const storagePath = resolve(__dirname, '../lib/graph/community-storage.ts');
    const source = readFileSync(storagePath, 'utf8');
    expect(source).toContain("from './community-types.js'");
  });
});

describe('F-017-D2-03: getDetectedRuntime dead export removed', () => {
  it('context-server.ts no longer exports getDetectedRuntime', () => {
    const contextServerPath = resolve(__dirname, '../context-server.ts');
    const source = readFileSync(contextServerPath, 'utf8');
    expect(source).not.toMatch(/export\s+function\s+getDetectedRuntime/);
  });
});
