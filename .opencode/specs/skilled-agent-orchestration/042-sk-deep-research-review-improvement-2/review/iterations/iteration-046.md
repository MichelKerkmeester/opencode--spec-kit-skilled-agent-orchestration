---
iteration: 46
dimension: maintainability
sessionId: rvw-2026-04-12T16-00-00Z
engine: copilot-gpt-5.4-high
phase: round-3-workflow-validation
startedAt: 2026-04-12T18:14:42Z
completedAt: 2026-04-12T18:21:11Z
---

# Deep Review Iteration 046 — maintainability (Round 3)

**Focus:** CONTRACT: Verify all manual testing playbooks reference current code reality. Check 034-replay-consumer.md, 029-graph-events-emission.md, and any playbook that references the deep-loop graph, journal, or coverage surface.

---

● skill(sk-deep-review)

● Search (glob)
  │ "**/034-replay-consumer.md"
  └ 1 file found

● Search (glob)
  │ "**/029-graph-events-emission.md"
  └ 1 file found

● Search (grep)
  │ "deep-loop graph|coverage surface|journal|graph events|replay consumer" in **/*.md
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

I’m narrowing this to the playbooks and the runtime files they assert against, then I’ll cross-check each claim against the current scripts and YAMLs.

● List directory .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvemen…
  └ 20 files found

● Search (grep)
  │ "deep-loop graph|coverage surface|journal|replay consumer|graph events" in **/*.md
  │ (.opencode/skill)
  └ 6 lines found

● Search (grep)
  │ "deepLoop|deep-loop|coverage|journal|graph|replay" in **/*.{md,cjs,js,ts,yaml,yml,json}
  │ (.opencode/skill/sk-deep-research)
  └ 13 files found

● Search (grep)
  │ "deepLoop|deep-loop|coverage|journal|graph|replay" in **/*.{md,cjs,js,ts,yaml,yml,json}
  │ (.opencode/skill/sk-improve-agent)
  └ 37 files found

● Search (grep)
  │ "deep-loop graph|coverage surface|journal|mutation-coverage|graph events|replay
  │ consumer|coverage graph" in **/*.md (.opencode/skill/sk-improve-agent/manual_testing_playbook)
  └ 6 lines found

● Search (grep)
  │ "deep-loop graph|coverage surface|journal|mutation-coverage|graph events|replay
  │ consumer|coverage graph" in **/*.md (.opencode/skill/sk-deep-research/manual_testing_playbook)
  └ 2 lines found

● Search (grep)
  │ "034-replay-consumer|029-graph-events-emission|playbook|manual_testing" in **/*.md
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

I’ve got the candidate playbooks; next I’m checking the exact runtime contracts those docs claim so I can flag only true drift, not stale wording that’s still effectively correct.

● Search (grep)
  │ "deep-loop graph|coverage graph|mutation coverage|coverage surface" in **/*.md
  │ (.opencode/skill/sk-improve-agent/manual_testing_playbook)
  └ 3 files found

● Search (grep)
  │ "journal|replay|runtime-truth" in **/*.md
  │ (.opencode/skill/sk-improve-agent/manual_testing_playbook)
  └ 9 files found

● Search (grep)
  │ "deep-loop graph|graph events|coverage surface|journal" in **/*.md
  │ (.opencode/skill/sk-deep-research/manual_testing_playbook)
  └ 1 file found

