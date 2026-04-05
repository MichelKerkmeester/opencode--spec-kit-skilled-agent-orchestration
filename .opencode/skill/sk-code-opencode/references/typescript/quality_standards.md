---
title: TypeScript Quality Standards
description: Type system patterns, error handling, documentation, async patterns, and tsconfig baseline for TypeScript files in the OpenCode development environment.
---

# TypeScript Quality Standards

Type system patterns, error handling, documentation, async patterns, and tsconfig baseline for TypeScript files in the OpenCode development environment.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Establishes type system patterns, error handling, documentation, async patterns, and tsconfig baseline that all TypeScript code in the OpenCode development environment must follow.

### When to Use

- Writing new TypeScript modules
- Reviewing TypeScript code for quality compliance
- Setting up type safety, error handling, and documentation patterns

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:interface-vs-type-decision-guide -->
## 2. INTERFACE vs TYPE DECISION GUIDE

### When to Use `interface`

Use `interface` for object shapes, class contracts, and data structures:

```typescript
// Object shapes
interface SearchResult {
  readonly id: string;
  score: number;
  text: string;
  metadata: Record<string, unknown>;
}

// Class contracts
interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
  batchEmbed(texts: string[]): Promise<number[][]>;
  getDimension(): number;
  getModelName(): string;
  isReady(): boolean;
}

// Extending shapes
interface DetailedSearchResult extends SearchResult {
  highlights: string[];
  explanation: string;
}
```

**Why interfaces for objects**: Interfaces support declaration merging, provide clearer error messages, and signal "this is a data contract" to the reader.

### When to Use `type`

Use `type` for unions, intersections, mapped types, conditional types, and function signatures:

```typescript
// Union types
type MemoryState = 'active' | 'archived' | 'pending' | 'deleted';

// Intersection types
type Timestamped<T> = T & { createdAt: number; updatedAt: number };

// Function signatures
type ScoreCalculator = (input: number, weight: number) => number;

// Conditional types
type AsyncReturn<T> = T extends Promise<infer U> ? U : T;

// Mapped types
type Nullable<T> = { [K in keyof T]: T[K] | null };

// Tuple types
type Coordinates = [x: number, y: number];
```

### Decision Summary

| Use Case                           | Construct   | Reason                          |
|------------------------------------|-------------|---------------------------------|
| Object shapes / data structures    | `interface` | Extensible, clear error messages|
| Class contracts                    | `interface` | Supports `implements`           |
| Union types                        | `type`      | Only `type` supports unions     |
| Intersection / mapped / conditional| `type`      | Only `type` supports these      |
| Function signatures (standalone)   | `type`      | Cleaner syntax than interface    |
| Simple primitives / literals       | `type`      | `type ID = string`              |

---

<!-- /ANCHOR:interface-vs-type-decision-guide -->
<!-- ANCHOR:type-safety-policies -->
## 3. TYPE SAFETY POLICIES

### `unknown` Over `any`

**Policy**: Use `unknown` instead of `any` in public API surfaces. The `any` type disables type checking entirely. `unknown` forces callers to narrow the type before use.

```typescript
// CORRECT — unknown forces type narrowing
function parseInput(raw: unknown): SearchConfig {
  if (typeof raw !== 'object' || raw === null) {
    throw new TypeError('Expected object input');
  }
  const obj = raw as Record<string, unknown>;
  // validate and narrow further...
  return obj as SearchConfig;
}

// INCORRECT — any disables all type checking
function parseInput(raw: any): SearchConfig {
  return raw;  // No validation, no safety
}
```

**Permitted `any` usage** (must include justification comment):

```typescript
// Interop with untyped third-party library (sqlite-vec native module)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sqliteVec = require('sqlite-vec') as any;
```

### Strict Null Checks

With `strictNullChecks: true`, `null` and `undefined` must be handled explicitly:

```typescript
// CORRECT — explicit null handling
function findMemory(id: string): MemoryRecord | null {
  const record = database.get(id);
  if (!record) return null;
  return record;
}

// Usage requires null check
const memory = findMemory('abc');
if (memory !== null) {
  console.log(memory.text);  // TypeScript knows memory is not null here
}
```

### Non-Null Assertions

**Policy**: Avoid non-null assertions (`!`). When absolutely necessary, include a justification comment:

