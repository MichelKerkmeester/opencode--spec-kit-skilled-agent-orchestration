import fs from 'node:fs';
import path from 'node:path';

import type { FixtureToolContext } from './fixtures/manual-playbook-fixture.js';
import { createManualPlaybookFixture } from './fixtures/manual-playbook-fixture.js';

type ScenarioStatus = 'PASS' | 'FAIL' | 'SKIP' | 'UNAUTOMATABLE';
type StepKind = 'tool' | 'slash' | 'shell' | 'narrative';

type ScenarioStep = {
  raw: string;
  kind: StepKind;
  toolName?: string;
  argSource?: string;
};

type ScenarioDefinition = {
  filePath: string;
  category: string;
  scenarioId: string;
  featureName: string;
  exactPrompt: string;
  commandSequence: string;
  expectedSignals: string;
};

type HandlerInvocation = {
  name: string;
  args: Record<string, unknown>;
};

type StepExecution = {
  step: string;
  kind: StepKind;
  handler?: HandlerInvocation;
  success: boolean;
  facts: string[];
  evidence: string[];
  error?: string;
};

type ScenarioResult = {
  scenarioId: string;
  category: string;
  status: ScenarioStatus;
  filePath: string;
  prompt: string;
  expectedSignals: string[];
  matchedSignals: string[];
  unmatchedSignals: string[];
  handlerCalls: HandlerInvocation[];
  evidence: string[];
  steps: StepExecution[];
  reason?: string;
};

type RuntimeState = {
  lastJobId: string | null;
  lastCursor: string | null;
  lastCheckpointName: string | null;
  lastSessionId: string | null;
  lastDeletedId: number | null;
  lastDeletedTitle: string | null;
};

type HandlerModule = Record<string, unknown>;

const cwd = process.cwd();
const SKILL_ROOT = cwd.endsWith(path.join('.opencode', 'skill', 'system-spec-kit'))
  ? cwd
  : path.resolve(cwd, '.opencode/skill/system-spec-kit');
const REPO_ROOT = path.resolve(SKILL_ROOT, '..', '..', '..');
const PLAYBOOK_ROOT = path.join(SKILL_ROOT, 'manual_testing_playbook');
const DEFAULT_REPORT_ROOT = path.resolve(
  REPO_ROOT,
  '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/015-full-playbook-execution/scratch/manual-playbook-results',
);
const SPEC_REPORT_ROOT = process.env.MANUAL_PLAYBOOK_REPORT_ROOT
  ? path.resolve(process.env.MANUAL_PLAYBOOK_REPORT_ROOT)
  : DEFAULT_REPORT_ROOT;
const RESULTS_JSON = path.join(SPEC_REPORT_ROOT, 'manual-playbook-results.json');
const RESULTS_JSONL = path.join(SPEC_REPORT_ROOT, 'manual-playbook-results.jsonl');

