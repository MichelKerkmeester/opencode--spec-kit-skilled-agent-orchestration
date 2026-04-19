# Iteration 007 - X7 Migration Semantics

## Focus

Define the migration contract for mid-session skill changes: how prompt-hook caches stay correct when a skill is added, removed, renamed, or metadata changes while the advisor process is still alive. The required outcome is a contract that preserves wave-1 source-signature invalidation, adds explicit per-skill invalidation, and degrades safely when a cached brief points at a deleted skill.

## Inputs Read

- Packet prompt and state:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/prompts/iteration-7.md`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/deep-research-state.jsonl`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-extended-copilot/deep-research-strategy.md`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md`
- Live advisor/runtime sources:
  - `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py`
  - `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
  - `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`

## Existing Contract We Must Preserve

Wave 1 already fixed the top-level rule: cache reuse is valid only while the advisor's source inventory is unchanged, and any prompt-hook failure must fail open instead of forcing stale model-visible guidance. X7 therefore is not a new caching regime; it is the migration-tightening layer for skill inventory churn. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md:60-78] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research/research.md:183-231]

## Current Runtime Facts

### 1. Live SKILL discovery already invalidates on `(path, mtime_ns, size)`

The current runtime cache discovers `*/SKILL.md`, computes a signature tuple of `(path, st_mtime_ns, st_size)`, and rebuilds the in-memory skill-record cache whenever that tuple changes. That means add/remove/rename/content edits already invalidate the discovery cache without needing a separate watch service. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:153-169] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:231-269]

Important consequence: a folder rename or file move changes the `path` element even if content is identical, so a renamed skill is not equivalent to a metadata-only edit under the current signature model. It is seen as inventory churn.

### 2. Graph loading is process-cached after first load

The compiled graph path is different. `_load_skill_graph()` returns `_SKILL_GRAPH` immediately once populated, and there is no hot-path freshness check before reuse. SQLite is preferred, JSON is a fallback, and missing artifacts may trigger one JSON auto-compile, but none of those branches revalidate a previously cached graph against later source changes. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:431-475]

This creates the exact migration split X7 must close:

1. Discovery records are refreshed from live `SKILL.md` files.
2. Graph boosts/signals may remain from an older process snapshot.
3. Health can report drift, but prompt-time reuse can still be ahead of or behind that health state unless the hook checks freshness before emitting cached briefs.

### 3. Health already exposes the right drift signal

The health surface already compares live discovered skill names against the compiled-graph inventory and marks the advisor `degraded` when the two disagree. The parity payload names the specific `missing_in_graph` and `missing_in_discovery` skill IDs. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:291-320] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:2632-2713]

That means X7 does not need a brand-new migration detector. The missing piece is to make cache reuse obey the same drift boundary that `health_check()` already exposes.

### 4. Rename semantics are already "remove old ID, add new ID"

The compiler requires `graph-metadata.json.skill_id` to match the skill folder name. A folder rename therefore changes the compiled graph identity, not just a label. On the discovery side, the parsed runtime record key comes from the `name` field in `SKILL.md`, so a rename can also change the recommendation ID even when description text stays the same. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:115-119] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:176-205]

The safe interpretation is strict: renamed skills are migration events, never alias-preserving no-ops.

### 5. "importance_tier changed, same skill name" is freshness-relevant but not routing-relevant today

The runtime skill-record cache reads only `name`, `description`, and `keywords` from `SKILL.md`. The source metadata loader reads `intent_signals`, derived `trigger_phrases`, and conflict declarations from `graph-metadata.json`. No checked-in skill-advisor hot-path uses `importance_tier` for scoring or thresholding today. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:180-203] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:178-217] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:220-260]

So a same-name `importance_tier` edit should still invalidate freshness for audit correctness, but it does not need special user-visible renderer behavior unless the renderer later chooses to surface that metadata.

## X7 Migration Contract

### A. Cache layers

| Cache layer | Authority | Reuse rule |
| --- | --- | --- |
| Source inventory cache | Full discovered `SKILL.md` signature tuple `(path, mtime_ns, size)` plus graph-artifact fingerprint | Reuse only when the full source signature is unchanged. Any add/remove/rename/mtime/size change invalidates globally. |
| Exact prompt-result cache | Canonical prompt key + source signature + runtime/policy config + referenced skill fingerprints | Reuse only when the source signature matches **and** every referenced skill fingerprint still matches live disk state. |
| Graph snapshot cache | SQLite/JSON graph fingerprint + inventory parity result | Reuse only when the graph fingerprint still matches the source signature contract; otherwise degrade or recompute before applying graph boosts. |

### B. Per-skill invalidation

Wave-1 global source-signature invalidation remains the first gate, but X7 adds a stricter second gate:

> Every cached brief must persist `referencedSkills[]` with per-skill fingerprints `(skillId, skillPath, mtime_ns, size)`. Before reusing that brief, the hook must restat those files. Any missing file or fingerprint mismatch invalidates the brief immediately, even if a coarse TTL or previously cached session object still exists.

This closes the "same session, one skill edited" case without relying on whole-process restarts.

### C. Deleted-skill graceful degradation

When a cached brief references a skill that no longer exists:

1. Treat the cached brief as invalid before render.
2. Attempt one fresh `analyze_request()` against the live discovery inventory.
3. If a new threshold-passing recommendation exists, emit the refreshed brief.
4. If the refresh yields no passing recommendation, emit **no** model-visible advisor brief.
5. If refresh itself errors or times out, fail open with `brief: null`.

The important rule is negative: a deleted skill must never survive as a stale rendered name merely because the cache entry still exists.

### D. Rename contract

Rename = remove old skill + add new skill.

That applies even if the body text is identical. Because the current discovery signature includes `path`, and the compiled graph requires `skill_id == folder name`, rename changes both the source inventory identity and the compiled-graph identity. A cached brief referencing the old skill ID must therefore be invalidated, not silently remapped. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:159-169] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:115-119]

### E. Same-name metadata change contract

For metadata changes where the skill name remains stable:

1. Refresh is still required, because the source artifact changed.
2. If the changed fields affect routing inputs (`description`, `keywords`, `intent_signals`, `derived.trigger_phrases`, conflicts), recompute normally and let the result change.
3. If the changed fields do **not** affect routing inputs (for example `importance_tier`), the recomputed result may legitimately render the same brief text.
4. Even when the brief text is unchanged, the cache record must be replaced with the new fingerprint and generation timestamp.

This keeps correctness and auditability without pretending every metadata edit must create a different recommendation.

## Normalized Migration Matrix

| Change | Detection | Prompt-hook behavior | User-visible result |
| --- | --- | --- | --- |
| Skill added | Global source signature changes; inventory may temporarily lead graph | Invalidate all exact brief cache entries; recompute | Either a new best skill appears or no brief change, but never reuse old cache blindly |
| Skill removed | Missing referenced file or `missing_in_graph` / `missing_in_discovery` drift | Invalidate cached brief; recompute once; suppress on no-pass | No stale deleted skill name survives |
| Skill renamed | Path fingerprint changes and/or skill ID changes | Treat as delete + add; invalidate old-skill cache entries | Old label disappears immediately; new label only appears after recompute |
| Same-name routing metadata changed | Per-skill fingerprint mismatch | Recompute | Brief may change |
| Same-name non-routing metadata changed (`importance_tier`) | Per-skill fingerprint mismatch | Recompute and replace cache record | Brief may stay text-identical, but freshness/generation updates |

## Determination

**X7 is answered.** The existing repo already contains the primitives needed for a migration-safe contract:

1. Live source-signature invalidation for `SKILL.md` discovery.
2. Health-level inventory parity detection for discovery-vs-graph drift.
3. A clear distinction between routing-relevant metadata and non-routing metadata.
4. A strict identity model where renames are true migration events.

The missing behavior is prompt-hook enforcement: cached brief reuse must validate both the global source signature and the per-skill fingerprints it references, and it must suppress deleted/renamed skills rather than rendering stale aliases.

## Ruled Out

### 1. Silent aliasing from deleted or renamed skill IDs to new ones

Ruled out because the runtime identity model is strict and path-based, not semantic-alias-based. A renamed skill may share content, but it is still a different source identity, and silently preserving the old label would make the prompt-time brief disagree with both discovery and health. [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:159-169] [SOURCE: file:.opencode/skill/skill-advisor/scripts/skill_advisor.py:2660-2703]

## Decisions

- **Bind exact brief reuse to both global and per-skill fingerprints.**
- **Treat rename as delete-plus-add, never as automatic alias migration.**
- **Suppress deleted-skill briefs instead of rendering stale names.**
- **Allow metadata-only same-name edits to keep identical brief text after recompute, but always refresh the cache record and freshness timestamp.**

## Question Status

- **X7 answered**: packet 026 now has a concrete migration contract for skill add/remove/rename/same-name metadata edits under a long-lived advisor process.

## Next Focus

Iteration 8 should move to X8 and determine how two concurrent sessions in the same workspace should coordinate source signatures, graph fingerprints, and exact prompt-result caches without cross-session stale-brief leakage.
