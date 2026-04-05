# C1 Handler Analysis

Scope: `.opencode/skill/system-spec-kit/mcp_server/handlers/**/*.ts`

Summary:
- Total findings: 10
- CRITICAL: 1
- HIGH: 4
- MEDIUM: 2
- LOW: 3
- Direct handler-to-handler import cycles detected: 0
- Highest circular-risk chains observed: `memory-context.ts -> memory-search.ts`, `memory-index.ts -> memory-save.ts -> save/*`

### C1-001: Oversized handler cluster breaches the 500 LOC threshold
Severity: HIGH
Category: architecture
Location: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1`
Description:
Nine handler files exceed the stated 500 LOC god-object threshold. The largest are not borderline cases; several are 600-1400 LOC and already span multiple architectural concerns.

Exact line counts:
- `memory-save.ts`: 1402
- `memory-search.ts`: 1263
- `memory-context.ts`: 980
- `session-learning.ts`: 748
- `causal-graph.ts`: 745
- `quality-loop.ts`: 715
- `memory-index.ts`: 647
- `memory-crud-health.ts`: 596
- `chunking-orchestrator.ts`: 591

Evidence (code snippet):
```text
    1402 .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
    1263 .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
     980 .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
     748 .opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts
     745 .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
     715 .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts
     647 .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
     596 .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
     591 .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts
```
Impact:
Reviewability, change isolation, and ownership boundaries are already degraded. This is the root condition that makes the circular-risk and responsibility findings below likely.
Recommended Fix:
Set a handler target of roughly 150-250 LOC and move orchestration into `lib/` services. Treat handlers as transport adapters: validate input, call a service, map the response.

### C1-002: `memory-save.ts` is acting as transport adapter, save orchestrator, governance engine, and enrichment pipeline at once
Severity: CRITICAL
Category: alignment
Location: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:8`
Description:
`memory-save.ts` is not a thin handler anymore. It imports persistence, parsing, quality scoring, governance, collaboration, deduplication, embeddings, PE gating, reconsolidation, post-insert enrichment, causal processing, and response building from one boundary module. At 1402 LOC, the file is effectively the save service layer living inside `handlers/`.
Evidence (code snippet):
```ts
import * as memoryParser from '../lib/parsing/memory-parser';
import * as transactionManager from '../lib/storage/transaction-manager';
import * as preflight from '../lib/validation/preflight';
import { createAppendOnlyMemoryRecord, recordLineageVersion } from '../lib/storage/lineage-state';
import { findSimilarMemories } from './pe-gating';
import { runPostMutationHooks } from './mutation-hooks';
import { needsChunking, indexChunkedMemoryFile } from './chunking-orchestrator';
import { createMemoryRecord, findSamePathExistingMemory, type MemoryScopeMatch } from './save/create-record';
import { computeMemoryQualityScore, attemptAutoFix, runQualityLoop, isQualityLoopEnabled } from './quality-loop';
import { generateOrCacheEmbedding, persistPendingEmbeddingCacheWrite } from './save/embedding-pipeline';
import { runReconsolidationIfEnabled } from './save/reconsolidation-bridge';
import { runPostInsertEnrichment } from './save/post-insert';
import { buildIndexResult, buildSaveResponse } from './save/response-builder';
```
Impact:
Every save-path change now couples MCP transport, domain rules, persistence, and post-processing. That makes testing expensive, reuse awkward, and future decomposition risky because callers already depend on handler-local orchestration.
Recommended Fix:
Create a `lib/save/memory-save-service.ts` or similar orchestration service. Keep the handler limited to request validation, request ID creation, service invocation, and envelope formatting.

