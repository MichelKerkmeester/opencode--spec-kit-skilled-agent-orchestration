# Iteration 011 Review

Scope: `011-skill-alignment`, `012-command-alignment`, `013-agents-alignment`, `014-agents-md-alignment`, plus `011-skill-alignment/001-post-session-capturing-alignment` and the live runtime/docs needed to verify completion claims

Dimensions: `D5 Cross-Ref Integrity` + `D6 Patterns`

## Findings

### P1-001 [P1] `011`'s child packet points at the wrong parent and misroutes adjacent alignment ownership

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/001-post-session-capturing-alignment/description.json:14-17`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/001-post-session-capturing-alignment/spec.md:3,28-30`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/001-post-session-capturing-alignment/tasks.md:20-22`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-skill-alignment/001-post-session-capturing-alignment/checklist.md:5-7`
- Evidence: The child folder is structurally attached to `011-skill-alignment` (`description.json` parentChain ends in `011-skill-alignment`), but its human-facing docs say it was "superseded by parent 010 reconciliation passes" and keep verification evidence anchored to "parent 010."
- Evidence: Its out-of-scope routing is also phase-swapped: it says command files are handled by `011`, agent definitions by `012`, and AGENTS.md files by `013`, even though the neighboring packets establish `012` as command alignment, `013` as agent alignment, and `014` as AGENTS.md alignment.
- Risk: This child is an orphaned cross-reference in practice. Anyone using it to navigate the alignment sequence will be sent to the wrong parent and the wrong downstream packet owners.
- Recommendation: Either retire/archive this child with an explicit pointer to `011`, or rewrite its parent and sibling references so they match the actual `011 -> 012 -> 013 -> 014` sequence.

### P1-002 [P1] `012` still has internal completion-state drift, so its closeout signal is not auditable

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/spec.md:41-49`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/plan.md:41-45`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/tasks.md:139-144`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/checklist.md:95-104`
- Evidence: `spec.md` marks the packet `Complete (truth-reconciled)`, `tasks.md` marks all reconciliation work complete, and `checklist.md` shows `8/8` P0 and `10/10` P1 checks verified.
- Evidence: `plan.md` still leaves all three Definition-of-Done gates unchecked (`[ ]`), including the core claims that the canonical docs satisfy Level 2 sections, preserve the `33-tool / 6-command / /memory:analyze` story, and pass strict validation.
- Risk: Downstream packets cannot rely on `012` as a clean source-of-truth dependency because the packet still broadcasts both "done" and "not yet done" states.
- Recommendation: Reconcile `plan.md` with the rest of the packet, or reopen the packet consistently if those DoD items are intentionally no longer satisfied.

### P1-003 [P1] `013` claims the scoped runtime-doc closeout is complete even though Gemini write-agent routing still diverges

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-agents-alignment/tasks.md:41-46,54-58`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-agents-alignment/checklist.md:38-40,68-70`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-agents-alignment/implementation-summary.md:43-49,85-88`
  - `.gemini/agents/write.md:222`
  - `.claude/agents/write.md:221`
  - `.opencode/agent/chatgpt/write.md:230`
  - `.codex/agents/write.toml:211`
- Evidence: `tasks.md` marks `T009a` ("Reconcile ... the scoped write-agent projections") done, `T014` ("Re-read the scoped runtime-facing docs for path/routing consistency") done, and `checklist.md` says runtime path guidance is internally consistent.
- Evidence: The same packet's `implementation-summary.md` says the writer projection alignment is only partial and explicitly records a remaining divergence: Gemini `write.md` still uses flat `references/*.md` routing, while Claude, ChatGPT, and Codex use `references/**/*.md`.
- Evidence: The live files still match that limitation: `.gemini/agents/write.md` uses `references/*.md`, while the other three runtime/authoring-family files use the recursive `references/**/*.md` pattern.
- Risk: `013` over-claims scoped runtime-doc alignment. Release reviewers get a false "fully reconciled" signal for a runtime surface that still behaves differently by family.
- Recommendation: Either reopen the scoped write-agent closeout items in `013`, or narrow the packet/checklist claims so the Gemini divergence is explicitly treated as unresolved and out of scope.

### P1-004 [P1] `014` is still wired to a stale 7-command model that conflicts with both `012` and the current AGENTS tables

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/spec.md:22-32,81-85,156-159`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-agents-md-alignment/spec.md:24-35,42-48,112-115,125-126`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-agents-md-alignment/plan.md:29,39,42-45,102`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-agents-md-alignment/implementation-summary.md:14,34,118-120`
  - `AGENTS.md:51-52,62,65-67`
  - `AGENTS_example_fs_enterprises.md:73-74,88-91`
- Evidence: `012` defines the reconciled live memory surface as a **6-command** suite, with retrieval merged into `/memory:analyze`.
- Evidence: `014` still declares `012-command-alignment` the source of truth for a **7-command** suite, describes its own success as "7 memory command rows," and frames the AGENTS work around moving from 5 to 7 commands.
- Evidence: The current public AGENTS variants enumerate six command rows: `/memory:continue`, `/memory:save`, `/memory:manage`, `/memory:analyze`, `/memory:learn`, and `/memory:shared`.
- Evidence: `implementation-summary.md` also warns that the phase was partially reverted by later AGENTS restructuring, which makes the stale 7-command dependency even less trustworthy as a current alignment record.
- Risk: `014` no longer structurally matches the truth-reconciled pattern used by `011`-`013`, and its dependency on `012` is semantically broken even though the predecessor file path still resolves.
- Recommendation: Truth-reconcile `014` against `012` and the live AGENTS files, or explicitly archive it as superseded by later AGENTS restructuring.

## Sweep Notes

| Item | Current state | Notes |
|---|---|---|
| Top-level phase chain `011 -> 012 -> 013 -> 014` | Resolves on disk | The predecessor/successor file paths between the four top-level packets exist and form a continuous chain. |
| Structural level consistency | Mostly consistent | All four top-level packets declare `SPECKIT_LEVEL: 2`, but only `011`-`013` follow the newer truth-reconciled closeout pattern cleanly. |
| `011` child lineage | Broken | The child folder exists under `011`, but its content still points to "parent 010" and mislabels ownership of `012`/`013`/`014`. |
| Completion-claim integrity | Drifted | `012` and `013` both contain packet-internal status contradictions; `014` carries stale dependency/current-state claims against the now-live 6-command model. |

## Review Summary

- Files reviewed: all canonical docs for `011`, `012`, `013`, `014`; the `011` child packet; current public AGENTS files; and the scoped live runtime docs needed to verify `013` packet claims
- Overall assessment: `REQUEST_CHANGES`
- Main blockers: `011` child is orphaned from its real parent chain, `012` still reports both done and not-done states, `013` over-claims scoped writer-surface alignment, and `014` still depends on a stale 7-command story that conflicts with `012` and the current AGENTS tables