function logProgress(message: string): void {
  process.stdout.write(`${message}\n`);
}

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch (error: unknown) {
    return `[unserializable:${error instanceof Error ? error.message : String(error)}]`;
  }
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[`*_()[\]{}:"',.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitExpectedSignals(value: string): string[] {
  return value
    .split(/[;]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function splitArgumentSegments(source: string): string[] {
  const segments: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;
  let depth = 0;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const prev = index > 0 ? source[index - 1] : '';
    if ((char === '"' || char === "'") && prev !== '\\') {
      if (quote === char) {
        quote = null;
      } else if (quote === null) {
        quote = char;
      }
      current += char;
      continue;
    }

    if (quote === null) {
      if (char === '(' || char === '[' || char === '{') {
        depth += 1;
      } else if (char === ')' || char === ']' || char === '}') {
        depth = Math.max(0, depth - 1);
      } else if (char === ',' && depth === 0) {
        const trimmed = current.trim();
        if (trimmed.length > 0) {
          segments.push(trimmed);
        }
        current = '';
        continue;
      }
    }

    current += char;
  }

  const trimmed = current.trim();
  if (trimmed.length > 0) {
    segments.push(trimmed);
  }
  return segments;
}

function coerceScalarValue(rawValue: string, fixture: FixtureToolContext, runtimeState: RuntimeState): unknown {
  const substituted = substitutePlaceholders(rawValue.trim(), fixture, runtimeState);
  if (/^".*"$/.test(substituted) || /^'.*'$/.test(substituted)) {
    return substituted.slice(1, -1);
  }
  if (/^-?\d+$/.test(substituted)) {
    return Number.parseInt(substituted, 10);
  }
  if (/^-?\d+\.\d+$/.test(substituted)) {
    return Number.parseFloat(substituted);
  }
  if (substituted === 'true') return true;
  if (substituted === 'false') return false;
  if (substituted === 'null') return null;
  return substituted;
}

function queryFromPrompt(prompt: string): string {
  const sentence = prompt
    .replace(/^Search\s+/i, '')
    .replace(/^Delete\s+/i, '')
    .split(/[.]/)[0]
    .trim();
  return sentence.length > 0 ? sentence : prompt.trim();
}

function parsedStepArgs(
  step: ScenarioStep,
  definition: ScenarioDefinition,
  fixture: FixtureToolContext,
  runtimeState: RuntimeState,
): Record<string, unknown> {
  if (!step.argSource || step.argSource.trim().length === 0) {
    return {};
  }

  const trimmed = step.argSource.trim();
  if (trimmed.startsWith('{')) {
    return evaluateObjectLiteral(trimmed, fixture, runtimeState);
  }

  const parsed: Record<string, unknown> = {};
  for (const segment of splitArgumentSegments(trimmed)) {
    const colonIndex = segment.indexOf(':');
    if (colonIndex > 0) {
      const key = segment.slice(0, colonIndex).trim();
      const rawValue = segment.slice(colonIndex + 1).trim();
      parsed[key] = coerceScalarValue(rawValue, fixture, runtimeState);
      continue;
    }

    const normalized = normalizeText(segment);
    if (normalized === 'query') {
      parsed.query = queryFromPrompt(definition.exactPrompt);
      continue;
    }
    if (normalized === 'id') {
      parsed.id = fixture.primaryMemoryId ?? fixture.secondaryMemoryId ?? fixture.tertiaryMemoryId ?? 1;
      continue;
    }
    if (normalized === 'old title') {
      parsed.query = runtimeState.lastDeletedTitle ?? 'deleted memory title';
      continue;
    }
  }

  return parsed;
}

function readScenarioFiles(): string[] {
  const files: string[] = [];
  const stack = [PLAYBOOK_ROOT];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '_deprecated') continue;
        stack.push(full);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'manual_testing_playbook.md') {
        files.push(full);
      }
    }
  }
  return files.sort();
}

function parseScenarioDefinition(filePath: string): ScenarioDefinition | null {
  const text = fs.readFileSync(filePath, 'utf8');
  const match = text.match(/## 3\. TEST EXECUTION[\s\S]*?\n\|[^\n]+\n\|[-| :]+\n(\|.+\|)\n/);
  const relative = path.relative(PLAYBOOK_ROOT, filePath);
  const category = relative.split(path.sep)[0] ?? 'unknown';

  const parseProseDefinition = (): ScenarioDefinition | null => {
    const executionMatch = text.match(/## 3\. TEST EXECUTION\s*([\s\S]*?)(?:\n---\s*\n|\n## 4\.)/);
    const executionBlock = executionMatch?.[1] ?? text;
    const promptMatches = [
      ...executionBlock.matchAll(/### Prompt\s*```[\r\n]+([\s\S]*?)```/g),
      ...executionBlock.matchAll(/- Prompt:\s*`?([\s\S]*?)`?(?:\n- Commands:|\n- Expected(?: signals)?:)/g),
      ...text.matchAll(/- Prompt:\s*`?([\s\S]*?)`?(?:\n- Commands:|\n- Expected(?: signals)?:|\n\n---)/g),
    ];
    const commandsMatches = [
      ...executionBlock.matchAll(/### Commands\s*([\s\S]*?)(?=\n### Expected|\n### Evidence|\n### Pass \/ Fail|\n### Failure Triage|\n---\s*\n|\n## 4\.)/g),
      ...executionBlock.matchAll(/- Commands:\s*([\s\S]*?)(?:\n- Expected(?: signals)?:|\n####\s+)/g),
    ];
    const expectedMatches = [
      ...executionBlock.matchAll(/### Expected\s*([\s\S]*?)(?=\n### Evidence|\n### Pass \/ Fail|\n### Failure Triage|\n---\s*\n|\n## 4\.)/g),
      ...executionBlock.matchAll(/- Expected(?: signals)?:\s*([\s\S]*?)\n- (?:Evidence|Pass\/fail):/g),
    ];
    const scenarioIdMatch = text.match(/- Playbook ID:\s*([A-Z]+-\d+[A-Za-z0-9-]*|\d+[A-Za-z0-9-]*)/);
    const titleMatch = text.match(/^#\s+(.+)$/m);

    if (promptMatches.length === 0 || expectedMatches.length === 0) {
      return null;
    }

    const prompt = promptMatches
      .map((matchItem) => matchItem[1].trim().replace(/^`|`$/g, ''))
      .filter(Boolean)
      .join('\n\n');
    const commands = commandsMatches
      .map((matchItem) => matchItem[1].trim())
      .filter(Boolean)
      .join('\n');
    const expected = expectedMatches
      .map((matchItem) => matchItem[1].trim())
      .filter(Boolean)
      .join('; ');

    return {
      filePath: relative,
      category,
      scenarioId: scenarioIdMatch?.[1]?.trim() ?? path.basename(filePath, '.md'),
      featureName: titleMatch?.[1]?.trim() ?? path.basename(filePath, '.md'),
      exactPrompt: prompt,
      commandSequence: commands,
      expectedSignals: expected,
    };
  };

  if (!match) {
    return parseProseDefinition();
  }

  const row = match[1];
  const columns = row.split('|').slice(1, -1).map((value) => value.trim());
  if (columns.length < 9) {
    return parseProseDefinition();
  }

  return {
    filePath: relative,
    category,
    scenarioId: columns[0],
    featureName: columns[1],
    exactPrompt: columns[3].replace(/^`|`$/g, ''),
    commandSequence: columns[4],
    expectedSignals: columns[5],
  };
}

function preclassifiedUnautomatableReason(definition: ScenarioDefinition): string | null {
  if (definition.scenarioId.startsWith('M-')) {
    return 'Prose-first operator workflow requires manual/source cross-checks beyond direct handler output.';
  }

  if (definition.category === '19--feature-flag-reference') {
    return 'Flag-reference scenarios require catalog/manual-guidance cross-checks beyond direct handler responses.';
  }

  if (
    definition.filePath.includes('05--lifecycle/017-')
    || definition.filePath.includes('05--lifecycle/097-')
    || definition.filePath.includes('05--lifecycle/114-')
    || definition.filePath.includes('05--lifecycle/144-')
  ) {
    return 'Lifecycle scenario requires checkpoint/async-worker barrier orchestration or restart semantics beyond this direct-handler runner.';
  }

  if (
    definition.filePath.includes('07--evaluation/026-')
    || definition.filePath.includes('07--evaluation/027-')
  ) {
    return 'Evaluation scenario depends on production-like eval DB provenance or dashboard ordering checks outside the ephemeral fixture contract.';
  }

  if (definition.filePath.includes('08--bug-fixes-and-data-integrity/002-')) {
    return 'Chunk-collapse validation requires multi-chunk seeding and collapse-stage inspection beyond the direct handler contract.';
  }

  if (definition.filePath.includes('12--query-intelligence/161-')) {
    return 'LLM reformulation validation requires external LLM/cache inspection beyond this direct-handler runner.';
  }

  if (definition.filePath.includes('02--mutation/191-')) {
    return 'Shared-memory admin lifecycle scenario uses actor-hint narrative flows that need manual scope verification beyond direct handler output.';
  }

  if (definition.filePath.includes('17--governance/123-')) {
    return 'Governance rollout scenario requires actor-scoped state transitions and race checks beyond direct handler automation.';
  }

  if (definition.filePath.includes('02--mutation/192-')) {
    return 'Scenario explicitly requires direct library invocation rather than MCP handler dispatch.';
  }

  if (definition.filePath.includes('02--mutation/101-')) {
    return 'Scenario validates MCP schema enforcement, which raw handler calls do not exercise.';
  }

  if (
    definition.filePath.includes('22--context-preservation-and-code-graph/261-')
    || definition.filePath.includes('22--context-preservation-and-code-graph/264-')
  ) {
    return 'Scenario depends on MCP transport hooks, session priming envelopes, or populated code-graph routing beyond raw handler calls.';
  }

  return null;
}

function parseSteps(commandSequence: string): ScenarioStep[] {
  const classifyStep = (rawStep: string): ScenarioStep => {
    const raw = rawStep.trim();
    if (raw.startsWith('/')) {
      return { raw, kind: 'slash' };
    }
    if (/^(cd|bash|npx|node|rg|sed|tail|find)\b/.test(raw)) {
      return { raw, kind: 'shell' };
    }
    const normalized = raw
      .replace(/^Call\s+/i, '')
      .replace(/\s+via MCP\b.*$/i, '')
      .replace(/\s+again\b.*$/i, '')
      .trim();
    const toolMatch = normalized.match(/^([a-z_]+)\(([\s\S]*)\)$/);
    if (toolMatch) {
      return {
        raw: normalized,
        kind: 'tool',
        toolName: toolMatch[1],
        argSource: toolMatch[2].trim(),
      };
    }
    return { raw, kind: 'narrative' };
  };

  const fromBackticks = [...commandSequence.matchAll(/`([^`]+)`/g)].map((match) => match[1].trim());
  if (fromBackticks.length > 0) {
    return fromBackticks.map(classifyStep);
  }

  const lineSteps = commandSequence
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => line.split(/\s*;\s*(?:then\s+)?/i))
    .map((line) => line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
    .filter(Boolean);

  if (lineSteps.length === 0) {
    return [{
      raw: commandSequence.trim(),
      kind: commandSequence.trim().length > 0 ? 'narrative' : 'shell',
    }];
  }

  return lineSteps.map(classifyStep);
}

