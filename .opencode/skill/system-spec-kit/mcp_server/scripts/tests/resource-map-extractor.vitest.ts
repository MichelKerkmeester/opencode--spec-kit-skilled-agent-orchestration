import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

type Shape = 'review' | 'research';
type EmitArgs = {
  shape: Shape;
  deltas: unknown[];
  packet?: Record<string, unknown>;
  scope?: string;
  createdAt?: string;
};

const { emitResourceMap } = require('../../../scripts/resource-map/extract-from-evidence.cjs') as {
  emitResourceMap(args: EmitArgs): string;
};

function findLine(markdown: string, prefix: string): string {
  const line = markdown.split('\n').find((entry) => entry.startsWith(prefix));
  if (!line) {
    throw new Error(`Expected to find line starting with "${prefix}"`);
  }
  return line;
}

function headings(markdown: string): string[] {
  return markdown.split('\n').filter((line) => /^## \d+\./.test(line));
}

describe('resource-map extractor', () => {
  it('renders a review-shaped resource map with all ten categories and severity counts', () => {
    const markdown = emitResourceMap({
      shape: 'review',
      createdAt: '2026-04-24T12:00:00.000Z',
      scope: 'review convergence output for packet 003',
      packet: {
        title: 'Resource Map Deep Loop Integration',
        specFolder: '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration',
      },
      deltas: [
        [
          { iteration: 1, event: 'new_finding', finding_id: 'F-README', severity: 'P2', file: 'docs/resource-map/README.md' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-DOC', severity: 'P1', file: 'docs/resource-map-contract.unknownext' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-CMD', severity: 'P1', file: '.opencode/command/spec_kit/deep-review.md' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-AGENT', severity: 'P2', file: '.codex/agents/deep-review.toml' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-SKILL', severity: 'P0', file: '.opencode/skill/sk-deep-review/SKILL.md' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-SPEC', severity: 'P1', file: '.opencode/specs/system-spec-kit/demo/spec.md' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-SCRIPT', severity: 'P2', file: 'tools/resource-map-emit.cjs' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-TEST', severity: 'P2', file: 'tests/resource-map-extractor.vitest.ts' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-CONFIG', severity: 'P1', file: 'config/resource-map.yaml' },
          { iteration: 1, event: 'new_finding', finding_id: 'F-META', severity: 'P2', file: 'AGENTS.md' },
          { iteration: 2, event: 'adjudication', finding_id: 'F-SKILL', severity_after: 'P1', file: '.opencode/skill/sk-deep-review/SKILL.md' },
          { iteration: 2, event: 'adjudication', finding_id: 'F-CLEAN', severity_after: 'NEGATIVE', file: '.opencode/specs/system-spec-kit/demo/checklist.md' },
        ],
      ],
    });

    expect(findLine(markdown, '- **By category**:')).toBe(
      '- **By category**: READMEs=1, Documents=1, Commands=1, Agents=1, Skills=1, Specs=2, Scripts=1, Tests=1, Config=1, Meta=1',
    );
    expect(findLine(markdown, '- **Missing on disk**:')).toBe('- **Missing on disk**: 7');
    expect(headings(markdown)).toMatchInlineSnapshot(`
      [
        "## 1. READMEs",
        "## 2. Documents",
        "## 3. Commands",
        "## 4. Agents",
        "## 5. Skills",
        "## 6. Specs",
        "## 7. Scripts",
        "## 8. Tests",
        "## 9. Config",
        "## 10. Meta",
      ]
    `);
    expect(markdown).toContain(
      '| docs/resource-map/README.md | Analyzed | MISSING | Findings P0=0 P1=0 P2=1; Iterations=1 |',
    );
    expect(markdown).toContain(
      '| .opencode/skill/sk-deep-review/SKILL.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=2 |',
    );
    expect(markdown).toContain(
      '| .opencode/specs/system-spec-kit/demo/checklist.md | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |',
    );
  });

  it('renders a research-shaped resource map with per-iteration citation counts', () => {
    const markdown = emitResourceMap({
      shape: 'research',
      createdAt: '2026-04-24T12:30:00.000Z',
      scope: 'research convergence output for packet 003',
      packet: {
        title: 'Resource Map Deep Loop Integration',
      },
      deltas: [
        [
          {
            iteration: 1,
            type: 'finding',
            source_paths: [
              '.opencode/command/spec_kit/deep-research.md',
              '.opencode/skill/sk-deep-research/references/convergence.md',
            ],
            citations: [
              { path: '.opencode/skill/sk-deep-research/SKILL.md' },
              { path: '.opencode/specs/system-spec-kit/demo/research.md' },
            ],
          },
          {
            iteration: 2,
            type: 'finding',
            source_paths: ['.opencode/command/spec_kit/deep-research.md'],
            citations: [
              { path: '.opencode/skill/sk-deep-research/SKILL.md' },
              { path: '.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs' },
            ],
          },
          {
            iteration: 3,
            type: 'finding',
            source_paths: ['.opencode/command/spec_kit/deep-research.md'],
            citations: [
              { path: '.opencode/skill/sk-deep-research/SKILL.md' },
              { path: 'notes/research-support.txt' },
            ],
          },
        ],
      ],
    });

    expect(findLine(markdown, '- **By category**:')).toBe(
      '- **By category**: READMEs=0, Documents=1, Commands=1, Agents=0, Skills=3, Specs=1, Scripts=0, Tests=0, Config=0, Meta=0',
    );
    expect(findLine(markdown, '- **Missing on disk**:')).toBe('- **Missing on disk**: 2');
    expect(headings(markdown)).toMatchInlineSnapshot(`
      [
        "## 2. Documents",
        "## 3. Commands",
        "## 5. Skills",
        "## 6. Specs",
      ]
    `);
    expect(markdown).toContain(
      '| .opencode/command/spec_kit/deep-research.md | Cited | OK | Citations=3; Iterations=3 |',
    );
    expect(markdown).toContain(
      '| .opencode/skill/sk-deep-research/SKILL.md | Cited | OK | Citations=3; Iterations=3 |',
    );
    expect(markdown).toContain(
      '| .opencode/specs/system-spec-kit/demo/research.md | Cited | MISSING | Citations=1; Iterations=1 |',
    );
  });

  it('strips `:line` and `:line-range` suffixes from review evidence before classification and status checks', () => {
    const markdown = emitResourceMap({
      shape: 'review',
      createdAt: '2026-04-24T13:00:00.000Z',
      scope: 'F001 regression — canonical file:line shape per prompt-pack contract',
      packet: {
        title: 'Line-anchor normalization regression',
      },
      deltas: [
        [
          {
            iteration: 1,
            event: 'new_finding',
            finding_id: 'F-LINE',
            severity: 'P1',
            file: '.opencode/skill/sk-deep-review/SKILL.md:250',
          },
          {
            iteration: 1,
            event: 'new_finding',
            finding_id: 'F-RANGE',
            severity: 'P2',
            file: '.opencode/command/spec_kit/deep-review.md:10-20',
          },
        ],
      ],
    });

    // Paths with :line suffixes resolve to real files on disk → status OK, not MISSING.
    expect(markdown).toContain('| .opencode/skill/sk-deep-review/SKILL.md | Analyzed | OK |');
    expect(markdown).toContain('| .opencode/command/spec_kit/deep-review.md | Analyzed | OK |');
    // The suffix must be stripped — no leaked `:250` or `:10-20` anywhere.
    expect(markdown).not.toContain(':250');
    expect(markdown).not.toContain(':10-20');
    // Categorization still works (SKILL.md → Skills, deep-review.md → Commands).
    expect(findLine(markdown, '- **By category**:')).toContain('Commands=1');
    expect(findLine(markdown, '- **By category**:')).toContain('Skills=1');
    expect(findLine(markdown, '- **Missing on disk**:')).toBe('- **Missing on disk**: 0');
  });
});
