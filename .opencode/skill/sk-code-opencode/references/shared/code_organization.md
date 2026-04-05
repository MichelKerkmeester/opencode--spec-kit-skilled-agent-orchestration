---
title: Code Organization - File Structure and Module Principles
description: File structure principles, module organization concepts, and import ordering standards for OpenCode system code.
---

# Code Organization - File Structure and Module Principles

File structure and module organization principles for OpenCode system code.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This reference defines how to organize files, structure modules, and order imports across all languages in the OpenCode codebase. Consistent organization enables faster navigation and reduces cognitive load.

### Core Principle

> **Predictable structure enables fast navigation.** Every file type has a known structure. Developers should find what they expect where they expect it.

### When to Use

- Creating new files or modules
- Reorganizing existing code
- Deciding import order
- Reviewing code structure

### Key Sources (Evidence)

| Pattern | Source File | Line Reference |
|---------|-------------|----------------|
| JS module structure | `mcp_server/context-server.ts` | Lines 1-70 |
| JS exports with aliases | `scripts/core/config.ts` | Lines 167-183 |
| Python imports | `scripts/skill_advisor.py` | Lines 17-24 |
| Shell structure | `lib/common.sh` | Lines 1-40 |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:file-structure-principles -->
## 2. FILE STRUCTURE PRINCIPLES

### Header-First Convention

Every file starts with a header block identifying its purpose:

**JavaScript** (3-line box):
```javascript
// ───────────────────────────────────────────────────────────────
// SERVER: CONTEXT SERVER
// ───────────────────────────────────────────────────────────────
```

**Python** (shebang + 3-line box):
```python
#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# ADVISOR: SKILL ADVISOR
# ───────────────────────────────────────────────────────────────
```

**Shell** (shebang + header):
```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# LIBRARY: COMMON UTILITIES
# ───────────────────────────────────────────────────────────────
```

### Module Type Labels

Use consistent labels in headers:

| Label | Use For |
|-------|---------|
| `SERVER` | MCP servers, HTTP servers |
| `HANDLER` | Request/event handlers |
| `LIBRARY`/`LIB` | Reusable utility modules |
| `SCRIPT` | Standalone executable scripts |
| `ADVISOR` | AI advisory/analysis tools |
| `VALIDATOR` | Validation/checking tools |
| `CONFIG` | Configuration files |
| `TEST` | Test files |

### Standard File Sections

Every significant file should have numbered sections:

- Keep section titles uppercase and numbered (non-regression): `## 1. IMPORTS`, `## 2. CONSTANTS`.
- Do not count file headers, shebangs, module banners, docstrings, or strict-mode directives as numbered sections.
- Start at `1` for the first numbered code section that actually appears, then increment sequentially from the sections present in that file.
- Do not convert these headers to sentence case or unnumbered variants.

```javascript
/* ─────────────────────────────────────────────────────────────
   1. MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   3. HELPER FUNCTIONS
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   4. MAIN LOGIC
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */
```

---

<!-- /ANCHOR:file-structure-principles -->
<!-- ANCHOR:module-organization -->
## 3. MODULE ORGANIZATION

### Single Responsibility

Each module should have ONE primary purpose:

**Good** - Single responsibility:
```
mcp_server/
├── handlers/
│   ├── memory-search.ts    # Handles memory search
│   ├── memory-save.ts      # Handles memory save
│   └── memory-crud.ts      # Handles memory CRUD
├── lib/
│   ├── errors.ts           # Error definitions
│   ├── providers/
│   │   └── embeddings.ts   # Embedding generation
│   └── validation/
│       └── preflight.ts    # Input validation
```

**Bad** - Mixed responsibilities:
```
mcp_server/
├── handlers.js             # All handlers (too large)
├── utils.js                # "Utils" grab bag (unclear)
└── helpers.js              # More "helpers" (unclear)
```

### KISS/DRY/SOLID Structural Checks

Apply these checks during module organization:

