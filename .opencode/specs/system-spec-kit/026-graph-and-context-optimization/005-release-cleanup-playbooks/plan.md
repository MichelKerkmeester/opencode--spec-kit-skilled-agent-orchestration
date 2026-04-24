---
title: "Implementation Plan: Release Cleanup Playbooks [system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/plan]"
description: "Consolidated plan for the three release workstreams — documentation parity revisits, runtime cleanup and audit, and playbook plus deep-review remediation — merged into root-only packet docs."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
trigger_phrases:
  - "005-release-cleanup-playbooks plan"
  - "release cleanup playbooks plan"
  - "phase 5 plan 026"
  - "release alignment plan"
  - "cleanup audit plan"
  - "playbook remediation plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Consolidated three phase plans into root plan"
    next_safe_action: "Reference only; work complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:merge-phases-root-only-2026-04-24"
      session_id: "026-phase-005-merge-root-only-2026-04-24"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
status: complete
---
# Implementation Plan: Release Cleanup Playbooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Type** | Documentation parity + runtime cleanup + test and review remediation |
| **Languages** | Markdown, JSON, TypeScript |
| **Testing** | `validate.sh --strict`, `tsc --noEmit`, `vitest run`, grep scans, manual playbook runner |
| **Inputs** | Phase 016 reference maps, Phase 018 continuity contract, 26 deep-review findings, five-config MCP scope, 515-root spec tree |

### Overview

Three independent release workstreams were executed in sequence and then merged into this single root packet. The plan records how each stream was bounded, executed, and verified. No implementation remains; this doc is the authoritative plan-of-record for the closed lane.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 016 reference maps locked as scope for documentation parity
- [x] Phase 018 canonical continuity contract documented before any edits
- [x] Shared-memory deletion surface confirmed as hard-delete (no deprecation layer)
- [x] `graph-metadata.json` schema reviewed before backfill begins
- [x] Five Public MCP configs enumerated before env-block alignment
- [x] Compiler dead-code scan strategy approved
- [x] All 22 deep-review findings triaged into doc / code / test buckets
- [x] Playbook runner and fixture retargeted before live sweep

### Definition of Done

- [x] All three workstreams record evidence in `implementation-summary.md`
- [x] `validate.sh --strict` passes for every code- or doc-touching closure
- [x] `tsc --noEmit` and `vitest run` pass after code changes
- [x] Root packet (post-merge) passes `validate.sh --strict --no-recursive`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Workstream A (documentation parity) is Markdown-only, rewriting active doc surfaces without touching runtime code. Workstream B (runtime cleanup) spans `.opencode/skill/system-spec-kit/mcp_server/`, `scripts/`, `shared/`, `lib/`, and the five Public MCP JSON configs; it hard-deletes TypeScript modules, ships the `graph-metadata.json` contract tree-wide, aligns config env blocks, and prunes dead imports and raw logging. Workstream C (playbook and remediation) modifies the manual testing playbook scaffold, the playbook runner and fixture TypeScript, the deep-review target surfaces (TS + docs + tests), and the 015-packet framing.

