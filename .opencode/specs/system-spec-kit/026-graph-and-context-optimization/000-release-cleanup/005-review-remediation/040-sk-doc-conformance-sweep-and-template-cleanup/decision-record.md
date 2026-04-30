---
title: "Decision Record: sk-doc Conformance Sweep and Template Cleanup"
description: "Architecture Decision Records (ADRs) for the sk-doc conformance sweep — phase-040 collision, skill_advisor reclassification, canonical full remediation, templates/changelog alignment, execution model, stay-on-main."
template_source: "SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2"
trigger_phrases:
  - "040-sk-doc-conformance-sweep-and-template-cleanup decisions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/040-sk-doc-conformance-sweep-and-template-cleanup"
    last_updated_at: "2026-04-30T08:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decision record rewritten to Level 3 canonical"
    next_safe_action: "Run validate.sh --strict; dispatch Tier 2a wave"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:040-sk-doc-conformance-sweep-and-template-cleanup"
      session_id: "040-sk-doc-conformance-sweep-and-template-cleanup"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 8
    open_questions: []
    answered_questions: []
---
# Decision Record: sk-doc Conformance Sweep and Template Cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Phase 040 collision resolution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-30 |
| **Deciders** | User, Claude |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to resolve a phase-040 slot collision because the user picked "Use 040" for this packet's location but a prior `040-evergreen-doc-packet-id-removal/` already held the slot, indexed in graph + memory with ~80KB of cross-references. Renaming an indexed packet is non-trivial and risks breaking memory/graph references.

### Constraints

- User explicitly picked the 040 slot in AskUserQuestion
- Prior 040 had ~80KB of cross-references (shadow-deltas.jsonl, advisor data, peer spec links)
- Stay-on-main rule means no isolated branch to test the rename
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: No action required — earlier session reorganization (concurrent with `054-sk-code-merger`) already renumbered the prior 040 packet to `027-evergreen-doc-packet-id-removal/`, freeing the 040 slot.

**How it works**: The 005-review-remediation parent now contains 39 sequentially numbered phase children (001..039) with the 040 slot empty. We create the new packet at 040 directly without any renames or metadata churn.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Use 040 (slot was naturally freed)** | Zero metadata churn; fastest path; user got their requested slot | Required confirming the renumber actually happened | 10/10 |
| Manually rename existing 040 → 053 first | Would have worked if collision were real | Massive metadata sweep; high risk of breaking references | 4/10 |
| Use 053 instead of 040 | Sidesteps any collision concern | Doesn't honor user's explicit 040 pick | 6/10 |

**Why this one**: The renumber happened automatically before we started; using 040 is now risk-free.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Zero metadata churn for this packet's foundation
- User's explicit 040 pick is honored
- Existing 027 packet (renumbered ancestor) keeps its indexed state untouched

**What it costs**:
- None measurable. Mitigation: N/A.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future audits cite the old 040 path | L | None needed — 027 has unique trigger phrases |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without resolution, packet creation would block on collision |
| 2 | **Beyond Local Maxima?** | PASS | Considered manual rename + alternative slot before discovering natural resolution |
| 3 | **Sufficient?** | PASS | The natural renumber fully resolves the collision |
| 4 | **Fits Goal?** | PASS | Unblocks Tier 1 foundation for the conformance sweep |
| 5 | **Open Horizons?** | PASS | Doesn't lock us out of future packets at any slot |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New packet folder: `040-sk-doc-conformance-sweep-and-template-cleanup/` (created)
- Existing `027-evergreen-doc-packet-id-removal/`: untouched (was already renumbered)

**How to roll back**: `rm -rf` the new 040 folder; existing 027 packet is unaffected.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: skill_advisor manual_testing_playbook reclassification

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-30 |
| **Deciders** | User, Claude |

---

### Context

42 of 43 per-feature files in `system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/` use the operator-runbook shape (SCENARIO/SETUP/STEPS/EXPECTED/FAILURE MODES/RELATED). This is a different document class than the canonical sk-doc test-scenario format (OVERVIEW/SCENARIO CONTRACT/TEST EXECUTION/SOURCE FILES/SOURCE METADATA with RCAF prompts). The current files have legitimate operator-runbook semantics — they describe how an operator detects and recovers from a degraded daemon state, not how an operator validates a feature scenario.