1. **KISS**: keep modules small and behavior-focused; avoid speculative abstraction layers.
2. **DRY**: shared rules/constants live in one file and are imported by dependents.
3. **SRP**: each module has one change reason.
4. **OCP**: add variants through extension points before editing stable cores.
5. **LSP/ISP/DIP**: avoid subtype surprises, oversized interfaces, and direct policy-to-infra coupling.

### Directory Structure Pattern

```
module/
├── index.ts                # Entry point, exports public API
├── core/                   # Core logic (private)
│   ├── config.ts
│   └── db-state.ts
├── handlers/               # Request handlers
│   └── *.ts
├── lib/                    # Utilities and helpers
│   ├── errors/
│   │   └── core.ts
│   ├── storage/
│   │   └── *.ts
│   └── utils/
│       └── *.ts
└── tests/                  # Test files
    └── *.test.ts
```

### Barrel Files (index.ts)

Use barrel files to expose public API:

```typescript
// lib/errors/index.ts - Barrel file
export { MemoryError, ErrorCodes, buildErrorResponse } from './core';
export { getRecoveryHint, ERROR_CODES } from './recovery-hints';
export type { ErrorResponse, ErrorResponseData } from './core';
```

Benefits:
- Single import point: `import { MemoryError } from './lib/errors';`
- Clear public API surface
- Implementation details hidden

---

<!-- /ANCHOR:module-organization -->
<!-- ANCHOR:import-ordering -->
## 4. IMPORT ORDERING

### Universal Import Order

All languages follow this import order:

```
1. Standard library / Built-in modules
2. Third-party packages (npm, pip, etc.)
3. Local modules (project code)
4. Type-only imports (TypeScript only — separate line, always last)
```

With a blank line between each group.

### JavaScript Import Order

```javascript
// 1. Node.js built-ins
const path = require('path');
const fs = require('fs');

// 2. Third-party packages
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const winston = require('winston');

// 3. Local modules - grouped by type
// Core modules
const { LIB_DIR, DEFAULT_BASE_PATH } = require('./core');

// Handler modules
const { handleMemorySearch } = require('./handlers');

// Utility modules
const { validateInputLengths } = require('./utils');
```

### TypeScript Import Order

TypeScript follows a four-group ordering. Type-only imports are always last.

```typescript
// 1. Node.js built-in modules
import path from 'path';
import fs from 'fs';

// 2. Third-party packages
import Database from 'better-sqlite3';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

// 3. Local modules (project code)
import { loadConfig } from './core/config';
import { MemoryError, ErrorCode } from './errors/core';

// 4. Type-only imports (separate line, always last)
import type { SearchOptions, SearchResult } from '../types';
import type { DatabaseConfig } from './core/config';
```

**Key rule**: Use `import type` for imports used only in type positions (annotations, generics, return types). This ensures they are erased at compile time.

### Python Import Order

```python
# 1. Standard library
import os
import sys
import json
from pathlib import Path

# 2. Third-party packages
import yaml
import requests

# 3. Local modules
from .core import config
from .handlers import memory_handler
from .utils import validation
```

### Shell "Import" Order

Shell uses `source` instead of imports:

```bash
# 1. Script directory resolution
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 2. Load common libraries first
source "${SCRIPT_DIR}/lib/common.sh"

# 3. Load specific libraries
source "${SCRIPT_DIR}/lib/validation.sh"
source "${SCRIPT_DIR}/lib/output.sh"
```

---

<!-- /ANCHOR:import-ordering -->
<!-- ANCHOR:export-patterns -->
## 5. EXPORT PATTERNS

### JavaScript CommonJS Exports

Use object literal at end of file:

```javascript
/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Primary exports (camelCase)
  handleMemorySearch,
  handleMemorySave,
  validateInput,

  // Backward-compatible aliases (snake_case) — MCP handlers only
  handle_memory_search: handleMemorySearch,
  handle_memory_save: handleMemorySave,
  validate_input: validateInput,
};
```

Evidence: `scripts/core/config.ts:167-183`

### TypeScript ES Module Exports

TypeScript source uses ES module syntax. The compiler outputs CommonJS.

