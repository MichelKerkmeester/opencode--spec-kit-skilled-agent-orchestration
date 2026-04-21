# Iteration 003 - Traceability

Focus dimension: traceability

Files reviewed:
- `spec.md`
- `plan.md`
- `checklist.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`
- `scratch/phrase-boost-delta.md`
- `scratch/baseline-regression.json`
- `scratch/post-regression.json`
- `scratch/followup-post-regression.json`

## Findings

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| F004 | P1 | Spec docs and generated graph metadata point to `.opencode/skill/skill-advisor/...`, which does not exist in the current repo layout. The actual advisor is under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/...`. | `spec.md:54`, `spec.md:106`, `spec.md:107`, `implementation-summary.md:18`, `implementation-summary.md:78`, `graph-metadata.json:42`, `graph-metadata.json:53`, `skill_advisor.py:1154` |
| F005 | P1 | `graph-metadata.json` derives `status: planned` even though implementation summary, checklist, and completion metadata show the packet is complete. | `graph-metadata.json:40`, `implementation-summary.md:26`, `implementation-summary.md:49`, `checklist.md:125`, `description.json:11` |
| F007 | P2 | Checklist evidence index references `scratch/multi-word-inventory.md`, but the artifact is absent after cleanup. | `checklist.md:59`, `checklist.md:134`, `tasks.md:87` |
| F008 | P2 | `decision-record.md` is absent from the requested review corpus. Level 2 does not require it, so this is advisory. | Requested corpus; folder listing |

## Protocol Results

- `spec_code`: partial. Implementation behavior exists, but spec paths and line references are stale.
- `checklist_evidence`: partial. Most artifacts exist; one checked evidence artifact is absent and one checked claim overstates uplift evidence.

newFindingsRatio: 0.36
