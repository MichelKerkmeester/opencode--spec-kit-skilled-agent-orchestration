---
title: Universal Patterns - Cross-Language Code Standards
description: Patterns applicable to ALL languages in OpenCode system code including naming principles, commenting philosophy, and reference comment patterns.
---

# Universal Patterns - Cross-Language Code Standards

Patterns applicable to ALL languages in OpenCode system code.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This reference defines patterns that apply universally across JavaScript, TypeScript, Python, Shell, and JSON/JSONC in the OpenCode codebase. These principles ensure consistency regardless of language choice.

### Core Principle

> **Clarity over cleverness.** Code is read far more often than written. Optimize for the reader, not the writer.

### When to Use

- Before writing any new OpenCode system code
- When reviewing code for consistency
- When onboarding to OpenCode development patterns
- As the foundation before applying language-specific rules

### Key Sources (Evidence)

| Pattern | Source File | Line Reference |
|---------|-------------|----------------|
| Reference comments | `mcp_server/context-server.ts` | Lines 34, 42, 62, 65 |
| Section organization | `scripts/core/config.ts` | Lines 9-11, 24-26 |
| Naming conventions | `mcp_server/handlers/memory-search.ts` | Throughout |
| Python docstrings | `scripts/skill_advisor.py` | Lines 6-16, 439-486 |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:naming-principles -->
## 2. NAMING PRINCIPLES

### Descriptive Names

Names should describe what something IS or DOES without requiring context:

**Good** (JS/TS use camelCase, Python/Shell use snake_case):
```javascript
// JavaScript
calculateMemoryScore()
validateInputLengths()
handleMemorySearch()
```
```typescript
// TypeScript (same as JS for functions; PascalCase for types)
calculateMemoryScore()
validateInputLengths()
interface SearchResult { }
type MemoryState = 'active' | 'archived';
```
```python
# Python
calculate_memory_score()
validate_input_lengths()
handle_memory_search()
```

**Bad**:
```
calcScore()
validateLengths()
handle()
```

### Avoid Abbreviations

Spell out words unless industry-standard:

| Use | Don't Use | Exception |
|-----|-----------|-----------|
| `configuration` | `cfg` | - |
| `database` | `db` | OK for `DB` in constants |
| `message` | `msg` | - |
| `request` | `req` | OK in route handlers |
| `response` | `res` | OK in route handlers |
| `HTTP` | `http` | OK - industry standard |
| `URL` | `url` | OK - industry standard |
| `ID` | `id` | OK - industry standard |

### Consistency Rule

Same concept = same name across the entire codebase:

```javascript
// GOOD: Consistent naming (JS/TS)
memorySearch()          // in handlers
handleMemorySearch()    // wrapper
MemorySearchResult      // type/interface (PascalCase)

// BAD: Inconsistent naming
memorySearch()          // in handlers
handle_search()         // wrapper - wrong convention!
SearchMemoryResult      // type - different word order!
```

### Boolean Naming

Booleans should read as questions:

```javascript
// JavaScript / TypeScript (camelCase)
isValid
hasResults
canProceed
shouldRetry
enableDedup
```

```typescript
// TypeScript — with type annotation
const isValid: boolean = true;
const hasResults: boolean = items.length > 0;
```

```python
# Python / Shell (snake_case)
is_valid
has_results
can_proceed
should_retry
enable_dedup
```

```
// BAD (any language)
valid      // is it valid? or make it valid?
results    // what about results?
proceed    // noun or verb?
```

### Plural Naming for Collections

Arrays and collections use plural names:

```
// GOOD
const memories = [];
const results = searchResults.items;
for (const entry of entries) { ... }

// BAD
const memory = [];        // misleading - it's an array
const result = results.items;  // confusing
for (const entry of entry) { ... }  // very confusing
```

---

<!-- /ANCHOR:naming-principles -->
<!-- ANCHOR:commenting-philosophy -->
## 3. COMMENTING PHILOSOPHY

### Core Principles

1. **Quantity limit:** Maximum 3 comments per 10 lines of code
2. **Focus on purposeful semantics:** Explain WHY something is done, not WHAT it does
3. **No commented-out code:** Delete unused code (git preserves history)
4. **Function purpose comments:** Single line above function describing intent
5. **Capitalization:** Every inline comment sentence MUST start with a capital letter
   - `// Process items in reverse order` (correct)
   - `// process items in reverse order` (wrong)
   - Exception: `eslint-disable`, `@ts-` directives, and technical identifiers (e.g., `// e.g. ...`)

### WHY Not WHAT

Comments explain **reasoning**, not **mechanics**:

**Bad - describes WHAT**:
```javascript
// Loop through items
for (const item of items) { ... }

// Increment counter
counter++;

// Check if valid
if (isValid) { ... }
```

**Good - explains WHY**:
```javascript
// Process in reverse order for dependency resolution
for (const item of items.reverse()) { ... }

// Track retry count for exponential backoff control
retryCount++;

// Skip invalid entries to avoid downstream embedding errors
if (!isValid) return null;
```

### When to Comment

