# Shared Memory Relevance Audit

## Section 1 - Verdicts

| # | Question | Verdict | Evidence (file:line) |
| --- | --- | --- | --- |
| 1 | Are the 4 MCP tools still wired in the post-Gate-C handler refactor? | PARTIAL | Tools remained registered and dispatched in [lifecycle-tools.ts](../../../../../../skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts) `57-81`, but `shared_memory_enable` required caller auth in [shared-memory.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/shared-memory.ts) `871-888` while older schemas/docs still implied a no-arg call; this audit patched the schema and command/docs in [tool-schemas.ts](../../../../../../skill/system-spec-kit/mcp_server/tool-schemas.ts) `443-469`, [manage.md](../../../../../../command/memory/manage.md) `851-901`. |
| 2 | Does the access-control layer still gate the new spec-doc-indexed content? | PARTIAL | Shared-space membership still gates indexed rows through [stage1-candidate-gen.ts](../../../../../../skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts) `972-998`, [scope-governance.ts](../../../../../../skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts) `456-493`, and [shared-spaces.ts](../../../../../../skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts) `507-543`, `555-669`. However, filtering is only guaranteed when scope is provided or enforcement is enabled, and trigger-mode filtering in [memory-triggers.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts) `292-321` does not consult membership tables. |
| 3 | Does shared-memory governance interact with the new `_memory.continuity` frontmatter? | PARTIAL | Indexed continuity rows are treated as canonical search sources in [memory-search.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-search.ts) `165-227` and written into spec docs in [memory-save.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-save.ts) `1075-1155`. But resume mode reads the packet docs directly from disk in [memory-context.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-context.ts) `888-923`, so DB gating does not make git-tracked frontmatter private. |
| 4 | Are cross-spec-folder sharing scenarios still meaningful? | PARTIAL | The row model still supports shared-space collaboration because scope filtering uses `shared_space_id` plus tenant membership instead of exact actor/session matches in [scope-governance.ts](../../../../../../skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts) `482-492`. But post-phase-018 canonical knowledge now lives in spec docs and continuity frontmatter, so many prior "share the memory pool" scenarios are practically replaced by sharing the packet in git; canonical retrieval is focused on `spec_doc` and `continuity` in [memory-search.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-search.ts) `173-185`, `218-227`. |
| 5 | Does the constitutional memory tier (iter 012) still work? | PARTIAL | Constitutional files are still discovered and indexed in [memory-index-discovery.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts) `163-186` and [memory-index.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-index.ts) `212-228`; deep/focused context still requests them in [memory-context.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-context.ts) `825-878`. But packet-scoped retrieval no longer guarantees "always surface first" across every packet because constitutional rows live outside the packet-specific spec folder boundary. |
| 6 | Does `/memory:manage shared` still work end-to-end? | PARTIAL | The command still exposes the 4 tools in [manage.md](../../../../../../command/memory/manage.md) `4`, `851-901`, `970-1079`, but it previously documented no-arg shared enable/status flows that did not match handler auth requirements. This audit updated the command docs and response expectations to match the runtime payloads. |

## Section 2 - Functional Findings

### P1

1. `shared_memory_enable` had a schema and slash-command mismatch that made the documented no-arg call invalid.
   - Evidence: [shared-memory.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/shared-memory.ts) `871-888` requires caller auth, while older public registration/docs did not surface actor fields.
   - Fix: completed in this pass by updating [types.ts](../../../../../../skill/system-spec-kit/mcp_server/tools/types.ts), [lifecycle-tools.ts](../../../../../../skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts), [tool-schemas.ts](../../../../../../skill/system-spec-kit/mcp_server/tool-schemas.ts), [tool-input-schemas.ts](../../../../../../skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts), [manage.md](../../../../../../command/memory/manage.md), and [README.md](../../../../../../skill/system-spec-kit/mcp_server/README.md).

2. `shared_memory_status` returned less structure than the docs and command workflow needed for a useful operator status view.
   - Evidence: the handler now returns `spaces` and `rolloutSummary` in [shared-memory.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/shared-memory.ts) `811-848`; before this pass the documented command flow promised richer rollout inspection than the payload exposed.
   - Fix: completed in this pass by extending the handler payload and syncing [manage.md](../../../../../../command/memory/manage.md), [SHARED_MEMORY_DATABASE.md](../../../../../../skill/system-spec-kit/SHARED_MEMORY_DATABASE.md), and [README.md](../../../../../../skill/system-spec-kit/mcp_server/README.md).

