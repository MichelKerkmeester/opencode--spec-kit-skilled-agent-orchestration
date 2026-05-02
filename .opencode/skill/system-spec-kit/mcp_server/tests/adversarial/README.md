# Adversarial MCP Server Tests

> Focused MCP server regressions for hostile inputs and race-sensitive behavior.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. OWNERSHIP](#2--ownership)
- [3. TREE AND KEY FILES](#3--tree-and-key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. VALIDATION](#5--validation)
- [6. RELATED](#6--related)

---

## 1. OVERVIEW

`mcp_server/tests/adversarial/` holds focused regression tests for adversarial interleavings and hostile inputs that are easier to reason about outside broader test suites.

Current state:

- The folder contains one compact-prime identity race regression.
- Tests run under the MCP server Vitest setup.
- Coverage here complements nearby regression suites instead of duplicating them.

---

## 2. OWNERSHIP

This directory belongs to the MCP server test suite. Add tests here when the scenario is security-sensitive, race-sensitive or intentionally adversarial.

---

## 3. TREE AND KEY FILES

```text
mcp_server/tests/adversarial/
+-- README.md
`-- compact-prime-identity-race.vitest.ts
```

| File | Role |
|---|---|
| `compact-prime-identity-race.vitest.ts` | Verifies stale compact-prime clears do not erase fresher payloads |

---

## 4. BOUNDARIES

- Keep adversarial tests deterministic and local to MCP server behavior.
- Do not store phase history or audit notes here.
- Put broad integration coverage in the nearest existing MCP server regression suite.
- Name new files with a short scenario slug and `.vitest.ts` suffix.

---

## 5. VALIDATION

```bash
npx vitest run .opencode/skill/system-spec-kit/mcp_server/tests/adversarial/compact-prime-identity-race.vitest.ts
```

---

## 6. RELATED

- [`../`](../) - MCP server tests.
- [`../../`](../../) - MCP server package root.
