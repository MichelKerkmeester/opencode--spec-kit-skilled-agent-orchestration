# Iteration 004 — D4 Maintainability
## Dimension: Maintainability
## Focus: Assess clarity, template resilience, duplication risk, historical/current separation, and 021 alignment

## Findings
### P2-003: `spec.md` keeps required anchors but its supplemental sections are misnumbered and partially unanchored
- Severity: P2
- Dimension: maintainability
- File: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/spec.md:182-267
- Claim: The canonical spec still satisfies the core Level 2 anchors, but after `## 5. SUCCESS CRITERIA` it switches into unanchored supplemental material (`### Gap Analysis`, `### Reconciled Decisions`, `### Approach`) and then jumps from `## 6. RISKS & DEPENDENCIES` to `## 10. OPEN QUESTIONS`.
- Reality: A new reviewer can still follow the packet, but the numbering no longer forms a stable navigation contract; by comparison, 021 keeps its executive-summary anchor and contiguous numbered sections through `## 16. OPEN QUESTIONS` (`021/spec.md:39-52`, `170-226`, `373-374`).
- Evidence: `spec.md:182-252` introduces four `6.x`-style subsections plus additional unnumbered sections with no anchors; `spec.md:254-267` resumes numbered sections at `## 6` and `## 10`; `spec.md:293-299` adds `### Phase Navigation` outside the numbered flow.
- Impact: Future editors and reviewers cannot rely on section numbers or anchors to find the same concepts consistently, which makes cross-spec comparison, scripted navigation, and template upkeep more brittle than the 021 baseline.
- Fix: Either promote the post-success-criteria material into anchored, monotonic numbered sections that match the template conventions, or demote it into clearly labeled appendices so the main section numbering remains stable.

### P2-004: Mutable live-state facts are duplicated across all five canonical docs, so a simple surface change requires coordinated multi-file edits
- Severity: P2
- Dimension: maintainability
- File: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/spec.md:22-32
- Claim: The packet repeatedly restates the same mutable facts: 33 tools, 6 commands, `/memory:analyze` ownership, and the 2026-03-21 drift closeout.
- Reality: Those facts are not centralized. If the live surface changes again (for example, 33 -> 34 tools), maintainers must update at least the five canonical docs, and likely any derived review artifacts, to avoid recreating drift.
- Evidence: `spec.md:22-32,81-85,129-141,156-159,200-221`; `plan.md:26,43,56-57,73-74,81-92,108-112,203-204`; `tasks.md:54-63,76-78,92-101,141-143`; `checklist.md:44-58,77-79`; `implementation-summary.md:27-37,47-53,86-100` all restate the same current-truth values in slightly different forms.
- Impact: The packet is readable today, but it is not resilient to follow-on change: a one-line reality update fans out into at least five canonical file edits, which is exactly the kind of independently drifting duplication this spec was meant to retire.
- Fix: Centralize mutable live-state facts in one canonical snapshot/table (or generate them from a single source), and have the other docs reference that snapshot instead of re-encoding the counts and ownership narrative in every artifact.

## Files Reviewed
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/spec.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/plan.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/tasks.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/checklist.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/implementation-summary.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/scratch/deep-review-strategy.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/research/deep-research-state.jsonl
- .opencode/specs/02--system-spec-kit/021-spec-kit-phase-system/spec.md

## Summary
- New findings: P0=0 P1=0 P2=2
- Files reviewed: 8
- Dimension status: complete
- The 012 packet remains understandable to a new reviewer and still carries the required Level 2 anchors, but it is only moderately self-sustaining: `spec.md`'s numbering/anchor pattern is looser than 021's, and the same live-state facts are duplicated across the full canonical packet.
- Safe follow-on change cost is at least five canonical files (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) for any future count/ownership change, with additional review artifacts likely needing cleanup if they are treated as current references.
