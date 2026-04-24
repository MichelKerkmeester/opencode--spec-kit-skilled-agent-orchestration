# 40-Iteration Deep Review Report: Skill-Advisor Phase Stack

## 1 Executive Summary

Verdict: PASS.

The 40-iteration deep review reached the iteration cap with no P0 blockers. The raw iteration stream recorded cumulative counters of P0=0, P1=19, and P2=17, but those counters include repeated evidence families and cross-dimension restatements. After deduplicating by overlapping files, line ranges, behavior, and remediation target, the final registry contains P0=0, P1=5, and P2=2.

The required findings cluster around five release-relevant families: prompt-boundary hardening, advisor renderer/cache correctness, live-session telemetry validity, OpenCode plugin parity/lifecycle, and operator-facing documentation accuracy. Two advisory families remain for API hygiene and test-suite depth. Because P0=0 and deduped P1<=5, the verdict is PASS. hasAdvisories=true because P2 findings remain open.

## 2 Scope

Target: skill-advisor-phase-stack.

Review packet:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/deep-review-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/deep-review-config.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/iterations/iteration-001.md` through `iteration-040.md`

In-scope phase stack:
- `020-skill-advisor-hook-surface` parent and child packets `002` through `009`
- `021-smart-router-context-efficacy/001-initial-research`
- `021-smart-router-context-efficacy/002-skill-md-intent-router-efficacy`
- `022-skill-advisor-docs-and-code-alignment`
- `023-smart-router-remediation-and-opencode-plugin`
- `024-deferred-remediation-and-telemetry-run`

Source code was read-only for this synthesis. Writes were limited to this report, the findings registry, and one appended completion event in the review state log.

## 3 Methodology

Iterations 1-10 were produced with `cli-codex`. Iterations 11-40 were produced with `cli-copilot`. Each iteration used a fresh per-iteration invocation with no batching, then wrote a standalone markdown narrative and appended a JSONL state entry.

Synthesis steps:
- Read the strategy, config, state log, and every `iteration-NNN.md` file from 001 through 040.
- Extracted all P0/P1/P2 records and re-verification references.
- Compared findings by cited files, cited line ranges, behavior, impact, and remediation target.
- Folded repeated evidence into one final finding when later iterations re-verified the same defect or expressed the same defect through another review dimension.
- Preserved raw iteration IDs in the registry evidence so the deduplication remains auditable.

Deduplication examples:
- `P1-008-01`, `P1-022-01`, and `P1-029-01` are one shared-payload label-sanitization defect.
- `P2-004-01` and `P2-032-01` are one orphaned-normalizer-export advisory.
- `P2-018-01` and `P2-025-01` are one exported-API documentation advisory.
- Multiple live-session telemetry issues share the same wrapper/analyzer accounting model and are grouped as one D3 required remediation family.

## 4 Evidence Classes

| Class | Evidence family | Representative raw findings |
|---|---|---|
| E1 | Prompt privacy and prompt-injection boundary | `P1-001-01`, `P1-008-01`, `P1-022-01`, `P1-029-01` |
| E2 | Advisor renderer/cache correctness contract | `P1-002-01`, `P1-009-01`, `P1-023-01`, `P2-006-02` |
| E3 | Live-session telemetry and measurement validity | `P1-003-01`, `P1-010-01`, `P1-017-01`, `P1-024-01`, `P1-031-01`, `P1-038-01` |
| E4 | OpenCode plugin parity, lifecycle, and kill-switch behavior | `P1-005-01`, `P1-019-01`, `P1-033-01`, `P2-012-01` |
| E5 | Operator-facing documentation and readiness playbooks | `P1-007-01`, `P1-014-01`, `P1-021-01`, `P2-007-01`, `P2-021-01` |
| E6 | Maintainability/API hygiene | `P2-003-01`, `P2-004-01`, `P2-018-01`, `P2-025-01`, `P2-032-01` |
| E7 | Test-suite depth and negative-path coverage | `P2-006-01`, `P2-013-01`, `P2-020-01`, `P2-020-02`, `P2-027-01`, `P2-027-02`, `P2-034-01` |

## 5 Per-Dimension Findings

### D1 Security + Privacy

P0: None.

P1:
- `DR-P1-001`: Prompt-boundary hardening is incomplete. Raw prompts still cross the subprocess boundary via argv, and instruction-shaped skill labels can reach shared-payload and diagnostic surfaces even though the final renderer rejects them. Representative evidence: `subprocess.ts:136`, `subprocess.ts:231`, `skill-advisor-brief.ts:189-205`, `shared-payload.ts:203-205`, `shared-payload.ts:490-503`, `render.ts:50-65`, and runtime diagnostic readers in Claude/Gemini/Copilot/Codex hooks.

P2: None.

### D2 Correctness

P0: None.

P1:
- `DR-P1-002`: The advisor brief/cache contract can return model-visible or payload metadata under the wrong rendering context. Ambiguous top-two results are not rendered through hooks because token-cap context is lost, `maxTokens` is omitted from the prompt-cache key, and cache hits restamp top-level `generatedAt` while keeping stale `sharedPayload.provenance.generatedAt`. Representative evidence: `skill-advisor-brief.ts:35-39`, `skill-advisor-brief.ts:354-373`, `skill-advisor-brief.ts:401-429`, `prompt-cache.ts:17-21`, `prompt-cache.ts:51-55`, `render.ts:123`, and the four runtime hook render calls.

P2: None.

### D3 Performance + Observability

P0: None.

P1:
- `DR-P1-003`: Live-session telemetry cannot be trusted as a session-level compliance signal yet. Static measurement writes to the live default telemetry path, the wrapper emits per `Read` row rather than per prompt, no-read sessions are invisible, cross-skill reads lose observed skill identity, overlapping prompts can be misattributed through singleton state, and baseline `SKILL.md` reads can be counted as overload. Representative evidence: `smart-router-measurement.ts:597-631`, `smart-router-telemetry.ts:123-179`, `smart-router-analyze.ts:125-147`, `live-session-wrapper.ts:76-95`, `live-session-wrapper.ts:98-154`, and `LIVE_SESSION_WRAPPER_SETUP.md:48-66`.

P2: None.

### D4 Maintainability + sk-code-opencode Alignment

P0: None.

P1: None.

P2:
- `DR-P2-001`: API hygiene is uneven across exported skill-advisor utilities. The normalizer has an orphaned second export name, prompt cache hygiene is weaker than the source cache, and several exported advisor helpers lack the public-function documentation expected by the local standards. Representative evidence: `normalize-adapter-output.ts:62-118`, `prompt-cache.ts:60-84`, `source-cache.ts:20-36`, `generation.ts:151-181`, `prompt-policy.ts:121-126`, `subprocess.ts:208-211`, and the sk-code-opencode JSDoc/TSDoc checklist references.

### D5 Integration + Cross-runtime

P0: None.

P1:
- `DR-P1-004`: The shipped OpenCode plugin diverges from native hook guarantees. Its timeout path resolves before confirming child exit, it uses a plugin-specific disable flag instead of the shared hook kill switch, its host cache ignores source-signature invalidation, and the canonical parity harness excludes the plugin path. Representative evidence: `.opencode/plugins/spec-kit-skill-advisor.js:63-83`, `.opencode/plugins/spec-kit-skill-advisor.js:171-212`, `.opencode/plugins/spec-kit-skill-advisor.js:243-294`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:93-128`, `advisor-runtime-parity.vitest.ts:21-27`, and native hook disable checks.