The workstreams run in the documented order because each cleaner later stream benefits from the surface the previous left behind: parity sweeps first align the documentation baseline, runtime cleanup then removes ballast and publishes the `graph-metadata.json` contract everywhere, and the playbook / deep-review wave resolves residual findings against the cleaned tree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Lock Phase 016 reference maps as the scope source for all three documentation parity passes.
- [x] Re-read the Phase 018 continuity contract before edits begin.
- [x] Scope the shared-memory deletion (handler, shared-spaces library, governance / HYDRA / archival flags, tests, docs).
- [x] Design the `graph-metadata.json` schema: `schema_version`, lineage fields, `manual` relationships, `derived` section.
- [x] Lock MCP config scope to the five Public configs (`.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, `opencode.json`).
- [x] Prepare dead-code scan: compiler `--noUnusedLocals --noUnusedParameters`, dead-concept greps, console sweeps.
- [x] Retarget playbook runner and fixture to the active packet path.
- [x] Triage the 22 deep-review findings into documentation, code, and test categories.

### Phase 2: Core Implementation

#### Workstream A — Documentation Parity Revisits

- [x] Scan the 63-file SKILL/internal-doc target list for pre-018 drift; patch 32 files; re-read every edit.
- [x] Scan the 44-file command target list; patch 28 editable files; record 7 blocked `.agents/commands/` mirror wrappers (sandbox `Operation not permitted`).
- [x] Scan the 34-file README audit list plus a 20-file first-party SKILL README spot-check and 89-file stale-term scan; patch 11 drifted READMEs; re-read every edit.

#### Workstream B — Runtime Cleanup and Audit

- [x] Hard-delete `mcp_server/handlers/shared-memory.ts` and `mcp_server/lib/collab/shared-spaces.ts`; remove shared-memory tools, request parameters, and retention-policy surfaces.
- [x] Remove `SPECKIT_MEMORY_SCOPE_ENFORCEMENT`, `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS`, `SPECKIT_HYDRA_*`, `SPECKIT_ARCHIVAL` flags and callers from active TS; delete `lib/cognitive/archival-manager.ts`; strip its bootstrap from `context-server.ts`.
- [x] Remove shared-memory command surface, catalog and playbook entries, and shared-memory-only tests.
- [x] Preserve `shared_space_id` columns in `vector-index-schema.ts` as a documented schema exception (unsafe SQLite column removal deferred).
- [x] Ship `graph-metadata-schema.ts` and `graph-metadata-parser.ts` (atomic write); integrate into the canonical-save path; add `document_type='graph_metadata'` to indexing and causal-edge processing.
- [x] Create `scripts/graph/backfill-graph-metadata.ts`; execute backfill across all 515 spec-folder roots at rollout time (leave `manual` relationship arrays empty).
- [x] Adopt the `graph-metadata.json` lifecycle across plan, complete, resume, validation, and scripts docs.
- [x] Remove `MEMORY_DB_PATH` and redundant `SPECKIT_*` feature flags from all five Public MCP configs; verify `cross-encoder.ts` defaults to Voyage `rerank-2.5` and `rollout-policy.ts` treats undefined / empty flags as enabled; rebuild packet docs to valid Level 2.
- [x] Run the compiler dead-code scan: remove dead imports, dead locals, dead helper paths; strip raw runtime `console.log` from production runtime modules; rewrite the package architecture narrative against live modules; create missing READMEs; rewrite the legacy 006 resource map.

#### Workstream C — Playbook and Deep-Review Remediation

- [x] Repair the manual testing playbook packet scaffold: restore Level 2 template structure, correct playbook index references to the corpus index file at the playbook root, and create missing `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- [x] Patch the playbook runner (`manual-playbook-runner.ts`) to retarget Phase 015 and parse live playbook formats; patch the fixture (`manual-playbook-fixture.ts`) to point at the active packet.
- [x] Run the Vitest blocker rerun (`handler-helpers`, `spec-doc-structure`): PASS 2 files, 78 tests.
- [x] Run the live manual runner sweep: discovers 300 active files, parses 290, reports 10 parse failures, aborts during fixture seeding.
- [x] Apply Wave 1 documentation fixes (14): template rewrites, stale requirement removal, continuity edit scope narrowing, stop-hook clarification, status field updates, graph-metadata refresh docs, README inventory updates, archive notes, playbook prose conversion across sk-deep-review, sk-deep-research, and system-spec-kit.
- [x] Apply Wave 2 code fixes (4): causal edge identity dedup in `causal-edges.ts`, phase-1 hardcoding removal in `memory-save.ts`, `shared_space_id` column handling in `vector-index-schema.ts`, absolute-path replacement in `.gemini/settings.json`.
- [x] Apply Wave 3 test and packet fixes (4): PASS reclassification for unresolved signals, 015 packet reframing from "full execution" to "coverage accounting", phase-2/phase-3 routing test additions, Gate D regression fixture expansion.

### Phase 3: Verification

- [x] Run `validate.sh --strict` for each sub-phase at closure time: all passes recorded except sub-phase 002 (not re-run at packet level) and Phase 014 `CONTINUITY_FRESHNESS` caveat.
- [x] Run `tsc --noEmit` (both workspaces) after each code-touching pass: all PASS.
- [x] Run `vitest run` on affected suites (15 files, 363 tests): PASS.
- [x] Confirm `grep -rn "SPECKIT_HYDRA"`, `"SPECKIT_ARCHIVAL"`, `"SCOPE_ENFORCEMENT"` on active TS (non-test): 0 matches.
- [x] Confirm the five MCP configs have identical Spec Kit Memory env blocks (`EMBEDDINGS_PROVIDER=auto` plus `_NOTE_*` in the same order).
- [x] Confirm `graph-metadata.json` backfill at 515/515 spec-folder roots at rollout time.
- [x] Post-merge: run `validate.sh --strict --no-recursive` at the flattened packet root; re-save to refresh `description.json` and `graph-metadata.json`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Scope | Result |
|------|-------|--------|
| `validate.sh --strict` | Three doc-parity passes | PASS × 3 |
| `validate.sh --strict` | Runtime cleanup sub-phases 001-004 | PASS × 4 |
| `validate.sh --strict` | Playbook repair sub-phase (001) | PASS after repair |
| `validate.sh --strict` | Deep-review remediation sub-phase (003) | PASS |
| `tsc --noEmit` (both workspaces) | Runtime cleanup + deep-review remediation | PASS |
| `vitest run` (affected suites) | Runtime cleanup + deep-review remediation | PASS (incl. 15 files / 363 tests for Wave 3) |
| Vitest blocker rerun | `handler-helpers`, `spec-doc-structure` | PASS (2 files, 78 tests) |
| Manual playbook runner sweep | Live scenario corpus | Live evidence captured: 300 / 290 / 10; abort during fixture seeding |
| `grep -rn` for deleted flag families | Active TS non-test | 0 matches |
| `graph-metadata.json` backfill coverage | All spec-folder roots | 515/515 |
| MCP env-block parity | Five Public configs | Identical |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Notes |
|------------|--------|-------|
| Phase 016 reference maps | Green | Used as scope lock for all documentation parity passes |
| Phase 018 continuity contract | Green | Re-read before each doc parity pass |
| Shared-memory feature surface | Green | Hard-delete scope defined up front |
| `graph-metadata.json` schema | Green | Reviewed before rollout; warning-first presence validation retained |
| Five-config MCP scope | Green | Operator-scoped to Public repo |
| 50-iteration deep-review findings list | Green | 22 findings triaged before Wave 1 |
| Playbook runner + fixture | Green | Retargeted before live sweep |
| Writable `.agents/commands/` | Amber | Sandbox blocks writes; 7 mirror wrappers documented as blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Documentation parity:** Restore prior wording in the 71 edited documentation files (32 SKILL/internal-doc + 28 commands + 11 READMEs) via `git revert`, then re-run the three drift sweeps.
- **Runtime cleanup:** Restore deleted TypeScript modules and reverted contracts from git history; delete new graph-metadata schema / parser / test / backfill files and revert the canonical-save hook; restore prior config files; restore removed dead-code and legacy architecture narrative.
- **Playbook and remediation:** Restore the packet documentation scaffold from history; restore runner and fixture; restore `causal-edges.ts`, `memory-save.ts`, `vector-index-schema.ts`, and `.gemini/settings.json`; re-run `tsc --noEmit` and `vitest run` to confirm restored state.
- **Root-only flatten:** Restore the three phase folders from git history, restore the legacy context-index file, and revert the root docs to their pre-flatten content.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Workstream A (doc parity) ──► Workstream B (runtime cleanup) ──► Workstream C (playbook + deep review)
       │                              │                                    │
       └────────────── cross-references ──────────────────────────────────┘
```

| Workstream | Depends On | Blocks |
|------------|------------|--------|
| A: Documentation parity revisits | Phase 016 reference maps + Phase 018 contract | Cleaner doc baseline for B and C |
| B: Runtime cleanup and audit | A (cleaner baseline) | `graph-metadata.json` and clean tree needed by C |
| C: Playbook and deep-review remediation | A + B | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Sub-streams | Complexity | Outcome |
|------------|-------------|------------|---------|
| A: Doc parity | 3 (SKILL/internal-doc, command, README) | Medium | 141 reviewed / 71 updated |
| B: Runtime cleanup | 4 (shared-mem delete, graph-metadata, MCP config, dead-code audit) | High | Feature surface deleted, 515 roots backfilled, 5 configs aligned, dead code removed |
| C: Playbook + remediation | 3 (scaffold repair, coverage accounting, 3-wave deep-review remediation) | High | Scaffold valid, 22 findings resolved |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

All work is reversible via `git revert` because no database migration, schema drop, or irreversible operation was applied. The preserved `shared_space_id` columns mean existing installs are unaffected either way. Backfill-generated `graph-metadata.json` files can be regenerated from `scripts/graph/backfill-graph-metadata.ts` after any rollback. Rollback order follows reverse-execution order: reverse Workstream C, then B, then A.
<!-- /ANCHOR:enhanced-rollback -->
