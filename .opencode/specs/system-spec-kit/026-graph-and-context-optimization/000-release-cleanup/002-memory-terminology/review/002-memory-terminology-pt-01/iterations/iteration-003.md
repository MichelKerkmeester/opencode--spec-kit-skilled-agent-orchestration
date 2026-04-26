# Iteration 003 - Traceability

## Dimension

Traceability. Focus: `spec_code`, checklist applicability, anchor integrity, cross-runtime parity, feature catalog consistency, and playbook capability after the bulk memory-terminology substitution pass.

## REQ-001 Traceability

PASS. Frozen identifiers remain intact.

Evidence:
- `mcp_server/tool-schemas.ts` still declares 21 `memory_*` MCP tool names: `memory_context`, `memory_search`, `memory_quick_search`, `memory_match_triggers`, `memory_save`, `memory_list`, `memory_stats`, `memory_health`, `memory_delete`, `memory_update`, `memory_validate`, `memory_bulk_delete`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `memory_index_scan`, `memory_get_learning_history`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`.
- `mcp_server/handlers/` still contains 17 `memory-*.ts` handler files.
- `/memory:save`, `/memory:search`, `/memory:learn`, and `/memory:manage` command files remain present across OpenCode, Claude, and Gemini mirrors.
- `_memory:` examples remain in `SKILL.md:555`; folder names `references/memory/` and `scripts/dist/memory/` remain referenced as frozen identifiers.
- Cognitive identifier `working_memory` remains in `mcp_server/lib/cognitive/working-memory.ts:46`.

## REQ-002 Traceability

PASS. Spot-checks show concrete surface nouns in MCP descriptions.

Evidence:
- `mcp_server/tool-schemas.ts:47-54` keeps tool names frozen while `memory_context` / `memory_search` descriptions point to spec-doc continuity retrieval and indexed spec-doc records.
- `mcp_server/tool-schemas.ts:81-91` preserves the cognitive term "working memory" while changing returned units to duplicate `spec-doc records` and adjacent/contiguous `spec-doc records`.
- `mcp_server/tool-schemas.ts:221-229` describes `memory_save` and `memory_list` in terms of spec documents, pending spec-doc records, and stored spec-doc records.

## REQ-003 Traceability

PASS. Skill prose and supporting docs use the modernized vocabulary for the reviewed surfaces.

Evidence:
- `SKILL.md:564-629` uses "spec-doc record command surface", "indexed spec docs", "constitutional rules", and preserves checkpoint identifiers.
- `README.md:56-58` introduces "indexed-continuity store" and the required disambiguation note.
- `constitutional/README.md` grep evidence from the PR1 pass shows `constitutional rules` replacing `constitutional memories` in operator-facing prose.
- `references/memory/memory_system.md` and `references/debugging/troubleshooting.md` were included in the REQ-004 zero-out scan below.

## REQ-004 Traceability

PASS. The requested abstract phrase grep has zero non-cognitive hits.

Evidence:
- `python` scan equivalent to `grep -niE "(your|the|a|an|each|every)\s+memor(y|ies)"` across `SKILL.md`, `README.md`, `references/**/*.md`, `constitutional/README.md`, `CLAUDE.md`, and `AGENTS.md` returned `REQ-004 non-cognitive abstract phrase hits: 0`.

## REQ-005 Traceability

PASS. Both required `Note:` callouts are present.

Evidence:
- `README.md:58` begins with `Note:` and names both Anthropic Claude Memory and the MCP reference `memory` server.
- `mcp_server/README.md:53` begins with `Note:` and names both Anthropic Claude Memory and the MCP reference `memory` server.

## REQ-006 Traceability

PASS. Mirror parity re-check did not show regression.

Evidence:
- Four context-agent mirrors each contain `spec-doc record` 5 times, `Record #` 2 times, and zero `(your|the|a|an|each|every) memory` hits: `.claude/agents/context.md`, `.opencode/agent/context.md`, `.gemini/agents/context.md`, `.codex/agents/context.toml`.
- OpenCode and Claude command mirrors compare equal for all four commands: `save`, `search`, `learn`, and `manage`.
- Gemini TOML mirrors retain the modernized top-level descriptions and contain the regenerated command bodies.

## REQ-007 Traceability

PASS. Cognitive carve-out remains intact while the requested spec-doc-row JSDoc substitutions are present.

Evidence:
- `mcp_server/lib/cognitive/working-memory.ts:46` still creates `working_memory`; `working-memory.ts:29` still cites Miller's Law.
- `mcp_server/lib/cognitive/fsrs-scheduler.ts:31-37` still preserves `FSRS_*` constants.
- `mcp_server/lib/cognitive/fsrs-scheduler.ts:186` now says "new spec-doc record".
- `mcp_server/lib/cognitive/prediction-error-gate.ts:198` now says "new spec-doc record".
- `mcp_server/lib/cognitive/temporal-contiguity.ts:136` now logs "Invalid anchor timestamp for spec-doc record".
- `mcp_server/lib/cognitive/adaptive-ranking.ts:15` now says "single spec-doc record".

## REQ-008 Traceability

FAIL. The focused feature/playbook phrasing checks pass, but anchor integrity fails on README same-file links.