### Constraints

- The current `OP-001 Degraded Daemon` content is genuinely useful operator material; we cannot just delete it
- The directory is named `manual_testing_playbook/` which is the test-scenario format slot
- sk-doc must remain strict — exceptions undermine the contract

---

### Decision

**We chose**: Reclassify — move existing 42/43 files to a new `operator_runbook/` folder, create a fresh canonical `manual_testing_playbook/` alongside.

**How it works**: A `git mv` moves the existing operator-runbook content into a properly named sibling folder. Then we author a new canonical `manual_testing_playbook/` from scratch with proper test-scenario structure for the skill_advisor's actual feature validations.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reclassify (chosen)** | Preserves runbook content; gives skill a real test-scenario playbook; doesn't carve sk-doc exception | Doubles surface area; new playbook needs scenarios authored | 8/10 |
| Convert in place | Single doc surface; less surface area | Loses operator-runbook semantics; mismatched format vs intent | 4/10 |
| Leave as-is, mark exempt | Zero migration cost | Carves an sk-doc exception other skills could exploit | 3/10 |

**Why this one**: User picked Reclassify in AskUserQuestion. Preserves both document classes cleanly.

---

### Consequences

**What improves**:
- skill_advisor gets a real test-scenario playbook for actual feature validation
- Operator-runbook content stays exactly where it's legitimately useful
- sk-doc strict contract is preserved (no exceptions carved)

**What it costs**:
- Surface area doubles for skill_advisor (two doc folders). Mitigation: each folder serves a distinct purpose; the doubling is justified by the document-class distinction.
- New canonical `manual_testing_playbook/` requires scenario authoring. Mitigation: bootstrap with the most critical scenarios; full coverage as follow-on packet if needed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| New playbook scenarios are too thin | M | Bootstrap with critical scenarios; full coverage as follow-on |
| Move via `git mv` breaks file history | L | `git mv` preserves history; test on one file first |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without reclassification, the directory name lies about its content |
| 2 | **Beyond Local Maxima?** | PASS | Considered convert-in-place + leave-as-is before reclassifying |
| 3 | **Sufficient?** | PASS | Two folders fully address both document classes |
| 4 | **Fits Goal?** | PASS | Brings skill_advisor into sk-doc conformance |
| 5 | **Open Horizons?** | PASS | Pattern is reusable for any other skill with mixed doc classes |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `git mv .../skill_advisor/manual_testing_playbook .../skill_advisor/operator_runbook` (preserves history)
- New `mkdir .../skill_advisor/manual_testing_playbook/` + author root + category folders + per-feature files via cli-codex dispatch 003-M

**How to roll back**: `git mv` reversal of the move; `rm -rf` the new manual_testing_playbook/.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: system-spec-kit canonical playbook full remediation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-30 |
| **Deciders** | User, Claude |

---

### Context

The audit revealed the canonical reference playbook (`system-spec-kit/manual_testing_playbook/`) itself drifts from the contract it defines: 320 of 321 per-feature files use `## 4. REFERENCES` instead of `## 4. SOURCE FILES`; only 3 of 321 include `Real user request`; only 2 of 321 include `Expected execution process`; 284 of 321 have RCAF-shaped prompts but none use the explicit `RCAF Prompt` label. This is the largest single remediation surface in this packet.

### Constraints

- The canonical is the reference example for every other playbook in the audit
- Treating it as authoritative-but-grandfathered would mean every audit cites a non-conformant model
- ~321 files is a large single-batch effort with high failure radius

---

### Decision

**We chose**: Full remediation — bring the canonical into strict conformance with the contract it defines.

**How it works**: A single Tier 2c cli-codex dispatch (T-053) rewrites all 320/321 files: REFERENCES → SOURCE FILES heading change; add Real user request, Expected execution process, Desired user-visible outcome fields to SCENARIO CONTRACT; add explicit RCAF Prompt labels.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full remediation (chosen)** | Canonical becomes strictly conformant; all other audits reference correct model | Largest single batch; ~321 files modified | 9/10 |
| Grandfather — fix only root structure | Smaller diff | Per-feature drift persists; canonical stays a counter-example | 4/10 |
| Update contract to match canonical reality | Zero diff | Weakens the contract; treats accidental drift as the standard | 2/10 |

