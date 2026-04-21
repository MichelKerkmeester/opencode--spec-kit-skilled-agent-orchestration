import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { PromptPackError, renderPromptPack, validatePromptPackTemplate } from '../../lib/deep-loop/prompt-pack';

function withTempTemplate(content: string, run: (templatePath: string) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'prompt-pack-'));
  const templatePath = join(tempDir, 'template.md.tmpl');

  try {
    writeFileSync(templatePath, content, 'utf8');
    run(templatePath);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

describe('prompt-pack', () => {
  it('renderPromptPack substitutes a single {topic} token with the variable value', () => {
    withTempTemplate('Topic: {topic}', (templatePath) => {
      expect(renderPromptPack(templatePath, { topic: 'Graph Coverage' })).toBe('Topic: Graph Coverage');
    });
  });

  it('substitutes multiple different tokens in one render', () => {
    withTempTemplate('Topic: {topic} | Iteration: {iteration}', (templatePath) => {
      expect(renderPromptPack(templatePath, { topic: 'Review', iteration: 2 })).toBe('Topic: Review | Iteration: 2');
    });
  });

  it('substitutes the same token appearing multiple times', () => {
    withTempTemplate('{topic} -> {topic}', (templatePath) => {
      expect(renderPromptPack(templatePath, { topic: 'Repeat' })).toBe('Repeat -> Repeat');
    });
  });

  it('throws PromptPackError with the missing variable listed when a token lacks a binding', () => {
    withTempTemplate('Topic: {topic} | Focus: {focus}', (templatePath) => {
      try {
        renderPromptPack(templatePath, { topic: 'Bound' });
        throw new Error('Expected renderPromptPack to throw');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(PromptPackError);
        if (error instanceof PromptPackError) {
          expect(error.missingVariables).toEqual(['focus']);
        }
      }
    });
  });

  it('renderPromptPack returns identical output for identical inputs', () => {
    withTempTemplate('State: {state}', (templatePath) => {
      const first = renderPromptPack(templatePath, { state: 'stable' });
      const second = renderPromptPack(templatePath, { state: 'stable' });

      expect(first).toBe(second);
    });
  });

  it('numbers are coerced to strings', () => {
    withTempTemplate('Iteration {iteration}', (templatePath) => {
      expect(renderPromptPack(templatePath, { iteration: 5 })).toBe('Iteration 5');
    });
  });

  it('validatePromptPackTemplate returns all three arrays for a mixed case', () => {
    withTempTemplate('{topic} {iteration} {focus}', (templatePath) => {
      expect(validatePromptPackTemplate(templatePath, ['topic', 'status', 'iteration', 'mode'])).toEqual({
        present: ['topic', 'iteration'],
        missing: ['status', 'mode'],
        extra: ['focus'],
      });
    });
  });

  it('tokens with invalid variable-name syntax are not matched and are treated as literal text', () => {
    withTempTemplate('Literal {foo.bar} token and valid {topic}', (templatePath) => {
      expect(renderPromptPack(templatePath, { topic: 'bound' })).toBe('Literal {foo.bar} token and valid bound');
    });
  });

  it('empty template renders as empty string', () => {
    withTempTemplate('', (templatePath) => {
      expect(renderPromptPack(templatePath, {})).toBe('');
    });
  });

  it('template with no tokens renders unchanged', () => {
    withTempTemplate('No substitutions required.', (templatePath) => {
      expect(renderPromptPack(templatePath, {})).toBe('No substitutions required.');
    });
  });

  it('both production templates load and render successfully with the expected bound variables', () => {
    const researchTemplatePath =
      '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl';
    const reviewTemplatePath =
      '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl';

    const researchRendered = renderPromptPack(researchTemplatePath, {
      state_summary: 'Summary block',
      research_topic: 'Deep loop coverage',
      current_iteration: 2,
      max_iterations: 5,
      next_focus: 'Graph event capture',
      remaining_questions_list: '- Q1\n- Q2',
      last_3_summaries: 'Iter 1: baseline',
      state_paths_config: '.opencode/skill/sk-deep-research/assets/deep_research_config.json',
      state_paths_state_log: '.opencode/skill/sk-deep-research/runtime/state.jsonl',
      state_paths_strategy: '.opencode/skill/sk-deep-research/assets/deep_research_strategy.md',
      state_paths_registry: '.opencode/skill/sk-deep-research/runtime/registry.json',
      state_paths_iteration_pattern: '.opencode/skill/sk-deep-research/runtime/iteration-002.md',
      state_paths_delta_pattern: '.opencode/skill/sk-deep-research/runtime/deltas/iter-002.jsonl',
    });

    const reviewRendered = renderPromptPack(reviewTemplatePath, {
      state_summary: 'Review summary block',
      current_iteration: 3,
      max_iterations: 6,
      next_dimension: 'traceability',
      review_target: 'lib/deep-loop',
      review_scope_files: 'file-a.ts, file-b.ts',
      p0_count: 0,
      p1_count: 1,
      p2_count: 2,
      state_paths_config: '.opencode/skill/sk-deep-review/assets/deep_review_config.json',
      state_paths_state_log: '.opencode/skill/sk-deep-review/runtime/state.jsonl',
      state_paths_findings_registry: '.opencode/skill/sk-deep-review/runtime/findings.json',
      state_paths_strategy: '.opencode/skill/sk-deep-review/assets/deep_review_strategy.md',
      state_paths_iteration_pattern: '.opencode/skill/sk-deep-review/runtime/iteration-003.md',
      state_paths_delta_pattern: '.opencode/skill/sk-deep-review/runtime/deltas/iter-003.jsonl',
    });

    expect(researchRendered).toContain('Research Topic: Deep loop coverage');
    expect(researchRendered).toContain('State Log: .opencode/skill/sk-deep-research/runtime/state.jsonl');
    expect(reviewRendered).toContain('Dimension: traceability');
    expect(reviewRendered).toContain('Findings Registry: .opencode/skill/sk-deep-review/runtime/findings.json');
  });
});
