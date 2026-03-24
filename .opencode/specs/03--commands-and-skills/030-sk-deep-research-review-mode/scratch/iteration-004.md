# Review Iteration 4: LEAF Agent Design & Dispatch Protocol

## Focus
Q4: Should review mode use @review, create @deep-review, or adapt @deep-research dispatch context?

## Findings

### Part 1: Agent Strategy Evaluation (3 Options)

**Recommendation: Option B — create a new `@deep-review` LEAF agent.**

The current review agents are explicitly read-only and limited to `Read/Bash/Grep/Glob`, while the deep-research agents are explicitly iteration-writers that update strategy and JSONL state; the loop YAML also already assumes that writable contract. Key anchors: `review.md:24`, `review.toml:3` (sandbox_mode = "read-only"), `deep-research.md:27`, `deep-research.toml:3` (sandbox_mode = "workspace-write"), `spec_kit_deep-research_auto.yaml:262` (step_dispatch_iteration).

#### Option A: Reuse @review as LEAF in deep-research loop

- **Gap**: It is contractually read-only and only exposes `Read/Bash/Grep/Glob`; scratch-only `Write` is not enough because review iterations also need `Edit` on strategy and append semantics for JSONL. See `review.md:4`, `review.md:24`, `review.md:76`.
- It can learn JSONL/strategy management technically, but only by weakening the current reviewer identity from "observe only" to "observe plus mutate state."
- **Needed changes**: add `Write` and `Edit`, redefine "read-only" to "read-only on review target, writable on state files," and switch Codex from `read-only` to `workspace-write`.
- **Pros**: lowest file-count increase, strongest reuse of existing review rubric/self-check.
- **Cons**: muddies the meaning of `@review`, raises risk of accidental target-file edits, and makes gate review and iteration review harder to distinguish.

#### Option B: Create new @deep-review LEAF agent

- Hybrid composition works well.
- **Take from @review**: rubric, P0/P1/P2 severity, gate-validation posture, overlay loading, output verification, Hunter/Skeptic/Referee. See `review.md:94`, `review.md:107`, `review.md:357`.
- **Take from @deep-research**: single-iteration loop shape, state-first workflow, write safety, append-only JSONL, strategy updates, LEAF-only rule, budget discipline. See `deep-research.md:45`, `deep-research.md:152`, `deep-research.md:283`.
- **Maintenance burden**: moderate, because it means one more agent definition across the 5 runtimes, but the current runtime files are already near-isomorphic so drift is manageable.
- **Suggested outline**:
  1. Identity and permissions
  2. Single review-iteration workflow
  3. Capability scan
  4. Review rubric and severity contract
  5. State management and write safety
  6. Iteration file format
  7. Adversarial self-check
  8. Output verification and anti-patterns
- **Pros**: architecturally clean, easiest to reason about, preserves `@review` purity, easiest YAML dispatch target.
- **Cons**: extra agent surface to maintain.

#### Option C: Mode-switch @deep-research via dispatch context

- **Best case**: fastest prototype. Enrich the YAML dispatch payload with review scope, dimension, thresholds, and self-check instructions.
- **Risk**: the underlying agent still says "research-focused," assumes 3-5 research actions, includes `WebFetch`, and discusses `research.md`, so the dispatch is fighting the base contract instead of extending it. See `deep-research.md:23`, `deep-research.md:50`, `deep-research.md:199`.
- Clean mode switch would require explicit `MODE: review` branches inside the agent contract. If you do not change the agent file, this stays brittle.
- **Pros**: fastest MVP, smallest immediate file diff.
- **Cons**: hidden behavior, weaker review fidelity, higher chance of research-style output in review mode.

#### Final Recommendation

- **Permanent architecture**: Option B.
- **Fast spike only**: Option C.
- Avoid Option A.

---

### Part 2: Tool Budget for Review Iterations

Proposed default budget: `9-12` total calls, hard max `13`.

**Suggested split:**
- `2` state reads: JSONL + strategy.
- `1-2` scope/cross-reference discovery calls.
- `3-4` evidence calls: mostly `Read`/`Grep`, sometimes `Glob`.
- `3` state writes: iteration file, strategy update, JSONL append.
- `0-1` extra verification call when a candidate P0 or gate-relevant P1 appears.

