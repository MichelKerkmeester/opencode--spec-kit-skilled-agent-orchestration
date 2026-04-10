Reading additional input from stdin...
OpenAI Codex v0.118.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d7747-897d-7261-b845-0826ffbe82ce
--------
user
You are a deep research agent. Run 10 research iterations on Phase 1 (Runtime Truth Foundation) of packet 042.

Read the spec folder at .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/ — read spec.md, plan.md, tasks.md, decision-record.md, and checklist.md.

Then read the ACTUAL implementation files that Phase 1 targets to ground your research in current reality:
- .opencode/skill/sk-deep-research/SKILL.md
- .opencode/skill/sk-deep-research/references/convergence.md
- .opencode/skill/sk-deep-research/references/loop_protocol.md
- .opencode/skill/sk-deep-research/references/state_format.md
- .opencode/skill/sk-deep-research/assets/deep_research_config.json
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs
- .opencode/skill/sk-deep-review/SKILL.md
- .opencode/skill/sk-deep-review/references/convergence.md
- .opencode/skill/sk-deep-review/references/loop_protocol.md
- .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
- .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml
- .opencode/agent/deep-research.md
- .opencode/agent/deep-review.md

## RESEARCH QUESTIONS (10 iterations)

1. Stop-reason taxonomy: Is the proposed 6-value enum (max_iterations, converged, all_dimensions_clean, insufficient_evidence, user_stopped, error_budget_exhausted) complete? Are there real-world stop scenarios it misses? Search the codebase for actual stop behavior patterns.
2. Legal done gates: The spec says convergence math + coverage + quality gates must ALL pass. What specific edge cases could cause false positives (premature stop) or false negatives (stuck loops)? Look at actual convergence.md implementations.
3. Resume semantics: How do resume, restart, fork, and completed-continue actually work today? What gaps exist between the documented contract and the YAML workflow implementation?
4. Audit journals: What should the journal schema look like? What events are worth recording vs noise? Look at what the agent already logs in JSONL and what's missing.
5. Dashboard gaps: Compare the current dashboard templates with what operators actually need. What metrics are computed but not displayed? What's displayed but not useful?
6. Claim verification ledger: Is JSONL the right canonical format? How does the reducer handle verification status transitions? What prevents false verification?
7. Phase ordering: Should behavior testing really move to Phase 3 (before parity)? What are the risks of testing against unstable contracts?
8. Reducer architecture: How does reduce-state.cjs currently work? What's the performance profile at 50+ iterations? Where are the bottlenecks?
9. Agent instruction quality: Are the agent .md files clear enough for fresh-context agents to produce correct JSONL records? What's ambiguous?
10. Cross-loop consistency: Where do deep-research and deep-review contracts actually diverge? Is the divergence intentional or accidental drift?

## OUTPUT FORMAT
For each iteration: title, focus, 3-5 key findings with file:line evidence, novel insight, open questions.
After all 10: synthesis with top recommendations, gaps found, suggested spec changes.

Spec folder: .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation (pre-approved, skip Gate 3)
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only deep-research pass on Phase 1 of packet `042`, grounded in the actual runtime/docs that exist today. I’ll start with the required context gates: memory trigger check, skill routing, then I’ll load the phase docs and targeted implementation files before running the 10 research iterations.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "042-sk-deep-research-review-improvement-2|runtime truth foundation|deep research|deep review" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
37:## Task 1: Execute Batch C deep reviews for phases 011-014 with scoped writes and state updates, outcome success
79:- when running 026 batch deep review, the user-required scope was explicit: writes limited to `026/review/<phase-slug>/*`, the shared state file, and optionally the consolidated report; keep review targets read-only and do not edit parent/runtime artifacts [Task 1]
397:- symptom: strict validation step in prompt cannot run; cause: phase lacks Level 3 docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`); fix: create/verify those docs before running `validate.sh --strict` or deep research loops [Task 1]
425:- 008-bmad-autonomous-development, 009-xethryon, phase-research-prompt.md, skip spec folder, 001-research-agentic-systems, Level 3 docs before deep research
440:- no failures observed; preserve the same gate order (Level 3 docs -> strict validate -> deep research) to avoid exploratory research before folder documentation is ready [Task 1]
776:- when the user asked for deep review “make sure everything works as expected ... check the feature catalog and manual testing playbook, and all commands, agents and readmes,” treat it as full-spectrum audit + runtime/doc parity, not a narrow fix pass [Task 1][Task 2]
1195:## Task 1: Run 20-iteration deep review and integrate runtime/doc fixes

exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Run 10 research iterations on packet 042 phase 1 runtime truth foundation comparing spec docs to actual implementations for sk-deep-research and sk-deep-review stop reasons, convergence, resume semantics, journals, dashboards, reducer architecture, and cross-loop consistency" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 2261ms:
2026-04-10 14:04:49.576 xcodebuild[29943:32020269]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 14:04:49.795 xcodebuild[29943:32020268] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-yYNxZ2FU' (errno=Operation not permitted)
2026-04-10 14:04:50.273 xcodebuild[29988:32020350]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 14:04:50.405 xcodebuild[29988:32020349] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !convergence, !sk-deep-research(explicit), convergence, deep(name), iterations~"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !sk-deep-review(explicit), convergence, deep(name), iterations~, loop"
  },
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !spec, architecture, documentation, document~, folder"
  },
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.93,
    "uncertainty": 0.28,
    "passes_threshold": true,
    "reason": "Matched: !intent:review, !review, !review(multi), review(name)"
  }
]

codex
Skill routing is clear: I’m using `sk-deep-research` as the primary workflow, with `sk-deep-review` loaded alongside it for the cross-loop comparison questions. I also found prior memory pointing to the same “Level 3 docs first, then strict validation, then deep research” pattern, so I’m using that as context rather than starting from assumptions.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '388,404p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   388	- canonical source for `002-implement-cache-warning-hooks` updates is the post-2026-04-08 synthesis in `001-research-graph-context-systems/research.md` and `research/recommendations.md`; align ordering/prereqs/acceptance there and keep task wording consistent about `.claude/settings.local.json` boundaries [Task 6]
   389	- phase sequence now expected in `002` docs: shared schema/metadata -> replay harness -> stop timestamp -> seam validation -> resume estimator -> UserPromptSubmit gate, with producer metadata + cache token carry-forward + bootstrap authority kept as acceptance anchors [Task 6]
   390	- `031-normalized-analytics-reader` closeout runbook: mark `spec.md` status `Complete`, align checklist P0/P1 totals to actual counts, refresh `description.json` timestamp/description, then run strict validation plus completion checks before closure [Task 7]
   391	- if memory indexing flags lineage/template mismatches during closeout, remove stale rows with `memory_delete`, rerun forced `memory_index_scan` after cooldown, and verify clean reindex before final sign-off [Task 7]
   392	- follow-on phase train now implemented as: `026/005` measurement contract -> `026/006` trust-axis contract -> `026/007` detector floor -> `026/008` graph hint nudge -> `026/009` auditable publication -> `024/032` cached-summary consumer -> `024/033` optional FTS hardening -> `024/034` workflow/token-insight split [Task 8]
   393	- for newly created child packets, keep full Level 3 artifacts (`spec/plan/tasks/checklist/decision-record/implementation-summary/description`), remove README scaffolds, run strict validation per child, then validate parent with `--no-recursive` to confirm phase-link and parent metadata wiring [Task 8]
   394	
   395	## Failures and how to do differently
   396	
   397	- symptom: strict validation step in prompt cannot run; cause: phase lacks Level 3 docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`); fix: create/verify those docs before running `validate.sh --strict` or deep research loops [Task 1]
   398	- symptom: strict validation shows `ANCHORS_VALID` warnings in `decision-record.md`; cause: extra non-template `adr-*` anchor comment lines; fix: remove only the extra comment anchors (not the ADR sections), then rerun recursive `validate.sh --strict` to confirm 0 errors/0 warnings [Task 5]
   399	- symptom: large multi-file memory patch fails to apply cleanly; cause: generated memory snapshots drift from expected formatting; fix: use smaller per-file patches on the latest packet snapshots and revalidate after each batch [Task 5]
   400	- symptom: closeout validation passes but memory index reports lineage mismatch/stale packet rows; cause: old memory_index entries persisted through packet updates; fix: delete stale row IDs, wait out cooldown, then force `memory_index_scan` and confirm zero failed entries before marking complete [Task 7]
   401	- symptom: new phase packets fail strict checks with `AI_PROTOCOL`, `SECTION_COUNTS`, or `SPEC_DOC_INTEGRITY`; cause: scaffold docs left template-thin (missing AI Execution Protocol blocks, acceptance scenarios, anchors) or README placeholders were kept; fix: fill Level 3 templates immediately and delete scaffold READMEs before rerunning strict validation [Task 8]
   402	
   403	# Task Group: Research-Agentic-Systems Phase Prompt Gating (Level 3 Before Deep Research)
   404	scope: per-phase prompt artifacts that enforce Level 3 Spec Kit documentation before `spec_kit:deep-research` against each phase `external/` tree

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/SKILL.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/SKILL.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	name: sk-deep-review
     3	description: "Autonomous iterative code review and quality auditing loop with externalized state, convergence detection, severity-weighted findings (P0/P1/P2), and fresh context per iteration"
     4	allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, mcp__cocoindex_code__search]
     5	# Note: Task tool is for the command executor (loop management). The @deep-review agent itself does NOT have Task (LEAF-only).
     6	# No WebFetch: review is code-only and read-only. No external resource fetching.
     7	argument-hint: "[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
     8	version: 1.0.0.0
     9	---
    10	
    11	<!-- Keywords: deep-review, code-audit, iterative-review, review-loop, convergence-detection, externalized-state, fresh-context, review-agent, JSONL-state, severity-findings, P0-P1-P2, release-readiness, spec-alignment -->
    12	
    13	# Autonomous Deep Review Loop
    14	
    15	Iterative code review and quality auditing protocol with fresh context per iteration, externalized state, convergence detection, and severity-weighted findings (P0/P1/P2).
    16	
    17	Runtime path resolution:
    18	- OpenCode/Copilot runtime: `.opencode/agent/*.md`
    19	- Claude runtime: `.claude/agents/*.md`
    20	- Codex runtime: `.codex/agents/*.toml`
    21	
    22	<!-- ANCHOR:when-to-use -->
    23	## 1. WHEN TO USE
    24	
    25	### When to Use This Skill
    26	
    27	Use this skill when:
    28	- Code quality audit requiring multiple rounds across different review dimensions
    29	- Spec folder validation requiring cross-reference checks between docs and implementation
    30	- Release readiness check before shipping a feature or component
    31	- Finding misalignments between spec documents and actual code
    32	- Verifying cross-references across documentation, agents, commands, and code
    33	- Iterative review where each dimension's findings inform subsequent dimensions
    34	- Unattended or overnight audit sessions
    35	
    36	### When NOT to Use
    37	
    38	- Simple single-pass code review (use `sk-code-review` instead)
    39	- Known issues that just need fixing (go directly to implementation)
    40	- Implementation tasks (use `sk-code-opencode` or `/spec_kit:implement`)
    41	- Quick one-file checks (use direct Grep/Read)
    42	- Fewer than 2 review dimensions needed (single-pass suffices)
    43	
    44	### Trigger Phrases
    45	
    46	- "review code quality" / "audit this code"
    47	- "audit spec folder" / "validate spec completeness"
    48	- "release readiness check" / "pre-release review"
    49	- "find misalignments" (between spec and implementation)
    50	- "verify cross-references" (across docs and code)
    51	- "deep review" / "iterative review" / "review loop"
    52	- "quality audit" / "convergence detection"
    53	
    54	### Keyword Triggers
    55	
    56	`deep review`, `code audit`, `iterative review`, `review loop`, `release readiness`, `spec folder review`, `convergence detection`, `quality audit`, `find misalignments`, `verify cross-references`, `pre-release review`, `audit spec folder`
    57	
    58	---
    59	
    60	<!-- /ANCHOR:when-to-use -->
    61	<!-- ANCHOR:smart-routing -->
    62	## 2. SMART ROUTING
    63	
    64	### Resource Loading Levels
    65	
    66	| Level | When to Load | Resources |
    67	|-------|-------------|-----------|
    68	| ALWAYS | Every skill invocation | `references/quick_reference.md` |
    69	| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format, review contract |
    70	| ON_DEMAND | Only on explicit request | Full protocol docs, detailed specifications |
    71	
    72	### Smart Router Pseudocode
    73	
    74	```python
    75	from pathlib import Path
    76	
    77	SKILL_ROOT = Path(__file__).resolve().parent
    78	LOCAL_REFS   = SKILL_ROOT / "references"
    79	LOCAL_ASSETS = SKILL_ROOT / "assets"
    80	DEFAULT_RESOURCE = "references/quick_reference.md"
    81	
    82	INTENT_SIGNALS = {
    83	    "REVIEW_SETUP":       {"weight": 4, "keywords": ["deep review", "review mode", "code audit", "iterative review", ":review", "audit spec"]},
    84	    "REVIEW_ITERATION":   {"weight": 4, "keywords": ["review iteration", "dimension review", "review findings", "P0", "P1", "P2"]},
    85	    "REVIEW_CONVERGENCE": {"weight": 3, "keywords": ["review convergence", "coverage gate", "verdict", "binary gate", "all dimensions"]},
    86	    "REVIEW_REPORT":      {"weight": 3, "keywords": ["review report", "remediation", "verdict", "release readiness", "planning packet"]},
    87	}
    88	
    89	NOISY_SYNONYMS = {
    90	    "REVIEW_SETUP":       {"audit code": 2.0, "review spec folder": 1.8, "release readiness": 1.5, "pre-release": 1.5},
    91	    "REVIEW_ITERATION":   {"review dimension": 1.5, "check correctness": 1.4, "check security": 1.4, "check alignment": 1.4},
    92	    "REVIEW_CONVERGENCE": {"all dimensions covered": 1.6, "coverage complete": 1.5, "stop review": 1.4},
    93	    "REVIEW_REPORT":      {"review results": 1.5, "what to fix": 1.4, "ship decision": 1.6, "final report": 1.5},
    94	}
    95	
    96	# RESOURCE_MAP: local assets + local review-specific protocol docs
    97	RESOURCE_MAP = {
    98	    "REVIEW_SETUP":       [
    99	        "references/loop_protocol.md",
   100	        "references/state_format.md",
   101	        "assets/review_mode_contract.yaml",
   102	        "assets/deep_review_strategy.md",
   103	    ],
   104	    "REVIEW_ITERATION":   [
   105	        "references/loop_protocol.md",
   106	        "references/convergence.md",
   107	        "assets/review_mode_contract.yaml",
   108	    ],
   109	    "REVIEW_CONVERGENCE": [
   110	        "references/convergence.md",
   111	        "assets/review_mode_contract.yaml",
   112	    ],
   113	    "REVIEW_REPORT":      [
   114	        "references/state_format.md",
   115	        "assets/review_mode_contract.yaml",
   116	    ],
   117	}
   118	
   119	LOADING_LEVELS = {
   120	    "ALWAYS":            [DEFAULT_RESOURCE],
   121	    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference"],
   122	    "ON_DEMAND":         [
   123	        "references/loop_protocol.md",
   124	        "references/state_format.md",
   125	        "references/convergence.md",
   126	    ],
   127	}
   128	```
   129	
   130	### Scoped Guard
   131	
   132	```python
   133	def _guard_in_skill():
   134	    """Verify this skill is active before loading resources."""
   135	    if not hasattr(_guard_in_skill, '_active'):
   136	        _guard_in_skill._active = True
   137	    return _guard_in_skill._active
   138	```
   139	
   140	### Phase Detection
   141	
   142	Detect the current review phase from dispatch context to load appropriate resources:
   143	
   144	| Phase | Signal | Resources to Load |
   145	|-------|--------|-------------------|
   146	| Init | No JSONL exists in `review/` | Loop protocol, state format, review contract |
   147	| Iteration | Dispatch context includes dimension + iteration number | Loop protocol, convergence, review contract |
   148	| Stuck | Dispatch context includes "RECOVERY" | Convergence, loop protocol |
   149	| Synthesis | Convergence triggered STOP | Review contract, state format |
   150	
   151	---
   152	
   153	<!-- /ANCHOR:smart-routing -->
   154	<!-- ANCHOR:how-it-works -->
   155	## 3. HOW IT WORKS
   156	
   157	### Architecture: 3-Layer Integration
   158	
   159	```
   160	User invokes: /spec_kit:deep-review "target"
   161	                    |
   162	                    v
   163	    ┌─────────────────────────────────┐
   164	    │  /spec_kit:deep-review command  │  Layer 1: Command
   165	    │  (YAML workflow + loop config)    │  Manages loop lifecycle
   166	    └──────────────┬──────────────────┘
   167	                   |
   168	                   v
   169	    ┌─────────────────────────────────┐
   170	    │     YAML Loop Engine            │  Layer 2: Workflow
   171	    │  - Init (config, strategy)       │  Dispatch, evaluate, decide
   172	    │  - Loop (dispatch + converge)   │
   173	    │  - Synthesize (review-report)   │
   174	    │  - Save (memory context)        │
   175	    └──────────────┬──────────────────┘
   176	                   |  dispatches per iteration
   177	                   v
   178	    ┌─────────────────────────────────┐
   179	    │    @deep-review (LEAF agent)    │  Layer 3: Agent
   180	    │  - Reads: state + strategy      │  Fresh context each time
   181	    │  - Executes ONE review cycle    │
   182	    │  - Writes: findings + state      │
   183	    │  - Tools: Grep, Read, Glob, etc │
   184	    │  - No WebFetch (code-only)      │
   185	    └──────────────┬──────────────────┘
   186	                   |
   187	                   v
   188	    ┌─────────────────────────────────┐
   189	    │        State Files (disk)       │  Externalized State
   190	    │  deep-review-config.json         │  Persists across iterations
   191	    │  deep-review-state.jsonl        │
   192	    │  deep-review-strategy.md        │
   193	    │  deep-review-dashboard.md       │
   194	    │  review/iterations/             │
   195	    │    iteration-NNN.md             │
   196	    │  review/review-report.md        │
   197	    └─────────────────────────────────┘
   198	```
   199	
   200	### State Packet Location
   201	
   202	The review state packet lives under `{spec_folder}/review/`:
   203	
   204	```text
   205	review/
   206	  deep-review-config.json            # Immutable after init: review parameters
   207	  deep-review-state.jsonl            # Append-only review iteration log
   208	  deep-review-strategy.md            # Review dimensions, findings, next focus
   209	  deep-review-dashboard.md           # Auto-generated review dashboard
   210	  .deep-review-pause                 # Pause sentinel checked between iterations
   211	  review-report.md                   # Final review report (synthesis output)
   212	  iterations/
   213	    iteration-NNN.md                 # Write-once review findings per iteration
   214	```
   215	
   216	### Core Innovation: Fresh Context Per Iteration
   217	
   218	Each agent dispatch gets a fresh context window. State continuity comes from files, not memory. This solves context degradation in long review sessions where accumulated findings would otherwise bias subsequent dimensions.
   219	
   220	### Data Flow

 succeeded in 0ms:
     1	---
     2	name: sk-deep-research
     3	description: "Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection, and fresh context per iteration"
     4	allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]
     5	# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
     6	argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
     7	version: 1.4.0.0
     8	---
     9	
    10	<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, convergence-detection, externalized-state, fresh-context, research-agent, JSONL-state, strategy-file -->
    11	
    12	# Autonomous Deep Research Loop
    13	
    14	Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.
    15	
    16	Runtime path resolution:
    17	- OpenCode/Copilot runtime: `.opencode/agent/*.md`
    18	- Claude runtime: `.claude/agents/*.md`
    19	- Codex runtime: `.codex/agents/*.toml`
    20	
    21	<!-- ANCHOR:when-to-use -->
    22	## 1. WHEN TO USE
    23	
    24	### When to Use This Skill
    25	
    26	Use this skill when:
    27	- Deep investigation requiring multiple rounds of discovery
    28	- Topic spans 3+ technical domains or sources
    29	- Initial findings need progressive refinement
    30	- Overnight or unattended research sessions
    31	- Research where prior findings inform subsequent queries
    32	
    33	### When NOT to Use
    34	
    35	- Simple, single-question research (use direct codebase search or `/spec_kit:plan`)
    36	- Known-solution documentation (use `/spec_kit:plan`)
    37	- Implementation tasks (use `/spec_kit:implement`)
    38	- Quick codebase searches (use `@context` or direct Grep/Glob)
    39	- Fewer than 3 sources needed (single-pass research suffices)
    40	
    41	### Keyword Triggers
    42	
    43	`autoresearch`, `deep research`, `autonomous research`, `research loop`, `iterative research`, `multi-round research`, `deep investigation`, `comprehensive research`
    44	
    45	For iterative code review and quality auditing, see `sk-deep-review`.
    46	
    47	### Lifecycle Contract
    48	
    49	Live lifecycle branches:
    50	- `resume` — continue the active lineage
    51	- `restart` — start a new generation with explicit parent linkage
    52	- `fork` — branch from the current packet state
    53	- `completed-continue` — reopen a completed lineage only after immutable synthesis snapshotting
    54	
    55	---
    56	
    57	<!-- /ANCHOR:when-to-use -->
    58	<!-- ANCHOR:smart-routing -->
    59	## 2. SMART ROUTING
    60	
    61	### Resource Loading Levels
    62	
    63	| Level | When to Load | Resources |
    64	|-------|-------------|-----------|
    65	| ALWAYS | Every skill invocation | Quick reference baseline |
    66	| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format |
    67	| ON_DEMAND | Only on explicit request | Templates, detailed specifications |
    68	
    69	### Smart Router Pseudocode
    70	
    71	```python
    72	from pathlib import Path
    73	
    74	SKILL_ROOT = Path(__file__).resolve().parent
    75	RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
    76	DEFAULT_RESOURCE = "references/quick_reference.md"
    77	
    78	INTENT_SIGNALS = {
    79	    "LOOP_SETUP": {"weight": 4, "keywords": ["autoresearch", "deep research", "research loop", "autonomous research"]},
    80	    "ITERATION": {"weight": 4, "keywords": ["iteration", "next round", "continue research", "research cycle"]},
    81	    "CONVERGENCE": {"weight": 3, "keywords": ["convergence", "stop condition", "diminishing returns", "stuck"]},
    82	    "STATE": {"weight": 3, "keywords": ["state file", "JSONL", "strategy", "resume", "auto-resume"]},
    83	}
    84	
    85	NOISY_SYNONYMS = {
    86	    "LOOP_SETUP": {"run research": 2.0, "investigate deeply": 1.8, "overnight research": 1.5},
    87	    "ITERATION": {"another pass": 1.5, "keep searching": 1.4, "dig deeper": 1.6},
    88	    "CONVERGENCE": {"good enough": 1.4, "stop when": 1.5, "diminishing": 1.6},
    89	    "STATE": {"pick up where": 1.5, "continue from": 1.4, "resume": 1.8},
    90	}
    91	
    92	RESOURCE_MAP = {
    93	    "LOOP_SETUP": ["references/loop_protocol.md", "references/state_format.md", "assets/deep_research_config.json"],
    94	    "ITERATION": ["references/loop_protocol.md", "references/convergence.md"],
    95	    "CONVERGENCE": ["references/convergence.md"],
    96	    "STATE": ["references/state_format.md", "assets/deep_research_strategy.md"],
    97	}
    98	
    99	LOADING_LEVELS = {
   100	    "ALWAYS": [DEFAULT_RESOURCE],
   101	    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference"],
   102	    "ON_DEMAND": ["references/loop_protocol.md", "references/state_format.md", "references/convergence.md"],
   103	}
   104	```
   105	
   106	### Scoped Guard
   107	
   108	```python
   109	def _guard_in_skill():
   110	    """Verify this skill is active before loading resources."""
   111	    if not hasattr(_guard_in_skill, '_active'):
   112	        _guard_in_skill._active = True
   113	    return _guard_in_skill._active
   114	
   115	def discover_markdown_resources(base_path: Path) -> list[str]:
   116	    """Discover all .md files in the assets directory."""
   117	    return sorted(str(p.relative_to(base_path)) for p in (base_path / "references").glob("*.md"))
   118	```
   119	
   120	### Phase Detection
   121	
   122	Detect the current research phase from dispatch context to load appropriate resources:
   123	
   124	| Phase | Signal | Resources to Load |
   125	|-------|--------|-------------------|
   126	| Init | No JSONL exists | Loop protocol, state format |
   127	| Iteration | Dispatch context includes iteration number | Loop protocol, convergence |
   128	| Stuck | Dispatch context includes "RECOVERY" | Convergence, loop protocol |
   129	| Synthesis | Convergence triggered STOP | Quick reference |
   130	
   131	---
   132	
   133	<!-- /ANCHOR:smart-routing -->
   134	<!-- ANCHOR:how-it-works -->
   135	## 3. HOW IT WORKS
   136	
   137	### Architecture: 3-Layer Integration
   138	
   139	```
   140	User invokes: /spec_kit:deep-research "topic"
   141	                    |
   142	                    v
   143	    ┌─────────────────────────────────┐
   144	    │  /spec_kit:deep-research command│  Layer 1: Command
   145	    │  (YAML workflow + loop config)    │  Manages loop lifecycle
   146	    └──────────────┬──────────────────┘
   147	                   |
   148	                   v
   149	    ┌─────────────────────────────────┐
   150	    │     YAML Loop Engine            │  Layer 2: Workflow
   151	    │  - Init (config, strategy)       │  Dispatch, evaluate, decide
   152	    │  - Loop (dispatch + converge)   │
   153	    │  - Synthesize (final output)     │
   154	    │  - Save (memory context)        │
   155	    └──────────────┬──────────────────┘
   156	                   |  dispatches per iteration
   157	                   v
   158	    ┌─────────────────────────────────┐
   159	    │    @deep-research (LEAF agent)  │  Layer 3: Agent
   160	    │  - Reads: state + strategy      │  Fresh context each time
   161	    │  - Executes ONE research cycle  │
   162	    │  - Writes: findings + state      │
   163	    │  - Tools: WebFetch, Grep, etc.  │
   164	    └──────────────┬──────────────────┘
   165	                   |
   166	                   v
   167	    ┌─────────────────────────────────┐
   168	    │        State Files (disk)       │  Externalized State
   169	    │  deep-research-config.json       │  Persists across iterations
   170	    │  deep-research-state.jsonl      │
   171	    │  deep-research-strategy.md      │
   172	    │  findings-registry.json          │
   173	    │  research/iterations/iteration-NNN.md │
   174	    │  research/research.md (workflow-owned │
   175	    │  progressive synthesis)         │
   176	    └─────────────────────────────────┘
   177	```
   178	
   179	### Core Innovation: Fresh Context Per Iteration
   180	
   181	Each agent dispatch gets a fresh context window. State continuity comes from files, not memory. This solves context degradation in long research sessions.
   182	
   183	Adapted from: karpathy/autoresearch (loop concept), AGR (fresh context "Ralph Loop"), pi-autoresearch (JSONL state), autoresearch-opencode (context injection).
   184	
   185	### Data Flow
   186	
   187	```
   188	Init --> Create config.json, strategy.md, state.jsonl
   189	  |
   190	Loop --> Read state --> Check convergence --> Dispatch @deep-research
   191	  |                                              |
   192	  |                                              v
   193	  |                                         Agent executes:
   194	  |                                         1. Read state files
   195	  |                                         2. Determine focus
   196	  |                                         3. Research (3-5 actions)
   197	  |                                         4. Write iteration-NNN.md
   198	  |                                         5. Update strategy.md
   199	  |                                         6. Append state.jsonl
   200	  |                                              |
   201	  +<--- Evaluate results <-----------------------+
   202	  |
   203	  +--- Continue? --> Yes: next iteration
   204	  |                  No: exit loop
   205	  v
   206	Synthesize --> Compile final research/research.md
   207	  |
   208	Save --> generate-context.js --> verify memory artifact
   209	```
   210	
   211	### Key Concepts
   212	
   213	| Concept | Description |
   214	|---------|-------------|
   215	| **Externalized state** | All research continuity via files, not agent memory |
   216	| **Fresh context** | Each iteration gets a clean agent with no prior context |
   217	| **Convergence** | Multi-signal detection: newInfoRatio, stuck count, questions answered |
   218	| **Strategy file** | Reducer-synchronized research steering with machine-owned sections |
   219	| **JSONL log** | Append-only structured log for lineage and iteration data |
   220	| **Findings registry** | Reducer-owned open/resolved questions, key findings, and ruled-out directions |

codex
I’ve loaded the two core skills and confirmed the prior packet guidance in memory. Next I’m pulling the Phase 1 spec docs and the targeted runtime files with line numbers, then I’ll map each of the 10 questions onto concrete evidence instead of relying on the packet’s proposed terminology.
exec
/bin/zsh -lc 'rg -n "stop|converg|resume|restart|fork|completed-continue|journal|dashboard|verification|ledger|reduce|JSONL|all_dimensions_clean|insufficient_evidence|error_budget" .opencode/skill/sk-deep-research .opencode/skill/sk-deep-review .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/agent/deep-research.md .opencode/agent/deep-review.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-review/SKILL.md:3:description: "Autonomous iterative code review and quality auditing loop with externalized state, convergence detection, severity-weighted findings (P0/P1/P2), and fresh context per iteration"
.opencode/skill/sk-deep-review/SKILL.md:7:argument-hint: "[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
.opencode/skill/sk-deep-review/SKILL.md:11:<!-- Keywords: deep-review, code-audit, iterative-review, review-loop, convergence-detection, externalized-state, fresh-context, review-agent, JSONL-state, severity-findings, P0-P1-P2, release-readiness, spec-alignment -->
.opencode/skill/sk-deep-review/SKILL.md:15:Iterative code review and quality auditing protocol with fresh context per iteration, externalized state, convergence detection, and severity-weighted findings (P0/P1/P2).
.opencode/skill/sk-deep-review/SKILL.md:52:- "quality audit" / "convergence detection"
.opencode/skill/sk-deep-review/SKILL.md:56:`deep review`, `code audit`, `iterative review`, `review loop`, `release readiness`, `spec folder review`, `convergence detection`, `quality audit`, `find misalignments`, `verify cross-references`, `pre-release review`, `audit spec folder`
.opencode/skill/sk-deep-review/SKILL.md:69:| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format, review contract |
.opencode/skill/sk-deep-review/SKILL.md:85:    "REVIEW_CONVERGENCE": {"weight": 3, "keywords": ["review convergence", "coverage gate", "verdict", "binary gate", "all dimensions"]},
.opencode/skill/sk-deep-review/SKILL.md:92:    "REVIEW_CONVERGENCE": {"all dimensions covered": 1.6, "coverage complete": 1.5, "stop review": 1.4},
.opencode/skill/sk-deep-review/SKILL.md:106:        "references/convergence.md",
.opencode/skill/sk-deep-review/SKILL.md:110:        "references/convergence.md",
.opencode/skill/sk-deep-review/SKILL.md:125:        "references/convergence.md",
.opencode/skill/sk-deep-review/SKILL.md:146:| Init | No JSONL exists in `review/` | Loop protocol, state format, review contract |
.opencode/skill/sk-deep-review/SKILL.md:147:| Iteration | Dispatch context includes dimension + iteration number | Loop protocol, convergence, review contract |
.opencode/skill/sk-deep-review/SKILL.md:172:    │  - Loop (dispatch + converge)   │
.opencode/skill/sk-deep-review/SKILL.md:193:    │  deep-review-dashboard.md       │
.opencode/skill/sk-deep-review/SKILL.md:209:  deep-review-dashboard.md           # Auto-generated review dashboard
.opencode/skill/sk-deep-review/SKILL.md:225:Loop --> Read state --> Check convergence --> Dispatch @deep-review
.opencode/skill/sk-deep-review/SKILL.md:264:- `deep-review-dashboard.md`
.opencode/skill/sk-deep-review/SKILL.md:269:- `resume`
.opencode/skill/sk-deep-review/SKILL.md:270:- `restart`
.opencode/skill/sk-deep-review/SKILL.md:271:- `fork`
.opencode/skill/sk-deep-review/SKILL.md:272:- `completed-continue`
.opencode/skill/sk-deep-review/SKILL.md:283:- Inputs: `latestJSONLDelta`, `newIterationFile`, `priorReducedState`
.opencode/skill/sk-deep-review/SKILL.md:284:- Outputs: `findingsRegistry`, `dashboardMetrics`, `strategyUpdates`
.opencode/skill/sk-deep-review/SKILL.md:285:- Metrics: `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore`
.opencode/skill/sk-deep-review/SKILL.md:311:1. **Read state first** — Agent must read JSONL and strategy.md before any review action.
.opencode/skill/sk-deep-review/SKILL.md:315:5. **Report newInfoRatio** — Every iteration JSONL record must include `newInfoRatio`.
.opencode/skill/sk-deep-review/SKILL.md:321:11. **Report severity counts in every JSONL record** — `findingsSummary` (cumulative) and `findingsNew` (this iteration) are required fields.
.opencode/skill/sk-deep-review/SKILL.md:322:12. **Quality guards must pass before convergence** — Evidence completeness, scope alignment, no inference-only findings, severity coverage, and cross-reference checks must all pass (see `references/convergence.md` Section 10.4) before STOP can trigger.
.opencode/skill/sk-deep-review/SKILL.md:330:5. **Skip convergence checks** — Every iteration must be evaluated against convergence criteria before the next dispatch.
.opencode/skill/sk-deep-review/SKILL.md:344:2. **State file corruption** — Cannot reconstruct iteration history from JSONL or iteration files.
.opencode/skill/sk-deep-review/SKILL.md:347:5. **All recovery tiers exhausted** — No automatic recovery path remaining in convergence protocol.
.opencode/skill/sk-deep-review/SKILL.md:362:| [state_format.md](references/state_format.md) | Review state schemas | JSONL + strategy + config |
.opencode/skill/sk-deep-review/SKILL.md:363:| [convergence.md](references/convergence.md) | Review convergence | `shouldContinue_review()`, quality guards |
.opencode/skill/sk-deep-review/SKILL.md:372:| [deep_review_dashboard.md](assets/deep_review_dashboard.md) | Dashboard template | Auto-generated each review iteration |
.opencode/skill/sk-deep-review/SKILL.md:398:- Review loop ran to convergence or max iterations
.opencode/skill/sk-deep-review/SKILL.md:409:| **Per-iteration** | `iteration-NNN.md` written, JSONL appended, strategy updated | Yes |
.opencode/skill/sk-deep-review/SKILL.md:427:Every completed loop produces a convergence report (embedded in `review-report.md` and JSONL):
.opencode/skill/sk-deep-review/SKILL.md:428:- Stop reason (`converged`, `max_iterations`, `all_dimensions_covered`, `stuck_unrecoverable`)
.opencode/skill/sk-deep-review/SKILL.md:431:- P0/P1/P2 finding counts at convergence
.opencode/skill/sk-deep-review/SKILL.md:432:- Release-readiness state (`in-progress`, `converged`, `release-blocking`)
.opencode/skill/sk-deep-review/SKILL.md:503:| Autonomous loop | karpathy/autoresearch | YAML-driven review loop with convergence |
.opencode/skill/sk-deep-review/SKILL.md:506:| JSONL state | pi-autoresearch | `deep-review-state.jsonl` (append-only audit log) |
.opencode/skill/sk-deep-research/assets/deep_research_strategy.md:20:- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, ruled-out directions, and Next Focus.
.opencode/skill/sk-deep-research/assets/deep_research_strategy.md:21:- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration.
.opencode/skill/sk-deep-research/assets/deep_research_strategy.md:22:- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.
.opencode/skill/sk-deep-research/assets/deep_research_strategy.md:50:<!-- ANCHOR:stop-conditions -->
.opencode/skill/sk-deep-research/assets/deep_research_strategy.md:52:[Explicit conditions beyond convergence that should end the session -- populated during initialization]
.opencode/skill/sk-deep-research/assets/deep_research_strategy.md:56:<!-- /ANCHOR:stop-conditions -->
.opencode/skill/sk-deep-research/assets/deep_research_strategy.md:127:- Lifecycle branches: `resume`, `restart`, `fork`, `completed-continue`
.opencode/skill/sk-deep-research/assets/deep_research_strategy.md:128:- Machine-owned sections: reducer controls Sections 7-11
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:52: * Parse JSONL content into an array of records, skipping malformed lines.
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:246:  const convergenceScore =
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:247:    latestIteration?.convergenceSignals?.compositeStop
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:271:      convergenceScore,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:389:    'description: Auto-generated reducer view over the research packet.',
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:394:    'Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.',
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:438:    '- Guard violations: none recorded by the reducer pass',
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:439:    `- convergenceScore: ${Number(registry.metrics.convergenceScore || 0).toFixed(2)}`,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:467: * Reduce JSONL state, iteration files, and strategy into synchronized registry,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:468: * strategy, and dashboard outputs. Idempotent: repeated calls produce identical results.
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:473: * @returns {Object} Paths and content for registry, strategy, and dashboard
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:475:function reduceResearchState(specFolder, options = {}) {
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:483:  const dashboardPath = path.join(researchDir, 'deep-research-dashboard.md');
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:499:  const dashboard = renderDashboard(config, registry, records, iterationFiles);
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:504:    writeUtf8(dashboardPath, dashboard);
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:512:    dashboardPath,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:515:    dashboard,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:526:    process.stderr.write('Usage: node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder>\n');
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:530:  const result = reduceResearchState(specFolder, { write: true });
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:535:        dashboardPath: result.dashboardPath,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:552:  reduceResearchState,
.opencode/skill/sk-deep-review/assets/deep_review_strategy.md:22:- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
.opencode/skill/sk-deep-review/assets/deep_review_strategy.md:54:<!-- ANCHOR:stop-conditions -->
.opencode/skill/sk-deep-review/assets/deep_review_strategy.md:56:[Explicit conditions beyond convergence that should end the session -- populated during initialization]
.opencode/skill/sk-deep-review/assets/deep_review_strategy.md:60:<!-- /ANCHOR:stop-conditions -->
.opencode/skill/sk-deep-review/assets/deep_review_strategy.md:185:- Release-readiness states: in-progress | converged | release-blocking
.opencode/agent/deep-research.md:53:1. READ STATE ──────> Read JSONL + strategy.md
.opencode/agent/deep-research.md:57:5. APPEND STATE ────> Add iteration record to JSONL
.opencode/agent/deep-research.md:58:6. REDUCER SYNC ────> Workflow refreshes strategy, registry, dashboard
.opencode/agent/deep-research.md:72:- Current iteration number (count JSONL iteration records + 1)
.opencode/agent/deep-research.md:76:- Lifecycle branch from `config.lineage.lineageMode` (`resume`, `restart`, `fork`, or `completed-continue`)
.opencode/agent/deep-research.md:119:**Source Diversity Rule** : Aim to cite **>=2 independent sources** per key finding. The orchestrator runs quality guards before accepting convergence that check source diversity, focus alignment, and single-weak-source answers. Findings backed by only one source are flagged.
.opencode/agent/deep-research.md:160:Do not treat `research/deep-research-strategy.md`, `research/findings-registry.json`, or `research/deep-research-dashboard.md` as your primary write targets. The workflow reducer owns those synchronized packet surfaces.
.opencode/agent/deep-research.md:164:2. Append the structured JSONL record
.opencode/agent/deep-research.md:165:3. Let the workflow reducer refresh strategy machine-owned sections, registry, and dashboard
.opencode/agent/deep-research.md:189:> **Note:** The orchestrator enriches each iteration record with lineage metadata, optional `segment` (default: 1), `convergenceSignals`, and reducer-driven registry/dashboard updates after the agent writes it.
.opencode/agent/deep-research.md:213:The orchestrator generates a research dashboard and findings registry after each iteration, summarizing progress, coverage, and convergence trends. The agent does not update those reducer-owned files directly. However, your iteration data (newInfoRatio, status, focus, ruledOut, focusTrack, toolsUsed, sourcesQueried) feeds directly into those synchronized outputs.
.opencode/agent/deep-research.md:278:If approaching 12 tool calls, stop research and proceed to writing findings.
.opencode/agent/deep-research.md:300:Count lines in JSONL where type === "iteration"
.opencode/agent/deep-research.md:307:- JSONL: Always APPEND (never overwrite). Use Write tool to append a single line.
.opencode/agent/deep-research.md:320:- Report newInfoRatio honestly in JSONL record
.opencode/agent/deep-research.md:321:- Record strategy recommendations in the iteration file so the reducer can sync them
.opencode/agent/deep-research.md:363:- workflow reducer refreshes research/deep-research-strategy.md, research/findings-registry.json, and research/deep-research-dashboard.md
.opencode/agent/deep-research.md:375:**NEVER claim completion without verifiable evidence.** Every output assertion must be backed by a file existence check, content verification, or tool call result.
.opencode/agent/deep-research.md:383:[x] State files read at start (JSONL + strategy.md)
.opencode/agent/deep-research.md:388:[x] Reducer-owned strategy/dashboard/registry will have enough data to sync
.opencode/agent/deep-research.md:405:| Skip reading state | Repeats prior work, ignores exhausted approaches | Always read JSONL + strategy first |
.opencode/agent/deep-research.md:407:| Inflate newInfoRatio | Delays convergence, wastes iterations | Calculate honestly from actual findings |
.opencode/agent/deep-research.md:440:If hook-injected context is present (from Claude Code SessionStart hook), use it directly. Do NOT redundantly call `memory_context` or `memory_match_triggers` for the same information. If hook context is NOT present, fall back to: `memory_context({ mode: "resume", profile: "resume" })` then `memory_match_triggers()`.
.opencode/agent/deep-research.md:456:│  +-- Report newInfoRatio for convergence detection                      │
.opencode/agent/deep-research.md:459:│  |-- 1. Read state (JSONL + strategy.md)                                │
.opencode/agent/deep-research.md:464:│  |-- 6. Append iteration record to JSONL                                │
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:3:description: Auto-generated review session overview, refreshed after each iteration from JSONL state and strategy.
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:8:Auto-generated from JSONL state log and strategy file. Regenerated after every iteration evaluation. Never manually edited.
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:17:2. **Recovery surface** — second recovery channel alongside JSONL after context compaction
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:18:3. **Resume decision** — in confirm mode, shown to user before resume/restart/fork choice
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:22:- **Location:** `{spec_folder}/review/deep-review-dashboard.md`
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:23:- **Generated by:** Orchestrator (step_generate_dashboard in YAML workflow)
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:38:- Release Readiness: [in-progress | converged | release-blocking]
.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md:67:| [per iteration from JSONL] |
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:7:purpose: Iterative deep research with convergence detection
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:15:  validation: convergence_detection
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:22:  approach: "Dispatch focused agent, evaluate convergence, repeat or stop"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:32:  convergence_threshold: "[CONVERGENCE_THRESHOLD] - Stop threshold. Default: 0.05."
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:58:    convergence: .opencode/skill/sk-deep-research/references/convergence.md
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:84:  dashboard: "{spec_folder}/research/deep-research-dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:106:          - required_values_present: [research_topic, spec_folder, max_iterations, convergence_threshold]
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:122:          - "{spec_folder}/research/dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:136:          resume: "Config, JSONL, and strategy all exist and agree on topic/spec folder"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:140:          - session_state: "fresh | resume | completed-session | invalid-state"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:141:        on_resume:
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:142:          log: "Auto-resume: state artifacts are complete and consistent. Continue same lineage."
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:144:        on_restart:
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:146:        on_fork:
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:147:          action: "Copy current packet as a fork baseline with explicit parent linkage"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:149:          log: "Prior session already completed. Snapshot synthesis and reopen via completed-continue."
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:163:          convergenceThreshold: "{convergence_threshold}"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:178:        action: "Initialize JSONL state log with config record"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:179:        content: '{"type":"config","topic":"{research_topic}","maxIterations":{max_iterations},"convergenceThreshold":{convergence_threshold},"createdAt":"{ISO_8601_NOW}","specFolder":"{spec_folder}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:191:          convergence_threshold: "{convergence_threshold}"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:195:        action: "Initialize reducer-owned findings registry"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:196:        content: '{"openQuestions":[],"resolvedQuestions":[],"keyFindings":[],"ruledOutDirections":[],"metrics":{"iterationsCompleted":0,"openQuestions":0,"resolvedQuestions":0,"keyFindings":0,"convergenceScore":0,"coverageBySources":{}}}'
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:213:    purpose: Dispatch agent iterations until convergence
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:219:        action: "Read current state from JSONL and strategy"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:245:          message: "Research paused. Delete research/.deep-research-pause to resume."
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250:      step_check_convergence:
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:251:        action: "Evaluate stop conditions"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:261:                  stop if avg < convergence_threshold
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:264:                  stop if latest ratio <= noiseFloor
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:267:                  stop if coverage >= 0.85
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:269:               if weighted_stop_score > 0.60: STOP (composite_converged)
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:276:          See convergence.md for full pseudocode and signal definitions.
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:277:          Segment-aware convergence is experimental/reference-only; live workflow uses the current session as a single segment.
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:280:          - reason: "Human-readable stop reason"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:282:      step_handle_convergence:
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:283:        action: "Act on convergence decision"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:284:        if_stop:
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:285:          log: "Loop stopping. Reason: {reason}"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:325:            CONSTRAINT: The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:328:      step_reduce_state:
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:329:        action: "Run the reducer to synchronize registry, dashboard, and strategy"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:330:        command: "node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs {spec_folder}"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:332:          latestJSONLDelta: "Latest JSONL records written since the previous iteration"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:337:          - "{spec_folder}/research/deep-research-dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:353:          - newInfoRatio: "From latest JSONL iteration record"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:354:          - findings_count: "From latest JSONL iteration record"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:355:          - status: "From latest JSONL iteration record"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:356:          - latest_focus: "From latest JSONL iteration record"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:361:      step_generate_dashboard:
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:362:        action: "Generate or refresh the human-readable dashboard"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:367:        template: .opencode/skill/sk-deep-research/assets/deep_research_dashboard.md
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:368:        output: "{spec_folder}/research/deep-research-dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:369:        note: "Auto-generated from JSONL + reducer registry + strategy. Never manually edited."
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:375:          stuck_count: "if status == 'thought': unchanged (skip). if status == 'insight': 0 (reset). if newInfoRatio < convergence_threshold: stuck_count + 1, else: 0"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:390:        action: "Hydrate summary metrics before synthesis, including completed-continue reopen paths"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:408:          - reason: "Use the latest synthesis/recovery stop reason if present, else 'completed-continue'"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:423:            5. Add convergence report as appendix
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:430:          Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:433:      step_convergence_report:
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:434:        action: "Generate and append convergence report"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:442:          - Convergence threshold: {convergence_threshold}
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:444:        append_to_jsonl: '{"type":"event","event":"synthesis_complete","totalIterations":{iteration_count},"answeredCount":{answered_count},"totalQuestions":{total_questions},"stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:484:        - State files: config.json, state.jsonl, strategy.md, findings-registry.json, dashboard.md
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:497:  agent_dispatch_timeout: "Retry once with reduced scope (fewer research actions). If second timeout, mark as 'timeout' and continue."
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:498:  state_file_missing: "If JSONL missing during loop, reconstruct from iteration files. If strategy missing, create minimal version."
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:509:    - check_convergence_before_each_iteration
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:514:    - skip_convergence_check
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:519:    - proceed_without_state_file_verification
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:3:# convergence settings, cross-reference protocols, downstream render targets,
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:97:  # Binary gates applied after convergence math votes STOP.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:120:  # Review-specific convergence settings calibrated from the v2 research.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:121:  convergence:
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:124:      convergenceThreshold: 0.10
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:150:    - id: resume
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:152:    - id: restart
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:154:    - id: fork
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:156:    - id: completed-continue
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:166:  reducer:
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:169:      - latestJSONLDelta
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:174:      - dashboardMetrics
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:185:    - id: converged
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:263:        - convergenceScore
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:292:    dashboard:
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:293:      pathPattern: "{spec_folder}/review/deep-review-dashboard.md"
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:337:          - convergenceSignals
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:349:          - stopReason
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:367:        - convergence
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:381:        - convergence
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:462:        - convergence
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:467:# Validator contract for CI, render verification, and drift detection.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:480:      description: Ensure JSONL iteration and synthesis-event fields match the outputs contract.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:482:      description: Ensure lifecycle mode docs and workflow branches agree on new, resume, restart, fork, and completed-continue semantics.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:483:    - id: reducer-contract
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:484:      description: Ensure reducer inputs, outputs, and findings-registry metrics are documented consistently across assets and runtime mirrors.
.opencode/skill/sk-deep-research/assets/deep_research_config.json:4:  "convergenceThreshold": 0.05,
.opencode/skill/sk-deep-research/assets/deep_research_config.json:20:      "resume",
.opencode/skill/sk-deep-research/assets/deep_research_config.json:21:      "restart",
.opencode/skill/sk-deep-research/assets/deep_research_config.json:22:      "fork",
.opencode/skill/sk-deep-research/assets/deep_research_config.json:23:      "completed-continue"
.opencode/skill/sk-deep-research/assets/deep_research_config.json:28:  "reducer": {
.opencode/skill/sk-deep-research/assets/deep_research_config.json:32:    "dashboardFile": "research/deep-research-dashboard.md",
.opencode/skill/sk-deep-research/assets/deep_research_config.json:44:  "reducerScriptPath": ".opencode/skill/sk-deep-research/scripts/reduce-state.cjs",
.opencode/skill/sk-deep-research/assets/deep_research_config.json:52:    "deep-research-dashboard.md": "auto-generated",
.opencode/skill/sk-deep-review/assets/deep_review_config.json:10:  "convergenceThreshold": 0.10,
.opencode/skill/sk-deep-review/assets/deep_review_config.json:49:    "deep-review-dashboard.md": "auto-generated",
.opencode/skill/sk-deep-review/assets/deep_review_config.json:55:  "reducer": {
.opencode/skill/sk-deep-review/assets/deep_review_config.json:58:      "latestJSONLDelta",
.opencode/skill/sk-deep-review/assets/deep_review_config.json:64:      "dashboardMetrics",
.opencode/skill/sk-deep-review/assets/deep_review_config.json:72:      "convergenceScore"
.opencode/agent/deep-review.md:3:description: "LEAF review agent for sk-deep-review. Performs single review iteration: reads state, reviews one dimension with P0/P1/P2 findings, updates strategy and JSONL."
.opencode/agent/deep-review.md:29:**IMPORTANT**: This agent is a hybrid of @review (quality rubric, severity classification, adversarial self-check) and the deep-review loop contract (state protocol, JSONL, lifecycle continuity). It reviews code but does NOT modify it.
.opencode/agent/deep-review.md:31:> **SPEC FOLDER PERMISSION:** @deep-review may write only `review/` artifacts inside the active spec folder (iteration artifacts, strategy, JSONL, dashboard, report). Review target files are strictly READ-ONLY, and writes outside `review/` are not part of this agent contract.
.opencode/agent/deep-review.md:50:1. READ STATE ──────> Read JSONL + strategy + config
.opencode/agent/deep-review.md:56:7. APPEND JSONL ────> Add ONE iteration record
.opencode/agent/deep-review.md:64:- `review/deep-review-findings-registry.json` -- Read reducer-owned active finding state (read-only for this agent)
.opencode/agent/deep-review.md:69:- Current iteration number (count JSONL iteration records + 1)
.opencode/agent/deep-review.md:140:- **P0 candidate** --> Run full Hunter/Skeptic/Referee in THIS iteration BEFORE writing to JSONL
.opencode/agent/deep-review.md:231:#### Step 7: Append JSONL
.opencode/agent/deep-review.md:253:> **Note:** The orchestrator enriches each iteration record with optional `segment` (default: 1) and `convergenceSignals` fields after the agent writes it. The agent does not write these fields.
.opencode/agent/deep-review.md:264:- **P0 override rule**: If ANY new P0 discovered, set `newFindingsRatio = max(calculated, 0.50)`. A single new P0 blocks convergence.
.opencode/agent/deep-review.md:275:| Write | Iteration file, JSONL append | 2-3 calls |
.opencode/agent/deep-review.md:335:- `resume`: Continue the active review session.
.opencode/agent/deep-review.md:336:- `restart`: Reset loop state and start a fresh generation for the same target.
.opencode/agent/deep-review.md:337:- `fork`: Start a child review session from an earlier lineage point.
.opencode/agent/deep-review.md:338:- `completed-continue`: Re-open a previously completed session for additional review coverage.
.opencode/agent/deep-review.md:349:- `review/deep-review-findings-registry.json` is the canonical reducer-owned finding registry.
.opencode/agent/deep-review.md:351:- The orchestrator/reducer refreshes the registry after each iteration; do not overwrite it from this agent.
.opencode/agent/deep-review.md:373:Count lines in JSONL where type === "iteration"
.opencode/agent/deep-review.md:380:- JSONL: Always APPEND (never overwrite). Use Write tool to append a single line.
.opencode/agent/deep-review.md:392:### P0 Candidate --> Full 3-Pass (in same iteration BEFORE writing to JSONL)
.opencode/agent/deep-review.md:447:5. Skip convergence evaluation data (newFindingsRatio, noveltyJustification)
.opencode/agent/deep-review.md:467:**NEVER claim completion without verifiable evidence.** Every output assertion must be backed by a file existence check, content verification, or tool call result.
.opencode/agent/deep-review.md:475:[x] State files read at start (JSONL + findings registry + strategy + config)
.opencode/agent/deep-review.md:485:[x] Findings registry treated as reducer-owned canonical state
.opencode/agent/deep-review.md:524:| Inflating findings | Phantom issues delay convergence, erode trust | Honest severity based on evidence |
.opencode/agent/deep-review.md:529:| Skip reading state | Repeats prior work, ignores exhausted approaches | Always read JSONL + strategy first |
.opencode/agent/deep-review.md:563:| `references/state_format.md` | JSONL and config schema |
.opencode/agent/deep-review.md:564:| `references/convergence.md` | Convergence algorithm details |
.opencode/agent/deep-review.md:570:If hook-injected context is present (from Claude Code SessionStart hook), use it directly. Do NOT redundantly call `memory_context` or `memory_match_triggers` for the same information. If hook context is NOT present, fall back to: `memory_context({ mode: "resume", profile: "resume" })` then `memory_match_triggers()`.
.opencode/agent/deep-review.md:586:│  └── Update strategy + JSONL             │
.opencode/agent/deep-review.md:592:│  Append JSONL                            │
.opencode/skill/sk-deep-research/SKILL.md:3:description: "Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection, and fresh context per iteration"
.opencode/skill/sk-deep-research/SKILL.md:6:argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
.opencode/skill/sk-deep-research/SKILL.md:10:<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, convergence-detection, externalized-state, fresh-context, research-agent, JSONL-state, strategy-file -->
.opencode/skill/sk-deep-research/SKILL.md:14:Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.
.opencode/skill/sk-deep-research/SKILL.md:50:- `resume` — continue the active lineage
.opencode/skill/sk-deep-research/SKILL.md:51:- `restart` — start a new generation with explicit parent linkage
.opencode/skill/sk-deep-research/SKILL.md:52:- `fork` — branch from the current packet state
.opencode/skill/sk-deep-research/SKILL.md:53:- `completed-continue` — reopen a completed lineage only after immutable synthesis snapshotting
.opencode/skill/sk-deep-research/SKILL.md:66:| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format |
.opencode/skill/sk-deep-research/SKILL.md:81:    "CONVERGENCE": {"weight": 3, "keywords": ["convergence", "stop condition", "diminishing returns", "stuck"]},
.opencode/skill/sk-deep-research/SKILL.md:82:    "STATE": {"weight": 3, "keywords": ["state file", "JSONL", "strategy", "resume", "auto-resume"]},
.opencode/skill/sk-deep-research/SKILL.md:88:    "CONVERGENCE": {"good enough": 1.4, "stop when": 1.5, "diminishing": 1.6},
.opencode/skill/sk-deep-research/SKILL.md:89:    "STATE": {"pick up where": 1.5, "continue from": 1.4, "resume": 1.8},
.opencode/skill/sk-deep-research/SKILL.md:94:    "ITERATION": ["references/loop_protocol.md", "references/convergence.md"],
.opencode/skill/sk-deep-research/SKILL.md:95:    "CONVERGENCE": ["references/convergence.md"],
.opencode/skill/sk-deep-research/SKILL.md:102:    "ON_DEMAND": ["references/loop_protocol.md", "references/state_format.md", "references/convergence.md"],
.opencode/skill/sk-deep-research/SKILL.md:126:| Init | No JSONL exists | Loop protocol, state format |
.opencode/skill/sk-deep-research/SKILL.md:127:| Iteration | Dispatch context includes iteration number | Loop protocol, convergence |
.opencode/skill/sk-deep-research/SKILL.md:152:    │  - Loop (dispatch + converge)   │
.opencode/skill/sk-deep-research/SKILL.md:183:Adapted from: karpathy/autoresearch (loop concept), AGR (fresh context "Ralph Loop"), pi-autoresearch (JSONL state), autoresearch-opencode (context injection).
.opencode/skill/sk-deep-research/SKILL.md:190:Loop --> Read state --> Check convergence --> Dispatch @deep-research
.opencode/skill/sk-deep-research/SKILL.md:219:| **JSONL log** | Append-only structured log for lineage and iteration data |
.opencode/skill/sk-deep-research/SKILL.md:231:1. **Read state first** -- Agent must read JSONL and strategy.md before any research action
.opencode/skill/sk-deep-research/SKILL.md:235:5. **Report newInfoRatio** -- Every iteration JSONL record must include newInfoRatio
.opencode/skill/sk-deep-research/SKILL.md:241:11. **Report newInfoRatio + 1-sentence novelty justification** -- Every JSONL iteration record must include both
.opencode/skill/sk-deep-research/SKILL.md:242:12. **Quality guards must pass before convergence** -- Source diversity, focus alignment, and no single-weak-source checks must pass before STOP can trigger
.opencode/skill/sk-deep-research/SKILL.md:243:13. **Respect reducer ownership** -- The workflow reducer, not the agent, is the source of truth for strategy machine-owned sections, dashboard metrics, and findings registry updates
.opencode/skill/sk-deep-research/SKILL.md:252:5. **Skip convergence checks** -- Every iteration must be evaluated
.opencode/skill/sk-deep-research/SKILL.md:274:2. **State file corruption unrecoverable** -- Cannot reconstruct from JSONL or iteration files
.opencode/skill/sk-deep-research/SKILL.md:290:| [state_format.md](references/state_format.md) | State file schemas | JSONL + strategy.md + config.json |
.opencode/skill/sk-deep-research/SKILL.md:291:| [convergence.md](references/convergence.md) | Stop condition algorithms | shouldContinue(), stuck recovery |
.opencode/skill/sk-deep-research/SKILL.md:300:| [deep_research_dashboard.md](assets/deep_research_dashboard.md) | Dashboard template | Auto-generated each iteration |
.opencode/skill/sk-deep-research/SKILL.md:309:- Research loop ran to convergence or max iterations
.opencode/skill/sk-deep-research/SKILL.md:310:- All state files present and consistent (config, JSONL, strategy)
.opencode/skill/sk-deep-research/SKILL.md:319:| **Per-iteration** | iteration-NNN.md written, JSONL appended, reducer refreshes strategy/dashboard/registry | Yes |
.opencode/skill/sk-deep-research/SKILL.md:320:| **Post-loop** | research/research.md exists with content, convergence report generated | Yes |
.opencode/skill/sk-deep-research/SKILL.md:326:Every completed loop produces a convergence report:
.opencode/skill/sk-deep-research/SKILL.md:327:- Stop reason (converged, max_iterations, all_questions_answered, stuck_unrecoverable)
.opencode/skill/sk-deep-research/SKILL.md:358:  Workflow reducer updates research/deep-research-strategy.md, research/findings-registry.json, and research/deep-research-dashboard.md
.opencode/skill/sk-deep-research/SKILL.md:396:5. Loop stops cleanly, research/research.md produced
.opencode/skill/sk-deep-research/SKILL.md:409:| Autonomous loop | karpathy/autoresearch | YAML-driven loop with convergence |
.opencode/skill/sk-deep-research/SKILL.md:412:| JSONL state | pi-autoresearch | deep-research-state.jsonl |
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:7:purpose: Iterative code/spec review with convergence detection across review dimensions
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:15:  validation: convergence_detection
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:22:  approach: "Dispatch focused review agent per dimension, evaluate convergence, repeat or stop"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:33:  lineage_mode: "[auto|resume|restart|fork|completed-continue] - Session lifecycle intent. Default: auto."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:35:  convergence_threshold: 0.10
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:61:    convergence: .opencode/skill/sk-deep-review/references/convergence.md
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:88:  dashboard: "{spec_folder}/review/deep-review-dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:107:          - required_values_present: [review_target, review_target_type, review_dimensions, spec_folder, max_iterations, convergence_threshold]
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:129:            - "{spec_folder}/scratch/deep-review-dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:141:          - "{spec_folder}/scratch/deep-review-dashboard.md -> {spec_folder}/review/deep-review-dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:147:        on_legacy_detected: "Move only the review-specific whitelist, append a migration event to the canonical JSONL, and leave unrelated scratch files untouched."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:149:        command: "mkdir -p {spec_folder}/review/iterations && if [ ! -e {spec_folder}/review/deep-review-config.json ] && [ ! -e {spec_folder}/review/deep-review-state.jsonl ] && [ ! -e {spec_folder}/review/deep-review-strategy.md ] && [ -e {spec_folder}/scratch/deep-review-strategy.md ] && ( [ -e {spec_folder}/scratch/deep-research-config.json ] || [ -e {spec_folder}/scratch/deep-research-state.jsonl ] ); then [ -e {spec_folder}/scratch/deep-research-config.json ] && mv {spec_folder}/scratch/deep-research-config.json {spec_folder}/review/deep-review-config.json; [ -e {spec_folder}/scratch/deep-research-state.jsonl ] && mv {spec_folder}/scratch/deep-research-state.jsonl {spec_folder}/review/deep-review-state.jsonl; [ -e {spec_folder}/scratch/deep-review-strategy.md ] && mv {spec_folder}/scratch/deep-review-strategy.md {spec_folder}/review/deep-review-strategy.md; [ -e {spec_folder}/scratch/deep-review-dashboard.md ] && mv {spec_folder}/scratch/deep-review-dashboard.md {spec_folder}/review/deep-review-dashboard.md; find {spec_folder}/scratch -maxdepth 1 -name 'iteration-*.md' -exec mv {} {spec_folder}/review/iterations/ \\; ; [ -e {spec_folder}/scratch/.deep-research-pause ] && mv {spec_folder}/scratch/.deep-research-pause {spec_folder}/review/.deep-review-pause; [ -e {spec_folder}/review-report.md ] && mv {spec_folder}/review-report.md {spec_folder}/review/review-report.md; if [ -e {spec_folder}/review/deep-review-state.jsonl ]; then printf '%s\n' '{\"type\":\"event\",\"event\":\"migration\",\"mode\":\"review\",\"legacyArtifacts\":[\"deep-research-config.json\",\"deep-research-state.jsonl\",\".deep-research-pause\"],\"canonicalArtifacts\":[\"deep-review-config.json\",\"deep-review-state.jsonl\",\".deep-review-pause\"],\"timestamp\":\"{ISO_8601_NOW}\"}' >> {spec_folder}/review/deep-review-state.jsonl; fi; fi; find {spec_folder}/review -maxdepth 1 -name 'iteration-*.md' -exec mv {} {spec_folder}/review/iterations/ \\; 2>/dev/null || true"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:160:          resume: "Config, JSONL, and strategy all exist and config.mode == 'review' and agree on target/spec folder"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:164:          - session_state: "fresh | resume | completed-session | invalid-state"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:165:        on_resume:
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:166:          log: "Auto-resume: state artifacts are complete and consistent. Continue same lineage."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:168:        on_restart:
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:170:        on_fork:
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:171:          action: "Copy current review packet as a fork baseline with explicit parent linkage"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:173:          log: "Prior session already completed. Snapshot review synthesis and reopen via completed-continue."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:248:          convergenceThreshold: "{convergence_threshold}"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:259:        action: "Initialize JSONL state log with config record including review fields and lineage metadata"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:260:        content: '{"type":"config","mode":"review","reviewTarget":"{review_target}","reviewTargetType":"{review_target_type}","reviewDimensions":"{review_dimensions}","sessionId":"{ISO_8601_NOW}","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":{max_iterations},"convergenceThreshold":{convergence_threshold},"createdAt":"{ISO_8601_NOW}","specFolder":"{spec_folder}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:264:        action: "Initialize reducer-owned review findings registry"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:265:        content: '{"sessionId":"{ISO_8601_NOW}","generation":1,"lineageMode":"new","openFindings":[],"resolvedFindings":[],"repeatedFindings":[],"dimensionCoverage":{"correctness":false,"security":false,"traceability":false,"maintainability":false},"findingsBySeverity":{"P0":0,"P1":0,"P2":0},"openFindingsCount":0,"resolvedFindingsCount":0,"convergenceScore":0.0}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:278:          convergence_threshold: "{convergence_threshold}"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:295:    purpose: Dispatch review agent iterations until convergence
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:301:        action: "Read current state from JSONL, strategy, and config"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:330:          message: "Review paused. Delete review/.deep-review-pause to resume."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:335:      step_check_convergence:
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:336:        action: "Evaluate review-specific stop conditions"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:340:             b) if all dimensions clean AND required traceability protocols are covered AND p0_count == 0 AND p1_count == 0 AND coverage_age >= 1 AND all quality gates pass (evidence: every P0/P1 has file:line; scope: all findings within target; coverage: all dimensions reviewed): STOP (all_dimensions_clean)
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:347:                  stop if avg <= 0.08
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:350:                  stop if latest ratio <= noiseFloor
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:353:                  stop if coverage >= 1.0 AND required traceability protocols are covered AND coverage_age >= 1
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:356:               if weighted_stop_score >= 0.60: check binary gates
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:368:          - reason: "Human-readable stop reason"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:370:      step_handle_convergence:
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:371:        action: "Act on convergence decision"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:372:        if_stop:
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:373:          log: "Loop stopping. Reason: {reason}"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:434:            CONSTRAINT: Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, and newFindingsRatio.
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:445:          - newFindingsRatio: "From latest JSONL iteration record"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:446:          - findings_count: "From latest JSONL iteration record"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:447:          - severity_counts: "From latest JSONL iteration record (P0, P1, P2)"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:448:          - dimensions: "From latest JSONL iteration record"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:449:          - files_reviewed: "From latest JSONL iteration record"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:450:          - status: "From latest JSONL iteration record"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:451:          - reviewed_artifacts: "From latest JSONL iteration record"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:452:          - traceability_checks: "From latest JSONL iteration record when present"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:463:          action: "Mark the iteration as invalid for convergence and require rewrite before STOP is permitted"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:466:          log: "Claim adjudication incomplete for new P0/P1 findings. Continue loop until packets are present. Set claim_adjudication_passed = false. This flag MUST be checked in convergence evaluation — STOP is blocked while claim_adjudication_passed == false."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:468:      step_reduce_review_state:
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:469:        action: "Run reducer to refresh the canonical findings registry before dashboard generation"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:475:        note: "Reducer outputs findingsRegistry, dashboardMetrics, and strategyUpdates. Re-running the same inputs must be idempotent."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:477:      step_generate_dashboard:
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:478:        action: "Generate or refresh the review dashboard"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:486:          Auto-generated from JSONL state log and strategy file. Regenerated after every iteration evaluation.
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:505:          | [per dimension from strategy + JSONL] |
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:515:          | [per iteration from JSONL] |
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:524:        output: "{spec_folder}/review/deep-review-dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:525:        note: "Auto-generated from JSONL + strategy. Never manually edited."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:553:        action: "Hydrate summary metrics before synthesis, including completed-continue reopen paths"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:567:          - reason: "Use the latest stop reason if present, else 'completed-continue'"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:643:          Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:646:      step_convergence_report:
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:647:        action: "Append convergence report to JSONL"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:648:        append_to_jsonl: '{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":{iteration_count},"activeP0":{active_p0},"activeP1":{active_p1},"activeP2":{active_p2},"dimensionCoverage":{dimension_coverage},"verdict":"{verdict}","releaseReadinessState":"{release_readiness_state}","stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:690:        - State files in review/: deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-strategy.md, deep-review-dashboard.md
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:704:  agent_dispatch_timeout: "Retry once with reduced scope (fewer files per iteration). If second timeout, mark as 'timeout' and continue."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:705:  state_file_missing: "If JSONL missing during loop, reconstruct from iteration files. If strategy missing, create minimal version."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:716:    - check_convergence_before_each_iteration
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:724:    - skip_convergence_check
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:729:    - proceed_without_state_file_verification
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:748:    p0_override: "If ANY new P0 discovered → newFindingsRatio = max(calculated, 0.50). A single new P0 blocks convergence."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:758:    note: "Cross-reference verification protocols split into core and overlay classes"
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:17:- `04--convergence-and-recovery/`
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:18:- `05--pause-resume-and-fault-tolerance/`
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:33:- [9. CONVERGENCE AND RECOVERY](#9--convergence-and-recovery)
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:34:- [10. PAUSE, RESUME, AND FAULT TOLERANCE](#10--pause-resume-and-fault-tolerance)
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:100:| 3 | DRV-003 | Parameterized invocation (max-iterations, convergence) | `01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:111:| 5 | DRV-005 | Resume classification from valid prior review state | `02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:124:| 9 | DRV-009 | Review iteration writes findings, JSONL, and strategy update | `03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:126:| 11 | DRV-011 | Cross-reference verification detects misalignment | `03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:128:| 13 | DRV-013 | Review dashboard generation after iteration | `03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:129:| 14 | DRV-014 | Severity classification in JSONL | `03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:135:### 04--convergence-and-recovery/ (6 scenarios)
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:139:| 15 | DRV-015 | Stop on max iterations | `04--convergence-and-recovery/015-stop-on-max-iterations.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:140:| 16 | DRV-016 | Composite review convergence stop behavior | `04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:141:| 17 | DRV-017 | P0 override blocks convergence | `04--convergence-and-recovery/017-p0-override-blocks-convergence.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:142:| 18 | DRV-018 | Review quality guards block premature stop | `04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:143:| 19 | DRV-019 | Stuck recovery widens dimension focus | `04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:144:| 20 | DRV-020 | Dimension coverage convergence signal | `04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:150:### 05--pause-resume-and-fault-tolerance/ (4 scenarios)
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:154:| 21 | DRV-021 | Pause sentinel halts between review iterations | `05--pause-resume-and-fault-tolerance/021-pause-sentinel-halts-between-review-iterations.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:155:| 22 | DRV-022 | Resume after pause sentinel removal | `05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:156:| 23 | DRV-023 | Malformed JSONL lines are skipped with defaults | `05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:157:| 24 | DRV-024 | JSONL reconstruction from review iteration files | `05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md` |
.opencode/skill/sk-deep-review/manual_testing_playbook/manual_testing_playbook.md:189:| Convergence | `.opencode/skill/sk-deep-review/references/convergence.md` |
.opencode/skill/sk-deep-research/README.md:3:description: Autonomous deep research loop with lineage-aware lifecycle branches, reducer-owned packet synchronization, and runtime parity guidance.
.opencode/skill/sk-deep-research/README.md:9:  - "reducer synchronized research packet"
.opencode/skill/sk-deep-research/README.md:39:The packet is now lineage-aware. Every run carries `sessionId`, `parentSessionId`, `lineageMode`, `generation`, and `continuedFromRun`, so the workflow can distinguish an active resume from a restart, a fork, or a completed lineage that is being reopened.
.opencode/skill/sk-deep-research/README.md:41:The packet is also reducer-synchronized. The agent writes the iteration file plus the JSONL record. The workflow reducer then updates the machine-owned packet surfaces so `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`, and synthesis metadata cannot drift apart.
.opencode/skill/sk-deep-research/README.md:54:/spec_kit:deep-research:auto "API backpressure patterns" --max-iterations 6 --convergence 0.03
.opencode/skill/sk-deep-research/README.md:63:- `deep-research-dashboard.md`
.opencode/skill/sk-deep-research/README.md:78:| Lineage-aware lifecycle | Supports `resume`, `restart`, `fork`, and `completed-continue`. |
.opencode/skill/sk-deep-research/README.md:79:| Reducer synchronization | Strategy, dashboard, registry, and synthesis metadata are updated from canonical iteration outputs. |
.opencode/skill/sk-deep-research/README.md:98:    convergence.md
.opencode/skill/sk-deep-research/README.md:104:    deep_research_dashboard.md
.opencode/skill/sk-deep-research/README.md:116:  deep-research-dashboard.md
.opencode/skill/sk-deep-research/README.md:128:- Agent-owned writes: `iteration-NNN.md`, JSONL iteration/event append, optional progressive synthesis content.
.opencode/skill/sk-deep-research/README.md:129:- Reducer-owned writes: `deep-research-strategy.md` machine-owned sections, `findings-registry.json`, `deep-research-dashboard.md`.
.opencode/skill/sk-deep-research/README.md:140:| `resume` | Continue the active lineage with the same `sessionId`. |
.opencode/skill/sk-deep-research/README.md:141:| `restart` | Start a new generation with explicit parent linkage and archive the prior packet state. |
.opencode/skill/sk-deep-research/README.md:142:| `fork` | Create a sibling lineage from the current packet state. |
.opencode/skill/sk-deep-research/README.md:143:| `completed-continue` | Reopen a completed lineage only after snapshotting the prior synthesis as immutable `synthesis-v{generation}.md`. |
.opencode/skill/sk-deep-research/README.md:172:| Packet resumes when you expected a new run | Inspect `config.lineage` and the latest lifecycle event in `deep-research-state.jsonl`. |
.opencode/skill/sk-deep-research/README.md:173:| Strategy/dashboard drift | Confirm the reducer ran and regenerated `findings-registry.json` and `deep-research-dashboard.md`. |
.opencode/skill/sk-deep-research/README.md:174:| JSONL parse failure | Run `cat research/deep-research-state.jsonl | jq .` and fall back to iteration-file reconstruction if needed. |
.opencode/skill/sk-deep-research/README.md:176:| Loop will not continue after pause | Remove `research/.deep-research-pause` and restart the command so the lifecycle check can emit `resumed`. |
.opencode/skill/sk-deep-research/README.md:185:A: Not as the source of truth. The reducer owns the machine-managed sections so packet state stays synchronized.
.opencode/skill/sk-deep-research/README.md:187:**Q: What is the difference between `restart` and `completed-continue`?**
.opencode/skill/sk-deep-research/README.md:188:A: `restart` begins a new generation from an active or inactive packet and archives prior state. `completed-continue` reopens a completed lineage after snapshotting the old synthesis boundary.
.opencode/skill/sk-deep-research/README.md:205:| `references/loop_protocol.md` | Detailed lifecycle and reducer sequencing |
.opencode/skill/sk-deep-research/README.md:206:| `references/state_format.md` | Canonical config, JSONL, registry, and dashboard schemas |
.opencode/skill/sk-deep-research/README.md:207:| `references/convergence.md` | Stop and recovery logic |
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:3:description: Template for the auto-generated dashboard file regenerated after every iteration from JSONL + strategy data. Provides human-readable session overview and recovery surface.
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:8:Auto-generated from JSONL state log and strategy file. Regenerated after every iteration evaluation. Never manually edited.
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:17:2. **Recovery surface** — second recovery channel alongside JSONL after context compaction
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:18:3. **Lifecycle decision** — in confirm mode, shown before `resume`, `restart`, `fork`, or `completed-continue`
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:22:- **Location:** `{spec_folder}/research/deep-research-dashboard.md`
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:23:- **Generated by:** Orchestrator (step_generate_dashboard in YAML workflow)
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:38:- Lifecycle Mode: [new | resume | restart | fork | completed-continue]
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:49:| [per iteration from JSONL] |
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:73:- convergenceScore: [from reducer metrics]
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:74:- coverageBySources: [from reducer metrics]
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:96:- [migration events, reducer warnings, lifecycle conflicts]
.opencode/skill/sk-deep-review/references/quick_reference.md:26:| `--convergence` | 0.10 | Base sensitivity for review convergence |
.opencode/skill/sk-deep-review/references/quick_reference.md:75:| State | `review/deep-review-state.jsonl` | JSONL | Iteration log (append-only) |
.opencode/skill/sk-deep-review/references/quick_reference.md:78:| Dashboard | `review/deep-review-dashboard.md` | Markdown | Auto-generated review dashboard |
.opencode/skill/sk-deep-review/references/quick_reference.md:87:| `resume` | Continue the current review lineage without resetting generation |
.opencode/skill/sk-deep-review/references/quick_reference.md:88:| `restart` | Archive current review state and start a new generation |
.opencode/skill/sk-deep-review/references/quick_reference.md:89:| `fork` | Start a sibling lineage branch with explicit parent linkage |
.opencode/skill/sk-deep-review/references/quick_reference.md:90:| `completed-continue` | Snapshot the completed review and reopen it for amendment-only review deltas |
.opencode/skill/sk-deep-review/references/quick_reference.md:124:| `converged` | All 4 dimensions covered and the stabilization pass found no new P0/P1 findings |
.opencode/skill/sk-deep-review/references/quick_reference.md:142:<!-- ANCHOR:convergence -->
.opencode/skill/sk-deep-review/references/quick_reference.md:151:**Key defaults:** `maxIterations=7`, `convergenceThreshold=0.10`, `rollingStopThreshold=0.08`, `noProgressThreshold=0.05`, `stuckThreshold=2`, `minStabilizationPasses=1`
.opencode/skill/sk-deep-review/references/quick_reference.md:153:**P0 override:** Any new P0 finding sets `newFindingsRatio >= 0.50`, blocking convergence.
.opencode/skill/sk-deep-review/references/quick_reference.md:157:<!-- /ANCHOR:convergence -->
.opencode/skill/sk-deep-review/references/quick_reference.md:186:| 9 | Audit Appendix | Coverage, replay validation, and convergence evidence |
.opencode/skill/sk-deep-review/references/quick_reference.md:196:| Deeper review | Lower convergence (0.05), raise max iterations (10) |
.opencode/skill/sk-deep-review/references/quick_reference.md:197:| Faster completion | Raise convergence (0.15), lower max iterations (5) |
.opencode/skill/sk-deep-review/references/quick_reference.md:209:| Stops too early | Lower `--convergence` from 0.10 to 0.05 |
.opencode/skill/sk-deep-review/references/quick_reference.md:211:| P0 findings blocking convergence | Expected behavior: P0 override prevents premature stop |
.opencode/skill/sk-deep-review/references/quick_reference.md:232:- `convergence.md` — Review convergence algorithms
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md:3:description: "Verify that resume detects existing review state and continues from the last completed iteration."
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md:14:This scenario validates resume classification from valid prior review state for `DRV-005`. The objective is to verify that the session classifier detects existing review state and continues from the last completed iteration.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md:18:Long review sessions may be interrupted by context limits, crashes, or user pauses. The resume path must reliably pick up where the last iteration left off without re-running completed dimensions.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md:26:- Objective: Verify that resume detects existing review state and continues from the last completed iteration.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md:28:- Orchestrator prompt: Validate the resume classification contract for sk-deep-review. Confirm that the step_classify_session logic detects existing config, JSONL, and strategy files in review/ and classifies the session as "resume", skipping to phase_loop, then return a concise user-facing pass/fail verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md:29:- Expected execution process: Inspect the YAML classify step first for the resume classification logic, then the quick reference for resume behavior documentation, then the SKILL.md for phase detection guidance.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md:30:- Desired user-facing outcome: The user is told that re-running the command on a spec folder with existing review state will resume from the last iteration without re-initializing.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md:31:- Expected signals: The classify step checks for config, JSONL, and strategy presence; classifies as "resume" when all three exist and are consistent; and skips to phase_loop.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md:32:- Pass/fail posture: PASS if the classify step reliably detects valid prior state and routes to phase_loop; FAIL if resume classification is missing or routes to re-initialization.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md:47:| DRV-005 | Resume classification from valid prior review state | Verify that resume detects existing review state and continues from the last completed iteration. | Validate the resume classification contract for sk-deep-review. Confirm that `step_classify_session` detects existing config, JSONL, and strategy in `review/` and classifies the session as "resume", skipping to `phase_loop`, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'step_classify_session|classify:|fresh|resume|invalid.state|completed.session' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 2. `bash: rg -n 'step_classify_session|resume|skip_to' .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'resume|prior state|existing state|pick up' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md` | The classify step checks for config, JSONL, and strategy presence; classifies as "resume" when all three exist and are consistent; and skips to phase_loop. | Capture the classify step logic, the resume skip_to target, and the user-facing resume documentation. | PASS if the classify step reliably detects valid prior state and routes to phase_loop; FAIL if resume classification is missing or routes to re-initialization. | Verify the classify step inspects all three state files (config, JSONL, strategy) and that the on_resume action points to phase_loop. |
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md:76:- Feature file path: `02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md`
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md:2:title: "DRV-018 -- Review quality guards block premature stop"
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md:6:# DRV-018 -- Review quality guards block premature stop
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md:14:This scenario validates review quality guards block premature stop for `DRV-018`. The objective is to verify that 3 binary gates (evidence, scope, coverage) must all pass before the review loop can transition to synthesis.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md:18:Quality guards are the review-specific safety net that prevents the loop from stopping when convergence signals look good but the review output is incomplete or unreliable. Unlike research mode, review mode enforces evidence completeness on every finding, scope containment against the declared review target, and coverage of all configured dimensions including traceability protocols.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md:27:- Real user request: Can the review stop even if some findings lack file evidence or a dimension was never examined?
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md:29:- Expected execution process: Inspect the convergence reference for quality guard definitions, then the review YAML workflow for gate enforcement, then the quick reference and SKILL.md for user-facing guard documentation.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md:30:- Desired user-facing outcome: The user is told that even if the convergence score reaches the threshold, the review will not stop until all three quality gates pass, and is given a plain explanation of each gate.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md:31:- Expected signals: Three named binary gates (evidence, scope, coverage), each must return true, enforcement happens after convergence check but before STOP transition, and gates are review-specific.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md:47:| DRV-018 | Review quality guards block premature stop | Verify 3 binary gates (evidence, scope, coverage) must all pass before STOP. | Validate the quality guard contract for sk-deep-review. Confirm that 3 binary gates are enforced before STOP: (1) Evidence gate -- every active finding has file:line evidence and is not inference-only, (2) Scope gate -- findings and reviewed files stay within declared review scope, (3) Coverage gate -- configured dimensions plus required traceability protocols are covered. Verify these gates are distinct from research mode guards, then return a concise operator-facing verdict. | 1. `bash: rg -n 'quality.guard|binary.gate|evidence.*gate|scope.*gate|coverage.*gate|QUALITY_GUARD|gate.*pass' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'quality_guard|binary_gate|evidence_gate|scope_gate|coverage_gate|guard.*check|gate.*pass' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'Quality Guard|Evidence|Scope|Coverage|binary gate|gate.*pass|inference.only' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md` | Three named binary gates (evidence, scope, coverage), each must return true, enforcement happens after convergence check but before STOP, and gates are review-specific. | Capture the gate definitions from convergence.md, the YAML enforcement path, and the user-facing documentation of each gate. | PASS if all three gates are enforced before STOP and documented as review-specific; FAIL if any gate can be bypassed or is missing from the enforcement path. | Privilege the convergence reference for gate definitions and the YAML workflow for enforcement ordering; use quick reference for user-facing confirmation. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md:64:| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical quality guard definitions; use Section 10.4 for review-specific gates |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md:65:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Workflow algorithm; inspect quality guard enforcement in convergence step |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md:66:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Workflow algorithm; inspect quality guard enforcement in convergence step |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md:78:- Feature file path: `04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md`
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:3:description: "Verify that a fresh review session creates the canonical config, JSONL, strategy, and iteration directory from the shipped assets."
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:26:- Objective: Verify that a fresh session creates the canonical config, JSONL, strategy, and iteration directory from the shipped assets.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:31:- Expected signals: The review/ directory is created, config comes from the shared deep-review config template, the findings registry is created from the reducer contract, strategy comes from the sk-deep-review strategy template, and the JSONL begins with a config record.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md:47:| DRV-004 | Fresh review initialization creates canonical state files | Verify that a fresh session creates the canonical config, JSONL, registry, strategy, and iteration directory from the shipped assets. | Validate the fresh-initialization contract for sk-deep-review. Confirm that initialization creates `review/deep-review-config.json`, `review/deep-review-state.jsonl`, `review/deep-review-findings-registry.json`, `review/deep-review-strategy.md`, and `review/iterations/` from the live templates, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'step_create_directories|step_create_config|step_create_state_log|step_create_findings_registry|step_create_strategy' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 2. `bash: sed -n '1,220p' .opencode/skill/sk-deep-review/assets/deep_review_config.json && sed -n '1,220p' .opencode/skill/sk-deep-review/assets/deep_review_strategy.md` -> 3. `bash: rg -n 'state_paths|config:|state_log:|findings_registry:|strategy:|iteration_pattern' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | The review/ directory is created, config comes from the shared config template, the findings registry comes from the reducer contract, strategy comes from the sk-deep-review strategy template, and the JSONL begins with a config record. | Capture the initialization step names, the live template files, and the state_paths contract in one evidence bundle. | PASS if protocol, YAML, and asset templates agree on the initial review artifacts and their roles; FAIL if the artifact list or template sources drift. | Check both YAML variants, verify the JSONL init step writes a config record, confirm the reducer registry is created, and confirm the assets live under `assets/`. |
.opencode/skill/sk-deep-review/README.md:3:description: Autonomous iterative code review and quality auditing loop with severity-weighted findings, dimension coverage, convergence detection, and release readiness verdicts.
.opencode/skill/sk-deep-review/README.md:8:> Automated iterative code review and quality auditing loop that runs multiple review cycles with fresh context per iteration, file-based state continuity, and severity-weighted convergence detection for release readiness verdicts.
.opencode/skill/sk-deep-review/README.md:30:`sk-deep-review` runs autonomous, multi-iteration code quality audits on targets that require more than a single review pass to assess thoroughly. Each iteration dispatches a fresh `@deep-review` agent with no prior context, using file-based state (JSONL log, strategy file, iteration notes) to carry findings forward without degrading the context window. When new findings drop below a configurable threshold across multiple consecutive iterations, a 3-signal composite convergence algorithm stops the loop and triggers final synthesis, producing a `{spec_folder}/review/review-report.md` with a binary release readiness verdict.
.opencode/skill/sk-deep-review/README.md:32:The agent reads code using Read and Grep only. It never modifies, creates, or deletes files inside the review target. All state lives in a dedicated `{spec_folder}/review/` packet. Findings are mapped to four review dimensions (Correctness, Security, Traceability, Maintainability), weighted by severity, and validated through three binary quality gates before convergence is allowed.
.opencode/skill/sk-deep-review/README.md:34:All continuity across iterations comes from disk, not agent memory. The orchestrating command reads JSONL state, checks convergence, and dispatches the next agent with the current strategy file as its only context. This approach eliminates context window exhaustion for long review sessions and makes state fully inspectable, resumable, and recoverable.
.opencode/skill/sk-deep-review/README.md:41:| Default convergence threshold | 0.10                                                                                      |
.opencode/skill/sk-deep-review/README.md:47:| State files                   | 7 primary (config, JSONL, findings registry, strategy, dashboard, pause sentinel, report) |
.opencode/skill/sk-deep-review/README.md:57:- A P0 finding must be confirmed or ruled out with adversarial verification
.opencode/skill/sk-deep-review/README.md:70:| One review cycle                        | Multiple iterations until convergence                |
.opencode/skill/sk-deep-review/README.md:72:| No convergence or coverage tracking     | 3-signal convergence with dimension coverage vote    |
.opencode/skill/sk-deep-review/README.md:106:Each iteration focuses on one or more of the four review dimensions (Correctness, Security, Traceability, Maintainability). The dimension coverage signal contributes 0.45 weight to the convergence vote. Convergence cannot fire until all required dimensions are covered and at least one stabilization pass confirms no new dimension findings.
.opencode/skill/sk-deep-review/README.md:110:New findings are not counted equally. A new P0 finding contributes weight 10.0 to the `newFindingsRatio`, P1 contributes 5.0, and P2 contributes 1.0. Refinements of existing findings (e.g., severity upgrades) contribute 0.5 times those weights. This prevents convergence on iterations that appear low-yield in count but are high-severity in impact.
.opencode/skill/sk-deep-review/README.md:114:Any new P0 finding sets `newFindingsRatio >= 0.50` regardless of other signals. This single-rule override ensures that even one new critical finding forces at least one more iteration. Convergence resumes only after a full stabilization pass confirms no further P0 activity.
.opencode/skill/sk-deep-review/README.md:118:Before a P0 finding is recorded to JSONL, the agent runs an internal adversarial self-check using three roles: Hunter (argues the finding is real), Skeptic (challenges the evidence and severity classification), and Referee (decides admission, rejection, or severity downgrade). Only findings that survive the Referee decision enter the active finding registry.
.opencode/skill/sk-deep-review/README.md:122:Three binary gates are evaluated after the convergence math votes STOP. All three must pass before the loop terminates:
.opencode/skill/sk-deep-review/README.md:134:Each `@deep-review` agent dispatch gets a clean context window. No compaction or memory degradation across iterations. Knowledge transfers through the strategy file and JSONL state on disk.
.opencode/skill/sk-deep-review/README.md:138:All review state persists in `{spec_folder}/review/`: an immutable config JSON, an append-only JSONL iteration log, a mutable strategy file, and write-once per-iteration markdown files. State is fully inspectable without running the loop.
.opencode/skill/sk-deep-review/README.md:142:Re-invoking on a spec folder that has existing review state triggers auto-resume from the last completed iteration. Prior iterations are not re-run. The loop continues from the current strategy and JSONL log.
.opencode/skill/sk-deep-review/README.md:148:| `resume`             | Continue the same review lineage and keep the current generation                                      |
.opencode/skill/sk-deep-review/README.md:149:| `restart`            | Archive the current review state and start a new generation linked by `parentSessionId`               |
.opencode/skill/sk-deep-review/README.md:150:| `fork`               | Create a new review branch with full ancestry preserved                                               |
.opencode/skill/sk-deep-review/README.md:151:| `completed-continue` | Snapshot `review-report-v{generation}.md`, reopen the packet, and continue with amendment-only deltas |
.opencode/skill/sk-deep-review/README.md:160:| `converged`        | All dimensions are covered and the latest stabilization pass produced no new P0/P1 findings |
.opencode/skill/sk-deep-review/README.md:178:│   ├── deep_review_dashboard.md
.opencode/skill/sk-deep-review/README.md:184:    ├── 04--convergence-and-recovery/
.opencode/skill/sk-deep-review/README.md:185:    ├── 05--pause-resume-and-fault-tolerance/
.opencode/skill/sk-deep-review/README.md:199:├── deep-review-dashboard.md        # Auto-generated after each iteration
.opencode/skill/sk-deep-review/README.md:200:├── .deep-review-pause              # Pause sentinel: create to halt, delete to resume
.opencode/skill/sk-deep-review/README.md:202:├── review-report-v{generation}.md  # Immutable snapshot when completed-continue reopens a finished review
.opencode/skill/sk-deep-review/README.md:225:| `--convergence`    | 0.10          | Stop when severity-weighted newFindingsRatio falls below this value for required consecutive iterations |
.opencode/skill/sk-deep-review/README.md:254:| Deeper audit            | Lower `--convergence` to 0.05, raise `--max-iterations` to 10        |
.opencode/skill/sk-deep-review/README.md:255:| Faster gate check       | Raise `--convergence` to 0.15, lower `--max-iterations` to 4         |
.opencode/skill/sk-deep-review/README.md:261:Create a file at `{spec_folder}/review/.deep-review-pause` during a running review loop to halt between iterations. Delete the file to resume. Auto-resume detects existing JSONL state on re-invocation and continues from the last completed iteration without re-running prior work.
.opencode/skill/sk-deep-review/README.md:296:- Each iteration focuses on one dimension, updating strategy and JSONL state on completion
.opencode/skill/sk-deep-review/README.md:297:- User reviews dashboard before approving synthesis step
.opencode/skill/sk-deep-review/README.md:322:| P0 findings blocking convergence               | Real P0 findings that survive adversarial check, or misclassified P1s elevated to P0 | Read the adversarial self-check output in the relevant `iteration-NNN.md`. If the finding was misclassified, manually downgrade severity in the JSONL entry and re-run convergence evaluation. |
.opencode/skill/sk-deep-review/README.md:323:| `review-report.md` missing sections            | Synthesis step interrupted before all 9 sections were written                        | Re-run synthesis step manually. The JSONL state is intact; synthesis reads from it without re-running iterations.                                                                              |
.opencode/skill/sk-deep-review/README.md:324:| Loop runs to max iterations without converging | Convergence threshold too low, or target has genuine structural issues               | Raise `--convergence` to 0.15 and re-run with auto-resume. If findings keep appearing, the target likely needs remediation before review can converge.                                         |
.opencode/skill/sk-deep-review/README.md:326:| Review finds no issues on known-bad code       | Scope too narrow or files not discovered                                             | Confirm scope includes all relevant files. Check dimension coverage in `{spec_folder}/review/deep-review-dashboard.md`.                                                                        |
.opencode/skill/sk-deep-review/README.md:327:| Verdict appears wrong                          | P0 finding severity misclassified or active-findings count incorrect                 | Confirm adversarial self-check ran on the P0 finding in the relevant iteration file. Check JSONL synthesis event `activeP0` field for accuracy.                                                |
.opencode/skill/sk-deep-review/README.md:334:A: `sk-code-review` is a single-pass review. `sk-deep-review` is iterative: it runs multiple review cycles until convergence, tracks dimension coverage, runs adversarial self-checks on P0 findings, and produces a structured `review-report.md` with a three-way verdict. Use `sk-code-review` for quick feedback; use `sk-deep-review` for release gates.
.opencode/skill/sk-deep-review/README.md:340:A: Any new P0 finding within an iteration sets `newFindingsRatio >= 0.50` regardless of other signals. This forces at least one more iteration. The override cannot be suppressed — it is a hard convergence guard.
.opencode/skill/sk-deep-review/README.md:343:A: No. The `@deep-review` agent is strictly read-only with respect to the review target. It writes only to the dedicated `{spec_folder}/review/` packet: strategy, JSONL state, dashboard, iteration files, and the final report.
.opencode/skill/sk-deep-review/README.md:354:**Q: How do I extend the review after convergence?**
.opencode/skill/sk-deep-review/README.md:355:A: Raise `--max-iterations` above the number of completed iterations and re-invoke. Auto-resume detects existing JSONL state and continues without repeating prior iterations.
.opencode/skill/sk-deep-review/README.md:366:| State format    | `.opencode/skill/sk-deep-review/references/state_format.md`    | Config, JSONL, reducer registry, strategy, dashboard, and report schemas |
.opencode/skill/sk-deep-review/README.md:367:| Convergence     | `.opencode/skill/sk-deep-review/references/convergence.md`     | Stop algorithms, stuck recovery, signal math                             |
.opencode/skill/sk-deep-review/README.md:397:| `sk-deep-research` | Shares loop architecture, state format, and convergence algorithm. Use for investigation, not code audit. |
.opencode/skill/sk-deep-review/README.md:415:| Lifecycle modes   | `resume`, `restart`, `fork`, `completed-continue`                                                                                    |
.opencode/skill/sk-deep-review/README.md:416:| Release readiness | `in-progress`, `converged`, `release-blocking`                                                                                       |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/010-strategy-next-focus-and-dimension-rotation.md:18:If the loop manager does not rotate dimensions, the review gets stuck on a single dimension while others remain uncovered. Dimension coverage is a weighted convergence signal (0.45), so failure to rotate blocks convergence and wastes iterations.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/010-strategy-next-focus-and-dimension-rotation.md:29:- Expected execution process: Inspect the YAML read-state step for dimension extraction, then the dispatch step for next_dimension injection, then the strategy template for the "Next Focus" section, then the convergence docs for dimension coverage requirements.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/010-strategy-next-focus-and-dimension-rotation.md:31:- Expected signals: The read-state step extracts the next uncovered dimension; the dispatch step injects it as the focus; the strategy template has a "Next Focus" section; the convergence docs require all dimensions to be covered.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/010-strategy-next-focus-and-dimension-rotation.md:47:| DRV-010 | Strategy next focus and dimension rotation | Verify that the strategy rotates through dimensions and respects exhausted approaches. | Validate the dimension rotation contract for sk-deep-review. Confirm that the loop manager rotates through dimensions based on the strategy "Next Focus" and that exhausted dimensions are skipped, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'next_dimension|next_focus|dimensions_covered|dimension_queue|Next Focus' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 2. `bash: rg -n 'Next Focus|dimension.*rotation|dimension.*coverage|exhausted' .opencode/skill/sk-deep-review/assets/deep_review_strategy.md` -> 3. `bash: rg -n 'Dimension Coverage|dimensions.*covered|minStabilization' .opencode/skill/sk-deep-review/references/quick_reference.md` | The read-state step extracts the next uncovered dimension; the dispatch step injects it as the focus; the strategy template has a "Next Focus" section; convergence requires all dimensions covered. | Capture the next_dimension extraction logic, the dispatch focus injection, and the convergence dimension coverage signal. | PASS if dimension rotation is explicit in the loop and the strategy tracks coverage; FAIL if the next dimension is not derived from state or if exhausted dimensions are re-checked unnecessarily. | Check the strategy template for explicit dimension tracking sections and verify the convergence algorithm includes dimension coverage as a weighted signal. |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/010-strategy-next-focus-and-dimension-rotation.md:66:| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Convergence signals; use `ANCHOR:convergence` and `ANCHOR:review-dimensions` |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/010-strategy-next-focus-and-dimension-rotation.md:67:| `.opencode/skill/sk-deep-research/references/convergence.md` | Shared convergence algorithm; inspect dimension coverage signal |
.opencode/skill/sk-deep-research/references/quick_reference.md:30:| `--convergence` | 0.05 | Stop when avg newInfoRatio below this |
.opencode/skill/sk-deep-research/references/quick_reference.md:45:| Exhaustive critical research | `/spec_kit:deep-research --max-iterations 15 --convergence 0.02` |
.opencode/skill/sk-deep-research/references/quick_reference.md:76:| State | `research/deep-research-state.jsonl` | JSONL | Iteration log (append-only) |
.opencode/skill/sk-deep-research/references/quick_reference.md:79:| Dashboard | `research/deep-research-dashboard.md` | Markdown | Reducer-owned lifecycle and convergence summary |
.opencode/skill/sk-deep-research/references/quick_reference.md:83:> **Live lifecycle branches:** `resume`, `restart`, `fork`, `completed-continue`. `progressiveSynthesis` defaults to `true`, so `research/research.md` is updated during the loop and finalized at synthesis.
.opencode/skill/sk-deep-research/references/quick_reference.md:107:<!-- ANCHOR:convergence-decision-tree -->
.opencode/skill/sk-deep-research/references/quick_reference.md:122:Composite convergence (3-signal weighted > 0.60)?
.opencode/skill/sk-deep-research/references/quick_reference.md:123:  Yes --> STOP (converged)
.opencode/skill/sk-deep-research/references/quick_reference.md:132:<!-- /ANCHOR:convergence-decision-tree -->
.opencode/skill/sk-deep-research/references/quick_reference.md:138:2. Determine focus from reducer-owned strategy "Next Focus"
.opencode/skill/sk-deep-research/references/quick_reference.md:142:6. Let the workflow reducer update `deep-research-strategy.md`, `findings-registry.json`, and `deep-research-dashboard.md`
.opencode/skill/sk-deep-research/references/quick_reference.md:153:| Deeper research | Lower convergence (0.02), raise max iterations (15) |
.opencode/skill/sk-deep-research/references/quick_reference.md:154:| Faster completion | Raise convergence (0.10), lower max iterations (5) |
.opencode/skill/sk-deep-research/references/quick_reference.md:166:| Stops too early | Lower `--convergence` from 0.05 to 0.02 |
.opencode/skill/sk-deep-research/references/quick_reference.md:169:| State file corrupt | Validate JSONL: `cat research/deep-research-state.jsonl \| jq .` |
.opencode/skill/sk-deep-research/references/quick_reference.md:170:| Loop runs too long | Set lower `--max-iterations` or higher `--convergence` |
.opencode/skill/sk-deep-research/references/quick_reference.md:178:After each iteration, the orchestrator can display a text-based convergence summary:
.opencode/skill/sk-deep-research/references/quick_reference.md:205:- In the convergence report (synthesis phase)
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/025-review-report-synthesis-has-all-9-sections.md:28:- Orchestrator prompt: Validate the review report synthesis contract for sk-deep-review. Confirm that `review/review-report.md` contains all 9 sections: (1) Executive Summary with verdict and severity counts, (2) Planning Trigger with routing rationale, (3) Active Finding Registry with deduped findings, (4) Remediation Workstreams with grouped action lanes, (5) Spec Seed with minimal spec delta, (6) Plan Seed with action-ready starter, (7) Traceability Status with protocol coverage, (8) Deferred Items with P2 advisories, (9) Audit Appendix with convergence evidence, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/025-review-report-synthesis-has-all-9-sections.md:31:- Expected signals: All 9 section headers present, Executive Summary contains verdict and P0/P1/P2 counts, Active Finding Registry has deduplicated findings with evidence, and Audit Appendix includes convergence data.
.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/025-review-report-synthesis-has-all-9-sections.md:47:| DRV-025 | Review report synthesis has all 9 sections | Verify review-report.md contains all 9 required sections. | Validate the review report synthesis contract for sk-deep-review. Confirm that `review/review-report.md` contains all 9 sections: (1) Executive Summary, (2) Planning Trigger, (3) Active Finding Registry, (4) Remediation Workstreams, (5) Spec Seed, (6) Plan Seed, (7) Traceability Status, (8) Deferred Items, (9) Audit Appendix, then return a concise operator-facing verdict. | 1. `bash: rg -n 'Executive Summary|Planning Trigger|Active Finding Registry|Remediation Workstreams|Spec Seed|Plan Seed|Traceability Status|Deferred Items|Audit Appendix|review-report' .opencode/skill/sk-deep-review/references/quick_reference.md` -> 2. `bash: rg -n 'review-report|synthesis|9.*section|Executive Summary|Planning Trigger|Active Finding|Remediation|Spec Seed|Plan Seed|Traceability|Deferred|Audit Appendix' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'review-report|synthesis|9.*section|report.*section|Executive Summary|verdict|hasAdvisories' .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md .opencode/command/spec_kit/deep-review.md` | All 9 section headers present, Executive Summary contains verdict and P0/P1/P2 counts, Active Finding Registry has deduplicated findings, Audit Appendix includes convergence data. | Capture the 9-section table from quick reference, the YAML synthesis step, and the report structure documentation from SKILL.md. | PASS if all 9 sections are documented and enforced by the synthesis step; FAIL if any section is missing from the template or synthesis contract. | Privilege the quick reference section table as the canonical list and verify the YAML synthesis step produces all 9 sections. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:2:title: "DRV-017 -- P0 override blocks convergence"
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:3:description: "Verify that a new P0 finding sets newFindingsRatio >= 0.50, blocking convergence regardless of other signals."
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:6:# DRV-017 -- P0 override blocks convergence
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:14:This scenario validates P0 override blocks convergence for `DRV-017`. The objective is to verify that any new P0 finding sets `newFindingsRatio >= 0.50`, which is high enough to block the composite convergence score from reaching the 0.60 stop threshold.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:18:P0 findings represent correctness failures, security vulnerabilities, or spec contradictions that must never be papered over by a premature convergence decision. This override is review-specific behavior not present in research mode, reflecting the higher consequences of shipping code with critical defects.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:26:- Objective: Verify new P0 finding sets newFindingsRatio >= 0.50, blocking convergence.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:27:- Real user request: If the review finds a critical bug late in the loop, will it still stop early and miss it?
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:28:- Orchestrator prompt: Validate the P0 override contract for sk-deep-review. Confirm that any new P0 finding forces `newFindingsRatio >= 0.50`, that this value is high enough to prevent the composite stop score from reaching the 0.60 threshold, and that this behavior is documented as review-specific, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:29:- Expected execution process: Inspect the convergence reference for the P0 override rule, then the review YAML algorithm for enforcement, then the quick reference and SKILL.md for user-facing documentation of the override.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:30:- Desired user-facing outcome: The user is told that a critical finding will always force the review to continue for at least one more iteration, preventing premature stop.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:31:- Expected signals: P0 finding sets `newFindingsRatio >= 0.50`, this blocks the rolling average signal from contributing to convergence, the composite score cannot reach 0.60, and review continues.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:32:- Pass/fail posture: PASS if the P0 override is enforced and documented as blocking convergence; FAIL if convergence can trigger despite an active new P0 finding.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:47:| DRV-017 | P0 override blocks convergence | Verify new P0 finding sets newFindingsRatio >= 0.50, blocking convergence. | Validate the P0 override contract for sk-deep-review. Confirm that any new P0 finding forces `newFindingsRatio >= 0.50`, that this value is high enough to prevent the composite stop score from reaching the 0.60 threshold, and that this behavior is documented as review-specific, then return a concise operator-facing verdict. | 1. `bash: rg -n 'P0.*override|P0.*block|P0.*convergence|newFindingsRatio.*0\.50|severity.*override|P0.*ratio' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'P0|severity_override|newFindingsRatio|p0_override|p0_block' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'P0 override|P0.*block.*convergence|newFindingsRatio.*0\.50|severity.*override' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md` | P0 finding sets `newFindingsRatio >= 0.50`, this blocks the rolling average signal, the composite score cannot reach 0.60, and the review continues. | Capture the P0 override rule from convergence.md, the YAML enforcement, and user-facing documentation of the override behavior. | PASS if the P0 override is enforced and documented as blocking convergence; FAIL if convergence can trigger despite an active new P0 finding. | Privilege the convergence reference for the exact P0 override rule and verify it is mirrored in both YAML workflows and user-facing docs. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:64:| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical convergence math; P0 override rule in severity-weighted section |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:65:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Workflow algorithm; inspect P0 override in `step_check_convergence` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:66:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Workflow algorithm; inspect P0 override in `step_check_convergence` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:67:| `.opencode/skill/sk-deep-review/references/quick_reference.md` | P0 override note; use `ANCHOR:convergence` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md:78:- Feature file path: `04--convergence-and-recovery/017-p0-override-blocks-convergence.md`
.opencode/skill/sk-deep-review/references/convergence.md:15:Convergence detection determines when the autonomous review loop should stop iterating. After every iteration the orchestrator evaluates three possible outcomes:
.opencode/skill/sk-deep-review/references/convergence.md:23:Convergence is checked **after** each iteration completes and **before** the next iteration is dispatched. The check consumes the full JSONL state history and the current dimension coverage snapshot.
.opencode/skill/sk-deep-review/references/convergence.md:25:Release-readiness states are derived alongside convergence:
.opencode/skill/sk-deep-review/references/convergence.md:27:- `converged` once coverage and stabilization pass without new P0/P1 findings
.opencode/skill/sk-deep-review/references/convergence.md:35:| `convergenceThreshold` | 0.10 | General convergence sensitivity |
.opencode/skill/sk-deep-review/references/convergence.md:40:| `compositeStopScore` | 0.60 | Weighted stop-score needed before guard evaluation |
.opencode/skill/sk-deep-review/references/convergence.md:49:4. **Composite convergence** -- 3-signal weighted vote with threshold 0.60.
.opencode/skill/sk-deep-review/references/convergence.md:56:<!-- ANCHOR:hard-stops -->
.opencode/skill/sk-deep-review/references/convergence.md:59:Hard stops are evaluated first and override all other signals.
.opencode/skill/sk-deep-review/references/convergence.md:68:The loop stops unconditionally. Synthesis runs with whatever findings exist.
.opencode/skill/sk-deep-review/references/convergence.md:76:      return { action: "STOP", reason: "all_dimensions_clean" }
.opencode/skill/sk-deep-review/references/convergence.md:83:<!-- /ANCHOR:hard-stops -->
.opencode/skill/sk-deep-review/references/convergence.md:108:When `stuckCount >= stuckThreshold`, the orchestrator invokes the recovery protocol (Section 8) before deciding whether to continue or stop.
.opencode/skill/sk-deep-review/references/convergence.md:113:<!-- ANCHOR:composite-convergence -->
.opencode/skill/sk-deep-review/references/convergence.md:116:Three independent signals each cast a stop/continue vote. Stop when the weighted stop-score meets or exceeds the consensus threshold.
.opencode/skill/sk-deep-review/references/convergence.md:163:stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
.opencode/skill/sk-deep-review/references/convergence.md:164:if stopScore >= 0.60:   // proceed to quality gate evaluation
.opencode/skill/sk-deep-review/references/convergence.md:173:| 1 | Coverage only (weight 1.0) | Very unlikely to stop (needs full coverage + stabilization) |
.opencode/skill/sk-deep-review/references/convergence.md:179:<!-- /ANCHOR:composite-convergence -->
.opencode/skill/sk-deep-review/references/convergence.md:220:A new critical finding always signals significant remaining work. The 0.50 floor prevents premature convergence when critical issues are still being discovered.
.opencode/skill/sk-deep-review/references/convergence.md:228:Three binary gates must ALL pass before a STOP decision is finalized. If any gate fails, the STOP is overridden to CONTINUE and violations are logged to JSONL.
.opencode/skill/sk-deep-review/references/convergence.md:264:When composite convergence returns STOP, invoke `checkReviewQualityGates()`. If it returns `passed: false`, override the action to CONTINUE and log each violation as a `guard_violation` event in JSONL. The orchestrator targets the violated areas in the next iteration.
.opencode/skill/sk-deep-review/references/convergence.md:272:The provisional verdict is determined from active findings at the time the loop stops. It appears in both the convergence report and the final `review-report.md`.
.opencode/skill/sk-deep-review/references/convergence.md:355:### JSONL Record
.opencode/skill/sk-deep-review/references/convergence.md:364:<!-- ANCHOR:convergence-report -->
.opencode/skill/sk-deep-review/references/convergence.md:367:When the loop stops, the orchestrator generates a convergence report embedded in `review-report.md` and appended to the JSONL state file.
.opencode/skill/sk-deep-review/references/convergence.md:374:Stop reason: [composite_converged | max_iterations | all_dimensions_clean | stuck_unrecoverable]
.opencode/skill/sk-deep-review/references/convergence.md:379:Active findings at convergence:
.opencode/skill/sk-deep-review/references/convergence.md:404:### JSONL Synthesis Event
.opencode/skill/sk-deep-review/references/convergence.md:410:  "stopReason": "composite_converged",
.opencode/skill/sk-deep-review/references/convergence.md:422:    { "name": "rollingAvg", "value": 0.04, "stop": true, "weight": 0.30 },
.opencode/skill/sk-deep-review/references/convergence.md:423:    { "name": "madScore", "value": 0.06, "stop": true, "weight": 0.25 },
.opencode/skill/sk-deep-review/references/convergence.md:424:    { "name": "dimensionCoverage", "value": 1.0, "stop": true, "weight": 0.45 }
.opencode/skill/sk-deep-review/references/convergence.md:433:<!-- /ANCHOR:convergence-report -->
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/029-insight-status-prevents-false-stuck.md:18:Without insight-status protection, a eureka moment that reshapes the research direction but yields little raw data would be misclassified as stuck, potentially triggering premature recovery or convergence exit.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/029-insight-status-prevents-false-stuck.md:28:- Orchestrator prompt: Validate the insight-status contract for sk-deep-research. Confirm that state_format.md defines "insight" as a valid iteration status, that convergence.md documents how stuckCount is computed, and that insight iterations are excluded from stuck counting, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/029-insight-status-prevents-false-stuck.md:29:- Expected execution process: Inspect the state format reference for the insight status definition, then the convergence reference for stuckCount computation rules, then the SKILL.md for the iteration status summary.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/029-insight-status-prevents-false-stuck.md:32:- Pass/fail posture: PASS if state_format.md defines "insight" status as preventing stuck counting AND convergence.md confirms stuckCount excludes insight iterations; FAIL if insight iterations are counted toward stuck or the documentation is contradictory.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/029-insight-status-prevents-false-stuck.md:47:| DR-029 | Insight status prevents false stuck detection | Verify that an iteration with status insight does not increment stuck count despite low newInfoRatio. | Validate the insight-status contract for sk-deep-research. Confirm that state_format.md defines "insight" as a valid iteration status, that convergence.md documents how stuckCount is computed, and that insight iterations are excluded from stuck counting, then return a concise operator-facing verdict. | 1. `bash: rg -n 'insight' .opencode/skill/sk-deep-research/references/state_format.md` -> 2. `bash: rg -n 'stuckCount\|stuck_count\|insight' .opencode/skill/sk-deep-research/references/convergence.md` -> 3. `bash: rg -n 'insight\|thought\|stuck' .opencode/skill/sk-deep-research/SKILL.md` -> 4. `bash: rg -n 'stuck_count.*insight\|insight.*stuck' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Iteration with status="insight" and low newInfoRatio, stuck_count NOT incremented. | Capture the state_format.md insight status definition, the convergence.md stuckCount computation rule, and the SKILL.md iteration status summary showing insight as a recognized status. | PASS if state_format.md defines "insight" status as preventing stuck counting AND convergence.md confirms stuckCount excludes insight iterations; FAIL if insight iterations are counted toward stuck or the documentation is contradictory. | Privilege state_format.md for the status taxonomy and convergence.md for the stuckCount algorithm; use SKILL.md only as secondary confirmation. |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/029-insight-status-prevents-false-stuck.md:64:| `.opencode/skill/sk-deep-research/references/state_format.md` | Canonical JSONL schema; insight status definition and its relationship to stuck counting |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/029-insight-status-prevents-false-stuck.md:65:| `.opencode/skill/sk-deep-research/references/convergence.md` | Convergence math; stuckCount computation and which statuses increment it |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/029-insight-status-prevents-false-stuck.md:76:- Feature file path: `04--convergence-and-recovery/029-insight-status-prevents-false-stuck.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:17:- `04--convergence-and-recovery/`
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:18:- `05--pause-resume-and-fault-tolerance/`
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:34:- [10. CONVERGENCE AND RECOVERY](#10--convergence-and-recovery)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:35:- [11. PAUSE, RESUME, AND FAULT TOLERANCE](#11--pause-resume-and-fault-tolerance)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:117:2. All critical-path scenarios in entrypoint, state, convergence, recovery, and finalization coverage are `PASS`.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:132:| Wave 2 | DR-007..DR-014 | 1-2 | Prefer tighter coordination because these scenarios reuse the same state-discipline and convergence anchors |
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:161:### DR-003 | Parameterized invocation with --max-iterations and --convergence
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:163:Verify that the command binds topic, spec folder, execution mode, max iterations, and convergence threshold before the YAML workflow starts.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:165:Feature file: [DR-003](01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:171:These scenarios validate fresh initialization, resume classification, and invalid-state protection so the loop never starts from ambiguous or contradictory scratch artifacts.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:175:Verify that a fresh session creates the canonical config, JSONL, and strategy files from the shipped assets.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:183:Feature file: [DR-005](02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:187:Verify that partial or contradictory scratch artifacts trigger a halt for repair instead of a guessed resume path.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:201:These scenarios validate the single-iteration contract: read state first, execute one focus, append JSONL, let the reducer refresh synchronized packet state, and preserve progressive synthesis behavior.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:205:Verify that each dispatched iteration reads JSONL and strategy state before performing research actions.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:209:### DR-008 | Iteration writes iteration-NNN.md, JSONL record, and reducer refresh
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:211:Verify that each completed iteration writes the detailed iteration file, appends JSONL, and leaves enough evidence for the reducer to refresh strategy, registry, and dashboard state.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:229:Verify dashboard.md is auto-generated after iteration evaluation with correct content.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:231:Feature file: [DR-024](03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:233:### DR-025 | Novelty justification present in JSONL
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:235:Verify every iteration JSONL record includes noveltyJustification alongside newInfoRatio.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:239:### DR-028 | Focus track labels in dashboard
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:241:Verify optional focusTrack labels appear in JSONL and dashboard iteration table.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:243:Feature file: [DR-028](03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:249:These scenarios validate the stop conditions, stuck recovery ladder, and composite convergence logic that determine whether the loop continues, pivots, or exits to synthesis.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:253:Verify that max iterations is a hard stop checked before softer convergence signals.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:255:Feature file: [DR-011](04--convergence-and-recovery/011-stop-on-max-iterations.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:259:Verify that the loop stops when the tracked key questions are fully answered.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:261:Feature file: [DR-012](04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:263:### DR-013 | Composite convergence stop behavior
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:265:Verify the three-signal weighted stop model and its graceful degradation rules.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:267:Feature file: [DR-013](04--convergence-and-recovery/013-composite-convergence-stop-behavior.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:273:Feature file: [DR-014](04--convergence-and-recovery/014-stuck-recovery-widens-focus-and-continues.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:277:Verify that convergence STOP is blocked when an answered question cites fewer than 2 independent sources.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:279:Feature file: [DR-020](04--convergence-and-recovery/020-quality-guard-source-diversity.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:283:Verify that convergence STOP is blocked when answered questions do not map to original key questions.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:285:Feature file: [DR-021](04--convergence-and-recovery/021-quality-guard-focus-alignment.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:289:Verify that convergence STOP is blocked when an answered question relies solely on a tentative source.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:291:Feature file: [DR-022](04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:293:### DR-023 | Composite convergence passes but guard fails -- CONTINUE
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:297:Feature file: [DR-023](04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:303:Feature file: [DR-029](04--convergence-and-recovery/029-insight-status-prevents-false-stuck.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:305:### DR-030 | Thought status handling in convergence
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:307:Verify that "thought" iterations are handled correctly in convergence and do not count as stuck or toward rolling average.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:309:Feature file: [DR-030](04--convergence-and-recovery/030-thought-status-convergence-handling.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:315:These scenarios validate graceful operator pause/resume behavior plus the defensive parsing and reconstruction rules that keep the loop usable after partial corruption.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:321:Feature file: [DR-015](05--pause-resume-and-fault-tolerance/015-pause-sentinel-halts-between-iterations.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:325:Verify that removing the pause sentinel lets the loop resume from read-state rather than re-initializing.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:327:Feature file: [DR-016](05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:329:### DR-017 | Malformed JSONL lines are skipped with defaults
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:331:Verify that malformed JSONL lines are skipped and missing fields are defaulted instead of crashing the loop.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:333:Feature file: [DR-017](05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:335:### DR-018 | JSONL reconstruction from iteration files
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:337:Verify that missing or unusable JSONL can be reconstructed from `iteration-NNN.md` files.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:339:Feature file: [DR-018](05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md)
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:367:Focused automated verification was added in the Phase 1 sk-deep-research improvements pass. The test suites live under `system-spec-kit/scripts/tests/` and cover contract parity and reducer behavior.
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:371:| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | DR-007, DR-008, DR-024 | Canonical artifact names, reducer ownership markers, runtime mirror alignment, and capability matrix completeness across docs, mirrors, and command assets |
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:372:| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | DR-008, DR-024 | Reducer idempotency: double-run produces identical registry, strategy, and dashboard; validates question resolution, finding counts, convergence score, and dashboard content |
.opencode/skill/sk-deep-research/manual_testing_playbook/manual_testing_playbook.md:376:node mcp_server/node_modules/vitest/vitest.mjs run --root scripts --config ../mcp_server/vitest.config.ts tests/deep-research-contract-parity.vitest.ts tests/deep-research-reducer.vitest.ts
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:3:description: "Verify that removing the pause sentinel lets the review loop resume from its persisted state."
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:14:This scenario validates resume after pause sentinel removal for `DRV-022`. The objective is to verify that removing the `review/.deep-review-pause` sentinel lets the review loop resume from its persisted state without loss of prior findings.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:18:A pause is only useful if the operator can resume cleanly afterward. The review loop must re-read its externalized state (JSONL, strategy, config) and continue from the exact iteration where it paused, preserving all prior findings and dimension coverage progress.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:26:- Objective: Verify removing pause sentinel lets review resume from read-state.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:28:- Orchestrator prompt: Validate the resume-after-pause contract for sk-deep-review. Confirm that when the operator removes `review/.deep-review-pause`, the review loop re-reads `deep-review-state.jsonl` and `deep-review-strategy.md`, determines the correct iteration number, and resumes dispatching from the next iteration without re-running completed iterations, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:29:- Expected execution process: Inspect the loop protocol for resume behavior, then the review YAML for state re-read on resume, then the quick reference for user-facing resume instructions.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:30:- Desired user-facing outcome: The user is told that deleting the pause file resumes the review from where it stopped, with all prior findings preserved.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:31:- Expected signals: Removing the sentinel triggers loop re-entry, JSONL is re-read to determine last iteration, strategy.md provides dimension coverage state, no iterations are re-run, and the resume event is logged.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:32:- Pass/fail posture: PASS if removing the sentinel resumes correctly from persisted state; FAIL if the loop restarts from iteration 1 or loses prior findings.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:47:| DRV-022 | Resume after pause sentinel removal | Verify removing pause sentinel lets review resume from read-state without re-running completed iterations. | Validate the resume-after-pause contract for sk-deep-review. Confirm that when the operator removes `review/.deep-review-pause`, the review loop re-reads `deep-review-state.jsonl` and `deep-review-strategy.md`, determines the correct iteration number, and resumes dispatching from the next iteration without re-running completed iterations, then return a concise operator-facing verdict. | 1. `bash: rg -n 'resume|re-read|read.state|iteration.*count|last.*iteration|Delete.*pause|sentinel.*removal' .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/skill/sk-deep-review/references/state_format.md` -> 2. `bash: rg -n 'resume|read_state|re_read|iteration_count|last_iteration|pause.*removed|sentinel.*delete' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'resume|pause.*delete|pick up|restart|continue.*review' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md .opencode/command/spec_kit/deep-review.md` | Removing sentinel triggers loop re-entry, JSONL re-read determines last iteration, strategy.md provides dimension state, no iterations re-run, and resume event logged. | Capture the resume flow from loop protocol, the YAML state re-read mechanism, and the user-facing resume instructions. | PASS if removing the sentinel resumes correctly from persisted state; FAIL if the loop restarts from iteration 1 or loses prior findings. | Privilege the loop protocol for resume flow and the state format reference for JSONL iteration counting; use YAML as enforcement confirmation. |
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:65:| `.opencode/skill/sk-deep-review/references/state_format.md` | JSONL state schema for iteration counting on resume; use the state log section |
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:66:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | State re-read and resume logic in loop entry |
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:67:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | State re-read and resume logic in loop entry |
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:68:| `.opencode/command/spec_kit/deep-review.md` | Command entrypoint; resume documentation |
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md:79:- Feature file path: `05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md`
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/006-invalid-or-contradictory-review-state-halts-for-repair.md:3:description: "Verify that invalid state (missing JSONL, corrupted config, contradictory artifacts) halts with a repair message instead of proceeding."
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/006-invalid-or-contradictory-review-state-halts-for-repair.md:14:This scenario validates invalid or contradictory review state halts for repair for `DRV-006`. The objective is to verify that invalid state (missing JSONL, corrupted config, contradictory artifacts) halts with a repair message instead of proceeding.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/006-invalid-or-contradictory-review-state-halts-for-repair.md:18:Partial or corrupted state can produce silent misclassifications or incorrect convergence results. The system must detect invalid state and halt rather than silently corrupting the review.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/006-invalid-or-contradictory-review-state-halts-for-repair.md:26:- Objective: Verify that invalid state (missing JSONL, corrupted config, contradictory artifacts) halts with a repair message instead of proceeding.
.opencode/skill/sk-deep-review/manual_testing_playbook/02--initialization-and-state-setup/006-invalid-or-contradictory-review-state-halts-for-repair.md:47:| DRV-006 | Invalid or contradictory review state halts for repair | Verify that invalid state (missing JSONL, corrupted config, contradictory artifacts) halts with a repair message instead of proceeding. | Validate the invalid-state detection contract for sk-deep-review. Confirm that `step_classify_session` classifies partial, missing, or contradictory review state as "invalid-state" and halts with a repair message, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'invalid.state|on_invalid|halt|repair|contradictory|partial' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 2. `bash: rg -n 'invalid.state|on_invalid|halt|repair' .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'on_conflict|on_canonical_present|contradictory' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | The classify step has an explicit "invalid-state" classification for partial or contradictory combinations; it halts with a descriptive message; the migration step halts on canonical/legacy conflicts. | Capture the classify step invalid-state rule, the halt message text, and the migration conflict handling. | PASS if invalid state consistently triggers a halt with an actionable repair message; FAIL if any invalid state combination proceeds silently. | Enumerate all possible partial-state combinations (config only, JSONL only, strategy only, pairs without the third) and verify each maps to invalid-state. |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:2:title: "DRV-013 -- Review dashboard generation after iteration"
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:3:description: "Verify that the review dashboard with Findings Summary, Progress Table, Coverage, and Trend is generated after each iteration."
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:6:# DRV-013 -- Review dashboard generation after iteration
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:14:This scenario validates review dashboard generation after iteration for `DRV-013`. The objective is to verify that the review dashboard with Findings Summary, Progress Table, Coverage, and Trend is generated or refreshed after each iteration.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:18:The dashboard is the operator's primary status view during a multi-iteration review. Without a reliable dashboard, operators must manually parse JSONL records to understand progress, which defeats the purpose of the automated loop.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:26:- Objective: Verify that the dashboard with Findings Summary, Progress Table, Coverage, and Trend is generated after each iteration.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:27:- Real user request: Where do I look to see how the review is progressing? Is there a dashboard?
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:28:- Orchestrator prompt: Validate the dashboard generation contract for sk-deep-review. Confirm that step_generate_dashboard runs after each iteration, reads from JSONL and strategy, and writes deep-review-dashboard.md with Findings Summary, Progress Table, Coverage, and Trend sections, then return a concise user-facing pass/fail verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:29:- Expected execution process: Inspect the YAML step_generate_dashboard for its position in the loop, then its read sources and output format, then the dashboard template in the assets for the expected sections.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:30:- Desired user-facing outcome: The user is told that a dashboard file is auto-generated after each iteration showing current findings, progress, coverage, and trend at a glance.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:31:- Expected signals: The step_generate_dashboard runs after step_validate_iteration; it reads JSONL and strategy; it writes to deep-review-dashboard.md; the output includes Findings Summary, Progress Table, Coverage, and Next Focus sections.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:32:- Pass/fail posture: PASS if the dashboard step runs after each iteration and produces all expected sections; FAIL if the step is missing from the loop or the output template is incomplete.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:47:| DRV-013 | Review dashboard generation after iteration | Verify that the dashboard with Findings Summary, Progress Table, Coverage, and Trend is generated after each iteration. | Validate the dashboard generation contract for sk-deep-review. Confirm that `step_generate_dashboard` runs after each iteration and writes `deep-review-dashboard.md` with Findings Summary, Progress Table, Coverage, and Trend sections, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'step_generate_dashboard|dashboard' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 2. `bash: sed -n '1,220p' .opencode/skill/sk-deep-review/assets/deep_review_dashboard.md` -> 3. `bash: rg -n 'dashboard|deep-review-dashboard' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | The step_generate_dashboard runs after validation; it reads JSONL and strategy; it writes deep-review-dashboard.md; the output includes Findings Summary, Progress Table, Coverage, and Next Focus sections. | Capture the dashboard step position in the loop, the output template format, and the state_paths dashboard entry. | PASS if the dashboard step runs after each iteration and produces all expected sections; FAIL if the step is missing from the loop or the output template is incomplete. | Compare the dashboard template in assets/ with the YAML step_generate_dashboard format block to verify they agree on section structure. |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:64:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Dashboard generation step; inspect `step_generate_dashboard` |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:65:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Dashboard generation step; inspect `step_generate_dashboard` |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:66:| `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md` | Dashboard template |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md:76:- Feature file path: `03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md`
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md:2:title: "DRV-011 -- Cross-reference verification detects misalignment"
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md:6:# DRV-011 -- Cross-reference verification detects misalignment
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md:14:This scenario validates cross-reference verification detects misalignment for `DRV-011`. The objective is to verify that cross-reference checks (spec_code, checklist_evidence, skill_agent protocols) detect misalignment between documentation and implementation.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md:28:- Orchestrator prompt: Validate the cross-reference verification contract for sk-deep-review. Confirm that traceability protocols (core: spec_code, checklist_evidence; overlay: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability) are configured in the review config and that the traceability dimension dispatches cross-reference checks, then return a concise user-facing pass/fail verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md:31:- Expected signals: The config includes crossReference with core and overlay protocols; the dispatch prompt includes traceability constraints; the strategy template tracks cross-reference results; the quality guards require cross-reference checks before convergence.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md:47:| DRV-011 | Cross-reference verification detects misalignment | Verify that cross-reference checks (spec_code, checklist_evidence, skill_agent protocols) detect misalignment. | Validate the cross-reference verification contract for sk-deep-review. Confirm that traceability protocols (core: `spec_code`, `checklist_evidence`; overlay: `skill_agent`, `agent_cross_runtime`) are configured and that the traceability dimension dispatches cross-reference checks, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'crossReference|cross_reference|spec_code|checklist_evidence|skill_agent|agent_cross_runtime|feature_catalog_code|playbook_capability' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 2. `bash: rg -n 'traceability|cross.reference|TRACEABILITY PROTOCOLS' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 3. `bash: rg -n 'cross.reference|traceability|spec_code|checklist_evidence' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` | The config includes crossReference with core and overlay protocols; the dispatch prompt includes traceability constraints; the quality guards require cross-reference checks before convergence. | Capture the crossReference config block, the traceability protocol list from the dispatch prompt, and the quality guard requirements. | PASS if core and overlay cross-reference protocols are configured and the traceability dimension dispatches them; FAIL if cross-reference checks are undocumented or not enforced. | Check the review_mode_contract.yaml for the full cross-reference protocol definitions and verify the YAML step_order_dimensions derives the traceability protocol plan. |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md:76:- Feature file path: `03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md`
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:3:description: "Verify review stops at maxIterations (default 7) even if dimensions remain uncovered."
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:14:This scenario validates stop on max iterations for `DRV-015`. The objective is to verify that the review loop stops at `maxIterations` (default 7) even if review dimensions remain uncovered.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:26:- Objective: Verify review stops at maxIterations (default 7) even if dimensions remain uncovered.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:27:- Real user request: If the review keeps finding new issues, does it ever stop on its own?
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:28:- Orchestrator prompt: Validate the hard iteration cap contract for sk-deep-review. Confirm that `maxIterations` defaults to 7, that the loop exits unconditionally at that limit regardless of dimension coverage or convergence score, and that synthesis still runs after a hard stop, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:29:- Expected execution process: Inspect the convergence reference for hard stop rules, then the YAML workflow step that enforces the cap, then the quick reference and SKILL.md for user-facing documentation.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:31:- Expected signals: `maxIterations=7` default, unconditional exit at that count, synthesis phase runs after hard stop, review-report.md is still produced.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:32:- Pass/fail posture: PASS if the hard cap is enforced unconditionally and synthesis still runs; FAIL if the loop can exceed maxIterations or skips synthesis after a hard stop.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:47:| DRV-015 | Stop on max iterations | Verify review stops at maxIterations (default 7) even if dimensions remain uncovered. | Validate the hard iteration cap contract for sk-deep-review. Confirm that `maxIterations` defaults to 7, that the loop exits unconditionally at that limit regardless of dimension coverage or convergence score, and that synthesis still runs after a hard stop, then return a concise operator-facing verdict. | 1. `bash: rg -n 'maxIterations|hard.stop|HARD_STOP|max_iterations|iteration.*cap' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'maxIterations|max_iterations|hard.stop|step_check_convergence|iteration_count' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'maxIterations|max-iterations|default.*7|hard stop' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md` | `maxIterations=7` default, unconditional exit at that count, synthesis phase runs after hard stop, review-report.md is still produced. | Capture the hard-stop condition from convergence.md, the YAML enforcement step, and the user-facing documentation of the default. | PASS if the hard cap is enforced unconditionally and synthesis still runs; FAIL if the loop can exceed maxIterations or skips synthesis after a hard stop. | Privilege the convergence reference for exact algorithm and use YAML workflow steps as the enforcement authority. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:64:| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical convergence math including hard stop rules |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:65:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Workflow algorithm; inspect `step_check_convergence` for hard stop enforcement |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:66:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Workflow algorithm; inspect `step_check_convergence` for hard stop enforcement |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:67:| `.opencode/skill/sk-deep-review/references/quick_reference.md` | User-facing parameter defaults; use `ANCHOR:commands` and `ANCHOR:convergence` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:68:| `.opencode/skill/sk-deep-review/SKILL.md` | Skill rules and convergence documentation; use `ANCHOR:rules` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/015-stop-on-max-iterations.md:78:- Feature file path: `04--convergence-and-recovery/015-stop-on-max-iterations.md`
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/001-auto-mode-deep-review-kickoff.md:27:- Real user request: Run a deep review on a spec folder without stopping for approvals and tell me what it will create.
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/001-auto-mode-deep-review-kickoff.md:31:- Expected signals: The same autonomous command appears across sources, autonomous mode is approval-free, and the workflow points to config, JSONL, strategy, iteration files, and `review/review-report.md`.
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/001-auto-mode-deep-review-kickoff.md:47:| DRV-001 | Auto mode deep-review kickoff | Verify that autonomous mode is exposed consistently across the README, quick reference, command entrypoint, and auto YAML workflow. | Validate the autonomous entrypoint for sk-deep-review. Confirm that `/spec_kit:deep-review:auto` is documented consistently across the README, quick reference, command entrypoint, and autonomous YAML workflow, then return a concise user-facing pass/fail verdict with the expected artifact summary. | 1. `bash: rg -n '/spec_kit:deep-review:auto|review/review-report.md|review/iterations' .opencode/skill/sk-deep-review/README.md .opencode/skill/sk-deep-review/references/quick_reference.md` -> 2. `bash: sed -n '1,220p' .opencode/command/spec_kit/deep-review.md` -> 3. `bash: sed -n '1,260p' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | The same autonomous command appears across sources, autonomous mode is approval-free, and the workflow points to config, JSONL, strategy, iteration files, and `review/review-report.md`. | Capture the command examples, the mode-routing block, and the `state_paths` contract together. | PASS if all inspected sources agree on command shape, autonomous behavior, and output artifacts; FAIL if any source materially contradicts the others. | Start with the README examples, confirm the Markdown command maps `:auto` to the autonomous YAML, then inspect YAML `state_paths` if the artifact contract is unclear. |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/020-quality-guard-source-diversity.md:3:description: "Verify that convergence STOP is blocked when an answered question cites <2 independent sources."
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/020-quality-guard-source-diversity.md:14:This scenario validates the source diversity quality guard for `DR-020`. The objective is to verify that convergence STOP is blocked when an answered question cites fewer than two independent sources.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/020-quality-guard-source-diversity.md:18:A convergence decision based on thinly sourced answers creates a false sense of completeness. The source diversity guard ensures that no question is considered answered unless at least two independent sources support it, preventing shallow research from being accepted as done.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/020-quality-guard-source-diversity.md:26:- Objective: Verify that convergence STOP is blocked when an answered question cites <2 independent sources.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/020-quality-guard-source-diversity.md:28:- Orchestrator prompt: Validate the source diversity quality guard for sk-deep-research. Confirm that when composite convergence votes STOP, the guard checks each answered question for >= 2 independent sources, and that a violation emits a guard_violation event and overrides the decision to CONTINUE.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/020-quality-guard-source-diversity.md:29:- Expected execution process: Inspect the Quality Guard Protocol in the convergence reference first, then the YAML algorithm guard check, then the loop protocol Step 2c, then the state format guard_violation event schema.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/020-quality-guard-source-diversity.md:32:- Pass/fail posture: PASS if the source_diversity guard rule (>= 2 independent sources), its violation logging, and its STOP-override behavior are consistent across convergence.md, loop_protocol.md, auto.yaml, and state_format.md; FAIL if any of those elements drift or contradict.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/020-quality-guard-source-diversity.md:47:| DR-020 | Quality Guard — Source Diversity | Verify that convergence STOP is blocked when an answered question cites <2 independent sources. | Validate the source diversity quality guard for sk-deep-research. Confirm that when composite convergence votes STOP, the guard checks each answered question for >= 2 independent sources, and that a violation emits a guard_violation event and overrides the decision to CONTINUE. | 1. `bash: sed -n '104,139p' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'source_diversity\|guard_violation\|collectSources' .opencode/skill/sk-deep-research/references/convergence.md` -> 3. `bash: sed -n '97,107p' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 4. `bash: rg -n 'guard_violation\|source_diversity' .opencode/skill/sk-deep-research/references/state_format.md` -> 5. `bash: sed -n '236,243p' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | guard_violation event logged with guard="source_diversity", STOP decision overridden to CONTINUE, violated question targeted in next iteration focus. | Capture the guard rule table row for Source Diversity, the pseudocode branch for len(sources) < 2, the YAML override logic, and the state_format event schema example. | PASS if the source_diversity guard rule (>= 2 independent sources), its violation logging, and its STOP-override behavior are consistent across convergence.md, loop_protocol.md, auto.yaml, and state_format.md; FAIL if any of those elements drift or contradict. | Privilege convergence.md §2.4 for the canonical guard definition; use loop_protocol.md Step 2c and auto.yaml step_check_convergence as secondary confirmation of the override flow. |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/020-quality-guard-source-diversity.md:64:| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical quality guard definitions; use §2.4 Quality Guard Protocol |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/020-quality-guard-source-diversity.md:66:| `.opencode/skill/sk-deep-research/references/state_format.md` | JSONL event schema; use guard_violation event definition and sourceStrength field |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/020-quality-guard-source-diversity.md:67:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; inspect `step_check_convergence` guard override logic |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/020-quality-guard-source-diversity.md:76:- Feature file path: `04--convergence-and-recovery/020-quality-guard-source-diversity.md`
.opencode/skill/sk-deep-review/references/state_format.md:3:description: State file schemas for the autonomous deep review loop — config, JSONL log, strategy, iteration files, and review report.
.opencode/skill/sk-deep-review/references/state_format.md:21:| `deep-review-findings-registry.json` | JSON | Auto-generated reducer state |
.opencode/skill/sk-deep-review/references/state_format.md:23:| `deep-review-dashboard.md` | Markdown | Auto-generated (read-only) |
.opencode/skill/sk-deep-review/references/state_format.md:35:    deep-review-dashboard.md
.opencode/skill/sk-deep-review/references/state_format.md:65:  "convergenceThreshold": 0.10,
.opencode/skill/sk-deep-review/references/state_format.md:83:    "deep-review-dashboard.md": "auto-generated",
.opencode/skill/sk-deep-review/references/state_format.md:89:  "reducer": {
.opencode/skill/sk-deep-review/references/state_format.md:91:    "inputs": ["latestJSONLDelta", "newIterationFile", "priorReducedState"],
.opencode/skill/sk-deep-review/references/state_format.md:92:    "outputs": ["findingsRegistry", "dashboardMetrics", "strategyUpdates"],
.opencode/skill/sk-deep-review/references/state_format.md:98:      "convergenceScore"
.opencode/skill/sk-deep-review/references/state_format.md:113:| parentSessionId | string \| null | `null` | Parent lineage reference for restart/fork flows |
.opencode/skill/sk-deep-review/references/state_format.md:114:| lineageMode | string | `"new"` | `new`, `resume`, `restart`, `fork`, `completed-continue` |
.opencode/skill/sk-deep-review/references/state_format.md:116:| continuedFromRun | number \| null | `null` | Prior completed run reopened by completed-continue |
.opencode/skill/sk-deep-review/references/state_format.md:118:| convergenceThreshold | number | 0.10 | Stop when severity-weighted new findings ratio below this |
.opencode/skill/sk-deep-review/references/state_format.md:124:| status | string | `"initialized"` | `initialized`, `running`, `converged`, `stuck`, `complete`, `error` |
.opencode/skill/sk-deep-review/references/state_format.md:125:| releaseReadinessState | string | `"in-progress"` | `in-progress`, `converged`, `release-blocking` |
.opencode/skill/sk-deep-review/references/state_format.md:127:| reducer | object | -- | Canonical reducer inputs, outputs, and metrics names |
.opencode/skill/sk-deep-review/references/state_format.md:168:{"type":"config","mode":"review","topic":"...","reviewTarget":"...","sessionId":"rvw-...","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":7,"convergenceThreshold":0.10,"createdAt":"2026-03-24T14:00:00Z","specFolder":"..."}
.opencode/skill/sk-deep-review/references/state_format.md:181:  "lineageMode": "resume",
.opencode/skill/sk-deep-review/references/state_format.md:194:**Optional fields:** `parentSessionId`, `continuedFromRun`, `findingsRefined`, `findingRefs`, `traceabilityChecks`, `coverage`, `noveltyJustification`, `ruledOut`, `focusTrack`, `scoreEstimate`, `segment`, `convergenceSignals`
.opencode/skill/sk-deep-review/references/state_format.md:215:| compositeStop | -- | Weighted stop score (stop if > 0.60) |
.opencode/skill/sk-deep-review/references/state_format.md:226:  "dimensionCoverage": 1.0, "stopReason": "composite_converged",
.opencode/skill/sk-deep-review/references/state_format.md:231:**Required:** `type`, `event`, `mode`, `totalIterations`, `verdict`, `activeP0`, `activeP1`, `activeP2`, `dimensionCoverage`, `stopReason`, `timestamp`
.opencode/skill/sk-deep-review/references/state_format.md:342:  "lineageMode": "resume",
.opencode/skill/sk-deep-review/references/state_format.md:359:  "convergenceScore": 0.44
.opencode/skill/sk-deep-review/references/state_format.md:363:This file is machine-owned and must stay synchronized with the latest iteration delta, dashboard metrics, and synthesized review report.
.opencode/skill/sk-deep-review/references/state_format.md:439:| 9 | Audit Appendix | Coverage, convergence replay, audit detail |
.opencode/skill/sk-deep-review/references/state_format.md:441:**Executive Summary** includes verdict (`PASS`/`CONDITIONAL`/`FAIL`), active finding counts, `hasAdvisories` boolean (PASS + P2 > 0), scope description, and convergence reason.
.opencode/skill/sk-deep-review/references/state_format.md:455:**Audit Appendix** contains iteration table, convergence signal replay, file coverage matrix, and dimension breakdown.
.opencode/skill/sk-deep-review/references/state_format.md:460:<!-- ANCHOR:dashboard -->
.opencode/skill/sk-deep-review/references/state_format.md:461:## 8. DASHBOARD (review/deep-review-dashboard.md)
.opencode/skill/sk-deep-review/references/state_format.md:465:- **Path**: `{spec_folder}/review/deep-review-dashboard.md`
.opencode/skill/sk-deep-review/references/state_format.md:466:- **Generated from**: JSONL state log + strategy + findings registry
.opencode/skill/sk-deep-review/references/state_format.md:474:| Findings Summary | JSONL | Active P0/P1/P2 counts, new vs refined |
.opencode/skill/sk-deep-review/references/state_format.md:475:| Progress Table | JSONL | Run, status, focus, dimensions, ratio, duration |
.opencode/skill/sk-deep-review/references/state_format.md:476:| Coverage | Strategy + JSONL | Dimension completion, file coverage, protocol status |
.opencode/skill/sk-deep-review/references/state_format.md:477:| Trend | JSONL signals | Rolling average, composite stop score, trajectory |
.opencode/skill/sk-deep-review/references/state_format.md:479:**Rules:** Sole inputs are JSONL + strategy. Overwrite entirely on refresh. Read-only for all agents.
.opencode/skill/sk-deep-review/references/state_format.md:483:<!-- /ANCHOR:dashboard -->
.opencode/skill/sk-deep-review/references/state_format.md:580:Same file + line range + root cause as an existing finding = **refinement**, not new. The existing findingId is updated. Refinements count at half weight (`refinementMultiplier: 0.5`) and are tracked via `findingsRefined` in JSONL.
.opencode/skill/sk-deep-research/references/convergence.md:3:description: Algorithms and protocols for determining when the deep research loop should stop.
.opencode/skill/sk-deep-research/references/convergence.md:8:Algorithms and protocols for determining when the deep research loop should stop.
.opencode/skill/sk-deep-research/references/convergence.md:15:Convergence detection prevents infinite loops and stops research when additional iterations yield diminishing returns. The algorithm evaluates multiple signals to make a stop/continue/recovery decision, while the reducer publishes the resulting `convergenceScore` and `coverageBySources` into the dashboard and findings registry after every iteration.
.opencode/skill/sk-deep-research/references/convergence.md:31:  // Hard stop: max iterations
.opencode/skill/sk-deep-research/references/convergence.md:35:  // Hard stop: all questions answered
.opencode/skill/sk-deep-research/references/convergence.md:52:Three independent signals each cast a stop/continue vote. Stop when weighted stop-score exceeds the consensus threshold.
.opencode/skill/sk-deep-research/references/convergence.md:62:- `convergenceScore`: normalized stop-score surfaced in `findings-registry.json` and `deep-research-dashboard.md`
.opencode/skill/sk-deep-research/references/convergence.md:66:  // Filter: exclude "thought" iterations from convergence signals
.opencode/skill/sk-deep-research/references/convergence.md:72:  // Composite convergence: 3-signal weighted vote
.opencode/skill/sk-deep-research/references/convergence.md:80:    rollingStop = avgNewInfo < config.convergenceThreshold
.opencode/skill/sk-deep-research/references/convergence.md:81:    signals.push({ name: "rollingAvg", value: avgNewInfo, stop: rollingStop, weight: 0.30 })
.opencode/skill/sk-deep-research/references/convergence.md:92:    signals.push({ name: "madScore", value: noiseFloor, stop: madStop, weight: 0.35 })
.opencode/skill/sk-deep-research/references/convergence.md:101:    signals.push({ name: "entropyCoverage", value: coverage, stop: entropyStop, weight: 0.35 })
.opencode/skill/sk-deep-research/references/convergence.md:104:  // Compute weighted stop score
.opencode/skill/sk-deep-research/references/convergence.md:107:    stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
.opencode/skill/sk-deep-research/references/convergence.md:108:    if stopScore > 0.60:
.opencode/skill/sk-deep-research/references/convergence.md:109:      return { action: "STOP", reason: "composite_converged", stopScore, signals }
.opencode/skill/sk-deep-research/references/convergence.md:117:After composite convergence votes STOP but before the decision is finalized, three binary guards must pass. If any guard fails, the STOP is overridden to CONTINUE and violations are logged.
.opencode/skill/sk-deep-research/references/convergence.md:127:- **Source Diversity**: For each question marked answered in strategy.md, count distinct sources from iteration JSONL records. Require >= 2.
.opencode/skill/sk-deep-research/references/convergence.md:145:      appendToJSONL({ type: "event", event: "guard_violation", ...v })
.opencode/skill/sk-deep-research/references/convergence.md:150:When the composite convergence returns STOP, invoke `checkQualityGuards()`. If it returns `passed: false`, override the action to CONTINUE and resume the loop. The orchestrator should target the violated questions in the next iteration's focus area.
.opencode/skill/sk-deep-research/references/convergence.md:156:When the proportion of identified approaches that have been either validated or eliminated reaches a high threshold, this could serve as an additional convergence signal indicating the research space has been thoroughly explored.
.opencode/skill/sk-deep-research/references/convergence.md:172:| 1-2 | Entropy only (weight 1.0) | Very unlikely to stop (need 85%+ coverage) |
.opencode/skill/sk-deep-research/references/convergence.md:181:2. **All questions answered** (hard stop)
.opencode/skill/sk-deep-research/references/convergence.md:183:4. **Composite convergence** (3-signal weighted vote, threshold 0.60)
.opencode/skill/sk-deep-research/references/convergence.md:216:Computed by the orchestrator from JSONL records.
.opencode/skill/sk-deep-research/references/convergence.md:230:    if i.newInfoRatio < config.convergenceThreshold or i.status == "stuck":
.opencode/skill/sk-deep-research/references/convergence.md:238:- `newInfoRatio < config.convergenceThreshold` (below the configured no-progress threshold)
.opencode/skill/sk-deep-research/references/convergence.md:258:The MAD noise floor represents the minimum change needed to distinguish signal from noise. When the latest newInfoRatio falls at or below the noise floor, the MAD signal votes "stop".
.opencode/skill/sk-deep-research/references/convergence.md:284:> **Source-Hygiene Note:** Tentative findings (`sourceStrength == "tentative"`) do not count toward answered-question coverage unless confirmed by an independent source in a later iteration. When computing `answered / total`, exclude any question whose only supporting evidence has tentative strength. This prevents premature convergence based on unverified or low-confidence information.
.opencode/skill/sk-deep-research/references/convergence.md:286:### Reading JSONL State (Fault-Tolerant)
.opencode/skill/sk-deep-research/references/convergence.md:300:   `"Warning: {skippedCount} of {totalLines} JSONL lines were malformed and skipped."`
.opencode/skill/sk-deep-research/references/convergence.md:303:This ensures convergence checks continue even after partial state corruption. See state_format.md Section 3 for the full fault tolerance specification.
.opencode/skill/sk-deep-research/references/convergence.md:314:When computing convergence signals:
.opencode/skill/sk-deep-research/references/convergence.md:316:- Hard stops (max iterations) count ALL iterations regardless of segment
.opencode/skill/sk-deep-research/references/convergence.md:317:- Cross-segment analysis: read full JSONL without segment filtering
.opencode/skill/sk-deep-research/references/convergence.md:320:- `:restart` mode in an implementation that supports it
.opencode/skill/sk-deep-research/references/convergence.md:324:See state_format.md Section 3 for JSONL schema details.
.opencode/skill/sk-deep-research/references/convergence.md:414:  if all(config.convergenceThreshold <= r <= 0.20 for r in recentRatios):
.opencode/skill/sk-deep-research/references/convergence.md:423:- If `newInfoRatio > config.convergenceThreshold`: Recovery successful. Reset stuck count. Continue.
.opencode/skill/sk-deep-research/references/convergence.md:424:- If `newInfoRatio <= config.convergenceThreshold`: Recovery failed. Exit to synthesis with gaps documented.
.opencode/skill/sk-deep-research/references/convergence.md:427:Add to JSONL: `{"type":"event","event":"stuck_recovery","fromIteration":N,"outcome":"recovered|failed"}`
.opencode/skill/sk-deep-research/references/convergence.md:441:| 3 | State corruption | Reconstruct JSONL from iteration files | 1 attempt |
.opencode/skill/sk-deep-research/references/convergence.md:462:When JSONL is missing or corrupted beyond fault-tolerant parsing:
.opencode/skill/sk-deep-research/references/convergence.md:465:- Write reconstructed JSONL with `status: "reconstructed"`
.opencode/skill/sk-deep-research/references/convergence.md:482:  - Recommended action (restart, adjust parameters, manual intervention)
.opencode/skill/sk-deep-research/references/convergence.md:509:    // Log advisory event (does not override convergence)
.opencode/skill/sk-deep-research/references/convergence.md:510:    appendToJSONL({ type: "event", event: "ratio_within_noise",
.opencode/skill/sk-deep-research/references/convergence.md:530:| ratio <= noiseFloor | Ratio indistinguishable from noise | Advisory only; convergence algorithm decides |
.opencode/skill/sk-deep-research/references/convergence.md:542:This provides diagnostic visibility without overriding the composite convergence algorithm.
.opencode/skill/sk-deep-research/references/convergence.md:547:<!-- ANCHOR:convergence-threshold-tuning -->
.opencode/skill/sk-deep-research/references/convergence.md:554:| 0.10 | Aggressive, stops earlier | Quick surveys, time-constrained research |
.opencode/skill/sk-deep-research/references/convergence.md:575:<!-- /ANCHOR:convergence-threshold-tuning -->
.opencode/skill/sk-deep-research/references/convergence.md:580:If fewer than 3 iterations have completed, the convergence threshold check is skipped (not enough data). Only max iterations and stuck detection apply.
.opencode/skill/sk-deep-research/references/convergence.md:583:Possible for very narrow topics. The loop stops cleanly after 1 iteration. This is correct behavior, not an error.
.opencode/skill/sk-deep-research/references/convergence.md:586:If the agent fails to report `newInfoRatio` in its JSONL entry:
.opencode/skill/sk-deep-research/references/convergence.md:588:- Log a warning in the JSONL: `{"type":"event","event":"missing_newInfoRatio","iteration":N}`
.opencode/skill/sk-deep-research/references/convergence.md:598:<!-- ANCHOR:convergence-reporting -->
.opencode/skill/sk-deep-research/references/convergence.md:601:When the loop stops, the YAML workflow generates a convergence report:
.opencode/skill/sk-deep-research/references/convergence.md:606:Stop reason: [composite_converged | max_iterations | all_questions_answered | stuck_unrecoverable]
.opencode/skill/sk-deep-research/references/convergence.md:620:This report is included in the final JSONL entry and displayed to the user.
.opencode/skill/sk-deep-research/references/convergence.md:622:<!-- /ANCHOR:convergence-reporting -->
.opencode/skill/sk-deep-research/references/convergence.md:626:<!-- ANCHOR:review-mode-convergence -->
.opencode/skill/sk-deep-research/references/convergence.md:629:Review mode uses a severity-weighted variant of the convergence algorithm. Instead of measuring "new information" against research questions, it measures "new findings" against the simplified four-dimension review model and machine-verifiable traceability coverage.
.opencode/skill/sk-deep-research/references/convergence.md:653:**P0 Override rationale:** A new critical finding always signals significant remaining work, regardless of the overall new-to-total ratio. Setting a floor of 0.50 prevents premature convergence when critical issues are still being discovered.
.opencode/skill/sk-deep-research/references/convergence.md:670:| `dimensionCoverage.weight` | `0.45` | Highest-weight convergence signal |
.opencode/skill/sk-deep-research/references/convergence.md:672:| `compositeStopScore` | `0.60` | Weighted stop-score needed before guard evaluation |
.opencode/skill/sk-deep-research/references/convergence.md:693:        return { action: "STOP", reason: "all_dimensions_clean", coverage, stabilizationPasses }
.opencode/skill/sk-deep-research/references/convergence.md:706:    signals.push({ name: "rollingAvg", value: avgRatio, stop: rollingStop, weight: 0.30 })
.opencode/skill/sk-deep-research/references/convergence.md:716:    signals.push({ name: "madScore", value: noiseFloor, stop: madStop, weight: 0.25 })
.opencode/skill/sk-deep-research/references/convergence.md:727:    stop: coverageStop,
.opencode/skill/sk-deep-research/references/convergence.md:737:    stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
.opencode/skill/sk-deep-research/references/convergence.md:738:    if stopScore >= config.thresholds.compositeStopScore:
.opencode/skill/sk-deep-research/references/convergence.md:741:        return { action: "STOP", reason: "composite_converged", stopScore, signals }
.opencode/skill/sk-deep-research/references/convergence.md:743:        appendToJSONL({ type: "event", event: "guard_violation", ...violation })
.opencode/skill/sk-deep-research/references/convergence.md:786:Replay validation verifies that convergence decisions are reproducible from disk state alone.
.opencode/skill/sk-deep-research/references/convergence.md:789:2. Recompute `newFindingsRatio`, rolling-average votes, MAD votes, and coverage votes from the stored JSONL fields only.
.opencode/skill/sk-deep-research/references/convergence.md:792:5. Compare the replayed decision and stop reason to the recorded synthesis event.
.opencode/skill/sk-deep-research/references/convergence.md:798:**Threshold:** 2 consecutive no-progress iterations. Review mode uses `noProgressThreshold = 0.05`, not the rolling stop threshold.
.opencode/skill/sk-deep-research/references/convergence.md:850:When convergence signals fire but review is incomplete:
.opencode/skill/sk-deep-research/references/convergence.md:852:- Replay validation must reproduce the same stop reason from JSONL state
.opencode/skill/sk-deep-research/references/convergence.md:857:<!-- /ANCHOR:review-mode-convergence -->
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:2:title: "DRV-023 -- Malformed JSONL lines are skipped with defaults"
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:3:description: "Verify that malformed JSONL lines in the review state log are skipped gracefully with sensible defaults applied."
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:6:# DRV-023 -- Malformed JSONL lines are skipped with defaults
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:14:This scenario validates malformed JSONL lines are skipped with defaults for `DRV-023`. The objective is to verify that when the review state log (`deep-review-state.jsonl`) contains malformed or unparseable lines, they are skipped gracefully and sensible defaults are applied so the loop can continue.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:18:Agent-written JSONL can be corrupted by truncation, encoding issues, or agent errors mid-write. If the loop fails hard on a single bad line, all prior review progress is lost. Graceful degradation with defaults preserves the review session and lets the operator investigate the corruption later.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:26:- Objective: Verify malformed JSONL lines are skipped gracefully in review state.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:28:- Orchestrator prompt: Validate the malformed JSONL handling contract for sk-deep-review. Confirm that when `review/deep-review-state.jsonl` contains unparseable lines, those lines are skipped without halting the loop, that sensible defaults (e.g., `newFindingsRatio = 1.0`) are used to prevent premature convergence, and that the skip is logged or visible in the state, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:29:- Expected execution process: Inspect the state format reference for JSONL parsing rules, then the loop protocol or YAML for error handling, then the convergence reference for default values on parse failure.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:30:- Desired user-facing outcome: The user is told that a corrupted state line will not crash the review, and that the loop applies conservative defaults to avoid false convergence.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:32:- Pass/fail posture: PASS if malformed lines are skipped with conservative defaults; FAIL if a bad line crashes the loop or causes false convergence.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:47:| DRV-023 | Malformed JSONL lines are skipped with defaults | Verify malformed JSONL lines in review state are skipped gracefully with sensible defaults. | Validate the malformed JSONL handling contract for sk-deep-review. Confirm that unparseable lines in `review/deep-review-state.jsonl` are skipped without halting the loop, that sensible defaults (e.g., `newFindingsRatio = 1.0`) are used to prevent premature convergence, and that the skip is logged or visible, then return a concise operator-facing verdict. | 1. `bash: rg -n 'malformed|unparseable|skip.*line|parse.*error|JSON.*parse|graceful|default.*ratio|newFindingsRatio.*1\.0' .opencode/skill/sk-deep-review/references/state_format.md .opencode/skill/sk-deep-review/references/convergence.md` -> 2. `bash: rg -n 'malformed|parse_error|skip_line|graceful|default|JSON.*parse|error_handling' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'malformed|corrupt|graceful|JSONL.*error|parse.*fail|default|error handling|fault tolerance' .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md .opencode/command/spec_kit/deep-review.md` | Malformed lines skipped, defaults applied (`newFindingsRatio = 1.0`), iteration count from valid lines, skip is observable. | Capture the JSONL parsing contract from state format, the error handling rules from YAML or loop protocol, and the default values applied on parse failure. | PASS if malformed lines are skipped with conservative defaults; FAIL if a bad line crashes the loop or causes false convergence. | Privilege the state format reference for JSONL schema rules and the convergence reference for default values on degraded input. |
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:64:| `.opencode/skill/sk-deep-review/references/state_format.md` | JSONL schema and parsing rules; use the state log section |
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:65:| `.opencode/skill/sk-deep-review/references/convergence.md` | Default values on parse failure; graceful degradation rules |
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:67:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | JSONL parsing and error handling in state read steps |
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:68:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | JSONL parsing and error handling in state read steps |
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md:79:- Feature file path: `05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md`
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md:2:title: "DRV-014 -- Severity classification in JSONL"
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md:3:description: "Verify that findingsSummary and findingsNew fields in JSONL include P0/P1/P2 counts for every iteration record."
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md:6:# DRV-014 -- Severity classification in JSONL
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md:14:This scenario validates severity classification in JSONL for `DRV-014`. The objective is to verify that `findingsSummary` and `findingsNew` fields in JSONL include P0/P1/P2 counts for every iteration record.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md:18:The convergence algorithm uses `newFindingsRatio` derived from severity-weighted findings (P0: 10.0, P1: 5.0, P2: 1.0). If the JSONL records do not include accurate P0/P1/P2 counts, convergence decisions are based on incorrect data. Additionally, any new P0 finding forces `newFindingsRatio >= 0.50`, blocking premature convergence.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md:26:- Objective: Verify that findingsSummary and findingsNew fields in JSONL include P0/P1/P2 counts for every iteration record.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md:28:- Orchestrator prompt: Validate the severity classification JSONL contract for sk-deep-review. Confirm that Rule 11 mandates findingsSummary (cumulative) and findingsNew (this iteration) fields with P0/P1/P2 counts in every JSONL iteration record, that the YAML dispatch prompt constrains this, and that the convergence algorithm uses severity weights, then return a concise user-facing pass/fail verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md:29:- Expected execution process: Inspect the SKILL.md rules for Rule 11, then the YAML dispatch constraints for the required JSONL fields, then the convergence algorithm for severity weight usage, then the state format reference for the JSONL schema.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md:30:- Desired user-facing outcome: The user is told that every iteration writes machine-readable P0/P1/P2 counts (cumulative and per-iteration) and that these drive the convergence decision.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md:31:- Expected signals: Rule 11 mandates the fields; the YAML dispatch prompt constrains them; the convergence algorithm references severity_weights with P0=10.0, P1=5.0, P2=1.0; the P0 override sets newFindingsRatio >= 0.50.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md:32:- Pass/fail posture: PASS if findingsSummary and findingsNew with P0/P1/P2 are mandated, constrained, and consumed by convergence; FAIL if either field is missing from the contract or not used in convergence.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md:47:| DRV-014 | Severity classification in JSONL | Verify that findingsSummary and findingsNew fields in JSONL include P0/P1/P2 counts for every iteration record. | Validate the severity classification JSONL contract for sk-deep-review. Confirm that `findingsSummary` (cumulative) and `findingsNew` (per-iteration) with P0/P1/P2 counts are mandated in every JSONL iteration record and consumed by the convergence algorithm, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'findingsSummary|findingsNew|Rule 11|severity counts' .opencode/skill/sk-deep-review/SKILL.md` -> 2. `bash: rg -n 'findingsSummary|findingsNew|severity_weights|p0_override|newFindingsRatio' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 3. `bash: rg -n 'findingsSummary|findingsNew|P0.*10|P1.*5|P2.*1|severity.*weight' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-research/references/state_format.md` | Rule 11 mandates the fields; the YAML dispatch constrains them; the convergence algorithm references severity_weights with P0=10.0, P1=5.0, P2=1.0; the P0 override sets newFindingsRatio >= 0.50. | Capture Rule 11, the dispatch JSONL constraint, the severity_weights block, and the P0 override rule. | PASS if findingsSummary and findingsNew with P0/P1/P2 are mandated, constrained, and consumed by convergence; FAIL if either field is missing from the contract or not used in convergence. | Check the on_missing_outputs fallback JSONL template to verify it also includes findingsSummary and findingsNew with zeroed P0/P1/P2 counts. |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md:67:| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Convergence signals; use `ANCHOR:convergence` |
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md:68:| `.opencode/skill/sk-deep-research/references/state_format.md` | Shared JSONL schema; inspect iteration record fields |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:2:title: "DRV-016 -- Composite review convergence stop behavior"
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:3:description: "Verify the three-signal composite convergence model with severity-weighted newFindingsRatio, weights 0.30/0.25/0.45, and threshold 0.60."
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:6:# DRV-016 -- Composite review convergence stop behavior
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:14:This scenario validates composite review convergence stop behavior for `DRV-016`. The objective is to verify the three-signal composite convergence model using rolling average (0.30), MAD noise floor (0.25), and dimension coverage (0.45) with a weighted stop-score threshold of 0.60.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:18:Composite convergence is the nuanced stop condition that decides whether diminishing returns in the review loop are genuine rather than just a transient pause between finding clusters. The severity-weighted newFindingsRatio is review-specific, ensuring that a single P0 finding prevents premature stop even when raw finding counts plateau.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:26:- Objective: Verify 3-signal composite convergence (rolling avg 0.30, MAD 0.25, dimension coverage 0.45) with threshold 0.60.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:27:- Real user request: Explain how the review loop decides it has found enough issues and can stop before hitting the hard cap.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:28:- Orchestrator prompt: Validate the composite convergence contract for sk-deep-review. Confirm the rolling average signal (weight 0.30, threshold 0.08), MAD noise floor signal (weight 0.25), and dimension coverage signal (weight 0.45, requires all 4 dimensions), their severity-weighted newFindingsRatio calculation, and the >0.60 weighted stop-score threshold, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:29:- Expected execution process: Inspect the convergence reference first, then the review YAML algorithm, then the quick reference and SKILL.md for user-facing summaries.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:30:- Desired user-facing outcome: The user gets an accurate explanation of the weighted convergence model, the severity weighting unique to review mode, and when convergence applies.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:31:- Expected signals: Three named signals with weights 0.30/0.25/0.45, severity-weighted newFindingsRatio, rollingStopThreshold of 0.08, a composite stop threshold above 0.60, and dimension coverage requiring all 4 review dimensions.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:32:- Pass/fail posture: PASS if the signals, weights, severity weighting, and threshold align across convergence reference, YAML, and user-facing docs; FAIL if any of those elements drift materially.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:47:| DRV-016 | Composite review convergence stop behavior | Verify 3-signal composite convergence (rolling avg 0.30, MAD 0.25, dimension coverage 0.45) with threshold 0.60 and severity-weighted newFindingsRatio. | Validate the composite convergence contract for sk-deep-review. Confirm the rolling average signal (weight 0.30, threshold 0.08), MAD noise floor signal (weight 0.25), and dimension coverage signal (weight 0.45, requires all 4 dimensions), their severity-weighted newFindingsRatio calculation, and the >0.60 weighted stop-score threshold, then return a concise operator-facing verdict. | 1. `bash: rg -n 'COMPOSITE CONVERGENCE|rolling average|MAD noise|dimension coverage|0.60|severity.weighted|newFindingsRatio|0\.30|0\.25|0\.45' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'COMPOSITE|rolling_average|MAD|dimension_coverage|convergence|stop_score|severity.*weight|newFindingsRatio' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'Convergence|Rolling Average|MAD|Dimension Coverage|0\.30|0\.25|0\.45|severity.weighted|newFindingsRatio' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md` | Three named signals with weights 0.30/0.25/0.45, severity-weighted newFindingsRatio, rollingStopThreshold of 0.08, a composite stop threshold above 0.60, and dimension coverage requiring all 4 review dimensions. | Capture the full signal table, YAML algorithm excerpt, severity weighting formula, and the user-facing explanation. | PASS if the signals, weights, severity weighting, and threshold align across convergence reference, YAML, and user-facing docs; FAIL if any of those elements drift materially. | Privilege the convergence reference for exact math and use quick reference and SKILL.md only as secondary confirmation. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:64:| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical convergence math; use `ANCHOR:shouldcontinue-algorithm` and `ANCHOR:signal-definitions` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:65:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Workflow algorithm; inspect `step_check_convergence` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:66:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Workflow algorithm; inspect `step_check_convergence` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:67:| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Convergence signal summary; use `ANCHOR:convergence` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:69:| `.opencode/skill/sk-deep-review/README.md` | Feature summary for review convergence |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md:78:- Feature file path: `04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/01--entry-points-and-modes/002-confirm-mode-checkpointed-execution.md:27:- Real user request: Run deep research, but stop so I can review the strategy and each iteration before you continue.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:2:title: "DRV-020 -- Dimension coverage convergence signal"
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:3:description: "Verify the dimension coverage signal (weight 0.45) requires all 4 dimensions plus minStabilizationPasses >= 1 before contributing to convergence."
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:6:# DRV-020 -- Dimension coverage convergence signal
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:14:This scenario validates the dimension coverage convergence signal for `DRV-020`. The objective is to verify that the dimension coverage signal (weight 0.45, the highest-weighted signal) requires all 4 review dimensions to be covered and at least one stabilization pass before it contributes to the composite stop score.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:18:Dimension coverage is the heaviest-weighted convergence signal at 0.45. If it fires prematurely -- before all dimensions are examined or before findings have stabilized -- the review could stop with an incomplete picture. The `minStabilizationPasses` requirement ensures that coverage is not just claimed but verified through at least one follow-up iteration.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:27:- Real user request: How does the review know it has looked at everything? What prevents it from stopping after only checking correctness?
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:28:- Orchestrator prompt: Validate the dimension coverage convergence signal for sk-deep-review. Confirm that the signal has weight 0.45, requires all 4 review dimensions (Correctness, Security, Traceability, Maintainability) to be covered in strategy.md, requires `minStabilizationPasses >= 1` (at least one iteration after full coverage where no new dimension-first findings appear), and only then contributes its weight to the composite stop score, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:29:- Expected execution process: Inspect the convergence reference for the dimension coverage signal definition, then the review YAML for enforcement, then the quick reference and strategy template for user-facing documentation.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:30:- Desired user-facing outcome: The user is told that the review must examine all four dimensions and verify stability before it can consider stopping, and that this check carries the most weight in the convergence decision.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:47:| DRV-020 | Dimension coverage convergence signal | Verify dimension coverage signal (weight 0.45) requires all 4 dimensions + minStabilizationPasses >= 1. | Validate the dimension coverage convergence signal for sk-deep-review. Confirm that the signal has weight 0.45, requires all 4 review dimensions (Correctness, Security, Traceability, Maintainability) to be covered, requires `minStabilizationPasses >= 1`, and only then contributes to the composite stop score, then return a concise operator-facing verdict. | 1. `bash: rg -n 'dimension.coverage|Dimension Coverage|0\.45|minStabilization|stabilization|all.*dimension|4.*dimension' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'dimension_coverage|0\.45|minStabilization|stabilization|all_dimensions|dimension.*covered' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'Dimension Coverage|0\.45|minStabilization|stabilization|Covered|D1|D2|D3|D4|Correctness|Security|Traceability|Maintainability' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Weight 0.45, all 4 dimensions required, `minStabilizationPasses=1`, signal contributes 0 until conditions are met, strategy.md "Covered" list tracks dimension coverage. | Capture the signal definition from convergence.md, the YAML enforcement, the 4-dimension list, and the strategy template tracking coverage. | PASS if the dimension coverage signal requires all 4 dimensions and stabilization before contributing; FAIL if the signal can fire with incomplete dimension coverage or without stabilization. | Privilege the convergence reference for the signal formula and use the strategy template and YAML for enforcement confirmation. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:64:| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical convergence math; dimension coverage signal definition and minStabilizationPasses |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:65:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Workflow algorithm; inspect dimension coverage check in `step_check_convergence` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:66:| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Workflow algorithm; inspect dimension coverage check in `step_check_convergence` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:67:| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Convergence signal table; use `ANCHOR:convergence` and `ANCHOR:review-dimensions` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:68:| `.opencode/skill/sk-deep-review/SKILL.md` | Review dimensions and convergence rules; use `ANCHOR:how-it-works` and `ANCHOR:rules` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md:78:- Feature file path: `04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md`
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md:27:- Real user request: What happens if the review keeps looking at the same area and stops finding new things?
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md:28:- Orchestrator prompt: Validate the stuck recovery contract for sk-deep-review. Confirm that when `stuckThreshold` consecutive iterations produce `newFindingsRatio` below `noProgressThreshold`, the loop switches focus to the least-covered review dimension, that this is reflected in strategy.md "Next Focus", and that the stuck event is logged to the JSONL state, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md:29:- Expected execution process: Inspect the convergence reference for stuck detection and recovery rules, then the review YAML algorithm for stuck handling, then the strategy template and quick reference for user-facing documentation.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md:31:- Expected signals: `stuckThreshold=2` consecutive low-progress iterations trigger recovery, `noProgressThreshold=0.05` defines low progress, recovery selects the dimension with the lowest coverage count, strategy.md "Next Focus" is updated, and a stuck event is logged to JSONL.
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md:47:| DRV-019 | Stuck recovery widens dimension focus | Verify stuck recovery switches to least-covered dimension when progress stalls. | Validate the stuck recovery contract for sk-deep-review. Confirm that when `stuckThreshold` consecutive iterations produce `newFindingsRatio` below `noProgressThreshold`, the loop switches focus to the least-covered review dimension, that this is reflected in strategy.md "Next Focus", and that the stuck event is logged to the JSONL state, then return a concise operator-facing verdict. | 1. `bash: rg -n 'stuck|STUCK|noProgress|no_progress|stuckThreshold|recovery|widen|least.covered' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'stuck|STUCK|recovery|widen|least_covered|no_progress|stuckThreshold|RECOVERY' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'stuck|recovery|dimension.*focus|noProgress|least.covered|Next Focus' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | `stuckThreshold=2`, `noProgressThreshold=0.05`, recovery selects least-covered dimension, strategy.md "Next Focus" is updated, and stuck event logged to JSONL. | Capture the stuck detection algorithm from convergence.md, the YAML recovery step, and the strategy template showing dimension-focus rotation. | PASS if stuck detection and dimension-widening recovery are enforced and documented; FAIL if stuck iterations do not trigger a focus change or the recovery mechanism is missing. | Privilege the convergence reference for stuck detection math and the YAML workflow for recovery enforcement; use strategy template as secondary evidence. |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md:64:| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical convergence math; stuck detection and recovery rules |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md:67:| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Convergence parameters including stuckThreshold; use `ANCHOR:convergence` |
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md:78:- Feature file path: `04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md`
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md:2:title: "DRV-009 -- Review iteration writes findings, JSONL, and strategy update"
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md:3:description: "Verify that each iteration writes iteration-NNN.md with P0/P1/P2 findings, appends a JSONL record, and updates the strategy."
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md:6:# DRV-009 -- Review iteration writes findings, JSONL, and strategy update
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md:14:This scenario validates review iteration writes findings, JSONL, and strategy update for `DRV-009`. The objective is to verify that each iteration writes `iteration-NNN.md` with P0/P1/P2 findings, appends a JSONL record, and updates the strategy.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md:18:The three write outputs (iteration file, JSONL record, strategy update) form the persistence contract. If any output is missing, the loop manager cannot evaluate convergence and the next iteration cannot rehydrate properly.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md:26:- Objective: Verify that each iteration writes iteration-NNN.md with P0/P1/P2 findings, appends a JSONL record, and updates the strategy.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md:28:- Orchestrator prompt: Validate the per-iteration write contract for sk-deep-review. Confirm that each iteration writes iteration-NNN.md with P0/P1/P2 classified findings, appends a JSONL record with severity counts, and updates deep-review-strategy.md, then return a concise user-facing pass/fail verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md:31:- Expected signals: The dispatch prompt requires writing iteration-NNN.md, appending JSONL, and updating strategy; the post-dispatch validation checks for all three; the quick reference checklist documents the same three outputs.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md:47:| DRV-009 | Review iteration writes findings, JSONL, and strategy update | Verify that each iteration writes iteration-NNN.md with P0/P1/P2 findings, appends a JSONL record, and updates the strategy. | Validate the per-iteration write contract for sk-deep-review. Confirm that each iteration writes `iteration-NNN.md`, appends a JSONL record with severity counts, and updates `deep-review-strategy.md`, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'iteration-NNN\|iteration-{NNN}\|iteration_pattern\|Write.*iteration' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 2. `bash: rg -n 'step_validate_iteration\|iteration_file_written\|jsonl_appended\|strategy_updated\|on_missing_outputs' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 3. `bash: rg -n 'iteration-NNN\|JSONL\|strategy\|Write.*findings\|P0.*P1.*P2' .opencode/skill/sk-deep-review/references/quick_reference.md` | The dispatch prompt requires writing iteration-NNN.md, appending JSONL, and updating strategy; the post-dispatch validation checks for all three; the quick reference checklist documents the same outputs. | Capture the dispatch constraints, the validation step required outputs, and the quick reference iteration checklist. | PASS if all sources agree on the three required outputs and their formats; FAIL if any output is undocumented or the validation step does not check for it. | Inspect the on_missing_outputs fallback to verify that error handling still appends a JSONL record even when the agent fails to complete its outputs. |
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:2:title: "DRV-003 -- Parameterized invocation max-iterations and convergence"
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:3:description: "Verify that --max-iterations (default 7) and --convergence (default 0.10) parameters are documented and flow through to the review config."
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:6:# DRV-003 -- Parameterized invocation max-iterations and convergence
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:14:This scenario validates parameterized invocation for `DRV-003`. The objective is to verify that `--max-iterations` (default 7) and `--convergence` (default 0.10) parameters are documented consistently and flow through to the review config.
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:26:- Objective: Verify that `--max-iterations` (default 7) and `--convergence` (default 0.10) parameters work and are documented consistently.
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:27:- Real user request: I want to run a longer review with 10 iterations and tighter convergence. Show me the defaults and how to override them.
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:28:- Orchestrator prompt: Validate the parameter contract for sk-deep-review. Confirm that --max-iterations (default 7) and --convergence (default 0.10) are documented consistently across the quick reference, command entrypoint, and both YAML workflows, then return a concise user-facing pass/fail verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:47:| DRV-003 | Parameterized invocation max-iterations and convergence | Verify that `--max-iterations` (default 7) and `--convergence` (default 0.10) parameters are documented consistently and flow through to the review config. | Validate the parameter contract for sk-deep-review. Confirm that `--max-iterations` (default 7) and `--convergence` (default 0.10) appear consistently across the quick reference, command entrypoint, and both YAML workflows, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'max.iterations|convergence.*0\.10|convergence_threshold|maxIterations' .opencode/skill/sk-deep-review/references/quick_reference.md` -> 2. `bash: rg -n 'max.iterations|convergence|argument-hint' .opencode/command/spec_kit/deep-review.md` -> 3. `bash: rg -n 'max_iterations|convergence_threshold|maxIterations|convergenceThreshold' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Default values of 7 and 0.10 appear consistently across all sources; the YAML writes these into `deep-review-config.json` during init. | Capture the parameter table from the quick reference, the argument-hint line, and the YAML user_inputs and config-creation steps. | PASS if all sources agree on defaults and the config init step propagates overrides; FAIL if defaults drift or the override path is broken. | Cross-reference the quick reference parameter table with the YAML `step_create_config` to verify the values flow through. |
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:77:- Feature file path: `01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md:3:description: "Verify that the loop stops when the tracked key questions are fully answered."
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md:14:This scenario validates stop when all key questions are answered for `DR-012`. The objective is to verify that the loop stops when the tracked key questions are fully answered.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md:26:- Objective: Verify that the loop stops when the tracked key questions are fully answered.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md:27:- Real user request: If all of my main questions are answered, the loop should stop instead of searching forever.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md:28:- Orchestrator prompt: Validate the all-questions-answered stop contract for sk-deep-research. Confirm that the loop stops when the tracked key questions are answered and that this condition is checked before softer convergence logic, then return a concise verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md:29:- Expected execution process: Inspect the convergence decision order, then the YAML logic, then the README and quick reference language that explains question coverage.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md:31:- Expected signals: Question completion is a named hard stop and is reflected in the convergence and usage docs.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md:32:- Pass/fail posture: PASS if all sources treat complete question coverage as a stop condition; FAIL if the loop could continue indefinitely despite full question coverage.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md:47:| DR-012 | Stop when all key questions are answered | Verify that the loop stops when the tracked key questions are fully answered. | Validate the all-questions-answered stop contract for sk-deep-research. Confirm that the loop stops when the tracked key questions are answered and that this condition is checked before softer convergence logic, then return a concise verdict. | 1. `bash: rg -n 'all questions answered|countUnanswered|coverage' .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-research/README.md` -> 2. `bash: rg -n 'remaining_questions == 0|all_questions_answered|answered_count|total_questions' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 3. `bash: rg -n 'Questions:|coverage|all questions answered' .opencode/skill/sk-deep-research/references/quick_reference.md` | Question completion is a named hard stop and is reflected in the convergence and usage docs. | Capture the hard-stop wording, the YAML remaining-question check, and the question-coverage explanation. | PASS if all sources treat complete question coverage as a stop condition; FAIL if the loop could continue indefinitely despite full question coverage. | Check the convergence pseudocode first, then verify the loop extracts `answered_count` and `total_questions` before the decision step. |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md:64:| `.opencode/skill/sk-deep-research/references/convergence.md` | Question-coverage hard stop; use `ANCHOR:shouldcontinue-algorithm` and `ANCHOR:signal-definitions` |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md:65:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Remaining-question stop check; inspect `step_read_state` and `step_check_convergence` |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md:66:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Remaining-question stop check; inspect `step_read_state` and `step_check_convergence` |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md:77:- Feature file path: `04--convergence-and-recovery/012-stop-when-all-key-questions-are-answered.md`
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md:18:P0 findings block convergence and trigger FAIL verdicts. A false-positive P0 wastes remediation effort and erodes trust. The adversarial self-check is the quality gate that prevents phantom P0 findings from reaching the final report.
.opencode/skill/sk-deep-research/references/loop_protocol.md:15:The deep research loop has 4 phases: initialization, iteration (repeated), synthesis, and save. The YAML workflow manages the lifecycle; the @deep-research agent executes individual iterations; the reducer synchronizes packet state after each iteration and lifecycle transition.
.opencode/skill/sk-deep-research/references/loop_protocol.md:48:   - `resume`: config + state + strategy all exist and agree
.opencode/skill/sk-deep-research/references/loop_protocol.md:68:   - In **confirm mode**: present the charter (topic, key questions, non-goals, stop conditions) for user review before proceeding
.opencode/skill/sk-deep-research/references/loop_protocol.md:70:8. **Resume only if config, JSONL, and strategy agree**; otherwise halt for repair instead of guessing
.opencode/skill/sk-deep-research/references/loop_protocol.md:79:1. Verify config, JSONL, and strategy all exist and agree on topic/spec folder
.opencode/skill/sk-deep-research/references/loop_protocol.md:80:2. Read JSONL, count iteration records
.opencode/skill/sk-deep-research/references/loop_protocol.md:83:5. Log resume event to JSONL: `{"type":"event","event":"resumed","fromIteration":N}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:88:- `resume`: same `sessionId`, no archive, continue from the active lineage boundary
.opencode/skill/sk-deep-research/references/loop_protocol.md:89:- `restart`: new `sessionId`, incremented `generation`, archive prior packet under `research/archive/{oldSessionId}/`
.opencode/skill/sk-deep-research/references/loop_protocol.md:90:- `fork`: new `sessionId`, preserve parent linkage, copy current state as branch baseline
.opencode/skill/sk-deep-research/references/loop_protocol.md:91:- `completed-continue`: snapshot `research/research.md` to `research/synthesis-v{generation}.md`, record `completedAt` and `reopenedAt`, then reopen as a new segment with parent linkage
.opencode/skill/sk-deep-research/references/loop_protocol.md:99:### Loop Steps (repeated until convergence)
.opencode/skill/sk-deep-research/references/loop_protocol.md:106:Run the convergence algorithm (see convergence.md):
.opencode/skill/sk-deep-research/references/loop_protocol.md:115:When the convergence algorithm returns STOP:
.opencode/skill/sk-deep-research/references/loop_protocol.md:116:1. Run quality guard checks (see convergence.md §2.4)
.opencode/skill/sk-deep-research/references/loop_protocol.md:122:5. The loop continues until BOTH convergence AND quality guards pass simultaneously
.opencode/skill/sk-deep-research/references/loop_protocol.md:131:   - Log event to JSONL: `{"type":"event","event":"paused","reason":"sentinel file detected"}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:134:     Research paused. Delete research/.deep-research-pause to resume.
.opencode/skill/sk-deep-research/references/loop_protocol.md:137:   - Do NOT exit to synthesis -- the loop is suspended, not stopped
.opencode/skill/sk-deep-research/references/loop_protocol.md:138:3. On resume (file deleted and loop restarted):
.opencode/skill/sk-deep-research/references/loop_protocol.md:139:   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:185:  1. Mark the iteration as `"status": "timeout"` in the JSONL record
.opencode/skill/sk-deep-research/references/loop_protocol.md:193:2. Verify JSONL was appended with iteration record
.opencode/skill/sk-deep-research/references/loop_protocol.md:194:3. Run reducer with `{ latestJSONLDelta, newIterationFile, priorReducedState }`
.opencode/skill/sk-deep-research/references/loop_protocol.md:195:4. Verify reducer refreshed `deep-research-strategy.md`, `findings-registry.json`, and `deep-research-dashboard.md`
.opencode/skill/sk-deep-research/references/loop_protocol.md:197:6. Extract `newInfoRatio` from JSONL record
.opencode/skill/sk-deep-research/references/loop_protocol.md:198:7. Track stuck count: skip if `status == "thought"` (no change), reset to 0 if `status == "insight"` (breakthrough counts as progress), increment if `newInfoRatio < config.convergenceThreshold`, reset otherwise
.opencode/skill/sk-deep-research/references/loop_protocol.md:202:After evaluating iteration results, generate a human-readable dashboard:
.opencode/skill/sk-deep-research/references/loop_protocol.md:204:1. Read JSONL state log, findings registry, and strategy.md
.opencode/skill/sk-deep-research/references/loop_protocol.md:205:2. Generate or regenerate `research/deep-research-dashboard.md` with the following sections:
.opencode/skill/sk-deep-research/references/loop_protocol.md:212:3. Log event: `{"type":"event","event":"dashboard_generated","iteration":N}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:213:4. The dashboard is **auto-generated only** — never manually edited
.opencode/skill/sk-deep-research/references/loop_protocol.md:214:5. The dashboard file is overwritten each iteration (not appended)
.opencode/skill/sk-deep-research/references/loop_protocol.md:217:In **confirm mode**, the dashboard is displayed to the user at each iteration approval gate. In **auto mode**, it is written silently for post-hoc review.
.opencode/skill/sk-deep-research/references/loop_protocol.md:223:After each iteration is verified (JSONL appended, iteration file written, reducer outputs refreshed):
.opencode/skill/sk-deep-research/references/loop_protocol.md:231:   git add research/deep-research-dashboard.md
.opencode/skill/sk-deep-research/references/loop_protocol.md:241:- If convergence check returns STOP: exit to synthesis
.opencode/skill/sk-deep-research/references/loop_protocol.md:254:2. **Stuck**: During stuck recovery (Step 2a of the recovery protocol in convergence.md), check ideas backlog before defaulting to generic recovery strategies. Deferred ideas often provide the best escape from stuck states
.opencode/skill/sk-deep-research/references/loop_protocol.md:255:3. **Resume**: On auto-resume, read the ideas file alongside JSONL and strategy.md to restore full context
.opencode/skill/sk-deep-research/references/loop_protocol.md:284:3. Select a targeted recovery prompt based on the classification (see convergence.md §4 for category-specific strategies)
.opencode/skill/sk-deep-research/references/loop_protocol.md:301:   - Read state files (JSONL + strategy.md)
.opencode/skill/sk-deep-research/references/loop_protocol.md:306:   - Append iteration record to JSONL
.opencode/skill/sk-deep-research/references/loop_protocol.md:310:**Note**: Direct mode iterations are logged with `"directMode": true` in their JSONL record for diagnostic tracking.
.opencode/skill/sk-deep-research/references/loop_protocol.md:341:Repeat until convergence
.opencode/skill/sk-deep-research/references/loop_protocol.md:362:### Wave JSONL Records
.opencode/skill/sk-deep-research/references/loop_protocol.md:378:- The convergence algorithm applies identically (uses all iteration records)
.opencode/skill/sk-deep-research/references/loop_protocol.md:401:   - Last N iteration summaries (from JSONL)
.opencode/skill/sk-deep-research/references/loop_protocol.md:407:5. **Verify**: Orchestrator checks iteration file and JSONL were created
.opencode/skill/sk-deep-research/references/loop_protocol.md:447:     - Consolidate all `ruledOut` entries from iteration JSONL records
.opencode/skill/sk-deep-research/references/loop_protocol.md:453:4. **If reopening a completed packet later**: snapshot this file as `research/synthesis-v{generation}.md` before any `completed-continue` flow
.opencode/skill/sk-deep-research/references/loop_protocol.md:455:6. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","totalIterations":N,"answeredCount":A,"totalQuestions":Q,"stopReason":"converged"}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:487:[EVALUATING] --> iteration complete, checking convergence
.opencode/skill/sk-deep-research/references/loop_protocol.md:491:    |-- converged or max_iterations --> [SYNTHESIZING]
.opencode/skill/sk-deep-research/references/loop_protocol.md:515:| Agent dispatch timeout | Loop | Retry once with reduced scope. If second timeout, mark iteration as "timeout" and continue |
.opencode/skill/sk-deep-research/references/loop_protocol.md:517:| State file missing | Init/Loop | If JSONL missing: re-initialize. If strategy missing: reconstruct from JSONL |
.opencode/skill/sk-deep-research/references/loop_protocol.md:518:| JSONL malformed | Loop | Skip malformed lines, reconstruct from valid entries |
.opencode/skill/sk-deep-research/references/loop_protocol.md:529:| 1 (Primary) | JSONL exists and parseable | Normal operation (with fault-tolerant parsing) |
.opencode/skill/sk-deep-research/references/loop_protocol.md:530:| 2 (Strategy rebuild) | JSONL exists, strategy.md missing | Reconstruct strategy from JSONL: extract questions, focus areas, newInfoRatio trend. Create minimal strategy.md |
.opencode/skill/sk-deep-research/references/loop_protocol.md:531:| 3 (JSONL reconstruction) | JSONL missing/corrupt, iteration files exist | Scan `research/iterations/iteration-*.md`, parse Assessment sections, reconstruct JSONL with `status: "reconstructed"` |
.opencode/skill/sk-deep-research/references/loop_protocol.md:532:| 4 (Config-only restart) | Only config.json remains | Restart from initialization phase using config parameters. Log: `{"type":"event","event":"fresh_restart","reason":"state_files_missing"}` |
.opencode/skill/sk-deep-research/references/loop_protocol.md:535:Each priority level is attempted in order. If a level fails, fall through to the next. See state_format.md for JSONL reconstruction details.
.opencode/skill/sk-deep-research/references/loop_protocol.md:548:| After each iteration | Show iteration findings and convergence status. Options: Continue, Adjust Focus, Stop |
.opencode/skill/sk-deep-research/references/loop_protocol.md:568:1. **Classify session state**: Same as research mode (fresh, resume, completed-session, invalid-state)
.opencode/skill/sk-deep-research/references/loop_protocol.md:585:7. **Initialize state log**: First JSONL line with config record including `mode: "review"`
.opencode/skill/sk-deep-research/references/loop_protocol.md:608:- Read JSONL to count iterations and extract `newFindingsRatio`, `findingsSummary`, `findingsNew`, and `traceabilityChecks`
.opencode/skill/sk-deep-research/references/loop_protocol.md:612:Run `shouldContinue_review()` (see convergence.md Section 10.3):
.opencode/skill/sk-deep-research/references/loop_protocol.md:615:- Composite convergence votes `STOP` only after:
.opencode/skill/sk-deep-research/references/loop_protocol.md:678:2. Verify JSONL was appended with review iteration fields: `dimensions`, `filesReviewed`, `findingsSummary`, `findingsNew`, and `traceabilityChecks`
.opencode/skill/sk-deep-research/references/loop_protocol.md:679:3. Verify the reducer-owned review strategy surfaces were refreshed (dimension progress, findings count, protocol status)
.opencode/skill/sk-deep-research/references/loop_protocol.md:680:4. Extract `newFindingsRatio` from JSONL record
.opencode/skill/sk-deep-research/references/loop_protocol.md:685:Before the next convergence pass, the orchestrator adjudicates every new P0/P1.
.opencode/skill/sk-deep-research/references/loop_protocol.md:700:4. Confirm or downgrade severity before the finding becomes convergence-visible.
.opencode/skill/sk-deep-research/references/loop_protocol.md:702:This adjudication step happens after iteration evaluation and before the next convergence math run.
.opencode/skill/sk-deep-research/references/loop_protocol.md:705:Generate `{spec_folder}/review/deep-review-dashboard.md` with review-specific sections:
.opencode/skill/sk-deep-research/references/loop_protocol.md:726:5. **Replay validation**: Recompute the convergence outcome from JSONL state before finalizing the report
.opencode/skill/sk-deep-research/references/loop_protocol.md:742:9. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":N,"verdict":"PASS|CONDITIONAL|FAIL","activeP0":N,"activeP1":N,"activeP2":N,"dimensionCoverage":X,"stopReason":"..." }`
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-review-iteration-reads-state-before-review.md:3:description: "Verify that each dispatched @deep-review iteration reads JSONL and strategy state before performing any review actions."
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-review-iteration-reads-state-before-review.md:14:This scenario validates review iteration reads state before review for `DRV-008`. The objective is to verify that each dispatched @deep-review iteration reads JSONL and strategy state before performing any review actions.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-review-iteration-reads-state-before-review.md:26:- Objective: Verify that each dispatched @deep-review iteration reads JSONL and strategy state before performing any review actions.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-review-iteration-reads-state-before-review.md:28:- Orchestrator prompt: Validate the read-state-first iteration contract for sk-deep-review. Confirm that the loop dispatch and the @deep-review agent both require reading JSONL and strategy state before any review actions, then return a concise operator verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-review-iteration-reads-state-before-review.md:31:- Expected signals: Loop step order begins with state reads, the quick reference checklist says the same, and the agent definition starts with JSONL plus strategy reads.
.opencode/skill/sk-deep-review/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-review-iteration-reads-state-before-review.md:47:| DRV-008 | Review iteration reads state before review | Verify that each dispatched @deep-review iteration reads JSONL and strategy state before performing any review actions. | Validate the read-state-first iteration contract for sk-deep-review. Confirm that the loop dispatch and the `@deep-review` agent both require reading JSONL and strategy state before any review actions, then return a concise operator verdict. | 1. `bash: rg -n 'step_read_state|current_iteration|next_focus|Read.*state' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 2. `bash: rg -n 'Read.*state\|Read.*strategy\|Read.*JSONL\|step 1\|1\. Read' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md` -> 3. `bash: sed -n '1,220p' .codex/agents/deep-review.toml && sed -n '1,220p' .claude/agents/deep-review.md` | Loop step order begins with state reads, the quick reference checklist says the same, and the agent definition starts with JSONL plus strategy reads. | Capture the loop step order, the quick-reference checklist, and the runtime agent step sequence. | PASS if all sources agree that state is read before review actions; FAIL if any source allows review before rehydrating state. | Check the agent sequence under the iteration checklist if the higher-level docs look ambiguous. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:3:description: Complete lifecycle specification for the autonomous deep review loop — initialization, iteration, convergence, synthesis, and save phases.
.opencode/skill/sk-deep-review/references/loop_protocol.md:64:   - `resume`: config + state + strategy all exist and agree
.opencode/skill/sk-deep-review/references/loop_protocol.md:110:8. **Initialize reducer state**: Create `{spec_folder}/review/deep-review-findings-registry.json` with empty `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, and `convergenceScore`.
.opencode/skill/sk-deep-review/references/loop_protocol.md:125:11. **Resume only if config, JSONL, strategy, and findings registry agree**; otherwise halt for repair instead of guessing.
.opencode/skill/sk-deep-review/references/loop_protocol.md:142:### Loop Steps (repeated until convergence)
.opencode/skill/sk-deep-review/references/loop_protocol.md:147:- Read `deep-review-findings-registry.json` -- extract `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, and `convergenceScore`
.opencode/skill/sk-deep-review/references/loop_protocol.md:154:| Inputs | `latestJSONLDelta`, `newIterationFile`, `priorReducedState` | The reducer replays only the newest JSONL delta plus the latest iteration artifact against the prior reduced state. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:155:| Outputs | `findingsRegistry`, `dashboardMetrics`, `strategyUpdates` | The same refresh pass updates the canonical registry, refreshes dashboard metrics, and applies strategy updates. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:156:| Metrics | `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore` | These metrics drive convergence decisions, dashboard summaries, and synthesis readiness. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:160:Run `shouldContinue_review()` (see `../sk-deep-research/references/convergence.md` Section 10.3):
.opencode/skill/sk-deep-review/references/loop_protocol.md:164:- Composite convergence votes `STOP` only after:
.opencode/skill/sk-deep-review/references/loop_protocol.md:180:**P0 override**: Any new P0 finding sets `newFindingsRatio >= 0.50`, blocking convergence regardless of composite score.
.opencode/skill/sk-deep-review/references/loop_protocol.md:188:   - Log event to JSONL: `{"type":"event","event":"paused","reason":"sentinel file detected"}`
.opencode/skill/sk-deep-review/references/loop_protocol.md:191:     Review paused. Delete review/.deep-review-pause to resume.
.opencode/skill/sk-deep-review/references/loop_protocol.md:194:   - Do NOT exit to synthesis -- the loop is suspended, not stopped
.opencode/skill/sk-deep-review/references/loop_protocol.md:195:3. On resume (file deleted and loop restarted):
.opencode/skill/sk-deep-review/references/loop_protocol.md:196:   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
.opencode/skill/sk-deep-review/references/loop_protocol.md:254:During iterations focused on the Traceability dimension, the agent executes applicable cross-reference protocols. Each protocol produces a structured result appended to the JSONL `traceabilityChecks.results[]` array.
.opencode/skill/sk-deep-review/references/loop_protocol.md:280:2. Verify JSONL was appended with review iteration fields:
.opencode/skill/sk-deep-review/references/loop_protocol.md:287:4. Extract `newFindingsRatio` from JSONL record
.opencode/skill/sk-deep-review/references/loop_protocol.md:296:Before the next convergence pass, the orchestrator adjudicates every new P0/P1 finding. This step prevents false positives from inflating severity and distorting convergence.
.opencode/skill/sk-deep-review/references/loop_protocol.md:315:4. Confirm or downgrade severity before the finding becomes convergence-visible
.opencode/skill/sk-deep-review/references/loop_protocol.md:317:This adjudication step happens after iteration evaluation and before the next convergence math run. Findings that are downgraded have their `finalSeverity` updated; the original severity is preserved in the iteration file for audit trail.
.opencode/skill/sk-deep-review/references/loop_protocol.md:321:Generate `{spec_folder}/review/deep-review-dashboard.md` with review-specific sections:
.opencode/skill/sk-deep-review/references/loop_protocol.md:341:- If convergence check returns STOP: exit to synthesis
.opencode/skill/sk-deep-review/references/loop_protocol.md:405:Recompute the convergence outcome from JSONL state before finalizing the report:
.opencode/skill/sk-deep-review/references/loop_protocol.md:408:2. Recompute `newFindingsRatio`, rolling-average votes, MAD votes, and coverage votes from stored JSONL fields only
.opencode/skill/sk-deep-review/references/loop_protocol.md:411:5. Compare the replayed decision and stop reason to the recorded synthesis event
.opencode/skill/sk-deep-review/references/loop_protocol.md:429:| 9 | Audit Appendix | Coverage, replay validation, convergence evidence |
.opencode/skill/sk-deep-review/references/loop_protocol.md:446:2. Write final JSONL entry:
.opencode/skill/sk-deep-review/references/loop_protocol.md:458:     "stopReason": "...",
.opencode/skill/sk-deep-review/references/loop_protocol.md:494:<!-- ANCHOR:auto-resume-protocol -->
.opencode/skill/sk-deep-review/references/loop_protocol.md:499:Enable review sessions to resume seamlessly from prior state when interrupted by context compaction, process termination, or intentional pause.
.opencode/skill/sk-deep-review/references/loop_protocol.md:505:1. **Verify agreement**: Confirm config, JSONL, findings registry, and strategy all exist and agree on target/spec folder
.opencode/skill/sk-deep-review/references/loop_protocol.md:506:2. **Count progress**: Read JSONL, count iteration records, determine last completed iteration
.opencode/skill/sk-deep-review/references/loop_protocol.md:509:5. **Log resume**: Append resume event to JSONL with lineage metadata:
.opencode/skill/sk-deep-review/references/loop_protocol.md:511:   {"type":"event","event":"resumed","lineageMode":"resume","sessionId":"rvw-...","generation":1,"fromIteration":N}
.opencode/skill/sk-deep-review/references/loop_protocol.md:519:| `resume` | Continue the same `sessionId` and generation. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:520:| `restart` | Archive current review state, start a new `sessionId`, increment generation, and set `parentSessionId`. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:521:| `fork` | Copy current state as baseline, create a new `sessionId`, preserve ancestry, and continue on a new branch. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:522:| `completed-continue` | Snapshot `review-report-v{generation}.md`, record `completedAt`/`reopenedAt`, and continue with amendment-only additions. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:528:| Config + JSONL + strategy all exist and agree | `resume` | Continue from last iteration + 1 |
.opencode/skill/sk-deep-review/references/loop_protocol.md:539:| 1 | JSONL exists and parseable | Normal operation |
.opencode/skill/sk-deep-review/references/loop_protocol.md:540:| 2 | JSONL exists, strategy.md missing | Reconstruct strategy from JSONL: extract dimensions, findings, coverage |
.opencode/skill/sk-deep-review/references/loop_protocol.md:541:| 3 | JSONL missing, iteration files exist | Scan `review/iterations/iteration-*.md`, reconstruct JSONL with `status: "reconstructed"` |
.opencode/skill/sk-deep-review/references/loop_protocol.md:549:<!-- /ANCHOR:auto-resume-protocol -->
.opencode/skill/sk-deep-review/references/loop_protocol.md:550:<!-- ANCHOR:pause-resume -->
.opencode/skill/sk-deep-review/references/loop_protocol.md:568:- A paused event is logged to JSONL
.opencode/skill/sk-deep-review/references/loop_protocol.md:573:Delete the sentinel file and restart the workflow:
.opencode/skill/sk-deep-review/references/loop_protocol.md:580:- The auto-resume protocol (Section 6) detects the existing state
.opencode/skill/sk-deep-review/references/loop_protocol.md:581:- A resumed event is logged to JSONL
.opencode/skill/sk-deep-review/references/loop_protocol.md:591:| After each iteration | Show iteration findings, dashboard, and convergence status. Options: Continue, Adjust Focus, Stop |
.opencode/skill/sk-deep-review/references/loop_protocol.md:597:<!-- /ANCHOR:pause-resume -->
.opencode/skill/sk-deep-review/references/loop_protocol.md:606:[EVALUATING] --> iteration complete, checking convergence
.opencode/skill/sk-deep-review/references/loop_protocol.md:610:    |-- converged + gates pass --> [SYNTHESIZING]
.opencode/skill/sk-deep-review/references/loop_protocol.md:621:    |-- sentinel removed --> [ITERATING] (resume)
.opencode/skill/sk-deep-review/references/loop_protocol.md:648:| Agent dispatch timeout | Loop | Retry once with reduced scope. If second timeout, mark iteration as "timeout" and continue |
.opencode/skill/sk-deep-review/references/loop_protocol.md:650:| JSONL malformed | Loop | Skip malformed lines, reconstruct from valid entries |
.opencode/skill/sk-deep-review/references/loop_protocol.md:664:| 3 | State corruption | Reconstruct JSONL from iteration files | 1 attempt |
.opencode/skill/sk-deep-review/references/loop_protocol.md:674:Three binary gates must pass before a STOP decision is finalized. These gates are defined in `review_mode_contract.yaml` under `qualityGates` and are evaluated after the composite convergence score exceeds the `compositeStopScore` threshold.
.opencode/skill/sk-deep-review/references/loop_protocol.md:735:| State Format | `../sk-deep-research/references/state_format.md` | JSONL, strategy, and config schemas |
.opencode/skill/sk-deep-review/references/loop_protocol.md:736:| Convergence | `../sk-deep-research/references/convergence.md` | `shouldContinue_review()` (Section 10), stuck recovery, quality guards |
.opencode/skill/sk-deep-review/references/loop_protocol.md:746:| Dashboard Template | `assets/deep_review_dashboard.md` | Template for auto-generated dashboard |
.opencode/skill/sk-deep-research/references/capability_matrix.md:26:3. Lifecycle vocabulary: `resume`, `restart`, `fork`, `completed-continue`.
.opencode/skill/sk-deep-research/references/capability_matrix.md:27:4. Reducer-owned synchronization of strategy, dashboard, findings registry, and synthesis metadata.
.opencode/skill/sk-deep-research/references/capability_matrix.md:41:| Codex | `.codex/agents/deep-research.toml` | `Read`, `Write`, `Edit`, `Bash`, `Grep`, `Glob`, `WebFetch`, memory MCP | Yes | Medium | Yes | TOML mirror must keep the same lifecycle/reducer contract as the Markdown mirrors. |
.opencode/skill/sk-deep-research/references/capability_matrix.md:59:- Letting agent mirrors own reducer outputs.
.opencode/skill/sk-deep-research/references/capability_matrix.md:68:- Active packet -> `resume`
.opencode/skill/sk-deep-research/references/capability_matrix.md:69:- Completed packet reopened -> `completed-continue`
.opencode/skill/sk-deep-research/references/capability_matrix.md:70:- Explicit user reset -> `restart`
.opencode/skill/sk-deep-research/references/capability_matrix.md:71:- Explicit branch-from-current-state -> `fork`
.opencode/skill/sk-deep-research/references/capability_matrix.md:82:- Each mirror mentions reducer-owned synchronization.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md:3:description: "Verify that max iterations is a hard stop checked before softer convergence signals."
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md:14:This scenario validates stop on max iterations for `DR-011`. The objective is to verify that max iterations is a hard stop checked before softer convergence signals.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md:18:The hard cap is the deterministic backstop that prevents runaway sessions even when the other signals remain inconclusive.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md:26:- Objective: Verify that max iterations is a hard stop checked before softer convergence signals.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md:27:- Real user request: If I set a maximum number of iterations, I want to know the loop will stop there no matter what.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md:28:- Orchestrator prompt: Validate the max-iterations stop contract for sk-deep-research. Confirm that the hard cap is checked before softer convergence logic and that the stop reason is surfaced as max_iterations_reached, then return a concise operator verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md:29:- Expected execution process: Inspect convergence pseudocode first, then the YAML decision algorithm, then the README parameter table and examples.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md:31:- Expected signals: Max iterations is checked first, the stop reason is named explicitly, and the parameter is exposed consistently in the docs.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md:32:- Pass/fail posture: PASS if max iterations is consistently treated as a first-priority hard stop; FAIL if it is demoted below softer signals or described inconsistently.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md:47:| DR-011 | Stop on max iterations | Verify that max iterations is a hard stop checked before softer convergence signals. | Validate the max-iterations stop contract for sk-deep-research. Confirm that the hard cap is checked before softer convergence logic and that the stop reason is surfaced as `max_iterations_reached`, then return a concise operator verdict. | 1. `bash: rg -n 'max iterations|Hard stop|max_iterations_reached' .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: rg -n 'iteration_count >= max_iterations|max_iterations_reached' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 3. `bash: rg -n -- '--max-iterations|Maximum loop iterations' .opencode/skill/sk-deep-research/README.md .opencode/skill/sk-deep-research/references/quick_reference.md` | Max iterations is checked first, the stop reason is named explicitly, and the parameter is exposed consistently in the docs. | Capture the convergence pseudocode, the YAML decision branch, and the user-facing parameter description. | PASS if max iterations is consistently treated as a first-priority hard stop; FAIL if it is demoted below softer signals or described inconsistently. | Resolve any ambiguity by privileging the convergence pseudocode and YAML algorithm order. |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md:64:| `.opencode/skill/sk-deep-research/references/convergence.md` | Hard-stop ordering; use `ANCHOR:shouldcontinue-algorithm` |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md:66:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Decision algorithm; inspect `step_check_convergence` |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md:67:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Decision algorithm; inspect `step_check_convergence` |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/011-stop-on-max-iterations.md:78:- Feature file path: `04--convergence-and-recovery/011-stop-on-max-iterations.md`
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md:2:title: "DRV-024 -- JSONL reconstruction from review iteration files"
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md:3:description: "Verify that the JSONL state log can be reconstructed from the review/iterations/ write-once files if the main state file is lost or corrupted."
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md:6:# DRV-024 -- JSONL reconstruction from review iteration files
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md:14:This scenario validates JSONL reconstruction from review iteration files for `DRV-024`. The objective is to verify that the JSONL state log can be reconstructed from the `review/iterations/iteration-NNN.md` write-once files if the main state file is lost or corrupted beyond recovery.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md:18:The write-once iteration files serve as a redundant record of each review cycle. If `deep-review-state.jsonl` is lost or corrupted beyond what graceful degradation can handle, the iteration files provide the raw material to reconstruct the state log and resume the review without starting over.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md:26:- Objective: Verify JSONL can be reconstructed from review/iterations/ files.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md:28:- Orchestrator prompt: Validate the JSONL reconstruction contract for sk-deep-review. Confirm that each `review/iterations/iteration-NNN.md` file contains sufficient metadata (iteration number, dimension, findings counts, newFindingsRatio) to reconstruct a valid JSONL state log, that the reconstruction path is documented, and that a reconstructed state log allows the review to resume, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md:29:- Expected execution process: Inspect the state format reference for JSONL schema and iteration file schema, then the loop protocol for reconstruction guidance, then the SKILL.md and quick reference for user-facing recovery instructions.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md:31:- Expected signals: Iteration files contain metadata matching JSONL fields, reconstruction path is documented or derivable, reconstructed JSONL allows loop resume, and iteration files are write-once (immutable after creation).
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md:47:| DRV-024 | JSONL reconstruction from review iteration files | Verify JSONL state log can be reconstructed from review/iterations/ write-once files. | Validate the JSONL reconstruction contract for sk-deep-review. Confirm that each `review/iterations/iteration-NNN.md` contains sufficient metadata to reconstruct a valid JSONL state log, that the reconstruction path is documented, and that a reconstructed state log allows the review to resume, then return a concise operator-facing verdict. | 1. `bash: rg -n 'iteration.*file|iteration-NNN|write.once|iterations/|reconstruction|reconstruct|redundant|backup' .opencode/skill/sk-deep-review/references/state_format.md .opencode/skill/sk-deep-review/references/loop_protocol.md` -> 2. `bash: rg -n 'iteration.*file|write_once|iterations/|iteration-NNN|reconstruct' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'iteration.*file|write-once|iterations/|iteration-NNN|reconstruct|recovery|backup' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md` | Iteration files contain JSONL-compatible metadata, reconstruction path documented, reconstructed JSONL allows resume, and iteration files are write-once. | Capture the iteration file schema, the JSONL field mapping, and any documented reconstruction procedure. | PASS if iteration files contain enough data for reconstruction and the path is documented; FAIL if iteration files lack critical metadata or reconstruction is not feasible. | Privilege the state format reference for both JSONL and iteration file schemas; compare field overlap to assess reconstruction feasibility. |
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md:64:| `.opencode/skill/sk-deep-review/references/state_format.md` | JSONL schema and iteration file schema; use the state log and findings registry sections |
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md:78:- Feature file path: `05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md`
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/021-pause-sentinel-halts-between-review-iterations.md:28:- Orchestrator prompt: Validate the pause sentinel contract for sk-deep-review. Confirm that `{spec_folder}/review/.deep-review-pause` is checked between review iterations, that a paused event is emitted to the JSONL state log, and that the loop halts without entering synthesis, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/021-pause-sentinel-halts-between-review-iterations.md:31:- Expected signals: The sentinel is checked before dispatch, a paused event is logged to JSONL, the loop halts rather than flowing into synthesis, and the sentinel location is `review/.deep-review-pause`.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/021-pause-sentinel-halts-between-review-iterations.md:32:- Pass/fail posture: PASS if the sentinel pauses between iterations and does not route to synthesis; FAIL if pause is undocumented or modeled as a hard stop to completion.
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/021-pause-sentinel-halts-between-review-iterations.md:47:| DRV-021 | Pause sentinel halts between review iterations | Verify that `review/.deep-review-pause` sentinel halts the review loop between iterations and logs a pause event. | Validate the pause sentinel contract for sk-deep-review. Confirm that `{spec_folder}/review/.deep-review-pause` is checked between review iterations, that a paused event is emitted to the JSONL state log, and that the loop halts without entering synthesis, then return a concise operator-facing verdict. | 1. `bash: rg -n '.deep-review-pause|paused|Delete.*pause|review/.deep-review-pause' .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md` -> 2. `bash: rg -n 'step_check_pause_sentinel|paused|halt.*true|review/.deep-review-pause|pause.*sentinel' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'pause|sentinel|review/.deep-review-pause|Pause' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/command/spec_kit/deep-review.md` | The sentinel is checked before dispatch, a paused event is logged to JSONL, the loop halts rather than flowing into synthesis, and the sentinel location is `review/.deep-review-pause`. | Capture the sentinel location, the paused-event contract, and the halt behavior from both YAML workflows and user-facing docs. | PASS if the pause sentinel halts between iterations and does not route to synthesis; FAIL if pause is undocumented or modeled as a hard stop to completion. | Use the loop protocol pause subsection as the canonical flow and verify both review YAML workflows mirror it. |
.opencode/skill/sk-deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/021-pause-sentinel-halts-between-review-iterations.md:79:- Feature file path: `05--pause-resume-and-fault-tolerance/021-pause-sentinel-halts-between-review-iterations.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/01--entry-points-and-modes/001-auto-mode-deep-research-kickoff.md:27:- Real user request: Run a deep research session on a topic without stopping for approvals and tell me what it will create.
.opencode/skill/sk-deep-research/manual_testing_playbook/01--entry-points-and-modes/001-auto-mode-deep-research-kickoff.md:31:- Expected signals: The same autonomous command appears across sources, autonomous mode is approval-free, and the workflow points to config, JSONL, strategy, iteration files, and `research/research.md`.
.opencode/skill/sk-deep-research/manual_testing_playbook/01--entry-points-and-modes/001-auto-mode-deep-research-kickoff.md:47:| DR-001 | Auto mode deep-research kickoff | Verify that autonomous mode is exposed consistently across the README, quick reference, command entrypoint, and auto YAML workflow. | Validate the autonomous entrypoint for sk-deep-research. Confirm that `/spec_kit:deep-research:auto` is documented consistently across the README, quick reference, command entrypoint, and autonomous YAML workflow, then return a concise user-facing pass/fail verdict with the expected artifact summary. | 1. `bash: rg -n '/spec_kit:deep-research:auto|research/research.md|research/iterations' .opencode/skill/sk-deep-research/README.md .opencode/skill/sk-deep-research/references/quick_reference.md` -> 2. `bash: sed -n '1,220p' .opencode/command/spec_kit/deep-research.md` -> 3. `bash: sed -n '1,260p' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | The same autonomous command appears across sources, autonomous mode is approval-free, and the workflow points to config, JSONL, strategy, iteration files, and `research/research.md`. | Capture the command examples, the mode-routing block, and the `state_paths` contract together. | PASS if all inspected sources agree on command shape, autonomous behavior, and output artifacts; FAIL if any source materially contradicts the others. | Start with the README examples, confirm the Markdown command maps `:auto` to the autonomous YAML, then inspect YAML `state_paths` if the artifact contract is unclear. |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md:14:This scenario validates the full convergence-to-guard override path for `DR-023`. The objective is to verify that when composite convergence scores above 0.60 and votes STOP, the quality guards are still evaluated, and if any guard fails, the STOP is overridden to CONTINUE.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md:18:This is the integration test for the entire quality guard system. Composite convergence and quality guards are separate subsystems that interact at a critical decision point. If the override path is broken, the loop will stop prematurely on mathematically converged but qualitatively deficient research. This scenario validates that the safety net works end-to-end.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md:27:- Real user request: Can the loop stop even though the math says it should, if the quality checks fail?
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md:28:- Orchestrator prompt: Validate the convergence-guard override path for sk-deep-research. Trace the full sequence: composite convergence votes STOP (score >0.60), then checkQualityGuards runs, then a guard violation is detected, then the STOP is overridden to CONTINUE and the loop resumes. Confirm this flow exists in convergence.md Decision Priority step 4.5, the YAML algorithm, and loop_protocol.md Step 2c.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md:29:- Expected execution process: Inspect the Decision Priority list in convergence.md first, then the YAML algorithm step_check_convergence (especially the step 6 guard override block), then loop_protocol.md Step 2c for the orchestrator-level flow, then state_format.md for the guard_violation event that proves the override happened.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md:30:- Desired user-facing outcome: The user gets a clear explanation that convergence math alone does not stop the loop — quality guards have veto power.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md:31:- Expected signals: convergence_check with decision STOP and score >0.60, followed by guard_violation event, followed by decision override to CONTINUE and loop resumption.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md:32:- Pass/fail posture: PASS if the full override path (composite STOP → guard check → guard fail → override to CONTINUE) is documented consistently across convergence.md Decision Priority step 4.5, auto.yaml step_check_convergence step 6, and loop_protocol.md Step 2c; FAIL if any part of the chain is missing or contradicts the others.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md:47:| DR-023 | Composite Convergence Passes but Guard Fails → CONTINUE | Verify the full override path: composite score >0.60 → STOP → guards check → guard fails → override to CONTINUE. | Validate the convergence-guard override path for sk-deep-research. Trace the full sequence: composite convergence votes STOP (score >0.60), then checkQualityGuards runs, then a guard violation is detected, then the STOP is overridden to CONTINUE and the loop resumes. Confirm this flow exists in convergence.md Decision Priority step 4.5, the YAML algorithm, and loop_protocol.md Step 2c. | 1. `bash: sed -n '165,175p' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: sed -n '104,139p' .opencode/skill/sk-deep-research/references/convergence.md` -> 3. `bash: sed -n '218,247p' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` -> 4. `bash: sed -n '97,107p' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 5. `bash: rg -n 'guard_violation' .opencode/skill/sk-deep-research/references/state_format.md` | convergence_check with decision STOP and score >0.60, followed by guard_violation event, followed by decision override to CONTINUE and loop resumption. | Capture the Decision Priority list showing step 4.5, the checkQualityGuards pseudocode, the YAML step 6 override block (guardResult = checkQualityGuards; if not passed, decision = CONTINUE), the loop_protocol Step 2c flow, and the guard_violation event schema. | PASS if the full override path (composite STOP → guard check → guard fail → override to CONTINUE) is documented consistently across convergence.md Decision Priority step 4.5, auto.yaml step_check_convergence step 6, and loop_protocol.md Step 2c; FAIL if any part of the chain is missing or contradicts the others. | Trace the path from convergence.md Decision Priority (canonical order) through auto.yaml (runtime implementation) to loop_protocol.md (orchestrator instructions). Discrepancies in the override direction or guard evaluation order are critical failures. |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md:64:| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical convergence math and quality guard definitions; use Decision Priority (step 4.5) and §2.4 Quality Guard Protocol |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md:66:| `.opencode/skill/sk-deep-research/references/state_format.md` | JSONL event schema; use guard_violation event definition to confirm override logging |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md:67:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; inspect `step_check_convergence` step 6 for the guardResult override block |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md:76:- Feature file path: `04--convergence-and-recovery/023-convergence-passes-guard-fails-override.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/014-stuck-recovery-widens-focus-and-continues.md:18:Recovery is what makes the loop adaptive instead of brittle when a run stops making progress on the current track.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/014-stuck-recovery-widens-focus-and-continues.md:29:- Expected execution process: Inspect the convergence recovery protocol, then the loop protocol stuck-recovery ladder, then the YAML recovery logic and ideas-backlog hooks.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/014-stuck-recovery-widens-focus-and-continues.md:47:| DR-014 | Stuck recovery widens focus and continues | Verify that stuck detection triggers a recovery path that widens focus before giving up. | Validate the stuck-recovery contract for sk-deep-research. Confirm that consecutive no-progress iterations trigger recovery, widen focus to a less-explored question, consult deferred ideas, and continue before final synthesis, then return a concise verdict. | 1. `bash: rg -n 'stuckThreshold|STUCK_RECOVERY|least-explored|recovery' .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: rg -n 'stuck_count|least_explored|RECOVERY: Widen scope|research-ideas' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 3. `bash: rg -n 'RECOVERY MODE|research-ideas|Exhausted Approaches' .codex/agents/deep-research.toml` | Stuck threshold is enforced, recovery resets the counter, the next focus widens scope, and the ideas backlog can be consulted during recovery. | Capture the stuck threshold, the widened-focus rule, and the runtime recovery mode behavior together. | PASS if recovery widens focus and continues before exiting to synthesis; FAIL if the contract jumps straight from stuck to termination without a recovery attempt. | Check the convergence reference and loop protocol together because one defines the trigger and the other defines the recovery ladder. |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/014-stuck-recovery-widens-focus-and-continues.md:64:| `.opencode/skill/sk-deep-research/references/convergence.md` | Stuck recovery protocol; use `ANCHOR:stuck-recovery-protocol` |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/014-stuck-recovery-widens-focus-and-continues.md:66:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Recovery logic; inspect `step_handle_convergence` |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/014-stuck-recovery-widens-focus-and-continues.md:67:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Recovery logic; inspect `step_handle_convergence` |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/014-stuck-recovery-widens-focus-and-continues.md:77:- Feature file path: `04--convergence-and-recovery/014-stuck-recovery-widens-focus-and-continues.md`
.opencode/skill/sk-deep-research/references/state_format.md:15:The deep research loop uses 6 primary state files plus one reducer-generated registry to maintain continuity across fresh-context iterations:
.opencode/skill/sk-deep-research/references/state_format.md:22:| `deep-research-dashboard.md` | Markdown | Auto-generated session summary | Auto-generated (read-only) |
.opencode/skill/sk-deep-research/references/state_format.md:47:  "convergenceThreshold": 0.05,
.opencode/skill/sk-deep-research/references/state_format.md:69:| convergenceThreshold | number | No | 0.05 | Stop when avg newInfoRatio below this |
.opencode/skill/sk-deep-research/references/state_format.md:75:| status | string | Yes | "initialized" | initialized, running, converged, stuck, complete, error |
.opencode/skill/sk-deep-research/references/state_format.md:78:| lineage.parentSessionId | string or null | Yes | null | Parent lineage when restarting, forking, or reopening |
.opencode/skill/sk-deep-research/references/state_format.md:79:| lineage.lineageMode | string | Yes | "new" | `new`, `resume`, `restart`, `fork`, or `completed-continue` |
.opencode/skill/sk-deep-research/references/state_format.md:81:| lineage.continuedFromRun | number or null | No | null | Run number where a resumed or reopened segment continues |
.opencode/skill/sk-deep-research/references/state_format.md:123:{"type":"config","topic":"API response time optimization","maxIterations":10,"convergenceThreshold":0.05,"createdAt":"2026-03-18T10:00:00Z","specFolder":"028-auto-deep-research"}
.opencode/skill/sk-deep-research/references/state_format.md:147:| convergenceSignals | object | No | Composite convergence signal values (see below) |
.opencode/skill/sk-deep-research/references/state_format.md:154:When the composite convergence algorithm runs (see convergence.md), signal values are recorded in the iteration record:
.opencode/skill/sk-deep-research/references/state_format.md:157:{"type":"iteration","run":5,...,"convergenceSignals":{"rollingAvg":0.12,"madScore":0.08,"entropyCoverage":0.71,"compositeStop":0.42}}
.opencode/skill/sk-deep-research/references/state_format.md:165:| compositeStop | number | Weighted stop score (stop if > 0.60) |
.opencode/skill/sk-deep-research/references/state_format.md:183:Iteration files (`research/iterations/iteration-NNN.md`) MUST include `## Ruled Out` and `## Dead Ends` sections when negative knowledge is captured. These sections feed reducer-owned strategy and registry refreshes and prevent future iterations from re-exploring eliminated paths.
.opencode/skill/sk-deep-research/references/state_format.md:193:This field aids post-hoc analysis and helps subsequent iterations calibrate expectations. It is not used in convergence computation.
.opencode/skill/sk-deep-research/references/state_format.md:203:Track labels are free-form strings used for filtering and grouping in dashboards and analysis. They are not used for orchestration or convergence decisions. Multiple iterations may share the same track label.
.opencode/skill/sk-deep-research/references/state_format.md:215:In iteration file findings sections, annotate inline: `[Finding text] (sourceStrength: primary)`. In JSONL records, source strength is tracked implicitly through the `newInfoRatio` -- tentative findings contribute less to the ratio. The convergence algorithm excludes tentative-only findings when computing `entropyCoverage`.
.opencode/skill/sk-deep-research/references/state_format.md:230:The `insight` status prevents premature convergence when a conceptually significant iteration would otherwise trigger the stuck counter. The `thought` status marks planning or meta-reasoning iterations that should not affect convergence signals.
.opencode/skill/sk-deep-research/references/state_format.md:238:| resumed | workflow | active | Resume after a prior active session | sessionId, continuedFromRun, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:239:| restarted | workflow | active | Start a new generation from prior state | sessionId, parentSessionId, generation, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:240:| forked | workflow | active | Create a new branch from current packet state | sessionId, parentSessionId, generation, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:245:| state_reconstructed | recovery | active | JSONL rebuilt from iteration files | iterationsRecovered, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:253:| synthesis_complete | workflow | active | Final synthesis finished | totalIterations, answeredCount, totalQuestions, stopReason, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:275:| `generation` | Monotonic generation number across restarts and reopenings |
.opencode/skill/sk-deep-research/references/state_format.md:282:The reducer is the synchronization pass that runs after each successful iteration and after each lifecycle transition.
.opencode/skill/sk-deep-research/references/state_format.md:285:- `latestJSONLDelta`
.opencode/skill/sk-deep-research/references/state_format.md:291:- `dashboardMetrics`
.opencode/skill/sk-deep-research/references/state_format.md:300:- identical inputs must produce byte-identical reducer outputs
.opencode/skill/sk-deep-research/references/state_format.md:326:   `"Warning: {skippedCount} of {totalLines} JSONL lines were malformed and skipped."`
.opencode/skill/sk-deep-research/references/state_format.md:329:This ensures the research loop continues even after partial state corruption. The convergence algorithm operates on valid entries only.
.opencode/skill/sk-deep-research/references/state_format.md:333:When the JSONL is missing or entirely unparseable, reconstruct state from iteration files:
.opencode/skill/sk-deep-research/references/state_format.md:342:5. **Reconstruct** JSONL records:
.opencode/skill/sk-deep-research/references/state_format.md:346:6. **Write** reconstructed JSONL file
.opencode/skill/sk-deep-research/references/state_format.md:349:**Limitations**: Reconstructed state lacks `durationMs`, exact `timestamp`, and `findingsCount`. The `status: "reconstructed"` flag distinguishes recovered records from originals. The convergence algorithm treats reconstructed records identically to complete records for signal computation.
.opencode/skill/sk-deep-research/references/state_format.md:357:- **Convergence filtering**: The convergence algorithm filters by current segment when computing signals
.opencode/skill/sk-deep-research/references/state_format.md:358:- **Cross-segment**: Full JSONL read (no segment filter) provides complete history for synthesis
.opencode/skill/sk-deep-research/references/state_format.md:461:- After convergence: Final synthesis pass to consolidate and remove redundancy
.opencode/skill/sk-deep-research/references/state_format.md:463:- Mark machine-owned sections explicitly so `completed-continue` can snapshot prior synthesis before reopening
.opencode/skill/sk-deep-research/references/state_format.md:468:<!-- ANCHOR:dashboard -->
.opencode/skill/sk-deep-research/references/state_format.md:469:## 7. DASHBOARD (research/deep-research-dashboard.md)
.opencode/skill/sk-deep-research/references/state_format.md:473:Review mode writes the equivalent dashboard to `{spec_folder}/review/deep-review-dashboard.md`.
.opencode/skill/sk-deep-research/references/state_format.md:477:- **Path**: `{spec_folder}/research/deep-research-dashboard.md`
.opencode/skill/sk-deep-research/references/state_format.md:478:- **Generated from**: JSONL state log + strategy data only
.opencode/skill/sk-deep-research/references/state_format.md:480:- **Protection**: `"deep-research-dashboard.md": "auto-generated"` in `fileProtection`
.opencode/skill/sk-deep-research/references/state_format.md:486:| Iteration Table | JSONL iteration records | Run, status, focus, newInfoRatio, findings count, duration |
.opencode/skill/sk-deep-research/references/state_format.md:488:| Convergence Trend | JSONL convergenceSignals + reducer | Rolling average, composite stop score, trajectory |
.opencode/skill/sk-deep-research/references/state_format.md:489:| Dead Ends | JSONL ruledOut + strategy | Accumulated ruled-out approaches with reasons |
.opencode/skill/sk-deep-research/references/state_format.md:498:4. If JSONL is missing or empty, write a minimal dashboard noting "No iteration data available"
.opencode/skill/sk-deep-research/references/state_format.md:499:5. The dashboard is read-only for all agents -- modifications are discarded on next refresh
.opencode/skill/sk-deep-research/references/state_format.md:508:    "deep-research-dashboard.md": "auto-generated",
.opencode/skill/sk-deep-research/references/state_format.md:518:<!-- /ANCHOR:dashboard -->
.opencode/skill/sk-deep-research/references/state_format.md:529:    deep-research-dashboard.md         # Auto-generated session summary (read-only)
.opencode/skill/sk-deep-research/references/state_format.md:546:### Review-Specific JSONL Iteration Record
.opencode/skill/sk-deep-research/references/state_format.md:622:  "stopReason": "composite_converged",
.opencode/skill/sk-deep-research/references/state_format.md:748:| 9 | Audit Appendix | Coverage, convergence replay, and supporting audit detail |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md:3:description: "Verify that convergence STOP is blocked when an answered question relies solely on a tentative source."
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md:14:This scenario validates the no-single-weak-source quality guard for `DR-022`. The objective is to verify that convergence STOP is blocked when an answered question relies solely on one source with `sourceStrength == "tentative"`.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md:18:A tentative source is unverified and low-confidence by definition. Allowing the loop to stop when a question's only evidence is tentative means the final synthesis could contain unreliable claims presented as established findings. This guard ensures that tentative-only answers are never treated as sufficient for convergence.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md:26:- Objective: Verify that convergence STOP is blocked when an answered question relies solely on a tentative source.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md:28:- Orchestrator prompt: Validate the no-single-weak-source quality guard for sk-deep-research. Confirm that when composite convergence votes STOP, the guard checks each answered question backed by exactly one source for sourceStrength == "tentative", and that a violation emits a guard_violation event with guard="single_weak_source" and overrides the decision to CONTINUE.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md:29:- Expected execution process: Inspect the Quality Guard Protocol in the convergence reference first, then the sourceStrength definitions in state_format.md, then the YAML algorithm guard check, then the loop protocol Step 2c.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md:32:- Pass/fail posture: PASS if the single_weak_source guard rule (no answered question can rely solely on one tentative source), the sourceStrength classification, its violation logging, and its STOP-override behavior are consistent across convergence.md, state_format.md, loop_protocol.md, and auto.yaml; FAIL if any of those elements drift or contradict.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md:47:| DR-022 | Quality Guard — No Single-Weak-Source | Verify that convergence STOP is blocked when an answered question relies solely on a tentative source. | Validate the no-single-weak-source quality guard for sk-deep-research. Confirm that when composite convergence votes STOP, the guard checks each answered question backed by exactly one source for sourceStrength == "tentative", and that a violation emits a guard_violation event with guard="single_weak_source" and overrides the decision to CONTINUE. | 1. `bash: sed -n '104,139p' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'single_weak_source\|tentative\|sourceStrength' .opencode/skill/sk-deep-research/references/convergence.md` -> 3. `bash: sed -n '183,195p' .opencode/skill/sk-deep-research/references/state_format.md` -> 4. `bash: rg -n 'guard_violation\|single_weak_source' .opencode/skill/sk-deep-research/references/state_format.md` -> 5. `bash: sed -n '97,107p' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 6. `bash: sed -n '236,243p' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | guard_violation event logged with guard="single_weak_source", STOP decision overridden to CONTINUE, violated question targeted for stronger sourcing in next iteration. | Capture the guard rule table row for No Single-Weak-Source, the pseudocode branch for len(sources) == 1 and sources[0].strength == "tentative", the sourceStrength classification table from state_format.md, and the YAML override logic. | PASS if the single_weak_source guard rule (no answered question can rely solely on one tentative source), the sourceStrength classification, its violation logging, and its STOP-override behavior are consistent across convergence.md, state_format.md, loop_protocol.md, and auto.yaml; FAIL if any of those elements drift or contradict. | Privilege convergence.md §2.4 for the canonical guard definition and state_format.md for the sourceStrength classification; use loop_protocol.md Step 2c and auto.yaml as secondary confirmation. |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md:64:| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical quality guard definitions; use §2.4 Quality Guard Protocol |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md:65:| `.opencode/skill/sk-deep-research/references/state_format.md` | JSONL event schema; use guard_violation event definition and sourceStrength field classification |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md:67:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; inspect `step_check_convergence` guard override logic |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md:76:- Feature file path: `04--convergence-and-recovery/022-quality-guard-no-single-weak-source.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/021-quality-guard-focus-alignment.md:3:description: "Verify that convergence STOP is blocked when answered questions don't map to original key questions."
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/021-quality-guard-focus-alignment.md:14:This scenario validates the focus alignment quality guard for `DR-021`. The objective is to verify that convergence STOP is blocked when answered questions do not map to the original key questions established during initialization.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/021-quality-guard-focus-alignment.md:26:- Objective: Verify that convergence STOP is blocked when answered questions don't map to original key questions.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/021-quality-guard-focus-alignment.md:27:- Real user request: What stops the loop from answering the wrong questions and calling it done?
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/021-quality-guard-focus-alignment.md:28:- Orchestrator prompt: Validate the focus alignment quality guard for sk-deep-research. Confirm that when composite convergence votes STOP, the guard compares answered questions against the original key questions from initialization, and that a mismatch emits a guard_violation event with guard="focus_alignment" and overrides the decision to CONTINUE.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/021-quality-guard-focus-alignment.md:29:- Expected execution process: Inspect the Quality Guard Protocol in the convergence reference first, then the YAML algorithm guard check, then the loop protocol Step 2c, then the state format guard_violation event schema.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/021-quality-guard-focus-alignment.md:30:- Desired user-facing outcome: The user gets an accurate explanation of how the loop detects and blocks convergence on off-topic answers.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/021-quality-guard-focus-alignment.md:32:- Pass/fail posture: PASS if the focus_alignment guard rule (answered questions must map to originalKeyQuestions), its violation logging, and its STOP-override behavior are consistent across convergence.md, loop_protocol.md, auto.yaml, and state_format.md; FAIL if any of those elements drift or contradict.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/021-quality-guard-focus-alignment.md:47:| DR-021 | Quality Guard — Focus Alignment | Verify that convergence STOP is blocked when answered questions don't map to original key questions. | Validate the focus alignment quality guard for sk-deep-research. Confirm that when composite convergence votes STOP, the guard compares answered questions against the original key questions from initialization, and that a mismatch emits a guard_violation event with guard="focus_alignment" and overrides the decision to CONTINUE. | 1. `bash: sed -n '104,139p' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'focus_alignment\|originalKeyQuestions\|guard_violation' .opencode/skill/sk-deep-research/references/convergence.md` -> 3. `bash: sed -n '97,107p' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 4. `bash: rg -n 'guard_violation\|focus_alignment' .opencode/skill/sk-deep-research/references/state_format.md` -> 5. `bash: sed -n '236,243p' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | guard_violation event logged with guard="focus_alignment", STOP decision overridden to CONTINUE, misaligned question flagged in violation detail. | Capture the guard rule table row for Focus Alignment, the pseudocode branch for q not in strategy.originalKeyQuestions, the YAML override logic, and the state_format supported guard values list. | PASS if the focus_alignment guard rule (answered questions must map to originalKeyQuestions), its violation logging, and its STOP-override behavior are consistent across convergence.md, loop_protocol.md, auto.yaml, and state_format.md; FAIL if any of those elements drift or contradict. | Privilege convergence.md §2.4 for the canonical guard definition; use loop_protocol.md Step 2c and auto.yaml step_check_convergence as secondary confirmation of the override flow. |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/021-quality-guard-focus-alignment.md:64:| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical quality guard definitions; use §2.4 Quality Guard Protocol |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/021-quality-guard-focus-alignment.md:66:| `.opencode/skill/sk-deep-research/references/state_format.md` | JSONL event schema; use guard_violation event definition and supported guard values |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/021-quality-guard-focus-alignment.md:67:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; inspect `step_check_convergence` guard override logic |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/021-quality-guard-focus-alignment.md:76:- Feature file path: `04--convergence-and-recovery/021-quality-guard-focus-alignment.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:2:title: "DR-030 -- Thought status handling in convergence"
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:3:description: "Verify that thought iterations are handled correctly in convergence and do not count as stuck or toward rolling average."
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:6:# DR-030 -- Thought status handling in convergence
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:14:This scenario validates thought status convergence handling for `DR-030`. The objective is to verify that "thought" iterations (analytical-only, no evidence gathering) are handled correctly in convergence: they do not count as stuck and do not count toward the rolling average.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:18:A planning or meta-reasoning iteration produces no new evidence by design. If convergence treated it like a normal iteration with zero findings, the rolling average would drop and stuck detection could fire incorrectly, penalizing the agent for deliberate synthesis work.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:26:- Objective: Verify that "thought" iterations are handled correctly in convergence.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:27:- Real user request: If the agent spends an iteration just thinking and synthesizing without searching, how does convergence count it?
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:28:- Orchestrator prompt: Validate the thought-status convergence contract for sk-deep-research. Confirm that state_format.md defines "thought" as a valid iteration status marking analytical-only iterations, that convergence.md documents how thought iterations are excluded from stuck counting and the rolling average, and that SKILL.md lists it in the status taxonomy, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:29:- Expected execution process: Inspect the state format reference for the thought status definition, then the convergence reference for its handling in the shouldContinue algorithm, then the SKILL.md for the iteration status summary.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:31:- Expected signals: Iteration with status="thought", convergence treats it appropriately (does not count as stuck, does not count toward rolling average).
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:32:- Pass/fail posture: PASS if state_format.md defines "thought" status AND convergence.md confirms thought iterations are excluded from stuck counting and rolling average; FAIL if thought iterations affect convergence signals or the documentation is contradictory.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:47:| DR-030 | Thought status handling in convergence | Verify that thought iterations are handled correctly in convergence and do not count as stuck or toward rolling average. | Validate the thought-status convergence contract for sk-deep-research. Confirm that state_format.md defines "thought" as a valid iteration status marking analytical-only iterations, that convergence.md documents how thought iterations are excluded from stuck counting and the rolling average, and that SKILL.md lists it in the status taxonomy, then return a concise operator-facing verdict. | 1. `bash: rg -n 'thought' .opencode/skill/sk-deep-research/references/state_format.md` -> 2. `bash: rg -n 'thought\|rolling.average\|stuckCount' .opencode/skill/sk-deep-research/references/convergence.md` -> 3. `bash: rg -n 'thought\|insight\|stuck' .opencode/skill/sk-deep-research/SKILL.md` -> 4. `bash: rg -n 'stuck_count\|thought' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Iteration with status="thought", convergence treats it appropriately (does not count as stuck, does not count toward rolling average). | Capture the state_format.md thought status definition, the convergence.md handling rules for thought iterations, and the SKILL.md iteration status taxonomy. | PASS if state_format.md defines "thought" status AND convergence.md confirms thought iterations are excluded from stuck counting and rolling average; FAIL if thought iterations affect convergence signals or the documentation is contradictory. | Privilege state_format.md for the status taxonomy and convergence.md for the algorithm; use SKILL.md and YAML only as secondary confirmation. |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:64:| `.opencode/skill/sk-deep-research/references/state_format.md` | Canonical JSONL schema; thought status definition and its convergence-neutral semantics |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:65:| `.opencode/skill/sk-deep-research/references/convergence.md` | Convergence math; rolling average and stuckCount computation with thought exclusion |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/030-thought-status-convergence-handling.md:76:- Feature file path: `04--convergence-and-recovery/030-thought-status-convergence-handling.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:2:title: "DR-003 -- Parameterized invocation with --max-iterations and --convergence"
.opencode/skill/sk-deep-research/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:3:description: "Verify that the command binds topic, spec folder, execution mode, max iterations, and convergence threshold before the YAML workflow starts."
.opencode/skill/sk-deep-research/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:6:# DR-003 -- Parameterized invocation with --max-iterations and --convergence
.opencode/skill/sk-deep-research/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:14:This scenario validates parameterized invocation with --max-iterations and --convergence for `DR-003`. The objective is to verify that the command binds topic, spec folder, execution mode, max iterations, and convergence threshold before the YAML workflow starts.
.opencode/skill/sk-deep-research/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:26:- Objective: Verify that the command binds topic, spec folder, execution mode, max iterations, and convergence threshold before the YAML workflow starts.
.opencode/skill/sk-deep-research/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:31:- Expected signals: The command explicitly names topic, spec folder, execution mode, max iterations, and convergence threshold; YAML preflight verifies them before file writes.
.opencode/skill/sk-deep-research/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:47:| DR-003 | Parameterized invocation with --max-iterations and --convergence | Verify that the command binds topic, spec folder, execution mode, max iterations, and convergence threshold before the YAML workflow starts. | Validate the setup-binding contract for sk-deep-research. Confirm that the command entrypoint gathers required values before loading YAML and that the YAML preflight rejects missing bindings or invalid spec-folder scope, then return a concise pass/fail verdict. | 1. `bash: sed -n '1,220p' .opencode/command/spec_kit/deep-research.md` -> 2. `bash: rg -n 'step_preflight_contract|required_values_present|spec_folder_is_within|max_iterations|convergence_threshold' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 3. `bash: sed -n '1,180p' .opencode/skill/sk-deep-research/references/state_format.md` | The command explicitly names topic, spec folder, execution mode, max iterations, and convergence threshold; YAML preflight verifies them before file writes. | Capture the setup prompt, both preflight guards, and the config schema fields together. | PASS if setup requirements and YAML preflight align on the required bindings and spec-folder scope; FAIL if one surface allows missing bindings the other forbids. | Compare both YAML files, not just one, and verify the config schema still names the same parameter fields. |
.opencode/skill/sk-deep-research/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md:76:- Feature file path: `01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:2:title: "DR-013 -- Composite convergence stop behavior"
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:3:description: "Verify the three-signal weighted stop model and its graceful degradation rules."
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:6:# DR-013 -- Composite convergence stop behavior
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:14:This scenario validates composite convergence stop behavior for `DR-013`. The objective is to verify the three-signal weighted stop model and its graceful degradation rules.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:18:Composite convergence is the nuanced stop condition that decides whether diminishing returns are real rather than just transient.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:26:- Objective: Verify the three-signal weighted stop model and its graceful degradation rules.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:27:- Real user request: Explain how the loop decides it has probably converged when it has not hit the hard cap yet.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:28:- Orchestrator prompt: Validate the composite-convergence contract for sk-deep-research. Confirm the rolling average, MAD noise floor, and question-entropy signals, their weights, and the >0.60 weighted stop-score threshold, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:29:- Expected execution process: Inspect the convergence reference first, then the YAML algorithm, then the quick reference visualization and README feature summary.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:30:- Desired user-facing outcome: The user gets an accurate explanation of the weighted convergence model and when it applies.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:31:- Expected signals: Three named signals, weights of 0.30/0.35/0.35, graceful degradation with fewer iterations, and a stop threshold above 0.60.
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:47:| DR-013 | Composite convergence stop behavior | Verify the three-signal weighted stop model and its graceful degradation rules. | Validate the composite-convergence contract for sk-deep-research. Confirm the rolling average, MAD noise floor, and question-entropy signals, their weights, and the >0.60 weighted stop-score threshold, then return a concise operator-facing verdict. | 1. `bash: sed -n '1,260p' .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'COMPOSITE CONVERGENCE|rolling average|MAD noise|entropy|0.60' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 3. `bash: rg -n 'Convergence Detection|Composite:|Signals:' .opencode/skill/sk-deep-research/README.md .opencode/skill/sk-deep-research/references/quick_reference.md` | Three named signals, weights of 0.30/0.35/0.35, graceful degradation with fewer iterations, and a stop threshold above 0.60. | Capture the full signal table, YAML algorithm excerpt, and the user-facing explanation or visualization. | PASS if the signals, weights, and threshold align across reference, YAML, and user-facing docs; FAIL if any of those elements drift materially. | Privilege the convergence reference for exact math and use README or quick reference only as secondary confirmation. |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:64:| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical convergence math; use `ANCHOR:shouldcontinue-algorithm` and `ANCHOR:signal-definitions` |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:65:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; inspect `step_check_convergence` |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:66:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Workflow algorithm; inspect `step_check_convergence` |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:67:| `.opencode/skill/sk-deep-research/README.md` | Feature summary for convergence; use `ANCHOR:features` |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:68:| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Progress visualization and decision tree; use `ANCHOR:convergence-decision-tree` and `ANCHOR:progress-visualization` |
.opencode/skill/sk-deep-research/manual_testing_playbook/04--convergence-and-recovery/013-composite-convergence-stop-behavior.md:77:- Feature file path: `04--convergence-and-recovery/013-composite-convergence-stop-behavior.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/026-ruled-out-directions-in-synthesis.md:14:This scenario validates that ruled-out directions are properly synthesized for `DR-026`. The objective is to verify that `ruledOut` data from iteration JSONL records and `## Dead Ends` sections from iteration files are consolidated into a mandatory "Eliminated Alternatives" section in `research/research.md`.
.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/026-ruled-out-directions-in-synthesis.md:28:- Orchestrator prompt: Validate the ruled-out directions synthesis contract for sk-deep-research. Confirm that the synthesis phase consolidates `ruledOut` entries from JSONL records and `## Dead Ends` sections from iteration files into a mandatory "Eliminated Alternatives" section in research/research.md. Verify that strategy.md also tracks ruled-out directions per iteration. Return a concise operator-facing verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/026-ruled-out-directions-in-synthesis.md:32:- Pass/fail posture: PASS if the synthesis phase produces an "Eliminated Alternatives" section in research/research.md consolidating all ruledOut and Dead Ends data, and the upstream sources (JSONL, iteration files, strategy.md) consistently feed this section; FAIL if the section is missing, data is not consolidated, or upstream sources lack the required fields.
.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/026-ruled-out-directions-in-synthesis.md:47:| DR-026 | Ruled-out directions synthesized | Verify that iteration ruledOut data is consolidated into Eliminated Alternatives in research/research.md. | Validate the ruled-out directions synthesis contract for sk-deep-research. Confirm that the synthesis phase consolidates `ruledOut` entries from JSONL records and `## Dead Ends` sections from iteration files into a mandatory "Eliminated Alternatives" section in research/research.md. Verify that strategy.md also tracks ruled-out directions per iteration. Return a concise operator-facing verdict. | 1. `bash: rg -n 'Eliminated Alternatives\|ruledOut\|Dead Ends\|negative knowledge' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: rg -n 'ruledOut\|Ruled Out\|Dead Ends' .opencode/skill/sk-deep-research/references/state_format.md` -> 3. `bash: sed -n '/ANCHOR:ruled-out-directions/,/\/ANCHOR:ruled-out-directions/p' .opencode/skill/sk-deep-research/assets/deep_research_strategy.md` -> 4. `bash: rg -n 'rule.*10\|ruled-out' .opencode/skill/sk-deep-research/SKILL.md` | research/research.md has mandatory "Eliminated Alternatives" section as a table; iteration files have `## Ruled Out` and `## Dead Ends` sections; strategy.md has `## 10. Ruled Out Directions` section; JSONL records include `ruledOut` array; ALWAYS rule 10 mandates per-iteration documentation of ruled-out directions. | Capture the loop protocol synthesis rules (Step 3 with Eliminated Alternatives), the state format ruledOut array schema and iteration file requirements, the strategy template Ruled Out Directions section, and SKILL.md ALWAYS rule 10. | PASS if the synthesis phase produces an "Eliminated Alternatives" section in research/research.md consolidating all ruledOut and Dead Ends data, and upstream sources consistently feed this section; FAIL if the section is missing, data is not consolidated, or upstream sources lack the required fields. | Privilege the loop protocol synthesis rules for the canonical consolidation contract; use state_format.md for the ruledOut schema and strategy template for the per-iteration tracking surface. |
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md:2:title: "DR-017 -- Malformed JSONL lines are skipped with defaults"
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md:3:description: "Verify that malformed JSONL lines are skipped and missing fields are defaulted instead of crashing the loop."
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md:6:# DR-017 -- Malformed JSONL lines are skipped with defaults
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md:14:This scenario validates malformed jsonl lines are skipped with defaults for `DR-017`. The objective is to verify that malformed JSONL lines are skipped and missing fields are defaulted instead of crashing the loop.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md:26:- Objective: Verify that malformed JSONL lines are skipped and missing fields are defaulted instead of crashing the loop.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md:27:- Real user request: If one line in the JSONL is broken, I want to know whether the whole loop dies or keeps going safely.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md:28:- Orchestrator prompt: Validate the JSONL fault-tolerance contract for sk-deep-research. Confirm that malformed lines are skipped, missing fields are defaulted, and a warning is emitted instead of crashing the loop, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md:29:- Expected execution process: Inspect the state-format fault-tolerance rules, then the convergence reader guidance, then the README troubleshooting notes.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md:30:- Desired user-facing outcome: The user is told that malformed JSONL lines are handled defensively and do not automatically kill the loop.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md:31:- Expected signals: Per-line parse protection exists, defaults are specified, skipped-line warnings are documented, and convergence operates on valid entries only.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md:47:| DR-017 | Malformed JSONL lines are skipped with defaults | Verify that malformed JSONL lines are skipped and missing fields are defaulted instead of crashing the loop. | Validate the JSONL fault-tolerance contract for sk-deep-research. Confirm that malformed lines are skipped, missing fields are defaulted, and a warning is emitted instead of crashing the loop, then return a concise operator-facing verdict. | 1. `bash: rg -n 'Fault Tolerance|skip malformed|defaults|Warning:' .opencode/skill/sk-deep-research/references/state_format.md .opencode/skill/sk-deep-research/references/convergence.md` -> 2. `bash: rg -n 'missing_newInfoRatio|malformed|skipped' .opencode/skill/sk-deep-research/references/state_format.md` -> 3. `bash: rg -n 'State file corrupt|Validate JSONL' .opencode/skill/sk-deep-research/README.md` | Per-line parse protection exists, defaults are specified, skipped-line warnings are documented, and convergence operates on valid entries only. | Capture the defensive parse rules, the default values, and the troubleshooting guidance. | PASS if malformed lines are skipped with documented defaults and warnings; FAIL if the contract implies full-loop failure for any parse error. | Use the state-format reference as the primary source and the convergence reference as secondary confirmation of valid-entry-only behavior. |
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md:65:| `.opencode/skill/sk-deep-research/references/convergence.md` | Defensive JSONL reading; use `ANCHOR:signal-definitions` |
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md:75:- Feature file path: `05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/027-research-charter-validation.md:18:Without explicit non-goals and stop conditions, research sessions risk unbounded scope creep or premature termination. The charter validation step at initialization ensures that boundaries are defined upfront, even if initially empty, providing a surface for user review in confirm mode and a structural guarantee in auto mode.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/027-research-charter-validation.md:31:- Expected signals: strategy.md has a "## 4. Non-Goals" section (may be empty but must exist); strategy.md has a "## 5. Stop Conditions" section (may be empty but must exist); if either section is missing, it is appended as an empty placeholder; in confirm mode, the charter (topic, key questions, non-goals, stop conditions) is presented for user review before proceeding.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/027-research-charter-validation.md:47:| DR-027 | Research charter validated at init | Verify strategy.md contains Non-Goals and Stop Conditions sections after initialization. | Validate the research charter validation contract for sk-deep-research. Confirm that initialization Step 5a verifies the presence of "Non-Goals" and "Stop Conditions" sections in strategy.md, appends empty placeholders if missing, and presents the charter for user review in confirm mode. Return a concise operator-facing verdict. | 1. `bash: rg -n 'Step 5a\|Validate Research Charter\|Non-Goals\|Stop Conditions\|charter' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: sed -n '/ANCHOR:non-goals/,/\/ANCHOR:stop-conditions/p' .opencode/skill/sk-deep-research/assets/deep_research_strategy.md` -> 3. `bash: rg -n 'Non-Goals\|Stop Conditions\|charter' .opencode/skill/sk-deep-research/README.md` | strategy.md has "## 4. Non-Goals" section (may be empty but must exist); strategy.md has "## 5. Stop Conditions" section (may be empty but must exist); missing sections are appended as empty placeholders; confirm mode presents the charter for user review before proceeding; auto mode accepts the charter automatically. | Capture the loop protocol Step 5a excerpt, the strategy template sections 4 and 5 with their ANCHOR tags, and any README feature summary referencing charter validation. | PASS if initialization consistently produces strategy.md with both sections present and confirm mode surfaces the charter for review; FAIL if either section is absent after initialization, or confirm mode skips the charter review gate. | Privilege the loop protocol Step 5a for the canonical charter validation contract; use the strategy template as the structural reference for section numbering and anchor names. |
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/027-research-charter-validation.md:65:| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Strategy template; inspect `ANCHOR:non-goals` (section 4) and `ANCHOR:stop-conditions` (section 5) |
.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md:28:- Orchestrator prompt: Validate the finalization and guardrail contract for sk-deep-research. Confirm that synthesis produces canonical research/research.md, memory save uses generate-context.js, the runtime agent remains LEAF-only, and reference-only features such as wave orchestration, checkpoint commits, :restart segments, and alternate CLI dispatch are documented as non-live behavior rather than executable guarantees, then return a concise operator verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md:47:| DR-019 | Final synthesis plus memory save and guardrail behavior | Verify final synthesis, supported memory save, LEAF-only agent behavior, and the boundary between live and reference-only features. | Validate the finalization and guardrail contract for sk-deep-research. Confirm that synthesis produces canonical `research/research.md`, memory save uses `generate-context.js`, the runtime agent remains LEAF-only, and reference-only features such as wave orchestration, checkpoint commits, `:restart` segments, and alternate CLI dispatch are documented as non-live behavior rather than executable guarantees, then return a concise operator verdict. | 1. `bash: rg -n 'generate-context.js|synthesis_complete|research/research.md|memory' .opencode/command/spec_kit/deep-research.md .opencode/skill/sk-deep-research/SKILL.md .opencode/skill/sk-deep-research/README.md` -> 2. `bash: rg -n 'LEAF-only|Task tool|NEVER create sub-tasks|reference-only|Wave orchestration|Checkpoint Commit|Direct Mode Fallback|Segment Model' .codex/agents/deep-research.toml .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/references/state_format.md` -> 3. `bash: rg -n 'phase_synthesis|phase_save|generate-context.js|synthesis_complete|wave|segment|direct_mode' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml .opencode/skill/sk-deep-research/references/quick_reference.md` | Synthesis produces canonical `research/research.md`, memory save calls `generate-context.js`, the Codex runtime agent forbids nested delegation, and wave orchestration, checkpoint commits, segment transitions, and alternate CLI dispatch remain reference-only. | Capture the final synthesis/save contract, the runtime LEAF-only prohibition, and the reference-only feature markings in one evidence set. | PASS if finalization and memory save use the supported contract, LEAF-only behavior remains enforced, and reference-only features are clearly documented as non-live; FAIL if any non-live feature is presented as a shipped executable guarantee. | Privilege the Codex runtime agent and skill rules for LEAF-only behavior, and the loop/state references for reference-only boundaries. |
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/015-pause-sentinel-halts-between-iterations.md:32:- Pass/fail posture: PASS if the sentinel pauses between iterations and does not route to synthesis; FAIL if pause is undocumented or modeled as a hard stop to completion.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/015-pause-sentinel-halts-between-iterations.md:47:| DR-015 | Pause sentinel halts between iterations | Verify that the pause sentinel halts the loop between iterations and logs a pause event. | Validate the pause-sentinel contract for sk-deep-research. Confirm that `research/.deep-research-pause` is checked between research iterations and `{spec_folder}/review/.deep-research-pause` is checked between review iterations, both emit paused events, and both halt the loop without entering synthesis, then return a concise operator-facing verdict. | 1. `bash: rg -n '.deep-research-pause|paused|Delete .*\\.deep-research-pause|review/.deep-research-pause' .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/README.md` -> 2. `bash: rg -n 'step_check_pause_sentinel|paused|halt: true|review/.deep-research-pause|research/.deep-research-pause' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml` -> 3. `bash: rg -n 'pause|sentinel|review/.deep-research-pause' .opencode/skill/sk-deep-research/references/quick_reference.md .opencode/skill/sk-deep-research/SKILL.md` | The sentinel is checked before dispatch, a paused event is logged, and the loop halts rather than flowing into synthesis in both research and review mode. | Capture both sentinel locations, the paused-event contract, and the halt behavior for research and review flows. | PASS if both pause sentinels pause between iterations and do not route to synthesis; FAIL if either path is undocumented or modeled as a hard stop to completion. | Use the loop protocol pause subsection as the canonical flow and verify both research and review YAMLs mirror it exactly. |
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/015-pause-sentinel-halts-between-iterations.md:77:- Feature file path: `05--pause-resume-and-fault-tolerance/015-pause-sentinel-halts-between-iterations.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md:14:This scenario validates resume classification from valid prior state for `DR-005`. The objective is to verify that the workflow classifies an existing valid scratch state as resumable before writing new files.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md:27:- Real user request: I already have a deep-research scratch folder. Tell me whether the workflow will resume it or start over.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md:28:- Orchestrator prompt: Validate the resume-classification contract for sk-deep-research. Confirm that config, JSONL, and strategy are inspected before new files are written and that a valid prior state skips re-initialization, then return a concise pass/fail verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md:29:- Expected execution process: Inspect the loop protocol resume rules, then the YAML session-classification branches, then the README auto-resume wording.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md:30:- Desired user-facing outcome: The user gets a trustworthy explanation of when a session resumes instead of restarting.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md:31:- Expected signals: A four-state classification model exists, resume skips init writes, and completed sessions route differently from active resumes.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md:32:- Pass/fail posture: PASS if protocol, YAML, and README align on classification and resume semantics; FAIL if resume behavior is underdefined or contradictory.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md:47:| DR-005 | Resume classification from valid prior state | Verify that the workflow classifies an existing valid scratch state as resumable before writing new files. | Validate the resume-classification contract for sk-deep-research. Confirm that config, JSONL, and strategy are inspected before new files are written and that a valid prior state skips re-initialization, then return a concise pass/fail verdict. | 1. `bash: rg -n 'Auto-Resume Protocol|resume|completed-session|invalid-state' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: rg -n 'step_classify_session|on_resume|on_completed_session|on_invalid_state' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 3. `bash: rg -n 'Auto-resume|resume' .opencode/skill/sk-deep-research/README.md` | A four-state classification model exists, resume skips init writes, and completed sessions route differently from active resumes. | Capture the classification states, the YAML branch names, and the user-facing auto-resume wording. | PASS if protocol, YAML, and README align on classification and resume semantics; FAIL if resume behavior is underdefined or contradictory. | Verify completed sessions route differently from active resumes and that both YAML files use the same classification model. |
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md:67:| `.opencode/skill/sk-deep-research/README.md` | User-facing auto-resume claim; use `ANCHOR:features` and `ANCHOR:faq` |
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md:76:- Feature file path: `02--initialization-and-state-setup/005-resume-classification-from-valid-prior-state.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-initialization-creates-canonical-state-files.md:3:description: "Verify that a fresh session creates the canonical config, JSONL, and strategy files from the shipped assets."
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-initialization-creates-canonical-state-files.md:14:This scenario validates fresh initialization creates canonical state files for `DR-004`. The objective is to verify that a fresh session creates the canonical config, JSONL, and strategy files from the shipped assets.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-initialization-creates-canonical-state-files.md:26:- Objective: Verify that a fresh session creates the canonical config, JSONL, and strategy files from the shipped assets.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-initialization-creates-canonical-state-files.md:31:- Expected signals: The scratch directory is created, config and strategy come from the shipped assets, and the JSONL begins with a config record.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/004-fresh-initialization-creates-canonical-state-files.md:47:| DR-004 | Fresh initialization creates canonical state files | Verify that a fresh session creates the canonical config, JSONL, and strategy files from the shipped assets. | Validate the fresh-initialization contract for sk-deep-research. Confirm that initialization creates `deep-research-config.json`, `deep-research-state.jsonl`, and `deep-research-strategy.md` from the live templates, then return a concise user-facing pass/fail verdict. | 1. `bash: sed -n '1,220p' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: rg -n 'step_create_directories|step_create_config|step_create_state_log|step_create_strategy' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 3. `bash: sed -n '1,220p' .opencode/skill/sk-deep-research/assets/deep_research_config.json && sed -n '1,220p' .opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | The scratch directory is created, config and strategy come from the shipped assets, and the JSONL begins with a config record. | Capture the initialization outputs, the explicit create steps, and the live template files in one evidence bundle. | PASS if protocol, YAML, and asset templates agree on the initial scratch artifacts and their roles; FAIL if the artifact list or template sources drift. | Check both YAML variants, verify the JSONL init step writes a config record, and confirm the assets live under `assets/`. |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:3:description: "Verify dashboard.md is auto-generated after iteration evaluation with correct content."
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:14:This scenario validates dashboard generation after iteration evaluation for `DR-024`. The objective is to verify that `research/deep-research-dashboard.md` is auto-generated after each iteration with the correct content sections.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:18:The dashboard is the primary observability surface for long-running research sessions. If it is missing, stale, or incomplete, operators and users lose visibility into progress, convergence trends, and dead ends.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:26:- Objective: Verify dashboard.md is auto-generated after iteration evaluation with correct content.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:28:- Orchestrator prompt: Validate the dashboard generation contract for sk-deep-research. Confirm the dashboard file is created at the correct path, contains the required sections (iteration table, question status, trend, dead ends, next focus, active risks), and is regenerated after each iteration. Return a concise operator-facing verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:29:- Expected execution process: Inspect the loop protocol for Step 4a, then the state format dashboard section, then the dashboard template asset, then the YAML workflow step.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:30:- Desired user-facing outcome: The user can open `research/deep-research-dashboard.md` after any iteration and see an up-to-date summary of the research session.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:31:- Expected signals: `research/deep-research-dashboard.md` exists after at least one iteration completes, contains an iteration table, question status with X/Y answered, trend with last 3 newInfoRatio values, dead ends consolidated from ruledOut data, next focus from strategy.md, and active risks.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:32:- Pass/fail posture: PASS if the dashboard file exists after iteration evaluation, contains all required sections, and is regenerated (not appended) each iteration; FAIL if the file is missing, sections are absent, or stale data persists from a prior iteration.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:47:| DR-024 | Dashboard generation after iteration | Verify dashboard.md is auto-generated after iteration evaluation with correct content. | Validate the dashboard generation contract for sk-deep-research. Confirm the dashboard file is created at the correct path, contains the required sections (iteration table, question status, trend, dead ends, next focus, active risks), and is regenerated after each iteration. Return a concise operator-facing verdict. | 1. `bash: rg -n 'Step 4a\|Generate Dashboard\|dashboard_generated' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: sed -n '/ANCHOR:dashboard/,/\/ANCHOR:dashboard/p' .opencode/skill/sk-deep-research/references/state_format.md` -> 3. `bash: cat .opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` -> 4. `bash: rg -n 'step_reduce_state\|step_generate_dashboard\|reduce-state.cjs' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 5. `bash: rg -n 'renderDashboard\|dashboardPath' .opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | `research/deep-research-dashboard.md` exists after iteration evaluation; contains iteration table, question status (X/Y answered), trend (last 3 ratios with direction), dead ends (from ruledOut), next focus (from strategy.md), and active risks; file is overwritten (not appended) each iteration; dashboard generation is reducer-owned and idempotent. | Capture the loop protocol Step 4a excerpt, the state format dashboard section, the template content, the YAML step definitions for both reducer and dashboard, and the reducer script's `renderDashboard` function. | PASS if the dashboard file exists after iteration evaluation, contains all required sections, and is regenerated (not appended) each iteration; FAIL if the file is missing, sections are absent, or stale data persists from a prior iteration. | Privilege the loop protocol Step 4a for the generation contract, the reducer script for the live implementation, and the state format dashboard section for content requirements; use the template asset as the structural reference. |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:65:| `.opencode/skill/sk-deep-research/references/state_format.md` | State format; inspect `ANCHOR:dashboard` for content sections, lifecycle, and file protection rules |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:66:| `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` | Dashboard template; structural reference for all required sections (Status, Progress, Questions, Trend, Dead Ends, Next Focus, Active Risks) |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:67:| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Reducer script; `renderDashboard` generates the dashboard content; `reduceResearchState` writes it to disk |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:68:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; inspect `step_reduce_state` and `step_generate_dashboard` |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:69:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Workflow algorithm; inspect `step_reduce_state` and `step_generate_dashboard` |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:70:| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Automated verification; proves reducer idempotency and dashboard content correctness |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md:79:- Feature file path: `03--iteration-execution-and-state-discipline/024-dashboard-generation-after-iteration.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md:2:title: "DR-018 -- JSONL reconstruction from iteration files"
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md:3:description: "Verify that missing or unusable JSONL can be reconstructed from `iteration-NNN.md` files."
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md:6:# DR-018 -- JSONL reconstruction from iteration files
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md:14:This scenario validates jsonl reconstruction from iteration files for `DR-018`. The objective is to verify that missing or unusable JSONL can be reconstructed from `iteration-NNN.md` files.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md:26:- Objective: Verify that missing or unusable JSONL can be reconstructed from `iteration-NNN.md` files.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md:27:- Real user request: If the JSONL is unusable but the iteration files still exist, tell me whether the workflow can rebuild state.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md:28:- Orchestrator prompt: Validate the state-reconstruction contract for sk-deep-research. Confirm that the workflow can scan iteration-NNN.md files, reconstruct JSONL iteration records, and log a state_reconstructed event, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md:47:| DR-018 | JSONL reconstruction from iteration files | Verify that missing or unusable JSONL can be reconstructed from `iteration-NNN.md` files. | Validate the state-reconstruction contract for sk-deep-research. Confirm that the workflow can scan `iteration-NNN.md` files, reconstruct JSONL iteration records, and log a `state_reconstructed` event, then return a concise operator-facing verdict. | 1. `bash: rg -n 'State Recovery from Iteration Files|state_reconstructed|iterationsRecovered' .opencode/skill/sk-deep-research/references/state_format.md` -> 2. `bash: rg -n 'State file missing|Reconstruct from iteration files' .opencode/command/spec_kit/deep-research.md .opencode/skill/sk-deep-research/README.md` -> 3. `bash: rg -n 'iteration-{NNN}|reconstructed' .opencode/skill/sk-deep-research/references/state_format.md .opencode/skill/sk-deep-research/references/convergence.md` | The reconstruction algorithm scans iteration files, extracts assessment data, writes reconstructed records, and logs a `state_reconstructed` event. | Capture the reconstruction steps, the emitted event, and the command or README references to recovery from iteration files. | PASS if iteration-file reconstruction is explicitly documented and evented; FAIL if recovery is implied but not specified well enough to execute. | Use the detailed state-format reconstruction algorithm as primary truth and treat command/README references as supporting evidence only. |
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md:67:| `.opencode/skill/sk-deep-research/references/convergence.md` | Valid-entry behavior during convergence; use `ANCHOR:signal-definitions` |
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md:76:- Feature file path: `05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:2:title: "DR-008 -- Iteration writes iteration-NNN.md, JSONL record, and reducer refresh"
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:3:description: "Verify that each completed iteration writes the detailed iteration file, appends JSONL, and provides the reducer enough evidence to refresh synchronized packet state."
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:6:# DR-008 -- Iteration writes iteration-NNN.md, JSONL record, and reducer refresh
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:14:This scenario validates iteration writes iteration-nnn.md, jsonl record, and reducer refresh for `DR-008`. The objective is to verify that each completed iteration writes the detailed iteration file, appends JSONL, and enables the reducer to refresh synchronized strategy, registry, and dashboard state.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:26:- Objective: Verify that each completed iteration writes the detailed iteration file, appends JSONL, and enables reducer-owned packet synchronization.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:28:- Orchestrator prompt: Validate the iteration write-back contract for sk-deep-research. Confirm that each iteration writes iteration-NNN.md, appends a JSONL iteration record, and triggers reducer-owned refresh of deep-research-strategy.md, findings-registry.json, and deep-research-dashboard.md, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:31:- Expected signals: Iteration file creation, JSONL append, and reducer refresh are all mandatory parts of the loop, not optional side effects.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:32:- Pass/fail posture: PASS if all sources require the iteration file, JSONL append, and reducer refresh together; FAIL if any source treats one of them as optional.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:47:| DR-008 | Iteration writes iteration-NNN.md, JSONL record, and reducer refresh | Verify that each completed iteration writes the detailed iteration file, appends JSONL, and enables reducer-owned packet synchronization. | Validate the iteration write-back contract for sk-deep-research. Confirm that each iteration writes `iteration-NNN.md`, appends a JSONL iteration record, and refreshes reducer-owned `deep-research-strategy.md`, `findings-registry.json`, and `deep-research-dashboard.md`, then return a concise operator-facing verdict. | 1. `bash: rg -n 'iteration-{NNN}|Verify JSONL was appended|reducer refreshed' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: rg -n 'iteration-NNN|deep-research-state.jsonl|findings-registry.json|Reducer Contract' .opencode/skill/sk-deep-research/references/state_format.md .codex/agents/deep-research.toml` -> 3. `bash: rg -n 'step_reduce_state|reduce-state.cjs|findings-registry.json|deep-research-dashboard.md' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Iteration file creation, JSONL append, and reducer refresh are all mandatory parts of the loop, not optional side effects. | Capture the iteration artifact, the JSONL append, and the reducer-owned refresh surfaces. | PASS if all sources require the iteration file, JSONL append, and reducer refresh together; FAIL if any source treats one of them as optional. | Use the reducer script and runtime agent write contract as the lower-level source of truth when the overview docs are concise. |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:65:| `.opencode/skill/sk-deep-research/references/state_format.md` | Schema expectations for JSONL and strategy; use `ANCHOR:state-log` and `ANCHOR:strategy-file` |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:67:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow verification after dispatch |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/008-iteration-writes-iteration-jsonl-and-strategy-update.md:68:| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Workflow verification after dispatch |
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md:3:description: "Verify that removing the pause sentinel lets the loop resume from read-state rather than re-initializing."
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md:14:This scenario validates resume after pause sentinel removal for `DR-016`. The objective is to verify that removing the pause sentinel lets the loop resume from read-state rather than re-initializing.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md:18:A pause only helps if the workflow can resume cleanly from the current iteration boundary after the sentinel is cleared.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md:26:- Objective: Verify that removing the pause sentinel lets the loop resume from read-state rather than re-initializing.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md:27:- Real user request: After I remove the pause file, tell me where the loop resumes from and what it logs.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md:28:- Orchestrator prompt: Validate the pause-resume contract for sk-deep-research. Confirm that removing `research/.deep-research-pause` lets the research loop log a resumed event and continue from the read-state step, and removing `{spec_folder}/review/.deep-research-pause` lets the review loop do the same, instead of either mode starting from scratch, then return a concise verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md:29:- Expected execution process: Inspect the loop protocol resume-after-pause wording, then the event schema, then the YAML session behavior for resumed runs.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md:30:- Desired user-facing outcome: The user is told that resume continues from the persisted state after logging a resumed event.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md:31:- Expected signals: The loop logs `resumed`, continues from state read, and does not recreate config/strategy files during a valid resume.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md:32:- Pass/fail posture: PASS if resume continues from persisted state after logging a resumed event; FAIL if resume implies a fresh initialization path.
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md:47:| DR-016 | Resume after pause sentinel removal | Verify that removing the pause sentinel lets the loop resume from read-state rather than re-initializing. | Validate the pause-resume contract for sk-deep-research. Confirm that removing `research/.deep-research-pause` lets the research loop log a resumed event and continue from the read-state step, and removing `{spec_folder}/review/.deep-research-pause` lets the review loop do the same, instead of either mode starting from scratch, then return a concise verdict. | 1. `bash: rg -n 'On resume|resumed|Continue from step_read_state|review/.deep-research-pause' .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/references/state_format.md` -> 2. `bash: rg -n 'resumed|on_resume|skip_to: phase_loop|skip_to: gate_init_approval|review/.deep-research-pause|research/.deep-research-pause' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml` -> 3. `bash: rg -n 'Delete the file to resume|Auto-resume|review/.deep-research-pause' .opencode/skill/sk-deep-research/README.md` | The loop logs `resumed`, continues from state read, and does not recreate config or strategy files during a valid resume in either research or review mode. | Capture the resumed-event wording, the resume branch behavior, and the user-facing pause or resume explanation for both packet locations. | PASS if resume continues from persisted state after logging a resumed event in both modes; FAIL if either mode implies a fresh initialization path. | Check both the pause subsection and the broader auto-resume classification rules because research and review now use different sentinel locations. |
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md:64:| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Pause-resume flow; use `ANCHOR:phase-iteration-loop` and `ANCHOR:phase-initialization` |
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md:68:| `.opencode/skill/sk-deep-research/README.md` | User-facing pause and resume language; use `ANCHOR:faq` |
.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md:77:- Feature file path: `05--pause-resume-and-fault-tolerance/016-resume-after-pause-sentinel-removal.md`
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/006-invalid-or-contradictory-state-halts-for-repair.md:3:description: "Verify that partial or contradictory scratch artifacts trigger a halt for repair instead of a guessed resume path."
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/006-invalid-or-contradictory-state-halts-for-repair.md:14:This scenario validates invalid or contradictory state halts for repair for `DR-006`. The objective is to verify that partial or contradictory scratch artifacts trigger a halt for repair instead of a guessed resume path.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/006-invalid-or-contradictory-state-halts-for-repair.md:26:- Objective: Verify that partial or contradictory scratch artifacts trigger a halt for repair instead of a guessed resume path.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/006-invalid-or-contradictory-state-halts-for-repair.md:27:- Real user request: My deep-research scratch folder looks half-broken. Will the workflow repair it automatically or stop?
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/006-invalid-or-contradictory-state-halts-for-repair.md:28:- Orchestrator prompt: Validate the invalid-state halt contract for sk-deep-research. Confirm that contradictory or partial deep-research artifacts stop the workflow for repair instead of guessing through initialization, then return a concise user-facing pass/fail verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/02--initialization-and-state-setup/006-invalid-or-contradictory-state-halts-for-repair.md:47:| DR-006 | Invalid or contradictory state halts for repair | Verify that partial or contradictory scratch artifacts trigger a halt for repair instead of a guessed resume path. | Validate the invalid-state halt contract for sk-deep-research. Confirm that contradictory or partial deep-research artifacts stop the workflow for repair instead of guessing through initialization, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'invalid-state|halt for repair|contradictory|guessing' .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/SKILL.md` -> 2. `bash: rg -n 'on_invalid_state|halt: true|incomplete or contradictory' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 3. `bash: rg -n 'State file corrupt|repair|recover' .opencode/skill/sk-deep-research/README.md` | Invalid-state is a named class, both YAML files halt with a repair message, and the docs do not promise silent guessing for contradictory state. | Capture the invalid-state rules, the YAML halt messages, and the troubleshooting wording together. | PASS if the contract consistently halts on contradictory state; FAIL if any source implies silent auto-repair for invalid-state. | Distinguish invalid-state from recoverable JSONL corruption and verify both YAML files stop rather than continue. |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/007-iteration-reads-state-before-research.md:3:description: "Verify that each dispatched iteration reads JSONL and strategy state before performing research actions."
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/007-iteration-reads-state-before-research.md:14:This scenario validates iteration reads state before research for `DR-007`. The objective is to verify that each dispatched iteration reads JSONL and strategy state before performing research actions.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/007-iteration-reads-state-before-research.md:26:- Objective: Verify that each dispatched iteration reads JSONL and strategy state before performing research actions.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/007-iteration-reads-state-before-research.md:28:- Orchestrator prompt: Validate the read-state-first iteration contract for sk-deep-research. Confirm that the loop dispatch and the @deep-research agent both require reading JSONL and strategy state before any research actions, then return a concise operator verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/007-iteration-reads-state-before-research.md:31:- Expected signals: Loop step order begins with state reads, the quick reference checklist says the same, and the agent definition starts with JSONL plus strategy reads.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/007-iteration-reads-state-before-research.md:47:| DR-007 | Iteration reads state before research | Verify that each dispatched iteration reads JSONL and strategy state before performing research actions. | Validate the read-state-first iteration contract for sk-deep-research. Confirm that the loop dispatch and the `@deep-research` agent both require reading JSONL and strategy state before any research actions, then return a concise operator verdict. | 1. `bash: rg -n 'Step 1: Read State|Read current state|read state first' .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/SKILL.md` -> 2. `bash: rg -n 'step_read_state|current_iteration|next_focus' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` -> 3. `bash: sed -n '1,220p' .opencode/skill/sk-deep-research/references/quick_reference.md && sed -n '1,220p' .codex/agents/deep-research.toml` | Loop step order begins with state reads, the quick reference checklist says the same, and the agent definition starts with JSONL plus strategy reads. | Capture the loop step order, the quick-reference checklist, and the runtime agent step sequence. | PASS if all sources agree that state is read before research actions; FAIL if any source allows research before rehydrating state. | Check the agent sequence under `Single Iteration Protocol` if the higher-level docs look ambiguous. |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/025-novelty-justification-in-jsonl.md:2:title: "DR-025 -- Novelty justification present in JSONL"
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/025-novelty-justification-in-jsonl.md:3:description: "Verify every iteration JSONL record includes noveltyJustification alongside newInfoRatio."
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/025-novelty-justification-in-jsonl.md:6:# DR-025 -- Novelty justification present in JSONL
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/025-novelty-justification-in-jsonl.md:14:This scenario validates that novelty justification is present in JSONL iteration records for `DR-025`. The objective is to verify that every iteration record includes both `newInfoRatio` and a human-readable `noveltyJustification` field.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/025-novelty-justification-in-jsonl.md:26:- Objective: Verify every iteration JSONL record includes noveltyJustification alongside newInfoRatio.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/025-novelty-justification-in-jsonl.md:28:- Orchestrator prompt: Validate the novelty justification contract for sk-deep-research. Confirm that the JSONL iteration record schema requires both `newInfoRatio` and `noveltyJustification`, that the justification is a human-readable sentence, and that ALWAYS rule 11 and the agent Step 6 mandate their inclusion. Return a concise operator-facing verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/025-novelty-justification-in-jsonl.md:30:- Desired user-facing outcome: The user can inspect any JSONL iteration record and find a plain-language explanation of what the newInfoRatio represents.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/025-novelty-justification-in-jsonl.md:31:- Expected signals: JSONL iteration records contain both `newInfoRatio` (number, 0.0-1.0) and `noveltyJustification` (string, human-readable sentence); the justification field is listed as required in v1.1.0 agent instructions; ALWAYS rule 11 mandates both fields.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/025-novelty-justification-in-jsonl.md:47:| DR-025 | Novelty justification present in JSONL | Verify every iteration JSONL record includes noveltyJustification alongside newInfoRatio. | Validate the novelty justification contract for sk-deep-research. Confirm that the JSONL iteration record schema requires both `newInfoRatio` and `noveltyJustification`, that the justification is a human-readable sentence, and that ALWAYS rule 11 and the agent Step 6 mandate their inclusion. Return a concise operator-facing verdict. | 1. `bash: rg -n 'noveltyJustification\|Novelty Justification' .opencode/skill/sk-deep-research/references/state_format.md` -> 2. `bash: rg -n 'rule.*11\|novelty.*justification\|newInfoRatio.*novelty' .opencode/skill/sk-deep-research/SKILL.md` -> 3. `bash: rg -n 'noveltyJustification\|Required fields' .opencode/agent/deep-research.md` | JSONL record has both `newInfoRatio` and `noveltyJustification` fields; justification is a human-readable sentence (e.g., "2 new findings on reconnection backoff, 1 refinement of prior keepalive finding"); field is listed as required in v1.1.0 agent instructions (Step 6); ALWAYS rule 11 mandates both. | Capture the state format field definition, SKILL.md ALWAYS rule 11 text, and agent Step 6 required fields list with the example JSONL record. | PASS if the field schema, ALWAYS rule 11, and agent Step 6 all consistently require both fields and the justification is a human-readable sentence; FAIL if any source omits the requirement or defines the field as optional without enforcement. | Privilege the SKILL.md ALWAYS rules as the normative contract; use state_format.md for schema details and agent files for implementation enforcement. Note: state_format.md marks the field as `No` (not required) in the schema table but SKILL.md ALWAYS rule 11 and agent v1.1.0 instructions override this to required. |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md:2:title: "DR-028 -- Focus track labels in dashboard"
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md:3:description: "Verify optional focusTrack labels appear in JSONL and dashboard iteration table."
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md:6:# DR-028 -- Focus track labels in dashboard
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md:14:This scenario validates focus track label propagation for `DR-028`. The objective is to verify that optional focusTrack labels appear in JSONL iteration records and surface correctly in the dashboard Progress table.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md:26:- Objective: Verify optional focusTrack labels appear in JSONL and dashboard iteration table.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md:28:- Orchestrator prompt: Validate the focusTrack label contract for sk-deep-research. Confirm that the JSONL state format defines focusTrack as an optional field on iteration records, and that the dashboard Progress table surfaces a Track column, then return a concise operator-facing verdict.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md:29:- Expected execution process: Inspect the state format reference for the focusTrack field definition, then check the dashboard asset for the Progress table schema including the Track column.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md:30:- Desired user-facing outcome: The user understands that focusTrack is an optional post-hoc grouping label that flows from JSONL records into the dashboard Progress table for analysis.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md:31:- Expected signals: JSONL iteration records with an optional focusTrack field, dashboard Progress table with a Track column.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md:32:- Pass/fail posture: PASS if focusTrack is defined in state_format.md as optional on iteration records AND the dashboard Progress table includes a Track column; FAIL if the field is missing from either location or the two definitions contradict.
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md:47:| DR-028 | Focus track labels in dashboard | Verify optional focusTrack labels appear in JSONL and dashboard iteration table. | Validate the focusTrack label contract for sk-deep-research. Confirm that the JSONL state format defines focusTrack as an optional field on iteration records, and that the dashboard Progress table surfaces a Track column, then return a concise operator-facing verdict. | 1. `bash: rg -n 'focusTrack' .opencode/skill/sk-deep-research/references/state_format.md` -> 2. `bash: rg -n 'Track\|focusTrack' .opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` -> 3. `bash: rg -n 'focusTrack' .opencode/skill/sk-deep-research/README.md` | JSONL iteration records with an optional focusTrack field, dashboard Progress table with a Track column. | Capture the state_format.md focusTrack field definition, the dashboard Progress table header row, and any README mention of focus track grouping. | PASS if focusTrack is defined in state_format.md as optional on iteration records AND the dashboard Progress table includes a Track column; FAIL if the field is missing from either location or the two definitions contradict. | Privilege state_format.md as the canonical schema; use the dashboard asset and README only as secondary confirmation of propagation. |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md:64:| `.opencode/skill/sk-deep-research/references/state_format.md` | Canonical JSONL schema; focusTrack field definition on iteration records |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md:65:| `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` | Dashboard template; Progress table with Track column |
.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md:75:- Feature file path: `03--iteration-execution-and-state-discipline/028-focus-track-labels-in-dashboard.md`

exec
/bin/zsh -lc 'for f in .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist.md; do echo "FILE:$f"; nl -ba "$f" | sed -n '"'1,260p'; done" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
FILE:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md
     1	---
     2	title: "Feature Specification: Deep Research and Deep Review Runtime Improvement Bundle [042]"
     3	description: "Plan the next improvement wave for sk-deep-research and sk-deep-review by turning the consolidated research findings into an implementation-ready Level 3 packet."
     4	trigger_phrases:
     5	  - "042"
     6	  - "deep research"
     7	  - "deep review"
     8	  - "runtime improvement"
     9	  - "claim verification ledger"
    10	  - "coordination board"
    11	importance_tier: "important"
    12	contextType: "planning"
    13	---
    14	# Feature Specification: Deep Research and Deep Review Runtime Improvement Bundle
    15	
    16	<!-- SPECKIT_LEVEL: 3 -->
    17	<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
    18	
    19	---
    20	
    21	## EXECUTIVE SUMMARY
    22	
    23	This packet converts the consolidated agentic-systems research into one implementation plan for the two autonomous deep-loop products: `sk-deep-research` and `sk-deep-review`. The work is centered on runtime truth, not feature sprawl: real stop reasons, legal completion gates, resume-from-run semantics, auditability, claim verification, behavior-first tests, and richer dashboards that make loop state easier to trust and resume.
    24	
    25	**Key Decisions**: keep research and review as explicit products instead of collapsing them into a generic workflow DSL; make council synthesis and coordination-board support opt-in instead of default; treat journals, ledgers, and behavior tests as first-class runtime artifacts.
    26	
    27	**Critical Dependencies**: consolidated research findings `CF-004`, `CF-010`, `CF-014`, `CF-021`, `CF-027`, and `CF-030`; existing deep-loop reducer and parity tests; packet-local, append-only state discipline.
    28	
    29	This revision also incorporates five newly identified packet gaps from `scratch/codex-gpt54-deep-research.md`: reducer snapshot/compaction, packet-local observability, large-target decomposition, semantic convergence signals, and deep-review reducer ownership for machine-managed sections.
    30	
    31	---
    32	
    33	## 1. METADATA
    34	
    35	| Field | Value |
    36	|-------|-------|
    37	| **Level** | 3 |
    38	| **Priority** | P1 |
    39	| **Status** | Draft |
    40	| **Created** | 2026-04-10 |
    41	| **Branch** | `042-sk-deep-research-review-improvement-2` |
    42	| **Dependencies** | `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md`; current deep-loop assets, YAML workflows, reducer/tests |
    43	| **Predecessor** | Related background packets: `028-auto-deep-research-review-improvement`, `040-sk-auto-deep-research-review-improvement` |
    44	| **Successor** | Follow-on implementation phases to be created from this packet after planning approval |
    45	
    46	---
    47	
    48	<!-- ANCHOR:problem -->
    49	## 2. PROBLEM & PURPOSE
    50	
    51	### Problem Statement
    52	
    53	The current deep-loop stack is functional, but it still treats "converged" as a mostly inferred state instead of a strongly explained runtime truth. Deep research and deep review already have JSONL state, dashboards, and reducer/parity coverage, yet the consolidated research shows clear gaps around stop-reason taxonomy, legal done gates, resume/start-from behavior, research claim verification, audit trails, richer dashboards, behavior-first test coverage, and large-run coordination.
    54	
    55	Those gaps matter because the two deep-loop products are long-running, artifact-heavy workflows. When they stop, resume, or synthesize, operators need to know exactly why the system behaved that way and which evidence backs the outcome. Without that, the runtime remains auditable only for people willing to reverse-engineer JSONL logs and reducer behavior by hand.
    56	
    57	### Purpose
    58	
    59	Define an implementation-ready plan that upgrades deep research and deep review into better-audited, better-tested, and easier-to-resume loop products while keeping their explicit LEAF-worker architecture and packet-local artifact model intact.
    60	
    61	<!-- /ANCHOR:problem -->
    62	---
    63	
    64	<!-- ANCHOR:scope -->
    65	## 3. SCOPE
    66	
    67	### In Scope
    68	
    69	- Real completion-gate planning for both deep-loop products, including named stop reasons, binary done checks, and resume-from-run semantics.
    70	- Research-quality runtime artifacts: claim-verification ledger, publication critique, runtime-surface inventory, and promotion checkpoints.
    71	- Dashboard upgrades for both loops: liveness, convergence trends, timing/token visibility, coverage depth, and severity trends.
    72	- Append-only audit-journal planning for both loops.
    73	- Reducer durability for 100+ iteration packets, including delta replay, replay validation, and periodic snapshot/compaction policy.
    74	- Packet-local observability and tracing surfaces: timing/tool/token histograms, state diffs, anomaly flags, and stop-decision drill-down.
    75	- Large-target decomposition policies for 1000+ file review scopes and 50+ domain research scopes.
    76	- Semantic convergence signals that combine novelty, contradiction density, and citation overlap with existing statistical checks.
    77	- Behavior-first automated verification planning for reducers, workflows, and loop outputs.
    78	- Optional, explicit advanced modes: council-style synthesis and packet-level coordination boards for large multi-phase research.
    79	- Shared loop-runtime surfaces under `scripts/` and current contract/parity tests that must move with these runtime changes.
    80	
    81	### Out of Scope
    82	
    83	- Direct implementation of any skill, command, agent, reducer, or test changes.
    84	- Changes outside the deep-research/deep-review skill families, their commands, their agents, and shared loop runtime/test infrastructure.
    85	- Replacing research/review with a generic hidden workflow DSL. The consolidated report explicitly rejects that direction.
    86	- Broader operator-shell compression, guided bootstrap, or memory-platform redesign work from other research bundles unless it is directly required by the eight improvements in this packet.
    87	- A new `mcp_server/` implementation. No current `mcp_server/` surface was identified for these deep-loop products during packet discovery.
    88	
    89	### Files to Change
    90	
    91	#### Skills and Shared Runtime
    92	
    93	| File Path | Change Type | Description |
    94	|-----------|-------------|-------------|
    95	| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Add the new completion-gate contract, ledger/journal behavior, optional council mode, and updated testing/runtime expectations. |
    96	| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Modify | Document legal stop flow, blocked-stop behavior, journal writes, and resume-from-run lifecycle steps. |
    97	| `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Define stop-reason taxonomy, binary done gate, liveness, blocked-stop handling, and semantic convergence signals. |
    98	| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Add fields and artifact contracts for stop reasons, journals, ledgers, replay snapshots, observability events, decomposition metadata, and coordination board data. |
    99	| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Modify | Keep operator-facing guidance aligned with the new defaults and opt-in modes. |
   100	| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Add schema version, lifecycle, journal, snapshot/compaction, observability, decomposition, and optional-mode configuration keys. |
   101	| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Modify | Add coverage/depth, domain clustering, promotion checkpoints, semantic convergence, and council/coordination planning sections. |
   102	| `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` | Modify | Expand dashboard sections for liveness, rolling convergence, timing/tool/token histograms, state diffs, anomaly flags, stop-decision drill-down, and coverage depth. |
   103	| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Modify | Extend reducer outputs for delta replay, snapshot/compaction, dashboard metrics, observability rollups, ledger rollups, journal rollups, and resume/stop metadata. |
   104	| `.opencode/skill/sk-deep-review/SKILL.md` | Modify | Add the real done-gate contract, journal behavior, richer dashboard expectations, and behavior-test posture. |
   105	| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Document legal stop flow, blocked-stop behavior, journal writes, start-from-run semantics, and large-target inventory/hotspot workflows. |
   106	| `.opencode/skill/sk-deep-review/references/convergence.md` | Modify | Define stop-reason taxonomy, all-dimensions-clean semantics, liveness, blocked-stop handling, and semantic convergence signals. |
   107	| `.opencode/skill/sk-deep-review/references/state_format.md` | Modify | Add fields and artifact contracts for stop reasons, journals, replay snapshots, observability events, decomposition metadata, time/token metrics, and coverage depth. |
   108	| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Modify | Keep operator-facing review guidance aligned with the new defaults and optional modes. |
   109	| `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` | Modify | Make stop reasons, typed stop-decision events, done-gate conditions, reducer-owned machine sections, dashboard metrics, and audit-journal outputs canonical. |
   110	| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Add schema version, lifecycle, journal, snapshot/compaction, observability, decomposition, and resume cursor fields. |
   111	| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Modify | Add reducer-owned machine sections, hotspot-ranking, stratified coverage, semantic convergence, and journal-aware planning sections. |
   112	| `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md` | Modify | Expand dashboard sections for liveness, rolling severity trends, timing/tool/token histograms, state diffs, anomaly flags, stop-decision drill-down, and coverage depth. |
   113	
   114	#### Commands and Workflow Assets
   115	
   116	| File Path | Change Type | Description |
   117	|-----------|-------------|-------------|
   118	| `.opencode/command/spec_kit/deep-research.md` | Modify | Update command contract, outputs, and mode descriptions to match the new runtime truths. |
   119	| `.opencode/command/spec_kit/deep-review.md` | Modify | Update command contract, outputs, and mode descriptions to match the new runtime truths. |
   120	| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Add typed stop-decision events, snapshot-aware replay steps, observability capture, decomposition workflow steps, and resume-from-run handling. |
   121	| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Keep confirm-mode workflow aligned with the same runtime artifacts, replay surfaces, and optional advanced modes. |
   122	| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Add typed stop-decision events, snapshot-aware replay steps, observability capture, inventory/hotspot workflow steps, and resume-from-run handling. |
   123	| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Keep confirm-mode workflow aligned with the same runtime artifacts, replay surfaces, and optional advanced modes. |
   124	
   125	#### Agents and Runtime Mirrors
   126	
   127	| File Path | Change Type | Description |
   128	|-----------|-------------|-------------|
   129	| `.opencode/agent/deep-research.md` | Modify | Update iteration instructions to emit the new journal, ledger, critique, clustering, semantic-convergence, inventory, and promotion-checkpoint data. |
   130	| `.opencode/agent/deep-review.md` | Modify | Update iteration instructions to emit the new journal, stop-reason, inventory/hotspot, semantic-convergence, coverage-depth, and timing/tokens data while leaving reducer-owned sections untouched. |
   131	| `.claude/agents/deep-research.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   132	| `.gemini/agents/deep-research.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   133	| `.codex/agents/deep-research.toml` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   134	| `.agents/agents/deep-research.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   135	| `.claude/agents/deep-review.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   136	| `.gemini/agents/deep-review.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   137	| `.codex/agents/deep-review.toml` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   138	
   139	#### Tests
   140	
   141	| File Path | Change Type | Description |
   142	|-----------|-------------|-------------|
   143	| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Modify | Extend reducer coverage for journal, ledger, stop-reason, delta replay, snapshot/compaction, semantic convergence, and dashboard observability metrics. |
   144	| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts` | Modify | Extend schema/contract coverage for stop reasons, journals, reducer-owned machine sections, snapshot/compaction, observability metrics, decomposition metadata, and resume cursor fields. |
   145	| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | Modify | Keep docs, assets, reducers, and mirrors aligned on the new runtime artifacts and modes. |
   146	| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | Modify | Keep docs, assets, reducers, and mirrors aligned on the new runtime artifacts and modes. |
   147	| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts` | Create | Add behavior-first tests for falsifiable focus, citations, conclusion confidence, convergence stop, stop-reason persistence, domain clustering, and replay recovery. |
   148	| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` | Create | Add behavior-first tests for dimension rotation, citations, claim-adjudication gates, convergence stop, stop-reason persistence, hotspot ranking, and replay recovery. |
   149	| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/` | Create | Seed replay corpus from packet families `028`, `040`, and `042` for invalid-state, resume, completed-continue, and compaction-equivalence fixtures. |
   150	
   151	<!-- /ANCHOR:scope -->
   152	---
   153	
   154	<!-- ANCHOR:requirements -->
   155	## 4. REQUIREMENTS
   156	
   157	### P0 - Blockers (MUST complete)
   158	
   159	| ID | Requirement | Acceptance Criteria | Research Basis |
   160	|----|-------------|---------------------|----------------|
   161	| REQ-001 | Both deep-loop products MUST use a shared named stop-reason taxonomy: `max_iterations`, `converged`, `all_dimensions_clean`, `insufficient_evidence`, `user_stopped`, and `error_budget_exhausted`. | Deep research and deep review state docs, YAML workflows, dashboards, and synthesis outputs all expose `stopReason` from the shared taxonomy; any legacy stop labels are either removed or mapped into this taxonomy. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   162	| REQ-002 | Deep research and deep review MUST only stop when convergence math, coverage expectations, and binary quality gates all pass together. | If convergence math votes STOP but coverage or quality gates fail, the workflow records a blocked-stop event, leaves `status` non-terminal, and continues or requests recovery; STOP is never treated as legal based on novelty math alone. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   163	| REQ-003 | Both loops MUST support resume semantics that can continue from an existing lineage and start at a specific iteration/run boundary instead of reinitializing from run 1. | Config/state/workflow contracts define and preserve resume cursor data such as `continuedFromRun` or equivalent; command surfaces describe how resume, restart, fork, and completed-continue interact with start-from-run behavior. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   164	| REQ-004 | Both loops MUST produce append-only audit journals that capture file reads, searches, evidence extraction, focus/dimension rotation decisions, and convergence-calculation inputs. | Runtime artifacts include a canonical journal file per session, it is append-only, reducer/dashboard flows can summarize it, and stop/recovery analysis can be reproduced from packet artifacts without hidden state. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   165	| REQ-005 | Deep research MUST create a claim-verification ledger for major claims with quoted claim text, evidence references, verification status, and verification method/actor. | Research packets define a canonical ledger artifact, synthesis references it, and claims can be marked `verified`, `contradicted`, or `unresolved` with file/line evidence or explicit unresolved status. | `CF-014` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:212-221`] |
   166	| REQ-006 | The implementation plan MUST shift loop confidence from structure-only checks to behavior-first tests that exercise narrow questions, evidence citations, conclusion confidence, convergence, and stop-reason persistence. | The planned test stack includes dedicated behavioral suites for deep research and deep review plus extensions to reducer/parity tests; passing behavior tests becomes part of the done gate for these runtime changes. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `Theme T-005` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:404-406`] |
   167	
   168	### P1 - Required (complete OR user-approved deferral)
   169	
   170	| ID | Requirement | Acceptance Criteria | Research Basis |
   171	|----|-------------|---------------------|----------------|
   172	| REQ-007 | Both loop dashboards MUST expose richer runtime truth: liveness, rolling convergence visualization, wall-clock and token cost per iteration, coverage depth, severity trends, and final stop reason. | Research and review dashboard assets, reducers, and workflow outputs define these sections explicitly; dashboard content is generated, not manually maintained; trend and liveness rules are consistent with state schema. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   173	| REQ-008 | Deep research MUST support publication critique annotations so synthesis distinguishes verified runtime code, README claims, marketing copy, and other weaker evidence classes. | Research iteration/synthesis surfaces include an explicit evidence-quality or publication-critique field that can be summarized in the dashboard or final research output without becoming mandatory for every minor observation. | `CF-021` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:291-300`] |
   174	| REQ-009 | Deep research MUST support runtime-inventory and promotion-checkpoint artifacts so recommendations do not move to "adopt" without explicit evidence thresholds. | Research packet design includes runtime-surface inventory capture plus checkpoint criteria for moving a finding from interesting to recommended; the promotion threshold is visible in synthesis and the ledger/journal context. | `CF-021` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:291-300`] |
   175	| REQ-010 | Council-style synthesis MUST be supported as an explicit opt-in profile for ambiguous research or architecture questions. | The plan defines named perspective iterations and a synthesis reconciliation iteration; default deep-research behavior remains unchanged unless the user or workflow explicitly selects council mode. | `CF-027` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:359-359`] |
   176	| REQ-011 | Large multi-phase research runs MUST have an optional packet-local coordination board that tracks phase status, headline findings, conflicts, duplicate signals, and resource-allocation suggestions. | The plan defines a packet-local coordination artifact with explicit fields for state, conflicts, dedupe, and resource recommendations; default single-packet research remains unaffected when the board is unused. | `CF-030` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:362-362`] |
   177	| REQ-012 | Command docs and YAML assets MUST surface the new lifecycle and optional-mode behavior without bloating the default operator path. | Default command examples remain compact; advanced behaviors are discoverable but explicitly marked as optional; confirm and auto workflows stay contract-compatible. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:408-411`] |
   178	| REQ-013 | Canonical skill/command/agent contracts and runtime parity tests MUST move together so new stop/journal/ledger/dashboard behavior cannot drift by runtime or doc surface. | Planned work updates the canonical `.opencode` files plus the parity-test surfaces that enforce mirror alignment; implementation does not rely on untested doc-only parity. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:408-411`] |
   179	| REQ-014 | Shared loop-runtime changes MUST preserve packet-local, explicit deep-loop products and avoid introducing a hidden generic DSL or non-auditable state channel. | The implementation plan keeps reducers, journals, ledgers, and dashboards explicit inside the research/review packets; shared helpers may be extracted, but domain-specific artifacts and LEAF semantics remain visible and testable. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:467-471`] |
   180	| REQ-015 | Both loops MUST support delta replay plus periodic snapshots/compaction so reducer performance does not degrade on 100+ iteration packets. | Canonical state keeps authoritative append-only events while reducers consume latest deltas plus periodic snapshots; compaction policy is explicit, replay validation proves equivalent outputs before and after compaction, and packet durability remains packet-local. | Iteration 1 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:41-50`], Recommendation 1 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:211-214`] |
   181	| REQ-016 | Both loops MUST expose packet-local observability surfaces with timing/tool/token histograms, state diffs, anomaly flags, and stop-decision drill-down. | Dashboards and reducers emit packet-local observability views sourced from runtime data such as `durationMs`, `toolsUsed`, and `sourcesQueried` or an explicit unknown fallback; stop-decision traces remain replayable and reducer-generated. | Iteration 7 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:143-152`], Recommendation 7 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:217-220`] |
   182	| REQ-017 | Large-target decomposition MUST be planned explicitly: review for 1000+ file repos and research for 50+ source domains. | Deep review defines inventory pass, hotspot ranking, stratified coverage, and segment/wave governance for very large repos; deep research defines domain clustering, authority-aware sampling, and cluster-aware convergence for large source sets; smaller packets keep the default lightweight path. | Iteration 6 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:126-135`], Recommendation 8 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:219-221`] |
   183	| REQ-018 | Convergence detection MUST incorporate semantic novelty, contradiction density, and citation-graph overlap alongside the existing statistical and coverage signals. | Convergence docs and workflow/state contracts define a typed stop-decision trace that records novelty, contradiction, and citation-overlap inputs; blocked-stop events explain which semantic signals prevented or supported legal STOP. | Iteration 2 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:58-67`], Recommendation 5 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:215-218`] |
   184	| REQ-019 | Deep-review machine-owned strategy sections MUST be reducer-owned, matching deep-research behavior. | Deep-review agent instructions stop editing machine-owned strategy/dashboard sections directly; reducer-owned sections are clearly labeled in review contracts, and parity/behavior coverage proves the boundary remains intact across runtimes. | Iteration 4 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:92-99`], Recommendation 3 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:213-216`] |
   185	
   186	<!-- /ANCHOR:requirements -->
   187	---
   188	
   189	<!-- ANCHOR:success-criteria -->
   190	## 5. SUCCESS CRITERIA
   191	
   192	- **SC-001**: The packet defines a single shared stop-reason taxonomy and legal done-gate model for both deep research and deep review.
   193	- **SC-002**: The packet separates foundational runtime work from optional advanced modes, with council synthesis and coordination boards explicitly marked opt-in.
   194	- **SC-003**: The packet lists all core implementation files, shared runtime surfaces, and verification files required to ship the eight improvements.
   195	- **SC-004**: Every requirement maps to research evidence from the consolidated report and can be traced to at least one concrete file set.
   196	- **SC-005**: The plan includes a dependency-ordered delivery path that ships runtime-truth foundations before optional orchestration features.
   197	- **SC-006**: The task breakdown assigns concrete file targets and parent requirements for each planned change, with all tasks starting in `Pending`.
   198	- **SC-007**: The checklist provides one verification item per requirement, with evidence format and test references.
   199	- **SC-008**: The decision record captures the requested architecture choices, including the new durability, testing-order, semantic-convergence, and recovery-ladder ADRs, with rationale, alternatives, and rollback thinking.
   200	- **SC-009**: `implementation-summary.md` exists as a placeholder only and does not over-claim implementation work.
   201	- **SC-010**: `validate.sh --strict` passes for this packet after the planning documents are written.
   202	- **SC-011**: The packet defines reducer snapshot/compaction and replay-validation requirements for both loops without weakening packet-local durability.
   203	- **SC-012**: The packet defines packet-local observability surfaces and typed stop-decision drill-down for both dashboards.
   204	- **SC-013**: The packet makes large-target decomposition explicit for both 1000+ file review scopes and 50+ domain research scopes.
   205	- **SC-014**: The packet upgrades convergence from statistical-only signaling to a typed decision trace with semantic novelty, contradiction density, and citation overlap.
   206	- **SC-015**: The packet moves deep-review machine-owned sections under reducer ownership and reflects that boundary in tasks, tests, and ADRs.
   207	
   208	### Acceptance Scenarios
   209	
   210	1. **Given** either loop finishes, **When** an operator opens the dashboard or synthesis output, **Then** the packet shows a named stop reason from the shared taxonomy.
   211	2. **Given** convergence math votes STOP but a quality gate fails, **When** the workflow evaluates completion, **Then** it records a blocked-stop event and does not terminate as complete.
   212	3. **Given** a valid prior packet state, **When** resume is selected, **Then** the workflow continues from a named run boundary instead of starting from run 1.
   213	4. **Given** a major research claim, **When** the packet is synthesized, **Then** the claim appears with `verified`, `contradicted`, or `unresolved` status plus evidence refs.
   214	5. **Given** a recommendation derived from mixed source quality, **When** the packet records it, **Then** publication critique, runtime inventory, and promotion-checkpoint context remain visible.
   215	6. **Given** a normal loop run, **When** council synthesis or a coordination board is not explicitly requested, **Then** no advanced-mode artifacts are created.
   216	
   217	<!-- /ANCHOR:success-criteria -->
   218	---
   219	
   220	<!-- ANCHOR:risks -->
   221	## 6. RISKS & DEPENDENCIES
   222	
   223	| Type | Item | Impact | Mitigation |
   224	|------|------|--------|------------|
   225	| Dependency | Consolidated report remains the source of truth for the eight improvements | Mis-scoped implementation if packet drifts from research | Every requirement cites the consolidated report directly. |
   226	| Dependency | Existing reducer/parity tests are the current runtime safety net | Behavior changes could drift from contracts | Plan behavior-first tests and parity updates in the same implementation wave. |
   227	| Risk | Stop-gate logic becomes too complicated for operators | Medium | Keep default operator UX small and move advanced detail into generated artifacts and optional modes. |
   228	| Risk | Journals and ledgers create maintenance overhead without adoption | Medium | Make journals canonical but reducer-driven; keep publication critique and promotion checkpoints lightweight. |
   229	| Risk | Council mode or coordination board becomes a default-path distraction | Medium | Mark both features explicitly opt-in and put them in the last delivery phase. |
   230	| Risk | Runtime mirror parity balloons the implementation scope | Medium | Keep `.opencode` files canonical and use parity tests to decide whether hand-authored mirrors still need edits. |
   231	| Risk | Token/time tracking is inconsistently available across runtimes | Low | Plan for exact metrics when available and documented approximations otherwise. |
   232	
   233	<!-- /ANCHOR:risks -->
   234	---
   235	
   236	## 7. NON-FUNCTIONAL REQUIREMENTS
   237	
   238	### Performance
   239	
   240	- **NFR-P01**: Default deep-research and deep-review iterations should not require extra manual review steps compared with current `:auto` flows.
   241	- **NFR-P02**: Added runtime artifacts should remain reducer-friendly and packet-local, avoiding large per-iteration re-render costs beyond current dashboard regeneration.
   242	
   243	### Reliability
   244	
   245	- **NFR-R01**: New journal and ledger artifacts must remain append-only or reducer-rebuildable from canonical packet state.
   246	- **NFR-R02**: Resume and completed-continue flows must remain recoverable after interruption without needing hidden context or manual reconstruction.
   247	
   248	### Maintainability
   249	
   250	- **NFR-M01**: Shared runtime improvements must be documented once in canonical assets and enforced through parity/behavior tests rather than repeated prose-only edits.
   251	- **NFR-M02**: Optional advanced features must not make the default workflow harder to understand or validate.
   252	
   253	---
   254	
   255	## 8. EDGE CASES
   256	
   257	### Lifecycle and Stop-State Boundaries
   258	
   259	- Convergence math says STOP, but quality gates fail: record blocked-stop event, surface reason in dashboard/journal, continue loop or recovery path.
   260	- User explicitly stops a run mid-iteration: persist `user_stopped`, flush journal/ledger state safely, and keep resume cursor intact.
FILE:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md
     1	---
     2	title: "Implementation Plan: Deep Research and Deep Review Runtime Improvement Bundle [042]"
     3	description: "Deliver the eight deep-loop improvements in dependency order, starting with shared runtime truth and ending with optional advanced orchestration modes."
     4	trigger_phrases:
     5	  - "042"
     6	  - "implementation plan"
     7	  - "deep research"
     8	  - "deep review"
     9	  - "runtime truth"
    10	importance_tier: "important"
    11	contextType: "planning"
    12	---
    13	# Implementation Plan: Deep Research and Deep Review Runtime Improvement Bundle
    14	
    15	<!-- SPECKIT_LEVEL: 3 -->
    16	<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
    17	
    18	---
    19	
    20	<!-- ANCHOR:summary -->
    21	## 1. SUMMARY
    22	
    23	### Technical Context
    24	
    25	| Aspect | Value |
    26	|--------|-------|
    27	| **Language/Stack** | Markdown contracts, YAML workflows, JSON/JSONL artifacts, CommonJS reducer logic, Vitest suites |
    28	| **Framework** | Spec Kit deep-loop products: Command -> YAML workflow -> LEAF agent -> packet-local artifacts |
    29	| **Storage** | Packet-local `research/` and `review/` artifacts, append-only JSONL, generated dashboards, reducer-owned summaries |
    30	| **Testing** | Vitest contract/reducer/behavior suites plus strict packet validation |
    31	
    32	### Overview
    33	
    34	This implementation plan ships the deep-loop improvements in five phases. The sequence now incorporates the new research-driven gaps around snapshot/compaction durability, packet-local observability, large-target decomposition, semantic convergence, and deep-review reducer ownership. Phase 2 is split into `2a` and `2b`, while behavior/replay verification moves forward so it can protect contract work soon after the shared runtime foundation lands.
    35	
    36	The ordering is deliberate. Optional orchestration features should not land until the core loop substrate is easier to trust, recover, and verify. This follows the consolidated report's themes around runtime truth, shared loop mechanics, and extension-layer discipline.
    37	
    38	<!-- /ANCHOR:summary -->
    39	---
    40	
    41	<!-- ANCHOR:quality-gates -->
    42	## 2. QUALITY GATES
    43	
    44	### Definition of Ready
    45	
    46	- [x] The eight scoped improvements are fixed by this packet and traceable to consolidated research findings.
    47	- [x] Canonical deep-loop assets, YAML workflows, agents, reducer/test surfaces, and templates have been inventoried in `spec.md`.
    48	- [x] Optional features are separated from foundational runtime work.
    49	- [x] No implementation work is mixed into this planning packet.
    50	- [x] The five newly identified research gaps and the phase-order changes are mapped into packet requirements, tasks, and ADR coverage.
    51	
    52	### Definition of Done
    53	
    54	- [ ] Stop-reason taxonomy and legal done-gate design are applied consistently to both deep-loop products.
    55	- [ ] Resume/start-from-run semantics are documented across commands, workflows, state contracts, and agents.
    56	- [ ] Journals, dashboards, observability surfaces, and claim-ledger artifacts are defined and behavior-tested where applicable.
    57	- [ ] Snapshot/compaction, replay validation, and large-target decomposition rules are designed before optional advanced modes begin.
    58	- [ ] Semantic convergence and reducer-owned machine-section boundaries are documented across both loop products.
    59	- [ ] Research-quality add-ons are designed without bloating default execution.
    60	- [ ] Council synthesis and coordination-board features remain explicit opt-ins.
    61	- [ ] Contract, reducer, and behavior test plans are updated with concrete file-level targets.
    62	
    63	<!-- /ANCHOR:quality-gates -->
    64	---
    65	
    66	<!-- ANCHOR:architecture -->
    67	## 3. ARCHITECTURE
    68	
    69	### Pattern
    70	
    71	Shared loop-runtime hardening with explicit product overlays.
    72	
    73	### Key Components
    74	
    75	- **Command layer**: `.opencode/command/spec_kit/deep-research.md` and `.opencode/command/spec_kit/deep-review.md`
    76	- **Workflow layer**: auto/confirm YAML assets for deep research and deep review
    77	- **Skill layer**: current contracts, references, config/strategy/dashboard assets
    78	- **Agent layer**: canonical `.opencode/agent/` deep-loop workers plus parity mirrors if still hand-authored
    79	- **Runtime substrate**: reducer logic and state contracts
    80	- **Verification layer**: reducer, parity, and new behavior-first Vitest suites
    81	
    82	### Data Flow
    83	
    84	```text
    85	Phase 1 foundation
    86	  -> define typed stop-decision events, legal done gates, resume cursor, and replayable lineage schema
    87	
    88	Phase 2a state/observability substrate
    89	  -> add journals, snapshot/compaction, reducer durability, observability rollups, and decomposition scaffolding
    90	
    91	Phase 2b trust surfaces
    92	  -> add claim ledger, publication critique, promotion checkpoints, semantic convergence, and reducer-owned review machine sections
    93	
    94	Phase 3 behavior-first verification
    95	  -> add replay corpus, thin end-to-end harnesses, reducer/schema extensions, and integration fixtures early
    96	
    97	Phase 4 parity and mirror alignment
    98	  -> sync operator docs, canonical assets, and runtime mirrors against the hardened/tested contracts
    99	
   100	Phase 5 optional advanced modes
   101	  -> council synthesis profile
   102	  -> packet-level coordination board
   103	```
   104	
   105	<!-- /ANCHOR:architecture -->
   106	---
   107	
   108	<!-- ANCHOR:phases -->
   109	## 4. IMPLEMENTATION PHASES
   110	
   111	### Phase 1: Runtime Foundation
   112	
   113	**Scope**: REQ-001, REQ-002, REQ-003, REQ-014 plus the shared event-schema scaffolding consumed by REQ-015, REQ-016, REQ-018, and REQ-019
   114	
   115	**Why first**: Every later improvement depends on a trusted answer to four questions: why did the loop stop, was STOP legal, where can a session resume, and can the stop decision be replayed from packet-local state.
   116	
   117	**Files to change**:
   118	- `.opencode/skill/sk-deep-research/SKILL.md`
   119	- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
   120	- `.opencode/skill/sk-deep-research/references/convergence.md`
   121	- `.opencode/skill/sk-deep-research/references/state_format.md`
   122	- `.opencode/skill/sk-deep-research/assets/deep_research_config.json`
   123	- `.opencode/skill/sk-deep-review/SKILL.md`
   124	- `.opencode/skill/sk-deep-review/references/loop_protocol.md`
   125	- `.opencode/skill/sk-deep-review/references/convergence.md`
   126	- `.opencode/skill/sk-deep-review/references/state_format.md`
   127	- `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`
   128	- `.opencode/skill/sk-deep-review/assets/deep_review_config.json`
   129	- `.opencode/command/spec_kit/deep-research.md`
   130	- `.opencode/command/spec_kit/deep-review.md`
   131	- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
   132	- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
   133	- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
   134	- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
   135	- `.opencode/agent/deep-research.md`
   136	- `.opencode/agent/deep-review.md`
   137	
   138	**Estimated complexity**: High
   139	
   140	**Verification strategy**:
   141	- Define typed event records with `schemaVersion`, `stopReason`, `blockedBy`, and `recoveryStrategy` before adding richer reducers or dashboards.
   142	- Add fixture-based cases that prove blocked-stop behavior and replayable stop-decision logging when convergence math passes but quality gates fail.
   143	- Verify auto and confirm YAML parity for both loops at the event-schema boundary.
   144	
   145	### Phase 2a: State and Observability Substrate
   146	
   147	**Scope**: REQ-004, REQ-007, REQ-015, REQ-016, REQ-017
   148	
   149	**Why second**: Journals, compaction, observability, and large-target decomposition all build on the Phase 1 event schema and need to exist before trust surfaces or optional modes can be trusted at scale.
   150	
   151	**Files to change**:
   152	- `.opencode/skill/sk-deep-research/references/state_format.md`
   153	- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
   154	- `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`
   155	- `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`
   156	- `.opencode/skill/sk-deep-research/assets/deep_research_config.json`
   157	- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
   158	- `.opencode/skill/sk-deep-review/references/state_format.md`
   159	- `.opencode/skill/sk-deep-review/references/loop_protocol.md`
   160	- `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`
   161	- `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`
   162	- `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`
   163	- `.opencode/skill/sk-deep-review/assets/deep_review_config.json`
   164	- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
   165	- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
   166	- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
   167	- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
   168	- `.opencode/agent/deep-research.md`
   169	- `.opencode/agent/deep-review.md`
   170	
   171	**Estimated complexity**: High
   172	
   173	**Verification strategy**:
   174	- Reducer fixtures prove append-only journal rollups, delta replay, snapshot/compaction equivalence, and dashboard regeneration remain idempotent.
   175	- Dashboard and schema tests assert timing/tool/token histograms, state diffs, anomaly flags, stop-decision drill-down, and decomposition metadata.
   176	- Large-target fixtures cover review inventory plus hotspot ranking and research domain clustering without changing the small-packet default path.
   177	
   178	### Phase 2b: Trust Surfaces, Ledgers, and Critique
   179	
   180	**Scope**: REQ-005, REQ-008, REQ-009, REQ-018, REQ-019
   181	
   182	**Why third**: Once the substrate is durable and observable, we can safely layer the trust surfaces that decide what evidence is promoted, what convergence means semantically, and which sections stay machine-owned.
   183	
   184	**Files to change**:
   185	- `.opencode/skill/sk-deep-research/SKILL.md`
   186	- `.opencode/skill/sk-deep-research/references/convergence.md`
   187	- `.opencode/skill/sk-deep-research/references/state_format.md`
   188	- `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`
   189	- `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`
   190	- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
   191	- `.opencode/skill/sk-deep-review/SKILL.md`
   192	- `.opencode/skill/sk-deep-review/references/convergence.md`
   193	- `.opencode/skill/sk-deep-review/references/state_format.md`
   194	- `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`
   195	- `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`
   196	- `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`
   197	- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
   198	- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
   199	- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
   200	- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
   201	- `.opencode/agent/deep-research.md`
   202	- `.opencode/agent/deep-review.md`
   203	
   204	**Estimated complexity**: High
   205	
   206	**Verification strategy**:
   207	- Ledger fixtures prove `verified`, `contradicted`, and `unresolved` claims render into synthesis metadata with downgrade conditions and provenance.
   208	- Semantic convergence fixtures assert novelty, contradiction density, and citation overlap participate in typed stop-decision traces instead of scalar-only thresholds.
   209	- Review contract tests prove machine-owned strategy sections are reducer-owned and no longer edited directly by `@deep-review`.
   210	
   211	### Phase 3: Behavior-First Verification
   212	
   213	**Scope**: REQ-006 plus supporting coverage for REQ-001 through REQ-019
   214	
   215	**Why now**: This phase starts immediately after Phase 1 contracts stabilize so replay harnesses can protect substrate and trust-surface work while those phases are still being implemented.
   216	
   217	**Files to change**:
   218	- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts`
   219	- `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts`
   220	- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`
   221	- `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts`
   222	- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/028/`
   223	- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/040/`
   224	- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/042/`
   225	
   226	**Estimated complexity**: High
   227	
   228	**Verification strategy**:
   229	- Create thin end-to-end harnesses first for invalid-state, resume, completed-continue, blocked-stop, and compaction-equivalence replay.
   230	- Research behavior tests should assert falsifiable question framing, citation presence, conclusion confidence, clustering, semantic convergence, and stop-reason persistence.
   231	- Review behavior tests should assert dimension rotation, citation presence, hotspot ranking, claim-adjudication gate enforcement, reducer-owned machine sections, and stop-reason persistence.
   232	
   233	### Phase 4: Parity and Mirror Alignment
   234	
   235	**Scope**: REQ-012, REQ-013
   236	
   237	**Why after early verification**: Once the foundational and trust contracts have replay-backed coverage, parity and mirror alignment can move as one bounded follow-on without guessing at unstable interim surfaces.
   238	
   239	**Files to change**:
   240	- `.opencode/command/spec_kit/deep-research.md`
   241	- `.opencode/command/spec_kit/deep-review.md`
   242	- `.opencode/skill/sk-deep-research/references/quick_reference.md`
   243	- `.opencode/skill/sk-deep-review/references/quick_reference.md`
   244	- `.claude/agents/deep-research.md`
   245	- `.gemini/agents/deep-research.md`
   246	- `.codex/agents/deep-research.toml`
   247	- `.agents/agents/deep-research.md`
   248	- `.claude/agents/deep-review.md`
   249	- `.gemini/agents/deep-review.md`
   250	- `.codex/agents/deep-review.toml`
   251	- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`
   252	- `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts`
   253	
   254	**Estimated complexity**: Medium
   255	
   256	**Verification strategy**:
   257	- Contract parity tests must fail before mirror drift can land.
   258	- Operator-facing command examples should remain compact while replay, observability, and advanced modes are discoverable.
   259	- Confirm-mode and auto-mode docs should describe the same artifacts, lifecycle terms, and reducer-ownership boundaries.
   260	
FILE:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md
     1	---
     2	title: "Tasks: Deep Research and Deep Review Runtime Improvement Bundle [042]"
     3	description: "Task Format: T### [P?] Description (file path)"
     4	trigger_phrases:
     5	  - "042"
     6	  - "tasks"
     7	  - "deep research"
     8	  - "deep review"
     9	  - "runtime improvement"
    10	importance_tier: "important"
    11	contextType: "planning"
    12	---
    13	# Tasks: Deep Research and Deep Review Runtime Improvement Bundle
    14	
    15	<!-- SPECKIT_LEVEL: 3 -->
    16	<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
    17	
    18	---
    19	
    20	<!-- ANCHOR:notation -->
    21	## Task Notation
    22	
    23	| Prefix | Meaning |
    24	|--------|---------|
    25	| `[ ]` | Pending |
    26	| `[x]` | Completed |
    27	| `[P]` | Parallelizable |
    28	| `[B]` | Blocked |
    29	
    30	**Task Format**: `T### [P?] Description (file path)`
    31	<!-- /ANCHOR:notation -->
    32	
    33	---
    34	
    35	### AI Execution Protocol
    36	
    37	### Pre-Task Checklist
    38	- Confirm the target requirement and packet phase before editing.
    39	- Confirm the exact files in scope for the task.
    40	- Confirm the behavior or parity check that will prove the task is complete.
    41	
    42	### Execution Rules
    43	
    44	| Rule | Requirement |
    45	|------|-------------|
    46	| `REQ-LINKED` | Every task must map to at least one packet requirement. |
    47	| `FILES-EXPLICIT` | Every task must name its concrete file targets before implementation starts. |
    48	| `OPT-IN-LAST` | Council and coordination-board tasks stay behind the foundational runtime work. |
    49	| `VERIFY-WITH-TESTS` | Behavior/parity/reducer tests are the closeout gate for implementation tasks. |
    50	
    51	### Status Reporting Format
    52	- `pending`: task has not started and still matches the current packet scope.
    53	- `in-progress`: active implementation or validation work is underway.
    54	- `blocked`: task is waiting on a prerequisite contract or failing verification.
    55	- `completed`: implementation and listed verification steps are done.
    56	
    57	### Blocked Task Protocol
    58	- If a task depends on an unresolved stop/done/resume contract, mark it blocked instead of starting partial implementation.
    59	- If parity or behavior tests fail, keep the task open until the failing contract is reconciled.
    60	- If scope expands beyond the packet, split follow-on work into a separate packet instead of widening the task silently.
    61	
    62	---
    63	
    64	<!-- ANCHOR:phase-1 -->
    65	## Phase 1: Setup
    66	
    67	### Phase 1: Runtime Foundation
    68	
    69	| Task ID | Status | Parent REQ | Files |
    70	|---------|--------|------------|-------|
    71	| T001 | Pending | REQ-001 | `.opencode/skill/sk-deep-research/SKILL.md`; `.opencode/skill/sk-deep-research/references/convergence.md`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
    72	| T002 | Pending | REQ-001 | `.opencode/skill/sk-deep-review/SKILL.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/skill/sk-deep-review/references/convergence.md`; `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
    73	| T003 | Pending | REQ-002, REQ-014 | `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-research/references/convergence.md`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
    74	| T004 | Pending | REQ-002, REQ-014 | `.opencode/skill/sk-deep-review/references/loop_protocol.md`; `.opencode/skill/sk-deep-review/references/convergence.md`; `.opencode/command/spec_kit/deep-review.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
    75	| T005 | Pending | REQ-003 | `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
    76	| T006 | Pending | REQ-003 | `.opencode/skill/sk-deep-review/assets/deep_review_config.json`; `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/command/spec_kit/deep-review.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
    77	
    78	- [ ] T001 Define the shared stop-reason taxonomy for deep research.
    79	- [ ] T002 Define the shared stop-reason taxonomy for deep review.
    80	- [ ] T003 Add the legal done-gate model to deep research.
    81	- [ ] T004 Add the legal done-gate model to deep review.
    82	- [ ] T005 Add resume/start-from-run semantics to deep research.
    83	- [ ] T006 Add resume/start-from-run semantics to deep review.
    84	<!-- /ANCHOR:phase-1 -->
    85	
    86	---
    87	
    88	<!-- ANCHOR:phase-2 -->
    89	## Phase 2: Implementation
    90	
    91	Delivery order inside this template section remains `Phase 2a -> Phase 2b -> Phase 4 -> Phase 5`, while `Phase 3` stays in the verification section below for template compliance.
    92	
    93	### Phase 2a: State and Observability Substrate
    94	
    95	| Task ID | Status | Parent REQ | Files |
    96	|---------|--------|------------|-------|
    97	| T007 | Pending | REQ-004 | `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/agent/deep-research.md` |
    98	| T008 | Pending | REQ-004 | `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`; `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/agent/deep-review.md` |
    99	| T010 | Pending | REQ-007 | `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
   100	| T011 | Pending | REQ-007 | `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
   101	| T025 | Pending | REQ-015 | `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
   102	| T026 | Pending | REQ-015 | `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
   103	| T027 | Pending | REQ-016 | `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
   104	| T028 | Pending | REQ-016 | `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
   105	| T029 | Pending | REQ-017 | `.opencode/skill/sk-deep-review/references/loop_protocol.md`; `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/agent/deep-review.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |
   106	| T030 | Pending | REQ-017 | `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/agent/deep-research.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` |
   107	
   108	- [ ] T007 Add the deep-research audit journal and journal-aware rollups.
   109	- [ ] T008 Add the deep-review audit journal and journal-aware rollups.
   110	- [ ] T010 Extend the deep-research dashboard and reducer metrics.
   111	- [ ] T011 Extend the deep-review dashboard and contract metrics.
   112	- [ ] T025 Implement reducer snapshot/compaction for deep research.
   113	- [ ] T026 Implement reducer snapshot/compaction for deep review.
   114	- [ ] T027 Add observability surfaces to deep-research dashboards and reducer.
   115	- [ ] T028 Add observability surfaces to deep-review dashboards and reducer.
   116	- [ ] T029 Add large-target decomposition to deep review with inventory and hotspot ranking.
   117	- [ ] T030 Add domain clustering to deep research for large source sets.
   118	<!-- /ANCHOR:phase-2 -->
   119	
   120	---
   121	
   122	### Phase 2b: Trust Surfaces, Ledgers, and Critique
   123	
   124	| Task ID | Status | Parent REQ | Files |
   125	|---------|--------|------------|-------|
   126	| T009 | Pending | REQ-005 | `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/agent/deep-research.md` |
   127	| T012 | Pending | REQ-008, REQ-009 | `.opencode/skill/sk-deep-research/SKILL.md`; `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/agent/deep-research.md` |
   128	| T031 | Pending | REQ-018 | `.opencode/skill/sk-deep-research/references/convergence.md`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
   129	| T032 | Pending | REQ-018 | `.opencode/skill/sk-deep-review/references/convergence.md`; `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
   130	| T033 | Pending | REQ-019 | `.opencode/skill/sk-deep-review/SKILL.md`; `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/agent/deep-review.md`; `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts` |
   131	
   132	- [ ] T009 Add the deep-research claim-verification ledger contract and synthesis references.
   133	- [ ] T012 Add publication critique, runtime inventory, and promotion-checkpoint sections to deep research.
   134	- [ ] T031 Add semantic novelty and contradiction-graph convergence signals to deep research.
   135	- [ ] T032 Add semantic novelty convergence signals to deep review.
   136	- [ ] T033 Make deep-review machine-owned strategy sections reducer-owned.
   137	
   138	---
   139	
   140	<!-- ANCHOR:phase-3 -->
   141	## Phase 3: Verification
   142	
   143	### Phase 3: Behavior-First Verification
   144	
   145	| Task ID | Status | Parent REQ | Files |
   146	|---------|--------|------------|-------|
   147	| T017 | Pending | REQ-006 | `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts` |
   148	| T018 | Pending | REQ-006 | `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` |
   149	| T019 | Pending | REQ-006, REQ-015, REQ-016, REQ-018 | `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` |
   150	| T020 | Pending | REQ-006, REQ-015, REQ-016, REQ-019 | `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json` |
   151	| T034 | Pending | REQ-006 | `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/028/`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/040/`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/042/`; `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` |
   152	
   153	- [ ] T017 Create deep-research behavior-first tests.
   154	- [ ] T018 Create deep-review behavior-first tests.
   155	- [ ] T019 Extend deep-research reducer tests for journal, snapshot, semantic-convergence, and dashboard-observability behavior.
   156	- [ ] T020 Extend deep-review reducer/schema tests for stop reasons, snapshots, observability metrics, reducer-owned sections, and resume cursor fields.
   157	- [ ] T034 Create replay corpus from existing packet families `028`, `040`, and `042`.
   158	
   159	---
   160	
   161	### Phase 4: Parity and Mirror Alignment
   162	
   163	| Task ID | Status | Parent REQ | Files |
   164	|---------|--------|------------|-------|
   165	| T013 | Pending | REQ-012 | `.opencode/command/spec_kit/deep-research.md`; `.opencode/skill/sk-deep-research/references/quick_reference.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
   166	| T014 | Pending | REQ-012 | `.opencode/command/spec_kit/deep-review.md`; `.opencode/skill/sk-deep-review/references/quick_reference.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
   167	| T015 | Pending | REQ-013 | `.opencode/agent/deep-research.md`; `.claude/agents/deep-research.md`; `.gemini/agents/deep-research.md`; `.codex/agents/deep-research.toml`; `.agents/agents/deep-research.md` |
   168	| T016 | Pending | REQ-013 | `.opencode/agent/deep-review.md`; `.claude/agents/deep-review.md`; `.gemini/agents/deep-review.md`; `.codex/agents/deep-review.toml` |
   169	| T021 | Pending | REQ-013 | `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` |
   170	
   171	- [ ] T013 Update deep-research command docs and quick-reference surfaces.
   172	- [ ] T014 Update deep-review command docs and quick-reference surfaces.
   173	- [ ] T015 Update canonical deep-research contracts and runtime mirrors to preserve parity.
   174	- [ ] T016 Update canonical deep-review contracts and runtime mirrors to preserve parity.
   175	- [ ] T021 Extend deep-research and deep-review contract parity tests for the new artifact paths and lifecycle fields.
   176	
   177	---
   178	
   179	### Phase 5: Optional Advanced Modes
   180	
   181	| Task ID | Status | Parent REQ | Files |
   182	|---------|--------|------------|-------|
   183	| T022 | Pending | REQ-010 | `.opencode/skill/sk-deep-research/SKILL.md`; `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`; `.opencode/agent/deep-research.md` |
   184	| T023 | Pending | REQ-011 | `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` |
   185	| T024 | Pending | REQ-010, REQ-011 | `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` |
   186	
   187	- [ ] T022 Add council-style synthesis as an explicit opt-in deep-research profile.
   188	- [ ] T023 Add the packet-local coordination-board artifact for large multi-phase research.
   189	- [ ] T024 Add behavior/parity coverage proving that council mode and coordination-board mode remain optional.
   190	
   191	<!-- /ANCHOR:phase-3 -->
   192	
   193	---
   194	
   195	<!-- ANCHOR:completion -->
   196	## Completion Criteria
   197	
   198	- [ ] Every task remains mapped to a parent requirement and concrete file set
   199	- [ ] No task is left without a verification path
   200	- [ ] Behavior/replay harness work begins once Phase 1 contracts are stable and stays ahead of parity lock
   201	- [ ] Optional advanced-mode work remains sequenced after foundational runtime truth, substrate hardening, and parity lock
   202	<!-- /ANCHOR:completion -->
   203	
   204	---
   205	
   206	<!-- ANCHOR:cross-refs -->
   207	## Cross-References
   208	
   209	- **Specification**: See `spec.md`
   210	- **Implementation Plan**: See `plan.md`
   211	- **Verification Checklist**: See `checklist.md`
   212	- **Decision Record**: See `decision-record.md`
   213	<!-- /ANCHOR:cross-refs -->
FILE:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md
     1	---
     2	title: "Decision Record: Deep Research and Deep Review Runtime Improvement Bundle [042]"
     3	description: "Architecture decisions for stop reasons, claim-verification storage, dashboard generation, council synthesis, and coordination-board state."
     4	trigger_phrases:
     5	  - "042"
     6	  - "decision record"
     7	  - "stop reason taxonomy"
     8	  - "claim ledger"
     9	  - "council synthesis"
    10	importance_tier: "important"
    11	contextType: "planning"
    12	---
    13	# Decision Record: Deep Research and Deep Review Runtime Improvement Bundle
    14	
    15	<!-- SPECKIT_LEVEL: 3 -->
    16	<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
    17	
    18	---
    19	
    20	<!-- ANCHOR:adr-001 -->
    21	## ADR-001: Shared Stop-Reason Taxonomy and Legal Done Gate
    22	
    23	### Metadata
    24	
    25	| Field | Value |
    26	|-------|-------|
    27	| **Status** | Proposed |
    28	| **Date** | 2026-04-10 |
    29	| **Deciders** | Packet 042 planning author |
    30	
    31	### Context
    32	
    33	We need a runtime answer to "why did this loop stop?" that works across both deep research and deep review. Right now stop behavior is partly implied by convergence math, partly spread across workflow steps, and not strong enough for recovery, dashboards, or user trust.
    34	
    35	### Constraints
    36	
    37	- The taxonomy must work for both research and review without turning them into the same product.
    38	- STOP must remain auditable from packet-local artifacts.
    39	
    40	### Decision
    41	
    42	**We chose**: a shared named stop-reason taxonomy plus a separate legal done gate.
    43	
    44	**How it works**: Each loop records `stopReason` from the same small taxonomy, while the legal done gate decides whether STOP is actually allowed. This keeps reason reporting simple and keeps the enforcement logic explicit.
    45	
    46	### Alternatives Considered
    47	
    48	| Option | Pros | Cons | Score |
    49	|--------|------|------|-------|
    50	| **Shared taxonomy + legal done gate** | One reporting language, explicit enforcement, easy dashboarding | Requires coordinated updates across many assets | 9/10 |
    51	| Free-text stop reasons per loop | Fast to write | Not machine-friendly, drifts quickly, poor parity | 4/10 |
    52	| Separate taxonomies for research and review | Preserves product differences | Harder parity and resume behavior, more operator confusion | 5/10 |
    53	
    54	**Why this one**: It gives us a compact, auditable vocabulary without pretending research and review are the same workflow.
    55	
    56	### Consequences
    57	
    58	**What improves**:
    59	- Dashboards, synthesis, and journals can report a single reason vocabulary.
    60	- Blocked-stop cases become explicit instead of hidden in convergence math.
    61	
    62	**What it costs**:
    63	- We need synchronized changes across commands, assets, agents, and tests. Mitigation: make parity tests part of the same wave.
    64	
    65	**Risks**:
    66	
    67	| Risk | Impact | Mitigation |
    68	|------|--------|------------|
    69	| Taxonomy becomes too broad or too vague | Medium | Keep the enum small and use detail fields for nuance. |
    70	
    71	### Five Checks Evaluation
    72	
    73	| # | Check | Result | Evidence |
    74	|---|-------|--------|----------|
    75	| 1 | **Necessary?** | PASS | Stop behavior is a direct trust gap from `CF-010`. |
    76	| 2 | **Beyond Local Maxima?** | PASS | We considered free-text and per-loop taxonomies. |
    77	| 3 | **Sufficient?** | PASS | Small enum plus done gate covers reporting and enforcement. |
    78	| 4 | **Fits Goal?** | PASS | Runtime truth is a primary packet goal. |
    79	| 5 | **Open Horizons?** | PASS | Supports future dashboards and continuation tooling without forcing a DSL rewrite. |
    80	
    81	**Checks Summary**: 5/5 PASS
    82	
    83	### Implementation
    84	
    85	**What changes**:
    86	- Skill references, workflow assets, dashboards, agents, and parity tests adopt the shared taxonomy.
    87	- Reducer/test surfaces learn blocked-stop reporting and resume-safe stop metadata.
    88	
    89	**How to roll back**: Revert the new enum/done-gate fields together and restore the prior stop reporting language in skills, commands, agents, and parity tests.
    90	<!-- /ANCHOR:adr-001 -->
    91	
    92	---
    93	
    94	### ADR-002: Claim-Verification Ledger Uses JSONL Canonical Storage With Rendered Summaries
    95	
    96	#### Metadata
    97	
    98	| Field | Value |
    99	|-------|-------|
   100	| **Status** | Proposed |
   101	| **Date** | 2026-04-10 |
   102	| **Deciders** | Packet 042 planning author |
   103	
   104	#### Context
   105	
   106	Research packets need a durable way to show whether major claims were verified, contradicted, or left unresolved. A ledger must be machine-friendly enough for reducers and synthesis, but still readable in packet outputs.
   107	
   108	#### Constraints
   109	
   110	- The ledger must be append-friendly and packet-local.
   111	- It should not require hand-maintained duplication between machine and human views.
   112	
   113	#### Decision
   114	
   115	**We chose**: JSONL as the canonical ledger format, with rendered markdown summaries in synthesis/dashboard outputs when needed.
   116	
   117	**How it works**: The runtime writes structured ledger entries as JSONL so reducers and tests can reason over them. Research synthesis can then summarize those entries in human-readable tables or narrative sections without making markdown the source of truth.
   118	
   119	#### Alternatives Considered
   120	
   121	| Option | Pros | Cons | Score |
   122	|--------|------|------|-------|
   123	| **Canonical JSONL + rendered markdown** | Append-only, machine-friendly, easy reducer use, still human-readable through renderers | Requires one extra render path | 9/10 |
   124	| Markdown table only | Easy for humans to skim | Brittle for automated checks and append-only workflows | 5/10 |
   125	| JSON only, no rendered summary | Very machine-friendly | Poor packet readability and synthesis ergonomics | 6/10 |
   126	
   127	**Why this one**: It keeps the runtime truthful and testable without making humans read raw JSONL for every synthesis.
   128	
   129	#### Consequences
   130	
   131	**What improves**:
   132	- Claim status becomes reducer- and test-friendly.
   133	- Research summaries can cite the ledger without becoming hand-maintained ledgers themselves.
   134	
   135	**What it costs**:
   136	- Reducers or synthesis paths need a render step. Mitigation: keep markdown summaries derived, not editable.
   137	
   138	**Risks**:
   139	
   140	| Risk | Impact | Mitigation |
   141	|------|--------|------------|
   142	| Ledger becomes noisy and underused | Medium | Restrict canonical use to major claims and promotion checkpoints. |
   143	
   144	#### Five Checks Evaluation
   145	
   146	| # | Check | Result | Evidence |
   147	|---|-------|--------|----------|
   148	| 1 | **Necessary?** | PASS | `CF-014` asks for explicit verification status tied to evidence. |
   149	| 2 | **Beyond Local Maxima?** | PASS | We compared markdown-only and JSON-only approaches. |
   150	| 3 | **Sufficient?** | PASS | JSONL plus rendered summaries keeps one canonical truth. |
   151	| 4 | **Fits Goal?** | PASS | Trustworthy research output is a core packet objective. |
   152	| 5 | **Open Horizons?** | PASS | Supports future dashboard, search, and promotion-checkpoint tooling. |
   153	
   154	**Checks Summary**: 5/5 PASS
   155	
   156	#### Implementation
   157	
   158	**What changes**:
   159	- Research state docs, reducer logic, and synthesis contracts define the ledger path and entry schema.
   160	- Behavior tests add verified/contradicted/unresolved coverage.
   161	
   162	**How to roll back**: Remove the JSONL ledger artifact and revert synthesis/dashboard references to the prior citation-only model.
   163	
   164	---
   165	
   166	### ADR-003: Dashboards Stay Generated Markdown, Backed by Structured Metrics
   167	
   168	#### Metadata
   169	
   170	| Field | Value |
   171	|-------|-------|
   172	| **Status** | Proposed |
   173	| **Date** | 2026-04-10 |
   174	| **Deciders** | Packet 042 planning author |
   175	
   176	#### Context
   177	
   178	The dashboards need richer runtime truth, but the repo already uses markdown dashboards as the packet-local observability surface. We need to decide whether to keep generated markdown, move to JSON-only, or introduce a richer HTML/UI artifact.
   179	
   180	#### Constraints
   181	
   182	- The result must stay easy to review in git and packet folders.
   183	- It must remain reducer-friendly and runtime-agnostic.
   184	
   185	#### Decision
   186	
   187	**We chose**: keep dashboards as generated markdown, backed by structured reducer metrics and canonical state artifacts.
   188	
   189	**How it works**: Reducers compute metrics from JSONL, journals, ledgers, and strategy/config files. Generated markdown remains the human-facing dashboard, while machine-readable sources stay authoritative underneath.
   190	
   191	#### Alternatives Considered
   192	
   193	| Option | Pros | Cons | Score |
   194	|--------|------|------|-------|
   195	| **Generated markdown backed by structured metrics** | Git-friendly, packet-local, easy recovery surface, no extra UI stack | Needs careful renderer upkeep | 9/10 |
   196	| JSON-only dashboards | Easy to compute | Poor operator ergonomics | 5/10 |
   197	| HTML or app-based dashboards | Rich visuals | Too much infrastructure for packet-local runtime truth | 4/10 |
   198	
   199	**Why this one**: It preserves the existing packet-local operator workflow while allowing richer structured metrics underneath.
   200	
   201	#### Consequences
   202	
   203	**What improves**:
   204	- Operators keep a git-visible dashboard surface.
   205	- Reducers can expand metrics without turning dashboards into manually curated docs.
   206	
   207	**What it costs**:
   208	- Markdown renderers need to stay synchronized with state schemas. Mitigation: reducer and parity tests become mandatory.
   209	
   210	**Risks**:
   211	
   212	| Risk | Impact | Mitigation |
   213	|------|--------|------------|
   214	| Dashboard sections drift from state schema | Medium | Test section presence and metric mapping in reducer/parity suites. |
   215	
   216	#### Five Checks Evaluation
   217	
   218	| # | Check | Result | Evidence |
   219	|---|-------|--------|----------|
   220	| 1 | **Necessary?** | PASS | `CF-010` explicitly calls for richer runtime health signals and summaries. |
   221	| 2 | **Beyond Local Maxima?** | PASS | We compared structured-only and richer UI alternatives. |
   222	| 3 | **Sufficient?** | PASS | Generated markdown already fits packet-local workflows. |
   223	| 4 | **Fits Goal?** | PASS | The goal is better runtime truth, not a new UI product. |
   224	| 5 | **Open Horizons?** | PASS | Structured metrics could power future renderers without changing packet truth. |
   225	
   226	**Checks Summary**: 5/5 PASS
   227	
   228	#### Implementation
   229	
   230	**What changes**:
   231	- Dashboard assets expand in both skills.
   232	- Reducer/test surfaces learn the new metrics and section rendering.
   233	
   234	**How to roll back**: Revert the new dashboard metrics/sections while keeping the current generated-markdown pattern intact.
   235	
   236	---
   237	
   238	### ADR-004: Council Synthesis Is Opt-In and Lives Inside Deep Research
   239	
   240	#### Metadata
   241	
   242	| Field | Value |
   243	|-------|-------|
   244	| **Status** | Proposed |
   245	| **Date** | 2026-04-10 |
   246	| **Deciders** | Packet 042 planning author |
   247	
   248	#### Context
   249	
   250	The research corpus suggests council-style synthesis for ambiguous cases, but it also warns that the mode is expensive and failure-prone if treated as default behavior.
   251	
   252	#### Constraints
   253	
   254	- We need optional perspective isolation without creating a separate parallel product.
   255	- Default deep-research behavior must remain lean.
   256	
   257	#### Decision
   258	
   259	**We chose**: implement council synthesis as an opt-in profile inside deep research rather than as a default mode or a separate command family.
   260	
FILE:.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist.md
     1	---
     2	title: "Verification Checklist: Deep Research and Deep Review Runtime Improvement Bundle [042]"
     3	description: "Verification Date: 2026-04-10"
     4	trigger_phrases:
     5	  - "042"
     6	  - "verification checklist"
     7	  - "deep research"
     8	  - "deep review"
     9	importance_tier: "important"
    10	contextType: "planning"
    11	---
    12	# Verification Checklist: Deep Research and Deep Review Runtime Improvement Bundle
    13	
    14	<!-- SPECKIT_LEVEL: 3 -->
    15	<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
    16	
    17	---
    18	
    19	<!-- ANCHOR:protocol -->
    20	## Verification Protocol
    21	
    22	| Priority | Handling | Completion Impact |
    23	|----------|----------|-------------------|
    24	| **[P0]** | HARD BLOCKER | Cannot claim runtime-truth completion until verified |
    25	| **[P1]** | Required | Must complete or be explicitly deferred |
    26	| **[P2]** | Optional | Not used in this planning packet |
    27	<!-- /ANCHOR:protocol -->
    28	
    29	---
    30	
    31	<!-- ANCHOR:pre-impl -->
    32	## Pre-Implementation
    33	
    34	- [ ] CHK-001 [P0] REQ-001 stop-reason taxonomy is documented consistently across both loop products [EVIDENCE: exact artifact paths and JSON field names for `stopReason`] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
    35	- [ ] CHK-002 [P0] REQ-002 legal done-gate behavior is defined for blocked-stop cases [EVIDENCE: workflow steps and fixture outputs showing blocked STOP rather than silent termination] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
    36	- [ ] CHK-003 [P0] REQ-003 resume/start-from-run semantics are defined in command, state, and workflow contracts [EVIDENCE: command/state excerpts naming `continuedFromRun` or equivalent cursor fields] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
    37	- [ ] CHK-004 [P1] Required Level 3 packet files exist and remain synchronized [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`] [TESTS: strict validator]
    38	<!-- /ANCHOR:pre-impl -->
    39	
    40	---
    41	
    42	<!-- ANCHOR:code-quality -->
    43	## Code Quality
    44	
    45	- [ ] CHK-010 [P0] REQ-004 audit journals are packet-local and append-only in both loop contracts [EVIDENCE: journal path, append-only rules, and reducer/dashboard references] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`]
    46	- [ ] CHK-011 [P0] REQ-005 claim-verification ledger is defined with `verified`, `contradicted`, and `unresolved` statuses [EVIDENCE: ledger schema/path and synthesis references] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-research-reducer.vitest.ts`]
    47	- [ ] CHK-012 [P1] REQ-013 parity alignment is enforced by contract tests and does not depend on manual memory of the change set [EVIDENCE: parity assertions referencing the new artifact paths and lifecycle fields] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
    48	- [ ] CHK-013 [P1] REQ-015 delta replay plus periodic snapshot/compaction is defined for both loops [EVIDENCE: snapshot artifact path, compaction trigger policy, and replay-equivalence statement] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`]
    49	- [ ] CHK-014 [P1] REQ-019 deep-review machine-owned strategy sections are reducer-owned and not directly agent-edited [EVIDENCE: reducer-owned section markers, agent boundary language, and review contract fields] [TESTS: `deep-review-reducer-schema.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
    50	<!-- /ANCHOR:code-quality -->
    51	
    52	---
    53	
    54	<!-- ANCHOR:testing -->
    55	## Testing
    56	
    57	- [ ] CHK-020 [P0] REQ-006 behavior-first tests exist for deep research and deep review [EVIDENCE: new behavioral test file paths and scenario coverage] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
    58	- [ ] CHK-021 [P1] REQ-007 richer dashboard metrics are validated in reducer/schema coverage [EVIDENCE: dashboard sections and reducer-metric references] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`]
    59	- [ ] CHK-022 [P1] REQ-010 council-style synthesis remains opt-in and does not alter default flows [EVIDENCE: command/profile docs and optional-mode fixture output] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-research-contract-parity.vitest.ts`]
    60	- [ ] CHK-023 [P1] REQ-011 coordination board remains packet-local and optional [EVIDENCE: board schema/strategy sections and fixture output] [TESTS: `deep-research-behavioral.vitest.ts`]
    61	- [ ] CHK-024 [P1] REQ-016 packet-local observability exposes timing/tool/token histograms, state diffs, anomaly flags, and stop-decision drill-down [EVIDENCE: dashboard section names plus `durationMs`, `toolsUsed`, `sourcesQueried`, and anomaly/state-diff fields] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`; `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
    62	- [ ] CHK-025 [P1] REQ-017 large-target decomposition rules exist for both 1000+ file review scopes and 50+ domain research scopes [EVIDENCE: review inventory/hotspot fields, research clustering/sampling fields, and large-scope fixture scenarios] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
    63	- [ ] CHK-026 [P1] REQ-018 semantic convergence participates in typed stop-decision traces instead of scalar-only thresholds [EVIDENCE: semantic novelty, contradiction density, citation-overlap fields, and blocked-stop examples] [TESTS: `deep-research-reducer.vitest.ts`; `deep-review-reducer-schema.vitest.ts`; `deep-research-behavioral.vitest.ts`; `deep-review-behavioral.vitest.ts`]
    64	<!-- /ANCHOR:testing -->
    65	
    66	---
    67	
    68	<!-- ANCHOR:security -->
    69	## Security
    70	
    71	- [ ] CHK-030 [P0] REQ-002 and REQ-014 keep STOP legality and state truth explicit enough to avoid hidden runtime state or non-auditable termination behavior [EVIDENCE: explicit stop-gate and packet-local artifact rules] [TESTS: behavior and parity suites]
    72	- [ ] CHK-031 [P1] REQ-008 publication critique keeps weaker evidence classes visible instead of silently promoting them [EVIDENCE: evidence-class or critique fields in research contracts] [TESTS: `deep-research-behavioral.vitest.ts`]
    73	- [ ] CHK-032 [P1] REQ-009 promotion checkpoints prevent low-evidence findings from being treated as adoption-ready [EVIDENCE: checkpoint threshold fields and synthesis references] [TESTS: `deep-research-behavioral.vitest.ts`; `deep-research-contract-parity.vitest.ts`]
    74	<!-- /ANCHOR:security -->
    75	
    76	---
    77	
    78	<!-- ANCHOR:docs -->
    79	## Documentation
    80	
    81	- [ ] CHK-040 [P1] REQ-012 keeps default command guidance compact while advanced modes remain discoverable [EVIDENCE: quick-reference and command examples] [TESTS: `deep-research-contract-parity.vitest.ts`; `deep-review-contract-parity.vitest.ts`]
    82	- [ ] CHK-041 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` remain synchronized after implementation planning updates [EVIDENCE: manual doc cross-check] [TESTS: strict validator]
    83	- [ ] CHK-042 [P1] `implementation-summary.md` remains a placeholder only until implementation finishes [EVIDENCE: placeholder-only content review] [TESTS: strict validator]
    84	<!-- /ANCHOR:docs -->
    85	
    86	---
    87	
    88	<!-- ANCHOR:file-org -->
    89	## File Organization
    90	
    91	- [ ] CHK-050 [P1] Planned runtime artifacts stay inside existing `research/` or `review/` packet boundaries unless the packet explicitly creates an optional advanced-mode artifact there [EVIDENCE: file-path review in spec/tasks] [TESTS: parity suites]
    92	- [ ] CHK-051 [P1] New behavior-test files remain under `.opencode/skill/system-spec-kit/scripts/tests/` as planned [EVIDENCE: test file paths present in repo and referenced in docs] [TESTS: `rg --files` plus `pnpm vitest`]
    93	- [ ] CHK-052 [P1] Strict packet validation passes after the documentation and implementation work are complete [EVIDENCE: validator PASS output] [TESTS: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2 --strict`]
    94	<!-- /ANCHOR:file-org -->
    95	
    96	---
    97	
    98	<!-- ANCHOR:summary -->
    99	## Verification Summary
   100	
   101	| Category | Total | Planned |
   102	|----------|-------|---------|
   103	| P0 Items | 7 | 7 |
   104	| P1 Items | 15 | 15 |
   105	
   106	**Verification Date**: 2026-04-10
   107	**Packet Status**: Planning only. Checklist items remain pending until implementation work begins.
   108	<!-- /ANCHOR:summary -->

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
I’ve got the packet and top-level runtime surfaces loaded. There’s already one concrete mismatch showing up: the packet proposes a new shared stop taxonomy, but the current runtime still uses older stop labels like `all_dimensions_covered` and `stuck_unrecoverable`, so part of this pass is now checking whether the spec is describing an upgrade or accidentally papering over real behavior drift.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'wc -l .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/references/state_format.md .opencode/skill/sk-deep-research/assets/deep_research_config.json .opencode/skill/sk-deep-research/scripts/reduce-state.cjs .opencode/skill/sk-deep-review/references/convergence.md .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/agent/deep-research.md .opencode/agent/deep-review.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     857 .opencode/skill/sk-deep-research/references/convergence.md
     751 .opencode/skill/sk-deep-research/references/loop_protocol.md
     787 .opencode/skill/sk-deep-research/references/state_format.md
      57 .opencode/skill/sk-deep-research/assets/deep_research_config.json
     553 .opencode/skill/sk-deep-research/scripts/reduce-state.cjs
     433 .opencode/skill/sk-deep-review/references/convergence.md
     769 .opencode/skill/sk-deep-review/references/loop_protocol.md
     490 .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml
     535 .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
     766 .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml
     473 .opencode/agent/deep-research.md
     601 .opencode/agent/deep-review.md
     514 .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md
     213 .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md
    7799 total

exec
/bin/zsh -lc 'rg -n "stopReason|all_dimensions_covered|all_dimensions_clean|stuck_unrecoverable|max_iterations|converged|insufficient_evidence|user_stopped|error_budget_exhausted|blocked-stop|blocked stop|quality guard|coverage|resume|restart|fork|completed-continue|continuedFromRun|journal|ledger|dashboard|reducer-owned|ownership|semantic convergence|noveltyJustification|pause|resumed|invalid-state|completed-session" .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/references/state_format.md .opencode/skill/sk-deep-research/assets/deep_research_config.json .opencode/skill/sk-deep-research/scripts/reduce-state.cjs .opencode/skill/sk-deep-review/references/convergence.md .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/agent/deep-research.md .opencode/agent/deep-review.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-research/assets/deep_research_config.json:20:      "resume",
.opencode/skill/sk-deep-research/assets/deep_research_config.json:21:      "restart",
.opencode/skill/sk-deep-research/assets/deep_research_config.json:22:      "fork",
.opencode/skill/sk-deep-research/assets/deep_research_config.json:23:      "completed-continue"
.opencode/skill/sk-deep-research/assets/deep_research_config.json:26:    "continuedFromRun": null
.opencode/skill/sk-deep-research/assets/deep_research_config.json:32:    "dashboardFile": "research/deep-research-dashboard.md",
.opencode/skill/sk-deep-research/assets/deep_research_config.json:45:  "pauseSentinelPath": "research/.deep-research-pause",
.opencode/skill/sk-deep-research/assets/deep_research_config.json:52:    "deep-research-dashboard.md": "auto-generated",
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:244:  const coverageBySources = buildCoverageBySources(iterationFiles, iterationRecords);
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:272:      coverageBySources,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:440:    `- coverageBySources: ${JSON.stringify(registry.metrics.coverageBySources)}`,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:468: * strategy, and dashboard outputs. Idempotent: repeated calls produce identical results.
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:473: * @returns {Object} Paths and content for registry, strategy, and dashboard
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:483:  const dashboardPath = path.join(researchDir, 'deep-research-dashboard.md');
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:499:  const dashboard = renderDashboard(config, registry, records, iterationFiles);
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:504:    writeUtf8(dashboardPath, dashboard);
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:512:    dashboardPath,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:515:    dashboard,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:535:        dashboardPath: result.dashboardPath,
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:112:    - id: coverage
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:116:        - severity-coverage
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:133:      - id: dimension-coverage
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:135:        description: Coverage vote based on required dimension completion plus required protocol coverage stability.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:140:    coverageAge:
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:150:    - id: resume
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:152:    - id: restart
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:154:    - id: fork
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:156:    - id: completed-continue
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:164:    - continuedFromRun
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:174:      - dashboardMetrics
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:184:      description: Review is ongoing or coverage is incomplete.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:185:    - id: converged
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:231:      partialCriteria: Catalog coverage is incomplete or stale, but no confirmed contradiction to shipped behavior is present.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:252:        - continuedFromRun
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:292:    dashboard:
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:293:      pathPattern: "{spec_folder}/review/deep-review-dashboard.md"
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:298:        - dimension-coverage
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:301:    pauseSentinel:
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:302:      pathPattern: "{spec_folder}/review/.deep-review-pause"
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:304:      description: Operator-controlled sentinel checked between iterations to pause the loop without discarding state.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:327:          - continuedFromRun
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:331:          - coverage
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:332:          - noveltyJustification
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:349:          - stopReason
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:357:      ownership: mixed
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:371:      ownership: mixed
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:385:      ownership: mixed
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:398:      ownership: mixed
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:411:      ownership: mixed
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:424:      ownership: mixed
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:437:      ownership: mixed
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:450:      ownership: generated
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:482:      description: Ensure lifecycle mode docs and workflow branches agree on new, resume, restart, fork, and completed-continue semantics.
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:487:    - id: runtime-coverage
.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml:488:      description: Ensure every supported runtime deep-review agent has a declared render artifact and parity coverage.
.opencode/agent/deep-research.md:58:6. REDUCER SYNC ────> Workflow refreshes strategy, registry, dashboard
.opencode/agent/deep-research.md:76:- Lifecycle branch from `config.lineage.lineageMode` (`resume`, `restart`, `fork`, or `completed-continue`)
.opencode/agent/deep-research.md:89:- If no questions remain, investigate areas with lowest coverage
.opencode/agent/deep-research.md:119:**Source Diversity Rule** : Aim to cite **>=2 independent sources** per key finding. The orchestrator runs quality guards before accepting convergence that check source diversity, focus alignment, and single-weak-source answers. Findings backed by only one source are flagged.
.opencode/agent/deep-research.md:160:Do not treat `research/deep-research-strategy.md`, `research/findings-registry.json`, or `research/deep-research-dashboard.md` as your primary write targets. The workflow reducer owns those synchronized packet surfaces.
.opencode/agent/deep-research.md:165:3. Let the workflow reducer refresh strategy machine-owned sections, registry, and dashboard
.opencode/agent/deep-research.md:171:{"type":"iteration","run":N,"status":"complete","focus":"[focus area]","findingsCount":N,"newInfoRatio":0.XX,"noveltyJustification":"1-sentence explanation of newInfoRatio","keyQuestions":["q1","q2"],"answeredQuestions":["q1"],"ruledOut":["approach1","approach2"],"focusTrack":"optional-track-label","toolsUsed":["Read","WebFetch"],"sourcesQueried":["https://example.com/doc","src/file.ts:42"],"timestamp":"ISO-8601","durationMs":NNNNN}
.opencode/agent/deep-research.md:183:- `noveltyJustification`: 1-sentence explanation of how newInfoRatio was calculated (e.g., "2 of 4 findings were new, 1 partially new")
.opencode/agent/deep-research.md:189:> **Note:** The orchestrator enriches each iteration record with lineage metadata, optional `segment` (default: 1), `convergenceSignals`, and reducer-driven registry/dashboard updates after the agent writes it.
.opencode/agent/deep-research.md:210:  - Leave `research/research.md` ownership to the synthesis phase.
.opencode/agent/deep-research.md:213:The orchestrator generates a research dashboard and findings registry after each iteration, summarizing progress, coverage, and convergence trends. The agent does not update those reducer-owned files directly. However, your iteration data (newInfoRatio, status, focus, ruledOut, focusTrack, toolsUsed, sourcesQueried) feeds directly into those synchronized outputs.
.opencode/agent/deep-research.md:248:    No questions? --> Investigate lowest-coverage area
.opencode/agent/deep-research.md:249:      No coverage data? --> Report stuck (newInfoRatio = 0.0)
.opencode/agent/deep-research.md:363:- workflow reducer refreshes research/deep-research-strategy.md, research/findings-registry.json, and research/deep-research-dashboard.md
.opencode/agent/deep-research.md:388:[x] Reducer-owned strategy/dashboard/registry will have enough data to sync
.opencode/agent/deep-research.md:440:If hook-injected context is present (from Claude Code SessionStart hook), use it directly. Do NOT redundantly call `memory_context` or `memory_match_triggers` for the same information. If hook context is NOT present, fall back to: `memory_context({ mode: "resume", profile: "resume" })` then `memory_match_triggers()`.
.opencode/skill/sk-deep-research/references/loop_protocol.md:48:   - `resume`: config + state + strategy all exist and agree
.opencode/skill/sk-deep-research/references/loop_protocol.md:49:   - `completed-session`: consistent prior state with `config.status == "complete"`
.opencode/skill/sk-deep-research/references/loop_protocol.md:50:   - `invalid-state`: partial or contradictory artifacts
.opencode/skill/sk-deep-research/references/loop_protocol.md:83:5. Log resume event to JSONL: `{"type":"event","event":"resumed","fromIteration":N}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:88:- `resume`: same `sessionId`, no archive, continue from the active lineage boundary
.opencode/skill/sk-deep-research/references/loop_protocol.md:89:- `restart`: new `sessionId`, incremented `generation`, archive prior packet under `research/archive/{oldSessionId}/`
.opencode/skill/sk-deep-research/references/loop_protocol.md:90:- `fork`: new `sessionId`, preserve parent linkage, copy current state as branch baseline
.opencode/skill/sk-deep-research/references/loop_protocol.md:91:- `completed-continue`: snapshot `research/research.md` to `research/synthesis-v{generation}.md`, record `completedAt` and `reopenedAt`, then reopen as a new segment with parent linkage
.opencode/skill/sk-deep-research/references/loop_protocol.md:116:1. Run quality guard checks (see convergence.md §2.4)
.opencode/skill/sk-deep-research/references/loop_protocol.md:117:2. Verify minimum coverage, source diversity, and question resolution thresholds
.opencode/skill/sk-deep-research/references/loop_protocol.md:122:5. The loop continues until BOTH convergence AND quality guards pass simultaneously
.opencode/skill/sk-deep-research/references/loop_protocol.md:127:Before dispatching, check for a pause sentinel file:
.opencode/skill/sk-deep-research/references/loop_protocol.md:129:1. Check if `research/.deep-research-pause` exists
.opencode/skill/sk-deep-research/references/loop_protocol.md:131:   - Log event to JSONL: `{"type":"event","event":"paused","reason":"sentinel file detected"}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:134:     Research paused. Delete research/.deep-research-pause to resume.
.opencode/skill/sk-deep-research/references/loop_protocol.md:138:3. On resume (file deleted and loop restarted):
.opencode/skill/sk-deep-research/references/loop_protocol.md:139:   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:142:**Use case**: In autonomous mode, this provides the only graceful intervention mechanism short of killing the process. Users can create the sentinel file at any time to pause research between iterations.
.opencode/skill/sk-deep-research/references/loop_protocol.md:195:4. Verify reducer refreshed `deep-research-strategy.md`, `findings-registry.json`, and `deep-research-dashboard.md`
.opencode/skill/sk-deep-research/references/loop_protocol.md:202:After evaluating iteration results, generate a human-readable dashboard:
.opencode/skill/sk-deep-research/references/loop_protocol.md:205:2. Generate or regenerate `research/deep-research-dashboard.md` with the following sections:
.opencode/skill/sk-deep-research/references/loop_protocol.md:212:3. Log event: `{"type":"event","event":"dashboard_generated","iteration":N}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:213:4. The dashboard is **auto-generated only** — never manually edited
.opencode/skill/sk-deep-research/references/loop_protocol.md:214:5. The dashboard file is overwritten each iteration (not appended)
.opencode/skill/sk-deep-research/references/loop_protocol.md:217:In **confirm mode**, the dashboard is displayed to the user at each iteration approval gate. In **auto mode**, it is written silently for post-hoc review.
.opencode/skill/sk-deep-research/references/loop_protocol.md:231:   git add research/deep-research-dashboard.md
.opencode/skill/sk-deep-research/references/loop_protocol.md:255:3. **Resume**: On auto-resume, read the ideas file alongside JSONL and strategy.md to restore full context
.opencode/skill/sk-deep-research/references/loop_protocol.md:453:4. **If reopening a completed packet later**: snapshot this file as `research/synthesis-v{generation}.md` before any `completed-continue` flow
.opencode/skill/sk-deep-research/references/loop_protocol.md:455:6. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","totalIterations":N,"answeredCount":A,"totalQuestions":Q,"stopReason":"converged"}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:491:    |-- converged or max_iterations --> [SYNTHESIZING]
.opencode/skill/sk-deep-research/references/loop_protocol.md:532:| 4 (Config-only restart) | Only config.json remains | Restart from initialization phase using config parameters. Log: `{"type":"event","event":"fresh_restart","reason":"state_files_missing"}` |
.opencode/skill/sk-deep-research/references/loop_protocol.md:568:1. **Classify session state**: Same as research mode (fresh, resume, completed-session, invalid-state)
.opencode/skill/sk-deep-research/references/loop_protocol.md:617:  - dimension coverage reaches 100% across the 4-dimension model
.opencode/skill/sk-deep-research/references/loop_protocol.md:618:  - coverage has aged through `minStabilizationPasses >= 1`
.opencode/skill/sk-deep-research/references/loop_protocol.md:620:  - evidence, scope, and coverage gates pass
.opencode/skill/sk-deep-research/references/loop_protocol.md:679:3. Verify the reducer-owned review strategy surfaces were refreshed (dimension progress, findings count, protocol status)
.opencode/skill/sk-deep-research/references/loop_protocol.md:705:Generate `{spec_folder}/review/deep-review-dashboard.md` with review-specific sections:
.opencode/skill/sk-deep-research/references/loop_protocol.md:720:2. **Read strategy**: Final state of dimensions, findings, coverage, and protocol status
.opencode/skill/sk-deep-research/references/loop_protocol.md:742:9. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":N,"verdict":"PASS|CONDITIONAL|FAIL","activeP0":N,"activeP1":N,"activeP2":N,"dimensionCoverage":X,"stopReason":"..." }`
.opencode/skill/sk-deep-research/references/state_format.md:22:| `deep-research-dashboard.md` | Markdown | Auto-generated session summary | Auto-generated (read-only) |
.opencode/skill/sk-deep-research/references/state_format.md:29:The canonical pause sentinel is `research/.deep-research-pause`. Legacy names may be consumed during the migration window, but new writes must use the canonical `deep-research-*` names.
.opencode/skill/sk-deep-research/references/state_format.md:60:    "continuedFromRun": null
.opencode/skill/sk-deep-research/references/state_format.md:75:| status | string | Yes | "initialized" | initialized, running, converged, stuck, complete, error |
.opencode/skill/sk-deep-research/references/state_format.md:78:| lineage.parentSessionId | string or null | Yes | null | Parent lineage when restarting, forking, or reopening |
.opencode/skill/sk-deep-research/references/state_format.md:79:| lineage.lineageMode | string | Yes | "new" | `new`, `resume`, `restart`, `fork`, or `completed-continue` |
.opencode/skill/sk-deep-research/references/state_format.md:81:| lineage.continuedFromRun | number or null | No | null | Run number where a resumed or reopened segment continues |
.opencode/skill/sk-deep-research/references/state_format.md:149:| noveltyJustification | string | No | Human-readable explanation of what newInfoRatio represents (see below) |
.opencode/skill/sk-deep-research/references/state_format.md:164:| entropyCoverage | number | Question coverage ratio (0.0-1.0) |
.opencode/skill/sk-deep-research/references/state_format.md:183:Iteration files (`research/iterations/iteration-NNN.md`) MUST include `## Ruled Out` and `## Dead Ends` sections when negative knowledge is captured. These sections feed reducer-owned strategy and registry refreshes and prevent future iterations from re-exploring eliminated paths.
.opencode/skill/sk-deep-research/references/state_format.md:187:The optional `noveltyJustification` field provides a human-readable breakdown of what the `newInfoRatio` represents:
.opencode/skill/sk-deep-research/references/state_format.md:190:{"type":"iteration","run":3,"status":"complete","focus":"Reconnection strategies","findingsCount":4,"newInfoRatio":0.7,"noveltyJustification":"2 new findings on reconnection backoff, 1 refinement of prior keepalive finding","keyQuestions":["How to handle reconnection?"],"answeredQuestions":[],"timestamp":"2026-03-18T10:15:00Z","durationMs":48000}
.opencode/skill/sk-deep-research/references/state_format.md:203:Track labels are free-form strings used for filtering and grouping in dashboards and analysis. They are not used for orchestration or convergence decisions. Multiple iterations may share the same track label.
.opencode/skill/sk-deep-research/references/state_format.md:211:| `primary` | Authoritative, verified by multiple sources | Counts toward question coverage |
.opencode/skill/sk-deep-research/references/state_format.md:212:| `secondary` | Corroborating evidence, supports a primary finding | Counts toward question coverage |
.opencode/skill/sk-deep-research/references/state_format.md:213:| `tentative` | Single source, unverified | Does NOT count toward question coverage |
.opencode/skill/sk-deep-research/references/state_format.md:234:Events are written by the YAML workflow or diagnostics layer for lifecycle tracking. Canonical coverage includes:
.opencode/skill/sk-deep-research/references/state_format.md:238:| resumed | workflow | active | Resume after a prior active session | sessionId, continuedFromRun, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:239:| restarted | workflow | active | Start a new generation from prior state | sessionId, parentSessionId, generation, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:240:| forked | workflow | active | Create a new branch from current packet state | sessionId, parentSessionId, generation, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:241:| completed_continue | workflow | active | Reopen a completed lineage after immutable snapshotting | sessionId, parentSessionId, generation, continuedFromRun, completedAt, reopenedAt, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:242:| paused | workflow | active | Pause sentinel detected | reason, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:253:| synthesis_complete | workflow | active | Final synthesis finished | totalIterations, answeredCount, totalQuestions, stopReason, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:264:Additional event-specific fields may appear on the JSON line, but the table above is the canonical coverage for emitted events.
.opencode/skill/sk-deep-research/references/state_format.md:275:| `generation` | Monotonic generation number across restarts and reopenings |
.opencode/skill/sk-deep-research/references/state_format.md:276:| `continuedFromRun` | Last completed run reused as the continuation boundary |
.opencode/skill/sk-deep-research/references/state_format.md:291:- `dashboardMetrics`
.opencode/skill/sk-deep-research/references/state_format.md:463:- Mark machine-owned sections explicitly so `completed-continue` can snapshot prior synthesis before reopening
.opencode/skill/sk-deep-research/references/state_format.md:468:<!-- ANCHOR:dashboard -->
.opencode/skill/sk-deep-research/references/state_format.md:469:## 7. DASHBOARD (research/deep-research-dashboard.md)
.opencode/skill/sk-deep-research/references/state_format.md:473:Review mode writes the equivalent dashboard to `{spec_folder}/review/deep-review-dashboard.md`.
.opencode/skill/sk-deep-research/references/state_format.md:477:- **Path**: `{spec_folder}/research/deep-research-dashboard.md`
.opencode/skill/sk-deep-research/references/state_format.md:480:- **Protection**: `"deep-research-dashboard.md": "auto-generated"` in `fileProtection`
.opencode/skill/sk-deep-research/references/state_format.md:487:| Question Status | Strategy + registry | Each key question with answered/open status and coverage % |
.opencode/skill/sk-deep-research/references/state_format.md:491:| Source Diversity | Registry metrics | Source count per question and `coverageBySources` summary |
.opencode/skill/sk-deep-research/references/state_format.md:496:2. Compute all derived values (coverage %, trend direction) from raw data
.opencode/skill/sk-deep-research/references/state_format.md:498:4. If JSONL is missing or empty, write a minimal dashboard noting "No iteration data available"
.opencode/skill/sk-deep-research/references/state_format.md:499:5. The dashboard is read-only for all agents -- modifications are discarded on next refresh
.opencode/skill/sk-deep-research/references/state_format.md:508:    "deep-research-dashboard.md": "auto-generated",
.opencode/skill/sk-deep-research/references/state_format.md:518:<!-- /ANCHOR:dashboard -->
.opencode/skill/sk-deep-research/references/state_format.md:529:    deep-research-dashboard.md         # Auto-generated session summary (read-only)
.opencode/skill/sk-deep-research/references/state_format.md:544:When `config.mode == "review"`, the state system adapts to track findings, dimensions, traceability coverage, and adjudicated severity instead of research questions and `newInfoRatio`.
.opencode/skill/sk-deep-research/references/state_format.md:591:  "noveltyJustification": "1 new P1 contract drift, 1 new P2 template inconsistency, 2 advisory refinements"
.opencode/skill/sk-deep-research/references/state_format.md:605:| noveltyJustification | string | No | Human-readable breakdown of what was found |
.opencode/skill/sk-deep-research/references/state_format.md:622:  "stopReason": "composite_converged",
.opencode/skill/sk-deep-research/references/state_format.md:632:| dimensionCoverage | number | Yes | Final dimension coverage ratio (0.0-1.0) |
.opencode/skill/sk-deep-research/references/state_format.md:729:| Files Under Review | (none) | Per-file coverage state table |
.opencode/skill/sk-deep-review/references/loop_protocol.md:64:   - `resume`: config + state + strategy all exist and agree
.opencode/skill/sk-deep-review/references/loop_protocol.md:65:   - `completed-session`: consistent prior state with `config.status == "complete"`
.opencode/skill/sk-deep-review/references/loop_protocol.md:66:   - `invalid-state`: partial or contradictory artifacts
.opencode/skill/sk-deep-review/references/loop_protocol.md:106:6. **Write config**: `{spec_folder}/review/deep-review-config.json` with `mode: "review"`, lineage metadata (`sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, `releaseReadinessState`), and review-specific fields including target, target type, dimensions, protocol plan, and release-readiness state.
.opencode/skill/sk-deep-review/references/loop_protocol.md:155:| Outputs | `findingsRegistry`, `dashboardMetrics`, `strategyUpdates` | The same refresh pass updates the canonical registry, refreshes dashboard metrics, and applies strategy updates. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:156:| Metrics | `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore` | These metrics drive convergence decisions, dashboard summaries, and synthesis readiness. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:166:  - Dimension coverage reaches 100% across the 4-dimension model
.opencode/skill/sk-deep-review/references/loop_protocol.md:169:  - Evidence, scope, and coverage gates pass
.opencode/skill/sk-deep-review/references/loop_protocol.md:184:Before dispatching, check for a pause sentinel file:
.opencode/skill/sk-deep-review/references/loop_protocol.md:186:1. Check if `review/.deep-review-pause` exists (note: the file name uses the shared `-pause` suffix)
.opencode/skill/sk-deep-review/references/loop_protocol.md:188:   - Log event to JSONL: `{"type":"event","event":"paused","reason":"sentinel file detected"}`
.opencode/skill/sk-deep-review/references/loop_protocol.md:191:     Review paused. Delete review/.deep-review-pause to resume.
.opencode/skill/sk-deep-review/references/loop_protocol.md:195:3. On resume (file deleted and loop restarted):
.opencode/skill/sk-deep-review/references/loop_protocol.md:196:   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
.opencode/skill/sk-deep-review/references/loop_protocol.md:199:**Use case**: In autonomous mode, this provides the only graceful intervention mechanism short of killing the process. Users can create the sentinel file at any time to pause review between iterations.
.opencode/skill/sk-deep-review/references/loop_protocol.md:321:Generate `{spec_folder}/review/deep-review-dashboard.md` with review-specific sections:
.opencode/skill/sk-deep-review/references/loop_protocol.md:374:- If recovery iteration finds any new P0/P1 or materially advances required traceability coverage: recovery successful. Reset stuck count. Continue.
.opencode/skill/sk-deep-review/references/loop_protocol.md:408:2. Recompute `newFindingsRatio`, rolling-average votes, MAD votes, and coverage votes from stored JSONL fields only
.opencode/skill/sk-deep-review/references/loop_protocol.md:409:3. Recompute `traceabilityChecks.summary` and confirm required protocol statuses match the recorded coverage vote
.opencode/skill/sk-deep-review/references/loop_protocol.md:410:4. Re-run the evidence, scope, and coverage gates against stored findings and scope data
.opencode/skill/sk-deep-review/references/loop_protocol.md:458:     "stopReason": "...",
.opencode/skill/sk-deep-review/references/loop_protocol.md:494:<!-- ANCHOR:auto-resume-protocol -->
.opencode/skill/sk-deep-review/references/loop_protocol.md:499:Enable review sessions to resume seamlessly from prior state when interrupted by context compaction, process termination, or intentional pause.
.opencode/skill/sk-deep-review/references/loop_protocol.md:509:5. **Log resume**: Append resume event to JSONL with lineage metadata:
.opencode/skill/sk-deep-review/references/loop_protocol.md:511:   {"type":"event","event":"resumed","lineageMode":"resume","sessionId":"rvw-...","generation":1,"fromIteration":N}
.opencode/skill/sk-deep-review/references/loop_protocol.md:519:| `resume` | Continue the same `sessionId` and generation. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:520:| `restart` | Archive current review state, start a new `sessionId`, increment generation, and set `parentSessionId`. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:521:| `fork` | Copy current state as baseline, create a new `sessionId`, preserve ancestry, and continue on a new branch. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:522:| `completed-continue` | Snapshot `review-report-v{generation}.md`, record `completedAt`/`reopenedAt`, and continue with amendment-only additions. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:528:| Config + JSONL + strategy all exist and agree | `resume` | Continue from last iteration + 1 |
.opencode/skill/sk-deep-review/references/loop_protocol.md:529:| All exist, config says `status: "complete"` | `completed-session` | Report completion, ask user if re-review desired |
.opencode/skill/sk-deep-review/references/loop_protocol.md:530:| Partial files or contradictions | `invalid-state` | Halt for repair; do not guess |
.opencode/skill/sk-deep-review/references/loop_protocol.md:540:| 2 | JSONL exists, strategy.md missing | Reconstruct strategy from JSONL: extract dimensions, findings, coverage |
.opencode/skill/sk-deep-review/references/loop_protocol.md:549:<!-- /ANCHOR:auto-resume-protocol -->
.opencode/skill/sk-deep-review/references/loop_protocol.md:550:<!-- ANCHOR:pause-resume -->
.opencode/skill/sk-deep-review/references/loop_protocol.md:555:The pause sentinel provides graceful loop suspension in autonomous mode without killing the process.
.opencode/skill/sk-deep-review/references/loop_protocol.md:562:touch {spec_folder}/review/.deep-review-pause
.opencode/skill/sk-deep-review/references/loop_protocol.md:568:- A paused event is logged to JSONL
.opencode/skill/sk-deep-review/references/loop_protocol.md:573:Delete the sentinel file and restart the workflow:
.opencode/skill/sk-deep-review/references/loop_protocol.md:576:rm {spec_folder}/review/.deep-review-pause
.opencode/skill/sk-deep-review/references/loop_protocol.md:580:- The auto-resume protocol (Section 6) detects the existing state
.opencode/skill/sk-deep-review/references/loop_protocol.md:581:- A resumed event is logged to JSONL
.opencode/skill/sk-deep-review/references/loop_protocol.md:586:In confirm mode (`spec_kit_deep-review_confirm.yaml`), the workflow adds explicit approval gates instead of relying on the pause sentinel:
.opencode/skill/sk-deep-review/references/loop_protocol.md:591:| After each iteration | Show iteration findings, dashboard, and convergence status. Options: Continue, Adjust Focus, Stop |
.opencode/skill/sk-deep-review/references/loop_protocol.md:597:<!-- /ANCHOR:pause-resume -->
.opencode/skill/sk-deep-review/references/loop_protocol.md:610:    |-- converged + gates pass --> [SYNTHESIZING]
.opencode/skill/sk-deep-review/references/loop_protocol.md:611:    |-- max_iterations reached --> [SYNTHESIZING]
.opencode/skill/sk-deep-review/references/loop_protocol.md:615:    |-- recovered (new P0/P1 or coverage advance) --> [ITERATING]
.opencode/skill/sk-deep-review/references/loop_protocol.md:621:    |-- sentinel removed --> [ITERATING] (resume)
.opencode/skill/sk-deep-review/references/loop_protocol.md:687:function checkReviewQualityGates(state, config, coverage):
.opencode/skill/sk-deep-review/references/loop_protocol.md:704:  if coverage.dimensionCoverage < 1.0:
.opencode/skill/sk-deep-review/references/loop_protocol.md:705:    violations.push({ gate: "coverage",
.opencode/skill/sk-deep-review/references/loop_protocol.md:707:  if not coverage.requiredProtocolsCovered:
.opencode/skill/sk-deep-review/references/loop_protocol.md:708:    violations.push({ gate: "coverage",
.opencode/skill/sk-deep-review/references/loop_protocol.md:736:| Convergence | `../sk-deep-research/references/convergence.md` | `shouldContinue_review()` (Section 10), stuck recovery, quality guards |
.opencode/skill/sk-deep-review/references/loop_protocol.md:746:| Dashboard Template | `assets/deep_review_dashboard.md` | Template for auto-generated dashboard |
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:33:  lineage_mode: "[auto|resume|restart|fork|completed-continue] - Session lifecycle intent. Default: auto."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:34:  max_iterations: 7
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:88:  dashboard: "{spec_folder}/review/deep-review-dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:107:          - required_values_present: [review_target, review_target_type, review_dimensions, spec_folder, max_iterations, convergence_threshold]
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:129:            - "{spec_folder}/scratch/deep-review-dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:131:            - "{spec_folder}/scratch/.deep-research-pause"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:141:          - "{spec_folder}/scratch/deep-review-dashboard.md -> {spec_folder}/review/deep-review-dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:143:          - "{spec_folder}/scratch/.deep-research-pause -> {spec_folder}/review/.deep-review-pause"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:149:        command: "mkdir -p {spec_folder}/review/iterations && if [ ! -e {spec_folder}/review/deep-review-config.json ] && [ ! -e {spec_folder}/review/deep-review-state.jsonl ] && [ ! -e {spec_folder}/review/deep-review-strategy.md ] && [ -e {spec_folder}/scratch/deep-review-strategy.md ] && ( [ -e {spec_folder}/scratch/deep-research-config.json ] || [ -e {spec_folder}/scratch/deep-research-state.jsonl ] ); then [ -e {spec_folder}/scratch/deep-research-config.json ] && mv {spec_folder}/scratch/deep-research-config.json {spec_folder}/review/deep-review-config.json; [ -e {spec_folder}/scratch/deep-research-state.jsonl ] && mv {spec_folder}/scratch/deep-research-state.jsonl {spec_folder}/review/deep-review-state.jsonl; [ -e {spec_folder}/scratch/deep-review-strategy.md ] && mv {spec_folder}/scratch/deep-review-strategy.md {spec_folder}/review/deep-review-strategy.md; [ -e {spec_folder}/scratch/deep-review-dashboard.md ] && mv {spec_folder}/scratch/deep-review-dashboard.md {spec_folder}/review/deep-review-dashboard.md; find {spec_folder}/scratch -maxdepth 1 -name 'iteration-*.md' -exec mv {} {spec_folder}/review/iterations/ \\; ; [ -e {spec_folder}/scratch/.deep-research-pause ] && mv {spec_folder}/scratch/.deep-research-pause {spec_folder}/review/.deep-review-pause; [ -e {spec_folder}/review-report.md ] && mv {spec_folder}/review-report.md {spec_folder}/review/review-report.md; if [ -e {spec_folder}/review/deep-review-state.jsonl ]; then printf '%s\n' '{\"type\":\"event\",\"event\":\"migration\",\"mode\":\"review\",\"legacyArtifacts\":[\"deep-research-config.json\",\"deep-research-state.jsonl\",\".deep-research-pause\"],\"canonicalArtifacts\":[\"deep-review-config.json\",\"deep-review-state.jsonl\",\".deep-review-pause\"],\"timestamp\":\"{ISO_8601_NOW}\"}' >> {spec_folder}/review/deep-review-state.jsonl; fi; fi; find {spec_folder}/review -maxdepth 1 -name 'iteration-*.md' -exec mv {} {spec_folder}/review/iterations/ \\; 2>/dev/null || true"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:160:          resume: "Config, JSONL, and strategy all exist and config.mode == 'review' and agree on target/spec folder"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:161:          completed-session: "Resume artifacts exist and config.status == 'complete'"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:162:          invalid-state: "Any partial, missing, or contradictory combination"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:164:          - session_state: "fresh | resume | completed-session | invalid-state"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:165:        on_resume:
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:166:          log: "Auto-resume: state artifacts are complete and consistent. Continue same lineage."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:168:        on_restart:
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:170:        on_fork:
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:171:          action: "Copy current review packet as a fork baseline with explicit parent linkage"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:173:          log: "Prior session already completed. Snapshot review synthesis and reopen via completed-continue."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:237:          continuedFromRun: null
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:247:          maxIterations: "{max_iterations}"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:260:        content: '{"type":"config","mode":"review","reviewTarget":"{review_target}","reviewTargetType":"{review_target_type}","reviewDimensions":"{review_dimensions}","sessionId":"{ISO_8601_NOW}","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":{max_iterations},"convergenceThreshold":{convergence_threshold},"createdAt":"{ISO_8601_NOW}","specFolder":"{spec_folder}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:264:        action: "Initialize reducer-owned review findings registry"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:277:          max_iterations: "{max_iterations}"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:297:    max_repeats: "{max_iterations}"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:317:          - dimension_coverage: "covered / total dimensions"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:318:          - coverage_age: "Iterations since dimension coverage last changed; require >= 1 before STOP"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:325:      step_check_pause_sentinel:
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:326:        action: "Check for pause sentinel file"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:327:        check: "Does {spec_folder}/review/.deep-review-pause exist?"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:329:          log_event: '{"type":"event","event":"paused","reason":"sentinel file detected"}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:330:          message: "Review paused. Delete review/.deep-review-pause to resume."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:339:             a) if iteration_count >= max_iterations: STOP (max_iterations_reached)
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:340:             b) if all dimensions clean AND required traceability protocols are covered AND p0_count == 0 AND p1_count == 0 AND coverage_age >= 1 AND all quality gates pass (evidence: every P0/P1 has file:line; scope: all findings within target; coverage: all dimensions reviewed): STOP (all_dimensions_clean)
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:351:               c) Dimension coverage (w=0.45):
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:352:                  coverage = dimensions_covered / total_dimensions
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:353:                  stop if coverage >= 1.0 AND required traceability protocols are covered AND coverage_age >= 1
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:360:               c) Coverage: Configured dimensions and required traceability protocols covered, with coverage_age >= 1
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:390:          Iteration: {current_iteration} of {max_iterations}
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:393:          Dimension Coverage: {dimensions_covered_list} ({dimension_coverage})
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:395:          Coverage Age: {coverage_age}
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:408:            REVIEW ITERATION {current_iteration} of {max_iterations}
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:419:            QUALITY GATES: evidence, scope, coverage
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:435:            CONSTRAINT: Update strategy.md dimension coverage, traceability status, and running findings.
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:469:        action: "Run reducer to refresh the canonical findings registry before dashboard generation"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:475:        note: "Reducer outputs findingsRegistry, dashboardMetrics, and strategyUpdates. Re-running the same inputs must be idempotent."
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:477:      step_generate_dashboard:
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:478:        action: "Generate or refresh the review dashboard"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:491:          - Iteration: {current_iteration} of {max_iterations}
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:524:        output: "{spec_folder}/review/deep-review-dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:553:        action: "Hydrate summary metrics before synthesis, including completed-continue reopen paths"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:565:          - dimension_coverage: "covered / total"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:567:          - reason: "Use the latest stop reason if present, else 'completed-continue'"
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:640:             - Convergence summary, coverage summary, ruled-out claims, sources reviewed
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:643:          Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:648:        append_to_jsonl: '{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":{iteration_count},"activeP0":{active_p0},"activeP1":{active_p1},"activeP2":{active_p2},"dimensionCoverage":{dimension_coverage},"verdict":"{verdict}","releaseReadinessState":"{release_readiness_state}","stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:690:        - State files in review/: deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-strategy.md, deep-review-dashboard.md
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:719:    - respect_max_iterations_cap
.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:755:      - { priority: 3, name: "traceability", checks: "Spec/checklist alignment, cross-reference integrity, evidence coverage" }
.opencode/agent/deep-review.md:31:> **SPEC FOLDER PERMISSION:** @deep-review may write only `review/` artifacts inside the active spec folder (iteration artifacts, strategy, JSONL, dashboard, report). Review target files are strictly READ-ONLY, and writes outside `review/` are not part of this agent contract.
.opencode/agent/deep-review.md:64:- `review/deep-review-findings-registry.json` -- Read reducer-owned active finding state (read-only for this agent)
.opencode/agent/deep-review.md:212:- noveltyJustification: [1 sentence]
.opencode/agent/deep-review.md:235:{"type":"iteration","mode":"review","run":N,"status":"complete","focus":"[dimension - specific area]","dimension":"[dimension name]","dimensions":["[dimension name]"],"findingsCount":N,"newFindingsRatio":0.XX,"noveltyJustification":"...","findingsSummary":{"P0":N,"P1":N,"P2":N},"filesReviewed":["file1","file2"],"dimensionScores":{"correctness":N,"security":N,"traceability":N,"maintainability":N},"findingsNew":{"P0":N,"P1":N,"P2":N},"findingsRefined":{"P0":N,"P1":N,"P2":N},"upgrades":[],"resolved":[],"findingRefs":["P1-001","P2-003"],"traceabilityChecks":{"summary":{"required":N,"executed":N,"pass":N,"partial":N,"fail":N,"blocked":N,"notApplicable":N,"gatingFailures":N},"results":[{"protocolId":"spec_code","status":"pass|partial|fail","gateClass":"hard|advisory","applicable":true,"counts":{"pass":N,"partial":N,"fail":N},"evidence":["path/to/file:line"],"findingRefs":["P1-001"],"summary":"One-line traceability result."}]},"coverage":{"filesReviewed":N,"filesTotal":N,"dimensionsComplete":[]},"ruledOut":["investigated-not-issue"],"focusTrack":"optional","timestamp":"ISO-8601","durationMs":NNNNN}
.opencode/agent/deep-review.md:247:- `noveltyJustification`: 1-sentence explanation of how newFindingsRatio was calculated
.opencode/agent/deep-review.md:335:- `resume`: Continue the active review session.
.opencode/agent/deep-review.md:336:- `restart`: Reset loop state and start a fresh generation for the same target.
.opencode/agent/deep-review.md:337:- `fork`: Start a child review session from an earlier lineage point.
.opencode/agent/deep-review.md:338:- `completed-continue`: Re-open a previously completed session for additional review coverage.
.opencode/agent/deep-review.md:345:- `continuedFromRun`
.opencode/agent/deep-review.md:349:- `review/deep-review-findings-registry.json` is the canonical reducer-owned finding registry.
.opencode/agent/deep-review.md:368:| Pause sentinel | `review/.deep-review-pause` | Read only |
.opencode/agent/deep-review.md:435:5. Report newFindingsRatio + noveltyJustification honestly
.opencode/agent/deep-review.md:447:5. Skip convergence evaluation data (newFindingsRatio, noveltyJustification)
.opencode/agent/deep-review.md:485:[x] Findings registry treated as reducer-owned canonical state
.opencode/agent/deep-review.md:570:If hook-injected context is present (from Claude Code SessionStart hook), use it directly. Do NOT redundantly call `memory_context` or `memory_match_triggers` for the same information. If hook context is NOT present, fall back to: `memory_context({ mode: "resume", profile: "resume" })` then `memory_match_triggers()`.
.opencode/skill/sk-deep-review/references/convergence.md:3:description: Stop condition algorithms, quality guards, and recovery strategies for the autonomous deep review loop.
.opencode/skill/sk-deep-review/references/convergence.md:8:Stop condition algorithms, quality guards, and stuck recovery for the deep review loop.
.opencode/skill/sk-deep-review/references/convergence.md:23:Convergence is checked **after** each iteration completes and **before** the next iteration is dispatched. The check consumes the full JSONL state history and the current dimension coverage snapshot.
.opencode/skill/sk-deep-review/references/convergence.md:26:- `in-progress` while coverage is incomplete or new P0/P1 findings are still appearing
.opencode/skill/sk-deep-review/references/convergence.md:27:- `converged` once coverage and stabilization pass without new P0/P1 findings
.opencode/skill/sk-deep-review/references/convergence.md:65:  return { action: "STOP", reason: "max_iterations_reached" }
.opencode/skill/sk-deep-review/references/convergence.md:73:if coverage.dimensionCoverage == 1.0 and activeP0 == 0 and activeP1 == 0:
.opencode/skill/sk-deep-review/references/convergence.md:74:  if stabilizationPasses >= config.coverageAge.minStabilizationPasses:
.opencode/skill/sk-deep-review/references/convergence.md:75:    if checkReviewQualityGates(state, config, coverage).passed:
.opencode/skill/sk-deep-review/references/convergence.md:76:      return { action: "STOP", reason: "all_dimensions_clean" }
.opencode/skill/sk-deep-review/references/convergence.md:79:Triggers when all 4 dimensions (correctness, security, traceability, maintainability) are covered, no active P0/P1 remains, at least 1 stabilization pass has occurred, and all 3 quality gates pass. If gates fail, the loop continues despite full coverage.
.opencode/skill/sk-deep-review/references/convergence.md:122:| Dimension Coverage | 0.45 | 1 | Dimension completion + protocol coverage stability |
.opencode/skill/sk-deep-review/references/convergence.md:150:Highest-weight signal. Votes STOP only when all three conditions are true: full dimension coverage (1.0), required traceability protocols covered, and at least 1 stabilization pass.
.opencode/skill/sk-deep-review/references/convergence.md:153:coverageStop = (
.opencode/skill/sk-deep-review/references/convergence.md:154:  coverage.dimensionCoverage == 1.0 and
.opencode/skill/sk-deep-review/references/convergence.md:155:  coverage.requiredProtocolsCovered and
.opencode/skill/sk-deep-review/references/convergence.md:173:| 1 | Coverage only (weight 1.0) | Very unlikely to stop (needs full coverage + stabilization) |
.opencode/skill/sk-deep-review/references/convergence.md:174:| 2 | Rolling avg + coverage | Two-signal vote, reweighted |
.opencode/skill/sk-deep-review/references/convergence.md:239:function checkReviewQualityGates(state, config, coverage):
.opencode/skill/sk-deep-review/references/convergence.md:254:  if coverage.dimensionCoverage < 1.0:
.opencode/skill/sk-deep-review/references/convergence.md:255:    violations.push({ gate: "coverage", detail: "dimensions incomplete" })
.opencode/skill/sk-deep-review/references/convergence.md:256:  if not coverage.requiredProtocolsCovered:
.opencode/skill/sk-deep-review/references/convergence.md:257:    violations.push({ gate: "coverage", detail: "protocols incomplete" })
.opencode/skill/sk-deep-review/references/convergence.md:352:- **Success:** Recovery iteration finds any new P0/P1 or materially advances required traceability coverage. Reset stuck count. Continue.
.opencode/skill/sk-deep-review/references/convergence.md:374:Stop reason: [composite_converged | max_iterations | all_dimensions_clean | stuck_unrecoverable]
.opencode/skill/sk-deep-review/references/convergence.md:382:Dimension coverage: N / 4 (X%)
.opencode/skill/sk-deep-review/references/convergence.md:410:  "stopReason": "composite_converged",
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:58:- If a task depends on an unresolved stop/done/resume contract, mark it blocked instead of starting partial implementation.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:82:- [ ] T005 Add resume/start-from-run semantics to deep research.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:83:- [ ] T006 Add resume/start-from-run semantics to deep review.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:97:| T007 | Pending | REQ-004 | `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/agent/deep-research.md` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:98:| T008 | Pending | REQ-004 | `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`; `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/agent/deep-review.md` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:99:| T010 | Pending | REQ-007 | `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:100:| T011 | Pending | REQ-007 | `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:103:| T027 | Pending | REQ-016 | `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:104:| T028 | Pending | REQ-016 | `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:108:- [ ] T007 Add the deep-research audit journal and journal-aware rollups.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:109:- [ ] T008 Add the deep-review audit journal and journal-aware rollups.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:110:- [ ] T010 Extend the deep-research dashboard and reducer metrics.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:111:- [ ] T011 Extend the deep-review dashboard and contract metrics.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:114:- [ ] T027 Add observability surfaces to deep-research dashboards and reducer.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:115:- [ ] T028 Add observability surfaces to deep-review dashboards and reducer.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:132:- [ ] T009 Add the deep-research claim-verification ledger contract and synthesis references.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:136:- [ ] T033 Make deep-review machine-owned strategy sections reducer-owned.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:155:- [ ] T019 Extend deep-research reducer tests for journal, snapshot, semantic-convergence, and dashboard-observability behavior.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:156:- [ ] T020 Extend deep-review reducer/schema tests for stop reasons, snapshots, observability metrics, reducer-owned sections, and resume cursor fields.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md:189:- [ ] T024 Add behavior/parity coverage proving that council mode and coordination-board mode remain optional.
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:31:  max_iterations: "[MAX_ITERATIONS] - Maximum loop iterations. Default: 10."
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:84:  dashboard: "{spec_folder}/research/deep-research-dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:85:  pause_sentinel: "{spec_folder}/research/.deep-research-pause"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:106:          - required_values_present: [research_topic, spec_folder, max_iterations, convergence_threshold]
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:122:          - "{spec_folder}/research/dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:123:          - "{spec_folder}/research/.pause"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:136:          resume: "Config, JSONL, and strategy all exist and agree on topic/spec folder"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:137:          completed-session: "Resume artifacts exist and config.status == 'complete'"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:138:          invalid-state: "Any partial, missing, or contradictory combination"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:140:          - session_state: "fresh | resume | completed-session | invalid-state"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:141:        on_resume:
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:142:          log: "Auto-resume: state artifacts are complete and consistent. Continue same lineage."
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:144:        on_restart:
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:146:        on_fork:
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:147:          action: "Copy current packet as a fork baseline with explicit parent linkage"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:149:          log: "Prior session already completed. Snapshot synthesis and reopen via completed-continue."
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:162:          maxIterations: "{max_iterations}"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:174:          lineage.continuedFromRun: null
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:179:        content: '{"type":"config","topic":"{research_topic}","maxIterations":{max_iterations},"convergenceThreshold":{convergence_threshold},"createdAt":"{ISO_8601_NOW}","specFolder":"{spec_folder}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:190:          max_iterations: "{max_iterations}"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:195:        action: "Initialize reducer-owned findings registry"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:196:        content: '{"openQuestions":[],"resolvedQuestions":[],"keyFindings":[],"ruledOutDirections":[],"metrics":{"iterationsCompleted":0,"openQuestions":0,"resolvedQuestions":0,"keyFindings":0,"convergenceScore":0,"coverageBySources":{}}}'
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:215:    max_repeats: "{max_iterations}"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:240:      step_check_pause_sentinel:
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:241:        action: "Check for pause sentinel file"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:242:        check: "Does {spec_folder}/research/.deep-research-pause exist?"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:244:          log_event: '{"type":"event","event":"paused","reason":"sentinel file detected"}'
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:245:          message: "Research paused. Delete research/.deep-research-pause to resume."
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:253:          1. if iteration_count >= max_iterations: STOP (max_iterations_reached)
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:266:                  coverage = answered / total questions
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:267:                  stop if coverage >= 0.85
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:269:               if weighted_stop_score > 0.60: STOP (composite_converged)
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:302:              Segment: {current_segment} | Iteration: {current_iteration} of {max_iterations}
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:310:            Iteration: {current_iteration} of {max_iterations}
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:325:            CONSTRAINT: The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:329:        action: "Run the reducer to synchronize registry, dashboard, and strategy"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:337:          - "{spec_folder}/research/deep-research-dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:361:      step_generate_dashboard:
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:362:        action: "Generate or refresh the human-readable dashboard"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:367:        template: .opencode/skill/sk-deep-research/assets/deep_research_dashboard.md
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:368:        output: "{spec_folder}/research/deep-research-dashboard.md"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:390:        action: "Hydrate summary metrics before synthesis, including completed-continue reopen paths"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:408:          - reason: "Use the latest synthesis/recovery stop reason if present, else 'completed-continue'"
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:430:          Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:444:        append_to_jsonl: '{"type":"event","event":"synthesis_complete","totalIterations":{iteration_count},"answeredCount":{answered_count},"totalQuestions":{total_questions},"stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:484:        - State files: config.json, state.jsonl, strategy.md, findings-registry.json, dashboard.md
.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:512:    - respect_max_iterations_cap
.opencode/skill/sk-deep-research/references/convergence.md:15:Convergence detection prevents infinite loops and stops research when additional iterations yield diminishing returns. The algorithm evaluates multiple signals to make a stop/continue/recovery decision, while the reducer publishes the resulting `convergenceScore` and `coverageBySources` into the dashboard and findings registry after every iteration.
.opencode/skill/sk-deep-research/references/convergence.md:33:    return { action: "STOP", reason: "max_iterations_reached" }
.opencode/skill/sk-deep-research/references/convergence.md:62:- `convergenceScore`: normalized stop-score surfaced in `findings-registry.json` and `deep-research-dashboard.md`
.opencode/skill/sk-deep-research/references/convergence.md:63:- `coverageBySources`: per-question source coverage summary used by the quality guards
.opencode/skill/sk-deep-research/references/convergence.md:95:  // Signal 3: Question entropy coverage
.opencode/skill/sk-deep-research/references/convergence.md:99:    coverage = answered / total
.opencode/skill/sk-deep-research/references/convergence.md:100:    entropyStop = coverage >= 0.85  // 85%+ questions answered signals saturation
.opencode/skill/sk-deep-research/references/convergence.md:101:    signals.push({ name: "entropyCoverage", value: coverage, stop: entropyStop, weight: 0.35 })
.opencode/skill/sk-deep-research/references/convergence.md:109:      return { action: "STOP", reason: "composite_converged", stopScore, signals }
.opencode/skill/sk-deep-research/references/convergence.md:150:When the composite convergence returns STOP, invoke `checkQualityGuards()`. If it returns `passed: false`, override the action to CONTINUE and resume the loop. The orchestrator should target the violated questions in the next iteration's focus area.
.opencode/skill/sk-deep-research/references/convergence.md:172:| 1-2 | Entropy only (weight 1.0) | Very unlikely to stop (need 85%+ coverage) |
.opencode/skill/sk-deep-research/references/convergence.md:284:> **Source-Hygiene Note:** Tentative findings (`sourceStrength == "tentative"`) do not count toward answered-question coverage unless confirmed by an independent source in a later iteration. When computing `answered / total`, exclude any question whose only supporting evidence has tentative strength. This prevents premature convergence based on unverified or low-confidence information.
.opencode/skill/sk-deep-research/references/convergence.md:320:- `:restart` mode in an implementation that supports it
.opencode/skill/sk-deep-research/references/convergence.md:482:  - Recommended action (restart, adjust parameters, manual intervention)
.opencode/skill/sk-deep-research/references/convergence.md:606:Stop reason: [composite_converged | max_iterations | all_questions_answered | stuck_unrecoverable]
.opencode/skill/sk-deep-research/references/convergence.md:613:  Signal 3 - Entropy (w=0.35):     0.XX [STOP|CONTINUE] (coverage: X/Y)
.opencode/skill/sk-deep-research/references/convergence.md:629:Review mode uses a severity-weighted variant of the convergence algorithm. Instead of measuring "new information" against research questions, it measures "new findings" against the simplified four-dimension review model and machine-verifiable traceability coverage.
.opencode/skill/sk-deep-research/references/convergence.md:661:| Correctness | Required coverage | Logic, invariants, state transitions, observable behavior |
.opencode/skill/sk-deep-research/references/convergence.md:662:| Security | Required coverage | Trust boundaries, authz/authn, input handling, exploit paths |
.opencode/skill/sk-deep-research/references/convergence.md:671:| `coverageAge.minStabilizationPasses` | `1` | Coverage can vote STOP only after at least one stabilization pass |
.opencode/skill/sk-deep-research/references/convergence.md:682:    return { action: "STOP", reason: "max_iterations_reached" }
.opencode/skill/sk-deep-research/references/convergence.md:686:  coverage = computeReviewCoverage(state, config)
.opencode/skill/sk-deep-research/references/convergence.md:687:  stabilizationPasses = countCoverageStabilizationPasses(evidenceIterations, coverage)
.opencode/skill/sk-deep-research/references/convergence.md:689:  if coverage.dimensionCoverage == 1.0 and activeP0 == 0 and activeP1 == 0:
.opencode/skill/sk-deep-research/references/convergence.md:690:    if stabilizationPasses >= config.coverageAge.minStabilizationPasses:
.opencode/skill/sk-deep-research/references/convergence.md:691:      gateResult = checkReviewQualityGates(state, config, coverage)
.opencode/skill/sk-deep-research/references/convergence.md:693:        return { action: "STOP", reason: "all_dimensions_clean", coverage, stabilizationPasses }
.opencode/skill/sk-deep-research/references/convergence.md:719:  coverageStop = (
.opencode/skill/sk-deep-research/references/convergence.md:720:    coverage.dimensionCoverage == 1.0 and
.opencode/skill/sk-deep-research/references/convergence.md:721:    coverage.requiredProtocolsCovered and
.opencode/skill/sk-deep-research/references/convergence.md:722:    stabilizationPasses >= config.coverageAge.minStabilizationPasses
.opencode/skill/sk-deep-research/references/convergence.md:726:    value: coverage.dimensionCoverage,
.opencode/skill/sk-deep-research/references/convergence.md:727:    stop: coverageStop,
.opencode/skill/sk-deep-research/references/convergence.md:730:      requiredProtocolsCovered: coverage.requiredProtocolsCovered,
.opencode/skill/sk-deep-research/references/convergence.md:739:      gateResult = checkReviewQualityGates(state, config, coverage)
.opencode/skill/sk-deep-research/references/convergence.md:741:        return { action: "STOP", reason: "composite_converged", stopScore, signals }
.opencode/skill/sk-deep-research/references/convergence.md:746:  return { action: "CONTINUE", coverage, stabilizationPasses, signals }
.opencode/skill/sk-deep-research/references/convergence.md:760:function checkReviewQualityGates(state, config, coverage):
.opencode/skill/sk-deep-research/references/convergence.md:774:  if coverage.dimensionCoverage < 1.0:
.opencode/skill/sk-deep-research/references/convergence.md:775:    violations.push({ gate: "coverage", detail: "Not all configured review dimensions are covered" })
.opencode/skill/sk-deep-research/references/convergence.md:776:  if not coverage.requiredProtocolsCovered:
.opencode/skill/sk-deep-research/references/convergence.md:777:    violations.push({ gate: "coverage", detail: "Required traceability protocols are incomplete" })
.opencode/skill/sk-deep-research/references/convergence.md:789:2. Recompute `newFindingsRatio`, rolling-average votes, MAD votes, and coverage votes from the stored JSONL fields only.
.opencode/skill/sk-deep-research/references/convergence.md:790:3. Recompute `traceabilityChecks.summary` and confirm required protocol statuses match the recorded coverage vote.
.opencode/skill/sk-deep-research/references/convergence.md:791:4. Re-run the evidence, scope, and coverage gates against the stored findings and scope data.
.opencode/skill/sk-deep-research/references/convergence.md:826:- If recovery iteration finds any new P0/P1 or materially advances required traceability coverage: recovery successful. Reset stuck count. Continue.
.opencode/skill/sk-deep-research/references/convergence.md:834:- Require `minStabilizationPasses >= 1` before the coverage signal can vote STOP
.opencode/skill/sk-deep-research/references/convergence.md:835:- Require evidence, scope, and coverage gates to pass
.opencode/skill/sk-deep-research/references/convergence.md:853:- Binary gates prevent STOP when evidence, scope, or required traceability coverage is incomplete
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:29:| **Storage** | Packet-local `research/` and `review/` artifacts, append-only JSONL, generated dashboards, reducer-owned summaries |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:34:This implementation plan ships the deep-loop improvements in five phases. The sequence now incorporates the new research-driven gaps around snapshot/compaction durability, packet-local observability, large-target decomposition, semantic convergence, and deep-review reducer ownership. Phase 2 is split into `2a` and `2b`, while behavior/replay verification moves forward so it can protect contract work soon after the shared runtime foundation lands.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:50:- [x] The five newly identified research gaps and the phase-order changes are mapped into packet requirements, tasks, and ADR coverage.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:56:- [ ] Journals, dashboards, observability surfaces, and claim-ledger artifacts are defined and behavior-tested where applicable.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:58:- [ ] Semantic convergence and reducer-owned machine-section boundaries are documented across both loop products.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:77:- **Skill layer**: current contracts, references, config/strategy/dashboard assets
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:86:  -> define typed stop-decision events, legal done gates, resume cursor, and replayable lineage schema
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:89:  -> add journals, snapshot/compaction, reducer durability, observability rollups, and decomposition scaffolding
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:92:  -> add claim ledger, publication critique, promotion checkpoints, semantic convergence, and reducer-owned review machine sections
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:115:**Why first**: Every later improvement depends on a trusted answer to four questions: why did the loop stop, was STOP legal, where can a session resume, and can the stop decision be replayed from packet-local state.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:141:- Define typed event records with `schemaVersion`, `stopReason`, `blockedBy`, and `recoveryStrategy` before adding richer reducers or dashboards.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:142:- Add fixture-based cases that prove blocked-stop behavior and replayable stop-decision logging when convergence math passes but quality gates fail.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:154:- `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:160:- `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:174:- Reducer fixtures prove append-only journal rollups, delta replay, snapshot/compaction equivalence, and dashboard regeneration remain idempotent.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:189:- `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:195:- `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:209:- Review contract tests prove machine-owned strategy sections are reducer-owned and no longer edited directly by `@deep-review`.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:213:**Scope**: REQ-006 plus supporting coverage for REQ-001 through REQ-019
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:229:- Create thin end-to-end harnesses first for invalid-state, resume, completed-continue, blocked-stop, and compaction-equivalence replay.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:230:- Research behavior tests should assert falsifiable question framing, citation presence, conclusion confidence, clustering, semantic convergence, and stop-reason persistence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:231:- Review behavior tests should assert dimension rotation, citation presence, hotspot ranking, claim-adjudication gate enforcement, reducer-owned machine sections, and stop-reason persistence.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:237:**Why after early verification**: Once the foundational and trust contracts have replay-backed coverage, parity and mirror alignment can move as one bounded follow-on without guessing at unstable interim surfaces.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:259:- Confirm-mode and auto-mode docs should describe the same artifacts, lifecycle terms, and reducer-ownership boundaries.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:297:| Behavioral | Research/review runtime behavior, stop reasons, journals, snapshots, replay corpus, observability, decomposition, and semantic convergence | `pnpm vitest .opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts .opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:298:| Integration | Auto and confirm YAML flows across resume/blocked-stop/optional-mode scenarios | Workflow fixtures plus targeted `pnpm vitest` integration cases added in this packet's implementation phase |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:305:| Research blocked-stop path | Prove convergence math alone cannot terminate the loop | JSONL event with blocked stop, dashboard status, behavior test fixture |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:306:| Review all-dimensions-clean path | Prove review can stop only after dimension coverage and quality gates pass | JSONL stop reason, dashboard coverage section, behavior test fixture |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:308:| Claim-ledger path | Prove research claims become verified/contradicted/unresolved with evidence refs | Ledger artifact plus synthesis excerpt |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:309:| Audit-journal path | Prove reads/searches/evidence extraction and convergence math are recorded append-only | Journal artifact plus reducer summary |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:311:| Observability path | Prove dashboards expose timing/tool/token histograms, state diffs, anomalies, and stop-decision drill-down | Dashboard sections plus replay-backed behavior fixture |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:313:| Semantic convergence path | Prove semantic novelty, contradiction density, and citation overlap participate in stop decisions | Typed stop-decision trace plus blocked-stop fixture |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:328:| Replay corpus seed packets `028`, `040`, and `042` | Internal | Yellow | Behavior/replay harness coverage stays synthetic instead of packet-derived |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:338:- **Trigger**: A proposed runtime change makes STOP/legal completion behavior less explainable, breaks resume semantics, or requires hidden state outside packet artifacts.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:341:  2. Roll back stop/journal/ledger changes by feature group, not as a single monolith, so trusted baseline behavior can be restored incrementally.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:359:| `FOUNDATION-FIRST` | Do not start council or coordination-board work before the shared stop/done/resume substrate is stable. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:360:| `PACKET-LOCAL` | Keep journals, ledgers, dashboards, and coordination artifacts packet-local and auditable. |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:370:- If a foundational stop/resume contract is unresolved, do not proceed to journals, ledgers, or optional modes.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:379:  -> Phase 2b (Trust surfaces, ledgers, and critique)
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:455:| M1: Replayable Runtime Foundation | Typed stop-decision events, blocked-stop logging, and resume cursor contract land consistently | Phase 1 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:457:| M3: Trust Surface Upgrade | Claim ledger, semantic convergence, promotion checkpoints, and reducer-owned review machine sections are specified and guarded | Phase 2b + Phase 3 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:465:| Shared stop/runtime contract | None | Stop reasons, done-gate rules, resume cursor | All downstream phases |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:466:| Journals and trust artifacts | Shared stop/runtime contract | Journals, ledgers, richer dashboards | Behavior testing, optional modes |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:475:1. **Shared stop/done/resume contract** - critical because every later artifact depends on it.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:476:2. **Journal/ledger/dashboard schema and reducer support** - critical because behavior tests need stable packet artifacts.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:484:- Runtime mirror updates can proceed in parallel with reducer/dashboard work if parity tests are authoritative.
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:492:| M1 | Runtime truth contract locked | Shared stop reasons, legal done gate, and resume cursor planned and implemented | End of Phase 1 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:493:| M2 | Trust surfaces operational | Journals, ledgers, and richer dashboards are wired into reducers/workflows | End of Phase 2 |
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md:510:- Positive: We avoid shipping expensive optional modes on top of untrusted stop/resume behavior.

codex
I’ve now got the hotspots indexed by line number. The next pass is narrower: convergence logic, lifecycle/resume flow, reducer behavior, and agent write contracts. That should let me answer each iteration with direct “spec says X, runtime currently does Y” evidence instead of broad summaries.
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/convergence.md | sed -n '280,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/convergence.md | sed -n '15,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   280	| 0.85-1.0 | Near-complete or complete | Stop |
   281	
   282	The 0.85 threshold accounts for questions that may be unanswerable or out of scope. Research that has answered 85%+ of its questions is likely saturated.
   283	
   284	> **Source-Hygiene Note:** Tentative findings (`sourceStrength == "tentative"`) do not count toward answered-question coverage unless confirmed by an independent source in a later iteration. When computing `answered / total`, exclude any question whose only supporting evidence has tentative strength. This prevents premature convergence based on unverified or low-confidence information.
   285	
   286	### Reading JSONL State (Fault-Tolerant)
   287	
   288	When reading `deep-research-state.jsonl`, parse defensively:
   289	
   290	1. Read file line by line
   291	2. Wrap each line parse in try/catch
   292	3. On parse failure: skip the line, increment `skippedCount`
   293	4. For successfully parsed lines, apply defaults for missing fields:
   294	   - `status ?? "complete"`
   295	   - `newInfoRatio ?? 0.0`
   296	   - `findingsCount ?? 0`
   297	   - `focus ?? "unknown"`
   298	   - `keyQuestions ?? []`
   299	5. After all lines: if `skippedCount > 0`, log warning:
   300	   `"Warning: {skippedCount} of {totalLines} JSONL lines were malformed and skipped."`
   301	6. Proceed with valid entries only
   302	
   303	This ensures convergence checks continue even after partial state corruption. See state_format.md Section 3 for the full fault tolerance specification.
   304	
   305	### Segment Model (REFERENCE-ONLY)
   306	
   307	Segments partition a research session into logical phases without losing history when an implementation explicitly enables them.
   308	
   309	| Field | Type | Default | Description |
   310	|-------|------|---------|-------------|
   311	| segment (on iteration records) | number | 1 | Segment this iteration belongs to |
   312	| segment_start (event type) | event | -- | Marks the start of a new segment |
   313	
   314	When computing convergence signals:
   315	- Filter iterations by `segment === currentSegment`
   316	- Hard stops (max iterations) count ALL iterations regardless of segment
   317	- Cross-segment analysis: read full JSONL without segment filtering
   318	
   319	Segment transitions are triggered only when a runtime explicitly enables them:
   320	- `:restart` mode in an implementation that supports it
   321	- Explicit user request for a new research angle
   322	- Orchestrator judgment when research direction fundamentally shifts
   323	
   324	See state_format.md Section 3 for JSONL schema details.
   325	
   326	---
   327	
   328	<!-- /ANCHOR:signal-definitions -->
   329	<!-- ANCHOR:stuck-recovery-protocol -->
   330	## 4. STUCK RECOVERY PROTOCOL
   331	
   332	When `stuckCount >= stuckThreshold` (default 3):
   333	
   334	### Step 1: Analyze Why
   335	Read strategy.md to understand:
   336	- What approaches have been exhausted?
   337	- What questions remain unanswered?
   338	- What has NOT been tried?
   339	
   340	### Step 1.5: Classify Failure Mode

 succeeded in 0ms:
    15	Convergence detection prevents infinite loops and stops research when additional iterations yield diminishing returns. The algorithm evaluates multiple signals to make a stop/continue/recovery decision, while the reducer publishes the resulting `convergenceScore` and `coverageBySources` into the dashboard and findings registry after every iteration.
    16	
    17	---
    18	
    19	<!-- /ANCHOR:overview -->
    20	<!-- ANCHOR:shouldcontinue-algorithm -->
    21	## 2. THE shouldContinue() ALGORITHM
    22	
    23	> **Segment Awareness (REFERENCE-ONLY)**: When segments are explicitly enabled, `state.iterations` may be pre-filtered to the current segment. The live workflow uses a single segment by default.
    24	
    25	### 2.1 Hard Stops (checked first, always apply)
    26	
    27	```
    28	function shouldContinue(state, config):
    29	  iterations = state.iterations  // single live segment; optional segment filtering is reference-only
    30	
    31	  // Hard stop: max iterations
    32	  if len(iterations) >= config.maxIterations:
    33	    return { action: "STOP", reason: "max_iterations_reached" }
    34	
    35	  // Hard stop: all questions answered
    36	  unanswered = countUnanswered(state.strategy.keyQuestions)
    37	  if unanswered == 0:
    38	    return { action: "STOP", reason: "all_questions_answered" }
    39	```
    40	
    41	### 2.2 Stuck Detection
    42	
    43	```
    44	  // Stuck detection: consecutive no-progress
    45	  stuckCount = countConsecutiveStuck(iterations)
    46	  if stuckCount >= config.stuckThreshold:
    47	    return { action: "STUCK_RECOVERY", reason: "stuck_detected", stuckCount }
    48	```
    49	
    50	### 2.3 Composite Convergence (3-Signal Weighted Vote)
    51	
    52	Three independent signals each cast a stop/continue vote. Stop when weighted stop-score exceeds the consensus threshold.
    53	
    54	| Signal | Weight | Min Iterations | Measures |
    55	|--------|--------|---------------|----------|
    56	| Rolling Average | 0.30 | 3 | Recent information yield |
    57	| MAD Noise Floor | 0.35 | 4 | Signal vs noise in newInfoRatio |
    58	| Question Entropy | 0.35 | 1 | Coverage of research questions |
    59	
    60	Reducer-owned metrics derived from these signals:
    61	
    62	- `convergenceScore`: normalized stop-score surfaced in `findings-registry.json` and `deep-research-dashboard.md`
    63	- `coverageBySources`: per-question source coverage summary used by the quality guards
    64	
    65	```
    66	  // Filter: exclude "thought" iterations from convergence signals
    67	  // Thought iterations (analytical-only, no evidence) should not affect
    68	  // rolling average, MAD noise floor, or stuck detection.
    69	  // Insight iterations ARE included — they have low ratios but are not stuck.
    70	  evidenceIterations = [i for i in iterations if i.status != "thought"]
    71	
    72	  // Composite convergence: 3-signal weighted vote
    73	  signals = []
    74	  totalWeight = 0
    75	
    76	  // Signal 1: Rolling average of last N newInfoRatios (excludes thought)
    77	  if len(evidenceIterations) >= 3:
    78	    recent = evidenceIterations[-3:]
    79	    avgNewInfo = mean(i.newInfoRatio for i in recent)
    80	    rollingStop = avgNewInfo < config.convergenceThreshold
    81	    signals.push({ name: "rollingAvg", value: avgNewInfo, stop: rollingStop, weight: 0.30 })
    82	    totalWeight += 0.30
    83	
    84	  // Signal 2: MAD noise floor (needs 4+ data points, excludes thought)
    85	  if len(evidenceIterations) >= 4:
    86	    allRatios = [i.newInfoRatio for i in evidenceIterations]
    87	    med = median(allRatios)
    88	    mad = median([abs(r - med) for r in allRatios])
    89	    noiseFloor = mad * 1.4826  // consistent estimator for normal distribution
    90	    latestRatio = iterations[-1].newInfoRatio
    91	    madStop = latestRatio <= noiseFloor
    92	    signals.push({ name: "madScore", value: noiseFloor, stop: madStop, weight: 0.35 })
    93	    totalWeight += 0.35
    94	
    95	  // Signal 3: Question entropy coverage
    96	  answered = countAnswered(state.strategy.keyQuestions)
    97	  total = countTotal(state.strategy.keyQuestions)
    98	  if total > 0:
    99	    coverage = answered / total
   100	    entropyStop = coverage >= 0.85  // 85%+ questions answered signals saturation
   101	    signals.push({ name: "entropyCoverage", value: coverage, stop: entropyStop, weight: 0.35 })
   102	    totalWeight += 0.35
   103	
   104	  // Compute weighted stop score
   105	  if totalWeight > 0:
   106	    // Redistribute weights to active signals
   107	    stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
   108	    if stopScore > 0.60:
   109	      return { action: "STOP", reason: "composite_converged", stopScore, signals }
   110	
   111	  // Default: continue
   112	  return { action: "CONTINUE", unansweredCount: unanswered, signals }
   113	```
   114	
   115	### 2.4 Quality Guard Protocol
   116	
   117	After composite convergence votes STOP but before the decision is finalized, three binary guards must pass. If any guard fails, the STOP is overridden to CONTINUE and violations are logged.
   118	
   119	| Guard | Rule | Fail Action |
   120	|-------|------|-------------|
   121	| Source Diversity | Every answered question must cite >= 2 independent sources | Block STOP, log `guard_violation` |
   122	| Focus Alignment | Answered questions must map to original key questions from initialization | Block STOP, log `guard_violation` |
   123	| No Single-Weak-Source | No answered question can rely solely on one source with `sourceStrength == "tentative"` | Block STOP, log `guard_violation` |
   124	
   125	**Checks:**
   126	
   127	- **Source Diversity**: For each question marked answered in strategy.md, count distinct sources from iteration JSONL records. Require >= 2.
   128	- **Focus Alignment**: Compare answered question labels against the initial key questions stored in strategy.md at initialization. Flag any answered question not in the original set.
   129	- **No Single-Weak-Source**: For questions answered by exactly one source, verify that source's strength is not `"tentative"`.
   130	
   131	```
   132	function checkQualityGuards(state, strategy):
   133	  violations = []
   134	  for q in strategy.answeredQuestions:
   135	    sources = collectSources(state.iterations, q)
   136	    if len(sources) < 2:
   137	      violations.push({ guard: "source_diversity", question: q })
   138	    if q not in strategy.originalKeyQuestions:
   139	      violations.push({ guard: "focus_alignment", question: q })
   140	    if len(sources) == 1 and sources[0].strength == "tentative":
   141	      violations.push({ guard: "single_weak_source", question: q })
   142	
   143	  if len(violations) > 0:
   144	    for v in violations:
   145	      appendToJSONL({ type: "event", event: "guard_violation", ...v })
   146	    return { passed: false, violations }
   147	  return { passed: true }
   148	```
   149	
   150	When the composite convergence returns STOP, invoke `checkQualityGuards()`. If it returns `passed: false`, override the action to CONTINUE and resume the loop. The orchestrator should target the violated questions in the next iteration's focus area.
   151	
   152	### Dead-End Coverage Signal (REFERENCE-ONLY)
   153	
   154	> **This section is REFERENCE-ONLY** — not part of the live algorithm. Included for future implementation consideration.
   155	
   156	When the proportion of identified approaches that have been either validated or eliminated reaches a high threshold, this could serve as an additional convergence signal indicating the research space has been thoroughly explored.
   157	
   158	```
   159	deadEndCoverage = (validated + eliminated) / totalIdentifiedApproaches
   160	```
   161	
   162	- `validated`: approaches that produced confirmed, well-sourced findings
   163	- `eliminated`: approaches explicitly marked as exhausted or fruitless
   164	- `totalIdentifiedApproaches`: all approaches recorded in strategy.md
   165	
   166	A threshold of 0.80 would mean 80% of known avenues have been resolved one way or another. This signal could complement the existing composite vote but is not currently wired into `shouldContinue()`.
   167	
   168	### Graceful Degradation
   169	
   170	| Iterations Completed | Active Signals | Behavior |
   171	|--------------------|----------------|----------|
   172	| 1-2 | Entropy only (weight 1.0) | Very unlikely to stop (need 85%+ coverage) |
   173	| 3 | Rolling avg + entropy | Two-signal vote, reweighted |
   174	| 4+ | All three signals | Full composite, most reliable |
   175	
   176	### Decision Priority
   177	
   178	Checks are evaluated in this order (first match wins):
   179	
   180	1. **Max iterations** (hard cap, always checked first)

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/loop_protocol.md | sed -n '188,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/loop_protocol.md | sed -n '40,150p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/convergence.md | sed -n '600,853p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   188	- Budget limits are soft caps — if the agent is actively writing its iteration file when the limit is reached, allow completion
   189	
   190	#### Step 4: Evaluate Results
   191	After agent completes:
   192	1. Verify `{spec_folder}/research/iterations/iteration-{NNN}.md` was created
   193	2. Verify JSONL was appended with iteration record
   194	3. Run reducer with `{ latestJSONLDelta, newIterationFile, priorReducedState }`
   195	4. Verify reducer refreshed `deep-research-strategy.md`, `findings-registry.json`, and `deep-research-dashboard.md`
   196	5. Verify the refreshed packet surfaces reflect the new iteration evidence
   197	6. Extract `newInfoRatio` from JSONL record
   198	7. Track stuck count: skip if `status == "thought"` (no change), reset to 0 if `status == "insight"` (breakthrough counts as progress), increment if `newInfoRatio < config.convergenceThreshold`, reset otherwise
   199	
   200	#### Step 4a: Generate Dashboard
   201	
   202	After evaluating iteration results, generate a human-readable dashboard:
   203	
   204	1. Read JSONL state log, findings registry, and strategy.md
   205	2. Generate or regenerate `research/deep-research-dashboard.md` with the following sections:
   206	   - **Iteration table**: `| run | focus | newInfoRatio | findings count | status |`
   207	   - **Question status**: `X/Y answered` with itemized list (answered vs remaining)
   208	   - **Trend**: Last 3 newInfoRatio values with direction indicator (ascending, descending, flat)
   209	   - **Dead ends**: Consolidated from all iteration `ruledOut` data
   210	   - **Next focus**: Current value from strategy.md
   211	   - **Active risks**: Guard violations, stuck count, budget warnings
   212	3. Log event: `{"type":"event","event":"dashboard_generated","iteration":N}`
   213	4. The dashboard is **auto-generated only** — never manually edited
   214	5. The dashboard file is overwritten each iteration (not appended)
   215	6. Dashboard generation is non-blocking: if it fails, log a warning and continue the loop
   216	
   217	In **confirm mode**, the dashboard is displayed to the user at each iteration approval gate. In **auto mode**, it is written silently for post-hoc review.
   218	
   219	#### Step 4b: Checkpoint Commit (REFERENCE-ONLY)
   220	

 succeeded in 0ms:
    40	
    41	### Purpose
    42	Set up all state files for a new research session.
    43	
    44	### Steps
    45	
    46	1. **Classify session state before writing**:
    47	   - `fresh`: no config/state/strategy files exist
    48	   - `resume`: config + state + strategy all exist and agree
    49	   - `completed-session`: consistent prior state with `config.status == "complete"`
    50	   - `invalid-state`: partial or contradictory artifacts
    51	2. **Resolve canonical artifact names**:
    52	   - Read legacy aliases during the migration window if needed
    53	   - Write only canonical `deep-research-*` names
    54	   - Emit a `migration` event for every legacy alias consumed
    55	3. **Create spec folder** (if needed): `mkdir -p {spec_folder}/research/iterations`
    56	4. **Write config**: `research/deep-research-config.json` from template + user parameters
    57	5. **Initialize state log**: First line of `research/deep-research-state.jsonl` with config record
    58	6. **Initialize strategy**: `research/deep-research-strategy.md` from template with:
    59	   - Topic from user input
    60	   - Initial key questions (3-5, from topic analysis)
    61	   - Known context from `memory_context()` results (if any), injected only after the strategy file exists
    62	   - Research boundaries from config
    63	7. **Initialize findings registry**: `research/findings-registry.json` with empty `openQuestions`, `resolvedQuestions`, `keyFindings`, and `ruledOutDirections`
    64	7a. **Validate Research Charter**:
    65	   - Verify strategy.md contains a "Non-Goals" section (may be empty but must exist)
    66	   - Verify strategy.md contains a "Stop Conditions" section (may be empty but must exist)
    67	   - If either section is missing, append it as an empty placeholder before proceeding
    68	   - In **confirm mode**: present the charter (topic, key questions, non-goals, stop conditions) for user review before proceeding
    69	   - In **auto mode**: accept the charter automatically and continue
    70	8. **Resume only if config, JSONL, and strategy agree**; otherwise halt for repair instead of guessing
    71	
    72	### Outputs
    73	- `research/deep-research-config.json`
    74	- `research/deep-research-state.jsonl` (1 line)
    75	- `research/deep-research-strategy.md`
    76	
    77	### Auto-Resume Protocol
    78	If state files already exist from a prior session:
    79	1. Verify config, JSONL, and strategy all exist and agree on topic/spec folder
    80	2. Read JSONL, count iteration records
    81	3. Read strategy.md for current state
    82	4. Set iteration counter to last completed + 1
    83	5. Log resume event to JSONL: `{"type":"event","event":"resumed","fromIteration":N}`
    84	6. Continue loop from step_read_state
    85	
    86	### Lifecycle Branch Contract
    87	
    88	- `resume`: same `sessionId`, no archive, continue from the active lineage boundary
    89	- `restart`: new `sessionId`, incremented `generation`, archive prior packet under `research/archive/{oldSessionId}/`
    90	- `fork`: new `sessionId`, preserve parent linkage, copy current state as branch baseline
    91	- `completed-continue`: snapshot `research/research.md` to `research/synthesis-v{generation}.md`, record `completedAt` and `reopenedAt`, then reopen as a new segment with parent linkage
    92	
    93	---
    94	
    95	<!-- /ANCHOR:phase-initialization -->
    96	<!-- ANCHOR:phase-iteration-loop -->
    97	## 3. PHASE: ITERATION LOOP
    98	
    99	### Loop Steps (repeated until convergence)
   100	
   101	#### Step 1: Read State
   102	- Read `deep-research-state.jsonl` -- count iterations, get last newInfoRatio
   103	- Read `deep-research-strategy.md` -- get next focus, remaining questions
   104	
   105	#### Step 2: Check Convergence
   106	Run the convergence algorithm (see convergence.md):
   107	- Max iterations reached? STOP
   108	- Stuck count >= threshold? STUCK_RECOVERY
   109	- Average newInfoRatio < threshold? STOP
   110	- All questions answered? STOP
   111	- Otherwise: CONTINUE
   112	
   113	#### Step 2c: Quality Guard Check
   114	
   115	When the convergence algorithm returns STOP:
   116	1. Run quality guard checks (see convergence.md §2.4)
   117	2. Verify minimum coverage, source diversity, and question resolution thresholds
   118	3. If **all guards pass**: proceed with STOP, exit to synthesis
   119	4. If **any guard fails**: override decision to CONTINUE
   120	   - Log each violation: `{"type":"event","event":"guard_violation","guard":"<name>","iteration":N,"detail":"<reason>"}`
   121	   - Append failed guard details to strategy.md "Active Risks" section
   122	5. The loop continues until BOTH convergence AND quality guards pass simultaneously
   123	6. Guard checks apply only to STOP decisions — CONTINUE and STUCK_RECOVERY bypass this step
   124	
   125	#### Step 2a: Check Pause Sentinel
   126	
   127	Before dispatching, check for a pause sentinel file:
   128	
   129	1. Check if `research/.deep-research-pause` exists
   130	2. If present:
   131	   - Log event to JSONL: `{"type":"event","event":"paused","reason":"sentinel file detected"}`
   132	   - Halt the loop with message:
   133	     ```
   134	     Research paused. Delete research/.deep-research-pause to resume.
   135	     Current state: Iteration {N}, {remaining} questions remaining.
   136	     ```
   137	   - Do NOT exit to synthesis -- the loop is suspended, not stopped
   138	3. On resume (file deleted and loop restarted):
   139	   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
   140	   - Continue from step_read_state
   141	
   142	**Use case**: In autonomous mode, this provides the only graceful intervention mechanism short of killing the process. Users can create the sentinel file at any time to pause research between iterations.
   143	
   144	#### Step 2b: Generate State Summary
   145	
   146	Generate a compact state summary (~200 tokens) for injection into the dispatch prompt:
   147	
   148	```
   149	STATE SUMMARY (auto-generated):
   150	Segment: {current_segment} | Iteration: {N} of {max}

 succeeded in 0ms:
   600	
   601	When the loop stops, the YAML workflow generates a convergence report:
   602	
   603	```
   604	CONVERGENCE REPORT
   605	------------------
   606	Stop reason: [composite_converged | max_iterations | all_questions_answered | stuck_unrecoverable]
   607	Total iterations: N (segment: S)
   608	Questions answered: X / Y (Z%)
   609	
   610	Composite Convergence Score: 0.XX / 0.60 threshold
   611	  Signal 1 - Rolling Avg (w=0.30): 0.XX [STOP|CONTINUE]
   612	  Signal 2 - MAD Noise (w=0.35):   0.XX [STOP|CONTINUE] (floor: 0.XX)
   613	  Signal 3 - Entropy (w=0.35):     0.XX [STOP|CONTINUE] (coverage: X/Y)
   614	
   615	Noise Floor: 0.XX (last ratio: 0.XX [ABOVE|WITHIN])
   616	Stuck recovery attempts: N (recovered: N, failed: N)
   617	Error recovery tiers used: [list or "none"]
   618	```
   619	
   620	This report is included in the final JSONL entry and displayed to the user.
   621	
   622	<!-- /ANCHOR:convergence-reporting -->
   623	
   624	---
   625	
   626	<!-- ANCHOR:review-mode-convergence -->
   627	## 10. REVIEW MODE CONVERGENCE
   628	
   629	Review mode uses a severity-weighted variant of the convergence algorithm. Instead of measuring "new information" against research questions, it measures "new findings" against the simplified four-dimension review model and machine-verifiable traceability coverage.
   630	
   631	### 10.1 newFindingsRatio (Severity-Weighted)
   632	
   633	The review-mode equivalent of `newInfoRatio`. Computed by the @deep-review agent at the end of each iteration.
   634	
   635	```
   636	SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 }
   637	
   638	weightedNew = sum(SEVERITY_WEIGHTS[f.severity] for f in fully_new_findings)
   639	weightedRefinement = sum(SEVERITY_WEIGHTS[f.severity] * 0.5 for f in refinement_findings)
   640	weightedTotal = sum(SEVERITY_WEIGHTS[f.severity] for f in all_findings_this_iteration)
   641	
   642	newFindingsRatio = (weightedNew + weightedRefinement) / weightedTotal
   643	
   644	P0 Override: if ANY new P0 → newFindingsRatio = max(calculated, 0.50)
   645	If total_findings == 0 → newFindingsRatio = 0.0
   646	```
   647	
   648	**Definitions:**
   649	- `fully_new_findings`: Findings not present in any prior iteration (new findingId)
   650	- `refinement_findings`: Findings that refine or upgrade an existing finding (same root cause, new evidence or severity change)
   651	- `all_findings_this_iteration`: All findings reported in the current iteration
   652	
   653	**P0 Override rationale:** A new critical finding always signals significant remaining work, regardless of the overall new-to-total ratio. Setting a floor of 0.50 prevents premature convergence when critical issues are still being discovered.
   654	
   655	### 10.2 Review Taxonomy and Thresholds
   656	
   657	The simplified review model uses four dimensions and three binary quality gates.
   658	
   659	| Dimension | Role in Convergence | Notes |
   660	|-----------|----------------------|-------|
   661	| Correctness | Required coverage | Logic, invariants, state transitions, observable behavior |
   662	| Security | Required coverage | Trust boundaries, authz/authn, input handling, exploit paths |
   663	| Traceability | Coverage signal + traceability protocols | Spec alignment, checklist evidence, cross-reference integrity |
   664	| Maintainability | Coverage signal | Patterns, clarity, documentation quality, safe follow-on change cost |
   665	
   666	| Setting | Value | Purpose |
   667	|---------|-------|---------|
   668	| `rollingStopThreshold` | `0.08` | STOP vote threshold for the rolling-average signal |
   669	| `noProgressThreshold` | `0.05` | Stuck/no-progress threshold for recovery classification |
   670	| `dimensionCoverage.weight` | `0.45` | Highest-weight convergence signal |
   671	| `coverageAge.minStabilizationPasses` | `1` | Coverage can vote STOP only after at least one stabilization pass |
   672	| `compositeStopScore` | `0.60` | Weighted stop-score needed before guard evaluation |
   673	
   674	### 10.3 shouldContinue_review() Pseudocode
   675	
   676	```
   677	function shouldContinue_review(state, config):
   678	  iterations = state.iterations
   679	  evidenceIterations = [i for i in iterations if i.status != "thought"]
   680	
   681	  if len(iterations) >= config.maxIterations:
   682	    return { action: "STOP", reason: "max_iterations_reached" }
   683	
   684	  activeP0 = countActiveFindings(state, ["P0"])
   685	  activeP1 = countActiveFindings(state, ["P1"])
   686	  coverage = computeReviewCoverage(state, config)
   687	  stabilizationPasses = countCoverageStabilizationPasses(evidenceIterations, coverage)
   688	
   689	  if coverage.dimensionCoverage == 1.0 and activeP0 == 0 and activeP1 == 0:
   690	    if stabilizationPasses >= config.coverageAge.minStabilizationPasses:
   691	      gateResult = checkReviewQualityGates(state, config, coverage)
   692	      if gateResult.passed:
   693	        return { action: "STOP", reason: "all_dimensions_clean", coverage, stabilizationPasses }
   694	
   695	  stuckCount = countConsecutiveStuck_review(evidenceIterations, config.thresholds.noProgressThreshold)
   696	  if stuckCount >= config.stuckThreshold:
   697	    return { action: "STUCK_RECOVERY", reason: "stuck_detected", stuckCount }
   698	
   699	  signals = []
   700	  totalWeight = 0
   701	
   702	  if len(evidenceIterations) >= 2:
   703	    recent = evidenceIterations[-2:]
   704	    avgRatio = mean(i.newFindingsRatio for i in recent)
   705	    rollingStop = avgRatio < config.thresholds.rollingStopThreshold
   706	    signals.push({ name: "rollingAvg", value: avgRatio, stop: rollingStop, weight: 0.30 })
   707	    totalWeight += 0.30
   708	
   709	  if len(evidenceIterations) >= 3:
   710	    allRatios = [i.newFindingsRatio for i in evidenceIterations]
   711	    med = median(allRatios)
   712	    mad = median([abs(r - med) for r in allRatios])
   713	    noiseFloor = mad * 1.4826
   714	    latestRatio = evidenceIterations[-1].newFindingsRatio
   715	    madStop = latestRatio <= noiseFloor
   716	    signals.push({ name: "madScore", value: noiseFloor, stop: madStop, weight: 0.25 })
   717	    totalWeight += 0.25
   718	
   719	  coverageStop = (
   720	    coverage.dimensionCoverage == 1.0 and
   721	    coverage.requiredProtocolsCovered and
   722	    stabilizationPasses >= config.coverageAge.minStabilizationPasses
   723	  )
   724	  signals.push({
   725	    name: "dimensionCoverage",
   726	    value: coverage.dimensionCoverage,
   727	    stop: coverageStop,
   728	    weight: 0.45,
   729	    metadata: {
   730	      requiredProtocolsCovered: coverage.requiredProtocolsCovered,
   731	      stabilizationPasses: stabilizationPasses,
   732	    },
   733	  })
   734	  totalWeight += 0.45
   735	
   736	  if totalWeight > 0:
   737	    stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
   738	    if stopScore >= config.thresholds.compositeStopScore:
   739	      gateResult = checkReviewQualityGates(state, config, coverage)
   740	      if gateResult.passed:
   741	        return { action: "STOP", reason: "composite_converged", stopScore, signals }
   742	      for violation in gateResult.violations:
   743	        appendToJSONL({ type: "event", event: "guard_violation", ...violation })
   744	      return { action: "CONTINUE", reason: "guard_override", violations: gateResult.violations, signals }
   745	
   746	  return { action: "CONTINUE", coverage, stabilizationPasses, signals }
   747	```
   748	
   749	### 10.4 Review Quality Gates
   750	
   751	Three binary gates must pass before a STOP decision is finalized. If any gate fails, the STOP is overridden to CONTINUE.
   752	
   753	| Gate | Rule | Fail Action |
   754	|------|------|-------------|
   755	| Evidence | Every active finding has concrete `file:line` evidence and is not inference-only | Block STOP, log `guard_violation` |
   756	| Scope | Findings and reviewed files stay within the declared review scope | Block STOP, log `guard_violation` |
   757	| Coverage | Configured dimensions and required traceability protocols must be covered before STOP is allowed | Block STOP, log `guard_violation` |
   758	
   759	```
   760	function checkReviewQualityGates(state, config, coverage):
   761	  violations = []
   762	
   763	  for f in state.findings where f.status == "active":
   764	    if not f.hasFileLineCitation or f.evidenceType == "inference-only":
   765	      violations.push({ gate: "evidence", findingId: f.id,
   766	                        detail: "Active finding lacks concrete evidence or relies only on inference" })
   767	
   768	  reviewScope = resolveReviewScope(config.reviewTarget, config.reviewTargetType)
   769	  for f in state.findings where f.status == "active":
   770	    if f.filePath not in reviewScope:
   771	      violations.push({ gate: "scope", findingId: f.id,
   772	                        detail: "Finding outside declared review scope" })
   773	
   774	  if coverage.dimensionCoverage < 1.0:
   775	    violations.push({ gate: "coverage", detail: "Not all configured review dimensions are covered" })
   776	  if not coverage.requiredProtocolsCovered:
   777	    violations.push({ gate: "coverage", detail: "Required traceability protocols are incomplete" })
   778	
   779	  if len(violations) > 0:
   780	    return { passed: false, violations }
   781	  return { passed: true }
   782	```
   783	
   784	### 10.5 Replay Validation
   785	
   786	Replay validation verifies that convergence decisions are reproducible from disk state alone.
   787	
   788	1. Read `deep-research-state.jsonl` and select review-mode iteration records in run order.
   789	2. Recompute `newFindingsRatio`, rolling-average votes, MAD votes, and coverage votes from the stored JSONL fields only.
   790	3. Recompute `traceabilityChecks.summary` and confirm required protocol statuses match the recorded coverage vote.
   791	4. Re-run the evidence, scope, and coverage gates against the stored findings and scope data.
   792	5. Compare the replayed decision and stop reason to the recorded synthesis event.
   793	
   794	Replay passes only when the recomputed decision, thresholds, and gate outcomes agree with the persisted result.
   795	
   796	### 10.6 Review Stuck Recovery
   797	
   798	**Threshold:** 2 consecutive no-progress iterations. Review mode uses `noProgressThreshold = 0.05`, not the rolling stop threshold.
   799	
   800	#### Failure Modes and Recovery Strategies
   801	
   802	| Failure Mode | Detection | Recovery Strategy |
   803	|-------------|-----------|-------------------|
   804	| Same dimension stuck | Last 2 iterations reviewed the same dimension and both ratios are `< 0.05` | **Change granularity:** if reviewing at file level, zoom into functions; if reviewing functions, zoom out to module level |
   805	| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay:** re-run the unresolved traceability protocol directly against the conflicting artifacts |
   806	| Low-value advisory churn | Last 2 iterations found only P2 work | **Escalate severity review:** explicitly search for P0/P1 patterns or downgrade unsupported severity claims |
   807	
   808	#### Selection Logic
   809	
   810	```
   811	function selectReviewRecoveryStrategy(stuckIterations, state, config):
   812	  lastFocuses = [i.focus for i in stuckIterations[-2:]]
   813	
   814	  // Same dimension stuck? Change granularity
   815	  if len(set(lastFocuses)) <= 1:
   816	    return { strategy: "change_granularity", dimension: lastFocuses[0] }
   817	
   818	  if hasRequiredProtocolPlateau(state.traceabilityChecks):
   819	    return { strategy: "protocol_first_replay" }
   820	
   821	  // Default: escalate severity
   822	  return { strategy: "escalate_severity_review" }
   823	```
   824	
   825	#### Recovery Evaluation
   826	- If recovery iteration finds any new P0/P1 or materially advances required traceability coverage: recovery successful. Reset stuck count. Continue.
   827	- If recovery iteration finds only P2 or nothing: recovery failed. If all dimensions are already covered, exit to synthesis. Otherwise, move to the next unreviewed dimension.
   828	
   829	### 10.7 Review Edge Cases
   830	
   831	#### Clean Codebase
   832	When the review target has no significant issues:
   833	- Continue until all 4 dimensions have been reviewed
   834	- Require `minStabilizationPasses >= 1` before the coverage signal can vote STOP
   835	- Require evidence, scope, and coverage gates to pass
   836	
   837	#### Huge Scope
   838	When the review target contains many files:
   839	- Use `maxFilesPerIteration` to limit files reviewed per iteration (default: 10)
   840	- Batch dimensions: review 1-2 dimensions per iteration rather than all 4
   841	- Prioritize security and correctness dimensions first
   842	
   843	#### Late P0 Discovery
   844	When a P0 is found in a late iteration:
   845	- The P0 override rule is unchanged: `newFindingsRatio = max(calculated, 0.50)`
   846	- All dimensions that could be affected by the P0 root cause must be re-checked
   847	- Convergence cannot occur with active P0 findings
   848	
   849	#### False Convergence
   850	When convergence signals fire but review is incomplete:
   851	- Coverage cannot vote STOP until `minStabilizationPasses >= 1`
   852	- Replay validation must reproduce the same stop reason from JSONL state
   853	- Binary gates prevent STOP when evidence, scope, or required traceability coverage is incomplete

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/loop_protocol.md | sed -n '448,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   448	     - Consolidate all `## Dead Ends` sections from iteration files
   449	     - Format as a table: `| Approach | Reason Eliminated | Evidence | Iteration(s) |`
   450	     - This section documents negative knowledge (what was tried and why it failed)
   451	     - Treat as primary research output — not an appendix or afterthought
   452	     - Place after Section 11 (Recommendations) and before Section 12 (Open Questions)
   453	4. **If reopening a completed packet later**: snapshot this file as `research/synthesis-v{generation}.md` before any `completed-continue` flow
   454	5. **Update config status**: Set `status: "complete"` in config.json
   455	6. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","totalIterations":N,"answeredCount":A,"totalQuestions":Q,"stopReason":"converged"}`
   456	
   457	### Progressive vs Final Synthesis
   458	- If `progressiveSynthesis: true` (default): research/research.md was updated each iteration. Final synthesis is a cleanup pass.
   459	- If `progressiveSynthesis: false`: research/research.md is created from scratch during synthesis.
   460	

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/loop_protocol.md | sed -n '568,742p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   568	1. **Classify session state**: Same as research mode (fresh, resume, completed-session, invalid-state)
   569	2. **Create spec folder** (if needed): `mkdir -p {spec_folder}/review/iterations`
   570	3. **Scope discovery**: Resolve the review target into a concrete file list:
   571	   - `spec-folder`: Read spec.md, plan.md, implementation files listed in tasks.md
   572	   - `skill`: Read SKILL.md, references/, assets/, scripts/, find agent definitions and command entry points
   573	   - `agent`: Find agent definitions across all runtimes, compare for consistency
   574	   - `track`: List all child spec folders under the track, read spec.md + checklist.md for each
   575	   - `files`: Expand glob patterns, validate existence, discover cross-references
   576	   - Store resolved file list in strategy.md "Files Under Review"
   577	4. **Dimension ordering**: Order the 4 review dimensions for iteration:
   578	   - Priority: correctness and security first (highest-impact dimensions)
   579	   - Default order: D1 Correctness, D2 Security, D3 Traceability, D4 Maintainability
   580	5. **Traceability protocol plan**: Partition protocols into:
   581	   - **Core**: `spec_code`, `checklist_evidence`
   582	   - **Overlay**: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`
   583	   Only schedule overlay protocols that apply to the target type.
   584	6. **Write config**: `{spec_folder}/review/deep-research-config.json` with `mode: "review"` and review fields
   585	7. **Initialize state log**: First JSONL line with config record including `mode: "review"`
   586	8. **Initialize strategy**: `{spec_folder}/review/deep-review-strategy.md` from review template with:
   587	   - Topic (review target description)
   588	   - Review Dimensions checklist
   589	   - Files Under Review table
   590	   - Cross-Reference Status table grouped by core vs overlay
   591	   - Known Context from `memory_context()` results
   592	   - Review Boundaries from config
   593	9. **Validate review charter**:
   594	   - Verify strategy.md contains Non-Goals and Stop Conditions sections
   595	   - In **confirm mode**: present the charter (target, dimensions, scope, non-goals) for user review
   596	   - In **auto mode**: accept automatically and continue
   597	
   598	#### Outputs
   599	- `{spec_folder}/review/deep-research-config.json` (with review fields)
   600	- `{spec_folder}/review/deep-research-state.jsonl` (1 line)
   601	- `{spec_folder}/review/deep-review-strategy.md`
   602	
   603	### 6.2 Review Loop
   604	
   605	The iteration loop follows the same Step 1-5 structure as research mode with these adaptations:
   606	
   607	#### Step 1: Read State (adapted)
   608	- Read JSONL to count iterations and extract `newFindingsRatio`, `findingsSummary`, `findingsNew`, and `traceabilityChecks`
   609	- Read `{spec_folder}/review/deep-review-strategy.md` to get next focus dimension/files, remaining dimensions, and protocol gaps
   610	
   611	#### Step 2: Check Convergence (adapted)
   612	Run `shouldContinue_review()` (see convergence.md Section 10.3):
   613	- Max iterations reached? `STOP`
   614	- Stuck count `>= 2` using `noProgressThreshold = 0.05`? `STUCK_RECOVERY`
   615	- Composite convergence votes `STOP` only after:
   616	  - rolling average uses `rollingStopThreshold = 0.08`
   617	  - dimension coverage reaches 100% across the 4-dimension model
   618	  - coverage has aged through `minStabilizationPasses >= 1`
   619	  - required traceability protocols are covered
   620	  - evidence, scope, and coverage gates pass
   621	- Otherwise: `CONTINUE`
   622	
   623	#### Step 2b: Generate State Summary (adapted)
   624	```
   625	STATE SUMMARY (auto-generated, review mode):
   626	Iteration: {N} of {max} | Mode: review
   627	Target: {config.reviewTarget} ({config.reviewTargetType})
   628	Dimensions: {reviewed}/{total} complete | Next: {nextDimension}
   629	Findings: P0:{count} P1:{count} P2:{count} active
   630	Traceability: core={core_status} overlay={overlay_status}
   631	Last 2 ratios: {ratio_N-1} -> {ratio_N} | Stuck count: {stuck_count}
   632	Provisional verdict: {PASS|CONDITIONAL|FAIL|PENDING} | hasAdvisories={hasAdvisories}
   633	Next focus: {strategy.nextFocus}
   634	```
   635	
   636	#### Step 3: Dispatch Agent (adapted)
   637	Dispatch `@deep-review` with review-specific context:
   638	```
   639	{state_summary}  // Auto-generated (Step 2b)
   640	
   641	Review Target: {config.reviewTarget}
   642	Review Mode: {config.reviewTargetType}
   643	Iteration: {N} of {maxIterations}
   644	Focus Dimension: {strategy.nextFocus.dimension}
   645	Focus Files: {strategy.nextFocus.files}
   646	Remaining Dimensions: {strategy.remainingDimensions}
   647	Traceability Protocols:
   648	  - Core: {core_protocols}
   649	  - Overlay: {overlay_protocols}
   650	Active Findings: {findingsSummary}
   651	State Files:
   652	  - Config: {spec_folder}/review/deep-research-config.json
   653	  - State: {spec_folder}/review/deep-research-state.jsonl
   654	  - Strategy: {spec_folder}/review/deep-review-strategy.md
   655	Output: Write findings to {spec_folder}/review/iterations/iteration-{NNN}.md
   656	CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
   657	CONSTRAINT: Target files are READ-ONLY -- never modify code under review
   658	```
   659	
   660	#### Step 3a: Cross-Reference Protocols
   661	
   662	Traceability checks are split into core vs overlay protocols.
   663	
   664	| Level | Protocol | Applies To | Gate Class | Purpose |
   665	|-------|----------|------------|------------|---------|
   666	| Core | `spec_code` | all targets | hard | Verify normative claims resolve to shipped behavior |
   667	| Core | `checklist_evidence` | all targets | hard | Verify checked completion claims have evidence |
   668	| Overlay | `skill_agent` | skill | advisory | Verify SKILL.md and runtime agents agree |
   669	| Overlay | `agent_cross_runtime` | agent | advisory | Verify runtime agent parity |
   670	| Overlay | `feature_catalog_code` | skill, spec-folder, track, files | advisory | Verify catalog claims match capability |
   671	| Overlay | `playbook_capability` | skill, agent, spec-folder | advisory | Verify playbook scenarios match executable reality |
   672	
   673	Each protocol produces a structured result in `traceabilityChecks.results[]` with `protocolId`, `status`, `gateClass`, `applicable`, counts, evidence, finding refs, and summary text.
   674	
   675	#### Step 4: Evaluate Results (adapted)
   676	After agent completes:
   677	1. Verify `{spec_folder}/review/iterations/iteration-{NNN}.md` was created
   678	2. Verify JSONL was appended with review iteration fields: `dimensions`, `filesReviewed`, `findingsSummary`, `findingsNew`, and `traceabilityChecks`
   679	3. Verify the reducer-owned review strategy surfaces were refreshed (dimension progress, findings count, protocol status)
   680	4. Extract `newFindingsRatio` from JSONL record
   681	5. Update stuck tracking using `noProgressThreshold = 0.05`
   682	
   683	#### Step 4a: Claim Adjudication
   684	
   685	Before the next convergence pass, the orchestrator adjudicates every new P0/P1.
   686	
   687	Each new P0/P1 must record:
   688	- `claim`
   689	- `evidenceRefs`
   690	- `counterevidenceSought`
   691	- `alternativeExplanation`
   692	- `finalSeverity`
   693	- `confidence`
   694	- `downgradeTrigger`
   695	
   696	Protocol:
   697	1. Re-read the cited evidence.
   698	2. Seek counterevidence in adjacent code, docs, or prior iteration history.
   699	3. Record an alternative explanation even if it is rejected.
   700	4. Confirm or downgrade severity before the finding becomes convergence-visible.
   701	
   702	This adjudication step happens after iteration evaluation and before the next convergence math run.
   703	
   704	#### Step 4b: Generate Dashboard (adapted)
   705	Generate `{spec_folder}/review/deep-review-dashboard.md` with review-specific sections:
   706	- Status with provisional verdict and `hasAdvisories`
   707	- Findings summary (P0/P1/P2 counts with deltas)
   708	- Progress table with dimension column
   709	- Coverage (files, dimensions, traceability protocols)
   710	- Trend (`newFindingsRatio`, severity, traceability stability)
   711	
   712	### 6.3 Review Synthesis
   713	
   714	#### Purpose
   715	Compile all iteration findings into the final `{spec_folder}/review/review-report.md`.
   716	
   717	#### Steps
   718	
   719	1. **Read all iteration files**: `{spec_folder}/review/iterations/iteration-*.md`
   720	2. **Read strategy**: Final state of dimensions, findings, coverage, and protocol status
   721	3. **Finding registry dedup**: Consolidate findings across iterations:
   722	   - Group findings by file + line range + root cause
   723	   - Merge duplicates, keeping the highest severity and all evidence
   724	   - Assign final findingIds (F001, F002, ...)
   725	4. **Severity reconciliation**: Use adjudicated `finalSeverity` for any P0/P1 that changed during review
   726	5. **Replay validation**: Recompute the convergence outcome from JSONL state before finalizing the report
   727	6. **Compile `{spec_folder}/review/review-report.md`**: Generate the 9-section contract (see state_format.md Section 8):
   728	   - Executive Summary
   729	   - Planning Trigger
   730	   - Active Finding Registry
   731	   - Remediation Workstreams
   732	   - Spec Seed
   733	   - Plan Seed
   734	   - Traceability Status
   735	   - Deferred Items
   736	   - Audit Appendix
   737	7. **Verdict contract**:
   738	   - `FAIL`: active P0 remains or any binary gate fails
   739	   - `CONDITIONAL`: no active P0, but active P1 remains
   740	   - `PASS`: no active P0/P1; set `hasAdvisories=true` when active P2 remains
   741	8. **Update config status**: Set `status: "complete"` in config.json
   742	9. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":N,"verdict":"PASS|CONDITIONAL|FAIL","activeP0":N,"activeP1":N,"activeP2":N,"dimensionCoverage":X,"stopReason":"..." }`

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/state_format.md | sed -n '136,205p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/state_format.md | sed -n '20,90p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   136	| status | string | iteration only | complete, timeout, error, stuck, insight, thought |
   137	| focus | string | iteration only | What this iteration investigated |
   138	| findingsCount | number | iteration only | Number of distinct findings |
   139	| newInfoRatio | number | iteration only | Fraction of new vs redundant info (0.0-1.0) |
   140	| keyQuestions | string[] | iteration only | Questions addressed this iteration |
   141	| answeredQuestions | string[] | iteration only | Questions fully answered this iteration |
   142	| timestamp | ISO 8601 | Yes | Record creation time |
   143	| durationMs | number | iteration only | Iteration execution time in milliseconds |
   144	| toolsUsed | string[] | No | iteration only | High-level tool names used during the iteration |
   145	| sourcesQueried | string[] | No | iteration only | URLs, file paths, or memory anchors consulted during the iteration |
   146	| segment | number | No | Segment number (default: 1). Groups iterations into logical phases |
   147	| convergenceSignals | object | No | Composite convergence signal values (see below) |
   148	| ruledOut | array | No | Approaches eliminated this iteration (see Negative Knowledge below) |
   149	| noveltyJustification | string | No | Human-readable explanation of what newInfoRatio represents (see below) |
   150	| focusTrack | string | No | Post-hoc grouping label, e.g. `"browser-support"`. Not used for orchestration |
   151	
   152	### Convergence Signal Fields
   153	
   154	When the composite convergence algorithm runs (see convergence.md), signal values are recorded in the iteration record:
   155	
   156	```json
   157	{"type":"iteration","run":5,...,"convergenceSignals":{"rollingAvg":0.12,"madScore":0.08,"entropyCoverage":0.71,"compositeStop":0.42}}
   158	```
   159	
   160	| Field | Type | Description |
   161	|-------|------|-------------|
   162	| rollingAvg | number | Rolling average of last 3 newInfoRatio values |
   163	| madScore | number | MAD-based noise floor value |
   164	| entropyCoverage | number | Question coverage ratio (0.0-1.0) |
   165	| compositeStop | number | Weighted stop score (stop if > 0.60) |
   166	
   167	All fields are optional. Omitted when fewer than 3 iterations exist (insufficient data for composite). Backward compatible: old records without this field parse normally.
   168	
   169	### Negative Knowledge (ruledOut)
   170	
   171	Iteration records may include a `ruledOut` array documenting approaches that were investigated and eliminated:
   172	
   173	```json
   174	{"type":"iteration","run":3,"status":"complete","focus":"Connection pooling","findingsCount":3,"newInfoRatio":0.4,"ruledOut":[{"approach":"HTTP/3 multiplexing","reason":"No server-side support in target environment","evidence":"docs.example.com/protocols#supported"}],"keyQuestions":["What causes latency?"],"answeredQuestions":[],"timestamp":"2026-03-18T10:15:00Z","durationMs":52000}
   175	```
   176	
   177	| Field | Type | Required | Description |
   178	|-------|------|----------|-------------|
   179	| approach | string | Yes | The approach or hypothesis that was eliminated |
   180	| reason | string | Yes | Why it was ruled out |
   181	| evidence | string | No | Source reference supporting the elimination |
   182	
   183	Iteration files (`research/iterations/iteration-NNN.md`) MUST include `## Ruled Out` and `## Dead Ends` sections when negative knowledge is captured. These sections feed reducer-owned strategy and registry refreshes and prevent future iterations from re-exploring eliminated paths.
   184	
   185	### Novelty Justification
   186	
   187	The optional `noveltyJustification` field provides a human-readable breakdown of what the `newInfoRatio` represents:
   188	
   189	```json
   190	{"type":"iteration","run":3,"status":"complete","focus":"Reconnection strategies","findingsCount":4,"newInfoRatio":0.7,"noveltyJustification":"2 new findings on reconnection backoff, 1 refinement of prior keepalive finding","keyQuestions":["How to handle reconnection?"],"answeredQuestions":[],"timestamp":"2026-03-18T10:15:00Z","durationMs":48000}
   191	```
   192	
   193	This field aids post-hoc analysis and helps subsequent iterations calibrate expectations. It is not used in convergence computation.
   194	
   195	### Focus Track Labels
   196	
   197	The optional `focusTrack` field assigns a grouping label to an iteration for post-hoc analysis:
   198	
   199	```json
   200	{"type":"iteration","run":4,...,"focusTrack":"browser-support",...}
   201	```
   202	
   203	Track labels are free-form strings used for filtering and grouping in dashboards and analysis. They are not used for orchestration or convergence decisions. Multiple iterations may share the same track label.
   204	
   205	### Source Strength

 succeeded in 0ms:
    20	| `deep-research-state.jsonl` | JSON Lines | Structured iteration log | Append-only |
    21	| `deep-research-strategy.md` | Markdown | Agent context ("persistent brain") | Updated each iteration |
    22	| `deep-research-dashboard.md` | Markdown | Auto-generated session summary | Auto-generated (read-only) |
    23	| `findings-registry.json` | JSON | Reducer-owned open/resolved questions and key findings | Auto-generated (read-only) |
    24	| `research/iterations/iteration-NNN.md` | Markdown | Detailed findings per iteration | Write-once |
    25	| `research/research.md` | Markdown | Workflow-owned canonical synthesis output | Updated incrementally only when `progressiveSynthesis` is enabled |
    26	
    27	Research mode stores its runtime packet under `{spec_folder}/research/`, with iteration findings under `{spec_folder}/research/iterations/` and canonical synthesis at `{spec_folder}/research/research.md`. `research/research.md` is workflow-owned canonical synthesis output.
    28	
    29	The canonical pause sentinel is `research/.deep-research-pause`. Legacy names may be consumed during the migration window, but new writes must use the canonical `deep-research-*` names.
    30	
    31	Runtime capability matrix references for parity-sensitive surfaces:
    32	- Human-readable matrix: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
    33	- Machine-readable matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
    34	
    35	---
    36	
    37	<!-- /ANCHOR:overview -->
    38	<!-- ANCHOR:config-file -->
    39	## 2. CONFIG FILE (deep-research-config.json)
    40	
    41	Created during initialization. Not modified after creation.
    42	
    43	```json
    44	{
    45	  "topic": "Research topic string",
    46	  "maxIterations": 10,
    47	  "convergenceThreshold": 0.05,
    48	  "stuckThreshold": 3,
    49	  "maxDurationMinutes": 120,
    50	  "progressiveSynthesis": true,
    51	  "specFolder": "04--agent-orchestration/028-auto-deep-research",
    52	  "createdAt": "2026-03-18T10:00:00Z",
    53	  "status": "initialized",
    54	  "executionMode": "auto",
    55	  "lineage": {
    56	    "sessionId": "dr-2026-03-18T10-00-00Z",
    57	    "parentSessionId": null,
    58	    "lineageMode": "new",
    59	    "generation": 1,
    60	    "continuedFromRun": null
    61	  }
    62	}
    63	```
    64	
    65	| Field | Type | Required | Default | Description |
    66	|-------|------|----------|---------|-------------|
    67	| topic | string | Yes | -- | Research topic or question |
    68	| maxIterations | number | No | 10 | Hard cap on loop iterations |
    69	| convergenceThreshold | number | No | 0.05 | Stop when avg newInfoRatio below this |
    70	| stuckThreshold | number | No | 3 | Consecutive no-progress iterations before recovery |
    71	| maxDurationMinutes | number | No | 120 | Hard timeout for entire loop |
    72	| progressiveSynthesis | boolean | No | true | Update research/research.md after each iteration; synthesis still performs a cleanup pass |
    73	| specFolder | string | Yes | -- | Spec folder path (relative to specs/) |
    74	| createdAt | ISO 8601 | Yes | -- | Session start timestamp |
    75	| status | string | Yes | "initialized" | initialized, running, converged, stuck, complete, error |
    76	| executionMode | string | No | "auto" | auto or confirm |
    77	| lineage.sessionId | string | Yes | -- | Stable identifier for the current lineage segment |
    78	| lineage.parentSessionId | string or null | Yes | null | Parent lineage when restarting, forking, or reopening |
    79	| lineage.lineageMode | string | Yes | "new" | `new`, `resume`, `restart`, `fork`, or `completed-continue` |
    80	| lineage.generation | number | Yes | 1 | Monotonic generation counter |
    81	| lineage.continuedFromRun | number or null | No | null | Run number where a resumed or reopened segment continues |
    82	| fileProtection | object | No | -- | Mutability declarations for state files (see below) |
    83	
    84	### File Protection Map
    85	
    86	The config file may include a `fileProtection` map declaring mutability constraints for state files:
    87	
    88	```json
    89	{
    90	  "topic": "...",

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/state_format.md | sed -n '228,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   228	| `thought` | Analytical-only iteration with reasoning or synthesis but no evidence gathering |
   229	
   230	The `insight` status prevents premature convergence when a conceptually significant iteration would otherwise trigger the stuck counter. The `thought` status marks planning or meta-reasoning iterations that should not affect convergence signals.
   231	
   232	### Event Records
   233	
   234	Events are written by the YAML workflow or diagnostics layer for lifecycle tracking. Canonical coverage includes:
   235	
   236	| Event | Emitted By | Status | Purpose | Key Fields |
   237	|-------|------------|--------|---------|------------|
   238	| resumed | workflow | active | Resume after a prior active session | sessionId, continuedFromRun, timestamp |
   239	| restarted | workflow | active | Start a new generation from prior state | sessionId, parentSessionId, generation, timestamp |
   240	| forked | workflow | active | Create a new branch from current packet state | sessionId, parentSessionId, generation, timestamp |
   241	| completed_continue | workflow | active | Reopen a completed lineage after immutable snapshotting | sessionId, parentSessionId, generation, continuedFromRun, completedAt, reopenedAt, timestamp |
   242	| paused | workflow | active | Pause sentinel detected | reason, timestamp |
   243	| migration | workflow | active | Legacy artifact consumed and canonical name written | legacyPath, canonicalPath, timestamp |
   244	| direct_mode | workflow | reference-only | Orchestrator absorbed iteration work | iteration, reason, timestamp |
   245	| state_reconstructed | recovery | active | JSONL rebuilt from iteration files | iterationsRecovered, timestamp |
   246	| wave_complete | wave coordinator | reference-only | Parallel wave finished | wave, iterations, medianRatio, timestamp |
   247	| wave_pruned | wave coordinator | reference-only | Low-value wave branch deprioritized | wave, prunedIterations, medianRatio, timestamp |
   248	| breakthrough | wave coordinator | reference-only | Wave branch exceeded 2x average | wave, iteration, ratio, timestamp |
   249	| stuck_recovery | workflow | active | Stuck recovery outcome | fromIteration, outcome, timestamp |
   250	| missing_newInfoRatio | parser | active | Missing ratio defaulted to 0.0 | iteration, timestamp |
   251	| ratio_within_noise | diagnostics | active | Latest ratio fell within MAD floor | iteration, ratio, noiseFloor, timestamp |
   252	| segment_start | workflow | reference-only | Start of a new segment | segment, reason, timestamp |
   253	| synthesis_complete | workflow | active | Final synthesis finished | totalIterations, answeredCount, totalQuestions, stopReason, timestamp |
   254	| guard_violation | guard system | active | Research guard constraint violated | guard, question, detail, timestamp |
   255	
   256	Guard violation events are emitted when a research guard detects a quality constraint breach. The `guard` field identifies which guard fired:
   257	
   258	```json
   259	{"type":"event","event":"guard_violation","guard":"source_diversity","question":"Q1","detail":"Only 1 source for Q1","timestamp":"2026-03-18T10:20:00Z"}
   260	```
   261	
   262	Supported guard values: `source_diversity`, `focus_alignment`, `single_weak_source`. These events are informational and do not halt the loop, but the orchestrator may use them to adjust subsequent iteration focus.
   263	
   264	Additional event-specific fields may appear on the JSON line, but the table above is the canonical coverage for emitted events.
   265	
   266	### Lineage Schema
   267	
   268	Every active packet must be reconstructable from these lineage keys:
   269	
   270	| Key | Meaning |
   271	|-----|---------|
   272	| `sessionId` | Stable identifier for the active lineage segment |
   273	| `parentSessionId` | Immediate parent lineage when a new segment or branch is created |
   274	| `lineageMode` | How the current segment began |
   275	| `generation` | Monotonic generation number across restarts and reopenings |
   276	| `continuedFromRun` | Last completed run reused as the continuation boundary |
   277	
   278	The workflow may read legacy filenames during migration, but lineage metadata must always be written under canonical names.
   279	
   280	### Reducer Contract

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/assets/deep_research_config.json | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	{
     2	  "topic": "",
     3	  "maxIterations": 10,
     4	  "convergenceThreshold": 0.05,
     5	  "stuckThreshold": 3,
     6	  "maxDurationMinutes": 120,
     7	  "maxToolCallsPerIteration": 12,
     8	  "maxMinutesPerIteration": 10,
     9	  "progressiveSynthesis": true,
    10	  "specFolder": "",
    11	  "createdAt": "",
    12	  "status": "initialized",
    13	  "executionMode": "auto",
    14	  "lineage": {
    15	    "sessionId": "",
    16	    "parentSessionId": null,
    17	    "lineageMode": "new",
    18	    "allowedModes": [
    19	      "new",
    20	      "resume",
    21	      "restart",
    22	      "fork",
    23	      "completed-continue"
    24	    ],
    25	    "generation": 1,
    26	    "continuedFromRun": null
    27	  },
    28	  "reducer": {
    29	    "enabled": true,
    30	    "version": "1.0",
    31	    "registryFile": "research/findings-registry.json",
    32	    "dashboardFile": "research/deep-research-dashboard.md",
    33	    "strategyFile": "research/deep-research-strategy.md",
    34	    "machineOwnedSections": [
    35	      "what-worked",
    36	      "what-failed",
    37	      "ruled-out-directions",
    38	      "next-focus"
    39	    ]
    40	  },
    41	  "capabilityMatrixPath": ".opencode/skill/sk-deep-research/assets/runtime_capabilities.json",
    42	  "capabilityMatrixDocPath": ".opencode/skill/sk-deep-research/references/capability_matrix.md",
    43	  "runtimeCapabilityResolver": ".opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs",
    44	  "reducerScriptPath": ".opencode/skill/sk-deep-research/scripts/reduce-state.cjs",
    45	  "pauseSentinelPath": "research/.deep-research-pause",
    46	  "archiveRoot": "research/archive",
    47	  "migrationWindowDays": 28,
    48	  "fileProtection": {
    49	    "deep-research-config.json": "immutable",
    50	    "deep-research-state.jsonl": "append-only",
    51	    "deep-research-strategy.md": "mutable",
    52	    "deep-research-dashboard.md": "auto-generated",
    53	    "findings-registry.json": "auto-generated",
    54	    "iteration-*.md": "write-once",
    55	    "research/research.md": "mutable"
    56	  }
    57	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/state_format.md | sed -n '468,500p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   468	<!-- ANCHOR:dashboard -->
   469	## 7. DASHBOARD (research/deep-research-dashboard.md)
   470	
   471	Auto-generated summary view of the research session. Never manually edited.
   472	
   473	Review mode writes the equivalent dashboard to `{spec_folder}/review/deep-review-dashboard.md`.
   474	
   475	### Location and Lifecycle
   476	
   477	- **Path**: `{spec_folder}/research/deep-research-dashboard.md`
   478	- **Generated from**: JSONL state log + strategy data only
   479	- **Refresh**: Regenerated after every iteration evaluation
   480	- **Protection**: `"deep-research-dashboard.md": "auto-generated"` in `fileProtection`
   481	
   482	### Content Sections
   483	
   484	| Section | Source | Description |
   485	|---------|--------|-------------|
   486	| Iteration Table | JSONL iteration records | Run, status, focus, newInfoRatio, findings count, duration |
   487	| Question Status | Strategy + registry | Each key question with answered/open status and coverage % |
   488	| Convergence Trend | JSONL convergenceSignals + reducer | Rolling average, composite stop score, trajectory |
   489	| Dead Ends | JSONL ruledOut + strategy | Accumulated ruled-out approaches with reasons |
   490	| Next Focus | Strategy file | Current recommended direction for next iteration |
   491	| Source Diversity | Registry metrics | Source count per question and `coverageBySources` summary |
   492	
   493	### Generation Rules
   494	
   495	1. Read `deep-research-state.jsonl`, `findings-registry.json`, and `deep-research-strategy.md` as canonical inputs
   496	2. Compute all derived values (coverage %, trend direction) from raw data
   497	3. Overwrite the entire file on each refresh (not append)
   498	4. If JSONL is missing or empty, write a minimal dashboard noting "No iteration data available"
   499	5. The dashboard is read-only for all agents -- modifications are discarded on next refresh
   500	

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/scripts/reduce-state.cjs | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ Deep Research State Reducer                                              ║
     3	// ╚══════════════════════════════════════════════════════════════════════════╝
     4	
     5	'use strict';
     6	
     7	// ─────────────────────────────────────────────────────────────────────────────
     8	// 1. IMPORTS
     9	// ─────────────────────────────────────────────────────────────────────────────
    10	
    11	const fs = require('node:fs');
    12	const path = require('node:path');
    13	
    14	// ─────────────────────────────────────────────────────────────────────────────
    15	// 2. HELPERS
    16	// ─────────────────────────────────────────────────────────────────────────────
    17	
    18	function readUtf8(filePath) {
    19	  return fs.readFileSync(filePath, 'utf8');
    20	}
    21	
    22	function writeUtf8(filePath, content) {
    23	  fs.mkdirSync(path.dirname(filePath), { recursive: true });
    24	  fs.writeFileSync(filePath, content, 'utf8');
    25	}
    26	
    27	function readJson(filePath) {
    28	  return JSON.parse(readUtf8(filePath));
    29	}
    30	
    31	function slugify(value) {
    32	  return value
    33	    .toLowerCase()
    34	    .replace(/[^a-z0-9]+/g, '-')
    35	    .replace(/^-+|-+$/g, '')
    36	    .slice(0, 80) || 'entry';
    37	}
    38	
    39	function normalizeText(value) {
    40	  return value.replace(/\s+/g, ' ').trim();
    41	}
    42	
    43	function escapeRegExp(value) {
    44	  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    45	}
    46	
    47	// ─────────────────────────────────────────────────────────────────────────────
    48	// 3. PARSERS
    49	// ─────────────────────────────────────────────────────────────────────────────
    50	
    51	/**
    52	 * Parse JSONL content into an array of records, skipping malformed lines.
    53	 *
    54	 * @param {string} jsonlContent - Newline-delimited JSON string
    55	 * @returns {Array<Object>} Parsed records
    56	 */
    57	function parseJsonl(jsonlContent) {
    58	  const records = [];
    59	
    60	  for (const rawLine of jsonlContent.split('\n')) {
    61	    const line = rawLine.trim();
    62	    if (!line) {
    63	      continue;
    64	    }
    65	
    66	    try {
    67	      records.push(JSON.parse(line));
    68	    } catch (_error) {
    69	      continue;
    70	    }
    71	  }
    72	
    73	  return records;
    74	}
    75	
    76	function extractSection(markdown, heading) {
    77	  // Drop the `m` flag so `$` anchors to end-of-string, not end-of-line
    78	  const pattern = new RegExp(`(?:^|\\n)##\\s+${escapeRegExp(heading)}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i');
    79	  const match = markdown.match(pattern);
    80	  return match ? match[1].trim() : '';
    81	}
    82	
    83	function extractListItems(sectionText) {
    84	  return sectionText
    85	    .split('\n')
    86	    .map((line) => line.trim())
    87	    .filter((line) => /^([-*]|\d+\.)\s+/.test(line))
    88	    .map((line) => normalizeText(line.replace(/^([-*]|\d+\.)\s+/, '')))
    89	    .filter(Boolean);
    90	}
    91	
    92	function parseReflectionValue(sectionText, label) {
    93	  const match = sectionText.match(new RegExp(`-\\s+${escapeRegExp(label)}\\s*:\\s*(.+)`, 'i'));
    94	  return match ? normalizeText(match[1]) : null;
    95	}
    96	
    97	/**
    98	 * Parse a single iteration markdown file into a structured record.
    99	 *
   100	 * @param {string} iterationPath - Absolute path to an iteration-NNN.md file
   101	 * @returns {Object} Parsed iteration with focus, findings, sources, and reflection fields
   102	 */
   103	function parseIterationFile(iterationPath) {
   104	  const markdown = readUtf8(iterationPath);
   105	  const runMatch = iterationPath.match(/iteration-(\d+)\.md$/);
   106	  const headingMatch = markdown.match(/^#\s+Iteration\s+\d+:\s+(.+)$/m);
   107	  const focusSection = extractSection(markdown, 'Focus');
   108	  const findingsSection = extractSection(markdown, 'Findings');
   109	  const ruledOutSection = extractSection(markdown, 'Ruled Out');
   110	  const deadEndsSection = extractSection(markdown, 'Dead Ends');
   111	  const sourcesSection = extractSection(markdown, 'Sources Consulted');
   112	  const reflectionSection = extractSection(markdown, 'Reflection');
   113	  const nextFocusSection = extractSection(markdown, 'Recommended Next Focus');
   114	
   115	  return {
   116	    path: iterationPath,
   117	    run: runMatch ? Number(runMatch[1]) : 0,
   118	    focus: normalizeText(focusSection || (headingMatch ? headingMatch[1] : 'Unknown focus')),
   119	    findings: extractListItems(findingsSection),
   120	    ruledOut: extractListItems(ruledOutSection),
   121	    deadEnds: extractListItems(deadEndsSection),
   122	    sources: extractListItems(sourcesSection),
   123	    reflectionWorked: parseReflectionValue(reflectionSection, 'What worked and why'),
   124	    reflectionFailed: parseReflectionValue(reflectionSection, 'What did not work and why'),
   125	    reflectionDifferent: parseReflectionValue(reflectionSection, 'What I would do differently'),
   126	    nextFocus: normalizeText(nextFocusSection),
   127	  };
   128	}
   129	
   130	function parseStrategyQuestions(strategyContent) {
   131	  const section = extractSection(strategyContent, '3. KEY QUESTIONS (remaining)');
   132	  return section
   133	    .split('\n')
   134	    .map((line) => line.trim())
   135	    .filter((line) => /^- \[[ xX]\]\s+/.test(line))
   136	    .map((line) => {
   137	      const checked = /^- \[[xX]\]\s+/.test(line);
   138	      const text = normalizeText(line.replace(/^- \[[ xX]\]\s+/, ''));
   139	      return {
   140	        checked,
   141	        text,
   142	      };
   143	    });
   144	}
   145	
   146	function buildCoverageBySources(iterationFiles, iterationRecords) {
   147	  const counter = {};
   148	  const seen = new Set();
   149	
   150	  for (const source of iterationFiles.flatMap((iteration) => iteration.sources).concat(
   151	    iterationRecords.flatMap((record) => (Array.isArray(record.sourcesQueried) ? record.sourcesQueried : [])),
   152	  )) {
   153	    const normalized = normalizeText(source);
   154	    if (!normalized || seen.has(normalized)) {
   155	      continue;
   156	    }
   157	    seen.add(normalized);
   158	
   159	    let key = 'other';
   160	    if (/^https?:\/\//i.test(normalized)) {
   161	      try {
   162	        key = new URL(normalized).hostname;
   163	      } catch (_error) {
   164	        key = 'web';
   165	      }
   166	    } else if (normalized.startsWith('memory:')) {
   167	      key = 'memory';
   168	    } else if (normalized.includes(':')) {
   169	      key = 'code';
   170	    }
   171	
   172	    counter[key] = (counter[key] || 0) + 1;
   173	  }
   174	
   175	  return Object.fromEntries(Object.entries(counter).sort(([left], [right]) => left.localeCompare(right)));
   176	}
   177	
   178	function uniqueById(items) {
   179	  const seen = new Set();
   180	  const result = [];

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/scripts/reduce-state.cjs | sed -n '220,553p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   220	    iterationFiles
   221	      .flatMap((iteration) =>
   222	        iteration.findings.map((finding, index) => ({
   223	          id: `finding-${iteration.run}-${index + 1}-${slugify(finding)}`,
   224	          text: finding,
   225	          addedAtIteration: iteration.run,
   226	          sources: iteration.sources,
   227	        })),
   228	      )
   229	      .sort((left, right) => left.addedAtIteration - right.addedAtIteration || left.text.localeCompare(right.text)),
   230	  );
   231	
   232	  const ruledOutDirections = uniqueById(
   233	    iterationFiles
   234	      .flatMap((iteration) =>
   235	        iteration.deadEnds.concat(iteration.ruledOut).map((entry, index) => ({
   236	          id: `ruled-out-${iteration.run}-${index + 1}-${slugify(entry)}`,
   237	          text: entry,
   238	          addedAtIteration: iteration.run,
   239	        })),
   240	      )
   241	      .sort((left, right) => left.addedAtIteration - right.addedAtIteration || left.text.localeCompare(right.text)),
   242	  );
   243	
   244	  const coverageBySources = buildCoverageBySources(iterationFiles, iterationRecords);
   245	  const latestIteration = iterationRecords.filter((record) => record.type === 'iteration').at(-1);
   246	  const convergenceScore =
   247	    latestIteration?.convergenceSignals?.compositeStop
   248	    ?? latestIteration?.newInfoRatio
   249	    ?? 0;
   250	
   251	  return {
   252	    openQuestions: keyedQuestions.filter((question) => !question.resolved).map((question) => ({
   253	      id: question.id,
   254	      text: question.text,
   255	      addedAtIteration: question.addedAtIteration,
   256	      resolvedAtIteration: null,
   257	    })),
   258	    resolvedQuestions: keyedQuestions.filter((question) => question.resolved).map((question) => ({
   259	      id: question.id,
   260	      text: question.text,
   261	      addedAtIteration: question.addedAtIteration,
   262	      resolvedAtIteration: question.resolvedAtIteration,
   263	    })),
   264	    keyFindings,
   265	    ruledOutDirections,
   266	    metrics: {
   267	      iterationsCompleted: iterationRecords.filter((record) => record.type === 'iteration').length,
   268	      openQuestions: keyedQuestions.filter((question) => !question.resolved).length,
   269	      resolvedQuestions: keyedQuestions.filter((question) => question.resolved).length,
   270	      keyFindings: keyFindings.length,
   271	      convergenceScore,
   272	      coverageBySources,
   273	    },
   274	  };
   275	}
   276	
   277	function blockFromBulletList(items) {
   278	  if (!items.length) {
   279	    return '[None yet]';
   280	  }
   281	
   282	  return items.map((item) => `- ${item}`).join('\n');
   283	}
   284	
   285	function buildExhaustedApproaches(iterationFiles) {
   286	  const grouped = new Map();
   287	
   288	  for (const iteration of iterationFiles) {
   289	    for (const entry of iteration.deadEnds.concat(iteration.ruledOut)) {
   290	      const key = entry;
   291	      const bucket = grouped.get(key) || [];
   292	      bucket.push(iteration.run);
   293	      grouped.set(key, bucket);
   294	    }
   295	  }
   296	
   297	  if (!grouped.size) {
   298	    return '[No exhausted approach categories yet]';
   299	  }
   300	
   301	  const blocked = Array.from(grouped.entries())
   302	    .sort(([left], [right]) => left.localeCompare(right))
   303	    .map(([entry, runs]) => {
   304	      const attemptCount = runs.length;
   305	      const lastRun = Math.max(...runs);
   306	      return [
   307	        `### ${entry} -- BLOCKED (iteration ${lastRun}, ${attemptCount} attempts)`,
   308	        `- What was tried: ${entry}`,
   309	        `- Why blocked: Repeated iteration evidence ruled this direction out.`,
   310	        `- Do NOT retry: ${entry}`,
   311	      ].join('\n');
   312	    });
   313	
   314	  return blocked.join('\n\n');
   315	}
   316	
   317	function replaceAnchorSection(content, anchorId, heading, body) {
   318	  const pattern = new RegExp(`<!-- ANCHOR:${anchorId} -->[\\s\\S]*?<!-- \\/ANCHOR:${anchorId} -->`, 'm');
   319	  const replacement = [
   320	    `<!-- ANCHOR:${anchorId} -->`,
   321	    `## ${heading}`,
   322	    body.trim() ? body.trim() : '[None yet]',
   323	    '',
   324	    `<!-- /ANCHOR:${anchorId} -->`,
   325	  ].join('\n');
   326	
   327	  if (!pattern.test(content)) {
   328	    throw new Error(`Missing anchor section ${anchorId} in strategy file`);
   329	  }
   330	
   331	  return content.replace(pattern, replacement);
   332	}
   333	
   334	function updateStrategyContent(strategyContent, registry, iterationFiles) {
   335	  const answeredTexts = registry.resolvedQuestions.map((question) => question.text);
   336	  const questionEntries = parseStrategyQuestions(strategyContent);
   337	  const answeredSet = new Set(answeredTexts.map(normalizeText));
   338	  const rewrittenQuestionLines = questionEntries.map((question) => {
   339	    const checked = answeredSet.has(normalizeText(question.text));
   340	    return `- [${checked ? 'x' : ' '}] ${question.text}`;
   341	  });
   342	
   343	  const whatWorked = iterationFiles
   344	    .filter((iteration) => iteration.reflectionWorked)
   345	    .map((iteration) => `${iteration.reflectionWorked} (iteration ${iteration.run})`);
   346	  const whatFailed = iterationFiles
   347	    .filter((iteration) => iteration.reflectionFailed)
   348	    .map((iteration) => `${iteration.reflectionFailed} (iteration ${iteration.run})`);
   349	  const nextFocus = iterationFiles.map((iteration) => iteration.nextFocus).filter(Boolean).at(-1)
   350	    || registry.openQuestions[0]?.text
   351	    || '[All tracked questions are resolved]';
   352	
   353	  let updated = strategyContent;
   354	  updated = replaceAnchorSection(updated, 'key-questions', '3. KEY QUESTIONS (remaining)', rewrittenQuestionLines.join('\n'));
   355	  updated = replaceAnchorSection(updated, 'answered-questions', '6. ANSWERED QUESTIONS', blockFromBulletList(answeredTexts));
   356	  updated = replaceAnchorSection(updated, 'what-worked', '7. WHAT WORKED', blockFromBulletList(whatWorked));
   357	  updated = replaceAnchorSection(updated, 'what-failed', '8. WHAT FAILED', blockFromBulletList(whatFailed));
   358	  updated = replaceAnchorSection(updated, 'exhausted-approaches', '9. EXHAUSTED APPROACHES (do not retry)', buildExhaustedApproaches(iterationFiles));
   359	  updated = replaceAnchorSection(
   360	    updated,
   361	    'ruled-out-directions',
   362	    '10. RULED OUT DIRECTIONS',
   363	    blockFromBulletList(registry.ruledOutDirections.map((entry) => `${entry.text} (iteration ${entry.addedAtIteration})`)),
   364	  );
   365	  updated = replaceAnchorSection(updated, 'next-focus', '11. NEXT FOCUS', nextFocus);
   366	  return updated;
   367	}
   368	
   369	function renderDashboard(config, registry, iterationRecords, iterationFiles) {
   370	  const latestIteration = iterationRecords.at(-1);
   371	  const ratios = iterationRecords
   372	    .map((record) => (typeof record.newInfoRatio === 'number' ? record.newInfoRatio : null))
   373	    .filter((value) => value !== null);
   374	  const lastThreeRatios = ratios.slice(-3).map((value) => value.toFixed(2)).join(' -> ') || 'N/A';
   375	  const nextFocus = iterationFiles.map((iteration) => iteration.nextFocus).filter(Boolean).at(-1)
   376	    || registry.openQuestions[0]?.text
   377	    || '[All tracked questions are resolved]';
   378	  const progressRows = iterationRecords
   379	    .map((record) => {
   380	      const track = record.focusTrack || '-';
   381	      const ratio = typeof record.newInfoRatio === 'number' ? record.newInfoRatio.toFixed(2) : '0.00';
   382	      return `| ${record.run} | ${record.focus || 'unknown'} | ${track} | ${ratio} | ${record.findingsCount || 0} | ${record.status || 'complete'} |`;
   383	    })
   384	    .join('\n') || '| 0 | none yet | - | 0.00 | 0 | initialized |';
   385	
   386	  return [
   387	    '---',
   388	    'title: Deep Research Dashboard',
   389	    'description: Auto-generated reducer view over the research packet.',
   390	    '---',
   391	    '',
   392	    '# Deep Research Dashboard - Session Overview',
   393	    '',
   394	    'Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.',
   395	    '',
   396	    '<!-- ANCHOR:overview -->',
   397	    '## 1. OVERVIEW',
   398	    '',
   399	    'Reducer-generated observability surface for the active research packet.',
   400	    '',
   401	    '<!-- /ANCHOR:overview -->',
   402	    '<!-- ANCHOR:status -->',
   403	    '## 2. STATUS',
   404	    `- Topic: ${config.topic || '[Unknown topic]'}`,
   405	    `- Started: ${config.createdAt || '[Unknown start]'}`,
   406	    `- Status: ${String(config.status || 'initialized').toUpperCase()}`,
   407	    `- Iteration: ${registry.metrics.iterationsCompleted} of ${config.maxIterations || 0}`,
   408	    `- Session ID: ${config.lineage?.sessionId || '[Unknown session]'}`,
   409	    `- Parent Session: ${config.lineage?.parentSessionId || 'none'}`,
   410	    `- Lifecycle Mode: ${config.lineage?.lineageMode || 'new'}`,
   411	    `- Generation: ${config.lineage?.generation ?? 1}`,
   412	    '',
   413	    '<!-- /ANCHOR:status -->',
   414	    '<!-- ANCHOR:progress -->',
   415	    '## 3. PROGRESS',
   416	    '',
   417	    '| # | Focus | Track | Ratio | Findings | Status |',
   418	    '|---|-------|-------|-------|----------|--------|',
   419	    progressRows,
   420	    '',
   421	    `- iterationsCompleted: ${registry.metrics.iterationsCompleted}`,
   422	    `- keyFindings: ${registry.metrics.keyFindings}`,
   423	    `- openQuestions: ${registry.metrics.openQuestions}`,
   424	    `- resolvedQuestions: ${registry.metrics.resolvedQuestions}`,
   425	    '',
   426	    '<!-- /ANCHOR:progress -->',
   427	    '<!-- ANCHOR:questions -->',
   428	    '## 4. QUESTIONS',
   429	    `- Answered: ${registry.metrics.resolvedQuestions}/${registry.metrics.resolvedQuestions + registry.metrics.openQuestions}`,
   430	    ...registry.resolvedQuestions.map((question) => `- [x] ${question.text}`),
   431	    ...registry.openQuestions.map((question) => `- [ ] ${question.text}`),
   432	    '',
   433	    '<!-- /ANCHOR:questions -->',
   434	    '<!-- ANCHOR:trend -->',
   435	    '## 5. TREND',
   436	    `- Last 3 ratios: ${lastThreeRatios}`,
   437	    `- Stuck count: ${latestIteration?.status === 'stuck' ? 1 : 0}`,
   438	    '- Guard violations: none recorded by the reducer pass',
   439	    `- convergenceScore: ${Number(registry.metrics.convergenceScore || 0).toFixed(2)}`,
   440	    `- coverageBySources: ${JSON.stringify(registry.metrics.coverageBySources)}`,
   441	    '',
   442	    '<!-- /ANCHOR:trend -->',
   443	    '<!-- ANCHOR:dead-ends -->',
   444	    '## 6. DEAD ENDS',
   445	    ...registry.ruledOutDirections.length
   446	      ? registry.ruledOutDirections.map((entry) => `- ${entry.text} (iteration ${entry.addedAtIteration})`)
   447	      : ['- None yet'],
   448	    '',
   449	    '<!-- /ANCHOR:dead-ends -->',
   450	    '<!-- ANCHOR:next-focus -->',
   451	    '## 7. NEXT FOCUS',
   452	    nextFocus,
   453	    '',
   454	    '<!-- /ANCHOR:next-focus -->',
   455	    '<!-- ANCHOR:active-risks -->',
   456	    '## 8. ACTIVE RISKS',
   457	    ...(latestIteration?.status === 'error'
   458	      ? ['- Latest iteration reported error status.']
   459	      : ['- None active beyond normal research uncertainty.']),
   460	    '',
   461	    '<!-- /ANCHOR:active-risks -->',
   462	    '',
   463	  ].join('\n');
   464	}
   465	
   466	/**
   467	 * Reduce JSONL state, iteration files, and strategy into synchronized registry,
   468	 * strategy, and dashboard outputs. Idempotent: repeated calls produce identical results.
   469	 *
   470	 * @param {string} specFolder - Path to the spec folder containing a research/ directory
   471	 * @param {Object} [options] - Reducer options
   472	 * @param {boolean} [options.write=true] - Write outputs to disk when true
   473	 * @returns {Object} Paths and content for registry, strategy, and dashboard
   474	 */
   475	function reduceResearchState(specFolder, options = {}) {
   476	  const write = options.write !== false;
   477	  const resolvedSpecFolder = path.resolve(specFolder);
   478	  const researchDir = path.join(resolvedSpecFolder, 'research');
   479	  const configPath = path.join(researchDir, 'deep-research-config.json');
   480	  const stateLogPath = path.join(researchDir, 'deep-research-state.jsonl');
   481	  const strategyPath = path.join(researchDir, 'deep-research-strategy.md');
   482	  const registryPath = path.join(researchDir, 'findings-registry.json');
   483	  const dashboardPath = path.join(researchDir, 'deep-research-dashboard.md');
   484	  const iterationDir = path.join(researchDir, 'iterations');
   485	
   486	  const config = readJson(configPath);
   487	  const records = parseJsonl(readUtf8(stateLogPath)).filter((record) => record.type === 'iteration');
   488	  const strategyContent = readUtf8(strategyPath);
   489	  const strategyQuestions = parseStrategyQuestions(strategyContent);
   490	  const iterationFiles = fs.existsSync(iterationDir)
   491	    ? fs.readdirSync(iterationDir)
   492	        .filter((fileName) => /^iteration-\d+\.md$/.test(fileName))
   493	        .sort()
   494	        .map((fileName) => parseIterationFile(path.join(iterationDir, fileName)))
   495	    : [];
   496	
   497	  const registry = buildRegistry(strategyQuestions, iterationFiles, records);
   498	  const strategy = updateStrategyContent(strategyContent, registry, iterationFiles);
   499	  const dashboard = renderDashboard(config, registry, records, iterationFiles);
   500	
   501	  if (write) {
   502	    writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
   503	    writeUtf8(strategyPath, strategy.endsWith('\n') ? strategy : `${strategy}\n`);
   504	    writeUtf8(dashboardPath, dashboard);
   505	  }
   506	
   507	  return {
   508	    configPath,
   509	    stateLogPath,
   510	    strategyPath,
   511	    registryPath,
   512	    dashboardPath,
   513	    registry,
   514	    strategy,
   515	    dashboard,
   516	  };
   517	}
   518	
   519	// ─────────────────────────────────────────────────────────────────────────────
   520	// 5. CLI ENTRY POINT
   521	// ─────────────────────────────────────────────────────────────────────────────
   522	
   523	if (require.main === module) {
   524	  const specFolder = process.argv[2];
   525	  if (!specFolder) {
   526	    process.stderr.write('Usage: node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder>\n');
   527	    process.exit(1);
   528	  }
   529	
   530	  const result = reduceResearchState(specFolder, { write: true });
   531	  process.stdout.write(
   532	    `${JSON.stringify(
   533	      {
   534	        registryPath: result.registryPath,
   535	        dashboardPath: result.dashboardPath,
   536	        strategyPath: result.strategyPath,
   537	        iterationsCompleted: result.registry.metrics.iterationsCompleted,
   538	      },
   539	      null,
   540	      2,
   541	    )}\n`,
   542	  );
   543	}
   544	
   545	// ─────────────────────────────────────────────────────────────────────────────
   546	// 6. EXPORTS
   547	// ─────────────────────────────────────────────────────────────────────────────
   548	
   549	module.exports = {
   550	  parseIterationFile,
   551	  parseJsonl,
   552	  reduceResearchState,
   553	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/convergence.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: Deep Review Convergence
     3	description: Stop condition algorithms, quality guards, and recovery strategies for the autonomous deep review loop.
     4	---
     5	
     6	# Deep Review Convergence
     7	
     8	Stop condition algorithms, quality guards, and stuck recovery for the deep review loop.
     9	
    10	---
    11	
    12	<!-- ANCHOR:overview -->
    13	## 1. OVERVIEW
    14	
    15	Convergence detection determines when the autonomous review loop should stop iterating. After every iteration the orchestrator evaluates three possible outcomes:
    16	
    17	| Outcome | Meaning |
    18	|---------|---------|
    19	| **CONTINUE** | More review work is expected to yield meaningful new findings. Dispatch the next iteration. |
    20	| **STOP** | The review has reached saturation. Proceed to synthesis and verdict. |
    21	| **STUCK_RECOVERY** | No progress detected for consecutive iterations. Attempt a recovery strategy before deciding. |
    22	
    23	Convergence is checked **after** each iteration completes and **before** the next iteration is dispatched. The check consumes the full JSONL state history and the current dimension coverage snapshot.
    24	
    25	Release-readiness states are derived alongside convergence:
    26	- `in-progress` while coverage is incomplete or new P0/P1 findings are still appearing
    27	- `converged` once coverage and stabilization pass without new P0/P1 findings
    28	- `release-blocking` whenever unresolved P0 findings remain active
    29	
    30	### Key Defaults
    31	
    32	| Setting | Value | Purpose |
    33	|---------|-------|---------|
    34	| `maxIterations` | 7 | Hard ceiling on loop iterations |
    35	| `convergenceThreshold` | 0.10 | General convergence sensitivity |
    36	| `rollingStopThreshold` | 0.08 | Rolling-average STOP vote threshold |
    37	| `noProgressThreshold` | 0.05 | Stuck / no-progress classification threshold |
    38	| `stuckThreshold` | 2 | Consecutive no-progress iterations before recovery |
    39	| `minStabilizationPasses` | 1 | Coverage signal requires at least one stabilization pass |
    40	| `compositeStopScore` | 0.60 | Weighted stop-score needed before guard evaluation |
    41	
    42	### Decision Priority
    43	
    44	Checks are evaluated in this order (first match wins):
    45	
    46	1. **Max iterations** -- hard cap, always checked first.
    47	2. **All dimensions covered + clean** -- all 4 dimensions covered, no active P0/P1, stabilization passed, gates passed.
    48	3. **Stuck detection** -- 2+ consecutive no-progress iterations.
    49	4. **Composite convergence** -- 3-signal weighted vote with threshold 0.60.
    50	5. **Quality guards** -- binary checks; if composite says STOP but guards fail, override to CONTINUE.
    51	6. **Default CONTINUE** -- none of the above triggered.
    52	
    53	---
    54	
    55	<!-- /ANCHOR:overview -->
    56	<!-- ANCHOR:hard-stops -->
    57	## 2. HARD STOPS
    58	
    59	Hard stops are evaluated first and override all other signals.
    60	
    61	### Max Iterations Reached
    62	
    63	```
    64	if len(iterations) >= config.maxIterations:       // default 7
    65	  return { action: "STOP", reason: "max_iterations_reached" }
    66	```
    67	
    68	The loop stops unconditionally. Synthesis runs with whatever findings exist.
    69	
    70	### All Dimensions Covered with Stabilization
    71	
    72	```
    73	if coverage.dimensionCoverage == 1.0 and activeP0 == 0 and activeP1 == 0:
    74	  if stabilizationPasses >= config.coverageAge.minStabilizationPasses:
    75	    if checkReviewQualityGates(state, config, coverage).passed:
    76	      return { action: "STOP", reason: "all_dimensions_clean" }
    77	```
    78	
    79	Triggers when all 4 dimensions (correctness, security, traceability, maintainability) are covered, no active P0/P1 remains, at least 1 stabilization pass has occurred, and all 3 quality gates pass. If gates fail, the loop continues despite full coverage.
    80	
    81	---
    82	
    83	<!-- /ANCHOR:hard-stops -->
    84	<!-- ANCHOR:stuck-detection -->
    85	## 3. STUCK DETECTION
    86	
    87	Identifies when the review loop makes no meaningful progress across consecutive iterations.
    88	
    89	```
    90	function countConsecutiveStuck_review(evidenceIterations, noProgressThreshold):
    91	  count = 0
    92	  for i in reversed(evidenceIterations):
    93	    if i.status == "thought":   continue    // invisible to stuck counter
    94	    if i.status == "insight":   break       // resets stuck counter (genuine progress)
    95	    if i.newFindingsRatio < noProgressThreshold or i.status == "stuck":
    96	      count += 1
    97	    else:
    98	      break
    99	  return count
   100	```
   101	
   102	**Threshold:** `stuckThreshold = 2` consecutive no-progress iterations (using `noProgressThreshold = 0.05`).
   103	
   104	**Status exclusions:**
   105	- `insight`: Resets stuck counter -- a conceptual breakthrough counts as progress even with a low ratio.
   106	- `thought`: Skipped entirely -- analytical iterations produce no evidence to measure.
   107	
   108	When `stuckCount >= stuckThreshold`, the orchestrator invokes the recovery protocol (Section 8) before deciding whether to continue or stop.
   109	
   110	---
   111	
   112	<!-- /ANCHOR:stuck-detection -->
   113	<!-- ANCHOR:composite-convergence -->
   114	## 4. COMPOSITE CONVERGENCE
   115	
   116	Three independent signals each cast a stop/continue vote. Stop when the weighted stop-score meets or exceeds the consensus threshold.
   117	
   118	| Signal | Weight | Min Iterations | Measures |
   119	|--------|--------|---------------|----------|
   120	| Rolling Average | 0.30 | 2 | Recent severity-weighted finding yield |
   121	| MAD Noise Floor | 0.25 | 3 | Signal vs noise in newFindingsRatio |
   122	| Dimension Coverage | 0.45 | 1 | Dimension completion + protocol coverage stability |
   123	
   124	### Signal 1: Rolling Average (weight 0.30)
   125	
   126	Averages the last 2 severity-weighted `newFindingsRatio` values from evidence-bearing iterations (excludes `thought` status). Votes STOP when the average drops below `rollingStopThreshold` (0.08).
   127	
   128	```
   129	if len(evidenceIterations) >= 2:
   130	  recent = evidenceIterations[-2:]
   131	  avgRatio = mean(i.newFindingsRatio for i in recent)
   132	  rollingStop = avgRatio < 0.08
   133	```
   134	
   135	### Signal 2: MAD Noise Floor (weight 0.25)
   136	
   137	Robust statistical test using Median Absolute Deviation. Votes STOP when the latest ratio is at or below the computed noise floor.
   138	
   139	```
   140	if len(evidenceIterations) >= 3:
   141	  allRatios = [i.newFindingsRatio for i in evidenceIterations]
   142	  med = median(allRatios)
   143	  mad = median([abs(r - med) for r in allRatios])
   144	  noiseFloor = mad * 1.4826     // normal distribution estimator
   145	  madStop = evidenceIterations[-1].newFindingsRatio <= noiseFloor
   146	```
   147	
   148	### Signal 3: Dimension Coverage (weight 0.45)
   149	
   150	Highest-weight signal. Votes STOP only when all three conditions are true: full dimension coverage (1.0), required traceability protocols covered, and at least 1 stabilization pass.
   151	
   152	```
   153	coverageStop = (
   154	  coverage.dimensionCoverage == 1.0 and
   155	  coverage.requiredProtocolsCovered and
   156	  stabilizationPasses >= 1
   157	)
   158	```
   159	
   160	### Weighted Vote
   161	
   162	```
   163	stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
   164	if stopScore >= 0.60:   // proceed to quality gate evaluation
   165	```
   166	
   167	Weights are redistributed across active signals only. If only 2 signals have enough data, their weights are normalized to sum to 1.0.
   168	
   169	### Graceful Degradation
   170	
   171	| Iterations Completed | Active Signals | Behavior |
   172	|---------------------|----------------|----------|
   173	| 1 | Coverage only (weight 1.0) | Very unlikely to stop (needs full coverage + stabilization) |
   174	| 2 | Rolling avg + coverage | Two-signal vote, reweighted |
   175	| 3+ | All three signals | Full composite, most reliable |
   176	
   177	---
   178	
   179	<!-- /ANCHOR:composite-convergence -->
   180	<!-- ANCHOR:severity-weighted-ratio -->
   181	## 5. SEVERITY-WEIGHTED RATIO
   182	
   183	The review loop uses `newFindingsRatio` instead of `newInfoRatio`. It weights findings by severity so that critical discoveries count far more than minor suggestions.
   184	
   185	### Severity Weights
   186	
   187	| Severity | Weight | Description |
   188	|----------|--------|-------------|
   189	| **P0** (Blocker) | 10.0 | Correctness failures, security vulnerabilities, spec contradictions |
   190	| **P1** (Required) | 5.0 | Degraded behavior, incomplete implementation, missing validation |
   191	| **P2** (Suggestion) | 1.0 | Style, naming, minor improvements, documentation gaps |
   192	
   193	### Computation
   194	
   195	```
   196	SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 }
   197	refinementMultiplier = 0.5
   198	
   199	weightedNew       = sum(SEVERITY_WEIGHTS[f.severity] for f in fully_new_findings)
   200	weightedRefinement = sum(SEVERITY_WEIGHTS[f.severity] * 0.5 for f in refinement_findings)
   201	weightedTotal     = sum(SEVERITY_WEIGHTS[f.severity] for f in all_findings_this_iteration)
   202	
   203	newFindingsRatio = (weightedNew + weightedRefinement) / weightedTotal
   204	```
   205	
   206	- `fully_new_findings` -- findings not present in any prior iteration (new findingId).
   207	- `refinement_findings` -- findings that refine or upgrade an existing finding (same root cause, new evidence or severity change).
   208	- `refinementMultiplier = 0.5` -- refinements count at half weight.
   209	
   210	### P0 Override Rule
   211	
   212	```
   213	if ANY new P0 found this iteration:
   214	  newFindingsRatio = max(calculated, 0.50)
   215	
   216	if total_findings == 0:
   217	  newFindingsRatio = 0.0
   218	```
   219	
   220	A new critical finding always signals significant remaining work. The 0.50 floor prevents premature convergence when critical issues are still being discovered.
   221	
   222	---
   223	
   224	<!-- /ANCHOR:severity-weighted-ratio -->
   225	<!-- ANCHOR:quality-guards -->
   226	## 6. QUALITY GUARDS
   227	
   228	Three binary gates must ALL pass before a STOP decision is finalized. If any gate fails, the STOP is overridden to CONTINUE and violations are logged to JSONL.
   229	
   230	| Gate | Rule | Fail Action |
   231	|------|------|-------------|
   232	| **Evidence** | Every active finding has concrete `file:line` evidence; no inference-only findings | Block STOP, log `guard_violation` |
   233	| **Scope** | Findings and reviewed files stay within the declared review scope | Block STOP, log `guard_violation` |
   234	| **Coverage** | All configured dimensions + required traceability protocols covered | Block STOP, log `guard_violation` |
   235	
   236	### Gate Evaluation
   237	
   238	```
   239	function checkReviewQualityGates(state, config, coverage):
   240	  violations = []

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/loop_protocol.md | sed -n '40,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    40	### Key References
    41	
    42	| Resource | Path | Purpose |
    43	|----------|------|---------|
    44	| Review contract | `assets/review_mode_contract.yaml` | Dimensions, verdicts, gates, protocols |
    45	| Auto workflow | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Unattended review loop |
    46	| Confirm workflow | `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Step-by-step review with approval gates |
    47	| Agent | `@deep-review` (LEAF) | Single iteration executor; no sub-agents, no WebFetch |
    48	| Memory save | `generate-context.js` | Context preservation script |
    49	
    50	---
    51	
    52	<!-- /ANCHOR:overview -->
    53	<!-- ANCHOR:phase-initialization -->
    54	## 2. PHASE 1: INITIALIZATION
    55	
    56	### Purpose
    57	
    58	Set up all state files for a new review session. Discover the scope, order dimensions by risk priority, establish the traceability protocol plan, and create the review state packet.
    59	
    60	### Steps
    61	
    62	1. **Classify session state before writing**:
    63	   - `fresh`: no config/state/strategy files exist
    64	   - `resume`: config + state + strategy all exist and agree
    65	   - `completed-session`: consistent prior state with `config.status == "complete"`
    66	   - `invalid-state`: partial or contradictory artifacts
    67	
    68	2. **Create spec folder** (if needed): `mkdir -p {spec_folder}/review/iterations`
    69	
    70	3. **Scope discovery**: Resolve the review target into a concrete file list using one of 5 target types:
    71	
    72	   | Target Type | CLI Value | Resolution Strategy |
    73	   |-------------|-----------|---------------------|
    74	   | **Spec Folder** | `spec-folder` | Read `spec.md`, `plan.md`, implementation files listed in `tasks.md` |
    75	   | **Skill** | `skill` | Read `SKILL.md`, `references/`, `assets/`, `scripts/`, find agent definitions and command entry points |
    76	   | **Agent** | `agent` | Find agent definitions across all runtimes, compare for consistency |
    77	   | **Track** | `track` | List all child spec folders under the track, read `spec.md` + `checklist.md` for each |
    78	   | **Files** | `files` | Expand glob patterns, validate existence, discover cross-references |
    79	
    80	   Store the resolved file list in strategy.md "Files Under Review".
    81	
    82	4. **Dimension ordering**: Order the 4 review dimensions for iteration based on risk priority:
    83	
    84	   | Priority | Dimension | Rationale |
    85	   |----------|-----------|-----------|
    86	   | 1 | Correctness | Logic errors have the highest blast radius |
    87	   | 2 | Security | Vulnerabilities require immediate attention |
    88	   | 3 | Traceability | Spec/code alignment ensures completeness |
    89	   | 4 | Maintainability | Patterns and documentation quality (lowest immediate risk) |
    90	
    91	   Default order: D1 Correctness, D2 Security, D3 Traceability, D4 Maintainability. This order is configurable but the default prioritizes highest-impact dimensions first.
    92	
    93	5. **Traceability protocol planning**: Partition the 6 cross-reference protocols into core vs overlay, and schedule only applicable overlays for the target type:
    94	
    95	   | Level | Protocol | Applies To | Gate Class | Purpose |
    96	   |-------|----------|------------|------------|---------|
    97	   | Core | `spec_code` | all targets | hard | Verify normative claims resolve to shipped behavior |
    98	   | Core | `checklist_evidence` | all targets | hard | Verify checked completion claims have evidence |
    99	   | Overlay | `skill_agent` | skill | advisory | Verify SKILL.md and runtime agents agree |
   100	   | Overlay | `agent_cross_runtime` | agent | advisory | Verify runtime agent parity |
   101	   | Overlay | `feature_catalog_code` | skill, spec-folder, track, files | advisory | Verify catalog claims match capability |
   102	   | Overlay | `playbook_capability` | skill, agent, spec-folder | advisory | Verify playbook scenarios match executable reality |
   103	
   104	   Only schedule overlay protocols that apply to the resolved target type.
   105	
   106	6. **Write config**: `{spec_folder}/review/deep-review-config.json` with `mode: "review"`, lineage metadata (`sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, `releaseReadinessState`), and review-specific fields including target, target type, dimensions, protocol plan, and release-readiness state.
   107	
   108	7. **Initialize state log**: First line of `{spec_folder}/review/deep-review-state.jsonl` with config record including `mode: "review"` and the lineage fields.
   109	
   110	8. **Initialize reducer state**: Create `{spec_folder}/review/deep-review-findings-registry.json` with empty `openFindings`, `resolvedFindings`, `repeatedFindings`, `dimensionCoverage`, `findingsBySeverity`, and `convergenceScore`.
   111	
   112	9. **Initialize strategy**: `{spec_folder}/review/deep-review-strategy.md` from review template with:
   113	   - Topic (review target description)
   114	   - Review Dimensions checklist
   115	   - Files Under Review table
   116	   - Cross-Reference Status table grouped by core vs overlay
   117	   - Known Context from `memory_context()` results (if any)
   118	   - Review Boundaries from config
   119	
   120	10. **Validate review charter**:
   121	   - Verify strategy.md contains Non-Goals and Stop Conditions sections (may be empty but must exist)
   122	   - In **confirm mode**: present the charter (target, dimensions, scope, non-goals) for user review before proceeding
   123	   - In **auto mode**: accept automatically and continue
   124	
   125	11. **Resume only if config, JSONL, strategy, and findings registry agree**; otherwise halt for repair instead of guessing.
   126	
   127	### Outputs
   128	
   129	| File | Location | Purpose |
   130	|------|----------|---------|
   131	| Config | `{spec_folder}/review/deep-review-config.json` | Review parameters (immutable after init) |
   132	| State | `{spec_folder}/review/deep-review-state.jsonl` | Iteration log (1 initial line) |
   133	| Registry | `{spec_folder}/review/deep-review-findings-registry.json` | Reducer-owned findings state |
   134	| Strategy | `{spec_folder}/review/deep-review-strategy.md` | Dimensions, findings, next focus |
   135	
   136	---
   137	
   138	<!-- /ANCHOR:phase-initialization -->
   139	<!-- ANCHOR:phase-iteration-loop -->
   140	## 3. PHASE 2: ITERATION LOOP
   141	
   142	### Loop Steps (repeated until convergence)
   143	
   144	#### Step 1: Read State
   145	
   146	- Read `deep-review-state.jsonl` -- count iterations, extract `newFindingsRatio`, `findingsSummary`, `findingsNew`, `traceabilityChecks`, and lineage data
   147	- Read `deep-review-findings-registry.json` -- extract `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, and `convergenceScore`
   148	- Read `{spec_folder}/review/deep-review-strategy.md` -- get next focus dimension/files, remaining dimensions, and protocol gaps
   149	
   150	Reducer contract for every loop refresh:
   151	
   152	| Reducer Part | Canonical Value | Notes |
   153	|--------------|-----------------|-------|
   154	| Inputs | `latestJSONLDelta`, `newIterationFile`, `priorReducedState` | The reducer replays only the newest JSONL delta plus the latest iteration artifact against the prior reduced state. |
   155	| Outputs | `findingsRegistry`, `dashboardMetrics`, `strategyUpdates` | The same refresh pass updates the canonical registry, refreshes dashboard metrics, and applies strategy updates. |
   156	| Metrics | `dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore` | These metrics drive convergence decisions, dashboard summaries, and synthesis readiness. |
   157	
   158	#### Step 2: Check Convergence
   159	
   160	Run `shouldContinue_review()` (see `../sk-deep-research/references/convergence.md` Section 10.3):
   161	
   162	- Max iterations reached? `STOP`
   163	- Stuck count `>= 2` using `noProgressThreshold = 0.05`? `STUCK_RECOVERY`
   164	- Composite convergence votes `STOP` only after:
   165	  - Rolling average uses `rollingStopThreshold = 0.08`
   166	  - Dimension coverage reaches 100% across the 4-dimension model
   167	  - Coverage has aged through `minStabilizationPasses >= 1`
   168	  - Required traceability protocols are covered
   169	  - Evidence, scope, and coverage gates pass
   170	- Otherwise: `CONTINUE`

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/loop_protocol.md | sed -n '170,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   170	- Otherwise: `CONTINUE`
   171	
   172	Convergence signals and weights:
   173	
   174	| Signal | Weight | Description |
   175	|--------|--------|-------------|
   176	| Rolling Average | 0.30 | Last 2 severity-weighted `newFindingsRatio` values average below `rollingStopThreshold` |
   177	| MAD Noise Floor | 0.25 | Latest ratio within noise floor derived from historical ratios |
   178	| Dimension Coverage | 0.45 | All 4 dimensions plus required traceability protocols covered, with stabilization |
   179	
   180	**P0 override**: Any new P0 finding sets `newFindingsRatio >= 0.50`, blocking convergence regardless of composite score.
   181	
   182	#### Step 2a: Check Pause Sentinel
   183	
   184	Before dispatching, check for a pause sentinel file:
   185	
   186	1. Check if `review/.deep-review-pause` exists (note: the file name uses the shared `-pause` suffix)
   187	2. If present:
   188	   - Log event to JSONL: `{"type":"event","event":"paused","reason":"sentinel file detected"}`
   189	   - Halt the loop with message:
   190	     ```
   191	     Review paused. Delete review/.deep-review-pause to resume.
   192	     Current state: Iteration {N}, {reviewed}/{total} dimensions complete, {P0}/{P1}/{P2} findings.
   193	     ```
   194	   - Do NOT exit to synthesis -- the loop is suspended, not stopped
   195	3. On resume (file deleted and loop restarted):
   196	   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
   197	   - Continue from step_read_state
   198	
   199	**Use case**: In autonomous mode, this provides the only graceful intervention mechanism short of killing the process. Users can create the sentinel file at any time to pause review between iterations.
   200	
   201	#### Step 2b: Generate State Summary
   202	
   203	Generate a compact state summary (~200 tokens) for injection into the dispatch prompt:
   204	
   205	```
   206	STATE SUMMARY (auto-generated, review mode):
   207	Iteration: {N} of {max} | Mode: review
   208	Target: {config.reviewTarget} ({config.reviewTargetType})
   209	Dimensions: {reviewed}/{total} complete | Next: {nextDimension}
   210	Findings: P0:{count} P1:{count} P2:{count} active
   211	Traceability: core={core_status} overlay={overlay_status}
   212	Last 2 ratios: {ratio_N-1} -> {ratio_N} | Stuck count: {stuck_count}
   213	Provisional verdict: {PASS|CONDITIONAL|FAIL|PENDING} | hasAdvisories={hasAdvisories}
   214	Next focus: {strategy.nextFocus}
   215	```
   216	
   217	This summary is prepended to the dispatch context (Step 3) to ensure the agent has baseline context even if detailed strategy.md reading fails or is incomplete.
   218	
   219	#### Step 3: Dispatch Agent
   220	
   221	Dispatch `@deep-review` with review-specific context:
   222	
   223	```
   224	{state_summary}  // Auto-generated (Step 2b)
   225	
   226	Review Target: {config.reviewTarget}
   227	Review Mode: {config.reviewTargetType}
   228	Iteration: {N} of {maxIterations}
   229	Focus Dimension: {strategy.nextFocus.dimension}
   230	Focus Files: {strategy.nextFocus.files}
   231	Remaining Dimensions: {strategy.remainingDimensions}
   232	Traceability Protocols:
   233	  - Core: {core_protocols}
   234	  - Overlay: {overlay_protocols}
   235	Active Findings: {findingsSummary}
   236	State Files:
   237	  - Config: {spec_folder}/review/deep-review-config.json
   238	  - State: {spec_folder}/review/deep-review-state.jsonl
   239	  - Registry: {spec_folder}/review/deep-review-findings-registry.json
   240	  - Strategy: {spec_folder}/review/deep-review-strategy.md
   241	Output: Write findings to {spec_folder}/review/iterations/iteration-{NNN}.md
   242	CONSTRAINT: LEAF agent -- do NOT dispatch sub-agents
   243	CONSTRAINT: Target files are READ-ONLY -- never modify code under review
   244	```
   245	
   246	**Agent constraints**:
   247	- `@deep-review` is LEAF-only: it cannot dispatch sub-agents
   248	- No WebFetch: review is code-only and read-only
   249	- Target 8-11 tool calls per iteration (max 12); breadth over depth per cycle
   250	- Tools available: Read, Grep, Glob, Edit (state files only), mcp__cocoindex_code__search
   251	
   252	#### Step 3a: Cross-Reference Protocol Execution
   253	
   254	During iterations focused on the Traceability dimension, the agent executes applicable cross-reference protocols. Each protocol produces a structured result appended to the JSONL `traceabilityChecks.results[]` array.
   255	
   256	| Protocol | Execution | Expected Output |
   257	|----------|-----------|-----------------|
   258	| `spec_code` | Compare normative claims in spec.md against shipped implementation | Pass/partial/fail per claim with file:line evidence |
   259	| `checklist_evidence` | Verify every `[x]` mark in checklist.md has supporting evidence | Pass/partial/fail per checked item |
   260	| `skill_agent` | Compare SKILL.md contracts against runtime agent definitions | Agreement/drift/disagreement per capability |
   261	| `agent_cross_runtime` | Compare agent definitions across runtimes (.opencode, .claude, .codex, .gemini) | Parity/drift/divergence per runtime pair |
   262	| `feature_catalog_code` | Compare catalog claims against discoverable implementation | Match/stale/missing per feature |
   263	| `playbook_capability` | Validate playbook scenarios against executable reality | Executable/needs-update/impossible per scenario |
   264	
   265	Each protocol result includes:
   266	- `protocolId`: Protocol identifier
   267	- `status`: `pass`, `partial`, or `fail`
   268	- `gateClass`: `hard` or `advisory`
   269	- `applicable`: Whether the protocol applies to this target type
   270	- `counts`: `{ pass, partial, fail, skipped }`
   271	- `evidence`: Array of file:line citations
   272	- `findingRefs`: Array of finding IDs generated from this protocol
   273	- `summary`: Human-readable summary text
   274	
   275	#### Step 4: Evaluate Results
   276	
   277	After agent completes:
   278	
   279	1. Verify `{spec_folder}/review/iterations/iteration-{NNN}.md` was created
   280	2. Verify JSONL was appended with review iteration fields:
   281	   - `dimensions` (array of dimensions covered)
   282	   - `filesReviewed` (array of file paths)
   283	   - `findingsSummary` (cumulative P0/P1/P2 counts)
   284	   - `findingsNew` (this iteration's new findings)
   285	   - `traceabilityChecks` (protocol results if applicable)
   286	3. Verify strategy.md was updated (dimension progress, findings count, protocol status)
   287	4. Extract `newFindingsRatio` from JSONL record
   288	5. Update stuck tracking using `noProgressThreshold = 0.05`:
   289	   - Skip if `status == "thought"` (no change)
   290	   - Reset to 0 if `status == "insight"` (breakthrough counts as progress)
   291	   - Increment if `newFindingsRatio < noProgressThreshold`
   292	   - Reset otherwise
   293	
   294	#### Step 4a: Claim Adjudication
   295	
   296	Before the next convergence pass, the orchestrator adjudicates every new P0/P1 finding. This step prevents false positives from inflating severity and distorting convergence.
   297	
   298	Each new P0/P1 must record:
   299	
   300	| Field | Description |
   301	|-------|-------------|
   302	| `claim` | The specific assertion made by the finding |
   303	| `evidenceRefs` | File:line citations supporting the claim |
   304	| `counterevidenceSought` | Where the orchestrator looked for contradicting evidence |
   305	| `alternativeExplanation` | An alternative explanation, even if rejected |
   306	| `finalSeverity` | Confirmed or downgraded severity after adjudication |
   307	| `confidence` | Orchestrator confidence in the adjudicated severity |
   308	| `downgradeTrigger` | What would cause a future downgrade (if applicable) |
   309	
   310	**Protocol**:
   311	
   312	1. Re-read the cited evidence at the referenced file:line locations
   313	2. Seek counterevidence in adjacent code, docs, or prior iteration history
   314	3. Record an alternative explanation even if it is rejected
   315	4. Confirm or downgrade severity before the finding becomes convergence-visible
   316	
   317	This adjudication step happens after iteration evaluation and before the next convergence math run. Findings that are downgraded have their `finalSeverity` updated; the original severity is preserved in the iteration file for audit trail.
   318	
   319	#### Step 4b: Generate Dashboard
   320	

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/loop_protocol.md | sed -n '320,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   320	
   321	Generate `{spec_folder}/review/deep-review-dashboard.md` with review-specific sections:
   322	
   323	| Section | Content |
   324	|---------|---------|
   325	| Status | Provisional verdict (`PASS`/`CONDITIONAL`/`FAIL`/`PENDING`) and `hasAdvisories` flag |
   326	| Findings Summary | P0/P1/P2 counts with deltas from previous iteration |
   327	| Progress Table | Iteration number, focus dimension, `newFindingsRatio`, findings count, status |
   328	| Coverage | Files reviewed, dimensions completed, traceability protocol status |
   329	| Trend | Last 3 `newFindingsRatio` values with direction indicator (ascending/descending/flat) |
   330	| Active Risks | Guard violations, stuck count, budget warnings |
   331	
   332	Dashboard behavior:
   333	- Auto-generated only -- never manually edited
   334	- Overwritten each iteration (not appended)
   335	- Non-blocking: if generation fails, log a warning and continue the loop
   336	- In **confirm mode**: displayed to the user at each iteration approval gate
   337	- In **auto mode**: written silently for post-hoc review
   338	
   339	#### Step 5: Loop Decision
   340	
   341	- If convergence check returns STOP: exit to synthesis
   342	- If STUCK_RECOVERY: apply review-specific recovery strategies (see Section 3a), reset stuck count, continue
   343	- Otherwise: increment iteration counter, go to Step 1
   344	
   345	### Stuck Recovery (Review-Specific)
   346	
   347	**Threshold:** 2 consecutive no-progress iterations (`noProgressThreshold = 0.05`).
   348	
   349	| Failure Mode | Detection | Recovery Strategy |
   350	|-------------|-----------|-------------------|
   351	| Same dimension stuck | Last 2 iterations reviewed the same dimension with ratios `< 0.05` | **Change granularity**: if reviewing at file level, zoom into functions; if reviewing functions, zoom out to module level |
   352	| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay**: re-run the unresolved traceability protocol directly against the conflicting artifacts |
   353	| Low-value advisory churn | Last 2 iterations found only P2 work | **Escalate severity review**: explicitly search for P0/P1 patterns or downgrade unsupported severity claims |
   354	
   355	**Selection logic**:
   356	
   357	```
   358	function selectReviewRecoveryStrategy(stuckIterations, state, config):
   359	  lastFocuses = [i.focus for i in stuckIterations[-2:]]
   360	
   361	  // Same dimension stuck? Change granularity
   362	  if len(set(lastFocuses)) <= 1:
   363	    return { strategy: "change_granularity", dimension: lastFocuses[0] }
   364	
   365	  // Required protocol plateau?
   366	  if hasRequiredProtocolPlateau(state.traceabilityChecks):
   367	    return { strategy: "protocol_first_replay" }
   368	
   369	  // Default: escalate severity
   370	  return { strategy: "escalate_severity_review" }
   371	```
   372	
   373	**Recovery evaluation**:
   374	- If recovery iteration finds any new P0/P1 or materially advances required traceability coverage: recovery successful. Reset stuck count. Continue.
   375	- If recovery iteration finds only P2 or nothing: recovery failed. If all dimensions are already covered, exit to synthesis. Otherwise, move to the next unreviewed dimension.
   376	
   377	---
   378	
   379	<!-- /ANCHOR:phase-iteration-loop -->
   380	<!-- ANCHOR:phase-synthesis -->
   381	## 4. PHASE 3: SYNTHESIS
   382	
   383	### Purpose
   384	
   385	Compile all iteration findings into the final `{spec_folder}/review/review-report.md`. The synthesis phase owns the canonical review report output.
   386	
   387	### Steps
   388	
   389	#### Step 1: Finding Registry Deduplication
   390	
   391	Consolidate findings across all iterations:
   392	
   393	1. Read all iteration files: `{spec_folder}/review/iterations/iteration-*.md`
   394	2. Group findings by file + line range + root cause
   395	3. Merge duplicates, keeping the highest severity and all evidence
   396	4. Assign final finding IDs: `F001`, `F002`, ...
   397	5. Preserve the audit trail: note which iterations contributed to each merged finding
   398	
   399	#### Step 2: Severity Reconciliation
   400	
   401	Use adjudicated `finalSeverity` for any P0/P1 that was downgraded during claim adjudication (Step 4a of the iteration loop). The original severity from the iteration file is preserved in the audit appendix.
   402	
   403	#### Step 3: Replay Validation
   404	
   405	Recompute the convergence outcome from JSONL state before finalizing the report:
   406	
   407	1. Read `deep-review-state.jsonl` and select review-mode iteration records in run order
   408	2. Recompute `newFindingsRatio`, rolling-average votes, MAD votes, and coverage votes from stored JSONL fields only
   409	3. Recompute `traceabilityChecks.summary` and confirm required protocol statuses match the recorded coverage vote
   410	4. Re-run the evidence, scope, and coverage gates against stored findings and scope data
   411	5. Compare the replayed decision and stop reason to the recorded synthesis event
   412	
   413	Replay passes only when the recomputed decision, thresholds, and gate outcomes agree with the persisted result. If replay fails, log a warning in the audit appendix but proceed with synthesis.
   414	
   415	#### Step 4: Compile review-report.md
   416	
   417	Generate the 9-section review report (defined in `review_mode_contract.yaml` under `outputs.reviewReport`):
   418	
   419	| # | Section | Purpose |
   420	|---|---------|---------|
   421	| 1 | Executive Summary | Verdict, active P0/P1/P2 counts, scope, `hasAdvisories` metadata |
   422	| 2 | Planning Trigger | Why the verdict routes to planning or changelog follow-up |
   423	| 3 | Active Finding Registry | Deduplicated active findings with evidence and final severity |
   424	| 4 | Remediation Workstreams | Grouped action lanes derived from active findings |
   425	| 5 | Spec Seed | Minimal spec delta derived from review results |
   426	| 6 | Plan Seed | Action-ready plan starter for remediation |
   427	| 7 | Traceability Status | Core vs overlay protocol status and unresolved gaps |
   428	| 8 | Deferred Items | P2 advisories, blocked checks, and follow-up items |
   429	| 9 | Audit Appendix | Coverage, replay validation, convergence evidence |
   430	
   431	#### Step 5: Verdict Determination
   432	
   433	Apply the verdict contract from `review_mode_contract.yaml`:
   434	
   435	| Verdict | Condition | Next Command |
   436	|---------|-----------|--------------|
   437	| **FAIL** | Active P0 remains OR any required binary gate fails | `/spec_kit:plan` for remediation |
   438	| **CONDITIONAL** | No active P0, but active P1 remains | `/spec_kit:plan` for fixes |
   439	| **PASS** | No active P0/P1 | `/create:changelog` |
   440	
   441	When `PASS` verdict is issued and active P2 findings remain, set `hasAdvisories = true` in the report metadata.
   442	
   443	#### Step 6: Finalize State
   444	
   445	1. Update config status: Set `status: "complete"` in `deep-review-config.json`
   446	2. Write final JSONL entry:
   447	   ```json
   448	   {
   449	     "type": "event",
   450	     "event": "synthesis_complete",
   451	     "mode": "review",
   452	     "totalIterations": N,
   453	     "verdict": "PASS|CONDITIONAL|FAIL",
   454	     "activeP0": N,
   455	     "activeP1": N,
   456	     "activeP2": N,
   457	     "dimensionCoverage": X,
   458	     "stopReason": "...",
   459	     "timestamp": "..."
   460	   }
   461	   ```
   462	
   463	---
   464	
   465	<!-- /ANCHOR:phase-synthesis -->
   466	<!-- ANCHOR:phase-save -->
   467	## 5. PHASE 4: SAVE
   468	
   469	### Purpose
   470	
   471	Preserve review context to the memory system for future session recovery and cross-session continuity.
   472	
   473	### Steps
   474	
   475	1. **Generate context**: Run the memory save script with the spec folder:
   476	   ```bash
   477	   node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js {spec_folder}
   478	   ```
   479	
   480	2. **No extra indexing step in the live contract**: `generate-context.js` is the supported save boundary for this workflow.
   481	
   482	3. **Verify**: Confirm `memory/*.md` file was created with proper anchors.
   483	
   484	### On Save Failure
   485	
   486	If memory save fails:
   487	- Preserve the current `review/` packet as backup (the disk state is the ground truth)
   488	- Log the error
   489	- The review results remain intact in `{spec_folder}/review/review-report.md` regardless of memory save status
   490	
   491	---
   492	
   493	<!-- /ANCHOR:phase-save -->
   494	<!-- ANCHOR:auto-resume-protocol -->
   495	## 6. AUTO-RESUME PROTOCOL
   496	
   497	### Purpose
   498	
   499	Enable review sessions to resume seamlessly from prior state when interrupted by context compaction, process termination, or intentional pause.
   500	
   501	### Resume Detection
   502	
   503	If state files already exist from a prior session:
   504	
   505	1. **Verify agreement**: Confirm config, JSONL, findings registry, and strategy all exist and agree on target/spec folder
   506	2. **Count progress**: Read JSONL, count iteration records, determine last completed iteration
   507	3. **Read strategy**: Load current dimension progress, findings, and next focus from `deep-review-strategy.md`
   508	4. **Set counter**: Set iteration counter to last completed + 1
   509	5. **Log resume**: Append resume event to JSONL with lineage metadata:
   510	   ```json
   511	   {"type":"event","event":"resumed","lineageMode":"resume","sessionId":"rvw-...","generation":1,"fromIteration":N}
   512	   ```
   513	6. **Continue**: Enter the iteration loop from step_read_state
   514	
   515	### Lifecycle Branches
   516	
   517	| Mode | Contract |
   518	|------|----------|
   519	| `resume` | Continue the same `sessionId` and generation. |
   520	| `restart` | Archive current review state, start a new `sessionId`, increment generation, and set `parentSessionId`. |

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml | sed -n '100,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/assets/review_mode_contract.yaml | sed -n '220,490p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   100	      label: Evidence
   101	      binary: true
   102	      combines:
   103	        - evidence-completeness
   104	        - no-inference-only
   105	      rule: Every active finding must be backed by concrete file:line evidence and may not rely only on inference.
   106	    - id: scope
   107	      label: Scope
   108	      binary: true
   109	      combines:
   110	        - scope-alignment
   111	      rule: Reviewed files, targets, and conclusions must stay inside the declared review scope.
   112	    - id: coverage
   113	      label: Coverage
   114	      binary: true
   115	      combines:
   116	        - severity-coverage
   117	        - cross-reference
   118	      rule: Required dimensions and required traceability protocols must be covered before STOP is allowed.
   119	
   120	  # Review-specific convergence settings calibrated from the v2 research.
   121	  convergence:
   122	    defaults:
   123	      maxIterations: 7
   124	      convergenceThreshold: 0.10
   125	      stuckThreshold: 2
   126	    signals:
   127	      - id: rolling-average
   128	        weight: 0.30
   129	        description: Rolling average of severity-weighted new findings across recent evidence-bearing iterations.
   130	      - id: mad-noise-floor
   131	        weight: 0.25
   132	        description: Robust noise-floor test comparing the latest severity-weighted ratio against MAD-derived churn.
   133	      - id: dimension-coverage
   134	        weight: 0.45
   135	        description: Coverage vote based on required dimension completion plus required protocol coverage stability.
   136	    severityMath:
   137	      refinementMultiplier: 0.5
   138	      p0OverrideMinRatio: 0.50
   139	      noFindingsRatio: 0.0
   140	    coverageAge:
   141	      minStabilizationPasses: 1
   142	    thresholds:
   143	      rollingStopThreshold: 0.08
   144	      noProgressThreshold: 0.05
   145	      compositeStopScore: 0.60
   146	
   147	  lifecycleModes:
   148	    - id: new
   149	      description: Create a brand-new review lineage with generation 1 and no parent session.
   150	    - id: resume
   151	      description: Continue the current review lineage without changing generation.
   152	    - id: restart
   153	      description: Start a new generation for the same target and archive the prior review packet state.
   154	    - id: fork
   155	      description: Start a new review branch with parent linkage and full ancestry preserved.
   156	    - id: completed-continue
   157	      description: Snapshot the completed report, reopen the lineage, and continue with amendment-only deltas.
   158	
   159	  lineageFields:
   160	    - sessionId
   161	    - parentSessionId
   162	    - lineageMode
   163	    - generation
   164	    - continuedFromRun
   165	
   166	  reducer:
   167	    enabled: true
   168	    inputs:
   169	      - latestJSONLDelta
   170	      - newIterationFile
   171	      - priorReducedState
   172	    outputs:
   173	      - findingsRegistry
   174	      - dashboardMetrics
   175	      - strategyUpdates
   176	    failureModes:
   177	      malformedDelta: skip-and-warn
   178	      missingIterationFile: no-op-with-error
   179	      schemaMismatch: reject-with-conflict-event
   180	    idempotent: true
   181	
   182	  releaseReadinessStates:
   183	    - id: in-progress
   184	      description: Review is ongoing or coverage is incomplete.
   185	    - id: converged
   186	      description: All dimensions are covered and no new P0/P1 findings appeared in the latest stabilization pass.
   187	    - id: release-blocking
   188	      description: At least one unresolved P0 finding is present.
   189	
   190	  # Cross-reference protocols are typed traceability checks. Core protocols are
   191	  # hard gates; overlay protocols apply only to matching target types.
   192	  crossReferenceProtocols:
   193	    - id: spec_code
   194	      dimension: traceability
   195	      level: core
   196	      appliesTo: [spec-folder, skill, agent, track, files]
   197	      gateClass: hard
   198	      passCriteria: All normative claims resolve to shipped behavior or explicitly documented non-applicability with evidence.
   199	      partialCriteria: Some claims resolve, but one or more claims remain ambiguous or blocked by missing evidence.
   200	      failCriteria: A normative claim contradicts shipped behavior, references missing implementation, or cannot be reconciled.
   201	    - id: checklist_evidence
   202	      dimension: traceability
   203	      level: core
   204	      appliesTo: [spec-folder, skill, agent, track, files]
   205	      gateClass: hard
   206	      passCriteria: Every checked checklist-style claim has supporting evidence and no unsupported completion marks remain.
   207	      partialCriteria: Evidence exists for part of the checked set, but some checked items remain unproven or weakly linked.
   208	      failCriteria: Checked items are unsupported, contradicted by evidence, or materially overstate completion.
   209	    - id: skill_agent
   210	      dimension: traceability
   211	      level: overlay
   212	      appliesTo: [skill]
   213	      gateClass: advisory
   214	      passCriteria: SKILL.md contracts, routing guidance, and referenced runtime agents agree on capabilities and boundaries.
   215	      partialCriteria: Shared intent is consistent, but one or more runtime contracts drift in wording, tools, or expectations.
   216	      failCriteria: SKILL.md and runtime agents materially disagree on capability, routing, permissions, or operating contract.
   217	    - id: agent_cross_runtime
   218	      dimension: traceability
   219	      level: overlay
   220	      appliesTo: [agent]

 succeeded in 0ms:
   220	      appliesTo: [agent]
   221	      gateClass: advisory
   222	      passCriteria: Runtime-specific agent definitions express equivalent behavior, constraints, and evidence requirements.
   223	      partialCriteria: Runtime definitions are broadly aligned but contain non-blocking drift in examples, labels, or metadata.
   224	      failCriteria: Runtime definitions materially diverge in contract, permissions, workflow, or severity/evidence rules.
   225	    - id: feature_catalog_code
   226	      dimension: traceability
   227	      level: overlay
   228	      appliesTo: [skill, spec-folder, track, files]
   229	      gateClass: advisory
   230	      passCriteria: Feature catalog claims match current capability, entry points, and discoverable implementation surfaces.
   231	      partialCriteria: Catalog coverage is incomplete or stale, but no confirmed contradiction to shipped behavior is present.
   232	      failCriteria: Catalog claims are materially false, missing required features, or point to absent implementation.
   233	    - id: playbook_capability
   234	      dimension: traceability
   235	      level: overlay
   236	      appliesTo: [skill, agent, spec-folder]
   237	      gateClass: advisory
   238	      passCriteria: Playbook scenario preconditions, steps, and expected signals are executable against current capability.
   239	      partialCriteria: Scenarios mostly match reality, but one or more steps need updates, clarifications, or narrower scoping.
   240	      failCriteria: Playbook scenarios assume capabilities that do not exist or cannot be executed as documented.
   241	
   242	  # Output contracts consumed by synthesis and replay tooling.
   243	  outputs:
   244	    config:
   245	      pathPattern: "{spec_folder}/review/deep-review-config.json"
   246	      machineOwned: false
   247	      fields:
   248	        - sessionId
   249	        - parentSessionId
   250	        - lineageMode
   251	        - generation
   252	        - continuedFromRun
   253	        - releaseReadinessState
   254	    findingsRegistry:
   255	      pathPattern: "{spec_folder}/review/deep-review-findings-registry.json"
   256	      machineOwned: true
   257	      sections:
   258	        - openFindings
   259	        - resolvedFindings
   260	        - repeatedFindings
   261	        - dimensionCoverage
   262	        - findingsBySeverity
   263	        - convergenceScore
   264	    reviewReport:
   265	      pathPattern: "{spec_folder}/review/review-report.md"
   266	      sections:
   267	        - executive-summary
   268	        - planning-trigger
   269	        - active-finding-registry
   270	        - remediation-workstreams
   271	        - spec-seed
   272	        - plan-seed
   273	        - traceability-status
   274	        - deferred-items
   275	        - audit-appendix
   276	    strategy:
   277	      pathPattern: "{spec_folder}/review/deep-review-strategy.md"
   278	      requiredSections:
   279	        - topic
   280	        - review-dimensions
   281	        - completed-dimensions
   282	        - running-findings
   283	        - what-worked
   284	        - what-failed
   285	        - exhausted-approaches
   286	        - ruled-out-directions
   287	        - next-focus
   288	        - known-context
   289	        - cross-reference-status
   290	        - files-under-review
   291	        - review-boundaries
   292	    dashboard:
   293	      pathPattern: "{spec_folder}/review/deep-review-dashboard.md"
   294	      machineOwned: true
   295	      sections:
   296	        - status
   297	        - findings-summary
   298	        - dimension-coverage
   299	        - progress
   300	        - next-focus
   301	    pauseSentinel:
   302	      pathPattern: "{spec_folder}/review/.deep-review-pause"
   303	      machineOwned: false
   304	      description: Operator-controlled sentinel checked between iterations to pause the loop without discarding state.
   305	    jsonl:
   306	      pathPattern: "{spec_folder}/review/deep-review-state.jsonl"
   307	      iterationRecord:
   308	        required:
   309	          - type
   310	          - mode
   311	          - run
   312	          - status
   313	          - focus
   314	          - dimensions
   315	          - filesReviewed
   316	          - findingsCount
   317	          - findingsSummary
   318	          - findingsNew
   319	          - newFindingsRatio
   320	          - sessionId
   321	          - generation
   322	          - lineageMode
   323	          - timestamp
   324	          - durationMs
   325	        optional:
   326	          - parentSessionId
   327	          - continuedFromRun
   328	          - findingsRefined
   329	          - findingRefs
   330	          - traceabilityChecks
   331	          - coverage
   332	          - noveltyJustification
   333	          - ruledOut
   334	          - focusTrack
   335	          - scoreEstimate
   336	          - segment
   337	          - convergenceSignals
   338	      synthesisEvent:
   339	        required:
   340	          - type
   341	          - event
   342	          - mode
   343	          - totalIterations
   344	          - verdict
   345	          - activeP0
   346	          - activeP1
   347	          - activeP2
   348	          - dimensionCoverage
   349	          - stopReason
   350	          - timestamp
   351	
   352	# Render targets define where generated or mixed-authored contract fragments land.
   353	render:
   354	  artifacts:
   355	    - id: workflow-auto
   356	      path: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml
   357	      ownership: mixed
   358	      format: yaml
   359	      markers:
   360	        begin: "<!-- BEGIN GENERATED: review-mode-contract/workflow-auto -->"
   361	        end: "<!-- END GENERATED: review-mode-contract/workflow-auto -->"
   362	      sections:
   363	        - target-types
   364	        - dimensions
   365	        - verdicts
   366	        - quality-gates
   367	        - convergence
   368	        - cross-reference-protocols
   369	    - id: workflow-confirm
   370	      path: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
   371	      ownership: mixed
   372	      format: yaml
   373	      markers:
   374	        begin: "<!-- BEGIN GENERATED: review-mode-contract/workflow-confirm -->"
   375	        end: "<!-- END GENERATED: review-mode-contract/workflow-confirm -->"
   376	      sections:
   377	        - target-types
   378	        - dimensions
   379	        - verdicts
   380	        - quality-gates
   381	        - convergence
   382	        - cross-reference-protocols
   383	    - id: agent-opencode
   384	      path: .opencode/agent/deep-review.md
   385	      ownership: mixed
   386	      format: markdown
   387	      markers:
   388	        begin: "<!-- BEGIN GENERATED: review-mode-contract/agent-opencode -->"
   389	        end: "<!-- END GENERATED: review-mode-contract/agent-opencode -->"
   390	      sections:
   391	        - dimensions
   392	        - severities
   393	        - quality-gates
   394	        - cross-reference-protocols
   395	        - outputs
   396	    - id: agent-claude
   397	      path: .claude/agents/deep-review.md
   398	      ownership: mixed
   399	      format: markdown
   400	      markers:
   401	        begin: "<!-- BEGIN GENERATED: review-mode-contract/agent-claude -->"
   402	        end: "<!-- END GENERATED: review-mode-contract/agent-claude -->"
   403	      sections:
   404	        - dimensions
   405	        - severities
   406	        - quality-gates
   407	        - cross-reference-protocols
   408	        - outputs
   409	    - id: agent-codex
   410	      path: .codex/agents/deep-review.toml
   411	      ownership: mixed
   412	      format: toml
   413	      markers:
   414	        begin: "# BEGIN GENERATED: review-mode-contract/agent-codex"
   415	        end: "# END GENERATED: review-mode-contract/agent-codex"
   416	      sections:
   417	        - dimensions
   418	        - severities
   419	        - quality-gates
   420	        - cross-reference-protocols
   421	        - outputs
   422	    - id: agent-gemini
   423	      path: .gemini/agents/deep-review.md
   424	      ownership: mixed
   425	      format: markdown
   426	      markers:
   427	        begin: "<!-- BEGIN GENERATED: review-mode-contract/agent-gemini -->"
   428	        end: "<!-- END GENERATED: review-mode-contract/agent-gemini -->"
   429	      sections:
   430	        - dimensions
   431	        - severities
   432	        - quality-gates
   433	        - cross-reference-protocols
   434	        - outputs
   435	    - id: quick-reference-review-mode
   436	      path: .opencode/skill/sk-deep-review/references/quick_reference.md
   437	      ownership: mixed
   438	      format: markdown
   439	      markers:
   440	        begin: "<!-- BEGIN GENERATED: review-mode-contract/quick-reference-review-mode -->"
   441	        end: "<!-- END GENERATED: review-mode-contract/quick-reference-review-mode -->"
   442	      sections:
   443	        - target-types
   444	        - dimensions
   445	        - verdicts
   446	        - quality-gates
   447	        - outputs
   448	    - id: review-contract-snapshot
   449	      path: .opencode/skill/sk-deep-review/assets/review_mode_contract_snapshot.md
   450	      ownership: generated
   451	      format: markdown
   452	      markers:
   453	        begin: "<!-- BEGIN GENERATED: review-mode-contract/snapshot -->"
   454	        end: "<!-- END GENERATED: review-mode-contract/snapshot -->"
   455	      sections:
   456	        - meta
   457	        - target-types
   458	        - dimensions
   459	        - severities
   460	        - verdicts
   461	        - quality-gates
   462	        - convergence
   463	        - cross-reference-protocols
   464	        - outputs
   465	        - validation
   466	
   467	# Validator contract for CI, render verification, and drift detection.
   468	validation:
   469	  schemaVersion: 1
   470	  checks:
   471	    - id: schema
   472	      description: Validate this manifest against the canonical review-mode contract schema.
   473	    - id: render-verify
   474	      description: Re-render downstream artifacts in verify mode and fail on drift.
   475	    - id: marker-integrity
   476	      description: Ensure every render target contains intact begin/end markers with no overlapping generated blocks.
   477	    - id: enum-parity
   478	      description: Ensure target types, dimensions, severities, verdicts, and quality gates match across rendered artifacts.
   479	    - id: jsonl-parity
   480	      description: Ensure JSONL iteration and synthesis-event fields match the outputs contract.
   481	    - id: lifecycle-parity
   482	      description: Ensure lifecycle mode docs and workflow branches agree on new, resume, restart, fork, and completed-continue semantics.
   483	    - id: reducer-contract
   484	      description: Ensure reducer inputs, outputs, and findings-registry metrics are documented consistently across assets and runtime mirrors.
   485	    - id: duplicate-literal-lint
   486	      description: Detect duplicated hard-coded review taxonomy literals outside generated sections.
   487	    - id: runtime-coverage
   488	      description: Ensure every supported runtime deep-review agent has a declared render artifact and parity coverage.
   489	    - id: playbook-assertions
   490	      description: Assert manual testing playbook scenarios reference the canonical simplified contract where applicable.

exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml | sed -n '130,210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   130	        inspect:
   131	          - "{spec_folder}/research/deep-research-config.json"
   132	          - "{spec_folder}/research/deep-research-state.jsonl"
   133	          - "{spec_folder}/research/deep-research-strategy.md"
   134	        classify:
   135	          fresh: "None of the three state artifacts exist"
   136	          resume: "Config, JSONL, and strategy all exist and agree on topic/spec folder"
   137	          completed-session: "Resume artifacts exist and config.status == 'complete'"
   138	          invalid-state: "Any partial, missing, or contradictory combination"
   139	        outputs:
   140	          - session_state: "fresh | resume | completed-session | invalid-state"
   141	        on_resume:
   142	          log: "Auto-resume: state artifacts are complete and consistent. Continue same lineage."
   143	          skip_to: phase_loop
   144	        on_restart:
   145	          action: "Archive current packet, increment generation, and create a new lineage segment"
   146	        on_fork:
   147	          action: "Copy current packet as a fork baseline with explicit parent linkage"
   148	        on_completed_session:
   149	          log: "Prior session already completed. Snapshot synthesis and reopen via completed-continue."
   150	          skip_to: phase_synthesis
   151	        on_invalid_state:
   152	          halt: true
   153	          message: "Existing deep-research state is incomplete or contradictory. Repair or archive the invalid research packet before continuing."
   154	        on_fresh:
   155	          action: "Proceed with a new session"
   156	
   157	      step_create_config:
   158	        action: "Create deep-research-config.json from template"
   159	        template: .opencode/skill/sk-deep-research/assets/deep_research_config.json
   160	        populate:
   161	          topic: "{research_topic}"
   162	          maxIterations: "{max_iterations}"
   163	          convergenceThreshold: "{convergence_threshold}"
   164	          stuckThreshold: 3
   165	          maxDurationMinutes: 120
   166	          specFolder: "{spec_folder}"
   167	          createdAt: "{ISO_8601_NOW}"
   168	          status: "initialized"
   169	          executionMode: "auto"
   170	          lineage.sessionId: "{AUTO_SESSION_ID}"
   171	          lineage.parentSessionId: null
   172	          lineage.lineageMode: "new"
   173	          lineage.generation: 1
   174	          lineage.continuedFromRun: null
   175	        output: "{spec_folder}/research/deep-research-config.json"
   176	
   177	      step_create_state_log:
   178	        action: "Initialize JSONL state log with config record"
   179	        content: '{"type":"config","topic":"{research_topic}","maxIterations":{max_iterations},"convergenceThreshold":{convergence_threshold},"createdAt":"{ISO_8601_NOW}","specFolder":"{spec_folder}"}'
   180	        output: "{spec_folder}/research/deep-research-state.jsonl"
   181	
   182	      step_create_strategy:
   183	        action: "Create strategy file from template with initial questions"
   184	        template: .opencode/skill/sk-deep-research/assets/deep_research_strategy.md
   185	        populate:
   186	          topic: "{research_topic}"
   187	          key_questions: "Derive 3-5 key questions from the research topic"
   188	          known_context: "None"
   189	          known_context_summary: "None"
   190	          max_iterations: "{max_iterations}"
   191	          convergence_threshold: "{convergence_threshold}"
   192	        output: "{spec_folder}/research/deep-research-strategy.md"
   193	
   194	      step_create_registry:
   195	        action: "Initialize reducer-owned findings registry"
   196	        content: '{"openQuestions":[],"resolvedQuestions":[],"keyFindings":[],"ruledOutDirections":[],"metrics":{"iterationsCompleted":0,"openQuestions":0,"resolvedQuestions":0,"keyFindings":0,"convergenceScore":0,"coverageBySources":{}}}'
   197	        output: "{spec_folder}/research/findings-registry.json"
   198	
   199	      step_enrich_strategy_context:
   200	        action: "Ensure Known Context is written only after strategy.md exists"
   201	        condition: "prior_context_found"
   202	        edit: "{spec_folder}/research/deep-research-strategy.md"
   203	        note: "Append or replace the Known Context section with prior_context_summary and retained detail from prior_context"
   204	
   205	      step_init_complete:
   206	        log: "Initialization complete. Config, state, and strategy files created."
   207	        set: { current_iteration: 1, current_segment: 1, stuck_count: 0 }
   208	
   209	  # ═══════════════════════════════════════════════════════════════
   210	  # PHASE 2: ITERATION LOOP

exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml | sed -n '245,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   245	          message: "Research paused. Delete research/.deep-research-pause to resume."
   246	          halt: true
   247	        if_not_exists:
   248	          proceed: true
   249	
   250	      step_check_convergence:
   251	        action: "Evaluate stop conditions"
   252	        algorithm: |
   253	          1. if iteration_count >= max_iterations: STOP (max_iterations_reached)
   254	          2. if remaining_questions == 0: STOP (all_questions_answered)
   255	          3. if stuck_count >= config.stuckThreshold: STUCK_RECOVERY
   256	          4. COMPOSITE CONVERGENCE (3-signal weighted vote):
   257	               signals = []
   258	               Filter: exclude iterations where status == thought from signal inputs (use only evidence iterations)
   259	               a) Rolling average (w=0.30, needs 3+ iterations):
   260	                  avg = mean(last 3 newInfoRatios)
   261	                  stop if avg < convergence_threshold
   262	               b) MAD noise floor (w=0.35, needs 4+ iterations):
   263	                  noiseFloor = MAD(all ratios) * 1.4826
   264	                  stop if latest ratio <= noiseFloor
   265	               c) Question entropy (w=0.35):
   266	                  coverage = answered / total questions
   267	                  stop if coverage >= 0.85
   268	               Redistribute weights for unavailable signals.
   269	               if weighted_stop_score > 0.60: STOP (composite_converged)
   270	          5. else: CONTINUE
   271	          6. if decision == "STOP":
   272	               guardResult = checkQualityGuards(state, strategy)
   273	               if not guardResult.passed:
   274	                 log: "Quality guard failed: {guardResult.violations}. Overriding STOP to CONTINUE."
   275	                 decision = "CONTINUE"
   276	          See convergence.md for full pseudocode and signal definitions.
   277	          Segment-aware convergence is experimental/reference-only; live workflow uses the current session as a single segment.
   278	        outputs:
   279	          - decision: "STOP | STUCK_RECOVERY | CONTINUE"
   280	          - reason: "Human-readable stop reason"
   281	
   282	      step_handle_convergence:
   283	        action: "Act on convergence decision"
   284	        if_stop:
   285	          log: "Loop stopping. Reason: {reason}"
   286	          skip_to: phase_synthesis
   287	        if_stuck_recovery:
   288	          log: "Stuck detected ({stuck_count} consecutive no-progress). Entering recovery."
   289	          set: { next_focus: "RECOVERY: Widen scope. Try fundamentally different approach. Least-explored question: {least_explored}" }
   290	          reset: { stuck_count: 0 }
   291	        if_continue:
   292	          log: "Iteration {current_iteration}: Continuing. Focus: {next_focus}"
   293	
   294	      step_dispatch_iteration:
   295	        action: "Dispatch @deep-research agent for one iteration"
   296	        dispatch:
   297	          agent: deep-research
   298	          model: opus
   299	          pre_dispatch:
   300	            generate_summary: |
   301	              STATE SUMMARY (auto-generated):
   302	              Segment: {current_segment} | Iteration: {current_iteration} of {max_iterations}
   303	              Questions: {answered_count}/{total_questions} answered | Last focus: {last_focus}
   304	              Last 2 ratios: {ratio_prev} -> {ratio_latest} | Stuck count: {stuck_count}
   305	              Next focus: {next_focus}
   306	          context: |
   307	            {state_summary}
   308	
   309	            Research Topic: {research_topic}
   310	            Iteration: {current_iteration} of {max_iterations}
   311	            Focus Area: {next_focus}
   312	            Remaining Key Questions: {remaining_questions_list}
   313	            Last 3 Iterations Summary: {last_3_summaries}
   314	
   315	            State Files (ALL paths relative to repo root):
   316	              Config: {spec_folder}/research/deep-research-config.json
   317	              State Log: {spec_folder}/research/deep-research-state.jsonl
   318	              Strategy: {spec_folder}/research/deep-research-strategy.md
   319	              Registry: {spec_folder}/research/findings-registry.json
   320	              Write findings to: {spec_folder}/research/iterations/iteration-{NNN}.md
   321	
   322	            CONSTRAINT: You are a LEAF agent. Do NOT dispatch sub-agents.
   323	            CONSTRAINT: Target 3-5 research actions. Max 12 tool calls total.
   324	            CONSTRAINT: Write ALL findings to files. Do not hold in context.
   325	            CONSTRAINT: The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization.
   326	        wait_for_completion: true
   327	
   328	      step_reduce_state:
   329	        action: "Run the reducer to synchronize registry, dashboard, and strategy"
   330	        command: "node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs {spec_folder}"
   331	        inputs:
   332	          latestJSONLDelta: "Latest JSONL records written since the previous iteration"
   333	          newIterationFile: "{spec_folder}/research/iterations/iteration-{NNN}.md"
   334	          priorReducedState: "{spec_folder}/research/findings-registry.json"
   335	        outputs:
   336	          - "{spec_folder}/research/findings-registry.json"
   337	          - "{spec_folder}/research/deep-research-dashboard.md"
   338	          - "{spec_folder}/research/deep-research-strategy.md"
   339	        failure_modes:
   340	          malformed_delta: "skip + warn"

exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml | sed -n '160,310p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml | sed -n '420,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   160	          resume: "Config, JSONL, and strategy all exist and config.mode == 'review' and agree on target/spec folder"
   161	          completed-session: "Resume artifacts exist and config.status == 'complete'"
   162	          invalid-state: "Any partial, missing, or contradictory combination"
   163	        outputs:
   164	          - session_state: "fresh | resume | completed-session | invalid-state"
   165	        on_resume:
   166	          log: "Auto-resume: state artifacts are complete and consistent. Continue same lineage."
   167	          skip_to: phase_loop
   168	        on_restart:
   169	          action: "Archive current review packet, increment generation, and create a new lineage segment"
   170	        on_fork:
   171	          action: "Copy current review packet as a fork baseline with explicit parent linkage"
   172	        on_completed_session:
   173	          log: "Prior session already completed. Snapshot review synthesis and reopen via completed-continue."
   174	          skip_to: phase_synthesis
   175	        on_invalid_state:
   176	          halt: true
   177	          message: "Existing deep-review state in review/ is incomplete or contradictory. Repair or archive the invalid review packet before continuing."
   178	        on_fresh:
   179	          action: "Proceed with a new session"
   180	
   181	      step_scope_discovery:
   182	        action: "Resolve review target to a concrete file list based on target type"
   183	        resolve:
   184	          spec-folder: |
   185	            1. Read spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md
   186	            2. Discover implementation files referenced in spec artifacts
   187	            3. Discover test files associated with implementation
   188	            4. Set scope = all discovered files
   189	          skill: |
   190	            1. Read SKILL.md from .opencode/skill/{skill_name}/
   191	            2. Discover references/, assets/, scripts/ contents
   192	            3. Find agent definitions referencing this skill across runtimes
   193	            4. Find command entry points referencing this skill
   194	            5. Set scope = all discovered files
   195	          agent: |
   196	            1. Find agent definition across all runtimes (.claude/agents/, .opencode/agent/, .codex/agents/, .agents/, .gemini/agents/)
   197	            2. Compare agent definitions for consistency
   198	            3. Set scope = all discovered agent files
   199	          track: |
   200	            1. List all child spec folders under specs/{track}/ or .opencode/specs/{track}/
   201	            2. For each: read spec.md + checklist.md
   202	            3. Set scope = all child spec artifacts
   203	          files: |
   204	            1. Expand glob patterns from review_target
   205	            2. Validate all files exist
   206	            3. Discover immediate cross-references (imports, links)
   207	            4. Set scope = expanded file list + cross-references
   208	        outputs:
   209	          - review_scope_files: "List of all files in review scope"
   210	          - cross_reference_targets: "{ spec_paths: [...], code_paths: [...], test_paths: [...] }"
   211	
   212	      step_order_dimensions:
   213	        action: "Order review dimensions based on risk priority"
   214	        algorithm: |
   215	          1. Iteration 0 (inventory pass): Build artifact map, identify file types, estimate complexity
   216	          2. Subsequent iterations follow risk-ordered deep passes:
   217	             correctness → security → traceability → maintainability
   218	          3. If review_dimensions != "all", filter to only requested dimensions
   219	          4. Derive traceability protocol plan:
   220	             - core: spec_code, checklist_evidence
   221	             - overlay: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
   222	          5. Store ordered list as dimension_queue
   223	        outputs:
   224	          - dimension_queue: "Ordered list of dimensions to review"
   225	          - inventory_pass: true
   226	
   227	      step_create_config:
   228	        action: "Create deep-review-config.json from template with review-specific fields"
   229	        template: .opencode/skill/sk-deep-review/assets/deep_review_config.json
   230	        populate:
   231	          topic: "Review: {review_target}"
   232	          mode: "review"
   233	          sessionId: "{ISO_8601_NOW}"
   234	          parentSessionId: null
   235	          lineageMode: "new"
   236	          generation: 1
   237	          continuedFromRun: null
   238	          reviewTarget: "{review_target}"
   239	          reviewTargetType: "{review_target_type}"
   240	          # Normalize to JSON array before writing (expand "all" to ["correctness","security","traceability","maintainability"]).
   241	          reviewDimensions: "{review_dimensions}"
   242	          reviewScopeFiles: "{review_scope_files}"
   243	          severityThreshold: "P2"
   244	          crossReference:
   245	            core: ["spec_code", "checklist_evidence"]
   246	            overlay: ["skill_agent", "agent_cross_runtime", "feature_catalog_code", "playbook_capability"]
   247	          maxIterations: "{max_iterations}"
   248	          convergenceThreshold: "{convergence_threshold}"
   249	          stuckThreshold: 2
   250	          maxDurationMinutes: 120
   251	          specFolder: "{spec_folder}"
   252	          createdAt: "{ISO_8601_NOW}"
   253	          status: "initialized"
   254	          releaseReadinessState: "in-progress"
   255	          executionMode: "auto"
   256	        output: "{spec_folder}/review/deep-review-config.json"
   257	
   258	      step_create_state_log:
   259	        action: "Initialize JSONL state log with config record including review fields and lineage metadata"
   260	        content: '{"type":"config","mode":"review","reviewTarget":"{review_target}","reviewTargetType":"{review_target_type}","reviewDimensions":"{review_dimensions}","sessionId":"{ISO_8601_NOW}","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":{max_iterations},"convergenceThreshold":{convergence_threshold},"createdAt":"{ISO_8601_NOW}","specFolder":"{spec_folder}"}'
   261	        output: "{spec_folder}/review/deep-review-state.jsonl"
   262	
   263	      step_create_findings_registry:
   264	        action: "Initialize reducer-owned review findings registry"
   265	        content: '{"sessionId":"{ISO_8601_NOW}","generation":1,"lineageMode":"new","openFindings":[],"resolvedFindings":[],"repeatedFindings":[],"dimensionCoverage":{"correctness":false,"security":false,"traceability":false,"maintainability":false},"findingsBySeverity":{"P0":0,"P1":0,"P2":0},"openFindingsCount":0,"resolvedFindingsCount":0,"convergenceScore":0.0}'
   266	        output: "{spec_folder}/review/deep-review-findings-registry.json"
   267	
   268	      step_create_strategy:
   269	        action: "Create review strategy file from deep_review_strategy.md template"
   270	        template: .opencode/skill/sk-deep-review/assets/deep_review_strategy.md
   271	        populate:
   272	          review_target: "{review_target}"
   273	          review_target_type: "{review_target_type}"
   274	          dimensions: "{dimension_queue}"
   275	          scope_files: "{review_scope_files}"
   276	          cross_reference_targets: "{cross_reference_targets}"
   277	          max_iterations: "{max_iterations}"
   278	          convergence_threshold: "{convergence_threshold}"
   279	        output: "{spec_folder}/review/deep-review-strategy.md"
   280	
   281	      step_enrich_strategy_context:
   282	        action: "Ensure Known Context is written only after strategy.md exists"
   283	        condition: "prior_context_found"
   284	        edit: "{spec_folder}/review/deep-review-strategy.md"
   285	        note: "Append or replace the Known Context section with prior_context_summary and retained detail from prior_context"
   286	
   287	      step_init_complete:
   288	        log: "Initialization complete. Config, state, and strategy files created. Review scope: {review_scope_files_count} files, {dimension_queue_count} dimensions."
   289	        set: { current_iteration: 1, stuck_count: 0, p0_count: 0, p1_count: 0, p2_count: 0 }
   290	
   291	  # ═══════════════════════════════════════════════════════════════
   292	  # PHASE 2: ITERATION LOOP
   293	  # ═══════════════════════════════════════════════════════════════
   294	  phase_loop:
   295	    purpose: Dispatch review agent iterations until convergence
   296	    repeat: true
   297	    max_repeats: "{max_iterations}"
   298	    steps:
   299	
   300	      step_read_state:
   301	        action: "Read current state from JSONL, strategy, and config"
   302	        read:
   303	          - "{spec_folder}/review/deep-review-state.jsonl"
   304	          - "{spec_folder}/review/deep-review-findings-registry.json"
   305	          - "{spec_folder}/review/deep-review-strategy.md"
   306	          - "{spec_folder}/review/deep-review-config.json"
   307	        extract:
   308	          - iteration_count: "Count lines where type === 'iteration'"
   309	          - current_iteration: "iteration_count + 1"
   310	          - last_newFindingsRatio: "Extract newFindingsRatio from last iteration record"

exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml | sed -n '390,446p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   420	            VERDICTS: FAIL | CONDITIONAL | PASS (PASS may set hasAdvisories=true when only P2 remain)
   421	            CLAIM ADJUDICATION: Every new P0/P1 must include claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.
   422	
   423	            State Files (ALL paths relative to repo root):
   424	              Config: {spec_folder}/review/deep-review-config.json
   425	              State Log: {spec_folder}/review/deep-review-state.jsonl
   426	              Findings Registry: {spec_folder}/review/deep-review-findings-registry.json
   427	              Strategy: {spec_folder}/review/deep-review-strategy.md
   428	              Write findings to: {spec_folder}/review/iterations/iteration-{NNN}.md
   429	
   430	            CONSTRAINT: You are a LEAF agent. Do NOT dispatch sub-agents.
   431	            CONSTRAINT: Target 9 tool calls. Soft max 12, hard max 13.
   432	            CONSTRAINT: Write ALL findings to files. Do not hold in context.
   433	            CONSTRAINT: Review target is READ-ONLY. Do not modify reviewed files.
   434	            CONSTRAINT: Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, and newFindingsRatio.
   435	            CONSTRAINT: Update strategy.md dimension coverage, traceability status, and running findings.
   436	        wait_for_completion: true
   437	
   438	      step_evaluate_results:
   439	        action: "Verify iteration outputs and extract metrics"
   440	        verify:
   441	          - file_exists: "{spec_folder}/review/iterations/iteration-{NNN}.md"
   442	          - jsonl_appended: "New iteration record in state.jsonl"
   443	          - strategy_updated: "Strategy.md has been modified"
   444	        extract:
   445	          - newFindingsRatio: "From latest JSONL iteration record"
   446	          - findings_count: "From latest JSONL iteration record"
   447	          - severity_counts: "From latest JSONL iteration record (P0, P1, P2)"
   448	          - dimensions: "From latest JSONL iteration record"
   449	          - files_reviewed: "From latest JSONL iteration record"
   450	          - status: "From latest JSONL iteration record"
   451	          - reviewed_artifacts: "From latest JSONL iteration record"
   452	          - traceability_checks: "From latest JSONL iteration record when present"
   453	        on_missing_outputs:
   454	          action: "Mark iteration as 'error', continue to next"
   455	          append_jsonl: '{"type":"iteration","run":{current_iteration},"mode":"review","status":"error","focus":"{next_dimension}","dimensions":["{next_dimension}"],"filesReviewed":[],"findingsCount":0,"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"traceabilityChecks":{"summary":{"required":0,"executed":0,"pass":0,"partial":0,"fail":0,"blocked":0,"notApplicable":0,"gatingFailures":0},"results":[]},"newFindingsRatio":0.0,"timestamp":"{ISO_8601_NOW}"}'
   456	
   457	      step_post_iteration_claim_adjudication:
   458	        action: "Validate typed claim-adjudication packets for any new P0/P1 findings"
   459	        verify:
   460	          - typed_packets_present: "Every new P0/P1 finding in review/iterations/iteration-{NNN}.md contains a claim-adjudication JSON block"
   461	          - packet_fields: "Each packet includes claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger"
   462	        on_fail:
   463	          action: "Mark the iteration as invalid for convergence and require rewrite before STOP is permitted"
   464	          set:
   465	            claim_adjudication_passed: false
   466	          log: "Claim adjudication incomplete for new P0/P1 findings. Continue loop until packets are present. Set claim_adjudication_passed = false. This flag MUST be checked in convergence evaluation — STOP is blocked while claim_adjudication_passed == false."
   467	
   468	      step_reduce_review_state:
   469	        action: "Run reducer to refresh the canonical findings registry before dashboard generation"
   470	        read:
   471	          - "{spec_folder}/review/deep-review-state.jsonl"
   472	          - "{spec_folder}/review/iterations/iteration-{NNN}.md"
   473	          - "{spec_folder}/review/deep-review-findings-registry.json"
   474	        write: "{spec_folder}/review/deep-review-findings-registry.json"
   475	        note: "Reducer outputs findingsRegistry, dashboardMetrics, and strategyUpdates. Re-running the same inputs must be idempotent."
   476	
   477	      step_generate_dashboard:
   478	        action: "Generate or refresh the review dashboard"
   479	        read:
   480	          - "{spec_folder}/review/deep-review-state.jsonl"
   481	          - "{spec_folder}/review/deep-review-findings-registry.json"
   482	          - "{spec_folder}/review/deep-review-strategy.md"
   483	        content: |
   484	          # Deep Review Dashboard - Session Overview
   485	
   486	          Auto-generated from JSONL state log and strategy file. Regenerated after every iteration evaluation.
   487	
   488	          ## Status
   489	          - Review Target: {review_target} ({review_target_type})
   490	          - Status: [ITERATING | CONVERGING | STUCK_RECOVERY | COMPLETE]
   491	          - Iteration: {current_iteration} of {max_iterations}
   492	          - Provisional Verdict: [PASS | CONDITIONAL | FAIL | PENDING]
   493	          - hasAdvisories: {has_advisories}
   494	
   495	          ## Findings Summary
   496	          | Severity | Count | Trend |
   497	          |----------|------:|-------|
   498	          | P0 (Blockers) | {p0_count} | {p0_trend} |
   499	          | P1 (Required) | {p1_count} | {p1_trend} |
   500	          | P2 (Suggestions) | {p2_count} | {p2_trend} |
   501	
   502	          ## Dimension Coverage
   503	          | Dimension | Status | Iteration | Findings |
   504	          |-----------|--------|-----------|----------|
   505	          | [per dimension from strategy + JSONL] |
   506	
   507	          ## Traceability Coverage
   508	          | Protocol | Level | Status | Findings |
   509	          |----------|-------|--------|----------|
   510	          | [per protocol from traceabilityChecks] |
   511	
   512	          ## Progress
   513	          | # | Dimension | Ratio | P0/P1/P2 | Status |
   514	          |---|-----------|-------|----------|--------|
   515	          | [per iteration from JSONL] |
   516	
   517	          ## Trend
   518	          - Last 3 ratios: [{ratios}] [{trend}]
   519	          - Stuck count: {stuck_count}
   520	          - Gate violations: {guard_violations}
   521	
   522	          ## Next Focus
   523	          {next_dimension}
   524	        output: "{spec_folder}/review/deep-review-dashboard.md"
   525	        note: "Auto-generated from JSONL + strategy. Never manually edited."
   526	
   527	      step_update_tracking:
   528	        action: "Update loop tracking variables"
   529	        set:
   530	          current_iteration: "{current_iteration + 1}"
   531	          p0_count: "Accumulate from severity_counts"
   532	          p1_count: "Accumulate from severity_counts"
   533	          p2_count: "Accumulate from severity_counts"
   534	          stuck_count: |
   535	            if status == 'thought': unchanged (skip)
   536	            if status == 'insight': 0 (reset)
   537	            if newFindingsRatio <= 0.05: stuck_count + 1
   538	            else: 0
   539	        log: "Iteration {N} complete. Dimensions: {dimensions}. newFindingsRatio: {newFindingsRatio}. Findings: P0={severity_counts.P0} P1={severity_counts.P1} P2={severity_counts.P2}. Stuck count: {stuck_count}."
   540	
   541	      step_loop_decision:
   542	        action: "Return to step_read_state for next iteration"
   543	        goto: step_read_state
   544	
   545	  # ═══════════════════════════════════════════════════════════════
   546	  # PHASE 3: SYNTHESIS
   547	  # ═══════════════════════════════════════════════════════════════
   548	  phase_synthesis:
   549	    purpose: Compile all iteration findings into review/review-report.md
   550	    steps:
   551	
   552	      step_hydrate_summary_metrics:
   553	        action: "Hydrate summary metrics before synthesis, including completed-continue reopen paths"
   554	        read:
   555	          - "{spec_folder}/review/deep-review-config.json"
   556	          - "{spec_folder}/review/deep-review-state.jsonl"
   557	          - "{spec_folder}/review/deep-review-findings-registry.json"
   558	          - "{spec_folder}/review/deep-review-strategy.md"
   559	        extract:
   560	          - iteration_count: "Count lines where type === 'iteration'"

 succeeded in 0ms:
   390	        action: "Hydrate summary metrics before synthesis, including completed-continue reopen paths"
   391	        read:
   392	          - "{spec_folder}/research/deep-research-config.json"
   393	          - "{spec_folder}/research/deep-research-state.jsonl"
   394	          - "{spec_folder}/research/findings-registry.json"
   395	          - "{spec_folder}/research/deep-research-strategy.md"
   396	        extract:
   397	          - iteration_count: "Count lines where type === 'iteration'"
   398	          - current_iteration: "iteration_count + 1"
   399	          - current_segment: "Latest segment_start event segment, else 1"
   400	          - last_focus: "Extract focus from latest iteration record, else 'none yet'"
   401	          - ratio_prev: "Extract newInfoRatio from second-latest iteration record, else 'N/A'"
   402	          - ratio_latest: "Extract newInfoRatio from latest iteration record, else 'N/A'"
   403	          - remaining_questions: "Count unchecked items in 'Key Questions'"
   404	          - remaining_questions_list: "List unchecked key questions from strategy.md"
   405	          - answered_count: "Count answered questions from strategy.md"
   406	          - total_questions: "Count total questions tracked in strategy.md"
   407	          - last_3_summaries: "Summarize the latest 3 iteration records as 'run N: focus (ratio)'"
   408	          - reason: "Use the latest synthesis/recovery stop reason if present, else 'completed-continue'"
   409	
   410	      step_read_all_iterations:
   411	        action: "Read all iteration files and strategy"
   412	        read_pattern: "{spec_folder}/research/iterations/iteration-*.md"
   413	        read_also: "{spec_folder}/research/deep-research-strategy.md"
   414	
   415	      step_compile_research:
   416	        action: "Compile or finalize research/research.md"
   417	        instructions: |
   418	          If research/research.md exists (progressive synthesis was active):
   419	            1. Read current research/research.md
   420	            2. Consolidate and deduplicate findings across all iterations
   421	            3. Fill any empty sections with findings from iteration files
   422	            4. Remove redundancy while preserving all unique findings
   423	            5. Add convergence report as appendix
   424	
   425	          If research/research.md does not exist:
   426	            1. Create research/research.md following 17-section template
   427	            2. Populate sections from iteration files
   428	            3. Add citations from original sources
   429	            4. Note unanswered questions in Open Questions section
   430	          Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.
   431	        output: "{spec_folder}/research/research.md"
   432	
   433	      step_convergence_report:
   434	        action: "Generate and append convergence report"
   435	        report: |
   436	          ## Convergence Report
   437	          - Stop reason: {reason}
   438	          - Total iterations: {iteration_count}
   439	          - Questions answered: {answered_count} / {total_questions}
   440	          - Remaining questions: {remaining_questions}
   441	          - Last 3 iteration summaries: {last_3_summaries}
   442	          - Convergence threshold: {convergence_threshold}
   443	          - Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
   444	        append_to_jsonl: '{"type":"event","event":"synthesis_complete","totalIterations":{iteration_count},"answeredCount":{answered_count},"totalQuestions":{total_questions},"stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
   445	
   446	      step_update_config_status:

exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml | sed -n '310,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   310	          - last_newFindingsRatio: "Extract newFindingsRatio from last iteration record"
   311	          - last_focus: "Extract focus/dimension from latest iteration record, else 'none yet'"
   312	          - ratio_prev: "Extract newFindingsRatio from second-latest iteration record, else 'N/A'"
   313	          - ratio_latest: "Extract newFindingsRatio from latest iteration record, else 'N/A'"
   314	          - next_dimension: "Next uncovered dimension from dimension_queue in strategy.md"
   315	          - dimensions_covered: "List of dimensions already reviewed"
   316	          - dimensions_remaining: "List of dimensions not yet reviewed"
   317	          - dimension_coverage: "covered / total dimensions"
   318	          - coverage_age: "Iterations since dimension coverage last changed; require >= 1 before STOP"
   319	          - p0_count: "Count P0 findings across all iterations"
   320	          - p1_count: "Count P1 findings across all iterations"
   321	          - p2_count: "Count P2 findings across all iterations"
   322	          - last_3_summaries: "Summarize the latest 3 iteration records as 'run N: dimension (ratio, P0/P1/P2)'"
   323	          - latest_status: "Extract status from latest iteration record, else 'none yet'"
   324	
   325	      step_check_pause_sentinel:
   326	        action: "Check for pause sentinel file"
   327	        check: "Does {spec_folder}/review/.deep-review-pause exist?"
   328	        if_exists:
   329	          log_event: '{"type":"event","event":"paused","reason":"sentinel file detected"}'
   330	          message: "Review paused. Delete review/.deep-review-pause to resume."
   331	          halt: true
   332	        if_not_exists:
   333	          proceed: true
   334	
   335	      step_check_convergence:
   336	        action: "Evaluate review-specific stop conditions"
   337	        algorithm: |
   338	          1. HARD STOPS:
   339	             a) if iteration_count >= max_iterations: STOP (max_iterations_reached)
   340	             b) if all dimensions clean AND required traceability protocols are covered AND p0_count == 0 AND p1_count == 0 AND coverage_age >= 1 AND all quality gates pass (evidence: every P0/P1 has file:line; scope: all findings within target; coverage: all dimensions reviewed): STOP (all_dimensions_clean)
   341	          2. STUCK DETECTION (threshold 2):
   342	             if stuck_count >= 2: STUCK_RECOVERY
   343	          3. COMPOSITE CONVERGENCE (3-signal weighted vote with split thresholds):
   344	               signals = []
   345	               a) Rolling average (w=0.30, window=2, needs 2+ iterations):
   346	                  avg = mean(last 2 newFindingsRatios)
   347	                  stop if avg <= 0.08
   348	               b) MAD noise floor (w=0.25, needs 3+ iterations):
   349	                  noiseFloor = MAD(all ratios) * 1.4826
   350	                  stop if latest ratio <= noiseFloor
   351	               c) Dimension coverage (w=0.45):
   352	                  coverage = dimensions_covered / total_dimensions
   353	                  stop if coverage >= 1.0 AND required traceability protocols are covered AND coverage_age >= 1
   354	               Redistribute weights for unavailable signals.
   355	               if latest ratio <= 0.05: mark no_progress_threshold_reached
   356	               if weighted_stop_score >= 0.60: check binary gates
   357	          4. QUALITY GUARDS (4 binary checks — ALL must pass to allow STOP):
   358	               a) Evidence: Every active finding has concrete file:line evidence and no active P0/P1 relies only on inference
   359	               b) Scope: All findings stay within declared review scope and target boundaries
   360	               c) Coverage: Configured dimensions and required traceability protocols covered, with coverage_age >= 1
   361	               d) Claim adjudication: claim_adjudication_passed != false (STOP is blocked while claim_adjudication_passed == false)
   362	             if not all guards passed:
   363	               log: "Quality guard failed: {violations}. Overriding STOP to CONTINUE."
   364	               decision = "CONTINUE"
   365	          5. else: CONTINUE
   366	        outputs:
   367	          - decision: "STOP | STUCK_RECOVERY | CONTINUE"
   368	          - reason: "Human-readable stop reason"
   369	
   370	      step_handle_convergence:
   371	        action: "Act on convergence decision"
   372	        if_stop:
   373	          log: "Loop stopping. Reason: {reason}"
   374	          skip_to: phase_synthesis
   375	        if_stuck_recovery:
   376	          log: "Stuck detected ({stuck_count} consecutive no-progress). Entering recovery."
   377	          recovery_strategies:
   378	            - "Change granularity: file-level → function-level → line-level review"
   379	            - "Traceability protocol replay: re-run unresolved core or overlay checks"
   380	            - "Escalate severity review: re-examine P2 findings for potential P1 upgrades"
   381	          set: { next_dimension: "RECOVERY: {recovery_strategy}. Least-explored dimension: {least_explored}" }
   382	          reset: { stuck_count: 0 }
   383	        if_continue:
   384	          log: "Iteration {current_iteration}: Continuing. Dimension: {next_dimension}"
   385	
   386	      step_generate_state_summary:
   387	        action: "Generate compact state summary for dispatch context (~200 tokens)"
   388	        generate: |
   389	          STATE SUMMARY (auto-generated):
   390	          Iteration: {current_iteration} of {max_iterations}
   391	          Dimension: {next_dimension}
   392	          Prior Findings: P0={p0_count} P1={p1_count} P2={p2_count}
   393	          Dimension Coverage: {dimensions_covered_list} ({dimension_coverage})
   394	          Traceability: core={core_protocol_status} overlay={overlay_protocol_status}
   395	          Coverage Age: {coverage_age}
   396	          Last 2 ratios: {ratio_prev} -> {ratio_latest}
   397	          Stuck count: {stuck_count}
   398	          Provisional Verdict: {PASS|CONDITIONAL|FAIL|PENDING} hasAdvisories={has_advisories}
   399	
   400	      step_dispatch_iteration:
   401	        action: "Dispatch @deep-review agent for one review iteration"
   402	        dispatch:
   403	          agent: deep-review
   404	          model: opus
   405	          context: |
   406	            {state_summary}
   407	
   408	            REVIEW ITERATION {current_iteration} of {max_iterations}
   409	            MODE: review
   410	            DIMENSION: {next_dimension}
   411	            REVIEW TARGET: {review_target}
   412	            REVIEW SCOPE FILES: {review_scope_files}
   413	            PRIOR FINDINGS: P0={p0_count} P1={p1_count} P2={p2_count}
   414	            SHARED DOCTRINE: Load .agents/skills/sk-code-review/references/review_core.md before final severity calls.
   415	            REVIEW DIMENSIONS: correctness, security, traceability, maintainability
   416	            TRACEABILITY PROTOCOLS:
   417	            - Core: spec_code, checklist_evidence
   418	            - Overlay: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
   419	            QUALITY GATES: evidence, scope, coverage
   420	            VERDICTS: FAIL | CONDITIONAL | PASS (PASS may set hasAdvisories=true when only P2 remain)

exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml | sed -n '560,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   560	          - iteration_count: "Count lines where type === 'iteration'"
   561	          - p0_count: "Total P0 findings across all iterations (deduped)"
   562	          - p1_count: "Total P1 findings across all iterations (deduped)"
   563	          - p2_count: "Total P2 findings across all iterations (deduped)"
   564	          - dimensions_covered: "List of reviewed dimensions"
   565	          - dimension_coverage: "covered / total"
   566	          - last_3_summaries: "Summarize the latest 3 iteration records"
   567	          - reason: "Use the latest stop reason if present, else 'completed-continue'"
   568	
   569	      step_read_all_iterations:
   570	        action: "Read all iteration files and strategy"
   571	        read_pattern: "{spec_folder}/review/iterations/iteration-*.md"
   572	        read_also: "{spec_folder}/review/deep-review-strategy.md"
   573	
   574	      step_build_finding_registry:
   575	        action: "Build deduplicated finding registry from all iterations"
   576	        algorithm: |
   577	          1. Extract all findings from iteration files
   578	          2. Deduplicate by key: file:line + normalized_title
   579	             - Same file:line, multiple dimensions → single finding, multiple dimension tags
   580	             - Keep highest severity on duplicates
   581	          3. Track finding lifecycle:
   582	             - status: active | duplicate | upgraded | downgraded | contested | resolved_false_positive
   583	             - Record first_seen, upgraded_in, previous_severity for severity changes
   584	          4. Resolve contradictions:
   585	             - Findings marked contested across iterations → referee pass
   586	             - Determine final severity and status
   587	          5. Count only 'active' findings for totals
   588	        outputs:
   589	          - finding_registry: "Deduplicated list of all findings with metadata"
   590	          - active_p0: "Count of active P0 findings"
   591	          - active_p1: "Count of active P1 findings"
   592	          - active_p2: "Count of active P2 findings"
   593	
   594	      step_adversarial_selfcheck:
   595	        action: "Final adversarial self-check on all P0 and P1 findings"
   596	        algorithm: |
   597	          For each active P0/P1 finding:
   598	            1. Hunter: Re-verify finding against source code (re-read file:line)
   599	            2. Skeptic: Challenge severity — is this really P0/P1? Could it be P2?
   600	            3. Referee: Final call — confirm, downgrade, or mark false_positive
   601	          Update finding_registry with adjudicated results.
   602	
   603	      step_compile_review_report:
   604	        action: "Compile review/review-report.md with 9 sections and an embedded Planning Packet"
   605	        instructions: |
   606	          Create review/review-report.md with the following sections:
   607	
   608	          1. **Executive Summary**
   609	             - Overall verdict: PASS | CONDITIONAL | FAIL
   610	             - hasAdvisories: true when PASS carries active P2 items
   611	             - P0/P1/P2 counts (active only)
   612	             - Review scope summary
   613	
   614	          2. **Planning Trigger**
   615	             - State whether `/spec_kit:plan` is required
   616	             - Include a fenced `json` block labeled `Planning Packet`
   617	             - The packet MUST include: `triggered`, `verdict`, `hasAdvisories`, `activeFindings`, `remediationWorkstreams`, `specSeed`, `planSeed`
   618	
   619	          3. **Active Finding Registry**
   620	             - Unified registry for active P0/P1/P2 findings
   621	             - For each: ID, severity, title, dimension, file:line, evidence, impact, fix recommendation, disposition
   622	
   623	          4. **Remediation Workstreams**
   624	             - Ordered action groups: P0 first, then P1, with P2 advisories separated
   625	
   626	          5. **Spec Seed**
   627	             - Concrete seed bullets for follow-on spec updates
   628	
   629	          6. **Plan Seed**
   630	             - Concrete starter tasks for `/spec_kit:plan`
   631	
   632	          7. **Traceability Status**
   633	             - Summarize required core protocols first, then applicable overlay protocols
   634	             - Include status, evidence, and any unresolved drift per protocol
   635	
   636	          8. **Deferred Items**
   637	             - Advisory-only or backlog-worthy follow-ups that do not block the current verdict
   638	
   639	          9. **Audit Appendix**
   640	             - Convergence summary, coverage summary, ruled-out claims, sources reviewed
   641	             - Cross-reference appendix MUST be split into `Core Protocols` and `Overlay Protocols`
   642	
   643	          Preserve machine-owned markers so completed-continue can snapshot and reopen without mutating prior synthesis.
   644	        output: "{spec_folder}/review/review-report.md"
   645	
   646	      step_convergence_report:
   647	        action: "Append convergence report to JSONL"
   648	        append_to_jsonl: '{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":{iteration_count},"activeP0":{active_p0},"activeP1":{active_p1},"activeP2":{active_p2},"dimensionCoverage":{dimension_coverage},"verdict":"{verdict}","releaseReadinessState":"{release_readiness_state}","stopReason":"{reason}","timestamp":"{ISO_8601_NOW}"}'
   649	        note: "Emit as numeric ratio (e.g., 0.75), not quoted string. Compute: dimensions_covered / total_dimensions."
   650	
   651	      step_update_config_status:
   652	        action: "Mark config as complete"
   653	        edit: "{spec_folder}/review/deep-review-config.json"
   654	        set_field: { status: "complete" }
   655	
   656	  # ═══════════════════════════════════════════════════════════════
   657	  # PHASE 4: SAVE
   658	  # ═══════════════════════════════════════════════════════════════
   659	  phase_save:
   660	    purpose: Preserve review context to memory system
   661	    steps:
   662	
   663	      step_generate_context:
   664	        action: "Save memory context via generate-context.js"
   665	        command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js {spec_folder}"
   666	        critical_rule: "NEVER use Write tool directly for memory/ paths"
   667	
   668	      step_index_memory:
   669	        action: "No additional indexing step in the live contract"
   670	        note: "generate-context.js is the supported save boundary for this workflow"
   671	
   672	      step_verify_save:
   673	        action: "Verify memory file was created"
   674	        check: "Does {spec_folder}/memory/*.md exist?"
   675	        on_fail: "Log warning but do not block completion"
   676	
   677	  # ═══════════════════════════════════════════════════════════════
   678	  # COMPLETION
   679	  # ═══════════════════════════════════════════════════════════════
   680	  completion:
   681	    message: |
   682	      Deep review complete.
   683	      Iterations: {iteration_count} | Stop reason: {reason}
   684	      Findings: P0={active_p0} P1={active_p1} P2={active_p2}
   685	      Verdict: {verdict} | hasAdvisories={has_advisories}
   686	
   687	      Artifacts:
   688	        - review/review-report.md (compiled from {iteration_count} iterations)
   689	        - {iteration_count} iteration files in review/iterations/
   690	        - State files in review/: deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-strategy.md, deep-review-dashboard.md
   691	        - Memory context saved
   692	
   693	      STATUS=OK PATH={spec_folder}
   694	    next_steps:
   695	      - "/spec_kit:plan [remediation] (if FAIL or CONDITIONAL verdict)"
   696	      - "/create:changelog (if PASS, including PASS with hasAdvisories=true)"
   697	      - "/spec_kit:deep-review [target] (for another review)"
   698	      - "/memory:save {spec_folder} (manual memory save)"
   699	
   700	# ─────────────────────────────────────────────────────────────────
   701	# ERROR RECOVERY
   702	# ─────────────────────────────────────────────────────────────────
   703	error_recovery:
   704	  agent_dispatch_timeout: "Retry once with reduced scope (fewer files per iteration). If second timeout, mark as 'timeout' and continue."
   705	  state_file_missing: "If JSONL missing during loop, reconstruct from iteration files. If strategy missing, create minimal version."
   706	  consecutive_failures: "After 3 consecutive errors, halt loop and enter synthesis with partial findings."
   707	  memory_save_failure: "Preserve the review packet in review/ as backup. Log warning."
   708	
   709	# ─────────────────────────────────────────────────────────────────
   710	# RULES
   711	# ─────────────────────────────────────────────────────────────────
   712	rules:
   713	  ALWAYS:
   714	    - follow_workflow_phases_in_order
   715	    - dispatch_deep_review_agent_per_iteration
   716	    - check_convergence_before_each_iteration
   717	    - write_all_state_to_files
   718	    - save_memory_context_after_synthesis
   719	    - respect_max_iterations_cap
   720	    - treat_review_target_as_read_only
   721	    - deduplicate_findings_before_synthesis
   722	    - run_adversarial_selfcheck_on_p0_p1
   723	  NEVER:
   724	    - skip_convergence_check
   725	    - dispatch_non_leaf_agents
   726	    - hold_iteration_findings_in_memory_only
   727	    - modify_config_after_initialization
   728	    - overwrite_jsonl_state_log
   729	    - proceed_without_state_file_verification
   730	    - modify_files_under_review
   731	    - report_p0_without_file_line_evidence
   732	
   733	# ─────────────────────────────────────────────────────────────────
   734	# REFERENCE-ONLY APPENDIX
   735	# ─────────────────────────────────────────────────────────────────
   736	reference_only_appendix:
   737	  checkpoint_commit:
   738	    note: "Checkpoint commits are intentionally excluded from workflow.steps."
   739	    commands:
   740	      - "git add {spec_folder}/review/iterations/iteration-{NNN}.md {spec_folder}/review/deep-review-state.jsonl {spec_folder}/review/deep-review-findings-registry.json {spec_folder}/review/deep-review-strategy.md {spec_folder}/review/review-report.md"
   741	      - 'git commit -m "chore(deep-review): iteration {NNN} complete"'
   742	  severity_weights:
   743	    note: "Severity weights for newFindingsRatio calculation"
   744	    weights:
   745	      P0: 10.0
   746	      P1: 5.0
   747	      P2: 1.0
   748	    p0_override: "If ANY new P0 discovered → newFindingsRatio = max(calculated, 0.50). A single new P0 blocks convergence."
   749	    clean_pass: "If total_findings == 0 (clean pass) → newFindingsRatio = 0.0"
   750	  review_dimensions:
   751	    note: "All 4 default review dimensions with priority ordering"
   752	    dimensions:
   753	      - { priority: 1, name: "correctness", checks: "Logic, state flow, edge cases, error handling" }
   754	      - { priority: 2, name: "security", checks: "Auth, input/output safety, data exposure, permissions" }
   755	      - { priority: 3, name: "traceability", checks: "Spec/checklist alignment, cross-reference integrity, evidence coverage" }
   756	      - { priority: 4, name: "maintainability", checks: "Patterns, documentation quality, safe follow-on change clarity" }
   757	  cross_reference_protocols:
   758	    note: "Cross-reference verification protocols split into core and overlay classes"
   759	    core_protocols:
   760	      - { check: "Spec vs Code", source: "spec.md claims", target: "implementation" }

exec
/bin/zsh -lc "nl -ba .opencode/agent/deep-research.md | sed -n '220,390p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   220	
   221	| Tool | Purpose | Budget |
   222	|------|---------|--------|
   223	| Read | State files, source code | 2-3 calls |
   224	| Write | Iteration file, state updates | 2-3 calls |
   225	| Edit | Strategy update, research/research.md update | 1-2 calls |
   226	| WebFetch | External documentation | 1-2 calls |
   227	| Grep | Code pattern search | 1-2 calls |
   228	| Glob | File discovery | 0-1 calls |
   229	| Bash | Data processing (jq, wc) | 0-1 calls |
   230	
   231	### MCP Tools
   232	
   233	| Tool | Purpose |
   234	|------|---------|
   235	| `memory_search` | Find prior research in memory system |
   236	| `memory_context` | Load context for the research topic |
   237	
   238	---
   239	
   240	## 3. ITERATION PROTOCOL
   241	
   242	### Focus Selection
   243	
   244	```
   245	Strategy "Next Focus" available?
   246	  Yes --> Use it directly
   247	  No --> Pick first unchecked "Key Question"
   248	    No questions? --> Investigate lowest-coverage area
   249	      No coverage data? --> Report stuck (newInfoRatio = 0.0)
   250	```
   251	
   252	### Recovery Mode
   253	
   254	If dispatch context includes "RECOVERY MODE":
   255	1. Read "Exhausted Approaches" in strategy.md
   256	2. Deliberately choose a DIFFERENT approach:
   257	   - If prior iterations used WebFetch, try codebase search
   258	   - If prior iterations searched broadly, narrow to specific aspect
   259	   - If prior iterations were domain-specific, try cross-domain analysis
   260	3. Document the recovery attempt explicitly in findings
   261	
   262	### Error-Aware Execution
   263	
   264	When executing research actions, apply Tier 1-2 error handling:
   265	- **Tier 1 (Source failure)**: If a tool call or source fails, retry with an alternative source (max 2 retries). Do NOT retry the exact same call.
   266	- **Tier 2 (Focus exhaustion)**: If 2 consecutive iterations on the same focus yield newInfoRatio < 0.10, add the focus to "Exhausted Approaches" and pivot to a different area.
   267	- **Tier 3+ escalation**: If Tier 1-2 recovery fails, report the error in your iteration file and set status to "error". The orchestrator handles Tier 3-5.
   268	
   269	### Tool Call Budget
   270	
   271	| Iteration Phase | Target Calls | Max Calls |
   272	|----------------|-------------|-----------|
   273	| Read state (Step 1) | 2 | 2 |
   274	| Research actions (Step 3) | 3-5 | 6 |
   275	| Write outputs (Steps 4-7) | 3-4 | 4 |
   276	| **Total** | **8-11** | **12** |
   277	
   278	If approaching 12 tool calls, stop research and proceed to writing findings.
   279	
   280	---
   281	
   282	## 4. STATE MANAGEMENT
   283	
   284	### File Paths
   285	
   286	All paths are relative to the spec folder provided in dispatch context.
   287	
   288	| File | Path | Operation |
   289	|------|------|-----------|
   290	| Config | `research/deep-research-config.json` | Read only |
   291	| State log | `research/deep-research-state.jsonl` | Read + Append |
   292	| Strategy | `research/deep-research-strategy.md` | Read only for focus selection |
   293	| Findings registry | `research/findings-registry.json` | Read only |
   294	| Iteration findings | `research/iterations/iteration-{NNN}.md` | Write (create new) |
   295	| Research output | `research/research.md` | Read + Edit only when `progressiveSynthesis` is true |
   296	
   297	### Iteration Number Derivation
   298	
   299	```
   300	Count lines in JSONL where type === "iteration"
   301	Current iteration = count + 1
   302	Pad to 3 digits for filename: iteration-001.md, iteration-002.md
   303	```
   304	
   305	### Write Safety
   306	
   307	- JSONL: Always APPEND (never overwrite). Use Write tool to append a single line.
   308	- Strategy: Use Edit tool to modify specific sections (never Write which overwrites).
   309	- Iteration file: Use Write tool to create new file (should not exist yet).
   310	- Research.md: Use Edit tool to add content to existing sections.
   311	
   312	---
   313	
   314	## 5. RULES
   315	
   316	### ALWAYS
   317	- Read state files BEFORE any research action
   318	- Write ALL findings to files (iteration-NNN.md), not just in response
   319	- Cite sources for every finding
   320	- Report newInfoRatio honestly in JSONL record
   321	- Record strategy recommendations in the iteration file so the reducer can sync them
   322	- Respect "Exhausted Approaches" -- never retry them
   323	- Stay within tool call budget (target 8-11, max 12)
   324	- Apply Tier 1-2 error recovery for tool/source failures before reporting errors
   325	
   326	### NEVER
   327	- Dispatch sub-agents or use Task tool (LEAF-only)
   328	- Hold findings in context without writing to files
   329	- Retry approaches listed in "Exhausted Approaches"
   330	- Modify deep-research-config.json (read-only)
   331	- Overwrite deep-research-state.jsonl (append-only)
   332	- Ask the user questions (autonomous execution)
   333	- Skip writing the iteration file
   334	- Fabricate sources or newInfoRatio
   335	
   336	### ESCALATE
   337	- If all approaches exhausted and questions remain, document in findings
   338	- If state files are missing or corrupted, report error status
   339	- If security concern found in research (credentials, proprietary data), flag it
   340	- If tool failures prevent any research, report timeout status
   341	
   342	---
   343	
   344	## 6. OUTPUT FORMAT
   345	
   346	### Iteration Completion Report
   347	
   348	Return this summary to the dispatcher after completing the iteration:
   349	
   350	```markdown
   351	## Iteration [N] Complete
   352	
   353	**Focus**: [What was investigated]
   354	**Findings**: [N] findings ([X] new, [Y] partially new, [Z] redundant)
   355	**newInfoRatio**: [0.XX]
   356	**Questions answered**: [list or "none"]
   357	**Questions remaining**: [count]
   358	**Recommended next focus**: [recommendation]
   359	
   360	**Files written**:
   361	- research/iterations/iteration-[NNN].md
   362	- research/deep-research-state.jsonl (appended)
   363	- workflow reducer refreshes research/deep-research-strategy.md, research/findings-registry.json, and research/deep-research-dashboard.md
   364	- research/research.md (updated, if applicable)
   365	
   366	**Status**: [complete | timeout | error | stuck | insight | thought]
   367	```
   368	
   369	---
   370	
   371	## 7. OUTPUT VERIFICATION
   372	
   373	### Iron Law
   374	
   375	**NEVER claim completion without verifiable evidence.** Every output assertion must be backed by a file existence check, content verification, or tool call result.
   376	
   377	### Pre-Delivery Checklist
   378	
   379	Before returning the completion report, verify:
   380	
   381	```
   382	ITERATION VERIFICATION:
   383	[x] State files read at start (JSONL + strategy.md)
   384	[x] Focus determined from strategy or key questions
   385	[x] Research actions executed (3-5 actions minimum)
   386	[x] research/iterations/iteration-NNN.md created with findings
   387	[x] All findings have source citations
   388	[x] Reducer-owned strategy/dashboard/registry will have enough data to sync
   389	[x] deep-research-state.jsonl appended with iteration record
   390	[x] newInfoRatio calculated and reported honestly

exec
/bin/zsh -lc "nl -ba .opencode/agent/deep-research.md | sed -n '60,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    60	```
    61	
    62	### Step-by-Step Detail
    63	
    64	#### Step 1: Read State
    65	Read these files (paths provided in dispatch context):
    66	- `research/deep-research-state.jsonl` -- Understand iteration history
    67	- `research/deep-research-strategy.md` -- Understand what to investigate
    68	- `research/findings-registry.json` (if exists) -- Understand open/resolved questions and key findings
    69	- `research/research-ideas.md` (if exists) -- Deferred ideas and promising tangents
    70	
    71	Extract from state:
    72	- Current iteration number (count JSONL iteration records + 1)
    73	- Remaining key questions
    74	- Exhausted approaches (DO NOT retry these)
    75	- Recommended next focus
    76	- Lifecycle branch from `config.lineage.lineageMode` (`resume`, `restart`, `fork`, or `completed-continue`)
    77	
    78	#### Step 2: Determine Focus
    79	
    80	**MANDATORY PRE-CHECK**: Before choosing a focus, read strategy.md "Exhausted Approaches" section:
    81	- Any category marked `BLOCKED` -- NEVER retry these approaches or any variation of them
    82	- Any category marked `PRODUCTIVE` -- PREFER these for related questions
    83	- If the chosen focus falls within a BLOCKED category, select an alternative
    84	
    85	Use strategy.md "Next Focus" section to determine what to investigate.
    86	
    87	If "Next Focus" is empty or vague:
    88	- Pick the first unchecked question from "Key Questions (remaining)"
    89	- If no questions remain, investigate areas with lowest coverage
    90	
    91	If this is a RECOVERY iteration (indicated in dispatch context):
    92	- Use a fundamentally different approach than prior iterations
    93	- Widen scope or try a different angle
    94	- Check `research/research-ideas.md` for deferred ideas that may provide escape from stuck state
    95	
    96	If promising tangents are discovered during research that fall outside current focus:
    97	- Append them to `research/research-ideas.md` for future iterations
    98	
    99	#### Step 3: Execute Research
   100	Perform 3-5 research actions using available tools:
   101	
   102	| Tool | When to Use | Example |
   103	|------|------------|---------|
   104	| WebFetch | Official docs, API references, known URLs | Fetch MDN docs for an API |
   105	| Grep | Find code patterns in codebase | Search for implementation examples |
   106	| Glob | Discover files by name/extension | Find config files or test files |
   107	| Read | Examine specific file contents | Read implementation details |
   108	| memory_search | Check prior research findings | Find related spec folder work |
   109	| Bash | Run commands for data gathering | `wc -l`, `jq` for JSON parsing |
   110	
   111	**Budget**: Target 3-5 research actions. Recommended overall budget: 8-11 tool calls per iteration. Hard max: 12 total tool calls (including state reads/writes). If approaching the limit, prioritize writing findings over additional research.
   112	
   113	**Quality Rule**: Every finding must cite a source:
   114	- `[SOURCE: https://url]` for web sources
   115	- `[SOURCE: path/to/file:line]` for codebase sources
   116	- `[SOURCE: memory:spec-folder]` for memory hits
   117	- `[INFERENCE: based on X and Y]` when deriving from multiple sources
   118	
   119	**Source Diversity Rule** : Aim to cite **>=2 independent sources** per key finding. The orchestrator runs quality guards before accepting convergence that check source diversity, focus alignment, and single-weak-source answers. Findings backed by only one source are flagged.
   120	
   121	#### Step 4: Write Findings
   122	Create `research/iterations/iteration-NNN.md` with this structure:
   123	
   124	```markdown
   125	# Iteration [N]: [Focus Area]
   126	
   127	## Focus
   128	[What this iteration investigated and why]
   129	
   130	## Findings
   131	1. [Finding with source citation]
   132	2. [Finding with source citation]
   133	3. [Finding with source citation]
   134	
   135	## Ruled Out
   136	[Approaches tried this iteration that did not yield results. Document what was attempted and why it failed, so future iterations do not repeat them.]
   137	
   138	## Dead Ends
   139	[Paths definitively eliminated -- not just unproductive this iteration, but proven to be fundamentally unviable. These should be promoted to strategy.md "Exhausted Approaches" if not already there.]
   140	
   141	## Sources Consulted
   142	- [URL or file:line reference]
   143	- [URL or file:line reference]
   144	
   145	## Assessment
   146	- New information ratio: [0.0-1.0]
   147	- Questions addressed: [list]
   148	- Questions answered: [list]
   149	
   150	## Reflection
   151	- What worked and why: [approach that yielded results + causal explanation]
   152	- What did not work and why: [approach that failed + root cause]
   153	- What I would do differently: [specific adjustment for next iteration]
   154	
   155	## Recommended Next Focus
   156	[What to investigate next, based on gaps discovered]
   157	```
   158	
   159	#### Step 5: Respect Reducer-Owned State
   160	Do not treat `research/deep-research-strategy.md`, `research/findings-registry.json`, or `research/deep-research-dashboard.md` as your primary write targets. The workflow reducer owns those synchronized packet surfaces.
   161	
   162	Instead:
   163	1. Put worked/failed guidance, answered questions, and next-focus recommendations into the iteration file
   164	2. Append the structured JSONL record
   165	3. Let the workflow reducer refresh strategy machine-owned sections, registry, and dashboard
   166	
   167	#### Step 6: Append State
   168	Append ONE line to `research/deep-research-state.jsonl`:
   169	
   170	```json
   171	{"type":"iteration","run":N,"status":"complete","focus":"[focus area]","findingsCount":N,"newInfoRatio":0.XX,"noveltyJustification":"1-sentence explanation of newInfoRatio","keyQuestions":["q1","q2"],"answeredQuestions":["q1"],"ruledOut":["approach1","approach2"],"focusTrack":"optional-track-label","toolsUsed":["Read","WebFetch"],"sourcesQueried":["https://example.com/doc","src/file.ts:42"],"timestamp":"ISO-8601","durationMs":NNNNN}
   172	```
   173	
   174	**Status values**: `complete | timeout | error | stuck | insight | thought`
   175	- `complete`: Normal iteration with evidence gathering and new findings
   176	- `timeout`: Iteration exceeded time/tool budget before finishing
   177	- `error`: Unrecoverable failure during iteration
   178	- `stuck`: No productive research avenues remain for current focus
   179	- `insight`: Low newInfoRatio but important conceptual breakthrough discovered (e.g., a synthesis that reframes prior findings)
   180	- `thought`: Analytical-only iteration with no external evidence gathering (e.g., consolidation, contradiction resolution, model-building)
   181	
   182	**Required fields** :
   183	- `noveltyJustification`: 1-sentence explanation of how newInfoRatio was calculated (e.g., "2 of 4 findings were new, 1 partially new")
   184	- `ruledOut`: Array of approaches tried and failed this iteration (may be empty `[]`)
   185	
   186	**Optional fields** :
   187	- `focusTrack`: Label tagging this iteration to a research track (e.g., "architecture", "performance", "security"). Useful for multi-track research where iterations alternate between topics.
   188	
   189	> **Note:** The orchestrator enriches each iteration record with lineage metadata, optional `segment` (default: 1), `convergenceSignals`, and reducer-driven registry/dashboard updates after the agent writes it.
   190	
   191	**newInfoRatio calculation**:
   192	- Count total findings in this iteration
   193	- Count how many are genuinely new (not in prior iterations or strategy)
   194	- Count partially new findings (adds nuance to known info) as 0.5
   195	- `newInfoRatio = (fully_new + 0.5 * partially_new) / total_findings`
   196	- If no findings at all, set to 0.0
   197	
   198	**Simplicity bonus**: If this iteration consolidates, simplifies, or resolves contradictions in prior findings -- even without new external information -- apply a +0.10 bonus to newInfoRatio (capped at 1.0). Simplification counts as genuine value:
   199	- Reducing the number of open questions through synthesis
   200	- Resolving contradictions between prior iteration findings
   201	- Providing a cleaner, more parsimonious model of the research topic
   202	
   203	#### Step 7: Update Research (Progressive)
   204	Read `research/deep-research-config.json` before touching `research/research.md`.
   205	- If `progressiveSynthesis == true`:
   206	  - If `research/research.md` exists, add new findings to relevant sections without removing prior content.
   207	  - If `research/research.md` does not exist yet, create it with initial findings.
   208	- If `progressiveSynthesis == false`:
   209	  - Do not create or update `research/research.md` during the iteration.
   210	  - Leave `research/research.md` ownership to the synthesis phase.
   211	
   212	#### Dashboard Awareness
   213	The orchestrator generates a research dashboard and findings registry after each iteration, summarizing progress, coverage, and convergence trends. The agent does not update those reducer-owned files directly. However, your iteration data (newInfoRatio, status, focus, ruledOut, focusTrack, toolsUsed, sourcesQueried) feeds directly into those synchronized outputs.
   214	
   215	---
   216	
   217	## 2. CAPABILITY SCAN
   218	
   219	### Tools
   220	

exec
/bin/zsh -lc "nl -ba .opencode/agent/deep-review.md | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	weightedTotal = sum(weight for all findings this iteration)
   261	newFindingsRatio = (weightedNew + weightedRefinement) / weightedTotal
   262	```
   263	- If no findings at all, set to 0.0
   264	- **P0 override rule**: If ANY new P0 discovered, set `newFindingsRatio = max(calculated, 0.50)`. A single new P0 blocks convergence.
   265	
   266	---
   267	
   268	## 2. CAPABILITY SCAN
   269	
   270	### Tools
   271	
   272	| Tool | Purpose | Budget |
   273	|------|---------|--------|
   274	| Read | State files, review target code | 3-4 calls |
   275	| Write | Iteration file, JSONL append | 2-3 calls |
   276	| Edit | Strategy update | 1-2 calls |
   277	| Grep | Pattern search in review target | 1-2 calls |
   278	| Glob | File discovery in review scope | 0-1 calls |
   279	| Bash | Analysis commands (wc, structure checks) | 0-1 calls |
   280	
   281	### MCP Tools
   282	
   283	| Tool | Purpose |
   284	|------|---------|
   285	| `memory_search` | Find prior research in memory system |
   286	| `memory_context` | Load context for the review topic |
   287	
   288	### Skills
   289	
   290	| Skill | Purpose |
   291	|-------|---------|
   292	| `sk-code-review` | Shared review doctrine via `references/review_core.md` |
   293	| `sk-code-opencode` / `sk-code-web` / `sk-code-full-stack` | Stack-specific overlay |
   294	
   295	---
   296	
   297	## 3. REVIEW CONTRACT
   298	
   299	This agent loads shared review doctrine from .opencode/skill/sk-code-review/references/review_core.md for severity definitions, evidence requirements, and baseline check families.
   300	
   301	### Review Dimensions
   302	
   303	| Dimension | Use It For |
   304	|-----------|------------|
   305	| **Correctness** | Logic, state transitions, invariants, edge cases, and behavior against observable intent |
   306	| **Security** | Trust boundaries, auth/authz, input handling, secrets exposure, and exploit paths |
   307	| **Traceability** | Spec alignment, checklist evidence, cross-reference integrity, and runtime parity |
   308	| **Maintainability** | Pattern compliance, documentation quality, clarity, and safe follow-on change cost |
   309	
   310	### Binary Quality Gates
   311	
   312	| Gate | Pass Condition |
   313	|------|----------------|
   314	| **Evidence** | Every active finding is backed by concrete `file:line` evidence; no active `P0`/`P1` relies only on inference |
   315	| **Scope** | Findings stay inside the declared review target and review boundaries |
   316	| **Coverage** | Required dimensions and required traceability protocols are covered before STOP is allowed |
   317	
   318	### Verdicts
   319	
   320	| Verdict | Condition | Follow-on |
   321	|---------|-----------|-----------|
   322	| **FAIL** | Active `P0` exists or any binary gate fails | `/spec_kit:plan` |
   323	| **CONDITIONAL** | No active `P0`, but active `P1` remains | `/spec_kit:plan` |
   324	| **PASS** | No active `P0` or `P1`; set `hasAdvisories=true` when active `P2` remains | `/create:changelog` |
   325	
   326	### Budget Profiles
   327	
   328	- `scan`: 9-11 tool calls for standard single-dimension discovery.
   329	- `verify`: 11-13 tool calls when re-reading evidence, traceability protocols, or borderline severity.
   330	- `adjudicate`: 8-10 tool calls for `P0`/`P1` referee work and synthesis-ready confirmation.
   331	
   332	### Lifecycle + Reducer Contract
   333	
   334	The orchestrator may enter this agent through any of these lifecycle modes:
   335	- `resume`: Continue the active review session.
   336	- `restart`: Reset loop state and start a fresh generation for the same target.
   337	- `fork`: Start a child review session from an earlier lineage point.
   338	- `completed-continue`: Re-open a previously completed session for additional review coverage.
   339	
   340	Always treat these config fields as required read-only lineage metadata:
   341	- `sessionId`
   342	- `parentSessionId`
   343	- `lineageMode`
   344	- `generation`
   345	- `continuedFromRun`
   346	- `releaseReadinessState`
   347	
   348	Reducer boundary:
   349	- `review/deep-review-findings-registry.json` is the canonical reducer-owned finding registry.
   350	- This leaf agent may READ the registry for continuity and deduplication context.
   351	- The orchestrator/reducer refreshes the registry after each iteration; do not overwrite it from this agent.
   352	
   353	---
   354	
   355	## 4. STATE MANAGEMENT + WRITE SAFETY
   356	
   357	### File Paths
   358	
   359	All paths are relative to the spec folder provided in dispatch context.
   360	
   361	| File | Path | Operation |
   362	|------|------|-----------|
   363	| Config | `review/deep-review-config.json` | Read only |
   364	| State log | `review/deep-review-state.jsonl` | Read + Append |
   365	| Findings registry | `review/deep-review-findings-registry.json` | Read only |
   366	| Strategy | `review/deep-review-strategy.md` | Read + Edit |
   367	| Iteration findings | `review/iterations/iteration-{NNN}.md` | Write (create new) |
   368	| Pause sentinel | `review/.deep-review-pause` | Read only |
   369	
   370	### Iteration Number Derivation
   371	
   372	```
   373	Count lines in JSONL where type === "iteration"
   374	Current iteration = count + 1
   375	Pad to 3 digits for filename: iteration-001.md, iteration-002.md
   376	```
   377	
   378	### Write Safety
   379	
   380	- JSONL: Always APPEND (never overwrite). Use Write tool to append a single line.
   381	- Strategy: Use Edit tool to modify specific sections (never Write which overwrites).
   382	- Iteration file: Use Write tool to create new file (should not exist yet).
   383	- **CRITICAL: Review target files are READ-ONLY. NEVER edit code under review.**
   384	- Only write to: `review/iterations/iteration-NNN.md`, `review/deep-review-strategy.md`, `review/deep-review-state.jsonl`
   385	
   386	---
   387	
   388	## 5. ADVERSARIAL SELF-CHECK (Tiered)
   389	
   390	Adapted from @review Hunter/Skeptic/Referee protocol.
   391	
   392	### P0 Candidate --> Full 3-Pass (in same iteration BEFORE writing to JSONL)
   393	
   394	**Pass 1 -- HUNTER** (bias: find ALL issues)
   395	- Scoring mindset: +1 minor, +5 moderate, +10 critical finding
   396	- Cast wide net. Include borderline findings. Err on the side of flagging
   397	- Ask: "What could go wrong here? What am I missing?"
   398	
   399	**Pass 2 -- SKEPTIC** (bias: disprove findings)
   400	- Scoring mindset: +score for each disproved finding, -2x penalty for wrong dismissals
   401	- Challenge each Hunter finding: "Is there codebase context making this acceptable?"
   402	- Ask: "Is this a project pattern, not a bug?", "Is severity inflated?", "Am I seeing phantom issues?"
   403	
   404	**Pass 3 -- REFEREE** (neutral judgment)
   405	- Scoring mindset: +1 correct call, -1 wrong call
   406	- Weigh Hunter evidence vs Skeptic challenge for each finding
   407	- Only CONFIRMED findings enter the iteration file
   408	- If unsure: keep the finding but downgrade severity
   409	
   410	### Gate-Relevant P1 --> Compact Skeptic/Referee
   411	
   412	- Run abbreviated skeptic challenge + referee verdict
   413	- Document in finding entry
   414	
   415	### P2 --> No Self-Check
   416	
   417	- Severity too low to warrant overhead
   418	- Document evidence and move on
   419	
   420	### At Synthesis (orchestrator handles)
   421	
   422	- Full recheck on all carried-forward P0/P1 before final report
   423	
   424	**Sycophancy Warning:** If you notice yourself wanting to inflate findings to seem thorough or dismiss issues to avoid conflict -- that is the bias this protocol exists to catch. Trust the evidence, not your inclination.
   425	
   426	---
   427	
   428	## 6. RULES
   429	
   430	### ALWAYS
   431	1. Read state files BEFORE any review action
   432	2. One dimension focus per iteration (unless cross-referencing)
   433	3. Externalize all findings to iteration file (never hold in context)
   434	4. Update strategy after review
   435	5. Report newFindingsRatio + noveltyJustification honestly
   436	6. Cite file:line evidence for every finding
   437	7. Run Hunter/Skeptic/Referee for P0 candidates and emit typed claim-adjudication packets for every new P0/P1
   438	8. Respect exhausted approaches -- never retry them
   439	9. Document ruled-out issues per iteration
   440	10. Review target is READ-ONLY -- never edit code under review
   441	
   442	### NEVER
   443	1. Dispatch sub-agents or use Task tool (LEAF-only)
   444	2. Hold findings in context without writing to files
   445	3. Exceed tool budget (max 13 calls)
   446	4. Ask the user questions (autonomous execution)
   447	5. Skip convergence evaluation data (newFindingsRatio, noveltyJustification)
   448	6. Modify config after init (read-only)
   449	7. Edit review target files
   450	8. Fabricate findings or inflate severity (phantom issues)
   451	9. Overwrite deep-review-state.jsonl (append-only)
   452	10. Skip writing the iteration file
   453	
   454	### ESCALATE
   455	1. When P0 found that could cause immediate harm
   456	2. When findings contradict prior iteration conclusions
   457	3. When review scope appears insufficient for the review target
   458	4. If state files are missing or corrupted, report error status
   459	5. If tool failures prevent any review, report timeout status
   460	
   461	---
   462	
   463	## 7. OUTPUT VERIFICATION
   464	
   465	### Iron Law
   466	
   467	**NEVER claim completion without verifiable evidence.** Every output assertion must be backed by a file existence check, content verification, or tool call result.
   468	
   469	### Pre-Delivery Checklist
   470	
   471	Before returning the completion report, verify:
   472	
   473	```
   474	REVIEW ITERATION VERIFICATION:
   475	[x] State files read at start (JSONL + findings registry + strategy + config)
   476	[x] Focus determined from strategy or unchecked dimensions
   477	[x] Review actions executed (3-5 actions minimum)
   478	[x] All findings cite file:line evidence
   479	[x] Hunter/Skeptic/Referee run on P0 candidates
   480	[x] New P0/P1 findings include typed claim-adjudication packets
   481	[x] review/iterations/iteration-NNN.md created with all sections
   482	[x] review/deep-review-strategy.md updated (dimensions, findings, next focus)
   483	[x] deep-review-state.jsonl appended with exactly ONE record
   484	[x] Config lineage fields respected as read-only session contract
   485	[x] Findings registry treated as reducer-owned canonical state
   486	[x] traceabilityChecks recorded when protocol evidence was reviewed
   487	[x] newFindingsRatio calculated honestly with justification
   488	[x] Exhausted approaches checked before choosing focus
   489	[x] Review target files NOT modified (read-only compliance)
   490	[x] No sub-agents dispatched (LEAF compliance)
   491	```
   492	
   493	If ANY item fails, fix it before returning. If unfixable, report the specific failure in the completion report with status "error".
   494	
   495	### Iteration Completion Report
   496	
   497	Return this summary to the dispatcher after completing the iteration:
   498	
   499	```markdown
   500	## Review Iteration [N] Complete
   501	
   502	**Focus**: [Dimension - specific area reviewed]
   503	**Findings**: [N] findings (P0: [X], P1: [Y], P2: [Z])
   504	**newFindingsRatio**: [0.XX]
   505	**Dimensions completed**: [list]
   506	**Dimensions remaining**: [list]
   507	**Recommended next focus**: [recommendation]
   508	
   509	**Files written**:
   510	- review/iterations/iteration-[NNN].md
   511	- review/deep-review-state.jsonl (appended)
   512	- review/deep-review-strategy.md (updated)
   513	
   514	**Status**: [complete | timeout | error | stuck | insight | thought]
   515	```
   516	
   517	---
   518	
   519	## 8. ANTI-PATTERNS
   520	

exec
/bin/zsh -lc "nl -ba .opencode/agent/deep-review.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	name: deep-review
     3	description: "LEAF review agent for sk-deep-review. Performs single review iteration: reads state, reviews one dimension with P0/P1/P2 findings, updates strategy and JSONL."
     4	mode: subagent
     5	temperature: 0.1
     6	permission:
     7	  read: allow
     8	  write: allow
     9	  edit: allow
    10	  bash: allow
    11	  grep: allow
    12	  glob: allow
    13	  webfetch: deny
    14	  memory: allow
    15	  chrome_devtools: deny
    16	  task: deny
    17	  list: allow
    18	  patch: deny
    19	---
    20	
    21	# The Deep Reviewer: Iterative Code Quality Agent
    22	
    23	Executes ONE review iteration within an autonomous review loop. Reads externalized state, reviews code quality across one dimension, produces P0/P1/P2 findings with file:line evidence, and updates state for the next iteration.
    24	
    25	**Path Convention**: Use only `.opencode/agent/*.md` as the canonical runtime path reference.
    26	
    27	**CRITICAL**: This agent executes a SINGLE review iteration, not the full loop. The loop is managed by the `/spec_kit:deep-review` command's YAML workflow. This agent is dispatched once per iteration with explicit context about what dimension to review.
    28	
    29	**IMPORTANT**: This agent is a hybrid of @review (quality rubric, severity classification, adversarial self-check) and the deep-review loop contract (state protocol, JSONL, lifecycle continuity). It reviews code but does NOT modify it.
    30	
    31	> **SPEC FOLDER PERMISSION:** @deep-review may write only `review/` artifacts inside the active spec folder (iteration artifacts, strategy, JSONL, dashboard, report). Review target files are strictly READ-ONLY, and writes outside `review/` are not part of this agent contract.
    32	
    33	---
    34	
    35	## 0. ILLEGAL NESTING (HARD BLOCK)
    36	
    37	This agent is LEAF-only. Nested sub-agent dispatch is illegal.
    38	- NEVER create sub-tasks or dispatch sub-agents.
    39	- NEVER use the Task tool.
    40	- If a review question requires delegation, document it in findings and recommend it for a future iteration.
    41	- All review actions must be self-contained within this single execution.
    42	
    43	---
    44	
    45	## 1. CORE WORKFLOW -- Single Review Iteration
    46	
    47	Every iteration follows this exact sequence:
    48	
    49	```
    50	1. READ STATE ──────> Read JSONL + strategy + config
    51	2. DETERMINE FOCUS ─> Select dimension from strategy "Next Focus"
    52	3. EXECUTE REVIEW ──> 3-5 analysis actions (Read, Grep, Glob, Bash)
    53	4. CLASSIFY FINDINGS > Assign P0/P1/P2 with file:line evidence
    54	5. WRITE FINDINGS ──> Create review/iterations/iteration-NNN.md
    55	6. UPDATE STRATEGY ─> Edit review/deep-review-strategy.md sections
    56	7. APPEND JSONL ────> Add ONE iteration record
    57	```
    58	
    59	### Step-by-Step Detail
    60	
    61	#### Step 1: Read State
    62	Read these files (paths provided in dispatch context):
    63	- `review/deep-review-state.jsonl` -- Understand iteration history
    64	- `review/deep-review-findings-registry.json` -- Read reducer-owned active finding state (read-only for this agent)
    65	- `review/deep-review-strategy.md` -- Understand what dimensions to review
    66	- `review/deep-review-config.json` -- Read review configuration, lineage metadata, and release readiness state (read-only)
    67	
    68	Extract from state:
    69	- Current iteration number (count JSONL iteration records + 1)
    70	- Dimensions completed vs remaining
    71	- Prior findings (P0/P1/P2 counts)
    72	- Exhausted approaches (DO NOT retry these)
    73	- Recommended next focus
    74	- Stuck count
    75	
    76	#### Step 2: Determine Focus
    77	
    78	**MANDATORY PRE-CHECK**: Before choosing a focus, read strategy.md "Exhausted Approaches" section:
    79	- Any category marked `BLOCKED` -- NEVER retry these approaches or any variation of them
    80	- Any category marked `PRODUCTIVE` -- PREFER these for related questions
    81	- If the chosen focus falls within a BLOCKED category, select an alternative
    82	
    83	Use strategy.md "Next Focus" section to determine which dimension and specific area to review.
    84	
    85	If "Next Focus" is empty or vague:
    86	- Pick the first unchecked dimension from "Review Dimensions"
    87	- If no dimensions remain, perform cross-reference analysis across completed dimensions
    88	
    89	If this is a RECOVERY iteration (indicated in dispatch context):
    90	- Use a fundamentally different approach than prior iterations
    91	- Change granularity (file to function to line level)
    92	- Switch from single-dimension to cross-reference analysis
    93	- Escalate severity review of existing P2 findings
    94	
    95	#### Step 3: Execute Review
    96	Perform 3-5 analysis actions using available tools:
    97	
    98	| Tool | When to Use | Example |
    99	|------|------------|---------|
   100	| Read | Examine target files for quality issues | Read implementation details |
   101	| Grep | Find patterns indicating issues | Search for auth patterns, error handling |
   102	| Glob | Discover files within review scope | Find config files, test files |
   103	| Bash | Run analysis commands | `wc -l`, file structure checks |
   104	| memory_search | Check prior research findings | Find related spec folder work |
   105	
   106	**Dimension-specific review strategies:**
   107	- **Correctness**: Read logic flows, grep for error handling patterns, and test edge cases against observable intent.
   108	- **Security**: Grep for auth patterns, input validation, data exposure, and sensitive state transitions.
   109	- **Traceability**: Cross-reference spec/checklist/runtime claims against shipped files and linked artifacts.
   110	- **Maintainability**: Read for pattern drift, documentation clarity, and ease of safe follow-on changes.
   111	
   112	**Budget**: Choose a budget profile before starting review actions: `scan` (9-11 calls), `verify` (11-13 calls), or `adjudicate` (8-10 calls). If approaching the profile ceiling, prioritize writing findings over additional analysis.
   113	
   114	**Quality Rule**: Every finding must cite a source:
   115	- `[SOURCE: path/to/file:line]` for codebase evidence
   116	- `[SOURCE: spec/checklist reference]` for spec alignment checks
   117	- `[INFERENCE: based on X and Y]` when deriving from multiple sources
   118	
   119	#### Step 4: Classify Findings
   120	Before assigning severity, load `.opencode/skill/sk-code-review/references/review_core.md`.
   121	
   122	Use the shared `P0` / `P1` / `P2` definitions and evidence requirements from `review_core.md`, then tag each finding with one primary review dimension: `correctness`, `security`, `traceability`, or `maintainability`.
   123	
   124	Every new `P0` or `P1` finding MUST include a typed claim-adjudication packet in the iteration artifact:
   125	
   126	```json
   127	{
   128	  "type": "claim-adjudication",
   129	  "claim": "One-sentence statement of the finding being adjudicated.",
   130	  "evidenceRefs": ["path/to/file:line"],
   131	  "counterevidenceSought": "What contradictory evidence was checked before confirming the finding.",
   132	  "alternativeExplanation": "Plausible non-bug explanation that was considered and rejected or retained.",
   133	  "finalSeverity": "P0|P1",
   134	  "confidence": 0.90,
   135	  "downgradeTrigger": "What evidence would justify downgrading or dismissing this finding."
   136	}
   137	```
   138	
   139	**Adversarial self-check (tiered):**
   140	- **P0 candidate** --> Run full Hunter/Skeptic/Referee in THIS iteration BEFORE writing to JSONL
   141	- **Gate-relevant P1** --> Run compact skeptic/referee pass in-iteration
   142	- **P2** --> No self-check needed (severity too low to warrant overhead)
   143	
   144	#### Step 5: Write Findings
   145	Create `review/iterations/iteration-NNN.md` with this structure:
   146	
   147	```markdown
   148	# Review Iteration [N]: [Dimension] - [Focus Area]
   149	
   150	## Focus
   151	[What dimension and specific area was reviewed]
   152	
   153	## Scope
   154	- Review target: [files reviewed]
   155	- Spec refs: [if applicable]
   156	- Dimension: [dimension name]
   157	
   158	## Scorecard
   159	| File | Corr | Sec | Trace | Maint |
   160	|------|------|-----|-------|-------|
   161	[per-file scores for files reviewed this iteration]
   162	
   163	## Findings
   164	### P0-NNN: [Title]
   165	- Dimension: [dimension]
   166	- Evidence: [SOURCE: file:line]
   167	- Cross-reference: [SOURCE: spec/checklist if applicable]
   168	- Impact: [description]
   169	- Hunter: [finding assessment]
   170	- Skeptic: [challenge]
   171	- Referee: [verdict]
   172	- Final severity: P0
   173	
   174	### P1-NNN: [Title]
   175	- Dimension: [dimension]
   176	- Evidence: [SOURCE: file:line]
   177	- Impact: [description]
   178	- Skeptic: [challenge]
   179	- Referee: [verdict]
   180	- Final severity: P1
   181	
   182	```json
   183	{"type":"claim-adjudication","claim":"One-sentence statement of the P0/P1 finding being adjudicated.","evidenceRefs":["path/to/file:line"],"counterevidenceSought":"Adjacent code, docs, and prior iterations checked for contradictory evidence.","alternativeExplanation":"Most plausible non-bug explanation considered during skeptic/referee review.","finalSeverity":"P0|P1","confidence":0.90,"downgradeTrigger":"What evidence would justify reducing severity or marking this a false positive."}
   184	```
   185	
   186	### P2-NNN: [Title]
   187	- Dimension: [dimension]
   188	- Evidence: [SOURCE: file:line]
   189	- Impact: [description]
   190	- Final severity: P2
   191	
   192	## Cross-Reference Results
   193	### Core Protocols
   194	- Confirmed: [alignment checks that passed]
   195	- Contradictions: [misalignments found]
   196	- Unknowns: [could not verify]
   197	
   198	### Overlay Protocols
   199	- Confirmed: [overlay-specific checks that passed]
   200	- Contradictions: [runtime or integration drift found]
   201	- Unknowns: [could not verify]
   202	
   203	## Ruled Out
   204	[Investigated but not an issue, with reasoning]
   205	
   206	## Sources Reviewed
   207	[All files read this iteration with SOURCE: file:line]
   208	
   209	## Assessment
   210	- Confirmed findings: [N]
   211	- New findings ratio: [0.XX]
   212	- noveltyJustification: [1 sentence]
   213	- Dimensions addressed: [list]
   214	
   215	## Reflection
   216	- What worked: [effective approach]
   217	- What did not work: [ineffective approach]
   218	- Next adjustment: [suggestion for next iteration]
   219	```
   220	
   221	#### Step 6: Update Strategy
   222	Edit `review/deep-review-strategy.md`:
   223	
   224	1. Mark dimension as reviewed if covered (move from "Review Dimensions" to "Completed Dimensions" with score)
   225	2. Update "Running Findings" counts (P0/P1/P2 totals)
   226	3. Add new entries to "What Worked" with iteration number
   227	4. Add new entries to "What Failed" with iteration number
   228	5. If an approach is fully exhausted, move it to "Exhausted Approaches"
   229	6. Set "Next Focus" for next iteration
   230	
   231	#### Step 7: Append JSONL
   232	Append ONE line to `review/deep-review-state.jsonl`:
   233	
   234	```json
   235	{"type":"iteration","mode":"review","run":N,"status":"complete","focus":"[dimension - specific area]","dimension":"[dimension name]","dimensions":["[dimension name]"],"findingsCount":N,"newFindingsRatio":0.XX,"noveltyJustification":"...","findingsSummary":{"P0":N,"P1":N,"P2":N},"filesReviewed":["file1","file2"],"dimensionScores":{"correctness":N,"security":N,"traceability":N,"maintainability":N},"findingsNew":{"P0":N,"P1":N,"P2":N},"findingsRefined":{"P0":N,"P1":N,"P2":N},"upgrades":[],"resolved":[],"findingRefs":["P1-001","P2-003"],"traceabilityChecks":{"summary":{"required":N,"executed":N,"pass":N,"partial":N,"fail":N,"blocked":N,"notApplicable":N,"gatingFailures":N},"results":[{"protocolId":"spec_code","status":"pass|partial|fail","gateClass":"hard|advisory","applicable":true,"counts":{"pass":N,"partial":N,"fail":N},"evidence":["path/to/file:line"],"findingRefs":["P1-001"],"summary":"One-line traceability result."}]},"coverage":{"filesReviewed":N,"filesTotal":N,"dimensionsComplete":[]},"ruledOut":["investigated-not-issue"],"focusTrack":"optional","timestamp":"ISO-8601","durationMs":NNNNN}
   236	```
   237	
   238	**Status values**: `complete | timeout | error | stuck | insight | thought`
   239	- `complete`: Normal iteration with evidence gathering and findings
   240	- `timeout`: Iteration exceeded time/tool budget before finishing
   241	- `error`: Unrecoverable failure during iteration
   242	- `stuck`: No productive review avenues remain for current focus
   243	- `insight`: Low newFindingsRatio but important conceptual finding (e.g., cross-reference contradiction)
   244	- `thought`: Analytical-only iteration (e.g., severity reassessment, deduplication)
   245	
   246	**Required fields**:
   247	- `noveltyJustification`: 1-sentence explanation of how newFindingsRatio was calculated
   248	- `ruledOut`: Array of items investigated but not an issue this iteration (may be empty `[]`)
   249	
   250	**Optional fields**:
   251	- `focusTrack`: Label tagging this iteration to a review track (e.g., "security", "correctness")
   252	
   253	> **Note:** The orchestrator enriches each iteration record with optional `segment` (default: 1) and `convergenceSignals` fields after the agent writes it. The agent does not write these fields.
   254	
   255	**newFindingsRatio calculation (severity-weighted)**:
   256	```
   257	SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 }
   258	weightedNew = sum(weight for each fully new finding)
   259	weightedRefinement = sum(weight * 0.5 for each refinement finding)
   260	weightedTotal = sum(weight for all findings this iteration)

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Tasks: Deep Research and Deep Review Runtime Improvement Bundle [042]"
     3	description: "Task Format: T### [P?] Description (file path)"
     4	trigger_phrases:
     5	  - "042"
     6	  - "tasks"
     7	  - "deep research"
     8	  - "deep review"
     9	  - "runtime improvement"
    10	importance_tier: "important"
    11	contextType: "planning"
    12	---
    13	# Tasks: Deep Research and Deep Review Runtime Improvement Bundle
    14	
    15	<!-- SPECKIT_LEVEL: 3 -->
    16	<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
    17	
    18	---
    19	
    20	<!-- ANCHOR:notation -->
    21	## Task Notation
    22	
    23	| Prefix | Meaning |
    24	|--------|---------|
    25	| `[ ]` | Pending |
    26	| `[x]` | Completed |
    27	| `[P]` | Parallelizable |
    28	| `[B]` | Blocked |
    29	
    30	**Task Format**: `T### [P?] Description (file path)`
    31	<!-- /ANCHOR:notation -->
    32	
    33	---
    34	
    35	### AI Execution Protocol
    36	
    37	### Pre-Task Checklist
    38	- Confirm the target requirement and packet phase before editing.
    39	- Confirm the exact files in scope for the task.
    40	- Confirm the behavior or parity check that will prove the task is complete.
    41	
    42	### Execution Rules
    43	
    44	| Rule | Requirement |
    45	|------|-------------|
    46	| `REQ-LINKED` | Every task must map to at least one packet requirement. |
    47	| `FILES-EXPLICIT` | Every task must name its concrete file targets before implementation starts. |
    48	| `OPT-IN-LAST` | Council and coordination-board tasks stay behind the foundational runtime work. |
    49	| `VERIFY-WITH-TESTS` | Behavior/parity/reducer tests are the closeout gate for implementation tasks. |
    50	
    51	### Status Reporting Format
    52	- `pending`: task has not started and still matches the current packet scope.
    53	- `in-progress`: active implementation or validation work is underway.
    54	- `blocked`: task is waiting on a prerequisite contract or failing verification.
    55	- `completed`: implementation and listed verification steps are done.
    56	
    57	### Blocked Task Protocol
    58	- If a task depends on an unresolved stop/done/resume contract, mark it blocked instead of starting partial implementation.
    59	- If parity or behavior tests fail, keep the task open until the failing contract is reconciled.
    60	- If scope expands beyond the packet, split follow-on work into a separate packet instead of widening the task silently.
    61	
    62	---
    63	
    64	<!-- ANCHOR:phase-1 -->
    65	## Phase 1: Setup
    66	
    67	### Phase 1: Runtime Foundation
    68	
    69	| Task ID | Status | Parent REQ | Files |
    70	|---------|--------|------------|-------|
    71	| T001 | Pending | REQ-001 | `.opencode/skill/sk-deep-research/SKILL.md`; `.opencode/skill/sk-deep-research/references/convergence.md`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
    72	| T002 | Pending | REQ-001 | `.opencode/skill/sk-deep-review/SKILL.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/skill/sk-deep-review/references/convergence.md`; `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
    73	| T003 | Pending | REQ-002, REQ-014 | `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-research/references/convergence.md`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
    74	| T004 | Pending | REQ-002, REQ-014 | `.opencode/skill/sk-deep-review/references/loop_protocol.md`; `.opencode/skill/sk-deep-review/references/convergence.md`; `.opencode/command/spec_kit/deep-review.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
    75	| T005 | Pending | REQ-003 | `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
    76	| T006 | Pending | REQ-003 | `.opencode/skill/sk-deep-review/assets/deep_review_config.json`; `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/command/spec_kit/deep-review.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
    77	
    78	- [ ] T001 Define the shared stop-reason taxonomy for deep research.
    79	- [ ] T002 Define the shared stop-reason taxonomy for deep review.
    80	- [ ] T003 Add the legal done-gate model to deep research.
    81	- [ ] T004 Add the legal done-gate model to deep review.
    82	- [ ] T005 Add resume/start-from-run semantics to deep research.
    83	- [ ] T006 Add resume/start-from-run semantics to deep review.
    84	<!-- /ANCHOR:phase-1 -->
    85	
    86	---
    87	
    88	<!-- ANCHOR:phase-2 -->
    89	## Phase 2: Implementation
    90	
    91	Delivery order inside this template section remains `Phase 2a -> Phase 2b -> Phase 4 -> Phase 5`, while `Phase 3` stays in the verification section below for template compliance.
    92	
    93	### Phase 2a: State and Observability Substrate
    94	
    95	| Task ID | Status | Parent REQ | Files |
    96	|---------|--------|------------|-------|
    97	| T007 | Pending | REQ-004 | `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/agent/deep-research.md` |
    98	| T008 | Pending | REQ-004 | `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`; `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/agent/deep-review.md` |
    99	| T010 | Pending | REQ-007 | `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
   100	| T011 | Pending | REQ-007 | `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
   101	| T025 | Pending | REQ-015 | `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
   102	| T026 | Pending | REQ-015 | `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
   103	| T027 | Pending | REQ-016 | `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
   104	| T028 | Pending | REQ-016 | `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
   105	| T029 | Pending | REQ-017 | `.opencode/skill/sk-deep-review/references/loop_protocol.md`; `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/agent/deep-review.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |
   106	| T030 | Pending | REQ-017 | `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/agent/deep-research.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` |
   107	
   108	- [ ] T007 Add the deep-research audit journal and journal-aware rollups.
   109	- [ ] T008 Add the deep-review audit journal and journal-aware rollups.
   110	- [ ] T010 Extend the deep-research dashboard and reducer metrics.
   111	- [ ] T011 Extend the deep-review dashboard and contract metrics.
   112	- [ ] T025 Implement reducer snapshot/compaction for deep research.
   113	- [ ] T026 Implement reducer snapshot/compaction for deep review.
   114	- [ ] T027 Add observability surfaces to deep-research dashboards and reducer.
   115	- [ ] T028 Add observability surfaces to deep-review dashboards and reducer.
   116	- [ ] T029 Add large-target decomposition to deep review with inventory and hotspot ranking.
   117	- [ ] T030 Add domain clustering to deep research for large source sets.
   118	<!-- /ANCHOR:phase-2 -->
   119	
   120	---
   121	
   122	### Phase 2b: Trust Surfaces, Ledgers, and Critique
   123	
   124	| Task ID | Status | Parent REQ | Files |
   125	|---------|--------|------------|-------|
   126	| T009 | Pending | REQ-005 | `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/agent/deep-research.md` |
   127	| T012 | Pending | REQ-008, REQ-009 | `.opencode/skill/sk-deep-research/SKILL.md`; `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/agent/deep-research.md` |
   128	| T031 | Pending | REQ-018 | `.opencode/skill/sk-deep-research/references/convergence.md`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
   129	| T032 | Pending | REQ-018 | `.opencode/skill/sk-deep-review/references/convergence.md`; `.opencode/skill/sk-deep-review/references/state_format.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
   130	| T033 | Pending | REQ-019 | `.opencode/skill/sk-deep-review/SKILL.md`; `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/agent/deep-review.md`; `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts` |
   131	
   132	- [ ] T009 Add the deep-research claim-verification ledger contract and synthesis references.
   133	- [ ] T012 Add publication critique, runtime inventory, and promotion-checkpoint sections to deep research.
   134	- [ ] T031 Add semantic novelty and contradiction-graph convergence signals to deep research.
   135	- [ ] T032 Add semantic novelty convergence signals to deep review.
   136	- [ ] T033 Make deep-review machine-owned strategy sections reducer-owned.
   137	
   138	---
   139	
   140	<!-- ANCHOR:phase-3 -->
   141	## Phase 3: Verification
   142	
   143	### Phase 3: Behavior-First Verification
   144	
   145	| Task ID | Status | Parent REQ | Files |
   146	|---------|--------|------------|-------|
   147	| T017 | Pending | REQ-006 | `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts` |
   148	| T018 | Pending | REQ-006 | `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` |
   149	| T019 | Pending | REQ-006, REQ-015, REQ-016, REQ-018 | `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` |
   150	| T020 | Pending | REQ-006, REQ-015, REQ-016, REQ-019 | `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts`; `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`; `.opencode/skill/sk-deep-review/assets/deep_review_config.json` |
   151	| T034 | Pending | REQ-006 | `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/028/`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/040/`; `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/042/`; `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` |
   152	
   153	- [ ] T017 Create deep-research behavior-first tests.
   154	- [ ] T018 Create deep-review behavior-first tests.
   155	- [ ] T019 Extend deep-research reducer tests for journal, snapshot, semantic-convergence, and dashboard-observability behavior.
   156	- [ ] T020 Extend deep-review reducer/schema tests for stop reasons, snapshots, observability metrics, reducer-owned sections, and resume cursor fields.
   157	- [ ] T034 Create replay corpus from existing packet families `028`, `040`, and `042`.
   158	
   159	---
   160	
   161	### Phase 4: Parity and Mirror Alignment
   162	
   163	| Task ID | Status | Parent REQ | Files |
   164	|---------|--------|------------|-------|
   165	| T013 | Pending | REQ-012 | `.opencode/command/spec_kit/deep-research.md`; `.opencode/skill/sk-deep-research/references/quick_reference.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |
   166	| T014 | Pending | REQ-012 | `.opencode/command/spec_kit/deep-review.md`; `.opencode/skill/sk-deep-review/references/quick_reference.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
   167	| T015 | Pending | REQ-013 | `.opencode/agent/deep-research.md`; `.claude/agents/deep-research.md`; `.gemini/agents/deep-research.md`; `.codex/agents/deep-research.toml`; `.agents/agents/deep-research.md` |
   168	| T016 | Pending | REQ-013 | `.opencode/agent/deep-review.md`; `.claude/agents/deep-review.md`; `.gemini/agents/deep-review.md`; `.codex/agents/deep-review.toml` |
   169	| T021 | Pending | REQ-013 | `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` |
   170	
   171	- [ ] T013 Update deep-research command docs and quick-reference surfaces.
   172	- [ ] T014 Update deep-review command docs and quick-reference surfaces.
   173	- [ ] T015 Update canonical deep-research contracts and runtime mirrors to preserve parity.
   174	- [ ] T016 Update canonical deep-review contracts and runtime mirrors to preserve parity.
   175	- [ ] T021 Extend deep-research and deep-review contract parity tests for the new artifact paths and lifecycle fields.
   176	
   177	---
   178	
   179	### Phase 5: Optional Advanced Modes
   180	
   181	| Task ID | Status | Parent REQ | Files |
   182	|---------|--------|------------|-------|
   183	| T022 | Pending | REQ-010 | `.opencode/skill/sk-deep-research/SKILL.md`; `.opencode/skill/sk-deep-research/references/loop_protocol.md`; `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_config.json`; `.opencode/command/spec_kit/deep-research.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`; `.opencode/agent/deep-research.md` |
   184	| T023 | Pending | REQ-011 | `.opencode/skill/sk-deep-research/references/state_format.md`; `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`; `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` |
   185	| T024 | Pending | REQ-010, REQ-011 | `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts`; `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` |
   186	
   187	- [ ] T022 Add council-style synthesis as an explicit opt-in deep-research profile.
   188	- [ ] T023 Add the packet-local coordination-board artifact for large multi-phase research.
   189	- [ ] T024 Add behavior/parity coverage proving that council mode and coordination-board mode remain optional.
   190	
   191	<!-- /ANCHOR:phase-3 -->
   192	
   193	---
   194	
   195	<!-- ANCHOR:completion -->
   196	## Completion Criteria
   197	
   198	- [ ] Every task remains mapped to a parent requirement and concrete file set
   199	- [ ] No task is left without a verification path
   200	- [ ] Behavior/replay harness work begins once Phase 1 contracts are stable and stays ahead of parity lock
   201	- [ ] Optional advanced-mode work remains sequenced after foundational runtime truth, substrate hardening, and parity lock
   202	<!-- /ANCHOR:completion -->
   203	
   204	---
   205	
   206	<!-- ANCHOR:cross-refs -->
   207	## Cross-References
   208	
   209	- **Specification**: See `spec.md`
   210	- **Implementation Plan**: See `plan.md`
   211	- **Verification Checklist**: See `checklist.md`
   212	- **Decision Record**: See `decision-record.md`
   213	<!-- /ANCHOR:cross-refs -->

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md | sed -n '30,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    30	| **Testing** | Vitest contract/reducer/behavior suites plus strict packet validation |
    31	
    32	### Overview
    33	
    34	This implementation plan ships the deep-loop improvements in five phases. The sequence now incorporates the new research-driven gaps around snapshot/compaction durability, packet-local observability, large-target decomposition, semantic convergence, and deep-review reducer ownership. Phase 2 is split into `2a` and `2b`, while behavior/replay verification moves forward so it can protect contract work soon after the shared runtime foundation lands.
    35	
    36	The ordering is deliberate. Optional orchestration features should not land until the core loop substrate is easier to trust, recover, and verify. This follows the consolidated report's themes around runtime truth, shared loop mechanics, and extension-layer discipline.
    37	
    38	<!-- /ANCHOR:summary -->
    39	---
    40	
    41	<!-- ANCHOR:quality-gates -->
    42	## 2. QUALITY GATES
    43	
    44	### Definition of Ready
    45	
    46	- [x] The eight scoped improvements are fixed by this packet and traceable to consolidated research findings.
    47	- [x] Canonical deep-loop assets, YAML workflows, agents, reducer/test surfaces, and templates have been inventoried in `spec.md`.
    48	- [x] Optional features are separated from foundational runtime work.
    49	- [x] No implementation work is mixed into this planning packet.
    50	- [x] The five newly identified research gaps and the phase-order changes are mapped into packet requirements, tasks, and ADR coverage.
    51	
    52	### Definition of Done
    53	
    54	- [ ] Stop-reason taxonomy and legal done-gate design are applied consistently to both deep-loop products.
    55	- [ ] Resume/start-from-run semantics are documented across commands, workflows, state contracts, and agents.
    56	- [ ] Journals, dashboards, observability surfaces, and claim-ledger artifacts are defined and behavior-tested where applicable.
    57	- [ ] Snapshot/compaction, replay validation, and large-target decomposition rules are designed before optional advanced modes begin.
    58	- [ ] Semantic convergence and reducer-owned machine-section boundaries are documented across both loop products.
    59	- [ ] Research-quality add-ons are designed without bloating default execution.
    60	- [ ] Council synthesis and coordination-board features remain explicit opt-ins.
    61	- [ ] Contract, reducer, and behavior test plans are updated with concrete file-level targets.
    62	
    63	<!-- /ANCHOR:quality-gates -->
    64	---
    65	
    66	<!-- ANCHOR:architecture -->
    67	## 3. ARCHITECTURE
    68	
    69	### Pattern
    70	
    71	Shared loop-runtime hardening with explicit product overlays.
    72	
    73	### Key Components
    74	
    75	- **Command layer**: `.opencode/command/spec_kit/deep-research.md` and `.opencode/command/spec_kit/deep-review.md`
    76	- **Workflow layer**: auto/confirm YAML assets for deep research and deep review
    77	- **Skill layer**: current contracts, references, config/strategy/dashboard assets
    78	- **Agent layer**: canonical `.opencode/agent/` deep-loop workers plus parity mirrors if still hand-authored
    79	- **Runtime substrate**: reducer logic and state contracts
    80	- **Verification layer**: reducer, parity, and new behavior-first Vitest suites
    81	
    82	### Data Flow
    83	
    84	```text
    85	Phase 1 foundation
    86	  -> define typed stop-decision events, legal done gates, resume cursor, and replayable lineage schema
    87	
    88	Phase 2a state/observability substrate
    89	  -> add journals, snapshot/compaction, reducer durability, observability rollups, and decomposition scaffolding
    90	
    91	Phase 2b trust surfaces
    92	  -> add claim ledger, publication critique, promotion checkpoints, semantic convergence, and reducer-owned review machine sections
    93	
    94	Phase 3 behavior-first verification
    95	  -> add replay corpus, thin end-to-end harnesses, reducer/schema extensions, and integration fixtures early
    96	
    97	Phase 4 parity and mirror alignment
    98	  -> sync operator docs, canonical assets, and runtime mirrors against the hardened/tested contracts
    99	
   100	Phase 5 optional advanced modes
   101	  -> council synthesis profile
   102	  -> packet-level coordination board
   103	```
   104	
   105	<!-- /ANCHOR:architecture -->
   106	---
   107	
   108	<!-- ANCHOR:phases -->
   109	## 4. IMPLEMENTATION PHASES
   110	
   111	### Phase 1: Runtime Foundation
   112	
   113	**Scope**: REQ-001, REQ-002, REQ-003, REQ-014 plus the shared event-schema scaffolding consumed by REQ-015, REQ-016, REQ-018, and REQ-019
   114	
   115	**Why first**: Every later improvement depends on a trusted answer to four questions: why did the loop stop, was STOP legal, where can a session resume, and can the stop decision be replayed from packet-local state.
   116	
   117	**Files to change**:
   118	- `.opencode/skill/sk-deep-research/SKILL.md`
   119	- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
   120	- `.opencode/skill/sk-deep-research/references/convergence.md`
   121	- `.opencode/skill/sk-deep-research/references/state_format.md`
   122	- `.opencode/skill/sk-deep-research/assets/deep_research_config.json`
   123	- `.opencode/skill/sk-deep-review/SKILL.md`
   124	- `.opencode/skill/sk-deep-review/references/loop_protocol.md`
   125	- `.opencode/skill/sk-deep-review/references/convergence.md`
   126	- `.opencode/skill/sk-deep-review/references/state_format.md`
   127	- `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`
   128	- `.opencode/skill/sk-deep-review/assets/deep_review_config.json`
   129	- `.opencode/command/spec_kit/deep-research.md`
   130	- `.opencode/command/spec_kit/deep-review.md`
   131	- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
   132	- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
   133	- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
   134	- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
   135	- `.opencode/agent/deep-research.md`
   136	- `.opencode/agent/deep-review.md`
   137	
   138	**Estimated complexity**: High
   139	
   140	**Verification strategy**:
   141	- Define typed event records with `schemaVersion`, `stopReason`, `blockedBy`, and `recoveryStrategy` before adding richer reducers or dashboards.
   142	- Add fixture-based cases that prove blocked-stop behavior and replayable stop-decision logging when convergence math passes but quality gates fail.
   143	- Verify auto and confirm YAML parity for both loops at the event-schema boundary.
   144	
   145	### Phase 2a: State and Observability Substrate
   146	
   147	**Scope**: REQ-004, REQ-007, REQ-015, REQ-016, REQ-017
   148	
   149	**Why second**: Journals, compaction, observability, and large-target decomposition all build on the Phase 1 event schema and need to exist before trust surfaces or optional modes can be trusted at scale.
   150	
   151	**Files to change**:
   152	- `.opencode/skill/sk-deep-research/references/state_format.md`
   153	- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
   154	- `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`
   155	- `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`
   156	- `.opencode/skill/sk-deep-research/assets/deep_research_config.json`
   157	- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
   158	- `.opencode/skill/sk-deep-review/references/state_format.md`
   159	- `.opencode/skill/sk-deep-review/references/loop_protocol.md`
   160	- `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`
   161	- `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`
   162	- `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`
   163	- `.opencode/skill/sk-deep-review/assets/deep_review_config.json`
   164	- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
   165	- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
   166	- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
   167	- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
   168	- `.opencode/agent/deep-research.md`
   169	- `.opencode/agent/deep-review.md`
   170	
   171	**Estimated complexity**: High
   172	
   173	**Verification strategy**:
   174	- Reducer fixtures prove append-only journal rollups, delta replay, snapshot/compaction equivalence, and dashboard regeneration remain idempotent.
   175	- Dashboard and schema tests assert timing/tool/token histograms, state diffs, anomaly flags, stop-decision drill-down, and decomposition metadata.
   176	- Large-target fixtures cover review inventory plus hotspot ranking and research domain clustering without changing the small-packet default path.
   177	
   178	### Phase 2b: Trust Surfaces, Ledgers, and Critique
   179	
   180	**Scope**: REQ-005, REQ-008, REQ-009, REQ-018, REQ-019
   181	
   182	**Why third**: Once the substrate is durable and observable, we can safely layer the trust surfaces that decide what evidence is promoted, what convergence means semantically, and which sections stay machine-owned.
   183	
   184	**Files to change**:
   185	- `.opencode/skill/sk-deep-research/SKILL.md`
   186	- `.opencode/skill/sk-deep-research/references/convergence.md`
   187	- `.opencode/skill/sk-deep-research/references/state_format.md`
   188	- `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md`
   189	- `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md`
   190	- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
   191	- `.opencode/skill/sk-deep-review/SKILL.md`
   192	- `.opencode/skill/sk-deep-review/references/convergence.md`
   193	- `.opencode/skill/sk-deep-review/references/state_format.md`
   194	- `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`
   195	- `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md`
   196	- `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml`
   197	- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
   198	- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
   199	- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
   200	- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
   201	- `.opencode/agent/deep-research.md`
   202	- `.opencode/agent/deep-review.md`
   203	
   204	**Estimated complexity**: High
   205	
   206	**Verification strategy**:
   207	- Ledger fixtures prove `verified`, `contradicted`, and `unresolved` claims render into synthesis metadata with downgrade conditions and provenance.
   208	- Semantic convergence fixtures assert novelty, contradiction density, and citation overlap participate in typed stop-decision traces instead of scalar-only thresholds.
   209	- Review contract tests prove machine-owned strategy sections are reducer-owned and no longer edited directly by `@deep-review`.
   210	
   211	### Phase 3: Behavior-First Verification
   212	
   213	**Scope**: REQ-006 plus supporting coverage for REQ-001 through REQ-019
   214	
   215	**Why now**: This phase starts immediately after Phase 1 contracts stabilize so replay harnesses can protect substrate and trust-surface work while those phases are still being implemented.
   216	
   217	**Files to change**:
   218	- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts`
   219	- `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts`
   220	- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`
   221	- `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts`
   222	- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/028/`
   223	- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/040/`
   224	- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/042/`
   225	
   226	**Estimated complexity**: High
   227	
   228	**Verification strategy**:
   229	- Create thin end-to-end harnesses first for invalid-state, resume, completed-continue, blocked-stop, and compaction-equivalence replay.
   230	- Research behavior tests should assert falsifiable question framing, citation presence, conclusion confidence, clustering, semantic convergence, and stop-reason persistence.
   231	- Review behavior tests should assert dimension rotation, citation presence, hotspot ranking, claim-adjudication gate enforcement, reducer-owned machine sections, and stop-reason persistence.
   232	
   233	### Phase 4: Parity and Mirror Alignment
   234	
   235	**Scope**: REQ-012, REQ-013
   236	
   237	**Why after early verification**: Once the foundational and trust contracts have replay-backed coverage, parity and mirror alignment can move as one bounded follow-on without guessing at unstable interim surfaces.
   238	
   239	**Files to change**:
   240	- `.opencode/command/spec_kit/deep-research.md`
   241	- `.opencode/command/spec_kit/deep-review.md`
   242	- `.opencode/skill/sk-deep-research/references/quick_reference.md`
   243	- `.opencode/skill/sk-deep-review/references/quick_reference.md`
   244	- `.claude/agents/deep-research.md`
   245	- `.gemini/agents/deep-research.md`
   246	- `.codex/agents/deep-research.toml`
   247	- `.agents/agents/deep-research.md`
   248	- `.claude/agents/deep-review.md`
   249	- `.gemini/agents/deep-review.md`
   250	- `.codex/agents/deep-review.toml`
   251	- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts`
   252	- `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts`
   253	
   254	**Estimated complexity**: Medium
   255	
   256	**Verification strategy**:
   257	- Contract parity tests must fail before mirror drift can land.
   258	- Operator-facing command examples should remain compact while replay, observability, and advanced modes are discoverable.
   259	- Confirm-mode and auto-mode docs should describe the same artifacts, lifecycle terms, and reducer-ownership boundaries.
   260	

codex
I’ve got enough source material now to start the actual 10-iteration analysis. One important pattern is becoming clear: several “Phase 1” ideas in the packet are already partially implemented today, but under older names or weaker contracts. That means the most useful output is not “add feature X,” but “normalize and de-drift contracts that are already half-present.”
exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md | sed -n '150,178p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   150	
   151	<!-- /ANCHOR:scope -->
   152	---
   153	
   154	<!-- ANCHOR:requirements -->
   155	## 4. REQUIREMENTS
   156	
   157	### P0 - Blockers (MUST complete)
   158	
   159	| ID | Requirement | Acceptance Criteria | Research Basis |
   160	|----|-------------|---------------------|----------------|
   161	| REQ-001 | Both deep-loop products MUST use a shared named stop-reason taxonomy: `max_iterations`, `converged`, `all_dimensions_clean`, `insufficient_evidence`, `user_stopped`, and `error_budget_exhausted`. | Deep research and deep review state docs, YAML workflows, dashboards, and synthesis outputs all expose `stopReason` from the shared taxonomy; any legacy stop labels are either removed or mapped into this taxonomy. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   162	| REQ-002 | Deep research and deep review MUST only stop when convergence math, coverage expectations, and binary quality gates all pass together. | If convergence math votes STOP but coverage or quality gates fail, the workflow records a blocked-stop event, leaves `status` non-terminal, and continues or requests recovery; STOP is never treated as legal based on novelty math alone. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   163	| REQ-003 | Both loops MUST support resume semantics that can continue from an existing lineage and start at a specific iteration/run boundary instead of reinitializing from run 1. | Config/state/workflow contracts define and preserve resume cursor data such as `continuedFromRun` or equivalent; command surfaces describe how resume, restart, fork, and completed-continue interact with start-from-run behavior. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   164	| REQ-004 | Both loops MUST produce append-only audit journals that capture file reads, searches, evidence extraction, focus/dimension rotation decisions, and convergence-calculation inputs. | Runtime artifacts include a canonical journal file per session, it is append-only, reducer/dashboard flows can summarize it, and stop/recovery analysis can be reproduced from packet artifacts without hidden state. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   165	| REQ-005 | Deep research MUST create a claim-verification ledger for major claims with quoted claim text, evidence references, verification status, and verification method/actor. | Research packets define a canonical ledger artifact, synthesis references it, and claims can be marked `verified`, `contradicted`, or `unresolved` with file/line evidence or explicit unresolved status. | `CF-014` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:212-221`] |
   166	| REQ-006 | The implementation plan MUST shift loop confidence from structure-only checks to behavior-first tests that exercise narrow questions, evidence citations, conclusion confidence, convergence, and stop-reason persistence. | The planned test stack includes dedicated behavioral suites for deep research and deep review plus extensions to reducer/parity tests; passing behavior tests becomes part of the done gate for these runtime changes. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `Theme T-005` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:404-406`] |
   167	
   168	### P1 - Required (complete OR user-approved deferral)
   169	
   170	| ID | Requirement | Acceptance Criteria | Research Basis |
   171	|----|-------------|---------------------|----------------|
   172	| REQ-007 | Both loop dashboards MUST expose richer runtime truth: liveness, rolling convergence visualization, wall-clock and token cost per iteration, coverage depth, severity trends, and final stop reason. | Research and review dashboard assets, reducers, and workflow outputs define these sections explicitly; dashboard content is generated, not manually maintained; trend and liveness rules are consistent with state schema. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   173	| REQ-008 | Deep research MUST support publication critique annotations so synthesis distinguishes verified runtime code, README claims, marketing copy, and other weaker evidence classes. | Research iteration/synthesis surfaces include an explicit evidence-quality or publication-critique field that can be summarized in the dashboard or final research output without becoming mandatory for every minor observation. | `CF-021` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:291-300`] |
   174	| REQ-009 | Deep research MUST support runtime-inventory and promotion-checkpoint artifacts so recommendations do not move to "adopt" without explicit evidence thresholds. | Research packet design includes runtime-surface inventory capture plus checkpoint criteria for moving a finding from interesting to recommended; the promotion threshold is visible in synthesis and the ledger/journal context. | `CF-021` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:291-300`] |
   175	| REQ-010 | Council-style synthesis MUST be supported as an explicit opt-in profile for ambiguous research or architecture questions. | The plan defines named perspective iterations and a synthesis reconciliation iteration; default deep-research behavior remains unchanged unless the user or workflow explicitly selects council mode. | `CF-027` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:359-359`] |
   176	| REQ-011 | Large multi-phase research runs MUST have an optional packet-local coordination board that tracks phase status, headline findings, conflicts, duplicate signals, and resource-allocation suggestions. | The plan defines a packet-local coordination artifact with explicit fields for state, conflicts, dedupe, and resource recommendations; default single-packet research remains unaffected when the board is unused. | `CF-030` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:362-362`] |
   177	| REQ-012 | Command docs and YAML assets MUST surface the new lifecycle and optional-mode behavior without bloating the default operator path. | Default command examples remain compact; advanced behaviors are discoverable but explicitly marked as optional; confirm and auto workflows stay contract-compatible. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:408-411`] |
   178	| REQ-013 | Canonical skill/command/agent contracts and runtime parity tests MUST move together so new stop/journal/ledger/dashboard behavior cannot drift by runtime or doc surface. | Planned work updates the canonical `.opencode` files plus the parity-test surfaces that enforce mirror alignment; implementation does not rely on untested doc-only parity. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:408-411`] |

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md | sed -n '166,234p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   166	### ADR-003: Dashboards Stay Generated Markdown, Backed by Structured Metrics
   167	
   168	#### Metadata
   169	
   170	| Field | Value |
   171	|-------|-------|
   172	| **Status** | Proposed |
   173	| **Date** | 2026-04-10 |
   174	| **Deciders** | Packet 042 planning author |
   175	
   176	#### Context
   177	
   178	The dashboards need richer runtime truth, but the repo already uses markdown dashboards as the packet-local observability surface. We need to decide whether to keep generated markdown, move to JSON-only, or introduce a richer HTML/UI artifact.
   179	
   180	#### Constraints
   181	
   182	- The result must stay easy to review in git and packet folders.
   183	- It must remain reducer-friendly and runtime-agnostic.
   184	
   185	#### Decision
   186	
   187	**We chose**: keep dashboards as generated markdown, backed by structured reducer metrics and canonical state artifacts.
   188	
   189	**How it works**: Reducers compute metrics from JSONL, journals, ledgers, and strategy/config files. Generated markdown remains the human-facing dashboard, while machine-readable sources stay authoritative underneath.
   190	
   191	#### Alternatives Considered
   192	
   193	| Option | Pros | Cons | Score |
   194	|--------|------|------|-------|
   195	| **Generated markdown backed by structured metrics** | Git-friendly, packet-local, easy recovery surface, no extra UI stack | Needs careful renderer upkeep | 9/10 |
   196	| JSON-only dashboards | Easy to compute | Poor operator ergonomics | 5/10 |
   197	| HTML or app-based dashboards | Rich visuals | Too much infrastructure for packet-local runtime truth | 4/10 |
   198	
   199	**Why this one**: It preserves the existing packet-local operator workflow while allowing richer structured metrics underneath.
   200	
   201	#### Consequences
   202	
   203	**What improves**:
   204	- Operators keep a git-visible dashboard surface.
   205	- Reducers can expand metrics without turning dashboards into manually curated docs.
   206	
   207	**What it costs**:
   208	- Markdown renderers need to stay synchronized with state schemas. Mitigation: reducer and parity tests become mandatory.
   209	
   210	**Risks**:
   211	
   212	| Risk | Impact | Mitigation |
   213	|------|--------|------------|
   214	| Dashboard sections drift from state schema | Medium | Test section presence and metric mapping in reducer/parity suites. |
   215	
   216	#### Five Checks Evaluation
   217	
   218	| # | Check | Result | Evidence |
   219	|---|-------|--------|----------|
   220	| 1 | **Necessary?** | PASS | `CF-010` explicitly calls for richer runtime health signals and summaries. |
   221	| 2 | **Beyond Local Maxima?** | PASS | We compared structured-only and richer UI alternatives. |
   222	| 3 | **Sufficient?** | PASS | Generated markdown already fits packet-local workflows. |
   223	| 4 | **Fits Goal?** | PASS | The goal is better runtime truth, not a new UI product. |
   224	| 5 | **Open Horizons?** | PASS | Structured metrics could power future renderers without changing packet truth. |
   225	
   226	**Checks Summary**: 5/5 PASS
   227	
   228	#### Implementation
   229	
   230	**What changes**:
   231	- Dashboard assets expand in both skills.
   232	- Reducer/test surfaces learn the new metrics and section rendering.
   233	
   234	**How to roll back**: Revert the new dashboard metrics/sections while keeping the current generated-markdown pattern intact.

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md | sed -n '20,90p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md | sed -n '94,162p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    94	### ADR-002: Claim-Verification Ledger Uses JSONL Canonical Storage With Rendered Summaries
    95	
    96	#### Metadata
    97	
    98	| Field | Value |
    99	|-------|-------|
   100	| **Status** | Proposed |
   101	| **Date** | 2026-04-10 |
   102	| **Deciders** | Packet 042 planning author |
   103	
   104	#### Context
   105	
   106	Research packets need a durable way to show whether major claims were verified, contradicted, or left unresolved. A ledger must be machine-friendly enough for reducers and synthesis, but still readable in packet outputs.
   107	
   108	#### Constraints
   109	
   110	- The ledger must be append-friendly and packet-local.
   111	- It should not require hand-maintained duplication between machine and human views.
   112	
   113	#### Decision
   114	
   115	**We chose**: JSONL as the canonical ledger format, with rendered markdown summaries in synthesis/dashboard outputs when needed.
   116	
   117	**How it works**: The runtime writes structured ledger entries as JSONL so reducers and tests can reason over them. Research synthesis can then summarize those entries in human-readable tables or narrative sections without making markdown the source of truth.
   118	
   119	#### Alternatives Considered
   120	
   121	| Option | Pros | Cons | Score |
   122	|--------|------|------|-------|
   123	| **Canonical JSONL + rendered markdown** | Append-only, machine-friendly, easy reducer use, still human-readable through renderers | Requires one extra render path | 9/10 |
   124	| Markdown table only | Easy for humans to skim | Brittle for automated checks and append-only workflows | 5/10 |
   125	| JSON only, no rendered summary | Very machine-friendly | Poor packet readability and synthesis ergonomics | 6/10 |
   126	
   127	**Why this one**: It keeps the runtime truthful and testable without making humans read raw JSONL for every synthesis.
   128	
   129	#### Consequences
   130	
   131	**What improves**:
   132	- Claim status becomes reducer- and test-friendly.
   133	- Research summaries can cite the ledger without becoming hand-maintained ledgers themselves.
   134	
   135	**What it costs**:
   136	- Reducers or synthesis paths need a render step. Mitigation: keep markdown summaries derived, not editable.
   137	
   138	**Risks**:
   139	
   140	| Risk | Impact | Mitigation |
   141	|------|--------|------------|
   142	| Ledger becomes noisy and underused | Medium | Restrict canonical use to major claims and promotion checkpoints. |
   143	
   144	#### Five Checks Evaluation
   145	
   146	| # | Check | Result | Evidence |
   147	|---|-------|--------|----------|
   148	| 1 | **Necessary?** | PASS | `CF-014` asks for explicit verification status tied to evidence. |
   149	| 2 | **Beyond Local Maxima?** | PASS | We compared markdown-only and JSON-only approaches. |
   150	| 3 | **Sufficient?** | PASS | JSONL plus rendered summaries keeps one canonical truth. |
   151	| 4 | **Fits Goal?** | PASS | Trustworthy research output is a core packet objective. |
   152	| 5 | **Open Horizons?** | PASS | Supports future dashboard, search, and promotion-checkpoint tooling. |
   153	
   154	**Checks Summary**: 5/5 PASS
   155	
   156	#### Implementation
   157	
   158	**What changes**:
   159	- Research state docs, reducer logic, and synthesis contracts define the ledger path and entry schema.
   160	- Behavior tests add verified/contradicted/unresolved coverage.
   161	
   162	**How to roll back**: Remove the JSONL ledger artifact and revert synthesis/dashboard references to the prior citation-only model.

 succeeded in 0ms:
    20	<!-- ANCHOR:adr-001 -->
    21	## ADR-001: Shared Stop-Reason Taxonomy and Legal Done Gate
    22	
    23	### Metadata
    24	
    25	| Field | Value |
    26	|-------|-------|
    27	| **Status** | Proposed |
    28	| **Date** | 2026-04-10 |
    29	| **Deciders** | Packet 042 planning author |
    30	
    31	### Context
    32	
    33	We need a runtime answer to "why did this loop stop?" that works across both deep research and deep review. Right now stop behavior is partly implied by convergence math, partly spread across workflow steps, and not strong enough for recovery, dashboards, or user trust.
    34	
    35	### Constraints
    36	
    37	- The taxonomy must work for both research and review without turning them into the same product.
    38	- STOP must remain auditable from packet-local artifacts.
    39	
    40	### Decision
    41	
    42	**We chose**: a shared named stop-reason taxonomy plus a separate legal done gate.
    43	
    44	**How it works**: Each loop records `stopReason` from the same small taxonomy, while the legal done gate decides whether STOP is actually allowed. This keeps reason reporting simple and keeps the enforcement logic explicit.
    45	
    46	### Alternatives Considered
    47	
    48	| Option | Pros | Cons | Score |
    49	|--------|------|------|-------|
    50	| **Shared taxonomy + legal done gate** | One reporting language, explicit enforcement, easy dashboarding | Requires coordinated updates across many assets | 9/10 |
    51	| Free-text stop reasons per loop | Fast to write | Not machine-friendly, drifts quickly, poor parity | 4/10 |
    52	| Separate taxonomies for research and review | Preserves product differences | Harder parity and resume behavior, more operator confusion | 5/10 |
    53	
    54	**Why this one**: It gives us a compact, auditable vocabulary without pretending research and review are the same workflow.
    55	
    56	### Consequences
    57	
    58	**What improves**:
    59	- Dashboards, synthesis, and journals can report a single reason vocabulary.
    60	- Blocked-stop cases become explicit instead of hidden in convergence math.
    61	
    62	**What it costs**:
    63	- We need synchronized changes across commands, assets, agents, and tests. Mitigation: make parity tests part of the same wave.
    64	
    65	**Risks**:
    66	
    67	| Risk | Impact | Mitigation |
    68	|------|--------|------------|
    69	| Taxonomy becomes too broad or too vague | Medium | Keep the enum small and use detail fields for nuance. |
    70	
    71	### Five Checks Evaluation
    72	
    73	| # | Check | Result | Evidence |
    74	|---|-------|--------|----------|
    75	| 1 | **Necessary?** | PASS | Stop behavior is a direct trust gap from `CF-010`. |
    76	| 2 | **Beyond Local Maxima?** | PASS | We considered free-text and per-loop taxonomies. |
    77	| 3 | **Sufficient?** | PASS | Small enum plus done gate covers reporting and enforcement. |
    78	| 4 | **Fits Goal?** | PASS | Runtime truth is a primary packet goal. |
    79	| 5 | **Open Horizons?** | PASS | Supports future dashboards and continuation tooling without forcing a DSL rewrite. |
    80	
    81	**Checks Summary**: 5/5 PASS
    82	
    83	### Implementation
    84	
    85	**What changes**:
    86	- Skill references, workflow assets, dashboards, agents, and parity tests adopt the shared taxonomy.
    87	- Reducer/test surfaces learn blocked-stop reporting and resume-safe stop metadata.
    88	
    89	**How to roll back**: Revert the new enum/done-gate fields together and restore the prior stop reporting language in skills, commands, agents, and parity tests.
    90	<!-- /ANCHOR:adr-001 -->

exec
/bin/zsh -lc "rg -n \"max_iterations_reached|all_questions_answered|composite_converged|stuck_unrecoverable|all_dimensions_covered|all_dimensions_clean|guard_override|completed_continue|completed-continue|resumed|paused|invalid-state|completed-session\" .opencode | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"blocked-stop|blocked stop|stopReason|guard_violation|claim_adjudication_passed|releaseReadinessState|continuedFromRun|journal|ledger|snapshot|compaction\" .opencode | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1386ms:
ests/memory-search-ux-hooks.vitest.ts:198:    expect(resumedEnvelope.summary).toBe('Error: Cursor is invalid, expired, or out of scope');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:199:    expect(resumedData.error).toBe('Cursor is invalid, expired, or out of scope');
.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/iterations/iteration-056.md:15:Matrix must validate both startup contexts and lifecycle transitions with persisted packet-only state. Scenarios should include interrupted sessions, migrated legacy packets, and completed-session continuation.
.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/iterations/iteration-056.md:18:- Mandatory scenario groups: startup recovery, pause/resume, restart/fork, completed-continue, naming migration, parity mirror integrity.
.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/iterations/iteration-033.md:26:Audit event-level state model (`resumed`, `state_reconstructed`, `segment_start`) for lineage extensibility gaps.
.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/iterations/iteration-038.md:23:Without dual-read/single-write migration, renaming can break existing paused sessions.
.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/iterations/iteration-059.md:18:- Required gates: lifecycle e2e, naming migration e2e, reducer integrity, mirror parity CI, paused-session recovery.
.opencode/specs/00--barter/001-tiktok-instagram-youtube-integration/research/iterations/iteration-031.md:93:- `2`: paused
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:301:      resumedSession: false,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:320:  it('prioritizes resumed-session and explicit-mode reasons deterministically', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:321:    const resumed = buildSessionTransitionTrace({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:323:      resumedSession: true,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:330:    expect(resumed.signalSources).toEqual([
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:335:    expect(resumed.confidence).toBe(0.95);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:336:    expect(resumed.reason).toBe('resumed session inferred resume mode');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:340:      resumedSession: false,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:372:      resumedSession: false,
.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/iterations/iteration-058.md:14:Most sensitive areas: paused sessions, naming migration, and partially reconstructed state logs. Rollback must preserve snapshot archives and event logs.
.opencode/specs/00--barter/001-tiktok-instagram-youtube-integration/research/iterations/iteration-021.md:28:   The event contract should be platform-neutral, e.g. `ready`, `playing`, `paused`, `ended`, `buffering`, `error`, `timeout`. That lets Barter keep one UI surface while swapping template internals by platform. [SOURCE: https://developers.tiktok.com/doc/embed-player] [SOURCE: https://developers.google.com/youtube/iframe_api_reference] [SOURCE: https://revirals.com/meta-review/oembed.html]
.opencode/specs/00--barter/001-tiktok-instagram-youtube-integration/research/iterations/iteration-021.md:70:  | { type: "state"; platform: EmbedPlatform; state: "playing" | "paused" | "ended" | "buffering" }
.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/iterations/iteration-001.md:6:- Session classification supports `fresh|resume|completed-session|invalid-state`.
.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/iterations/iteration-078.md:23:The internal system can use named handoff roles for research and review sub-agents, but it should persist the branch history separately so a completed run can be resumed, replayed, or forked without guessing from chat text.

 succeeded in 1376ms:
status === 'ok' && snapshot.data) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:87:      const totalFiles = snapshot.data.totalFiles ?? 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:88:      const lastScan = snapshot.data.lastScanAt;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:165:      sourceRefs: ['memory-surface', 'context-metrics', 'session-snapshot'],
.opencode/skill/sk-deep-review/references/loop_protocol.md:106:6. **Write config**: `{spec_folder}/review/deep-review-config.json` with `mode: "review"`, lineage metadata (`sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, `releaseReadinessState`), and review-specific fields including target, target type, dimensions, protocol plan, and release-readiness state.
.opencode/skill/sk-deep-review/references/loop_protocol.md:458:     "stopReason": "...",
.opencode/skill/sk-deep-review/references/loop_protocol.md:499:Enable review sessions to resume seamlessly from prior state when interrupted by context compaction, process termination, or intentional pause.
.opencode/skill/sk-deep-review/references/loop_protocol.md:680:| **Evidence** | Every active finding has concrete `file:line` evidence and is not inference-only | Block STOP, log `guard_violation`, continue loop |
.opencode/skill/sk-deep-review/references/loop_protocol.md:681:| **Scope** | Findings and reviewed files stay within the declared review scope | Block STOP, log `guard_violation`, continue loop |
.opencode/skill/sk-deep-review/references/loop_protocol.md:682:| **Coverage** | Configured dimensions and required traceability protocols must be covered before STOP is allowed | Block STOP, log `guard_violation`, continue loop |
.opencode/skill/sk-deep-review/references/loop_protocol.md:719:{"type":"event","event":"guard_violation","gate":"<name>","iteration":N,"detail":"<reason>"}
.opencode/changelog/03--agent-orchestration/v2.0.8.0.md:3:The orchestrator now has explicit self-protection rules, compaction recovery protocol, output discipline enforcement, and a structured context pressure response sequence to prevent irrecoverable context window failures. The main changes here are orchestrator self-protection rules added and compaction recovery protocol added.
.opencode/changelog/03--agent-orchestration/v2.0.8.0.md:18:- What changed: Explicit 5-step protocol when context compaction occurs: stop, re-read the Claude the related file, summarize state, wait for user confirmation. After 2+ compactions, recommends /clear with @handover continuation document.
.opencode/changelog/03--agent-orchestration/v2.0.8.0.md:42:- What changed: Never read 3+ large files back-to-back in main context, never echo full tool output (>50 lines), never continue after compaction without user confirmation.
.opencode/skill/sk-doc/references/specific/readme_creation.md:222:| **Save point in a video game** | Checkpoints, snapshots, rollback |
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/scratch/wave1-repo-recon.md:348:Updated every experiment. Survives context compactions and crashes. Includes "Key Insights" and "Next Ideas" sections at bottom.
.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md:28:- Separate canonical `review_protocol.md` and `subagent_utilization_ledger.md` files are no longer part of the contract.
.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md:84:- separate canonical `subagent_utilization_ledger.md`
.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md:218:| Keeping separate canonical `review_protocol.md` or `subagent_utilization_ledger.md` files | Splits package truth across sidecar docs | Fold shared review/orchestration rules into the root playbook |
.opencode/skill/sk-doc/assets/documentation/readme_template.md:364:- **Save point in a video game** -- for checkpoints, snapshots, rollback
.opencode/changelog/04--commands/v2.0.5.1.md:3:Normalized command-side Claude runtime mapping to /.claude/agents and aligned memory command documentation with adaptive-fusion, telemetry, and mutation-ledger behavior. The main changes here are claude runtime path corrected and recovery-path detection updated.
.opencode/changelog/04--commands/v2.0.5.1.md:34:- What changed: /memory:manage, /memory:save, and /memory:learn now include extended telemetry and mutation-ledger behavior notes.
.opencode/changelog/04--commands/v2.0.5.1.md:47:| `.opencode/command/memory/{context,learn,manage,save}.md` | Added adaptive-fusion, telemetry, and mutation-ledger guidance | Added adaptive-fusion, telemetry, and mutation-ledger guidance |
.opencode/skill/sk-doc/references/global/workflows.md:53:| **Audit snapshot** | 1 (JSON only) | `python scripts/extract_structure.py` | Quality audit, no changes | JSON report for another agent |
.opencode/skill/sk-doc/SKILL.md:613:6. **NEVER describe separate review or ledger files as canonical** when documenting the current playbook contract
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:312:/** Handle checkpoint_create tool — snapshots the current memory state for rollback.
.opencode/skill/system-spec-kit/mcp_server/cli.ts:22:type MutationLedgerModule = Awaited<typeof import('./lib/storage/mutation-ledger.js')>;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:33:let _mutation_ledger: MutationLedgerModule | null = null;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:54:  return _mutation_ledger ??= await import('./lib/storage/mutation-ledger.js');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:403:  // Record in mutation ledger
.opencode/skill/system-spec-kit/mcp_server/cli.ts:423:    // Mutation ledger may not exist — non-fatal
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/memory/18-03-26_20-18__speckit-plan-setup-no-feature-description-or-mode.md:63:- [PROJECT STATE SNAPSHOT](#project-state-snapshot)
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/memory/18-03-26_20-18__speckit-plan-setup-no-feature-description-or-mode.md:132:<!-- ANCHOR:project-state-snapshot -->
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/memory/18-03-26_20-18__speckit-plan-setup-no-feature-description-or-mode.md:133:<a id="project-state-snapshot"></a>
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/memory/18-03-26_20-18__speckit-plan-setup-no-feature-description-or-mode.md:162:<!-- /ANCHOR:project-state-snapshot -->
.opencode/skill/sk-deep-research/assets/deep_research_config.json:26:    "continuedFromRun": null
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:47:} from '../lib/feedback/feedback-ledger.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:48:import type { FeedbackEvent } from '../lib/feedback/feedback-ledger.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:351:  snapshot: LexicalCapabilitySnapshot | null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:362:  if (typeof data.lexicalPath !== 'string' && snapshot) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:363:    data.lexicalPath = snapshot.lexicalPath;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:365:  if (typeof data.fallbackState !== 'string' && snapshot) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:366:    data.fallbackState = snapshot.fallbackState;
.opencode/specs/skilled-agent-orchestration/034-sk-deep-research-review-folders/memory/27-03-26_11-29__implemented-034-sk-deep-research-review-folders.md:50:- [PROJECT STATE SNAPSHOT](#project-state-snapshot)
.opencode/specs/skilled-agent-orchestration/034-sk-deep-research-review-folders/memory/27-03-26_11-29__implemented-034-sk-deep-research-review-folders.md:119:<!-- ANCHOR:project-state-snapshot -->
.opencode/specs/skilled-agent-orchestration/034-sk-deep-research-review-folders/memory/27-03-26_11-29__implemented-034-sk-deep-research-review-folders.md:120:<a id="project-state-snapshot"></a>
.opencode/specs/skilled-agent-orchestration/034-sk-deep-research-review-folders/memory/27-03-26_11-29__implemented-034-sk-deep-research-review-folders.md:153:<!-- /ANCHOR:project-state-snapshot -->
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/memory/18-03-26_21-24__the-current-state-of-the-repository.md:71:- [PROJECT STATE SNAPSHOT](#project-state-snapshot)
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/memory/18-03-26_21-24__the-current-state-of-the-repository.md:140:<!-- ANCHOR:project-state-snapshot -->
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/memory/18-03-26_21-24__the-current-state-of-the-repository.md:141:<a id="project-state-snapshot"></a>
.opencode/specs/skilled-agent-orchestration/024-sk-deep-research-refinement/memory/18-03-26_21-24__the-current-state-of-the-repository.md:172:<!-- /ANCHOR:project-state-snapshot -->
.opencode/changelog/01--system-spec-kit/v2.4.0.0.md:34:- **Deleting a memory left orphaned records** -- When a memory was deleted, 6 types of related records (graph snapshots, community assignments, summaries, linked entities, causal edges, and search index entries) were left behind. Deletion now cleans all of them up.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:691: * Log quality metrics to the eval infrastructure (eval_metric_snapshots table).
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:717:      INSERT INTO eval_metric_snapshots
.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md:17:2. **Recovery surface** — second recovery channel alongside JSONL after context compaction
.opencode/specs/skilled-agent-orchestration/034-sk-deep-research-review-folders/memory/27-03-26_10-52__planned-a-dedicated-review-subfolder-contract-for.md:50:- [PROJECT STATE SNAPSHOT](#project-state-snapshot)
.opencode/specs/skilled-agent-orchestration/034-sk-deep-research-review-folders/memory/27-03-26_10-52__planned-a-dedicated-review-subfolder-contract-for.md:118:<!-- ANCHOR:project-state-snapshot -->
.opencode/specs/skilled-agent-orchestration/034-sk-deep-research-review-folders/memory/27-03-26_10-52__planned-a-dedicated-review-subfolder-contract-for.md:119:<a id="project-state-snapshot"></a>
.opencode/specs/skilled-agent-orchestration/034-sk-deep-research-review-folders/memory/27-03-26_10-52__planned-a-dedicated-review-subfolder-contract-for.md:154:<!-- /ANCHOR:project-state-snapshot -->
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:323:        ? (stored ? 'Ablation metrics stored to eval_metric_snapshots' : 'Ablation metrics storage failed')
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:260:  // Use existingParentUpdated below for mutation ledger (replaces `existing` variable)
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:610:  // Mutation ledger
.opencode/skill/sk-deep-research/SKILL.md:53:- `completed-continue` — reopen a completed lineage only after immutable synthesis snapshotting
.opencode/specs/skilled-agent-orchestration/026-cmd-create-manual-testing-playbook/spec.md:21:This packet defines the implementation contract for `/create:testing-playbook`, a new create command that must scaffold the current integrated `manual_testing_playbook/` package. The command must honor the post-021 contract: root playbook plus numbered category folders, root-owned review/orchestration guidance, per-feature files that mimic feature-catalog entry structure, and no legacy review or sub-agent ledger sidecars or `snippets/` subtree.
.opencode/specs/skilled-agent-orchestration/026-cmd-create-manual-testing-playbook/spec.md:81:- Reintroducing legacy review/ledger sidecars or a `snippets/` subtree.
.opencode/specs/skilled-agent-orchestration/026-cmd-create-manual-testing-playbook/spec.md:113:| REQ-003 | The generated playbook follows the integrated root-guidance model | Output contains root-owned review/orchestration guidance and does not create legacy review/ledger sidecars or a `snippets/` subtree |
.opencode/changelog/01--system-spec-kit/v3.2.0.0.md:9:This release combines the ESM Module Compliance packet (023, 13 phases) and the Compact Code Graph packet (024, 28 phases) into one unified delivery. Together, the 41 phases migrated the runtime to truthful native ESM, built a structural code graph with tree-sitter parsing, added compaction rescue and hookless auto-priming for cross-runtime session recovery, restored search from a zero-result outage to a trustworthy hybrid pipeline, overhauled memory-save quality from 0/100 to 55-75/100, audited 186 spec folders to zero validation errors, and rebuilt the memory database from clean inputs. Final verification ended at 9,480+ passing tests with 0 failures and 0 skipped.
.opencode/changelog/01--system-spec-kit/v3.2.0.0.md:47:Long AI coding sessions no longer depend on the user re-explaining context after compaction, restart, or runtime switches.
.opencode/changelog/01--system-spec-kit/v3.2.0.0.md:53:**Problem:** Claude compaction wiped the AI's short-term memory. After a compact, the assistant lost the active spec folder, recent code focus, and the rules guiding the work.
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:221:            provenance: ['eval_metric_snapshots'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:227:            provenance: ['eval_metric_snapshots'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:234:            provenance: ['eval_metric_snapshots'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:248:            provenance: ['eval_metric_snapshots'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:255:            provenance: ['eval_metric_snapshots'],
.opencode/changelog/01--system-spec-kit/v2.3.0.8.md:59:| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-deprecated-skill-graph-experiment/tasks.md` | Completion task ledger closed. |
.opencode/specs/skilled-agent-orchestration/023-sk-deep-research-creation/scratch/improvement-proposals.md:154:| **Evidence** | autoresearch-opencode uses a TypeScript plugin to auto-inject research context into every prompt. Our system relies on the orchestrator dispatch prompt, which is fragile to context loss on compaction. A compact state summary injected into every dispatch would reduce this risk. |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:9:import * as mutationLedger from '../lib/storage/mutation-ledger.js';

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/convergence.md | sed -n '228,272p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   228	Three binary gates must ALL pass before a STOP decision is finalized. If any gate fails, the STOP is overridden to CONTINUE and violations are logged to JSONL.
   229	
   230	| Gate | Rule | Fail Action |
   231	|------|------|-------------|
   232	| **Evidence** | Every active finding has concrete `file:line` evidence; no inference-only findings | Block STOP, log `guard_violation` |
   233	| **Scope** | Findings and reviewed files stay within the declared review scope | Block STOP, log `guard_violation` |
   234	| **Coverage** | All configured dimensions + required traceability protocols covered | Block STOP, log `guard_violation` |
   235	
   236	### Gate Evaluation
   237	
   238	```
   239	function checkReviewQualityGates(state, config, coverage):
   240	  violations = []
   241	
   242	  // Evidence gate
   243	  for f in state.findings where f.status == "active":
   244	    if not f.hasFileLineCitation or f.evidenceType == "inference-only":
   245	      violations.push({ gate: "evidence", findingId: f.id })
   246	
   247	  // Scope gate
   248	  reviewScope = resolveReviewScope(config.reviewTarget, config.reviewTargetType)
   249	  for f in state.findings where f.status == "active":
   250	    if f.filePath not in reviewScope:
   251	      violations.push({ gate: "scope", findingId: f.id })
   252	
   253	  // Coverage gate
   254	  if coverage.dimensionCoverage < 1.0:
   255	    violations.push({ gate: "coverage", detail: "dimensions incomplete" })
   256	  if not coverage.requiredProtocolsCovered:
   257	    violations.push({ gate: "coverage", detail: "protocols incomplete" })
   258	
   259	  if len(violations) > 0:
   260	    return { passed: false, violations }
   261	  return { passed: true }
   262	```
   263	
   264	When composite convergence returns STOP, invoke `checkReviewQualityGates()`. If it returns `passed: false`, override the action to CONTINUE and log each violation as a `guard_violation` event in JSONL. The orchestrator targets the violated areas in the next iteration.
   265	
   266	---
   267	
   268	<!-- /ANCHOR:quality-guards -->
   269	<!-- ANCHOR:provisional-verdict -->
   270	## 7. PROVISIONAL VERDICT
   271	
   272	The provisional verdict is determined from active findings at the time the loop stops. It appears in both the convergence report and the final `review-report.md`.

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/convergence.md | sed -n '396,418p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   396	Quality gates:
   397	  Evidence: [PASS | FAIL (N violations)]
   398	  Scope:    [PASS | FAIL (N violations)]
   399	  Coverage: [PASS | FAIL (N violations)]
   400	
   401	Stuck recovery attempts: N (recovered: N, failed: N)
   402	```
   403	
   404	### JSONL Synthesis Event
   405	
   406	```json
   407	{
   408	  "type": "event",
   409	  "event": "synthesis",
   410	  "stopReason": "composite_converged",
   411	  "totalIterations": 5,
   412	  "verdict": "CONDITIONAL",
   413	  "hasAdvisories": false,
   414	  "activeP0": 0,
   415	  "activeP1": 2,
   416	  "activeP2": 5,
   417	  "dimensionCoverage": 1.0,
   418	  "requiredProtocolsCovered": true,

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/state_format.md | sed -n '56,126p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    56	  "reviewTarget": "specs/030-sk-deep-review-review-mode",
    57	  "reviewTargetType": "spec-folder",
    58	  "reviewDimensions": ["correctness", "security", "traceability", "maintainability"],
    59	  "sessionId": "rvw-2026-04-03T12-00-00Z",
    60	  "parentSessionId": null,
    61	  "lineageMode": "new",
    62	  "generation": 1,
    63	  "continuedFromRun": null,
    64	  "maxIterations": 7,
    65	  "convergenceThreshold": 0.10,
    66	  "stuckThreshold": 2,
    67	  "severityThreshold": "P2",
    68	  "crossReference": {
    69	    "core": ["spec_code", "checklist_evidence"],
    70	    "overlay": ["feature_catalog_code", "playbook_capability"]
    71	  },
    72	  "qualityGateThreshold": true,
    73	  "releaseReadinessState": "in-progress",
    74	  "specFolder": "030-sk-deep-review-review-mode",
    75	  "createdAt": "2026-03-24T14:00:00Z",
    76	  "status": "initialized",
    77	  "executionMode": "auto",
    78	  "fileProtection": {
    79	    "deep-review-config.json": "immutable",
    80	    "deep-review-state.jsonl": "append-only",
    81	    "deep-review-findings-registry.json": "auto-generated",
    82	    "deep-review-strategy.md": "mutable",
    83	    "deep-review-dashboard.md": "auto-generated",
    84	    ".deep-review-pause": "operator-controlled",
    85	    "review-report.md": "mutable",
    86	    "review-report-v*.md": "write-once",
    87	    "iteration-*.md": "write-once"
    88	  },
    89	  "reducer": {
    90	    "enabled": true,
    91	    "inputs": ["latestJSONLDelta", "newIterationFile", "priorReducedState"],
    92	    "outputs": ["findingsRegistry", "dashboardMetrics", "strategyUpdates"],
    93	    "metrics": [
    94	      "dimensionsCovered",
    95	      "findingsBySeverity",
    96	      "openFindings",
    97	      "resolvedFindings",
    98	      "convergenceScore"
    99	    ]
   100	  }
   101	}
   102	```
   103	
   104	### Field Reference
   105	
   106	| Field | Type | Default | Description |
   107	|-------|------|---------|-------------|
   108	| mode | `"review"` | -- | Session mode discriminator (required) |
   109	| reviewTarget | string | -- | Path or identifier of the review target |
   110	| reviewTargetType | string | `"spec-folder"` | `spec-folder`, `skill`, `agent`, `track`, `files` |
   111	| reviewDimensions | string[] | all 4 | Dimensions to evaluate |
   112	| sessionId | string | -- | Stable identifier for the current review lineage |
   113	| parentSessionId | string \| null | `null` | Parent lineage reference for restart/fork flows |
   114	| lineageMode | string | `"new"` | `new`, `resume`, `restart`, `fork`, `completed-continue` |
   115	| generation | number | 1 | Lineage generation number |
   116	| continuedFromRun | number \| null | `null` | Prior completed run reopened by completed-continue |
   117	| maxIterations | number | 7 | Hard cap on loop iterations |
   118	| convergenceThreshold | number | 0.10 | Stop when severity-weighted new findings ratio below this |
   119	| stuckThreshold | number | 2 | Consecutive no-progress iterations before recovery |
   120	| severityThreshold | string | `"P2"` | Minimum severity to report: `P0`, `P1`, `P2` |
   121	| crossReference | object | -- | Core (hard-gated) and overlay (advisory) protocol sets |
   122	| qualityGateThreshold | boolean | true | Whether binary quality gates are enforced |
   123	| specFolder | string | -- | Spec folder path (relative to specs/) |
   124	| status | string | `"initialized"` | `initialized`, `running`, `converged`, `stuck`, `complete`, `error` |
   125	| releaseReadinessState | string | `"in-progress"` | `in-progress`, `converged`, `release-blocking` |
   126	| fileProtection | object | -- | Mutability declarations (see protection levels below) |

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/state_format.md | sed -n '168,236p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   168	{"type":"config","mode":"review","topic":"...","reviewTarget":"...","sessionId":"rvw-...","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":7,"convergenceThreshold":0.10,"createdAt":"2026-03-24T14:00:00Z","specFolder":"..."}
   169	```
   170	
   171	### Iteration Records
   172	
   173	```json
   174	{
   175	  "type": "iteration", "mode": "review", "run": 3, "status": "complete",
   176	  "focus": "D3 Traceability - skill/runtime alignment",
   177	  "dimensions": ["traceability", "maintainability"],
   178	  "filesReviewed": [".opencode/skill/sk-deep-research/README.md"],
   179	  "sessionId": "rvw-2026-04-03T12-00-00Z",
   180	  "parentSessionId": null,
   181	  "lineageMode": "resume",
   182	  "generation": 1,
   183	  "continuedFromRun": null,
   184	  "findingsCount": 4,
   185	  "findingsSummary": { "P0": 0, "P1": 1, "P2": 3 },
   186	  "findingsNew": { "P0": 0, "P1": 1, "P2": 1 },
   187	  "newFindingsRatio": 0.32,
   188	  "timestamp": "2026-03-24T14:30:00Z", "durationMs": 52000
   189	}
   190	```
   191	
   192	**Required fields:** `type`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, `durationMs`
   193	
   194	**Optional fields:** `parentSessionId`, `continuedFromRun`, `findingsRefined`, `findingRefs`, `traceabilityChecks`, `coverage`, `noveltyJustification`, `ruledOut`, `focusTrack`, `scoreEstimate`, `segment`, `convergenceSignals`
   195	
   196	| Required Field | Type | Description |
   197	|---------------|------|-------------|
   198	| mode | `"review"` | Session mode discriminator |
   199	| dimensions | string[] | Review dimensions addressed this iteration |
   200	| filesReviewed | string[] | Files examined |
   201	| sessionId | string | Current lineage session identifier |
   202	| generation | number | Lineage generation number |
   203	| lineageMode | string | Lifecycle mode used for this run |
   204	| findingsSummary | object | Total active findings: `{ P0, P1, P2 }` |
   205	| findingsNew | object | Net-new findings this iteration: `{ P0, P1, P2 }` |
   206	| newFindingsRatio | number | Severity-weighted new findings ratio (0.0-1.0) |
   207	
   208	### Convergence Signals
   209	
   210	| Signal | Weight | Description |
   211	|--------|--------|-------------|
   212	| rollingAvg | 0.30 | Rolling average of severity-weighted new findings |
   213	| madScore | 0.25 | Noise-floor test against MAD-derived churn |
   214	| dimensionCoverage | 0.45 | Required dimension + protocol coverage stability |
   215	| compositeStop | -- | Weighted stop score (stop if > 0.60) |
   216	
   217	**Severity math:** `refinementMultiplier: 0.5`, `p0OverrideMinRatio: 0.50`, `noFindingsRatio: 0.0`
   218	
   219	### Synthesis Event
   220	
   221	```json
   222	{
   223	  "type": "event", "event": "synthesis_complete", "mode": "review",
   224	  "totalIterations": 6, "verdict": "PASS",
   225	  "activeP0": 0, "activeP1": 0, "activeP2": 2,
   226	  "dimensionCoverage": 1.0, "stopReason": "composite_converged",
   227	  "timestamp": "2026-03-24T15:02:00Z"
   228	}
   229	```
   230	
   231	**Required:** `type`, `event`, `mode`, `totalIterations`, `verdict`, `activeP0`, `activeP1`, `activeP2`, `dimensionCoverage`, `stopReason`, `timestamp`
   232	
   233	### Verdict Rules
   234	
   235	| Verdict | Condition | Next Command |
   236	|---------|-----------|--------------|

codex
I’m doing one extra pass on reducer scale before writing the synthesis: not just “what the code says,” but how its current algorithm behaves on larger historical packets. That should make the snapshot/compaction recommendations a lot more grounded.
exec
/bin/zsh -lc 'for d in .opencode/specs/skilled-agent-orchestration/*/research/iterations; do c=$(find "$d" -maxdepth 1 -name '"'iteration-*.md' | wc -l | tr -d ' '); if [ \""'$c" -ge 40 ]; then printf '"'%s %s\\n' \""'$c" "$d"; fi; done | sort -nr | sed -n '"'1,20p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
90 .opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/research/iterations

exec
/bin/zsh -lc "node -e \"const { performance } = require('node:perf_hooks'); const { reduceResearchState } = require('./.opencode/skill/sk-deep-research/scripts/reduce-state.cjs'); const spec='.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1'; const t0=performance.now(); const result=reduceResearchState(spec,{write:false}); const t1=performance.now(); console.log(JSON.stringify({spec,iterations:result.registry.metrics.iterationsCompleted,openQuestions:result.registry.metrics.openQuestions,keyFindings:result.registry.metrics.keyFindings,ms:Number((t1-t0).toFixed(2))},null,2));\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "node -e \"const { performance } = require('node:perf_hooks'); const { reduceResearchState } = require('./.opencode/skill/sk-deep-research/scripts/reduce-state.cjs'); const spec='.opencode/specs/skilled-agent-orchestration/029-sk-deep-research-first-upgrade'; const t0=performance.now(); const result=reduceResearchState(spec,{write:false}); const t1=performance.now(); console.log(JSON.stringify({spec,iterations:result.registry.metrics.iterationsCompleted,openQuestions:result.registry.metrics.openQuestions,keyFindings:result.registry.metrics.keyFindings,ms:Number((t1-t0).toFixed(2))},null,2));\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:328
    throw new Error(`Missing anchor section ${anchorId} in strategy file`);
    ^

Error: Missing anchor section key-questions in strategy file
    at replaceAnchorSection (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:328:11)
    at updateStrategyContent (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:354:13)
    at reduceResearchState (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:498:20)
    at [eval]:1:291
    at runScriptInThisContext (node:internal/vm:219:10)
    at node:internal/process/execution:451:12
    at [eval]-wrapper:6:24
    at runScriptInContext (node:internal/process/execution:449:60)
    at evalFunction (node:internal/process/execution:283:30)
    at evalTypeScript (node:internal/process/execution:295:3)

Node.js v25.6.1

 exited 1 in 110ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:328
    throw new Error(`Missing anchor section ${anchorId} in strategy file`);
    ^

Error: Missing anchor section key-questions in strategy file
    at replaceAnchorSection (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:328:11)
    at updateStrategyContent (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:354:13)
    at reduceResearchState (/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:498:20)
    at [eval]:1:298
    at runScriptInThisContext (node:internal/vm:219:10)
    at node:internal/process/execution:451:12
    at [eval]-wrapper:6:24
    at runScriptInContext (node:internal/process/execution:449:60)
    at evalFunction (node:internal/process/execution:283:30)
    at evalTypeScript (node:internal/process/execution:295:3)

Node.js v25.6.1

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/assets/deep_review_dashboard.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/assets/deep_research_dashboard.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: Deep Review Dashboard
     3	description: Auto-generated review session overview, refreshed after each iteration from JSONL state and strategy.
     4	---
     5	
     6	# Deep Review Dashboard - Session Overview
     7	
     8	Auto-generated from JSONL state log and strategy file. Regenerated after every iteration evaluation. Never manually edited.
     9	
    10	<!-- ANCHOR:overview -->
    11	## 1. OVERVIEW
    12	
    13	### Purpose
    14	
    15	Provides a compact, human-readable summary of the current review session. Serves three roles:
    16	1. **Observability** — quick status check during long autonomous review runs
    17	2. **Recovery surface** — second recovery channel alongside JSONL after context compaction
    18	3. **Resume decision** — in confirm mode, shown to user before resume/restart/fork choice
    19	
    20	### Usage
    21	
    22	- **Location:** `{spec_folder}/review/deep-review-dashboard.md`
    23	- **Generated by:** Orchestrator (step_generate_dashboard in YAML workflow)
    24	- **Data sources:** `deep-review-state.jsonl` + `deep-review-strategy.md` + `deep-review-findings-registry.json`
    25	- **Protection:** `auto-generated` — overwritten each iteration, never manually edited
    26	
    27	---
    28	
    29	<!-- /ANCHOR:overview -->
    30	<!-- ANCHOR:status -->
    31	## 2. STATUS
    32	<!-- MACHINE-OWNED: START -->
    33	- Target: [from config.reviewTarget]
    34	- Target Type: [from config.reviewTargetType]
    35	- Started: [from config.createdAt]
    36	- Session: [from config.sessionId] (generation [from config.generation], lineage [from config.lineageMode])
    37	- Status: [ITERATING | CONVERGING | STUCK_RECOVERY | COMPLETE]
    38	- Release Readiness: [in-progress | converged | release-blocking]
    39	- Iteration: [N] of [maxIterations]
    40	- Provisional Verdict: [PASS | CONDITIONAL | FAIL | PENDING]
    41	- hasAdvisories: [true | false]
    42	<!-- MACHINE-OWNED: END -->
    43	
    44	---
    45	
    46	<!-- /ANCHOR:status -->
    47	<!-- ANCHOR:findings-summary -->
    48	## 3. FINDINGS SUMMARY
    49	<!-- MACHINE-OWNED: START -->
    50	- **P0 (Critical):** [N] active, [N] new this iteration, [N] upgrades, [N] resolved
    51	- **P1 (Major):** [N] active, [N] new this iteration, [N] upgrades, [N] resolved
    52	- **P2 (Minor):** [N] active, [N] new this iteration, [N] upgrades, [N] resolved
    53	- **Repeated findings:** [N]
    54	- **Dimensions covered:** [correctness, security, traceability, maintainability]
    55	- **Convergence score:** [0.00-1.00]
    56	<!-- MACHINE-OWNED: END -->
    57	
    58	---
    59	
    60	<!-- /ANCHOR:findings-summary -->
    61	<!-- ANCHOR:progress -->
    62	## 4. PROGRESS
    63	<!-- MACHINE-OWNED: START -->
    64	
    65	| # | Focus | Files | Dimensions | New P0/P1/P2 | Ratio | Status |
    66	|---|-------|-------|------------|---------------|-------|--------|
    67	| [per iteration from JSONL] |
    68	<!-- MACHINE-OWNED: END -->
    69	
    70	---
    71	
    72	<!-- /ANCHOR:progress -->
    73	<!-- ANCHOR:coverage -->
    74	## 5. COVERAGE
    75	<!-- MACHINE-OWNED: START -->
    76	- Files reviewed: [X] / [Y] total
    77	- Dimensions complete: [X] / 4 total
    78	- Core protocols complete: [X] / [Y] required
    79	- Overlay protocols complete: [X] / [Y] applicable
    80	<!-- MACHINE-OWNED: END -->
    81	
    82	---
    83	
    84	<!-- /ANCHOR:coverage -->
    85	<!-- ANCHOR:trend -->
    86	## 6. TREND
    87	<!-- MACHINE-OWNED: START -->
    88	- Severity trend (last 3): [P0:N P1:N P2:N -> P0:N P1:N P2:N -> P0:N P1:N P2:N]
    89	- New findings trend (last 3): [N -> N -> N] [increasing | stable | decreasing]
    90	- Traceability trend (last 3): [pass/partial/fail counts -> ...]
    91	<!-- MACHINE-OWNED: END -->
    92	
    93	---
    94	
    95	<!-- /ANCHOR:trend -->
    96	<!-- ANCHOR:resolved -->
    97	## 7. RESOLVED / RULED OUT
    98	<!-- MACHINE-OWNED: START -->
    99	- **Disproved findings:** [findings investigated and determined to be false positives]
   100	- **Dead-end review paths:** [review approaches that yielded no actionable results]
   101	<!-- MACHINE-OWNED: END -->
   102	
   103	---
   104	
   105	<!-- /ANCHOR:resolved -->
   106	<!-- ANCHOR:next-focus -->
   107	## 8. NEXT FOCUS
   108	<!-- MACHINE-OWNED: START -->
   109	[from strategy.md "Next Focus" section — next dimension, file set, or review lens]
   110	<!-- MACHINE-OWNED: END -->
   111	
   112	---
   113	
   114	<!-- /ANCHOR:next-focus -->
   115	<!-- ANCHOR:active-risks -->
   116	## 9. ACTIVE RISKS
   117	<!-- MACHINE-OWNED: START -->
   118	- [blockers, missing coverage, unresolved contradictions, gate violations, high stuck count, declining trend, etc.]
   119	<!-- MACHINE-OWNED: END -->
   120	<!-- /ANCHOR:active-risks -->

 succeeded in 0ms:
     1	---
     2	title: Deep Research Dashboard Template
     3	description: Template for the auto-generated dashboard file regenerated after every iteration from JSONL + strategy data. Provides human-readable session overview and recovery surface.
     4	---
     5	
     6	# Deep Research Dashboard - Session Overview
     7	
     8	Auto-generated from JSONL state log and strategy file. Regenerated after every iteration evaluation. Never manually edited.
     9	
    10	<!-- ANCHOR:overview -->
    11	## 1. OVERVIEW
    12	
    13	### Purpose
    14	
    15	Provides a compact, human-readable summary of the current research session. Serves three roles:
    16	1. **Observability** — quick status check during long autonomous runs
    17	2. **Recovery surface** — second recovery channel alongside JSONL after context compaction
    18	3. **Lifecycle decision** — in confirm mode, shown before `resume`, `restart`, `fork`, or `completed-continue`
    19	
    20	### Usage
    21	
    22	- **Location:** `{spec_folder}/research/deep-research-dashboard.md`
    23	- **Generated by:** Orchestrator (step_generate_dashboard in YAML workflow)
    24	- **Data sources:** `deep-research-state.jsonl` + `findings-registry.json` + `deep-research-strategy.md`
    25	- **Protection:** `auto-generated` — overwritten each iteration, never manually edited
    26	
    27	---
    28	
    29	<!-- /ANCHOR:overview -->
    30	<!-- ANCHOR:status -->
    31	## 2. STATUS
    32	- Topic: [from config]
    33	- Started: [from config.createdAt]
    34	- Status: [ITERATING | CONVERGING | STUCK_RECOVERY | COMPLETE]
    35	- Iteration: [N] of [maxIterations]
    36	- Session ID: [from config.lineage.sessionId]
    37	- Parent Session: [from config.lineage.parentSessionId or none]
    38	- Lifecycle Mode: [new | resume | restart | fork | completed-continue]
    39	- Generation: [from config.lineage.generation]
    40	
    41	---
    42	
    43	<!-- /ANCHOR:status -->
    44	<!-- ANCHOR:progress -->
    45	## 3. PROGRESS
    46	
    47	| # | Focus | Track | Ratio | Findings | Status |
    48	|---|-------|-------|-------|----------|--------|
    49	| [per iteration from JSONL] |
    50	
    51	- iterationsCompleted: [from findings registry metrics]
    52	- keyFindings: [from findings registry metrics]
    53	- openQuestions: [from findings registry metrics]
    54	- resolvedQuestions: [from findings registry metrics]
    55	
    56	---
    57	
    58	<!-- /ANCHOR:progress -->
    59	<!-- ANCHOR:questions -->
    60	## 4. QUESTIONS
    61	- Answered: [X/Y]
    62	- [x] Q1: [summary] (iteration N)
    63	- [ ] Q2: [remaining]
    64	
    65	---
    66	
    67	<!-- /ANCHOR:questions -->
    68	<!-- ANCHOR:trend -->
    69	## 5. TREND
    70	- Last 3 ratios: [0.XX -> 0.XX -> 0.XX] [improving | stable | declining]
    71	- Stuck count: [N]
    72	- Guard violations: [none | list]
    73	- convergenceScore: [from reducer metrics]
    74	- coverageBySources: [from reducer metrics]
    75	
    76	---
    77	
    78	<!-- /ANCHOR:trend -->
    79	<!-- ANCHOR:dead-ends -->
    80	## 6. DEAD ENDS
    81	- [approach]: [reason] (iteration N)
    82	
    83	---
    84	
    85	<!-- /ANCHOR:dead-ends -->
    86	<!-- ANCHOR:next-focus -->
    87	## 7. NEXT FOCUS
    88	[from strategy.md "Next Focus" section]
    89	
    90	---
    91	
    92	<!-- /ANCHOR:next-focus -->
    93	<!-- ANCHOR:active-risks -->
    94	## 8. ACTIVE RISKS
    95	- [guard violations, high stuck count, declining trend, etc.]
    96	- [migration events, reducer warnings, lifecycle conflicts]
    97	<!-- /ANCHOR:active-risks -->

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/SKILL.md | sed -n '300,440p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   300	| [deep_research_dashboard.md](assets/deep_research_dashboard.md) | Dashboard template | Auto-generated each iteration |
   301	
   302	---
   303	
   304	<!-- /ANCHOR:references -->
   305	<!-- ANCHOR:success-criteria -->
   306	## 6. SUCCESS CRITERIA
   307	
   308	### Loop Completion
   309	- Research loop ran to convergence or max iterations
   310	- All state files present and consistent (config, JSONL, strategy)
   311	- research/research.md produced with findings from all iterations
   312	- Memory context saved via generate-context.js
   313	
   314	### Quality Gates
   315	
   316	| Gate | Criteria | Blocking |
   317	|------|----------|----------|
   318	| **Pre-loop** | Config valid, strategy initialized, state log created | Yes |
   319	| **Per-iteration** | iteration-NNN.md written, JSONL appended, reducer refreshes strategy/dashboard/registry | Yes |
   320	| **Post-loop** | research/research.md exists with content, convergence report generated | Yes |
   321	| **Quality guards** | Source diversity (>=2), focus alignment, no single-weak-source | Yes |
   322	| **Memory save** | memory/*.md created via generate-context.js | No |
   323	
   324	### Convergence Report
   325	
   326	Every completed loop produces a convergence report:
   327	- Stop reason (converged, max_iterations, all_questions_answered, stuck_unrecoverable)
   328	- Total iterations completed
   329	- Questions answered ratio
   330	- Average newInfoRatio trend
   331	
   332	---
   333	
   334	<!-- /ANCHOR:success-criteria -->
   335	<!-- ANCHOR:integration-points -->
   336	## 7. INTEGRATION POINTS
   337	
   338	### Framework Integration
   339	
   340	This skill operates within the behavioral framework defined in CLAUDE.md.
   341	
   342	Key integrations:
   343	- **Gate 2**: Skill routing via `skill_advisor.py` (keywords: autoresearch, deep research)
   344	- **Gate 3**: File modifications require spec folder question per CLAUDE.md Gate 3
   345	- **Memory**: Context preserved via Spec Kit Memory MCP (generate-context.js)
   346	- **Orchestrator**: @orchestrate dispatches @deep-research as LEAF agent
   347	
   348	### Memory Integration
   349	
   350	```
   351	Before research:
   352	  memory_context({ input: topic, mode: "deep", intent: "understand" })
   353	  --> Loads prior research into strategy.md "Known Context"
   354	
   355	During research (each iteration):
   356	  Agent writes research/iterations/iteration-NNN.md
   357	  Agent appends research/deep-research-state.jsonl
   358	  Workflow reducer updates research/deep-research-strategy.md, research/findings-registry.json, and research/deep-research-dashboard.md
   359	  Runtime capability lookups resolve through assets/runtime_capabilities.json plus scripts/runtime-capabilities.cjs
   360	
   361	After research:
   362	  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder]
   363	  # No additional indexing step is part of the live workflow contract.
   364	```
   365	
   366	### Command Integration
   367	
   368	| Command | Relationship |
   369	|---------|-------------|
   370	| `/spec_kit:deep-research` | Primary invocation point |
   371	| `/spec_kit:plan` | Next step after deep research completes |
   372	| `/memory:save` | Manual memory save (deep research auto-saves) |
   373	
   374	---
   375	
   376	<!-- /ANCHOR:integration-points -->
   377	<!-- ANCHOR:related-resources -->
   378	## 8. RELATED RESOURCES
   379	
   380	### Worked Examples
   381	
   382	**Deep Research on Unknown Topic**:
   383	1. `/spec_kit:deep-research:auto "WebSocket reconnection strategies across browsers"`
   384	2. Init creates config, strategy with 5 key questions
   385	3. Iterations 1-3: Broad survey, official docs, codebase patterns
   386	4. Iterations 4-6: Deep dive into specific strategies, edge cases
   387	5. Iteration 7: Convergence detected after recent newInfoRatio values stay below the configured threshold
   388	6. Synthesis produces 17-section research/research.md
   389	7. Memory saved via generate-context.js
   390	
   391	**Narrow Research with Early Convergence**:
   392	1. `/spec_kit:deep-research:auto "What CSS properties trigger GPU compositing?"`
   393	2. Init creates config with 2 key questions
   394	3. Iteration 1: Finds definitive answer from official specs
   395	4. All questions answered after iteration 1
   396	5. Loop stops cleanly, research/research.md produced
   397	
   398	**Stuck Recovery Example**:
   399	1. Iterations 4-6 all have newInfoRatio below the configured threshold
   400	2. Stuck recovery triggers at iteration 7
   401	3. Recovery widens focus to least-explored question
   402	4. Iteration 7 finds new angle, newInfoRatio jumps to 0.4
   403	5. Loop continues productively
   404	
   405	### Design Origins
   406	
   407	| Innovation | Source | Our Adaptation |
   408	|------------|--------|----------------|
   409	| Autonomous loop | karpathy/autoresearch | YAML-driven loop with convergence |
   410	| Fresh context per iteration | AGR (Ralph Loop) | Orchestrator dispatch = fresh context |
   411	| STRATEGY.md persistent brain | AGR | deep-research-strategy.md |
   412	| JSONL state | pi-autoresearch | deep-research-state.jsonl |
   413	| Stuck detection | AGR | 3-consecutive-no-progress recovery |
   414	| Context injection | autoresearch-opencode | Strategy file as agent context |
   415	
   416	### Agents
   417	
   418	| Agent | Purpose |
   419	|-------|---------|
   420	| `@deep-research` | Single iteration executor (LEAF) |
   421	| `@orchestrate` | Loop coordination (when dispatched externally) |
   422	
   423	### Commands
   424	
   425	| Command | Purpose |
   426	|---------|---------|
   427	| `/spec_kit:deep-research` | Full loop workflow |
   428	| `/memory:save` | Manual context preservation |
   429	
   430	**For one-page cheat sheet**: See [quick_reference.md](./references/quick_reference.md)
   431	
   432	For code review capabilities, see `sk-deep-review`.
   433	<!-- /ANCHOR:related-resources -->

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/SKILL.md | sed -n '300,440p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   300	| **CONDITIONAL** | P1 findings present; remediation plan included in report |
   301	| **FAIL** | Any P0 finding confirmed after adversarial self-check |
   302	
   303	---
   304	
   305	<!-- /ANCHOR:how-it-works -->
   306	<!-- ANCHOR:rules -->
   307	## 4. RULES
   308	
   309	### ALWAYS
   310	
   311	1. **Read state first** — Agent must read JSONL and strategy.md before any review action.
   312	2. **One dimension focus per iteration** — Pick ONE review dimension from strategy.md "Next Focus"; never mix dimensions in a single iteration.
   313	3. **Externalize findings** — Write to `iteration-NNN.md` with P0/P1/P2 classifications; never hold findings only in agent context.
   314	4. **Update strategy** — Append dimension coverage to strategy.md "Covered" list, update "Next Focus" for the subsequent iteration.
   315	5. **Report newInfoRatio** — Every iteration JSONL record must include `newInfoRatio`.
   316	6. **Respect exhausted approaches** — Never re-review already-covered file+dimension combinations listed in strategy.md "Exhausted".
   317	7. **Cite sources** — Every finding must cite `[SOURCE: file:line]` with actual code evidence; inference-only findings are not accepted.
   318	8. **Use generate-context.js for memory saves** — Never manually create memory files; always use the script.
   319	9. **Review target files are read-only** — Never modify any file under review; observation and reporting only.
   320	10. **Run adversarial self-check on P0 findings** — Re-read the cited code before recording a P0 finding to confirm severity is genuine.
   321	11. **Report severity counts in every JSONL record** — `findingsSummary` (cumulative) and `findingsNew` (this iteration) are required fields.
   322	12. **Quality guards must pass before convergence** — Evidence completeness, scope alignment, no inference-only findings, severity coverage, and cross-reference checks must all pass (see `references/convergence.md` Section 10.4) before STOP can trigger.
   323	
   324	### NEVER
   325	
   326	1. **Dispatch sub-agents** — `@deep-review` is LEAF-only; it cannot dispatch additional agents.
   327	2. **Hold findings in context** — Write everything to iteration files; context is discarded after each dispatch.
   328	3. **Exceed TCB** — Target 8-11 tool calls per iteration (max 12); breadth over depth per cycle.
   329	4. **Ask the user** — Autonomous execution; the agent makes best-judgment decisions without pausing.
   330	5. **Skip convergence checks** — Every iteration must be evaluated against convergence criteria before the next dispatch.
   331	6. **Modify config after init** — `deep-review-config.json` is read-only after initialization.
   332	7. **Modify files under review** — The review loop is observation-only; no code changes during audit.
   333	8. **Use WebFetch** — Review is code-only; no external resource fetching is permitted.
   334	
   335	### Iteration Status Enum
   336	
   337	`complete | timeout | error | stuck | insight`
   338	
   339	- `insight`: Low newInfoRatio but important finding that changes the verdict trajectory.
   340	
   341	### ESCALATE IF
   342	
   343	1. **3+ consecutive timeouts** — Infrastructure issue; pause loop and report to user.
   344	2. **State file corruption** — Cannot reconstruct iteration history from JSONL or iteration files.
   345	3. **All dimensions covered with P0 findings remaining** — Human sign-off required before shipping.
   346	4. **Security vulnerabilities discovered in production code** — Escalate immediately; do not defer to report synthesis.
   347	5. **All recovery tiers exhausted** — No automatic recovery path remaining in convergence protocol.
   348	
   349	---
   350	
   351	<!-- /ANCHOR:rules -->
   352	<!-- ANCHOR:references -->
   353	## 5. REFERENCES
   354	
   355	### Core Documentation
   356	
   357	Local review-specific protocol documents:
   358	
   359	| Document | Purpose | Key Insight |
   360	|----------|---------|-------------|
   361	| [loop_protocol.md](references/loop_protocol.md) | Review loop lifecycle | Init, iterate, synthesize, save |
   362	| [state_format.md](references/state_format.md) | Review state schemas | JSONL + strategy + config |
   363	| [convergence.md](references/convergence.md) | Review convergence | `shouldContinue_review()`, quality guards |
   364	| [quick_reference.md](references/quick_reference.md) | Review cheat sheet | Commands, tuning, troubleshooting |
   365	
   366	### Local Templates
   367	
   368	| Template | Purpose | Usage |
   369	|----------|---------|-------|
   370	| [deep_review_config.json](assets/deep_review_config.json) | Review loop configuration | Copied to `{spec_folder}/review/` during init |
   371	| [deep_review_strategy.md](assets/deep_review_strategy.md) | Strategy file template | Copied to `{spec_folder}/review/` during init |
   372	| [deep_review_dashboard.md](assets/deep_review_dashboard.md) | Dashboard template | Auto-generated each review iteration |
   373	| [review_mode_contract.yaml](assets/review_mode_contract.yaml) | Review contract | Dimensions, gates, verdicts, quality guards |
   374	
   375	### Agent Runtime Paths
   376	
   377	| Runtime | Path |
   378	|---------|------|
   379	| OpenCode / Copilot | `.opencode/agent/deep-review.md` |
   380	| Claude | `.claude/agents/deep-review.md` |
   381	| Codex | `.codex/agents/deep-review.toml` |
   382	
   383	### Review YAML Workflows
   384	
   385	| Mode | Path |
   386	|------|------|
   387	| Auto (unattended) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |
   388	| Confirm (step-by-step) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
   389	
   390	---
   391	
   392	<!-- /ANCHOR:references -->
   393	<!-- ANCHOR:success-criteria -->
   394	## 6. SUCCESS CRITERIA
   395	
   396	### Loop Completion
   397	
   398	- Review loop ran to convergence or max iterations
   399	- All configured review dimensions have at least one iteration of coverage
   400	- All state files present and consistent (`config.json`, `state.jsonl`, `strategy.md`)
   401	- `review/review-report.md` produced with all 9 sections
   402	- Memory context saved via `generate-context.js`
   403	
   404	### Quality Gates
   405	
   406	| Gate | Criteria | Blocking |
   407	|------|----------|---------|
   408	| **Pre-loop** | Config valid, strategy initialized, state log created | Yes |
   409	| **Per-iteration** | `iteration-NNN.md` written, JSONL appended, strategy updated | Yes |
   410	| **Post-loop** | `review-report.md` exists with verdict and all sections | Yes |
   411	| **Quality guards** | Evidence completeness, scope alignment, no inference-only, severity coverage, cross-reference checks | Yes |
   412	| **Adversarial recheck** | All P0 findings re-confirmed via adversarial self-check | Yes |
   413	| **Memory save** | `memory/*.md` created via `generate-context.js` | No |
   414	
   415	### Review Mode Success Criteria
   416	
   417	| Criteria | Requirement |
   418	|----------|-------------|
   419	| Dimension coverage | All configured review dimensions reviewed with file-cited evidence |
   420	| Finding citations | All P0/P1 findings include `[SOURCE: file:line]` citations |
   421	| Report completeness | `{spec_folder}/review/review-report.md` has all 9 sections |
   422	| Verdict justification | PASS/CONDITIONAL/FAIL verdict justified with specific findings; PASS includes `hasAdvisories: true` metadata when P2 findings exist |
   423	| Adversarial recheck | Every P0 finding confirmed via adversarial self-check before final report |
   424	
   425	### Convergence Report
   426	
   427	Every completed loop produces a convergence report (embedded in `review-report.md` and JSONL):
   428	- Stop reason (`converged`, `max_iterations`, `all_dimensions_covered`, `stuck_unrecoverable`)
   429	- Total iterations completed
   430	- Dimension coverage ratio
   431	- P0/P1/P2 finding counts at convergence
   432	- Release-readiness state (`in-progress`, `converged`, `release-blocking`)
   433	
   434	---
   435	
   436	<!-- /ANCHOR:success-criteria -->
   437	<!-- ANCHOR:integration-points -->
   438	## 7. INTEGRATION POINTS
   439	
   440	### Framework Integration

Context loaded from packet docs and current runtime surfaces. I’m synthesizing the 10 requested research iterations into findings-first notes, then I’ll produce the overall recommendations and spec-change suggestions.
  ✓ Load memory context, route applicable skills, and inspect the Phase 1 packet docs
  ✓ Read current deep-research/deep-review runtime files, workflows, reducer, dashboards, and agent contracts
  → Map the 10 research questions to concrete evidence and extract edge cases, drift, and risks
  • Write the final 10-iteration research output plus synthesis and suggested spec changes
codex
Grounded in the Phase 1 packet, direct runtime files, and repo-wide `rg` sweeps. CocoIndex MCP calls returned canceled in this session, so the codebase search portions below use direct repository evidence.

1. **Stop-Reason Taxonomy**
Focus: whether Phase 1’s proposed 6-value enum matches real stop behavior today.
- The packet wants `max_iterations`, `converged`, `all_dimensions_clean`, `insufficient_evidence`, `user_stopped`, and `error_budget_exhausted` as the shared enum [spec.md:161](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md#L161).
- Deep research still emits older reasons: `max_iterations_reached`, `all_questions_answered`, `composite_converged`, and `stuck_unrecoverable` in both the algorithm and convergence report [convergence.md:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L31) [convergence.md:606](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L606).
- Deep review is split between `all_dimensions_clean` and `composite_converged`, while `SKILL.md` still advertises `all_dimensions_covered` and `stuck_unrecoverable` [convergence.md:693](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L693) [SKILL.md:428](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md#L428).
- `user_stopped` is not a terminal stop reason today; the system logs `paused`/`resumed` events instead [state_format.md:238](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md#L238) [loop_protocol.md:129](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md#L129).
Novel insight: the proposed enum is not complete unless it distinguishes terminal reason from interruption state; `paused`/`resumed` are lifecycle events, not stop reasons.
Open questions: Should `all_questions_answered` become `converged` detail, or remain a first-class reason? Does `stuck_unrecoverable` map to `insufficient_evidence` or need its own terminal detail field?

2. **Legal Done Gates**
Focus: false-positive STOP and false-negative looping risks.
- Research hard-stops on `all_questions_answered` before quality guards run, so a single weak answer set can still terminate legally in the current pseudocode [convergence.md:35](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L35) [convergence.md:115](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L115).
- The research loop protocol says guards apply to STOP decisions generally, but the algorithm text only overrides composite STOP, not the hard-stop branches [loop_protocol.md:115](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md#L115) [spec_kit_deep-research_auto.yaml:271](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml#L271).
- Review is stronger because both `all_dimensions_clean` and composite STOP route through gates, but blocked-stop only downgrades to CONTINUE; it does not yet emit the typed blocked-stop trace Phase 1 asks for [convergence.md:691](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L691) [convergence.md:742](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L742).
- False negatives are possible because `thought` iterations are invisible to stuck counting, so repeated meta-iterations can avoid both STOP and recovery escalation [convergence.md:66](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L66) [SKILL.md:337](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md#L337).
Novel insight: Phase 1 should define a legal-stop wrapper that governs every terminal reason, not only convergence math.
Open questions: Should `all_questions_answered` and `max_iterations` also require a replayable gate record? Should too many `thought` iterations become an error-budget case?

3. **Resume Semantics**
Focus: actual behavior of `resume`, `restart`, `fork`, and `completed-continue`.
- Research has the lineage model in config and docs, including `continuedFromRun` [deep_research_config.json:14](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/assets/deep_research_config.json#L14) [state_format.md:77](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md#L77).
- Research auto YAML classifies `fresh | resume | completed-session | invalid-state`, but `on_completed_session` jumps to synthesis instead of explicitly performing a reopen branch; confirm mode exposes the operator choice more honestly [spec_kit_deep-research_auto.yaml:134](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml#L134) [loop_protocol.md:88](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md#L88).
- Review has the same lifecycle terms in contract and docs, but YAML writes lineage as top-level config fields while research nests it under `lineage`, so the two products already diverge structurally [review_mode_contract.yaml:147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml#L147) [spec_kit_deep-review_auto.yaml:227](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L227).
- There is also older review drift inside the research loop protocol, which still names `deep-research-config.json` and `deep-research-state.jsonl` under `review/` [loop_protocol.md:584](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md#L584).
Novel insight: lifecycle vocabulary exists, but executable reopen behavior is still asymmetric and partly doc-only.
Open questions: Is `completed-continue` a synthesis-phase branch, an init-phase branch, or both? Should both products normalize on nested lineage metadata?

4. **Audit Journals**
Focus: what is worth recording beyond current JSONL events.
- Research already logs lifecycle and diagnostic events like `resumed`, `paused`, `stuck_recovery`, `guard_violation`, and `synthesis_complete` [state_format.md:234](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md#L234).
- The Phase 1 requirement is materially broader: it wants reads, searches, evidence extraction, rotation decisions, and convergence inputs, which are not preserved as a canonical journal artifact today [spec.md:164](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md#L164).
- Review captures some traceability detail inside iteration records, but not a separate append-only journal stream [deep-review.md:234](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L234) [review_mode_contract.yaml:305](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml#L305).
- Noise risk is high if every tool call becomes canonical; the useful boundary is “decision-relevant provenance,” not raw transcript.
Novel insight: the journal should be a second append-only channel optimized for replay and audits, not a dump of agent chatter.
Open questions: Should journal rows be per action, per evidence claim, or per iteration summary? Should replay consume the journal directly or only summarized reducer outputs?

5. **Dashboard Gaps**
Focus: what current dashboards show versus what operators actually need.
- Research dashboard surfaces status, progress, questions, trends, dead ends, next focus, and active risks; it does not expose lifecycle boundary, blocked-stop history, time budgets, or tool/source histograms [deep_research_dashboard.md:30](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md#L30).
- The reducer already computes `convergenceScore` and `coverageBySources`, but it hardcodes “Guard violations: none recorded” and only infers stuck count from the latest status, which can under-report risk [reduce-state.cjs:244](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L244) [reduce-state.cjs:437](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L437).
- Review dashboard is closer to operator needs because it includes readiness, findings, coverage, and trends, but the YAML renderer still omits stop-decision drill-down and timing/token data [deep_review_dashboard.md:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md#L31) [spec_kit_deep-review_auto.yaml:477](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L477).
Novel insight: the current dashboards are session summaries, not runtime truth consoles; Phase 2a should prioritize drill-down and replay clues over more cosmetic summary rows.
Open questions: Which metrics belong inline versus behind a “forensics” section? Is token visibility per iteration enough, or do operators need per-tool breakdowns?

6. **Claim Verification Ledger**
Focus: whether JSONL is the right canonical store and what prevents false verification.
- ADR-002 picks JSONL plus rendered summaries, which fits append-only packet-local flow [decision-record.md:115](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md#L115).
- Current deep-research runtime has no ledger artifact, no status transition model, and no reducer logic for claim states; `reduce-state.cjs` only builds question/finding summaries from iteration files and JSONL [reduce-state.cjs:251](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L251).
- Deep-review already has a strong typed claim-adjudication packet for new P0/P1, but that is per-finding evidence hygiene, not a reusable ledger [deep-review.md:124](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L124) [spec_kit_deep-review_auto.yaml:457](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L457).
Novel insight: JSONL is the right storage choice, but only if claims get stable IDs and monotonic transitions like `unresolved -> verified` or `unresolved -> contradicted`.
Open questions: Is verification actor always the orchestrator, or can the leaf agent author provisional claims? Should “verified” require independent-source diversity by policy?

7. **Phase Ordering**
Focus: whether behavior testing belongs before parity.
- The revised plan intentionally moves behavior/replay verification earlier so it can protect contract work “soon after the shared runtime foundation lands” [plan.md:34](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md#L34) [plan.md:215](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md#L215).
- The completion criteria reinforce that replay harness work should start once Phase 1 is stable and stay ahead of parity lock [tasks.md:200](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md#L200).
- Testing against unstable contracts does create churn risk, but parity-first is worse here because the repo already contains real drift in stop labels, lineage shape, and reducer ownership.
Novel insight: the right sequence is not “behavior before contracts,” but “behavior immediately after Phase 1 contract lock and before documentation/mirror freeze.”
Open questions: Should Phase 3 start with only replay fixtures for lifecycle and blocked-stop, leaving semantic convergence fixtures until Phase 2b lands?

8. **Reducer Architecture**
Focus: current reducer design and its 50+ iteration implications.
- The reducer is full-replay and synchronous: it re-reads config, JSONL, strategy, and every iteration markdown file on each pass [reduce-state.cjs:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L18) [reduce-state.cjs:475](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L475).
- It then rebuilds registry, rewrites strategy machine sections, and regenerates the full dashboard every time [reduce-state.cjs:334](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L334) [reduce-state.cjs:369](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L369).
- The bigger immediate risk is schema brittleness, not CPU: a local dry-run against the 90-iteration packet `040` failed because `updateStrategyContent()` requires anchor sections like `key-questions`, so replay over older packets can break before scale becomes the issue [reduce-state.cjs:317](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L317).
Novel insight: Phase 2a needs compatibility-graded replay before it needs heavy optimization; otherwise snapshot/compaction will still be blocked by anchor fragility.
Open questions: Should compaction snapshot the reduced registry only, or also a normalized strategy shadow to avoid markdown-anchor dependence?

9. **Agent Instruction Quality**
Focus: whether fresh-context agents can produce correct records without drift.
- Deep research is fairly clear on write boundaries and required JSONL fields, but it conflicts with `state_format.md`, which still marks `noveltyJustification` optional while the agent says it is required [deep-research.md:182](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-research.md#L182) [state_format.md:149](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md#L149).
- Deep review is more ambiguous: the agent is told to edit strategy directly every iteration, while the contract and reducer boundary increasingly treat machine surfaces as reducer-owned [deep-review.md:221](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L221) [review_mode_contract.yaml:254](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml#L254).
- `sk-deep-review/SKILL.md` still says “Report newInfoRatio” even though the rest of the stack uses `newFindingsRatio`, which is exactly the kind of fresh-context drift that produces malformed records [SKILL.md:315](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md#L315).
Novel insight: the highest-value Phase 1 cleanup may be instruction tightening, because a cleaner event schema still fails if leaf agents are told the wrong field names or ownership rules.
Open questions: Should the agents emit only iteration file + JSONL, leaving all strategy mutation to reducer/orchestrator? Should examples be generated from the contracts instead of hand-authored?

10. **Cross-Loop Consistency**
Focus: intentional product differences versus accidental drift.
- Intentional divergence is healthy: research allows broader evidence gathering and question coverage, while review adds claim adjudication, release readiness, and dimension/protocol coverage [deep-research.md:102](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-research.md#L102) [deep-review.md:318](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L318).
- Accidental drift is substantial: research uses nested `lineage`, review uses top-level lineage fields; research has an executable reducer, review mostly has a contract placeholder; stop labels differ across skills, convergence docs, and YAML [deep_research_config.json:14](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/assets/deep_research_config.json#L14) [review_mode_contract.yaml:159](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml#L159).
- There is also mixed naming drift in old shared docs, especially the review section embedded inside research protocol [loop_protocol.md:584](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md#L584) [loop_protocol.md:652](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md#L652).
Novel insight: the repo wants “shared substrate with product overlays,” but today it still behaves like two semi-forked contracts with partial backports.
Open questions: Is the right fix a shared deep-loop runtime contract file, or generated artifacts from separate canonical manifests per product?

**Synthesis**
Top recommendations:
- Make Phase 1 define a two-part stop contract: `stopReason` enum plus a typed `legalStop` record with `blockedBy`, `gateResults`, and replay inputs.
- Normalize lifecycle execution, not just terminology: both loops should share one lineage shape, one `resumed` event shape, and one explicit `completed-continue` branch.
- Treat journals and ledgers as separate packet-local append-only artifacts. Do not overload iteration JSONL with every provenance concern.
- Tighten agent instructions before broader runtime work. Fresh-context drift is already visible in field names, ownership boundaries, and strategy-edit expectations.
- Start behavior fixtures immediately after Phase 1 lock, but scope the first wave to lifecycle, blocked-stop, and replay before semantic-convergence expansion.

Gaps found:
- Phase 1 spec is asking for “blocked-stop events,” but current docs and YAML mostly describe guard override as a CONTINUE side effect, not a first-class persisted decision.
- The current reducer cannot safely replay at least one older large packet without anchor-shape assumptions failing.
- Review contract maturity is uneven: strong contract manifest, but more doc/YAML drift than research in some places.

Suggested spec changes:
- Change REQ-001 from a flat enum-only requirement to “enum + detail fields + mapping table from legacy reasons.”
- Split REQ-002 into “legal-stop gate” and “blocked-stop persistence/replay contract.”
- Clarify REQ-003 so `continuedFromRun` semantics cover active resume and completed-continue consistently.
- Pull journal schema into Phase 2a explicitly as a separate artifact, and move ledger transition rules into Phase 2b.
- Add a Phase 1 instruction-cleanup subtask for agent field names, reducer ownership boundaries, and generated examples.


hook: Stop
hook: Stop Completed
tokens used
210,617
Grounded in the Phase 1 packet, direct runtime files, and repo-wide `rg` sweeps. CocoIndex MCP calls returned canceled in this session, so the codebase search portions below use direct repository evidence.

1. **Stop-Reason Taxonomy**
Focus: whether Phase 1’s proposed 6-value enum matches real stop behavior today.
- The packet wants `max_iterations`, `converged`, `all_dimensions_clean`, `insufficient_evidence`, `user_stopped`, and `error_budget_exhausted` as the shared enum [spec.md:161](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md#L161).
- Deep research still emits older reasons: `max_iterations_reached`, `all_questions_answered`, `composite_converged`, and `stuck_unrecoverable` in both the algorithm and convergence report [convergence.md:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L31) [convergence.md:606](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L606).
- Deep review is split between `all_dimensions_clean` and `composite_converged`, while `SKILL.md` still advertises `all_dimensions_covered` and `stuck_unrecoverable` [convergence.md:693](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L693) [SKILL.md:428](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md#L428).
- `user_stopped` is not a terminal stop reason today; the system logs `paused`/`resumed` events instead [state_format.md:238](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md#L238) [loop_protocol.md:129](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md#L129).
Novel insight: the proposed enum is not complete unless it distinguishes terminal reason from interruption state; `paused`/`resumed` are lifecycle events, not stop reasons.
Open questions: Should `all_questions_answered` become `converged` detail, or remain a first-class reason? Does `stuck_unrecoverable` map to `insufficient_evidence` or need its own terminal detail field?

2. **Legal Done Gates**
Focus: false-positive STOP and false-negative looping risks.
- Research hard-stops on `all_questions_answered` before quality guards run, so a single weak answer set can still terminate legally in the current pseudocode [convergence.md:35](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L35) [convergence.md:115](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L115).
- The research loop protocol says guards apply to STOP decisions generally, but the algorithm text only overrides composite STOP, not the hard-stop branches [loop_protocol.md:115](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md#L115) [spec_kit_deep-research_auto.yaml:271](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml#L271).
- Review is stronger because both `all_dimensions_clean` and composite STOP route through gates, but blocked-stop only downgrades to CONTINUE; it does not yet emit the typed blocked-stop trace Phase 1 asks for [convergence.md:691](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L691) [convergence.md:742](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L742).
- False negatives are possible because `thought` iterations are invisible to stuck counting, so repeated meta-iterations can avoid both STOP and recovery escalation [convergence.md:66](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/convergence.md#L66) [SKILL.md:337](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md#L337).
Novel insight: Phase 1 should define a legal-stop wrapper that governs every terminal reason, not only convergence math.
Open questions: Should `all_questions_answered` and `max_iterations` also require a replayable gate record? Should too many `thought` iterations become an error-budget case?

3. **Resume Semantics**
Focus: actual behavior of `resume`, `restart`, `fork`, and `completed-continue`.
- Research has the lineage model in config and docs, including `continuedFromRun` [deep_research_config.json:14](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/assets/deep_research_config.json#L14) [state_format.md:77](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md#L77).
- Research auto YAML classifies `fresh | resume | completed-session | invalid-state`, but `on_completed_session` jumps to synthesis instead of explicitly performing a reopen branch; confirm mode exposes the operator choice more honestly [spec_kit_deep-research_auto.yaml:134](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml#L134) [loop_protocol.md:88](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md#L88).
- Review has the same lifecycle terms in contract and docs, but YAML writes lineage as top-level config fields while research nests it under `lineage`, so the two products already diverge structurally [review_mode_contract.yaml:147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml#L147) [spec_kit_deep-review_auto.yaml:227](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L227).
- There is also older review drift inside the research loop protocol, which still names `deep-research-config.json` and `deep-research-state.jsonl` under `review/` [loop_protocol.md:584](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md#L584).
Novel insight: lifecycle vocabulary exists, but executable reopen behavior is still asymmetric and partly doc-only.
Open questions: Is `completed-continue` a synthesis-phase branch, an init-phase branch, or both? Should both products normalize on nested lineage metadata?

4. **Audit Journals**
Focus: what is worth recording beyond current JSONL events.
- Research already logs lifecycle and diagnostic events like `resumed`, `paused`, `stuck_recovery`, `guard_violation`, and `synthesis_complete` [state_format.md:234](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md#L234).
- The Phase 1 requirement is materially broader: it wants reads, searches, evidence extraction, rotation decisions, and convergence inputs, which are not preserved as a canonical journal artifact today [spec.md:164](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md#L164).
- Review captures some traceability detail inside iteration records, but not a separate append-only journal stream [deep-review.md:234](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L234) [review_mode_contract.yaml:305](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml#L305).
- Noise risk is high if every tool call becomes canonical; the useful boundary is “decision-relevant provenance,” not raw transcript.
Novel insight: the journal should be a second append-only channel optimized for replay and audits, not a dump of agent chatter.
Open questions: Should journal rows be per action, per evidence claim, or per iteration summary? Should replay consume the journal directly or only summarized reducer outputs?

5. **Dashboard Gaps**
Focus: what current dashboards show versus what operators actually need.
- Research dashboard surfaces status, progress, questions, trends, dead ends, next focus, and active risks; it does not expose lifecycle boundary, blocked-stop history, time budgets, or tool/source histograms [deep_research_dashboard.md:30](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md#L30).
- The reducer already computes `convergenceScore` and `coverageBySources`, but it hardcodes “Guard violations: none recorded” and only infers stuck count from the latest status, which can under-report risk [reduce-state.cjs:244](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L244) [reduce-state.cjs:437](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L437).
- Review dashboard is closer to operator needs because it includes readiness, findings, coverage, and trends, but the YAML renderer still omits stop-decision drill-down and timing/token data [deep_review_dashboard.md:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md#L31) [spec_kit_deep-review_auto.yaml:477](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L477).
Novel insight: the current dashboards are session summaries, not runtime truth consoles; Phase 2a should prioritize drill-down and replay clues over more cosmetic summary rows.
Open questions: Which metrics belong inline versus behind a “forensics” section? Is token visibility per iteration enough, or do operators need per-tool breakdowns?

6. **Claim Verification Ledger**
Focus: whether JSONL is the right canonical store and what prevents false verification.
- ADR-002 picks JSONL plus rendered summaries, which fits append-only packet-local flow [decision-record.md:115](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/decision-record.md#L115).
- Current deep-research runtime has no ledger artifact, no status transition model, and no reducer logic for claim states; `reduce-state.cjs` only builds question/finding summaries from iteration files and JSONL [reduce-state.cjs:251](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L251).
- Deep-review already has a strong typed claim-adjudication packet for new P0/P1, but that is per-finding evidence hygiene, not a reusable ledger [deep-review.md:124](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L124) [spec_kit_deep-review_auto.yaml:457](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml#L457).
Novel insight: JSONL is the right storage choice, but only if claims get stable IDs and monotonic transitions like `unresolved -> verified` or `unresolved -> contradicted`.
Open questions: Is verification actor always the orchestrator, or can the leaf agent author provisional claims? Should “verified” require independent-source diversity by policy?

7. **Phase Ordering**
Focus: whether behavior testing belongs before parity.
- The revised plan intentionally moves behavior/replay verification earlier so it can protect contract work “soon after the shared runtime foundation lands” [plan.md:34](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md#L34) [plan.md:215](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md#L215).
- The completion criteria reinforce that replay harness work should start once Phase 1 is stable and stay ahead of parity lock [tasks.md:200](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md#L200).
- Testing against unstable contracts does create churn risk, but parity-first is worse here because the repo already contains real drift in stop labels, lineage shape, and reducer ownership.
Novel insight: the right sequence is not “behavior before contracts,” but “behavior immediately after Phase 1 contract lock and before documentation/mirror freeze.”
Open questions: Should Phase 3 start with only replay fixtures for lifecycle and blocked-stop, leaving semantic convergence fixtures until Phase 2b lands?

8. **Reducer Architecture**
Focus: current reducer design and its 50+ iteration implications.
- The reducer is full-replay and synchronous: it re-reads config, JSONL, strategy, and every iteration markdown file on each pass [reduce-state.cjs:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L18) [reduce-state.cjs:475](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L475).
- It then rebuilds registry, rewrites strategy machine sections, and regenerates the full dashboard every time [reduce-state.cjs:334](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L334) [reduce-state.cjs:369](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L369).
- The bigger immediate risk is schema brittleness, not CPU: a local dry-run against the 90-iteration packet `040` failed because `updateStrategyContent()` requires anchor sections like `key-questions`, so replay over older packets can break before scale becomes the issue [reduce-state.cjs:317](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/scripts/reduce-state.cjs#L317).
Novel insight: Phase 2a needs compatibility-graded replay before it needs heavy optimization; otherwise snapshot/compaction will still be blocked by anchor fragility.
Open questions: Should compaction snapshot the reduced registry only, or also a normalized strategy shadow to avoid markdown-anchor dependence?

9. **Agent Instruction Quality**
Focus: whether fresh-context agents can produce correct records without drift.
- Deep research is fairly clear on write boundaries and required JSONL fields, but it conflicts with `state_format.md`, which still marks `noveltyJustification` optional while the agent says it is required [deep-research.md:182](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-research.md#L182) [state_format.md:149](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/state_format.md#L149).
- Deep review is more ambiguous: the agent is told to edit strategy directly every iteration, while the contract and reducer boundary increasingly treat machine surfaces as reducer-owned [deep-review.md:221](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L221) [review_mode_contract.yaml:254](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml#L254).
- `sk-deep-review/SKILL.md` still says “Report newInfoRatio” even though the rest of the stack uses `newFindingsRatio`, which is exactly the kind of fresh-context drift that produces malformed records [SKILL.md:315](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/SKILL.md#L315).
Novel insight: the highest-value Phase 1 cleanup may be instruction tightening, because a cleaner event schema still fails if leaf agents are told the wrong field names or ownership rules.
Open questions: Should the agents emit only iteration file + JSONL, leaving all strategy mutation to reducer/orchestrator? Should examples be generated from the contracts instead of hand-authored?

10. **Cross-Loop Consistency**
Focus: intentional product differences versus accidental drift.
- Intentional divergence is healthy: research allows broader evidence gathering and question coverage, while review adds claim adjudication, release readiness, and dimension/protocol coverage [deep-research.md:102](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-research.md#L102) [deep-review.md:318](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/agent/deep-review.md#L318).
- Accidental drift is substantial: research uses nested `lineage`, review uses top-level lineage fields; research has an executable reducer, review mostly has a contract placeholder; stop labels differ across skills, convergence docs, and YAML [deep_research_config.json:14](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/assets/deep_research_config.json#L14) [review_mode_contract.yaml:159](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml#L159).
- There is also mixed naming drift in old shared docs, especially the review section embedded inside research protocol [loop_protocol.md:584](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md#L584) [loop_protocol.md:652](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/references/loop_protocol.md#L652).
Novel insight: the repo wants “shared substrate with product overlays,” but today it still behaves like two semi-forked contracts with partial backports.
Open questions: Is the right fix a shared deep-loop runtime contract file, or generated artifacts from separate canonical manifests per product?

**Synthesis**
Top recommendations:
- Make Phase 1 define a two-part stop contract: `stopReason` enum plus a typed `legalStop` record with `blockedBy`, `gateResults`, and replay inputs.
- Normalize lifecycle execution, not just terminology: both loops should share one lineage shape, one `resumed` event shape, and one explicit `completed-continue` branch.
- Treat journals and ledgers as separate packet-local append-only artifacts. Do not overload iteration JSONL with every provenance concern.
- Tighten agent instructions before broader runtime work. Fresh-context drift is already visible in field names, ownership boundaries, and strategy-edit expectations.
- Start behavior fixtures immediately after Phase 1 lock, but scope the first wave to lifecycle, blocked-stop, and replay before semantic-convergence expansion.

Gaps found:
- Phase 1 spec is asking for “blocked-stop events,” but current docs and YAML mostly describe guard override as a CONTINUE side effect, not a first-class persisted decision.
- The current reducer cannot safely replay at least one older large packet without anchor-shape assumptions failing.
- Review contract maturity is uneven: strong contract manifest, but more doc/YAML drift than research in some places.

Suggested spec changes:
- Change REQ-001 from a flat enum-only requirement to “enum + detail fields + mapping table from legacy reasons.”
- Split REQ-002 into “legal-stop gate” and “blocked-stop persistence/replay contract.”
- Clarify REQ-003 so `continuedFromRun` semantics cover active resume and completed-continue consistently.
- Pull journal schema into Phase 2a explicitly as a separate artifact, and move ledger transition rules into Phase 2b.
- Add a Phase 1 instruction-cleanup subtask for agent field names, reducer ownership boundaries, and generated examples.


