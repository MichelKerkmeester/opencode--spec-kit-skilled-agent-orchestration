# Iteration 005 - Recommendations and ADR-001 Draft

## Recommendations

These recommendations synthesize iterations 001-004 into concrete workflow edits. The line numbers below are from this iteration's local read of the current workspace; re-run `nl -ba` before implementing if the files move.

### R1 - Add a fix-aware affected-surface section to the plan template

**WHAT to change**

The requested target, `.opencode/skill/system-spec-kit/scripts/templates/level_*/`, is not the current Level template location. That directory owns only the inline gate renderer: `.opencode/skill/system-spec-kit/scripts/templates/README.md:21-37` lists `inline-gate-renderer.{ts,sh}` and no `level_*` folders exist. The canonical Level markdown templates are in `.opencode/skill/system-spec-kit/templates/manifest/*.md.tmpl`, rendered by that script.

Modify `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl`:

- Insert this section after `## 3. ARCHITECTURE` and before `## 4. IMPLEMENTATION PHASES` in each Level block:
  - Level 1: after line 83, before line 87.
  - Level 2: after line 229, before line 233.
  - Level 3: after line 431, before line 435.
  - Level 3+: after line 710, before line 714.

Suggested section:

```markdown
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| [producer/helper/policy] | [what owns the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |
| [consumer/status/docs/tests] | [how it observes the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->
```

**WHY**

This addresses failure modes 2 and 4: one-consumer fixes and partial test/evidence matrices. Iteration 001 counted 13 of 17 `009` findings in those two modes: 6 cross-consumer misses and 7 matrix/evidence misses. Iteration 002 widened the sample and still found the same shape: combined mode 2 count 24, combined mode 4 count 27. The missed surfaces in `009` were concrete: scan was fixed before status, warnings before `data.errors`, and a three-row precedence proof before the six-row unit matrix.

Expected cycle compression: for `009`-class work this should move remediation from 4 review rounds toward 2 rounds. It would have forced the first fix plan to list scan, status, error/warning producers, docs/resource-map evidence, and env matrix rows before editing.

**HOW TO VERIFY**

```bash
rg -n "FIX ADDENDUM: AFFECTED SURFACES|ANCHOR:affected-surfaces|Same-class producers|Consumers of changed symbols" \
  .opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl

for level in 1 2 3 3+; do
  .opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.sh \
    --level "$level" \
    .opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl >/tmp/plan-"$level".md
  rg -n "AFFECTED SURFACES" /tmp/plan-"$level".md
done
```

### R2 - Add fix completeness gates to checklist templates

**WHAT to change**

Modify `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl`:

- Level 2: insert after `## Testing` and before `## Security`, around lines 69-80.
- Level 3: insert after `## Testing` and before `## Security`, around lines 198-209.
- Level 3+: insert after `## Testing` and before `## Security`, around lines 399-410.

Suggested checklist block:

```markdown
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->
```

**WHY**

This turns the iteration-003 "Universal fix completeness checklist" into a completion gate instead of advice. It covers all five observed failure modes:

- Mode 1: proves same-class sites are handled.
- Mode 2: proves consumers are handled.
- Mode 3: requires invariant-shaped algorithms and adversarial tables.
- Mode 4: requires full matrix/evidence rows.
- Mode 5: requires hostile env/global-state tests.

Expected cycle compression: it mainly prevents the high-cost second cycle. Iteration 004 measured cycle 1 plus run 2 at 36m17s active and cycle 2 plus run 3 at 26m08s active. Avoiding either failed cycle pays for the checklist overhead.

**HOW TO VERIFY**

```bash
rg -n "CHK-FIX-001|CHK-FIX-007|Fix Completeness" \
  .opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl

for level in 2 3 3+; do
  .opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.sh \
    --level "$level" \
    .opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl >/tmp/checklist-"$level".md
  rg -n "Fix Completeness|CHK-FIX" /tmp/checklist-"$level".md
done
```

### R3 - Make `/spec_kit:plan` generate affected surfaces for fix/remediation packets

**WHAT to change**

Modify both plan workflow YAML files:

- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:553` currently lists planning activities without an affected-surface output. Add `Generate Affected Surfaces table for fix_bug/remediation packets`.
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:602` has the same activities list; add the same item.
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:562-566` and `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:611-615` score plan quality on approach, risk, dependency mapping, and pattern alignment. Add a fifth scoring factor:

```yaml
- { factor: "Affected surface coverage", weight: 0.20, assess: "For fix/remediation packets, are same-class producers, consumers, test matrices, docs/resource maps, and runtime variants enumerated?" }
```

Then rebalance the existing weights, for example:

```yaml
- { factor: "Technical approach clarity", weight: 0.25, assess: "Implementation strategy well-defined?" }
- { factor: "Risk identification", weight: 0.20, assess: "Risks identified with mitigations?" }
- { factor: "Dependency mapping", weight: 0.20, assess: "All dependencies documented?" }
- { factor: "Pattern alignment", weight: 0.15, assess: "Follows existing codebase patterns?" }
- { factor: "Affected surface coverage", weight: 0.20, assess: "For fix/remediation packets, are same-class producers, consumers, test matrices, docs/resource maps, and runtime variants enumerated?" }
```

Also update the plan inline scaffold:

- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:206-214`
- `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:212-220`

Add an optional custom section after the required seven anchors rather than renumbering existing required anchors:

```yaml
      <!-- ANCHOR:affected-surfaces --> ## FIX ADDENDUM: AFFECTED SURFACES
```

**WHY**

This addresses research question 5 directly. Iteration 002 found that `004`, `005`, `008`, and `009` would each have benefited from explicit surface enumeration. The plan flow is the right choke point because deep-review verdicts route FAIL and CONDITIONAL to `/spec_kit:plan` (`.opencode/skill/sk-deep-review/references/convergence.md:473-479`). If plan.md does not require surfaces, the next implement/fix session starts with a narrow target by default.

Expected cycle compression: reduces the probability of a second failed fix+verify cycle. Iteration 004 estimated broad one-shot remediation at 31-45m active versus the actual post-run-1 path at 69m29s active and 149m15s elapsed.

**HOW TO VERIFY**

```bash
rg -n "Affected surface coverage|Generate Affected Surfaces|ANCHOR:affected-surfaces" \
  .opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml

bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research \
  --strict
```

### R4 - Extend `sk-code-review` finding schema with finding class and fix scope

**WHAT to change**

Modify `.opencode/skill/sk-code-review/SKILL.md`:

- Add `references/fix-completeness-checklist.md` to the default resources at lines 120-125.
- Add the new file to the Resource Loading table at lines 87-90, likely under ALWAYS for security/correctness reviews and CONDITIONAL for ordinary maintainability reviews.
- In Phase 3, after line 286, add: "For every actionable finding, classify fix scope as `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. If unknown, default to class/cross-consumer until a producer/consumer inventory proves instance-only."
- In the output contract at lines 302-307, add fields under each finding:

```markdown
   - Finding class: [instance-only | class-of-bug | cross-consumer | algorithmic | matrix/evidence | test-isolation]
   - Scope proof: [grep/test evidence proving class coverage or instance-only status]
   - Recommended fix
```

Also modify `.opencode/skill/sk-code-review/references/review_core.md:75-87` so the shared finding schema includes:

| Field | Requirement |
| --- | --- |
| `findingClass` | One of `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` |
| `scopeProof` | Grep/test/audit evidence that the recommendation covers same-class sites and consumers, or proves the finding is instance-only |

**WHY**

This addresses failure mode 1 and prevents failure modes 2 and 4 from being hidden inside vague "Recommended fix" prose. Iteration 001 showed that "fix the cited finding" repeatedly optimized for one file:line: readiness wording was treated as a README/prose site, status was missed as a scope consumer, and `data.errors` was missed as a sibling error producer.

Expected cycle compression: this moves the broad-vs-narrow decision from the fixer to the reviewer. Review reports become better planning inputs, and `/spec_kit:plan` can seed affected surfaces without rediscovering classification from scratch.

**HOW TO VERIFY**

```bash
rg -n "findingClass|Finding class|scopeProof|Scope proof|fix-completeness-checklist" \
  .opencode/skill/sk-code-review/SKILL.md \
  .opencode/skill/sk-code-review/references/review_core.md

python .opencode/skill/sk-doc/scripts/validate_document.py \
  .opencode/skill/sk-code-review/SKILL.md
```

### R5 - Add the new fix completeness checklist reference

**WHAT to change**

Create `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md`.

Minimum content:

```markdown
---
title: Fix Completeness Checklist
description: Checklist for turning review findings into complete fixes across same-class producers, consumers, algorithms, matrices, and hostile environments.
---

# Fix Completeness Checklist

## 1. Classification

State one class for every actionable finding:

| Class | Use When | Required Proof |
|-------|----------|----------------|
| `instance-only` | One cited site and grep proves no siblings or consumers | Exact grep command and result |
| `class-of-bug` | Same field/string/helper/error pattern can appear at sibling sites | Same-class producer inventory |
| `cross-consumer` | Changed policy/helper/field is observed by other handlers, status, DB, docs, or tests | Consumer inventory |
| `algorithmic` | Regex/parser/path/resolver/security logic is being changed | Invariant plus adversarial table tests |
| `matrix/evidence` | Env/default/per-call, full/incremental, fresh/stale, root shape, runtime, or doc evidence axes exist | Full row table and SHA/range pin |
| `test-isolation` | Env/global-state/singleton behavior is tested | Capture/restore proof and hostile env variant |

## 2. Required Inventories

Same-class producers:

```bash
rg -n '<field|string|helper|literal|error-pattern>' <changed-files-or-module>
rg -n 'errors\.push|warnings\.push|throw new Error|JSON.stringify|return \{.*error|message:' <changed-files-or-module>
```

Consumers:

```bash
rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'
```

Algorithm smell:

```bash
rg -n '\.replace\(|new RegExp|startsWith\(|includes\(|split\(' <changed-files>
```

Matrix/evidence:

```bash
rg -n 'it\.each|test\.each|describe\.each|REQ-|source:' <changed-tests-and-packet-docs>
git rev-parse --verify HEAD
git diff --name-only <FIX_SHA>^..<FIX_SHA>
```

Hostile env/global state:

```bash
env <RELEVANT_ENV>=true <focused-test-command>
env -u <RELEVANT_ENV> <focused-test-command>
rg -n '<ENV_OR_GLOBAL_NAME>|original.*Env|afterEach|finally|reset\(' <changed-test-files>
```

## 3. Completion Output

The fix response must include:

- Changed files.
- Finding class table.
- Same-class producer inventory.
- Consumer inventory.
- Matrix rows added or verified.
- Hostile env command when relevant.
- Previously closed gates rechecked.
- Intentionally unchanged siblings/consumers with evidence.
```

**WHY**

This operationalizes iteration 003 lines 438-511 as a reusable review/fix resource. It keeps the checklist close to `sk-code-review`, where finding recommendations are produced, instead of burying it in one research packet.

Expected cycle compression: lower prompt overhead than embedding the full research narrative every time. The checklist adds about 5-7 KB to a broad fix prompt, versus the actual `009` three fix prompts totaling 32,093 bytes and 608,552 cli-codex fix-session tokens.

**HOW TO VERIFY**

```bash
test -f .opencode/skill/sk-code-review/references/fix-completeness-checklist.md
rg -n "Finding class|Same-class producers|Consumers|Hostile env" \
  .opencode/skill/sk-code-review/references/fix-completeness-checklist.md
python .opencode/skill/sk-doc/scripts/validate_document.py \
  .opencode/skill/sk-code-review/references/fix-completeness-checklist.md
```

### R6 - Make security-sensitive deep-review convergence require closed-gate replay

**WHAT to change**

Modify `.opencode/skill/sk-deep-review/references/convergence.md`:

- After Key Defaults (`lines 31-42`), add security-sensitive override defaults:

```markdown
### Security-Sensitive Fix Overrides

For review reruns after fixes involving security, path disclosure, auth/authz, sandboxing, env precedence, public schemas, persistence, or user-visible error payloads:

| Setting | General Default | Security-Sensitive Fix Default |
|---------|-----------------|--------------------------------|
| `minStabilizationPasses` | 1 | 2 |
| `requiredClosedFindingReplay` | false | true for prior P0/P1 and any prior security/path P2 |
| `requiredFixCompletenessGate` | false | true |

STOP is not legal until the review report contains a closed-gate replay table that marks each prior active or remediated P0/P1 as `PASS`, `FAIL`, or `carried forward`, with file:line or command evidence.
```

- In the Legal-Stop Gate Bundle table at lines 368-375, add:

```markdown
| **fixCompletenessReplay** | Security-sensitive fix reruns must replay previously closed P0/P1 gates and validate producer/consumer/matrix coverage from the remediation packet | Block STOP, persist `blockedStop` |
```

- In the Gate Evaluation pseudocode around lines 379-410, add a `fixCompletenessReplay` gate whose pass condition is either non-security-sensitive scope or all required replay rows pass.

