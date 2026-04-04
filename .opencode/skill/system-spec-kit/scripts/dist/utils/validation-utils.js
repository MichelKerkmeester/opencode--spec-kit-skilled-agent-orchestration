"use strict";
// ---------------------------------------------------------------
// MODULE: Validation Utils
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNoLeakedPlaceholders = validateNoLeakedPlaceholders;
exports.validateAnchors = validateAnchors;
// ───────────────────────────────────────────────────────────────
// 1. VALIDATION UTILS
// ───────────────────────────────────────────────────────────────
// Validates rendered output — detects leaked Mustache placeholders and empty sections
// ───────────────────────────────────────────────────────────────
// 2. PLACEHOLDER VALIDATION
// ───────────────────────────────────────────────────────────────
function stripCodeSegments(content) {
    return content
        .replace(/```[\s\S]*?```/g, '\n')
        .replace(/`[^`\n]+`/g, ' ');
}
function validateNoLeakedPlaceholders(content, filename) {
    const validationContent = stripCodeSegments(content);
    const leaked = validationContent.match(/\{\{[A-Z_]+\}\}/g);
    if (leaked) {
        console.warn(`\u26A0\uFE0F  Leaked placeholders detected in ${filename}: ${leaked.join(', ')}`);
        const leakIndex = validationContent.indexOf(leaked[0]);
        console.warn(`   Context around leak: ${validationContent.substring(Math.max(0, leakIndex - 100), leakIndex + 100)}`);
        throw new Error(`\u274C Leaked placeholders in ${filename}: ${leaked.join(', ')}`);
    }
    const partialLeaked = validationContent.match(/\{\{[^}]*$/g);
    if (partialLeaked) {
        console.warn(`\u26A0\uFE0F  Partial placeholder detected in ${filename}: ${partialLeaked.join(', ')}`);
        throw new Error(`\u274C Malformed placeholder in ${filename}`);
    }
    const openBlocks = (validationContent.match(/\{\{[#^][A-Z_]+\}\}/g) || []);
    const closeBlocks = (validationContent.match(/\{\{\/[A-Z_]+\}\}/g) || []);
    if (openBlocks.length !== closeBlocks.length) {
        console.warn(`\u26A0\uFE0F  Template has ${openBlocks.length} open blocks but ${closeBlocks.length} close blocks`);
    }
}
// ───────────────────────────────────────────────────────────────
// 3. ANCHOR VALIDATION
// ───────────────────────────────────────────────────────────────
function validateAnchors(content) {
    const openPattern = /<!-- (?:ANCHOR|anchor):([a-zA-Z0-9_-]+)/g;
    const closePattern = /<!-- \/(?:ANCHOR|anchor):([a-zA-Z0-9_-]+)/g;
    const openAnchors = new Set();
    const closeAnchors = new Set();
    let match;
    while ((match = openPattern.exec(content)) !== null) {
        openAnchors.add(match[1]);
    }
    while ((match = closePattern.exec(content)) !== null) {
        closeAnchors.add(match[1]);
    }
    const warnings = [];
    for (const anchor of openAnchors) {
        if (!closeAnchors.has(anchor)) {
            warnings.push(`Unclosed anchor: ${anchor} (missing <!-- /ANCHOR:${anchor} -->)`);
        }
    }
    for (const anchor of closeAnchors) {
        if (!openAnchors.has(anchor)) {
            warnings.push(`Orphaned closing anchor: ${anchor} (no matching opening tag)`);
        }
    }
    return warnings;
}
function logAnchorValidation(content, filename) {
    const anchorWarnings = validateAnchors(content);
    if (anchorWarnings.length > 0) {
        console.warn(`[generate-context] Anchor validation warnings in ${filename}:`);
        anchorWarnings.forEach((w) => console.warn(`  - ${w}`));
    }
}
//# sourceMappingURL=validation-utils.js.map