# Test Agent: /spec_kit:resume

## Purpose
Simulate the 4-step resume workflow for test verification.

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

### T-RSM-01: Happy Path :auto
**Setup**: Copy fixtures/base-spec-folder/ to `scratch/test-suite/workspaces/resume-happy/` (includes handover.md)

**Steps**:
1. **Step 1 - Session Detection**: CLI argument spec_folder provided. Path validated: `scratch/test-suite/workspaces/resume-happy/` exists. detection_method="argument". Log: "Session detected via CLI argument"
2. **Step 2 - Load Memory**: Scan workspace for context files in priority order:
   - handover.md: EXISTS, age < 24h -> load as PRIMARY context
   - CONTINUE_SESSION.md: not found
   - checklist.md: EXISTS -> load as secondary
   - memory/*.md: scan for recent files
   Extract from handover.md: phase=PLANNING(complete), next_action="/spec_kit:implement", spec_folder="specs/042-jwt-authentication", attempt=1
   Log: "Context loaded: handover.md (primary), checklist.md (secondary)"
3. **Step 3 - Calculate Progress**: Parse artifacts:
   - tasks.md: 0/14 tasks complete = 0%
   - checklist.md: 0/18 items verified = 0%
   - Phase: PLANNING complete, IMPLEMENTATION not started
   Log: "Progress: 0% tasks, 0% checklist, phase=post-planning"
4. **Step 4 - Present Resume**: Display formatted summary:
   ```
   SESSION RESUMED
   Spec:     specs/042-jwt-authentication
   Context:  handover.md (< 24h)
   Phase:    PLANNING complete -> IMPLEMENTATION pending
   Progress: 0% (0/14 tasks, 0/18 checklist items)
   Next:     /spec_kit:implement
   Attempt:  1
   ```

**Quality Gates**:
- Session detection: spec_folder_valid(40) + context_files_found(30) + session_age_valid(30) = 100/70 PASS

**Assertions**:
- [ ] Session detected correctly via CLI argument
- [ ] handover.md loaded as primary context source (not CONTINUE_SESSION.md or memory files)
- [ ] Progress calculated as 0% (all tasks pending)
- [ ] Resume summary displayed with correct format (all 6 fields present)
- [ ] Next action correctly identified as /spec_kit:implement
- [ ] Attempt number = 1 (from handover.md)

**Verify from YAML**:
- session_detection: priority_order matches ["CLI argument", "Semantic memory", "Trigger phrases", "Recent memory by mtime"]
- context_loading_priority: ["handover.md (<24h)", "CONTINUE_SESSION.md", "checklist.md", "memory/*.md"]
- stale_session_detection: check=">7 days"

### T-RSM-02: No Active Session
**Setup**: Create empty workspace at `scratch/test-suite/workspaces/resume-no-session/`
No memory files, no handover.md, no spec.md, no plan.md.

**Steps**:
1. **Step 1 - Session Detection**: CLI argument spec_folder provided but workspace is empty. No detection signals.
   - CLI argument: path exists but no spec files
   - Semantic memory: SIMULATED: memory_context({...}) -> no prior work
   - Trigger phrases: none
   - Recent memory by mtime: no memory/ directory
2. **Expected Behavior**: "No active session detected" message displayed.
3. **Suggestion**: Display: "No active session found. Start a new session with /spec_kit:complete or /spec_kit:plan"

**Quality Gates**:
- Session detection: spec_folder_valid(0) + context_files_found(0) + session_age_valid(0) = 0/70 FAIL (expected)

**Assertions**:
- [ ] "No active session detected" message displayed
- [ ] Suggestion to use /spec_kit:complete or /spec_kit:plan provided
- [ ] No crash or unhandled error
- [ ] No files created in workspace

### T-RSM-03: Stale Session
**Setup**: Copy fixtures/base-spec-folder/ to `scratch/test-suite/workspaces/resume-stale/`
Modify handover.md timestamp to 10 days ago (2026-02-04).

**Steps**:
1. **Step 1 - Session Detection**: CLI argument valid. handover.md found.
2. **Step 2 - Load Memory**: handover.md found but timestamp is 10 days old (> 7 day stale threshold).
3. **Expected Behavior**: Stale session warning displayed:
   ```
   WARNING: Session is stale (10 days old, threshold: 7 days)

   Options:
   A) Resume anyway (context may be outdated)
   B) Fresh start (/spec_kit:complete)
   C) Review changes since last session
   D) Cancel
   ```
4. **Scripted choice**: "A" (resume anyway)
5. **Step 3-4**: Continue with normal resume flow but with stale warning flag set.

**Quality Gates**:
- Session detection: spec_folder_valid(40) + context_files_found(30) + session_age_valid(0) = 70/70 BORDERLINE
- Stale detection: session_age > 7 days -> WARNING triggered

**Assertions**:
- [ ] Stale warning displayed with correct age (10 days)
- [ ] 4 options (A/B/C/D) presented
- [ ] Option A proceeds with resume
- [ ] Stale flag included in resume summary
- [ ] Progress still calculated correctly despite stale context

## Return Format

Return a JSON array with one result object per test:

```json
[
  {
    "command": "resume",
    "test_id": "T-RSM-01",
    "test_name": "Happy path :auto",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Session Detection", "status": "PASS", "outputs": ["detection_method=argument"] },
      { "step": 2, "name": "Load Memory", "status": "PASS", "outputs": ["handover.md_primary", "checklist.md_secondary"] },
      { "step": 3, "name": "Calculate Progress", "status": "PASS", "outputs": ["0_percent_tasks", "0_percent_checklist"] },
      { "step": 4, "name": "Present Resume", "status": "PASS", "outputs": ["summary_displayed"] }
    ],
    "artifacts_created": [],
    "quality_gates": { "session": "PASS (100/70)" },
    "agent_routes_verified": [],
    "errors": [],
    "session_detection_verified": {
      "method": "CLI argument",
      "priority_order_correct": true,
      "context_source": "handover.md",
      "next_action": "/spec_kit:implement"
    }
  },
  {
    "command": "resume",
    "test_id": "T-RSM-02",
    "test_name": "No active session",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Session Detection", "status": "FAIL", "outputs": ["no_session_detected"] }
    ],
    "artifacts_created": [],
    "quality_gates": { "session": "FAIL (0/70)" },
    "agent_routes_verified": [],
    "errors": [],
    "expected_behavior_verified": "no_session_message_with_suggestion"
  },
  {
    "command": "resume",
    "test_id": "T-RSM-03",
    "test_name": "Stale session",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Session Detection", "status": "PASS", "outputs": ["detection_method=argument"] },
      { "step": 2, "name": "Load Memory", "status": "WARN", "outputs": ["handover.md_stale_10_days"] },
      { "step": 3, "name": "Calculate Progress", "status": "PASS", "outputs": ["0_percent_tasks"] },
      { "step": 4, "name": "Present Resume", "status": "PASS", "outputs": ["summary_with_stale_warning"] }
    ],
    "artifacts_created": [],
    "quality_gates": { "session": "BORDERLINE (70/70)" },
    "agent_routes_verified": [],
    "errors": [],
    "expected_behavior_verified": "stale_warning_with_4_options_resume_chosen"
  }
]
```

## Execution Instructions

1. Read the YAML at `.opencode/command/spec_kit/resume.md` (resume uses markdown, not YAML)
2. For T-RSM-01: Copy fixtures, walk through all 4 steps, verify context loading priority
3. For T-RSM-02: Create empty workspace, verify no-session handling
4. For T-RSM-03: Copy fixtures with stale handover.md, verify stale detection
5. Return the JSON results array
