---
status: placeholder
stack: REACT_NATIVE
canonical_source: null
populated: false
last_synced_at: "2026-04-30"
---

# React Native stack — placeholder (canonical content retired)

Stack detected: **REACT_NATIVE** (Expo or bare React Native projects).

This skill's React Native reference content is **scaffolded but not populated**. The canonical guidance was retired on 2026-04-30; consult git history at the commit before that date if you need the prior content.

## How to populate this folder

1. Restore prior content from git history OR author fresh RN standards under `sk-code/references/react-native/`
2. Adapt to this skill's phase lifecycle (Implementation → Code Quality Gate → Debugging → Verification)
3. Set frontmatter `populated: true` and update `last_synced_at`

## Verification commands for REACT_NATIVE

```bash
npm test           # Jest / detox
npx eslint .       # lint
npx expo export    # Expo build (or `npx react-native build` for bare)
```

See `.opencode/skill/sk-code/SKILL.md` §2 for the routing logic.
