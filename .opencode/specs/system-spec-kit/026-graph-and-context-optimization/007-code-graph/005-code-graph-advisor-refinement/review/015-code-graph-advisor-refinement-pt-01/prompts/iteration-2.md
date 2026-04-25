# Deep-Review Iteration 2 of 7 — cli-codex gpt-5.5 high

You are the @deep-review LEAF agent. Do NOT dispatch sub-agents. Write ALL findings to files. READ-ONLY review. Max 12 tool calls.

## STATE

Iteration: 2 of 7 | Open findings: 4 (3 P1 + 1 P2 from iter 1) | newFindingsRatio rolling: 1.00
Verdict so far: CONDITIONAL (no P0, but 3 P1 require fixes)

**Iter-1 findings carried forward (DO NOT re-report; build on them):**
- R1-P1-001: PR-4 startup-brief trust-state drift
- R1-P1-002: PR-3 delete-sweep traceability mismatch
- R1-P1-003: PR-5 metrics cardinality risk from env-derived labels
- R1-P2-001: stale manual evidence for deleted promotion suite

**Iter-2 focus:** Cover PRs not yet reviewed + adversarial self-check on iter-1 findings.

1. **PR 1** (corpus path fix in parity test): verify the path now exists, the constant `SPECKIT_BENCH_CORPUS_PATH` is exported correctly, no other test files reference the old path
2. **PR 6** (cache invalidation listener): verify the listener is at module-init scope (NOT request-handler scope), the uniqueness test actually catches duplicate registration
3. **PR 7** (settings parity test): verify the test asserts the NESTED schema correctly post-correction (matcher + nested hooks[]); verify it skips cleanly outside Claude
4. **PR 8/9/10 (benches):** quickly verify they don't have obvious bugs (correct metric names, fixture paths exist, no infinite loops)
5. **Adversarial self-check on iter-1 findings:** For each iter-1 P1, attempt to falsify it. E.g., for R1-P1-002 (delete-sweep traceability), is there evidence the agent actually checked all 12 doc files were deleted?
6. **Cross-PR interaction check:** Did PR 5 (metrics) accidentally introduce code paths that PR 4 (vocab) didn't update? Specifically check that any new V2-enum labels in metrics use the unified vocabulary.

## STATE FILES (absolute)

Spec folder: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement`
Artifact dir: `<spec-folder>/review/015-code-graph-advisor-refinement-pt-01`

- Prior iter narrative: `<artifact-dir>/iterations/iteration-001.md` (READ for context, do not duplicate findings)
- **Write iteration narrative to:** `<artifact-dir>/iterations/iteration-002.md`
- **Write delta file to:** `<artifact-dir>/deltas/iter-002.jsonl`
- **Append JSONL iteration record to:** `<artifact-dir>/deep-review-state.jsonl`

## OUTPUT CONTRACT

Three artifacts (narrative md, JSONL iteration record, delta jsonl). Schema same as iter 1.

For adversarial self-check, emit either:
- A `{"type":"finding","id":"R2-...","relatedTo":"R1-P1-001","action":"escalated|confirmed|softened|invalidated","note":"..."}` record per iter-1 finding you re-examined, OR
- A `{"type":"validation","relatedTo":"R1-P1-001","verdict":"upheld|softened","evidence":"..."}` record if no change in severity

Target newFindingsRatio: 0.5+ (mix of new findings + iter-1 validations).

Start now.
