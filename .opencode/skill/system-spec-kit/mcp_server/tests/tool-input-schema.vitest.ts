// TEST: Tool Input Schema Validation
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { TOOL_DEFINITIONS, getSchema, validateToolArgs } from '../tool-schemas';
import { validateToolInputSchema } from '../utils/tool-input-schema';

const ORIGINAL_STRICT_SCHEMAS_ENV = process.env.SPECKIT_STRICT_SCHEMAS;

afterEach(() => {
  vi.restoreAllMocks();
  if (ORIGINAL_STRICT_SCHEMAS_ENV === undefined) {
    delete process.env.SPECKIT_STRICT_SCHEMAS;
  } else {
    process.env.SPECKIT_STRICT_SCHEMAS = ORIGINAL_STRICT_SCHEMAS_ENV;
  }
});

/* ───────────────────────────────────────────────────────────────
   1. SCHEMA STRUCTURAL INTEGRITY
──────────────────────────────────────────────────────────────── */

describe('Tool Schema Structural Integrity', () => {
  it('no tool schema uses top-level oneOf, allOf, or anyOf', () => {
    for (const tool of TOOL_DEFINITIONS) {
      const schema = tool.inputSchema as Record<string, unknown>;
      expect(schema).not.toHaveProperty('oneOf');
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
        sharedSpaceId: 'shared-1',
      });
    }).not.toThrow();
  });
});

describe('governed retrieval schema propagation', () => {
  it('public and runtime schemas accept governed scope fields for memory_context', () => {
    const args = {
      input: 'resume auth work',
      tenantId: 'tenant-a',
      userId: 'user-1',
      agentId: 'agent-1',
      sharedSpaceId: 'shared-1',
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
      sharedSpaceId: 'shared-1',
    };

    expect(() => {
      validateToolInputSchema('memory_quick_search', args, TOOL_DEFINITIONS);
    }).not.toThrow();
    expect(validateToolArgs('memory_quick_search', args)).toEqual(args);
  });
});

describe('shared-memory admin actor schema', () => {
  it('runtime accepts exactly one actor identity for shared_space_upsert', () => {
    expect(() => {
      validateToolArgs('shared_space_upsert', {
        spaceId: 'space-1',
        tenantId: 'tenant-a',
        name: 'Alpha',
        actorUserId: 'user-1',
      });
    }).not.toThrow();
  });

  it('runtime rejects shared_space_upsert when actor identity is missing', () => {
    expect(() => {
      validateToolArgs('shared_space_upsert', {
        spaceId: 'space-1',
        tenantId: 'tenant-a',
        name: 'Alpha',
      });
    }).toThrow(/Exactly one of "actorUserId" or "actorAgentId" is required/);
  });

  it('runtime rejects shared_space_membership_set when both actor identities are provided', () => {
    expect(() => {
      validateToolArgs('shared_space_membership_set', {
        spaceId: 'space-1',
        tenantId: 'tenant-a',
        actorUserId: 'user-1',
        actorAgentId: 'agent-1',
        subjectType: 'user',
        subjectId: 'user-2',
        role: 'viewer',
      });
    }).toThrow(/Provide only one actor identity/);
  });
});

describe('memory_health schema', () => {
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

// CHK-024: Schema validation overhead <5ms benchmark
describe('schema validation performance (CHK-024)', () => {
  it('validateToolInputSchema completes in <5ms per tool', () => {
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

      const start = performance.now();
      try {
        validateToolInputSchema(toolName, args, TOOL_DEFINITIONS);
      } catch {
        // Some tools may reject minimal args — that's fine, we're measuring time
      }
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(5);
    }
  });
});
