---
title: "Verification Checklist: Description Regen Contract"
description: "Verification items for shared schema + merge helper."
trigger_phrases: ["description regen checklist"]
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/005-description-regen-contract"
    last_updated_at: "2026-04-19T00:06:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Checklist evidence captured for schema, merge, tests, and sweep"
    next_safe_action: "Track unrelated broader-suite failures before final packet closure"
---
# Verification Checklist: Description Regen Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

- Focused verification must cover typecheck, the affected description suites, and the 28-file temp-copy regen sweep.
- Broader `@spec-kit/mcp-server` suite attempts are recorded separately; unrelated baseline failures do not erase packet-local evidence.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] [P0] Research reviewed [EVIDENCE: [research.md](./../../research/019-system-hardening-pt-01/research.md) lines 7-9 and 69-83]
- [x] [P0] 28 rich description.json files enumerated [EVIDENCE: live count confirmed as `27` under `026` plus `1` archived backup]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] [P0] Live description schema exports the 5 field classes [EVIDENCE: [.opencode/skill/system-spec-kit/mcp_server/lib/description/description-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/description/description-schema.ts:3)]
- [x] [P0] Live merge helper exports `mergeDescription()` [EVIDENCE: [.opencode/skill/system-spec-kit/mcp_server/lib/description/description-merge.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/description/description-merge.ts:43)]
- [x] [P0] Both lanes route through the shared helper [EVIDENCE: [.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:236) and [.opencode/skill/system-spec-kit/mcp_server/lib/description/repair.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/description/repair.ts:19)]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] [P0] All 28 rich files regen without field loss [EVIDENCE: temp-copy sweep pass with `failureCount=0`]
- [x] [P0] Unknown-key passthrough verified [EVIDENCE: [.opencode/skill/system-spec-kit/mcp_server/tests/description/repair-specimens.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/description/repair-specimens.vitest.ts:219) and temp-copy injected `synthetic_passthrough`]
- [x] [P0] 5 field classes covered by unit tests [EVIDENCE: [.opencode/skill/system-spec-kit/mcp_server/tests/description/description-merge.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/description/description-merge.vitest.ts:24); `117/117` focused description suites green]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security
- [x] [P1] No new secrets introduced [EVIDENCE: touched files stay in runtime and packet docs only; no credential material added]
- [x] [P0] Unknown-key passthrough is bounded to non-reserved top-level keys only via the reserved-key classifier [EVIDENCE: [.opencode/skill/system-spec-kit/mcp_server/lib/description/description-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/description/description-schema.ts:28)]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] [P1] spec.md / plan.md / tasks.md aligned for the delivered implementation [EVIDENCE: packet docs updated in this run to reflect live `mcp_server` paths and verification state]
- [x] [P1] implementation-summary.md populated with delivered changes and verification status [EVIDENCE: [implementation-summary.md](./implementation-summary.md)]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] [P1] New files added only to the live runtime path [EVIDENCE: `mcp_server/lib/description/description-schema.ts` and `mcp_server/lib/description/description-merge.ts`]
- [x] [P1] No orphan files remain after removing the temporary 28-file sweep test [EVIDENCE: working tree no longer contains `description-regen-sweep.vitest.ts`]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Packet-local verification passed. Broader `npm run test --workspace=@spec-kit/mcp-server` remains blocked by unrelated existing failures outside this change set.
<!-- /ANCHOR:summary -->
