# Iteration 023 — Simplify The Markdown Plus YAML Command Stack

Date: 2026-04-10

## Research question
Does the external repo suggest that `system-spec-kit`'s command UX is over-ceremonial because the operator-visible markdown commands and the hidden YAML assets repeat too much of the same lifecycle story?

## Hypothesis
Yes. The internal command stack likely exposes too much framework scaffolding for work that could be expressed through one thinner front controller plus smaller reusable workflow modules.

## Method
I compared the external repo's one workflow definition and compact README framing against the internal command markdown files, their ownership statements, and the volume of setup duplication before actual work begins.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:1-24] The external repo keeps the public workflow framing and the executable loop tightly aligned in one compact definition.
- [SOURCE: .opencode/command/spec_kit/plan.md:7-21] `/spec_kit:plan` explicitly says markdown owns setup while YAML owns execution.
- [SOURCE: .opencode/command/spec_kit/plan.md:37-138] The same file then embeds a long first-message protocol and setup pseudo-workflow before the actual planning lifecycle description.
- [SOURCE: .opencode/command/spec_kit/implement.md:7-18] `/spec_kit:implement` repeats the same markdown-versus-YAML ownership pattern.
- [SOURCE: .opencode/command/spec_kit/implement.md:35-120] It then repeats another large setup block with near-identical execution-mode and dispatch handling.
- [SOURCE: .opencode/command/spec_kit/complete.md:7-21] `/spec_kit:complete` repeats the same execution preamble again.
- [SOURCE: .opencode/README.md:52-60] The repo currently exposes 21 commands and 29 YAML assets, which means the command system itself has become a product surface.

## Analysis
The current system is internally disciplined, but externally heavy. Operators see multiple markdown entrypoints that mostly instruct the runtime how to load YAML, gather setup values, and enforce command-local guardrails. That machinery may be justified for framework authors, yet it creates a lot of repeated UX scaffolding for everyday use. The external repo points toward a leaner design principle: keep the visible operator story short, keep the executable workflow cohesive, and avoid repeating the same setup doctrine in each entry surface.

## Conclusion
confidence: high
finding: `system-spec-kit` should simplify its command stack by shrinking operator-visible markdown ceremony and centralizing shared setup logic instead of restating it in each command surface.

## Adoption recommendation for system-spec-kit
- **Target file or module:** command entry architecture and shared setup/routing logic
- **Change type:** surface simplification
- **Blast radius:** medium
- **Prerequisites:** identify which setup responsibilities can be centralized without weakening gate enforcement
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** each command restates setup rules, YAML ownership, and first-message behavior before pointing at workflow assets.
- **External repo's approach:** one workflow and a small README explain the system without repeated setup scaffolding.
- **Why the external approach might be better:** it reduces duplication, lowers onboarding cost, and makes the command surface easier to maintain.
- **Why system-spec-kit's approach might still be correct:** internal clarity between markdown and YAML ownership does prevent hidden behavior.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** create one shared setup/routing layer and reduce command markdown files to intent-specific deltas plus concise operator guidance.
- **Blast radius of the change:** command docs, YAML asset organization, and wrapper command contracts.
- **Migration path:** extract common setup fragments first, then collapse repetitive ownership prose and pseudo-workflows after behavior parity is verified.

## UX / System Design Analysis

- **Current system-spec-kit surface:** commands expose large setup scripts, ownership disclaimers, and repeated pseudo-protocols before the user reaches the real workflow.
- **External repo's equivalent surface:** one compact workflow plus concise documentation.
- **Friction comparison:** internal commands are more explicit, but they make users and maintainers read the framework before using the feature; the external repo reaches the task faster.
- **What system-spec-kit could DELETE to improve UX:** repeated per-command setup doctrine and repeated markdown-versus-YAML ownership blocks.
- **What system-spec-kit should ADD for better UX:** a shared setup controller or generated command scaffold that keeps only command-specific deltas visible.
- **Net recommendation:** SIMPLIFY

## Counter-evidence sought
I looked for command-specific setup logic that would justify this much repetition. There are differences in flags and later steps, but the execution-mode, first-message, and setup-language scaffolding repeats heavily.

## Follow-up questions for next iteration
- Could a single shared setup module own execution mode, dispatch, and spec selection?
- Which YAML assets are true workflow variants versus legacy duplication?
- Should command markdown become shorter wrappers over a unified controller?
