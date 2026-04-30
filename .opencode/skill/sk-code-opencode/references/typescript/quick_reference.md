---
title: TypeScript Quick Reference
description: Copy-paste templates, naming cheat sheet, and common patterns for TypeScript development in OpenCode.
---

# TypeScript Quick Reference

Copy-paste templates, naming cheat sheet, and common patterns for TypeScript development in OpenCode.

---

## 1. OVERVIEW

### Purpose

Quick-access reference card for TypeScript patterns. For detailed explanations, see:
- [style_guide.md](./style_guide.md) - Full style documentation
- [quality_standards.md](./quality_standards.md) - Quality requirements

Current system-spec-kit TypeScript is package-aware: `shared/` and
`mcp_server/` use NodeNext ESM, `scripts/` uses ES2022 ESM, and root CommonJS
settings are only fallback defaults for workspaces that do not override them.

---

## 2. COMPLETE FILE TEMPLATE

```typescript
// ───────────────────────────────────────────────────────────────────
// MODULE: [Module Name]
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import path from 'path';
import fs from 'fs';

import Database from 'better-sqlite3';

import { loadConfig } from './core/config';
import { MemoryError, ErrorCode } from './errors/core';

import type { SearchOptions, SearchResult } from '../types';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Configuration for the main operation. */
interface ModuleConfig {
  readonly timeout: number;
  readonly maxRetries: number;
  readonly verbose: boolean;
}

/** Possible operation outcomes. */
type OperationOutcome = 'success' | 'failure' | 'timeout';

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const DEFAULT_TIMEOUT = 5_000;
const MAX_RETRIES = 3;

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function validateInput(input: unknown): input is string {
  return typeof input === 'string' && input.length > 0;
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/**
 * Main function description.
 *
 * @param input - Input description
 * @param options - Configuration options
 * @returns Result object with success status and data
 * @throws {@link MemoryError} If operation fails
 */
export async function mainFunction(
  input: string,
  options: Partial<ModuleConfig> = {},
): Promise<SearchResult[]> {
  if (!validateInput(input)) {
    throw new MemoryError(
      'Invalid input: expected non-empty string',
      ErrorCode.ValidationFailed,
    );
  }

  try {
    const config: ModuleConfig = {
      timeout: DEFAULT_TIMEOUT,
      maxRetries: MAX_RETRIES,
      verbose: false,
      ...options,
    };
    const result = await process(input, config);
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[module-name] Error: ${message}`);
    throw error;
  }
}

// ───────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────────

export { validateInput };
export type { ModuleConfig, OperationOutcome };
```

---

## 3. NAMING CHEAT SHEET

| Element           | Convention         | Example                   |
|-------------------|--------------------|---------------------------|
| Functions         | `camelCase`        | `loadConfig`              |
| Constants         | `UPPER_SNAKE_CASE` | `MAX_RETRIES`             |
| Classes           | `PascalCase`       | `MemoryError`             |
| Interfaces        | `PascalCase`       | `SearchResult`            |
| Type aliases      | `PascalCase`       | `MemoryState`             |
| Enums             | `PascalCase`       | `ErrorCode`               |
| Enum members      | `PascalCase`       | `ErrorCode.NotFound`      |
| Generics          | `T`-prefix         | `<T>`, `<TResult>`        |
| Local variables   | `camelCase`        | `searchResults`           |
| Module variables  | `camelCase`        | `dbConnection`            |
| Parameters        | `camelCase`        | `queryText`               |
| Booleans          | `is`/`has`/`can`   | `isValid`, `hasItems`     |
| Files             | `kebab-case`       | `memory-search.ts`        |
| Private members   | `_prefix`          | `private _connection`     |

**Legacy exception**: `IEmbeddingProvider` and `IVectorStore` keep `I` prefix. New interfaces omit it.

---

## 4. SECTION ORDERING

```
1. IMPORTS           (Node built-ins, third-party, local, type-only)
2. TYPE DEFINITIONS  (Interfaces, types, enums)
3. CONSTANTS         (Configuration values)
4. HELPERS           (Internal utility functions)
5. CORE LOGIC        (Main implementation)
6. EXPORTS           (Module public interface)
```

---

## 5. TYPE ANNOTATION PATTERNS

### Basic Annotations

```typescript
// Variables
const name: string = 'hello';
const count: number = 42;
const isActive: boolean = true;
const items: string[] = ['a', 'b', 'c'];
const metadata: Record<string, unknown> = {};

