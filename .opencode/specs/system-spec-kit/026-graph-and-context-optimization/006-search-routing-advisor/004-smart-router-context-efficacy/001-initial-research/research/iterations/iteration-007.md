# Iteration 007 - OpenCode Plugin Reference Pattern

## Focus Questions

V8

## Tools Used

- `find` for plugin discovery
- `sed` reads for plugin and bridge files
- `sed` reads for plugin tests

## Sources Queried

- `.opencode/plugins/spec-kit-compact-code-graph.js`
- `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs`
- `.opencode/plugins/spec-kit-opencode-message-schema.mjs`
- `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts`

## Findings

- The working OpenCode plugin is `.opencode/plugins/spec-kit-compact-code-graph.js`, not a plugin manifest folder. It exports a single default async function consumed by OpenCode. (sourceStrength: primary)
- The plugin avoids importing the MCP server bundle in the OpenCode host process because native modules may have Node ABI mismatches; instead it shells to a plain `node` bridge. This is directly applicable to advisor packaging because the advisor path also touches Python, SQLite, and compiled server code. (sourceStrength: primary)
- Registered hook keys include `event`, `tool`, `experimental.chat.system.transform`, `experimental.chat.messages.transform`, and `experimental.session.compacting`. Advisor hook packaging should likely prefer a user-prompt or message transform if available, plus a status tool. (sourceStrength: primary)
- The plugin caches transport plans by session/spec folder, invalidates on `session.*` or `message.*` events, and exposes a diagnostic status tool. Advisor plugin should mirror cache TTL, session invalidation, runtime readiness, bridge timeout, node binary, and last error reporting. (sourceStrength: primary)
- Plugin tests verify dedupe, tool-bearing message safety, compaction injection, event invalidation, status diagnostics, and bridge failure no-op. These are strong patterns for advisor plugin tests. (sourceStrength: primary)

## Novelty Justification

This pass mapped a concrete local plugin architecture into reusable design constraints for the advisor hook package.

## New Info Ratio

0.60

## Next Iteration Focus

Design the advisor OpenCode plugin shape and install surface.
