// ────────────────────────────────────────────────────────────────
// MODULE: Index
// ────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'node:url';

type ModuleLoader<TModule extends object> = () => Promise<TModule>;

async function loadHandlerModule<TModule extends object>(moduleName: string): Promise<TModule> {
  const basePath = path.join(import.meta.dirname, moduleName);
  const candidatePaths = [`${basePath}.js`, `${basePath}.ts`, basePath];

  for (const candidatePath of candidatePaths) {
    if (fs.existsSync(candidatePath)) {
      return await import(pathToFileURL(candidatePath).href) as TModule;
    }
  }

  return await import(pathToFileURL(basePath).href) as TModule;
}

function lazyFunction<
  TModule extends Record<string, unknown>,
  TKey extends keyof TModule,
>(load: ModuleLoader<TModule>, key: TKey): TModule[TKey] {
  return (async (...args: unknown[]) => {
    const module = await load();
    const fn = module[key];
    if (typeof fn !== 'function') {
      throw new Error(`Lazy export '${String(key)}' is not callable`);
    }
    return await (fn as (...fnArgs: unknown[]) => unknown)(...args);
  }) as TModule[TKey];
}

function lazyModule<TModule extends object>(load: ModuleLoader<TModule>): TModule {
  return new Proxy({} as TModule, {
    get(_target, property, receiver) {
      return async (...args: unknown[]) => {
        const module = await load();
        const loadedValue = Reflect.get(module as object, property, receiver);
        if (typeof loadedValue === 'function') {
          return await (loadedValue as (...fnArgs: unknown[]) => unknown)(...args);
        }
        return loadedValue;
      };
    },
    has(_target, property) {
      return typeof property === 'string';
    },
    ownKeys() {
      return [];
    },
    getOwnPropertyDescriptor(_target, _property) {
      return {
        configurable: true,
        enumerable: true,
      };
    },
  });
}

type MemorySearchModule = typeof import('./memory-search.js');
type MemoryTriggersModule = typeof import('./memory-triggers.js');
type MemorySaveModule = typeof import('./memory-save.js');
type PeGatingModule = typeof import('./pe-gating.js');
type MemoryIngestModule = typeof import('./memory-ingest.js');
type MemoryCrudModule = typeof import('./memory-crud.js');
type MemoryIndexModule = typeof import('./memory-index.js');
type MemoryBulkDeleteModule = typeof import('./memory-bulk-delete.js');
type CheckpointsModule = typeof import('./checkpoints.js');
type SessionLearningModule = typeof import('./session-learning.js');
type EvalReportingModule = typeof import('./eval-reporting.js');
type CausalGraphModule = typeof import('./causal-graph.js');
type MemoryContextModule = typeof import('./memory-context.js');
type SharedMemoryModule = typeof import('./shared-memory.js');
type SessionHealthModule = typeof import('./session-health.js');
type SessionResumeModule = typeof import('./session-resume.js');
type SessionBootstrapModule = typeof import('./session-bootstrap.js');

let memorySearchModule: Promise<MemorySearchModule> | null = null;
let memoryTriggersModule: Promise<MemoryTriggersModule> | null = null;
let memorySaveModule: Promise<MemorySaveModule> | null = null;
let peGatingModule: Promise<PeGatingModule> | null = null;
let memoryIngestModule: Promise<MemoryIngestModule> | null = null;
let memoryCrudModule: Promise<MemoryCrudModule> | null = null;
let memoryIndexModule: Promise<MemoryIndexModule> | null = null;
let memoryBulkDeleteModule: Promise<MemoryBulkDeleteModule> | null = null;
let checkpointsModule: Promise<CheckpointsModule> | null = null;
let sessionLearningModule: Promise<SessionLearningModule> | null = null;
let evalReportingModule: Promise<EvalReportingModule> | null = null;
let causalGraphModule: Promise<CausalGraphModule> | null = null;
let memoryContextModule: Promise<MemoryContextModule> | null = null;
let sharedMemoryModule: Promise<SharedMemoryModule> | null = null;
let sessionHealthModule: Promise<SessionHealthModule> | null = null;
let sessionResumeModule: Promise<SessionResumeModule> | null = null;
let sessionBootstrapModule: Promise<SessionBootstrapModule> | null = null;

function getMemorySearchModule(): Promise<MemorySearchModule> {
  if (!memorySearchModule) {
    memorySearchModule = loadHandlerModule<MemorySearchModule>('memory-search');
  }
  return memorySearchModule;
}

