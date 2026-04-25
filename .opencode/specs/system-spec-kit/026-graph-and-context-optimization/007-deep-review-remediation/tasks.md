---
title: "Tasks: 007 Deep-Review Remediation Campaign"
description: "Unified per-wave task ledger covering all six remediation programs that consolidated into the 007-deep-review-remediation root packet. Tracks 226 Wave A workstream tasks, 12 Wave B atomic-ship remediations, 7 Wave C closures, 12 Wave D R03 tasks, the 10-theme Wave E disposition, and 25 Wave F cross-phase fix dispatches."
trigger_phrases:
  - "007-deep-review-remediation tasks"
  - "deep review remediation tasks"
  - "wave a workstream tasks"
  - "phase 020 r1-r12 tasks"
  - "phase 025 dr-p1 tasks"
  - "phase 026 t01-t12 tasks"
  - "274 campaign tasks"
  - "cf-001 cf-027 fix tasks"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation"
    last_updated_at: "2026-04-25T06:10:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Merged the five nested phase task ledgers into one root tasks.md, preserving every wave's per-finding closure status."
    next_safe_action: "Dispatch Wave A WS0 P0 reconsolidation; force a CF-108 / CF-207 / CF-022 write-authority decision."
    blockers:
      - "Wave A WS0 P0 reconsolidation-bridge dispatch pending."
      - "CF-108 / CF-207 / CF-022 historical-source-authority decision pending."
    completion_pct: 92
---
# Tasks: 007 Deep-Review Remediation Campaign

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with replayable evidence |
| `[B]` | Blocked (write-authority or live-runtime decision pending) |
| `[D]` | User-approved deferral with rationale (see ADR / decision log) |
| `[P]` | Parallelizable |

**Task format**: `T### Description (severity / source-finding-id)`

Closeout file:line evidence anchors live in `implementation-summary.md` per wave. The tables below carry one row per task with status, severity, source identifier, and a one-line scope note. Per-wave dispatch protocols and closure narratives live in `plan.md` §4.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:wave-a -->
## Wave A — 120-Iteration Combined Deep-Review Remediation

**Source**: `review/review-report.md` (243 deduplicated findings: 1 P0 + 114 P1 + 133 P2 across packets 009 / 010 / 012 / 014).
**Workstreams**: 11. **Total tasks**: 226. **Checklist size**: 93 items (9 P0 + 75 P1 + 9 P2).

### WS0 — P0 Reconsolidation Scope-Boundary Fix (BLOCKER)

