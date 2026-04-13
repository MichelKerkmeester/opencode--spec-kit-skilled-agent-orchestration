# Plan: Skill Advisor Routing + README Sync

| Field | Value |
| --- | --- |
| Status | Complete |
| Phase | 011 |
| Approach | 3 deliverables in parallel: README, advisor Public, advisor Barter |

## D1: Update Skill README

**File**: `.opencode/skill/README.md`

Changes:
- Line 165 area: Update version from `0.1.0.0` to `1.0.0.0`
- Update description to: `Evaluator-first agent improvement with 5-dimension integration-aware scoring, dynamic profiling, deterministic benchmarks, and guarded promotion`
- Verify skill count is correct (should still be 5 in research/review/improvement category)

## D2: Update Skill Advisor (Public)

**File**: `.opencode/skill/skill-advisor/scripts/skill_advisor.py`

### Add INTENT_BOOSTERS (single-token)
```python
"5-dimension": ("sk-improve-agent", 1.8),
"5d scoring": ("sk-improve-agent", 1.8),
"integration scan": ("sk-improve-agent", 1.6),
"dynamic profile": ("sk-improve-agent", 1.6),
"evaluate agent": ("sk-improve-agent", 1.6),
"score agent": ("sk-improve-agent", 1.6),
"agent evaluation": ("sk-improve-agent", 1.6),
```

### Add PHRASE_INTENT_BOOSTERS (multi-token)
```python
"5-dimension evaluation": [("sk-improve-agent", 2.8)],
"5d agent scoring": [("sk-improve-agent", 2.8)],
"integration scanning": [("sk-improve-agent", 2.6)],
"dynamic profiling": [("sk-improve-agent", 2.6)],
"evaluate agent quality": [("sk-improve-agent", 2.8)],
"score agent dimensions": [("sk-improve-agent", 2.8)],
"agent integration surface": [("sk-improve-agent", 2.6)],
"/improve:agent": [("sk-improve-agent", 3.2)],
"/improve:prompt": [("sk-improve-prompt", 3.2)],
"improve agent": [("sk-improve-agent", 2.8)],
```

### Add COMMAND_BRIDGES
```python
"/improve:agent": "sk-improve-agent",
"/improve:prompt": "sk-improve-prompt",
"/create:agent": "sk-doc",
"/create:changelog": "sk-doc",
"/create:sk-skill": "sk-doc",
"/create:feature-catalog": "sk-doc",
"/create:testing-playbook": "sk-doc",
"/create:folder_readme": "sk-doc",
```

## D3: Sync COMMAND_BRIDGES to Barter

**File**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter/coder/.opencode/skill/skill-advisor/scripts/skill_advisor.py`

Add same COMMAND_BRIDGES as D2 EXCEPT:
- `/improve:agent` → skip (sk-improve-agent not in Barter)
- All others apply (sk-improve-prompt and sk-doc exist in Barter)

Also add PHRASE_INTENT_BOOSTERS for `/improve:prompt` and `/create:*` commands.

## Verification

```bash
# Test Phase 008+ routing
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "evaluate agent with 5 dimensions" --threshold 0.8
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "integration scanning" --threshold 0.8
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "/improve:agent" --threshold 0.8
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "/improve:prompt" --threshold 0.8
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "/create:agent" --threshold 0.8

# Verify README
grep "sk-improve-agent" .opencode/skill/README.md
```
