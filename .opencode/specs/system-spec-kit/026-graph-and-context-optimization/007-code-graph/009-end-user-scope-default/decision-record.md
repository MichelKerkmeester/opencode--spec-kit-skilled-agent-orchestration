---
title: "Decision Record: End-User Scope Default for Code Graph Indexing"
description: "ADR-001 accepted after five research iterations: structural code graph scans exclude .opencode/skill by default, with env and per-call maintainer opt-in plus loud full-scan migration."
template_source: "SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2"
trigger_phrases:
  - "009 decision"
  - "end user scope ADR"
  - "code graph skill indexing decision"
  - "speckit code graph index skills"
importance_tier: "high"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default"
    last_updated_at: "2026-05-02T11:41:37Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Plan tasks checklist resource-map authored"
    next_safe_action: "Begin Phase 1 implementation"
    blockers: []
    key_files:
      - "scan.ts"
      - "indexer-types.ts"
      - "index-scope.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-02-13-04-009-end-user-scope-default"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Decision Record: End-User Scope Default for Code Graph Indexing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: End-User Scope Default for Code Graph Indexing

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (post-research) |
| **Date** | 2026-05-02 |
| **Deciders** | `/spec_kit:deep-research:auto` 5-iteration loop |
| **Confidence** | 0.94 |
| **Synthesis source** | `research/research.md` |

---

<!-- ANCHOR:adr-001-context -->
### Context

The structural code graph currently indexes `.opencode/skill` internals by default, which makes end-user graph queries search mostly spec-kit implementation code. The persisted database measurement is decisive: 1,571 of 1,619 tracked files are under `.opencode/skill` (97.0%), 34,274 of 34,850 nodes are under `.opencode/skill` (98.3%), and 15,573 of 16,530 edges touch those nodes (94.2%). These values come from the live `code_files`, `code_nodes`, and `code_edges` tables described in `code-graph-db.ts` and summarized in research §12.

The code already has two scope layers. `getDefaultConfig()` owns default include/exclude globs, while the directory walker calls `shouldIndexForCodeGraph()` before glob excludes. Existing `excludeGlobs` are additive, so callers can remove more files but cannot opt back into a hard guard once `.opencode/skill` is excluded. Existing databases also need a loud migration path: only explicit full scans prune tracked files that still exist on disk but are no longer in the current candidate set.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

Adopt end-user repository code as the default structural code graph scope. Skill internals are excluded unless a maintainer opts in explicitly.

Sub-decisions:

| Sub-decision | Accepted choice | Rationale |
|--------------|-----------------|-----------|
| Default behavior | Exclude `.opencode/skill/**` by default | The live graph is 97.0% skill files and 98.3% skill nodes. |
| Env opt-in | `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` | Durable setup for maintainers who work on spec-kit internals. |
| Per-call field | `includeSkills:true` on `code_graph_scan` | Deterministic one-off scans and tests without editing process env. |
| Default exclude list | `node_modules`, `dist`, `.git`, `vendor`, `external`, `z_future`, `z_archive`, `mcp-coco-index/mcp_server`, `.opencode/skill/**` | Preserves existing generated/vendor exclusions and adds the measured pollution source. |
| Migration model | Store active scope fingerprint in `code_graph_metadata`; require `code_graph_scan({ incremental:false })` when stored and active scope differ | Existing incremental checks cannot detect a scope policy change when old files still exist and are hash-fresh. |

The `mcp-coco-index/mcp_server` exclusion remains even when skill indexing is enabled. CocoIndex indexing stays out of scope for this packet because it uses a separate binary and `.cocoindex_code` index.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

Positive:

- End-user code graph reads no longer search mostly spec-kit internals.
- Default scan size should shrink sharply in this workspace once a full scan prunes old rows.
- Maintainers retain two explicit opt-in paths: env for durable setup and per-call for one-off scans.
- The change is narrow: scan defaults, walker guard, schema, readiness/status, docs, and tests.

Negative:

- Maintainers who relied on old default behavior must opt in.
- Existing databases need an explicit full scan; incremental scans will not delete old skill rows that still exist on disk.
- Read/status surfaces need clear migration messaging or stale graph data can look healthy.

