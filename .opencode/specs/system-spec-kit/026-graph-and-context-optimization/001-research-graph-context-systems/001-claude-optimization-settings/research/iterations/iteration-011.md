# Iteration 011 -- Prototype sketches for deferred hook and observability findings

## Iteration metadata

- Run: 11 of 13
- Focus: turn the prototype-later ledger into minimum viable prototype plans that a follow-up implementation phase can execute without re-deriving the design
- Constraints honored: research-only; no production hook edits; no `settings.local.json` edits; all prototype homes stay in `scratch/` or `test/`
- Inputs used: iteration-002, iteration-009, `research.md` section 6, `session-stop.js`, `session-prime.js`, `hook-state.js`

## A. Per-finding prototype sketches

### Prototype P-F4: Stop-hook idle timestamp replay
- Owns the recommendation: F4
- MVP scope: Build a scratch-only replay scenario that drives the existing Stop hook against canned stdin and a canned transcript, then inspects a cloned hook-state JSON to prove that a named idle timestamp field could be written by the Stop surface without adding a second Stop script. The MVP does not ship the field into production; it only proves the ownership boundary and write timing are testable with local fixtures.
- Lives under: `scratch/prototypes/p-f4-stop-idle-contract/`
- Inputs: synthetic Stop-hook stdin JSON; transcript fixture derived from a short Claude session; temporary hook-state directory under isolated `TMPDIR`; optional autosave stub path via `SPECKIT_GENERATE_CONTEXT_SCRIPT`
- Outputs: `state-before.json`, `state-after.json`, and a short `result.md` showing whether the named timestamp was written deterministically
- Stop condition: two consecutive replays against the same fixture produce the same named idle-timestamp write without requiring a second state file or a parallel Stop entrypoint
- Minimum success criterion: a replay artifact shows a dedicated `lastClaudeTurnAt`-style field changing while `updatedAt` remains a clearly separate transport timestamp
- Maximum complexity ceiling: 2 files or 120 LOC total; if a helper library is needed, the prototype is already too heavy
- Overlap with phase 005-claudest: no -- this is local hook-boundary validation for the decision layer owned by phase 001
- Estimated effort: 2-3 hours

### Prototype P-F5: UserPromptSubmit stale-warning policy replay
- Owns the recommendation: F5
- MVP scope: Model the soft-block-once behavior as a replayed decision matrix, not a live runtime rollout. The smallest useful prototype reads shared state, evaluates fresh vs stale vs already-acknowledged cases, and emits an allow/block/warn outcome for each case without touching `settings.local.json` or wiring a real `UserPromptSubmit` hook.
- Lives under: `scratch/prototypes/p-f5-user-prompt-warning/`
- Inputs: hook-state fixtures carrying the P-F19 idle timestamp and P-F7 acknowledgement fields; synthetic prompt-submit stdin JSON; optional threshold env such as `CACHE_WARNING_IDLE_MS`
- Outputs: `decision-matrix.json`, sample warning copy, and one markdown note showing stale-first-send vs resend behavior
- Stop condition: the prototype can demonstrate exactly one stale-path soft block and exactly one resend-pass path from the same persisted state fixture
- Minimum success criterion: the stale unacknowledged fixture returns `block_once=true`, and the immediate resend fixture returns `allow=true` without mutating any production file
- Maximum complexity ceiling: 3 files or 180 LOC total; if the prototype needs a UI layer or transcript parser, it should be replanned
- Overlap with phase 005-claudest: no -- the risky part here is Public runtime policy, not marketplace provenance
- Estimated effort: 4-6 hours

