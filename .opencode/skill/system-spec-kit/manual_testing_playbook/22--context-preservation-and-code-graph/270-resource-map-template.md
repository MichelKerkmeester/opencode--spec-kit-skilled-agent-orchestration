---
title: "270 -- Resource map template"
description: "This scenario validates the resource-map template rollout across the template, discovery, and spec-document classification surfaces."
audited_post_018: true
---

# 270 -- Resource map template

## 1. OVERVIEW

This scenario validates the resource-map template rollout.

---

## 2. CURRENT REALITY

- **Objective**: Verify that `templates/resource-map.md` exists on disk, that every intended discovery surface references it, and that the spec-document classifier recognizes `resource-map.md` as a canonical packet document.
- **Prerequisites**:
  - Working directory is the project root
  - `templates/resource-map.md` exists
  - The rollout edits are present in the documented template, guide, reference, and config surfaces
- **Prompt**: `As a context-preservation validation operator, validate the Resource map template rollout against Manual: confirm the cross-cutting template exists, that the discovery surfaces and CLAUDE.md reference resource-map.md, and that the spec-doc classifier includes resource-map.md. Return a concise pass/fail verdict with the main reason and cited evidence.`
- **Expected signals**:
  - `test -f` confirms `templates/resource-map.md` exists
  - `rg -n "resource-map\\.md"` returns matches in the targeted template, guide, reference, config, and runtime instruction surfaces
  - `mcp_server/lib/config/spec-doc-paths.ts` contains `resource-map.md` in `SPEC_DOCUMENT_FILENAMES`
- **Pass/fail criteria**:
  - PASS: the template exists, every target discovery surface references it, and the spec-doc classifier includes it
  - FAIL: the template is missing, any required surface has no match, or the classifier omits it

---

## 3. TEST EXECUTION

### Prompt

```
Validate 270a resource-map template exists on disk
```

### Commands

1. `test -f .opencode/skill/system-spec-kit/templates/resource-map.md && echo PRESENT`

### Expected

`PRESENT`

### Evidence

Command output showing the template exists on disk

### Pass / Fail

- **Pass**: the command prints `PRESENT`
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Confirm the template path was not renamed or deleted and compare it against the rollout spec before patching

---

### Prompt

```
Validate 270b every discovery surface references resource-map.md
```

### Commands

1. `rg -n "resource-map\\.md" .opencode/skill/system-spec-kit/templates/ .opencode/skill/system-spec-kit/SKILL.md .opencode/skill/system-spec-kit/README.md .opencode/skill/system-spec-kit/references/templates/level_specifications.md .opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts CLAUDE.md`

### Expected

Matches in every target, including the templates directory, `SKILL.md`, `README.md`, `references/templates/level_specifications.md`, `mcp_server/lib/config/spec-doc-paths.ts`, and `CLAUDE.md`

### Evidence

Grep output with at least one `resource-map.md` match per target surface

### Pass / Fail

- **Pass**: all listed targets return at least one match
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Patch whichever documentation or config surface drifted, then rerun the grep to confirm coverage is complete

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/25-resource-map-template.md](../../feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 270
- Canonical root source: manual_testing_playbook.md
- Feature file path: 22--context-preservation-and-code-graph/25-resource-map-template.md
