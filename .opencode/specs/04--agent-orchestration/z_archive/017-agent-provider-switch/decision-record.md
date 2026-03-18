---
title: "Decision Record: Spec 017 - Agent Provider Switching [017-agent-provider-switch/decision-record]"
description: "Status: Accepted"
trigger_phrases:
  - "decision"
  - "record"
  - "spec"
  - "017"
  - "agent"
  - "decision record"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Spec 017 - Agent Provider Switching

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep `.opencode/agent/*.md` as the Primary Runtime Path

**Status:** Accepted  
**Date:** 2026-02-16

### Context
All orchestration and command references already target `.opencode/agent/*.md`. Refactoring references across commands, skills, and docs would be high risk and would create broad churn for a provider concern.

### Decision
Preserve `.opencode/agent/*.md` as the only active runtime path. Provider differences are handled by switching source profiles into this path.

### Alternatives Considered

| Alternative | Pros | Cons |
|------------|------|------|
| Keep primary runtime path (chosen) | Zero reference churn, lower risk | Requires profile activation mechanism |
| Refactor references to provider paths | Explicit provider pathing | Large blast radius, fragile migration |
| Dynamic runtime resolver in every command | Flexible | Significant complexity and maintenance overhead |

### Consequences
- Existing references remain stable
- Provider switch logic moves into one scriptable control point
- Verification can focus on one runtime location
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Use Profile Folders Named `copilot` and `chatgpt`

**Status:** Accepted  
**Date:** 2026-02-16

### Context
The non-OpenAI profile previously discussed as "claude" maps operationally to GitHub Copilot model identifiers in this repo. Naming should match operator mental model and avoid platform/provider ambiguity.

### Decision
Use `.opencode/agent/copilot/` and `.opencode/agent/chatgpt/` as profile source directories.

### Alternatives Considered

| Alternative | Pros | Cons |
|------------|------|------|
| `copilot` + `chatgpt` (chosen) | Matches operator intent and actual usage | Slightly less model-vendor explicit |
| `claude` + `openai` | Vendor explicit | Misaligned with Copilot runtime usage |
| `profile-a` + `profile-b` | Neutral naming | Opaque to operators |

### Consequences
- Clear operator commands: activate `copilot` or `chatgpt`
- Lower support burden from naming confusion
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Activation Uses Copy + Verify + Rollback (Not Symlinks)

**Status:** Accepted  
**Date:** 2026-02-16

### Context
We need deterministic behavior across environments and tooling. Symlinks can behave differently across shells/tools and may introduce edge-case failures in editors or automation.

### Decision
Implement activation by copying selected profile files into `.opencode/agent/*.md`, then verifying expected frontmatter. On failure, restore backup.

### Alternatives Considered

| Alternative | Pros | Cons |
|------------|------|------|
| Copy + verify + rollback (chosen) | Deterministic, explicit, easier troubleshooting | More I/O than symlink swap |
| Symlink runtime files to profile files | Fast switch, minimal copy | Symlink portability/tooling issues |
| Runtime merge on each command execution | Flexible | Complexity and performance overhead |

### Consequences
- Predictable runtime state after every activation
- Recovery path for partial failures
- Slightly slower but operationally safer switching
<!-- /ANCHOR:adr-003 -->
