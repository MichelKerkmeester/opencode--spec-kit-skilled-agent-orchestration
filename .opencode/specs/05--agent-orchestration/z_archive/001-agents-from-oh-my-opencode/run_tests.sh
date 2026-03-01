#!/bin/bash
# Agent System Test Runner
# Usage: bash run_tests.sh

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
