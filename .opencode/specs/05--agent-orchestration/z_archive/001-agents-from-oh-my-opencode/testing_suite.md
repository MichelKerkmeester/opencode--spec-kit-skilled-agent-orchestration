# Agent System Testing Suite

> Comprehensive tests for the agent routing and dispatch system

---

<!-- ANCHOR:overview -->
## Overview

This document provides test cases for validating the agent system implementation.

---

<!-- /ANCHOR:overview -->


<!-- ANCHOR:agent-advisor-script-tests -->
## 1. Agent Advisor Script Tests

### Test Setup

```bash
cd /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com
ADVISOR=".opencode/scripts/agent_advisor.py"
```

### 1.1 Research Agent Routing

| Test | Command | Expected Agent | Expected Confidence |
|------|---------|----------------|---------------------|
| Basic research | `python3 $ADVISOR "research existing patterns"` | research | ≥0.6 |
| Find prior work | `python3 $ADVISOR "find prior work on authentication"` | research | ≥0.6 |
| Explore codebase | `python3 $ADVISOR "explore how forms are implemented"` | research | ≥0.6 |
| Pattern discovery | `python3 $ADVISOR "what patterns exist for validation"` | research | ≥0.6 |
| Plan request | `python3 $ADVISOR "plan the notification feature"` | research | ≥0.6 |

**Test Script:**
```bash
#!/bin/bash
echo "=== Research Agent Tests ==="

test_research() {
    result=$(python3 $ADVISOR "$1" 2>/dev/null)
    agent=$(echo $result | jq -r '.agent')
    confidence=$(echo $result | jq -r '.confidence')
    
    if [ "$agent" = "research" ] && [ $(echo "$confidence >= 0.6" | bc -l) -eq 1 ]; then
        echo "✅ PASS: '$1' → $agent ($confidence)"
    else
        echo "❌ FAIL: '$1' → $agent ($confidence) [expected: research ≥0.6]"
    fi
}

test_research "research existing patterns"
test_research "find prior work on authentication"
test_research "explore how forms are implemented"
test_research "what patterns exist for validation"
test_research "plan the notification feature"
```

### 1.2 Front-end Debug Agent Routing

| Test | Command | Expected Agent | Expected Confidence |
|------|---------|----------------|---------------------|
| Console error | `python3 $ADVISOR "debug console error on contact page"` | frontend-debug | ≥0.6 |
| Inspect element | `python3 $ADVISOR "inspect why button is not working"` | frontend-debug | ≥0.6 |
| Screenshot | `python3 $ADVISOR "take screenshot of the hero section"` | frontend-debug | ≥0.6 |
| Browser issue | `python3 $ADVISOR "browser shows blank page"` | frontend-debug | ≥0.6 |
| Network debug | `python3 $ADVISOR "debug network request failing"` | frontend-debug | ≥0.6 |

**Test Script:**
```bash
echo "=== Front-end Debug Agent Tests ==="

test_debug() {
    result=$(python3 $ADVISOR "$1" 2>/dev/null)
    agent=$(echo $result | jq -r '.agent')
    confidence=$(echo $result | jq -r '.confidence')
    
    if [ "$agent" = "frontend-debug" ] && [ $(echo "$confidence >= 0.6" | bc -l) -eq 1 ]; then
        echo "✅ PASS: '$1' → $agent ($confidence)"
    else
        echo "❌ FAIL: '$1' → $agent ($confidence) [expected: frontend-debug ≥0.6]"
    fi
}

test_debug "debug console error on contact page"
test_debug "inspect why button is not working"
test_debug "take screenshot of the hero section"
test_debug "browser shows blank page"
test_debug "debug network request failing"
```

### 1.3 Documentation Writer Agent Routing

| Test | Command | Expected Agent | Expected Confidence |
|------|---------|----------------|---------------------|
| Create README | `python3 $ADVISOR "create readme for the project"` | documentation-writer | ≥0.6 |
| Document feature | `python3 $ADVISOR "document this feature"` | documentation-writer | ≥0.6 |
| Create skill | `python3 $ADVISOR "create a new skill for testing"` | documentation-writer | ≥0.6 |
| Flowchart | `python3 $ADVISOR "create flowchart for the workflow"` | documentation-writer | ≥0.6 |
| Install guide | `python3 $ADVISOR "write install guide for the plugin"` | documentation-writer | ≥0.6 |

**Test Script:**
```bash
echo "=== Documentation Writer Agent Tests ==="

test_docs() {
    result=$(python3 $ADVISOR "$1" 2>/dev/null)
    agent=$(echo $result | jq -r '.agent')
    confidence=$(echo $result | jq -r '.confidence')
    
    if [ "$agent" = "documentation-writer" ] && [ $(echo "$confidence >= 0.6" | bc -l) -eq 1 ]; then
        echo "✅ PASS: '$1' → $agent ($confidence)"
    else
        echo "❌ FAIL: '$1' → $agent ($confidence) [expected: documentation-writer ≥0.6]"
    fi
}

test_docs "create readme for the project"
test_docs "document this feature"
test_docs "create a new skill for testing"
test_docs "create flowchart for the workflow"
test_docs "write install guide for the plugin"
```

