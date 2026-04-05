# Superego Analysis Synthesis

> Focused synthesis of quality gates, evaluation frameworks, and governance patterns from the Superego repository analysis for system-spec-kit enhancement.

---

## Metadata

| Field | Value |
|-------|-------|
| **Source Repository** | https://github.com/open-horizon-labs/superego |
| **Original Analysis** | Archived during consolidation (source folder not present in this repository snapshot) |
| **Analysis Date** | 2026-01-15 |
| **Synthesis Date** | 2026-01-22 |
| **Research Method** | 20 parallel Opus 4.5 agents (10 initial + 10 verification) |
| **Confidence Score** | HIGH (130+ patterns identified across 30+ source files) |

---

## Executive Summary

Superego is a metacognitive evaluation system designed to provide quality oversight for AI coding assistants. It implements a gate-based decision framework with structured outputs (DECISION: PASS/BLOCK, CONFIDENCE: HIGH/MEDIUM/LOW) and comprehensive audit trails. **Superego and system-spec-kit are complementary systems**: Superego excels at quality gates and evaluation while system-spec-kit excels at memory persistence and semantic retrieval. The key adoptable patterns are the Five Checks evaluation framework, structured decision format, fail-safe defaults, and decision journaling.

---

## Key Patterns Identified

| Pattern | Description | Applicability | Priority |
|---------|-------------|---------------|----------|
| **Five Checks Framework** | Systematic evaluation criteria (Necessary?, Beyond Local Maxima?, Sufficient?, Fits Goal?, Open Horizons?) | HIGH - Already partially implemented in AGENTS.md | P0 |
| **Gate-Based Structure** | Sequential checkpoints (Intent → Evaluation → Completion) that must all pass | HIGH - Aligns with existing gate system | P0 |
| **Structured Decision Format** | DECISION: PASS/BLOCK + CONFIDENCE: HIGH/MEDIUM/LOW + EVIDENCE | HIGH - Provides clear audit trail | P1 |
| **Fail-Safe Defaults** | Unknown → BLOCK for safety; lower tier wins on conflict | HIGH - Critical for safety | P0 |
| **Decision Journaling** | Timestamped audit trail in decisions/ folder | MEDIUM - Useful for debugging | P1 |
| **Guardrail Severity** | HARD (no override) / SOFT (bypass allowed) / ADVISORY (warn only) | HIGH - Clarifies enforcement | P1 |
| **Carryover Context** | Bounded recent context (decision_count + window_minutes) | MEDIUM - Prevents context explosion | P2 |
| **Domain Overlays** | Separate prompt configs for code/writing/learning tasks | MEDIUM - Supports specialization | P2 |
| **Retrospective Generation** | HTML timeline of session decisions | LOW - Nice-to-have for review | P3 |
| **Pull Mode** | Agent-controlled evaluation (on-demand vs always-on) | LOW - For advanced users only | P3 |

---

## Five Checks Evaluation Framework

The Five Checks provide a systematic metacognitive evaluation before taking action:

### Framework Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CHECK 1: NECESSARY?                                                          │
│   "Is this solving an actual need NOW, not a hypothetical future need?"      │
│   - Reject speculative features                                              │
│   - Verify explicit user request or documented requirement                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ CHECK 2: BEYOND LOCAL MAXIMA?                                                │
│   "Have alternative approaches been explored?"                               │
│   - Avoid tunnel vision on first solution                                    │
│   - Consider at least one alternative before committing                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ CHECK 3: SUFFICIENT?                                                         │
│   "Is this the simplest approach that actually works?"                       │
│   - YAGNI principle enforcement                                              │
│   - Reject over-engineering                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ CHECK 4: FITS GOAL?                                                          │
│   "Does this stay on the critical path to the stated objective?"             │
│   - Detect scope creep                                                       │
│   - Verify alignment with original request                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ CHECK 5: OPEN HORIZONS?                                                      │
│   "Does this maintain long-term flexibility and alignment?"                  │
│   - Avoid painting into corners                                              │
│   - Consider future maintainability                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Application Points

| Phase | Apply Checks | Focus |
|-------|--------------|-------|
| **Planning** | All 5 | Verify approach before implementation |
| **Mid-Implementation** | 3, 4 | Sufficient? Fits Goal? (detect drift) |
| **Pre-Completion** | 4, 5 | Fits Goal? Open Horizons? (final validation) |

### Domain Variants

Superego adapts the Five Checks for different contexts:

| Domain | Check Adaptations |
|--------|-------------------|
| **Code** | Standard Five Checks (Necessary?, Beyond Local Maxima?, Sufficient?, Fits Goal?, Open Horizons?) |
| **Learning** | Hands-On?, Verifiable Experience?, Framework vs Facts?, Metis vs Techne?, Scaffolding? |
| **Writing** | Worth the Read?, Beyond First Framing?, Clear Enough?, Fits Goal?, Open Horizons? |

---

## Structured Decision Format

Superego uses a consistent format for all gate evaluations:

### Format Specification

```markdown
GATE: [GATE_NAME]
DECISION: [PASS | BLOCK]
CONFIDENCE: [HIGH | MEDIUM | LOW]
EVIDENCE: [Specific justification citing facts]

[If BLOCK]
RESOLUTION_PATH: [Actionable steps to unblock]
ALTERNATIVE: [Suggested different approach]
```

### Decision Parsing Rules

1. Strip markdown prefixes (#, >, *)
2. Search ALL lines for DECISION keyword
3. Extract CONFIDENCE within 3 lines of DECISION
4. **CRITICAL: Default to BLOCK if parsing fails** (fail-safe)

### Example Outputs

**PASS Example:**
```
GATE: SPEC_FOLDER_VERIFICATION
DECISION: PASS
CONFIDENCE: HIGH
EVIDENCE: User selected Option A (existing folder). Spec folder 077-speckit-upgrade-from-research exists at expected path.
```

**BLOCK Example:**
```
GATE: COMPLETION_VERIFICATION
DECISION: BLOCK
CONFIDENCE: MEDIUM
EVIDENCE: Checklist.md shows 2/5 P0 items incomplete. Browser verification not performed.

RESOLUTION_PATH: Complete remaining P0 items, then run browser test at 1440px viewport.
ALTERNATIVE: Mark task as partial completion, document remaining items for next session.
```

### Confidence Thresholds

| Level | Meaning | Action |
|-------|---------|--------|
| **HIGH** | Strong evidence, verified facts | Proceed normally |
| **MEDIUM** | Partial evidence, reasonable inference | Proceed with caution, note uncertainty |
| **LOW** | Weak evidence, significant unknowns | Require additional verification or escalate |

---

## Complementary Systems Analysis

### Architecture Comparison

```
SUPEREGO (Evaluation/Quality Gates)           SYSTEM-SPEC-KIT (Memory/Context)
├── Gate-based decision flow                  ├── Vector-based semantic search
├── LLM-as-judge evaluation                   ├── SQLite + FTS5 persistence
├── Decision journaling                       ├── 6-tier importance system
├── Five Checks Framework                     ├── Cognitive features (decay, co-activation)
├── Carryover context windows                 ├── Checkpoint/restore
├── Hook-based triggers                       ├── MCP protocol
└── Retrospective visualization               └── Multi-provider embeddings

                    COMPLEMENTARY, NOT COMPETING
```

### Feature Matrix

| Feature | Superego | System-Spec-Kit | Winner |
|---------|----------|-----------------|--------|
| **Metacognitive Evaluation** | Separate LLM judge | Self-evaluation | Superego |
| **Semantic Search** | None | Vector + FTS5 | System-Spec-Kit |
| **Memory Persistence** | Transcripts only | SQLite + files | System-Spec-Kit |
| **Decision Journaling** | Timestamped JSON | None | Superego |
| **Checkpoint/Restore** | None | Full snapshots | System-Spec-Kit |
| **Importance Tiers** | None | 6-tier system | System-Spec-Kit |
| **Attention Decay** | Time windows | Exponential decay | System-Spec-Kit |
| **Structured Decisions** | PASS/BLOCK format | Implicit | Superego |
| **Guardrail Severity** | Hard/Soft/Advisory | Hard/Soft only | Superego |

### Integration Opportunity

The systems can be combined to create a robust framework:
- **Superego patterns** → Governance layer (gates, decisions, audit trail)
- **System-spec-kit** → Persistence layer (memory, search, context preservation)

---

## Applicability Assessment

### Highly Applicable (Adopt)

| Pattern | Reason | Implementation Approach |
|---------|--------|-------------------------|
| **Five Checks Framework** | Provides systematic evaluation criteria already aligned with AGENTS.md principles | Integrate as §5 validation checklist extension |
| **Structured Decision Format** | Creates clear audit trail for gate evaluations | Add to all gate responses in AGENTS.md |
| **Fail-Safe Defaults** | Critical safety pattern - unknown states should BLOCK | Add explicit protocol to §2 gates |
| **Gate-Based Structure** | Already partially implemented, needs refinement | Strengthen sequential enforcement |
| **Decision Journaling** | Enables debugging and pattern analysis | Add decisions/ folder to spec folder structure |
| **Guardrail Severity** | Clarifies which rules can be bypassed | Apply HARD/SOFT/ADVISORY labels to existing gates |

### Partially Applicable (Adapt)

| Pattern | Reason | Adaptation Required |
|---------|--------|---------------------|
| **Carryover Context** | Useful for preventing context explosion | Configure via memory search parameters |
| **Domain Overlays** | Specialization is valuable | Skills system already provides this via SKILL.md |
| **Change Threshold** | Prevents excessive gate evaluations | Set via spec folder level thresholds |

### Not Applicable (Skip)

| Pattern | Reason |
|---------|--------|
| **LLM-as-judge evaluation** | Incompatible with OpenCode architecture (no separate evaluator LLM) |
| **Hook-based triggers** | User doesn't use Claude Code hooks system |
| **Pull mode** | OpenCode needs consistent gate enforcement, not on-demand |
| **LanceDB migration** | SQLite sufficient for current scale (<50K memories) |
| **Retrospective HTML** | Nice-to-have but low priority for current needs |

---

## Implementation Recommendations

### Priority 0: Critical (Immediate)

1. **Add Fail-Safe Protocol to AGENTS.md §2**
   ```markdown
   ## FAIL-SAFE PROTOCOL
   If unable to determine rule compliance:
   - Tier 0 gates: Default to BLOCK, require explicit confirmation
   - Tier 1 gates: Default to BLOCK, suggest resolution path
   - Tier 2+ gates: Default to ALLOW with caution note

   If rules conflict: Lower tier number ALWAYS wins
   ```

2. **Apply Five Checks to §5 Validation Checklist**
   - Add checks at Planning, Mid-Implementation, and Pre-Completion phases
   - Make explicit in PRE-CHANGE VALIDATION section

3. **Add Structured Decision Format to Gate Responses**
   - DECISION: PASS | BLOCK
   - CONFIDENCE: HIGH | MEDIUM | LOW
   - EVIDENCE: [specific justification]
   - RESOLUTION_PATH: [if BLOCK]

### Priority 1: High (Next Sprint)

4. **Implement Decision Journaling**
   - Add `decisions/` folder to spec folder structure
   - Format: `YYYY-MM-DD-HH-mm-gate_name.json`
   - Include: timestamp, gate, decision, confidence, evidence

5. **Apply Guardrail Severity Labels**
   - HARD: Spec folder verification, confidence <40%
   - SOFT: Memory context loading, skill routing
   - ADVISORY: Code quality suggestions

6. **Add Completion Gate**
   - Explicit verification before "done" claims
   - Checklist.md verification with evidence
   - Memory save prompt if session ending

### Priority 2: Medium (Future)

7. **Configure Carryover Context**
   - decision_count: 5 recent decisions
   - window_minutes: 30 minute scope
   - max_tokens: 2000 bound

8. **Enhance Domain Specialization**
   - Leverage existing skills system
   - Add Five Checks variants per skill domain

---

## References

### Superego Repository Files Analyzed

| File | Purpose |
|------|---------|
| `src/evaluate.rs` | Core evaluation pipeline with Five Checks |
| `src/decision.rs` | Decision journaling implementation |
| `src/state.rs` | State management and carryover |
| `src/config.rs` | Carryover configuration |
| `src/feedback.rs` | Feedback queue and formatting |
| `src/prompts/code.md` | Code domain evaluation overlay |
| `src/prompts/learning.md` | Learning domain evaluation overlay |
| `src/prompts/writing.md` | Writing domain evaluation overlay |
| `plugin/hooks/hooks.json` | Hook definitions and triggers |
| `opencode-plugin/src/index.ts` | OpenCode integration patterns |

### Related System-Spec-Kit Files

| File | Purpose |
|------|---------|
| `AGENTS.md` | Gate framework (target for integration) |
| `context-server.js` | MCP server implementation |
| `importance-tiers.js` | 6-tier importance system |
| `memory_system.md` | Memory architecture documentation |

### Cross-References

- **Original Research**: `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/superego-synthesis.md`
- **Hooks Synthesis**: `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/hooks-synthesis.md`
- **Empirica Synthesis**: `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/empirica-synthesis.md`
- **Smart-Ralph Synthesis**: `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/077-speckit-upgrade-from-research/research/smart-ralph-synthesis.md`

---

*Synthesis created: 2026-01-22*
*Source: 20 parallel Opus 4.5 agents analyzing 30+ source files*
*Confidence: HIGH based on 130+ patterns identified*
