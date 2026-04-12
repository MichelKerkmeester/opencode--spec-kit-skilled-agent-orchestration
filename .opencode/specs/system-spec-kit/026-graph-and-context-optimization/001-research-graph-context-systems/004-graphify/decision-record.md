---
title: "Decision Record: 004-graphify Research Phase"
description: "Architecture Decision Records covering engine selection, mid-loop engine switch, iter 7 stop override, and section 13.A append strategy for the graphify deep-research audit."
trigger_phrases:
  - "graphify decision record"
  - "graphify ADR"
  - "graphify engine switch"
  - "graphify iter 7 override"
importance_tier: critical
contextType: decision-record
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["decision-record.md"]

---
# Decision Record: 004-graphify Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use cli-codex gpt-5.4 high reasoning effort as the primary research engine

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | User directive plus orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The phase needed an engine that could read dense Python source files (extract.py is 2,500+ lines, skill.md is 650 lines) and produce evidence-grounded findings with file:line citations rather than vague summaries. The user explicitly directed "use cli-codex wherever possible" and the deep-research loop supports per-iteration engine choice through the dispatch step.

### Constraints

- Each iteration must produce at least 5 findings with file:line citations
- Tool call budget per iteration: target 8, hard max 12
- Iteration wall clock under 10 minutes for fast feedback
- External repo (`external/graphify/`) is read-only - no edits, only reads
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Dispatch iterations through `cli-codex gpt-5.4` with `model_reasoning_effort=high` and `sandbox_mode=workspace-write` in fast `exec` mode.

