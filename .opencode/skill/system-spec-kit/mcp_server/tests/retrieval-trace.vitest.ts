// TEST: Retrieval Trace & Context Envelope Contracts (C136-08)
import { describe, expect, it } from 'vitest';
import {
  createTrace,
  addTraceEntry,
  createEnvelope,
  createDegradedContract,
  ENVELOPE_VERSION,
} from '@spec-kit/shared/contracts/retrieval-trace';
import {
  RETRIEVAL_TRACE_STAGES,
  isRetrievalTracePayload,
  sanitizeRetrievalTracePayload,
} from '../lib/telemetry/trace-schema';
import type {
  RetrievalStage,
  RetrievalTrace,
  TraceEntry,
  ContextEnvelope,
  DegradedModeContract,
  EnvelopeMetadata,
} from '@spec-kit/shared/contracts/retrieval-trace';

describe('C136-08: Retrieval Trace Contracts', () => {
  // 1. Trace creation
  it('createTrace returns a valid trace with required fields', () => {
    const trace = createTrace('test query');

    expect(trace.traceId).toMatch(/^tr_/);
    expect(trace.query).toBe('test query');
    expect(trace.stages).toEqual([]);
    expect(trace.totalDurationMs).toBe(0);
    expect(trace.finalResultCount).toBe(0);
    expect(trace.sessionId).toBeUndefined();
    expect(trace.intent).toBeUndefined();
  });

  it('createTrace includes optional sessionId and intent', () => {
    const trace = createTrace('query', 'sess-123', 'recall');

    expect(trace.sessionId).toBe('sess-123');
    expect(trace.intent).toBe('recall');
    expect(trace.query).toBe('query');
  });

  it('createTrace generates unique traceIds', () => {
    const trace1 = createTrace('q1');
    const trace2 = createTrace('q2');

    expect(trace1.traceId).not.toBe(trace2.traceId);
  });

  // 2. Trace entry addition
  it('addTraceEntry appends a stage to the trace', () => {
    const trace = createTrace('test');

    addTraceEntry(trace, 'candidate', 100, 50, 12);

    expect(trace.stages).toHaveLength(1);
    expect(trace.stages[0].stage).toBe('candidate');
    expect(trace.stages[0].inputCount).toBe(100);
    expect(trace.stages[0].outputCount).toBe(50);
    expect(trace.stages[0].durationMs).toBe(12);
    expect(typeof trace.stages[0].timestamp).toBe('number');
  });

  it('addTraceEntry accumulates totalDurationMs across stages', () => {
    const trace = createTrace('test');

    addTraceEntry(trace, 'candidate', 100, 50, 10);
    addTraceEntry(trace, 'filter', 50, 30, 5);
    addTraceEntry(trace, 'fusion', 30, 25, 8);

    expect(trace.totalDurationMs).toBe(23);
    expect(trace.stages).toHaveLength(3);
  });

  it('addTraceEntry updates finalResultCount to last stage outputCount', () => {
    const trace = createTrace('test');

    addTraceEntry(trace, 'candidate', 100, 50, 10);
    expect(trace.finalResultCount).toBe(50);

    addTraceEntry(trace, 'filter', 50, 20, 5);
    expect(trace.finalResultCount).toBe(20);

    addTraceEntry(trace, 'final-rank', 20, 10, 3);
    expect(trace.finalResultCount).toBe(10);
  });

  it('addTraceEntry supports optional metadata', () => {
    const trace = createTrace('test');

    addTraceEntry(trace, 'rerank', 20, 10, 15, { model: 'cross-encoder', provider: 'voyage' });

    expect(trace.stages[0].metadata).toEqual({ model: 'cross-encoder', provider: 'voyage' });
  });

  it('addTraceEntry returns the trace for chaining', () => {
    const trace = createTrace('test');

    const returned = addTraceEntry(trace, 'candidate', 100, 50, 10);

    expect(returned).toBe(trace);
  });

  // 3. All 6 stages accepted
  it('accepts all 6 retrieval stages', () => {
    const stages: RetrievalStage[] = [
      'candidate', 'filter', 'fusion', 'rerank', 'fallback', 'final-rank',
    ];
    const trace = createTrace('test');

    for (const stage of stages) {
      addTraceEntry(trace, stage, 10, 5, 1);
    }

    expect(trace.stages).toHaveLength(6);
    expect(trace.stages.map(s => s.stage)).toEqual(stages);
  });

  // 4. Context envelope
  it('createEnvelope wraps data with trace and metadata', () => {
    const trace = createTrace('q');
    addTraceEntry(trace, 'candidate', 50, 20, 10);

    const envelope = createEnvelope({ results: [1, 2, 3] }, trace);

    expect(envelope.data).toEqual({ results: [1, 2, 3] });
    expect(envelope.trace).toBe(trace);
    expect(envelope.metadata.version).toBe(ENVELOPE_VERSION);
    expect(envelope.metadata.generatedAt).toBeTruthy();
    expect(envelope.degradedMode).toBeUndefined();
  });

  it('createEnvelope includes serverVersion when provided', () => {
    const trace = createTrace('q');
    const envelope = createEnvelope({}, trace, undefined, '1.7.2');

    expect(envelope.metadata.serverVersion).toBe('1.7.2');
  });

  it('createEnvelope attaches degradedMode when provided', () => {
    const trace = createTrace('q');
    const degraded = createDegradedContract(
      'embedding_timeout', 'bm25_only', 0.6, 'delayed', ['fusion']
    );

    const envelope = createEnvelope({ results: [] }, trace, degraded);

    expect(envelope.degradedMode).toBeDefined();
    expect(envelope.degradedMode!.failure_mode).toBe('embedding_timeout');
  });

  // 5. Degraded mode contract
  it('createDegradedContract returns valid contract', () => {
    const contract = createDegradedContract(
      'reranker_unavailable',
      'skip_rerank',
      0.8,
      'none',
      ['rerank']
    );

    expect(contract.failure_mode).toBe('reranker_unavailable');
    expect(contract.fallback_mode).toBe('skip_rerank');
    expect(contract.confidence_impact).toBe(0.8);
    expect(contract.retry_recommendation).toBe('none');
    expect(contract.degradedStages).toEqual(['rerank']);
  });

  it('createDegradedContract clamps confidence_impact to [0, 1]', () => {
    const overContract = createDegradedContract('err', 'fallback', 1.5, 'immediate', []);
    expect(overContract.confidence_impact).toBe(1);

    const underContract = createDegradedContract('err', 'fallback', -0.3, 'immediate', []);
    expect(underContract.confidence_impact).toBe(0);

    const nanContract = createDegradedContract('err', 'fallback', NaN, 'immediate', []);
    expect(nanContract.confidence_impact).toBe(0);

    const infContract = createDegradedContract('err', 'fallback', Infinity, 'immediate', []);
    expect(infContract.confidence_impact).toBe(0);
  });

  it('createDegradedContract supports multiple degraded stages', () => {
    const contract = createDegradedContract(
      'full_degradation', 'cache_only', 0.2, 'delayed',
      ['fusion', 'rerank', 'final-rank']
    );

    expect(contract.degradedStages).toHaveLength(3);
    expect(contract.degradedStages).toContain('fusion');
    expect(contract.degradedStages).toContain('rerank');
    expect(contract.degradedStages).toContain('final-rank');
  });

  // 6. Type-level sanity (compile-time + runtime validation)
  it('envelope metadata has correct ISO timestamp format', () => {
    const trace = createTrace('q');
    const envelope = createEnvelope({}, trace);

    // GeneratedAt should be a valid ISO 8601 string
    const parsed = new Date(envelope.metadata.generatedAt);
    expect(parsed.getTime()).not.toBeNaN();
  });

  it('trace entries have monotonically non-decreasing timestamps', () => {
    const trace = createTrace('q');

    addTraceEntry(trace, 'candidate', 100, 50, 5);
    addTraceEntry(trace, 'filter', 50, 30, 3);
    addTraceEntry(trace, 'final-rank', 30, 10, 2);

    for (let i = 1; i < trace.stages.length; i++) {
      expect(trace.stages[i].timestamp).toBeGreaterThanOrEqual(trace.stages[i - 1].timestamp);
    }
  });

  // 7. Telemetry trace schema validation
  it('telemetry schema exports expected canonical retrieval stages', () => {
    expect(RETRIEVAL_TRACE_STAGES).toEqual([
      'candidate',
      'filter',
      'fusion',
      'rerank',
      'fallback',
      'final-rank',
    ]);
  });

  it('sanitizeRetrievalTracePayload strips non-canonical fields', () => {
    const rawPayload = {
      traceId: 'tr_sanitize',
      query: 'sensitive',
      sessionId: 'session-id',
      stages: [
        {
          stage: 'candidate',
          timestamp: 100,
          inputCount: 50,
          outputCount: 20,
          durationMs: 9,
          metadata: { apiKey: 'secret' },
        },
      ],
      totalDurationMs: 9,
      finalResultCount: 20,
      token: 'secret-token',
    };

    const sanitized = sanitizeRetrievalTracePayload(rawPayload);
    expect(sanitized).toBeDefined();
    if (!sanitized) {
      throw new Error('Expected payload to sanitize successfully');
    }
    const sanitizedRecord = sanitized as unknown as Record<string, unknown> & {
      stages: Array<Record<string, unknown>>;
    };
    expect(sanitized.traceId).toBe('tr_sanitize');
    expect(sanitized.stages).toHaveLength(1);
    expect(sanitizedRecord.query).toBeUndefined();
    expect(sanitizedRecord.sessionId).toBeUndefined();
    expect(sanitizedRecord.token).toBeUndefined();
    expect(sanitizedRecord.stages[0]?.metadata).toBeUndefined();
  });

  it('isRetrievalTracePayload validates only canonical strict payloads', () => {
    const canonicalPayload = {
      traceId: 'tr_valid',
      totalDurationMs: 12,
      finalResultCount: 8,
      stages: [
        {
          stage: 'candidate',
          timestamp: 1,
          inputCount: 25,
          outputCount: 8,
          durationMs: 12,
        },
      ],
    };

    const withExtraField = {
      ...canonicalPayload,
      query: 'sensitive',
    };

    const withInvalidStage = {
      ...canonicalPayload,
      stages: [
        {
          stage: 'invalid-stage',
          timestamp: 1,
          inputCount: 25,
          outputCount: 8,
          durationMs: 12,
        },
      ],
    };

    expect(isRetrievalTracePayload(canonicalPayload)).toBe(true);
    expect(isRetrievalTracePayload(withExtraField)).toBe(false);
    expect(isRetrievalTracePayload(withInvalidStage)).toBe(false);
  });
});
