## §6 Integration Gaps (numbered, with P0/P1/P2)

1. **[P0] Validation triggers are not phase-aware.**  
   Section 6 only lists Gate 3, completion verification, manual `/memory:save`, and template validation. It omits phase triggers now in active use: `create.sh --phase`, `validate.sh --recursive`, phase-link validation, and `/spec_kit:phase` workflow execution.

2. **[P0] Cross-skill workflow table does not reflect multi-CLI coordination.**  
   Epic delivery used coordinated campaigns across Codex, Copilot, Gemini, and Claude, but Section 6 still shows only linear `system-spec-kit -> sk-code/sk-doc/sk-git` paths without any cross-CLI orchestration or verification campaign loop.

3. **[P1] Feature-catalog lifecycle is missing from integration workflows.**  
   The epic delivered a 19-category, 189-feature catalog plus code-audit-per-category execution, but Section 6 has no workflow for feature registration, audit mapping, or verification against catalog entries.

4. **[P2] Priority model lacks phase-aggregation semantics.**  
   P0/P1/P2 definitions are generic and do not define parent-child escalation rules for phased specs (for example, child failure propagating to parent completion status).

## §7 Related Resources Gaps (numbered, with P0/P1/P2)

1. **[P0] MCP server/tool metadata is stale.**  
   Section 7 references `context-server.ts` as "~682 lines" and "25 MCP tools." Current `context-server.ts` is 1073 lines, and metadata shows more tools (package description: 28; runtime context indicates 31).

2. **[P1] Missing core deliverable resources from the epic.**  
   `feature_catalog/` (19 categories) and `manual_testing_playbook/` are not listed in Related Resources despite being central artifacts for verification and governance.

3. **[P1] Missing explicit phase-system resource links.**  
   External dependencies do not point to phase references (`references/structure/phase_definitions.md`, phase command docs, phase link validation scripts), even though phase decomposition is now a first-class workflow.

4. **[P2] Code-audit synthesis artifacts are not discoverable from Section 7.**  
   The Related Resources table does not include links to synthesis outputs from the audit campaigns (for example, `012-code-audit-per-feature-catalog/` and synthesis artifacts under epic scratch folders).

## Quick Reference Gaps

- Missing recursive validation command:
  - `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/<parent-spec> --recursive`

- Missing phase creation commands:
  - `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh "Feature Name" --phase --level 3 --phases 3 --phase-names "Design,Implement,Verify"`
  - `bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --phase --parent specs/<parent-spec> --phases 2 --phase-names "Hardening,Rollout" "Feature Name"`

- Missing phase workflow commands:
  - `/spec_kit:phase`
  - `bash .opencode/skill/system-spec-kit/scripts/rules/check-phase-links.sh specs/<parent-spec>`
  - `bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh --recommend-phases --json specs/<spec>`

- Missing feature-flag management/verification commands:
  - `cd .opencode/skill/system-spec-kit/mcp_server && npm run test:hydra:phase1`
  - `cd .opencode/skill/system-spec-kit/mcp_server && npm test -- --run tests/memory-roadmap-flags.vitest.ts`
  - Runtime toggle example: `SPECKIT_ADAPTIVE_FUSION=0 node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js`

## Recommendations

1. Update Section 6 with a **phase-aware validation matrix** (single-folder + recursive parent/child + phase-link checks) and explicit completion escalation rules.
2. Expand Cross-Skill Workflows to include **multi-CLI campaign orchestration** and a **feature-catalog -> audit -> verification** loop.
3. Refresh Section 7 metadata to current MCP realities (tool count and server footprint), and add direct links to `feature_catalog/`, `manual_testing_playbook/`, and phase docs.
4. Replace Quick Reference commands with a **two-tier block**: core commands (always) and phase/feature-flag commands (conditional), including explicit verification commands.
