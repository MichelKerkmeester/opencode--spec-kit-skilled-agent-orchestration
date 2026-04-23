## Iteration 02
### Focus
Resume-order correctness: re-read the parent packet, Gate D packet, and the live resume handler/helper to compare the documented handover-first ladder with the shipped winner-selection logic.

### Findings
- The resume helper's own contract comment says the ladder prefers `handover.md`, then `_memory.continuity`, then canonical spec docs, but the implementation chooses whichever of handover or continuity has the newer timestamp when both exist. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:601-605`, `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:679-688`
- Gate D bootstrap messaging still tells operators that resume follows `handover.md -> _memory.continuity -> spec docs`, so the user-facing contract no longer matches the helper's freshness-winner behavior. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap-gate-d.vitest.ts:83-86`
- The dedicated resume-ladder tests intentionally lock in fresher continuity beating older handover, so the mismatch is shipped behavior rather than an accidental untested edge case. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/resume-ladder.vitest.ts:187-214`

### New Questions
- Should resume stay truly handover-first, or should the docs be rewritten around freshness-first arbitration?
- If continuity wins over handover, which artifact is supposed to carry operator stop-state authoritatively?
- Do session-resume payloads surface enough provenance for callers to tell when continuity displaced handover?
- Are any higher-level commands or skills depending on the older handover-first wording?

### Status
new-territory
