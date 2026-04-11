---
title: "Parallel Candidates Opt-In Default"
feature_id: "RT-031"
category: "Runtime Truth"
---

# Parallel Candidates Opt-In Default

Validates that the default configuration has `parallelWaves.enabled: false` and that an improvement session running with default settings only generates sequential single-candidate iterations (no parallel wave spawning).

## Prompt / Command

```bash
# Verify default config
node -e "
const config = require('./.opencode/skill/sk-improve-agent/assets/improvement_config.json');
console.log('parallelWaves config:', JSON.stringify(config.parallelWaves, null, 2));
"
```

Then run an improvement session with default settings:
```text
/improve:agent ".opencode/agent/debug.md" :confirm --spec-folder={spec} --iterations=2
```

### Verification (copy-paste)

```bash
# Step 1: Verify config default
node -e "
const config = require('./.opencode/skill/sk-improve-agent/assets/improvement_config.json');
console.assert(config.parallelWaves.enabled === false, 'parallelWaves should be disabled by default');
console.log('PASS — parallelWaves.enabled:', config.parallelWaves.enabled);
"
```

```bash
# Step 2: After running improvement session, verify no parallel candidates
node -e "
const cl = require('./.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs');
const lineagePath = '{spec}/improvement/candidate-lineage.json';
const fs = require('fs');
if (fs.existsSync(lineagePath)) {
  const graph = JSON.parse(fs.readFileSync(lineagePath, 'utf8'));
  const nodes = graph.nodes || [];
  const waveIndices = [...new Set(nodes.map(n => n.waveIndex))];
  console.assert(waveIndices.length <= 1, 'Should have at most 1 wave index in single-wave mode');
  console.assert(waveIndices.every(w => w === 0 || w === undefined), 'All wave indices should be 0 or undefined');
  console.log('PASS — wave indices:', waveIndices, ', nodes:', nodes.length);
} else {
  console.log('PASS — no lineage file created (expected for single-wave mode)');
}
"
```

## Expected Signals

- `improvement_config.json` has `parallelWaves.enabled: false` by default
- `parallelWaves.maxCandidates: 3` (configured but not active)
- During an improvement session with defaults: only one candidate is generated per iteration
- Candidate lineage (if tracked) shows all nodes with `waveIndex: 0` (single-wave)
- No parallel mutation spawning occurs regardless of exploration-breadth score
- The activation conditions (exploration-breadth threshold, 3+ unresolved mutation families, 2 consecutive ties) are never evaluated when `enabled: false`

## Pass Criteria

The default config has `parallelWaves.enabled: false`, and an improvement session running with default settings generates exactly one candidate per iteration with no parallel wave behavior -- verified by the absence of multi-wave lineage entries and single-candidate-per-iteration flow.

## Failure Triage

- If `parallelWaves.enabled` is true: the default config has been changed; revert to `false`
- If multiple candidates appear per iteration: check whether the orchestrator respects the `parallelWaves.enabled` gate before spawning parallel candidates
- If wave indices are > 0: verify that single-wave mode assigns `waveIndex: 0` (or omits it)
- If parallel spawning occurs despite `enabled: false`: check for a code path that bypasses the config gate

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste parallelWaves config and candidate-per-iteration counts]
```