### Prototype P-F6: Resume-cost warning replay inside the SessionStart boundary
- Owns the recommendation: F6
- MVP scope: Recreate the `handleResume()` decision path in scratch space with injected state fixtures so the team can inspect what a heuristic stale-resume warning would look like before editing `session-prime.js`. The MVP only needs to prove three branches: stale resume warns, fresh resume stays quiet, and `source=compact` or `source=clear` suppresses warning copy.
- Lives under: `scratch/prototypes/p-f6-resume-estimator/`
- Inputs: hook-state fixtures with stored token metrics plus the P-F19 idle timestamp; synthetic SessionStart stdin for `resume`, `compact`, and `clear`; optional threshold env for stale detection
- Outputs: rendered section text per source mode and a small `cases.md` table comparing emitted vs suppressed warning branches
- Stop condition: each source mode can be replayed from fixtures without transcript re-read logic and without double-warning ambiguity
- Minimum success criterion: a stale `source=resume` fixture emits an extra warning section while equivalent `source=compact` and `source=clear` fixtures do not
- Maximum complexity ceiling: 3 files or 160 LOC total; if transcript parsing is pulled in, the prototype has crossed into over-engineering
- Overlap with phase 005-claudest: no -- this is still local validation of the hook surface that phase 001 already classified
- Estimated effort: 2-4 hours

### Prototype P-F7: Shared hook-state contract extension
- Owns the recommendation: F7
- MVP scope: Define the smallest explicit JSON contract that can be shared by Stop capture, prompt-submit warning, and resume warning prototypes. The MVP is a schema-plus-fixture exercise: add named fields and read/write examples in scratch space so later prototype scripts do not invent incompatible field names on the fly.
- Lives under: `scratch/prototypes/p-f7-hook-state-contract/`
- Inputs: current `hook-state.js` default shape; outputs from P-F4 and P-F6; fixture timestamps and acknowledgement scenarios
- Outputs: `hook-state.contract.json`, `example-state.json`, and a short compatibility note describing who reads and writes each field
- Stop condition: all hook-warning prototypes can consume the same fixture contract without renaming fields between scenarios
- Minimum success criterion: one example state file can drive P-F4 write expectations, P-F5 resend acknowledgement, and P-F6 resume suppression logic unchanged
- Maximum complexity ceiling: 2 files or 100 LOC total; if the contract requires nested reducers or multiple schema variants, it should be simplified
- Overlap with phase 005-claudest: no -- the shared hook-state seam belongs to Public's local hook design, not to external implementation provenance
- Estimated effort: 60-90 minutes

### Prototype P-F14: Offline-first transcript auditor slice
- Owns the recommendation: F14
- MVP scope: Build the thinnest possible offline auditor that ingests a tiny set of Claude JSONL fixtures and emits per-turn summary rows for tokens, idle gaps, repeated file reads, and skill/tool markers. The MVP intentionally stops before a dashboard: it proves that a local auditor slice can create inspectable aggregate facts without being embedded into live hooks.
- Lives under: `scratch/prototypes/p-f14-transcript-auditor/`
- Inputs: 2-3 representative transcript fixtures; a small fixture manifest naming expected sessions and turns; optional skill inventory snapshot for join tests
- Outputs: `audit-summary.json` or `audit-summary.sqlite`, plus a `findings-preview.md` that surfaces at least one idle-gap and one repeated-action metric
- Stop condition: the prototype can answer one concrete analytical question from fixtures without requiring live runtime collection or manual turn counting
- Minimum success criterion: a generated artifact shows turn-level rows and at least one aggregate derived from them, such as idle-gap count or repeated-read count
- Maximum complexity ceiling: 4 files or 250 LOC total; if a full dashboard or plugin integration appears, this prototype has escaped MVP scope
- Overlap with phase 005-claudest: yes -- phase 005 already owns the implementation provenance lane for the auditor and related Claudest tooling
- Estimated effort: 1 day

