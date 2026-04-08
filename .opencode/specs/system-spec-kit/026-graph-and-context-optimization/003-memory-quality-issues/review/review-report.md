---
title: "Deep Review Report: 003-memory-quality-issues (parent + 7 phases)"
description: "Final compiled review report from 7-iteration deep-review loop with cli-codex gpt-5.4 high fast-mode delegation. Verdict: FAIL."
sessionId: session-2026-04-08T12-10-08Z-003mq-review
generatedAt: 2026-04-08T15:05:00Z
verdict: FAIL
---

# Deep Review Report: 003-memory-quality-issues

## 1. Executive Summary

**Overall verdict:** `FAIL`
**hasAdvisories:** true

**Finding counts (active):**
- **P0 (Blocker):** 0
- **P1 (Required):** 13
- **P2 (Suggestion / Advisory):** 9
- **Total:** 22

**Review scope summary:**
- **Target:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/` — parent packet + 7 phase children (001-007)
- **Dimensions covered (all 7):** correctness, security, traceability, maintainability, performance, reliability, completeness
- **Files reviewed:** ~58 spec artifacts + 15+ shipped code files across `workflow.ts`, `post-save-review.ts`, `find-predecessor-memory.ts`, `decision-extractor.ts`, `trigger-phrase-sanitizer.ts`, `truncate-on-word-boundary.ts`, and related modules
- **Iterations:** 7 of 7 (full budget)
- **Reviewer backend:** `cli-codex` `/opt/homebrew/bin/codex exec` with `gpt-5.4`, `reasoning_effort=high`, `service_tier=fast`, `sandbox=read-only`
- **Total elapsed reviewer time:** ~1,419 s (23.6 min) across 7 codex exec invocations + 1 retried stall

**Headline:** The packet has NO P0 blockers, but 13 P1 findings cluster into two thematic groups that together make the packet unshippable as-is:

1. **Shipped-code bugs (6 P1s)** in Phase 1/2/3/4 implementations — the remediations landed but do not fully honor the narrowed spec contracts.
2. **Parent-rollup state drift (6 P1s)** — the parent packet and phase docs contradict each other on which phases are complete, which handoff gates were satisfied, and which artifacts shipped.
3. **Operator contract drift (1 P1)** — telemetry catalog and alert YAML describe different thresholds.

---

## 2. Planning Trigger

**`/spec_kit:plan` is REQUIRED** to turn this review into a remediation track.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 0,
    "P1": 13,
    "P2": 9,
    "total": 22
  },
  "remediationWorkstreams": [
    {
      "id": "RW-A",
      "title": "Shipped-code bug fixes",
      "priority": "P0",
      "findings": ["P1-001", "P1-002", "P1-003", "P1-008", "P1-009", "P1-010"],
      "estimatedScope": "6 surgical code fixes across 5 files in .opencode/skill/system-spec-kit/scripts/",
      "risk": "medium",
      "depends_on": []
    },
    {
      "id": "RW-B",
      "title": "Parent packet rollup normalization",
      "priority": "P0",
      "findings": ["P1-004", "P1-006", "P1-007", "P1-011", "P1-012", "P1-013"],
      "estimatedScope": "Rewrite parent spec.md phase map + parent plan.md/tasks.md supersession banner + Phase 5 spec/impl-summary qualification + Phase 6/7 state normalization",
      "risk": "low",
      "depends_on": []
    },
    {
      "id": "RW-C",
      "title": "Telemetry/alert operator contract reconciliation",
      "priority": "P1",
      "findings": ["P1-005"],
      "estimatedScope": "Update memory-save-quality-alerts.yml to encode documented bucket-share/ratio/p95 semantics OR simplify telemetry-catalog.md to match bare threshold implementation",
      "risk": "low",
      "depends_on": []
    },
    {
      "id": "RW-D",
      "title": "P2 advisory cleanup",
      "priority": "P2",
      "findings": ["P2-001", "P2-002", "P2-003", "P2-004", "P2-005", "P2-006", "P2-007", "P2-008", "P2-009"],
      "estimatedScope": "Documentation citation refresh, sanitizer hardening, PR-10 fixture lock, checklist arithmetic fix",
      "risk": "low",
      "depends_on": ["RW-A", "RW-B"]
    }
  ],
  "specSeed": {
    "title": "003-memory-quality-issues remediation (deep-review cycle)",
    "level": 2,
    "scope": "Address 13 P1 findings from deep-review session-2026-04-08T12-10-08Z-003mq-review. Split into shipped-code fixes (RW-A), parent rollup normalization (RW-B), operator contract reconciliation (RW-C). Defer P2 advisory cleanup (RW-D) to follow-on packet unless operator explicitly requests bundling.",
    "outOfScope": [
      "Re-litigating any finding marked 'ruled out' in iterations 1-7",
      "Phase 6 implementation work (if Phase 6 is currently a placeholder, normalize docs; do not ship new code)",
      "PR-11 apply (remains deferred)"
    ]
  },
  "planSeed": {
    "phases": [
      "Phase A: RW-B parent rollup normalization (lowest risk, unblocks audit)",
      "Phase B: RW-A shipped-code fixes (P1-002, P1-003 first — security; P1-009, P1-010 second — reliability; P1-001, P1-008 last — correctness/performance)",
      "Phase C: RW-C telemetry/alert reconciliation",
      "Phase D: RW-D advisory cleanup (optional bundle)"
    ],
    "acceptanceCriteria": [
      "All 13 P1 findings have either a confirmed fix commit OR an operator-approved deferral with rationale",
      "Parent strict validator exits <= 1",
      "Phase 6/7 status is internally consistent (one truthful state across spec/plan/tasks/checklist/impl-summary)",
      "Telemetry catalog and alert YAML describe the same semantics"
    ]
  }
}
```

