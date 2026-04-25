// TEST: Tool Input Schema Validation
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

const { mockRequireDb } = vi.hoisted(() => ({
  mockRequireDb: vi.fn(() => ({})),
}));

vi.mock('../utils', () => ({
  requireDb: mockRequireDb,
}));

import { TOOL_DEFINITIONS, getSchema, validateToolArgs } from '../tool-schemas';
import { validateToolInputSchema } from '../utils/tool-input-schema';

const ORIGINAL_STRICT_SCHEMAS_ENV = process.env.SPECKIT_STRICT_SCHEMAS;

type ToolArgs = Record<string, unknown>;

interface ToolSchemaCase {
  name: string;
  toolName: string;
  args: ToolArgs;
}

afterEach(() => {
  vi.restoreAllMocks();
  mockRequireDb.mockReset();
  mockRequireDb.mockImplementation(() => ({}));
  if (ORIGINAL_STRICT_SCHEMAS_ENV === undefined) {
    delete process.env.SPECKIT_STRICT_SCHEMAS;
  } else {
    process.env.SPECKIT_STRICT_SCHEMAS = ORIGINAL_STRICT_SCHEMAS_ENV;
  }
});

function expectPublicAndRuntimeAccept(toolName: string, args: ToolArgs): void {
  expect(() => {
    validateToolInputSchema(toolName, args, TOOL_DEFINITIONS);
  }).not.toThrow();
  expect(() => {
    validateToolArgs(toolName, args);
  }).not.toThrow();
}

function expectPublicAndRuntimeReject(toolName: string, args: ToolArgs): void {
  expect(() => {
    validateToolInputSchema(toolName, args, TOOL_DEFINITIONS);
  }).toThrow();
  expect(() => {
    validateToolArgs(toolName, args);
  }).toThrow();
}

/* ───────────────────────────────────────────────────────────────
   1. SCHEMA STRUCTURAL INTEGRITY
──────────────────────────────────────────────────────────────── */

