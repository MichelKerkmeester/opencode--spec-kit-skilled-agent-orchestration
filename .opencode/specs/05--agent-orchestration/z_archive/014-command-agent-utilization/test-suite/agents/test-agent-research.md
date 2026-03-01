# Test Agent: /spec_kit:research

## Purpose
Simulate the 9-step research workflow for test verification.

## Simulation Rules

CRITICAL -- follow these rules exactly:

1. DO NOT call MCP tools -- log as `SIMULATED: memory_context({...}) -> no prior work`
2. DO NOT dispatch actual sub-agents -- when YAML says "dispatch @research", read the template, fill it, write it, log `SIMULATED: @research -> research.md created`
3. DO NOT run generate-context.js -- create a sample memory file directly
4. DO create real files in the workspace using L2 templates
5. DO fill all template placeholders with realistic test data
6. DO evaluate quality gates by checking file existence and content completeness
7. DO verify agent routing config in YAML matches expectations

## Tests to Execute

### T-RES-01: Happy Path :auto
**Setup**: Create workspace at `scratch/test-suite/workspaces/research-happy/`
**Scripted Inputs**: Topic="WebSocket-based real-time collaboration patterns for document editing"

**Steps**:
1. **Step 1 - Request Analysis**: Define research scope. Key questions: (1) What WebSocket libraries suit real-time collab? (2) How to handle conflict resolution (OT vs CRDT)? (3) What are scaling patterns for WebSocket connections?
2. **Step 2 - Pre-Work Review**: SIMULATED: Read AGENTS.md and coding standards. Log: "Standards: TypeScript, NestJS, 80% test coverage"
3. **Step 3 - Codebase Investigation**: SIMULATED: @context agents dispatched (4 agents). Findings: no existing WebSocket code found. Existing patterns: REST controllers, TypeORM entities, JWT auth middleware. Log: `SIMULATED: @context x4 -> no WebSocket code, REST patterns found`
4. **Step 4 - External Research**: SIMULATED: WebSearch for WebSocket patterns. Document findings:
   - Socket.IO vs ws vs uWebSockets performance comparison
   - CRDT (Yjs, Automerge) vs OT (ShareDB) for conflict resolution
   - Redis pub/sub for horizontal scaling
   - Heartbeat/reconnection strategies
   Log: `SIMULATED: WebSearch -> 4 research areas documented`
5. **Step 5 - Technical Analysis**: Feasibility=HIGH. Performance analysis: ws library handles 50k concurrent connections per node. Risk assessment: CRDT complexity (medium), scaling beyond 10k users (high). Trade-offs documented.
6. **Step 5.5 - Checkpoint**: SIMULATED: Save analysis checkpoint. Log: `SIMULATED: generate-context.js -> checkpoint saved`
7. **Step 6 - Quality Checklist**: Create checklist.md for research quality. Items: scope_defined, questions_answered, codebase_reviewed, external_sources_cited, feasibility_assessed, risks_documented, recommendation_provided.
8. **Step 7 - Solution Design**: Architecture recommendation: NestJS WebSocket gateway + Redis adapter + Yjs CRDT. 3-phase rollout: (1) basic WebSocket, (2) CRDT integration, (3) scaling infrastructure.
9. **Step 8 - Research Compilation**: Read research.md template. Fill ALL 17 sections with realistic content. Write to workspace as `research.md`.
10. **Step 9 - Save Context**: SIMULATED: generate-context.js -> memory file. Write `memory/14-02-26_13-00__research_session.md` with ANCHOR tags.

**Quality Gates**:
- Pre-execution: topic_defined(30) + scope_clear(30) + no_blocking_deps(20) + execution_mode_set(20) = 100/70 PASS
- Post-execution: research_exists(30) + all_sections_filled(25) + no_placeholders(25) + context_saved(20) = 100/70 PASS

**Assertions**:
- [ ] research.md exists with all 17 sections: metadata, investigation_report, executive_overview, core_architecture, technical_specifications, constraints_limitations, integration_patterns, implementation_guide, code_examples, testing_debugging, performance, security, maintenance, api_reference, troubleshooting, acknowledgements, appendix_changelog
- [ ] No [YOUR_VALUE_HERE] or [PLACEHOLDER] markers in research.md
- [ ] Memory file exists with ANCHOR tags
- [ ] Quality gates: pre=PASS, post=PASS
- [ ] checklist.md exists with all items checked

**Verify Agent Routing**:
- research_phase: steps=[3,4,5,6,7], agent=@research (self-contained research workflow)
- context_investigation: step=3, agent=@context, count=4
- handover_phase: step=9, agent=@handover

### T-RES-02: Empty Codebase
**Setup**: Create workspace at `scratch/test-suite/workspaces/research-empty-codebase/`
**Scripted Inputs**: Topic="GraphQL API layer for microservices communication"

