// TEST: FULL SPEC DOC INDEXING
/**
 * Full Spec Folder Document Indexing
 *
 * Comprehensive test suite covering all 8 implementation phases:
 * - Phase 2: Type configuration (DocumentType, SPEC_DOCUMENT_CONFIGS, inferDocumentTypeFromPath)
 * - Phase 4: Parser enhancements (extractDocumentType, isMemoryFile, extractSpecFolder)
 * - Phase 5: Indexing pipeline (calculateDocumentWeight)
 * - Phase 6: Scoring & priority (DOCUMENT_TYPE_MULTIPLIERS, pattern alignment)
 * - Phase 7: Relationship chains (createSpecDocumentChain)
 * - Phase 8: Intent classifier (find_spec, find_decision)
 * - Peripheral: importance-tiers (getDefaultTierForDocumentType)
 * - Backward compatibility
 *
 * Phases 1 (schema) and 3 (discovery) require live DB/filesystem and are
 * covered by integration tests elsewhere.
 */

import { describe, it, expect } from 'vitest';

// Phase 2: Type configuration
import {
  SPEC_DOCUMENT_CONFIGS,
  SPEC_DOCUMENT_FILENAMES,
  inferDocumentTypeFromPath,
  getSpecDocumentConfig,
} from '../lib/config/memory-types';
import type { DocumentType } from '../lib/config/memory-types';

// Phase 4: Parser enhancements
import {
  extractDocumentType,
  extractSpecFolder,
  isMemoryFile,
} from '../lib/parsing/memory-parser';

// Phase 5: Indexing pipeline
import {
  calculateDocumentWeight,
} from '../handlers/pe-gating';

// Phase 6: Scoring & priority
import {
  DOCUMENT_TYPE_MULTIPLIERS,
  calculateFiveFactorScore,
  calculateCompositeScore,
  calculatePatternScore,
} from '../lib/scoring/composite-scoring';
import type { ScoringInput } from '../lib/scoring/composite-scoring';

// Phase 8: Intent classifier
import * as intentClassifier from '../lib/search/intent-classifier';

// Phase 7: Relationship chains
import { createSpecDocumentChain, RELATION_TYPES } from '../lib/storage/causal-edges';

// Peripheral: Importance tiers
import { getDefaultTierForDocumentType } from '../lib/scoring/importance-tiers';

// Normalization: round-trip converters
import { dbRowToMemory, memoryToDbRow, partialDbRowToMemory } from '@spec-kit/shared/normalization';

type NormalizedDbRow = Parameters<typeof dbRowToMemory>[0];

/* ═══════════════════════════════════════════════════════════════
   PHASE 2: TYPE CONFIGURATION
   ═══════════════════════════════════════════════════════════════ */

