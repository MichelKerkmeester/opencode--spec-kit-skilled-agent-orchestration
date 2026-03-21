# C6 Shared Module Boundary Audit

Scope: `.opencode/skill/system-spec-kit/shared/**/*.ts`

Direct import scan result: no `shared/*.ts` file directly imports from `mcp_server/` or `scripts/`. The findings below focus on the remaining boundary, API-surface, type-safety, organization, re-export, and documentation issues inside the shared layer.

### C6-001: Shared path helpers are still runtime-coupled to `mcp_server/database`
Severity: HIGH
Category: architecture
Location: `.opencode/skill/system-spec-kit/shared/config.ts:23`

Description: `shared/config.ts` and `shared/paths.ts` avoid direct imports from `mcp_server/`, but they still hard-code the runtime server database layout. That makes the shared package non-neutral: any consumer that wants to reuse these helpers inherits `mcp_server/database` as an implicit filesystem contract.

Evidence (code snippet):
```ts
function resolvePackageRoot(): string {
  const fromPackageJson = findUp('package.json', __dirname);
  if (fromPackageJson && fs.existsSync(path.join(fromPackageJson, 'mcp_server', 'database'))) {
    return fromPackageJson;
  }
}

const DEFAULT_DB_DIR = path.join(PACKAGE_ROOT, 'mcp_server', 'database');
const DEFAULT_DB_PATH = path.join(__dirname, '../../mcp_server/database/context-index.sqlite');
```

Impact: The shared layer cannot be reused independently of the MCP runtime layout, and boundary policy can be bypassed through filesystem assumptions instead of imports.

Recommended Fix: Move runtime-specific database path resolution behind an injected config object or a runtime-owned adapter. Keep `shared/` limited to path composition from passed-in base directories, not `mcp_server` folder discovery.

### C6-002: Two incompatible `DegradedModeContract` exports exist in the same shared surface
Severity: HIGH
Category: architecture
Location: `.opencode/skill/system-spec-kit/shared/index.ts:180`

Description: Shared defines `DegradedModeContract` twice with incompatible field naming and semantics: one in `algorithms/adaptive-fusion.ts` uses camelCase, while `contracts/retrieval-trace.ts` uses snake_case and adds `degradedStages`. `shared/index.ts` already contains a comment-based workaround to avoid exporting one of them through the barrel, which is a strong signal that the public model is conflicted.

Evidence (code snippet):
```ts
export interface DegradedModeContract {
  failureMode: string;
  fallbackMode: string;
  confidenceImpact: number;
  retryRecommendation: 'immediate' | 'delayed' | 'none';
}
```

```ts
export interface DegradedModeContract {
  failure_mode: string;
  fallback_mode: string;
  confidence_impact: number;
  retry_recommendation: 'immediate' | 'delayed' | 'none';
  degradedStages: RetrievalStage[];
}
```

```ts
// DegradedModeContract intentionally omitted — already exported by ./algorithms/adaptive-fusion
// The retrieval-trace variant adds degradedStages; import directly from contracts/retrieval-trace if needed
```

Impact: Consumers can import two different contracts with the same name, leading to accidental type drift, manual mapping code, and barrel-level ambiguity.

Recommended Fix: Consolidate to one canonical degraded-mode contract, or rename the two types so their domain boundaries are explicit and non-colliding.

### C6-003: Folder scoring relies on repeated unsafe casts instead of narrowing a real input type
Severity: MEDIUM
Category: bug
Location: `.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts:206`

Description: `FolderMemoryInput` is defined as `Partial<Memory> & Record<string, unknown>`, then the implementation repeatedly casts unknown fields to strings. The shared API accepts almost anything and recovers with assertions rather than guards.

Evidence (code snippet):
```ts
export type FolderMemoryInput = Partial<Memory> & Record<string, unknown>;

const score = computeRecencyScore(
  (m.updatedAt || m.updated_at as string | undefined || m.createdAt || m.created_at as string | undefined || '') as string,
  (m.importanceTier || m.importance_tier as string | undefined || 'normal') as string
);
```

```ts
const folder = (memory.specFolder || memory.spec_folder as string | undefined || 'unknown') as string;
```

Impact: Non-string payloads can silently pass through the shared API and be coerced into misleading values, which makes scoring bugs harder to catch at compile time and easier to ship across both scripts and runtime consumers.