**Steps**:
1. **Steps 1-2**: Normal setup.
2. **Step 3 - Codebase Investigation**: SIMULATED: @context agents find zero files. No patterns, no dependencies, no existing architecture. Log: `SIMULATED: @context x4 -> empty codebase, no patterns`
3. **Steps 4-8**: Continue normally, but codebase-dependent sections in research.md note "Greenfield project -- no existing patterns to integrate with"
4. **Step 8 - Research Compilation**: research.md created. Codebase sections filled with greenfield notes instead of N/A.
5. **Step 9**: Save context.

**Quality Gates**:
- Pre-execution: 100/70 PASS
- Post-execution: research_exists(30) + all_sections_filled(25) + no_placeholders(25) + context_saved(20) = 100/70 PASS

**Assertions**:
- [ ] research.md exists and is complete (no missing sections)
- [ ] Codebase-dependent sections filled with greenfield documentation (not empty or N/A)
- [ ] integration_patterns section notes "no existing codebase to integrate with"
- [ ] Recommendation still provided (not blocked by empty codebase)

## Return Format

Return a JSON array with one result object per test:

```json
[
  {
    "command": "research",
    "test_id": "T-RES-01",
    "test_name": "Happy path :auto",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Request Analysis", "status": "PASS", "outputs": ["scope_defined", "3_key_questions"] },
      { "step": 2, "name": "Pre-Work Review", "status": "PASS", "outputs": ["standards_loaded"] },
      { "step": 3, "name": "Codebase Investigation", "status": "PASS", "outputs": ["no_websocket_code", "rest_patterns_found"] },
      { "step": 4, "name": "External Research", "status": "PASS", "outputs": ["4_research_areas"] },
      { "step": 5, "name": "Technical Analysis", "status": "PASS", "outputs": ["feasibility_high", "risks_documented"] },
      { "step": "5.5", "name": "Checkpoint", "status": "PASS", "outputs": ["checkpoint_saved"] },
      { "step": 6, "name": "Quality Checklist", "status": "PASS", "outputs": ["checklist.md"] },
      { "step": 7, "name": "Solution Design", "status": "PASS", "outputs": ["architecture_recommendation"] },
      { "step": 8, "name": "Research Compilation", "status": "PASS", "outputs": ["research.md"] },
      { "step": 9, "name": "Save Context", "status": "PASS", "outputs": ["memory_file"] }
    ],
    "artifacts_created": ["research.md", "checklist.md", "memory/14-02-26_13-00__research_session.md"],
    "quality_gates": { "pre": "PASS (100/70)", "post": "PASS (100/70)" },
    "agent_routes_verified": ["@context->step_3(x4)", "@research->steps_3-7", "@handover->step_9"],
    "errors": [],
    "research_sections_verified": 17
  },
  {
    "command": "research",
    "test_id": "T-RES-02",
    "test_name": "Empty codebase",
    "overall_status": "PASS",
    "steps": [
      { "step": 1, "name": "Request Analysis", "status": "PASS", "outputs": ["scope_defined"] },
      { "step": 2, "name": "Pre-Work Review", "status": "PASS", "outputs": ["standards_loaded"] },
      { "step": 3, "name": "Codebase Investigation", "status": "PASS", "outputs": ["empty_codebase_documented"] },
      { "step": 4, "name": "External Research", "status": "PASS", "outputs": ["research_areas_documented"] },
      { "step": 5, "name": "Technical Analysis", "status": "PASS", "outputs": ["feasibility_assessed"] },
      { "step": "5.5", "name": "Checkpoint", "status": "PASS", "outputs": ["checkpoint_saved"] },
      { "step": 6, "name": "Quality Checklist", "status": "PASS", "outputs": ["checklist.md"] },
      { "step": 7, "name": "Solution Design", "status": "PASS", "outputs": ["greenfield_architecture"] },
      { "step": 8, "name": "Research Compilation", "status": "PASS", "outputs": ["research.md_with_greenfield_notes"] },
      { "step": 9, "name": "Save Context", "status": "PASS", "outputs": ["memory_file"] }
    ],
    "artifacts_created": ["research.md", "checklist.md", "memory/14-02-26_13-30__research_session.md"],
    "quality_gates": { "pre": "PASS (100/70)", "post": "PASS (100/70)" },
    "agent_routes_verified": ["@context->step_3(x4)", "@research->steps_3-7", "@handover->step_9"],
    "errors": [],
    "research_sections_verified": 17,
    "expected_behavior_verified": "greenfield_sections_documented_not_empty"
  }
]
```

## Execution Instructions

1. Read the YAML at `.opencode/command/spec_kit/assets/spec_kit_research_auto.yaml`
2. For T-RES-01: Create workspace, walk through all 9 steps creating real files with full content
3. For T-RES-02: Create workspace with empty codebase context, verify greenfield handling
4. Return the JSON results array
