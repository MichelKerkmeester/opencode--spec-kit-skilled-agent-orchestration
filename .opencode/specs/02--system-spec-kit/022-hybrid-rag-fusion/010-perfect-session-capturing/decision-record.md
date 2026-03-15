# Decision Record: Perfect Session Capturing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## Context

The five-backend native capture matrix was already implemented, but real validation exposed a portability gap: different CLIs persist the same workspace as different absolute paths. At the same time, stateless validation and manual docs were still carrying assumptions that no longer matched live behavior.

---

<!-- ANCHOR:dr1 -->
## DR-001: Keep JSON-Mode Authoritative

**Decision:** JSON-mode input remains the only authoritative stateful input source. Every native CLI backend remains stateless-only.

**Why:** Explicit JSON still carries the clearest save intent and the richest schema. Native capture exists to support stateless operation, not to replace structured input.

**Consequences:** Loader behavior still short-circuits on explicit data-file input, and every native backend continues through the shared stateless path.
<!-- /ANCHOR:dr1 -->

---

<!-- ANCHOR:dr2 -->
## DR-002: Keep One Ordered Native Fallback Matrix

**Decision:** The native fallback order remains `OpenCode -> Claude -> Codex -> Copilot -> Gemini -> NO_DATA_AVAILABLE`.

**Why:** Discovery precedence was not the problem. The problem was path identity drift and stateless validation drift after discovery.

**Consequences:** Loader behavior remains deterministic, testable, and familiar while matcher correctness improves underneath it.
<!-- /ANCHOR:dr2 -->

---

<!-- ANCHOR:dr3 -->
## DR-003: Make Repo-Local `.opencode` The Canonical Workspace Identity

**Decision:** Native matching now resolves the active workspace through the nearest repo-local `.opencode` directory. Repo root, `.opencode`, and git-root forms are compatibility inputs, not primary identities.

**Why:** Different CLIs store the same workspace using different absolute path spellings. Matching raw strings caused false negatives even when the backend artifact belonged to the current project.

**Consequences:** One shared identity helper now mediates native matcher acceptance. Equivalent paths are accepted only if they resolve to the same `.opencode` anchor.
<!-- /ANCHOR:dr3 -->

---

<!-- ANCHOR:dr4 -->
## DR-004: Keep Reasoning Hidden But Preserve Useful Tool Telemetry

**Decision:** Claude `thinking`, Codex reasoning items, and Gemini `thoughts` stay excluded from normalized output, while useful tool metadata remains.

**Why:** Internal reasoning is not durable project knowledge, but tool telemetry is often the only stateless evidence that real implementation or inspection work occurred.

**Consequences:** Native capture still preserves prompts, assistant responses, tool calls, and workspace-scoped file hints while excluding high-noise internal reasoning surfaces.
<!-- /ANCHOR:dr4 -->

---

<!-- ANCHOR:dr5 -->
## DR-005: Recover Stateless `TOOL_COUNT` From Real Tool Evidence

**Decision:** The workflow recovers stateless `TOOL_COUNT` from actual native tool-call evidence instead of only using `FILES.length`.

**Why:** Read/search/bash-heavy sessions can be valid and useful even when they do not edit files. Treating `FILES.length` as the only rescue path caused false `V7` failures.

**Consequences:** Tool-rich captures without edited files can render with non-zero `tool_count`, while low-signal captures still face the normal quality gate.
<!-- /ANCHOR:dr5 -->

---

<!-- ANCHOR:dr6 -->
## DR-006: Prefer Safe Prompt Fallback Over Wholesale Prompt Reintroduction

**Decision:** When relevance filtering finds no keyword hit, the transform may keep generic/current-spec prompt content, but it does not re-include obviously foreign-spec prompt text.

**Why:** The earlier “fall back to all prompts” behavior preserved timeline continuity, but it also reintroduced foreign-spec content and could trip `V8`.

**Consequences:** Generic prompts can still survive when safe, but foreign-spec prompt fallback is dropped rather than trusted.
<!-- /ANCHOR:dr6 -->

---

## Consequences

- The stateless loader now supports the full native matrix with portable workspace matching.
- Discovery precedence remains unchanged, but path equivalence is no longer fragile.
- Valid tool-rich stateless captures survive `V7` without weakening contamination safety.
- Canonical docs now separate discovery success from later quality/alignment aborts.