| Situation | Comment? | Example |
|-----------|----------|---------|
| Non-obvious logic | YES | `// Sort timestamp DESC so newest appears first` |
| Business rule | YES | `// REQ-005: constitutional tier always surfaces` |
| Workaround | YES | `// Workaround for SDK bug #123` |
| Security concern | YES | `// SEC-001: sanitize input (CWE-79)` |
| Self-explanatory code | NO | `const sum = a + b;` needs no comment |
| Obvious loops | NO | `for (let i = 0; i < 10; i++)` needs no comment |

### Comment Placement

Place comments on the line BEFORE the code they describe:

```javascript
// GOOD: Comment before
// Calculate weighted score using decay function
const score = calculateDecay(baseScore, age);

// BAD: Comment after
const score = calculateDecay(baseScore, age); // weighted decay
```

---

<!-- /ANCHOR:commenting-philosophy -->
<!-- ANCHOR:reference-comment-patterns -->
## 4. REFERENCE COMMENT PATTERNS

Reference comments create traceability between code and requirements/issues. OpenCode uses these prefixes:

### Pattern Reference Table

| Prefix | Purpose | Format | Example |
|--------|---------|--------|---------|
| `T###` | Task reference | `// T001: Description` | `// T043-T047: Causal Memory Graph handlers` |
| `BUG-###` | Bug fix tracking | `// BUG-042: Fix race condition` | `// BUG-107: Pending file recovery on startup` |
| `REQ-###` | Requirement tracing | `// REQ-003: Must support UTF-8` | `// REQ-033: Transaction manager for recovery` |
| `SEC-###` | Security note | `// SEC-001: Description (CWE-XXX)` | `// SEC-001: Sanitize user input (CWE-79)` |
| `CHK-###` | Checklist item | `// CHK-160: Token budget estimation` | `// CHK-160: Pre-flight validation` |

### Evidence from Codebase

```typescript
// From context-server.ts:34,62,65
// T043-T047: Causal Memory Graph handlers
handleMemoryDriftWhy, handleMemoryCausalLink, handleMemoryCausalStats, handleMemoryCausalUnlink,

// T001-T004: Session deduplication
import * as sessionManager from './lib/session/session-manager';

// T107/REQ-033: transaction manager for pending file recovery
import * as transactionManager from './lib/storage/transaction-manager';
```

### When to Use Reference Comments

1. **Implementing a specific task**: Link to task ID
2. **Fixing a reported bug**: Link to bug tracker ID
3. **Implementing a requirement**: Link to requirement spec
4. **Security-sensitive code**: Link to CWE and document mitigation
5. **Checklist validation**: Link to specific checklist item

### Grouping Related Tasks

For related tasks, use range notation:

```javascript
// GOOD: Range for related tasks
// T043-T047: Causal Memory Graph handlers

// ALSO GOOD: List for non-sequential
// T001, T004, T015: Session management handlers

// BAD: Individual comments for each
// T043: drift_why handler
// T044: causal_link handler
// T045: causal_stats handler
// T046: (etc - too verbose)
```

### Design Principles Gate (KISS/DRY/SOLID)

Apply this gate before finalizing implementation:

1. **KISS**: remove speculative layers that do not serve current behavior.
2. **DRY**: centralize repeated literals/rules into a single source.
3. **SOLID**: flag SRP/OCP/LSP/ISP/DIP violations and simplify before merge.

Carry-over from 139: keep rule constants centralized and test imports referencing those constants (avoid duplicate local literals).

---

<!-- /ANCHOR:reference-comment-patterns -->
<!-- ANCHOR:file-organization -->
## 5. FILE ORGANIZATION

### Universal Section Order

All files follow a consistent section progression:

```
Preamble (unnumbered in code):
- Header (shebang for scripts, box-drawing title)
- Directives ('use strict', set -euo pipefail)

Numbered code sections:
1. Imports/Dependencies
2. Constants/Configuration
3. Type Definitions (if applicable)
4. Helper Functions (private/internal)
5. Main Logic (public API)
6. Exports (module.exports, __all__)
7. Main Entry Point (if script)
```

### Section Dividers

Use numbered section dividers to organize code:

The first numbered divider that appears in code starts at `1`. If a file omits imports or another early section, renumber the remaining sections sequentially instead of skipping to `2`.

**JavaScript**:
```javascript
/* ─────────────────────────────────────────────────────────────
   1. MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

// imports here

/* ─────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

// constants here
```

**Python**:
```python
# ─────────────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────────────

# imports here

# ─────────────────────────────────────────────────────────────
# 2. CONSTANTS
# ─────────────────────────────────────────────────────────────

# constants here
```

**Shell**:
```bash
# ─────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ─────────────────────────────────────────────────────────────

# config here

# ─────────────────────────────────────────────────────────────
# 2. FUNCTIONS
# ─────────────────────────────────────────────────────────────

# functions here
```

### File Length Guidelines

| File Type | Recommended Max | Action if Exceeded |
|-----------|-----------------|-------------------|
| Utility/helper | 200 lines | Consider splitting |
| Handler/endpoint | 300 lines | Split by domain |
| Main entry point | 400 lines | Extract modules |
| Configuration | 100 lines | Split by concern |

