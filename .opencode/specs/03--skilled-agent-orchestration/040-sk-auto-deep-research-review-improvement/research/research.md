# Research Report: 040 Auto Deep Research / Review Improvement (90 Iterations)

## 1. Executive Summary
This packet now includes 90 total research iterations across three waves:

1. Wave 1 (`001-030`) mapped the internal research/review system.
2. Wave 2 (`031-060`) turned the internal diagnosis into an implementation-ready architecture.
3. Wave 3 (`061-090`) deep-dived three external repos, 10 iterations each:
   - `Auto-Deep-Research-main`
   - `AutoAgent-main`
   - `autoresearch-master`

The final conclusion is now even clearer:

1. The current internal system is already strong as a disk-first packet workflow.
2. The remaining gaps are explicit-contract gaps, not missing automation:
   - executable lifecycle branches
   - lineage metadata
   - canonical reducer/registry ownership
   - runtime/doc parity enforcement
3. The external repos contain many good ideas for runtime portability, explicit handoffs, retries, mode routing, and loop discipline.
4. None of the external repos provides the missing durable lineage-aware research/review history model.

Bottom line: keep the packet-first architecture, borrow external portability and discipline patterns, and build the missing lineage/reducer/parity layer internally.

---

## 2. Scope and Method
### 2.1 Internal Systems Analyzed
- `.opencode/skill/sk-deep-research/**`
- `.opencode/skill/sk-deep-review/**`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_*.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_*.yaml`
- `.codex/prompts/spec_kit-deep-research.md`
- Runtime mirrors in `.codex/agents`, `.opencode/agent`, `.claude/agents`, `.gemini/agents`

### 2.2 External Systems Analyzed
- `external/Auto-Deep-Research-main`
- `external/AutoAgent-main`
- `external/autoresearch-master`

### 2.3 Iteration Structure
- Wave 1: iterations `001-030` (broad internal mapping)
- Wave 2: iterations `031-060` (deep contract and implementation synthesis)
- Wave 3:
  - `061-070` = `Auto-Deep-Research-main`
  - `071-080` = `AutoAgent-main`
  - `081-090` = `autoresearch-master`
- State ledger: `research/deep-research-state.jsonl`
- Detailed artifacts: `research/iterations/iteration-001.md` through `iteration-090.md`

### 2.4 Tooling Notes
- CocoIndex semantic search was unavailable in this environment (`~/.cocoindex_code/daemon.sock` missing).
- Deep source evidence was gathered through direct repository inspection (`rg`, `sed`, `nl`) and reconciled into the same packet state.
- Wave 3 used parallel worker lanes, but all findings were merged back into the same shared ledger and synthesis files to avoid historical fragmentation.

---

## 3. Wave-3 External Findings
### 3.1 Auto-Deep-Research-main
This repo is strongest at runtime packaging and portability.

Key strengths:
- Very simple CLI front door with heavy startup work hidden behind it.
- Real retry logic and provider compatibility handling.
- A full function-call to non-function-call bridge.
- Structured result objects instead of freeform-only output.
- Explicit triage and handoff patterns.
- Clear environment separation and event-driven orchestration.
- Rich logs and replay-friendly provenance.

Evidence:
- `external/Auto-Deep-Research-main/README.md:21-118`
- `external/Auto-Deep-Research-main/autoagent/core.py:71-165`
- `external/Auto-Deep-Research-main/autoagent/fn_call_converter.py:320-460`
- `external/Auto-Deep-Research-main/autoagent/cli.py:109-206`

Best lessons to borrow:
- capability checks before sending requests
- explicit runtime adapters for provider quirks
- named handoff paths
- structured results
- better provenance for debugging and replay

Main limitation:
- state is still runtime-oriented and retrieval-oriented
- logs are detailed, but they are not a canonical research findings history
- memory is query/response retrieval, not lineage-aware continuation

Evidence:
- `external/Auto-Deep-Research-main/autoagent/memory/rag_memory.py:1-140`

Meaning for the internal system:
- copy the portability layer
- do not copy the state model
- keep packet files as the durable truth

### 3.2 AutoAgent-main
This repo is strongest at explicit orchestration and provider normalization.

Key strengths:
- Model/provider capability gating, especially Gemini adaptation.
- Strong fallback bridge for non-function models.
- Create-then-run validation for generated agents and workflows.
- Explicit workflow/event structures.
- Tool catalog controls and guarded tool execution.
- Clear CLI mode routing by user intent.
- Bounded escalation instead of infinite retry loops.
- Named multi-agent handoffs.

Evidence:
- `external/AutoAgent-main/autoagent/core.py:58-200`
- `external/AutoAgent-main/autoagent/fn_call_converter.py:35-247`
- `external/AutoAgent-main/autoagent/tools/meta/edit_agents.py:157-355`
- `external/AutoAgent-main/autoagent/tools/meta/edit_workflow.py:155-279`
- `external/AutoAgent-main/autoagent/agents/system_agent/system_triage_agent.py:8-64`

Best lessons to borrow:
- structured capability matrix instead of ad-hoc provider guessing
- generated-agent/workflow validation by execution
- explicit transitions and handoffs
- guarded tool creation and invocation surfaces

Main limitation:
- history mostly lives in prompts, generated files, or retrieval snippets
- there is no durable lineage graph for long-running research continuity
- retrieval memory is useful, but not enough for ancestry reconstruction

Evidence:
- `external/AutoAgent-main/autoagent/memory/rag_memory.py:1-140`

Meaning for the internal system:
- borrow the orchestration patterns
- keep continuity in packet state, not in prompt history or generated workflow files

### 3.3 autoresearch-master
This repo is strongest at loop discipline.

Key strengths:
- Tiny mutable surface.
- Fixed metric.
- Fixed time budget.
- Clear branch identity per run.
- Append-only results log.
- Immutable evaluation boundary.
- Strong simplicity rule.
- Compatibility guidance handled through forks/overlays instead of bloating the core contract.

Evidence:
- `external/autoresearch-master/README.md:11-17`
- `external/autoresearch-master/README.md:63-81`
- `external/autoresearch-master/program.md:7-37`
- `external/autoresearch-master/program.md:90-114`

Best lessons to borrow:
- keep the mutable core small
- keep trust boundaries explicit
- prefer append-only ledgers for experimental outcomes
- make simplicity a real decision rule
- separate compatibility overlays from the core contract

Main limitation:
- this is a keep/discard experiment loop, not a durable research/review history system
- it does not solve continuation across completed work
- it does not solve review finding accumulation
- it does not solve canonical reducer ownership

Meaning for the internal system:
- adopt the discipline
- do not copy the narrow scope

### 3.4 Cross-External Synthesis
The three external repos together sharpened the design boundary:

What they do well:
- portability
- retries and compatibility handling
- explicit handoffs
- workflow/event structure
- bounded autonomy loops
- clear trust boundaries
- disciplined mutable surfaces

What they do not solve:
- lineage-aware continuation across completed sessions
- canonical evolving research/review history
- deterministic reconciliation of raw logs, summaries, dashboards, and findings

The best import set is therefore:
1. runtime capability matrix
2. explicit handoff/event discipline
3. structured results and provenance
4. machine-owned vs analyst-owned state boundaries
5. small mutable core
6. fixed evaluation or decision rules where possible

---

## 4. Internal Findings That Still Stand
Wave 3 did not overturn the internal diagnosis from Waves 1 and 2.

### 4.1 Lifecycle UX Still Exceeds Lifecycle Execution
The workflow offers `resume/restart/fork`, but restart/fork are not fully implemented as first-class executable branches.

Evidence:
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:124-128`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:178-190`

### 4.2 Completed Sessions Are Still Synthesis-Centric
Completed sessions still route toward synthesis instead of true lineage continuation.

Evidence:
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:127-129`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:333-355`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:130-132`