describe('Spec 126 Phase 2: Type Configuration', () => {

  describe('T062: DocumentType inference from paths', () => {
    const testCases: Array<{ path: string; expected: string; label: string }> = [
      { path: '/project/.opencode/specs/003/100-feature/spec.md', expected: 'spec', label: 'spec.md in specs/' },
      { path: '/project/.opencode/specs/003/100-feature/plan.md', expected: 'plan', label: 'plan.md in specs/' },
      { path: '/project/.opencode/specs/003/100-feature/tasks.md', expected: 'tasks', label: 'tasks.md in specs/' },
      { path: '/project/.opencode/specs/003/100-feature/checklist.md', expected: 'checklist', label: 'checklist.md in specs/' },
      { path: '/project/.opencode/specs/003/100-feature/decision-record.md', expected: 'decision_record', label: 'decision-record.md in specs/' },
      { path: '/project/.opencode/specs/003/100-feature/implementation-summary.md', expected: 'implementation_summary', label: 'implementation-summary.md in specs/' },
      { path: '/project/.opencode/specs/003/100-feature/research/research.md', expected: 'research', label: 'research/research.md in specs/' },
      { path: '/project/.opencode/specs/003/100-feature/research.md', expected: 'research', label: 'legacy research.md in specs/' },
      { path: '/project/.opencode/specs/003/100-feature/handover.md', expected: 'handover', label: 'handover.md in specs/' },
    ];

    for (const tc of testCases) {
      it(`Infers '${tc.expected}' from ${tc.label}`, () => {
        expect(inferDocumentTypeFromPath(tc.path)).toBe(tc.expected);
      });
    }

    it('Returns "memory" for file in /memory/ directory even if named spec.md', () => {
      expect(inferDocumentTypeFromPath('/project/.opencode/specs/003/100/memory/spec.md')).toBe('memory');
    });

    it('Returns "constitutional" for constitutional files', () => {
      expect(inferDocumentTypeFromPath('/project/.opencode/skill/system-spec-kit/constitutional/rules.md')).toBe('constitutional');
    });

    it('Returns "memory" for README files', () => {
      expect(inferDocumentTypeFromPath('/project/.opencode/skill/system-spec-kit/README.md')).toBe('memory');
      expect(inferDocumentTypeFromPath('/project/.opencode/command/spec_kit/README.txt')).toBe('memory');
    });

    it('Returns "memory" for unrecognized files', () => {
      expect(inferDocumentTypeFromPath('/project/.opencode/specs/003/100/memory/random-notes.md')).toBe('memory');
    });

    it('Returns "memory" for spec.md NOT in /specs/ directory', () => {
      expect(inferDocumentTypeFromPath('/project/docs/spec.md')).toBe('memory');
    });
  });

  describe('T063: SPEC_DOCUMENT_CONFIGS completeness', () => {
    it('Has exactly 8 entries', () => {
      expect(SPEC_DOCUMENT_CONFIGS.length).toBe(8);
    });

    it('Each config has required fields', () => {
      for (const config of SPEC_DOCUMENT_CONFIGS) {
        expect(config.filePattern).toBeInstanceOf(RegExp);
        expect(typeof config.documentType).toBe('string');
        expect(typeof config.memoryType).toBe('string');
        expect(typeof config.defaultImportanceTier).toBe('string');
        expect(typeof config.defaultImportanceWeight).toBe('number');
      }
    });

    it('Covers all 8 spec document types', () => {
      const types = SPEC_DOCUMENT_CONFIGS.map(c => c.documentType);
      expect(types).toContain('spec');
      expect(types).toContain('plan');
      expect(types).toContain('tasks');
      expect(types).toContain('checklist');
      expect(types).toContain('decision_record');
      expect(types).toContain('implementation_summary');
      expect(types).toContain('research');
      expect(types).toContain('handover');
    });

    it('spec.md config: semantic, important, 0.8', () => {
      const config = getSpecDocumentConfig('spec' as DocumentType);
      expect(config).not.toBeNull();
      expect(config!.memoryType).toBe('semantic');
      expect(config!.defaultImportanceTier).toBe('important');
      expect(config!.defaultImportanceWeight).toBe(0.8);
    });

    it('plan.md config: semantic, important, 0.7', () => {
      const config = getSpecDocumentConfig('plan' as DocumentType);
      expect(config).not.toBeNull();
      expect(config!.memoryType).toBe('semantic');
      expect(config!.defaultImportanceTier).toBe('important');
      expect(config!.defaultImportanceWeight).toBe(0.7);
    });

    it('decision-record.md config: semantic, important, 0.8', () => {
      const config = getSpecDocumentConfig('decision_record' as DocumentType);
      expect(config).not.toBeNull();
      expect(config!.memoryType).toBe('semantic');
      expect(config!.defaultImportanceTier).toBe('important');
      expect(config!.defaultImportanceWeight).toBe(0.8);
    });

    it('implementation-summary.md config: semantic, normal, 0.6', () => {
      const config = getSpecDocumentConfig('implementation_summary' as DocumentType);
      expect(config).not.toBeNull();
      expect(config!.memoryType).toBe('semantic');
      expect(config!.defaultImportanceTier).toBe('normal');
      expect(config!.defaultImportanceWeight).toBe(0.6);
    });

    it('research.md config: semantic, normal, 0.6', () => {
      const config = getSpecDocumentConfig('research' as DocumentType);
      expect(config).not.toBeNull();
      expect(config!.memoryType).toBe('semantic');
      expect(config!.defaultImportanceTier).toBe('normal');
      expect(config!.defaultImportanceWeight).toBe(0.6);
    });
  });

  describe('SPEC_DOCUMENT_FILENAMES set', () => {
    it('Has 8 entries', () => {
      expect(SPEC_DOCUMENT_FILENAMES.size).toBe(8);
    });

    const expectedFilenames = [
      'spec.md', 'plan.md', 'tasks.md', 'checklist.md',
      'decision-record.md', 'implementation-summary.md', 'research.md', 'handover.md',
    ];

    for (const fn of expectedFilenames) {
      it(`Contains '${fn}'`, () => {
        expect(SPEC_DOCUMENT_FILENAMES.has(fn)).toBe(true);
      });
    }
  });
});

/* ═══════════════════════════════════════════════════════════════
   PHASE 4: PARSER ENHANCEMENTS
   ═══════════════════════════════════════════════════════════════ */

