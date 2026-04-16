# Iteration 66 - correctness - skill-assets-part2

## Dispatcher
- iteration: 66 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T07:16:58.082Z

## Files Reviewed
- `.opencode/skill/sk-code-full-stack/assets/backend/go/checklists/verification_checklist.md`
- `.opencode/skill/sk-code-full-stack/assets/backend/nodejs/checklists/code_quality_checklist.md`
- `.opencode/skill/sk-code-full-stack/assets/backend/nodejs/checklists/debugging_checklist.md`
- `.opencode/skill/sk-code-full-stack/assets/backend/nodejs/checklists/verification_checklist.md`
- `.opencode/skill/sk-code-full-stack/assets/frontend/react/checklists/code_quality_checklist.md`
- `.opencode/skill/sk-code-full-stack/assets/frontend/react/checklists/debugging_checklist.md`
- `.opencode/skill/sk-code-full-stack/assets/frontend/react/checklists/verification_checklist.md`
- `.opencode/skill/sk-code-full-stack/assets/mobile/react-native/checklists/code_quality_checklist.md`
- `.opencode/skill/sk-code-full-stack/assets/mobile/react-native/checklists/debugging_checklist.md`
- `.opencode/skill/sk-code-full-stack/assets/mobile/react-native/checklists/verification_checklist.md`
- `.opencode/skill/sk-code-full-stack/assets/mobile/swift/checklists/code_quality_checklist.md`
- `.opencode/skill/sk-code-full-stack/assets/mobile/swift/checklists/debugging_checklist.md`
- `.opencode/skill/sk-code-full-stack/assets/mobile/swift/checklists/verification_checklist.md`
- `.opencode/skill/sk-code-opencode/assets/checklists/config_checklist.md`
- `.opencode/skill/sk-code-opencode/assets/checklists/javascript_checklist.md`

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **P1 - `sk-code-full-stack` routes backend/mobile stacks to per-stack checklist folders, but the Node.js, React Native, and Swift debugging/verification assets are still browser-web templates.**  
  `sk-code-full-stack/SKILL.md` advertises stack-specific resource domains under `assets/{category}/{stack}/checklists/` and distinct verification commands for `NODEJS`, `REACT_NATIVE`, and `SWIFT`, but the checked-in assets for those stacks still tell operators to use Chrome/Desktop/mobile DevTools, browser Network/Elements tabs, and browser-centric example claims. That breaks the skill contract for backend/mobile routing: an agent loading the Node.js or mobile checklist slice gets web instructions instead of backend/mobile verification guidance.

```json
{
  "claim": "The stack-specific Node.js, React Native, and Swift debugging/verification checklist assets are operationally incorrect because they are browser-web copies that do not match the stack routing contract in sk-code-full-stack/SKILL.md.",
  "evidenceRefs": [
    ".opencode/skill/sk-code-full-stack/SKILL.md:103-110",
    ".opencode/skill/sk-code-full-stack/SKILL.md:140-146",
    ".opencode/skill/sk-code-full-stack/assets/backend/nodejs/checklists/debugging_checklist.md:61-65",
    ".opencode/skill/sk-code-full-stack/assets/backend/nodejs/checklists/verification_checklist.md:82-92",
    ".opencode/skill/sk-code-full-stack/assets/mobile/react-native/checklists/debugging_checklist.md:61-65",
    ".opencode/skill/sk-code-full-stack/assets/mobile/react-native/checklists/verification_checklist.md:82-92",
    ".opencode/skill/sk-code-full-stack/assets/mobile/swift/checklists/debugging_checklist.md:239-257",
    ".opencode/skill/sk-code-full-stack/assets/mobile/swift/checklists/verification_checklist.md:82-92"
  ],
  "counterevidenceSought": "Checked the React frontend checklist siblings and sk-code-full-stack/SKILL.md to see whether these files were intentionally generic shared templates; the skill contract instead routes stack-specific assets, and the React/browser copy only fits the frontend/react slice.",
  "alternativeExplanation": "The files may have been bootstrapped from a universal template and never specialized, but they are still stored and loaded as stack-specific operational docs.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade if the runtime no longer loads these per-stack assets directly and instead treats them as generic reference text with an explicit instruction to ignore non-applicable browser sections."
}
```

- **P1 - `config_checklist.md` publishes JSONC validation commands that are not safe for real JSONC input.**  
  The checklist presents `grep -v '^\\s*//' ... | python -m json.tool` and `sed 's|//.*||' ... | python -m json.tool` as JSONC validation commands. The first only strips whole-line `//` comments and misses inline/block comments; the second blindly deletes `//` inside string values, which corrupts common JSONC content such as `$schema` URLs. In-session reproduction with a JSONC sample containing `https://json-schema.org/...` caused the documented `sed` command to fail with `Invalid control character`, so this runtime-facing guidance is not trustworthy.

