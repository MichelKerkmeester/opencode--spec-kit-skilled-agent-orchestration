# Iteration 014: DEEP DIVE - STRONGEST PATTERN

## Focus
DEEP DIVE - STRONGEST PATTERN: Go deep on the single most impactful pattern from this system. Trace it end-to-end.

## Findings

### Finding 1: **Modus’s strongest pattern is a durable proposal inbox implemented as first-class markdown artifacts**
- **Source**: `external/internal/vault/prs.go:10-46`; `external/internal/vault/vault.go:48-65`; `external/internal/markdown/writer.go:10-52`; `external/internal/markdown/parser.go:13-76`
- **What it does**: Modus persists each risky knowledge change as `atlas/prs/<slug>.md`, not as transient handler state. `OpenPR()` writes frontmatter with `title`, `opened_by`, `status=open`, `opened_at`, `target_type`, `target_id`, `confidence`, and `linked_belief_ids`, plus a markdown reasoning body. The generic vault read/write path means PRs use the same plain-file contract as the rest of the system: human-readable, git-diffable, and operator-editable.
- **Why it matters for us**: This is the most valuable pattern in the repo because it turns memory mutation review into a durable operating surface instead of console output or ephemeral response metadata. Public already has strong mutation safety, but not a persistent review object that can be listed, approved, rejected, or resumed later.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 2: **The PR lifecycle is decision-tracking plus belief feedback, not target mutation execution**
- **Source**: `external/internal/vault/prs.go:49-110`; `external/internal/vault/beliefs.go:91-126`; `external/internal/mcp/vault.go:681-777`; `external/internal/vault/prs.go:32-37`; `external/internal/mcp/vault.go:686-700`
- **What it does**: On merge, Modus marks the PR `merged`, stamps `closed_at`/`closed_by`, and reinforces each `linked_belief_id`; on reject, it marks `rejected`, stores `rejection_reason`, and weakens linked beliefs. Critically, `target_type` and `target_id` are recorded when the PR is opened, but the merge/reject path does **not** apply any mutation to that target object. The proposal is an evidence/governance artifact whose outcome feeds confidence updates into beliefs.
- **Why it matters for us**: This is the key end-to-end nuance. The best part of the pattern is not “PRs for memories”; it is “operator decisions become durable signals that strengthen or weaken the system’s confidence model.” Public should copy that feedback loop, not assume proposals themselves are the mutation engine.
- **Recommendation**: **adopt now**
- **Impact**: **high**

### Finding 3: **The trust-stage model is real state, but in current code it is governance metadata, not enforced runtime gating**
- **Source**: `external/internal/vault/trust.go:11-95`; `external/internal/mcp/vault.go:607-635`; search showed no other `GetTrustStage` call sites in `external/internal/**/*.go`
- **What it does**: Modus persists `atlas/trust.md`, defaults to stage 1 when absent, records transition history in the markdown body, and exposes MCP tools to get/set the stage with labels `Inform`, `Recommend`, and `Act`. But the current code does not use that stage to gate `atlas_open_pr`, `atlas_merge_pr`, `atlas_reject_pr`, or other mutation paths.
- **Why it matters for us**: This corrects the earlier high-level read: the trust system is an operator-owned posture marker, but not yet a hard control plane. For Public, copying it verbatim would add a policy label without safety value unless it is wired into mutation and approval paths.
- **Recommendation**: **reject**
- **Impact**: **medium**

### Finding 4: **This proposal workflow is not part of Modus’s default memory-only surface; it lives in the broader vault control plane**
- **Source**: `external/internal/mcp/memory.go:7-38`; `external/internal/mcp/vault.go:15-18,605-777`; `external/README.md:172-208,191-208`
- **What it does**: `RegisterMemoryTools()` trims the exposed toolset down to 11 search/memory tools and removes the PR/trust tools from that profile. The proposal inbox exists in the broader vault tool registration, not in the lean memory profile described in the README.
- **Why it matters for us**: That makes the pattern more credible, not less: even Modus treats it as an advanced control-plane layer above retrieval, not as core search behavior. Public should do the same and avoid entangling proposal workflow with the canonical retrieval interface.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 5: **Public has auditability and advisory signals, but still lacks the durable triage object that makes Modus’s pattern useful**
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:417-435`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:84-110,183-186,342-343`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:201-223`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:91-139`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:141-180`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648-776`; `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:108-179,233-274`
- **What it does**: Public’s review-tier reconsolidation only creates an `assistiveRecommendation` payload and console warning; it is forwarded in the `memory_save` response but not persisted as a reviewable object. Meanwhile `memory_update`, `memory_delete`, and `memory_bulk_delete` act directly, protected by transactionality, checkpoints, and the append-only mutation ledger. `memory_validate` updates confidence, negative-feedback state, and promotion eligibility, but only emits hints like “consider updating or deleting.”
- **Why it matters for us**: Public’s gap is no longer retrieval math or mutation safety. The missing layer is a persistent operator inbox that can hold borderline reconsolidation, supersession, promotion, or deprecation proposals and then feed accept/reject outcomes back into existing confidence and feedback systems.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

## Sources Consulted
- `external/internal/vault/prs.go`
- `external/internal/vault/trust.go`
- `external/internal/vault/beliefs.go`
- `external/internal/vault/facts.go`
- `external/internal/vault/vault.go`
- `external/internal/mcp/vault.go`
- `external/internal/mcp/memory.go`
- `external/internal/markdown/parser.go`
- `external/internal/markdown/writer.go`
- `external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

## Assessment
- New information ratio: **0.74**
- Questions addressed: whether the proposal/approval pattern is actually implemented end-to-end; whether trust stages are enforced or only descriptive; whether PR merge/reject mutates target objects or only linked confidence; whether Public already has an equivalent durable review surface; whether this pattern belongs in core retrieval or in an operator control plane.
- Questions answered: the strongest Modus pattern is a **durable proposal inbox**, but its real value is **decision persistence plus belief-feedback wiring**; the trust-stage layer is **not enforced** in current code; PR resolution **does not mutate targets**; Public has **checkpoints, ledgers, and feedback**, but still lacks the **persistent triage object** that would turn those pieces into an operator workflow.

## Reflection
- What worked: Tracing `prs.go` through `mcp/vault.go`, then checking whether `target_type`/`target_id` are ever consumed elsewhere, exposed the true shape of the pattern quickly. Comparing that against Public’s reconsolidation response path and direct mutation handlers made the gap very concrete.
- What did not work: The earlier architectural framing overstated the trust-stage mechanism; once I searched for real call sites, it became clear that trust is currently metadata, not enforcement. Treating the README tool list as the whole product would also have hidden that the proposal workflow lives in the broader vault profile, not the default memory surface.

## Recommended Next Focus
Compare against a system with a **real due-items / review-queue / approval-inbox scheduler**, so the next iteration can test how Public should operationalize proposal triage once retrieval, confidence, and mutation safety are already in place.


Total usage est:        1 Premium request
API time spent:         3m 40s
Total session time:     3m 57s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.1m in, 10.3k out, 952.3k cached, 4.4k reasoning (Est. 1 Premium request)
