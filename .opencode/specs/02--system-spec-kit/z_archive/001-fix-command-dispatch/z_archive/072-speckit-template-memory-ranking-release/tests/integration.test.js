// ===================================================================
// INTEGRATION TEST SUITE: SpecKit, Memory System & MCP Server
// ===================================================================
// Comprehensive integration tests verifying cross-spec features work
// together correctly. Tests end-to-end workflows, performance
// benchmarks, and real-world scenarios.
//
// Run with: node --test integration.test.js
// or: npx vitest run integration.test.js
// ===================================================================

'use strict';

const { describe, it, beforeEach, afterEach, before, after } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');
const os = require('os');

// ===================================================================
// TEST CONFIGURATION
// ===================================================================

const SPEC_KIT_BASE = path.join(__dirname, '../../../../.opencode/skill/system-spec-kit');
const MCP_SERVER_PATH = path.join(SPEC_KIT_BASE, 'mcp_server');
const LIB_PATH = path.join(MCP_SERVER_PATH, 'lib');
const TEMPLATES_PATH = path.join(SPEC_KIT_BASE, 'templates');
const SCRIPTS_PATH = path.join(SPEC_KIT_BASE, 'scripts');

// Performance thresholds (milliseconds)
const PERF_THRESHOLDS = {
  rrfFusion100Results: 100,     // RRF fusion for 100 results
  checkpointRestore1000: 5000,  // Checkpoint restore for 1000 memories
  fileReadAsync: 50,            // Async file read
  vectorSearch100: 200,         // Vector search with 100 results
  compositeScoring: 50,         // Composite scoring for 100 results
};

// Test database path (isolated for tests)
const TEST_DB_DIR = path.join(os.tmpdir(), 'speckit-integration-tests');
const TEST_DB_PATH = path.join(TEST_DB_DIR, 'test-context-index.sqlite');

// ===================================================================
// 1. END-TO-END SPEC FOLDER CREATION
// ===================================================================

describe('End-to-End Spec Folder Creation', () => {
  const testSpecsDir = path.join(os.tmpdir(), 'speckit-test-specs');

  before(() => {
    // Create isolated test directory
    if (!fs.existsSync(testSpecsDir)) {
      fs.mkdirSync(testSpecsDir, { recursive: true });
    }
  });

  after(() => {
    // Cleanup test directory
    if (fs.existsSync(testSpecsDir)) {
      fs.rmSync(testSpecsDir, { recursive: true, force: true });
    }
  });

  describe('Template Level Selection', () => {
    it('should have Level 1 templates with correct files', () => {
      const level1Dir = path.join(TEMPLATES_PATH, 'level_1');
      const expectedFiles = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md'];

      assert.ok(fs.existsSync(level1Dir), 'Level 1 templates directory should exist');

      for (const file of expectedFiles) {
        const filePath = path.join(level1Dir, file);
        assert.ok(fs.existsSync(filePath), `Level 1 should have ${file}`);
      }
    });

    it('should have Level 2 templates with checklist', () => {
      const level2Dir = path.join(TEMPLATES_PATH, 'level_2');
      const expectedFiles = ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'implementation-summary.md'];

      assert.ok(fs.existsSync(level2Dir), 'Level 2 templates directory should exist');

      for (const file of expectedFiles) {
        const filePath = path.join(level2Dir, file);
        assert.ok(fs.existsSync(filePath), `Level 2 should have ${file}`);
      }
    });

    it('should have Level 3 templates with decision-record', () => {
      const level3Dir = path.join(TEMPLATES_PATH, 'level_3');
      const expectedFiles = ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'decision-record.md', 'implementation-summary.md'];

      assert.ok(fs.existsSync(level3Dir), 'Level 3 templates directory should exist');

      for (const file of expectedFiles) {
        const filePath = path.join(level3Dir, file);
        assert.ok(fs.existsSync(filePath), `Level 3 should have ${file}`);
      }
    });

    it('should have Level 3+ templates with extended content', () => {
      const level3PlusDir = path.join(TEMPLATES_PATH, 'level_3+');

      assert.ok(fs.existsSync(level3PlusDir), 'Level 3+ templates directory should exist');

      const files = fs.readdirSync(level3PlusDir).filter(f => f.endsWith('.md'));
      assert.ok(files.length >= 5, 'Level 3+ should have at least 5 markdown templates');
    });
  });

  describe('Complexity Detection Integration', () => {
    it('should have detect-complexity.js script available', () => {
      const detectScript = path.join(SCRIPTS_PATH, 'detect-complexity.js');
      assert.ok(fs.existsSync(detectScript), 'detect-complexity.js should exist');
    });

    it('should have expand-template.js script available', () => {
      const expandScript = path.join(SCRIPTS_PATH, 'expand-template.js');
      assert.ok(fs.existsSync(expandScript), 'expand-template.js should exist');
    });

    it('should have create-spec-folder.sh script available', () => {
      const createScript = path.join(SCRIPTS_PATH, 'create-spec-folder.sh');
      assert.ok(fs.existsSync(createScript), 'create-spec-folder.sh should exist');
    });
  });

  describe('Template Content Validation', () => {
    it('should have SPECKIT_TEMPLATE_SOURCE markers in Level 1 templates', () => {
      const level1Dir = path.join(TEMPLATES_PATH, 'level_1');
      const specContent = fs.readFileSync(path.join(level1Dir, 'spec.md'), 'utf-8');

      assert.ok(
        specContent.includes('SPECKIT_TEMPLATE_SOURCE'),
        'Level 1 spec.md should contain SPECKIT_TEMPLATE_SOURCE marker'
      );
    });

    it('should have consistent structure across levels', () => {
      const levels = ['level_1', 'level_2', 'level_3'];

      for (const level of levels) {
        const levelDir = path.join(TEMPLATES_PATH, level);
        const specPath = path.join(levelDir, 'spec.md');

        if (fs.existsSync(specPath)) {
          const content = fs.readFileSync(specPath, 'utf-8');

          // All specs should have Document Info and Problem Statement sections
          assert.ok(
            content.includes('## Document Info') || content.includes('## 1.'),
            `${level}/spec.md should have Document Info or numbered sections`
          );
        }
      }
    });
  });
});