**Why this one**: User picked Full remediation in AskUserQuestion. Strictness > smallness.

---

### Consequences

**What improves**:
- Canonical reference becomes strictly conformant (the audits that cite it as ground truth become coherent)
- Every per-feature file in the canonical playbook now has the same structural shape
- Future drift sweeps can use the canonical as a true reference

**What it costs**:
- ~321 files modified in a single dispatch — highest risk in this packet. Mitigation: batch by category folder within the dispatch; manual spot-check 5+ files per batch.
- Wall time ~30-45 min for the dispatch + ~30 min for verification

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| cli-codex produces inconsistent rewrites at scale | H | Single-file scope; batch by category folder; spot-check per batch |
| File diffs blow up the next code_graph_scan | M | Run scan after the dispatch; advisor rebuild as fallback |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without this, canonical stays a counter-example to its own contract |
| 2 | **Beyond Local Maxima?** | PASS | Considered grandfather + contract-update before full remediation |
| 3 | **Sufficient?** | PASS | Bringing the canonical into conformance closes the loop |
| 4 | **Fits Goal?** | PASS | Aligns perfectly with the sk-doc conformance sweep purpose |
| 5 | **Open Horizons?** | PASS | Future drift sweeps can use the canonical as a true reference |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- 320/321 per-feature files in `system-spec-kit/manual_testing_playbook/` get section heading + scenario contract field updates
- Root playbook may also need minor section name adjustments (audit found root mostly compliant)

**How to roll back**: `git diff` + `git restore` per file or `git restore <category-folder>/*` per category.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: templates/changelog alignment (keep purpose)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-30 |
| **Deciders** | User, Claude |

---

### Context

The user flagged `templates/changelog/` as "incorrect — should utilize sk-doc canonical." However, the README explicitly states these are nested packet-local changelogs, while sk-doc's canonical is for global component changelogs at `.opencode/changelog/{NN--component}/v{VERSION}.md`. Different purposes.

### Constraints

- Two distinct changelog use cases (nested packet-local vs global component) need template support
- sk-doc canonical exists for the global case; deleting `templates/changelog/` would orphan the nested case

---

### Decision

**We chose**: Keep purpose; align frontmatter and structure to sk-doc shape (title+description-only frontmatter, OVERVIEW first, ANCHOR comments). Do not delete or merge.

**How it works**: Edit `templates/changelog/{README.md, root.md, phase.md}` to match sk-doc reference template shape while preserving the nested-packet content semantics.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep-align (chosen)** | Preserves both use cases; minimal frontmatter diff | Requires per-file edit | 8/10 |
| Delete and merge into sk-doc | Single template surface | Orphans nested-packet use case | 3/10 |
| Leave as-is | Zero diff | Frontmatter drift persists | 4/10 |

**Why this one**: Different purposes warrant different templates; alignment fixes the frontmatter without breaking purpose.

---

### Consequences

**What improves**:
- `templates/changelog/` survives with proper sk-doc-aligned frontmatter
- Nested packet-local changelog generation continues to work
- `nested_changelog.md` reference doc continues to cite this template

**What it costs**:
- 3 files edited. Mitigation: trivial.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Frontmatter alignment breaks generator script | L | Generator uses placeholders; alignment is shape-only |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Frontmatter drift was the actual user concern |
| 2 | **Beyond Local Maxima?** | PASS | Considered delete + leave-as-is before keep-align |
| 3 | **Sufficient?** | PASS | Frontmatter alignment fully addresses the shape drift |
| 4 | **Fits Goal?** | PASS | Honors sk-doc conformance for the nested case |
| 5 | **Open Horizons?** | PASS | Future generator changes don't conflict |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `templates/changelog/README.md`, `root.md`, `phase.md` frontmatter aligned to sk-doc reference shape

**How to roll back**: `git restore` per file.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Bounded-wave parallel cli-codex execution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-30 |
| **Deciders** | Claude |

---

### Context

Total scope is 25-35 cli-codex dispatches across Tier 2 sub-phases. Running all in parallel maxes API throughput and creates coordination/recovery problems if any dispatch produces inconsistent output. Running serially would take 90-200 min.

### Constraints

- cli-codex CLI is rate-limited per account at high concurrency
- Each dispatch needs verification before next dispatch can safely depend on its output
- Tier 2c high-effort dispatches need single-file scope for careful execution