3. The shared-memory docs overstated the privacy boundary after phase 018.
   - Evidence: continuity is written into git-tracked spec docs in [memory-save.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-save.ts) `1075-1155`, while resume mode reads those docs directly in [memory-context.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-context.ts) `888-923`.
   - Fix: completed in this pass by clarifying retrieval-vs-git visibility in [SHARED_MEMORY_DATABASE.md](../../../../../../skill/system-spec-kit/SHARED_MEMORY_DATABASE.md).

### P2

1. Shared-space row filtering is still robust for explicit shared queries, but it is not a universal deny-by-default boundary unless governance scope enforcement is enabled or callers pass scope.
   - Evidence: [scope-governance.ts](../../../../../../skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts) `461-467` returns universal allow when enforcement is off and no scope is supplied.
   - Fix: keep as follow-up unless Gate G wants policy hardening now; this is broader than the shared-memory feature itself.

2. Trigger-mode retrieval does not use membership resolution.
   - Evidence: [memory-triggers.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts) `299-321` exact-matches `shared_space_id` but does not join `shared_space_members`.
   - Fix: if shared-trigger parity matters, route trigger filtering through the same `allowedSharedSpaceIds` helper used by search.

3. Constitutional "always surface" semantics are weaker under packet-scoped canonical retrieval.
   - Evidence: constitutional loading still exists in [memory-index.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-index.ts) `212-228`, but packet-scoped search now centers canonical packet docs and continuity anchors in [memory-search.ts](../../../../../../skill/system-spec-kit/mcp_server/handlers/memory-search.ts) `165-227`.
   - Fix: document this narrower behavior and decide whether packet-scoped calls should explicitly union constitutional rows across spec-folder boundaries.

## Section 3 - Conceptual Relevance

Shared-memory features are still useful after phase 018, but their value shifted.

- They still matter for governed indexed retrieval and collaborative writes. The `shared_space_id` boundary in `memory_index` can still partition search results, permit editor/owner mutations, and disable access with rollout or kill-switch controls.
- They are no longer a reliable secrecy boundary for canonical packet continuity. Once `_memory.continuity` and packet docs are committed to git, any collaborator with repo access can read them directly, regardless of database membership.
- Cross-packet sharing still works mechanically when teams want a curated shared retrieval surface without broadening normal search to every tenant row. That is still a post-phase-018 use case.
- The original "private shared memory pool separate from repo-visible packet docs" story is now substantially weaker. For canonical packet knowledge, the real source of truth is the spec doc itself.

Bottom line: shared memory is still relevant as a retrieval/governance partition, not as the canonical storage layer for packet continuity.

## Section 4 - `SHARED_MEMORY_DATABASE.md` Update Needed

The document needed four post-phase-018 corrections, and all four were applied in this pass:

1. Clarify that shared memory governs indexed retrieval and shared writes, not git visibility of spec-doc frontmatter.
2. Update enable/status examples so they include explicit caller identity (`actorUserId` or `actorAgentId`).
3. Reframe "when you do not need this" around the new spec-doc substrate.
4. Add an explicit `_memory.continuity` note so operators understand the tension between database gating and committed markdown.

## Section 5 - Remediation Tasks

### P0

No P0 blocker found.

### P1

1. Keep the just-applied shared-tool schema/docs/runtime alignment.
   - Files: `mcp_server/tools/types.ts`, `mcp_server/tools/lifecycle-tools.ts`, `mcp_server/schemas/tool-input-schemas.ts`, `mcp_server/tool-schemas.ts`, `mcp_server/handlers/shared-memory.ts`, `mcp_server/README.md`, `command/memory/manage.md`, `SHARED_MEMORY_DATABASE.md`, tests.

2. Decide whether unscoped search should remain allowed when `SPECKIT_MEMORY_SCOPE_ENFORCEMENT` is off.
   - If not, make shared-scope enforcement unconditional for shared rows instead of environment-dependent.

### P2

1. If shared retrieval parity matters for trigger mode, teach `memory_match_triggers` to resolve `allowedSharedSpaceIds`.
2. If constitutional rules should still override packet-scoped retrieval, add an explicit cross-folder constitutional union path and document it.
3. Add one small regression test that proves `_memory.continuity` remains git-visible even when the indexed row is shared-scoped, so future docs do not drift back into overstating privacy.

## Section 6 - Recommendation

**PATCH + KEEP**

The feature is still functional and still useful, but not for its original "shared memory as the canonical knowledge container" framing. After phase 018, it should be kept as:

- a governed retrieval partition on `memory_index`
- a collaboration control for shared writes and rollout/kill-switch operations
- a status/admin layer for multi-tenant search boundaries

It should not be described as a privacy wrapper around canonical packet continuity stored in git-tracked spec docs.