Recommended Fix: Replace `Record<string, unknown>` plus assertions with an explicit union type or a normalization helper that validates snake_case and camelCase inputs before scoring.

### C6-004: Several shared exports appear to be orphaned public API surface
Severity: MEDIUM
Category: alignment
Location: `.opencode/skill/system-spec-kit/shared/utils/retry.ts:231`

Description: Consumer scans across `.opencode/skill/system-spec-kit/**/*.{ts,js}` found multiple exported symbols with no source consumer outside their declaration file or the shared barrel. The clearest cases are `getBackoffSequence` and `withRetry` in `retry.ts`, `createProfileSlug` and `parseProfileSlug` in `embeddings/profile.ts`, `getMemoryTemplateSectionRules` in `parsing/memory-template-contract.ts`, and `filterStopWords` / `extractNgrams` in `trigger-extractor.ts`.

Evidence (code snippet):
```ts
export function getBackoffSequence(config: RetryConfig = DEFAULT_CONFIG): number[] {
  const delays: number[] = [];
  for (let i = 0; i < config.maxRetries; i++) {
    delays.push(calculateBackoff(i, config));
  }
  return delays;
}

export function withRetry<T, TArgs extends unknown[]>(
  fn: (...args: TArgs) => Promise<T>,
  options: RetryOptions = {}
): (...args: TArgs) => Promise<T> {
```

```ts
export function createProfileSlug(provider: string, model: string, dim: number): string {
export function parseProfileSlug(slug: string): ParsedProfileSlug | null {
export function getMemoryTemplateSectionRules(): MemoryTemplateSectionRule[] {
```

Impact: The shared package exposes more API than the codebase actually uses, which increases maintenance burden and makes boundary ownership harder to reason about.

Recommended Fix: Either remove these exports from the public surface or add a documented consumer. If they must stay for future use, mark them as internal or experimental instead of presenting them as stable shared API.

### C6-005: Barrel depth obscures real source ownership for shared algorithms
Severity: LOW
Category: architecture
Location: `.opencode/skill/system-spec-kit/shared/index.ts:168`

Description: The algorithm exports flow through two barrel layers: `shared/index.ts` re-exports `./algorithms`, and `shared/algorithms/index.ts` re-exports each implementation with `export *`. A consumer can import from the top-level shared barrel without any clue whether the symbol comes from `rrf-fusion`, `adaptive-fusion`, or `mmr-reranker`.

Evidence (code snippet):
```ts
// shared/index.ts
export * from './algorithms';
```

```ts
// shared/algorithms/index.ts
export * from './rrf-fusion';
export * from './adaptive-fusion';
export * from './mmr-reranker';
```

```ts
// consumer
import { buildWeightedDocumentText, type WeightedDocumentSections } from '@spec-kit/shared/index';
```

Impact: Ownership is less discoverable, dead exports are harder to detect, and stack traces/import reviews require extra hops before you reach the real module.

Recommended Fix: Prefer leaf imports for non-trivial modules and keep the top-level barrel intentionally small. For algorithms, re-export only the small set of truly stable entry points.

### C6-006: `shared/embeddings.ts` exports undocumented public helpers
Severity: LOW
Category: alignment
Location: `.opencode/skill/system-spec-kit/shared/embeddings.ts:209`

Description: Several helpers are exported as part of the shared embeddings API without JSDoc or inline contract notes. The clearest examples are `buildWeightedDocumentText`, `clearEmbeddingCache`, `getEmbeddingCacheStats`, and `getProviderMetadata`.

Evidence (code snippet):
```ts
function buildWeightedDocumentText(
  sections: WeightedDocumentSections,
  maxLength: number = MAX_TEXT_LENGTH,
): string {
```

```ts
function clearEmbeddingCache(): void {
  embeddingCache.clear();
}

function getEmbeddingCacheStats(): EmbeddingCacheStats {
  return {
```

```ts
function getProviderMetadata(): ProviderMetadata | ProviderInfo {
  if (providerInstance) {
    return providerInstance.getMetadata();
  }
```

Impact: Shared consumers have to reverse-engineer behavior from implementation details, which is especially risky for cache/state helpers and weighted text-generation behavior.

Recommended Fix: Add short JSDoc for every exported helper in `embeddings.ts`, especially around input expectations, side effects, and whether the function is intended for external consumers or only compatibility wrappers.
