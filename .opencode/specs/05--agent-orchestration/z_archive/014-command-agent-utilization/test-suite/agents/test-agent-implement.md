# Test Agent: /spec_kit:implement

## Purpose
Simulate the 9-step implement workflow for test verification.

## Simulation Rules

CRITICAL -- follow these rules exactly:

1. DO NOT call MCP tools -- log as `SIMULATED: memory_context({...}) -> no prior work`
2. DO NOT dispatch actual sub-agents -- when YAML says "dispatch @speckit", read the template, fill it, write it, log `SIMULATED: @speckit -> spec.md created`
3. DO NOT run generate-context.js -- create a sample memory file directly
4. DO create real files in the workspace using L2 templates
5. DO fill all template placeholders with realistic test data
6. DO evaluate quality gates by checking file existence and content completeness
7. DO verify agent routing config in YAML matches expectations

## Tests to Execute

### T-IMPL-01: Happy Path :auto
**Setup**: Copy fixtures/base-spec-folder/ to `scratch/test-suite/workspaces/implement-happy/`
**Scripted Inputs**: spec_folder="specs/042-jwt-authentication"

**Steps**:
1. **Step 1 - Review Plan & Spec**: Read spec.md, plan.md from workspace. Verify they exist. Log understanding.
2. **Step 2 - Task Breakdown**: Read tasks.md (already exists from fixture). Validate format. 14 tasks found.
3. **Step 3 - Analysis**: Cross-reference spec requirements with tasks. All REQ-001 through REQ-006 covered.
4. **Step 4 - Quality Checklist**: Read checklist.md. Mark pre-implementation items as checked.
5. **Step 5 - Implementation Check**: Verify prerequisites. All green.
6. **Step 6 - Development**: SIMULATED: Execute tasks T001-T014. Mark all [x] in tasks.md. Confidence=85%.
7. **Step 7 - Completion**: Create `implementation-summary.md` in workspace with required sections.
8. **Step 8 - Save Context**: SIMULATED: generate-context.js -> memory file. Write memory file.
9. **Step 9 - Handover Check**: Scripted="decline".

**Quality Gates**:
- Pre-implementation: prerequisites(30)+plan_clarity(25)+task_breakdown(25)+checklist(20) = 100/70 PASS
- Post-implementation: tasks_complete(30)+tests_pass(25)+summary(25)+checklist(20) = 100/70 PASS

**Assertions**:
- [ ] tasks.md has all items marked [x]
- [ ] implementation-summary.md exists with required sections
- [ ] memory file exists
- [ ] No [PLACEHOLDER] or {{ in any files

**Verify Agent Routing**:
- verification_phase: step=7, agent=@review, blocking=true
- debug_integration: step=6, agent=@debug, trigger=failure_count>=3
- handover_phase: step=9, agent=@handover

### T-IMPL-02: Missing plan.md
**Setup**: Use empty workspace (no spec.md or plan.md)
**Scripted Inputs**: spec_folder="specs/empty-project"

**Steps**:
1. **Step 1 - Review Plan & Spec**: Attempt to read spec.md, plan.md. Files not found.
2. **Expected Behavior**: Prerequisites gate fails -> redirects to /spec_kit:plan with message "No spec or plan found. Run /spec_kit:plan first."
3. **Verify**: No implementation files created. Redirect message logged.

**Quality Gates**:
- Pre-implementation: prerequisites(0)+plan_clarity(0)+task_breakdown(0)+checklist(0) = 0/70 FAIL

**Assertions**:
- [ ] No implementation-summary.md created
- [ ] Redirect to /spec_kit:plan logged
- [ ] Pre-implementation gate score = 0, status = FAIL

### T-IMPL-03: Debug Threshold
**Setup**: Copy fixtures/base-spec-folder/ to `scratch/test-suite/workspaces/implement-debug-threshold/`
**Scripted Inputs**: spec_folder="specs/042-jwt-authentication", simulate 3 task failures on T004

**Steps**:
1. **Steps 1-5**: Same as happy path (all pass).
2. **Step 6 - Development**: Execute tasks. T001-T003 pass. T004 fails 3 times (failure_count=3).
3. **Expected Behavior**: Debug dispatch offered with A/B/C/D options:
   - A) Delegate to debug sub-agent
   - B) Manual fix
   - C) Skip task
   - D) Cancel implementation
4. **Scripted choice**: "A" (delegate). Create debug-delegation.md with error context.
5. **SIMULATED**: @debug agent returns fix. T004 passes on retry.
6. **Steps 7-9**: Continue to completion.

