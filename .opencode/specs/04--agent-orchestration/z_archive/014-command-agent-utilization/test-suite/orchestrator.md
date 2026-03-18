# Spec Kit Command Test Suite — Orchestrator

## Purpose

This orchestrator dispatches 7 test agents (one per spec_kit command) to simulate YAML-driven workflows, verify file creation, quality gates, and agent routing. Each agent returns structured JSON. The orchestrator collects results and writes a consolidated test report.

## Architecture

```
Orchestrator (this agent)
  │
  ├── Batch 1 (no dependencies):
  │     ├── test-agent-plan       → 3 tests (T-PLAN-01/02/03)
  │     ├── test-agent-research   → 2 tests (T-RES-01/02)
  │     └── test-agent-handover   → 3 tests (T-HND-01/02/03)
  │
  ├── Batch 2 (needs fixtures):
  │     ├── test-agent-implement  → 3 tests (T-IMPL-01/02/03)
  │     └── test-agent-resume     → 3 tests (T-RSM-01/02/03)
  │
  └── Batch 3 (complex):
        ├── test-agent-complete   → 2 tests (T-COMP-01/02)
        └── test-agent-debug      → 2 tests (T-DBG-01/02)

Total: 18 tests across 7 commands
```

## Execution Protocol

### Pre-Flight

1. Verify directory structure exists:
   ```
   scratch/test-suite/
     agents/          → 7 agent prompt files
     fixtures/        → base-spec-folder, error-spec-folder, empty-spec-folder
     workspaces/      → created per test at runtime
     results/         → test-report.md written here
   ```

2. Verify fixtures are populated:
   - `fixtures/base-spec-folder/` has: spec.md, plan.md, tasks.md, checklist.md, handover.md, memory/
   - `fixtures/error-spec-folder/` has: spec.md with [NEEDS CLARIFICATION]
   - `fixtures/empty-spec-folder/` is empty directory

3. Verify agent prompts exist:
   - `agents/test-agent-{plan,implement,complete,research,debug,resume,handover}.md`

4. Read `scripted-responses.yaml` for reference data

### Batch 1 Dispatch (Parallel — No Dependencies)

Dispatch these 3 agents simultaneously via Task tool:

```yaml
Agent 1 - Plan:
  tool: Task
  subagent_type: general-purpose
  prompt: |
    Read scratch/test-suite/agents/test-agent-plan.md for full instructions.
    Read scratch/test-suite/scripted-responses.yaml for scripted inputs.
    Execute all 3 plan tests. Create workspaces. Return JSON results.
    Base path: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/

Agent 2 - Research:
  tool: Task
  subagent_type: general-purpose
  prompt: |
    Read scratch/test-suite/agents/test-agent-research.md for full instructions.
    Read scratch/test-suite/scripted-responses.yaml for scripted inputs.
    Execute all 2 research tests. Create workspaces. Return JSON results.
    Base path: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/

Agent 3 - Handover:
  tool: Task
  subagent_type: general-purpose
  prompt: |
    Read scratch/test-suite/agents/test-agent-handover.md for full instructions.
    Read scratch/test-suite/scripted-responses.yaml for scripted inputs.
    Execute all 3 handover tests. Create workspaces. Return JSON results.
    Base path: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/
```

### Batch 2 Dispatch (Parallel — Needs Fixture Copy)

Before dispatch: Copy `fixtures/base-spec-folder/` to each workspace.

```yaml
Agent 4 - Implement:
  tool: Task
  subagent_type: general-purpose
  prompt: |
    Read scratch/test-suite/agents/test-agent-implement.md for full instructions.
    Read scratch/test-suite/scripted-responses.yaml for scripted inputs.
    Fixtures pre-copied to workspaces.
    Execute all 3 implement tests. Return JSON results.
    Base path: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/

Agent 5 - Resume:
  tool: Task
  subagent_type: general-purpose
  prompt: |
    Read scratch/test-suite/agents/test-agent-resume.md for full instructions.
    Read scratch/test-suite/scripted-responses.yaml for scripted inputs.
    Fixtures pre-copied to workspaces.
    Execute all 3 resume tests. Return JSON results.
    Base path: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/
```

### Batch 3 Dispatch (Parallel — Complex Workflows)

```yaml
Agent 6 - Complete:
  tool: Task
  subagent_type: general-purpose
  prompt: |
    Read scratch/test-suite/agents/test-agent-complete.md for full instructions.
    Read scratch/test-suite/scripted-responses.yaml for scripted inputs.
    Execute all 2 complete tests. Create workspaces. Return JSON results.
    Base path: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/

Agent 7 - Debug:
  tool: Task
  subagent_type: general-purpose
  prompt: |
    Read scratch/test-suite/agents/test-agent-debug.md for full instructions.
    Read scratch/test-suite/scripted-responses.yaml for scripted inputs.
    Fixtures pre-copied to workspaces.
    Execute all 2 debug tests. Return JSON results.
    Base path: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/
```

## Result Collection

After all 7 agents return, collect their JSON results and merge into a single array. Expected: 18 test result objects.

### Result Validation