---

### Decision

**We chose**: Bounded wave execution. Each wave dispatches 6-12 cli-codex agents in parallel. Waves: 2a (8 low-effort) → verify → 2b (12 medium-effort) → verify → 2c (5 high-effort, single-scope) → verify.

**How it works**: Tier 2a fans out to 8 simultaneous dispatches working on different surfaces (no overlap). After all 8 complete, verify by spot-check + `validate_document.py`. Then Tier 2b. Then Tier 2c with extra care.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Bounded waves (chosen)** | Failure radius small; verification between waves; matches user's "max parallel" directive | Wall time 2-4 hours instead of 90 min | 9/10 |
| Full parallelism (all 25 simultaneously) | Fastest wall time | Failure recovery is chaos; API throttling likely | 4/10 |
| Serial dispatch | Lowest risk | 90-200 min wall time; doesn't honor "max parallel" directive | 3/10 |

**Why this one**: Bounded parallelism balances throughput with recovery sanity.

---

### Consequences

**What improves**:
- Failed dispatches caught + re-dispatched within a wave without blocking subsequent waves
- Verification gates prevent compounding errors
- User's "max parallel" directive honored within sane bounds

**What it costs**:
- Wall time ~2-4 hours instead of theoretical ~90 min. Mitigation: verification between waves catches failures early.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| API throttling at 12 concurrent dispatches | M | Drop to 6-8 per wave if rate limits hit |
| Verification between waves is too cursory | M | Full `validate_document.py` per modified root + spot-check 1 file per dispatch |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 25-35 dispatches need some structure |
| 2 | **Beyond Local Maxima?** | PASS | Considered full-parallel + serial before bounded |
| 3 | **Sufficient?** | PASS | Bounded waves balance throughput with recovery |
| 4 | **Fits Goal?** | PASS | Honors "max parallel" directive within sane bounds |
| 5 | **Open Horizons?** | PASS | Pattern reusable for future large dispatches |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Tier 2 broken into 3 waves (2a/2b/2c) per plan.md §4
- Verify gate between waves (run validators + spot-check)

**How to roll back**: Halt the in-flight wave (`pkill -f "codex.*model.*gpt-5.5"`); per-file revert via `git restore`.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Stay on main, no feature branch

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-30 |
| **Deciders** | User (durable instruction in memory) |

---

### Context

Per memory rule "Stay on main, no feature branches" (feedback memory `feedback_stay_on_main_no_feature_branches.md`), all work commits to main. The spec folder shell was created via direct `mkdir` + `Write` to avoid `create.sh`'s auto-branching.

### Constraints

- User's durable instruction overrides default packet creation behavior
- The conformance sweep modifies many files across the repo simultaneously
- No isolated feature branch for review

---

### Decision

**We chose**: Stay on main. All work commits directly to main.

**How it works**: Direct edits + `git mv` + `git rm` operations on main. PR review (if any) is post-hoc on main commits.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Stay on main (chosen)** | Honors user's durable instruction; avoids branch-management overhead | No isolated review surface | 9/10 |
| Feature branch | Isolated review | Violates user's durable instruction | 1/10 |

**Why this one**: User's durable instruction is binding; all this packet's work is reversible per file.

---

### Consequences

**What improves**:
- Honors user's durable preference
- No branch-merge conflicts with parallel in-flight work

**What it costs**:
- No isolated review surface. Mitigation: all changes are reversible per file via `git restore`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Conflicting parallel work on main | M | This packet's modified files are largely orthogonal to other in-flight work |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Compliance with durable user instruction |
| 2 | **Beyond Local Maxima?** | PASS | Feature branch considered + rejected |
| 3 | **Sufficient?** | PASS | Direct main commits cover the workflow |
| 4 | **Fits Goal?** | PASS | Doesn't impede conformance sweep |
| 5 | **Open Horizons?** | PASS | All changes reversible |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- All packet 040 changes commit to main directly
- No feature branch created

**How to roll back**: Per-file `git restore` for content; `git mv` reversal for renames.
<!-- /ANCHOR:adr-006 -->

---

<!--
Level 3 Decision Record (Addendum): Six ADRs covering all architectural decisions.
Written in human voice: active, direct, specific.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
