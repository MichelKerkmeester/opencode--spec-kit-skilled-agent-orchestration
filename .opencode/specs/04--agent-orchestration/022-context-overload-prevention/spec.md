---
title: "Feature Specification: Context Overload Prevention [04--agent-orchestration/022-context-overload-prevention/spec]"
description: "Claude Code sessions frequently hit irrecoverable compaction failures when the orchestrator overloads its own context window. The orchestrate.md agent definition across all thre..."
trigger_phrases:
  - "feature"
  - "specification"
  - "context"
  - "overload"
  - "prevention"
  - "spec"
  - "022"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Context Overload Prevention

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-20 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Claude Code sessions frequently hit irrecoverable compaction failures when the orchestrator overloads its own context window. The orchestrate.md agent definition across all three runtimes (Claude Code, Copilot/OpenCode, ChatGPT/Codex) lacked explicit self-protection rules, compaction recovery protocols, output discipline enforcement, and structured context pressure response sequences.

### Purpose
Prevent irrecoverable context window failures by adding self-protection guardrails directly into the orchestrator agent definition across all three runtime variants.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Orchestrator self-protection rules (targeted reads, no accumulation, write-don't-hold, batch calls)
- Compaction/session recovery protocol
- Output discipline enforcement (summarize large outputs, unified synthesis)
- Context pressure response protocol (pause, announce, wait, fallback)
- Runtime-adapted anti-patterns for each variant
- Changelog entry for agent-orchestration series

### Out of Scope
- Changes to LEAF agent definitions (context.md, debug.md, etc.) - not affected
- Changes to AGENTS.md routing table - separate concern
- Karabiner shortcut changes - tracked separately (not part of this spec)
- Changes to the source prompt (007) - that is an AI Systems/Barter deliverable

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.claude/agents/orchestrate.md` | Modify | Add 5 sections: self-protection, recovery, output discipline, pressure response, anti-patterns |
| `.opencode/agent/orchestrate.md` | Modify | Same additions adapted for Copilot runtime (~150K context, no `/compact`) |
| `.opencode/agent/chatgpt/orchestrate` | Modify | Same additions adapted for Codex/ChatGPT runtime (~220K context, higher thresholds) |
| `.opencode/changelog/03--agent-orchestration/v2.0.8.0.md` | Create | Changelog documenting all changes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add orchestrator self-protection rules to all 3 variants | Each variant has targeted-reads, no-accumulation, write-don't-hold, batch-calls rules in section 8 |
| REQ-002 | Add recovery protocol to all 3 variants | Claude variant references CLAUDE.md/MEMORY.md; Copilot/ChatGPT reference AGENTS.md |
| REQ-003 | Add output discipline to all 3 variants | Each variant has summarization rules in section 7 |
| REQ-004 | Add context pressure response protocol to all 3 variants | 4-step pause/announce/wait/fallback sequence in section 7 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Add context-related anti-patterns to section 9 | 3 new anti-patterns per variant with correct threshold references |
| REQ-006 | Runtime-specific threshold adaptation | ChatGPT uses higher limits (300 line / 4 file / >80 line thresholds) matching its ~220K budget |
| REQ-007 | Create changelog entry | v2.0.8.0.md follows established format |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 orchestrate.md variants contain the 5 new sections
- **SC-002**: ChatGPT variant thresholds are proportionally higher than Claude/Copilot
- **SC-003**: No existing sections or logic was removed or broken
- **SC-004**: Changelog entry created and follows v2.0.7.3 format
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Source prompt 007 | Logic source for all additions | Already completed in prior session |
| Risk | Agent file size growth | Larger context overhead per session | Additions are concise (~40 lines total per file) |
| Risk | Threshold mismatch across runtimes | Inconsistent behavior | Explicit per-runtime adaptation with documented rationale |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: All 3 variants use identical section headers and structure
- **NFR-C02**: Only threshold values and runtime-specific references differ

### Maintainability
- **NFR-M01**: New sections reference existing section numbers (cross-refs to section 6, 7, 8)
- **NFR-M02**: Anti-patterns include "See section X" back-references
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Runtime Differences
- Claude Code has `/compact` command: pressure protocol recommends it
- Copilot/ChatGPT lack `/compact`: protocol uses "save context" language instead
- Claude Code has CLAUDE.md/MEMORY.md: recovery references those files
- Copilot/ChatGPT lack those: recovery references AGENTS.md + project config

### Threshold Scaling
- ChatGPT ~220K context allows higher thresholds (300 line files, 4 file accumulation, >80 line output)
- Claude/Copilot ~150K context uses standard thresholds (200 line files, 3 file accumulation, >50 line output)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 3 files modified, ~40 lines added per file |
| Risk | 5/25 | No breaking changes, additive only |
| Research | 8/20 | Source prompt analysis + runtime comparison |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. All requirements clarified during implementation.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
