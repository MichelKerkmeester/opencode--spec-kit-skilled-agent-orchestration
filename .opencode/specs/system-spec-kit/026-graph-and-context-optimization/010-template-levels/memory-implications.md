---
title: "Memory + Causal Graph Implications of the Template Greenfield Refactor"
description: "How the 010-template-levels refactor affects MCP memory indexing, the causal graph, code-graph, validator hot path, and what to do about it post-deploy."
trigger_phrases:
  - "memory implications"
  - "indexing impact"
  - "causal graph after refactor"
  - "010 memory implications"
  - "post-deploy memory checklist"
---

# Memory + Causal Graph Implications

> Companion doc to `before-after-template-system.md`. The before/after explainer covers what changed for the template system itself; this doc covers what changed for the memory + indexing pipeline that consumes spec doc output.

---

## 1. Headline

**No memory content changes.** The refactor preserved every surface the MCP memory system reads from. Existing 868 spec folders index identically to before. The memory database schema is unchanged. The causal graph schema is unchanged.

What did change is the pipeline: stricter parser diagnostics, ~50× faster validation hot path, new safety lock for concurrent saves, and a small backlog of new TS modules the code graph hasn't indexed yet.

---

## 2. The 5 Surfaces Memory Reads From

Every spec doc passes through validators and indexers that look for these specific surfaces. The refactor preserved all of them on purpose.

| Surface | Used by | Refactor impact |
|---------|---------|-----------------|
| `<!-- ANCHOR:foo -->` ... `<!-- /ANCHOR:foo -->` | Section-level retrieval (`memory_context` with anchor scope), section-presence validators | Preserved byte-for-byte by `inline-gate-renderer.ts`. Whitespace inside anchors is preserved; anchors that fall inside a stripped IF-block are removed cleanly along with their content. Tested by `scaffold-golden-snapshots.vitest.ts`. |
| `_memory.continuity` block in YAML frontmatter | Resume / handover / continuity recovery (`/spec_kit:resume`, `session_resume`, `memory_save`) | Schema unchanged: `packet_pointer`, `last_updated_at`, `last_updated_by`, `recent_action`, `next_safe_action`, `blockers[]`, `key_files[]`, `session_dedup.{fingerprint, session_id, parent_session_id}`, `completion_pct`, `open_questions[]`, `answered_questions[]`. Parser hardened (see §3). |
| `<!-- SPECKIT_TEMPLATE_SOURCE: <doc> \| v2.2 -->` | Template provenance + staleness detection (`check-template-source.sh`, `check-template-staleness.sh`) | Same marker format, same regex, same `head -n 20` location requirement. Version source-of-truth now centralized in `spec-kit-docs.json.versions[]` per ADR-004 of packet 004. Old `v2.1` markers remain readable indefinitely per ADR-005's MIGRATION.md. |
| `<!-- SPECKIT_LEVEL: N -->` | Level-aware retrieval, section-count expectations (`check-level.sh`, `check-level-match.sh`, `check-section-counts.sh`) | Unchanged marker, position, and parser regex. |
| `description.json` + `graph-metadata.json` | Description-discovery search, causal graph edges, packet identity normalization | Schema unchanged. `description.json` keeps `level`, `specFolder`, `keywords[]`, `lastUpdated`, `parentChain[]`, `memorySequence`, `memoryNameHistory[]`. `graph-metadata.json` keeps `children_ids[]`, `parent_id`, `depends_on[]`, `enhances[]`, `prerequisite_for[]`, `conflicts_with[]`, `siblings[]`, `derived.{last_active_child_id, last_save_at, last_accessed_at, status}`. |

If you've built tooling that reads any of these, it keeps working.

---

## 3. Parser Hardening — Stricter, Louder, Backward-Compatible

The 003+004 packets tightened `mcp_server/lib/validation/spec-doc-structure.ts` in four ways. Each one was previously a silent failure mode that's now a surfaced finding.

### 3.1 Leading HTML comment + frontmatter
**Before:** packets that started with `<!-- some comment -->` followed by `---` were silently treated as having no frontmatter. The `_memory.continuity` block would never get parsed for those packets. Memory queries would return empty for them.
**After:** the parser tolerates leading HTML comments before `---` and parses frontmatter normally.
**Backward compat:** if you have legacy packets that depended on the old "no frontmatter" interpretation (unlikely, but possible), they now expose continuity blocks they previously hid.

