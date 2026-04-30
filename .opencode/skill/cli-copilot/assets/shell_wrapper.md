---
title: "Copilot Programmatic Context Wrapper"
description: "Optional shell wrapper for prepending the Spec Kit managed Copilot custom-instructions block to non-interactive copilot -p calls."
---

# Copilot Programmatic Context Wrapper

Use this optional wrapper when a scripted `copilot -p` call needs the freshest Spec Kit startup context and advisor brief in the same invocation. Interactive Copilot CLI sessions should rely on `$HOME/.copilot/copilot-instructions.md`, which Spec Kit refreshes through the repository `userPromptSubmitted` hook.

```bash
cpx() {
  local prompt="${1:-}"
  local repo_root
  local instructions_file
  local context_block

  shift || true
  repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
  instructions_file="${SPECKIT_COPILOT_INSTRUCTIONS_PATH:-$HOME/.copilot/copilot-instructions.md}"

  if [ -f "$repo_root/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js" ]; then
    printf '{"prompt":%s,"cwd":%s}\n' \
      "$(python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "$prompt")" \
      "$(python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "$repo_root")" \
      | node "$repo_root/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js" >/dev/null
  fi

  if [ -f "$instructions_file" ]; then
    context_block="$(awk '/SPEC-KIT-COPILOT-CONTEXT:BEGIN/{flag=1} flag{print} /SPEC-KIT-COPILOT-CONTEXT:END/{flag=0}' "$instructions_file")"
  fi

  if [ -n "$context_block" ]; then
    copilot -p "$context_block

$prompt" "$@"
  else
    copilot -p "$prompt" "$@"
  fi
}
```

Notes:

- This wrapper is for programmatic mode only; it is not a replacement for interactive `copilot`.
- The repository hook path still returns `{}` because Copilot CLI currently ignores `userPromptSubmitted` hook output for prompt mutation.
- Keep human Copilot instructions outside the `SPEC-KIT-COPILOT-CONTEXT` markers so the managed block can be replaced safely.

## 1. OVERVIEW

_TODO: populate this section_

---

## 2. OVERVIEW

_TODO: populate this section_

---
