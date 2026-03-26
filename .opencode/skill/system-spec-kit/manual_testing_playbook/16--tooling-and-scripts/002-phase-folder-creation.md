---
title: "PHASE-002 -- Phase folder creation"
description: "This scenario validates Phase folder creation for `PHASE-002`. It focuses on Run `create.sh \"Test\" --phase --level 3 --phases 3` and verify parent+children structure."
---

# PHASE-002 -- Phase folder creation

## 1. OVERVIEW

This scenario validates Phase folder creation for `PHASE-002`. It focuses on Run `create.sh "Test" --phase --level 3 --phases 3` and verify parent+children structure.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `PHASE-002` and confirm the expected signals without contradicting evidence.

- Objective: Run `create.sh "Test" --phase --level 3 --phases 3` and verify parent+children structure
- Prompt: `Create a phase-decomposed spec folder and verify parent and child structure. Capture the evidence needed to prove Parent folder with Phase Documentation Map in spec.md; 3 child folders with correct naming; back-references and predecessor/successor links in child spec.md files; Level 3 template files in all folders. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Parent folder with Phase Documentation Map in spec.md; 3 child folders with correct naming; back-references and predecessor/successor links in child spec.md files; Level 3 template files in all folders
- Pass/fail: PASS if parent contains Phase Documentation Map listing all 3 children, each child has parent back-reference, middle child has both predecessor and successor links, and all folders contain Level 3 templates

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PHASE-002 | Phase folder creation | Run `create.sh "Test" --phase --level 3 --phases 3` and verify parent+children structure | `Create a phase-decomposed spec folder and verify parent and child structure. Capture the evidence needed to prove Parent folder with Phase Documentation Map in spec.md; 3 child folders with correct naming; back-references and predecessor/successor links in child spec.md files; Level 3 template files in all folders. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh "Phase Test" --phase --level 3 --phases 3 --phase-names "Design,Implement,Verify"` 2) Verify parent folder `specs/NNN-phase-test/` exists with spec.md containing Phase Documentation Map 3) Verify 3 child folders `001-design/`, `002-implement/`, `003-verify/` exist under parent 4) Verify each child has spec.md with parent back-reference 5) Verify `002-implement/spec.md` has predecessor link to `001-design` and successor link to `003-verify` 6) Verify Level 3 template files present in parent and each child | Parent folder with Phase Documentation Map in spec.md; 3 child folders with correct naming; back-references and predecessor/successor links in child spec.md files; Level 3 template files in all folders | Command transcript + `ls -R` of created structure + spec.md excerpts showing links | PASS if parent contains Phase Documentation Map listing all 3 children, each child has parent back-reference, middle child has both predecessor and successor links, and all folders contain Level 3 templates | Check create.sh supports --phase flag; verify --phase-names parsing; inspect template directory for Level 3 files; check folder naming collision with existing specs |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: PHASE-002
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/002-phase-folder-creation.md`