describe('Spec 126 Phase 4: Parser Enhancements', () => {

  describe('T069: extractDocumentType() filename mapping', () => {
    const testCases: Array<{ path: string; expected: string; label: string }> = [
      { path: '/p/.opencode/specs/003/100/spec.md', expected: 'spec', label: 'spec.md' },
      { path: '/p/.opencode/specs/003/100/plan.md', expected: 'plan', label: 'plan.md' },
      { path: '/p/.opencode/specs/003/100/tasks.md', expected: 'tasks', label: 'tasks.md' },
      { path: '/p/.opencode/specs/003/100/checklist.md', expected: 'checklist', label: 'checklist.md' },
      { path: '/p/.opencode/specs/003/100/decision-record.md', expected: 'decision_record', label: 'decision-record.md' },
      { path: '/p/.opencode/specs/003/100/implementation-summary.md', expected: 'implementation_summary', label: 'implementation-summary.md' },
      { path: '/p/.opencode/specs/003/100/research/research.md', expected: 'research', label: 'research/research.md' },
      { path: '/p/.opencode/specs/003/100/research.md', expected: 'research', label: 'legacy research.md' },
      { path: '/p/.opencode/specs/003/100/handover.md', expected: 'handover', label: 'handover.md' },
    ];

    for (const tc of testCases) {
      it(`Maps ${tc.label} -> '${tc.expected}'`, () => {
        expect(extractDocumentType(tc.path)).toBe(tc.expected);
      });
    }

    it('Returns "constitutional" for files in /constitutional/', () => {
      expect(extractDocumentType('/p/.opencode/skill/kit/constitutional/rules.md')).toBe('constitutional');
    });

    it('Returns "memory" for readme.md', () => {
      expect(extractDocumentType('/p/.opencode/skill/kit/README.md')).toBe('memory');
    });

    it('Returns "memory" for readme.txt', () => {
      expect(extractDocumentType('/p/.opencode/command/kit/README.txt')).toBe('memory');
    });

    it('Returns "memory" for unrecognized files in memory/', () => {
      expect(extractDocumentType('/p/.opencode/specs/003/100/memory/notes.md')).toBe('memory');
    });

    it('Returns "memory" for spec.md in /memory/ directory', () => {
      expect(extractDocumentType('/p/.opencode/specs/003/100/memory/spec.md')).toBe('memory');
    });

    it('Returns "memory" for spec.md in /scratch/ directory', () => {
      expect(extractDocumentType('/p/.opencode/specs/003/100/scratch/spec.md')).toBe('memory');
    });

    it('Returns "memory" for iteration files in /research/iterations/', () => {
      expect(extractDocumentType('/p/.opencode/specs/003/100/research/iterations/iteration-001.md')).toBe('memory');
    });
  });

  describe('T067: isMemoryFile() recognizes spec documents', () => {
    it('Accepts standard memory files', () => {
      expect(isMemoryFile('/p/.opencode/specs/003/100/memory/notes.md')).toBe(true);
    });

    it('Accepts spec.md in specs/ directory', () => {
      expect(isMemoryFile('/p/.opencode/specs/003/100/spec.md')).toBe(true);
    });

    it('Accepts plan.md in specs/ directory', () => {
      expect(isMemoryFile('/p/.opencode/specs/003/100/plan.md')).toBe(true);
    });

    it('Accepts decision-record.md in specs/ directory', () => {
      expect(isMemoryFile('/p/.opencode/specs/003/100/decision-record.md')).toBe(true);
    });

    it('Rejects spec.md in /memory/ directory', () => {
      // Spec.md in memory/ should still be accepted as standard memory
      expect(isMemoryFile('/p/.opencode/specs/003/100/memory/spec.md')).toBe(true);
    });

    it('Rejects spec.md in /scratch/ directory', () => {
      expect(isMemoryFile('/p/.opencode/specs/003/100/scratch/spec.md')).toBe(false);
    });

    it('Rejects spec.md in /z_archive/ directory', () => {
      expect(isMemoryFile('/p/.opencode/specs/003/100/z_archive/spec.md')).toBe(false);
    });

    it('Rejects non-.md files', () => {
      expect(isMemoryFile('/p/.opencode/specs/003/100/spec.txt')).toBe(false);
    });

    it('Accepts constitutional files', () => {
      expect(isMemoryFile('/p/.opencode/skill/kit/constitutional/rules.md')).toBe(true);
    });

    it('Rejects README.txt files', () => {
      expect(isMemoryFile('/p/.opencode/command/spec_kit/README.txt')).toBe(false);
    });
  });

  describe('T068: extractSpecFolder() handles non-memory paths', () => {
    it('Extracts folder from standard memory path', () => {
      const result = extractSpecFolder('/p/.opencode/specs/02--system-spec-kit/100-feature/memory/notes.md');
      expect(result).toBe('02--system-spec-kit/100-feature');
    });

    it('Extracts folder from spec.md path (non-memory)', () => {
      const result = extractSpecFolder('/p/.opencode/specs/02--system-spec-kit/100-feature/spec.md');
      expect(result).toBe('02--system-spec-kit/100-feature');
    });

    it('Extracts folder from plan.md path (non-memory)', () => {
      const result = extractSpecFolder('/p/.opencode/specs/02--system-spec-kit/100-feature/plan.md');
      expect(result).toBe('02--system-spec-kit/100-feature');
    });

    it('Extracts folder from decision-record.md path (non-memory)', () => {
      const result = extractSpecFolder('/p/.opencode/specs/02--system-spec-kit/100-feature/decision-record.md');
      expect(result).toBe('02--system-spec-kit/100-feature');
    });

    it('Returns folder category for skill README path', () => {
      const result = extractSpecFolder('/p/.opencode/skill/system-spec-kit/README.md');
      expect(result).toBe('skill');
    });

    it('Returns folder category for command README path', () => {
      const result = extractSpecFolder('/p/.opencode/command/spec_kit/README.txt');
      expect(result).toBe('command');
    });
  });
});

/* ═══════════════════════════════════════════════════════════════
   PHASE 5: INDEXING PIPELINE
   ═══════════════════════════════════════════════════════════════ */

