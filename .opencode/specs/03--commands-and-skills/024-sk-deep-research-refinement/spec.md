# Feature Specification: sk-deep-research Refinement via Self-Research

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
| **Created** | 2026-03-18 |
| **Branch** | `024-sk-deep-research-refinement` |
| **Parent Spec** | `023-sk-deep-research-creation` (v1 complete, 18 v2 proposals) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-deep-research system (v1) is functional but has 18 documented improvement proposals (from spec 023) that need rigorous validation, prioritization refinement, and implementation-ready specifications before they can be executed. The proposals were derived from a 14-iteration research cycle but need a second-pass deep investigation that:

1. **Re-examines the 3 reference repos at code level** with fresh eyes and updated source state (repos may have evolved since spec 023's research)
2. **Validates proposal feasibility** against the actual v1 implementation (not just the design docs)
3. **Discovers missed improvements** by stress-testing the deep-research system against itself (meta-research)
4. **Produces implementation-ready refinements** with concrete file-level change lists

### Purpose

Run rigorous autonomous deep-research rounds that investigate improvements to the existing sk-deep-research logic, producing validated, implementation-ready refinement proposals with file-level specificity.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Deep research execution** using `/spec_kit:deep-research:auto` against 3 external reference repos
- **Validation of existing 18 v2 proposals** from spec 023 improvement-proposals.md
- **Discovery of new improvement opportunities** missed in the first research cycle
- **File-level implementation specifications** for each validated proposal
- **Cross-runtime consistency audit** (Claude, Codex, OpenCode, ChatGPT agent definitions)
- **Convergence algorithm refinement** based on real execution telemetry from completed sessions

### Out of Scope

- Actual implementation of improvements — that is a separate `/spec_kit:implement` phase
- Changes to the Spec Kit Memory MCP server or generate-context.js
- Wave orchestration / parallel agent fan-out (P2.5) — flagged as Large effort, track only
- True context isolation via `claude -p` (P4.3) — requires architectural change, track only

### Files to Change (Research Targets)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-deep-research/SKILL.md` | Analyze | Core skill protocol — assess gaps |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Analyze | Convergence algorithm — validate vs real data |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Analyze | Loop lifecycle — assess error handling gaps |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Analyze | State schema — validate fault tolerance |
| `.opencode/command/spec_kit/deep-research.md` | Analyze | Command setup — assess UX gaps |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Analyze | Auto YAML — assess loop logic completeness |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Analyze | Confirm YAML — assess gate logic |
| `.claude/agents/deep-research.md` | Analyze | Claude agent — cross-runtime consistency |
| `.codex/agents/deep-research.toml` | Analyze | Codex agent — cross-runtime consistency |
| `.opencode/agent/deep-research.md` | Analyze | OpenCode agent — primary definition |
| `.opencode/agent/chatgpt/deep-research.md` | Analyze | ChatGPT agent — cross-runtime consistency |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run deep-research rounds investigating improvements to sk-deep-research | At least 8 iterations complete with convergence detection |
| REQ-002 | Research all 3 external reference repos at code level | Each repo's source code analyzed (not just README): AGR, pi-autoresearch, autoresearch-opencode |
| REQ-003 | Validate existing 18 v2 proposals | Each proposal has a validation status: confirmed, revised, deprecated, or needs-more-data |
| REQ-004 | Produce updated improvement-proposals.md (v3) | File exists with validated proposals, file-level change lists, and revised priority/effort |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Cross-runtime consistency audit | Document divergences between Claude/Codex/OpenCode/ChatGPT agent definitions |
| REQ-006 | Convergence telemetry analysis | Analyze real execution data from spec 023's 14-iteration + any other completed sessions |
| REQ-007 | Discover at least 3 new improvement opportunities | New proposals not in the existing 18, with evidence from code analysis |
| REQ-008 | Research questions answered with source citations | Every finding cites [SOURCE: repo/file:lines] or [CITATION: URL] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Deep research converges naturally (not hitting max-iterations cap) with final composite score > 0.60
- **SC-002**: Updated v3 proposals document with all 18 proposals validated + new discoveries
- **SC-003**: Each proposal has implementation-ready file-level change list (which files, which sections, what changes)
- **SC-004**: Cross-runtime audit identifies all divergences with recommended alignment actions

### Acceptance Scenarios

- **AS-1 Research Convergence**: **Given** the deep research loop is running with maxIterations=15, **When** the composite stop-score exceeds 0.60, **Then** the loop terminates naturally and research.md contains synthesized findings from all iterations.

- **AS-2 Proposal Validation**: **Given** 18 v2 proposals are loaded as baseline from spec 023, **When** each proposal is cross-referenced against external repo source code, **Then** every proposal has a validation status: confirmed, revised, deprecated, or needs-data.

- **AS-3 New Discovery**: **Given** the research agent explores beyond existing proposal scope, **When** it identifies an improvement not in the v2 set, **Then** a new proposal is documented with evidence, source citation, and effort estimate.

- **AS-4 Cross-Runtime Consistency**: **Given** 4 agent definitions are compared (Claude, Codex, OpenCode, ChatGPT), **When** behavioral divergences are detected, **Then** a divergence report lists the differences with recommended canonical source and alignment actions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | External repos accessible via web | Research blocked if repos down | Cache key files locally; use CocoIndex for local code search |
| Dependency | Spec 023 improvement-proposals.md | Research context incomplete | Already loaded and available in this spec |
| Risk | Self-referential research may loop | Med | Define clear research questions upfront; use exhausted approaches tracking |
| Risk | External repos may have changed since spec 023 | Low | Treat as feature: discover what changed and assess impact |
| Risk | Meta-research convergence may be slower | Med | Set max-iterations to 15 (vs default 10); convergence threshold 0.02 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Research iterations complete within 3 minutes each (agent tool budget: 8-11 calls)
- **NFR-P02**: Total research session completes within 60 minutes

### Quality
- **NFR-Q01**: Every finding must cite a specific source (file path, URL, or code snippet)
- **NFR-Q02**: newInfoRatio must be honestly assessed (not inflated to avoid convergence)

### Reliability
- **NFR-R01**: Research must survive at least 1 state file corruption gracefully
- **NFR-R02**: Resume capability if session is interrupted
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- External repo unavailable: Fall back to cached/local analysis of improvement-proposals.md
- All research questions answered early: Allow convergence before min-iterations if composite score > 0.60
- Strategy.md grows too large: Prune exhausted approaches section after 10 entries

### Error Scenarios
- WebFetch failure on external repo: Retry once, then mark source as unavailable and continue
- JSONL corruption mid-session: Reconstruct from iteration-NNN.md files (P1.4 recovery path)
- Agent dispatch timeout: Retry once, then proceed with available findings

### State Transitions
- Partial completion: Strategy.md preserves state for resume
- Session expiry: generate-context.js saves memory for future session pickup
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 11 files to analyze, 3 external repos, multi-runtime |
| Risk | 10/25 | Self-referential research, external dependency |
| Research | 18/20 | Deep investigation primary goal |
| **Total** | **43/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Q1: Should the research also investigate improvements to the YAML workflow engine itself (not just the protocol/agent)?
- Q2: Should we target specific proposals for immediate implementation post-research, or treat all equally?
- Q3: Is there a preference for which runtime's agent definition serves as the canonical source for cross-runtime alignment?
<!-- /ANCHOR:questions -->
