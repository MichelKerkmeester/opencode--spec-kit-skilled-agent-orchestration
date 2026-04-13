---
iteration: 3
dimension: traceability
sessionId: rvw-2026-04-12T11-30-00Z
engine: codex-gpt-5.4-high-fast
startedAt: 2026-04-12T09:43:05Z
completedAt: 2026-04-12T09:48:47Z
---

# Deep Review Iteration 003 — traceability

**Focus:** Phase 001-002 spec-code alignment: verify .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md claims match the actual reduce-state.cjs and runtime-capabilities.cjs implementations. Cross-check references/ docs (state_format.md, loop_protocol.md, convergence.md) for both sk-deep-research and sk-deep-review.

---

Reading additional input from stdin...
OpenAI Codex v0.120.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d8112-c910-70a3-97fe-f3a74dc58d23
--------
user
You are a senior code reviewer executing iteration 3 of a 20-iteration deep review session (ID: rvw-2026-04-12T11-30-00Z).

TARGET: Spec folder 042-sk-deep-research-review-improvement-2 and all implementation code it references.
This bundle delivered runtime truth, semantic coverage graph, wave execution, and offline optimization across ~200 files and +19K lines for sk-deep-research, sk-deep-review, and sk-improve-agent.

DIMENSION: traceability
FOCUS: Phase 001-002 spec-code alignment: verify .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md claims match the actual reduce-state.cjs and runtime-capabilities.cjs implementations. Cross-check references/ docs (state_format.md, loop_protocol.md, convergence.md) for both sk-deep-research and sk-deep-review.

INSTRUCTIONS:
1. Read the files mentioned in the focus area carefully.
2. Review for traceability issues at P0 (critical/blocking), P1 (significant), P2 (minor) severity.
3. For each finding, provide:
   - Finding ID: F-003-NNN (sequential within this iteration)
   - Severity: P0, P1, or P2
   - Dimension: traceability
   - File: exact file path
   - Line: line number(s) if applicable
   - Title: brief descriptive title
   - Description: detailed explanation of the issue
   - Evidence: relevant code snippet or reference
   - Recommendation: specific fix or improvement

4. After listing all findings, provide:
   - ITERATION SUMMARY: total findings, breakdown by severity
   - COVERAGE ASSESSMENT: what percentage of the focus area was reviewed
   - CONFIDENCE: your confidence in the completeness of this iteration (low/medium/high)
   - NEXT PRIORITIES: what should the next iteration examine that you could not cover

Be thorough and precise. Cite exact file paths and line numbers. Do not report findings that require subjective style preferences — focus on functional correctness, security, traceability, and maintainability risks.

Prior session context: A previous 10-iteration review (rvw-2026-04-11T13-50-06Z) found 16 findings (0 P0 / 10 P1 / 6 P2) with CONDITIONAL verdict. That review led to a 5-lane remediation (REQ-026 through REQ-034). This session validates the remediation AND examines areas not previously covered.
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only deep review pass focused on traceability in Phase 001-002. I’ll start by loading any relevant project memory and routing guidance, then I’ll read the spec, runtime files, and referenced docs closely before I assess findings.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "042-sk-deep-research-review-improvement-2|runtime truth|reduce-state|runtime-capabilities|traceability|sk-deep-review|sk-deep-research" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
111:- 003-modus-memory-main, dont ask for spec folder, auto mode, validate.sh --strict, research/iterations/iteration-NNN.md, reduce-state.cjs, deep-research-config.json, deep-research-state.jsonl, deep-research-strategy.md, max 6 agent threads
153:- safe continuation sequence: validate packet shape first, repair missing Level 3 docs if needed, preserve existing synthesis/legacy transcripts, extend iterations, run `reduce-state.cjs`, then sync packet docs and rerun strict validation [Task 2][Task 3][Task 5]
276:- packet 002 status/traceability must reflect real downstream readiness; once the 010 validator exists, document 002 as “Implemented — predecessor verified” instead of blocked to avoid traceability P1 findings [Task 1]
280:- packet 013 benchmark evidence should cite `38/40` combined benchmark in checklist/report surfaces; stale `pass 28` wording is a known traceability finding trigger [Task 1]
558:- 003-contextador, spec_kit:deep-research, maxIterations 20, deep-research-config.json, reduce-state.cjs, research-v2.md, recommendations-v2.md, findings-registry-v2.json, F-CROSS-089..F-CROSS-093
636:- deep-research extension runbook: align `maxIterations` in config/state/strategy first, keep lineage/execution mode unchanged, run reducer after each iteration (`node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs {spec_folder}`), then refresh synthesis/registry/dashboard artifacts [Task 2]
896:## Task 1: Extend deep-research wave to 90 iterations and author recommendation docs for sk-deep-research/sk-deep-review, outcome success
904:- 90 iterations, recommendations-sk-deep-research.md, recommendations-sk-deep-review.md, deep-research-state.jsonl, synthesis_complete, external wave
906:## Task 2: Complete phase `001-sk-deep-research-improvements` contract hardening and packet-local changelog, outcome success
914:- runtime-capabilities.cjs, reduce-state.cjs, runtime_capabilities.json, deep-research-reducer.vitest.ts, changelog-028-001-sk-deep-research-improvements.md
916:## Task 3: Complete phase `002-sk-deep-review-improvements` contract hardening and manual packet-local changelog fallback, outcome success
1916:# Task Group: Documentation Enforcement Wiring and sk-deep-research Playbook Packaging
1930:## Task 2: Build sk-deep-research manual testing playbook (index + per-feature snippets)

exec
/bin/zsh -lc 'python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "Deep review iteration 3 for spec folder 042-sk-deep-research-review-improvement-2 traceability focus on 001-runtime-truth-foundation spec.md vs reduce-state.cjs runtime-capabilities.cjs and referenced docs state_format.md loop_protocol.md convergence.md for sk-deep-research and sk-deep-review" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 421ms:
python3: error: couldn't create cache file '/tmp/xcrun_db-2VwJ4svQ' (errno=Operation not permitted)
[
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep review(phrase), !sk-deep-review(explicit), convergence, deep(name), iteration"
  },
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !convergence, !sk-deep-research(explicit), convergence, deep(name), iteration"
  },
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !folder, !spec, documentation, document~, folder"
  },
  {
    "skill": "command-create-folder-readme",
    "kind": "command",
    "confidence": 0.89,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, create(name), documentation, document~, folder(name)"
  }
]

codex
I’ve got the routing signal: `sk-deep-review` is the right review workflow here, with the earlier memory index pointing at prior remediation work around `reduce-state.cjs` and `runtime-capabilities.cjs`. Next I’m locating the exact spec and doc surfaces, then I’ll compare their claims against the live runtime code line by line.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '900,920p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
- rollout_summaries/2026-04-03T06-52-50-dog7-deep_research_90_iter_external_wave.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T08-52-50-019d521d-afbc-7da0-817d-675090a19d1f.jsonl, updated_at=2026-04-03T08:23:39+00:00, thread_id=019d521d-afbc-7da0-817d-675090a19d1f)

### keywords

- 90 iterations, recommendations-sk-deep-research.md, recommendations-sk-deep-review.md, deep-research-state.jsonl, synthesis_complete, external wave

## Task 2: Complete phase `001-sk-deep-research-improvements` contract hardening and packet-local changelog, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-03T08-52-11-1f0W-deep_research_phase1_100pct.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T10-52-11-019d528a-f2bc-7053-9269-e85eded82c3e.jsonl, updated_at=2026-04-03T09:49:06+00:00, thread_id=019d528a-f2bc-7053-9269-e85eded82c3e)

### keywords

- runtime-capabilities.cjs, reduce-state.cjs, runtime_capabilities.json, deep-research-reducer.vitest.ts, changelog-028-001-sk-deep-research-improvements.md

## Task 3: Complete phase `002-sk-deep-review-improvements` contract hardening and manual packet-local changelog fallback, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-03T08-53-06-X4xo-deep_review_contract_closeout.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T10-53-06-019d528b-cc68-77b3-9b4d-8b5dc37b791e.jsonl, updated_at=2026-04-03T09:42:20+00:00, thread_id=019d528b-cc68-77b3-9b4d-8b5dc37b791e)

 succeeded in 0ms:
---
name: sk-deep-review
description: "Autonomous iterative code review and quality auditing loop with externalized state, convergence detection, severity-weighted findings (P0/P1/P2), and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, mcp__cocoindex_code__search]
# Note: Task tool is for the command executor (loop management). The @deep-review agent itself does NOT have Task (LEAF-only).
# No WebFetch: review is code-only and read-only. No external resource fetching.
argument-hint: "[target] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.3.1.0
---

<!-- Keywords: deep-review, code-audit, iterative-review, review-loop, convergence-detection, externalized-state, fresh-context, review-agent, JSONL-state, severity-findings, P0-P1-P2, release-readiness, spec-alignment -->

# Autonomous Deep Review Loop

Iterative code review and quality auditing protocol with fresh context per iteration, externalized state, convergence detection, and severity-weighted findings (P0/P1/P2).

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Code quality audit requiring multiple rounds across different review dimensions
- Spec folder validation requiring cross-reference checks between docs and implementation
- Release readiness check before shipping a feature or component
- Finding misalignments between spec documents and actual code
- Verifying cross-references across documentation, agents, commands, and code
- Iterative review where each dimension's findings inform subsequent dimensions
- Unattended or overnight audit sessions

### When NOT to Use

- Simple single-pass code review (use `sk-code-review` instead)
- Known issues that just need fixing (go directly to implementation)
- Implementation tasks (use `sk-code-opencode` or `/spec_kit:implement`)
- Quick one-file checks (use direct Grep/Read)
- Fewer than 2 review dimensions needed (single-pass suffices)

### Trigger Phrases

- "review code quality" / "audit this code"
- "audit spec folder" / "validate spec completeness"
- "release readiness check" / "pre-release review"
- "find misalignments" (between spec and implementation)
- "verify cross-references" (across docs and code)
- "deep review" / "iterative review" / "review loop"
- "quality audit" / "convergence detection"

### Keyword Triggers

`deep review`, `code audit`, `iterative review`, `review loop`, `release readiness`, `spec folder review`, `convergence detection`, `quality audit`, `find misalignments`, `verify cross-references`, `pre-release review`, `audit spec folder`

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | `references/quick_reference.md` |
| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format, review contract |
| ON_DEMAND | Only on explicit request | Full protocol docs, detailed specifications |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
LOCAL_REFS   = SKILL_ROOT / "references"
LOCAL_ASSETS = SKILL_ROOT / "assets"
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "REVIEW_SETUP":       {"weight": 4, "keywords": ["deep review", "review mode", "code audit", "iterative review", ":review", "audit spec"]},
    "REVIEW_ITERATION":   {"weight": 4, "keywords": ["review iteration", "dimension review", "review findings", "P0", "P1", "P2"]},
    "REVIEW_CONVERGENCE": {"weight": 3, "keywords": ["review convergence", "coverage gate", "verdict", "binary gate", "all dimensions"]},
    "REVIEW_REPORT":      {"weight": 3, "keywords": ["review report", "remediation", "verdict", "release readiness", "planning packet"]},
}

NOISY_SYNONYMS = {
    "REVIEW_SETUP":       {"audit code": 2.0, "review spec folder": 1.8, "release readiness": 1.5, "pre-release": 1.5},
    "REVIEW_ITERATION":   {"review dimension": 1.5, "check correctness": 1.4, "check security": 1.4, "check alignment": 1.4},
    "REVIEW_CONVERGENCE": {"all dimensions covered": 1.6, "coverage complete": 1.5, "stop review": 1.4},
    "REVIEW_REPORT":      {"review results": 1.5, "what to fix": 1.4, "ship decision": 1.6, "final report": 1.5},
}

# RESOURCE_MAP: local assets + local review-specific protocol docs
RESOURCE_MAP = {
    "REVIEW_SETUP":       [
        "references/loop_protocol.md",
        "references/state_format.md",
        "assets/review_mode_contract.yaml",
        "assets/deep_review_strategy.md",
    ],
    "REVIEW_ITERATION":   [
        "references/loop_protocol.md",
        "references/convergence.md",
        "assets/review_mode_contract.yaml",
    ],
    "REVIEW_CONVERGENCE": [
        "references/convergence.md",
        "assets/review_mode_contract.yaml",
    ],
    "REVIEW_REPORT":      [
        "references/state_format.md",
        "assets/review_mode_contract.yaml",
    ],
}

