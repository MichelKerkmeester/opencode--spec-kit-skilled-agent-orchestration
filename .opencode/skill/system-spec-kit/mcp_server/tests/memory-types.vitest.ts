// TEST: MEMORY TYPES
import { describe, it, expect } from 'vitest';
import { MEMORY_TYPES, HALF_LIVES_DAYS, getHalfLifeForType } from '../lib/config/memory-types';
import { inferTypeFromPath, extractExplicitType, inferTypeFromTier, inferTypeFromKeywords, inferMemoryType } from '../lib/config/type-inference';
import type { MemoryTypeName } from '../lib/config/memory-types';

interface PathInferenceCase {
  path: string;
  expected: MemoryTypeName;
}

interface ContentInferenceCase {
  content: string;
  expected: MemoryTypeName;
}

interface KeywordInferenceCase {
  title: string;
  expected: MemoryTypeName;
}

describe('Memory Types Tests (T068-T082)', () => {

  describe('Memory Types Structure - T068', () => {
    it('T068: MEMORY_TYPES contains 9 types', () => {
      const types = Object.keys(MEMORY_TYPES);
      const expectedTypes: readonly MemoryTypeName[] = [
        'working',
        'episodic',
        'prospective',
        'implicit',
        'declarative',
        'procedural',
        'semantic',
        'autobiographical',
        'meta-cognitive',
      ];

      expect(types).toHaveLength(9);
      for (const t of expectedTypes) {
        expect(types).toContain(t);
      }
    });
  });

  describe('Half-Life Values - T069-T077', () => {
    it('T069: Working memory half-life = 1 day', () => {
      expect(MEMORY_TYPES.working.halfLifeDays).toBe(1);
    });

    it('T070: Episodic memory half-life = 7 days', () => {
      expect(MEMORY_TYPES.episodic.halfLifeDays).toBe(7);
    });

    it('T071: Prospective memory half-life = 14 days', () => {
      expect(MEMORY_TYPES.prospective.halfLifeDays).toBe(14);
    });

    it('T072: Implicit memory half-life = 30 days', () => {
      expect(MEMORY_TYPES.implicit.halfLifeDays).toBe(30);
    });

    it('T073: Declarative memory half-life = 60 days', () => {
      expect(MEMORY_TYPES.declarative.halfLifeDays).toBe(60);
    });

    it('T074: Procedural memory half-life = 90 days', () => {
      expect(MEMORY_TYPES.procedural.halfLifeDays).toBe(90);
    });

    it('T075: Semantic memory half-life = 180 days', () => {
      expect(MEMORY_TYPES.semantic.halfLifeDays).toBe(180);
    });

    it('T076: Autobiographical memory half-life = 365 days', () => {
      expect(MEMORY_TYPES.autobiographical.halfLifeDays).toBe(365);
    });

    it('T077: Meta-cognitive memory half-life = null (no decay)', () => {
      expect(MEMORY_TYPES['meta-cognitive'].halfLifeDays).toBeNull();
    });

    it('HALF_LIVES_DAYS lookup object is consistent with MEMORY_TYPES', () => {
      expect(HALF_LIVES_DAYS.working).toBe(1);
      expect(HALF_LIVES_DAYS.episodic).toBe(7);
      expect(HALF_LIVES_DAYS.prospective).toBe(14);
      expect(HALF_LIVES_DAYS.implicit).toBe(30);
      expect(HALF_LIVES_DAYS.declarative).toBe(60);
      expect(HALF_LIVES_DAYS.procedural).toBe(90);
      expect(HALF_LIVES_DAYS.semantic).toBe(180);
      expect(HALF_LIVES_DAYS.autobiographical).toBe(365);
      expect(HALF_LIVES_DAYS['meta-cognitive']).toBeNull();
    });

    it('getHalfLifeForType returns canonical decay values', () => {
      expect(getHalfLifeForType('semantic')).toBe(180);
      expect(getHalfLifeForType('meta-cognitive')).toBeNull();
      expect(getHalfLifeForType('unknown')).toBeNull();
    });
  });

  describe('Type Inference - T078-T082', () => {
    it('T078: Type inference from file path patterns', () => {
      const pathTests: readonly PathInferenceCase[] = [
        { path: '/project/scratch/temp-notes.md', expected: 'working' },
        { path: '/project/session-1-summary.md', expected: 'episodic' },
        { path: '/project/debug-log.md', expected: 'episodic' },
        { path: '/project/todo-list.md', expected: 'prospective' },
        { path: '/project/next-steps.md', expected: 'prospective' },
        { path: '/project/workflow-guide.md', expected: 'implicit' },
        { path: '/project/setup-guide.md', expected: 'procedural' },
        { path: '/project/checklist.md', expected: 'procedural' },
        { path: '/project/architecture.md', expected: 'semantic' },
        { path: '/project/.opencode/specs/008-feature/spec.md', expected: 'semantic' },
        { path: '/project/.opencode/specs/008-feature/plan.md', expected: 'semantic' },
        { path: '/project/.opencode/specs/008-feature/decision-record.md', expected: 'semantic' },
        { path: '/project/.opencode/specs/008-feature/implementation-summary.md', expected: 'semantic' },
        { path: '/project/.opencode/specs/008-feature/research/research.md', expected: 'semantic' },
        { path: '/project/.opencode/specs/008-feature/research.md', expected: 'semantic' },
        { path: '/project/.opencode/specs/008-feature/scratch/spec.md', expected: 'working' },
        { path: '/project/.opencode/specs/008-feature/research/iterations/iteration-001.md', expected: 'working' },
        { path: '/project/.opencode/specs/008-feature/review/iterations/iteration-001.md', expected: 'working' },
        { path: '/project/changelog.md', expected: 'autobiographical' },
        { path: '/project/milestone.md', expected: 'autobiographical' },
        { path: '/project/constitutional-rules.md', expected: 'meta-cognitive' },
        { path: '/project/AGENTS.md', expected: 'meta-cognitive' },
      ];

      for (const test of pathTests) {
        expect(inferTypeFromPath(test.path)).toBe(test.expected);
      }
    });

    it('T079: Type inference from frontmatter', () => {
      const frontmatterTests: readonly ContentInferenceCase[] = [
        { content: '---\nmemory_type: episodic\n---\n# Test', expected: 'episodic' },
        { content: '---\nmemoryType: procedural\n---\n# Test', expected: 'procedural' },
        { content: '---\nmemory_type: "semantic"\n---\n# Test', expected: 'semantic' },
        { content: "---\nmemoryType: 'working'\n---\n# Test", expected: 'working' },
      ];

      for (const test of frontmatterTests) {
        expect(extractExplicitType(test.content)).toBe(test.expected);
      }
    });

    it('T080: Type inference from importance_tier mapping', () => {
      const tierTests: readonly ContentInferenceCase[] = [
        { content: '---\nimportance_tier: constitutional\n---', expected: 'meta-cognitive' },
        { content: '---\nimportanceTier: critical\n---', expected: 'semantic' },
        { content: '---\nimportance_tier: important\n---', expected: 'declarative' },
        { content: '---\nimportance_tier: normal\n---', expected: 'declarative' },
        { content: '---\nimportance_tier: temporary\n---', expected: 'working' },
        { content: '---\nimportance_tier: deprecated\n---', expected: 'episodic' },
        { content: '[CONSTITUTIONAL] This is a rule', expected: 'meta-cognitive' },
        { content: '[CRITICAL] Important info', expected: 'semantic' },
      ];

      for (const test of tierTests) {
        expect(inferTypeFromTier(test.content)).toBe(test.expected);
      }
    });

    it('T081: Type inference from keywords in title', () => {
      const keywordTests: readonly KeywordInferenceCase[] = [
        { title: 'Session Summary for Jan 15', expected: 'episodic' },
        { title: 'Debug session notes', expected: 'episodic' },
        { title: 'TODO: Fix bug in nav', expected: 'prospective' },
        { title: 'Next steps for project', expected: 'prospective' },
        { title: 'Code Pattern: Error Handling', expected: 'implicit' },
        { title: 'Best practice for validation', expected: 'implicit' },
        { title: 'Implementation Details', expected: 'declarative' },
        { title: 'API Reference', expected: 'declarative' },
        { title: 'How to deploy', expected: 'procedural' },
        { title: 'Setup Guide', expected: 'procedural' },
        { title: 'Architecture Decision', expected: 'semantic' },
        { title: 'Design Principles', expected: 'semantic' },
        { title: 'Project History', expected: 'autobiographical' },
        { title: 'Milestone: v1.0 Release', expected: 'autobiographical' },
        { title: 'Constitutional Rule: No Force Push', expected: 'meta-cognitive' },
        { title: 'Coding Standard', expected: 'meta-cognitive' },
      ];

      for (const test of keywordTests) {
        expect(inferTypeFromKeywords(test.title, [], '')).toBe(test.expected);
      }
    });

    it('T082: Default type fallback when no pattern matches', () => {
      const defaultResult = inferMemoryType({
        filePath: '/project/random-file-xyz.md',
        content: '# Just some random content\n\nNo special markers here.',
        title: 'Random File',
        triggerPhrases: [],
      });

      expect(defaultResult.type).toBe('declarative');
      expect(defaultResult.source).toBe('default');
    });

    it('Spec document paths override important tier routing', () => {
      const specDocResult = inferMemoryType({
        filePath: '/project/.opencode/specs/008-feature/plan.md',
        importanceTier: 'important',
      });

      const regularImportantResult = inferMemoryType({
        filePath: '/project/docs/api-notes.md',
        importanceTier: 'important',
      });

      expect(specDocResult.type).toBe('semantic');
      expect(specDocResult.source).toBe('file_path');
      expect(regularImportantResult.type).toBe('declarative');
      expect(regularImportantResult.source).toBe('importance_tier');
    });
  });
});
