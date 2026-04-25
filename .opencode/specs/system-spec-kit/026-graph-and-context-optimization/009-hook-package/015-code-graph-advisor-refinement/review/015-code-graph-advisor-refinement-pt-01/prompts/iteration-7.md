# Deep-Review Iteration 7 of 7 — FINAL — cli-codex gpt-5.5 high

You are the @deep-review LEAF agent. Do NOT dispatch sub-agents. READ-ONLY review. Max 12 tool calls. **GATE 3 PRE-APPROVED.**

## STATE

Iter 7 of 7 (FINAL) | Iter 6 produced 0 new findings (convergence signal) | Verdict so far: CONDITIONAL (no P0)
Ratios: 1.00 → 0.50 → 0.40 → 0.33 → 0.27 → 0.00 — **converged**

## STATE FILES (absolute)

Spec folder: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement`
Artifact dir: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement/review/015-code-graph-advisor-refinement-pt-01`

- Read iter-001 through iter-006 + their deltas (jsonl) to enumerate all open findings post-dedupe/resev
- Write narrative to: `<artifact-dir>/iterations/iteration-007.md`
- Write delta to: `<artifact-dir>/deltas/iter-007.jsonl`
- Append iteration record to: `<artifact-dir>/deep-review-state.jsonl`

## ITER-7 FOCUS — FINAL SYNTHESIS

**Produce the authoritative remediation roadmap.**

1. **Master findings table:** Enumerate every open finding (P0/P1/P2) with columns:
   - Finding ID
   - Severity (post-resev)
   - Dimension
   - PR source
   - Title
   - File:line evidence
   - Recommended fix (1-line)
   - Effort (S/M/L hours)
   - Dedupe note (if relevant)

2. **Verdict:** Determine the FINAL verdict per sk-deep-review contract:
   - **PASS** — no P0 + ≤2 P1 (low-risk merge); may have `hasAdvisories=true` if P2s exist
   - **CONDITIONAL** — no P0 + 3+ P1 (merge after P1 fixes; advisory mode)
   - **FAIL** — any P0 (do not merge)
   
   Also report: total P0/P1/P2 counts, dimensions covered, convergence reason (max iterations vs threshold-met).

3. **Remediation sequencing:** If verdict is CONDITIONAL or FAIL, propose a "Phase 7 fix-up" plan ordering:
   - Group findings into ~3-5 fix batches by file/PR
   - Estimate total fix effort
   - Identify any finding that's a one-line surgical edit vs. a multi-file refactor

4. **Delta record types in iter 7:**
   - `{"type":"verdict","value":"PASS|CONDITIONAL|FAIL","p0":N,"p1":N,"p2":N,"hasAdvisories":bool,"convergence":"max_iters|threshold","note":"..."}`
   - `{"type":"remediation_plan","batches":[{"id":"B1","findings":["Rx-Px-NN"],"effortHours":N,"description":"..."}],"totalEffortHours":N}`
   - `{"type":"finding",...}` only if a NEW finding emerges (don't expect any)

5. **Validate JSONL schema integrity:** Spot-check that all delta files (iter-001 through iter-007) parse cleanly with `python3 -c "import json,sys;[json.loads(l) for l in open(p)]" <delta-file>` for each. Report any malformed records.

## OUTPUT CONTRACT

Three artifacts. Schema same. The iter-7 iteration record should include `"convergenceReason":"max_iters_reached|threshold_met"` and `"finalVerdict":"PASS|CONDITIONAL|FAIL"` fields.

This is the FINAL iteration. After your write, the workflow transitions to synthesis (review-report.md compilation) and save phases.

Start now.