P2: None.

### D6 Test Coverage + Test-Code Quality

P0: None.

P1: None.

P2:
- `DR-P2-002`: Focused test suites leave important negative paths and artifact-writing surfaces under-covered. Gaps include plugin parser/nonzero/session-cache paths, subprocess invalid-shape/nonzero/sqlite-exhaustion result codes, explicit telemetry file override precedence, analyzer markdown report writing, and one real hook-to-builder parity path. Representative evidence: `spec-kit-skill-advisor-plugin.vitest.ts:78-194`, `advisor-subprocess.vitest.ts:57-139`, `smart-router-telemetry.vitest.ts:109-173`, `smart-router-analyze.vitest.ts:44-116`, and `advisor-runtime-parity.vitest.ts:78-135`.

### D7 Documentation Accuracy

P0: None.

P1:
- `DR-P1-005`: Operator-facing docs and playbooks contain stale or non-executable setup/readiness claims. Published commands point at a root npm workspace that this checkout does not define, Copilot live-session setup is described as a settings-file registration despite the shipped callback model, the root manual-testing playbook has stale scenario/category counts, Codex registration status is inconsistent across docs, and the measurement artifact name is wrong in one playbook path. Representative evidence: `skill-advisor-hook.md:70-89`, `skill-advisor-hook.md:205`, `README.md:100`, `package.json:5-6`, `.opencode/skill/system-spec-kit/mcp_server/package.json:16`, `LIVE_SESSION_WRAPPER_SETUP.md:114-121`, `feature_catalog.md:579-653`, and `manual_testing_playbook.md:35-53`.

