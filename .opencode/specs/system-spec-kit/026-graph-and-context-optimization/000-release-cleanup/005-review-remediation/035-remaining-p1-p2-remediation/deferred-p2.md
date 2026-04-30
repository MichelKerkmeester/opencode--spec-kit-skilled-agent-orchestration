---
title: "Deferred P2 Items: 048 Remaining Remediation"
description: "P2 findings deferred because they require a design call, larger code changes, normal-shell evidence, or protected config edits."
trigger_phrases:
  - "035-remaining-p1-p2-remediation"
  - "deferred P2"
  - "P2 backlog"
importance_tier: "important"
contextType: "deferred"
---
# Deferred P2 Items: 048 Remaining Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: custom-extension | v2.2 -->

---

## Deferred Items

| Finding | Source | Reason |
|---------|--------|--------|
| 045/002-P2-1 | Memory BM25 derived-index hardening | Requires broad search-pipeline DB hydration changes and health metrics beyond the safe P2 limit |
| 045/007-P2-1 | Stale coverage-graph target path | Packet-brief hygiene; no live runtime path to patch in this packet |
| 045/008-P2-1 | Stale shell detector path | Future brief/doc cleanup; no current runtime failure |
| 045/008-P2-2 | Scoped link validation before default-on | Requires design for changed-file or active-packet link scope |
| 045/009-P2-1 | Evergreen grep allowlist | Needs stable-ID allowlist policy; not safe as a quick edit |
| 045/010-P2-4 | Runtime config feature-flag notes in protected local profiles | `.codex/config.toml` edits were blocked by sandbox path policy; installer note was fixed |
| 045/010-P2-5 | Permissive checked-in runtime config context | `.codex/config.toml`/`.gemini/settings.json` edits were blocked by sandbox path policy |

## Operator-Only Item

| Finding | Action |
|---------|--------|
| 045/005-P1-1 | Run `npm --prefix .opencode/skill/system-spec-kit/mcp_server run hook-tests` from a normal, non-sandboxed shell and preserve `run-output/latest` live CLI verdicts |