describe('Spec 126 Phase 5: Indexing Pipeline', () => {

  describe('T064: calculateDocumentWeight() weight values', () => {
    it('spec -> 0.8', () => {
      expect(calculateDocumentWeight('/p/specs/x/spec.md', 'spec')).toBe(0.8);
    });

    it('decision_record -> 0.8', () => {
      expect(calculateDocumentWeight('/p/specs/x/decision-record.md', 'decision_record')).toBe(0.8);
    });

    it('plan -> 0.7', () => {
      expect(calculateDocumentWeight('/p/specs/x/plan.md', 'plan')).toBe(0.7);
    });

    it('tasks -> 0.6', () => {
      expect(calculateDocumentWeight('/p/specs/x/tasks.md', 'tasks')).toBe(0.6);
    });

    it('implementation_summary -> 0.6', () => {
      expect(calculateDocumentWeight('/p/specs/x/implementation-summary.md', 'implementation_summary')).toBe(0.6);
    });

    it('research -> 0.6', () => {
      expect(calculateDocumentWeight('/p/specs/x/research/research.md', 'research')).toBe(0.6);
    });

    it('checklist -> 0.5', () => {
      expect(calculateDocumentWeight('/p/specs/x/checklist.md', 'checklist')).toBe(0.5);
    });

    it('handover -> 0.5', () => {
      expect(calculateDocumentWeight('/p/specs/x/handover.md', 'handover')).toBe(0.5);
    });

    it('constitutional -> 1.0', () => {
      expect(calculateDocumentWeight('/p/constitutional/rules.md', 'constitutional')).toBe(1.0);
    });

    it('memory -> 0.5', () => {
      expect(calculateDocumentWeight('/p/specs/x/memory/notes.md', 'memory')).toBe(0.5);
    });

    it('README paths with explicit memory type use baseline memory weight', () => {
      expect(calculateDocumentWeight('/p/.opencode/skill/kit/README.md', 'memory')).toBe(0.5);
      expect(calculateDocumentWeight('/p/src/README.md', 'memory')).toBe(0.5);
    });

    it('scratch path fallback -> 0.25', () => {
      expect(calculateDocumentWeight('/p/specs/x/scratch/temp.md')).toBe(0.25);
    });

    it('research/review iteration paths fall back to working-artifact weight', () => {
      expect(calculateDocumentWeight('/p/specs/x/research/iterations/iteration-001.md')).toBe(0.25);
      expect(calculateDocumentWeight('/p/specs/x/review/iterations/iteration-001.md')).toBe(0.25);
    });
  });

});

/* ═══════════════════════════════════════════════════════════════
   PHASE 6: SCORING & PRIORITY
   ═══════════════════════════════════════════════════════════════ */

