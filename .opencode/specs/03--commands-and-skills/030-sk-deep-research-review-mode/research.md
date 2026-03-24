# Review Mode for sk-deep-research: Research Findings

## 1. Executive Summary

sk-deep-research v1.1.0's iterative loop infrastructure — LEAF agent dispatch, JSONL state, 3-signal convergence, quality guards, dashboard — is **strongly reusable** for a "review mode" that iteratively audits code quality instead of researching external topics. Of 15 infrastructure components analyzed, 2 are REUSE-AS-IS, 12 are ADAPT, and only 1 (the synthesis output) requires REPLACE.

**Key decisions from research:**
- **Parallel YAML workflows** (`deep-review_auto.yaml` / `deep-review_confirm.yaml`), not a config switch in existing YAMLs
- **New `@deep-review` LEAF agent** — hybrid of @review (rubric, P0/P1/P2, self-check) + @deep-research (state protocol, JSONL, iteration lifecycle)
- **`/spec_kit:deep-review[:auto|:confirm]`** as the command interface
- **Severity-weighted `newFindingsRatio`** with P0 override rule replacing `newInfoRatio`
- **7 review dimensions** with hybrid ordering (inventory pass → risk-ordered deep passes)
- **6 cross-reference verification protocols** with severity classification
- **11-section `review-report.md`** with 4-verdict release readiness assessment

---

## 2. Infrastructure Reuse Analysis

### Component Classification

| # | Component | Classification | Key Adaptation |
|---|-----------|---------------|----------------|
| 1 | YAML workflow (4 phases) | ADAPT | New parallel YAMLs; reuse phase structure, not phase bodies |
| 2 | Config JSON | ADAPT | Add `mode`, `reviewTarget`, `reviewDimensions`, `severityThreshold`, `crossReference`, `qualityGateThreshold` |
| 3 | JSONL state log | ADAPT | Add `dimension`, `severityCounts`, `reviewedArtifacts`, `newFindingsRatio` |
| 4 | Strategy file | ADAPT | "Key Questions" → "Review Dimensions"; add Running Findings, Cross-Reference Status, Files Under Review |
| 5 | Iteration files | ADAPT | P0/P1/P2 findings with file:line; Scorecard; Cross-Reference Results |
| 6 | Dashboard | ADAPT | Findings summary by severity; dimension coverage; score trend |
| 7 | Convergence algorithm | ADAPT | Severity-weighted ratio; dimension coverage signal; review-specific guards |
| 8 | Stuck recovery | ADAPT | Review failure modes: change lens, escalate granularity, cross-reference focus |
| 9 | research.md synthesis | **REPLACE** | New `review-report.md` — findings-first, 11-section, severity-ordered |
| 10 | Memory save phase | REUSE-AS-IS | Spec-folder based, content-agnostic |
| 11 | Setup phase | ADAPT | `review_target` replaces `research_topic`; add dimension/scope inputs |
| 12 | Agent dispatch | ADAPT | New @deep-review agent; review-specific dispatch context template |
| 13 | Pause sentinel | REUSE-AS-IS | Content-agnostic |
| 14 | Ideas backlog | ADAPT | Rename to review-oriented language |
| 15 | Progressive synthesis | ADAPT | Target `review-report.md`; severity-aware refresh triggers |

### Architecture Decision: Parallel YAMLs

**Recommendation: Parallel `spec_kit_deep-review_auto.yaml` and `spec_kit_deep-review_confirm.yaml`.**

Arguments:
- The existing system already uses parallel YAMLs for auto/confirm (precedent for workflow specialization)
- Current YAML is saturated with research-specific nouns, prompts, and tool expectations
- A config-switch approach would require conditional branches in nearly every phase
- Parallel YAMLs give cleaner contracts, easier testing, and simpler auditing
- Add `"mode": "review"` in config for downstream consumers that need to distinguish sessions

### Adaptation Complexity

| Component | Est. LOC | Risk |
|-----------|-------:|------|
| YAML workflow | 250-450 | Medium |
| Convergence algorithm | 60-120 | Medium-High |
| Agent dispatch + new agent | 80-180 | Medium |
| Strategy file template | 40-90 | Low-Medium |
| JSONL state format | 40-80 | Medium |
| Dashboard template | 30-60 | Low |
| Config JSON | 15-35 | Low |
| Setup phase | 25-60 | Low-Medium |
| Iteration file format | 30-70 | Low-Medium |
| **Total** | **570-1,145** | **Medium** |

