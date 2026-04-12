// ───────────────────────────────────────────────────────────────
// 1. REVIEW FIXES VITEST
// ───────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest';

// TEST: Review Fixes Verification (Vitest)
// Validates critical fixes from the 8-agent cross-AI review:
// H1 — fail-closed on unknown tool
// C1 — path traversal rejection on ingest paths
// H2 — bounded paths array (max 50)
// H5 — additionalProperties: false on all schemas
// M5 — ingest schema minItems/minLength constraints
import {
  validateToolArgs,
  ToolSchemaValidationError,
  MAX_INGEST_PATHS,
} from '../schemas/tool-input-schemas';

import { TOOL_DEFINITIONS } from '../tool-schemas';

describe('H1: validateToolArgs rejects unknown tools (fail-closed)', () => {
  it('throws ToolSchemaValidationError for an unregistered tool name', () => {
    expect(() => validateToolArgs('nonexistent_tool', {})).toThrow(
      ToolSchemaValidationError,
    );
  });

  it('error message includes the unknown tool name', () => {
    try {
      validateToolArgs('fake_tool_xyz', {});
      expect.unreachable('Should have thrown');
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(ToolSchemaValidationError);
      const tsErr = err as ToolSchemaValidationError;
      expect(tsErr.message).toContain('fake_tool_xyz');
      expect(tsErr.details.issues).toContain('unknown_tool');
    }
  });

  it('still validates known tools normally', () => {
    const result = validateToolArgs('memory_search', {
      query: 'test query',
    });
    expect(result).toHaveProperty('query', 'test query');
  });
});

describe('C1: ingest paths reject traversal sequences', () => {
  it('rejects paths containing ".."', () => {
    expect(() =>
      validateToolArgs('memory_ingest_start', {
        paths: ['/valid/path.md', '/tmp/../etc/passwd'],
      }),
    ).toThrow();
  });

  it('rejects paths containing null bytes', () => {
    expect(() =>
      validateToolArgs('memory_ingest_start', {
        paths: ['/valid/path.md\0'],
      }),
    ).toThrow();
  });

  it('accepts valid absolute paths', () => {
    const result = validateToolArgs('memory_ingest_start', {
      paths: ['/valid/specs/memory/file.md'],
    });
    expect(result).toHaveProperty('paths');
    expect((result as { paths: string[] }).paths).toHaveLength(1);
  });
});

describe('H2: ingest paths array bounded at 50', () => {
  it('rejects more than 50 paths', () => {
    const paths = Array.from(
      { length: MAX_INGEST_PATHS + 1 },
      (_, i) => `/path/file${i}.md`,
    );
    expect(() =>
      validateToolArgs('memory_ingest_start', { paths }),
    ).toThrow();
  });

  it('accepts exactly 50 paths', () => {
    const paths = Array.from(
      { length: MAX_INGEST_PATHS },
      (_, i) => `/path/file${i}.md`,
    );
    const result = validateToolArgs('memory_ingest_start', { paths });
    expect((result as { paths: string[] }).paths).toHaveLength(MAX_INGEST_PATHS);
  });

  it('rejects empty paths array', () => {
    expect(() =>
      validateToolArgs('memory_ingest_start', { paths: [] }),
    ).toThrow();
  });
});

describe('H5: all tool schemas have additionalProperties: false', () => {
  it('every tool definition includes additionalProperties: false', () => {
    const missing: string[] = [];
    for (const tool of TOOL_DEFINITIONS) {
      const schema = tool.inputSchema as Record<string, unknown>;
      if (schema.additionalProperties !== false) {
        missing.push(tool.name);
      }
    }
    expect(missing).toEqual([]);
  });

  it('total tool count matches expected', () => {
    // Ensures no schema was accidentally dropped during bulk edit
    expect(TOOL_DEFINITIONS.length).toBe(43);
  });
});

describe('M5: ingest schema has minItems and minLength constraints', () => {
  it('memory_ingest_start schema has path constraints', () => {
    const ingestTool = TOOL_DEFINITIONS.find(
      (t) => t.name === 'memory_ingest_start',
    );
    expect(ingestTool).toBeDefined();

    const schema = ingestTool!.inputSchema as Record<string, unknown>;
    const properties = schema.properties as Record<string, Record<string, unknown>>;
    const pathsProp = properties.paths;

    expect(pathsProp.minItems).toBe(1);
    expect(pathsProp.maxItems).toBe(MAX_INGEST_PATHS);

    const items = pathsProp.items as Record<string, unknown>;
    expect(items.minLength).toBe(1);
  });
});