Evidence:
- Feature catalog target paragraphs pass at `feature_catalog/feature_catalog.md:905`, `:2663`, `:3362`, and `:4208`.
- Sister source entries pass for the sampled required mirrors: `feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md:13`, `feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-edge-cases.md:23`, `feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md:23`, `feature_catalog/13--memory-quality-and-indexing/06-reconsolidation-on-save.md:13`, `feature_catalog/14--pipeline-architecture/19-embedding-retry-orchestrator.md:13`, and `feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md:28`.
- `README.md:25-38` contains 14 same-file TOC links using `#1--overview` style targets. The file defines explicit anchors such as `<!-- ANCHOR:overview -->` and headings that normalize to `#1-overview`, not the double-hyphen targets.

## Anchor Integrity

FAIL.

Evidence:
- `SKILL.md`: 7 explicit anchors, 0 same-file markdown anchor references, 0 missing.
- `README.md`: 11 explicit anchors, 16 same-file markdown anchor references, 14 missing.
- Missing README targets: `#1--overview`, `#2--quick-start`, `#3--features`, `#31--spec-folder-workflows`, `#32--memory-system`, `#33--commands`, `#34--templates`, `#35--scripts-and-validation`, `#4--structure`, `#5--configuration`, `#6--usage-examples`, `#7--troubleshooting`, `#8--faq`, `#9--related-documents`.
- Broad `.md#anchor` scan under `.opencode/skill/system-spec-kit/` also found third-party `node_modules` links, so those were excluded from severity adjudication as out of packet-owned scope.

## Checklist Evidence

N/A. The packet has no `checklist.md`; `test -f .../002-memory-terminology/checklist.md` returned exit code 1. This iteration records `checklist_evidence: N/A` rather than failing a missing Level 2 checklist because the user explicitly scoped checklist evidence as not applicable for this packet.

## Overlay Checks

### agent_cross_runtime

PASS. Context-agent mirrors and command mirrors remain aligned after iteration 2.

### feature_catalog_code

PASS with P2 advisory. Tool names remain frozen and TypeScript fenced blocks were not changed in the reviewed catalog mirrors. However, the main catalog contains substitution polish issues such as duplicate `spec-doc record record`.

Evidence:
- `feature_catalog/feature_catalog.md:171-179` still references correct MCP tool names (`memory_context`, `memory_quick_search`, `memory_search`, `memory_save`, and related tools).
- TypeScript fenced block comparison against `HEAD` for the reviewed catalog mirrors reported no changed TS fenced blocks.
- Advisory evidence: `feature_catalog/feature_catalog.md:467` and `feature_catalog/feature_catalog.md:517` contain `spec-doc record record`.

### playbook_capability

PASS. Sampled scenarios remain executable and reference live tool surfaces.

Evidence:
- `manual_testing_playbook/01--retrieval/187-quick-search-memory-quick-search.md:36-40` still validates `memory_quick_search` via achievable calls including `query`, `specFolder`, `limit`, and governance boundaries.
- `manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md:32-44` still validates generated context artifacts through `memory_search` / `memory_context` and tier-invariant spot checks.
- `manual_testing_playbook/13--memory-quality-and-indexing/044-reconsolidation-on-save-tm-06.md:31-96` still describes achievable reconsolidation states: merge, supersede/deprecate, stale merge abort, and BM25 repair debt persistence.
- `manual_testing_playbook/14--pipeline-architecture/204-embedding-retry-orchestrator.md:36-37` still describes an achievable pending-embedding fallback state.

## Findings by Severity

### P0

None.

### P1

#### P1-003 [P1] README table-of-contents anchors do not resolve

- File: `.opencode/skill/system-spec-kit/README.md:25`
- Claim: REQ-008 requires no broken anchors/links, but the README TOC links target missing double-hyphen anchors.
- EvidenceRefs: `.opencode/skill/system-spec-kit/README.md:25-38`, `.opencode/skill/system-spec-kit/README.md:44-46`, `.opencode/skill/system-spec-kit/README.md:157-159`.
- CounterevidenceSought: Checked explicit `<!-- ANCHOR:... -->` markers and GitHub-style heading slugs. `overview` and `1-overview` exist conceptually; `1--overview` does not.
- AlternativeExplanation: A non-GitHub renderer could theoretically generate double-hyphen slugs from numbered headings. The file itself also uses `#7-troubleshooting` at `README.md:237`, which matches the single-hyphen heading slug pattern and contradicts the TOC style.
- FinalSeverity: P1.
- Confidence: High.
- DowngradeTrigger: Downgrade to P2 only if the supported renderer is shown to resolve `#1--overview` to `## 1. OVERVIEW` or if explicit matching anchor tags are added elsewhere.

### P2

#### P2-001 [P2] Feature catalog has substitution polish drift

- File: `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:467`
- Evidence: `feature_catalog/feature_catalog.md:467` and `feature_catalog/feature_catalog.md:517` contain `spec-doc record record`; nearby catalog prose still has residual abstract nouns such as `existing memories` at `feature_catalog/feature_catalog.md:451` and `:459`.
- Recommendation: Clean these in the maintainability pass; this does not block traceability for the four REQ-008 target paragraphs.

## Verdict

CONDITIONAL.

Reason: new P1 traceability finding P1-003 blocks REQ-008 anchor/link acceptance. No P0 findings were found. P2-001 is advisory and should be handled during maintainability.

## Next Dimension

Maintainability. Prioritize P1-003 remediation first, then use the maintainability pass to clean P2-001 and any similar substitution polish drift.