```typescript
// Named exports (preferred)
export function search(query: string): SearchResult[] { }
export class VectorIndex { }
export const MAX_RESULTS = 100;

// Type-only exports (erased at compile time)
export type { SearchResult, SearchOptions };

// Barrel file (index.ts) — re-exports from submodules
export { MemoryError, ErrorCode } from './errors/core';
export { VectorIndex } from './search/vector-index';
export type { SearchResult } from '../types';

// Default export (use sparingly — named exports preferred)
export default class ContextServer { }

// Re-export everything
export * from './module';
export type * from './types';
```

### Re-export Wrappers

When wrapping external modules:

```typescript
// lib/errors.ts - Re-export with enhancements

// Import base definitions
import { ErrorCodes } from './errors/core';
import { getRecoveryHint, ERROR_CODES } from './errors/recovery-hints';

// Re-export everything consumers need
export { ErrorCodes, getRecoveryHint, ERROR_CODES };
export { MemoryError, buildErrorResponse } from './errors/core';
export type { ErrorResponse } from './errors/core';
```

### Python Exports

Use `__all__` to declare public API:

```python
# Define public API
__all__ = [
    'validate_document',
    'DocumentError',
    'ValidationResult',
]

# Implementation follows...
```

---

<!-- /ANCHOR:export-patterns -->
<!-- ANCHOR:directory-conventions -->
## 6. DIRECTORY CONVENTIONS

### OpenCode Skill Structure

```
.opencode/skill/{skill-name}/
├── SKILL.md                    # Main skill definition
├── references/                 # Deep documentation
│   ├── shared/                 # Cross-language patterns
│   │   ├── universal_patterns.md
│   │   └── code_organization.md
│   ├── javascript/             # JS-specific
│   │   ├── style_guide.md
│   │   ├── quality_standards.md
│   │   └── quick_reference.md
│   ├── typescript/             # TS-specific
│   │   ├── style_guide.md
│   │   ├── quality_standards.md
│   │   └── quick_reference.md
│   ├── python/                 # Python-specific
│   └── shell/                  # Shell-specific
├── assets/                     # Templates, checklists
│   └── checklists/
│       ├── universal_checklist.md
│       └── {lang}_checklist.md
└── scripts/                    # Executable tools
    └── *.py
```

### MCP Server Structure