function getMemoryTriggersModule(): Promise<MemoryTriggersModule> {
  if (!memoryTriggersModule) {
    memoryTriggersModule = loadHandlerModule<MemoryTriggersModule>('memory-triggers');
  }
  return memoryTriggersModule;
}

function getMemorySaveModule(): Promise<MemorySaveModule> {
  if (!memorySaveModule) {
    memorySaveModule = loadHandlerModule<MemorySaveModule>('memory-save');
  }
  return memorySaveModule;
}

function getPeGatingModule(): Promise<PeGatingModule> {
  if (!peGatingModule) {
    peGatingModule = loadHandlerModule<PeGatingModule>('pe-gating');
  }
  return peGatingModule;
}

function getMemoryIngestModule(): Promise<MemoryIngestModule> {
  if (!memoryIngestModule) {
    memoryIngestModule = loadHandlerModule<MemoryIngestModule>('memory-ingest');
  }
  return memoryIngestModule;
}

function getMemoryCrudModule(): Promise<MemoryCrudModule> {
  if (!memoryCrudModule) {
    memoryCrudModule = loadHandlerModule<MemoryCrudModule>('memory-crud');
  }
  return memoryCrudModule;
}

function getMemoryIndexModule(): Promise<MemoryIndexModule> {
  if (!memoryIndexModule) {
    memoryIndexModule = loadHandlerModule<MemoryIndexModule>('memory-index');
  }
  return memoryIndexModule;
}

function getMemoryBulkDeleteModule(): Promise<MemoryBulkDeleteModule> {
  if (!memoryBulkDeleteModule) {
    memoryBulkDeleteModule = loadHandlerModule<MemoryBulkDeleteModule>('memory-bulk-delete');
  }
  return memoryBulkDeleteModule;
}

function getCheckpointsModule(): Promise<CheckpointsModule> {
  if (!checkpointsModule) {
    checkpointsModule = loadHandlerModule<CheckpointsModule>('checkpoints');
  }
  return checkpointsModule;
}

function getSessionLearningModule(): Promise<SessionLearningModule> {
  if (!sessionLearningModule) {
    sessionLearningModule = loadHandlerModule<SessionLearningModule>('session-learning');
  }
  return sessionLearningModule;
}

function getEvalReportingModule(): Promise<EvalReportingModule> {
  if (!evalReportingModule) {
    evalReportingModule = loadHandlerModule<EvalReportingModule>('eval-reporting');
  }
  return evalReportingModule;
}

function getCausalGraphModule(): Promise<CausalGraphModule> {
  if (!causalGraphModule) {
    causalGraphModule = loadHandlerModule<CausalGraphModule>('causal-graph');
  }
  return causalGraphModule;
}

function getMemoryContextModule(): Promise<MemoryContextModule> {
  if (!memoryContextModule) {
    memoryContextModule = loadHandlerModule<MemoryContextModule>('memory-context');
  }
  return memoryContextModule;
}

function getSharedMemoryModule(): Promise<SharedMemoryModule> {
  if (!sharedMemoryModule) {
    sharedMemoryModule = loadHandlerModule<SharedMemoryModule>('shared-memory');
  }
  return sharedMemoryModule;
}

function getSessionHealthModule(): Promise<SessionHealthModule> {
  if (!sessionHealthModule) {
    sessionHealthModule = loadHandlerModule<SessionHealthModule>('session-health');
  }
  return sessionHealthModule;
}

function getSessionResumeModule(): Promise<SessionResumeModule> {
  if (!sessionResumeModule) {
    sessionResumeModule = loadHandlerModule<SessionResumeModule>('session-resume');
  }
  return sessionResumeModule;
}

function getSessionBootstrapModule(): Promise<SessionBootstrapModule> {
  if (!sessionBootstrapModule) {
    sessionBootstrapModule = loadHandlerModule<SessionBootstrapModule>('session-bootstrap');
  }
  return sessionBootstrapModule;
}

// Memory search handlers
export const handleMemorySearch = lazyFunction(getMemorySearchModule, 'handleMemorySearch');
export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');

// Memory triggers handlers
export const handleMemoryMatchTriggers = lazyFunction(getMemoryTriggersModule, 'handleMemoryMatchTriggers');
export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');