---

## 3. Active Finding Registry

### P1 Findings (13 active)

#### Shipped-code cluster (6)

| ID | Dim | Title | File:Line | Confidence |
|----|-----|-------|-----------|-----------:|
| P1-001 | correctness | truncateOnWordBoundary() mid-word fallback for whitespace-free inputs | `.opencode/skill/system-spec-kit/scripts/lib/truncate-on-word-boundary.ts:22` | 0.90 |
| P1-002 | security | Post-sanitization folder anchor bypass reintroduces unsanitized trigger phrases | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1358` | 0.91 |
| P1-003 | security | Raw `keyDecisions` entries gain authority without validation or trust gating | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:205` | 0.88 |
| P1-008 | performance | Post-save review re-reads + reparses just-written file on every JSON save | `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:558` (+ `workflow.ts:1897`) | 0.92 |
| P1-009 | reliability | Predecessor discovery can fabricate lineage from unrelated older sibling | `.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:56` | 0.94 |
| P1-010 | reliability | Reviewer `SKIPPED` after readback failure is logged as info and never blocks save | `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:559` (+ `workflow.ts:1909`) | 0.91 |

#### Parent-rollup cluster (6)

| ID | Dim | Title | File:Line | Confidence |
|----|-----|-------|-----------|-----------:|
| P1-004 | traceability | Parent phase map overstates Phases 2-5 completion (Phase 5 still 9/13 P1 items open) | `003-memory-quality-issues/spec.md:83` | 0.94 |
| P1-006 | maintainability | Phase 5 marked closed while own handoff gate (parent closeout) still failing | `005-operations-tail-prs/spec.md:40` + `005/implementation-summary.md:33,88` | 0.92 |
| P1-007 | maintainability | Parent plan/tasks still advertise superseded "fresh /spec_kit:plan" workflow | `003-memory-quality-issues/plan.md:36` (+ `tasks.md:64,112`) | 0.88 |
| P1-011 | completeness | Parent says Phase 7 `Pending` but Phase 7 claims completed parity audit | `003-memory-quality-issues/spec.md:88` + `007/implementation-summary.md:33` | 0.95 |
| P1-012 | completeness | Phase 6 placeholder summary contradicts checked implementation evidence | `006-memory-duplication-reduction/implementation-summary.md:33` vs `006/checklist.md:42,46` | 0.94 |
| P1-013 | completeness | Phase 5→6 and 6→7 handoff criteria not demonstrated | `003-memory-quality-issues/spec.md:105` + cross-docs | 0.93 |