### Existing Inconsistencies Found

1. `state_format.md` omits `maxToolCallsPerIteration` and `maxMinutesPerIteration` but config template uses them
2. `state_format.md` says dashboard includes Source Diversity section but actual template does not
3. `loop_protocol.md` requires charter validation but neither YAML has an explicit validation step
4. Convergence reference excludes `thought` from signal computation but YAML only reflects this in stuck-count
5. `confirm.yaml` says wave mode is auto-only but auto.yaml keeps waves in `reference_only_appendix`

---

## 3. Convergence Algorithm Design

### Metric: newFindingsRatio (severity-weighted)

```
SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 }

weightedNew = sum(SEVERITY_WEIGHTS[f.severity] for f in fully_new_findings)
weightedRefinement = sum(SEVERITY_WEIGHTS[f.severity] * 0.5 for f in refinement_findings)
weightedTotal = sum(SEVERITY_WEIGHTS[f.severity] for f in all_findings_this_iteration)

newFindingsRatio = (weightedNew + weightedRefinement) / weightedTotal
```

**P0 override rule:** If ANY new P0 discovered → `newFindingsRatio = max(calculated, 0.50)`. A single new P0 blocks convergence.

If `total_findings == 0` (clean pass) → `newFindingsRatio = 0.0`.

### 3-Signal Weighted Vote (Adapted)

| Signal | Weight | Window | Threshold | Min Iters | Measures |
|--------|--------|--------|-----------|-----------|---------|
| Rolling Average | 0.30 | 2 | 0.08 | 2 | Avg of recent newFindingsRatios |
| MAD Noise Floor | 0.25 | all | 1.4826 scale | 3 | Statistical noise detection |
| Dimension Coverage | 0.45 | n/a | 1.0 (100%) | 1 | All dimensions reviewed |

**Stop:** `weighted_stop_score > 0.60` → vote STOP (then quality guards must pass).

### Quality Guards (5 binary checks)

| Guard | Rule | Fail Action |
|-------|------|-------------|
| Evidence Completeness | Every P0/P1 finding has file:line evidence | Block STOP |
| Scope Alignment | All findings within declared review scope | Block STOP |
| No Inference-Only | No P0/P1 based solely on inference | Block STOP |
| Severity Coverage | Security + Correctness dimensions reviewed | Block STOP |
| Cross-Reference (optional, 5+ iters) | At least one multi-dimension iteration | Block STOP |

### Edge Cases

- **Clean codebase (0 findings):** Continue until all dimensions covered (min 7 iterations for full coverage). Converge after 2+ clean passes with 100% dimension coverage.
- **Huge scope (100+ files):** `maxFilesPerIteration: 20`; dimension batching allowed when file count > 50.
- **Late P0 discovery:** P0 override rule ensures convergence cannot happen.

### Stuck Recovery (threshold: 2)

| Failure Mode | Recovery Strategy |
|-------------|-------------------|
| Same dimension, no findings | Change granularity (file → function → line) |
| Multiple clean dimensions | Cross-reference analysis across dimensions |
| Low-value iterations | Escalate severity review of P2 findings |

---

## 4. Review Scope & Cross-Reference Protocol

### Target Types

| Target | Input | Discovery | Default Max Iters |
|--------|-------|-----------|-------------------|
| Spec folder | path or `spec:NNN-name` | Read spec artifacts + implementation files | 6 |
| Skill | `skill:sk-name` | SKILL.md + references/ + assets/ + agents + commands | 8 |
| Agent family | `agent:name` | All runtimes (.claude, .codex, .opencode, etc.) | 5 |
| Feature track | `track:NN--name` | All child spec folders in track | 10 |
| Arbitrary files | explicit paths/globs | User paths + immediate cross-references | 4 |

### Review Dimensions (7 default)

