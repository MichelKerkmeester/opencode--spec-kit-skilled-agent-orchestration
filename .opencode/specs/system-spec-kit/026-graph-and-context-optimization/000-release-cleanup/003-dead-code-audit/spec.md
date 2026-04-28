---
title: "Feature Specification: Dead-Code & Disconnected-Code Audit — system-spec-kit + mcp_server"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Inventory dead code (unused exports, files, functions, types) and disconnected code (files that exist but aren't wired into any active dispatch path) across .opencode/skill/system-spec-kit/ and its mcp_server/ tree. Produce a classified report with evidence + remediation recommendations. Audit-only; deletions are downstream remediation work."
trigger_phrases:
  - "003-dead-code-audit"
  - "dead code audit system-spec-kit"
  - "disconnected code mcp_server"
  - "release cleanup dead code"
  - "ts-prune system-spec-kit"
importance_tier: "important"
contextType: "audit"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-dead-code-audit"
    last_updated_at: "2026-04-28T08:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet"
    next_safe_action: "T001 enumerate audit tools + entry points"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: null
      session_id: "003-dead-code-audit-scaffold-2026-04-28"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Dead-Code & Disconnected-Code Audit — system-spec-kit + mcp_server

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft (scaffold; audit execution pending) |
| **Created** | 2026-04-28 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `000-release-cleanup` |
| **Predecessor** | `../002-sk-code-opencode-alignment/` |
| **Successor** | None (current tail) |
| **Handoff Criteria** | `dead-code-audit-report.md` lists every dead-code candidate with file:line evidence + classification (dead / disconnected / dynamic-only-reference / false-positive) + recommended action (delete / wire-in / keep-with-rationale). Zero false-deletes (evidence required for every recommendation). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Across `.opencode/skill/system-spec-kit/` (~1.5MB of TypeScript / Python / shell / docs) and especially the dense `mcp_server/` tree, code has accumulated through 25+ packets without a structured pruning pass. Two categories likely exist:

1. **Dead code**: exported functions, types, classes, or whole files that no caller imports. Common after refactors that replaced internal helpers with newer ones but didn't delete the originals.
2. **Disconnected code**: files that compile and look wired-in (have proper exports, imports, types) but aren't actually reachable from any active dispatch path. Common when a handler/tool/hook was authored speculatively, scaffolded under a feature flag that was never enabled, or replaced by a parallel implementation.

Without an audit, the codebase carries silent debt: noise during deep-research/deep-review (agents read dead files), maintenance overhead (refactors touch unused code), and risk that a future packet adds *new* references to dead code thinking it's load-bearing.

### Purpose

Produce a single canonical `dead-code-audit-report.md` that:
- Enumerates every dead and disconnected code candidate in `.opencode/skill/system-spec-kit/`
- Classifies each by category (dead / disconnected / dynamic-only-reference / false-positive)
- Cites file:line evidence (zero fabrication)
- Recommends action per item (delete / wire-in / keep-with-rationale)
- Ranks findings by safety-of-deletion (high-confidence-delete vs needs-investigation)

This packet ships the audit + report only. Actual deletions are downstream remediation work, gated on the operator approving the report.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Audit target**: `.opencode/skill/system-spec-kit/` recursively, with special focus on `mcp_server/` (the densest subtree).
- **Languages**: TypeScript (primary; ~most of mcp_server), JavaScript (build outputs in `scripts/dist/`), Python (rare but present), shell scripts.
- **Detection categories**:
  1. **Unused exports**: exports no internal or external file imports (use `ts-prune` or equivalent + manual cross-checks for dynamic imports).
  2. **Orphaned files**: `.ts`/`.js`/`.py`/`.sh` files that nothing imports/sources/spawns.
  3. **Disconnected handlers/tools/hooks**: registered shapes (e.g., `handlers/foo.ts`) that aren't actually wired into the dispatcher (`tools/index.ts`, `context-server.ts`, hook registries).
  4. **Dead types/interfaces**: declared types nothing references.
  5. **Stale `dist/`** artifacts: built files in `scripts/dist/` whose source `.ts` no longer exists.
  6. **Stale tests**: vitest files testing deleted/renamed modules.
- **Reachability anchors** (define the "alive" graph): MCP entrypoints (`mcp_server/context-server.ts`, registered tools), CLI scripts under `scripts/`, hook registrations under `hooks/`, exports consumed by `.opencode/agent/*.md` or `.opencode/command/spec_kit/*.md` (read via grep), exports re-exported by `mcp_server/api/`, exports referenced by tests.
- **Tools**: `ts-prune` (or `knip` or `unimported`), `tsc --noEmit` for compile validation, `grep`/`rg` for cross-references, ad-hoc reachability scripts.
- **Output**: `dead-code-audit-report.md` at packet root, plus optional `audit-state.jsonl` for reproducibility.

### Out of Scope

- **Actual deletions**. This packet ships findings only. Downstream packet (e.g., `004-dead-code-pruning`) handles deletes after operator review.
- **Audit of non-system-spec-kit trees** (e.g., `.opencode/skill/cli-*/`, `.opencode/skill/sk-*/`, `.opencode/skill/mcp-coco-index/cocoindex_code/`). Scope is `.opencode/skill/system-spec-kit/` only.
- **Refactor recommendations** beyond "delete this" or "wire this in". Architectural changes are separate packets.
- **Coverage analysis** for tested-but-not-asserted code paths. Different tool space.
- **Performance dead code** (slow paths nothing should call). Different concern.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements

| ID | Priority | Requirement |
|----|----------|-------------|
| **REQ-001** | P0 | Audit MUST cover every `.ts`, `.js`, `.py`, `.sh` file under `.opencode/skill/system-spec-kit/` (recursively). |
| **REQ-002** | P0 | Every finding MUST cite verifiable file:line evidence. Zero fabrication. |
| **REQ-003** | P0 | Every finding MUST be classified into one of 4 categories: `dead` / `disconnected` / `dynamic-only-reference` / `false-positive`. |
| **REQ-004** | P0 | Reachability anchors (MCP entrypoints, CLI scripts, hooks, agent/command markdown references, API barrels, test imports) MUST be enumerated explicitly so the "alive" graph is reproducible. |
| **REQ-005** | P1 | Each `dead` or `disconnected` finding MUST include a recommended action: `delete`, `wire-in`, or `keep-with-rationale` (with the rationale text). |
| **REQ-006** | P1 | Findings MUST be ranked by safety-of-deletion: `high-confidence-delete` (no references anywhere, no dynamic-load patterns), `needs-investigation` (potential dynamic load via `require(...)` / `import(...)` / `spawn(...)` / shell sourcing), `keep` (false positive). |
| **REQ-007** | P1 | Audit MUST handle dynamic-load patterns explicitly: `require(string-built-at-runtime)`, `import(...)` with template strings, `child_process.spawn` reading scripts by path, hook registries that load by glob. Findings touching these patterns auto-classified `needs-investigation`. |
| **REQ-008** | P1 | Output MUST be a single canonical `dead-code-audit-report.md` at packet root with structured sections per category. |
| **REQ-009** | P2 | Report SHOULD include a per-directory summary table (e.g., `mcp_server/handlers/`: 23 files, 2 dead, 1 disconnected, 0 false-positive). |
| **REQ-010** | P2 | Report SHOULD include a tooling-and-replication appendix so a future audit can reproduce findings. |

### Acceptance Scenarios

**Given** the operator reviews `dead-code-audit-report.md`, **when** they inspect any finding, **then** the finding provides a scoped `.opencode/skill/system-spec-kit/` file:line citation, evidence, recommended action, and safety ranking.

**Given** a future pruning packet scopes deletions from this audit, **when** it selects high-confidence delete candidates, **then** it can reproduce the alive graph and candidate sets from `audit-state.jsonl` plus the tooling appendix before touching code.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion |
|----|-----------|
| **SC-001** | `dead-code-audit-report.md` exists at packet root, non-empty, with the 4-category structured sections. |
| **SC-002** | Every finding cites a verifiable file:line; sample-verify ≥10 random findings exist on disk at the cited line. |
| **SC-003** | The 4 categories are populated (`dead`, `disconnected`, `dynamic-only-reference`, `false-positive`); empty categories are explicitly noted ("none found"). |
| **SC-004** | The reachability-anchor enumeration covers ALL of: MCP tools registry, CLI scripts under `scripts/`, hooks under `hooks/`, agent/command markdown references, `api/` barrels, test imports. |
| **SC-005** | Per-finding `recommended action` is present and matches the category (e.g., `dead` → `delete`; `disconnected` → `wire-in` OR `delete` based on intent). |
| **SC-006** | Per-finding `safety-of-deletion` ranking is present (`high-confidence-delete` / `needs-investigation` / `keep`). |
| **SC-007** | Per-directory summary table covers at minimum: `mcp_server/handlers/`, `mcp_server/lib/`, `mcp_server/code_graph/`, `mcp_server/hooks/`, `mcp_server/tools/`, `scripts/`, plus skill-root TS files. |
| **SC-008** | Report's tooling appendix lists exact commands run + tool versions so the audit is reproducible. |
| **SC-009** | Zero false-deletes: every recommendation must be justified by evidence the operator can verify in <5 minutes. |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dynamic imports / runtime-resolved paths classified as dead | False-positive recommendation; deletion would break runtime | REQ-007: dynamic-load patterns auto-classified `needs-investigation`; never `high-confidence-delete` |
| Tool (ts-prune / knip) miscategorizes re-exports as unused | Findings noisy | Cross-check with `grep` on `from "..."` and `require("...")` patterns; manual review of top-of-file barrel exports |
| Markdown-driven discoverability missed (agents/commands reference TS by name) | A "dead" file might actually be invoked by name-string from a `.opencode/agent/*.md` slash-command pattern | REQ-004 explicitly enumerates agent/command markdown as reachability anchors; grep for symbol names across `.opencode/agent/`, `.opencode/command/`, `.claude/`, `.gemini/`, `.codex/` |
| Hook registries that load by directory glob | Files in `hooks/` may be loaded by directory enumeration not by static import | Walk hook-loader code to confirm the discovery pattern; auto-classify hook files as `needs-investigation` if loader uses glob/readdir |
| Scope creep into `cli-*` / `sk-*` / `mcp-coco-index/` | Audit blows past target | Hard scope guard: every finding's path MUST start with `.opencode/skill/system-spec-kit/` |
| Stale `dist/` files reference deleted `.ts` source | Confusing findings | Treat `dist/` as a derived artifact category; check stale-dist separately and recommend rebuild |

### Dependencies

- `ts-prune` (or `knip`) installed (or run via `npx`)
- `tsc` (TypeScript compiler) for `tsc --noEmit` reachability sanity checks
- `rg` (ripgrep) for fast cross-reference grep
- Read access to the entire `.opencode/skill/system-spec-kit/` tree (already trivially available)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

| ID | Question | Resolution |
|----|----------|-----------|
| **Q-001** | Should the audit also scan `.gemini/skills/system-spec-kit/`, `.claude/skills/system-spec-kit/`, `.codex/skills/system-spec-kit/`? | Resolved at scaffold: NO. Those mirror via hardlinks (per earlier audits); a finding in `.opencode/skill/system-spec-kit/` automatically applies to all 4 runtimes when corrected. |
| **Q-002** | Should the audit include `mcp_server/database/` SQL schema files and migration scripts? | Resolved at scaffold: YES if they're reachable code (`.sql` files invoked by `.ts`); NO if they're docs-only or fixtures. Auditor judgment per file. |
| **Q-003** | What about `mcp_server/tests/fixtures/` directories? | Resolved at scaffold: SKIP. Test fixtures are intentional. Only flag fixtures whose owning test was deleted. |
| **Q-004** | Should the audit also flag files where ALL exports are dead (i.e., the file has live imports but no live exports)? | Resolved at scaffold: YES. That's a strong "delete this whole file" signal. |
<!-- /ANCHOR:questions -->
