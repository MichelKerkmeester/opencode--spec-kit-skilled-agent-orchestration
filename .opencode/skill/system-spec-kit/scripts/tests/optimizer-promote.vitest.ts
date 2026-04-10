import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const promote = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs',
)) as {
  PROMOTION_PREREQUISITES: readonly string[];
  PROMOTION_DECISIONS: Record<string, string>;
  checkPrerequisites: (context?: {
    replayFixturesExist?: boolean;
    behavioralSuitesExist?: boolean;
  }) => { allMet: boolean; results: Record<string, boolean>; missing: string[] };
  checkManifestBoundary: (
    candidate: Record<string, any>,
    manifest: { tunableFields?: Array<{ name: string }>; lockedFields?: Array<{ name: string }> },
  ) => { valid: boolean; violations: string[] };
  evaluateCandidate: (
    candidate: { config: Record<string, any>; score: Record<string, any> },
    baselineScore: Record<string, any>,
    options?: Record<string, any>,
  ) => {
    decision: string;
    improved: boolean;
    regressions: string[];
    improvements: string[];
    manifestCheck: object | null;
    prerequisiteCheck: object;
    advisoryOnly: boolean;
  };
  generatePromotionReport: (
    candidate: object,
    score: Record<string, any>,
    decision: string,
    options?: Record<string, any>,
  ) => Record<string, any>;
  savePromotionReport: (report: object, outputPath: string) => void;
};

const manifest = JSON.parse(
  fs.readFileSync(
    path.join(
      WORKSPACE_ROOT,
      '.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json',
    ),
    'utf8',
  ),
);

