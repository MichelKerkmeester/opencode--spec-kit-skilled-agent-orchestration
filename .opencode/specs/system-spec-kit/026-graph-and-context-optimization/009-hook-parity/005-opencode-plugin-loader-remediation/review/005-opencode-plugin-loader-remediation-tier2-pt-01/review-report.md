# Review Report - 005 OpenCode Plugin Loader Remediation

## 1. Executive Summary

Overall verdict: **CONDITIONAL**. `hasAdvisories: true`. Active finding counts after deduplication and adversarial self-check: `P0=0`, `P1=1`, `P2=2`.

Single-pass coverage included D1 correctness, D2 security, D3 traceability, and D4 maintainability across the packet docs, OpenCode plugin entrypoints, relocated bridge helpers, focused tests, parent hook-parity tracking, and `.github/hooks/superset-notify.json`.

Headline: plugin helper isolation is sound at runtime. `.opencode/plugins/` contains only the two plugin entrypoints plus README, the plugin entrypoints use static bridge paths under `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/`, and the focused tests cover entrypoint purity, legacy parser fail-open behavior, OpenCode hook shape, per-instance state, in-flight dedup, and size caps. The structural full-vitest blocker is real config drift in Copilot/Superset hook wiring, but it is outside the plugin-loader risk surface.

The conditional verdict comes from one traceability P1: canonical packet evidence still claims helper files live under `.opencode/plugin-helpers/`, while the live code and README use `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/`. That does not break the loader fix, but it makes the packet's verification replay materially untrustworthy until the docs are repaired.

Adversarial self-check on P1-001: **confirmed**. Hunter re-read the implementation summary, checklist, live README, and plugin imports and found the docs contradict the executable state. Skeptic is right that the runtime path is safe and the README is current, so this is not a D1 loader bug. Referee keeps P1 because checked verification evidence asserts a non-existent helper directory as a passed gate.

## 2. Planning Trigger

`/spec_kit:plan` is required for the traceability repair if this packet is promoted as release evidence. A narrow documentation-only remediation packet is enough; no plugin code change is required for P1-001.

Planning Packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": {"P0": 0, "P1": 1, "P2": 2},
  "remediationWorkstreams": [
    "helper-path-traceability-repair",
    "compact-plugin-output-guard-hardening",
    "compact-plugin-session-id-normalization"
  ],
  "specSeed": "Update canonical packet docs and checklist evidence to name .opencode/skill/system-spec-kit/mcp_server/plugin_bridges/ as the shipped helper location, preserving .opencode/plugin-helpers/ only as historical draft context if needed.",
  "planSeed": "Phase 1: patch stale helper-path evidence in spec, plan, checklist, implementation-summary, and decision-record. Phase 2: optionally add compact-plugin defensive output and session-ID parity with the skill-advisor plugin. Phase 3: rerun focused plugin-loader tests and strict spec validation."
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | Evidence | Impact | Fix recommendation | Disposition |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1-001 | P1 | Canonical verification evidence names a helper directory that does not exist | D3 Traceability | `implementation-summary.md:51` says helpers moved to `.opencode/plugin-helpers/`; `implementation-summary.md:117-118` records `ls .opencode/plugin-helpers/` as PASS; `checklist.md:112` records the same path as evidence. Live state disagrees: `.opencode/plugins/README.md:10` names `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/`, `.opencode/plugins/spec-kit-skill-advisor.js:37` resolves that bridge path, and `.opencode/plugins/spec-kit-compact-code-graph.js:30` / `:44` import from that same helper location. | Release replay fails or sends future maintainers to the wrong directory even though the runtime fix is correct. | Patch the packet docs and checklist evidence to the live `plugin_bridges/` location; keep `.opencode/plugin-helpers/` only in archived rationale if explicitly labelled historical. | active; confirmed by self-check |
| P2-001 | P2 | Compact plugin lacks the output-shape guard added to skill-advisor | D1 Correctness / D4 Maintainability | Compact plugin calls `output.system.some()` and `output.system.push()` without normalizing `output.system` at `.opencode/plugins/spec-kit-compact-code-graph.js:380` and `:384`; it also calls `output.context.some()` / `push()` at `:453` and `:457`. Skill-advisor has the defensive guard at `.opencode/plugins/spec-kit-skill-advisor.js:567-572`, with tests at `spec-kit-skill-advisor-plugin.vitest.ts:451-464`. | If OpenCode or a test harness passes `{}` or `{ system: null }`, compact injection can throw instead of fail-opening. Current host likely supplies arrays, so advisory only. | Mirror the skill-advisor guard for compact system and compaction outputs; add focused tests. | active advisory |
| P2-002 | P2 | Compact plugin session cache key does not normalize non-string session IDs | D1 Correctness / D4 Maintainability | Compact cache key interpolates raw `sessionID` at `.opencode/plugins/spec-kit-compact-code-graph.js:120-121`. Skill-advisor normalizes object session IDs deterministically at `.opencode/plugins/spec-kit-skill-advisor.js:140-147`, with regression coverage at `spec-kit-skill-advisor-plugin.vitest.ts:466-487`. | Object-shaped session IDs would collapse to `[object Object]` in compact cache keys. OpenCode normally provides strings, so this is a defensive parity advisory. | Reuse a stable session-ID normalizer in compact cache keys and invalidation paths; add one object-session regression. | active advisory |