#### Operator-contract cluster (1)

| ID | Dim | Title | File:Line | Confidence |
|----|-----|-------|-----------|-----------:|
| P1-005 | maintainability | Telemetry catalog and alert YAML describe different operational contracts | `005-operations-tail-prs/telemetry-catalog.md:19` vs `memory-save-quality-alerts.yml:36-58` | 0.95 |

### P2 Findings (9 active)

| ID | Dim | Title | File:Line |
|----|-----|-------|-----------|
| P2-001 | correctness | Phase 1 source citations point at wrong parent-spec lines | `001-foundation-templates-truncation/implementation-summary.md:80` |
| P2-002 | correctness | Migration order inconsistent across Phase 1 artifacts | `001-foundation-templates-truncation/tasks.md:69` vs `plan.md:17` |
| P2-003 | security | Trigger sanitizer lacks generic hostile-token guards (length, control-char, Unicode) | `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:22` |
| P2-004 | traceability | Parent D6 row cites non-owning phase check (CHK-028 → CHK-030) | `003-memory-quality-issues/checklist.md:65` |
| P2-005 | traceability | Several checked parent rows not phase-traceable (CHK-003, CHK-010, CHK-050, CHK-051) | `003-memory-quality-issues/checklist.md:35` |
| P2-006 | maintainability | Alert artifact path inconsistent across Phase 5 docs (`monitoring/` vs phase-local) | `005-operations-tail-prs/spec.md:163` |
| P2-007 | performance | PR-7 qualifying-save gate broader than spec's JSON-mode intent | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1386` |
| P2-008 | reliability | PR-10 evidence drifts with repo state; no fixture-locked test; docs still mention unshipped `--apply` | `.../scripts/memory/migrate-historical-json-mode-memories.ts:703` |
| P2-009 | completeness | Parent P0 count arithmetic wrong (reports 5/6, all 6 rows actually checked) | `003-memory-quality-issues/checklist.md:106` |

Full dispositions with Hunter/Skeptic/Referee adjudication and claim-adjudication packets live in `review/iterations/iteration-001.md` through `iteration-007.md`.

---

## 4. Remediation Workstreams

### Workstream A — Shipped-code bug fixes (P0 priority)

| Order | Finding | Action |
|------:|---------|--------|
| 1 | P1-002 | Move `leafFolderAnchor` append to BEFORE `sanitizeTriggerPhrases()` in `workflow.ts:1315-1359` OR run the anchor through the sanitizer chain before persistence |
| 2 | P1-003 | Add validation in `decision-extractor.ts:205-234` — require `decision`/`title`, reject opaque objects, cap text size; only suppress lexical fallback when at least one valid authored decision survives |
| 3 | P1-009 | Add title-family or session-thread affinity guard in `find-predecessor-memory.ts:126-223` before ranking; otherwise leave `supersedes` empty |
| 4 | P1-010 | Promote unexpected `SKIPPED` after successful write to warning/error in `workflow.ts:1909-1935`; distinguish from deliberate skip |
| 5 | P1-001 | Either harden `truncate-on-word-boundary.ts:22` for whitespace-free over-limit strings, or narrow Phase 1 spec language |
| 6 | P1-008 | Refactor `post-save-review.ts:558` to accept in-memory rendered content from `workflow.ts`; collapse multiple parse passes into one |

### Workstream B — Parent packet rollup normalization (P0 priority)

