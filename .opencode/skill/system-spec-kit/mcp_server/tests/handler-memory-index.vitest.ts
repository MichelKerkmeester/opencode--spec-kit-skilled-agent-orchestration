// ───────────────────────────────────────────────────────────────
// 1. HANDLER MEMORY INDEX TESTS
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, afterAll } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

import * as handler from '../handlers/memory-index';

let tempDir: string | null = null;

afterAll(() => {
  if (tempDir && fs.existsSync(tempDir)) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
});

describe('Handler Memory Index (T520) [deferred - requires DB test fixtures]', () => {
  describe('Exports Validation', () => {
    it('T520-1: handleMemoryIndexScan exported', () => {
      expect(typeof handler.handleMemoryIndexScan).toBe('function');
    });

    it('T520-2: indexSingleFile exported', () => {
      expect(typeof handler.indexSingleFile).toBe('function');
    });

    it('T520-3: findConstitutionalFiles exported', () => {
      expect(typeof handler.findConstitutionalFiles).toBe('function');
    });

    it('T520-4: snake_case aliases exported', () => {
      const aliases: Array<keyof typeof handler> = [
        'handle_memory_index_scan',
        'index_single_file',
        'find_constitutional_files',
        'summarize_alias_conflicts',
        'run_divergence_reconcile_hooks',
      ];
      for (const alias of aliases) {
        expect(typeof handler[alias]).toBe('function');
      }
    });

    it('T520-4b: summarizeAliasConflicts exported', () => {
      expect(typeof handler.summarizeAliasConflicts).toBe('function');
    });

    it('T520-4c: runDivergenceReconcileHooks exported', () => {
      expect(typeof handler.runDivergenceReconcileHooks).toBe('function');
    });
  });

  describe('findConstitutionalFiles', () => {
    it('T520-5: non-existent path returns empty array', () => {
      const result = handler.findConstitutionalFiles('/non/existent/path');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('T520-6: path without skill dir returns empty array', () => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-index-'));
      const result = handler.findConstitutionalFiles(tempDir);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('T520-7: finds constitutional .md files', () => {
      const skillDir = path.join(tempDir!, '.opencode', 'skill', 'test-skill', 'constitutional');
      fs.mkdirSync(skillDir, { recursive: true });
      fs.writeFileSync(path.join(skillDir, 'test.md'), '# Test Constitutional');

      const result = handler.findConstitutionalFiles(tempDir!);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
    });

    it('T520-8: constitutional README is skipped', () => {
      const skillDir = path.join(tempDir!, '.opencode', 'skill', 'test-skill', 'constitutional');
      fs.writeFileSync(path.join(skillDir, 'README.md'), '# Readme');

      const result = handler.findConstitutionalFiles(tempDir!);
      const hasReadme = result.some((f) => f.includes('README.md'));
      expect(hasReadme).toBe(false);
    });

    it('T520-9: hidden skill directories are skipped', () => {
      const hiddenDir = path.join(tempDir!, '.opencode', 'skill', '.hidden-skill', 'constitutional');
      fs.mkdirSync(hiddenDir, { recursive: true });
      fs.writeFileSync(path.join(hiddenDir, 'hidden.md'), '# Hidden');

      const result = handler.findConstitutionalFiles(tempDir!);
      const hasHidden = result.some((f) => f.includes('.hidden-skill'));
      expect(hasHidden).toBe(false);
    });
  });

  describe('findSpecDocuments', () => {
    it('T520-9b: deduplicates symlinked specs roots', () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-spec-docs-'));
      try {
        const canonicalSpecs = path.join(root, '.opencode', 'specs');
        const specFolder = path.join(canonicalSpecs, '02--system-spec-kit', '900-dedup-check');
        fs.mkdirSync(specFolder, { recursive: true });
        fs.writeFileSync(path.join(specFolder, 'spec.md'), '# Spec');

        const linkedSpecs = path.join(root, 'specs');
        try {
          fs.symlinkSync(canonicalSpecs, linkedSpecs, 'dir');
        } catch {
          // Symlink creation can fail in restricted test environments.
          const fallbackResult = handler.findSpecDocuments(root);
          expect(Array.isArray(fallbackResult)).toBe(true);
          return;
        }

        const result = handler.findSpecDocuments(root);
        expect(result).toHaveLength(1);
        expect(path.basename(result[0])).toBe('spec.md');
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    });

    it('T520-9c: keeps specFolder filtering with root dedup', () => {
      const root = fs.mkdtempSync(path.join(os.tmpdir(), 'test-spec-docs-filter-'));
      try {
        const canonicalSpecs = path.join(root, '.opencode', 'specs');
        const targetFolder = path.join(canonicalSpecs, '02--system-spec-kit', '910-target');
        const otherFolder = path.join(canonicalSpecs, '02--system-spec-kit', '911-other');
        fs.mkdirSync(targetFolder, { recursive: true });
        fs.mkdirSync(otherFolder, { recursive: true });
        fs.writeFileSync(path.join(targetFolder, 'spec.md'), '# Target Spec');
        fs.writeFileSync(path.join(otherFolder, 'spec.md'), '# Other Spec');

        const linkedSpecs = path.join(root, 'specs');
        try {
          fs.symlinkSync(canonicalSpecs, linkedSpecs, 'dir');
        } catch {
          const fallbackResult = handler.findSpecDocuments(root, { specFolder: '02--system-spec-kit/910-target' });
          expect(Array.isArray(fallbackResult)).toBe(true);
          return;
        }

        const result = handler.findSpecDocuments(root, { specFolder: '02--system-spec-kit/910-target' });
        expect(result).toHaveLength(1);
        expect(result[0].includes('910-target')).toBe(true);
      } finally {
        fs.rmSync(root, { recursive: true, force: true });
      }
    });
  });

  describe('summarizeAliasConflicts', () => {
    it('T520-9d: detects identical-hash alias groups', () => {
      const summary = handler.summarizeAliasConflicts([
        {
          file_path: '/workspace/specs/02--system-spec-kit/200-test/memory/a.md',
          content_hash: 'hash-1',
        },
        {
          file_path: '/workspace/.opencode/specs/02--system-spec-kit/200-test/memory/a.md',
          content_hash: 'hash-1',
        },
      ]);

      expect(summary.groups).toBe(1);
      expect(summary.rows).toBe(2);
      expect(summary.identicalHashGroups).toBe(1);
      expect(summary.divergentHashGroups).toBe(0);
      expect(summary.samples).toHaveLength(1);
      expect(summary.samples[0].hashState).toBe('identical');
    });

    it('T520-9e: detects divergent-hash alias groups', () => {
      const summary = handler.summarizeAliasConflicts([
        {
          file_path: '/workspace/specs/02--system-spec-kit/201-test/memory/b.md',
          content_hash: 'hash-1',
        },
        {
          file_path: '/workspace/.opencode/specs/02--system-spec-kit/201-test/memory/b.md',
          content_hash: 'hash-2',
        },
      ]);

      expect(summary.groups).toBe(1);
      expect(summary.identicalHashGroups).toBe(0);
      expect(summary.divergentHashGroups).toBe(1);
      expect(summary.samples[0].hashState).toBe('divergent');
    });

    it('T520-9f: ignores rows that are not cross-root aliases', () => {
      const summary = handler.summarizeAliasConflicts([
        {
          file_path: '/workspace/specs/02--system-spec-kit/300-test/memory/c.md',
          content_hash: 'hash-1',
        },
        {
          file_path: '/workspace/specs/02--system-spec-kit/301-test/memory/c.md',
          content_hash: 'hash-1',
        },
      ]);

      expect(summary.groups).toBe(0);
      expect(summary.rows).toBe(0);
      expect(summary.identicalHashGroups).toBe(0);
      expect(summary.divergentHashGroups).toBe(0);
      expect(summary.samples).toHaveLength(0);
    });
  });

  describe('runDivergenceReconcileHooks', () => {
    it('T520-9g: applies bounded retries then escalation deterministically', () => {
      const attempts = new Map<string, number>();

      const reconcileHook: NonNullable<
        Parameters<typeof handler.runDivergenceReconcileHooks>[1]
      >['reconcileHook'] = (_db, input) => {
        const maxRetries = input.maxRetries ?? 3;
        const attemptsSoFar = attempts.get(input.normalizedPath) ?? 0;
        const shouldRetry = attemptsSoFar < maxRetries;
        if (shouldRetry) {
          attempts.set(input.normalizedPath, attemptsSoFar + 1);
          return {
            policy: {
              normalizedPath: input.normalizedPath,
              attemptsSoFar,
              nextAttempt: attemptsSoFar + 1,
              maxRetries,
              shouldRetry: true,
              exhausted: false,
            },
            retryEntryId: attemptsSoFar + 1,
            escalationEntryId: null,
            escalation: null,
          };
        }

        return {
          policy: {
            normalizedPath: input.normalizedPath,
            attemptsSoFar,
            nextAttempt: attemptsSoFar + 1,
            maxRetries,
            shouldRetry: false,
            exhausted: true,
          },
          retryEntryId: null,
          escalationEntryId: 999,
          escalation: {
            code: 'E_DIVERGENCE_RECONCILE_RETRY_EXHAUSTED',
            normalizedPath: input.normalizedPath,
            attempts: attemptsSoFar,
            maxRetries,
            recommendation: 'manual_triage_required',
            reason: `Auto-reconcile exhausted after ${maxRetries} attempt(s)`,
            variants: input.variants ?? [],
          },
        };
      };

      const aliasConflicts = {
        groups: 1,
        rows: 2,
        identicalHashGroups: 0,
        divergentHashGroups: 1,
        unknownHashGroups: 0,
        samples: [
          {
            normalizedPath: '/workspace/specs/02--system-spec-kit/777-test/memory/a.md',
            hashState: 'divergent' as const,
            variants: [
              '/workspace/specs/02--system-spec-kit/777-test/memory/a.md',
              '/workspace/.opencode/specs/02--system-spec-kit/777-test/memory/a.md',
            ],
          },
        ],
      };

      const options = {
        maxRetries: 2,
        requireDatabase: () => ({}) as never,
        reconcileHook,
      };

      const first = handler.runDivergenceReconcileHooks(aliasConflicts, options);
      const second = handler.runDivergenceReconcileHooks(aliasConflicts, options);
      const third = handler.runDivergenceReconcileHooks(aliasConflicts, options);

      expect(first.candidates).toBe(1);
      expect(first.retriesScheduled).toBe(1);
      expect(first.escalated).toBe(0);
      expect(second.retriesScheduled).toBe(1);
      expect(second.escalated).toBe(0);
      expect(third.retriesScheduled).toBe(0);
      expect(third.escalated).toBe(1);
      expect(third.escalations).toHaveLength(1);
      expect(third.escalations[0].code).toBe('E_DIVERGENCE_RECONCILE_RETRY_EXHAUSTED');
      expect(third.escalations[0].attempts).toBe(2);
    });

    it('T520-9h: skips database hook when no divergent samples exist', () => {
      let dbCalls = 0;
      const summary = handler.runDivergenceReconcileHooks(
        {
          groups: 1,
          rows: 2,
          identicalHashGroups: 1,
          divergentHashGroups: 0,
          unknownHashGroups: 0,
          samples: [
            {
              normalizedPath: '/workspace/specs/02--system-spec-kit/778-test/memory/b.md',
              hashState: 'identical',
              variants: [
                '/workspace/specs/02--system-spec-kit/778-test/memory/b.md',
                '/workspace/.opencode/specs/02--system-spec-kit/778-test/memory/b.md',
              ],
            },
          ],
        },
        {
          requireDatabase: () => {
            dbCalls++;
            throw new Error('should not be called');
          },
        }
      );

      expect(dbCalls).toBe(0);
      expect(summary.candidates).toBe(0);
      expect(summary.retriesScheduled).toBe(0);
      expect(summary.escalated).toBe(0);
      expect(summary.errors).toHaveLength(0);
    });

    it('T520-9i: expands beyond sample cap when divergent group count is higher', () => {
      const calledPaths: string[] = [];
      const rows = [
        { file_path: '/workspace/specs/02--system-spec-kit/801-a/memory/x.md', content_hash: 'hash-a' },
        { file_path: '/workspace/.opencode/specs/02--system-spec-kit/801-a/memory/x.md', content_hash: 'hash-b' },
        { file_path: '/workspace/specs/02--system-spec-kit/802-b/memory/y.md', content_hash: 'hash-c' },
        { file_path: '/workspace/.opencode/specs/02--system-spec-kit/802-b/memory/y.md', content_hash: 'hash-d' },
        { file_path: '/workspace/specs/02--system-spec-kit/803-c/memory/z.md', content_hash: 'hash-e' },
        { file_path: '/workspace/.opencode/specs/02--system-spec-kit/803-c/memory/z.md', content_hash: 'hash-f' },
      ];

      const fakeDb = {
        prepare: () => ({
          all: () => rows,
        }),
      };

      const summary = handler.runDivergenceReconcileHooks(
        {
          groups: 7,
          rows: 14,
          identicalHashGroups: 2,
          divergentHashGroups: 3,
          unknownHashGroups: 2,
          samples: [
            {
              normalizedPath: '/workspace/specs/02--system-spec-kit/801-a/memory/x.md',
              hashState: 'divergent',
              variants: [
                '/workspace/specs/02--system-spec-kit/801-a/memory/x.md',
                '/workspace/.opencode/specs/02--system-spec-kit/801-a/memory/x.md',
              ],
            },
          ],
        },
        {
          requireDatabase: () => fakeDb as never,
          reconcileHook: (_db, input) => {
            calledPaths.push(input.normalizedPath);
            return {
              policy: {
                normalizedPath: input.normalizedPath,
                attemptsSoFar: 0,
                nextAttempt: 1,
                maxRetries: 3,
                shouldRetry: true,
                exhausted: false,
              },
              retryEntryId: 1,
              escalationEntryId: null,
              escalation: null,
            };
          },
        }
      );

      expect(summary.candidates).toBe(3);
      expect(summary.retriesScheduled).toBe(3);
      expect(summary.escalated).toBe(0);
      expect(summary.errors).toHaveLength(0);
      expect(calledPaths).toEqual([
        '/workspace/specs/02--system-spec-kit/801-a/memory/x.md',
        '/workspace/specs/02--system-spec-kit/802-b/memory/y.md',
        '/workspace/specs/02--system-spec-kit/803-c/memory/z.md',
      ]);
    });
  });

  describe('handleMemoryIndexScan Input/Behavior', () => {
    it('T520-10: empty args returns valid response', async () => {
      try {
        const result = await handler.handleMemoryIndexScan({});
        expect(result).toBeTruthy();
        expect(result.content).toBeTruthy();
        expect(result.content.length).toBeGreaterThan(0);

        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data || parsed.summary).toBeTruthy();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        const isServerDep = /database|getDb|Rate limited|vector_index|null|not initialized|Database/.test(message);
        if (!isServerDep) {
          throw error;
        }
      }
    });
  });
});