---

<!-- /ANCHOR:file-organization -->
<!-- ANCHOR:security-patterns -->
## 6. SECURITY PATTERNS

### Input Validation (All Languages)

Always validate external input:

```javascript
// JavaScript
const { validateInputLengths } = require('./utils');
if (!validateInputLengths(query, MAX_QUERY_LENGTH)) {
  throw new Error('Query exceeds maximum length');
}
```

```python
# Python
def validate_input(text: str, max_length: int = 10000) -> bool:
    """Validate input length to prevent DoS attacks (CWE-400)."""
    return len(text) <= max_length
```

### Path Traversal Prevention (CWE-22)

Never trust user-provided paths:

```javascript
// JavaScript
const safePath = fs.realpathSync(path.resolve(baseDir, userPath));
const basePath = fs.realpathSync(baseDir);
const relative = path.relative(basePath, safePath);
if (relative.startsWith('..') || path.isAbsolute(relative)) {
  throw new Error('Path traversal detected');
}
```

```python
# Python
import os
safe_path = os.path.realpath(os.path.join(base_dir, user_path))
relative = os.path.relpath(safe_path, os.path.realpath(base_dir))
if relative.startswith(".."):
    raise ValueError("Path traversal detected")
```

### Spec Folder Path Invariants (OpenCode scripts)

When code touches spec folders (`specs/` or `.opencode/specs/`), enforce these rules:

- Canonicalize both candidate path and allowed roots (`realpath`)
- Validate containment with `relative` or boundary-safe checks, never plain substring checks
- Enforce spec folder naming pattern `NNN-name` before destructive operations
- Reject restore/archive/create targets outside approved roots
- Do not emit rollback/restore instructions unless checkpoint creation actually succeeded

### Secrets Management

Never hardcode secrets:

```javascript
// GOOD: Environment variable
const apiKey = process.env.API_KEY;

// BAD: Hardcoded
const apiKey = "sk-1234567890abcdef";
```

---

<!-- /ANCHOR:security-patterns -->
<!-- ANCHOR:contributor-copy-paste-alignment-examples -->
## 7. CONTRIBUTOR COPY-PASTE ALIGNMENT EXAMPLES

Use these when you need the same intent across TS, JS, Python, Shell, and JSON/JSONC.

### Pattern A: Validate early, then continue

**TypeScript**
```typescript
function searchMemories(queryText: string): string[] {
  if (queryText.length === 0) {
    throw new Error('queryText must not be empty');
  }
  return [queryText];
}
```

**JavaScript**
```javascript
function searchMemories(queryText) {
  if (!queryText || typeof queryText !== 'string') {
    return { success: false, error: 'queryText must be a non-empty string' };
  }
  return { success: true, data: [queryText] };
}
```

**Python**
```python
from typing import List, Tuple


def search_memories(query_text: str) -> Tuple[bool, List[str], str]:
    if not query_text:
        return False, [], "query_text must not be empty"
    return True, [query_text], ""
```

**Shell**
```bash
search_memories() {
    local query_text="${1:-}"
    if [[ -z "$query_text" ]]; then
        printf 'ERROR: query_text must not be empty\n' >&2
        return 1
    fi
    printf '%s\n' "$query_text"
}
```

**JSON/JSONC**
```jsonc
{
  "validation": {
    "requireNonEmptyQueryText": true,
    "maxQueryLength": 10000
  }
}
```

### Pattern B: Keep naming aligned across languages

Use equivalent names with language-appropriate casing for the same concept.

| Concept | TypeScript / JavaScript | Python / Shell | JSON/JSONC |
|---------|--------------------------|----------------|------------|
| Query text | `queryText` | `query_text` | `queryText` |
| Is valid flag | `isValid` | `is_valid` | `isValid` |
| Max results | `maxResults` | `max_results` | `maxResults` |

### Pattern C: Reference comment traceability

Use the same task/requirement IDs across code and config comments.

**TypeScript / JavaScript**
```typescript
// REQ-033: Keep retry budget bounded for startup recovery
const MAX_RETRIES = 3;
```

**Python / Shell**
```python
# REQ-033: Keep retry budget bounded for startup recovery
MAX_RETRIES = 3
```

```bash
# REQ-033: Keep retry budget bounded for startup recovery
readonly MAX_RETRIES=3
```

**JSONC**
```jsonc
{
  // REQ-033: Keep retry budget bounded for startup recovery
  "maxRetries": 3
}
```

---

<!-- /ANCHOR:contributor-copy-paste-alignment-examples -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Language-Specific References

- `../javascript/style_guide.md` - JavaScript naming, formatting, headers
- `../typescript/style_guide.md` - TypeScript naming, types, interfaces, imports
- `../python/style_guide.md` - Python naming, docstrings, imports
- `../shell/style_guide.md` - Shell shebang, quoting, functions
- `../config/style_guide.md` - JSON/JSONC structure, comments

### Related Documents

- `code_organization.md` - Module organization, file structure
- `../../assets/checklists/universal_checklist.md` - Cross-language validation items
<!-- /ANCHOR:related-resources -->
