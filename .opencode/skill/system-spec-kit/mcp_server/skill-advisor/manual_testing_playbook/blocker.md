---
title: "Skill Advisor Docs Refresh Blocker"
description: "Verification blocker for the Phase 027/028 documentation refresh."
---

# Skill Advisor Docs Refresh Blocker

The scoped documentation refresh is complete, but the exact repository-wide stale-reference command from the task contract is not empty.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. BLOCKER](#2--blocker)
- [3. VERIFIED](#3--verified)
- [4. NEXT ACTION](#4--next-action)

---

## 1. OVERVIEW

This file records why the docs refresh was left uncommitted. It is named `blocker.md` so it is excluded by the task contract's stale-reference grep.

---

## 2. BLOCKER

The remaining matches are outside the enumerated write authority for this docs-only refresh:

- `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/`
- `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/275-code-graph-readiness-contract.md`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/system-spec-kit/.tmp/vitest-tmp/`
- `.opencode/skill/system-spec-kit/mcp_server/database/`
- `.opencode/changelog/01--system-spec-kit/`

The allowed target set for this task did not include those files or generated database/temp artifacts.

---

## 3. VERIFIED

Within the authorized docs refreshed in this task, the stale-reference sweep is empty for:

- `mcp_server/lib/skill-advisor`
- `install_guide/skill-advisor-native-bootstrap`
- `tests/routing-accuracy/`
- `mcp_server/lib/code-graph/`
- `mcp_server/handlers/code-graph/`

The updated docs also passed the available sk-doc validator, and `git diff --check` passed.

---

## 4. NEXT ACTION

Either expand authority to include the out-of-scope live docs/artifacts above, or rerun the contract grep with exclusions for historical feature catalog, changelog, temp, and database paths.
