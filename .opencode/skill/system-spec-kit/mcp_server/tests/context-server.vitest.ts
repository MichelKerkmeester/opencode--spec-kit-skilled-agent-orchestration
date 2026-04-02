// ───────────────────────────────────────────────────────────────
// 1. CONTEXT SERVER TESTS
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest'
import fs from 'fs'
import path from 'path'
import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate'
import {
  appendAutoSurfaceHints as actualAppendAutoSurfaceHints,
  syncEnvelopeTokenCount as actualSyncEnvelopeTokenCount,
  serializeEnvelopeWithTokenCount as actualSerializeEnvelopeWithTokenCount,
} from '../hooks/response-hints'

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

type ErrorResponse = {
  error?: unknown
  message?: unknown
  summary?: unknown
}

type ErrorsModule = {
  buildErrorResponse?: (toolName: string, error: Error, args?: Record<string, unknown>) => ErrorResponse
  getRecoveryHint?: (toolName: string, errorCode: string) => unknown
  ErrorCodes?: Record<string, string>
}

type LayerDefinitionsModule = {
  getTokenBudget?: (toolName: string) => number
}

type HooksModule = {
  MEMORY_AWARE_TOOLS?: Set<string>
  extractContextHint?: (args: unknown) => string | null
}

type UtilsModule = {
  validateInputLengths?: (args: Record<string, unknown>) => void
  INPUT_LIMITS?: Record<string, number>
}

