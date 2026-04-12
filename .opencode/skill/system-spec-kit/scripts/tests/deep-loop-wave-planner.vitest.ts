import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const planner = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs',
)) as {
  REVIEW_FILE_THRESHOLD: number;
  RESEARCH_DOMAIN_THRESHOLD: number;
  DEFAULT_SEGMENT_SIZE_REVIEW: number;
  DEFAULT_SEGMENT_SIZE_RESEARCH: number;
  HOTSPOT_SPREAD_THRESHOLD: number;
  CLUSTER_DIVERSITY_THRESHOLD: number;
  MAX_SEGMENTS_DEFAULT: number;
  shouldActivateReviewWave: (files: object[], metrics?: { hotspotSpread?: number }) => { activate: boolean; reason: string; fileCount: number; hotspotSpread: number };
  shouldActivateResearchWave: (domains: object[], metrics?: { clusterDiversity?: number }) => { activate: boolean; reason: string; domainCount: number; clusterDiversity: number };
  generateHotspotInventory: (files: object[], metrics?: object) => { files: object[]; directories: object[]; totalFiles: number; version: string };
  generateDomainLedger: (sources: object[], metrics?: object) => { domains: object[]; clusters: object[]; totalDomains: number; version: string };
  segmentForReview: (inventory: object, config?: { segmentSize?: number; maxSegments?: number }) => object[];
  segmentForResearch: (ledger: object, config?: { segmentSize?: number; maxSegments?: number }) => object[];
  extractDirectory: (filePath: string) => string;
  computeHotspotSpread: (files: object[]) => number;
  computeClusterDiversity: (domains: object[]) => number;
};

/* ---------------------------------------------------------------
   HELPERS
----------------------------------------------------------------*/

function makeFiles(count: number, opts: { spread?: boolean } = {}): Array<{ path: string; complexity: number; churnRate: number; issueCount: number }> {
  const files = [];
  const dirs = opts.spread ? Math.max(10, Math.floor(count / 50)) : 3;
  for (let i = 0; i < count; i++) {
    const dirIdx = i % dirs;
    files.push({
      path: `src/dir${dirIdx}/file${i}.ts`,
      complexity: (i % 10) + 1,
      churnRate: (i % 5) * 0.2,
      issueCount: i % 3,
    });
  }
  return files;
}

function makeDomains(count: number, opts: { diverse?: boolean } = {}): Array<{ domain: string; authority: number; cluster: string; topics: string[] }> {
  const domains = [];
  const clusters = opts.diverse ? Math.max(10, Math.floor(count / 5)) : 2;
  for (let i = 0; i < count; i++) {
    const clusterIdx = i % clusters;
    domains.push({
      domain: `source${i}.example.com`,
      authority: 0.3 + (i % 7) * 0.1,
      cluster: `cluster-${clusterIdx}`,
      topics: [`topic-${i % 4}`],
    });
  }
  return domains;
}

/* ---------------------------------------------------------------
   TESTS
----------------------------------------------------------------*/

