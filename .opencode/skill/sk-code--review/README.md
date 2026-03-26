---
title: "sk-code--review: Code Review Baseline"
description: "Stack-agnostic code review baseline with findings-first severity analysis, mandatory security and correctness minimums, and overlay compatibility with sk-code--opencode, sk-code--web, and sk-code--full-stack."
trigger_phrases:
  - code review
  - pr review
  - review
  - audit
  - security review
  - quality gate
  - merge readiness
  - findings
  - blocking issues
  - request changes
---

# sk-code--review

> Universal code review baseline that produces severity-ordered findings with file:line evidence, enforcing security and correctness minimums across any stack.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

1. [OVERVIEW](#1--overview)
2. [QUICK START](#2--quick-start)
3. [FEATURES](#3--features)
4. [STRUCTURE](#4--structure)
5. [CONFIGURATION](#5--configuration)
6. [USAGE EXAMPLES](#6--usage-examples)
7. [TROUBLESHOOTING](#7--troubleshooting)
8. [FAQ](#8--faq)
9. [RELATED DOCUMENTS](#9--related-documents)
<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`sk-code--review` is the `sk-code` baseline skill for code review. It operates on a baseline-plus-overlay model: this skill enforces security, correctness, and severity-ranking rules that apply to every stack, while a single `sk-code--*` overlay skill (opencode, web, or full-stack) supplies the stack-specific conventions, verification commands, and process rules.

Every review begins with findings, not summaries. Findings carry severity labels (P0, P1, P2), file:line evidence, risk descriptions, and recommended fixes. The output contract requires an explicit overall assessment (APPROVE, REQUEST_CHANGES, or COMMENT) plus a clear next-action request before any implementation follow-up begins.

The skill uses weighted intent scoring to select which reference files to load. Security and quality signals load their respective checklists automatically. Deep architecture concerns load the SOLID checklist. Removal requests load the removal plan template. For ambiguous tasks, a disambiguation checklist prompts the reviewer to confirm scope, risk priority, architecture lens, and desired output mode before analysis starts.

### Key Statistics

| Attribute       | Value                                                                                 |
| --------------- | ------------------------------------------------------------------------------------- |
| Version         | 1.2.0.0                                                                               |
| Allowed tools   | Read, Write, Edit, Bash, Glob, Grep                                                   |
| Reference files | 8 (review_core, review_ux_single_pass, security, code quality, SOLID, removal, test quality, quick reference) |
| Overlay skills  | sk-code--opencode, sk-code--web, sk-code--full-stack                                  |
| Severity levels | P0 (Critical), P1 (High), P2 (Advisory)                                               |

### How This Compares

| Skill                   | Role                                                  |
| ----------------------- | ----------------------------------------------------- |
| `sk-code--review`       | Baseline security and correctness always applied      |
| `sk-code--opencode`     | Overlay for OpenCode system code context              |
| `sk-code--web`          | Overlay for frontend and web context                  |
| `sk-code--full-stack`   | Overlay for general multi-stack context               |

### Key Features

| Feature                         | Description                                                              |
| ------------------------------- | ------------------------------------------------------------------------ |
| Findings-first output           | Findings are ordered before summaries in every review report             |
| Severity contract               | P0/P1/P2 labels with file:line evidence and recommended fixes            |
| Baseline-plus-overlay model     | Security minimums always enforced. Overlay wins on style conflicts       |
| Weighted intent scoring         | Selects relevant reference files based on task signals                   |
| Disambiguation checklist        | Prompts for scope, risk class, and stack when signals are ambiguous      |
| Output contract                 | Structured report with assessment, overlay disclosure, and next step     |

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->
## 2. QUICK START

1. **Activate the skill.** Gate 2 routes to `sk-code--review` when the request contains review, audit, quality gate, security review, or merge readiness signals. You can also invoke it directly: `Read(".opencode/skill/sk-code--review/SKILL.md")`.

2. **Identify the overlay.** The skill detects the stack from task text and workspace files. OpenCode system context loads `sk-code--opencode`. Frontend context loads `sk-code--web`. All other stacks default to `sk-code--full-stack`. Confirm the detected overlay before scoring.

3. **Run the review.** The skill loads baseline references (review_core, review_ux_single_pass, security_checklist, code_quality_checklist) and any conditional references matched by intent scoring. Analysis runs in four phases: scope and baseline, overlay alignment, findings-first analysis, and output contract.

4. **Receive the report.** The report opens with files reviewed, overall assessment, and overlay skill disclosed. Findings follow in P0/P1/P2 order with evidence. A removal or iteration plan and explicit next-step request close the report.

---

<!-- /ANCHOR:quick-start -->

<!-- ANCHOR:features -->
## 3. FEATURES

---

### 3.1 FEATURE HIGHLIGHTS

The baseline-plus-overlay model is the core architectural decision in this skill. Security and correctness minimums belong to the baseline and cannot be relaxed by any overlay. Style preferences, process conventions, and verification commands belong to the overlay and override the baseline on conflicts. When a conflict cannot be resolved deterministically, the skill escalates rather than guessing, because a wrong precedence decision produces misleading review output.

Intent scoring drives reference loading. The skill reads the task text and assigns weighted scores across seven intent categories: SECURITY, QUALITY, KISS, DRY, SOLID, REMOVAL, and TESTING. The top-scoring intents (up to two when the score delta is within 1.0) determine which reference files load. This keeps each review focused and avoids loading the full reference set for simple tasks. A "deep review" or "full review" keyword overrides this and loads everything.

Findings-first discipline means the review report always leads with findings. This is not a cosmetic rule. A summary at the top buries risk information under positive framing and can cause reviewers to approve without reading the evidence. Every actionable finding includes file:line, risk description, user impact, and a concrete recommended fix. Vague findings without evidence are a hard violation of the output contract.

The disambiguation checklist handles ambiguous requests. When total intent scores fall below 0.5, the skill requests five pieces of information: review target scope, primary risk class, architecture lens priority, stack context, and whether the output should be findings-only or findings with a fix follow-up. This prevents the skill from producing a generic review that does not match what the requester actually needs.

### 3.2 FEATURE REFERENCE

**Intent Scoring Weights**

| Intent    | Weight | Key Signal Keywords                                               |
| --------- | ------ | ----------------------------------------------------------------- |
| SECURITY  | 5      | security, auth, injection, vulnerability, race                    |
| QUALITY   | 4      | correctness, bug, regression, performance, boundary, contract     |
| KISS      | 3      | kiss, simple, simplicity, over-engineer                           |
| DRY       | 3      | dry, duplication, duplicate, copy-paste, repeated logic           |
| SOLID     | 3      | solid, architecture, coupling, cohesion, abstraction              |
| REMOVAL   | 3      | remove, dead code, cleanup, deprecate                             |
| TESTING   | 3      | test, coverage, assertion, mock, stub, fixture                    |

**Reference Loading Levels**

| Level       | When to Load                           | Resources Loaded                                                                  |
| ----------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| ALWAYS      | Every invocation                       | review_core, review_ux_single_pass, security_checklist, code_quality_checklist    |
| CONDITIONAL | Intent score indicates need            | solid_checklist, removal_plan, test_quality_checklist                             |
| ON_DEMAND   | "deep review" or "full review" keyword | Full mapped reference set                                                         |

**Precedence Matrix**

| Rule Type                           | Source of Truth               | Behavior                                         |
| ----------------------------------- | ----------------------------- | ------------------------------------------------ |
| Security and correctness minimums   | sk-code baseline (this skill) | Always enforced, never relaxed by overlay        |
| Stack style and process conventions | Overlay skill                 | Overlay guidance overrides baseline on conflict  |
| Verification and build commands     | Overlay skill                 | Overlay commands are authoritative               |
| Ambiguous conflicts                 | Escalation                    | Ask for clarification, do not guess              |

**Output Report Sections**

| Section                                              | Required           |
| ---------------------------------------------------- | ------------------ |
| Files reviewed and line count                        | Yes                |
| Overall assessment (APPROVE / REQUEST_CHANGES / COMMENT) | Yes            |
| Baseline and overlay skill disclosed                 | Yes                |
| P0 findings with evidence                            | Yes                |
| P1 findings with evidence                            | Yes                |
| P2 findings (advisory)                               | When present       |
| Removal or iteration plan                            | When applicable    |
| Next step request                                    | Yes                |

---

<!-- /ANCHOR:features -->

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```
.opencode/skill/sk-code--review/
├── SKILL.md                            # Skill definition, routing logic, rules
├── README.md                           # This file
└── references/
    ├── review_core.md                  # Shared review doctrine: severity model, evidence rules, precedence
    ├── review_ux_single_pass.md        # Interactive single-pass review flow and PR behavior
    ├── quick_reference.md              # Lightweight routing index between doctrine and UX guidance
    ├── security_checklist.md           # Mandatory security and reliability checks
    ├── code_quality_checklist.md       # Correctness, performance, KISS, and DRY checks
    ├── solid_checklist.md              # SOLID (SRP/OCP/LSP/ISP/DIP) and architecture assessment
    ├── removal_plan.md                 # Safe-now vs deferred removal planning template
    └── test_quality_checklist.md       # Test quality, coverage, and anti-pattern detection
```

---

<!-- /ANCHOR:structure -->

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

This skill does not use a configuration file. All routing behavior is controlled by the intent scoring weights and resource map defined in SKILL.md Section 2 (SMART ROUTING).

**Overlay detection** is derived from task text and workspace file paths. To force a specific overlay, include an explicit signal in your request (for example: "review this opencode system file", "review this frontend code", or "review using the full-stack overlay").

**Output mode** defaults to findings-first with a next-step request. If you want findings plus an immediate fix follow-up in a single pass, state that in your request. The skill confirms the mode before proceeding.

**Scope** defaults to whatever diff, file list, or commit range you provide. If no scope is specified and signals are ambiguous, the disambiguation checklist runs first.

---

<!-- /ANCHOR:configuration -->

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Example 1: PR review with automatic overlay detection**

```
Review this PR diff. The changes are in .opencode/skill/sk-code--opencode/.

# The skill detects the opencode context, loads sk-code--opencode as overlay,
# runs security and quality checks, and produces a P0/P1/P2 findings report.
```

**Example 2: Security-focused review**

```
Security review for the authentication module in src/auth.js.

# SECURITY intent scores highest (weight 5).
# Loads security_checklist.md in addition to always-loaded references.
# Output leads with authentication vulnerabilities and injection risks.
```

**Example 3: Architecture review with SOLID analysis**

```
Review the module boundaries in src/services/. Check coupling, cohesion, and interface design.

# SOLID intent scores highest (weight 3).
# Loads solid_checklist.md conditionally.
# Output includes SRP/OCP/ISP/DIP violations with evidence at file:line.
```

---

<!-- /ANCHOR:usage-examples -->

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

**What you see:** Review output starts with a summary paragraph before findings.
**Common causes:** Output contract not followed. The skill produced a non-standard report format.
**Fix:** Findings must appear before any summary. Re-invoke with "show findings first, no preamble". The output contract requires findings to lead.

---

**What you see:** Overlay skill not disclosed in the report header.
**Common causes:** Stack detection was ambiguous and the disambiguation checklist was skipped.
**Fix:** Check that the report header includes a "Baseline used" and "Overlay skill used" line. If missing, the review is incomplete. Re-run and confirm the stack context explicitly in your request.

---

**What you see:** P0 finding present but the overall assessment is APPROVE.
**Common causes:** The skill produced a contradictory report. APPROVE with an unaddressed P0 is a hard rule violation.
**Fix:** Any P0 (Critical) finding blocks APPROVE. The assessment must be REQUEST_CHANGES when P0 findings are present. If you see this, the review did not follow the output contract and must be re-run.

---

**What you see:** Disambiguation checklist appears when you expected a review to start immediately.
**Common causes:** Total intent scores fell below 0.5, meaning the request did not contain enough signal keywords.
**Fix:** Answer the five checklist questions: review scope, risk class, architecture lens, stack context, and output mode. The skill needs this information to produce a relevant review rather than a generic one.

---

<!-- /ANCHOR:troubleshooting -->

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Why does the skill load a second overlay skill instead of handling everything itself?**

A: Security and correctness rules are universal. Style rules, process conventions, and verification commands are stack-specific. Separating these responsibilities prevents the baseline from needing to know every stack's conventions. The overlay handles what the baseline cannot know without stack context. This also means the security minimums never change regardless of which stack you are reviewing.

**Q: Can I use this skill without an overlay for a quick check?**

A: Yes. If you request a review and stack detection produces no strong signal, the skill defaults to `sk-code--full-stack` as the overlay. You can also state "no stack-specific rules needed" and the skill will run baseline-only checks covering security, correctness, KISS, DRY, and test quality. The findings format and severity model remain the same.

**Q: What happens if baseline and overlay guidance conflict?**

A: The precedence matrix resolves most conflicts automatically. Security and correctness minimums always belong to the baseline. Style, process, and verification commands always belong to the overlay. If a conflict falls outside those categories and cannot be resolved deterministically, the skill escalates and asks which source of truth prevails before continuing.

---

<!-- /ANCHOR:faq -->

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

| Resource                                                                                 | Purpose                                                    |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [SKILL.md](./SKILL.md)                                                                   | Full skill definition with routing logic and rules         |
| [references/review_core.md](./references/review_core.md)                                 | Shared review doctrine, severity model, evidence rules     |
| [references/review_ux_single_pass.md](./references/review_ux_single_pass.md)             | Interactive single-pass review flow and PR behavior        |
| [references/security_checklist.md](./references/security_checklist.md)                   | Mandatory security and reliability checks                  |
| [references/code_quality_checklist.md](./references/code_quality_checklist.md)           | Correctness, KISS, DRY checks                              |
| [references/solid_checklist.md](./references/solid_checklist.md)                         | SOLID and architecture assessment                          |
| [references/test_quality_checklist.md](./references/test_quality_checklist.md)           | Test quality and anti-pattern detection                    |
| [sk-code--web SKILL.md](../sk-code--web/SKILL.md)                                        | Web and frontend overlay standards                         |
| [sk-code--opencode SKILL.md](../sk-code--opencode/SKILL.md)                              | OpenCode system code overlay standards                     |
| [sk-code--full-stack SKILL.md](../sk-code--full-stack/SKILL.md)                          | Default multi-stack overlay standards                      |
| [.opencode/agent/review.md](../../agent/review.md)                                       | Runtime review agent contract                              |

---

<!-- /ANCHOR:related-documents -->
