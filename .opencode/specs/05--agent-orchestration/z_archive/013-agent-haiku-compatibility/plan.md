---
title: "Implementation Plan: Agent Haiku Compatibility [013-agent-haiku-compatibility/plan]"
description: "Update orchestrate.md to remove stale 3-mode context agent references and add Haiku-specific failure awareness. The context agent was rewritten to thorough-only mode after spec ..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "agent"
  - "haiku"
  - "compatibility"
  - "013"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Agent Haiku Compatibility

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (agent definition files) |
| **Framework** | OpenCode agent system (.opencode/agent/ + .claude/agents/) |
| **Storage** | N/A |
| **Testing** | Manual grep verification + visual review |

### Overview

Update orchestrate.md to remove stale 3-mode context agent references and add Haiku-specific failure awareness. The context agent was rewritten to thorough-only mode after spec 012, but orchestrate.md still references `quick=0, medium=1 max, thorough=2 max`. Additionally, spec 012 test data shows Haiku drops Context Package sections (S-01 failures in 3/5 queries) and misses CSS implementations in cross-layer queries — the orchestrator needs awareness of these patterns for effective quality evaluation.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md created)
- [x] Success criteria measurable (grep-based verification)
- [x] Dependencies identified (spec 012 results, context.md already updated)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-006)
- [ ] Grep verification passes (no stale mode references)
- [ ] Bodies match between .opencode/agent/ and .claude/agents/

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Agent definition files — declarative markdown documents loaded by AI systems at runtime.

### Key Components
- **orchestrate.md**: Primary consumer of @context outputs. Contains dispatch rules, failure handling, and quality evaluation. The ONLY file requiring substantive changes.
- **6 other agents** (research, speckit, write, review, debug, handover): Each has a "If dispatched with a Context Package" line. No changes needed — they receive Context Packages without mode-specific logic.
- **context.md**: Already updated to thorough-only. Verify only.

### Data Flow
```
User Request → Orchestrator
  → Phase 1: @context (thorough-only, Haiku model)
    → Returns Context Package (6 sections)
  → Orchestrator evaluates Context Package quality
    → If sections missing: retry with explicit section enforcement
    → If CSS gaps suspected: note for user
  → Phase 2: Implementation agents receive Context Package
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Update orchestrate.md (Primary)

**Target: `.opencode/agent/orchestrate.md`**

- [ ] **4.1** Replace line 192 three-mode dispatch limits with thorough-only statement:
  ```
  BEFORE: "Dispatch limits: quick=0, medium=1 max, thorough=2 max (user can override)"
  AFTER:  "Dispatch limit: 2 max (thorough-only mode, user can override)"
  ```

- [ ] **4.2** Add Haiku Context Agent awareness to §5 Two-Tier Dispatch Model (after line 200). New subsection:
  ```markdown
  ### Context Agent Quality Notes (Haiku)

  The @context agent runs on Haiku for speed (~2x faster than Sonnet). Based on spec 012 testing, be aware of these Haiku-specific patterns when evaluating Context Package returns:

  | Pattern | Detection | Action |
  |---------|-----------|--------|
  | **Missing sections** | Context Package has < 6 sections (especially Dispatched Analyses, Memory Context) | Retry with: "Return ALL 6 Context Package sections" |
  | **CSS discovery gap** | Query spans JS+CSS+HTML but findings only cover JS | Note gap in synthesis; consider separate CSS-focused follow-up |
  | **Tool call overrun** | N/A (not detectable by orchestrator) | No action needed — @context self-governs |

  > These are tendencies, not guarantees. Haiku scores 4.0+/5 on average quality. Only the missing-sections pattern warrants automatic retry.
  ```

- [ ] **4.3** Update §6 Mandatory Output Review to include Context Package section count in the Review Checklist:
  ```
  Add: "□ Context Package includes all 6 sections (if from @context)"
  ```

### Phase 2: Mirror to Claude Code

- [ ] **4.4** Copy updated orchestrate.md body to `.claude/agents/orchestrate.md` (preserving Claude Code frontmatter)

### Phase 3: Verification

- [ ] **4.5** Run grep to confirm no stale `quick=0` references remain
- [ ] **4.6** Run diff to confirm body identity between platforms
- [ ] **4.7** Verify all non-context agents have no stale mode references (already confirmed by exploration — no changes needed)

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | Stale mode references eliminated | `grep -r "quick=0" .opencode/agent/` |
| Diff verification | Platform body identity | `diff` on body content (awk-extracted) |
| Visual review | New section quality and placement | Manual read of orchestrate.md §5 |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec 012 results | Internal | Green (complete) | Informs failure patterns |
| context.md thorough-only | Internal | Green (already done) | Prerequisite for this work |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Changes cause orchestrator confusion or incorrect routing
- **Procedure**: `git checkout -- .opencode/agent/orchestrate.md .claude/agents/orchestrate.md`

<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Update orchestrate.md) ──► Phase 2 (Mirror to Claude Code) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2, Phase 3 |
| Phase 2 | Phase 1 | Phase 3 |
| Phase 3 | Phase 1, Phase 2 | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Update orchestrate.md | Low | 3 edits to 1 file |
| Phase 2: Mirror to Claude Code | Low | 1 copy operation |
| Phase 3: Verification | Low | 3 grep/diff checks |
| **Total** | **Low** | **~10 minutes** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Current orchestrate.md content reviewed
- [ ] No uncommitted changes in agent files

### Rollback Procedure
1. `git checkout -- .opencode/agent/orchestrate.md`
2. `git checkout -- .claude/agents/orchestrate.md`
3. Verify with `grep "quick=0"` returns expected original content

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A

<!-- /ANCHOR:enhanced-rollback -->

---

## EXPLORATION FINDINGS SUMMARY

### From Architecture Explorer
- orchestrate.md has 26 sections (§1-§26)
- §5 Two-Tier Dispatch Model (lines 185-200) is the primary target
- §9 OnError triggers @context dispatch on 2 consecutive failures
- §14 Failure handling: Retry → Reassign → Escalate (generic, not Haiku-aware)
- Only stale mode reference: line 192 `quick=0, medium=1 max, thorough=2 max`

### From Feature Explorer
- All 6 non-context agents accept Context Packages: handover:94, research:59, review:54, debug:88, speckit:94, write:76 (.opencode) — no mode-specific logic in any
- orchestrate.md lines 95, 166-169, 190-192, 694 reference @context
- No other agent references quick/medium/thorough context modes

### From Dependency Explorer
- 4 YAML workflows dispatch @context: spec_kit_plan (auto/confirm), spec_kit_complete (auto/confirm)
- All use `subagent_type: context` with opus model
- AGENTS.md line 495 defines @context as exclusive exploration agent
- Context Packages feed into plan.md and research.md via verification approach

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
