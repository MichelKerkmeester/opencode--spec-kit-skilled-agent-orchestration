# Startup runtime compatibility guards

## Current Reality

The startup checks module (`startup-checks.ts`) runs non-critical compatibility validation when the MCP server initializes. The primary guard is Node.js version mismatch detection: the server writes a `.node-version-marker` file containing the Node version, module ABI version, platform, and architecture at build time. On startup, it compares the current runtime's `process.versions.modules` against the marker. A mismatch indicates that native modules (like `better-sqlite3` or `sqlite-vec`) were compiled for a different Node version and may crash at runtime, prompting a clear warning before the crash occurs.

These guards are extracted from the main `context-server.ts` (T303) to keep the startup path modular. Additional startup checks can be added to this module without cluttering the server initialization logic. All checks are non-blocking — they emit warnings but do not prevent server startup.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/startup-checks.ts` | Core | Startup compatibility validation |
| `mcp_server/context-server.ts` | Core | Server initialization invoking checks |
| `mcp_server/cli.ts` | Core | CLI entry point with startup checks |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/context-server.vitest.ts` | Context server tests |
| `mcp_server/tests/modularization.vitest.ts` | Modularization tests |

## Source Metadata

- Group: Maintenance
- Source feature title: Startup runtime compatibility guards
- Current reality source: audit-D04 gap backfill