| Order | Finding | Action |
|------:|---------|--------|
| 1 | P1-011 | Reconcile parent `spec.md:87-88` phase map for Phase 7 (either mark shipped per Phase 7 docs, OR revert Phase 7 to scaffold state) |
| 2 | P1-012 | Normalize Phase 6 docs to one truthful state (all-placeholder or all-shipped with matching tasks checked) |
| 3 | P1-013 | Either waive Phase 5→6 and 6→7 handoff gates with explicit rationale, or fix child-phase states to match |
| 4 | P1-004 | Downgrade parent `spec.md:83` Phase 2-5 statuses from `Complete` to a qualified label that matches child checklists (Phase 5 still 9/13 P1s open) |
| 5 | P1-006 | Reword `005-operations-tail-prs/implementation-summary.md:33` as "phase-local closeout complete, parent closeout blocked" or clear parent blockers first |
| 6 | P1-007 | Add explicit "superseded by Phases 1-5" banner to parent `plan.md` and `tasks.md`; point operators to phase folders as execution record |

### Workstream C — Telemetry/alert contract reconciliation (P1)

| Order | Finding | Action |
|------:|---------|--------|
| 1 | P1-005 | Either (a) simplify `telemetry-catalog.md:19-27` to describe the bare threshold semantics actually implemented in `memory-save-quality-alerts.yml:36-58`, OR (b) update the YAML to encode the documented bucket-share/ratio/p95 logic. Mark both as draft/preview if neither is yet operator-ready. |

### Workstream D — P2 advisory cleanup (optional bundle)

Non-blocking but recommended for long-term hygiene. Groups by file for batch editing:
- **Phase 1 docs** (P2-001, P2-002): refresh citations + normalize migration order
- **Parent checklist** (P2-004, P2-005, P2-009): add phase-local citations, fix arithmetic
- **Sanitizer code** (P2-003): add length/control-char/unicode prefilter
- **Phase 5 docs** (P2-006): normalize alert artifact path
- **workflow.ts** (P2-007): add `SaveMode.Json` gate before predecessor discovery
- **PR-10 harness** (P2-008): add fixture-locked test + reconcile `--apply` wording

---

## 5. Spec Seed

Bullets ready to drop into a new spec:

- **Problem:** The completed five-phase remediation train for D1-D8 landed, but deep-review found 13 P1 issues across shipped code, parent rollup state, and operator contracts. The packet cannot honestly claim release-ready until these are addressed.
- **Purpose:** Reconcile the gap between what parent/phase docs claim and what the shipped code + child checklists actually say, and fix the six real code bugs surfaced by the cross-code review.
- **Scope:**
  - **In scope:** 13 P1 findings (6 shipped-code, 6 parent-rollup, 1 operator-contract) + optionally the 9 P2 advisories
  - **Out of scope:** Re-litigating ruled-out findings, Phase 6 new implementation, PR-11 apply
- **Acceptance criteria:** See Planning Packet `acceptanceCriteria` in §2.
- **Success signals:** Parent strict validator exit ≤ 1; all P1 cluster findings closed or waived; telemetry/alert contracts reconciled; Phase 6/7 states internally consistent.

---

## 6. Plan Seed

Concrete starter tasks for `/spec_kit:plan`:

1. **T001: RW-B Parent rollup normalization** (low risk, unblocks audit)
   - T001.1: Edit parent `spec.md:83-88` phase map with actual child states
   - T001.2: Add "superseded by Phases 1-5" banner to parent `plan.md:36-39,187-188` and `tasks.md:64-112`
   - T001.3: Reword `005-operations-tail-prs/implementation-summary.md:33` to "phase-local complete / parent blocked"
   - T001.4: Choose and apply one truthful state for Phase 6 across all 5 phase docs
   - T001.5: Reconcile Phase 7 state (shipped or scaffold)
   - T001.6: Either waive handoff gates with rationale or fix child states
   - T001.7: Fix parent P0 count arithmetic in `checklist.md:104-108` (P2-009 rides along)

2. **T002: RW-A Shipped-code fixes** (medium risk, security first)
   - T002.1: Fix P1-002 folder anchor sanitization bypass
   - T002.2: Fix P1-003 raw keyDecisions validation
   - T002.3: Fix P1-009 predecessor affinity guard
   - T002.4: Fix P1-010 SKIPPED warning promotion
   - T002.5: Fix P1-001 truncation helper whitespace-free fallback (or narrow spec)
   - T002.6: Fix P1-008 post-save review hot-path reread
   - T002.7: Add regression tests for each of the above

