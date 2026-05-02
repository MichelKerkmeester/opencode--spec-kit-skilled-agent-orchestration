---
title: "Skill Advisor Python Tests"
description: "Direct Python coverage for skill advisor scripts and regression helpers."
trigger_phrases:
  - "skill advisor python tests"
  - "test_skill_advisor.py"
---

# Skill Advisor Python Tests

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. VALIDATION](#4--validation)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`tests/python/` runs direct script-level coverage for the Python skill advisor implementation and helper scripts.

Current state:

- Loads Python modules from `skill_advisor/scripts/` by file path.
- Exercises `analyze_prompt`, `analyze_batch`, `health_check`, `get_skills` and helper modules.
- Reports pass and fail counts through a standalone Python test harness.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:directory-tree -->
## 2. DIRECTORY TREE

```text
python/
+-- test_skill_advisor.py  # Direct Python script coverage
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `test_skill_advisor.py` | Loads advisor Python scripts and validates core functions, health states, regression metrics and JSONL helpers. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:validation -->
## 4. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/python/test_skill_advisor.py
```

Expected result: the harness exits 0 and prints passing checks.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 5. RELATED

- [`../compat/README.md`](../compat/README.md)
- [`../parity/README.md`](../parity/README.md)
- [`../../README.md`](../../README.md)

<!-- /ANCHOR:related -->
