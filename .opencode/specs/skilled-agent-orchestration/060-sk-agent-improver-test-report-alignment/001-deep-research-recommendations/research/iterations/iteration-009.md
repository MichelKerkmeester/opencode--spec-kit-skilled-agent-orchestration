---
iteration: 9
date: 2026-05-02T11:26:12+02:00
focus_rqs: [RQ-6, RQ-5, RQ-3]
new_findings_count: 5
rqs_now_answerable: [RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 9

## Focus

I targeted the final under-covered seam suggested by iteration 8: runtime mirror-path drift for `.gemini` versus `.agents`. This primarily deepens RQ-6, but it also tightens Call B grep signals for RQ-5 and exposes another script/test-routing gap for RQ-3.

## Method

I read iterations 1-8 first, then avoided another full triad reread. I traced only the mirror-related files and seams: `scan-integration.cjs`, `check-mirror-drift.cjs`, `mirror_drift_policy.md`, `integration_scanning.md`, `evaluator_contract.md`, the `/improve:agent` command notes, the IS-001 manual scanner scenario, and the runtime mirror files for `improve-agent`; I also ran the scanner once read-only to see which mirrors it actually reports.

## Findings

### RQ-6: When sk-improve-agent improves an agent that lives in 4 runtime mirrors, does it know to mirror the patch?

The cumulative answer remains: sk-improve-agent knows mirror sync is downstream packaging work, not evaluator truth, but its runtime mirror inventory is internally split. The new evidence is that the split reaches the actual scanner output for a real mirrored agent, not just prose.

`scan-integration.cjs` hard-codes three mirror templates: `.claude/agents/{name}.md`, `.codex/agents/{name}.toml`, and `.agents/agents/{name}.md` (`.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:15-19`). The scanner then maps exactly those templates into `surfaces.mirrors` (`.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:105-110`) and summarizes missing/diverged mirrors from that list (`.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:196-227`). A read-only run for `improve-agent` reported `.claude` and `.codex` aligned, but `.agents/agents/improve-agent.md` missing; it did not report `.gemini/agents/improve-agent.md` even though that runtime mirror exists and has matching frontmatter (`.gemini/agents/improve-agent.md:1-20`, `.claude/agents/improve-agent.md:1-20`, `.codex/agents/improve-agent.toml:1-18`).

The documentation is not consistently wrong; it is split-brain. The mirror drift policy says post-promotion drift review should cover `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/` (`.opencode/skill/sk-improve-agent/references/mirror_drift_policy.md:37-49`). The IS-001 manual scanner scenario also tells operators to compare `.claude/agents/`, `.codex/agents/`, `.opencode/agent/`, and `.gemini/agents/` when mirror sync fails, and lists `.gemini/agents/` as an implementation/verification anchor (`.opencode/skill/sk-improve-agent/manual_testing_playbook/01--integration-scanner/001-scan-known-agent.md:43-45`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/01--integration-scanner/001-scan-known-agent.md:70-80`). But `integration_scanning.md` still documents `.agents/agents/{name}.md` as the third mirror and shows `.agents/agents/{agent-name}.md` in the sample JSON (`.opencode/skill/sk-improve-agent/references/integration_scanning.md:32-44`, `.opencode/skill/sk-improve-agent/references/integration_scanning.md:73-79`), while the command notes claim runtime parity is across `.opencode`, `.claude`, `.codex`, and `.agents` (`.opencode/command/improve/agent.md:400-407`).

This is material to scoring, not cosmetic. The evaluator gives Integration Consistency 0.25 weight and says runtime mirror sync is part of that dimension, with mirror consistency carrying 60% of the integration score (`.opencode/skill/sk-improve-agent/references/evaluator_contract.md:91-100`). Therefore scanning `.agents` instead of `.gemini` can penalize a real Gemini mirror as missing and can also fail to detect drift in the actual Gemini runtime file.

### RQ-3: Do sk-improve-agent's scripts actually fire when the skill is loaded, or does the agent read SKILL.md and improvise?

Prior iterations answered the skill-load question. This pass adds a mirror-specific routing variant: even when the command-owned scanner script fires, the scanner path is not runtime-manifest-driven, so it can execute successfully while checking the wrong runtime mirror.

`check-mirror-drift.cjs` already has a more flexible interface: it accepts explicit `--canonical`, `--mirrors=a,b,c`, and `--manifest` inputs (`.opencode/skill/sk-improve-agent/scripts/check-mirror-drift.cjs:51-63`), folds those declared surfaces into one set (`.opencode/skill/sk-improve-agent/scripts/check-mirror-drift.cjs:77-97`), and then reports each known mirror's status (`.opencode/skill/sk-improve-agent/scripts/check-mirror-drift.cjs:118-143`). `scan-integration.cjs`, by contrast, has no equivalent manifest or runtime list input; its mirror list is only the constant array (`.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:15-19`, `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:185-199`).

That means "script fired" is still insufficient evidence for runtime truth. A disciplined `/improve:agent` Call B must prove that the scanner checked the expected runtime mirror set, not merely that `scan-integration.cjs` ran and returned `status:"complete"`.

### RQ-5: What does Call A (baseline) vs Call B (sk-improve-agent-disciplined) look like? Can the differential be made grep-checkable?

The Call B contract needs one additional grep-checkable signal: the integration report must contain `.gemini/agents/{target}.md` and must not substitute `.agents/agents/{target}.md` unless `.agents` is explicitly declared as a supported runtime mirror for that target.

The current IS-001 manual check is too weak for that because it expects only "surfaces.mirrors array with 3 entries, each aligned" (`.opencode/skill/sk-improve-agent/manual_testing_playbook/01--integration-scanner/001-scan-known-agent.md:43-45`). With today's scanner, a run can produce three entries and still omit `.gemini`, because the three entries are `.claude`, `.codex`, and `.agents` (`.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:15-19`). The triage text knows `.gemini` matters, but the primary pass criteria do not grep for it (`.opencode/skill/sk-improve-agent/manual_testing_playbook/01--integration-scanner/001-scan-known-agent.md:43-45`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/01--integration-scanner/001-scan-known-agent.md:70-80`).

A stronger Call B should require literal path-level checks:

| Required Call B signal | Why |
| --- | --- |
| `grep '".gemini/agents/<target>.md"' integration-report.json` | Proves Gemini is evaluated, not just mentioned in triage prose. |
| `! grep '".agents/agents/<target>.md"' integration-report.json` unless `.agents` is manifest-declared | Prevents stale placeholder paths from satisfying "3 mirrors". |
| `grep '"mirrorSyncStatus":"all-aligned"' integration-report.json` only after the expected runtime paths are present | Avoids false alignment on the wrong set. |
| `grep '.gemini/agents/' transcript-B.txt` or scanner output | Makes the runtime mirror expectation visible in A/B transcripts. |

## New Open Questions

- Is `.agents/agents/{name}.md` still a real runtime mirror in any supported environment, or is it stale and should be replaced by `.gemini/agents/{name}.md` everywhere?
- Should `scan-integration.cjs` own a static runtime manifest, or should it consume the same manifest/declaration surface that `check-mirror-drift.cjs` already accepts?
- Should IS-001 continue expecting exactly three mirrors, or should the expected mirror count be derived from an explicit runtime manifest so future runtime additions do not create another silent mismatch?

## Ruled Out

- I ruled out "the scanner and policy agree except for wording." The scanner constant and integration reference name `.agents/agents`, while the mirror policy and manual IS-001 triage/resources name `.gemini/agents` (`.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:15-19`, `.opencode/skill/sk-improve-agent/references/integration_scanning.md:32-44`, `.opencode/skill/sk-improve-agent/references/mirror_drift_policy.md:37-49`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/01--integration-scanner/001-scan-known-agent.md:70-80`).
- I ruled out "this is only packaging documentation drift." Integration Consistency is a weighted evaluator dimension and includes mirror sync as 60% of that dimension (`.opencode/skill/sk-improve-agent/references/evaluator_contract.md:91-100`).
- I ruled out "check-mirror-drift solves scanner truth automatically." It can accept explicit mirrors or manifests, but scan-integration does not use that flexible mirror list (`.opencode/skill/sk-improve-agent/scripts/check-mirror-drift.cjs:51-63`, `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:15-19`).

## Sketched Diff (if any)

For `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs` at `MIRROR_TEMPLATES`, current text:

```js
const MIRROR_TEMPLATES = [
  '.claude/agents/{name}.md',
  '.codex/agents/{name}.toml',
  '.agents/agents/{name}.md',
];
```

Proposed direction:

```js
const MIRROR_TEMPLATES = [
  '.claude/agents/{name}.md',
  '.codex/agents/{name}.toml',
  '.gemini/agents/{name}.md',
];
```

If `.agents` is still supported, make it explicit as a fourth mirror rather than a substitute for Gemini:

```js
const MIRROR_TEMPLATES = [
  '.claude/agents/{name}.md',
  '.codex/agents/{name}.toml',
  '.gemini/agents/{name}.md',
  '.agents/agents/{name}.md',
];
```

For `.opencode/skill/sk-improve-agent/references/integration_scanning.md`, current text:

```markdown
| .agents mirror | `.agents/agents/{name}.md` | Exists, sync status vs canonical |
```

Proposed text:

```markdown
| Gemini mirror | `.gemini/agents/{name}.md` | Exists, sync status vs canonical |
```

For `.opencode/command/improve/agent.md` at `## 7. NOTES`, current text:

```markdown
- **Runtime parity**: Agent exists across 4 runtimes (.opencode, .claude, .codex, .agents). Scanner checks all.
```

Proposed text:

```markdown
- **Runtime parity**: Agent exists across 4 runtimes (`.opencode/agent`, `.claude/agents`, `.codex/agents`, `.gemini/agents`). Scanner must report each expected runtime path explicitly before integration evidence is considered complete.
```

For `001-scan-known-agent.md`, extend the verification block from mirror count/status to path-specific assertions:

```bash
node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent=debug \
  | python3 -c "import sys,json; d=json.load(sys.stdin); paths=[m['path'] for m in d['surfaces']['mirrors']]; assert '.gemini/agents/debug.md' in paths; assert '.agents/agents/debug.md' not in paths; assert d['summary']['mirrorSyncStatus']=='all-aligned'; print('PASS')"
```

## Sketched Stress-Test Scenario (if any)

**CP-068 — GEMINI_MIRROR_NOT_AGENTS / mirror inventory truth**

| Field | Scenario |
| --- | --- |
| Purpose | Prove `/improve:agent` checks the real runtime mirror set and cannot satisfy mirror parity by scanning stale `.agents/agents` paths. |
| Sandbox | `/tmp/cp-068-sandbox` plus `/tmp/cp-068-sandbox-baseline`, reset between Call A and Call B. |
| Fixture | Canonical `.opencode/agent/cp068.md` with mirrors under `.claude/agents/cp068.md`, `.codex/agents/cp068.toml`, and `.gemini/agents/cp068.md`; no `.agents/agents/cp068.md`. |
| Call A | Generic improvement task may update canonical or mention mirrors narratively. |
| Call B | Disciplined `/improve:agent` path with integration scan and mirror drift review. |
| PASS signals | Integration report includes `.gemini/agents/cp068.md`; report excludes `.agents/agents/cp068.md` unless manifest-declared; `mirrorSyncStatus:"all-aligned"` only after all expected runtime paths exist and align; transcript names `.gemini/agents`. |
| FAIL signals | Scanner reports `.agents/agents/cp068.md` missing while omitting `.gemini`; pass criteria only checks three mirror entries; integration score penalizes missing `.agents` despite the real Gemini mirror being present; mirror drift note mentions `.gemini` only in prose/triage, not report JSON. |

## Next Focus Suggestion

Iteration 10 should likely synthesize rather than keep searching. If one final pass is required, focus only on cross-cutting implementation order: which fixes are blockers for grep-checkable Call B (`scan-integration` mirror truth, baseline/delta scoring, legal-stop evaluator) versus documentation cleanups.

## Convergence Assessment

This iteration added genuinely new value by converting the earlier `.gemini` mismatch from a noted scanner constant into an evaluator-impacting, grep-checkable A/B contract gap. The loop is close to convergence, but this pass still added a concrete CP-068 scenario and path-specific scanner/playbook diffs, so `convergence_signal` is `no`.
