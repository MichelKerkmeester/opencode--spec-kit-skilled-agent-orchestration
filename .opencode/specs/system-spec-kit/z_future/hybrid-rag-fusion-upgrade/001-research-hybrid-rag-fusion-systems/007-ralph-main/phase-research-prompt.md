# $refine TIDD-EC Prompt: 007-ralph-main

## 2. Role

You are a research specialist in git-aware continuity, lightweight shell-driven agent orchestration, append-only progress bridging, and non-authoritative run-state overlays. Work like a systems analyst who can separate durable memory architecture from orchestration-layer concerns, and turn Ralph's git-as-memory conventions into concrete improvements for `Code_Environment/Public`'s memory stack. Keep the analysis grounded in actual repository evidence, especially around git lineage embedding, `progress.txt`-style continuity artifacts, bridge-vs-archive memory boundaries, and fresh-agent-per-iteration loops.

## 3. Task

Research Ralph's git-aware continuity model, append-only progress bridge, bridge-vs-archive memory split, and fresh-agent-per-iteration pattern to identify practical memory-system improvements for `Code_Environment/Public`. Focus on how Ralph uses git lineage as durable context, how it separates an active execution bridge from archival memory, and where git-derived orientation should enter Public's bootstrap/resume flow. Compare Ralph's choices against current Public capabilities and classify each recommendation as `adopt now`, `prototype later`, or `reject`. Prioritize improvements that strengthen memory continuity, git-aware orientation, and save-authority boundaries without duplicating patterns already owned by Engram session summaries, MemPalace compaction hooks, or existing `sk-deep-research` externalized state.

## 4. Context

### System Description

Ralph is a minimal shell-driven agent loop centered on a single design claim: **git is the durable memory substrate**. The external repo is intentionally thin — `ralph.sh` drives the loop, `prompt.md` encodes the per-iteration prompt discipline, and `skills/` holds task-specific guidance. Instead of a database or structured memory backend, Ralph uses an append-only `progress.txt`-style artifact as an execution bridge between iterations, and relies on git lineage (commit hash, branch, HEAD diff) as the authoritative record of what has been done. Each iteration runs a fresh agent with no carried context — continuity comes from reading the bridge plus git state at the start of every turn.

The pattern has a strong memory-architecture claim hidden inside its shell simplicity: Ralph explicitly separates a **bridge** (lightweight, append-only, ephemeral) from an **archive** (the git history, durable and authoritative). Work in progress lives in the bridge; committed work lives in git. There is no second database and no long-lived agent state. Validation happens first in every iteration, before any new action is attempted, which anchors the loop to the last known-good state rather than to accumulated context.

### Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|-------------|-------------|-----------------|
| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 007 session summaries | Focus tool profiles, session lifecycle, topic keys |
| 002 | Mex | Markdown scaffold + drift detection | 007 no-DB pattern | Focus drift detection, scaffold structure |
| 003 | Modus Memory | FSRS spaced repetition + BM25 | — | Focus FSRS decay, cross-referencing |
| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) + compaction hook | 007 compaction timing | Focus RRF fusion, plugin architecture |
| 005 | MemPalace | Palace taxonomy + wake-up layers + hooks | 007 bootstrap orientation | Focus raw verbatim storage, wake-up L0-L3 |
| 006 | Babysitter | Replay-safe event journal + journal-head contract | 007 continuity bridge concept | Focus checksummed journal, nextActions |
| **007** | **Ralph** | **Git-as-memory + progress bridge + fresh-agent loop** | **001 session summaries, 004 compaction hook** | **Focus git lineage embedding, bridge-vs-archive, run-state overlay** |
| 008 | Xethryon | Deferred reconsolidation + bootstrap orientation | 007 git-aware bootstrap | Focus AutoDream cadence, continuity synopsis |

### What This Repo Already Has

