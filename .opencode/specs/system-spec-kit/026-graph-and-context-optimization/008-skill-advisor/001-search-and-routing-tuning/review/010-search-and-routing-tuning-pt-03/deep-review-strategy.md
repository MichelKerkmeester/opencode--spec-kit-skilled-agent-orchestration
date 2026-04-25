# Deep Review Strategy - 001 Research Search Fusion Tuning

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Review the shipped 001 search-fusion stack after implementation and doc alignment. The target includes runtime code, requested operator-facing docs, runtime mirrors, live MCP configs, and the 001-005 packet tree so the review reflects the complete released state rather than a narrow phase snapshot.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Parent packet review of `001-search-fusion-tuning` covering runtime correctness, doc accuracy, cross-reference integrity, mirror consistency, and packet traceability after code/doc shipment.

<!-- /ANCHOR:topic -->
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Reopening implementation or documentation files under review.
- Auditing out-of-scope historical packets outside `001-search-fusion-tuning/`.
- Re-litigating already shipped length-penalty, telemetry, or rerank-threshold behavior unless the live code contradicts the packet claims.

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- Complete the operator-requested 10 iterations.
- Cover all four review dimensions.
- Check the named runtime, doc, mirror, config, and packet surfaces at least once.
- Finish with a synthesized review report and reduced registry/dashboard state.

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 6
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->
<!-- ANCHOR:what-worked -->
## 8. WHAT WORKED
- Starting from the live Stage 3 call path before reading docs made the continuity handoff gap easy to prove. (iteration 1)
- Separating public doc drift from packet-local evidence drift kept the traceability findings precise instead of collapsing everything into one vague mismatch. (iterations 3-6)
- Comparing Codex agent instructions directly against the canonical Claude contract plus the reducer/parser showed which mirror differences were cosmetic and which were runtime-breaking. (iterations 7-8)
- Re-running strict validation summaries on the full tree at the end confirmed the packet-closure finding against the current state, not a stale snapshot. (iteration 10)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 9. WHAT FAILED
- Searching for a hidden continuity-aware Stage 3 override did not surface any alternate runtime path; the gap is still in the default MMR handoff. (iteration 1)
- Looking for a compensating doc or packet note that scoped continuity to Stage 2 only did not hold up; the updated surfaces consistently overstate the Stage 3 reality instead. (iterations 3-5)
- Broad mirror drift across every agent file was not necessary to explain the live risk; the material operational mismatches are concentrated in Codex `deep-review` and `context`. (iterations 7-8)

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `SKILL.md` drift on this exact point: the skill-level search summary is broad about continuity, rerank gating, and telemetry, but it does not explicitly promise the continuity Stage 3 lambda is already active. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:592`] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `SKILL.md` drift on this exact point: the skill-level search summary is broad about continuity, rerank gating, and telemetry, but it does not explicitly promise the continuity Stage 3 lambda is already active. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:592`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `SKILL.md` drift on this exact point: the skill-level search summary is broad about continuity, rerank gating, and telemetry, but it does not explicitly promise the continuity Stage 3 lambda is already active. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:592`]

### Claude/Gemini drift on the context recovery path: both still carry the continuity-first ladder and graph-health preflight. [SOURCE: `.claude/agents/context.md:29`] [SOURCE: `.gemini/agents/context.md:29`] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Claude/Gemini drift on the context recovery path: both still carry the continuity-first ladder and graph-health preflight. [SOURCE: `.claude/agents/context.md:29`] [SOURCE: `.gemini/agents/context.md:29`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claude/Gemini drift on the context recovery path: both still carry the continuity-first ladder and graph-health preflight. [SOURCE: `.claude/agents/context.md:29`] [SOURCE: `.gemini/agents/context.md:29`]

### Claude/Gemini mirror regression on the reviewed agent flows: both runtimes still match the canonical deep-review and context contracts for the sections and continuity ladder examined in this review. [SOURCE: `.gemini/agents/deep-review.md:148`] [SOURCE: `.gemini/agents/context.md:48`] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Claude/Gemini mirror regression on the reviewed agent flows: both runtimes still match the canonical deep-review and context contracts for the sections and continuity ladder examined in this review. [SOURCE: `.gemini/agents/deep-review.md:148`] [SOURCE: `.gemini/agents/context.md:48`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claude/Gemini mirror regression on the reviewed agent flows: both runtimes still match the canonical deep-review and context contracts for the sections and continuity ladder examined in this review. [SOURCE: `.gemini/agents/deep-review.md:148`] [SOURCE: `.gemini/agents/context.md:48`]

### Claude/Gemini parity on the canonical review workflow: both markdown mirrors still match the reducer-compatible template and claim-adjudication requirement. [SOURCE: `.claude/agents/deep-review.md:148`] [SOURCE: `.gemini/agents/deep-review.md:148`] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Claude/Gemini parity on the canonical review workflow: both markdown mirrors still match the reducer-compatible template and claim-adjudication requirement. [SOURCE: `.claude/agents/deep-review.md:148`] [SOURCE: `.gemini/agents/deep-review.md:148`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claude/Gemini parity on the canonical review workflow: both markdown mirrors still match the reducer-compatible template and claim-adjudication requirement. [SOURCE: `.claude/agents/deep-review.md:148`] [SOURCE: `.gemini/agents/deep-review.md:148`]

### Feature-catalog telemetry and neutral-length notes are stale: the reviewed catalog surfaces correctly describe rerank gating at four rows plus compatibility-only length scaling and telemetry counters. [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:25`] [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:241`] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Feature-catalog telemetry and neutral-length notes are stale: the reviewed catalog surfaces correctly describe rerank gating at four rows plus compatibility-only length scaling and telemetry counters. [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:25`] [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:241`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Feature-catalog telemetry and neutral-length notes are stale: the reviewed catalog surfaces correctly describe rerank gating at four rows plus compatibility-only length scaling and telemetry counters. [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:25`] [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:241`]

### Hidden late-cycle P0 across the reviewed runtime and doc surfaces: the final pass did not surface any data-loss, auth-bypass, or hard-gate defect beyond the already active P1 set. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Hidden late-cycle P0 across the reviewed runtime and doc surfaces: the final pass did not surface any data-loss, auth-bypass, or hard-gate defect beyond the already active P1 set. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hidden late-cycle P0 across the reviewed runtime and doc surfaces: the final pass did not surface any data-loss, auth-bypass, or hard-gate defect beyond the already active P1 set. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`]