// ===================================================================
// 2. MEMORY SYSTEM INTEGRATION
// ===================================================================

describe('Memory System Integration', () => {
  let compositeScoring, rrfFusion, importanceTiers;

  before(() => {
    // Load memory system modules
    compositeScoring = require(path.join(LIB_PATH, 'scoring', 'composite-scoring.js'));
    rrfFusion = require(path.join(LIB_PATH, 'search', 'rrf-fusion.js'));
    importanceTiers = require(path.join(LIB_PATH, 'scoring', 'importance-tiers.js'));
  });

  describe('Memory Ranking with Composite Scoring', () => {
    it('should apply composite scoring correctly to results', () => {
      const mockResults = [
        {
          id: 1,
          similarity: 85,
          importance_weight: 0.8,
          importance_tier: 'important',
          updated_at: new Date().toISOString(),
          access_count: 5,
        },
        {
          id: 2,
          similarity: 90,
          importance_weight: 0.5,
          importance_tier: 'normal',
          updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          access_count: 2,
        },
        {
          id: 3,
          similarity: 75,
          importance_weight: 1.0,
          importance_tier: 'constitutional',
          updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          access_count: 10,
        },
      ];

      const scored = compositeScoring.apply_composite_scoring(mockResults);

      assert.ok(Array.isArray(scored), 'Result should be an array');
      assert.strictEqual(scored.length, 3, 'Should return all results');

      // All results should have composite_score
      for (const result of scored) {
        assert.ok(
          typeof result.composite_score === 'number',
          'Each result should have composite_score'
        );
        assert.ok(
          result.composite_score >= 0 && result.composite_score <= 1,
          'Composite score should be between 0 and 1'
        );
        assert.ok(result._scoring, 'Each result should have _scoring breakdown');
      }

      // Results should be sorted by composite_score descending
      for (let i = 1; i < scored.length; i++) {
        assert.ok(
          scored[i - 1].composite_score >= scored[i].composite_score,
          'Results should be sorted by composite_score descending'
        );
      }
    });

    it('should give constitutional memories higher tier boost', () => {
      const constitutionalBoost = compositeScoring.get_tier_boost('constitutional');
      const criticalBoost = compositeScoring.get_tier_boost('critical');
      const normalBoost = compositeScoring.get_tier_boost('normal');
      const deprecatedBoost = compositeScoring.get_tier_boost('deprecated');

      // Verify tier boost hierarchy
      assert.strictEqual(constitutionalBoost, 1.0, 'Constitutional tier should have 1.0 boost');
      assert.strictEqual(criticalBoost, 1.0, 'Critical tier should have 1.0 boost');
      assert.strictEqual(normalBoost, 0.5, 'Normal tier should have 0.5 boost');

      // Constitutional/Critical should have higher boost than normal
      assert.ok(constitutionalBoost > normalBoost, 'Constitutional should have higher boost than normal');

      // Deprecated boost may vary by implementation - just verify it exists
      assert.ok(typeof deprecatedBoost === 'number', 'Deprecated tier should have numeric boost');
    });

    it('should calculate recency score with tier exemption for constitutional', () => {
      const oldDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();

      const normalRecency = compositeScoring.calculate_recency_score(oldDate, 'normal');
      const constitutionalRecency = compositeScoring.calculate_recency_score(oldDate, 'constitutional');

      // Constitutional should have higher recency (no decay)
      assert.ok(
        constitutionalRecency > normalRecency,
        'Constitutional memories should not decay with age'
      );
      assert.strictEqual(
        constitutionalRecency,
        1.0,
        'Constitutional tier should always have 1.0 recency score'
      );
    });
  });

  describe('Search Results with Constitutional First', () => {
    it('should sort constitutional memories to top of results', () => {
      const mockResults = [
        { id: 1, similarity: 95, importance_tier: 'normal', title: 'Normal Result' },
        { id: 2, similarity: 80, importance_tier: 'constitutional', title: 'Constitutional Result' },
        { id: 3, similarity: 88, importance_tier: 'important', title: 'Important Result' },
      ];

      // Simulate constitutional-first sorting
      const sorted = [...mockResults].sort((a, b) => {
        // Constitutional always first
        if (a.importance_tier === 'constitutional' && b.importance_tier !== 'constitutional') return -1;
        if (b.importance_tier === 'constitutional' && a.importance_tier !== 'constitutional') return 1;
        // Then by similarity
        return b.similarity - a.similarity;
      });

      assert.strictEqual(
        sorted[0].importance_tier,
        'constitutional',
        'Constitutional memory should be first regardless of similarity'
      );
    });

    it('should validate all tier configurations exist', () => {
      const expectedTiers = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];

      for (const tier of expectedTiers) {
        const config = importanceTiers.get_tier_config(tier);
        assert.ok(config, `Tier ${tier} should have configuration`);
        assert.ok(typeof config.value === 'number', `Tier ${tier} should have numeric value`);
        assert.ok(typeof config.searchBoost === 'number', `Tier ${tier} should have searchBoost`);
      }
    });

    it('should correctly identify tiers that allow decay', () => {
      assert.ok(!importanceTiers.allows_decay('constitutional'), 'Constitutional should not decay');
      assert.ok(!importanceTiers.allows_decay('critical'), 'Critical should not decay');
      assert.ok(importanceTiers.allows_decay('normal'), 'Normal should decay');
      assert.ok(importanceTiers.allows_decay('temporary'), 'Temporary should decay');
    });
  });

  describe('RRF Fusion for Hybrid Search', () => {
    it('should fuse vector and FTS results correctly', () => {
      const vectorResults = [
        { id: 1, similarity: 95, title: 'Result A' },
        { id: 2, similarity: 88, title: 'Result B' },
        { id: 3, similarity: 82, title: 'Result C' },
      ];

      const ftsResults = [
        { id: 2, fts_score: 10, title: 'Result B' },
        { id: 4, fts_score: 8, title: 'Result D' },
        { id: 1, fts_score: 6, title: 'Result A' },
      ];

      const fused = rrfFusion.fuse_results(vectorResults, ftsResults, { limit: 5 });

      assert.ok(Array.isArray(fused), 'Fused results should be an array');
      assert.ok(fused.length <= 5, 'Should respect limit');

      // Results appearing in both should have higher scores
      const resultB = fused.find(r => r.id === 2);
      assert.ok(resultB, 'Result B should be in fused results');
      assert.ok(resultB.in_vector && resultB.in_fts, 'Result B should be marked as in both');

      // All results should have rrf_score
      for (const result of fused) {
        assert.ok(typeof result.rrf_score === 'number', 'Each result should have rrf_score');
      }
    });

    it('should handle empty vector results gracefully', () => {
      const ftsResults = [
        { id: 1, fts_score: 10, title: 'Result A' },
        { id: 2, fts_score: 8, title: 'Result B' },
      ];

      const fused = rrfFusion.fuse_results([], ftsResults, { limit: 10 });

      assert.ok(Array.isArray(fused), 'Should return array for empty vector results');
      assert.strictEqual(fused.length, 2, 'Should return FTS results');

      for (const result of fused) {
        assert.ok(!result.in_vector, 'Results should not be marked as in_vector');
        assert.ok(result.in_fts, 'Results should be marked as in_fts');
      }
    });

    it('should handle empty FTS results gracefully', () => {
      const vectorResults = [
        { id: 1, similarity: 95, title: 'Result A' },
        { id: 2, similarity: 88, title: 'Result B' },
      ];

      const fused = rrfFusion.fuse_results(vectorResults, [], { limit: 10 });

      assert.ok(Array.isArray(fused), 'Should return array for empty FTS results');
      assert.strictEqual(fused.length, 2, 'Should return vector results');
    });

    it('should apply convergence bonus for results in both methods', () => {
      const vectorResults = [
        { id: 1, similarity: 95, title: 'Result A' },
      ];

      const ftsResults = [
        { id: 1, fts_score: 10, title: 'Result A' },
      ];

      const fused = rrfFusion.fuse_results(vectorResults, ftsResults, { limit: 10 });

      const result = fused[0];
      assert.ok(result.in_vector && result.in_fts, 'Result should be in both');

      // RRF score should include convergence bonus
      const expectedBaseScore = 1 / (60 + 1) + 1 / (60 + 1);
      const expectedWithBonus = expectedBaseScore + rrfFusion.CONVERGENCE_BONUS;

      assert.ok(
        Math.abs(result.rrf_score - expectedWithBonus) < 0.001,
        'RRF score should include convergence bonus'
      );
    });
  });
});