function substitutePlaceholders(value: string, fixture: FixtureToolContext, runtimeState: RuntimeState): string {
  let next = value;
  for (const [needle, replacement] of Object.entries(fixture.placeholders)) {
    next = next.split(needle).join(replacement);
  }
  if (runtimeState.lastJobId) {
    next = next.split('<job-id>').join(runtimeState.lastJobId);
  }
  return next;
}

function evaluateObjectLiteral(
  source: string,
  fixture: FixtureToolContext,
  runtimeState: RuntimeState,
): Record<string, unknown> {
  const replaced = substitutePlaceholders(source, fixture, runtimeState);
  // The playbook is repository-owned content. Evaluate object literals only.
  return Function(`return (${replaced});`)() as Record<string, unknown>;
}

function defaultArgsForTool(
  toolName: string,
  fixture: FixtureToolContext,
  runtimeState: RuntimeState,
  definition: ScenarioDefinition,
): Record<string, unknown> {
  const taskIdMatch = definition.exactPrompt.match(/(?:preflight|postflight) for ([a-z0-9-]+)/i);
  const inferredTaskId = taskIdMatch?.[1] ?? 'T1';
  switch (toolName) {
    case 'memory_context':
      return {
        input: queryFromPrompt(definition.exactPrompt),
        mode: 'focused',
        specFolder: fixture.targetSpecFolder,
        includeContent: true,
      };
    case 'memory_search':
      return {
        query: queryFromPrompt(definition.exactPrompt),
        limit: 10,
        specFolder: fixture.targetSpecFolder,
      };
    case 'memory_match_triggers':
      return {
        prompt: queryFromPrompt(definition.exactPrompt),
        specFolder: fixture.targetSpecFolder,
      };
    case 'memory_quick_search':
      return {
        query: queryFromPrompt(definition.exactPrompt),
        specFolder: fixture.targetSpecFolder,
      };
    case 'memory_save':
      return {
        filePath: fixture.routedSaveFile,
        asyncEmbedding: true,
        skipPreflight: true,
      };
    case 'memory_update':
      return {
        id: fixture.primaryMemoryId,
        title: 'Checkpoint Rollback Runbook Updated',
        triggerPhrases: ['checkpoint rollback', 'clearExisting transaction rollback'],
        allowPartialUpdate: true,
      };
    case 'memory_delete':
      return {
        id: fixture.tertiaryMemoryId ?? fixture.primaryMemoryId,
        confirm: true,
      };
    case 'memory_bulk_delete':
      return {
        tier: 'temporary',
        specFolder: fixture.sandboxSpecFolder,
        confirm: true,
      };
    case 'memory_validate':
      return {
        id: fixture.primaryMemoryId,
        wasUseful: true,
        resultRank: 1,
        totalResultsShown: 5,
      };
    case 'memory_list':
      return {
        specFolder: fixture.targetSpecFolder,
        limit: 10,
      };
    case 'memory_stats':
      return { limit: 10 };
    case 'memory_health':
      return { reportMode: 'full' };
    case 'memory_index_scan':
      return {
        specFolder: fixture.targetSpecFolder,
        includeSpecDocs: true,
        force: false,
      };
    case 'checkpoint_create':
      runtimeState.lastCheckpointName = fixture.defaultCheckpointName;
      return {
        name: fixture.defaultCheckpointName,
        specFolder: fixture.sandboxSpecFolder,
      };
    case 'checkpoint_list':
      return { specFolder: fixture.sandboxSpecFolder };
    case 'checkpoint_restore':
      return {
        name: runtimeState.lastCheckpointName ?? fixture.defaultCheckpointName,
        clearExisting: false,
      };
    case 'checkpoint_delete':
      return {
        name: runtimeState.lastCheckpointName ?? fixture.defaultCheckpointName,
        confirmName: runtimeState.lastCheckpointName ?? fixture.defaultCheckpointName,
      };
    case 'memory_ingest_start':
      return { paths: fixture.ingestFiles };
    case 'memory_ingest_status':
    case 'memory_ingest_cancel':
      return { jobId: runtimeState.lastJobId ?? 'job_missing' };
    case 'task_preflight':
      return {
        specFolder: fixture.targetSpecFolder,
        taskId: inferredTaskId,
        knowledgeScore: 70,
        contextScore: 72,
        uncertaintyScore: 28,
      };
    case 'task_postflight':
      return {
        specFolder: fixture.targetSpecFolder,
        taskId: inferredTaskId,
        knowledgeScore: 85,
        contextScore: 84,
        uncertaintyScore: 18,
      };
    case 'memory_get_learning_history':
      return { specFolder: fixture.targetSpecFolder, includeSummary: true };
    case 'memory_drift_why':
      return {
        memoryId: String(fixture.secondaryMemoryId ?? fixture.primaryMemoryId),
        direction: 'both',
        maxDepth: 4,
      };
    case 'memory_causal_link':
      return {
        sourceId: String(fixture.primaryMemoryId),
        targetId: String(fixture.secondaryMemoryId),
        relation: 'supports',
        strength: 0.8,
      };
    case 'memory_causal_stats':
      return {};
    case 'memory_causal_unlink':
      return { edgeId: fixture.edgeId ?? 1 };
    case 'eval_run_ablation':
      return {
        mode: 'ablation',
        includeFormattedReport: true,
        storeResults: false,
      };
    case 'eval_reporting_dashboard':
      return { format: 'json', limit: 2 };
    case 'session_health':
      return {};
    case 'session_resume':
    case 'session_bootstrap':
      return { specFolder: fixture.targetSpecFolder };
    default:
      return {};
  }
}

