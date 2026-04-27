# Changelog

All notable changes to the bundled cocoindex-code fork in this skill are documented here.

This fork uses PEP 440 local version identifiers: `<upstream-version>+spec-kit-fork.<major>.<minor>`.

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