● Search (grep)
  │ "deep-loop graph|graph events|coverage surface|journal" in **/*.md
  │ (.opencode/skill/sk-deep-review/manual_testing_playbook)
  └ 1 file found

● Read 029-graph-events-emission.md
  │ .opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-disci
  │ pline/029-graph-events-emission.md
  └ 78 lines read

● Read 015-graph-events-review.md
  │ .opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipl
  │ ine/015-graph-events-review.md
  └ 78 lines read

● Read 022-mutation-coverage-graph-tracking.md
  │ .opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-covera
  │ ge-graph-tracking.md
  └ 49 lines read

● Read 026-audit-journal-emission.md
  │ .opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/026-audit-journal-emi
  │ ssion.md
  └ 69 lines read

● Read 030-dimension-trajectory.md
  │ .opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/030-dimension-traject
  │ ory.md
  └ 99 lines read

● Read 032-journal-wiring.md
  │ .opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md
  └ 117 lines read

● Read 034-replay-consumer.md
  │ .opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/034-replay-consumer.m
  │ d
  └ 110 lines read

● Read reduce-state.cjs
  │ .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs
  └ 1 line read

● Read improvement-journal.cjs
  │ .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs
  └ 279 lines read

● Read mutation-coverage.cjs
  │ .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs
  └ 291 lines read

● Read improve_improve-agent_auto.yaml
  │ .opencode/command/improve/assets/improve_improve-agent_auto.yaml
  └ 204 lines read

● Read agent.md
  │ .opencode/command/improve/agent.md
  └ 462 lines read

● Read state_format.md
  │ .opencode/skill/sk-deep-research/references/state_format.md
  └ 1 line read

● Read convergence.md
  │ .opencode/skill/sk-deep-research/references/convergence.md
  └ 1 line read

● Read convergence.md
  │ .opencode/skill/sk-deep-review/references/convergence.md
  └ 1 line read

● Search (grep)
  │ "graphEvents|iteration records|graph-aware
  │ convergence|question_node|finding_node|source_node|type"
  │ (.opencode/skill/sk-deep-research/references/convergence.md)
  └ 18 lines found

● Search (grep)
  │ "journalSummary|candidateLineage|mutationCoverage|buildJournalSummary|buildCandidateLineageSumma
  │ ry|buildMutationCoverageSummary|readOptionalUtf8|readOptionalJson"
  │ (.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs)
  └ 19 lines found

● Search (grep)
  │ "graphEvents|question_node|finding_node|source_node|type: 'question'|type: 'finding'|type:
  │ 'source'|type: 'edge'" (.opencode/skill/sk-deep-research/references/state_format.md)
  └ 4 lines found

● Search (grep)
  │ "graphEvents|review iteration records|graph-aware review
  │ convergence|dimension_node|file_node|finding_node|reviewNodeTypes"
  │ (.opencode/skill/sk-deep-review/references/convergence.md)
  └ 4 lines found

● Search (grep)
  │ "graphEvents|type: 'question'|type: 'finding'|type: 'source'|type:
  │ 'edge'|question_node|finding_node|source_node|dimension_node|file_node" in **/*.{ts,js,cjs,md}
  │ (.opencode/skill/system-spec-kit)
  └ 26 lines found

I’ve found one likely hard drift already: the “mutation coverage graph” playbook still describes nodes and edges, but the shipped runtime stores flat `mutations`, `exhausted`, and `trajectory` arrays instead. I’m confirming the rest of the artifact contracts now.

● Read reduce-state.cjs
  │ .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs
  └ L160:430 (271 lines read)

● Read reduce-state.cjs
  │ .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs
  └ L1000:1045 (39 lines read)

● Read coverage-graph-cross-layer.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts
  └ L236:255 (19 lines read)

● Read coverage-graph-convergence.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts
  └ L168:190 (23 lines read)

● Read coverage-graph-db.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts
  └ L198:216 (19 lines read)

● Search (grep)
  │ "recordTrajectory|checkConvergenceEligibility|trajectory|nodes|edges|loopType" in **/*.ts
  │ (.opencode/skill/sk-improve-agent/scripts/tests)
  └ 50 lines found

● Search (glob)
  │ "**/coverage-graph-db.vitest.ts" in .opencode/skill/system-spec-kit
  └ 1 file found

● Search (grep)
  │ "dimension_node|file_node|finding_node|evidence_node" in **/*.{ts,js,cjs,md}
  │ (.opencode/skill/system-spec-kit)
  └ 7 lines found

● Search (grep)
  │ "graphEvents" in **/*.md (.opencode/skill/sk-deep-review)
  └ 27 lines found

● Read mutation-coverage.vitest.ts
  │ .opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts
  └ L52:76 (25 lines read)

● Read state_format.md
  │ .opencode/skill/sk-deep-review/references/state_format.md
  └ L221:260 (39 lines read)