### Live MCP config drift on Tier 3 save routing: the reviewed configs describe Tier 3 as always on with fail-open Tier 2 fallback, and no active config still references `SPECKIT_TIER3_ROUTING`. [SOURCE: `.mcp.json:24`] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Live MCP config drift on Tier 3 save routing: the reviewed configs describe Tier 3 as always on with fail-open Tier 2 fallback, and no active config still references `SPECKIT_TIER3_ROUTING`. [SOURCE: `.mcp.json:24`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Live MCP config drift on Tier 3 save routing: the reviewed configs describe Tier 3 as always on with fail-open Tier 2 fallback, and no active config still references `SPECKIT_TIER3_ROUTING`. [SOURCE: `.mcp.json:24`]

### Looking for a catalog entry that limited continuity to Stage 1 or Stage 2 did not turn up any exception; the main catalog and retrieval entries repeat the same Stage 3 continuity-lambda language. [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:147`] [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:22`] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a catalog entry that limited continuity to Stage 1 or Stage 2 did not turn up any exception; the main catalog and retrieval entries repeat the same Stage 3 continuity-lambda language. [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:147`] [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:22`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a catalog entry that limited continuity to Stage 1 or Stage 2 did not turn up any exception; the main catalog and retrieval entries repeat the same Stage 3 continuity-lambda language. [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:147`] [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:22`]

