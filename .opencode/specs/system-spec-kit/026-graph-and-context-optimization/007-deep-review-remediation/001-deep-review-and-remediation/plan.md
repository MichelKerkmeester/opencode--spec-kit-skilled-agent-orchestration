---
title: "Im [system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/001-deep-review-and-remediation/plan]"
description: "Phased remediation plan for 243 findings across 11 workstreams, starting with the P0 reconsolidation blocker and progressing through path hardening, contract verification, status cleanup, and test quality."
trigger_phrases:
  - "remediation plan"
  - "015 plan"
  - "workstream"
  - "remediation workstreams"
  - "deep review fix plan"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/001-deep-review-and-remediation"
    last_updated_at: "2026-04-16T12:00:00Z"
    last_updated_by: "claude-opus-4.6"
    recent_action: "Created 11-phase remediation plan from review-report.md"
    next_safe_action: "Execute Workstream 0 (P0 reconsolidation fix)"
    blockers:
      - "P0 reconsolidation scope-boundary must be fixed first"
    key_files:
      - "review/review-report.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:plan-v1-2026-04-16"
      session_id: "remediation-planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 015 Deep Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript (CJS), Python, Shell, YAML |
| **Framework** | Vitest (testing), MCP server (runtime) |
| **Storage** | SQLite (vector-index, coverage-graph, causal-edges) |
| **Testing** | Vitest |

### Overview

This plan addresses 243 deduplicated findings from the merged 120-iteration deep review across packets 009, 010, 012, and 014. Work is organized into 11 workstreams ordered by priority: the P0 reconsolidation blocker first, then path/contract hardening, then progressively lower-risk cleanup. Each workstream is self-contained with clear entry/exit criteria.

### Execution Strategy

- **Sequential start**: WS 0 must complete before release consideration
- **Parallel execution**: WS 1-5 can run in parallel after WS 0/0b/0c complete
- **Batch-friendly**: WS 1 and WS 2 are script-automatable
- **Test-last**: WS 8 (test quality) runs last as it depends on production code stabilizing
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:phase-0 -->
## Phase 0: P0 Reconsolidation Scope-Boundary Fix (BLOCKER)

**Findings**: 1 (P0) -- review-report.md S2, S3.2#1
**Effort**: Medium (4-8 hours)
**Status**: Not Started
**Blocks**: Release of 026 optimization wave

### Problem

`reconsolidation-bridge.ts:208-250` can merge records that belong to different tenants, users, agents, or sessions. The merged survivor loses governance metadata, creating a data-integrity and security breach.

### Technical Approach

1. Add scope-field validation in `reconsolidation-bridge.ts` before the merge decision point (~line 208)
2. Compare `tenant_id`, `user_id`, `agent_id`, `session_id` between candidate and survivor
3. If any scope field mismatches: abort reconsolidation, preserve both records, log warning
4. Add `reconsolidation-bridge.vitest.ts` test case: cross-scope merge attempt must be rejected
5. Audit all callers of the reconsolidation bridge for similar boundary assumptions

### Key Files

- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts`

### Definition of Ready

- [ ] Review report S2 and S3.2#1 findings re-read
- [ ] `reconsolidation-bridge.ts` loaded and understood

### Definition of Done

- [ ] Scope-boundary validation added before merge
- [ ] Cross-scope merge attempt test passes
- [ ] Existing reconsolidation tests still green
- [ ] `validate.sh --strict` passes
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-0b -->
## Phase 0b: Path-Boundary Hardening

**Findings**: 5 (P1) -- review-report.md S3.15, S3.2#4/#6, S3.5#1, S3.8#1, S3.13#1-3/#11
**Effort**: Medium (4-6 hours)
**Status**: Not Started
**Depends on**: Can run parallel to Phase 0

### Problem

Multiple surfaces accept absolute paths or symlinks that escape the intended scope: folder-scoped validators (`validateMergeLegality`, `validatePostSaveFingerprint`), DB-directory resolution (`resolveDatabasePaths`), skill-graph scan dispatch, resume handlers, and graph-metadata key-file extraction.

### Technical Approach

1. Add `path.resolve()` + `startsWith(allowedRoot)` guard to folder-scoped validators
2. In `resolveDatabasePaths()`: resolve symlinks via `fs.realpathSync`, then re-validate against allowed root
3. In `skill_graph_scan`: add workspace-root boundary check before dispatch
4. In resume handlers: reject absolute `specFolder` values that fall outside packet roots
5. In `keepKeyFile()` / `buildKeyFileLookupPaths()`: reject absolute path candidates or normalize to repo-relative
6. Add regression tests for each path-escape vector

### Key Files

- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` (lines 395, 562, 1021)
- `.opencode/skill/system-spec-kit/mcp_server/core/config.ts` (lines 45-83)
- `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts` (line 523)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/` (scan handler)

### Definition of Ready

- [ ] All 5 path-escape findings re-read with evidence paths verified

### Definition of Done

- [ ] All folder-scoped validators reject absolute/escaped paths
- [ ] Symlink escape in DB resolution blocked
- [ ] Regression test for each escape vector passes
- [ ] Existing path-related tests still green
<!-- /ANCHOR:phase-0b -->

---

<!-- ANCHOR:phase-0c -->
## Phase 0c: Public-Contract Verification

**Findings**: 8 (P1) -- review-report.md S3.14, S3.2#7/#8, S3.13#5/#14
**Effort**: Medium (4-8 hours)
**Status**: Not Started
**Depends on**: Can run parallel to Phase 0

### Problem

Published tool schemas, README entrypoints, agent directories, and MCP tool inventories do not match actual runtime behavior. Consumers relying on published contracts get undefined values, wrong paths, or non-existent tool names.

### Technical Approach

1. Diff every MCP tool-schema field list (`tool-schemas.ts`) against actual handler response shapes
2. Fix `deep_loop_graph_status` to return promised `schemaVersion` / DB-size fields, or update schema
3. Fix `tool-input-schemas.ts` to match runtime contract for later tool families
4. Verify every README/SKILL.md entrypoint path resolves to an existing file on disk
5. Fix or remove dead tool registrations (L9 coverage-graph tools in `tools/index.ts`)
6. Cross-check agent runtime directories across all 4 runtimes

### Key Files

- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-input-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts`

### Definition of Ready

- [ ] All 8 contract-drift findings re-read

### Definition of Done

- [ ] Every tool schema field matches handler response
- [ ] Dead tool registrations removed or implemented
- [ ] All README entrypoints verified on disk
- [ ] Schema-validation test extended to cover new tool families
<!-- /ANCHOR:phase-0c -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Status Drift Cleanup

**Findings**: 28 (12 P1, 16 P2) -- review-report.md S3.3
**Effort**: Low (1-2 hours)
**Status**: Not Started
**Depends on**: None (can start immediately, no code changes)

### Problem

Across all four packets, `spec.md` and `plan.md` files still say `planned` or `Draft` while checklists are fully checked and `graph-metadata.json` reports `complete`. Some implementation-summary files carry `closed_by_commit: TBD` placeholders.

### Technical Approach

