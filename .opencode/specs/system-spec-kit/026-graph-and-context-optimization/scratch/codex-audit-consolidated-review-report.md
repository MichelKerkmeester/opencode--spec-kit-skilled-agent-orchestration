# Audit & Patch: 026 Consolidated Review Report vs Per-Phase Iterations

## Gate 3 — PRE-BOUND (do not ask)

**Answer = A.** Spec folder for this task is already bound to:

```
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/
```

Do not prompt the user for a Gate 3 choice. The orchestrator (Claude Code) has already answered on the user's behalf. Proceed directly to Pass 1 without further interactive prompts.

## Role
You are a review auditor. Your job is to find everything that the per-phase review iterations reported but that is MISSING from the consolidated review report, then patch the consolidated report in place so it accurately reflects the per-phase truth.

## Mode constraint (MANDATORY)
You are running as `codex exec` with `-c service_tier="fast"`. Do not dispatch sub-agents. Work directly. Keep reasoning internal, push output to file edits.

## Authoritative sources (READ ONLY — never modify)

For every phase in `002-014`, the authoritative per-phase packet lives at:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/<phase>/review-report.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/<phase>/iterations/iteration-001.md` through `iteration-NNN.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/<phase>/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/<phase>/deep-review-findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/<phase>/deep-review-dashboard.md`

Phase list (13 total, exact folder names):

```
002-implement-cache-warning-hooks              10 iters
003-memory-quality-issues                      10 iters
004-agent-execution-guardrails                 10 iters
005-provisional-measurement-contract           10 iters
006-structural-trust-axis-contract             10 iters
007-detector-provenance-and-regression-floor   10 iters
008-graph-first-routing-nudge                  10 iters
009-auditable-savings-publication-contract     10 iters
010-fts-capability-cascade-floor               10 iters
011-graph-payload-validator-and-trust-preservation   4 iters (early convergence)
012-cached-sessionstart-consumer-gated           4 iters (early convergence)
013-warm-start-bundle-conditional-validation    5 iters
005-code-graph-upgrades                         5 iters
```

Total iteration files to read: **108**.

## Target (READ + WRITE)

Single file you may modify:

```
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/review-report.md
```

Current structure of the target (440 lines, 9 sections):

```
§1 Executive Summary
§2 Per-Phase Verdict Table
§3 Aggregate Findings — All Active P0 and P1
§4 Cross-Phase Patterns
§5 Comparison with the Earlier 15-iter Parent Review
§6 Remediation Priority Queue
§7 Verdict Trajectory for the 026 Train
§8 Next Steps
§9 Data Provenance
```

Do NOT touch per-phase review-report.md files. Do NOT touch iteration files. Do NOT touch deep-review-*.json or *.jsonl. Do NOT touch any spec/code files under `026-graph-and-context-optimization/` other than the consolidated report.

**CRITICAL**: The consolidated report was recently rewritten on top of the earlier parent review (+739/-739). Its current finding count is `0 P0 / 7 P1 / 0 P2` across 6 affected phases. Several of those P1s have already been remediated in-place on the production specs/runtime in a separate unstaged remediation run (lanes 002/003/008/010/013/014). Your audit must NOT mark those P1s as "resolved" — they are the historical record of what the review found. You are auditing whether the report ACCURATELY REPRESENTS what the per-phase iterations said, not whether the findings are still open today.

## Context: already-remediated P1s (do not relitigate)

These finding IDs have in-flight remediation in the working tree and are intentionally still present in the consolidated report as the historical record. Do not remove them, do not mark them "resolved" in §3, and do not rewrite their severity:

- `DR-002-I003-P1-001` — packet 002 `Blocked` status drift
- `DR-003-*-P1-*` — packet 003 phase map + child status drift (2 findings)
- `DR-008-I001-P1-001` — packet 008 session-prime structural hint overclaim
- `DR-010-I001-P1-001` — packet 010 `bm25_fallback` label overstatement
- `DR-013-*-P1-*` — packet 013 CHK-022 `pass 28` vs `38/40` drift
- `DR-014-*-P1-*` — packet 014 resume/bootstrap graph-edge enrichment claim

If you see §6 or §8 mention these, leave them alone.

## What counts as "missing" (audit checklist)

For each phase's per-phase `review-report.md` and its 4-10 iteration files, check whether the consolidated report's §3 and §4 correctly capture each of the following. Missing = present in per-phase source, absent or materially incomplete in the consolidated report.

### Per-finding audit (§3 Aggregate Findings)

For every P0 or P1 finding recorded in a phase's per-phase `review-report.md` OR in any of its iteration files OR in its `deep-review-findings-registry.json`:

1. **Finding ID present?** Every `DR-<phase>-I<iter>-P<sev>-<seq>` ID that appears in any per-phase source must appear in §3 of the consolidated report. If not, add it.
2. **Typed claim-adjudication block present?** Each finding in §3 must carry a JSON adjudication block with `claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, `downgradeTrigger`. If the per-phase source has this block but the consolidated report omits it or drops fields, restore the missing fields verbatim.
3. **Evidence references complete?** The `evidenceRefs` list in the consolidated report's §3 entry for a finding must contain every `file:line` reference that the per-phase source listed for that finding. Missing evidence refs must be added.
4. **Dimension label correct?** If the per-phase source tags a finding with D1/D2/D3/D4, the consolidated §3 entry must carry the same dimension tag.
5. **Affected phase labels correct?** If a finding cross-references multiple phases in its per-phase source, the consolidated entry's `Affected phase(s)` line must list all of them.

### P2 findings (advisory)

