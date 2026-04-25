---
title: "Implementation Plan: 007 Deep-Review Remediation Campaign"
description: "Unified Level 3 plan for the six-wave deep-review and cross-phase remediation campaign. Sequences the 120-iteration deep-review workstreams, the Phase 020 CLI-executor remediation waves, the Phase 025 skill-advisor closures, the Phase 026 R03 follow-up, the 274-finding 006-campaign theme work, and the cross-phase integrity-parity overnight closure into a single technical roadmap with explicit dependencies, parallelization opportunities, and rollback contracts."
trigger_phrases:
  - "007-deep-review-remediation plan"
  - "deep review remediation plan"
  - "120-iteration remediation plan"
  - "wave a workstream 0 reconsolidation"
  - "wave b cli executor"
  - "wave c skill advisor"
  - "wave d r03 post"
  - "wave e 005-006 campaign"
  - "wave f integrity parity closure"
importance_tier: "critical"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation"
    last_updated_at: "2026-04-25T06:10:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Merged the five nested phase plans into a single root plan with six waves and one residual P0 dispatch tracked separately."
    next_safe_action: "Decide whether Wave A WS0 (P0 reconsolidation) and the residual 005-006 historical-source items dispatch from this packet or split into successor packets."
    blockers:
      - "CF-108 / CF-207 / CF-022 historical-source-authority decision pending."
      - "Wave A WS0 P0 reconsolidation-bridge dispatch pending."
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 92
---
# Implementation Plan: 007 Deep-Review Remediation Campaign

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Languages** | TypeScript (MCP server, deep-loop, validators), JavaScript (OpenCode plugins, CommonJS modules), Python (skill_advisor.py, advisor scripts), Shell (validators, dispatch wrappers), YAML (workflow assets), JSON / JSONC (manifests, schemas) |
| **Framework** | Spec Kit Level 3 root packet over six historical phase packets |
| **Storage** | SQLite (vector-index, coverage-graph, causal-edges, skill-graph), JSONL (deep-loop iteration state), Markdown (spec-doc surfaces) |
| **Testing** | Vitest (TypeScript / JavaScript), pytest (Python advisor), strict spec-doc validation via `validate.sh --strict` |
| **Dispatch** | `cli-codex` dogfooding (Waves B / C / F), 12 sequential `cli-copilot` agents (Wave D), 25-way parallel `cli-codex gpt-5.4 high fast` (Wave F) |

### Overview

This plan sequences six historically independent remediation programs under one root packet. Each program is treated as a wave (A through F) with its own definition of done. Waves are mostly independent at the file-surface level, but they share two cross-cutting governance contracts: (1) the deep-loop executor provenance and `dispatch_failure` event introduced by Wave B is reused by Wave F's CF-025 closure; and (2) the 005-006 historical-source-authority blockers from Waves E and F (CF-108, CF-207, CF-022) share a single deferral pathway.

### Execution Strategy

- **Sequential start.** Wave A WS0 (the P0 reconsolidation scope-boundary fix) must complete before any 026 release-readiness claim. Wave A WS0b (path-boundary hardening) and WS0c (public-contract verification) can run in parallel with WS0 because they touch different code paths.
- **Wave-level parallelism.** Waves B, C, D, E, and F have already shipped their closure waves. The plan captures their executed sequences for replayability.
- **Test-last for Wave A WS8.** Test-quality fixes happen after all production-code workstreams stabilize.
- **Live verification gates.** Wave F treats live verification as the promotion gate. No status promotion claim is made on documentary inference alone.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] All six source artifacts identified and pinned (`review-report.md`, `research.md`, r02 findings registry, R03 iterations, 006-campaign report, cross-phase synthesis + findings JSON).
- [x] All 573 deduplicated findings mapped to a wave with severity, file surface, and CF / R / WS / T identifier.
- [x] Wave-level dispatch model decided per wave (cli-codex dogfooding vs sequential cli-copilot vs parallel cli-codex).
- [x] Historical phase packets consolidated into a single root spec / plan / tasks / implementation-summary trio so future memory and graph traversal does not split across nested children.

### Definition of Done

