---
iteration: 39
dimension: correctness
sessionId: rvw-2026-04-12T16-00-00Z
engine: copilot-gpt-5.4-high
phase: round-3-workflow-validation
startedAt: 2026-04-12T17:14:39Z
completedAt: 2026-04-12T17:22:26Z
---

# Deep Review Iteration 039 — correctness (Round 3)

**Focus:** CROSS-CUTTING: Compare all 3 reduce-state.cjs files (review, research, improve-agent) for consistent event handling. All should parse synthesis_complete, handle corruption fail-closed, and persist lineage from lifecycle events. Check for any asymmetry.

---

● skill(sk-code-review)

I’m mapping the review surface first so I can inspect the exact reducer/runtime files the spec points at, then I’ll do the asymmetry pass across the three `reduce-state.cjs` implementations.

● Read review_core.md
  │ .claude/skills/sk-code-review/references/review_core.md
  └ L1:220 (98 lines read)

● Read code_quality_checklist.md
  │ .claude/skills/sk-code-review/references/code_quality_checklist.md
  └ L1:220 (162 lines read)

● Read security_checklist.md
  │ .claude/skills/sk-code-review/references/security_checklist.md
  └ L1:220 (206 lines read)

● List directory .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvemen…
  └ 20 files found

● Search (glob)
  │ "**/*042*" in .opencode/specs/skilled-agent-orchestration
  └ 1 file found

● Search (glob)
  │ "**/reduce-state.cjs"
  └ 3 files found

● Search (grep)
  │ "reduce-state\.cjs|synthesis_complete|lineage|lifecycle|corrupt|fail-closed" in
  │ **/*.{md,yml,yaml,json,jsonc,ts,js,cjs,sh}
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

● memory_match_triggers (MCP: spec_kit_memory) · prompt: "Deep review iteration 39 correctness audi…
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

I’ve got the reducer locations. Next I’m narrowing the spec references to the exact runtime files so I can compare intended behavior against the current implementations instead of reviewing unrelated bundle docs.

● Read implementation-summary.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementa
  │ tion-summary.md
  └ L1:260 (129 lines read)

● Read spec.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md
  └ L1:260 (260 lines read)

● Read reduce-state.cjs
  │ .opencode/skill/sk-deep-review/scripts/reduce-state.cjs
  └ L1:260 (260 lines read)

● Read reduce-state.cjs
  │ .opencode/skill/sk-deep-research/scripts/reduce-state.cjs
  └ L1:260 (259 lines read)

● Read reduce-state.cjs
  │ .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs
  └ L1:260 (260 lines read)

● Search (grep)
  │ "\.opencode/skill/|mcp_server|wave
  │ executor|optimizer|workflow|reduce-state\.cjs|improve-agent|deep-review|deep-research" in
  │ **/*.{md,yml,yaml,json,jsonc}
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

✗ Search (grep)
  │ "deep-review|deep-research|improve-agent|reduce-state\.cjs|synthesis_complete|lifecycle|lineage"
  │ in **/*.{md,yml,yaml,json} (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-rev
  │ iew-improvement-2/007-graph-aware-stop-gate)
  └ rg: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-ag
    ent-orchestration/042-sk-deep-research-review-improvement-2/007-graph-aware-stop-gate: IO error
    for operation on
    /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-
    orchestration/042-sk-deep-research-review-improvement-2/007-graph-aware-stop-gate: No such file
    or directory (os error 2)

● Search (grep)
  │ "synthesis_complete|blocked_stop|legal_stop|resumed|restarted|session_end|session_ended|lineage|
  │ STATE_CORRUPTION|parseJsonlDetailed|corrupt" in **/*.{cjs,js,md,yml,yaml,json}
  │ (.opencode/skill/sk-deep-research)
  └ 7 lines found

● Search (grep)
  │ "synthesis_complete|blocked_stop|legal_stop|resumed|restarted|session_end|session_ended|lineage|
  │ STATE_CORRUPTION|parseJsonlDetailed|corrupt" in **/*.{cjs,js,md,yml,yaml,json}
  │ (.opencode/skill/sk-deep-review)
  └ 6 lines found

