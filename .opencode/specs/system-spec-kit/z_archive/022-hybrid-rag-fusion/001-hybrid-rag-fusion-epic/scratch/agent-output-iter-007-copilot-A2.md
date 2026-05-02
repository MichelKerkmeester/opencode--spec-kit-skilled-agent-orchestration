● skill(sk-deep-research)

I’m mapping the flag code and nearby call sites first, then I’ll distill concrete governance/eval-scope findings with line-level citations.

✗ Read capability-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/capability-flags.ts
  └ Path does not exist

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ 251 lines read

● Read graph-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts
  └ 42 lines read

● Search (glob)
  │ ".opencode/specs/**/hybrid-rag-fusion/**"
  └ No matches found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/search/*.ts"
  └ 48 files found

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/579adce6-ac5b-4444-82f6-b5f18b86ec99/plan.md'
  │ <<'EOF'
  │ 1. Read target flag modules and prior context.
  │ 2. Trace producers/consumers and adjacent tests.…
  └ 4 lines...

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

● search feature flag governance and evaluation scope around capability flags search flags graph fl…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

● Explore Explore flag flow
  │ Read memory-state-baseline.ts
  │   │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts
  │   └ L1:80 (80 lines read)
  └ Check scope enforcement usage in eval (shell)
      │ cd /Users/michelkerkmeester/MEGA/Development/Opencode\ Env/Public && grep -n
      │ "scopeEnforcement\|scopeDimensionsTracked"
      │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts
      └ 2 lines...

One requested file wasn’t where the prompt pointed, so I’m verifying the actual producer/consumer chain before I call anything a bug.

● Read capability-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts
  └ 153 lines read

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:260 (259 lines read)

● Read graph-search-fn.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts
  └ L1:240 (240 lines read)

● Read graph-flags.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/graph-flags.vitest.ts
  └ 47 lines read

● Read search-flags.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts
  └ 196 lines read

● Read memory-roadmap-flags.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts
  └ 103 lines read

● Search (grep)
  │ "getMemoryRoadmapCapabilityFlags|MemoryRoadmapCapabilityFlags|scopeEnforcement|scopeDimensionsTr
  │ acked|isGraphUnifiedEnabled|getGraphWalkRolloutState|resolveGraphWalkRolloutState|isPipelineV2En
  │ abled|isReconsolidationEnabled|isEntityLinkingEnabled|isAutoEntitiesEnabled" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (glob)
  │ "**/capability-flags.ts"
  └ 1 file found

I’ve confirmed the capability file lives under `lib/config`, not `lib/search`. Now I’m checking whether the “scope/governance” flags are real gates or just telemetry metadata.

● Read retrieval-telemetry.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts
  └ L1:320 (319 lines read)

● Search (grep)
  │ "graphUnified|scopeEnforcement|governanceGuardrails|sharedMemory|adaptiveRanking|lineageState"
  │ in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 36 lines found

● Search (grep)
  │ "isReconsolidationEnabled|SPECKIT_RECONSOLIDATION" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 81 lines found

● Search (grep)
  │ "getMemoryRoadmapDefaults|getMemoryRoadmapCapabilityFlags|scopeDimensionsTracked|scopeEnforcemen
  │ t" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 43 lines found

● Search (grep)
  │ "isEntityLinkingEnabled|isAutoEntitiesEnabled|SPECKIT_ENTITY_LINKING|SPECKIT_AUTO_ENTITIES" in
  │ **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 46 lines found

● Search (grep)
  │ "isGraphUnifiedEnabled|getGraphWalkRolloutState|isGraphWalkTraceEnabled|isGraphWalkRuntimeEnable
  │ d|resolveGraphWalkRolloutState|isGraphSignalsEnabled" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 88 lines found

● Search (grep)
  │ "isPipelineV2Enabled|SPECKIT_PIPELINE_V2" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 20 lines found

I’ve verified the roadmap flags are mostly flowing into telemetry/eval artifacts, not the live search path. I’m now checking whether that’s intentional metadata or a real governance gap in the eval code.