```typescript
// AVOID — non-null assertion hides potential bugs
const name = user!.name;

// PREFERRED — explicit null check
if (user === null) throw new Error('User not found');
const name = user.name;

// PERMITTED — with justification
// Process guarantees element exists after validation phase (see line 42)
const element = document.getElementById('root')!;
```

### Generic Constraints

Use `extends` to constrain generic type parameters:

```typescript
// CORRECT — constrained generic
function getProperty<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  key: K,
): T[K] {
  return obj[key];
}

// CORRECT — constraint ensures required shape
interface HasId { readonly id: string; }
function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// INCORRECT — unconstrained when constraint is needed
function getProperty<T>(obj: T, key: string): unknown {
  return (obj as Record<string, unknown>)[key];  // Loses type safety
}
```

---

<!-- /ANCHOR:type-safety-policies -->
<!-- ANCHOR:discriminated-unions -->
## 4. DISCRIMINATED UNIONS

Use discriminated unions for state management where an object can be in one of several distinct states:

```typescript
// Discriminated union for operation results
interface SuccessResult<T> {
  readonly success: true;
  readonly data: T;
}

interface ErrorResult {
  readonly success: false;
  readonly error: string;
  readonly code: ErrorCode;
}

type OperationResult<T> = SuccessResult<T> | ErrorResult;

// Usage — TypeScript narrows automatically
function handleResult(result: OperationResult<SearchResult[]>): void {
  if (result.success) {
    // TypeScript knows: result.data exists
    console.log(`Found ${result.data.length} results`);
  } else {
    // TypeScript knows: result.error and result.code exist
    console.error(`Error ${result.code}: ${result.error}`);
  }
}
```

### State Machine Pattern

```typescript
type ConnectionState =
  | { status: 'disconnected' }
  | { status: 'connecting'; attempt: number }
  | { status: 'connected'; connection: DatabaseConnection }
  | { status: 'error'; error: Error; lastAttempt: number };

function getConnectionInfo(state: ConnectionState): string {
  switch (state.status) {
    case 'disconnected':
      return 'Not connected';
    case 'connecting':
      return `Connecting (attempt ${state.attempt})`;
    case 'connected':
      return `Connected to ${state.connection.host}`;
    case 'error':
      return `Error: ${state.error.message}`;
  }
}
```

---

<!-- /ANCHOR:discriminated-unions -->
<!-- ANCHOR:utility-types -->
## 5. UTILITY TYPES

### Standard TypeScript Utility Types

Use built-in utility types instead of reinventing them:

| Utility Type       | Purpose                                    | Example                                     |
|--------------------|--------------------------------------------|---------------------------------------------|
| `Partial<T>`      | All properties optional                    | `Partial<SearchConfig>` for update payloads  |
| `Required<T>`     | All properties required                    | `Required<OptionalConfig>` for validated config |
| `Pick<T, K>`      | Select specific properties                 | `Pick<MemoryRecord, 'id' \| 'text'>`        |
| `Omit<T, K>`      | Exclude specific properties                | `Omit<MemoryRecord, 'internalScore'>`        |
| `Record<K, V>`    | Object with typed keys and values          | `Record<string, unknown>` for metadata       |
| `Readonly<T>`     | All properties readonly                    | `Readonly<SearchConfig>` for immutable config |
| `ReadonlyArray<T>`| Immutable array                            | `ReadonlyArray<string>` or `readonly string[]`|
| `NonNullable<T>`  | Exclude null and undefined                 | `NonNullable<string \| null>` = `string`     |
| `ReturnType<T>`   | Extract function return type               | `ReturnType<typeof calculateScore>`          |
| `Parameters<T>`   | Extract function parameter types as tuple  | `Parameters<typeof search>`                  |

### Common Patterns in OpenCode

```typescript
// Configuration with optional overrides
function configure(overrides: Partial<SearchConfig>): SearchConfig {
  return { ...DEFAULT_CONFIG, ...overrides };
}

// Immutable configuration
const FROZEN_CONFIG: Readonly<SearchConfig> = Object.freeze({
  maxResults: 100,
  timeout: 5000,
  includeMetadata: true,
});

// Metadata as untyped key-value pairs
interface MemoryRecord {
  readonly id: string;
  text: string;
  metadata: Record<string, unknown>;
}

// Create type from existing interface
type MemorySummary = Pick<MemoryRecord, 'id' | 'text'>;
type PublicMemory = Omit<MemoryRecord, 'internalScore'>;
```

---

