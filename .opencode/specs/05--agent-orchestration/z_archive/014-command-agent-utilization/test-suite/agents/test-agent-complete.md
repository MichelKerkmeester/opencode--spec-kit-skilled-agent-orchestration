# Test Agent: /spec_kit:complete

## Purpose
Simulate the 14-step complete workflow for test verification.

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

### T-COMP-01: Happy Path :auto
**Setup**: Create workspace at `scratch/test-suite/workspaces/complete-happy/`
**Scripted Inputs**: Feature="Notification system with in-app alerts and email delivery"

**Steps** (14 total):
1. **Step 1 - Request Analysis**: Parse request, confidence=85%
2. **Step 2 - Pre-Work Review**: SIMULATED: Read standards
3. **Phase 3 - Research**: Skipped (confidence > 60%, no :with-research flag)
4. **Step 3 - Specification**: Create spec.md from L2 template
5. **Step 4 - Clarification**: No markers found
6. **Step 5 - Quality Checklist**: Create checklist.md
7. **Step 6 - Planning**: Create plan.md with phases
8. **Step 6.5 - Checkpoint**: SIMULATED: Save planning checkpoint
9. **Step 7 - Task Breakdown**: Create tasks.md with 12+ tasks
10. **Step 8 - Analysis**: Cross-reference all artifacts
11. **Step 9 - Implementation Check**: All prerequisites verified
12. **Step 10 - Development**: SIMULATED: Execute all tasks, mark [x]
13. **Step 11 - Checklist Verify**: All P0 [x], all P1 [x]
14. **Step 12 - Completion**: Create implementation-summary.md
15. **Step 13 - Save Context**: SIMULATED: Memory file
16. **Step 14 - Handover Check**: Scripted="decline"

**Quality Gates (3 gates)**:
- Pre-execution: feature_description(30) + spec_path_valid(30) + no_blocking_deps(20) + execution_mode_set(20) = 100/70 PASS
- Planning gate (between step 7 and 8): spec_no_clarification(30) + plan_complete(25) + tasks_valid(25) + checklist_exists(20) = 100/70 PASS -- score=85/70
- Post-execution: tasks_complete(30) + tests_pass(25) + summary_exists(25) + checklist_verified(20) = 100/70 PASS -- score=85/70