```json
{
  "claim": "sk-code-opencode's config checklist documents JSONC validation commands that mis-parse valid JSONC and can corrupt schema URLs, so copied commands do not reliably validate the files they claim to support.",
  "evidenceRefs": [
    ".opencode/skill/sk-code-opencode/assets/checklists/config_checklist.md:45-52",
    ".opencode/skill/sk-code-opencode/assets/checklists/config_checklist.md:327-329",
    "Bash reproduction on 2026-04-16 from repo root using a JSONC sample with a $schema URL; the documented sed pipeline failed with 'Invalid control character'"
  ],
  "counterevidenceSought": "Checked whether the checklist labels these commands as rough heuristics or limits them to files without inline comments/URLs; it presents them as generic JSONC validation commands without such caveats.",
  "alternativeExplanation": "These commands may have been intended as quick local approximations before a real JSONC parser is available, but the current wording still advertises them as validation commands.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade if the checklist is revised to mark these as non-authoritative heuristics or if the documented command is replaced by a real JSONC-aware parser."
}
```

### P2 Findings
- **P2 - The stale `sk-code-web` parent-skill label still propagates through the newly reviewed `sk-code-full-stack` checklist slice.** The companion link target resolves to `../../../../SKILL.md`, but the rendered label still says `sk-code-web skill` in the reviewed Node.js/React/React Native/Swift assets (`.opencode/skill/sk-code-full-stack/assets/backend/nodejs/checklists/code_quality_checklist.md:665`, `.opencode/skill/sk-code-full-stack/assets/backend/nodejs/checklists/debugging_checklist.md:360`, `.opencode/skill/sk-code-full-stack/assets/backend/nodejs/checklists/verification_checklist.md:466`, `.opencode/skill/sk-code-full-stack/assets/frontend/react/checklists/code_quality_checklist.md:665`, `.opencode/skill/sk-code-full-stack/assets/frontend/react/checklists/debugging_checklist.md:360`, `.opencode/skill/sk-code-full-stack/assets/frontend/react/checklists/verification_checklist.md:466`, `.opencode/skill/sk-code-full-stack/assets/mobile/react-native/checklists/code_quality_checklist.md:665`, `.opencode/skill/sk-code-full-stack/assets/mobile/react-native/checklists/debugging_checklist.md:360`, `.opencode/skill/sk-code-full-stack/assets/mobile/react-native/checklists/verification_checklist.md:466`, `.opencode/skill/sk-code-full-stack/assets/mobile/swift/checklists/code_quality_checklist.md:665`, `.opencode/skill/sk-code-full-stack/assets/mobile/swift/checklists/debugging_checklist.md:360`, `.opencode/skill/sk-code-full-stack/assets/mobile/swift/checklists/verification_checklist.md:466`, `.opencode/skill/sk-code-full-stack/assets/backend/go/checklists/verification_checklist.md:466`).

## Traceability Checks
- **Cross-runtime consistency:** No multi-runtime agent-definition drift in this slice; the larger problem is cross-stack duplication inside a single runtime surface, where Node.js/React Native/Swift assets were copied from the web/browser template.
- **Skill<->code alignment:** `sk-code-full-stack/SKILL.md:103-110,140-146` advertises per-stack assets plus distinct verification commands, but the checked-in Node.js/React Native/Swift debug/verify checklists do not honor those routed stacks. `sk-code-opencode/SKILL.md:67-78` matches the `assets/checklists/` and `references/*/` layout used by `config_checklist.md` and `javascript_checklist.md`.
- **Command<->implementation alignment:** `javascript_checklist.md` references `universal_checklist.md`, JavaScript style guidance, JavaScript quality standards, and the `sk-code-review` quick reference, and those paths resolve in-repo. `config_checklist.md` resolves its companion/reference links too, but its published JSONC validation commands are operationally inaccurate.

## Confirmed-Clean Surfaces
- `.opencode/skill/sk-code-opencode/assets/checklists/javascript_checklist.md` - companion/reference paths resolve, and the CommonJS/OpenCode guidance aligns with `sk-code-opencode/SKILL.md`.
- `.opencode/skill/sk-code-opencode/assets/checklists/config_checklist.md` - related-resource links resolve in-repo even though the JSONC validation command examples are stale.
- `.opencode/skill/sk-code-full-stack/assets/frontend/react/checklists/debugging_checklist.md` - the browser-oriented debugging workflow is directionally consistent with the frontend/react stack, aside from the stale parent-skill label.
- `.opencode/skill/sk-code-full-stack/assets/frontend/react/checklists/verification_checklist.md` - browser/device verification guidance is directionally consistent with the frontend/react stack, aside from the stale parent-skill label.

## Next Focus
- Review the remaining operational assets for command examples or stack-specific docs that were copied across domains without updating runtime assumptions, especially where backend/mobile surfaces still inherit web-oriented guidance.