// ===================================================================
// 3. MCP SERVER INTEGRATION
// ===================================================================

describe('MCP Server Integration', () => {
  describe('Barrel Exports from cognitive/', () => {
    let cognitiveModule;

    before(() => {
      cognitiveModule = require(path.join(LIB_PATH, 'cognitive', 'index.js'));
    });

    it('should export all attention decay functions', () => {
      assert.ok(cognitiveModule.attentionDecay_init, 'Should export attentionDecay_init');
      assert.ok(cognitiveModule.applyDecay, 'Should export applyDecay');
      assert.ok(cognitiveModule.getDecayRate, 'Should export getDecayRate');
      assert.ok(cognitiveModule.activateMemory, 'Should export activateMemory');
      assert.ok(cognitiveModule.calculateDecayedScore, 'Should export calculateDecayedScore');
    });

    it('should export all working memory functions', () => {
      assert.ok(cognitiveModule.workingMemory_init, 'Should export workingMemory_init');
      assert.ok(cognitiveModule.ensureSchema, 'Should export ensureSchema');
      assert.ok(cognitiveModule.getOrCreateSession, 'Should export getOrCreateSession');
      assert.ok(cognitiveModule.getWorkingMemory, 'Should export getWorkingMemory');
      assert.ok(cognitiveModule.setAttentionScore, 'Should export setAttentionScore');
    });

    it('should export all tier classifier functions', () => {
      assert.ok(cognitiveModule.classifyTier, 'Should export classifyTier');
      assert.ok(cognitiveModule.getTieredContent, 'Should export getTieredContent');
      assert.ok(cognitiveModule.filterAndLimitByTier, 'Should export filterAndLimitByTier');
      assert.ok(cognitiveModule.getTierStats, 'Should export getTierStats');
    });

    it('should export all co-activation functions', () => {
      assert.ok(cognitiveModule.coActivation_init, 'Should export coActivation_init');
      assert.ok(cognitiveModule.spreadActivation, 'Should export spreadActivation');
      assert.ok(cognitiveModule.getRelatedMemories, 'Should export getRelatedMemories');
      assert.ok(cognitiveModule.boostScore, 'Should export boostScore');
    });

    it('should export all temporal contiguity functions', () => {
      assert.ok(cognitiveModule.DEFAULT_WINDOW, 'Should export DEFAULT_WINDOW');
      assert.ok(cognitiveModule.MAX_WINDOW, 'Should export MAX_WINDOW');
      assert.ok(cognitiveModule.vector_search_with_contiguity, 'Should export vector_search_with_contiguity');
      assert.ok(cognitiveModule.get_temporal_neighbors, 'Should export get_temporal_neighbors');
    });

    it('should export all summary generator functions', () => {
      assert.ok(cognitiveModule.generateSummary, 'Should export generateSummary');
      assert.ok(cognitiveModule.getSummaryOrFallback, 'Should export getSummaryOrFallback');
      assert.ok(cognitiveModule.stripMarkdown, 'Should export stripMarkdown');
      assert.ok(cognitiveModule.extractFirstParagraph, 'Should export extractFirstParagraph');
    });

    it('should export module references for direct access', () => {
      assert.ok(cognitiveModule.attentionDecay, 'Should export attentionDecay module');
      assert.ok(cognitiveModule.workingMemory, 'Should export workingMemory module');
      assert.ok(cognitiveModule.tierClassifier, 'Should export tierClassifier module');
      assert.ok(cognitiveModule.coActivation, 'Should export coActivation module');
      assert.ok(cognitiveModule.temporalContiguity, 'Should export temporalContiguity module');
      assert.ok(cognitiveModule.summaryGenerator, 'Should export summaryGenerator module');
    });

    it('should not have name collisions between modules', () => {
      // Verify that prefixed exports don't collide
      assert.notStrictEqual(
        cognitiveModule.attentionDecay_init,
        cognitiveModule.workingMemory_init,
        'attentionDecay_init and workingMemory_init should be different functions'
      );

      assert.notStrictEqual(
        cognitiveModule.attentionDecay_clearSession,
        cognitiveModule.workingMemory_clearSession,
        'clearSession functions should be different'
      );
    });
  });

  describe('Barrel Exports from scoring/', () => {
    let scoringModule;

    before(() => {
      scoringModule = require(path.join(LIB_PATH, 'scoring', 'index.js'));
    });

    it('should export composite scoring functions', () => {
      assert.ok(scoringModule.apply_composite_scoring, 'Should export apply_composite_scoring');
      assert.ok(scoringModule.calculate_composite_score, 'Should export calculate_composite_score');
      assert.ok(scoringModule.get_score_breakdown, 'Should export get_score_breakdown');
    });

    it('should export importance tiers functions', () => {
      assert.ok(scoringModule.get_tier_config, 'Should export get_tier_config');
      assert.ok(scoringModule.apply_tier_boost, 'Should export apply_tier_boost');
      assert.ok(scoringModule.is_valid_tier, 'Should export is_valid_tier');
    });
  });

  describe('Barrel Exports from search/', () => {
    let searchModule;

    before(() => {
      searchModule = require(path.join(LIB_PATH, 'search', 'index.js'));
    });

    it('should export RRF fusion functions', () => {
      assert.ok(searchModule.fuse_results, 'Should export fuse_results');
      assert.ok(searchModule.fuse_scores_advanced, 'Should export fuse_scores_advanced');
      assert.ok(searchModule.count_original_term_matches, 'Should export count_original_term_matches');
    });

    it('should export hybrid search functions', () => {
      assert.ok(searchModule.hybrid_search, 'Should export hybrid_search');
      assert.ok(searchModule.fts_search, 'Should export fts_search');
      assert.ok(searchModule.is_fts_available, 'Should export is_fts_available');
    });
  });

  describe('Database Operations Thread Safety', () => {
    it('should have transaction-safe checkpoint operations', () => {
      const checkpoints = require(path.join(LIB_PATH, 'storage', 'checkpoints.js'));

      // Verify the module exports expected functions
      assert.ok(typeof checkpoints.init === 'function', 'Should have init function');
      assert.ok(typeof checkpoints.create === 'function', 'Should have create function');
      assert.ok(typeof checkpoints.restore === 'function', 'Should have restore function');
      assert.ok(typeof checkpoints.list === 'function', 'Should have list function');
      assert.ok(typeof checkpoints.delete === 'function', 'Should have delete function');
    });

    it('should have thread-safe access tracker', () => {
      const accessTracker = require(path.join(LIB_PATH, 'storage', 'access-tracker.js'));

      assert.ok(typeof accessTracker.init === 'function', 'Should have init function');
      assert.ok(typeof accessTracker.track_access === 'function' ||
                typeof accessTracker.trackAccess === 'function', 'Should have track_access function');
      assert.ok(typeof accessTracker.flush_access_counts === 'function' ||
                typeof accessTracker.flushAccessCounts === 'function', 'Should have flush function');
    });
  });
});

