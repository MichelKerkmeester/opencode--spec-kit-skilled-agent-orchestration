---
title: "...-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt/decision-record]"
description: "Architectural decision for the improver-skill rename closeout: canonical sk-improve-* naming, runtime-agent filename boundary, and historical spec-folder slug preservation captured as one compound ADR."
trigger_phrases:
  - "042.007"
  - "skill rename decision record"
  - "sk-improve-agent"
  - "sk-improve-prompt"
  - "improve-agent"
importance_tier: "normal"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
---
# Decision Record: Skill Rename Closeout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Canonical `sk-improve-*` Naming with Runtime-Agent and Historical-Slug Boundaries

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-11 |
| **Deciders** | Phase 042.007 lead |

---

<!-- ANCHOR:adr-001-context -->
### Context

The repo already completed a physical rename from `sk-agent-improver` and `sk-prompt-improver` to `sk-improve-agent` and `sk-improve-prompt`. The rename was driven by alignment with the shipped `/improve:agent` and `/improve:prompt` command namespace. At closeout time, the phase packet itself still carried stale metadata, old runtime-agent references, and missing template markers while every active repo reference had already been migrated.

The closeout raised three related questions that must be settled together so the packet cannot drift again:

1. **Canonical skill naming** — should the packet record the new `sk-improve-*` names, the retired names, or both?
2. **Runtime-agent filename boundary** — should `.opencode/agent/improve-agent.*`, `.claude/agents/improve-agent.*`, `.gemini/agents/improve-agent.*`, and `.codex/agents/improve-agent.toml` be renamed to match the old `agent-improver` convention, or left as-is?
3. **Historical spec-folder slug preservation** — should historical spec folders that still carry the retired names in their slugs be renamed to match the new convention?

### Constraints

- The live skill folders at `.opencode/skill/sk-improve-agent/` and `.opencode/skill/sk-improve-prompt/` must remain the single source of truth.
- The shipped `/improve:agent` and `/improve:prompt` command namespace cannot be changed as part of this closeout.
- Historical spec-folder slugs referencing the retired names already exist on disk and in git history and must not be rewritten.
- The runtime-agent files already match the current runtime naming convention across four runtime directories.
- The phase is documentation-only; no runtime behavior may change.
- Scope lock: only files inside `007-skill-rename-improve-agent-prompt/` may be modified.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Use `sk-improve-agent` and `sk-improve-prompt` as the only canonical skill names, leave the `improve-agent.*` runtime-agent filenames unchanged, and preserve historical spec-folder slugs as archival identity.

**How it works**: Every active reference in `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` points at the new skill folders and the new changelog directories (`.opencode/changelog/14--sk-improve-prompt/` and `.opencode/changelog/15--sk-improve-agent/`). Runtime-agent references go to the live `improve-agent.*` files in all four runtime directories. Historical slugs remain untouched; the phase docs explicitly distinguish archival identity from live runtime paths so future readers do not mistake one for the other.

#### Sub-Decision A: Canonical `sk-improve-*` Skill Naming

The packet references `sk-improve-agent` and `sk-improve-prompt` everywhere. Retired names (`sk-agent-improver`, `sk-prompt-improver`) only appear when the packet explicitly contrasts the pre-rename state against the shipped state.

#### Sub-Decision B: Runtime-Agent Filename Boundary

The runtime-agent filenames at `.opencode/agent/improve-agent.md`, `.claude/agents/improve-agent.md`, `.gemini/agents/improve-agent.md`, and `.codex/agents/improve-agent.toml` are left as-is. They already use the current runtime naming convention, and renaming them would create a second rename surface with no behavioral win.

#### Sub-Decision C: Historical Spec-Folder Slug Preservation

