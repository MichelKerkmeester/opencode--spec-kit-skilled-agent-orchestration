# Iteration 002: Security audit of governed ingest and save-hook path enforcement

## Focus / scope summary
Reviewed the v3 security surfaces around `memory_save` governance, provenance, retention enforcement, the bounded spec-doc-health parent walk-up, and the adjacent public YAML save hooks that previously interacted with retired `memory/*.md` paths. The goal was to confirm that the remediation did not reopen auth, governance, scope, or malformed-input acceptance gaps.

## Findings

### P0
- None. The inspected public save hooks still route into canonical spec documents or generated artifact paths, and `memory_save` still hard-rejects any noncanonical target before indexing begins. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083-2085] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:572-580] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:994-1002]

### P1
- None. Governed ingest still fails closed when required tenant/session/provenance metadata is missing, malformed, or incompatible with ephemeral retention. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:186-229] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2091-2115]

### P2
- None. The bounded spec-doc-health walk-up checks only the immediate parent and one parent above, which avoided reopening an arbitrary upward path-classification surface while preserving annotation coverage for canonical saves. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:361-379]

## Security closure notes
- `memory_save` still rejects retired or otherwise noncanonical save targets before indexing; only canonical spec docs and constitutional memories are admitted. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2080-2085] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955-976]
- Governed ingest remains fail-closed when governance metadata is present: missing `tenantId`, `sessionId`, actor, provenance, or required `deleteAfter` for ephemeral retention causes rejection. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:217-229] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2091-2115]
- Post-insert governance metadata is applied transactionally and rolls back orphaned rows on failure, so a partial privileged insert is not left behind. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2384-2410]
- The spec-doc-health walk-up is bounded to the immediate parent and one parent above, and only evaluates candidates that actually contain `spec.md`; this did not expose an arbitrary ancestor escape surface. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:365-375]
- `create-agent` save hooks still point directly at `implementation-summary.md`, not retired `memory/*.md` paths. [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:572-580] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:660-668]
- Deep-review and deep-research save hooks still require `generate-context.js` and verify canonical continuity landing in `implementation-summary.md`, `decision-record.md`, or `handover.md`. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:857-870] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:989-1002] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:638-650] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:817-827]

## Files reviewed
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
- `.opencode/skill/system-spec-kit/shared/parsing/spec-doc-health.ts`
- `.opencode/command/create/assets/create_agent_auto.yaml`
- `.opencode/command/create/assets/create_agent_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`

## Ruled-out paths
- Retired `memory/*.md` acceptance via public save hooks was ruled out because the live hooks target canonical spec docs or returned support-artifact paths, while `memory_save` independently rejects noncanonical file targets. [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:572-580] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:862-870] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2083-2085]
- Governed ephemeral saves without expiry were ruled out because `deleteAfter` is mandatory when `retentionPolicy === 'ephemeral'`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:225-229]
- Parent walk-up escaping into arbitrary ancestor packets was ruled out because the annotation checks only two bounded candidates. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:368-375]

## Recommended next focus
Rotate to **traceability** and verify that packet docs, changelog text, command docs, and cross-runtime agent manuals all describe the same canonical continuity contract and shared-space retirement story.

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: security
- Novelty justification: Re-reading the governed ingest path, bounded spec-doc-health walk-up, and public YAML save hooks confirmed the canonical save gate stayed closed and surfaced no new security defect.
