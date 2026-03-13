// Converted from: trigger-extractor.test.ts (custom runner)
// TEST: TRIGGER EXTRACTOR
// TF-IDF + N-gram hybrid trigger phrase extraction
import { describe, it, expect } from 'vitest';
import {
  extractTriggerPhrases,
  extractTriggerPhrasesWithStats,
  removeMarkdown,
  CONFIG,
} from '@spec-kit/shared/trigger-extractor';

/* --- Tests --- */

describe('Trigger Extractor (T515)', () => {

  describe('Extract from content body (T515-01)', () => {
    const content = `
      The memory management system handles garbage collection and heap allocation.
      When the heap allocator runs out of space, the garbage collector triggers
      a compaction cycle. The compaction cycle moves live objects to reduce
      fragmentation in the memory pool. Memory pool fragmentation causes
      performance degradation over time. The garbage collector uses a
      mark-and-sweep algorithm for identifying unreachable objects.
      The mark-and-sweep algorithm traverses the object graph starting
      from root references. Root references include stack variables and
      global variables that point to heap-allocated objects.
    `;

    it('T515-01a: extractTriggerPhrases returns non-empty array', () => {
      const phrases = extractTriggerPhrases(content);
      expect(Array.isArray(phrases)).toBe(true);
      expect(phrases.length).toBeGreaterThan(0);
    });

    it('T515-01b: all phrases are lowercase strings', () => {
      const phrases = extractTriggerPhrases(content);
      expect(phrases.length).toBeGreaterThan(0);
      const allLowercase = phrases.every((p: string) => typeof p === 'string' && p === p.toLowerCase());
      expect(allLowercase).toBe(true);
    });
  });

  describe('Extract with stats breakdown (T515-02)', () => {
    it('T515-02a: extractTriggerPhrasesWithStats returns phrases', () => {
      if (typeof extractTriggerPhrasesWithStats !== 'function') {
        return; // skip if not exported
      }

      const content = `
        We investigated the database connection pooling issue and found that
        the connectionManager was not properly handling timeout errors.
        The connection pool exhaustion caused cascading failures across
        the microservices. We decided to implement a circuit breaker
        pattern to prevent connection pool exhaustion. The circuit breaker
        monitors failed connections and trips when the failure rate exceeds
        the configured threshold. After implementing the circuit breaker,
        connection pool usage stabilized and timeout errors decreased by 95%.
      `;

      const result = extractTriggerPhrasesWithStats(content);
      expect(result).toBeTruthy();
      expect(Array.isArray(result.phrases)).toBe(true);
    });

    it('T515-02b: stats include extraction time', () => {
      if (typeof extractTriggerPhrasesWithStats !== 'function') {
        return;
      }

      const content = `
        We investigated the database connection pooling issue and found that
        the connectionManager was not properly handling timeout errors.
        The connection pool exhaustion caused cascading failures across
        the microservices.
      `;

      const result = extractTriggerPhrasesWithStats(content);
      expect(result.stats).toBeTruthy();
      expect(typeof result.stats.extractionTimeMs).toBe('number');
    });

    it('T515-02c: breakdown by extraction type present', () => {
      if (typeof extractTriggerPhrasesWithStats !== 'function') {
        return;
      }

      const content = `
        We investigated the database connection pooling issue and found that
        the connectionManager was not properly handling timeout errors.
        The connection pool exhaustion caused cascading failures.
        We decided to implement a circuit breaker pattern.
      `;

      const result = extractTriggerPhrasesWithStats(content);
      expect(result.breakdown).toBeTruthy();
    });
  });

  describe('Deduplication of triggers (T515-03)', () => {
    it('T515-03: no duplicate trigger phrases', () => {
      const content = `
        The access tracker module handles memory access tracking and access count management.
        The access tracker records each memory access event. Memory access events are
        stored in the access tracker database. The access tracker accumulator pattern
        batches access count updates to improve performance. Access count updates from
        the access tracker are flushed when the accumulator threshold is reached.
        The memory access tracker is essential for popularity scoring calculations.
        Popularity scoring uses access tracker data to boost frequently accessed memories.
      `;

      const phrases = extractTriggerPhrases(content);
      expect(Array.isArray(phrases)).toBe(true);
      const unique = new Set(phrases);
      expect(unique.size).toBe(phrases.length);
    });
  });

  describe('Max triggers limit (T515-04)', () => {
    it('T515-04: trigger count respects MAX_PHRASE_COUNT', () => {
      const topics = [
        'database optimization', 'query performance', 'index scanning',
        'connection pooling', 'transaction isolation', 'deadlock detection',
        'cache invalidation', 'memory allocation', 'garbage collection',
        'thread synchronization', 'mutex locking', 'semaphore counting',
        'network latency', 'packet routing', 'socket buffering',
        'file system journaling', 'disk fragmentation', 'block allocation',
        'process scheduling', 'context switching', 'interrupt handling',
        'compiler optimization', 'register allocation', 'loop unrolling',
        'binary serialization', 'protocol buffering', 'message queuing',
        'load balancing', 'circuit breaking', 'rate limiting',
        'authentication tokens', 'session management', 'permission checking',
      ];

      const content = topics.map(t =>
        `The ${t} system manages ${t} operations efficiently. When ${t} fails, ` +
        `the ${t} handler retries the ${t} process. The ${t} module was recently ` +
        `refactored to improve ${t} performance and reliability.`
      ).join('\n');

      const phrases = extractTriggerPhrases(content);
      const maxLimit = CONFIG ? CONFIG.MAX_PHRASE_COUNT : 25;

      expect(Array.isArray(phrases)).toBe(true);
      expect(phrases.length).toBeLessThanOrEqual(maxLimit);
    });
  });

  describe('Empty content returns empty (T515-05)', () => {
    it('T515-05a: null input returns empty array', () => {
      // @ts-expect-error Testing invalid input shape
      const result = extractTriggerPhrases(null);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('T515-05b: empty string returns empty array', () => {
      const result = extractTriggerPhrases('');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('T515-05c: short content returns empty array', () => {
      const result = extractTriggerPhrases('Too short');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('T515-05d: placeholder content returns empty array', () => {
      const result = extractTriggerPhrases(
        'Simulation mode active. This is placeholder data with fallback data. No real conversation data available. Simulated user message processed.'
      );
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('Special characters handled (T515-06)', () => {
    const contentWithMarkdown = `
      ## Memory Architecture Design

      The \`memory_index\` table stores **all indexed memories** with their
      embedding vectors. The [trigger-extractor](./trigger-extractor.ts) module
      handles phrase extraction using *TF-IDF scoring*.

      \`\`\`javascript
      const result = extractTriggerPhrases(content);
      console.log(result);
      \`\`\`

      > Important: The memory architecture supports both semantic and keyword search.

      Key components:
      - Memory index with SQLite storage
      - Embedding provider chain for vector generation
      - Trigger phrase extractor for keyword matching
      - Confidence tracker for validation scoring
    `;

    it('T515-06a: handles markdown content without errors', () => {
      const phrases = extractTriggerPhrases(contentWithMarkdown);
      expect(Array.isArray(phrases)).toBe(true);
      expect(phrases.length).toBeGreaterThan(0);
    });

    it('T515-06b: no markdown artifacts in extracted phrases', () => {
      const phrases = extractTriggerPhrases(contentWithMarkdown);
      if (phrases && phrases.length > 0) {
        const hasMarkdownArtifacts = phrases.some((p: string) =>
          p.includes('```') || p.includes('##') || p.includes('**') || p.includes('`')
        );
        expect(hasMarkdownArtifacts).toBe(false);
      }
    });

    it('T515-06c: removeMarkdown strips markdown formatting', () => {
      if (typeof removeMarkdown !== 'function') {
        return; // skip if not exported
      }
      const cleaned = removeMarkdown('# Hello **world** `code`');
      expect(typeof cleaned).toBe('string');
      expect(cleaned).not.toContain('#');
      expect(cleaned).not.toContain('**');
      expect(cleaned).not.toContain('`');
    });
  });
});
