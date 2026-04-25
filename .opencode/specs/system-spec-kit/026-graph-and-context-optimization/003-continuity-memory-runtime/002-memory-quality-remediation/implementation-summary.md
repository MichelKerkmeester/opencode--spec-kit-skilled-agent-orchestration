---
title: "...6-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/implementation-summary]"
description: "Parent packet closeout summary for the completed five-phase remediation train across PR-1 through PR-11."
trigger_phrases:
  - "memory quality parent implementation summary"
  - "five phase closeout summary"
  - "pr1 pr11 packet summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/002-memory-quality-remediation"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["implementation-summary.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: Memory Quality Backend Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-memory-quality-remediation |
| **Completed** | 2026-04-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet moved all the way from research findings to a validated, phase-by-phase remediation train. You can now trace the complete D1-D8 repair path across five child phases, see which PRs landed in each slice, and verify the outcome from phase-local checklists instead of relying on a stale research-only parent snapshot. The packet also closed the operational tail honestly: PR-10 stops at dry-run classification in this packet, and PR-11 is explicitly deferred rather than implied.

The later memory-redundancy research does not reopen Phases 1-5. Instead, it narrows any future follow-on work to compact-wrapper and canonical-doc-ownership surfaces, while this parent packet remains the long-form closeout owner for the shipped remediation train.

### Phase 10 — Memory save heuristic calibration

Phase 10 is implemented and closes the remaining live-save defects that survived the earlier train: explicit `title`, `description`, and `causalLinks` now survive structured saves; manual trigger phrases stay authoritative through the runtime path; V8 and V12 validator behavior is calibrated; D5 linker and reviewer logic share one continuation contract; and the packet proves the fix with a rebuilt dist entrypoint plus a real parent-folder save. This phase is the follow-on cleanup lane for the remaining post-`009` save-path defects, not a reopening of the earlier PR-1 through PR-11 closure work.

### Phase 1 — PR-1 and PR-2

Phase 1 fixed the OVERVIEW anchor mismatch and replaced the raw truncation clamp with a shared boundary-aware helper. That closed D8 and D1, exported the helper for later phases, and established the foundation the rest of the train reuses.

### Phase 2 — PR-3 and PR-4

Phase 2 made `importance_tier` single-owner across the save path and added provenance-only JSON-mode enrichment. That closed D4 and D7 without reopening broader capture-mode behavior.

### Phase 3 — PR-5 and PR-6

Phase 3 introduced the trigger-phrase sanitizer, topic-adjacency guardrails, and the authored-decision precedence gate. That closed D3 and D2 while preserving degraded-payload fallback where it still belongs.

### Phase 4 — PR-7, PR-8, and PR-9

Phase 4 added conservative predecessor discovery for continuation saves, replaced overloaded `_source` mode branching with `SaveMode`, and upgraded the reviewer so it can detect both broken fixtures and a clean post-fix baseline. That closed D5 and turned the packet into a guarded pipeline rather than a collection of isolated bug fixes.

### Phase 5 — PR-10 and PR-11 tail decisions

Phase 5 finished the packet operationally. It published the telemetry artifacts around the Phase 4 reviewer, generated the PR-10 historical-migration dry-run report, and documented the PR-11 defer decision with explicit reopen triggers. In this packet, PR-10 remains dry-run-only and PR-11 remains deferred.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Sub-phases 001–005 (merged) | Merged into `implementation-summary.md §Sub-phase summaries` | Closed D1 and D8 (Phase 1); D4 and D7 (Phase 2); D3 and D2 (Phase 3); D5 + SaveMode + reviewer guardrails (Phase 4); telemetry + PR-10 dry-run + PR-11 defer (Phase 5) |
| Sub-phases 006–010 (merged) | Merged into `implementation-summary.md §Sub-phase summaries` | Compact-wrapper runtime (Phase 6); downstream parity sync (Phase 7); fast-path fix (Phase 8); render-layer fixes (Phase 9); heuristic calibration (Phase 10) |
| `spec.md` | Modified in this pass | Recast the parent packet as a completed implementation packet |
| `checklist.md` | Modified in this pass | Linked packet-level claims to phase-local CHK evidence |
| `implementation-summary.md` | Modified in this pass | Replaced the research-only narrative with the final closeout story |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The train shipped in the order the parent packet planned. Foundation fixes landed first, then the single-owner metadata repairs, then the behavior-sensitive trigger and decision work, then the larger refactor and reviewer guardrail phase, and finally the operational tail. This pass finished the documentation side of the packet by validating Phases 2-5 cleanly under the strict spec validator, synchronizing the phase-local checklists with those results, and rolling the child evidence back into the parent docs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the packet split into five child phases instead of collapsing the closeout back into one parent story | The child folders now carry the clearest verification evidence, and the parent packet is most useful as a roll-up surface. |
| Keep future redundancy follow-on work narrow | The sibling redundancy research found the remaining duplication problem in memory generation and template composition, so any new work should target compact-wrapper and canonical-doc-ownership seams rather than reopen the shipped D1-D8 phases. |
| Treat PR-10 dry-run as complete work for this packet, but not PR-10 apply | Phase 5 deliberately made apply operator-gated, so claiming more than the dry-run would overstate what actually shipped. |
| Record PR-11 as deferred | The D9 candidate is real enough to keep visible, but not urgent enough to pretend it shipped without supporting concurrency pressure. |
| Leave the remaining parent strict-validation blockers explicit | The remaining parent failures now live in out-of-scope packet files, so the honest result is "child phases green, parent root still partially blocked." |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Phase 1 strict validation (prior wave) | PASS — `001-foundation-templates-truncation` validated cleanly; served as clean baseline |
| Phase 2 strict validation | PASS — `002-single-owner-metadata` validated cleanly |
| Phase 3 strict validation | PASS — `003-sanitization-precedence` validated cleanly |
| Phase 4 strict validation | PASS — `004-heuristics-refactor-guardrails` validated cleanly |
| Phase 5 strict validation | PASS — `005-operations-tail-prs` validated cleanly |
| Phase 1 checklist | Verified — evidence consolidated in `implementation-summary.md §001-foundation-templates-truncation` |
| Phase 2 checklist | Verified — evidence consolidated in `implementation-summary.md §002-single-owner-metadata` |
| Phase 3 checklist | Verified — evidence consolidated in `implementation-summary.md §003-sanitization-precedence` |
| Phase 4 checklist | Verified — evidence consolidated in `implementation-summary.md §004-heuristics-refactor-guardrails` |
| Phase 5 checklist | Verified — evidence consolidated in `implementation-summary.md §005-operations-tail-prs` |
| Parent strict validation | Still blocked by out-of-scope packet-root `plan.md`, `tasks.md`, and a saved `memory/` artifact (partially remediated in the deep-review cycle — see §Deep-Review Remediation Cycle below) |
<!-- /ANCHOR:verification -->

---

**Deep-Review Remediation Cycle (2026-04-08)**

A 7-iteration `/spec_kit:deep-review` ran against this packet on 2026-04-08, delegating every iteration to `cli-codex exec` with `gpt-5.4` reasoning=high service_tier=fast and a read-only sandbox. The consolidated remediation evidence now lives in this section plus the child phase packets that captured the landed fixes.

**Review verdict:** `FAIL` — 0 P0, 13 P1, 9 P2 (22 total active findings, no blockers).

**Remediation execution:** All 22 findings landed on branch `system-speckit/026-graph-and-context-optimization-remediation` via 4 targeted codex workstreams (workspace-write sandbox). Phase-4 vitest suite + sibling memory-quality tests remain green after the code fixes.

### Workstream summary

| Workstream | Commit | Scope | Findings | Files |
|------------|--------|-------|---------:|------:|
| **RW-B Parent rollup normalization** | `bc7754ef0` | Parent + 005 + 006 + 007 doc drift | 6 P1 (P1-004, P1-006, P1-007, P1-011, P1-012, P1-013) | 7 |
| **RW-A Shipped-code bug fixes** | `93c415203` | TypeScript source under `.opencode/skill/system-spec-kit/scripts/` | 6 P1 (P1-001, P1-002, P1-003, P1-008, P1-009, P1-010) | 5 |
| **RW-C Telemetry/alert contract reconciliation** | `599449409` | Phase 5 telemetry-catalog.md + memory-save-quality-alerts.yml | 1 P1 (P1-005) | 2 |
| **RW-D P2 advisory cleanup** | `2de224c79` | Phase 1 docs + parent checklist + Phase 5 docs + sanitizer + PR-7 gate + PR-10 wording | 9 P2 (P2-001..P2-009) | 9 |

### P1 Fixes Landed (13 of 13)

**Shipped-code cluster (RW-A):**
- **P1-001** `truncate-on-word-boundary.ts:22` — whitespace-free inputs now use code-point-safe hard truncation reserving ellipsis room
- **P1-002** `workflow.ts` — `leafFolderAnchor` now flows through `sanitizeTriggerPhrases()` instead of being appended after sanitization
- **P1-003** `decision-extractor.ts:205` — raw `keyDecisions` entries validated before gaining authority; `JSON.stringify(manualObj)` fallback removed; lexical fallback only suppressed when a valid authored decision survives
- **P1-008** `post-save-review.ts` + `workflow.ts:1897` — `reviewPostSaveQuality()` now accepts in-memory rendered content (backward compatible); eliminates post-write disk reread on the hot path
- **P1-009** `find-predecessor-memory.ts` — title-family affinity guard (50% normalized token overlap) + explicit-marker support prevents fabricating lineage from unrelated siblings
- **P1-010** `post-save-review.ts` + `workflow.ts:1909` — added `REVIEWER_ERROR` status for unexpected failures; workflow emits D10/HIGH structured warnings; intentional `SKIPPED` stays info-level

**Parent-rollup cluster (RW-B):**
- **P1-004** parent `spec.md:83` phase map for Phases 2-5 — status qualified to `Phase-local complete, parent gates pending` with explanatory footnote
- **P1-006** Phase 5 spec + implementation-summary — Phase 5 phase-local closeout separated from blocked parent closeout
- **P1-007** parent `plan.md` + `tasks.md` — ⚠️ SUPERSEDED BY PHASES 1-5 banners added; `T101-T502` NEXT-PLAN placeholders converted to `SUPERSEDED` pointers at owning phase folders
- **P1-011** parent `spec.md:88` — Phase 7 row upgraded from `Pending` to the same qualified shipped label as Phases 2-5 (Phase 7 child docs claimed complete)
- **P1-012** Phase 6 normalized to **placeholder** state — Phase 6 checklist shipped-evidence rows unchecked and marked preview-only; Phase 6 implementation-summary + tasks were already placeholder and left as-is
- **P1-013** parent `spec.md:105` — explicit Phase 5→6 and 6→7 handoff-waiver footnote added immediately after the handoff criteria table

**Operator contract cluster (RW-C):**
- **P1-005** Phase 5 telemetry-catalog + memory-save-quality-alerts YAML — direction **B (YAML-wins)** chosen because `emitMemoryMetric()` only emits scalar metric values, not histograms/quantiles. Catalog rewritten to describe current scalar alert semantics; bucket-share/ratio/p95 formulas preserved as "future enhancement" notes. Draft label removed from YAML. Both docs now describe the same contract.

### P2 Fixes Landed (9 of 9) — RW-D

- **P2-001** Phase 1 implementation-summary — stable anchor citation replaces stale line-number reference
- **P2-002** Phase 1 plan + tasks — migration order aligned (input-normalizer first, then D1 owner)
- **P2-003** `scripts/lib/trigger-phrase-sanitizer.ts` — generic prefilter added: NFC normalization + max-length cap (200) + control-char rejection (`/[\x00-\x1F\x7F-\x9F]/`)
- **P2-004** parent `checklist.md:65` D6 row — replaced non-owning Phase 4 citation with historical-classification reference + Phase 5 safe-subset evidence
- **P2-005** parent `checklist.md` CHK-003/010/050/051 — relabeled as explicit parent-level assertions instead of pretending to be phase-backed
- **P2-006** Phase 5 spec + plan — alert artifact path normalized to shipped phase-local `memory-save-quality-alerts.yml` (no `monitoring/` prefix)
- **P2-007** `scripts/core/workflow.ts:~1392` — predecessor discovery gate narrowed with `SaveMode.Json` check; manual saves no longer pay the directory-walk cost
- **P2-008** Phase 5 legacy PR-10 dry-run classifier note retained as retired post-routing refactor; Phase 5 spec + plan `--apply` wording cleaned to "dry-run only (apply mode deferred)"
- **P2-009** parent `checklist.md:106` — P0 count corrected from `5/6` to `6/6`

### Verification After Remediation

| Check | Result |
|-------|--------|
| TypeScript type check (`tsc --noEmit --project scripts/tsconfig.json`) | **Clean** |
| Phase 4 PR-7 vitest (`memory-quality-phase4-pr7.test.ts`) | **Pass** |
| Phase 4 PR-9 vitest (`memory-quality-phase4-pr9.test.ts`) | **Pass** (18/18) |
| Phase 1 memory-quality vitest (`memory-quality-phase1.vitest.ts`) | **Pass** |
| Phase 2 memory-quality vitest (PR-3 + PR-4 test files) | **Pass** |
| Phase 3 memory-quality vitest (PR-5 + PR-6 test files) | **Pass** |
| Phase 6 memory-quality vitest (extractors/migration/template/trigger) | **Pass** |
| `post-save-review.vitest.ts` | **Pass** (with minor return-shape compatibility tweak in RW-A) |
| Trigger-phrase sanitizer tests | **Pass** |
| YAML parse check on `memory-save-quality-alerts.yml` | **Pass** |

### Known Follow-Ups (Deferred, Not Blocking This Cycle)

- Legacy direct callers of `reviewPostSaveQuality()` still fall back to file read when they don't pass `content`. Full removal requires updating those callers + tests in a follow-up. RW-A kept the change backward-compatible.
- The P1-009 title-family overlap threshold is 50% — tune if edge cases surface in mixed-topic folders.
- P2-008 PR-10 fixture-locked test harness was explicitly deferred — only a documenting code comment was added in this cycle.
- The parent `COMPLEXITY_MATCH` strict-validator warning (`Tasks (3) below minimum (4) for Level 2`) is a historical content-shape warning not targeted by any of the 22 deep-review findings; remains open.
- Memory causal-link `supersedes` heuristic warns on continuation-style titles (D5 MEDIUM from post-save-reviewer). Related to P1-009 but scoped separately — the new title-family guard in `find-predecessor-memory.ts` should reduce false positives; follow up if the warning persists.

### Reviewer Delegation Record

Per project memory rule (2026-04-08), all deep-review remediation `codex exec` invocations after RW-C use explicit flags:

```bash
/opt/homebrew/bin/codex exec --skip-git-repo-check --ephemeral --full-auto \
  -m gpt-5.4 -c model_reasoning_effort='"high"' -c service_tier='"fast"' \
  -C <repo-root> -o <output-file> - < <prompt-file>
```

RW-B and RW-A inherited `service_tier=fast` from `~/.codex/config.toml`; RW-C and RW-D pass it explicitly. Sandbox was `workspace-write` (auto-promoted by `--full-auto`) for write workstreams; review iterations earlier the same day used `read-only`.

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Parent strict validation is not yet fully green.** The remaining blockers sit in out-of-scope packet-root files and a saved `memory/` document, not in the scoped files updated here.
2. **PR-10 does not include apply-time results in this packet.** The dry-run classification exists, but no historical-file rewrite should be described as complete.
3. **PR-11 remains deferred.** The packet captures the rationale and reopen triggers, but not a shipped lock-hardening implementation.
4. **One packet-level historical diff artifact is explicitly deferred.** The parent checklist CHK-030 (P2) was formally deferred rather than produced in this packet. Producing 3 before/after sample-memory-save diffs would have required running PR-10 `--apply` against real historical files, which is itself explicitly deferred. The dry-run classification report (formerly at Phase 5 scratch/pr10-dry-run-report.json) served as the closest available evidence; that sub-phase folder has been merged into this summary. Reopen if PR-10 apply ships.
<!-- /ANCHOR:limitations -->

---

## Sub-phase summaries

### 001-foundation-templates-truncation

**Status:** Complete (2026-04-07). Closed D1 and D8 — the two P0 defects at the remediation train foundation.

- Renamed OVERVIEW block comment markers from `summary` to `overview` in the context template; aligned `memory-template-contract.ts` and `memory-parser.ts` (backward-compatible regex accepts both terminators).
- Created `truncateOnWordBoundary()` shared helper pinned to U+2026 ellipsis; migrated `input-normalizer.ts` and `collect-session-data.ts` to use it.
- Verification: 7/7 helper unit tests, 2/2 Phase 1 fixture suite, all regression suites green; `validate.sh --strict` PASS.
- Key decision: parser regex accepts both legacy `summary` and new `overview` terminators to preserve backward compatibility with pre-PR-1 memory files.

### 002-single-owner-metadata

**Status:** Complete (2026-04-08). Closed D4 (importance-tier drift) and D7 (JSON-mode provenance gap).

- `session-extractor.ts` became the authoritative tier resolver; `frontmatter-migration.ts` rewrites both frontmatter and bottom metadata block from the same resolved value; `post-save-review.ts` now fails loudly on drift.
- JSON-mode saves pick up `head_ref`, `commit_ref`, and `repository_state` through a narrow provenance-only insertion that leaves authored summaries untouched.
- Verification: PR-3 and PR-4 vitest suites PASS; two fixture replays PASS; `checklist.md` CHK-210–CHK-227.
- Key decision: provenance insertion is narrow by design — reusing the capture-mode merge path would contaminate JSON-mode saves with summary content.

### 003-sanitization-precedence

**Status:** Complete (2026-04-08). Closed D3 (garbage trigger phrases) and D2 (generic decision text).

- Created `trigger-phrase-sanitizer.ts` encoding empirical D3 junk-class and allowlist rules; integrated into `workflow.ts` while preserving `ensureMinTriggerPhrases()` low-count fallback.
- `semantic-signal-extractor.ts` rejects non-adjacent synthetic bigrams; `decision-extractor.ts` now gates lexical fallback behind authored-array precedence (degraded-payload fallback preserved).
- Verification: sanitizer vitest, PR-5 and PR-6 fixture suites PASS; degraded-payload regression fixture confirmed; `checklist.md` CHK-001–CHK-024.
- Key decision: lexical fallback not globally disabled — only suppressed when authoritative arrays exist.

### 004-heuristics-refactor-guardrails

**Status:** Complete (2026-04-08). Closed D5 and delivered SaveMode refactor plus reviewer guardrails.

- Created `find-predecessor-memory.ts` with conservative continuation-signal gating and ambiguity skip.
- Created `save-mode.ts` replacing raw `_source === 'file'` control flow with explicit `SaveMode` (`Json` / `Capture` / `ManualFile`).
- `post-save-review.ts` now exercises CHECK-D1 through CHECK-D8 on broken fixtures and stays silent on clean F-AC8.
- Verification: PR-7 and PR-9 vitest PASS (18/18); regression smoke over Phase 1–3 fixtures PASS; `checklist.md` CHK-010–CHK-062.
- Key decision: predecessor discovery conservative and ambiguity-safe — omission preferred over fabricated lineage.

### 005-operations-tail-prs

**Status:** Complete phase-local (2026-04-08); parent gates pending. Covered PR-10 dry-run and PR-11 defer.

- Created telemetry-catalog, memory-save-quality-alerts YAML, release-notes draft, and PR-11 defer rationale artifacts (now removed with sub-phase folder).
- PR-10: dry-run-only historical migration classifier shipped; apply mode explicitly deferred. Legacy script removed post-routing refactor; dry-run report remains as evidence artifact.
- PR-11: deferred with rationale — D9 candidate real but no concurrency-pressure justification for speculative hardening.
- Verification: phase `validate.sh --strict` PASS; parent still exits 2 due to out-of-scope plan/tasks drift.

### 006-memory-duplication-reduction

**Status:** Complete (2026-04-08). Shipped compact retrieval-wrapper runtime.

- Compact-wrapper contract: the context template uses comment anchors as structural source of truth; parser and anchor extractor aligned; `DUP1–DUP7` reviewer checks added.
- Trigger sanitizer blocks stale junk (`and`, `graph`) and canonicalizes aliases while preserving short useful anchors (`api`, `cli`, `mcp`).
- Extractor guards: blank observation headings, repeated decision propositions, FILES carrier row dedup, `Last:` word-boundary trimming. Some extractor fixtures remain `TODO(003-006)` skipped pending migration to compact-wrapper shape.
- PR-13 bounded migration CLI: dry-run proved `87/117` stale residual files, `425` removed triggers, `2` useful anchors preserved.
- Verification: 4 Phase 6 suites PASS (3 passed, 9 skipped); Phase 1–4 regression smoke PASS (32/1 skipped); `validate.sh --strict` PASS.

### 007-skill-catalog-sync

**Status:** Complete phase-local (2026-04-08); parent git-status gate blocked.

- Ten sequential review iterations across ten downstream surfaces; 13-row update matrix synthesized in the phase-local review report.
- Sub-PR-14: 4 P0 updates applied (template guide, save.md command, MCP regression fixtures, overview anchor alignment).
- Sub-PR-15: 8 P1 updates applied (SKILL.md, references, README, agent handover guidance).
- P2 environment-variables wording deferred (cosmetic, documented in review-report).
- Verification: regression suite PASS (11 files, 45 tests); Phase 7 `validate.sh --strict` PASS (`EXIT:0`); parent git-status gate blocked by unrelated pre-existing changes.

### 008-input-normalizer-fastpath-fix

**Status:** Complete (2026-04-08). Fixed JSON-mode fast-path normalizer.

- `normalizeInputData()` now coerces string `user_prompts`, `observations`, and `recent_context` to structured shapes; merges `sessionSummary`, `keyDecisions`, `nextSteps`, `filesModified`, `toolCalls`, `exchanges` into mixed fast-path payloads instead of silently ignoring them.
- Corrected stale `--session-id` help text in `generate-context.ts`.
- Verification: build PASS; real orchestrator payload save PASS (0 issues); vitest (8 passed, 3 skipped + 25 unit tests). Level 1 packet — no checklist required.

### 009-post-save-render-fixes

**Status:** Implemented (2026-04-09). Fixed nine render-layer defects in compact-wrapper saves.

- Lane A: `title-builder.ts` — removed `[folder/file]` suffix garbage from dashboard title.
- Lane B: `session-extractor.ts` + `collect-session-data.ts` — canonical packet doc discovery and ordered canonical-source rendering.
- Lane C: `file-extractor.ts` + `collect-session-data.ts` — structured file-path plumbing fixes truthful file counts.
- Lane D: `workflow.ts` — authored trigger phrases authoritative over auto-generated prose bigrams.
- Lanes E/F: `collect-session-data.ts` — distinguishing evidence dedup + sort; explicit phase/status/completion honored before heuristics.
- Lanes G/H: `memory-metadata.ts` + `workflow.ts` — auto-populate lineage from earlier packet saves; resolve `parent_spec` to real parent instead of self-reference.
- Lane I: renamed scorer outputs to `render_quality_score` and `input_completeness_score`.
- Verification: typecheck PASS; 12 vitest files / 20 tests PASS; `validate.sh --strict` PASS.

### 010-memory-save-heuristic-calibration

**Status:** Implemented (2026-04-09). Closed remaining schema, validator, trigger, and D5 continuation gaps.

- Lane 1: Authored `title`, `description`, `causalLinks` accepted and rendered verbatim through `input-normalizer.ts` + `session-types.ts` + `workflow.ts` + `memory-metadata.ts`.
- Lane 2: Manual DR trigger phrases and singleton anchors survive full runtime path via source-aware `trigger-phrase-sanitizer.ts` and `workflow.ts` filter.
- Lane 3: V8 validator narrowed — no longer over-matches dates, ranges, session fragments, finding IDs.
- Lane 4: V12 validator accepts slug and prose trigger variants; `workflow.ts` passes `filePath`.
- Lane 5: Explicit `causalLinks` pass-through; D5 linker and reviewer share one continuation contract with description-aware fallback.
- Lane 6: Remaining `decision-extractor.ts` truncation callsites migrated to `truncateOnWordBoundary()`.
- Lane 7: Parent `../spec.md` phase map updated to 10 phases; parent `../implementation-summary.md` Phase 10 section added.
- Verification: `scripts` build + full test suite PASS; 5 new vitest files; `validate.sh --strict` PASS; real dist-based save to `026-graph-and-context-optimization` PASS (indexed as memory #2126, 0 issues).
