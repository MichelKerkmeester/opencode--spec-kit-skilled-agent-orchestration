---
title: "Implementation Plan [085-alignment-file-paths/plan]"
description: "1. Test with spec-kit memory file saved to project folder (current bug case)"
trigger_phrases:
  - "implementation"
  - "plan"
  - "085"
  - "alignment"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan

## Phase 1: alignment-validator.js Updates

### Step 1.1: Add detect_work_domain() function
- Extract all file paths from collectedData.observations
- Check percentage in `.opencode/` paths
- Identify subpath (skill/system-spec-kit, command, agent, etc.)
- Return domain info: { domain: 'opencode'|'project', subpath: string|null, confidence: number }

### Step 1.2: Add get_infrastructure_folder_patterns() function
- Map infrastructure subpaths to folder name patterns
- `.opencode/skill/system-spec-kit/` → ['memory', 'spec-kit', 'speckit', 'opencode']
- `.opencode/command/` → ['command', 'memory', 'opencode']
- `.opencode/agent/` → ['agent', 'opencode']

### Step 1.3: Modify calculate_alignment_score()
- Accept optional workDomain parameter
- When infrastructure work detected, boost scores for matching folders
- Add bonus for pattern matches: +30 points per match

### Step 1.4: Update validate_content_alignment() and validate_folder_alignment()
- Call detect_work_domain() first
- Pass work domain to scoring
- Add explicit warning when infrastructure work → project folder

## Phase 2: continue.md Updates

### Step 2.1: Add validation section
- After loading memory file, extract key_files
- Check if majority are in .opencode/ paths
- Compare against spec_folder

### Step 2.2: Add mismatch handling
- When mismatch detected, display warning
- Show both the spec_folder and detected work domain
- Present options: A) Use detected domain B) Use stored folder C) Select manually

## Testing

1. Test with spec-kit memory file saved to project folder (current bug case)
2. Test with project memory file saved correctly
3. Test with mixed files (some infrastructure, some project)
4. Test recovery command with mismatch detection
