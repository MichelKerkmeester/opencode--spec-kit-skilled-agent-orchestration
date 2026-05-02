#!/usr/bin/env bash
# gen_prompts.sh — generate iteration-NNN.md prompt packs for all 20 angles
set -uo pipefail

PACKET_REL=".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/046-system-deep-research-bugs-and-improvements"
PROMPTS_DIR="${PACKET_REL}/research/prompts"
mkdir -p "${PROMPTS_DIR}"

# Define each angle: NNN | ANGLE_ID | TITLE | FOCUS_BODY (multi-line via heredoc-tag-marker)
gen() {
  local NNN="$1" AID="$2" TITLE="$3"
  shift 3
  local BODY="$*"
  local ITER_INT="$(echo "${NNN}" | sed 's/^0*//')"
  [[ -z "${ITER_INT}" ]] && ITER_INT=0
  cat >"${PROMPTS_DIR}/iteration-${NNN}.md" <<EOF
# Deep-Research Iteration ${NNN} — Angle ${AID}: ${TITLE}

You are the deep-research LEAF agent for iteration ${NNN} of 20. The packet root is \`${PACKET_REL}/\`.

**Workflow position**: Iteration ${NNN} of 20. Convergence threshold: 0.01. Executor: yourself (cli-codex gpt-5.5 high, normal speed).

## Focus

**Angle ${AID} — ${TITLE}**

${BODY}

**Cite specific function names + line numbers.** A finding is only valid if it points to \`path/file.ext:LINE\` or \`path/file.ext:LINE-LINE\`.

## Method

1. Use \`rg\` / shell \`grep\` to enumerate the relevant files. Read each file fully if small; use \`sed -n 'A,Bp'\` for slices on large files.
2. Trace the relevant code paths and concrete examples.
3. For each potential issue, verify it by reading the surrounding context (don't trust grep matches alone).
4. Maximum 12 tool calls; aim for 5-10.
5. Prefer reading checked-in source over compiled \`dist/\` outputs unless the question is about build separation.

## Required Outputs (THREE files — all MUST be produced)

### 1. Iteration narrative — write to \`${PACKET_REL}/research/iterations/iteration-${NNN}.md\`

Markdown structure:

\`\`\`markdown
# Iteration ${NNN} — ${AID}: ${TITLE}

## Focus
[1-2 sentences on what you investigated]

## Actions Taken
[Bulleted list: which files read, which searches run]

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-${NNN}-${AID}-01 | P0/P1/P2/none | path/file.ext:LINE | What's wrong | What to do |

## Questions Answered
[Which sub-questions of ${AID} did this iteration answer?]

## Questions Remaining
[Open ${AID} questions for follow-on packets]

## Next Focus
[What angle/area would benefit from a follow-on iteration]
\`\`\`

If you find zero issues, still produce the file with a \`Findings: NO_FINDINGS\` section and method notes documenting WHY the audit produced no findings (so synthesis knows it's not stale).

### 2. Per-iteration delta JSONL — write to \`${PACKET_REL}/research/deltas/iter-${NNN}.jsonl\`

One JSON record per line. MUST start with the canonical iteration record:

\`\`\`json
{"type":"iteration","iteration":${ITER_INT},"newInfoRatio":0.85,"status":"insight","focus":"${AID}: ${TITLE}","angle":"${AID}"}
\`\`\`

Then one \`{"type":"finding",...}\` record per finding:

\`\`\`json
{"type":"finding","id":"f-iter${NNN}-001","severity":"P1","label":"<short label>","file":"path/file.ext","line":NN,"iteration":${ITER_INT},"angle":"${AID}"}
\`\`\`

The first record's \`type\` MUST be exactly \`"iteration"\` (not \`"iteration_delta"\`). Use \`newInfoRatio\` between 0 and 1.

### 3. State log append — append the iteration record to \`${PACKET_REL}/research/deep-research-state.jsonl\`

Append exactly one line — the same \`{"type":"iteration",...}\` record from step 2. Use \`printf '%s\n' '<json>' >> path\`. If the sandbox blocks this append, the driver script replays it from the delta file.

## Constraints

- **LEAF agent**: do NOT spawn sub-agents. Do all work yourself.
- **Read-only on product code**: do NOT modify any files outside the iteration narrative + delta + state log.
- **Citation discipline**: every finding needs \`file:LINE\` evidence.
- **Severity calibration**: P0 = production bug with user impact; P1 = real bug masked by tests/luck; P2 = code-smell with potential future impact; none = no issue, just a method note.
- **File:line format**: \`path/from/repo/root.ext:LINE\`.
- **Token budget**: keep iteration narrative under ~2000 words.

Begin now. End by confirming all three files exist via \`ls\` or \`stat\`.
EOF
  echo "wrote ${PROMPTS_DIR}/iteration-${NNN}.md"
}

# A — Production code bugs
gen "001" "A1" "Daemon concurrency edge cases" \
"Audit \`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/\` (lease.ts, lifecycle.ts, watcher.ts) and \`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/\` (generation.ts, trust-state.ts, cache-invalidation.ts) for race conditions, ordering bugs, missing happens-before edges, lease lifecycle issues, and watcher races. Find specific function names + line numbers where two paths can run concurrently without a lock or a happens-before guarantee."

gen "002" "A2" "Code-graph SQLite contention" \
"Audit \`.opencode/skill/system-spec-kit/mcp_server/code_graph/\` (handlers/ and lib/) for concurrent-scan + concurrent-read patterns. Are transactions the right size? Are write-write conflicts handled (BEGIN IMMEDIATE / SAVEPOINT)? Are stale snapshots ever served from a long-running read? Cite the SQL or query construction sites with file:line."

gen "003" "A3" "Resource leaks across mcp_server" \
"Audit long-running paths for resource leaks: (a) FD leaks (open file handles not closed on error/throw paths), (b) unbounded memory growth (caches without TTL or size cap, watcher arrays that grow without prune), (c) subprocess zombies (spawn without await/close handling). Look at \`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/\`, \`mcp_server/code_graph/lib/\`, and \`mcp_server/lib/\`. Cite specific allocators and their cleanup sites with file:line."

gen "004" "A4" "Silent error recovery patterns" \
"sa-004 was a misread, but the *pattern* of catch-and-recover that masks real corruption likely exists elsewhere. Audit \`try/catch\` blocks across \`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/\` and \`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/\` for any place that swallows an error without logging, without surfacing, or with too-broad recovery. Classify each as legitimate vs concerning. Cite file:line for concerning sites."

gen "005" "A5" "Schema validation gaps" \
"Audit \`JSON.parse\` and \`zod.parse\` usage across \`.opencode/skill/system-spec-kit/mcp_server/\`. Where are schema validations missing (raw \`JSON.parse\` without zod)? Where are unsafe \`as\` casts used after parse? Where can adversarial input bypass validation? Audit path traversal: are user-provided paths normalized + bounded to workspace root? Cite file:line for each gap."

# B — Wiring / automation bugs
gen "006" "B1" "Hook contract drift across runtimes" \
"Audit the 5 hook integrations: Claude \`UserPromptSubmit\`, Copilot \`UserPromptSubmit\`, Gemini \`UserPromptSubmit\`, Codex \`SessionStart\`+\`UserPromptSubmit\`, OpenCode plugin bridge. Look in \`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/hooks/\` and runtime-specific plugin code. Do they all produce the same advisor-brief format? Same fallback paths when the daemon is down? Cite the rendering function + format strings per runtime."

gen "007" "B2" "CLI orchestrator skill correctness" \
"Audit \`.opencode/skill/cli-codex/\`, \`cli-copilot/\`, \`cli-gemini/\`, \`cli-claude-code/\`, \`cli-opencode/\` SKILL.md and any reference docs for: dispatch-prompt template correctness, mode/flag drift between skills, self-invocation guards, sandbox/approval flag wiring, model defaults. Where does each skill drift from the others? Cite the SKILL.md sections + line numbers."

gen "008" "B3" "Memory MCP round-trip integrity" \
"Audit \`memory_save → memory_index_scan → memory_search → memory_context\` flow. Look at \`.opencode/skill/system-spec-kit/mcp_server/lib/memory/\` and the relevant handlers. Does what gets saved actually become searchable? Are continuity blocks parsed correctly from frontmatter? Are causal links preserved across saves? Trace 1-2 example saves end-to-end (read the relevant handler code) and report inconsistencies with file:line."

gen "009" "B4" "Spec-kit validator correctness" \
"Audit \`.opencode/skill/system-spec-kit/scripts/spec/validate.sh\` and the rule scripts in \`.opencode/skill/system-spec-kit/scripts/rules/\`. Are there false positives (failing valid spec folders) or false negatives (passing invalid)? Specifically: SPEC_DOC_INTEGRITY checks, EVIDENCE_CITED patterns (does it really catch all evidence formats?), TEMPLATE_HEADERS detection (regex sufficiency). Cite specific rule file:line."

gen "010" "B5" "Workflow command auto-routing" \
"Audit \`.opencode/command/spec_kit/\` (complete.md, plan.md, implement.md, deep-research.md, deep-review.md, resume.md and the assets/ YAMLs) for state-machine correctness: do the YAML workflows handle missing prerequisites, gate failures, partial state correctly? Where can the workflow get stuck or skip a required step? Cite YAML file:line for each issue."

# C — Refinement / improvement
gen "011" "C1" "Search-quality W3-W13 latency and accuracy" \
"Audit \`.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/\` (corpus, harness, baseline metrics). Are there channel weights, cross-encoder thresholds, or fusion strategies that could measurably improve precision@K or NDCG without regressing recall? Identify 3-5 concrete tuning opportunities with expected impact. Cite specific weights/thresholds with file:line."

gen "012" "C2" "Scorer fusion accuracy on edge cases" \
"Audit \`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/\` (fusion.ts, projection.ts, lanes/). What edge cases does the current fusion mishandle? Ambiguity ties, near-duplicate skill projections, adversarial trigger phrases? Propose targeted improvements. Cite file:line."

gen "013" "C3" "Skill advisor recommendation quality" \
"Audit advisor recommendation patterns. Sample real-world prompts from \`.opencode/skill/system-spec-kit/scripts/fixtures/skill_advisor_regression_cases.jsonl\` (or whatever the fixture file is — find it with \`fd\` or \`find\`). Where does it confidently recommend the wrong skill? Where does it correctly hedge with low-confidence? What patterns dominate false positives and false negatives? Cite specific cases with file:line."

gen "014" "C4" "Code-graph staleness detection accuracy" \
"Audit the staleness model in \`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/\` and the \`.opencode/command/doctor/code-graph.md\` workflow. Under what change patterns does it false-stale (forces unnecessary reindex)? Under what patterns does it false-fresh (misses needed reindex)? Identify gaps with concrete change types. Cite file:line."

gen "015" "C5" "Test suite reliability and flake patterns" \
"Catalog the unit and stress tests under \`.opencode/skill/system-spec-kit/mcp_server/\` for environmental dependencies, timing dependencies, fixture-state dependencies. Where do tests rely on \`process.env\`, \`Date.now()\`, or external file system state in ways that make CI flaky? Propose fixture/sandbox improvements. Cite test file:line."

# D — Architecture / file organization
gen "016" "D1" "mcp_server/lib/ boundary discipline" \
"Audit module boundaries across \`.opencode/skill/system-spec-kit/mcp_server/lib/\` and \`mcp_server/skill_advisor/lib/\` (freshness/, derived/, lifecycle/, scorer/, daemon/, corpus/, handlers/). Are responsibilities clean? Where do modules reach across boundaries (e.g. lifecycle importing scorer internals)? Recommend module re-organization where it'd reduce coupling. Cite import file:line offenders."

gen "017" "D2" "Module dependency graph health" \
"Map the dependency graph for \`.opencode/skill/system-spec-kit/mcp_server/\` (excluding tests). Are there circular imports? Dead exports (declared but never imported)? Hot-spot modules with 50+ dependents? What's the longest dependency chain depth? Use ripgrep on \`import\` / \`require\` patterns. Cite file:line examples."

gen "018" "D3" "Type / schema duplication" \
"Audit zod schemas, TypeScript types, and runtime guards across \`.opencode/skill/system-spec-kit/mcp_server/\`. Where is the same shape defined in multiple places? Where do types drift from runtime schemas (z.infer mismatches)? Recommend a single-source-of-truth strategy. Cite file:line for each duplication."

gen "019" "D4" "Spec-kit folder topology sustainability" \
"Audit \`.opencode/specs/system-spec-kit/\` depth (e.g. \`026/000/005/045-...\`), naming conventions, and packet sprawl (45+ packets under one parent). Is the structure scaling? Recommend folder reorganization or naming refinements. Provide concrete examples and cite folder paths."

gen "020" "D5" "Build / dist / runtime separation" \
"Audit \`.opencode/skill/system-spec-kit/mcp_server/\` \`tsconfig\`, \`dist/\` outputs, and runtime imports. Which \`.js\` paths in source files are compiled outputs vs source-of-truth? Are there places where source and dist drift? Recommend clarifications. Cite tsconfig + sample import file:line."

echo "all 20 prompts generated"
