# Review Findings: Wave 1, Agent A1

## Metadata
- Dimension: correctness
- Files Reviewed: 6
- Model: gpt-5.3-codex
- Effort: xhigh
- Wave: 1 of 5

## Findings

### [F-001] [P1] `/memory:save` tool ownership conflicts with canonical coverage matrix
- **File**: `.opencode/command/memory/save.md:4`
- **Evidence**: `allowed-tools` includes `spec_kit_memory_memory_save`, `spec_kit_memory_memory_index_scan`, `spec_kit_memory_memory_stats`, `spec_kit_memory_memory_update`; canonical mapping says `/memory:save` owns only `memory_save` (`README.txt:257,292`), while `memory_index_scan` is mapped to `/memory:manage` (`README.txt:281`).
- **Impact**: Command ownership is ambiguous; implementers may route maintenance/retrieval behavior through `/memory:save`, violating the documented command boundary.
- **Fix**: Either (a) remove non-`memory_save` MCP tools from `/memory:save` docs/allowed-tools, or (b) update README coverage matrix and ownership counts to explicitly mark shared/secondary ownership.
- **Claim Adjudication**:
  - Claim: `/memory:save` claims tool scope broader than canonical ownership.
  - Evidence Refs: `.opencode/command/memory/save.md:4`; `.opencode/command/memory/README.txt:257,281,292`
  - Counterevidence Sought: Checked whether README described ownership as non-exclusive/shared for `/memory:save`.
  - Alternative Explanation: These may be intentionally "borrowed helper tools," but that is not documented in the matrix.
  - Confidence: 0.96
  - Downgrade Trigger: If README is explicitly revised to mark primary vs secondary/shared tool usage.

---

### [F-002] [P1] `/memory:manage` includes `memory_search`, breaking 15-tool ownership contract
- **File**: `.opencode/command/memory/manage.md:4`
- **Evidence**: `allowed-tools` includes `spec_kit_memory_memory_search` (`manage.md:4`) and Appendix signatures include `spec_kit_memory_memory_search({...})` (`manage.md:866`), but canonical matrix assigns `memory_search` to `/memory:analyze` (`README.txt:255`) and states `/memory:manage` owns 15 tools (`README.txt:293`).
- **Impact**: Tool count and ownership are inconsistent across docs; implementers may incorrectly expose search under manage workflows.
- **Fix**: Remove `memory_search` from `/memory:manage` allowed/signature docs, or update README mapping/counts if ownership is intentionally expanded.
- **Claim Adjudication**:
  - Claim: `/memory:manage` documentation currently exceeds its documented owned-tool set.
  - Evidence Refs: `.opencode/command/memory/manage.md:4,866`; `.opencode/command/memory/README.txt:255,293`
  - Counterevidence Sought: Checked Appendix A enforcement matrix for a dedicated search mode (none listed).
  - Alternative Explanation: Search might be an internal helper not considered "owned," but docs do not distinguish helper vs owned tools.
  - Confidence: 0.95
  - Downgrade Trigger: If docs explicitly classify `memory_search` as helper-only and keep ownership counts primary-only.

---

### [F-003] [P2] Trigger-edit workflow in `save.md` lacks a concrete `memory_update` contract path
- **File**: `.opencode/command/memory/save.md:413`
- **Evidence**: UI advertises `[t] edit triggers` (`save.md:413-417,421-435`), and `allowed-tools` includes `spec_kit_memory_memory_update` (`save.md:4`), but Appendix tool signatures/parameter sections only document `memory_save` and `memory_index_scan` (`save.md:501-503,543-549,561-579`).
- **Impact**: Trigger editing is underspecified and may be implemented without a guaranteed persistence call.
- **Fix**: Add explicit `spec_kit_memory_memory_update({ id, triggerPhrases })` flow with parameter and error handling, or remove the trigger-edit action from completion UI.

---

### [F-004] [P2] `save.md` contains contradictory instructions about forbidden tools
- **File**: `.opencode/command/memory/save.md:308`
- **Evidence**: Step says "use Write tool or heredoc" (`save.md:308`), while Appendix hard block states `Write` and `Edit` are intentionally excluded (`save.md:482`).
- **Impact**: Conflicting guidance can cause policy-noncompliant execution paths.
- **Fix**: Remove "use Write tool" wording and keep a single compliant path (heredoc / `--json` / `--stdin`).

---

### [F-005] [P2] Stale validation claim for governance parameters in `save.md`
- **File**: `.opencode/command/memory/save.md:669`
- **Evidence**: Note claims not all governance params are validated in strict mode (`save.md:669`), but `memorySaveSchema` validates governance fields (`tool-input-schemas.ts:185-203`) and parameter allowlist includes them (`tool-input-schemas.ts:497-501`).
- **Impact**: Misstates runtime contract and can mislead implementers about accepted/rejected inputs.
- **Fix**: Update note to reflect current strict-schema validation behavior.

---

### [F-006] [P2] `analyze.md` mislabels manual search option number
- **File**: `.opencode/command/memory/analyze.md:874`
- **Evidence**: Quick search is "Option 2" (`analyze.md:796`), manual `memory_search` is "Option 3" (`analyze.md:807`), but text says manual search is "Option 2" (`analyze.md:874`).
- **Impact**: Operator confusion in advanced parameter usage.
- **Fix**: Change "Option 2 (manual search)" to "Option 3 (manual search)."

## Summary
- Total findings: 6
- Severity counts: P0=0, P1=2, P2=4
- Files reviewed: analyze.md, save.md, manage.md, tool-schemas.ts, tool-input-schemas.ts, README.txt
- newFindingsRatio: 0.86