**Dimension tuning:**
- Security: `10-13`.
- Correctness: `9-12`.
- Performance: `9-11`.
- Patterns/Maintainability: `8-10`.

Vary budget by dimension. Security and correctness usually need more cross-file verification than patterns or maintainability.

---

### Part 3: Dispatch Context Template

```text
REVIEW ITERATION {current_iteration} of {max_iterations}
MODE: review
DIMENSION: {dimension_focus}
REVIEW TARGET: {review_scope}
TARGET BASELINE: {changed_files_or_explicit_scope}
PRIOR FINDINGS: P0={prior_p0} P1={prior_p1} P2={prior_p2}; unresolved={unresolved_ids}
LAST ITERATIONS: {last_3_summaries}
CROSS-REFERENCE TARGETS:
- Spec: {spec_paths}
- Code: {code_paths}
- Tests: {test_paths}
- Prior strategy focus: {next_focus}
SCORING RUBRIC: Correctness=30 Security=25 Patterns=20 Maintainability=15 Performance=10
SEVERITY THRESHOLDS:
- P0: exploitable security flaw, auth bypass, destructive data-loss/regression
- P1: correctness bug, spec mismatch, missing guard, must-fix gate issue
- P2: non-blocking maintainability/pattern/perf improvement
STATE FILES:
- Config: {spec_folder}/scratch/deep-review-config.json
- State Log: {spec_folder}/scratch/deep-review-state.jsonl
- Strategy: {spec_folder}/scratch/deep-review-strategy.md
OUTPUT CONTRACT:
- Write {spec_folder}/scratch/iteration-{NNN}.md
- Edit strategy.md
- Append one JSONL iteration record
CONSTRAINTS:
- LEAF-only; no sub-agents
- Review target is read-only
- Write/Edit only state artifacts
- Run Hunter/Skeptic/Referee for candidate P0s and gate-relevant P1s
- Target 9-12 tool calls; max 13
```

**Field purpose:**
- `DIMENSION`: tells the leaf where to spend its limited budget.
- `REVIEW TARGET`: exact code/files under review.
- `PRIOR FINDINGS`: dedupe and carry-forward control.
- `CROSS-REFERENCE TARGETS`: what must be checked against what.
- `SCORING RUBRIC`: keeps scoring stable across iterations.
- `SEVERITY THRESHOLDS`: prevents severity drift.
- `STATE FILES`: authoritative read/write boundary.
- `OUTPUT CONTRACT`: artifact contract for the evaluator.
- `CONSTRAINTS`: permission and budget guardrails.

---

### Part 4: Iteration File Format for Review