### 3.2 Malformed `_memory:` YAML
**Before:** if `_memory:` block had broken YAML (unbalanced brackets in `recent_action`, multi-line values without proper indentation, embedded markdown that confused the parser), the parser silently defaulted to empty. No diagnostic, no warning. The packet looked like it had no continuity.
**After:** broken `_memory:` YAML emits a `MEMORY_BLOCK_INVALID` finding with the underlying error message. You can fix the source instead of debugging silent indexing gaps.

### 3.3 `session_dedup.fingerprint` shape check
**Before:** any string accepted. Garbage values (e.g., `sha256:abc`, `not-a-hash`, `null`) would index without warning.
**After:** validated against `^sha256:[0-9a-f]{64}$`. The literal scaffold placeholder `sha256:0000...0000` is allowlisted (so freshly-scaffolded packets pass). Real fingerprints with the right shape pass. Garbage emits `SPECDOC_FRONTMATTER_005` finding.

### 3.4 `parent_session_id` lineage check (lenient)
**Before:** field stored verbatim, never verified to point at a real session. Orphan references silently accumulated.
**After:** if `parent_session_id` references a session_id that doesn't appear in any other packet, the parser emits `SESSION_LINEAGE_BROKEN` warning per ADR-002 of packet 004. **Lenient** — warning, not error, because legacy packets predate strict lineage tracking.

### Net effect for you
The next time you run `memory_health` or scan an existing 868 packet, you may see new warnings on packets that had subtly malformed frontmatter that previously parsed silently as empty. **They surface as findings, not breakages.** The validator's exit code is unaffected (warnings don't fail strict validation; only `Errors:` does).

---

## 4. Validation Hot Path — ~50× Faster

The validation orchestrator (`mcp_server/lib/validation/orchestrator.ts`) introduced in packet 004 replaced per-rule Node process launches with a single Node process per folder.

### Before
```
validate.sh <packet> --strict
  → for each of ~20 rules:
      spawn Node process to run TypeScript rule
      Node startup: ~80ms × 20 rules = 1.6s overhead alone
  → total: ~5 seconds per Level 3 packet
```

### After
```
validate.sh <packet> --strict
  → spawn ONE Node process
  → load validator-registry.json once
  → run all 20 rules in same process, sharing parser cache
  → total: ~108ms per Level 3 packet (~50× faster)
```

### Implications for memory tooling

| Tool | Was | Now |
|------|-----|-----|
| `memory_validate` (single packet) | ~5s | ~108ms |
| `memory_health` (full sweep) | several minutes for 50 packets | ~5-10 seconds |
| `task_postflight` (which validates before completion) | dominated by Node startup | sub-200ms |
| `memory_save` (validates before indexing) | bottleneck | bottleneck removed |

If your workflow includes "scan all packets nightly and report drift", that workflow goes from a long-running cron job to a one-shot script you can run inline.

---

## 5. Save Lock — Race Safety for Concurrent `/memory:save`

Per ADR-003 of packet 004, `generate-context.js` now acquires an advisory lock before writing `description.json` + `graph-metadata.json`.

### Mechanics
```
generate-context.js <packet>
  → mkdir <packet>/.canonical-save.lock
  → if mkdir succeeds: hold lock, write atomically, rmdir on exit
  → if mkdir fails: 
      check stale-lock (>30s old) → force-cleanup with warning
      otherwise: retry with backoff up to N times → fail loudly
```