| Priority | Dimension | Checks | Typical Findings |
|----------|-----------|--------|-----------------|
| 1 | Correctness | Logic, state flow, edge cases, error handling | P0 destructive behavior, P1 bad state |
| 2 | Security | Auth, input/output safety, data exposure, permissions | P0 auth bypass, P1 data leak |
| 3 | Spec Alignment | Spec/plan/tasks/checklist claims vs shipped reality | P0 false blocker completion, P1 missing feature |
| 4 | Completeness | Required files, sections, tests, checklist coverage | P0 missing blocker, P1 missing test |
| 5 | Cross-Ref Integrity | IDs, links, root-to-snippet alignment, runtime anchors | P1 broken anchor, P2 stale link |
| 6 | Patterns | Baseline+overlay compliance, template shape, conventions | P1 missing section, P2 style drift |
| 7 | Documentation Quality | Current-reality honesty, operator clarity | P1 misleading guidance, P2 polish |

**Ordering strategy:** Iteration 0 builds artifact map (inventory), then risk-ordered deep passes: Correctness → Security → Spec Alignment → Completeness → Cross-Ref → Patterns → Documentation.

### Cross-Reference Verification Protocol

| # | Check | Source → Target | P0 When | P1 When | P2 When |
|---|-------|----------------|---------|---------|---------|
| 1 | Spec vs Code | spec.md claims → implementation | Blocker falsely complete | Feature missing | Summary stale |
| 2 | Checklist vs Evidence | [x] items → cited evidence | P0 item unchecked | Checked but no evidence | Weak evidence |
| 3 | SKILL.md vs Agent | Skill contracts → agent files | Unsafe permission mismatch | Workflow divergence | Wording drift |
| 4 | Agent Cross-Runtime | .claude vs .codex vs .opencode | Write/read permission conflict | Workflow/rubric divergence | Model/path wording |
| 5 | Feature Catalog vs Code | Catalog claims → implementation | n/a | Removed feature still listed | Implemented but unlisted |
| 6 | Playbook vs Capability | Scenario preconditions → actual | n/a | Tests unshipped behavior | Coverage incomplete |

### Findings Deduplication

- **Key:** `reference_type + normalized_issue + source_artifact + target_artifact + primary_location`
- Same file:line, multiple dimensions → single finding, multiple dimension tags
- Severity upgrades mutate existing finding (record `first_seen`, `upgraded_in`, `previous_severity`)
- Convergence counts deduped new findings, not raw observations

---

## 5. LEAF Agent Architecture

### Recommendation: New `@deep-review` Agent (Option B)

| Source | Sections |
|--------|----------|
| From @review | Quality rubric, P0/P1/P2 severity, Hunter/Skeptic/Referee, overlay loading, output verification |
| From @deep-research | Single-iteration workflow, state-first protocol, JSONL append, strategy updates, LEAF-only rule, budget discipline |

**Agent outline (8 sections):**
1. Identity and permissions
2. Single review-iteration workflow (read state → determine dimension → execute review → write findings → update strategy → append JSONL)
3. Capability scan (skills + tools)
4. Review rubric and severity contract
5. State management and write safety
6. Iteration file format
7. Adversarial self-check (tiered: P0 in-iteration, P1 compact, full at synthesis)
8. Output verification and anti-patterns

### Tool Budget

| Phase | Calls |
|-------|------:|
| State reads (JSONL + strategy) | 2 |
| Scope/cross-ref discovery | 1-2 |
| Evidence (Read/Grep/Glob) | 3-4 |
| State writes (iteration + strategy + JSONL) | 3 |
| Extra verification (P0 candidate) | 0-1 |
| **Total** | **9-12 (max 13)** |

### Permission Matrix

| Tool | Review Target | scratch/ | strategy.md | JSONL |
|------|:------------:|:--------:|:-----------:|:-----:|
| Read | RO | RO | RO | RO |
| Grep/Glob/Bash | RO | RO | RO | RO |
| Write | NO | iteration-NNN.md | NO | Append-only |
| Edit | NO | NO | Section-scoped | NO |

### Dispatch Context Template

