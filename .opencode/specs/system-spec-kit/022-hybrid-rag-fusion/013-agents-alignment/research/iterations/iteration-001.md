# Iteration 001 — D1 Correctness

**Agent:** GPT-5.4 (high) via cli-copilot
**Dimension:** correctness
**Status:** complete
**Timestamp:** 2026-03-25T15:15:00Z

## Findings

### F-001 [P1] Stale family-count claim: 9 → 10
- **File:line:** spec.md:122, tasks.md:31, checklist.md:47
- **Evidence:** REQ-008, T004, CHK-020 all claim "9-file family counts." Live repo shows 10 files in every runtime family: base, chatgpt, claude, codex, gemini. The 10th agent (`deep-review`) was added during/before Pass 2.
- **Recommendation:** Update all references from 9 to 10.

### F-002 [P1] "Complete / validation PASS" no longer true
- **File:line:** spec.md:18, checklist.md:50, implementation-summary.md:18,77
- **Evidence:** Spec says `Status: Complete` and CHK-023 claims strict validation passed. Running `validate.sh --strict` exits 2 with SPEC_DOC_INTEGRITY errors: implementation-summary.md references scratch artifacts (review-report.md, iteration-001..004.md) that have been archived to `scratch/archive-pass2/`.
- **Recommendation:** Fix artifact path references or restore files; rerun validation.

### F-003 [P2] "25 agent files" claim internally inconsistent
- **File:line:** implementation-summary.md:16,110; tasks.md:89
- **Evidence:** Claims "content alignment across 25 agent files" but the file breakdown lists only orchestrate + speckit + deep-review × 5 runtimes = 15 files. No list of the other 10 files is provided.
- **Recommendation:** Correct to 15 or enumerate the full 25.

## Verified OK
- `deep-research` naming: no stale `research` agent files anywhere
- Codex lineage: all 10 `.codex/agents/*.toml` files say `Converted from: .opencode/agent/chatgpt/...`
- Gemini symlink: `.gemini -> .agents` confirmed
- description.json: folder path, ID, parent chain correct
- Agent names: identical 10-member set across all 5 runtimes
