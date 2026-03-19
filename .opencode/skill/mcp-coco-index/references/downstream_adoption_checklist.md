---
title: CocoIndex Downstream Adoption Checklist
description: Minimum rollout checklist for enabling CocoIndex in a sibling repo without adding new routing rules or hidden config-writing automation.
trigger_phrases:
  - cocoindex adoption checklist
  - downstream cocoindex rollout
  - sibling repo cocoindex
  - barter cocoindex
---

# CocoIndex Downstream Adoption Checklist

Minimum rollout checklist for enabling CocoIndex in a sibling repo.

---

## 1. OVERVIEW

Use this checklist when a sibling repo needs real CocoIndex adoption instead of advisor-only heuristics. The key rule is that downstream rollout is a three-layer contract:

- local skill payload
- repo-specific `cocoindex_code` MCP wiring
- local runtime hygiene for `.cocoindex_code/`

The shared helper scripts can verify these layers, but they do not create downstream config on the repo's behalf.

---

## 2. ADOPTION BUNDLE

A downstream repo needs all three layers below before advisor-side semantic routing can matter:

1. Local `mcp-coco-index` skill payload
2. `cocoindex_code` MCP wiring in the config files that repo actually uses
3. `.cocoindex_code/` gitignore hygiene

This checklist is intentionally documentation-first. The shared helper scripts may verify readiness, but they do not write config files for downstream repos.

---

## 3. REQUIRED PAYLOAD

Verify the repo contains:

- `.opencode/skill/mcp-coco-index/SKILL.md`
- `.opencode/skill/mcp-coco-index/scripts/`
- `.opencode/skill/mcp-coco-index/references/`
- `.opencode/skill/mcp-coco-index/assets/`
- `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc` after installation

If this payload is missing, `skill_advisor.py` cannot discover `mcp-coco-index` even if semantic-search heuristics exist.

---

## 4. CONFIG WIRING

Add `cocoindex_code` only to the config files the repo already uses.

Use [config_templates.md](./../assets/config_templates.md) for the exact snippets. The minimum contract is:

- server name: `cocoindex_code`
- command: `.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc`
- args: `["mcp"]`
- env: `COCOINDEX_CODE_ROOT_PATH="."`

Do not expand rollout to unused CLI configs just for symmetry.

### Example: Barter-Style Incomplete Adoption

Barter already has advisor-side CocoIndex logic, but it still lacks:

- the local `mcp-coco-index` skill subtree
- `cocoindex_code` MCP entries in the config files it actually uses

That means the advisor can attempt semantic behavior, but it still cannot recommend or use the CocoIndex skill there end to end.

---

## 5. READINESS CHECKS

After copying payload and wiring configs:

```bash
bash .opencode/skill/mcp-coco-index/scripts/doctor.sh --strict --require-config
bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh --strict --require-config
```

Use `--expect-config <path>` when the rollout should validate a specific config file instead of “at least one supported config”.

Examples:

```bash
bash .opencode/skill/mcp-coco-index/scripts/doctor.sh --strict --require-config --expect-config opencode.json
bash .opencode/skill/mcp-coco-index/scripts/doctor.sh --strict --require-config --expect-config .codex/config.toml
```

---

## 6. GITIGNORE HYGIENE

Confirm the repo ignores:

```text
.cocoindex_code/
```

The semantic index is local runtime state and should not be committed.

---

## 7. DONE CRITERIA

A downstream repo is adoption-ready when:

- the local CocoIndex skill payload exists
- the repo-local `ccc` binary is installed
- the index is initialized and non-empty
- required config files contain `cocoindex_code`
- `.cocoindex_code/` is gitignored
- `doctor.sh --strict --require-config` exits `0`

If any of those fail, fix the missing layer instead of tuning advisor heuristics further.
