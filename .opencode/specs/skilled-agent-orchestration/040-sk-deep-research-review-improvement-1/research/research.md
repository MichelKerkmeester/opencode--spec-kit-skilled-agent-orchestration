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