describe('Advisory Promotion Gate (T007)', () => {
  describe('checkPrerequisites', () => {
    it('should report all missing when no prerequisites exist', () => {
      const result = promote.checkPrerequisites();
      expect(result.allMet).toBe(false);
      expect(result.missing).toHaveLength(2);
      expect(result.missing).toContain('replayFixturesExist');
      expect(result.missing).toContain('behavioralSuitesExist');
    });

    it('should report partial missing', () => {
      const result = promote.checkPrerequisites({ replayFixturesExist: true });
      expect(result.allMet).toBe(false);
      expect(result.missing).toContain('behavioralSuitesExist');
      expect(result.results.replayFixturesExist).toBe(true);
    });

    it('should pass when all prerequisites exist', () => {
      const result = promote.checkPrerequisites({
        replayFixturesExist: true,
        behavioralSuitesExist: true,
      });
      expect(result.allMet).toBe(true);
      expect(result.missing).toHaveLength(0);
    });
  });

  describe('checkManifestBoundary', () => {
    it('should allow tunable fields', () => {
      const result = promote.checkManifestBoundary(
        { convergenceThreshold: 0.05 },
        manifest,
      );
      expect(result.valid).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should reject locked contract fields', () => {
      const result = promote.checkManifestBoundary(
        { stopReason: 'converged' },
        manifest,
      );
      expect(result.valid).toBe(false);
      expect(result.violations.some((v: string) => v.includes('locked'))).toBe(true);
    });

    it('should reject fields not in manifest', () => {
      const result = promote.checkManifestBoundary(
        { unknownField: 42 },
        manifest,
      );
      expect(result.valid).toBe(false);
      expect(result.violations.some((v: string) => v.includes('not listed as tunable'))).toBe(true);
    });

    it('should reject mixed tunable and locked fields', () => {
      const result = promote.checkManifestBoundary(
        { convergenceThreshold: 0.05, fileProtection: {} },
        manifest,
      );
      expect(result.valid).toBe(false);
    });
  });

  describe('evaluateCandidate', () => {
    const baselineScore = {
      composite: 0.6,
      perDimension: {
        convergenceEfficiency: { score: 0.5, weight: 0.3, weighted: 0.15, available: true },
        findingAccuracy: { score: 0.7, weight: 0.3, weighted: 0.21, available: true },
      },
    };

    it('should produce advisory-accept when candidate improves', () => {
      const candidate = {
        config: { convergenceThreshold: 0.05 },
        score: {
          composite: 0.8,
          perDimension: {
            convergenceEfficiency: { score: 0.7, weight: 0.3, weighted: 0.21, available: true },
            findingAccuracy: { score: 0.8, weight: 0.3, weighted: 0.24, available: true },
          },
        },
      };

      const result = promote.evaluateCandidate(candidate, baselineScore, {
        manifest,
      });

      expect(result.decision).toBe('advisory-accept');
      expect(result.improved).toBe(true);
      expect(result.advisoryOnly).toBe(true); // prerequisites not met
    });

    it('should produce advisory-reject when candidate regresses', () => {
      const candidate = {
        config: { convergenceThreshold: 0.05 },
        score: {
          composite: 0.4,
          perDimension: {
            convergenceEfficiency: { score: 0.3, weight: 0.3, weighted: 0.09, available: true },
            findingAccuracy: { score: 0.5, weight: 0.3, weighted: 0.15, available: true },
          },
        },
      };

      const result = promote.evaluateCandidate(candidate, baselineScore);
      expect(result.decision).toBe('advisory-reject');
      expect(result.improved).toBe(false);
    });

    it('should block promotion when candidate touches locked fields', () => {
      const candidate = {
        config: { stopReason: 'converged' },
        score: { composite: 0.9, perDimension: {} },
      };

      const result = promote.evaluateCandidate(candidate, baselineScore, {
        manifest,
      });

      expect(result.decision).toBe('blocked');
      expect(result.manifestCheck).toBeDefined();
    });

    it('should always be advisory-only when prerequisites are missing (REQ-006)', () => {
      const candidate = {
        config: { convergenceThreshold: 0.05 },
        score: {
          composite: 0.9,
          perDimension: {},
        },
      };

      const result = promote.evaluateCandidate(candidate, baselineScore, {
        prerequisites: {
          replayFixturesExist: false,
          behavioralSuitesExist: false,
        },
      });

      expect(result.advisoryOnly).toBe(true);
      expect(result.prerequisiteCheck).toBeDefined();
    });

    it('should still be advisory-only even with all prerequisites met (Phase 4a scope)', () => {
      const candidate = {
        config: { convergenceThreshold: 0.05 },
        score: {
          composite: 0.9,
          perDimension: {},
        },
      };

      // Even with prerequisites met, the decision is advisory-*
      const result = promote.evaluateCandidate(candidate, baselineScore, {
        prerequisites: {
          replayFixturesExist: true,
          behavioralSuitesExist: true,
        },
      });

      expect(result.decision).toMatch(/^advisory-/);
    });

    it('P1-2: advisoryOnly MUST be true even when all prerequisites are met', () => {
      const candidate = {
        config: { convergenceThreshold: 0.05 },
        score: {
          composite: 0.9,
          perDimension: {
            convergenceEfficiency: { score: 0.9, weight: 0.3, weighted: 0.27, available: true },
            findingAccuracy: { score: 0.9, weight: 0.3, weighted: 0.27, available: true },
          },
        },
      };

      const result = promote.evaluateCandidate(candidate, baselineScore, {
        manifest,
        prerequisites: {
          replayFixturesExist: true,
          behavioralSuitesExist: true,
        },
      });

      // This is the core P1-2 assertion: advisoryOnly must NEVER flip to false
      expect(result.advisoryOnly).toBe(true);
    });
  });

  describe('generatePromotionReport', () => {
    it('should generate a complete advisory report', () => {
      const report = promote.generatePromotionReport(
        { convergenceThreshold: 0.05 },
        { composite: 0.8, perDimension: {}, unavailableDimensions: [] },
        'advisory-accept',
        {
          improved: true,
          improvements: ['Composite improved'],
          regressions: [],
        },
      );

      expect(report.reportType).toBe('advisory-promotion');
      expect(report.advisoryOnly).toBe(true);
      expect(report.autoPromotionAllowed).toBe(false);
      expect(report.humanReviewRequired).toBe(true);
      expect(report.decision).toBe('advisory-accept');
      expect(report.candidate).toBeDefined();
      expect(report.evaluation).toBeDefined();
      expect(report.prerequisites).toBeDefined();
      expect(report.recommendation).toBeDefined();
      expect(report.nextSteps).toBeDefined();
      expect(report.generatedAt).toBeDefined();
    });

    it('should never set autoPromotionAllowed to true', () => {
      const report = promote.generatePromotionReport(
        { convergenceThreshold: 0.05 },
        { composite: 0.99, perDimension: {} },
        'advisory-accept',
      );

      expect(report.autoPromotionAllowed).toBe(false);
    });

    it('should include prerequisite gap in next steps when prerequisites are missing', () => {
      const report = promote.generatePromotionReport(
        { convergenceThreshold: 0.05 },
        { composite: 0.8, perDimension: {} },
        'advisory-accept',
        {
          prerequisiteCheck: {
            allMet: false,
            missing: ['behavioralSuitesExist'],
          },
        },
      );

      expect(
        report.nextSteps.some((s: string) => s.includes('prerequisite')),
      ).toBe(true);
    });
  });

  describe('P1-2: checkManifestBoundary range/type validation', () => {
    it('should reject values below manifest minimum', () => {
      const result = promote.checkManifestBoundary(
        { convergenceThreshold: 0.001 },
        manifest,
      );
      expect(result.valid).toBe(false);
      expect(result.violations.some((v: string) => v.includes('below manifest minimum'))).toBe(true);
    });

    it('should reject values above manifest maximum', () => {
      const result = promote.checkManifestBoundary(
        { convergenceThreshold: 0.99 },
        manifest,
      );
      expect(result.valid).toBe(false);
      expect(result.violations.some((v: string) => v.includes('above manifest maximum'))).toBe(true);
    });

    it('should reject non-integer for integer type fields', () => {
      const result = promote.checkManifestBoundary(
        { stuckThreshold: 2.5 },
        manifest,
      );
      expect(result.valid).toBe(false);
      expect(result.violations.some((v: string) => v.includes('integer'))).toBe(true);
    });

    it('should reject non-number for numeric fields', () => {
      const result = promote.checkManifestBoundary(
        { convergenceThreshold: 'not-a-number' },
        manifest,
      );
      expect(result.valid).toBe(false);
      expect(result.violations.some((v: string) => v.includes('must be a number'))).toBe(true);
    });

    it('should accept values within manifest range', () => {
      const result = promote.checkManifestBoundary(
        { convergenceThreshold: 0.10, stuckThreshold: 3 },
        manifest,
      );
      expect(result.valid).toBe(true);
      expect(result.violations).toHaveLength(0);
    });
  });

  describe('savePromotionReport', () => {
    it('should persist report to disk', () => {
      const report = promote.generatePromotionReport(
        { convergenceThreshold: 0.05 },
        { composite: 0.7, perDimension: {} },
        'advisory-reject',
      );

      const tmpPath = path.join(
        process.env.TMPDIR || '/tmp',
        `promotion-report-${Date.now()}.json`,
      );

      try {
        promote.savePromotionReport(report, tmpPath);
        expect(fs.existsSync(tmpPath)).toBe(true);

        const loaded = JSON.parse(fs.readFileSync(tmpPath, 'utf8'));
        expect(loaded.decision).toBe('advisory-reject');
        expect(loaded.advisoryOnly).toBe(true);
      } finally {
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
      }
    });
  });
});