async function importFirst<T>(loaders: Array<() => Promise<unknown>>): Promise<T | null> {
  for (const load of loaders) {
    try {
      return await load() as T
    } catch {
      // Continue until one module variant loads successfully.
    }
  }

  return null
}

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
      expect((extraResult as unknown as { unexpectedField: boolean }).unexpectedField).toBe(true)
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
  describe('Group 2: Tool Definitions (43 tools)', () => {
    const EXPECTED_TOOLS = [
      'memory_context',
      'memory_search',
      'memory_quick_search',
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
      'shared_space_upsert',
      'shared_space_membership_set',
      'shared_memory_status',
      'shared_memory_enable',
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
      'code_graph_scan',
      'code_graph_query',
      'code_graph_status',
      'code_graph_context',
      'ccc_status',
      'ccc_reindex',
      'ccc_feedback',
      'session_health',
      'session_resume',
      'session_bootstrap',
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
      }).filter((name): name is string => name !== null)
      expect(sectionToolNames.length).toBe(EXPECTED_TOOLS.length)
    })

    // T12: Each expected tool exists
    for (const tool of EXPECTED_TOOLS) {
      it(`T12: Tool defined: ${tool}`, () => {
        const sectionToolNames = (toolSchemasCode.match(/name:\s*'(\w+)'/g) || []).map((m: string) => {
          const match = m.match(/name:\s*'(\w+)'/)
          return match ? match[1] : null
        }).filter((name): name is string => name !== null)
        expect(sectionToolNames).toContain(tool)
      })
    }

    // T13: No unexpected tools (only expected ones exist)
    it('T13: No unexpected tools', () => {
      const sectionToolNames = (toolSchemasCode.match(/name:\s*'(\w+)'/g) || []).map((m: string) => {
        const match = m.match(/name:\s*'(\w+)'/)
        return match ? match[1] : null
      }).filter((name): name is string => name !== null)
      const unexpected = sectionToolNames.filter((toolName) => !EXPECTED_TOOLS.includes(toolName))
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
      expect(sourceCode).toMatch(
        /initScoringObservability\s*}\s*from\s*['"]\.\/lib\/telemetry\/scoring-observability\.js['"]/
      )
    })

    it('T15c: context-server initializes scoring observability at startup', () => {
      expect(sourceCode).toMatch(/initScoringObservability\(database\)/)
    })
  })

  describe('Graph path hardening', () => {
    it('rejects graph enrichment paths outside the workspace root', () => {
      expect(sourceCode).toContain("const workspaceRoot = path.resolve(process.cwd())")
      expect(sourceCode).toContain("const relativeToWorkspace = path.relative(workspaceRoot, normalized)")
      expect(sourceCode).toMatch(/relativeToWorkspace\.startsWith\('\.\.'\)/)
      expect(sourceCode).toMatch(/path\.isAbsolute\(relativeToWorkspace\)/)
    })

    it('exports graph path helpers for focused tests', () => {
      expect(sourceCode).toContain('normalizeGraphFilePath,')
      expect(sourceCode).toContain('extractFilePathsFromToolArgs,')
    })
  })

  // =================================================================
  // GROUP 3: Tool Dispatch Coverage (T303: dispatchTool replaces switch)
  // =================================================================
  describe('Group 3: Tool Dispatch Coverage', () => {
    const EXPECTED_CASES = [
      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
      'memory_delete', 'memory_update', 'memory_bulk_delete', 'memory_list', 'memory_stats',
      'checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete',
      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
      'task_preflight', 'task_postflight', 'memory_get_learning_history',
      'memory_ingest_start', 'memory_ingest_status', 'memory_ingest_cancel',
      'memory_drift_why', 'memory_causal_link', 'memory_causal_stats', 'memory_causal_unlink',
      'eval_run_ablation', 'eval_reporting_dashboard',
      'shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status', 'shared_memory_enable',
      'code_graph_scan', 'code_graph_query', 'code_graph_status', 'code_graph_context',
      'ccc_status', 'ccc_reindex', 'ccc_feedback',
      'session_health', 'session_resume',
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
      expect(sourceCode).toMatch(/import\s+\{[^}]*dispatchTool[^}]*\}\s*from\s+['"]\.\/tools\/index\.js['"]/)
    })

    it('T16d: only session_health is excluded from tool-call tracking', () => {
      expect(sourceCode).toMatch(/if \(name !== 'session_health'\) \{/)
      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
    })

    it('T16e: session tracking falls back to CODEX_THREAD_ID when request session ids are absent', () => {
      expect(sourceCode).toMatch(/function\s+resolveSessionTrackingId\s*\(/)
      expect(sourceCode).toMatch(/process\.env\.CODEX_THREAD_ID/)
      expect(sourceCode).toMatch(/return explicitSessionId \?\? transportSessionId \?\? codexThreadId \?\? undefined;/)
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
      '../hooks/memory-surface',
      '../lib/architecture/layer-definitions',
      '../startup-checks',
      '../lib/search/vector-index',
      '../lib/providers/embeddings',
      '../lib/search/graph-flags',
      '../lib/search/search-flags',
      '../lib/search/graph-search-fn',
      '../lib/search/session-boost',
      '../lib/search/causal-boost',
      '../lib/storage/checkpoints',
      '../lib/storage/access-tracker',
      '../lib/search/hybrid-search',
      '../lib/search/bm25-index',
      '../lib/parsing/memory-parser',
      '../lib/cognitive/working-memory',
      '../lib/cognitive/attention-decay',
      '../lib/cognitive/co-activation',
      '../lib/cognitive/archival-manager',
      '../lib/providers/retry-manager',
      '../lib/session/session-manager',
      '../lib/session/context-metrics',
      '../lib/feedback/shadow-evaluation-runtime',
      '../lib/feedback/batch-learning',
      '../lib/storage/incremental-index',
      '../lib/storage/learned-triggers-schema',
      '../lib/storage/transaction-manager',
      '../lib/cache/tool-cache',
      '../lib/search/learned-feedback',
      '../lib/extraction/extraction-adapter',
      '../lib/ops/job-queue',
      '../lib/search/folder-discovery',
      '../lib/ops/file-watcher',
      '../lib/telemetry/scoring-observability',
      '../lib/errors',
      '../lib/utils/canonical-path',
      '../lib/utils/cleanup-helpers',
      '../lib/code-graph/code-graph-db',
      '../lib/storage/history',
      '../handlers/memory-index-discovery',
      '../handlers/mutation-hooks',
      '../lib/response/envelope',
      '../lib/search/local-reranker',
      '@spec-kit/shared/embeddings/factory',
    ] as const

    type RuntimeHarness = {
      registerAfterToolCallback: (fn: (tool: string, callId: string, result: unknown) => Promise<void>) => void
      testables?: {
        runCleanupStep: (label: string, cleanupFn: () => void) => void
        runAsyncCleanupStep: (label: string, cleanupFn: () => Promise<void>) => Promise<void>
      }
      dispatchToolMock: ReturnType<typeof vi.fn>
      autoSurfaceMemoriesMock: ReturnType<typeof vi.fn>
      autoSurfaceAtToolDispatchMock: ReturnType<typeof vi.fn>
      autoSurfaceAtCompactionMock: ReturnType<typeof vi.fn>
      appendAutoSurfaceHintsMock: ReturnType<typeof vi.fn>
      setInstructionsMock: ReturnType<typeof vi.fn>
      handleMemoryStatsMock: ReturnType<typeof vi.fn>
      processExitSpy: ReturnType<typeof vi.fn>
      registeredProcessHandlers: Map<string, Array<(...args: any[]) => unknown>>
      retryManagerStopBackgroundJobMock: ReturnType<typeof vi.fn>
      checkDatabaseUpdatedMock: ReturnType<typeof vi.fn>
      toolCacheClearMock: ReturnType<typeof vi.fn>
      toolCacheShutdownMock: ReturnType<typeof vi.fn>
      triggerMatcherClearMock: ReturnType<typeof vi.fn>
      transportCloseMock: ReturnType<typeof vi.fn>
      fileWatcherCloseMock: ReturnType<typeof vi.fn>
      callToolHandler: (request: unknown, extra: unknown) => Promise<unknown>
    }

    async function loadRuntimeHarness(options?: {
      memoryAwareTools?: Set<string>
      dimValidation?: { valid: boolean; stored?: number | null; current?: number | null; warning?: string }
      dynamicInit?: 'true' | 'false'
      bm25Enabled?: boolean
      degreeBoostEnabled?: boolean
      graphUnifiedEnabled?: boolean
      fileWatcherEnabled?: boolean
      watchPaths?: string[]
      fileWatcherCloseError?: string
      retryManagerStopThrows?: string
      toolCacheShutdownThrows?: string
      transportCloseThrows?: string
      toolDefinitions?: Array<{ name: string; description: string; inputSchema: Record<string, unknown> }>
      memoryStatsData?: {
        totalMemories?: number
        totalSpecFolders?: number
        byStatus?: { success?: number; pending?: number; failed?: number; retry?: number }
        topFolders?: unknown[]
      }
      startupEmbeddingDimension?: number
      startupValidation?: ApiKeyValidation
      configuredEmbeddingsProvider?: string | null
      buildErrorResponseImpl?: (toolName: string, error: Error, args?: Record<string, unknown>) => ErrorResponse
      getRecoveryHintImpl?: (toolName: string, errorCode: string) => unknown
      errorCodes?: Record<string, string>
      databaseUpdated?: boolean
    }): Promise<RuntimeHarness> {
      vi.resetModules()
      const previousDynamicInit = process.env.SPECKIT_DYNAMIC_INIT
      const previousEmbeddingDim = process.env.EMBEDDING_DIM
      if (typeof options?.dynamicInit === 'string') {
        process.env.SPECKIT_DYNAMIC_INIT = options.dynamicInit
      }
      delete process.env.EMBEDDING_DIM

      const handlers = new Map<unknown, (request: unknown, extra: unknown) => Promise<unknown>>()
      const dispatchToolMock = vi.fn()
      const autoSurfaceMemoriesMock = vi.fn(async () => ({ constitutional: [], triggered: [] }))
      const autoSurfaceAtToolDispatchMock = vi.fn(async () => null)
      const autoSurfaceAtCompactionMock = vi.fn(async () => null)
      const appendAutoSurfaceHintsMock = vi.fn(actualAppendAutoSurfaceHints)
      const syncEnvelopeTokenCountMock = vi.fn(actualSyncEnvelopeTokenCount)
      const serializeEnvelopeWithTokenCountMock = vi.fn(actualSerializeEnvelopeWithTokenCount)
      const setInstructionsMock = vi.fn()
      const registeredProcessHandlers = new Map<string, Array<(...args: any[]) => unknown>>()
      const transportCloseMock = vi.fn(() => {
        if (options?.transportCloseThrows) {
          throw new Error(options.transportCloseThrows)
        }
      })
      const fileWatcherCloseMock = vi.fn(async () => {
        if (options?.fileWatcherCloseError) {
          throw new Error(options.fileWatcherCloseError)
        }
      })
      const retryManagerStopBackgroundJobMock = vi.fn(() => {
        if (options?.retryManagerStopThrows) {
          throw new Error(options.retryManagerStopThrows)
        }
      })
      const checkDatabaseUpdatedMock = vi.fn(async () => options?.databaseUpdated ?? false)
      const toolCacheClearMock = vi.fn(() => 0)
      const toolCacheShutdownMock = vi.fn(() => {
        if (options?.toolCacheShutdownThrows) {
          throw new Error(options.toolCacheShutdownThrows)
        }
      })
      const triggerMatcherClearMock = vi.fn()
      const statsData = options?.memoryStatsData ?? {}
      const byStatus = statsData.byStatus ?? {}
      const handleMemoryStatsMock = vi.fn(async () => ({
        content: [{
          type: 'text',
          text: JSON.stringify({
            data: {
              totalMemories: statsData.totalMemories ?? 0,
              totalSpecFolders: statsData.totalSpecFolders ?? 0,
              byStatus: {
                success: byStatus.success ?? 0,
                pending: byStatus.pending ?? 0,
                failed: byStatus.failed ?? 0,
                retry: byStatus.retry ?? 0,
              },
              topFolders: statsData.topFolders ?? [],
            },
          }),
        }],
      }))
      const extractContextHintMock = vi.fn((toolArgs: Record<string, unknown>) => {
        if (typeof toolArgs?.query === 'string') return toolArgs.query
        if (typeof toolArgs?.input === 'string') return toolArgs.input
        if (typeof toolArgs?.prompt === 'string') return toolArgs.prompt
        return null
      })
      const memoryAwareTools = options?.memoryAwareTools ?? new Set<string>()
      const listToolsSchema = { name: 'ListToolsRequestSchema' }
      const callToolSchema = { name: 'CallToolRequestSchema' }
      const databaseMock = {
        prepare: vi.fn(() => ({
          get: vi.fn(() => ({ journal_mode: 'wal' })),
          all: vi.fn(() => []),
          run: vi.fn(() => ({ changes: 1 })),
        })),
        pragma: vi.fn(),
      }

      vi.spyOn(process, 'on').mockImplementation(((event: string | symbol, handler: (...args: any[]) => unknown) => {
        const key = String(event)
        const handlersForEvent = registeredProcessHandlers.get(key) ?? []
        handlersForEvent.push(handler)
        registeredProcessHandlers.set(key, handlersForEvent)
        return process
      }) as typeof process.on)
      vi.spyOn(global, 'setImmediate').mockImplementation(() => 0 as unknown as NodeJS.Immediate)
      const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never)

      vi.doMock('@modelcontextprotocol/sdk/server/index.js', () => ({
        Server: class {
          setRequestHandler(schema: unknown, handler: (request: unknown, extra: unknown) => Promise<unknown>): void {
            handlers.set(schema, handler)
          }

          async connect(_transport: unknown): Promise<void> {
            return
          }

          setInstructions(instructions: string): void {
            setInstructionsMock(instructions)
          }
        },
      }))

      vi.doMock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
        StdioServerTransport: class {
          close(): void {
            transportCloseMock()
          }
        },
      }))

      vi.doMock('@modelcontextprotocol/sdk/types.js', () => ({
        ListToolsRequestSchema: listToolsSchema,
        CallToolRequestSchema: callToolSchema,
      }))

      vi.doMock('../core', () => ({
        DATABASE_PATH: '/tmp/context-index.sqlite',
        LIB_DIR: '/tmp',
        DEFAULT_BASE_PATH: '/tmp',
        checkDatabaseUpdated: checkDatabaseUpdatedMock,
        reinitializeDatabase: vi.fn(),
        setEmbeddingModelReady: vi.fn(),
        waitForEmbeddingModel: vi.fn(async () => true),
        isEmbeddingModelReady: vi.fn(() => true),
        init: vi.fn(),
      }))

      vi.doMock('../tool-schemas', () => ({ TOOL_DEFINITIONS: options?.toolDefinitions ?? [] }))
      vi.doMock('../tools', () => ({ dispatchTool: dispatchToolMock }))

      vi.doMock('../handlers', () => ({
        indexSingleFile: vi.fn(async () => ({ status: 'unchanged' })),
        indexMemoryFile: vi.fn(async () => ({ status: 'unchanged' })),
        handleMemoryStats: handleMemoryStatsMock,
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
        syncEnvelopeTokenCount: syncEnvelopeTokenCountMock,
        serializeEnvelopeWithTokenCount: serializeEnvelopeWithTokenCountMock,
        recordToolCall: vi.fn(),
      }))
      vi.doMock('../hooks/memory-surface', () => ({
        primeSessionIfNeeded: vi.fn(async () => null),
      }))

      vi.doMock('../lib/architecture/layer-definitions', () => ({
        getTokenBudget: vi.fn(() => 1000),
      }))

      vi.doMock('../startup-checks', () => ({
        detectNodeVersionMismatch: vi.fn(),
        checkSqliteVersion: vi.fn(),
      }))
      vi.doMock('../lib/search/graph-flags', () => ({
        isGraphUnifiedEnabled: vi.fn(() => options?.graphUnifiedEnabled ?? false),
      }))
      vi.doMock('../lib/search/graph-search-fn', () => ({
        createUnifiedGraphSearchFn: vi.fn(() => null),
      }))
      vi.doMock('../lib/search/search-flags', async () => {
        const actual = await vi.importActual('../lib/search/search-flags') as Record<string, unknown>;
        return {
          ...actual,
          isDegreeBoostEnabled: vi.fn(() => options?.degreeBoostEnabled ?? false),
          isDynamicInitEnabled: vi.fn(() => process.env.SPECKIT_DYNAMIC_INIT !== 'false'),
          isFileWatcherEnabled: vi.fn(() => options?.fileWatcherEnabled ?? false),
        };
      })

      vi.doMock('../lib/search/vector-index', () => ({
        initializeDb: vi.fn(),
        closeDb: vi.fn(),
        verifyIntegrity: vi.fn(() => ({ totalMemories: 0, missingVectors: 0, orphanedVectors: 0 })),
        validateEmbeddingDimension: vi.fn(() => options?.dimValidation ?? ({ valid: true, stored: 1536 })),
        getDb: vi.fn(() => databaseMock),
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
      vi.doMock('../lib/search/session-boost', () => ({ init: vi.fn() }))
      vi.doMock('../lib/search/causal-boost', () => ({ init: vi.fn() }))
      vi.doMock('../lib/search/bm25-index', () => ({
        isBm25Enabled: vi.fn(() => options?.bm25Enabled ?? false),
        getIndex: vi.fn(() => ({ rebuildFromDatabase: vi.fn(() => 0) })),
      }))
      vi.doMock('../lib/parsing/memory-parser', () => ({ findMemoryFiles: vi.fn(() => []) }))
      vi.doMock('../lib/parsing/trigger-matcher', () => ({ clearCache: triggerMatcherClearMock }))
      vi.doMock('../lib/telemetry/scoring-observability', () => ({ initScoringObservability: vi.fn() }))
      vi.doMock('../lib/storage/learned-triggers-schema', () => ({
        migrateLearnedTriggers: vi.fn(() => 0),
        verifyFts5Isolation: vi.fn(() => true),
      }))
      vi.doMock('../lib/search/learned-feedback', () => ({ isLearnedFeedbackEnabled: vi.fn(() => false) }))
      vi.doMock('../lib/cognitive/working-memory', () => ({ init: vi.fn(), isEnabled: vi.fn(() => false) }))
      vi.doMock('../lib/cognitive/attention-decay', () => ({ init: vi.fn() }))
      vi.doMock('../lib/cognitive/co-activation', () => ({ init: vi.fn(), isEnabled: vi.fn(() => false) }))
      vi.doMock('../lib/cognitive/archival-manager', () => ({
        init: vi.fn(),
        startBackgroundJob: vi.fn(),
        isBackgroundJobRunning: vi.fn(() => false),
        cleanup: vi.fn(),
      }))
      vi.doMock('../lib/providers/retry-manager', () => ({
        startBackgroundJob: vi.fn(() => false),
        stopBackgroundJob: retryManagerStopBackgroundJobMock,
      }))
      vi.doMock('../lib/session/session-manager', () => ({
        init: vi.fn(() => ({ success: true })),
        isEnabled: vi.fn(() => false),
        resetInterruptedSessions: vi.fn(() => ({ interruptedCount: 0 })),
        getInterruptedSessions: vi.fn(() => ({ sessions: [] })),
        shutdown: vi.fn(),
      }))
      vi.doMock('../lib/extraction/extraction-adapter', () => ({ initExtractionAdapter: vi.fn() }))
      vi.doMock('../lib/session/context-metrics', () => ({
        recordMetricEvent: vi.fn(),
        getSessionMetrics: vi.fn(() => ({
          sessionId: null,
          primed: false,
        })),
      }))
      vi.doMock('../lib/feedback/shadow-evaluation-runtime', () => ({
        init: vi.fn(),
        isEnabled: vi.fn(() => false),
        scheduleEvaluation: vi.fn(),
        shutdown: vi.fn(),
      }))
      vi.doMock('../lib/feedback/batch-learning', () => ({ runBatchLearning: vi.fn(async () => ({ processed: 0 })) }))
      vi.doMock('../lib/utils/canonical-path', () => ({ getCanonicalPathKey: vi.fn((p: string) => p) }))
      vi.doMock('../lib/utils/cleanup-helpers', () => ({
        runCleanupStep: vi.fn((label: string, fn: () => void) => {
          try { fn() } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e)
            console.error(`[context-server] ${label} cleanup failed:`, msg)
          }
        }),
        runAsyncCleanupStep: vi.fn(async (label: string, fn: () => Promise<void>) => {
          try { await fn() } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e)
            console.error(`[context-server] ${label} cleanup failed:`, msg)
          }
        }),
      }))
      vi.doMock('../lib/code-graph/code-graph-db', () => ({
        init: vi.fn(),
        getDb: vi.fn(() => null),
        close: vi.fn(),
      }))
      vi.doMock('../lib/storage/history', () => ({ recordHistory: vi.fn(), getHistory: vi.fn(() => []) }))
      vi.doMock('../handlers/memory-index-discovery', () => ({ discoverMemoryFiles: vi.fn(async () => []) }))
      vi.doMock('../handlers/mutation-hooks', () => ({ runPostMutationHooks: vi.fn(async () => {}) }))
      vi.doMock('../lib/response/envelope', () => ({
        createMCPErrorResponse: vi.fn((data: unknown) => ({ content: [{ type: 'text', text: JSON.stringify(data) }], isError: true })),
        wrapForMCP: vi.fn((data: unknown, isError?: boolean) => ({ content: [{ type: 'text', text: JSON.stringify(data) }], isError: isError ?? false })),
      }))
      vi.doMock('../lib/search/local-reranker', () => ({ disposeLocalReranker: vi.fn() }))
      vi.doMock('../lib/ops/job-queue', () => ({ initIngestJobQueue: vi.fn(() => ({ resetCount: 0 })) }))
      vi.doMock('../lib/search/folder-discovery', () => ({ getSpecsBasePaths: vi.fn(() => options?.watchPaths ?? []) }))
      vi.doMock('../lib/ops/file-watcher', () => ({
        startFileWatcher: vi.fn(() => ({
          close: fileWatcherCloseMock,
        })),
      }))
      vi.doMock('../lib/storage/incremental-index', () => ({}))
      vi.doMock('../lib/storage/transaction-manager', () => ({
        recoverAllPendingFiles: vi.fn(() => []),
        getMetrics: vi.fn(() => ({ totalRecoveries: 0, totalErrors: 0, totalAtomicWrites: 0 })),
      }))
      vi.doMock('../lib/cache/tool-cache', () => ({ clear: toolCacheClearMock, shutdown: toolCacheShutdownMock }))
      vi.doMock('../lib/errors', () => ({
        ErrorCodes: options?.errorCodes ?? { UNKNOWN_TOOL: 'UNKNOWN_TOOL' },
        getRecoveryHint: vi.fn(options?.getRecoveryHintImpl ?? (() => ({ code: 'UNKNOWN_TOOL' }))),
        buildErrorResponse: vi.fn(options?.buildErrorResponseImpl ?? ((_tool: string, error: Error) => ({ error: error.message }))),
        getDefaultErrorCodeForTool: vi.fn(() => 'UNKNOWN_TOOL'),
      }))
      vi.doMock('@spec-kit/shared/embeddings/factory', () => {
        const startupEmbeddingDimension = options?.startupEmbeddingDimension
          ?? options?.dimValidation?.current
          ?? options?.dimValidation?.stored
          ?? 1536
        const startupValidation = options?.startupValidation ?? {
          valid: true,
          provider: 'voyage',
        }

        return {
          getStartupEmbeddingDimension: vi.fn(() => startupEmbeddingDimension),
          resolveStartupEmbeddingConfig: vi.fn(async () => ({
            resolution: { name: 'voyage', reason: 'mocked startup embedding config' },
            info: {
              provider: 'voyage',
              requestedProvider: 'voyage',
              effectiveProvider: 'voyage',
              fallbackReason: undefined,
              dimensionChanged: false,
              reason: 'mocked startup embedding config',
              config: {},
            },
            dimension: startupEmbeddingDimension,
            validation: startupValidation,
          })),
          validateConfiguredEmbeddingsProvider: vi.fn(() => options?.configuredEmbeddingsProvider ?? null),
        }
      })

      const module = await import('../context-server')
      // The entrypoint guard (isMain) prevents main() from running on import.
      // Explicitly call main() so startup-time side effects (dim validation,
      // dynamic instructions, file watcher) are exercised by the test harness.
      const testables = (module as { __testables?: { main?: () => Promise<void> } }).__testables
      if (testables?.main) {
        await testables.main().catch((err: unknown) => {
          // Mirror production: main().catch → console.error + process.exit(1)
          console.error('[context-server] Fatal error:', err);
          process.exit(1);
        })
      }
      const callToolHandler = handlers.get(callToolSchema)
      expect(typeof callToolHandler).toBe('function')
      await Promise.resolve()
      await new Promise((resolve) => setTimeout(resolve, 0))

      if (typeof options?.dynamicInit === 'string') {
        if (previousDynamicInit === undefined) {
          delete process.env.SPECKIT_DYNAMIC_INIT
        } else {
          process.env.SPECKIT_DYNAMIC_INIT = previousDynamicInit
        }
      }
      if (previousEmbeddingDim === undefined) {
        delete process.env.EMBEDDING_DIM
      } else {
        process.env.EMBEDDING_DIM = previousEmbeddingDim
      }

      return {
        registerAfterToolCallback: module.registerAfterToolCallback,
        testables: (module as { __testables?: RuntimeHarness['testables'] }).__testables,
        dispatchToolMock,
        autoSurfaceMemoriesMock,
        autoSurfaceAtToolDispatchMock,
        autoSurfaceAtCompactionMock,
        appendAutoSurfaceHintsMock,
        setInstructionsMock,
        handleMemoryStatsMock,
        processExitSpy,
        registeredProcessHandlers,
        retryManagerStopBackgroundJobMock,
        checkDatabaseUpdatedMock,
        toolCacheClearMock,
        toolCacheShutdownMock,
        triggerMatcherClearMock,
        transportCloseMock,
        fileWatcherCloseMock,
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
      expect(sourceCode).toMatch(/runAfterToolCallbacks\(name,\s*callId,\s*structuredClone\(result\)\)/)
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

      const callbackSpy = vi.fn(async (..._args: unknown[]) => {
        events.push('callback')
      })

      registerAfterToolCallback(callbackSpy)

      const responsePromise = callToolHandler(
        { id: 'call-1', params: { name: 'memory_search', arguments: {} } },
        {}
      )

      await Promise.resolve()
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(callbackSpy).not.toHaveBeenCalled()

      expect(releaseDispatch).not.toBeNull()
      releaseDispatch!()

      await responsePromise
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(callbackSpy).toHaveBeenCalledTimes(1)
      // structuredClone snapshot: callback receives a deep clone before post-dispatch mutations
      const callArgs = callbackSpy.mock.calls[0]
      expect(callArgs[0]).toBe('memory_search')
      expect(callArgs[1]).toBe('call-1')
      expect(callArgs[2]).toEqual({ content: [{ type: 'text', text: '{}' }] })
      expect(callArgs[2]).not.toBe(toolResult) // structuredClone produces a new reference
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
      expect((response as { autoSurfacedContext?: unknown }).autoSurfacedContext).toBeUndefined()
      expect(JSON.parse((response as { content: Array<{ text: string }> }).content[0].text).meta.autoSurfacedContext).toEqual(surfaced)
    })

    it('clears in-process caches when the DB is reinitialized externally before dispatch', async () => {
      const {
        dispatchToolMock,
        checkDatabaseUpdatedMock,
        toolCacheClearMock,
        triggerMatcherClearMock,
        callToolHandler,
      } = await loadRuntimeHarness({ databaseUpdated: true })

      dispatchToolMock.mockResolvedValue({ content: [{ type: 'text', text: '{}' }] })

      await callToolHandler(
        { id: 'call-cache-refresh', params: { name: 'checkpoint_list', arguments: { query: 'recent checks' } } },
        {}
      )

      expect(checkDatabaseUpdatedMock.mock.calls.length).toBeGreaterThanOrEqual(1)
      expect(toolCacheClearMock).toHaveBeenCalledTimes(1)
      expect(triggerMatcherClearMock).toHaveBeenCalledTimes(1)
      expect(dispatchToolMock).toHaveBeenCalledTimes(1)
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
      expect((response as { autoSurfacedContext?: unknown }).autoSurfacedContext).toBeUndefined()
      expect(JSON.parse((response as { content: Array<{ text: string }> }).content[0].text).meta.autoSurfacedContext).toEqual(surfaced)
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
      expect((response as { autoSurfacedContext?: unknown }).autoSurfacedContext).toBeUndefined()
      expect(JSON.parse((response as { content: Array<{ text: string }> }).content[0].text).meta.autoSurfacedContext).toEqual(surfaced)
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
      expect((response as { autoSurfacedContext?: unknown }).autoSurfacedContext).toBeUndefined()
      expect(JSON.parse((response as { content: Array<{ text: string }> }).content[0].text).meta.autoSurfacedContext).toEqual(surfaced)
    })

    it('T000i: successful responses append auto-surface hints and keep autoSurfacedContext inside the envelope', async () => {
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
      expect(response.autoSurfacedContext).toBeUndefined()

      const parsed = JSON.parse(response.content[0].text)
      expect(parsed.hints.some((hint: string) => hint.includes('Auto-surface hook: injected 1 constitutional and 1 triggered memories'))).toBe(true)
      expect(parsed.meta.autoSurface).toEqual({
        constitutionalCount: 1,
        triggeredCount: 1,
        surfaced_at: '2026-03-06T12:00:00.000Z',
        latencyMs: 7,
      })
      expect(parsed.meta.autoSurfacedContext).toEqual(surfaced)
      expect(parsed.meta.tokenBudget).toBe(1000)
      expect(parsed.meta.tokenCount).toBeGreaterThan(0)
    })

    it('T000j: final tokenCount matches the serialized envelope after hints and tokenBudget injection', async () => {
      const {
        dispatchToolMock,
        autoSurfaceAtToolDispatchMock,
        callToolHandler,
      } = await loadRuntimeHarness()

      autoSurfaceAtToolDispatchMock.mockResolvedValue({
        constitutional: [{ id: 1, title: 'Gate rule' }],
        triggered: [{ memory_id: 2, matched_phrases: ['budget'] }],
        surfaced_at: '2026-03-06T12:34:56.000Z',
        latencyMs: 11,
      })

      dispatchToolMock.mockResolvedValue({
        content: [{
          type: 'text',
          text: JSON.stringify({
            summary: 'ok',
            data: { status: 'success' },
            hints: ['Initial hint'],
            meta: { tool: 'memory_list', tokenCount: 1, cacheHit: false },
          }),
        }],
      })

      const response = await callToolHandler(
        { id: 'call-9', params: { name: 'memory_list', arguments: { query: 'budget contract' } } },
        {}
      ) as { content: Array<{ text: string }> }

      const finalText = response.content[0].text
      const parsed = JSON.parse(finalText)

      expect(finalText).toContain('"tokenBudget": 1000')
      expect(parsed.hints).toContain('Initial hint')
      expect(parsed.hints.some((hint: string) => hint.includes('Auto-surface hook: injected 1 constitutional and 1 triggered memories (11ms)'))).toBe(true)
      expect(parsed.meta.tokenCount).toBe(estimateTokenCount(finalText))
    })

    it('T000ja: malformed JSON in appendAutoSurfaceHints logs warning telemetry', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const result = {
        content: [{ type: 'text', text: '{not-json' }],
      }

      actualAppendAutoSurfaceHints(result, { constitutional: [], triggered: [] })

      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(String(warnSpy.mock.calls[0]?.[0] ?? '')).toContain('[response-hints] appendAutoSurfaceHints failed:')
      expect(String(warnSpy.mock.calls[0]?.[1] ?? '')).toMatch(/Unexpected|Expected|position|JSON/i)
      expect(result.content[0].text).toBe('{not-json')
    })

    it('T000jb: valid non-record JSON payloads are ignored without warning', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const arrayResult = {
        content: [{ type: 'text', text: '[]' }],
      }
      const nullResult = {
        content: [{ type: 'text', text: 'null' }],
      }

      actualAppendAutoSurfaceHints(arrayResult, { constitutional: [{ id: 1 }], triggered: [{ id: 2 }] })
      actualAppendAutoSurfaceHints(nullResult, { constitutional: [{ id: 1 }], triggered: [{ id: 2 }] })

      expect(warnSpy).not.toHaveBeenCalled()
      expect(arrayResult.content[0].text).toBe('[]')
      expect(nullResult.content[0].text).toBe('null')
    })

    it('T000jc: serialization failures log the error and preserve original content', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const nativeStringify = JSON.stringify
      vi.spyOn(JSON, 'stringify').mockImplementation((value: unknown) => {
        if (
          typeof value === 'object'
          && value !== null
          && 'summary' in value
          && (value as { summary?: unknown }).summary === 'ok'
        ) {
          throw new TypeError('Converting circular structure to JSON')
        }

        return nativeStringify(value)
      })

      const originalText = '{"summary":"ok","data":{"status":"success"},"hints":[],"meta":{"tokenCount":1}}'
      const result = {
        content: [{ type: 'text', text: originalText }],
      }

      actualAppendAutoSurfaceHints(result, {
        constitutional: [{ id: 1 }],
        triggered: [{ id: 2 }],
        surfaced_at: '2026-03-11T00:00:00.000Z',
        latencyMs: 5,
      })

      expect(warnSpy).toHaveBeenCalledTimes(1)
      expect(String(warnSpy.mock.calls[0]?.[0] ?? '')).toContain('[response-hints] appendAutoSurfaceHints failed:')
      expect(String(warnSpy.mock.calls[0]?.[1] ?? '')).toContain('Converting circular structure to JSON')
      expect(result.content[0].text).toBe(originalText)
    })

    it('T000k: startup exits when the configured provider dimension does not match the active database', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const { processExitSpy } = await loadRuntimeHarness({
        dimValidation: {
          valid: false,
          stored: 1024,
          current: 768,
          warning: 'DIMENSION MISMATCH: Database has 1024-dim vectors, but provider expects 768.',
        },
      })

      expect(processExitSpy).toHaveBeenCalledWith(1)
      expect(errorSpy.mock.calls.some((call) => String(call[0]).includes('FATAL: Refusing to start with mismatched embedding dimensions'))).toBe(true)
    })

    it('T000l: startup sets dynamic instructions using live memory stats and channel flags', async () => {
      const { setInstructionsMock, handleMemoryStatsMock } = await loadRuntimeHarness({
        memoryStatsData: {
          totalMemories: 42,
          totalSpecFolders: 5,
          byStatus: { success: 30, pending: 8, failed: 3, retry: 1 },
        },
        bm25Enabled: true,
        degreeBoostEnabled: true,
      })

      expect(handleMemoryStatsMock).toHaveBeenCalledTimes(1)
      expect(setInstructionsMock).toHaveBeenCalledTimes(1)

      const instructions = String(setInstructionsMock.mock.calls[0]?.[0] ?? '')
      expect(instructions).toContain('42 indexed memories across 5 spec folders')
      expect(instructions).toContain('Active memories: 30. Stale memories: 12.')
      expect(instructions).toContain('Search channels: vector, fts5, bm25, degree.')
      expect(instructions).toContain('Warning: 12 stale memories detected. Consider running memory_index_scan.')
    })

    it('T000m: dynamic instructions are regenerated per MCP initialization (not hardcoded)', async () => {
      const first = await loadRuntimeHarness({
        memoryStatsData: {
          totalMemories: 3,
          totalSpecFolders: 1,
          byStatus: { success: 2, pending: 1, failed: 0, retry: 0 },
        },
      })
      const second = await loadRuntimeHarness({
        memoryStatsData: {
          totalMemories: 19,
          totalSpecFolders: 4,
          byStatus: { success: 10, pending: 4, failed: 3, retry: 2 },
        },
      })

      const firstInstructions = String(first.setInstructionsMock.mock.calls[0]?.[0] ?? '')
      const secondInstructions = String(second.setInstructionsMock.mock.calls[0]?.[0] ?? '')

      expect(firstInstructions).toContain('3 indexed memories across 1 spec folders')
      expect(secondInstructions).toContain('19 indexed memories across 4 spec folders')
      expect(secondInstructions).not.toBe(firstInstructions)
    })

    it('T000n: dynamic instructions are skipped when SPECKIT_DYNAMIC_INIT=false', async () => {
      const { setInstructionsMock, handleMemoryStatsMock } = await loadRuntimeHarness({
        dynamicInit: 'false',
        memoryStatsData: {
          totalMemories: 99,
          totalSpecFolders: 9,
          byStatus: { success: 50, pending: 20, failed: 20, retry: 9 },
        },
      })

      expect(handleMemoryStatsMock).not.toHaveBeenCalled()
      expect(setInstructionsMock).not.toHaveBeenCalled()
    })

    it('T000o: runCleanupStep swallows sync cleanup failures with labeled logging', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const { testables } = await loadRuntimeHarness()
      const baselineCalls = errorSpy.mock.calls.length

      expect(testables?.runCleanupStep).toBeTypeOf('function')
      testables?.runCleanupStep('toolCache', () => {
        throw new Error('tool-cache-failed')
      })

      const newCalls = errorSpy.mock.calls.slice(baselineCalls)
      const cleanupLog = newCalls.find((call) =>
        String(call?.[0] ?? '').includes('[context-server] toolCache cleanup failed:')
      )
      expect(cleanupLog).toBeDefined()
      expect(String(cleanupLog?.[1] ?? '')).toContain('tool-cache-failed')
    })

    it('T000p: runAsyncCleanupStep swallows async cleanup failures with labeled logging', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const { testables } = await loadRuntimeHarness()
      const baselineCalls = errorSpy.mock.calls.length

      expect(testables?.runAsyncCleanupStep).toBeTypeOf('function')
      await testables?.runAsyncCleanupStep('fileWatcher', async () => {
        throw new Error('file-watcher-close-failed')
      })

      const newCalls = errorSpy.mock.calls.slice(baselineCalls)
      const cleanupLog = newCalls.find((call) =>
        String(call?.[0] ?? '').includes('[context-server] fileWatcher cleanup failed:')
      )
      expect(cleanupLog).toBeDefined()
      expect(String(cleanupLog?.[1] ?? '')).toContain('file-watcher-close-failed')
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
        // Accept either interface or type alias contracts in exported tool/context types.
        const typeContractRegex = new RegExp(`(?:interface\\s+${iface.name}\\s*\\{|type\\s+${iface.name}\\s*=)`)
        expect(typeContractRegex.test(code)).toBe(true)

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

    // T22: Error response is wrapped as an MCP error envelope
    it('T22: Error responses set isError: true', () => {
      expect(sourceCode).toMatch(/wrapForMCP\(errorResponse\s+as\s+any,\s*true\)/)
    })

    it('T22b: catch path wraps buildErrorResponse output with wrapForMCP', () => {
      expect(sourceCode).toMatch(/return\s+wrapForMCP\(errorResponse\s+as\s+any,\s*true\)/)
    })

    it('T22c: catch path falls back to createMCPErrorResponse when envelope building fails', () => {
      expect(sourceCode).toMatch(/return\s+createMCPErrorResponse\(\{/)
    })

    it('T22d: source logs fallback envelope-build failures before returning createMCPErrorResponse', () => {
      expect(sourceCode).toMatch(/Failed to build MCP error envelope/)
      expect(sourceCode).toMatch(/createMCPErrorResponse\(\{/)
    })

    // T23: buildErrorResponse direct test
    it('T23: buildErrorResponse returns structured object', async () => {
      const errorsModule = await importFirst<ErrorsModule>([
        async () => await import('../lib/errors/index'),
        async () => await import('../lib/errors'),
      ])

      expect(errorsModule?.buildErrorResponse).toBeTypeOf('function')

      const testError = new Error('Test error message')
      const response = errorsModule!.buildErrorResponse!('memory_search', testError, { query: 'test' })

      expect(response).toBeTypeOf('object')
      expect(
        response.error || response.message || response.summary
      ).toBeTruthy()
    })

    // T24: Error response contains recovery hints (REQ-004)
    it('T24: getRecoveryHint returns RecoveryHint object', async () => {
      const errorsModule = await importFirst<ErrorsModule>([
        async () => await import('../lib/errors/index'),
        async () => await import('../lib/errors'),
      ])

      expect(errorsModule?.getRecoveryHint).toBeTypeOf('function')

      // GetRecoveryHint(toolName, errorCode) returns a RecoveryHint object
      const hint = errorsModule!.getRecoveryHint!('memory_search', 'UNKNOWN_TOOL')
      expect(typeof hint).toBe('object')
      expect(hint).not.toBeNull()
    })

    // T25: ErrorCodes enum/object exists
    it('T25: ErrorCodes defined', async () => {
      const errorsModule = await importFirst<ErrorsModule>([
        async () => await import('../lib/errors/index'),
        async () => await import('../lib/errors'),
      ])

      expect(errorsModule?.ErrorCodes).toBeTypeOf('object')

      expect(Object.keys(errorsModule!.ErrorCodes!).length).toBeGreaterThan(0)
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
    it('T28: L1 budget = 3500 (memory_context)', async () => {
      const layerDefs = await importFirst<LayerDefinitionsModule>([
        async () => await import('../lib/architecture/layer-definitions'),
      ])
      expect(layerDefs?.getTokenBudget).toBeTypeOf('function')
      expect(layerDefs!.getTokenBudget!('memory_context')).toBe(3500)
    })

    it('T28b: L2 budget = 3500 (memory_search)', async () => {
      const layerDefs = await importFirst<LayerDefinitionsModule>([
        async () => await import('../lib/architecture/layer-definitions'),
      ])
      expect(layerDefs?.getTokenBudget).toBeTypeOf('function')
      expect(layerDefs!.getTokenBudget!('memory_search')).toBe(3500)
    })

    it('T28c: L3 budget = 1000 (memory_list)', async () => {
      const layerDefs = await importFirst<LayerDefinitionsModule>([
        async () => await import('../lib/architecture/layer-definitions'),
      ])
      expect(layerDefs?.getTokenBudget).toBeTypeOf('function')
      expect(layerDefs!.getTokenBudget!('memory_list')).toBe(1000)
    })

    it('T28d: Unknown tool budget = 1000 (default)', async () => {
      const layerDefs = await importFirst<LayerDefinitionsModule>([
        async () => await import('../lib/architecture/layer-definitions'),
      ])
      expect(layerDefs?.getTokenBudget).toBeTypeOf('function')
      expect(layerDefs!.getTokenBudget!('nonexistent_tool')).toBe(1000)
    })

    it('T28e: L4 budget = 1000 (memory_delete)', async () => {
      const layerDefs = await importFirst<LayerDefinitionsModule>([
        async () => await import('../lib/architecture/layer-definitions'),
      ])
      expect(layerDefs?.getTokenBudget).toBeTypeOf('function')
      expect(layerDefs!.getTokenBudget!('memory_delete')).toBe(1000)
    })

    it('T28f: L5 budget = 1000 (checkpoint_create)', async () => {
      const layerDefs = await importFirst<LayerDefinitionsModule>([
        async () => await import('../lib/architecture/layer-definitions'),
      ])
      expect(layerDefs?.getTokenBudget).toBeTypeOf('function')
      expect(layerDefs!.getTokenBudget!('checkpoint_create')).toBe(1000)
    })

    it('T28g: L6 budget = 1500 (memory_drift_why)', async () => {
      const layerDefs = await importFirst<LayerDefinitionsModule>([
        async () => await import('../lib/architecture/layer-definitions'),
      ])
      expect(layerDefs?.getTokenBudget).toBeTypeOf('function')
      expect(layerDefs!.getTokenBudget!('memory_drift_why')).toBe(1500)
    })

    it('T28h: L7 budget = 1000 (memory_index_scan)', async () => {
      const layerDefs = await importFirst<LayerDefinitionsModule>([
        async () => await import('../lib/architecture/layer-definitions'),
      ])
      expect(layerDefs?.getTokenBudget).toBeTypeOf('function')
      expect(layerDefs!.getTokenBudget!('memory_index_scan')).toBe(1000)
    })
  })

  // =================================================================
  // GROUP 7: Hooks Integration (MEMORY_AWARE_TOOLS, extractContextHint)
  // =================================================================
  describe('Group 7: Hooks Integration', () => {
    // T29: Source imports MEMORY_AWARE_TOOLS
    it('T29: Imports MEMORY_AWARE_TOOLS from hooks', () => {
      expect(sourceCode).toMatch(/import\s*\{[^}]*MEMORY_AWARE_TOOLS[^}]*\}\s*from\s*['"]\.\/hooks\/index\.js['"]/)
    })

    // T30: Source checks MEMORY_AWARE_TOOLS.has(name)
    it('T30: Checks MEMORY_AWARE_TOOLS.has(name)', () => {
      expect(sourceCode).toMatch(/MEMORY_AWARE_TOOLS\.has\(name\)/)
    })

    // T31: Hooks module direct tests
    it('T31: MEMORY_AWARE_TOOLS is a Set', async () => {
      const hooksModule = await importFirst<HooksModule>([
        async () => await import('../hooks/index'),
        async () => await import('../hooks'),
        async () => await import('../hooks/memory-surface'),
      ])
      expect(hooksModule?.MEMORY_AWARE_TOOLS).toBeInstanceOf(Set)
    })

    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
    for (const t of expectedAwareTools) {
      it(`T31b: MEMORY_AWARE_TOOLS contains '${t}'`, async () => {
        const hooksModule = await importFirst<HooksModule>([
          async () => await import('../hooks/index'),
          async () => await import('../hooks'),
          async () => await import('../hooks/memory-surface'),
        ])
        expect(hooksModule?.MEMORY_AWARE_TOOLS).toBeInstanceOf(Set)
        expect(hooksModule!.MEMORY_AWARE_TOOLS!.has(t)).toBe(true)
      })
    }

    const nonAwareTools = ['memory_delete', 'checkpoint_create', 'task_preflight']
    for (const t of nonAwareTools) {
      it(`T31c: MEMORY_AWARE_TOOLS excludes '${t}'`, async () => {
        const hooksModule = await importFirst<HooksModule>([
          async () => await import('../hooks/index'),
          async () => await import('../hooks'),
          async () => await import('../hooks/memory-surface'),
        ])
        expect(hooksModule?.MEMORY_AWARE_TOOLS).toBeInstanceOf(Set)
        expect(hooksModule!.MEMORY_AWARE_TOOLS!.has(t)).toBe(false)
      })
    }

    // ExtractContextHint tests
    it('T31d: extractContextHint extracts query', async () => {
      const hooksModule = await importFirst<HooksModule>([
        async () => await import('../hooks/index'),
        async () => await import('../hooks'),
        async () => await import('../hooks/memory-surface'),
      ])
      expect(hooksModule?.extractContextHint).toBeTypeOf('function')
      expect(hooksModule!.extractContextHint!({ query: 'test search' })).toBe('test search')
    })

    it('T31e: extractContextHint extracts prompt', async () => {
      const hooksModule = await importFirst<HooksModule>([
        async () => await import('../hooks/index'),
        async () => await import('../hooks'),
        async () => await import('../hooks/memory-surface'),
      ])
      expect(hooksModule?.extractContextHint).toBeTypeOf('function')
      expect(hooksModule!.extractContextHint!({ prompt: 'trigger phrase' })).toBe('trigger phrase')
    })

    it('T31ea: extractContextHint extracts input', async () => {
      const hooksModule = await importFirst<HooksModule>([
        async () => await import('../hooks/index'),
        async () => await import('../hooks'),
        async () => await import('../hooks/memory-surface'),
      ])
      expect(hooksModule?.extractContextHint).toBeTypeOf('function')
      expect(hooksModule!.extractContextHint!({ input: 'memory context request' })).toBe('memory context request')
    })

    it('T31f: extractContextHint handles null', async () => {
      const hooksModule = await importFirst<HooksModule>([
        async () => await import('../hooks/index'),
        async () => await import('../hooks'),
        async () => await import('../hooks/memory-surface'),
      ])
      expect(hooksModule?.extractContextHint).toBeTypeOf('function')
      expect(hooksModule!.extractContextHint!(null)).toBeNull()
    })

    it('T31g: extractContextHint handles empty object', async () => {
      const hooksModule = await importFirst<HooksModule>([
        async () => await import('../hooks/index'),
        async () => await import('../hooks'),
        async () => await import('../hooks/memory-surface'),
      ])
      expect(hooksModule?.extractContextHint).toBeTypeOf('function')
      expect(hooksModule!.extractContextHint!({})).toBeNull()
    })

    it('T31h: extractContextHint rejects strings < 3 chars', async () => {
      const hooksModule = await importFirst<HooksModule>([
        async () => await import('../hooks/index'),
        async () => await import('../hooks'),
        async () => await import('../hooks/memory-surface'),
      ])
      expect(hooksModule?.extractContextHint).toBeTypeOf('function')
      expect(hooksModule!.extractContextHint!({ query: 'ab' })).toBeNull()
    })

    it('T31i: extractContextHint joins concepts', async () => {
      const hooksModule = await importFirst<HooksModule>([
        async () => await import('../hooks/index'),
        async () => await import('../hooks'),
        async () => await import('../hooks/memory-surface'),
      ])
      expect(hooksModule?.extractContextHint).toBeTypeOf('function')
      expect(hooksModule!.extractContextHint!({ concepts: ['memory', 'search'] })).toBe('memory search')
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
      // Context-server validates only length pre-dispatch; schema checks occur in tool dispatch modules.
      expect(sourceCode).toMatch(/dispatchTool\(name,\s*args\)/)
      expect(sourceCode).not.toMatch(/validateToolArgs\(/)
    })

    // T33: validateInputLengths direct tests
    it('T33: validateInputLengths accepts normal input', async () => {
      const utilsModule = await importFirst<UtilsModule>([
        async () => await import('../utils/index'),
        async () => await import('../utils'),
        async () => await import('../utils/validators'),
      ])
      const validateInputLengths = utilsModule?.validateInputLengths
      expect(validateInputLengths).toBeTypeOf('function')
      if (!validateInputLengths) {
        throw new Error('validateInputLengths was not exported')
      }
      expect(() => validateInputLengths({ query: 'normal search query' })).not.toThrow()
    })

    it('T33b: validateInputLengths accepts empty args', async () => {
      const utilsModule = await importFirst<UtilsModule>([
        async () => await import('../utils/index'),
        async () => await import('../utils'),
        async () => await import('../utils/validators'),
      ])
      const validateInputLengths = utilsModule?.validateInputLengths
      expect(validateInputLengths).toBeTypeOf('function')
      if (!validateInputLengths) {
        throw new Error('validateInputLengths was not exported')
      }
      expect(() => validateInputLengths({})).not.toThrow()
    })

    it('T33c: validateInputLengths rejects oversized query', async () => {
      const utilsModule = await importFirst<UtilsModule>([
        async () => await import('../utils/index'),
        async () => await import('../utils'),
        async () => await import('../utils/validators'),
      ])
      const validateInputLengths = utilsModule?.validateInputLengths
      expect(validateInputLengths).toBeTypeOf('function')
      if (!validateInputLengths) {
        throw new Error('validateInputLengths was not exported')
      }
      expect(() => validateInputLengths({ query: 'x'.repeat(20000) })).toThrow()
    })

    it('T33d: validateInputLengths rejects oversized title', async () => {
      const utilsModule = await importFirst<UtilsModule>([
        async () => await import('../utils/index'),
        async () => await import('../utils'),
        async () => await import('../utils/validators'),
      ])
      const validateInputLengths = utilsModule?.validateInputLengths
      expect(validateInputLengths).toBeTypeOf('function')
      if (!validateInputLengths) {
        throw new Error('validateInputLengths was not exported')
      }
      expect(() => validateInputLengths({ title: 'x'.repeat(1000) })).toThrow()
    })

    // T34: INPUT_LIMITS constants
    it('T34: INPUT_LIMITS.query = 10000', async () => {
      const utilsModule = await importFirst<UtilsModule>([
        async () => await import('../utils/index'),
        async () => await import('../utils'),
        async () => await import('../utils/validators'),
      ])
      expect(utilsModule?.INPUT_LIMITS).toBeTypeOf('object')
      expect(utilsModule!.INPUT_LIMITS!.query).toBe(10000)
    })

    it('T34b: INPUT_LIMITS.title = 500', async () => {
      const utilsModule = await importFirst<UtilsModule>([
        async () => await import('../utils/index'),
        async () => await import('../utils'),
        async () => await import('../utils/validators'),
      ])
      expect(utilsModule?.INPUT_LIMITS).toBeTypeOf('object')
      expect(utilsModule!.INPUT_LIMITS!.title).toBe(500)
    })

    it('T34c: INPUT_LIMITS.filePath = 500', async () => {
      const utilsModule = await importFirst<UtilsModule>([
        async () => await import('../utils/index'),
        async () => await import('../utils'),
        async () => await import('../utils/validators'),
      ])
      expect(utilsModule?.INPUT_LIMITS).toBeTypeOf('object')
      expect(utilsModule!.INPUT_LIMITS!.filePath).toBe(500)
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
      expect(sourceCode).toMatch(/process\.on\('SIGTERM'[\s\S]*?fatalShutdown/);
      expect(sourceCode).toMatch(/fatalShutdown[\s\S]*?vectorIndex\.closeDb\(\)/)
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

    it('T47c: ingest queue uses indexSingleFile sync semantics', () => {
      expect(sourceCode).toMatch(/processFile:\s*async\s*\(filePath:\s*string\)\s*=>\s*\{[\s\S]*?await\s+indexSingleFile\(filePath,\s*false\);?[\s\S]*?\}/)
    })

    it('T47d: file watcher reindex uses indexSingleFile sync semantics', () => {
      expect(sourceCode).toMatch(/reindexFn:\s*async\s*\(filePath:\s*string\)\s*=>\s*\{[\s\S]*?await\s+indexSingleFile\(filePath,\s*false\);?[\s\S]*?\}/)
      expect(sourceCode).not.toMatch(/indexMemoryFile\(filePath,\s*\{\s*asyncEmbedding:\s*true\s*\}\)/)
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

    it('T55b: startup treats embedding dimension mismatches as fatal', () => {
      expect(sourceCode).toMatch(/FATAL: Refusing to start with mismatched embedding dimensions/)
      expect(sourceCode).toMatch(/throw new Error\(dimValidation\.warning \?\? 'Embedding dimension mismatch between provider and database'\)/)
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
    // T58: autoSurfacedContext injected into successful response envelope metadata
    it('T58: Auto-surfaced context injected into response envelope metadata', () => {
      expect(sourceCode).toMatch(/meta\.autoSurfacedContext\s*=\s*autoSurfacedContext/)
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
  // GROUP 13b: checkpoint_delete confirmName contract
  // =================================================================
  describe('Group 13b: checkpoint_delete confirmName safety', () => {
    it('T103: checkpoint_delete requires confirmName in schema', () => {
      expect(toolSchemasCode).toMatch(/checkpoint_delete[\s\S]*?required.*confirmName/)
    })

    it('T104: checkpoint_delete handler rejects missing confirmName', () => {
      const handlerFile = fs.readFileSync(
        path.join(SERVER_DIR, 'handlers', 'checkpoints.ts'),
        'utf8'
      )
      expect(handlerFile).toMatch(/confirmName.*required.*must be a string/)
    })

    it('T105: checkpoint_delete handler rejects mismatched confirmName', () => {
      const handlerFile = fs.readFileSync(
        path.join(SERVER_DIR, 'handlers', 'checkpoints.ts'),
        'utf8'
      )
      expect(handlerFile).toMatch(/confirmName must exactly match name/)
    })

    it('T106: checkpoint_delete proceeds when confirmName matches name', () => {
      const handlerFile = fs.readFileSync(
        path.join(SERVER_DIR, 'handlers', 'checkpoints.ts'),
        'utf8'
      )
      // After confirmName validation, deleteCheckpoint is called
      const confirmCheck = handlerFile.indexOf('confirmName must exactly match name')
      const deleteCall = handlerFile.indexOf('deleteCheckpoint(name')
      expect(confirmCheck).toBeGreaterThan(-1)
      expect(deleteCall).toBeGreaterThan(-1)
      expect(deleteCall).toBeGreaterThan(confirmCheck)
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

    it('T63b: startup root expansion helper is defined', () => {
      expect(sourceCode).toMatch(/function\s+getStartupWorkspaceRoots\(basePath:\s*string\)/)
    })

    it('T63c: pending recovery location helper is defined', () => {
      expect(sourceCode).toMatch(/function\s+getPendingRecoveryLocations\(basePath:\s*string\)/)
    })

    // T64: Recovery called during startup scan
    it('T64: recoverPendingFiles called in startupScan', () => {
      expect(sourceCode).toMatch(/await\s+recoverPendingFiles\(basePath\)/)
    })

    it('T64b: startupScan expands across configured workspace roots', () => {
      expect(sourceCode).toMatch(/const\s+scanRoots\s*=\s*Array\.from\(\s*new\s+Set\(\s*\[basePath,\s*\.\.\.ALLOWED_BASE_PATHS\]/)
    })

    it('T64c: startupScan includes constitutional and spec document discovery for each root', () => {
      expect(sourceCode).toMatch(/for\s*\(const\s+root\s+of\s+scanRoots\)/)
      expect(sourceCode).toMatch(/memoryIndexDiscovery\.findConstitutionalFiles\(root\)/)
      expect(sourceCode).toMatch(/memoryIndexDiscovery\.findSpecDocuments\(root\)/)
    })

    it('T64cc: startupScan skips inaccessible roots and deduplicates resolved paths', () => {
      expect(sourceCode).toMatch(/catch\s*\(_error:\s*unknown\)\s*\{\s*\/\/ Non-fatal: skip inaccessible startup roots\./)
      expect(sourceCode).toMatch(/const\s+resolved\s*=\s*path\.resolve\(filePath\)/)
    })

    it('T64d: pending recovery reuses shared startup root expansion', () => {
      expect(sourceCode).toMatch(/const\s+existingScanLocations\s*=\s*getPendingRecoveryLocations\(basePath\)/)
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
      { module: './core/index.js', name: 'Core module' },
      { module: './tool-schemas.js', name: 'Tool schemas (T303)' },
      { module: './tools/index.js', name: 'Tool dispatch (T303)' },
      { module: './handlers/index.js', name: 'Handlers module' },
      { module: './handlers/memory-index-discovery.js', name: 'Memory index discovery helpers' },
      { module: './utils/index.js', name: 'Utils module' },
      { module: './hooks/index.js', name: 'Hooks module' },
      { module: './startup-checks.js', name: 'Startup checks (T303)' },
      { module: './lib/architecture/layer-definitions.js', name: 'Layer definitions' },
      { module: './lib/search/vector-index.js', name: 'Vector index' },
      { module: './lib/providers/embeddings.js', name: 'Embeddings' },
      { module: './lib/storage/checkpoints.js', name: 'Checkpoints' },
      { module: './lib/storage/access-tracker.js', name: 'Access tracker' },
      { module: './lib/search/hybrid-search.js', name: 'Hybrid search' },
      { module: './lib/search/bm25-index.js', name: 'BM25 index' },
      { module: './lib/parsing/memory-parser.js', name: 'Memory parser' },
      { module: './lib/cognitive/working-memory.js', name: 'Working memory' },
      { module: './lib/cognitive/attention-decay.js', name: 'Attention decay' },
      { module: './lib/cognitive/co-activation.js', name: 'Co-activation' },
      { module: './lib/cognitive/archival-manager.js', name: 'Archival manager' },
      { module: './lib/providers/retry-manager.js', name: 'Retry manager' },
      { module: './lib/errors.js', name: 'Error utilities' },
      { module: './lib/session/session-manager.js', name: 'Session manager' },
      { module: './lib/storage/incremental-index.js', name: 'Incremental index' },
      { module: './lib/storage/transaction-manager.js', name: 'Transaction manager' },
      { module: './lib/cache/tool-cache.js', name: 'Tool cache' },
    ]

    for (const imp of EXPECTED_IMPORTS) {
      it(`T67: Imports ${imp.name} from '${imp.module}'`, () => {
        const escaped = imp.module.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')
        const importRegex = new RegExp(`import\\s+[^;]*from\\s+['"]${escaped}['"]`)
        expect(importRegex.test(sourceCode)).toBe(true)
      })
    }
  })

  // =================================================================
  // GROUP 16: buildServerInstructions() Behavior
  // =================================================================
  describe('Group 16: buildServerInstructions()', () => {
    // Local replica of DynamicMemoryStats (mirrors context-server.ts interface)
    interface DynamicMemoryStats {
      totalMemories: number
      specFolderCount: number
      activeCount: number
      staleCount: number
    }

    // Local replica of buildServerInstructions for behavioral verification.
    // The real function is module-internal (not exported), so we replicate
    // its logic here with injectable dependencies — same pattern as Group 1.
    function buildServerInstructionsReplica(
      stats: DynamicMemoryStats,
      opts: {
        bm25Enabled?: boolean
        graphEnabled?: boolean
        degreeEnabled?: boolean
        dynamicInitDisabled?: boolean
      } = {},
    ): string {
      if (opts.dynamicInitDisabled) {
        return ''
      }

      const channels: string[] = ['vector', 'fts5']
      if (opts.bm25Enabled) channels.push('bm25')
      if (opts.graphEnabled) channels.push('graph')
      if (opts.degreeEnabled) channels.push('degree')
      const staleWarning = stats.staleCount > 10
        ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
        : ''

      return [
        `Spec Kit Memory MCP has ${stats.totalMemories} indexed memories across ${stats.specFolderCount} spec folders.`,
        `Active memories: ${stats.activeCount}. Stale memories: ${stats.staleCount}.`,
        `Search channels: ${channels.join(', ')}.`,
        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
        staleWarning.trim(),
      ].filter(Boolean).join(' ')
    }

    // T68: Zero-memory edge case — returns valid non-empty string with basic server info
    it('T68: zero memories still returns valid instructions', () => {
      const stats: DynamicMemoryStats = {
        totalMemories: 0,
        specFolderCount: 0,
        activeCount: 0,
        staleCount: 0,
      }
      const result = buildServerInstructionsReplica(stats)

      // Must be a non-empty string
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)

      // Must contain basic server identification
      expect(result).toContain('Spec Kit Memory MCP')
      expect(result).toContain('0 indexed memories')
      expect(result).toContain('0 spec folders')

      // Must list key tools
      expect(result).toContain('memory_context')
      expect(result).toContain('memory_search')
      expect(result).toContain('memory_save')

      // Must list at least the two default channels
      expect(result).toContain('vector')
      expect(result).toContain('fts5')

      // No stale warning for zero stale
      expect(result).not.toContain('Warning')
    })

    // T69: Stale threshold boundary — 10 stale = no warning, 11 stale = warning
    it('T69: stale warning appears only when staleCount > 10', () => {
      const baseStats: DynamicMemoryStats = {
        totalMemories: 100,
        specFolderCount: 5,
        activeCount: 90,
        staleCount: 10,
      }

      // At boundary (10): no warning
      const atBoundary = buildServerInstructionsReplica(baseStats)
      expect(atBoundary).not.toContain('Warning')
      expect(atBoundary).not.toContain('Consider running memory_index_scan')
      expect(atBoundary).toContain('Stale memories: 10')

      // Above boundary (11): warning present
      const aboveBoundary = buildServerInstructionsReplica({
        ...baseStats,
        staleCount: 11,
        activeCount: 89,
      })
      expect(aboveBoundary).toContain('Warning: 11 stale memories detected')
      expect(aboveBoundary).toContain('Consider running memory_index_scan')

      // Well above boundary (50): warning present with correct count
      const wellAbove = buildServerInstructionsReplica({
        ...baseStats,
        staleCount: 50,
        activeCount: 50,
      })
      expect(wellAbove).toContain('Warning: 50 stale memories detected')
    })

    // T70: SPECKIT_DYNAMIC_INIT=false → empty string
    it('T70: dynamicInit disabled returns empty string', () => {
      const stats: DynamicMemoryStats = {
        totalMemories: 100,
        specFolderCount: 5,
        activeCount: 95,
        staleCount: 5,
      }

      const result = buildServerInstructionsReplica(stats, { dynamicInitDisabled: true })
      expect(result).toBe('')

      // Verify the source code routes through the canonical helper
      expect(sourceCode).toMatch(/isDynamicInitEnabled/)
      expect(sourceCode).toMatch(/if\s*\(\s*!isDynamicInitEnabled\(\)\s*\)\s*\{[\s\S]*?return\s+['"]["'];/)
    })

    // Structural verification: buildServerInstructions exists in source
    it('T70b: buildServerInstructions defined in source', () => {
      expect(sourceCode).toMatch(/async\s+function\s+buildServerInstructions\s*\(\s*\):\s*Promise<string>/)
    })

    // Structural verification: stale threshold is 10 in source
    it('T70c: stale threshold is 10 in source', () => {
      expect(sourceCode).toMatch(/stats\.staleCount\s*>\s*10/)
    })
  })

  describe('buildServerInstructions behavioral verification (006-VFT)', () => {
    it('T100: zero-memory edge case — function handles empty stats gracefully', () => {
      // buildServerInstructions formats stats.totalMemories and stats.specFolderCount
      // Verify it always wraps these in a template string (never undefined/NaN risk)
      const fnMatch = sourceCode.match(
        /async function buildServerInstructions\(\)[^{]*\{([\s\S]*?)\n\}/
      )
      expect(fnMatch).not.toBeNull()
      const fnBody = fnMatch![1]

      // Must reference stats.totalMemories in a template literal (graceful for 0)
      expect(fnBody).toMatch(/stats\.totalMemories/)
      expect(fnBody).toMatch(/stats\.specFolderCount/)
      expect(fnBody).toMatch(/stats\.activeCount/)
      expect(fnBody).toMatch(/stats\.staleCount/)

      // Must use .filter(Boolean).join — ensures empty strings (from 0-count
      // scenarios) are filtered out rather than producing "undefined" output
      expect(fnBody).toMatch(/\.filter\(Boolean\)\.join/)
    })

    it('T101: stale threshold boundary — warning only when staleCount > 10', () => {
      const fnMatch = sourceCode.match(
        /async function buildServerInstructions\(\)[^{]*\{([\s\S]*?)\n\}/
      )
      expect(fnMatch).not.toBeNull()
      const fnBody = fnMatch![1]

      // Must use strict > 10 (not >= 10), so 10 stale = no warning, 11 = warning
      expect(fnBody).toMatch(/stats\.staleCount\s*>\s*10/)
      // Must NOT use >= 10 (which would trigger at exactly 10)
      expect(fnBody).not.toMatch(/stats\.staleCount\s*>=\s*10/)
      // Warning text must include "stale memories detected"
      expect(fnBody).toMatch(/stale memories detected/)
      // Warning text must suggest memory_index_scan
      expect(fnBody).toMatch(/memory_index_scan/)
    })

    it('T102: SPECKIT_DYNAMIC_INIT=false → returns empty string immediately', () => {
      const fnMatch = sourceCode.match(
        /async function buildServerInstructions\(\)[^{]*\{([\s\S]*?)\n\}/
      )
      expect(fnMatch).not.toBeNull()
      const fnBody = fnMatch![1]

      // The env var check must be the FIRST conditional (before any stats call)
      const dynamicInitCheck = fnBody.indexOf("isDynamicInitEnabled")
      const statsCall = fnBody.indexOf("getMemoryStats")
      expect(dynamicInitCheck).toBeGreaterThan(-1)
      expect(statsCall).toBeGreaterThan(-1)
      // Dynamic init check must come BEFORE stats fetch (short-circuits)
      expect(dynamicInitCheck).toBeLessThan(statsCall)

      // Must return empty string when disabled
      expect(fnBody).toMatch(/isDynamicInitEnabled\(\)[\s\S]*?return\s*''/)
    })
  })
})
