---
title: "Source-dist alignment enforcement"
description: "Source-dist alignment enforcement validates that every .js file in mcp_server/dist/lib/ has a corresponding .ts source file, detecting orphaned build artifacts."
---

# Source-dist alignment enforcement

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Source-dist alignment enforcement validates that every `.js` file in `mcp_server/dist/lib/` has a corresponding `.ts` source file in `mcp_server/lib/`, detecting orphaned build artifacts that persist after source files are deleted or refactored.

Source files can be silently lost (deleted, renamed, or merged into other modules) while their compiled `dist/` output persists indefinitely. This creates phantom modules that appear functional at runtime but have no maintainable source. The alignment script catches this drift automatically.

---

## 2. CURRENT REALITY

`check-source-dist-alignment.ts` maps each `.js` file under `dist/lib/` to its expected `.ts` source under `lib/`, reports mismatches, and exits non-zero on violations. It supports a typed allowlist for intentional exceptions (with file, reason, owner, date fields).

Added as part of Phase 15 (Internal Module Boundary Remediation) after discovering two orphaned dist artifacts: `dist/lib/utils/retry.js` (source deleted 2026-03-07) and `dist/lib/eval/hydra-baseline.js` (source deleted 2026-03-13, logic moved to `memory-state-baseline.ts`).

The corresponding policy is documented in `ARCHITECTURE.md` under "Source-Dist Alignment Enforcement".

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/evals/check-source-dist-alignment.ts` | Script (evals) | Source-dist alignment enforcement: scans dist/lib/*.js, maps to lib/*.ts, reports orphans |

### Tests

| File | Focus |
|------|-------|
| _None yet_ | Script is self-verifying (exit code 0 = pass, 1 = violations, 2 = missing dist root) |

---

## 4. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: Source-dist alignment enforcement
- Current reality source: ARCHITECTURE.md (Source-Dist Alignment Enforcement subsection)
