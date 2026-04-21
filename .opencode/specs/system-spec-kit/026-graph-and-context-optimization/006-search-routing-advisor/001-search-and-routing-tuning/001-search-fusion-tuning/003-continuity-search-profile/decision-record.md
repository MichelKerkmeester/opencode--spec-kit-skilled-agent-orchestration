---
title: "Add Continuity Search Intent Profile - Decision Record"
status: planned
---
# Decision Record
## ADR-001: Keep Continuity as an Internal Adaptive-Fusion Profile
**Context:** `../research/research.md:135-159` shows continuity can be added safely through `shared/algorithms/adaptive-fusion.ts` because the fusion seam is string-typed, while `../research/research.md:148-159,262-270` warns that making continuity a public intent would expand the blast radius into classifiers, routers, schemas, and tests.
**Decision:** Add `continuity` only to the adaptive-fusion/internal-caller seam and defer any public-intent expansion to a separate follow-on.
**Rationale:** This captures the retrieval benefit with the smallest safe code surface and avoids mixing an internal weighting change with a public API redesign.
**Consequences:** The profile must be wired by explicit internal callers, supporting K-sweep coverage should stay on the string-typed harness, and a later product-level decision is still required before continuity becomes a first-class public intent.
