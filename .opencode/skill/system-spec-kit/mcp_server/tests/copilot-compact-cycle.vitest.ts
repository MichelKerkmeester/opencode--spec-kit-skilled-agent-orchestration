import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { ensureStateDir, getStatePath, loadState } from '../hooks/claude/hook-state.js';
import { cacheCompactContext } from '../hooks/copilot/compact-cache.js';
import { handleCompact } from '../hooks/copilot/session-prime.js';

describe('copilot compact cycle', () => {
  const testSessionId = 'test-copilot-compact-cycle';
  let tempDir: string | null = null;

  beforeEach(() => {
    ensureStateDir();
    tempDir = mkdtempSync(join(tmpdir(), 'copilot-compact-cycle-'));
  });

  afterEach(() => {
    try {
      rmSync(getStatePath(testSessionId));
    } catch {
      // ok
    }
    if (tempDir) {
      try {
        rmSync(tempDir, { recursive: true, force: true });
      } catch {
        // ok
      }
    }
    tempDir = null;
  });

  function writeTranscript(lines: string[]): string {
    if (!tempDir) {
      throw new Error('Temporary directory unavailable');
    }
    const transcriptPath = join(tempDir, 'transcript.jsonl');
    writeFileSync(transcriptPath, `${lines.join('\n')}\n`, 'utf-8');
    return transcriptPath;
  }

  it('writes trustState=cached into the pending compact payload contract', () => {
    const transcriptPath = writeTranscript([
      '{"message":{"content":"Reading /Users/demo/project/src/main.ts"}}',
      'plain text with /.opencode/specs/system-spec-kit/demo/spec.md reference',
    ]);

    const result = cacheCompactContext({
      session_id: testSessionId,
      transcript_path: transcriptPath,
      trigger: 'manual',
    });
    const state = loadState(testSessionId);

    expect(result?.persisted).toBe(true);
    expect(state.ok).toBe(true);
    expect(state.ok && state.state.pendingCompactPrime?.payloadContract?.provenance).toMatchObject({
      producer: 'hook_cache',
      sourceSurface: 'copilot-compact-cache',
      trustState: 'cached',
    });
  });

  it('reads cached trustState when rendering recovered compact output', () => {
    const transcriptPath = writeTranscript([
      '{"message":{"content":"Editing /Users/demo/project/src/main.ts"}}',
      'plain text with /Users/demo/project/src/utils.ts reference',
    ]);

    cacheCompactContext({
      session_id: testSessionId,
      transcript_path: transcriptPath,
      trigger: 'manual',
    });

    const output = handleCompact(testSessionId);

    expect(output).toContain('Recovered Context (Post-Compression)');
    expect(output).toContain('[PROVENANCE: producer=hook_cache; trustState=cached; sourceSurface=copilot-compact-cache]');
    expect(output).toContain('Recovery Instructions');
  });
});
