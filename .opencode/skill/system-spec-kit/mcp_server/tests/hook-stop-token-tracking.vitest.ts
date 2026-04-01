// ───────────────────────────────────────────────────────────────
// TEST: Stop Hook Token Tracking
// ───────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseTranscript, estimateCost } from '../hooks/claude/claude-transcript.js';

describe('stop hook token tracking', () => {
  const testDir = join(tmpdir(), 'speckit-test-transcripts');
  const testFile = join(testDir, 'test-transcript.jsonl');

  function createTestTranscript(lines: string[]): void {
    mkdirSync(testDir, { recursive: true });
    writeFileSync(testFile, lines.join('\n') + '\n', 'utf-8');
  }

  afterEach(() => {
    try { rmSync(testDir, { recursive: true }); } catch { /* ok */ }
  });

  describe('parseTranscript', () => {
    it('extracts token usage from assistant messages', async () => {
      createTestTranscript([
        JSON.stringify({ message: { role: 'assistant', usage: { input_tokens: 100, output_tokens: 50 }, model: 'claude-sonnet-4-6' } }),
        JSON.stringify({ message: { role: 'assistant', usage: { input_tokens: 200, output_tokens: 100 } } }),
      ]);

      const { usage, newOffset } = await parseTranscript(testFile);
      expect(usage.promptTokens).toBe(300);
      expect(usage.completionTokens).toBe(150);
      expect(usage.totalTokens).toBe(450);
      expect(usage.messageCount).toBe(2);
      expect(usage.model).toBe('claude-sonnet-4-6');
      expect(newOffset).toBe(Buffer.byteLength(
        [
          JSON.stringify({ message: { role: 'assistant', usage: { input_tokens: 100, output_tokens: 50 }, model: 'claude-sonnet-4-6' } }),
          JSON.stringify({ message: { role: 'assistant', usage: { input_tokens: 200, output_tokens: 100 } } }),
        ].join('\n') + '\n',
        'utf-8',
      ));
    });

    it('handles empty transcript', async () => {
      createTestTranscript([]);
      const { usage } = await parseTranscript(testFile);
      expect(usage.totalTokens).toBe(0);
      expect(usage.messageCount).toBe(0);
    });

    it('skips malformed JSON lines', async () => {
      createTestTranscript([
        'not json',
        JSON.stringify({ message: { role: 'assistant', usage: { input_tokens: 50, output_tokens: 25 } } }),
        '{ broken json',
      ]);

      const { usage } = await parseTranscript(testFile);
      expect(usage.promptTokens).toBe(50);
      expect(usage.completionTokens).toBe(25);
      expect(usage.messageCount).toBe(1);
    });

    it('supports incremental parsing via startOffset', async () => {
      createTestTranscript([
        JSON.stringify({ message: { usage: { input_tokens: 100, output_tokens: 50 } } }),
        JSON.stringify({ message: { usage: { input_tokens: 200, output_tokens: 100 } } }),
      ]);

      const { usage: full, newOffset } = await parseTranscript(testFile, 0);
      expect(full.totalTokens).toBe(450);

      // Parse from offset past first line
      const firstLineBytes = Buffer.byteLength(
        JSON.stringify({ message: { usage: { input_tokens: 100, output_tokens: 50 } } }) + '\n',
        'utf-8'
      );
      const { usage: partial } = await parseTranscript(testFile, firstLineBytes);
      expect(partial.promptTokens).toBe(200);
      expect(partial.completionTokens).toBe(100);
      expect(newOffset).toBe(Buffer.byteLength(
        [
          JSON.stringify({ message: { usage: { input_tokens: 100, output_tokens: 50 } } }),
          JSON.stringify({ message: { usage: { input_tokens: 200, output_tokens: 100 } } }),
        ].join('\n') + '\n',
        'utf-8',
      ));
    });

    it('handles cache tokens', async () => {
      createTestTranscript([
        JSON.stringify({
          message: {
            usage: {
              input_tokens: 100,
              output_tokens: 50,
              cache_creation_input_tokens: 500,
              cache_read_input_tokens: 300,
            },
          },
        }),
      ]);

      const { usage } = await parseTranscript(testFile);
      expect(usage.cacheCreationTokens).toBe(500);
      expect(usage.cacheReadTokens).toBe(300);
    });
  });

  describe('estimateCost', () => {
    it('estimates Sonnet pricing by default', () => {
      const cost = estimateCost({
        promptTokens: 1_000_000,
        completionTokens: 1_000_000,
        cacheCreationTokens: 0,
        cacheReadTokens: 0,
        totalTokens: 2_000_000,
        messageCount: 10,
        model: 'claude-sonnet-4-6',
      });
      expect(cost).toBe(18); // $3 prompt + $15 completion
    });

    it('estimates Opus pricing', () => {
      const cost = estimateCost({
        promptTokens: 1_000_000,
        completionTokens: 1_000_000,
        cacheCreationTokens: 0,
        cacheReadTokens: 0,
        totalTokens: 2_000_000,
        messageCount: 10,
        model: 'claude-opus-4-6',
      });
      expect(cost).toBe(90); // $15 prompt + $75 completion
    });

    it('estimates Haiku pricing', () => {
      const cost = estimateCost({
        promptTokens: 1_000_000,
        completionTokens: 1_000_000,
        cacheCreationTokens: 0,
        cacheReadTokens: 0,
        totalTokens: 2_000_000,
        messageCount: 10,
        model: 'claude-haiku-4-5',
      });
      expect(cost).toBe(1.5); // $0.25 prompt + $1.25 completion
    });
  });
});
