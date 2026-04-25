---
title: "Feature Specification: Code Graph Resilience Research [system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/spec]"
description: "Research packet investigating how to make the code graph index less sensitive to errors and staleness. Outputs a verification battery, recovery playbook, and exclude-rule confidence model that gates Phase B of the /doctor:code-graph command (006 sibling)."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
trigger_phrases:
  - "code graph resilience research"
  - "code graph staleness research"
  - "code graph error resilience"
  - "007-code-graph-resilience-research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research"
    last_updated_at: "2026-04-25T20:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created spec.md"
    next_safe_action: "Run /spec_kit:deep-research:auto"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0260000000007007000000000000000000000000000000000000000000000000"
      session_id: "007-code-graph-resilience-research"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Code Graph Resilience Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Research Queued |
| **Created** | 2026-04-25 |
| **Type** | Research packet (deep-research loop target) |
| **Parent** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/` |
| **Parent Spec** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/spec.md` |
| **Related** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/` (gates Phase B of that packet) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The code graph index has three observable failure modes today:
1. **Staleness**: files modified after the last `code_graph_scan` are not re-indexed until the next manual scan; consumers query stale state without warning
2. **Bloat**: `node_modules/`, generated `dist/` folders, vendored deps end up indexed by default; they pollute query results and slow scans
3. **Silent regressions**: scope changes (exclude rules, language filters) can drop canonical symbols without test coverage detecting it

Without research:
- We have no quantitative model for "how stale is too stale" — the threshold to warn vs require re-scan is intuition only
- We have no verification battery (gold-set queries) to detect closure regressions when exclude rules change
- We have no recovery playbook for corrupted SQLite indexes
- We have no confidence model for proposing exclude rules — `node_modules/` is an obvious candidate, but `.opencode/skill/system-spec-kit/mcp_server/dist/` is sometimes useful and sometimes noise

The `/doctor:code-graph` command (sibling packet 006) cannot ship Phase B (apply mode) until these gaps are closed. Phase A (diagnostic-only) ships independently; Phase B is gated on this research packet.

### Purpose

Run a deep-research loop to investigate code-graph resilience, producing four concrete outputs:
1. **Staleness model**: thresholds + signals for warn / require-rescan / soft-stale
2. **Verification battery**: a gold-set of queries that must resolve identically pre/post scope change
3. **Recovery playbook**: ordered steps for SQLite corruption, partial scan failure, and rollback after a bad apply
4. **Exclude-rule confidence model**: per-pattern confidence scoring (node_modules=high, dist=medium, custom-named=low) with rationale

These outputs feed back into the 006 doctor command as Phase B's verification surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Investigate code_graph_scan, code_graph_query, detect_changes implementations under `.opencode/skill/system-spec-kit/mcp_server/`
- Investigate the SQLite schema and on-disk storage layout
- Survey existing scan logs (under recent specs/.../research/iteration-*.log) for patterns of failure
- Catalog all current scanner config / exclude-rule surfaces (where do rules live, how are they read)
- Define the verification battery as a deterministic JSON file (code-graph-gold-queries.json (output)) listing query → expected-result-shape pairs
- Define the staleness model (signals, thresholds, action mapping) as a markdown decision document
- Define the recovery playbook (ordered procedures) as a markdown runbook
- Define the exclude-rule confidence model (per-pattern with rationale) as a JSON config + rationale doc

### Out of Scope

- Implementing the `/doctor:code-graph` Phase B apply mode (that's the 006 packet's job once research is done)
- Re-implementing `code_graph_scan` itself
- Changing the SQLite schema or storage layout
- Cross-language resolver improvements (separate concern)
- Multi-repo / monorepo-aware scanning

### Files to Change (Outputs)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| <packet>/research.md (output) | Create (via deep-research loop) | Aggregated research findings across iterations |
| <packet>/decision-record.md (output) | Create (via research synthesis) | Decisions on staleness threshold, exclude-rule confidence boundaries |
| <packet>/assets/code-graph-gold-queries.json (output) | Create | Verification battery (query → expected shape) |
| <packet>/assets/staleness-model.md (output) | Create | Signals, thresholds, action mapping |
| <packet>/assets/recovery-playbook.md (output) | Create | Ordered procedures for corruption / partial-scan / bad-apply rollback |
| <packet>/assets/exclude-rule-confidence.json (output) | Create | Per-pattern confidence + rationale |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Verification battery exists and is deterministic | code-graph-gold-queries.json (output) defines >= 20 queries; each query has expected_count + expected_top_K_symbols; running `code_graph_query` against a known-good index reproduces the expected shape exactly |
| REQ-002 | Staleness model defines at least three thresholds | staleness-model.md (output) defines `fresh` (<= N1 hours since last scan), `soft-stale` (N1..N2), and `hard-stale` (> N2); each threshold has a recommended action |
| REQ-003 | Recovery playbook covers 3 failure modes | recovery-playbook.md (output) covers (a) SQLite corruption, (b) partial scan failure mid-run, (c) bad apply rollback |
| REQ-004 | Exclude-rule confidence model has tiers | exclude-rule-confidence.json (output) defines high/medium/low tiers with at least 5 patterns per tier and per-pattern rationale |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Research findings cite file:line evidence from current code_graph_scan implementation | research.md (output) includes >= 10 evidence citations under `.opencode/skill/system-spec-kit/mcp_server/lib/...` |
| REQ-006 | Decision record explains threshold choices | decision-record.md (output) explains why N1 / N2 staleness thresholds were chosen (with citations) |
| REQ-007 | Verification battery includes regression-detection queries | At least 5 queries are designed to fail when canonical symbols are dropped by an over-aggressive exclude rule |
| REQ-008 | Research output references concrete operational scenarios | At least 3 scenarios include real evidence from existing `*-pt-NN/iteration-*.log` files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 006 doctor packet's Phase B can be unblocked using only the four research outputs (verification battery, staleness model, recovery playbook, exclude confidence)
- **SC-002**: An operator running `/doctor:code-graph:auto` (Phase A) can read the staleness-model output and decide warn vs require-rescan in under 1 minute
- **SC-003**: The verification battery catches a regression in 100% of test cases where a canonical symbol is dropped by an exclude rule (synthetic test)
- **SC-004**: The exclude-rule confidence model assigns `node_modules/`, `__pycache__/`, `.git/` to the high tier and at least one repo-specific pattern to the low tier with rationale
- **SC-005**: Research loop converges in <= 7 iterations with newFindingsRatio < 0.10
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Verification battery is too narrow (passes synthetic tests but misses real regressions) | High | Iteration plan includes "real-world stress" iteration that tests against modified-in-place repo state |
| Risk | Staleness thresholds are repo-size-dependent (works for this repo, breaks elsewhere) | Medium | Express thresholds in terms of changed-file count + percent-of-total, not absolute time |
| Risk | Recovery playbook gets out of date as code_graph_scan internals change | Medium | Tie playbook citations to specific file:line refs; flag for re-research in changelog |
| Dependency | Existing code_graph_scan / code_graph_query implementations | Green | Internal; well-bounded read |
| Dependency | Existing iteration logs from past deep-research runs (for failure-pattern survey) | Green | Read-only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

These questions drive the deep-research iterations. Each iteration of `/spec_kit:deep-research:auto` should claim one or more questions.

1. **Staleness signals**: Beyond mtime, what other signals indicate index staleness? (file content hash? schema version? last-scan-of-this-file timestamp per row?)
2. **Threshold derivation**: How do existing tools (Sourcegraph, ctags, etc.) define "stale"? Is there a defensible threshold here?
3. **Failure modes in scan logs**: Across the existing `research/.../iteration-*.log` corpus, what classes of scan failure recur? (parser errors, encoding, symlinks, large files, permission, ENOENT mid-scan)
4. **SQLite corruption recovery**: What does `sqlite3 .recover` produce on a damaged code-graph DB? What's the cleanest pre/post sequence?
5. **Verification battery seeds**: What are the canonical queries for this codebase that, if they fail, indicate a regression? (Suggested seeds: well-known function names, exported types, MCP tool registrations, test fixtures)
6. **Exclude-rule false-positive rate**: For each high-tier pattern (`node_modules/`, etc.), are there real repos where this pattern shouldn't be excluded? What's the tail-risk?
7. **Edge weight drift**: Do current edge weights (call, import, ref, define) need re-tuning over time as the codebase evolves? How would we detect drift?
8. **Symbol resolution failure modes**: Where do current resolvers fail (cross-module imports, dynamic imports, decorator-mutated names, type-only imports)?
9. **Confidence-floor signaling**: Under what observable conditions should the doctor command tell the user "your graph is unreliable, do a full re-scan"?
10. **Self-healing thresholds**: Could the graph auto-trigger a partial re-scan when staleness exceeds a threshold, without operator intervention? What are the safety boundaries?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Verification battery executes in under 30 seconds against a fresh index for repos with <10k files
- **NFR-P02**: Recovery playbook procedures complete within 5 minutes for repos with <10k files

### Security
- **NFR-S01**: No mutations to source files during research iterations (read-only audit)
- **NFR-S02**: Verification battery JSON contains no hardcoded credentials or absolute paths

### Reliability
- **NFR-R01**: Research outputs (4 files in `assets/`) are deterministic — re-running the deep-research loop on the same evidence produces materially equivalent recommendations
- **NFR-R02**: Recovery playbook procedures are idempotent (running step N twice is safe)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Acceptance Scenarios

**Scenario 1 — Staleness model produces actionable threshold**

**Given** the deep-research loop converges, **When** an operator reads staleness-model.md (output), **Then** they can map their repo's "hours since last scan" + "percent of files changed" to one of `fresh`/`soft-stale`/`hard-stale` with a recommended action in under 1 minute.

**Scenario 2 — Verification battery catches a regression**

**Given** the verification battery JSON exists, **When** a synthetic test drops a canonical symbol via an over-aggressive exclude rule, **Then** at least one battery query reports a mismatch between expected and actual shape.

**Scenario 3 — Recovery playbook handles SQLite corruption**

**Given** a synthetically corrupted code-graph SQLite file, **When** an operator follows recovery-playbook.md (output) step-by-step, **Then** the index is restored to a queryable state without losing canonical symbols (within the recoverable window of `sqlite3 .recover`).

**Scenario 4 — Exclude-rule confidence model rejects edge cases**

**Given** the exclude-rule confidence model, **When** the doctor command proposes excluding a low-tier custom pattern (e.g., `vendor-internal/`), **Then** the proposal includes the rationale + confidence tier so the operator can accept or reject with context.

**Scenario 5 — Research feeds Phase B**

**Given** the four research outputs are committed, **When** the 006 doctor packet implements Phase B, **Then** Phase 4 Verify can directly load code-graph-gold-queries.json (output) as its verification battery without further research.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 4 research outputs (battery, model, playbook, confidence) + research.md + decision-record.md |
| Risk | 6/25 | Read-only research; main risk is recommendations not surviving real-world test |
| Research | 18/20 | Iterative deep-research loop is the entire delivery mechanism |
| **Total** | **36/70** | **Level 2** (research-heavy but bounded) |
<!-- /ANCHOR:complexity -->
