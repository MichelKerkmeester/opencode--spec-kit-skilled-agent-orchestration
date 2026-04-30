---
title: "RT-031 -- Parallel Candidates Opt-In Default"
description: "Manual validation scenario for RT-031: Parallel Candidates Opt-In Default."
feature_id: "RT-031"
category: "Runtime Truth"
---

# RT-031 -- Parallel Candidates Opt-In Default

This document captures the canonical manual-testing contract for `RT-031`.

---

## 1. OVERVIEW

This scenario validates that the default configuration has `parallelWaves.enabled: false` and that an improvement session running with default settings only generates sequential single-candidate iterations (no parallel wave spawning).

---

## 2. SCENARIO CONTRACT

- Objective: Validate Parallel Candidates Opt-In Default for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
- Real user request: `` Validate that the default configuration has `parallelWaves.enabled: false` and that an improvement session running with default settings only generates sequential single-candidate iterations (no parallel wave spawning). ``
- RCAF Prompt: `` As a manual-testing orchestrator, validate that the default configuration has parallelWaves.enabled: false and that an improvement session running with default settings only generates sequential single-candidate iterations (no parallel wave spawning) against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `improvement_config.json` has `parallelWaves.enabled: false` by default. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the candidate-lineage helper against the documented disposable runtime state; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: `improvement_config.json` has `parallelWaves.enabled: false` by default; `parallelWaves.maxCandidates: 3` (configured but not active); During an improvement session with defaults: only one candidate is generated per iteration; Candidate lineage (if tracked) shows all nodes with `waveIndex: 0` (single-wave); No parallel mutation spawning occurs regardless of exploration-breadth score; The activation conditions (exploration-breadth threshold, 3+ unresolved mutation families, 2 consecutive ties) are never evaluated when `enabled: false`
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: The default config has `parallelWaves.enabled: false`, and an improvement session running with default settings generates exactly one candidate per iteration with no parallel wave behavior -- verified by the absence of multi-wave lineage entries and single-candidate-per-iteration flow.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders in the command sequence, especially `{spec}`, to disposable test paths.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Run the verification block against the same artifacts from the same execution.
5. Compare observed output against the expected signals and pass/fail criteria.
6. Record the scenario verdict with the decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RT-031 | Parallel Candidates Opt-In Default | Validate Parallel Candidates Opt-In Default | `` As a manual-testing orchestrator, validate that the default configuration has parallelWaves.enabled: false and that an improvement session running with default settings only generates sequential single-candidate iterations (no parallel wave spawning) against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `improvement_config.json` has `parallelWaves.enabled: false` by default. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | # Verify default config<br>node -e &quot;<br>const config = require(&#x27;./.opencode/skill/sk-improve-agent/assets/improvement_config.json&#x27;);<br>console.log(&#x27;parallelWaves config:&#x27;, JSON.stringify(config.parallelWaves, null, 2));<br>&quot;<br><br><br>Then run an improvement session with default settings:<br><br><br>/improve:improve-agent &quot;.opencode/agent/debug.md&quot; :confirm --spec-folder={spec} --iterations=2<br><br><br>Verification:<br><br><br># Step 1: Verify config default<br>node -e &quot;<br>const config = require(&#x27;./.opencode/skill/sk-improve-agent/assets/improvement_config.json&#x27;);<br>console.assert(config.parallelWaves.enabled === false, &#x27;parallelWaves should be disabled by default&#x27;);<br>console.log(&#x27;PASS — parallelWaves.enabled:&#x27;, config.parallelWaves.enabled);<br>&quot;<br><br><br># Step 2: After running improvement session, verify no parallel candidates<br>node -e &quot;<br>const cl = require(&#x27;./.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs&#x27;);<br>const lineagePath = &#x27;{spec}/improvement/candidate-lineage.json&#x27;;<br>const fs = require(&#x27;fs&#x27;);<br>if (fs.existsSync(lineagePath)) {<br>  const graph = JSON.parse(fs.readFileSync(lineagePath, &#x27;utf8&#x27;));<br>  const nodes = graph.nodes &#124;&#124; [];<br>  const waveIndices = [...new Set(nodes.map(n =&gt; n.waveIndex))];<br>  console.assert(waveIndices.length &lt;= 1, &#x27;Should have at most 1 wave index in single-wave mode&#x27;);<br>  console.assert(waveIndices.every(w =&gt; w === 0 &#124;&#124; w === undefined), &#x27;All wave indices should be 0 or undefined&#x27;);<br>  console.log(&#x27;PASS — wave indices:&#x27;, waveIndices, &#x27;, nodes:&#x27;, nodes.length);<br>} else {<br>  console.log(&#x27;PASS — no lineage file created (expected for single-wave mode)&#x27;);<br>}<br>&quot; | `improvement_config.json` has `parallelWaves.enabled: false` by default; `parallelWaves.maxCandidates: 3` (configured but not active); During an improvement session with defaults: only one candidate is generated per iteration; Candidate lineage (if tracked) shows all nodes with `waveIndex: 0` (single-wave); No parallel mutation spawning occurs regardless of exploration-breadth score; The activation conditions (exploration-breadth threshold, 3+ unresolved mutation families, 2 consecutive ties) are never evaluated when `enabled: false` | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | The default config has `parallelWaves.enabled: false`, and an improvement session running with default settings generates exactly one candidate per iteration with no parallel wave behavior -- verified by the absence of multi-wave lineage entries and single-candidate-per-iteration flow. | If `parallelWaves.enabled` is true: the default config has been changed; revert to `false`<br>If multiple candidates appear per iteration: check whether the orchestrator respects the `parallelWaves.enabled` gate before spawning parallel candidates<br>If wave indices are &gt; 0: verify that single-wave mode assigns `waveIndex: 0` (or omits it)<br>If parallel spawning occurs despite `enabled: false`: check for a code path that bypasses the config gate |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste parallelWaves config and candidate-per-iteration counts]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `07--runtime-truth/031-parallel-candidates-opt-in.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/candidate-lineage.cjs'` | Implementation or verification anchor referenced by this scenario |
| `.opencode/agent/debug.md` | Implementation or verification anchor referenced by this scenario |
| `../../assets/improvement_config.json'` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Runtime Truth
- Playbook ID: RT-031
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-truth/031-parallel-candidates-opt-in.md`
