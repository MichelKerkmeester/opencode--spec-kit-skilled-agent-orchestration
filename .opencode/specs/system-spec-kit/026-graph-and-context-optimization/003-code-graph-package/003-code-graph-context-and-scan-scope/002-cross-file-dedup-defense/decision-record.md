---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
title: "Decision Record: Cross-File Symbol Dedup Defense"
description: "Decision record for packet 012/003 covering defense in depth over more root-cause investigation and INSERT OR IGNORE over INSERT REPLACE."
trigger_phrases:
  - "cross-file dedup decision"
  - "defense in depth decision"
  - "INSERT OR IGNORE over INSERT REPLACE"
  - "012/003 decision record"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/003-cross-file-dedup-defense"
    last_updated_at: "2026-04-23T00:00:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Recorded implementation decisions"
    next_safe_action: "Implement accepted decisions"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts"
    session_dedup:
      fingerprint: "sha256:012-003-cross-file-dedup-defense-decisions-2026-04-23"
      session_id: "cg-012-003-2026-04-23"
      parent_session_id: "cg-012-002-2026-04-23"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Defense in depth is accepted because standalone parsing did not reproduce live collisions."
      - "INSERT OR IGNORE is accepted because INSERT REPLACE could overwrite the first owner row."
---
# Decision Record: Cross-File Symbol Dedup Defense

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Defense In Depth Instead Of More Root-Cause Investigation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-23 |
| **Deciders** | Codex, user packet scope |

---

<!-- ANCHOR:adr-001-context -->
### Context

Packet 012/002 fixed stale-gate behavior and inner duplicate capture handling, but live full scans still fail many files with `UNIQUE constraint failed: code_nodes.symbol_id`. Standalone parsing of all candidate files produced zero cross-file collisions, so the live discrepancy is not explained by the parser output in isolation.

### Constraints

- Do not modify `generateSymbolId`, `capturesToNodes`, or `attachFilePath`.
- Do not restart the MCP server during this implementation run.
- Do not edit packet 012, 012/001, or 012/002 artifacts.
- Preserve non-conflicting nodes even if one node collides.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Add two runtime-independent duplicate guards now instead of blocking on another root-cause investigation.

**How it works**: `indexFiles()` removes duplicate `symbolId` values across the whole scan result before returning. `replaceNodes()` then ignores any residual DB-level duplicate so one collision cannot abort persistence for a file's other nodes.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defense in depth now** | Blocks the observed crash, keeps scope small, preserves non-conflicting nodes | May drop a small number of colliding nodes before root cause is known | 9/10 |
| Continue root-cause investigation first | Could explain the live-only discrepancy | Leaves reproducible full scans broken and DB state misleading | 5/10 |
| Change symbol identity | Could eliminate many logical collisions | Violates packet constraints and risks graph identity churn | 3/10 |

**Why this one**: The live failure mode is high impact and reproducible, while the proposed guards are narrow, testable, and reversible.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Full scans should no longer fail hundreds of files on `code_nodes.symbol_id` UNIQUE errors.
- Files with one duplicate node can still persist all non-conflicting nodes.
- Operators get a log count when Layer 1 drops duplicates.

**What it costs**:

- Some colliding nodes may be dropped. Mitigation: first owner wins, Layer 1 logs the count, and future parser-identity work can recover lost detail.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Silent node loss hides a symbol generation bug | Medium | Tests cover behavior and logs expose scan-local drops. |
| Edges reference dropped TESTED_BY nodes | Low | Accepted as a soft consistency issue that is preferable to a hard persistence crash. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `structural-indexer.ts`: add `globalSeenIds` scan over `results` after TESTED_BY edge construction.
- `code-graph-db.ts`: change `INSERT INTO code_nodes` to `INSERT OR IGNORE INTO code_nodes`.

**How to roll back**: Remove the `globalSeenIds` sweep and restore `INSERT INTO code_nodes`, then rebuild the MCP server.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Use INSERT OR IGNORE Instead Of INSERT REPLACE

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-23 |
| **Deciders** | Codex, user packet scope |

---

<!-- ANCHOR:adr-002-context -->
### Context

`code_nodes.symbol_id` is globally unique. When `replaceNodes()` receives a node whose `symbol_id` is already present under another `file_id`, the current strict insert raises and rolls back the transaction for that file. The desired failure mode is to skip only the conflicting node and persist the rest.

### Constraints

- The first persisted owner of a `symbol_id` should remain stable.
- A duplicate should not delete or overwrite another file's node row.
- Non-conflicting nodes in the same transaction must still insert.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Use `INSERT OR IGNORE INTO code_nodes`.

**How it works**: SQLite skips only the row that violates the `symbol_id` unique constraint. The transaction continues, so later unique rows in the same `replaceNodes()` call persist normally.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **INSERT OR IGNORE** | Keeps first owner, preserves transaction progress, one-line patch | Can silently skip duplicate nodes | 9/10 |
| INSERT OR REPLACE | Avoids throw and keeps one row | Deletes/replaces the first owner row and can move ownership across files | 4/10 |
| Catch UNIQUE errors around each row | Allows custom logging | More code, still requires careful transaction behavior | 6/10 |

**Why this one**: `INSERT OR IGNORE` matches the desired first-owner-wins semantics and avoids accidental overwrite of a valid existing node.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- Duplicate DB rows no longer abort file-level node replacement.
- Existing owner rows remain untouched.

**What it costs**:

- `replaceNodes()` no longer exposes a UNIQUE failure as an exception. Mitigation: Layer 1 should eliminate scan-local collisions first, making DB-level ignores rare.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Persistent duplicate attempts become hard to notice | Medium | Keep Layer 1 logging and add direct tests that clarify skip semantics. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:

- `replaceNodes()` prepares `INSERT OR IGNORE INTO code_nodes (...) VALUES (...)`.

**How to roll back**: Restore `INSERT INTO code_nodes` and rerun focused DB tests to confirm strict behavior returns.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