● Search (grep)
  │ "synthesis_complete|blocked_stop|legal_stop|resumed|restarted|session_end|session_ended|lineage|
  │ STATE_CORRUPTION|parseJsonlDetailed|corrupt" in **/*.{cjs,js,md,yml,yaml,json}
  │ (.opencode/skill/sk-improve-agent)
  └ 8 lines found

● Search (grep)
  │ "deep-review|deep-research|improve-agent|reduce-state\.cjs|synthesis_complete|lifecycle|lineage"
  │ in **/*.{md,yml,yaml,json} (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-rev
  │ iew-improvement-2/008-further-deep-loop-improvements)
  └ 6 lines found

The initial scan already surfaced one doc-level mismatch in the phase folder names, but I’m holding off on counting that unless it affects runtime reachability. I’m now tracing the reducer/event code paths directly to see whether the runtime behavior itself is still asymmetric.

● Read reduce-state.cjs
  │ .opencode/skill/sk-deep-research/scripts/reduce-state.cjs
  └ L260:760 (493 lines read)

● Search (grep)
  │ "synthesis_complete|lineage|resumed|restarted|session_end|session_ended|blocked_stop|legal_stop|
  │ STATE_CORRUPTION|createCorruptionError|corruptionWarnings|eventType"
  │ (.opencode/skill/sk-deep-review/scripts/reduce-state.cjs)
  └ 42 lines found

● Search (grep)
  │ "synthesis_complete|lineage|resumed|restarted|session_end|session_ended|blocked_stop|legal_stop|
  │ STATE_CORRUPTION|createCorruptionError|corruptionWarnings|eventType"
  │ (.opencode/skill/sk-deep-research/scripts/reduce-state.cjs)
  └ 50 lines found

● Search (grep)
  │ "synthesis_complete|lineage|resumed|restarted|session_end|session_ended|blocked_stop|legal_stop|
  │ STATE_CORRUPTION|createCorruptionError|corruptionWarnings|eventType"
  │ (.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs)
  └ 18 lines found

● Read reduce-state.cjs
  │ .opencode/skill/sk-deep-review/scripts/reduce-state.cjs
  └ L260:620 (361 lines read)

● Read reduce-state.cjs
  │ .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs
  └ L260:760 (501 lines read)

● Read reduce-state.cjs
  │ .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs
  └ L760:1220 (279 lines read)

● Read reduce-state.cjs
  │ .opencode/skill/sk-deep-review/scripts/reduce-state.cjs
  └ L620:1260 (462 lines read)

● Search (grep)
  │ "reduce-state\.cjs|synthesis_complete|lineage|resumed|restarted|session_end|session_ended|corrup
  │ t|fail-closed|STATE_CORRUPTION" in **/*.{md,yml,yaml,json} (.opencode/specs/skilled-agent-orches
  │ tration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment)
  └ 6 lines found

● Search (grep)
  │ "reduce-state\.cjs|synthesis_complete|lineage|resumed|restarted|session_end|session_ended|corrup
  │ t|fail-closed|STATE_CORRUPTION" in **/*.{md,yml,yaml,json} (.opencode/specs/skilled-agent-orches
  │ tration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements)
  └ 36 lines found

● Search (grep)
  │ "reduce-state\.cjs|synthesis_complete|lineage|resumed|restarted|session_end|session_ended|corrup
  │ t|fail-closed|STATE_CORRUPTION" in **/*.{md,yml,yaml,json} (.opencode/specs/skilled-agent-orches
  │ tration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation)
  └ 6 lines found

I’ve confirmed one real runtime asymmetry already: `sk-improve-agent` still parses its JSONL leniently while the review/research reducers now fail closed. I’m verifying whether `synthesis_complete` and lifecycle events are also emitted on the improve-agent path before I call the rest as correctness findings.

● Read spec.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-
  │ improver-deep-loop-alignment/spec.md
  └ L1:240 (240 lines read)

● Search (grep)
  │ "synthesis_complete|resumed|restarted|session_start|session_end|session_ended|parentSessionId|li
  │ neageMode|generation|continuedFromRun" in **/*.{yml,yaml,md,json,cjs,js}
  │ (.opencode/skill/sk-improve-agent)
  └ 8 lines found

