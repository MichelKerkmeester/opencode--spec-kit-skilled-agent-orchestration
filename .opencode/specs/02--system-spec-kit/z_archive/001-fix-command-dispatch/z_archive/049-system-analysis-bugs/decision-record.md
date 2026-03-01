---
title: "Decision Record: System-Spec-Kit Bug Remediation [049-system-analysis-bugs/decision-record]"
description: "The system has a hardcoded EMBEDDING_DIM = 768 constant in vector-index.js, but the active Voyage AI provider returns 1024-dimension embeddings. This causes 100% of memory index..."
trigger_phrases:
  - "decision"
  - "record"
  - "system"
  - "spec"
  - "kit"
  - "decision record"
  - "049"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: System-Spec-Kit Bug Remediation

## Metadata
- **Created:** 2024-12-31
- **Level:** 3
- **Status:** Active

---

## DR-001: Dynamic Embedding Dimension Strategy

### Context
The system has a hardcoded `EMBEDDING_DIM = 768` constant in `vector-index.js`, but the active Voyage AI provider returns 1024-dimension embeddings. This causes 100% of memory indexing to fail.

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A) Dynamic lookup | Get dimension from embedding profile at runtime | Flexible, supports any provider | Slightly more complex |
| B) Per-provider databases | Separate database file per provider/dimension | Clean separation | Multiple databases to manage |
| C) Re-embed on provider change | Re-index all memories when provider changes | Single database | Expensive, slow |
| D) Hardcode to 1024 | Change constant to match Voyage | Simple | Breaks if provider changes |

### Decision
**Option A: Dynamic lookup** (Option B already implemented)

**Key Finding:** The system already implements Option B - `resolveDatabasePath()` at lines 67-85 uses `profile.getDatabasePath()` for per-provider databases. The bug is that validation at lines 967 and 1083 still uses the hardcoded constant.

We will:
1. Make `EMBEDDING_DIM` a function that reads from profile (leveraging existing infrastructure)
2. Keep per-provider database naming (already working)
3. Optionally add pre-flight dimension check for better error messages

### Rationale
- Most flexible approach
- Minimal code changes
- Preserves existing database separation
- Supports future provider changes without code modification

### Consequences
- Must ensure profile is loaded before dimension check
- Fallback to 768 needed for edge cases
- Documentation must clarify provider-specific databases

---

## DR-002: Template Metadata Format Standardization

### Context
Templates use inconsistent metadata formats: 6 use bulleted lists, 4 use tables. This creates confusion and inconsistent documentation.

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A) Bulleted lists | Standardize on `- **Field:** value` | Majority format, simpler | Less structured |
| B) Tables | Standardize on markdown tables | More structured | Verbose, harder to edit |
| C) YAML frontmatter | Use YAML at top of file | Machine-readable | Requires parser changes |
| D) Keep mixed | Document both as acceptable | No migration work | Inconsistent |

### Decision
**Option A: Bulleted lists**

### Rationale
- 6/10 templates already use this format
- Simpler to write and maintain
- Easier to read in raw markdown
- `context_template.md` exception allowed (uses Mustache for programmatic generation)

### Consequences
- Update 4 templates: `handover.md`, `implementation-summary.md`, `debug-delegation.md`, `context_template.md` (metadata section only)
- Document exception for `context_template.md` in style guide

---

## DR-003: Implementation-Summary Requirement Logic

### Context
AGENTS.md states implementation-summary.md is "REQUIRED for all levels but created after implementation completes." However, `validate-spec.sh` only WARNS for Level 1, doesn't ERROR.

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A) Always require | ERROR if missing for any level | Strict compliance | May block WIP specs |
| B) Require when complete | ERROR only when tasks show completion | Matches intent | More complex detection |
| C) Keep as warning | WARNING only, never ERROR | Non-blocking | Doesn't match AGENTS.md |

### Decision
**Option B: Require when implementation complete**

### Rationale
- Matches AGENTS.md intent: "created after implementation completes"
- Detection via `[x]` or `[X]` in tasks.md is reliable
- Doesn't block work-in-progress spec folders
- Enforces documentation at the right time

### Consequences
- Add completion detection logic to `check-files.sh`
- For Level 1: Check tasks.md for completed items
- For Level 2+: Check checklist.md for completed items
- Document detection logic in validation rules

---

## DR-004: Validation Rule Severity Levels

### Context
New validation rules need appropriate severity levels. Too strict blocks workflow; too lenient allows issues.

### Decision

| Rule | Severity | Rationale |
|------|----------|-----------|
| Folder naming | ERROR | Core convention, must enforce |
| Implementation-summary (when complete) | ERROR | Required per AGENTS.md |
| Frontmatter validation | WARNING | Nice-to-have, not blocking |
| Cross-reference validation | WARNING | Documentation quality |
| Checklist format | WARNING | Style consistency |

### Rationale
- ERROR = Must fix before proceeding
- WARNING = Should fix, but doesn't block
- INFO = Informational only

---

## DR-005: Pre-flight Dimension Check Behavior

### Context
When embedding provider dimension doesn't match database schema, should the system fail immediately or attempt partial indexing?

### Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| A) Fail fast | Check before any indexing, abort if mismatch | Clear error, no wasted work | May seem aggressive |
| B) Warn and continue | Log warning, skip incompatible files | Partial progress | Confusing results |
| C) Auto-migrate | Detect mismatch, offer to re-index | User-friendly | Complex, risky |

### Decision
**Option A: Fail fast**

### Rationale
- Clear, actionable error message
- No wasted processing time
- User knows exactly what to do
- Prevents partial/corrupted state

### Consequences
- `memory_index_scan` checks dimension first
- Returns error with:
  - Current provider dimension
  - Database schema dimension
  - Suggested resolution (re-index or change provider)

---

## Decision Log

| ID | Decision | Date | Status |
|----|----------|------|--------|
| DR-001 | Dynamic embedding dimension | 2024-12-31 | Approved |
| DR-002 | Bulleted list metadata format | 2024-12-31 | Approved |
| DR-003 | Require impl-summary when complete | 2024-12-31 | Approved |
| DR-004 | Validation severity levels | 2024-12-31 | Approved |
| DR-005 | Fail fast on dimension mismatch | 2024-12-31 | Approved |
