#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: SessionStart Hook — Session Prime
// ───────────────────────────────────────────────────────────────
// Runs on Claude Code SessionStart event. Injects context via stdout
// based on the session source (compact, startup, resume, clear).

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseHookStdin, hookLog, formatHookOutput, truncateToTokenBudget,
  withTimeout, HOOK_TIMEOUT_MS, COMPACTION_TOKEN_BUDGET, SESSION_PRIME_TOKEN_BUDGET,
  calculatePressureAdjustedBudget, sanitizeRecoveredPayload, wrapRecoveredCompactPayload,
  getRequiredSessionId,
  type HookInput,
  type OutputSection,
} from './shared.js';
import { ensureStateDir, loadState, readCompactPrime, clearCompactPrime } from './hook-state.js';
import { getCachedSessionSummaryDecision, logCachedSummaryDecision } from '../../handlers/session-resume.js';

const CACHE_TTL_MS = 30 * 60 * 1000;
const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;
type StartupBrief = {
  graphOutline: string | null;
  sessionContinuity: string | null;
  graphSummary: { files: number; nodes: number; edges: number; lastScan: string | null } | null;
  graphState: 'ready' | 'stale' | 'empty' | 'missing';
  cocoIndexAvailable: boolean;
  startupSurface: string;
};

// Dynamic import for startup brief builder — may not be available
let buildStartupBrief: ((highlightCount?: number, stateScope?: { specFolder?: string; claudeSessionId?: string }) => StartupBrief) | null = null;
try {
  const mod = await import('../../lib/code-graph/startup-brief.js');
  buildStartupBrief = mod.buildStartupBrief;
} catch {
  // Startup brief module not available — keep static startup output
}

/** Handle source=compact: inject cached PreCompact payload (from 3-source merger) */
function handleCompact(sessionId: string): OutputSection[] {
  const stateResult = loadState(sessionId);
  const state = stateResult.ok ? stateResult.state : null;
  const pendingCompactPrime = readCompactPrime(sessionId);
  if (!pendingCompactPrime) {
    hookLog('warn', 'session-prime', `No cached compact payload for session ${sessionId}`);
    return [{
      title: 'Context Recovery',
      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    }];
  }

  const { payload, cachedAt } = pendingCompactPrime;
  const cachedAtMs = new Date(cachedAt).getTime();
  const cacheAgeMs = Date.now() - cachedAtMs;
  if (Number.isNaN(cachedAtMs) || cacheAgeMs >= CACHE_TTL_MS) {
    hookLog('warn', 'session-prime', `Rejecting stale compact cache for session ${sessionId} (cached at ${cachedAt})`);
    return [{
      title: 'Context Recovery',
      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    }];
  }

  const sanitizedPayload = sanitizeRecoveredPayload(payload);
  const wrappedPayload = wrapRecoveredCompactPayload(payload, cachedAt, {
    producer: pendingCompactPrime.payloadContract?.provenance.producer,
    trustState: pendingCompactPrime.payloadContract?.provenance.trustState,
    sourceSurface: pendingCompactPrime.payloadContract?.provenance.sourceSurface,
  });
  hookLog('info', 'session-prime', `Injecting cached compact brief (${sanitizedPayload.length} chars after sanitization, cached at ${cachedAt})`);

  const sections: OutputSection[] = [
    { title: 'Recovered Context (Post-Compaction)', content: wrappedPayload },
    {
      title: 'Recovery Instructions',
      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
    },
  ];

  // Add last spec folder if known
  if (state?.lastSpecFolder) {
    sections.push({
      title: 'Active Spec Folder',
      content: `Last active: ${state.lastSpecFolder}`,
    });
  }

  return sections;
}

function readCompactPrimeIdentity(sessionId: string): { cachedAt: string; opaqueId?: string | null } | null {
  const pendingCompactPrime = readCompactPrime(sessionId);
  if (!pendingCompactPrime) {
    return null;
  }
  return {
    cachedAt: pendingCompactPrime.cachedAt,
    opaqueId: pendingCompactPrime.opaqueId ?? null,
  };
}

/**
 * T-SRS-04 (R29-002): map rejection reasons to distinct short-form status labels
 * so startup surface no longer collapses schema-mismatch, transcript-identity-
 * mismatch, stale-summary, and ordinary missing-state into the same "startup
 * summary only" string.  Depends on T-HST-01/02 (HookState schema-version
 * plumbing from P0-A) which guarantees the upstream rejection reason is
 * actually populated with the right discriminator.
 */
