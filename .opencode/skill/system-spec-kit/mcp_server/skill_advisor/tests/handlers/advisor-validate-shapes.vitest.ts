// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Validate Shape Schema Tests
// ───────────────────────────────────────────────────────────────
// F-005-A5-02 / F-005-A5-03: assert the runtime shapes for corpus rows,
// regression rows, and Python parity stdout reject malformed inputs.

import { describe, expect, it } from 'vitest';

import {
  CorpusRowSchema,
  RegressionCaseSchema,
  PythonTopSkillsSchema,
} from '../../handlers/advisor-validate.js';

describe('CorpusRowSchema (F-005-A5-02)', () => {
  it('accepts a valid corpus row', () => {
    expect(() => CorpusRowSchema.parse({
      id: 'row-1',
      prompt: 'sample prompt',
      skill_top_1: 'system-spec-kit',
    })).not.toThrow();
  });

  it('rejects rows missing required fields', () => {
    expect(() => CorpusRowSchema.parse({ id: 'row-1' })).toThrow();
    expect(() => CorpusRowSchema.parse({ prompt: 'x' })).toThrow();
    expect(() => CorpusRowSchema.parse({ skill_top_1: 'y' })).toThrow();
  });

  it('rejects rows with empty strings on required fields', () => {
    expect(() => CorpusRowSchema.parse({
      id: '', prompt: 'x', skill_top_1: 'y',
    })).toThrow();
    expect(() => CorpusRowSchema.parse({
      id: 'a', prompt: '', skill_top_1: 'y',
    })).toThrow();
  });

  it('preserves additional fields via passthrough', () => {
    const parsed = CorpusRowSchema.parse({
      id: 'row-1',
      prompt: 'sample',
      skill_top_1: 'system-spec-kit',
      tags: ['extra', 'metadata'],
    });
    // The runtime accepts the extra `tags` field without rejecting.
    expect((parsed as { tags?: string[] }).tags).toEqual(['extra', 'metadata']);
  });
});

describe('RegressionCaseSchema (F-005-A5-02)', () => {
  it('accepts a valid expect_result=true row with expected_top_any', () => {
    expect(() => RegressionCaseSchema.parse({
      id: 'reg-1',
      priority: 'P0',
      prompt: 'route this',
      expect_result: true,
      expected_top_any: ['system-spec-kit'],
    })).not.toThrow();
  });

  it('accepts a valid expect_result=false row', () => {
    expect(() => RegressionCaseSchema.parse({
      id: 'reg-2',
      prompt: 'no-skill prompt',
      expect_result: false,
    })).not.toThrow();
  });

  it('rejects when expect_result is not boolean', () => {
    expect(() => RegressionCaseSchema.parse({
      id: 'reg-3',
      prompt: 'x',
      expect_result: 'true',
    })).toThrow();
  });

  it('rejects rows without id', () => {
    expect(() => RegressionCaseSchema.parse({
      prompt: 'x',
      expect_result: false,
    })).toThrow();
  });
});

describe('PythonTopSkillsSchema (F-005-A5-03)', () => {
  it('accepts a list of strings and nulls', () => {
    expect(() => PythonTopSkillsSchema.parse([
      'system-spec-kit', null, 'sk-code', null,
    ])).not.toThrow();
  });

  it('accepts an empty list', () => {
    expect(() => PythonTopSkillsSchema.parse([])).not.toThrow();
  });

  it('rejects non-array input', () => {
    expect(() => PythonTopSkillsSchema.parse('not an array')).toThrow();
    expect(() => PythonTopSkillsSchema.parse({ '0': 'foo' })).toThrow();
  });

  it('rejects elements that are neither string nor null', () => {
    expect(() => PythonTopSkillsSchema.parse(['ok', 42, null])).toThrow();
    expect(() => PythonTopSkillsSchema.parse(['ok', { skill: 'x' }])).toThrow();
  });
});
