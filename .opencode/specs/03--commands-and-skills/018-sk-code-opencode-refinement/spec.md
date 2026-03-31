---
title: "Feature Specification: sk-code--opencode refinement [03--commands-and-skills/018-sk-code-opencode-refinement/spec]"
description: "Level 3+ governance specification to refine sk-code--opencode with reduced inline-comment policy for AI parsing, preserve numbered ALL-CAPS section headers, harden KISS/DRY + SOLID checks, and optionally improve sk-code--review continuity."
trigger_phrases:
  - "sk-code--opencode refinement"
  - "inline comment policy"
  - "all-caps numbered sections"
  - "solid checks"
  - "139-hybrid-rag-fusion pattern extraction"
importance_tier: "critical"
contextType: "decision"
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch + level3plus-govern | v2.2"
---
# Feature Specification: sk-code--opencode refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

This specification defines a governance-first refinement of `sk-code--opencode` that tightens comment guidance for machine parsing, keeps numbered ALL-CAPS section headers stable, and increases architecture quality rigor through explicit KISS/DRY + SOLID checks. The work reuses proven patterning from `139-hybrid-rag-fusion` and aligns with `sk-code--review` baseline behavior.

**Key Decisions**: preserve the current header taxonomy (`## 1. OVERVIEW` style), reduce narrative inline comments, and codify parse-friendly trace comments with strict quality gates.

**Critical Dependencies**: existing skill corpus under `.opencode/skill/sk-code--opencode/`, review baseline in `.opencode/skill/sk-code--review/`, and prior governance patterns in `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/`.

---

---


## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-22 |

---


---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Current OpenCode standards provide strong cross-language structure, but inline comment rules are still broad enough to allow verbose human-style narration that reduces signal quality for AI-assisted parsing. At the same time, the numbered ALL-CAPS section convention is valuable for deterministic structure detection and must remain intact during refinement. Architecture checks are distributed across skills and need stronger KISS/DRY + SOLID enforcement across the primary standards path.

### Purpose

Produce a precise, AI-optimized standards refinement for `sk-code--opencode` that preserves existing section structure conventions, narrows inline comment usage to high-value parseable intent, and strengthens design-quality gates with explicit SRP/OCP/LSP/ISP/DIP coverage.

---
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

1. Analyze prior work under `139-hybrid-rag-fusion`, including both code-adjustment outcomes and reusable governance/pattern structures.
2. Analyze current `sk-code--review` baseline and SOLID references for compatibility and reuse.
3. Update `sk-code--opencode` guidance to reduce inline comments while preserving numbered ALL-CAPS section headers.
4. Define inline-comment formatting optimized for AI parsing, not narrative prose.
5. Strengthen KISS/DRY + SOLID quality checks, explicitly covering SRP/OCP/LSP/ISP/DIP.
6. Ensure language coverage spans shell, JavaScript, TypeScript, JSON/JSONC, and Python with broader codebase applicability.
7. Allow optional, bounded improvements to `sk-code--review` when they improve baseline-overlay alignment.

### Out of Scope

