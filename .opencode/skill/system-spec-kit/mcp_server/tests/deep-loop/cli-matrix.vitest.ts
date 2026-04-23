import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  parseExecutorConfig,
  resolveClaudePermissionMode,
  resolveCodexSandboxMode,
  resolveCopilotPromptArg,
  resolveGeminiSandboxMode,
  type ExecutorConfig,
} from '../../lib/deep-loop/executor-config';
import { runAuditedExecutorCommand } from '../../lib/deep-loop/executor-audit';

/**
 * Helper: Given a validated ExecutorConfig and a rendered-prompt path,
 * return the expected command string for that kind.
 * This mirrors the YAML dispatch logic for verification purposes.
 */
function buildDispatchCommand(
  config: ExecutorConfig,
  promptPath: string,
  promptSizeBytes = 0,
): string {
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
        `--sandbox ${resolveCodexSandboxMode(config.sandboxMode)}`,
        `- < "${promptPath}"`,
      ].join(' ');
    case 'cli-copilot':
      if (promptSizeBytes <= 16384) {
        return [
          'copilot',
          `-p "$(cat '${promptPath}')"`,
          `--model "${config.model}"`,
          '--allow-all-tools',
          '--no-ask-user',
        ].join(' ');
      }
      return [
        'copilot',
        `-p "${resolveCopilotPromptArg(promptPath, 'x'.repeat(promptSizeBytes))}"`,
        `--model "${config.model}"`,
        '--allow-all-tools',
        '--no-ask-user',
      ].join(' ');
    case 'cli-gemini':
      return [
        'gemini',
        `"$(cat '${promptPath}')"`,
        `-m "${config.model}"`,
        `-s ${resolveGeminiSandboxMode(config.sandboxMode)}`,
        '-y',
        '-o text',
      ].join(' ');
    case 'cli-claude-code': {
      const effortFlag = config.reasoningEffort ? ` --effort ${config.reasoningEffort}` : '';
      return [
        'claude',
        `-p "$(cat '${promptPath}')"`,
        `--model "${config.model}"`,
        `--permission-mode ${resolveClaudePermissionMode(config.sandboxMode)}`,
        `--output-format text${effortFlag}`,
      ].join(' ');
    }
  }
}

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    rmSync(tempDirs.pop() as string, { recursive: true, force: true });
  }
});

function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'cli-matrix-'));
  tempDirs.push(dir);
  return dir;
}

