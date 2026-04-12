---
title: "Research Prompt: Memory Refactor vs Deprecation"
description: "Deep research prompt for cli-codex GPT 5.4 high fast. Investigates whether the current memory system adds genuine value or is redundant with spec kit documentation, and explores refactor/deprecation/replacement alternatives."
trigger_phrases:
  - "memory refactor research"
  - "memory deprecation investigation"
  - "memory vs spec kit docs"
  - "memory system value assessment"
  - "017 memory refactor"
importance_tier: "important"
contextType: "research"
target_runtime: "cli-codex gpt-5.4 high fast"
follows_skill: "sk-deep-research v1.5.0"
---

# Research Prompt: Memory Refactor vs Deprecation

## HOW TO USE THIS PROMPT

This file is designed to seed an autonomous deep research session via `/spec_kit:deep-research`, OR to be handed directly to a cli-codex GPT 5.4 high fast delegation as a self-contained investigation brief.

**Option A — autonomous deep research loop:**
```
/spec_kit:deep-research:auto "Memory refactor vs deprecation — is the current memory system genuinely valuable, or redundant with spec kit docs? Investigate alternatives: wiki-style spec updates, handover-only, findings-only, or full deprecation." --spec-folder .opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-memory-refactor-or-deprecation --max-iterations 12 --convergence 0.05
```

**Option B — single-shot cli-codex delegation:**
```bash
codex exec \
  --model gpt-5.4 \
  -c model_reasoning_effort="high" \
  -c service_tier="fast" \
  --full-auto \
  "$(cat .opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-memory-refactor-or-deprecation/research-prompt.md)"
```

The body below is structured to match the sk-deep-research strategy template so it can either seed the loop OR stand alone as a Codex investigation brief.

---

## 1. TOPIC

**Should the current Spec Kit Memory system be deprecated, refactored, or replaced — and what is the right replacement architecture given that we already maintain rich, structured spec kit documentation?**

