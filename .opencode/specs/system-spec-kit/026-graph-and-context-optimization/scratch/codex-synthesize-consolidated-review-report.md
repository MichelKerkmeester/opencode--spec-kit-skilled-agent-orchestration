# Codex CLI Prompt — Synthesize all per-phase reviews into one consolidated report

You are running as codex CLI (`gpt-5.4`, `reasoning_effort=high`, `service_tier=fast`, `sandbox=workspace-write`). Self-contained prompt. Pure synthesis task — you do NOT run any new review iterations. You read every per-phase review-report that currently exists under `026/review/<phase-slug>/` and produce ONE consolidated report at `026/review/batch-phase-review-consolidated.md`.

## SCOPE

Discover all per-phase deep-review reports under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/` (one subfolder per phase), aggregate their findings and verdicts, identify cross-phase patterns, compare against the existing 15-iter parent review, and write a single consolidated report.

This is **SYNTHESIS ONLY**:
- Do NOT run new review iterations
- Do NOT modify any per-phase review-report
- Do NOT touch any source file in the 13 phases
- Do NOT modify the existing `026/review/review-report.md` (the 15-iter parent review)
- Your ONLY write target is `026/review/batch-phase-review-consolidated.md`

## PRE-APPROVALS (do not ask)

- Parent spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (PRE-APPROVED, skip Gate 3)
- Read-only access to all per-phase review packets under `026/review/<phase-slug>/`
- Write access to exactly one file: `026/review/batch-phase-review-consolidated.md` (overwrite if it exists; create if it doesn't)

## DISCOVERY — find the per-phase reports that exist

Phases expected (from the prior batch review plan):

| Phase slug |
|---|
| 002-implement-cache-warning-hooks |
| 003-memory-quality-issues |
| 004-agent-execution-guardrails |
| 005-provisional-measurement-contract |
| 006-structural-trust-axis-contract |
| 007-detector-provenance-and-regression-floor |
| 008-graph-first-routing-nudge |
| 009-auditable-savings-publication-contract |
| 010-fts-capability-cascade-floor |
| 011-graph-payload-validator-and-trust-preservation |
| 012-cached-sessionstart-consumer-gated |
| 013-warm-start-bundle-conditional-validation |
| 005-code-graph-upgrades |

For each phase slug, check whether `026/review/<phase-slug>/review-report.md` exists. Build a list of:
- **Available** — phases with a per-phase review-report you'll include in the synthesis
- **Missing** — phases without a per-phase review-report (flagged in the consolidated report's Executive Summary so operators know coverage is partial)

Also check for `026/review/batch-phase-review-state.json` — if it exists, use it as a secondary source of machine-readable finding counts and verdicts to cross-check against the per-phase reports.

Synthesis should proceed even if some phases are missing. Never fail hard because of a missing report; just document the gap.

## MANDATORY READS (read in this order)

1. **Discovery first**: list `026/review/` contents to identify which `<phase-slug>/review-report.md` files exist
2. **Batch state** (if exists): `026/review/batch-phase-review-state.json` — for phase completion metadata + aggregate finding counts
3. **Per-phase reports** (in phase-slug numeric order): `026/review/<phase-slug>/review-report.md` for every available phase
4. **Per-phase findings registries** (machine-readable detail): `026/review/<phase-slug>/deep-review-findings-registry.json` for every available phase
5. **Parent 15-iter review** (for comparison): `026/review/review-report.md` — the earlier session 2026-04-09T03:59:45Z review that found 6 P1 findings clustered in packets 009/011/012/013
6. **Parent findings registry**: `026/review/deep-review-findings-registry.json`

You may optionally sample 1-2 iteration files per phase (`026/review/<phase-slug>/iterations/iteration-NNN.md`) if a per-phase report is light on evidence and you need more detail for the Cross-Phase Patterns section — but only do this when the per-phase report is insufficient. Do NOT read all 65+ iteration files.

## SYNTHESIS PROTOCOL

1. **Parse each per-phase report** — extract verdict, finding counts (P0/P1/P2), key findings list, cross-references, recommended remediation
2. **Deduplicate findings across phases** — if two phases flag the same underlying bug (e.g., a cross-cutting issue in `session-bootstrap.ts` that touches both 005 and 011), dedupe by file:line + normalized title. Keep the highest severity. Note the phases that reported it.
3. **Cluster findings by severity** — build P0/P1/P2 lists
4. **Cluster findings by theme** — identify recurring patterns:
   - Packets that overclaim runtime vs what shipped (impl-summary.md claims more than the code delivers)
   - Packets with helper-only implementations missing their spec-named consumers
   - Packets with test harnesses that bypass real code paths (mock out the very surface they claim to test)
   - Packets with fail-closed contract violations (error paths widen authority instead of failing closed)
   - Cross-phase dependency gaps (packet X consumes packet Y's contract but Y isn't fully plumbed)
5. **Compare with parent review** — the parent 15-iter review at `026/review/review-report.md` found 6 P1 findings (DR-026-I001 through DR-026-I006) clustered in packets 009/011/012/013. For each parent finding:
   - Is it still present in the batch reviews? (not remediated)
   - Is it resolved? (the 009 remediation cycle or other fixes addressed it)
   - Was it caught by the per-phase review too? (redundant confirmation)
   - Was it NEW to the batch reviews? (caught something the parent review missed)
6. **Rank remediation** by (severity × cross-phase impact × blocks-other-phases). P0 always ranks above P1 regardless of cross-phase impact.
7. **Derive overall verdict** — PASS if aggregate P0 == 0 and P1 == 0; CONDITIONAL if P0 == 0 and P1 > 0; FAIL if any P0.

## OUTPUT FILE — `026/review/batch-phase-review-consolidated.md`

Write exactly one file with this structure:

```markdown
---
title: "Batch Phase Review Consolidated Report — 026 Phases 002-014"
description: "Consolidated verdict across {N} child phases of 026-graph-and-context-optimization. Aggregate findings: {N} P0 / {N} P1 / {N} P2. Overall program verdict: {verdict}."
trigger_phrases:
  - "026 batch review consolidated"
  - "026 phase-by-phase review synthesis"
  - "026 aggregate findings report"
  - "026 program verdict"