**How it works**: The orchestrator writes a per-iteration prompt file to /tmp/iterN-prompt.txt, then runs `codex exec --model gpt-5.4 -c model_reasoning_effort="high" -c sandbox_mode="workspace-write" "$(cat /tmp/iterN-prompt.txt)"` in background mode. Each invocation runs as a fresh-context LEAF agent that reads the cited files, writes findings to research/iterations/iteration-NNN.md, and exits.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **cli-codex gpt-5.4 high** | Strong evidence grounding, per-iteration fresh context, user-directed | External dependency, parallel-job contention risk | 9/10 |
| claude-opus-direct (the orchestrator's own context) | No external dependency, fast | Context window grows across iterations, harder to keep findings disciplined | 7/10 |
| Claude Code Task tool to dispatch a sub-agent per iteration | Native integration, clean fresh context | Slower than codex exec on dense reads | 6/10 |
| Mixed engines per iteration (codex for some, claude for others) | Flexibility | Complicates the audit trail | 5/10 |

**Why this one**: cli-codex gives the strongest combination of fresh context per iteration and dense-file reasoning, and the user explicitly directed it. The fallback to claude-opus-direct (ADR-002) absorbs the parallel-job contention risk.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Per-iteration findings are line-cited and reproducible (32 findings, every one with `[SOURCE: external/graphify/...:LINE-LINE]`)
- Fresh context per iteration prevents the orchestrator's context from drifting across long sessions

**What it costs**:

- External CLI dependency (cli-codex 0.118 must be installed). Mitigation: documented in spec section 6 dependencies and fallback to claude-opus-direct is proven.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| codex parallel-job API contention starvation | H | ADR-002 engine switch protocol |
| codex sandbox mode blocks needed writes | M | Use `workspace-write` outside `external/`; never write inside `external/` |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase needs evidence-grounded reads of large source files |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives compared above |
| 3 | **Sufficient?** | PASS | Iter 1 produced 8 findings with line citations in 4 minutes |
| 4 | **Fits Goal?** | PASS | Critical path of the audit |
| 5 | **Open Horizons?** | PASS | Pattern reusable for future deep-research phases |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- Iter 1 dispatched via cli-codex gpt-5.4 high (106K tokens, 8 findings, ~4 minutes)
- Iters 8 to 10 dispatched via cli-codex gpt-5.4 high after iter 7 stop override (270K tokens cumulative, 32 findings, ~25 minutes wall clock)

**How to roll back**: Switch any subsequent iteration to claude-opus-direct via the orchestrator. No persistent state binds the loop to a specific engine.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Switch engine to claude-opus-direct after iter 2 codex starvation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | User directive after observing iter 2 wall clock |

---

### Context

Iter 1 (cli-codex gpt-5.4 high) finished in ~4 minutes. Iter 2 dispatched the same way starved on parallel-job API contention: ~20 minutes wall clock with 0 CPU time. The user said "do faster", indicating that wall clock was the dominant constraint.

### Constraints

- Cannot block the loop indefinitely waiting on cli-codex
- Cannot abandon evidence-grounded reads; whatever replaces codex must still produce file:line citations
- Engine switches must be auditable

---

### Decision

**We chose**: Switch iterations 2 through 7 from cli-codex to claude-opus-direct (the orchestrator's own context) and log the switch as an `engine_switch` event in `deep-research-state.jsonl`.

**How it works**: The orchestrator reads the cited files directly via the Read tool, performs the same evidence-grounding discipline as codex would have, and writes the iteration file. The reducer treats both engines identically.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **claude-opus-direct fallback** | Fast (1 to 3 minutes per iteration), no external dependency | Context shared with orchestrator | 9/10 |
| Wait for codex to recover | Preserves engine consistency | Indefinite delay; user said "faster" | 2/10 |
| Retry codex with reduced scope | Might recover | Wastes another iteration of wall clock | 4/10 |

**Why this one**: claude-opus-direct unblocks the loop immediately and produces equally strong findings (iters 2 to 7 each delivered 10 to 13 findings with file:line citations).

---

### Consequences

**What improves**:

- Loop completes in ~3 hours instead of ~10+ hours
- Iter 2 to 7 still produced strong evidence-grounded findings

**What it costs**:

- Engine inconsistency in the audit trail. Mitigation: `engine_switch` event in JSONL, `engine` field on every iteration record.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Orchestrator context drift across iterations | M | Each iteration scoped to a single focus track; reducer-managed strategy keeps focus disciplined |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | iter 2 starvation made cli-codex unusable for the next steps |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives compared above |
| 3 | **Sufficient?** | PASS | iters 2 to 7 produced 70 findings cumulatively |
| 4 | **Fits Goal?** | PASS | unblocks the critical path |
| 5 | **Open Horizons?** | PASS | Future loops can re-attempt cli-codex when API contention clears |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:

- iters 2 to 7 dispatched via claude-opus-direct
- `engine_switch` event logged at JSONL line 4 with `from: codex-cli`, `to: claude-opus-direct`, reason

**How to roll back**: Future iterations can switch back to cli-codex by setting `--model gpt-5.4 -c model_reasoning_effort=high` in the dispatch command. Iters 8 to 10 demonstrated the switch-back is clean.
---

### ADR-003: Override iter 7 composite_converged stop with 3 forced cli-codex iterations

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | User directive |

---

### Context

After iter 7, the loop logged a `convergence_check` event with composite_converged decision, coverage 91.7% (11 of 12 questions answered), and stop reason `composite_converged_coverage_exceeded_threshold`. Q12 (Adopt/Adapt/Reject grounding) was the only unanswered question and was scheduled to be the synthesis output. Three high-value modules were still under-read: full `export.py` (954 lines, only 240-275 read in iter 3), `wiki.py` (never read), `serve.py` (never read), and the per-language extractor matrix in `extract.py:301-2206` was still only sampled. The user explicitly requested "3 more iterations of spec_kit:deep-research with gpt 5.4 high agents in fast mode through cli-codex".

### Constraints

- Cannot rewrite K1 to K12 baseline findings
- Must preserve audit lineage
- Each new iteration must still respect the 12-tool-call budget
- Final coverage must reach 1.0 to declare full closure

---

### Decision

**We chose**: Override the composite_converged stop, log a `continuation` event in JSONL, dispatch 3 forced iterations (8, 9, 10) via cli-codex gpt-5.4 high in fast `exec` mode, and append findings as a new section 13.A in research.md rather than rewriting K1 to K12.

**How it works**: The orchestrator wrote `continuation` event at JSONL line 12 with reason "user explicit directive to do 3 more iterations (8-10) overriding composite_converged stop at iter 7", then dispatched iter 8 (export/wiki/serve), iter 9 (build orchestration + cross-corpus), iter 10 (per-language matrix + final Q12 grounding). Each iteration used the same cli-codex command pattern established in ADR-001.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Override and dispatch 3 cli-codex iterations** | Gets full coverage, line-grounds Q12, picks up the 3 high-value unread modules | More wall clock | 9/10 |
| Synthesize at iter 7 with 11 of 12 coverage | Faster | Q12 stays a synthesis assertion rather than line-grounded | 5/10 |
| Dispatch 3 iterations via claude-opus-direct instead | No cli-codex dependency | User explicitly asked for cli-codex | 6/10 |
| Override and dispatch only 1 iteration covering all 3 gaps | Faster | Tool budget would blow past 12 calls; quality would suffer | 4/10 |

**Why this one**: The user directive was explicit about engine, count, and mode. Three iterations let each one focus on a coherent area (export/serve, build orchestration, per-language matrix) without blowing the per-iteration budget.

---

### Consequences

**What improves**:

- Final coverage reaches 1.0 (12 of 12 questions)
- Q12 Adopt/Adapt/Reject table is line-grounded with file:line evidence per row
- 3 high-value modules (export.py, wiki.py, serve.py) are now fully read
- Per-language extractor matrix is comprehensive (12 extractors, 16 extensions, all cited)

**What it costs**:

- ~25 minutes of additional wall clock. Mitigation: parallel codex dispatch was considered and rejected (ADR-002 risk).
- 270K additional tokens spent. Mitigation: research.md value justifies the cost.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Iter 8 to 10 findings duplicate K1 to K12 | M | Each iter prompt explicitly listed prior coverage and the "do not re-derive" rule |
| Section 13.A append breaks cross-references in section 12 | L | Keep section 13.A as the evidence ledger, then inline any validated follow-on rows into section 12 during packet refinement |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Q12 line-grounding was the synthesis output and needed evidence |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives compared above |
| 3 | **Sufficient?** | PASS | 3 iterations closed 3 high-value gaps and produced 32 findings |
| 4 | **Fits Goal?** | PASS | Direct user directive on critical path |
| 5 | **Open Horizons?** | PASS | Pattern of "user-driven continuation past composite_converged" is reusable |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:

- `continuation` event in JSONL at line 12
- 3 new iteration files: `research/iterations/iteration-008.md`, `research/iterations/iteration-009.md`, `research/iterations/iteration-010.md`
- 3 new iteration records in JSONL (lines 13, 14, 15)
- New `convergence_check` event in JSONL at line 16 with stop reason `max_iterations_reached_and_all_questions_answered`
- New section 13.A in research.md with K13 to K32 findings
- 4 new section 12 rows originated from section 13.A evidence and were later inlined as A5, A6, D6, and D7 during packet refinement

**How to roll back**: Archive `iteration-{008..010}.md` under `research/archive/iterations/`, append a `correction` event to JSONL, restore research.md from prior generation, and remove any section 12 rows whose evidence depends exclusively on section 13.A.
---

### ADR-004: Append cli-codex findings as section 13.A rather than rewriting K1 to K12

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | Orchestrator |

---

### Context

Iters 8 to 10 produced 32 cumulative findings (K13 to K32 are the new ones). The synthesis had two options: rewrite K1 to K12 to absorb the new evidence, OR append a new section that preserves K1 to K12 and adds the new findings as K13 to K32. K1 to K12 were already cross-referenced from section 12 (Adopt/Adapt/Reject), section 13 (key findings list), and section 16 (convergence report). Rewriting them risked invalidating those cross-references.

### Constraints

- Preserve audit lineage so anyone can see which findings came from which iteration generation
- Do not break existing cross-references in research.md
- Keep research.md scannable - append should be a clean new section, not interleaved edits

---

### Decision

**We chose**: Append iters 8 to 10 findings as a new section 13.A "Iterations 8-10 Findings (cli-codex gpt-5.4 high additions)" with sub-sections 13.A.1 (export/serve), 13.A.2 (build orchestration), 13.A.3 (per-language), and 13.A.4 (lineage notes for how those findings strengthen section 12).

**How it works**: The synthesis edit added the section after the existing section 13 content but before section 14. Existing K1 to K12 references stay valid. A later packet-refinement pass can safely inline any mature recommendation rows into section 12 while preserving section 13.A as the audit trail.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Append as section 13.A** | Preserves audit lineage, no cross-reference breakage, scannable | Section 12 and section 13.A both need to be read | 9/10 |
| Rewrite K1 to K12 to absorb K13 to K32 | Single source of truth for findings | Breaks cross-references, loses iteration lineage | 4/10 |
| Inline new findings into existing K-numbered groups | Logical consistency | Renumbering breaks cross-references | 3/10 |
| Add an appendix file (research-extension.md) | Cleanest separation | Splits the canonical synthesis across files | 5/10 |

**Why this one**: Audit lineage is the most important property of a research synthesis. A future reader can run `git blame` on research.md and see exactly which findings came from which iteration generation.

---

### Consequences

**What improves**:

- Audit lineage preserved
- K1 to K12 cross-references stay valid
- Section 13.A makes the cli-codex extension explicit and bounded

**What it costs**:

- Section 13.A and section 12 must stay synchronized if any extension findings mature into canonical recommendation rows. Mitigation: later audit pass inlines promoted rows while preserving section 13.A for lineage.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future readers miss the section 13.A evidence lineage behind promoted rows | L | Keep section 13.A.4 as historical notes even after section 12 is inlined |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Iter 8 to 10 findings need a home in research.md |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives compared above |
| 3 | **Sufficient?** | PASS | Section 13.A holds 20 net-new findings cleanly |
| 4 | **Fits Goal?** | PASS | Preserves audit lineage |
| 5 | **Open Horizons?** | PASS | Pattern reusable for any future continuation past composite_converged |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:

- New section 13.A in research.md with 4 sub-sections
- Updated CHANGELOG entry mentioning the cli-codex extension
- Updated section 16 convergence report with both initial and final stop reasons

**How to roll back**: Delete section 13.A from research.md and revert section 16 + CHANGELOG. K1 to K12 stay intact.

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
