---
title: "Spec: Phase 001 - Claude Optimization Settings (Reddit field-report audit)"
description: "Deliver an evidence-anchored recommendation set for reducing Claude Code token spend in Code_Environment/Public, derived from auditing a primary-source Reddit field report covering 858-926 sessions."
trigger_phrases:
  - "claude optimization settings"
  - "enable tool search"
  - "cache expiry"
  - "token waste"
  - "reddit field report audit"
importance_tier: "important"
contextType: "research"
---
# Spec: Phase 001 - Claude Optimization Settings (Reddit field-report audit)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This phase audited a Reddit primary-source field report covering 858-926 Claude Code sessions against `Code_Environment/Public`'s actual `.claude/settings.local.json` and `CLAUDE.md`. The headline configuration recommendation from the post -- `ENABLE_TOOL_SEARCH=true` -- is already present in this repo, making the central deliverable a ranked recommendation set rather than a new config flip. Twenty-four findings (F1-F24) were produced across four prioritization tiers, with 11 adopt-now, 11 prototype-later, and 2 reject labels. The original 8-iteration synthesis-ready loop was extended to 13 iterations by user request via `cli-codex` `gpt-5.4` high reasoning to bring an independent skeptical perspective before closeout. This is a research-only phase; no settings were changed, no hooks were implemented, and no auditor was built.

**Key Decisions**: Treat the Reddit post as a primary-source field report (not an implementation spec); defer auditor implementation to phase 005-claudest.

**Critical Dependencies**: Phase 005-claudest owns the implementation provenance for `claude-memory` and `get-token-insights`. This phase's recommendation set is a prerequisite input for that work.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete (research phase) |
| **Created** | 2026-04-06 |
| **Phase Folder** | `001-claude-optimization-settings` |
| **Research Iterations** | 13 (`cli-copilot` core loop, then iterations 009-013 added by user request via `cli-codex` `gpt-5.4` high reasoning) |
| **Findings** | 24 (F1-F24), 56 raw across 13 iterations |
| **Parent Spec** | `../spec.md` |
| **Successor Phase** | `../002-codesight/spec.md` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`Code_Environment/Public` had no evidence-anchored baseline for which Claude Code token-waste patterns are most prevalent, which configuration changes are already adopted, and which hook or behavioral interventions should be prioritized. The only available primary-source evidence was a Reddit field report claiming to have audited 858-926 Claude Code sessions (the header and body use different totals -- see §6 for the preserved discrepancy). Without auditing that report and cross-checking it against the repo's actual setup, planning decisions for hooks, behavioral rules, and observability work would rest on assumption rather than evidence.

### Purpose

Produce an evidence-anchored recommendation set, cross-checked against this repo's current Claude configuration, that tells planning downstream what to adopt now, prototype later, or reject, with every recommendation tied to a specific passage in `external/reddit_post.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Configuration audit of `.claude/settings.local.json` against post recommendations
- Cache-expiry waste taxonomy (prevalence, cliff count, budget-exposure framing)
- Hook design analysis for three proposed hooks: Stop idle-timestamp, UserPromptSubmit idle-gap warning, SessionStart cache-rebuild estimator
- Skill-schema bloat detection methodology (disable-review queue approach)
- Redundant file-read detection concepts (cache-amplified waste framing)
- Bash-vs-native-tool antipattern reinforcement (662 bash calls documented in post)
- Edit-retry chain analysis (31 failed-edit-then-retry sequences documented in post)
- Audit methodology portability (six-layer decomposition, multi-runtime adapter model)
- Phase 005-claudest boundary statement (one-way, narrow overlap -- see §4 REQ-009)
- `.claude/settings.local.json` config-change checklist (documentation only; no actual changes)
- Source discrepancy preservation (926-vs-858 sessions; 18,903-vs-11,357 turns denominator)

### Out of Scope