// Memory save handlers
export const handleMemorySave = lazyFunction(getMemorySaveModule, 'handleMemorySave');
export const indexMemoryFile = lazyFunction(getMemorySaveModule, 'indexMemoryFile');
export const atomicSaveMemory = lazyFunction(getMemorySaveModule, 'atomicSaveMemory');
export const getAtomicityMetrics = lazyFunction(getMemorySaveModule, 'getAtomicityMetrics');
export const handle_memory_save = lazyFunction(getMemorySaveModule, 'handle_memory_save');
export const index_memory_file = lazyFunction(getMemorySaveModule, 'index_memory_file');
export const atomic_save_memory = lazyFunction(getMemorySaveModule, 'atomic_save_memory');
export const get_atomicity_metrics = lazyFunction(getMemorySaveModule, 'get_atomicity_metrics');

// PE-gating handlers
export const calculateDocumentWeight = lazyFunction(getPeGatingModule, 'calculateDocumentWeight');
export const isSpecDocumentType = lazyFunction(getPeGatingModule, 'isSpecDocumentType');
export const findSimilarMemories = lazyFunction(getPeGatingModule, 'findSimilarMemories');
export const reinforceExistingMemory = lazyFunction(getPeGatingModule, 'reinforceExistingMemory');
export const markMemorySuperseded = lazyFunction(getPeGatingModule, 'markMemorySuperseded');
export const updateExistingMemory = lazyFunction(getPeGatingModule, 'updateExistingMemory');
export const logPeDecision = lazyFunction(getPeGatingModule, 'logPeDecision');

// Memory ingest handlers
export const handleMemoryIngestStart = lazyFunction(getMemoryIngestModule, 'handleMemoryIngestStart');
export const handleMemoryIngestStatus = lazyFunction(getMemoryIngestModule, 'handleMemoryIngestStatus');
export const handleMemoryIngestCancel = lazyFunction(getMemoryIngestModule, 'handleMemoryIngestCancel');
export const handle_memory_ingest_start = lazyFunction(getMemoryIngestModule, 'handle_memory_ingest_start');
export const handle_memory_ingest_status = lazyFunction(getMemoryIngestModule, 'handle_memory_ingest_status');
export const handle_memory_ingest_cancel = lazyFunction(getMemoryIngestModule, 'handle_memory_ingest_cancel');

// Memory CRUD handlers
export const handleMemoryDelete = lazyFunction(getMemoryCrudModule, 'handleMemoryDelete');
export const handleMemoryUpdate = lazyFunction(getMemoryCrudModule, 'handleMemoryUpdate');
export const handleMemoryList = lazyFunction(getMemoryCrudModule, 'handleMemoryList');
export const handleMemoryStats = lazyFunction(getMemoryCrudModule, 'handleMemoryStats');
export const handleMemoryHealth = lazyFunction(getMemoryCrudModule, 'handleMemoryHealth');
export const setEmbeddingModelReady = lazyFunction(getMemoryCrudModule, 'setEmbeddingModelReady');
export const isEmbeddingModelReady = lazyFunction(getMemoryCrudModule, 'isEmbeddingModelReady');
export const handle_memory_delete = lazyFunction(getMemoryCrudModule, 'handle_memory_delete');
export const handle_memory_update = lazyFunction(getMemoryCrudModule, 'handle_memory_update');
export const handle_memory_list = lazyFunction(getMemoryCrudModule, 'handle_memory_list');
export const handle_memory_stats = lazyFunction(getMemoryCrudModule, 'handle_memory_stats');
export const handle_memory_health = lazyFunction(getMemoryCrudModule, 'handle_memory_health');
export const set_embedding_model_ready = lazyFunction(getMemoryCrudModule, 'set_embedding_model_ready');
export const is_embedding_model_ready = lazyFunction(getMemoryCrudModule, 'is_embedding_model_ready');

// Memory index handlers
export const handleMemoryIndexScan = lazyFunction(getMemoryIndexModule, 'handleMemoryIndexScan');
export const indexSingleFile = lazyFunction(getMemoryIndexModule, 'indexSingleFile');
export const findConstitutionalFiles = lazyFunction(getMemoryIndexModule, 'findConstitutionalFiles');
export const handle_memory_index_scan = lazyFunction(getMemoryIndexModule, 'handle_memory_index_scan');
export const index_single_file = lazyFunction(getMemoryIndexModule, 'index_single_file');
export const find_constitutional_files = lazyFunction(getMemoryIndexModule, 'find_constitutional_files');

// Memory bulk delete handler
export const handleMemoryBulkDelete = lazyFunction(getMemoryBulkDeleteModule, 'handleMemoryBulkDelete');

