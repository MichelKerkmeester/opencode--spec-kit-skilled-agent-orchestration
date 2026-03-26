---
title: "220 -- Constitutional Gate-Enforcement Rule Pack"
description: "This scenario validates Constitutional Gate-Enforcement Rule Pack for `220`. It focuses on verifying the always-surface constitutional memory preserves gate triggers, cross-references, and continuation or compaction recovery behavior."
---

# 220 -- Constitutional Gate-Enforcement Rule Pack

## 1. OVERVIEW

This scenario validates Constitutional Gate-Enforcement Rule Pack for `220`. It focuses on verifying the always-surface constitutional memory preserves gate triggers, cross-references, and continuation or compaction recovery behavior.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `220` and confirm the expected signals without contradicting evidence.

- Objective: Verify the always-surface constitutional memory preserves gate triggers, cross-references, and continuation or compaction recovery behavior
- Prompt: `Validate the constitutional gate-enforcement rule pack. Capture the evidence needed to prove the constitutional memory encodes file-modification, continuation, compaction, completion, and memory-save trigger phrases; cross-references the governing gates; includes continuation-validation and compaction-recovery overlays; and that the constitutional tier documentation guarantees top-of-results, non-decaying visibility for this rule pack. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: `gate-enforcement.md` declares constitutional importance and decision-style trigger metadata; the body includes gate cross-reference, continuation validation, compaction recovery, and quick-reference guidance; `constitutional/README.md` documents top-ranked, non-decaying constitutional surfacing semantics
- Pass/fail: PASS if the rule pack preserves the operational gate overlays and constitutional surfacing guarantees described in the catalog; FAIL if trigger coverage is incomplete, recovery guidance is absent, or constitutional visibility semantics are undocumented

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 220 | Constitutional Gate-Enforcement Rule Pack | Verify the always-surface constitutional memory preserves gate triggers, cross-references, and continuation or compaction recovery behavior | `Validate the constitutional gate-enforcement rule pack. Capture the evidence needed to prove the constitutional memory encodes file-modification, continuation, compaction, completion, and memory-save trigger phrases; cross-references the governing gates; includes continuation-validation and compaction-recovery overlays; and that the constitutional tier documentation guarantees top-of-results, non-decaying visibility for this rule pack. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Inspect `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` frontmatter and capture the constitutional importance tier, content type, and trigger-phrase coverage 2) Inspect the body of `gate-enforcement.md` and confirm the gate cross-reference table, continuation-validation workflow, compaction-recovery guidance, and quick-reference behavior are present 3) Inspect `.opencode/skill/system-spec-kit/constitutional/README.md` and confirm it documents constitutional ranking, fixed similarity, no decay, permanence, and budget/verification rules 4) Cross-check the rule-pack references against `AGENTS.md` Section 2 to confirm the constitutional pack points back to the authoritative gate contract | `gate-enforcement.md` declares constitutional importance and decision-style trigger metadata; the body includes gate cross-reference, continuation validation, compaction recovery, and quick-reference guidance; `constitutional/README.md` documents top-ranked, non-decaying constitutional surfacing semantics | Frontmatter capture from `gate-enforcement.md` + notes/snippets for cross-reference and recovery sections + constitutional README evidence + cross-check notes against `AGENTS.md` Section 2 | PASS if the rule pack preserves the operational gate overlays and constitutional surfacing guarantees described in the catalog; FAIL if trigger coverage is incomplete, recovery guidance is absent, or constitutional visibility semantics are undocumented | Verify `gate-enforcement.md` frontmatter still includes constitutional tier and trigger phrases -> inspect the gate cross-reference and continuation/compaction sections for accidental removal -> confirm `constitutional/README.md` still documents fixed-priority surfacing semantics -> check `AGENTS.md` Section 2 remains the referenced authoritative source |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [17--governance/05-constitutional-gate-enforcement-rule-pack.md](../../feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 220
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `17--governance/220-constitutional-gate-enforcement-rule-pack.md`
