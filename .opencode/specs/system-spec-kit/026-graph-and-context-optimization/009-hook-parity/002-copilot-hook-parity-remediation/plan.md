---
title: "Implementation Plan: Copilot CLI Hook Parity Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2"
description: "Investigation-first plan that selected outcome B: managed custom-instructions file workaround for Copilot CLI."
trigger_phrases:
  - "026/009/004 plan"
  - "copilot hook parity plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Strict validator closure"
    next_safe_action: "Keep validators green"
    completion_pct: 100
---

# Implementation Plan: Copilot CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Shell, Markdown |
| **Framework** | Spec Kit hooks, Copilot CLI hooks, GitHub hook config |
| **Storage** | `$HOME/.copilot/copilot-instructions.md` managed block |
| **Testing** | Vitest, shell syntax, real Copilot smoke, strict validator |

### Overview
The plan investigated Copilot CLI extension surfaces before implementation and selected outcome B: a file-based workaround using managed custom instructions. Current-turn prompt mutation remains unsupported by Copilot hooks, so the implementation writes a workspace-scoped managed block and documents next-prompt freshness.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Copilot hook limitation researched and captured in decision-record.md.
- [x] Outcome B accepted as the implementation path.
- [x] Existing Claude hook behavior treated as a regression gate.

### Definition of Done
- [x] Copilot custom-instructions writer implemented and documented.
- [x] Repo-local wrappers route `sessionStart` and `userPromptSubmitted`.
- [x] Focused tests, shell syntax, typecheck, build, and Copilot smoke evidence recorded.
- [x] Strict validator exits 0 after this closure pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
File-backed context transport. Copilot hooks run repo-local wrappers; wrappers refresh the managed block; Copilot reads the file on the next prompt.

### Key Components
- **Copilot writer**: `hooks/copilot/custom-instructions.ts`
- **Prompt hook**: `hooks/copilot/user-prompt-submit.ts`
- **Session hook**: `hooks/copilot/session-prime.ts`
- **Repo wrappers**: `.github/hooks/scripts/session-start.sh` and `.github/hooks/scripts/user-prompt-submitted.sh`
- **Docs**: cli-copilot skill, README, hook docs, feature catalog, and manual playbook.

### Data Flow
Copilot event -> repo-local shell wrapper -> compiled Spec Kit hook -> managed custom-instructions block -> next Copilot prompt reads scoped context.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Research official Copilot hook/custom-instructions surfaces and classify available mechanisms.
- Decide between full hook parity, file-based workaround, ACP wrapper, or documented limitation.

### Phase 2: Core Implementation
- Implement outcome B writer and hook wrappers.
- Preserve human-authored instructions outside managed markers.
- Add workspace-scope, lock, and atomic replacement behavior.

### Phase 3: Verification
- Run focused Copilot/Claude hook tests and shell syntax checks.
- Run real Copilot smoke to confirm the advisor line is visible.
- Update docs and strict-validator structure.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/focused | Copilot writer, wrappers, Claude regression | Vitest |
| Syntax | Hook shell wrappers | `bash -n` |
| Build/typecheck | MCP server/system-spec-kit | npm scripts |
| Manual | Real Copilot advisor-line visibility | `copilot -p` smoke |
| Spec validation | Packet docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Copilot custom instructions | External | Available | Outcome B would be impossible without this file surface. |
| Copilot prompt-mutation hooks | External | Unsupported | Explains why outcome A was rejected. |
| Superset notification wrapper | Local integration | Optional | Repo-local wrappers call it after Spec Kit writer when present. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Disable managed writes with `SPECKIT_COPILOT_INSTRUCTIONS_DISABLED`.
- Revert `.github/hooks/superset-notify.json` wrapper routing if Copilot hook execution regresses.
- Restore prior docs only if a new Copilot API enables true current-turn prompt mutation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Research -> ADR outcome B -> writer + wrappers -> tests/smoke -> docs -> strict validation
```

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Research | Copilot docs and empirical probes | Outcome matrix | ADR |
| ADR | Research | Outcome B | Implementation |
| Writer/wrappers | ADR | Managed block refresh | Tests/docs |
| Docs | Implementation evidence | Discoverable parity state | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Research Copilot capabilities.
2. Accept outcome B.
3. Implement managed custom-instructions writer and wrappers.
4. Verify with focused tests and real Copilot smoke.
5. Repair strict-validator template shape.

**Parallel Opportunities**: docs and checklist evidence can be updated after implementation evidence exists.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Outcome classified | ADR-003 accepted | Complete |
| M2 | File-backed transport shipped | Copilot smoke sees advisor line | Complete |
| M3 | Strict docs repaired | Validator exits 0 | Closure pass |
<!-- /ANCHOR:milestones -->

---

### AI EXECUTION PROTOCOL

#### Pre-Task Checklist
- Confirm the packet root is the only write scope.
- Preserve outcome B, completion status, and existing verification evidence.
- Avoid runtime code changes in this closure pass.

#### Task Execution Rules

| Rule | Handling |
|------|----------|
| TASK-SCOPE | Rewrite headings and anchors without changing outcome. |
| TASK-SEQ | Run strict validation after edits and iterate within the authorized limit. |
| Evidence preservation | Keep test commands, smoke results, and ADR conclusions intact. |

#### Status Reporting Format
- Packet path.
- Strict validator exit code.
- PASS or FAIL with remaining issue count.

#### Blocked Task Protocol
- Stop after three validation iterations if errors remain.
- Report remaining validator rule names and rationale in the temporary hygiene summary.

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:phase-deps -->