Live enforcement should mirror the reference in:

- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:474-480`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:482-488`

Add `g) fixCompletenessReplayGate` to the legal-stop decision tree and include it in `blockedBy` plus `gateResults` in the `blocked_stop` JSONL append.

**WHY**

This addresses failure mode 3 and research question 4. `009` Run 3 found a P0 after FIX-009-v2 because the review had apparently closed the earlier `data.errors` redaction issue but had not forced an adversarial replay of the redaction class. Rolling convergence was insufficient because the failure was not "more review novelty"; it was "same security class, hidden delimiter edge."

Expected cycle compression: should catch v2-style wrong abstractions before a PASS/CONDITIONAL stop. It may add one stabilization/replay pass, but it is cheaper than another fix session plus review cycle. In `009`, the final P0 cycle still cost 7m05s active and another handoff.

**HOW TO VERIFY**

```bash
rg -n "Security-Sensitive Fix Overrides|requiredClosedFindingReplay|fixCompletenessReplay" \
  .opencode/skill/sk-deep-review/references/convergence.md \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml

rg -n "blocked_stop.*fixCompletenessReplay|fix_completeness_replay_gate|fixCompletenessReplayGate" \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
```

### R7 - Put finding class and affected surfaces into the deep-review Planning Packet

**WHAT to change**

Modify deep-review synthesis instructions:

- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1035-1038`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1057-1060`

The Planning Packet currently must include `triggered`, `verdict`, `hasAdvisories`, `activeFindings`, `remediationWorkstreams`, `specSeed`, and `planSeed`. Extend it:

```yaml
The packet MUST include: `triggered`, `verdict`, `hasAdvisories`, `activeFindings`, `remediationWorkstreams`, `specSeed`, `planSeed`, `findingClasses`, `affectedSurfacesSeed`, `fixCompletenessRequired`
```

Also update Active Finding Registry instructions:

- Auto: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1040-1043`
- Confirm: `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:1062-1065`

Add `findingClass`, `scopeProofNeeded`, and `affectedSurfaceHints` to each active finding.

**WHY**

This connects R4/R5 to R3. Without these fields, `/spec_kit:plan` must infer broad-fix scope from prose, which recreates the `009` problem. The review already has the evidence; it should pass machine-readable seeds downstream.

Expected cycle compression: prevents "review found it, plan forgot it" drift. This is especially useful for multi-finding reports like `005` and `008`, where batching worked only after findings were grouped by consumer surface.

**HOW TO VERIFY**

```bash
rg -n "findingClasses|affectedSurfacesSeed|fixCompletenessRequired|scopeProofNeeded|affectedSurfaceHints" \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml
```

### R8 - Add an instance-only opt-out so the checklist does not become ceremony

**WHAT to change**

Add this rule to the new `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md` and mirror it in `.opencode/skill/sk-code-review/SKILL.md` near the Phase 3 classification rule:

```markdown
### Instance-Only Opt-Out

A finding may use the narrow fix path only when all are true:

- It is not P0/P1 security, path, auth/authz, sandboxing, env precedence, schema, persistence, or public-response behavior.
- `rg` proves no same-class producer or consumer.
- Verification is local and cheap: one focused test, one doc row, or one static audit command.
- The fix response includes the exact command evidence for the opt-out.

Otherwise, run the full fix completeness checklist.
```

**WHY**

Iteration 004 found broad fixes break even when the probability of another failed narrow cycle is roughly 40-55% active-time or 50-70% token-wise. But iteration 002 also showed small packets like `001` can compress naturally when one wrong public surface is known. The opt-out preserves speed for true one-surface fixes while making broad scope the default for risky classes.

Expected cycle compression: prevents overuse of the broad prompt. That matters because the negative consequence of ADR-001 is per-fix prompt overhead.

**HOW TO VERIFY**

```bash
rg -n "Instance-Only Opt-Out|full fix completeness checklist|narrow fix path" \
  .opencode/skill/sk-code-review/SKILL.md \
  .opencode/skill/sk-code-review/references/fix-completeness-checklist.md