```
REVIEW ITERATION {N} of {MAX}
MODE: review
DIMENSION: {focus}
REVIEW TARGET: {scope}
PRIOR FINDINGS: P0={n} P1={n} P2={n}; unresolved={ids}
LAST ITERATIONS: {summaries}
CROSS-REFERENCE TARGETS:
- Spec: {paths}
- Code: {paths}
- Tests: {paths}
SCORING RUBRIC: Correctness=30 Security=25 Patterns=20 Maintainability=15 Performance=10
SEVERITY THRESHOLDS:
- P0: exploitable security, auth bypass, destructive data loss
- P1: correctness bug, spec mismatch, must-fix gate issue
- P2: non-blocking improvement
STATE FILES: {paths}
OUTPUT: Write iteration-{NNN}.md, edit strategy, append JSONL
CONSTRAINTS: LEAF-only, review target read-only, 9-12 calls max 13
```

### Adversarial Self-Check Policy

1. Candidate P0 → full Hunter/Skeptic/Referee in same iteration before writing
2. Gate-relevant P1 → compact skeptic/referee pass in-iteration
3. Synthesis → full recheck on all carried-forward P0/P1 before final report

---

## 6. Output & Integration Design

### review-report.md Format (11 sections)

1. **Executive Summary** — Verdict, score, band, P0/P1/P2 counts, scope
2. **Score Breakdown** — 5 dimensions with score, band, driver
3. **P0 Findings (Blockers)** — ID, file:line, evidence, impact, fix recommendation
4. **P1 Findings (Required)** — Same structure
5. **P2 Findings (Suggestions)** — Compact cards
6. **Cross-Reference Results** — Check/result/evidence/status table
7. **Coverage Map** — Files/dimensions reviewed with gaps
8. **Positive Observations** — What is well-implemented
9. **Convergence Report** — Iterations, trend, stop reason
10. **Remediation Priority** — Ordered action items
11. **Release Readiness Verdict** — PASS / CONDITIONAL / FAIL + rationale

### Progressive Synthesis Protocol

1. Maintain finding registry keyed by `findingId` with status: `active|duplicate|upgraded|downgraded|contested|resolved_false_positive`
2. Deduplicate by `file:line + normalized_title` — merge and keep highest severity
3. Severity upgrades are monotonic until adjudicated
4. Contradictions → mark `contested`, require referee pass, then resolve
5. Running totals count only `active` findings
6. Refresh report after every iteration when `progressiveSynthesis=true`; force refresh on new P0, upgrade, contradiction resolution, or cross-ref status change
7. Final synthesis rebuilds from all iteration files (never trusts last progressive draft)

### Command Interface

**`/spec_kit:deep-review[:auto|:confirm] "target"`**

- Internally runs the same loop engine with `mode=review`
- Separate command entry point for clear UX (vs `/spec_kit:deep-research`)
- Separate YAML workflows (deep-review_auto/confirm)
- Shared scratch state file names for compatibility

### Config Adaptations

| Field | Status | Default | Purpose |
|-------|--------|---------|---------|
| `mode` | NEW | `"review"` | Distinguish review from research sessions |
| `reviewTarget` | NEW | required | What to review |
| `reviewTargetType` | NEW | `"spec-folder"` | Target type for scope derivation |
| `reviewDimensions` | NEW | all 7 | Which dimensions to check |
| `severityThreshold` | NEW | `"P2"` | Minimum severity to report |
| `crossReference` | NEW | `{spec:true, checklist:true, agentConsistency:true}` | Cross-ref checks to enable |
| `qualityGateThreshold` | NEW | 70 | Score threshold for PASS/FAIL |
| `maxIterations` | REUSED | 7 | Lower default (finite scope) |
| `convergenceThreshold` | REUSED | 0.10 | Higher default (diminishing returns sooner) |
| `progressiveSynthesis` | REUSED | true | Progressive report updates |

### Post-Review Workflow

| Verdict | Condition | Action | Next Command |
|---------|-----------|--------|-------------|
| FAIL | Active P0 or score <70 | Block release | `/spec_kit:plan` for remediation |
| CONDITIONAL | No P0, active P1 | Not release-ready | `/spec_kit:plan` for fixes |
| PASS WITH NOTES | Only P2 | Approve with backlog | `/create:changelog` |
| PASS | No active findings | Release ready | `/create:changelog` |

---

## 7. Implementation Roadmap

### Phase 1: Foundation (config, state, templates)
- Add `mode` field to config schema in `state_format.md`
- Create review-mode strategy template (`deep_review_strategy.md`)
- Create review-mode dashboard template (`deep_review_dashboard.md`)
- Extend JSONL schema with review-specific fields
- Create review iteration file template

