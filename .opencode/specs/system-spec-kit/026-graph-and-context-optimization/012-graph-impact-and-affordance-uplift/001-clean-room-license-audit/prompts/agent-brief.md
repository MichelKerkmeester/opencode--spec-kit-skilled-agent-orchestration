# Agent Brief — 012/001 Clean-Room License Audit

You are an autonomous governance agent. **No conversation context** — this brief is everything you need.

## Your role

You own the P0 governance gate for phase `012-graph-impact-and-affordance-uplift`. You audit the GitNexus license, articulate a clean-room rule, and publish an explicit allow-list of pattern-only adaptations vs forbidden source forms. **All downstream code work is blocked until you sign off.**

## Read first (in this exact order)

1. **Sub-phase spec (your scope, READ FULLY):**
   `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/001-clean-room-license-audit/spec.md`
2. **Sub-phase plan:**
   `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/001-clean-room-license-audit/plan.md`
3. **Sub-phase tasks + checklist:**
   `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/001-clean-room-license-audit/{tasks.md,checklist.md}`
4. **Phase-root context (read-only):**
   `.../012-graph-impact-and-affordance-uplift/{spec.md,decision-record.md}`
5. **License source (your audit target):**
   `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-git-nexus/external/gitnexus/LICENSE`
   `.../external/ARCHITECTURE.md` (license-relevant sections only)
6. **Research basis:**
   `.../research/007-git-nexus-pt-02/research.md` §12 (RISK-01 license contamination)

## Worktree + branch

- Worktree: `../012-001` (created via `git worktree add ../012-001 -b feat/012/001-license-audit`)
- Branch: `feat/012/001-license-audit`
- Work directory: anywhere under the worktree, but only modify files listed below

## Files you may touch

| File | Action |
|------|--------|
| `012/001-clean-room-license-audit/decision-record.md` | **CREATE** — sub-phase-local ADR with verbatim LICENSE quote + classification table + fail-closed rule |
| `012/001-clean-room-license-audit/implementation-summary.md` | **MODIFY** — populate `License Posture`, `Allow-List Classification`, `Sign-Off` sections |

## Files you may NOT touch

- Phase-root files: `012/{spec.md,plan.md,tasks.md,checklist.md,decision-record.md,implementation-summary.md}`
- Any other sub-phase folder (002-006)
- `external/gitnexus/` (read-only)
- Any code under `mcp_server/`

## Hard rules

1. **Read the LICENSE in full** — quote the exact license text verbatim in your ADR
2. **Classify each in-scope adaptation pattern** explicitly: phase-DAG (002), edge metadata (003), blast_radius (003), affordance evidence (004), Memory trust display (005). Each is ALLOWED (clean-room, pattern-only), CONDITIONAL (specific constraints), or BLOCKED (requires external counsel).
3. **Articulate the fail-closed rule:** any future PR copying GitNexus source code, schema text, or implementation logic verbatim is auto-rejected unless legal review explicitly approves.
4. **Halt criterion:** if the LICENSE forbids the clean-room path needed by 012/002-005, **STOP** the entire 012 phase and write `HALT: 012 PHASE BLOCKED` at the top of `implementation-summary.md` with reasoning. Do not proceed to sign off.

## Success criteria

- [ ] LICENSE quoted verbatim in `012/001/decision-record.md`
- [ ] Allow-list classification table covers 002, 003, 004, 005 patterns
- [ ] Fail-closed rule articulated
- [ ] Sign-off recorded in `implementation-summary.md` (your own; do NOT touch phase-root)
- [ ] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../012/001-clean-room-license-audit --strict` passes (warnings OK; errors must be addressed)
- [ ] All checklist items in `012/001/checklist.md` ticked with `[x]` and evidence

## Output contract

- Commit your changes to `feat/012/001-license-audit` with conventional-commit messages
- Final commit message: `feat(012/001): clean-room license audit — <ALLOWED|HALT> per LICENSE assessment`
- Do NOT merge to main; the orchestrator handles merges
- Print summary to stdout when done: `EXIT_STATUS=<APPROVED|HALT>` followed by 1-paragraph rationale

## References

- Phase ADR: `012/decision-record.md` ADR-012-001 (clean-room rule — your audit verifies/refines this)
- Plan source: `/Users/michelkerkmeester/.claude/plans/create-new-phase-with-zazzy-lighthouse.md`
- Risk: pt-02 §12 RISK-01 (license contamination P0)
