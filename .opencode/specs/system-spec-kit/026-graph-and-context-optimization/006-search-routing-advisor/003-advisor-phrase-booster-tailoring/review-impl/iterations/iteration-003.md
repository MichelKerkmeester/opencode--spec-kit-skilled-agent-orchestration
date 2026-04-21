# Iteration 003 - Robustness

## Scope

Focused on phrase-matcher boundary behavior and natural-language edge cases.

Verification: scoped Vitest iteration 003 passed, 2 files / 3 tests.

## Findings

### F-003 - P1 Robustness - Raw substring matching creates false positives inside words

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1509`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1510`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1511`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2700`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2701`

The matcher uses `if phrase in prompt_lower`, so short additions like `code search`, `vector search`, and `concept search` can match inside unrelated words. Reproduced: `barcode search issue`, `decode search behavior`, and `precode search cleanup` route to `mcp-coco-index` with `!code search(phrase)`.

### F-004 - P1 Robustness - Regex-looking phrase keys are literal and miss common prompts

Evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1524`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:1525`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2700`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2701`

`how is.*implemented` and `how does.*work` look like regex patterns, but the matcher treats them as literal substrings. `how is auth implemented` and `how does router work` only get a semantic-search intent score around 0.77 and are filtered out at the default threshold.

## Delta

New findings: F-003, F-004.