● Read mutation-coverage.vitest.ts
  │ .opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts
  └ L132:190 (59 lines read)

● Read candidate-lineage.vitest.ts
  │ .opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts
  └ L34:82 (49 lines read)

● Read 027-resume-continuation.md
  │ .opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/027-resume-continuati
  │ on.md
  └ 88 lines read

● Search (grep)
  │ "renderMutationCoverageSection|Mutation Coverage|coverageRatio|uncoveredMutations"
  │ (.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs)
  └ 16 lines found

● Search (grep)
  │ "lineageMode|generation|session_start|sessionId" (.opencode/skill/sk-improve-agent/manual_testin
  │ g_playbook/07--runtime-truth/027-resume-continuation.md)
  └ 10 lines found

● Search (grep)
  │ "session_start|lineageMode|generation|sessionId"
  │ (.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs)
  └ 1 line found

● Search (grep)
  │ "new mode|generation 1|resume|restart|fork|completed-continue|session boundary"
  │ (.opencode/command/improve/agent.md)
  └ 3 lines found

I’ve confirmed three substantive drifts and I’m pulling the final line-accurate evidence now: one stale review-graph taxonomy, one impossible fresh-session journal assertion, and one playbook that still assumes a graph data model the runtime no longer ships.

● Read reduce-state.cjs
  │ .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs
  └ L924:939 (16 lines read)

● Read mutation-coverage.cjs
  │ .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs
  └ L246:266 (21 lines read)

● Read improve_improve-agent_auto.yaml
  │ .opencode/command/improve/assets/improve_improve-agent_auto.yaml
  └ L141:205 (64 lines read)

● Read agent.md
  │ .opencode/command/improve/agent.md
  └ L294:335 (41 lines read)

Found **4 maintainability findings**. **DR-029** and **RT-034** match current runtime reality; the drift is concentrated in **DRV-015** and the **sk-improve-agent** journal/coverage playbooks.

1. **F-046-001**  
   **Severity:** P1  
   **Dimension:** maintainability  
   **File:** `.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md`  
   **Line:** 14-15, 29-35, 50, 67-68  
   **Title:** Review graph-events playbook still points at retired `_node` taxonomy and a retired test location  
   **Description:** The playbook tells operators to validate `dimension_node` / `file_node` / `finding_node` review events and sends them to `.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts`. That no longer reflects the shipped contract, so the scenario now drives reviewers toward stale evidence and the wrong event taxonomy.  
   **Evidence:** Current canonical review payload uses flat node types `dimension`, `file`, `finding`, `evidence`, `edge` in `.opencode/skill/sk-deep-review/references/state_format.md:235-256`. Repository matches for `dimension_node|file_node|finding_node` under system-spec-kit now resolve only in archived coverage-graph tests at `.opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts:202-212`.  
   **Recommendation:** Rewrite DRV-015 around the flat event schema from `references/state_format.md`, and repoint its evidence path to active coverage-graph sources instead of the retired non-archive test path.

2. **F-046-002**  
   **Severity:** P1  
   **Dimension:** maintainability  
   **File:** `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md`  
   **Line:** 9-10, 23-28, 32-39  
   **Title:** Mutation-coverage playbook describes a graph model the runtime does not write  
   **Description:** The playbook still describes a node/edge coverage graph, graph node IDs in journal events, and dashboard state “per dimension.” The shipped runtime does not persist that structure; it stores a flat coverage artifact with `mutations`, `exhausted`, and `trajectory`, then reduces that to summary metrics. This creates a high risk of false failures during manual testing.  
   **Evidence:** The coverage artifact shape is `loopType`, `mutations`, `exhausted`, `trajectory` in `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:59-67`, and tests assert exactly that shape in `.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts:56-63`. The orchestrator only records one mutation entry plus trajectory scores in `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:168-170`. The dashboard exposes only `coverageRatio` and `uncoveredMutations` in `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:924-939`, while journal events carry candidate/score/gate metadata rather than graph node IDs in `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:156-167,189-204`.  
   **Recommendation:** Rename this scenario around the actual mutation-coverage artifact/summary surface, or reintroduce a true graph data model before keeping node/edge expectations.

