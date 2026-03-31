---
title: "Feature Specification: Agent Haiku [04--agent-orchestration/z_archive/013-agent-haiku-compatibility/spec]"
description: "The context agent was rewritten from a 3-mode system (quick/medium/thorough) to thorough-only after spec 012 A/B testing showed the narrowest Haiku-Sonnet gap in thorough mode. ..."
trigger_phrases:
  - "feature"
  - "specification"
  - "agent"
  - "haiku"
  - "compatibility"
  - "spec"
  - "013"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Agent Haiku Compatibility

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-14 |
| **Parent** | 04--agent-orchestration |
| **Related** | 012-context-model-comparison |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The context agent was rewritten from a 3-mode system (quick/medium/thorough) to thorough-only after spec 012 A/B testing showed the narrowest Haiku-Sonnet gap in thorough mode. However, other agent files — particularly orchestrate.md — still reference the old 3-mode system (e.g., `quick=0, medium=1 max, thorough=2 max` at line 192). Additionally, spec 012 test results revealed Haiku-specific behavioral patterns that no agent currently handles: S-01 section completeness failures (dropping Context Package sections), CSS cross-layer discovery gaps, and tool call budget overruns.

### Purpose

Ensure all agent files are compatible with the thorough-only Haiku context agent and add orchestrator logic to detect and handle known Haiku failure patterns.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update orchestrate.md to remove 3-mode references (quick/medium/thorough dispatch limits)
- Add Haiku-specific failure detection to orchestrate.md (section completeness, CSS gaps, tool call overruns)
- Audit all 7 non-context agent files for stale mode references
- Apply changes to both platforms (.opencode/agent/ and .claude/agents/)

### Out of Scope

- Rewriting the context agent itself — already done (spec 012)
- Changing the model selection (Haiku vs Sonnet) — decided as GO in spec 012
- Modifying the context agent's prompt to fix S-01 failures — separate concern
- Adding new agents or removing existing ones

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/orchestrate.md` | Modify | Remove 3-mode dispatch limits, add Haiku failure handling |
| `.claude/agents/orchestrate.md` | Modify | Mirror changes from Copilot version |
| `.opencode/agent/context.md` | Verify | Confirm thorough-only is correctly stated (no changes expected) |
| `.claude/agents/context.md` | Verify | Confirm thorough-only is correctly stated (no changes expected) |
| `.opencode/agent/research/research/research.md` | Verify | Check for mode references (none expected) |
| `.opencode/agent/speckit.md` | Verify | Check for mode references (none expected) |
| `.opencode/agent/write.md` | Verify | Check for mode references (none expected) |
| `.opencode/agent/review.md` | Verify | Check for mode references (none expected) |
| `.opencode/agent/debug.md` | Verify | Check for mode references (none expected) |
| `.opencode/agent/handover.md` | Verify | Check for mode references (none expected) |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove 3-mode dispatch limits from orchestrate.md | Line 192 reference to `quick=0, medium=1 max, thorough=2 max` replaced with thorough-only language |
| REQ-002 | Add Haiku S-01 failure detection | orchestrate.md contains logic to detect missing Context Package sections and request retry |
| REQ-003 | Mirror all changes to Claude Code platform | .claude/agents/ files match .opencode/agent/ bodies exactly |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Add CSS cross-layer gap detection hint | orchestrate.md notes that Haiku may miss CSS when querying cross-layer systems (JS+CSS+HTML) |
| REQ-005 | Add tool call overrun awareness | orchestrate.md references @context's 10-20 tool call budget and notes Haiku tendency to exceed |
| REQ-006 | Verify all other agents have no stale mode references | Grep confirms no quick/medium/thorough context-mode references in non-context agent files |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -r "quick=0" .opencode/agent/` returns zero results
- **SC-002**: orchestrate.md Two-Tier Dispatch Model section references thorough-only context agent
- **SC-003**: orchestrate.md contains a "Haiku Context Agent Notes" or similar section with known failure patterns
- **SC-004**: All .claude/agents/ files mirror their .opencode/agent/ counterparts

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Spec 012 results | Informs failure patterns | Results already documented |
| Risk | Over-engineering failure handling | Med | Keep detection heuristics simple — notes, not complex logic |
| Risk | Dual-platform sync | Low | Use diff to verify body identity after changes |

<!-- /ANCHOR:risks -->

---

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Clarity
- **NFR-C01**: Orchestrator failure handling notes must be concise (< 20 lines added)
- **NFR-C02**: No new sections > 30 lines in any agent file

### Consistency
- **NFR-S01**: Body content identical between .opencode/agent/ and .claude/agents/ for all modified files
- **NFR-S02**: No orphaned references to old 3-mode system after changes

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Context Agent Behavior
- Haiku returns 4/6 sections: Orchestrator should detect and request retry with explicit "include all 6 sections" instruction
- Haiku exceeds tool call budget (47 vs 20 max): Note in orchestrator but don't add hard enforcement (context agent self-governs)
- CSS-heavy query to Haiku: Orchestrator hint to include CSS search in context dispatch for cross-layer topics

### Platform Divergence
- Frontmatter differs between platforms (expected): Only body content must match
- Model names differ (github-copilot/claude-haiku-4.5 vs haiku): Expected, not a compatibility issue

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 2 files modified, 8 verified, both platforms |
| Risk | 8/25 | Low risk — documentation-level changes to agent configs |
| Research | 10/20 | Need to read all agent files, cross-reference with spec 012 |
| **Total** | **30/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the Haiku failure handling be a new dedicated section in orchestrate.md or integrated into existing sections (§9 Event-Driven Triggers, §14 Failure Handling)?
- Should the orchestrator proactively add "include all 6 Context Package sections" to every @context dispatch, or only as a retry instruction after failure?

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
