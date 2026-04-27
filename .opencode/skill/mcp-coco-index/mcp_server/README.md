# CocoIndex MCP Server (Soft-Fork)

This folder bundles a soft-fork of [`cocoindex-code`](https://github.com/cocoindex-io/cocoindex-code) v0.2.3 with patches from the spec-kit project's 009 packet.

## Quick reference

| Field | Value |
|-------|-------|
| Upstream version forked | 0.2.3 |
| Current fork version | 0.2.3+spec-kit-fork.0.2.0 |
| License | Apache 2.0 (see [`cocoindex_code/LICENSE`](./cocoindex_code/LICENSE)) |
| Attribution | [`../NOTICE`](../NOTICE) |
| Changelog | [`../changelog/CHANGELOG.md`](../changelog/CHANGELOG.md) |
| Install | `bash ../scripts/install.sh` |
| Health check | `bash ../scripts/doctor.sh` |
| Manual reindex | `.venv/bin/ccc reset && .venv/bin/ccc index` |

## Layout

- `cocoindex_code/` - vendored Python source (15 files, soft-fork)
- `pyproject.toml` - package metadata for editable install
- `.venv/` - isolated venv created on `install.sh` (gitignored)

## Modifications

See [`../NOTICE`](../NOTICE) for the full list. As of `spec-kit-fork.0.2.0`:

- REQ-001: Excluded `.gemini/`, `.codex/`, `.claude/`, `.agents/` specs mirrors from indexing
- REQ-002: Added `source_realpath` + `content_hash` chunk fields
- REQ-003: Over-fetch + canonical-path dedup at query time
- REQ-004: `path_class` taxonomy (implementation/tests/docs/spec_research/generated/vendor)
- REQ-005: Bounded path-class reranking for implementation-intent queries
- REQ-006: `rankingSignals` telemetry per result row

The Rust-based upstream `cocoindex` package is NOT forked. It is pulled from PyPI as a dependency.
