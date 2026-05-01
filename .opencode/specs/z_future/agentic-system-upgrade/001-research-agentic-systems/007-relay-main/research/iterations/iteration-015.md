# Iteration 015 — Scenario-First Validation

Date: 2026-04-10

## Research question
Is `system-spec-kit`'s validation pipeline too rule-heavy, and does Relay suggest a better balance where scenario and integration contracts lead while rule validators support?

## Hypothesis
Relay's strongest validation signal comes from runnable scenarios and CLI/integration behavior, while Public leans more heavily on layered static and post-render rule enforcement.

## Method
Read Relay's CLI spawn tests, workflow template integration tests, command bootstrap tests, and configuration defaults; then compared them with Public's spec validator, memory quality rules, and post-save review system.

## Evidence
- Relay verifies real behavior end to end: spawn real CLIs, deliver messages, observe queued -> injected -> ack -> verified, and release cleanly. [SOURCE: external/tests/integration/broker/cli-spawn.test.ts:1-20] [SOURCE: external/tests/integration/broker/cli-spawn.test.ts:38-87] [SOURCE: external/tests/integration/broker/cli-spawn.test.ts:271-333]
- Relay also validates workflow patterns through integration tests that exercise review-loop agents, reviewer-to-reviewer messages, parallel spawn, channel broadcast, and sequential execution. [SOURCE: external/tests/integration/broker/workflow-templates.test.ts:1-18] [SOURCE: external/tests/integration/broker/workflow-templates.test.ts:41-104] [SOURCE: external/tests/integration/broker/workflow-templates.test.ts:316-447]
- Even basic CLI ergonomics are protected by executable tests that assert program name, registered commands, and leaf command counts. [SOURCE: external/src/cli/bootstrap.test.ts:68-125]
- Public's spec validator is a rule orchestrator with strict mode, rule ordering, level inference, recursive validation, and file/placeholder/anchor policies. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:7-18] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:31-39] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100] [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:138-159]
- Public's memory save path adds 14 quality rules covering placeholder leakage, malformed routing, contamination, title quality, topical coherence, YAML integrity, and more. [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:23-45] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:45-172] [SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:882-1004]
- Post-save review then performs another rendered-markdown drift pass with additional guardrail telemetry and issue classification. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:8-24] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:33-78]

## Analysis
Public's rules are not useless; they catch real contamination and contract drift. The issue is balance. Relay's tests show a strong bias toward validating what users actually experience: does the CLI register, does the workflow resume, do messages deliver, does the channel pattern work. Public frequently starts from validators and quality gates, then only sometimes checks the lived workflow. That can drift toward validating the machinery more than the operator outcome.

## Conclusion
confidence: high
finding: Public should rebalance its validation architecture around scenario-first contracts. Keep the current rules, but demote them to support a smaller set of operator-visible, end-to-end validation stories.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, memory-quality pipeline, deep-loop verification contracts, command validation strategy
- **Change type:** validation architecture refactor
- **Blast radius:** architectural
- **Prerequisites:** define the primary end-to-end scenarios that prove a packet, memory save, and deep loop are actually healthy
- **Priority:** must-have (prototype later)

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Validation is rule-rich and layered: spec rules, memory rules, post-save review, and multiple hard/soft gates.
- **External repo's approach:** Validation is anchored in executable behavior: command registration, workflow runs, delivery pipelines, and cross-agent coordination scenarios.
- **Why the external approach might be better:** It keeps validation tied to lived operator outcomes and reduces the risk of passing every static rule while still delivering a clumsy or broken workflow.
- **Why system-spec-kit's approach might still be correct:** Public handles documentation governance and semantic memory quality, where static contract validation is legitimately important.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Define a small canonical scenario suite per subsystem, run those first, and position rule validators as supporting diagnostics that explain failures rather than the primary proof of health.
- **Blast radius of the change:** architectural
- **Migration path:** Start by adding scenario-based smoke validations beside current validators, then prune or demote redundant rules once scenario coverage becomes trustworthy.

## Counter-evidence sought
Looked for evidence that Relay lacks rule-level validation altogether; it still has config/default checks, but the reviewed material centered much more on executable workflow and transport behavior than on dense rule catalogs.

## Follow-up questions for next iteration
- Which current rules are actually proxying for scenarios that could be tested directly?
- Which validators would remain essential even after scenario-first coverage exists?
- How should packet validation report scenario failures versus static warnings?
