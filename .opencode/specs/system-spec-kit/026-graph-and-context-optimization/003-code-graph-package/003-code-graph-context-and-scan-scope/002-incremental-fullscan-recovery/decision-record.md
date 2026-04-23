---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
title: "Decision Record: Code Graph Incremental Fullscan Recovery"
description: "Architecture decisions for duplicate-symbol handling and scan response metadata in the code graph full-scan recovery packet."
trigger_phrases:
  - "Option A dedupe"
  - "fullReindexTriggered supplement"
  - "code graph ADR"
  - "012/002 decision record"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery"
    last_updated_at: "2026-04-23T00:00:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Documented ADR-001 Option A dedupe and ADR-002 scan response supplementation."
    next_safe_action: "Implement ADRs exactly in source and tests."
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts"
    session_dedup:
      fingerprint: "sha256:002-incremental-fullscan-recovery-adrs-2026-04-23"
      session_id: "cg-012-002-2026-04-23"
      parent_session_id: "dr-2026-04-23-130100-pt04"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Code Graph Incremental Fullscan Recovery

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Option A Capture Deduplication

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-23 |
| **Deciders** | Deep research packet 007-deep-review-remediation-pt-04; Codex implementation |

---

<!-- ANCHOR:adr-001-context -->
### Context

`code_nodes.symbol_id` is UNIQUE, and current identity is derived from `(filePath, fqName, kind)`. The parser can emit multiple captures with the same identity in indexer-self files, which causes `replaceNodes()` to fail during scan persistence.

### Constraints

- `symbolId` stability matters for graph references.
- The current graph identity cannot represent two distinct nodes that share `(filePath, fqName, kind)`.
- The fix must be small enough for a P0 remediation and preserve existing parser contracts.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option A, dedupe duplicate capture-derived `symbolId` values in `capturesToNodes()` and preserve the first-seen node.

**How it works**: The function initializes a `Set` with the module node ID, computes each capture's `fqName` and `symbolId` once, and returns an empty array for duplicate IDs through `flatMap()`. Distinct kinds or distinct qualified names remain separate nodes.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Option A: Dedupe before persistence** | Minimal patch; stable IDs; stops DB crash across parser backends. | Drops duplicate logical symbols when current identity collides. | 9/10 |
| Option B: Add line suffix on collision | Preserves more nodes. | Makes some IDs edit-position-sensitive and mixes identity semantics. | 5/10 |
| Option C: Fix parser scoping and richer `fqName` | Best semantic endpoint. | Larger surgery across AST traversal, regex fallback parity, edge extraction, and tests. | 6/10 |

**Why this one**: Option A solves the immediate P0 crash while respecting the current identity model. Option C remains the right follow-up if graph completeness for overloaded or anonymous scopes becomes a priority.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Duplicate capture emissions no longer trigger `code_nodes.symbol_id` UNIQUE constraint failures.
- Symbol IDs remain stable across edits that do not change path, name, or kind.

**What it costs**:
- Some distinct logical symbols may collapse when the parser produces identical identity fields. Mitigation: document this as a parser-completeness follow-up.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Legitimate overloads collapse | M | Preserve first-seen behavior and add regression tests for kind distinction. |
| Edges from dropped captures still exist in raw capture processing | L | Existing edge lookup is node-based; future parser pass can refine. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | UNIQUE constraint failures were observed in three files. |
| 2 | **Beyond Local Maxima?** | PASS | Options A, B, and C were compared in the research. |
| 3 | **Sufficient?** | PASS | It prevents duplicate IDs before DB insertion. |
| 4 | **Fits Goal?** | PASS | It directly addresses P0 bug #2. |
| 5 | **Open Horizons?** | PASS | It preserves stable identity and leaves parser scoping open. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `capturesToNodes()` changes from `captures.map()` to `captures.flatMap()`.
- A `seenSymbolIds` set drops duplicate generated IDs.

**How to roll back**: Revert the `capturesToNodes()` block to direct `captures.map()` and rerun vitest/build.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Supplement Scan Response Fields Instead of Renaming

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-23 |
| **Deciders** | Deep research packet 007-deep-review-remediation-pt-04; Codex implementation |

---

### Context

`fullReindexTriggered` only means an incremental scan became a full reindex because Git HEAD changed. When a caller explicitly passes `incremental:false`, that field is correctly false, but the response does not expose the caller intent or effective scan mode.

### Constraints

- Existing consumers may parse `fullReindexTriggered`.
- Operator clarity is needed for manual recovery scans.
- The field addition should be additive and low-risk.

---

### Decision

**We chose**: Keep `fullReindexTriggered` unchanged and add `fullScanRequested` plus `effectiveIncremental`.

**How it works**: `fullScanRequested` is true when `args.incremental === false`. `effectiveIncremental` mirrors the already-computed local variable that decides cleanup and stale-skip behavior.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Supplement fields** | Backward-compatible; directly exposes intent and mode. | Adds two response fields. | 10/10 |
| Rename `fullReindexTriggered` | Clearer single field name possible. | Breaking change for consumers; explicitly forbidden. | 2/10 |
| Leave response unchanged | No API surface change. | Operator confusion remains. | 3/10 |

**Why this one**: The scan handler already computes the needed values, and additive response fields solve the observability issue without breaking consumers.

---

### Consequences

**What improves**:
- Operators can distinguish requested full scans from git-triggered full reindexes.
- Tests can assert scan-mode propagation more directly.

**What it costs**:
- Response shape grows by two additive booleans. Mitigation: document them in README.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Strict response consumers reject unknown fields | L | Existing MCP JSON consumers should ignore additive fields; README documents contract. |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The prior response misled operator interpretation. |
| 2 | **Beyond Local Maxima?** | PASS | Rename and no-change alternatives were considered. |
| 3 | **Sufficient?** | PASS | Two booleans expose both caller intent and effective mode. |
| 4 | **Fits Goal?** | PASS | It directly addresses P2 observability bug #3. |
| 5 | **Open Horizons?** | PASS | It keeps compatibility for future consumers. |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `ScanResult` gains `fullScanRequested` and `effectiveIncremental`.
- `scanResult` population sets `fullScanRequested: args.incremental === false` and `effectiveIncremental`.

**How to roll back**: Remove the two fields from `ScanResult`, response population, tests, and README.