### Claim Adjudication - P1-001

```json
{
  "findingId": "P1-001",
  "claim": "Canonical packet verification evidence is stale because it asserts .opencode/plugin-helpers/ exists and contains helper bridges, while live runtime code uses .opencode/skill/system-spec-kit/mcp_server/plugin_bridges/.",
  "evidenceRefs": [
    "specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/implementation-summary.md:51",
    "specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/implementation-summary.md:117",
    "specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/005-opencode-plugin-loader-remediation/checklist.md:112",
    ".opencode/plugins/README.md:10",
    ".opencode/plugins/spec-kit-skill-advisor.js:37",
    ".opencode/plugins/spec-kit-compact-code-graph.js:30",
    ".opencode/plugins/spec-kit-compact-code-graph.js:44"
  ],
  "counterevidenceSought": "Checked whether .opencode/plugin-helpers/ exists, whether README still points there, and whether plugin code imports from that path.",
  "alternativeExplanation": "The docs may preserve an earlier draft target path, and the live README/code are correct. That explains why runtime behavior is safe, but not why checklist evidence remains checked as passed.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade to P2 after canonical checklist and implementation-summary evidence are patched to the live plugin_bridges path."
}
```

Hunter -> Skeptic -> Referee:

- Hunter: The packet says helpers moved to `.opencode/plugin-helpers/`, and the checklist marks that as passing evidence. The live plugin imports and README point to `mcp_server/plugin_bridges/`.
- Skeptic: Runtime isolation still works because helpers are outside `.opencode/plugins/`; the wrong doc path does not reintroduce `plugin2.auth`.
- Referee: Correct. Keep the runtime verdict green, but mark traceability P1 because release evidence must be replayable and the checked path is false.

## 4. Remediation Workstreams

P0: none.

P1: helper-path traceability repair. Update `spec.md`, `plan.md`, `checklist.md`, `implementation-summary.md`, and `decision-record.md` so shipped helper location evidence names `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/`. The current `.opencode/plugins/README.md` is already aligned.

P2 advisories: compact plugin hardening. Add output-shape guards and stable session-ID normalization to compact-code-graph so it matches the defensive posture already shipped in skill-advisor.

## 5. Dimension Coverage

D1 Correctness: PASS with advisories. `parseTransportPlan(nonString)` returns `{}` at `.opencode/plugins/spec-kit-compact-code-graph.js:124-129`, and focused tests assert legacy-loader compatibility at `opencode-plugin.vitest.ts:130-132`. Skill-advisor hook shape and context injection are covered at `spec-kit-skill-advisor-plugin.vitest.ts:136-155`.

D2 Security: PASS. Plugin bridge paths are static URL-derived constants, not constructed from user-controlled plugin names: `.opencode/plugins/spec-kit-skill-advisor.js:37` and `.opencode/plugins/spec-kit-compact-code-graph.js:44`. Folder purity dynamically imports files discovered from the fixed `.opencode/plugins` directory and requires valid hook objects, reducing helper drift risk (`opencode-plugins-folder-purity.vitest.ts:37-75`). No path traversal finding.

D3 Traceability: CONDITIONAL. The structural blocker is tracked in this packet (`implementation-summary.md:147-165`) and the parent context index (`context-index.md:71` and `:82`), but helper-path evidence drift remains P1.

D4 Maintainability: PASS with advisories. New helper modules have a single owning location under `mcp_server/plugin_bridges/`, plugin entrypoints are the only `.opencode/plugins/` surface, and the purity test makes new helper drift a CI failure. Compact should still inherit the skill-advisor defensive patterns for output guards and session-ID normalization.