Historical spec folders that still carry retired names in their slugs remain unchanged. Renaming them would break parent packet links, rewrite git history, and violate the scope lock for this phase. The packet explicitly states this boundary in `spec.md` edge cases.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Canonical `sk-improve-*` + runtime-agent boundary + historical slug preservation (Chosen)** | Packet matches live repo with zero drift, four-runtime parity preserved, link-stability maintained, scope lock honored | Retired names still exist in historical slugs on disk | 9/10 |
| Keep retired names in packet for historical continuity | Preserves the original narrative | Packet drifts from live repo; readers trip on dead paths | 3/10 |
| Treat old and new names as equally canonical | Avoids picking a winner | Split naming permanently confuses future audits | 2/10 |
| Rename runtime-agent filenames to match retired scheme | Internal naming symmetry across skill and agent layers | Breaks four-runtime parity, introduces second rename with no behavioral win | 1/10 |
| Rename historical spec folders to match new skill names | Perfect naming symmetry | Breaks parent links, rewrites history, violates scope lock | 2/10 |
| Add alias symlinks from retired names to new names | Soft compatibility | Doubles the surface area that must stay in sync, no clear consumer | 3/10 |

**Why this one**: The user's theme across the 042 packet is "finish what 042 already claimed". The shipped rename is the truth the packet must document. Runtime-agent filenames already landed on the right names, so renaming them would be net-negative. Historical slugs carry archival identity that parent packets and memory indexes still depend on, so preserving them is cheaper than rewriting history. Binding all three sub-decisions into one ADR makes the rename closeout an atomic boundary rather than three independent choices that could drift apart.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Packet and live repo agree on skill names, runtime-agent references, and historical slugs with zero drift.
- Four-runtime mirror files remain in parity; no runtime behavior changes.
- Parent packet links and memory indexes continue to resolve without repair work.
- Rename evidence is traceable through one coherent narrative across `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- Scope lock for this phase stays clean; no files outside `007-skill-rename-improve-agent-prompt/` are touched.

**What it costs**:
- Retired skill names still exist in historical folder slugs on disk. Mitigation: `spec.md` edge cases and this ADR explicitly distinguish historical slugs from active runtime paths.
- Readers who expect naming symmetry between skill layer and agent layer must learn that runtime filenames follow their own convention. Mitigation: the packet states this boundary in Sub-Decision B and in `spec.md` scope.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future reader confuses a historical slug with an active path | L | Edge cases in `spec.md` and Sub-Decision C make the archival-identity rule explicit |
| Follow-up packet introduces a second rename without updating this ADR | L | This packet captures the 2026-04-11 baseline; any future rename must update this ADR |
| Auditor treats a historical slug as evidence that rename is incomplete | L | Sub-Decision C and `spec.md` edge cases are the first artifacts an auditor reads |
| Future rename of runtime-agent layer without updating this packet | L | Sub-Decision B captures the current state as the baseline |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Packet was drifting from live repo; closeout could not be claimed without a canonical naming decision, a runtime-agent boundary, and a historical-slug rule |
| 2 | **Beyond Local Maxima?** | PASS | Six alternatives were evaluated and scored across the three sub-decisions |
| 3 | **Sufficient?** | PASS | One canonical rule per sub-decision is the simplest structure that removes drift |
| 4 | **Fits Goal?** | PASS | Matches the documentation-only closeout charter; no runtime surface is touched |
| 5 | **Open Horizons?** | PASS | Aligns with the shipped `/improve:*` command namespace, keeps four-runtime mirror stable, and preserves parent link stability for future phases |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` reference only `sk-improve-agent` and `sk-improve-prompt` for skill names.
- Changelog references point at `.opencode/changelog/14--sk-improve-prompt/` and `.opencode/changelog/15--sk-improve-agent/`.
- Runtime-agent references resolve to the live `improve-agent.*` files in all four runtime directories; no runtime-agent file is renamed or moved.
- `spec.md` scope explicitly lists runtime-agent filenames and historical spec-folder slugs as out of scope.
- `spec.md` edge cases section records the historical-vs-active boundary.
- Retired skill names only appear when the packet explicitly contrasts pre-rename state against shipped state.

**How to roll back**: Not applicable on two grounds. First, the physical rename already shipped before this packet was rewritten, so there is no rename to revert. Second, no runtime file was modified, no historical folder was moved, and the documentation edits live entirely inside `007-skill-rename-improve-agent-prompt/`. If the packet edits themselves need to revert, a git reset of the phase folder is sufficient and has no runtime impact.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record: One compound ADR covering the rename closeout.
Sub-Decision A locks canonical skill naming (`sk-improve-*`), Sub-Decision B draws
the runtime-agent filename boundary (`improve-agent.*` unchanged), and Sub-Decision C
preserves historical spec-folder slugs as archival identity. Accepted 2026-04-11.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
