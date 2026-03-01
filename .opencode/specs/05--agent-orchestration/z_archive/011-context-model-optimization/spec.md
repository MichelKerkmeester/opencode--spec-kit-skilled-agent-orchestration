---
title: "Feature Specification: Context Agent Model Optimization [011-context-model-optimization/spec]"
description: "Investigate whether switching the @context agent from Sonnet to Haiku reduces API cost (66.7% savings, ~$918/month) and Copilot premium request consumption (67% reduction) witho..."
trigger_phrases:
  - "feature"
  - "specification"
  - "context"
  - "agent"
  - "model"
  - "spec"
  - "011"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Context Agent Model Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Investigate whether switching the @context agent from Sonnet to Haiku reduces API cost (66.7% savings, ~$918/month) and Copilot premium request consumption (67% reduction) without degrading context retrieval quality. Three options were analyzed; Option A (full Haiku) is recommended with Option C (hybrid) as fallback.

**Key Decisions**: Option A (full Haiku) selected based on reasoning-demand analysis; Option B (Sonnet + Haiku sub-agents) rejected as wrong optimization layer

**Critical Dependencies**: `github-copilot/claude-haiku-4.5` model string must be verified in live Copilot environment

<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implementing |
| **Created** | 2026-02-14 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The @context agent currently runs on Sonnet (claude-sonnet-4.5 via Copilot, `sonnet` via Claude Code) for all operations regardless of complexity. Since @context is a high-frequency agent (dispatched for every exploration task), it represents a significant portion of total API cost. Most @context invocations are quick/medium mode (2-10 tool calls) performing mechanical operations (Glob, Grep, Read, memory lookups) that may not require Sonnet-level reasoning.

### Purpose
Determine the optimal model strategy for the @context agent that minimizes API cost while maintaining acceptable context retrieval quality across all three thoroughness modes (quick, medium, thorough).

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Cost-benefit analysis of three model strategies for @context
- Performance risk assessment per thoroughness mode (quick/medium/thorough)
- Impact analysis on Context Package output quality
- Recommendation with implementation approach