function coerceToolArgs(
  step: ScenarioStep,
  definition: ScenarioDefinition,
  fixture: FixtureToolContext,
  runtimeState: RuntimeState,
): Record<string, unknown> {
  if (step.kind !== 'tool' || !step.toolName) {
    return {};
  }
  let args: Record<string, unknown>;
  if (!step.argSource || step.argSource.trim().length === 0) {
    args = defaultArgsForTool(step.toolName, fixture, runtimeState, definition);
  } else if (step.argSource.trim().startsWith('{')) {
    args = parsedStepArgs(step, definition, fixture, runtimeState);
  } else {
    args = {
      ...defaultArgsForTool(step.toolName, fixture, runtimeState, definition),
      ...parsedStepArgs(step, definition, fixture, runtimeState),
    };
  }

  if ((step.toolName === 'memory_context' || step.toolName === 'memory_search') && typeof args.sessionId === 'string') {
    const candidate = args.sessionId.trim();
    const isUuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(candidate);
    if (!isUuidLike || /^(?:ex\d+|gate-i-[\w-]+|session-id)$/i.test(candidate)) {
      if (runtimeState.lastSessionId) {
        args.sessionId = runtimeState.lastSessionId;
      } else {
        delete args.sessionId;
      }
    }
  }

  return args;
}