● Search (grep)
  │ "synthesis_complete|resumed|restarted|session_start|session_end|session_ended|parentSessionId|li
  │ neageMode|generation|continuedFromRun" in **/*improve*/*.{yml,yaml,md,json,cjs,js}
  │ (.opencode/command)
  └ 4 lines found

● Read spec.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-furthe
  │ r-deep-loop-improvements/spec.md
  └ L1:240 (240 lines read)

● Search (grep)
  │ "graphConvergenceScore|graph_convergence|computeGraphConvergenceScore|blendedScore|decisionScore
  │ |compositeScore|signals\." (.opencode/skill/sk-deep-review/scripts/reduce-state.cjs)
  └ 11 lines found

● Search (grep)
  │ "graphConvergenceScore|graph_convergence|computeGraphConvergenceScore|blendedScore|decisionScore
  │ |compositeScore|signals\." (.opencode/skill/sk-deep-research/scripts/reduce-state.cjs)
  └ 12 lines found

● Read convergence.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts
  └ L170:230 (61 lines read)

● Read improvement_config.json
  │ .opencode/skill/sk-improve-agent/assets/improvement_config.json
  └ L1:120 (120 lines read)

● Read convergence.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts
  └ L230:290 (61 lines read)

● Search (grep)
  │ "decisionScore|blendedScore|score:|signals:" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph)
  └ 5 lines found

● Read agent.md
  │ .opencode/command/improve/agent.md
  └ L280:360 (81 lines read)

● Read improvement-journal.cjs
  │ .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs
  └ L1:220 (220 lines read)

● Search (grep)
  │ "synthesis_complete" in **/*.{md,yml,yaml,json,cjs,js} (.opencode/skill/sk-improve-agent)
  └ No matches found

● Search (grep)
  │ "synthesis_complete" in **/*.{md,yml,yaml,json,cjs,js} (.opencode/command/improve)
  └ No matches found

● Search (grep)
  │ "sessionId|parentSessionId|lineageMode|generation"
  │ (.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs)
  └ No matches found

● Read review_mode_contract.yaml
  │ .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml
  └ L130:190 (61 lines read)

● Search (grep)
  │ "sessionId|parentSessionId|lineageMode|generation|continuedFromRun" in
  │ **/*.{yaml,yml,json,md,cjs,js} (.opencode/skill/sk-deep-review)
  └ 6 lines found

● Read deep_research_config.json
  │ .opencode/skill/sk-deep-research/assets/deep_research_config.json
  └ L1:80 (65 lines read)

● Search (grep)
  │ "sessionId|parentSessionId|lineageMode|generation|continuedFromRun" in
  │ **/*.{yaml,yml,json,md,cjs,js} (.opencode/skill/sk-deep-research)
  └ 8 lines found

● Search (glob)
  │ "**/*.json" in .opencode/skill/sk-deep-review/assets
  └ 2 files found

● Search (grep)
  │ ""sessionId"|"parentSessionId"|"lineageMode"|"generation"|"continuedFromRun"" in **/*.json
  │ (.opencode/skill/sk-deep-review/assets)
  └ 6 lines found

● Search (glob)
  │ "**/*review*config*.json" in .opencode/skill/sk-deep-review/assets
  └ 1 file found

I’ve narrowed this to the improve-agent path: fail-closed handling is definitely missing there, and lifecycle/session lineage looks suspiciously under-consumed even after the runtime-truth work. I’m doing one independent pass to make sure I’m not missing a second-order contract issue before I finalize the findings.

● Review(gpt-5.4-mini) Auditing reducer asymmetry
  │ Search (grep)
  │   │ "answeredCount|totalQuestions|stopReason|complete"
  │   │ (.opencode/skill/sk-deep-research/scripts/reduce-state.cjs)
  │   └ 39 lines found
  └ Search (grep)
      │ "currentLeaf|getLineage|parentCandidateId|nodes.push"
      │ (.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs)
      └ 55 lines found

● Read reduce-state.cjs
  │ .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs
  └ L45:65 (21 lines read)

● Read reduce-state.cjs
  │ .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs
  └ L173:205 (33 lines read)

● Read reduce-state.cjs
  │ .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs
  └ L1014:1032 (19 lines read)