// Optional
const limit: number | undefined = options.limit;
const result: MemoryRecord | null = findById(id);
```

### Function Signatures

```typescript
// Named function
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Async function
async function fetch(id: string): Promise<MemoryRecord | null> {
  return database.get(id);
}

// Optional parameters
function search(query: string, limit?: number): SearchResult[] { }

// Default parameters
function configure(options: Partial<Config> = {}): Config { }

// Rest parameters
function log(prefix: string, ...args: unknown[]): void { }

// Type guard
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```

### Object and Array Types

```typescript
// Object type with readonly
interface Config {
  readonly host: string;
  readonly port: number;
  debug?: boolean;  // optional
}

// Array types
const ids: string[] = [];
const matrix: number[][] = [];
const records: readonly MemoryRecord[] = [];  // immutable array

// Tuple
const pair: [string, number] = ['score', 0.95];
```

---

## 6. COMMON UTILITY TYPE PATTERNS

```typescript
// Partial — all properties optional (for updates/overrides)
function updateConfig(overrides: Partial<SearchConfig>): SearchConfig {
  return { ...DEFAULT_CONFIG, ...overrides };
}

// Required — all properties required (for validated state)
function validate(input: Partial<Config>): Required<Config> {
  // ... validation logic
}

// Pick — select specific properties
type MemorySummary = Pick<MemoryRecord, 'id' | 'text' | 'score'>;

// Omit — exclude properties
type PublicRecord = Omit<MemoryRecord, 'internalScore' | 'rawEmbedding'>;

// Record — typed key-value object
const scores: Record<string, number> = { relevance: 0.9, recency: 0.7 };

// Readonly — immutable version
const frozen: Readonly<Config> = Object.freeze(config);

// NonNullable — strip null/undefined
type ValidId = NonNullable<string | null | undefined>;  // string

// ReturnType — extract return type from function
type SearchReturn = ReturnType<typeof searchMemories>;
```

---

## 7. IMPORT / EXPORT TEMPLATES

### Import Ordering

```typescript
// 1. Node.js built-ins
import path from 'path';
import fs from 'fs';

// 2. Third-party
import Database from 'better-sqlite3';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

// 3. Local modules
import { loadConfig } from './core/config';
import { MemoryError } from './errors/core';

// 4. Type-only imports (always last)
import type { SearchOptions, SearchResult } from '../types';
import type { DatabaseConfig } from './core/config';
```

### Export Patterns

```typescript
// Named exports (preferred)
export function search(query: string): SearchResult[] { }
export class VectorIndex { }
export const MAX_RESULTS = 100;

// Type-only exports
export type { SearchResult, SearchOptions };

// Barrel file (index.ts)
export { MemoryError, ErrorCode } from './errors/core';
export { VectorIndex } from './search/vector-index';
export type { SearchResult } from '../types';

// Default export (use sparingly — named exports preferred)
export default class ContextServer { }

