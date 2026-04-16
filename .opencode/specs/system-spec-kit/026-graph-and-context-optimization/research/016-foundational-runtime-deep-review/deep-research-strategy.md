# Deep Research Strategy -- 016 Foundational Runtime Deep Review

> **Charter:** `016-foundational-runtime-deep-review/scratch/deep-research-batch-prompt.md` (5-domain batch-prompt, 50-iteration budget)
> **Dispatcher:** cli-copilot gpt-5.4 high (manual wave dispatch, NOT `/spec_kit:deep-research` skill loop)
> **Worker:** `gh copilot --model gpt-5.4` via batch-prompt invocations
> **Mode:** MANUAL_WAVE_DISPATCH (3 concurrent workers per wave, 16 waves + final wave of 2)
> **Target:** 50 iterations (hard cap); convergence threshold 0.08 new-info-ratio
> **Backfill note:** This strategy document was authored after the 50-iteration run completed, to bring the research folder into conformance with the standard `/spec_kit:deep-research` skill artifact shape. The run itself was manual and did not use the skill's state-reducer pipeline.

---

## Folder layout

```
research/016-foundational-runtime-deep-review/
├── deep-research-config.json             # state (back-filled)
├── deep-research-state.jsonl             # state (back-filled)
├── deep-research-strategy.md             # this file (back-filled)
├── deep-research-dashboard.md            # snapshot (back-filled)
├── research.md                           # canonical narrative (back-filled)
├── findings-registry.json                # structured registry (back-filled)
├── FINAL-synthesis-and-review.md         # authoritative synthesis (1042 lines, authored during run)
├── interim-synthesis-32-iterations.md    # interim (authored during run)
├── interim-synthesis-38-iterations.md    # interim (authored during run)
├── interim-synthesis-41-iterations.md    # interim (authored during run)
├── interim-synthesis-44-iterations.md    # interim (authored during run)
├── interim-synthesis-47-iterations.md    # interim (authored during run)
└── iterations/
    ├── iteration-001.md
    ├── ...
    └── iteration-050.md
```

---

## Mission

Phase 015 ran 120 deep-review iterations across 920 files but concentrated audit pressure on packets 009, 010, 012, and 014. Foundational runtime packets from earlier phases -- 002 (cache-warning-hooks), 003 (memory-quality-remediation), 005 (code-graph-upgrades), 008 (cleanup-and-audit) -- still carry high leverage with comparatively less follow-on scrutiny. A copilot gpt-5.4 analysis identified 19 candidates (7 HIGH, 8 MEDIUM, 4 LOW) and 4 cross-cutting systemic themes.

This research **does not redo** the Phase-015 audit. Instead it investigates the 5 cross-cutting domains below across the actual codebase, producing concrete file/line-level findings that directly feed Phase 017+ remediation.

---

## Research question

Where in the system-spec-kit MCP server runtime do foundational-phase (002/003/005/008/010/014) files carry contract drift, hidden semantics, fail-open behavior, concurrency gaps, or stringly-typed governance risk that Phase 015 did not surface? Classify each finding by severity (P0/P1/P2), trace the downstream blast radius, and identify the remediation seams that would close the cross-phase coverage gap.

---

## Research domains (5 domains, 50 iterations total)

The nominal budget was 10 iterations per domain. In practice the 5 domains had uneven depth and iterations drifted beyond their nominal bounds (see `actual_iterations` below). Domain 5 was never run as a dedicated pass -- its evidence is transversal and surfaced across iterations 1-47.

### Domain 1 -- Silent Fail-Open Patterns

| Field | Value |
| ----- | ----- |
| Nominal iterations | 1-10 |
| Actual iterations | 1-20 (foundational seam pass + D1 deepening pass) |
| Focus | Every warning-only downgrade branch, success-shaped output after skipped/degraded work, exception absorption |
| Primary files | `session-stop.ts`, `graph-metadata-parser.ts`, `code-graph/query.ts`, `reconsolidation-bridge.ts`, `post-insert.ts` |

Each iteration: pick one fail-open path, document file + line range, what triggers it, caller perception vs reality, blast radius, severity.

### Domain 2 -- State Contract Honesty

| Field | Value |
| ----- | ----- |
| Nominal iterations | 11-20 |
| Actual iterations | 21-30 |
| Focus | Files that conflate semantically distinct states (success/skip/defer/fail; missing/empty/stale); downstream consumers that lose signal |
| Primary files | `post-insert.ts`, `shared-payload.ts`, `code-graph/query.ts`, `graph-metadata-parser.ts`, `hook-state.ts` |