### Looking for a compensating repo doc that explicitly corrected the Stage 3 continuity claim did not surface any such note; the same claim is repeated across the updated surfaces instead. [SOURCE: `.opencode/command/memory/search.md:103`] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a compensating repo doc that explicitly corrected the Stage 3 continuity claim did not surface any such note; the same claim is repeated across the updated surfaces instead. [SOURCE: `.opencode/command/memory/search.md:103`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a compensating repo doc that explicitly corrected the Stage 3 continuity claim did not surface any such note; the same claim is repeated across the updated surfaces instead. [SOURCE: `.opencode/command/memory/search.md:103`]

### Looking for a packet-local justification that `status: planned` plus unchecked items was the intended final verification state did not surface any such note in the reviewed child checklists. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile/checklist.md:3`] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Looking for a packet-local justification that `status: planned` plus unchecked items was the intended final verification state did not surface any such note in the reviewed child checklists. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile/checklist.md:3`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a packet-local justification that `status: planned` plus unchecked items was the intended final verification state did not surface any such note in the reviewed child checklists. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile/checklist.md:3`]

### Looking for a packet-local note that limited continuity verification to Stage 1 fusion or the lambda map alone did not surface any such qualifier; the packet consistently treats the end-to-end Stage 3 behavior as current reality. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/implementation-summary.md:61`] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a packet-local note that limited continuity verification to Stage 1 fusion or the lambda map alone did not surface any such qualifier; the packet consistently treats the end-to-end Stage 3 behavior as current reality. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/implementation-summary.md:61`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a packet-local note that limited continuity verification to Stage 1 fusion or the lambda map alone did not surface any such qualifier; the packet consistently treats the end-to-end Stage 3 behavior as current reality. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/implementation-summary.md:61`]

### Looking for an additional runtime defect in the telemetry, save-routing, or config surfaces did not produce a seventh finding; the active risk cluster remains centered on continuity traceability and Codex mirror parity. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1005`] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for an additional runtime defect in the telemetry, save-routing, or config surfaces did not produce a seventh finding; the active risk cluster remains centered on continuity traceability and Codex mirror parity. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1005`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an additional runtime defect in the telemetry, save-routing, or config surfaces did not produce a seventh finding; the active risk cluster remains centered on continuity traceability and Codex mirror parity. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1005`]

### Missing continuity profile in adaptive fusion: the runtime ships the researched `0.52 / 0.18 / 0.07 / 0.23` profile. [SOURCE: `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:68`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Missing continuity profile in adaptive fusion: the runtime ships the researched `0.52 / 0.18 / 0.07 / 0.23` profile. [SOURCE: `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:68`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing continuity profile in adaptive fusion: the runtime ships the researched `0.52 / 0.18 / 0.07 / 0.23` profile. [SOURCE: `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:68`]

### Phase `005-doc-surface-alignment` verification failure: phase `005` remains the only strict-clean child packet in the tree. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/checklist.md:11`] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Phase `005-doc-surface-alignment` verification failure: phase `005` remains the only strict-clean child packet in the tree. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/checklist.md:11`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase `005-doc-surface-alignment` verification failure: phase `005` remains the only strict-clean child packet in the tree. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/checklist.md:11`]

### Phase 005 over-claimed the rerank gate or telemetry surfaces: those parts of the packet remain aligned with the live runtime. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/checklist.md:64`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/checklist.md:66`] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Phase 005 over-claimed the rerank gate or telemetry surfaces: those parts of the packet remain aligned with the live runtime. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/checklist.md:64`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/checklist.md:66`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 005 over-claimed the rerank gate or telemetry surfaces: those parts of the packet remain aligned with the live runtime. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/checklist.md:64`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/checklist.md:66`]

