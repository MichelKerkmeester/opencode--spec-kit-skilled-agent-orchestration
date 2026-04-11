# Tasks: 010-passive-capture-investigation

1. Document the current save authority and governance handoff using `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, and `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`.
2. Define a close-session helper experiment that emits structured JSON into the existing save path and never bypasses reviewable inputs.
3. Define a shadow passive-capture experiment that reuses `.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts` only as a suggestion layer, not a durable writer.
4. Specify the evidence needed to decide adopt/prototype/reject, then verify the packet with `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/010-passive-capture-investigation --strict`.