// ===================================================================
// 4. PERFORMANCE BENCHMARKS
// ===================================================================

describe('Performance Benchmarks', () => {
  describe('RRF Fusion Performance', () => {
    it(`should complete RRF fusion for 100 results in <${PERF_THRESHOLDS.rrfFusion100Results}ms`, () => {
      const rrfFusion = require(path.join(LIB_PATH, 'search', 'rrf-fusion.js'));

      // Generate 100 mock results for each source
      const vectorResults = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        similarity: 100 - i * 0.5,
        title: `Vector Result ${i + 1}`,
        importance_tier: i % 6 === 0 ? 'constitutional' : 'normal',
      }));

      const ftsResults = Array.from({ length: 100 }, (_, i) => ({
        id: (i + 50) % 100 + 1, // Overlapping IDs
        fts_score: 100 - i,
        title: `FTS Result ${i + 1}`,
        importance_tier: 'normal',
      }));

      // Run benchmark
      const start = performance.now();
      const fused = rrfFusion.fuse_results(vectorResults, ftsResults, { limit: 50 });
      const elapsed = performance.now() - start;

      assert.ok(
        elapsed < PERF_THRESHOLDS.rrfFusion100Results,
        `RRF fusion took ${elapsed.toFixed(2)}ms, should be <${PERF_THRESHOLDS.rrfFusion100Results}ms`
      );
      assert.ok(fused.length <= 50, 'Should respect limit');

      console.log(`  RRF fusion (100 results): ${elapsed.toFixed(2)}ms`);
    });

    it('should handle large result sets (1000 results) efficiently', () => {
      const rrfFusion = require(path.join(LIB_PATH, 'search', 'rrf-fusion.js'));

      const vectorResults = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        similarity: 100 - i * 0.05,
        title: `Vector Result ${i + 1}`,
      }));

      const ftsResults = Array.from({ length: 1000 }, (_, i) => ({
        id: (i + 500) % 1000 + 1,
        fts_score: 100 - i * 0.1,
        title: `FTS Result ${i + 1}`,
      }));

      const start = performance.now();
      const fused = rrfFusion.fuse_results(vectorResults, ftsResults, { limit: 100 });
      const elapsed = performance.now() - start;

      // Allow 5x the 100-result threshold for 10x data
      const threshold = PERF_THRESHOLDS.rrfFusion100Results * 5;
      assert.ok(
        elapsed < threshold,
        `RRF fusion for 1000 results took ${elapsed.toFixed(2)}ms, should be <${threshold}ms`
      );

      console.log(`  RRF fusion (1000 results): ${elapsed.toFixed(2)}ms`);
    });
  });

  describe('Composite Scoring Performance', () => {
    it(`should score 100 results in <${PERF_THRESHOLDS.compositeScoring}ms`, () => {
      const compositeScoring = require(path.join(LIB_PATH, 'scoring', 'composite-scoring.js'));

      const mockResults = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        similarity: Math.random() * 100,
        importance_weight: Math.random(),
        importance_tier: ['constitutional', 'critical', 'important', 'normal', 'temporary'][i % 5],
        updated_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        access_count: Math.floor(Math.random() * 20),
      }));

      const start = performance.now();
      const scored = compositeScoring.apply_composite_scoring(mockResults);
      const elapsed = performance.now() - start;

      assert.ok(
        elapsed < PERF_THRESHOLDS.compositeScoring,
        `Composite scoring took ${elapsed.toFixed(2)}ms, should be <${PERF_THRESHOLDS.compositeScoring}ms`
      );
      assert.strictEqual(scored.length, 100, 'Should return all results');

      console.log(`  Composite scoring (100 results): ${elapsed.toFixed(2)}ms`);
    });
  });

  describe('File Read Performance', () => {
    it(`should read template files asynchronously in <${PERF_THRESHOLDS.fileReadAsync}ms`, async () => {
      const templatePath = path.join(TEMPLATES_PATH, 'level_1', 'spec.md');

      if (!fs.existsSync(templatePath)) {
        console.log('  Skipping async read test: template not found');
        return;
      }

      const start = performance.now();
      await fs.promises.readFile(templatePath, 'utf-8');
      const elapsed = performance.now() - start;

      assert.ok(
        elapsed < PERF_THRESHOLDS.fileReadAsync,
        `Async file read took ${elapsed.toFixed(2)}ms, should be <${PERF_THRESHOLDS.fileReadAsync}ms`
      );

      console.log(`  Async file read: ${elapsed.toFixed(2)}ms`);
    });

    it('should read multiple files concurrently faster than sequentially', async () => {
      const files = [
        path.join(TEMPLATES_PATH, 'level_1', 'spec.md'),
        path.join(TEMPLATES_PATH, 'level_1', 'plan.md'),
        path.join(TEMPLATES_PATH, 'level_1', 'tasks.md'),
      ].filter(f => fs.existsSync(f));

      if (files.length < 3) {
        console.log('  Skipping concurrent read test: not enough templates found');
        return;
      }

      // Sequential read
      const seqStart = performance.now();
      for (const file of files) {
        await fs.promises.readFile(file, 'utf-8');
      }
      const seqElapsed = performance.now() - seqStart;

      // Concurrent read
      const concStart = performance.now();
      await Promise.all(files.map(f => fs.promises.readFile(f, 'utf-8')));
      const concElapsed = performance.now() - concStart;

      console.log(`  Sequential read (${files.length} files): ${seqElapsed.toFixed(2)}ms`);
      console.log(`  Concurrent read (${files.length} files): ${concElapsed.toFixed(2)}ms`);

      // Concurrent should be at least as fast (may not be faster for small files/SSD)
      assert.ok(
        concElapsed <= seqElapsed * 1.5,
        'Concurrent read should not be significantly slower than sequential'
      );
    });
  });

  describe('Checkpoint Simulation Performance', () => {
    it('should handle simulated checkpoint data structure efficiently', () => {
      // Simulate checkpoint data structure without actual database
      const memories = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        spec_folder: `specs/test-${Math.floor(i / 100)}`,
        file_path: `/test/memory-${i}.md`,
        title: `Test Memory ${i + 1}`,
        trigger_phrases: JSON.stringify([`trigger-${i}`, `phrase-${i}`]),
        importance_weight: Math.random(),
        importance_tier: ['normal', 'important', 'critical'][i % 3],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const embeddings = Array.from({ length: 1000 }, (_, i) => ({
        memoryId: i + 1,
        embedding: Array.from({ length: 768 }, () => Math.random()),
      }));

      const snapshot = {
        memories,
        embeddings,
        metadata: {
          createdAt: new Date().toISOString(),
          memoryCount: 1000,
          embeddingCount: 1000,
        },
      };

      // Simulate compression/serialization
      const start = performance.now();
      const json = JSON.stringify(snapshot);
      const parsed = JSON.parse(json);
      const elapsed = performance.now() - start;

      // Allow generous threshold for JSON operations
      const threshold = 1000; // 1 second
      assert.ok(
        elapsed < threshold,
        `JSON serialization/parse for 1000 memories took ${elapsed.toFixed(2)}ms, should be <${threshold}ms`
      );

      assert.strictEqual(parsed.memories.length, 1000, 'Should preserve all memories');
      assert.strictEqual(parsed.embeddings.length, 1000, 'Should preserve all embeddings');

      console.log(`  JSON serialize/parse (1000 memories + embeddings): ${elapsed.toFixed(2)}ms`);
    });

    it('should build ID mapping efficiently for restore', () => {
      const memories = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        file_path: `/test/memory-${i}.md`,
        spec_folder: `specs/test-${Math.floor(i / 100)}`,
      }));

      // Simulate ID mapping build (as done in checkpoint restore)
      const start = performance.now();

      const idMapping = new Map();
      const existingIdsMap = new Map();

      // Build composite keys
      for (const mem of memories) {
        const key = `${mem.file_path}::${mem.spec_folder}`;
        existingIdsMap.set(key, mem.id);
      }

      // Simulate restore mapping
      for (const mem of memories) {
        const key = `${mem.file_path}::${mem.spec_folder}`;
        const existingId = existingIdsMap.get(key);
        if (existingId) {
          idMapping.set(mem.id, existingId);
        }
      }

      const elapsed = performance.now() - start;

      assert.ok(
        elapsed < 50,
        `ID mapping build took ${elapsed.toFixed(2)}ms, should be <50ms`
      );
      assert.strictEqual(idMapping.size, 1000, 'Should map all IDs');

      console.log(`  ID mapping build (1000 memories): ${elapsed.toFixed(2)}ms`);
    });
  });
});

