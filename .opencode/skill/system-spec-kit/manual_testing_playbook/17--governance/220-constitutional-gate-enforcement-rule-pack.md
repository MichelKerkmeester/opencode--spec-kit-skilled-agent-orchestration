---
title: "220 -- Constitutional Gate-Enforcement Rule Pack"
description: "This scenario validates Constitutional Gate-Enforcement Rule Pack for `220`. It focuses on verifying the always-surface constitutional memory preserves gate triggers, cross-references, and continuation or compaction recovery behavior."
audited_post_018: true
---

# 220 -- Constitutional Gate-Enforcement Rule Pack

## 1. OVERVIEW

This scenario validates Constitutional Gate-Enforcement Rule Pack for `220`. It focuses on verifying the always-surface constitutional memory preserves gate triggers, cross-references, and continuation or compaction recovery behavior.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `220` and confirm the expected signals without contradicting evidence.

- Objective: Verify the always-surface constitutional memory preserves gate triggers, cross-references, and continuation or compaction recovery behavior
- Prompt: `As a governance validation operator, validate Constitutional Gate-Enforcement Rule Pack against .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md. Verify the always-surface constitutional memory preserves gate triggers, cross-references, and continuation or compaction recovery behavior. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: `gate-enforcement.md` declares constitutional importance and decision-style trigger metadata; the body includes gate cross-reference, continuation validation, compaction recovery, and quick-reference guidance; `constitutional/README.md` documents top-ranked, non-decaying constitutional surfacing semantics
- Pass/fail: PASS if the rule pack preserves the operational gate overlays and constitutional surfacing guarantees described in the catalog; FAIL if trigger coverage is incomplete, recovery guidance is absent, or constitutional visibility semantics are undocumented

---

## 3. TEST EXECUTION

### Prompt

```
As a governance validation operator, verify the always-surface constitutional memory preserves gate triggers, cross-references, and continuation or compaction recovery behavior against .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md. Verify gate-enforcement.md declares constitutional importance and decision-style trigger metadata; the body includes gate cross-reference, continuation validation, compaction recovery, and quick-reference guidance; constitutional/README.md documents top-ranked, non-decaying constitutional surfacing semantics. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Inspect `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` frontmatter and capture the constitutional importance tier, content type, and trigger-phrase coverage
2. Inspect the body of `gate-enforcement.md` and confirm the gate cross-reference table, continuation-validation workflow, compaction-recovery guidance, and quick-reference behavior are present
3. Inspect `.opencode/skill/system-spec-kit/constitutional/README.md` and confirm it documents constitutional ranking, fixed similarity, no decay, permanence, and budget/verification rules
4. Cross-check the rule-pack references against `AGENTS.md` Section 2 to confirm the constitutional pack points back to the authoritative gate contract

### Expected

`gate-enforcement.md` declares constitutional importance and decision-style trigger metadata; the body includes gate cross-reference, continuation validation, compaction recovery, and quick-reference guidance; `constitutional/README.md` documents top-ranked, non-decaying constitutional surfacing semantics

### Evidence

Frontmatter capture from `gate-enforcement.md` + notes/snippets for cross-reference and recovery sections + constitutional README evidence + cross-check notes against `AGENTS.md` Section 2

### Pass / Fail

- **Pass**: the rule pack preserves the operational gate overlays and constitutional surfacing guarantees described in the catalog
- **Fail**: trigger coverage is incomplete, recovery guidance is absent, or constitutional visibility semantics are undocumented

### Failure Triage

Verify `gate-enforcement.md` frontmatter still includes constitutional tier and trigger phrases -> inspect the gate cross-reference and continuation/compaction sections for accidental removal -> confirm `constitutional/README.md` still documents fixed-priority surfacing semantics -> check `AGENTS.md` Section 2 remains the referenced authoritative source

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [17--governance/05-constitutional-gate-enforcement-rule-pack.md](../../feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 220
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `17--governance/220-constitutional-gate-enforcement-rule-pack.md`
