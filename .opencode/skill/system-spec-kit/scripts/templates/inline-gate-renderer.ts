// -------------------------------------------------------------------
// MODULE: Inline Gate Renderer
// -------------------------------------------------------------------

// -------------------------------------------------------------------
// 1. IMPORTS
// -------------------------------------------------------------------

import fs from 'node:fs';

// -------------------------------------------------------------------
// 2. TYPES
// -------------------------------------------------------------------

export type RenderLevel = '1' | '2' | '3' | '3+' | 'phase';

interface GateFrame {
  parentActive: boolean;
  conditionActive: boolean;
}

interface ParserState {
  tokens: string[];
  position: number;
  level: RenderLevel;
}

// -------------------------------------------------------------------
// 3. EXPRESSION PARSER
// -------------------------------------------------------------------

const VALID_LEVELS = new Set<RenderLevel>(['1', '2', '3', '3+', 'phase']);
const GATE_OPEN = /^\s*<!--\s*IF\s+(.+?)\s*-->\s*$/u;
const GATE_CLOSE = /^\s*<!--\s*\/IF\s*-->\s*$/u;
const GATE_EMPTY = /^\s*<!--\s*IF\s+(.+?)\s*-->\s*<!--\s*\/IF\s*-->\s*$/u;

function tokenize(expression: string): string[] {
  const tokens: string[] = [];
  let position = 0;

  while (position < expression.length) {
    if (/\s/u.test(expression[position])) {
      position += 1;
      continue;
    }

    if (expression[position] === '(' || expression[position] === ')') {
      tokens.push(expression[position]);
      position += 1;
      continue;
    }

    const start = position;
    while (position < expression.length && !/\s|\(|\)/u.test(expression[position])) {
      position += 1;
    }
    let token = expression.slice(start, position);

    if (/^[a-z]+:/u.test(token)) {
      while (position < expression.length) {
        let next = position;
        while (next < expression.length && /\s/u.test(expression[next])) {
          next += 1;
        }

        if (expression[next] === ',') {
          token += ',';
          position = next + 1;
          continue;
        }

        if (token.endsWith(',') && /[A-Za-z0-9+_-]/u.test(expression[next] ?? '')) {
          const valueStart = next;
          position = next;
          while (position < expression.length && /[A-Za-z0-9+_-]/u.test(expression[position])) {
            position += 1;
          }
          token += expression.slice(valueStart, position);
          continue;
        }

        break;
      }
    }

    tokens.push(token);
  }

  return tokens;
}

function peek(state: ParserState): string | undefined {
  return state.tokens[state.position];
}

function consume(state: ParserState): string {
  const token = state.tokens[state.position];
  if (!token) {
    throw new Error('Unexpected end of inline gate expression');
  }
  state.position += 1;
  return token;
}

function parseAtom(state: ParserState): boolean {
  const token = consume(state);
  const match = /^([a-z]+):([A-Za-z0-9+,_-]+)$/u.exec(token);
  if (!match) {
    throw new Error(`Invalid inline gate atom: ${token}`);
  }
  const [, axis, valueList] = match;
  if (axis !== 'level') {
    throw new Error(`Unsupported inline gate axis: ${axis}`);
  }
  const values = valueList.split(',');
  const normalizedValues = values.map((value) => value.trim());
  normalizedValues.forEach((value, index) => {
    if (value === '' && index === normalizedValues.length - 1) {
      return;
    }
    if (!VALID_LEVELS.has(value as RenderLevel)) {
      throw new Error(`Unsupported inline gate level: ${value || '(empty)'}`);
    }
  });
  return normalizedValues.some((value) => value === state.level);
}

function parsePrimary(state: ParserState): boolean {
  if (peek(state) === '(') {
    consume(state);
    const value = parseOr(state);
    if (consume(state) !== ')') {
      throw new Error('Unclosed inline gate expression group');
    }
    return value;
  }
  return parseAtom(state);
}

function parseUnary(state: ParserState): boolean {
  if (peek(state)?.toUpperCase() === 'NOT') {
    consume(state);
    return !parseUnary(state);
  }
  return parsePrimary(state);
}

function parseAnd(state: ParserState): boolean {
  let value = parseUnary(state);
  while (peek(state)?.toUpperCase() === 'AND') {
    consume(state);
    value = parseUnary(state) && value;
  }
  return value;
}

function parseOr(state: ParserState): boolean {
  let value = parseAnd(state);
  while (peek(state)?.toUpperCase() === 'OR') {
    consume(state);
    value = parseAnd(state) || value;
  }
  return value;
}

