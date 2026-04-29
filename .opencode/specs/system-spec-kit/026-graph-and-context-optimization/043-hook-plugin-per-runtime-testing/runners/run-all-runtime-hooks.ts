import { mkdirSync } from 'node:fs';

import { RESULTS_DIR, compactStatusCounts, detectSandbox, isDirectRun, writeResults } from './common.ts';
import { runClaudeHookTests } from './test-claude-hooks.ts';
import { runCodexHookTests } from './test-codex-hooks.ts';
import { runCopilotHookTests } from './test-copilot-hooks.ts';
import { runGeminiHookTests } from './test-gemini-hooks.ts';
import { runOpenCodePluginTests } from './test-opencode-plugins.ts';

import type { HookTestResult, SandboxDetection } from './common.ts';

type RuntimeRunner = (sandbox: SandboxDetection) => Promise<readonly HookTestResult[]>;

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
  const sandbox = detectSandbox();
  if (sandbox.sandboxed) {
    process.stderr.write(
      `Sandbox detected (reason: ${sandbox.reason}). Live CLI invocations will be SKIPPED. Direct hook smokes will still run.\n`,
    );
  }

  const batches = await runWithConcurrency(RUNNERS, CONCURRENCY_LIMIT, async (runner) => runner(sandbox));
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
      verdict: counts.FAIL === 0 && counts.TIMEOUT_CELL === 0 ? 'PASS' : 'FAIL',
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
