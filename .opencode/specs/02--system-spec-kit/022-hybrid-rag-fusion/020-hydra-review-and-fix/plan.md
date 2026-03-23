# Plan

## Approach

Three-phase workflow: review → fix → stabilize.

### Phase 1: Review (5 GPT-5.4 ultra-think agents)
- Partition 80+ implementation files into 5 non-overlapping scopes
- Each agent runs via `codex exec -p ultra-think --model gpt-5.4 -c model_reasoning_effort="high" --sandbox read-only`
- Synthesize findings using Sequential Thinking MCP

### Phase 2: Fix (5 parallel agents, file-partitioned)
- Agent A: Pipeline architecture (Opus worktree for isolation)
- Agents B-E: Scoring, standards, vector-index, eval+docs (GPT-5.4 codex workspace-write)
- Zero file overlap between agents by design

### Phase 3: Test Stabilization (3 Opus agents)
- Fix pre-existing test failures (135 total across 22 test files)
- Partition by failure category: DB-init handlers, integration/scoring, misc

## Quality Gates
- [x] All review findings documented with SEVERITY, FILE, LINE, DESCRIPTION, SUGGESTED FIX
- [x] All fixes applied without file conflicts
- [x] Full test suite: 0 failures (8905 pass)
- [x] No regressions introduced by fix agents
