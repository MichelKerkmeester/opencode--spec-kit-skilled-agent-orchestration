# Test Documentation

> Test planning and coverage documentation for 082-speckit-reimagined.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1.  OVERVIEW]](#1--overview)

---
<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This README documents the purpose and usage of this spec folder and links to the primary artifacts in this directory.

---
<!-- /ANCHOR:overview -->

<!-- ANCHOR:overview -->
## Overview

This folder contains comprehensive test documentation consolidated from spec 083-speckit-reimagined-test-suite.

**Consolidated:** 2026-02-02
**Source:** 083-speckit-reimagined-test-suite (archived)

---
<!-- /ANCHOR:overview -->

<!-- ANCHOR:contents -->
## Contents

| File | Purpose | Lines |
|------|---------|-------|
| `test-coverage-matrix.md` | Task-to-test mapping for 107 implementation tasks | 627 |
| `test-implementation-guide.md` | Test patterns, database setup, mocking strategies, templates | 2201 |
| `existing-tests-audit.md` | Audit of 29 existing test files with gap analysis | 531 |

---
<!-- /ANCHOR:contents -->

<!-- ANCHOR:test-suite-location -->
## Test Suite Location

Actual test files are located in:
```
.opencode/skill/system-spec-kit/mcp_server/tests/
```

Current test count: ~850+ tests across 29 files.

---
<!-- /ANCHOR:test-suite-location -->

<!-- ANCHOR:key-metrics -->
## Key Metrics

| Metric | Value |
|--------|-------|
| Total Implementation Tasks | 107 |
| Tasks with Test Coverage | 89 (83.2%) |
| Test Files | 29 |
| Estimated Tests | ~850 |

### Coverage by Workstream

| Workstream | Tasks | Covered | Coverage |
|------------|-------|---------|----------|
| W-S Session | 22 | 18 | 81.8% |
| W-R Search | 22 | 20 | 90.9% |
| W-D Decay | 22 | 20 | 90.9% |
| W-G Graph | 9 | 9 | 100% |
| W-I Infra | 32 | 22 | 68.8% |

---
<!-- /ANCHOR:key-metrics -->

<!-- ANCHOR:running-tests -->
## Running Tests

```bash
# Navigate to MCP server
cd .opencode/skill/system-spec-kit/mcp_server

# Run all tests
for f in tests/*.test.js; do node "$f"; done

# Run specific test
node tests/tier-classifier.test.js
```

---
<!-- /ANCHOR:running-tests -->

<!-- ANCHOR:references -->
## References

- **Parent Spec:** `082-speckit-reimagined/spec.md`
- **Original Spec:** `z_archive/083-speckit-reimagined-test-suite/` (archived)
- **Test Location:** `.opencode/skill/system-spec-kit/mcp_server/tests/`
<!-- /ANCHOR:references -->

