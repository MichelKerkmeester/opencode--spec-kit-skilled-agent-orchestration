### Finding TR-001: Parent phase map omits a live numbered child folder
- **Severity**: P1
- **Dimension**: traceability
- **File**: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/spec.md:89
- **Evidence**: The parent `Phase Documentation Map` lists only `001-post-session-capturing-alignment/`, but the parent folder on disk also contains `002-skill-review-post-022/`, and that sibling packet's spec declares the same parent (`002-skill-review-post-022/spec.md:6`). The parent-to-child map is therefore incomplete.
- **Impact**: Reviewers and phase-aware tooling cannot rely on the parent spec as the authoritative navigation surface for all numbered child packets, which breaks bidirectional traceability.
- **Fix**: Add `002-skill-review-post-022/` to the phase map, or rename/move it out of the numbered child-folder namespace if it is not intended to participate in the phase system.

### Finding TR-002: Child checklist overstates phase-link completeness
- **Severity**: P1
- **Dimension**: traceability
- **File**: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/001-post-session-capturing-alignment/checklist.md:44
- **Evidence**: CHK-012 says parent references resolve cleanly, but the child spec only provides `Parent Spec`, `Predecessor`, and `Successor` (`001-post-session-capturing-alignment/spec.md:28-30`). The governing phase-system spec requires child phase templates to include `Parent Spec`, `Parent Plan`, predecessor/successor fields, and handoff criteria (`021-spec-kit-phase-system/spec.md:153-155`).
- **Impact**: A checked verification item says the child fully satisfies the parent-link contract even though a required parent reference is missing, weakening trust in the checklist as a trace artifact.
- **Fix**: Add the missing parent-plan/handoff linkage required by the phase system, or narrow CHK-012 so it only claims the references that actually exist today.

### Finding TR-003: CHK-050 contradicts the packet's own scope and task list
- **Severity**: P1
- **Dimension**: traceability
- **File**: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/checklist.md:88
- **Evidence**: CHK-050 says the canonical packet edits stayed in scope while the live-doc closeout landed separately. But the parent spec explicitly lists SKILL.md, memory references, and asset docs in `Files to Change` (`spec.md:76-84`), and the completed tasks T004-T017 treat those live-doc updates as work delivered by this packet (`tasks.md:44-77`).
- **Impact**: The verified checklist item misstates ownership of the work, so readers cannot tell whether the packet itself delivered the live-doc changes or only recorded them after the fact.
- **Fix**: Rewrite CHK-050 to match the actual packet scope, or split the live-doc closeout into a separate packet and update the parent spec/tasks/summary to reflect that separation consistently.

### Finding TR-004: Post-refinement checklist evidence is not durable and no longer reproducible
- **Severity**: P1
- **Dimension**: traceability
- **File**: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/checklist.md:97
- **Evidence**: CHK-060 through CHK-065 rely on opaque evidence such as "diff shows," "actual count verified via find command," and "3 parallel explore agents found" instead of file:line anchors or preserved command output. During this review, the current repo still shows 33 tool definitions, but the feature-catalog and manual-testing markdown counts are 224 and 231 respectively, not the cited 221 and 227 totals.
- **Impact**: Later reviewers cannot verify what was actually checked at closeout time, and numeric evidence has already drifted enough that the checked boxes are no longer auditable from the packet itself.
- **Fix**: Replace these checklist evidence notes with stable file:line citations and preserved dated command output (or explicitly mark them as point-in-time counts captured in scratch/memory artifacts).

### Finding TR-005: REQ-009 has no explicit task-level trace
- **Severity**: P2
- **Dimension**: traceability
- **File**: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/spec.md:117
- **Evidence**: REQ-009 requires the packet to document the canonical verification method via `mcp_server/tool-schemas.ts` and `.opencode/command/memory/`. The task list covers pack reconciliation, live-doc updates, and verification reruns (`tasks.md:33-77`), but it never includes a dedicated task to add or verify that documentation path.
- **Impact**: Requirement-to-task coverage is incomplete, so this requirement looks satisfied only incidentally through broader rewrite work instead of through a deliberate, reviewable task.
- **Fix**: Add a task or completion criterion that explicitly captures documentation of the canonical verification method and points to the authoritative files.

### Finding TR-006: Implementation summary under-reports the delivered scope
- **Severity**: P1
- **Dimension**: traceability
- **File**: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/implementation-summary.md:17
- **Evidence**: The summary metadata says the scope was `Five canonical docs only`, and the `How It Was Delivered` table lists only canonical packet files (`implementation-summary.md:42-48`). But the same summary says the pass closed drift in SKILL.md, save_workflow, embedding_resilience, and asset docs (`implementation-summary.md:28-35`), which matches the parent spec and tasks (`spec.md:76-84`, `tasks.md:44-77`).
- **Impact**: The implementation summary cannot be used as a reliable trace document for what this phase actually changed, because it simultaneously describes and hides non-canonical deliverables.
- **Fix**: Either limit the summary to the pack-only reconciliation and move external doc work into another packet, or expand the metadata and delivery table so they enumerate the live-doc surfaces this phase claims to have changed.