### Playbook regression on the inspected reranker scenario: the updated manual-testing surface accurately describes telemetry counters and compatibility-only length scaling without repeating the continuity Stage 3 claim. [SOURCE: `.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/098-local-gguf-reranker-via-node-llama-cpp-p1-5.md:19`] [SOURCE: `.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/098-local-gguf-reranker-via-node-llama-cpp-p1-5.md:30`] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Playbook regression on the inspected reranker scenario: the updated manual-testing surface accurately describes telemetry counters and compatibility-only length scaling without repeating the continuity Stage 3 claim. [SOURCE: `.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/098-local-gguf-reranker-via-node-llama-cpp-p1-5.md:19`] [SOURCE: `.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/098-local-gguf-reranker-via-node-llama-cpp-p1-5.md:30`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Playbook regression on the inspected reranker scenario: the updated manual-testing surface accurately describes telemetry counters and compatibility-only length scaling without repeating the continuity Stage 3 claim. [SOURCE: `.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/098-local-gguf-reranker-via-node-llama-cpp-p1-5.md:19`] [SOURCE: `.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/098-local-gguf-reranker-via-node-llama-cpp-p1-5.md:30`]

### Re-checking the tree for a hidden fully closed parent packet did not change the result; the parent `001` folder and child packets `001-004` still fail strict validation in the current state. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/checklist.md:3`] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Re-checking the tree for a hidden fully closed parent packet did not change the result; the parent `001` folder and child packets `001-004` still fail strict validation in the current state. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/checklist.md:3`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-checking the tree for a hidden fully closed parent packet did not change the result; the parent `001` folder and child packets `001-004` still fail strict validation in the current state. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/checklist.md:3`]

### Rerank-threshold drift: Stage 3 still skips reranking below four rows and forwards the compatibility `applyLengthPenalty` flag without reintroducing length-based scoring. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:383`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Rerank-threshold drift: Stage 3 still skips reranking below four rows and forwards the compatibility `applyLengthPenalty` flag without reintroducing length-based scoring. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:383`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rerank-threshold drift: Stage 3 still skips reranking below four rows and forwards the compatibility `applyLengthPenalty` flag without reintroducing length-based scoring. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:383`]

### Reranker telemetry regression: `getRerankerStatus()` still exposes `hits`, `misses`, `staleHits`, `evictions`, `entries`, `maxEntries`, and `ttlMs`, and `resetSession()` clears the counters with the cache state. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:431`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:516`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:551`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reranker telemetry regression: `getRerankerStatus()` still exposes `hits`, `misses`, `staleHits`, `evictions`, `entries`, `maxEntries`, and `ttlMs`, and `resetSession()` clears the counters with the cache state. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:431`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:516`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:551`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reranker telemetry regression: `getRerankerStatus()` still exposes `hits`, `misses`, `staleHits`, `evictions`, `entries`, `maxEntries`, and `ttlMs`, and `resetSession()` clears the counters with the cache state. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:431`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:516`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:551`]

### Searching for a hidden continuity-aware Stage 3 override did not surface any alternate path beyond `config.detectedIntent` and `INTENT_LAMBDA_MAP`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a hidden continuity-aware Stage 3 override did not surface any alternate path beyond `config.detectedIntent` and `INTENT_LAMBDA_MAP`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a hidden continuity-aware Stage 3 override did not surface any alternate path beyond `config.detectedIntent` and `INTENT_LAMBDA_MAP`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`]

### Searching the five live MCP config surfaces for `SPECKIT_TIER3_ROUTING` did not reveal an active config defect; remaining hits were historical packet docs outside this review target. [SOURCE: `.mcp.json:24`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching the five live MCP config surfaces for `SPECKIT_TIER3_ROUTING` did not reveal an active config defect; remaining hits were historical packet docs outside this review target. [SOURCE: `.mcp.json:24`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the five live MCP config surfaces for `SPECKIT_TIER3_ROUTING` did not reveal an active config defect; remaining hits were historical packet docs outside this review target. [SOURCE: `.mcp.json:24`]

