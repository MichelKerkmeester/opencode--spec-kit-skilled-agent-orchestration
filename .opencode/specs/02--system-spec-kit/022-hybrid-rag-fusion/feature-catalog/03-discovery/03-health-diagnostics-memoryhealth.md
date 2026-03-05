# Health diagnostics (memory_health)

## Current Reality

Two report modes. Full mode checks database connectivity, embedding model readiness, vector search availability, FTS5 index consistency and alias conflicts. The FTS5 check compares row counts between `memory_index` and `memory_fts` tables. If they diverge, something went wrong during indexing and the system suggests running `memory_index_scan` with `force: true` to rebuild. Alias conflict detection finds files that exist under both `specs/` and `.opencode/specs/` paths, which happens in projects with symlinks or path normalization issues.

The response reports overall status as "healthy" or "degraded" along with server version, uptime in seconds, embedding provider details (provider name, model, dimension) and the database file path. "Degraded" does not mean broken. It means something needs attention: a disconnected embedding provider, an FTS mismatch or unresolved alias conflicts.

The `divergent_aliases` report mode narrows the focus. It finds files that exist under both path variants with different content hashes. Same file, two locations, different content. That is a data integrity problem that requires manual triage. You can scope this check to a specific spec folder and paginate results up to 200 groups.

---

## Source Metadata

- Group: Discovery
- Source feature title: Health diagnostics (memory_health)
- Current reality source: feature_catalog.md
