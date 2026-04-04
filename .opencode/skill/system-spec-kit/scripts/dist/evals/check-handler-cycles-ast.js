"use strict";
// ---------------------------------------------------------------
// MODULE: Check Handler Cycles Ast
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ───────────────────────────────────────────────────────────────
// 1. CHECK HANDLER CYCLES AST
// ───────────────────────────────────────────────────────────────
// Detects circular import/re-export dependencies in mcp_server/handlers.
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const typescript_1 = __importDefault(require("typescript"));
function resolveHandlersRoot() {
    const candidates = [
        // Source layout (tsx): scripts/evals/check-handler-cycles-ast.ts
        path.resolve(__dirname, '../../mcp_server/handlers'),
        // Compiled layout (node): scripts/dist/evals/check-handler-cycles-ast.js
        path.resolve(__dirname, '../../../mcp_server/handlers'),
        // CWD fallbacks
        path.resolve(process.cwd(), '../mcp_server/handlers'),
        path.resolve(process.cwd(), 'mcp_server/handlers'),
    ];
    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }
    return candidates[0];
}
const HANDLERS_ROOT = resolveHandlersRoot();
function findTsFiles(dir) {
    const files = [];
    function walk(currentDir) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                if (entry.name === 'node_modules' || entry.name === 'dist')
                    continue;
                walk(fullPath);
            }
            else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
                files.push(fullPath);
            }
        }
    }
    walk(dir);
    return files;
}
function getModuleSpecifierText(moduleSpecifier) {
    if (typescript_1.default.isStringLiteral(moduleSpecifier) || typescript_1.default.isNoSubstitutionTemplateLiteral(moduleSpecifier)) {
        return moduleSpecifier.text;
    }
    return null;
}
function resolveLocalImportTarget(importingFile, importPath) {
    if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
        return null;
    }
    const basePath = path.resolve(path.dirname(importingFile), importPath);
    const candidates = [
        basePath,
        `${basePath}.ts`,
        `${basePath}.tsx`,
        `${basePath}.mts`,
        `${basePath}.cts`,
        path.join(basePath, 'index.ts'),
        path.join(basePath, 'index.tsx'),
        path.join(basePath, 'index.mts'),
        path.join(basePath, 'index.cts'),
    ];
    for (const candidate of candidates) {
        if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) {
            continue;
        }
        if (candidate.startsWith(HANDLERS_ROOT)) {
            return candidate;
        }
        return null;
    }
    return null;
}
function buildDependencyGraph(files) {
    const graph = new Map();
    const fileSet = new Set(files);
    for (const filePath of files) {
        const sourceText = fs.readFileSync(filePath, 'utf-8');
        const sourceFile = typescript_1.default.createSourceFile(filePath, sourceText, typescript_1.default.ScriptTarget.Latest, true, typescript_1.default.ScriptKind.TS);
        const deps = new Set();
        function registerDependency(importPath) {
            const target = resolveLocalImportTarget(filePath, importPath);
            if (!target)
                return;
            if (!fileSet.has(target))
                return;
            if (target === filePath)
                return;
            deps.add(target);
        }
        function visit(node) {
            if (typescript_1.default.isImportDeclaration(node) && node.moduleSpecifier) {
                const importPath = getModuleSpecifierText(node.moduleSpecifier);
                if (importPath)
                    registerDependency(importPath);
            }
            if (typescript_1.default.isExportDeclaration(node) && node.moduleSpecifier) {
                const importPath = getModuleSpecifierText(node.moduleSpecifier);
                if (importPath)
                    registerDependency(importPath);
            }
            typescript_1.default.forEachChild(node, visit);
        }
        visit(sourceFile);
        graph.set(filePath, deps);
    }
    return graph;
}
function detectCycles(graph) {
    const cycles = [];
    const seenCycleKeys = new Set();
    const visited = new Set();
    const inStack = new Set();
    const stack = [];
    function normalizeCycleKey(cycleNodes) {
        const minNode = [...cycleNodes].sort()[0];
        const pivot = cycleNodes.indexOf(minNode);
        const rotated = cycleNodes.slice(pivot).concat(cycleNodes.slice(0, pivot));
        return rotated.join(' -> ');
    }
    function dfs(node) {
        visited.add(node);
        inStack.add(node);
        stack.push(node);
        for (const dep of graph.get(node) ?? []) {
            if (!visited.has(dep)) {
                dfs(dep);
                continue;
            }
            if (!inStack.has(dep)) {
                continue;
            }
            const cycleStart = stack.indexOf(dep);
            if (cycleStart === -1) {
                continue;
            }
            const cycleNodes = stack.slice(cycleStart);
            const cycleKey = normalizeCycleKey(cycleNodes);
            if (seenCycleKeys.has(cycleKey)) {
                continue;
            }
            seenCycleKeys.add(cycleKey);
            cycles.push({ nodes: [...cycleNodes, dep] });
        }
        stack.pop();
        inStack.delete(node);
    }
    for (const node of graph.keys()) {
        if (!visited.has(node)) {
            dfs(node);
        }
    }
    return cycles;
}
function main() {
    if (!fs.existsSync(HANDLERS_ROOT)) {
        console.error(`ERROR: handlers directory not found: ${HANDLERS_ROOT}`);
        process.exit(2);
    }
    const files = findTsFiles(HANDLERS_ROOT);
    const graph = buildDependencyGraph(files);
    const cycles = detectCycles(graph);
    if (cycles.length === 0) {
        console.log(`AST handler cycle check passed: no circular dependencies across ${files.length} handler files.`);
        process.exit(0);
    }
    console.error(`AST handler cycle check FAILED: ${cycles.length} cycle(s) detected:\n`);
    for (const cycle of cycles) {
        const relCycle = cycle.nodes.map((node) => path.relative(HANDLERS_ROOT, node));
        console.error(`  - ${relCycle.join(' -> ')}`);
    }
    console.error('\nResolve cycles by extracting shared utilities into neutral handler modules.');
    process.exit(1);
}
main();
//# sourceMappingURL=check-handler-cycles-ast.js.map