- Renaming skill directories or changing skill identity.
- Rewriting unrelated skills outside `sk-code--opencode` and optional targeted `sk-code--review` alignment.
- Changes to memory artifacts in any `memory/` subtree.
- Frontend-specific standards that belong to `sk-code--web`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-code--opencode/SKILL.md` | Modify | Refine core rules, routing text, and standards contract language for reduced inline comments and preserved numbered ALL-CAPS headings. |
| `.opencode/skill/sk-code--opencode/references/shared/universal_patterns.md` | Modify | Replace broad prose-oriented comment advice with AI-parsing-oriented inline comment policy and examples. |
| `.opencode/skill/sk-code--opencode/references/shared/code_organization.md` | Modify | Keep numbered section conventions explicit and stable as non-regression constraint. |
| `.opencode/skill/sk-code--opencode/references/javascript/style_guide.md` | Modify | Align JS commenting rules with reduced inline-comment policy while retaining section-divider conventions. |
| `.opencode/skill/sk-code--opencode/references/typescript/style_guide.md` | Modify | Align TS commenting rules and TSDoc boundaries with AI-parse-first guidance. |
| `.opencode/skill/sk-code--opencode/references/python/style_guide.md` | Modify | Align Python guidance for concise, intent-only comments and consistent structure markers. |
| `.opencode/skill/sk-code--opencode/references/shell/style_guide.md` | Modify | Align shell comment guidance with parse-oriented rationale and minimal narration. |
| `.opencode/skill/sk-code--opencode/references/config/style_guide.md` | Modify | Clarify JSONC-only comment boundaries and reduced inline-comment policy for configuration files. |
| `.opencode/skill/sk-code--opencode/assets/checklists/universal_checklist.md` | Modify | Add explicit KISS/DRY + SOLID checkpoints and non-regression checks for header conventions. |
| `.opencode/skill/sk-code--opencode/assets/checklists/javascript_checklist.md` | Modify | Add language-specific acceptance checks for reduced inline comments and structural consistency. |
| `.opencode/skill/sk-code--opencode/assets/checklists/typescript_checklist.md` | Modify | Add TS-specific quality checks and SOLID checkpoints in review-ready wording. |
| `.opencode/skill/sk-code--opencode/assets/checklists/python_checklist.md` | Modify | Add Python-specific checks for concise comments and design discipline. |
| `.opencode/skill/sk-code--opencode/assets/checklists/shell_checklist.md` | Modify | Add shell-specific checks for intent-focused comments and script maintainability. |
| `.opencode/skill/sk-code--opencode/assets/checklists/config_checklist.md` | Modify | Add JSON/JSONC policy checks to prevent non-parseable or excessive commentary. |
| `.opencode/skill/sk-code--review/SKILL.md` | Modify (Optional) | Tighten baseline/overlay mapping language to reference strengthened KISS/DRY + SOLID policy. |
| `.opencode/skill/sk-code--review/references/solid_checklist.md` | Modify (Optional) | Add concise prompts that better align with the refined opencode standard when useful. |
| `.opencode/skill/sk-code--review/references/code_quality_checklist.md` | Modify (Optional) | Add minimal cross-reference for KISS/DRY signals if required for alignment. |

---
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete prior-work analysis of `139-hybrid-rag-fusion` and `sk-code--review` | A documented crosswalk maps at least three extracted pattern classes to concrete updates in scoped `sk-code--opencode` files. |
| REQ-002 | Preserve numbered ALL-CAPS section header convention | Updated style guides and quick references retain header patterns such as `## 1. OVERVIEW` and section-order guidance with no regression. |
| REQ-003 | Reduce inline comment policy in `sk-code--opencode` | Updated guidance explicitly discourages narrative/mechanical comments and limits inline comments to rationale, invariants, guardrails, trace tags, and risk context. |
| REQ-004 | Optimize inline comments for AI parsing | Policy defines concise parse-friendly comment forms (for example trace prefixes and bounded sentence structure) with good/bad examples for each covered language family. |
| REQ-005 | Strengthen KISS/DRY + SOLID checks | Universal and language checklists include explicit KISS, DRY, SRP, OCP, LSP, ISP, and DIP checks with pass/fail phrasing. |
| REQ-006 | Maintain cross-language coverage and broader applicability | Final guidance is present and aligned for shell, JavaScript, TypeScript, Python, and JSON/JSONC and remains usable for mixed-language OpenCode system work. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Optional `sk-code--review` alignment improvements | If touched, review baseline files remain findings-first and include concise alignment language without relaxing security/correctness minimums. |
| REQ-008 | Keep scope tight while improving clarity | All edits stay within scoped files; no unrelated content rewrites are introduced. |
| REQ-009 | Provide verification evidence for policy non-regression | Validation output demonstrates no placeholder content and confirms updated files include required policy anchors and principle coverage. |

---
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The refined standard explicitly preserves numbered ALL-CAPS section headers across core language references.
- **SC-002**: Inline comment policy is demonstrably stricter and AI-parse-oriented, with per-language examples.
- **SC-003**: KISS/DRY and all SOLID dimensions (SRP/OCP/LSP/ISP/DIP) are present in reviewable checklist form.
- **SC-004**: Shell, JavaScript, TypeScript, Python, and JSON/JSONC coverage remains complete and internally consistent.
- **SC-005**: Optional `sk-code--review` changes, if made, are minimal, aligned, and do not dilute baseline security/correctness expectations.
- **SC-006**: Scope remains constrained to the listed files and requested behavior changes.

