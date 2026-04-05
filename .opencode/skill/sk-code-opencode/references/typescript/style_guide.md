---
title: TypeScript Style Guide
description: Formatting standards and naming conventions for TypeScript files in the OpenCode development environment.
---

# TypeScript Style Guide

Formatting standards and naming conventions for TypeScript files in the OpenCode development environment.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Defines consistent styling rules for TypeScript files to ensure readability, maintainability, and alignment across all OpenCode TypeScript code.

### When to Use

- Writing new TypeScript files
- Reviewing TypeScript code for consistency
- Resolving style disagreements in code review

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:file-header-format -->
## 2. FILE HEADER FORMAT

All TypeScript files MUST begin with a module header block identifying the module.

### Template

```typescript
// ───────────────────────────────────────────────────────────────────
// MODULE: [Module Name]
// ───────────────────────────────────────────────────────────────────
```

### Requirements

- Box width: 67 characters total (box-drawing line)
- Module name: Left-aligned within header block
- No `'use strict'` directive required (TypeScript `strict` mode in tsconfig replaces it)
- Immediately followed by imports

**Rationale**: TypeScript's `"strict": true` in `tsconfig.json` enables strict mode at compilation. The `'use strict'` directive is automatically emitted in compiled CommonJS output by the TypeScript compiler.

### Full Header Example

```typescript
// ───────────────────────────────────────────────────────────────────
// MODULE: Memory Search Handler
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import path from 'path';
import type { SearchOptions } from '../types';
```

---

<!-- /ANCHOR:file-header-format -->
<!-- ANCHOR:strict-mode -->
## 3. STRICT MODE

### tsconfig.json Replaces 'use strict'

In JavaScript, every file requires `'use strict';` at the top. In TypeScript, the `tsconfig.json` setting `"strict": true` enforces strict mode at the compiler level, which is stronger than the runtime directive.

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "strict": true  // Enables all strict type-checking options
  }
}
```

**What `strict: true` enables:**
- `strictNullChecks` - null/undefined handled explicitly
- `strictFunctionTypes` - stricter function parameter checking
- `strictBindCallApply` - stricter bind/call/apply checking
- `strictPropertyInitialization` - class properties must be initialized
- `noImplicitAny` - parameters and variables must have types
- `noImplicitThis` - `this` must have explicit type
- `alwaysStrict` - emits `'use strict'` in compiled output

**Rule**: Do NOT add `'use strict';` to TypeScript source files. The compiler handles it.

---

<!-- /ANCHOR:strict-mode -->
<!-- ANCHOR:section-organization -->
## 4. SECTION ORGANIZATION

Large files are organized using numbered section dividers, consistent with JavaScript style.

### Section Divider Templates

Two formats are acceptable. Use either consistently within a single file.

**Format A — Line-comment dividers** (used in most files):

```typescript
// ───────────────────────────────────────────────────────────────────
// 1. [SECTION NAME]
// ───────────────────────────────────────────────────────────────────
```

**Format B — Block-comment dividers** (used in 27+ files across the codebase):

```typescript
/* ───────────────────────────────────────────────────────────────
   1. SECTION NAME
──────────────────────────────────────────────────────────────── */
```

Both formats serve the same purpose: visual separation of major code sections with numbered headings. Choose one format per file and apply it consistently.

### Standard Section Order

| Order | Section Name      | Purpose                                |
|-------|-------------------|----------------------------------------|
| 1     | IMPORTS           | Module dependencies (with type imports)|
| 2     | TYPE DEFINITIONS  | Interfaces, types, enums               |
| 3     | CONSTANTS         | Configuration values, magic numbers    |
| 4     | HELPERS           | Internal utility functions              |
| 5     | CORE LOGIC        | Main implementation                    |
| 6     | EXPORTS           | Module public interface                |

**Key difference from JavaScript**: TypeScript files include a TYPE DEFINITIONS section (section 2) between imports and constants. This is where all interfaces, type aliases, and enums are defined.

Number sections from the first divider actually present in the file. File headers and module banners do not count, so a file whose first numbered divider is `TYPE DEFINITIONS` should label that divider `1`, not `2`.

### TYPE DEFINITIONS Section Example (when IMPORTS is present as section 1)

```typescript
// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** Configuration for search operations. */
interface SearchConfig {
  readonly maxResults: number;
  readonly timeout: number;
  readonly includeMetadata: boolean;
}

/** Possible states for a memory entry. */
type MemoryState = 'active' | 'archived' | 'pending';

/** Error codes for memory operations. */
enum ErrorCode {
  NotFound = 'NOT_FOUND',
  Timeout = 'TIMEOUT',
  ConnectionFailed = 'CONNECTION_FAILED',
}
```

---

<!-- /ANCHOR:section-organization -->
<!-- ANCHOR:naming-conventions -->
## 5. NAMING CONVENTIONS

### Interface Names

**Style**: `PascalCase` (no `I` prefix for new interfaces)

```typescript
// CORRECT — new interfaces
interface SearchResult { }
interface EmbeddingProvider { }
interface MemoryRecord { }

