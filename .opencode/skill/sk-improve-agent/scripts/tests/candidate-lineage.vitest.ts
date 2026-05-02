import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const lineage = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs',
)) as {
  createLineageGraph: () => object;
  recordCandidate: (lineagePath: string, candidate: object) => void;
  getLineage: (lineagePath: string, candidateId: string) => object[];
  getCandidatesByWave: (lineagePath: string, sessionId: string, waveIndex?: number) => object[];
  getRootCandidates: (lineagePath: string) => object[];
  getChildren: (lineagePath: string, parentCandidateId: string) => object[];
};

let tmpDir: string;
let lineagePath: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lineage-test-'));
  lineagePath = path.join(tmpDir, 'candidate-lineage.json');
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('candidate-lineage', () => {
  describe('createLineageGraph', () => {
    it('creates an empty graph', () => {
      const graph = lineage.createLineageGraph() as { nodes: unknown[] };
      expect(graph.nodes).toEqual([]);
      expect(graph).toHaveProperty('createdAt');
    });
  });

  describe('recordCandidate', () => {
    it('creates file and records candidate', () => {
      lineage.recordCandidate(lineagePath, {
        candidateId: 'c-001',
        sessionId: 's-001',
        waveIndex: 0,
        mutationType: 'section-reorder',
      });

      expect(fs.existsSync(lineagePath)).toBe(true);
      const graph = JSON.parse(fs.readFileSync(lineagePath, 'utf8'));
      expect(graph.nodes).toHaveLength(1);
      expect(graph.nodes[0].candidateId).toBe('c-001');
      expect(graph.nodes[0].parentCandidateId).toBeNull();
    });

    it('records parent-child relationships', () => {
      lineage.recordCandidate(lineagePath, {
        candidateId: 'c-001',
        sessionId: 's-001',
        waveIndex: 0,
        mutationType: 'base',
      });
      lineage.recordCandidate(lineagePath, {
        candidateId: 'c-002',
        sessionId: 's-001',
        waveIndex: 1,
        mutationType: 'variant-a',
        parentCandidateId: 'c-001',
      });

      const graph = JSON.parse(fs.readFileSync(lineagePath, 'utf8'));
      expect(graph.nodes).toHaveLength(2);
      expect(graph.nodes[1].parentCandidateId).toBe('c-001');
    });
  });

  describe('getLineage', () => {
    it('returns empty for non-existent file', () => {
      expect(lineage.getLineage('/nonexistent/path.json', 'c-001')).toEqual([]);
    });

    it('returns single node for root candidate', () => {
      lineage.recordCandidate(lineagePath, {
        candidateId: 'c-001',
        sessionId: 's-001',
        waveIndex: 0,
        mutationType: 'base',
      });

      const chain = lineage.getLineage(lineagePath, 'c-001');
      expect(chain).toHaveLength(1);
      expect((chain[0] as { candidateId: string }).candidateId).toBe('c-001');
    });

    it('traces full derivation chain from root to leaf', () => {
      lineage.recordCandidate(lineagePath, {
        candidateId: 'c-001',
        sessionId: 's-001',
        waveIndex: 0,
        mutationType: 'base',
      });
      lineage.recordCandidate(lineagePath, {
        candidateId: 'c-002',
        sessionId: 's-001',
        waveIndex: 1,
        mutationType: 'variant-a',
        parentCandidateId: 'c-001',
      });
      lineage.recordCandidate(lineagePath, {
        candidateId: 'c-003',
        sessionId: 's-001',
        waveIndex: 2,
        mutationType: 'variant-b',
        parentCandidateId: 'c-002',
      });

      const chain = lineage.getLineage(lineagePath, 'c-003') as Array<{ candidateId: string }>;
      expect(chain).toHaveLength(3);
      expect(chain[0].candidateId).toBe('c-001');
      expect(chain[1].candidateId).toBe('c-002');
      expect(chain[2].candidateId).toBe('c-003');
    });

    it('returns empty for unknown candidate', () => {
      lineage.recordCandidate(lineagePath, {
        candidateId: 'c-001',
        sessionId: 's-001',
        waveIndex: 0,
        mutationType: 'base',
      });

      expect(lineage.getLineage(lineagePath, 'c-unknown')).toEqual([]);
    });
  });

  describe('getCandidatesByWave', () => {
    it('filters by session and wave index', () => {
      lineage.recordCandidate(lineagePath, { candidateId: 'c-001', sessionId: 's-001', waveIndex: 0, mutationType: 'a' });
      lineage.recordCandidate(lineagePath, { candidateId: 'c-002', sessionId: 's-001', waveIndex: 1, mutationType: 'b' });
      lineage.recordCandidate(lineagePath, { candidateId: 'c-003', sessionId: 's-002', waveIndex: 0, mutationType: 'c' });

      const wave0 = lineage.getCandidatesByWave(lineagePath, 's-001', 0);
      expect(wave0).toHaveLength(1);
      expect((wave0[0] as { candidateId: string }).candidateId).toBe('c-001');

      const allS1 = lineage.getCandidatesByWave(lineagePath, 's-001');
      expect(allS1).toHaveLength(2);
    });
  });

  describe('getRootCandidates', () => {
    it('returns only candidates with no parent', () => {
      lineage.recordCandidate(lineagePath, { candidateId: 'c-001', sessionId: 's-001', waveIndex: 0, mutationType: 'a' });
      lineage.recordCandidate(lineagePath, { candidateId: 'c-002', sessionId: 's-001', waveIndex: 1, mutationType: 'b', parentCandidateId: 'c-001' });

      const roots = lineage.getRootCandidates(lineagePath);
      expect(roots).toHaveLength(1);
      expect((roots[0] as { candidateId: string }).candidateId).toBe('c-001');
    });
  });

  describe('getChildren', () => {
    it('returns direct children of a candidate', () => {
      lineage.recordCandidate(lineagePath, { candidateId: 'c-001', sessionId: 's-001', waveIndex: 0, mutationType: 'a' });
      lineage.recordCandidate(lineagePath, { candidateId: 'c-002', sessionId: 's-001', waveIndex: 1, mutationType: 'b', parentCandidateId: 'c-001' });
      lineage.recordCandidate(lineagePath, { candidateId: 'c-003', sessionId: 's-001', waveIndex: 1, mutationType: 'c', parentCandidateId: 'c-001' });

      const children = lineage.getChildren(lineagePath, 'c-001');
      expect(children).toHaveLength(2);
    });

    it('returns empty for leaf candidates', () => {
      lineage.recordCandidate(lineagePath, { candidateId: 'c-001', sessionId: 's-001', waveIndex: 0, mutationType: 'a' });

      const children = lineage.getChildren(lineagePath, 'c-001');
      expect(children).toEqual([]);
    });
  });
});
