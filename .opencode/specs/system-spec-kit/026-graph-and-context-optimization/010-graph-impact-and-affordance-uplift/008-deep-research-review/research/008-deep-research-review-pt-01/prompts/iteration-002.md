# Deep-Research Iteration 002 — Defensive audit of 010/002 input validation

You are a fresh-context deep-research executor (cli-codex gpt-5.5 high fast). No memory of prior iterations. This is a **defensive code review** of an internal code-graph tool. The goal is to verify the input-validation layer is complete; we are auditing OUR OWN shipped code to find gaps a future user-supplied diff might expose, so we can close them with tests and tighter validators. Read-only — no code changes.

## Iteration 1 surfaced these gaps — extend the audit, do not duplicate

Iter 1 wrote findings to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-001.md`. Read it first. Key open items:

- **F1 (P1) — needs deeper verification**: `detect-changes.ts:141-156` validates only the chosen path (the post-image path unless it's `/dev/null`). The unused pre-image path is not put through the same containment check. Iter 1's evidence shows the existing test only covers both-side-escape, not single-side-escape. Confirm by tracing the code path and report whether this is a real gap or a misreading.
- **F2 (P2) — extend**: input-character validation is absent on diff path strings. Iter 1 cites `detect-changes.ts:143-156` and `diff-parser.ts:171-182`. Audit for byte-level safety guarantees — what character classes are accepted, where? Do any reachable code paths trip on non-printable bytes, embedded delimiters, or platform-separator confusion?
- **F3 (P2) — extend**: `phase-runner.ts:69-71` runtime guard for output keys is type-only. Confirm the runtime contract.

## Your audit checklist (verify each — cite line that handles, OR line that misses)

For each item below, the answer should be either:
- **HANDLED**: cite the exact `file:line` that rejects/normalizes the input, or
- **GAP**: cite the exact `file:line` where the input is accepted with no further validation, plus the downstream consequence.

### Section A — Diff path containment (extends F1)

Audit the path-resolution logic in `detect-changes.ts:100-180`:

- A1. When `oldPath` resolves outside the workspace but `newPath` is in-root, what happens? Does the handler still proceed using `newPath`? Trace through `resolveCandidatePath`. (Iter 1 says GAP — confirm.)
- A2. When `newPath` resolves outside but `oldPath` is in-root, what happens?
- A3. When both are `/dev/null`, what happens?
- A4. Pure-add (`oldPath = /dev/null`, `newPath` in-root) — handled?
- A5. Pure-delete (`oldPath` in-root, `newPath = /dev/null`) — handled?

### Section B — Path string sanitization (extends F2)

Audit `diff-parser.ts:171-182` and `detect-changes.ts:143-156`:

- B1. NUL byte (`\\x00`) in a diff path — does any layer reject? Cite the rejection or note the gap.
- B2. Control characters (`\\x01–\\x1F`, `\\x7F`) in a diff path — handled?
- B3. Newlines or tabs in a diff path — handled?
- B4. Backslash separators (Windows-style) — does the resolver normalize, reject, or accept-as-literal-filename?
- B5. Embedded `..` after a legitimate prefix (e.g. `src/legitimate/../../../`) — does normalization handle it correctly?
- B6. Single-dot segments (`./`) — collapsed by normalization?
- B7. Trailing slash (`/`) — accepted as a directory or rejected?
- B8. Empty path string after `--- a/` — handled?
- B9. Path length > 4096 bytes — handled or accepted?

### Section C — Diff parser line-counter contract

Audit `diff-parser.ts` hunk-body counting:

- C1. A hunk whose `@@ -A,B +C,D @@` declares B/D line counts inconsistent with the actual body — does the parser detect mismatch?
- C2. A truncated hunk (body ends mid-`@@` budget, no terminating header) — handled?
- C3. Over-budget body (more `+`/`-` lines than declared) — handled? What gets attributed?
- C4. `\\No newline at end of file` markers — counted correctly per side?
- C5. Binary patches (`Binary files differ`) — recognized and skipped?
- C6. Rename/copy headers (`rename from`, `rename to`, `similarity index N%`) — handled or fall through to misparse?

### Section D — Phase runner runtime contract (extends F3)

Audit `phase-runner.ts` runtime guards:

- D1. `phase.name = ""` (empty string) — rejected?
- D2. `phase.output = ""` (empty string) — rejected?
- D3. Non-string `phase.output` (number, object, undefined) passed via JS without TS check — what happens?
- D4. `phase.inputs = ["nonexistent-input"]` — caught by topo sort, or silently never-resolved?

## Read first (in this exact order)

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-001.md`
3. `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts`
4. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts`
5. `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts`
6. `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts`
7. `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/phase-runner.test.ts`

## Output contract

Write to `iteration-002.md` (path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-002.md`):

```markdown
---
_memory:
  continuity:
    next_safe_action: "[1 sentence on iter 003 focus]"
---
# Iteration 002 — 010/002 defensive input validation audit

**Focus:** Extend iter 1's F1/F2/F3 with the A/B/C/D checklist; produce per-item HANDLED or GAP verdicts with citations.
**Iteration:** 2 of 10
**Convergence score:** [0.00–1.00]

## Section A verdicts (diff path containment, extends F1)

- A1: HANDLED at `file:line` / GAP at `file:line` because [reason]
- A2: ...
- A3: ...
- A4: ...
- A5: ...

## Section B verdicts (path string sanitization, extends F2)

- B1: ...
- ...
- B9: ...

## Section C verdicts (diff parser line counter)

- C1: ...
- ...

## Section D verdicts (phase runner runtime guards)

- D1: ...

## New findings (above and beyond the checklist)

### F<N>: [title]
- **Severity:** P0 / P1 / P2
- **Remediation type:** code-fix / doc-fix / test-add / scope-defer
- **Maps to:** RQ1..RQ5
- **Extends iter 1 F#:** [if applicable, else N/A]
- **Evidence:** [file:line citations + exact verdict]
- **Suggested action:** [...]

## Negative findings (cleared this iteration)

- [items confirmed HANDLED — feed convergence]

## RQ coverage cumulative through iter 2

- RQ1: covered/partial/not-yet
- RQ2..RQ5: ...

## Next iteration recommendation

[Iter 003 should focus on 010/003 reason/step round-trip and blast_radius enrichment per strategy.md]
```

JSONL delta to `deltas/iteration-002.jsonl`:

```jsonl
{"iter":2,"convergence_score":<0.0-1.0>,"findings":[{"id":"F<N>","severity":"...","remediation":"...","rq":"...","extends":"F1|F2|F3|null","title":"..."}],"checklist_handled":<int>,"checklist_gap":<int>,"rq_coverage":{...},"new_p0":<int>,"new_p1":<int>,"new_p2":<int>}
```

Last line of your message:
`EXIT_STATUS=DONE | findings=N | convergence=X.XX | checklist=H/G | next=iter-003`

## Hard rules

- This is defensive code-review of an internal tool we own and ship. Goal: produce a checklist of HANDLED-vs-GAP verdicts with line citations so we can add validators and tests. Do not propose attack scenarios; only audit which input shapes the existing code already filters.
- Each verdict must cite a specific `file:line`.
- Negative findings (HANDLED verdicts) are as valuable as GAP verdicts — they bound convergence.
- Tool budget: target 8 tool calls, max 12.