importance_tier: "important"
contextType: "review-report"
---

# Batch Phase Review Consolidated Report — 026 Phases 002-014

## 1. Executive Summary

- **Scope**: 13 phases under `026-graph-and-context-optimization/`, reviewed via 5-iteration deep-review per phase (total planned iterations: 65, actual may be lower due to convergence-driven early stops)
- **Phases with per-phase review reports available**: {N} of 13 — list
- **Phases MISSING review reports**: {list or "none"}
- **Total iterations executed across available phases**: {sum from per-phase state.jsonl records}
- **Aggregate findings by severity**:
  - P0 (Blockers): {n}
  - P1 (Required): {n}
  - P2 (Suggestions): {n}
- **Phases that early-stopped on convergence**: {list with iteration count}
- **Overall 026 program verdict**: PASS / CONDITIONAL / FAIL
- **Rationale for verdict**: 1-paragraph summary

---

## 2. Per-Phase Verdict Table

| Phase | Iterations | Verdict | P0 | P1 | P2 | Top Finding |
|-------|-----------|---------|----|----|----|-------------|
| 002-implement-cache-warning-hooks | {n} | {PASS/CONDITIONAL/FAIL or MISSING} | {n} | {n} | {n} | {short summary} |
| 003-memory-quality-issues | ... | | | | | |
| 004-agent-execution-guardrails | | | | | | |
| 005-provisional-measurement-contract | | | | | | |
| 006-structural-trust-axis-contract | | | | | | |
| 007-detector-provenance-and-regression-floor | | | | | | |
| 008-graph-first-routing-nudge | | | | | | |
| 009-auditable-savings-publication-contract | | | | | | |
| 010-fts-capability-cascade-floor | | | | | | |
| 011-graph-payload-validator-and-trust-preservation | | | | | | |
| 012-cached-sessionstart-consumer-gated | | | | | | |
| 013-warm-start-bundle-conditional-validation | | | | | | |
| 005-code-graph-upgrades | | | | | | |

---

## 3. Aggregate Findings — All Active P0 and P1

Group by phase. For each finding include:

- Finding ID (e.g., DR-026-{phase-short}-I00N-P{0|1}-00N)
- Title (one line)
- Affected phase(s) — list all phases where this surfaced
- Severity (P0 / P1)
- Dimension (D1 Correctness / D2 Security / D3 Traceability / D4 Maintainability)
- Summary (2-4 sentences)
- Evidence references (file:line)
- Typed claim-adjudication block (preserved from the per-phase report if present)

P2 findings: list as a compact appendix table (Finding ID / Title / Phase / File) without full claim blocks.

---

## 4. Cross-Phase Patterns