3. **T003: RW-C Telemetry/alert contract**
   - T003.1: Decide catalog-wins or YAML-wins
   - T003.2: Update the losing side
   - T003.3: Mark both as operator-ready once aligned

4. **T004: RW-D P2 advisory cleanup** (optional)
   - Low-risk documentation + minor code hardening

---

## 7. Traceability Status

### Core Protocols

| Protocol | Overall Status | Notes |
|----------|---------------|-------|
| `spec_code` | **FAIL** | Phase 4 promises ambiguity-safe non-guessing predecessor discovery (implementation still timestamp-ranks); Phase 5 spec/plan still mention unshipped `--apply` mode; parent rollup contradicts child state for Phases 2-7 |
| `checklist_evidence` | **FAIL** | Phase 3 checklist misses post-sanitization append + raw-array authority gap; Phase 5 impl-summary presents packet as operationally finished while same file records parent strict validation failing; parent P0 arithmetic wrong; unresolved handoff state |

### Overlay Protocols

| Protocol | Status | Notes |
|----------|--------|-------|
| `skill_agent` | notApplicable | Review scope is packet-level, not skill-level — Phase 7 (007-skill-catalog-sync) is the scope-owner for this check |
| `agent_cross_runtime` | notApplicable | Packet review, single runtime |
| `feature_catalog_code` | notApplicable | Phase 7 scope |
| `playbook_capability` | notApplicable | Phase 7 scope |

---

## 8. Deferred Items

Non-blocking follow-ups surfaced during the review that are not part of the remediation train:

- **D6 regression fixture** — still needed before any D6 code patch can be justified (carry-over from the 10-iteration deep research, not a deep-review finding). See prior memory `06-04-26_18-30__completed-a-10-iteration-deep-research.md`.
- **PR-11 concurrency hardening** — explicitly deferred with rationale at `005-operations-tail-prs/pr11-defer-rationale.md`. Reviewer confirmed deferral is honest.
- **Parent out-of-scope drift acknowledgement** — parent `implementation-summary.md:108,116` already marks this honestly; only the plan/tasks wording (P1-007) needs the supersession banner.
- **Phase 6 implementation** — whether Phase 6 actually ships or reverts to scaffold is a **decision**, not a review finding. The review only flags the current state as inconsistent (P1-012).

---

## 9. Audit Appendix

### Convergence Summary

| Iteration | Dimension | Findings (new) | newFindingsRatio | Verdict |
|----------:|-----------|:---------------|----------------:|---------|
| 1 | correctness | 1 P1 + 2 P2 | 1.00 | CONDITIONAL |
| 2 | security | 2 P1 + 1 P2 | 1.00 | CONDITIONAL |
| 3 | traceability | 1 P1 + 2 P2 | 0.50 | CONDITIONAL |
| 4 | maintainability | 3 P1 + 1 P2 | 0.31 | FAIL |
| 5 | performance | 1 P1 + 1 P2 | 0.15 | CONDITIONAL |
| 6 | reliability | 2 P1 + 1 P2 | 1.00 | FAIL |
| 7 | completeness | 3 P1 + 1 P2 | 0.18 | FAIL |

**Stop reason:** `max_iterations_reached_with_all_dimensions_covered`
**Trend:** Ratio declined from 1.00 → 0.18 as overlap with prior themes grew. The 6-reliability bump to 1.00 came from a net-new cluster (predecessor fabrication, SKIPPED downgrade) the earlier passes did not touch.

### Coverage Summary

