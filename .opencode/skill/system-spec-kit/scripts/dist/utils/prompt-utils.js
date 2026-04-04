"use strict";
// ---------------------------------------------------------------
// MODULE: Prompt Utils
// ---------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptUser = promptUser;
exports.promptUserChoice = promptUserChoice;
// ───────────────────────────────────────────────────────────────
// 1. PROMPT UTILS
// ───────────────────────────────────────────────────────────────
// Interactive CLI prompt utilities — confirmation dialogs and user input handling
// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
const readline_1 = __importDefault(require("readline"));
// ───────────────────────────────────────────────────────────────
// 3. INTERACTIVE MODE DETECTION
// ───────────────────────────────────────────────────────────────
function requireInteractiveMode(operation) {
    console.error('ERROR: This operation requires user input but running in non-interactive mode.');
    console.error(`Operation: ${operation}`);
    console.error('');
    console.error('Please specify structured JSON for saves:');
    console.error('  node generate-context.js /tmp/save-context-data.json <spec-folder-path>');
    console.error('');
    console.error('Example:');
    console.error('  node generate-context.js --json \'{"specFolder":"specs/003-memory-and-spec-kit/054-remaining-bugs-remediation"}\' specs/003-memory-and-spec-kit/054-remaining-bugs-remedation');
    process.exit(1);
    // Process.exit never returns, but TypeScript needs the unreachable annotation
    throw new Error('Unreachable');
}
// ───────────────────────────────────────────────────────────────
// 4. USER PROMPTS
// ───────────────────────────────────────────────────────────────
function promptUser(question, defaultValue = '', requireInteractive = true) {
    if (!process.stdout.isTTY || !process.stdin.isTTY) {
        if (requireInteractive && defaultValue === '') {
            requireInteractiveMode('user input required');
        }
        console.warn('[generate-context] Non-interactive mode: using default value');
        return Promise.resolve(defaultValue);
    }
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
        rl.on('error', (err) => {
            rl.close();
            reject(err);
        });
        rl.on('SIGINT', () => {
            rl.close();
            reject(new Error('User interrupted input'));
        });
    });
}
async function promptUserChoice(question, maxChoice, maxAttempts = 3, requireInteractive = true) {
    if (!process.stdout.isTTY || !process.stdin.isTTY) {
        if (requireInteractive) {
            requireInteractiveMode('spec folder selection');
        }
        console.warn(`[generate-context] Non-interactive mode: using default choice 1`);
        return 1;
    }
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const answer = await promptUser(question);
        const choice = parseInt(answer);
        if (!isNaN(choice) && choice >= 1 && choice <= maxChoice) {
            return choice;
        }
        if (attempt < maxAttempts) {
            console.log(`   \u274C Invalid choice. Please enter a number between 1 and ${maxChoice}.\n`);
        }
    }
    throw new Error('Maximum retry attempts exceeded. Please run the command again.');
}
//# sourceMappingURL=prompt-utils.js.map