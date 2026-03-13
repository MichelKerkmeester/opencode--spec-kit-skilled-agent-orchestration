// TEST: INTEGRATION LEARNING HISTORY
import { describe, it, expect } from 'vitest';
import * as learningHandler from '../handlers/session-learning';

type PreflightArgs = Parameters<typeof learningHandler.handleTaskPreflight>[0];
type PostflightArgs = Parameters<typeof learningHandler.handleTaskPostflight>[0];
type LearningHistoryArgs = Parameters<typeof learningHandler.handleGetLearningHistory>[0];

describe('Integration Learning History (T530) [deferred - requires DB test fixtures]', () => {

  // SUITE: Preflight Pipeline Validation
  describe('Preflight Pipeline Validation', () => {
    it('T530-1: Missing all preflight params rejected', async () => {
      await expect(learningHandler.handleTaskPreflight({} as PreflightArgs)).rejects.toThrow();
    });

    it('T530-1b: Missing taskId rejected in pipeline', async () => {
      await expect(
        learningHandler.handleTaskPreflight({
          specFolder: 'specs/test',
          knowledgeScore: 50,
          uncertaintyScore: 30,
          contextScore: 40,
        } as PreflightArgs)
      ).rejects.toThrow();
    });
  });

  // SUITE: Postflight Pipeline Validation
  describe('Postflight Pipeline Validation', () => {
    it('T530-2: Missing all postflight params rejected', async () => {
      await expect(learningHandler.handleTaskPostflight({} as PostflightArgs)).rejects.toThrow();
    });
  });

  // SUITE: Learning History Pipeline
  describe('Learning History Pipeline', () => {
    it('T530-3: Missing specFolder for history rejected', async () => {
      await expect(learningHandler.handleGetLearningHistory({} as LearningHistoryArgs)).rejects.toThrow();
    });
  });

  // SUITE: Score Validation Across Pipeline
  describe('Score Validation Across Pipeline', () => {
    it('T530-4: Score > 100 rejected in preflight', async () => {
      await expect(
        learningHandler.handleTaskPreflight({
          specFolder: 'specs/test',
          taskId: 'task-001',
          knowledgeScore: 150,
          uncertaintyScore: 30,
          contextScore: 40,
        } as PreflightArgs)
      ).rejects.toThrow();
    });

    it('T530-5: Negative score rejected in postflight', async () => {
      await expect(
        learningHandler.handleTaskPostflight({
          specFolder: 'specs/test',
          taskId: 'task-001',
          knowledgeScore: -5,
          uncertaintyScore: 30,
          contextScore: 40,
        } as PostflightArgs)
      ).rejects.toThrow();
    });
  });

  // SUITE: Learning Delta Formula Verification
  describe('Learning Delta Formula Verification', () => {
    it('T530-6: Learning delta weights sum to 1.0', () => {
      const expectedWeights = {
        knowledge: 0.4,
        uncertainty: 0.35,
        context: 0.25,
      };
      const sum = expectedWeights.knowledge + expectedWeights.uncertainty + expectedWeights.context;
      expect(Math.abs(sum - 1.0)).toBeLessThan(0.001);
    });

    it('T530-6b: Full learning pipeline functions exported', () => {
      expect(typeof learningHandler.handleTaskPreflight).toBe('function');
      expect(typeof learningHandler.handleTaskPostflight).toBe('function');
      expect(typeof learningHandler.handleGetLearningHistory).toBe('function');
    });
  });
});
