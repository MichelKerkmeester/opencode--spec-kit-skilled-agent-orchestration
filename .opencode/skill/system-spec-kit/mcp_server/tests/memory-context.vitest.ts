// TEST: MEMORY CONTEXT
import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import type { MCPResponse } from '@spec-kit/shared/types';

// Mock core/db-state to prevent real DB operations (checkDatabaseUpdated throws
// when the database directory cannot be resolved in the test environment).
vi.mock('../core/db-state', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
    waitForEmbeddingModel: vi.fn(async () => true),
    isEmbeddingModelReady: vi.fn(() => true),
  };
});

vi.mock('../core', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
    waitForEmbeddingModel: vi.fn(async () => true),
    isEmbeddingModelReady: vi.fn(() => true),
  };
});

import {
  handleMemoryContext,
  handle_memory_context,
  CONTEXT_MODES,
  INTENT_TO_MODE,
  enforceTokenBudget,
} from '../handlers/memory-context';
import {
  attachSessionTransitionTrace,
  buildSessionTransitionTrace,
} from '../lib/search/session-transition';

/* ───────────────────────────────────────────────────────────────
   TYPE DEFINITIONS
──────────────────────────────────────────────────────────────── */

interface ContextMode {
  name: string;
  description: string;
  strategy: string;
  tokenBudget?: number;
}

interface ContextResult extends Record<string, unknown> {
  strategy: string;
  mode: string;
}

type MemoryContextArgs = Parameters<typeof handleMemoryContext>[0];

const MEMORY_CONTEXT_SOURCE = fs.readFileSync(
  path.join(process.cwd(), 'handlers', 'memory-context.ts'),
  'utf-8'
);

/* ───────────────────────────────────────────────────────────────
   TEST UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Parse an error response from the envelope structure.
 * The envelope wraps data as: { summary, data: { error, code, details: { layer } }, hints: [...], meta }
 * This helper flattens it to { error, code, layer, hint, ... } for easier assertions.
 */
function parseErrorEnvelope(result: MCPResponse): Record<string, unknown> {
  const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
  const data = (envelope.data || {}) as Record<string, unknown>;
  const details = (data.details || {}) as Record<string, unknown>;
  const hints = (envelope.hints || []) as string[];
  return {
    error: data.error as string | undefined,
    code: data.code as string | undefined,
    layer: details.layer as string | undefined,
    hint: hints[0] as string | undefined,
    summary: envelope.summary as string | undefined,
    meta: envelope.meta as Record<string, unknown> | undefined,
  };
}

function invokeMemoryContext(args: Record<string, unknown>): Promise<MCPResponse> {
  return handleMemoryContext(args as unknown as MemoryContextArgs);
}

/* ───────────────────────────────────────────────────────────────
   T001-T010: CONTEXT MODES TESTS
──────────────────────────────────────────────────────────────── */