---

### Acceptance Scenarios

- **Given** an OpenCode coding agent reads the refined standard, **when** it applies comment rules, **then** the guidance prefers low-noise rationale comments over narrative inline commentary.
- **Given** a maintainer checks the language guides after refinement, **when** section structure is reviewed, **then** the numbered ALL-CAPS header convention remains preserved where required.
- **Given** the shared and language checklists are reviewed, **when** design-quality criteria are compared, **then** KISS, DRY, and the scoped SOLID prompts are present.
- **Given** a mixed-language repository is evaluated, **when** the refined references are used together, **then** the guidance remains consistent across shell, JavaScript, TypeScript, Python, and config contexts.
- **Given** optional `sk-code--review` alignment is considered, **when** evidence does not require extra review-skill edits, **then** the packet still documents the bounded optional scope instead of forcing unrelated changes.
- **Given** the Level 3+ packet is validated after normalization, **when** the spec docs are checked, **then** the governance-oriented refinement intent remains intact while the structure matches current expectations.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing section taxonomy in language references | Breaking this would destabilize structure parsing and existing patterns | Treat numbered ALL-CAPS headings as non-regression invariant and test for presence |
| Dependency | Review baseline precedence model | Over-editing could blur baseline vs overlay responsibilities | Keep review changes optional and minimal, limited to alignment wording |
| Risk | Over-tightening comments harms maintainability | Useful rationale could be removed | Define explicit allowed-comment categories and provide balanced examples |
| Risk | Cross-language drift after policy changes | One language may diverge from the shared contract | Apply shared policy first, then language-specific deltas, then checklist verification |
| Risk | Scope creep into unrelated skill rewrites | Delays and noisy diffs | Enforce scope lock to files in Section 3 only |

---
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Verification commands for scoped markdown checks complete in normal local CLI execution without manual patching loops.

### Security

- **NFR-S01**: Security/correctness minimums from `sk-code--review` baseline remain intact if optional review files are edited.

### Reliability

- **NFR-R01**: Re-running static checks on updated standards files yields consistent pass/fail outcomes for required policy markers.
- **NFR-R02**: The refined policy remains deterministic for AI agents by using explicit, machine-detectable wording patterns.

---


---


## 8. EDGE CASES

### Policy Boundaries

- JSON comments remain valid only in JSONC contexts and must stay concise and rationale-focused.
- Example snippets that intentionally show bad comments are allowed only inside explicit good/bad demonstration blocks.

### Cross-Skill Alignment

- `sk-code--review` may remain unchanged when alignment value is low; this does not block completion.
- If review files are edited, they must preserve findings-first output contracts and severity-first behavior.

### Mixed-Language Repositories

- Rules must remain usable when one change set spans shell scripts, TS/JS modules, Python tooling, and config files.

---


---


## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Multi-file standards refinement across shared references, language guides, and checklists |
| Risk | 19/25 | Policy-level changes can alter agent behavior quality across the codebase |
| Research | 18/20 | Requires pattern extraction from prior Level 3+ work and cross-skill compatibility analysis |
| Multi-Agent | 11/15 | Standards affect orchestrated review/implementation agents |
| Coordination | 13/15 | Baseline-overlay alignment and governance evidence requirements |
| **Total** | **83/100** | **Level 3+** |

---


---


## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Comment policy becomes too restrictive for practical debugging context | Medium | Medium | Allow narrow debug rationale comments with explicit limits |
| R-002 | Header-preservation rule is accidentally weakened in one language guide | High | Medium | Add non-regression checks in shared and language checklists |
| R-003 | SOLID/KISS/DRY additions become verbose and hard to apply | Medium | Medium | Use concise pass/fail prompts with concrete anti-pattern examples |
| R-004 | Optional review updates introduce baseline contract drift | High | Low | Require precedence model retention and minimal diff scope |

---


---


## 11. USER STORIES

### US-001: AI Agent Applying Standards (Priority: P0)

**As an** OpenCode coding agent, **I want** clear, parseable, low-noise comment and structure rules, **so that** I can generate consistent code with minimal ambiguity across languages.

