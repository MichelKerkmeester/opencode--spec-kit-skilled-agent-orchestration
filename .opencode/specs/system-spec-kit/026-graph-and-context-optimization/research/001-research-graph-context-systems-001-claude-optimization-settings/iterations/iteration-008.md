# Iteration 008 -- Synthesis Dry-Run for `research.md`

## Iteration metadata
- run: 8
- focus: synthesis dry-run + finding ledger + section blueprint
- timestamp: 2026-04-06T10:36:55.326Z
- toolCallsUsed: 4
- status: thought
- newInfoRatio: 0.12
- findingsCount: 0

## A. Final consolidated finding ledger

This is a consolidation pass only. No new source evidence was introduced in iteration 008; the ledger below deduplicates iterations 001-007 into a Phase 3-ready finding set.

| F-id | Title (short) | Source iteration | Tier (1-4) | Recommendation | Category | Affected area | Confidence |
|---|---|---|---:|---|---|---|---:|
| F1 | `ENABLE_TOOL_SEARCH` is already the baseline win in Public | 001 + 005 | 1 | adopt now | config change | `.claude/settings.local.json`; local `/context` validation plan | 5 |
| F2 | Do not overclaim deferred-loading latency or discoverability gains | 005 + 007 | 1 | adopt now | config validation | `research/research.md`; any later validation notes | 5 |
| F3 | Cache expiry should be modeled with prevalence + cliff count + budget exposure | 001 + 007 | 2 | adopt now | behavioral/process change | `research/research.md`; future hook-priority narrative | 4 |
| F4 | Merge idle-timestamp capture into existing `session-stop.js` | 002 | 2 | prototype later | hook implementation | `session-stop.js`; `hook-state.js` | 5 |
| F5 | Add a dedicated `UserPromptSubmit` warning hook; keep it prototype-only | 002 | 2 | prototype later | hook implementation | `.claude/settings.local.json`; new Claude hook script; `hook-state.js` | 4 |
| F6 | Put stale-resume cost estimation inside `session-prime.js` | 002 | 2 | prototype later | hook implementation | `session-prime.js`; `session-stop.js`; `hook-state.js` | 5 |
| F7 | Reuse the shared hook-state JSON as the cache-warning seam | 002 | 2 | prototype later | hook implementation | `hook-state.js`; all Claude hooks reading/writing session state | 5 |
| F8 | Keep `compact-inject.js` as mitigation target, not warning owner | 002 | 2 | reject | hook implementation | `compact-inject.js` boundary | 4 |
| F9 | Prefer clear-and-rehydrate guidance over blind stale resume | 001 + 007 | 3 | adopt now | behavioral/process change | `CLAUDE.md`; `.claude/CLAUDE.md` | 4 |
| F10 | Reinforce native-tool routing before adding more automation | 001 + 003 | 3 | adopt now | behavioral/process change | `CLAUDE.md`; `.claude/CLAUDE.md` | 5 |
| F11 | Treat redundant rereads as cache-amplified waste | 001 + 003 + 004 | 3 | adopt now | hybrid (behavior + telemetry) | `CLAUDE.md`; future audit logic | 4 |
| F12 | Break edit-retry chains by reread/replan after the first miss | 003 + 005 + 007 | 3 | adopt now | behavioral/process change | `CLAUDE.md`; future edit-failure telemetry | 4 |
| F13 | Preserve the post's denominator mismatches explicitly | 004 + 007 | 3 | adopt now | process/reporting | `research/research.md`; any later decision record | 5 |
| F14 | The missing observability layer is an offline-first transcript auditor | 001 + 003 | 4 | prototype later | telemetry architecture | future local transcript audit workflow; dashboard/reducer planning | 4 |
| F15 | Skill gating needs a reasoned disable-review queue, not raw low-usage auto-disable | 001 + 007 | 4 | prototype later | telemetry policy | future skill-usage analytics; Gate 2 follow-on work | 4 |
| F16 | Reverse-engineered Claude JSONL must stay a guarded adapter, not core infra | 004 + 007 | 4 | reject as core infra; prototype later as adapter | parser fragility | future transcript-ingest boundary | 5 |
| F17 | Cross-agent rollout should share schema/dashboard layers, not a single parser | 004 | 4 | prototype later | methodology portability | future cross-CLI observability planning | 4 |

## B. `research.md` section blueprint

### Section 1. Executive summary (1 paragraph)
- Purpose: one-paragraph answer to "what should Public adopt now vs prototype later vs reject?"
- Populate with: F1, F3, F9, F10, F14, F16.
- Required emphasis:
  - `ENABLE_TOOL_SEARCH` is already enabled here.
  - Cache expiry is the dominant external waste signal.
  - Immediate wins are mostly documentation/rule clarity, not new code.
  - Hook work and transcript auditing remain prototype lanes.

### Section 2. Source and discrepancies
- Purpose: define the Reddit post as primary-source field evidence and preserve unresolved numeric mismatches.
- Populate with: F13, F3.
- Must include:
  - 926 vs 858 sessions mismatch.
  - 11,357-turn denominator vs 18,903-turn headline total.
  - Explicit statement that these weaken totals more than architectural conclusions.

### Section 3. Cross-check against repo state
- Purpose: compare source claims with Public's actual Claude config/rulebook.
- Populate with: F1, F4, F6, F9, F10.
- Required repo checks:
  - `.claude/settings.local.json` already has `ENABLE_TOOL_SEARCH=true`.
  - Existing hook ownership: `PreCompact`, `SessionStart`, `Stop`.
  - `CLAUDE.md` already mandates native-tool routing and read-first behavior.