```

## ADR-001 draft

<!-- ANCHOR:adr-001 -->
## ADR-001: Adopt class-of-bug-aware FIX prompts to compress multi-round trajectories

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-02 |
| **Deciders** | Spec Kit maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

The `009-end-user-scope-default` packet needed four review/fix rounds to converge:

| Round | Verdict | Findings | Fix result |
|-------|---------|----------|------------|
| Run 1 | CONDITIONAL | P0 0, P1 2, P2 4 | FIX-009 addressed the visible report, but missed sibling and consumer surfaces. |
| Run 2 | FAIL | Final adjudicated P0 1, P1 3, P2 6 | FIX-009-v2 closed major gaps, but still used regex redaction for a structural path-token problem. |
| Run 3 | FAIL | P0 1, P1 0, P2 0 | FIX-009-v3 changed the algorithm to split-then-relativize. |
| Run 4 | PASS | P0 0, P1 0, P2 0 | No further fix needed. |

The finding distribution explains the repeated cycle. In the `009` packet, mode 2 one-consumer/cross-cutting misses and mode 4 partial matrix/evidence misses accounted for 13 of 17 findings. Across audited sibling packets, mode 2 reached 24 audit-coded findings and mode 4 reached 27, making them the dominant pattern. Mode 3 algorithm choice was less frequent but more severe in security/path work: the v2 regex redaction fix still leaked a second absolute path when two path tokens were joined by colon or NUL delimiters.

The cost was material. After Run 1, the actual path consumed 69m29s active machine time, 149m15s elapsed operator time, 3 cli-codex fix sessions, 18 cli-copilot review calls, and 608,552 cli-codex fix-session tokens. A broader one-shot fix after Run 1 was estimated at 31-45m active time, 45-70m elapsed time, 1 cli-codex session, 5-6 cli-copilot calls, and 350k-420k cli-codex tokens.

### Constraints

- Keep LEAF-agent review and research architecture intact; this decision changes prompt and workflow contracts, not executor model.
- Avoid broad "fix everything nearby" scope creep. The broad path must be earned by finding class and risk, with an instance-only opt-out.
- Make checklist items self-verifying through grep, tests, diff-range pins, or review packet fields.

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: adopt class-of-bug-aware FIX prompts and downstream planning fields that require same-class producer, consumer, matrix, algorithm, and hostile-environment proof before security-sensitive or cross-cutting fixes can claim completion.

**How it works**:

- `sk-code-review` findings gain `findingClass` and `scopeProof` fields.
- A new `fix-completeness-checklist.md` defines the reusable proof protocol.
- `/spec_kit:plan` writes an `Affected Surfaces` section for fix/remediation packets.
- Level plan/checklist templates include fix addenda that turn producer/consumer/matrix inventory into completion gates.
- `sk-deep-review` uses stricter security-sensitive convergence rules, including closed-gate replay for previously fixed P0/P1 findings.
- Deep-review Planning Packets pass `findingClasses`, `affectedSurfacesSeed`, and `fixCompletenessRequired` to planning.

Adopt R1 through R8 from iteration-005 as the implementation set.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Rejected

| Alternative | Why rejected |
|-------------|--------------|
| Status quo narrow FIX prompts | The `009` trajectory shows this creates repeated "same class, new location" failures. It cost 149m15s elapsed after Run 1 and three fix sessions. |
| Deeper convergence threshold only | More iterations can find more defects, but does not make the fixer enumerate sibling/consumer surfaces. Run 3's P0 was not a convergence-math issue; it was a wrong algorithm invariant. |
| Executor change | The sibling audit found the pattern across review/fix workflows and packet types. Switching cli-codex/cli-copilot does not force class-of-bug inventory, consumer search, or matrix proof. |
| Always broad remediation for every finding | Too much overhead for instance-only docs/resource-map/test fixes. Iteration 004 supports an opt-out when grep proves one surface and verification is cheap. |

**Why this one**: It targets the dominant failure modes directly while preserving a narrow path for proven one-off findings.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Expected review/fix cycle count drops for security-sensitive and cross-cutting packets. For `009`, the expected path moves from 4 rounds to 1-2 remediation rounds.
- Review findings become better planning inputs because class, scope proof, and affected surfaces are explicit.
- Security/path fixes get adversarial replay before convergence, reducing the chance of v2-style "closed but still vulnerable" failures.
- Resource-map and evidence drift become easier to catch because SHA/range pinning is required.

**What it costs**:

- Fix prompts get longer. Iteration 004 estimated an expected broader fix at 350k-420k cli-codex tokens versus the first narrow fix at 196,118 tokens. Mitigation: use the instance-only opt-out when grep and local verification prove low blast radius.
- Planning and review reports gain more fields. Mitigation: reuse the checklist reference and machine-readable Planning Packet fields instead of embedding bespoke prose in every packet.
- Security-sensitive reviews may require an extra stabilization/replay pass. Mitigation: apply stricter convergence only to security/path/auth/env/schema/persistence/public-response fixes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Checklist becomes checkbox theater | Medium | Every checklist item requires command evidence or a concrete unchanged rationale. |
| Broad prompt causes unrelated cleanup | Medium | Affected Surfaces table uses `updated`, `covered unchanged`, `intentionally unchanged`, or `not a consumer`; unrelated surfaces are named but not edited. |
| Template target confusion persists | Low | Document that `scripts/templates/` is the renderer and canonical content lives in `templates/manifest/*.md.tmpl`. |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `009` required four rounds, 608,552 cli-codex fix tokens, and 149m15s elapsed after Run 1. Modes 2 and 4 dominated both `009` and sibling audits. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives considered include status quo, deeper convergence only, executor change, and always-broad remediation. |
| 3 | **Sufficient?** | PASS | The decision adds only the missing workflow contracts: finding class, affected surfaces, checklist proof, and security-sensitive replay. It does not replace agents or rewrite the whole review loop. |
| 4 | **Fits Goal?** | PASS | The stated goal is cycle compression for fix trajectories. Producer/consumer/matrix proof targets the exact causes of repeated cycles. |
| 5 | **Open Horizons?** | PASS | The checklist is reusable across `sk-code-review`, deep-review Planning Packets, and `/spec_kit:plan`, and can later be measured with cycle-count telemetry. |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `.opencode/skill/system-spec-kit/templates/manifest/plan.md.tmpl`: add `FIX ADDENDUM: AFFECTED SURFACES`.
- `.opencode/skill/system-spec-kit/templates/manifest/checklist.md.tmpl`: add `Fix Completeness` checklist items.
- `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml` and `_confirm.yaml`: require affected-surface generation and scoring.
- `.opencode/skill/sk-code-review/SKILL.md`: add finding class and scope-proof contract.
- `.opencode/skill/sk-code-review/references/review_core.md`: extend the shared finding schema.
- `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md`: new reusable checklist.
- `.opencode/skill/sk-deep-review/references/convergence.md`: document security-sensitive closed-gate replay.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` and `_confirm.yaml`: add the live `fixCompletenessReplayGate` and Planning Packet fields.

**How to roll back**:

Revert the template/checklist/schema/convergence edits and remove `fix-completeness-checklist.md`. Then rerun the template render checks and strict spec validation to confirm the workflow returns to the previous contract.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

## Implementation plan summary

1. Copy the ADR-001 draft above into `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/decision-record.md`.
2. Implement recommendations in dependency order: R5 first (new checklist), then R4 (review schema loads it), then R7 (deep-review emits planning fields), then R3/R1/R2 (plan and Level templates consume them), then R6 (security-sensitive convergence enforcement), then R8 (opt-out guard).
3. Validate documentation and workflow surfaces:

```bash
python .opencode/skill/sk-doc/scripts/validate_document.py \
  .opencode/skill/sk-code-review/references/fix-completeness-checklist.md

rg -n "findingClass|affectedSurfacesSeed|fixCompletenessRequired|fixCompletenessReplay|AFFECTED SURFACES|CHK-FIX" \
  .opencode/skill/sk-code-review \
  .opencode/skill/sk-deep-review/references/convergence.md \
  .opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml \
  .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml \
  .opencode/skill/system-spec-kit/templates/manifest

bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research \
  --strict
```

## Open questions remaining

1. Should the legacy/nonexistent `.opencode/skill/system-spec-kit/scripts/templates/level_*/` path be recreated as compatibility stubs, or should the implementation explicitly document that canonical content belongs in `.opencode/skill/system-spec-kit/templates/manifest/*.md.tmpl`?
2. Should `fixCompletenessReplayGate` be doc-only in `sk-deep-review/references/convergence.md` first, or immediately wired into both `spec_kit_deep-review_{auto,confirm}.yaml`? My recommendation is immediate YAML enforcement because the reference already says the YAML workflow is authoritative for live stop behavior.
3. Should P2-only security/path findings trigger the full checklist? My recommendation is yes for security/path/public-response classes, no for ordinary docs/resource-map P2 unless a consumer/matrix axis exists.

