---
iteration: 3
date: 2026-05-02T13:22:09.708+02:00
focus_rqs: [RQ-2, RQ-3, RQ-5, RQ-7]
new_findings_count: 5
rqs_now_answerable: [RQ-2, RQ-3, RQ-5, RQ-7]
convergence_signal: no
---

# Iteration 3

## Focus

This iteration narrowed the remaining ambiguity from iteration 2: what 063's command-flow runner must look like if it is to exercise `/improve:agent` rather than a bare fixture or a prepended leaf body. The new value is a scope decision for 063, a command-capable sandbox shape, and a sharper benchmark contract.

## Method

I read the prior two iteration files first and treated their RQ coverage as the baseline. Then I inspected only command/YAML/helper seams that determine whether a command-flow stress packet can run truthfully: command argument parsing, YAML relative paths, fixture contents, journal consumer shape, and benchmark runner CLI behavior. I also checked the failed CP-045 transcript area to distinguish "benchmark script missing" from "benchmark script not wired."

## Findings

### RQ-2: Call B needs a command-capable project root, not just `--add-dir`

The exact user-facing Call B remains:

```text
/improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=/tmp/cp-063-spec --iterations=1
```

The correction is **where** it runs. It should run from a temp project root that contains the command, skill scripts, and fixture target under the same relative `.opencode/...` tree. The command frontmatter declares `/improve:agent` arguments as `<agent_path> [:auto|:confirm] [--spec-folder=PATH] [--iterations=N]`, and setup parses the mode suffix, target path, spec folder, and iteration count from `$ARGUMENTS` before deciding whether to ask the user [SOURCE: `.opencode/command/improve/agent.md:1-4`, `.opencode/command/improve/agent.md:74-90`]. The command also lists agents via `ls .opencode/agent/*.md`, so the fixture target must be under the active cwd's `.opencode/agent/`, not only exposed through an unrelated `--add-dir` [SOURCE: `.opencode/command/improve/agent.md:91-95`].

The bare 060 fixture is insufficient as the cwd because it contains only the target mirrors plus `benchmark/sentinel.js`; it does not include `.opencode/command/improve/agent.md` or `.opencode/skill/sk-improve-agent/scripts/` [SOURCE: `.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/README.md:12-19`]. Conversely, running from repo root with only `--add-dir /tmp/cp-063-sandbox` is also ambiguous because the command's target validator says the target path must exist and match `.opencode/agent/*.md`, while the repo root does not contain `.opencode/agent/cp-improve-target.md` [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:56-60`].

Therefore 063 should build a **command-capable sandbox project**: copy `.opencode/command/improve/`, `.opencode/skill/sk-improve-agent/`, and the fixture's `.opencode/agent/cp-improve-target.md` plus mirrors into one temp cwd, then invoke `/improve:agent` from that cwd. This preserves the 001 synthesis's intended command shape while avoiding repo-root canonical mutation [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md:142-145`].

### RQ-3: Benchmark evidence should be report-backed, not sentinel-only

CP-045's failure should be reclassified more precisely. The benchmark runner script **does exist**, and the YAML catalog names it as `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs` [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:87-93`]. The current YAML loop, however, does not invoke it; `step_run_benchmark` is only an `action:` placeholder, followed by a `benchmark_completed` journal emission that assumes `{benchmark_output_path}` already exists [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-179`].

The concrete grep contract should require the real CLI invocation:

```bash
node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs \
  --profile=<profile-id> \
  --outputs-dir=<candidate-output-dir> \
  --output=<spec-folder>/improvement/benchmark-runs/<profile>/iteration-<n>.json \
  --state-log=<spec-folder>/improvement/agent-improvement-state.jsonl \
  --integration-report=<spec-folder>/improvement/integration-report.json
```

That shape is directly supported by the script's CLI parser and usage text [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:202-214`]. The verdict should then assert `status:"benchmark-complete"`, aggregate score, recommendation, thresholds, fixture results, and optional integration score in the JSON report, plus a `type:"benchmark_run"` row in `agent-improvement-state.jsonl` when `--state-log` is provided [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:217-270`].

The old CP-045 sentinel remains useful as a tripwire, but not as the primary benchmark proof. The fixture's `benchmark/sentinel.js` writes `/tmp/cp-045-sandbox/benchmark-completed.sentinel` only when that standalone script is executed [SOURCE: `.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/benchmark/sentinel.js:1-9`]. `run-benchmark.cjs` scores markdown outputs from JSON fixtures; it does not execute `benchmark/sentinel.js` in the inspected path [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:217-224`]. That explains why R1 got `BENCHMARK_SENTINEL_EXISTS=1` and zero benchmark labels after the leaf-body halt, but 063 should not make sentinel existence the sole acceptance source [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-run-log.txt:1523-1528`].

### RQ-5: 001 missed a "fixture completeness" precondition

Iterations 1 and 2 already showed that 001 sketched the right `/improve:agent` command but did not make layer fidelity a blocking implementation invariant. This iteration adds a second handoff gap: 001 did not require the fixture to include or point to the command/skill surfaces necessary for the command to run in isolation. The 001 scenario sketch said to seed `/tmp/cp-040-sandbox` with `.opencode/agent/cp040.md` and run Call B through `/improve:agent` [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md:142-145`], but the shipped fixture README enumerates only target mirrors and a benchmark sentinel [SOURCE: `.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/README.md:12-19`].