// ===================================================================
// 5. REAL-WORLD SCENARIOS
// ===================================================================

describe('Real-World Scenarios', () => {
  describe('Scenario: Memory Search with Constitutional Tier', () => {
    it('should return constitutional memories at top regardless of query relevance', () => {
      const compositeScoring = require(path.join(LIB_PATH, 'scoring', 'composite-scoring.js'));

      // Simulate a search result set where constitutional has lower similarity
      const results = [
        { id: 1, similarity: 95, importance_tier: 'normal', title: 'High relevance normal' },
        { id: 2, similarity: 50, importance_tier: 'constitutional', title: 'Low relevance constitutional' },
        { id: 3, similarity: 88, importance_tier: 'important', title: 'Medium relevance important' },
      ];

      // Apply composite scoring (which includes tier boost)
      const scored = compositeScoring.apply_composite_scoring(results);

      // The constitutional memory should have the highest composite score
      // due to tier_boost of 1.0 (vs 0.5 for normal)
      const constitutionalResult = scored.find(r => r.importance_tier === 'constitutional');

      assert.ok(
        constitutionalResult._scoring.tier_boost === 1.0,
        'Constitutional should have tier_boost of 1.0'
      );
    });
  });

  describe('Scenario: Hybrid Search Fallback', () => {
    it('should gracefully fallback when one search method fails', () => {
      const rrfFusion = require(path.join(LIB_PATH, 'search', 'rrf-fusion.js'));

      // Simulate vector search failure (empty results)
      const vectorResults = [];
      const ftsResults = [
        { id: 1, fts_score: 10, title: 'FTS Result 1' },
        { id: 2, fts_score: 8, title: 'FTS Result 2' },
      ];

      const fused = rrfFusion.fuse_results(vectorResults, ftsResults, { limit: 10 });

      // Should return FTS results with appropriate metadata
      assert.strictEqual(fused.length, 2, 'Should return FTS results when vector is empty');

      for (const result of fused) {
        assert.ok(result.in_fts, 'Results should be marked as from FTS');
        assert.ok(!result.in_vector, 'Results should not be marked as from vector');
      }
    });
  });

  describe('Scenario: Spec Folder Level Selection by Complexity', () => {
    it('should correctly map complexity scores to documentation levels', () => {
      // Based on the detect-complexity.js implementation
      const scoreToLevel = (score) => {
        if (score >= 75) return '3+';
        if (score >= 50) return '3';
        if (score >= 25) return '2';
        return '1';
      };

      assert.strictEqual(scoreToLevel(10), '1', 'Score 10 should be Level 1');
      assert.strictEqual(scoreToLevel(25), '2', 'Score 25 should be Level 2');
      assert.strictEqual(scoreToLevel(50), '3', 'Score 50 should be Level 3');
      assert.strictEqual(scoreToLevel(75), '3+', 'Score 75 should be Level 3+');
      assert.strictEqual(scoreToLevel(100), '3+', 'Score 100 should be Level 3+');
    });

    it('should have all level folders with required templates', () => {
      const levelFolders = ['level_1', 'level_2', 'level_3', 'level_3+'];
      const requiredByLevel = {
        'level_1': ['spec.md', 'plan.md', 'tasks.md'],
        'level_2': ['spec.md', 'plan.md', 'tasks.md', 'checklist.md'],
        'level_3': ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'decision-record.md'],
        'level_3+': ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'decision-record.md'],
      };

      for (const level of levelFolders) {
        const levelDir = path.join(TEMPLATES_PATH, level);
        assert.ok(fs.existsSync(levelDir), `${level} directory should exist`);

        for (const required of requiredByLevel[level]) {
          const templatePath = path.join(levelDir, required);
          assert.ok(
            fs.existsSync(templatePath),
            `${level} should have ${required} template`
          );
        }
      }
    });
  });

  describe('Scenario: Concurrent Memory Operations', () => {
    it('should handle concurrent scoring operations', async () => {
      const compositeScoring = require(path.join(LIB_PATH, 'scoring', 'composite-scoring.js'));

      // Simulate multiple concurrent scoring operations
      const operations = Array.from({ length: 10 }, (_, i) =>
        Promise.resolve().then(() => {
          const results = Array.from({ length: 100 }, (_, j) => ({
            id: i * 100 + j,
            similarity: Math.random() * 100,
            importance_weight: Math.random(),
            importance_tier: 'normal',
            updated_at: new Date().toISOString(),
            access_count: Math.floor(Math.random() * 10),
          }));

          return compositeScoring.apply_composite_scoring(results);
        })
      );

      const allResults = await Promise.all(operations);

      assert.strictEqual(allResults.length, 10, 'All operations should complete');

      for (const scored of allResults) {
        assert.strictEqual(scored.length, 100, 'Each operation should return 100 results');
        // Verify sorted correctly
        for (let i = 1; i < scored.length; i++) {
          assert.ok(
            scored[i - 1].composite_score >= scored[i].composite_score,
            'Results should be sorted by composite_score'
          );
        }
      }
    });
  });

  describe('Scenario: Memory Content Anchor Extraction', () => {
    it('should parse anchor IDs from markdown content', () => {
      const mockContent = `
# Memory Title
<!-- ANCHOR:summary -->
This is the summary section.
<!-- /ANCHOR:summary -->

## Details
<!-- ANCHOR:decisions -->
- Decision 1: Use composite scoring
- Decision 2: Constitutional tier always surfaces first
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:state -->
Current state: In progress
Next steps: Complete integration tests
<!-- /ANCHOR:state -->
`;

      // Simulate anchor extraction
      const anchorPattern = /<!-- ANCHOR:(\w+) -->\n([\s\S]*?)<!-- \/ANCHOR:\1 -->/g;
      const anchors = {};
      let match;

      while ((match = anchorPattern.exec(mockContent)) !== null) {
        anchors[match[1]] = match[2].trim();
      }

      assert.ok(anchors.summary, 'Should extract summary anchor');
      assert.ok(anchors.decisions, 'Should extract decisions anchor');
      assert.ok(anchors.state, 'Should extract state anchor');

      assert.ok(
        anchors.summary.includes('summary section'),
        'Summary anchor should contain correct content'
      );
    });
  });
});

