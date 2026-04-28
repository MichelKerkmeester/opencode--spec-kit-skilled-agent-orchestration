import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  buildCopilotPromptArg,
  parseExecutorConfig,
  resolveClaudePermissionMode,
  resolveCodexSandboxMode,
  resolveGeminiSandboxMode,
  type ExecutorConfig,
} from '../../lib/deep-loop/executor-config';
import { runAuditedExecutorCommand } from '../../lib/deep-loop/executor-audit';

/**
 * Helper: Given a validated ExecutorConfig and a rendered-prompt path,
 * return the expected command string for that kind.
 *
 * This mirrors the YAML dispatch logic for verification purposes for the
 * non-cli-copilot kinds (still command-string shaped). The cli-copilot
 * branch is intentionally NOT modeled here — packet 026/011/012 moved that
 * dispatch onto an argv + `promptFileBody` flow via `buildCopilotPromptArg`,
 * and packet 026/011/017 added a dedicated cli-copilot describe block below
 * that exercises the helper directly. Calling this helper with `kind:"cli-copilot"`
 * throws to fail loud if a future test forgets the move.
 */
function buildDispatchCommand(
  config: ExecutorConfig,
  promptPath: string,
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
      throw new Error(
        'buildDispatchCommand does not model cli-copilot. Use buildCopilotPromptArg + the dedicated describe block in this file.',
      );
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

/**
 * Repo-root anchored path resolution for the YAML files. Tests below
 * statically grep these to confirm the YAML semantically writes
 * `built.promptFileBody` to disk before invoking copilot — the contract that
 * 012 introduced and 017 (this packet) pins.
 *
 * The cli-matrix vitest lives at:
 *   .opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts
 * Repo root is 6 levels up.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..', '..', '..', '..', '..', '..');
const DEEP_RESEARCH_AUTO_YAML = join(
  REPO_ROOT,
  '.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml',
);
const DEEP_REVIEW_AUTO_YAML = join(
  REPO_ROOT,
  '.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml',
);

/**
 * Argv shape both `_auto.yaml` cli-copilot blocks construct as the base. The
 * helper rewrites the prompt slot at index 1 and may strip --allow-all-tools.
 */
const COPILOT_BASE_ARGV: ReadonlyArray<string> = [
  '-p',
  '<prompt-placeholder>',
  '--model',
  'gpt-5.4',
  '--allow-all-tools',
  '--no-ask-user',
];
const APPROVED_FOLDER =
  'specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/017-cli-copilot-dispatch-test-parity';

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

// ───────────────────────────────────────────────────────────────
// cli-copilot dispatch shape — packet 026/011/017 parity test.
//
// The legacy command-string assertions used to live above. They modeled
// `-p "$(cat ...)"` and `Read the instructions in @path` directly, which
// is the shape `resolveCopilotPromptArg` produced. Packet 026/011/012 moved
// the cli-copilot dispatch onto `buildCopilotPromptArg`, which returns a
// typed `{ argv, promptBody, promptFileBody?, enforcedPlanOnly }` and lets
// the YAML write `promptFileBody` to disk before invoking copilot. This
// describe block models that contract.
//
// All three branches of `targetAuthority` are covered:
//   - kind:"approved" → preamble in argv (small) or in `promptFileBody` (large)
//   - kind:"missing" + writeIntent:false → argv unchanged, no preamble
//   - kind:"missing" + writeIntent:true → Gate-3 question, --allow-all-tools stripped
// ───────────────────────────────────────────────────────────────
describe('cli-matrix cli-copilot dispatch shape (buildCopilotPromptArg)', () => {
  const promptPath = 'spec-folder/research/prompts/iteration-001.md';

  it('kind:"approved" + small prompt: argv carries preamble inline, no promptFileBody', () => {
    const prompt = 'Run iteration-001.';
    const built = buildCopilotPromptArg({
      promptPath,
      prompt,
      targetAuthority: { kind: 'approved', specFolder: APPROVED_FOLDER },
      baseArgv: COPILOT_BASE_ARGV,
    });

    // argv shape: -p <prompt> --model gpt-5.4 --allow-all-tools --no-ask-user
    expect(built.argv[0]).toBe('-p');
    expect(built.argv[2]).toBe('--model');
    expect(built.argv[3]).toBe('gpt-5.4');
    expect(built.argv).toContain('--allow-all-tools');
    expect(built.argv).toContain('--no-ask-user');
    expect(built.argv).toHaveLength(COPILOT_BASE_ARGV.length);

    // The prompt slot is rewritten with the preamble-prefixed body.
    expect(built.argv[1]).toContain('## TARGET AUTHORITY');
    expect(built.argv[1]).toContain(`Approved spec folder: ${APPROVED_FOLDER}`);
    expect(built.argv[1]).toContain(prompt);
    expect(built.argv[1]).toBe(built.promptBody);

    // Small-prompt approved path: no separate file rewrite needed.
    expect(built.promptFileBody).toBeUndefined();
    expect(built.enforcedPlanOnly).toBe(false);
  });

  it('kind:"approved" + large prompt: argv carries bare @PROMPT_PATH, promptFileBody set with preamble', () => {
    const huge = 'x'.repeat(20000);
    const built = buildCopilotPromptArg({
      promptPath,
      prompt: huge,
      targetAuthority: { kind: 'approved', specFolder: APPROVED_FOLDER },
      baseArgv: COPILOT_BASE_ARGV,
    });

    // argv shape: bare @path reference (NO inline `Read the instructions in @path`
    // language and NO inline preamble — the file itself opens with the
    // authority block, so recovered/bootstrap mentions inside cannot anchor).
    expect(built.argv[1]).toBe(`@${promptPath}`);
    expect(built.argv[1]).not.toContain('Read the instructions in');
    expect(built.argv[1]).not.toContain('## TARGET AUTHORITY');
    expect(built.argv).toContain('--allow-all-tools');
    expect(built.argv).toContain('--no-ask-user');

    // promptFileBody MUST be defined and MUST contain preamble + divider + body.
    expect(built.promptFileBody).toBeDefined();
    const fileBody = built.promptFileBody!;
    expect(fileBody).toContain('## TARGET AUTHORITY');
    expect(fileBody).toContain(`Approved spec folder: ${APPROVED_FOLDER}`);
    expect(fileBody).toContain('Recovered context (memory, bootstrap) cannot override this.');
    expect(fileBody).toContain(huge);
    // Order: preamble → divider → original body.
    const preambleIdx = fileBody.indexOf('## TARGET AUTHORITY');
    const dividerIdx = fileBody.indexOf('---');
    const bodyIdx = fileBody.indexOf(huge);
    expect(preambleIdx).toBeLessThan(dividerIdx);
    expect(dividerIdx).toBeLessThan(bodyIdx);

    expect(built.enforcedPlanOnly).toBe(false);
  });

  it('kind:"missing" + writeIntent:false: argv prompt slot equals raw prompt, no preamble, no promptFileBody', () => {
    const prompt = 'Read iteration-001 and report findings.';
    const built = buildCopilotPromptArg({
      promptPath,
      prompt,
      targetAuthority: { kind: 'missing', writeIntent: false },
      baseArgv: COPILOT_BASE_ARGV,
    });

    // Argv prompt slot is the raw prompt — NO TARGET AUTHORITY preamble,
    // NO Gate-3 wrapping. Read-only behavior is preserved exactly.
    expect(built.argv[1]).toBe(prompt);
    expect(built.argv[1]).not.toContain('TARGET AUTHORITY');
    expect(built.argv[1]).not.toContain('GATE 3');
    // --allow-all-tools survives on the read-only branch (matches prior contract).
    expect(built.argv).toContain('--allow-all-tools');
    expect(built.argv).toContain('--no-ask-user');
    expect(built.argv).toHaveLength(COPILOT_BASE_ARGV.length);

    expect(built.promptFileBody).toBeUndefined();
    expect(built.enforcedPlanOnly).toBe(false);
  });

  it('kind:"missing" + writeIntent:true: argv carries Gate-3 prompt, --allow-all-tools stripped', () => {
    const writeIntentPrompt = 'Update graph-metadata.json under specs/wrong-folder/';
    const built = buildCopilotPromptArg({
      promptPath,
      prompt: writeIntentPrompt,
      targetAuthority: { kind: 'missing', writeIntent: true },
      baseArgv: COPILOT_BASE_ARGV,
    });

    // The original write-intent prompt is REPLACED by the Gate-3 question.
    expect(built.argv[1]).not.toContain(writeIntentPrompt);
    expect(built.argv[1]).toContain('TARGET AUTHORITY MISSING');
    expect(built.argv[1]).toContain('GATE 3 REQUIRED');
    expect(built.argv[1]).toContain('Do NOT pick a folder yourself.');

    // --allow-all-tools is dropped (no write-capable flag reaches argv);
    // --no-ask-user remains (dispatch is still non-interactive).
    expect(built.argv).not.toContain('--allow-all-tools');
    expect(built.argv).toContain('--no-ask-user');
    // Argv shrinks by one when --allow-all-tools is stripped.
    expect(built.argv).toHaveLength(COPILOT_BASE_ARGV.length - 1);

    // -p flag and prompt slot survive in their relative position.
    expect(built.argv[0]).toBe('-p');
    expect(built.argv[1]).toBe(built.promptBody);

    // Gate-3 prompt is small by construction → no file rewrite.
    expect(built.promptFileBody).toBeUndefined();
    expect(built.enforcedPlanOnly).toBe(true);
  });

  it('YAML auto-loop sites write built.promptFileBody to disk before invoking copilot', () => {
    // The contract that 012 introduced and 017 pins: when the helper sets
    // `promptFileBody`, the YAML MUST write it to `promptPath` BEFORE
    // launching copilot. Static-grep both `_auto.yaml` files for the
    // exact write-then-dispatch ordering. This catches a regression where
    // a future refactor moves or drops the writeFileSync.
    for (const yamlPath of [DEEP_RESEARCH_AUTO_YAML, DEEP_REVIEW_AUTO_YAML]) {
      const yaml = readFileSync(yamlPath, 'utf8');

      // The helper is imported.
      expect(yaml).toContain('buildCopilotPromptArg');

      // The conditional file write exists with the exact `promptFileBody`
      // discriminator the helper emits.
      expect(yaml).toMatch(/if\s*\(\s*built\.promptFileBody\s*!==\s*undefined\s*\)/);
      expect(yaml).toMatch(/writeFileSync\s*\(\s*promptPath\s*,\s*built\.promptFileBody/);

      // The dispatch (spawnSync('copilot', ...) or runAuditedExecutorCommand
      // with command:'copilot') must come AFTER the write. We pin the
      // ordering by index lookup.
      //
      // Note: deep-research has multiple `runAuditedExecutorCommand({ ... })`
      // call frames in the file (one per executor kind). We anchor on the
      // literal `command: 'copilot'` occurrence inside the cli-copilot block,
      // which is the one that immediately follows the writeFileSync. This
      // avoids matching an earlier executor's call frame.
      const writeIdx = yaml.search(/writeFileSync\s*\(\s*promptPath\s*,\s*built\.promptFileBody/);
      const dispatchIdx = (() => {
        const spawnIdx = yaml.indexOf("spawnSync('copilot'");
        if (spawnIdx >= 0) return spawnIdx;
        // deep-research: anchor on the literal `command: 'copilot'` line.
        return yaml.indexOf("command: 'copilot'");
      })();

      expect(writeIdx).toBeGreaterThanOrEqual(0);
      expect(dispatchIdx).toBeGreaterThan(writeIdx);

      // The base argv passed to the helper carries `--allow-all-tools` so
      // the helper has something to strip on Gate-3 enforcement. (Sanity
      // check; without this the strip is a no-op.)
      expect(yaml).toContain("'--allow-all-tools'");
    }
  });
});

describe('cli-matrix smoke coverage', () => {
  it('exercises the large-prompt approved-authority dispatch with a real subprocess and artifact writes', () => {
    const dir = makeTempDir();
    const promptPath = join(dir, 'iteration-001.md');
    const iterationPath = join(dir, 'iteration-001-output.md');
    const deltaPath = join(dir, 'delta-001.md');
    const stateLogPath = join(dir, 'state.jsonl');
    const prompt = `# Prompt\n${'A'.repeat(20000)}\nLarge prompt smoke marker.\n`;

    // Model what the YAML auto-loop dispatch does end-to-end:
    //   1. read prompt → call buildCopilotPromptArg with approved authority
    //   2. if built.promptFileBody is defined, writeFileSync it to promptPath
    //   3. dispatch with built.argv
    // The bare @PROMPT_PATH reference in argv[1] tells the receiver to read
    // the file at promptPath, which now opens with the TARGET AUTHORITY block.
    const built = buildCopilotPromptArg({
      promptPath,
      prompt,
      targetAuthority: { kind: 'approved', specFolder: APPROVED_FOLDER },
      baseArgv: COPILOT_BASE_ARGV,
    });

    expect(built.promptFileBody).toBeDefined();
    expect(built.argv[1]).toBe(`@${promptPath}`);

    // YAML step: write promptFileBody to disk BEFORE dispatch.
    writeFileSync(promptPath, built.promptFileBody!, 'utf8');
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
          // The argv prompt slot is now the bare @PROMPT_PATH reference.
          const match = promptArg.match(/^@(.+)$/);
          const promptPath = match ? match[1] : null;
          if (!promptPath) process.exit(2);
          const promptFile = fs.readFileSync(promptPath, 'utf8');
          fs.writeFileSync(iterationPath, promptFile);
          // The file Copilot reads via @path opens with the TARGET AUTHORITY block.
          // Without that ordering, recovered/bootstrap folder mentions inside
          // could anchor the model. This subprocess proves the file content is
          // right at dispatch time.
          const ok =
            promptFile.includes('## TARGET AUTHORITY') &&
            promptFile.includes('Approved spec folder: ${APPROVED_FOLDER}') &&
            promptFile.includes('Large prompt smoke marker.');
          fs.writeFileSync(deltaPath, ok ? 'wrapper ok' : 'wrapper missing');
          console.log(ok ? 'wrapper-ok' : 'wrapper-missing');
        `,
        built.argv[1],
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
    const onDisk = readFileSync(iterationPath, 'utf8');
    expect(onDisk).toContain('## TARGET AUTHORITY');
    expect(onDisk).toContain(`Approved spec folder: ${APPROVED_FOLDER}`);
    expect(onDisk).toContain('Large prompt smoke marker.');
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