### Task-list incompleteness: the child `tasks.md` files are all marked `status: complete`; the closure gap is in checklist verification rather than implementation task execution. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/tasks.md:3`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum/tasks.md:3`] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Task-list incompleteness: the child `tasks.md` files are all marked `status: complete`; the closure gap is in checklist verification rather than implementation task execution. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/tasks.md:3`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum/tasks.md:3`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Task-list incompleteness: the child `tasks.md` files are all marked `status: complete`; the closure gap is in checklist verification rather than implementation task execution. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/tasks.md:3`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum/tasks.md:3`]

### Tier 3 feature-flag residue in the live stack: the save handler now wires Tier 3 routing unconditionally, and the active configs describe it as always on with fail-open Tier 2 fallback. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1005`] [SOURCE: `.mcp.json:24`] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Tier 3 feature-flag residue in the live stack: the save handler now wires Tier 3 routing unconditionally, and the active configs describe it as always on with fail-open Tier 2 fallback. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1005`] [SOURCE: `.mcp.json:24`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Tier 3 feature-flag residue in the live stack: the save handler now wires Tier 3 routing unconditionally, and the active configs describe it as always on with fail-open Tier 2 fallback. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1005`] [SOURCE: `.mcp.json:24`]

### Treating the Codex context mirror as "memory first but equivalent enough" does not hold up once the missing `handover.md` / `_memory.continuity` / graph-health ordering is compared directly to the canonical workflow. [SOURCE: `.codex/agents/context.toml:30`] [SOURCE: `.claude/agents/context.md:48`] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating the Codex context mirror as "memory first but equivalent enough" does not hold up once the missing `handover.md` / `_memory.continuity` / graph-health ordering is compared directly to the canonical workflow. [SOURCE: `.codex/agents/context.toml:30`] [SOURCE: `.claude/agents/context.md:48`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the Codex context mirror as "memory first but equivalent enough" does not hold up once the missing `handover.md` / `_memory.continuity` / graph-health ordering is compared directly to the canonical workflow. [SOURCE: `.codex/agents/context.toml:30`] [SOURCE: `.claude/agents/context.md:48`]

### Treating the Codex delta as cosmetic TOML-vs-Markdown formatting does not hold up because the live reducer keys on the actual heading and section names, not just the storage format. [SOURCE: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:210`] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating the Codex delta as cosmetic TOML-vs-Markdown formatting does not hold up because the live reducer keys on the actual heading and section names, not just the storage format. [SOURCE: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:210`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the Codex delta as cosmetic TOML-vs-Markdown formatting does not hold up because the live reducer keys on the actual heading and section names, not just the storage format. [SOURCE: `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:210`]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 11. RULED OUT DIRECTIONS
- Cross-encoder telemetry regression: `getRerankerStatus()` and `resetSession()` still expose and reset `hits`, `misses`, `staleHits`, and `evictions` correctly. (iteration 2, evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:431`)
- Live Tier 3 save-routing flag drift: the active save handler and five live MCP configs no longer rely on `SPECKIT_TIER3_ROUTING`. (iteration 2, evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1005`)
- Claude/Gemini parity regression on the reviewed agent flows: both runtimes still carry the canonical deep-review template and continuity-first context ladder. (iteration 9, evidence: `.gemini/agents/deep-review.md:148`)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Stop iteration. Open remediation planning for the six active P1 findings before treating packet `001` as fully closed.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:known-context -->
## 13. KNOWN CONTEXT
- The user explicitly requested a post-implementation and post-doc-alignment review of the complete state.
- Child phases `001-004` already contain narrower review artifacts, but this parent review re-checks the shipped aggregate state rather than inheriting those verdicts blindly.
- The live target surfaces include runtime code, requested docs, mirrors across Claude/Codex/Gemini, five live MCP configs, and the packet tree `001-005`.
- CocoIndex MCP calls were attempted during setup but returned cancelled-tool responses, so the review used direct file reads, grep sweeps, and validator runs.

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:cross-reference-status -->
## 14. CROSS-REFERENCE STATUS
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 6 | Runtime Stage 3 still ignores the internal continuity handoff while the packet and repo docs say the continuity lambda is active. |
| `checklist_evidence` | core | fail | 10 | `001-004` still carry `status: planned` plus unchecked checklist items, so the packet tree is not fully verification-closed. |
| `skill_agent` | overlay | fail | 8 | Codex `deep-review` and `context` drift from the canonical review and continuity contracts. |
| `agent_cross_runtime` | overlay | fail | 9 | Claude and Gemini align on the reviewed flows; Codex remains the outlier. |
| `feature_catalog_code` | overlay | fail | 4 | Catalog surfaces repeat the unshipped Stage 3 continuity-lambda behavior. |
| `playbook_capability` | overlay | pass | 9 | The inspected reranker playbook surface accurately reflects telemetry and compatibility-only length-penalty behavior without repeating the continuity claim. |

