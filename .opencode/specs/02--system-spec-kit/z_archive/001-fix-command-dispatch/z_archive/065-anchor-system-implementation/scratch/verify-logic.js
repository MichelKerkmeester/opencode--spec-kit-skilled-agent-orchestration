const fs = require('fs');
const path = require('path');
const parser = require('../../../../.opencode/skill/system-spec-kit/mcp_server/lib/memory-parser.js');

const fixturePath = path.join(__dirname, 'fixture-memory.md');

// Mock estimateTokens
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

async function runTest() {
    console.log('--- Verifying Anchor Filtering Logic ---');
    
    const content = fs.readFileSync(fixturePath, 'utf-8');
    const anchors = ['summary', 'nested-child'];
    
    console.log(`Original Content Length: ${content.length} chars`);
    
    // LOGIC FROM context-server.js
    const extracted = parser.extractAnchors(content);
    const filteredParts = [];
    let foundCount = 0;

    for (const anchorId of anchors) {
        if (extracted[anchorId]) {
            filteredParts.push(`<!-- ANCHOR:${anchorId} -->\n${extracted[anchorId]}\n<!-- /ANCHOR:${anchorId} -->`);
            foundCount++;
        }
    }

    let finalContent;
    let tokenMetrics;

    if (filteredParts.length > 0) {
        const originalTokens = estimateTokens(content);
        finalContent = filteredParts.join('\n\n');
        const newTokens = estimateTokens(finalContent);
        const savings = Math.round((1 - newTokens / Math.max(originalTokens, 1)) * 100);

        tokenMetrics = {
            originalTokens,
            returnedTokens: newTokens,
            savingsPercent: savings,
            anchorsRequested: anchors.length,
            anchorsFound: foundCount
        };
    } else {
        finalContent = `<!-- WARNING: Requested anchors not found -->`;
    }
    
    // VERIFICATION
    console.log('\n--- Result ---');
    console.log(finalContent);
    console.log('\n--- Metrics ---');
    console.log(JSON.stringify(tokenMetrics, null, 2));
    
    if (finalContent.includes('This is the summary section') && 
        finalContent.includes('This is nested inside') &&
        !finalContent.includes('Here are the details')) {
        console.log('\n✅ Verification PASSED: Content correctly filtered');
    } else {
        console.log('\n❌ Verification FAILED: Content filtering incorrect');
    }
}

runTest();