Neutral:

- Advisor and skill graph stay separate because they use dedicated skill metadata scans and `skill-graph.sqlite`.
- CocoIndex may still contain skill internals and needs a follow-up only if semantic search scope must match structural graph scope.
- Source files are not deleted; SQLite graph rows are deleted and can be recreated by a full scan under the desired scope.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Alternative | Result | Rejection reason |
|-------------|--------|------------------|
| Env-only opt-in | Rejected | Good maintainer setup, but tests and one-off scans would need process-level mutation. |
| Schema-only per-call field | Rejected | Good for direct calls, but maintainers need a durable server startup setting. |
| `opencode.json` only | Rejected | Ties library behavior to one runtime config file and makes tests/config reuse brittle. |
| Additive `excludeGlobs` only | Rejected | Additive excludes cannot opt back into a hard walker guard. |
| Retain old default | Rejected | Keeps the graph dominated by skill internals and fails the packet goal. |
| Env plus `includeSkills:true` | Accepted | Covers durable maintainer setup, one-off scans, and strict schema testability. |
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| Check | Result | Evidence |
|-------|--------|----------|
| Necessary? | PASS | Current DB is 1,571/1,619 skill files and 34,274/34,850 skill nodes. |
| Beyond Local Maxima? | PASS | Env-only, schema-only, config-only, additive exclude, and old-default designs were evaluated and rejected. |
| Sufficient? | PASS | The plan updates both scope layers, strict schema, readiness/status, migration docs, and regression tests. |
| Fits Goal? | PASS | End-user-only default directly removes the dominant noise source from default graph reads. |
| Open Horizons? | PASS | Maintainers can opt in now; CocoIndex and broader runtime directory policy remain clean follow-ups. |
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

Implementation follows `plan.md` Phase 1 through Phase 3. Phase 1 updates the shared scope policy, `indexer-types.ts`, `index-scope.ts`, `scan.ts`, `structural-indexer.ts`, `tool-schemas.ts`, and focused tests. Phase 2 adds the scope fingerprint in `code_graph_metadata`, compares it during readiness/status, and reuses the existing blocked full-scan response shape for read paths. Phase 3 updates the code graph README, env reference, startup/status wording, focused Vitest runs, strict spec validation, and performance measurement.

Rollback is a source revert plus an explicit full scan under the desired scope. If maintainers need old graph content after rollback or after default pruning, they can set `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` or pass `includeSkills:true`, then run `code_graph_scan({ incremental:false })`. No archive path is needed because graph rows are derived data and can be rebuilt from source.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Per-Call Scope Argument Precedence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted after remediation |
| **Date** | 2026-05-02 |
| **Deciders** | Remediation for `review/review-report.md` findings `R1-P1-001` and `R3-P1-001` |
| **Related decision** | ADR-001 |

### Context

ADR-001 accepted two opt-in paths for skill indexing: `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` for a durable maintainer setup and `includeSkills:true` for one-off scans. The deep-review report found that the implementation collapsed those inputs with env precedence, so `includeSkills:false` could not request an end-user-only scan from an env-enabled process.

### Decision

When `includeSkills` is provided as a boolean on a `code_graph_scan` call, that per-call value takes precedence over `SPECKIT_CODE_GRAPH_INDEX_SKILLS`. The env var applies only when the per-call argument is missing.

This makes the full contract:

- Missing `includeSkills` plus no env opt-in: end-user-only scan.
- Missing `includeSkills` plus `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true`: skill indexing enabled.
- `includeSkills:true`: skill indexing enabled for that call.
- `includeSkills:false`: end-user-only scan for that call, even when the env var is true.

### Consequences

- Maintainers can keep an env-enabled process and still run a one-off end-user-only scan.
- Tests can cover both true and false per-call overrides without mutating process-wide defaults.
- ADR-001 remains intact; this ADR narrows its precedence rule and turns the review finding into the explicit contract.
<!-- /ANCHOR:adr-002 -->

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