The working hypothesis from the user is that current memory files are barebones, low-value, and largely redundant with existing spec kit documentation (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`, `handover.md`, `research/research.md`). If that hypothesis holds, the investigation should propose a concrete replacement architecture — not just say "deprecate."

---

## 2. KEY QUESTIONS

Use these as the initial strategy key questions. The research loop (or Codex delegation) should answer them in order and record evidence for each.

- [ ] **Q1. Current memory system — what does it actually do right now?**
  Map the full data flow: `memory_save` → `generate-context.js` → markdown file → MCP indexer → vector DB → `memory_search` / `memory_context`. Identify every consumer and producer. Document the real value delivered vs the intended value.

- [ ] **Q2. Value assessment — are the memories themselves useful?**
  Given phase 004 produced 149 "compliant" memories and phase 005 found 562 deeper quality defects (broken provenance, empty causal links, n-gram trigger noise, title corruption), is the stored content actually informative? Sample 20 real memories and assess: can a future session reconstruct useful context from these, or would they be better served by reading the spec folder directly?

- [ ] **Q3. Redundancy with spec kit documentation — how much overlap?**
  For each memory section (continue-session, project-state-snapshot, detailed-changes, decisions, recovery-hints, metadata), identify the corresponding content in spec kit docs. Quantify overlap. Which memory sections are truly unique vs duplicating existing docs?

- [ ] **Q4. Retrieval value — does MCP search on memories actually work?**
  Run 10 realistic "resume previous work" queries against the current memory DB. Measure: precision, recall, ranking quality, time-to-useful-context. Compare against an alternative: searching spec kit docs directly with CocoIndex + Grep. Which returns more actionable context per query?

- [ ] **Q5. Alternative architectures — what are the options?**
  Evaluate at least 5 concrete alternatives:
  - **A. Status quo** — keep memories as-is, invest in generator fixes from phase 005 findings
  - **B. Minimal memory** — only save memories for critical decisions / handovers, deprecate episodic session captures
  - **C. Wiki-style spec kit updates** — `memory_save` updates `decision-record.md` / `implementation-summary.md` in place instead of creating new memory files
  - **D. Handover-only** — replace memory saves with structured `handover.md` files when a session ends
  - **E. Findings-only** — memories become research findings appended to `research/research.md`
  - **F. Full deprecation** — remove memory MCP, rely on spec kit docs + CocoIndex semantic search

- [ ] **Q6. Migration path — if we deprecate, what happens to the 153 existing memories?**
  Options: bulk-convert to spec kit sections, archive in a frozen tier, export and delete, or keep as read-only historical records. Each option has different cost and risk profiles.

- [ ] **Q7. Integration impact — what breaks if memory is deprecated?**
  Identify every tool, command, agent, and workflow that depends on `memory_save`, `memory_search`, `memory_context`, `memory_match_triggers`, `session_bootstrap`, `session_resume`. Estimate migration cost per dependency.

- [ ] **Q8. Recommendation — what should we actually do?**
  Based on Q1-Q7, produce a decision recommendation with: chosen architecture, justification, phased migration plan, effort estimate, and rollback strategy. The recommendation must be specific enough to convert into a phase-018 implementation packet.

---

## 3. NON-GOALS

- **Do NOT redesign the generator** — this is an investigation, not implementation. Phase 005 handles generator bug root-causing; this phase handles the architectural decision.
- **Do NOT modify the 153 existing memory files** — they are the baseline corpus being evaluated. Read-only.
- **Do NOT touch MCP server code** — investigation only reads source; no edits.
- **Do NOT run an overnight convergence loop without budget** — cap at 12 iterations max, stop at convergence < 0.05.
- **Do NOT rewrite spec kit templates** — if the recommendation is to route memory content into spec kit docs, design the routing rules but leave template changes for a follow-up.
- **Do NOT make the decision unilaterally** — present 2-3 ranked options with trade-offs; the user picks the final direction.

---

## 4. STOP CONDITIONS

Stop the research loop when ANY of these are met:

1. **All 8 key questions answered** with cited evidence for each — hard stop, move to synthesis.
2. **Convergence below 0.05** for 2 consecutive iterations (sk-deep-research default) — diminishing returns, move to synthesis.
3. **12 iterations reached** — budget limit, synthesize with whatever is answered.
4. **Architectural deadlock** — if the 5 alternatives can't be ranked because data is missing and not recoverable, halt and report the blocker to the user.
5. **Recommendation drafted and defensible** — once Q8 produces a recommendation with evidence for each choice, stop even if other questions remain open.

---

## 5. KNOWN CONTEXT (seed data)

### Predecessor Work

- **Phase 004 — `004-memory-retroactive-alignment/`** (Complete): Retroactively patched 149 memory files to v2.2 structural compliance. Fixed 83 surface findings (bad titles, TBD placeholders, no-decisions blocks, truncation markers). Used Codex GPT 5.4 high fast for the bulk pass.

- **Phase 005 — `005-memory-deep-quality-investigation/`** (Draft, investigation-only): Deep audit found 562 findings across 16 categories pointing to generator-level bugs:
  - 123 files with empty causal_links despite body cross-references (causal graph disconnected)
  - 113 files with overlapping n-gram trigger_phrases (retrieval noise)
  - 109 files with empty `_sourceTranscriptPath` / `_sourceSessionId` (provenance broken)
  - 44 files with `captured_file_count >= 5` but `git_changed_file_count = 0` (git tracking broken)
  - 37 files with titles ending in `[full/spec/path]` (title corruption)
  - Plus 12 more categories

The scale and pattern of these bugs is what prompted THIS investigation: if the generator has systemic defects, maybe the right move isn't to fix it but to replace it.

### Current Memory System Entry Points

| Surface | Purpose | File Path |
|---------|---------|-----------|
| `memory_save` MCP tool | Save session context | MCP server |
| `generate-context.js` CLI | Build markdown from JSON input | `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` |
| `memory_search` MCP | Semantic search | MCP server |
| `memory_context` MCP | Intent-aware retrieval | MCP server |
| `memory_match_triggers` MCP | Fast trigger-phrase matching | MCP server |
| `session_bootstrap` / `session_resume` MCP | Session continuity | MCP server |
| `/memory:save` slash command | User-facing save | `.opencode/command/memory/save.md` |
| `/spec_kit:resume` | Recovery via memory | `.opencode/command/spec_kit/resume.md` |

### Current Spec Kit Documentation Structure

Every spec folder already contains (at Level 2+):
- `spec.md` — problem, scope, requirements, success criteria
- `plan.md` — technical approach, phases, architecture
- `tasks.md` — task breakdown with status
- `checklist.md` — verification items with evidence
- `implementation-summary.md` — completion evidence written after implementation
- `decision-record.md` (L3+) — architecture decisions with rationale
- `research/research.md` — progressive synthesis from deep research loops
- `handover.md` — session continuation notes (optional)
- `memory/*.md` — the current memory files being evaluated

**The overlap question:** when `/memory:save` writes a file to `memory/`, what fraction of its content is NOT already derivable from the 8 docs above?

### Sample Memories to Inspect

Start with these concrete examples (a mix across tiers and ages):

- `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/27-02-26_19-03__sprint-1-3-impl-27-agents.md` — 622 lines, quality_score 1.0, rich content
- `.opencode/specs/skilled-agent-orchestration/z_archive/017-cmd-create-prompt/memory/01-03-26_14-44__create-prompt-command.md` — 582 lines, deprecated z_archive, empty metadata block
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_17-09__new-phase-inside-016-release-alignment-for.md` — the memory from this session's planning work
- Three random Tier B files from phase 004's audit (quality_score 0.50-0.79)
- Two files flagged in phase 005 for multiple deep findings

### Comparable Systems to Reference

Do NOT spend budget on external research unless directly relevant. But briefly consider:
- How does AGR (autoresearch) handle session state? (`external/` under 026 research)
- How does Claude Code's `/memory:add` work? (lightweight bullet-point memory, not structured files)
- How does Cursor handle session context? (rules-based, not memory files)
- How do wiki systems (Obsidian, Notion) handle "session notes"?

---

## 6. DELIVERABLES

The research session must produce these artifacts inside the 017 spec folder:

1. **`research/research.md`** — progressive synthesis written across iterations; finalized at synthesis phase. Structure:
   - Executive summary (2 paragraphs max)
   - Answers to Q1-Q8 with evidence
   - Ranked alternatives table
   - Recommended direction with justification
   - Phased migration plan
   - Open risks

2. **`findings/redundancy-matrix.md`** — table mapping each memory section to the spec kit doc that covers the same content. Include a "unique to memory" column.

3. **`findings/retrieval-comparison.md`** — table of the 10 test queries run against (a) memory MCP and (b) spec kit + CocoIndex. Columns: query, memory-search result, cocoindex result, which was better, why.

4. **`findings/alternatives-comparison.md`** — detailed comparison of options A-F across dimensions: cost, risk, value, migration effort, rollback cost.

5. **`findings/integration-impact.md`** — list of every tool/command/agent that depends on memory MCP, with migration effort per dependency.

6. **`recommendation.md`** — one-page executive decision doc:
   - Recommended architecture (1 sentence)
   - Why (3 bullets)
   - What changes (5 bullets max)
   - Phased rollout (3 phases max)
   - Decision requested from user (yes/no + which option)

7. **`phase-018-proposal.md`** — draft spec for the follow-up implementation phase that acts on the recommendation.

---

## 7. EVIDENCE STANDARDS

For every claim in the research output:

- **Code claims**: cite `file_path:line_number` (e.g., `generate-context.js:245`)
- **Memory content claims**: cite the specific memory file path and section
- **Spec kit doc claims**: cite the spec folder + file + anchor
- **External references**: cite URL or paper title
- **Uncertainty**: use `[I'M UNCERTAIN ABOUT THIS: ...]` marker and explain why
- **Fabrication guard**: if data is missing, say "UNKNOWN" rather than guess

---

## 8. INVOCATION RULES (for cli-codex single-shot)

If you're running this as a single-shot Codex delegation rather than the full deep-research loop:

1. **Spec folder**: Pre-approved. Do not ask Gate 3. Write all outputs under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-memory-refactor-or-deprecation/`.
2. **Read-only scope**: Do not modify any memory files, generator code, MCP code, or spec kit templates. Only write to the 017 spec folder.
3. **Budget**: Cap at ~30 minutes of wall-clock work. If you can't finish all deliverables, prioritize the recommendation doc and mark the rest as TODO.
4. **Tool use**: Read, Grep, Glob, Bash (for find/wc/jq). No file edits outside 017. No git pushes.
5. **Quality over completeness**: Better to answer Q1-Q5 with strong evidence than Q1-Q8 with weak evidence.
6. **If blocked**: Stop and write a `blockers.md` file explaining what's missing. Do not invent data.

---

## 9. INITIAL RESEARCH ACTIONS (iteration 1 seed)

Start here if you're running the deep-research loop — otherwise feel free to replan:

1. Read `.opencode/skill/system-spec-kit/scripts/src/memory/generate-context.ts` (or `.js`) end-to-end to map the generator pipeline.
2. Read 5 sample memory files listed in Section 5 to see real content, then compare section-by-section to the spec kit docs in the same spec folders.
3. Run 3 realistic "resume previous work" queries against the memory MCP (use `memory_context` or `memory_search` MCP calls) and capture the top-3 results per query.
4. Run the same 3 queries against CocoIndex search on the spec folder tree. Compare.
5. Based on findings, draft an initial redundancy matrix for one spec folder (pick `022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/`).
6. Write iteration-001.md with what you learned and what to investigate next.

---

## 10. OUT-OF-BOUNDS — HARD STOPS

- **Do NOT delete any file** — read-only investigation.
- **Do NOT commit to git** — leave the working tree dirty; the user will commit.
- **Do NOT call external APIs** that cost money without user approval (OpenAI, Anthropic API, etc., if billable).
- **Do NOT install new packages** — use what's already in the repo.
- **Do NOT write to any folder outside the 017 spec folder.**

---

## 11. SESSION METADATA

| Field | Value |
|-------|-------|
| Research topic | Memory refactor vs deprecation |
| Target runtime | cli-codex GPT 5.4 (high reasoning, fast tier) |
| Spec folder | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-memory-refactor-or-deprecation/` |
| Parent packet | `026-graph-and-context-optimization` |
| Predecessor phases | `004-memory-retroactive-alignment`, `005-memory-deep-quality-investigation` |
| Follows skill | `sk-deep-research v1.5.0` |
| Max iterations | 12 |
| Convergence threshold | 0.05 |
| Expected duration | 2-4 sessions (loop mode) or ~30 min (single-shot) |
