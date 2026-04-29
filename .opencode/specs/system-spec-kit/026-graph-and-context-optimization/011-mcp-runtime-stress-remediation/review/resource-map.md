# Resource Map: 011 MCP Runtime Stress Remediation Review

## Files Reviewed

### Review Control Plane

- `review/deep-review-config.json:1-30` - executor, scope, status.
- `review/deep-review-strategy.md:1-79` - commit set, iteration focus map, constraints, synthesis targets.
- `review/deep-review-state.jsonl:1-12` - init, iteration events, synthesis event.
- `review/deep-review-findings-registry.json:1-57` - active findings registry.
- `review/iterations/iteration-001.md` through `review/iterations/iteration-010.md` - per-iteration evidence trail.
- `review/deltas/iteration-001.jsonl` through `review/deltas/iteration-010.jsonl` - convergence metrics.

### Packet Docs

- `022-stress-test-results-deep-research/research/research.md` - sampled research synthesis and evidence discipline.
- `023-live-handler-envelope-capture-seam/implementation-summary.md:55-115` - PP-1 TC-3 stale limitation.
- `024-harness-telemetry-export-mode/implementation-summary.md` - harness export and telemetry context.
- `025-memory-search-degraded-readiness-wiring/tasks.md:80-102` - stale blocked verification tasks.
- `025-memory-search-degraded-readiness-wiring/implementation-summary.md:110-125` - TC-3 closure and focused verification.
- `026-readiness-scaffolding-cleanup/implementation-summary.md:50-145` - zero-reference claim and broad-suite caveat.
- `027-memory-context-structural-channel-research/research/research.md` - sampled research synthesis and deferred planning.
- `028-deep-review-skill-contract-fixes/spec.md:1-40` - stale continuity/status.
- `028-deep-review-skill-contract-fixes/implementation-summary.md:1-110` - completed resolver/YAML contract fix.

### Runtime and Test Code

- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1160-1188` - handler snapshot to envelope path.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-readiness-mapper.ts:1-88` - snapshot/richer payload mapper.
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts:280-310` - TC-3 passing degradedReadiness assertion.
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w10-degraded-readiness-integration.vitest.ts` - W10 path preservation sample.
- `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts` - sampled stale structural failures after 026.
- `.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts` - sampled broad-suite line-limit failures.
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts` - sampled readiness mock cleanup surface.

### Skill Contract Code and Docs

- `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs:1-180` - flat-first resolver.
- `.opencode/skill/system-spec-kit/scripts/tests/review-research-paths.vitest.ts:1-177` - flat/reuse/branch test matrix.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` - synthesis staging step.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` - synthesis staging step.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` - synthesis staging step.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` - synthesis staging step.
- `.opencode/skill/system-spec-kit/mcp_server/core/README.md:34-45` - stale embedding-readiness doc sentence.
- `.opencode/skill/system-spec-kit/references/structure/folder_structure.md:190-222` - stale pt-01-first example and corrected flat-first prose.

## Remediation Candidates

| Finding | File:line | Recommended action | Blocking severity |
|---------|-----------|--------------------|-------------------|
| F-001 | `023-live-handler-envelope-capture-seam/implementation-summary.md:64` | Amend active limitation/continuity to say 025 closed TC-3; keep historical test-only context if desired. | P1 |
| F-002 | `025-memory-search-degraded-readiness-wiring/tasks.md:83` | Update tasks/completion criteria to reflect final `tsc --noEmit` pass after 026; remove blocked marker or add resolution note. | P1 |
| F-004 | `028-deep-review-skill-contract-fixes/spec.md:17` | Update `_memory.continuity`, status, and completion percentage to match `implementation-summary.md`. | P1 |
| F-005 | `026-readiness-scaffolding-cleanup/implementation-summary.md:58` | Decide broad-suite policy: fix unrelated stale failures or carry an explicit release-readiness allowlist. | P1 |
| F-003 | `.opencode/skill/system-spec-kit/mcp_server/core/README.md:40` | Remove `embedding-readiness state` from `db-state.ts` ownership list. | P2 |
| F-006 | `.opencode/skill/system-spec-kit/references/structure/folder_structure.md:196` | Change the first-run child example to flat `research/`/`review/`; show `pt-NN` only for conflict/branch cases. | P2 |

## Coverage Gaps

- Older 011 children `001-021` were not audited beyond required cross-references; strategy marks them out of scope at `review/deep-review-strategy.md:75`.
- Cross-track `005-review-remediation/009` and `010` were context only; full review of those packets is a separate run per `review/deep-review-strategy.md:76`.
- The full Vitest command did not complete cleanly in this review. Targeted commands passed, but broad-suite readiness remains a P1 release-readiness caveat.
- Strict recursive validation still has one pre-existing `PHASE_LINKS` warning on child specs `019-028`; remediation would require writes outside this review's target authority.

## Finding Cross-References

- F-001 links `023-live-handler-envelope-capture-seam/implementation-summary.md:64` to final closure evidence in `025-memory-search-degraded-readiness-wiring/implementation-summary.md:122` and `handler-memory-search-live-envelope.vitest.ts:302`.
- F-002 links `025-memory-search-degraded-readiness-wiring/tasks.md:83` to 026 final TypeScript pass evidence in `026-readiness-scaffolding-cleanup/implementation-summary.md:57`.
- F-003 links stale docs in `core/README.md:40` to 026 zero-reference claim in `026-readiness-scaffolding-cleanup/implementation-summary.md:56`.
- F-004 links stale `028/spec.md:17` to completion evidence in `028/implementation-summary.md:14` and resolver tests in `review-research-paths.vitest.ts:87`.
- F-005 links 026 release-readiness caveat in `026/implementation-summary.md:58` and `:133` to this review's reproduced broad-suite failures.
- F-006 links the stale tree example in `folder_structure.md:196` to corrected prose in `folder_structure.md:219` and resolver code in `review-research-paths.cjs:169`.
