# Deep-Research Iteration 001 — Focus: 010/001 license posture + 010/002 phase-runner + detect_changes preflight

You are a fresh-context deep-research executor (cli-codex gpt-5.5 high fast). No memory of prior iterations.

## Your role

Audit the shipped code for **010/001 (clean-room license audit)** and **010/002 (phase-DAG runner + detect_changes preflight)** with a **review angle**: does the code actually behave the way the docs claim, and are there reachable adversarial inputs that bypass the safety invariants?

**You are READ-ONLY.** Do not modify any files.

## Read first (in this exact order)

1. The strategy doc that frames the entire 10-iteration run:
   `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/strategy.md`

2. The 010/001 + 010/002 spec docs (truth claim):
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/001-clean-room-license-audit/spec.md`
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes/spec.md`
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes/implementation-summary.md`

3. The shipped code (audit target):
   - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` (lines 1369–1525, where `runPhases` is wrapped)
   - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.js` (or `.ts`)

4. The shipped tests (claim of coverage):
   - `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/phase-runner.test.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts`

5. Spot-check (do NOT trust without verification):
   - `LICENSE` at root (was the LICENSE/scrub posture defensible?)
   - `external/` — any leftover external-project references?

## What to look for

**For 010/001 (license audit):**
- Was the GitNexus/external-project name actually scrubbed everywhere? `grep -r "GitNexus\|gitnexus\|git-nexus"` — should return zero hits or only legitimate cross-references in spec docs.
- Is the license posture truly defensible without quoting an external license?

**For 010/002 (phase runner):**
- Does `runPhases` reject duplicate phase names AND duplicate output keys (010/007/T-D/R-007-P2-1)?
- Does the topological sort detect cycles correctly?
- Is the `runPhases` call in `structural-indexer.ts` wrapped in try/catch/finally so the `outcome: 'error'` metric emits on failure (010/007/T-F/R-007-P2-2)?
- What happens if a phase produces a non-string output key? Or an empty string?

**For 010/002 (detect_changes preflight):**
- Does `ensureCodeGraphReady` block on `'stale'` state (R-002-4 P1 invariant)? What about `'empty'` and `'error'` states?
- Does the diff parser correctly track `remainingOldLines` / `remainingNewLines` per hunk so the next file's `--- a/<path>` header doesn't get eaten as a hunk-body line (R-007-4)?
- Is the canonical-root path containment tight? Specifically:
  - Does `--- a/../../etc/passwd` get rejected with `status: 'parse_error'`?
  - What about `--- a/legitimate/../../../etc/passwd`?
  - What about a path with NUL bytes, control characters, or symlink-escape attempts?
  - Absolute paths (`--- a/etc/passwd` with no leading slash but treated as absolute by the canonicalizer)?
  - Windows-style backslash paths if any?
- Does the readiness probe run BEFORE any parsing (so a stale graph never accidentally returns `'ok'` with empty `affectedSymbols`)?

## Output contract

Write your findings to:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-001.md`

**Format:**

```markdown
# Iteration 001 — 010/001 + 010/002 review

**Focus:** [1 sentence reminder]
**Iteration:** 1 of 10
**Convergence score:** [0.00–1.00, where 1.00 = no further investigation needed]

## Findings

### F1: [short title]
- **Severity:** P0 / P1 / P2
- **Remediation type:** code-fix / doc-fix / test-add / scope-defer
- **Maps to:** RQ1 / RQ2 / RQ3 / RQ4 / RQ5
- **Evidence:**
  - `path/to/file.ts:NN-MM` — [what the code does]
  - `path/to/spec.md:section` — [what the docs claim]
  - **Mismatch / risk:** [the actual gap]
- **Suggested action:** [how to close]

### F2: ...
[etc., 3-10 findings total]

## Negative findings (ruled out)
- [Anything you investigated and found CLEAN — important for convergence]

## RQ coverage this iteration
- RQ1: [covered / partial / not-yet]
- RQ2: ...

## Next iteration recommendation
[1-2 sentences on what iteration 002 should focus on]
```

Also append a JSONL line to:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/deltas/iteration-001.jsonl`

```jsonl
{"iter":1,"convergence_score":<0.0-1.0>,"findings":[{"id":"F1","severity":"P0|P1|P2","remediation":"code-fix|doc-fix|test-add|scope-defer","rq":"RQ1|...|RQ5","title":"..."}],"rq_coverage":{"RQ1":"covered|partial|not-yet","RQ2":"...","RQ3":"...","RQ4":"...","RQ5":"..."},"new_p0":<int>,"new_p1":<int>,"new_p2":<int>}
```

## Hard rules

1. Read code on `main` directly. Do NOT trust implementation-summary.md as primary evidence.
2. Cite file:line for every claim. Vague claims = invalid finding.
3. If you cannot reproduce a documented behavior from the code path, say so explicitly (P1: drift between docs and code).
4. Negative findings (ruled-out concerns) are AS VALUABLE as positive findings — they bound convergence.
5. Stay within 010/001 + 010/002 scope this iteration. Out-of-scope concerns get noted as "for iteration X" deferrals, not detailed here.
6. Tool budget: target 8 tool calls, max 12.

You are running on a fast-tier cli-codex agent. Be efficient. Be source-cited. Be honest about what you can and cannot verify.

`EXIT_STATUS=DONE | findings=N | convergence=X.XX | next=iter-002` on the last line of your message.