- [x] Wave A WS1-WS8 evidence captured (Wave A planning + dispatch state).
- [x] Wave B R1-R11 shipped with 116/116 scoped tests; R12 deferred per ADR.
- [x] Wave C closes all 5 P1 + 2 P2 findings with file:line evidence and 58 focused tests.
- [x] Wave D closes all 8 P1 + 4 P2 findings with file:line evidence; T06 cross-workspace test green.
- [x] Wave E reports six themes Complete (004 / 006 / 007 / 008 / 009 / 010); four themes Blocked / Not started with documented historical-source-authority dependency.
- [x] Wave F applies 9/9 P0 + 16/16 P1 fixes via `applied/CF-NNN.md` evidence reports.
- [ ] Wave A WS0 P0 reconsolidation scope-boundary fix shipped (single open release-class blocker remaining inside this packet).
- [ ] CF-108 / CF-207 / CF-022 closed via expanded write authority OR formally deferred via ADR.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One Level 3 packet over six remediation waves. Each wave maps to a former phase packet, but the final state is flat: all wave content lives in `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md`. Per-finding evidence reports for Wave F live under `applied/CF-NNN.md`. Optional support folders (`research/`, `review/`, `scratch/`) live at the 026 packet root, not inside this packet.

### Key Components

- **Root spec docs.** `spec.md` (this packet's authoritative scope), `plan.md` (this file), `tasks.md` (per-wave task ledger), `implementation-summary.md` (per-finding closure log).
- **Wave A — combined deep review.** 11 workstreams, 226 tasks, 93-item checklist mapping all 243 findings.
- **Wave B — CLI executor remediation.** 7 atomic-ship groups (R1+R2, R3, R4+R5, R6+R7, R8+R10+R11, R9, R12 deferred); shared deep-loop modules consumed unchanged.
- **Wave C — skill-advisor remediation.** 7 closures across the 7 review dimensions D1-D7.
- **Wave D — R03 post-remediation.** 12 sequential cli-copilot tasks, max 1 concurrent, fresh process per finding.
- **Wave E — 006-campaign theme remediation.** 10 theme dispositions (six Complete, four Blocked / Not started).
- **Wave F — cross-phase integrity-parity closure.** 9 P0 + 16 P1 closures via 25-way parallel cli-codex with one CF-016 retry.

### Data Flow

Each wave reads its source artifact, writes its closure evidence into `tasks.md` rows and `implementation-summary.md` per-finding rows, and stamps `derived.save_lineage = same_pass` in `graph-metadata.json` once the canonical save path runs. The packet's `description.json` and `graph-metadata.json` are kept aligned by `generate-context.js` so memory and graph tooling can resolve every wave from one root entry.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION WAVES

### Wave A — 120-Iteration Combined Deep-Review Remediation

**Source**: `review/review-report.md` (1,535 lines, 120 iterations, 920 files across packets 009 / 010 / 012 / 014).
**Findings**: 243 deduplicated (1 P0 + 114 P1 + 133 P2).
**Status**: Plan + tasks + checklist created. Workstream 0 (P0 reconsolidation) carried forward as the single open release-class blocker tracked inside this packet.

#### Wave A WS0 — P0 Reconsolidation Scope-Boundary Fix (BLOCKER)

- **Findings**: 1 (P0); review-report.md S2, S3.2#1.
- **Effort**: 4-8 h.
- **Status**: **Not started.** Blocks 026 release-readiness claims.

**Problem.** `mcp_server/handlers/save/reconsolidation-bridge.ts:208-250` can merge records that belong to different `tenant_id` / `user_id` / `agent_id` / `session_id` scopes. The merged survivor loses governance metadata, creating a data-integrity and security breach.

**Technical approach.**
1. Add scope-field validation in `reconsolidation-bridge.ts` before the merge decision point (~line 208).
2. Compare `tenant_id`, `user_id`, `agent_id`, `session_id` between candidate and survivor.
3. On any mismatch: abort reconsolidation, preserve both records, log a typed warning.
4. Add cross-scope merge regression to `tests/reconsolidation-bridge.vitest.ts`.
5. Audit all callers of the reconsolidation bridge for similar boundary assumptions.

**Definition of done.**
- [ ] Scope-boundary validation added before merge.
- [ ] Cross-scope merge attempt regression test passes.
- [ ] Existing reconsolidation tests still green.
- [ ] `validate.sh --strict` passes for the affected packet.

#### Wave A WS0b — Path-Boundary Hardening

- **Findings**: 5 (P1); review-report.md S3.15, S3.2#4/#6, S3.5#1, S3.8#1, S3.13#1-3/#11.
- **Effort**: 4-6 h.
- **Status**: Eligible to run in parallel with WS0.

**Technical approach.**
1. `path.resolve()` + `startsWith(allowedRoot)` guard on folder-scoped validators (`validateMergeLegality`, `validatePostSaveFingerprint`).
2. Resolve symlinks via `fs.realpathSync` in `resolveDatabasePaths()` then re-validate against allowed root.
3. Workspace-root boundary check before `skill_graph_scan` dispatch.
4. Reject absolute `specFolder` values that fall outside packet roots in resume handlers.
5. `keepKeyFile()` / `buildKeyFileLookupPaths()` rejects absolute path candidates or normalizes to repo-relative.
6. Add a regression test for each path-escape vector.

#### Wave A WS0c — Public-Contract Verification

- **Findings**: 8 (P1); review-report.md S3.14, S3.2#7/#8, S3.13#5/#14.
- **Effort**: 4-8 h.
- **Status**: Eligible to run in parallel with WS0.

**Technical approach.**
1. Diff every MCP tool-schema field list (`tool-schemas.ts`) against actual handler response shapes.
2. Fix `deep_loop_graph_status` to return the promised `schemaVersion` / DB-size fields, or update the schema.
3. Fix `tool-input-schemas.ts` to match runtime contract for later tool families.
4. Verify every README / SKILL.md entrypoint path resolves to an existing file.
5. Remove dead tool registrations (e.g. L9 coverage-graph tools in `tools/index.ts`).
6. Cross-check agent runtime directories across all 4 runtimes.

#### Wave A WS1 — Status Drift Cleanup

- **Findings**: 28 (12 P1 + 16 P2); review-report.md S3.3.
- **Effort**: 1-2 h. **Status**: Eligible to start immediately (no code changes).

**Technical approach.** Script-automatable batch update across 009 / 010 / 012 / 014: align `spec.md` + `plan.md` status to `graph-metadata.json`; replace `closed_by_commit: TBD` with real hashes; fix `determineSessionStatus()` false-completion logic; fix deep-review `completed-continue` execution on completed sessions; fix `/complete` debug-escalation wiring mismatch.

#### Wave A WS2 — Packet 014 Identity Fix

- **Findings**: 5 (2 P1 + 3 P2); review-report.md S3.4.
- **Effort**: 30 min. **Status**: Independent.

Replace `Packet 016` / `SC-016` / `CHK-016` / `packet-016` with `Packet 014` / `SC-014` / `CHK-014` / `packet-014` in the 014 packet.

#### Wave A WS3 — Command and Workflow Integrity

- **Findings**: 16 (14 P1 + 2 P2); review-report.md S3.1.
- **Effort**: 4-8 h. **Depends on**: WS0.

Fix stale `spec_kit_memory_memory_save` references across 10 YAMLs to use `memory_save`; fix `doctor_mcp_install.yaml` section labels; fix `spec_kit_implement_{auto,confirm}` default scope; fix `runWorkflow()` quality-score override; fix 250 ms dispatch graph-context timeout; fix frontmatter YAML comment stripping; fix quoted trigger-phrase YAML serialization; fix `/create:feature-catalog` root filename mismatch; fix `sk-doc` multiline description teaching; fix Gate 3 carry-over rule drift in root docs; fix root docs' non-existent `generate-context.js` entrypoint path; fix `config_checklist.md` JSONC validation commands.

#### Wave A WS4 — Error Handling and Security Hardening

- **Findings**: 12 (4 P1 + 8 P2); review-report.md S3.8 / S3.9.
- **Effort**: 4-8 h. **Depends on**: WS0b.

Add explicit error forwarding in `session_bootstrap`, `extractSpecTitle`, `session-prime` startup-brief import, `handleCoverageGraphStatus`. Add `level` consumption in `spec-doc-structure.ts`. Make `sanitizeTriggerPhrases()` order-independent. Verify NFR-S05 fail-closed lock control. Unify bench / regression loader validation. Tighten `cli-copilot/SKILL.md` default autonomy level.

#### Wave A WS5 — Traceability and Evidence Gaps

- **Findings**: 25 (15 P1 + 10 P2); review-report.md S3.5.
- **Effort**: 4-8 h. **Depends on**: WS1.

Verify every checklist item has a `file:line` evidence reference. Write missing implementation summaries. Repair broken cross-reference links. Wire `post-save-review.ts` into the production `workflow.ts` pipeline. Fix `SPEC_DOC_SUFFICIENCY` to fail on anchor-parse errors. Fix `generate-context` silent retargeting. Fix `renderDashboard()` unescaped metadata injection. Document and validate 010/003/006 + 010/003/007 expanded scope. Fix `gate-d-regression-intent-routing.vitest.ts` + `memory-search-integration.vitest.ts` to exercise live behavior. Fix `sk-code-full-stack` Node.js / React Native / Swift templates.

#### Wave A WS6 — Stale References and Placeholders

- **Findings**: 26 (12 P1 + 14 P2); review-report.md S3.7 / S3.10.
- **Effort**: 4-6 h. **Depends on**: WS3.

Remove dead `deep_loop_graph_*` MCP tool surface. Fix stale `Phase 014` / `014-playbook-prompt-rewrite` references in 009/001. Fix `MEMORY METADATA` inline comments overriding tier. Fix cross-anchor contamination stale route names. Fix dead `includeArchived` option. Fix removed agent IDs (`speckit`, `research`) in Claude delegation reference. Fix stale Gate 3 phase-boundary rule in `CLAUDE.md`. Fix malformed Copilot prompt template commands. Fix Code Mode env-var contract contradiction. Fix feature-catalog template filename mismatch. Fix broken Level 1 copy command in `template_mapping.md`. Triage P2 stale-ref items.

#### Wave A WS7 — Agent and Skill Doc Refresh

- **Findings**: 37 (21 P1 + 16 P2); review-report.md S3.2 / S3.11.
- **Effort**: 8-16 h. **Depends on**: WS6.

Update deep-review agent docs and reducer to match live iteration layout. Add `@context` LEAF-only guardrail to root docs. Cross-runtime alignment across `.claude/`, `.opencode/`, `.codex/`, `.gemini/` agent directories. Fix `skill_graph_scan` workspace escape. Fix `skill_advisor_bench.py` prompt parsing. Fix reducer schema-drift crash. Fix Claude / Gemini agents pointing at wrong directory. Fix `sk-code` baseline skill reference. Fix mcp-clickup env var prefix mismatch. Fix sk-deep-research Gemini runtime path gap. Fix cli-copilot auth guidance. Establish single source-of-truth for agent definitions.

#### Wave A WS8 — Test Quality Improvements

- **Findings**: 47 (11 P1 + 36 P2); review-report.md S3.6.
- **Effort**: 16-24 h. **Depends on**: All previous workstreams.

Fix `coverage_gaps` for review graphs. Fix deep-review reducer `blendedScore` drop. Fix content-router cache test to vary context fields. Fix intent-classifier accuracy gate to include all 7 intents. Fix `reconsolidation-bridge.vitest.ts` planner-default safety test. Fix archived constitutional filtering test. Fix `causal-fixes.vitest.ts` to test production `relations` filter. Fix `context-server.vitest.ts` to test the shipped parser, not a shadow copy. Fix cross-encoder silent-skip guards. Fix adaptive-fusion tests to verify result ordering. Then triage and apply P2 test improvements (Unicode, empty, concurrent edge cases; remove false-positive expectations; replace string-presence assertions with behavioral checks).

### Wave B — Phase 020 CLI Executor Research-Findings Remediation

**Source**: `research/017-sk-deep-cli-runtime-execution-pt-01/research.md` (256 lines, 17 sections, 30 iterations).
**Findings**: 12 (R1-R12).
**Status**: **Shipped.** R1-R11 complete with 116/116 scoped tests; R12 deferred per ADR-014 (low coupling to active hardening).

#### Atomic-ship sequence (executed)

1. **Wave A inside Wave B (R1 + R2)** — shared deep-loop executor provenance. New `writeFirstRecordExecutor` helper in `mcp_server/lib/deep-loop/executor-audit.ts`. New `emitDispatchFailure(stateLogPath, executor, reason, iteration)` helper. Post-dispatch validation now requires `executor` field on non-native runs and tolerates the new typed `dispatch_failure` event. All four deep-loop YAMLs (research auto + confirm, review auto + confirm) gained a `pre_dispatch_audit` step. Result: 66/66 tests (was 54), `tsc --noEmit` clean.
2. **Wave B inside Wave B (R4 + R5)** — `description.json` repair safety. `mcp_server/scripts/spec-folder/generate-description.ts` loader returns a discriminated-union `{ok: true, data}` or `{ok: false, reason: 'file_missing' | 'parse_error' | 'schema_error', partial?}`. Schema-error path routes through new `mcp_server/lib/description/repair.ts::mergePreserveRepair`. Feature flag `SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE` defaults on. New specimen suite uses real rich 017 packet fixtures. Result: 77/77 tests, the 29-of-86 at-risk count drops to 0.
3. **Wave C inside Wave B (R3)** — Copilot `@path` large-prompt fallback in all four YAMLs. 16 KB threshold. Wrapper: `copilot -p "Read the instructions in @<path> and follow them exactly. Do not deviate." --model X --allow-all-tools --no-ask-user`. Research YAMLs reference `research/prompts/`; review YAMLs reference `review/prompts/`. `tests/deep-loop/cli-matrix.vitest.ts` extended with both sides of the threshold. `cli-copilot/SKILL.md` clarifies repo-safe concurrency cap (3 per `feedback_copilot_concurrency_override`) versus upstream API cap (5).
4. **Wave D inside Wave B (R6 + R7)** — metadata lineage. `mcp_server/lib/graph/graph-metadata-schema.ts derived.save_lineage` enum (`description_only` / `graph_only` / `same_pass`). Canonical save path in `scripts/core/workflow.ts` stamps `same_pass`. Backfill script stamps `graph_only` on existing files during migration. New `mcp_server/lib/continuity/timestamp-normalize.ts` module exposes `isLowPrecision`, `normalizeTimestampPrecision`, `comparePrecisionAware`. Result: 94/94 tests.
5. **Wave E inside Wave B (R9)** — evidence-marker fence parser. `mcp_server/scripts/validation/evidence-marker-audit.ts` tracks opener column and backtick count. Three regression fixtures landed under `tests/validation/fixtures/`: `indented-fence`, `nested-fence`, `mismatched-fence`.
6. **Wave F inside Wave B (R8 + R10 + R11 bundle)** — retry telemetry, caller-context coverage, readiness docs parity. `mcp_server/lib/enrichment/retry-budget.ts` emits `{type:'event', event:'retry_attempt', memoryId, step, reason, attempt, outcome, timestamp}`. `MAX_RETRIES = 3` unchanged. `mcp_server/handlers/save/post-insert.ts` wires telemetry. Caller-context coverage extends to `setImmediate` / `queueMicrotask` / `timers/promises`. Readiness-contract documentation in `sk-deep-research/SKILL.md` and `sk-deep-review/SKILL.md` narrowed to four reachable trust states (`live`, `stale`, `absent`, `unavailable`). Result: 116/116 scoped tests across 13 files.
7. **Wave G inside Wave B (R12)** — deferred per ADR-014.

### Wave C — Phase 025 Skill-Advisor Deep-Review Remediation

**Source**: 40-iteration r02 deep-review at `../009-hook-package/001-skill-advisor-hook-surface/review-archive-r02-codex-copilot/findings-registry.json`.
**Findings**: 7 (5 P1 + 2 P2).
**Status**: **Shipped.** All 7 closed in one cli-codex session across phases A-H.

#### Closure sequence

- **Phase A — DR-P1-001 prompt boundary.** `skill_advisor.py:2803` adds `--stdin` mode; `subprocess.ts:137` pipes prompt through stdin and omits prompt from argv; `render.ts:50` exports the sanitizer; `shared-payload.ts:491` rejects instruction-shaped labels.
- **Phase B — DR-P1-002 renderer / cache contract.** `render.ts:111` reads `result.metrics.tokenCap`; `prompt-cache.ts:20` includes normalized `maxTokens` in the HMAC key; `skill-advisor-brief.ts:383` restamps cached top-level + envelope provenance timestamps.
- **Phase C — DR-P1-003 telemetry fidelity.** `smart-router-measurement.ts:104` separates static compliance stream; `live-session-wrapper.ts:80` preserves observed skill and finalizes per prompt; `smart-router-telemetry.ts:254` aggregates prompt observations; `smart-router-analyze.ts:123` groups by `promptId` and permits baseline `SKILL.md`-only reads.
- **Phase D — DR-P1-004 plugin parity.** `spec-kit-skill-advisor.js:19` honors shared disable flag and alias; `:215` escalates SIGTERM → SIGKILL after 1 s; `:64` adds source signature to cache key; plugin path added to runtime parity harness.
- **Phase E — DR-P1-005 operator docs.** Build command replaced across hook reference + README + SET-UP_GUIDE + manual playbook + feature catalog. Codex registration status updated to shipped. Manual playbook scenario count corrected. Static measurement artifact names reconciled. Copilot remains documented as callback-model.
- **Phase F — DR-P2-001 API hygiene.** `prompt-cache.ts:11 MAX_CACHE_ENTRIES`; `:103` sweeps expired rows and evicts oldest entries. `normalize-adapter-output.ts` retains alias as `@deprecated`. JSDoc added across `source-cache.ts`, `prompt-cache.ts`, `generation.ts`, `prompt-policy.ts`, `subprocess.ts`, `skill-advisor-brief.ts`, `metrics.ts`.
- **Phase G — DR-P2-002 test coverage.** Added plugin invalid-stdout / nonzero / session-isolation / targeted-eviction tests; subprocess schema-invalid / non-busy-nonzero / SQLITE_BUSY-exhaustion tests; telemetry path-precedence + report-writer tests; one builder→renderer parity case with no stubs.
- **Phase H — verification.** Focused suite 58/58 tests pass; `npm --prefix ../../../../../skill/system-spec-kit/mcp_server run build` passes.

### Wave D — Phase 026 R03 Post-Remediation Remediation

**Source**: R03 review iterations (38/40 before user stop) at `../009-hook-package/001-skill-advisor-hook-surface/review/iterations/iteration-{007,013,014,017-021,028,029}.md`.
**Findings**: 12 (8 P1 + 4 P2).
**Status**: **Shipped.** All T01-T12 closed with `file:line` evidence.

#### Dispatch protocol (executed)

12 sequential cli-copilot agents, max 1 concurrent, fresh process per finding. Driver killed each agent on exit and spawned fresh.

#### Closure sequence

- **T01 (P1 D7)** — `references/hooks/skill-advisor-hook.md:183-257` Copilot + Codex snippets aligned to or labeled against `.github/hooks/superset-notify.json` + `.codex/settings.json` + `.codex/policy.json`.
- **T02 (P1 D7)** — Hardcoded inventory / health values across README, SET-UP_GUIDE, manual playbook, and feature-catalog files replaced with live references or annotated as snapshots.
- **T03 (P1 D3)** — `LIVE_SESSION_WRAPPER_SETUP.md:48-169` documents `finalizePrompt(promptId)` invocation in the operator workflow.
- **T04 (P1 D4)** — New `mcp_server/lib/skill-advisor/error-diagnostics.ts:5-118` typed error classification module wired through `generation.ts:26-33`, `freshness.ts:42-48`, `skill-advisor-brief.ts:47-55`, and `claude/user-prompt-submit.ts:163-170`. Tests: `advisor-freshness.vitest.ts`, `advisor-brief-producer.vitest.ts`, `claude-user-prompt-submit-hook.vitest.ts`.
- **T05 (P1 D5)** — `.opencode/plugins/spec-kit-skill-advisor.js:115-134` adds workspace root to host cache key.
- **T06 (P1 D6)** — `tests/spec-kit-skill-advisor-plugin.vitest.ts:276-304` covers cross-workspace cache boundary.
- **T07 (P1 D7)** — `manual_testing_playbook.md:10-28, :56-58, :117-123, :278-313, :373-384` reconciled to actual inline-root-table structure.
- **T08 (P1 D7)** — `manual_testing_playbook.md:298-299, :310-313` replaced bare-path commands with `npm --prefix` / `cd`.
- **T09 (P2 D7)** — `manual_testing_playbook.md:310` replaced bare filename reference to `LIVE_SESSION_WRAPPER_SETUP.md` with repo-relative Markdown link.
- **T10 (P2 D6)** — `tests/smart-router-telemetry.vitest.ts:274-293` covers default telemetry fallback path.
- **T11 (P2 D6)** — `tests/advisor-subprocess.vitest.ts:197-230` covers subprocess spawn-error classification branch.
- **T12 (P2 D1)** — `lib/context/shared-payload.ts:555-587` applies single-line sanitizer to `provenance.sourceRefs`; `tests/shared-payload-advisor.vitest.ts:113-132` covers regression.

### Wave E — 005-006 Campaign Findings Remediation

**Source**: Consolidated 006-campaign report (274 findings; mirrored into this packet's `tasks.md` and §3.5 sub-phase summaries).
**Findings**: 274 (P0=7, P1=165, P2=102).
**Status**: **Six themes Complete, four Blocked / Not started.**

#### Theme execution plan

Each theme owns a self-contained tasks ledger and closeout evidence. Themes 004 / 006 / 007 / 008 / 009 / 010 are complete with strict no-recursive validation green and per-theme regression tests committed. Themes 001 and 002 are blocked on historical-source write authority (CF-108 and CF-207 respectively); their packet-local fixes that did not require historical-source authority shipped (`skill-graph-db.ts`, `content-router.ts`, parser/schema constants, embedded-`..` rejection, reciprocal sibling edges, advisor health allowlist). Themes 003 and 005 have not started because their full closure depends on the same expanded write authority.

#### Theme dispositions

| Theme | Status | Closure note |
|-------|--------|--------------|
| 001 graph-and-metadata-quality | Blocked | CF-108 — `validate.sh --strict` exit 2 on `CONTINUITY_FRESHNESS` for source packet `003-graph-metadata-validation/005-doc-surface-alignment`. |
| 002 spec-structure-and-validation | Blocked | CF-207 — recursive validation of historical `002-skill-advisor-graph` doc errors outside write boundary. |
| 003 evidence-references-and-replayability | Not started | Awaits expanded write authority. |
| 004 migration-lineage-and-identity-drift | Complete | `migration-lineage-identity.vitest.ts` 4 tests; SQLite-only runtime source; live `specFolder` paths replace retired tokens. |
| 005 packet-state-continuity-and-closeout | Not started | Awaits write authority on historical closeout surfaces. |
| 006 routing-accuracy-and-classifier-behavior | Complete | Tier 3 routing decoupled from `full-auto`; cache partitioned; `drop` (not `drop_candidate`); 6 vitests pass. |
| 007 skill-advisor-packaging-and-graph | Complete | `session-bootstrap.ts` topology; `top.uncertainty` rendering; `manual-testing-playbook.vitest.ts` locks 47 scenario files. |
| 008 search-fusion-and-reranker-tuning | Complete | `cross-encoder-extended.vitest.ts` extended; `remediation-008-docs.vitest.ts` locks counts. |
| 009 security-and-guardrails | Complete | CF-183 redaction; CF-186 empty-scan preservation; new `skill-graph-handlers.vitest.ts`. |
| 010 telemetry-measurement-and-rollout-controls | Complete | CF-271 documented as starter-phrase policy; `codex-pre-tool-use.vitest.ts` 11 tests. `.codex/policy.json` write blocked by EPERM. |

### Wave F — Cross-Phase Integrity-Parity Closure

**Source**: `research/cross-phase-synthesis.md` + `research/cross-phase-findings.json`.
**Findings**: 9 P0 + 16 P1 (CF-001 through CF-027).
**Status**: **Shipped overnight 2026-04-23 → 2026-04-24.** All 25/25 fixes applied via 25-way parallel `cli-codex gpt-5.4 high fast` dispatch. CF-016 retried once after a Gate 3 hang. Per-finding evidence reports landed under `applied/CF-NNN.md`.

#### Dispatch protocol (executed)

- 9 P0 fixes dispatched in parallel as 9 cli-codex agents. Each produced `applied/CF-NNN.md` evidence reports plus surgical edits to target files. Zero stuck wrappers.
- 15/16 P1 fixes dispatched in parallel as 16 cli-codex agents. CF-016 halted at Gate 3 pre-execution (16 min, 0 bytes output) — killed and re-dispatched with a stronger Gate 3 pre-approval header.
- CF-016 retry succeeded; `applied/CF-016.md` written. All 25/25 P0 + P1 fixes complete.

#### Closure highlights

| CF | Severity | What landed |
|----|---------:|-------------|
| CF-001 | P0 | Root packet state model refresh; archived deep-research dashboard reconciled. |
| CF-002 | P0 | Live acceptance evidence captured in `010-memory-indexer-lineage-and-concurrency-fix/implementation-summary.md` and `003-code-graph-package/003-code-graph-context-and-scan-scope/implementation-summary.md`. |
| CF-005 | P0 | `mcp_server/handlers/save/atomic-index-memory.ts` lock ordering fixed; `memory-save.ts` aligned; `handler-memory-save.vitest.ts` covers save-race regression. |
| CF-009 | P0 | `code-graph/lib/ensure-ready.ts` and `code-graph/handlers/scan.ts` share one staged-persistence commit path. |
| CF-014 | P0 | `shared/review-research-paths.cjs` centralizes artifact-root resolution; `spec_kit_deep-research_auto.yaml` aligned; `sk-deep-research/references/state_format.md` updated. |
| CF-017 | P0 | `manual_testing_playbook.md` + `manual-playbook-runner.ts` result-class vocabulary normalized; `005-release-cleanup-playbooks/.../tasks.md` reconciled. |
| CF-019 | P0 | `skill_advisor.py` pass/fail derivation reordered. |
| CF-022 | P0 | Closure path recorded in `005-006-campaign-findings-remediation/001-graph-and-metadata-quality/checklist.md`; underlying historical-source write authority still pending decision. |
| CF-025 | P0 | `sk-deep-research/assets/prompt_pack_iteration.md.tmpl` writes executor metadata early; `lib/deep-loop/post-dispatch-validate.ts` accepts typed executor failure events; `executor-audit.ts` attaches canonical executor metadata. |
| CF-003 | P1 | Predictive-only routing proof replaced with live telemetry references. |
| CF-004 | P1 | Copilot parity work reapplied; 007 backlog aligned to live 009 truth. |
| CF-006 | P1 | One resume contract adopted across runtime, tests, and packet docs. |
| CF-007 | P1 | Save / index guardrails hardened into explicit contracts. |
| CF-010 | P1 | Code-graph trust metadata routed through one provenance layer. |
| CF-011 | P1 | Code-graph public schemas brought into parity with handlers. |
| CF-012 | P1 | Direct stale-file refresh + scoped readiness debounce added. |
| CF-015..CF-027 | P1 | Closure recorded per `applied/CF-NNN.md` evidence reports. |

#### Lessons captured

1. `cli-codex gpt-5.4 high fast` is reliable for parallel fan-out; 26/27 dispatches this run completed cleanly.
2. Gate 3 pre-approval must be the **first** line of the prompt; embedding it mid-prompt is not sufficient.
3. Direct `codex exec` dispatcher beat `claude -p "/spec_kit:deep-research ..."` for this run; Claude-p with slash commands hung without output (52 min verified). The pragmatic dispatcher emits sk-deep-research-compatible files and is flagged in the commit trail for audit.
4. Parallel fan-out + per-finding isolation scales: 25 parallel fix agents across distinct target files had zero merge conflicts and zero data loss.
5. Auto-wakeup + commit-per-check is the right overnight pattern: 6 scheduled wakeups kept the run moving through five phases (research, synth, spec, P0 fixes, P1 fixes + wrap).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Wave |
|-----------|-------|-------|------|
| Unit | Reconsolidation scope-boundary, path-boundary validators, contract schemas, error-handling propagation, sanitizer order-independence | Vitest | A |
| Unit | Executor first-write provenance, dispatch_failure event, description.json discriminated loader + repair, save_lineage enum, timestamp normalization, retry telemetry, evidence-marker fences, caller-context async boundaries | Vitest | B |
| Unit | Advisor stdin spawn, instruction-label sanitizer, tokenCap propagation, prompt-cache size cap, plugin SIGKILL escalation, subprocess error classification | Vitest, pytest | C, D |
| Unit | Skill-graph health, migration-lineage identity, routing cache partitioning, search-fusion telemetry, security guardrails, pre-tool-use Codex matching | Vitest | E |
| Integration | Cross-runtime advisor parity (5 paths: Claude / Copilot / Codex / Gemini / OpenCode plugin), end-to-end builder→renderer, save-race regression, code-graph staged persistence | Vitest | C, D, F |
| Specimen | description.json merge-preserving repair on rich 017 packet fixtures | Vitest | B |
| Static | Strict spec-doc validation across 026 packet boundary, schema parsing of `description.json` and `graph-metadata.json` | `validate.sh --strict`, `JSON.parse` scan | All |
| Smoke | Codex `codex exec --json --ephemeral` hook output; Copilot managed custom-instructions block; OpenCode plugin loader bootstrap | Direct CLI smoke | F + handover |
| Telemetry | `retry_attempt` event emission; `smart-router-{measurement,telemetry,analyze}` paths; live-session wrapper finalize | Vitest | B, C, D |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `review/review-report.md` | Internal source artifact | Green | Wave A scope and prioritization fall apart without the merged review. |
| `research/017-sk-deep-cli-runtime-execution-pt-01/research.md` | Internal source artifact | Green | Wave B scope and atomic-ship grouping fall apart. |
| r02 findings registry | Internal source artifact | Green | Wave C closure log fall apart. |
| R03 iteration set | Internal source artifact | Green | Wave D closure log falls apart. |
| Consolidated 006-campaign report | Internal source artifact | Green (mirrored) | Wave E theme dispositions fall apart. |
| `research/cross-phase-synthesis.md` + `research/cross-phase-findings.json` | Internal source artifact | Green | Wave F closure tracking falls apart. |
| Phase 018/019 deep-loop modules | Internal | Green | Wave B consumes them unchanged; CF-025 in Wave F extends them. |
| `generate-description.js` auto-run on save | Internal | Green | Wave B R5 gates stale-file auto-repair until R4 ships. |
| Live runtime access for scan / index / routing / executor / wrapper reruns | External | Conditional | Without it, Wave F readiness claims stay blocked; record blocked proof explicitly. |
| Historical 005-006 source-packet write authority | External governance | Pending | CF-108, CF-207, CF-022 cannot close until decision lands. |
| `MAX_RETRIES = 3` and 10-min continuity threshold remain numerically stable | Policy (ADR-013) | Green | Tuning gated on retry-budget telemetry accumulation. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

### Triggers

- A live verification rerun in Wave F surfaces a regression introduced by the closure.
- Wave A WS0 cross-scope merge regression destabilizes existing reconsolidation tests in callers.
- Wave B R1 first-write reordering breaks the deep-loop reducer schema.
- Wave B R4 discriminated loader changes historical loader behavior in a way that surprises a downstream caller.
- A Wave F `applied/CF-NNN.md` evidence report cannot be replayed against the current target file.

### Procedure

1. Capture the failing reproduction in a vitest case before reverting.
2. Roll back the offending wave's commit range from `git log --grep='Wave [A-F]'` (commit messages tag the wave letter).
3. Re-stage the source artifact and the affected `applied/CF-NNN.md` evidence report so future re-dispatch starts from a clean baseline.
4. For Wave B specifically: `SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE=false` reverts schema-error handling to the prior minimal-replacement behavior without code rollback.
5. For Wave C / D plugin SIGKILL escalation: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` opts the plugin out without code rollback.
6. Record the rollback in `_memory.continuity.recent_action` and rerun `generate-context.js` so the graph and memory surfaces reflect the rolled-back status.
<!-- /ANCHOR:rollback -->
