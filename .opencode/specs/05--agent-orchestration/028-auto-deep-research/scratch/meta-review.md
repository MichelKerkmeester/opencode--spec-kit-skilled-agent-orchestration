# Meta-Review: Deep Research System Performance Assessment

## Purpose
Track A (Research) investigates the repos. Track B (Meta-Review) observes how the deep-research agents perform -- this is the system's first real execution test.

## Phase 0: Reconnaissance Observations

### WebFetch Reliability
- AGR README (raw.githubusercontent.com/main): SUCCESS - returned full 25KB document
- pi-autoresearch README (raw.githubusercontent.com/main): SUCCESS - returned full 8KB document
- autoresearch-opencode README (main branch): FAIL 404 - repo uses `master` branch, not `main`
- autoresearch-opencode README (master branch): SUCCESS after branch correction
- QUICKSTART.md, CHANGES.md, autoresearch.md (main branch): FAIL 404 - branch mismatch
- GitHub API directory listings: ALL SUCCESS on default branch
- AGR SKILL.md: SUCCESS
- autoresearch-opencode command/plugin (master branch): SUCCESS

### Branch Detection Finding
**Critical protocol gap**: WebFetch for GitHub raw content requires knowing the default branch. The deep-research protocol has no branch-detection step. GitHub API directory listing works regardless of branch name (uses default), but raw.githubusercontent.com requires explicit branch in URL.

**Recommendation**: Add a GitHub API branch-detection step before fetching raw content. Use `https://api.github.com/repos/{owner}/{repo}` to get `default_branch` field.

### Content Quality from Phase 0
- READMEs provided excellent architectural overview
- GitHub API directory listings enabled understanding project structure
- Key source files successfully identified for deep dives
- AGR SKILL.md (8KB) was very detailed with complete protocol
- pi-autoresearch index.ts (88KB) is too large for single fetch - will need targeted analysis
- autoresearch-opencode has clean separation: skill + command + plugin (TypeScript)

### Orchestrator-Level Decisions
- Pre-assigned iteration numbers (001/002/003) for parallel Wave 1
- Each agent gets focused questions + pre-fetched reconnaissance data
- Strategy.md "Next Focus" set for Wave 1 alignment

---

## Wave 1: Checkpoint (to be filled after Wave 1 completes)

### Agent Dispatch
| Agent | Iteration | Focus | Status | Findings | newInfoRatio | Tool Calls | Duration |
|-------|-----------|-------|--------|----------|-------------|------------|----------|
| A | 001 | AGR architecture deep dive | COMPLETE | 8 | 0.55 | 16 | 278s |
| B | 002 | pi-autoresearch deep dive | COMPLETE | 10 | 0.85 | 22 | 240s |
| C | 003 | autoresearch-opencode comparison | COMPLETE | 11 | 0.85 | 21 | 174s |

### Observations

**WebFetch Reliability (Wave 1)**:
- All agents successfully fetched additional source files beyond reconnaissance
- Agent A discovered and fetched guide.md (29KB) + templates.md (14KB) from AGR's references/ directory -- excellent deep dive
- Agent B successfully extracted convergence-relevant patterns from the 88KB index.ts via targeted prompt
- Agent C fetched autoresearch.sh, worklog.md, backup-state.sh, install.sh, BACKUP-USAGE.md -- most thorough source exploration
- No 404 errors in Wave 1 (branch issue was resolved in Phase 0)