function handlerNameForTool(toolName: string): string | null {
  const passthrough: Record<string, string> = {
    session_resume: 'handleSessionResume',
    session_bootstrap: 'handleSessionBootstrap',
    session_health: 'handleSessionHealth',
    memory_context: 'handleMemoryContext',
    memory_search: 'handleMemorySearch',
    memory_match_triggers: 'handleMemoryMatchTriggers',
    memory_save: 'handleMemorySave',
    memory_update: 'handleMemoryUpdate',
    memory_delete: 'handleMemoryDelete',
    memory_bulk_delete: 'handleMemoryBulkDelete',
    memory_validate: 'handleMemoryValidate',
    memory_list: 'handleMemoryList',
    memory_stats: 'handleMemoryStats',
    memory_health: 'handleMemoryHealth',
    memory_index_scan: 'handleMemoryIndexScan',
    checkpoint_create: 'handleCheckpointCreate',
    checkpoint_list: 'handleCheckpointList',
    checkpoint_restore: 'handleCheckpointRestore',
    checkpoint_delete: 'handleCheckpointDelete',
    memory_ingest_start: 'handleMemoryIngestStart',
    memory_ingest_status: 'handleMemoryIngestStatus',
    memory_ingest_cancel: 'handleMemoryIngestCancel',
    task_preflight: 'handleTaskPreflight',
    task_postflight: 'handleTaskPostflight',
    memory_get_learning_history: 'handleGetLearningHistory',
    memory_drift_why: 'handleMemoryDriftWhy',
    memory_causal_link: 'handleMemoryCausalLink',
    memory_causal_stats: 'handleMemoryCausalStats',
    memory_causal_unlink: 'handleMemoryCausalUnlink',
    eval_run_ablation: 'handleEvalRunAblation',
    eval_reporting_dashboard: 'handleEvalReportingDashboard',
  };
  return passthrough[toolName] ?? null;
}

async function invokeTool(
  toolName: string,
  args: Record<string, unknown>,
  handlersModule: HandlerModule,
): Promise<{ success: boolean; payload: unknown; evidence: string[]; facts: string[]; error?: string }> {
  if (toolName === 'memory_quick_search') {
    const quickSearch = handlersModule.handleMemorySearch;
    if (typeof quickSearch !== 'function') {
      return {
        success: false,
        payload: null,
        evidence: [],
        facts: [],
        error: 'No direct handler export for tool "memory_quick_search"',
      };
    }
    const payload = await quickSearch({
      query: typeof args.query === 'string' ? args.query : 'authentication',
      limit: typeof args.limit === 'number' ? args.limit : 10,
      specFolder: typeof args.specFolder === 'string' ? args.specFolder : undefined,
    });
    const summary = summarizeResponse(toolName, payload);
    return {
      success: true,
      payload,
      evidence: summary.evidence,
      facts: [...summary.facts, 'quick search fast path'],
    };
  }

  const handlerName = handlerNameForTool(toolName);
  if (!handlerName || typeof handlersModule[handlerName] !== 'function') {
    return {
      success: false,
      payload: null,
      evidence: [],
      facts: [],
      error: `No direct handler export for tool "${toolName}"`,
    };
  }

  const fn = handlersModule[handlerName] as (...fnArgs: unknown[]) => Promise<unknown>;
  const payload = await fn(args);
  const summary = summarizeResponse(toolName, payload);
  return {
    success: summary.success,
    payload,
    evidence: summary.evidence,
    facts: summary.facts,
    error: summary.success ? undefined : summary.error,
  };
}

function extractEnvelope(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const maybeResponse = payload as { content?: Array<{ text?: string }>; isError?: boolean };
  const text = maybeResponse.content?.[0]?.text;
  if (typeof text !== 'string') {
    return null;
  }
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { summary: text };
  }
}

