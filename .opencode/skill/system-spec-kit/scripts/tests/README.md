---
title: "Script Tests"
description: "Test entrypoints and fixtures for system-spec-kit shell scripts, TypeScript modules and integration workflows."
trigger_phrases:
  - "spec kit tests"
  - "test validation"
  - "upgrade-level tests"
---

<!-- markdownlint-disable MD025 -->

# Script Tests

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. PACKAGE TOPOLOGY](#2-package-topology)
- [3. FIXTURE BOUNDARIES](#3-fixture-boundaries)
- [4. ENTRYPOINTS](#4-entrypoints)
- [5. VALIDATION](#5-validation)
- [6. RELATED](#6-related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`scripts/tests/` validates script behavior across shell workflows, JavaScript
smoke tests, Python checks and Vitest regression suites. It covers validation
orchestration, memory pipeline seams, phase workflows, import policy, template
rendering and utility contracts.

Tests assume the resume contract where packet context is recovered from
`handover.md -> _memory.continuity -> spec docs`; generated memory artifacts
remain supporting fixtures or outputs.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:package-topology -->
## 2. PACKAGE TOPOLOGY

```text
scripts/tests/
+-- test-*.js                 # Node smoke and integration tests
+-- test-*.sh                 # Shell validation and phase workflow tests
+-- test_dual_threshold.py    # Python threshold check
+-- *.vitest.ts               # TypeScript regression suites
+-- fixtures/                 # Test-local fixtures
+-- test-fixtures -> ../test-fixtures
`-- README.md
```

Suite groups:

| Group | Coverage |
| --- | --- |
| Shell tests | Spec validation, phase workflow and upgrade-level behavior |
| Node tests | Script modules, extractors, loaders, templates and regressions |
| Vitest suites | Memory, validation, import policy and templates |
| Python tests | Dual-threshold decision behavior |

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:fixture-boundaries -->
## 3. FIXTURE BOUNDARIES

Allowed fixture content:

- `fixtures/` for test-local inputs and expected outputs.
- `test-fixtures` symlink for shared spec folder validation cases.
- Generated JS artifacts only when intentionally retained.

Not owned here:

- Validation scenario definitions live in `../test-fixtures/`.
- Production templates live under `../../templates/`.
- MCP server fixture JSON lives under `../../mcp_server/tests/fixtures/`.

<!-- /ANCHOR:fixture-boundaries -->

---

<!-- ANCHOR:entrypoints -->
## 4. ENTRYPOINTS

Run from the repository root unless a command changes into `scripts/` explicitly:

```bash
npm --prefix .opencode/skill/system-spec-kit/scripts run build
node .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js
bash .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh
bash .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh
npx --prefix .opencode/skill/system-spec-kit/scripts vitest run \
  tests/test-integration.vitest.ts
python3 .opencode/skill/system-spec-kit/scripts/tests/test_dual_threshold.py
```

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 5. VALIDATION

Recommended targeted order after script changes:

```bash
npm --prefix .opencode/skill/system-spec-kit/scripts run build
node .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js
bash .opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh
bash .opencode/skill/system-spec-kit/scripts/tests/test-validation.sh
npx --prefix .opencode/skill/system-spec-kit/scripts vitest run \
  tests/test-integration.vitest.ts
```

Use narrower Vitest files for focused changes, then run the shell validation
suite when spec folder behavior changes.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 6. RELATED

- [`../README.md`](../README.md)
- [`../test-fixtures/README.md`](../test-fixtures/README.md)
- [`../spec/README.md`](../spec/README.md)
- [`../utils/README.md`](../utils/README.md)

<!-- /ANCHOR:related -->