LOADING_LEVELS = {
    "ALWAYS":            [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference"],
    "ON_DEMAND":         [
        "references/loop_protocol.md",
        "references/state_format.md",
        "references/convergence.md",
    ],
}
```

### Scoped Guard

```python
def _guard_in_skill():
    """Verify this skill is active before loading resources."""
    if not hasattr(_guard_in_skill, '_active'):
        _guard_in_skill._active = True
    return _guard_in_skill._active
```

### Phase Detection

Detect the current review phase from dispatch context to load appropriate resources:

| Phase | Signal | Resources to Load |
|-------|--------|-------------------|
| Init | No JSONL exists in `review/` | Loop protocol, state format, review contract |
| Iteration | Dispatch context includes dimension + iteration number | Loop protocol, convergence, review contract |
| Stuck | Dispatch context includes "RECOVERY" | Convergence, loop protocol |
| Synthesis | Convergence triggered STOP | Review contract, state format |

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Architecture: 3-Layer Integration

```
User invokes: /spec_kit:deep-review "target"
                    |
                    v
    ┌─────────────────────────────────┐
    │  /spec_kit:deep-review command  │  Layer 1: Command
    │  (YAML workflow + loop config)    │  Manages loop lifecycle
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │     YAML Loop Engine            │  Layer 2: Workflow
    │  - Init (config, strategy)       │  Dispatch, evaluate, decide
    │  - Loop (dispatch + converge)   │
    │  - Synthesize (review-report)   │
    │  - Save (memory context)        │
    └──────────────┬──────────────────┘
                   |  dispatches per iteration
                   v
    ┌─────────────────────────────────┐
    │    @deep-review (LEAF agent)    │  Layer 3: Agent
    │  - Reads: state + strategy      │  Fresh context each time
    │  - Executes ONE review cycle    │
    │  - Writes: findings + state      │
    │  - Tools: Grep, Read, Glob, etc │
    │  - No WebFetch (code-only)      │
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │        State Files (disk)       │  Externalized State
    │  deep-review-config.json         │  Persists across iterations
    │  deep-review-state.jsonl        │
    │  deep-review-strategy.md        │
    │  deep-review-dashboard.md       │
    │  review/iterations/             │
    │    iteration-NNN.md             │
    │  review/review-report.md        │
    └─────────────────────────────────┘
```

### State Packet Location

The review state packet lives under `{spec_folder}/review/`:

```text
review/
  deep-review-config.json            # Immutable after init: review parameters
  deep-review-state.jsonl            # Append-only review iteration log
  deep-review-strategy.md            # Review dimensions, findings, next focus
  deep-review-dashboard.md           # Auto-generated review dashboard
  .deep-review-pause                 # Pause sentinel checked between iterations
  review-report.md                   # Final review report (synthesis output)
  iterations/
    iteration-NNN.md                 # Write-once review findings per iteration
```

### Core Innovation: Fresh Context Per Iteration

Each agent dispatch gets a fresh context window. State continuity comes from files, not memory. This solves context degradation in long review sessions where accumulated findings would otherwise bias subsequent dimensions.

### Data Flow

exec
/bin/zsh -lc "rg --files .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2 .opencode/skill/sk-deep-research .opencode/skill/sk-deep-review | rg '001-runtime-truth-foundation/spec\\.md|reduce-state\\.cjs|runtime-capabilities\\.cjs|state_format\\.md|loop_protocol\\.md|convergence\\.md"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs
.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs
.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs
.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md
.opencode/skill/sk-deep-research/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md
.opencode/skill/sk-deep-review/manual_testing_playbook/01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md
.opencode/skill/sk-deep-review/references/convergence.md
.opencode/skill/sk-deep-review/references/state_format.md
.opencode/skill/sk-deep-review/references/loop_protocol.md
.opencode/skill/sk-deep-research/references/convergence.md
.opencode/skill/sk-deep-research/references/state_format.md
.opencode/skill/sk-deep-research/references/loop_protocol.md
.opencode/skill/sk-deep-review/manual_testing_playbook/04--convergence-and-recovery/017-p0-override-blocks-convergence.md

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
I’ve confirmed the target surfaces. I’m switching into close reading now: first the Phase 001 spec, then both `runtime-capabilities.cjs` and `reduce-state.cjs` implementations, then the six reference docs to check whether the documented contracts still match the shipped behavior.
exec
/bin/zsh -lc 'wc -l .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md .opencode/skill/sk-deep-research/scripts/reduce-state.cjs .opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs .opencode/skill/sk-deep-review/scripts/reduce-state.cjs .opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs .opencode/skill/sk-deep-research/references/state_format.md .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-review/references/state_format.md .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/skill/sk-deep-review/references/convergence.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     372 .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md
     771 .opencode/skill/sk-deep-research/scripts/reduce-state.cjs
     114 .opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs
    1009 .opencode/skill/sk-deep-review/scripts/reduce-state.cjs
     114 .opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs
     989 .opencode/skill/sk-deep-research/references/state_format.md
     783 .opencode/skill/sk-deep-research/references/loop_protocol.md
    1264 .opencode/skill/sk-deep-research/references/convergence.md
     812 .opencode/skill/sk-deep-review/references/state_format.md
     802 .opencode/skill/sk-deep-review/references/loop_protocol.md
     746 .opencode/skill/sk-deep-review/references/convergence.md
    7776 total

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
    29	This revision also incorporates five newly identified packet gaps from `scratch/codex-gpt54-deep-research.md`: reducer snapshot/compaction, packet-local observability, large-target decomposition, semantic convergence signals, and deep-review reducer ownership for machine-managed sections, plus an upfront agent-instruction cleanup gate so field names and reducer ownership rules are normalized before broader runtime changes begin.
    30	
    31	---
    32	
    33	<!-- ANCHOR:metadata -->
    34	## 1. METADATA
    35	
    36	| Field | Value |
    37	|-------|-------|
    38	| **Level** | 3 |
    39	| **Priority** | P1 |
    40	| **Status** | Implemented |
    41	| **Created** | 2026-04-10 |
    42	| **Branch** | `042-sk-deep-research-review-improvement-2` |
    43	| **Parent Spec** | `../spec.md` |
    44	| **Dependencies** | `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md`; current deep-loop assets, YAML workflows, reducer/tests |
    45	| **Predecessor** | Related background packets: `028-auto-deep-research-review-improvement`, `040-sk-auto-deep-research-review-improvement` |
    46	| **Successor** | `../002-semantic-coverage-graph/spec.md` (Phase 002 — semantic coverage graph); downstream Phase 003 (wave executor), Phase 004 (offline loop optimizer) |
    47	
    48	---
    49	<!-- /ANCHOR:metadata -->
    50	
    51	<!-- ANCHOR:problem -->
    52	## 2. PROBLEM & PURPOSE
    53	
    54	### Problem Statement
    55	
    56	The current deep-loop stack is functional, but it still treats "converged" as a mostly inferred state instead of a strongly explained runtime truth. Deep research and deep review already have JSONL state, dashboards, and reducer/parity coverage, yet the consolidated research shows clear gaps around stop-reason taxonomy, legal done gates, resume/start-from behavior, research claim verification, audit trails, richer dashboards, behavior-first test coverage, and large-run coordination.
    57	
    58	Those gaps matter because the two deep-loop products are long-running, artifact-heavy workflows. When they stop, resume, or synthesize, operators need to know exactly why the system behaved that way and which evidence backs the outcome. Without that, the runtime remains auditable only for people willing to reverse-engineer JSONL logs and reducer behavior by hand.
    59	
    60	### Purpose
    61	
    62	Define an implementation-ready plan that upgrades deep research and deep review into better-audited, better-tested, and easier-to-resume loop products while keeping their explicit LEAF-worker architecture and packet-local artifact model intact.
    63	
    64	<!-- /ANCHOR:problem -->
    65	---
    66	
    67	<!-- ANCHOR:scope -->
    68	## 3. SCOPE
    69	
    70	### In Scope
    71	
    72	- Real completion-gate planning for both deep-loop products, including named stop reasons, binary done checks, and resume-from-run semantics.
    73	- Research-quality runtime artifacts: claim-verification ledger, publication critique, runtime-surface inventory, and promotion checkpoints.
    74	- Dashboard upgrades for both loops: liveness, convergence trends, timing/token visibility, coverage depth, and severity trends.
    75	- Append-only audit-journal planning for both loops.
    76	- Reducer durability for 100+ iteration packets, including delta replay, replay validation, and periodic snapshot/compaction policy.
    77	- Packet-local observability and tracing surfaces: timing/tool/token histograms, state diffs, anomaly flags, and stop-decision drill-down.
    78	- Large-target decomposition policies for 1000+ file review scopes and 50+ domain research scopes.
    79	- Semantic convergence signals that combine novelty, contradiction density, and citation overlap with existing statistical checks.
    80	- Behavior-first automated verification planning for reducers, workflows, and loop outputs.
    81	- Optional, explicit advanced modes: council-style synthesis and packet-level coordination boards for large multi-phase research.
    82	- Shared loop-runtime surfaces under `scripts/` and current contract/parity tests that must move with these runtime changes.
    83	
    84	### Out of Scope
    85	
    86	- Direct implementation of any skill, command, agent, reducer, or test changes.
    87	- Changes outside the deep-research/deep-review skill families, their commands, their agents, and shared loop runtime/test infrastructure.
    88	- Replacing research/review with a generic hidden workflow DSL. The consolidated report explicitly rejects that direction.
    89	- Broader operator-shell compression, guided bootstrap, or memory-platform redesign work from other research bundles unless it is directly required by the scoped runtime improvements in this packet.
    90	- A new `mcp_server/` implementation. No current `mcp_server/` surface was identified for these deep-loop products during packet discovery.
    91	
    92	### Files to Change
    93	
    94	#### Skills and Shared Runtime
    95	
    96	| File Path | Change Type | Description |
    97	|-----------|-------------|-------------|
    98	| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Add the new completion-gate contract, ledger/journal behavior, optional council mode, and updated testing/runtime expectations. |
    99	| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Modify | Document legal stop flow, blocked-stop behavior, journal writes, and resume-from-run lifecycle steps. |
   100	| `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Define stop-reason taxonomy, binary done gate, liveness, blocked-stop handling, and semantic convergence signals. |
   101	| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Add fields and artifact contracts for stop reasons, journals, ledgers, replay snapshots, observability events, decomposition metadata, and coordination board data. |
   102	| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Modify | Keep operator-facing guidance aligned with the new defaults and opt-in modes. |
   103	| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Add schema version, lifecycle, journal, snapshot/compaction, observability, decomposition, and optional-mode configuration keys. |
   104	| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Modify | Add coverage/depth, domain clustering, promotion checkpoints, semantic convergence, and council/coordination planning sections. |
   105	| `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` | Modify | Expand dashboard sections for liveness, rolling convergence, timing/tool/token histograms, state diffs, anomaly flags, stop-decision drill-down, and coverage depth. |
   106	| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Modify | Extend reducer outputs for delta replay, snapshot/compaction, dashboard metrics, observability rollups, ledger rollups, journal rollups, and resume/stop metadata. |
   107	| `.opencode/skill/sk-deep-review/SKILL.md` | Modify | Add the real done-gate contract, journal behavior, richer dashboard expectations, and behavior-test posture. |
   108	| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Document legal stop flow, blocked-stop behavior, journal writes, start-from-run semantics, and large-target inventory/hotspot workflows. |
   109	| `.opencode/skill/sk-deep-review/references/convergence.md` | Modify | Define stop-reason taxonomy, all-dimensions-clean semantics, liveness, blocked-stop handling, and semantic convergence signals. |
   110	| `.opencode/skill/sk-deep-review/references/state_format.md` | Modify | Add fields and artifact contracts for stop reasons, journals, replay snapshots, observability events, decomposition metadata, time/token metrics, and coverage depth. |
   111	| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Modify | Keep operator-facing review guidance aligned with the new defaults and optional modes. |
   112	| `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` | Modify | Make stop reasons, typed stop-decision events, done-gate conditions, reducer-owned machine sections, dashboard metrics, and audit-journal outputs canonical. |
   113	| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Add schema version, lifecycle, journal, snapshot/compaction, observability, decomposition, and resume cursor fields. |
   114	| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Modify | Add reducer-owned machine sections, hotspot-ranking, stratified coverage, semantic convergence, and journal-aware planning sections. |
   115	| `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md` | Modify | Expand dashboard sections for liveness, rolling severity trends, timing/tool/token histograms, state diffs, anomaly flags, stop-decision drill-down, and coverage depth. |
   116	
   117	#### Commands and Workflow Assets
   118	
   119	| File Path | Change Type | Description |
   120	|-----------|-------------|-------------|
   121	| `.opencode/command/spec_kit/deep-research.md` | Modify | Update command contract, outputs, and mode descriptions to match the new runtime truths. |
   122	| `.opencode/command/spec_kit/deep-review.md` | Modify | Update command contract, outputs, and mode descriptions to match the new runtime truths. |
   123	| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Add typed stop-decision events, snapshot-aware replay steps, observability capture, decomposition workflow steps, and resume-from-run handling. |
   124	| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Keep confirm-mode workflow aligned with the same runtime artifacts, replay surfaces, and optional advanced modes. |
   125	| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Add typed stop-decision events, snapshot-aware replay steps, observability capture, inventory/hotspot workflow steps, and resume-from-run handling. |
   126	| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Keep confirm-mode workflow aligned with the same runtime artifacts, replay surfaces, and optional advanced modes. |
   127	
   128	#### Agents and Runtime Mirrors
   129	
   130	| File Path | Change Type | Description |
   131	|-----------|-------------|-------------|
   132	| `.opencode/agent/deep-research.md` | Modify | Update iteration instructions to emit the new journal, ledger, critique, clustering, semantic-convergence, inventory, and promotion-checkpoint data. |
   133	| `.opencode/agent/deep-review.md` | Modify | Update iteration instructions to emit the new journal, stop-reason, inventory/hotspot, semantic-convergence, coverage-depth, and timing/tokens data while leaving reducer-owned sections untouched. |
   134	| `.claude/agents/deep-research.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   135	| `.gemini/agents/deep-research.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   136	| `.codex/agents/deep-research.toml` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   137	| `.agents/agents/deep-research.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   138	| `.claude/agents/deep-review.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   139	| `.gemini/agents/deep-review.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   140	| `.codex/agents/deep-review.toml` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   141	
   142	#### Tests
   143	
   144	| File Path | Change Type | Description |
   145	|-----------|-------------|-------------|
   146	| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Modify | Extend reducer coverage for journal, ledger, stop-reason, delta replay, snapshot/compaction, semantic convergence, and dashboard observability metrics. |
   147	| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts` | Modify | Extend schema/contract coverage for stop reasons, journals, reducer-owned machine sections, snapshot/compaction, observability metrics, decomposition metadata, and resume cursor fields. |
   148	| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | Modify | Keep docs, assets, reducers, and mirrors aligned on the new runtime artifacts and modes. |
   149	| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | Modify | Keep docs, assets, reducers, and mirrors aligned on the new runtime artifacts and modes. |
   150	| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts` | Create | Add behavior-first tests for falsifiable focus, citations, conclusion confidence, convergence stop, stop-reason persistence, domain clustering, and replay recovery. |
   151	| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` | Create | Add behavior-first tests for dimension rotation, citations, claim-adjudication gates, convergence stop, stop-reason persistence, hotspot ranking, and replay recovery. |
   152	| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/` | Create | Seed replay corpus from packet families `028`, `040`, and `042` for invalid-state, resume, completed-continue, and compaction-equivalence fixtures. |
   153	
   154	<!-- /ANCHOR:scope -->
   155	---
   156	
   157	<!-- ANCHOR:requirements -->
   158	## 4. REQUIREMENTS
   159	
   160	### P0 - Blockers (MUST complete)
   161	
   162	| ID | Requirement | Acceptance Criteria | Research Basis |
   163	|----|-------------|---------------------|----------------|
   164	| REQ-001 | Both deep-loop products MUST use a shared stop contract with two parts: a named `stopReason` enum plus a typed `legalStop` record, and the contract MUST include a mapping table from legacy stop labels. | Deep research and deep review state docs, YAML workflows, dashboards, and synthesis outputs all expose `stopReason` from the shared taxonomy and a typed `legalStop` record with `blockedBy`, `gateResults`, and `replayInputs`; convergence docs include a mapping table from legacy stop labels into the new contract instead of silently dropping older reasons. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   165	| REQ-002a | Deep research and deep review MUST only treat STOP as legal when convergence math, coverage expectations, and binary quality gates all pass together. | The legal-stop design explicitly requires convergence, coverage, and quality gates to pass as one combined decision; STOP is never treated as legal based on novelty math alone, and the `legalStop.gateResults` record shows the full gate bundle. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   166	| REQ-002b | When a loop wants to STOP but cannot legally stop, it MUST persist a first-class blocked-stop event with reason, gate results, and recovery path, and that event MUST be replayable. | If convergence math votes STOP but coverage or quality gates fail, the workflow records a first-class `blockedStop` event with `stopReason`, `legalStop.gateResults`, and recovery metadata, leaves `status` non-terminal, and can replay the blocked-stop decision from packet-local artifacts without treating it as a mere continue side effect. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   167	| REQ-003 | Both loops MUST support `continuedFromRun` semantics consistently across both active resume and completed-continue flows, so a lineage can continue from an existing run boundary instead of reinitializing from run 1. | Config/state/workflow contracts define and preserve resume cursor data such as `continuedFromRun` or equivalent; command surfaces describe how resume, restart, fork, and completed-continue interact with start-from-run behavior, and active resume and completed-continue use the same continuation semantics instead of diverging by mode. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   168	| REQ-004 | Both loops MUST produce append-only audit journals as separate packet-local artifacts rather than cramming journal data into the iteration JSONL stream. | Runtime artifacts include a canonical journal file per session, it is append-only, reducer/dashboard flows can summarize it, the iteration JSONL remains focused on iteration events, and stop/recovery analysis can be reproduced from packet artifacts without hidden state. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   169	| REQ-005 | Deep research MUST create a claim-verification ledger for major claims with quoted claim text, evidence references, verification status, and verification method/actor. | Research packets define a canonical ledger artifact, synthesis references it, and claims can be marked `verified`, `contradicted`, or `unresolved` with file/line evidence or explicit unresolved status. | `CF-014` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:212-221`] |
   170	| REQ-006 | The implementation plan MUST shift loop confidence from structure-only checks to behavior-first tests that exercise narrow questions, evidence citations, conclusion confidence, convergence, and stop-reason persistence. | The planned test stack includes dedicated behavioral suites for deep research and deep review plus extensions to reducer/parity tests; passing behavior tests becomes part of the done gate for these runtime changes. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `Theme T-005` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:404-406`] |
   171	
   172	### P1 - Required (complete OR user-approved deferral)
   173	
   174	| ID | Requirement | Acceptance Criteria | Research Basis |
   175	|----|-------------|---------------------|----------------|
   176	| REQ-007 | Both loop dashboards MUST expose richer runtime truth: liveness, rolling convergence visualization, wall-clock and token cost per iteration, coverage depth, severity trends, and final stop reason. | Research and review dashboard assets, reducers, and workflow outputs define these sections explicitly; dashboard content is generated, not manually maintained; trend and liveness rules are consistent with state schema. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   177	| REQ-008 | Deep research MUST support publication critique annotations so synthesis distinguishes verified runtime code, README claims, marketing copy, and other weaker evidence classes. | Research iteration/synthesis surfaces include an explicit evidence-quality or publication-critique field that can be summarized in the dashboard or final research output without becoming mandatory for every minor observation. | `CF-021` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:291-300`] |
   178	| REQ-009 | Deep research MUST support runtime-inventory and promotion-checkpoint artifacts so recommendations do not move to "adopt" without explicit evidence thresholds. | Research packet design includes runtime-surface inventory capture plus checkpoint criteria for moving a finding from interesting to recommended; the promotion threshold is visible in synthesis and the ledger/journal context. | `CF-021` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:291-300`] |
   179	| REQ-010 | Council-style synthesis MUST be supported as an explicit opt-in profile for ambiguous research or architecture questions. | The plan defines named perspective iterations and a synthesis reconciliation iteration; default deep-research behavior remains unchanged unless the user or workflow explicitly selects council mode. | `CF-027` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:359-359`] |
   180	| REQ-011 | Large multi-phase research runs MUST have an optional packet-local coordination board that tracks phase status, headline findings, conflicts, duplicate signals, and resource-allocation suggestions. | The plan defines a packet-local coordination artifact with explicit fields for state, conflicts, dedupe, and resource recommendations; default single-packet research remains unaffected when the board is unused. | `CF-030` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:362-362`] |
   181	| REQ-012 | Command docs and YAML assets MUST surface the new lifecycle and optional-mode behavior without bloating the default operator path. | Default command examples remain compact; advanced behaviors are discoverable but explicitly marked as optional; confirm and auto workflows stay contract-compatible. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:408-411`] |
   182	| REQ-013 | Canonical skill/command/agent contracts and runtime parity tests MUST move together so new stop/journal/ledger/dashboard behavior cannot drift by runtime or doc surface. | Planned work updates the canonical `.opencode` files plus the parity-test surfaces that enforce mirror alignment; implementation does not rely on untested doc-only parity. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:408-411`] |
   183	| REQ-014 | Shared loop-runtime changes MUST preserve packet-local, explicit deep-loop products and avoid introducing a hidden generic DSL or non-auditable state channel. | The implementation plan keeps reducers, journals, ledgers, and dashboards explicit inside the research/review packets; shared helpers may be extracted, but domain-specific artifacts and LEAF semantics remain visible and testable. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:467-471`] |
   184	| REQ-015 | Both loops MUST support delta replay plus periodic snapshots/compaction so reducer performance does not degrade on 100+ iteration packets. | Canonical state keeps authoritative append-only events while reducers consume latest deltas plus periodic snapshots; compaction policy is explicit, replay validation proves equivalent outputs before and after compaction, and packet durability remains packet-local. | Iteration 1 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:41-50`], Recommendation 1 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:211-214`] |
   185	| REQ-016 | Both loops MUST expose packet-local observability surfaces with timing/tool/token histograms, state diffs, anomaly flags, and stop-decision drill-down. | Dashboards and reducers emit packet-local observability views sourced from runtime data such as `durationMs`, `toolsUsed`, and `sourcesQueried` or an explicit unknown fallback; stop-decision traces remain replayable and reducer-generated. | Iteration 7 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:143-152`], Recommendation 7 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:217-220`] |
   186	| REQ-017 | Large-target decomposition MUST be planned explicitly: review for 1000+ file repos and research for 50+ source domains. | Deep review defines inventory pass, hotspot ranking, stratified coverage, and segment/wave governance for very large repos; deep research defines domain clustering, authority-aware sampling, and cluster-aware convergence for large source sets; smaller packets keep the default lightweight path. | Iteration 6 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:126-135`], Recommendation 8 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:219-221`] |
   187	| REQ-018 | Convergence detection MUST incorporate semantic novelty, contradiction density, and citation-graph overlap alongside the existing statistical and coverage signals. | Convergence docs and workflow/state contracts define a typed stop-decision trace that records novelty, contradiction, and citation-overlap inputs; blocked-stop events explain which semantic signals prevented or supported legal STOP. | Iteration 2 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:58-67`], Recommendation 5 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:215-218`] |
   188	| REQ-019 | Deep-review machine-owned strategy sections MUST be reducer-owned, matching deep-research behavior. | Deep-review agent instructions stop editing machine-owned strategy/dashboard sections directly; reducer-owned sections are clearly labeled in review contracts, and parity/behavior coverage proves the boundary remains intact across runtimes. | Iteration 4 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:92-99`], Recommendation 3 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:213-216`] |
   189	| REQ-020 | Agent instruction cleanup MUST happen before broader runtime work begins: both deep-research and deep-review agent `.md` files must normalize field names, clarify reducer ownership boundaries, and fix strategy-edit expectations. | Canonical deep-research and deep-review agent docs use the same field names as the reducer/state contracts, spell out reducer-owned versus agent-owned sections, and deep-review no longer instructs agents to directly edit machine-owned strategy sections before later runtime phases begin. | Iteration 4 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:92-99`], Recommendation 3 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:213-216`] |
   190	
   191	<!-- /ANCHOR:requirements -->
   192	---
   193	
   194	<!-- ANCHOR:success-criteria -->
   195	## 5. SUCCESS CRITERIA
   196	
   197	- **SC-001**: The packet defines a single shared stop contract for both deep research and deep review with a `stopReason` enum, a typed `legalStop` record, and a legacy-reason mapping table.
   198	- **SC-002**: The packet separates foundational runtime work from optional advanced modes, with council synthesis and coordination boards explicitly marked opt-in.
   199	- **SC-003**: The packet lists all core implementation files, shared runtime surfaces, and verification files required to ship the scoped runtime improvements.
   200	- **SC-004**: Every requirement maps to research evidence from the consolidated report and can be traced to at least one concrete file set.
   201	- **SC-005**: The plan includes a dependency-ordered delivery path that ships runtime-truth foundations before optional orchestration features.
   202	- **SC-006**: The task breakdown assigns concrete file targets and parent requirements for each planned change, with all tasks starting in `Pending`.
   203	- **SC-007**: The checklist provides one verification item per requirement, with evidence format and test references.
   204	- **SC-008**: The decision record captures the requested architecture choices, including the new durability, testing-order, semantic-convergence, and recovery-ladder ADRs, with rationale, alternatives, and rollback thinking.
   205	- **SC-009**: `implementation-summary.md` exists as a placeholder only and does not over-claim implementation work.
   206	- **SC-010**: `validate.sh --strict` passes for this packet after the planning documents are written.
   207	- **SC-011**: The packet defines reducer snapshot/compaction and replay-validation requirements for both loops without weakening packet-local durability.
   208	- **SC-012**: The packet defines packet-local observability surfaces and typed stop-decision drill-down for both dashboards.
   209	- **SC-013**: The packet makes large-target decomposition explicit for both 1000+ file review scopes and 50+ domain research scopes.
   210	- **SC-014**: The packet upgrades convergence from statistical-only signaling to a typed decision trace with semantic novelty, contradiction density, and citation overlap.
   211	- **SC-015**: The packet moves deep-review machine-owned sections under reducer ownership and reflects that boundary in tasks, tests, and ADRs.
   212	- **SC-016**: The packet requires agent-instruction cleanup before broader runtime work begins so field names, reducer ownership boundaries, and strategy-edit expectations are normalized early.
   213	
   214	### Acceptance Scenarios
   215	
   216	1. **Given** either loop finishes, **When** an operator opens the dashboard or synthesis output, **Then** the packet shows a named `stopReason` plus the typed `legalStop` detail that made STOP legal.
   217	2. **Given** convergence math votes STOP but a quality gate fails, **When** the workflow evaluates completion, **Then** it persists a first-class blocked-stop event with gate results and recovery path and does not terminate as complete.
   218	3. **Given** a valid prior packet state, **When** either active resume or completed-continue is selected, **Then** the workflow preserves the same `continuedFromRun` semantics and continues from a named run boundary instead of starting from run 1.
   219	4. **Given** a major research claim, **When** the packet is synthesized, **Then** the claim appears with `verified`, `contradicted`, or `unresolved` status plus evidence refs.
   220	5. **Given** a recommendation derived from mixed source quality, **When** the packet records it, **Then** publication critique, runtime inventory, and promotion-checkpoint context remain visible.
   221	6. **Given** a normal loop run, **When** council synthesis or a coordination board is not explicitly requested, **Then** no advanced-mode artifacts are created.
   222	
   223	<!-- /ANCHOR:success-criteria -->
   224	---
   225	
   226	<!-- ANCHOR:risks -->
   227	## 6. RISKS & DEPENDENCIES
   228	
   229	| Type | Item | Impact | Mitigation |
   230	|------|------|--------|------------|
   231	| Dependency | Consolidated report remains the source of truth for the scoped runtime improvements | Mis-scoped implementation if packet drifts from research | Every requirement cites the consolidated report directly. |
   232	| Dependency | Existing reducer/parity tests are the current runtime safety net | Behavior changes could drift from contracts | Plan behavior-first tests and parity updates in the same implementation wave. |
   233	| Risk | Stop-gate logic becomes too complicated for operators | Medium | Keep default operator UX small and move advanced detail into generated artifacts and optional modes. |
   234	| Risk | Journals and ledgers create maintenance overhead without adoption | Medium | Make journals canonical but reducer-driven; keep publication critique and promotion checkpoints lightweight. |
   235	| Risk | Council mode or coordination board becomes a default-path distraction | Medium | Mark both features explicitly opt-in and put them in the last delivery phase. |
   236	| Risk | Runtime mirror parity balloons the implementation scope | Medium | Keep `.opencode` files canonical and use parity tests to decide whether hand-authored mirrors still need edits. |
   237	| Risk | The reducer cannot safely replay at least one older large packet | High | Seed replay fixtures from older large packets early and block compaction or stop-contract rollout until replay equivalence passes. |
   238	| Risk | Review contract maturity is uneven across skill, workflow, and agent surfaces | Medium | Front-load agent instruction cleanup and parity checks before broader runtime changes land. |
   239	| Risk | Token/time tracking is inconsistently available across runtimes | Low | Plan for exact metrics when available and documented approximations otherwise. |
   240	
   241	<!-- /ANCHOR:risks -->
   242	---
   243	
   244	## 7. NON-FUNCTIONAL REQUIREMENTS
   245	
   246	### Performance
   247	
   248	- **NFR-P01**: Default deep-research and deep-review iterations should not require extra manual review steps compared with current `:auto` flows.
   249	- **NFR-P02**: Added runtime artifacts should remain reducer-friendly and packet-local, avoiding large per-iteration re-render costs beyond current dashboard regeneration.
   250	
   251	### Reliability
   252	
   253	- **NFR-R01**: New journal and ledger artifacts must remain append-only or reducer-rebuildable from canonical packet state.
   254	- **NFR-R02**: Active resume and completed-continue flows must remain recoverable after interruption without needing hidden context or manual reconstruction, and `continuedFromRun` semantics must stay consistent across both.
   255	
   256	### Maintainability
   257	
   258	- **NFR-M01**: Shared runtime improvements must be documented once in canonical assets and enforced through parity/behavior tests rather than repeated prose-only edits.
   259	- **NFR-M02**: Optional advanced features must not make the default workflow harder to understand or validate.
   260	

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md | sed -n '92,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    92	### Files to Change
    93	
    94	#### Skills and Shared Runtime
    95	
    96	| File Path | Change Type | Description |
    97	|-----------|-------------|-------------|
    98	| `.opencode/skill/sk-deep-research/SKILL.md` | Modify | Add the new completion-gate contract, ledger/journal behavior, optional council mode, and updated testing/runtime expectations. |
    99	| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Modify | Document legal stop flow, blocked-stop behavior, journal writes, and resume-from-run lifecycle steps. |
   100	| `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Define stop-reason taxonomy, binary done gate, liveness, blocked-stop handling, and semantic convergence signals. |
   101	| `.opencode/skill/sk-deep-research/references/state_format.md` | Modify | Add fields and artifact contracts for stop reasons, journals, ledgers, replay snapshots, observability events, decomposition metadata, and coordination board data. |
   102	| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Modify | Keep operator-facing guidance aligned with the new defaults and opt-in modes. |
   103	| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Add schema version, lifecycle, journal, snapshot/compaction, observability, decomposition, and optional-mode configuration keys. |
   104	| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Modify | Add coverage/depth, domain clustering, promotion checkpoints, semantic convergence, and council/coordination planning sections. |
   105	| `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` | Modify | Expand dashboard sections for liveness, rolling convergence, timing/tool/token histograms, state diffs, anomaly flags, stop-decision drill-down, and coverage depth. |
   106	| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Modify | Extend reducer outputs for delta replay, snapshot/compaction, dashboard metrics, observability rollups, ledger rollups, journal rollups, and resume/stop metadata. |
   107	| `.opencode/skill/sk-deep-review/SKILL.md` | Modify | Add the real done-gate contract, journal behavior, richer dashboard expectations, and behavior-test posture. |
   108	| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Modify | Document legal stop flow, blocked-stop behavior, journal writes, start-from-run semantics, and large-target inventory/hotspot workflows. |
   109	| `.opencode/skill/sk-deep-review/references/convergence.md` | Modify | Define stop-reason taxonomy, all-dimensions-clean semantics, liveness, blocked-stop handling, and semantic convergence signals. |
   110	| `.opencode/skill/sk-deep-review/references/state_format.md` | Modify | Add fields and artifact contracts for stop reasons, journals, replay snapshots, observability events, decomposition metadata, time/token metrics, and coverage depth. |
   111	| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Modify | Keep operator-facing review guidance aligned with the new defaults and optional modes. |
   112	| `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` | Modify | Make stop reasons, typed stop-decision events, done-gate conditions, reducer-owned machine sections, dashboard metrics, and audit-journal outputs canonical. |
   113	| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Add schema version, lifecycle, journal, snapshot/compaction, observability, decomposition, and resume cursor fields. |
   114	| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Modify | Add reducer-owned machine sections, hotspot-ranking, stratified coverage, semantic convergence, and journal-aware planning sections. |
   115	| `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md` | Modify | Expand dashboard sections for liveness, rolling severity trends, timing/tool/token histograms, state diffs, anomaly flags, stop-decision drill-down, and coverage depth. |
   116	
   117	#### Commands and Workflow Assets
   118	
   119	| File Path | Change Type | Description |
   120	|-----------|-------------|-------------|
   121	| `.opencode/command/spec_kit/deep-research.md` | Modify | Update command contract, outputs, and mode descriptions to match the new runtime truths. |
   122	| `.opencode/command/spec_kit/deep-review.md` | Modify | Update command contract, outputs, and mode descriptions to match the new runtime truths. |
   123	| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Add typed stop-decision events, snapshot-aware replay steps, observability capture, decomposition workflow steps, and resume-from-run handling. |
   124	| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Keep confirm-mode workflow aligned with the same runtime artifacts, replay surfaces, and optional advanced modes. |
   125	| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Add typed stop-decision events, snapshot-aware replay steps, observability capture, inventory/hotspot workflow steps, and resume-from-run handling. |
   126	| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Keep confirm-mode workflow aligned with the same runtime artifacts, replay surfaces, and optional advanced modes. |
   127	
   128	#### Agents and Runtime Mirrors
   129	
   130	| File Path | Change Type | Description |
   131	|-----------|-------------|-------------|
   132	| `.opencode/agent/deep-research.md` | Modify | Update iteration instructions to emit the new journal, ledger, critique, clustering, semantic-convergence, inventory, and promotion-checkpoint data. |
   133	| `.opencode/agent/deep-review.md` | Modify | Update iteration instructions to emit the new journal, stop-reason, inventory/hotspot, semantic-convergence, coverage-depth, and timing/tokens data while leaving reducer-owned sections untouched. |
   134	| `.claude/agents/deep-research.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   135	| `.gemini/agents/deep-research.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   136	| `.codex/agents/deep-research.toml` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   137	| `.agents/agents/deep-research.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   138	| `.claude/agents/deep-review.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   139	| `.gemini/agents/deep-review.md` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   140	| `.codex/agents/deep-review.toml` | Modify | Runtime mirror parity if hand-authored mirrors remain the implementation mechanism. |
   141	
   142	#### Tests
   143	
   144	| File Path | Change Type | Description |
   145	|-----------|-------------|-------------|
   146	| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts` | Modify | Extend reducer coverage for journal, ledger, stop-reason, delta replay, snapshot/compaction, semantic convergence, and dashboard observability metrics. |
   147	| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts` | Modify | Extend schema/contract coverage for stop reasons, journals, reducer-owned machine sections, snapshot/compaction, observability metrics, decomposition metadata, and resume cursor fields. |
   148	| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | Modify | Keep docs, assets, reducers, and mirrors aligned on the new runtime artifacts and modes. |
   149	| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | Modify | Keep docs, assets, reducers, and mirrors aligned on the new runtime artifacts and modes. |
   150	| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-behavioral.vitest.ts` | Create | Add behavior-first tests for falsifiable focus, citations, conclusion confidence, convergence stop, stop-reason persistence, domain clustering, and replay recovery. |
   151	| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-behavioral.vitest.ts` | Create | Add behavior-first tests for dimension rotation, citations, claim-adjudication gates, convergence stop, stop-reason persistence, hotspot ranking, and replay recovery. |
   152	| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-replay/` | Create | Seed replay corpus from packet families `028`, `040`, and `042` for invalid-state, resume, completed-continue, and compaction-equivalence fixtures. |
   153	
   154	<!-- /ANCHOR:scope -->
   155	---
   156	
   157	<!-- ANCHOR:requirements -->
   158	## 4. REQUIREMENTS
   159	
   160	### P0 - Blockers (MUST complete)
   161	
   162	| ID | Requirement | Acceptance Criteria | Research Basis |
   163	|----|-------------|---------------------|----------------|
   164	| REQ-001 | Both deep-loop products MUST use a shared stop contract with two parts: a named `stopReason` enum plus a typed `legalStop` record, and the contract MUST include a mapping table from legacy stop labels. | Deep research and deep review state docs, YAML workflows, dashboards, and synthesis outputs all expose `stopReason` from the shared taxonomy and a typed `legalStop` record with `blockedBy`, `gateResults`, and `replayInputs`; convergence docs include a mapping table from legacy stop labels into the new contract instead of silently dropping older reasons. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   165	| REQ-002a | Deep research and deep review MUST only treat STOP as legal when convergence math, coverage expectations, and binary quality gates all pass together. | The legal-stop design explicitly requires convergence, coverage, and quality gates to pass as one combined decision; STOP is never treated as legal based on novelty math alone, and the `legalStop.gateResults` record shows the full gate bundle. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   166	| REQ-002b | When a loop wants to STOP but cannot legally stop, it MUST persist a first-class blocked-stop event with reason, gate results, and recovery path, and that event MUST be replayable. | If convergence math votes STOP but coverage or quality gates fail, the workflow records a first-class `blockedStop` event with `stopReason`, `legalStop.gateResults`, and recovery metadata, leaves `status` non-terminal, and can replay the blocked-stop decision from packet-local artifacts without treating it as a mere continue side effect. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   167	| REQ-003 | Both loops MUST support `continuedFromRun` semantics consistently across both active resume and completed-continue flows, so a lineage can continue from an existing run boundary instead of reinitializing from run 1. | Config/state/workflow contracts define and preserve resume cursor data such as `continuedFromRun` or equivalent; command surfaces describe how resume, restart, fork, and completed-continue interact with start-from-run behavior, and active resume and completed-continue use the same continuation semantics instead of diverging by mode. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   168	| REQ-004 | Both loops MUST produce append-only audit journals as separate packet-local artifacts rather than cramming journal data into the iteration JSONL stream. | Runtime artifacts include a canonical journal file per session, it is append-only, reducer/dashboard flows can summarize it, the iteration JSONL remains focused on iteration events, and stop/recovery analysis can be reproduced from packet artifacts without hidden state. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   169	| REQ-005 | Deep research MUST create a claim-verification ledger for major claims with quoted claim text, evidence references, verification status, and verification method/actor. | Research packets define a canonical ledger artifact, synthesis references it, and claims can be marked `verified`, `contradicted`, or `unresolved` with file/line evidence or explicit unresolved status. | `CF-014` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:212-221`] |
   170	| REQ-006 | The implementation plan MUST shift loop confidence from structure-only checks to behavior-first tests that exercise narrow questions, evidence citations, conclusion confidence, convergence, and stop-reason persistence. | The planned test stack includes dedicated behavioral suites for deep research and deep review plus extensions to reducer/parity tests; passing behavior tests becomes part of the done gate for these runtime changes. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `Theme T-005` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:404-406`] |
   171	
   172	### P1 - Required (complete OR user-approved deferral)
   173	
   174	| ID | Requirement | Acceptance Criteria | Research Basis |
   175	|----|-------------|---------------------|----------------|
   176	| REQ-007 | Both loop dashboards MUST expose richer runtime truth: liveness, rolling convergence visualization, wall-clock and token cost per iteration, coverage depth, severity trends, and final stop reason. | Research and review dashboard assets, reducers, and workflow outputs define these sections explicitly; dashboard content is generated, not manually maintained; trend and liveness rules are consistent with state schema. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   177	| REQ-008 | Deep research MUST support publication critique annotations so synthesis distinguishes verified runtime code, README claims, marketing copy, and other weaker evidence classes. | Research iteration/synthesis surfaces include an explicit evidence-quality or publication-critique field that can be summarized in the dashboard or final research output without becoming mandatory for every minor observation. | `CF-021` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:291-300`] |
   178	| REQ-009 | Deep research MUST support runtime-inventory and promotion-checkpoint artifacts so recommendations do not move to "adopt" without explicit evidence thresholds. | Research packet design includes runtime-surface inventory capture plus checkpoint criteria for moving a finding from interesting to recommended; the promotion threshold is visible in synthesis and the ledger/journal context. | `CF-021` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:291-300`] |
   179	| REQ-010 | Council-style synthesis MUST be supported as an explicit opt-in profile for ambiguous research or architecture questions. | The plan defines named perspective iterations and a synthesis reconciliation iteration; default deep-research behavior remains unchanged unless the user or workflow explicitly selects council mode. | `CF-027` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:359-359`] |
   180	| REQ-011 | Large multi-phase research runs MUST have an optional packet-local coordination board that tracks phase status, headline findings, conflicts, duplicate signals, and resource-allocation suggestions. | The plan defines a packet-local coordination artifact with explicit fields for state, conflicts, dedupe, and resource recommendations; default single-packet research remains unaffected when the board is unused. | `CF-030` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:362-362`] |
   181	| REQ-012 | Command docs and YAML assets MUST surface the new lifecycle and optional-mode behavior without bloating the default operator path. | Default command examples remain compact; advanced behaviors are discoverable but explicitly marked as optional; confirm and auto workflows stay contract-compatible. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:408-411`] |
   182	| REQ-013 | Canonical skill/command/agent contracts and runtime parity tests MUST move together so new stop/journal/ledger/dashboard behavior cannot drift by runtime or doc surface. | Planned work updates the canonical `.opencode` files plus the parity-test surfaces that enforce mirror alignment; implementation does not rely on untested doc-only parity. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:408-411`] |
   183	| REQ-014 | Shared loop-runtime changes MUST preserve packet-local, explicit deep-loop products and avoid introducing a hidden generic DSL or non-auditable state channel. | The implementation plan keeps reducers, journals, ledgers, and dashboards explicit inside the research/review packets; shared helpers may be extracted, but domain-specific artifacts and LEAF semantics remain visible and testable. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:467-471`] |
   184	| REQ-015 | Both loops MUST support delta replay plus periodic snapshots/compaction so reducer performance does not degrade on 100+ iteration packets. | Canonical state keeps authoritative append-only events while reducers consume latest deltas plus periodic snapshots; compaction policy is explicit, replay validation proves equivalent outputs before and after compaction, and packet durability remains packet-local. | Iteration 1 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:41-50`], Recommendation 1 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:211-214`] |
   185	| REQ-016 | Both loops MUST expose packet-local observability surfaces with timing/tool/token histograms, state diffs, anomaly flags, and stop-decision drill-down. | Dashboards and reducers emit packet-local observability views sourced from runtime data such as `durationMs`, `toolsUsed`, and `sourcesQueried` or an explicit unknown fallback; stop-decision traces remain replayable and reducer-generated. | Iteration 7 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:143-152`], Recommendation 7 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:217-220`] |
   186	| REQ-017 | Large-target decomposition MUST be planned explicitly: review for 1000+ file repos and research for 50+ source domains. | Deep review defines inventory pass, hotspot ranking, stratified coverage, and segment/wave governance for very large repos; deep research defines domain clustering, authority-aware sampling, and cluster-aware convergence for large source sets; smaller packets keep the default lightweight path. | Iteration 6 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:126-135`], Recommendation 8 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:219-221`] |
   187	| REQ-018 | Convergence detection MUST incorporate semantic novelty, contradiction density, and citation-graph overlap alongside the existing statistical and coverage signals. | Convergence docs and workflow/state contracts define a typed stop-decision trace that records novelty, contradiction, and citation-overlap inputs; blocked-stop events explain which semantic signals prevented or supported legal STOP. | Iteration 2 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:58-67`], Recommendation 5 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:215-218`] |
   188	| REQ-019 | Deep-review machine-owned strategy sections MUST be reducer-owned, matching deep-research behavior. | Deep-review agent instructions stop editing machine-owned strategy/dashboard sections directly; reducer-owned sections are clearly labeled in review contracts, and parity/behavior coverage proves the boundary remains intact across runtimes. | Iteration 4 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:92-99`], Recommendation 3 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:213-216`] |
   189	| REQ-020 | Agent instruction cleanup MUST happen before broader runtime work begins: both deep-research and deep-review agent `.md` files must normalize field names, clarify reducer ownership boundaries, and fix strategy-edit expectations. | Canonical deep-research and deep-review agent docs use the same field names as the reducer/state contracts, spell out reducer-owned versus agent-owned sections, and deep-review no longer instructs agents to directly edit machine-owned strategy sections before later runtime phases begin. | Iteration 4 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:92-99`], Recommendation 3 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:213-216`] |
   190	

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md | sed -n '260,372p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	
   261	---
   262	
   263	## 8. EDGE CASES
   264	
   265	### Lifecycle and Stop-State Boundaries
   266	
   267	- Convergence math says STOP, but quality gates fail: record blocked-stop event, surface reason in dashboard/journal, continue loop or recovery path.
   268	- Convergence says STOP, quality gate fails, the blocked-stop decision must be persisted as a first-class event, not just a CONTINUE side effect.
   269	- User explicitly stops a run mid-iteration: persist `user_stopped`, flush journal/ledger state safely, and keep resume cursor intact.
   270	- Resume starts from a run whose ledger or journal is partially present: classify as recoverable only if canonical state can be reconciled from packet artifacts.
   271	- Snapshot boundary is hit while a replay validation is still running: defer compaction finalization until reducer equivalence checks pass and the authoritative event log remains recoverable.
   272	
   273	### Research Quality Boundaries
   274	
   275	- Claim has contradictory evidence across README and runtime code: ledger must mark `contradicted`, not silently promote the stronger claim.
   276	- Source type is marketing copy or a thin README: publication critique must make the evidence class explicit before promotion.
   277	- Promotion checkpoint fails minimum evidence threshold: recommendation stays informative, not adoptive.
   278	
   279	### Semantic and Decomposition Boundaries
   280	
   281	- Semantic novelty falls to zero but contradiction density rises: convergence must remain blocked until the contradiction path is resolved or explicitly downgraded in the stop-decision trace.
   282	- Citation overlap is high within one research cluster but low across the full source set: cluster saturation cannot be treated as global convergence for 50+ domain research packets.
   283	- Review scope exceeds 1000 files with no hotspot ranking or stratified sampling plan: the workflow must force an inventory/decomposition step before claiming broad coverage.
   284	
   285	### Optional Mode Boundaries
   286	
   287	- Council mode perspectives disagree irreconcilably: synthesis iteration must surface unresolved conflict instead of forcing a false consensus.
   288	- Coordination board is enabled for a small packet: implementation should degrade gracefully to a minimal board rather than forcing enterprise-scale fields.
   289	
   290	---
   291	
   292	## 9. COMPLEXITY ASSESSMENT
   293	
   294	| Dimension | Score | Triggers |
   295	|-----------|-------|----------|
   296	| Scope | 22/25 | Two loop products, shared runtime substrate, replay durability, observability, decomposition policy, semantic convergence, multiple assets, YAML workflows, reducer/tests |
   297	| Risk | 21/25 | Runtime-stop behavior, resume semantics, snapshot/compaction correctness, observability fidelity, semantic convergence, and trust surfaces |
   298	| Research | 17/20 | Consolidated research and packet-local deep research are available, but implementation choices still require ADRs and replay-harness scoping |
   299	| Multi-Agent | 0/15 | This planning packet does not require parallel agent work |
   300	| Coordination | 12/15 | Multiple file families, replay corpus seeding, and phased verification must move together; optional coordination-board mode adds design complexity |
   301	| **Total** | **72/100** | **Level 3** |
   302	
   303	---
   304	
   305	## 10. RISK MATRIX
   306	
   307	| Risk ID | Description | Impact | Likelihood | Mitigation |
   308	|---------|-------------|--------|------------|------------|
   309	| R-001 | Shared stop taxonomy drifts between research and review | High | Medium | Keep taxonomy canonical in shared planning and enforce via contract/parity tests. |
   310	| R-002 | Journals and ledgers become write-heavy but not read-useful | Medium | Medium | Tie them to dashboards, synthesis, and troubleshooting paths from day one. |
   311	| R-003 | Optional advanced modes are treated as default requirements | Medium | Medium | Phase them last and document them as explicit opt-ins only. |
   312	| R-004 | Runtime mirrors drift from canonical `.opencode` agent contracts | Medium | High | Update or regenerate mirrors in the same delivery wave and keep parity tests authoritative. |
   313	| R-005 | Behavior-first tests become brittle if they overfit wording instead of contract signals | Medium | Medium | Prefer structure-plus-semantics assertions over exact-string snapshots when feasible. |
   314	
   315	---
   316	
   317	## 11. USER STORIES
   318	
   319	### US-001: Trust The Stop Condition (Priority: P0)
   320	
   321	**As an** operator running autonomous deep research or deep review, **I want** the packet to explain exactly why a loop stopped and whether STOP was legally earned, **so that** I can trust the result without reverse-engineering the raw JSONL.
   322	
   323	**Acceptance Criteria**:
   324	1. Given a completed loop, when I inspect the dashboard or synthesis output, then I can see the named stop reason and the gate status that allowed STOP.
   325	2. Given a blocked-stop case, when convergence math says stop but gates fail, then the loop records that state explicitly and continues or recovers instead of silently terminating.
   326	
   327	### US-002: Resume Without Reinitializing (Priority: P0)
   328	
   329	**As a** maintainer resuming a long-running research or review session, **I want** the workflow to continue from a known run boundary, **so that** I do not lose lineage or pay re-initialization overhead for already-completed work.
   330	
   331	**Acceptance Criteria**:
   332	1. Given a valid existing packet, when resume is selected, then the workflow continues from a specific prior run or segment instead of starting from run 1.
   333	
   334	### US-003: Trust Research Claims (Priority: P1)
   335	
   336	**As a** reader of deep-research outputs, **I want** large claims to carry verification status, evidence quality, and promotion thresholds, **so that** I can separate verified runtime truths from weaker source claims.
   337	
   338	**Acceptance Criteria**:
   339	1. Given a major adoption recommendation, when I inspect the packet, then I can see whether the claim was verified, contradicted, or unresolved and what evidence class supports it.
   340	
   341	### US-004: Scale Up Deliberately (Priority: P1)
   342	
   343	**As a** coordinator of ambiguous or large multi-phase research, **I want** optional council synthesis and coordination-board support, **so that** I can use them only when the packet genuinely needs the extra cost.
   344	
   345	**Acceptance Criteria**:
   346	1. Given a normal research packet, when I run the default mode, then neither council synthesis nor the coordination board is required.
   347	2. Given an ambiguous or multi-phase packet, when I explicitly enable the advanced mode, then the added artifacts are created and tracked as packet-local state.
   348	
   349	---
   350	
   351	<!-- ANCHOR:questions -->
   352	## 12. OPEN QUESTIONS
   353	
   354	- Q1: Should review token-consumption metrics be sourced from runtime envelopes only, or may the implementation ship an explicit "unknown/estimated" fallback field?
   355	- Q2: Should the coordination board live under `research/` as a large-run overlay or at the packet root as a cross-phase artifact?
   356	- Q3: If runtime mirrors remain hand-authored, do we want this packet to update them directly or to treat generated mirrors as a prerequisite follow-on?
   357	- Q4: Should compaction trigger by run count, JSONL size, or wall-clock duration?
   358	- Q5: What is the cheapest semantic-novelty implementation that stays packet-local and replayable?
   359	- Q6: Which real packet families should seed the first replay corpus: `028`, `040`, or `042` fixtures?
   360	
   361	<!-- /ANCHOR:questions -->
   362	---
   363	
   364	## RELATED DOCUMENTS
   365	
   366	- **Implementation Plan**: See `plan.md`
   367	- **Task Breakdown**: See `tasks.md`
   368	- **Verification Checklist**: See `checklist.md`
   369	- **Decision Records**: See `decision-record.md`
   370	- **Research Basis**: `../../../system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md`
   371	
   372	---

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md | sed -n '162,176p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   162	| ID | Requirement | Acceptance Criteria | Research Basis |
   163	|----|-------------|---------------------|----------------|
   164	| REQ-001 | Both deep-loop products MUST use a shared stop contract with two parts: a named `stopReason` enum plus a typed `legalStop` record, and the contract MUST include a mapping table from legacy stop labels. | Deep research and deep review state docs, YAML workflows, dashboards, and synthesis outputs all expose `stopReason` from the shared taxonomy and a typed `legalStop` record with `blockedBy`, `gateResults`, and `replayInputs`; convergence docs include a mapping table from legacy stop labels into the new contract instead of silently dropping older reasons. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   165	| REQ-002a | Deep research and deep review MUST only treat STOP as legal when convergence math, coverage expectations, and binary quality gates all pass together. | The legal-stop design explicitly requires convergence, coverage, and quality gates to pass as one combined decision; STOP is never treated as legal based on novelty math alone, and the `legalStop.gateResults` record shows the full gate bundle. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   166	| REQ-002b | When a loop wants to STOP but cannot legally stop, it MUST persist a first-class blocked-stop event with reason, gate results, and recovery path, and that event MUST be replayable. | If convergence math votes STOP but coverage or quality gates fail, the workflow records a first-class `blockedStop` event with `stopReason`, `legalStop.gateResults`, and recovery metadata, leaves `status` non-terminal, and can replay the blocked-stop decision from packet-local artifacts without treating it as a mere continue side effect. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   167	| REQ-003 | Both loops MUST support `continuedFromRun` semantics consistently across both active resume and completed-continue flows, so a lineage can continue from an existing run boundary instead of reinitializing from run 1. | Config/state/workflow contracts define and preserve resume cursor data such as `continuedFromRun` or equivalent; command surfaces describe how resume, restart, fork, and completed-continue interact with start-from-run behavior, and active resume and completed-continue use the same continuation semantics instead of diverging by mode. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   168	| REQ-004 | Both loops MUST produce append-only audit journals as separate packet-local artifacts rather than cramming journal data into the iteration JSONL stream. | Runtime artifacts include a canonical journal file per session, it is append-only, reducer/dashboard flows can summarize it, the iteration JSONL remains focused on iteration events, and stop/recovery analysis can be reproduced from packet artifacts without hidden state. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   169	| REQ-005 | Deep research MUST create a claim-verification ledger for major claims with quoted claim text, evidence references, verification status, and verification method/actor. | Research packets define a canonical ledger artifact, synthesis references it, and claims can be marked `verified`, `contradicted`, or `unresolved` with file/line evidence or explicit unresolved status. | `CF-014` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:212-221`] |
   170	| REQ-006 | The implementation plan MUST shift loop confidence from structure-only checks to behavior-first tests that exercise narrow questions, evidence citations, conclusion confidence, convergence, and stop-reason persistence. | The planned test stack includes dedicated behavioral suites for deep research and deep review plus extensions to reducer/parity tests; passing behavior tests becomes part of the done gate for these runtime changes. | `CF-004` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:102-111`], `Theme T-005` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:404-406`] |
   171	
   172	### P1 - Required (complete OR user-approved deferral)
   173	
   174	| ID | Requirement | Acceptance Criteria | Research Basis |
   175	|----|-------------|---------------------|----------------|
   176	| REQ-007 | Both loop dashboards MUST expose richer runtime truth: liveness, rolling convergence visualization, wall-clock and token cost per iteration, coverage depth, severity trends, and final stop reason. | Research and review dashboard assets, reducers, and workflow outputs define these sections explicitly; dashboard content is generated, not manually maintained; trend and liveness rules are consistent with state schema. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |

exec
/bin/zsh -lc 'rg -n "stopReason|legalStop|blockedStop|continuedFromRun|journal|ledger|snapshot|compaction|observability|novelty|contradiction|citation|coverage|durationMs|toolsUsed|sourcesQueried|dashboard|anomaly|histogram|replay|resume|user_stopped|promotion|inventory|coordination|council" .opencode/skill/sk-deep-research/scripts/reduce-state.cjs .opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs .opencode/skill/sk-deep-review/scripts/reduce-state.cjs .opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:438: * the review dashboard cannot render `[object Object]` even if an older YAML
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:468:      const legacyLegalStop = record.legalStop && typeof record.legalStop === 'object'
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:469:        ? record.legalStop
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:499:  const blockedStopHistory = buildBlockedStopHistory(iterationRecords);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:527:    blockedStopHistory,
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:643:  const latestBlockedStop = registry.blockedStopHistory?.at(-1);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:731:    'Reducer-generated observability surface for the active review packet.',
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:766:    '<!-- ANCHOR:dimension-coverage -->',
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:773:    '<!-- /ANCHOR:dimension-coverage -->',
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:776:    ...(registry.blockedStopHistory && registry.blockedStopHistory.length > 0
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:777:      ? registry.blockedStopHistory.flatMap((entry) => {
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:834:      // debt alongside P0s so the dashboard cannot hide P1 debt behind a
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:861:        lines.push(`- Latest blocked_stop at run ${latestBlockedStop.run ?? '?'}: ${latestBlockedStop.blockedBy.join(', ')}. Recovery: ${latestBlockedStop.recoveryStrategy || 'see dashboard §BLOCKED STOPS'}.`);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:879: * strategy, and dashboard outputs. Idempotent: repeated calls produce identical results.
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:884: * @returns {Object} Paths and content for registry, strategy, and dashboard
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:896:  const dashboardPath = path.join(reviewDir, 'deep-review-dashboard.md');
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:912:  const dashboard = renderDashboard(config, registry, records, iterationFiles);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:919:    writeUtf8(dashboardPath, dashboard);
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:939:    dashboardPath,
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:942:    dashboard,
.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:972:          dashboardPath: result.dashboardPath,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:175:    iterationRecords.flatMap((record) => (Array.isArray(record.sourcesQueried) ? record.sourcesQueried : [])),
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:316:  const latestBlockedStop = Array.isArray(registry.blockedStopHistory)
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:317:    ? registry.blockedStopHistory.at(-1)
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:390:  const coverageBySources = buildCoverageBySources(iterationFiles, iterationRecords);
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:396:  const blockedStopHistory = eventRecords
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:422:    blockedStopHistory,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:432:      coverageBySources,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:558:    'Reducer-generated observability surface for the active research packet.',
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:599:    `- coverageBySources: ${JSON.stringify(registry.metrics.coverageBySources)}`,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:623:    ...(registry.blockedStopHistory.length
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:624:      ? registry.blockedStopHistory.flatMap((entry) => ([
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:648: * strategy, and dashboard outputs. Idempotent: repeated calls produce identical results.
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:653: * @returns {Object} Paths and content for registry, strategy, and dashboard
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:664:  const dashboardPath = path.join(researchDir, 'deep-research-dashboard.md');
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:685:  const dashboard = renderDashboard(config, registry, records, iterationFiles);
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:690:    writeUtf8(dashboardPath, dashboard);
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:710:    dashboardPath,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:713:    dashboard,
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:742:          dashboardPath: result.dashboardPath,

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ Deep Review Runtime Capabilities Resolver                                ║
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
    15	// 2. CONSTANTS
    16	// ─────────────────────────────────────────────────────────────────────────────
    17	
    18	/** @type {string} Default path to the machine-readable runtime capability matrix. */
    19	const DEFAULT_CAPABILITY_PATH = path.join(__dirname, '..', 'assets', 'runtime_capabilities.json');
    20	
    21	// ─────────────────────────────────────────────────────────────────────────────
    22	// 3. CORE LOGIC
    23	// ─────────────────────────────────────────────────────────────────────────────
    24	
    25	/**
    26	 * Load and validate the runtime capability matrix from disk.
    27	 *
    28	 * @param {string} [capabilityPath] - Path to runtime_capabilities.json
    29	 * @returns {{ capabilityPath: string, matrix: Object }} Resolved path and parsed matrix
    30	 * @throws {Error} If the matrix file is missing or malformed
    31	 */
    32	function loadRuntimeCapabilities(capabilityPath = DEFAULT_CAPABILITY_PATH) {
    33	  const resolvedPath = path.resolve(capabilityPath);
    34	  const parsed = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
    35	
    36	  if (!Array.isArray(parsed.runtimes)) {
    37	    throw new Error(`Invalid runtime capability matrix at ${resolvedPath}: missing runtimes array`);
    38	  }
    39	
    40	  return {
    41	    capabilityPath: resolvedPath,
    42	    matrix: parsed,
    43	  };
    44	}
    45	
    46	/**
    47	 * List all known runtime IDs from the capability matrix.
    48	 *
    49	 * @param {string} [capabilityPath] - Path to runtime_capabilities.json
    50	 * @returns {string[]} Array of runtime identifier strings
    51	 */
    52	function listRuntimeCapabilityIds(capabilityPath = DEFAULT_CAPABILITY_PATH) {
    53	  const { matrix } = loadRuntimeCapabilities(capabilityPath);
    54	  return matrix.runtimes.map((runtime) => runtime.id);
    55	}
    56	
    57	/**
    58	 * Resolve a single runtime's capability record by ID.
    59	 *
    60	 * @param {string} runtimeId - Runtime identifier to look up
    61	 * @param {string} [capabilityPath] - Path to runtime_capabilities.json
    62	 * @returns {{ capabilityPath: string, runtime: Object }} Resolved path and runtime record
    63	 * @throws {Error} If the runtime ID is not found in the matrix
    64	 */
    65	function resolveRuntimeCapability(runtimeId, capabilityPath = DEFAULT_CAPABILITY_PATH) {
    66	  const { capabilityPath: resolvedPath, matrix } = loadRuntimeCapabilities(capabilityPath);
    67	  const runtime = matrix.runtimes.find((entry) => entry.id === runtimeId);
    68	
    69	  if (!runtime) {
    70	    throw new Error(
    71	      `Unknown deep-review runtime "${runtimeId}". Known runtimes: ${matrix.runtimes.map((entry) => entry.id).join(', ')}. Matrix: ${resolvedPath}`,
    72	    );
    73	  }
    74	
    75	  return {
    76	    capabilityPath: resolvedPath,
    77	    runtime,
    78	  };
    79	}
    80	
    81	// ─────────────────────────────────────────────────────────────────────────────
    82	// 4. CLI ENTRY POINT
    83	// ─────────────────────────────────────────────────────────────────────────────
    84	
    85	if (require.main === module) {
    86	  const runtimeId = process.argv[2];
    87	
    88	  if (!runtimeId) {
    89	    process.stdout.write(
    90	      `${JSON.stringify(
    91	        {
    92	          capabilityPath: path.resolve(DEFAULT_CAPABILITY_PATH),
    93	          runtimeIds: listRuntimeCapabilityIds(),
    94	        },
    95	        null,
    96	        2,
    97	      )}\n`,
    98	    );
    99	    process.exit(0);
   100	  }
   101	
   102	  process.stdout.write(`${JSON.stringify(resolveRuntimeCapability(runtimeId), null, 2)}\n`);
   103	}
   104	
   105	// ─────────────────────────────────────────────────────────────────────────────
   106	// 5. EXPORTS
   107	// ─────────────────────────────────────────────────────────────────────────────
   108	
   109	module.exports = {
   110	  DEFAULT_CAPABILITY_PATH,
   111	  listRuntimeCapabilityIds,
   112	  loadRuntimeCapabilities,
   113	  resolveRuntimeCapability,
   114	};

 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ Deep Research Runtime Capabilities Resolver                              ║
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
    15	// 2. CONSTANTS
    16	// ─────────────────────────────────────────────────────────────────────────────
    17	
    18	/** @type {string} Default path to the machine-readable runtime capability matrix. */
    19	const DEFAULT_CAPABILITY_PATH = path.join(__dirname, '..', 'assets', 'runtime_capabilities.json');
    20	
    21	// ─────────────────────────────────────────────────────────────────────────────
    22	// 3. CORE LOGIC
    23	// ─────────────────────────────────────────────────────────────────────────────
    24	
    25	/**
    26	 * Load and validate the runtime capability matrix from disk.
    27	 *
    28	 * @param {string} [capabilityPath] - Path to runtime_capabilities.json
    29	 * @returns {{ capabilityPath: string, matrix: Object }} Resolved path and parsed matrix
    30	 * @throws {Error} If the matrix file is missing or malformed
    31	 */
    32	function loadRuntimeCapabilities(capabilityPath = DEFAULT_CAPABILITY_PATH) {
    33	  const resolvedPath = path.resolve(capabilityPath);
    34	  const parsed = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
    35	
    36	  if (!Array.isArray(parsed.runtimes)) {
    37	    throw new Error(`Invalid runtime capability matrix at ${resolvedPath}: missing runtimes array`);
    38	  }
    39	
    40	  return {
    41	    capabilityPath: resolvedPath,
    42	    matrix: parsed,
    43	  };
    44	}
    45	
    46	/**
    47	 * List all known runtime IDs from the capability matrix.
    48	 *
    49	 * @param {string} [capabilityPath] - Path to runtime_capabilities.json
    50	 * @returns {string[]} Array of runtime identifier strings
    51	 */
    52	function listRuntimeCapabilityIds(capabilityPath = DEFAULT_CAPABILITY_PATH) {
    53	  const { matrix } = loadRuntimeCapabilities(capabilityPath);
    54	  return matrix.runtimes.map((runtime) => runtime.id);
    55	}
    56	
    57	/**
    58	 * Resolve a single runtime's capability record by ID.
    59	 *
    60	 * @param {string} runtimeId - Runtime identifier to look up
    61	 * @param {string} [capabilityPath] - Path to runtime_capabilities.json
    62	 * @returns {{ capabilityPath: string, runtime: Object }} Resolved path and runtime record
    63	 * @throws {Error} If the runtime ID is not found in the matrix
    64	 */
    65	function resolveRuntimeCapability(runtimeId, capabilityPath = DEFAULT_CAPABILITY_PATH) {
    66	  const { capabilityPath: resolvedPath, matrix } = loadRuntimeCapabilities(capabilityPath);
    67	  const runtime = matrix.runtimes.find((entry) => entry.id === runtimeId);
    68	
    69	  if (!runtime) {
    70	    throw new Error(
    71	      `Unknown deep-research runtime "${runtimeId}". Known runtimes: ${matrix.runtimes.map((entry) => entry.id).join(', ')}. Matrix: ${resolvedPath}`,
    72	    );
    73	  }
    74	
    75	  return {
    76	    capabilityPath: resolvedPath,
    77	    runtime,
    78	  };
    79	}
    80	
    81	// ─────────────────────────────────────────────────────────────────────────────
    82	// 4. CLI ENTRY POINT
    83	// ─────────────────────────────────────────────────────────────────────────────
    84	
    85	if (require.main === module) {
    86	  const runtimeId = process.argv[2];
    87	
    88	  if (!runtimeId) {
    89	    process.stdout.write(
    90	      `${JSON.stringify(
    91	        {
    92	          capabilityPath: path.resolve(DEFAULT_CAPABILITY_PATH),
    93	          runtimeIds: listRuntimeCapabilityIds(),
    94	        },
    95	        null,
    96	        2,
    97	      )}\n`,
    98	    );
    99	    process.exit(0);
   100	  }
   101	
   102	  process.stdout.write(`${JSON.stringify(resolveRuntimeCapability(runtimeId), null, 2)}\n`);
   103	}
   104	
   105	// ─────────────────────────────────────────────────────────────────────────────
   106	// 5. EXPORTS
   107	// ─────────────────────────────────────────────────────────────────────────────
   108	
   109	module.exports = {
   110	  DEFAULT_CAPABILITY_PATH,
   111	  listRuntimeCapabilityIds,
   112	  loadRuntimeCapabilities,
   113	  resolveRuntimeCapability,
   114	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/scripts/reduce-state.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
    52	 * Parse JSONL content into an array of records. Backward-compatible array
    53	 * return; corrupt lines are silently dropped. For fail-closed behavior use
    54	 * parseJsonlDetailed().
    55	 *
    56	 * @param {string} jsonlContent - Newline-delimited JSON string
    57	 * @returns {Array<Object>} Parsed records
    58	 */
    59	function parseJsonl(jsonlContent) {
    60	  return parseJsonlDetailed(jsonlContent).records;
    61	}
    62	
    63	/**
    64	 * Parse JSONL content and report malformed lines (fail-closed pathway, phase 008
    65	 * research reducer parity with sk-deep-review Part C).
    66	 *
    67	 * The reducer exit code is non-zero when corruption warnings are present
    68	 * unless `--lenient` is passed to the CLI (or `lenient:true` to
    69	 * reduceResearchState).
    70	 *
    71	 * @param {string} jsonlContent - Newline-delimited JSON string
    72	 * @returns {{records: Array<Object>, corruptionWarnings: Array<{line: number, raw: string, error: string}>}}
    73	 */
    74	function parseJsonlDetailed(jsonlContent) {
    75	  const records = [];
    76	  const corruptionWarnings = [];
    77	  let lineNumber = 0;
    78	
    79	  for (const rawLine of jsonlContent.split('\n')) {
    80	    lineNumber += 1;
    81	    const line = rawLine.trim();
    82	    if (!line) {
    83	      continue;
    84	    }
    85	
    86	    try {
    87	      records.push(JSON.parse(line));
    88	    } catch (error) {
    89	      corruptionWarnings.push({
    90	        line: lineNumber,
    91	        raw: rawLine.length > 200 ? `${rawLine.slice(0, 200)}...` : rawLine,
    92	        error: error instanceof Error ? error.message : String(error),
    93	      });
    94	    }
    95	  }
    96	
    97	  return { records, corruptionWarnings };
    98	}
    99	
   100	function extractSection(markdown, heading) {
   101	  // Drop the `m` flag so `$` anchors to end-of-string, not end-of-line
   102	  const pattern = new RegExp(`(?:^|\\n)##\\s+${escapeRegExp(heading)}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i');
   103	  const match = markdown.match(pattern);
   104	  return match ? match[1].trim() : '';
   105	}
   106	
   107	function extractListItems(sectionText) {
   108	  return sectionText
   109	    .split('\n')
   110	    .map((line) => line.trim())
   111	    .filter((line) => /^([-*]|\d+\.)\s+/.test(line))
   112	    .map((line) => normalizeText(line.replace(/^([-*]|\d+\.)\s+/, '')))
   113	    .filter(Boolean);
   114	}
   115	
   116	function parseReflectionValue(sectionText, label) {
   117	  const match = sectionText.match(new RegExp(`-\\s+${escapeRegExp(label)}\\s*:\\s*(.+)`, 'i'));
   118	  return match ? normalizeText(match[1]) : null;
   119	}
   120	
   121	/**
   122	 * Parse a single iteration markdown file into a structured record.
   123	 *
   124	 * @param {string} iterationPath - Absolute path to an iteration-NNN.md file
   125	 * @returns {Object} Parsed iteration with focus, findings, sources, and reflection fields
   126	 */
   127	function parseIterationFile(iterationPath) {
   128	  const markdown = readUtf8(iterationPath);
   129	  const runMatch = iterationPath.match(/iteration-(\d+)\.md$/);
   130	  const headingMatch = markdown.match(/^#\s+Iteration\s+\d+:\s+(.+)$/m);
   131	  const focusSection = extractSection(markdown, 'Focus');
   132	  const findingsSection = extractSection(markdown, 'Findings');
   133	  const ruledOutSection = extractSection(markdown, 'Ruled Out');
   134	  const deadEndsSection = extractSection(markdown, 'Dead Ends');
   135	  const sourcesSection = extractSection(markdown, 'Sources Consulted');
   136	  const reflectionSection = extractSection(markdown, 'Reflection');
   137	  const nextFocusSection = extractSection(markdown, 'Recommended Next Focus');
   138	
   139	  return {
   140	    path: iterationPath,
   141	    run: runMatch ? Number(runMatch[1]) : 0,
   142	    focus: normalizeText(focusSection || (headingMatch ? headingMatch[1] : 'Unknown focus')),
   143	    findings: extractListItems(findingsSection),
   144	    ruledOut: extractListItems(ruledOutSection),
   145	    deadEnds: extractListItems(deadEndsSection),
   146	    sources: extractListItems(sourcesSection),
   147	    reflectionWorked: parseReflectionValue(reflectionSection, 'What worked and why'),
   148	    reflectionFailed: parseReflectionValue(reflectionSection, 'What did not work and why'),
   149	    reflectionDifferent: parseReflectionValue(reflectionSection, 'What I would do differently'),
   150	    nextFocus: normalizeText(nextFocusSection),
   151	  };
   152	}
   153	
   154	function parseStrategyQuestions(strategyContent) {
   155	  const section = extractSection(strategyContent, '3. KEY QUESTIONS (remaining)');
   156	  return section
   157	    .split('\n')
   158	    .map((line) => line.trim())
   159	    .filter((line) => /^- \[[ xX]\]\s+/.test(line))
   160	    .map((line) => {
   161	      const checked = /^- \[[xX]\]\s+/.test(line);
   162	      const text = normalizeText(line.replace(/^- \[[ xX]\]\s+/, ''));
   163	      return {
   164	        checked,
   165	        text,
   166	      };
   167	    });
   168	}
   169	
   170	function buildCoverageBySources(iterationFiles, iterationRecords) {
   171	  const counter = {};
   172	  const seen = new Set();
   173	
   174	  for (const source of iterationFiles.flatMap((iteration) => iteration.sources).concat(
   175	    iterationRecords.flatMap((record) => (Array.isArray(record.sourcesQueried) ? record.sourcesQueried : [])),
   176	  )) {
   177	    const normalized = normalizeText(source);
   178	    if (!normalized || seen.has(normalized)) {
   179	      continue;
   180	    }
   181	    seen.add(normalized);
   182	
   183	    let key = 'other';
   184	    if (/^https?:\/\//i.test(normalized)) {
   185	      try {
   186	        key = new URL(normalized).hostname;
   187	      } catch (_error) {
   188	        key = 'web';
   189	      }
   190	    } else if (normalized.startsWith('memory:')) {
   191	      key = 'memory';
   192	    } else if (normalized.includes(':')) {
   193	      key = 'code';
   194	    }
   195	
   196	    counter[key] = (counter[key] || 0) + 1;
   197	  }
   198	
   199	  return Object.fromEntries(Object.entries(counter).sort(([left], [right]) => left.localeCompare(right)));
   200	}
   201	
   202	function uniqueById(items) {
   203	  const seen = new Set();
   204	  const result = [];
   205	
   206	  for (const item of items) {
   207	    if (seen.has(item.id)) {
   208	      continue;
   209	    }
   210	    seen.add(item.id);
   211	    result.push(item);
   212	  }
   213	
   214	  return result;
   215	}
   216	
   217	function buildGraphConvergenceRollup(eventRecords) {
   218	  const latestGraphConvergence = eventRecords.filter((record) => record.event === 'graph_convergence').at(-1);
   219	  const signals = latestGraphConvergence?.signals && typeof latestGraphConvergence.signals === 'object'
   220	    ? latestGraphConvergence.signals
   221	    : {};
   222	  const blockers = Array.isArray(latestGraphConvergence?.blockers)
   223	    ? latestGraphConvergence.blockers
   224	    : [];
   225	  const blendedScore = Number.isFinite(signals.blendedScore)
   226	    ? signals.blendedScore
   227	    : Number.isFinite(signals.score)
   228	      ? signals.score
   229	      : 0;
   230	
   231	  return {
   232	    graphConvergenceScore: blendedScore,
   233	    graphDecision: typeof latestGraphConvergence?.decision === 'string'
   234	      ? latestGraphConvergence.decision
   235	      : null,
   236	    graphBlockers: blockers,
   237	  };
   238	}
   239	
   240	function formatBlockedByList(blockedBy) {
   241	  return Array.isArray(blockedBy) && blockedBy.length
   242	    ? blockedBy.join(', ')
   243	    : 'unspecified gates';
   244	}
   245	
   246	function formatSummaryValue(value) {
   247	  if (Array.isArray(value)) {
   248	    return value.map((entry) => formatSummaryValue(entry)).join(', ');
   249	  }
   250	
   251	  if (value && typeof value === 'object') {
   252	    return Object.keys(value)
   253	      .sort()
   254	      .map((key) => `${key}=${formatSummaryValue(value[key])}`)
   255	      .join(', ');
   256	  }
   257	
   258	  return String(value);
   259	}
   260	

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/scripts/reduce-state.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ Deep Review State Reducer                                                ║
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
    15	// 2. CONSTANTS
    16	// ─────────────────────────────────────────────────────────────────────────────
    17	
    18	const REQUIRED_DIMENSIONS = ['correctness', 'security', 'traceability', 'maintainability'];
    19	const SEVERITY_KEYS = ['P0', 'P1', 'P2'];
    20	const SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 };
    21	
    22	// ─────────────────────────────────────────────────────────────────────────────
    23	// 3. HELPERS
    24	// ─────────────────────────────────────────────────────────────────────────────
    25	
    26	function readUtf8(filePath) {
    27	  return fs.readFileSync(filePath, 'utf8');
    28	}
    29	
    30	function writeUtf8(filePath, content) {
    31	  fs.mkdirSync(path.dirname(filePath), { recursive: true });
    32	  fs.writeFileSync(filePath, content, 'utf8');
    33	}
    34	
    35	function readJson(filePath) {
    36	  return JSON.parse(readUtf8(filePath));
    37	}
    38	
    39	function slugify(value) {
    40	  return value
    41	    .toLowerCase()
    42	    .replace(/[^a-z0-9]+/g, '-')
    43	    .replace(/^-+|-+$/g, '')
    44	    .slice(0, 80) || 'entry';
    45	}
    46	
    47	function normalizeText(value) {
    48	  return String(value || '').replace(/\s+/g, ' ').trim();
    49	}
    50	
    51	function escapeRegExp(value) {
    52	  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    53	}
    54	
    55	function zeroSeverityMap() {
    56	  return { P0: 0, P1: 0, P2: 0 };
    57	}
    58	
    59	// ─────────────────────────────────────────────────────────────────────────────
    60	// 4. PARSERS
    61	// ─────────────────────────────────────────────────────────────────────────────
    62	
    63	/**
    64	 * Parse JSONL content into an array of records, preserving both iteration and
    65	 * event rows. Backward-compatible array return.
    66	 *
    67	 * @param {string} jsonlContent - Newline-delimited JSON string
    68	 * @returns {Array<Object>} Parsed records (corrupt lines silently dropped — use parseJsonlDetailed for fail-closed behavior)
    69	 */
    70	function parseJsonl(jsonlContent) {
    71	  return parseJsonlDetailed(jsonlContent).records;
    72	}
    73	
    74	/**
    75	 * Parse JSONL content and report malformed lines (fail-closed pathway).
    76	 *
    77	 * Returns both the parsed records and a corruption warning list. The reducer
    78	 * exit code is non-zero when warnings are present unless `--lenient` is passed.
    79	 *
    80	 * @param {string} jsonlContent - Newline-delimited JSON string
    81	 * @returns {{records: Array<Object>, corruptionWarnings: Array<{line: number, raw: string, error: string}>}}
    82	 */
    83	function parseJsonlDetailed(jsonlContent) {
    84	  const records = [];
    85	  const corruptionWarnings = [];
    86	  let lineNumber = 0;
    87	
    88	  for (const rawLine of jsonlContent.split('\n')) {
    89	    lineNumber += 1;
    90	    const line = rawLine.trim();
    91	    if (!line) {
    92	      continue;
    93	    }
    94	
    95	    try {
    96	      records.push(JSON.parse(line));
    97	    } catch (error) {
    98	      corruptionWarnings.push({
    99	        line: lineNumber,
   100	        raw: rawLine.length > 200 ? `${rawLine.slice(0, 200)}...` : rawLine,
   101	        error: error instanceof Error ? error.message : String(error),
   102	      });
   103	    }
   104	  }
   105	
   106	  return { records, corruptionWarnings };
   107	}
   108	
   109	function extractSection(markdown, heading) {
   110	  const pattern = new RegExp(`(?:^|\\n)##\\s+${escapeRegExp(heading)}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i');
   111	  const match = markdown.match(pattern);
   112	  return match ? match[1].trim() : '';
   113	}
   114	
   115	function extractSubsection(sectionText, subheading) {
   116	  const pattern = new RegExp(`(?:^|\\n)###\\s+${escapeRegExp(subheading)}[^\\n]*\\n([\\s\\S]*?)(?=\\n###\\s|\\n##\\s|$)`, 'i');
   117	  const match = sectionText.match(pattern);
   118	  return match ? match[1].trim() : '';
   119	}
   120	
   121	function extractListItems(sectionText) {
   122	  return sectionText
   123	    .split('\n')
   124	    .map((line) => line.trim())
   125	    .filter((line) => /^([-*]|\d+\.)\s+/.test(line))
   126	    .map((line) => normalizeText(line.replace(/^([-*]|\d+\.)\s+/, '')))
   127	    .filter(Boolean);
   128	}
   129	
   130	/**
   131	 * Parse a finding line of the form: `- **F001**: Title — file:line — Description`
   132	 *
   133	 * @param {string} line - Raw finding bullet
   134	 * @param {string} severity - P0, P1, or P2 context
   135	 * @returns {Object|null} Structured finding or null when the line is not a finding
   136	 */
   137	function parseFindingLine(line, severity) {
   138	  const match = line.match(/^\*\*(F\d+)\*\*\s*:\s*(.+?)(?:\s+[—-]\s+`?([^`]+?)`?)?(?:\s+[—-]\s+(.+))?$/);
   139	  if (!match) {
   140	    return null;
   141	  }
   142	
   143	  const [, findingId, title, evidenceRaw, description] = match;
   144	  let file = null;
   145	  let lineNumber = null;
   146	
   147	  if (evidenceRaw) {
   148	    const evidenceMatch = evidenceRaw.trim().match(/^(.+?):(\d+)(?:[:-].*)?$/);
   149	    if (evidenceMatch) {
   150	      file = evidenceMatch[1];
   151	      lineNumber = Number(evidenceMatch[2]);
   152	    } else {
   153	      file = evidenceRaw.trim();
   154	    }
   155	  }
   156	
   157	  return {
   158	    findingId,
   159	    severity,
   160	    title: normalizeText(title),
   161	    file,
   162	    line: lineNumber,
   163	    description: normalizeText(description || ''),
   164	  };
   165	}
   166	
   167	function parseFindingsBlock(sectionText, severity) {
   168	  if (!sectionText) {
   169	    return [];
   170	  }
   171	
   172	  return sectionText
   173	    .split('\n')
   174	    .map((line) => line.trim())
   175	    .filter((line) => /^-\s+\*\*F\d+\*\*/.test(line))
   176	    .map((line) => parseFindingLine(line.replace(/^-\s+/, ''), severity))
   177	    .filter(Boolean);
   178	}
   179	
   180	/**
   181	 * Parse a single iteration markdown file into a structured review record.
   182	 *
   183	 * @param {string} iterationPath - Absolute path to an iteration-NNN.md file
   184	 * @returns {Object} Parsed iteration with focus, findings, cross-reference, and reflection fields
   185	 */
   186	function parseIterationFile(iterationPath) {
   187	  const markdown = readUtf8(iterationPath);
   188	  const runMatch = iterationPath.match(/iteration-(\d+)\.md$/);
   189	  const headingMatch = markdown.match(/^#\s+Iteration\s+\d+:\s+(.+)$/m);
   190	
   191	  const focusSection = extractSection(markdown, 'Focus');
   192	  const findingsSection = extractSection(markdown, 'Findings');
   193	  const ruledOutSection = extractSection(markdown, 'Ruled Out');
   194	  const deadEndsSection = extractSection(markdown, 'Dead Ends');
   195	  const nextFocusSection = extractSection(markdown, 'Recommended Next Focus');
   196	  const assessmentSection = extractSection(markdown, 'Assessment');
   197	
   198	  const p0Block = extractSubsection(findingsSection, 'P0');
   199	  const p1Block = extractSubsection(findingsSection, 'P1');
   200	  const p2Block = extractSubsection(findingsSection, 'P2');
   201	
   202	  const findings = [
   203	    ...parseFindingsBlock(p0Block, 'P0'),
   204	    ...parseFindingsBlock(p1Block, 'P1'),
   205	    ...parseFindingsBlock(p2Block, 'P2'),
   206	  ];
   207	
   208	  const dimensionsAddressed = (assessmentSection.match(/Dimensions addressed:\s*(.+)/i) || [])[1];
   209	
   210	  return {
   211	    path: iterationPath,
   212	    run: runMatch ? Number(runMatch[1]) : 0,
   213	    focus: normalizeText(focusSection || (headingMatch ? headingMatch[1] : 'Unknown focus')),
   214	    findings,
   215	    ruledOut: extractListItems(ruledOutSection),
   216	    deadEnds: extractListItems(deadEndsSection),
   217	    nextFocus: normalizeText(nextFocusSection),
   218	    dimensionsAddressed: dimensionsAddressed
   219	      ? dimensionsAddressed.split(/[,;]/).map((value) => normalizeText(value).toLowerCase()).filter(Boolean)
   220	      : [],
   221	  };
   222	}
   223	
   224	function parseStrategyDimensions(strategyContent) {
   225	  const section = extractSection(strategyContent, '3. REVIEW DIMENSIONS (remaining)')
   226	    || extractSection(strategyContent, '3. KEY QUESTIONS (remaining)');
   227	  return section
   228	    .split('\n')
   229	    .map((line) => line.trim())
   230	    .filter((line) => /^- \[[ xX]\]\s+/.test(line))
   231	    .map((line) => {
   232	      const checked = /^- \[[xX]\]\s+/.test(line);
   233	      const text = normalizeText(line.replace(/^- \[[ xX]\]\s+/, ''));
   234	      return { checked, text };
   235	    });
   236	}
   237	
   238	function uniqueById(items) {
   239	  const seen = new Set();
   240	  const result = [];
   241	
   242	  for (const item of items) {
   243	    if (seen.has(item.findingId)) {
   244	      continue;
   245	    }
   246	    seen.add(item.findingId);
   247	    result.push(item);
   248	  }
   249	
   250	  return result;
   251	}
   252	
   253	// ─────────────────────────────────────────────────────────────────────────────
   254	// 5. CORE LOGIC
   255	// ─────────────────────────────────────────────────────────────────────────────
   256	
   257	function buildFindingRegistry(iterationFiles, iterationRecords) {
   258	  const findingById = new Map();
   259	
   260	  for (const iteration of iterationFiles) {

codex
The reducers are where the real contract lives, and I’m already seeing which pieces are present versus merely planned. I’m drilling into the sections that build stop decisions, blocked-stop history, observability, and continuation metadata, because those are the highest-value traceability claims in this phase.
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/scripts/reduce-state.cjs | sed -n '520,771p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/scripts/reduce-state.cjs | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   520	    '10. RULED OUT DIRECTIONS',
   521	    blockFromBulletList(registry.ruledOutDirections.map((entry) => `${entry.text} (iteration ${entry.addedAtIteration})`)),
   522	  );
   523	  updated = replaceAnchorSection(updated, 'next-focus', '11. NEXT FOCUS', nextFocus);
   524	  return updated;
   525	}
   526	
   527	function renderDashboard(config, registry, iterationRecords, iterationFiles) {
   528	  const latestIteration = iterationRecords.at(-1);
   529	  // Exclude "thought" iterations from rolling average — they are analytical-only
   530	  // and produce no evidence, so including them would artificially lower the ratio.
   531	  const evidenceRecords = iterationRecords.filter((record) => record.status !== 'thought');
   532	  const ratios = evidenceRecords
   533	    .map((record) => (typeof record.newInfoRatio === 'number' ? record.newInfoRatio : null))
   534	    .filter((value) => value !== null);
   535	  const lastThreeRatios = ratios.slice(-3).map((value) => value.toFixed(2)).join(' -> ') || 'N/A';
   536	  const nextFocus = resolveNextFocus(registry, iterationFiles, iterationRecords);
   537	  const progressRows = iterationRecords
   538	    .map((record) => {
   539	      const track = record.focusTrack || '-';
   540	      const ratio = typeof record.newInfoRatio === 'number' ? record.newInfoRatio.toFixed(2) : '0.00';
   541	      return `| ${record.run} | ${record.focus || 'unknown'} | ${track} | ${ratio} | ${record.findingsCount || 0} | ${record.status || 'complete'} |`;
   542	    })
   543	    .join('\n') || '| 0 | none yet | - | 0.00 | 0 | initialized |';
   544	
   545	  return [
   546	    '---',
   547	    'title: Deep Research Dashboard',
   548	    'description: Auto-generated reducer view over the research packet.',
   549	    '---',
   550	    '',
   551	    '# Deep Research Dashboard - Session Overview',
   552	    '',
   553	    'Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.',
   554	    '',
   555	    '<!-- ANCHOR:overview -->',
   556	    '## 1. OVERVIEW',
   557	    '',
   558	    'Reducer-generated observability surface for the active research packet.',
   559	    '',
   560	    '<!-- /ANCHOR:overview -->',
   561	    '<!-- ANCHOR:status -->',
   562	    '## 2. STATUS',
   563	    `- Topic: ${config.topic || '[Unknown topic]'}`,
   564	    `- Started: ${config.createdAt || '[Unknown start]'}`,
   565	    `- Status: ${String(config.status || 'initialized').toUpperCase()}`,
   566	    `- Iteration: ${registry.metrics.iterationsCompleted} of ${config.maxIterations || 0}`,
   567	    `- Session ID: ${config.lineage?.sessionId || '[Unknown session]'}`,
   568	    `- Parent Session: ${config.lineage?.parentSessionId || 'none'}`,
   569	    `- Lifecycle Mode: ${config.lineage?.lineageMode || 'new'}`,
   570	    `- Generation: ${config.lineage?.generation ?? 1}`,
   571	    '',
   572	    '<!-- /ANCHOR:status -->',
   573	    '<!-- ANCHOR:progress -->',
   574	    '## 3. PROGRESS',
   575	    '',
   576	    '| # | Focus | Track | Ratio | Findings | Status |',
   577	    '|---|-------|-------|-------|----------|--------|',
   578	    progressRows,
   579	    '',
   580	    `- iterationsCompleted: ${registry.metrics.iterationsCompleted}`,
   581	    `- keyFindings: ${registry.metrics.keyFindings}`,
   582	    `- openQuestions: ${registry.metrics.openQuestions}`,
   583	    `- resolvedQuestions: ${registry.metrics.resolvedQuestions}`,
   584	    '',
   585	    '<!-- /ANCHOR:progress -->',
   586	    '<!-- ANCHOR:questions -->',
   587	    '## 4. QUESTIONS',
   588	    `- Answered: ${registry.metrics.resolvedQuestions}/${registry.metrics.resolvedQuestions + registry.metrics.openQuestions}`,
   589	    ...registry.resolvedQuestions.map((question) => `- [x] ${question.text}`),
   590	    ...registry.openQuestions.map((question) => `- [ ] ${question.text}`),
   591	    '',
   592	    '<!-- /ANCHOR:questions -->',
   593	    '<!-- ANCHOR:trend -->',
   594	    '## 5. TREND',
   595	    `- Last 3 ratios: ${lastThreeRatios}`,
   596	    `- Stuck count: ${iterationRecords.filter((r) => r.status !== 'thought' && r.status !== 'insight' && (r.status === 'stuck' || (typeof r.newInfoRatio === 'number' && r.newInfoRatio === 0))).length}`,
   597	    '- Guard violations: none recorded by the reducer pass',
   598	    `- convergenceScore: ${Number(registry.metrics.convergenceScore || 0).toFixed(2)}`,
   599	    `- coverageBySources: ${JSON.stringify(registry.metrics.coverageBySources)}`,
   600	    '',
   601	    '<!-- /ANCHOR:trend -->',
   602	    '<!-- ANCHOR:dead-ends -->',
   603	    '## 6. DEAD ENDS',
   604	    ...registry.ruledOutDirections.length
   605	      ? registry.ruledOutDirections.map((entry) => `- ${entry.text} (iteration ${entry.addedAtIteration})`)
   606	      : ['- None yet'],
   607	    '',
   608	    '<!-- /ANCHOR:dead-ends -->',
   609	    '<!-- ANCHOR:next-focus -->',
   610	    '## 7. NEXT FOCUS',
   611	    nextFocus,
   612	    '',
   613	    '<!-- /ANCHOR:next-focus -->',
   614	    '<!-- ANCHOR:active-risks -->',
   615	    '## 8. ACTIVE RISKS',
   616	    ...(latestIteration?.status === 'error'
   617	      ? ['- Latest iteration reported error status.']
   618	      : ['- None active beyond normal research uncertainty.']),
   619	    '',
   620	    '<!-- /ANCHOR:active-risks -->',
   621	    '<!-- ANCHOR:blocked-stops -->',
   622	    '## 9. BLOCKED STOPS',
   623	    ...(registry.blockedStopHistory.length
   624	      ? registry.blockedStopHistory.flatMap((entry) => ([
   625	          `### Iteration ${entry.run} — blocked by [${formatBlockedByList(entry.blockedBy)}]`,
   626	          `- Recovery: ${entry.recoveryStrategy || '[No recovery strategy recorded]'}`,
   627	          `- Gate results: ${summarizeGateResults(entry.gateResults)}`,
   628	          `- Timestamp: ${entry.timestamp || '[Unknown timestamp]'}`,
   629	          '',
   630	        ]))
   631	      : ['No blocked-stop events recorded.', '']),
   632	    '<!-- /ANCHOR:blocked-stops -->',
   633	    '<!-- ANCHOR:graph-convergence -->',
   634	    '## 10. GRAPH CONVERGENCE',
   635	    `- graphConvergenceScore: ${Number.isFinite(registry.graphConvergenceScore) ? registry.graphConvergenceScore.toFixed(2) : '[Not recorded]'}`,
   636	    `- graphDecision: ${registry.graphDecision || '[Not recorded]'}`,
   637	    ...(registry.graphBlockers.length
   638	      ? registry.graphBlockers.map((blocker) => `- Blocker: ${formatGraphBlocker(blocker)}`)
   639	      : ['- graphBlockers: none recorded']),
   640	    '',
   641	    '<!-- /ANCHOR:graph-convergence -->',
   642	    '',
   643	  ].join('\n');
   644	}
   645	
   646	/**
   647	 * Reduce JSONL state, iteration files, and strategy into synchronized registry,
   648	 * strategy, and dashboard outputs. Idempotent: repeated calls produce identical results.
   649	 *
   650	 * @param {string} specFolder - Path to the spec folder containing a research/ directory
   651	 * @param {Object} [options] - Reducer options
   652	 * @param {boolean} [options.write=true] - Write outputs to disk when true
   653	 * @returns {Object} Paths and content for registry, strategy, and dashboard
   654	 */
   655	function reduceResearchState(specFolder, options = {}) {
   656	  const write = options.write !== false;
   657	  const lenient = Boolean(options.lenient);
   658	  const resolvedSpecFolder = path.resolve(specFolder);
   659	  const researchDir = path.join(resolvedSpecFolder, 'research');
   660	  const configPath = path.join(researchDir, 'deep-research-config.json');
   661	  const stateLogPath = path.join(researchDir, 'deep-research-state.jsonl');
   662	  const strategyPath = path.join(researchDir, 'deep-research-strategy.md');
   663	  const registryPath = path.join(researchDir, 'findings-registry.json');
   664	  const dashboardPath = path.join(researchDir, 'deep-research-dashboard.md');
   665	  const iterationDir = path.join(researchDir, 'iterations');
   666	
   667	  const config = readJson(configPath);
   668	  const { records: parsedRecords, corruptionWarnings } = parseJsonlDetailed(readUtf8(stateLogPath));
   669	  const records = parsedRecords.filter((record) => record.type === 'iteration');
   670	  const events = parsedRecords.filter((record) => record.type === 'event');
   671	  const strategyContent = readUtf8(strategyPath);
   672	  const strategyQuestions = parseStrategyQuestions(strategyContent);
   673	  const iterationFiles = fs.existsSync(iterationDir)
   674	    ? fs.readdirSync(iterationDir)
   675	        .filter((fileName) => /^iteration-\d+\.md$/.test(fileName))
   676	        .sort()
   677	        .map((fileName) => parseIterationFile(path.join(iterationDir, fileName)))
   678	    : [];
   679	
   680	  const registry = buildRegistry(strategyQuestions, iterationFiles, records, events);
   681	  // Expose corruptionWarnings as a top-level registry field for parity with
   682	  // sk-deep-review (phase 008 REQ-015 research-side follow-up).
   683	  registry.corruptionWarnings = corruptionWarnings;
   684	  const strategy = updateStrategyContent(strategyContent, registry, iterationFiles, records);
   685	  const dashboard = renderDashboard(config, registry, records, iterationFiles);
   686	
   687	  if (write) {
   688	    writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
   689	    writeUtf8(strategyPath, strategy.endsWith('\n') ? strategy : `${strategy}\n`);
   690	    writeUtf8(dashboardPath, dashboard);
   691	  }
   692	
   693	  // Fail-closed on corruption unless --lenient.
   694	  if (corruptionWarnings.length > 0 && !lenient) {
   695	    const preview = corruptionWarnings
   696	      .slice(0, 3)
   697	      .map((w) => `  - line ${w.line}: ${w.error}`)
   698	      .join('\n');
   699	    process.stderr.write(
   700	      `[sk-deep-research] parseJsonl detected ${corruptionWarnings.length} corrupt line(s) in ${stateLogPath}:\n${preview}\n`
   701	      + 'Pass --lenient to the reducer CLI (or lenient:true to reduceResearchState) to ignore corruption.\n',
   702	    );
   703	  }
   704	
   705	  return {
   706	    configPath,
   707	    stateLogPath,
   708	    strategyPath,
   709	    registryPath,
   710	    dashboardPath,
   711	    registry,
   712	    strategy,
   713	    dashboard,
   714	    corruptionWarnings,
   715	    hasCorruption: corruptionWarnings.length > 0,
   716	  };
   717	}
   718	
   719	// ─────────────────────────────────────────────────────────────────────────────
   720	// 5. CLI ENTRY POINT
   721	// ─────────────────────────────────────────────────────────────────────────────
   722	
   723	if (require.main === module) {
   724	  const args = process.argv.slice(2);
   725	  const lenient = args.includes('--lenient');
   726	  const positional = args.filter((arg) => !arg.startsWith('--'));
   727	  const specFolder = positional[0];
   728	
   729	  if (!specFolder) {
   730	    process.stderr.write(
   731	      'Usage: node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder> [--lenient]\n',
   732	    );
   733	    process.exit(1);
   734	  }
   735	
   736	  try {
   737	    const result = reduceResearchState(specFolder, { write: true, lenient });
   738	    process.stdout.write(
   739	      `${JSON.stringify(
   740	        {
   741	          registryPath: result.registryPath,
   742	          dashboardPath: result.dashboardPath,
   743	          strategyPath: result.strategyPath,
   744	          iterationsCompleted: result.registry.metrics.iterationsCompleted,
   745	          corruptionCount: result.corruptionWarnings.length,
   746	        },
   747	        null,
   748	        2,
   749	      )}\n`,
   750	    );
   751	    // Fail-closed exit semantics matching sk-deep-review (phase 008 REQ-015 parity).
   752	    if (result.hasCorruption && !lenient) {
   753	      process.exit(2);
   754	    }
   755	  } catch (error) {
   756	    process.stderr.write(`[sk-deep-research] reducer failed: ${error instanceof Error ? error.message : String(error)}\n`);
   757	    process.exit(3);
   758	  }
   759	}
   760	
   761	// ─────────────────────────────────────────────────────────────────────────────
   762	// 6. EXPORTS
   763	// ─────────────────────────────────────────────────────────────────────────────
   764	
   765	module.exports = {
   766	  buildGraphConvergenceRollup,
   767	  parseIterationFile,
   768	  parseJsonl,
   769	  parseJsonlDetailed,
   770	  reduceResearchState,
   771	};

 succeeded in 0ms:
   260	
   261	function summarizeGateResults(gateResults) {
   262	  if (!gateResults || typeof gateResults !== 'object' || !Object.keys(gateResults).length) {
   263	    return 'none recorded';
   264	  }
   265	
   266	  return Object.keys(gateResults)
   267	    .sort()
   268	    .map((gateName) => {
   269	      const result = gateResults[gateName];
   270	      if (!result || typeof result !== 'object') {
   271	        return `${gateName}=${formatSummaryValue(result)}`;
   272	      }
   273	
   274	      const status = typeof result.pass === 'boolean'
   275	        ? (result.pass ? 'pass' : 'fail')
   276	        : 'unknown';
   277	      const details = Object.keys(result)
   278	        .filter((key) => key !== 'pass' && result[key] !== undefined && result[key] !== null && result[key] !== '')
   279	        .sort()
   280	        .map((key) => `${key}=${formatSummaryValue(result[key])}`);
   281	
   282	      return details.length
   283	        ? `${gateName}=${status} (${details.join(', ')})`
   284	        : `${gateName}=${status}`;
   285	    })
   286	    .join('; ');
   287	}
   288	
   289	function formatGraphBlocker(blocker) {
   290	  if (!blocker || typeof blocker !== 'object') {
   291	    return formatSummaryValue(blocker);
   292	  }
   293	
   294	  const name = typeof blocker.name === 'string' && blocker.name ? blocker.name : 'unnamed-blocker';
   295	  const severity = typeof blocker.severity === 'string' && blocker.severity ? ` (${blocker.severity})` : '';
   296	  const detail = typeof blocker.detail === 'string' && blocker.detail ? blocker.detail : null;
   297	
   298	  if (detail) {
   299	    return `${name}${severity}: ${detail}`;
   300	  }
   301	
   302	  const extras = Object.keys(blocker)
   303	    .filter((key) => !['name', 'severity', 'detail'].includes(key))
   304	    .sort()
   305	    .map((key) => `${key}=${formatSummaryValue(blocker[key])}`);
   306	
   307	  return extras.length ? `${name}${severity}: ${extras.join(', ')}` : `${name}${severity}`;
   308	}
   309	
   310	function getTimestampValue(timestamp) {
   311	  const value = Date.parse(timestamp);
   312	  return Number.isFinite(value) ? value : Number.NEGATIVE_INFINITY;
   313	}
   314	
   315	function resolveNextFocus(registry, iterationFiles, iterationRecords) {
   316	  const latestBlockedStop = Array.isArray(registry.blockedStopHistory)
   317	    ? registry.blockedStopHistory.at(-1)
   318	    : null;
   319	  const latestIteration = Array.isArray(iterationRecords) ? iterationRecords.at(-1) : null;
   320	
   321	  if (latestBlockedStop) {
   322	    const latestBlockedTimestamp = getTimestampValue(latestBlockedStop.timestamp);
   323	    const latestIterationTimestamp = getTimestampValue(latestIteration?.timestamp);
   324	
   325	    if (latestBlockedTimestamp > latestIterationTimestamp) {
   326	      return [
   327	        `BLOCKED on: ${formatBlockedByList(latestBlockedStop.blockedBy)}`,
   328	        `Recovery: ${latestBlockedStop.recoveryStrategy || '[No recovery strategy recorded]'}`,
   329	        'Address the blocking gates before the next iteration.',
   330	      ].join('\n');
   331	    }
   332	  }
   333	
   334	  return iterationFiles.map((iteration) => iteration.nextFocus).filter(Boolean).at(-1)
   335	    || registry.openQuestions[0]?.text
   336	    || '[All tracked questions are resolved]';
   337	}
   338	
   339	// ─────────────────────────────────────────────────────────────────────────────
   340	// 4. CORE LOGIC
   341	// ─────────────────────────────────────────────────────────────────────────────
   342	
   343	function buildRegistry(strategyQuestions, iterationFiles, iterationRecords, eventRecords) {
   344	  const answeredSet = new Set(
   345	    iterationRecords.flatMap((record) => (Array.isArray(record.answeredQuestions) ? record.answeredQuestions : [])).map(normalizeText),
   346	  );
   347	
   348	  const keyedQuestions = strategyQuestions.map((question, index) => {
   349	    const normalized = normalizeText(question.text);
   350	    const resolved = question.checked || answeredSet.has(normalized);
   351	    return {
   352	      id: `question-${index + 1}-${slugify(normalized)}`,
   353	      text: normalized,
   354	      addedAtIteration: 0,
   355	      resolvedAtIteration: resolved
   356	        ? iterationRecords.find((record) =>
   357	            Array.isArray(record.answeredQuestions)
   358	              && record.answeredQuestions.map(normalizeText).includes(normalized),
   359	          )?.run ?? 0
   360	        : null,
   361	      resolved,
   362	    };
   363	  });
   364	
   365	  const keyFindings = uniqueById(
   366	    iterationFiles
   367	      .flatMap((iteration) =>
   368	        iteration.findings.map((finding, index) => ({
   369	          id: `finding-${iteration.run}-${index + 1}-${slugify(finding)}`,
   370	          text: finding,
   371	          addedAtIteration: iteration.run,
   372	          sources: iteration.sources,
   373	        })),
   374	      )
   375	      .sort((left, right) => left.addedAtIteration - right.addedAtIteration || left.text.localeCompare(right.text)),
   376	  );
   377	
   378	  const ruledOutDirections = uniqueById(
   379	    iterationFiles
   380	      .flatMap((iteration) =>
   381	        iteration.deadEnds.concat(iteration.ruledOut).map((entry, index) => ({
   382	          id: `ruled-out-${iteration.run}-${index + 1}-${slugify(entry)}`,
   383	          text: entry,
   384	          addedAtIteration: iteration.run,
   385	        })),
   386	      )
   387	      .sort((left, right) => left.addedAtIteration - right.addedAtIteration || left.text.localeCompare(right.text)),
   388	  );
   389	
   390	  const coverageBySources = buildCoverageBySources(iterationFiles, iterationRecords);
   391	  const latestIteration = iterationRecords.filter((record) => record.type === 'iteration').at(-1);
   392	  const convergenceScore =
   393	    latestIteration?.convergenceSignals?.compositeStop
   394	    ?? latestIteration?.newInfoRatio
   395	    ?? 0;
   396	  const blockedStopHistory = eventRecords
   397	    .filter((record) => record.event === 'blocked_stop')
   398	    .map((record) => ({
   399	      run: typeof record.run === 'number' ? record.run : 0,
   400	      blockedBy: Array.isArray(record.blockedBy) ? record.blockedBy : [],
   401	      gateResults: record.gateResults && typeof record.gateResults === 'object' ? record.gateResults : {},
   402	      recoveryStrategy: typeof record.recoveryStrategy === 'string' ? record.recoveryStrategy : '',
   403	      timestamp: typeof record.timestamp === 'string' ? record.timestamp : '',
   404	    }));
   405	  const graphConvergence = buildGraphConvergenceRollup(eventRecords);
   406	
   407	  return {
   408	    openQuestions: keyedQuestions.filter((question) => !question.resolved).map((question) => ({
   409	      id: question.id,
   410	      text: question.text,
   411	      addedAtIteration: question.addedAtIteration,
   412	      resolvedAtIteration: null,
   413	    })),
   414	    resolvedQuestions: keyedQuestions.filter((question) => question.resolved).map((question) => ({
   415	      id: question.id,
   416	      text: question.text,
   417	      addedAtIteration: question.addedAtIteration,
   418	      resolvedAtIteration: question.resolvedAtIteration,
   419	    })),
   420	    keyFindings,
   421	    ruledOutDirections,
   422	    blockedStopHistory,
   423	    graphConvergenceScore: graphConvergence.graphConvergenceScore,
   424	    graphDecision: graphConvergence.graphDecision,
   425	    graphBlockers: graphConvergence.graphBlockers,
   426	    metrics: {
   427	      iterationsCompleted: iterationRecords.filter((record) => record.type === 'iteration').length,
   428	      openQuestions: keyedQuestions.filter((question) => !question.resolved).length,
   429	      resolvedQuestions: keyedQuestions.filter((question) => question.resolved).length,
   430	      keyFindings: keyFindings.length,
   431	      convergenceScore,
   432	      coverageBySources,
   433	    },
   434	  };
   435	}
   436	
   437	function blockFromBulletList(items) {
   438	  if (!items.length) {
   439	    return '[None yet]';
   440	  }
   441	
   442	  return items.map((item) => `- ${item}`).join('\n');
   443	}
   444	
   445	function buildExhaustedApproaches(iterationFiles) {
   446	  const grouped = new Map();
   447	
   448	  for (const iteration of iterationFiles) {
   449	    for (const entry of iteration.deadEnds.concat(iteration.ruledOut)) {
   450	      const key = entry;
   451	      const bucket = grouped.get(key) || [];
   452	      bucket.push(iteration.run);
   453	      grouped.set(key, bucket);
   454	    }
   455	  }
   456	
   457	  if (!grouped.size) {
   458	    return '[No exhausted approach categories yet]';
   459	  }
   460	
   461	  const blocked = Array.from(grouped.entries())
   462	    .sort(([left], [right]) => left.localeCompare(right))
   463	    .map(([entry, runs]) => {
   464	      const attemptCount = runs.length;
   465	      const lastRun = Math.max(...runs);
   466	      return [
   467	        `### ${entry} -- BLOCKED (iteration ${lastRun}, ${attemptCount} attempts)`,
   468	        `- What was tried: ${entry}`,
   469	        `- Why blocked: Repeated iteration evidence ruled this direction out.`,
   470	        `- Do NOT retry: ${entry}`,
   471	      ].join('\n');
   472	    });
   473	
   474	  return blocked.join('\n\n');
   475	}
   476	
   477	function replaceAnchorSection(content, anchorId, heading, body) {
   478	  const pattern = new RegExp(`<!-- ANCHOR:${anchorId} -->[\\s\\S]*?<!-- \\/ANCHOR:${anchorId} -->`, 'm');
   479	  const replacement = [
   480	    `<!-- ANCHOR:${anchorId} -->`,
   481	    `## ${heading}`,
   482	    body.trim() ? body.trim() : '[None yet]',
   483	    '',
   484	    `<!-- /ANCHOR:${anchorId} -->`,
   485	  ].join('\n');
   486	
   487	  if (!pattern.test(content)) {
   488	    throw new Error(`Missing anchor section ${anchorId} in strategy file`);
   489	  }
   490	
   491	  return content.replace(pattern, replacement);
   492	}
   493	
   494	function updateStrategyContent(strategyContent, registry, iterationFiles, iterationRecords) {
   495	  const answeredTexts = registry.resolvedQuestions.map((question) => question.text);
   496	  const questionEntries = parseStrategyQuestions(strategyContent);
   497	  const answeredSet = new Set(answeredTexts.map(normalizeText));
   498	  const rewrittenQuestionLines = questionEntries.map((question) => {
   499	    const checked = answeredSet.has(normalizeText(question.text));
   500	    return `- [${checked ? 'x' : ' '}] ${question.text}`;
   501	  });
   502	
   503	  const whatWorked = iterationFiles
   504	    .filter((iteration) => iteration.reflectionWorked)
   505	    .map((iteration) => `${iteration.reflectionWorked} (iteration ${iteration.run})`);
   506	  const whatFailed = iterationFiles
   507	    .filter((iteration) => iteration.reflectionFailed)
   508	    .map((iteration) => `${iteration.reflectionFailed} (iteration ${iteration.run})`);
   509	  const nextFocus = resolveNextFocus(registry, iterationFiles, iterationRecords);
   510	
   511	  let updated = strategyContent;
   512	  updated = replaceAnchorSection(updated, 'key-questions', '3. KEY QUESTIONS (remaining)', rewrittenQuestionLines.join('\n'));
   513	  updated = replaceAnchorSection(updated, 'answered-questions', '6. ANSWERED QUESTIONS', blockFromBulletList(answeredTexts));
   514	  updated = replaceAnchorSection(updated, 'what-worked', '7. WHAT WORKED', blockFromBulletList(whatWorked));
   515	  updated = replaceAnchorSection(updated, 'what-failed', '8. WHAT FAILED', blockFromBulletList(whatFailed));
   516	  updated = replaceAnchorSection(updated, 'exhausted-approaches', '9. EXHAUSTED APPROACHES (do not retry)', buildExhaustedApproaches(iterationFiles));
   517	  updated = replaceAnchorSection(
   518	    updated,
   519	    'ruled-out-directions',
   520	    '10. RULED OUT DIRECTIONS',

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/scripts/reduce-state.cjs | sed -n '620,1009p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   620	
   621	  const completedDimensions = REQUIRED_DIMENSIONS
   622	    .filter((dimension) => registry.dimensionCoverage[dimension])
   623	    .map((dimension) => `- [x] ${dimension}`)
   624	    .join('\n') || '[None yet]';
   625	
   626	  const remainingDimensions = REQUIRED_DIMENSIONS
   627	    .filter((dimension) => !registry.dimensionCoverage[dimension])
   628	    .map((dimension) => `- [ ] ${dimension}`)
   629	    .join('\n') || '[All dimensions complete]';
   630	
   631	  // Default next-focus comes from latest iteration → first uncovered dimension → fallback.
   632	  let nextFocus = iterationFiles.map((iteration) => iteration.nextFocus).filter(Boolean).at(-1)
   633	    || REQUIRED_DIMENSIONS.find((dimension) => !registry.dimensionCoverage[dimension])
   634	    || '[All dimensions covered]';
   635	
   636	  // Part C REQ-014 / Phase 008 P1-03 closure: prefer the latest blocked-stop
   637	  // recovery only when blocked-stop is genuinely the most recent loop event.
   638	  // The earlier implementation read timestamps from the markdown iteration
   639	  // files, but parseIterationFile() never captures timestamps, so
   640	  // latestIterationTimestamp was always undefined and any historical
   641	  // blocked-stop permanently pinned next-focus. Fix: source recency from the
   642	  // JSONL iteration records (which do carry timestamps) instead.
   643	  const latestBlockedStop = registry.blockedStopHistory?.at(-1);
   644	  if (latestBlockedStop && latestBlockedStop.timestamp) {
   645	    const latestIterationTimestamp = iterationRecords
   646	      .filter((record) => record?.type === 'iteration' && typeof record.timestamp === 'string')
   647	      .map((record) => record.timestamp)
   648	      .at(-1);
   649	    const blockedIsMostRecent = !latestIterationTimestamp
   650	      || latestBlockedStop.timestamp >= latestIterationTimestamp;
   651	    if (blockedIsMostRecent) {
   652	      const blockers = Array.isArray(latestBlockedStop.blockedBy) && latestBlockedStop.blockedBy.length > 0
   653	        ? latestBlockedStop.blockedBy.join(', ')
   654	        : 'unknown gates';
   655	      const recovery = latestBlockedStop.recoveryStrategy || '[no recovery strategy provided]';
   656	      nextFocus = [
   657	        `BLOCKED on: ${blockers}`,
   658	        `Recovery: ${recovery}`,
   659	        'Address the blocking gates before the next iteration.',
   660	      ].join('\n');
   661	    }
   662	  }
   663	
   664	  let updated = strategyContent;
   665	  updated = replaceAnchorSection(updated, 'review-dimensions', '3. REVIEW DIMENSIONS (remaining)', remainingDimensions, anchorOptions);
   666	  updated = replaceAnchorSection(updated, 'completed-dimensions', '4. COMPLETED DIMENSIONS', completedDimensions, anchorOptions);
   667	  updated = replaceAnchorSection(updated, 'running-findings', '5. RUNNING FINDINGS', runningFindings, anchorOptions);
   668	  updated = replaceAnchorSection(
   669	    updated,
   670	    'exhausted-approaches',
   671	    '9. EXHAUSTED APPROACHES (do not retry)',
   672	    buildExhaustedApproaches(iterationFiles),
   673	    anchorOptions,
   674	  );
   675	  updated = replaceAnchorSection(updated, 'next-focus', '11. NEXT FOCUS', nextFocus, anchorOptions);
   676	  return updated;
   677	}
   678	
   679	function renderDashboard(config, registry, iterationRecords, iterationFiles) {
   680	  const latestIteration = iterationRecords.filter((record) => record.type === 'iteration').at(-1);
   681	  const ratios = iterationRecords
   682	    .filter((record) => record.type === 'iteration')
   683	    .map((record) => (typeof record.newFindingsRatio === 'number' ? record.newFindingsRatio : null))
   684	    .filter((value) => value !== null);
   685	  const lastThreeRatios = ratios.slice(-3).map((value) => value.toFixed(2)).join(' -> ') || 'N/A';
   686	  const nextFocus = iterationFiles.map((iteration) => iteration.nextFocus).filter(Boolean).at(-1)
   687	    || REQUIRED_DIMENSIONS.find((dimension) => !registry.dimensionCoverage[dimension])
   688	    || '[All dimensions covered]';
   689	
   690	  const severity = registry.findingsBySeverity;
   691	  const verdict = severity.P0 > 0
   692	    ? 'FAIL'
   693	    : severity.P1 > 0
   694	      ? 'CONDITIONAL'
   695	      : 'PASS';
   696	  const hasAdvisories = verdict === 'PASS' && severity.P2 > 0;
   697	
   698	  const progressRows = iterationRecords
   699	    .filter((record) => record.type === 'iteration')
   700	    .map((record) => {
   701	      const dimensions = Array.isArray(record.dimensions) ? record.dimensions.join('/') : '-';
   702	      const ratio = typeof record.newFindingsRatio === 'number' ? record.newFindingsRatio.toFixed(2) : '0.00';
   703	      const summary = record.findingsSummary || {};
   704	      const findings = `${summary.P0 ?? 0}/${summary.P1 ?? 0}/${summary.P2 ?? 0}`;
   705	      return `| ${record.run} | ${record.focus || 'unknown'} | ${dimensions} | ${ratio} | ${findings} | ${record.status || 'complete'} |`;
   706	    })
   707	    .join('\n') || '| 0 | none yet | - | 0.00 | 0/0/0 | initialized |';
   708	
   709	  const dimensionRows = REQUIRED_DIMENSIONS
   710	    .map((dimension) => {
   711	      const covered = registry.dimensionCoverage[dimension];
   712	      const status = covered ? 'covered' : 'pending';
   713	      const openInDimension = registry.openFindings.filter((finding) => finding.dimension === dimension).length;
   714	      return `| ${dimension} | ${status} | ${openInDimension} |`;
   715	    })
   716	    .join('\n');
   717	
   718	  return [
   719	    '---',
   720	    'title: Deep Review Dashboard',
   721	    'description: Auto-generated reducer view over the review packet.',
   722	    '---',
   723	    '',
   724	    '# Deep Review Dashboard - Session Overview',
   725	    '',
   726	    'Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.',
   727	    '',
   728	    '<!-- ANCHOR:overview -->',
   729	    '## 1. OVERVIEW',
   730	    '',
   731	    'Reducer-generated observability surface for the active review packet.',
   732	    '',
   733	    '<!-- /ANCHOR:overview -->',
   734	    '<!-- ANCHOR:status -->',
   735	    '## 2. STATUS',
   736	    `- Review Target: ${config.reviewTarget || '[Unknown target]'} (${config.reviewTargetType || 'unknown'})`,
   737	    `- Started: ${config.createdAt || '[Unknown start]'}`,
   738	    `- Status: ${String(config.status || 'initialized').toUpperCase()}`,
   739	    `- Iteration: ${iterationRecords.filter((record) => record.type === 'iteration').length} of ${config.maxIterations || 0}`,
   740	    `- Provisional Verdict: ${verdict}`,
   741	    `- hasAdvisories: ${hasAdvisories}`,
   742	    `- Session ID: ${config.sessionId || '[Unknown session]'}`,
   743	    `- Lifecycle Mode: ${config.lineageMode || 'new'}`,
   744	    `- Generation: ${config.generation ?? 1}`,
   745	    '',
   746	    '<!-- /ANCHOR:status -->',
   747	    '<!-- ANCHOR:findings-summary -->',
   748	    '## 3. FINDINGS SUMMARY',
   749	    '',
   750	    '| Severity | Count |',
   751	    '|----------|------:|',
   752	    `| P0 (Blockers) | ${severity.P0} |`,
   753	    `| P1 (Required) | ${severity.P1} |`,
   754	    `| P2 (Suggestions) | ${severity.P2} |`,
   755	    `| Resolved | ${registry.resolvedFindingsCount} |`,
   756	    '',
   757	    '<!-- /ANCHOR:findings-summary -->',
   758	    '<!-- ANCHOR:progress -->',
   759	    '## 4. PROGRESS',
   760	    '',
   761	    '| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |',
   762	    '|---|-------|------------|-------|----------|--------|',
   763	    progressRows,
   764	    '',
   765	    '<!-- /ANCHOR:progress -->',
   766	    '<!-- ANCHOR:dimension-coverage -->',
   767	    '## 5. DIMENSION COVERAGE',
   768	    '',
   769	    '| Dimension | Status | Open findings |',
   770	    '|-----------|--------|--------------:|',
   771	    dimensionRows,
   772	    '',
   773	    '<!-- /ANCHOR:dimension-coverage -->',
   774	    '<!-- ANCHOR:blocked-stops -->',
   775	    '## 6. BLOCKED STOPS',
   776	    ...(registry.blockedStopHistory && registry.blockedStopHistory.length > 0
   777	      ? registry.blockedStopHistory.flatMap((entry) => {
   778	          const blockers = Array.isArray(entry.blockedBy) && entry.blockedBy.length > 0
   779	            ? entry.blockedBy.join(', ')
   780	            : 'unknown gates';
   781	          const gateSummary = entry.gateResults && typeof entry.gateResults === 'object'
   782	            ? Object.entries(entry.gateResults)
   783	                .map(([gate, result]) => {
   784	                  const pass = result && typeof result === 'object' && 'pass' in result ? result.pass : '?';
   785	                  return `${gate}: ${pass}`;
   786	                })
   787	                .join(', ')
   788	            : '[no gate results]';
   789	          return [
   790	            `### Iteration ${entry.run} — blocked by [${blockers}]`,
   791	            `- Recovery: ${entry.recoveryStrategy || '[no recovery strategy recorded]'}`,
   792	            `- Gate results: ${gateSummary}`,
   793	            `- Timestamp: ${entry.timestamp || '[no timestamp]'}`,
   794	            '',
   795	          ];
   796	        })
   797	      : ['No blocked-stop events recorded.', '']),
   798	    '<!-- /ANCHOR:blocked-stops -->',
   799	    '<!-- ANCHOR:graph-convergence -->',
   800	    '## 7. GRAPH CONVERGENCE',
   801	    `- graphConvergenceScore: ${Number(registry.graphConvergenceScore || 0).toFixed(2)}`,
   802	    `- graphDecision: ${registry.graphDecision || 'none'}`,
   803	    ...(Array.isArray(registry.graphBlockers) && registry.graphBlockers.length > 0
   804	      ? [`- graphBlockers: ${registry.graphBlockers.map((b) => (typeof b === 'string' ? b : JSON.stringify(b))).join(', ')}`]
   805	      : ['- graphBlockers: none']),
   806	    '',
   807	    '<!-- /ANCHOR:graph-convergence -->',
   808	    '<!-- ANCHOR:trend -->',
   809	    '## 8. TREND',
   810	    `- Last 3 ratios: ${lastThreeRatios}`,
   811	    `- convergenceScore: ${Number(registry.convergenceScore || 0).toFixed(2)}`,
   812	    `- openFindings: ${registry.openFindingsCount}`,
   813	    `- persistentSameSeverity: ${(registry.persistentSameSeverity || []).length}`,
   814	    `- severityChanged: ${(registry.severityChanged || []).length}`,
   815	    `- repeatedFindings (deprecated combined bucket): ${registry.repeatedFindings.length}`,
   816	    '',
   817	    '<!-- /ANCHOR:trend -->',
   818	    '<!-- ANCHOR:corruption-warnings -->',
   819	    '## 9. CORRUPTION WARNINGS',
   820	    ...(Array.isArray(registry.corruptionWarnings) && registry.corruptionWarnings.length > 0
   821	      ? registry.corruptionWarnings.map((w) => `- Line ${w.line}: ${w.error} (raw: ${w.raw})`)
   822	      : ['No corrupt JSONL lines detected.']),
   823	    '',
   824	    '<!-- /ANCHOR:corruption-warnings -->',
   825	    '<!-- ANCHOR:next-focus -->',
   826	    '## 10. NEXT FOCUS',
   827	    nextFocus,
   828	    '',
   829	    '<!-- /ANCHOR:next-focus -->',
   830	    '<!-- ANCHOR:active-risks -->',
   831	    '## 11. ACTIVE RISKS',
   832	    ...(function buildActiveRisks() {
   833	      // REQ-034 (042 closing audit, F015): surface non-P0 release-readiness
   834	      // debt alongside P0s so the dashboard cannot hide P1 debt behind a
   835	      // "None active" summary when activeP0 == 0. Gate debt on the latest
   836	      // `blocked_stop` and `claim_adjudication` events so operators see
   837	      // claim-adjudication and legal-stop gate failures, not just severity.
   838	      const lines = [];
   839	      if (latestIteration?.status === 'error') {
   840	        lines.push('- Latest iteration reported error status.');
   841	      }
   842	      if (severity.P0 > 0) {
   843	        lines.push(`- ${severity.P0} active P0 finding(s) blocking release.`);
   844	      }
   845	      if (severity.P1 > 0) {
   846	        lines.push(`- ${severity.P1} active P1 finding(s) — required before release; not a P0 but still blocks PASS.`);
   847	      }
   848	      const latestClaimAdjudication = [...iterationRecords]
   849	        .reverse()
   850	        .find((r) => r && r.type === 'event' && r.event === 'claim_adjudication');
   851	      if (latestClaimAdjudication && latestClaimAdjudication.passed === false) {
   852	        const missing = Array.isArray(latestClaimAdjudication.missingPackets) && latestClaimAdjudication.missingPackets.length > 0
   853	          ? ` (missing packets: ${latestClaimAdjudication.missingPackets.join(', ')})`
   854	          : '';
   855	        lines.push(`- Claim-adjudication gate last failed at run ${latestClaimAdjudication.run ?? '?'}${missing}. STOP is vetoed until every active P0/P1 has a typed claim-adjudication packet.`);
   856	      }
   857	      const latestBlockedStop = [...iterationRecords]
   858	        .reverse()
   859	        .find((r) => r && r.type === 'event' && r.event === 'blocked_stop');
   860	      if (latestBlockedStop && Array.isArray(latestBlockedStop.blockedBy) && latestBlockedStop.blockedBy.length > 0) {
   861	        lines.push(`- Latest blocked_stop at run ${latestBlockedStop.run ?? '?'}: ${latestBlockedStop.blockedBy.join(', ')}. Recovery: ${latestBlockedStop.recoveryStrategy || 'see dashboard §BLOCKED STOPS'}.`);
   862	      }
   863	      if (severity.P2 > 0 && lines.length === 0) {
   864	        lines.push(`- ${severity.P2} active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.`);
   865	      }
   866	      if (lines.length === 0) {
   867	        lines.push('- None active beyond normal review uncertainty.');
   868	      }
   869	      return lines;
   870	    })(),
   871	    '',
   872	    '<!-- /ANCHOR:active-risks -->',
   873	    '',
   874	  ].join('\n');
   875	}
   876	
   877	/**
   878	 * Reduce JSONL state, iteration files, and strategy into synchronized registry,
   879	 * strategy, and dashboard outputs. Idempotent: repeated calls produce identical results.
   880	 *
   881	 * @param {string} specFolder - Path to the spec folder containing a review/ directory
   882	 * @param {Object} [options] - Reducer options
   883	 * @param {boolean} [options.write=true] - Write outputs to disk when true
   884	 * @returns {Object} Paths and content for registry, strategy, and dashboard
   885	 */
   886	function reduceReviewState(specFolder, options = {}) {
   887	  const write = options.write !== false;
   888	  const lenient = Boolean(options.lenient);
   889	  const createMissingAnchors = Boolean(options.createMissingAnchors);
   890	  const resolvedSpecFolder = path.resolve(specFolder);
   891	  const reviewDir = path.join(resolvedSpecFolder, 'review');
   892	  const configPath = path.join(reviewDir, 'deep-review-config.json');
   893	  const stateLogPath = path.join(reviewDir, 'deep-review-state.jsonl');
   894	  const strategyPath = path.join(reviewDir, 'deep-review-strategy.md');
   895	  const registryPath = path.join(reviewDir, 'deep-review-findings-registry.json');
   896	  const dashboardPath = path.join(reviewDir, 'deep-review-dashboard.md');
   897	  const iterationDir = path.join(reviewDir, 'iterations');
   898	
   899	  const config = readJson(configPath);
   900	  const { records, corruptionWarnings } = parseJsonlDetailed(readUtf8(stateLogPath));
   901	  const strategyContent = fs.existsSync(strategyPath) ? readUtf8(strategyPath) : '';
   902	  const strategyDimensions = parseStrategyDimensions(strategyContent);
   903	  const iterationFiles = fs.existsSync(iterationDir)
   904	    ? fs.readdirSync(iterationDir)
   905	        .filter((fileName) => /^iteration-\d+\.md$/.test(fileName))
   906	        .sort()
   907	        .map((fileName) => parseIterationFile(path.join(iterationDir, fileName)))
   908	    : [];
   909	
   910	  const registry = buildRegistry(strategyDimensions, iterationFiles, records, config, corruptionWarnings);
   911	  const strategy = updateStrategyContent(strategyContent, registry, iterationFiles, { createMissingAnchors }, records);
   912	  const dashboard = renderDashboard(config, registry, records, iterationFiles);
   913	
   914	  if (write) {
   915	    writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
   916	    if (strategyContent) {
   917	      writeUtf8(strategyPath, strategy.endsWith('\n') ? strategy : `${strategy}\n`);
   918	    }
   919	    writeUtf8(dashboardPath, dashboard);
   920	  }
   921	
   922	  // Part C REQ-015: fail-closed on corruption. Callers can opt out via lenient:true.
   923	  if (corruptionWarnings.length > 0 && !lenient) {
   924	    const preview = corruptionWarnings
   925	      .slice(0, 3)
   926	      .map((w) => `  - line ${w.line}: ${w.error}`)
   927	      .join('\n');
   928	    process.stderr.write(
   929	      `[sk-deep-review] parseJsonl detected ${corruptionWarnings.length} corrupt line(s) in ${stateLogPath}:\n${preview}\n`
   930	      + 'Pass --lenient to the reducer CLI (or lenient:true to reduceReviewState) to ignore corruption.\n',
   931	    );
   932	  }
   933	
   934	  return {
   935	    configPath,
   936	    stateLogPath,
   937	    strategyPath,
   938	    registryPath,
   939	    dashboardPath,
   940	    registry,
   941	    strategy,
   942	    dashboard,
   943	    corruptionWarnings,
   944	    hasCorruption: corruptionWarnings.length > 0,
   945	  };
   946	}
   947	
   948	// ─────────────────────────────────────────────────────────────────────────────
   949	// 6. CLI ENTRY POINT
   950	// ─────────────────────────────────────────────────────────────────────────────
   951	
   952	if (require.main === module) {
   953	  const args = process.argv.slice(2);
   954	  const lenient = args.includes('--lenient');
   955	  const createMissingAnchors = args.includes('--create-missing-anchors');
   956	  const positional = args.filter((arg) => !arg.startsWith('--'));
   957	  const specFolder = positional[0];
   958	
   959	  if (!specFolder) {
   960	    process.stderr.write(
   961	      'Usage: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder> [--lenient] [--create-missing-anchors]\n',
   962	    );
   963	    process.exit(1);
   964	  }
   965	
   966	  try {
   967	    const result = reduceReviewState(specFolder, { write: true, lenient, createMissingAnchors });
   968	    process.stdout.write(
   969	      `${JSON.stringify(
   970	        {
   971	          registryPath: result.registryPath,
   972	          dashboardPath: result.dashboardPath,
   973	          strategyPath: result.strategyPath,
   974	          openFindingsCount: result.registry.openFindingsCount,
   975	          resolvedFindingsCount: result.registry.resolvedFindingsCount,
   976	          convergenceScore: result.registry.convergenceScore,
   977	          graphConvergenceScore: result.registry.graphConvergenceScore,
   978	          corruptionCount: result.corruptionWarnings.length,
   979	        },
   980	        null,
   981	        2,
   982	      )}\n`,
   983	    );
   984	    // Part C REQ-015: non-zero exit when corruption detected and not lenient.
   985	    if (result.hasCorruption && !lenient) {
   986	      process.exit(2);
   987	    }
   988	  } catch (error) {
   989	    process.stderr.write(`[sk-deep-review] reducer failed: ${error instanceof Error ? error.message : String(error)}\n`);
   990	    process.exit(3);
   991	  }
   992	}
   993	
   994	// ─────────────────────────────────────────────────────────────────────────────
   995	// 7. EXPORTS
   996	// ─────────────────────────────────────────────────────────────────────────────
   997	
   998	module.exports = {
   999	  REQUIRED_DIMENSIONS,
  1000	  SEVERITY_KEYS,
  1001	  SEVERITY_WEIGHTS,
  1002	  buildGraphConvergenceRollup,
  1003	  parseIterationFile,
  1004	  parseJsonl,
  1005	  parseJsonlDetailed,
  1006	  parseFindingLine,
  1007	  replaceAnchorSection,
  1008	  reduceReviewState,
  1009	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/scripts/reduce-state.cjs | sed -n '260,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	  for (const iteration of iterationFiles) {
   261	    for (const finding of iteration.findings) {
   262	      const existing = findingById.get(finding.findingId);
   263	      if (!existing) {
   264	        findingById.set(finding.findingId, {
   265	          ...finding,
   266	          dimension: deriveDimension(finding, iteration),
   267	          firstSeen: iteration.run,
   268	          lastSeen: iteration.run,
   269	          status: 'active',
   270	          transitions: [{
   271	            iteration: iteration.run,
   272	            from: null,
   273	            to: finding.severity,
   274	            reason: 'Initial discovery',
   275	          }],
   276	        });
   277	      } else {
   278	        existing.lastSeen = iteration.run;
   279	        if (existing.severity !== finding.severity) {
   280	          existing.transitions.push({
   281	            iteration: iteration.run,
   282	            from: existing.severity,
   283	            to: finding.severity,
   284	            reason: 'Severity adjusted in later iteration',
   285	          });
   286	          existing.severity = finding.severity;
   287	        }
   288	      }
   289	    }
   290	  }
   291	
   292	  const resolvedIdSet = new Set();
   293	  for (const record of iterationRecords) {
   294	    if (Array.isArray(record.resolvedFindings)) {
   295	      for (const id of record.resolvedFindings) {
   296	        resolvedIdSet.add(id);
   297	      }
   298	    }
   299	  }
   300	
   301	  const openFindings = [];
   302	  const resolvedFindings = [];
   303	  for (const finding of findingById.values()) {
   304	    if (resolvedIdSet.has(finding.findingId)) {
   305	      finding.status = 'resolved';
   306	      resolvedFindings.push(finding);
   307	    } else {
   308	      openFindings.push(finding);
   309	    }
   310	  }
   311	
   312	  openFindings.sort(compareFindings);
   313	  resolvedFindings.sort(compareFindings);
   314	
   315	  return { openFindings, resolvedFindings };
   316	}
   317	
   318	function compareFindings(left, right) {
   319	  const severityOrder = { P0: 0, P1: 1, P2: 2 };
   320	  const severityDiff = (severityOrder[left.severity] ?? 9) - (severityOrder[right.severity] ?? 9);
   321	  if (severityDiff !== 0) {
   322	    return severityDiff;
   323	  }
   324	  return left.findingId.localeCompare(right.findingId);
   325	}
   326	
   327	function deriveDimension(finding, iteration) {
   328	  const focus = `${iteration.focus} ${finding.title} ${finding.description}`.toLowerCase();
   329	  for (const dimension of REQUIRED_DIMENSIONS) {
   330	    if (focus.includes(dimension)) {
   331	      return dimension;
   332	    }
   333	  }
   334	  return iteration.dimensionsAddressed[0] || 'correctness';
   335	}
   336	
   337	function buildDimensionCoverage(iterationRecords, strategyDimensions) {
   338	  const covered = {};
   339	  for (const dimension of REQUIRED_DIMENSIONS) {
   340	    covered[dimension] = false;
   341	  }
   342	
   343	  for (const record of iterationRecords) {
   344	    if (!Array.isArray(record.dimensions)) {
   345	      continue;
   346	    }
   347	    for (const dimension of record.dimensions) {
   348	      const normalized = String(dimension).toLowerCase();
   349	      if (normalized in covered) {
   350	        covered[normalized] = true;
   351	      }
   352	    }
   353	  }
   354	
   355	  for (const entry of strategyDimensions) {
   356	    if (!entry.checked) {
   357	      continue;
   358	    }
   359	    const normalized = entry.text.toLowerCase();
   360	    for (const dimension of REQUIRED_DIMENSIONS) {
   361	      if (normalized.includes(dimension)) {
   362	        covered[dimension] = true;
   363	      }
   364	    }
   365	  }
   366	
   367	  return covered;
   368	}
   369	
   370	function buildFindingsBySeverity(openFindings) {
   371	  const counts = zeroSeverityMap();
   372	  for (const finding of openFindings) {
   373	    if (SEVERITY_KEYS.includes(finding.severity)) {
   374	      counts[finding.severity] += 1;
   375	    }
   376	  }
   377	  return counts;
   378	}
   379	
   380	function computeConvergenceScore(iterationRecords) {
   381	  const latest = iterationRecords.filter((record) => record.type === 'iteration').at(-1);
   382	  if (!latest) {
   383	    return 0;
   384	  }
   385	  return (
   386	    latest?.convergenceSignals?.compositeStop
   387	    ?? (typeof latest?.newFindingsRatio === 'number' ? 1 - latest.newFindingsRatio : 0)
   388	    ?? 0
   389	  );
   390	}
   391	
   392	function computeGraphConvergenceScore(signals) {
   393	  if (!signals || typeof signals !== 'object' || Array.isArray(signals)) {
   394	    return 0;
   395	  }
   396	
   397	  const namedScore = signals.score
   398	    ?? signals.convergenceScore
   399	    ?? signals.compositeScore
   400	    ?? signals.stopScore
   401	    ?? signals.decisionScore;
   402	  if (typeof namedScore === 'number' && Number.isFinite(namedScore)) {
   403	    return namedScore;
   404	  }
   405	
   406	  const numericSignals = Object.values(signals)
   407	    .filter((value) => typeof value === 'number' && Number.isFinite(value));
   408	  if (!numericSignals.length) {
   409	    return 0;
   410	  }
   411	
   412	  const sum = numericSignals.reduce((total, value) => total + value, 0);
   413	  return sum / numericSignals.length;
   414	}
   415	
   416	function buildGraphConvergenceRollup(records) {
   417	  const latest = records
   418	    .filter((record) => record?.type === 'event' && record?.event === 'graph_convergence')
   419	    .at(-1);
   420	
   421	  if (!latest) {
   422	    return {
   423	      score: 0,
   424	      decision: null,
   425	      blockers: [],
   426	    };
   427	  }
   428	
   429	  return {
   430	    score: computeGraphConvergenceScore(latest.signals),
   431	    decision: normalizeText(latest.decision || '') || null,
   432	    blockers: Array.isArray(latest.blockers) ? latest.blockers : [],
   433	  };
   434	}
   435	
   436	/**
   437	 * Phase 008 P1-02 closure: defensively normalize each entry in `blockedBy` so
   438	 * the review dashboard cannot render `[object Object]` even if an older YAML
   439	 * workflow accidentally passes structured graph blockers through the contract.
   440	 *
   441	 * Contract: `blockedBy` is `string[]` of gate names. If an entry is already a
   442	 * string, pass it through. If it is a structured graph blocker object
   443	 * (`{type, description, count, severity}`), prefer `.type`, then `.name`, then
   444	 * a short JSON preview. If it is anything else, stringify it.
   445	 */
   446	function normalizeBlockedByList(value, legacyLegalStop) {
   447	  const rawList = Array.isArray(value)
   448	    ? value
   449	    : Array.isArray(legacyLegalStop?.blockedBy)
   450	      ? legacyLegalStop.blockedBy
   451	      : [];
   452	
   453	  return rawList.map((entry) => {
   454	    if (typeof entry === 'string') return entry;
   455	    if (entry && typeof entry === 'object') {
   456	      if (typeof entry.type === 'string' && entry.type.length > 0) return entry.type;
   457	      if (typeof entry.name === 'string' && entry.name.length > 0) return entry.name;
   458	      return 'graph_blocker';
   459	    }
   460	    return String(entry);
   461	  });
   462	}
   463	
   464	function buildBlockedStopHistory(records) {
   465	  return records
   466	    .filter((record) => record?.type === 'event' && record?.event === 'blocked_stop')
   467	    .map((record) => {
   468	      const legacyLegalStop = record.legalStop && typeof record.legalStop === 'object'
   469	        ? record.legalStop
   470	        : {};
   471	      const blockedBy = normalizeBlockedByList(record.blockedBy, legacyLegalStop);
   472	      const graphBlockerDetail = Array.isArray(record.graphBlockerDetail)
   473	        ? record.graphBlockerDetail
   474	        : Array.isArray(record.blockedBy) && record.blockedBy.some((e) => e && typeof e === 'object')
   475	          ? record.blockedBy
   476	          : [];
   477	
   478	      return {
   479	        run: typeof record.run === 'number' ? record.run : 0,
   480	        blockedBy,
   481	        graphBlockerDetail,
   482	        gateResults: record.gateResults && typeof record.gateResults === 'object'
   483	          ? record.gateResults
   484	          : legacyLegalStop.gateResults && typeof legacyLegalStop.gateResults === 'object'
   485	            ? legacyLegalStop.gateResults
   486	            : {},
   487	        recoveryStrategy: normalizeText(record.recoveryStrategy || ''),
   488	        timestamp: normalizeText(record.timestamp || ''),
   489	      };
   490	    });
   491	}
   492	
   493	function buildRegistry(strategyDimensions, iterationFiles, iterationRecords, config, corruptionWarnings = []) {
   494	  const { openFindings, resolvedFindings } = buildFindingRegistry(iterationFiles, iterationRecords);
   495	  const dimensionCoverage = buildDimensionCoverage(iterationRecords, strategyDimensions);
   496	  const findingsBySeverity = buildFindingsBySeverity(openFindings);
   497	  const convergenceScore = computeConvergenceScore(iterationRecords);
   498	  const graphConvergence = buildGraphConvergenceRollup(iterationRecords);
   499	  const blockedStopHistory = buildBlockedStopHistory(iterationRecords);
   500	
   501	  // Part C REQ-018: split repeatedFindings into two semantically distinct buckets
   502	  // so persistent-same-severity findings and severity-churn findings don't collapse.
   503	  const persistentSameSeverity = openFindings.filter((finding) => {
   504	    if (finding.lastSeen - finding.firstSeen < 1) return false;
   505	    const transitions = Array.isArray(finding.transitions) ? finding.transitions : [];
   506	    // Exclude the initial discovery transition from the "no change" count
   507	    const nontrivialTransitions = transitions.filter((t) => t.from !== null);
   508	    return nontrivialTransitions.length === 0;
   509	  });
   510	
   511	  const severityChanged = openFindings.filter((finding) => {
   512	    const transitions = Array.isArray(finding.transitions) ? finding.transitions : [];
   513	    const nontrivialTransitions = transitions.filter((t) => t.from !== null);
   514	    return nontrivialTransitions.length > 0;
   515	  });
   516	
   517	  // Deprecated: keep repeatedFindings for backward compatibility with older consumers.
   518	  // New code should read persistentSameSeverity + severityChanged directly.
   519	  const repeatedFindings = openFindings.filter((finding) => finding.lastSeen - finding.firstSeen >= 1);
   520	
   521	  return {
   522	    sessionId: config.sessionId || '',
   523	    generation: config.generation ?? 1,
   524	    lineageMode: config.lineageMode || 'new',
   525	    openFindings,
   526	    resolvedFindings,
   527	    blockedStopHistory,
   528	    persistentSameSeverity,
   529	    severityChanged,
   530	    repeatedFindings,
   531	    dimensionCoverage,
   532	    findingsBySeverity,
   533	    openFindingsCount: openFindings.length,
   534	    resolvedFindingsCount: resolvedFindings.length,
   535	    convergenceScore,
   536	    graphConvergenceScore: graphConvergence.score,
   537	    graphDecision: graphConvergence.decision,
   538	    graphBlockers: graphConvergence.blockers,
   539	    corruptionWarnings,
   540	  };
   541	}
   542	
   543	function blockFromBulletList(items) {
   544	  if (!items.length) {
   545	    return '[None yet]';
   546	  }
   547	  return items.map((item) => `- ${item}`).join('\n');
   548	}
   549	
   550	function buildExhaustedApproaches(iterationFiles) {
   551	  const grouped = new Map();
   552	
   553	  for (const iteration of iterationFiles) {
   554	    for (const entry of iteration.deadEnds.concat(iteration.ruledOut)) {
   555	      const bucket = grouped.get(entry) || [];
   556	      bucket.push(iteration.run);
   557	      grouped.set(entry, bucket);
   558	    }
   559	  }
   560	
   561	  if (!grouped.size) {
   562	    return '[No exhausted approach categories yet]';
   563	  }
   564	
   565	  return Array.from(grouped.entries())
   566	    .sort(([left], [right]) => left.localeCompare(right))
   567	    .map(([entry, runs]) => {
   568	      const attemptCount = runs.length;
   569	      const lastRun = Math.max(...runs);
   570	      return [
   571	        `### ${entry} -- BLOCKED (iteration ${lastRun}, ${attemptCount} attempts)`,
   572	        `- What was tried: ${entry}`,
   573	        `- Why blocked: Repeated iteration evidence ruled this direction out.`,
   574	        `- Do NOT retry: ${entry}`,
   575	      ].join('\n');
   576	    })
   577	    .join('\n\n');
   578	}
   579	
   580	function replaceAnchorSection(content, anchorId, heading, body, options = {}) {
   581	  const pattern = new RegExp(`<!-- ANCHOR:${anchorId} -->[\\s\\S]*?<!-- \\/ANCHOR:${anchorId} -->`, 'm');
   582	  const replacement = [
   583	    `<!-- ANCHOR:${anchorId} -->`,
   584	    `## ${heading}`,
   585	    body.trim() ? body.trim() : '[None yet]',
   586	    '',
   587	    `<!-- /ANCHOR:${anchorId} -->`,
   588	  ].join('\n');
   589	
   590	  if (!pattern.test(content)) {
   591	    if (options.createMissing) {
   592	      const suffix = content.endsWith('\n') ? '' : '\n';
   593	      return `${content}${suffix}\n${replacement}\n`;
   594	    }
   595	    throw new Error(
   596	      `Missing machine-owned anchor "${anchorId}" in deep-review strategy file. `
   597	      + 'Pass createMissing:true (or the reducer CLI flag --create-missing-anchors) to bootstrap.',
   598	    );
   599	  }
   600	  return content.replace(pattern, replacement);
   601	}
   602	
   603	function updateStrategyContent(strategyContent, registry, iterationFiles, options = {}, iterationRecords = []) {
   604	  // Early return when there is no strategy file to update. Empty content
   605	  // cannot contain the machine-owned anchors and replaceAnchorSection would
   606	  // correctly fail-close — but for that specific case we intentionally skip
   607	  // rather than throw so bootstrap flows (no strategy yet) still work.
   608	  if (!strategyContent) {
   609	    return strategyContent;
   610	  }
   611	
   612	  const anchorOptions = { createMissing: Boolean(options.createMissingAnchors) };
   613	  const severity = registry.findingsBySeverity;
   614	  const runningFindings = [
   615	    `- P0 (Blockers): ${severity.P0}`,
   616	    `- P1 (Required): ${severity.P1}`,
   617	    `- P2 (Suggestions): ${severity.P2}`,
   618	    `- Resolved: ${registry.resolvedFindingsCount}`,
   619	  ].join('\n');
   620	

exec
/bin/zsh -lc 'rg -n "runtime_capabilities|capability|runtime capabilities|runtime matrix|runtimeIds|resolveRuntimeCapability|listRuntimeCapabilityIds" .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md .opencode/skill/sk-deep-research/references/*.md .opencode/skill/sk-deep-review/references/*.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-review/references/state_format.md:70:    "overlay": ["feature_catalog_code", "playbook_capability"]
.opencode/skill/sk-deep-review/references/state_format.md:798:| playbook_capability | overlay | skill, agent, spec-folder | advisory |
.opencode/skill/sk-deep-review/references/loop_protocol.md:101:   | Overlay | `feature_catalog_code` | skill, spec-folder, track, files | advisory | Verify catalog claims match capability |
.opencode/skill/sk-deep-review/references/loop_protocol.md:102:   | Overlay | `playbook_capability` | skill, agent, spec-folder | advisory | Verify playbook scenarios match executable reality |
.opencode/skill/sk-deep-review/references/loop_protocol.md:270:| `skill_agent` | Compare SKILL.md contracts against runtime agent definitions | Agreement/drift/disagreement per capability |
.opencode/skill/sk-deep-review/references/loop_protocol.md:273:| `playbook_capability` | Validate playbook scenarios against executable reality | Executable/needs-update/impossible per scenario |
.opencode/skill/sk-deep-research/references/loop_protocol.md:17:Runtime capability matrix references for parity-sensitive loop behavior:
.opencode/skill/sk-deep-research/references/loop_protocol.md:18:- Human-readable matrix: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
.opencode/skill/sk-deep-research/references/loop_protocol.md:19:- Machine-readable matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
.opencode/skill/sk-deep-research/references/loop_protocol.md:614:   - **Overlay**: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`
.opencode/skill/sk-deep-research/references/loop_protocol.md:702:| Overlay | `feature_catalog_code` | skill, spec-folder, track, files | advisory | Verify catalog claims match capability |
.opencode/skill/sk-deep-research/references/loop_protocol.md:703:| Overlay | `playbook_capability` | skill, agent, spec-folder | advisory | Verify playbook scenarios match executable reality |
.opencode/skill/sk-deep-research/references/capability_matrix.md:14:- Data: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
.opencode/skill/sk-deep-research/references/state_format.md:31:Runtime capability matrix references for parity-sensitive surfaces:
.opencode/skill/sk-deep-research/references/state_format.md:32:- Human-readable matrix: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
.opencode/skill/sk-deep-research/references/state_format.md:33:- Machine-readable matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
.opencode/skill/sk-deep-research/references/state_format.md:906:    "overlay": ["feature_catalog_code", "playbook_capability"]
.opencode/skill/sk-deep-research/references/quick_reference.md:87:> **Runtime capability matrix:** `.opencode/skill/sk-deep-research/references/capability_matrix.md` and `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`

exec
/bin/zsh -lc 'rg -n "stopReason|legalStop|blocked_stop|continuedFromRun|journal|ledger|snapshot|compaction|observability|novelty|contradiction|citation|coverage depth|coverageDepth|durationMs|toolsUsed|sourcesQueried|inventory|promotion|coordination|council|graph convergence|liveness|token|wall-clock|resume|start-from-run|replay" .opencode/skill/sk-deep-research/references/state_format.md .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-review/references/state_format.md .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/skill/sk-deep-review/references/convergence.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-review/references/state_format.md:63:  "continuedFromRun": null,
.opencode/skill/sk-deep-review/references/state_format.md:114:| lineageMode | string | `"new"` | `new`, `resume`, `restart`. `fork` and `completed-continue` are deferred and not emitted by the current runtime |
.opencode/skill/sk-deep-review/references/state_format.md:115:| generation | number | 1 | Lineage generation number — incremented on `restart`, unchanged on `resume` |
.opencode/skill/sk-deep-review/references/state_format.md:116:| continuedFromRun | number \| null | `null` | Count of completed iteration records at the lifecycle boundary (set on `resume` and `restart`) |
.opencode/skill/sk-deep-review/references/state_format.md:168:{"type":"config","mode":"review","topic":"...","reviewTarget":"...","sessionId":"rvw-...","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":7,"convergenceThreshold":0.10,"createdAt":"2026-03-24T14:00:00Z","specFolder":"..."}
.opencode/skill/sk-deep-review/references/state_format.md:181:  "lineageMode": "resume",
.opencode/skill/sk-deep-review/references/state_format.md:183:  "continuedFromRun": null,
.opencode/skill/sk-deep-review/references/state_format.md:188:  "timestamp": "2026-03-24T14:30:00Z", "durationMs": 52000
.opencode/skill/sk-deep-review/references/state_format.md:192:**Required fields:** `type`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, `durationMs`
.opencode/skill/sk-deep-review/references/state_format.md:194:**Optional fields:** `parentSessionId`, `continuedFromRun`, `findingsRefined`, `findingRefs`, `traceabilityChecks`, `coverage`, `noveltyJustification`, `ruledOut`, `focusTrack`, `scoreEstimate`, `segment`, `convergenceSignals`, `graphEvents`
.opencode/skill/sk-deep-review/references/state_format.md:238:    { "type": "finding", "id": "f-001", "label": "Missing CSRF token check on session POST" },
.opencode/skill/sk-deep-review/references/state_format.md:245:  "durationMs": 51000
.opencode/skill/sk-deep-review/references/state_format.md:281:  "dimensionCoverage": 1.0, "stopReason": "composite_converged",
.opencode/skill/sk-deep-review/references/state_format.md:286:**Required:** `type`, `event`, `mode`, `totalIterations`, `verdict`, `activeP0`, `activeP1`, `activeP2`, `dimensionCoverage`, `stopReason`, `timestamp`
.opencode/skill/sk-deep-review/references/state_format.md:290:When the review legal-stop decision tree returns `blocked`, append a first-class `blocked_stop` event instead of silently overriding STOP to CONTINUE.
.opencode/skill/sk-deep-review/references/state_format.md:295:  "event": "blocked_stop",
.opencode/skill/sk-deep-review/references/state_format.md:348:**Combined-stop rule:** Final STOP is legal only when the inline review convergence decision says STOP and the latest `graph_convergence.decision == "STOP_ALLOWED"`. If the latest graph decision is `STOP_BLOCKED`, set `stop_blocked=true`, emit `blocked_stop`, and continue recovery instead of stopping. If the latest graph decision is `CONTINUE`, downgrade the inline STOP candidate to CONTINUE.
.opencode/skill/sk-deep-review/references/state_format.md:363:  "stopReason": "userPaused",
.opencode/skill/sk-deep-review/references/state_format.md:376:  "stopReason": "stuckRecovery",
.opencode/skill/sk-deep-review/references/state_format.md:378:  "strategy": "Traceability protocol replay: re-run unresolved core or overlay checks",
.opencode/skill/sk-deep-review/references/state_format.md:499:  "lineageMode": "resume",
.opencode/skill/sk-deep-review/references/state_format.md:533:| `blockedStopHistory` | array | One entry per `blocked_stop` JSONL event: `{run, blockedBy, gateResults, recoveryStrategy, timestamp}`. Rendered in the dashboard `BLOCKED STOPS` section and can drive the strategy `next-focus` anchor when blocked-stop is the most recent loop event. |
.opencode/skill/sk-deep-review/references/state_format.md:542:When no `blocked_stop` event has been recorded yet, `blockedStopHistory: []`.
.opencode/skill/sk-deep-review/references/state_format.md:550:- **Strategy next-focus override**: When the latest `blocked_stop` event timestamp is newer than the latest iteration timestamp, the reducer rewrites the strategy `next-focus` anchor to surface the blocking gates and recovery hint so operators see the blocker before choosing the next iteration direction.
.opencode/skill/sk-deep-review/references/state_format.md:626:| 9 | Audit Appendix | Coverage, convergence replay, audit detail |
.opencode/skill/sk-deep-review/references/state_format.md:642:**Audit Appendix** contains iteration table, convergence signal replay, file coverage matrix, and dimension breakdown.
.opencode/skill/sk-deep-review/references/state_format.md:705:| `evidenceRefs` | string[] | `file:line` or `file:range` citations that substantiate the claim (at least one entry) |
.opencode/skill/sk-deep-review/references/convergence.md:23:Convergence is checked **after** each iteration completes and **before** the next iteration is dispatched. The check consumes the full JSONL state history and the current dimension coverage snapshot.
.opencode/skill/sk-deep-review/references/convergence.md:44:Every terminal stop and every blocked-stop vote MUST emit the shared stop contract from REQ-001: a named `stopReason` enum plus — when STOP is vetoed — a `blocked_stop` event written to `deep-review-state.jsonl`. There is no nested `legalStop` wrapper on the persisted path; earlier drafts of this document implied one, and that drift was the source of F009 in the 042 closing audit.
.opencode/skill/sk-deep-review/references/convergence.md:46:#### stopReason Enum
.opencode/skill/sk-deep-review/references/convergence.md:48:| `stopReason` | Meaning |
.opencode/skill/sk-deep-review/references/convergence.md:58:#### blocked_stop Event (canonical, persisted)
.opencode/skill/sk-deep-review/references/convergence.md:60:`step_emit_blocked_stop` in both `spec_kit_deep-review_{auto,confirm}.yaml` appends the following record to `deep-review-state.jsonl` whenever the legal-stop decision tree vetoes STOP. The gate names and their shapes are load-bearing — the reducer reads them verbatim:
.opencode/skill/sk-deep-review/references/convergence.md:65:  "event": "blocked_stop",
.opencode/skill/sk-deep-review/references/convergence.md:88:- `blockedBy`: array of gate names that failed (string[] — never structured objects). Empty when STOP is legal, in which case no `blocked_stop` event is emitted.
.opencode/skill/sk-deep-review/references/convergence.md:91:- When the graph convergence verdict is `STOP_BLOCKED`, the same event is emitted with `blocked_gate == "graph_blockers"` folded into `blockedBy` and the structured blocker objects preserved under `graph_blocker_detail_json` (see phase 008 P1-02 closure in the auto YAML).
.opencode/skill/sk-deep-review/references/convergence.md:101:5. **Legal-stop gate bundle** -- review-specific stop gates; if a stop vote fails any gate, persist `stopReason=blockedStop` and continue.
.opencode/skill/sk-deep-review/references/convergence.md:116:  return { action: "STOP", stopReason: "maxIterationsReached" }
.opencode/skill/sk-deep-review/references/convergence.md:127:      return { action: "STOP", stopReason: "converged" }
.opencode/skill/sk-deep-review/references/convergence.md:130:Triggers when all 4 dimensions (correctness, security, traceability, maintainability) are covered, no active P0/P1 remains, at least 1 stabilization pass has occurred, and the 5-gate legal-stop bundle passes. If gates fail, the loop records `stopReason=blockedStop` and continues despite full coverage.
.opencode/skill/sk-deep-review/references/convergence.md:161:The recovery entry uses `stopReason=stuckRecovery` while the loop is in recovery. If recovery later terminates the run, the terminal record keeps the same shared enum value instead of minting a review-only label.
.opencode/skill/sk-deep-review/references/convergence.md:169:Three independent signals each cast a stop/continue vote. Stop when the weighted stop-score meets or exceeds the consensus threshold. The signal set below matches the authoritative 3-signal vote in `spec_kit_deep-review_{auto,confirm}.yaml` `step_check_convergence` and the quick-reference convergence table — the 3rd signal is **dimension coverage**, not a standalone novelty ratio.
.opencode/skill/sk-deep-review/references/convergence.md:229:Measures how much genuinely new review insight each iteration contributes beyond surface-level overlap with prior findings. Unlike `newFindingsRatio` (which is severity-weighted), `semanticNovelty` evaluates the conceptual novelty of findings independent of severity weighting.
.opencode/skill/sk-deep-review/references/convergence.md:280:1. **findingStability gate** (existing): The existing `findingStability` gate already evaluates rolling average, MAD noise floor, and novelty ratio. The new `semanticNovelty` signal adds a sub-check:
.opencode/skill/sk-deep-review/references/convergence.md:286:The gate passes only when both the existing churn-based checks AND the semantic stability checks agree. When a semantic check fails, the `legalStop.gateResults.findingStability` detail string includes the semantic signal values.
.opencode/skill/sk-deep-review/references/convergence.md:317:| 2 | Rolling avg + novelty ratio | Two-signal vote, reweighted |
.opencode/skill/sk-deep-review/references/convergence.md:334:| **P0** (Blocker) | 10.0 | Correctness failures, security vulnerabilities, spec contradictions |
.opencode/skill/sk-deep-review/references/convergence.md:377:| **findingStability** | Rolling average, MAD noise floor, and novelty ratio must all indicate low-yield review churn | Block STOP, persist `blockedStop` |
.opencode/skill/sk-deep-review/references/convergence.md:390:      detail: "Rolling average, MAD noise floor, and novelty ratio are all below stop thresholds."
.opencode/skill/sk-deep-review/references/convergence.md:420:When convergence math returns STOP, invoke `buildReviewLegalStop()`. If it returns `pass: false`, persist a first-class blocked-stop decision with `stopReason=blockedStop`, populate `legalStop.blockedBy` from the failing gates, copy the full `gateResults`, snapshot the replay inputs, and attach a `recoveryStrategy` describing the next review action before overriding the decision to CONTINUE.
.opencode/skill/sk-deep-review/references/convergence.md:426:| `findingStability` | Revisit the noisiest recent dimension and reduce novelty by closing obvious follow-up loops before re-checking STOP. |
.opencode/skill/sk-deep-review/references/convergence.md:429:| `evidenceDensity` | Re-read weakly supported findings and add concrete `file:line` citations before they count toward a stop decision. |
.opencode/skill/sk-deep-review/references/convergence.md:434:Use this table when replaying old packets or translating older prose/docs into the shared stop contract.
.opencode/skill/sk-deep-review/references/convergence.md:436:| Legacy label | New `stopReason` | Mapping note |
.opencode/skill/sk-deep-review/references/convergence.md:503:| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay:** re-run the unresolved traceability protocol directly against the conflicting artifacts |
.opencode/skill/sk-deep-review/references/convergence.md:530:    return { strategy: "protocol_first_replay", dimension: leastCovered }
.opencode/skill/sk-deep-review/references/convergence.md:544:- protocol_first_replay: Re-run the incomplete traceability protocol against conflicting artifacts.
.opencode/skill/sk-deep-review/references/convergence.md:608:legalStop:
.opencode/skill/sk-deep-review/references/convergence.md:611:  replayInputs: [snapshot of ratios, coverage, and gate inputs]
.opencode/skill/sk-deep-review/references/convergence.md:624:  "stopReason": "converged",
.opencode/skill/sk-deep-review/references/convergence.md:625:  "legalStop": {
.opencode/skill/sk-deep-review/references/convergence.md:628:      "findingStability": { "pass": true, "detail": "Rolling average, MAD noise floor, and novelty ratio all voted STOP." },
.opencode/skill/sk-deep-review/references/convergence.md:634:    "replayInputs": {
.opencode/skill/sk-deep-review/references/convergence.md:637:      "noveltyRatio": 0.03,
.opencode/skill/sk-deep-review/references/convergence.md:656:    { "name": "noveltyRatio", "value": 0.03, "stop": true, "weight": 0.45 }
.opencode/skill/sk-deep-review/references/convergence.md:721:The following convergence thresholds are managed by the offline loop optimizer (042.004). Changes to these fields are proposed through the optimizer's advisory-only promotion gate and reviewed by humans before adoption.
.opencode/skill/sk-deep-review/references/convergence.md:736:- `stopReason` enum values and semantics
.opencode/skill/sk-deep-review/references/convergence.md:737:- `legalStop` record structure and gate names
.opencode/skill/sk-deep-review/references/loop_protocol.md:64:   - `resume`: config + state + strategy all exist and agree
.opencode/skill/sk-deep-review/references/loop_protocol.md:106:6. **Write config**: `{spec_folder}/review/deep-review-config.json` with `mode: "review"`, lineage metadata (`sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, `releaseReadinessState`), and review-specific fields including target, target type, dimensions, protocol plan, and release-readiness state.
.opencode/skill/sk-deep-review/references/loop_protocol.md:154:| Inputs | `latestJSONLDelta`, `newIterationFile`, `priorReducedState` | The reducer replays only the newest JSONL delta plus the latest iteration artifact against the prior reduced state. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:172:If convergence math or a hard-stop candidate points to STOP, the workflow must run the review legal-stop decision tree before actually stopping. That decision tree records five review-specific gates: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate`. If any gate fails, the loop does **not** stop. Instead it emits a first-class `blocked_stop` JSONL event with:
.opencode/skill/sk-deep-review/references/loop_protocol.md:196:   - Log event to JSONL: `{"type":"event","event":"userPaused","mode":"review","stopReason":"userPaused","reason":"sentinel file detected"}`
.opencode/skill/sk-deep-review/references/loop_protocol.md:199:     Review paused. Delete review/.deep-review-pause to resume.
.opencode/skill/sk-deep-review/references/loop_protocol.md:203:3. On resume (file deleted and loop restarted):
.opencode/skill/sk-deep-review/references/loop_protocol.md:204:   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
.opencode/skill/sk-deep-review/references/loop_protocol.md:213:Generate a compact state summary (~200 tokens) for injection into the dispatch prompt:
.opencode/skill/sk-deep-review/references/loop_protocol.md:281:- `evidence`: Array of file:line citations
.opencode/skill/sk-deep-review/references/loop_protocol.md:314:| `evidenceRefs` | string[] | `file:line` or `file:range` citations (≥ 1) |
.opencode/skill/sk-deep-review/references/loop_protocol.md:365:| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay**: re-run the unresolved traceability protocol directly against the conflicting artifacts |
.opencode/skill/sk-deep-review/references/loop_protocol.md:380:    return { strategy: "protocol_first_replay" }
.opencode/skill/sk-deep-review/references/loop_protocol.md:424:5. Compare the replayed decision and stop reason to the recorded synthesis event
.opencode/skill/sk-deep-review/references/loop_protocol.md:426:Replay passes only when the recomputed decision, thresholds, and gate outcomes agree with the persisted result. If replay fails, log a warning in the audit appendix but proceed with synthesis.
.opencode/skill/sk-deep-review/references/loop_protocol.md:442:| 9 | Audit Appendix | Coverage, replay validation, convergence evidence |
.opencode/skill/sk-deep-review/references/loop_protocol.md:471:     "stopReason": "...",
.opencode/skill/sk-deep-review/references/loop_protocol.md:507:<!-- ANCHOR:auto-resume-protocol -->
.opencode/skill/sk-deep-review/references/loop_protocol.md:512:Enable review sessions to resume seamlessly from prior state when interrupted by context compaction, process termination, or intentional pause.
.opencode/skill/sk-deep-review/references/loop_protocol.md:522:5. **Log resume**: Append the canonical resume event to `deep-review-state.jsonl`. The reducer requires every field below:
.opencode/skill/sk-deep-review/references/loop_protocol.md:524:   {"type":"event","event":"resumed","mode":"review","sessionId":"rvw-2026-03-24T10-00-00Z","parentSessionId":"rvw-2026-03-24T10-00-00Z","lineageMode":"resume","continuedFromRun":4,"generation":1,"archivedPath":null,"timestamp":"2026-03-24T14:05:00Z"}
.opencode/skill/sk-deep-review/references/loop_protocol.md:530:The runtime supports three lineage modes today. `fork` and `completed-continue` were described in earlier drafts but have no workflow wiring in this release, so they MUST NOT be exposed to operators. If the long-form lineage feature is picked up later it will arrive with first-class event emission, reducer ancestry handling, and replay fixtures; until then treat the contract below as canonical.
.opencode/skill/sk-deep-review/references/loop_protocol.md:535:| `resume` | same | same | none | `resumed` (see example above) | operator wants to continue the current lineage boundary |
.opencode/skill/sk-deep-review/references/loop_protocol.md:536:| `restart` | fresh | `prior + 1` | prior `review/` tree moved under `review_archive/{timestamp}/` | `restarted` (same field set plus non-null `archivedPath`) | operator wants to clear the workspace and replay with a new angle |
.opencode/skill/sk-deep-review/references/loop_protocol.md:543:  "event": "resumed | restarted",
.opencode/skill/sk-deep-review/references/loop_protocol.md:546:  "parentSessionId": "<session id of the prior lineage (equals sessionId on resume)>",
.opencode/skill/sk-deep-review/references/loop_protocol.md:547:  "lineageMode": "resume | restart",
.opencode/skill/sk-deep-review/references/loop_protocol.md:549:  "continuedFromRun": <number or null>,
.opencode/skill/sk-deep-review/references/loop_protocol.md:555:Every field in the contract MUST be present on every persisted lifecycle event. `archivedPath` is null for `resumed` and set to the archive destination for `restarted`. `continuedFromRun` is the number of completed iteration records before the lifecycle boundary. Reducer parity tests ensure the dashboard `Lifecycle` section reads exactly those fields.
.opencode/skill/sk-deep-review/references/loop_protocol.md:561:| Config + JSONL + strategy all exist and agree | `resume` | Continue from last iteration + 1 |
.opencode/skill/sk-deep-review/references/loop_protocol.md:563:| Partial files or contradictions | `invalid-state` | Halt for repair; do not guess |
.opencode/skill/sk-deep-review/references/loop_protocol.md:582:<!-- /ANCHOR:auto-resume-protocol -->
.opencode/skill/sk-deep-review/references/loop_protocol.md:583:<!-- ANCHOR:pause-resume -->
.opencode/skill/sk-deep-review/references/loop_protocol.md:613:- The auto-resume protocol (Section 6) detects the existing state
.opencode/skill/sk-deep-review/references/loop_protocol.md:614:- A resumed event is logged to JSONL
.opencode/skill/sk-deep-review/references/loop_protocol.md:630:<!-- /ANCHOR:pause-resume -->
.opencode/skill/sk-deep-review/references/loop_protocol.md:646:[STUCK_RECOVERY] --> change granularity / protocol replay / escalate severity
.opencode/skill/sk-deep-review/references/loop_protocol.md:654:    |-- sentinel removed --> [ITERATING] (resume)
.opencode/skill/sk-deep-review/references/loop_protocol.md:656:[SYNTHESIZING] --> finding dedup, severity reconcile, replay validate, compile report
.opencode/skill/sk-deep-research/references/loop_protocol.md:48:   - `resume`: config + state + strategy all exist and agree
.opencode/skill/sk-deep-research/references/loop_protocol.md:83:5. Append the canonical resume event to `deep-research-state.jsonl` (all fields below are required by the reducer):
.opencode/skill/sk-deep-research/references/loop_protocol.md:86:{"type":"event","event":"resumed","mode":"research","sessionId":"rsr-2026-03-18T10-00-00Z","parentSessionId":"rsr-2026-03-18T10-00-00Z","lineageMode":"resume","continuedFromRun":4,"generation":1,"timestamp":"2026-03-18T14:05:00Z"}
.opencode/skill/sk-deep-research/references/loop_protocol.md:93:The runtime supports three lineage modes today. `fork` and `completed-continue` were described in earlier drafts but have no workflow wiring in this release, so they MUST NOT be exposed to operators. If the long-form lineage feature is picked up later it will arrive with first-class event emission, reducer ancestry handling, and replay fixtures; until then treat the contract below as canonical.
.opencode/skill/sk-deep-research/references/loop_protocol.md:98:| `resume` | same | same | none | `resumed` (see example above) | operator wants to continue the current lineage boundary |
.opencode/skill/sk-deep-research/references/loop_protocol.md:99:| `restart` | fresh | `prior + 1` | prior `research/` tree moved under `research_archive/{timestamp}/` | `restarted` (same field set plus `archivedPath`) | operator wants to clear the workspace and replay with a new angle |
.opencode/skill/sk-deep-research/references/loop_protocol.md:106:  "event": "resumed | restarted",
.opencode/skill/sk-deep-research/references/loop_protocol.md:109:  "parentSessionId": "<session id of the prior lineage (equals sessionId on resume)>",
.opencode/skill/sk-deep-research/references/loop_protocol.md:110:  "lineageMode": "resume | restart",
.opencode/skill/sk-deep-research/references/loop_protocol.md:112:  "continuedFromRun": <number or null>,
.opencode/skill/sk-deep-research/references/loop_protocol.md:118:Every field in the contract MUST be present on every persisted lifecycle event. `archivedPath` is null for `resumed` and set to the archive destination for `restarted`. `continuedFromRun` is the number of completed iteration records before the lifecycle boundary. Reducer parity tests ensure the dashboard `Lifecycle` section reads exactly those fields.
.opencode/skill/sk-deep-research/references/loop_protocol.md:148:   - Persist the blocked legal-stop outcome: `{"type":"event","event":"blocked_stop","mode":"research","run":N,"blockedBy":["<gate>"],"gateResults":{"convergence":{"pass":true,"score":0.0},"keyQuestionCoverage":{"pass":false,"answered":X,"total":Y},"evidenceDensity":{"pass":false,"sources":N},"hotspotSaturation":{"pass":true}},"recoveryStrategy":"<one-line hint>","timestamp":"<ISO8601>","sessionId":"<sid>","generation":G}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:153:If the legal-stop decision tree returns `blocked`, the workflow MUST append the `blocked_stop` JSONL event before continuing. Reducers and dashboards consume the persisted event; they must not infer blocked-stop state solely from prose logs.
.opencode/skill/sk-deep-research/references/loop_protocol.md:161:   - Log event to JSONL: `{"type":"event","event":"userPaused","mode":"research","run":N,"stopReason":"userPaused","sentinelPath":"{spec_folder}/research/.deep-research-pause","timestamp":"<ISO8601>","sessionId":"<sid>","generation":G}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:164:     Research paused. Delete research/.deep-research-pause to resume.
.opencode/skill/sk-deep-research/references/loop_protocol.md:168:3. On resume (file deleted and loop restarted):
.opencode/skill/sk-deep-research/references/loop_protocol.md:169:   - Log event: `{"type":"event","event":"resumed","fromIteration":N}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:178:Generate a compact state summary (~200 tokens) for injection into the dispatch prompt:
.opencode/skill/sk-deep-research/references/loop_protocol.md:287:3. **Resume**: On auto-resume, read the ideas file alongside JSONL and strategy.md to restore full context
.opencode/skill/sk-deep-research/references/loop_protocol.md:424:The standard dispatch (Task tool) shares the parent session's token budget. In long research sessions (10+ iterations), this may cause context compression that degrades reasoning quality. Process-level isolation eliminates this risk.
.opencode/skill/sk-deep-research/references/loop_protocol.md:476:   - Add citations from iteration files
.opencode/skill/sk-deep-research/references/loop_protocol.md:485:4. **If reopening a completed packet later**: snapshot this file as `research/synthesis-v{generation}.md` before any `completed-continue` flow
.opencode/skill/sk-deep-research/references/loop_protocol.md:487:6. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","totalIterations":N,"answeredCount":A,"totalQuestions":Q,"stopReason":"converged"}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:600:1. **Classify session state**: Same as research mode (fresh, resume, completed-session, invalid-state)
.opencode/skill/sk-deep-research/references/loop_protocol.md:774:9. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":N,"verdict":"PASS|CONDITIONAL|FAIL","activeP0":N,"activeP1":N,"activeP2":N,"dimensionCoverage":X,"stopReason":"..." }`
.opencode/skill/sk-deep-research/references/convergence.md:21:#### `stopReason` enum
.opencode/skill/sk-deep-research/references/convergence.md:33:#### `legalStop` record
.opencode/skill/sk-deep-research/references/convergence.md:50:  replayInputs: {
.opencode/skill/sk-deep-research/references/convergence.md:70:- `gateResults` is the replayable legal-stop bundle. Canonical research gates are `convergenceGate`, `coverageGate`, and `qualityGate`; the `qualityGate.checks` map carries the subordinate `sourceDiversity`, `focusAlignment`, and `singleWeakSourceDominance` results.
.opencode/skill/sk-deep-research/references/convergence.md:71:- `replayInputs` snapshots the exact stop-decision inputs so the reducer and dashboards can replay the outcome from packet-local artifacts only.
.opencode/skill/sk-deep-research/references/convergence.md:77:| Legacy label or phrase | New `stopReason` | Normalization note |
.opencode/skill/sk-deep-research/references/convergence.md:80:| `novelty below threshold` | `converged` | Legacy prose alias for the rolling-average or composite stop path |
.opencode/skill/sk-deep-research/references/convergence.md:93:Deep review uses the same `stopReason` enum and `legalStop` record, even though its convergence signals differ.
.opencode/skill/sk-deep-research/references/convergence.md:113:      stopReason: "maxIterationsReached",
.opencode/skill/sk-deep-research/references/convergence.md:122:      stopReason: "converged",
.opencode/skill/sk-deep-research/references/convergence.md:135:      stopReason: "stuckRecovery",
.opencode/skill/sk-deep-research/references/convergence.md:202:        stopReason: "converged",
.opencode/skill/sk-deep-research/references/convergence.md:214:After composite convergence or full-question coverage nominates STOP, the loop MUST evaluate the full legal-stop bundle before STOP becomes final. STOP is never legal on novelty math alone. The replayable `legalStop.gateResults` bundle for deep research is:
.opencode/skill/sk-deep-research/references/convergence.md:218:| Convergence Gate | The novelty score stays below `convergenceThreshold` for N consecutive evidence iterations | Block STOP, persist `blocked_stop`, continue |
.opencode/skill/sk-deep-research/references/convergence.md:219:| Coverage Gate | Every key question has at least one evidence-backed answer | Block STOP, persist `blocked_stop`, continue |
.opencode/skill/sk-deep-research/references/convergence.md:220:| Quality Gate | Source diversity, focus alignment, and no single weak-source dominance all pass | Block STOP, persist `blocked_stop`, continue |
.opencode/skill/sk-deep-research/references/convergence.md:235:    recoveryHint: "Run another evidence iteration if novelty has not stayed low long enough"
.opencode/skill/sk-deep-research/references/convergence.md:272:  legalStop = {
.opencode/skill/sk-deep-research/references/convergence.md:275:    replayInputs: buildReplayInputs(state, stopCandidate)
.opencode/skill/sk-deep-research/references/convergence.md:281:      stopReason: "converged",
.opencode/skill/sk-deep-research/references/convergence.md:282:      candidateStopReason: stopCandidate.stopReason,
.opencode/skill/sk-deep-research/references/convergence.md:283:      legalStop
.opencode/skill/sk-deep-research/references/convergence.md:288:    stopReason: "blockedStop",
.opencode/skill/sk-deep-research/references/convergence.md:289:    candidateStopReason: stopCandidate.stopReason,
.opencode/skill/sk-deep-research/references/convergence.md:290:    legalStop,
.opencode/skill/sk-deep-research/references/convergence.md:291:    recoveryStrategy: chooseBlockedStopRecovery(legalStop, strategy)
.opencode/skill/sk-deep-research/references/convergence.md:297:- **Convergence Gate**: Re-read the most recent N evidence iterations only. Every one of them must remain below the configured novelty threshold.
.opencode/skill/sk-deep-research/references/convergence.md:300:- **Focus Alignment**: Compare current key questions against `config.originalKeyQuestions` (the snapshot of initial key questions populated at session init). Flag any answer outside the declared scope, or any significant drift where the current question set no longer resembles the original set. When `originalKeyQuestions` is absent (legacy packets), fall back to comparing against strategy.md's initialized question list.
.opencode/skill/sk-deep-research/references/convergence.md:303:`qualityGate.checks` is the replayable quality bundle. Reducers and dashboards must be able to explain a quality pass or failure from packet-local artifacts only.
.opencode/skill/sk-deep-research/references/convergence.md:307:1. Append a `stop_decision` snapshot with the attempted stop bundle.
.opencode/skill/sk-deep-research/references/convergence.md:308:2. Append a first-class `blocked_stop` event with `stopReason: "blockedStop"`, `legalStop.blockedBy`, the full `legalStop.gateResults`, and a concrete `recoveryStrategy`.
.opencode/skill/sk-deep-research/references/convergence.md:363:#### contradictionDensity (0.0-1.0)
.opencode/skill/sk-deep-research/references/convergence.md:369:| 0.0 | No contradictions in the finding set |
.opencode/skill/sk-deep-research/references/convergence.md:370:| 0.01-0.10 | Normal level of resolved contradictions |
.opencode/skill/sk-deep-research/references/convergence.md:371:| 0.11-0.25 | Elevated contradictions; may need targeted reconciliation |
.opencode/skill/sk-deep-research/references/convergence.md:372:| 0.26+ | High contradiction density; research may be stuck on conflicting sources |
.opencode/skill/sk-deep-research/references/convergence.md:384:- `contradictionDensity <= 0.10` supports STOP: the finding set is internally consistent.
.opencode/skill/sk-deep-research/references/convergence.md:385:- `contradictionDensity > 0.25` blocks STOP: unresolved contradictions suggest the research space is not yet stable. The legal-stop gate records this as a `qualityGate` sub-check failure.
.opencode/skill/sk-deep-research/references/convergence.md:386:- The stuck recovery protocol (Section 4, Step 1.5) should use "Contradictory evidence" failure mode when `contradictionDensity > 0.25`.
.opencode/skill/sk-deep-research/references/convergence.md:388:#### citationOverlap (0.0-1.0)
.opencode/skill/sk-deep-research/references/convergence.md:390:Measures how much the current iteration's citations overlap with the existing citation graph. A high overlap means the iteration consulted mostly the same sources; a low overlap means new sources were discovered.
.opencode/skill/sk-deep-research/references/convergence.md:408:- `citationOverlap >= 0.85` for 2+ consecutive iterations supports STOP: the source space is exhausted.
.opencode/skill/sk-deep-research/references/convergence.md:409:- `citationOverlap < 0.30` prevents STOP: the iteration discovered substantially new sources that may yield fresh findings.
.opencode/skill/sk-deep-research/references/convergence.md:419:   - `contradictionResolution`: `contradictionDensity <= 0.10`
.opencode/skill/sk-deep-research/references/convergence.md:420:   - `sourceExhaustion`: `citationOverlap >= 0.85` for 2+ consecutive iterations OR `citationOverlap < 0.30` does not block
.opencode/skill/sk-deep-research/references/convergence.md:422:The quality gate passes only when ALL sub-checks pass (existing + semantic). When a semantic sub-check fails, the `legalStop.gateResults.qualityGate.checks` map includes the failing semantic sub-check with its detail and recovery hint.
.opencode/skill/sk-deep-research/references/convergence.md:426:The stop-decision event (`stop_decision` and `blocked_stop` JSONL records) includes which semantic signals supported or prevented STOP:
.opencode/skill/sk-deep-research/references/convergence.md:434:    "contradictionDensity": { "value": 0.04, "supportsStop": true },
.opencode/skill/sk-deep-research/references/convergence.md:435:    "citationOverlap": { "value": 0.91, "consecutiveHigh": 2, "supportsStop": true }
.opencode/skill/sk-deep-research/references/convergence.md:457:Semantic convergence signals (`semanticNovelty`, `contradictionDensity`, `citationOverlap`) require at least 2 evidence iterations to produce meaningful values. They are omitted from legal-stop evaluation when insufficient data exists.
.opencode/skill/sk-deep-research/references/convergence.md:468:4.6. **Blocked-stop persistence** (if any legal-stop gate fails, persist `blocked_stop` with recovery strategy and continue)
.opencode/skill/sk-deep-research/references/convergence.md:631:| Contradictory evidence | Strategy shows conflicting findings on same question | "Isolate the contradiction. Find a tiebreaker source or document both positions with evidence quality" |
.opencode/skill/sk-deep-research/references/convergence.md:891:Legacy label: [optional replay-only alias such as composite_converged]
.opencode/skill/sk-deep-research/references/convergence.md:906:  contradictionDensity:   0.XX [SUPPORTS_STOP|PREVENTS_STOP]
.opencode/skill/sk-deep-research/references/convergence.md:907:  citationOverlap:        0.XX (consecutive high: N) [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
.opencode/skill/sk-deep-research/references/convergence.md:978:      stopReason: "maxIterationsReached",
.opencode/skill/sk-deep-research/references/convergence.md:993:          stopReason: "converged",
.opencode/skill/sk-deep-research/references/convergence.md:1003:      stopReason: "stuckRecovery",
.opencode/skill/sk-deep-research/references/convergence.md:1052:          stopReason: "converged",
.opencode/skill/sk-deep-research/references/convergence.md:1061:        stopReason: "blockedStop",
.opencode/skill/sk-deep-research/references/convergence.md:1113:5. Compare the replayed decision and stop reason to the recorded synthesis event.
.opencode/skill/sk-deep-research/references/convergence.md:1126:| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay:** re-run the unresolved traceability protocol directly against the conflicting artifacts |
.opencode/skill/sk-deep-research/references/convergence.md:1140:    return { strategy: "protocol_first_replay" }
.opencode/skill/sk-deep-research/references/convergence.md:1214:| CONTRADICTS | 0.8 | Consider lowering to 0.6 if contradiction edges produce false convergence signals |
.opencode/skill/sk-deep-research/references/convergence.md:1215:| CITES | 1.0 | Neutral weight is correct for citation links |
.opencode/skill/sk-deep-research/references/convergence.md:1241:The following convergence thresholds are managed by the offline loop optimizer (042.004). Changes to these fields are proposed through the optimizer's advisory-only promotion gate and reviewed by humans before adoption.
.opencode/skill/sk-deep-research/references/convergence.md:1255:- `stopReason` enum values and semantics
.opencode/skill/sk-deep-research/references/convergence.md:1256:- `legalStop` record structure
.opencode/skill/sk-deep-research/references/state_format.md:60:    "continuedFromRun": null
.opencode/skill/sk-deep-research/references/state_format.md:79:| lineage.lineageMode | string | Yes | "new" | `new`, `resume`, `restart`, `fork`, or `completed-continue` |
.opencode/skill/sk-deep-research/references/state_format.md:81:| lineage.continuedFromRun | number or null | No | null | Run number where a resumed or reopened segment continues |
.opencode/skill/sk-deep-research/references/state_format.md:130:{"type":"iteration","run":1,"status":"complete","focus":"Initial broad survey","findingsCount":5,"newInfoRatio":1.0,"keyQuestions":["What causes latency?","Where are bottlenecks?"],"answeredQuestions":["What causes latency?"],"timestamp":"2026-03-18T10:05:00Z","durationMs":45000}
.opencode/skill/sk-deep-research/references/state_format.md:144:| durationMs | number | iteration only | Iteration execution time in milliseconds |
.opencode/skill/sk-deep-research/references/state_format.md:145:| toolsUsed | string[] | No | iteration only | High-level tool names used during the iteration |
.opencode/skill/sk-deep-research/references/state_format.md:146:| sourcesQueried | string[] | No | iteration only | URLs, file paths, or memory anchors consulted during the iteration |
.opencode/skill/sk-deep-research/references/state_format.md:150:| noveltyJustification | string | No | Human-readable explanation of what newInfoRatio represents (see below) |
.opencode/skill/sk-deep-research/references/state_format.md:177:{"type":"iteration","run":3,"status":"complete","focus":"Connection pooling","findingsCount":3,"newInfoRatio":0.4,"ruledOut":[{"approach":"HTTP/3 multiplexing","reason":"No server-side support in target environment","evidence":"docs.example.com/protocols#supported"}],"keyQuestions":["What causes latency?"],"answeredQuestions":[],"timestamp":"2026-03-18T10:15:00Z","durationMs":52000}
.opencode/skill/sk-deep-research/references/state_format.md:190:The optional `noveltyJustification` field provides a human-readable breakdown of what the `newInfoRatio` represents:
.opencode/skill/sk-deep-research/references/state_format.md:193:{"type":"iteration","run":3,"status":"complete","focus":"Reconnection strategies","findingsCount":4,"newInfoRatio":0.7,"noveltyJustification":"2 new findings on reconnection backoff, 1 refinement of prior keepalive finding","keyQuestions":["How to handle reconnection?"],"answeredQuestions":[],"timestamp":"2026-03-18T10:15:00Z","durationMs":48000}
.opencode/skill/sk-deep-research/references/state_format.md:225:{"type":"iteration","run":4,"status":"complete","focus":"Reconnection strategies","findingsCount":3,"newInfoRatio":0.55,"graphEvents":[{"type":"question","id":"q-reconnect","label":"How should the client retry after a disconnect?"},{"type":"finding","id":"f-backoff","label":"Exponential backoff converges under jitter"},{"type":"edge","id":"e-answers-reconnect","relation":"ANSWERS","source":"f-backoff","target":"q-reconnect"}],"keyQuestions":["How should the client retry after a disconnect?"],"answeredQuestions":[],"timestamp":"2026-03-18T10:15:00Z","durationMs":48000}
.opencode/skill/sk-deep-research/references/state_format.md:274:| resumed | workflow | active | Resume after a prior active session (same sessionId, no archive) | mode, sessionId, parentSessionId, lineageMode, continuedFromRun, generation, archivedPath (null), timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:275:| restarted | workflow | active | Archive the prior packet and start a new generation with a fresh sessionId | mode, sessionId, parentSessionId, lineageMode, continuedFromRun, generation, archivedPath, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:279:| blocked_stop | workflow | active | Legal-stop candidate was blocked and the loop must continue | mode, run, blockedBy, gateResults, recoveryStrategy, timestamp, sessionId, generation |
.opencode/skill/sk-deep-research/references/state_format.md:280:| userPaused | workflow | active | Pause sentinel detected and normalized to the frozen stop-reason enum | mode, run, stopReason, sentinelPath, timestamp, sessionId, generation |
.opencode/skill/sk-deep-research/references/state_format.md:287:| stuckRecovery | workflow | active | Stuck recovery outcome normalized to the frozen stop-reason enum | mode, run, stopReason, fromIteration, outcome, timestamp, sessionId, generation |
.opencode/skill/sk-deep-research/references/state_format.md:291:| synthesis_complete | workflow | active | Final synthesis finished | totalIterations, answeredCount, totalQuestions, stopReason, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:307:{"type":"event","event":"graph_convergence","mode":"research","run":7,"decision":"STOP_BLOCKED","signals":{"questionCoverage":0.86,"claimVerificationRate":0.78,"contradictionDensity":0.04,"blendedScore":0.68},"blockers":[{"name":"sourceDiversity","severity":"high","detail":"Only 2 distinct corroborating sources cover the active claim cluster."}],"timestamp":"2026-04-11T11:55:00Z","sessionId":"dr-2026-04-11T12-00-00Z","generation":2}
.opencode/skill/sk-deep-research/references/state_format.md:315:| run | number | Yes | 1-indexed loop iteration whose graph convergence vote was evaluated |
.opencode/skill/sk-deep-research/references/state_format.md:318:| blockers | array | Yes | Blocking guards returned by the graph convergence tool; empty array when STOP is not blocked |
.opencode/skill/sk-deep-research/references/state_format.md:330:4. If the inline vote says STOP but the latest graph decision is `STOP_BLOCKED`, the workflow must emit `blocked_stop` and continue with the recovery strategy instead of stopping.
.opencode/skill/sk-deep-research/references/state_format.md:335:{"type":"event","event":"blocked_stop","mode":"research","run":7,"blockedBy":["keyQuestionCoverage","evidenceDensity"],"gateResults":{"convergence":{"pass":true,"score":0.72},"keyQuestionCoverage":{"pass":false,"answered":5,"total":7},"evidenceDensity":{"pass":false,"sources":2},"hotspotSaturation":{"pass":true}},"recoveryStrategy":"Collect evidence for the remaining uncovered question cluster.","timestamp":"2026-04-11T12:00:00Z","sessionId":"dr-2026-04-11T12-00-00Z","generation":2}
.opencode/skill/sk-deep-research/references/state_format.md:341:| event | string | Yes | Always `blocked_stop` |
.opencode/skill/sk-deep-research/references/state_format.md:354:{"type":"event","event":"userPaused","mode":"research","run":7,"stopReason":"userPaused","sentinelPath":"specs/042/research/.deep-research-pause","timestamp":"2026-04-11T12:05:00Z","sessionId":"dr-2026-04-11T12-00-00Z","generation":2}
.opencode/skill/sk-deep-research/references/state_format.md:363:| stopReason | string | Yes | Always `userPaused` |
.opencode/skill/sk-deep-research/references/state_format.md:372:{"type":"event","event":"stuckRecovery","mode":"research","run":7,"stopReason":"stuckRecovery","fromIteration":7,"outcome":"recovered","timestamp":"2026-04-11T12:10:00Z","sessionId":"dr-2026-04-11T12-00-00Z","generation":2}
.opencode/skill/sk-deep-research/references/state_format.md:381:| stopReason | string | Yes | Always `stuckRecovery` |
.opencode/skill/sk-deep-research/references/state_format.md:390:Raw `paused` and `stuck_recovery` labels are legacy-only aliases. The live workflow MUST rewrite them at emission time to `userPaused` and `stuckRecovery` respectively, and MUST persist the normalized `stopReason` enum value on the JSONL line.
.opencode/skill/sk-deep-research/references/state_format.md:402:| `continuedFromRun` | Last completed run reused as the continuation boundary |
.opencode/skill/sk-deep-research/references/state_format.md:472:| blockedStopHistory | array | One entry per `blocked_stop` event promoted under REQ-014. Reducer preserves append order from the JSONL and exposes `run`, `blockedBy`, `gateResults`, `recoveryStrategy`, and `timestamp` for operator replay. |
.opencode/skill/sk-deep-research/references/state_format.md:473:| graphConvergenceScore | number | Latest graph convergence blended score surfaced under REQ-013. Derived from the most recent `graph_convergence` event. |
.opencode/skill/sk-deep-research/references/state_format.md:474:| graphDecision | string or null | Latest graph convergence verdict: `CONTINUE`, `STOP_ALLOWED`, `STOP_BLOCKED`, or null when unavailable. |
.opencode/skill/sk-deep-research/references/state_format.md:475:| graphBlockers | array | Latest blocking guard bundle returned by the graph convergence tool. Empty array when no blockers were reported. |
.opencode/skill/sk-deep-research/references/state_format.md:532:**Limitations**: Reconstructed state lacks `durationMs`, exact `timestamp`, and `findingsCount`. The `status: "reconstructed"` flag distinguishes recovered records from originals. The convergence algorithm treats reconstructed records identically to complete records for signal computation.
.opencode/skill/sk-deep-research/references/state_format.md:587:When the most recent loop event is a `blocked_stop` (its timestamp is newer than the latest iteration record), the reducer may drive the `next-focus` anchor directly from that event instead of the last iteration file. In that case the anchor must surface:
.opencode/skill/sk-deep-research/references/state_format.md:624:1. [Finding with source citation]
.opencode/skill/sk-deep-research/references/state_format.md:625:2. [Finding with source citation]
.opencode/skill/sk-deep-research/references/state_format.md:658:- Mark machine-owned sections explicitly so `completed-continue` can snapshot prior synthesis before reopening
.opencode/skill/sk-deep-research/references/state_format.md:688:### Blocked-stop and graph convergence surfaces
.opencode/skill/sk-deep-research/references/state_format.md:692:- **Blocked Stops**: Renders `blockedStopHistory` as an ordered replay log. Each entry shows the blocked iteration, the vetoing gates, the recovery strategy, a brief gate-result summary, and the ISO-8601 event timestamp so operators can trace why STOP was denied under REQ-014.
.opencode/skill/sk-deep-research/references/state_format.md:792:  "durationMs": 52000,
.opencode/skill/sk-deep-research/references/state_format.md:793:  "noveltyJustification": "1 new P1 contract drift, 1 new P2 template inconsistency, 2 advisory refinements"
.opencode/skill/sk-deep-research/references/state_format.md:807:| noveltyJustification | string | No | Human-readable breakdown of what was found |
.opencode/skill/sk-deep-research/references/state_format.md:824:  "stopReason": "composite_converged",
.opencode/skill/sk-deep-research/references/state_format.md:950:| 9 | Audit Appendix | Coverage, convergence replay, and supporting audit detail |

codex
I’ve moved from inventory into mismatch hunting. The main questions now are whether the reducers actually surface the runtime-truth artifacts the Phase 001 spec says are implemented, and whether the reference docs describe the reducer’s real behavior or a broader intended design that never landed.
exec
/bin/zsh -lc 'rg -n "claim[- ]verification|ledger|journal|promotion checkpoint|coordination board|council|completed-continue|fork" .opencode/skill/sk-deep-research/scripts/reduce-state.cjs .opencode/skill/sk-deep-review/scripts/reduce-state.cjs .opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs .opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc "rg -n \"claim[- ]verification|ledger|journal|legalStop|stopReason|continuedFromRun|completed-continue|fork|snapshot|compaction|observability|token|durationMs|toolsUsed|sourcesQueried|coverage depth|hotspot|inventory|promotion checkpoint|coordination board|council\" .opencode/skill/sk-deep-research/references/state_format.md .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-review/references/state_format.md .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/skill/sk-deep-review/references/convergence.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-review/references/state_format.md:63:  "continuedFromRun": null,
.opencode/skill/sk-deep-review/references/state_format.md:114:| lineageMode | string | `"new"` | `new`, `resume`, `restart`. `fork` and `completed-continue` are deferred and not emitted by the current runtime |
.opencode/skill/sk-deep-review/references/state_format.md:116:| continuedFromRun | number \| null | `null` | Count of completed iteration records at the lifecycle boundary (set on `resume` and `restart`) |
.opencode/skill/sk-deep-review/references/state_format.md:168:{"type":"config","mode":"review","topic":"...","reviewTarget":"...","sessionId":"rvw-...","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":7,"convergenceThreshold":0.10,"createdAt":"2026-03-24T14:00:00Z","specFolder":"..."}
.opencode/skill/sk-deep-review/references/state_format.md:183:  "continuedFromRun": null,
.opencode/skill/sk-deep-review/references/state_format.md:188:  "timestamp": "2026-03-24T14:30:00Z", "durationMs": 52000
.opencode/skill/sk-deep-review/references/state_format.md:192:**Required fields:** `type`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, `durationMs`
.opencode/skill/sk-deep-review/references/state_format.md:194:**Optional fields:** `parentSessionId`, `continuedFromRun`, `findingsRefined`, `findingRefs`, `traceabilityChecks`, `coverage`, `noveltyJustification`, `ruledOut`, `focusTrack`, `scoreEstimate`, `segment`, `convergenceSignals`, `graphEvents`
.opencode/skill/sk-deep-review/references/state_format.md:221:The optional `graphEvents` array records coverage graph mutations emitted by a review iteration. The MCP coverage graph handlers (`mcp_server/handlers/coverage-graph/upsert.ts`) consume these events and persist them into `deep-loop-graph.sqlite`, where they become the source of truth for graph-assisted convergence, hotspot saturation, and blocked-stop evidence.
.opencode/skill/sk-deep-review/references/state_format.md:238:    { "type": "finding", "id": "f-001", "label": "Missing CSRF token check on session POST" },
.opencode/skill/sk-deep-review/references/state_format.md:245:  "durationMs": 51000
.opencode/skill/sk-deep-review/references/state_format.md:259:| metadata | object | No | Optional free-form metadata persisted alongside the row (e.g. `{ "hotspot_score": 2 }`) |
.opencode/skill/sk-deep-review/references/state_format.md:281:  "dimensionCoverage": 1.0, "stopReason": "composite_converged",
.opencode/skill/sk-deep-review/references/state_format.md:286:**Required:** `type`, `event`, `mode`, `totalIterations`, `verdict`, `activeP0`, `activeP1`, `activeP2`, `dimensionCoverage`, `stopReason`, `timestamp`
.opencode/skill/sk-deep-review/references/state_format.md:308:    "hotspotSaturationGate": { "pass": true }
.opencode/skill/sk-deep-review/references/state_format.md:335:    "hotspotSaturation": 0.75
.opencode/skill/sk-deep-review/references/state_format.md:363:  "stopReason": "userPaused",
.opencode/skill/sk-deep-review/references/state_format.md:376:  "stopReason": "stuckRecovery",
.opencode/skill/sk-deep-review/references/convergence.md:23:Convergence is checked **after** each iteration completes and **before** the next iteration is dispatched. The check consumes the full JSONL state history and the current dimension coverage snapshot.
.opencode/skill/sk-deep-review/references/convergence.md:44:Every terminal stop and every blocked-stop vote MUST emit the shared stop contract from REQ-001: a named `stopReason` enum plus — when STOP is vetoed — a `blocked_stop` event written to `deep-review-state.jsonl`. There is no nested `legalStop` wrapper on the persisted path; earlier drafts of this document implied one, and that drift was the source of F009 in the 042 closing audit.
.opencode/skill/sk-deep-review/references/convergence.md:46:#### stopReason Enum
.opencode/skill/sk-deep-review/references/convergence.md:48:| `stopReason` | Meaning |
.opencode/skill/sk-deep-review/references/convergence.md:78:    "hotspotSaturationGate": { "pass": true },
.opencode/skill/sk-deep-review/references/convergence.md:89:- `gateResults`: named sub-records keyed by `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, and `claimAdjudicationGate`. Each sub-record has a `pass` boolean plus gate-specific fields (score, covered/missing, activeP0, avgEvidencePerFinding, activeP0P1). The reducer reads these verbatim and does not coerce shapes.
.opencode/skill/sk-deep-review/references/convergence.md:101:5. **Legal-stop gate bundle** -- review-specific stop gates; if a stop vote fails any gate, persist `stopReason=blockedStop` and continue.
.opencode/skill/sk-deep-review/references/convergence.md:116:  return { action: "STOP", stopReason: "maxIterationsReached" }
.opencode/skill/sk-deep-review/references/convergence.md:127:      return { action: "STOP", stopReason: "converged" }
.opencode/skill/sk-deep-review/references/convergence.md:130:Triggers when all 4 dimensions (correctness, security, traceability, maintainability) are covered, no active P0/P1 remains, at least 1 stabilization pass has occurred, and the 5-gate legal-stop bundle passes. If gates fail, the loop records `stopReason=blockedStop` and continues despite full coverage.
.opencode/skill/sk-deep-review/references/convergence.md:161:The recovery entry uses `stopReason=stuckRecovery` while the loop is in recovery. If recovery later terminates the run, the terminal record keeps the same shared enum value instead of minting a review-only label.
.opencode/skill/sk-deep-review/references/convergence.md:286:The gate passes only when both the existing churn-based checks AND the semantic stability checks agree. When a semantic check fails, the `legalStop.gateResults.findingStability` detail string includes the semantic signal values.
.opencode/skill/sk-deep-review/references/convergence.md:381:| **hotspotSaturation** | Review hotspots must be revisited enough times to satisfy the saturation heuristic | Block STOP, persist `blockedStop` |
.opencode/skill/sk-deep-review/references/convergence.md:406:    hotspotSaturation: {
.opencode/skill/sk-deep-review/references/convergence.md:407:      pass: computeHotspotSaturation(state.hotspots) >= config.hotspotSaturationThreshold,
.opencode/skill/sk-deep-review/references/convergence.md:408:      detail: "Priority hotspots received enough revisits to satisfy saturation."
.opencode/skill/sk-deep-review/references/convergence.md:420:When convergence math returns STOP, invoke `buildReviewLegalStop()`. If it returns `pass: false`, persist a first-class blocked-stop decision with `stopReason=blockedStop`, populate `legalStop.blockedBy` from the failing gates, copy the full `gateResults`, snapshot the replay inputs, and attach a `recoveryStrategy` describing the next review action before overriding the decision to CONTINUE.
.opencode/skill/sk-deep-review/references/convergence.md:430:| `hotspotSaturation` | Revisit undersampled hotspots or adjacent call sites until the saturation heuristic passes. |
.opencode/skill/sk-deep-review/references/convergence.md:436:| Legacy label | New `stopReason` | Mapping note |
.opencode/skill/sk-deep-review/references/convergence.md:601:  hotspotSaturation: [PASS | FAIL]
.opencode/skill/sk-deep-review/references/convergence.md:608:legalStop:
.opencode/skill/sk-deep-review/references/convergence.md:611:  replayInputs: [snapshot of ratios, coverage, and gate inputs]
.opencode/skill/sk-deep-review/references/convergence.md:624:  "stopReason": "converged",
.opencode/skill/sk-deep-review/references/convergence.md:625:  "legalStop": {
.opencode/skill/sk-deep-review/references/convergence.md:632:      "hotspotSaturation": { "pass": true, "detail": "Priority hotspots were revisited enough times to satisfy saturation." }
.opencode/skill/sk-deep-review/references/convergence.md:639:      "hotspotCoverage": { "saturated": 3, "required": 3 },
.opencode/skill/sk-deep-review/references/convergence.md:736:- `stopReason` enum values and semantics
.opencode/skill/sk-deep-review/references/convergence.md:737:- `legalStop` record structure and gate names
.opencode/skill/sk-deep-review/references/loop_protocol.md:106:6. **Write config**: `{spec_folder}/review/deep-review-config.json` with `mode: "review"`, lineage metadata (`sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`, `releaseReadinessState`), and review-specific fields including target, target type, dimensions, protocol plan, and release-readiness state.
.opencode/skill/sk-deep-review/references/loop_protocol.md:172:If convergence math or a hard-stop candidate points to STOP, the workflow must run the review legal-stop decision tree before actually stopping. That decision tree records five review-specific gates: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate`. If any gate fails, the loop does **not** stop. Instead it emits a first-class `blocked_stop` JSONL event with:
.opencode/skill/sk-deep-review/references/loop_protocol.md:196:   - Log event to JSONL: `{"type":"event","event":"userPaused","mode":"review","stopReason":"userPaused","reason":"sentinel file detected"}`
.opencode/skill/sk-deep-review/references/loop_protocol.md:213:Generate a compact state summary (~200 tokens) for injection into the dispatch prompt:
.opencode/skill/sk-deep-review/references/loop_protocol.md:471:     "stopReason": "...",
.opencode/skill/sk-deep-review/references/loop_protocol.md:512:Enable review sessions to resume seamlessly from prior state when interrupted by context compaction, process termination, or intentional pause.
.opencode/skill/sk-deep-review/references/loop_protocol.md:524:   {"type":"event","event":"resumed","mode":"review","sessionId":"rvw-2026-03-24T10-00-00Z","parentSessionId":"rvw-2026-03-24T10-00-00Z","lineageMode":"resume","continuedFromRun":4,"generation":1,"archivedPath":null,"timestamp":"2026-03-24T14:05:00Z"}
.opencode/skill/sk-deep-review/references/loop_protocol.md:530:The runtime supports three lineage modes today. `fork` and `completed-continue` were described in earlier drafts but have no workflow wiring in this release, so they MUST NOT be exposed to operators. If the long-form lineage feature is picked up later it will arrive with first-class event emission, reducer ancestry handling, and replay fixtures; until then treat the contract below as canonical.
.opencode/skill/sk-deep-review/references/loop_protocol.md:549:  "continuedFromRun": <number or null>,
.opencode/skill/sk-deep-review/references/loop_protocol.md:555:Every field in the contract MUST be present on every persisted lifecycle event. `archivedPath` is null for `resumed` and set to the archive destination for `restarted`. `continuedFromRun` is the number of completed iteration records before the lifecycle boundary. Reducer parity tests ensure the dashboard `Lifecycle` section reads exactly those fields.
.opencode/skill/sk-deep-research/references/loop_protocol.md:86:{"type":"event","event":"resumed","mode":"research","sessionId":"rsr-2026-03-18T10-00-00Z","parentSessionId":"rsr-2026-03-18T10-00-00Z","lineageMode":"resume","continuedFromRun":4,"generation":1,"timestamp":"2026-03-18T14:05:00Z"}
.opencode/skill/sk-deep-research/references/loop_protocol.md:93:The runtime supports three lineage modes today. `fork` and `completed-continue` were described in earlier drafts but have no workflow wiring in this release, so they MUST NOT be exposed to operators. If the long-form lineage feature is picked up later it will arrive with first-class event emission, reducer ancestry handling, and replay fixtures; until then treat the contract below as canonical.
.opencode/skill/sk-deep-research/references/loop_protocol.md:112:  "continuedFromRun": <number or null>,
.opencode/skill/sk-deep-research/references/loop_protocol.md:118:Every field in the contract MUST be present on every persisted lifecycle event. `archivedPath` is null for `resumed` and set to the archive destination for `restarted`. `continuedFromRun` is the number of completed iteration records before the lifecycle boundary. Reducer parity tests ensure the dashboard `Lifecycle` section reads exactly those fields.
.opencode/skill/sk-deep-research/references/loop_protocol.md:148:   - Persist the blocked legal-stop outcome: `{"type":"event","event":"blocked_stop","mode":"research","run":N,"blockedBy":["<gate>"],"gateResults":{"convergence":{"pass":true,"score":0.0},"keyQuestionCoverage":{"pass":false,"answered":X,"total":Y},"evidenceDensity":{"pass":false,"sources":N},"hotspotSaturation":{"pass":true}},"recoveryStrategy":"<one-line hint>","timestamp":"<ISO8601>","sessionId":"<sid>","generation":G}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:161:   - Log event to JSONL: `{"type":"event","event":"userPaused","mode":"research","run":N,"stopReason":"userPaused","sentinelPath":"{spec_folder}/research/.deep-research-pause","timestamp":"<ISO8601>","sessionId":"<sid>","generation":G}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:178:Generate a compact state summary (~200 tokens) for injection into the dispatch prompt:
.opencode/skill/sk-deep-research/references/loop_protocol.md:424:The standard dispatch (Task tool) shares the parent session's token budget. In long research sessions (10+ iterations), this may cause context compression that degrades reasoning quality. Process-level isolation eliminates this risk.
.opencode/skill/sk-deep-research/references/loop_protocol.md:485:4. **If reopening a completed packet later**: snapshot this file as `research/synthesis-v{generation}.md` before any `completed-continue` flow
.opencode/skill/sk-deep-research/references/loop_protocol.md:487:6. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","totalIterations":N,"answeredCount":A,"totalQuestions":Q,"stopReason":"converged"}`
.opencode/skill/sk-deep-research/references/loop_protocol.md:774:9. **Final JSONL entry**: `{"type":"event","event":"synthesis_complete","mode":"review","totalIterations":N,"verdict":"PASS|CONDITIONAL|FAIL","activeP0":N,"activeP1":N,"activeP2":N,"dimensionCoverage":X,"stopReason":"..." }`
.opencode/skill/sk-deep-research/references/state_format.md:60:    "continuedFromRun": null
.opencode/skill/sk-deep-research/references/state_format.md:78:| lineage.parentSessionId | string or null | Yes | null | Parent lineage when restarting, forking, or reopening |
.opencode/skill/sk-deep-research/references/state_format.md:79:| lineage.lineageMode | string | Yes | "new" | `new`, `resume`, `restart`, `fork`, or `completed-continue` |
.opencode/skill/sk-deep-research/references/state_format.md:81:| lineage.continuedFromRun | number or null | No | null | Run number where a resumed or reopened segment continues |
.opencode/skill/sk-deep-research/references/state_format.md:130:{"type":"iteration","run":1,"status":"complete","focus":"Initial broad survey","findingsCount":5,"newInfoRatio":1.0,"keyQuestions":["What causes latency?","Where are bottlenecks?"],"answeredQuestions":["What causes latency?"],"timestamp":"2026-03-18T10:05:00Z","durationMs":45000}
.opencode/skill/sk-deep-research/references/state_format.md:144:| durationMs | number | iteration only | Iteration execution time in milliseconds |
.opencode/skill/sk-deep-research/references/state_format.md:145:| toolsUsed | string[] | No | iteration only | High-level tool names used during the iteration |
.opencode/skill/sk-deep-research/references/state_format.md:146:| sourcesQueried | string[] | No | iteration only | URLs, file paths, or memory anchors consulted during the iteration |
.opencode/skill/sk-deep-research/references/state_format.md:177:{"type":"iteration","run":3,"status":"complete","focus":"Connection pooling","findingsCount":3,"newInfoRatio":0.4,"ruledOut":[{"approach":"HTTP/3 multiplexing","reason":"No server-side support in target environment","evidence":"docs.example.com/protocols#supported"}],"keyQuestions":["What causes latency?"],"answeredQuestions":[],"timestamp":"2026-03-18T10:15:00Z","durationMs":52000}
.opencode/skill/sk-deep-research/references/state_format.md:193:{"type":"iteration","run":3,"status":"complete","focus":"Reconnection strategies","findingsCount":4,"newInfoRatio":0.7,"noveltyJustification":"2 new findings on reconnection backoff, 1 refinement of prior keepalive finding","keyQuestions":["How to handle reconnection?"],"answeredQuestions":[],"timestamp":"2026-03-18T10:15:00Z","durationMs":48000}
.opencode/skill/sk-deep-research/references/state_format.md:225:{"type":"iteration","run":4,"status":"complete","focus":"Reconnection strategies","findingsCount":3,"newInfoRatio":0.55,"graphEvents":[{"type":"question","id":"q-reconnect","label":"How should the client retry after a disconnect?"},{"type":"finding","id":"f-backoff","label":"Exponential backoff converges under jitter"},{"type":"edge","id":"e-answers-reconnect","relation":"ANSWERS","source":"f-backoff","target":"q-reconnect"}],"keyQuestions":["How should the client retry after a disconnect?"],"answeredQuestions":[],"timestamp":"2026-03-18T10:15:00Z","durationMs":48000}
.opencode/skill/sk-deep-research/references/state_format.md:274:| resumed | workflow | active | Resume after a prior active session (same sessionId, no archive) | mode, sessionId, parentSessionId, lineageMode, continuedFromRun, generation, archivedPath (null), timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:275:| restarted | workflow | active | Archive the prior packet and start a new generation with a fresh sessionId | mode, sessionId, parentSessionId, lineageMode, continuedFromRun, generation, archivedPath, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:276:| forked | workflow | deferred | Reserved for a future lineage feature; not emitted by the current runtime | — |
.opencode/skill/sk-deep-research/references/state_format.md:280:| userPaused | workflow | active | Pause sentinel detected and normalized to the frozen stop-reason enum | mode, run, stopReason, sentinelPath, timestamp, sessionId, generation |
.opencode/skill/sk-deep-research/references/state_format.md:287:| stuckRecovery | workflow | active | Stuck recovery outcome normalized to the frozen stop-reason enum | mode, run, stopReason, fromIteration, outcome, timestamp, sessionId, generation |
.opencode/skill/sk-deep-research/references/state_format.md:291:| synthesis_complete | workflow | active | Final synthesis finished | totalIterations, answeredCount, totalQuestions, stopReason, timestamp |
.opencode/skill/sk-deep-research/references/state_format.md:335:{"type":"event","event":"blocked_stop","mode":"research","run":7,"blockedBy":["keyQuestionCoverage","evidenceDensity"],"gateResults":{"convergence":{"pass":true,"score":0.72},"keyQuestionCoverage":{"pass":false,"answered":5,"total":7},"evidenceDensity":{"pass":false,"sources":2},"hotspotSaturation":{"pass":true}},"recoveryStrategy":"Collect evidence for the remaining uncovered question cluster.","timestamp":"2026-04-11T12:00:00Z","sessionId":"dr-2026-04-11T12-00-00Z","generation":2}
.opencode/skill/sk-deep-research/references/state_format.md:345:| gateResults | object | Yes | Replayable gate bundle with `convergence`, `keyQuestionCoverage`, `evidenceDensity`, and `hotspotSaturation` results |
.opencode/skill/sk-deep-research/references/state_format.md:354:{"type":"event","event":"userPaused","mode":"research","run":7,"stopReason":"userPaused","sentinelPath":"specs/042/research/.deep-research-pause","timestamp":"2026-04-11T12:05:00Z","sessionId":"dr-2026-04-11T12-00-00Z","generation":2}
.opencode/skill/sk-deep-research/references/state_format.md:363:| stopReason | string | Yes | Always `userPaused` |
.opencode/skill/sk-deep-research/references/state_format.md:372:{"type":"event","event":"stuckRecovery","mode":"research","run":7,"stopReason":"stuckRecovery","fromIteration":7,"outcome":"recovered","timestamp":"2026-04-11T12:10:00Z","sessionId":"dr-2026-04-11T12-00-00Z","generation":2}
.opencode/skill/sk-deep-research/references/state_format.md:381:| stopReason | string | Yes | Always `stuckRecovery` |
.opencode/skill/sk-deep-research/references/state_format.md:390:Raw `paused` and `stuck_recovery` labels are legacy-only aliases. The live workflow MUST rewrite them at emission time to `userPaused` and `stuckRecovery` respectively, and MUST persist the normalized `stopReason` enum value on the JSONL line.
.opencode/skill/sk-deep-research/references/state_format.md:402:| `continuedFromRun` | Last completed run reused as the continuation boundary |
.opencode/skill/sk-deep-research/references/state_format.md:438:        "hotspotSaturation": { "pass": true }
.opencode/skill/sk-deep-research/references/state_format.md:532:**Limitations**: Reconstructed state lacks `durationMs`, exact `timestamp`, and `findingsCount`. The `status: "reconstructed"` flag distinguishes recovered records from originals. The convergence algorithm treats reconstructed records identically to complete records for signal computation.
.opencode/skill/sk-deep-research/references/state_format.md:658:- Mark machine-owned sections explicitly so `completed-continue` can snapshot prior synthesis before reopening
.opencode/skill/sk-deep-research/references/state_format.md:792:  "durationMs": 52000,
.opencode/skill/sk-deep-research/references/state_format.md:824:  "stopReason": "composite_converged",
.opencode/skill/sk-deep-research/references/convergence.md:21:#### `stopReason` enum
.opencode/skill/sk-deep-research/references/convergence.md:33:#### `legalStop` record
.opencode/skill/sk-deep-research/references/convergence.md:71:- `replayInputs` snapshots the exact stop-decision inputs so the reducer and dashboards can replay the outcome from packet-local artifacts only.
.opencode/skill/sk-deep-research/references/convergence.md:77:| Legacy label or phrase | New `stopReason` | Normalization note |
.opencode/skill/sk-deep-research/references/convergence.md:93:Deep review uses the same `stopReason` enum and `legalStop` record, even though its convergence signals differ.
.opencode/skill/sk-deep-research/references/convergence.md:113:      stopReason: "maxIterationsReached",
.opencode/skill/sk-deep-research/references/convergence.md:122:      stopReason: "converged",
.opencode/skill/sk-deep-research/references/convergence.md:135:      stopReason: "stuckRecovery",
.opencode/skill/sk-deep-research/references/convergence.md:202:        stopReason: "converged",
.opencode/skill/sk-deep-research/references/convergence.md:214:After composite convergence or full-question coverage nominates STOP, the loop MUST evaluate the full legal-stop bundle before STOP becomes final. STOP is never legal on novelty math alone. The replayable `legalStop.gateResults` bundle for deep research is:
.opencode/skill/sk-deep-research/references/convergence.md:272:  legalStop = {
.opencode/skill/sk-deep-research/references/convergence.md:281:      stopReason: "converged",
.opencode/skill/sk-deep-research/references/convergence.md:282:      candidateStopReason: stopCandidate.stopReason,
.opencode/skill/sk-deep-research/references/convergence.md:283:      legalStop
.opencode/skill/sk-deep-research/references/convergence.md:288:    stopReason: "blockedStop",
.opencode/skill/sk-deep-research/references/convergence.md:289:    candidateStopReason: stopCandidate.stopReason,
.opencode/skill/sk-deep-research/references/convergence.md:290:    legalStop,
.opencode/skill/sk-deep-research/references/convergence.md:291:    recoveryStrategy: chooseBlockedStopRecovery(legalStop, strategy)
.opencode/skill/sk-deep-research/references/convergence.md:300:- **Focus Alignment**: Compare current key questions against `config.originalKeyQuestions` (the snapshot of initial key questions populated at session init). Flag any answer outside the declared scope, or any significant drift where the current question set no longer resembles the original set. When `originalKeyQuestions` is absent (legacy packets), fall back to comparing against strategy.md's initialized question list.
.opencode/skill/sk-deep-research/references/convergence.md:307:1. Append a `stop_decision` snapshot with the attempted stop bundle.
.opencode/skill/sk-deep-research/references/convergence.md:308:2. Append a first-class `blocked_stop` event with `stopReason: "blockedStop"`, `legalStop.blockedBy`, the full `legalStop.gateResults`, and a concrete `recoveryStrategy`.
.opencode/skill/sk-deep-research/references/convergence.md:422:The quality gate passes only when ALL sub-checks pass (existing + semantic). When a semantic sub-check fails, the `legalStop.gateResults.qualityGate.checks` map includes the failing semantic sub-check with its detail and recovery hint.
.opencode/skill/sk-deep-research/references/convergence.md:978:      stopReason: "maxIterationsReached",
.opencode/skill/sk-deep-research/references/convergence.md:993:          stopReason: "converged",
.opencode/skill/sk-deep-research/references/convergence.md:1003:      stopReason: "stuckRecovery",
.opencode/skill/sk-deep-research/references/convergence.md:1052:          stopReason: "converged",
.opencode/skill/sk-deep-research/references/convergence.md:1061:        stopReason: "blockedStop",
.opencode/skill/sk-deep-research/references/convergence.md:1255:- `stopReason` enum values and semantics
.opencode/skill/sk-deep-research/references/convergence.md:1256:- `legalStop` record structure

exec
/bin/zsh -lc 'ls .opencode/skill/sk-deep-research/assets .opencode/skill/sk-deep-review/assets' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-research/assets:
deep_research_config.json
deep_research_dashboard.md
deep_research_strategy.md
runtime_capabilities.json

.opencode/skill/sk-deep-review/assets:
deep_review_config.json
deep_review_dashboard.md
deep_review_strategy.md
review_mode_contract.yaml
runtime_capabilities.json

exec
/bin/zsh -lc 'rg -n "runtime-capabilities|runtime capabilities|runtime_capabilities|capability matrix|capability resolver" .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/plan.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/tasks.md .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/checklist.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc 'rg -n "latestJSONLDelta|priorReducedState|newIterationFile|delta replay|snapshot|compaction|prior reduced state|replay only the newest JSONL delta" .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-review/references/loop_protocol.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-research/references/loop_protocol.md:226:3. Run reducer with `{ latestJSONLDelta, newIterationFile, priorReducedState }`
.opencode/skill/sk-deep-research/references/loop_protocol.md:485:4. **If reopening a completed packet later**: snapshot this file as `research/synthesis-v{generation}.md` before any `completed-continue` flow
.opencode/skill/sk-deep-review/references/loop_protocol.md:154:| Inputs | `latestJSONLDelta`, `newIterationFile`, `priorReducedState` | The reducer replays only the newest JSONL delta plus the latest iteration artifact against the prior reduced state. |
.opencode/skill/sk-deep-review/references/loop_protocol.md:512:Enable review sessions to resume seamlessly from prior state when interrupted by context compaction, process termination, or intentional pause.

exec
/bin/zsh -lc 'rg -n "durationMs|toolsUsed|sourcesQueried|wall-clock|token|state diff|anomaly|histogram|coverage depth|coverageDepth|hotspot ranking|inventory pass|stratified coverage" .opencode/skill/sk-deep-research/scripts/reduce-state.cjs .opencode/skill/sk-deep-review/scripts/reduce-state.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "claim[- ]verification|verification ledger|promotion checkpoint|runtime inventory|audit journal|journal" .opencode/skill/sk-deep-research/references/state_format.md .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/references/convergence.md .opencode/skill/sk-deep-review/references/state_format.md .opencode/skill/sk-deep-review/references/loop_protocol.md .opencode/skill/sk-deep-review/references/convergence.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:175:    iterationRecords.flatMap((record) => (Array.isArray(record.sourcesQueried) ? record.sourcesQueried : [])),

 exited 1 in 0ms:
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/loop_protocol.md | sed -n '220,232p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/loop_protocol.md | sed -n '80,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   220	- Budget limits are soft caps — if the agent is actively writing its iteration file when the limit is reached, allow completion
   221	
   222	#### Step 4: Evaluate Results
   223	After agent completes:
   224	1. Verify `{spec_folder}/research/iterations/iteration-{NNN}.md` was created
   225	2. Verify JSONL was appended with iteration record
   226	3. Run reducer with `{ latestJSONLDelta, newIterationFile, priorReducedState }`
   227	4. Verify reducer refreshed `deep-research-strategy.md`, `findings-registry.json`, and `deep-research-dashboard.md`
   228	5. Verify the refreshed packet surfaces reflect the new iteration evidence
   229	6. Extract `newInfoRatio` from JSONL record
   230	7. Track stuck count: skip if `status == "thought"` (no change), reset to 0 if `status == "insight"` (breakthrough counts as progress), increment if `newInfoRatio < config.convergenceThreshold`, reset otherwise
   231	
   232	#### Step 4a: Generate Dashboard

 succeeded in 0ms:
    80	2. Read JSONL, count iteration records
    81	3. Read strategy.md for current state
    82	4. Set iteration counter to last completed + 1
    83	5. Append the canonical resume event to `deep-research-state.jsonl` (all fields below are required by the reducer):
    84	
    85	```json
    86	{"type":"event","event":"resumed","mode":"research","sessionId":"rsr-2026-03-18T10-00-00Z","parentSessionId":"rsr-2026-03-18T10-00-00Z","lineageMode":"resume","continuedFromRun":4,"generation":1,"timestamp":"2026-03-18T14:05:00Z"}
    87	```
    88	
    89	6. Continue loop from `step_read_state`.
    90	
    91	### Lifecycle Branch Contract (current release)
    92	
    93	The runtime supports three lineage modes today. `fork` and `completed-continue` were described in earlier drafts but have no workflow wiring in this release, so they MUST NOT be exposed to operators. If the long-form lineage feature is picked up later it will arrive with first-class event emission, reducer ancestry handling, and replay fixtures; until then treat the contract below as canonical.
    94	
    95	| Mode | Session id | Generation | Archive | JSONL event | When to pick |
    96	|------|-----------|-----------|---------|-------------|--------------|
    97	| `new` | fresh | 1 | n/a | implicit (config record) | no existing state |
    98	| `resume` | same | same | none | `resumed` (see example above) | operator wants to continue the current lineage boundary |
    99	| `restart` | fresh | `prior + 1` | prior `research/` tree moved under `research_archive/{timestamp}/` | `restarted` (same field set plus `archivedPath`) | operator wants to clear the workspace and replay with a new angle |
   100	
   101	**Contract for every persisted lifecycle event**:
   102	
   103	```json
   104	{
   105	  "type": "event",
   106	  "event": "resumed | restarted",
   107	  "mode": "research",
   108	  "sessionId": "<session id of the new or continuing lineage>",
   109	  "parentSessionId": "<session id of the prior lineage (equals sessionId on resume)>",
   110	  "lineageMode": "resume | restart",
   111	  "generation": <number>,
   112	  "continuedFromRun": <number or null>,
   113	  "archivedPath": "<path or null>",
   114	  "timestamp": "<ISO 8601>"
   115	}
   116	```
   117	
   118	Every field in the contract MUST be present on every persisted lifecycle event. `archivedPath` is null for `resumed` and set to the archive destination for `restarted`. `continuedFromRun` is the number of completed iteration records before the lifecycle boundary. Reducer parity tests ensure the dashboard `Lifecycle` section reads exactly those fields.
   119	
   120	---

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/loop_protocol.md | sed -n '522,556p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/loop_protocol.md | sed -n '150,176p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   522	5. **Log resume**: Append the canonical resume event to `deep-review-state.jsonl`. The reducer requires every field below:
   523	   ```json
   524	   {"type":"event","event":"resumed","mode":"review","sessionId":"rvw-2026-03-24T10-00-00Z","parentSessionId":"rvw-2026-03-24T10-00-00Z","lineageMode":"resume","continuedFromRun":4,"generation":1,"archivedPath":null,"timestamp":"2026-03-24T14:05:00Z"}
   525	   ```
   526	6. **Continue**: Enter the iteration loop from step_read_state
   527	
   528	### Lifecycle Branches (current release)
   529	
   530	The runtime supports three lineage modes today. `fork` and `completed-continue` were described in earlier drafts but have no workflow wiring in this release, so they MUST NOT be exposed to operators. If the long-form lineage feature is picked up later it will arrive with first-class event emission, reducer ancestry handling, and replay fixtures; until then treat the contract below as canonical.
   531	
   532	| Mode | Session id | Generation | Archive | JSONL event | When to pick |
   533	|------|-----------|-----------|---------|-------------|--------------|
   534	| `new` | fresh | 1 | n/a | implicit (config record) | no existing state |
   535	| `resume` | same | same | none | `resumed` (see example above) | operator wants to continue the current lineage boundary |
   536	| `restart` | fresh | `prior + 1` | prior `review/` tree moved under `review_archive/{timestamp}/` | `restarted` (same field set plus non-null `archivedPath`) | operator wants to clear the workspace and replay with a new angle |
   537	
   538	**Contract for every persisted lifecycle event**:
   539	
   540	```json
   541	{
   542	  "type": "event",
   543	  "event": "resumed | restarted",
   544	  "mode": "review",
   545	  "sessionId": "<session id of the new or continuing lineage>",
   546	  "parentSessionId": "<session id of the prior lineage (equals sessionId on resume)>",
   547	  "lineageMode": "resume | restart",
   548	  "generation": <number>,
   549	  "continuedFromRun": <number or null>,
   550	  "archivedPath": "<path or null>",
   551	  "timestamp": "<ISO 8601>"
   552	}
   553	```
   554	
   555	Every field in the contract MUST be present on every persisted lifecycle event. `archivedPath` is null for `resumed` and set to the archive destination for `restarted`. `continuedFromRun` is the number of completed iteration records before the lifecycle boundary. Reducer parity tests ensure the dashboard `Lifecycle` section reads exactly those fields.
   556	

 succeeded in 0ms:
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
   171	
   172	If convergence math or a hard-stop candidate points to STOP, the workflow must run the review legal-stop decision tree before actually stopping. That decision tree records five review-specific gates: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, and `hotspotSaturationGate`. If any gate fails, the loop does **not** stop. Instead it emits a first-class `blocked_stop` JSONL event with:
   173	
   174	- `blockedBy`: array of the failed review gate names
   175	- `gateResults`: per-gate pass/fail payloads using the review gate names above
   176	- `recoveryStrategy`: one-line hint describing the next review action

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/state_format.md | sed -n '108,118p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/state_format.md | sed -n '70,86p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   108	| mode | `"review"` | -- | Session mode discriminator (required) |
   109	| reviewTarget | string | -- | Path or identifier of the review target |
   110	| reviewTargetType | string | `"spec-folder"` | `spec-folder`, `skill`, `agent`, `track`, `files` |
   111	| reviewDimensions | string[] | all 4 | Dimensions to evaluate |
   112	| sessionId | string | -- | Stable identifier for the current review lineage |
   113	| parentSessionId | string \| null | `null` | Parent lineage reference for restart flows |
   114	| lineageMode | string | `"new"` | `new`, `resume`, `restart`. `fork` and `completed-continue` are deferred and not emitted by the current runtime |
   115	| generation | number | 1 | Lineage generation number — incremented on `restart`, unchanged on `resume` |
   116	| continuedFromRun | number \| null | `null` | Count of completed iteration records at the lifecycle boundary (set on `resume` and `restart`) |
   117	| maxIterations | number | 7 | Hard cap on loop iterations |
   118	| convergenceThreshold | number | 0.10 | Stop when severity-weighted new findings ratio below this |

 succeeded in 0ms:
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
    82	| originalKeyQuestions | string[] | No | -- | Snapshot of the initial key questions at session init, used by the focus-alignment guard to detect drift |
    83	| fileProtection | object | No | -- | Mutability declarations for state files (see below) |
    84	
    85	### File Protection Map
    86	

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/state_format.md | sed -n '530,550p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/state_format.md | sed -n '468,476p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   468	Research-specific registry fields:
   469	
   470	| Field | Type | Description |
   471	|-------|------|-------------|
   472	| blockedStopHistory | array | One entry per `blocked_stop` event promoted under REQ-014. Reducer preserves append order from the JSONL and exposes `run`, `blockedBy`, `gateResults`, `recoveryStrategy`, and `timestamp` for operator replay. |
   473	| graphConvergenceScore | number | Latest graph convergence blended score surfaced under REQ-013. Derived from the most recent `graph_convergence` event. |
   474	| graphDecision | string or null | Latest graph convergence verdict: `CONTINUE`, `STOP_ALLOWED`, `STOP_BLOCKED`, or null when unavailable. |
   475	| graphBlockers | array | Latest blocking guard bundle returned by the graph convergence tool. Empty array when no blockers were reported. |
   476	

 succeeded in 0ms:
   530	
   531	| Field | Type | Description |
   532	|-------|------|-------------|
   533	| `blockedStopHistory` | array | One entry per `blocked_stop` JSONL event: `{run, blockedBy, gateResults, recoveryStrategy, timestamp}`. Rendered in the dashboard `BLOCKED STOPS` section and can drive the strategy `next-focus` anchor when blocked-stop is the most recent loop event. |
   534	| `persistentSameSeverity` | array | Findings observed in ≥2 iterations with NO severity transitions beyond initial discovery. REQ-018 split of the deprecated `repeatedFindings` bucket. |
   535	| `severityChanged` | array | Findings that went through at least one severity transition (P0↔P1↔P2) in their `transitions` history. |
   536	| `repeatedFindings` | array | **Deprecated.** Union of `persistentSameSeverity` and `severityChanged`. Retained for backward compatibility; new code should read the split arrays. |
   537	| `corruptionWarnings` | array | Per-line corruption reports from `parseJsonlDetailed()`: `{line, raw, error}`. Non-empty means the reducer detected malformed JSONL. |
   538	
   539	### Default Values
   540	
   541	When no `graph_convergence` event has been recorded yet, defaults are `graphConvergenceScore: 0`, `graphDecision: null`, and `graphBlockers: []`.
   542	When no `blocked_stop` event has been recorded yet, `blockedStopHistory: []`.
   543	When JSONL parses cleanly, `corruptionWarnings: []`.
   544	
   545	### Fail-Closed Semantics (REQ-015, REQ-016)
   546	
   547	- **Malformed JSONL**: The reducer CLI exits with code `2` and writes a warning to stderr when `corruptionWarnings.length > 0`. Pass `--lenient` (or `lenient:true` to `reduceReviewState`) to escape-hatch out and preserve the v1.2.0.0 fail-open behavior for legacy packets.
   548	- **Missing machine-owned anchors**: `replaceAnchorSection()` throws `Error('Missing machine-owned anchor "<id>" in deep-review strategy file.')` when the strategy file is present but lacks one of the required anchors. Pass `--create-missing-anchors` (or `createMissingAnchors:true`) to bootstrap empty strategy files by appending the missing anchor blocks.
   549	- **Dashboard surfaces**: `CORRUPTION WARNINGS` section lists detected lines; `BLOCKED STOPS` section lists `blockedStopHistory` entries; `GRAPH CONVERGENCE` section reports `graphConvergenceScore` / `graphDecision` / `graphBlockers`.
   550	- **Strategy next-focus override**: When the latest `blocked_stop` event timestamp is newer than the latest iteration timestamp, the reducer rewrites the strategy `next-focus` anchor to surface the blocking gates and recovery hint so operators see the blocker before choosing the next iteration direction.

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/convergence.md | sed -n '40,92p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    40	| `compositeStopScore` | 0.60 | Weighted stop-score needed before guard evaluation |
    41	
    42	### Shared Stop Contract
    43	
    44	Every terminal stop and every blocked-stop vote MUST emit the shared stop contract from REQ-001: a named `stopReason` enum plus — when STOP is vetoed — a `blocked_stop` event written to `deep-review-state.jsonl`. There is no nested `legalStop` wrapper on the persisted path; earlier drafts of this document implied one, and that drift was the source of F009 in the 042 closing audit.
    45	
    46	#### stopReason Enum
    47	
    48	| `stopReason` | Meaning |
    49	|--------------|---------|
    50	| `converged` | All convergence signals met and legal-stop gates passed. |
    51	| `maxIterationsReached` | Iteration limit hit before convergence. |
    52	| `userPaused` | User requested pause via sentinel. |
    53	| `blockedStop` | Convergence math voted stop but legal-stop gates failed. |
    54	| `stuckRecovery` | Stuck detection triggered recovery. |
    55	| `error` | Unrecoverable error during iteration or reducer flow. |
    56	| `manualStop` | Operator explicitly halted outside the pause sentinel path. |
    57	
    58	#### blocked_stop Event (canonical, persisted)
    59	
    60	`step_emit_blocked_stop` in both `spec_kit_deep-review_{auto,confirm}.yaml` appends the following record to `deep-review-state.jsonl` whenever the legal-stop decision tree vetoes STOP. The gate names and their shapes are load-bearing — the reducer reads them verbatim:
    61	
    62	```json
    63	{
    64	  "type": "event",
    65	  "event": "blocked_stop",
    66	  "mode": "review",
    67	  "run": 5,
    68	  "blockedBy": ["dimensionCoverageGate", "p0ResolutionGate"],
    69	  "gateResults": {
    70	    "convergenceGate": { "pass": true, "score": 0.72 },
    71	    "dimensionCoverageGate": {
    72	      "pass": false,
    73	      "covered": ["correctness", "security", "traceability"],
    74	      "missing": ["maintainability"]
    75	    },
    76	    "p0ResolutionGate": { "pass": false, "activeP0": 1 },
    77	    "evidenceDensityGate": { "pass": true, "avgEvidencePerFinding": 1.6 },
    78	    "hotspotSaturationGate": { "pass": true },
    79	    "claimAdjudicationGate": { "pass": true, "activeP0P1": 2 }
    80	  },
    81	  "recoveryStrategy": "Dispatch the next iteration at the maintainability dimension and re-check after resolving the remaining P0.",
    82	  "timestamp": "2026-03-24T15:02:00Z",
    83	  "sessionId": "rvw-2026-03-24T10-00-00Z",
    84	  "generation": 1
    85	}
    86	```
    87	
    88	- `blockedBy`: array of gate names that failed (string[] — never structured objects). Empty when STOP is legal, in which case no `blocked_stop` event is emitted.
    89	- `gateResults`: named sub-records keyed by `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, and `claimAdjudicationGate`. Each sub-record has a `pass` boolean plus gate-specific fields (score, covered/missing, activeP0, avgEvidencePerFinding, activeP0P1). The reducer reads these verbatim and does not coerce shapes.
    90	- `recoveryStrategy`: human-readable one-liner describing what the next iteration should do before another stop attempt.
    91	- When the graph convergence verdict is `STOP_BLOCKED`, the same event is emitted with `blocked_gate == "graph_blockers"` folded into `blockedBy` and the structured blocker objects preserved under `graph_blocker_detail_json` (see phase 008 P1-02 closure in the auto YAML).
    92	

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/convergence.md | sed -n '420,440p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   420	When convergence math returns STOP, invoke `buildReviewLegalStop()`. If it returns `pass: false`, persist a first-class blocked-stop decision with `stopReason=blockedStop`, populate `legalStop.blockedBy` from the failing gates, copy the full `gateResults`, snapshot the replay inputs, and attach a `recoveryStrategy` describing the next review action before overriding the decision to CONTINUE.
   421	
   422	### Blocked-Stop Recovery Strategy
   423	
   424	| Failed Gate | Recovery Strategy |
   425	|-------------|-------------------|
   426	| `findingStability` | Revisit the noisiest recent dimension and reduce novelty by closing obvious follow-up loops before re-checking STOP. |
   427	| `dimensionCoverage` | Schedule the next uncovered review dimension immediately. |
   428	| `p0Resolution` | Re-open the active blocker path and verify whether the P0 is real, downgraded, or still unresolved. |
   429	| `evidenceDensity` | Re-read weakly supported findings and add concrete `file:line` citations before they count toward a stop decision. |
   430	| `hotspotSaturation` | Revisit undersampled hotspots or adjacent call sites until the saturation heuristic passes. |
   431	
   432	### Legacy Stop-Reason Mapping
   433	
   434	Use this table when replaying old packets or translating older prose/docs into the shared stop contract.
   435	
   436	| Legacy label | New `stopReason` | Mapping note |
   437	|--------------|------------------|--------------|
   438	| `all_dimensions_clean` | `converged` | Legacy review-specific terminal label; now expressed by the shared enum. |
   439	| `composite_converged` | `converged` | Legacy convergence-math wording now rolls into shared terminal success. |
   440	| `all dimensions clean` | `converged` | Old operator-facing prose for the same successful stop. |

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/convergence.md | sed -n '608,640p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   608	legalStop:
   609	  blockedBy: [gate names]
   610	  gateResults: [pass/fail map with detail]
   611	  replayInputs: [snapshot of ratios, coverage, and gate inputs]
   612	
   613	Blocked-stop recovery strategy: [what the next iteration must do before STOP can be retried]
   614	
   615	Stuck recovery attempts: N (recovered: N, failed: N)
   616	```
   617	
   618	### JSONL Synthesis Event
   619	
   620	```json
   621	{
   622	  "type": "event",
   623	  "event": "synthesis",
   624	  "stopReason": "converged",
   625	  "legalStop": {
   626	    "blockedBy": [],
   627	    "gateResults": {
   628	      "findingStability": { "pass": true, "detail": "Rolling average, MAD noise floor, and novelty ratio all voted STOP." },
   629	      "dimensionCoverage": { "pass": true, "detail": "All configured review dimensions were examined, required traceability coverage passed, and stabilization aged enough to stop." },
   630	      "p0Resolution": { "pass": true, "detail": "No unresolved P0 findings remained." },
   631	      "evidenceDensity": { "pass": true, "detail": "Evidence density stayed above the configured threshold." },
   632	      "hotspotSaturation": { "pass": true, "detail": "Priority hotspots were revisited enough times to satisfy saturation." }
   633	    },
   634	    "replayInputs": {
   635	      "iterationCount": 5,
   636	      "newFindingsRatio": 0.04,
   637	      "noveltyRatio": 0.03,
   638	      "dimensionsExamined": ["correctness", "security", "traceability", "maintainability"],
   639	      "hotspotCoverage": { "saturated": 3, "required": 3 },
   640	      "stopScore": 0.70

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/convergence.md | sed -n '20,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    20	
    21	#### `stopReason` enum
    22	
    23	| Value | When It Is Used |
    24	|-------|-----------------|
    25	| `converged` | The legal-stop bundle passed and the loop may exit normally |
    26	| `maxIterationsReached` | The loop hit its configured iteration cap before legal convergence |
    27	| `userPaused` | A user-facing pause sentinel or equivalent user pause request halted execution |
    28	| `blockedStop` | Convergence or coverage wanted to stop, but one or more legal-stop gates failed |
    29	| `stuckRecovery` | Stuck detection triggered recovery, or recovery became the terminal outcome |
    30	| `error` | An unrecoverable runtime or iteration error terminated the loop |
    31	| `manualStop` | An operator explicitly halted the loop outside automatic convergence |
    32	
    33	#### `legalStop` record
    34	
    35	```ts
    36	type GateResult = {
    37	  pass: boolean;
    38	  detail: string;
    39	  checks?: Record<string, GateResult>;
    40	  recoveryHint?: string;
    41	};
    42	
    43	type LegalStop = {
    44	  blockedBy: string[];
    45	  gateResults: {
    46	    convergenceGate: GateResult;
    47	    coverageGate: GateResult;
    48	    qualityGate: GateResult;
    49	  };
    50	  replayInputs: {
    51	    iterationCount: number;
    52	    answeredCount: number;
    53	    totalQuestions: number;
    54	    weightedStopScore?: number;
    55	    activeSignals?: Array<{ name: string; value: number; stop: boolean; weight: number }>;
    56	    stuckCount?: number;
    57	    source:
    58	      | "question_coverage"
    59	      | "composite_convergence"
    60	      | "iteration_cap"
    61	      | "pause_sentinel"
    62	      | "recovery"
    63	      | "error"
    64	      | "manual_override";
    65	  };
    66	}
    67	```
    68	
    69	- `blockedBy` lists the gate names that prevented a legal STOP. Use an empty array when STOP is legal.
    70	- `gateResults` is the replayable legal-stop bundle. Canonical research gates are `convergenceGate`, `coverageGate`, and `qualityGate`; the `qualityGate.checks` map carries the subordinate `sourceDiversity`, `focusAlignment`, and `singleWeakSourceDominance` results.
    71	- `replayInputs` snapshots the exact stop-decision inputs so the reducer and dashboards can replay the outcome from packet-local artifacts only.
    72	
    73	#### Legacy Stop-Reason Mapping
    74	
    75	Normalize older labels into the shared contract instead of persisting them directly:
    76	
    77	| Legacy label or phrase | New `stopReason` | Normalization note |
    78	|------------------------|------------------|--------------------|
    79	| `composite_converged` | `converged` | Weighted convergence vote passed and legal-stop gates passed |
    80	| `novelty below threshold` | `converged` | Legacy prose alias for the rolling-average or composite stop path |

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-research/references/state_format.md | sed -n '680,708p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   680	|---------|--------|-------------|
   681	| Iteration Table | JSONL iteration records | Run, status, focus, newInfoRatio, findings count, duration |
   682	| Question Status | Strategy + registry | Each key question with answered/open status and coverage % |
   683	| Convergence Trend | JSONL convergenceSignals + reducer | Rolling average, composite stop score, trajectory |
   684	| Dead Ends | JSONL ruledOut + strategy | Accumulated ruled-out approaches with reasons |
   685	| Next Focus | Strategy file | Current recommended direction for next iteration |
   686	| Source Diversity | Registry metrics | Source count per question and `coverageBySources` summary |
   687	
   688	### Blocked-stop and graph convergence surfaces
   689	
   690	The reducer-owned dashboard adds two operator-facing sections when the supporting registry data is available:
   691	
   692	- **Blocked Stops**: Renders `blockedStopHistory` as an ordered replay log. Each entry shows the blocked iteration, the vetoing gates, the recovery strategy, a brief gate-result summary, and the ISO-8601 event timestamp so operators can trace why STOP was denied under REQ-014.
   693	- **Graph Convergence**: Renders `graphConvergenceScore`, `graphDecision`, and the current `graphBlockers` list from the latest `graph_convergence` event so the dashboard exposes the REQ-013 graph verdict alongside inline convergence metrics.
   694	
   695	### Generation Rules
   696	
   697	1. Read `deep-research-state.jsonl`, `findings-registry.json`, and `deep-research-strategy.md` as canonical inputs
   698	2. Compute all derived values (coverage %, trend direction) from raw data
   699	3. Overwrite the entire file on each refresh (not append)
   700	4. If JSONL is missing or empty, write a minimal dashboard noting "No iteration data available"
   701	5. The dashboard is read-only for all agents -- modifications are discarded on next refresh
   702	
   703	### File Protection
   704	
   705	Add to the config `fileProtection` map:
   706	
   707	```json
   708	{

exec
/bin/zsh -lc "nl -ba .opencode/skill/sk-deep-review/references/state_format.md | sed -n '620,646p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   620	| 3 | Active Finding Registry | Deduped active findings with evidence, severity, dimension |
   621	| 4 | Remediation Workstreams | Ordered lanes grouped by dependency or area |
   622	| 5 | Spec Seed | Minimal spec updates implied by findings |
   623	| 6 | Plan Seed | Initial remediation tasks from findings |
   624	| 7 | Traceability Status | Core vs overlay protocol outcomes and gaps |
   625	| 8 | Deferred Items | Advisory findings, blocked items, follow-up checks |
   626	| 9 | Audit Appendix | Coverage, convergence replay, audit detail |
   627	
   628	**Executive Summary** includes verdict (`PASS`/`CONDITIONAL`/`FAIL`), active finding counts, `hasAdvisories` boolean (PASS + P2 > 0), scope description, and convergence reason.
   629	
   630	**Planning Trigger** routes FAIL/CONDITIONAL to remediation planning, PASS to changelog creation.
   631	
   632	**Active Finding Registry** lists each active finding with findingId, severity, dimension, title, file:line evidence, first/last seen iteration, and status.
   633	
   634	**Remediation Workstreams** group related findings into ordered lanes with constituent finding IDs and execution order.
   635	
   636	**Spec Seed / Plan Seed** provide minimal spec updates and initial remediation tasks referencing finding IDs and target files.
   637	
   638	**Traceability Status** reports per-protocol pass/partial/fail with gating class and evidence.
   639	
   640	**Deferred Items** captures advisory findings, blocked protocols, and future follow-up checks.
   641	
   642	**Audit Appendix** contains iteration table, convergence signal replay, file coverage matrix, and dimension breakdown.
   643	
   644	---
   645	
   646	<!-- /ANCHOR:review-report -->

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md | sed -n '72,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    72	- Real completion-gate planning for both deep-loop products, including named stop reasons, binary done checks, and resume-from-run semantics.
    73	- Research-quality runtime artifacts: claim-verification ledger, publication critique, runtime-surface inventory, and promotion checkpoints.
    74	- Dashboard upgrades for both loops: liveness, convergence trends, timing/token visibility, coverage depth, and severity trends.
    75	- Append-only audit-journal planning for both loops.
    76	- Reducer durability for 100+ iteration packets, including delta replay, replay validation, and periodic snapshot/compaction policy.
    77	- Packet-local observability and tracing surfaces: timing/tool/token histograms, state diffs, anomaly flags, and stop-decision drill-down.
    78	- Large-target decomposition policies for 1000+ file review scopes and 50+ domain research scopes.
    79	- Semantic convergence signals that combine novelty, contradiction density, and citation overlap with existing statistical checks.
    80	- Behavior-first automated verification planning for reducers, workflows, and loop outputs.

exec
/bin/zsh -lc "nl -ba .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md | sed -n '176,186p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   176	| REQ-007 | Both loop dashboards MUST expose richer runtime truth: liveness, rolling convergence visualization, wall-clock and token cost per iteration, coverage depth, severity trends, and final stop reason. | Research and review dashboard assets, reducers, and workflow outputs define these sections explicitly; dashboard content is generated, not manually maintained; trend and liveness rules are consistent with state schema. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`] |
   177	| REQ-008 | Deep research MUST support publication critique annotations so synthesis distinguishes verified runtime code, README claims, marketing copy, and other weaker evidence classes. | Research iteration/synthesis surfaces include an explicit evidence-quality or publication-critique field that can be summarized in the dashboard or final research output without becoming mandatory for every minor observation. | `CF-021` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:291-300`] |
   178	| REQ-009 | Deep research MUST support runtime-inventory and promotion-checkpoint artifacts so recommendations do not move to "adopt" without explicit evidence thresholds. | Research packet design includes runtime-surface inventory capture plus checkpoint criteria for moving a finding from interesting to recommended; the promotion threshold is visible in synthesis and the ledger/journal context. | `CF-021` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:291-300`] |
   179	| REQ-010 | Council-style synthesis MUST be supported as an explicit opt-in profile for ambiguous research or architecture questions. | The plan defines named perspective iterations and a synthesis reconciliation iteration; default deep-research behavior remains unchanged unless the user or workflow explicitly selects council mode. | `CF-027` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:359-359`] |
   180	| REQ-011 | Large multi-phase research runs MUST have an optional packet-local coordination board that tracks phase status, headline findings, conflicts, duplicate signals, and resource-allocation suggestions. | The plan defines a packet-local coordination artifact with explicit fields for state, conflicts, dedupe, and resource recommendations; default single-packet research remains unaffected when the board is unused. | `CF-030` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:362-362`] |
   181	| REQ-012 | Command docs and YAML assets MUST surface the new lifecycle and optional-mode behavior without bloating the default operator path. | Default command examples remain compact; advanced behaviors are discoverable but explicitly marked as optional; confirm and auto workflows stay contract-compatible. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:408-411`] |
   182	| REQ-013 | Canonical skill/command/agent contracts and runtime parity tests MUST move together so new stop/journal/ledger/dashboard behavior cannot drift by runtime or doc surface. | Planned work updates the canonical `.opencode` files plus the parity-test surfaces that enforce mirror alignment; implementation does not rely on untested doc-only parity. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:408-411`] |
   183	| REQ-014 | Shared loop-runtime changes MUST preserve packet-local, explicit deep-loop products and avoid introducing a hidden generic DSL or non-auditable state channel. | The implementation plan keeps reducers, journals, ledgers, and dashboards explicit inside the research/review packets; shared helpers may be extracted, but domain-specific artifacts and LEAF semantics remain visible and testable. | `CF-010` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:168-177`], `Theme T-006` [SOURCE: `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/consolidated-research-report.md:467-471`] |
   184	| REQ-015 | Both loops MUST support delta replay plus periodic snapshots/compaction so reducer performance does not degrade on 100+ iteration packets. | Canonical state keeps authoritative append-only events while reducers consume latest deltas plus periodic snapshots; compaction policy is explicit, replay validation proves equivalent outputs before and after compaction, and packet durability remains packet-local. | Iteration 1 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:41-50`], Recommendation 1 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:211-214`] |
   185	| REQ-016 | Both loops MUST expose packet-local observability surfaces with timing/tool/token histograms, state diffs, anomaly flags, and stop-decision drill-down. | Dashboards and reducers emit packet-local observability views sourced from runtime data such as `durationMs`, `toolsUsed`, and `sourcesQueried` or an explicit unknown fallback; stop-decision traces remain replayable and reducer-generated. | Iteration 7 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:143-152`], Recommendation 7 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:217-220`] |
   186	| REQ-017 | Large-target decomposition MUST be planned explicitly: review for 1000+ file repos and research for 50+ source domains. | Deep review defines inventory pass, hotspot ranking, stratified coverage, and segment/wave governance for very large repos; deep research defines domain clustering, authority-aware sampling, and cluster-aware convergence for large source sets; smaller packets keep the default lightweight path. | Iteration 6 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:126-135`], Recommendation 8 [SOURCE: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/scratch/codex-gpt54-deep-research.md:219-221`] |

codex
**Findings**

`F-003-001` | Severity `P1` | Dimension `traceability`  
File: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md`  
Line: `167-168, 218`  
Title: Phase 001 still claims `completed-continue` lineage semantics that the shipped runtime explicitly disables  
Description: REQ-003 and Acceptance Scenario 3 say both loops preserve the same `continuedFromRun` semantics across active resume and completed-continue flows. The reviewed runtime/docs do not support that claim: both loop protocols say `fork` and `completed-continue` have no workflow wiring in the current release, and the reducers only echo whatever lineage metadata is already in config instead of implementing reopen/restart semantics. This leaves the spec marked “Implemented” while the runtime contract remains “resume/restart only.”  
Evidence: `spec.md:167-168,218`; `.opencode/skill/sk-deep-research/references/loop_protocol.md:93-99`; `.opencode/skill/sk-deep-review/references/loop_protocol.md:530-536`; `.opencode/skill/sk-deep-research/references/state_format.md:79-81`; `.opencode/skill/sk-deep-review/references/state_format.md:114-116`; reducers read existing config only at `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:667-685` and `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:899-912`.  
Recommendation: Either downgrade completed-continue/fork to deferred in the Phase 001 spec, or implement and document the missing lineage flow end-to-end, including reducer-visible ancestry fields and replay fixtures.

`F-003-002` | Severity `P1` | Dimension `traceability`  
File: `.opencode/skill/sk-deep-review/references/loop_protocol.md`  
Line: `150-155`  
Title: The reducer contract documents delta replay, but both reducers still rebuild from full packet state  
Description: The reference contract says reducer refreshes consume `latestJSONLDelta`, `newIterationFile`, and `priorReducedState`, implying incremental replay/snapshot behavior. Both shipped reducers instead reread the full JSONL log, full strategy file, and all iteration markdown files on every run. That directly breaks the Phase 001 durability story around delta replay and snapshot/compaction and makes the docs non-traceable to the implementation.  
Evidence: `.opencode/skill/sk-deep-review/references/loop_protocol.md:154-155`; `.opencode/skill/sk-deep-research/references/loop_protocol.md:226-227`; full replay in `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:667-680` and `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:899-912`; Phase 001 requirement at `spec.md:76,184-185`.  
Recommendation: Update the docs/spec to describe full replay truthfully, or land the incremental reducer contract before keeping REQ-015 in implemented state.

`F-003-003` | Severity `P1` | Dimension `traceability`  
File: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md`  
Line: `74-77, 176-185, 197`  
Title: Runtime-truth dashboards still do not expose the stop and observability surfaces the phase says are implemented  
Description: Phase 001 requires final stop reason, typed stop visibility, timing/token visibility, coverage depth, state diffs, anomaly flags, and stop-decision drill-down. The reducer dashboards do not emit those surfaces. Deep research renders status/progress/questions/trend/dead ends/blocked stops/graph convergence only; deep review renders verdict/progress/dimension coverage/blocked stops/graph convergence/trend/active risks, but still no final `stopReason`, no token or timing histograms, no state diffs, and no anomaly view.  
Evidence: `spec.md:74-77,176-185,197`; deep-research dashboard renderer `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:545-643`; deep-review dashboard renderer `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:718-874`; research docs still describe a duration-bearing iteration table at `.opencode/skill/sk-deep-research/references/state_format.md:681-686`, but the actual table headers at `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:576-579` and `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:761-764` omit duration/token fields entirely.  
Recommendation: Either add the missing dashboard sections from the Phase 001 contract, or mark REQ-007/REQ-016 partial and narrow the docs to the reducer’s real output.

`F-003-004` | Severity `P1` | Dimension `traceability`  
File: `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`  
Line: `343-434, 527-643`  
Title: The research reducer still has no trace of the claim-verification ledger or audit-journal rollups promised by Phase 001  
Description: The spec makes claim-verification, journaling, and packet-local auditability core runtime-truth artifacts, and it explicitly says `reduce-state.cjs` should emit ledger and journal rollups. The actual reducer only builds question/finding/ruled-out/blocked-stop/graph-convergence state and dashboard sections; there is no ledger ingestion, no journal summary, and no way to trace REQ-004/REQ-005 from reducer output.  
Evidence: `spec.md:73-75,106,168-169`; reducer registry fields at `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:407-433`; dashboard output at `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:545-643`.  
Recommendation: Add reducer-owned ledger/journal surfaces, or explicitly defer those artifacts in the Phase 001 packet instead of leaving the implementation status and file-level description overstated.

`F-003-005` | Severity `P2` | Dimension `traceability`  
File: `.opencode/skill/sk-deep-review/references/convergence.md`  
Line: `44-45, 89, 420, 608-625`  
Title: The deep-review convergence reference still contradicts the persisted stop-contract shape and the reducer’s compatibility behavior  
Description: Early in the file, the doc says there is no nested `legalStop` wrapper on the persisted path and that the reducer reads blocked-stop shapes verbatim. Later sections still instruct authors to populate `legalStop.blockedBy`, show YAML-style `legalStop:` blocks, and include a synthesis JSON example with nested `legalStop`. The reducer itself is more permissive than the doc says: it normalizes structured `blockedBy` entries and falls back to `record.legalStop.gateResults` for legacy payloads. This leaves three different “canonical” shapes in one contract surface.  
Evidence: `.opencode/skill/sk-deep-review/references/convergence.md:44-45,89,420,608-625`; reducer compatibility logic at `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:446-489`.  
Recommendation: Pick one persisted shape as canonical, rewrite the conflicting examples, and document the legacy fallback strictly as compatibility behavior rather than normative contract.

**Iteration Summary**

Total findings: `5`  
Breakdown: `0 P0`, `4 P1`, `1 P2`

Coverage assessment: `90%` of the requested focus area reviewed. I read the Phase 001 spec, both `reduce-state.cjs` files, both `runtime-capabilities.cjs` files, and the relevant `state_format.md`, `loop_protocol.md`, and `convergence.md` sections for `sk-deep-research` and `sk-deep-review`.

Confidence: `high`

Next priorities:
1. Check the YAML workflow assets (`spec_kit_deep-research_{auto,confirm}.yaml`, `spec_kit_deep-review_{auto,confirm}.yaml`) against the stop-contract claims, because several docs currently describe workflow behavior the reducers do not reflect.
2. Audit `runtime_capabilities.json` plus capability-matrix docs against the resolver modules, since the phase focus named `runtime-capabilities.cjs` but the spec’s file inventory does not clearly trace those resolvers.
3. Verify reducer/contract parity tests and any synthesis/report generators, especially around `stopReason`, lineage fields, and graph-convergence payload shape.


hook: Stop
hook: Stop Completed
tokens used
138,002
**Findings**

`F-003-001` | Severity `P1` | Dimension `traceability`  
File: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md`  
Line: `167-168, 218`  
Title: Phase 001 still claims `completed-continue` lineage semantics that the shipped runtime explicitly disables  
Description: REQ-003 and Acceptance Scenario 3 say both loops preserve the same `continuedFromRun` semantics across active resume and completed-continue flows. The reviewed runtime/docs do not support that claim: both loop protocols say `fork` and `completed-continue` have no workflow wiring in the current release, and the reducers only echo whatever lineage metadata is already in config instead of implementing reopen/restart semantics. This leaves the spec marked “Implemented” while the runtime contract remains “resume/restart only.”  
Evidence: `spec.md:167-168,218`; `.opencode/skill/sk-deep-research/references/loop_protocol.md:93-99`; `.opencode/skill/sk-deep-review/references/loop_protocol.md:530-536`; `.opencode/skill/sk-deep-research/references/state_format.md:79-81`; `.opencode/skill/sk-deep-review/references/state_format.md:114-116`; reducers read existing config only at `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:667-685` and `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:899-912`.  
Recommendation: Either downgrade completed-continue/fork to deferred in the Phase 001 spec, or implement and document the missing lineage flow end-to-end, including reducer-visible ancestry fields and replay fixtures.

`F-003-002` | Severity `P1` | Dimension `traceability`  
File: `.opencode/skill/sk-deep-review/references/loop_protocol.md`  
Line: `150-155`  
Title: The reducer contract documents delta replay, but both reducers still rebuild from full packet state  
Description: The reference contract says reducer refreshes consume `latestJSONLDelta`, `newIterationFile`, and `priorReducedState`, implying incremental replay/snapshot behavior. Both shipped reducers instead reread the full JSONL log, full strategy file, and all iteration markdown files on every run. That directly breaks the Phase 001 durability story around delta replay and snapshot/compaction and makes the docs non-traceable to the implementation.  
Evidence: `.opencode/skill/sk-deep-review/references/loop_protocol.md:154-155`; `.opencode/skill/sk-deep-research/references/loop_protocol.md:226-227`; full replay in `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:667-680` and `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:899-912`; Phase 001 requirement at `spec.md:76,184-185`.  
Recommendation: Update the docs/spec to describe full replay truthfully, or land the incremental reducer contract before keeping REQ-015 in implemented state.

`F-003-003` | Severity `P1` | Dimension `traceability`  
File: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation/spec.md`  
Line: `74-77, 176-185, 197`  
Title: Runtime-truth dashboards still do not expose the stop and observability surfaces the phase says are implemented  
Description: Phase 001 requires final stop reason, typed stop visibility, timing/token visibility, coverage depth, state diffs, anomaly flags, and stop-decision drill-down. The reducer dashboards do not emit those surfaces. Deep research renders status/progress/questions/trend/dead ends/blocked stops/graph convergence only; deep review renders verdict/progress/dimension coverage/blocked stops/graph convergence/trend/active risks, but still no final `stopReason`, no token or timing histograms, no state diffs, and no anomaly view.  
Evidence: `spec.md:74-77,176-185,197`; deep-research dashboard renderer `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:545-643`; deep-review dashboard renderer `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:718-874`; research docs still describe a duration-bearing iteration table at `.opencode/skill/sk-deep-research/references/state_format.md:681-686`, but the actual table headers at `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:576-579` and `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:761-764` omit duration/token fields entirely.  
Recommendation: Either add the missing dashboard sections from the Phase 001 contract, or mark REQ-007/REQ-016 partial and narrow the docs to the reducer’s real output.

`F-003-004` | Severity `P1` | Dimension `traceability`  
File: `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`  
Line: `343-434, 527-643`  
Title: The research reducer still has no trace of the claim-verification ledger or audit-journal rollups promised by Phase 001  
Description: The spec makes claim-verification, journaling, and packet-local auditability core runtime-truth artifacts, and it explicitly says `reduce-state.cjs` should emit ledger and journal rollups. The actual reducer only builds question/finding/ruled-out/blocked-stop/graph-convergence state and dashboard sections; there is no ledger ingestion, no journal summary, and no way to trace REQ-004/REQ-005 from reducer output.  
Evidence: `spec.md:73-75,106,168-169`; reducer registry fields at `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:407-433`; dashboard output at `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:545-643`.  
Recommendation: Add reducer-owned ledger/journal surfaces, or explicitly defer those artifacts in the Phase 001 packet instead of leaving the implementation status and file-level description overstated.

`F-003-005` | Severity `P2` | Dimension `traceability`  
File: `.opencode/skill/sk-deep-review/references/convergence.md`  
Line: `44-45, 89, 420, 608-625`  
Title: The deep-review convergence reference still contradicts the persisted stop-contract shape and the reducer’s compatibility behavior  
Description: Early in the file, the doc says there is no nested `legalStop` wrapper on the persisted path and that the reducer reads blocked-stop shapes verbatim. Later sections still instruct authors to populate `legalStop.blockedBy`, show YAML-style `legalStop:` blocks, and include a synthesis JSON example with nested `legalStop`. The reducer itself is more permissive than the doc says: it normalizes structured `blockedBy` entries and falls back to `record.legalStop.gateResults` for legacy payloads. This leaves three different “canonical” shapes in one contract surface.  
Evidence: `.opencode/skill/sk-deep-review/references/convergence.md:44-45,89,420,608-625`; reducer compatibility logic at `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:446-489`.  
Recommendation: Pick one persisted shape as canonical, rewrite the conflicting examples, and document the legacy fallback strictly as compatibility behavior rather than normative contract.

**Iteration Summary**

Total findings: `5`  
Breakdown: `0 P0`, `4 P1`, `1 P2`

Coverage assessment: `90%` of the requested focus area reviewed. I read the Phase 001 spec, both `reduce-state.cjs` files, both `runtime-capabilities.cjs` files, and the relevant `state_format.md`, `loop_protocol.md`, and `convergence.md` sections for `sk-deep-research` and `sk-deep-review`.

Confidence: `high`

Next priorities:
1. Check the YAML workflow assets (`spec_kit_deep-research_{auto,confirm}.yaml`, `spec_kit_deep-review_{auto,confirm}.yaml`) against the stop-contract claims, because several docs currently describe workflow behavior the reducers do not reflect.
2. Audit `runtime_capabilities.json` plus capability-matrix docs against the resolver modules, since the phase focus named `runtime-capabilities.cjs` but the spec’s file inventory does not clearly trace those resolvers.
3. Verify reducer/contract parity tests and any synthesis/report generators, especially around `stopReason`, lineage fields, and graph-convergence payload shape.
