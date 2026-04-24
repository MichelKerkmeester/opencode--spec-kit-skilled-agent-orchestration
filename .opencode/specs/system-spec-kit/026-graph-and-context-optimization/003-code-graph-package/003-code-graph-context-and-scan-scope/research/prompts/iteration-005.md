# Deep-Research Iteration 5 (FINAL) — Synthesis-Ready Cross-Check + Executive Summary

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 5 of 5 (FINAL — max_iterations cap)
Questions: All primary questions answered. Implementation handoff complete.
Last 2 ratios: 0.41 -> 0.34 | Stuck count: 0 | Rolling avg(0.62, 0.41, 0.34) = 0.457 (declining toward 0.05)
Next focus: Final cross-check — verify the recommendations against the actual current dist/ build; identify any missed risks/edge cases; produce a synthesis-ready executive summary that the workflow's `phase_synthesis` can lift directly into research.md.

Research Topic: Why mcp__spec_kit_memory__code_graph_scan returned 33 files / 809 nodes / 376 edges after packet 012, when expected was 1000-3000.

## Confirmed state from iter-1, 2, 3, 4

**Two P0 bugs identified:**
1. **Stale-gate bug** — `indexFiles()` ignores caller's `incremental:false`; full-scan cleanup prunes DB to stale-only set (33 files instead of 1425).
2. **Duplicate-symbol bug** — Parser captures collapse to same `symbolId` for 3 indexer-self files; `code_nodes.symbol_id` UNIQUE constraint fires.

**Fixes designed (no code changes yet):**
- F1: `IndexFilesOptions { skipFreshFiles?: boolean }`, default true; handler passes `{skipFreshFiles: effectiveIncremental}`.
- F2: Dedup in `capturesToNodes()` via `seenSymbolIds: Set<string>` (Option A — minimal crash guard).
- Response payload supplement: `fullScanRequested`, `effectiveIncremental` (additive only).

**Implementation handoff:**
- Spec folder: nested Level 3 packet `003-code-graph-package/003-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery/`.
- Tasks T-001..T-011 ordered (indexFiles options → scan handler mode → capturesToNodes dedup → response fields → tests → build → runtime scan).
- Risks R1-R6 with mitigations.
- Acceptance criteria AC-1..AC-8 with concrete pass/fail.

## STATE FILES

All paths relative to repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

- Strategy: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/deep-research-strategy.md`
- Prior iterations: iteration-001.md through iteration-004.md (all in research/007-deep-review-remediation-pt-04/iterations/)
- State Log (APPEND): `.../007-deep-review-remediation-pt-04/deep-research-state.jsonl`
- Write iteration narrative: `.../007-deep-review-remediation-pt-04/iterations/iteration-005.md`
- Write delta file: `.../007-deep-review-remediation-pt-04/deltas/iter-005.jsonl`

## CONSTRAINTS

- LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls. Max 15 minutes.
- **DO NOT modify production code.** Last research iteration before synthesis.
- This is the FINAL iteration — make sure all open follow-ups from iter-1..4 are explicitly addressed (answered or formally deferred).

## INVESTIGATION GOALS (priority order)

### G1 (P0): Verify dist/ build state matches the source-level findings

The MCP server runs from `dist/`. Spot-check that:

1. `dist/code-graph/lib/structural-indexer.js` — does it currently still have the unconditional `isFileStale()` filter (i.e., does the running build have the bug)? Use `grep -n "isFileStale\\|skipFreshFiles" .../dist/code-graph/lib/structural-indexer.js`.
2. `dist/code-graph/lib/indexer-types.js` — confirm `z_future`, `z_archive`, `mcp-coco-index` are present (sanity-check that packet 012 IS in dist).
3. `dist/code-graph/handlers/scan.js` — confirm it currently calls `indexFiles(config)` without options.

If dist matches source for the bug (it should, packet 012 was the trigger), no surprise. If they DIVERGE, that's a new finding.

### G2 (P0): One last hypothesis cross-check — could the 33-file outcome have ANOTHER cause?

Consider these alternative hypotheses that haven't been ruled out yet:

1. **H-alt-1**: A pre-scan migration step (schemaVersion=3 → ?) silently dropped rows. Search for migration code; check `lastPersistedAt` ordering.
2. **H-alt-2**: The `replaceNodes()` UNIQUE crash on the 3 files cascaded — failing those transactions could have aborted the full-scan cleanup mid-flight. If so, the cleanup ran on a partial set. Read transaction boundaries in `code-graph-db.ts` around `replaceNodes`.
3. **H-alt-3**: A racing scan / concurrent MCP request. Check whether scan locks anything.
4. **H-alt-4**: The user's `.gitignore` is unusually aggressive (e.g., ignores the entire `.opencode/` tree). Spot-check `.gitignore` at repo root and any nested ones in `.opencode/skill/`.

For each, either confirm the alternative is ruled out by existing evidence, or note it as a "verify post-fix" item.

### G3 (P0): Synthesis-ready executive summary

Produce a 200-300 word executive summary block that the synthesis phase can lift verbatim into the top of research.md. Structure:

```
## Executive Summary