export function evaluateGateExpression(expression: string, level: RenderLevel): boolean {
  if (!VALID_LEVELS.has(level)) {
    throw new Error(`Unsupported render level: ${level}`);
  }
  const state: ParserState = { tokens: tokenize(expression), position: 0, level };
  const value = parseOr(state);
  if (state.position !== state.tokens.length) {
    throw new Error(`Unexpected inline gate token: ${state.tokens[state.position]}`);
  }
  return value;
}

// -------------------------------------------------------------------
// 4. RENDERER
// -------------------------------------------------------------------

export function renderInlineGates(template: string, level: RenderLevel): string {
  const lines = template.split(/(?<=\n)/u);
  const output: string[] = [];
  const stack: GateFrame[] = [];
  let isInFence = false;
  let pendingInactiveGateBoundary = false;

  for (const line of lines) {
    if (pendingInactiveGateBoundary && stack.length === 0 && /^\s*$/u.test(line)) {
      continue;
    }

    if (/^\s*(`{3}|~~~)/u.test(line)) {
      if (stack.every((frame) => frame.parentActive && frame.conditionActive)) {
        output.push(line);
      }
      isInFence = !isInFence;
      pendingInactiveGateBoundary = false;
      continue;
    }

    if (!isInFence) {
      const emptyMatch = GATE_EMPTY.exec(line);
      if (emptyMatch) {
        evaluateGateExpression(emptyMatch[1], level);
        continue;
      }

      const openMatch = GATE_OPEN.exec(line);
      if (openMatch) {
        const parentActive = stack.every((frame) => frame.parentActive && frame.conditionActive);
        stack.push({ parentActive, conditionActive: evaluateGateExpression(openMatch[1], level) });
        continue;
      }

      if (GATE_CLOSE.test(line)) {
        if (stack.length === 0) {
          throw new Error('Unmatched inline gate close marker');
        }
        const closedFrame = stack[stack.length - 1];
        stack.pop();
        pendingInactiveGateBoundary = stack.length === 0 && !(closedFrame.parentActive && closedFrame.conditionActive);
        continue;
      }
    }

    if (stack.every((frame) => frame.parentActive && frame.conditionActive)) {
      output.push(line);
    }
    pendingInactiveGateBoundary = false;
  }

  if (stack.length > 0) {
    throw new Error('Unclosed inline gate marker');
  }

  return output.join('');
}

// -------------------------------------------------------------------
// 5. CLI
// -------------------------------------------------------------------

function parseCliArgs(args: string[]): { level: RenderLevel; outDir?: string; filePaths: string[] } | null {
  const levelIndex = args.indexOf('--level');
  if (levelIndex === -1 || !args[levelIndex + 1]) {
    return null;
  }
  const level = args[levelIndex + 1] as RenderLevel;
  const outDirIndex = args.indexOf('--out-dir');
  const outDir = outDirIndex >= 0 ? args[outDirIndex + 1] : undefined;
  if (outDirIndex >= 0 && !outDir) {
    return null;
  }
  const filePaths = args.filter((arg, index) => {
    if (index === levelIndex || index === levelIndex + 1) return false;
    if (index === outDirIndex || index === outDirIndex + 1) return false;
    return !arg.startsWith('--');
  });
  return { level, outDir, filePaths };
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const parsed = parseCliArgs(process.argv.slice(2));
  if (!parsed) {
    console.error('Usage: inline-gate-renderer.ts --level <1|2|3|3+|phase> [--out-dir DIR file...] [template-file]');
    process.exit(2);
  }

  if (parsed.outDir) {
    if (parsed.filePaths.length === 0) {
      console.error('--out-dir mode requires at least one template file');
      process.exit(2);
    }
    fs.mkdirSync(parsed.outDir, { recursive: true });
    for (const filePath of parsed.filePaths) {
      const rendered = renderInlineGates(fs.readFileSync(filePath, 'utf8'), parsed.level);
      const outputName = filePath.endsWith('.tmpl')
        ? filePath.split('/').pop()!.replace(/\.tmpl$/u, '')
        : filePath.split('/').pop()!;
      fs.writeFileSync(`${parsed.outDir}/${outputName}`, rendered, 'utf8');
    }
    process.exit(0);
  }

  const input = parsed.filePaths[0] ? fs.readFileSync(parsed.filePaths[0], 'utf8') : await readStdin();
  process.stdout.write(renderInlineGates(input, parsed.level));
}