**Content Parsing Quality**:
- All agents extracted specific, detailed, actionable findings (not vague summaries)
- Source citations present in all findings (compliance with protocol)
- Agent A found guide.md and templates.md that Phase 0 did not discover -- demonstrating value of deep agent dives
- Agent B identified the MAD confidence PR (#22) by fetching issues -- a non-obvious discovery via API exploration

**State Protocol Compliance**:
- All agents read state files before researching (confirmed by findings referencing strategy.md)
- All agents wrote iteration-NNN.md files with correct format
- JSONL records appended by all 3 agents
- **ISSUE**: JSONL records are out-of-order (run 2, 3, 1) due to parallel execution. Agents finished in different order than dispatch. This is a protocol gap: parallel execution produces non-sequential JSONL entries.
- **ISSUE**: Agent A's JSONL entry was appended AFTER agents B and C (run 1 appears after run 2 and 3). The pre-assigned iteration numbers (001/002/003) correctly mapped to files, but JSONL ordering reflects completion order not logical order.
- Strategy.md was NOT updated (per instructions) -- orchestrator merge confirmed working.

**Source Citations**:
- All findings have [SOURCE: ...] tags -- protocol compliance HIGH
- Agent A cited guide.md, templates.md, README.md with section references
- Agent B cited specific TypeScript interfaces and functions from index.ts
- Agent C cited multiple files from actual repo contents + our system files for comparison
- No fabricated sources detected

**newInfoRatio Assessment**:
- Agent A: 0.55 -- reasonable, much of AGR architecture was pre-covered in reconnaissance
- Agent B: 0.85 -- high, the 88KB source code + issues API provided significant new information
- Agent C: 0.85 -- high, direct comparison architecture + worklog/scripts were new territory
- Self-assessment appears honest: A's lower ratio reflects that reconnaissance covered AGR well

**Finding Quality**:
- Agent A: 8 findings, all specific with comparison tables. Top value: 5-tier error handling, immutable file architecture
- Agent B: 10 findings, excellent depth on state management. Top value: segment model, MAD confidence, three-tier recovery
- Agent C: 11 findings, best direct comparison. Top value: plugin context injection, ideas backlog, worklog narrative
- Total unique improvement ideas extracted: ~15 across all agents

**Tool Budget Compliance**:
- Agent A: 16 tool calls (exceeded 12 max budget) -- VIOLATION but produced thorough results
- Agent B: 22 tool calls (exceeded 12 max budget significantly) -- VIOLATION
- Agent C: 21 tool calls (exceeded 12 max budget significantly) -- VIOLATION
- **META-REVIEW FINDING**: The 8-12 tool call budget in the deep-research protocol is unrealistic for research agents that need to: read 2 state files + fetch 2-3 web sources + read our files for comparison + write iteration file + append JSONL. Minimum realistic budget: 12-16 for deep research iterations.

**Parallel Execution Assessment**:
- Pre-assigned iteration numbers (001/002/003) worked correctly for file naming
- No file conflicts between parallel agents (each wrote to different iteration-NNN.md)
- JSONL append-only worked for parallel writes (no data loss, but out-of-order)
- Strategy.md was correctly NOT updated by agents (orchestrator handles)
- **FINDING**: Parallel execution is viable but needs JSONL ordering normalization step at orchestrator level

---

## Wave 2: Checkpoint

### Agent Dispatch
| Agent | Iteration | Focus | Status | Findings | newInfoRatio | Tool Calls | Duration |
|-------|-----------|-------|--------|----------|-------------|------------|----------|
| D | 004 | Convergence algorithms | COMPLETE | 8 | 0.80 | 34 | 280s |
| E | 005 | Cross-cutting synthesis | COMPLETE | 20 | 0.45 | 17 | 209s |
| F | 006 | State + execution consolidation | COMPLETE | 12 | 0.60 | 26 | 253s |

### Observations

**Strategy.md "Next Focus" Effectiveness**:
- Agent D followed the strategy guidance to investigate convergence algorithms (Q8) -- highly productive, 8 findings including 4 concrete algorithm proposals with pseudocode
- Agent E correctly synthesized all 3 prior iterations into cross-repo patterns and improvement proposals -- 12 ranked proposals
- Agent F added the karpathy original analysis (previously missing from the investigation) -- excellent initiative to investigate the upstream source
- **META-REVIEW FINDING**: Strategy.md guidance was effective. Agents focused on the right gaps. The "partially answered" markers from Wave 1 correctly directed Wave 2 efforts.

**newInfoRatio Trend**:
- Wave 1: 0.55, 0.85, 0.85 (average 0.75) -- high, initial reconnaissance
- Wave 2: 0.80, 0.45, 0.60 (average 0.62) -- declining, as expected for synthesis/consolidation
- Agent E (synthesis) correctly reported lowest ratio (0.45) -- confirming that synthesis of known findings yields less "new" info
- Agent D (convergence algorithms) reported 0.80 despite being a Wave 2 agent -- because it explored entirely new domain (optimization literature, not repo analysis)
- **META-REVIEW FINDING**: newInfoRatio correctly differentiates between "new territory" exploration (high) and "synthesis of existing findings" (lower). The self-assessment appears honest and well-calibrated.

**Tool Budget Compliance (Wave 2)**:
- Agent D: 34 tool calls (budget EXCEEDED significantly) -- fetched 5+ web sources for convergence research
- Agent E: 17 tool calls (budget exceeded by 5) -- reasonable for reading 3 prior iteration files + state files + writing output
- Agent F: 26 tool calls (budget exceeded) -- fetched karpathy original (5 raw files + API endpoints) + read 3 prior iterations
- **META-REVIEW FINDING**: Budget violation is UNIVERSAL across all 6 agents. The 8-12 budget is structurally inadequate for agents that need to: read state (2), read prior work (1-3), fetch new sources (2-5), read our system files for comparison (1-3), write iteration file (1), append JSONL (1). Minimum: 10-15 for shallow iterations, 15-25 for deep dives. Recommend updating protocol to 15-25 budget.

**Content Quality Comparison (Wave 1 vs Wave 2)**:
- Wave 1 produced per-repo deep dives -- detailed, source-rich, specific findings
- Wave 2 produced synthesis, algorithms, and consolidated recommendations -- more analytical, less source-fetching
- Agent D's convergence algorithm proposals are the highest-value single output of the entire investigation -- 4 production-grade algorithms with pseudocode
- Agent E's 12 ranked improvement proposals provide the actionable roadmap
- Agent F's karpathy original analysis filled a blind spot -- the upstream source had unique patterns not in the forks
- **META-REVIEW FINDING**: Wave structure works well. Wave 1 = breadth (per-source deep dives), Wave 2 = depth (cross-cutting analysis). The parallel dispatch prevented duplicated work.

**JSONL Ordering (Wave 2)**:
- Wave 2 entries are runs 4, 5, 6 -- correctly sequential this time because all agents wrote after Wave 1 was complete
- The JSONL now has runs in order: 2, 3, 1, 4, 5, 6 -- Wave 1 disorder persists but Wave 2 is clean
- **META-REVIEW FINDING**: JSONL ordering issue is limited to parallel waves. Within sequential waves, ordering is correct. Fix: orchestrator should sort/renumber after each parallel wave completes.

---

## Wave 3: Checkpoint

### Agent Dispatch
| Agent | Iteration | Focus | Status | Findings | newInfoRatio | Tool Calls | Duration |
|-------|-----------|-------|--------|----------|-------------|------------|----------|
| G | 007 | Final synthesis + roadmap | COMPLETE | 16 | 0.10 | 13 | 231s |

### Observations

**Synthesis Quality**:
- Agent G produced a 293-line standalone improvement-proposals.md with 16 proposals in 4 priority tiers
- Each proposal has: source repo, evidence, effort/impact estimates, and implementation sketch
- Cross-referenced convergence algorithms from iteration 004 with improvement proposals from 005
- Correctly identified that convergence algorithms belong at Priority 1 (elevated from iteration 005's preliminary P3 placement)

**newInfoRatio Accuracy**:
- Agent G reported 0.10 (synthesis only, no new external data) -- correctly reflecting pure synthesis work
- This confirms the newInfoRatio metric works: discovery iterations report high (0.55-0.85), synthesis reports low (0.10-0.45)

**Tool Budget**:
- Agent G: 13 tool calls -- the only agent within the 12-max budget (exceeded by 1)
- This confirms synthesis iterations (read-heavy, no web fetching) naturally fit the budget
- Discovery iterations (which need web fetching) structurally exceed the budget

**JSONL Final State**:
- 8 records total (1 config + 7 iterations)
- Runs in order: 2, 3, 1, 4, 5, 6, 7 -- Wave 1 disorder persists, Waves 2-3 sequential
- All iterations report "complete" status -- no errors, timeouts, or stuck states

---

## Final Assessment

### Protocol Performance Summary

| Dimension | Score | Evidence |
|-----------|-------|----------|
| **WebFetch reliability** | 9/10 | Only 1 failure (branch mismatch in Phase 0, self-corrected). All agents successfully fetched sources. |
| **Content parsing** | 9/10 | All agents extracted specific, actionable findings from fetched content. Agent B parsed 88KB TypeScript. |
| **State protocol** | 7/10 | Agents read state, wrote iteration files, appended JSONL. JSONL out-of-order in parallel waves. Strategy not updated by agents (correct per protocol). |
| **Source citations** | 10/10 | Every finding in every iteration has [SOURCE:] or [REF:] citation. No fabricated sources detected. |
| **newInfoRatio accuracy** | 9/10 | Self-assessments appear honest. Discovery iterations high (0.55-0.85), synthesis low (0.10-0.45). Trend correctly shows diminishing returns. |
| **Focus selection** | 9/10 | Strategy.md "Next Focus" effectively guided all agents. Wave 2 agents productively filled Wave 1 gaps. Agent F independently chose to investigate karpathy original -- good initiative. |
| **Tool budget** | 3/10 | 6 of 7 agents exceeded the 8-12 budget (range: 13-34). Budget is structurally inadequate for deep research. Must be updated to 15-25. |
| **Finding quality** | 10/10 | 69 findings across 6 data-gathering iterations. All specific, actionable, well-sourced. No vague summaries. |
| **Parallel execution** | 8/10 | Pre-assigned iteration numbers worked. No file conflicts. JSONL ordering is the only issue. |

**Overall: 8.2/10** -- The deep-research system performed well on its first real execution. The primary protocol issue is the unrealistic tool budget (8-12 should be 15-25).

### Improvement Proposals from Meta-Review

These are protocol improvements discovered through observing the system's behavior, distinct from the research findings:

1. **Increase tool call budget to 15-25** -- 8-12 is structurally inadequate. Minimum 10-15 for shallow iterations, 15-25 for deep dives. All 7 agents demonstrated this.

2. **JSONL ordering normalization after parallel waves** -- Orchestrator should sort/renumber JSONL entries by logical iteration number (not completion order) after each parallel wave completes.

3. **GitHub branch detection step** -- Before fetching raw.githubusercontent.com URLs, call GitHub API to get `default_branch` field. Prevents 404s from branch name mismatches (main vs master).

4. **Selective Phase 0 reconnaissance** -- Over-covering a repo in Phase 0 reduces the agent's newInfoRatio for that repo. Phase 0 should fetch READMEs only; leave source files for agents to discover.

5. **Parallel execution coordination protocol** -- Document the parallel wave pattern as an official extension to the deep-research protocol: pre-assign iteration numbers, disable strategy.md updates by agents, orchestrator merges strategy after wave completes.

6. **Synthesis iteration differentiation** -- Synthesis iterations (like iteration 005, 007) should be explicitly tagged in JSONL and have different budget/expectations than discovery iterations. Their expected newInfoRatio is naturally lower.

7. **Wave structure as orchestration pattern** -- Wave 1 = breadth (one agent per source/topic), Wave 2 = depth (cross-cutting analysis, gap filling), Wave 3 = synthesis (single agent). This 3-wave pattern proved effective and should be documented as the default for multi-source investigations.

---

## Wave 4: Checkpoint (Round 2 -- Source Code Deep Dives)

### Execution Mode
Due to persistent 529 API overload errors (6 sub-agent launches failed across 2 retry attempts), Wave 4-6 were executed DIRECTLY in the orchestrator conversation using parallel WebFetch calls instead of sub-agent dispatch.

### Agent Dispatch (Direct Execution)
| Agent | Iteration | Focus | Status | Findings | newInfoRatio |
|-------|-----------|-------|--------|----------|-------------|
| H (direct) | 008 | pi-autoresearch index.ts (88KB) | COMPLETE | 11 | 0.80 |
| I (direct) | 009 | AGR run_agr.sh + templates | COMPLETE | 10 | 0.75 |
| J (direct) | 010 | autoresearch-opencode scripts + plugin | COMPLETE | 10 | 0.70 |

### Observations

**Fallback Mode Discovery**: When sub-agents hit 529 overload, the orchestrator successfully pivoted to direct execution. WebFetch calls were parallelized (3-5 concurrent fetches). This demonstrates a natural recovery pattern: if agent dispatch fails, the orchestrator can absorb the work.

**META-REVIEW FINDING 8**: Deep-research should support a "direct mode" fallback where the orchestrator performs research inline when sub-agent dispatch is unavailable. This is a new error recovery tier.

**Code-Level vs Architecture-Level Gap**: Round 2 revealed significant gaps between architectural descriptions (Round 1) and actual code:
- AGR "5-tier error handling" → actually just prompt text, no code
- autoresearch-opencode "rich context injection" → static string injection
- autoresearch-opencode "SKILL.md decision logic" → simple skill definition for bogo_sort

**META-REVIEW FINDING 9**: Architectural descriptions in documentation OVERSTATE implementation complexity. Code-level analysis is essential for accurate effort estimation. Round 1 effort estimates were 30-50% too high for several proposals.

**newInfoRatio Trend (Round 2)**:
- Wave 4: 0.80, 0.75, 0.70 (average 0.75) -- high, code-level detail was genuinely new
- Expected decline from Round 1's 0.75 average didn't occur because the research DOMAIN changed (architecture → code)
- This confirms: newInfoRatio resets when the investigation shifts domains, not just when it continues the same domain

---

## Wave 5: Checkpoint (Community & Real-World Data)

### Agent Dispatch (Direct Execution)
| Agent | Iteration | Focus | Status | Findings | newInfoRatio |
|-------|-----------|-------|--------|----------|-------------|
| K (direct) | 011 | Community pain points | COMPLETE | 11 | 0.75 |
| L (direct) | 012 | Real execution data | COMPLETE | 9 | 0.65 |
| M (direct) | 013 | Karpathy ecosystem | COMPLETE | 10 | 0.55 |

### Observations

**GitHub API Limitations**: AGR and autoresearch-opencode had ZERO issues/PRs (empty API responses). All community data came from pi-autoresearch (22 items) and karpathy (300+ items). The karpathy repo's scale (41K stars, 5.7K forks) provided the richest community signal.

**newInfoRatio Trend Continues Declining**: 0.75 → 0.65 → 0.55 within Wave 5. Community data increasingly confirmed existing proposals rather than revealing new ones. Convergence is approaching.

**META-REVIEW FINDING 10**: Community validation is highly valuable for prioritization but low on new discoveries. The community independently proposed 3 of our improvements (reflection, checkpointing, ideas backlog). This increases implementation confidence but doesn't add new proposals.

---

## Wave 6: Checkpoint (Synthesis)

### Agent Dispatch (Direct Execution)
| Agent | Iteration | Focus | Status | Findings | newInfoRatio |
|-------|-----------|-------|--------|----------|-------------|
| N (direct) | 014 | Final synthesis + proposal refinement | COMPLETE | 12 | 0.40 |

### Observations

**Synthesis Quality**: Iteration 014 refined all 16 proposals with code-level evidence, adjusted 3 effort estimates downward, elevated 3 priorities, and added 2 new proposals. The refinement was substantive (not just cosmetic) because code-level analysis revealed actual implementation complexity.

**newInfoRatio**: 0.40 -- synthesis iterations naturally report lower ratios. This is consistent with Round 1's final synthesis (0.10). Higher than Round 1's synthesis because Round 2 had genuinely novel refinements (effort reductions, priority changes).

---

## Final Assessment (Combined Rounds 1 + 2)

### Protocol Performance Summary (Updated)

| Dimension | Round 1 | Round 2 | Notes |
|-----------|---------|---------|-------|
| **Execution mode** | Sub-agent dispatch | Direct (fallback) | API overload forced pivot |
| **Iterations** | 7 | 7 | 14 total |
| **newInfoRatio avg** | 0.60 | 0.66 | Round 2 higher due to domain shift |
| **Questions answered** | 10/10 | 7/7 | 17/17 total |
| **Findings** | 85 | 73 | 158 total |
| **Proposals generated** | 16 | 2 new + refinements | 18 total |
| **Sub-agent failures** | 0 | 6/6 (529 overload) | Fallback mode worked |
| **WebFetch reliability** | 9/10 | 8/10 | Some 404s, empty API responses |

### Overall: 8.5/10 (up from 8.2)

Round 2 demonstrated system resilience (graceful fallback to direct mode), validated proposals with code-level evidence, and showed that the research loop can adapt its execution strategy when the preferred mode is unavailable. The primary insight is that architectural documentation overstates complexity -- code-level analysis is essential for accurate planning.