### Section 4. Findings F1..F17 (one heading per finding, ordered by tier)
- Ordering:
  1. Tier 1: F1, F2
  2. Tier 2: F3, F4, F5, F6, F7, F8
  3. Tier 3: F9, F10, F11, F12, F13
  4. Tier 4: F14, F15, F16, F17
- For each finding heading, keep the same compact schema:
  - source passage anchor
  - what it documents
  - why it matters for Public
  - recommendation label
  - affected area
  - risk / ambiguity / validation cost
- Phase 3 note: reuse the strongest anchor text from the source-bearing iterations instead of inventing new paraphrases.

### Section 5. Config-change checklist (`.claude/settings.local.json`)
- Purpose: isolate real config actions from hook or behavior work.
- Populate with: F1, F2, plus the checklist draft from iteration 005.
- Required structure:
  - Already in repo: `ENABLE_TOOL_SEARCH=true`
  - Repo-local experimental flags only (if mentioned, label them as implied/local, not source-prescribed)
  - Out-of-scope items that should not be presented as settings copied from the post

### Section 6. Hook design recommendations
- Purpose: capture only hook-surface decisions and ownership boundaries.
- Populate with: F4, F5, F6, F7, F8.
- Suggested subsection split:
  - Stop hook changes
  - SessionStart changes
  - UserPromptSubmit prototype
  - Shared-state contract
  - Rejected placement (`compact-inject.js`)

### Section 7. Behavioral / process recommendations
- Purpose: collect adopt-now workflow guidance that does not require new runtime features.
- Populate with: F3, F9, F10, F11, F12, F13.
- Suggested grouping:
  - stale-session behavior
  - native-tool discipline
  - reread discipline
  - edit-miss recovery behavior
  - discrepancy-preservation rule

### Section 8. Audit methodology + portability
- Purpose: separate transferable architecture from Claude-specific ingest.
- Populate with: F14, F16, F17.
- Must include:
  - offline-first reducer model
  - guarded adapter requirement
  - shared schema/dashboard portability
  - explicit warning that parser reuse across CLIs is unsafe

### Section 9. Phase `005-claudest` cross-phase boundary
- Purpose: state overlap once, then stop.
- Populate with: F14, F17.
- Required language:
  - phase 001 owns the decision/adoption layer
  - phase 005 owns the implementation provenance for `claude-memory` / `get-token-insights`
  - use phase 005 only to point to implementation location, not to re-run the plugin deep dive

### Section 10. Risks, fragility, and validation gaps
- Purpose: make remaining unknowns explicit instead of smoothing them into conclusions.
- Populate with: F2, F5, F15, F16, F17.
- Must include:
  - no source-backed latency/discoverability benchmark
  - `UserPromptSubmit` UX is unshipped/prototype-only
  - skill-disable thresholds still need local counts
  - JSONL format fragility
  - cross-agent raw transcript availability is unverified

### Section 11. Open questions / not addressed
- Purpose: retain only narrow unresolved items that truly need later measurement.
- Populate with:
  - local A/B validation for deferred loading (from F2)
  - local cache-expiry calibration beyond the source's directional model (from F3)
  - local skill usage counts for F15
  - runtime proof for soft-block-once behavior in F5

### Section 12. Convergence report appendix
- Purpose: justify why Phase 3 can synthesize now without another wide research pass.
- Populate with:
  - convergence trend from runs 1-8
  - run 8 status `thought`, `newInfoRatio=0.12`, `findingsCount=0`
  - note that iteration 008 was consolidation-only
  - explicit statement that remaining gaps are measurement gaps, not source-discovery gaps

## C. Self-check against §12 Evaluation Criteria

| Criterion | Status | What closes any gap |
|---|---|---|
| TIDD-EC completeness | PASS | Section blueprint already maps the required task, instructions, context, constraints, and examples into named sections. |
| RICCE completeness | RISK | In Phase 3, make Role/Instructions/Context/Constraints/Examples explicit inside the methodology/front-matter prose rather than assuming they are implied by the packet. |
| Evidence quality | PASS | Final synthesis should lift exact passage anchors from iterations 001-007; no additional source hunt is needed. |
| Repo alignment | PASS | Cross-check section already maps findings back to `.claude/settings.local.json`, `CLAUDE.md`, and the Claude hook files. |
| Domain focus | PASS | The consolidated ledger stays on Claude token efficiency, cache behavior, hook fit, tool routing, and waste detection. |
| Cross-phase discipline | PASS | Section 9 gives a narrow, explicit phase-005 overlap statement and prevents implementation duplication. |
| Actionability | PASS | Findings are already labeled `adopt now`, `prototype later`, or `reject`, with affected areas and tiering. |
| CLEAR score | RISK | Phase 3 should keep the final prose concise, anchor-heavy, and section-disciplined; projected score is 44-46/50 if the final write-up avoids repeating overlapping findings. |

## D. Synthesis stop signal

**Ready for Phase 3 synthesis.** Iteration 008 added no new evidence, only consolidation. Remaining gaps are narrow validation questions, not unresolved source-discovery questions, so another wide research pass is unlikely to improve the canonical `research.md`.

- recommended next state: converging
- iteration status for JSONL: `thought`
- recommended `newInfoRatio`: `0.12`
- honest finding count for this pass: `0`