// CORRECT — legacy exception (documented below)
interface IEmbeddingProvider { }
interface IVectorStore { }

// INCORRECT
interface iSearchResult { }      // camelCase
interface search_result { }      // snake_case
interface ISearchResult { }      // I prefix on new interface
```

**Legacy Exception**: `IEmbeddingProvider` and `IVectorStore` retain their `I` prefix for backward compatibility with re-export aliases across the codebase. All NEW interfaces omit the prefix. This exception is documented in the migration plan (Decision D5).

### Type Alias Names

**Style**: `PascalCase`

```typescript
// CORRECT
type SearchResult = { score: number; text: string };
type MemoryState = 'active' | 'archived' | 'pending';
type ScoreCalculator = (input: number) => number;

// INCORRECT
type searchResult = { };        // camelCase
type search_result = { };       // snake_case
```

### Enum Names and Members

**Style**: `PascalCase` name, `PascalCase` members

```typescript
// CORRECT
enum ErrorCode {
  NotFound = 'NOT_FOUND',
  Timeout = 'TIMEOUT',
  ConnectionFailed = 'CONNECTION_FAILED',
}

enum MemoryTier {
  Constitutional = 'constitutional',
  Working = 'working',
  LongTerm = 'long_term',
}

// INCORRECT
enum errorCode { }              // camelCase name
enum ErrorCode { notFound }     // camelCase member
enum ERROR_CODE { }             // UPPER_SNAKE name
```

### Generic Type Parameters

**Style**: Single uppercase letter or `T`-prefixed descriptive name

```typescript
// CORRECT — simple
function identity<T>(value: T): T { return value; }

// CORRECT — descriptive
function transform<TInput, TOutput>(input: TInput): TOutput { }
interface Repository<TEntity> { }
type Mapper<TSource, TTarget> = (source: TSource) => TTarget;

// INCORRECT
function identity<type>(value: type): type { }    // lowercase
function transform<input, output>(): void { }      // not T-prefixed
```

### Function Names

**Style**: `camelCase` (unchanged from JavaScript)

```typescript
// CORRECT
function calculateDecayScore(age: number): number { }
function validateInput(data: unknown): data is string { }
async function fetchMemories(query: string): Promise<MemoryRecord[]> { }

// INCORRECT
function calculate_decay_score() { }    // snake_case
function CalculateDecayScore() { }      // PascalCase
```

### Constant Names

**Style**: `UPPER_SNAKE_CASE` (unchanged from JavaScript)

```typescript
// CORRECT
const MAX_QUERY_LENGTH = 10_000;
const DEFAULT_TIMEOUT = 5_000;
const SUPPORTED_MODELS: readonly string[] = ['gpt-4', 'claude-3'] as const;

// INCORRECT
const maxQueryLength = 10000;      // camelCase for a constant
```

### Variable Names

| Scope        | Style        | Example                                     |
|--------------|--------------|---------------------------------------------|
| Local        | `camelCase`  | `const searchResults: SearchResult[] = []`  |
| Module-level | `camelCase`  | `const dbPath: string = '...'`              |
| Parameters   | `camelCase`  | `function search(queryText: string)`        |

### Boolean Names

**Style**: `camelCase` with `is`/`has`/`can`/`should` prefix (unchanged from JavaScript)

```typescript
const isValid: boolean = true;
const hasResults: boolean = items.length > 0;
const canProceed: boolean = !isBlocked;
const shouldRetry: boolean = attempts < MAX_RETRIES;
```

### File Names

**Style**: `kebab-case` with `.ts` extension (unchanged from JavaScript `.js` convention)

```
memory-search.ts
vector-index.ts
path-security.ts
embedding-provider.ts
```

### snake_case Exception: Database-Mapped Properties

TypeScript interfaces that mirror SQLite column names MAY use `snake_case` properties. This exception applies **only** to properties that directly map to database columns.

**Rules:**
- Include a justification comment on each snake_case property: `// Maps to SQLite column column_name`
- For new code, prefer a mapping layer at the DB boundary (map to `camelCase` internally)
- Existing interfaces with dual naming (e.g., `MemoryRecord`) are acceptable during migration

```typescript
// ACCEPTABLE — interface mirrors DB schema directly
interface MemoryRow {
  id: string;
  importance_tier: number;   // Maps to SQLite column importance_tier
  spec_folder: string;       // Maps to SQLite column spec_folder
  created_at: number;        // Maps to SQLite column created_at
}

// PREFERRED for new code — map at the DB boundary
interface MemoryRecord {
  id: string;
  importanceTier: number;
  specFolder: string;
  createdAt: number;
}

function fromRow(row: MemoryRow): MemoryRecord {
  return {
    id: row.id,
    importanceTier: row.importance_tier,
    specFolder: row.spec_folder,
    createdAt: row.created_at,
  };
}
```

