## [v0.11.0] - 2026-04-02

This phase now records two layers of work: the parent stabilization pass that repaired indexing and adaptive-fusion drift after the repository move, and the nested `001` through `009` child phases that expanded adaptive feedback, retrieval behavior, graph search, and supporting tooling. The parent wrapper still leaves fresh restart and final validator evidence open, but the underlying child phases carry substantial completed implementation and verification work that the earlier changelog did not reflect.

> Spec folder: `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion` (Level 1 parent with nested child phases)

---

## Indexing and Runtime Stabilization (5)

### CocoIndex Code was still pointed at stale repository state

**Problem:** Semantic code search was tied to an older repository location and stale local index artifacts after the workspace move.

**Fix:** The parent phase rebuilt the CocoIndex environment against the active repository and tightened exclusions so code search skips packet and changelog noise.

### BM25 memory search needed a clean rebuild

**Problem:** Exact-word memory search was only as reliable as the memory index it was reading, and that index had drifted with the workspace move and earlier repairs.

**Fix:** The phase reran memory indexing against the live corpus so exact-word retrieval aligned with the current repository state.

### Code Graph could fail on first use

**Problem:** Structural graph queries expected storage to exist before the first lookup, which made a valid first query fail for setup-order reasons.

**Fix:** The code-graph DB access path now initializes itself lazily so first-use lookups do not die on missing setup.

### Adaptive-fusion defaults were not equally visible across clients

**Problem:** Runtime configuration and client-facing MCP config surfaces did not tell a single clear story about adaptive-fusion defaults.

**Fix:** The phase made adaptive-fusion behavior explicit across the active config surfaces so operators can inspect the same default behavior everywhere.

### Lexical score traces were getting lost after fusion

**Problem:** Exact-word evidence from BM25 and FTS5 could disappear after reciprocal-rank fusion, which made final ranking traces harder to inspect.

**Fix:** The formatter now preserves lexical provenance fields through the fused output path.

---

## Nested Child Phases (4)

### Phases 001 through 006 turned adaptive ranking from a paper design into a wired runtime path

**Problem:** The adaptive-fusion stack still had important seams missing or under-documented: promotion-gate actions were not wired through, tuned thresholds were not persisted, replay feedback labeling needed real query context, access signals were not recorded correctly, the lifecycle suite needed an honest boundary description, and several "default-on" retrieval boosts still behaved like opt-in or misreported their active state.

**Fix:** Child phases `001` through `006` closed those seams. They wired promotion-gate tuning, persisted threshold overrides in SQLite, carried real feedback labels, fixed access-signal writes, clarified the adaptive lifecycle end-to-end suite, and graduated session boost, causal boost, and deep expansion to a truthful default-on state with clearer classifier routing.

### Phase 007 produced the external graph-memory research backlog

**Problem:** The packet needed evidence-based direction for graph-memory improvements instead of local guesswork.

**Fix:** Phase `007` surveyed seven external systems, produced a ranked backlog, and captured ADRs that informed the later graph-retrieval work.

### Phase 008 improved `create.sh` for nested phase-parent workflows

**Problem:** The packet had already moved into nested child phases, but the phase-creation tooling still handled nested parent paths poorly.

**Fix:** Phase `008` added and verified `--phase-parent` support, relaxed nested-parent validation correctly, preserved backward compatibility with `--parent`, and documented the behavior in Level 3 phase artifacts.

### Phase 009 shipped the largest retrieval expansion in the subtree

**Problem:** Search still needed graph-aware fallback, provenance, contradiction handling, usage-aware ranking, and community-level retrieval if it was going to benefit from the research backlog.

**Fix:** Phase `009` delivered those capabilities behind feature flags. It completed `51/51` tracked tasks, added graph-expanded fallback, community search, provenance envelopes, temporal edge invalidation, usage-weighted ranking, ontology hooks, and the related tests and feature-catalog coverage.

---

## Verification State (2)

### The parent wrapper is intentionally less "done" than several child phases

**Problem:** The earlier changelog flattened the whole subtree into one fully closed story, but the parent `011` wrapper still marks fresh restart checks and final validator capture as pending.

**Fix:** This changelog now distinguishes the wrapper from the child phases. The parent packet documents stabilization work and open rerun evidence, while the nested child phases record their own completed implementations and verification results.

### The packet has stronger evidence than the earlier `011` release notes showed

**Problem:** The previous changelog stopped at the parent stabilization layer and hid the volume of completed work in the nested subtree.

**Fix:** The release notes now acknowledge the completed adaptive-feedback, graph-retrieval, and tooling phases that actually landed under `011`.

---

## Test Impact

| Metric | Before | After |
| ------ | ------ | ----- |
| CocoIndex rebuild coverage | `0` | `51,820 files / 663,336 chunks` |
| Fresh BM25 re-index coverage | `0` | `1,228 memories` |
| Verified healthy memory records | `0` | `2,961` |
| Child graph-retrieval phase tasks | `0/51` | `51/51` |
| Parent wrapper fresh restart and validator reruns | `0/4` | `Pending in parent phase docs` |

This subtree delivered substantial verified implementation work, even though the parent `011` wrapper still keeps its final fresh-session rerun evidence open.

---

<details>
<summary>Technical Details: Workstreams Covered</summary>

### Parent Stabilization

| Area | Changes |
| ---- | ------- |
| `.opencode/skill/mcp-coco-index/mcp_server/.cocoindex_code/` | Rebuilt semantic-code indexing against the active repository and tightened exclusions. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` | Added first-use initialization for structural graph lookups. |
| `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts` | Preserved lexical provenance after fused ranking. |
| `.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `opencode.json`, and paired Barter config surfaces | Made adaptive-fusion defaults explicit across active client configurations. |

### Nested Implementation Phases

| Child Phase | Shipped Work |
| ---------- | ------------ |
| `001-wire-promotion-gate` | Wired PromotionGate output into adaptive tuning and verified gate-pass, gate-fail, and no-op paths. |
| `002-persist-tuned-thresholds` | Persisted tuned thresholds in SQLite and verified cold-cache and warm-cache behavior. |
| `003-real-feedback-labels` | Scoped replay feedback by query and centered replay scoring around corrections vs outcomes. |
| `004-fix-access-signal-path` | Batched access-signal writes and kept search delivery resilient when adaptive writes fail. |
| `005-e2e-integration-test` | Turned the adaptive lifecycle into one honest in-memory SQLite regression suite. |
| `006-default-on-boost-rollout` | Graduated session boost, causal boost, deep expansion, and artifact-routing improvements. |
| `007-external-graph-memory-research` | Produced a seven-system comparative survey and ranked graph-memory backlog. |
| `008-create-sh-phase-parent` | Added nested `--phase-parent` support to `create.sh` while preserving backward compatibility. |
| `009-graph-retrieval-improvements` | Delivered graph fallback, community retrieval, provenance, temporal edges, usage ranking, ontology hooks, and related tests. |

### Documentation

| File Group | Changes |
| ---------- | ------- |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion/*.md` | Parent wrapper docs aligned to the current template and open verification state. |
| `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion/*/*.md` | Child phase artifacts capture the shipped work and child-level evidence in more detail than the previous parent changelog exposed. |

</details>

---

## Upgrade

No migration required.

Treat this changelog as a subtree summary: the parent `011` wrapper still expects fresh-session follow-up evidence, but the nested adaptive-fusion phases beneath it document substantial completed implementation and verification work.