Each iteration: for one collapse point, trace 2-3 downstream consumers, document what they assume, assess whether collapsed state could cause incorrect behavior.

### Domain 3 -- Concurrency & Write Coordination

| Field | Value |
| ----- | ----- |
| Nominal iterations | 21-30 |
| Actual iterations | 31-40 |
| Focus | Unlocked read-modify-write paths, shared temp paths, write-then-read assumptions, pre-transaction snapshot reuse, TOCTOU identity races |
| Primary files | `hook-state.ts`, `session-stop.ts`, `reconsolidation-bridge.ts`, `graph-metadata-parser.ts`, `data-loader.ts`, runtime root docs (`AGENTS.md`/`CLAUDE.md`/`CODEX.md`/`GEMINI.md`) |

Each iteration: for one race, determine theoretical vs practically-triggerable; assess whether atomic rename is sufficient or whether transaction-level protection is required.

### Domain 4 -- Stringly-Typed Governance

| Field | Value |
| ----- | ----- |
| Nominal iterations | 31-40 |
| Actual iterations | 41-50 (D4 spilled into D5 nominal range because D4 yielded the densest novel findings) |
| Focus | Prose/string contracts lacking mechanical validation: Gate 3 classifiers, skill-advisor command bridges, YAML `when:` predicates, `conflicts_with` edges, `--validate-only` cycle detectors, manual-playbook runner `Function(...)` eval |
| Primary files | `AGENTS.md`, `spec_kit_plan_auto.yaml`, `spec_kit_plan_confirm.yaml`, `spec_kit_complete_auto.yaml`, `spec_kit_deep-research_auto.yaml`, `skill_advisor.py`, `skill_advisor_runtime.py`, `skill_graph_compiler.py`, `manual-playbook-runner.ts` |

Each iteration: identify one drift-prone string contract, assess failure-mode likelihood and impact, evaluate feasibility of a mechanical replacement.

### Domain 5 -- Test Coverage Gaps

| Field | Value |
| ----- | ----- |
| Nominal iterations | 41-50 |
| Actual iterations | Transversal (iterations 1-47 accumulated test-coverage evidence alongside primary domain findings) |
| Focus | Direct-vs-indirect-vs-missing adversarial coverage per candidate; tests that codify degraded contracts |
| Note | **Domain 5 was never dispatched as a dedicated pass.** The intended 10-iteration coverage matrix was instead accumulated transversally across iterations 1-47. The final synthesis (see `FINAL-synthesis-and-review.md` section 6.3, 6.5, 8.2) consolidates the coverage evidence and identifies 14 test files that encode the degraded contract. Phase 017 should do a dedicated 5-iteration Domain-5 pass to close this gap. |

---

## Dispatch pattern