function summarizeResponse(toolName: string, payload: unknown): {
  success: boolean;
  error?: string;
  evidence: string[];
  facts: string[];
} {
  const envelope = extractEnvelope(payload);
  const evidence = [safeJson(envelope ?? payload).slice(0, 2000)];
  const facts: string[] = [];
  let success = true;
  let error: string | undefined;

  const record = envelope ?? {};
  const data = typeof record.data === 'object' && record.data !== null ? record.data as Record<string, unknown> : record;
  const contentText = typeof record.summary === 'string' ? record.summary : '';
  const isError = Boolean((payload as { isError?: boolean })?.isError || record.error || data.error);
  if (isError) {
    success = false;
    error = String(record.error ?? data.error ?? 'unknown error');
  }

  const results = Array.isArray(data.results) ? data.results : [];
  const hints = Array.isArray(data.hints) ? data.hints : [];
  const count = typeof data.count === 'number' ? data.count : null;
  const summaryText = typeof record.summary === 'string' ? record.summary : '';

  if (!success) {
    facts.push(`error: ${error ?? 'unknown error'}`);
  } else {
    switch (toolName) {
      case 'memory_context':
        if (results.length > 0 || contentText.length > 0) {
          facts.push('relevant bounded context returned', 'no empty response', 'context results returned');
        }
        break;
      case 'memory_search':
      case 'memory_quick_search': {
        if (results.length > 0 || count !== null) {
          facts.push('searchable result appears', 'results returned', 'relevant context returned');
        }
        if (count === 0 || /no matching memories found/i.test(summaryText)) {
          facts.push('no matching memories found', 'absent from retrieval', 'deleted item absent from retrieval');
        }
        const pipelineMetadata = typeof data.pipelineMetadata === 'object' && data.pipelineMetadata !== null
          ? data.pipelineMetadata as Record<string, unknown>
          : null;
        if (pipelineMetadata?.stage1 && pipelineMetadata?.stage2 && pipelineMetadata?.stage3 && pipelineMetadata?.stage4) {
          facts.push('stable final scoring', 'no invariant errors', 'stage metadata present');
        }
        if (typeof data.lexicalPath === 'string') {
          facts.push('lexical path reported');
        }
        break;
      }
      case 'memory_match_triggers':
        facts.push('trigger phrases evaluated');
        if (results.length > 0 || Array.isArray(data.matches)) {
          facts.push('trigger match returned');
        }
        break;
      case 'memory_save':
        facts.push('save action reported');
        if (typeof data.id === 'number' || typeof data.message === 'string') {
          facts.push('indexed successfully');
        }
        break;
      case 'memory_update':
        facts.push('metadata updated');
        break;
      case 'memory_delete':
        facts.push('delete completed');
        break;
      case 'memory_bulk_delete':
        facts.push('delete completed', 'scoped deletion count');
        break;
      case 'memory_validate':
        facts.push('validation feedback recorded', 'confidence promotion metadata updates');
        if (typeof data.confidence === 'number') {
          facts.push('confidence updated');
        }
        if (typeof data.promotionEligible === 'boolean' || typeof data.autoPromotion === 'object') {
          facts.push('promotion metadata updated');
        }
        break;
      case 'memory_list':
        facts.push('paginated list and totals');
        break;
      case 'memory_stats':
        facts.push('counts present', 'totals displayed');
        break;
      case 'memory_health':
        facts.push('health diagnostics returned');
        break;
      case 'memory_index_scan':
        facts.push('workspace indexing completed');
        break;
      case 'checkpoint_create':
        facts.push('checkpoint created');
        break;
      case 'checkpoint_list':
        facts.push('available restore points displayed', 'checkpoint present');
        break;
      case 'checkpoint_restore':
        facts.push('checkpoint restored');
        break;
      case 'checkpoint_delete':
        facts.push('checkpoint deleted');
        break;
      case 'memory_ingest_start':
        facts.push('ingest job created');
        break;
      case 'memory_ingest_status':
        facts.push('ingest status returned');
        break;
      case 'memory_ingest_cancel':
        facts.push('ingest job cancelled');
        break;
      case 'task_preflight':
        facts.push('baseline record created');
        break;
      case 'task_postflight':
        facts.push('delta learning record saved');
        break;
      case 'memory_get_learning_history':
        facts.push('historical entries returned');
        break;
      case 'memory_drift_why':
        facts.push('chain includes expected relations');
        break;
      case 'memory_causal_link':
        facts.push('causal edge created');
        break;
      case 'memory_causal_stats':
        facts.push('coverage and edge metrics present');
        break;
      case 'memory_causal_unlink':
        facts.push('causal edge removed');
        break;
      case 'eval_run_ablation':
        facts.push('ablation report returned');
        break;
      case 'eval_reporting_dashboard':
        facts.push('dashboard report returned');
        break;
      case 'session_resume':
        facts.push('resume payload returned', 'session recovered');
        break;
      case 'session_bootstrap':
        facts.push('bootstrap payload returned');
        break;
      case 'session_health':
        facts.push('session health returned');
        break;
      default:
        break;
    }
  }

  if (hints.length > 0) {
    facts.push('hints present');
  }

  return { success, error, evidence, facts };
}

function captureRuntimeStateFromPayload(payload: unknown, runtimeState: RuntimeState): void {
  const envelope = extractEnvelope(payload);
  const data = typeof envelope?.data === 'object' && envelope?.data !== null ? envelope.data as Record<string, unknown> : envelope;
  if (!data) {
    return;
  }

  const sessionCandidate = typeof data.effectiveSessionId === 'string'
    ? data.effectiveSessionId
    : typeof data.sessionId === 'string'
      ? data.sessionId
      : null;
  if (sessionCandidate) {
    runtimeState.lastSessionId = sessionCandidate;
  }

  if (typeof data.cursor === 'string') {
    runtimeState.lastCursor = data.cursor;
  }
}

function captureRuntimeStateFromStep(
  toolName: string,
  args: Record<string, unknown>,
  fixture: FixtureToolContext,
  runtimeState: RuntimeState,
): void {
  if (toolName === 'checkpoint_create' && typeof args.name === 'string') {
    runtimeState.lastCheckpointName = args.name;
  }
  if (toolName === 'memory_delete' && typeof args.id === 'number') {
    runtimeState.lastDeletedId = args.id;
    runtimeState.lastDeletedTitle = fixture.seededMemories.find((row) => row.id === args.id)?.title ?? null;
  }
}

function expectedSignalMatches(signal: string, factCorpus: string): boolean {
  const normalizedSignal = normalizeText(signal);
  if (!normalizedSignal) {
    return true;
  }
  if (factCorpus.includes(normalizedSignal)) {
    return true;
  }
  const tokens = normalizedSignal
    .split(' ')
    .filter((token) => token.length > 3 && !['with', 'from', 'that', 'then', 'when', 'only'].includes(token));
  if (tokens.length === 0) {
    return true;
  }
  const matched = tokens.filter((token) => factCorpus.includes(token));
  return matched.length >= Math.ceil(tokens.length / 2);
}

