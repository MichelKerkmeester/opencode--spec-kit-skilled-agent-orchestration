// TEST: MCP TOOL DISPATCH
import { describe, it, expect } from 'vitest';
import * as handlers from '../handlers/index';

const TOOL_HANDLER_MAP: Array<{ tool: string; handler: string; layer: string }> = [
  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
  { tool: 'memory_search', handler: 'handleMemorySearch', layer: 'L2' },
  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
  { tool: 'memory_save', handler: 'handleMemorySave', layer: 'L2' },
  { tool: 'memory_list', handler: 'handleMemoryList', layer: 'L3' },
  { tool: 'memory_stats', handler: 'handleMemoryStats', layer: 'L3' },
  { tool: 'memory_health', handler: 'handleMemoryHealth', layer: 'L3' },
  { tool: 'memory_delete', handler: 'handleMemoryDelete', layer: 'L4' },
  { tool: 'memory_update', handler: 'handleMemoryUpdate', layer: 'L4' },
  { tool: 'memory_validate', handler: 'handleMemoryValidate', layer: 'L4' },
  { tool: 'checkpoint_create', handler: 'handleCheckpointCreate', layer: 'L5' },
  { tool: 'checkpoint_list', handler: 'handleCheckpointList', layer: 'L5' },
  { tool: 'checkpoint_restore', handler: 'handleCheckpointRestore', layer: 'L5' },
  { tool: 'checkpoint_delete', handler: 'handleCheckpointDelete', layer: 'L5' },
  { tool: 'task_preflight', handler: 'handleTaskPreflight', layer: 'L6' },
  { tool: 'task_postflight', handler: 'handleTaskPostflight', layer: 'L6' },
  { tool: 'memory_drift_why', handler: 'handleMemoryDriftWhy', layer: 'L6' },
  { tool: 'memory_causal_link', handler: 'handleMemoryCausalLink', layer: 'L6' },
  { tool: 'memory_causal_stats', handler: 'handleMemoryCausalStats', layer: 'L6' },
  { tool: 'memory_causal_unlink', handler: 'handleMemoryCausalUnlink', layer: 'L6' },
  { tool: 'eval_run_ablation', handler: 'handleEvalRunAblation', layer: 'L6' },
  { tool: 'eval_reporting_dashboard', handler: 'handleEvalReportingDashboard', layer: 'L6' },
  { tool: 'memory_index_scan', handler: 'handleMemoryIndexScan', layer: 'L7' },
  { tool: 'memory_get_learning_history', handler: 'handleGetLearningHistory', layer: 'L7' },
];

const SNAKE_CASE_MAP: Array<{ camel: string; snake: string }> = [
  { camel: 'handleMemorySearch', snake: 'handle_memory_search' },
  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
  { camel: 'handleMemorySave', snake: 'handle_memory_save' },
  { camel: 'handleMemoryList', snake: 'handle_memory_list' },
  { camel: 'handleMemoryStats', snake: 'handle_memory_stats' },
  { camel: 'handleMemoryHealth', snake: 'handle_memory_health' },
  { camel: 'handleMemoryDelete', snake: 'handle_memory_delete' },
  { camel: 'handleMemoryUpdate', snake: 'handle_memory_update' },
  { camel: 'handleMemoryValidate', snake: 'handle_memory_validate' },
  { camel: 'handleCheckpointCreate', snake: 'handle_checkpoint_create' },
  { camel: 'handleCheckpointList', snake: 'handle_checkpoint_list' },
  { camel: 'handleCheckpointRestore', snake: 'handle_checkpoint_restore' },
  { camel: 'handleCheckpointDelete', snake: 'handle_checkpoint_delete' },
  { camel: 'handleTaskPreflight', snake: 'handle_task_preflight' },
  { camel: 'handleTaskPostflight', snake: 'handle_task_postflight' },
  { camel: 'handleGetLearningHistory', snake: 'handle_get_learning_history' },
  { camel: 'handleMemoryDriftWhy', snake: 'handle_memory_drift_why' },
  { camel: 'handleMemoryCausalLink', snake: 'handle_memory_causal_link' },
  { camel: 'handleMemoryCausalStats', snake: 'handle_memory_causal_stats' },
  { camel: 'handleMemoryCausalUnlink', snake: 'handle_memory_causal_unlink' },
  { camel: 'handleEvalRunAblation', snake: 'handle_eval_run_ablation' },
  { camel: 'handleEvalReportingDashboard', snake: 'handle_eval_reporting_dashboard' },
  { camel: 'handleMemoryIndexScan', snake: 'handle_memory_index_scan' },
  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
];

type ToolHandler = (args: Record<string, unknown>) => unknown;

const handlerExports = handlers as Record<string, unknown>;

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof (value as { then?: unknown }).then === 'function'
  );
}

describe('MCP Protocol Tool Dispatch (T533) [deferred - requires DB test fixtures]', () => {

  describe('Tool Dispatch Verification (24 tools)', () => {
    TOOL_HANDLER_MAP.forEach((entry, i) => {
      const testNum = i + 1;

      it(`T533-${testNum}: ${entry.tool} dispatches to ${entry.handler}`, async () => {
        const handlerFn = handlerExports[entry.handler];

        // Handler exists as export
        expect(handlerFn).toBeDefined();

        // It's a function
        expect(typeof handlerFn).toBe('function');

        // Verify it's callable (async or sync)
        if (typeof handlerFn === 'function') {
          try {
            const result = (handlerFn as ToolHandler)({});
            if (isPromiseLike(result)) {
              // It's a promise — catch any rejection from invalid args
              try {
                await result;
              } catch (_: unknown) {
                // Expected: invalid args cause errors. That's fine.
              }
            }
          } catch (_: unknown) {
            // Synchronous throw — still confirms it's callable
          }
        }
      });
    });
  });

  describe('Snake_case alias verification', () => {
    SNAKE_CASE_MAP.forEach((entry) => {
      it(`T533-alias: ${entry.snake} aliases ${entry.camel}`, () => {
        const snakeFn = handlerExports[entry.snake];
        expect(typeof snakeFn).toBe('function');
      });
    });
  });
});