Because iterations ran through `cli-copilot` rather than `/spec_kit:deep-research`, the natural unit of parallelism was a **wave of 3 concurrent copilot CLI invocations** (matching the user's account-level Copilot API concurrency cap).

| Wave | Iterations | Concurrency | Worker notes |
| ---- | ---------- | ----------- | ------------ |
| 1 | 001-003 | 3 | Foundational seam pass |
| 2 | 004-006 | 3 | Foundational deepening |
| ...| ... | 3 | (16 waves total) |
| 16 | 046-048 | 3 | D4 closing pass |
| 17 | 049-050 | 2 | Final D4 consolidation |

Each copilot invocation received:
- The canonical batch prompt (`scratch/deep-research-batch-prompt.md`)
- The current domain index + iteration number
- Prior iteration outputs (for cross-reference and deduplication)
- A target file list from the domain's `files_of_interest`

Interim syntheses were authored by a separate copilot agent at iteration checkpoints (32, 38, 41, 44, 47) to consolidate findings before the next wave started. The FINAL synthesis was authored after iteration 50.

---

## Scope files (19 candidates)

The 19 candidates from `spec.md` drove the iteration file selection:

### HIGH priority (7)
1. `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
2. `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
3. `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`
4. `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
5. `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`
6. `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
7. `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`

### MEDIUM priority (8)
8. `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`
9. `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts`
10. `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
11. `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`
12. `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
13. `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`
14. `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`
15. `015-implementation-deep-review/implementation-summary.md`

### LOW priority (4)
16. `001-research-graph-context-systems/recommendations.md`
17. `AGENTS.md`
18. `006-continuity-refactor-gates/implementation-summary.md`
19. `.opencode/skill/system-spec-kit/scripts/tests/manual-playbook-runner.ts`

Iterations were free to read companion files (tests, callers, transports) as context required. The 57 distinct files touched across the 50 iterations (see `findings-registry.json`) substantially exceed the 19 candidate files.

---

## Expected deliverables

1. **`iterations/iteration-NNN.md`** (50 files) -- per-iteration narrative with findings, novel insights, next investigation angle. [COMPLETE]
2. **`interim-synthesis-*-iterations.md`** (5 files at checkpoints 32/38/41/44/47) -- cross-iteration consolidation. [COMPLETE]
3. **`FINAL-synthesis-and-review.md`** -- authoritative multi-domain synthesis with P0-candidate composites, remediation backlog, Phase 017 kickoff plan. [COMPLETE, 1042 lines]
4. **`deep-research-config.json`** -- configuration metadata. [BACK-FILLED]
5. **`deep-research-state.jsonl`** -- per-iteration state stream. [BACK-FILLED from iteration file mtimes]
6. **`deep-research-strategy.md`** -- this document. [BACK-FILLED]
7. **`deep-research-dashboard.md`** -- run snapshot with progress metrics. [BACK-FILLED]
8. **`research.md`** -- canonical narrative of the research (1500-3000 lines target). [BACK-FILLED]
9. **`findings-registry.json`** -- structured registry of every raw finding. [BACK-FILLED from iteration file extraction]

---

## Convergence criteria (terminate when any holds)

1. **Signal-density collapse:** new-info-ratio (new findings in iteration N / cumulative findings) drops below 0.08 for a sliding window of 3 iterations.
2. **Domain coverage:** all 5 domains have at least 8 distinct findings and have produced a final-pass synthesis.
3. **Hard ceiling:** 50 iterations.

**Actual convergence path:** Hard ceiling with signal-density collapse in iterations 48-50. Iterations 48-50 produced 5 net-new findings of 137 cumulative (~3.6% new-info-ratio, well below 0.08). Domain 5 was declared complete via transversal evidence rather than dedicated iterations. Final synthesis produced at iteration 50.

---

## Quality gates

1. **Evidence grounded.** Every finding carries `[SOURCE: file:lines]` citations to the repository. No synthesis claim without at least one iteration-level citation.
2. **Severity classified.** Every finding classified as P0 / P1 / P2 with the criteria:
   - P0: data-loss or corruption risk; permanent persistent-state failure
   - P1: silent quality degradation; operator-visible only through log-scraping
   - P2: observability gap; degraded contract but recoverable
3. **Deduplicated.** Cross-iteration findings that describe the same underlying bug are collapsed into canonical IDs in the registry's `dedup_clusters` section.
4. **No redo of 015.** Findings must describe behavior not covered in the Phase-015 review report (`015-implementation-deep-review/review/review-report.md`).
5. **Actionable.** Each finding includes a concrete remediation recommendation (size + shape + affected files).

---

## Anti-patterns (DO NOT)

- Re-state iteration findings verbatim in the final synthesis; synthesize by pattern, not by list.
- Expand scope beyond the 19 candidate files without documenting why the companion file is load-bearing for a specific finding.
- Mark findings as P0 based on speculative attack chains; P0 composites require at least 3 concrete constituent findings per criterion from `FINAL-synthesis-and-review.md` section 3.0.
- Use the iteration stream as a scratchpad; every finding must be self-contained and have the required frontmatter shape (File, Lines, Severity, Description, Evidence, Downstream Impact).
- Dispatch additional research iterations after convergence without a documented re-opening reason.

---

## Finding-frontmatter schema (every finding must carry)

```markdown
### Finding R<iter>-<idx>
- **File:** <absolute or .opencode-relative path; semicolon-separated if multi-file>
- **Lines:** <range or comma-separated ranges>
- **Severity:** P0 | P1 | P2
- **Description:** <one paragraph: what the bug is, who sees what, what reality is>
- **Evidence:** <file:lines citations proving the bug exists>
- **Downstream Impact:** <who breaks, what operator sees, why this matters>
```

---

## Post-convergence artifacts

After iteration 50, the synthesis chain produced:

1. `FINAL-synthesis-and-review.md` (1042 lines) -- authoritative deliverable.
2. Cross-phase matrix of 57 files x 5 domains (inline in synthesis section 2.1).
3. 4 P0-escalation composites (candidate-A through candidate-D) + 2 watch-priority items.
4. Remediation backlog: 29 quick wins (~1 engineer-week), 13 medium refactors (~8 engineer-weeks), 7 structural refactors (~10.5 engineer-weeks).
5. Test-migration plan: 14 existing test files need updates to lift degraded-contract assertions.
6. Phase-017 kickoff plan with 4-month timeline and 24.5 engineer-week effort budget.

This strategy file documents the research design; the research **output** lives in `research.md`, `findings-registry.json`, and `FINAL-synthesis-and-review.md`.