`Code_Environment/Public` already has externalized deep-research state via `sk-deep-research` (JSONL + strategy.md + iteration files), memory save authority via `generate-context.js`, session continuity via `memory_context`, trigger-based recall via `memory_match_triggers`, causal links, and extensive hook infrastructure. It also has `sk-git` for worktree/commit/finish workflows and `@handover` for session handover documents. What it does **not** currently have is a first-class git-lineage embedding convention for saved memories (commit hash, branch, HEAD diff as metadata), a lightweight append-only progress artifact separate from the JSONL state log, or an explicit bridge-vs-archive split in the save authority boundary. It also does not make git state a standard part of the bootstrap/resume payload.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/007-ralph-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
2. Read the governing `AGENTS.md` files first: the Public repo root `AGENTS.md` and `external/AGENTS.md`. Also read `external/CLAUDE.md` if present.
3. Follow this reading order for domain evidence: `external/prompt.md` (the authoritative per-iteration prompt), then `external/ralph.sh` (the shell loop driver), then `external/README.md`, then `external/skills/`, then `external/flowchart`/`ralph-flowchart.png` text references only as supporting context. Ralph's repo is small and shell-centric — read everything that is not an image.
4. Trace the per-iteration prompt discipline in `external/prompt.md`: what does the agent read first, how is git state referenced, what counts as validation, what goes into `progress.txt`-style artifacts, and where is the bridge-vs-archive split enforced.
5. Trace the shell loop in `external/ralph.sh`: how are iterations started, how is the fresh context enforced, how does git lineage get captured per iteration, and what prevents state from leaking across turns.
6. Compare Ralph's patterns against Public's actual stack: `sk-deep-research` externalized state contract, `@handover` handover docs, `sk-git` worktree/commit flows, `memory_context` resume behavior, `generate-context.js` save authority, `session_bootstrap` startup, and any relevant hook infrastructure.

### 5.1 Deep Research Contract (aligned with sk-deep-research v1.5.0.0 / post-042)

This is a **20-iteration deep research run** via `codex-cli gpt-5.4 high` (fast service tier). Every iteration MUST produce a markdown file at `research/iterations/iteration-NNN.md` with EXACTLY these sections in order:

```markdown
# Iteration NNN: [Focus Area]

## Focus
[What this iteration investigated]

## Findings
### Finding N: [Title]
- **Source**: exact file path [SOURCE: path:line]
- **What it does**: technical description
- **Why it matters**: relevance to Public's memory stack
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
- **Source strength**: primary / secondary / tentative

## Sources Consulted
- [file:line references]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]
- Novelty justification: [1-sentence explanation of what newInfoRatio represents]

## Ruled Out
- [approaches eliminated and why, with evidence]

## Dead Ends
- [exhausted approaches that should not be retried]

## Reflection
- What worked: [approach + causal explanation]
- What did not work: [approach + root cause]
- What I would do differently: [specific adjustment for next iteration]

## Recommended Next Focus
[What to investigate next, based on gaps discovered]
```

Every iteration MUST append a JSONL record to `research/deep-research-state.jsonl` with these fields (per state_format.md):
- `type: "iteration"`, `run: N`, `status: "complete"|"timeout"|"error"|"stuck"|"insight"|"thought"`
- `focus`, `findingsCount`, `newInfoRatio` (0.0-1.0)
- `keyQuestions`, `answeredQuestions` (arrays)
- `noveltyJustification` (human-readable breakdown)
- `ruledOut` array of `{approach, reason, evidence}` objects
- `sourceStrength` classification
- `timestamp`, `durationMs`

Respect the quality guards before claiming convergence: **source_diversity** (≥2 sources per question), **focus_alignment** (new findings align with original key questions), **single_weak_source_dominance** (block STOP if any question depends on a single tentative source).

Do NOT write to `deep-research-dashboard.md` or `findings-registry.json` — those are reducer-owned and generated post-run by `node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs`.

### 5.2 Research topic

Use this exact deep-research topic:

```text
Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/007-ralph-main/external and identify concrete memory-system improvements for Code_Environment/Public, especially around git-as-memory lineage embedding, append-only progress bridges, bridge-vs-archive save boundaries, non-authoritative run-state overlays, and fresh-agent-per-iteration continuity.
```