### 1.4 Webflow MCP Agent Routing

| Test | Command | Expected Agent | Expected Confidence |
|------|---------|----------------|---------------------|
| Update collection | `python3 $ADVISOR "update the blog collection in webflow"` | webflow-mcp | ≥0.6 |
| Publish site | `python3 $ADVISOR "publish the site to production"` | webflow-mcp | ≥0.6 |
| CMS item | `python3 $ADVISOR "add new item to cms collection"` | webflow-mcp | ≥0.6 |
| Webflow page | `python3 $ADVISOR "update webflow page settings"` | webflow-mcp | ≥0.6 |
| Designer | `python3 $ADVISOR "modify element in webflow designer"` | webflow-mcp | ≥0.6 |

**Test Script:**
```bash
echo "=== Webflow MCP Agent Tests ==="

test_webflow() {
    result=$(python3 $ADVISOR "$1" 2>/dev/null)
    agent=$(echo $result | jq -r '.agent')
    confidence=$(echo $result | jq -r '.confidence')
    
    if [ "$agent" = "webflow-mcp" ] && [ $(echo "$confidence >= 0.6" | bc -l) -eq 1 ]; then
        echo "✅ PASS: '$1' → $agent ($confidence)"
    else
        echo "❌ FAIL: '$1' → $agent ($confidence) [expected: webflow-mcp ≥0.6]"
    fi
}

test_webflow "update the blog collection in webflow"
test_webflow "publish the site to production"
test_webflow "add new item to cms collection"
test_webflow "update webflow page settings"
test_webflow "modify element in webflow designer"
```

### 1.5 No Agent (Low Confidence) Tests

| Test | Command | Expected Agent | Expected Confidence |
|------|---------|----------------|---------------------|
| Generic request | `python3 $ADVISOR "fix the code"` | null | <0.4 |
| Ambiguous | `python3 $ADVISOR "help me"` | null | <0.4 |
| Empty | `python3 $ADVISOR ""` | null | 0 |

**Test Script:**
```bash
echo "=== No Agent Tests ==="

test_no_agent() {
    result=$(python3 $ADVISOR "$1" 2>/dev/null)
    agent=$(echo $result | jq -r '.agent')
    confidence=$(echo $result | jq -r '.confidence')
    
    if [ "$agent" = "null" ] || [ $(echo "$confidence < 0.4" | bc -l) -eq 1 ]; then
        echo "✅ PASS: '$1' → $agent ($confidence) [correctly rejected]"
    else
        echo "❌ FAIL: '$1' → $agent ($confidence) [should have been rejected]"
    fi
}

test_no_agent "fix the code"
test_no_agent "help me"
test_no_agent ""
```

---

<!-- /ANCHOR:agent-advisor-script-tests -->


<!-- ANCHOR:complete-test-runner -->
## 2. Complete Test Runner

Save as `.opencode/specs/05--agent-orchestration/z_archive/001-agents-from-oh-my-opencode/run_tests.sh`:

```bash
#!/bin/bash
# Agent System Test Runner
# Usage: bash run_tests.sh

set -e

ADVISOR=".opencode/scripts/agent_advisor.py"
PASS=0
FAIL=0

echo "========================================"
echo "  Agent System Test Suite"
echo "========================================"
echo ""

test_agent() {
    local request="$1"
    local expected_agent="$2"
    local min_confidence="$3"
    
    result=$(python3 $ADVISOR "$request" 2>/dev/null)
    agent=$(echo $result | jq -r '.agent')
    confidence=$(echo $result | jq -r '.confidence')
    
    if [ "$expected_agent" = "null" ]; then
        if [ "$agent" = "null" ] || [ $(echo "$confidence < 0.4" | bc -l) -eq 1 ]; then
            echo "✅ PASS: '$request'"
            ((PASS++))
        else
            echo "❌ FAIL: '$request' → $agent ($confidence)"
            ((FAIL++))
        fi
    else
        if [ "$agent" = "$expected_agent" ] && [ $(echo "$confidence >= $min_confidence" | bc -l) -eq 1 ]; then
            echo "✅ PASS: '$request' → $agent ($confidence)"
            ((PASS++))
        else
            echo "❌ FAIL: '$request' → $agent ($confidence) [expected: $expected_agent ≥$min_confidence]"
            ((FAIL++))
        fi
    fi
}

echo "--- Research Agent Tests ---"
test_agent "research existing patterns" "research" "0.6"
test_agent "find prior work on authentication" "research" "0.6"
test_agent "explore how forms are implemented" "research" "0.6"
test_agent "what patterns exist for validation" "research" "0.6"
test_agent "plan the notification feature" "research" "0.6"

echo ""
echo "--- Front-end Debug Agent Tests ---"
test_agent "debug console error on contact page" "frontend-debug" "0.6"
test_agent "inspect why button is not working" "frontend-debug" "0.6"
test_agent "take screenshot of the hero section" "frontend-debug" "0.6"
test_agent "browser shows blank page" "frontend-debug" "0.6"

echo ""
echo "--- Documentation Writer Agent Tests ---"
test_agent "create readme for the project" "documentation-writer" "0.6"
test_agent "document this feature" "documentation-writer" "0.6"
test_agent "create a new skill for testing" "documentation-writer" "0.6"
test_agent "create flowchart for the workflow" "documentation-writer" "0.6"

echo ""
echo "--- Webflow MCP Agent Tests ---"
test_agent "update the blog collection in webflow" "webflow-mcp" "0.6"
test_agent "publish the site to production" "webflow-mcp" "0.6"
test_agent "add new item to cms collection" "webflow-mcp" "0.6"

echo ""
echo "--- No Agent Tests ---"
test_agent "fix the code" "null" "0"
test_agent "help me" "null" "0"

echo ""
echo "========================================"
echo "  Results: $PASS passed, $FAIL failed"
echo "========================================"

if [ $FAIL -gt 0 ]; then
    exit 1
fi
```

