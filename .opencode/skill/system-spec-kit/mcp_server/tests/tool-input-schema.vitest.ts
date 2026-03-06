// ---------------------------------------------------------------
// TEST: Tool Input Schema Validation
// ---------------------------------------------------------------

import { describe, expect, it } from 'vitest';

import { TOOL_DEFINITIONS, validateToolArgs } from '../tool-schemas';
import { validateToolInputSchema } from '../utils/tool-input-schema';

/* ---------------------------------------------------------------
   1. SCHEMA STRUCTURAL INTEGRITY
--------------------------------------------------------------- */

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

/* ---------------------------------------------------------------
   2. SCHEMA VALIDATION LOGIC
--------------------------------------------------------------- */

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
});

/* ---------------------------------------------------------------
   3. memory_delete SCHEMA (oneOf REMOVED — HANDLER-VALIDATED)
--------------------------------------------------------------- */

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

/* ---------------------------------------------------------------
   4. memory_search LIMIT CONTRACT (schema + runtime alignment)
--------------------------------------------------------------- */

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