**Quality Gates**:
- Pre-implementation: 100/70 PASS
- Post-implementation: 100/70 PASS (all tasks eventually complete)

**Assertions**:
- [ ] debug-delegation.md created when failure_count reached 3
- [ ] T004 marked [x] after debug fix
- [ ] All tasks eventually marked [x]
- [ ] Debug dispatch logged with correct agent routing

**Verify Agent Routing**:
- debug_integration: step=6, agent=@debug, trigger=failure_count>=3 (TRIGGERED)
- verification_phase: step=7, agent=@review, blocking=true
- handover_phase: step=9, agent=@handover

## Return Format

Return a JSON array with one result object per test:

```json
[
  {
    "command": "implement",
    "test_id": "T-IMPL-01",
    "test_name": "Happy path :auto",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Review Plan & Spec", "status": "PASS", "outputs": ["spec_loaded", "plan_loaded"] },
      { "step": 2, "name": "Task Breakdown", "status": "PASS", "outputs": ["14_tasks_found"] },
      { "step": 3, "name": "Analysis", "status": "PASS", "outputs": ["all_reqs_covered"] },
      { "step": 4, "name": "Quality Checklist", "status": "PASS", "outputs": ["checklist_loaded"] },
      { "step": 5, "name": "Implementation Check", "status": "PASS", "outputs": ["prerequisites_green"] },
      { "step": 6, "name": "Development", "status": "PASS", "outputs": ["14_tasks_complete"] },
      { "step": 7, "name": "Completion", "status": "PASS", "outputs": ["implementation-summary.md"] },
      { "step": 8, "name": "Save Context", "status": "PASS", "outputs": ["memory_file"] },
      { "step": 9, "name": "Handover Check", "status": "PASS", "outputs": ["declined"] }
    ],
    "artifacts_created": ["tasks.md (updated)", "implementation-summary.md", "memory/14-02-26_11-00__implementation_session.md"],
    "quality_gates": { "pre": "PASS (100/70)", "post": "PASS (100/70)" },
    "agent_routes_verified": ["@review->step_7(blocking)", "@debug->step_6(conditional)", "@handover->step_9"],
    "errors": []
  },
  {
    "command": "implement",
    "test_id": "T-IMPL-02",
    "test_name": "Missing plan.md",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Review Plan & Spec", "status": "FAIL", "outputs": ["spec_not_found", "plan_not_found"] }
    ],
    "artifacts_created": [],
    "quality_gates": { "pre": "FAIL (0/70)" },
    "agent_routes_verified": [],
    "errors": [],
    "expected_behavior_verified": "redirect_to_plan_command"
  },
  {
    "command": "implement",
    "test_id": "T-IMPL-03",
    "test_name": "Debug threshold",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Review Plan & Spec", "status": "PASS", "outputs": ["spec_loaded", "plan_loaded"] },
      { "step": 2, "name": "Task Breakdown", "status": "PASS", "outputs": ["14_tasks_found"] },
      { "step": 3, "name": "Analysis", "status": "PASS", "outputs": ["all_reqs_covered"] },
      { "step": 4, "name": "Quality Checklist", "status": "PASS", "outputs": ["checklist_loaded"] },
      { "step": 5, "name": "Implementation Check", "status": "PASS", "outputs": ["prerequisites_green"] },
      { "step": 6, "name": "Development", "status": "PASS", "outputs": ["T004_failed_3x", "debug_dispatched", "T004_fixed"] },
      { "step": 7, "name": "Completion", "status": "PASS", "outputs": ["implementation-summary.md"] },
      { "step": 8, "name": "Save Context", "status": "PASS", "outputs": ["memory_file"] },
      { "step": 9, "name": "Handover Check", "status": "PASS", "outputs": ["declined"] }
    ],
    "artifacts_created": ["debug-delegation.md", "tasks.md (updated)", "implementation-summary.md", "memory/14-02-26_11-30__implementation_session.md"],
    "quality_gates": { "pre": "PASS (100/70)", "post": "PASS (100/70)" },
    "agent_routes_verified": ["@debug->step_6(triggered)", "@review->step_7(blocking)", "@handover->step_9"],
    "errors": ["T004 failed 3x before debug resolution"]
  }
]
```

## Execution Instructions

1. Read the YAML at `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
2. For T-IMPL-01: Copy fixtures, walk through all 9 steps creating real files
3. For T-IMPL-02: Use empty workspace, verify redirect behavior
4. For T-IMPL-03: Copy fixtures, simulate failure threshold, verify debug dispatch
5. Return the JSON results array
