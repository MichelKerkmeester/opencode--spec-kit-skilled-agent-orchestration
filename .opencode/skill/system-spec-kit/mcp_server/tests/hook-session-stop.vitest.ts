import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { detectSpecFolder } from '../hooks/claude/session-stop.js';

describe('Claude session-stop spec folder detection', () => {
  let tempDir: string | null = null;

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it('preserves the current spec folder when the transcript mentions multiple packets', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'speckit-stop-hook-'));
    const transcriptPath = join(tempDir, 'transcript.jsonl');
    writeFileSync(
      transcriptPath,
      [
        '.opencode/specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation/tasks.md',
        '.opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md',
        '.opencode/specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation/checklist.md',
      ].join('\n'),
      'utf-8',
    );

    expect(
      detectSpecFolder(
        transcriptPath,
        'specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation',
      ),
    ).toBe('specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation');
  });

  it('rejects ambiguous transcript-only detection when multiple spec folders are present', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'speckit-stop-hook-'));
    const transcriptPath = join(tempDir, 'transcript.jsonl');
    writeFileSync(
      transcriptPath,
      [
        '.opencode/specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation/tasks.md',
        '.opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md',
      ].join('\n'),
      'utf-8',
    );

    expect(detectSpecFolder(transcriptPath)).toBeNull();
  });

  it('still detects a single unambiguous spec folder', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'speckit-stop-hook-'));
    const transcriptPath = join(tempDir, 'transcript.jsonl');
    writeFileSync(
      transcriptPath,
      [
        '.opencode/specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation/tasks.md',
        '.opencode/specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation/checklist.md',
      ].join('\n'),
      'utf-8',
    );

    expect(detectSpecFolder(transcriptPath)).toBe(
      'specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation',
    );
  });

  it('retargets to a new unambiguous spec folder when the current one is absent from the transcript tail', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'speckit-stop-hook-'));
    const transcriptPath = join(tempDir, 'transcript.jsonl');
    writeFileSync(
      transcriptPath,
      [
        '.opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md',
        '.opencode/specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/implementation-summary.md',
      ].join('\n'),
      'utf-8',
    );

    expect(
      detectSpecFolder(
        transcriptPath,
        'specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation',
      ),
    ).toBe('specs/02--system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity');
  });
});