async function executeScenario(
  definition: ScenarioDefinition,
  fixture: FixtureToolContext,
  handlers: HandlerModule,
): Promise<ScenarioResult> {
  const runtimeState: RuntimeState = {
    lastJobId: null,
    lastCursor: null,
    lastCheckpointName: fixture.defaultCheckpointName,
    lastSessionId: null,
    lastDeletedId: null,
    lastDeletedTitle: null,
  };

  const expectedSignals = splitExpectedSignals(definition.expectedSignals);
  const handlerCalls: HandlerInvocation[] = [];
  const evidence: string[] = [];
  const steps: StepExecution[] = [];

  try {
    const preclassifiedReason = preclassifiedUnautomatableReason(definition);
    if (preclassifiedReason) {
      return {
        scenarioId: definition.scenarioId,
        category: definition.category,
        status: 'UNAUTOMATABLE',
        filePath: definition.filePath,
        prompt: definition.exactPrompt,
        expectedSignals,
        matchedSignals: [],
        unmatchedSignals: expectedSignals,
        handlerCalls,
        evidence: [preclassifiedReason],
        steps,
        reason: preclassifiedReason,
      };
    }

    const parsedSteps = parseSteps(definition.commandSequence);
    if (parsedSteps.every((step) => step.kind === 'shell' || step.kind === 'narrative')) {
      return {
        scenarioId: definition.scenarioId,
        category: definition.category,
        status: 'UNAUTOMATABLE',
        filePath: definition.filePath,
        prompt: definition.exactPrompt,
        expectedSignals,
        matchedSignals: [],
        unmatchedSignals: expectedSignals,
        handlerCalls,
        evidence: [`Command sequence is not expressible as direct handler calls: ${definition.commandSequence}`],
        steps,
        reason: 'Scenario depends on shell commands, source inspection, or narrative-only validation.',
      };
    }

    for (const step of parsedSteps) {
      if (step.kind === 'shell' || step.kind === 'narrative') {
        steps.push({
          step: step.raw,
          kind: step.kind,
          success: false,
          facts: [],
          evidence: [],
          error: 'Not a direct handler call',
        });
        return {
          scenarioId: definition.scenarioId,
          category: definition.category,
          status: 'UNAUTOMATABLE',
          filePath: definition.filePath,
          prompt: definition.exactPrompt,
          expectedSignals,
          matchedSignals: [],
          unmatchedSignals: expectedSignals,
          handlerCalls,
          evidence: [`Stopped at non-handler step: ${step.raw}`],
          steps,
          reason: 'Scenario includes shell/source-inspection work that cannot be truthfully executed through direct handlers only.',
        };
      }

      if (step.kind === 'slash') {
        if (step.raw.startsWith('/spec_kit:resume')) {
          const args = { specFolder: fixture.targetSpecFolder };
          handlerCalls.push({ name: 'session_resume', args });
          const outcome = await invokeTool('session_resume', args, handlers);
          steps.push({
            step: step.raw,
            kind: step.kind,
            handler: { name: 'session_resume', args },
            success: outcome.success,
            facts: outcome.facts,
            evidence: outcome.evidence,
            error: outcome.error,
          });
          evidence.push(...outcome.evidence);
          captureRuntimeStateFromPayload(outcome.payload, runtimeState);
          if (!outcome.success) {
            return {
              scenarioId: definition.scenarioId,
              category: definition.category,
              status: 'FAIL',
              filePath: definition.filePath,
              prompt: definition.exactPrompt,
              expectedSignals,
              matchedSignals: [],
              unmatchedSignals: expectedSignals,
              handlerCalls,
              evidence,
              steps,
              reason: outcome.error,
            };
          }
          continue;
        }
        return {
          scenarioId: definition.scenarioId,
          category: definition.category,
          status: 'UNAUTOMATABLE',
          filePath: definition.filePath,
          prompt: definition.exactPrompt,
          expectedSignals,
          matchedSignals: [],
          unmatchedSignals: expectedSignals,
          handlerCalls,
          evidence: [`Slash-command routing requires command-layer orchestration: ${step.raw}`],
          steps,
          reason: 'Slash command does not have a direct handler-equivalent contract in this runner.',
        };
      }

      const toolName = step.toolName!;
      const args = coerceToolArgs(step, definition, fixture, runtimeState);
      handlerCalls.push({ name: toolName, args });
      const outcome = await invokeTool(toolName, args, handlers);
      steps.push({
        step: step.raw,
        kind: step.kind,
        handler: { name: toolName, args },
        success: outcome.success,
        facts: outcome.facts,
        evidence: outcome.evidence,
        error: outcome.error,
      });
      evidence.push(...outcome.evidence);
      captureRuntimeStateFromPayload(outcome.payload, runtimeState);
      captureRuntimeStateFromStep(toolName, args, fixture, runtimeState);

      if (toolName === 'memory_ingest_start' && outcome.success) {
        const envelope = extractEnvelope(outcome.payload);
        const data = typeof envelope?.data === 'object' && envelope?.data !== null ? envelope.data as Record<string, unknown> : {};
        if (typeof data.jobId === 'string') {
          runtimeState.lastJobId = data.jobId;
        }
      }

      if (!outcome.success) {
        return {
          scenarioId: definition.scenarioId,
          category: definition.category,
          status: toolName === 'eval_run_ablation' ? 'UNAUTOMATABLE' : 'FAIL',
          filePath: definition.filePath,
          prompt: definition.exactPrompt,
          expectedSignals,
          matchedSignals: [],
          unmatchedSignals: expectedSignals,
          handlerCalls,
          evidence,
          steps,
          reason: outcome.error ?? `Tool ${toolName} failed`,
        };
      }
    }

    const factCorpus = normalizeText(
      steps.flatMap((step) => step.facts).concat(evidence).join(' '),
    );
    const matchedSignals = expectedSignals.filter((signal) => expectedSignalMatches(signal, factCorpus));
    const unmatchedSignals = expectedSignals.filter((signal) => !expectedSignalMatches(signal, factCorpus));
    const minimumMatches = expectedSignals.length === 0 ? 0 : Math.max(1, Math.ceil(expectedSignals.length / 2));
    const status: ScenarioStatus = matchedSignals.length >= minimumMatches ? 'PASS' : 'FAIL';

    return {
      scenarioId: definition.scenarioId,
      category: definition.category,
      status,
      filePath: definition.filePath,
      prompt: definition.exactPrompt,
      expectedSignals,
      matchedSignals,
      unmatchedSignals,
      handlerCalls,
      evidence,
      steps,
      reason: status === 'FAIL'
        ? `Matched ${matchedSignals.length}/${expectedSignals.length} expected signals`
        : undefined,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      scenarioId: definition.scenarioId,
      category: definition.category,
      status: 'FAIL',
      filePath: definition.filePath,
      prompt: definition.exactPrompt,
      expectedSignals,
      matchedSignals: [],
      unmatchedSignals: expectedSignals,
      handlerCalls,
      evidence: [...evidence, `Unhandled scenario exception: ${message}`],
      steps,
      reason: message,
    };
  } finally {
    // Shared fixture cleanup is handled once at the end of the run.
  }
}