### Why it matters
**Before:** two parallel `/memory:save` calls for the same packet (e.g., user runs save while a background agent's task_postflight also saves) could interleave writes. The packet's `description.json` could end up with one save's `lastUpdated` field and another save's `keywords[]` field — visible inconsistency.
**After:** the second caller waits politely. Both saves complete; neither corrupts the file.

### Implications
- If you script parallel `/memory:save` invocations across many packets, they now serialize per-packet (not per-fleet — different packets still save concurrently).
- If a save process crashes mid-write, `.canonical-save.lock` directory may persist. Next save detects it as stale (>30s) and force-cleans with a warning. No manual cleanup needed.
- The lock is per-PACKET, not per-process or per-PID. Cross-process safety on the same machine is solid; cross-machine on a shared filesystem (NFS, sshfs) inherits whatever atomicity guarantees `mkdir` provides on that filesystem.

---

## 6. Causal Graph — Auto-Picks Up the New Children

The causal graph reads `graph-metadata.json` lazily on each `code_graph_query` / `memory_context` / `code_graph_context` call. **No graph rebuild required.**

### What's automatically picked up

The 010 phase parent's `graph-metadata.json` was updated by each child packet's Phase E to register itself:

```json
"children_ids": [
  "system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation",
  "system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign",
  "system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl",
  "system-spec-kit/026-graph-and-context-optimization/010-template-levels/004-deferred-followups",
  "system-spec-kit/026-graph-and-context-optimization/010-template-levels/005-skill-references-assets-alignment",
  "system-spec-kit/026-graph-and-context-optimization/010-template-levels/006-command-md-yaml-alignment"
],
"derived": {
  "last_active_child_id": "system-spec-kit/.../006-command-md-yaml-alignment"
}
```

The graph traversal uses these fields directly. Queries like "what are the children of 010" return the full set immediately.

### What's NOT in the graph yet

The cross-packet `depends_on[]` / `enhances[]` / `prerequisite_for[]` edges between siblings are NOT explicitly populated for these 6 packets. The graph only knows the parent-child relationship. If you want explicit "004 depends on 003" edges in the graph, run:

```typescript
mcp__spec_kit_memory__memory_causal_link({
  source: "system-spec-kit/.../010-template-levels/004-deferred-followups",
  target: "system-spec-kit/.../010-template-levels/003-template-greenfield-impl",
  type: "depends_on"
})
```

This is optional — most callers traverse via the parent's `children_ids` array.

### To force immediate indexing for memory MCP visibility

```typescript
mcp__spec_kit_memory__memory_index_scan({
  specFolder: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels"
})
```

This walks the subtree, indexes new + modified packets into the SQLite continuity DB, refreshes embeddings, and emits scan stats. Runs in seconds for the 010 subtree.

---

## 7. Code Graph — Needs One Re-Scan for New TS Modules

The code graph (separate from the causal graph) indexes source files. It doesn't know about the new code yet.

### New TypeScript modules to index

```
.opencode/skill/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts
.opencode/skill/system-spec-kit/mcp_server/lib/validation/orchestrator.ts
.opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.ts
```

### Deletions to clean from the index

```
.opencode/skill/system-spec-kit/scripts/templates/compose.sh
.opencode/skill/system-spec-kit/scripts/templates/wrap-all-templates.{ts,sh}
... and 50+ template files under templates/level_N/, core/, addendum/, phase_parent/
```

### Action

```typescript
mcp__spec_kit_memory__code_graph_scan({ scope: "incremental" })
```

Or check status first to see drift:
```typescript
mcp__spec_kit_memory__code_graph_status({})
```

If `staleEntries > 50` or `missedFiles > 5`, run a full rescan:
```typescript
mcp__spec_kit_memory__code_graph_scan({ scope: "full" })
```

CocoIndex semantic search (`mcp__cocoindex_code__search`) maintains its own embeddings index. To refresh after a major code shape change:
```typescript
mcp__spec_kit_memory__ccc_reindex({})
```

---

## 8. SQLite Schema — Zero Changes

The continuity database (`mcp_server/data/spec-kit-memory.db`) tables are unchanged:

| Table | Purpose | Schema impact |
|-------|---------|---------------|
| `continuity_snapshots` | Per-packet `_memory.continuity` block snapshots | Unchanged |
| `description_index` | Description.json discovery search | Unchanged |
| `graph_edges` | Causal graph adjacency list | Unchanged |
| `session_dedup` | Cross-session deduplication via fingerprint | Unchanged |
| `trigger_phrase_lookup` | Trigger-phrase to packet mapping | Unchanged |
| `embedding_index` | Vector embeddings for semantic retrieval | Unchanged shape; new packets get rows on next index scan |

No migration needed. No `ALTER TABLE`. The new packets' rows insert into existing tables with existing columns.

---

## 9. Trigger Phrase Surface

Trigger phrases in YAML frontmatter (`trigger_phrases: [...]`) drive the `memory_match_triggers` lookup. The mechanism is unchanged.

### What's the same
- Templates still expose a `trigger_phrases:` array placeholder for authors to fill in.
- The `memory_match_triggers` tool still maps incoming user prose to packet IDs by intersecting with stored trigger phrases.
- Constitutional rules (always-surface entries from `memory:learn`) still take priority over packet-specific triggers.

### What's slightly different
- The 6 new packets in 010 (003 through 006) authored their own trigger phrase sets per-packet. They'll surface on triggers like "template impl checklist", "012 outcome", "deferred followups", "command yaml alignment", "manifest internals", etc.
- Round-3's resolver hardening (packet 003) ensures error messages from the resolver no longer leak `manifest`/`kind`/`preset` into stderr, so trigger-phrase lookups based on stderr capture (rare) won't see banned vocab from the resolver.

---

## 10. Concrete Post-Deploy Checklist

Run these in order. Each is fast (seconds, not minutes).

### A. Index the 010 subtree

```typescript
mcp__spec_kit_memory__memory_index_scan({
  specFolder: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels"
})
```

Expected: scan completes in <10s; 6 new/updated packet rows indexed.

### B. Refresh code-graph

```typescript
mcp__spec_kit_memory__code_graph_scan({ scope: "incremental" })
```

Expected: 3 new TS files indexed; 50+ deleted entries cleaned. Reports `addedNodes`, `removedNodes`, `updatedNodes` counts.

### C. Optional: refresh CocoIndex semantic embeddings

```typescript
mcp__spec_kit_memory__ccc_reindex({})
```

Expected: re-embed changed files; runs in 30-60s depending on corpus size.

### D. Health check (surfaces any new MEMORY_BLOCK_INVALID / SESSION_LINEAGE_BROKEN findings on legacy packets)

```typescript
mcp__spec_kit_memory__memory_health({})
```

Expected:
- `validation.passed`: 868+ packets clean (or matches your pre-refactor baseline)
- `validation.warnings`: a small number of new `MEMORY_BLOCK_INVALID` / `SESSION_LINEAGE_BROKEN` warnings on legacy packets that had subtly malformed frontmatter
- `validation.errors`: should be 0 (or match pre-refactor baseline)

If `validation.errors` rises, that's a real regression — file as a separate packet.

### E. Verify causal graph picks up 010's new children

```typescript
mcp__spec_kit_memory__code_graph_query({
  query: "010-template-levels children",
  limit: 10
})
```

Expected: returns the 6 child packets with parent-child edges intact.

### F. Spot-check a new packet's continuity surfaces correctly

```typescript
mcp__spec_kit_memory__memory_context({
  input: "template impl checklist",
  mode: "focused",
  includeContent: true
})
```

Expected: 003-template-greenfield-impl's checklist.md surfaces with its `_memory.continuity` block intact.

---

## 11. What You Do NOT Need To Do

| Thing | Why not |
|-------|---------|
| Re-index the 868 existing spec folders | Their content didn't change. Only the 6 new packets in 010 + the system-spec-kit production code changed. |
| Migrate any frontmatter | Old `v2.1` markers stay readable indefinitely per ADR-005's MIGRATION.md policy. |
| Update the SQLite schema | Zero schema changes. |
| Rebuild the causal graph from scratch | Incremental traversal works; the new `children_ids` array is read lazily. |
| Backfill `parent_session_id` for legacy packets | The new lineage check is lenient (warning, not error). Legacy packets continue to validate. |
| Migrate the trigger phrase database | Unchanged shape; only the 6 new packets add rows. |

---

## 12. If Something Breaks

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| `memory_index_scan` reports new errors on a legacy packet | Stricter parser surfaced previously-silent malformed frontmatter | Read the finding code (`MEMORY_BLOCK_INVALID`, `SPECDOC_FRONTMATTER_005`, `SESSION_LINEAGE_BROKEN`); fix the source `_memory:` block in the offending packet |
| `code_graph_status` shows high `staleEntries` | Old TS module paths still in the index post-deletion | Run `code_graph_scan({ scope: "full" })` once |
| `memory_save` for the same packet fails with lock contention | Two parallel saves racing | Wait 30s; the stale-lock cleanup will recover. If recurring, investigate the caller |
| Trigger phrase lookup returns nothing for a known new packet | Index hasn't picked up the packet yet | Run `memory_index_scan` scoped to the packet's parent |
| Resume on a 010 child returns to the wrong sibling | `derived.last_active_child_id` not set | Run `/memory:save` from the desired sibling — sets the pointer |

---

## 13. Related

- `before-after-template-system.md` — what changed in the template system itself
- `004-deferred-followups/decision-record.md` — ADR-001 (validation orchestrator), ADR-002 (parent_session_id semantics), ADR-003 (exit codes), ADR-004 (version field), ADR-005 (migration policy)
- `templates/manifest/MIGRATION.md` — legacy marker compatibility for old packets
- `templates/manifest/EXTENSION_GUIDE.md` — how new doc types extend the manifest