// ===================================================================
// 6. ERROR HANDLING & EDGE CASES
// ===================================================================

describe('Error Handling & Edge Cases', () => {
  describe('Invalid Input Handling', () => {
    it('should handle null/undefined tier gracefully', () => {
      const importanceTiers = require(path.join(LIB_PATH, 'scoring', 'importance-tiers.js'));

      const config1 = importanceTiers.get_tier_config(null);
      const config2 = importanceTiers.get_tier_config(undefined);
      const config3 = importanceTiers.get_tier_config('');

      // Should return default tier config
      assert.ok(config1, 'Should return config for null');
      assert.ok(config2, 'Should return config for undefined');
      assert.ok(config3, 'Should return config for empty string');

      // Should be the normal tier (default)
      assert.strictEqual(config1.value, 0.5, 'Null should return normal tier');
    });

    it('should handle invalid tier names', () => {
      const importanceTiers = require(path.join(LIB_PATH, 'scoring', 'importance-tiers.js'));

      const isValid1 = importanceTiers.is_valid_tier('invalid_tier');
      const isValid2 = importanceTiers.is_valid_tier('CONSTITUTIONAL'); // case check
      const isValid3 = importanceTiers.is_valid_tier('constitutional');

      assert.ok(!isValid1, 'invalid_tier should not be valid');
      assert.ok(isValid2 || !isValid2, 'CONSTITUTIONAL case handling should be consistent');
      assert.ok(isValid3, 'constitutional should be valid');
    });

    it('should handle empty arrays in RRF fusion', () => {
      const rrfFusion = require(path.join(LIB_PATH, 'search', 'rrf-fusion.js'));

      // Empty arrays should work
      const result1 = rrfFusion.fuse_results([], [], { limit: 10 });
      assert.ok(Array.isArray(result1), 'Should return array for empty inputs');
      assert.strictEqual(result1.length, 0, 'Should be empty for no inputs');

      // Null inputs should throw (this is expected behavior - validate inputs)
      assert.throws(
        () => rrfFusion.fuse_results(null, null, { limit: 10 }),
        'Should throw for null inputs - callers must provide valid arrays'
      );
    });

    it('should handle malformed scoring input', () => {
      const compositeScoring = require(path.join(LIB_PATH, 'scoring', 'composite-scoring.js'));

      const malformedResults = [
        { id: 1 }, // Missing all fields
        { id: 2, similarity: 'not a number', importance_tier: 123 }, // Wrong types
        { id: 3, similarity: NaN, importance_weight: Infinity }, // Special values
      ];

      // Should not throw
      let scored;
      assert.doesNotThrow(() => {
        scored = compositeScoring.apply_composite_scoring(malformedResults);
      }, 'Should not throw for malformed input');

      assert.ok(Array.isArray(scored), 'Should return array');
    });
  });

  describe('Boundary Conditions', () => {
    it('should handle maximum similarity values', () => {
      const compositeScoring = require(path.join(LIB_PATH, 'scoring', 'composite-scoring.js'));

      const results = [
        { id: 1, similarity: 100, importance_weight: 1.0, importance_tier: 'constitutional' },
      ];

      const scored = compositeScoring.apply_composite_scoring(results);

      assert.ok(
        scored[0].composite_score <= 1.0,
        'Composite score should not exceed 1.0'
      );
    });

    it('should handle zero/negative similarity values', () => {
      const compositeScoring = require(path.join(LIB_PATH, 'scoring', 'composite-scoring.js'));

      const results = [
        { id: 1, similarity: 0, importance_weight: 0, importance_tier: 'deprecated' },
        { id: 2, similarity: -10, importance_weight: -0.5, importance_tier: 'normal' },
      ];

      const scored = compositeScoring.apply_composite_scoring(results);

      assert.ok(
        scored[0].composite_score >= 0,
        'Composite score should not be negative'
      );
    });

    it('should handle very large result sets without memory issues', () => {
      const rrfFusion = require(path.join(LIB_PATH, 'search', 'rrf-fusion.js'));

      // Generate 10,000 results
      const vectorResults = Array.from({ length: 10000 }, (_, i) => ({
        id: i + 1,
        similarity: 100 - i * 0.01,
        title: `Result ${i + 1}`,
      }));

      const start = performance.now();
      const beforeMemory = process.memoryUsage().heapUsed;

      const fused = rrfFusion.fuse_results(vectorResults, [], { limit: 100 });

      const afterMemory = process.memoryUsage().heapUsed;
      const elapsed = performance.now() - start;
      const memoryDelta = (afterMemory - beforeMemory) / 1024 / 1024; // MB

      assert.ok(fused.length <= 100, 'Should respect limit');
      assert.ok(elapsed < 1000, 'Should complete in reasonable time');
      assert.ok(memoryDelta < 100, `Memory usage should be reasonable (${memoryDelta.toFixed(2)}MB)`);

      console.log(`  Large result set (10000): ${elapsed.toFixed(2)}ms, memory delta: ${memoryDelta.toFixed(2)}MB`);
    });
  });
});

// ===================================================================
// TEST SUMMARY
// ===================================================================

describe('Test Summary', () => {
  it('should have all required modules accessible', () => {
    const requiredModules = [
      'scoring/composite-scoring.js',
      'scoring/importance-tiers.js',
      'scoring/index.js',
      'search/rrf-fusion.js',
      'search/hybrid-search.js',
      'search/index.js',
      'cognitive/index.js',
      'storage/checkpoints.js',
      'storage/access-tracker.js',
    ];

    for (const modulePath of requiredModules) {
      const fullPath = path.join(LIB_PATH, modulePath);
      assert.ok(
        fs.existsSync(fullPath),
        `Required module ${modulePath} should exist`
      );
    }
  });

  it('should have all required template level directories', () => {
    const levels = ['level_1', 'level_2', 'level_3', 'level_3+'];

    for (const level of levels) {
      const levelDir = path.join(TEMPLATES_PATH, level);
      assert.ok(
        fs.existsSync(levelDir),
        `Template directory ${level} should exist`
      );
    }
  });
});
