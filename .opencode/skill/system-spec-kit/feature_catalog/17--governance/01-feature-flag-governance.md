---
title: "Feature flag governance"
description: "Feature flag governance defines operational targets for keeping the active flag surface small with explicit sunset windows and periodic audits."
---

# Feature flag governance

## 1. OVERVIEW

Feature flag governance defines operational targets for keeping the active flag surface small with explicit sunset windows and periodic audits.

Feature flags let you turn new features on or off without changing the code itself, like light switches for functionality. This governance process tracks which switches exist, who controls them and when old ones should be retired so the collection does not grow out of control.

---

## 2. CURRENT REALITY

The program introduces many scoring signals, rollout switches and roadmap capabilities. Without governance, flags accumulate until nobody knows what is enabled.

A governance framework still defines process targets such as keeping the active flag surface small, setting sunset windows and running periodic audits. Those targets are not hard caps enforced in runtime code.

Live runtime governance does exist. `isFeatureEnabled()` implements default-on, explicit-opt-out semantics: a flag stays enabled unless it is explicitly set to `false` or `0`. Global rollout percentage is read from `SPECKIT_ROLLOUT_PERCENT`, and partial rollout is fail-closed when no identity is provided, so a missing identity does not silently bypass gating.

Memory roadmap defaults are also governed in code. Missing or invalid roadmap phase values resolve to `shared-rollout`, while dormant capabilities remain intentionally default-off where required. In particular, adaptive ranking and shared memory both stay off unless explicitly enabled, even though most graduated roadmap capabilities inherit the default-on rollout helper.

The B8 signal ceiling ("12 active scoring signals") is a governance target, not a runtime-enforced guardrail.

**Cross-reference**: See `16--tooling-and-scripts/18-template-compliance-contract-enforcement.md` for the 3-layer template compliance architecture (agent contracts + post-write validation + runtime schema enforcement).

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts` - Canonical runtime flag helper and rollout-percentage enforcement, including default-on/explicit-opt-out semantics and fail-closed identity handling for partial rollout.
- `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts` - Memory roadmap phase and capability governance, including `shared-rollout` fallback and intentionally default-off dormant capabilities such as adaptive ranking and shared memory.

---

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Feature flag governance
- Current reality source: `mcp_server/lib/cognitive/rollout-policy.ts`, `mcp_server/lib/config/capability-flags.ts`
