---
title: "F [system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/spec]"
description: "Three-part fix from the code-graph scale investigation: (A) surface code-graph highlights in OpenCode session context (currently only minimal-mode payload reaches plugin path); (B) tighten scan scope to exclude z_future/z_archive/coco-index and respect .gitignore (currently 26K files indexed where only ~1-3K are active code); (C) document the difference between OpenCode plugin's minimal payload and MCP startup-brief's full payload."
trigger_phrases:
  - "code graph context surface"
  - "code graph scan scope"
  - "highlights in opencode session"
  - "session-snapshot stale highlights"
  - "scan scope gitignore"
  - "compact code graph minimal"
  - "026/003/003"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope"
    last_updated_at: "2026-04-23T11:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec drafted from code-graph investigation"
    next_safe_action: "Dispatch implementation"
    blockers: []
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Highlights gated on status='ready' at session-snapshot.js:159; SQL works for stale graphs too"
      - "Scanner uses process.cwd() with minimal excludes (node_modules/dist/.git/vendor); no .gitignore"
      - "Plugin hardcodes RESUME_MODE='minimal' which strips highlights from OpenCode payload"
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: Code Graph Context + Scan Scope Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

Code-graph scale investigation surfaced three concerns. This packet addresses all three in a single focused pass.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (user-visible: highlights missing from OpenCode context; perf: 26K files indexed) |
| **Status** | Draft |
| **Created** | 2026-04-23 |
| **Parent** | `026-graph-and-context-optimization/003-code-graph-package/` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../002-code-graph-self-contained-package/spec.md` |
| **Related** | `../../009-hook-daemon-parity/008-skill-advisor-plugin-hardening/`, `../../009-hook-daemon-parity/009-skill-advisor-standards-alignment/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Investigation 2026-04-23 (read-only Codex pass) surfaced three findings:

1. **Highlights missing from OpenCode session context.** The compact-code-graph plugin hardcodes `RESUME_MODE = 'minimal'` (`spec-kit-compact-code-graph.js:40`), which strips per-function highlights from the payload. Even when the plugin requests them, `session-snapshot.js:159` only computes highlights when status === 'ready'; the user's session showed status='stale' so highlights would be skipped regardless. The SQL at `code-graph-db.js:349` doesn't actually require fresh data — it works fine for stale graphs.

2. **Scan scope expansion = 26K files indexed.** `code_graph_scan` defaults `rootDir` to `process.cwd()` and only excludes `node_modules`, `dist`, `.git`, `vendor` (`indexer-types.js:44`). The scanner uses raw `readdirSync` with no `.gitignore` awareness (`structural-indexer.js:901`). Result: 26.5K files indexed, dominated by `.opencode/skill/mcp-coco-index/mcp_server` and archived future research under `.opencode/specs/**/z_future`.

3. **Surface ambiguity not documented.** Two distinct context-injection surfaces exist (OpenCode plugin path = minimal payload; MCP `session_bootstrap` / `startup-brief.js` = full payload with highlights). No doc explains the matrix.

### Purpose

Three scoped fixes in one packet:

- **A** — Compute structural highlights for `'stale'` graphs too (single-line condition change in session-snapshot logic).
- **B** — Tighten default scan excludes to skip `.opencode/specs/**/z_future`, `.opencode/specs/**/z_archive`, `.opencode/skill/mcp-coco-index/mcp_server`. Optionally: respect `.gitignore` via the `ignore` package.
- **C** — Document the surface matrix in cli-codex or system-spec-kit references.

### Non-goals

- Changing the OpenCode plugin's `RESUME_MODE = 'minimal'` (out of scope — minimal mode is intentional for token economy; the fix is to enrich what minimal payload includes).
- Rebuilding the code-graph from scratch (existing graph is fine; new scans will use new excludes).
- Touching the bridge subprocess pattern.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` (and its compiled `dist/lib/session/session-snapshot.js`) — change the highlights-computation gate from `status === 'ready'` to `status === 'ready' || status === 'stale'`. Add a `(stale)` suffix to highlight summary line so the consumer knows the freshness state.
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts` (and its compiled .js) — extend default excludes to include the new paths: `**/z_future/**`, `**/z_archive/**`, `**/mcp-coco-index/mcp_server/**`. (Note: the relative-path matching style of the existing excludes determines exact pattern format.)
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` (and its compiled .js) — add `.gitignore` awareness using the `ignore` package (already a transitive dep, or add it). When `.gitignore` exists in a scanned dir, respect it.
- New doc reference at the cli-codex code-graph surfaces reference (location TBD by Codex) OR `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md` — short matrix:
  | Surface | Includes summary | Includes highlights | Used by |
  |---|---|---|---|
  | MCP `session_bootstrap` / startup-brief | Yes | Yes | MCP clients calling explicitly |
  | OpenCode plugin `--minimal` resume | Yes | Yes (after this packet) | OpenCode TUI session compaction |
- Existing tests for session-snapshot, indexer-types, and structural-indexer — extend to cover the new behavior. New test cases:
  - Stale-graph highlights computation
  - Scan respects `.gitignore`
  - Scan excludes z_future / z_archive / mcp-coco-index/mcp_server

### Out of Scope

- The OpenCode plugin `RESUME_MODE` (stays `'minimal'`).
- The bridge subprocess.
- Re-indexing the existing graph (operator can re-scan when convenient; new scans use new excludes).
- Performance benchmarks for the new scan (separate concern).

### Files Expected to Change

| Path | Change Type | Description |
|------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` | Modify | Allow highlights for stale graphs |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts` | Modify | Add 3 new default excludes |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` | Modify | Honor `.gitignore` during scan walk |
| `.opencode/skill/system-spec-kit/mcp_server/tests/session-snapshot.vitest.ts` | Modify | Add stale-highlights test |
| `.opencode/skill/system-spec-kit/mcp_server/tests/structural-indexer.vitest.ts` | Modify | Add gitignore + new-excludes tests |
| Code-graph surface doc (location TBD by Codex) | Create | Surface matrix |
| Parent handover (sibling-level the parent handover (sibling-level)) | Modify | Record phase outcome |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Highlights computed for stale graphs | After fix: stale-graph snapshot includes `highlights` array; new vitest case asserts non-empty highlights when graph is stale + populated |
| REQ-002 | Default scan excludes expanded | After fix: `indexer-types.ts` default excludes include z_future, z_archive, mcp-coco-index/mcp_server (or equivalent path patterns); new vitest asserts these paths are NOT walked |
| REQ-003 | `.gitignore` awareness during scan | After fix: a scan in a directory with a `.gitignore` containing `*.tmp` does NOT index `*.tmp` files; new vitest asserts |
| REQ-004 | No regression in existing tests | All current vitest tests still pass; full focused suite for session-snapshot + structural-indexer green |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Surface doc exists | A markdown file documents the OpenCode-plugin-minimal vs MCP-startup-brief-full payload matrix |
| REQ-006 | Stale highlights labeled | The summary string for stale-graph highlights includes `(stale)` or equivalent freshness marker so consumers know the data may be outdated |
| REQ-007 | Strict spec validation | `validate.sh --strict` returns 0/0 on this packet |
| REQ-008 | `npm run build` clean | Compiled .js files reflect .ts changes |

