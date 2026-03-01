# Test Protocol: Context Agent Model Comparison

**Spec**: 012-context-model-comparison
**Created**: 2026-02-14

---

## Pre-Execution Checklist

1. Verify codebase state: no uncommitted changes in test-relevant directories
2. Verify memory state: run `memory_stats` and note memory count
3. Confirm both `@context-haiku` and `@context-sonnet` resolve in Claude Code
4. Open a fresh Claude Code session for test execution
5. Do NOT commit any changes between test runs

---

## Execution Order

Alternate first-runner to avoid first-mover bias. Swap order on rounds 3 and 5.

| Round | Query | First Runner | Second Runner | Rationale |
|-------|-------|--------------|---------------|-----------|
| 1 | TQ-1 | Haiku | Sonnet | Haiku starts (default) |
| 2 | TQ-2 | Sonnet | Haiku | Alternate |
| 3 | TQ-3 | Sonnet | Haiku | Swap round — Sonnet goes first again |
| 4 | TQ-4 | Haiku | Sonnet | Alternate |
| 5 | TQ-5 | Sonnet | Haiku | Swap round — Sonnet goes first again |

---

## Test Queries

### TQ-1: File Existence Check (Quick Mode)

**ID**: TQ-1
**Mode**: quick
**Cognitive Demand**: Low
**Key Test**: Basic retrieval accuracy — can the agent find specific files?

**Exact Prompt** (copy-paste this):
```
Explore whether these 3 form-related files exist and are non-empty:
- Any file matching *contact* in the HTML/template directories
- Any file matching *form* in the CSS/SCSS directories
- Any file matching *form* or *validate* in the JS directories
Thoroughness: quick. Focus: codebase.
```

**Expected Behavior**:
- 2-4 tool calls (Glob patterns)
- Returns file paths only (no content)
- Completes in ~30 seconds
- Output ~500 tokens (15 lines)

**Scoring Focus**: Did it find the right files? Were paths accurate? Did it stay within quick mode constraints?

---

### TQ-2: Form Handling Patterns (Medium Mode)

**ID**: TQ-2
**Mode**: medium
**Cognitive Demand**: Moderate
**Key Test**: Pattern precision — can the agent identify form handling conventions?

**Exact Prompt** (copy-paste this):
```
Explore form handling patterns in this codebase. I need to understand how forms
are structured, validated, and submitted before implementing a new contact form.
Thoroughness: medium. Focus: both.
```

**Expected Behavior**:
- 5-10 tool calls
- Memory check first, then Glob + Grep + Read
- Returns file structure map + code patterns
- Up to 1 agent dispatch if gaps found
- Output ~2K tokens (60 lines)

**Scoring Focus**: Pattern precision (Q-01), file selection quality (Q-02), evidence density (Q-06)

---

### TQ-3: Video System Architecture (Medium Mode)

**ID**: TQ-3
**Mode**: medium
**Cognitive Demand**: Moderate-High
**Key Test**: Cross-domain pattern detection — can the agent connect CSS and JS patterns?

**Exact Prompt** (copy-paste this):
```
Explore the video/media system in this codebase. I need to understand how video
elements are styled (CSS) and how any video playback behavior is controlled (JS).
Thoroughness: medium. Focus: both.
```

**Expected Behavior**:
- 5-10 tool calls
- Memory check first, then multi-pattern Glob + Grep
- Must detect both CSS styling patterns AND JS behavior patterns
- Cross-reference between style and behavior files
- Output ~2K tokens (60 lines)

**Scoring Focus**: Cross-reference quality (Q-04), pattern precision (Q-01), gap detection (Q-03)

---

### TQ-4: Navigation System Full Context (Thorough Mode)

**ID**: TQ-4
**Mode**: thorough
**Cognitive Demand**: High
**Key Test**: 3-layer retrieval depth, gap detection, dispatch decisions

**Exact Prompt** (copy-paste this):
```
Explore everything related to the navigation system — HTML structure, CSS styling,
JS behavior, responsive patterns, and any prior decisions or memory context about
navigation changes. I need full context before a navigation redesign.
Thoroughness: thorough. Focus: both.
```

**Expected Behavior**:
- 10-20 tool calls
- All 3 layers: memory check → codebase discovery → deep memory
- Glob (5-10 patterns), Grep (3-5 patterns), Read (5-8 files)
- Up to 2 agent dispatches for deep analysis
- Spec folder check for any navigation-related specs
- Output ~4K tokens (120 lines)

**Scoring Focus**: Gap detection (Q-03), recommendation quality (Q-05), dispatched analysis integration, all 6 Context Package sections present

---

### TQ-5: Agent System Architecture (Thorough Mode, Meta)

**ID**: TQ-5
**Mode**: thorough
**Cognitive Demand**: High
**Key Test**: Self-referential exploration — can the agent explore its own system?

**Exact Prompt** (copy-paste this):
```
Explore the agent system architecture in this project — all agent definitions,
their relationships, dispatch patterns, and any memory context about agent design
decisions. I need comprehensive context for planning agent system improvements.
Thoroughness: thorough. Focus: both.
```

**Expected Behavior**:
- 10-20 tool calls
- All 3 layers with deep memory search
- Must discover: agent files in `.opencode/agent/` and `.claude/agents/`, orchestrator dispatch patterns, agent relationships, spec folders under `05--agent-orchestration/`
- Memory integration: prior decisions about agent architecture
- Up to 2 agent dispatches
- Output ~4K tokens (120 lines)

**Scoring Focus**: Self-referential accuracy, memory integration (spec 011 context), evidence density (Q-06), recommendation quality (Q-05)

---

## Post-Execution

1. Record raw outputs in `results.md` (or link to session transcript)
2. Score each output using `scoring-rubric.md` BEFORE comparing variants
3. Record operational metrics (latency, tool calls, dispatches) from session logs
4. Proceed to scoring and analysis phase
