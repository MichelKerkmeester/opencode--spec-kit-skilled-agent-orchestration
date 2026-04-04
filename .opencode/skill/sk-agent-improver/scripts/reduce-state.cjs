// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Ledger Reducer — Dashboard and Registry Generator                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readOptionalUtf8(filePath) {
  try {
    return readUtf8(filePath);
  } catch (_error) {
    return null;
  }
}

function parseJson(content, fallback) {
  try {
    return JSON.parse(content);
  } catch (_error) {
    return fallback;
  }
}

function writeUtf8(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function parseJsonl(content) {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line)];
      } catch (_error) {
        return [];
      }
    });
}

function inferProfileId(record) {
  if (record.profileId) {
    return record.profileId;
  }
  if (/context-prime/i.test(record.path || '') || /context-prime/i.test(record.target || '')) {
    return 'context-prime';
  }
  return 'handover';
}

function inferFamily(record, profileId) {
  if (record.family) return record.family;
  if (profileId === 'context-prime') return 'session-bootstrap';
  if (profileId === 'handover') return 'session-handover';
  return profileId;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROFILE BUCKET
// ─────────────────────────────────────────────────────────────────────────────

function createProfileBucket(profileId, family) {
  return {
    profileId,
    family,
    latestRecord: null,
    bestPromptRecord: null,
    bestBenchmarkRecord: null,
    acceptedCandidates: [],
    rejectedCandidates: [],
    benchmarkRuns: [],
    infraFailures: [],
    promptRecommendations: [],
    benchmarkRecommendations: [],
    failureModes: {},
    metrics: {
      totalRecords: 0,
      promptRuns: 0,
      benchmarkRuns: 0,
      acceptedCount: 0,
      rejectedCount: 0,
      tieCount: 0,
      keepBaselineCount: 0,
      infraFailureCount: 0,
      benchmarkPassCount: 0,
      benchmarkFailCount: 0,
    },
    dimensionScores: {
      structural: [],
      ruleCoherence: [],
      integration: [],
      outputQuality: [],
      systemFitness: [],
    },
    dimensionTrends: {},
  };
}

function incrementFailureModes(bucket, record) {
  for (const mode of record.failureModes || []) {
    bucket.failureModes[mode] = (bucket.failureModes[mode] || 0) + 1;
  }
}

function maybeSetBestPrompt(bucket, record) {
  if (record.type === 'benchmark_run') {
    return;
  }
  const candidateScore = Number(record.score ?? record.totals?.candidate ?? -Infinity);
  const currentScore = Number(bucket.bestPromptRecord?.score ?? bucket.bestPromptRecord?.totals?.candidate ?? -Infinity);
  if (candidateScore > currentScore) {
    bucket.bestPromptRecord = record;
  }
}

function maybeSetBestBenchmark(bucket, record) {
  if (record.type !== 'benchmark_run') {
    return;
  }
  const currentScore = Number(bucket.bestBenchmarkRecord?.aggregateScore ?? -Infinity);
  if (Number(record.aggregateScore ?? -Infinity) > currentScore) {
    bucket.bestBenchmarkRecord = record;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REGISTRY BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildRegistry(records) {
  const profiles = {};
  const globalMetrics = {
    totalRecords: records.length,
    targetProfiles: 0,
    promptRuns: 0,
    benchmarkRuns: 0,
    acceptedCount: 0,
    rejectedCount: 0,
    tieCount: 0,
    keepBaselineCount: 0,
    infraFailureCount: 0,
    benchmarkPassCount: 0,
    benchmarkFailCount: 0,
  };

  for (const record of records) {
    const profileId = inferProfileId(record);
    const family = inferFamily(record, profileId);
    if (!profiles[profileId]) {
      profiles[profileId] = createProfileBucket(profileId, family);
    }

    const bucket = profiles[profileId];
    bucket.latestRecord = record;
    bucket.metrics.totalRecords += 1;
    incrementFailureModes(bucket, record);

    if (record.type === 'benchmark_run') {
      bucket.metrics.benchmarkRuns += 1;
      globalMetrics.benchmarkRuns += 1;
      bucket.benchmarkRuns.push(record);
      bucket.benchmarkRecommendations.push(record.recommendation || 'unknown');
      maybeSetBestBenchmark(bucket, record);
      if (record.recommendation === 'benchmark-pass') {
        bucket.metrics.benchmarkPassCount += 1;
        globalMetrics.benchmarkPassCount += 1;
      } else {
        bucket.metrics.benchmarkFailCount += 1;
        globalMetrics.benchmarkFailCount += 1;
      }
      continue;
    }

    if (record.type === 'infra_failure') {
      bucket.metrics.infraFailureCount += 1;
      globalMetrics.infraFailureCount += 1;
      bucket.infraFailures.push(record);
      continue;
    }

    bucket.metrics.promptRuns += 1;
    globalMetrics.promptRuns += 1;
    bucket.promptRecommendations.push(record.recommendation || 'unknown');
    maybeSetBestPrompt(bucket, record);

    if (record.dimensions) {
      for (const dim of record.dimensions) {
        const key = dim.name;
        if (bucket.dimensionScores[key]) {
          bucket.dimensionScores[key].push(dim.score);
        }
      }
    }

    if (record.type === 'accepted' || record.recommendation === 'candidate-acceptable' || record.recommendation === 'candidate-better') {
      bucket.metrics.acceptedCount += 1;
      globalMetrics.acceptedCount += 1;
      bucket.acceptedCandidates.push(record);
    } else if (record.type === 'rejected' || record.recommendation === 'candidate-worse' || record.recommendation === 'candidate-rejected') {
      bucket.metrics.rejectedCount += 1;
      globalMetrics.rejectedCount += 1;
      bucket.rejectedCandidates.push(record);
    }

    if (record.recommendation === 'tie') {
      bucket.metrics.tieCount += 1;
      globalMetrics.tieCount += 1;
    } else if (record.recommendation === 'keep-baseline') {
      bucket.metrics.keepBaselineCount += 1;
      globalMetrics.keepBaselineCount += 1;
    }
  }

  globalMetrics.targetProfiles = Object.keys(profiles).length;

  return {
    globalMetrics,
    profiles,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. STOP STATUS
// ─────────────────────────────────────────────────────────────────────────────

function countTrailingMatches(items, expected) {
  let count = 0;
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (items[index] !== expected) {
      break;
    }
    count += 1;
  }
  return count;
}

function detectDriftAmbiguity(mirrorDriftReport) {
  if (!mirrorDriftReport) {
    return false;
  }
  return /manual-review-required|: missing|Undisclosed surfaces:\s*[1-9]/i.test(mirrorDriftReport);
}

function evaluateStopStatus(registry, config, mirrorDriftReport) {
  const stopRules = config?.stopRules || {};
  const profileStates = {};
  let shouldStop = false;
  const reasons = [];

  for (const [profileId, bucket] of Object.entries(registry.profiles)) {
    const state = {
      shouldStop: false,
      reasons: [],
      counters: {
        trailingTies: countTrailingMatches(bucket.promptRecommendations, 'tie'),
        infraFailures: bucket.metrics.infraFailureCount,
        weakBenchmarkRuns: bucket.metrics.benchmarkFailCount,
      },
    };

    if (state.counters.trailingTies >= Number(stopRules.maxConsecutiveTies || Infinity)) {
      state.shouldStop = true;
      state.reasons.push(`trailing ties ${state.counters.trailingTies}/${stopRules.maxConsecutiveTies}`);
    }

    if (state.counters.infraFailures >= Number(stopRules.maxInfraFailuresPerProfile || Infinity)) {
      state.shouldStop = true;
      state.reasons.push(`infra failures ${state.counters.infraFailures}/${stopRules.maxInfraFailuresPerProfile}`);
    }

    if (state.counters.weakBenchmarkRuns >= Number(stopRules.maxWeakBenchmarkRunsPerProfile || Infinity)) {
      state.shouldStop = true;
      state.reasons.push(`weak benchmark runs ${state.counters.weakBenchmarkRuns}/${stopRules.maxWeakBenchmarkRunsPerProfile}`);
    }

    if (state.shouldStop) {
      shouldStop = true;
      reasons.push(`${profileId}: ${state.reasons.join(', ')}`);
    }

    profileStates[profileId] = state;
  }

  const driftAmbiguity = Boolean(stopRules.stopOnDriftAmbiguity) && detectDriftAmbiguity(mirrorDriftReport);
  if (driftAmbiguity) {
    shouldStop = true;
    reasons.push('mirror drift ambiguity detected');
  }

  if (stopRules.stopOnDimensionPlateau) {
    const plateauWindow = Number(stopRules.plateauWindow || 3);
    for (const [profileId, bucket] of Object.entries(registry.profiles)) {
      const dims = bucket.dimensionScores;
      const dimsWithEnoughData = Object.entries(dims).filter(([, scores]) => scores.length >= plateauWindow);
      if (dimsWithEnoughData.length > 0) {
        const plateauDims = dimsWithEnoughData.filter(([, scores]) => {
          const lastN = scores.slice(-plateauWindow);
          return lastN.every((s) => s === lastN[0]);
        });
        if (plateauDims.length === dimsWithEnoughData.length) {
          shouldStop = true;
          reasons.push(`${profileId}: all dimensions plateaued`);
          if (profileStates[profileId]) {
            profileStates[profileId].shouldStop = true;
            profileStates[profileId].reasons.push('all dimensions plateaued');
          }
        }
      }
    }
  }

  return {
    shouldStop,
    reasons,
    driftAmbiguity,
    profileStates,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DIMENSIONAL TRACKING
// ─────────────────────────────────────────────────────────────────────────────

function topFailureModes(failureModes) {
  return Object.entries(failureModes)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 5);
}

function computeDimensionTrend(scores) {
  if (scores.length < 2) {
    return '\u2192';
  }
  const latest = scores[scores.length - 1];
  const previous = scores[scores.length - 2];
  if (latest > previous) {
    return '\u2191';
  }
  if (latest < previous) {
    return '\u2193';
  }
  return '\u2192';
}

function formatDimensionName(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (ch) => ch.toUpperCase())
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. DASHBOARD RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function renderDimensionalProgress(bucket) {
  const rows = [];
  for (const [key, scores] of Object.entries(bucket.dimensionScores)) {
    if (scores.length === 0) {
      continue;
    }
    const latest = scores[scores.length - 1];
    const best = Math.max(...scores);
    const trend = computeDimensionTrend(scores);
    bucket.dimensionTrends[key] = trend;
    rows.push(`| ${formatDimensionName(key)} | ${latest} | ${best} | ${trend} |`);
  }
  if (rows.length === 0) {
    return '';
  }
  return `### Dimensional Progress

| Dimension | Latest | Best | Trend |
| --- | --- | --- | --- |
${rows.join('\n')}
`;
}

function renderProfileSection(bucket) {
  const failures = topFailureModes(bucket.failureModes);
  const failureSummary =
    failures.length > 0
      ? failures.map(([mode, count]) => `- ${mode}: ${count}`).join('\n')
      : '- none';
  const latest = bucket.latestRecord;
  const bestPrompt = bucket.bestPromptRecord;
  const bestBenchmark = bucket.bestBenchmarkRecord;

  return `## ${bucket.profileId}

- Family: ${bucket.family}
- Prompt runs: ${bucket.metrics.promptRuns}
- Benchmark runs: ${bucket.metrics.benchmarkRuns}
- Accepted candidates: ${bucket.metrics.acceptedCount}
- Rejected candidates: ${bucket.metrics.rejectedCount}
- Benchmark passes: ${bucket.metrics.benchmarkPassCount}
- Benchmark fails: ${bucket.metrics.benchmarkFailCount}
- Infra failures: ${bucket.metrics.infraFailureCount}
- Best prompt score: ${bestPrompt ? Number(bestPrompt.score ?? bestPrompt.totals?.candidate ?? 0) : 'n/a'}
- Best benchmark score: ${bestBenchmark ? Number(bestBenchmark.aggregateScore ?? 0) : 'n/a'}
- Latest recommendation: ${latest?.recommendation || 'n/a'}

### Repeated Failure Modes

${failureSummary}

${renderDimensionalProgress(bucket)}`;
}

function renderDashboard(registry) {
  const sections = Object.values(registry.profiles)
    .sort((left, right) => left.profileId.localeCompare(right.profileId))
    .map((bucket) => renderProfileSection(bucket))
    .join('\n');

  let recommendation = 'Continue only when the next run has a clearer signal than the current best-known state.';
  if (registry.stopStatus?.shouldStop) {
    recommendation = `Stop automatically: ${registry.stopStatus.reasons.join('; ')}`;
  } else if (registry.globalMetrics.infraFailureCount > 0) {
    recommendation = 'Stabilize infrastructure before trusting further comparisons.';
  } else if (registry.globalMetrics.benchmarkFailCount > 0) {
    recommendation = 'Fix repeated benchmark failures before broadening scope or promoting any target.';
  }

  return `# Agent Improvement Dashboard

## Global Summary

| Field | Value |
| --- | --- |
| Total records | ${registry.globalMetrics.totalRecords} |
| Target profiles | ${registry.globalMetrics.targetProfiles} |
| Prompt runs | ${registry.globalMetrics.promptRuns} |
| Benchmark runs | ${registry.globalMetrics.benchmarkRuns} |
| Accepted candidates | ${registry.globalMetrics.acceptedCount} |
| Rejected candidates | ${registry.globalMetrics.rejectedCount} |
| Ties | ${registry.globalMetrics.tieCount} |
| Keep-baseline results | ${registry.globalMetrics.keepBaselineCount} |
| Benchmark passes | ${registry.globalMetrics.benchmarkPassCount} |
| Benchmark fails | ${registry.globalMetrics.benchmarkFailCount} |
| Infra failures | ${registry.globalMetrics.infraFailureCount} |

## Guardrails

- Canonical promotion target remains ".opencode/agent/handover.md"
- Candidate-only target remains ".opencode/agent/context-prime.md"
- Mirror sync stays downstream packaging and is not counted as benchmark truth

## Stop Status

- Should stop: ${registry.stopStatus?.shouldStop ? 'yes' : 'no'}
- Drift ambiguity: ${registry.stopStatus?.driftAmbiguity ? 'yes' : 'no'}
- Reasons: ${registry.stopStatus?.reasons?.length ? registry.stopStatus.reasons.join('; ') : 'none'}

${sections}

## Recommendation

${recommendation}
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const runtimeRoot = process.argv[2];
  if (!runtimeRoot) {
    process.stderr.write('Usage: node reduce-state.cjs <improvement-runtime-root>\n');
    process.exit(2);
  }

  const stateLogPath = path.join(runtimeRoot, 'agent-improvement-state.jsonl');
  const registryPath = path.join(runtimeRoot, 'experiment-registry.json');
  const dashboardPath = path.join(runtimeRoot, 'agent-improvement-dashboard.md');
  const configPath = path.join(runtimeRoot, 'agent-improvement-config.json');
  const mirrorDriftReportPath = path.join(runtimeRoot, 'mirror-drift-report.md');

  const records = parseJsonl(readUtf8(stateLogPath));
  const registry = buildRegistry(records);
  const config = parseJson(readOptionalUtf8(configPath) || '{}', {});
  const mirrorDriftReport = readOptionalUtf8(mirrorDriftReportPath);
  registry.stopStatus = evaluateStopStatus(registry, config, mirrorDriftReport);
  const dashboard = renderDashboard(registry);

  writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
  writeUtf8(dashboardPath, dashboard);
}

main();