describe('wave-segment-planner', () => {

  describe('constants', () => {
    it('exports expected thresholds', () => {
      expect(planner.REVIEW_FILE_THRESHOLD).toBe(1000);
      expect(planner.RESEARCH_DOMAIN_THRESHOLD).toBe(50);
      expect(planner.DEFAULT_SEGMENT_SIZE_REVIEW).toBe(200);
      expect(planner.DEFAULT_SEGMENT_SIZE_RESEARCH).toBe(10);
    });
  });

  describe('activation gates', () => {
    it('rejects review scope below 1000 files', () => {
      const files = makeFiles(500, { spread: true });
      const result = planner.shouldActivateReviewWave(files);
      expect(result.activate).toBe(false);
      expect(result.fileCount).toBe(500);
    });

    it('rejects review scope with low hotspot spread', () => {
      const files = makeFiles(1200, { spread: false });
      const result = planner.shouldActivateReviewWave(files, { hotspotSpread: 0.05 });
      expect(result.activate).toBe(false);
    });

    it('activates review for 1000+ files with spread', () => {
      const files = makeFiles(1200, { spread: true });
      const result = planner.shouldActivateReviewWave(files, { hotspotSpread: 0.25 });
      expect(result.activate).toBe(true);
      expect(result.fileCount).toBe(1200);
    });

    it('rejects research scope below 50 domains', () => {
      const domains = makeDomains(30, { diverse: true });
      const result = planner.shouldActivateResearchWave(domains);
      expect(result.activate).toBe(false);
      expect(result.domainCount).toBe(30);
    });

    it('activates research for 50+ domains with cluster diversity', () => {
      const domains = makeDomains(60, { diverse: true });
      const result = planner.shouldActivateResearchWave(domains, { clusterDiversity: 0.30 });
      expect(result.activate).toBe(true);
      expect(result.domainCount).toBe(60);
    });
  });

  describe('hotspot inventory (generateHotspotInventory)', () => {
    it('returns empty inventory for null input', () => {
      const inv = planner.generateHotspotInventory(null as any);
      expect(inv.files).toEqual([]);
      expect(inv.version).toBe('v1');
    });

    it('scores and ranks files by hotspot score descending', () => {
      const files = [
        { path: 'src/a.ts', complexity: 10, churnRate: 5, issueCount: 3 },
        { path: 'src/b.ts', complexity: 1, churnRate: 0, issueCount: 0 },
        { path: 'src/c.ts', complexity: 5, churnRate: 3, issueCount: 1 },
      ];
      const inv = planner.generateHotspotInventory(files);
      expect(inv.files.length).toBe(3);
      // Highest score should be first
      expect((inv.files[0] as any).path).toBe('src/a.ts');
      // Lowest score should be last
      expect((inv.files[2] as any).path).toBe('src/b.ts');
    });

    it('groups directories and ranks by total score', () => {
      const files = [
        { path: 'src/hot/a.ts', complexity: 10, churnRate: 5, issueCount: 3 },
        { path: 'src/hot/b.ts', complexity: 8, churnRate: 4, issueCount: 2 },
        { path: 'src/cold/c.ts', complexity: 1, churnRate: 0, issueCount: 0 },
      ];
      const inv = planner.generateHotspotInventory(files);
      expect(inv.directories.length).toBe(2);
      expect((inv.directories[0] as any).directory).toBe('src/hot');
    });

    it('produces deterministic output for identical inputs', () => {
      const files = makeFiles(100, { spread: true });
      const inv1 = planner.generateHotspotInventory(files);
      const inv2 = planner.generateHotspotInventory(files);
      // Compare file order (ignoring timestamps)
      const paths1 = inv1.files.map((f: any) => f.path);
      const paths2 = inv2.files.map((f: any) => f.path);
      expect(paths1).toEqual(paths2);
    });
  });

  describe('domain ledger (generateDomainLedger)', () => {
    it('returns empty ledger for null input', () => {
      const ledger = planner.generateDomainLedger(null as any);
      expect(ledger.domains).toEqual([]);
      expect(ledger.version).toBe('v1');
    });

    it('ranks domains by authority descending', () => {
      const sources = [
        { domain: 'low.example.com', authority: 0.2, cluster: 'a' },
        { domain: 'high.example.com', authority: 0.9, cluster: 'b' },
        { domain: 'mid.example.com', authority: 0.5, cluster: 'a' },
      ];
      const ledger = planner.generateDomainLedger(sources);
      expect(ledger.domains.length).toBe(3);
      expect((ledger.domains[0] as any).domain).toBe('high.example.com');
    });

    it('groups domains by cluster', () => {
      const sources = [
        { domain: 'a1.com', authority: 0.5, cluster: 'alpha' },
        { domain: 'b1.com', authority: 0.8, cluster: 'beta' },
        { domain: 'a2.com', authority: 0.6, cluster: 'alpha' },
      ];
      const ledger = planner.generateDomainLedger(sources);
      expect(ledger.clusters.length).toBe(2);
    });

    it('produces deterministic output for identical inputs', () => {
      const sources = makeDomains(50, { diverse: true });
      const ledger1 = planner.generateDomainLedger(sources);
      const ledger2 = planner.generateDomainLedger(sources);
      const domains1 = ledger1.domains.map((d: any) => d.domain);
      const domains2 = ledger2.domains.map((d: any) => d.domain);
      expect(domains1).toEqual(domains2);
    });
  });

  describe('review segmentation (segmentForReview)', () => {
    it('returns empty array for null inventory', () => {
      expect(planner.segmentForReview(null as any)).toEqual([]);
    });

    it('assigns stable segment IDs', () => {
      const inv = planner.generateHotspotInventory(makeFiles(500, { spread: true }));
      const segments = planner.segmentForReview(inv, { segmentSize: 100 });
      expect(segments.length).toBeGreaterThan(0);
      for (const seg of segments) {
        expect((seg as any).segmentId).toMatch(/^review-seg-\d{3}$/);
      }
    });

    it('respects segment size limits', () => {
      const inv = planner.generateHotspotInventory(makeFiles(500, { spread: true }));
      const segments = planner.segmentForReview(inv, { segmentSize: 100 });
      for (const seg of segments) {
        expect((seg as any).fileCount).toBeLessThanOrEqual(200); // directory packing may slightly exceed
      }
    });

    it('produces deterministic segments for identical inputs', () => {
      const inv = planner.generateHotspotInventory(makeFiles(300, { spread: true }));
      const seg1 = planner.segmentForReview(inv, { segmentSize: 100 });
      const seg2 = planner.segmentForReview(inv, { segmentSize: 100 });
      const ids1 = seg1.map((s: any) => s.segmentId);
      const ids2 = seg2.map((s: any) => s.segmentId);
      expect(ids1).toEqual(ids2);
    });
  });

  describe('research segmentation (segmentForResearch)', () => {
    it('returns empty array for null ledger', () => {
      expect(planner.segmentForResearch(null as any)).toEqual([]);
    });

    it('assigns stable segment IDs', () => {
      const ledger = planner.generateDomainLedger(makeDomains(60, { diverse: true }));
      const segments = planner.segmentForResearch(ledger, { segmentSize: 10 });
      expect(segments.length).toBeGreaterThan(0);
      for (const seg of segments) {
        expect((seg as any).segmentId).toMatch(/^research-seg-\d{3}$/);
      }
    });

    it('produces deterministic segments for identical inputs', () => {
      const ledger = planner.generateDomainLedger(makeDomains(60, { diverse: true }));
      const seg1 = planner.segmentForResearch(ledger, { segmentSize: 10 });
      const seg2 = planner.segmentForResearch(ledger, { segmentSize: 10 });
      const ids1 = seg1.map((s: any) => s.segmentId);
      const ids2 = seg2.map((s: any) => s.segmentId);
      expect(ids1).toEqual(ids2);
    });
  });

  describe('helpers', () => {
    it('extractDirectory works for nested paths', () => {
      expect(planner.extractDirectory('src/lib/file.ts')).toBe('src/lib');
      expect(planner.extractDirectory('file.ts')).toBe('.');
      expect(planner.extractDirectory('')).toBe('');
    });

    it('computeHotspotSpread returns 0 for empty input', () => {
      expect(planner.computeHotspotSpread([])).toBe(0);
    });

    it('computeHotspotSpread uses composite hotspot score, not raw complexity median', () => {
      const spread = planner.computeHotspotSpread([
        { path: 'src/hot/a.ts', complexity: 1, churnRate: 8, issueCount: 6 },
        { path: 'src/hot/b.ts', complexity: 1, churnRate: 8, issueCount: 6 },
        { path: 'src/complex/c.ts', complexity: 10, churnRate: 0, issueCount: 0 },
        { path: 'src/cold/d.ts', complexity: 1, churnRate: 0, issueCount: 0 },
      ]);

      expect(spread).toBeCloseTo(1 / 3, 5);
    });

    it('computeClusterDiversity returns 0 for empty input', () => {
      expect(planner.computeClusterDiversity([])).toBe(0);
    });

    it('groups subdomains by registrable domain cluster', () => {
      const ledger = planner.generateDomainLedger([
        { domain: 'news.bbc.co.uk', authority: 0.8 },
        { domain: 'sport.bbc.co.uk', authority: 0.7 },
        { domain: 'api.nytimes.com', authority: 0.9 },
      ]);

      expect(ledger.clusters.map((entry: any) => entry.cluster).sort()).toEqual([
        'bbc.co.uk',
        'nytimes.com',
      ]);
    });
  });
});
