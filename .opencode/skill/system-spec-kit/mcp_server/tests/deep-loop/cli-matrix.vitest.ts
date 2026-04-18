import { describe, it, expect } from 'vitest';

import {
  parseExecutorConfig,
  type ExecutorConfig,
} from '../../lib/deep-loop/executor-config';

/**
 * Helper: Given a validated ExecutorConfig and a rendered-prompt path,
 * return the expected command string for that kind.
 * This mirrors the YAML dispatch logic for verification purposes.
 */
function buildDispatchCommand(config: ExecutorConfig, promptPath: string): string {
  switch (config.kind) {
    case 'native':
      return `TASK(agent=deep-research, model=opus, context=@${promptPath})`;
    case 'cli-codex':
      return [
        'codex exec',
        `--model "${config.model}"`,
        `-c model_reasoning_effort="${config.reasoningEffort}"`,
        `-c service_tier="${config.serviceTier}"`,
        '-c approval_policy=never',
        '--sandbox workspace-write',
        `- < "${promptPath}"`,
      ].join(' ');
    case 'cli-copilot':
      return [
        'copilot',
        `-p "$(cat '${promptPath}')"`,
        `--model "${config.model}"`,
        '--allow-all-tools',
        '--no-ask-user',
      ].join(' ');
    case 'cli-gemini':
      return [
        'gemini',
        `"$(cat '${promptPath}')"`,
        `-m "${config.model}"`,
        '-s none',
        '-y',
        '-o text',
      ].join(' ');
    case 'cli-claude-code': {
      const effortFlag = config.reasoningEffort ? ` --effort ${config.reasoningEffort}` : '';
      return [
        'claude',
        `-p "$(cat '${promptPath}')"`,
        `--model "${config.model}"`,
        '--permission-mode acceptEdits',
        `--output-format text${effortFlag}`,
      ].join(' ');
    }
  }
}

describe('cli-matrix dispatch command shape', () => {
  const promptPath = 'spec-folder/research/prompts/iteration-001.md';

  it('native kind produces agent task shape', () => {
    const config = parseExecutorConfig({ kind: 'native' });
    expect(buildDispatchCommand(config, promptPath)).toContain('TASK(agent=deep-research');
  });

  it('cli-codex produces codex exec with stdin piping', () => {
    const config = parseExecutorConfig({
      kind: 'cli-codex',
      model: 'gpt-5.4',
      reasoningEffort: 'high',
      serviceTier: 'fast',
    });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('codex exec');
    expect(cmd).toContain('--model "gpt-5.4"');
    expect(cmd).toContain('model_reasoning_effort="high"');
    expect(cmd).toContain('service_tier="fast"');
    expect(cmd).toContain(`- < "${promptPath}"`);
  });

  it('cli-copilot produces positional prompt via -p with command substitution', () => {
    const config = parseExecutorConfig({ kind: 'cli-copilot', model: 'gpt-5.4' });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('copilot');
    expect(cmd).toContain(`-p "$(cat '${promptPath}')"`);
    expect(cmd).toContain('--model "gpt-5.4"');
    expect(cmd).toContain('--allow-all-tools');
    expect(cmd).toContain('--no-ask-user');
    expect(cmd).not.toContain('--sandbox');
    expect(cmd).not.toContain('reasoning_effort');
    expect(cmd).not.toContain('service_tier');
  });

  it('cli-gemini produces positional prompt with whitelisted model', () => {
    const config = parseExecutorConfig({ kind: 'cli-gemini', model: 'gemini-3.1-pro-preview' });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('gemini');
    expect(cmd).toContain(`"$(cat '${promptPath}')"`);
    expect(cmd).toContain('-m "gemini-3.1-pro-preview"');
    expect(cmd).toContain('-s none');
    expect(cmd).toContain('-y');
    expect(cmd).toContain('-o text');
    expect(cmd).not.toContain('reasoning_effort');
  });

  it('cli-claude-code with reasoningEffort includes --effort flag', () => {
    const config = parseExecutorConfig({
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      reasoningEffort: 'high',
    });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('claude');
    expect(cmd).toContain('--model "claude-opus-4-6"');
    expect(cmd).toContain('--permission-mode acceptEdits');
    expect(cmd).toContain('--effort high');
    expect(cmd).not.toContain('service_tier');
  });

  it('cli-claude-code without reasoningEffort omits --effort flag', () => {
    const config = parseExecutorConfig({
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
    });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('--permission-mode acceptEdits');
    expect(cmd).not.toContain('--effort');
  });
});