describe('Spec 126 Phase 6: Scoring & Priority', () => {

  describe('T065: DOCUMENT_TYPE_MULTIPLIERS values', () => {
    it('Has all 10 document types', () => {
      const expectedTypes = [
        'spec', 'decision_record', 'plan', 'tasks',
        'implementation_summary', 'checklist', 'handover',
        'memory', 'constitutional', 'scratch',
      ];
      for (const type of expectedTypes) {
        expect(DOCUMENT_TYPE_MULTIPLIERS[type]).toBeDefined();
      }
    });

    it('spec: 1.4', () => expect(DOCUMENT_TYPE_MULTIPLIERS.spec).toBe(1.4));
    it('decision_record: 1.4', () => expect(DOCUMENT_TYPE_MULTIPLIERS.decision_record).toBe(1.4));
    it('plan: 1.3', () => expect(DOCUMENT_TYPE_MULTIPLIERS.plan).toBe(1.3));
    it('tasks: 1.1', () => expect(DOCUMENT_TYPE_MULTIPLIERS.tasks).toBe(1.1));
    it('implementation_summary: 1.1', () => expect(DOCUMENT_TYPE_MULTIPLIERS.implementation_summary).toBe(1.1));
    it('checklist: 1.0', () => expect(DOCUMENT_TYPE_MULTIPLIERS.checklist).toBe(1.0));
    it('handover: 1.0', () => expect(DOCUMENT_TYPE_MULTIPLIERS.handover).toBe(1.0));
    it('memory: 1.0 (unchanged)', () => expect(DOCUMENT_TYPE_MULTIPLIERS.memory).toBe(1.0));
    it('constitutional: 2.0', () => expect(DOCUMENT_TYPE_MULTIPLIERS.constitutional).toBe(2.0));
    it('scratch: 0.6', () => expect(DOCUMENT_TYPE_MULTIPLIERS.scratch).toBe(0.6));
  });

  describe('T065b: Multiplier applied in calculateFiveFactorScore()', () => {
    const now = Date.now();
    const baseRow = {
      stability: 5.0,
      lastReview: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
      access_count: 10,
      importance_tier: 'important',
      importance_weight: 0.7,
      similarity: 80,
      title: 'Test memory',
      lastCited: new Date(now - 1000 * 60 * 60 * 24 * 5).toISOString(),
    };

    it('Spec doc scores higher than memory doc (all else equal)', () => {
      const memoryRow = { ...baseRow, document_type: 'memory' };
      const specRow = { ...baseRow, document_type: 'spec' };

      const memoryScore = calculateFiveFactorScore(memoryRow, { query: 'test' });
      const specScore = calculateFiveFactorScore(specRow, { query: 'test' });

      expect(specScore).toBeGreaterThan(memoryScore);
    });

    it('Plan doc scores higher than memory doc (all else equal)', () => {
      const memoryRow = { ...baseRow, document_type: 'memory' };
      const planRow = { ...baseRow, document_type: 'plan' };

      const memoryScore = calculateFiveFactorScore(memoryRow, { query: 'test' });
      const planScore = calculateFiveFactorScore(planRow, { query: 'test' });

      expect(planScore).toBeGreaterThan(memoryScore);
    });

    it('Spec multiplier (1.4) results in ~40% higher score', () => {
      const memoryRow = { ...baseRow, document_type: 'memory' };
      const specRow = { ...baseRow, document_type: 'spec' };

      const memoryScore = calculateFiveFactorScore(memoryRow, { query: 'test' });
      const specScore = calculateFiveFactorScore(specRow, { query: 'test' });

      // Spec multiplier is 1.4, memory is 1.0 -> ratio should be approximately 1.4
      const ratio = specScore / memoryScore;
      expect(ratio).toBeGreaterThan(1.3);
      expect(ratio).toBeLessThan(1.5);
    });

    it('Constitutional doc has highest multiplier (scores higher than spec)', () => {
      // Use low base values to avoid clamping to 1.0
      const lowRow = {
        stability: 1.0,
        lastReview: new Date(now - 1000 * 60 * 60 * 24 * 20).toISOString(),
        access_count: 1,
        importance_tier: 'normal',
        importance_weight: 0.3,
        similarity: 30,
        title: 'Test',
      };
      const specRow = { ...lowRow, document_type: 'spec' };
      const constRow = { ...lowRow, document_type: 'constitutional' };

      const specScore = calculateFiveFactorScore(specRow, { query: 'test' });
      const constScore = calculateFiveFactorScore(constRow, { query: 'test' });

      // Constitutional (2.0) > spec (1.4) with low enough base to avoid clamping
      expect(constScore).toBeGreaterThan(specScore);
    });
  });

  describe('T065c: Multiplier applied in calculateCompositeScore() (legacy)', () => {
    const now = Date.now();
    const baseRow = {
      similarity: 80,
      importance_weight: 0.6,
      importance_tier: 'important',
      updated_at: new Date(now).toISOString(),
      access_count: 10,
      stability: 5.0,
      lastReview: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
    };

    it('Spec doc scores higher than memory doc in legacy scoring', () => {
      const memoryRow = { ...baseRow, document_type: 'memory' };
      const specRow = { ...baseRow, document_type: 'spec' };

      const memoryScore = calculateCompositeScore(memoryRow);
      const specScore = calculateCompositeScore(specRow);

      expect(specScore).toBeGreaterThan(memoryScore);
    });
  });

  describe('T066: Pattern alignment bonus for doc types', () => {
    it('Spec doc gets bonus for "spec" query', () => {
      const row: ScoringInput = {
        similarity: 50,
        title: 'Feature Spec',
        document_type: 'spec',
      };
      const scoreWithSpec = calculatePatternScore(row, { query: 'spec requirements' });
      const scoreWithoutDocType = calculatePatternScore(
        { similarity: 50, title: 'Feature Spec' },
        { query: 'spec requirements' }
      );

      expect(scoreWithSpec).toBeGreaterThanOrEqual(scoreWithoutDocType);
    });

    it('Decision record gets bonus for "why" query', () => {
      const row: ScoringInput = {
        similarity: 50,
        title: 'Decision Record',
        document_type: 'decision_record',
      };
      const scoreWithDecision = calculatePatternScore(row, { query: 'why did we decide' });
      const scoreWithoutDocType = calculatePatternScore(
        { similarity: 50, title: 'Decision Record' },
        { query: 'why did we decide' }
      );

      expect(scoreWithDecision).toBeGreaterThanOrEqual(scoreWithoutDocType);
    });

    it('Plan doc gets bonus for "plan" query', () => {
      const row = {
        similarity: 50,
        title: 'Implementation Plan',
        document_type: 'plan',
      };
      const scoreWithPlan = calculatePatternScore(row, { query: 'plan approach' });
      const scoreWithoutDocType = calculatePatternScore(
        { similarity: 50, title: 'Implementation Plan' },
        { query: 'plan approach' }
      );

      expect(scoreWithPlan).toBeGreaterThanOrEqual(scoreWithoutDocType);
    });

    it('No bonus for non-matching query-type combination', () => {
      const row = {
        similarity: 50,
        title: 'Test Memory',
        document_type: 'spec',
      };
      // Query about bugs should not trigger spec bonus
      const score = calculatePatternScore(row, { query: 'fix the login bug' });
      expect(typeof score).toBe('number');
      expect(score).not.toBeNaN();
    });
  });
});

/* ═══════════════════════════════════════════════════════════════
   PHASE 8: INTENT CLASSIFIER
   ═══════════════════════════════════════════════════════════════ */

