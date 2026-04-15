---
iteration: 2
dimension: "Fallback equivalence"
focus: "Trace plannerMode='full-auto' from memory-save.ts through canonical fallback, deferred subsystems, and workflow follow-ups"
timestamp: "2026-04-15T08:42:15Z"
runtime: "cli-copilot --effort high"
status: "insight"
findings:
  P0: 1
  P1: 0
  P2: 0
---

# Iteration 002

## Findings

### P0
1. **F002 — Full-auto fallback drops the pre-015 `POST_SAVE_FINGERPRINT` safety rule.** Packet 015 still builds a `postSavePlan` for canonical saves when `plannerMode === 'full-auto'`, but `validateCanonicalPreparedSave()` now only runs the `POST_SAVE_FINGERPRINT` rule when callers opt in with `includePostSaveFingerprint: true`. The full-auto canonical write path calls `validateCanonicalPreparedSave(routedPrepared)` without that option, so the legacy fallback no longer enforces the post-save fingerprint check that pre-015 included by default. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1534-1541] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1547-1569] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2991-3004] [EVIDENCE: git diff f3dc18993~1..HEAD -- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts]

**Remediation suggestion:** Restore the pre-015 validator contract for the full-auto canonical path by calling `validateCanonicalPreparedSave(routedPrepared, { includePostSaveFingerprint: true })`, or revert the validator helper so `POST_SAVE_FINGERPRINT` remains part of the default full-auto rule set.

## Ruled-out directions explored

- **Atomic writer parity held.** Full-auto still bypasses the planner-only early return and enters `atomicIndexMemory(...)`, so the canonical atomic writer remains the active mutation engine in fallback mode. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2917-2932]
- **Tier 3 routing parity held.** The canonical router is built with `tier3Enabled = true` whenever `plannerMode === 'full-auto'`, which restores the old Tier 3 attempt path even if the new planner-first env flag is off. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1279-1281] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:574-584]
- **Quality-loop auto-fix parity held.** Full-auto passes `qualityLoopMode: 'full-auto'`, and `runQualityLoop()` now re-enables auto-fix retries whenever mode is `full-auto`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1251-1256] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:588-727]
- **Reconsolidation parity held.** `runReconsolidationIfEnabled()` explicitly allows save-time reconsolidation when `plannerMode === 'full-auto'`, which recreates the legacy default-on behavior even though the new planner-first opt-in flag defaults false. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:181-188] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:138-144] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:204-210]
- **Post-insert enrichment parity held.** The new wrapper only short-circuits non-full-auto planner saves; full-auto still executes the original enrichment pipeline. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:56-58] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:206-225] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2342-2346]
- **Chunking parity held.** Full-auto remains the only mode that can trigger chunking, and the wrapper still delegates to the original `needsChunking(content)` threshold. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:140-145] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2025-2026]
- **Workflow follow-up parity held.** `generate-context.ts` forwards `plannerMode` into `runWorkflow()`, and workflow only runs graph refresh plus Step 11.5 reindex when that mode is `full-auto`. [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:588-598] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1333-1401]

## Evidence summary

- **Equivalent in full-auto:** atomic write entry, Tier 3 routing, quality-loop auto-fix, reconsolidation, post-insert enrichment, chunking, graph refresh, and Step 11.5 reindex all remain reachable.
- **Divergent in full-auto:** canonical fallback no longer includes `POST_SAVE_FINGERPRINT` in `validateCanonicalPreparedSave()` even though full-auto still constructs the `postSavePlan` needed for that rule.
- **Adversarial self-check:** Re-read the validator helper and the canonical `routedPrepared` path to ensure this was not planner-only drift. The omission occurs inside the full-auto fallback path itself.

## Novelty justification

This iteration added new signal because it separated one real fallback regression from six preserved branches, showing the full-auto path is close to legacy parity but not fully equivalent.