## 6. Verification Matrix

| Check | Evidence | Result |
| --- | --- | --- |
| Plugin folder contains only entrypoints | `.opencode/plugins/README.md:1-15`; focused purity test `opencode-plugins-folder-purity.vitest.ts:37-75` | PASS |
| Compact parser legacy-loader fail-open | `.opencode/plugins/spec-kit-compact-code-graph.js:124-129`; `opencode-plugin.vitest.ts:130-132` | PASS |
| Bridge subprocess isolation preserved | `.opencode/plugins/spec-kit-skill-advisor.js:37`; `.opencode/plugins/spec-kit-compact-code-graph.js:44`; bridge comments at `plugin_bridges/spec-kit-skill-advisor-bridge.mjs:1-3` and `plugin_bridges/spec-kit-compact-code-graph-bridge.mjs:1-3` | PASS |
| Skill-advisor uses OpenCode hook surface | `.opencode/plugins/spec-kit-skill-advisor.js:632-699`; `spec-kit-skill-advisor-plugin.vitest.ts:136-146` | PASS |
| Full vitest blocker classification | `.github/hooks/superset-notify.json:4-31`; `copilot-hook-wiring.vitest.ts:23-30`; `context-index.md:71-82` | OUT-OF-SCOPE BLOCKER |
| Canonical helper path evidence | `implementation-summary.md:51`, `:117-118`; `checklist.md:112`; live README/code path evidence above | FAIL |

I did not rerun the focused test commands during this pass; the review is evidence-based from source and existing test files.

## 7. Traceability Status

REQ-001 through REQ-005: substantially satisfied by ADR-001/002, static bridge subprocess paths, parser fail-open, and focused tests.

REQ-006 and REQ-007: satisfied by `opencode-plugins-folder-purity.vitest.ts` and `.opencode/plugins/README.md`.

REQ-008 and parent tracking: partially satisfied. Parent `context-index.md` tracks the OpenCode phase and explicitly records the Copilot full-suite blocker, but the packet's own docs still contain stale helper-location evidence.

REQ-009: not fully re-proven by this pass. The plugin-loader code does not touch MCP server bootstrap; the deferred full-suite blocker is Copilot hook wiring, not OpenCode loader behavior.

REQ-010 and REQ-011: methodology and helper comments exist, but REQ-011 traceability should be updated to the final `plugin_bridges/` location.

## 8. Structural Blocker Assessment

The full-vitest blocker reflects real config drift, not plugin-loader risk.

`.github/hooks/superset-notify.json` routes all four events through `/Users/michelkerkmeester/.superset/hooks/copilot-hook.sh` (`:4-31`). The failing test expects `sessionStart` and `userPromptSubmitted` to route through repo-local wrappers, while `sessionEnd` and `postToolUse` remain Superset-backed (`copilot-hook-wiring.vitest.ts:23-30`). The parent context index explicitly records this as outside the OpenCode packet (`context-index.md:71-82`), and the follow-on Copilot writer packet explains that patching `superset-notify.json` directly is out of scope because the Superset wrapper rewrites it (`007-copilot-writer-wiring/spec.md:42-64`).

Risk call: this is a real Copilot parity risk and a real whole-suite gate, but it is not evidence that OpenCode helper isolation is unsafe.

## 9. Audit Appendix

Files reviewed: packet `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`; `.opencode/plugins/README.md`; `.opencode/plugins/spec-kit-compact-code-graph.js`; `.opencode/plugins/spec-kit-skill-advisor.js`; three `mcp_server/plugin_bridges/*.mjs` helpers; focused tests `opencode-plugin.vitest.ts`, `opencode-plugins-folder-purity.vitest.ts`, `spec-kit-skill-advisor-plugin.vitest.ts`, `copilot-hook-wiring.vitest.ts`; `.github/hooks/superset-notify.json`; parent `009-hook-parity/context-index.md`; sibling `007-copilot-writer-wiring` docs.

Tooling note: an attempted text search pattern included shell backticks around `npx vitest run`; the shell tried command substitution and network-blocked npm output appeared before the search completed. No source files were modified by that accidental command.

Final verdict: **CONDITIONAL**. Runtime/plugin-loader remediation is sound; release evidence needs a narrow traceability repair before this packet should be treated as clean release proof.
