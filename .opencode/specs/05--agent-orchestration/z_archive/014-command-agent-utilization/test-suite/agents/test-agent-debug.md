# Test Agent: /spec_kit:debug

## Purpose
Simulate the 5-step debug delegation workflow for test verification.

## Simulation Rules

CRITICAL -- follow these rules exactly:

1. DO NOT call MCP tools -- log as `SIMULATED: memory_context({...}) -> no prior work`
2. DO NOT dispatch actual sub-agents -- when YAML says "dispatch @debug", read the template, fill it, write it, log `SIMULATED: @debug -> debug-delegation.md created`
3. DO NOT run generate-context.js -- create a sample memory file directly
4. DO create real files in the workspace using L2 templates
5. DO fill all template placeholders with realistic test data
6. DO evaluate quality gates by checking file existence and content completeness
7. DO verify agent routing config in YAML matches expectations

## Tests to Execute

### T-DBG-01: Happy Path :auto
**Setup**: Copy fixtures/base-spec-folder/ to `scratch/test-suite/workspaces/debug-happy/`
**Scripted Inputs**: Error="TypeError in jwt.service.ts:45", affected_files=[jwt.service.ts, auth.middleware.ts]

**Steps**:
1. **Step 1 - Validate Context**: Verify spec_path exists, error_message present, affected_files listed. All present. Log: "Context validated: spec_path=specs/042-jwt-authentication, error=TypeError, files=2"
2. **Step 2 - Generate Report**: Read debug-delegation.md template. Fill with:
   - task_id: debug-20260214-1100
   - error_category: type_error
   - error_message: "TypeError: Cannot read properties of undefined (reading 'sign') at JwtService.generateToken (jwt.service.ts:45)"
   - affected_files: jwt.service.ts (line 45), auth.middleware.ts (line 23)
   - previous_attempts: [
       "Attempt 1: Added null check - still fails",
       "Attempt 2: Imported jsonwebtoken directly - type mismatch",
       "Attempt 3: Wrapped in try/catch - error persists"
     ]
   Write debug-delegation.md to workspace. Log: `SIMULATED: @speckit -> debug-delegation.md created`
3. **Step 3 - Dispatch Sub-agent**: SIMULATED: Task tool dispatched with @debug agent prompt. Log full prompt text. SIMULATED response:
   - root_cause: "JwtService not injected via constructor. The `sign` method is called on an undefined instance because the service was instantiated with `new JwtService()` instead of dependency injection."
   - proposed_fix: "Add @Injectable() decorator to JwtService class and inject via constructor in AuthMiddleware: `constructor(private readonly jwtService: JwtService)`"
   - verification: "Run `npm test -- --testPathPattern=jwt` and verify all 6 JWT-related tests pass. Check auth.middleware.spec.ts specifically."
   Log: `SIMULATED: @debug -> root_cause identified, fix proposed`
4. **Step 4 - Receive Findings**: Extract root_cause, proposed_fix, verification_steps from simulated response. Validate all 3 fields present and non-empty.
5. **Step 5 - Integration**: Scripted choice="A" (apply fix). SIMULATED: Fix applied to jwt.service.ts and auth.middleware.ts. Update debug-delegation.md with RESOLUTION section:
   - STATUS: RESOLVED
   - FIX_APPLIED: "@Injectable() decorator + constructor injection"
   - VERIFIED: "6/6 JWT tests pass"
   - TIMESTAMP: 2026-02-14T11:15:00Z
   Log: `SIMULATED: Fix applied, STATUS=RESOLVED`

**Quality Gates**:
- Pre-execution: error_message_present(30) + spec_path_valid(30) + affected_files_listed(20) + context_sufficient(20) = 100/70 PASS
- Post-execution: report_generated(25) + root_cause_identified(25) + fix_applied(25) + resolution_documented(25) = 100/70 PASS

**Assertions**:
- [ ] debug-delegation.md exists with all 5 sections filled (context, error_analysis, previous_attempts, delegation, resolution)
- [ ] RESOLUTION section added with STATUS=RESOLVED
- [ ] No [YOUR_VALUE_HERE] placeholders remaining
- [ ] Error category correctly classified as "type_error"
- [ ] 3 previous attempts documented
- [ ] Root cause, proposed fix, and verification steps all present

**Verify Agent Routing**:
- report_generation: step=2, agent=@speckit (template filling)
- debug_dispatch: step=3, agent=@debug (sub-agent via Task tool)
- post_fix_review: step=5, agent=@review, advisory=true (non-blocking review)