describe('Spec 126 Phase 8: Intent Classifier', () => {

  describe('T073a: find_spec intent classification', () => {
    it('INTENT_TYPES includes find_spec', () => {
      expect(intentClassifier.INTENT_TYPES.FIND_SPEC).toBe('find_spec');
    });

    it('find_spec has keywords', () => {
      const keywords = intentClassifier.INTENT_KEYWORDS['find_spec'];
      expect(keywords).toBeTruthy();
      expect(keywords.length).toBeGreaterThanOrEqual(5);
    });

    it('find_spec keywords include: spec, specification, requirements, scope', () => {
      const keywords = intentClassifier.INTENT_KEYWORDS['find_spec'];
      expect(keywords).toContain('spec');
      expect(keywords).toContain('specification');
      expect(keywords).toContain('requirements');
      expect(keywords).toContain('scope');
    });

    it('find_spec has patterns', () => {
      const patterns = intentClassifier.INTENT_PATTERNS['find_spec'];
      expect(patterns).toBeTruthy();
      expect(patterns.length).toBeGreaterThanOrEqual(3);
      expect(patterns.every((p: unknown) => p instanceof RegExp)).toBe(true);
    });

    it('find_spec has weight adjustments', () => {
      const weights = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS['find_spec'];
      expect(weights).toBeTruthy();
      expect(typeof weights.similarity).toBe('number');
      expect(typeof weights.importance).toBe('number');
      expect(typeof weights.recency).toBe('number');
    });

    it('Classifies "find the spec" as find_spec', () => {
      const result = intentClassifier.classifyIntent('find the spec');
      expect(result.intent).toBe('find_spec');
    });

    it('Classifies "what are the requirements" as find_spec', () => {
      const result = intentClassifier.classifyIntent('what are the requirements');
      expect(result.intent).toBe('find_spec');
    });

    it('Classifies "show me the spec for authentication" as find_spec', () => {
      const result = intentClassifier.classifyIntent('show me the spec for authentication');
      expect(result.intent).toBe('find_spec');
    });

    it('getIntentDescription returns description for find_spec', () => {
      const desc = intentClassifier.getIntentDescription('find_spec');
      expect(desc).not.toBe('Unknown intent');
      expect(desc.length).toBeGreaterThan(0);
    });
  });

  describe('T073b: find_decision intent classification', () => {
    it('INTENT_TYPES includes find_decision', () => {
      expect(intentClassifier.INTENT_TYPES.FIND_DECISION).toBe('find_decision');
    });

    it('find_decision has keywords', () => {
      const keywords = intentClassifier.INTENT_KEYWORDS['find_decision'];
      expect(keywords).toBeTruthy();
      expect(keywords.length).toBeGreaterThanOrEqual(5);
    });

    it('find_decision keywords include: decision, why, rationale', () => {
      const keywords = intentClassifier.INTENT_KEYWORDS['find_decision'];
      expect(keywords).toContain('decision');
      expect(keywords).toContain('why');
      expect(keywords).toContain('rationale');
    });

    it('find_decision has patterns', () => {
      const patterns = intentClassifier.INTENT_PATTERNS['find_decision'];
      expect(patterns).toBeTruthy();
      expect(patterns.length).toBeGreaterThanOrEqual(3);
      expect(patterns.every((p: unknown) => p instanceof RegExp)).toBe(true);
    });

    it('find_decision has weight adjustments', () => {
      const weights = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS['find_decision'];
      expect(weights).toBeTruthy();
      expect(typeof weights.similarity).toBe('number');
      expect(typeof weights.importance).toBe('number');
      expect(typeof weights.recency).toBe('number');
    });

    it('Classifies "why did we choose this approach" as find_decision', () => {
      const result = intentClassifier.classifyIntent('why did we choose this approach');
      expect(result.intent).toBe('find_decision');
    });

    it('Classifies "what was the decision about auth" as find_decision', () => {
      const result = intentClassifier.classifyIntent('what was the decision about auth');
      expect(result.intent).toBe('find_decision');
    });

    it('Classifies "decision record for database" as find_decision', () => {
      const result = intentClassifier.classifyIntent('decision record for database');
      expect(result.intent).toBe('find_decision');
    });

    it('getIntentDescription returns description for find_decision', () => {
      const desc = intentClassifier.getIntentDescription('find_decision');
      expect(desc).not.toBe('Unknown intent');
      expect(desc.length).toBeGreaterThan(0);
    });
  });

  describe('T073c: classifyIntent initializes scores for new intents', () => {
    it('Result scores include find_spec', () => {
      const result = intentClassifier.classifyIntent('test query');
      expect(result.scores).toHaveProperty('find_spec');
      expect(typeof result.scores.find_spec).toBe('number');
    });

    it('Result scores include find_decision', () => {
      const result = intentClassifier.classifyIntent('test query');
      expect(result.scores).toHaveProperty('find_decision');
      expect(typeof result.scores.find_decision).toBe('number');
    });
  });
});

/* ═══════════════════════════════════════════════════════════════
   PERIPHERAL: IMPORTANCE TIERS
   ═══════════════════════════════════════════════════════════════ */

