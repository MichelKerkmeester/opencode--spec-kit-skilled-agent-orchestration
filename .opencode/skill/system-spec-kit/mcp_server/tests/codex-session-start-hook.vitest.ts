import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  handleCodexSessionStart,
  parseCodexSessionStartInput,
  type CodexSessionStartInput,
} from '../hooks/codex/session-start.js';

function diagnosticsSink(): { records: string[]; writeDiagnostic: (line: string) => void } {
  const records: string[] = [];
  return {
    records,
    writeDiagnostic: (line: string) => records.push(line),
  };
}

async function runHook(input: CodexSessionStartInput) {
  const diagnostics = diagnosticsSink();
  const startupSections = vi.fn(() => [
    {
      title: 'Session Context',
      content: [
        'Session context received. Current state:',
        '',
        '- Memory: startup summary only (resume on demand)',
        '- Code Graph: files=12 nodes=34 edges=56 freshness=live',
        '- CocoIndex: available',
      ].join('\n'),
    },
    {
      title: 'Startup Payload Contract',
      content: JSON.stringify({
        kind: 'startup',
        provenance: { producer: 'startup_brief', trustState: 'live' },
        sectionKeys: ['structural-context'],
      }, null, 2),
    },
  ]);
  const output = await handleCodexSessionStart(input, {
    startupSections,
    writeDiagnostic: diagnostics.writeDiagnostic,
  });
  return { output, startupSections, diagnostics };
}

describe('Codex SessionStart startup-context hook', () => {
  it('emits JSON hookSpecificOutput.additionalContext for startup payloads', async () => {
    const { output, startupSections, diagnostics } = await runHook({
      session_id: 's1',
      hook_event_name: 'SessionStart',
      source: 'startup',
      cwd: '/workspace/project',
    });

    expect(output).toEqual({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: [
          '## Session Context',
          'Session context received. Current state:',
          '',
          '- Memory: startup summary only (resume on demand)',
          '- Code Graph: files=12 nodes=34 edges=56 freshness=live',
          '- CocoIndex: available',
          '',
          '## Startup Payload Contract',
          '{',
          '  "kind": "startup",',
          '  "provenance": {',
          '    "producer": "startup_brief",',
          '    "trustState": "live"',
          '  },',
          '  "sectionKeys": [',
          '    "structural-context"',
          '  ]',
          '}',
        ].join('\n'),
      },
    });
    expect(startupSections).toHaveBeenCalledWith(expect.objectContaining({
      session_id: 's1',
      source: 'startup',
    }));
    expect(JSON.parse(diagnostics.records[0] ?? '{}')).toEqual(expect.objectContaining({
      surface: 'codex-session-start',
      status: 'ok',
      source: 'startup',
    }));
  });

  it('supports resume and clear sources without calling startup builder', async () => {
    const startupSections = vi.fn(() => []);
    const resumeOutput = await handleCodexSessionStart({
      session_id: 's1',
      source: 'resume',
    }, {
      startupSections,
      resumeSections: () => [{ title: 'Session Resume', content: 'resume context' }],
    });
    const clearOutput = await handleCodexSessionStart({
      session_id: 's1',
      source: 'clear',
    }, {
      startupSections,
      clearSections: () => [{ title: 'Fresh Context', content: 'cleared context' }],
    });

    expect(startupSections).not.toHaveBeenCalled();
    expect(resumeOutput).toHaveProperty('hookSpecificOutput.additionalContext', '## Session Resume\nresume context');
    expect(clearOutput).toHaveProperty('hookSpecificOutput.additionalContext', '## Fresh Context\ncleared context');
  });

  it('fails open on invalid JSON and empty generated context', async () => {
    expect(parseCodexSessionStartInput('{not-json')).toBeNull();
    expect(parseCodexSessionStartInput('{"source":"startup"}')).toEqual({ source: 'startup' });

    const output = await handleCodexSessionStart({
      session_id: 's1',
      source: 'startup',
    }, {
      startupSections: () => [],
    });

    expect(output).toEqual({});
  });

  it('execs the compiled Codex SessionStart hook and emits non-empty additionalContext', () => {
    const workspaceRoot = resolve(import.meta.dirname, '../../../../..');
    const hookPath = join(workspaceRoot, '.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/session-start.js');
    const result = spawnSync(process.execPath, [hookPath], {
      cwd: workspaceRoot,
      input: JSON.stringify({
        session_id: 's1',
        hook_event_name: 'SessionStart',
        source: 'startup',
        cwd: workspaceRoot,
        model: 'gpt-5.4',
        permission_mode: 'default',
      }),
      encoding: 'utf8',
      timeout: 10000,
      maxBuffer: 1024 * 1024,
    });

    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout) as {
      hookSpecificOutput?: {
        additionalContext?: string;
      };
    };
    expect(parsed.hookSpecificOutput?.additionalContext).toBeTruthy();
    expect(parsed.hookSpecificOutput?.additionalContext).toContain('Session Context');
  });
});
