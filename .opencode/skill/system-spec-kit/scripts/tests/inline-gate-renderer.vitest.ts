// -------------------------------------------------------------------
// TEST: Inline Gate Renderer
// -------------------------------------------------------------------

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { evaluateGateExpression, renderInlineGates } from '../templates/inline-gate-renderer';

describe('inline gate renderer', () => {
  it('renders matching single-level blocks and strips marker lines', () => {
    const rendered = renderInlineGates('A\n<!-- IF level:1 -->\nB\n<!-- /IF -->\nC\n', '1');
    expect(rendered).toBe('A\nB\nC\n');
  });

  it('omits non-matching blocks while preserving surrounding whitespace', () => {
    const rendered = renderInlineGates('A\n<!-- IF level:2 -->\nB\n<!-- /IF -->\nC\n', '1');
    expect(rendered).toBe('A\nC\n');
  });

  it('suppresses blank boundary lines from skipped top-level gates', () => {
    const template = [
      '<!-- IF level:1 -->',
      'inactive',
      '<!-- /IF -->',
      '',
      '<!-- IF level:2 -->',
      '---',
      '<!-- /IF -->',
      '',
    ].join('\n');

    expect(renderInlineGates(template, '2')).toBe('---\n');
  });

  it('supports multi-level lists', () => {
    expect(evaluateGateExpression('level:2,3,3+', '3+')).toBe(true);
    expect(evaluateGateExpression('level:2,3,3+', '1')).toBe(false);
  });

  it('supports comma-list whitespace and trailing commas', () => {
    expect(evaluateGateExpression('level:2, 3, 3+', '3')).toBe(true);
    expect(evaluateGateExpression('level:1, 2,', '2')).toBe(true);
  });

  it('rejects unknown expression levels instead of silently stripping blocks', () => {
    expect(() => evaluateGateExpression('level:bogus', '1')).toThrow(/Unsupported inline gate level/);
  });

  it('renders same-line empty gates as empty content', () => {
    expect(renderInlineGates('A\n<!-- IF level:1 --><!-- /IF -->\nB\n', '1')).toBe('A\nB\n');
  });

  it('supports nested gates', () => {
    const template = [
      '<!-- IF level:2,3 -->',
      'outer',
      '<!-- IF level:3 -->',
      'inner',
      '<!-- /IF -->',
      '<!-- /IF -->',
      '',
    ].join('\n');

    expect(renderInlineGates(template, '2')).toBe('outer\n');
    expect(renderInlineGates(template, '3')).toBe('outer\ninner\n');
  });

  it('supports boolean expressions', () => {
    expect(evaluateGateExpression('level:3 AND NOT level:1', '3')).toBe(true);
    expect(evaluateGateExpression('(level:1 OR level:2) AND NOT level:3+', '2')).toBe(true);
    expect(evaluateGateExpression('level:1 OR level:phase', 'phase')).toBe(true);
  });

  it('ignores gate-looking text inside fenced code blocks', () => {
    const rendered = renderInlineGates('```md\n<!-- IF level:1 -->\n```\n', '2');
    expect(rendered).toBe('```md\n<!-- IF level:1 -->\n```\n');
  });

  it('rejects unbalanced gates', () => {
    expect(() => renderInlineGates('<!-- IF level:1 -->\n', '1')).toThrow(/Unclosed/);
    expect(() => renderInlineGates('<!-- /IF -->\n', '1')).toThrow(/Unmatched/);
  });

  it('renders multiple files to an output directory in one CLI process', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'inline-gate-renderer-'));
    const first = path.join(tmp, 'first.md.tmpl');
    const second = path.join(tmp, 'second.md.tmpl');
    const outDir = path.join(tmp, 'out');
    fs.writeFileSync(first, 'A\n<!-- IF level:3 -->\nB\n<!-- /IF -->\n', 'utf8');
    fs.writeFileSync(second, '<!-- IF level:2 -->\nno\n<!-- /IF -->\nyes\n', 'utf8');

    execFileSync(
      process.execPath,
      [
        '--import',
        path.resolve(__dirname, '../node_modules/tsx/dist/loader.mjs'),
        path.resolve(__dirname, '../templates/inline-gate-renderer.ts'),
        '--level',
        '3',
        '--out-dir',
        outDir,
        first,
        second,
      ],
      { stdio: 'pipe' },
    );

    expect(fs.readFileSync(path.join(outDir, 'first.md'), 'utf8')).toBe('A\nB\n');
    expect(fs.readFileSync(path.join(outDir, 'second.md'), 'utf8')).toBe('yes\n');
  });
});