### Phase 2: Convergence Adaptation
- Add `shouldContinue_review()` to `convergence.md`
- Implement severity-weighted `newFindingsRatio` with P0 override
- Adapt 3 signals (rolling avg window=2, MAD weight=0.25, dimension coverage 100%/0.45)
- Add 5 review quality guards
- Add review-specific stuck recovery (threshold 2)

### Phase 3: LEAF Agent
- Create `@deep-review` agent definition (hybrid @review + @deep-research)
- Deploy across 5 runtimes (.claude, .opencode, .opencode/chatgpt, .codex, .agents)
- Define dispatch context template
- Define iteration file format with scorecard and P0/P1/P2

### Phase 4: YAML Workflows
- Create `spec_kit_deep-review_auto.yaml`
- Create `spec_kit_deep-review_confirm.yaml`
- Implement 4-phase workflow: init → review loop → synthesis → save
- Add scope discovery, dimension ordering, cross-reference checks
- Add progressive synthesis with finding registry

### Phase 5: Command & Integration
- Create command entry point (`deep-review.md`)
- Implement setup phase (review target, dimensions, mode)
- Add `review-report.md` synthesis template
- Add post-review verdict and next-command recommendations
- Update SKILL.md with review mode documentation
- Update quick_reference.md with review commands

### Phase 6: Cross-Runtime & Testing
- Deploy agent across all 5 runtimes
- Create manual testing playbook scenarios for review mode
- Test convergence with clean, mixed, and broken codebases
- Test cross-reference protocols against real spec folders
- Validate post-review workflow integration

---

## 8. Open Questions

1. **Performance dimension:** Should it be a default dimension or conditional? (Agent 3 says conditional; Agent 5 includes it in default rubric scoring)
2. **Shared scratch filenames:** Keep `deep-research-*.json/jsonl/md` or rename to `deep-review-*`? (Agent 5 says keep for compatibility; Agent 4's dispatch template uses `deep-review-*`)
3. **Single skill vs separate skill:** Research assumes review mode extends sk-deep-research. Should it be a separate sk-deep-review skill? (User preference was single skill for v1.1.0; may need revisiting for review mode complexity)
4. **Remediation auto-generation:** Opt-in only? Or should confirm mode offer it at synthesis gate?

---

## 9. Eliminated Alternatives

| Approach | Reason for Rejection |
|----------|---------------------|
| Config switch in same YAML | Current system prefers workflow specialization; conditional branches in every phase |
| Reuse @review as LEAF agent | Muddies read-only identity; requires weakening reviewer contract |
| Mode-switch @deep-research via dispatch | Fights base contract; research-shaped instructions confuse review behavior |
| Flat newFindingsRatio (no severity weights) | P0 discovery masked by low raw ratio; safety gap |
| Separate convergence algorithm | 80%+ of structure maps cleanly; adaptations are parameter/semantic changes |
| Per-dimension convergence trackers | Excessive complexity for same outcome |
| `/spec_kit:review` command | Too ambiguous with single-pass @review agent |
| Auto-create remediation plans | Review and implementation should remain separate |
| Score-only convergence | Hides untouched files and dimensions |
| Reusing `research.md` with cosmetic rename | Synthesis contract is research-shaped, not findings-first |
| One-shot review (no iterations) | Loses JSONL log, dashboard, resume, recovery — the strongest infrastructure |
| Full adversarial self-check every iteration | Token cost too high; tiered approach preserves fidelity |
| Silent contradiction dropping | Causes unstable counts and unreliable verdicts |

---

## 10. Convergence Report

| Metric | Value |
|--------|-------|
| Iterations | 5 (single wave) |
| Stop reason | All 5 questions answered |
| Agent mix | 4x GPT-5.4 xhigh (codex) + 1x Opus native |
| Total iteration lines | 1,341 |
| Cross-agent contradictions | 2 minor (resolved in synthesis — see Open Questions #1 and #2) |
| Research quality | All 5 shards substantive with file-level citations |
| newInfoRatio (all iterations) | 1.0 (first wave, all findings new) |

**All research questions answered. Ready for `/spec_kit:plan` to design implementation.**