<!-- /ANCHOR:cross-reference-status -->
<!-- ANCHOR:files-under-review -->
## 15. FILES UNDER REVIEW
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | D1, D2, D4 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | D1, D3, D4 | 10 | 0 P0, 2 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts` | D1, D3 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts` | D1, D3 | 3 | 0 P0, 2 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | D1, D3 | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | D1, D2 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/command/memory/search.md` | D3, D4 | 3 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | D3, D4 | 3 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/SKILL.md` | D3, D4 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/configs/README.md` | D3, D4 | 3 | 0 P0, 1 P1, 0 P2 | complete |
| `README.md` | D3, D4 | 3 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` | D3, D4 | 4 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md` | D3, D4 | 4 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md` | D3, D4 | 4 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile/implementation-summary.md` | D3 | 5 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/spec.md` | D3 | 5 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/tasks.md` | D3 | 5 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment/checklist.md` | D3 | 6 | 0 P0, 2 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/checklist.md` | D3 | 6 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry/checklist.md` | D3 | 6 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile/checklist.md` | D3 | 6 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum/checklist.md` | D3 | 6 | 0 P0, 1 P1, 0 P2 | complete |
| `.claude/agents/deep-review.md` | D3, D4 | 7 | 0 P0, 1 P1, 0 P2 | complete |
| `.codex/agents/deep-review.toml` | D3, D4 | 7 | 0 P0, 1 P1, 0 P2 | complete |
| `.gemini/agents/deep-review.md` | D3, D4 | 9 | 0 P0, 0 P1, 0 P2 | complete |
| `.claude/agents/context.md` | D3, D4 | 8 | 0 P0, 1 P1, 0 P2 | complete |
| `.codex/agents/context.toml` | D3, D4 | 8 | 0 P0, 1 P1, 0 P2 | complete |
| `.gemini/agents/context.md` | D3, D4 | 9 | 0 P0, 0 P1, 0 P2 | complete |
| `.mcp.json` | D2, D3 | 9 | 0 P0, 0 P1, 0 P2 | complete |
| `.claude/mcp.json` | D2, D3 | 9 | 0 P0, 0 P1, 0 P2 | complete |
| `.vscode/mcp.json` | D2, D3 | 9 | 0 P0, 0 P1, 0 P2 | complete |
| `.gemini/settings.json` | D2, D3 | 9 | 0 P0, 0 P1, 0 P2 | complete |
| `opencode.json` | D2, D3 | 9 | 0 P0, 0 P1, 0 P2 | complete |

<!-- /ANCHOR:files-under-review -->
<!-- ANCHOR:review-boundaries -->
## 16. REVIEW BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-04-13T11:05:00Z-001-search-fusion-tuning-review, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 15 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-04-13T11:05:00Z

<!-- /ANCHOR:review-boundaries -->
