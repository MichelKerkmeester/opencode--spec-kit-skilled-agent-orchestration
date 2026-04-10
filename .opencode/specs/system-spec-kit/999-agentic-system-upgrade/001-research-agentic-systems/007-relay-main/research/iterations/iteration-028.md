# Iteration 028 — Redesign the Operator Contract

Date: 2026-04-10

## Research question
Has the overall operator contract become too heavy, with overlapping gates, duplicated master docs, and hook/fallback machinery that is harder to teach than to operate?

## Hypothesis
Public's safety machinery is individually rational, but the operator-facing contract has grown too large and internally inconsistent to remain a clean front door.

## Method
Compared `AGENTS.md`, `CLAUDE.md`, constitutional gate notes, and hook-system docs with Relay's slimmer plugin and workflow guidance, looking for duplicated rules, contradictions, and exposed internal machinery.

## Evidence
- `AGENTS.md` is 378 lines and `CLAUDE.md` is 350 lines in this checkout. [INFERENCE: filesystem line counts for `AGENTS.md` and `CLAUDE.md` gathered during this iteration]
- Both documents repeat the Gate 1/2/3 framework, skills system, agent routing, and workflow quick references. [SOURCE: AGENTS.md:159-224] [SOURCE: AGENTS.md:321-378] [SOURCE: CLAUDE.md:107-170] [SOURCE: CLAUDE.md:293-350]
- They also disagree on a meaningful behavior: `AGENTS.md` says Gate 3 persists for the entire session, while `CLAUDE.md` says Gate 3 must be re-evaluated at phase boundaries. [SOURCE: AGENTS.md:181-187] [SOURCE: CLAUDE.md:129-150]
- Constitutional gate notes still point back to the full gate definitions in `AGENTS.md`, creating a multi-document contract stack. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:51-68]
- The hook system adds `PreCompact`, `SessionStart`, and `Stop` lifecycle hooks plus a separate tool-based fallback path via `session_bootstrap()` and `session_resume()`. [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:3-16] [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:48-54]
- Relay's plugin docs fit the operator contract into one short page: install, three slash commands, natural language, tools, and how it works. [SOURCE: external/docs/plugin-claude-code.md:1-87]
- Relay's workflow docs do expose deeper capability, but the quick start still starts from one runner and one builder instead of a gate stack. [SOURCE: external/packages/sdk/src/workflows/README.md:1-27]

## Analysis
This is no longer just a "too many docs" issue. Public's operator contract is split across multiple authoritative-seeming surfaces and exposes internal recovery and routing machinery as part of the normal teaching path. That makes the system harder to trust because users cannot easily tell which document is the true front door. Relay shows that a smaller, mode-first contract can coexist with deeper implementation machinery.

## Conclusion
confidence: high
finding: Public needs a top-level operator-contract redesign: one authoritative front-door document, fewer explicitly taught gates, and thinner exposure of hooks, constitutional notes, and routing internals.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `AGENTS.md`, `CLAUDE.md`, constitutional gate docs, hook onboarding docs, top-level command help
- **Change type:** operator-surface redesign
- **Blast radius:** very high
- **Prerequisites:** choose the single source of truth, settle Gate 3 persistence semantics, and move low-level machinery into maintainer-only references
- **Priority:** must-have (prototype later)

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators can encounter two long master docs, constitutional gate notes, hook references, and multiple fallback paths before even reaching the work.
- **External repo's equivalent surface:** Relay leads with one short plugin doc or one workflow quick start, while deeper internals stay optional.
- **Friction comparison:** Public offers stronger governance but much higher teaching cost and more room for doc drift. Relay requires less interpretation because its first-touch contract is smaller and more coherent.
- **What system-spec-kit could DELETE to improve UX:** Delete duplicated master-doctrine surfaces and stop teaching hooks and constitutional notes as first-touch operator knowledge.
- **What system-spec-kit should ADD for better UX:** Add one authoritative operator contract that links outward to deeper maintainer references only when needed.
- **Net recommendation:** REDESIGN

## Counter-evidence sought
Looked for a single clearly dominant Public front-door doc that already resolves these overlaps; the current stack still appears split across `AGENTS.md`, `CLAUDE.md`, constitutional notes, and hook references.

## Follow-up questions for next iteration
- Which content belongs in the operator front door versus maintainer appendices?
- Should constitutional memories remain machine-facing only?
- Can hook behavior be documented as invisible reliability infrastructure instead of workflow doctrine?