That omission matters because the YAML commands are relative to `.opencode/skill/sk-improve-agent/scripts/...` and write state under `{spec_folder}/improvement/...` [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:96-110`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:125-143`]. A future synthesis should require a "harness root completeness" checklist: command file present, skill scripts present, target path valid relative to cwd, spec folder externalized, and canonical/mirror tripwire anchored to the temp root.

### RQ-7: Add "harness root completeness" to the layer-selection template

Iteration 2's preflight template should gain one more blocking question:

```markdown
- Harness root completeness:
  - What cwd will the command/agent resolve relative paths from?
  - Does that cwd contain the command entrypoint, skill scripts, target agent, mirrors, fixture data, and any benchmark profiles needed by helper CLIs?
  - Which paths are allowed to be outside the cwd (`--spec-folder`, temp logs), and which must not touch repo-root canonical files?
```

This is distinct from "natural entry point." R1 failed because Call B used the wrong entry point, but 063 could still fail after fixing the prompt if it runs `/improve:agent` from a root that lacks the command's relative dependencies. The command itself instructs the general agent to load the matching YAML after setup [SOURCE: `.opencode/command/improve/agent.md:7-17`], while the YAML step commands assume repo-style relative paths for scanner, profiler, scorer, journal, reducer, and benchmark scripts [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:87-93`].

### RQ-5/RQ-3: 063 should be implementation-plus-test unless it intentionally expects failures

The right 063 scope is not a pure rerun if the desired verdict is all green. At minimum, implementation needs to address two executable joins before the command-flow stress suite can fairly PASS:

1. **Legal-stop JSON shape:** YAML emits `legal_stop_evaluated` with flat `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, and `improvementGate` fields [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:192-198`], while the reducer reads only `details.gateResults` for `legal_stop_evaluated` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`].
2. **Benchmark execution:** YAML catalogs `run-benchmark.cjs` but leaves `step_run_benchmark` as action prose instead of a concrete command [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:87-93`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-179`].

If 063 is test-only, its acceptance criteria should explicitly expect these two seams to fail and record them as RED tests. If 063 is meant to deliver a passing command-flow Call B, it should first patch producer/consumer legal-stop shape and benchmark command wiring, then run the stress suite. This follows the 060/002 report's conclusion that R2 is not a small rerun but a separate packet requiring command-owned setup, helper-script evidence capture, journal inspection, and stop-condition assertions [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:177-184`].

## New Open Questions