<!-- /ANCHOR:utility-types -->
<!-- ANCHOR:return-type-annotations -->
## 6. RETURN TYPE ANNOTATIONS

### Policy: Explicit for Public API, Inferred for Private Helpers

```typescript
// PUBLIC API — explicit return type (required by P1 checklist)
export function calculateDecayScore(
  baseScore: number,
  ageInHours: number,
): number {
  return baseScore * Math.exp(-0.1 * ageInHours);
}

// PUBLIC API — async explicit return type
export async function searchMemories(
  query: string,
  options: SearchOptions,
): Promise<SearchResult[]> {
  // implementation
}

// PRIVATE HELPER — inferred return type is acceptable
function normalizeScore(raw: number, max: number) {
  return Math.min(raw / max, 1.0);
}
```

**Why explicit on public API**: Return types serve as documentation, prevent accidental signature changes, and improve compile-time error messages for consumers.

**Why inferred on private helpers**: Reduces boilerplate for internal code where the return type is obvious from the implementation.

---

<!-- /ANCHOR:return-type-annotations -->
<!-- ANCHOR:tsdoc-documentation -->
## 7. TSDOC DOCUMENTATION

### TSDoc Format

TypeScript uses TSDoc format. Unlike JSDoc, TSDoc does not include `{type}` annotations because TypeScript has native types.

### Function Documentation

```typescript
/**
 * Search memory database for matching entries.
 *
 * Performs hybrid search combining vector similarity and BM25 keyword
 * matching, then applies RRF fusion to combine rankings.
 *
 * @param query - Search query text
 * @param options - Search configuration
 * @returns Array of matching memory entries sorted by relevance
 * @throws {@link MemoryError} If database connection fails
 * @throws {@link ValidationError} If query exceeds maximum length
 *
 * @example
 * ```typescript
 * const results = await searchMemories('authentication', {
 *   limit: 5,
 *   specFolder: 'specs/007-auth',
 * });
 * ```
 */
export async function searchMemories(
  query: string,
  options: SearchOptions = {},
): Promise<SearchResult[]> {
  // implementation
}
```

### Interface Documentation

```typescript
/**
 * Configuration for memory search operations.
 *
 * @remarks
 * All properties have sensible defaults. Only `query` is required
 * at the call site (passed as a separate parameter).
 */
interface SearchOptions {
  /** Maximum number of results to return. Defaults to 10. */
  limit?: number;

  /** Filter results to a specific spec folder path. */
  specFolder?: string;

  /** Filter by specific anchor types (e.g., 'state', 'next-steps'). */
  anchors?: readonly string[];

  /** Include full content in results. Defaults to false. */
  includeContent?: boolean;
}
```

### Class Documentation

```typescript
/**
 * Manages vector-based semantic search index.
 *
 * @remarks
 * Uses sqlite-vec for vector storage and cosine similarity search.
 * Must call {@link VectorIndex.initialize} before first use.
 *
 * @example
 * ```typescript
 * const index = new VectorIndex(dbPath);
 * await index.initialize();
 * const results = await index.search(embedding, { limit: 10 });
 * ```
 */
class VectorIndex {
  /**
   * Create a VectorIndex instance.
   *
   * @param dbPath - Path to SQLite database file
   * @param dimension - Vector dimension size (must match embedding model)
   */
  constructor(
    private readonly dbPath: string,
    private readonly dimension: number,
  ) { }
}
```

### Generic Type Documentation

```typescript
/**
 * Cached value with TTL-based expiration.
 *
 * @typeParam T - The type of the cached value
 */
interface CacheEntry<T> {
  /** The cached value. */
  readonly value: T;

  /** Unix timestamp (ms) when this entry was created. */
  readonly createdAt: number;

  /** TTL in milliseconds. Entry expires at createdAt + ttl. */
  readonly ttl: number;
}
```

### TSDoc Tag Reference

| Tag             | Purpose                                      | Example                                        |
|-----------------|----------------------------------------------|------------------------------------------------|
| `@param`        | Describe parameter                           | `@param query - Search text`                   |
| `@returns`      | Describe return value                        | `@returns Array of results`                    |
| `@throws`       | Document thrown exceptions                   | `@throws {@link MemoryError} If DB fails`      |
| `@typeParam`    | Describe generic type parameter              | `@typeParam T - Cached value type`             |
| `@remarks`      | Extended description (after summary)         | `@remarks Uses cosine similarity...`           |
| `@example`      | Usage example with code block                | `@example \`\`\`typescript ... \`\`\``         |
| `@see`          | Cross-reference                              | `@see {@link SearchOptions}`                   |
| `@deprecated`   | Mark as deprecated                           | `@deprecated Use searchMemories instead`       |
| `@internal`     | Mark as internal (not public API)            | `@internal`                                    |
| `@readonly`     | Indicate read-only property                  | `@readonly`                                    |