Script-automatable batch update:
1. For each completed packet phase: set `spec.md` status to Complete, `plan.md` status to Complete
2. Replace `closed_by_commit: TBD` with actual commit hashes where known
3. Verify `graph-metadata.json` status field matches frontmatter
4. Run `validate.sh --strict` after each batch
5. Fix `determineSessionStatus()` false-completion logic (S3.3#8)
6. Fix deep-review `completed-continue` path execution on completed sessions (S3.3#11)
7. Fix `/complete` debug-escalation wiring mismatch (S3.3#12)

### Affected Packets

- 009: phases 001, 003
- 010: phases 001, 002 (sub-phases 001-006), 003 (sub-phases 004-007)
- 012: root packet
- 014: root packet

### Definition of Ready

- [ ] Full list of spec/plan files with stale status identified

### Definition of Done

- [ ] Zero status contradictions between spec/plan and graph-metadata
- [ ] Zero `TBD` placeholders in implementation summaries
- [ ] `validate.sh --strict` passes for all affected packets
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Packet 014 Identity Fix

**Findings**: 5 (2 P1, 3 P2) -- review-report.md S3.4
**Effort**: Low (30 minutes)
**Status**: Not Started
**Depends on**: None (can start immediately)

### Problem

Packet 014 (memory-save-planner-first-default) still references `Packet 016`, `SC-016`, `CHK-016-*` across spec, tasks, checklist, and changelog. The live packet ID is 014.

### Technical Approach

1. Global search for `SC-016`, `CHK-016`, `Packet 016`, `packet-016` in 014 folder
2. Replace with `SC-014`, `CHK-014`, `Packet 014`, `packet-014`
3. Verify no cross-contamination with actual 016 (release-alignment) if it exists
4. Run `validate.sh --strict` on 014 after changes

### Key Files

- `.opencode/specs/.../004-memory-save-rewrite/spec.md` (line 217)
- `.opencode/specs/.../004-memory-save-rewrite/checklist.md` (lines 143, 199)
- `.opencode/specs/.../004-memory-save-rewrite/tasks.md` (lines 47, 54)
- `.opencode/specs/.../004-memory-save-rewrite/changelog/`

### Definition of Ready

- [ ] Grep for `016` in 014 folder confirms scope

### Definition of Done

- [ ] Zero `016` identity refs in 014 packet
- [ ] `validate.sh --strict` passes for 014
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Command & Workflow Integrity

**Findings**: 16 (14 P1, 2 P2) -- review-report.md S3.1
**Effort**: Medium (4-8 hours)
**Status**: Not Started
**Depends on**: Phase 0 (reconsolidation fix may affect workflow YAMLs)

### Problem

Command YAML workflows have: stale MCP tool references (`spec_kit_memory_memory_save` instead of `memory_save`), broken section labels in doctor workflows, wrong default scopes blocking non-spec edits, a quality-score override bug in `runWorkflow()`, and timeout logic that does not actually cap latency.

### Technical Approach

1. Fix `spec_kit_memory_memory_save(...)` references across 10 YAML files to use `memory_save` (S3.1#10)
2. Fix `doctor_mcp_install.yaml` guide_section labels to match actual install guides (S3.1#9)
3. Fix `spec_kit_implement_{auto,confirm}` default scope to allow non-spec code edits (S3.1#3)
4. Fix `runWorkflow()` quality score override at `workflow.ts:1082` (S3.1#6)
5. Fix 250ms dispatch graph-context timeout at `context-server.ts:631` (S3.1#7)
6. Fix frontmatter YAML comment stripping in `parseSectionValue` (S3.1#1)
7. Fix quoted trigger phrase YAML serialization (S3.1#2)
8. Fix `/create:feature-catalog` root filename mismatch (S3.1#8)
9. Fix `sk-doc` multiline description teaching (S3.1#12)
10. Fix Gate 3 carry-over rule drift across root docs (S3.1#13)
11. Fix root docs' non-existent `generate-context.js` entrypoint path (S3.1#14)
12. Fix `config_checklist.md` JSONC validation commands (S3.1#11)

### Key Files

- `.opencode/command/spec_kit/assets/*.yaml` (10 files)
- `.opencode/command/doctor/assets/doctor_mcp_install.yaml`
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts`

### Definition of Ready

- [ ] All 16 command/workflow findings re-read

### Definition of Done

- [ ] All YAML workflows reference live MCP tools only
- [ ] Doctor workflow section labels verified against install guides
- [ ] Quality score and timeout logic verified correct
- [ ] Frontmatter serialization bugs fixed with regression tests
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Error Handling & Security Hardening

**Findings**: 12 (4 P1, 8 P2) -- review-report.md S3.8, S3.9, related S3.13 items
**Effort**: Medium (4-8 hours)
**Status**: Not Started
**Depends on**: Phase 0b (path hardening provides the boundary framework)

### Problem

Silent failures in error paths: `session_bootstrap` swallows JSON parse failures and still reports `"full"`, `extractSpecTitle()` discards read/parse errors, `session-prime` hides startup-brief regressions. Security: `sanitizeTriggerPhrases()` order-sensitive shadow removal, NFR-S05 closed on documentary evidence only.

### Technical Approach

1. **Error propagation**: Add explicit error forwarding in `session_bootstrap`, `extractSpecTitle`, `session-prime` startup-brief import, `handleCoverageGraphStatus`
2. **Input validation**: Add `level` consumption in `spec-doc-structure.ts` validator; validate all MCP handler inputs at boundary
3. **Security**: Fix `sanitizeTriggerPhrases()` order-dependency; verify NFR-S05 fail-closed lock control
4. **Dataset validation**: Unify bench/regression loader validation; add tests for edge cases
5. **Agent permissions**: Tighten `cli-copilot/SKILL.md` default autonomy level

### Key Files

- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`

### Definition of Ready

- [ ] All 12 error/security findings re-read

### Definition of Done

- [ ] No silent error swallowing in reviewed handlers
- [ ] `sanitizeTriggerPhrases()` is order-independent
- [ ] Tightened agent permissions documented and applied
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Traceability & Evidence Gaps

**Findings**: 25 (15 P1, 10 P2) -- review-report.md S3.5
**Effort**: Medium (4-8 hours)
**Status**: Not Started
**Depends on**: Phase 1 (status drift cleanup provides correct status baseline)

### Problem

Checklist evidence does not trace to first-order proof surfaces. Implementation summaries are missing or use placeholder content. Cross-reference chains are broken. The post-save reviewer is not wired into the production pipeline. Key-file extraction accepts absolute paths.

### Technical Approach

1. **Evidence fixing**: For each packet, verify every checklist item has a `file:line` evidence reference
2. **Missing summaries**: Write `implementation-summary.md` for 009/003 and any other packets lacking one
3. **Cross-refs**: Fix broken cross-reference links in spec docs (009/003 -> nonexistent 016, etc.)
4. **Post-save wiring**: Wire `post-save-review.ts` into the production `workflow.ts` pipeline (S3.5#6)
5. **Validator fixes**: Fix `SPEC_DOC_SUFFICIENCY` to fail on anchor-parse errors (S3.5#4); fix `generate-context` silent retargeting (S3.5#5)
6. **Dashboard security**: Fix `renderDashboard()` unescaped metadata injection (S3.5#8)
7. **Contract alignment**: Fix 010/002/004 Tier 3 documentation to match 014's opt-in guard (S3.5#7)
8. **Scope broadening**: Document and validate 010/003/006 and 010/003/007 expanded scope (S3.5#11-12)
9. **Test fixes**: Fix `gate-d-regression-intent-routing.vitest.ts` to exercise live filtering (S3.5#13); fix `memory-search-integration.vitest.ts` to be a real integration suite (S3.5#14)
10. **Stack templates**: Fix sk-code-full-stack Node.js/React Native/Swift templates (S3.5#15)

### Key Files

- `.opencode/specs/.../003-playbook-and-remediation/003-deep-review-remediation/`
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
- `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts`
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`

### Definition of Ready

- [ ] Inventory of all missing implementation summaries compiled

### Definition of Done

- [ ] Every checklist item has traceable file:line evidence
- [ ] All missing implementation summaries created
- [ ] Post-save reviewer wired into production pipeline
- [ ] All cross-reference links resolve
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Stale References & Placeholder Cleanup

**Findings**: 26 (12 P1, 14 P2) -- review-report.md S3.7, S3.10
**Effort**: Medium (4-6 hours)
**Status**: Not Started
**Depends on**: Phase 3 (command integrity fixes may resolve some stale refs)

### Problem

References to removed features, renamed files, deprecated patterns. Template placeholders in shipped code. **Contains 12 P1-severity items** including wrong agent directories, malformed copy-paste commands, dead MCP tool surfaces, and bad entrypoints that affect runtime behavior.

### Technical Approach

**P1 items (fix first):**
1. Fix dead `deep_loop_graph_*` MCP tool surface (S3.7#1)
2. Fix stale `Phase 014` / `014-playbook-prompt-rewrite` references in 009/001 (S3.7#2)
3. Fix `MEMORY METADATA` inline comments overriding tier (S3.7#3)
4. Fix cross-anchor contamination stale route names (S3.7#4)
5. Fix dead `includeArchived` option in keyword/multi-concept search (S3.7#5)
6. Fix stale canonical plan link in 009/003 (S3.7#6)
7. Fix removed agent IDs (`speckit`, `research`) in Claude delegation reference (S3.7#7)
8. Fix stale Gate 3 phase-boundary rule in CLAUDE.md (S3.7#8)
9. Fix malformed Copilot prompt template commands (S3.10#1)
10. Fix Code Mode env-var contract contradiction (S3.10#2)
11. Fix feature-catalog template filename mismatch (S3.10#3)
12. Fix broken Level 1 copy command in `template_mapping.md` (S3.10#4)

**P2 items (fix when practical):**
13-26. Various stale timestamp, dead branch, changelog count, troubleshooting, and anchor convention issues

### Key Files

- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts`
- `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts`
- `.opencode/skill/cli-copilot/assets/prompt_templates.md`
- `.opencode/skill/mcp-code-mode/assets/config_template.md`
- `CLAUDE.md`, `AGENTS.md`

### Definition of Ready

- [ ] All 26 stale-ref and placeholder findings re-read

### Definition of Done

- [ ] All 12 P1 stale refs fixed
- [ ] All P2 stale refs fixed where practical
- [ ] Grep for known stale patterns returns zero hits
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: Agent & Skill Doc Refresh

**Findings**: 37 (21 P1, 16 P2) -- review-report.md S3.2, S3.11, S3.13 (agent-related)
**Effort**: Medium-High (8-16 hours)
**Status**: Not Started
**Depends on**: Phase 6 (stale ref cleanup provides clean baseline)

### Problem

Agent definitions across 4 runtimes (.claude/, .opencode/, .codex/, .gemini/) have drifted. SKILL.md files reference removed capabilities, wrong runtime directories, stale tool lists, and outdated iteration schemas. Cross-runtime traceability is ambiguous.

### Technical Approach

1. **Iteration schema update**: Update deep-review agent docs and reducer to match live iteration layout (S3.2 Opus#1)
2. **LEAF guardrail**: Add `@context` LEAF-only guardrail to root docs (S3.2 Opus#2)
3. **Cross-runtime alignment**: For each agent (deep-review, context, orchestrate, write, review): diff all 4 runtime mirrors, unify to canonical source
4. **Skill-graph fix**: Fix `skill_graph_scan` workspace escape; fix `skill_advisor_bench.py` prompt parsing; fix reducer schema-drift crash (S3.2#3-6)
5. **Runtime directory fix**: Fix Claude/Gemini agents pointing at wrong directory (S3.2#9-11, #13, #16-17)
6. **Missing skill name**: Fix `sk-code` baseline skill reference to actual catalog name (S3.2#12)
7. **Environment vars**: Fix mcp-clickup env var prefix mismatch (S3.2#14)
8. **Runtime paths**: Fix sk-deep-research Gemini runtime path gap (S3.2#15)
9. **Auth docs**: Fix cli-copilot auth guidance inconsistency (S3.2#33)
10. **Cross-runtime contract**: Establish single source-of-truth for agent definitions (S3.11#1)

### Key Files

- `.claude/agents/*.md`, `.opencode/agent/*.md`, `.codex/agents/*.md`, `.gemini/agents/*.md`
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs`
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
- `.opencode/skill/cli-claude-code/SKILL.md`, `README.md`
- `.opencode/skill/cli-copilot/SKILL.md`
- Various SKILL.md files across skills

### Definition of Ready

- [ ] Cross-runtime agent inventory diff completed

### Definition of Done

- [ ] All 4 runtime agent directories consistent
- [ ] All SKILL.md files reference current capabilities only
- [ ] Reducer handles current iteration schema
- [ ] `sk-code` baseline reference resolves to real skill
<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:phase-8 -->
## Phase 8: Test Quality Improvements

**Findings**: 47 (11 P1, 36 P2) -- review-report.md S3.6, related S3.12, S3.13 test items
**Effort**: High (16-24 hours)
**Status**: Not Started
**Depends on**: All previous phases (production code must stabilize before test rewrites)

### Problem

Test suites contain: false-positive tests (pass when code is broken), shadow-copy testing (local reimplementations instead of production imports), missing edge cases (null/empty/concurrent), brittle string-presence assertions instead of behavioral checks, silently skipped coverage blocks, and missing coverage for critical paths.

### Technical Approach

**P1 test fixes (11 findings):**
1. Fix `coverage_gaps` to report correctly for review graphs (S3.6#1)
2. Fix deep-review reducer `blendedScore` drop (S3.6#2)
3. Fix content-router cache test to vary context fields (S3.6#3)
4. Fix intent-classifier accuracy gate to include all 7 intents (S3.6#4, #9)
5. Fix `reconsolidation-bridge.vitest.ts` to test planner-default safety (S3.6#5)
6. Fix archived constitutional filtering test to catch real broken behavior (S3.6#6)
7. Fix `causal-fixes.vitest.ts` to test production `relations` filter (S3.6#7)
8. Fix `context-server.vitest.ts` to test shipped parser, not shadow copy (S3.6#8)
9. Fix cross-encoder silent-skip guards (S3.6#10)
10. Fix adaptive-fusion tests to verify result ordering (S3.6 Opus#1)

**P2 test improvements (36 findings):**
11-47. Replace string-presence assertions with behavioral checks; add missing edge cases for Unicode, empty inputs, concurrent access; remove false-positive regression expectations; add coverage-graph handler tests; extend schema-validation to cover all tool families; fix silent import-skip patterns

### Key Files

- `.opencode/skill/system-spec-kit/mcp_server/tests/*.vitest.ts` (20+ files)
- `.opencode/skill/system-spec-kit/scripts/tests/*.vitest.ts` (10+ files)
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs`

### Definition of Ready

- [ ] Production code stable (WS 0-7 complete)
- [ ] Test inventory of all 47 flagged files compiled

### Definition of Done

- [ ] All 11 P1 test findings fixed
- [ ] P2 test improvements applied where practical
- [ ] Zero false-positive tests in flagged suites
- [ ] `npx vitest run` passes with no silent skips
<!-- /ANCHOR:phase-8 -->

---

<!-- ANCHOR:dependencies -->
## 9. DEPENDENCY MAP

```
Phase 0 (P0 blocker) -----> Release gate
     |
     v
Phase 0b (path hardening) ---> Phase 4 (error/security)
Phase 0c (contract verify) --> Phase 7 (agent/skill docs)
     |
     +--> Phase 3 (command integrity) --> Phase 6 (stale refs)
     |
     +--> Phase 1 (status drift) ---------> Phase 5 (traceability)
     |
     +--> Phase 2 (014 identity) [independent]
     |
     +--> All phases 0-7 complete --------> Phase 8 (test quality)
```

### Parallelization Opportunities

| Can Run In Parallel | Notes |
|---------------------|-------|
| Phase 0 + Phase 0b + Phase 0c | Different codepaths |
| Phase 1 + Phase 2 | Independent doc changes, no code overlap |
| Phase 3 + Phase 4 + Phase 5 | After 0/0b/0c, minimal overlap |
| Phase 6 + Phase 7 | After command/error fixes stabilize |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:effort -->
## 10. EFFORT SUMMARY

| Phase | Effort | Cumulative |
|-------|--------|------------|
| 0: P0 fix | 4-8h | 4-8h |
| 0b: Path hardening | 4-6h | 8-14h |
| 0c: Contract verify | 4-8h | 12-22h |
| 1: Status drift | 1-2h | 13-24h |
| 2: 014 identity | 0.5h | 13.5-24.5h |
| 3: Command integrity | 4-8h | 17.5-32.5h |
| 4: Error/security | 4-8h | 21.5-40.5h |
| 5: Traceability | 4-8h | 25.5-48.5h |
| 6: Stale refs | 4-6h | 29.5-54.5h |
| 7: Agent/skill docs | 8-16h | 37.5-70.5h |
| 8: Test quality | 16-24h | 53.5-94.5h |
| **Total** | **54-95h** | |
<!-- /ANCHOR:effort -->
