---
title: "Tasks: Dead-Code & Disconnected-Code Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "T001-T504 task ledger covering setup, alive-graph build, candidate detection, classification, report writing, and verification."
trigger_phrases:
  - "003-dead-code-audit tasks"
  - "dead-code audit task ledger"
importance_tier: "important"
contextType: "tasks-ledger"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-dead-code-audit"
    last_updated_at: "2026-04-28T08:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md"
    next_safe_action: "T001 verify tooling"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Dead-Code & Disconnected-Code Audit

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending
- `[x]` complete
- `[~]` in progress
- `[!]` blocked
- Each task has `Tnnn` ID, action, optional file refs, acceptance criterion.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] **T001** Verify audit tooling: `npx ts-prune --version` (or `npx knip --version`), `tsc --version`, `rg --version`. Document versions in tooling appendix scratch notes.
  - **Acceptance**: All three tools respond; versions captured.

- [ ] **T002** Confirm hard scope: every read/write operation by this audit MUST stay within `.opencode/skill/system-spec-kit/` for reads and within the packet folder for writes.
  - **Acceptance**: Scope assertion documented in `implementation-summary.md` Decisions section.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Build alive graph (REQ-004)

- [ ] **T101** Enumerate MCP tool registrations.
  - **File**: `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts` + `mcp_server/context-server.ts` (CallToolRequestSchema handler).
  - **Acceptance**: List of (tool_name, handler_path) pairs in `audit-state.jsonl`.

- [ ] **T102** Enumerate CLI scripts.
  - **File**: `.opencode/skill/system-spec-kit/scripts/**/*.{ts,cjs,js,sh}`. Cross-reference against `package.json` scripts and `.opencode/command/spec_kit/*.md` invocations.
  - **Acceptance**: List of (script_path, invocation_source) pairs in `audit-state.jsonl`.

- [ ] **T103** Document hook loader pattern.
  - **File**: `mcp_server/hooks/` + whichever file loads them.
  - **Acceptance**: Loader pattern noted (static import / glob / readdir); `audit-state.jsonl` records hook discovery method.

- [ ] **T104** Grep agent/command markdown for symbol references.
  - **Command**: `rg -lF "<symbol>" .opencode/agent/ .opencode/command/spec_kit/ .claude/agents/ .codex/agents/ .gemini/agents/`
  - **Acceptance**: Cross-runtime symbol references collected per file in `audit-state.jsonl`.

- [ ] **T105** Enumerate `api/` barrel exports if present.
  - **File**: `mcp_server/api/*.ts`.
  - **Acceptance**: Public-surface exports listed in `audit-state.jsonl`.

- [ ] **T106** Enumerate test imports.
  - **File**: `mcp_server/tests/**/*.vitest.ts`.
  - **Acceptance**: Tested-file set in `audit-state.jsonl`.

- [ ] **T107** Build union alive-set.
  - **Output**: `audit-state.jsonl` records final `(file, exported_symbol)` alive pairs.

### Candidate detection

- [ ] **T201** Run `npx ts-prune` against `mcp_server/tsconfig.json`. Capture stdout to scratch file.
  - **Acceptance**: Raw ts-prune output preserved; counts noted.

- [ ] **T202** Run `tsc --noEmit` for sanity check. Compile MUST be clean (or pre-existing failures documented).
  - **Acceptance**: Compile result + any pre-existing failures noted in tooling appendix.

- [ ] **T203** Build orphan-files candidate set.
  - **Method**: For each `.ts`/`.js`/`.py`/`.sh` file under audit target, grep its path across the entire audit tree. Files with zero referrers go to candidate set.
  - **Acceptance**: Orphan-files candidate list in scratch.

- [ ] **T204** Build dead-types candidate set.
  - **Method**: `tsc --noEmit --noUnusedLocals --noUnusedParameters` OR ad-hoc grep of declared `type`/`interface` names against codebase.
  - **Acceptance**: Dead-types candidate list in scratch.

- [ ] **T205** Build stale-dist candidate set.
  - **Method**: For each `scripts/dist/*.js`, confirm paired `.ts` source exists.
  - **Acceptance**: Stale-dist files listed.

- [ ] **T206** Build stale-test candidate set.
  - **Method**: For each `*.vitest.ts`, attempt to resolve every imported path. Tests with broken imports → candidates.
  - **Acceptance**: Stale-test list.

### Classify + recommend

- [ ] **T301** Classify each candidate via the 4-step decision tree (alive-set → dynamic-load → disconnected-shape → dead).
  - **Acceptance**: Every candidate has a category label.

- [ ] **T302** Per finding, write recommended action (`delete` / `wire-in` / `keep-with-rationale`).
  - **Acceptance**: 100% coverage; no orphan findings missing recommendations.

- [ ] **T303** Per finding, assign safety ranking (`high-confidence-delete` / `needs-investigation` / `keep`).
  - **Acceptance**: REQ-007 honored — anything touched by dynamic-load pattern is `needs-investigation` or weaker.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T401** Write `dead-code-audit-report.md` at packet root with 9-section structure.
  - **File**: `dead-code-audit-report.md`
  - **Acceptance**: All sections present; categories populated or explicit "none found".

- [ ] **T402** Per-directory summary table covering at minimum 7 dirs (SC-007).
  - **Acceptance**: Table present with file counts + finding counts per category.

- [ ] **T403** Tooling + replication appendix.
  - **Acceptance**: Exact commands + tool versions documented (SC-008).

- [ ] **T501** Sample-verify ≥10 random findings: file:line resolves on disk (SC-002).
  - **Acceptance**: 10/10 verified; zero fabrications.

- [ ] **T502** Cross-check 5 random `dead` findings against alive-set (zero references via `rg`).
  - **Acceptance**: 5/5 confirmed dead.

- [ ] **T503** Run `validate.sh --strict` on packet.
  - **Acceptance**: Errors=0 (SPEC_DOC_INTEGRITY false-positives accepted as noise per the predecessor pattern).

- [ ] **T504** Update `implementation-summary.md` with audit summary (counts per category, top 5 highest-confidence deletes, top 5 highest-investigation items).
  - **Acceptance**: implementation-summary.md fully populated (NOT placeholder).
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

This packet is complete when:
- `dead-code-audit-report.md` ships at packet root with all 9 sections
- All 4 categories populated (or explicit "none")
- Sample-verification confirms zero fabrications
- `implementation-summary.md` summarizes findings
- `validate.sh --strict` Errors=0
- Final commit pushed to main

Downstream packet `004-dead-code-pruning/` (future, NOT in scope here) handles actual deletions gated on operator approval of this report.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Predecessor: `../001-memory-terminology/`, `../002-feature-catalog/`
- Audit target: `.opencode/skill/system-spec-kit/` (focus `mcp_server/`)
- Audit-report sibling pattern: `feature-catalog-impact-audit.md` + `testing-playbook-impact-audit.md` at `../011-mcp-runtime-stress-remediation/` (similar audit-report format)
- Future remediation: `004-dead-code-pruning/` (not yet scoped)
<!-- /ANCHOR:cross-refs -->
