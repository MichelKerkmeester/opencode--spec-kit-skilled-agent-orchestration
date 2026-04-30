---
title: Universal Code Quality Standards
description: Stack-agnostic P0/P1/P2 severity model for the Phase 1.5 Code Quality Gate.
---

# Universal Code Quality Standards

Stack-agnostic severity tiers used by the Phase 1.5 Code Quality Gate across WEBFLOW, NEXTJS, and GO.

---

## 1. OVERVIEW

### Purpose

Defines the severity contract that wraps every per-stack code quality checklist in `sk-code`. P0 blocks completion; P1 requires explicit deferral approval; P2 is tracked but non-blocking. Per-stack rules (snake_case for WEBFLOW JS, TypeScript strict for NEXTJS, gofmt + golangci-lint for GO) live in each stack's checklist; this doc captures the universal contract those checklists implement.

### Core Principle

Severity tiers exist so reviewers and authors agree on what blocks "done". A rule's severity is a stable contract: the bar doesn't move per-PR, per-author, or per-deadline.

### When to Use

- Before claiming Phase 1 (Implementation) complete — the Phase 1.5 Code Quality Gate.
- When authoring or reviewing per-stack quality checklists.
- When deciding whether a finding blocks merge or can ship as a follow-up.
- When `sk-code-review` produces severity-ranked findings — the contract here aligns those tiers.

### Key Sources

- Per-stack checklists: `assets/webflow/checklists/code_quality_checklist.md`, `assets/nextjs/checklists/code_quality_checklist.md`, `assets/go/checklists/code_quality_checklist.md`.
- Findings-first review baseline: `sk-code-review` skill (severity model and review output contract).

---

## 2. SEVERITY TIERS

The Code Quality Gate categorizes every quality rule into one of three tiers:

| Tier   | Handling      | Completion Impact                              |
| ------ | ------------- | ---------------------------------------------- |
| **P0** | HARD BLOCKER  | Cannot claim done until fixed                  |
| **P1** | Required      | Must fix OR get user approval to defer         |
| **P2** | Optional      | Can defer with documented reason; non-blocking |

**Gate rule**: if ANY P0 item fails, completion is BLOCKED until fixed. P1 violations need explicit deferral approval. P2 violations are tracked but don't block.

---

## 3. P0 CATEGORIES (universal — apply across stacks)

P0 covers issues that have caused production incidents or reviewer-author confusion in the past:

1. **Initialization safety** — components must guard against double-initialization, race conditions, and partial loads.
2. **Input validation** — all external inputs (function parameters, API responses, file contents, env vars) validated at boundaries.
3. **No commented-out code** — delete it; commented code rots and confuses readers.
4. **No silent failures** — exceptions either surface to the caller or are logged with enough context to debug.
5. **Naming convention adherence** — stack-specific (snake_case for WEBFLOW JS, camelCase for TypeScript, PascalCase for Go exported types, etc.).
6. **No hardcoded secrets** — credentials, API keys, tokens never inline; always env vars or secret stores.

---

## 4. P1 CATEGORIES (universal)

P1 covers issues that degrade maintainability or reliability:

1. **Documentation completeness** — public APIs, exported types, complex algorithms have docstrings or comments explaining WHY.
2. **Test coverage at boundaries** — happy path plus at least one edge case per public surface.
3. **Error message quality** — every error includes enough context for the operator to act.
4. **Resource cleanup** — file handles, network connections, subscriptions, observers, timers all closed or canceled deterministically.
5. **Type-safety enforcement** — language-appropriate (TypeScript strict mode, `go vet` clean, no `any`/`Any`, type hints on public functions).

---

## 5. P2 CATEGORIES (universal)

P2 covers issues that improve quality but don't affect correctness or maintainability:

1. **Idiomatic refinements** — code follows community style guides (Effective Go, React/Next.js idioms, Webflow vanilla-JS conventions).
2. **Performance polish** — optimization beyond meeting NFR targets.
3. **Test coverage beyond boundaries** — additional edge cases, fuzz tests, property tests.
4. **Documentation completeness for internal helpers** — even private functions get explained.

---

## 6. STACK-SPECIFIC OVERLAYS

Each stack has a quality checklist that adds stack-specific rules to these universal tiers:

| Stack    | Checklist                                          | Notes                                                                |
| -------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| WEBFLOW  | `assets/webflow/checklists/code_quality_checklist.md` | LIVE — JS sections (snake_case, file headers, CDN-safe init); CSS sections (semantic prefixes, BEM, GPU-only animation, `i` flag on data-attribute selectors) |
| NEXTJS   | `assets/nextjs/checklists/code_quality_checklist.md`  | STUB — TypeScript strict, no `any`, vanilla-extract recipes, server/client boundary, zod boundaries |
| GO       | `assets/go/checklists/code_quality_checklist.md`      | STUB — gofmt clean, golangci-lint clean, error wrapping with `%w`, context propagation, no naked goroutines |
| UNKNOWN  | n/a                                                | sk-code does not own Node.js / React Native / Swift; surface a disambiguation prompt |

The stack overlay assigns specific severity (P0/P1/P2) to specific rules. This universal doc is the contract — the stack overlays are the implementations.

---

## 7. WORKFLOW

When you reach Phase 1.5 Code Quality Gate:

1. Identify the file type and stack (the smart router does this; or check via the stack-detection block in SKILL.md §2).
2. Load the matching stack checklist (see §6).
3. Validate every P0 item — fix any failures before proceeding.
4. Validate every P1 item — fix or document approved deferral.
5. Validate every P2 item — track for follow-up; non-blocking.
6. Mark checklist items `[x]` with evidence (the actual code passing the rule, or the test that proves it).
7. Then proceed to Phase 2 (Debugging) if issues, or Phase 3 (Verification).

---

## 8. RELATIONSHIP TO `sk-code-review`

This skill (`sk-code`) produces **overlay compliance evidence** at Phase 1.5. The formal **findings-first review output** (severity-ranked findings list, security/correctness/test minimums, risk reporting) belongs to `sk-code-review`.

Use `sk-code-review` when:

- A PR needs a structured review report.
- Stakeholders need a severity-ranked findings list.
- Security or correctness minimums need to be audited.

Use this skill (`sk-code`) when:

- You are the author validating your own implementation against the quality bar before claiming done.
- You need stack-specific quality rules applied during development.

The two skills compose: `sk-code` overlays + `sk-code-review` baseline = full quality story.

---

## 9. RELATED RESOURCES

- `references/universal/code_style_guide.md` - language-agnostic naming, formatting, and structure principles.
- `references/universal/error_recovery.md` - decision tree when a quality gate failure can't be resolved in-place.
- `assets/universal/checklists/debugging_checklist.md` - applies after Phase 1.5 fails and you need root-cause analysis.
- `assets/universal/checklists/verification_checklist.md` - runs after Phase 1.5 clears, before any "done" claim.
- `references/router/phase_lifecycle.md` - Phase 1.5 position in the sk-code lifecycle.
- Per-stack quality checklists under `assets/{webflow,nextjs,go}/checklists/code_quality_checklist.md`.