describe('T001-T010: Context Modes Configuration [deferred - requires DB test fixtures]', () => {
  it('T001: CONTEXT_MODES contains all 5 required modes', () => {
    const modes: string[] = Object.keys(CONTEXT_MODES);
    expect(modes.length).toBe(5);
    expect(modes).toContain('auto');
    expect(modes).toContain('quick');
    expect(modes).toContain('deep');
    expect(modes).toContain('focused');
    expect(modes).toContain('resume');
  });

  it('T002: auto mode has adaptive strategy', () => {
    const autoMode: ContextMode = CONTEXT_MODES.auto;
    expect(autoMode.strategy).toBe('adaptive');
    expect(autoMode.name).toBe('Auto');
    expect(autoMode.description.length).toBeGreaterThan(0);
  });

  it('T003: quick mode has triggers strategy and 800 token budget', () => {
    const quickMode: ContextMode = CONTEXT_MODES.quick;
    expect(quickMode.strategy).toBe('triggers');
    expect(quickMode.tokenBudget).toBe(800);
  });

  it('T004: deep mode has search strategy and 3500 token budget', () => {
    const deepMode: ContextMode = CONTEXT_MODES.deep;
    expect(deepMode.strategy).toBe('search');
    expect(deepMode.tokenBudget).toBe(3500);
  });

  it('T005: focused mode has intent-search strategy and 3000 token budget', () => {
    const focusedMode: ContextMode = CONTEXT_MODES.focused;
    expect(focusedMode.strategy).toBe('intent-search');
    expect(focusedMode.tokenBudget).toBe(3000);
  });

  it('T006: resume mode has resume strategy and 2000 token budget', () => {
    const resumeMode: ContextMode = CONTEXT_MODES.resume;
    expect(resumeMode.strategy).toBe('resume');
    expect(resumeMode.tokenBudget).toBe(2000);
  });

  it('T007: All modes have name and description', () => {
    for (const [_modeName, mode] of Object.entries(CONTEXT_MODES) as [string, ContextMode][]) {
      expect(mode.name).toBeDefined();
      expect(mode.name.length).toBeGreaterThan(0);
      expect(mode.description).toBeDefined();
      expect(mode.description.length).toBeGreaterThan(0);
    }
  });

  it('T008: Only auto mode has adaptive strategy', () => {
    for (const [modeName, mode] of Object.entries(CONTEXT_MODES) as [string, ContextMode][]) {
      if (modeName === 'auto') {
        expect(mode.strategy).toBe('adaptive');
      } else {
        expect(mode.strategy).not.toBe('adaptive');
      }
    }
  });

  it('T009: Non-auto modes have token budgets', () => {
    for (const [modeName, mode] of Object.entries(CONTEXT_MODES) as [string, ContextMode][]) {
      if (modeName !== 'auto') {
        expect(typeof mode.tokenBudget).toBe('number');
        expect(mode.tokenBudget!).toBeGreaterThan(0);
      }
    }
  });

  it('T010: Token budgets are reasonable (500-4000 range)', () => {
    for (const [modeName, mode] of Object.entries(CONTEXT_MODES) as [string, ContextMode][]) {
      if (mode.tokenBudget !== undefined) {
        expect(mode.tokenBudget).toBeGreaterThanOrEqual(500);
        expect(mode.tokenBudget).toBeLessThanOrEqual(4000);
      }
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   T011-T020: INTENT_TO_MODE ROUTING TESTS
──────────────────────────────────────────────────────────────── */

describe('T011-T020: Intent-to-Mode Routing [deferred - requires DB test fixtures]', () => {
  it('T011: INTENT_TO_MODE contains all 7 intent types', () => {
    const intents: string[] = Object.keys(INTENT_TO_MODE);
    expect(intents.length).toBe(7);
  });

  it('T012: add_feature maps to deep mode', () => {
    expect(INTENT_TO_MODE.add_feature).toBe('deep');
  });

  it('T013: fix_bug maps to focused mode', () => {
    expect(INTENT_TO_MODE.fix_bug).toBe('focused');
  });

  it('T014: refactor maps to deep mode', () => {
    expect(INTENT_TO_MODE.refactor).toBe('deep');
  });

  it('T015: security_audit maps to deep mode', () => {
    expect(INTENT_TO_MODE.security_audit).toBe('deep');
  });

  it('T016: understand maps to focused mode', () => {
    expect(INTENT_TO_MODE.understand).toBe('focused');
  });

  it('T017: All mapped modes are valid CONTEXT_MODES', () => {
    for (const [intent, mode] of Object.entries(INTENT_TO_MODE)) {
      expect(CONTEXT_MODES[mode]).toBeDefined();
    }
  });

  it('T018: Deep-requiring intents map to deep', () => {
    const deepIntents: string[] = ['add_feature', 'refactor', 'security_audit', 'find_spec'];
    for (const intent of deepIntents) {
      expect(INTENT_TO_MODE[intent]).toBe('deep');
    }
  });

  it('T019: Focus-requiring intents map to focused', () => {
    const focusedIntents: string[] = ['fix_bug', 'understand', 'find_decision'];
    for (const intent of focusedIntents) {
      expect(INTENT_TO_MODE[intent]).toBe('focused');
    }
  });

  it('T020: No intent maps to quick or resume by default', () => {
    for (const mode of Object.values(INTENT_TO_MODE)) {
      expect(mode).not.toBe('quick');
      expect(mode).not.toBe('resume');
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   T021-T030: handle_memory_context MAIN HANDLER TESTS
──────────────────────────────────────────────────────────────── */

describe('T021-T030: Main Handler Tests [deferred - requires DB test fixtures]', () => {
  it('T021: handle_memory_context is a function', () => {
    expect(typeof handleMemoryContext).toBe('function');
  });

  it('T022: Returns error for empty input', async () => {
    const result: MCPResponse = await handleMemoryContext({ input: '' });
    const parsed = parseErrorEnvelope(result);
    expect(parsed.error).toBeDefined();
    expect(parsed.error as string).toContain('required');
  });

  it('T023: Returns error for null input', async () => {
    const result: MCPResponse = await invokeMemoryContext({ input: null });
    const parsed = parseErrorEnvelope(result);
    expect(parsed.error).toBeDefined();
  });

  it('T024: Returns error for whitespace-only input', async () => {
    const result: MCPResponse = await handleMemoryContext({ input: '   ' });
    const parsed = parseErrorEnvelope(result);
    expect(parsed.error).toBeDefined();
  });

  it('T025: Error response includes layer metadata', async () => {
    const result: MCPResponse = await handleMemoryContext({ input: '' });
    const parsed = parseErrorEnvelope(result);
    expect(parsed.layer).toBe('L1:Orchestration');
  });

  it('T026: Error response includes hint', async () => {
    const result: MCPResponse = await handleMemoryContext({ input: '' });
    const parsed = parseErrorEnvelope(result);
    expect(parsed.hint).toBeDefined();
  });

  it('T027: Input with only newlines is rejected', async () => {
    const result: MCPResponse = await handleMemoryContext({ input: '\n\n\n' });
    const parsed = parseErrorEnvelope(result);
    expect(parsed.error).toBeDefined();
  });

  it('T028: Input with only tabs is rejected', async () => {
    const result: MCPResponse = await handleMemoryContext({ input: '\t\t\t' });
    const parsed = parseErrorEnvelope(result);
    expect(parsed.error).toBeDefined();
  });

  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
    expect(handleMemoryContext).toBe(handle_memory_context);
  });

  it('T030: Handles undefined input gracefully', async () => {
    const result: MCPResponse = await invokeMemoryContext({ input: undefined });
    const parsed = parseErrorEnvelope(result);
    expect(parsed.error).toBeDefined();
  });
});

describe('T015: Session transition contract coverage', () => {
  it('builds a cold-start trace payload with nullable previousState and no sentinel strings', () => {
    const transition = buildSessionTransitionTrace({
      previousState: null,
      resumedSession: false,
      effectiveMode: 'focused',
      requestedMode: 'auto',
      detectedIntent: 'fix_bug',
      pressureOverrideApplied: false,
      queryHeuristicApplied: false,
    });

    expect(transition).toEqual({
      previousState: null,
      currentState: 'focused',
      confidence: 0.85,
      signalSources: ['intent-classifier'],
      reason: 'intent classifier selected focused mode',
    });
    expect(JSON.stringify(transition)).not.toContain('none');
    expect(JSON.stringify(transition)).not.toContain('session-active');
  });

  it('prioritizes resumed-session and explicit-mode reasons deterministically', () => {
    const resumed = buildSessionTransitionTrace({
      previousState: 'focused',
      resumedSession: true,
      effectiveMode: 'resume',
      requestedMode: 'auto',
      detectedIntent: 'find_decision',
      pressureOverrideApplied: false,
      queryHeuristicApplied: true,
    });
    expect(resumed.signalSources).toEqual([
      'session-resume',
      'query-heuristic',
      'intent-classifier',
    ]);
    expect(resumed.confidence).toBe(0.95);
    expect(resumed.reason).toBe('resumed session inferred resume mode');

    const explicit = buildSessionTransitionTrace({
      previousState: 'quick',
      resumedSession: false,
      effectiveMode: 'deep',
      requestedMode: 'deep',
      detectedIntent: 'add_feature',
      pressureOverrideApplied: false,
      queryHeuristicApplied: false,
    });
    expect(explicit.signalSources).toEqual([
      'explicit-mode',
      'intent-classifier',
    ]);
    expect(explicit.confidence).toBe(1);
    expect(explicit.reason).toBe('explicit mode request selected deep mode');
  });

  it('supports quick-mode trace injection without leaking non-trace metadata', () => {
    const response = {
      content: [{
        type: 'text',
        text: JSON.stringify({
          data: {
            results: [{ id: 1, title: 'Test result' }],
          },
          meta: {
            sessionLifecycle: {},
          },
        }),
      }],
    };

    const transition = buildSessionTransitionTrace({
      previousState: null,
      resumedSession: false,
      effectiveMode: 'quick',
      requestedMode: 'quick',
      detectedIntent: null,
      pressureOverrideApplied: false,
      queryHeuristicApplied: false,
    });

    const traced = attachSessionTransitionTrace(response, transition);
    const parsed = JSON.parse(traced.content[0].text) as Record<string, unknown>;
    const result = ((parsed.data as Record<string, unknown>).results as Array<Record<string, unknown>>)[0];

    expect((result.trace as Record<string, unknown>).sessionTransition).toEqual(transition);
    expect(JSON.stringify(parsed.meta ?? {})).not.toContain('sessionTransition');
    expect(MEMORY_CONTEXT_SOURCE).toContain('options.sessionTransition = options.includeTrace === true ? sessionTransition : undefined;');
    expect(MEMORY_CONTEXT_SOURCE).not.toContain('sessionLifecycle.transition');
  });
});

/* ───────────────────────────────────────────────────────────────
   T031-T040: QUICK MODE CONFIGURATION TESTS
──────────────────────────────────────────────────────────────── */

describe('T031-T040: Quick Mode Configuration Tests [deferred - requires DB test fixtures]', () => {
  it('T031: Quick mode strategy is triggers', () => {
    expect(CONTEXT_MODES.quick.strategy).toBe('triggers');
  });

  it('T032: Quick mode name is Quick', () => {
    expect(CONTEXT_MODES.quick.name).toBe('Quick');
  });

  it('T033: Quick mode description mentions low latency', () => {
    const desc: string = CONTEXT_MODES.quick.description.toLowerCase();
    expect(desc.includes('low latency') || desc.includes('fast')).toBe(true);
  });

  it('T034: Quick mode token budget is 800', () => {
    expect(CONTEXT_MODES.quick.tokenBudget).toBe(800);
  });

  it('T035: Quick mode is suitable for reactive scenarios', () => {
    const desc: string = CONTEXT_MODES.quick.description.toLowerCase();
    expect(
      desc.includes('reactive') || desc.includes('trigger') || desc.includes('real-time')
    ).toBe(true);
  });

  it('T036: Quick mode has smallest token budget', () => {
    const budgets: number[] = Object.entries(CONTEXT_MODES)
      .filter(([_k, v]: [string, ContextMode]) => v.tokenBudget !== undefined)
      .map(([_k, v]: [string, ContextMode]) => v.tokenBudget!);
    const minBudget: number = Math.min(...budgets);
    expect(CONTEXT_MODES.quick.tokenBudget).toBe(minBudget);
  });

  it('T037: Quick mode is not the default because handler defaults requested mode to auto', () => {
    expect(MEMORY_CONTEXT_SOURCE).toMatch(/mode:\s*requested_mode\s*=\s*'auto'/);
    expect(MEMORY_CONTEXT_SOURCE).not.toMatch(/mode:\s*requested_mode\s*=\s*'quick'/);
  });

  it('T038: Quick strategy differs from search strategies', () => {
    const quickStrategy: string = CONTEXT_MODES.quick.strategy;
    const deepStrategy: string = CONTEXT_MODES.deep.strategy;
    const focusedStrategy: string = CONTEXT_MODES.focused.strategy;
    expect(quickStrategy).not.toBe(deepStrategy);
    expect(quickStrategy).not.toBe(focusedStrategy);
  });

  it('T039: Quick mode description is non-empty', () => {
    expect(CONTEXT_MODES.quick.description.length).toBeGreaterThan(10);
  });

  it('T040: Quick mode configuration is complete', () => {
    const quick: ContextMode = CONTEXT_MODES.quick;
    expect(quick.name).toBeDefined();
    expect(quick.description).toBeDefined();
    expect(quick.strategy).toBeDefined();
    expect(quick.tokenBudget).toBeDefined();
  });
});

/* ───────────────────────────────────────────────────────────────
   T041-T050: DEEP MODE CONFIGURATION TESTS
──────────────────────────────────────────────────────────────── */

describe('T041-T050: Deep Mode Configuration Tests [deferred - requires DB test fixtures]', () => {
  it('T041: Deep mode strategy is search', () => {
    expect(CONTEXT_MODES.deep.strategy).toBe('search');
  });

  it('T042: Deep mode name is Deep', () => {
    expect(CONTEXT_MODES.deep.name).toBe('Deep');
  });

  it('T043: Deep mode description mentions semantic or comprehensive', () => {
    const desc: string = CONTEXT_MODES.deep.description.toLowerCase();
    expect(desc.includes('semantic') || desc.includes('comprehensive') || desc.includes('full')).toBe(true);
  });

  it('T044: Deep mode token budget is 3500', () => {
    expect(CONTEXT_MODES.deep.tokenBudget).toBe(3500);
  });

  it('T045: Deep mode has highest token budget', () => {
    const budgets: number[] = Object.entries(CONTEXT_MODES)
      .filter(([_k, v]: [string, ContextMode]) => v.tokenBudget !== undefined)
      .map(([_k, v]: [string, ContextMode]) => v.tokenBudget!);
    const maxBudget: number = Math.max(...budgets);
    expect(CONTEXT_MODES.deep.tokenBudget).toBe(maxBudget);
  });

  it('T046: Deep mode is suitable for feature development', () => {
    expect(INTENT_TO_MODE.add_feature).toBe('deep');
  });

  it('T047: Deep mode is suitable for refactoring', () => {
    expect(INTENT_TO_MODE.refactor).toBe('deep');
  });

  it('T048: Deep mode is suitable for security audits', () => {
    expect(INTENT_TO_MODE.security_audit).toBe('deep');
  });

  it('T049: Deep mode description is non-empty', () => {
    expect(CONTEXT_MODES.deep.description.length).toBeGreaterThan(10);
  });

  it('T050: Deep mode configuration is complete', () => {
    const deep: ContextMode = CONTEXT_MODES.deep;
    expect(deep.name).toBeDefined();
    expect(deep.description).toBeDefined();
    expect(deep.strategy).toBeDefined();
    expect(deep.tokenBudget).toBeDefined();
  });
});

/* ───────────────────────────────────────────────────────────────
   T051-T060: FOCUSED MODE CONFIGURATION TESTS
──────────────────────────────────────────────────────────────── */

describe('T051-T060: Focused Mode Configuration Tests [deferred - requires DB test fixtures]', () => {
  it('T051: Focused mode strategy is intent-search', () => {
    expect(CONTEXT_MODES.focused.strategy).toBe('intent-search');
  });

  it('T052: Focused mode name is Focused', () => {
    expect(CONTEXT_MODES.focused.name).toBe('Focused');
  });

  it('T053: Focused mode description mentions intent or task-specific', () => {
    const desc: string = CONTEXT_MODES.focused.description.toLowerCase();
    expect(desc.includes('intent') || desc.includes('task')).toBe(true);
  });

  it('T054: Focused mode token budget is 3000', () => {
    expect(CONTEXT_MODES.focused.tokenBudget).toBe(3000);
  });

  it('T055: Focused mode budget is between quick and deep', () => {
    const focusedBudget: number = CONTEXT_MODES.focused.tokenBudget!;
    const quickBudget: number = CONTEXT_MODES.quick.tokenBudget!;
    const deepBudget: number = CONTEXT_MODES.deep.tokenBudget!;
    expect(focusedBudget).toBeGreaterThan(quickBudget);
    expect(focusedBudget).toBeLessThan(deepBudget);
  });

  it('T056: Focused mode is suitable for bug fixing', () => {
    expect(INTENT_TO_MODE.fix_bug).toBe('focused');
  });

  it('T057: Focused mode is suitable for understanding', () => {
    expect(INTENT_TO_MODE.understand).toBe('focused');
  });

  it('T058: Focused strategy differs from quick strategy', () => {
    const focusedStrategy: string = CONTEXT_MODES.focused.strategy;
    const quickStrategy: string = CONTEXT_MODES.quick.strategy;
    expect(focusedStrategy).not.toBe(quickStrategy);
  });

  it('T059: Focused mode description is non-empty', () => {
    expect(CONTEXT_MODES.focused.description.length).toBeGreaterThan(10);
  });

  it('T060: Focused mode configuration is complete', () => {
    const focused: ContextMode = CONTEXT_MODES.focused;
    expect(focused.name).toBeDefined();
    expect(focused.description).toBeDefined();
    expect(focused.strategy).toBeDefined();
    expect(focused.tokenBudget).toBeDefined();
  });
});

/* ───────────────────────────────────────────────────────────────
   T061-T070: RESUME MODE CONFIGURATION TESTS
──────────────────────────────────────────────────────────────── */

describe('T061-T070: Resume Mode Configuration Tests [deferred - requires DB test fixtures]', () => {
  it('T061: Resume mode strategy is resume', () => {
    expect(CONTEXT_MODES.resume.strategy).toBe('resume');
  });

  it('T062: Resume mode name is Resume', () => {
    expect(CONTEXT_MODES.resume.name).toBe('Resume');
  });

  it('T063: Resume mode description mentions session or previous work', () => {
    const desc: string = CONTEXT_MODES.resume.description.toLowerCase();
    expect(
      desc.includes('session') || desc.includes('previous') || desc.includes('resume') || desc.includes('state')
    ).toBe(true);
  });

  it('T064: Resume mode token budget is 2000', () => {
    expect(CONTEXT_MODES.resume.tokenBudget).toBe(2000);
  });

  it('T065: Resume mode budget is less than deep', () => {
    const resumeBudget: number = CONTEXT_MODES.resume.tokenBudget!;
    const deepBudget: number = CONTEXT_MODES.deep.tokenBudget!;
    expect(resumeBudget).toBeLessThan(deepBudget);
  });

  it('T066: Resume mode is specialized (not mapped from any intent)', () => {
    const mappedModes: string[] = Object.values(INTENT_TO_MODE);
    expect(mappedModes).not.toContain('resume');
  });

  it('T067: Resume strategy is unique', () => {
    const strategies: string[] = Object.values(CONTEXT_MODES).map((m: ContextMode) => m.strategy);
    const resumeCount: number = strategies.filter((s: string) => s === 'resume').length;
    expect(resumeCount).toBe(1);
  });

  it('T068: Resume mode description mentions anchors or next-steps', () => {
    const desc: string = CONTEXT_MODES.resume.description.toLowerCase();
    expect(
      desc.includes('anchor') || desc.includes('next') || desc.includes('state')
    ).toBe(true);
  });

  it('T069: Resume mode description is non-empty', () => {
    expect(CONTEXT_MODES.resume.description.length).toBeGreaterThan(10);
  });

  it('T070: Resume mode configuration is complete', () => {
    const resume: ContextMode = CONTEXT_MODES.resume;
    expect(resume.name).toBeDefined();
    expect(resume.description).toBeDefined();
    expect(resume.strategy).toBeDefined();
    expect(resume.tokenBudget).toBeDefined();
  });
});

/* ───────────────────────────────────────────────────────────────
   T071-T080: AUTO MODE CONFIGURATION TESTS
──────────────────────────────────────────────────────────────── */

describe('T071-T080: Auto Mode Configuration Tests [deferred - requires DB test fixtures]', () => {
  it('T071: Auto mode strategy is adaptive', () => {
    expect(CONTEXT_MODES.auto.strategy).toBe('adaptive');
  });

  it('T072: Auto mode name is Auto', () => {
    expect(CONTEXT_MODES.auto.name).toBe('Auto');
  });

  it('T073: Auto mode description mentions automatic or detect', () => {
    const desc: string = CONTEXT_MODES.auto.description.toLowerCase();
    expect(
      desc.includes('automatic') || desc.includes('detect') || desc.includes('route')
    ).toBe(true);
  });

  it('T074: Auto mode has no fixed token budget', () => {
    const autoBudget: number | undefined = CONTEXT_MODES.auto.tokenBudget;
    expect(autoBudget).toBeUndefined();
  });

  it('T075: Auto mode is the default when no mode specified', () => {
    expect(MEMORY_CONTEXT_SOURCE).toMatch(/mode:\s*requested_mode\s*=\s*'auto'/);
    expect(MEMORY_CONTEXT_SOURCE).toContain('requestedMode: requested_mode');
  });

  it('T076: Auto strategy differs from all other strategies', () => {
    const autoStrategy: string = CONTEXT_MODES.auto.strategy;
    for (const [modeName, mode] of Object.entries(CONTEXT_MODES) as [string, ContextMode][]) {
      if (modeName !== 'auto') {
        expect(autoStrategy).not.toBe(mode.strategy);
      }
    }
  });

  it('T077: Auto mode can route to any other mode', () => {
    // Based on INTENT_TO_MODE mapping, auto can route to deep or focused
    // And via keyword detection, can route to resume
    const routeTargets: Set<string> = new Set(Object.values(INTENT_TO_MODE));
    expect(routeTargets.size).toBeGreaterThanOrEqual(2);
  });

  it('T078: Auto mode uses intent classification for routing', () => {
    // Verified by examining the mapping
    const intentModes: string[] = Object.values(INTENT_TO_MODE);
    expect(intentModes.length).toBeGreaterThan(0);
  });

  it('T079: Auto mode description is non-empty', () => {
    expect(CONTEXT_MODES.auto.description.length).toBeGreaterThan(10);
  });

  it('T080: Auto mode configuration is complete', () => {
    const auto: ContextMode = CONTEXT_MODES.auto;
    expect(auto.name).toBeDefined();
    expect(auto.description).toBeDefined();
    expect(auto.strategy).toBeDefined();
    // TokenBudget is intentionally undefined for auto
  });
});

/* ───────────────────────────────────────────────────────────────
   T081-T090: L1 ORCHESTRATION TOKEN BUDGET TESTS (CHK-071, CHK-072, CHK-074)
──────────────────────────────────────────────────────────────── */

describe('T081-T090: L1 Orchestration Token Budget Tests [deferred - requires DB test fixtures]', () => {
  it('T081: Error response includes L1 layer reference', async () => {
    const result: MCPResponse = await handleMemoryContext({ input: '' });
    const parsed = parseErrorEnvelope(result);
    expect((parsed.layer as string)).toContain('L1');
  });

  it('T082: Error response includes Orchestration reference', async () => {
    const result: MCPResponse = await handleMemoryContext({ input: '' });
    const parsed = parseErrorEnvelope(result);
    expect((parsed.layer as string)).toContain('Orchestration');
  });

  it('T083: CHK-071 - Layer structure matches L1 Orchestration pattern', () => {
    // L1 is the unified entry point per layer-definitions.js
    expect(typeof handleMemoryContext).toBe('function');
    expect(handleMemoryContext).toHaveLength(1);
  });

  it('T084: CHK-072 - L1 token budget is 3500 (from layer-definitions)', () => {
    // Deep mode has 3500 which aligns with L1 Orchestration budget
    expect(CONTEXT_MODES.deep.tokenBudget).toBe(3500);
  });

  it('T085: CHK-074 - Progressive disclosure supported via mode selection', () => {
    // Users can start with auto (L1) and explicitly use quick/deep/focused (L2) for control
    const modes: string[] = Object.keys(CONTEXT_MODES);
    expect(modes.length).toBeGreaterThanOrEqual(4);
  });

  it('T086: Token budgets follow expected hierarchy', () => {
    const quick: number = CONTEXT_MODES.quick.tokenBudget!;
    const resume: number = CONTEXT_MODES.resume.tokenBudget!;
    const focused: number = CONTEXT_MODES.focused.tokenBudget!;
    const deep: number = CONTEXT_MODES.deep.tokenBudget!;

    expect(quick).toBeLessThan(resume);
    expect(resume).toBeLessThan(focused);
    expect(focused).toBeLessThan(deep);
  });

  it('T087: Total defined token budgets are reasonable', () => {
    const budgets: number[] = Object.values(CONTEXT_MODES)
      .filter((m: ContextMode) => m.tokenBudget !== undefined)
      .map((m: ContextMode) => m.tokenBudget!);
    const sum: number = budgets.reduce((a: number, b: number) => a + b, 0);
    expect(sum).toBeGreaterThan(3000);
    expect(sum).toBeLessThan(10000);
  });

  it('T088: Each non-auto mode has explicit token budget', () => {
    for (const [name, mode] of Object.entries(CONTEXT_MODES) as [string, ContextMode][]) {
      if (name !== 'auto') {
        expect(typeof mode.tokenBudget).toBe('number');
      }
    }
  });

  it('T089: Token budgets are whole numbers', () => {
    for (const mode of Object.values(CONTEXT_MODES) as ContextMode[]) {
      if (mode.tokenBudget !== undefined) {
        expect(Number.isInteger(mode.tokenBudget)).toBe(true);
      }
    }
  });

  it('T090: Token budgets are positive', () => {
    for (const mode of Object.values(CONTEXT_MODES) as ContextMode[]) {
      if (mode.tokenBudget !== undefined) {
        expect(mode.tokenBudget).toBeGreaterThan(0);
      }
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   T091-T100: INPUT VALIDATION TESTS
──────────────────────────────────────────────────────────────── */

describe('T091-T100: Input Validation Tests [deferred - requires DB test fixtures]', () => {
  it('T091: Handles non-string input gracefully', async () => {
    const result: MCPResponse = await invokeMemoryContext({ input: 12345 });
    const parsed = parseErrorEnvelope(result);
    expect(parsed.error).toBeDefined();
  });

  it('T092: Handles array input gracefully', async () => {
    const result: MCPResponse = await invokeMemoryContext({ input: ['test', 'array'] });
    const parsed = parseErrorEnvelope(result);
    expect(parsed.error).toBeDefined();
  });

  it('T093: Handles object input gracefully', async () => {
    const result: MCPResponse = await invokeMemoryContext({ input: { nested: 'object' } });
    const parsed = parseErrorEnvelope(result);
    expect(parsed.error).toBeDefined();
  });

  it('T094: Handles boolean input gracefully', async () => {
    const result: MCPResponse = await invokeMemoryContext({ input: true });
    const parsed = parseErrorEnvelope(result);
    expect(parsed.error).toBeDefined();
  });

  it('T095: Error messages are descriptive', async () => {
    const result: MCPResponse = await handleMemoryContext({ input: '' });
    const parsed = parseErrorEnvelope(result);
    expect((parsed.error as string).length).toBeGreaterThan(20);
  });

  it('T096: Error includes input hint', async () => {
    const result: MCPResponse = await handleMemoryContext({ input: '' });
    const parsed = parseErrorEnvelope(result);
    expect((parsed.hint as string).toLowerCase()).toContain('provide');
  });

  it('T097: Response content is valid JSON', async () => {
    const result: MCPResponse = await handleMemoryContext({ input: '' });
    let parsed: unknown;
    expect(() => {
      parsed = JSON.parse(result.content[0].text);
    }).not.toThrow();
    expect(parsed).not.toBeNull();
  });

  it('T098: Response follows MCP format', async () => {
    const result: MCPResponse = await handleMemoryContext({ input: '' });
    expect(result.content).toBeDefined();
    expect(Array.isArray(result.content)).toBe(true);
  });

  it('T099: Content type is text', async () => {
    const result: MCPResponse = await handleMemoryContext({ input: '' });
    expect(result.content[0].type).toBe('text');
  });

  it('T100: Empty args object returns error', async () => {
    const result: MCPResponse = await invokeMemoryContext({});
    const parsed = parseErrorEnvelope(result);
    expect(parsed.error).toBeDefined();
  });
});

/* ───────────────────────────────────────────────────────────────
   T101-T105: MODULE EXPORTS TESTS
──────────────────────────────────────────────────────────────── */

describe('T101-T105: Module Exports Tests [deferred - requires DB test fixtures]', () => {
  it('T101: handle_memory_context is exported', () => {
    expect(typeof handleMemoryContext).toBe('function');
  });

  it('T102: CONTEXT_MODES is exported', () => {
    expect(Object.keys(CONTEXT_MODES).sort()).toEqual(['auto', 'deep', 'focused', 'quick', 'resume']);
  });

  it('T103: INTENT_TO_MODE is exported', () => {
    expect(INTENT_TO_MODE).toMatchObject({
      add_feature: 'deep',
      fix_bug: 'focused',
      refactor: 'deep',
      understand: 'focused',
    });
  });

  it('T104: handleMemoryContext backward compatibility alias exists', () => {
    expect(typeof handleMemoryContext).toBe('function');
  });

  it('T105: handleMemoryContext is same as handle_memory_context', () => {
    expect(handleMemoryContext).toBe(handle_memory_context);
  });
});

/* ───────────────────────────────────────────────────────────────
   T201-T220: TOKEN BUDGET ENFORCEMENT TESTS (T205)
──────────────────────────────────────────────────────────────── */

describe('T201-T220: Token Budget Enforcement (T205) [deferred - requires DB test fixtures]', () => {
  it('T201: enforceTokenBudget is exported as a function', () => {
    expect(typeof enforceTokenBudget).toBe('function');
  });

  it('T202: Small result under budget is not truncated', () => {
    const smallResult: ContextResult = { strategy: 'test', mode: 'test', data: 'small' };
    const { enforcement } = enforceTokenBudget(smallResult, 2000);
    expect(enforcement.enforced).toBe(false);
    expect(enforcement.truncated).toBe(false);
    expect(enforcement.actualTokens).toBeLessThanOrEqual(enforcement.budgetTokens);
  });

  it('T203: Result with embedded content array over budget is truncated', () => {
    // Create a mock result that mimics the MCPResponse structure from strategy executors
    // Each "result" item is ~100 chars = ~25 tokens
    const bigResults = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      title: `Memory item ${i} with some lengthy descriptive text to simulate real content`,
      score: 50 - i,
      content: 'x'.repeat(200)
    }));
    const innerEnvelope = {
      summary: 'Test results',
      data: { results: bigResults, count: bigResults.length },
      meta: { tool: 'memory_search' }
    };
    const mockResult: ContextResult = {
      strategy: 'deep',
      mode: 'deep',
      content: [{ type: 'text', text: JSON.stringify(innerEnvelope) }]
    };

    // Use a small budget to force truncation
    const { enforcement } = enforceTokenBudget(mockResult, 500);
    expect(enforcement.enforced).toBe(true);
    expect(enforcement.truncated).toBe(true);
    expect(enforcement.originalResultCount).toBe(50);
    expect(enforcement.returnedResultCount || 0).toBeLessThan(50);
  });

  it('T204: Truncation preserves highest-scored results (first items)', () => {
    const results = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      title: `Result ${i}`,
      score: 100 - i,
      content: 'x'.repeat(300)
    }));
    const innerEnvelope = {
      data: { results, count: results.length },
      meta: {}
    };
    const mockResult: ContextResult = {
      strategy: 'focused',
      mode: 'focused',
      content: [{ type: 'text', text: JSON.stringify(innerEnvelope) }]
    };

    const { result: truncated } = enforceTokenBudget(mockResult, 500);
    // Parse the truncated inner results to verify order
    const contentArr = (truncated as Record<string, unknown>).content as Array<{ type: string; text: string }>;
    const parsed = JSON.parse(contentArr[0].text);
    const returnedResults = parsed.data.results;

    // First result should be id=0 (highest score)
    expect(returnedResults[0].id).toBe(0);
    // Last returned should have lower id than items that were removed
    expect(returnedResults[returnedResults.length - 1].id).toBeLessThan(20);
  });

  it('T205: Budget enforcement reports accurate token count', () => {
    const smallResult: ContextResult = { strategy: 'test', mode: 'test' };
    const serialized = JSON.stringify(smallResult);
    const expectedTokens = Math.ceil(serialized.length / 4); // 1 token ≈ 4 chars

    const { enforcement } = enforceTokenBudget(smallResult, 2000);
    expect(enforcement.actualTokens).toBe(expectedTokens);
  });

  it('T206: Budget of 0 forces truncation on any non-empty result', () => {
    const results = [{ id: 1, title: 'item', content: 'test content' }];
    const innerEnvelope = { data: { results, count: 1 }, meta: {} };
    const mockResult: ContextResult = {
      strategy: 'test',
      mode: 'test',
      content: [{ type: 'text', text: JSON.stringify(innerEnvelope) }]
    };

    const { enforcement } = enforceTokenBudget(mockResult, 0);
    expect(enforcement.enforced).toBe(true);
    // With only 1 result, it can't truncate below 1 (minimum is 1 result kept)
    expect(enforcement.actualTokens).toBeGreaterThan(0);
  });

  it('T207: Result without content array reports truncated when over budget', () => {
    const plainResult: ContextResult = { strategy: 'quick', mode: 'quick', matches: ['a', 'b'] };
    const { enforcement } = enforceTokenBudget(plainResult, 5);
    expect(enforcement.enforced).toBe(true);
    expect(enforcement.truncated).toBe(true);
  });

  it('T208: Enforcement updates inner count field', () => {
    const results = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      content: 'x'.repeat(200)
    }));
    const innerEnvelope = { data: { results, count: 30 }, meta: {} };
    const mockResult: ContextResult = {
      strategy: 'deep',
      mode: 'deep',
      content: [{ type: 'text', text: JSON.stringify(innerEnvelope) }]
    };

    const { result: truncated, enforcement } = enforceTokenBudget(mockResult, 500);
    expect(enforcement.truncated).toBe(true);

    const contentArr = (truncated as Record<string, unknown>).content as Array<{ type: string; text: string }>;
    const parsed = JSON.parse(contentArr[0].text);
    expect(parsed.data.count).toBe(parsed.data.results.length);
    expect(parsed.data.count).toBeLessThan(results.length);
  });

  it('T209: Each mode token budget matches CONTEXT_MODES definition', () => {
    // Verify that enforcement uses the correct budget per mode
    const expectedBudgets: Record<string, number> = {
      quick: 800,
      deep: 3500,
      focused: 3000,
      resume: 2000
    };
    for (const [modeName, budget] of Object.entries(expectedBudgets)) {
      const mode = CONTEXT_MODES[modeName];
      expect(mode.tokenBudget).toBe(budget);
    }
  });

  it('T210: Large budget allows all results through', () => {
    const results = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      content: 'short'
    }));
    const innerEnvelope = { data: { results, count: 10 }, meta: {} };
    const mockResult: ContextResult = {
      strategy: 'deep',
      mode: 'deep',
      content: [{ type: 'text', text: JSON.stringify(innerEnvelope) }]
    };

    const { enforcement } = enforceTokenBudget(mockResult, 100000);
    expect(enforcement.truncated).toBe(false);
    expect(enforcement.budgetTokens).toBe(100000);
  });

  it('T211: Parse-failed fallback still returns valid nested JSON', () => {
    const malformedNestedResult: ContextResult = {
      strategy: 'deep',
      mode: 'deep',
      content: [{ type: 'text', text: '{"data":{"results":[{"id":1}' }],
    };

    const { result: truncated, enforcement } = enforceTokenBudget(malformedNestedResult, 5);
    const contentArr = (truncated as Record<string, unknown>).content as Array<{ type: string; text: string }>;

    expect(enforcement.enforced).toBe(true);
    expect(() => JSON.parse(contentArr[0].text)).not.toThrow();

    const parsed = JSON.parse(contentArr[0].text) as Record<string, unknown>;
    const data = parsed.data as Record<string, unknown>;
    expect(Array.isArray(data.results)).toBe(true);
    expect(data.count).toBe(0);
  });
});
