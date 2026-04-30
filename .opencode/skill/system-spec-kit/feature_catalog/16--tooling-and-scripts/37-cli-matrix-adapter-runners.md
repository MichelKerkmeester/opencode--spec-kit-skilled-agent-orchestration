---
title: "CLI matrix adapter runners"
description: "Manifest-driven F1-F14 matrix runner package for cli-codex, cli-copilot, cli-gemini, cli-claude-code, and cli-opencode executor cells."
trigger_phrases:
  - "matrix_runners"
  - "CLI matrix adapters"
  - "F1-F14 matrix"
  - "adapter-cli-codex"
---

# CLI matrix adapter runners

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

`mcp_server/matrix_runners/` turns the F1-F14 x CLI executor matrix into executable external-CLI cells.

The package is intentionally separate from native/local matrix checks. Local status uses focused local runners; the external adapter layer documented here covers CLI executor cells.

---

## 2. CURRENT REALITY

The matrix runner has a frozen `matrix-manifest.json`, prompt templates for F1-F14, one adapter per supported CLI executor, and a meta-runner that filters by feature or executor. It writes one JSONL file per cell plus `summary.tsv`, records per-cell status and evidence, and treats non-applicable cells as `NA`.

Each adapter maps a normalized `AdapterInput` into the target CLI's argv/stdin contract. Spawn failures such as missing binaries, permission failures, `EAGAIN`, and `ENOSPC` return `BLOCKED`; timeouts return `TIMEOUT_CELL`; zero exit without the expected stdout signal returns `FAIL`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/matrix_runners/README.md:8-10` | Docs | Defines the package as CLI-only matrix adapter runners and distinguishes local-runner coverage |
| `mcp_server/matrix_runners/README.md:31-45` | Docs | Documents manifest fields and applicability rules |
| `mcp_server/matrix_runners/README.md:54-71` | Docs | Documents adapter status vocabulary and smoke verification command |
| `mcp_server/matrix_runners/run-matrix.ts:21-45` | Meta-runner | Defines executor, manifest, and CLI option contracts |
| `mcp_server/matrix_runners/run-matrix.ts:63-73` | Meta-runner | Registers the five supported CLI executors |
| `mcp_server/matrix_runners/run-matrix.ts:134-147` | Meta-runner | Routes each executor to its adapter |
| `mcp_server/matrix_runners/run-matrix.ts:172-190` | Meta-runner | Writes JSONL cell records and TSV summary rows |
| `mcp_server/matrix_runners/adapter-cli-codex.ts:13-37` | Adapter | Runs a matrix cell through Codex CLI with model, reasoning effort, service tier, and workspace-write sandbox |
| `mcp_server/matrix_runners/adapter-cli-copilot.ts:11-28` | Adapter | Runs a matrix cell through Copilot CLI |
| `mcp_server/matrix_runners/adapter-cli-gemini.ts:11-28` | Adapter | Runs a matrix cell through Gemini CLI |
| `mcp_server/matrix_runners/adapter-cli-claude-code.ts:11-28` | Adapter | Runs a matrix cell through Claude Code CLI |
| `mcp_server/matrix_runners/adapter-cli-opencode.ts:13-36` | Adapter | Runs a matrix cell through OpenCode CLI |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/matrix-adapter-codex.vitest.ts` | Vitest | Mocked adapter coverage for Codex CLI cells |
| `mcp_server/tests/matrix-adapter-copilot.vitest.ts` | Vitest | Mocked adapter coverage for Copilot CLI cells |
| `mcp_server/tests/matrix-adapter-gemini.vitest.ts` | Vitest | Mocked adapter coverage for Gemini CLI cells |
| `mcp_server/tests/matrix-adapter-claude-code.vitest.ts` | Vitest | Mocked adapter coverage for Claude Code CLI cells |
| `mcp_server/tests/matrix-adapter-opencode.vitest.ts` | Vitest | Mocked adapter coverage for OpenCode CLI cells |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/37-cli-matrix-adapter-runners.md`
- Packet source: `023-cli-matrix-adapter-runners`
