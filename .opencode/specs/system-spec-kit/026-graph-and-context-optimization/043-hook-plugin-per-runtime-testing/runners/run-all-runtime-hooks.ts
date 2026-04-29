import { mkdirSync } from 'node:fs';

import { RESULTS_DIR, compactStatusCounts, isDirectRun, writeResults } from './common.ts';
import { runClaudeHookTests } from './test-claude-hooks.ts';
import { runCodexHookTests } from './test-codex-hooks.ts';
import { runCopilotHookTests } from './test-copilot-hooks.ts';
import { runGeminiHookTests } from './test-gemini-hooks.ts';
import { runOpenCodePluginTests } from './test-opencode-plugins.ts';

import type { HookTestResult } from './common.ts';

type RuntimeRunner = () => Promise<readonly HookTestResult[]>;

const CONCURRENCY_LIMIT = 3;

const RUNNERS: readonly RuntimeRunner[] = [
  runClaudeHookTests,
  runCodexHookTests,
  runCopilotHookTests,
  runGeminiHookTests,
  runOpenCodePluginTests,
];

async function runWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  task: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await task(items[currentIndex] as T);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export async function runAllRuntimeHooks(): Promise<readonly HookTestResult[]> {
  mkdirSync(RESULTS_DIR, { recursive: true });
  const batches = await runWithConcurrency(RUNNERS, CONCURRENCY_LIMIT, async (runner) => runner());
  const results = batches.flat();
  writeResults(results);
  return results;
}

if (isDirectRun(import.meta.url)) {
  runAllRuntimeHooks().then((results) => {
    const counts = compactStatusCounts(results);
    process.stdout.write(JSON.stringify({
      resultsDir: RESULTS_DIR,
      total: results.length,
      counts,
    }, null, 2));
    process.stdout.write('\n');
    for (const result of results) {
      process.stdout.write(`${result.runtime}\t${result.event}\t${result.status}\t${result.reason}\n`);
    }
  }).catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
