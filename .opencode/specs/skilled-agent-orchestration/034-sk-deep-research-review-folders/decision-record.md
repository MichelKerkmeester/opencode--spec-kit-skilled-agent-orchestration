---
title: "Decision Record: sk-deep-research [skilled-agent-orchestration/034-sk-deep-research-review-folders/decision-record]"
description: "Architectural decisions for moving deep-review outputs into a dedicated review/ packet while preserving compatibility for legacy scratch-based sessions."
trigger_phrases:
  - "review folder adr"
  - "deep-review decision record"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/034-sk-deep-research-review-folders"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
---
# Decision Record: sk-deep-research Review Folder Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Move the full review packet under `review/` and keep current review-mode basenames

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-27 |
| **Deciders** | Spec author, request owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

Review mode currently writes durable packet state into `scratch/` even though system-spec-kit defines `scratch/` as temporary, disposable workspace. The review YAML workflows, the canonical `deep-review` agent, the review contract asset, and the review strategy template all encode `scratch/` as the runtime location for resumable state. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml:82-120] [SOURCE: .opencode/agent/deep-review.md:31-65] [SOURCE: .opencode/skill/sk-deep-research/assets/review_mode_contract.yaml:202-230] [SOURCE: .opencode/skill/sk-deep-review/assets/deep_review_strategy.md:3-19]

### Constraints

- The user requested that review-mode output live in a dedicated review subfolder.
- The path change crosses workflows, runtime agents, docs, and playbook surfaces, so scope control matters.
- Existing review packets already use the current filenames and likely depend on them for resume semantics.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: move the entire review-mode packet into `{spec_folder}/review/` and keep the existing review-mode basenames for this change.

**How it works**: The canonical review session directory will contain the config, JSONL state, strategy, dashboard, iteration artifacts, pause sentinel, and final review report. The final report also moves into `review/` so the full packet stays together rather than splitting state into one folder and the summary into the spec root.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Move the full packet into `review/` and keep current basenames** | Matches the user request, restores `scratch/` semantics, keeps scope limited to path relocation | Requires a wide doc and runtime sync sweep, plus report-path compatibility review | 9/10 |
| Move state into `review/` but keep the report at the spec root | Easier report discoverability for existing readers | Violates the "all review output" goal and leaves the packet split across locations | 6/10 |
| Rename all basenames to `deep-review-*` while also moving folders | Produces cleaner naming | Adds broad schema churn on top of the folder move and risks breaking resume logic | 5/10 |

**Why this one**: It satisfies the explicit user intent while keeping the implementation bounded to folder placement rather than layering in a larger naming refactor.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Durable review artifacts no longer misuse `scratch/`.
- Operators can find the full review packet in one predictable place.
- Review folder semantics become easier to explain in docs and playbooks.

**What it costs**:
- The path change must be synchronized across workflows, runtime agents, and docs. Mitigation: treat the change as one contract update, not as cleanup.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hidden consumers still expect a root-level review report | M | Search for and either update or explicitly shim those consumers during implementation |
| Runtime variants drift after the move | H | Update all four runtime files together and validate them with path sweeps |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `scratch/` is currently used for durable review state despite repo rules saying it is temporary |
| 2 | **Beyond Local Maxima?** | PASS | We evaluated split-packet and basename-renaming alternatives before choosing the folder-only change |
| 3 | **Sufficient?** | PASS | Moving the packet without renaming basenames solves the stated problem without a larger refactor |
| 4 | **Fits Goal?** | PASS | The goal is dedicated review-folder placement for review outputs |
| 5 | **Open Horizons?** | PASS | Preserving current filenames leaves a future naming cleanup available as a separate decision |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Review auto and confirm YAML workflows point all durable review outputs to `{spec_folder}/review/`.
- Runtime `deep-review` agents, contract assets, docs, and playbook scenarios all reference the new packet location.

**How to roll back**: Revert the runtime and doc path changes together and restore the legacy scratch-based contract if the migration causes a release-blocking regression.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### Legacy Migration Note

The accepted implementation includes a targeted legacy migration branch:
- move only the review-specific whitelist from `scratch/`
- include the root-level review report when legacy review markers are present
- leave unrelated scratch files untouched
- run normal invalid-state checks after migration rather than bypassing them
