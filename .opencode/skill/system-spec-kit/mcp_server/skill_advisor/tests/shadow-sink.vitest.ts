import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { recordShadowDelta } from '../lib/shadow/shadow-sink.js';

describe('advisor shadow sink', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  it('appends shadow deltas as JSONL', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'shadow-sink-'));
    tempDirs.push(tempDir);
    const logPath = join(tempDir, 'shadow-deltas.jsonl');

    const result = recordShadowDelta({
      prompt: 'implement telemetry',
      recommendation: 'sk-code',
      liveScore: 0.7,
      shadowScore: 0.9,
      delta: 0.2,
      dominantLane: 'semantic_shadow',
      timestamp: '2026-04-29T00:00:00.000Z',
    }, { logPath });

    const line = readFileSync(logPath, 'utf8').trim();
    expect(result.written).toBe(true);
    expect(JSON.parse(line)).toMatchObject({
      recommendation: 'sk-code',
      dominantLane: 'semantic_shadow',
      delta: 0.2,
    });
  });

  it('rotates when the log exceeds the size cap', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'shadow-sink-rotate-'));
    tempDirs.push(tempDir);
    const logPath = join(tempDir, 'shadow-deltas.jsonl');
    writeFileSync(logPath, 'x'.repeat(20), 'utf8');

    const result = recordShadowDelta({
      prompt: 'prompt',
      recommendation: 'sk-git',
      liveScore: 0.1,
      shadowScore: 0.2,
      delta: 0.1,
      dominantLane: null,
      timestamp: '2026-04-29T00:00:00.000Z',
    }, {
      logPath,
      maxBytes: 10,
      now: new Date('2026-04-29T00:00:00.000Z'),
    });

    expect(result.rotated).toBe(true);
    expect(existsSync(`${logPath}.2026-04-29T00-00-00-000Z.rotated`)).toBe(true);
    expect(readFileSync(logPath, 'utf8')).toContain('"recommendation":"sk-git"');
  });
});