P2: None.

## 6 Verdict

Verdict: PASS.

Verdict rule applied:
- PASS if P0=0 and P1<=5.
- CONDITIONAL if P0=0 and P1>5.
- FAIL if P0>=1.

Final deduped totals:
- P0: 0
- P1: 5
- P2: 2
- iterations: 40
- hasAdvisories: true

Rationale: No blocker-class finding was validated, and the required findings dedupe to exactly five remediation families. The P2 advisories should be tracked, but they do not change the release verdict.

## 7 Remediation Plan

| ID | dim | headline | owner | effort | target |
|---|---|---|---|---|---|
| `DR-P1-001` | D1 | Prompt-boundary hardening is incomplete | skill-advisor runtime owner | M | pre-release |
| `DR-P1-002` | D2 | Advisor renderer/cache contract can return stale or wrong metadata | skill-advisor runtime owner | M | pre-release |
| `DR-P1-003` | D3 | Live-session telemetry is not yet session-accurate | observability owner | L | next-sprint |
| `DR-P1-004` | D5 | OpenCode plugin diverges from native hook guarantees | OpenCode plugin owner | M | pre-release |
| `DR-P1-005` | D7 | Operator docs/playbooks contain stale or non-executable guidance | documentation owner | S | pre-release |
| `DR-P2-001` | D4 | Advisor API hygiene and exported-surface documentation are uneven | skill-advisor maintainers | S | backlog |
| `DR-P2-002` | D6 | Negative-path and artifact-writer test coverage is incomplete | test owner | M | next-sprint |

## 8 Cross-references

Iteration narratives:
- `iterations/iteration-001.md` through `iterations/iteration-040.md`

High-signal iterations by final finding:
- `DR-P1-001`: iterations 001, 008, 022, 029, 036
- `DR-P1-002`: iterations 002, 006, 009, 016, 023, 030, 037
- `DR-P1-003`: iterations 003, 010, 017, 024, 031, 038
- `DR-P1-004`: iterations 005, 012, 019, 026, 033, 034, 040
- `DR-P1-005`: iterations 007, 014, 021, 035
- `DR-P2-001`: iterations 003, 004, 018, 025, 032, 039
- `DR-P2-002`: iterations 006, 013, 020, 027, 034

Related phase packets:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/001-initial-research/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/002-skill-md-intent-router-efficacy/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/005-skill-advisor-docs-and-code-alignment/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/006-smart-router-remediation-and-opencode-plugin/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/007-deferred-remediation-and-telemetry-run/`

## 9 Artifacts List

- `deep-review-strategy.md`: review strategy and verdict rules
- `deep-review-config.json`: executor, dimensions, and in-scope phase config
- `deep-review-state.jsonl`: iteration state log plus final completion event
- `iterations/iteration-001.md` through `iterations/iteration-040.md`: per-iteration evidence and raw findings
- `review-report.md`: synthesized 9-section review report
- `findings-registry.json`: machine-readable deduped findings registry