**Acceptance Criteria**:
1. Given language-specific guidance, when applying standards, then numbered ALL-CAPS section headers remain unchanged.
2. Given inline comment decisions, when comments are written, then they follow the reduced rationale-only policy.

### US-002: Reviewer Enforcing Design Quality (Priority: P1)

**As a** code reviewer using baseline + overlay rules, **I want** explicit KISS/DRY and SOLID prompts, **so that** design regressions are found early and reported consistently.

**Acceptance Criteria**:
1. Given a review pass, when architecture quality is evaluated, then SRP/OCP/LSP/ISP/DIP prompts are available and actionable.

---


---

### 3.5 PRIOR-WORK CONTINUITY (139-HYBRID-RAG-FUSION + REVIEW BASELINE)

### Required Analysis Inputs

- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/implementation-summary.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-spec-kit-templates/spec.md
- `.opencode/skill/sk-code--review/SKILL.md`
- `.opencode/skill/sk-code--review/references/solid_checklist.md`

### Carry-Forward Pattern Targets

| Pattern Area | Source Baseline | Refinement Reuse Target |
|--------------|-----------------|-------------------------|
| Deterministic structure contracts | `139` spec sectioning and traceability discipline | Non-regression rule for numbered ALL-CAPS headings across opencode references |
| Governance-grade acceptance criteria | `139` measurable requirement style | Quantified policy checks for inline-comment reduction and SOLID/KISS/DRY coverage |
| Findings-first quality lens | `sk-code--review` baseline | Optional alignment updates so review outputs match updated opencode policy vocabulary |

---

---

### 4.5 TRACEABILITY MATRIX (REQUIREMENTS -> WORKSTREAMS)

| Requirement | Workstream | Primary File Groups |
|-------------|------------|---------------------|
| REQ-001 | W1 - Prior-work analysis and mapping | `139` artifacts + `sk-code--review` baseline files |
| REQ-002 | W2 - Structural convention preservation | `references/*/style_guide.md`, references/shared/code_organization.md |
| REQ-003 | W3 - Inline comment policy reduction | SKILL.md, references/shared/universal_patterns.md, language style guides |
| REQ-004 | W3 - AI-parse policy codification | Language style guides + shared patterns |
| REQ-005 | W4 - Quality gate hardening | `assets/checklists/*.md` + optional review checklists |
| REQ-006 | W5 - Language and ecosystem consistency | JS/TS/Python/Shell/Config references and checklists |
| REQ-007 | W6 - Optional review baseline alignment | sk-code--review/SKILL.md, review references |
| REQ-008 | W7 - Scope guardrails | Change review against this spec scope table |
| REQ-009 | W8 - Verification and evidence | Checklist/pattern verification commands and artifacts |

---

---


## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Project Owner | Pending | 2026-02-22 |
| Design Review | Standards Maintainer | Pending | 2026-02-22 |
| Implementation Review | Code Quality Lead | Pending | 2026-02-22 |
| Launch Approval | Repository Maintainer | Pending | 2026-02-22 |

---

---

## 13. COMPLIANCE CHECKPOINTS

### Security Compliance

- [ ] Security/correctness baseline preserved in optional review alignment edits
- [ ] No policy text introduces unsafe coding shortcuts

### Code Compliance

- [ ] Numbered ALL-CAPS section convention preserved where currently mandated
- [ ] KISS/DRY + SRP/OCP/LSP/ISP/DIP checks added in scoped checklists
- [ ] Inline-comment policy updated to AI-parse-focused constraints

### Documentation Compliance

- [ ] No placeholder tokens introduced
- [ ] Scope table matches actual edited files
- [ ] Verification evidence references included in completion artifacts

---

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Project Owner | Scope and acceptance owner | High | Async spec review |
| Standards Maintainer | Maintains `sk-code--opencode` | High | PR-level review |
| Review Skill Maintainer | Owns `sk-code--review` baseline | Medium | Optional alignment sync |
| Contributors using OpenCode standards | Daily users of guidance | High | Changelog and summary notes |

---

---

## 15. CHANGE LOG

### v1.0 (2026-02-22)

Initial Level 3+ specification created for `018-sk-code-opencode-refinement` with scoped requirements and governance controls.

---

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- None.

---
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`

---
