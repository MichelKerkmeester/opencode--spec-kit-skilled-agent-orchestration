# Iteration 25 — correctness

## Files Reviewed

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-024.md`
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/spec.md`
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/checklist.md`
6. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`
7. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/checklist.md`
8. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts`
9. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts`
10. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts`
11. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
12. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
13. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/daemon-probe.ts`
14. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
15. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
16. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
17. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/redirect-metadata.vitest.ts`
18. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/daemon-probe.vitest.ts`
19. `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
20. `.opencode/plugins/spec-kit-skill-advisor.js`
21. `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`

## Findings by Severity (P0/P1/P2)

### P0

- None new this iteration.

### P1

- **R25-P1-001 — Native `skill_advisor.py` fast path drops legacy threshold/filter semantics.**
  - **Claim:** When the compat shim detects the native advisor, it prints the translated `advisor_recommend` payload immediately instead of reapplying the caller's requested `--threshold`, `--uncertainty`, `--confidence-only`, or `--show-rejections` semantics. That breaks the 027/005 promise that scripted callers can keep using the Python CLI during the transition, because the same CLI flags now produce different outputs depending on whether the daemon/native path is available. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:75-83`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:117-129`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:139-146`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:330-343`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:3170-3176`]
  - **EvidenceRefs:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:75-83`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:117-129`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:139-146`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:330-343`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:3170-3176`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:77-105`
  - **CounterevidenceSought:** I checked the preserved local path and the native scorer separately to see whether this was just a test harness misunderstanding. `analyze_prompt()` still routes through `filter_recommendations(...)`, so the Python path honors caller thresholds, and the native handler still enforces its own default 0.8/0.35 gate before returning recommendations. That means the regression is specifically the compat shim's fast path not threading caller-provided filters into the native delegation. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2975-2987`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:3196-3203`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:77-105`]
  - **AlternativeExplanation:** The implementation may have intentionally narrowed "legacy compatibility" to the JSON array shape only, because the native tool surface itself does not expose custom threshold knobs. But 027/005 explicitly keeps `skill_advisor.py` as a preserved scripted-caller surface, and that surface already exposes threshold/filter flags, so silently changing their meaning when native is available is still a compat-behavior regression rather than an acceptable surface simplification. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:59-69`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:75-83`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:27-70`]
  - **FinalSeverity:** P1
  - **Confidence:** 0.98
  - **DowngradeTrigger:** Downgrade if the compat contract is explicitly narrowed to "shape-only" parity for native mode, or if a hidden native handler option exists that lets the shim pass the CLI's threshold/filter settings through and this fast path is only missing that wiring in the reviewed snapshot.

  I also reproduced the user-visible drift from the shipped CLI: with `--force-native --threshold 0.96 "save this conversation context to memory"` the shim still returns `system-spec-kit` at `confidence: 0.92`, while `--force-local --threshold 0.96` returns `[]`; likewise `--show-rejections` only surfaces rejected candidates on the local path. That confirms the finding is behavioral, not just structural.

### P2

- None new this iteration.

## Traceability Checks

- **§11 deterministic scorer gates still hold in the native TypeScript core.** The shipped unit and parity suites still enforce ambiguity handling, semantic-shadow live weight 0.00, adversarial-stuffing rejection, full-corpus/holdout thresholds, unknown ceiling, and zero regressions against Python-correct prompts. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/checklist.md:48-57`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts:48-140`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts:100-175`]
- **The compat/plugin migration still preserves route selection, disabled-state handling, stdin, redirect metadata, and daemon availability semantics outside the threshold drift above.** The shim tests cover native vs local routing, stdin privacy, and disabled behavior; the plugin bridge still detects native availability and falls back to Python when forced local; redirect and daemon-probe suites still assert prompt-safe lifecycle surfaces. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:27-70`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:31-62`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/redirect-metadata.vitest.ts:5-47`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/daemon-probe.vitest.ts:32-61`]
- **Current correctness verdict localizes to the CLI compat seam, not the scorer itself.** The native MCP handler computes recommendations from `scoreAdvisorPrompt(...)`, while the Python fallback still invokes `analyze_prompt(...)`; only the shim's early return bypasses caller-controlled filtering. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:77-121`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2975-2987`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:3170-3205`]

## Verdict

**CONDITIONAL.** No new P0 surfaced, and the native scorer's deterministic gates remain intact, but the compat shim does not fully preserve legacy CLI filtering semantics when native mode is available. That is a user-visible correctness regression for scripted callers relying on `skill_advisor.py` flags during the migration window.

## Next Dimension

**security** — re-check every write/publication boundary around derived metadata, prompt-safe compat rendering, and MCP handler responses for sanitizer coverage and prompt leakage.