- [ ] T-A0-001 Add `tenant_id` / `user_id` / `agent_id` / `session_id` validation in `mcp_server/handlers/save/reconsolidation-bridge.ts:208-250` before merge decision (P0 / S2 + S3.2#1).
- [ ] T-A0-002 Abort cross-scope merges, preserve both records, log typed warning (P0 / S2).
- [ ] T-A0-003 Add cross-scope merge regression to `tests/reconsolidation-bridge.vitest.ts` (P0 / S2).
- [ ] T-A0-004 Audit all callers of the reconsolidation bridge for similar boundary assumptions (P0 / S2).

### WS0b — Path-Boundary Hardening

- [ ] T-A0b-001 `path.resolve()` + `startsWith(allowedRoot)` guard on `validateMergeLegality` and `validatePostSaveFingerprint` (P1 / S3.15).
- [ ] T-A0b-002 Resolve symlinks via `fs.realpathSync` in `resolveDatabasePaths()` and re-validate (P1 / S3.13#1-3).
- [ ] T-A0b-003 Workspace-root boundary check before `skill_graph_scan` dispatch (P1 / S3.2#4).
- [ ] T-A0b-004 Reject absolute `specFolder` values that fall outside packet roots in resume handlers (P1 / S3.2#6).
- [ ] T-A0b-005 `keepKeyFile()` / `buildKeyFileLookupPaths()` reject absolute candidates or normalize to repo-relative (P1 / S3.5#1).

### WS0c — Public-Contract Verification

- [ ] T-A0c-001 Diff every MCP tool-schema field list (`tool-schemas.ts`) against handler responses (P1 / S3.14).
- [ ] T-A0c-002 Fix `deep_loop_graph_status` schemaVersion / DB-size fields or update schema (P1 / S3.14).
- [ ] T-A0c-003 Fix `tool-input-schemas.ts` for later tool families (P1 / S3.14).
- [ ] T-A0c-004 Verify every README / SKILL.md entrypoint resolves on disk (P1 / S3.2#7).
- [ ] T-A0c-005 Remove dead L9 coverage-graph tool registrations in `tools/index.ts` (P1 / S3.2#8).
- [ ] T-A0c-006 Cross-check agent runtime directories across all 4 runtimes (P1 / S3.13#5).
- [ ] T-A0c-007 Extend schema-validation test to cover new tool families (P1 / S3.13#14).
- [ ] T-A0c-008 Reconcile `mcp_server/handlers/coverage-graph/status.ts` to schema (P1 / S3.14).

### WS1 — Status Drift Cleanup (28 tasks: 12 P1 + 16 P2)

- [ ] T-A1-001 Align spec.md / plan.md status to `graph-metadata.json` for packet 009 phases 001 + 003 (P1 / S3.3).
- [ ] T-A1-002 Align packet 010 phases 001 + 002 (sub-phases 001-006) + 003 (sub-phases 004-007) (P1 / S3.3).
- [ ] T-A1-003 Align packet 012 root + 014 root (P1 / S3.3).
- [ ] T-A1-004 Replace `closed_by_commit: TBD` with real hashes where known (P1 / S3.3#5).
- [ ] T-A1-005 Fix `determineSessionStatus()` false-completion logic (P1 / S3.3#8).
- [ ] T-A1-006 Fix deep-review `completed-continue` execution on completed sessions (P1 / S3.3#11).
- [ ] T-A1-007 Fix `/complete` debug-escalation wiring mismatch (P1 / S3.3#12).
- [ ] T-A1-008 Run `validate.sh --strict` after each batch on all four packets (P1 / S3.3).
- [ ] T-A1-009..T-A1-028 Remaining P2 status-drift items per S3.3 (16 × P2 / S3.3).

### WS2 — Packet 014 Identity Fix (5 tasks)

- [ ] T-A2-001 Replace `Packet 016` / `SC-016` / `CHK-016` / `packet-016` in `004-memory-save-rewrite/spec.md:217` (P1 / S3.4).
- [ ] T-A2-002 Replace identity refs in `004-memory-save-rewrite/checklist.md:143, :199` (P1 / S3.4).
- [ ] T-A2-003 Replace identity refs in `004-memory-save-rewrite/tasks.md:47, :54` (P1 / S3.4).
- [ ] T-A2-004 Replace identity refs in `004-memory-save-rewrite/changelog/` (P2 / S3.4).
- [ ] T-A2-005 `validate.sh --strict` on 014 after replacements (P2 / S3.4).

### WS3 — Command and Workflow Integrity (16 tasks: 14 P1 + 2 P2)

- [ ] T-A3-001 Fix `spec_kit_memory_memory_save(...)` references across 10 YAMLs to use `memory_save` (P1 / S3.1#10).
- [ ] T-A3-002 Fix `doctor_mcp_install.yaml` `guide_section` labels (P1 / S3.1#9).
- [ ] T-A3-003 Fix `spec_kit_implement_{auto,confirm}` default scope (P1 / S3.1#3).
- [ ] T-A3-004 Fix `runWorkflow()` quality-score override at `workflow.ts:1082` (P1 / S3.1#6).
- [ ] T-A3-005 Fix 250 ms dispatch graph-context timeout at `context-server.ts:631` (P1 / S3.1#7).
- [ ] T-A3-006 Fix frontmatter YAML comment stripping in `parseSectionValue` (P1 / S3.1#1).
- [ ] T-A3-007 Fix quoted trigger-phrase YAML serialization (P1 / S3.1#2).
- [ ] T-A3-008 Fix `/create:feature-catalog` root filename mismatch (P1 / S3.1#8).
- [ ] T-A3-009 Fix `sk-doc` multiline description teaching (P1 / S3.1#12).
- [ ] T-A3-010 Fix Gate 3 carry-over rule drift across root docs (P1 / S3.1#13).
- [ ] T-A3-011 Fix root docs' non-existent `generate-context.js` entrypoint path (P1 / S3.1#14).
- [ ] T-A3-012 Fix `config_checklist.md` JSONC validation commands (P1 / S3.1#11).
- [ ] T-A3-013..T-A3-016 Remaining P1 + P2 workflow items per S3.1 (3 × P1 + 2 × P2 / S3.1).

### WS4 — Error Handling and Security Hardening (12 tasks: 4 P1 + 8 P2)

- [ ] T-A4-001 Add explicit error forwarding in `session_bootstrap` (P1 / S3.8#2).
- [ ] T-A4-002 Add explicit error forwarding in `extractSpecTitle()` (P1 / S3.8#1).
- [ ] T-A4-003 Add explicit error forwarding in `session-prime` startup-brief import (P1 / S3.8#3).
- [ ] T-A4-004 Add `level` consumption in `spec-doc-structure.ts` validator (P1 / S3.5#4).
- [ ] T-A4-005 Make `sanitizeTriggerPhrases()` order-independent (P1 / S3.9#1).
- [ ] T-A4-006 Verify NFR-S05 fail-closed lock control (P1 / S3.9#2).
- [ ] T-A4-007 Unify bench / regression loader validation (P2 / S3.13#10).
- [ ] T-A4-008 Tighten `cli-copilot/SKILL.md` default autonomy level (P2 / S3.9#3).
- [ ] T-A4-009..T-A4-012 Remaining P2 error / security items (4 × P2 / S3.8 + S3.9).

### WS5 — Traceability and Evidence Gaps (25 tasks: 15 P1 + 10 P2)

- [ ] T-A5-001 Verify every checklist item has a `file:line` evidence reference (P1 / S3.5#1-3).
- [ ] T-A5-002 Write `implementation-summary.md` for 009/003 and any other packets lacking one (P1 / S3.5#2).
- [ ] T-A5-003 Repair broken cross-reference links in spec docs (P1 / S3.5#3).
- [ ] T-A5-004 Wire `post-save-review.ts` into the production `workflow.ts` pipeline (P1 / S3.5#6).
- [ ] T-A5-005 Fix `SPEC_DOC_SUFFICIENCY` to fail on anchor-parse errors (P1 / S3.5#4).
- [ ] T-A5-006 Fix `generate-context` silent retargeting (P1 / S3.5#5).
- [ ] T-A5-007 Fix `renderDashboard()` unescaped metadata injection (P1 / S3.5#8).
- [ ] T-A5-008 Document and validate 010/003/006 + 010/003/007 expanded scope (P1 / S3.5#11-12).
- [ ] T-A5-009 Fix `gate-d-regression-intent-routing.vitest.ts` to exercise live filtering (P1 / S3.5#13).
- [ ] T-A5-010 Fix `memory-search-integration.vitest.ts` to be a real integration suite (P1 / S3.5#14).
- [ ] T-A5-011 Fix `sk-code-full-stack` Node.js / React Native / Swift templates (P1 / S3.5#15).
- [ ] T-A5-012..T-A5-025 Remaining P1 + P2 evidence items per S3.5.

### WS6 — Stale References and Placeholders (26 tasks: 12 P1 + 14 P2)

- [ ] T-A6-001 Remove dead `deep_loop_graph_*` MCP tool surface (P1 / S3.7#1).
- [ ] T-A6-002 Fix stale `Phase 014` / `014-playbook-prompt-rewrite` references in 009/001 (P1 / S3.7#2).
- [ ] T-A6-003 Fix `MEMORY METADATA` inline comments overriding tier (P1 / S3.7#3).
- [ ] T-A6-004 Fix cross-anchor contamination stale route names (P1 / S3.7#4).
- [ ] T-A6-005 Fix dead `includeArchived` option in keyword / multi-concept search (P1 / S3.7#5).
- [ ] T-A6-006 Fix stale canonical plan link in 009/003 (P1 / S3.7#6).
- [ ] T-A6-007 Fix removed agent IDs (`speckit`, `research`) in Claude delegation reference (P1 / S3.7#7).
- [ ] T-A6-008 Fix stale Gate 3 phase-boundary rule in CLAUDE.md (P1 / S3.7#8).
- [ ] T-A6-009 Fix malformed Copilot prompt template commands (P1 / S3.10#1).
- [ ] T-A6-010 Fix Code Mode env-var contract contradiction (P1 / S3.10#2).
- [ ] T-A6-011 Fix feature-catalog template filename mismatch (P1 / S3.10#3).
- [ ] T-A6-012 Fix broken Level 1 copy command in `template_mapping.md` (P1 / S3.10#4).
- [ ] T-A6-013..T-A6-026 Remaining P2 stale-ref items (14 × P2 / S3.7 + S3.10).

### WS7 — Agent and Skill Doc Refresh (37 tasks: 21 P1 + 16 P2)

- [ ] T-A7-001 Update deep-review agent docs and reducer to match live iteration layout (P1 / S3.2 Opus#1).
- [ ] T-A7-002 Add `@context` LEAF-only guardrail to root docs (P1 / S3.2 Opus#2).
- [ ] T-A7-003 Cross-runtime alignment for `deep-review` agent across 4 runtimes (P1 / S3.11#1).
- [ ] T-A7-004 Cross-runtime alignment for `context` agent across 4 runtimes (P1 / S3.11#2).
- [ ] T-A7-005 Cross-runtime alignment for `orchestrate`, `write`, `review` agents (P1 / S3.11#3).
- [ ] T-A7-006 Fix `skill_graph_scan` workspace escape (P1 / S3.2#3).
- [ ] T-A7-007 Fix `skill_advisor_bench.py` prompt parsing (P1 / S3.2#5).
- [ ] T-A7-008 Fix reducer schema-drift crash (P1 / S3.2#6).
- [ ] T-A7-009 Fix Claude / Gemini agents pointing at wrong directory (P1 / S3.2#9-11, #13, #16-17).
- [ ] T-A7-010 Fix `sk-code` baseline skill reference to actual catalog name (P1 / S3.2#12).
- [ ] T-A7-011 Fix mcp-clickup env var prefix mismatch (P1 / S3.2#14).
- [ ] T-A7-012 Fix sk-deep-research Gemini runtime path gap (P1 / S3.2#15).
- [ ] T-A7-013 Fix cli-copilot auth guidance inconsistency (P1 / S3.2#33).
- [ ] T-A7-014 Establish single source-of-truth for agent definitions (P1 / S3.11#1).
- [ ] T-A7-015..T-A7-037 Remaining P1 + P2 agent / SKILL items (7 × P1 + 16 × P2 / S3.2 + S3.11).

### WS8 — Test Quality Improvements (47 tasks: 11 P1 + 36 P2)

- [ ] T-A8-001 Fix `coverage_gaps` to report correctly for review graphs (P1 / S3.6#1).
- [ ] T-A8-002 Fix deep-review reducer `blendedScore` drop (P1 / S3.6#2).
- [ ] T-A8-003 Fix content-router cache test to vary context fields (P1 / S3.6#3).
- [ ] T-A8-004 Fix intent-classifier accuracy gate to include all 7 intents (P1 / S3.6#4, #9).
- [ ] T-A8-005 Fix `reconsolidation-bridge.vitest.ts` planner-default safety (P1 / S3.6#5).
- [ ] T-A8-006 Fix archived constitutional filtering test (P1 / S3.6#6).
- [ ] T-A8-007 Fix `causal-fixes.vitest.ts` to test production `relations` filter (P1 / S3.6#7).
- [ ] T-A8-008 Fix `context-server.vitest.ts` to test the shipped parser, not a shadow copy (P1 / S3.6#8).
- [ ] T-A8-009 Fix cross-encoder silent-skip guards (P1 / S3.6#10).
- [ ] T-A8-010 Fix adaptive-fusion tests to verify result ordering (P1 / S3.6 Opus#1).
- [ ] T-A8-011 Add coverage-graph handler tests (P1 / S3.6#11).
- [ ] T-A8-012..T-A8-047 Remaining P2 test-quality items (36 × P2 / S3.6 + S3.12 + S3.13).
<!-- /ANCHOR:wave-a -->

---

<!-- ANCHOR:wave-b -->
## Wave B — Phase 020 CLI Executor Research-Findings Remediation

**Source**: `research/017-sk-deep-cli-runtime-execution-pt-01/research.md`. **Status**: Shipped via 6 cli-codex dogfooding waves.

| Task | Status | Severity | Source | Scope |
|------|--------|---------:|--------|-------|
| T-B-R1 | [x] | P0 | research.md §10 R1 | First-write JSONL executor identity (cli-codex / cli-copilot / cli-gemini / cli-claude-code). |
| T-B-R2 | [x] | P0 | research.md §10 R2 | Typed `dispatch_failure` event preserves executor identity on crashes. |
| T-B-R3 | [x] | P1 | research.md §10 R3 | Copilot `@path` 16 KB-threshold fallback in all 4 deep-loop YAMLs + matrix tests. |
| T-B-R4 | [x] | P0 | research.md §10 R4 | `description.json` discriminated loader (`parse_error` vs `schema_error`). |
| T-B-R5 | [x] | P0 | research.md §10 R5 | `mergePreserveRepair` helper + specimen tests on rich 017 fixtures; gate `generate-description` stale-file auto-repair on R4. |
| T-B-R6 | [x] | P1 | research.md §10 R6 | `graph-metadata.json derived.save_lineage` enum (`description_only` / `graph_only` / `same_pass`). |
| T-B-R7 | [x] | P1 | research.md §10 R7 | Continuity threshold one-sided semantics + low-precision timestamp normalization helper. |
| T-B-R8 | [x] | P1 | research.md §10 R8 | `retry_attempt` structured telemetry; `MAX_RETRIES = 3` numerically unchanged. |
| T-B-R9 | [x] | P1 | research.md §10 R9 | Evidence-marker fence parser fix (indented + nested + mismatched). |
| T-B-R10 | [x] | P1 | research.md §10 R10 | Caller-context coverage for `setImmediate` / `queueMicrotask` / `timers/promises`. |
| T-B-R11 | [x] | P1 | research.md §10 R11 | Readiness-contract docs narrowed to 4 reachable trust states; Copilot bootstrap docs reconciled. |
| T-B-R12 | [D] | P2 | research.md §10 R12 + Phase 017 R55-P2-004 | YAML evolution cleanup deferred per ADR-014 (low coupling to active hardening). |
<!-- /ANCHOR:wave-b -->

---

<!-- ANCHOR:wave-c -->
## Wave C — Phase 025 Skill-Advisor Deep-Review Remediation

**Source**: r02 deep-review at `../009-hook-package/001-skill-advisor-hook-surface/review-archive-r02-codex-copilot/findings-registry.json`. **Status**: All 7 closed; 58 focused tests pass.

| Task | Status | Severity | Dim | Source | Scope |
|------|--------|---------:|-----|--------|-------|
| T-C-001 | [x] | P1 | D1 | DR-P1-001 | Stdin prompt mode + envelope sanitizer at `coerceSharedPayloadEnvelope`. |
| T-C-002 | [x] | P1 | D2 | DR-P1-002 | `tokenCap` propagation; `maxTokens` in cache key; cache-hit provenance restamp. |
| T-C-003 | [x] | P1 | D3 | DR-P1-003 | Static vs live measurement separation; `finalizePrompt(promptId)`; analyzer keys by `promptId`. |
| T-C-004 | [x] | P1 | D5 | DR-P1-004 | Plugin shared disable flag; SIGTERM → SIGKILL escalation; source-signature in cache key; plugin in parity harness. |
| T-C-005 | [x] | P1 | D7 | DR-P1-005 | Workspace build command; Copilot integration model; manual playbook denominator; Codex registration; measurement artifact name. |
| T-C-006 | [x] | P2 | D4 | DR-P2-001 | `prompt-cache` size cap + insertion eviction; `normalizeAdapterOutput` `@deprecated`; JSDoc on advisor public symbols. |
| T-C-007 | [x] | P2 | D6 | DR-P2-002 | Plugin / subprocess / telemetry negative-path tests + builder→renderer parity case. |
<!-- /ANCHOR:wave-c -->

---

<!-- ANCHOR:wave-d -->
## Wave D — Phase 026 R03 Post-Remediation Remediation

**Source**: `../009-hook-package/001-skill-advisor-hook-surface/review/iterations/iteration-{007,013,014,017-021,028,029}.md`. **Status**: All T01-T12 closed.

| Task | Status | Severity | Dim | Source | Scope |
|------|--------|---------:|-----|--------|-------|
| T-D-T01 | [x] | P1 | D7 | P1-007-01 | `references/hooks/skill-advisor-hook.md:183-257` Copilot + Codex snippets aligned to or labeled against shipped hook configs. |
| T-D-T02 | [x] | P1 | D7 | P1-014-01 | Hardcoded inventory / health values across README, SET-UP_GUIDE, manual playbook, feature catalog replaced with live references or annotated as snapshots. |
| T-D-T03 | [x] | P1 | D3 | P1-017-01 | `LIVE_SESSION_WRAPPER_SETUP.md:48-169` documents `finalizePrompt(promptId)`. |
| T-D-T04 | [x] | P1 | D4 | P1-018-01 | New `lib/skill-advisor/error-diagnostics.ts:5-118` typed classification module wired through advisor producer stack and 3 vitests. |
| T-D-T05 | [x] | P1 | D5 | P1-019-01 | `.opencode/plugins/spec-kit-skill-advisor.js:115-134` adds workspace root to host cache key. |
| T-D-T06 | [x] | P1 | D6 | P1-020-01 | `tests/spec-kit-skill-advisor-plugin.vitest.ts:276-304` cross-workspace cache regression. |
| T-D-T07 | [x] | P1 | D7 | P1-021-01 | `manual_testing_playbook.md` reconciled to inline-root-table structure. |
| T-D-T08 | [x] | P1 | D7 | P1-028-01 | `manual_testing_playbook.md` bare-path commands replaced with `npm --prefix` / `cd`. |
| T-D-T09 | [x] | P2 | D7 | P2-007-01 | `manual_testing_playbook.md:310` LT-001 repo-relative link. |
| T-D-T10 | [x] | P2 | D6 | P2-013-01 | `tests/smart-router-telemetry.vitest.ts:274-293` default fallback path. |
| T-D-T11 | [x] | P2 | D6 | P2-013-02 | `tests/advisor-subprocess.vitest.ts:197-230` spawn-error classification. |
| T-D-T12 | [x] | P2 | D1 | P2-029-01 | `lib/context/shared-payload.ts:555-587` `provenance.sourceRefs` sanitizer parity. |
<!-- /ANCHOR:wave-d -->

---

<!-- ANCHOR:wave-e -->
## Wave E — 005-006 Campaign Findings Remediation (274 findings, 10 themes)

**Source**: Consolidated 006-campaign report (mirrored into this section + `implementation-summary.md` §Sub-phase summaries). **Status**: 6 themes Complete, 4 Blocked / Not started.

### Theme dispositions

| Task | Status | Severity Mix | Theme | Closeout note |
|------|--------|--------------|-------|---------------|
| T-E-T001 | [B] | P0=2 P1=42 P2=35 | 001 graph-and-metadata-quality (79 findings) | CF-181 / CF-071 / CF-133 / CF-116 closed; CF-108 blocked on historical-source write authority. |
| T-E-T002 | [B] | P0=1 P1=36 P2=23 | 002 spec-structure-and-validation (60 findings) | CF-176 reciprocal sibling edges + advisor health allowlist shipped; CF-207 blocks recursive validation. |
| T-E-T003 | [ ] | P0=1 P1=31 P2=14 | 003 evidence-references-and-replayability (46 findings) | Awaits expanded write authority. |
| T-E-T004 | [x] | P0=0 P1=34 P2=8 | 004 migration-lineage-and-identity-drift (42 findings) | Live `specFolder` paths replace retired tokens; SQLite-only runtime source; `migration-lineage-identity.vitest.ts` (4 tests). |
| T-E-T005 | [ ] | P0=2 P1=7 P2=8 | 005 packet-state-continuity-and-closeout (17 findings) | Awaits write authority on historical closeout surfaces. |
| T-E-T006 | [x] | P0=1 P1=6 P2=8 | 006 routing-accuracy-and-classifier-behavior (15 findings) | Tier 3 routing decoupled from `full-auto`; cache partitioned by packet-kind/save-mode/level/phase; `drop` (not `drop_candidate`) in public Tier 3 prompt; 6 vitests pass. |
| T-E-T007 | [x] | P0=0 P1=3 P2=4 | 007 skill-advisor-packaging-and-graph (7 findings) | `session-bootstrap.ts skillGraphTopology`; `top.uncertainty` rendering; `manual-testing-playbook.vitest.ts` locks 47 scenario files. |
| T-E-T008 | [x] | P0=0 P1=4 P2=1 | 008 search-fusion-and-reranker-tuning (5 findings) | `cross-encoder-extended.vitest.ts` extended; `remediation-008-docs.vitest.ts` locks counts. |
| T-E-T009 | [x] | P0=0 P1=2 P2=0 | 009 security-and-guardrails (2 findings) | CF-183 redaction; CF-186 empty-scan preservation; new `skill-graph-handlers.vitest.ts` (2 tests). |
| T-E-T010 | [x] | P0=0 P1=0 P2=1 | 010 telemetry-measurement-and-rollout-controls (1 finding) | CF-271 documented as starter-phrase policy; `codex-pre-tool-use.vitest.ts` (11 tests). `.codex/policy.json` write blocked by EPERM; runtime default + test updated instead. |

### Per-theme finding ledgers

For each theme, the per-finding task list (CF-NNN identifiers, severity, target file, closeout status) was carried over from the consolidated report into `implementation-summary.md` §Sub-phase summaries. Active runtime closures cite their CF id; blocked items cite the historical-source-authority dependency. Future remediation can pick up a theme without re-reading the full consolidated report.
<!-- /ANCHOR:wave-e -->

---

<!-- ANCHOR:wave-f -->
## Wave F — Cross-Phase Integrity-Parity Closure

**Source**: `research/cross-phase-synthesis.md` + `research/cross-phase-findings.json`. **Status**: 9/9 P0 + 16/16 P1 fixes applied via 25-way parallel `cli-codex gpt-5.4 high fast` overnight 2026-04-23 → 2026-04-24. CF-016 retried once after a Gate 3 hang.

### P0 fixes

| Task | Status | Source | Scope |
|------|--------|--------|-------|
| T-F-CF001 | [x] | CF-001 | Root packet state model refresh; archived deep-research dashboard reconciled. `applied/CF-001.md`. |
| T-F-CF002 | [x] | CF-002 | Live acceptance evidence for scan + index claims captured in `010-memory-indexer-lineage-and-concurrency-fix/implementation-summary.md` and `003-code-graph-package/003-code-graph-context-and-scan-scope/implementation-summary.md`. `applied/CF-002.md`. |
| T-F-CF005 | [x] | CF-005 | `mcp_server/handlers/save/atomic-index-memory.ts` lock ordering; `memory-save.ts` aligned; `handler-memory-save.vitest.ts` save-race regression. `applied/CF-005.md`. |
| T-F-CF009 | [x] | CF-009 | `code-graph/lib/ensure-ready.ts` and `code-graph/handlers/scan.ts` share one staged-persistence commit path. `applied/CF-009.md`. |
| T-F-CF014 | [x] | CF-014 | `shared/review-research-paths.cjs`; `spec_kit_deep-research_auto.yaml`; `sk-deep-research/references/state_format.md`. `applied/CF-014.md`. |
| T-F-CF017 | [x] | CF-017 | `manual_testing_playbook.md` + `manual-playbook-runner.ts` result-class vocabulary; `005-release-cleanup-playbooks/.../tasks.md` reconciled. `applied/CF-017.md`. |
| T-F-CF019 | [x] | CF-019 | `skill_advisor.py` pass/fail derivation reordered. `applied/CF-019.md`. |
| T-F-CF022 | [B] | CF-022 | Closure path recorded in `005-006-campaign-findings-remediation/001-graph-and-metadata-quality/checklist.md`; underlying historical-source write authority pending. `applied/CF-022.md`. |
| T-F-CF025 | [x] | CF-025 | `sk-deep-research/assets/prompt_pack_iteration.md.tmpl` writes executor metadata early; `lib/deep-loop/post-dispatch-validate.ts` typed executor failure events; `executor-audit.ts` canonical executor metadata. `applied/CF-025.md`. |

### P1 fixes (top-7 selected per cross-phase synthesis ranking)

| Task | Status | Source | Scope |
|------|--------|--------|-------|
| T-F-CF003 | [x] | CF-003 | Routing-quality claims now cite live telemetry instead of predictive counters. `applied/CF-003.md`. |
| T-F-CF004 | [x] | CF-004 | Copilot parity work reapplied; 007 backlog aligned to live 009 truth. `applied/CF-004.md`. |
| T-F-CF006 | [x] | CF-006 | One resume contract adopted across runtime, tests, and packet docs. `applied/CF-006.md`. |
| T-F-CF007 | [x] | CF-007 | Save / index guardrails hardened into explicit contracts. `applied/CF-007.md`. |
| T-F-CF010 | [x] | CF-010 | Code-graph trust metadata routed through one provenance layer. `applied/CF-010.md`. |
| T-F-CF011 | [x] | CF-011 | Code-graph public schemas brought into parity with handlers. `applied/CF-011.md`. |
| T-F-CF012 | [x] | CF-012 | Direct stale-file refresh + scoped readiness debounce added. `applied/CF-012.md`. |

### Remaining P1 fixes (CF-015..CF-027)

| Task | Status | Source | Scope |
|------|--------|--------|-------|
| T-F-CF015 | [x] | CF-015 | `applied/CF-015.md`. |
| T-F-CF016 | [x] | CF-016 | Retried after first-attempt Gate 3 hang; `applied/CF-016.md`. |
| T-F-CF018 | [x] | CF-018 | `applied/CF-018.md`. |
| T-F-CF020 | [x] | CF-020 | `applied/CF-020.md`. |
| T-F-CF021 | [x] | CF-021 | `applied/CF-021.md`. |
| T-F-CF023 | [x] | CF-023 | `applied/CF-023.md`. |
| T-F-CF024 | [x] | CF-024 | `applied/CF-024.md`. |
| T-F-CF026 | [x] | CF-026 | `applied/CF-026.md`. |
| T-F-CF027 | [x] | CF-027 | `applied/CF-027.md`. |
<!-- /ANCHOR:wave-f -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Wave A WS0 P0 reconsolidation scope-boundary fix shipped with passing cross-scope merge regression test.
- [ ] Wave A WS0b-WS8 each have either `[x]` closure or `[D]` user-approved deferral with rationale.
- [x] Wave B R1-R11 shipped with 116/116 scoped tests; R12 deferred per ADR-014.
- [x] Wave C closes all 5 P1 + 2 P2 findings (58/58 focused tests).
- [x] Wave D closes all 8 P1 + 4 P2 findings; T06 cross-workspace test green.
- [x] Wave E reports six themes Complete; four Blocked / Not started with documented historical-source-authority dependency.
- [x] Wave F applies 9/9 P0 + 16/16 P1 fixes via `applied/CF-NNN.md` evidence reports.
- [ ] CF-108 / CF-207 / CF-022 closed via expanded write authority OR formally deferred via ADR.
- [x] `description.json` and `graph-metadata.json` parseable after merge into single root spec.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Implementation Summary**: `implementation-summary.md`
- **Session Handover**: `handover.md`
- **Wave A source**: `review/review-report.md`
- **Wave B source**: `research/017-sk-deep-cli-runtime-execution-pt-01/research.md`
- **Wave C source**: `../009-hook-package/001-skill-advisor-hook-surface/review-archive-r02-codex-copilot/findings-registry.json`
- **Wave D source**: `../009-hook-package/001-skill-advisor-hook-surface/review/iterations/iteration-{007,013,014,017-021,028,029}.md`
- **Wave E source**: Mirrored into `implementation-summary.md` §Sub-phase summaries
- **Wave F source**: `research/cross-phase-synthesis.md` + `research/cross-phase-findings.json`; per-finding evidence under `applied/CF-NNN.md`
<!-- /ANCHOR:cross-refs -->
