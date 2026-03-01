# Test Agent: /spec_kit:plan

## Purpose
Simulate the 7-step plan workflow for test verification.

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

### T-PLAN-01: Happy Path :auto
**Setup**: Create workspace at `scratch/test-suite/workspaces/plan-happy/`
**Scripted Inputs**: Feature="JWT authentication with RS256 signing", Q1=B (new folder), Q3=A (single agent)

**Steps**:
1. **Step 1 - Request Analysis**: Parse "JWT auth" request, assess confidence=85%, log: "Confidence: 85% - Requirements clear"
2. **Step 2 - Pre-Work Review**: SIMULATED: Read AGENTS.md -> NestJS patterns identified. Log coding standards.
3. **Step 3 - Specification**: Read L2 spec template from `.opencode/skill/system-spec-kit/templates/level_2/spec.md`. Fill with JWT auth content. Write to workspace as `spec.md`. SIMULATED: @speckit -> spec.md created. Confidence=90%.
4. **Step 4 - Clarification**: Check for [NEEDS CLARIFICATION] markers. None found (clean spec). Mark resolved.
5. **Step 5 - Planning**: Read L2 plan template from `.opencode/skill/system-spec-kit/templates/level_2/plan.md`. Fill with JWT implementation approach. SIMULATED: 4 @context agents dispatched -> findings merged. Write `plan.md` + `tasks.md` to workspace. Confidence=88%.
6. **Step 6 - Save Context**: SIMULATED: generate-context.js -> memory file created. Write `memory/14-02-26_10-30__planning_session.md` with ANCHOR tags.
7. **Step 7 - Handover Check**: Scripted response="decline". Log: "Handover declined, proceeding to termination."

**Quality Gates**:
- Pre-execution: feature_description(30) + spec_path_valid(30) + no_blocking_deps(20) + execution_mode_set(20) = 100/70 PASS
- Post-execution: spec_exists(25) + plan_exists(25) + tasks_exists(20) + context_saved(15) + handover_check(15) = 100/70 PASS

**Assertions**:
- [ ] spec.md exists in workspace, no [PLACEHOLDER] or {{ markers
- [ ] plan.md exists with Technical Context filled
- [ ] tasks.md exists with T### format tasks
- [ ] memory file exists with ANCHOR tags
- [ ] Agent routes verified: @speckit->step_3, @research->step_5(conditional), @handover->step_7

**Verify Agent Routing from YAML**:
- specification_phase: step=3, agent=@speckit, fallback=general
- research_phase: step=5, agent=@research, conditional=true
- handover_phase: step=7, agent=@handover, fallback=general

### T-PLAN-02: Low Confidence
**Setup**: Workspace `scratch/test-suite/workspaces/plan-low-confidence/`
**Scripted Inputs**: Feature="Implement something with authentication" (vague)

**Steps**:
1. **Step 1**: Confidence=30% (below 40% threshold).
2. **Expected Behavior**: Workflow STOPS. Presents A/B/C clarification options.
3. **Verify**: No spec.md created. Clarification prompt logged.

### T-PLAN-03: Missing Feature Description
**Setup**: Workspace `scratch/test-suite/workspaces/plan-missing-desc/`
**Scripted Inputs**: request="" (empty)

**Steps**:
1. **Pre-execution gate**: feature_description=0/30, spec_path_valid=30, etc. Total=70/100.
2. **Expected Behavior**: Pre-execution gate score=70, exactly at threshold. If feature_description is truly empty (0 points), total=70. Actually with 0 for feature_description: 0+30+20+20=70 which equals threshold, so PASS barely. But per the YAML the check requires feature_description to have content. Evaluate as: gate passes but Step 1 blocks asking for feature description.
3. **Verify**: Q0 presented asking for feature description. Workflow blocked until answered.

## Return Format

Return a JSON array with one result object per test:

```json
[
  {
    "command": "plan",
    "test_id": "T-PLAN-01",
    "test_name": "Happy path :auto",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Request Analysis", "status": "PASS", "outputs": ["requirement_summary", "confidence_85"] },
      { "step": 2, "name": "Pre-Work Review", "status": "PASS", "outputs": ["coding_standards"] },
      { "step": 3, "name": "Specification", "status": "PASS", "outputs": ["spec.md"] },
      { "step": 4, "name": "Clarification", "status": "PASS", "outputs": ["no_markers_found"] },
      { "step": 5, "name": "Planning", "status": "PASS", "outputs": ["plan.md", "tasks.md"] },
      { "step": 6, "name": "Save Context", "status": "PASS", "outputs": ["memory_file"] },
      { "step": 7, "name": "Handover Check", "status": "PASS", "outputs": ["declined"] }
    ],
    "artifacts_created": ["spec.md", "plan.md", "tasks.md", "memory/14-02-26_10-30__planning_session.md"],
    "quality_gates": { "pre": "PASS (100/70)", "post": "PASS (100/70)" },
    "agent_routes_verified": ["@speckit->step_3", "@research->step_5(conditional)", "@handover->step_7"],
    "errors": []
  },
  {
    "command": "plan",
    "test_id": "T-PLAN-02",
    "test_name": "Low confidence",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Request Analysis", "status": "BLOCKED", "outputs": ["confidence_30_clarification_needed"] }
    ],
    "artifacts_created": [],
    "quality_gates": { "pre": "PASS (70/70)" },
    "agent_routes_verified": [],
    "errors": [],
    "expected_behavior_verified": "workflow_pauses_for_clarification"
  },
  {
    "command": "plan",
    "test_id": "T-PLAN-03",
    "test_name": "Missing feature description",
    "overall_status": "PASS",
    "steps": [
      { "step": 0, "name": "Setup Phase", "status": "BLOCKED", "outputs": ["q0_required"] }
    ],
    "artifacts_created": [],
    "quality_gates": { "pre": "BLOCKED (70/70 - feature_description=0)" },
    "agent_routes_verified": [],
    "errors": [],
    "expected_behavior_verified": "q0_blocks_until_answered"
  }
]
```

## Execution Instructions

1. Read the YAML at `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`
2. For T-PLAN-01: Create workspace, walk through all 7 steps creating real files
3. For T-PLAN-02 and T-PLAN-03: Create workspace, verify blocking behavior
4. Return the JSON results array