```
mcp_server/
├── context-server.ts           # Entry point
├── tsconfig.json               # TypeScript config
├── package.json
├── run-tests.js                # Test runner
├── configs/                    # Runtime configuration
│   └── search-weights.json
├── core/                       # Core state and config
│   ├── index.ts                # Barrel exports
│   ├── config.ts               # Server configuration
│   └── db-state.ts             # Database state management
├── handlers/                   # Request handlers
│   ├── index.ts                # Barrel exports
│   ├── memory-search.ts        # Search operations
│   ├── memory-save.ts          # Save operations
│   ├── memory-crud.ts          # CRUD operations
│   ├── memory-context.ts       # Context retrieval
│   ├── memory-index.ts         # Index management
│   ├── memory-triggers.ts      # Trigger matching
│   ├── causal-graph.ts         # Causal graph operations
│   ├── checkpoints.ts          # Checkpoint management
│   └── session-learning.ts     # Session learning
├── formatters/                 # Output formatting
│   ├── index.ts                # Barrel exports
│   ├── search-results.ts       # Search result formatting
│   └── token-metrics.ts        # Token usage metrics
├── hooks/                      # Lifecycle hooks
│   ├── index.ts                # Barrel exports
│   └── memory-surface.ts       # Memory surfacing hook
├── lib/                        # Libraries and utilities
│   ├── errors.ts               # Error re-exports
│   ├── architecture/           # Architecture definitions
│   │   └── layer-definitions.ts
│   ├── cache/                  # Caching layer
│   │   └── tool-cache.ts
│   ├── cognitive/              # Cognitive science models
│   │   ├── archival-manager.ts
│   │   ├── attention-decay.ts
│   │   ├── co-activation.ts
│   │   ├── fsrs-scheduler.ts
│   │   ├── prediction-error-gate.ts
│   │   ├── tier-classifier.ts
│   │   └── working-memory.ts
│   ├── config/                 # Type and memory config
│   │   ├── memory-types.ts
│   │   └── type-inference.ts
│   ├── embeddings/             # (placeholder)
│   ├── errors/                 # Error definitions
│   │   ├── index.ts            # Barrel exports
│   │   ├── core.ts             # Core error classes
│   │   └── recovery-hints.ts   # Recovery suggestions
│   ├── interfaces/             # (placeholder)
│   ├── learning/               # (placeholder)
│   ├── parsing/                # Input parsing
│   │   ├── memory-parser.ts
│   │   └── trigger-matcher.ts
│   ├── providers/              # External service providers
│   │   ├── embeddings.ts       # Embedding generation
│   │   └── retry-manager.ts    # Retry logic
│   ├── response/               # Response formatting
│   │   └── envelope.ts         # Response envelope
│   ├── scoring/                # Relevance scoring
│   │   ├── composite-scoring.ts
│   │   ├── confidence-tracker.ts
│   │   ├── folder-scoring.ts
│   │   └── importance-tiers.ts
│   ├── search/                 # Search engines
│   │   ├── bm25-index.ts       # BM25 text search
│   │   ├── cross-encoder.ts    # Re-ranking
│   │   ├── hybrid-search.ts    # Hybrid search pipeline
│   │   ├── intent-classifier.ts
│   │   ├── vector-index.ts     # Vector similarity search
│   │   └── vector-index-impl.js # Native implementation
│   ├── session/                # Session management
│   │   └── session-manager.ts
│   ├── storage/                # Persistence layer
│   │   ├── access-tracker.ts
│   │   ├── causal-edges.ts
│   │   ├── checkpoints.ts
│   │   ├── incremental-index.ts
│   │   └── transaction-manager.ts
│   ├── utils/                  # General utilities
│   │   ├── format-helpers.ts
│   │   └── path-security.ts
│   └── validation/             # Input validation
│       └── preflight.ts
├── scripts/                    # Server-specific scripts
│   └── reindex-embeddings.ts
├── utils/                      # Top-level utilities
│   ├── index.ts                # Barrel exports
│   ├── batch-processor.ts
│   ├── json-helpers.ts
│   └── validators.ts
├── tests/                      # Test files (*.test.ts, *.test.js)
│   ├── fixtures/               # Test fixture data
│   └── *.test.ts / *.test.js
└── database/                   # SQLite files (gitignored)
```

### Script Directory Structure

