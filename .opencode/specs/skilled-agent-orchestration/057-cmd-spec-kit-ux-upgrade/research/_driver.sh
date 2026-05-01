#!/usr/bin/env bash
# Driver for /spec_kit:deep-research:auto loop on packet 057-cmd-spec-kit-ux-upgrade
# Iterates cli-codex (gpt-5.5/high/fast) × 10 with reducer between each, then synthesizes.

set -uo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
SPEC_FOLDER=".opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade"
RESEARCH_DIR="$SPEC_FOLDER/research"
PROMPTS_DIR="$RESEARCH_DIR/prompts"
ITER_DIR="$RESEARCH_DIR/iterations"
DELTA_DIR="$RESEARCH_DIR/deltas"
STATE_LOG="$RESEARCH_DIR/deep-research-state.jsonl"
REGISTRY="$RESEARCH_DIR/findings-registry.json"
STRATEGY="$RESEARCH_DIR/deep-research-strategy.md"
DRIVER_LOG="$RESEARCH_DIR/_driver.log"
MAX_ITER=10
CONVERGENCE=0.05

cd "$REPO_ROOT"

log() { echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] $*" | tee -a "$DRIVER_LOG"; }

mkdir -p "$ITER_DIR" "$DELTA_DIR" "$PROMPTS_DIR"

log "=== Driver starting (iter 1..$MAX_ITER, executor=cli-codex/gpt-5.5/high/fast) ==="