● Read reduce-state.cjs
  │ .opencode/skill/sk-deep-review/scripts/reduce-state.cjs
  └ L340:435 (96 lines read)

● Read reduce-state.cjs
  │ .opencode/skill/sk-deep-research/scripts/reduce-state.cjs
  └ L280:355 (76 lines read)

● Read agent.md
  │ .opencode/command/improve/agent.md
  └ L324:336 (13 lines read)

● Read improvement_config.json
  │ .opencode/skill/sk-improve-agent/assets/improvement_config.json
  └ L12:23 (12 lines read)

● Read reduce-state.cjs
  │ .opencode/skill/sk-deep-review/scripts/reduce-state.cjs
  └ L1120:1152 (32 lines read)

● Read reduce-state.cjs
  │ .opencode/skill/sk-deep-research/scripts/reduce-state.cjs
  └ L831:867 (37 lines read)

## Findings

### F-039-001 — P1
- **Severity:** P1
- **Dimension:** correctness
- **File:** `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs`
- **Line:** `50-61, 173-180, 1014-1032`
- **Title:** `sk-improve-agent` still drops corrupted JSONL lines and publishes a success-shaped registry/dashboard
- **Description:** The improve-agent reducer still uses a lenient `parseJsonl()` that silently discards malformed lines. That parser feeds both the main runtime ledger (`agent-improvement-state.jsonl`) and the replay journal summary (`improvement-journal.jsonl`), so a single corrupt line can remove prompt runs, benchmark runs, or lifecycle events from the reducer input while the reducer still writes `experiment-registry.json` and `agent-improvement-dashboard.md` as if the state were valid.
- **Evidence:** In `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:50-61`, malformed JSONL lines are caught and replaced with `[]`. The reducer then consumes that parser for the main state log at `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:1023-1032`, and for journal replay at `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:173-180`. By contrast, the peer reducers already fail closed: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:1125-1150` and `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:831-867` both collect corruption warnings and throw `STATE_CORRUPTION` unless explicitly run leniently.
- **Recommendation:** Port the review/research fail-closed pattern into `sk-improve-agent`: add a detailed JSONL parser that records corruption, surface those warnings in the reducer output, and abort non-lenient runs instead of silently truncating the ledger/journal input.

## ITERATION SUMMARY

One real correctness issue remains in the cross-cutting reducer parity check: **`sk-improve-agent` is still not fail-closed on JSONL corruption**. I did **not** find a matching live-path bug in `sk-deep-review` or `sk-deep-research`; both already parse `synthesis_complete`, carry lineage from `resumed`/`restarted`, and stop on corrupted JSONL.

## COVERAGE ASSESSMENT

Reviewed:
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs`
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/005-agent-improver-deep-loop-alignment/spec.md`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/spec.md`
- `.opencode/command/improve/agent.md`
- `.opencode/skill/sk-improve-agent/assets/improvement_config.json`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts`

Cross-cutting verdict:
- **`synthesis_complete` parsing:** correct in review/research; no current-runtime bug filed for improve-agent because its shipped workflow uses `session_end` journal boundaries and explicitly retracts resume/restart flows (`.opencode/command/improve/agent.md:330-334`, `.opencode/skill/sk-improve-agent/assets/improvement_config.json:14-22`).
- **Corruption handling:** **asymmetric and broken** in improve-agent.
- **Lifecycle lineage persistence:** review/research are correct for their shipped contracts; improve-agent’s lack of resume/restart handling appears intentional for the current one-session-only release, so I did not count that as a defect.

## CONFIDENCE

**High.** The fail-closed gap is directly observable in the reducer code and confirmed by contrast with the already-hardened review/research reducers.

## NEXT PRIORITIES

1. Make `sk-improve-agent/scripts/reduce-state.cjs` fail closed on malformed JSONL, including journal replay input.
2. Add a regression test that injects a corrupt state-log line and verifies non-lenient reduction exits non-zero instead of publishing partial outputs.
3. Re-run the reducer asymmetry pass after that fix; the other targeted asymmetries look intentionally contracted today.


Changes   +0 -0
Requests  1 Premium (7m 45s)
Tokens    ↑ 5.4m • ↓ 34.5k • 5.1m (cached) • 19.3k (reasoning)
