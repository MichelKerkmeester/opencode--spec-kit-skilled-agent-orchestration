# Iteration 010 — Docs-Versus-Code Verification Discipline

Date: 2026-04-09

## Research question
What process change should `system-spec-kit` adopt so deep-research packets reliably surface docs-vs-code mismatches like Xethryon's retrieval claims?

## Hypothesis
The missing piece is not another search tool; it is a required "claim status" field in the research workflow so analysts must mark each major external claim as verified, contradicted, or unresolved.

## Method
I revisited the strongest docs-vs-code mismatch from earlier iterations, then compared it with the current Spec Kit deep-research workflow and agent contract.

## Evidence
- Xethryon's README claims "LLM-ranked retrieval (not keyword matching)." [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:11-18]
- The actual runtime path does not pass an LLM callback into the recall engine, so the live prompt-injection path is keyword/recency-based unless an alternate caller wires `llmCall`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1564-1585] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/findRelevantMemories.ts:119-171]
- XETHRYON_CONTEXT itself hints that memory wiring may need verification, which shows the repo's own documentation already recognized possible drift. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:209-209]
- Spec Kit's deep-research workflow requires externalized state and iteration artifacts, but it does not define a required field for "claim verified / contradicted / unresolved" at either iteration or synthesis time. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:20-23] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:79-89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:218-239]
- The `@deep-research` agent requires source citations and source diversity, but again stops short of forcing a claim-status ledger for externally advertised behaviors. [SOURCE: .opencode/agent/deep-research.md:113-120] [SOURCE: .opencode/agent/deep-research.md:167-199]

## Analysis
The Xethryon case shows a specific failure mode in research: even a careful analyst can quote the README, collect sources, and still leave the highest-risk question implicit unless the workflow forces a verdict on each material claim. Spec Kit already has the structural pieces needed to fix this: externalized state, iteration artifacts, synthesis, and dashboards. The missing piece is schema pressure. If the workflow requires each key external claim to be marked `verified`, `contradicted`, or `unresolved`, then docs-vs-code drift becomes a first-class output instead of an accidental insight.

## Conclusion
confidence: high

finding: the highest-value lesson from Xethryon is procedural: deep-research should force claim-status tracking for externally advertised behaviors. This is a workflow-quality improvement that will keep future research packets from accepting README language at face value.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/deep-research.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** extend the YAML/iteration schema so the agent has a stable place to record claim-status decisions
- **Priority:** must-have

## Counter-evidence sought
I looked for an existing mandatory claim-verification section in the current deep-research iteration or synthesis contract. I found citation rules and reflection fields, but no explicit verified/contradicted/unresolved ledger.

## Follow-up questions for next iteration
- none; this iteration closes the main workflow-quality question set for phase 009