// Checkpoint handlers
export const handleCheckpointCreate = lazyFunction(getCheckpointsModule, 'handleCheckpointCreate');
export const handleCheckpointList = lazyFunction(getCheckpointsModule, 'handleCheckpointList');
export const handleCheckpointRestore = lazyFunction(getCheckpointsModule, 'handleCheckpointRestore');
export const handleCheckpointDelete = lazyFunction(getCheckpointsModule, 'handleCheckpointDelete');
export const handleMemoryValidate = lazyFunction(getCheckpointsModule, 'handleMemoryValidate');
export const handle_checkpoint_create = lazyFunction(getCheckpointsModule, 'handle_checkpoint_create');
export const handle_checkpoint_list = lazyFunction(getCheckpointsModule, 'handle_checkpoint_list');
export const handle_checkpoint_restore = lazyFunction(getCheckpointsModule, 'handle_checkpoint_restore');
export const handle_checkpoint_delete = lazyFunction(getCheckpointsModule, 'handle_checkpoint_delete');
export const handle_memory_validate = lazyFunction(getCheckpointsModule, 'handle_memory_validate');

// Session learning handlers
export const handleTaskPreflight = lazyFunction(getSessionLearningModule, 'handleTaskPreflight');
export const handleTaskPostflight = lazyFunction(getSessionLearningModule, 'handleTaskPostflight');
export const handleGetLearningHistory = lazyFunction(getSessionLearningModule, 'handleGetLearningHistory');
export const handle_task_preflight = lazyFunction(getSessionLearningModule, 'handle_task_preflight');
export const handle_task_postflight = lazyFunction(getSessionLearningModule, 'handle_task_postflight');
export const handle_get_learning_history = lazyFunction(getSessionLearningModule, 'handle_get_learning_history');

// Eval reporting handlers
export const handleEvalRunAblation = lazyFunction(getEvalReportingModule, 'handleEvalRunAblation');
export const handleEvalReportingDashboard = lazyFunction(getEvalReportingModule, 'handleEvalReportingDashboard');
export const handle_eval_run_ablation = lazyFunction(getEvalReportingModule, 'handle_eval_run_ablation');
export const handle_eval_reporting_dashboard = lazyFunction(getEvalReportingModule, 'handle_eval_reporting_dashboard');

// Causal graph handlers
export const handleMemoryDriftWhy = lazyFunction(getCausalGraphModule, 'handleMemoryDriftWhy');
export const handleMemoryCausalLink = lazyFunction(getCausalGraphModule, 'handleMemoryCausalLink');
export const handleMemoryCausalStats = lazyFunction(getCausalGraphModule, 'handleMemoryCausalStats');
export const handleMemoryCausalUnlink = lazyFunction(getCausalGraphModule, 'handleMemoryCausalUnlink');
export const handle_memory_drift_why = lazyFunction(getCausalGraphModule, 'handle_memory_drift_why');
export const handle_memory_causal_link = lazyFunction(getCausalGraphModule, 'handle_memory_causal_link');
export const handle_memory_causal_stats = lazyFunction(getCausalGraphModule, 'handle_memory_causal_stats');
export const handle_memory_causal_unlink = lazyFunction(getCausalGraphModule, 'handle_memory_causal_unlink');

// Memory context handler
export const handleMemoryContext = lazyFunction(getMemoryContextModule, 'handleMemoryContext');
export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');

// Shared memory handlers
export const handleSharedMemoryEnable = lazyFunction(getSharedMemoryModule, 'handleSharedMemoryEnable');
export const handleSharedMemoryStatus = lazyFunction(getSharedMemoryModule, 'handleSharedMemoryStatus');
export const handleSharedSpaceMembershipSet = lazyFunction(getSharedMemoryModule, 'handleSharedSpaceMembershipSet');
export const handleSharedSpaceUpsert = lazyFunction(getSharedMemoryModule, 'handleSharedSpaceUpsert');

// Session health handler
export const handleSessionHealth = lazyFunction(getSessionHealthModule, 'handleSessionHealth');

// Session resume handler
export const handleSessionResume = lazyFunction(getSessionResumeModule, 'handleSessionResume');

// Session bootstrap handler
export const handleSessionBootstrap = lazyFunction(getSessionBootstrapModule, 'handleSessionBootstrap');

// Sub-module references
export const memorySave = lazyModule(getMemorySaveModule);
export const memoryIndex = lazyModule(getMemoryIndexModule);
export const memoryBulkDelete = lazyModule(getMemoryBulkDeleteModule);
export const checkpoints = lazyModule(getCheckpointsModule);