### 5.3 Validation + memory save

Save memory for this phase folder when research is complete with:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/007-ralph-main"
```

## 6. Research Questions

1. Which git lineage fields (commit hash, branch, HEAD diff summary, author, timestamp) are actually useful to embed in saved memory, and which are noise?
2. Should a `progress.txt`-style append-only artifact be per packet, per worktree, or per session — and where in Public's existing spec-folder / memory model does it fit without duplicating JSONL state?
3. How should a non-authoritative run-state overlay relate to `handover.md` and archival memory, and what prevents it from becoming a second shadow authority?
4. When should git-derived context appear automatically at resume/bootstrap (e.g., `session_bootstrap`) vs on demand via an explicit tool?
5. How does Ralph's "fresh agent per iteration" loop compare to Public's `sk-deep-research` LEAF dispatch pattern — what's genuinely new, what's identical, what's different enough to matter?
6. What is the cost/value of Ralph's validation-first discipline (validate before any action) vs Public's existing plan→implement→complete flow?
7. Is Ralph's bridge-vs-archive memory split applicable to Public's memory save authority boundary, and where would it live (hook, skill, generate-context flag)?
8. Which Ralph patterns are orchestration-layer concerns (deep-loop runners, hook system) vs memory-architecture concerns (save authority, retrieval, lineage) — scope triage the findings.
9. How does Ralph's prompt discipline in `prompt.md` compare to Public's existing `phase-research-prompt.md` + `sk-deep-research` contract, and can anything port across?
10. Which Ralph ideas are foundational memory-system contributions vs stylistic or packaging decisions that Public should not over-copy?

## 7. Do's

- Do read `external/prompt.md` and `external/ralph.sh` end-to-end before inferring any architecture claim.
- Do verify every "git-as-memory" claim with an actual line reference in the shell script or prompt.
- Do treat the bridge-vs-archive split as the main architectural question, not the shell-script ergonomics.
- Do look for where git commands are invoked — what does Ralph actually capture from git per iteration?
- Do map every finding to a concrete target file in Public (`.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `@handover` contract, etc.).
- Do keep the "is this novel vs already-owned" triage sharp — Ralph overlaps with several existing phases and with existing Public infrastructure.
- Do note which recommendations are additive (new fields, new optional hooks) vs invasive (changing save authority).

## 8. Don'ts

- Do not treat Ralph's shell scripting style or bash idioms as the interesting part — the memory architecture claim is what matters.
- Do not recommend adopting Ralph's loop runner wholesale; Public already has `sk-deep-research` LEAF dispatch.
- Do not confuse Ralph's PRD-decomposition pattern with a memory feature — it is a planning concern.
- Do not over-recommend git-as-memory if it duplicates what `sk-git` already does for worktree/commit flows.
- Do not propose a second durable memory authority; Ralph's contribution is additive metadata + lightweight bridge, not a replacement for `generate-context.js`.
- Do not edit anything under `external/` or outside this phase folder.

## 9. Examples

### Example A: Git lineage embedding finding

