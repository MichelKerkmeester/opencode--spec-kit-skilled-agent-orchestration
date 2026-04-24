# Deep-Research Iteration 1 — 002-continuity-memory-runtime audit

## YOUR ROLE
You are the deep-research LEAF executor for iteration 1 of an autonomous audit. You are a LEAF agent: do NOT dispatch sub-agents. Write ALL findings to files; never hold them only in memory.

## STATE SUMMARY (auto-generated)
- Segment: 1 | Iteration: 1 of 10
- Questions: 0/7 answered | Last focus: none yet
- Last 2 ratios: N/A → N/A | Stuck count: 0
- Next focus: Map the runtime surface area

## RESEARCH TOPIC
026 continuity-memory-runtime — correctness gaps, concurrency/race conditions, and doc-code drift across the parent packet (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/`) and its four direct children:
- `001-cache-warning-hooks/` — bounded Stop-path metadata handoff, transcript-identity + cache-token carry-forward, replay harness
- `002-memory-quality-remediation/` — D1–D8 repair train
- `003-continuity-refactor-gates/` — Gates A–F coordination
- `004-memory-save-rewrite/` — `/memory:save` planner-first default (`SPECKIT_MEMORY_SAVE_EXECUTE` opt-in)

## ITERATION 1 FOCUS

**Map the runtime surface area.** Produce a files × packets matrix. Enumerate every executable script, MCP tool, shared runtime module, CLI-invokable command, and hook runner that was introduced or modified by the four child phases under 002-continuity-memory-runtime. Use the child phases' spec.md / plan.md / tasks.md / implementation-summary.md + commit-lineage grep + filesystem walk to anchor which modules belong to which packet.

This iteration is orientation: subsequent iterations will walk specific slices of the matrix targeting Q1–Q7 below. DO NOT attempt to answer Q1–Q7 yet. Instead produce a complete, ranked inventory of files in scope so later iterations can target high-risk code first.

## KEY QUESTIONS (for later iterations — orientation only this run)
- Q1 Concurrency/race conditions in advisory-lock, sentinel-file, generation-bumping paths
- Q2 /memory:save planner-first routing table (code vs docs drift)
- Q3 Gates A–F enforcement (003-continuity-refactor-gates)
- Q4 D1–D8 remediation (landed in code vs only in docs/tests)
- Q5 Cache-warning hook transcript-identity + replay harness coverage
- Q6 Reducer / state rehydration schema agreement across children
- Q7 JSONL audit events emitted by live code vs documented events

## RESEARCH ACTIONS FOR THIS ITERATION (target 3–5; cap 12 tool calls)

1. Read each child packet's `spec.md` + `implementation-summary.md` and extract the "Files Changed" tables or equivalent inventory:
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/001-cache-warning-hooks/spec.md`
   - `.../001-cache-warning-hooks/implementation-summary.md`
   - `.../002-memory-quality-remediation/spec.md`
   - `.../002-memory-quality-remediation/implementation-summary.md`
   - `.../003-continuity-refactor-gates/spec.md`
   - `.../003-continuity-refactor-gates/implementation-summary.md`
   - `.../004-memory-save-rewrite/spec.md`
   - `.../004-memory-save-rewrite/implementation-summary.md`

2. Run `git log --oneline --name-only --since=2026-01-01 -- <packet-touched-path>` for the most-implicated module roots:
   - `.opencode/skill/sk-deep-research/`
   - `.opencode/skill/sk-deep-review/`
   - `.opencode/skill/system-spec-kit/mcp_server/`
   - `.opencode/skill/system-spec-kit/scripts/memory/`
   - `.opencode/skill/system-spec-kit/scripts/hooks/` (or wherever cache-warning hook scripts live — grep for "cache-warning" or "cacheWarn")

3. Grep for the distinctive markers of the four child phases:
   - `rg -n "planner-first|SPECKIT_MEMORY_SAVE_EXECUTE" --type md --type ts --type js --type json` — 004 surface
   - `rg -n "transcript[-_ ]?identity|cache[-_ ]?token.*carry[-_ ]?forward|pre_compact|precompact_hook|cache-warning" --type md --type ts --type js --type json` — 001 surface
   - `rg -n "gate[-_ ][a-f]|continuity[-_ ]refactor[-_ ]gate" --type md --type ts --type js` — 003 surface
   - `rg -n "D1[-_]|D2[-_]|D3[-_]|D4[-_]|D5[-_]|D6[-_]|D7[-_]|D8[-_]|memory[-_ ]quality[-_ ]remediation" --type md --type ts --type js` — 002 surface

4. Cross-check against `context-index.md` at the parent and use memory-context / code-graph status for structural hints when runtime is available.

5. (Optional if budget remains) Sample-read 1–2 files per packet to confirm ownership is real code, not only test fixtures.

## OUTPUT CONTRACT (THREE artifacts — post-dispatch-validator will fail without all three)

### 1. Iteration narrative markdown
Write to:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/002-continuity-memory-runtime-pt-01/iterations/iteration-001.md`

Structure (required headings):
- **Focus** — restate iteration goal in one sentence
- **Actions Taken** — numbered list of research actions (tool calls + what each returned)
- **Findings** — the files × packets matrix, ranked by risk. Use a markdown table with columns: `File Path | Packet (001/002/003/004/shared) | Kind (mcp-tool/script/shared-module/hook/CLI) | Risk bucket (H/M/L) | Reason`. Aim for 25–60 entries. Mark "shared" when a single module was modified by multiple child packets.
- **Questions Answered** — none expected this iteration (state "None — orientation only")
- **Questions Remaining** — all 7 key questions still open; for each, name 2–3 candidate files from the matrix that should be walked in a later iteration
- **Next Focus** — concrete plan for iteration 2 (one sentence, naming a single key question and its candidate file set)

### 2. Canonical JSONL iteration record
Append ONE line (single-line, valid JSON, no pretty-print) to:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/002-continuity-memory-runtime-pt-01/deep-research-state.jsonl`

Shape (exact):
```
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<thought|insight|evidence>","focus":"Map the runtime surface area — files × packets matrix","findingsCount":<int>,"timestamp":"<ISO-8601-Z>","sessionId":"dr-002cmr-20260423-200456","generation":1,"graphEvents":[/* optional */]}
```

Rules:
- `type` MUST be exactly `"iteration"` (NOT `iteration_delta`).
- `status`: use `"thought"` or `"insight"` for orientation iterations; `"evidence"` when actual findings land.
- `newInfoRatio`: your estimate for this iteration vs. the empty baseline; expect high (0.70–0.95) since this is the first orientation pass.
- `findingsCount`: number of distinct entries in the matrix table.
- `graphEvents` is optional here; you MAY emit one node per child packet (`{"type":"node","id":"packet-001-cache-warning-hooks","kind":"SOURCE","name":"001-cache-warning-hooks","iteration":1}`) to seed the coverage graph. Skip if uncertain.

Append using:
```bash
echo '<single-line-json>' >> .opencode/specs/.../deep-research-state.jsonl
```

### 3. Per-iteration delta file
Write to:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/002-continuity-memory-runtime-pt-01/deltas/iter-001.jsonl`

Content: one JSON record per line. MUST contain at least one `{"type":"iteration",...}` record (same as the state-log append). Additionally include:
- One `{"type":"observation",...}` record per child packet summarizing its inventory scope (e.g. "packet 001 owns N files under skill/system-spec-kit/...")
- One `{"type":"finding",...}` record per row you'd classify H-risk in the matrix (severity field: `"P1"` for H-risk, `"P2"` for M-risk; do NOT emit P2 yet unless you are very confident — this iteration is for orientation)
- One or more `{"type":"node",...}` and/or `{"type":"edge",...}` records if you emitted graphEvents above

Each record MUST include `"iteration":1` and use valid JSON on a single line.

## BUDGET & CONSTRAINTS
- Max 12 tool calls. Target 3–5.
- Max 15 minutes wall time.
- Read files only when you need them. Prefer batched `rg` or `git` over per-file `cat`.
- Do NOT modify production runtime code in this iteration.
- Do NOT answer Q1–Q7 yet; that is later-iteration work.
- `research.md` is NOT written in iteration 1; only the iteration file + JSONL + delta.

## WHEN DONE
Verify the three artifacts exist. Print a one-line status to stdout: `ITERATION_1_DONE: <findings_count> matrix rows, status=<status>, newInfoRatio=<n>`.
