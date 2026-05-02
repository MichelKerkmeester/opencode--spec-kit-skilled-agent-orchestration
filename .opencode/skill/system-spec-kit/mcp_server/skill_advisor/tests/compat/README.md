---
title: "Skill Advisor Compat Tests"
description: "Compatibility coverage for advisor daemon, plugin bridge, Python parity and redirect contracts."
trigger_phrases:
  - "skill advisor compat tests"
  - "advisor plugin bridge tests"
---

# Skill Advisor Compat Tests

> Compatibility coverage for advisor daemon, plugin bridge, Python parity and redirect contracts.

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

`tests/compat/` verifies compatibility seams around the TypeScript advisor, plugin bridge and Python fallback path.

Current state:

- Confirms daemon freshness probing in `lib/compat/daemon-probe.js`.
- Locks plugin bridge output shape and threshold metadata.
- Runs Python compatibility coverage through Vitest.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:directory-tree -->
## 2. DIRECTORY TREE

```text
compat/
+-- daemon-probe.vitest.ts          # Advisor daemon availability states
+-- plugin-bridge-smoke.vitest.ts   # Bridge smoke coverage
+-- plugin-bridge.vitest.ts         # Bridge contract and fallback coverage
+-- python-compat.vitest.ts         # Python suite runner from Vitest
+-- redirect-metadata.vitest.ts     # Redirect metadata compatibility
+-- shim.vitest.ts                  # Compatibility shim behavior
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `daemon-probe.vitest.ts` | Verifies live, stale, absent, unavailable and disabled daemon probe states. |
| `plugin-bridge.vitest.ts` | Checks bridge output, thresholds, routes and prompt privacy. |
| `python-compat.vitest.ts` | Runs `tests/python/test_skill_advisor.py` from the Vitest suite. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:validation -->
## 4. VALIDATION

Run from the repository root.

```bash
npx vitest run .opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat
```

Expected result: all compatibility tests pass.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 5. RELATED

- [`../README.md`](../README.md)
- [`../python/README.md`](../python/README.md)
- [`../../README.md`](../../README.md)

<!-- /ANCHOR:related -->
