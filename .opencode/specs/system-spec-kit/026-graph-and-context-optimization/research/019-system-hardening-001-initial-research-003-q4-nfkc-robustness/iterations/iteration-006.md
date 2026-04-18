# Iteration 006

## Focus

Write the first full `research.md` synthesis draft by consolidating iterations 1-5 into one packet-local narrative: executive summary, surface map, bypass inventory, hardening proposals, severity ceiling, round-trip stability, implementation order, and handoff guidance.

## Actions

1. Re-read iterations 1-5 plus `deep-research-state.jsonl` to recover the validated Q1-Q5 answers, proposal set, and threat inventory.
2. Re-read the iteration-6 prompt pack, strategy, and delta shape to keep the synthesis aligned with packet constraints.
3. Drafted `research.md` as a 200-300 line synthesis document covering:
   - current-main normalization paths,
   - ten concrete residual constructions,
   - six ranked hardening proposals,
   - severity ceiling reasoning,
   - round-trip/runtime fingerprint observations,
   - implementation order and handoff target.
4. Appended an iteration record to the state log and created `deltas/iter-006.jsonl` to preserve the synthesis transition explicitly.

## Synthesis Outcomes

### Q1-Q5 Status

- **Q1:** answered. Current runtime `NFKC` behavior is now mapped by class: compatibility forms collapse, ZWJ/ZWNJ and soft hyphen persist, cross-script lookalikes require explicit confusable folding.
- **Q2:** answered. The trigger surface is weaker because it stays on `NFC`; the strongest individual bypass is the Greek-omicron construction.
- **Q3:** answered. Recovered payload crosses only shape-level `z.string()` validation; sanitizer quality is the true enforcement boundary.
- **Q4:** answered for the current runtime. JSON round-trip was stable for the tested corpus, but that stability does not imply semantic safety.
- **Q5:** answered. Six hardening proposals are now ranked and implementation-ordered.

### Severity Resolution

Iteration 2 used a provisional blocker framing for ``ignοre previous`` because it demonstrated a real recovered-payload strip miss. Iterations 3-4 refined the sink analysis and showed that the reviewed downstream consumers remain prompt-output and regex reprocessing surfaces only. The final synthesis therefore sets the **current-main severity ceiling to P1**:

- strongest bypass: RT5 / Greek-omicron imperative,
- strongest effect: prompt-surface integrity and metadata poisoning,
- not found: shell sink, filesystem sink, SQL/query sink.

### Deliverables Produced

- `research.md` now exists and consolidates the packet evidence into one handoff-ready narrative.
- `iterations/iteration-006.md` records this synthesis pass.
- `deltas/iter-006.jsonl` preserves the convergence/synthesis state.
- `deep-research-state.jsonl` now has the required append-only `"type":"iteration"` record for run 6.

## Metrics

- `newInfoRatio`: **0.12**
- `status`: `synthesis`
- `convergenceCandidate`: **true**
- `hardeningProposals`: **6**
- `threatInventoryItems`: **10**
- `answeredQuestions`: **Q1-Q5**

## Why `newInfoRatio` Dropped

This iteration did not add a new exploit family, runtime sink, or new runtime behavior finding. Its value is consolidation:

1. turned the proposal shortlist into a ranked implementation order,
2. normalized the final severity argument,
3. converted scattered evidence into a handoff-ready research document.

That makes the low ratio appropriate and consistent with convergence.

## Recommended Next Step

Transition from research to implementation planning for the `019-system-hardening` owner. The cleanest follow-on is:

1. unify normalization and canonical deny-list checks,
2. patch the Greek-omicron confusable gap,
3. add semantic payload validation plus provenance enforcement,
4. lock behavior with the shared adversarial corpus.

## Sources Used

- `iterations/iteration-001.md`
- `iterations/iteration-002.md`
- `iterations/iteration-003.md`
- `iterations/iteration-004.md`
- `iterations/iteration-005.md`
- `deep-research-state.jsonl`
- `deltas/iter-001.jsonl`
- `deltas/iter-002.jsonl`
- `deltas/iter-003.jsonl`
- `deltas/iter-004.jsonl`
- `deltas/iter-005.jsonl`