### C1-003: `memory-search.ts` still contains the search service instead of calling one
Severity: HIGH
Category: alignment
Location: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:8`
Description:
The search boundary is similarly overloaded. `memory-search.ts` owns pipeline execution, session management, routing, telemetry, eval logging, trace construction, formatting, and fallback behavior inside a 1263 LOC handler. That is service-layer behavior, not handler-layer behavior.
Evidence (code snippet):
```ts
import * as toolCache from '../lib/cache/tool-cache';
import * as sessionManager from '../lib/session/session-manager';
import * as intentClassifier from '../lib/search/intent-classifier';
import { executePipeline } from '../lib/search/pipeline';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger';
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry';
import { applyRoutingWeights, getStrategyForQuery } from '../lib/search/artifact-routing';
import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger';
import { createMCPErrorResponse } from '../lib/response/envelope';
import { formatSearchResults } from '../formatters';
import { createTrace } from '@spec-kit/shared/contracts/retrieval-trace';
```
Impact:
Search behavior is now anchored to the handler module, which makes alternate entry points, testing, and future API separation harder than necessary.
Recommended Fix:
Extract a `lib/search/memory-search-service.ts` that returns a domain result object. Leave `memory-search.ts` responsible only for input validation and MCP response mapping.

### C1-004: `memory-context.ts` composes sibling handlers directly, creating circular-import pressure
Severity: HIGH
Category: architecture
Location: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:16`
Description:
There is no direct cycle today, but `memory-context.ts` imports and invokes sibling handlers as if they were internal services. That couples transport-layer modules to each other and makes future reverse imports dangerous.

Observed chain:
- `memory-context.ts -> memory-search.ts`
- `memory-context.ts -> memory-triggers.ts`

Evidence (code snippet):
```ts
import { handleMemorySearch } from './memory-search';
import { handleMemoryMatchTriggers } from './memory-triggers';

async function executeQuickStrategy(input: string, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemoryMatchTriggers({
    prompt: input,
    limit: options.limit || 5,
    session_id: options.sessionId,
    include_cognitive: true
  });
}

async function executeDeepStrategy(input: string, options: ContextOptions): Promise<ContextResult> {
  const result = await handleMemorySearch({
    query: input,
    specFolder: options.specFolder,
    // ...
  });
}
```
Impact:
Any future import back from `memory-search.ts` or `memory-triggers.ts` into context orchestration will immediately close a cycle. It also means one handler is consuming another handler's MCP-shaped contract instead of a stable service contract.
Recommended Fix:
Promote the quick/deep/focused retrieval strategies into a `lib/context/` or `lib/search/` orchestration service, and have all three handlers depend on that service instead of each other.

### C1-005: `memory-index.ts` reuses `memory-save.ts` as a shared indexing service
Severity: MEDIUM
Category: architecture
Location: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:135`
Description:
`memory-index.ts` imports `indexMemoryFile` out of `memory-save.ts`, which creates a second handler-to-handler dependency spine. The current graph is still acyclic, but this path is risky because the target file is already the largest boundary object in the directory.

Observed chain:
- `memory-index.ts -> memory-save.ts -> save/index.ts`
- `memory-index.ts -> memory-save.ts -> chunking-orchestrator.ts`
- `memory-index.ts -> memory-save.ts -> quality-loop.ts`

Evidence (code snippet):
```ts
import { indexMemoryFile } from './memory-save';

/** Index a single memory file, delegating to the shared indexMemoryFile logic */
async function indexSingleFile(filePath: string, force: boolean = false): Promise<IndexResult> {
  return indexMemoryFile(filePath, { force });
}
```
Impact:
The indexing flow is forced to depend on the entire save handler boundary. That raises cycle risk, broadens test setup, and makes it harder to separate batch indexing from MCP request handling.
Recommended Fix:
Move `indexMemoryFile` into a service module under `lib/indexing/` or `lib/save/`, and have both handlers call that shared service.

### C1-006: Save mutex queue suppresses prior failures with an empty catch
Severity: HIGH
Category: bug
Location: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:128`
Description:
The per-spec-folder lock chain intentionally clears the previous promise rejection before starting the next save, but it does so with an empty `.catch` that records nothing. This preserves queue progress at the cost of completely discarding failure context.
Evidence (code snippet):
```ts
async function withSpecFolderLock<T>(specFolder: string, fn: () => Promise<T>): Promise<T> {
  const normalizedFolder = specFolder || '__global__';
  const chain = (SPEC_FOLDER_LOCKS.get(normalizedFolder) ?? Promise.resolve())
    .catch((_error: unknown) => {})
    .then(() => fn());
  SPEC_FOLDER_LOCKS.set(normalizedFolder, chain);
```
Impact:
When one save fails, the next queued save proceeds with no warning, telemetry, or retained error state. That makes lock poisoning, race-related failures, and intermittent save regressions materially harder to diagnose.
Recommended Fix:
Keep the queue-draining behavior, but log the discarded error or store it in lock metadata so the next operation can emit structured diagnostics.

