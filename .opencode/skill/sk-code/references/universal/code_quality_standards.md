---
title: Universal Code Quality Standards (P0/P1/P2 Severity Model)
description: Stack-agnostic severity tiers for code quality enforcement. Stack-specific rules (snake_case, BEM, naming) live under references/<stack>/.
keywords: [code-quality, severity, p0, p1, p2, gate, enforcement, universal, stack-agnostic]
---

# Universal Code Quality Standards

Stack-agnostic severity tiers used by the Phase 1.5 Code Quality Gate. Specific rules (naming conventions, file headers, custom property prefixes) live in stack-specific quality checklists; this doc defines only the severity contract.

> **Web stack note**: For Webflow-specific rules (snake_case, file headers, BEM naming, GPU-only animation, CDN-safe initialization), see `assets/web/checklists/code_quality_checklist.md` and `references/web/standards/code_style_enforcement.md`.

---

## 1. SEVERITY TIERS

The Code Quality Gate categorizes every quality rule into one of three tiers:

| Tier | Handling | Completion Impact |
|------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until fixed |
| **P1** | Required | Must fix OR get user approval to defer |
| **P2** | Optional | Can defer with documented reason |

**Gate Rule**: If ANY P0 item fails, completion is BLOCKED until fixed. P1 violations need explicit deferral approval. P2 violations are tracked but don't block.

---

## 2. P0 CATEGORIES (universal — apply across stacks)

P0 covers issues that have caused production incidents or operator confusion in the past:

1. **Initialization safety** — components must guard against double-initialization, race conditions, and partial loads
2. **Input validation** — all external inputs (function parameters, API responses, file contents, env vars) validated at boundaries
3. **No commented-out code** — delete it; commented code rots and confuses readers
4. **No silent failures** — exceptions either surface to the caller or are logged with enough context to debug
5. **Naming convention adherence** — stack-specific (snake_case for web JS, camelCase for TS, PascalCase for Go types, etc.)
6. **No hardcoded secrets** — credentials, API keys, tokens never inline; always env vars or secret stores

---

## 3. P1 CATEGORIES (universal)

P1 covers issues that degrade maintainability or reliability:

1. **Documentation completeness** — public APIs, exported types, complex algorithms have docstrings/comments explaining WHY
2. **Test coverage at boundaries** — happy path + at least one edge case per public surface
3. **Error message quality** — every error includes enough context for the operator to act
4. **Resource cleanup** — file handles, network connections, subscriptions, observers, timers all closed/canceled deterministically
5. **Type-safety enforcement** — language-appropriate (TS strict mode, Go vet clean, Swift no `Any`, Python type hints on public functions)

---

## 4. P2 CATEGORIES (universal)

P2 covers issues that improve quality but don't affect correctness or maintainability:

1. **Idiomatic refinements** — code follows community style guides (e.g. Effective Go, React idioms)
2. **Performance polish** — optimization beyond meeting NFR targets
3. **Test coverage beyond boundaries** — additional edge cases, fuzz tests, property tests
4. **Documentation completeness for internal helpers** — even private functions get explained

---

## 5. STACK-SPECIFIC OVERLAYS

Each stack has a quality checklist that adds stack-specific rules to these universal tiers:

| Stack | Checklist |
|---|---|
| WEB | `assets/web/checklists/code_quality_checklist.md` (Sections 2-7 JavaScript, Section 8 CSS) |
| GO / NODEJS / REACT / RN / SWIFT | `assets/<stack>/_placeholder.md` (canonical content retired) |

The stack overlay assigns specific severity (P0/P1/P2) to specific rules. This universal doc is the contract — stack overlays are the implementations.

---

## 6. WORKFLOW

When you reach Phase 1.5 Code Quality Gate:

1. **Identify file type and stack** (the smart router does this; or check via stack-detection commands)
2. **Load the matching stack checklist** (see §5)
3. **Validate every P0 item** — fix any failures before proceeding
4. **Validate every P1 item** — fix or document approved deferral
5. **Validate every P2 item** — track for follow-up; non-blocking
6. **Mark checklist items `[x]` with evidence** (the actual code passing the rule, or the test that proves it)
7. **Then proceed** to Phase 2 (Debugging) if issues, or Phase 3 (Verification)

---

## 7. RELATIONSHIP TO `sk-code-review`

This skill (`sk-code`) produces **overlay compliance evidence** at Phase 1.5. The formal **findings-first review output** (severity-ranked findings list, security/correctness/test minimums, risk reporting) belongs to `sk-code-review`.

Use `sk-code-review` when:
- A PR needs a structured review report
- Stakeholders need a severity-ranked findings list
- Security or correctness minimums need to be audited

Use this skill (`sk-code`) when:
- You're the author validating your own implementation against the quality bar before claiming done
- You need stack-specific quality rules applied during development

The two skills compose: `sk-code` overlays + `sk-code-review` baseline = full quality story.