```text
**Finding: Embed git HEAD metadata into every saved memory**
- Source: external/prompt.md:L[line]; external/ralph.sh:L[line]
- What it does: Ralph captures commit hash, branch, and diff summary at the start of every iteration and uses them as durable context markers.
- Why it matters: Public's `generate-context.js` currently saves memories without standardized git lineage fields, which loses provenance when a memory is recalled across branches or worktrees.
- Recommendation: adopt now
- Affected area: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` FILES/META fields
- Impact: medium (additive metadata, no schema break)
- Source strength: primary
```

### Example B: Progress bridge finding

```text
**Finding: Append-only progress bridge separate from state log**
- Source: external/prompt.md:L[line]; external/ralph.sh:L[line]
- What it does: Ralph uses `progress.txt` as a lightweight execution bridge distinct from any durable memory — iteration agents read it first to orient, then append one line at end of turn.
- Why it matters: Public's `sk-deep-research` already uses JSONL as the durable state log; a separate shorter bridge artifact could reduce the reader-side parse cost of full JSONL on every iteration.
- Recommendation: prototype later
- Affected area: `.opencode/skill/sk-deep-research/references/state_format.md` (potential new artifact)
- Impact: low-medium (optional additive artifact)
- Source strength: primary
```

## 10. Constraints

### Error Handling

- If a file path referenced in Ralph's prompt or shell script does not exist in the checkout, document the actual paths present and continue with source-backed analysis.
- If Ralph's prompt makes an architectural claim that the shell script does not actually implement, mark it as "documented but not implemented" and treat it as unverified.
- If a design appears ambiguous between orchestration concern and memory concern, make the scope-triage call explicit in the finding.

### Scope

**IN SCOPE**

- git-lineage embedding into saved memory
- append-only progress bridge artifacts
- bridge-vs-archive memory split
- non-authoritative run-state overlays
- fresh-agent-per-iteration continuity patterns
- validation-first loop discipline (where it touches memory state)
- bootstrap/resume integration of git state

**OUT OF SCOPE**

- Ralph's shell-script ergonomics or bash idioms
- PRD decomposition as a planning feature (not memory-related)
- Claude Code CLI vs other CLIs — distribution concerns
- Performance micro-optimization of the loop driver
- Any runtime-specific (claude/codex/opencode) packaging detail

### Prioritization Framework

Rank findings in this order: git-lineage embedding value, bridge-vs-archive architectural leverage, bootstrap/resume integration, validation-first impact on memory correctness, overlap triage with Engram/Xethryon/Babysitter/MemPalace, and scope triage between orchestration concerns and memory concerns.

## 11. Deliverables

- `research/iterations/iteration-001.md` through `iteration-020.md` each matching the canonical sk-deep-research section structure (Focus / Findings / Sources / Assessment / Ruled Out / Dead Ends / Reflection / Recommended Next Focus)
- `research/deep-research-state.jsonl` with one config record + 20 iteration records + synthesis_complete event, all with required 042 fields (`noveltyJustification`, `ruledOut`, `sourceStrength`)
- `research/research.md` as the canonical synthesis report with at least 5 evidence-backed findings
- Every nontrivial finding cites an exact Ralph file path (and optionally line number)
- Explicit scope triage per finding: memory-architecture vs orchestration vs hybrid
- Explicit comparison against current Public memory capabilities, especially `generate-context.js`, `session_bootstrap`, `sk-deep-research` state, `sk-git`, `@handover`
- Memory saved from this exact phase folder using `generate-context.js`

## 12. Evaluation Criteria

- At least 5 findings are evidence-backed with file path citations, not speculative
- Findings clearly distinguish Ralph's genuinely new contributions (git-lineage, bridge-vs-archive) from ideas already owned by other phases
- Recommendations explicitly say `adopt now`, `prototype later`, `reject`, or `NEW FEATURE`
- Cross-phase overlap with 001 (Engram summaries), 004 (Mnemosyne compaction), 005 (MemPalace hooks), 006 (Babysitter journal), and 008 (Xethryon bootstrap) is acknowledged
- Every iteration file matches the canonical sk-deep-research section structure and appends a valid JSONL record
- The finished prompt is RICCE-complete and produces a CLEAR-aligned research output ≥ 40/50

## 13. Completion Bar

- `phase-research-prompt.md` exists in this phase folder and is specific to Ralph rather than generic git-as-memory research
- All 20 iteration files exist at `research/iterations/iteration-001.md` through `iteration-020.md`
- `research/deep-research-state.jsonl` contains a config record + 20 iteration records + final event
- `research/research.md` synthesis exists and cites iteration sources
- Quality guards (source_diversity, focus_alignment, no_single_weak_source) pass before STOP
- Ruled-out directions are captured explicitly in iteration files and flow into `research/research.md`
- No edits are made outside this phase folder