● Read memory-state-baseline.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts
  └ L1:260 (224 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L540:710 (171 lines read)

● Read create-checkpoint.ts
  │ .opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts
  └ L170:220 (51 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L220:245 (26 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L880:905 (26 lines read)

● Read post-insert.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts
  └ L60:120 (61 lines read)

● Read entity-linker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts
  └ L480:530 (51 lines read)

● Read reconsolidation.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
  └ L120:140 (21 lines read)

I’ve found one likely documentation/architecture drift already: some flag comments describe live governance, but the values only feed telemetry/checkpoint metadata. I’m checking the hybrid pipeline for any runtime blind spots next.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L260:620 (361 lines read)

● Read feature-eval-graph-signals.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts
  └ L340:410 (71 lines read)

● Read retrieval-telemetry.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts
  └ L110:140 (31 lines read)

● Read retrieval-telemetry.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts
  └ L370:390 (21 lines read)

● Read retrieval-telemetry.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts
  └ L290:320 (30 lines read)

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ L1:220 (78 lines read)

● Search (grep)
  │ "graphSearchFn|useGraph|forceAllChannels|isSearchFallbackEnabled|isDocscoreAggregationEnabled|is
  │ DegreeBoostEnabled|isContextHeadersEnabled"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 23 lines found

I’m validating the exact runtime combinations now, especially whether graph/eval controls can say “enabled” while the actual graph channel is unavailable or skipped.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L620:710 (90 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L740:790 (51 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1068:1108 (41 lines read)

● Read retrieval-telemetry.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts
  └ L420:460 (41 lines read)

● Read retrieval-telemetry.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts
  └ L670:695 (26 lines read)

● Read graph-regression-flag-off.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts
  └ L280:335 (56 lines read)

● Read pipeline-v2.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts
  └ L286:305 (19 lines read)

I found a stronger scope issue: the roadmap flags support identity-based rollout, but the telemetry/eval/checkpoint callers may not pass any identity at all. I’m reading the rollout policy now to verify exactly what that means in production.

● Read memory-roadmap-flags.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts
  └ L76:97 (22 lines read)

● Read rollout-policy.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts
  └ L1:220 (64 lines read)

● Search (grep)
  │ "getMemoryRoadmapDefaults\(" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 7 lines found

● Search (grep)
  │ "recordArchitecturePhase\(" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 3 lines found

I found a bigger governance bug than the telemetry-only roadmap flags: the shared rollout policy is identity-based, but most runtime search-flag helpers never supply an identity. That means “50% rollout” collapses into a global off-state for those flags.

● Read flag-ceiling.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts
  └ L1:210 (208 lines read)

● Search (grep)
  │ "SPECKIT_ROLLOUT_PERCENT" in **/*.vitest.ts (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 34 lines found

● Search (grep)
  │ "isMMREnabled\(|isTRMEnabled\(|isMultiQueryEnabled\(|isCrossEncoderEnabled\(|isGraphUnifiedEnabl
  │ ed\(|isGraphSignalsEnabled\(" in **/*.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 58 lines found

I’ve got enough source evidence for the main issues, and I’m running the relevant Vitest suites now to ensure the behaviors I’m citing are actually the current baseline.

● Run targeted flag tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/search-flags.vitest.ts tests/memory-roadmap-flags.vitest.ts tests/graph-flags.vitest.ts
  │ tests/flag-ceiling.vitest.ts tests/retrieval-telemetry.vitest.ts --reporter=verbose
  └ 76 lines...

The targeted suites all pass, which actually strengthens the review: the risky behaviors are largely accepted by today’s tests rather than caught by them.

● Read rollout-policy.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts
  └ L80:125 (32 lines read)

● Read integration-search-pipeline.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts
  └ L270:318 (49 lines read)

● Read graph-regression-flag-off.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts
  └ L34:100 (67 lines read)

✗ Memory stored flag rollout
  └ Default-on search and graph flag helpers omit rollout identity, so partial SPECK…

Findings from iteration 7/20:

- `capability-flags.ts` is actually under `lib/config`, not `lib/search` (`lib/config/capability-flags.ts:1-154`).

- **Governance bug:** most runtime search/graph flags call `isFeatureEnabled()` **without an identity**, so `SPECKIT_ROLLOUT_PERCENT=1..99` fails closed instead of doing per-request rollout (`lib/cognitive/rollout-policy.ts:42-56`; `lib/search/search-flags.ts:27-28,35-36,43-44,51-52,59-60,67-68,77-78,101-102,123-124,133-144,168-172,179-210`; `lib/search/graph-flags.ts:16-18`).

- **Eval-scope misalignment:** roadmap defaults do support identity fallback (`lib/config/capability-flags.ts:69-84,131-136`), but telemetry/eval/checkpoint callers omit it, so rollout is recorded against synthetic flag identities, not real tenant/user/session scope (`lib/telemetry/retrieval-telemetry.ts:177-210`; `lib/eval/memory-state-baseline.ts:182-199`; `scripts/migrations/create-checkpoint.ts:187-198`).

- **Architecture drift:** `scopeEnforcement`/`governanceGuardrails` sound like live enforcement, but they only feed telemetry/checkpoint/eval metadata, not runtime search behavior (`lib/config/capability-flags.ts:15-30,101-136`; `lib/telemetry/retrieval-telemetry.ts:679-690`; `lib/eval/memory-state-baseline.ts:192-199`).

- **Dead compatibility surface:** `isPipelineV2Enabled()` always returns `true`, while comments/tests still reference `SPECKIT_PIPELINE_V2` as if it gates behavior (`lib/search/search-flags.ts:107-115`; `lib/search/pipeline/orchestrator.ts:1-5`; `tests/pipeline-v2.vitest.ts:289-304`).

- **Governance metric is mutable, not measured:** `scopeDimensionsTracked` is hardcoded to `4` at source (`lib/config/capability-flags.ts:135`) but telemetry can overwrite it with arbitrary values (`lib/telemetry/retrieval-telemetry.ts:422-445`; `tests/retrieval-telemetry.vitest.ts:299-313,377-386`).

Targeted Vitest suites passed: `search-flags`, `memory-roadmap-flags`, `graph-flags`, `flag-ceiling`, `retrieval-telemetry`.

