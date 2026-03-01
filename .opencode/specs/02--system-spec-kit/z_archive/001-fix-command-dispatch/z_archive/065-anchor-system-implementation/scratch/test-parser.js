const parser = require('../../../../.opencode/skill/system-spec-kit/mcp_server/lib/memory-parser.js');
const fs = require('fs');
const path = require('path');

const fixturePath = path.join(__dirname, 'fixture-memory.md');
const content = fs.readFileSync(fixturePath, 'utf-8');

console.log('--- Testing extract_anchors ---');

// Mock extract_anchors if not yet implemented (for TDD visualization)
if (!parser.extractAnchors) {
    console.log('❌ extractAnchors not yet implemented in parser');
} else {
    const anchors = parser.extractAnchors(content);
    console.log('Extracted Anchors:', Object.keys(anchors));

    if (anchors['summary'] && anchors['summary'].includes('This is the summary section')) {
        console.log('✅ Summary anchor extracted correctly');
    } else {
        console.log('❌ Summary anchor failed');
    }

    if (anchors['details']) {
        console.log('✅ Details anchor extracted');
    }

    if (anchors['nested-child']) {
        console.log('✅ Nested child extracted');
    }
    
    // Check broken anchor behavior (should likely be ignored or return partial if logic permits, usually ignored)
    if (!anchors['broken']) {
         console.log('✅ Broken anchor ignored (as expected)');
    } else {
         console.log('⚠️ Broken anchor was extracted (unexpected for strict parsing)');
    }
}
