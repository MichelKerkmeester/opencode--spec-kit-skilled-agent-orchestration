# Deep-Research Iteration 003 — Angle A3: Resource leaks across mcp_server

You are the deep-research LEAF agent for iteration 003 of 20. The packet root is `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/046-system-deep-research-bugs-and-improvements/`.

**Workflow position**: Iteration 003 of 20. Convergence threshold: 0.01. Executor: yourself (cli-codex gpt-5.5 high, normal speed).

## Focus

**Angle A3 — Resource leaks across mcp_server**

Audit long-running paths for resource leaks: (a) FD leaks (open file handles not closed on error/throw paths), (b) unbounded memory growth (caches without TTL or size cap, watcher arrays that grow without prune), (c) subprocess zombies (spawn without await/close handling). Look at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/`, `mcp_server/code_graph/lib/`, and `mcp_server/lib/`. Cite specific allocators and their cleanup sites with file:line.

**Cite specific function names + line numbers.** A finding is only valid if it points to `path/file.ext:LINE` or `path/file.ext:LINE-LINE`.

## Method

1. Use `rg` / shell `grep` to enumerate the relevant files. Read each file fully if small; use `sed -n 'A,Bp'` for slices on large files.
2. Trace the relevant code paths and concrete examples.
3. For each potential issue, verify it by reading the surrounding context (don't trust grep matches alone).
4. Maximum 12 tool calls; aim for 5-10.
5. Prefer reading checked-in source over compiled `dist/` outputs unless the question is about build separation.

## Required Outputs (THREE files — all MUST be produced)

### 1. Iteration narrative — write to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/046-system-deep-research-bugs-and-improvements/research/iterations/iteration-003.md`

Markdown structure:

```markdown
# Iteration 003 — A3: Resource leaks across mcp_server

## Focus
[1-2 sentences on what you investigated]

## Actions Taken
[Bulleted list: which files read, which searches run]

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-003-A3-01 | P0/P1/P2/none | path/file.ext:LINE | What's wrong | What to do |

## Questions Answered
[Which sub-questions of A3 did this iteration answer?]

## Questions Remaining
[Open A3 questions for follow-on packets]

## Next Focus
[What angle/area would benefit from a follow-on iteration]
```

If you find zero issues, still produce the file with a `Findings: NO_FINDINGS` section and method notes documenting WHY the audit produced no findings (so synthesis knows it's not stale).

### 2. Per-iteration delta JSONL — write to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/046-system-deep-research-bugs-and-improvements/research/deltas/iter-003.jsonl`

One JSON record per line. MUST start with the canonical iteration record:

```json
{"type":"iteration","iteration":3,"newInfoRatio":0.85,"status":"insight","focus":"A3: Resource leaks across mcp_server","angle":"A3"}
```

Then one `{"type":"finding",...}` record per finding:

```json
{"type":"finding","id":"f-iter003-001","severity":"P1","label":"<short label>","file":"path/file.ext","line":NN,"iteration":3,"angle":"A3"}
```

The first record's `type` MUST be exactly `"iteration"` (not `"iteration_delta"`). Use `newInfoRatio` between 0 and 1.

### 3. State log append — append the iteration record to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/046-system-deep-research-bugs-and-improvements/research/deep-research-state.jsonl`

Append exactly one line — the same `{"type":"iteration",...}` record from step 2. Use `printf '%s\n' '<json>' >> path`. If the sandbox blocks this append, the driver script replays it from the delta file.

## Constraints

- **LEAF agent**: do NOT spawn sub-agents. Do all work yourself.
- **Read-only on product code**: do NOT modify any files outside the iteration narrative + delta + state log.
- **Citation discipline**: every finding needs `file:LINE` evidence.
- **Severity calibration**: P0 = production bug with user impact; P1 = real bug masked by tests/luck; P2 = code-smell with potential future impact; none = no issue, just a method note.
- **File:line format**: `path/from/repo/root.ext:LINE`.
- **Token budget**: keep iteration narrative under ~2000 words.

Begin now. End by confirming all three files exist via `ls` or `stat`.
