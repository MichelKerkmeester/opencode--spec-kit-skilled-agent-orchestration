---
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
title: "Implementation Summary: CocoIndex over-fetch + dedup [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/implementation-summary]"
description: "004 packet patches landed in the vendored cocoindex-code fork as 0.2.3+spec-kit-fork.0.2.0 (this packet was tracked as 009 during research and in commit history; renumbered to 004 with the 011 phase carve-out); live daemon probes were blocked by Codex sandbox AF_UNIX/log permissions."
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
trigger_phrases:
  - "cocoindex dedup summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup"
    last_updated_at: "2026-04-27T11:15:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "REQ-001-006"
    next_safe_action: "Run live ccc index/search probes outside the Codex sandbox and commit the landed patch set"
    blockers:
      - "Codex sandbox blocks CocoIndex daemon log/socket startup, preventing live ccc index/search acceptance probes in-session"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "Where is CocoIndex source? Answer: ~/.local/pipx/venvs/cocoindex-code/lib/python3.11/site-packages/cocoindex_code"
      - "Vendor or fork CocoIndex source? Answer: vendored soft-fork under .opencode/skill/mcp-coco-index/mcp_server/cocoindex_code"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-cocoindex-overfetch-dedup |
| **Completed** | 2026-04-27 (code landed; live daemon probes blocked in Codex sandbox) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

LANDED in the vendored `cocoindex-code` soft-fork as version `0.2.3+spec-kit-fork.0.2.0`. The earlier Phase D vendor-vs-fork blocker is resolved by Phase 1 commit `3711ad221`, which moved the Python package source into `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/`.

The current patch set implements the full 009 fix, replacing the earlier settings-only mitigation:

- REQ-001: `.cocoindex_code/settings.yml` now excludes `.gemini/.codex/.claude/.agents/specs/**` mirror roots.
- REQ-002: chunk rows now store `source_realpath` and `content_hash`.
- REQ-003: query-time over-fetch uses `limit * 4`, dedups aliases by canonical identity, and carries `dedupedAliases` / `uniqueResultCount`.
- REQ-004: chunk rows now store `path_class` with the 007 §5 taxonomy.
- REQ-005: implementation-intent queries get bounded path-class reranking while preserving `raw_score`.
- REQ-006: each result carries `rankingSignals`.

The runtime passthrough layer (`protocol.py`, `daemon.py`, `server.py`, `cli.py`) was updated so the new query telemetry is visible through MCP and `ccc search` output.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.cocoindex_code/settings.yml` | LANDED | Excludes runtime spec mirror roots |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | LANDED | Adds canonical identity, content hash, and path class per chunk |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/query.py` | LANDED | Adds over-fetch, dedup, rerank, raw score, and ranking signals |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/schema.py` | LANDED | Extends chunk/result dataclasses with 009 fields |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | LANDED | Extends the actual CocoIndex table schema dataclass |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/{protocol.py,daemon.py,server.py,cli.py}` | LANDED | Passes result telemetry through daemon IPC, MCP, and CLI display |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered by patching the vendored soft-fork in place, bumping the fork version, reinstalling the editable package, and running code-level verification. The live daemon-backed `ccc index` and `ccc search` probes could not complete inside this Codex sandbox because daemon startup requires log/socket writes that are denied here.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Layered fix (settings → indexer → query) | Settings alone covers 80%; indexer + query handles the long tail. |
| Bounded boost/penalty (+0.05 / -0.05) | Avoid flipping rankings entirely; preserve raw score signal. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Source location identified | PASS | Vendored source at `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/` |
| Vendor-vs-fork decision | LANDED | Phase 1 soft-fork commit `3711ad221` |
| `ccc --version` | LANDED | `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc --version` -> `0.2.3+spec-kit-fork.0.2.0` |
| Reinstall editable fork | LANDED | `bash .opencode/skill/mcp-coco-index/scripts/install.sh` completed; dependency resolution used no-deps fallback because sandbox network is unavailable |
| `ccc reset` | LANDED | `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc reset --force` deleted `cocoindex.db` and `target_sqlite.db`, preserving settings |
| Reindex | BLOCKED in Codex sandbox | `ccc index` failed because daemon startup could not write/bind under sandbox: default dir -> `Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.log'`; workspace dir -> `AF_UNIX path too long`; temp dirs -> `Operation not permitted` on socket bind |
| pytest | BLOCKED | `.venv/bin/python -m pytest ...` failed: `No module named pytest` |
| Python syntax | PASS | `PYTHONPYCACHEPREFIX=/tmp/codex-pycache python3 -m py_compile ...` passed for patched Python files |
| Query dedup/rerank unit probe | PASS | Direct `_dedup_and_rank_rows` probe produced `dedupedAliases 1`, `uniqueResultCount 2`, implementation result above spec research with `implementation_boost` and `spec_research_penalty` |
| Protocol telemetry round-trip | PASS | `SearchResponse` msgpack round-trip preserved `dedupedAliases=2`, `uniqueResultCount=1`, and `rankingSignals=['implementation_boost']` |
| ccc search REQ-018 repro | BLOCKED in Codex sandbox | Probe file `/tmp/cocoindex-probe-1.txt`: `Error: Failed to connect to daemon: [Errno 1] Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.log'` |
| ccc search REQ-019 repro | BLOCKED in Codex sandbox | Probe file `/tmp/cocoindex-probe-2.txt`: `Error: Failed to connect to daemon: [Errno 1] Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.log'` |
| Settings-only partial mitigation | REPLACED by full fix | Config exclude landed plus canonical identity, query dedup, path-class rerank, and telemetry passthrough |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live acceptance remains environment-blocked in this Codex session.** The patch set is landed, but daemon-backed `ccc index` / `ccc search` could not run because the sandbox blocks the daemon's log/socket startup paths.
2. **Reindex still required outside the sandbox.** Schema migration means `ccc reset && ccc index` must be run in a normal shell before live query-side dedup/rerank evidence is available.
3. **Settings-only mitigation is no longer the current state.** It has been replaced by the full layered fix.
<!-- /ANCHOR:limitations -->
