---
title: "Implementation Plan: Skill Alignment — system-spec-kit"
description: "Five-phase documentation refresh plan for turning 015-skill-alignment into an implementation-ready, non-duplicative documentation backlog."
trigger_phrases: ["implementation", "plan", "skill alignment", "015 alignment"]
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Skill Alignment — system-spec-kit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec artifacts plus documented TypeScript runtime references |
| **Framework** | Spec Kit spec-folder workflow |
| **Storage** | Local markdown docs in `.opencode/specs/` and `.opencode/skill/system-spec-kit/` |
| **Testing** | `validate.sh`, `check-completion.sh`, `verify_alignment_drift.py`, targeted `rg`/`wc` verification |

### Overview

This phase does not implement the `system-spec-kit` documentation alignment itself. It prepares a clean, Level 2, research-backed specification so the future implementation phase can update the system skill guide, references, and assets without redoing already-landed work or drifting from live repo truth.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Scratch research reviewed across `./scratch/agent-01...agent-10`
- [x] Parent epic docs reviewed in `../spec.md` and `../implementation-summary.md`
- [x] Live repo spot-checks performed to separate open gaps from already-landed work

### Definition of Done
- [x] `015-skill-alignment` spec docs are Level 2, anchored, and locally cross-linked
- [x] Backlog contains only still-open documentation work
- [x] Verification methods use canonical repo truth rather than brittle grep shortcuts
- [x] Validation and drift checks complete with any remaining policy conflicts documented
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation refresh and backlog curation.

### Key Components
- **Spec folder docs**: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` define the future implementation contract.
- **Research evidence**: Scratch agent findings and parent-epic docs define what is still open versus already landed.
- **Future target docs**: `../../../../skill/system-spec-kit/`, `../../../../skill/system-spec-kit/references/**`, and `../../../../skill/system-spec-kit/assets/**` remain implementation targets, not part of this phase's direct behavior changes.

### Data Flow
Research notes and live repo inspection feed the rewritten spec. The rewritten spec then drives the future documentation refresh by separating: open work, already-landed work, verification method, and documentation-only boundaries.

### Verification Methodology
- **Repo-truth validation**: confirm counts and behaviors from live files such as `tool-schemas.ts`, `context-server.ts`, and env-var references.
- **Doc-link and anchor validation**: ensure this spec folder resolves locally and follows Spec Kit anchor expectations.
- **Already-landed checks**: prune items that are already documented elsewhere in the repo.
- **Still-open checks**: retain only gaps that remain observable in live files after research reconciliation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Spec-Folder Normalization
- [x] Upgrade `015` to Level 2 and add `checklist.md`
- [x] Add anchors and fix broken local relative references
- [x] Keep the phase marked `Draft` and explicitly pre-implementation

### Phase 2: Skill-Guide Backlog Refresh
- [x] Retain open skill-guide gaps for stale metadata, routing, rules, governance, and shared-space/shared-memory tool positioning
- [x] Remove or downgrade tasks already satisfied by current repo docs
- [x] Require canonical-source verification for future metadata updates

### Phase 3: Reference Backlog Refresh
- [x] Keep only open reference-file work across memory, validation, structure, workflows, debugging, and config
- [x] Remove items already covered by quick-reference, phase-aware template guidance, or nested path support
- [x] Keep runtime-flag documentation work focused on missing runtime `SPECKIT_GRAPH_UNIFIED` coverage and stale causal wording

### Phase 4: Asset Backlog Refresh
- [x] Keep only open asset work for dispatch, complexity, level-decision, and template-mapping docs
- [x] Remove asset tasks that research or live repo inspection no longer support as open gaps

### Phase 5: Verification and Drift-Proofing
- [x] Validate this spec folder with `validate.sh`
- [x] Confirm Level 2 checklist recognition with `check-completion.sh`
- [x] Run `verify_alignment_drift.py --root .opencode/skill/system-spec-kit`
- [x] Re-run targeted searches to ensure the backlog still matches live repo truth
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure validation | Spec-folder level, anchors, file set, local references | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh` |
| Completion check | Level 2 checklist recognition and progress accounting | `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh` |
| Drift check | Confirm no runtime/code alignment drift is introduced by this planning phase | `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` |
| Manual evidence review | Ensure open gaps match scratch research and live repo truth | `rg`, `sed`, `wc -l`, targeted spot checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `./scratch/agent-01...agent-10` | Internal | Green | Backlog cannot be accurately rewritten without the research summaries |
| `../spec.md` | Internal | Green | Parent phase context would be incomplete |
| `../implementation-summary.md` | Internal | Green | Open-vs-landed reconciliation would be weaker |
| Spec Kit validation scripts | Internal | Green | Completion evidence cannot be checked consistently |
| `016-command-alignment` | Internal | Green (Completed) | Command documentation suite fully delivered (32/32 tools, 7 commands); 015 scope narrowed to SKILL.md metadata/routing/rules only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The rewritten spec folder introduces stale tasks, broken local references, or incorrect claims about already-landed documentation work.
- **Procedure**: Revert only the `015-skill-alignment` spec-folder docs, restore the prior backlog, and re-run the same research-backed comparison before editing again.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Normalize Spec Folder) ──► Phase 2 (SKILL Backlog)
                                      │
                                      ├──► Phase 3 (References Backlog)
                                      │
                                      ├──► Phase 4 (Assets Backlog)
                                      │
                                      └──► Phase 5 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Normalize Spec Folder | None | All later phases |
| Skill-Guide Backlog Refresh | Normalize Spec Folder | Verification |
| References Backlog Refresh | Normalize Spec Folder | Verification |
| Assets Backlog Refresh | Normalize Spec Folder | Verification |
| Verification | All prior phases | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Spec-Folder Normalization | Medium | 1-2 hours |
| Skill-Guide Backlog Refresh | Medium | 1-2 hours |
| References Backlog Refresh | High | 2-4 hours |
| Assets Backlog Refresh | Medium | 1-2 hours |
| Verification | Medium | 1 hour |
| **Total** | | **6-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-execution Checklist
- [x] Research corpus loaded
- [x] Parent epic context loaded
- [x] Live repo spot-checks completed before backlog rewrite

### Rollback Procedure
1. Revert spec-folder doc edits if they introduce broken links, stale tasks, or incorrect scope boundaries.
2. Re-run targeted repo inspection for the disputed claim before restoring a task to the backlog.
3. Re-run validation and drift checks after the fix.
4. Record any unresolved policy conflicts explicitly in the spec instead of hiding them.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
