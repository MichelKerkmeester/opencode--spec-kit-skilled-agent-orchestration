// ───────────────────────────────────────────────────────────────
// TEST: Query Intent Classifier
// ───────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest';
import {
  classifyQueryIntent,
  type QueryIntent,
  type ClassificationResult,
} from '../lib/code-graph/query-intent-classifier.js';

describe('query-intent-classifier', () => {
  describe('structural queries', () => {
    it('classifies "who calls handleSave" as structural', () => {
      const result = classifyQueryIntent('who calls handleSave');
      expect(result.intent).toBe('structural');
      expect(result.structuralScore).toBeGreaterThan(result.semanticScore);
      expect(result.matchedKeywords).toContain('calls');
    });

    it('classifies "show callers of indexFiles" as structural', () => {
      const result = classifyQueryIntent('show callers of indexFiles');
      expect(result.intent).toBe('structural');
    });

    it('classifies "what imports this module" as structural', () => {
      const result = classifyQueryIntent('what imports this module');
      expect(result.intent).toBe('structural');
    });

    it('classifies "class hierarchy of BaseHandler" as structural', () => {
      const result = classifyQueryIntent('class hierarchy of BaseHandler');
      expect(result.intent).toBe('structural');
    });
  });

  describe('semantic queries', () => {
    it('classifies "find similar patterns to caching" as semantic', () => {
      const result = classifyQueryIntent('find similar patterns to caching');
      expect(result.intent).toBe('semantic');
      expect(result.semanticScore).toBeGreaterThan(result.structuralScore);
    });

    it('classifies "examples of error handling approaches" as semantic', () => {
      const result = classifyQueryIntent('examples of error handling approaches');
      expect(result.intent).toBe('semantic');
    });
  });

  describe('hybrid queries', () => {
    it('returns hybrid for empty string', () => {
      const result = classifyQueryIntent('');
      expect(result.intent).toBe('hybrid');
      expect(result.confidence).toBe(0.5);
    });

    it('returns hybrid for ambiguous queries', () => {
      const result = classifyQueryIntent('tell me about the system');
      expect(result.intent).toBe('hybrid');
    });
  });

  describe('result shape', () => {
    it('returns a valid ClassificationResult', () => {
      const result: ClassificationResult = classifyQueryIntent('test query');
      expect(['structural', 'semantic', 'hybrid']).toContain(result.intent);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(typeof result.structuralScore).toBe('number');
      expect(typeof result.semanticScore).toBe('number');
      expect(Array.isArray(result.matchedKeywords)).toBe(true);
    });

    it('confidence never exceeds 0.95', () => {
      const result = classifyQueryIntent(
        'who calls what imports callers callees dependencies exports function class method'
      );
      expect(result.confidence).toBeLessThanOrEqual(0.95);
    });
  });

  describe('edge cases', () => {
    it('handles whitespace-only input', () => {
      const result = classifyQueryIntent('   ');
      expect(result.intent).toBe('hybrid');
      expect(result.confidence).toBe(0.5);
    });

    it('handles single structural keyword', () => {
      const result = classifyQueryIntent('imports');
      expect(result.intent).toBe('structural');
      expect(result.matchedKeywords.length).toBeGreaterThan(0);
    });
  });
});
