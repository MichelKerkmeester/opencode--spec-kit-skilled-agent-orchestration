# Cross-Cutting Patterns

## Shared Anti-Patterns and Code Smells

### Silent fail-open or silent degrade paths

Several of the highest-risk files choose warnings or silent fallback over explicit surfaced failure:

- `session-stop.ts` drops autosave on timeout or missing script with warning-only handling.
- `graph-metadata-parser.ts` silently retries schema-invalid JSON as legacy content.
- `code-graph/query.ts` swallows readiness failures and returns output that is hard to distinguish from a genuinely empty graph.
- `reconsolidation-bridge.ts` can silently erase all candidates after scope filtering.
- `post-insert.ts` reports successful-looking booleans even when enrichment was deferred or skipped.

This pattern lowers operator friction but raises audit cost: failures become observationally similar to benign emptiness or expected degradation.

### Stringly typed workflow and config surfaces

The repo has multiple operational seams encoded as strings rather than typed contracts:

- `AGENTS.md` gate behavior depends on prose plus trigger-word lists.
- `spec_kit_plan_auto.yaml` uses interpreter-dependent expressions such as `intake_only == TRUE`.
- `skill_advisor.py` depends on literal keyword dictionaries and phrase lists.
- `manual-playbook-runner.ts` depends on regex-matched markdown shapes and hardcoded path fragments.

These surfaces drift easily because they are validated socially more than mechanically.

### Hidden or misleading state contracts

Several files expose state that looks authoritative but is either weakly synchronized or semantically misleading:

- `hook-state.ts` is a real authority store but has no schema versioning or writer coordination.
- `session-stop.ts` writes and then immediately re-reads state without an explicit durability contract.
- `post-insert.ts` uses booleans that cannot distinguish success from skip/defer.
- `015 implementation-summary.md` and `006 implementation-summary.md` expose continuity fields that can become stale without any check.
- `AGENTS.md` promises session-persistent Gate 3 behavior using LLM context rather than durable state.

## Missing Test Coverage Patterns

### Happy-path heavy, adversarial-path light

Across the candidate set, direct tests exist most often for normal routing and fixed regressions. Coverage is notably thinner for:

- malformed persisted state
- concurrent writers
- ambiguous or stale workflow metadata
- fail-open fallback branches
- config drift between prose and executable behavior
- large-input performance behavior

The clearest examples are `hook-state.ts`, `session-stop.ts`, `code-graph/query.ts`, `manual-playbook-runner.ts`, and `skill_graph_compiler.py`.

### Indirect coverage treated as stronger than it is

Some files are only covered through broader save or workflow tests, but their own contracts remain under-tested:

- `post-insert.ts` is mostly covered indirectly through save flows.
- `shared-payload.ts` has some direct trust-validator coverage but not enough coverage of its predicate/normalizer edges.
- `reconsolidation-bridge.ts` has save-path coverage without strong coverage of its strangest array-property and complement-path behavior.
- `spec_kit_plan_auto.yaml`, `AGENTS.md`, and packet summary docs are effectively untested despite carrying live runtime consequences.

## Trust Boundary Gaps

### Repository-owned content is treated as safe code

The strongest trust-boundary problem in this set is `manual-playbook-runner.ts`, which evaluates object literals with `Function(...)()`. The rationale is "repository-owned content," but this still crosses from data into executable code.

### Collapsed semantics remain common even in anti-collapse work

The spec tree argues for separated trust axes, but several files still collapse semantically distinct states:

- `shared-payload.ts` collapses `missing` and `empty` graph states into `stale`.
- `post-insert.ts` collapses success, skip, and defer into `true`.
- `code-graph/query.ts` collapses readiness failure and empty graph into very similar output.
- `graph-metadata-parser.ts` collapses schema-invalid modern JSON into "legacy migration succeeded."

### Prose contracts outrun machine checks

`recommendations.md`, `AGENTS.md`, the implementation summaries, and `spec_kit_plan_auto.yaml` all contain operational promises that no dedicated CI gate currently validates. This is the most important cross-cutting governance gap in the low/medium set.

## State Management Concerns

### Shared temp paths

Two separate surfaces still rely on shared temp paths:

- `AGENTS.md` save guidance uses `/tmp/save-context-data.json`.
- `spec_kit_plan_auto.yaml` repeats the same shared save-context path.

That means the race is not just implementation-level; it is documented and encouraged at the workflow level.

### Read-modify-write without coordination

The hook/save lane repeatedly uses non-transactional or partially transactional state handling:

- `hook-state.ts` uses non-atomic RMW for updates.
- `session-stop.ts` assumes state visibility immediately after write.
- `reconsolidation-bridge.ts` performs transactional inner writes, but its search/filter/pre-check phase is outside the transaction.

These are the most important state-management seams for deep review because they can produce silent data loss or duplicate writes rather than explicit crashes.

## Recommendations for Review Iteration Ordering

### Order 1: authority and race surfaces first

1. `hook-state.ts`
2. `session-stop.ts`
3. `reconsolidation-bridge.ts`
4. `post-insert.ts`

Reason: these files either own durable state or mutate save-path behavior. Bugs here can create silent corruption or false continuity.

### Order 2: trust-contract authority second

5. `shared-payload.ts`
6. `graph-metadata-parser.ts`
7. `code-graph/query.ts`
8. `adaptive-fusion.ts`

Reason: these files decide what later consumers believe about freshness, trust, graph shape, and ranking.

### Order 3: routing/config governance next

9. `skill_advisor.py`
10. `skill_graph_compiler.py`
11. `spec_kit_plan_auto.yaml`
12. `AGENTS.md`

Reason: these files shape how the system is used and reasoned about, but most of their failures are guidance/routing drift rather than direct data corruption.

### Order 4: documentation-state and lower-risk script follow-up

13. `015 implementation-summary.md`
14. `006 implementation-summary.md`
15. `recommendations.md`
16. `manual-playbook-runner.ts`

Reason: these matter, but they are lower-priority than state authority and trust-contract seams. `manual-playbook-runner.ts` is the exception in code risk, but it is more isolated operationally than the hook/save authority surfaces.

## Highest-Value Deep-Review Themes

1. **Make state truthful**: separate success from skipped/deferred, and distinguish empty from failed/missing.
2. **Make authority explicit**: document which file or runtime owns the truth for trust, continuity, and save-path decisions.
3. **Eliminate shared-temp assumptions**: remove `/tmp/save-context-data.json` from both docs and workflow assets.
4. **Promote adversarial tests**: concurrency, malformed persisted state, stale config, and path-drift should move from manual reasoning into direct test coverage.