function readJsonlRecords(path: string): Array<Record<string, unknown>> {
  return readFileSync(path, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
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
      sandboxMode: 'read-only',
    });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('codex exec');
    expect(cmd).toContain('--model "gpt-5.4"');
    expect(cmd).toContain('model_reasoning_effort="high"');
    expect(cmd).toContain('service_tier="fast"');
    expect(cmd).toContain('--sandbox read-only');
    expect(cmd).toContain(`- < "${promptPath}"`);
  });

  it('cli-copilot small prompt stays on positional -p command substitution path', () => {
    const config = parseExecutorConfig({ kind: 'cli-copilot', model: 'gpt-5.4' });
    const cmd = buildDispatchCommand(config, promptPath, 4096);
    expect(cmd).toContain('copilot');
    expect(cmd).toContain(`-p "$(cat '${promptPath}')"`);
    expect(cmd).toContain('--model "gpt-5.4"');
    expect(cmd).toContain('--allow-all-tools');
    expect(cmd).toContain('--no-ask-user');
    expect(cmd).not.toContain('Read the instructions in @');
    expect(cmd).not.toContain('--sandbox');
    expect(cmd).not.toContain('reasoning_effort');
    expect(cmd).not.toContain('service_tier');
  });

  it('cli-copilot large prompt switches to @path wrapper language', () => {
    const config = parseExecutorConfig({ kind: 'cli-copilot', model: 'gpt-5.4' });
    const cmd = buildDispatchCommand(config, promptPath, 20000);
    expect(cmd).toContain('copilot');
    expect(cmd).toContain(`Read the instructions in @${promptPath}`);
    expect(cmd).toContain('--model "gpt-5.4"');
    expect(cmd).toContain('--allow-all-tools');
    expect(cmd).toContain('--no-ask-user');
    expect(cmd).not.toContain(`-p "$(cat '${promptPath}')"`);
  });

  it('cli-copilot threshold boundary keeps direct prompt mode at 16384 bytes', () => {
    const config = parseExecutorConfig({ kind: 'cli-copilot', model: 'gpt-5.4' });
    const cmd = buildDispatchCommand(config, promptPath, 16384);
    expect(cmd).toContain(`-p "$(cat '${promptPath}')"`);
    expect(cmd).not.toContain(`Read the instructions in @${promptPath}`);
  });

  it('cli-gemini produces positional prompt with whitelisted model', () => {
    const config = parseExecutorConfig({
      kind: 'cli-gemini',
      model: 'gemini-3.1-pro-preview',
      sandboxMode: 'workspace-write',
    });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('gemini');
    expect(cmd).toContain(`"$(cat '${promptPath}')"`);
    expect(cmd).toContain('-m "gemini-3.1-pro-preview"');
    expect(cmd).toContain('-s docker');
    expect(cmd).toContain('-y');
    expect(cmd).toContain('-o text');
    expect(cmd).not.toContain('reasoning_effort');
  });

  it('cli-claude-code with reasoningEffort includes --effort flag', () => {
    const config = parseExecutorConfig({
      kind: 'cli-claude-code',
      model: 'claude-opus-4-6',
      reasoningEffort: 'high',
      sandboxMode: 'read-only',
    });
    const cmd = buildDispatchCommand(config, promptPath);
    expect(cmd).toContain('claude');
    expect(cmd).toContain('--model "claude-opus-4-6"');
    expect(cmd).toContain('--permission-mode plan');
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

describe('cli-matrix smoke coverage', () => {
  it('exercises the large-prompt wrapper with a real subprocess and artifact writes', () => {
    const dir = makeTempDir();
    const promptPath = join(dir, 'iteration-001.md');
    const iterationPath = join(dir, 'iteration-001-output.md');
    const deltaPath = join(dir, 'delta-001.md');
    const stateLogPath = join(dir, 'state.jsonl');
    const prompt = `# Prompt\n${'A'.repeat(20000)}\nLarge prompt smoke marker.\n`;
    const promptArg = resolveCopilotPromptArg(promptPath, prompt);

    writeFileSync(promptPath, prompt, 'utf8');
    writeFileSync(stateLogPath, `${JSON.stringify({ type: 'iteration_start', iteration: 1 })}\n`, 'utf8');

    const exitCode = runAuditedExecutorCommand({
      command: 'node',
      args: [
        '-e',
        `
          const fs = require('node:fs');
          const promptArg = process.argv[1];
          const iterationPath = process.argv[2];
          const deltaPath = process.argv[3];
          const match = promptArg.match(/@(.+) and follow them exactly/);
          const promptPath = match ? match[1] : null;
          if (!promptPath) process.exit(2);
          const prompt = fs.readFileSync(promptPath, 'utf8');
          fs.writeFileSync(iterationPath, prompt);
          fs.writeFileSync(deltaPath, 'wrapper ok');
          console.log(prompt.includes('Large prompt smoke marker.') ? 'wrapper-ok' : 'wrapper-missing');
        `,
        promptArg,
        iterationPath,
        deltaPath,
      ],
      cwd: dir,
      timeoutSeconds: 5,
      stateLogPath,
      executor: parseExecutorConfig({ kind: 'cli-copilot', model: 'gpt-5.4' }),
      iteration: 1,
    });

    expect(exitCode).toBe(0);
    expect(promptArg).toContain(`@${promptPath}`);
    expect(readFileSync(iterationPath, 'utf8')).toContain('Large prompt smoke marker.');
    expect(readFileSync(deltaPath, 'utf8')).toBe('wrapper ok');
    expect(readJsonlRecords(stateLogPath)).toEqual([{ type: 'iteration_start', iteration: 1 }]);
  });

  it('records a crash failure event from a real subprocess exit', () => {
    const dir = makeTempDir();
    const stateLogPath = join(dir, 'state.jsonl');

    writeFileSync(stateLogPath, `${JSON.stringify({ type: 'iteration_start', iteration: 2 })}\n`, 'utf8');

    const exitCode = runAuditedExecutorCommand({
      command: 'node',
      args: ['-e', 'process.exit(7)'],
      cwd: dir,
      timeoutSeconds: 5,
      stateLogPath,
      executor: parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4' }),
      iteration: 2,
    });

    const records = readJsonlRecords(stateLogPath);
    const failure = records.at(-1);

    expect(exitCode).toBe(0);
    expect(failure).toMatchObject({
      type: 'event',
      event: 'dispatch_failure',
      reason: 'crash',
      iteration: 2,
      executor: { kind: 'cli-codex', model: 'gpt-5.4' },
    });
    expect(failure?.detail).toBe('executor exited with status 7');
  });

  it('records a timeout failure event from a real subprocess timeout', () => {
    const dir = makeTempDir();
    const stateLogPath = join(dir, 'state.jsonl');

    writeFileSync(stateLogPath, `${JSON.stringify({ type: 'iteration_start', iteration: 3 })}\n`, 'utf8');

    const exitCode = runAuditedExecutorCommand({
      command: 'node',
      args: ['-e', 'setTimeout(() => process.exit(0), 5000)'],
      cwd: dir,
      timeoutSeconds: 1,
      stateLogPath,
      executor: parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4' }),
      iteration: 3,
    });

    const records = readJsonlRecords(stateLogPath);
    const failure = records.at(-1);

    expect(exitCode).toBe(0);
    expect(failure).toMatchObject({
      type: 'event',
      event: 'dispatch_failure',
      reason: 'timeout',
      iteration: 3,
      executor: { kind: 'cli-codex', model: 'gpt-5.4' },
    });
  });
});
