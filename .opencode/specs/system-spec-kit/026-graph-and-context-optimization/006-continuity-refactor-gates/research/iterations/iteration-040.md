---
title: "Iteration 040 — Cross-cutting integration audit and phase 019 SLA handover"
iteration: 40
band: F
timestamp: 2026-04-11T13:33:02Z
worker: cli-codex gpt-5.4 xhigh fast
scope: synthesis_cross_cutting_and_phase_019_sla
status: complete
focus: "Resolve the 6 phase-019-deferred questions from iter 030 with definitions-of-done. Audit cross-cutting integration points. Check that iters 31-39 compose without new weak links. Close the gen 3 depth pass."
maps_to_questions: [Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-040.md"]

---

# Iteration 040 — Cross-cutting integration audit and phase 019 SLA handover

## 1. Goal

Close the gen 3 depth pass by converting iteration 030's open handover questions into implementation-grade phase 019 rules, then checking whether iterations 031-039 actually compose as one migration package.

This iteration does four things:

1. resolves the six deferred items iteration 030 explicitly named;
2. checks the high-risk seams between routing, rollout, telemetry, migration, and write safety;
3. updates the risk register from iteration 020 using gen 3 evidence;
4. hands phase 019 a week-1 execution order and SLA-style definitions of done.

Grounding note:

- iteration 030's actual deferred list differs from the generic examples in the task prompt;
- this synthesis resolves the six items iteration 030 itself listed;
- all `findings/*.md` files present on disk were cross-referenced; there are 10 in the folder, not 11.

The standard for success here is not "more ideas." It is "phase 019 can start without hidden architectural ambiguity."

## 2. Resolution of the 6 deferred questions

Iteration 030's actual deferred list was:

1. `implementation-summary.md` timing
2. first-save research targets
3. per-anchor locking
4. narrative compaction
5. archive fallback tuning
6. impact-analysis completion

Interpretation note:

- the generic examples in the task prompt were directionally useful;
- the binding deferred set is still the six-item list iteration 030 actually wrote;
- the gen 3 pass is therefore judged on whether these six are now executable, not on whether every generic example also got restated.

### 2.1 `implementation-summary.md` timing

- `Resolution`: `implementation-summary.md` becomes a packet-creation invariant. New packets get it at `/spec_kit:plan` time with required anchors and an empty or validator-approved `_memory.continuity` host block. Save-time lazy creation is allowed only as a legacy-compat bridge for old packets and must be telemetry-visible.
- `Definition of Done`: `/spec_kit:plan` emits the file by default; validators reject new packets that lack the route target; first-save integration succeeds without lazy creation on new packets; a legacy bootstrap path exists only for pre-phase-019 packets and is measurable.
- `Owning gate`: Gate C.
- `Depends on`: `iter-033` for bootstrap-path telemetry; `iter-039` for safe halt if bootstrap verification mismatches.
- `Phase 019 non-goal`: no broad speculative redesign of spec-doc templates beyond what the routing contract actually needs.

### 2.2 First-save research targets

- `Resolution`: the first valid `research_finding` may bootstrap `research/research.md`, but only inside the writer transaction and only for a confident `research_finding` route or an explicit operator override. Warning-band and refusal-band chunks must preserve pending content instead of inventing a research file.
- `Definition of Done`: target mapping is deterministic; merge code can create `research/research.md` atomically; validator passes in the same save; interactive mode shows the bootstrap as a planned operation; audit logs distinguish bootstrap from append.
- `Owning gate`: Gate C.
- `Depends on`: `iter-031` for category and refusal rules; `iter-038` for routing-audit backstop; `iter-039` for fingerprint-safe bootstrap writes.
- `Phase 019 non-goal`: do not auto-create research docs from low-confidence prose just to avoid refusals.

### 2.3 Per-anchor locking

- `Resolution`: phase 019 keeps the existing packet-level `withSpecFolderLock`. No per-anchor lock hierarchy ships in phase 019. The question only reopens if live contention data proves the coarse lock is materially harmful.
- `Definition of Done`: writer code uses one packet-level lock path; lock wait and retry metrics are live on day 1 of Gate C; the first canary week includes a contention review; if thresholds stay healthy, the topic closes for phase 019 instead of drifting as a "maybe later" caveat.
- `Owning gate`: Gate C.
- `Depends on`: `iter-033` for `save.lock.wait` visibility; `iter-034` for rollback on writer-path regressions; `iter-039` for sticky retry classification.
- `Phase 019 non-goal`: no parallel write optimization work unless the packet-level lock is proven to be the bottleneck.

### 2.4 Narrative compaction

- `Resolution`: phase 019 instruments narrative growth but does not automate compaction. No background summarizer, auto-pruner, or anchor mover should ship in this phase. Manual compaction remains a human-driven follow-up only.
- `Definition of Done`: growth metrics for `implementation-summary.md` and `handover.md` are visible; no auto-compaction code path exists in phase 019; complaint-trigger and size-threshold criteria are documented so phase 020 gets real evidence instead of anecdotes.
- `Owning gate`: Gate E for the phase 019 portion; policy remains a phase 020+ decision.
- `Depends on`: `iter-033` primarily; `iter-038` secondarily where repeated misroutes inflate anchors.
- `Phase 019 non-goal`: no "cleanup while we're here" compaction pass hidden inside save-path work.

### 2.5 Archive fallback tuning

- `Resolution`: phase 019 freezes fallback behavior long enough to gather real evidence. Archived rows remain doc-last, down-weighted, and fallback-only. Week-1 and week-2 ad hoc tuning is disallowed unless a correctness or availability incident forces rollback.
- `Definition of Done`: `archived_hit_rate` is live with by-intent slices; week-2 and week-4 reviews are scheduled; promotion freeze and rollback rules are wired; any tuning change requires an evidence package and audit record; otherwise no tuning ships during the initial window.
- `Owning gate`: Gate E.
- `Depends on`: `iter-032` for parity thresholds; `iter-034` for freeze/rollback behavior; `iter-036` for long-window interpretation; `iter-037` for launch-proof of the archive flip.
- `Phase 019 non-goal`: no unlogged rank-weight fiddling to make dashboards look healthier than the runtime truth.

### 2.6 Impact-analysis completion

- `Resolution`: broad commands, agents, workflow YAML, and global doc parity work may not begin without the companion impact-analysis artifact. Writer-path and reader-path substrate work can start before it; broad surface migration cannot.
- `Definition of Done`: the artifact exists on disk; it names file ownership and exclusions; phase 019 tasks cite it as scope authority; if missing on Monday of week 1, it becomes an explicit blocker and parallel workstream.
- `Owning gate`: Gate E.
- `Depends on`: no hard technical dependency from 31-39; operationally reinforced by `iter-034` sequencing and `iter-037` substrate-first proof posture.
- `Phase 019 non-goal`: no repo-wide parity sweep based only on intuition, grep, or remembered surfaces.

## 3. Cross-cutting integration audit

### 3.1 Tier 3 contract (`iter-031`) vs routing audit reducer (`iter-038`)

- `Result`: composes cleanly.
- `Why`: both agree that refusal is not a ninth category; `iter-038` explicitly normalizes internal `drop_candidate` to external audit `drop`; `alternatives[0]` is reserved for Tier 2 top-1 exactly as the reducer needs.
- `Weak link`: none, as long as phase 019 codifies the enum translation once at the audit-emission boundary.

### 3.2 Shadow thresholds (`iter-032`) vs feature-flag transitions (`iter-034`)

- `Result`: composes cleanly.
- `Why`: `iter-034` consumes the per-class thresholds and sample-floor semantics from `iter-032` instead of replacing them with a global average; `resume` and `trigger_match` keep their stricter rollback path.
- `Weak link`: none.

### 3.3 Instrumentation spans (`iter-033`) vs `iter-031`, `iter-034`, `iter-035`, `iter-039`

- `Result`: mostly composes.
- `Why`: Tier 3 routing, shadow compare, resume, retry, and fingerprint verification all have named spans or always-on events.
- `Weak link`: migration-time observability is weaker than steady-state runtime observability. `iter-033` is strong on normal operation, but one-shot migration evidence from `iter-035` still leans on the rehearsal report from `iter-037` more than on first-class migration telemetry.

### 3.4 Causal-edges migration (`iter-035`) vs dry-run pipeline (`iter-037`)

- `Result`: strong composition.
- `Why`: `iter-035` defines the additive DDL, tuple semantics, and rollback; `iter-037` turns those into Q1-Q10 checks, idempotence proof, rollback proof, and query-plan validation.
- `Weak link`: none; this is one of the cleanest gen 3 seams.

### 3.5 Archive permanence threshold (`iter-036`) vs rehearsal evidence (`iter-037`)

- `Result`: composes on different time horizons.
- `Why`: rehearsal proves the migration and metric substrate are trustworthy at launch; `iter-036` governs how long-window trend evidence is interpreted later.
- `Weak link`: no phase-019 blocker, but permanence itself stays unresolved until real eligible-day data exists.

### 3.6 Fingerprint circuit breaker (`iter-039`) vs shadow states (`iter-032` and `iter-034`)

- `Result`: composes correctly and conservatively.
- `Why`: `iter-039` treats logic bugs and sticky patterns as hard stops; `iter-034` converts non-zero post-flip fingerprint rollback into automatic rollback; `iter-032` never tries to average write correctness into search parity.
- `Weak link`: none, provided fingerprint-derived rollback events bypass any sampling or "warning only" treatment.

### 3.7 Overall verdict

- No new architectural contradiction appears across iterations 031-039.
- The main non-blocking caveat is migration-time telemetry coverage, not a runtime design mismatch.
- That caveat is real, but it is not strong enough to justify another design-generation loop before phase 019 starts.

Gate-oriented interpretation:

- Gate C is now a writer-proof problem, not a missing-contract problem.
- Gate D inherits a clean reader-state model from the shadow and rollback work.
- Gate E still depends on disciplined rollout sequencing, but no longer depends on inventing new runtime rules mid-flight.

## 4. Updated risk register

### 4.1 Risks materially reduced by gen 3

- `Risk 1 — schema migration corrupts memory_index`: reduced by `iter-035` plus `iter-037`.
- `Risk 2 — contentRouter misroutes silently`: reduced by `iter-031` plus `iter-038`, though not eliminated.
- `Risk 4 — resume latency regresses`: reduced by `iter-032`, `iter-033`, and `iter-034`.
- `Risk 6 — concurrent anchor write corrupts spec doc`: reduced significantly by `iter-039` and `iter-033`.
- `Risk 8 — human edit during save loses content`: reduced significantly by `iter-039`.
- `Risk 10 — operator confusion during transition`: reduced by `iter-034` state semantics plus `iter-033` dashboard contract.

### 4.2 Risks reduced only partially

- `Risk 3 — archived_hit_rate stays >5% after 4 weeks`: better framed by `iter-036`, still data-dependent.
- `Risk 5 — root packet missing canonical doc`: still an operational pre-work dependency; gen 3 restates it but does not remove it.

### 4.3 Risks elevated by gen 3 detail

- `Risk 7 — tests underestimated`: elevated, because gen 3 adds explicit contracts for Tier 3, reducer behavior, rollout-state transitions, migration proof, archive statistics, and retry forensics.

### 4.4 Risks retired or closed

- `Risk 9 — research prompts do not converge`: closed; the loop converged and iteration 040 is the synthesis closeout.

### 4.5 New risks revealed by gen 3

- `New A — telemetry cardinality or dashboard blind spots hide gate failures`: from `iter-033`.
- `New B — rollout control-plane drift or cache staleness causes state confusion`: from `iter-034`.
- `New C — tuple endpoint backfill leaves unresolved causal edges`: from `iter-035` plus `iter-037`.
- `New D — Tier 3 provider failure spikes refusal rate and slows saves`: from `iter-031`.
- `New E — migration evidence lives mostly in reports, not continuous telemetry`: from the `iter-033` plus `iter-037` seam.

Immediate phase 019 blocker view:

- hard blockers: failed rehearsal, missing impact-analysis artifact for broad parity, missing root-packet backfill, unresolved tuple endpoints;
- soft blockers: elevated refusal rate, telemetry panel gaps, lock contention rising without rollback, archive metrics not yet wired;
- non-blockers: narrative compaction policy and archive permanence policy, because both are intentionally deferred with explicit evidence collection.

## 5. Phase 019 first-week plan

### Monday — Gate A pre-work status check

- `Owns`: `iter-020`, `iter-030`, `iter-037`.
- `Deliverables`: confirm impact-analysis presence, confirm root-packet backfill status, verify backup and rollback entrypoints, produce named blocker list.
- `Exit condition`: no unnamed prerequisite remains.
- `Do not do yet`: no broad doc or agent parity edits before this status pass is written down.

### Tuesday — migration rehearsal on copy

- `Owns`: `iter-035`, `iter-037`.
- `Deliverables`: immutable snapshot, candidate fork, Q1-Q10 report, rerun idempotence proof, hard rollback proof, `unresolved_tuple_endpoints = 0`, fixed-query replay output.
- `Exit condition`: the migration is certified `GO` on a copy or explicitly blocked with forensics.
- `Do not do yet`: no production migration, no state-machine promotion, no cleanup work.

### Wednesday — `contentRouter` Tier 1 + Tier 2 kickoff

- `Owns`: `findings/routing-rules.md`, `iter-031`, `iter-038`.
- `Deliverables`: category map, Tier 1 rule set, Tier 2 prototype loader, audit-row emitter stub, first unit-test scaffold.
- `Exit condition`: obvious chunks route deterministically and every final route can emit an audit row.
- `Do not do yet`: no Tier 3 prompt shipping before Tier 1 and Tier 2 outputs are testable.

### Thursday — Tier 3 LLM contract validation

- `Owns`: `iter-031`, `iter-038`, `iter-033`.
- `Deliverables`: prompt version, strict JSON schema, one-repair parse path, provider-failure fallback, cache rules, Tier 3 telemetry.
- `Exit condition`: Tier 3 is bounded, structured, and rare-path only.
- `Do not do yet`: no freeform model rewrite or summarization path disguised as classification.

### Friday — instrumentation framework scaffold

- `Owns`: `iter-033`, `iter-034`, `iter-039`.
- `Deliverables`: canonical span names, tag bucketing, shadow and rollback events, fingerprint and retry surfaces, rollout-state audit stub, Gate C dashboard checklist.
- `Exit condition`: week 2 can prove writer-path health instead of guessing it.
- `Do not do yet`: no canonical flip, no bucket promotion, no health claims based on partial panels.

## 6. Definition-of-done SLA table

| Item | DoD criteria | Owning gate | ETA | Blocker risk | Evidence needed |
|---|---|---|---|---|---|
| `implementation-summary.md` timing | packet-created by `/spec_kit:plan`, validated, first-save works without lazy creation on new packets | Gate C | Week 1 | new packets still depend on save-time bootstrap | template diff, validator proof, first-save integration |
| First-save research targets | `research/research.md` can bootstrap atomically and visibly | Gate C | Week 2 | research chunks land in wrong target | integration test, audit row, fingerprint success |
| Per-anchor locking | packet-level lock retained with healthy telemetry evidence | Gate C | Week 2 | hidden contention or sticky retry clusters | lock-wait panel, retry panel, canary review |
| Narrative compaction | instrumentation live, no auto-compaction shipped, phase 020 policy input prepared | Gate E | Week 3 | anchors become unreadable before policy exists | dashboard panel, complaint log, follow-up issue |
| Archive fallback tuning | thresholds frozen until evidence reviews, archive metrics live, tuning changes audit-backed only | Gate E | Week 3 | ad hoc tuning masks retrieval faults | week-2 review, week-4 review plan, audit record |
| Impact-analysis completion | companion artifact exists and blocks broad parity work until cited | Gate E | Week 1 | wide-surface edits start without scope authority | artifact path, file matrix, task references |

Interpretation rule for the SLA table:

- "Week 1" means the item must be closed or explicitly blocked with owner before the first week ends.
- "Week 2" means implementation work may start earlier, but the item cannot stay undefined past the second weekly checkpoint.
- "Week 3" means the item is monitoring- or policy-adjacent and closes with evidence, not just code landing.

## 7. Open follow-ups for phase 020+

- `Narrative compaction policy`: phase 020+ decides whether growth should trigger summary, relocation, or simple tolerance.
- `Archive permanence`: phase 020+ owns the actual retire/keep/investigate decision because `iter-036` needs long-window evidence.
- `Tuple-only causal endpoint cutover`: phase 020+ still owns dropping legacy-id public exposure and rebuilding `causal_edges`.
- `Lock granularity revisit`: only reopen if phase 019 telemetry proves packet-level locking is materially harmful.
- `Migration-event telemetry hardening`: if Gate B/Gate C evidence feels too report-heavy, promote migration events into first-class telemetry.

These are intentionally phase 020+ items because:

- they depend on observation, not just implementation;
- phase 019 can stay safe without solving them fully;
- solving them early would create avoidable scope creep in the migration phase.

## 8. Composition score

**Score: 0.91**

Why it is high:

- all six iteration-030 deferrals now have implementation-grade rules;
- the major gen 3 seams align cleanly;
- the state machine, parity thresholds, rehearsal proof, and fingerprint forensics now form a believable operational loop.
- the remaining caveats are explicit enough to plan around rather than discover mid-rollout.

Why it is not 1.0:

- `iter-036` still needs real time-series data that phase 019 cannot pre-compute;
- migration-time observability is weaker than steady-state runtime observability;
- two items are resolved by scoped deferral, not immediate full closure: narrative compaction policy and archive permanence.

What would lower the score materially:

- if the companion impact analysis is missing and no owner is assigned immediately;
- if Tuesday's rehearsal fails rollback or tuple-endpoint proof;
- if phase 019 tries to bypass the state machine or telemetry scaffolding and jump directly to parity edits.

## 9. Recommendation to user

Phase 019 is safe to start from a design-readiness perspective. The single must-fix before broad runtime migration is the copy-first migration rehearsal with rollback proof and `unresolved_tuple_endpoints = 0`, because that substrate proof sits underneath search parity, graph integrity, and rollback safety. Another gen 4 depth pass is not needed unless week-1 evidence breaks one of the contracts above; otherwise phase 019 is implementable now.

Practical reading of that recommendation:

- start phase 019;
- make Monday and Tuesday evidence-heavy;
- do not spend week 1 polishing surface docs before the substrate is proven;
- treat any failed rehearsal as a hard pause, not as a reason to reopen Option C itself.

## 10. Ruled Out

- another per-anchor locking redesign before live contention evidence exists;
- automatic narrative compaction inside phase 019;
- ad hoc archive fallback tuning before the observation windows produce evidence;
- treating impact-analysis completion as optional for broad parity edits;
- treating fingerprint mismatches as warning-only;
- claiming archive permanence is already resolved in phase 019;
- claiming full legacy-id removal from `causal_edges` belongs in phase 019;
- treating the migration-telemetry caveat as a blocker large enough to justify a new design generation.

Gen 3 has now done its job. The remaining uncertainty is operational, not architectural: prove the migration on a copy, confirm the scope matrix, build the writer path first, wire the proof signals before the flip, and let phase 019 evidence decide the rest.
