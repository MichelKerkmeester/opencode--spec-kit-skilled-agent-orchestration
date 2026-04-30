# Changelog

All notable changes to the bundled cocoindex-code fork in this skill are documented here.

This fork uses PEP 440 local version identifiers: `<upstream-version>+spec-kit-fork.<major>.<minor>`.

---

## 0.2.3+spec-kit-fork.0.2.0 — 2026-04-27

**Apply 009 packet — mirror dedup + path-class reranking**

### Added
- `source_realpath` + `content_hash` chunk fields (REQ-002)
- `path_class` chunk field with implementation/tests/docs/spec_research/generated/vendor taxonomy (REQ-004)
- Query-time over-fetch (`limit * 4`) + canonical-path dedup; results carry `dedupedAliases` + `uniqueResultCount` (REQ-003)
- Bounded path-class reranking for implementation-intent queries (+0.05 implementation, -0.05 docs/spec_research) (REQ-005)
- `rankingSignals` telemetry per result row (REQ-006)
- Settings exclude rules for `.gemini/.codex/.claude/.agents/specs/**` mirror paths (REQ-001)

### Changed
- Version bumped from `0.2.3+spec-kit-fork.0.1.0` → `0.2.3+spec-kit-fork.0.2.0`
- Modified-file headers added to `indexer.py`, `query.py`, `schema.py`

### Notes
- A reindex (`ccc reset && ccc index`) is required for new schema fields to populate on existing chunks.
- Backward compatible: missing `source_realpath` falls back to `content_hash` for dedup grouping.

---

## 0.2.3+spec-kit-fork.0.1.0 — 2026-04-27

**Fork inception — vendored upstream cocoindex-code source**

### Added
- Vendored cocoindex-code v0.2.3 source into `mcp_server/cocoindex_code/` (15 Python files, Apache 2.0)
- `LICENSE` + `NOTICE` files at skill root for Apache 2.0 attribution
- `mcp_server/pyproject.toml` so the vendored package is editable-installable via `pip install -e ./mcp_server`
- Local-version identifier `+spec-kit-fork.0.1.0` per PEP 440 to keep fork builds distinguishable from upstream

### Changed
- `scripts/install.sh`: installs from local source instead of PyPI
- `scripts/doctor.sh`: warns if `ccc --version` does not include `spec-kit-fork.`

### Notes
- Zero behavior change vs upstream 0.2.3. Phase 2 (009 packet patches) lands as `0.2.3+spec-kit-fork.0.2.0`.
- The Rust-based upstream `cocoindex` package is NOT forked. Still pulled from PyPI as a dependency.
