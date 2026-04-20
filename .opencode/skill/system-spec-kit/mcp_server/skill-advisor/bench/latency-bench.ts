// ───────────────────────────────────────────────────────────────
// MODULE: Promotion Latency Benchmark
// ───────────────────────────────────────────────────────────────

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { runScorerBench } from './scorer-bench.js';

export function runPromotionLatencyBench(workspaceRoot?: string) {
  const report = runScorerBench(workspaceRoot);
  return {
    ...report,
    gatePassed: report.cacheHitP95Ms <= 50 && report.uncachedP95Ms <= 60,
  };
}

const invoked = process.argv[1] ? resolve(process.argv[1]) === fileURLToPath(import.meta.url) : false;
if (invoked) {
  const report = runPromotionLatencyBench();
  console.log(`advisor-promotion-latency-bench ${JSON.stringify(report)}`);
  if (!report.gatePassed) process.exitCode = 1;
}
