import { describe, expect, it } from 'vitest';
import {
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
});
