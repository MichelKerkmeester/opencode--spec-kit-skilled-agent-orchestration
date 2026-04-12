---
title: "010-passive-capture-investigation: Investigate Passive Capture"
description: "Evaluates whether Engram-style passive capture or close-session helpers can fit Public without creating a second save authority."
---

# 010-passive-capture-investigation: Investigate Passive Capture

## 1. Scope
This sub-phase investigates whether Engram-style passive capture or close-session helpers belong in Public at all, and if so, whether they can exist only as thin wrappers over the current JSON-primary save workflow. It defines the research question, baseline measurements, and authority checks needed before any adopt/prototype/reject decision. It does not ship a new save surface.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-022.md:27-30`
- `001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-038.md:31-35`
- `001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-040.md:311-311`

## 3. Architecture Constraints
- `generate-context.js` remains the save authority; any helper must emit structured JSON into the existing workflow or stop at a dry-run plan.
- Governed ingest, provenance, retention, and dedupe checks remain mandatory through existing save and governance paths.
- No background write, hidden autosave, or passive-enrichment durability change is allowed during this investigation.

## 4. Investigation Questions
- Should a future helper emit JSON for `generate-context.js`, call `memory_save` directly through governed paths, or explicitly support both modes?
- What provenance, retention, and duplicate-detection fields are mandatory if capture starts from looser session text rather than a hand-authored packet summary?
- Which trigger shapes are even eligible: explicit close-session, compaction checkpoint, or a shadow-only passive suggestion flow?
- What measurable pass bars would make the helper safe enough to advance: save success rate, duplicate rate, operator review burden, and recovery quality after compaction?

## 5. Success Criteria
- The packet defines one bounded experiment design for close-session capture and one for shadow passive capture.
- The packet names the exact authority-preserving handoff into `generate-context.js` and current save/governance code.
- The packet ends with a clear exit condition: adopt a thin explicit helper, prototype a shadow-only wrapper, or reject the idea for current Public workflows.

## 6. Out of Scope
- Shipping a passive capture daemon, blocking stop hook, or background persistence job.
- Modifying save authority, retention rules, or governed scope enforcement.
- Importing Engram's lifecycle model as a new backend.
