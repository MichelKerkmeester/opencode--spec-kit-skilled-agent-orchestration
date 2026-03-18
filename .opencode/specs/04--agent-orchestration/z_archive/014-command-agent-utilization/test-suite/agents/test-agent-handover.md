# Test Agent: /spec_kit:handover

## Purpose
Simulate the handover workflow for test verification.

## Simulation Rules

CRITICAL -- follow these rules exactly:

1. DO NOT call MCP tools -- log as `SIMULATED: memory_context({...}) -> no prior work`
2. DO NOT dispatch actual sub-agents -- when YAML says "dispatch", log `SIMULATED: dispatch skipped`
3. DO NOT run generate-context.js -- create a sample memory file directly
4. DO create real files in the workspace using L2 templates
5. DO fill all template placeholders with realistic test data
6. DO evaluate quality gates by checking file existence and content completeness
7. DO verify agent routing config in YAML matches expectations

## Tests to Execute

### T-HND-01: Happy Path
**Setup**: Copy fixtures/base-spec-folder/ to `scratch/test-suite/workspaces/handover-happy/`. Mark T001-T004 as [x] in tasks.md.

**Steps**:
1. **Analyze Context**: Read conversation history (simulated). Determine current phase=IMPLEMENTATION, progress=4/14 tasks done. Identify spec_folder path. Log: "Context analyzed: phase=IMPLEMENTATION, 4/14 tasks, spec=specs/042-jwt-authentication"
2. **Extract Work**: Parse tasks.md for completed and pending items:
   - Completed (4): T001 (Project setup), T002 (Database schema), T003 (JwtService class), T004 (Token generation)
   - Pending (10): T005-T014 (Token validation, middleware, guards, refresh tokens, key rotation, tests, integration, docs, error handling, monitoring)
   - Key decisions: RS256 algorithm chosen over HS256 for production security
   - Blockers: None currently
3. **Generate Handover**: Read handover template. Fill all 7 sections with test data:
   - **Section 1 - Session Summary**: Date, duration, phase, overall status
   - **Section 2 - Current State**: Active file, current task (T005), last action
   - **Section 3 - Completed Work**: T001-T004 details with file paths
   - **Section 4 - Pending Work**: T005-T014 with priority order
   - **Section 5 - Key Decisions**: RS256 choice, DI pattern, error handling strategy
   - **Section 6 - Blockers & Risks**: No blockers, risk=key rotation complexity
   - **Section 7 - Continuation**: Resume command, next steps, estimated remaining effort
4. **Write File**: Create handover.md in workspace. Verify no [YOUR_VALUE_HERE] placeholders. Verify all 7 sections present.

**Quality Gates**:
- Post-execution: handover_file_created(40) + no_placeholder_text(30) + json_response_valid(30) = 100/70 PASS

