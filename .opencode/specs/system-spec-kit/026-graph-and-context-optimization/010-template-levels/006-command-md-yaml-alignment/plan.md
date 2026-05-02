---
title: "Implementation Plan: command-md-yaml-alignment"
description: "Three-phase audit plan for spec_kit command Markdown files, YAML workflow assets, and verification gates."
trigger_phrases:
  - "command md yaml plan"
  - "workflow yaml audit plan"
  - "template levels packet 006 plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/006-command-md-yaml-alignment"
    last_updated_at: "2026-05-02T06:53:47Z"
    last_updated_by: "codex"
    recent_action: "Authored packet plan for command Markdown and YAML alignment audit"
    next_safe_action: "Run inventory grep and begin command Markdown sweep"
    blockers: []
    key_files:
      - ".opencode/command/spec_kit/"
    session_dedup:
      fingerprint: "sha256:0060060060060060060060060060060060060060060060060060060060060001"
      session_id: "2026-05-02-006-command-md-yaml-alignment"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: command-md-yaml-alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, shell validation, Node/Vitest |
| **Framework** | Spec Kit command workflow assets |
| **Storage** | File-system packet docs and command assets |
| **Testing** | `rg`, PyYAML parse checks, workflow-invariance vitest, strict spec validation |

### Overview
Audit the command entry docs first, then the YAML workflow assets, then add current feature mentions where the command behavior needs them. The work is surgical: preserve command structure and YAML step ordering while removing stale references and validating every edited asset.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 answered as new spec folder at this packet path.
- [x] Level 3 packet scaffolded with `create.sh`.
- [x] In-scope files and out-of-scope exclusions documented.

### Definition of Done
- [ ] Stale-pattern grep returns zero hits across `.opencode/command/spec_kit/`.
- [ ] Workflow-invariance vitest passes.
- [ ] All 12 command YAML assets parse cleanly.
- [ ] 006 packet validates in strict mode.
- [ ] Sibling packets 003, 004, and 005 validate in strict mode.
- [ ] Checklist and implementation summary include evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded documentation and workflow-asset audit.

### Key Components
- **Command Markdown**: user-facing slash-command instructions and mode descriptions.
- **YAML workflow assets**: runtime workflow definitions for auto and confirm command execution.
- **Validation gates**: grep, YAML parsing, workflow invariance, and spec validation.

### Data Flow
Inventory grep identifies candidate stale or banned terms. Each hit is classified from surrounding context, patched only when stale, then revalidated through syntax and workflow gates.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Command Markdown Sweep
- [ ] Audit `.opencode/command/spec_kit/complete.md`.
- [ ] Audit `.opencode/command/spec_kit/deep-research.md`.
- [ ] Audit `.opencode/command/spec_kit/deep-review.md`.
- [ ] Audit `.opencode/command/spec_kit/implement.md`.
- [ ] Audit `.opencode/command/spec_kit/plan.md`.
- [ ] Audit `.opencode/command/spec_kit/resume.md`.

### Phase 2: YAML Asset Sweep
- [ ] Audit 6 `_auto.yaml` files.
- [ ] Audit 6 `_confirm.yaml` files.
- [ ] Parse every edited YAML file immediately.
- [ ] Preserve step IDs, structure, and ordering.

### Phase 3: Current Behavior Notes and Verification
- [ ] Add exit-code taxonomy mentions where validation semantics are documented.
- [ ] Add `SPECKIT_POST_VALIDATE` mention where post-create validation behavior is documented.
- [ ] Add phase syntax and path traversal notes where command creation examples need them.
- [ ] Add parallel-save advisory lock mention where continuity save behavior is documented.
- [ ] Run Gates A through E and patch failures.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Exact grep | Stale deleted-artifact patterns and banned public terms | `rg` |
| YAML parse | All command YAML assets, with immediate checks after edits | `python3 -c "import yaml,sys; yaml.safe_load(open(sys.argv[1]))"` |
| Workflow regression | Command workflow invariance | `node mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/workflow-invariance.vitest.ts` |
| Spec validation | 006 and sibling packets 003, 004, 005 | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/command/spec_kit/` | Internal | Green | Cannot audit command surfaces without source files. |
| PyYAML in local Python | Tooling | Unknown until run | YAML parse gate needs fallback parser if missing. |
| Vitest dependencies under system-spec-kit MCP server | Tooling | Unknown until run | Workflow-invariance gate cannot complete if dependencies are missing. |
| Spec validation scripts | Internal | Green | Completion verification depends on strict validation. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: YAML parse failure, workflow-invariance failure caused by an asset edit, or command docs becoming less accurate.
- **Procedure**: Restore the affected edited hunk from git diff context or reapply a narrower patch, then rerun the relevant gate before continuing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Command Markdown) -> Phase 2 (YAML Assets) -> Phase 3 (Verification)
             |                          |                         |
             +----------- inventory grep and classification -------+
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | Spec docs scaffolded | Current behavior note placement |
| Phase 2 | Inventory grep and YAML reads | YAML parse gate and workflow invariance |
| Phase 3 | Phases 1 and 2 | Final checklist and implementation summary |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Command Markdown sweep | Medium | 15-25 minutes |
| YAML asset sweep | High | 20-30 minutes |
| Verification and final docs | Medium | 15-20 minutes |
| **Total** | | **50-75 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No commits planned.
- [x] Git branch confirmed as `main`.
- [ ] Diff reviewed before final report.

### Rollback Procedure
1. Identify the failing file from parse/test output.
2. Inspect `git diff -- <file>`.
3. Reapply the previous wording or a narrower correction with `apply_patch`.
4. Rerun the failed gate.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: File-level patch rollback only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Spec packet docs
  -> command Markdown sweep
  -> YAML asset sweep
  -> behavior-note additions
  -> Gates A-E
  -> checklist, implementation summary, parent metadata
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Packet docs | Scaffolder output | Execution contract | Asset edits |
| Inventory grep | In-scope files | Hit list and classifications | Patch decisions |
| YAML parse checks | YAML edits | Syntax confidence | Workflow-invariance gate |
| Verification gates | Final asset state | Completion evidence | Final report |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Author packet docs** - 10 minutes - CRITICAL
2. **Patch command Markdown hits** - 20 minutes - CRITICAL
3. **Patch YAML hits and parse each edited file** - 25 minutes - CRITICAL
4. **Run Gates A-E and final docs** - 20 minutes - CRITICAL

**Total Critical Path**: 75 minutes worst-case.

**Parallel Opportunities**:
- File reads and greps can run in parallel.
- Final validation of sibling packets can run in a loop after Gate A-C pass.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Packet docs ready | Strict validation has no authored-doc blockers | Phase A/B |
| M2 | Asset audit complete | All 18 files classified and patched as needed | Phase C |
| M3 | Verification complete | Gates A-E pass or critical blocker is documented | Phase D |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Match Packet 005 Audit Boundary

**Status**: Accepted

**Context**: Packet 006 completes the second half of the same AI-facing cleanup started by packet 005.

**Decision**: Use the same stale deleted-artifact and banned-public-vocabulary boundary, with YAML runtime terminology explicitly classified instead of blindly removed.

**Consequences**:
- Command docs and workflows use the same public surface rules as skill references.
- Runtime YAML terms need careful per-hit classification.

**Alternatives Rejected**:
- Broaden to all spec-kit files: rejected because 005 already covered sibling surfaces and this packet has an explicit command/YAML scope.