// Re-export everything from a module
export * from './module';
export type * from './types';
```

---

## 8. ERROR HANDLING PATTERNS

### Typed catch

```typescript
try {
  await operation();
} catch (error: unknown) {
  if (error instanceof MemoryError) {
    // Narrowed to MemoryError
    console.error(`[module] ${error.code}: ${error.message}`);
  } else if (error instanceof Error) {
    // Generic Error
    console.error(`[module] Unexpected: ${error.message}`);
  } else {
    // Non-Error throw (string, number, etc.)
    console.error(`[module] Unknown error:`, error);
  }
}
```

### Custom Error Class

```typescript
class MemoryError extends Error {
  readonly code: ErrorCode;
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
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```

### Guard Clause

```typescript
function processData(input: unknown): SearchResult {
  if (typeof input !== 'string') {
    throw new MemoryError(
      'Invalid input: expected string',
      ErrorCode.ValidationFailed,
    );
  }

  if (input.length === 0) {
    throw new MemoryError(
      'Invalid input: empty string',
      ErrorCode.ValidationFailed,
    );
  }

  // Main logic after guards pass
  return transform(input);
}
```

### Result Type Pattern

```typescript
// Instead of throwing, return a discriminated union
interface SuccessResult<T> {
  readonly success: true;
  readonly data: T;
}

interface ErrorResult {
  readonly success: false;
  readonly error: string;
  readonly code: ErrorCode;
}

type Result<T> = SuccessResult<T> | ErrorResult;

// Usage
async function safeFetch(id: string): Promise<Result<MemoryRecord>> {
  try {
    const record = await database.get(id);
    if (!record) {
      return { success: false, error: 'Not found', code: ErrorCode.NotFound };
    }
    return { success: true, data: record };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: message, code: ErrorCode.ConnectionFailed };
  }
}
```

---

## 9. TSDOC TEMPLATE

```typescript
/**
 * Brief description of function purpose.
 *
 * @param query - Required parameter description
 * @param options - Optional parameter with defaults
 * @returns Description of return value
 * @throws {@link MemoryError} When operation fails
 *
 * @example
 * ```typescript
 * const results = await search('query', { limit: 5 });
 * ```
 */
```

---

## 10. TSCONFIG QUICK REFERENCE

### Root Fallback Settings for OpenCode

The root config provides defaults. Current system-spec-kit workspaces override
module settings where their package boundary requires ESM.

```jsonc
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true,
    "outDir": ".",
    "rootDir": "."
  },
  "exclude": ["node_modules"]
}
```

### Current system-spec-kit Workspace Overrides

```jsonc
// shared/tsconfig.json and mcp_server/tsconfig.json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "verbatimModuleSyntax": true
  }
}

// scripts/tsconfig.json
{
  "compilerOptions": {
    "module": "es2022",
    "moduleResolution": "node"
  }
}
```

### Build & Rebuild Commands

```bash
# Standard build (type check + emit dist/)
npm run build                        # runs: tsc --build

# Build bypassing pre-existing type errors (emit only)
npx tsc --build --noCheck --force

# Type check without emitting files
npx tsc --noEmit

# Watch mode for incremental builds
npx tsc --build --watch

# Smoke test after build
npm run test:cli
```

**After editing `.ts` source files**: Always rebuild `dist/` — the MCP server and CLI scripts run from compiled `.js`, not `.ts` source.

**When `tsc --build` fails with pre-existing type errors**: Use `--noCheck --force` to emit JavaScript without type checking. Common with strict mode + third-party SDK type mismatches (e.g., MCP SDK `Record<string, unknown>`).

---

## 11. COMMON ONE-LINERS

```typescript
// Type narrowing for unknown
const message = error instanceof Error ? error.message : String(error);

// Default with nullish coalescing
const limit = options.limit ?? 10;

// Optional chaining
const name = user?.profile?.name;

// Type assertion (use sparingly)
const config = raw as SearchConfig;

// Satisfies (validates type without widening)
const config = {
  maxResults: 100,
  timeout: 5000,
} satisfies SearchConfig;

// Readonly array from literal
const MODELS = ['gpt-4', 'claude-3'] as const;

// Numeric separator for readability
const MAX_QUERY_LENGTH = 10_000;

// Non-null assertion (with justification comment only)
// Guaranteed by validation in constructor
const element = map.get(key)!;
```

---

## 12. RELATED RESOURCES

- [style_guide.md](./style_guide.md) - Detailed formatting rules
- [quality_standards.md](./quality_standards.md) - Type system, TSDoc, error patterns