---

<!-- /ANCHOR:tsdoc-documentation -->
<!-- ANCHOR:typed-error-classes -->
## 8. TYPED ERROR CLASSES

### Custom Error Pattern

Extend `Error` with typed properties:

```typescript
/**
 * Base error for all memory operations.
 */
class MemoryError extends Error {
  /** Error code for programmatic handling. */
  readonly code: ErrorCode;

  /** Additional context for debugging. */
  readonly context: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode,
    context: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'MemoryError';
    this.code = code;
    this.context = context;

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Specialized error subclass
class ValidationError extends MemoryError {
  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message, ErrorCode.ValidationFailed, context);
    this.name = 'ValidationError';
  }
}
```

### Error Code Enum

```typescript
enum ErrorCode {
  NotFound = 'NOT_FOUND',
  Timeout = 'TIMEOUT',
  ConnectionFailed = 'CONNECTION_FAILED',
  ValidationFailed = 'VALIDATION_FAILED',
  EmbeddingFailed = 'EMBEDDING_FAILED',
  StorageFull = 'STORAGE_FULL',
}
```

### Typed Error Handling

```typescript
// Catching typed errors
try {
  await searchMemories(query, options);
} catch (error: unknown) {
  if (error instanceof MemoryError) {
    // TypeScript narrows to MemoryError — .code and .context available
    console.error(`[search] ${error.code}: ${error.message}`);
    if (error.code === ErrorCode.Timeout) {
      // Handle timeout specifically
    }
  } else if (error instanceof Error) {
    console.error(`[search] Unexpected error: ${error.message}`);
  } else {
    console.error('[search] Unknown error:', error);
  }
}
```

**Rule**: Always type `catch` parameter as `unknown` and narrow with `instanceof`.

---

<!-- /ANCHOR:typed-error-classes -->
<!-- ANCHOR:async-patterns -->
## 9. ASYNC PATTERNS

### Typed Promises

```typescript
// Explicit return type for async functions
async function fetchMemories(
  query: string,
): Promise<MemoryRecord[]> {
  const results = await database.search(query);
  return results;
}
```

### Parallel Operations

```typescript
// Parallel execution with typed results
const [users, posts]: [User[], Post[]] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
]);

// Promise.allSettled for partial failure tolerance
const results = await Promise.allSettled([
  embedText(text1),
  embedText(text2),
  embedText(text3),
]);

for (const result of results) {
  if (result.status === 'fulfilled') {
    processEmbedding(result.value);
  } else {
    console.error(`Embedding failed: ${result.reason}`);
  }
}
```

### Async Error Wrapper

```typescript
// Generic async error wrapper with typed result
async function safeAsync<T>(
  fn: () => Promise<T>,
  context: string,
): Promise<OperationResult<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error: unknown) {
    const message = error instanceof Error
      ? error.message
      : String(error);
    console.error(`[${context}] Failed: ${message}`);
    return { success: false, error: message, code: ErrorCode.Timeout };
  }
}

// Usage
const result = await safeAsync(
  () => searchMemories(query),
  'memory-search',
);
```

---

<!-- /ANCHOR:async-patterns -->
<!-- ANCHOR:tsconfig-baseline -->
## 10. TSCONFIG BASELINE

### Root tsconfig.json for OpenCode Projects

```jsonc
{
  "compilerOptions": {
    // Language and Output
    "target": "es2022",
    "module": "commonjs",
    "moduleResolution": "node",

    // Strict Type Checking (replaces 'use strict')
    "strict": true,

    // Interop
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,

    // Declarations and Source Maps
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    // Output
    "outDir": "./dist",
    "rootDir": ".",

    // Project References
    "composite": true
  },
  "references": [
    { "path": "./shared" },
    { "path": "./mcp_server" },
    { "path": "./scripts" }
  ],
  "exclude": ["node_modules"]
}
```

### Build & Rebuild Workflow