### Naming Summary Table

| Element           | Convention         | Example                     |
|-------------------|--------------------|-----------------------------|
| Functions         | `camelCase`        | `loadConfig`                |
| Constants         | `UPPER_SNAKE_CASE` | `MAX_RETRIES`               |
| Classes           | `PascalCase`       | `MemoryError`               |
| Interfaces        | `PascalCase`       | `SearchResult`              |
| Type aliases      | `PascalCase`       | `MemoryState`               |
| Enums             | `PascalCase`       | `ErrorCode`                 |
| Enum members      | `PascalCase`       | `ErrorCode.NotFound`        |
| Generics          | `T`-prefix         | `<T>`, `<TResult>`          |
| Local variables   | `camelCase`        | `searchResults`             |
| Module variables  | `camelCase`        | `dbConnection`              |
| Parameters        | `camelCase`        | `queryText`                 |
| Booleans          | `is`/`has`/`can`   | `isValid`, `hasItems`       |
| Files             | `kebab-case`       | `memory-search.ts`          |
| Private members   | `_prefix`          | `private _connection`       |
| DB-mapped props   | `snake_case`*      | `importance_tier`           |

\* Exception: Only for properties that directly map to SQLite column names. See "snake_case Exception" above.

---

<!-- /ANCHOR:naming-conventions -->
<!-- ANCHOR:formatting-rules -->
## 6. FORMATTING RULES

### Indentation

- **Size**: 2 spaces (same as JavaScript)
- **Tabs**: Never use tabs

### Braces

**Style**: K&R (opening brace on same line)

```typescript
if (condition) {
  // code
} else {
  // code
}

function example(): void {
  // code
}
```

### Semicolons

**Rule**: Always use semicolons (same as JavaScript)

```typescript
const value: number = 42;
return result;
```

### Quotes

**Rule**: Single quotes for strings (same as JavaScript)

```typescript
const message = 'Hello world';
const template = `Value: ${value}`;  // Template literals OK
```

### Line Length

- **Maximum**: 100 characters
- **Preferred**: 80 characters
- **Exception**: URLs, long type signatures, and import paths

### Type Annotation Placement

**Rule**: Type annotations follow the colon with a single space.

```typescript
// CORRECT
const name: string = 'hello';
function add(a: number, b: number): number { return a + b; }
const items: string[] = [];

// INCORRECT
const name:string = 'hello';           // no space after colon
const name :string = 'hello';          // space before colon
```

### Multiline Type Definitions

For types that exceed line length limits, break at logical points:

```typescript
// Short — single line is fine
interface Point { x: number; y: number; }

// Medium — use multiline formatting
interface SearchConfig {
  readonly query: string;
  readonly limit: number;
  readonly offset: number;
  readonly filters: Record<string, unknown>;
}

// Long union types — one member per line
type MemoryOperation =
  | 'save'
  | 'search'
  | 'delete'
  | 'archive'
  | 'consolidate';

// Long function types — break parameters
type TransformFn = (
  input: string,
  options: TransformOptions,
  context: ExecutionContext,
) => Promise<TransformResult>;
```

### Trailing Commas

**Rule**: Use trailing commas in multiline constructs (arrays, objects, parameters, type members).

```typescript
// CORRECT — trailing comma
const config: SearchConfig = {
  query: 'test',
  limit: 10,
  offset: 0,
};

// CORRECT — trailing comma in multiline parameters
function search(
  query: string,
  options: SearchOptions,
  context: ExecutionContext,
): Promise<SearchResult[]> {
  // ...
}
```

---

<!-- /ANCHOR:formatting-rules -->
<!-- ANCHOR:import-ordering -->
## 7. IMPORT ORDERING

### Four-Group Import Order

TypeScript imports follow a four-group ordering with blank lines between groups:

```typescript
// 1. Node.js built-in modules
import path from 'path';
import fs from 'fs';

// 2. Third-party packages
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import Database from 'better-sqlite3';

// 3. Local modules (project code)
import { loadConfig } from './core/config';
import { MemoryError } from './errors/core';
import { validateInputLengths } from './utils/validation';

// 4. Type-only imports (separate line, always last)
import type { SearchOptions, SearchResult } from '../types';
import type { DatabaseConfig } from './core/config';
```

### Type-Only Imports

Use `import type` for imports used only in type positions. This ensures they are erased at compile time and do not create runtime dependencies.

```typescript
// CORRECT — type-only import (erased at compile time)
import type { EmbeddingProfile } from '../shared/types';

// CORRECT — mixed: value import (needed at runtime)
import { MemoryError } from './errors/core';

// INCORRECT — importing a type without `import type`
import { SearchResult } from '../types';  // Only used as a type
```