### Out of Scope
- Model changes to other agents (@research, @debug, @review, etc.) - separate investigation
- Copilot subscription pricing analysis - subscription-based, not per-token
- Implementing the actual model change - deferred to `/spec_kit:implement`
- Full production benchmarking — a lightweight controlled comparison (5 queries) IS in scope as Phase 1 validation

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/context.md` | Modify | Update `model:` frontmatter and/or dispatch instructions |
| `.claude/agents/context.md` | Modify | Update `model:` field and/or Task dispatch model parameter |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Analyze all 3 options with cost and performance trade-offs | Each option has quantified cost delta and qualitative performance assessment |
| REQ-002 | Assess @context's reasoning demands per thoroughness mode | Each mode mapped to required reasoning capability with evidence |
| REQ-003 | Produce clear recommendation with rationale | One recommended approach with fallback strategy |
| REQ-006 | Empirical validation before committing to model switch | Controlled comparison (5 identical queries, Sonnet vs Haiku) with go/no-go criteria (>=4/5 acceptable) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Document sub-agent dispatch model control mechanism | Show how Task tool `model` parameter works for both platforms |
| REQ-005 | Identify rollback strategy if quality degrades | Clear revert procedure documented |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Clear recommendation backed by reasoning-demand analysis per mode
- **SC-002**: Cost savings quantified (relative, not absolute) with quality risk rated
- **SC-003**: Implementation path documented with rollback procedure
- **SC-004**: Controlled comparison (5 queries, Sonnet vs Haiku) completed with go/no-go decision before implementation

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Haiku may construct lower-quality tool call parameters (glob/grep patterns, file selection) across all modes, with multiplicative impact on Context Package quality | High | Empirical validation (Phase 1 controlled comparison) before committing; instant Sonnet rollback |
| Risk | Thorough mode gap detection and cross-referencing may degrade specifically | Medium | Trial period with baseline comparison; Option C (hybrid) as future optimization if thorough mode specifically degrades |
| Risk | Copilot may not support `claude-haiku-4.5` model string | Medium | Verify available models before implementation |
| Dependency | Claude API pricing (current rates) | Low | Use relative cost ratios, not absolute prices |
| Dependency | Claude Code Task tool `model` parameter | Low | Already confirmed in tool definition |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Context retrieval latency must not increase >20% (Haiku is faster, so likely improves)
- **NFR-P02**: Context Package completeness must remain >90% of current Sonnet baseline

### Reliability
- **NFR-R01**: No regressions in quick/medium mode output quality
- **NFR-R02**: Thorough mode must still detect gaps and unknowns accurately

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### @context Reasoning Demands by Mode

- **Quick mode** (2-4 tool calls): Mechanical — memory lookup + 1-2 Glob patterns. Minimal reasoning.
- **Medium mode** (5-10 tool calls): Moderate — pattern selection, result filtering, structured synthesis. Some reasoning.
- **Thorough mode** (10-20 tool calls): High — cross-referencing, gap detection, dispatch decisions, complex synthesis. Significant reasoning.

### Cognitive Scaffold — Scope and Limitations

The 439-line agent definition reduces ~30-40% of cognitive load by handling workflow sequencing, output formatting, tool-call budgeting, and dispatch rules. However, genuine reasoning work remains that the scaffold does NOT reduce:
- **Glob/Grep pattern quality** — choosing `src/**/*auth*` vs `lib/auth/**` requires codebase understanding
- **Gap detection** — inferring what SHOULD exist from what DOES exist is genuine analytical reasoning
- **Result filtering** — when Glob returns 40 files and the agent must pick 2-3 to Read, that selection is judgment-based
- **Dispatch decisions** — whether to dispatch @explore vs @research when results are ambiguous

This means the model switch is NOT purely a "follow the instructions" change — tool use quality is a real variable that must be empirically validated.

### Failure Scenarios
- Haiku fails to detect relevant patterns: Incomplete Context Package, implementation proceeds with blind spots
- Haiku over-dispatches sub-agents: Token waste, slower retrieval
- Haiku produces unstructured output: Violates Context Package format contract

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 2, LOC: <50, Systems: 1 (agent config) |
| Risk | 15/25 | Auth: N, API: Y (model change), Breaking: Y (quality degradation) |
| Research | 12/20 | Internal analysis of model capabilities and cost modeling; no external benchmarking or literature review |
| Multi-Agent | 5/15 | Workstreams: 1 (single agent change, but affects entire agent ecosystem) |
| Coordination | 5/15 | Dependencies: 2 (Copilot model string, Claude Code Task tool) |
| **Total** | **45/100** | **Level 3** (retained due to systemic impact — @context feeds every agent in the system) |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Haiku may construct lower-quality tool call parameters (glob patterns, grep queries, file selection) across all modes, leading to less precise file discovery and weaker Context Packages — thorough mode most affected but risk applies to all modes | High | Medium | Empirical validation in Phase 1 (controlled comparison); instant Sonnet rollback (2 lines, 30 seconds) |
| R-002 | Copilot model string `claude-haiku-4.5` invalid | Medium | Low | Verify before implementation; Claude Code unaffected |
| R-003 | Haiku over-dispatches sub-agents (unnecessary @explore/@research calls) | Medium | Low | Monitor dispatch frequency post-switch |
| R-004 | Context Package format violations (missing sections, wrong structure) | High | Low | 439-line agent definition provides strong structural scaffolding |
| R-005 | Downstream agents receive incomplete context, causing implementation errors | High | Medium | Trial period with baseline comparison before full rollout |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Cost-Efficient Context Retrieval (Priority: P0)

**As a** developer using the agent system, **I want** @context to run on the most cost-efficient model possible, **so that** I can perform more exploration tasks within my API budget and Copilot premium request allowance.

**Acceptance Criteria**:
1. Given a quick mode dispatch, When @context retrieves context, Then the cost is 66.7% lower than current Sonnet pricing
2. Given any mode dispatch, When @context produces a Context Package, Then all 6 mandatory sections are present with evidence citations

---

### US-002: Quality-Preserved Exploration (Priority: P0)

**As a** orchestrator agent, **I want** Context Packages from @context to maintain the same quality regardless of model, **so that** implementation decisions are based on complete, accurate context.

**Acceptance Criteria**:
1. Given a thorough mode dispatch, When @context produces a Context Package, Then gap detection identifies >=80% of known gaps compared to Sonnet baseline
2. Given any mode dispatch, When @context returns results, Then output size stays within mode limits (quick: 15 lines, medium: 60, thorough: 120)

---

### US-003: Seamless Rollback (Priority: P1)

**As a** system maintainer, **I want** the ability to revert to Sonnet if quality degrades, **so that** the model change is low-risk and reversible.

**Acceptance Criteria**:
1. Given quality degradation detected, When rollback is triggered, Then revert completes in <1 minute (2 line changes)
2. Given rollback isn't sufficient, When Option C is evaluated, Then hybrid implementation path is documented

---

### US-004: Copilot Premium Request Optimization (Priority: P1)

**As a** Copilot subscriber, **I want** @context to consume fewer premium requests per invocation, **so that** my monthly allowance extends further.

**Acceptance Criteria**:
1. Given Haiku at 0.33x multiplier, When @context is dispatched, Then each invocation consumes 67% fewer premium requests than Sonnet

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS (RESOLVED)

- ~~What is the exact Copilot model string for Haiku?~~ **RESOLVED**: `github-copilot/claude-haiku-4.5` (follows existing pattern; Haiku 4.5 is GA in Copilot at 0.33x premium request cost)
- ~~Can Claude Code's Task tool `model: "haiku"` parameter be specified?~~ **RESOLVED**: Yes, Task tool accepts `model: "haiku"` enum. Sub-agents can be dispatched at Haiku tier.
- ~~Conditional model selection per thoroughness mode?~~ **RESOLVED**: Not natively supported in agent frontmatter. Must be handled via: (a) dispatch instructions in agent body, or (b) separate agent definitions per tier.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md` (created during implementation)
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---
