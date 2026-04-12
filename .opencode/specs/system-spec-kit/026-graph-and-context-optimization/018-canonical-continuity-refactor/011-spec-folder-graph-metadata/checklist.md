---
title: "018 / 011 — Graph metadata verification checklist"
description: "P0/P1/P2 verification checklist for implementing graph-metadata.json."
trigger_phrases: ["018 011 checklist", "graph metadata verification", "graph metadata rollout checklist"]
importance_tier: "important"
contextType: "planning"
status: "planned"
_memory:
  continuity:
    packet_pointer: "018/011-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Rewrote the packet checklist as an implementation-time verification contract"
    next_safe_action: "Use these checks to validate each phase as code lands"
    key_files: ["checklist.md", "spec.md", "tasks.md"]
---
# Verification Checklist: 018 / 011 — Spec-folder graph metadata

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim implementation complete until all pass |
| **[P1]** | Required | Must pass before rollout or be explicitly waived by the user |
| **[P2]** | Advisory | Can remain pending only with documented rationale |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The implemented schema matches Section 5 of [spec.md](./spec.md), and any intentional divergence from Iteration 4 is documented before merge. Reqs: `REQ-001`, `REQ-002`. Evidence: schema file review plus schema tests.
- [ ] CHK-002 [P0] The requirement-to-task-to-checklist traceability table in [spec.md](./spec.md) still matches the shipped code paths and tests. Reqs: `REQ-001` through `REQ-013`. Evidence: manual packet review before completion.
- [ ] CHK-003 [P1] All verified repo surfaces named in [plan.md](./plan.md) still exist before implementation starts, or the packet docs are updated before code changes begin. Reqs: `REQ-004`, `REQ-005`, `REQ-010`. Evidence: `ls`, `rg --files`, or equivalent path verification.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Manual relationship fields survive refresh unchanged while derived fields are regenerated deterministically. Reqs: `REQ-003`, `REQ-005`. Evidence: parser and save-path tests.
- [ ] CHK-011 [P0] No implementation path overloads `description.json` or `_memory.continuity` with packet graph state. Reqs: `REQ-001`, `REQ-013`. Evidence: code review across save, resume, and discovery surfaces.
- [ ] CHK-012 [P1] The implementation continues to reuse `memory_index`, `document_type`, and `causal_edges` instead of adding a new storage layer. Reqs: `REQ-006`, `REQ-007`, `REQ-013`. Evidence: migration diff plus schema review.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Unit tests pass for valid schema, invalid schema, merge behavior, and schema versioning. Reqs: `REQ-002`, `REQ-003`. Evidence: test run in `scripts/tests/`.
- [ ] CHK-021 [P0] Canonical save integration proves graph metadata refresh runs even when `ctxFileWritten` is false and no legacy `memory/` directory exists. Reqs: `REQ-004`, `REQ-005`. Evidence: targeted save-path test run plus one manual structured save.
- [ ] CHK-022 [P1] Discovery, indexing, graph-edge upsert, and packet-query ranking tests prove `graph_metadata` rows behave correctly in the current pipeline. Reqs: `REQ-006`, `REQ-007`, `REQ-008`, `REQ-013`. Evidence: integration tests plus packet query smoke checks.
- [ ] CHK-023 [P1] Backfill dry-run and report tests cover missing descriptions, weak summaries, and manual-review flags without mutating files. Reqs: `REQ-009`, `REQ-012`. Evidence: backfill dry-run output and test assertions.
- [ ] CHK-024 [P1] Validation proves warning-first `GRAPH_METADATA_PRESENT` behavior works before the rollout threshold is promoted to error. Reqs: `REQ-011`. Evidence: `validate.sh` output against covered and uncovered folders.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Graph metadata reads and writes stay inside approved spec roots and use existing atomic-write protections. Reqs: `REQ-004`, `REQ-005`. Evidence: code review and path-security tests.
- [ ] CHK-031 [P1] Packet relationship parsing rejects invalid targets and does not create unintended self-loops or cross-scope edges. Reqs: `REQ-007`, `REQ-013`. Evidence: causal-edge integration tests.
- [ ] CHK-032 [P1] Backfill and rollout reporting do not leak unrelated paths, secrets, or out-of-scope workspace data. Reqs: `REQ-009`, `REQ-012`. Evidence: dry-run report review and test fixtures.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `/spec_kit:plan`, `/spec_kit:complete`, `/spec_kit:resume`, and `/memory:search` docs match the implemented runtime behavior. Reqs: `REQ-008`, `REQ-010`. Evidence: command doc review plus runtime path verification.
- [ ] CHK-041 [P1] The final implementation packet runs `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict <packet>` successfully after doc/runtime parity updates land. Reqs: `REQ-006`, `REQ-010`, `REQ-011`. Evidence: exact command output captured in `implementation-summary.md`.
- [ ] CHK-042 [P2] `implementation-summary.md` records actual changed files, test commands, rollout state, and any warning-first caveats instead of generic closeout prose. Reqs: `REQ-010`, `REQ-011`. Evidence: final packet review.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] `graph-metadata.json` remains a root-level file in each spec folder, and no implementation step relocates packet graph state into `memory/`, `description.json`, or doc frontmatter as a substitute. Reqs: `REQ-001`, `REQ-010`, `REQ-013`. Evidence: changed-file review plus backfill output review.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total Items | Status |
|----------|-------------|--------|
| P0 Items | 7 | Planned |
| P1 Items | 10 | Planned |
| P2 Items | 1 | Planned |

Use this checklist during implementation. It is intentionally unchecked because this packet is planning-only.
<!-- /ANCHOR:summary -->
