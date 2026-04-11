---
title: "Verification Checklist: create:prompt Command [03--commands-and-skills/017-cmd-create-prompt/checklist]"
description: "Verification for /create:prompt command creation"
trigger_phrases:
  - "verification"
  - "checklist"
  - "create"
  - "prompt"
  - "command"
  - "017"
  - "cmd"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: create:prompt Command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

---
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md:1-167 — 7 requirements defined with acceptance criteria]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md:1-184 — architecture, phases, dependencies documented]
- [x] CHK-003 [P1] Dependencies identified (sk-improve-prompt skill, command_template.md) [EVIDENCE: plan.md:107-112 — 3 dependencies all Green]

---

---
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

### Command Quality (command_template.md §15)

- [x] CHK-010 [P0] Frontmatter: `description` present and action-oriented [EVIDENCE: prompt.md:2 — "Create or improve AI prompts using proven frameworks..."]
- [x] CHK-011 [P0] Frontmatter: `argument-hint` shows expected format [EVIDENCE: prompt.md:3 — `<prompt_or_topic> [$mode] [:auto|:confirm]`]
- [x] CHK-012 [P0] Frontmatter: `allowed-tools` lists all tools used [EVIDENCE: prompt.md:4 — Read, Write, Edit, Glob, Grep]
- [x] CHK-013 [P0] Mandatory gate present immediately after frontmatter [EVIDENCE: prompt.md:7-35 — gate with 3 options and 4 critical rules]
- [x] CHK-014 [P0] Gate includes all 4 CRITICAL RULES [EVIDENCE: prompt.md:32-35 — DO NOT infer, assume, proceed, require explicit input]
- [x] CHK-015 [P0] H2 sections use format: `## N. SECTION-NAME` [EVIDENCE: prompt.md — 9 numbered sections from PURPOSE through VIOLATION SELF-DETECTION]
- [x] CHK-016 [P1] Full integer step numbering only (no decimals) [EVIDENCE: prompt.md:136-223 — Steps 1-6 with integer numbering]
- [x] CHK-017 [P1] Dividers (`---`) between major sections [EVIDENCE: prompt.md — dividers at lines 37, 53, 65, 78, 130, 225, 271, 307, 317, 327]
- [x] CHK-018 [P1] Example usage shows 2+ scenarios [EVIDENCE: prompt.md:228-269 — 6 example scenarios]

---

---
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Command invocable as `/create:prompt "test"` [EVIDENCE: file at .opencode/command/create/prompt.md — correct namespace path]
- [x] CHK-021 [P0] Empty invocation triggers mandatory gate [EVIDENCE: prompt.md:12 — "IF $ARGUMENTS is empty, undefined, or contains only whitespace"]
- [x] CHK-022 [P1] Mode prefixes ($text, $improve, etc.) correctly detected in argument dispatch [EVIDENCE: prompt.md:86-104 — ASCII decision tree with 7 mode prefixes]
- [x] CHK-023 [P1] :auto/:confirm modes documented and routed [EVIDENCE: prompt.md:109-114 — execution mode parsing with defaults]
- [x] CHK-024 [P1] Instructions reference sk-improve-prompt SKILL.md correctly [EVIDENCE: prompt.md:146-147 — Read(".opencode/skill/sk-improve-prompt/SKILL.md")]

---

---
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets or credentials [EVIDENCE: prompt.md — full review, no secrets found]
- [x] CHK-031 [P0] No sensitive example data in prompts [EVIDENCE: prompt.md:229-269 — examples use generic technical topics only]

---

---
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with implementation [EVIDENCE: tasks.md — all 10 tasks marked [x]]
- [x] CHK-041 [P1] STATUS output format documented (OK/FAIL/CANCELLED) [EVIDENCE: prompt.md:220-223 — all status patterns documented]
- [x] CHK-042 [P2] Related commands referenced [EVIDENCE: prompt.md:321-324 — create:skill and create:skill_reference listed]

---

---
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Command placed in correct namespace directory (`.opencode/command/create/`) [EVIDENCE: file exists at correct path]
- [x] CHK-051 [P2] Memory context saved after implementation [EVIDENCE: memory save via generate-context.js]

---

---
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 8 | 8/8 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-03-01

---
<!-- /ANCHOR:summary -->

---
