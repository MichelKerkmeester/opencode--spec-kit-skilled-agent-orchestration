---
title: "M-003 -- Context Save + Index Update"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-003`."
audited_post_018: true
---

# M-003 -- Context Save + Index Update

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-003`.

---

## 2. SCENARIO CONTRACT

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix. Packet 026/010 added index-scope + tier invariants and a scan-originated save contract (`fromScan`); this scenario validates both.

- Prompt: `As a spec-doc record-quality validation operator, validate Context Save + Index Update against node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json specs/<target-spec>. Verify saved context artifacts are discoverable, no new candidate_changed false-positives fire on scan-originated saves, the permanent z_future/external exclusions still hold, and non-constitutional paths cannot persist as importanceTier: constitutional. Return a concise pass/fail verdict with the main reason and cited evidence.`

---

## 3. TEST EXECUTION

### Commands
- `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data-<session-id>.json specs/<target-spec>`
  - `memory_index_scan({ specFolder: "specs/<target-spec>" })`
- `node .opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-index-scope-violations.js --verify`

### Expected

- Saved context artifacts are discoverable via `memory_search` / `memory_context` after the scan
- `memory_index_scan` produces no `E_LINEAGE` errors on cross-file sibling docs (packet 001 — cross-file `UPDATE` / `REINFORCE` now downgrade to `CREATE` when `SimilarMemory.canonical_file_path` differs from the target)
- `memory_index_scan` produces no `candidate_changed` false-positives on scan-originated saves (packet 001 — scan saves carry `fromScan: true` and skip only the transactional complement recheck)
- Cleanup verify reports `constitutional_total=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0` (packet 002 invariant)
- No row appears in the indexed set for paths under `z_future/` or `/external/` (packet 002 permanent exclusions)
- The constitutional `README.md` stays excluded from the spec-doc record index (ADR-005)

### Evidence

- Save output + index output
- `memory_search` / `memory_context` results for the saved artifact
- Stdout of `cleanup-index-scope-violations.js --verify` matching the four expected counts
- For tier-invariant spot-check: attempt a `memory_save` of a non-constitutional-path memory with `importanceTier: "constitutional"` and confirm it lands as `important` with a `tier_downgrade_non_constitutional_path` row in the governance audit

### Pass/Fail

- **Pass**: context appears in retrieval post-index, cleanup verify counts match, no scan-originated regressions fire, and the tier-invariant spot-check downgrades as documented
- **Fail**: any scan-originated `E_LINEAGE` / `candidate_changed` false-positive recurs, cleanup verify counts deviate (especially `z_future_rows != 0` or `external_rows != 0`), or a non-constitutional path persists as `constitutional`

### Failure Triage

- Discoverability fails → rerun save, inspect path/permissions, confirm `memory_index_scan` ran against the correct `specFolder`
- Scan-originated regression fires → confirm the dist build is current (`scripts/dist/memory/cleanup-index-scope-violations.js` exists and matches source) and that MCP clients were restarted after the last build; check `mcp_server/handlers/save/pe-orchestration.ts` + `handlers/memory-save.ts` for the `canonical_file_path` and `fromScan` wiring
- Invariant counts deviate → run `cleanup-index-scope-violations.js --apply` and re-verify; if non-zero counts persist, inspect `mcp_server/lib/utils/index-scope.ts` for drift from the shared policy

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [02--mutation/01-memory-indexing-memorysave.md](../../feature_catalog/02--mutation/01-memory-indexing-memorysave.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: M-003
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/003-context-save-index-update.md`
