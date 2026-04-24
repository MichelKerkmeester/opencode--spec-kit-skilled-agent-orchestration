# Strategy — Gap Investigation for 014

## Charter

Non-Goals:
- Re-doing pt-02 research in full.
- Finding implementation bugs inside the landed 014 code.

Stop Conditions:
- Coverage saturation on cross-references.
- New sweeps only return files already present in `resource-map.md`, packet task target lists, or the growing deduped missed-files set.

Success Criteria:
- Produce a concrete deduplicated missed-files list.
- Every flagged file has a specific relevance reason tied to a landed 014 contract, downstream consumer, shared operator surface, or missing regression check.
- Separate true misses from already-covered packet files and from historically-related but no-longer-actionable references.

## Known Inventory

- `resource-map.md` reports 48 references total.
- Categories present in the packet map: READMEs=1, Documents=2, Skills=14, Specs=18, Scripts=5, Tests=2, Config=6.
- No packet-owned Commands, Agents, or Meta entries were recorded.
- Already-covered implementation surfaces include the OpenCode plugin entrypoint, the plugin-helper bridge, shared advisor libs (`skill-advisor-brief.ts`, `render.ts`, `metrics.ts`), Codex/Claude/Copilot/Gemini hook adapters, `advisor_recommend`, `advisor_validate`, `advisor-tool-schemas.ts`, the package README, the hook reference, and two focused tests (`plugin-bridge.vitest.ts`, `advisor-validate.vitest.ts`).
- Packet docs cite an `applied/` folder, but the directory is absent on disk in this workspace snapshot; use `tasks.md` target lists plus `resource-map.md` as the exclusion proxy to avoid false positives.

## Gap Hypotheses

- Feature catalog pages under `skill-advisor/feature_catalog/` may still describe pre-014 bridge paths or pre-014 public MCP output shapes.
- Manual testing playbook scenarios under `skill-advisor/manual_testing_playbook/` may still validate old bridge commands or omit new public response fields.
- `references/` may be partially updated while sibling operator docs (setup/install/readme family) still carry stale shorthand.
- `mcp_server` libs and tests may have one-sided coverage, especially on the new `advisor_recommend` public output contract.
- Install guides and setup guides may have bridge-path drift after the move to `.opencode/plugin-helpers/`.
- Sibling 009 packet history and coordination-root research may contain the clue trail for missed docs/tests.
- Cross-runtime shared payload and coordination-root docs may have been updated already and should be ruled out as already-covered.
- Root instructions surfaces (`AGENTS.md`, setup guides, README family) may mention the skill-advisor tool surface without reflecting the 014 contract details.

## Iteration Plan

- Iter 1: semantic-style discovery attempt plus code-graph neighborhood expansion from known landed files; focus on `advisor_recommend` public contract drift.
- Iter 2: grep/glob cross-reference sweep for old bridge path, old OpenCode threshold hints, and bridge invocation examples across the repo.
- Iter 3: docs cross-reference pass through feature catalog, manual testing playbook, setup/install/readme family, and packet-adjacent docs for `advisor_validate` telemetry/threshold semantics drift.
- Iter 4: synthesis, deduplication, exclusion check against `resource-map.md` and packet task targets, then registry/synthesis write-up.
