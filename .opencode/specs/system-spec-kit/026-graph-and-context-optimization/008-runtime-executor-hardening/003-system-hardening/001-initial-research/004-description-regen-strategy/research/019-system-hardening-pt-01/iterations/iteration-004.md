# Iteration 004

## Focus

Converge the last two implementation-policy choices left open by Iteration 003, then turn the Iteration 001-003 findings into the first canonical synthesis draft for the packet.

## Actions

1. Read `iterations/iteration-001.md`, `iterations/iteration-002.md`, and `iterations/iteration-003.md` to preserve the established field catalogue, live rich-file audit, and 018 R4 compatibility conclusions.
2. Read `deep-research-state.jsonl` to confirm the lineage, ratio trend, and the missing canonical Iteration 004 state append contract.
3. Re-evaluated the unknown-extension-key question against the live evidence from Iteration 002:
   - 28 live rich files
   - 1 archived file with extra top-level keys outside the standard authored set
   - no current research packet using optional rich fields
4. Re-evaluated the rollout ordering question against the concrete implementation shape from Iteration 003:
   - shared schema
   - unified merge helper
   - targeted regen/audit
   - separate packet-root remediation for `007/008/009/010`
5. Authored the first canonical `research.md` synthesis draft for this phase.

## Decision 1: Unknown Extension Keys

### Recommendation

Keep unknown extension keys as **explicit top-level passthrough for this rollout**, not as an immediate migration into a named authored metadata bag.

### Why this is the better near-term choice

- It matches the live runtime behavior already observed in Iteration 002, so the implementation formalizes current reality instead of forcing a storage-model migration.
- The live evidence does **not** show widespread uncontrolled custom-key sprawl:
  - the standard authored rich set is still `title`, `type`, `trigger_phrases`, and `path`
  - only one archived backup file showed extra top-level custom keys
- The actual risk surface in this packet is contract ambiguity, not namespace exhaustion.
- A named authored metadata bag would widen the write scope substantially:
  - schema migration
  - read-path updates
  - possible downstream tooling changes
  - fixture churn beyond the current packet need

### Tradeoff analysis

#### Option A: Permanent top-level passthrough now

Benefits:

- Lowest migration cost
- Preserves backward compatibility with every existing file shape
- Aligns with the current permissive valid-file path and the 018 R4 repair lane
- Lets the team write an explicit preservation contract immediately

Costs:

- Keeps canonical and authored fields in one top-level namespace
- Requires a clear reserved-field list so future canonical additions do not silently collide with authored keys

Assessment:

- Best choice for the current packet because it addresses the real defect with the fewest moving parts.

#### Option B: Immediate authored metadata bag migration

Benefits:

- Cleaner long-term separation between derived and authored metadata
- Easier future introspection if authored content grows substantially

Costs:

- Much higher migration burden than the observed live data justifies
- Requires broad tooling coordination outside this packet's immediate goal
- Would turn a contract-clarification fix into a storage-model change

Assessment:

- Attractive later if custom-key usage expands, but too heavy for the present implementation wave.

### Final policy wording

For the next implementation:

- canonical reserved fields remain top-level and always win on regen
- known authored fields remain top-level and are preserved intentionally
- unknown non-reserved top-level keys are preserved as passthrough data
- migration to a named authored metadata bag remains a **future optional refactor**, not a prerequisite for fixing regen semantics now

## Decision 2: Smallest Testable Rollout Sequence

### Verified order

The rollout sequence from Iteration 003 is correct and should remain:

1. shared schema first
2. unified merge helper second
3. targeted regen/audit pass third
4. `007/008/009/010` root-doc remediation tracked separately

### Why this order is correct

#### 1. Shared schema first

- The schema is the contract boundary that defines:
  - what is canonical
  - what is authored
  - what is tracking
  - what is extension passthrough
- Without the schema first, the merge helper would still be encoding policy through ad hoc object handling.
- Tests need the schema before they can verify repair and preservation semantics consistently.

#### 2. Unified merge helper second

- Once the schema defines field classes, the valid-file and schema-error paths can be collapsed behind one policy.
- This is the step that converts "implicit preservation" into "documented behavior."
- Doing merge unification before schema formalization would freeze the current ambiguity instead of removing it.

#### 3. Targeted regen/audit pass third

- The audit pass is verification, not design.
- It should run only after the contract and helper are stable.
- Running regen earlier would produce evidence against a moving target and risk misclassifying contract failures as data anomalies.

#### 4. `007/008/009/010` remediation separately

- Those packet roots are blocked upstream of merge because default regen cannot build canonical payloads when root `spec.md` is missing.
- That means they are a structural packet-root problem, not a merge-policy sequencing dependency.
- Keeping them separate prevents the merge rollout from being held hostage by root-doc repair work.

### What would go wrong if the order changed

- If merge helper work landed before schema formalization, the helper would still rely on accidental field assumptions.
- If audit ran before merge unification, the results would be unstable and hard to interpret.
- If `007/008/009/010` remediation were bundled into the same rollout, the scope would blur from "description regeneration contract" into "packet-root document repair."

## Net Convergence Result

Iteration 004 does not overturn the earlier recommendation. It tightens it:

- Phase 018 R4 remains compatible with the recommended direction.
- The field-level merge policy remains the best implementation strategy.
- Unknown extension keys should stay as explicit top-level passthrough for now.
- The rollout order proposed in Iteration 003 is already the smallest testable sequence.
- The packet is now ready for synthesis and implementation planning rather than another policy-discovery pass.

## New Graph-Worthy Findings

- Unknown extension key preservation should be made an explicit top-level passthrough contract for the current rollout because the live tree shows minimal custom-key sprawl and high backward-compatibility benefit.
- The recommended rollout order is validated as dependency-correct: schema before merge, merge before audit, and root-doc remediation separate.
- The evidence gap has shifted from strategy choice to execution discipline and fixture coverage.

## Deliverables Produced

- `research.md` authored as the first canonical synthesis draft for this phase
- `deltas/iter-004.jsonl` authored with structured delta records
- canonical `type:"iteration"` record prepared for append into `deep-research-state.jsonl`

## Next Focus

If the broader deep-research loop continues, the next useful step is no longer policy discovery. It is implementation execution:

1. introduce the shared per-folder description schema
2. unify the valid-file and schema-error merge paths
3. add the fixture set that locks reserved-vs-authored-vs-extension behavior
4. run the targeted description regen/audit pass