### C1-007: Context telemetry and eval logging discard exceptions silently
Severity: MEDIUM
Category: bug
Location: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:902`
Description:
The context handler uses multiple bare `catch {}` blocks around result extraction, consumption logging, and eval logging. These paths are marked fail-safe, but they are also fully silent, so regressions in observability disappear instead of being downgraded and surfaced.
Evidence (code snippet):
```ts
      } catch {
        // Intentional no-op — error deliberately discarded
      }
      logConsumptionEvent(db, {
        event_type: 'context',
        query_text: normalizedInput,
        // ...
      });
    }
  } catch {
    // Intentional no-op — error deliberately discarded
  }
```
Impact:
If parsing or telemetry breaks, operators lose the signal that context retrieval observability is degraded. This makes auditability and production debugging weaker without any compensating trace.
Recommended Fix:
Keep these paths non-fatal, but emit a structured warning or telemetry counter for discarded exceptions.

### C1-008: `causal-links-processor.ts` exposes a dead backward-compatibility re-export
Severity: LOW
Category: architecture
Location: `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:178`
Description:
`detectSpecLevelFromParsed` is re-exported from `causal-links-processor.ts`, but repository-wide usage points directly at `handler-utils.ts`; no importer references this compatibility surface.
Evidence (code snippet):
```ts
// Re-export from handler-utils for backward compatibility
export { detectSpecLevelFromParsed } from './handler-utils';
```
Impact:
This keeps an obsolete public path alive, which makes the handler surface area look broader than it really is and creates misleading compatibility promises.
Recommended Fix:
Remove the re-export, or add a current caller if the compatibility path is still intentional and should be tested.

### C1-009: `SpecDiscoveryOptions` is exported but never imported anywhere
Severity: LOW
Category: architecture
Location: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:39`
Description:
`SpecDiscoveryOptions` appears only in its declaration and in the local `findSpecDocuments` signature. A repository-wide search found no imports of the type.
Evidence (code snippet):
```ts
export interface SpecDiscoveryOptions {
  specFolder?: string | null;
}

export function findSpecDocuments(workspacePath: string, options: SpecDiscoveryOptions = {}): string[] {
```
Impact:
Unused exported types enlarge the module's public API and mislead readers about intended reuse.
Recommended Fix:
Make the interface local if it is implementation-only, or move it into shared types when an external consumer actually exists.

### C1-010: `session-learning.ts` exports several internal-only response-shape types
Severity: LOW
Category: architecture
Location: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:58`
Description:
`LearningDeltaSnapshot`, `LearningHistoryBaseRow`, `PreflightLearningHistoryRow`, `CompletedLearningHistoryRow`, and `LearningHistorySummary` are exported, but repo-wide imports only consume `LearningHistoryPayload` and `LearningHistoryRow`. The extra exported shapes appear to be implementation-local.
Evidence (code snippet):
```ts
export interface LearningDeltaSnapshot {
  knowledge: number | null;
  uncertainty: number | null;
  context: number | null;
}

export interface LearningHistoryBaseRow {
  taskId: string;
  specFolder: string;
  sessionId: string | null;
  phase: 'preflight' | 'complete';
  preflight: LearningScoreSnapshot;
  knowledgeGaps: string[];
  createdAt: string | null;
}
```
Impact:
The public type surface is broader than actual consumers require, which increases maintenance burden and makes refactors look riskier than they are.
Recommended Fix:
Keep only externally consumed contracts exported. Make the row/detail types local until another module truly depends on them.
