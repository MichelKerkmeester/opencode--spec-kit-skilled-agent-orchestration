# Changelog: 041/001-evaluator-first-mvp

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 001-evaluator-first-mvp — 2026-04-03

Built the complete evaluator-first MVP for bounded agent improvement. The phase delivered proposal-only execution with an append-only ledger, deterministic prompt-surface scoring, guarded promotion with rollback, and mirror-drift detection. The handover agent was chosen as the first target because it has the narrowest structured prompt and artifact contract already present in the repo.

> Spec folder: `.opencode/specs/03--skilled-agent-orchestration/041-sk-recursive-agent-loop/001-sk-recursive-agent-mvp/`

---

## New Features (6)

### Deterministic prompt-surface scorer

**Problem:** There was no systematic way to evaluate agent prompt files. Quality assessment was manual and inconsistent.

**Fix:** Added `score-candidate.cjs` with deterministic keyword and structural checks against the prompt surface, producing a numeric score for baseline and candidate comparison.

### Ledger reducer and dashboard generator

**Problem:** Improvement iterations needed a state tracker to record scores, compare candidates, and decide when to stop.

**Fix:** Added `reduce-state.cjs` as an append-only ledger reducer that tracks iteration state and generates a dashboard summary with stop-condition reporting.

### Guarded canonical promotion

**Problem:** Promoting a candidate to the canonical agent file needed explicit guardrails to prevent accidental or untested overwrites.

**Fix:** Added `promote-candidate.cjs` with manifest-backed target validation, proposal-only mode blocking, and explicit approval gating before any canonical file is touched.

### Canonical rollback helper

**Problem:** If a promoted candidate caused problems, there was no scripted way to restore the previous version.

**Fix:** Added `rollback-candidate.cjs` to reverse a promotion using the ledger's recorded baseline, with the same manifest-backed target validation as the promoter.

### Mirror drift detection

**Problem:** Agent files are mirrored across runtimes. After any change, mirrors could silently drift out of sync.

**Fix:** Added `check-mirror-drift.cjs` to compare all declared surfaces from the manifest against discovered runtime mirrors, reporting undisclosed or misaligned copies.

### Improvement control bundle

**Problem:** A single control file was insufficient for governing the loop's policy, scope, config, and state.

**Fix:** Created a full control bundle with charter, strategy, config, and manifest templates that define mutability scope, target families, and stop conditions.

---

## Architecture (2)

### Proposal-only by default

**Problem:** An evaluator that could immediately mutate canonical files would be unsafe to ship before it proved itself.

**Fix:** The loop defaults to proposal-only mode. Candidates are written to the runtime area but never touch canonical files until the operator explicitly enables promotion and approves each candidate.

### Handover as first target

**Problem:** The first target needed to be narrow enough that scorer accuracy could be validated quickly.

**Fix:** Chose the handover agent because it has a well-defined prompt structure, clear artifact contracts, and existing runtime mirrors for drift testing.

---

<details>
<summary>Files Changed (8)</summary>

| File | What changed |
| --- | --- |
| `sk-agent-improver/scripts/score-candidate.cjs` | Deterministic prompt-surface scorer with keyword and structural checks. |
| `sk-agent-improver/scripts/reduce-state.cjs` | Append-only ledger reducer with dashboard generation and stop-condition logic. |
| `sk-agent-improver/scripts/promote-candidate.cjs` | Guarded canonical promotion with manifest validation and proposal-only blocking. |
| `sk-agent-improver/scripts/rollback-candidate.cjs` | Canonical rollback helper with ledger-backed baseline restore. |
| `sk-agent-improver/scripts/check-mirror-drift.cjs` | Mirror drift reporter comparing manifest surfaces to discovered copies. |
| `.opencode/agent/agent-improver.md` | Canonical mutator agent definition. |
| `.opencode/command/improve/agent.md` | Command entrypoint for the improvement loop. |
| `.opencode/skill/sk-agent-improver/` | Full skill package with charter, strategy, config, manifest, SKILL.md, README. |

</details>

---

## Upgrade

No migration required.
