# Iteration 004: Maintainability audit of continuity manuals and workflow surfaces

## Focus
This iteration reviewed the remaining operator-facing maintainability surfaces: cross-runtime write-agent manuals, create-agent YAMLs, memory command docs, and the deep-review/deep-research workflow YAMLs. The pass also re-read the `shared_space_id` startup-migration wording against the shipped runtime to validate whether the prior P2 advisory is actually a release-significant contract drift.

## Findings

### P0
- None.

### P1
- **F005**: `shared_space_id` migration wording still overstates the shipped startup contract — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md:47` — The spec packet still promises a one-time / first-startup drop, and the changelog repeats that framing, but `dropDeprecatedSharedSpaceColumn()` retries `ALTER TABLE ... DROP COLUMN shared_space_id` on every bootstrap while the column exists and only no-ops after the attempt fails on unsupported SQLite builds. Under this iteration's rubric override, that spec/changelog/runtime disagreement is a live P1 contract defect, not a P2 wording nit. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md:47] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md:65] [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.0.0.md:94] [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.0.0.md:258] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1534] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1537] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1539] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1541]

```json
{"type":"claim-adjudication","findingId":"F005","claim":"The shipped docs still describe the shared_space_id drop as a one-time / first-startup migration even though the runtime retries the DROP COLUMN attempt on every bootstrap while the column remains.","evidenceRefs":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md:47",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md:65",".opencode/changelog/01--system-spec-kit/v3.4.0.0.md:94",".opencode/changelog/01--system-spec-kit/v3.4.0.0.md:258",".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1534",".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1537",".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1539",".opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1541"],"counterevidenceSought":"Re-read the runtime helper for any persisted completion flag, schema rewrite, or first-startup guard that would make the drop genuinely one-time.","alternativeExplanation":"The docs may have intended to describe only successful DROP COLUMN behavior on SQLite 3.35+, but they currently describe the general startup contract rather than a version-qualified fast path.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Downgrade if the docs are revised to version-qualify the behavior or the runtime adds a real one-time guard that suppresses subsequent retries after an unsupported-build failure."}
```

- **F006**: memory command docs still describe a retired `memory/` continuity surface — `.opencode/command/memory/save.md:145` — `memory/save.md` tells operators to validate legacy support artifacts under `memory/`, `memory/manage.md` still instructs them to describe `memory/` inputs as legacy compatibility material, and `memory/README.txt` still publishes a `memory/` command tree with “shared lifecycle” wording. The shipped release contract says standalone `memory/*.md` artifacts are retired and continuity now lives in canonical spec documents, so these operator docs still advertise a superseded surface. [SOURCE: .opencode/command/memory/save.md:145] [SOURCE: .opencode/command/memory/manage.md:50] [SOURCE: .opencode/command/memory/README.txt:112] [SOURCE: .opencode/command/memory/README.txt:116] [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.0.0.md:14] [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.0.0.md:18]

```json
{"type":"claim-adjudication","findingId":"F006","claim":"The memory command docs still present memory/ as an operator-visible continuity surface even though the release contract retires standalone memory/*.md artifacts.","evidenceRefs":[".opencode/command/memory/save.md:145",".opencode/command/memory/manage.md:50",".opencode/command/memory/README.txt:112",".opencode/command/memory/README.txt:116",".opencode/changelog/01--system-spec-kit/v3.4.0.0.md:14",".opencode/changelog/01--system-spec-kit/v3.4.0.0.md:18"],"counterevidenceSought":"Checked the active release notes and cross-runtime manuals for any surviving public compatibility promise that still allows standalone memory/ continuity artifacts.","alternativeExplanation":"These lines may have been intended as historical migration notes for debugging old packets, but they remain phrased as active operator guidance inside current shipped commands.","finalSeverity":"P1","confidence":0.89,"downgradeTrigger":"Downgrade if the docs are relocated behind an explicitly historical compatibility section or the shipped contract is updated to re-allow memory/ continuity inputs."}
```

- **F007**: deep-review and deep-research workflows still document non-canonical support-artifact indexing — `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:860` — The review/research YAMLs still warn against manually authoring continuity artifacts under `memory/` and tell operators to index a generic “generated support artifact” with `memory_save`, while the create-agent YAMLs already pin `memory_save` to `implementation-summary.md` and state that standalone `memory/*.md` files are retired. That mismatch leaves the automation docs with a looser, legacy-flavored contract than the canonical create-agent flow. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:860] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:863] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:865] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:992] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:995] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:997] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:641] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:644] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:646] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:819] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:822] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:824] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:573] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:577] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:579] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:661] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:665] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:667]

```json
{"type":"claim-adjudication","findingId":"F007","claim":"The deep-review and deep-research workflow docs still describe indexing a generic generated support artifact and refer to memory/ authoring guardrails instead of using the same canonical spec-document path contract as create-agent.","evidenceRefs":[".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:860",".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:863",".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:865",".opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:992",".opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:995",".opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:997",".opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:641",".opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:644",".opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:646",".opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:819",".opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:822",".opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:824",".opencode/command/create/assets/create_agent_auto.yaml:573",".opencode/command/create/assets/create_agent_auto.yaml:577",".opencode/command/create/assets/create_agent_auto.yaml:579",".opencode/command/create/assets/create_agent_confirm.yaml:661",".opencode/command/create/assets/create_agent_confirm.yaml:665",".opencode/command/create/assets/create_agent_confirm.yaml:667"],"counterevidenceSought":"Checked the create-agent YAMLs and active cross-runtime manuals for any matching generic support-artifact contract that would normalize the review/research wording.","alternativeExplanation":"The workflow placeholder may have been intended to accept generate-context.js output regardless of file type, but it no longer matches the stronger canonical-doc wording used elsewhere in the shipped tooling.","finalSeverity":"P1","confidence":0.86,"downgradeTrigger":"Downgrade if the workflow docs are updated to name the canonical generated file explicitly or if generate-context.js is documented as intentionally returning a supported non-doc artifact here."}
```

### P2
- None.

## Ruled Out
- **F003 closure check**: The active write-agent manuals that still discuss continuity now rebuild from `handover.md` and `_memory.continuity` inside `implementation-summary.md`; no audited agent manual advertised `/memory:manage shared`. [SOURCE: .opencode/agent/write.md:89] [SOURCE: .claude/agents/write.md:89] [SOURCE: .gemini/agents/write.md:89]
- **NF001 closure check**: Both create-agent YAMLs still route `memory_save` to the canonical `implementation-summary.md` path and explicitly say standalone `memory/*.md` files are retired. [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:573] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:577] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:579] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:661] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:665] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:667]
- `.codex/agents/speckit.toml` only documents tool-layer capability names for `memory_save`; it does not advertise retired continuity artifacts or `/memory:manage shared` flows. [SOURCE: .codex/agents/speckit.toml:157] [SOURCE: .codex/agents/speckit.toml:160] [SOURCE: .codex/agents/speckit.toml:169]

## Dead Ends
- Exact-file sweeps across `.codex/agents/write.toml` and `.codex/agents/handover.toml` produced no retired continuity references, so there is no line-cited maintainability defect to pursue there in this packet.
- The review/research YAML defect is not the presence of `memory_save` itself; it is the lingering generic “generated support artifact” wording and `memory/` guardrail phrasing. The create-agent YAMLs confirm the tool call can already be documented against a canonical spec document instead. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:863] [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:573]

## Recommended Next Focus
After remediation lands, run a traceability-oriented verification pass that re-reads the memory command docs, deep-review/deep-research YAMLs, and the `shared_space_id` startup-migration text against `vector-index-schema.ts` to confirm the shipped contract is fully canonical.

## Assessment
- New findings ratio: 0.83
- Dimensions addressed: maintainability
- Novelty justification: Two fully new P1 documentation/workflow contract defects were found, and the prior `F005` advisory was upgraded to P1 after re-reading the runtime against the shipped wording.
- Closure status:
  - `F003`: closed in this packet; the active cross-runtime write manuals now point to canonical spec-doc continuity surfaces. [SOURCE: .opencode/agent/write.md:89] [SOURCE: .claude/agents/write.md:89] [SOURCE: .gemini/agents/write.md:89]
  - `NF001`: closed in this packet; create-agent auto/confirm still index `implementation-summary.md` directly. [SOURCE: .opencode/command/create/assets/create_agent_auto.yaml:577] [SOURCE: .opencode/command/create/assets/create_agent_confirm.yaml:665]
  - `NF002`: not closed; the residual command/workflow drift is now captured as `F006` and `F007`. [SOURCE: .opencode/command/memory/save.md:145] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:863]
- Files reviewed:
  - `.opencode/agent/write.md`
  - `.claude/agents/write.md`
  - `.gemini/agents/write.md`
  - `.codex/agents/write.toml`
  - `.codex/agents/speckit.toml`
  - `.codex/agents/handover.toml`
  - `.opencode/command/create/assets/create_agent_auto.yaml`
  - `.opencode/command/create/assets/create_agent_confirm.yaml`
  - `.opencode/command/memory/save.md`
  - `.opencode/command/memory/learn.md`
  - `.opencode/command/memory/search.md`
  - `.opencode/command/memory/README.txt`
  - `.opencode/command/memory/manage.md`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/checklist.md`
  - `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