- **Dimensions reviewed:** 7/7 (correctness, security, traceability, maintainability, performance, reliability, completeness)
- **Spec-artifact files reviewed:** ~50+ (parent + all 7 phase children)
- **Code files reviewed:** `workflow.ts`, `post-save-review.ts`, `find-predecessor-memory.ts`, `decision-extractor.ts`, `trigger-phrase-sanitizer.ts`, `truncate-on-word-boundary.ts`, `memory-telemetry.ts`, `save-mode.ts`, `collect-session-data.ts`, `migrate-historical-json-mode-memories.ts`, `extract-session-data.ts`, `memory-metadata.ts`, `frontmatter-migration.ts`, `memory-template-contract.ts`, `memory-parser.ts`, `context_template.md`, 2 Phase 4 test files
- **Coverage stabilization passes:** 1 (final iteration on completeness)

### Ruled-Out Claims (Consolidated from all iterations)

- D8 anchor-id mismatch still exists (iter 1)
- Parent rollup misstates Phase 1 outcomes (iter 1)
- Provenance-only JSON enrichment leaking summary/observation content — PR-4 narrowing held (iter 2)
- PR-6 fully disabling degraded fallback — lexical fallback still permitted when raw array empty (iter 2)
- D4 single-owner importance_tier bypass (iter 2)
- PR ownership misattribution for PR-1..PR-11 (iter 3)
- Scenario C tail honesty (PR-10 dry-run + PR-11 deferred consistent) (iter 3)
- `pr11-defer-rationale.md` misleading — verified clear (iter 4)
- Phase 5 plan layout divergence — acceptable (iter 4)
- Fabricated metric names — M1-M9 are real code surfaces (iter 4)
- Truncation helper constant-time claim — actually linear in bounded slice, no false claim (iter 5)
- PR-7 predecessor helper multi-pass — actually single-pass (iter 5)
- Telemetry emission cost — lightweight, reviewer is the cost (iter 5)
- SaveMode refactor residual `source === 'file'` branches (iter 6)
- Composite blocker behavior (iter 6)
- PR-11 silent half-ship (iter 6)
- Parent strict-validation drift acknowledgement — already honest in impl-summary (iter 7)
- PR-10 apply decision missing — explicitly recorded as dry-run-only (iter 7)
- Missing required artifacts in Phase 6/7 — all present (iter 7)

### Cross-Reference Appendix — Core Protocols

**`spec_code` (core):** 0 pass / 4 partial / 3 fail across iterations. Dominant failure pattern: docs promise narrowed or safer behavior, shipped code still has the wider path or an unrelated fallback.

**`checklist_evidence` (core):** 0 pass / 5 partial / 2 fail. Dominant failure pattern: phase-local evidence is recorded but parent rollup doesn't cite it, or parent rollup claims completion the phase-local checklist doesn't support.

### Cross-Reference Appendix — Overlay Protocols

**`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`:** all marked `notApplicable` for packet-level review — these are Phase 7's scope.

### Sources Reviewed (Deduplicated)

Across all 7 iterations, the following source categories were reviewed:

- Parent packet: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`
- 7 phase folders: `{001..007}/{spec,plan,tasks,checklist,implementation-summary,README}.md`
- Phase 5 extras: `pr11-defer-rationale.md`, `release-notes-draft.md`, `telemetry-catalog.md`, `memory-save-quality-alerts.yml`, `scratch/pr10-dry-run-report.json`
- Phase 6/7 extras: `research/research.md`, `research/review-report.md`
- Shipped code (see Coverage Summary above)

### Reviewer Transcript Reference

- Iteration markdown files: `review/iterations/iteration-00{1..7}.md`
- Raw codex outputs: `/tmp/deep-review-003mq/iter-0{1..7}-output.md` (ephemeral, not persisted)
- Iteration 6 first attempt stalled at ~19 min with 0.19 s CPU time; killed and retried successfully in 194 s. Communicated to operator during the run per instructions.

---

## Status Line

```
STATUS=OK PATH=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues
Iterations: 7 | Stop reason: max_iterations_reached_with_all_dimensions_covered
Findings: P0=0 P1=13 P2=9 | Verdict: FAIL (hasAdvisories=true)
Next: /spec_kit:plan (remediation based on RW-A + RW-B + RW-C)
```