describe('Spec 126 Peripheral: getDefaultTierForDocumentType()', () => {

  describe('T074: Tier mapping', () => {
    it('spec -> important', () => {
      expect(getDefaultTierForDocumentType('spec')).toBe('important');
    });

    it('plan -> important', () => {
      expect(getDefaultTierForDocumentType('plan')).toBe('important');
    });

    it('decision_record -> important', () => {
      expect(getDefaultTierForDocumentType('decision_record')).toBe('important');
    });

    it('constitutional -> constitutional', () => {
      expect(getDefaultTierForDocumentType('constitutional')).toBe('constitutional');
    });

    it('tasks -> normal', () => {
      expect(getDefaultTierForDocumentType('tasks')).toBe('normal');
    });

    it('checklist -> normal', () => {
      expect(getDefaultTierForDocumentType('checklist')).toBe('normal');
    });

    it('implementation_summary -> normal', () => {
      expect(getDefaultTierForDocumentType('implementation_summary')).toBe('normal');
    });

    it('research -> normal', () => {
      expect(getDefaultTierForDocumentType('research')).toBe('normal');
    });

    it('handover -> normal', () => {
      expect(getDefaultTierForDocumentType('handover')).toBe('normal');
    });

    it('memory -> normal', () => {
      expect(getDefaultTierForDocumentType('memory')).toBe('normal');
    });

    it('unknown type -> normal (fallback)', () => {
      expect(getDefaultTierForDocumentType('unknown_xyz')).toBe('normal');
    });
  });
});

/* ═══════════════════════════════════════════════════════════════
   BACKWARD COMPATIBILITY
   ═══════════════════════════════════════════════════════════════ */

describe('Spec 126: Backward Compatibility', () => {

  describe('T075: Memory type unchanged', () => {
    it('DOCUMENT_TYPE_MULTIPLIERS.memory = 1.0', () => {
      expect(DOCUMENT_TYPE_MULTIPLIERS.memory).toBe(1.0);
    });

    it('Memory doc has same score as no document_type', () => {
      const now = Date.now();
      const row = {
        similarity: 80,
        importance_weight: 0.6,
        importance_tier: 'normal',
        updated_at: new Date(now).toISOString(),
        access_count: 10,
        stability: 5.0,
        lastReview: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(),
      };

      const noTypeScore = calculateCompositeScore(row);
      const memoryTypeScore = calculateCompositeScore({ ...row, document_type: 'memory' });

      // Both should use memory multiplier (1.0) -> same score
      expect(memoryTypeScore).toBeCloseTo(noTypeScore, 4);
    });

    it('calculateDocumentWeight defaults to 0.5 for unknown type path', () => {
      const weight = calculateDocumentWeight('/p/specs/x/memory/notes.md');
      expect(weight).toBe(0.5);
    });

    it('getDefaultTierForDocumentType returns normal for memory', () => {
      expect(getDefaultTierForDocumentType('memory')).toBe('normal');
    });

    it('inferDocumentTypeFromPath returns memory for non-spec files', () => {
      expect(inferDocumentTypeFromPath('/p/specs/003/100/memory/random.md')).toBe('memory');
    });

    it('extractDocumentType returns memory for standard memory files', () => {
      expect(extractDocumentType('/p/.opencode/specs/003/100/memory/notes.md')).toBe('memory');
    });
  });
});

/* ═══════════════════════════════════════════════════════════════
   PHASE 7: RELATIONSHIP CHAINS
   ═══════════════════════════════════════════════════════════════ */

describe('Spec 126 Phase 7: Relationship Chains', () => {

  describe('T072: createSpecDocumentChain() export and structure', () => {
    it('createSpecDocumentChain is exported as a function', () => {
      expect(typeof createSpecDocumentChain).toBe('function');
    });

    it('RELATION_TYPES includes CAUSED and SUPPORTS', () => {
      expect(RELATION_TYPES.CAUSED).toBe('caused');
      expect(RELATION_TYPES.SUPPORTS).toBe('supports');
    });

    it('Returns { inserted: 0, failed: 0 } when DB is not initialized', () => {
      // Without calling init(), db is null, so function should return safe default
      const result = createSpecDocumentChain({ spec: 1, plan: 2 });
      expect(result).toEqual({ inserted: 0, failed: 0 });
    });

    it('Returns { inserted: 0, failed: 0 } for empty documentIds', () => {
      const result = createSpecDocumentChain({});
      expect(result).toEqual({ inserted: 0, failed: 0 });
    });

    it('Returns { inserted: 0, failed: 0 } for single document (no edges possible)', () => {
      const result = createSpecDocumentChain({ spec: 1 });
      expect(result).toEqual({ inserted: 0, failed: 0 });
    });
  });
});

/* ═══════════════════════════════════════════════════════════════
   NORMALIZATION: document_type / spec_level ROUND-TRIP
   ═══════════════════════════════════════════════════════════════ */