3. **F-046-003**  
   **Severity:** P1  
   **Dimension:** maintainability  
   **File:** `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/027-resume-continuation.md`  
   **Line:** 13, 49-57, 65-71, 87  
   **Title:** Fresh-session continuation playbook asserts journal fields the runtime never emits  
   **Description:** The verification block requires the fresh `session_start` event to contain `lineageMode: "new"` and `generation: 1`, but the shipped journal emission does not include either field. That makes the scenario fail against a correct runtime. The prompt block is also visibly corrupted, which further reduces operability.  
   **Evidence:** The playbook asserts `details.lineageMode` and `details.generation` in `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/027-resume-continuation.md:49-57`, and asks for those fields in the evidence template at line 87. The actual `session_start` emission only writes `sessionId`, `target`, `charter`, and `startedAt` in `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:141-143`; the command doc shows the same CLI shape in `.opencode/command/improve/agent.md:294-309`. The command doc describes “fresh `new`-mode session with generation 1” as release semantics, not journal payload fields, in `.opencode/command/improve/agent.md:330-334`.  
   **Recommendation:** Either add `lineageMode`/`generation` to emitted `session_start` details, or change RT-027 to verify fresh-session behavior via archive separation, new journal creation, and iteration reset instead of nonexistent journal fields.

4. **F-046-004**  
   **Severity:** P2  
   **Dimension:** maintainability  
   **File:** `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/030-dimension-trajectory.md`  
   **Line:** 9-13, 75-82, 86-89  
   **Title:** Stability wording says “all deltas,” but implementation uses score range across the last window  
   **Description:** The playbook frames convergence as “all dimension deltas within the configured stability delta,” which reads like adjacent-step deltas. The implementation actually rejects convergence when the **range** (`max - min`) across the last `N` samples exceeds the threshold. That wording gap is subtle but enough to mislead operators about borderline trajectories.  
   **Evidence:** The playbook uses “all dimension deltas within the configured stability delta” in `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/030-dimension-trajectory.md:9-13,75-82`. The runtime checks `maxScore - minScore > opts.stabilityDelta` over the recent window in `.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs:246-256`.  
   **Recommendation:** Reword RT-030 to say the last `MIN_TRAJECTORY_POINTS` samples must stay within a per-dimension score range of `DEFAULT_STABILITY_DELTA`, and add a non-monotonic example so operators do not interpret this as adjacent-delta logic.

**ITERATION SUMMARY:** 4 findings total — **0 P0, 3 P1, 1 P2**. The main drift is in playbooks that still describe pre-flattened graph schemas or journal evidence that the current workflow no longer emits. **DR-029** and **RT-034** are aligned with current code reality.

**COVERAGE ASSESSMENT:** Reviewed the requested focus area plus adjacent graph/journal/coverage playbooks: `029`, `015`, `022`, `026`, `027`, `030`, `032`, `034`, along with their active runtime anchors in `sk-deep-research`, `sk-deep-review`, `sk-improve-agent`, `system-spec-kit` tests, and improve workflow YAML/docs. Coverage is strong for the requested surfaces; no additional materially distinct issues surfaced in `029` or `034`.

**CONFIDENCE:** High. Findings come from direct line-by-line comparison between playbook assertions and the shipped docs/scripts/YAMLs. I did not execute full end-to-end manual runs, so this is a contract-drift audit rather than runtime-behavior sampling.

**NEXT PRIORITIES:**  
1. Fix **DRV-015** first; it currently points reviewers to retired taxonomy and evidence.  
2. Rewrite **E2E-022** around the actual mutation-coverage artifact surface.  
3. Repair **RT-027** so fresh-session verification uses fields the runtime really emits.  
4. Clarify **RT-030** stability semantics to match `mutation-coverage.cjs`.


Changes   +0 -0
Requests  1 Premium (6m 26s)
Tokens    ↑ 1.1m • ↓ 17.0k • 1.0m (cached) • 11.1k (reasoning)