After editing TypeScript source files, the compiled `dist/` output must be rebuilt. The MCP server and CLI scripts run from `dist/`, not from `.ts` source directly.

**Build command** (from skill root, e.g. `.opencode/skill/system-spec-kit/`):

```bash
# Standard build (type checks + emit)
npm run build          # runs: tsc --build

# Build with pre-existing type errors (emit without type checking)
npx tsc --build --noCheck --force

# Smoke test after build
npm run test:cli       # verifies dist/ output runs correctly
```

**When to use `--noCheck`**: The `strict: true` config combined with third-party SDK types (e.g., MCP SDK `Record<string, unknown>` vs typed handler args) can produce pre-existing type errors that don't affect runtime. Use `--noCheck --force` to emit JavaScript while bypassing these.

**Workspace build order**: `tsc --build` respects project references and builds in dependency order:
1. `shared/` (no dependencies)
2. `mcp_server/` (depends on `shared/`)
3. `scripts/` (depends on `shared/`)

**Post-build verification**:

| Check | Command | Pass Criteria |
|-------|---------|---------------|
| CLI smoke test | `npm run test:cli` | Exit 0 + "CLI smoke test passed" |
| MCP server start | `npm run start` | Server starts without crash |
| Embedding test | `npm run test:embeddings` | Embeddings factory loads |

**Common TS4094 error**: If exporting a class with private/protected members from a `.js` file re-exported through `.ts`, TypeScript cannot emit declarations. Fix by adding a type assertion at the re-export site:

```typescript
// TS4094: Property '_method' of exported anonymous class type may not be private
// Fix: widen the type to suppress declaration emit error
const ExportedClass = jsModule.SomeClass as typeof jsModule.SomeClass & { new(...args: unknown[]): unknown };
```

### Key Configuration Decisions

| Setting                           | Value       | Rationale                                                |
|-----------------------------------|-------------|----------------------------------------------------------|
| `target`                          | `es2022`    | Node.js 18+ supports ES2022 features natively            |
| `module`                          | `commonjs`  | Preserves `__dirname`, `require()`, existing startup paths|
| `strict`                          | `true`      | Full strict mode from the start (Decision D3)            |
| `composite`                       | `true`      | Enables project references for incremental builds        |
| `outDir`                          | `"./dist"`  | Compiled output in dist/ folder, matches all 3 workspace tsconfigs |
| `rootDir`                         | `"."`       | Source root at project level                                  |
| `esModuleInterop`                | `true`      | Allows `import x from 'module'` for CommonJS modules     |
| `declaration`                     | `true`      | Generates `.d.ts` files for cross-project type checking  |
| `skipLibCheck`                    | `true`      | Faster builds; third-party `.d.ts` issues ignored        |

### Workspace tsconfig.json Pattern

Each workspace extends the root and declares its own composite settings:

```jsonc
// shared/tsconfig.json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": ".",
    "outDir": "./dist"
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}

// mcp_server/tsconfig.json (references shared/)
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": ".",
    "outDir": "./dist"
  },
  "references": [
    { "path": "../shared" }
  ],
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

<!-- /ANCHOR:tsconfig-baseline -->
<!-- ANCHOR:module-organization -->
## 11. MODULE ORGANIZATION

### ES Module Source, CommonJS Output

TypeScript source files use ES module syntax (`import`/`export`). The compiler outputs CommonJS (`require`/`module.exports`) based on `"module": "commonjs"`.

```typescript
// SOURCE (.ts) — ES module syntax
import path from 'path';
import { MemoryError } from './errors/core';
import type { SearchResult } from '../types';

export function search(query: string): SearchResult[] {
  // implementation
}

export { MemoryError };
```

```javascript
// COMPILED OUTPUT (.js) — CommonJS (generated by tsc)
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const core_1 = require("./errors/core");

function search(query) {
  // implementation
}

exports.search = search;
```

### Barrel Files (index.ts)

```typescript
// lib/index.ts — Barrel file
export { MemoryError, ErrorCode } from './errors/core';
export { VectorIndex } from './search/vector-index';
export { validateInputLengths } from './utils/validation';

// Type-only re-exports
export type { SearchResult, SearchOptions } from '../types';
```

---

<!-- /ANCHOR:module-organization -->
<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

- [style_guide.md](./style_guide.md) - Formatting and naming conventions
- [quick_reference.md](./quick_reference.md) - Copy-paste templates and cheat sheets
<!-- /ANCHOR:related-resources -->
