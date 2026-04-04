"use strict";
// ---------------------------------------------------------------
// MODULE: Decision Tree Generator
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDecisionTree = generateDecisionTree;
// ───────────────────────────────────────────────────────────────
// 1. DECISION TREE GENERATOR
// ───────────────────────────────────────────────────────────────
// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
const ascii_boxes_1 = require("./ascii-boxes");
// ───────────────────────────────────────────────────────────────
// 4. DECISION TREE GENERATION
// ───────────────────────────────────────────────────────────────
function generateDecisionTree(decisionData, ...args) {
    // Handle legacy format (simple parameters) for backwards compatibility
    if (typeof decisionData === 'string') {
        const title = decisionData;
        if (!Array.isArray(args[0])) {
            return (0, ascii_boxes_1.formatDecisionHeader)(title, '', 75, new Date().toISOString());
        }
        const chosen = typeof args[1] === 'string' ? args[1] : '';
        const pad = (text, length) => text.substring(0, length).padEnd(length);
        return `\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  ${pad(title, 18)}  \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
         \u2502
         \u25BC
    \u2571\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2572
   \u2571  Options?   \u2572
   \u2572            \u2571
    \u2572\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2571
      ${chosen ? '\u2713' : ''}`;
    }
    const { TITLE = 'Decision', CONTEXT = '', CONFIDENCE = 75, CHOICE_CONFIDENCE, RATIONALE_CONFIDENCE, TIMESTAMP = new Date().toISOString(), OPTIONS = [], CHOSEN = '', RATIONALE = '', EVIDENCE = [], CAVEATS = [], FOLLOWUP = [] } = decisionData;
    if (OPTIONS.length === 0) {
        return (0, ascii_boxes_1.formatDecisionHeader)(TITLE, CONTEXT, CONFIDENCE, TIMESTAMP, CHOICE_CONFIDENCE, RATIONALE_CONFIDENCE) + '\n' +
            '         \u2502\n' +
            '         \u25BC\n' +
            '   (No options provided)';
    }
    let tree = (0, ascii_boxes_1.formatDecisionHeader)(TITLE, CONTEXT, CONFIDENCE, TIMESTAMP, CHOICE_CONFIDENCE, RATIONALE_CONFIDENCE);
    tree += '\n                      \u2502\n                      \u25BC\n';
    const questionText = OPTIONS.length > 2 ? `Select from ${OPTIONS.length} options?` : 'Choose option?';
    tree += `              \u2571${'\u2500'.repeat(questionText.length + 2)}\u2572\n`;
    tree += `             \u2571  ${questionText}  \u2572\n`;
    tree += `            \u2571${' '.repeat(questionText.length + 4)}\u2572\n`;
    tree += `            \u2572${' '.repeat(questionText.length + 4)}\u2571\n`;
    tree += `             \u2572${'\u2500'.repeat(questionText.length + 2)}\u2571\n`;
    const chosenOption = CHOSEN.trim().length > 0
        ? OPTIONS.find((opt) => opt.LABEL === CHOSEN ||
            CHOSEN.includes(opt.LABEL || '') ||
            (opt.LABEL || '').includes(CHOSEN))
        : undefined;
    const displayedOptions = OPTIONS.slice(0, 4);
    const spacing = displayedOptions.length === 2 ? 15 : 10;
    if (displayedOptions.length === 2) {
        tree += '               \u2502           \u2502\n';
        tree += `            ${(0, ascii_boxes_1.padText)(displayedOptions[0].LABEL || '', 10)}     ${(0, ascii_boxes_1.padText)(displayedOptions[1].LABEL || '', 10)}\n`;
        tree += '               \u2502           \u2502\n';
        tree += '               \u25BC           \u25BC\n';
    }
    else {
        let branchLine = '      ';
        for (let i = 0; i < displayedOptions.length; i++) {
            branchLine += '\u2502' + ' '.repeat(spacing);
        }
        tree += branchLine.trimEnd() + '\n';
        let labelLine = '   ';
        for (const opt of displayedOptions) {
            labelLine += (0, ascii_boxes_1.padText)(opt.LABEL || '', spacing + 1);
        }
        tree += labelLine.trimEnd() + '\n';
    }
    if (displayedOptions.length <= 3) {
        const boxes = displayedOptions.map((opt) => (0, ascii_boxes_1.formatOptionBox)(opt, opt === chosenOption, 18).split('\n'));
        const maxLines = Math.max(...boxes.map((b) => b.length));
        for (let lineIdx = 0; lineIdx < maxLines; lineIdx++) {
            let line = '';
            for (let boxIdx = 0; boxIdx < boxes.length; boxIdx++) {
                const boxLine = boxes[boxIdx][lineIdx] || ' '.repeat(20);
                line += boxLine + '  ';
            }
            tree += line.trimEnd() + '\n';
        }
    }
    if (chosenOption || CHOSEN) {
        tree += '             \u2502           \u2502\n';
        tree += '             \u2502           \u25BC\n';
        tree += '             \u2502  ' + (0, ascii_boxes_1.formatChosenBox)(CHOSEN, RATIONALE, EVIDENCE).split('\n').join('\n             \u2502  ') + '\n';
        tree += '             \u2502           \u2502\n';
        tree += '             \u2514\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2518\n';
        tree += '                   \u2502\n';
        tree += '                   \u25BC\n';
    }
    if (CAVEATS && CAVEATS.length > 0) {
        tree += (0, ascii_boxes_1.formatCaveatsBox)(CAVEATS).split('\n').map((line) => '     ' + line).join('\n') + '\n';
        tree += '                   \u2502\n';
        tree += '                   \u25BC\n';
    }
    if (FOLLOWUP && FOLLOWUP.length > 0) {
        tree += (0, ascii_boxes_1.formatFollowUpBox)(FOLLOWUP).split('\n').map((line) => '     ' + line).join('\n') + '\n';
        tree += '                   \u2502\n';
        tree += '                   \u25BC\n';
    }
    tree += '        \u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E\n';
    tree += '        \u2502 Decision Logged \u2502\n';
    tree += '        \u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F';
    return tree;
}
//# sourceMappingURL=decision-tree-generator.js.map