**Problem:** [one sentence]

**Root cause:** [two sentences — the two P0 bugs in plain language]

**Fix:** [three sentences — F1, F2, response supplement]

**Implementation:** [one sentence — packet topology + sequenced tasks T-001..T-011]

**Verification:** [one sentence — acceptance criteria]

**Impact if shipped:** [one sentence — DB grows from 33 → ~1,425 files, restoring graph completeness]
```

### G4 (P1): Open questions formally addressed

For each "Questions Remaining" entry from prior iterations, state ONE of: (a) answered now, (b) ruled out as out-of-scope, (c) formally deferred to future packet (with packet number recommendation).

Iter-1 remaining:
- "What minimal API change should carry effectiveIncremental into indexFiles()?" → answered (Option A in iter-2)
- "Should duplicate captures be deduplicated, made unique by line, or fixed at parser layer?" → answered (Option A chosen iter-2/iter-3)
- "Should fullReindexTriggered be renamed?" → answered (supplement, not rename — iter-2 G4)

Iter-2 remaining: (none new — folded into iter-3 verification)

Iter-3 remaining:
- "Should filesScanned be supplemented with discovered-candidate count?" → defer to packet 014?
- "Should method_signature be added to JS_TS_KIND_MAP?" → defer to follow-up packet (parser-completeness)?

### G5 (P2): Synthesis hand-off checklist

Confirm that everything `phase_synthesis` needs is in place:

- [ ] All 5 iterations have iteration-NNN.md narratives (check)
- [ ] All 5 iterations have iter-NNN.jsonl delta files
- [ ] state.jsonl has 5 type:iteration records
- [ ] strategy.md has the 5 key questions
- [ ] No "TODO" / "TBD" markers left in iteration narratives
- [ ] Executive summary (G3) is synthesis-ready

## OUTPUT CONTRACT (mandatory)

Three artifacts:

1. **Iteration narrative** at `.../iterations/iteration-005.md`. Sections: Focus, Actions Taken, Dist Verification (G1), Alternative Hypotheses Cross-Check (G2 — table), Executive Summary (G3 — exact 200-300 word block ready to lift), Open Questions Resolution (G4), Synthesis Hand-Off Checklist (G5), Final Verdict, Next Focus = "synthesis".

2. **JSONL iteration record** APPENDED to state log:
```json
{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"<insight|thought|partial|error>","focus":"final cross-check and synthesis prep","graphEvents":[]}
```

3. **Per-iteration delta file** at `.../deltas/iter-005.jsonl`. Iteration record + per-event records (verification, ruled_out, recommendation, deferral).

## START

Begin Iteration 5. G1 first (dist verification — quick), then G2 (alt hypotheses), then G3 (executive summary), then G4/G5.
