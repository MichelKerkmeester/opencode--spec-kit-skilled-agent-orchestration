# CocoIndex MCP Server (Soft-Fork)

> Vendored Python source for the CocoIndex Code daemon and CLI, soft-forked from upstream and patched with the spec-kit 009 packet.

---

## 1. OVERVIEW

This folder bundles a soft-fork of [`cocoindex-code`](https://github.com/cocoindex-io/cocoindex-code) v0.2.3 with patches from the spec-kit 009 packet. The vendored source ships in `cocoindex_code/` and installs as an editable Python package via `pyproject.toml`. The Rust-based upstream `cocoindex` runtime stays on PyPI as a regular dependency.

### Key Reference

| Field | Value |
|-------|-------|
| Upstream version forked | 0.2.3 |
| Current fork version | `0.2.3+spec-kit-fork.0.2.0` |
| License | Apache 2.0 (see [`cocoindex_code/LICENSE`](./cocoindex_code/LICENSE)) |
| Attribution | [`../NOTICE`](../NOTICE) |
| Changelog | [`../changelog/CHANGELOG.md`](../changelog/CHANGELOG.md) |
| Install | `bash ../scripts/install.sh` |
| Health check | `bash ../scripts/doctor.sh` |
| Manual reindex | `.venv/bin/ccc reset && .venv/bin/ccc index` |

### Modifications

The full list lives in [`../NOTICE`](../NOTICE). As of `spec-kit-fork.0.2.0` the vendored source carries:

- REQ-001: excludes `.gemini/`, `.codex/`, `.claude/`, and `.agents/` spec mirrors from indexing.
- REQ-002: adds `source_realpath` and `content_hash` chunk fields.
- REQ-003: query-time over-fetch with canonical-path dedup.
- REQ-004: `path_class` taxonomy (`implementation`, `tests`, `docs`, `spec_research`, `generated`, `vendor`).
- REQ-005: bounded path-class reranking for implementation-intent queries.
- REQ-006: `rankingSignals` telemetry per result row.

---

## 2. STRUCTURE

```
mcp_server/
├── cocoindex_code/        # Vendored Python source (15 files, soft-fork)
│   ├── LICENSE            # Apache 2.0 (preserved with package)
│   ├── _version.py        # Fork version string
│   ├── indexer.py         # Patched: REQ-002 + REQ-004
│   ├── query.py           # Patched: REQ-003 + REQ-005 + REQ-006
│   ├── schema.py          # Patched: REQ-002 + REQ-004 fields
│   └── ...                # Unmodified upstream files
├── pyproject.toml         # Package metadata for editable install
├── MAINTENANCE.md         # Upstream sync workflow
├── README.md              # This file
└── .venv/                 # Isolated venv created by install.sh (gitignored)
```

### Key Files

| File | Purpose |
|------|---------|
| `pyproject.toml` | Package metadata, fork version pin, `ccc` console script entry |
| `cocoindex_code/_version.py` | Fork version string read by `ccc --version` |
| `cocoindex_code/indexer.py` | Document scanning and chunk storage with patched fields |
| `cocoindex_code/query.py` | Query path with patched dedup, reranking, and telemetry |
| `cocoindex_code/schema.py` | Result and chunk dataclasses with patched fields |
| `MAINTENANCE.md` | Step-by-step upstream sync workflow |

---

## 3. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [`../NOTICE`](../NOTICE) | Apache 2.0 attribution and modification log |
| [`../changelog/CHANGELOG.md`](../changelog/CHANGELOG.md) | Per-version change history |
| [`./MAINTENANCE.md`](./MAINTENANCE.md) | Upstream sync workflow |
| [`../INSTALL_GUIDE.md`](../INSTALL_GUIDE.md) | End-to-end install instructions |
| [`../SKILL.md`](../SKILL.md) | Parent skill documentation |
| [Upstream repo](https://github.com/cocoindex-io/cocoindex-code) | Source project on GitHub |
