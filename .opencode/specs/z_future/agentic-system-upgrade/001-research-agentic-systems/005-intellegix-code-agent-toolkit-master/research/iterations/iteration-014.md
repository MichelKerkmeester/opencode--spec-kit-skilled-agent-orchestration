# Iteration 014 — Gate Profiles For Bound Work

Date: 2026-04-10

## Research question
Is the current Gate 1/2/3 conversation choreography over-engineered for already-bound continuation work, and does the external repo's sentinel-and-hook pattern suggest a better user experience for those cases?

## Hypothesis
Yes. The current gate system is valuable, but it behaves like a universal conversational protocol even when the task has already satisfied the risky setup questions. The external repo suggests that some of that protection can move into runtime mode and sentinel enforcement.

## Method
I compared the local gate system in `AGENTS.md` and constitutional files with the external orchestrator's activation sentinel and path guard. I focused on how each system handles ongoing work after initial setup is already known.

## Evidence
- `[SOURCE: AGENTS.md:165-186]` The local pre-execution gate system requires context surfacing, skill routing, and a hard spec-folder gate for file-modifying work.
- `[SOURCE: AGENTS.md:198-209]` The post-execution rules also impose a specific memory-save workflow once that path is triggered.
- `[SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:62-69]` Constitutional guidance reinforces Gate 3 as a universal hard override.
- `[SOURCE: external/commands/orchestrator.md:36-43]` The external orchestrator uses an explicit activation mode that persists until turned off.
- `[SOURCE: external/commands/orchestrator.md:83-97]` Activation writes a sentinel file describing the active project and orchestrator context.
- `[SOURCE: external/hooks/orchestrator-guard.py:56-83]` The guard reads that sentinel and silently does nothing when the mode is inactive.
- `[SOURCE: external/hooks/orchestrator-guard.py:130-175]` Path policy is then enforced based on the active mode rather than by re-asking the user every turn.
- `[SOURCE: external/hooks/orchestrator-guard.py:223-250]` Violations are blocked at tool-use time with explicit reasons.

## Analysis
The local gate system solves a real problem: agents should not start editing unknown scopes without context. But Phase 2 highlights the UX downside more sharply because this task began with a pre-bound packet declaration. Once the user has already provided a bounded phase path and a concrete mode, the remaining universal gate choreography is more ceremony than protection. The external repo's sentinel pattern shows a cleaner separation: activation decides the operating mode, then runtime checks enforce the boundary with low user friction.

The right lesson is not to drop the gates. It is to classify them. New work and ambiguous scope should stay fully conversational. Bound continuation work, packet-local leaf work, and read-only review work should have gate profiles that mark certain gates as pre-satisfied or auto-derived from mode. Runtime sentinels and capability checks can then carry more of the safety burden.

## Conclusion
confidence: high

finding: `system-spec-kit` should pivot from one universal conversational gate sequence to a small set of operating profiles, including a packet-bound continuation profile where scope, routing, and some save behavior are pre-resolved.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `AGENTS.md`, `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md`, `.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define the allowed operating profiles and which gates become implicit in each
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** A universal conversational gate sequence mediates most work, even when task scope and packet binding are already explicit.
- **External repo's approach:** An activation sentinel establishes the operating mode, and a runtime hook enforces the resulting boundary at tool-use time.
- **Why the external approach might be better:** It keeps protection high while reducing repetitive setup friction for already-bound work.
- **Why system-spec-kit's approach might still be correct:** Conversational gates are runtime-agnostic and work even when no hook system exists.
- **Verdict:** PIVOT
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Define profiles such as `new-work`, `bound-continuation`, and `read-only-review`; let the profile determine which gates are explicit, implicit, or enforced by runtime sentinels.
- **Blast radius of the change:** medium
- **Migration path:** Start with documentation and policy files only, then add optional runtime sentinel support where available without making hooks mandatory.

## Counter-evidence sought
I looked for existing local guidance that already formalizes profile-based gate shortcuts. I found session persistence for Gate 3, but not a broader profile model for continuation work.

## Follow-up questions for next iteration
- Which gates can safely become implicit for packet-bound continuation without eroding safety?
- Should runtime profiles live in command YAML, constitutional policy, or a dedicated machine-readable manifest?
- Does the orchestrator architecture need to change for profile-based gateing to be maintainable?