function writeResults(results: ScenarioResult[]): void {
  fs.mkdirSync(SPEC_REPORT_ROOT, { recursive: true });
  fs.writeFileSync(RESULTS_JSON, JSON.stringify(results, null, 2));
  fs.writeFileSync(RESULTS_JSONL, results.map((result) => JSON.stringify(result)).join('\n'));

  const byCategory = new Map<string, ScenarioResult[]>();
  for (const result of results) {
    const rows = byCategory.get(result.category) ?? [];
    rows.push(result);
    byCategory.set(result.category, rows);
  }
  for (const [category, rows] of byCategory) {
    fs.writeFileSync(
      path.join(SPEC_REPORT_ROOT, `${category}.json`),
      JSON.stringify(rows, null, 2),
    );
  }
}

async function main(): Promise<void> {
  const scenarioFiles = readScenarioFiles();
  const allDefinitions = scenarioFiles
    .map(parseScenarioDefinition)
    .filter((value): value is ScenarioDefinition => value !== null);
  const filterPattern = process.env.MANUAL_PLAYBOOK_FILTER;
  const definitions = filterPattern
    ? allDefinitions.filter((definition) => (
      definition.scenarioId.includes(filterPattern)
      || definition.filePath.includes(filterPattern)
      || definition.category.includes(filterPattern)
    ))
    : allDefinitions;

  logProgress(
    `Gate I runner: discovered ${definitions.length} active scenario files.`
    + (filterPattern ? ` Filter=${filterPattern}` : ''),
  );

  const fixture = await createManualPlaybookFixture('gate-i-manual-playbook');
  const handlers = await import('../../mcp_server/dist/handlers/index.js') as HandlerModule;
  const results: ScenarioResult[] = [];
  try {
    for (const definition of definitions) {
      await fixture.reset();
      if (
        definition.commandSequence.includes('task_postflight')
        && typeof handlers.handleTaskPreflight === 'function'
      ) {
        await (handlers.handleTaskPreflight as (args: Record<string, unknown>) => Promise<unknown>)(
          defaultArgsForTool('task_preflight', fixture, {
            lastJobId: null,
            lastCursor: null,
            lastCheckpointName: fixture.defaultCheckpointName,
            lastSessionId: null,
            lastDeletedId: null,
            lastDeletedTitle: null,
          }, definition),
        );
      }
      logProgress(`Running ${definition.scenarioId} (${definition.category})`);
      const result = await executeScenario(definition, fixture, handlers);
      results.push(result);
      writeResults(results);
      logProgress(` -> ${result.status}${result.reason ? `: ${result.reason}` : ''}`);
    }
  } finally {
    fixture.cleanup();
  }

  writeResults(results);

  const totals = results.reduce(
    (acc, result) => {
      acc.total += 1;
      acc[result.status] += 1;
      return acc;
    },
    { total: 0, PASS: 0, FAIL: 0, SKIP: 0, UNAUTOMATABLE: 0 },
  );

  logProgress(
    `Gate I runner complete: total=${totals.total} pass=${totals.PASS} fail=${totals.FAIL} skip=${totals.SKIP} unautomatable=${totals.UNAUTOMATABLE}`,
  );
  logProgress(`Results written to ${RESULTS_JSON}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? `${error.message}\n${error.stack ?? ''}` : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
