---
title: "Architecture boundary enforcement"
description: "Architecture boundary enforcement automates two rules: `shared/` must not import from `mcp_server/` or `scripts/`, and `mcp_server/scripts/` must contain only thin wrappers."
---

# Architecture boundary enforcement

## 1. OVERVIEW

Architecture boundary enforcement automates two rules: `shared/` must not import from `mcp_server/` or `scripts/`, and `mcp_server/scripts/` must contain only thin wrappers.

The codebase has clear boundaries between its major sections, and this tool automatically checks that nobody accidentally crosses them. It is like having walls between departments in an office building: you can communicate through proper channels, but you cannot just reach through the wall and grab something from another department's desk.

---

## 2. CURRENT REALITY

Two architecture rules in `ARCHITECTURE.md` were previously documentation-only with no automated enforcement: (1) `shared/` must not import from `mcp_server/` or `scripts/`, and (2) `mcp_server/scripts/` must contain only thin compatibility wrappers delegating to canonical `scripts/dist/` implementations.

`check-architecture-boundaries.ts` enforces both rules as part of `npm run check`. GAP A walks all `.ts` files in `shared/`, extracts module specifiers (skipping block and line comments), and flags any import matching relative paths to `mcp_server/` or `scripts/` at any depth, or package-form `@spec-kit/mcp-server/` or `@spec-kit/scripts/`. This is an absolute prohibition with no allowlist.

GAP B scans top-level `.ts` files in `mcp_server/scripts/` (non-recursive) and verifies each passes three conditions: at most 50 substantive lines (non-blank, non-comment), contains a `child_process` import and references `scripts/dist/` somewhere in its content. Failure on any condition flags the file as not a valid wrapper.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/evals/check-architecture-boundaries.ts` | Script (evals) | Architecture boundary enforcement (GAP A: shared neutrality, GAP B: wrapper-only) |

### Tests

| File | Focus |
|------|-------|
| `scripts/tests/architecture-boundary-enforcement.vitest.ts` | Architecture boundary violation tests: T39 (GAP A multi-syntax imports), T40-T43 (GAP B wrapper failures and bypass patterns), T44 (valid wrapper pass), T45 (no false positives for allowed cross-module imports) |

---

## 4. SOURCE METADATA

- Group: Tooling and scripts
- Source feature title: Architecture boundary enforcement
- Current reality source: FEATURE_CATALOG.md