### T-DBG-02: Escalation
**Setup**: Create workspace at `scratch/test-suite/workspaces/debug-escalation/`
**Scripted Inputs**: Error="Segmentation fault in native module binding", affected_files=[native-binding.cc]

**Steps**:
1. **Step 1 - Validate Context**: Context validated. error_category=native_crash
2. **Step 2 - Generate Report**: Fill debug-delegation.md with native crash details and 3 previous attempts (all failed)
3. **Step 3 - Dispatch Sub-agent**: SIMULATED: @debug agent returns escalation response:
   - status: "ESCALATE"
   - reason: "Native module crash requires platform-specific debugging tools (gdb/lldb) not available in current environment. Root cause likely in V8 binding layer."
   - suggested_actions: ["Use gdb to inspect core dump", "Check Node.js addon API version compatibility", "Review native-binding.cc memory management"]
4. **Step 4 - Receive Findings**: Escalation detected. STATUS=ESCALATE.
5. **Step 5 - Integration**: Escalation flow triggered. Present fallback options:
   - A) Retry with different approach (re-dispatch @debug with expanded context)
   - B) Manual investigation (provide debug guide)
   - C) Escalate to different model (Claude with extended thinking)
   - D) Cancel and document as known issue
   Scripted choice="D" (cancel). Update debug-delegation.md: STATUS=ESCALATED, DISPOSITION=KNOWN_ISSUE.

**Quality Gates**:
- Pre-execution: 100/70 PASS
- Post-execution: report_generated(25) + escalation_documented(25) + fallback_presented(25) + disposition_recorded(25) = 100/70 PASS

**Assertions**:
- [ ] debug-delegation.md exists with STATUS=ESCALATED
- [ ] Escalation reason documented
- [ ] Fallback options A/B/C/D presented
- [ ] DISPOSITION=KNOWN_ISSUE recorded
- [ ] No unhandled error state (graceful escalation)

## Return Format

Return a JSON array with one result object per test:

```json
[
  {
    "command": "debug",
    "test_id": "T-DBG-01",
    "test_name": "Happy path :auto",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Validate Context", "status": "PASS", "outputs": ["context_valid"] },
      { "step": 2, "name": "Generate Report", "status": "PASS", "outputs": ["debug-delegation.md"] },
      { "step": 3, "name": "Dispatch Sub-agent", "status": "PASS", "outputs": ["root_cause", "proposed_fix", "verification"] },
      { "step": 4, "name": "Receive Findings", "status": "PASS", "outputs": ["3_fields_extracted"] },
      { "step": 5, "name": "Integration", "status": "PASS", "outputs": ["fix_applied", "STATUS_RESOLVED"] }
    ],
    "artifacts_created": ["debug-delegation.md"],
    "quality_gates": { "pre": "PASS (100/70)", "post": "PASS (100/70)" },
    "agent_routes_verified": ["@speckit->step_2", "@debug->step_3", "@review->step_5(advisory)"],
    "errors": []
  },
  {
    "command": "debug",
    "test_id": "T-DBG-02",
    "test_name": "Escalation",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Validate Context", "status": "PASS", "outputs": ["context_valid"] },
      { "step": 2, "name": "Generate Report", "status": "PASS", "outputs": ["debug-delegation.md"] },
      { "step": 3, "name": "Dispatch Sub-agent", "status": "PASS", "outputs": ["ESCALATE"] },
      { "step": 4, "name": "Receive Findings", "status": "PASS", "outputs": ["escalation_detected"] },
      { "step": 5, "name": "Integration", "status": "PASS", "outputs": ["STATUS_ESCALATED", "DISPOSITION_KNOWN_ISSUE"] }
    ],
    "artifacts_created": ["debug-delegation.md"],
    "quality_gates": { "pre": "PASS (100/70)", "post": "PASS (100/70)" },
    "agent_routes_verified": ["@speckit->step_2", "@debug->step_3(escalated)", "@review->step_5(not_triggered)"],
    "errors": [],
    "expected_behavior_verified": "graceful_escalation_with_fallback_options"
  }
]
```

## Execution Instructions

1. Read the YAML at `.opencode/command/spec_kit/assets/spec_kit_debug_auto.yaml`
2. For T-DBG-01: Copy fixtures, walk through all 5 steps, create debug-delegation.md with resolution
3. For T-DBG-02: Create workspace, simulate escalation flow, verify graceful handling
4. Return the JSON results array
