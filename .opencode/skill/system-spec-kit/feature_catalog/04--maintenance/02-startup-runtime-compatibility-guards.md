# Startup runtime compatibility guards

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Startup runtime compatibility guards.

## 2. CURRENT REALITY

The startup checks module (`startup-checks.ts`) runs non-critical compatibility validation when the MCP server initializes. The primary guard is Node.js runtime mismatch detection: if the `.node-version-marker` file is missing, startup creates it with the current Node version, module ABI version, platform, and architecture for future comparison. On later startups, the guard compares the current runtime against that marker and warns on ABI, platform, or architecture mismatches. Those mismatches indicate that native modules (like `better-sqlite3` or `sqlite-vec`) may have been built for a different runtime and can crash at startup.

The module also performs a minimum-version SQLite check (3.35.0+) and treats malformed version strings or query failures as warning-only diagnostics. These guards are extracted from the main `context-server.ts` (T303) to keep the startup path modular. Additional startup checks can be added to this module without cluttering the server initialization logic. All checks are non-blocking — they emit warnings but do not prevent server startup.

Manual validation is covered by playbook scenario `EX-035`, which runs the targeted startup guard suite and verifies runtime mismatch plus SQLite diagnostics behavior.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/startup-checks.ts` | Core | Startup compatibility validation |
| `mcp_server/context-server.ts` | Core | Server initialization invoking checks |
| `mcp_server/cli.ts` | Core | CLI entry point with startup checks |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/startup-checks.vitest.ts` | Runtime mismatch logic and SQLite version guard tests |
| `mcp_server/tests/context-server.vitest.ts` | Context server tests |
| `mcp_server/tests/modularization.vitest.ts` | Modularization tests |

## 4. SOURCE METADATA

- Group: Maintenance
- Source feature title: Startup runtime compatibility guards
- Current reality source: audit-D04 gap backfill
- Manual playbook scenario: EX-035