```markdown
# Review Iteration 003: Security - auth boundary

## Focus
Verify whether auth-sensitive handlers in `src/api/*` match `spec.md` admin-only requirements.

## Scope
- Review target: `src/api/users.ts`, `src/auth/policy.ts`
- Spec refs: `spec.md`, `plan.md`
- Dimension: Security

## Scorecard
| File | Corr | Sec | Patt | Maint | Perf | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| src/api/users.ts | 24 | 14 | 17 | 12 | 8 | 75 |
| src/auth/policy.ts | 28 | 22 | 18 | 13 | 9 | 90 |

## Findings

### P1-001: Missing authorization check on admin delete path
- Dimension: Security
- Evidence: [SOURCE: src/api/users.ts:118]
- Cross-reference: [SOURCE: spec.md:44]
- Impact: Non-admin callers can reach a code path the spec marks admin-only.
- Hunter: Candidate P0 because access control is missing.
- Skeptic: Route may already be protected upstream in middleware.
- Referee: Downgrade to P1 because middleware exists for most routes, but this handler bypasses the shared wrapper.
- Final severity: P1

### P2-002: Inline policy string duplicates canonical enum
- Dimension: Patterns
- Evidence: [SOURCE: src/auth/policy.ts:27]
- Cross-reference: [SOURCE: src/auth/constants.ts:8]
- Impact: Drift risk, not an immediate defect.
- Final severity: P2

## Cross-Reference Results
- Confirmed: admin-only requirement exists in spec and is only partially enforced in code.
- Contradictions: none beyond P1-001.
- Unknowns: integration tests do not cover this path.

## Ruled Out
- SQL injection concern in `users.ts` was investigated and not supported by the actual query builder usage.
- Suspected dead code in `policy.ts` is referenced by tests.

## Sources Reviewed
- [SOURCE: src/api/users.ts:1]
- [SOURCE: src/auth/policy.ts:1]
- [SOURCE: spec.md:44]
- [SOURCE: tests/api/users.test.ts:1]

## Assessment
- Confirmed findings: 2
- New findings ratio: 0.75
- newFindingsExplanation: 1 new finding + 1 partially new nuance over prior strategy notes
- Questions addressed: auth boundary enforcement
- Questions answered: spec mismatch confirmed

## Reflection
- What worked: spec-to-handler cross-checking found the real gap quickly.
- What did not work: broad grep for "admin" was noisy.
- Next adjustment: inspect middleware bypasses directly.

## Recommended Next Focus
Check whether the same wrapper bypass exists in `src/api/projects.ts`.
```

**Format notes:**
- P0/P1/P2 should be grouped inside `## Findings`, not split into separate files.
- `Scorecard` should include per-file and iteration-level totals.
- `Cross-Reference Results` should explicitly mark `confirmed`, `contradiction`, and `unknown`.
- `newFindingsRatio` should use only confirmed findings after self-check: `(new + 0.5 * partially_new) / confirmed_findings`.

---

### Part 5: Permission Model

**Required tools:**
- Required: `Read`, `Grep`, `Glob`, `Bash`, `Write`, `Edit`.
- Optional: `memory_search` for prior related review context.
- Not needed: `WebFetch`, `Task`.

**Codex sandbox:**
- Use `workspace-write`, not `read-only`, because the agent must write iteration artifacts.
- Enforce path-level read-only by contract plus verifier: after each iteration, fail if any modified path is outside the allowlist of iteration file, strategy file, and JSONL. The current YAML already verifies those expected outputs (`spec_kit_deep-research_auto.yaml:294`).

**Permission matrix:**

| Tool | Review Target | Scratch/ | Strategy.md | JSONL |
| --- | --- | --- | --- | --- |
| `Read` | RO | RO | RO | RO |
| `Grep`/`Glob`/`Bash` | RO inspect only | RO inspect only | RO inspect only | RO inspect only |
| `Write` | No | Create `iteration-NNN.md` only | No | Append-only |
| `Edit` | No | No | Section-scoped edits only | No |

Drop progressive `research.md` updates for review mode. The loop evaluator only needs iteration file, JSONL append, and strategy update, so omitting a root-level mutable artifact keeps permissions tighter.

---

### Part 6: Adversarial Self-Check Integration

Do not run Hunter/Skeptic/Referee on every iteration by default; that is too expensive.

**Recommended policy:**
1. Gather candidate findings normally.
2. If there is a candidate P0, run full Hunter/Skeptic/Referee in the same iteration before writing outputs.
3. If there is a candidate P1 that would fail the gate or materially change next focus, run a compact skeptic/referee pass in-iteration.
4. At synthesis, rerun full self-check on every carried-forward P0/P1 before the final report.

**Why:**
- This preserves the reviewer contract, which requires self-check on P0/P1 (`review.md:361`), without paying that cost on every harmless P2-only pass.
- It also avoids logging unvetted P0s into JSONL, which would pollute convergence and priority logic.

---

### Part 7: Ruled Out Approaches

- **Reusing `@review` with only scratch `Write`**: rejected because strategy edits and JSONL append still require broader mutation semantics.
- **Pure YAML-only mode switch on current `@deep-research`**: rejected as the permanent design because the base agent remains research-shaped, not review-shaped.
- **Full self-check on every finding, every iteration**: rejected as too costly for little gain.
- **Allowing writes to reviewed code paths under `workspace-write`**: rejected; state-file-only writes are the clean security boundary.

**Note:** Spec Kit memory MCP was unavailable in the source session due to handshake failure, so this analysis is based on the repository contracts only, not prior saved memory context.

## Assessment
newFindingsRatio: 1.0 (first iteration for this question, all findings new)

## Recommended Next Focus
Design the `@deep-review` agent file structure (Option B) — determine which sections from `@review` and `@deep-research` compose the hybrid, draft the agent frontmatter for each runtime, and define the YAML `agent_config` block that targets it.