function describeMemoryStatus(
  hasCachedContinuity: boolean,
  rejectionReason: string | null,
): string {
  if (hasCachedContinuity) {
    return 'session continuity available';
  }
  if (!rejectionReason) {
    return 'startup summary only (resume on demand)';
  }
  const reasonMap: Record<string, string> = {
    missing_state: 'startup summary only (no cached continuity; resume on demand)',
    schema_mismatch: 'startup summary only (cached continuity rejected: schema version mismatch)',
    missing_summary: 'startup summary only (cached continuity rejected: missing session summary)',
    missing_producer_metadata: 'startup summary only (cached continuity rejected: producer metadata missing)',
    missing_required_fields: 'startup summary only (cached continuity rejected: required fields missing)',
    transcript_unreadable: 'startup summary only (cached continuity rejected: transcript unreadable)',
    transcript_identity_mismatch: 'startup summary only (cached continuity rejected: transcript identity mismatch)',
    stale_summary: 'startup summary only (cached continuity rejected: stale summary)',
    summary_precedes_producer_turn: 'startup summary only (cached continuity rejected: summary predates latest producer turn)',
    scope_mismatch: 'startup summary only (cached continuity rejected: scope mismatch)',
    unknown_scope: 'startup summary only (cached continuity rejected: scope unknown)',
  };
  return reasonMap[rejectionReason] ?? `startup summary only (cached continuity rejected: ${rejectionReason})`;
}

function buildFallbackStartupSurface(
  hasCachedContinuity: boolean,
  rejectionReason: string | null = null,
): string {
  return [
    'Session context received. Current state:',
    '',
    `- Memory: ${describeMemoryStatus(hasCachedContinuity, rejectionReason)}`,
    '- Code Graph: unavailable',
    '- CocoIndex: unknown',
    '',
    'What would you like to work on?',
  ].join('\n');
}

function rewriteStartupMemoryLine(
  startupSurface: string,
  hasCachedContinuity: boolean,
  rejectionReason: string | null = null,
): string {
  return startupSurface.replace(
    /^- Memory: .*$/m,
    `- Memory: ${describeMemoryStatus(hasCachedContinuity, rejectionReason)}`,
  );
}

/** Handle source=startup: prime new session with constitutional memories + overview */
export function handleStartup(
  input: Pick<HookInput, 'session_id'> & { specFolder?: string } = {},
): OutputSection[] {
  const sessionId = typeof input.session_id === 'string' ? input.session_id : undefined;
  const requestedSpecFolder = typeof input.specFolder === 'string' ? input.specFolder : undefined;
  let startupBrief: StartupBrief | null = null;
  try {
    startupBrief = buildStartupBrief
      ? buildStartupBrief(undefined, {
        claudeSessionId: sessionId,
        specFolder: requestedSpecFolder,
      })
      : null;
  } catch (err: unknown) {
    hookLog('error', 'session-prime', `buildStartupBrief threw: ${err instanceof Error ? err.message : String(err)}`);
  }
  if (!buildStartupBrief) {
    hookLog('warn', 'session-prime', 'Startup brief module unavailable — using fallback surface');
  } else if (!startupBrief) {
    hookLog('warn', 'session-prime', 'buildStartupBrief returned null — possible startup-brief regression');
  } else if (!startupBrief.startupSurface) {
    hookLog('warn', 'session-prime', 'startupBrief.startupSurface is empty — possible startup-brief regression');
  }
  const cachedSummaryDecision = getCachedSessionSummaryDecision({
    specFolder: requestedSpecFolder,
    claudeSessionId: sessionId,
  });
  if (cachedSummaryDecision.status !== 'accepted') {
    logCachedSummaryDecision('session-prime', cachedSummaryDecision);
  }

  const sessionContinuity = cachedSummaryDecision.status === 'accepted'
    ? cachedSummaryDecision.cachedSummary?.startupHint ?? null
    : null;
  // T-SRS-04 (R29-002): forward the rejection reason so the startup surface can
  // differentiate schema_mismatch / transcript_identity_mismatch / stale_summary
  // / missing_state instead of collapsing them all into "startup summary only".
  const rejectionReason = cachedSummaryDecision.status === 'rejected'
    ? cachedSummaryDecision.reason
    : null;
  const startupSurface = startupBrief?.startupSurface
    ? rewriteStartupMemoryLine(startupBrief.startupSurface, Boolean(sessionContinuity), rejectionReason)
    : buildFallbackStartupSurface(Boolean(sessionContinuity), rejectionReason);
  const sections: OutputSection[] = [
    {
      title: 'Session Context',
      content: startupSurface,
    },
    {
      title: 'Recovery Tools',
      content: [
        '- `memory_context({ input, mode })` — unified context retrieval',
        '- `memory_match_triggers({ prompt })` — fast trigger matching',
        '- `memory_search({ query })` — semantic search',
        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
      ].join('\n'),
    },
  ];
  if (startupBrief?.graphOutline) {
    sections.push({
      title: 'Structural Context',
      content: startupBrief.graphOutline,
    });
  } else if (startupBrief?.graphState === 'empty') {
    sections.push({
      title: 'Structural Context',
      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
    });
  }

  if (sessionContinuity) {
    sections.push({
      title: 'Session Continuity',
      content: sessionContinuity,
    });
  }

  if (startupBrief?.graphState === 'stale') {
    sections.push({
      title: 'Stale Code Graph Warning',
      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
    });
  }

  return sections;
}