### P2 — Recommended

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Indexer logs scan-scope summary | After scan, log a one-liner like `[indexer] scanned N files (excluded: gitignored=X, default=Y)` to help operators audit |
| REQ-010 | Re-scan smoke documented | Document the command to re-scan and shrink an existing oversized graph |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After fix, a stale graph still produces a snapshot with `highlights` array (non-empty when graph contains nodes); SQL at `code-graph-db.js:349` is verified called regardless of freshness.
- **SC-002**: After fix, a scan rooted at the Public repo with default excludes produces a substantially smaller graph than the current 26K-file count (target: <5K, but exact number depends on `.gitignore` contents).
- **SC-003**: A `.gitignore` containing a unique pattern is respected — scanned files in that dir do NOT include the pattern's matches.
- **SC-004**: All existing vitest tests pass; new tests cover the new behavior.
- **SC-005**: Strict spec validation passes 0/0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Stale-highlights computation surfaces wrong data after large code changes | Mark with `(stale)` suffix per REQ-006; consumer knows the data may not reflect the current source |
| Risk | New excludes break someone who actually wants to index z_future research | Excludes are *defaults*; `code_graph_scan` should still allow explicit `excludePaths` override (verify the scan handler accepts this) |
| Risk | `.gitignore` awareness adds a new dependency (`ignore` package) | Check if already in deps; if not, it's a small well-maintained package — acceptable for this gain |
| Risk | Compiled `dist/*.js` must stay in sync with `.ts` source | Run `npm run build` as part of T-08 verification |
| Dependency | Existing tests for session-snapshot, indexer-types, structural-indexer | Confirmed exist; this packet extends them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — Codex investigation already cited file:line for all three findings, and the fix shapes are mechanical.

### Acceptance Scenarios

- **Given** a stale code graph with populated nodes, **When** `getSessionSnapshot()` runs, **Then** `highlights` array is non-empty and the summary line includes a freshness marker.
- **Given** a fresh `code_graph_scan` rooted at the Public repo, **When** scan completes, **Then** indexed file count is substantially smaller than 26K (target <5K).
- **Given** a directory with `.gitignore` containing `*.bak`, **When** a scan runs, **Then** no `*.bak` files appear in the indexed graph.
- **Given** the OpenCode plugin's minimal payload, **When** the plugin emits the snapshot, **Then** the model sees both summary AND highlights (after the session-snapshot fix flows through the plugin's payload).
- **Given** the new surface doc, **When** a future developer reads it, **Then** the matrix clarifies which surface includes highlights.
<!-- /ANCHOR:questions -->

---

**Related documents**:

- Investigation source: in-conversation Codex investigation 2026-04-23T11:50Z (read-only sandbox)
- Plugin path: `.opencode/plugins/spec-kit-compact-code-graph.js:40` (RESUME_MODE), `:204-205` (--minimal flag)
- Bridge: `.opencode/plugin-helpers/spec-kit-compact-code-graph-bridge.mjs:80` (forwards minimal:true)
- Handler: `.opencode/skill/system-spec-kit/mcp_server/dist/handlers/session-resume.js:386` (minimal early-return)
- Snapshot: `.opencode/skill/system-spec-kit/mcp_server/dist/lib/session/session-snapshot.js:159` (status==='ready' gate)
- Highlights SQL: `.opencode/skill/system-spec-kit/mcp_server/dist/code-graph/lib/code-graph-db.js:349`
- Indexer excludes: `.opencode/skill/system-spec-kit/mcp_server/dist/code-graph/lib/indexer-types.js:44`
- Indexer walk: `.opencode/skill/system-spec-kit/mcp_server/dist/code-graph/lib/structural-indexer.js:901`