**Assertions**:
- [ ] handover.md exists with all 7 sections (session_summary, current_state, completed_work, pending_work, key_decisions, blockers_risks, continuation)
- [ ] No [YOUR_VALUE_HERE] or {{ placeholders
- [ ] Progress shows 4/14 tasks (29%)
- [ ] Next action is specific (file:line reference, e.g., "jwt.service.ts:validate() method")
- [ ] Resume command includes spec folder path: `/spec_kit:resume specs/042-jwt-authentication`
- [ ] Attempt number = 1

**Verify from YAML**:
- output_structure: 7 sections (session_summary, current_state, completed_work, pending_work, key_decisions, blockers_risks, continuation)
- quality_gates: post checks handover_file_created(40) + no_placeholder_text(30) + json_response_valid(30)

### T-HND-02: No Spec Folder
**Setup**: Create empty workspace at `scratch/test-suite/workspaces/handover-no-spec/`
No spec.md, no plan.md, no tasks.md.

**Steps**:
1. **Analyze Context**: Attempt to determine current phase. No spec folder found. No tasks.md. No conversation history with spec_kit commands.
2. **Expected Behavior**: "No active session" message. Cannot generate handover without a spec folder context.
3. **Verify**: Display message: "No active spec_kit session detected. A handover requires an active planning or implementation session."

**Quality Gates**:
- Post-execution: handover_file_created(0) + no_placeholder_text(30) + json_response_valid(30) = 60/70 FAIL

**Assertions**:
- [ ] No handover.md created
- [ ] "No active session" message displayed
- [ ] No crash or unhandled error (graceful failure)
- [ ] Post-execution gate correctly fails (60/70 < 70 threshold)

### T-HND-03: Increment Attempt
**Setup**: Copy fixtures/base-spec-folder/ to `scratch/test-suite/workspaces/handover-increment/`. Ensure existing handover.md contains "Attempt: 1".

**Steps**:
1. **Analyze Context**: Read existing handover.md. Detect previous attempt: "Attempt: 1". Current phase=IMPLEMENTATION, progress=4/14.
2. **Extract Work**: Same as T-HND-01 (4/14 tasks done, same completed/pending split).
3. **Generate Handover**: Create NEW handover.md (overwrite existing). All 7 sections filled. Increment attempt: "Attempt: 2" (or "Attempt 2" in header).
4. **Write File**: Write handover.md. Verify attempt number incremented.

**Quality Gates**:
- Post-execution: handover_file_created(40) + no_placeholder_text(30) + json_response_valid(30) = 100/70 PASS

**Assertions**:
- [ ] handover.md exists with "Attempt: 2" (incremented from 1)
- [ ] All 7 sections still complete (not just attempt number changed)
- [ ] No [YOUR_VALUE_HERE] placeholders
- [ ] Previous handover content not lost (overwritten with fresh, complete content)
- [ ] Timestamp updated to current session time

## Return Format

Return a JSON array with one result object per test:

```json
[
  {
    "command": "handover",
    "test_id": "T-HND-01",
    "test_name": "Happy path",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Analyze Context", "status": "PASS", "outputs": ["phase=IMPLEMENTATION", "4_of_14_tasks"] },
      { "step": 2, "name": "Extract Work", "status": "PASS", "outputs": ["completed_T001-T004", "pending_T005-T014"] },
      { "step": 3, "name": "Generate Handover", "status": "PASS", "outputs": ["7_sections_filled"] },
      { "step": 4, "name": "Write File", "status": "PASS", "outputs": ["handover.md_created"] }
    ],
    "artifacts_created": ["handover.md"],
    "quality_gates": { "post": "PASS (100/70)" },
    "agent_routes_verified": [],
    "errors": [],
    "handover_verified": {
      "sections_count": 7,
      "placeholders_remaining": 0,
      "progress": "4/14 (29%)",
      "attempt": 1,
      "resume_command": "/spec_kit:resume specs/042-jwt-authentication"
    }
  },
  {
    "command": "handover",
    "test_id": "T-HND-02",
    "test_name": "No spec folder",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Analyze Context", "status": "FAIL", "outputs": ["no_active_session"] }
    ],
    "artifacts_created": [],
    "quality_gates": { "post": "FAIL (60/70)" },
    "agent_routes_verified": [],
    "errors": [],
    "expected_behavior_verified": "no_session_graceful_message"
  },
  {
    "command": "handover",
    "test_id": "T-HND-03",
    "test_name": "Increment attempt",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Analyze Context", "status": "PASS", "outputs": ["previous_attempt_1_detected"] },
      { "step": 2, "name": "Extract Work", "status": "PASS", "outputs": ["completed_T001-T004", "pending_T005-T014"] },
      { "step": 3, "name": "Generate Handover", "status": "PASS", "outputs": ["7_sections_filled", "attempt_incremented"] },
      { "step": 4, "name": "Write File", "status": "PASS", "outputs": ["handover.md_overwritten"] }
    ],
    "artifacts_created": ["handover.md (overwritten)"],
    "quality_gates": { "post": "PASS (100/70)" },
    "agent_routes_verified": [],
    "errors": [],
    "handover_verified": {
      "sections_count": 7,
      "placeholders_remaining": 0,
      "progress": "4/14 (29%)",
      "attempt": 2,
      "resume_command": "/spec_kit:resume specs/042-jwt-authentication"
    }
  }
]
```

## Execution Instructions

1. Read the handover workflow definition (check for YAML or markdown command file)
2. For T-HND-01: Copy fixtures, mark 4 tasks done, generate complete handover.md
3. For T-HND-02: Create empty workspace, verify graceful no-session handling
4. For T-HND-03: Copy fixtures with existing handover.md (Attempt: 1), verify increment to Attempt: 2
5. Return the JSON results array
