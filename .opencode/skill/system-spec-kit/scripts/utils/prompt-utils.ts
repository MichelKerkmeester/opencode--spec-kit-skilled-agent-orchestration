// ---------------------------------------------------------------
// MODULE: Prompt Utils
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. PROMPT UTILS
// ───────────────────────────────────────────────────────────────
// Interactive CLI prompt utilities — confirmation dialogs and user input handling

// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
import readline from 'readline';

// ───────────────────────────────────────────────────────────────
// 3. INTERACTIVE MODE DETECTION
// ───────────────────────────────────────────────────────────────
function requireInteractiveMode(operation: string): never {
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
function promptUser(question: string, defaultValue: string = '', requireInteractive: boolean = true): Promise<string> {
  if (!process.stdout.isTTY || !process.stdin.isTTY) {
    if (requireInteractive && defaultValue === '') {
      requireInteractiveMode('user input required');
    }
    console.warn('[generate-context] Non-interactive mode: using default value');
    return Promise.resolve(defaultValue);
  }

  const rl: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise<string>((resolve, reject) => {
    rl.question(question, (answer: string) => {
      rl.close();
      resolve(answer.trim());
    });

    rl.on('error', (err: Error) => {
      rl.close();
      reject(err);
    });

    rl.on('SIGINT', () => {
      rl.close();
      reject(new Error('User interrupted input'));
    });
  });
}

async function promptUserChoice(question: string, maxChoice: number, maxAttempts: number = 3, requireInteractive: boolean = true): Promise<number> {
  if (!process.stdout.isTTY || !process.stdin.isTTY) {
    if (requireInteractive) {
      requireInteractiveMode('spec folder selection');
    }
    console.warn(`[generate-context] Non-interactive mode: using default choice 1`);
    return 1;
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const answer: string = await promptUser(question);
    const choice: number = parseInt(answer);

    if (!isNaN(choice) && choice >= 1 && choice <= maxChoice) {
      return choice;
    }

    if (attempt < maxAttempts) {
      console.log(`   \u274C Invalid choice. Please enter a number between 1 and ${maxChoice}.\n`);
    }
  }

  throw new Error('Maximum retry attempts exceeded. Please run the command again.');
}

// ───────────────────────────────────────────────────────────────
// 5. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  promptUser,
  promptUserChoice,
};