### Prototype P-F15: Disable-review queue seeded by audited skill usage
- Owns the recommendation: F15
- MVP scope: Consume an offline usage summary and produce a review queue with explicit reasons such as `never_used`, `low_frequency`, `always_errors`, and `insufficient_baseline`, but never auto-disable anything. The smallest useful prototype is a reporter, not an enforcer: it takes a bounded skill inventory plus usage counts and emits a ranked review list for human inspection.
- Lives under: `scratch/prototypes/p-f15-skill-review-queue/`
- Inputs: P-F14 auditor output; current skill inventory from `.opencode/skill/*/SKILL.md`; optional error markers captured from fixture transcripts
- Outputs: `skill-review-queue.json` and `skill-review-queue.md` with reason buckets and denominator notes
- Stop condition: the queue can explain why each candidate appears and can explicitly mark rows that lack enough baseline data to support a recommendation
- Minimum success criterion: the output contains at least one row in a non-destructive review bucket and at least one row withheld as `insufficient_baseline`
- Maximum complexity ceiling: 3 files or 180 LOC total; if the prototype starts mutating skill config or running disable actions, it has exceeded scope
- Overlap with phase 005-claudest: partial -- it depends on auditor-style data from the Claudest lane, but the actual governance rule for disable review is broader than implementation provenance
- Estimated effort: 3-5 hours once P-F14 exists

### Prototype P-F19: Named idle-timestamp contract and replay invariant
- Owns the recommendation: F19
- MVP scope: Create the prerequisite contract artifact that distinguishes a semantic idle timestamp from generic file update time. The MVP is intentionally small: name the field, define who writes it, define which events may read it, and prove via fixture round-trip that the field survives save/load without relying on `updatedAt` as a proxy.
- Lives under: `scratch/prototypes/p-f19-idle-timestamp-contract/`
- Inputs: current `hook-state.js` baseline; ISO timestamp fixtures; save/load round-trip expectations derived from Stop-hook replay needs
- Outputs: `idle-timestamp.contract.md`, `idle-timestamp.fixture.json`, and a short invariant checklist
- Stop condition: prototype consumers can read one canonical field instead of inferring idleness from unrelated state metadata
- Minimum success criterion: one fixture clearly separates `lastClaudeTurnAt` semantics from `updatedAt` and remains stable after a save/load cycle
- Maximum complexity ceiling: 2 files or 80 LOC total; if field derivation logic is needed, the contract is not yet minimal
- Overlap with phase 005-claudest: no -- this is a prerequisite contract for local hook experiments in phase 001
- Estimated effort: 45-60 minutes

### Prototype P-F20: Shared Claude hook replay harness
- Owns the recommendation: F20
- MVP scope: Provide one reusable scratch harness that can run hook entrypoints against canned stdin, isolated state directories, and transcript fixtures while capturing stdout, stderr, and state diffs in a predictable folder layout. The MVP only needs enough coverage to replay at least Stop and SessionStart; it becomes valuable the moment multiple findings can stop hand-rolling their own test scaffolds.
- Lives under: `scratch/prototypes/p-f20-hook-replay-harness/`
- Inputs: fixture stdin JSON per hook; isolated `TMPDIR`; transcript fixtures; autosave stub or disable env; hook entrypoint path under test
- Outputs: one run folder per scenario containing `stdin.json`, `stdout.txt`, `stderr.txt`, `state-after.json`, and `summary.md`
- Stop condition: the same harness command can execute two different hook entrypoints without custom per-hook forked code
- Minimum success criterion: a single harness run API successfully replays both Stop and SessionStart scenarios and stores comparable artifacts
- Maximum complexity ceiling: 4 files or 220 LOC total; if it starts imitating a full test framework, the design should be reduced
- Overlap with phase 005-claudest: partial -- the harness is owned here for local decision validation, but later phases can reuse it as a consumer
- Estimated effort: 4-6 hours

## B. Dependency-ordered prototype roadmap

1. `P-F19 -> P-F20`
   P-F19 names the canonical idle-timestamp field and its invariants. P-F20 should adopt that fixture shape before replay scenarios are generated.
2. `P-F20 -> P-F4`
   P-F4 should use the shared replay harness instead of a bespoke one-off runner so the Stop write behavior is captured in the same artifact shape as later scenarios.
3. `P-F19 + P-F4 -> P-F7`
   P-F7 should not extend the shared state contract until the timestamp writer and field semantics are stable enough to name in the contract.
4. `P-F20 + P-F7 + P-F4 -> P-F6`
   P-F6 depends on a replayable state fixture, a known idle timestamp, and a shared-state contract that says where warning inputs live.