describe('Tool Schema Structural Integrity', () => {
  it('public tool schemas do not publish top-level combinators', () => {
    for (const tool of TOOL_DEFINITIONS) {
      const schema = tool.inputSchema as Record<string, unknown>;
      expect(schema).not.toHaveProperty('oneOf');
      expect(schema).not.toHaveProperty('not');
      expect(schema).not.toHaveProperty('allOf');
      expect(schema).not.toHaveProperty('anyOf');
    }
  });

  it('all tool schemas have type: object at top level', () => {
    for (const tool of TOOL_DEFINITIONS) {
      const schema = tool.inputSchema as Record<string, unknown>;
      expect(schema.type).toBe('object');
    }
  });

  it('all tool names are unique', () => {
    const names = TOOL_DEFINITIONS.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('all tools have non-empty descriptions', () => {
    for (const tool of TOOL_DEFINITIONS) {
      expect(tool.description.length).toBeGreaterThan(0);
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   2. SCHEMA VALIDATION LOGIC
──────────────────────────────────────────────────────────────── */

describe('Tool Input Schema Validation', () => {
  it('rejects missing required fields', () => {
    expect(() => {
      validateToolInputSchema('memory_context', {}, TOOL_DEFINITIONS);
    }).toThrow(/Missing required arguments/);
  });

  it('supports numeric strings for number fields (compatibility)', () => {
    expect(() => {
      validateToolInputSchema('memory_delete', { id: '42' }, TOOL_DEFINITIONS);
    }).not.toThrow();
  });

  it('strict mode rejects unknown properties when SPECKIT_STRICT_SCHEMAS is enabled', () => {
    process.env.SPECKIT_STRICT_SCHEMAS = 'true';
    const schema = getSchema({
      query: z.string().min(2),
    });

    const parsed = schema.safeParse({ query: 'valid query', unexpected: true });
    expect(parsed.success).toBe(false);

    if (!parsed.success) {
      expect(parsed.error.issues.some((issue) => issue.code === 'unrecognized_keys')).toBe(true);
    }
  });

  it('passthrough mode allows unknown properties when SPECKIT_STRICT_SCHEMAS is disabled', () => {
    process.env.SPECKIT_STRICT_SCHEMAS = 'false';
    const schema = getSchema({
      query: z.string().min(2),
    });

    const parsed = schema.parse({ query: 'valid query', unexpected: true });
    expect(parsed).toEqual({ query: 'valid query', unexpected: true });
  });

  it('enforces enum validation for provided fields', () => {
    expect(() => {
      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
    }).toThrow(/must be one of/);
  });

  it('skips validation for unknown tools to preserve legacy flow', () => {
    expect(() => {
      validateToolInputSchema('unknown_tool', { any: 'value' }, TOOL_DEFINITIONS);
    }).not.toThrow();
  });

  it('logs schema validation failures to stderr for auditability', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
    }).toThrow();

    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy.mock.calls.some((call) => String(call[0]).includes('[schema-validation] memory_search:'))).toBe(true);
  });

  it('accepts eval_run_ablation mode and custom queries', () => {
    expect(() => {
      validateToolArgs('eval_run_ablation', {
        mode: 'k_sensitivity',
        queries: ['graph retrieval regression', 'rrf fusion stability'],
        recallK: 20,
      });
    }).not.toThrow();
  });

  it('rejects unknown eval_run_ablation modes', () => {
    expect(() => {
      validateToolArgs('eval_run_ablation', {
        mode: 'not-a-real-mode',
      } as Record<string, unknown>);
    }).toThrow();
  });

  it('accepts canonical continuity route hints for memory_save', () => {
    expect(() => {
      validateToolArgs('memory_save', {
        filePath: '/tmp/example.md',
        routeAs: 'decision',
        mergeModeHint: 'insert-new-adr',
      });
    }).not.toThrow();
  });

  it('rejects unknown canonical continuity mergeModeHint values for memory_save', () => {
    expect(() => {
      validateToolArgs('memory_save', {
        filePath: '/tmp/example.md',
        mergeModeHint: 'append-new-session',
      } as Record<string, unknown>);
    }).toThrow();
  });

  it('includes canonical continuity route hints in memory_save validation guidance', () => {
    try {
      validateToolArgs('memory_save', {
        filePath: '/tmp/example.md',
        mergeModeHint: 'append-new-session',
      } as Record<string, unknown>);
      throw new Error('Expected validateToolArgs to throw for invalid mergeModeHint');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      expect(message).toContain('routeAs');
      expect(message).toContain('mergeModeHint');
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   3. memory_delete SCHEMA (oneOf REMOVED — HANDLER-VALIDATED)
──────────────────────────────────────────────────────────────── */

describe('memory_delete schema (oneOf removed, handler-validated)', () => {
  it('accepts single-delete with id', () => {
    expect(() => {
      validateToolInputSchema('memory_delete', { id: 42 }, TOOL_DEFINITIONS);
    }).not.toThrow();
  });

  it('accepts single-delete with numeric string id (compatibility)', () => {
    expect(() => {
      validateToolInputSchema('memory_delete', { id: '42' }, TOOL_DEFINITIONS);
    }).not.toThrow();
  });

  it('accepts bulk-delete with specFolder and confirm', () => {
    expect(() => {
      validateToolInputSchema('memory_delete', { specFolder: 'specs/001-test', confirm: true }, TOOL_DEFINITIONS);
    }).not.toThrow();
  });

  it('accepts combined id + specFolder (handler resolves to single-delete)', () => {
    expect(() => {
      validateToolInputSchema('memory_delete', { id: 1, specFolder: 'specs/001-test' }, TOOL_DEFINITIONS);
    }).not.toThrow();
  });

  it('rejects empty args when neither delete branch is satisfied', () => {
    expect(() => {
      validateToolInputSchema('memory_delete', {}, TOOL_DEFINITIONS);
    }).toThrow(/required schema constraints/);
  });

  it('rejects confirm values that do not satisfy the true-only safety gate', () => {
    expect(() => {
      validateToolInputSchema('memory_delete', { specFolder: 'specs/001', confirm: false }, TOOL_DEFINITIONS);
    }).toThrow(/expected constant true/);
  });

  it('rejects non-boolean confirm field via type check before const matching', () => {
    expect(() => {
      validateToolInputSchema('memory_delete', { specFolder: 'specs/001', confirm: 'yes' }, TOOL_DEFINITIONS);
    }).toThrow(/expected constant true|expected boolean/);
  });

  it('rejects non-number id field via type check', () => {
    expect(() => {
      validateToolInputSchema('memory_delete', { id: true }, TOOL_DEFINITIONS);
    }).toThrow(/expected number/);
  });
});

describe('memory_bulk_delete schema', () => {
  it('accepts confirm=true with a valid tier', () => {
    expect(() => {
      validateToolInputSchema('memory_bulk_delete', { tier: 'deprecated', confirm: true }, TOOL_DEFINITIONS);
    }).not.toThrow();
  });

  it('rejects confirm=false at schema level', () => {
    expect(() => {
      validateToolInputSchema('memory_bulk_delete', { tier: 'deprecated', confirm: false }, TOOL_DEFINITIONS);
    }).toThrow(/expected constant true/);
  });

  it('rejects non-integer olderThanDays values', () => {
    expect(() => {
      validateToolArgs('memory_bulk_delete', { tier: 'deprecated', confirm: true, olderThanDays: 1.5 });
    }).toThrow();
  });

  it('rejects NaN olderThanDays values', () => {
    expect(() => {
      validateToolArgs('memory_bulk_delete', { tier: 'deprecated', confirm: true, olderThanDays: Number.NaN });
    }).toThrow();
  });
});

/* ───────────────────────────────────────────────────────────────
   4. memory_search LIMIT CONTRACT (schema + runtime alignment)
──────────────────────────────────────────────────────────────── */

describe('memory_search limit contract', () => {
  it('public schema accepts cursor-only continuation', () => {
    expect(() => {
      validateToolInputSchema('memory_search', { cursor: 'opaque-cursor-token' }, TOOL_DEFINITIONS);
    }).not.toThrow();
  });

  it('runtime schema accepts cursor-only continuation', () => {
    expect(() => {
      validateToolArgs('memory_search', { cursor: 'opaque-cursor-token' });
    }).not.toThrow();
  });

  it('public schema accepts concepts-only search', () => {
    expect(() => {
      validateToolInputSchema('memory_search', { concepts: ['alpha', 'beta'] }, TOOL_DEFINITIONS);
    }).not.toThrow();
  });

  it('public schema rejects requests without query or concepts', () => {
    expect(() => {
      validateToolInputSchema('memory_search', {}, TOOL_DEFINITIONS);
    }).toThrow(/required schema constraints/);
  });

  it('accepts limit up to 100', () => {
    expect(() => {
      validateToolArgs('memory_search', { query: 'ab', limit: 100 });
    }).not.toThrow();
  });

  it('rejects limit above 100', () => {
    expect(() => {
      validateToolArgs('memory_search', { query: 'ab', limit: 101 });
    }).toThrow();
  });

  it('public schema rejects limit above 100', () => {
    expect(() => {
      validateToolInputSchema('memory_search', { query: 'ab', limit: 101 }, TOOL_DEFINITIONS);
    }).toThrow(/must be <= 100/);
  });

  it('runtime rejects concepts arrays shorter than 2 items', () => {
    expect(() => {
      validateToolArgs('memory_search', { concepts: ['solo'] });
    }).toThrow();
  });

  it('public schema rejects unknown memory_search parameters', () => {
    expect(() => {
      validateToolInputSchema('memory_search', { query: 'valid query', unexpected: true }, TOOL_DEFINITIONS);
    }).toThrow(/Unknown argument/);
  });

  it('public schema enforces query minimum length', () => {
    expect(() => {
      validateToolInputSchema('memory_search', { query: 'a' }, TOOL_DEFINITIONS);
    }).toThrow(/length must be >= 2/);
  });

  it('runtime rejects unknown memory_search parameters', () => {
    expect(() => {
      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
    }).toThrow(/Unknown parameter/);
  });

  it('runtime accepts governed scope fields for memory_search', () => {
    expect(() => {
      validateToolArgs('memory_search', {
        query: 'valid query',
        tenantId: 'tenant-a',
        userId: 'user-1',
        agentId: 'agent-1',
      });
    }).not.toThrow();
  });

  it('public and runtime schemas accept response profiles for memory_search', () => {
    const args = {
      query: 'valid query',
      profile: 'quick',
    };

    expect(() => {
      validateToolInputSchema('memory_search', args, TOOL_DEFINITIONS);
    }).not.toThrow();
    expect(validateToolArgs('memory_search', args)).toEqual(args);
  });
});

describe('governed retrieval schema propagation', () => {
  it('public and runtime schemas accept governed scope fields for memory_context', () => {
    const args = {
      input: 'resume auth work',
      tenantId: 'tenant-a',
      userId: 'user-1',
      agentId: 'agent-1',
    };

    expect(() => {
      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
    }).not.toThrow();
    expect(validateToolArgs('memory_context', args)).toEqual(args);
  });

  it('public and runtime schemas accept response profiles for memory_context', () => {
    const args = {
      input: 'resume auth work',
      profile: 'resume',
    };

    expect(() => {
      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
    }).not.toThrow();
    expect(validateToolArgs('memory_context', args)).toEqual(args);
  });

  it('public and runtime schemas accept governed scope fields for memory_quick_search', () => {
    const args = {
      query: 'auth design',
      tenantId: 'tenant-a',
      userId: 'user-1',
      agentId: 'agent-1',
    };

    expect(() => {
      validateToolInputSchema('memory_quick_search', args, TOOL_DEFINITIONS);
    }).not.toThrow();
    expect(validateToolArgs('memory_quick_search', args)).toEqual(args);
  });

  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
    const args = {
      prompt: 'resume auth work',
      specFolder: 'specs/001-auth',
      tenantId: 'tenant-a',
      userId: 'user-1',
      agentId: 'agent-1',
    };

    expect(() => {
      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
    }).not.toThrow();
    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
  });
  it('public causal tool schemas expose string memory identifiers', () => {
    const driftWhy = TOOL_DEFINITIONS.find((entry) => entry.name === 'memory_drift_why');
    const causalLink = TOOL_DEFINITIONS.find((entry) => entry.name === 'memory_causal_link');
    const driftWhySchema = driftWhy?.inputSchema as { properties?: Record<string, unknown> } | undefined;
    const causalLinkSchema = causalLink?.inputSchema as { properties?: Record<string, unknown> } | undefined;

    expect(driftWhySchema?.properties).toMatchObject({
      memoryId: { type: 'string' },
    });
    expect(causalLinkSchema?.properties).toMatchObject({
      sourceId: { type: 'string' },
      targetId: { type: 'string' },
    });
  });
});

describe('memory_health schema', () => {
  it('public schema rejects divergent_aliases limit above 200', () => {
    expect(() => {
      validateToolInputSchema('memory_health', { reportMode: 'divergent_aliases', limit: 201 }, TOOL_DEFINITIONS);
    }).toThrow(/must be <= 200/);
  });

  it('public schema accepts autoRepair confirmation payloads', () => {
    expect(() => {
      validateToolInputSchema('memory_health', { autoRepair: true, confirmed: true }, TOOL_DEFINITIONS);
    }).not.toThrow();
  });

  it('runtime schema preserves confirmed for handler execution', () => {
    const parsed = validateToolArgs('memory_health', { autoRepair: true, confirmed: true });
    expect(parsed).toEqual({ autoRepair: true, confirmed: true });
  });
});

describe('checkpoint_delete schema', () => {
  it('public checkpoint_list schema rejects limit above 100', () => {
    expect(() => {
      validateToolInputSchema('checkpoint_list', { limit: 101 }, TOOL_DEFINITIONS);
    }).toThrow(/must be <= 100/);
  });

  it('requires confirmName at schema level', () => {
    expect(() => {
      validateToolInputSchema('checkpoint_delete', { name: 'danger-zone' }, TOOL_DEFINITIONS);
    }).toThrow(/Missing required arguments.*confirmName/);
  });

  it('accepts matching name + confirmName payload shape', () => {
    expect(() => {
      validateToolInputSchema('checkpoint_delete', { name: 'danger-zone', confirmName: 'danger-zone' }, TOOL_DEFINITIONS);
    }).not.toThrow();
  });
});

describe('code_graph schema coverage', () => {
  const acceptanceCases: ToolSchemaCase[] = [
    {
      name: 'code_graph_scan accepts optional scan controls',
      toolName: 'code_graph_scan',
      args: {
        rootDir: '.opencode/skill/system-spec-kit/mcp_server',
        includeGlobs: ['**/*.ts'],
        excludeGlobs: ['**/*.test.ts'],
        incremental: true,
      },
    },
    {
      name: 'code_graph_query accepts structural traversal options',
      toolName: 'code_graph_query',
      args: {
        operation: 'calls_from',
        subject: 'context-server.ts',
        subjects: ['tool-schemas.ts'],
        edgeType: 'CALLS',
        limit: 25,
        includeTransitive: true,
        maxDepth: 3,
      },
    },
    {
      name: 'code_graph_query accepts minConfidence within [0, 1] (R-007-6)',
      toolName: 'code_graph_query',
      args: {
        operation: 'blast_radius',
        subject: 'context-server.ts',
        minConfidence: 0.5,
      },
    },
    {
      name: 'code_graph_query accepts minConfidence boundary value 0',
      toolName: 'code_graph_query',
      args: {
        operation: 'blast_radius',
        subject: 'context-server.ts',
        minConfidence: 0,
      },
    },
    {
      name: 'code_graph_query accepts minConfidence boundary value 1',
      toolName: 'code_graph_query',
      args: {
        operation: 'blast_radius',
        subject: 'context-server.ts',
        minConfidence: 1,
      },
    },
    {
      name: 'code_graph_status accepts empty input',
      toolName: 'code_graph_status',
      args: {},
    },
    {
      name: 'code_graph_context accepts seed payloads',
      toolName: 'code_graph_context',
      args: {
        input: 'graph neighborhood',
        queryMode: 'outline',
        subject: 'context-server.ts',
        seeds: [
          {
            provider: 'manual',
            symbolName: 'handleToolCall',
            filePath: 'context-server.ts',
            startLine: 10,
            endLine: 40,
          },
        ],
        budgetTokens: 1200,
        profile: 'quick',
        includeTrace: true,
      },
    },
  ];

  const rejectionCases: ToolSchemaCase[] = [
    {
      name: 'code_graph_query rejects unknown operations',
      toolName: 'code_graph_query',
      args: {
        operation: 'walk_everything',
        subject: 'context-server.ts',
      },
    },
    {
      name: 'code_graph_query rejects minConfidence above 1 (R-007-6)',
      toolName: 'code_graph_query',
      args: {
        operation: 'blast_radius',
        subject: 'context-server.ts',
        minConfidence: 1.5,
      },
    },
    {
      name: 'code_graph_query rejects negative minConfidence (R-007-6)',
      toolName: 'code_graph_query',
      args: {
        operation: 'blast_radius',
        subject: 'context-server.ts',
        minConfidence: -0.1,
      },
    },
    {
      name: 'code_graph_query rejects non-numeric minConfidence (R-007-6)',
      toolName: 'code_graph_query',
      args: {
        operation: 'blast_radius',
        subject: 'context-server.ts',
        minConfidence: 'high',
      },
    },
    {
      name: 'code_graph_status rejects unexpected parameters',
      toolName: 'code_graph_status',
      args: {
        unexpected: true,
      },
    },
    {
      name: 'code_graph_context rejects unsupported profiles',
      toolName: 'code_graph_context',
      args: {
        profile: 'verbose',
      },
    },
  ];

  for (const testCase of acceptanceCases) {
    it(testCase.name, () => {
      expectPublicAndRuntimeAccept(testCase.toolName, testCase.args);
    });
  }

  for (const testCase of rejectionCases) {
    it(testCase.name, () => {
      expectPublicAndRuntimeReject(testCase.toolName, testCase.args);
    });
  }
});

describe('skill_graph schema coverage', () => {
  const acceptanceCases: ToolSchemaCase[] = [
    {
      name: 'skill_graph_scan accepts optional root override',
      toolName: 'skill_graph_scan',
      args: {
        skillsRoot: '.opencode/skill',
      },
    },
    {
      name: 'skill_graph_query accepts traversal filters',
      toolName: 'skill_graph_query',
      args: {
        queryType: 'subgraph',
        skillId: 'system-spec-kit',
        sourceSkillId: 'system-spec-kit',
        targetSkillId: 'sk-code-opencode',
        family: 'system',
        minInbound: 2,
        depth: 2,
        limit: 25,
      },
    },
    {
      name: 'skill_graph_status accepts empty input',
      toolName: 'skill_graph_status',
      args: {},
    },
    {
      name: 'skill_graph_validate accepts empty input',
      toolName: 'skill_graph_validate',
      args: {},
    },
  ];

  const rejectionCases: ToolSchemaCase[] = [
    {
      name: 'skill_graph_query rejects unsupported families',
      toolName: 'skill_graph_query',
      args: {
        queryType: 'family_members',
        family: 'runtime',
      },
    },
    {
      name: 'skill_graph_status rejects unexpected parameters',
      toolName: 'skill_graph_status',
      args: {
        unexpected: true,
      },
    },
    {
      name: 'skill_graph_validate rejects unexpected parameters',
      toolName: 'skill_graph_validate',
      args: {
        unexpected: true,
      },
    },
  ];

  for (const testCase of acceptanceCases) {
    it(testCase.name, () => {
      expectPublicAndRuntimeAccept(testCase.toolName, testCase.args);
    });
  }

  for (const testCase of rejectionCases) {
    it(testCase.name, () => {
      expectPublicAndRuntimeReject(testCase.toolName, testCase.args);
    });
  }
});

describe('ccc schema coverage', () => {
  const acceptanceCases: ToolSchemaCase[] = [
    {
      name: 'ccc_status accepts empty input',
      toolName: 'ccc_status',
      args: {},
    },
    {
      name: 'ccc_reindex accepts the full toggle',
      toolName: 'ccc_reindex',
      args: {
        full: true,
      },
    },
    {
      name: 'ccc_feedback accepts rating payloads',
      toolName: 'ccc_feedback',
      args: {
        query: 'code graph status',
        resultFile: '.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts',
        rating: 'helpful',
        comment: 'Matches the expected entrypoint.',
      },
    },
  ];

  const rejectionCases: ToolSchemaCase[] = [
    {
      name: 'ccc_status rejects unexpected parameters',
      toolName: 'ccc_status',
      args: {
        unexpected: true,
      },
    },
    {
      name: 'ccc_reindex rejects non-boolean full values',
      toolName: 'ccc_reindex',
      args: {
        full: 'yes',
      },
    },
    {
      name: 'ccc_feedback rejects unsupported ratings',
      toolName: 'ccc_feedback',
      args: {
        query: 'code graph status',
        rating: 'mixed',
      },
    },
  ];

  for (const testCase of acceptanceCases) {
    it(testCase.name, () => {
      expectPublicAndRuntimeAccept(testCase.toolName, testCase.args);
    });
  }

  for (const testCase of rejectionCases) {
    it(testCase.name, () => {
      expectPublicAndRuntimeReject(testCase.toolName, testCase.args);
    });
  }
});

// CHK-024: Schema validation overhead <5ms benchmark
describe('schema validation performance (CHK-024)', () => {
  it('validateToolInputSchema completes in <5ms per tool (steady-state)', () => {
    for (const tool of TOOL_DEFINITIONS) {
      const toolName = tool.name;
      // Build a minimal valid args payload
      const args: Record<string, unknown> = {};
      const schema = tool.inputSchema as { properties?: Record<string, unknown>; required?: string[] };
      for (const key of schema.required ?? []) {
        const prop = (schema.properties ?? {})[key] as { type?: string } | undefined;
        if (prop?.type === 'string') args[key] = 'test';
        else if (prop?.type === 'number' || prop?.type === 'integer') args[key] = 1;
        else if (prop?.type === 'boolean') args[key] = true;
        else args[key] = 'test';
      }

      // Warm-up pass to avoid first-call JIT/cold-cache timing noise.
      try {
        validateToolInputSchema(toolName, args, TOOL_DEFINITIONS);
      } catch {
        // Some tools may reject minimal args — that's fine, we're measuring time
      }

      const iterations = 3;
      const start = performance.now();
      for (let i = 0; i < iterations; i += 1) {
        try {
          validateToolInputSchema(toolName, args, TOOL_DEFINITIONS);
        } catch {
          // Some tools may reject minimal args — that's fine, we're measuring time
        }
      }
      const elapsed = (performance.now() - start) / iterations;

      expect(elapsed).toBeLessThan(5);
    }
  });
});
