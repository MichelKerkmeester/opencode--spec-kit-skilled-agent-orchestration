---
title: SOLID and Architecture Checklist
description: Review prompts and smell patterns for evaluating architecture cohesion, coupling, and extensibility risks.
---

# SOLID and Architecture Checklist

Review prompts and smell patterns for evaluating architecture cohesion, coupling, and extensibility risks.

---

## 1. OVERVIEW

### Purpose

Provide repeatable prompts to detect structural issues that create long-term maintenance risk.

### Core Principle

Favor cohesive modules and low-coupling boundaries so behavior can evolve without broad side effects.

### Scope

Use this checklist for new modules, refactors, and behavior-heavy changes where design quality can regress silently.

---

## 2. SOLID PROMPTS

### SRP - Single Responsibility

- Module mixes unrelated concerns (domain rules, persistence, transport).
- Class/function has multiple reasons to change.
- A single function orchestrates unrelated workflows.
- **Question**: "What single reason would require this module to change?"

### OCP - Open/Closed

- Adding variants requires editing multiple switch/if branches.
- Extension points are missing where behavior naturally varies.
- New feature requests force edits in stable core logic.
- **Question**: "Can a new variant be added without changing existing behavior paths?"

### LSP - Liskov Substitution

- Subclass weakens contract or breaks caller expectations.
- Subclass requires caller type checks before safe use.
- Overridden method throws in cases base class supports.
- **Question**: "Can any subtype replace the base type without surprises?"

### ISP - Interface Segregation

- Interface is broad and most consumers use only a subset.
- Implementers contain unused stubs/no-op methods.
- Callers import large contracts for narrow needs.
- **Question**: "Can this interface be split into smaller capability contracts?"

### DIP - Dependency Inversion

- Business logic depends directly on infrastructure types.
- High-level code instantiates concrete adapters inline.
- Testing requires heavy setup due to tight coupling.
- **Question**: "Can the implementation be swapped without touching policy logic?"

---

## 3. ARCHITECTURE SMELLS

| Smell | Indicators | Typical Risk |
| --- | --- | --- |
| God module | Large file with many unrelated responsibilities | High change blast radius |
| Shotgun surgery | One change touches many distant files | Fragile evolution |
| Divergent change | One file changed for unrelated feature classes | Poor cohesion |
| Speculative abstraction | Unused indirection for hypothetical needs | Complexity without value |
| Feature envy | Logic manipulates another module's data heavily | Wrong ownership boundaries |

Quick check: if naming the module's purpose requires "and", it likely violates SRP.
KISS/DRY tie-in: if two modules differ only by literals or thin wrappers, consolidate before adding new abstraction layers.

---

## 4. REFACTOR GUIDANCE

1. Split by responsibility, not line count.
2. Preserve behavior first; refactor second.
3. Prefer composition over inheritance when behavior differs.
4. Extract interfaces only when multiple implementations are real.
5. Keep refactors incremental and test-backed.

When suggesting a refactor, include:
- Current risk
- Minimal safe split
- Verification strategy

---

## 5. RELATED RESOURCES

- [quick_reference.md](./quick_reference.md) - Baseline review flow and severity mapping.
- [security_checklist.md](./security_checklist.md) - Security and runtime risk checks.
- [code_quality_checklist.md](./code_quality_checklist.md) - Correctness and performance checklist.
- [removal_plan.md](./removal_plan.md) - Safe deletion and deferred migration planning.

Overlay portability: combine architecture findings with overlay-specific standards from `sk-code-opencode` or `sk-code`.