1. Should 063 copy only `.opencode/command/improve` and `.opencode/skill/sk-improve-agent`, or use a full temporary repo copy to avoid missing transitive assets such as generated profiles and package dependencies?
2. Should CP-045 keep the existing sentinel as a secondary tripwire, or replace it with a JSON benchmark report plus `benchmark_run` state row as the primary file-backed proof?
3. Should the legal-stop fix standardize on nested `details.gateResults`, or make `reduce-state.cjs` tolerant of both flat and nested events for backward compatibility?

## Ruled Out

- **Ruled out: bare fixture cwd as sufficient for `/improve:agent`.** The fixture contains the target and mirrors, but not the command entrypoint or skill scripts needed by YAML-relative commands [SOURCE: `.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/README.md:12-19`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:87-93`].
- **Ruled out: repo-root plus `--add-dir` as obviously sufficient.** The command discovers targets with `ls .opencode/agent/*.md`, and the YAML target validation expects `.opencode/agent/*.md`; a target that exists only under `/tmp/cp-063-sandbox` is not naturally selected from repo-root cwd [SOURCE: `.opencode/command/improve/agent.md:91-95`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:56-60`].
- **Ruled out: "run-benchmark.cjs is missing."** The script exists and has a usable CLI; the open seam is that YAML does not call it in `step_run_benchmark` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:202-214`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-179`].

## Sketches (if any)

### 063 command-capable sandbox runner sketch

```bash
rm -rf /tmp/cp-063-project /tmp/cp-063-project-baseline /tmp/cp-063-spec
mkdir -p /tmp/cp-063-project/.opencode/skill

cp -a .opencode/command /tmp/cp-063-project/.opencode/
cp -a .opencode/skill/sk-improve-agent /tmp/cp-063-project/.opencode/skill/
cp -a .opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/. /tmp/cp-063-project/
cp -a /tmp/cp-063-project /tmp/cp-063-project-baseline

cat > /tmp/cp-063-prompt-B.txt <<'EOF'
/improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=/tmp/cp-063-spec --iterations=1

Task ID: CP-063-CALL-B.
Run one command-owned improvement iteration against the sandbox fixture target. Write runtime artifacts only under /tmp/cp-063-spec/improvement and do not mutate the canonical target or mirrors in /tmp/cp-063-project unless a guarded promotion step is explicitly reached.
EOF

(cd /tmp/cp-063-project && copilot -p "$(cat /tmp/cp-063-prompt-B.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user 2>&1) \
  | tee /tmp/cp-063-B-command.txt
```

### 063 benchmark grep/assertion sketch

```bash
combined=/tmp/cp-063-B-combined.txt
find /tmp/cp-063-spec/improvement -type f -maxdepth 5 -print | sort > /tmp/cp-063-artifacts.txt
cat /tmp/cp-063-B-command.txt /tmp/cp-063-spec/improvement/*.json /tmp/cp-063-spec/improvement/*.jsonl 2>/dev/null > "$combined"

grep -c 'run-benchmark.cjs' "$combined"
grep -c 'benchmark_completed' "$combined"
grep -c '"status": "benchmark-complete"' "$combined"
grep -c '"type":"benchmark_run"\|"type": "benchmark_run"' "$combined"

node -e '
const fs = require("node:fs");
const reports = process.argv.slice(1).filter((p) => fs.existsSync(p)).map((p) => [p, JSON.parse(fs.readFileSync(p, "utf8"))]);
if (!reports.some(([, r]) => r.status === "benchmark-complete" && Array.isArray(r.fixtures) && r.recommendation)) process.exit(20);
' /tmp/cp-063-spec/improvement/benchmark-runs/*/*.json
```

## Next Focus Suggestion

Iteration 4 should decide the 063 packet contract explicitly: RED test-design packet versus implementation-plus-test packet. If implementation-plus-test wins, the next research pass should sketch minimal diffs for nested `details.gateResults` and a concrete YAML `run-benchmark.cjs` command, including any required benchmark profile/fixture assets.

## Convergence Assessment

This added real new value, so `convergence_signal: no`. Prior iterations answered the broad RQs; this iteration made the next packet executable by identifying the necessary temp-root shape and by replacing the vague CP-045 benchmark boundary with a report/state/journal contract.