/** Handle source=resume: load resume context for continued session */
function handleResume(sessionId: string): OutputSection[] {
  const stateResult = loadState(sessionId);
  const state = stateResult.ok ? stateResult.state : null;
  const sections: OutputSection[] = [];

  if (state?.lastSpecFolder) {
    sections.push({
      title: 'Session Continuity',
      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
    });
  } else {
    sections.push({
      title: 'Session Resume',
      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
    });
  }

  return sections;
}

/** Handle source=clear: minimal output after /clear */
function handleClear(): OutputSection[] {
  return [
    {
      title: 'Fresh Context',
      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
    },
  ];
}

function writeHookOutput(output: string): Promise<void> {
  return new Promise<void>((resolvePromise, rejectPromise) => {
    process.stdout.write(output, (error) => {
      if (error) {
        rejectPromise(error);
        return;
      }

      resolvePromise();
    });
  });
}

async function main(): Promise<void> {
  ensureStateDir();

  const input = await withTimeout(parseHookStdin(), HOOK_TIMEOUT_MS, null);
  if (!input) {
    hookLog('warn', 'session-prime', 'No stdin input received');
    return;
  }

  const sessionId = getRequiredSessionId(input.session_id, 'session-prime');
  const source = input.source ?? 'startup';
  hookLog('info', 'session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);

  let sections: OutputSection[];
  let budget: number;
  let compactIdentity: { cachedAt: string; opaqueId?: string | null } | null = null;

  switch (source) {
    case 'compact':
      compactIdentity = readCompactPrimeIdentity(sessionId);
      sections = handleCompact(sessionId);
      budget = COMPACTION_TOKEN_BUDGET;
      break;
    case 'startup':
      sections = handleStartup(input);
      budget = SESSION_PRIME_TOKEN_BUDGET;
      break;
    case 'resume':
      sections = handleResume(sessionId);
      budget = SESSION_PRIME_TOKEN_BUDGET;
      break;
    case 'clear':
      sections = handleClear();
      budget = SESSION_PRIME_TOKEN_BUDGET;
      break;
    default:
      sections = handleStartup(input);
      budget = SESSION_PRIME_TOKEN_BUDGET;
  }

  // Apply token pressure awareness — reduce budget when context window is filling up
  const adjustedBudget = calculatePressureAdjustedBudget(
    input.context_window_tokens as number | undefined,
    input.context_window_max as number | undefined,
    budget,
  );
  if (adjustedBudget !== budget) {
    hookLog('info', 'session-prime', `Token pressure: budget ${budget} → ${adjustedBudget} (window ${input.context_window_tokens}/${input.context_window_max})`);
  }

  const output = truncateToTokenBudget(formatHookOutput(sections), adjustedBudget);

  // Write to stdout for Claude Code to inject into conversation.
  // Clear compact payload only after the write callback confirms the
  // output was handed off, so compact recovery cannot be dropped early.
  await writeHookOutput(output);
  if (source === 'compact') {
    clearCompactPrime(sessionId, compactIdentity ?? undefined);
  }
  hookLog('info', 'session-prime', `Output ${output.length} chars for source=${source}`);
}

// Run — exit cleanly even on error
if (IS_CLI_ENTRY) {
  main().catch((err: unknown) => {
    hookLog('error', 'session-prime', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
  }).finally(() => {
    process.exit(0);
  });
}
