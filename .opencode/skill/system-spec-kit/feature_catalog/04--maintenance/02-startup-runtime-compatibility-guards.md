---
title: "Startup runtime compatibility guards"
description: "Covers the non-blocking startup checks that detect Node.js runtime mismatches and SQLite version compatibility."
---

# Startup runtime compatibility guards

## 1. OVERVIEW

Covers the non-blocking startup checks that detect Node.js runtime mismatches and SQLite version compatibility.

When the system starts up, it checks that the software environment has not changed since it was last installed. If you updated your system or switched computers, some internal components might not be compatible anymore. This check warns you about mismatches early instead of letting them cause a mysterious crash later.

---

## 2. CURRENT REALITY

The startup checks module (`startup-checks.ts`) runs non-critical compatibility validation when the MCP server initializes. The primary guard is Node.js runtime mismatch detection: if the `.node-version-marker` file is missing, startup creates it with the current Node version, module ABI version, platform and architecture for future comparison. On later startups, the guard compares the current runtime against that marker and warns on ABI, platform, or architecture mismatches. Those mismatches indicate that native modules (like `better-sqlite3` or `sqlite-vec`) may have been built for a different runtime and can crash at startup.

The module also performs a minimum-version SQLite check (3.35.0+) and treats malformed version strings or query failures as warning-only diagnostics. These guards are extracted from the main `context-server.ts` (T303) to keep the startup path modular. Additional startup checks can be added to this module without cluttering the server initialization logic. All checks are non-blocking: they emit warnings but do not prevent server startup.

Manual validation is covered by playbook scenario `EX-035`, which runs the targeted startup guard suite and verifies runtime mismatch plus SQLite diagnostics behavior.

---

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

---

## 4. SOURCE METADATA

- Group: Maintenance
- Source feature title: Startup runtime compatibility guards
- Current reality source: audit-D04 gap backfill
- Manual playbook scenario: EX-035