- Plugin implementation (`claude-memory`, `get-token-insights`) -- owned by phase 005-claudest
- Enabling or disabling any setting in `.claude/settings.local.json` -- this phase produces a checklist; later phases own actual config flips
- Building a token auditor inside this phase
- Anthropic billing debates or subscription pricing theory
- Sibling phases 002 (codesight), 003 (contextador), 004 (graphify) content
- Dead Reddit URLs referenced inside the post
- Reverse-engineering Anthropic billing behavior

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Canonical synthesis output with F1-F24, 12 sections, config checklist |
| `spec.md` | Create | This document |
| `plan.md` | Create | Research methodology and convergence trajectory |
| `tasks.md` | Create | Backfilled task list for the 13-iteration research run |
| `checklist.md` | Create | P0/P1/P2 verification checklist with evidence references |
| `decision-record.md` | Create | Four key decisions (ADR-001 through ADR-004) |
| `implementation-summary.md` | Create | Delivery summary: artifacts, stats, next-phase boundary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `research/research.md` must exist with the authoritative evidence-backed synthesis | File present; 24 findings (F1-F24) visible; see research.md §4. The original 8-iteration cap was extended to 13 by user request via `cli-codex` `gpt-5.4` high reasoning to add an independent skeptical pass before closeout. |
| REQ-002 | Each finding must cite a specific external/reddit_post.md passage | Every finding in research.md §4 has a "Source passage anchor" and "Source quote" field |
| REQ-003 | Each finding must carry a recommendation label | Every finding labeled `adopt now`, `prototype later`, or `reject` |
| REQ-004 | Cross-check against current `.claude/settings.local.json` and `CLAUDE.md` must be present | research.md §3 cross-check table present with repo-state column |
| REQ-005 | Phase 005-claudest boundary must be explicit | research.md §9 states the one-way overlap rule; no implementation duplication |
| REQ-006 | Source discrepancy (926-vs-858 sessions; 18,903-vs-11,357 turns) must be preserved, not smoothed | research.md §2 discrepancy table present with both rows; no normalized total anywhere in this spec set |
| REQ-007 | `ENABLE_TOOL_SEARCH=true` must be identified as already present in this repo | research.md §3 cross-check table row 1; F1 recommendation: adopt now (already implemented) |
| REQ-008 | `.claude/settings.local.json` config-change checklist must be present | research.md §5 JSON checklist with alreadyInRepo, recommendedAdditions, outOfScope buckets |
| REQ-009 | Phase 005 boundary statement must be a one-way, narrow reference | research.md §9 language: "phase 001 may cite phase 005 only to point at the concrete implementation home" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Tier ranking applied per phase-research-prompt §10.3 | research.md §4 findings carry Tier 1-4 labels; iteration-006 tier table verifies |
| REQ-011 | All 12 research questions from phase-research-prompt §6 addressed | research.md covers Q1-Q12; Q2 and Q8 marked exhausted-without-closure in §11 |
| REQ-012 | Hook design conflict matrix present | research.md §6 conflict matrix table with existing vs proposed hook rows |
| REQ-013 | Audit methodology portability analysis present | research.md §8 six-layer decomposition and portability matrix |
| REQ-014 | Convergence report present as appendix | research.md §12 with newInfoRatio trajectory and stop-reason statement |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` contains F1-F24 with source anchors, recommendation labels, tier assignments, and affected-area notes -- verified by reading research.md §4.
- **SC-002**: The config-change checklist in research.md §5 correctly identifies `ENABLE_TOOL_SEARCH=true` as already present and any hook-design flags as repo-local experimental (not post-backed settings).
- **SC-003**: The phase 005-claudest boundary in research.md §9 is present and contains no implementation duplication.
- **SC-004**: The discrepancy table in research.md §2 preserves both mismatches (926-vs-858 sessions; 18,903-vs-11,357 turns denominator) without normalizing them.
- **SC-005**: Recommendation split is 11 adopt-now / 11 prototype-later / 2 reject as reported in research.md §12 convergence report.
- **SC-006**: Level 3 spec documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md) all exist in this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Source discrepancy | Post header says "926 sessions"; body uses "858 sessions" and "18,903 turns" | Weakens exact prevalence extrapolations | Preserved explicitly in research.md §2; never normalized |
| Source discrepancy | Cache-expiry denominator is 11,357 turns, not 18,903 | Weakens the exact 54% idle-gap claim | Preserved explicitly in research.md §2; directional conclusion still stands |
| Dependency | Phase 005-claudest owns auditor implementation | Prototype-lane findings (F4-F7, F14-F15, F17) cannot be validated until 005 ships | Boundary stated in research.md §9; this phase owns only the what/why |
| Risk | JSONL format fragility (F16) | Undocumented Claude local file format can change; any future auditor may silently break | research.md §8 and §10 require guarded adapter with coverage counters |
| Risk | `UserPromptSubmit` UX unshipped (F5) | Blocking UX behavior has no production proof | Labeled prototype-only; do not default-roll out |
| Risk | No local latency or discoverability benchmark | Cannot honestly claim ENABLE_TOOL_SEARCH improves first-tool-use latency here | F2 explicitly disavows overclaiming; research.md §10 preserves this as a validation gap |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Research Quality
- **NFR-R01**: Every major finding must be anchored to a specific paragraph in `external/reddit_post.md` using paragraph-start anchor phrases, not paraphrased summaries.

### Scope Discipline
- **NFR-S01**: No recommendation in this phase may instruct implementing plugin internals, enabling/disabling settings, or building auditor code. Output is a decision/adoption layer only.

### Discrepancy Preservation
- **NFR-D01**: Any document in this spec set that references the Reddit post's session or turn counts must preserve both the 926/858 sessions discrepancy and the 18,903/11,357 turns denominator discrepancy. Neither total should be smoothed, averaged, or silently replaced.

---

## 8. EDGE CASES

### Source Ambiguity
- Multiple totals in one source: preserve both, explain the discrepancy, and use the body dataset (858 sessions, 18,903 turns) as the working frame while keeping 926 visible as the headline.
- Dead URLs referenced inside the post: note them where relevant; do not depend on them.

### Scope Boundary
- If a recommendation touches phase 005's implementation domain (auditor internals, plugin manifests, SQLite schema): categorize as prototype-later, reference phase 005, stop -- do not duplicate the implementation walkthrough.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Cross-phase boundary handling, 17-finding taxonomy, multi-surface (config/hooks/behavior/observability) |
| Risk | 15/25 | Source discrepancy handling, JSONL fragility risk, unshipped UX risk |
| Research | 18/20 | 13-iteration deep-research loop, 12 research questions, externalized JSONL state |
| Multi-Agent | 6/15 | LEAF-only execution, no sub-agent dispatch, cli-copilot runner |
| Coordination | 10/15 | Phase 005-claudest cross-phase boundary, four-tier prioritization framework |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Source denominators are internally inconsistent | Med | High (confirmed in source) | Preserve both values in every referencing document; see research.md §2 |
| R-002 | Claude JSONL format changes silently | High | Med | F16 requires guarded adapter pattern; phase 005 owns the implementation boundary |
| R-003 | UserPromptSubmit blocking UX creates friction | Med | Med | Labeled prototype-only; F5 requires runtime validation before any rollout |
| R-004 | Future synthesis flattens source discrepancies | Med | Med | NFR-D01 makes preservation a hard non-functional requirement for this spec set |
| R-005 | Phase 005 delay blocks prototype-lane findings | Low | Med | All Tier 2/4 prototype items are non-blocking for this phase; research.md is the deliverable |

---

## 11. USER STORIES

### US-001: Evidence-anchored recommendation set (Priority: P0)

**As a** developer planning Claude Code workflow improvements for Code_Environment/Public, **I want** a ranked list of recommendations tied to specific evidence from the Reddit post, **so that** I can decide what to adopt now, prototype later, or reject without having to re-read and interpret the source myself.

**Acceptance Criteria**:
1. **Given** research.md §4 is open, **When** I search for any finding F1-F24, **Then** I find a source passage anchor, recommendation label, tier, and affected area.
2. **Given** a recommendation is labeled "adopt now", **When** I check it against .claude/settings.local.json or CLAUDE.md, **Then** I find either it is already present or the exact change is described in documentation terms.

---

### US-002: Cross-phase boundary clarity (Priority: P1)

**As a** developer working on phase 005-claudest, **I want** to know exactly what phase 001 covers and what it defers to 005, **so that** I do not duplicate work already done or miss scope I am responsible for.

**Acceptance Criteria**:
1. **Given** research.md §9 is open, **When** I read the boundary paragraph, **Then** phase 001's scope (problem framing, recommendation labels) and phase 005's scope (implementation provenance, plugin internals) are distinct and non-overlapping.
2. **Given** the spec set in this phase folder, **When** I check any document, **Then** no document contains an implementation walkthrough of claude-memory, get-token-insights, or the Claudest marketplace.

---

### US-003: Discrepancy preservation (Priority: P1)

**As a** future maintainer of planning documents built on this research, **I want** the source's session and turn count discrepancies preserved verbatim, **so that** I can bound the precision of any extrapolations and avoid citing artificial precision that the source does not support.

**Acceptance Criteria**:
1. **Given** research.md §2 is open, **When** I look for the session-count discrepancy, **Then** I find both "926 sessions" (header) and "858 sessions" (body) with the source anchors for each.
2. **Given** research.md §2 is open, **When** I look for the cache-expiry denominator, **Then** I find both "18,903 turns" (headline total) and "11,357 turns" (cache-expiry denominator) with an explicit note that the post does not explain the difference.

---

## 12. OPEN QUESTIONS

- Q2 (exhausted without closure): What are the first-tool-use latency, discoverability, and task-completion ergonomics tradeoffs of deferred tool loading in this repo's specific startup environment? The post does not provide a latency or ergonomics benchmark; local A/B measurement is needed.
- Q8 (exhausted without closure): What is the root-cause breakdown for the 31 edit-retry chains -- prompt quality, workflow design, or guardrail messaging? The post reports the count but does not partition root causes.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research Output**: See `research/research.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Delivery Summary**: See `implementation-summary.md`
- **Primary Source**: external/reddit_post.md (read-only)
- **Research Strategy**: See `research/deep-research-strategy.md`
- **Phase 005 Boundary**: See `../005-claudest/scratch/phase-research-prompt.md`
