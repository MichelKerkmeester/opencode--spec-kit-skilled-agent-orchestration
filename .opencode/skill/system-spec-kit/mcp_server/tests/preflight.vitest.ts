// ───────────────────────────────────────────────────────────────
// 1. PREFLIGHT VALIDATION TESTS (T067-T070, T156-T166)
// ───────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest';
import * as preflight from '../lib/validation/preflight';

type DuplicateParams = Parameters<typeof preflight.checkDuplicate>[0];

/* ───────────────────────────────────────────────────────────────
   Test Data
──────────────────────────────────────────────────────────────── */

const TEST_CONTENT_VALID = `# Test Memory

This is a test memory file with valid content.

<!-- ANCHOR:summary -->
This is the summary section.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:decisions -->
- Decision 1: Use preflight validation
- Decision 2: Support dry-run mode
<!-- /ANCHOR:decisions -->

## Trigger Phrases

- test preflight
- validate memory
`;

const TEST_CONTENT_UNCLOSED_ANCHOR = `# Test Memory

<!-- ANCHOR:summary -->
This anchor is never closed.

More content here.
`;

const TEST_CONTENT_INVALID_ANCHOR_ID = `# Test Memory

<!-- ANCHOR:invalid!id@here -->
Content
<!-- /ANCHOR:invalid!id@here -->
`;

const TEST_CONTENT_DUPLICATE_ANCHOR = `# Test Memory

<!-- ANCHOR:summary -->
First summary
<!-- /ANCHOR:summary -->

<!-- ANCHOR:summary -->
Duplicate summary
<!-- /ANCHOR:summary -->
`;

const TEST_CONTENT_SMALL = 'Hi';

const TEST_CONTENT_LARGE = 'x'.repeat(150000);
const TEST_CONTENT_OVER_MAX = 'x'.repeat(260000);

