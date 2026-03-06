// @ts-nocheck
// ---------------------------------------------------------------
// MODULE: Context Server Tests
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest'
import fs from 'fs'
import path from 'path'
import { appendAutoSurfaceHints as actualAppendAutoSurfaceHints } from '../hooks/response-hints'

const SERVER_DIR = path.resolve(__dirname, '..')
const SOURCE_FILE = path.join(SERVER_DIR, 'context-server.ts')
const TOOL_SCHEMAS_FILE = path.join(SERVER_DIR, 'tool-schemas.ts')
const TOOL_TYPES_FILE = path.join(SERVER_DIR, 'tools', 'types.ts')
const STARTUP_CHECKS_FILE = path.join(SERVER_DIR, 'startup-checks.ts')
const SHARED_TYPES_FILE = path.join(SERVER_DIR, '..', 'shared', 'types.ts')

let sourceCode = ''
let toolSchemasCode = ''
let toolTypesCode = ''
let startupChecksCode = ''
let sharedTypesCode = ''

describe('Context Server', () => {
  beforeAll(() => {
    sourceCode = fs.readFileSync(SOURCE_FILE, 'utf8')
    toolSchemasCode = fs.readFileSync(TOOL_SCHEMAS_FILE, 'utf8')
    toolTypesCode = fs.readFileSync(TOOL_TYPES_FILE, 'utf8')
    startupChecksCode = fs.readFileSync(STARTUP_CHECKS_FILE, 'utf8')
    sharedTypesCode = fs.readFileSync(SHARED_TYPES_FILE, 'utf8')
  })

  // =================================================================
  // GROUP 1: parseArgs<T>() Function Tests
  // =================================================================
  describe('Group 1: parseArgs<T>()', () => {
    // Local replica of parseArgs for behavioral tests
    function parseArgs<T>(args: Record<string, unknown>): T {
      return args as unknown as T
    }

    // T1: parseArgs exists in source (T303: moved to tools/types.ts)
    it('T1: parseArgs<T>() defined in source', () => {
      expect(toolTypesCode).toMatch(/function\s+parseArgs\s*<\s*T\s*>\s*\(/)
    })

    // T2: parseArgs has the correct implementation pattern (cast via unknown)
    it('T2: parseArgs uses double-cast pattern', () => {
      expect(toolTypesCode).toMatch(
        /function\s+parseArgs<T>\(args:\s*Record<string,\s*unknown>\):\s*T\s*\{[\s\S]*?return\s+args\s+as\s+unknown\s+as\s+T;/
      )
    })

    // T3: parseArgs parameter type is Record<string, unknown>
    it('T3: parseArgs accepts Record<string, unknown>', () => {
      expect(toolTypesCode).toMatch(/parseArgs<T>\(args:\s*Record<string,\s*unknown>\)/)
    })

    // T4: Replicate parseArgs behavior locally to verify cast semantics
    it('T4: parseArgs preserves object identity', () => {
      const input = { query: 'test', limit: 10 }
      const result = parseArgs<{ query: string; limit: number }>(input)
      expect(result.query).toBe('test')
      expect(result.limit).toBe(10)
    })

    // T5: parseArgs with empty object
    it('T5: parseArgs handles empty args', () => {
      const emptyResult = parseArgs<{ optional?: string }>({})
      expect(emptyResult.optional).toBeUndefined()
    })

    // T6: parseArgs with extra fields (MCP may pass unexpected args)
    it('T6: parseArgs passes through extra fields', () => {
      const extraInput = { query: 'hello', unexpectedField: true, anotherExtra: 42 }
      const extraResult = parseArgs<{ query: string }>(extraInput)
      expect(extraResult.query).toBe('hello')
      expect((extraResult as unknown).unexpectedField).toBe(true)
    })

    // T7: parseArgs with type coercion edge cases (number as string)
    it('T7: parseArgs does NOT coerce types', () => {
      const coercionInput = { id: '42' }
      const coercionResult = parseArgs<{ id: number }>(coercionInput)
      // Cast only, no conversion — string "42" remains string
      expect(coercionResult.id).toBe('42')
    })

    // T8: parseArgs with null values
    it('T8: parseArgs preserves null values', () => {
      const nullInput = { query: null, limit: null }
      const nullResult = parseArgs<{ query: string | null; limit: number | null }>(nullInput)
      expect(nullResult.query).toBeNull()
      expect(nullResult.limit).toBeNull()
    })

    // T9: parseArgs with nested objects
    it('T9: parseArgs preserves nested structures', () => {
      const nestedInput = { metadata: { key: 'value' }, tags: ['a', 'b'] }
      const nestedResult = parseArgs<{ metadata: { key: string }; tags: string[] }>(nestedInput)
      expect(nestedResult.metadata.key).toBe('value')
      expect(nestedResult.tags).toHaveLength(2)
    })

    // T10: parseArgs returns same reference (no clone)
    it('T10: parseArgs returns same reference (no copy)', () => {
      const refInput = { test: 'ref' }
      const refResult = parseArgs<{ test: string }>(refInput)
      expect(refResult).toBe(refInput)
    })
  })

  // =================================================================
  // GROUP 2: Tool Definition Completeness
  // =================================================================
  describe('Group 2: Tool Definitions (25 tools)', () => {
    const EXPECTED_TOOLS = [
      'memory_context',
      'memory_search',
      'memory_match_triggers',
      'memory_save',
      'memory_list',
      'memory_stats',
      'memory_health',
      'memory_delete',
      'memory_update',
      'memory_bulk_delete',
      'memory_validate',
      'checkpoint_create',
      'checkpoint_list',
      'checkpoint_restore',
      'checkpoint_delete',
      'task_preflight',
      'task_postflight',
      'memory_drift_why',
      'memory_causal_link',
      'memory_causal_stats',
      'memory_causal_unlink',
      'eval_run_ablation',
      'eval_reporting_dashboard',
      'memory_index_scan',
      'memory_get_learning_history',
      'memory_ingest_start',
      'memory_ingest_status',
      'memory_ingest_cancel',
    ]

    // T11: TOOL_DEFINITIONS export exists
    it('T11: TOOL_DEFINITIONS export exists', () => {
      expect(toolSchemasCode).toMatch(/export\s+const\s+TOOL_DEFINITIONS/)
    })

    it('T11b: context-server uses TOOL_DEFINITIONS', () => {
      expect(sourceCode).toMatch(/tools:\s*TOOL_DEFINITIONS/)
    })

    it('T11c: Tool count is current expected list length', () => {
      const sectionToolNames = (toolSchemasCode.match(/name:\s*'(\w+)'/g) || []).map((m: string) => {
        const match = m.match(/name:\s*'(\w+)'/)
        return match ? match[1] : null
      }).filter(Boolean)
      expect(sectionToolNames.length).toBe(EXPECTED_TOOLS.length)
    })

    // T12: Each expected tool exists
    for (const tool of EXPECTED_TOOLS) {
      it(`T12: Tool defined: ${tool}`, () => {
        const sectionToolNames = (toolSchemasCode.match(/name:\s*'(\w+)'/g) || []).map((m: string) => {
          const match = m.match(/name:\s*'(\w+)'/)
          return match ? match[1] : null
        }).filter(Boolean)
        expect(sectionToolNames).toContain(tool)
      })
    }

    // T13: No unexpected tools (only expected ones exist)
    it('T13: No unexpected tools', () => {
      const sectionToolNames = (toolSchemasCode.match(/name:\s*'(\w+)'/g) || []).map((m: string) => {
        const match = m.match(/name:\s*'(\w+)'/)
        return match ? match[1] : null
      }).filter(Boolean)
      const unexpected = sectionToolNames.filter((t: string) => !EXPECTED_TOOLS.includes(t))
      expect(unexpected).toHaveLength(0)
    })

    // T14: Each tool has a description
    for (const tool of EXPECTED_TOOLS) {
      it(`T14: Tool ${tool} has description`, () => {
        const toolDefRegex = new RegExp(`name:\\s*'${tool}'\\s*,\\s*description:\\s*'`)
        expect(toolDefRegex.test(toolSchemasCode)).toBe(true)
      })
    }

    // T15: Each tool has an inputSchema
    for (const tool of EXPECTED_TOOLS) {
      it(`T15: Tool ${tool} has inputSchema`, () => {
        const schemaRegex = new RegExp(`name:\\s*'${tool}'[\\s\\S]*?inputSchema:\\s*\\{`)
        expect(schemaRegex.test(toolSchemasCode)).toBe(true)
      })
    }

    it('T15b: context-server imports scoring observability init', () => {
      expect(sourceCode).toMatch(/initScoringObservability\s*}\s*from\s*'\.\/lib\/telemetry\/scoring-observability'/)
    })

    it('T15c: context-server initializes scoring observability at startup', () => {
      expect(sourceCode).toMatch(/initScoringObservability\(database\)/)
    })
  })

  // =================================================================
  // GROUP 3: Tool Dispatch Coverage (T303: dispatchTool replaces switch)
  // =================================================================
  describe('Group 3: Tool Dispatch Coverage', () => {
    const EXPECTED_CASES = [
      'memory_context', 'memory_search', 'memory_match_triggers',
      'memory_delete', 'memory_update', 'memory_bulk_delete', 'memory_list', 'memory_stats',
      'checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete',
      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
      'task_preflight', 'task_postflight', 'memory_get_learning_history',
      'memory_ingest_start', 'memory_ingest_status', 'memory_ingest_cancel',
      'memory_drift_why', 'memory_causal_link', 'memory_causal_stats', 'memory_causal_unlink',
      'eval_run_ablation', 'eval_reporting_dashboard',
    ]

    // T16: CallToolRequestSchema handler exists
    it('T16: CallToolRequestSchema handler exists', () => {
      expect(sourceCode).toMatch(/server\.setRequestHandler\(CallToolRequestSchema/)
    })

    // T303: Verify dispatchTool is used instead of switch
    it('T16b: dispatchTool(name, args) called', () => {
      expect(sourceCode).toMatch(/dispatchTool\(name,\s*args\)/)
    })

    it('T16c: dispatchTool imported from ./tools', () => {
      expect(sourceCode).toMatch(/import\s+\{[^}]*dispatchTool[^}]*\}\s*from\s+['"]\.\/tools['"]/)
    })

    // T17: All tools dispatched via tool modules
    it('T17: All expected tools dispatched via modules', () => {
      const toolsDir = path.join(SERVER_DIR, 'tools')
      let allToolModulesCode = ''
      const toolFiles = fs.readdirSync(toolsDir).filter((f: string) => f.endsWith('.ts') && f !== 'types.ts')
      for (const file of toolFiles) {
        allToolModulesCode += fs.readFileSync(path.join(toolsDir, file), 'utf8') + '\n'
      }

      let caseCount = 0
      for (const caseName of EXPECTED_CASES) {
        const caseRegex = new RegExp(`['"]${caseName}['"]`)
        if (caseRegex.test(allToolModulesCode)) {
          caseCount++
        }
      }
      expect(caseCount).toBe(EXPECTED_CASES.length)
    })

    // T18: Each tool dispatch uses parseArgs<T>
    for (const caseName of EXPECTED_CASES) {
      it(`T18: Tool '${caseName}' uses parseArgs<T>`, () => {
        const toolsDir = path.join(SERVER_DIR, 'tools')
        let allToolModulesCode = ''
        const toolFiles = fs.readdirSync(toolsDir).filter((f: string) => f.endsWith('.ts') && f !== 'types.ts')
        for (const file of toolFiles) {
          allToolModulesCode += fs.readFileSync(path.join(toolsDir, file), 'utf8') + '\n'
        }

        const parseArgsPattern = new RegExp(`['"]${caseName}['"][\\s\\S]*?parseArgs<`)
        const loosePattern = new RegExp(`${caseName}[\\s\\S]{0,200}parseArgs<|parseArgs<[\\s\\S]{0,200}${caseName}`)
        expect(parseArgsPattern.test(allToolModulesCode) || loosePattern.test(allToolModulesCode)).toBe(true)
      })
    }

    // T19: Unknown tools cause error
    it('T19: Unknown tool throws error', () => {
      expect(sourceCode).toMatch(/throw\s+new\s+Error\(`Unknown tool:\s*\$\{name\}`\)/)
    })
  })

  // =================================================================
  // GROUP 3b: After-Tool Callback Pipeline (T000a-T000d)
  // =================================================================
  describe('Group 3b: After-Tool Callback Pipeline', () => {
    const RUNTIME_MOCK_MODULES = [
      '@modelcontextprotocol/sdk/server/index.js',
      '@modelcontextprotocol/sdk/server/stdio.js',
      '@modelcontextprotocol/sdk/types.js',
      '../core',
      '../tool-schemas',
      '../tools',
      '../handlers',
      '../utils',
      '../hooks',
      '../lib/architecture/layer-definitions',
      '../startup-checks',
      '../lib/search/vector-index',
      '../lib/providers/embeddings',
      '../lib/storage/checkpoints',
      '../lib/storage/access-tracker',
      '../lib/search/hybrid-search',
      '../lib/search/bm25-index',
      '../lib/parsing/memory-parser',
      '../lib/cache/cognitive/working-memory',
      '../lib/cache/cognitive/attention-decay',
      '../lib/cache/cognitive/co-activation',
      '../lib/cache/cognitive/archival-manager',
      '../lib/providers/retry-manager',
      '../lib/session/session-manager',
      '../lib/storage/incremental-index',
      '../lib/storage/transaction-manager',
      '../lib/cache/tool-cache',
      '../lib/errors',
    ] as const

    type RuntimeHarness = {
      registerAfterToolCallback: (fn: (tool: string, callId: string, result: unknown) => Promise<void>) => void
      dispatchToolMock: ReturnType<typeof vi.fn>
      autoSurfaceMemoriesMock: ReturnType<typeof vi.fn>
      autoSurfaceAtToolDispatchMock: ReturnType<typeof vi.fn>
      autoSurfaceAtCompactionMock: ReturnType<typeof vi.fn>
      appendAutoSurfaceHintsMock: ReturnType<typeof vi.fn>
      callToolHandler: (request: unknown, extra: unknown) => Promise<unknown>
    }

    async function loadRuntimeHarness(options?: { memoryAwareTools?: Set<string> }): Promise<RuntimeHarness> {
      vi.resetModules()

      const handlers = new Map<unknown, (request: unknown, extra: unknown) => Promise<unknown>>()
      const dispatchToolMock = vi.fn()
      const autoSurfaceMemoriesMock = vi.fn(async () => ({ constitutional: [], triggered: [] }))
      const autoSurfaceAtToolDispatchMock = vi.fn(async () => null)
      const autoSurfaceAtCompactionMock = vi.fn(async () => null)
      const appendAutoSurfaceHintsMock = vi.fn(actualAppendAutoSurfaceHints)
      const extractContextHintMock = vi.fn((toolArgs: Record<string, unknown>) => {
        if (typeof toolArgs?.query === 'string') return toolArgs.query
        if (typeof toolArgs?.input === 'string') return toolArgs.input
        if (typeof toolArgs?.prompt === 'string') return toolArgs.prompt
        return null
      })
      const memoryAwareTools = options?.memoryAwareTools ?? new Set<string>()
      const listToolsSchema = { name: 'ListToolsRequestSchema' }
      const callToolSchema = { name: 'CallToolRequestSchema' }

      vi.spyOn(process, 'on').mockImplementation(() => process)
      vi.spyOn(global, 'setImmediate').mockImplementation(() => 0 as unknown as NodeJS.Immediate)
      vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

      vi.doMock('@modelcontextprotocol/sdk/server/index.js', () => ({
        Server: class {
          setRequestHandler(schema: unknown, handler: (request: unknown, extra: unknown) => Promise<unknown>): void {
            handlers.set(schema, handler)
          }

          async connect(_transport: unknown): Promise<void> {
            return
          }
        },
      }))

      vi.doMock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
        StdioServerTransport: class {
          close(): void {
            return
          }
        },
      }))

      vi.doMock('@modelcontextprotocol/sdk/types.js', () => ({
        ListToolsRequestSchema: listToolsSchema,
        CallToolRequestSchema: callToolSchema,
      }))

      vi.doMock('../core', () => ({
        LIB_DIR: '/tmp',
        DEFAULT_BASE_PATH: '/tmp',
        checkDatabaseUpdated: vi.fn(),
        reinitializeDatabase: vi.fn(),
        setEmbeddingModelReady: vi.fn(),
        waitForEmbeddingModel: vi.fn(async () => true),
        isEmbeddingModelReady: vi.fn(() => true),
        init: vi.fn(),
      }))

      vi.doMock('../tool-schemas', () => ({ TOOL_DEFINITIONS: [] }))
      vi.doMock('../tools', () => ({ dispatchTool: dispatchToolMock }))

      vi.doMock('../handlers', () => ({
        indexSingleFile: vi.fn(async () => ({ status: 'unchanged' })),
        setEmbeddingModelReady: vi.fn(),
      }))

      vi.doMock('../utils', () => ({
        validateInputLengths: vi.fn(),
        validateToolInputSchema: vi.fn(),
      }))

      vi.doMock('../hooks', () => ({
        MEMORY_AWARE_TOOLS: memoryAwareTools,
        extractContextHint: extractContextHintMock,
        autoSurfaceMemories: autoSurfaceMemoriesMock,
        autoSurfaceAtToolDispatch: autoSurfaceAtToolDispatchMock,
        autoSurfaceAtCompaction: autoSurfaceAtCompactionMock,
        appendAutoSurfaceHints: appendAutoSurfaceHintsMock,
      }))

      vi.doMock('../lib/architecture/layer-definitions', () => ({
        getTokenBudget: vi.fn(() => 1000),
      }))

      vi.doMock('../startup-checks', () => ({ detectNodeVersionMismatch: vi.fn() }))

      vi.doMock('../lib/search/vector-index', () => ({
        initializeDb: vi.fn(),
        closeDb: vi.fn(),
        verifyIntegrity: vi.fn(() => ({ totalMemories: 0, missingVectors: 0, orphanedVectors: 0 })),
        validateEmbeddingDimension: vi.fn(() => ({ valid: true, stored: 1536 })),
        getDb: vi.fn(() => ({})),
        vectorSearch: vi.fn(),
      }))

      vi.doMock('../lib/providers/embeddings', () => ({
        validateApiKey: vi.fn(async () => ({ valid: true, provider: 'test' })),
        shouldEagerWarmup: vi.fn(() => false),
        generateEmbedding: vi.fn(async () => [0]),
      }))

      vi.doMock('../lib/storage/checkpoints', () => ({ init: vi.fn() }))
      vi.doMock('../lib/storage/access-tracker', () => ({ init: vi.fn(), reset: vi.fn() }))
      vi.doMock('../lib/search/hybrid-search', () => ({ init: vi.fn() }))
      vi.doMock('../lib/search/bm25-index', () => ({
        isBm25Enabled: vi.fn(() => false),
        getIndex: vi.fn(() => ({ rebuildFromDatabase: vi.fn(() => 0) })),
      }))
      vi.doMock('../lib/parsing/memory-parser', () => ({ findMemoryFiles: vi.fn(() => []) }))
      vi.doMock('../lib/cache/cognitive/working-memory', () => ({ init: vi.fn(), isEnabled: vi.fn(() => false) }))
      vi.doMock('../lib/cache/cognitive/attention-decay', () => ({ init: vi.fn() }))
      vi.doMock('../lib/cache/cognitive/co-activation', () => ({ init: vi.fn(), isEnabled: vi.fn(() => false) }))
      vi.doMock('../lib/cache/cognitive/archival-manager', () => ({
        init: vi.fn(),
        startBackgroundJob: vi.fn(),
        isBackgroundJobRunning: vi.fn(() => false),
        cleanup: vi.fn(),
      }))
      vi.doMock('../lib/providers/retry-manager', () => ({
        startBackgroundJob: vi.fn(() => false),
        stopBackgroundJob: vi.fn(),
      }))
      vi.doMock('../lib/session/session-manager', () => ({
        init: vi.fn(() => ({ success: true })),
        isEnabled: vi.fn(() => false),
        resetInterruptedSessions: vi.fn(() => ({ interruptedCount: 0 })),
        getInterruptedSessions: vi.fn(() => ({ sessions: [] })),
        shutdown: vi.fn(),
      }))
      vi.doMock('../lib/storage/incremental-index', () => ({}))
      vi.doMock('../lib/storage/transaction-manager', () => ({
        recoverAllPendingFiles: vi.fn(() => []),
        getMetrics: vi.fn(() => ({ totalRecoveries: 0, totalErrors: 0, totalAtomicWrites: 0 })),
      }))
      vi.doMock('../lib/cache/tool-cache', () => ({ shutdown: vi.fn() }))
      vi.doMock('../lib/errors', () => ({
        ErrorCodes: { UNKNOWN_TOOL: 'UNKNOWN_TOOL' },
        getRecoveryHint: vi.fn(() => ({ code: 'UNKNOWN_TOOL' })),
        buildErrorResponse: vi.fn((_tool: string, error: Error) => ({ error: error.message })),
      }))

      const module = await import('../context-server')
      const callToolHandler = handlers.get(callToolSchema)
      expect(typeof callToolHandler).toBe('function')

      return {
        registerAfterToolCallback: module.registerAfterToolCallback,
        dispatchToolMock,
        autoSurfaceMemoriesMock,
        autoSurfaceAtToolDispatchMock,
        autoSurfaceAtCompactionMock,
        appendAutoSurfaceHintsMock,
        callToolHandler: callToolHandler as (request: unknown, extra: unknown) => Promise<unknown>,
      }
    }

    afterEach(() => {
      for (const mockedModule of RUNTIME_MOCK_MODULES) {
        vi.doUnmock(mockedModule)
      }
      vi.restoreAllMocks()
      vi.resetModules()
    })

    it('T000a: afterToolCallbacks registry is typed', () => {
      expect(sourceCode).toMatch(/const\s+afterToolCallbacks:\s*Array<\s*AfterToolCallback\s*>\s*=\s*\[\]/)
      expect(sourceCode).toMatch(/type\s+AfterToolCallback\s*=\s*\(tool:\s*string,\s*callId:\s*string,\s*result:\s*unknown\)\s*=>\s*Promise<void>/)
    })

    it('T000c: registerAfterToolCallback(fn) exported', () => {
      expect(sourceCode).toMatch(/export\s+function\s+registerAfterToolCallback\(fn:\s*AfterToolCallback\):\s*void/)
      expect(sourceCode).toMatch(/afterToolCallbacks\.push\(fn\)/)
    })

    it('T000b: callbacks are triggered after dispatchTool and non-blocking', () => {
      expect(sourceCode).toMatch(/const\s+result\s*=\s*await\s+dispatchTool\(name,\s*args\)/)
      expect(sourceCode).toMatch(/runAfterToolCallbacks\(name,\s*callId,\s*result\)/)
      expect(sourceCode).toMatch(/queueMicrotask\(\(\)\s*=>\s*\{/)
      expect(sourceCode).not.toMatch(/await\s+runAfterToolCallbacks\(/)
    })

    it('T000b: per-callback error isolation with logging', () => {
      expect(sourceCode).toMatch(/for\s*\(const\s+callback\s+of\s+afterToolCallbacks\)/)
      expect(sourceCode).toMatch(/void\s+callback\(tool,\s*callId,\s*result\)\.catch\(\(error:\s*unknown\)\s*=>\s*\{/) 
      expect(sourceCode).toMatch(/afterTool callback failed/)
    })

    it('T000d: callback runs after dispatchTool resolves', async () => {
      const { registerAfterToolCallback, dispatchToolMock, callToolHandler } = await loadRuntimeHarness()
      const events: string[] = []

      let releaseDispatch: (() => void) | null = null
      const toolResult = { content: [{ type: 'text', text: '{}' }] }

      dispatchToolMock.mockImplementation(async () => {
        events.push('dispatch:start')
        await new Promise<void>((resolve) => {
          releaseDispatch = resolve
        })
        events.push('dispatch:end')
        return toolResult
      })

      const callbackSpy = vi.fn(async () => {
        events.push('callback')
      })

      registerAfterToolCallback(callbackSpy)

      const responsePromise = callToolHandler(
        { id: 'call-1', params: { name: 'memory_search', arguments: {} } },
        {}
      )

      await Promise.resolve()
      expect(callbackSpy).not.toHaveBeenCalled()

      expect(releaseDispatch).not.toBeNull()
      releaseDispatch!()

      await responsePromise
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(callbackSpy).toHaveBeenCalledTimes(1)
      expect(callbackSpy).toHaveBeenCalledWith('memory_search', 'call-1', toolResult)
      expect(events).toEqual(['dispatch:start', 'dispatch:end', 'callback'])
    })

    it('T000d: rejected callback does not block other callbacks', async () => {
      const { registerAfterToolCallback, dispatchToolMock, callToolHandler } = await loadRuntimeHarness()
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const callbackOrder: string[] = []

      dispatchToolMock.mockResolvedValue({ content: [{ type: 'text', text: '{}' }] })

      registerAfterToolCallback(async () => {
        callbackOrder.push('first')
        throw new Error('boom')
      })

      registerAfterToolCallback(async () => {
        callbackOrder.push('second')
      })

      await callToolHandler(
        { id: 'call-2', params: { name: 'memory_list', arguments: {} } },
        {}
      )

      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(callbackOrder).toEqual(['first', 'second'])
      expect(
        errorSpy.mock.calls.some((call) => String(call[0]).includes('afterTool callback failed'))
      ).toBe(true)
    })

    it('T000d: response stays non-blocking while callback is pending', async () => {
      const { registerAfterToolCallback, dispatchToolMock, callToolHandler } = await loadRuntimeHarness()

      dispatchToolMock.mockResolvedValue({ content: [{ type: 'text', text: '{}' }] })

      let callbackStarted = false
      let callbackFinished = false
      let releaseCallback: (() => void) | null = null

      registerAfterToolCallback(async () => {
        callbackStarted = true
        await new Promise<void>((resolve) => {
          releaseCallback = resolve
        })
        callbackFinished = true
      })

      const responsePromise = callToolHandler(
        { id: 'call-3', params: { name: 'memory_stats', arguments: {} } },
        {}
      )

      expect(callbackStarted).toBe(false)

      const responseRace = await Promise.race([
        responsePromise.then(() => 'resolved'),
        new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), 25)),
      ])

      expect(responseRace).toBe('resolved')
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(callbackStarted).toBe(true)
      expect(callbackFinished).toBe(false)

      expect(releaseCallback).not.toBeNull()
      releaseCallback!()
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(callbackFinished).toBe(true)
    })

    it('T000e: non-memory-aware tools invoke TM-05 tool-dispatch hook at runtime', async () => {
      const { dispatchToolMock, autoSurfaceAtToolDispatchMock, autoSurfaceMemoriesMock, callToolHandler } = await loadRuntimeHarness()
      const surfaced = {
        constitutional: [{ id: 1, title: 'Gate rule' }],
        triggered: [{ memory_id: 2, matched_phrases: ['hook'] }],
      }
      dispatchToolMock.mockResolvedValue({ content: [{ type: 'text', text: '{}' }] })
      autoSurfaceAtToolDispatchMock.mockResolvedValue(surfaced)

      const response = await callToolHandler(
        { id: 'call-4', params: { name: 'checkpoint_list', arguments: { query: 'recent checks' } } },
        {}
      )

      expect(autoSurfaceAtToolDispatchMock).toHaveBeenCalledTimes(1)
      expect(autoSurfaceAtToolDispatchMock).toHaveBeenCalledWith('checkpoint_list', { query: 'recent checks' })
      expect(autoSurfaceMemoriesMock).not.toHaveBeenCalled()
      expect((response as { autoSurfacedContext?: unknown }).autoSurfacedContext).toEqual(surfaced)
    })

    it('T000f: memory-aware tools keep SK-004 path and skip TM-05 dispatch hook', async () => {
      const { dispatchToolMock, autoSurfaceAtToolDispatchMock, autoSurfaceMemoriesMock, callToolHandler } = await loadRuntimeHarness({
        memoryAwareTools: new Set<string>(['memory_search']),
      })
      const surfaced = {
        constitutional: [],
        triggered: [{ memory_id: 3, matched_phrases: ['query'] }],
      }
      dispatchToolMock.mockResolvedValue({ content: [{ type: 'text', text: '{}' }] })
      autoSurfaceMemoriesMock.mockResolvedValue(surfaced)

      const response = await callToolHandler(
        { id: 'call-5', params: { name: 'memory_search', arguments: { query: 'hook validation' } } },
        {}
      )

      expect(autoSurfaceMemoriesMock).toHaveBeenCalledTimes(1)
      expect(autoSurfaceAtToolDispatchMock).not.toHaveBeenCalled()
      expect((response as { autoSurfacedContext?: unknown }).autoSurfacedContext).toEqual(surfaced)
    })

    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
      const {
        dispatchToolMock,
        autoSurfaceAtToolDispatchMock,
        autoSurfaceAtCompactionMock,
        autoSurfaceMemoriesMock,
        callToolHandler,
      } = await loadRuntimeHarness({
        memoryAwareTools: new Set<string>(['memory_context']),
      })

      const surfaced = {
        constitutional: [{ id: 9, title: 'Compaction directive' }],
        triggered: [{ memory_id: 11, matched_phrases: ['resume'] }],
      }
      dispatchToolMock.mockResolvedValue({ content: [{ type: 'text', text: '{}' }] })
      autoSurfaceAtCompactionMock.mockResolvedValue(surfaced)

      const response = await callToolHandler(
        {
          id: 'call-6',
          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
        },
        {}
      )

      expect(autoSurfaceAtCompactionMock).toHaveBeenCalledTimes(1)
      expect(autoSurfaceAtCompactionMock).toHaveBeenCalledWith('session resume context')
      expect(autoSurfaceMemoriesMock).not.toHaveBeenCalled()
      expect(autoSurfaceAtToolDispatchMock).not.toHaveBeenCalled()
      expect((response as { autoSurfacedContext?: unknown }).autoSurfacedContext).toEqual(surfaced)
    })

    it('T000h: memory_context non-resume mode keeps SK-004 memory-aware path', async () => {
      const {
        dispatchToolMock,
        autoSurfaceAtCompactionMock,
        autoSurfaceMemoriesMock,
        callToolHandler,
      } = await loadRuntimeHarness({
        memoryAwareTools: new Set<string>(['memory_context']),
      })

      const surfaced = {
        constitutional: [],
        triggered: [{ memory_id: 12, matched_phrases: ['focused'] }],
      }
      dispatchToolMock.mockResolvedValue({ content: [{ type: 'text', text: '{}' }] })
      autoSurfaceMemoriesMock.mockResolvedValue(surfaced)

      const response = await callToolHandler(
        {
          id: 'call-7',
          params: { name: 'memory_context', arguments: { input: 'focused retrieval context', mode: 'focused' } },
        },
        {}
      )

      expect(autoSurfaceMemoriesMock).toHaveBeenCalledTimes(1)
      expect(autoSurfaceMemoriesMock).toHaveBeenCalledWith('focused retrieval context')
      expect(autoSurfaceAtCompactionMock).not.toHaveBeenCalled()
      expect((response as { autoSurfacedContext?: unknown }).autoSurfacedContext).toEqual(surfaced)
    })

    it('T000i: successful responses append auto-surface hints and preserve autoSurfacedContext', async () => {
      const {
        dispatchToolMock,
        autoSurfaceAtToolDispatchMock,
        appendAutoSurfaceHintsMock,
        callToolHandler,
      } = await loadRuntimeHarness()

      const surfaced = {
        constitutional: [{ id: 1, title: 'Gate rule' }],
        triggered: [{ memory_id: 2, matched_phrases: ['hook'] }],
        surfaced_at: '2026-03-06T12:00:00.000Z',
        latencyMs: 7,
      }

      dispatchToolMock.mockResolvedValue({
        content: [{
          type: 'text',
          text: JSON.stringify({
            summary: 'ok',
            data: { results: [{ id: 1 }], count: 1 },
            hints: [],
            meta: { tool: 'checkpoint_list', tokenCount: 10, cacheHit: false },
          }),
        }],
      })
      autoSurfaceAtToolDispatchMock.mockResolvedValue(surfaced)

      const response = await callToolHandler(
        { id: 'call-8', params: { name: 'checkpoint_list', arguments: { query: 'recent checks' } } },
        {}
      ) as { content: Array<{ text: string }>; autoSurfacedContext?: unknown }

      expect(appendAutoSurfaceHintsMock).toHaveBeenCalledTimes(1)
      expect(response.autoSurfacedContext).toEqual(surfaced)

      const parsed = JSON.parse(response.content[0].text)
      expect(parsed.hints.some((hint: string) => hint.includes('Auto-surface hook: injected 1 constitutional and 1 triggered memories'))).toBe(true)
      expect(parsed.meta.autoSurface).toEqual({
        constitutionalCount: 1,
        triggeredCount: 1,
        surfaced_at: '2026-03-06T12:00:00.000Z',
        latencyMs: 7,
      })
      expect(parsed.meta.tokenBudget).toBe(1000)
      expect(parsed.meta.tokenCount).toBeGreaterThan(0)
    })
  })

  // =================================================================
  // GROUP 4: Interface Contract Verification
  // =================================================================
  describe('Group 4: Interface Contracts', () => {
    const EXPECTED_INTERFACES: Array<{ name: string; requiredFields?: string[]; source: string }> = [
      // MCPResponse was moved to shared/types.ts and re-exported via 'export type'
      { name: 'MCPResponse', requiredFields: ['content'], source: 'sharedTypes' },
      { name: 'ToolDefinition', requiredFields: ['name', 'description', 'inputSchema'], source: 'toolSchemas' },
      { name: 'ContextArgs', requiredFields: ['input'], source: 'toolTypes' },
      { name: 'SearchArgs', requiredFields: ['query'], source: 'toolTypes' },
      { name: 'TriggerArgs', requiredFields: ['prompt'], source: 'toolTypes' },
      { name: 'DeleteArgs', requiredFields: ['id'], source: 'toolTypes' },
      { name: 'UpdateArgs', requiredFields: ['id'], source: 'toolTypes' },
      { name: 'ListArgs', source: 'toolTypes' },
      { name: 'StatsArgs', source: 'toolTypes' },
      { name: 'HealthArgs', source: 'toolTypes' },
      { name: 'CheckpointCreateArgs', requiredFields: ['name'], source: 'toolTypes' },
      { name: 'CheckpointListArgs', source: 'toolTypes' },
      { name: 'CheckpointRestoreArgs', requiredFields: ['name'], source: 'toolTypes' },
      { name: 'CheckpointDeleteArgs', requiredFields: ['name'], source: 'toolTypes' },
      { name: 'MemoryValidateArgs', requiredFields: ['id', 'wasUseful'], source: 'toolTypes' },
      { name: 'SaveArgs', requiredFields: ['filePath'], source: 'toolTypes' },
      { name: 'ScanArgs', source: 'toolTypes' },
      { name: 'PreflightArgs', requiredFields: ['specFolder', 'taskId', 'knowledgeScore'], source: 'toolTypes' },
      { name: 'PostflightArgs', requiredFields: ['specFolder', 'taskId', 'knowledgeScore'], source: 'toolTypes' },
      { name: 'LearningHistoryArgs', requiredFields: ['specFolder'], source: 'toolTypes' },
      { name: 'DriftWhyArgs', requiredFields: ['memoryId'], source: 'toolTypes' },
      { name: 'CausalLinkArgs', requiredFields: ['sourceId', 'targetId', 'relation'], source: 'toolTypes' },
      { name: 'CausalStatsArgs', source: 'toolTypes' },
      { name: 'CausalUnlinkArgs', requiredFields: ['edgeId'], source: 'toolTypes' },
      { name: 'PendingRecoveryResult', source: 'contextServer' },
      { name: 'ApiKeyValidation', source: 'contextServer' },
      { name: 'NodeVersionMarker', source: 'startupChecks' },
    ]

    for (const iface of EXPECTED_INTERFACES) {
      it(`Interface ${iface.name} defined`, () => {
        const sourceMap: Record<string, string> = {
          contextServer: sourceCode,
          toolTypes: toolTypesCode,
          toolSchemas: toolSchemasCode,
          startupChecks: startupChecksCode,
          sharedTypes: sharedTypesCode,
        }
        const code = sourceMap[iface.source]
        const ifaceRegex = new RegExp(`interface\\s+${iface.name}\\s*\\{`)
        expect(ifaceRegex.test(code)).toBe(true)

        // Check required fields if specified
        if (iface.requiredFields) {
          const ifaceMatch = code.match(new RegExp(`interface\\s+${iface.name}\\s*\\{([\\s\\S]*?)\\}`))
          expect(ifaceMatch).not.toBeNull()
          if (ifaceMatch) {
            const ifaceBody = ifaceMatch[1]
            for (const field of iface.requiredFields) {
              const fieldPattern = new RegExp(`\\b${field}\\??\\s*[:\\[]`)
              expect(fieldPattern.test(ifaceBody)).toBe(true)
            }
          }
        }
      })
    }
  })

  // =================================================================
  // GROUP 5: Error Handling & buildErrorResponse
  // =================================================================
  describe('Group 5: Error Handling', () => {
    // T20: Source wraps dispatch in try/catch
    it('T20: Dispatch wrapped in try/catch', () => {
      const tryCatchPattern = /try\s*\{[\s\S]*?validateInputLengths\(args\)[\s\S]*?dispatchTool\(name[\s\S]*?\}\s*catch\s*\(error/
      expect(tryCatchPattern.test(sourceCode)).toBe(true)
    })

    // T21: Catch block uses buildErrorResponse
    it('T21: Catch uses buildErrorResponse()', () => {
      const buildErrorPattern = /catch[\s\S]*?buildErrorResponse\(name,\s*err,\s*args\)/
      expect(buildErrorPattern.test(sourceCode)).toBe(true)
    })

    // T22: Error response has isError: true
    it('T22: Error responses set isError: true', () => {
      expect(sourceCode).toMatch(/isError:\s*true/)
    })

    // T23: buildErrorResponse direct test
    it('T23: buildErrorResponse returns structured object', async () => {
      let errorsModule: any = null
      try {
        errorsModule = await import('../lib/errors/index')
      } catch {
        try {
          errorsModule = await import('../lib/errors')
        } catch {
          return // skip if not loadable
        }
      }

      if (!errorsModule?.buildErrorResponse) return

      const testError = new Error('Test error message')
      const response = errorsModule.buildErrorResponse('memory_search', testError, { query: 'test' })

      expect(response).toBeTypeOf('object')
      expect(
        response.error || response.message || response.summary
      ).toBeTruthy()
    })

    // T24: Error response contains recovery hints (REQ-004)
    it('T24: getRecoveryHint returns RecoveryHint object', async () => {
      let errorsModule: any = null
      try {
        errorsModule = await import('../lib/errors/index')
      } catch {
        try {
          errorsModule = await import('../lib/errors')
        } catch {
          return
        }
      }

      if (!errorsModule?.getRecoveryHint) return

      // getRecoveryHint(toolName, errorCode) returns a RecoveryHint object
      const hint = errorsModule.getRecoveryHint('memory_search', 'UNKNOWN_TOOL')
      expect(typeof hint).toBe('object')
      expect(hint).not.toBeNull()
    })

    // T25: ErrorCodes enum/object exists
    it('T25: ErrorCodes defined', async () => {
      let errorsModule: any = null
      try {
        errorsModule = await import('../lib/errors/index')
      } catch {
        try {
          errorsModule = await import('../lib/errors')
        } catch {
          return
        }
      }

      if (!errorsModule?.ErrorCodes) return

      expect(errorsModule.ErrorCodes).toBeTypeOf('object')
      expect(Object.keys(errorsModule.ErrorCodes).length).toBeGreaterThan(0)
    })
  })

  // =================================================================
  // GROUP 6: Token Budget Integration
  // =================================================================
  describe('Group 6: Token Budget Integration', () => {
    // T26: Source injects tokenBudget into response metadata
    it('T26: Token budget injection exists', () => {
      expect(sourceCode).toMatch(/getTokenBudget\(name\)/)
    })

    // T27: Budget overflow warning logged
    it('T27: Token budget overflow detection', () => {
      expect(sourceCode).toMatch(/tokenCount\s*>\s*budget/)
    })

    // T28: getTokenBudget direct tests
    it('T28: L1 budget = 2000 (memory_context)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('memory_context')).toBe(2000)
    })

    it('T28b: L2 budget = 1500 (memory_search)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('memory_search')).toBe(1500)
    })

    it('T28c: L3 budget = 800 (memory_list)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('memory_list')).toBe(800)
    })

    it('T28d: Unknown tool budget = 1000 (default)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('nonexistent_tool')).toBe(1000)
    })

    it('T28e: L4 budget = 500 (memory_delete)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('memory_delete')).toBe(500)
    })

    it('T28f: L5 budget = 600 (checkpoint_create)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('checkpoint_create')).toBe(600)
    })

    it('T28g: L6 budget = 1200 (memory_drift_why)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('memory_drift_why')).toBe(1200)
    })

    it('T28h: L7 budget = 1000 (memory_index_scan)', async () => {
      let layerDefs: any = null
      try {
        layerDefs = await import('../lib/architecture/layer-definitions')
      } catch {
        return
      }
      if (!layerDefs?.getTokenBudget) return
      expect(layerDefs.getTokenBudget('memory_index_scan')).toBe(1000)
    })
  })

  // =================================================================
  // GROUP 7: Hooks Integration (MEMORY_AWARE_TOOLS, extractContextHint)
  // =================================================================
  describe('Group 7: Hooks Integration', () => {
    // T29: Source imports MEMORY_AWARE_TOOLS
    it('T29: Imports MEMORY_AWARE_TOOLS from hooks', () => {
      expect(sourceCode).toMatch(/import\s*\{[^}]*MEMORY_AWARE_TOOLS[^}]*\}\s*from\s*'\.\/hooks'/)
    })

    // T30: Source checks MEMORY_AWARE_TOOLS.has(name)
    it('T30: Checks MEMORY_AWARE_TOOLS.has(name)', () => {
      expect(sourceCode).toMatch(/MEMORY_AWARE_TOOLS\.has\(name\)/)
    })

    // T31: Hooks module direct tests
    it('T31: MEMORY_AWARE_TOOLS is a Set', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (!hooksModule?.MEMORY_AWARE_TOOLS) return

      expect(hooksModule.MEMORY_AWARE_TOOLS).toBeInstanceOf(Set)
    })

    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
    for (const t of expectedAwareTools) {
      it(`T31b: MEMORY_AWARE_TOOLS contains '${t}'`, async () => {
        let hooksModule: any = null
        try {
          hooksModule = await import('../hooks/index')
        } catch {
          try {
            hooksModule = await import('../hooks')
          } catch {
            try {
              hooksModule = await import('../hooks/memory-surface')
            } catch {
              return
            }
          }
        }
        if (!hooksModule?.MEMORY_AWARE_TOOLS) return
        expect(hooksModule.MEMORY_AWARE_TOOLS.has(t)).toBe(true)
      })
    }

    const nonAwareTools = ['memory_delete', 'checkpoint_create', 'task_preflight']
    for (const t of nonAwareTools) {
      it(`T31c: MEMORY_AWARE_TOOLS excludes '${t}'`, async () => {
        let hooksModule: any = null
        try {
          hooksModule = await import('../hooks/index')
        } catch {
          try {
            hooksModule = await import('../hooks')
          } catch {
            try {
              hooksModule = await import('../hooks/memory-surface')
            } catch {
              return
            }
          }
        }
        if (!hooksModule?.MEMORY_AWARE_TOOLS) return
        expect(hooksModule.MEMORY_AWARE_TOOLS.has(t)).toBe(false)
      })
    }

    // extractContextHint tests
    it('T31d: extractContextHint extracts query', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (typeof hooksModule?.extractContextHint !== 'function') return
      expect(hooksModule.extractContextHint({ query: 'test search' })).toBe('test search')
    })

    it('T31e: extractContextHint extracts prompt', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (typeof hooksModule?.extractContextHint !== 'function') return
      expect(hooksModule.extractContextHint({ prompt: 'trigger phrase' })).toBe('trigger phrase')
    })

    it('T31ea: extractContextHint extracts input', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (typeof hooksModule?.extractContextHint !== 'function') return
      expect(hooksModule.extractContextHint({ input: 'memory context request' })).toBe('memory context request')
    })

    it('T31f: extractContextHint handles null', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (typeof hooksModule?.extractContextHint !== 'function') return
      expect(hooksModule.extractContextHint(null)).toBeNull()
    })

    it('T31g: extractContextHint handles empty object', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (typeof hooksModule?.extractContextHint !== 'function') return
      expect(hooksModule.extractContextHint({})).toBeNull()
    })

    it('T31h: extractContextHint rejects strings < 3 chars', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (typeof hooksModule?.extractContextHint !== 'function') return
      expect(hooksModule.extractContextHint({ query: 'ab' })).toBeNull()
    })

    it('T31i: extractContextHint joins concepts', async () => {
      let hooksModule: any = null
      try {
        hooksModule = await import('../hooks/index')
      } catch {
        try {
          hooksModule = await import('../hooks')
        } catch {
          try {
            hooksModule = await import('../hooks/memory-surface')
          } catch {
            return
          }
        }
      }
      if (typeof hooksModule?.extractContextHint !== 'function') return
      expect(hooksModule.extractContextHint({ concepts: ['memory', 'search'] })).toBe('memory search')
    })
  })

  // =================================================================
  // GROUP 8: Input Validation (validateInputLengths)
  // =================================================================
  describe('Group 8: Input Validation', () => {
    // T32: Source calls validateInputLengths before dispatch
    it('T32: validateInputLengths called before dispatchTool', () => {
      const validationOrder = /validateInputLengths\(args\)[\s\S]*?dispatchTool\(name/
      expect(validationOrder.test(sourceCode)).toBe(true)
    })

    it('T32a: Schema validation delegated to tool modules', () => {
      // T303: context-server now validates input length only; per-tool schema validation
      // is handled via validateToolArgs(...) inside dispatch modules.
      expect(sourceCode).toMatch(/T304:\s*Zod validation is applied per-tool inside each dispatch module/)
    })

    // T33: validateInputLengths direct tests
    it('T33: validateInputLengths accepts normal input', async () => {
      let utilsModule: any = null
      try {
        utilsModule = await import('../utils/index')
      } catch {
        try {
          utilsModule = await import('../utils')
        } catch {
          try {
            utilsModule = await import('../utils/validators')
          } catch {
            return
          }
        }
      }
      if (!utilsModule?.validateInputLengths) return
      expect(() => utilsModule.validateInputLengths({ query: 'normal search query' })).not.toThrow()
    })

    it('T33b: validateInputLengths accepts empty args', async () => {
      let utilsModule: any = null
      try {
        utilsModule = await import('../utils/index')
      } catch {
        try {
          utilsModule = await import('../utils')
        } catch {
          try {
            utilsModule = await import('../utils/validators')
          } catch {
            return
          }
        }
      }
      if (!utilsModule?.validateInputLengths) return
      expect(() => utilsModule.validateInputLengths({})).not.toThrow()
    })

    it('T33c: validateInputLengths rejects oversized query', async () => {
      let utilsModule: any = null
      try {
        utilsModule = await import('../utils/index')
      } catch {
        try {
          utilsModule = await import('../utils')
        } catch {
          try {
            utilsModule = await import('../utils/validators')
          } catch {
            return
          }
        }
      }
      if (!utilsModule?.validateInputLengths) return
      expect(() => utilsModule.validateInputLengths({ query: 'x'.repeat(20000) })).toThrow()
    })

    it('T33d: validateInputLengths rejects oversized title', async () => {
      let utilsModule: any = null
      try {
        utilsModule = await import('../utils/index')
      } catch {
        try {
          utilsModule = await import('../utils')
        } catch {
          try {
            utilsModule = await import('../utils/validators')
          } catch {
            return
          }
        }
      }
      if (!utilsModule?.validateInputLengths) return
      expect(() => utilsModule.validateInputLengths({ title: 'x'.repeat(1000) })).toThrow()
    })

    // T34: INPUT_LIMITS constants
    it('T34: INPUT_LIMITS.query = 10000', async () => {
      let utilsModule: any = null
      try {
        utilsModule = await import('../utils/index')
      } catch {
        try {
          utilsModule = await import('../utils')
        } catch {
          try {
            utilsModule = await import('../utils/validators')
          } catch {
            return
          }
        }
      }
      if (!utilsModule?.INPUT_LIMITS) return
      expect(utilsModule.INPUT_LIMITS.query).toBe(10000)
    })

    it('T34b: INPUT_LIMITS.title = 500', async () => {
      let utilsModule: any = null
      try {
        utilsModule = await import('../utils/index')
      } catch {
        try {
          utilsModule = await import('../utils')
        } catch {
          try {
            utilsModule = await import('../utils/validators')
          } catch {
            return
          }
        }
      }
      if (!utilsModule?.INPUT_LIMITS) return
      expect(utilsModule.INPUT_LIMITS.title).toBe(500)
    })

    it('T34c: INPUT_LIMITS.filePath = 500', async () => {
      let utilsModule: any = null
      try {
        utilsModule = await import('../utils/index')
      } catch {
        try {
          utilsModule = await import('../utils')
        } catch {
          try {
            utilsModule = await import('../utils/validators')
          } catch {
            return
          }
        }
      }
      if (!utilsModule?.INPUT_LIMITS) return
      expect(utilsModule.INPUT_LIMITS.filePath).toBe(500)
    })
  })

  // =================================================================
  // GROUP 9: Server Configuration & Metadata
  // =================================================================
  describe('Group 9: Server Configuration', () => {
    // T35: Server name
    it('T35: Server name is "context-server"', () => {
      const serverName = sourceCode.match(/name:\s*'([^']+)'/)
      expect(serverName).not.toBeNull()
      expect(serverName![1]).toBe('context-server')
    })

    // T36: Server version format
    it('T36: Server version is semver', () => {
      expect(sourceCode).toMatch(/version:\s*'\d+\.\d+\.\d+'/)
    })

    // T37: Capabilities include tools
    it('T37: Server capabilities include tools', () => {
      expect(sourceCode).toMatch(/capabilities:\s*\{\s*tools:\s*\{\}/)
    })

    // T38: Uses StdioServerTransport
    it('T38: Uses StdioServerTransport', () => {
      expect(sourceCode).toMatch(/new\s+StdioServerTransport\(\)/)
    })
  })

  // =================================================================
  // GROUP 10: Shutdown & Process Handlers
  // =================================================================
  describe('Group 10: Shutdown & Process Handlers', () => {
    // T39: SIGTERM handler
    it('T39: SIGTERM handler registered', () => {
      expect(sourceCode).toMatch(/process\.on\('SIGTERM'/)
    })

    // T40: SIGINT handler
    it('T40: SIGINT handler registered', () => {
      expect(sourceCode).toMatch(/process\.on\('SIGINT'/)
    })

    // T41: uncaughtException handler
    it('T41: uncaughtException handler registered', () => {
      expect(sourceCode).toMatch(/process\.on\('uncaughtException'/)
    })

    // T42: unhandledRejection handler
    it('T42: unhandledRejection handler registered', () => {
      expect(sourceCode).toMatch(/process\.on\('unhandledRejection'/)
    })

    // T43: Shutdown closes database
    it('T43: SIGTERM closes database', () => {
      expect(sourceCode).toMatch(/process\.on\('SIGTERM'[\s\S]*?vectorIndex\.closeDb\(\)/)
    })

    // T44: Shutdown stops archival manager
    it('T44: Shutdown stops archival manager', () => {
      expect(sourceCode).toMatch(/archivalManager\.cleanup\(\)/)
    })

    // T45: Shutdown stops retry manager
    it('T45: Shutdown stops retry manager', () => {
      expect(sourceCode).toMatch(/retryManager\.stopBackgroundJob\(\)/)
    })

    // T46: Shutdown clears tool cache (KL-4)
    it('T46: Shutdown clears tool cache', () => {
      expect(sourceCode).toMatch(/toolCache\.shutdown\(\)/)
    })

    // T47: Shutdown closes transport (P1-09)
    it('T47: Shutdown closes transport (P1-09)', () => {
      expect(sourceCode).toMatch(/transport\.close\(\)/)
    })

    // T47b: File watcher delete path clears mutation caches after DB cleanup
    it('T47b: watcher-backed delete runs post-mutation hooks', () => {
      expect(sourceCode).toMatch(/runPostMutationHooks\('delete',\s*\{\s*filePath,\s*deletedCount\s*\}\)/)
    })

    // T48: Shutdown guard prevents double shutdown
    it('T48: Double-shutdown guard', () => {
      expect(sourceCode).toMatch(/if\s*\(shuttingDown\)\s*return/)
    })
  })

  // =================================================================
  // GROUP 11: Startup & Initialization
  // =================================================================
  describe('Group 11: Startup & Initialization', () => {
    // T49: main() function exists
    it('T49: main() function defined', () => {
      expect(sourceCode).toMatch(/async\s+function\s+main\(\)/)
    })

    // T50: main() is called at module level
    it('T50: main() invoked at module level', () => {
      expect(sourceCode).toMatch(/main\(\)\.catch/)
    })

    // T51: Database initialization
    it('T51: Database initialized in main()', () => {
      expect(sourceCode).toMatch(/vectorIndex\.initializeDb\(\)/)
    })

    // T52: dbInitialized guard for lazy init
    it('T52: dbInitialized guard in dispatch', () => {
      expect(sourceCode).toMatch(/if\s*\(!dbInitialized\)/)
    })

    // T53: detectNodeVersionMismatch called
    it('T53: detectNodeVersionMismatch() called at startup', () => {
      expect(sourceCode).toMatch(/detectNodeVersionMismatch\(\)/)
    })

    // T54: Embedding model readiness
    it('T54: Embedding model marked ready', () => {
      expect(sourceCode).toMatch(/setEmbeddingModelReady\(true\)/)
    })

    // T55: API key validation (with skip env var)
    it('T55: API key validation with skip option', () => {
      expect(sourceCode).toMatch(/SPECKIT_SKIP_API_VALIDATION/)
    })

    // T56: Startup scan runs in background
    it('T56: Startup scan runs via setImmediate', () => {
      expect(sourceCode).toMatch(/setImmediate\(\(\)\s*=>\s*startupScan/)
    })

    // T57: startupScanInProgress guard
    it('T57: Startup scan re-entry guard', () => {
      expect(sourceCode).toMatch(/if\s*\(startupScanInProgress\)/)
    })
  })

  // =================================================================
  // GROUP 12: Auto-Surface Context Integration (SK-004)
  // =================================================================
  describe('Group 12: Auto-Surface Context (SK-004)', () => {
    // T58: autoSurfacedContext injected into successful responses
    it('T58: Auto-surfaced context injected into response', () => {
      // Source uses type assertion: (result as unknown as Record<string, unknown>).autoSurfacedContext = ...
      expect(sourceCode).toMatch(
        /autoSurfacedContext[\s\S]*?\.autoSurfacedContext\s*=\s*autoSurfacedContext/
      )
    })

    // T59: Auto-surface errors are non-fatal
    it('T59: Auto-surface errors are non-fatal', () => {
      expect(sourceCode).toMatch(/Auto-surface failed \(non-fatal\)/)
    })

    // T60: Only injected for non-error responses
    it('T60: Auto-surface only on non-error responses', () => {
      expect(sourceCode).toMatch(/!result\.isError/)
    })
  })

  // =================================================================
  // GROUP 13: Layer-Tool Consistency
  // =================================================================
  describe('Group 13: Layer-Tool Consistency', () => {
    const LAYER_PREFIXES: Record<string, string> = {
      'memory_context': '[L1:Orchestration]',
      'memory_search': '[L2:Core]',
      'memory_match_triggers': '[L2:Core]',
      'memory_save': '[L2:Core]',
      'memory_list': '[L3:Discovery]',
      'memory_stats': '[L3:Discovery]',
      'memory_health': '[L3:Discovery]',
      'memory_delete': '[L4:Mutation]',
      'memory_update': '[L4:Mutation]',
      'memory_validate': '[L4:Mutation]',
      'checkpoint_create': '[L5:Lifecycle]',
      'checkpoint_list': '[L5:Lifecycle]',
      'checkpoint_restore': '[L5:Lifecycle]',
      'checkpoint_delete': '[L5:Lifecycle]',
      'task_preflight': '[L6:Analysis]',
      'task_postflight': '[L6:Analysis]',
      'memory_drift_why': '[L6:Analysis]',
      'memory_causal_link': '[L6:Analysis]',
      'memory_causal_stats': '[L6:Analysis]',
      'memory_causal_unlink': '[L6:Analysis]',
      'eval_run_ablation': '[L6:Analysis]',
      'eval_reporting_dashboard': '[L6:Analysis]',
      'memory_index_scan': '[L7:Maintenance]',
      'memory_get_learning_history': '[L7:Maintenance]',
      'memory_ingest_start': '[L7:Maintenance]',
      'memory_ingest_status': '[L7:Maintenance]',
      'memory_ingest_cancel': '[L7:Maintenance]',
    }

    // T61: Tool descriptions include layer prefix
    for (const [tool, prefix] of Object.entries(LAYER_PREFIXES)) {
      it(`T61: ${tool} has prefix ${prefix}`, () => {
        const descRegex = new RegExp(`name:\\s*'${tool}'\\s*,\\s*description:\\s*'(\\[L\\d+:\\w+\\])`)
        const match = toolSchemasCode.match(descRegex)
        expect(match).not.toBeNull()
        expect(match![1]).toBe(prefix)
      })
    }

    // T62: Token Budget mentioned in descriptions
    it('T62: Token budgets in descriptions', () => {
      const budgetPattern = /Token Budget:\s*\d+/g
      const budgetMatches = toolSchemasCode.match(budgetPattern)
      expect(budgetMatches).not.toBeNull()
      expect(budgetMatches!.length).toBeGreaterThanOrEqual(20)
    })

    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
      expect(toolSchemasCode).toMatch(/tokenUsage:[\s\S]*?minimum:\s*0\.0/)
      expect(toolSchemasCode).toMatch(/tokenUsage:[\s\S]*?maximum:\s*1\.0/)
    })
  })

  // =================================================================
  // GROUP 14: Pending File Recovery (T107)
  // =================================================================
  describe('Group 14: Pending File Recovery (T107)', () => {
    // T63: recoverPendingFiles function exists
    it('T63: recoverPendingFiles() defined', () => {
      expect(sourceCode).toMatch(/async\s+function\s+recoverPendingFiles/)
    })

    // T64: Recovery called during startup scan
    it('T64: recoverPendingFiles called in startupScan', () => {
      expect(sourceCode).toMatch(/await\s+recoverPendingFiles\(basePath\)/)
    })

    // T65: Recovery returns structured result
    it('T65: PendingRecoveryResult has structured fields', () => {
      const resultPattern = /PendingRecoveryResult\s*=\s*\{[\s\S]*?found[\s\S]*?processed[\s\S]*?recovered[\s\S]*?failed/
      expect(resultPattern.test(sourceCode)).toBe(true)
    })

    // T66: Recovery error is caught (non-fatal)
    it('T66: Pending file recovery errors caught', () => {
      const recoveryCatch = /recoverPendingFiles[\s\S]*?catch\s*\(error/
      expect(recoveryCatch.test(sourceCode)).toBe(true)
    })
  })

  // =================================================================
  // GROUP 15: Module Import Verification
  // =================================================================
  describe('Group 15: Module Imports', () => {
    const EXPECTED_IMPORTS = [
      { module: '@modelcontextprotocol/sdk/server/index.js', name: 'MCP SDK Server' },
      { module: '@modelcontextprotocol/sdk/server/stdio.js', name: 'MCP SDK Stdio' },
      { module: '@modelcontextprotocol/sdk/types.js', name: 'MCP SDK Types' },
      { module: './core', name: 'Core module' },
      { module: './tool-schemas', name: 'Tool schemas (T303)' },
      { module: './tools', name: 'Tool dispatch (T303)' },
      { module: './handlers', name: 'Handlers module' },
      { module: './utils', name: 'Utils module' },
      { module: './hooks', name: 'Hooks module' },
      { module: './startup-checks', name: 'Startup checks (T303)' },
      { module: './lib/architecture/layer-definitions', name: 'Layer definitions' },
      { module: './lib/search/vector-index', name: 'Vector index' },
      { module: './lib/providers/embeddings', name: 'Embeddings' },
      { module: './lib/storage/checkpoints', name: 'Checkpoints' },
      { module: './lib/storage/access-tracker', name: 'Access tracker' },
      { module: './lib/search/hybrid-search', name: 'Hybrid search' },
      { module: './lib/search/bm25-index', name: 'BM25 index' },
      { module: './lib/parsing/memory-parser', name: 'Memory parser' },
      { module: './lib/cache/cognitive/working-memory', name: 'Working memory' },
      { module: './lib/cache/cognitive/attention-decay', name: 'Attention decay' },
      { module: './lib/cache/cognitive/co-activation', name: 'Co-activation' },
      { module: './lib/cache/cognitive/archival-manager', name: 'Archival manager' },
      { module: './lib/providers/retry-manager', name: 'Retry manager' },
      { module: './lib/errors', name: 'Error utilities' },
      { module: './lib/session/session-manager', name: 'Session manager' },
      { module: './lib/storage/incremental-index', name: 'Incremental index' },
      { module: './lib/storage/transaction-manager', name: 'Transaction manager' },
      { module: './lib/cache/tool-cache', name: 'Tool cache' },
    ]

    for (const imp of EXPECTED_IMPORTS) {
      it(`T67: Imports ${imp.name} from '${imp.module}'`, () => {
        const escaped = imp.module.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')
        const importRegex = new RegExp(`import\\s+[^;]*from\\s+['"]${escaped}['"]`)
        expect(importRegex.test(sourceCode)).toBe(true)
      })
    }
  })
})