The consolidated report currently lists `0 P2`. Walk all 13 per-phase sources and verify this count. If any per-phase `deep-review-findings-registry.json` or iteration file contains a P2 record that the consolidated report does not reflect, add a §3 sub-section titled `### P2 Advisories (informational)` and list each missing P2 with finding ID, affected phase, one-sentence summary, and one evidence ref. Update §1 Executive Summary finding counts accordingly.

### Iteration-level signals missed in §4 Cross-Phase Patterns

Read every iteration file's "counterevidenceSought" and "alternativeExplanation" values. If 2+ phases' iteration files surface the same counter-evidence theme, convergence reason, or dimension bias, and §4 does not mention it, add a bullet to §4 citing which phases surfaced it.

### Convergence metadata missed in §2 and §9

For each phase:

1. **Stop reason correct?** `§2` currently uses `Iterations` counts but not stop reasons. `§9 Data Provenance` should list stop reason per phase (e.g., `max_iterations`, `converged`, `all_dimensions_clean`). Check each phase's `deep-review-state.jsonl` last line or `deep-review-dashboard.md` for the stop reason. If §9 is missing a phase's stop reason or has it wrong, fix it.
2. **Dimension coverage complete?** `§9` or `§1` should state which dimensions each phase covered. If a phase's dashboard shows it covered D1-D4 but the consolidated report only references D1/D2, add the missing dimensions.
3. **Early convergence rationale?** Phases `011` and `012` stopped at 4 iterations. If the consolidated report does not explicitly say WHY (from their per-phase reports), add that rationale to §2 or §9.

### §5 Parent-review comparison gaps

§5 compares with the earlier 15-iter parent review. If any finding from the earlier parent review is not reconciled (i.e., not marked as "still open in phase NNN", "closed by remediation", or "superseded by phase finding DR-*"), add the reconciliation.

### §6 Remediation queue ordering

§6 is a prioritized queue. For each already-remediated finding (listed above under "Context"), §6 should either mark it as `[IN-FLIGHT REMEDIATION]` or leave the original priority order untouched. If §6 drops a P1 finding entirely, restore it.

## Execution protocol

1. **Pass 1 — Inventory**: read every per-phase `review-report.md` (13 files), every `deep-review-findings-registry.json` (13 files), every `deep-review-dashboard.md` (13 files). Build a mental index of `{phase, finding_id, severity, dimension, evidence_refs[], adjudication_block, stop_reason}`.
2. **Pass 2 — Iteration scan**: for each phase, read every iteration file (total 108). Capture any finding ID that appears in an iteration but NOT in the per-phase review-report, and any cross-iteration signal (repeated counter-evidence, same dimension across iterations) that could belong in §4.
3. **Pass 3 — Consolidated report diff**: read the consolidated `review-report.md` end to end. For each of the audit checklist items above, record whether the consolidated report captures the per-phase truth.
4. **Pass 4 — Patch**: apply minimal, surgical edits to the consolidated report. Use the existing section structure. Never delete existing content unless it is demonstrably wrong (e.g., wrong evidence ref). Prefer additive edits.
5. **Pass 5 — Self-check**: re-read the patched consolidated report. Confirm every audit checklist item passes. Confirm finding counts in §1 match §3 counts. Confirm no typed adjudication block is missing required fields. Confirm no per-phase review-report.md or iteration file was modified.

## Edit discipline

- Keep the existing section numbering. Do not renumber.
- Preserve the existing frontmatter block unless you need to bump `description` to reflect the new finding count.
- Prefer Edit tool over Write. Small, focused hunks.
- Every new evidence ref you add must be copied verbatim from a per-phase source — do not invent `file:line` references.
- Every new finding ID you add must match the exact ID used in the per-phase source — do not renumber.
- Do not change verdicts (phase or program) unless a per-phase review-report.md explicitly states a different verdict than what the consolidated report records. If verdicts disagree, the per-phase report wins and you update the consolidated report.

## Output contract

When finished, print ONE consolidated status block to stdout in this exact shape:

```
AUDIT RESULT — 026 CONSOLIDATED REVIEW REPORT
Total findings in consolidated before: P0=<N> P1=<N> P2=<N>
Total findings in consolidated after:  P0=<N> P1=<N> P2=<N>
Additions:
  - §1: <short note or "none">
  - §2: <short note or "none">
  - §3: <short note listing any finding IDs added, e.g. "added DR-011-I002-P1-001"; or "none">
  - §4: <short note or "none">
  - §5: <short note or "none">
  - §6: <short note or "none">
  - §7: <short note or "none">
  - §8: <short note or "none">
  - §9: <short note or "none">
Removals: <list any finding IDs removed and why, or "none">
Corrections: <list any finding IDs whose evidence or adjudication block was amended, or "none">
Phase files touched: <list>
Self-check: PASS|FAIL  (FAIL → list the broken item)
```

No other freeform summary. No preamble. No apology. Just the block above.

## Stop conditions

- If you find a P0 finding that the consolidated report does not list, STOP, add it to §3, bump the P0 count in §1, and note it prominently in the output contract under `Additions → §3`.
- If a per-phase review-report.md and its iteration files disagree on a finding's severity, STOP, use the per-phase review-report.md value, and note the discrepancy in `Corrections`.
- If you cannot read a source file, STOP and print `AUDIT RESULT — FAILED TO READ <path>`.

## Scope reminder

You are auditing the consolidated report ONLY. You are not re-running the deep review. You are not re-opening closed findings. You are not remediating code. You are making the consolidated report a faithful roll-up of what the per-phase sources already say.