---

<!-- /ANCHOR:complete-test-runner -->


<!-- ANCHOR:manual-integration-tests -->
## 3. Manual Integration Tests

### 3.1 Research-First Planning Flow

**Test:** Verify Gate 5 Option B triggers Research agent

1. Start a new conversation
2. Request: "I want to add a notification system"
3. When asked about spec folder, select "B" (New)
4. **Expected:** Research agent is dispatched
5. **Expected:** Research Findings document is produced
6. **Expected:** Spec folder is created with evidence-based plan

### 3.2 Agent Dispatch Format

**Test:** Verify 4-section dispatch format works

1. Manually dispatch an agent using:
```markdown
## Agent Dispatch: Research

### Task
Research existing notification patterns in the codebase

### Context
- Spec folder: .opencode/specs/01--anobel.com/z_archive/007-notification-system/
- Looking for: Toast notifications, alerts, overlays

### Expected Output
Research Findings document

### Constraints
- Focus on frontend patterns only
```

2. **Expected:** Agent executes and returns structured findings

### 3.3 Skill Integration

**Test:** Verify agents invoke skills correctly

1. Dispatch Documentation Writer: "Create README for notification system"
2. **Expected:** Agent invokes sk-doc skill
3. **Expected:** Output follows DQI standards

---

<!-- /ANCHOR:manual-integration-tests -->


<!-- ANCHOR:regression-tests -->
## 4. Regression Tests

### 4.1 Gate Numbering

**Test:** Verify all gates are numbered 0-9

```bash
grep -E "GATE [0-9]:" AGENTS.md | head -20
```

**Expected:** Gates 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 (no decimals)

### 4.2 No Librarian References

**Test:** Verify "librarian" has been renamed to "research"

```bash
grep -i "librarian" AGENTS.md
grep -i "librarian" "AGENTS (UNIVERSAL).md"
grep -i "librarian" .opencode/scripts/agent_advisor.py
```

**Expected:** No matches (all should be "research")

### 4.3 Agent Files Exist

**Test:** Verify all agent files exist

```bash
ls -la .opencode/agents/*/AGENT.md
```

**Expected:**
- `.opencode/agents/research/AGENT.md`
- `.opencode/agents/frontend-debug/AGENT.md`
- `.opencode/agents/documentation-writer/AGENT.md`
- `.opencode/agents/webflow-mcp/AGENT.md`

---

<!-- /ANCHOR:regression-tests -->


<!-- ANCHOR:performance-tests -->
## 5. Performance Tests

### 5.1 Routing Speed

**Test:** Agent advisor should respond quickly

```bash
time python3 .opencode/scripts/agent_advisor.py "research existing patterns"
```

**Expected:** <100ms

### 5.2 Confidence Consistency

**Test:** Same request should produce consistent confidence

```bash
for i in {1..5}; do
    python3 .opencode/scripts/agent_advisor.py "research existing patterns" | jq '.confidence'
done
```

**Expected:** Same confidence value each time

---

<!-- /ANCHOR:performance-tests -->


<!-- ANCHOR:edge-case-tests -->
## 6. Edge Case Tests

| Test Case | Input | Expected Behavior |
|-----------|-------|-------------------|
| Empty string | `""` | Returns null agent, 0 confidence |
| Very long input | 1000+ chars | Handles gracefully, returns result |
| Special characters | `"debug <script>alert(1)</script>"` | Handles safely |
| Mixed keywords | `"research and debug the webflow cms"` | Returns highest confidence agent |
| Unicode | `"研究现有模式"` | Handles gracefully |

---

<!-- /ANCHOR:edge-case-tests -->


<!-- ANCHOR:running-all-tests -->
## 7. Running All Tests

```bash
# Make test script executable
chmod +x .opencode/specs/05--agent-orchestration/z_archive/001-agents-from-oh-my-opencode/run_tests.sh

# Run all tests
bash .opencode/specs/05--agent-orchestration/z_archive/001-agents-from-oh-my-opencode/run_tests.sh
```

**Success Criteria:**
- All routing tests pass (correct agent, confidence ≥0.6)
- All rejection tests pass (null agent or confidence <0.4)
- No "librarian" references found
- All agent files exist
- Gate numbering is sequential 0-9

<!-- /ANCHOR:running-all-tests -->