Identify recurring themes across the 13 phases. For each pattern:

- Pattern name (e.g., "Helper-only implementation missing consumer")
- Phases affected
- Severity cluster (where does the pattern surface as P0/P1/P2)
- Recommended structural remediation (one fix that addresses the root cause across all affected phases)

Typical patterns to look for:
- **Overclaim vs ship**: impl-summary.md describes more runtime than actually landed
- **Helper-only shipment**: packet ships a helper function but no consumer handler wires it in
- **Test harness bypass**: tests mock the surface they claim to verify, hiding real failures
- **Fail-closed violations**: error paths widen authority instead of returning null/throwing
- **Cross-phase dependency gap**: packet X consumes packet Y's contract but Y's plumbing is incomplete
- **Doc-only fallback downgrade paths**: findings that have a doc rewrite downgrade to P2 honesty

---

## 5. Comparison with the Earlier 15-iter Parent Review

The existing `026/review/review-report.md` (session `2026-04-09T03:59:45Z`) reviewed the 026 parent packet with 15 iterations and surfaced 6 P1 findings clustered in packets 009/011/012/013:

- DR-026-I001: Packet 011 does not preserve structural trust through session_resume payload
- DR-026-I002: Packet 012's frozen-corpus proof does not exercise real session_resume/session_bootstrap/session-prime surfaces
- DR-026-I003: Packet 013's bundle benchmark cannot observe pass-rate regressions
- DR-026-I004: Packet 009 marks publication contract implemented without a live consumer
- DR-026-I005: session_bootstrap synthesizes live structural trust onto errored resume outputs
- DR-026-I006: Unscoped cached continuity selection reuses newest project hook state cross-session

For each of the 6 parent-review findings, compare with the batch review's per-phase findings:

| Parent Finding ID | Status in Batch Review | Evidence |
|-------------------|------------------------|----------|
| DR-026-I001 | PRESENT / RESOLVED / DOWNGRADED / UNVERIFIED | {which phase's report flagged it or confirmed resolution} |
| DR-026-I002 | ... | |
| DR-026-I003 | ... | |
| DR-026-I004 | ... | |
| DR-026-I005 | ... | |
| DR-026-I006 | ... | |

Also note:
- **NEW findings caught by the batch review that the parent review missed** — these are new signal from the per-phase deeper audits
- **Findings both reviews missed** — harder to enumerate, but if any phase review revealed a systemic pattern the parent review would have caught on a 16th iteration, note it as a known blind spot

---

## 6. Remediation Priority Queue

Rank open P0/P1 findings by:
1. Severity (P0 first)
2. Cross-phase impact (findings affecting multiple phases rank higher)
3. Blocks-other-phases (findings that block downstream consumers rank higher)
4. Remediation effort (ties broken by smaller remediation ranking higher — ship small fixes first)

Present as an ordered list. For each item:

1. **Lane N — {finding title}** (severity, affected phases)
   - Target files: {file:line list}
   - Effort: S/M/L
   - Recommended fix: 1-2 sentence summary
   - Downgrade path (if any): doc-only rewrite option that converts the P1 to P2

---

## 7. Verdict Trajectory for the 026 Train

Document the 026 verdict history:

- **Pre-session state** (before 2026-04-08): prior commits and the state of the 026 train before the deep-review cycle started
- **After the original 9-packet ship** (commit 33823d006): runtime shipped but unreviewed
- **After the 15-iter parent review** (2026-04-09T03:59:45Z): CONDITIONAL with 6 P1 findings
- **After the 9-packet remediation** (commit ef30b31f7 + verification): PASS for the 4 affected packets
- **After packet 014 shipped + regression floor** (commits 2837e157a + 66bd323bb + df4c14745): 014 complete
- **After 009 render-layer fix + gap closure** (commit eb1f49c3e + f90ba01cd): memory pipeline compliant
- **Current verdict from this batch review**: {PASS / CONDITIONAL / FAIL with finding count}
- **Recommended next step**: ship to main / hold for remediation / open PR / re-review after further fixes

---

## 8. Next Steps

Concrete operator actions, ordered by priority:

1. For each P0 finding: specific remediation needed before ANY release claim
2. For each P1 finding: either ship fix before release OR document as known issue with downgrade-to-P2 rationale
3. For each recurring pattern in §4: consider a structural fix (e.g., one packet that addresses the pattern across all affected phases)
4. For each MISSING per-phase review: decide whether to dispatch the corresponding batch prompt to fill the coverage gap
5. For the 026 branch itself: commit trajectory recommendation (open PR, merge to main, hold)

---

## 9. Data Provenance

- Per-phase reports read: {list of paths}
- Per-phase findings registries read: {list of paths}
- Parent review consulted: `026/review/review-report.md` (session 2026-04-09T03:59:45Z)
- Synthesis timestamp: {ISO now}
- Synthesis session id: {ISO now}-consolidated
- Synthesizer: cli-codex gpt-5.4 high fast
```

Match this structure exactly. If a section has no relevant content (e.g., §8 MISSING per-phase review list is empty because all 13 are present), include the section with a "None applicable" note rather than omitting it.

## CONSTRAINTS (absolute)

- **Synthesis only** — do NOT run any new review iterations. Read existing per-phase reports, aggregate, write the consolidated file.
- **Read-only for all inputs** — do NOT modify any `<phase-slug>/review-report.md`, any `<phase-slug>/deep-review-*.{json,jsonl,md}`, or `026/review/review-report.md` (the parent 15-iter review). Do NOT modify `026/review/iterations/*.md` (parent iteration files).
- **Write exactly one output file**: `026/review/batch-phase-review-consolidated.md`. Overwrite if it exists, create if not.
- **Handle missing phases gracefully** — if some phases lack a per-phase review-report, note them in §1 Executive Summary under "Phases MISSING review reports" and in §2 Per-Phase Verdict Table rows with verdict `MISSING`. Proceed with synthesis using whatever is available; never fail-fast.
- **No commits** — leave the new consolidated file uncommitted for operator review.
- **No new test files, no new scratch notes, no new memory saves**. This is a single-file write operation.
- **Tool-call budget**: target ≤ 30 tool calls total. Read every per-phase report and registry (2 reads × N phases = ~26 reads), plus the parent review artifacts (~2 reads), plus the discovery ls (~1 call), plus the final write (~1 call). Stay bounded.
- **Honesty**: if a per-phase report is confusing, contradictory, or obviously thin (e.g., only 1 iteration completed before an early stop for the wrong reason), note that in §9 Data Provenance. Do NOT paper over data quality issues.
- **No invented findings**: every finding in §3 must be traceable back to a per-phase report bullet or a findings-registry entry. Do NOT infer new findings during synthesis.

## OUTPUT FORMAT (print at the very end)

```
=== SYNTHESIZE_026_CONSOLIDATED_REVIEW_RESULT ===
CONSOLIDATED_REPORT_PATH: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/batch-phase-review-consolidated.md
CONSOLIDATED_REPORT_LINES: <n>

PHASES_AVAILABLE: <n> of 13 (<list of slugs with available per-phase reports>)
PHASES_MISSING: <n> of 13 (<list of slugs or "none">)

AGGREGATE_FINDINGS_SYNTHESIZED:
  P0: <n>
  P1: <n>
  P2: <n>

OVERALL_026_VERDICT: PASS | CONDITIONAL | FAIL
VERDICT_RATIONALE: <one-line summary>

CROSS_PHASE_PATTERNS_IDENTIFIED: <n>
TOP_PATTERNS:
  - <pattern 1> (<affected phases>)
  - <pattern 2> (<affected phases>)
  - <pattern 3> (<affected phases>)

COMPARISON_WITH_PARENT_REVIEW:
  parent_findings_still_present: <n> of 6
  parent_findings_resolved: <n> of 6
  parent_findings_unverified: <n> of 6
  new_findings_caught_by_batch: <n>

REMEDIATION_QUEUE_LENGTH: <n> items

EXISTING_REVIEW_ARTIFACTS_PRESERVED: yes | no
  (verify 026/review/review-report.md + 026/review/iterations/*.md + 026/review/deep-review-*.{json,jsonl,md} + every <phase-slug>/review-report.md stayed untouched)

BLOCKERS: <list or "none">

NEXT_STEP_RECOMMENDATION:
  - If verdict PASS: ship to main or open PR
  - If verdict CONDITIONAL: remediate P1 findings per the §6 queue, re-review after fixes
  - If verdict FAIL: hold release; address P0 blockers immediately
  - If PHASES_MISSING > 0: dispatch the corresponding batch review prompt to fill coverage gaps, then re-run this synthesis
=== END_SYNTHESIZE_026_CONSOLIDATED_REVIEW_RESULT ===
```

Parent spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (pre-approved, skip Gate 3)