For each result:
1. Verify `overall_status` is either `PASS` or expected failure behavior
2. Check `artifacts_created` array is non-empty for happy paths
3. Verify `quality_gates` all meet thresholds for happy paths
4. Verify `agent_routes_verified` lists expected routing
5. Check `errors` array is empty for passing tests

### Post-Run Verification

Run these checks across ALL workspaces:
```bash
# No unfilled placeholders in happy-path outputs
grep -r '\[PLACEHOLDER\]' scratch/test-suite/workspaces/*/  # expect 0
grep -r '{{' scratch/test-suite/workspaces/*/                # expect 0
grep -r '\[NEEDS' scratch/test-suite/workspaces/*-happy/     # expect 0

# Happy paths have complete artifact sets
ls scratch/test-suite/workspaces/plan-happy/spec.md
ls scratch/test-suite/workspaces/plan-happy/plan.md
ls scratch/test-suite/workspaces/implement-happy/implementation-summary.md
ls scratch/test-suite/workspaces/complete-happy/implementation-summary.md
ls scratch/test-suite/workspaces/research-happy/research.md
ls scratch/test-suite/workspaces/debug-happy/debug-delegation.md
ls scratch/test-suite/workspaces/resume-happy/  # files exist
ls scratch/test-suite/workspaces/handover-happy/handover.md
```

## Report Generation

Write `results/test-report.md` with this format:

```markdown
# Spec Kit Command Test Suite — Report

**Date**: [timestamp]
**Total Tests**: 18
**Passed**: [N]/18
**Failed**: [N]/18

## Summary

| Command    | Tests | Pass | Fail | Notes |
|------------|-------|------|------|-------|
| plan       | 3     | X    | Y    |       |
| implement  | 3     | X    | Y    |       |
| complete   | 2     | X    | Y    |       |
| research   | 2     | X    | Y    |       |
| debug      | 2     | X    | Y    |       |
| resume     | 3     | X    | Y    |       |
| handover   | 3     | X    | Y    |       |

## Detailed Results

### /spec_kit:plan

#### T-PLAN-01: Happy path :auto — [PASS/FAIL]
- Steps: 7/7 completed
- Artifacts: spec.md, plan.md, tasks.md, memory file
- Quality Gates: Pre=PASS (100/70), Post=PASS (100/70)
- Agent Routes: @speckit->3 ✓, @research->5(cond) ✓, @handover->7 ✓

[... repeat for each test ...]

## Verification Checks

### Placeholder Scan
- `[PLACEHOLDER]` occurrences in happy-path workspaces: [0]
- `{{` occurrences in happy-path workspaces: [0]
- `[NEEDS CLARIFICATION]` in happy-path workspaces: [0]

### Artifact Completeness
| Workspace | Expected Files | Found | Status |
|-----------|---------------|-------|--------|
| plan-happy | spec.md, plan.md, tasks.md | [list] | ✓/✗ |
| implement-happy | tasks.md, impl-summary.md | [list] | ✓/✗ |
| complete-happy | 5 artifacts | [list] | ✓/✗ |
| research-happy | research.md | [list] | ✓/✗ |
| debug-happy | debug-delegation.md | [list] | ✓/✗ |
| handover-happy | handover.md | [list] | ✓/✗ |

## Error-Path Behavior Verification

| Test | Expected Behavior | Verified |
|------|-------------------|----------|
| T-PLAN-02 | Workflow pauses at confidence < 40% | ✓/✗ |
| T-PLAN-03 | Q0 blocks until feature desc provided | ✓/✗ |
| T-IMPL-02 | Prerequisite fails → redirect to /plan | ✓/✗ |
| T-IMPL-03 | Debug dispatch offered after 3 failures | ✓/✗ |
| T-COMP-02 | Planning gate < 70 → remediation | ✓/✗ |
| T-RES-02 | Research complete with gaps documented | ✓/✗ |
| T-DBG-02 | Escalation with fallback options | ✓/✗ |
| T-RSM-02 | No session → suggest /complete | ✓/✗ |
| T-RSM-03 | Stale warning with A/B/C/D options | ✓/✗ |
| T-HND-02 | No session message | ✓/✗ |
| T-HND-03 | Attempt incremented to 2 | ✓/✗ |
```

## Simulation Rules (enforced across all agents)

1. **NO MCP calls** — Log as `SIMULATED: memory_context({...}) -> no prior work`
2. **NO actual sub-agent dispatch** — Log as `SIMULATED: @speckit -> spec.md created`
3. **NO generate-context.js** — Create memory files directly with ANCHOR tags
4. **YES create real files** in workspaces using L2 templates
5. **YES fill all placeholders** with realistic test data
6. **YES evaluate quality gates** via file existence and content checks
7. **YES verify agent routing** configuration from YAML matches expectations

## Success Criteria

1. All 7 happy-path tests return `"overall_status": "PASS"`
2. All 11 error/edge tests return correct failure behavior
3. `test-report.md` shows 18/18 tests with expected outcomes
4. Each happy-path workspace contains expected artifacts
5. Zero `[PLACEHOLDER]`, `{{`, or `[NEEDS CLARIFICATION]` in happy-path outputs
