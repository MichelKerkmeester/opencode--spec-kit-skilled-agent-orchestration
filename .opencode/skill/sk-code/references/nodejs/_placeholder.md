---
status: placeholder
stack: NODEJS
canonical_source: null
populated: false
last_synced_at: "2026-04-30"
---

# Node.js stack — placeholder (canonical content retired)

Stack detected: **NODEJS** (server-side JavaScript / TypeScript, Express, Fastify, etc.).

This skill's Node.js reference content is **scaffolded but not populated**. The canonical guidance was retired on 2026-04-30; consult git history at the commit before that date if you need the prior content.

## How to populate this folder

1. Restore prior content from git history OR author fresh Node.js standards under `sk-code/references/nodejs/`
2. Adapt to this skill's phase lifecycle (Implementation → Code Quality Gate → Debugging → Verification)
3. Set frontmatter `populated: true` and update `last_synced_at`

## Verification commands for NODEJS

```bash
npm test          # unit + integration suite
npx eslint .      # lint
npm run build     # tsc / esbuild / rollup, etc.
```

See `.opencode/skill/sk-code/SKILL.md` §2 for the routing logic.
