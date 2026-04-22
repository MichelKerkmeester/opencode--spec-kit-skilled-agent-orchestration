import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearCodexPreToolUsePolicyCacheForTests,
  DEFAULT_POLICY,
  handleCodexPreToolUse,
  type CodexPolicyFile,
} from '../hooks/codex/pre-tool-use.js';

const policy: CodexPolicyFile = {
  bashDenylist: [
    {
      pattern: 'rm -rf /',
      reason: 'No root deletion.',
    },
    {
      pattern: 'git push --force main',
      reason: 'No forced push to main.',
    },
  ],
};

describe('Codex PreToolUse Bash deny policy', () => {
  afterEach(() => {
    clearCodexPreToolUsePolicyCacheForTests();
    vi.restoreAllMocks();
  });

  it('denies Bash commands that match the denylist', () => {
    const output = handleCodexPreToolUse({
      tool: 'Bash',
      tool_input: {
        command: 'cd /tmp && rm -rf /',
      },
    }, {
      readPolicy: () => policy,
    });

    expect(output).toEqual({
      decision: 'deny',
      reason: 'No root deletion.',
    });
  });

  it('allows Bash commands that do not match the denylist', () => {
    const output = handleCodexPreToolUse({
      tool: 'Bash',
      tool_input: {
        command: 'git status --short',
      },
    }, {
      readPolicy: () => policy,
    });

    expect(output).toEqual({});
  });

  it.each(['Edit', 'Read', 'Write'])('emits no decision for non-Bash tool %s', (tool) => {
    const output = handleCodexPreToolUse({
      tool,
      command: 'rm -rf /',
    }, {
      readPolicy: () => policy,
    });

    expect(output).toEqual({});
  });

  it('uses full-word matching rather than partial token matching', () => {
    const partialWord = handleCodexPreToolUse({
      tool: 'Bash',
      command: 'git push --force mainline',
    }, {
      readPolicy: () => policy,
    });
    const partialPath = handleCodexPreToolUse({
      tool: 'Bash',
      command: 'rm -rf /tmp/scratch',
    }, {
      readPolicy: () => policy,
    });

    expect(partialWord).toEqual({});
    expect(partialPath).toEqual({});
  });

  it('fails open when policy loading throws', () => {
    const output = handleCodexPreToolUse({
      tool: 'Bash',
      command: 'rm -rf /',
    }, {
      readPolicy: () => {
        throw new Error('policy read failed');
      },
    });

    expect(output).toEqual({});
  });

  it('denies Bash commands from the bash_denylist alias', () => {
    const output = handleCodexPreToolUse({
      tool: 'Bash',
      tool_input: {
        command: 'git reset --hard HEAD~1',
      },
    }, {
      readPolicy: () => ({
        bash_denylist: [
          {
            pattern: 'git reset --hard',
            reason: 'No destructive reset.',
          },
        ],
      }),
    });

    expect(output).toEqual({
      decision: 'deny',
      reason: 'No destructive reset.',
    });
  });

  it('reads Bash commands from camelCase toolInput.command payloads', () => {
    const output = handleCodexPreToolUse({
      tool: 'Bash',
      toolInput: {
        command: 'git push --force main',
      },
    }, {
      readPolicy: () => policy,
    });

    expect(output).toEqual({
      decision: 'deny',
      reason: 'No forced push to main.',
    });
  });

  it('uses in-memory defaults when policy file is missing without writing the file', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'codex-policy-'));
    const policyPath = join(tempDir, '.codex', 'policy.json');
    const stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    try {
      const output = handleCodexPreToolUse({
        tool: 'Bash',
        command: 'git reset --hard HEAD~1',
      }, {
        policyPath,
      });

      expect(output).toEqual({
        decision: 'deny',
        reason: 'Codex PreToolUse denied Bash command matching git reset --hard',
      });
      expect(existsSync(policyPath)).toBe(false);
      expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('"status":"in_memory_default"'));
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('documents starter scope rather than comprehensive shell-safety enforcement', () => {
    expect(DEFAULT_POLICY.notes).toContain('starter Bash denylist');
    expect(DEFAULT_POLICY.notes).toContain('not a comprehensive destructive-command policy');
    expect(DEFAULT_POLICY.notes).toContain('shell-safety parser');
  });
});
