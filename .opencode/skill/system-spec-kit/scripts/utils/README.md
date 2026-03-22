---
title: "System Spec Kit Utilities"
description: "Shared utility modules providing core functionality for validation, normalization, frontmatter handling, path safety, and workspace/tool identification across system-spec-kit scripts."
trigger_phrases:
  - "spec kit utilities"
  - "data validator path utils"
  - "script utility modules"
---

# System Spec Kit Utilities

> Shared utility modules providing core functionality for validation, normalization, frontmatter handling, path safety, and workspace/tool identification across all system-spec-kit scripts.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. TROUBLESHOOTING](#4--troubleshooting)
- [5. RELATED DOCUMENTS](#5--related-documents)

---

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### What are System Spec Kit Utilities?

The utilities folder contains reusable TypeScript modules (compiled to JavaScript) plus a small direct-runtime JavaScript helper that provide core functionality for all system-spec-kit scripts. These modules handle data validation, path security, file I/O, structured logging, message formatting, prompt generation and tool detection. They enforce security standards (CWE-22 path traversal prevention), normalize diverse input formats and provide consistent error handling across the entire script collection.

**Build System**: TypeScript source files (`.ts`) are compiled to `dist/utils/` using the TypeScript compiler. Scripts import from the compiled output at runtime.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Utility Modules | 20 | 19 TypeScript modules plus 1 JavaScript helper |
| Primary Functions | 40+ | Validation, sanitization, normalization, logging |
| Security Standards | CWE-22, Path Traversal | Enforced in path-utils.ts |

### Key Features

| Feature | Description |
|---------|-------------|
| **Data Validation** | Transforms and validates spec folder data structures with flag mappings |
| **Path Security** | Sanitizes file paths, prevents directory traversal (CWE-22) |
| **Input Normalization** | Transforms varied input formats (strings, objects, arrays) into consistent structures |
| **File Operations** | Safe file reading/writing with UTF-8 encoding and error handling |
| **Structured Logging** | Consistent logging with severity levels and structured context |
| **Message Utilities** | Formats user-facing messages and error reporting |
| **Tool Detection** | Identifies available MCP tools and capabilities |
| **Validation Utilities** | Path-scoped rule validation and checklist verification |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| Environment | System-spec-kit scripts | Used across all script types |

---

<!-- /ANCHOR:overview -->

## 2. QUICK START
<!-- ANCHOR:quick-start -->

```bash
# 1. Navigate to scripts directory
cd .opencode/skill/system-spec-kit/scripts

# 2. Build TypeScript (compiles to dist/)
npm run build   # or: tsc -b

# 3. Use compiled modules in your script
node -e "const { sanitizePath } = require('./dist/utils/path-utils'); console.log(sanitizePath('/specs/001-test'));"
```

### Verify Utilities

```bash
# Check all source utility files exist
ls -la utils/*.{ts,js}
# Expected: 19 TypeScript files plus 1 JavaScript helper

# Check compiled output exists
ls -la dist/utils/*.js
# Expected: Compiled JavaScript files

# Test path sanitization (uses compiled output)
node -e "const { sanitizePath } = require('./dist/utils/path-utils'); console.log(sanitizePath('./specs/<test-folder>'));"
# Expected: Absolute path to specs/<test-folder>
```

### First Use

```javascript
// Import utilities from compiled output (CommonJS)
const { sanitizePath } = require('./dist/utils/path-utils');
const { readJsonFile } = require('./dist/utils/file-helpers');
const { structuredLog } = require('./dist/utils/logger');
const { validateDataStructure } = require('./dist/utils/data-validator');
const { normalizeInputData } = require('./dist/utils/input-normalizer');

// Use path sanitization (prevents CWE-22 attacks)
const safePath = sanitizePath('/specs/001-feature');

// Read JSON safely
const data = readJsonFile('/path/to/data.json');

// Log with structure
structuredLog('info', 'Processing spec folder', { path: safePath });
```

---

<!-- /ANCHOR:quick-start -->

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
utils/
├── data-validator.ts          # Data structure validation and flag mappings
├── fact-coercion.ts           # Fact normalization and coercion helpers
├── file-helpers.ts            # Safe file read/write operations
├── index.ts                   # Module exports aggregator
├── input-normalizer.ts        # Input format normalization and transformation
├── logger.ts                  # Structured logging utilities
├── memory-frontmatter.ts      # Memory document frontmatter parsing and formatting
├── message-utils.ts           # User-facing message formatting
├── path-utils.ts              # Path sanitization and security (CWE-22)
├── phase-classifier.ts        # Workflow phase classification helpers
├── prompt-utils.ts            # Prompt generation and formatting
├── slug-utils.ts              # Content-aware slug generation and memory filename uniqueness
├── source-capabilities.ts     # Source capability and provenance helpers
├── spec-affinity.ts           # Spec matching and affinity scoring helpers
├── task-enrichment.ts         # Task title enrichment from spec titles and memory context
├── template-structure.js      # Template structure lookup and validation helpers
├── tool-detection.ts          # MCP tool capability detection
├── tool-sanitizer.ts          # Tool input and output sanitization helpers
├── validation-utils.ts        # Path-scoped validation and checklist verification
├── workspace-identity.ts      # Workspace identity detection and normalization
└── README.md                  # This file

Compiled output and direct-runtime helper:
dist/utils/                    # TypeScript compilation output
├── data-validator.js          # Compiled JavaScript + type definitions
├── fact-coercion.js
├── file-helpers.js
├── index.js
├── input-normalizer.js
├── logger.js
├── memory-frontmatter.js
├── message-utils.js
├── path-utils.js
├── phase-classifier.js
├── prompt-utils.js
├── slug-utils.js
├── source-capabilities.js
├── spec-affinity.js
├── task-enrichment.js
├── tool-detection.js
├── tool-sanitizer.js
├── validation-utils.js
├── workspace-identity.js
└── *.d.ts, *.js.map           # Type definitions and source maps for each TS module

Direct-runtime helper:
utils/template-structure.js    # Source-only helper (not emitted to dist/)
```

### Key Files

| File | Purpose |
|------|---------|
| `data-validator.ts` | Validates and transforms spec folder data structures. Applies flag mappings for arrays and presence checks |
| `fact-coercion.ts` | Coerces extracted facts into normalized values for downstream utilities |
| `file-helpers.ts` | Provides safe file I/O operations with UTF-8 encoding, existence checks and error handling |
| `index.ts` | Aggregates exports from all utility modules for convenient importing |
| `input-normalizer.ts` | Normalizes diverse input formats (strings, objects, arrays) into consistent structures. Transforms key decisions |
| `logger.ts` | Structured logging with severity levels (info, warn, error) and contextual data |
| `memory-frontmatter.ts` | Builds and normalizes frontmatter metadata for memory documents |
| `message-utils.ts` | Formats user-facing messages, error reports and validation feedback |
| `path-utils.ts` | Sanitizes file paths to prevent directory traversal (CWE-22). Validates against allowed base directories |
| `phase-classifier.ts` | Classifies tasks or captured context into workflow phases |
| `prompt-utils.ts` | Generates prompts for CLI interactions and user input collection |
| `tool-detection.ts` | Detects available MCP tools and their capabilities for dynamic feature enablement |
| `source-capabilities.ts` | Normalizes metadata about source capabilities and available behaviors |
| `spec-affinity.ts` | Scores how strongly content aligns with a candidate spec folder |
| `slug-utils.ts` | Content-aware slug generation for memory filenames. Provides `ensureUniqueMemoryFilename()` to prevent collisions via `-1`, `-2` suffix appending |
| `task-enrichment.ts` | Task title enrichment from spec titles and memory context for higher-quality memory naming |
| `template-structure.js` | Defines helper logic for working with template structure layouts |
| `tool-sanitizer.ts` | Sanitizes tool payloads before reuse, storage, or display |
| `validation-utils.ts` | Validates spec folders against path-scoped rules. Verifies checklist completeness |
| `workspace-identity.ts` | Detects and normalizes workspace identity details for current runs |

---

<!-- /ANCHOR:structure -->

## 4. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Path sanitization blocks valid paths

**Symptom**: `Error: Path outside allowed directories: /some/path`

**Cause**: `sanitizePath()` enforces allowed base directories (cwd, specs, .opencode)

**Solution**:
```javascript
// Option 1: Add to allowed bases
const safePath = sanitizePath(inputPath, [
  process.cwd(),
  '/custom/allowed/path'
]);

// Option 2: Use relative path from allowed base
const safePath = sanitizePath('./specs/001-test');
```

#### File read returns undefined

**Symptom**: `readJsonFile()` returns undefined instead of throwing error

**Cause**: File doesn't exist but error handling suppresses exception

**Solution**:
```javascript
const { readJsonFile } = require('./file-helpers');
const data = readJsonFile('/path/to/file.json');

if (!data) {
  console.error('File not found or invalid JSON');
  process.exit(1);
}
```

#### Input normalization doesn't match expected format

**Symptom**: `normalizeInputData()` returns unexpected structure

**Cause**: Input format doesn't match expected patterns

**Solution**:
```javascript
const { normalizeInputData } = require('./dist/utils/input-normalizer');

// Ensure input matches expected shape
const normalized = normalizeInputData({
  specFolder: '/specs/001-test',
  summary: 'Test summary',
  keyDecisions: ['Decision 1', 'Decision 2'] // Array of strings or objects
});

console.log(normalized);
```

#### Structured logs not appearing

**Symptom**: `structuredLog()` calls produce no output

**Cause**: Log level filtering or incorrect severity

**Solution**:
```javascript
const { structuredLog } = require('./dist/utils/logger');

// Use correct severity levels
structuredLog('info', 'Information message', { context: 'data' });
structuredLog('warn', 'Warning message', { context: 'data' });
structuredLog('error', 'Error message', { context: 'data' });

// Check environment variables
console.log(process.env.LOG_LEVEL); // Should be 'info', 'warn', or 'error'
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Path outside allowed dirs | Use relative paths from cwd/specs/.opencode |
| File not found | Check file existence with `fs.existsSync()` before calling helpers |
| Invalid JSON | Validate JSON syntax before passing to `readJsonFile()` |
| Module not found | Ensure you're requiring from `./dist/utils/module` (compiled output) |
| TypeScript compile errors | Run `tsc -b` from scripts directory to rebuild |

### Diagnostic Commands

```bash
# Check TypeScript source files exist
ls -la utils/*.ts

# Check compiled output exists
ls -la dist/utils/*.js

# Test path sanitization (from scripts directory)
node -e "const { sanitizePath } = require('./dist/utils/path-utils'); console.log(sanitizePath('./specs/<test-folder>'));"

# Verify module exports
node -e "const utils = require('./dist/utils/index'); console.log(Object.keys(utils));"

# Test data validator
node -e "const { validateDataStructure } = require('./dist/utils/data-validator'); console.log(validateDataStructure({ SUMMARY: 'test' }));"
```

---

<!-- /ANCHOR:troubleshooting -->

## 5. RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [Scripts README](../README.md) | Overview of all system-spec-kit scripts that use these utilities |
| [Validation Rules](../../references/validation/validation_rules.md) | Rules enforced by validation-utils.ts |
| [Path-Scoped Rules](../../references/validation/path_scoped_rules.md) | Path validation logic used by validation-utils.ts |
| [Memory System](../../references/memory/memory_system.md) | Uses input-normalizer for memory save data |

### External Resources

| Resource | Description |
|----------|-------------|
| [CWE-22: Path Traversal](https://cwe.mitre.org/data/definitions/22.html) | Security standard enforced by path-utils.ts |
| [Node.js File System](https://nodejs.org/api/fs.html) | API used by file-helpers.ts |
| [Node.js Path Module](https://nodejs.org/api/path.html) | API used by path-utils.ts |

---

*Documentation for system-spec-kit utilities v2.1 | TypeScript Migration | Last updated: 2026-03-22*

<!-- /ANCHOR:related -->
