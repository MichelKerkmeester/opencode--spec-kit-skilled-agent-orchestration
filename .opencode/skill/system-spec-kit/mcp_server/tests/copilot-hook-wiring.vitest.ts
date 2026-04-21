import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '../../../../../');
const hooksJsonPath = resolve(repoRoot, '.github/hooks/superset-notify.json');
const sessionStartScriptPath = resolve(repoRoot, '.github/hooks/scripts/session-start.sh');
const supersetNotifyScriptPath = resolve(repoRoot, '.github/hooks/scripts/superset-notify.sh');

describe('copilot hook wiring', () => {
  it('routes sessionStart through the repo-local wrapper and other events through Superset', () => {
    const parsed = JSON.parse(readFileSync(hooksJsonPath, 'utf-8'));

    expect(parsed.hooks.sessionStart[0].bash).toBe('.github/hooks/scripts/session-start.sh');
    expect(parsed.hooks.sessionEnd[0].bash).toContain('copilot-hook.sh sessionEnd');
    expect(parsed.hooks.userPromptSubmitted[0].bash).toContain('copilot-hook.sh userPromptSubmitted');
    expect(parsed.hooks.postToolUse[0].bash).toContain('copilot-hook.sh postToolUse');
  });

  it('sessionStart wrapper emits the startup banner and snapshot note', () => {
    const output = execFileSync(sessionStartScriptPath, {
      cwd: repoRoot,
      input: '{}\n',
      encoding: 'utf-8',
    });

    expect(output).toContain('Session context received. Current state:');
    expect(output).toContain('Note: this is a startup snapshot; later structural reads may differ if the repo state changed.');
  });

  it('superset notify wrapper returns valid json for non-banner hook events', () => {
    const output = execFileSync(supersetNotifyScriptPath, ['sessionEnd'], {
      cwd: repoRoot,
      input: '{}\n',
      encoding: 'utf-8',
    });

    expect(output.trim()).toBe('{}');
  });
});