render_prompt() {
  local n=$1
  local nnn
  printf -v nnn "%03d" "$n"
  local out="$PROMPTS_DIR/iteration-${n}.md"
  if [[ -s "$out" ]]; then
    log "iter $n: prompt already rendered, reusing"
    return 0
  fi

  # Read state for state_summary derivation
  local research_topic
  research_topic=$(node -e '
    const fs = require("fs");
    const lines = fs.readFileSync(process.argv[1],"utf8").split("\n").filter(Boolean);
    const cfg = JSON.parse(lines[0]);
    process.stdout.write(cfg.topic || "");
  ' "$STATE_LOG")

  # Derive last_3_summaries, next_focus, remaining_questions, state_summary via Node helper
  node <<NODE > "$out.tmp" 2>>"$DRIVER_LOG"
const { renderPromptPack } = require("./.opencode/skill/system-spec-kit/mcp_server/dist/lib/deep-loop/prompt-pack.js");
const fs = require("fs");
const path = require("path");

const tmpl = "./.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl";
const research = "$RESEARCH_DIR";
const N = $n;
const NNN = String(N).padStart(3, "0");

const registry = JSON.parse(fs.readFileSync(path.join(research, "findings-registry.json"), "utf8"));
const stateLog = fs.readFileSync(path.join(research, "deep-research-state.jsonl"), "utf8")
  .split("\n").filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);

const iterRecords = stateLog.filter(r => r.type === "iteration");
const lastIter = iterRecords[iterRecords.length - 1];
const prevIter = iterRecords[iterRecords.length - 2];
const ratioPrev = prevIter ? prevIter.newInfoRatio.toFixed(2) : "N/A";
const ratioLatest = lastIter ? lastIter.newInfoRatio.toFixed(2) : "N/A";
const lastFocus = lastIter ? lastIter.focus : "none yet";

// Last 3 iteration summaries
const summaries = [];
for (let i = Math.max(1, N - 3); i < N; i++) {
  const fp = path.join(research, "iterations", \`iteration-\${String(i).padStart(3, "0")}.md\`);
  if (fs.existsSync(fp)) {
    const body = fs.readFileSync(fp, "utf8");
    // Take Findings section first paragraph or first 250 chars
    const findingsMatch = body.match(/##+\\s+(?:Findings|FINDINGS)[\\s\\S]*?\\n([^\\n]+(?:\\n[^\\n#][^\\n]*){0,4})/);
    const snip = (findingsMatch ? findingsMatch[1] : body.slice(0, 300)).replace(/\\s+/g, " ").trim().slice(0, 280);
    summaries.push(\`Iter \${i}: \${snip}\`);
  }
}
const last3 = summaries.length ? summaries.join("\\n  ") : "none yet";

// Open questions
const remaining = (registry.openQuestions || []).slice(0, 10);
const remainingList = remaining.length
  ? remaining.map((q, i) => \`  \${i+1}. \${q.id || \`Q\${i+1}\`}: \${q.label || q.question || q}\`).join("\\n")
  : "  (no open questions tracked yet — derive from research charter)";

const stuckCount = lastIter && lastIter.status === "stuck" ? (registry.metrics?.stuckCount || 0) : 0;
const totalQ = registry.metrics?.openQuestions || 8;
const answeredQ = (registry.resolvedQuestions || []).length;

// Next focus — read from strategy.md "Next Focus" anchor or fall back to per-axis scout schedule
const strategyText = fs.readFileSync(path.join(research, "deep-research-strategy.md"), "utf8");
const nextFocusMatch = strategyText.match(/##+\\s+Next\\s+Focus[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n##|\\n---|\$)/i);
const focusFromStrategy = nextFocusMatch ? nextFocusMatch[1].trim().split("\\n")[0].slice(0, 400) : null;
const axisSchedule = {
  1: "SCOUT pass: external structure + 5 SPAR skill SKILL.md files + 1-2 install-root/targets/*.json. Findings on Axis 1 (installer) and Axis 3 (command granularity).",
  2: "Deep dive Axis 2 (instruction-file management): SPAR managed-block policy in install-root/, AGENTS.md/CLAUDE.md handling, vs our hand-edited triad (Public/Barter/fs-enterprises). 60-line cap and policy vocabulary.",
  3: "Axis 4 (template architecture): SPAR templates/spec.md + plan.md + asset-policy declarative manifest (replace, seed_if_missing, managed_block, replace_managed_children) vs our 99-file core + addendum + level + cross-cutting tree.",
  4: "Axis 5 (tool-discovery UX): .spar-kit/.local/tools.yaml seeded once vs our skill-advisor + 47 MCP tools. Discoverability comparison.",
  5: "Axis 6 (personas + UX tone): SPAR's 5 personas (Vera/Pete/Tess/Maya/Max), Key vs Optional follow-up split in spar-plan, teammate tone in spar-specify. Compare to our skill prompt patterns.",
  6: "Cross-cut: pull together 3-5 highest-impact findings so far. Identify gaps in coverage. Refine adoption tags.",
  7: "Ranking pass: order all findings by impact × adoption-cost. Add follow-on packet names (058-* through 06X-*). Verify each finding cites both surfaces.",
  8: "Risk + edge cases: surface adoption risks per finding (sync triad, hook contracts, advisor scoring, validate.sh, ~800 spec folder migration). Identify reject-with-rationale candidates.",
  9: "Convergence check: re-validate top 10-15 findings against external/ AND internal source paths. Fill in evidence gaps. Answer remaining open questions.",
  10: "Final synthesis prep: ensure all 6 axes have ≥1 finding, all findings tagged + cited + with follow-on packet. Flag any thin-evidence axis."
};
const nextFocus = focusFromStrategy || axisSchedule[N] || "Continue investigation on remaining open questions.";

const stateSummary = \`Segment: 1 | Iteration: \${N} of 10
Questions: \${answeredQ}/\${totalQ} answered | Last focus: \${lastFocus}
Last 2 ratios: \${ratioPrev} -> \${ratioLatest} | Stuck count: \${stuckCount}
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: \${nextFocus}\`;

const variables = {
  state_summary: stateSummary,
  research_topic: \`$research_topic\`,
  current_iteration: String(N),
  max_iterations: "10",
  next_focus: nextFocus,
  remaining_questions_list: remainingList,
  last_3_summaries: last3,
  state_paths_config: path.join(research, "deep-research-config.json"),
  state_paths_state_log: path.join(research, "deep-research-state.jsonl"),
  state_paths_strategy: path.join(research, "deep-research-strategy.md"),
  state_paths_registry: path.join(research, "findings-registry.json"),
  state_paths_iteration_pattern: path.join(research, "iterations", \`iteration-\${NNN}.md\`),
  state_paths_delta_pattern: path.join(research, "deltas", \`iter-\${NNN}.jsonl\`),
};

process.stdout.write(renderPromptPack(tmpl, variables));
NODE
  if [[ -s "$out.tmp" ]]; then
    mv "$out.tmp" "$out"
    log "iter $n: prompt rendered ($(wc -c < "$out") bytes)"
    return 0
  else
    log "iter $n: prompt rendering FAILED"
    rm -f "$out.tmp"
    return 1
  fi
}

run_iteration() {
  local n=$1
  local prompt_file="$PROMPTS_DIR/iteration-${n}.md"
  log "iter $n: dispatching codex..."
  local started
  started=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
  if timeout 1500 codex exec \
      --model gpt-5.5 \
      -c model_reasoning_effort=high \
      -c service_tier=fast \
      -c approval_policy=never \
      --sandbox workspace-write \
      - < "$prompt_file" >> "$DRIVER_LOG" 2>&1; then
    log "iter $n: codex returned 0"
  else
    local rc=$?
    log "iter $n: codex returned $rc"
    if [[ $rc -eq 124 ]]; then
      log "iter $n: TIMEOUT after 1500s"
    fi
  fi
}

reduce_state() {
  log "running reducer..."
  if node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs "$SPEC_FOLDER" >> "$DRIVER_LOG" 2>&1; then
    log "reducer ok"
  else
    log "reducer failed (rc=$?), continuing"
  fi
}

check_convergence() {
  node -e '
    const r = JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));
    const log = require("fs").readFileSync(process.argv[2],"utf8")
      .split("\n").filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } })
      .filter(x => x && x.type === "iteration");
    const last = log.slice(-2);
    const converged = last.length === 2 && last.every(x => x.newInfoRatio < 0.05);
    const allAnswered = (r.openQuestions || []).length === 0 && r.metrics?.iterationsCompleted >= 3;
    if (converged) { console.log("CONVERGED:ratio"); process.exit(0); }
    if (allAnswered) { console.log("CONVERGED:questions"); process.exit(0); }
    console.log("CONTINUE");
  ' "$REGISTRY" "$STATE_LOG" 2>>"$DRIVER_LOG"
}

# ── MAIN LOOP ─────────────────────────────────────────────────
for n in $(seq 1 $MAX_ITER); do
  log "=== ITERATION $n / $MAX_ITER ==="
  iter_file="$ITER_DIR/iteration-$(printf "%03d" "$n").md"

  if [[ -s "$iter_file" ]]; then
    log "iter $n: iteration file already exists, skipping codex dispatch"
  else
    render_prompt "$n" || { log "iter $n: render failed, halting"; exit 2; }
    run_iteration "$n"
  fi

  reduce_state

  status=$(check_convergence)
  log "convergence check: $status"
  if [[ "$status" == CONVERGED:* ]]; then
    log "Converged at iter $n. Exiting loop."
    break
  fi
done

# ── SYNTHESIS ─────────────────────────────────────────────────
log "=== SYNTHESIS PHASE ==="
SYNTH_PROMPT="$RESEARCH_DIR/_synthesis_prompt.md"
RESEARCH_MD="$RESEARCH_DIR/research.md"
RESOURCE_MAP="$RESEARCH_DIR/resource-map.md"

cat > "$SYNTH_PROMPT" <<'SYNTH'
# Deep-Research Synthesis Pass

You are completing a 10-iteration deep-research loop comparing external SPAR-Kit (jed-tech, npm @spar-kit/install Beta1, Specify→Plan→Act→Retain) at `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/external/` against internal `system-spec-kit` (`.opencode/skill/system-spec-kit/SKILL.md`, templates/, `.opencode/command/spec_kit/`, `.opencode/command/memory/`, `.opencode/command/create/`, `.opencode/agent/`).

## Read state
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/iterations/iteration-001.md` … `iteration-010.md` (whichever exist)
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deep-research-state.jsonl`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/findings-registry.json`
- `.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/deep-research-strategy.md`

## Write
**`.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/research.md`** with the canonical 17-section template:

1. Title + frontmatter (title, description, sessionId, generation, completedAt)
2. Executive Summary (3-5 bullets, headline findings + adoption verdict counts)
3. Research Charter (topic, axes covered, success criteria — copy from spec.md §3 In Scope)
4. Methodology (10 cli-codex/gpt-5.5/high/fast iterations, fresh context, externalized state)
5. Coverage Map (per-axis: # findings, evidence depth, gaps)
6. Findings Index (table: ID | Axis | Verdict tag | Title | Risk | Follow-on packet)
7. Detailed Findings — one subsection per finding. For each:
   - **Verdict**: `adopt-as-is` | `adapt` | `inspired-by` | `reject-with-rationale`
   - **Axis**: 1-6
   - **Description** (2-3 paragraphs)
   - **Evidence** (bullet list — cite ≥1 path in external/ AND ≥1 path in internal surface)
   - **Adoption Risk** (low/med/high + 1 sentence)
   - **Follow-on Packet**: `058-<slug>` etc. with 1-2 sentence scope
8. Cross-cutting Themes (3-5 patterns spanning multiple axes)
9. Reject-with-rationale Section (consolidated list with reasons)
10. Adoption Roadmap (suggested ordering of follow-on packets, dependencies between them)
11. Open Questions Resolved (Q1-Q8 from spec.md §10, each with a decisive answer or "deferred to packet 058-X")
12. Open Questions Remaining (anything still unanswered, with reason)
13. Negative Knowledge / Ruled-out Directions
14. Risks to Adoption (cross-cutting — sync triad, hook contracts, ~800 spec folder migration, advisor scoring)
15. Out of Scope For This Research (and where each lands)
16. Verification Hooks (commands to validate findings post-adoption)
17. References (every cited path, both external/ and internal/)

10-20 ranked findings minimum. Each tagged + cited (both surfaces) + with follow-on packet.

Also write **`.opencode/specs/skilled-agent-orchestration/057-cmd-spec-kit-ux-upgrade/research/resource-map.md`** — a lean ledger of every external/ AND internal path cited in research.md, grouped by surface and category.

When done, append a single record to `deep-research-state.jsonl`:
```json
{"type":"event","event":"synthesis_complete","timestamp":"<ISO>","artifacts":["research.md","resource-map.md"]}
```

DO NOT dispatch sub-agents. You are running as cli-codex on this single pass.
SYNTH

log "running synthesis codex pass..."
if timeout 1800 codex exec \
    --model gpt-5.5 \
    -c model_reasoning_effort=high \
    -c service_tier=fast \
    -c approval_policy=never \
    --sandbox workspace-write \
    - < "$SYNTH_PROMPT" >> "$DRIVER_LOG" 2>&1; then
  log "synthesis codex ok"
else
  log "synthesis codex returned $? (continuing)"
fi

# ── FINAL CONTINUITY UPDATE ──────────────────────────────────
log "=== CONTINUITY UPDATE ==="
if [[ -s "$RESEARCH_MD" ]]; then
  log "research.md present ($(wc -c < "$RESEARCH_MD") bytes)"
else
  log "WARNING: research.md missing or empty"
fi
if [[ -s "$RESOURCE_MAP" ]]; then
  log "resource-map.md present ($(wc -c < "$RESOURCE_MAP") bytes)"
else
  log "INFO: resource-map.md missing"
fi

# Release lock
rm -f "$RESEARCH_DIR/.deep-research.lock"
log "lock released"

log "=== DRIVER COMPLETE ==="
echo "DONE" > "$RESEARCH_DIR/_driver.status"
