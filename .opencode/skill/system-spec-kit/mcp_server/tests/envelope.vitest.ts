// TEST: RESPONSE ENVELOPE
// Tests for REQ-019: Standardized Response Structure

import { describe, it, expect } from 'vitest';
import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
import {
  createResponse,
  createSuccessResponse,
  createEmptyResponse,
  createErrorResponse,
  wrapForMCP,
  DEFAULT_HINTS
} from '../lib/response/envelope';

describe('Response Envelope (T148-T155)', () => {

  describe('T148: Response envelope structure: summary, data, hints, meta', () => {
    it('should have all required fields in envelope', () => {
      const envelope = createResponse({
        tool: 'memory_search',
        summary: 'Found 3 results',
        data: { count: 3, results: [] }
      });

      expect('summary' in envelope).toBe(true);
      expect('data' in envelope).toBe(true);
      expect('hints' in envelope).toBe(true);
      expect('meta' in envelope).toBe(true);
    });

    it('should have correct types for all fields', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test summary',
        data: { value: 42 }
      });

      expect(typeof envelope.summary).toBe('string');
      expect(typeof envelope.data).toBe('object');
      expect(Array.isArray(envelope.hints)).toBe(true);
      expect(typeof envelope.meta).toBe('object');
    });

    it('should include tool name in meta', () => {
      const envelope = createResponse({
        tool: 'memory_save',
        summary: 'Saved memory',
        data: {}
      });

      expect(envelope.meta.tool).toBe('memory_save');
    });
  });

  describe('T149: createResponse() returns valid envelope', () => {
    it('should create envelope with provided data', () => {
      const envelope = createResponse({
        tool: 'memory_search',
        summary: 'Found 5 matching memories',
        data: { searchType: 'hybrid', count: 5, results: ['a', 'b', 'c', 'd', 'e'] },
        hints: ['Use includeContent: true for full file contents']
      });

      expect(envelope.summary).toBe('Found 5 matching memories');
      expect(envelope.data.searchType).toBe('hybrid');
      expect(envelope.data.count).toBe(5);
      expect(envelope.hints).toHaveLength(1);
      expect(envelope.hints[0]).toBe('Use includeContent: true for full file contents');
    });

    it('should default hints to empty array', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {}
      });

      expect(envelope.hints).toEqual([]);
    });

    it('should merge extra metadata', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {},
        extraMeta: { customField: 'customValue', version: '1.0' }
      });

      expect(envelope.meta.customField).toBe('customValue');
      expect(envelope.meta.version).toBe('1.0');
    });
  });

  describe('T150: createSuccessResponse() sets isError=false', () => {
    it('should create success response without isError in meta', () => {
      const envelope = createSuccessResponse({
        tool: 'memory_search',
        summary: 'Operation successful',
        data: { status: 'ok' }
      });

      // Success responses should NOT have isError set
      expect(envelope.meta.isError).toBeUndefined();
    });

    it('should wrap success response with isError=false in MCP format', () => {
      const envelope = createSuccessResponse({
        tool: 'memory_search',
        summary: 'Success',
        data: {}
      });

      const mcpResponse = wrapForMCP(envelope);

      expect(mcpResponse.isError).toBe(false);
      expect(Array.isArray(mcpResponse.content)).toBe(true);
      expect(mcpResponse.content[0].type).toBe('text');
    });

    it('should use default success hints (empty array)', () => {
      const envelope = createSuccessResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {}
      });

      expect(envelope.hints).toEqual(DEFAULT_HINTS.success);
      expect(envelope.hints).toEqual([]);
    });
  });

  describe('T151: createEmptyResponse() handles no results', () => {
    it('should have default "No results found" summary', () => {
      const envelope = createEmptyResponse({
        tool: 'memory_search'
      });

      expect(envelope.summary).toBe('No results found');
    });

    it('should include count: 0 and empty results array', () => {
      const envelope = createEmptyResponse({
        tool: 'memory_search'
      });

      expect(envelope.data.count).toBe(0);
      expect(envelope.data.results).toEqual([]);
    });

    it('should include empty_results hints by default', () => {
      const envelope = createEmptyResponse({
        tool: 'memory_search'
      });

      expect(envelope.hints).toEqual(DEFAULT_HINTS.empty_results);
      expect(envelope.hints.length).toBeGreaterThan(0);
      expect(envelope.hints).toContain('Try broadening your search query');
    });

    it('should allow custom summary and data', () => {
      const envelope = createEmptyResponse({
        tool: 'memory_list',
        summary: 'No memories in folder',
        data: { folder: 'specs/test' }
      });

      expect(envelope.summary).toBe('No memories in folder');
      expect(envelope.data.folder).toBe('specs/test');
      expect(envelope.data.count).toBe(0);
    });
  });

  describe('T152: createErrorResponse() includes recovery hints', () => {
    it('should format error message in summary', () => {
      const envelope = createErrorResponse({
        tool: 'memory_save',
        error: 'File not found'
      });

      expect(envelope.summary).toBe('Error: File not found');
    });

    it('should handle Error objects', () => {
      const error = new Error('Database connection failed');
      const envelope = createErrorResponse({
        tool: 'memory_search',
        error: error
      });

      expect(envelope.summary).toBe('Error: Database connection failed');
      expect(envelope.data.error).toBe('Database connection failed');
    });

    it('should include error code in data', () => {
      const envelope = createErrorResponse({
        tool: 'memory_save',
        error: 'Invalid format',
        code: 'E040'
      });

      expect(envelope.data.code).toBe('E040');
    });

    it('should include recovery hints from recovery object', () => {
      const envelope = createErrorResponse({
        tool: 'memory_search',
        error: 'Embedding service unavailable',
        recovery: {
          hint: 'Check API key configuration',
          actions: ['Verify VOYAGE_API_KEY is set', 'Restart MCP server'],
          toolTip: 'Use memory_list() as fallback',
          severity: 'warning'
        }
      });

      expect(envelope.hints).toContain('Check API key configuration');
      expect(envelope.hints).toContain('Verify VOYAGE_API_KEY is set');
      expect(envelope.hints).toContain('Restart MCP server');
      expect(envelope.hints).toContain('Use memory_list() as fallback');
    });

    it('should set isError=true in meta', () => {
      const envelope = createErrorResponse({
        tool: 'test_tool',
        error: 'Test error'
      });

      expect(envelope.meta.isError).toBe(true);
    });

    it('should set severity from recovery object', () => {
      const envelope = createErrorResponse({
        tool: 'test_tool',
        error: 'Test error',
        recovery: { severity: 'critical' }
      });

      expect(envelope.meta.severity).toBe('critical');
    });

    it('should default severity to error', () => {
      const envelope = createErrorResponse({
        tool: 'test_tool',
        error: 'Test error'
      });

      expect(envelope.meta.severity).toBe('error');
    });
  });

  describe('T153: meta.tokenCount estimation accuracy', () => {
    it('should estimate token count from the final serialized envelope', () => {
      const envelope = createResponse({
        tool: 'memory_search',
        summary: 'Found results',
        data: { text: 'Hello world' } // ~11 chars + JSON overhead
      });

      expect(typeof envelope.meta.tokenCount).toBe('number');
      expect(envelope.meta.tokenCount).toBe(estimateTokenCount(JSON.stringify(envelope, null, 2)));
    });

    it('should exceed the data-only estimate when envelope metadata is included', () => {
      const testText = 'a'.repeat(100); // 100 chars = ~25 tokens
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: { content: testText }
      });

      const dataOnlyEstimate = estimateTokenCount(JSON.stringify({ content: testText }));
      expect(envelope.meta.tokenCount).toBeGreaterThan(dataOnlyEstimate);
      expect(envelope.meta.tokenCount).toBe(estimateTokenCount(JSON.stringify(envelope, null, 2)));
    });

    it('should handle empty data', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {}
      });

      expect(typeof envelope.meta.tokenCount).toBe('number');
      expect(envelope.meta.tokenCount).toBe(estimateTokenCount(JSON.stringify(envelope, null, 2)));
    });

    it('should handle nested objects', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {
          level1: {
            level2: {
              level3: { value: 'deep' }
            }
          }
        }
      });

      expect(envelope.meta.tokenCount).toBe(estimateTokenCount(JSON.stringify(envelope, null, 2)));
    });
  });

  describe('T154: meta.latencyMs measurement', () => {
    it('should calculate latency when startTime provided', async () => {
      const startTime = Date.now();

      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 50));

      const envelope = createResponse({
        tool: 'memory_search',
        summary: 'Found results',
        data: {},
        startTime: startTime
      });

      expect(typeof envelope.meta.latencyMs).toBe('number');
      expect(envelope.meta.latencyMs).toBeGreaterThanOrEqual(45);
    });

    it('should not include latencyMs when startTime not provided', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {}
      });

      expect(envelope.meta.latencyMs).toBeUndefined();
    });

    it('should measure latency in error responses', async () => {
      const startTime = Date.now();

      await new Promise(resolve => setTimeout(resolve, 30));

      const envelope = createErrorResponse({
        tool: 'test_tool',
        error: 'Test error',
        startTime: startTime
      });

      expect(envelope.meta.latencyMs).toBeGreaterThanOrEqual(20);
    });

    it('should measure latency in empty responses', async () => {
      const startTime = Date.now();

      await new Promise(resolve => setTimeout(resolve, 30));

      const envelope = createEmptyResponse({
        tool: 'memory_search',
        startTime: startTime
      });

      expect(envelope.meta.latencyMs).toBeGreaterThanOrEqual(20);
    });
  });

  describe('T155: meta.cacheHit flag', () => {
    it('should default cacheHit to false', () => {
      const envelope = createResponse({
        tool: 'memory_search',
        summary: 'Found results',
        data: {}
      });

      expect(envelope.meta.cacheHit).toBe(false);
    });

    it('should set cacheHit to true when specified', () => {
      const envelope = createResponse({
        tool: 'memory_search',
        summary: 'Found results (cached)',
        data: {},
        cacheHit: true
      });

      expect(envelope.meta.cacheHit).toBe(true);
    });

    it('should preserve cacheHit in success responses', () => {
      const envelope = createSuccessResponse({
        tool: 'memory_search',
        summary: 'Success',
        data: {},
        cacheHit: true
      });

      expect(envelope.meta.cacheHit).toBe(true);
    });

    it('should preserve cacheHit through MCP wrapper', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {},
        cacheHit: true
      });

      const mcpResponse = wrapForMCP(envelope);
      const parsedEnvelope = JSON.parse(mcpResponse.content[0].text);

      expect(parsedEnvelope.meta.cacheHit).toBe(true);
    });

    it('should handle cacheHit in empty responses', () => {
      const envelope = createEmptyResponse({
        tool: 'memory_search'
        // CacheHit not specified, should default via createResponse
      });

      expect(envelope.meta.cacheHit).toBe(false);
    });
  });

  describe('MCP wrapper integration', () => {
    it('should wrap envelope in MCP content format', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: { value: 123 }
      });

      const mcpResponse = wrapForMCP(envelope);

      expect(Array.isArray(mcpResponse.content)).toBe(true);
      expect(mcpResponse.content).toHaveLength(1);
      expect(mcpResponse.content[0].type).toBe('text');
      expect(typeof mcpResponse.content[0].text).toBe('string');
    });

    it('should set isError from envelope meta', () => {
      const errorEnvelope = createErrorResponse({
        tool: 'test_tool',
        error: 'Test error'
      });

      const mcpResponse = wrapForMCP(errorEnvelope);

      expect(mcpResponse.isError).toBe(true);
    });

    it('should allow explicit isError override', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {}
      });

      const mcpResponse = wrapForMCP(envelope, true);

      expect(mcpResponse.isError).toBe(true);
    });

    it('should produce valid JSON in content text', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: { nested: { deep: { value: 'test' } } }
      });

      const mcpResponse = wrapForMCP(envelope);
      const parsed = JSON.parse(mcpResponse.content[0].text);

      expect(parsed.data.nested.deep.value).toBe('test');
    });
  });
});