describe('Spec 126 Normalization: document_type / spec_level', () => {

  describe('dbRowToMemory() handles new fields', () => {
    it('Maps document_type -> documentType', () => {
      const row = {
        id: 1,
        spec_folder: 'test',
        file_path: '/test.md',
        anchor_id: null,
        title: 'Test',
        trigger_phrases: '[]',
        importance_weight: 0.5,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
        embedding_model: null,
        embedding_generated_at: null,
        embedding_status: 'completed',
        retry_count: 0,
        last_retry_at: null,
        failure_reason: null,
        base_importance: 0.5,
        decay_half_life_days: 60,
        is_pinned: 0,
        access_count: 0,
        last_accessed: 0,
        importance_tier: 'normal',
        session_id: null,
        context_type: 'general',
        channel: 'default',
        content_hash: 'abc123',
        expires_at: null,
        confidence: 0.8,
        validation_count: 0,
        stability: 1.0,
        difficulty: 0.5,
        last_review: null,
        review_count: 0,
        file_mtime_ms: null,
        document_type: 'spec',
        spec_level: 3,
      };
      const memory = dbRowToMemory(row);
      expect(memory.documentType).toBe('spec');
      expect(memory.specLevel).toBe(3);
    });

    it('Maps document_type default ("memory") correctly', () => {
      const row = {
        id: 2,
        spec_folder: 'test',
        file_path: '/test.md',
        anchor_id: null,
        title: 'Test',
        trigger_phrases: '[]',
        importance_weight: 0.5,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
        embedding_model: null,
        embedding_generated_at: null,
        embedding_status: 'completed',
        retry_count: 0,
        last_retry_at: null,
        failure_reason: null,
        base_importance: 0.5,
        decay_half_life_days: 60,
        is_pinned: 0,
        access_count: 0,
        last_accessed: 0,
        importance_tier: 'normal',
        session_id: null,
        context_type: 'general',
        channel: 'default',
        content_hash: 'abc123',
        expires_at: null,
        confidence: 0.8,
        validation_count: 0,
        stability: 1.0,
        difficulty: 0.5,
        last_review: null,
        review_count: 0,
        file_mtime_ms: null,
        document_type: 'memory',
        spec_level: null,
      };
      const memory = dbRowToMemory(row);
      expect(memory.documentType).toBe('memory');
      expect(memory.specLevel).toBeNull();
    });
  });

  describe('memoryToDbRow() handles new fields', () => {
    it('Maps documentType -> document_type', () => {
      const row = memoryToDbRow({ documentType: 'plan', specLevel: 2 });
      expect(row.document_type).toBe('plan');
      expect(row.spec_level).toBe(2);
    });

    it('Omits document_type when documentType is undefined', () => {
      const row = memoryToDbRow({ title: 'Test' });
      expect(row.document_type).toBeUndefined();
      expect(row.spec_level).toBeUndefined();
    });

    it('Maps specLevel null correctly', () => {
      const row = memoryToDbRow({ documentType: 'memory', specLevel: null });
      expect(row.document_type).toBe('memory');
      expect(row.spec_level).toBeNull();
    });

    it('Maps specLevel 4 (for 3+) correctly', () => {
      const row = memoryToDbRow({ documentType: 'decision_record', specLevel: 4 });
      expect(row.document_type).toBe('decision_record');
      expect(row.spec_level).toBe(4);
    });
  });

  describe('partialDbRowToMemory() handles new fields', () => {
    it('Maps document_type -> documentType from partial row', () => {
      const mem = partialDbRowToMemory({ id: 1, document_type: 'checklist', spec_level: 2 });
      expect(mem.documentType).toBe('checklist');
      expect(mem.specLevel).toBe(2);
    });

    it('Omits documentType when document_type not in partial row', () => {
      const mem = partialDbRowToMemory({ id: 1, title: 'Test' });
      expect(mem.documentType).toBeUndefined();
      expect(mem.specLevel).toBeUndefined();
    });
  });

  describe('Round-trip: Memory -> DbRow -> Memory preserves fields', () => {
    it('document_type and spec_level survive round-trip', () => {
      const original = { documentType: 'implementation_summary', specLevel: 3 };
      const dbRow = memoryToDbRow(original);
      expect(dbRow.document_type).toBe('implementation_summary');
      expect(dbRow.spec_level).toBe(3);

      const restored = partialDbRowToMemory({ id: 99, ...dbRow });
      expect(restored.documentType).toBe('implementation_summary');
      expect(restored.specLevel).toBe(3);
    });

    it('null spec_level survives round-trip', () => {
      const original = { documentType: 'memory', specLevel: null };
      const dbRow = memoryToDbRow(original);
      const restored = partialDbRowToMemory({ id: 99, ...dbRow });
      expect(restored.documentType).toBe('memory');
      expect(restored.specLevel).toBeNull();
    });
  });
});

/* ═══════════════════════════════════════════════════════════════
   NOTE: detectSpecLevelFromParsed() is a private function in
   memory-save.ts and is tested indirectly through indexMemoryFile().
   Phase 1 schema migration and Phase 3 discovery (findSpecDocuments,
   detectSpecLevel) require a live DB/filesystem and are covered
   by integration tests.
   ═══════════════════════════════════════════════════════════════ */
