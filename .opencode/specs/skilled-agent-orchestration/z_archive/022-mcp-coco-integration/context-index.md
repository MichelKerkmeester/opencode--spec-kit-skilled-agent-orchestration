---
title: "Context Index: 022-mcp-coco-integration (Phase-Parent Transition Note)"
description: "Migration bridge documenting 022's transition from flat Level 2 packet to phase-parent (with child 059) under tolerance option A — heavy docs at parent retained alongside new child packets."
trigger_phrases:
  - "022 context index"
  - "022 phase parent transition"
  - "cocoindex packet history"
  - "022 children manifest"
importance_tier: "normal"
contextType: "spec-folder-migration"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/022-mcp-coco-integration"
    last_updated_at: "2026-05-01T14:42:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Phase-parent transition documented as 059 child registered"
    next_safe_action: "Validate parent + child with --strict; if validator rejects mixed-mode, fall back to option B (rename heavy docs into sibling 001-cocoindex-install/)"
    blockers: []
    key_files:
      - graph-metadata.json
      - description.json
      - 059-agent-implement-code/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-01-spec-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Tolerance option (A) chosen — heavy parent docs retained alongside child"
---

# Context Index: 022-mcp-coco-integration

Migration bridge for the phase-parent transition that occurred on 2026-05-01.

---

## STATE BEFORE (pre-2026-05-01)

`022-mcp-coco-integration/` was a **flat Level 2 spec packet** documenting the CocoIndex Code MCP server installation work. Status: complete (Phases 1-7 Cross-CLI Adoption Boosting). `children_ids: []`. All work documented in parent-level docs:

- `spec.md` — Level 2 feature spec covering 7 execution phases
- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` — full Level 2 ladder
- `research/research.md`, `scratch/cross-cli-auto-usage-test-results.md`

---

## STATE AFTER (2026-05-01+)

`022-mcp-coco-integration/` becomes a **phase parent** with first child `059-agent-implement-code/` registered. Per the strict phase-parent rule (lean trio at parent level: spec.md + description.json + graph-metadata.json), heavy docs would normally move into a sibling child folder. **This packet applies tolerance option A**: heavy parent docs are retained alongside the new child.

### Tolerance rationale
- The parent's heavy docs document **already-shipped, complete** Phase 1-7 work (CocoIndex install). Moving them into a sibling child `001-cocoindex-install/` would be lossless rename churn with no operational benefit — they're stable historical record.
- Validator behavior: phase-parent strict mode tolerates legacy phase parents that retain heavy docs (per CLAUDE.md SKILL.md note: "Tolerant policy: legacy phase parents that retain heavy docs continue to validate; soft-deprecation is a follow-on packet"). If `validate.sh --strict` rejects the mixed mode, we fall back to option B (rename to sibling `001-cocoindex-install/`).
- New work goes to children folders only. Parent-level docs are frozen as historical record from this point forward.

---

## CHILDREN MANIFEST

| Child ID | Purpose | Status | Created |
|----------|---------|--------|---------|
| `059-agent-implement-code/` | Author write-capable `@code` LEAF sub-agent with sk-code auto-load and orchestrator-only dispatch | Draft | 2026-05-01 |

---

## RESUME POINTERS

When resuming work on this packet:
- **Parent-level historical work (CocoIndex install)** — read `spec.md`, `implementation-summary.md` (Status: complete; no further work)
- **Active child work** — `derived.last_active_child_id` in `graph-metadata.json` points to current focus. Currently: `059-agent-implement-code/`
- **For new sub-phases** — create as a new `NNN-name/` child; parent's heavy docs stay as historical record

---

## RELATED

- Parent spec history: see `spec.md` (Phases 1-7 Cross-CLI Adoption Boosting)
- Active child: `059-agent-implement-code/` (write-capable @code agent)
- Phase-parent rule reference: CLAUDE.md `## 3. SPEC FOLDER DOCUMENTATION` "Phase Parent" section
- Tolerance policy reference: CLAUDE.md SKILL.md note quoted above
