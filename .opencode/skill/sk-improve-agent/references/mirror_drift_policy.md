---
title: Mirror Drift Policy
description: Policy for handling runtime mirror drift after canonical improve-agent promotion.
---

# Mirror Drift Policy

Policy reference for handling runtime mirror drift after canonical mutation. Use it when packaging parity must be reviewed without confusing mirror-sync work with evaluator truth.

---

## 1. OVERVIEW

### Purpose

Defines how runtime-mirror drift should be reviewed and recorded after a canonical target changes.

### When to Use

Use this reference when:
- a canonical promotion has happened
- runtime mirrors may now be stale
- packaging parity work must be captured honestly

### Core Principle

Mirror drift is real maintenance work, but it is downstream from experiment truth and must not be mistaken for benchmark evidence.

---

## 2. POLICY

Runtime mirrors are not phase-one experiment targets. They are downstream packaging surfaces.

---

## 3. AFTER CANONICAL CHANGE

After a canonical promotion:

1. Run a drift review against `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`
2. Record the sync work under a packaging-specific note or follow-up packet
3. Decide whether to sync immediately or record explicit follow-up debt
4. Do not treat mirror changes as evaluator evidence for the original experiment

### Integration Scanner

Use `scan-integration.cjs` as the primary tool for detecting mirror drift. It replaces manual file-by-file comparison with automated signal-matching across all 3 runtime mirrors:

```text
node scripts/scan-integration.cjs --agent={agent-name}
```

The scanner reports `aligned`, `diverged`, or `missing` for each mirror surface based on signal string matching against the canonical body.

---

## 4. ALLOWED AND FORBIDDEN OUTCOMES

Allowed outcomes:
- immediate sync for packaging parity
- drift report plus follow-up packet
- packaging-only verification logs outside the benchmark ledger

Forbidden outcomes:
- quietly leaving mirror drift undocumented
- counting a mirror-sync success as proof that the canonical benchmark improved

---

## 5. RELATED RESOURCES

- `rollback_runbook.md`
- `promotion_rules.md`
- `../scripts/check-mirror-drift.cjs`