5. `P-F20 + P-F7 + P-F4 -> P-F5`
   P-F5 also depends on the same prerequisites, but it should come after P-F6 because the resume-warning prototype is lower UX risk and will clarify warning thresholds before the soft-block prototype is judged.
6. `P-F20 -> P-F14`
   P-F14 can begin after the shared harness conventions exist, even though it does not depend on the hook-state contract itself. The shared harness is useful here for fixture discipline and artifact layout.
7. `P-F14 -> P-F15`
   P-F15 has no honest input without offline usage rows. The disable-review queue should only be attempted after the auditor slice can emit inspectable skill-use facts.

Practical execution order:

1. P-F19
2. P-F20
3. P-F4
4. P-F7
5. P-F6
6. P-F5
7. P-F14
8. P-F15

Parallelism note:

- P-F14 can start in parallel after P-F20 if a later phase wants to own auditor work early.
- P-F15 should not start in parallel with P-F14 because it will otherwise fabricate its denominator and reason buckets.

## C. Cross-phase boundary check

- `P-F4` -> phase 001 follow-up. Reason: it validates this phase's core hook-boundary recommendation that Stop remains the canonical idle-state writer.
- `P-F5` -> new phase. Reason: the soft-block UX is still the riskiest unshipped behavior, and it deserves its own implementation packet after contracts and replay evidence exist.
- `P-F6` -> phase 001 follow-up. Reason: the decision that SessionStart owns resume-warning copy was already made here, and the prototype can stay scratch-only.
- `P-F7` -> phase 001 follow-up. Reason: the shared hook-state seam is a local architectural contract that belongs to this phase's decision layer.
- `P-F14` -> phase 005-claudest. Reason: `research.md` already assigns the auditor implementation provenance lane to phase 005.
- `P-F15` -> new phase. Reason: it consumes Claudest-style evidence but adds governance policy and review semantics that go beyond phase 005's implementation-provenance brief.
- `P-F19` -> phase 001 follow-up. Reason: it is a prerequisite contract for the hook prototypes already owned by this phase.
- `P-F20` -> phase 001 follow-up. Reason: the harness is the local validation scaffold needed to prove or reject phase 001 hook recommendations before rollout work starts.

## D. New findings from the prototype-design pass

### F23: Skill-disable review requires a declared baseline window and denominator contract before any queue can be honest
- Why it surfaced here: P-F15 cannot fairly label a skill as `never_used` or `low_frequency` from a tiny scratch snapshot. It needs declared scope such as total sessions observed, routing attempts, elapsed observation window, and error counts.
- Why this is new: F15 already rejects raw low-usage auto-disable, but it does not explicitly require a baseline-period contract before review labels are emitted.
- Recommendation impact: any follow-up implementation should define the minimum observation window and denominator fields before generating disable-review candidates.

### F24: Hook replay needs side-effect isolation, not just fixtures, because the current Stop hook already carries autosave behavior
- Why it surfaced here: `session-stop.js` can resolve and run `generate-context.js` during autosave and writes into the shared temp-state area. A prototype replay that does not isolate `TMPDIR` and autosave behavior could produce polluted results even when the core hook logic is correct.
- Why this is new: F19 identifies the missing idle-timestamp contract and F20 identifies the missing replay harness, but neither one explicitly captures the need to neutralize existing Stop side effects during prototype runs.
- Recommendation impact: every hook prototype should use an isolated temporary state root and an explicit autosave stub or disable path before results are compared.

## Bottom line

The actionable minimum is not "implement all deferred ideas." It is "standardize the contract and harness first, then prototype the lower-risk Stop and SessionStart paths before touching the risky prompt-submit UX or the broader observability stack." That ordering keeps phase 001 in its decision lane while still making follow-up implementation concrete.
{"type":"iteration","run":11,"status":"insight","focus":"prototype implementation sketches + dependency roadmap","findingsCount":10,"newInfoRatio":0.38,"toolCallsUsed":8,"timestamp":"2026-04-06T12:34:25Z","agent":"cli-codex:gpt-5.4:high"}
