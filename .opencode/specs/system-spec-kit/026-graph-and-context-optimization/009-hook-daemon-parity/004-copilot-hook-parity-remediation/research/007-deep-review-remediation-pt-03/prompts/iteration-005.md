# Deep-Research Iteration 5 of 10

## STATE

STATE SUMMARY:
Segment: 1 | Iteration: 5 of 10
Last iteration newInfoRatio: 0.72 | Stuck count: 0

Research Topic (unchanged): Copilot CLI 1.0.34 hook-config JSON schema resolution. Resolve the `"Neither 'bash' nor 'powershell' specified in hook command configuration"` execution failure blocking 026/009/004 copilot-hook-parity-remediation. Deliver a primary-source-backed schema explanation, a concrete JSON patch to `.github/hooks/superset-notify.json`, AND an empirical reproducer where the patch makes Copilot log successful hook execution.

## PRIOR ITERATION STATE

Last completed: iteration-004. Read:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/iterations/iteration-004.md` — full prior findings
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deep-research-strategy.md` — KQ tracker
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/findings-registry.json` — consolidated registry
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deep-research-state.jsonl` — JSONL history

## PRIOR NEXT-FOCUS ANCHOR


Build an isolated reproducer with both a valid `.github/hooks/superset-notify.json` and a Claude-style `.claude/settings.local.json` `UserPromptSubmit` wrapper. Confirm it logs the same missing-shell failure, then test the smallest mitigation that preserves the `.github/hooks` flat `bash` hook while neutralizing the Claude wrapper for Copilot.

## CONVERGENCE RULES

- Research terminates at iteration 10 OR when newInfoRatio < 0.05 for 3 consecutive iterations.
- When converged, mark status as "converged" in the JSONL record and write a sub-section "Convergence signal met" in the iteration markdown.
- Every finding MUST cite a source (file:line, URL, or shell-command-timestamp).
- Do NOT mutate .github/hooks/superset-notify.json or any hook script in this run — research only.

## OUTPUT CONTRACT

1. Iteration narrative: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/iterations/iteration-005.md`
2. JSONL append to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deep-research-state.jsonl`:
   `{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"<string>","focus":"<string>","graphEvents":[...]}`
3. Delta file: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-03/deltas/iter-005.jsonl` — with iteration record + per-event (finding, invariant, observation, edge, ruled_out) records.

## ITERATION 5 DIRECTIVES

Advance the research. If prior focus is still open, extend it with fresh evidence and new angles. If prior focus is exhausted, shift to the next-highest-value unanswered KQ. Each iteration should reduce KQ open-count or add decisive primary-source evidence; if neither is possible, RULE OUT a direction explicitly.

Be disciplined about convergence — do not pad. If the previous iteration produced a complete schema answer + patch + reproducer already, respond with status "converged" and newInfoRatio <= 0.05 so the loop stops cleanly.

Write the 3 artifacts now.
