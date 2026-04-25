---
title: "Implementation Plan: Manual Testing Playbook Coverage and Run (011) [template:level_2/plan.md]"
description: "Approach, phases, and decisions for syncing playbook coverage with 010/007 surfaces and producing a runner-driven scorecard."
trigger_phrases:
  - "011 plan"
  - "011 implementation plan"
  - "phase 011 playbook coverage plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-manual-testing-playbook-coverage-and-run"
    last_updated_at: "2026-04-25T19:11:00Z"
    last_updated_by: "claude-opus-4-7-orchestrator"
    recent_action: "Plan written. Approach: edit 4 playbook scenarios, run runner with sequential filter passes, aggregate scorecard."
    next_safe_action: "Write tasks.md + checklist.md, then update playbook scenarios."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "011-init"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Manual Testing Playbook Coverage and Run (011)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. APPROACH

Two-part deliverable:

1. **Coverage sync** — extend three existing playbook scenario files (014, 026, 203) and confirm/extend a fourth (199). Use `Edit` directly rather than the `/create:testing-playbook :update` command, since we are extending sub-sections of existing files, not regenerating whole packages.
2. **Runner pass + scorecard** — invoke `manual-playbook-runner.ts` with `MANUAL_PLAYBOOK_FILTER` set to each scenario ID in turn (4 sequential runs), capture each `manual-playbook-results.json` to `011/scratch/manual-playbook-results/<scenarioId>/`, then merge into a single scorecard table in `implementation-summary.md`.

**Why sequential runs over a single broad run:** The runner uses substring matching for the filter; the four scenario IDs (014, 026, 199, 203) share no common substring. A broad run covers all 306 scenarios and adds 30+ minutes of unrelated work. Four targeted runs at ~30s each is faster and produces clean per-scenario JSON output.

**Why Edit over /create:testing-playbook :update:** The command regenerates whole packages from a feature catalog; we are appending sub-sections. Direct Edit is lower-risk and preserves the existing structure that 010/006 authored.

---

## 2. PHASES

### Phase 0 — Preflight

- Confirm `mcp_server/dist/handlers/index.js` exists and is current (build via `tsc`, not `tsc --noEmit`).
- Confirm `manual-playbook-runner.ts` SKILL_ROOT detection succeeds when run from `.opencode/skill/system-spec-kit/`.
- Confirm `MANUAL_PLAYBOOK_REPORT_ROOT` override works (point it at `011/scratch/manual-playbook-results/<scenarioId>/`).

### Phase 1 — Scenario coverage sync

- **014 detect_changes preflight**: append two new step-blocks per the table in `spec.md §3`. Use the existing template snippet (Setup / Prompt / Commands / Expected / Evidence / Pass-Fail).
- **026 graph query / blast_radius**: append five new step-blocks (minConfidence, exact-limit overflow, multi-subject seed preservation, failureFallback.code enumeration, edge reason/step control-char sanitization). The control-char step requires direct DB write; document the SQL inline and ensure teardown.
- **203 trust badges**: append the cache-invalidation-on-causal-edge-mutation step. Setup seeds 1-2 edges via `memory_causal_link`; assertion compares cache fingerprints across two `memory_search` calls.
- **199 affordance evidence**: read first; if the file already covers debug counters per the Explore agent's report, leave untouched (record as "no-op" in implementation-summary). Otherwise append a counters-assertion step.

After each file edit, run the playbook validator (`python3 .opencode/skill/sk-doc/scripts/validate_document.py` or whatever the canonical validator is) on the modified file.

### Phase 2 — Runner pass

For each of the four scenario IDs:

```
cd .opencode/skill/system-spec-kit
MANUAL_PLAYBOOK_FILTER=<scenarioId> \
MANUAL_PLAYBOOK_REPORT_ROOT=$(pwd)/../../specs/system-spec-kit/026-graph-and-context-optimization/011-manual-testing-playbook-coverage-and-run/scratch/manual-playbook-results/<scenarioId> \
node scripts/tests/manual-playbook-runner.ts
```

Record `total / PASS / FAIL / SKIP / UNAUTOMATABLE` from each run's `manual-playbook-results.json`.

### Phase 3 — Scorecard + triage

Build the scorecard table in `implementation-summary.md`. For each FAIL, classify root cause:
- **scenario-stale**: scenario expectation no longer matches current behaviour (rewrite scenario)
- **surface-bug**: behaviour regressed (escalate to a remediation phase)
- **runner-limitation**: runner couldn't classify the step (extend runner OR mark UNAUTOMATABLE with explicit reason)

### Phase 4 — Regression gate + canonical save

- `tsc --noEmit` clean
- Canonical phase-010 11-file vitest suite still 175/175 PASS
- Python `test_skill_advisor.py` still 57/57 PASS
- `bash validate.sh --strict` on the 011 spec folder (acceptable: PASSED or FAILED-COSMETIC; not contract violations)
- `node generate-context.js` for the 011 spec folder
- Commit; push only on user request.

---

## 3. DECISIONS

| Decision | Choice | Rationale |
|---|---|---|
| Edit vs `/create:testing-playbook :update` | Direct Edit | We extend, not regenerate. Lower risk, preserves 010/006 structure. |
| Targeted vs broad run | Targeted (4 scenarios) | Surfaces 010-specific regressions cleanly; broader run is an explicit follow-up if the team wants a full re-baseline. |
| Filter strategy | 4 sequential runs with per-scenario report root | Simpler than extending the runner; per-scenario JSON outputs are easier to triage. |
| `compute_error` failureFallback.code step | Mark UNAUTOMATABLE if direct DB-fault injection isn't easy from the runner | Don't block the deliverable on a hard-to-reproduce edge case; cite vitest coverage for it. |
| Trust-badge cache invalidation cleanup | Per-test isolated DB OR explicit teardown step | Avoid leaving orphan causal edges in the shared fixture. |

---

## 4. SEQUENCING & DEPENDENCIES

```
Phase 0 (preflight) ── blocks Phase 2 (runner)
Phase 1 (scenario edits) ── blocks Phase 2 (runner)
Phase 2 (runner) ── blocks Phase 3 (scorecard)
Phase 3 (scorecard) ── blocks Phase 4 (regression + save)
```

Phase 1 sub-tasks (014 / 026 / 203 / 199) are independent and can be parallelized via single-message multi-Edit batches if desired.

---

## 5. VERIFICATION

End-to-end checks (mirrors `spec.md §5 SC-001..SC-004`):

1. Each modified scenario passes the playbook validator.
2. Runner produces a `manual-playbook-results.json` per scenario.
3. `implementation-summary.md` scorecard reflects the runner output verbatim (no fabricated counts).
4. tsc + vitest + pytest counts unchanged from 010/007 verification baseline.
5. `validate.sh --strict` on 011 returns PASSED or FAILED-COSMETIC (not contract violations).
