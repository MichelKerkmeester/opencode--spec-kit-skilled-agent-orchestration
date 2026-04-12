# Tasks: 011-tool-profile-split-investigation

1. Inventory the current startup/bootstrap guidance in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` and `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`.
2. Define profile-bundling candidates that remain presentation-only and do not alter `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`.
3. Specify the token, discoverability, and misrouting measurements needed to justify follow-on work.
4. Verify the packet with `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/011-tool-profile-split-investigation --strict`.