**Assertions**:
- [ ] Full artifact set: spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md
- [ ] All tasks marked [x]
- [ ] No [PLACEHOLDER], {{, or [NEEDS CLARIFICATION] in happy-path output
- [ ] 3 quality gates all PASS

**Verify Agent Routing**:
- research: condition=":with-research OR confidence < 60%", skipped in this test (confidence=85%, no flag)
- specification: step=3, agent=@speckit
- verification: step=11, agent=@review, blocking=true
- debug: step=10, agent=@debug, trigger=failure_count>=3
- handover: step=14, agent=@handover

### T-COMP-02: Planning Gate Fail
**Setup**: Create workspace at `scratch/test-suite/workspaces/complete-gate-fail/`
**Scripted Inputs**: Feature="Payment processing with Stripe integration"

**Steps**:
1. **Steps 1-2**: Normal (confidence=75%)
2. **Step 3 - Specification**: Create spec.md BUT leave [NEEDS CLARIFICATION] markers in 2 sections (payment retry logic, webhook verification)
3. **Step 4 - Clarification**: 2 markers found but NOT resolved (scripted: skip resolution)
4. **Steps 5-7**: Create plan.md, checklist.md, tasks.md
5. **Planning Gate**: spec_no_clarification=0/30 (markers present), plan_complete=25, tasks_valid=25, checklist_exists=20 = 70/100
6. **Expected Behavior**: Planning gate score=70, exactly at threshold (70/70). Per YAML, threshold is 70 so this PASSES barely. However, if the gate evaluates spec_no_clarification as hard-fail (boolean), then the gate FAILS.
7. **Verify**: If gate fails, workflow returns to Step 4 for remediation. If gate passes at 70, workflow continues but with warnings.

**Quality Gates**:
- Pre-execution: 100/70 PASS
- Planning gate: 70/70 BORDERLINE -- evaluate per YAML rules
- Post-execution: NOT REACHED (if gate fails)

**Assertions**:
- [ ] spec.md contains [NEEDS CLARIFICATION] markers
- [ ] Planning gate evaluated correctly per YAML threshold logic
- [ ] If FAIL: workflow returns to Step 4 remediation loop
- [ ] If PASS (borderline): warnings logged, workflow continues with caveats
- [ ] No implementation files created if gate fails

**Verify Agent Routing**:
- specification: step=3, agent=@speckit (ran normally)
- remediation_loop: step=4, triggered by gate failure, max_iterations from YAML
- All post-planning agents NOT dispatched if gate fails

## Return Format

Return a JSON array with one result object per test:

```json
[
  {
    "command": "complete",
    "test_id": "T-COMP-01",
    "test_name": "Happy path :auto",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Request Analysis", "status": "PASS", "outputs": ["confidence_85"] },
      { "step": 2, "name": "Pre-Work Review", "status": "PASS", "outputs": ["standards_loaded"] },
      { "step": "3(research)", "name": "Research", "status": "SKIPPED", "outputs": ["confidence_above_60_no_flag"] },
      { "step": 3, "name": "Specification", "status": "PASS", "outputs": ["spec.md"] },
      { "step": 4, "name": "Clarification", "status": "PASS", "outputs": ["no_markers"] },
      { "step": 5, "name": "Quality Checklist", "status": "PASS", "outputs": ["checklist.md"] },
      { "step": 6, "name": "Planning", "status": "PASS", "outputs": ["plan.md"] },
      { "step": "6.5", "name": "Checkpoint", "status": "PASS", "outputs": ["checkpoint_saved"] },
      { "step": 7, "name": "Task Breakdown", "status": "PASS", "outputs": ["tasks.md"] },
      { "step": 8, "name": "Analysis", "status": "PASS", "outputs": ["cross_reference_complete"] },
      { "step": 9, "name": "Implementation Check", "status": "PASS", "outputs": ["prerequisites_green"] },
      { "step": 10, "name": "Development", "status": "PASS", "outputs": ["all_tasks_complete"] },
      { "step": 11, "name": "Checklist Verify", "status": "PASS", "outputs": ["all_p0_p1_checked"] },
      { "step": 12, "name": "Completion", "status": "PASS", "outputs": ["implementation-summary.md"] },
      { "step": 13, "name": "Save Context", "status": "PASS", "outputs": ["memory_file"] },
      { "step": 14, "name": "Handover Check", "status": "PASS", "outputs": ["declined"] }
    ],
    "artifacts_created": ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md", "memory/14-02-26_12-00__complete_session.md"],
    "quality_gates": { "pre": "PASS (100/70)", "planning": "PASS (85/70)", "post": "PASS (85/70)" },
    "agent_routes_verified": ["@speckit->step_3", "@review->step_11(blocking)", "@debug->step_10(not_triggered)", "@handover->step_14", "research->SKIPPED"],
    "errors": []
  },
  {
    "command": "complete",
    "test_id": "T-COMP-02",
    "test_name": "Planning gate fail",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Request Analysis", "status": "PASS", "outputs": ["confidence_75"] },
      { "step": 2, "name": "Pre-Work Review", "status": "PASS", "outputs": ["standards_loaded"] },
      { "step": 3, "name": "Specification", "status": "PASS", "outputs": ["spec.md_with_markers"] },
      { "step": 4, "name": "Clarification", "status": "WARN", "outputs": ["2_markers_unresolved"] },
      { "step": 5, "name": "Quality Checklist", "status": "PASS", "outputs": ["checklist.md"] },
      { "step": 6, "name": "Planning", "status": "PASS", "outputs": ["plan.md"] },
      { "step": 7, "name": "Task Breakdown", "status": "PASS", "outputs": ["tasks.md"] },
      { "step": "gate", "name": "Planning Gate", "status": "FAIL", "outputs": ["score_70_spec_clarification_0"] }
    ],
    "artifacts_created": ["spec.md (with markers)", "plan.md", "tasks.md", "checklist.md"],
    "quality_gates": { "pre": "PASS (100/70)", "planning": "FAIL or BORDERLINE (70/70)", "post": "NOT_REACHED" },
    "agent_routes_verified": ["@speckit->step_3", "remediation_loop->step_4(triggered)"],
    "errors": [],
    "expected_behavior_verified": "planning_gate_blocks_on_clarification_markers"
  }
]
```

## Execution Instructions

1. Read the YAML at `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
2. For T-COMP-01: Create workspace, walk through all 14 steps creating real files
3. For T-COMP-02: Create workspace, deliberately leave markers, verify gate behavior
4. Return the JSON results array
