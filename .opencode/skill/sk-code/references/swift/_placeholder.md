---
status: placeholder
stack: SWIFT
canonical_source: null
populated: false
last_synced_at: "2026-04-30"
---

# Swift stack — placeholder (canonical content retired)

Stack detected: **SWIFT** (iOS / macOS / Swift packages).

This skill's Swift reference content is **scaffolded but not populated**. The canonical guidance was retired on 2026-04-30; consult git history at the commit before that date if you need the prior content.

## How to populate this folder

1. Restore prior content from git history OR author fresh Swift standards under `sk-code/references/swift/`
2. Adapt to this skill's phase lifecycle (Implementation → Code Quality Gate → Debugging → Verification)
3. Set frontmatter `populated: true` and update `last_synced_at`

## Verification commands for SWIFT

```bash
swift test         # XCTest via SPM (or `xcodebuild test` for projects)
swiftlint          # lint (requires swiftlint installed)
swift build        # production build
```

See `.opencode/skill/sk-code/SKILL.md` §2 for the routing logic.
