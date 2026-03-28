---
title: "Setup, Native Module Health, and MCP Installation"
description: "Spec-folder prerequisite validation, native module diagnostics and rebuild, Node ABI marker recording, and Spec Kit Memory MCP bootstrap/configuration scripts."
---

# Setup, Native Module Health, and MCP Installation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This setup surface combines two neighboring but distinct responsibilities inside `scripts/setup/`: prerequisite validation for spec-driven implementation workflows, and local-environment bootstrap for the bundled Spec Kit Memory MCP server.

Taken together, these scripts validate the active feature-folder shape, install and build the Spec Kit workspace, probe native Node module health, rebuild ABI-sensitive packages after runtime changes, record a compatibility marker, and register the MCP server in `opencode.json`.

## 2. CURRENT REALITY

The shipped behavior in this slice currently works as follows:

1. `check-prerequisites.sh` is the workflow-facing prerequisite gate for spec work. It resolves repo, branch, and feature paths through `common.sh`, supports JSON and path-only output, can require `tasks.md`, and can pass through to `spec/validate.sh` in normal, strict, or verbose validation modes.
2. Outside path-only mode, that same script hard-fails when the resolved feature directory is missing, when `plan.md` is absent, or when `--require-tasks` is used and `tasks.md` is absent. It also surfaces optional companion docs such as `research/research.md`, `checklists/`, `decisions/`, and `tasks.md` when requested.
3. `install.sh` is the environment bootstrap for the bundled `spec_kit_memory` MCP. It requires Node.js 18+, `npm`, and `npx`; logs the current Node version, module ABI version, and binary path; and verifies that the expected Spec Kit workspace, MCP server folder, and both `package.json` files exist before proceeding.
4. Before installation, the installer clears a stale Hugging Face cache under the server package and removes `better-sqlite3` plus `sqlite-vec` from the server `node_modules` tree to avoid native-module load failures. It then runs `npm install` from the Spec Kit root, attempts `npm run build`, and falls back to `npx tsc --build --noCheck --force` if the standard build fails.
5. Native module health is treated as part of installation, not a separate manual step. `install.sh` shells into `check-native-modules.sh`, prints the probe output verbatim, and if any `[FAIL]` marker appears it automatically runs `rebuild-native-modules.sh` with `n` piped into the optional Hugging Face cache prompt, then re-runs the health probe and aborts if failures remain.
6. After dependency recovery, the installer verifies `mcp_server/dist/context-server.js`, runs a startup smoke test by launching the server with delayed stdin close, and adds a local MCP entry to `opencode.json` when one is not already present. The generated config uses a relative `node` command, defaults the embeddings provider to `hf-local`, points `MEMORY_DB_PATH` at the canonical SQLite location, and includes explanatory `_NOTE_*` environment keys about providers, portability, and feature flags.
7. Verification can be skipped with `--skip-verify`; otherwise `verify_installation()` syntax-checks the built server, confirms `node_modules` and the `opencode.json` entry, and reports whether the canonical database already exists and whether the compatibility symlink path is present.
8. `check-native-modules.sh` is the standalone diagnostic probe. It compares the current Node runtime against `.node-version-marker`, reports Node and `MODULE_VERSION`, and attempts to load `better-sqlite3` plus optional `onnxruntime-node` and `sharp` installs so ABI mismatches show up as explicit `[FAIL]` lines.
9. `rebuild-native-modules.sh` is the repair path for ABI drift. It rebuilds `better-sqlite3` inside `mcp_server`, runs `npm rebuild` in `shared/` when that workspace is installed, optionally clears the global Hugging Face cache interactively, and then calls `record-node-version.js` to rewrite `.node-version-marker` with the current Node version, module ABI, platform, architecture, and timestamp.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh` | Workflow guard | Resolves feature-folder paths, validates required spec documents, and optionally invokes spec validation |
| `.opencode/skill/system-spec-kit/scripts/setup/install.sh` | Installer | Installs/builds the Spec Kit workspace, probes and repairs native modules, smoke-tests the context server, and writes MCP config |
| `.opencode/skill/system-spec-kit/scripts/setup/check-native-modules.sh` | Diagnostic probe | Compares recorded versus active Node ABI details and probes native package loadability |
| `.opencode/skill/system-spec-kit/scripts/setup/rebuild-native-modules.sh` | Repair script | Rebuilds ABI-sensitive modules, optionally clears cache, and refreshes the Node-version marker |
| `.opencode/skill/system-spec-kit/scripts/setup/record-node-version.js` | Marker writer | Persists the current Node/runtime compatibility snapshot into `.node-version-marker` |

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Source feature title: Setup, Native Module Health, and MCP Installation
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct implementation audit of the setup validation, installer, native-module probe, rebuild, and marker-recording scripts