### 4.3 Event Model Is Still Genealogically Thin
The log is useful operationally, but it cannot reconstruct parent/child lineage or generation semantics.

Evidence:
- `.opencode/skill/sk-deep-research/references/state_format.md:219-231`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md:74`

### 4.4 Review Contract Drift Still Exists
Artifact names and pause semantics still drift across SKILL, README, references, YAML, and playbook surfaces.

Evidence:
- `.opencode/skill/sk-deep-review/SKILL.md:190-210`
- `.opencode/skill/sk-deep-review/README.md:155-160`
- `.opencode/skill/sk-deep-review/references/state_format.md:19-34`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:83-85`

### 4.5 Pause Sentinel Drift Is Still Contract-Critical
Different surfaces still teach different sentinel names in review mode.

Evidence:
- `.opencode/skill/sk-deep-review/SKILL.md:210`
- `.opencode/skill/sk-deep-review/references/loop_protocol.md:174-179`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:307-310`
- `.opencode/skill/sk-deep-review/README.md:159,219,307`

### 4.6 Runtime Parity Still Has Gaps
Codex/OpenCode/Claude/Gemini mirrors still diverge in bootstrap framing, tool declarations, and output schema sections.

Evidence:
- `.codex/agents/orchestrate.toml:12`
- `.opencode/agent/orchestrate.md:20`
- `.claude/agents/orchestrate.md:1-26`
- `.gemini/agents/orchestrate.md:1-26`
- `.opencode/agent/context-prime.md:130-134`
- `.codex/agents/context-prime.md:129-133`

---

## 5. Refined Root Cause Model
1. **Lifecycle underspecification in the executable state machine**
   The UX offers lifecycle options that are not yet real branches.
2. **Cross-surface contract drift**
   Naming, sentinel, and schema drift persists across skills, YAML, README, and runtime mirrors.
3. **No canonical reducer**
   Iteration markdown, JSONL, dashboard, strategy, and synthesis can diverge.
4. **Parity is convention-based, not gate-enforced**
   Mirrors drift because they are compared manually, not by hard checks.
5. **Portability and lineage are currently mixed together**
   External systems show that runtime portability is a different design problem from durable historical continuity.

---

## 6. Target Architecture (Implementation-Ready)
### 6.1 Canonical Lineage Schema
Additive, backward-compatible keys:
- `sessionId`
- `parentSessionId`
- `lineageMode` (`new`, `resume`, `restart`, `fork`, `completed-continue`)
- `generation`
- `continuedFromRun`

### 6.2 Executable Lifecycle Branches
Implement explicit behaviors for:
- `resume`
- `restart`
- `fork`
- `completed-continue`

**`completed-continue` guardrails:** This is the least proven lifecycle mode and carries the highest corruption risk. Before reopening a completed lineage:
1. The original synthesis must be snapshotted as an immutable artifact (e.g., `synthesis-v{generation}.md`).
2. New segments append to the lineage but cannot modify prior synthesis content.
3. A `completedAt` + `reopenedAt` timestamp pair must be recorded to preserve the integrity boundary.
4. If the reopened segment produces findings that contradict the original synthesis, they must be recorded as amendments, not overwrites.

### 6.3 Deterministic Reducer
After each iteration:
- input: `{ latestJSONLDelta: Event[], newIterationFile: string, priorReducedState: ReducedState }`
- output:
  - canonical findings/question registry (`openQuestions`, `resolvedQuestions`, `keyFindings`, `ruledOutDirections`)
  - regenerated dashboard metrics (`iterationsCompleted`, `openQuestions`, `resolvedQuestions`, `keyFindings`, `convergenceScore`, `coverageBySources`; for review mode add `dimensionsCovered`, `findingsBySeverity`)
  - machine-owned strategy sections
- failure modes:
  - malformed JSONL delta → skip delta + emit warning event
  - missing iteration file → reducer is a no-op with logged error
  - schema version mismatch → reject with explicit version conflict event
- the reducer must be idempotent: re-running with the same inputs produces identical outputs

### 6.4 Canonical Naming Contract + Migration Window
Use dual-read/single-write with a **4-week migration window** from the canonical naming freeze:
- read legacy and canonical names during the window
- write only canonical names from day one
- emit migration events throughout the window to track adoption
- remove legacy read paths only after the 4-week window closes and adoption logs confirm no legacy-only usage remains

### 6.5 Runtime Capability Matrix + Portability Adapter
Borrowing from the external repos, make provider/tool behavior explicit:
- function-calling support
- sender compatibility
- schema adaptation requirements
- fallback bridge eligibility
- tool-call formatting constraints

### 6.6 Runtime Parity Gates
Static or CI checks should enforce:
- bootstrap clause presence
- declared tools sufficient for described behavior
- required schema sections in context-prime outputs
- drift token detection across mirrors

---

## 7. Hook + Non-Hook Compatibility Contract
These remain non-negotiable:

1. Disk packet remains canonical source of truth.
2. No lifecycle decision depends on hidden runtime memory.
3. Pause/resume/restart/fork must be derivable from packet artifacts only.
4. Hook bootstrap improves ergonomics, not correctness.
5. Non-hook recovery must produce the same lifecycle semantics as hook-capable runtimes.

---

## 8. Phased Rollout Plan

**Test infrastructure note:** The current system has no automated test harness for these skills. Phases A and B will rely on manual validation using the scenarios in the validation matrix (Section 9). Automated lifecycle and parity tests should be introduced during Phase C alongside the reducer, since the reducer's idempotency contract makes it naturally testable and provides a foundation for broader test coverage.

### Phase 0 (Prerequisite): Test Infrastructure — S
- Define test harness structure for lifecycle, reducer, and parity tests.
- Implement manual test scripts or lightweight automated runners.
- Establish baseline test coverage targets for each subsequent phase.

### Phase A (P0): Contract Freeze and Drift Neutralization — S
- Freeze naming + sentinel contract.
- Introduce compatibility read layer (4-week migration window).
- Update docs/playbooks to stop teaching stale names.

### Phase B (P0): Lifecycle Branch Execution — M
- Add explicit YAML branches for restart/fork/completed-continue.
- Add archival snapshot behavior and lineage metadata writes.
- Add `completed-continue` guardrails: immutable synthesis snapshot, timestamp pair, amendment-only semantics.

### Phase C (P1): Reducer + Findings Registry — L
- Add deterministic reducer pass after each iteration.
- Define reducer interface contract (inputs, outputs, failure modes, idempotency).
- Promote registry as machine-canonical evolving state.
- Add reducer integrity tests.

### Phase D (P1): Runtime Capability Layer + Parity Gates — M
- Add capability matrix and portability adapter layer.
- Add CI parity checks for orchestrate/context-prime/deep-* mirrors.

### Phase E (P2): Cleanup and Deprecation — S
- Remove legacy read paths after 4-week adoption window closes.
- Tighten contracts to one canonical naming family.

*Sizing: S = days, M = 1-2 weeks, L = 2-4 weeks.*

---

## 9. Validation Matrix
1. **Lifecycle e2e**: resume/restart/fork/completed-continue all execute and emit lineage events.
2. **Completed-continue integrity**: original synthesis is snapshotted immutably; new segments cannot overwrite prior synthesis; contradictory findings are recorded as amendments.
3. **Pause sentinel e2e**: legacy and canonical names both work during the 4-week migration window; canonical only after.
4. **Reducer integrity**: JSONL, iteration markdown, registry, dashboard, and synthesis stay consistent. Re-running the reducer with identical inputs produces identical outputs.
5. **Runtime capability checks**: provider decisions match the capability matrix.
6. **Runtime parity**: all mirror gates pass across Codex/OpenCode/Claude/Gemini.
7. **Hook/non-hook parity**: equivalent lifecycle outcomes with and without bootstrap hooks.
8. **Migration replay**: legacy research/review artifacts rehome deterministically without data loss.
9. **Review dimension coverage**: review-mode convergence claims are blocked unless all declared review dimensions have been covered. An incomplete dimension sweep must fail validation.

---

## 10. Risks and Controls
1. **Paused-session breakage during naming unification**
   Control: dual sentinel read window (4 weeks) + migration logging.
2. **Branch explosion from poorly bounded fork behavior**
   Control: canonical archive namespace + lineage metadata constraints.
3. **Reducer overwriting analyst nuance**
   Control: strict machine-owned vs analyst-owned section boundaries.
4. **Runtime drift reintroduced after fixes**
   Control: parity checks in CI, not just documentation.
5. **Over-importing external complexity**
   Control: borrow patterns, not frameworks; keep packet state canonical.
6. **`completed-continue` corrupting original synthesis**
   Control: immutable synthesis snapshot before reopening; amendment-only semantics for contradictory findings; `completedAt`/`reopenedAt` timestamp pair enforced.

---

## 11. Recommended Next Step
Move this packet into implementation planning with these priorities:

1. test infrastructure baseline (Phase 0)
2. lineage schema + lifecycle branch execution (including `completed-continue` guardrails)
3. naming/sentinel canonicalization with 4-week compatibility window
4. reducer (with defined interface contract) + findings registry insertion
5. runtime capability matrix
6. parity gates across runtime mirrors (including review dimension coverage)
7. hook/non-hook lifecycle matrix tests

---

## 12. Confidence
Overall confidence: **0.92**

High confidence:
- lifecycle execution gaps
- naming/sentinel drift
- runtime parity mismatches
- external lineage-model limitations
- value of external portability and discipline patterns

Medium confidence:
- exact migration-window length
- final shape of the capability matrix
- how much historical packet repair will be needed once lineage keys exist

---

## 13. Final Verdict
The internal system is close to being excellent, but it is not yet a lineage-aware evolving research/review database. After 90 iterations, the direction is stable:

- keep the disk-first packet model
- add explicit lineage metadata
- make lifecycle branches real
- add a deterministic reducer and findings registry
- enforce parity across runtime mirrors
- borrow external portability and loop-discipline patterns without giving up packet truth