describe('Preflight Validation', () => {

  /* ───────────────────────────────────────────────────────────────
     Anchor Format Validation (T068, CHK-156)
  ──────────────────────────────────────────────────────────────── */

  describe('Anchor Format Validation (T068, CHK-156)', () => {
    it('valid anchor format accepted', () => {
      const result = preflight.validateAnchorFormat(TEST_CONTENT_VALID);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.anchors).toContain('summary');
      expect(result.anchors).toContain('decisions');
    });

    it('unclosed anchor detected', () => {
      const result = preflight.validateAnchorFormat(TEST_CONTENT_UNCLOSED_ANCHOR);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.code === preflight.PreflightErrorCodes.ANCHOR_UNCLOSED)).toBe(true);
    });

    it('invalid anchor ID detected', () => {
      const result = preflight.validateAnchorFormat(TEST_CONTENT_INVALID_ANCHOR_ID);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === preflight.PreflightErrorCodes.ANCHOR_ID_INVALID)).toBe(true);
    });

    it('duplicate anchor ID detected', () => {
      const result = preflight.validateAnchorFormat(TEST_CONTENT_DUPLICATE_ANCHOR);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID)).toBe(true);
    });

    it('empty content handled', () => {
      const result = preflight.validateAnchorFormat('');
      expect(result.valid).toBe(true);
      expect(result.warnings.length > 0 || result.anchors.length === 0).toBe(true);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Duplicate Detection (T069, CHK-157)
  ──────────────────────────────────────────────────────────────── */

  describe('Duplicate Detection (T069, CHK-157)', () => {
    it('duplicate check without database', () => {
      const result = preflight.checkDuplicate(
        { content: TEST_CONTENT_VALID },
        { check_exact: true }
      );
      expect(result.isDuplicate).toBe(false);
      expect(result.content_hash).toBeTruthy();
      expect(result.content_hash).toHaveLength(64);
    });

    it('content hash computation correct', () => {
      const hash1 = preflight.computeContentHash(TEST_CONTENT_VALID);
      const hash2 = preflight.computeContentHash(TEST_CONTENT_VALID);
      const hash3 = preflight.computeContentHash(TEST_CONTENT_VALID + ' ');
      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(hash3);
    });

    it('ignores exact duplicate hits when stored content verification fails', () => {
      const contentHash = preflight.computeContentHash(TEST_CONTENT_VALID);
      const fakeDb = {
        prepare: () => ({
          get: () => ({
            id: 41,
            file_path: '/tmp/mismatched-memory.md',
            content_text: 'Stored content that does not match the incoming payload.',
          }),
        }),
      };

      const result = preflight.checkDuplicate(
        {
          content: TEST_CONTENT_VALID,
          content_hash: contentHash,
          database: fakeDb as DuplicateParams['database'],
        },
        { check_exact: true }
      );

      expect(result.isDuplicate).toBe(false);
      expect(result.duplicate_type).toBeNull();
      expect(result.existingId).toBeNull();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Token Budget Estimation (T070, CHK-158)
  ──────────────────────────────────────────────────────────────── */

  describe('Token Budget Estimation (T070, CHK-158)', () => {
    it('token estimation correct', () => {
      const content = 'a'.repeat(400); // 400 chars ~ 100 tokens at 4 chars/token
      const tokens = preflight.estimateTokens(content);
      expect(tokens).toBeGreaterThanOrEqual(90);
      expect(tokens).toBeLessThanOrEqual(110);
    });

    it('token budget within limits', () => {
      const result = preflight.checkTokenBudget(TEST_CONTENT_VALID, {
        maxTokens: 8000,
      });
      expect(result.within_budget).toBe(true);
      expect(result.estimated_tokens).toBeGreaterThan(0);
      expect(result.percentage_used).toBeLessThan(1);
    });

    it('token budget exceeded detected', () => {
      const result = preflight.checkTokenBudget(TEST_CONTENT_LARGE, {
        maxTokens: 1000,
      });
      expect(result.within_budget).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.code === preflight.PreflightErrorCodes.TOKEN_BUDGET_EXCEEDED)).toBe(true);
    });

    it('token budget warning generated', () => {
      const content = 'a'.repeat(2800); // ~800 tokens
      const result = preflight.checkTokenBudget(content, {
        maxTokens: 1000,
        warning_threshold: 0.7,
      });
      expect(result.within_budget).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Content Size Validation
  ──────────────────────────────────────────────────────────────── */

  describe('Content Size Validation', () => {
    it('valid content size accepted', () => {
      const result = preflight.validateContentSize(TEST_CONTENT_VALID);
      expect(result.valid).toBe(true);
      expect(result.content_length).toBeGreaterThan(0);
    });

    it('content too small detected', () => {
      const result = preflight.validateContentSize(TEST_CONTENT_SMALL, {
        min_length: 10,
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === preflight.PreflightErrorCodes.CONTENT_TOO_SMALL)).toBe(true);
    });

    it('content too large detected', () => {
      const result = preflight.validateContentSize(TEST_CONTENT_LARGE, {
        maxLength: 100000,
      });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.code === preflight.PreflightErrorCodes.CONTENT_TOO_LARGE)).toBe(true);
    });

    it('chunk-eligible content emits warning but stays valid', () => {
      const result = preflight.validateContentSize(TEST_CONTENT_LARGE);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings.some(w => w.code === preflight.PreflightErrorCodes.CONTENT_TOO_LARGE)).toBe(true);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Unified Preflight (T067, CHK-159, CHK-160)
  ──────────────────────────────────────────────────────────────── */

  describe('Unified Preflight (T067, CHK-159, CHK-160)', () => {
    it('run_preflight with valid content passes', () => {
      const result = preflight.runPreflight(
        { content: TEST_CONTENT_VALID, file_path: '/test/memory.md', spec_folder: 'test-spec' },
        { check_anchors: true, check_tokens: true, check_size: true }
      );
      expect(result.pass).toBe(true);
      expect(result.details.checks_run.length).toBeGreaterThan(0);
    });

    it('run_preflight with invalid content fails', () => {
      const result = preflight.runPreflight(
        { content: TEST_CONTENT_OVER_MAX, file_path: '/test/memory.md', spec_folder: 'test-spec' },
        { check_anchors: true, check_tokens: true, check_size: true }
      );
      expect(result.pass).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('dry-run mode (CHK-160)', () => {
      const result = preflight.runPreflight(
        { content: TEST_CONTENT_OVER_MAX, file_path: '/test/memory.md', spec_folder: 'test-spec' },
        { dry_run: true, check_anchors: true, check_tokens: true, check_size: true }
      );
      expect(result.pass).toBe(true);
      expect(result.dry_run).toBe(true);
      expect(result.dry_run_would_pass).toBe(false);
    });

    it('selective check disabling', () => {
      const result = preflight.runPreflight(
        { content: TEST_CONTENT_UNCLOSED_ANCHOR, file_path: '/test/memory.md', spec_folder: 'test-spec' },
        { check_anchors: false, check_tokens: true, check_size: true }
      );
      expect(result.pass).toBe(true);
      expect(result.details.checks_run).not.toContain('anchor_format');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     PreflightError Class (T157)
  ──────────────────────────────────────────────────────────────── */

  describe('PreflightError Class (T157)', () => {
    it('PreflightError class works correctly', () => {
      const error = new preflight.PreflightError(
        preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID,
        'Test error message',
        { recoverable: true, suggestion: 'Fix the anchors' }
      );

      expect(error.code).toBe(preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID);
      expect(error.message).toBe('Test error message');
      expect(error.recoverable).toBe(true);
      expect(error.suggestion).toBe('Fix the anchors');
      expect(error.name).toBe('PreflightError');

      // Test JSON serialization
      const json = error.toJSON();
      expect(json.code).toBeTruthy();
      expect(json.message).toBeTruthy();
    });

    it('PreflightError structure completeness', () => {
      // Test with minimal arguments
      const minError = new preflight.PreflightError('TEST001', 'Minimal error');
      expect(minError.name).toBe('PreflightError');
      expect(minError.code).toBe('TEST001');
      expect(minError.message).toBe('Minimal error');
      expect(minError.recoverable).toBe(false);
      expect(minError.suggestion).toBeNull();
      expect(minError.details).toEqual({});

      // Test toJSON includes all fields
      const json = minError.toJSON();
      expect(json).toHaveProperty('code');
      expect(json).toHaveProperty('message');
      expect(json).toHaveProperty('details');
      expect(json).toHaveProperty('recoverable');
      expect(json).toHaveProperty('suggestion');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     PreflightErrorCodes Enum (T158)
  ──────────────────────────────────────────────────────────────── */

  describe('PreflightErrorCodes Enum (T158)', () => {
    it('anchor-related codes (PF001-PF003)', () => {
      const codes = preflight.PreflightErrorCodes;
      expect(codes.ANCHOR_FORMAT_INVALID).toBe('PF001');
      expect(codes.ANCHOR_UNCLOSED).toBe('PF002');
      expect(codes.ANCHOR_ID_INVALID).toBe('PF003');
    });

    it('duplicate-related codes (PF010-PF012)', () => {
      const codes = preflight.PreflightErrorCodes;
      expect(codes.DUPLICATE_DETECTED).toBe('PF010');
      expect(codes.DUPLICATE_EXACT).toBe('PF011');
      expect(codes.DUPLICATE_SIMILAR).toBe('PF012');
    });

    it('token-related codes (PF020-PF021)', () => {
      const codes = preflight.PreflightErrorCodes;
      expect(codes.TOKEN_BUDGET_EXCEEDED).toBe('PF020');
      expect(codes.TOKEN_BUDGET_WARNING).toBe('PF021');
    });

    it('content size codes (PF030-PF031)', () => {
      const codes = preflight.PreflightErrorCodes;
      expect(codes.CONTENT_TOO_LARGE).toBe('PF030');
      expect(codes.CONTENT_TOO_SMALL).toBe('PF031');
    });

    it('all expected codes exist', () => {
      const codes = preflight.PreflightErrorCodes;
      const expectedCodes = [
        'ANCHOR_FORMAT_INVALID', 'ANCHOR_UNCLOSED', 'ANCHOR_ID_INVALID',
        'DUPLICATE_DETECTED', 'DUPLICATE_EXACT', 'DUPLICATE_SIMILAR',
        'TOKEN_BUDGET_EXCEEDED', 'TOKEN_BUDGET_WARNING',
        'CONTENT_TOO_LARGE', 'CONTENT_TOO_SMALL'
      ];
      for (const codeName of expectedCodes) {
        expect(codeName in codes).toBe(true);
      }
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Anchor Format Validation — Extended (T159-T162)
  ──────────────────────────────────────────────────────────────── */

  describe('Anchor Format Validation — Extended (T159-T162)', () => {
    it('T159: valid anchor ID formats accepted', () => {
      const validIdContent = `
<!-- ANCHOR:simple -->content<!-- /ANCHOR:simple -->
<!-- ANCHOR:with-hyphens -->content<!-- /ANCHOR:with-hyphens -->
<!-- ANCHOR:spec-folder/section -->content<!-- /ANCHOR:spec-folder/section -->
<!-- ANCHOR:001-numbered -->content<!-- /ANCHOR:001-numbered -->
<!-- ANCHOR:CamelCase123 -->content<!-- /ANCHOR:CamelCase123 -->
`;
      const result = preflight.validateAnchorFormat(validIdContent);
      expect(result.valid).toBe(true);
      expect(result.anchors).toHaveLength(5);
      expect(result.anchors).toContain('simple');
      expect(result.anchors).toContain('with-hyphens');
      expect(result.anchors).toContain('spec-folder/section');
    });

    it('T160: unique anchor ID enforcement', () => {
      const duplicateContent = `
<!-- ANCHOR:unique1 -->First unique<!-- /ANCHOR:unique1 -->
<!-- ANCHOR:unique2 -->Second unique<!-- /ANCHOR:unique2 -->
<!-- ANCHOR:unique1 -->Duplicate of first<!-- /ANCHOR:unique1 -->
`;
      const result = preflight.validateAnchorFormat(duplicateContent);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(1);

      const dupError = result.errors.find(e =>
        e.message && e.message.includes('Duplicate anchor ID')
      );
      expect(dupError).toBeTruthy();
      expect(dupError!.anchorId).toBe('unique1');
    });

    it('T161: matching open/close anchor tags', () => {
      const matchingContent = `
<!-- ANCHOR:test-section -->
This section has matching tags.
<!-- /ANCHOR:test-section -->
`;
      const result = preflight.validateAnchorFormat(matchingContent);
      expect(result.valid).toBe(true);
      expect(result.anchors).toHaveLength(1);
      expect(result.anchors[0]).toBe('test-section');

      // Test case insensitivity for anchor/ANCHOR
      const mixedCaseContent = `
<!-- anchor:lowercase -->content<!-- /ANCHOR:lowercase -->
<!-- ANCHOR:uppercase -->content<!-- /anchor:uppercase -->
`;
      const mixedResult = preflight.validateAnchorFormat(mixedCaseContent);
      expect(mixedResult.valid).toBe(true);
      expect(mixedResult.anchors).toHaveLength(2);
    });

    it('T162: unclosed anchor detection (detailed)', () => {
      const unclosedContent = `
<!-- ANCHOR:closed-ok -->This is closed properly<!-- /ANCHOR:closed-ok -->
<!-- ANCHOR:never-closed -->
This anchor tag is never closed.
More content follows.
`;
      const result = preflight.validateAnchorFormat(unclosedContent);
      expect(result.valid).toBe(false);
      expect(result.anchors).toContain('closed-ok');

      const unclosedError = result.errors.find(e =>
        e.code === preflight.PreflightErrorCodes.ANCHOR_UNCLOSED
      );
      expect(unclosedError).toBeTruthy();
      expect(unclosedError!.anchorId).toBe('never-closed');
      expect(unclosedError!.suggestion).toBeTruthy();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Duplicate Detection — Extended (T163-T164)
  ──────────────────────────────────────────────────────────────── */

  describe('Duplicate Detection — Extended (T163-T164)', () => {
    it('T163: exact duplicate match via content hash', () => {
      const testContent = 'Test memory content for exact match detection';
      const contentHash = preflight.computeContentHash(testContent);

      const mockDatabase = {
        prepare: (sql: any) => ({
          get: (...params: any[]) => {
            if (params[0] === contentHash) {
              return { id: 42, file_path: '/specs/test/memory/existing.md' };
            }
            return null;
          }
        })
      };

      const result = preflight.checkDuplicate(
        { content: testContent, database: mockDatabase } as unknown as DuplicateParams,
        { check_exact: true }
      );

      expect(result.isDuplicate).toBe(true);
      expect(result.duplicate_type).toBe('exact');
      expect(result.existingId).toBe(42);
      expect(result.existing_path).toBe('/specs/test/memory/existing.md');
      expect(result.similarity).toBe(1.0);
      expect(result.content_hash).toBe(contentHash);
    });

    it('no exact duplicate match', () => {
      const testContent = 'Unique content that has no duplicate';

      const mockDatabase = {
        prepare: () => ({
          get: () => null
        })
      };

      const result = preflight.checkDuplicate(
        { content: testContent, database: mockDatabase } as unknown as DuplicateParams,
        { check_exact: true }
      );

      expect(result.isDuplicate).toBe(false);
      expect(result.duplicate_type).toBeNull();
      expect(result.content_hash).toBeTruthy();
    });

    it('filters exact duplicates by governed scope when scope values are provided', () => {
      const testContent = 'Tenant scoped duplicate';
      const contentHash = preflight.computeContentHash(testContent);
      const mockDatabase = {
        prepare: (sql: string) => ({
          get: (...params: unknown[]) => {
            expect(sql).toContain('tenant_id = ?');
            expect(sql).toContain('user_id = ?');
            expect(params).toEqual([contentHash, 'tenant-a', 'user-a']);
            return {
              id: 51,
              file_path: '/specs/test/memory/scoped.md',
              tenant_id: 'tenant-a',
              user_id: 'user-a',
              agent_id: null,
              shared_space_id: null,
            };
          }
        })
      };

      const result = preflight.checkDuplicate(
        { content: testContent, database: mockDatabase, tenantId: 'tenant-a', userId: 'user-a' } as unknown as DuplicateParams,
        { check_exact: true }
      );

      expect(result.isDuplicate).toBe(true);
      expect(result.existing_path).toBe('/specs/test/memory/scoped.md');
      expect(result.redactedForScope).toBe(false);
    });

    it('T164: similar duplicate match via vector', () => {
      const testContent = 'Test memory content for similarity detection';
      const mockEmbedding = new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5]);

      const mockFindSimilar = (embedding: any, options: any) => {
        return [
          {
            id: 99,
            file_path: '/specs/test/memory/similar.md',
            similarity: 0.97
          }
        ];
      };

      const result = preflight.checkDuplicate(
        {
          content: testContent,
          embedding: mockEmbedding,
          find_similar: mockFindSimilar
        },
        { check_exact: false, check_similar: true, similarity_threshold: 0.95 }
      );

      expect(result.isDuplicate).toBe(true);
      expect(result.duplicate_type).toBe('similar');
      expect(result.existingId).toBe(99);
      expect(result.similarity).toBe(0.97);
    });

    it('similar match below threshold correctly ignored', () => {
      const testContent = 'Test content';
      const mockEmbedding = new Float32Array([0.1, 0.2, 0.3]);

      const mockFindSimilar = () => [
        { id: 100, file_path: '/test.md', similarity: 0.80 }
      ];

      const result = preflight.checkDuplicate(
        { content: testContent, embedding: mockEmbedding, find_similar: mockFindSimilar },
        { check_exact: false, check_similar: true, similarity_threshold: 0.95 }
      );

      expect(result.isDuplicate).toBe(false);
      expect(result.duplicate_type).toBeNull();
    });

    it('redacts duplicate metadata when similar match belongs to a different scope', () => {
      const result = preflight.checkDuplicate(
        {
          content: 'Cross-scope similar memory',
          embedding: new Float32Array([0.1, 0.2, 0.3]),
          tenantId: 'tenant-a',
          find_similar: () => [
            {
              id: 101,
              file_path: '/specs/test/memory/other-scope.md',
              similarity: 0.96,
              tenant_id: 'tenant-b',
              user_id: null,
              agent_id: null,
              shared_space_id: null,
            }
          ],
        },
        { check_exact: false, check_similar: true, similarity_threshold: 0.95 }
      );

      expect(result.isDuplicate).toBe(true);
      expect(result.duplicate_type).toBe('similar');
      expect(result.existingId).toBeNull();
      expect(result.existing_path).toBeNull();
      expect(result.redactedForScope).toBe(true);
      expect(result.existing_scope).toBeUndefined();
    });

    it('redacts exact-duplicate identifiers when cross-scope match is detected', () => {
      const testContent = 'Cross-scope exact duplicate';
      const contentHash = preflight.computeContentHash(testContent);
      const mockDatabase = {
        prepare: (_sql: string) => ({
          get: (...params: unknown[]) => {
            expect(params[0]).toBe(contentHash);
            return {
              id: 404,
              file_path: '/specs/test/memory/foreign.md',
              tenant_id: 'tenant-b',
              user_id: 'user-b',
              agent_id: null,
              shared_space_id: null,
              content_text: testContent,
            };
          },
        }),
      };

      const result = preflight.checkDuplicate(
        {
          content: testContent,
          database: mockDatabase,
          tenantId: 'tenant-a',
          userId: 'user-a',
        } as unknown as DuplicateParams,
        { check_exact: true },
      );

      expect(result.isDuplicate).toBe(true);
      expect(result.duplicate_type).toBe('exact');
      expect(result.redactedForScope).toBe(true);
      expect(result.existingId).toBeNull();
      expect(result.existing_path).toBeNull();
      expect(result.existing_scope).toBeUndefined();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Token Budget — Extended (T165-T166)
  ──────────────────────────────────────────────────────────────── */

  describe('Token Budget — Extended (T165-T166)', () => {
    it('T165: token estimation ~4 chars/token ratio', () => {
      const charsPerToken = 4;

      // 400 characters should yield 100 tokens
      const tokens400 = preflight.estimateTokens('a'.repeat(400));
      expect(tokens400).toBe(Math.ceil(400 / charsPerToken));

      // 800 characters should yield 200 tokens
      const tokens800 = preflight.estimateTokens('b'.repeat(800));
      expect(tokens800).toBe(Math.ceil(800 / charsPerToken));

      // 40 characters should yield 10 tokens
      const tokens40 = preflight.estimateTokens('c'.repeat(40));
      expect(tokens40).toBe(Math.ceil(40 / charsPerToken));

      // Verify the ratio: tokens * 4 should approximately equal chars
      const tokens1000 = preflight.estimateTokens('d'.repeat(1000));
      const inferredRatio = 1000 / tokens1000;
      expect(inferredRatio).toBeGreaterThanOrEqual(3.9);
      expect(inferredRatio).toBeLessThanOrEqual(4.1);
    });

    it('T166: token budget warning at 80% threshold', () => {
      // 2800 chars → ~700 tokens + 150 overhead = ~850 tokens = 85% of 1000
      const content = 'x'.repeat(2800);
      const result = preflight.checkTokenBudget(content, {
        maxTokens: 1000,
        warning_threshold: 0.8,
        include_embedding_overhead: true
      });

      expect(result.within_budget).toBe(true);
      expect(result.percentage_used).toBeGreaterThanOrEqual(0.8);
      expect(result.warnings.length).toBeGreaterThan(0);

      const warning = result.warnings[0];
      if (typeof warning === 'string') {
        expect(warning.length).toBeGreaterThan(0);
      } else {
        expect(warning.code).toBe(preflight.PreflightErrorCodes.TOKEN_BUDGET_WARNING);
        expect(warning.suggestion).toBeTruthy();
      }
    });

    it('no warning below 80% threshold', () => {
      const content = 'y'.repeat(1000); // ~286 tokens + 150 overhead = ~436 tokens = 43.6% of 1000
      const result = preflight.checkTokenBudget(content, {
        maxTokens: 1000,
        warning_threshold: 0.8,
        include_embedding_overhead: true
      });

      expect(result.within_budget).toBe(true);
      expect(result.percentage_used).toBeLessThan(0.8);
      expect(result.warnings).toHaveLength(0);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     run_preflight() Combined (T156)
  ──────────────────────────────────────────────────────────────── */

  describe('run_preflight() Combined (T156)', () => {
    it('combines all validation checks', () => {
      const validContent = `# Test Memory

<!-- ANCHOR:summary -->
Test summary content here.
<!-- /ANCHOR:summary -->

This is additional content to ensure size validation passes.
`;

      const result = preflight.runPreflight(
        {
          content: validContent,
          file_path: '/specs/test/memory/test.md',
          spec_folder: 'test-spec'
        },
        {
          check_anchors: true,
          check_tokens: true,
          check_size: true,
          check_duplicates: true
        }
      );

      expect(result.details.checks_run).toContain('content_size');
      expect(result.details.checks_run).toContain('anchor_format');
      expect(result.details.checks_run).toContain('token_budget');
      expect(result.details.checks_run).toContain('duplicate_check');

      expect(result.details.content_size).toBeTruthy();
      expect(result.details.anchor_format).toBeTruthy();
      expect(result.details.token_budget).toBeTruthy();
      expect(result.details.duplicate_check).toBeTruthy();

      expect(result.pass).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('aggregates errors from multiple checks', () => {
      // Content with size issue (too small)
      const tinyContent = 'Hi';

      const result = preflight.runPreflight(
        { content: tinyContent, file_path: '/test.md', spec_folder: 'test' },
        {
          check_anchors: true,
          check_tokens: true,
          check_size: true,
          strict_anchors: false
        }
      );

      expect(result.pass).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(1);

      const sizeError = result.errors.find(e =>
        e.code === preflight.PreflightErrorCodes.CONTENT_TOO_SMALL
      );
      expect(sizeError).toBeTruthy();

      expect(result.details.checks_run.length).toBeGreaterThan(0);
      expect(result.details.checks_run).toContain('content_size');
    });
  });
});