```
scripts/
├── common.sh                   # Shared shell utilities
├── registry-loader.sh          # Script registry loader
├── scripts-registry.json       # Script metadata registry
├── package.json
├── tsconfig.json
├── core/                       # Core script logic
│   ├── index.ts                # Barrel exports
│   ├── config.ts               # Script configuration
│   ├── subfolder-utils.ts      # Spec folder pattern matching and child resolution
│   └── workflow.ts             # Workflow orchestration
├── extractors/                 # Data extractors
│   ├── index.ts                # Barrel exports
│   ├── collect-session-data.ts
│   ├── conversation-extractor.ts
│   ├── decision-extractor.ts
│   ├── diagram-extractor.ts
│   ├── file-extractor.ts
│   ├── implementation-guide-extractor.ts
│   ├── opencode-capture.ts
│   └── session-extractor.ts
├── lib/                        # Shared libraries
│   ├── anchor-generator.ts
│   ├── ascii-boxes.ts
│   ├── content-filter.ts
│   ├── decision-tree-generator.ts
│   ├── embeddings.ts
│   ├── flowchart-generator.ts
│   ├── retry-manager.ts
│   ├── semantic-summarizer.ts
│   ├── simulation-factory.ts
│   └── trigger-extractor.ts
├── loaders/                    # Data loaders
│   ├── index.ts
│   └── data-loader.ts
├── memory/                     # Memory management
│   ├── generate-context.ts
│   ├── cleanup-orphaned-vectors.ts
│   └── rank-memories.ts
├── renderers/                  # Template renderers
│   ├── index.ts
│   └── template-renderer.ts
├── rules/                      # Validation rules (shell)
│   ├── check-ai-protocols.sh
│   ├── check-anchors.sh
│   ├── check-complexity.sh
│   ├── check-evidence.sh
│   ├── check-files.sh
│   ├── check-folder-naming.sh
│   ├── check-frontmatter.sh
│   ├── check-level.sh
│   ├── check-level-match.sh
│   ├── check-placeholders.sh
│   ├── check-priority-tags.sh
│   ├── check-section-counts.sh
│   └── check-sections.sh
├── setup/                      # Setup and installation
│   ├── check-native-modules.sh
│   ├── check-prerequisites.sh
│   ├── rebuild-native-modules.sh
│   └── record-node-version.js
├── spec/                       # Spec folder operations
│   ├── archive.sh
│   ├── calculate-completeness.sh
│   ├── check-completion.sh
│   ├── create.sh
│   ├── recommend-level.sh
│   └── validate.sh
├── spec-folder/                # Spec folder utilities (TS)
│   ├── index.ts
│   ├── alignment-validator.ts
│   ├── directory-setup.ts
│   └── folder-detector.ts
├── templates/                  # Template composition
│   └── compose.sh
├── utils/                      # Utility modules
│   ├── index.ts
│   ├── data-validator.ts
│   ├── file-helpers.ts
│   ├── input-normalizer.ts
│   ├── logger.ts
│   ├── message-utils.ts
│   ├── path-utils.ts
│   ├── prompt-utils.ts
│   ├── tool-detection.ts
│   └── validation-utils.ts
├── tests/                      # Test suites
│   ├── test_dual_threshold.py
│   ├── test-*.js / test-*.sh
│   └── ...
└── test-fixtures/              # Validation test fixtures
    └── 001-* through 051-*
```

---

<!-- /ANCHOR:directory-conventions -->
<!-- ANCHOR:test-file-conventions -->
## 7. TEST FILE CONVENTIONS

### Test File Naming

| Language   | Pattern                   | Example                    |
|------------|---------------------------|----------------------------|
| JavaScript | `*.test.js`               | `memory-search.test.js`    |
| TypeScript | `*.test.ts`               | `memory-search.test.ts`    |
| Python     | `test_*.py`               | `test_dual_threshold.py`   |
| Shell      | `test_*.sh` or `*.test.sh`| `test_validation.sh`       |

### Test File Location

Keep tests close to source:

```
Option A: Adjacent tests/
lib/
├── search/
│   ├── vector-index.ts
│   └── tests/
│       └── vector-index.test.ts

Option B: Top-level tests/
lib/
├── search/
│   └── vector-index.ts
tests/
└── search/
    └── vector-index.test.ts
```

OpenCode uses **Option B** (top-level tests/) for most projects.

### Test File Structure

```javascript
// *.test.js structure
const assert = require('assert');
const { functionToTest } = require('../path/to/module');

describe('functionToTest', () => {
  describe('when given valid input', () => {
    it('should return expected result', () => {
      const result = functionToTest('valid');
      assert.strictEqual(result, expected);
    });
  });

  describe('when given invalid input', () => {
    it('should throw appropriate error', () => {
      assert.throws(() => functionToTest(null), /expected error/);
    });
  });
});
```

---

<!-- /ANCHOR:test-file-conventions -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Universal Patterns

- `universal_patterns.md` - Naming, commenting, reference patterns

### Language-Specific Organization

- `../javascript/style_guide.md` - JS module patterns, exports
- `../typescript/style_guide.md` - TS imports, types, ES module syntax
- `../python/style_guide.md` - Python imports, `__all__`
- `../shell/style_guide.md` - Shell sourcing, functions
- `../config/style_guide.md` - JSON/JSONC structure
<!-- /ANCHOR:related-resources -->
