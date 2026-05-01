---
title: "0 [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/011-tool-profile-split-investigation/spec]"
description: "Evaluates whether Engram-style agent/admin tool bundles belong in Public only as a delivery-layer experiment."
trigger_phrases:
  - "spec"
  - "011"
  - "tool"
importance_tier: "important"
contextType: "implementation"
---
# 011-tool-profile-split-investigation: Investigate Tool Profile Splits

## 1. Scope
This sub-phase investigates whether Public should experiment with Engram-style tool-profile packaging similar to `ProfileAgent` and `ProfileAdmin`, but only as a delivery-layer teaching aid. It studies token savings, operator clarity, and failure modes without changing tool registration or ownership. It does not reduce the current tool surface or ship a new authority lane.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-022.md:7-13`
- `001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-029.md:7-11`
- `001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-040.md:311-311`

## 3. Architecture Constraints
- Tool profiles, if any, must stay presentation-only over existing MCP surfaces.
- `tool-schemas.ts` and dispatcher ownership do not change during this investigation.
- Recovery, diagnostics, and save authority remain discoverable through existing startup and workflow surfaces.

## 4. Investigation Questions
- Should profile bundling exist only inside startup/bootstrap guidance, or is there a case for a lightweight operator-selected profile in docs or UX layers?
- Which grouping actually helps: default versus recovery, operator versus maintenance, or no split at all?
- What token savings or confusion reduction must a profile experiment show to justify follow-on work?
- How do we prevent profile packaging from hiding critical tools or implying narrower authorities than Public really has?

## 5. Success Criteria
- The packet defines at least one measurement plan for startup-token reduction and one for operator task success or misrouting.
- The packet points to the exact presentation layers that would host the experiment.
- The packet ends with a decision gate: adopt a delivery-layer action card, prototype a profile selector, or reject profile splitting entirely.

## 6. Out of Scope
- Changing tool registration, permissions, or runtime authority boundaries.
- Creating separate agent-only and admin-only backends.
- Removing tools from the current Public surface.