**Rule**: If an import is ONLY used in type annotations, parameter types, return types, or generic constraints, use `import type`.

### Re-export Syntax

```typescript
// Re-export everything
export * from './module';

// Re-export specific items
export { MemoryError, ErrorCode } from './errors/core';

// Re-export types only
export type { SearchResult, SearchOptions } from '../types';
```

---

<!-- /ANCHOR:import-ordering -->
<!-- ANCHOR:commenting-rules -->
## 8. COMMENTING RULES

### Principles (Same as JavaScript)

1. **Quantity limit**: Maximum 3 comments per 10 lines of code
2. **Focus on purposeful semantics**: Explain WHY something is done, not WHAT it does
3. **Focus on WHY, not WHAT**: Explain intent, constraints, reasoning
4. **No commented-out code**: Delete unused code (git preserves history)

### Comment Examples

Use plain comments that explain reasoning:

- `// Rationale for this path`
- `// Contract/precondition that must hold`
- `// State that must hold after execution`
- `// REQ-###|BUG-###|SEC-###|T###: traceability`
- `// Reliability/performance/security risk control`

### Capitalization

All comment text MUST start with a capital letter:

```typescript
// Reverse order preserves dependency chain     // correct
// reverse order preserves dependency chain     // wrong
```

**Exceptions**: `eslint-disable` directives, `@ts-` annotations, and inline code references.

### TSDoc Comments (Replaces JSDoc)

TypeScript uses TSDoc format for documentation comments. See `quality_standards.md` for the full TSDoc reference.

```typescript
/**
 * Search memory database for matching entries.
 *
 * @param query - Search query text
 * @param options - Search configuration
 * @returns Array of matching memory entries
 * @throws {@link MemoryError} If database connection fails
 */
async function memorySearch(
  query: string,
  options: SearchOptions = {},
): Promise<SearchResult[]> {
  // implementation
}
```

**Key difference from JSDoc**: TSDoc does not use `{type}` annotations in tags because TypeScript has native type annotations. Compare:

```typescript
// JSDoc (JavaScript) — types in comments
/** @param {string} query - Search text */

// TSDoc (TypeScript) — types in code
/** @param query - Search text */
function search(query: string): void { }
```

---

<!-- /ANCHOR:commenting-rules -->
<!-- ANCHOR:mixed-js-ts-coexistence-patterns -->
## 9. MIXED JS/TS COEXISTENCE PATTERNS

During the transitional period where the codebase contains both JavaScript and TypeScript files, the following patterns are acceptable.

### TypeScript Importing JavaScript

Use `require()` with a type assertion or `@ts-ignore` when importing untyped `.js` modules:

```typescript
// Option A — require() with type assertion
const config = require('./legacy-config') as LegacyConfig;

// Option B — @ts-ignore for modules without type declarations
// @ts-ignore — legacy JS module, no .d.ts available
const legacyHelper = require('./helper');
```

For frequently imported JS modules, prefer declaring module types in a `.d.ts` file:

```typescript
// types/legacy-config.d.ts
declare module './legacy-config' {
  export interface LegacyConfig {
    version: string;
    features: string[];
  }
  const config: LegacyConfig;
  export default config;
}
```

### Dynamic require() with try-catch

For optional dependencies (e.g., native modules that may not be installed):

```typescript
let sqliteVec: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  sqliteVec = require('sqlite-vec');
} catch {
  console.warn('[vector-index] sqlite-vec not available, falling back');
  sqliteVec = null;
}
```

### 'use strict' Rule

- `.js` files: **ALWAYS** include `'use strict';` at the top
- `.ts` files: **NEVER** include `'use strict';` (tsconfig `strict: true` handles it)

### Backward-Compatible Export Aliases

During migration, modules may export both old (`snake_case`) and new (`camelCase`) names:

```typescript
// Primary exports
export { memorySearch, loadConfig };

// Backward-compatible aliases — remove after migration completes
export {
  memorySearch as memory_search,
  loadConfig as load_config,
};
```

### allowJs in tsconfig

When a TypeScript project includes legacy `.js` files that cannot be immediately converted:

```jsonc
{
  "compilerOptions": {
    "allowJs": true,        // Include .js files in compilation
    "checkJs": false         // Don't type-check .js files (too noisy during migration)
  }
}
```

Set `checkJs: true` only after the majority of JS files have been migrated or typed.

---

<!-- /ANCHOR:mixed-js-ts-coexistence-patterns -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

- [quality_standards.md](./quality_standards.md) - Type system, TSDoc, error patterns, tsconfig
- [quick_reference.md](./quick_reference.md) - Copy-paste templates and cheat sheets
<!-- /ANCHOR:related-resources -->
