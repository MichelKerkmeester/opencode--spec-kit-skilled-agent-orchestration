"use strict";
// ---------------------------------------------------------------
// MODULE: Check No Mcp Lib Imports Ast
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
// 1. CHECK NO MCP LIB IMPORTS AST
// ───────────────────────────────────────────────────────────────
// AST-based enforcement for prohibited internal runtime imports.
// Includes deep transitive re-export traversal for local barrel files.
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const import_policy_rules_1 = require("./import-policy-rules");
const SCRIPTS_ROOT = path.resolve(__dirname, '..');
function resolveAllowlistPath() {
    const candidates = [
        // Source layout (tsx): scripts/evals/check-no-mcp-lib-imports-ast.ts
        path.resolve(__dirname, 'import-policy-allowlist.json'),
        // Compiled layout (node): scripts/dist/evals/check-no-mcp-lib-imports-ast.js
        path.resolve(__dirname, '../../evals/import-policy-allowlist.json'),
        // CWD fallbacks
        path.resolve(process.cwd(), 'evals/import-policy-allowlist.json'),
        path.resolve(process.cwd(), 'scripts/evals/import-policy-allowlist.json'),
    ];
    for (const candidate of candidates) {
        if (fs.existsSync(candidate))
            return candidate;
    }
    return null;
}
function loadAllowlist() {
    const allowlistPath = resolveAllowlistPath();
    if (!allowlistPath) {
        console.warn('Warning: import-policy-allowlist.json not found, treating all violations as errors');
        return { description: '', exceptions: [] };
    }
    try {
        const parsed = JSON.parse(fs.readFileSync(allowlistPath, 'utf-8'));
        const allowlist = parsed;
        if (!Array.isArray(allowlist?.exceptions)) {
            throw new Error('Invalid allowlist schema: missing or invalid exceptions array');
        }
        return {
            description: typeof allowlist.description === 'string' ? allowlist.description : '',
            exceptions: allowlist.exceptions,
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`Error: Failed to parse ${allowlistPath}: ${message}`);
        process.exit(2);
    }
}
function isAllowlisted(filePath, importPath, allowlist) {
    const relativeFile = path.relative(SCRIPTS_ROOT, filePath).replace(/\\/g, '/');
    const normalizedFile = `scripts/${relativeFile}`;
    for (const exception of allowlist.exceptions) {
        if (normalizedFile !== exception.file && relativeFile !== exception.file) {
            continue;
        }
        if (exception.import.endsWith('/*')) {
            const prefix = exception.import.slice(0, -2);
            if (importPath.startsWith(prefix))
                return true;
        }
        if (importPath === exception.import)
            return true;
    }
    return false;
}
function isLocalRelativeImport(importPath) {
    return importPath.startsWith('./') || importPath.startsWith('../');
}
function resolveLocalImportTarget(importingFile, importPath) {
    const basePath = path.resolve(path.dirname(importingFile), importPath);
    const candidates = [
        basePath,
        `${basePath}.ts`,
        `${basePath}.tsx`,
        `${basePath}.mts`,
        `${basePath}.cts`,
        `${basePath}.js`,
        `${basePath}.mjs`,
        `${basePath}.cjs`,
        path.join(basePath, 'index.ts'),
        path.join(basePath, 'index.tsx'),
        path.join(basePath, 'index.mts'),
        path.join(basePath, 'index.cts'),
        path.join(basePath, 'index.js'),
        path.join(basePath, 'index.mjs'),
        path.join(basePath, 'index.cjs'),
    ];
    for (const candidate of candidates) {
        if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) {
            continue;
        }
        // Use real path for containment check to prevent symlink bypass
        try {
            const realCandidate = fs.realpathSync(candidate);
            const realScriptsRoot = fs.realpathSync(SCRIPTS_ROOT);
            if (realCandidate.startsWith(realScriptsRoot)) {
                return candidate;
            }
        }
        catch {
            // realpathSync failed — candidate may not exist or be inaccessible
        }
        return null;
    }
    return null;
}
function getModuleSpecifierText(moduleSpecifier) {
    if (typescript_1.default.isStringLiteral(moduleSpecifier) || typescript_1.default.isNoSubstitutionTemplateLiteral(moduleSpecifier)) {
        return moduleSpecifier.text;
    }
    return null;
}
function getNodeLine(sourceFile, node) {
    const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    return line + 1;
}
function parseFile(filePath, allowlist) {
    const sourceText = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = typescript_1.default.createSourceFile(filePath, sourceText, typescript_1.default.ScriptTarget.Latest, true, typescript_1.default.ScriptKind.TS);
    const directViolations = [];
    const localImports = [];
    const localReExports = [];
    const forbiddenReExports = [];
    function registerLocalDependency(importPath, line, isReExport) {
        if (!isLocalRelativeImport(importPath))
            return;
        const targetFile = resolveLocalImportTarget(filePath, importPath);
        if (!targetFile)
            return;
        localImports.push({ line, importPath, targetFile });
        if (isReExport) {
            localReExports.push(targetFile);
        }
    }
    function registerProhibitedImport(importPath, line, isReExport) {
        if (!(0, import_policy_rules_1.isProhibitedImportPath)(importPath))
            return;
        if (!isAllowlisted(filePath, importPath, allowlist)) {
            directViolations.push({ file: filePath, line, importPath });
        }
        if (isReExport) {
            forbiddenReExports.push({ line, importPath });
        }
    }
    function visit(node) {
        if (typescript_1.default.isImportDeclaration(node) && node.moduleSpecifier) {
            const importPath = getModuleSpecifierText(node.moduleSpecifier);
            if (importPath) {
                const line = getNodeLine(sourceFile, node.moduleSpecifier);
                registerLocalDependency(importPath, line, false);
                registerProhibitedImport(importPath, line, false);
            }
        }
        if (typescript_1.default.isExportDeclaration(node) && node.moduleSpecifier) {
            const importPath = getModuleSpecifierText(node.moduleSpecifier);
            if (importPath) {
                const line = getNodeLine(sourceFile, node.moduleSpecifier);
                registerLocalDependency(importPath, line, true);
                registerProhibitedImport(importPath, line, true);
            }
        }
        // import Foo = require("module") — ImportEqualsDeclaration
        if (typescript_1.default.isImportEqualsDeclaration(node) && typescript_1.default.isExternalModuleReference(node.moduleReference)) {
            const importPath = getModuleSpecifierText(node.moduleReference.expression);
            if (importPath) {
                const line = getNodeLine(sourceFile, node.moduleReference.expression);
                registerLocalDependency(importPath, line, false);
                registerProhibitedImport(importPath, line, false);
            }
        }
        // import("module") as type — ImportTypeNode (e.g., type Foo = import("module").Bar)
        if (typescript_1.default.isImportTypeNode(node) && typescript_1.default.isLiteralTypeNode(node.argument) && typescript_1.default.isStringLiteral(node.argument.literal)) {
            const importPath = node.argument.literal.text;
            const line = getNodeLine(sourceFile, node.argument.literal);
            registerLocalDependency(importPath, line, false);
            registerProhibitedImport(importPath, line, false);
        }
        if (typescript_1.default.isCallExpression(node) && node.arguments.length > 0) {
            const firstArg = node.arguments[0];
            const isRequireCall = typescript_1.default.isIdentifier(node.expression) && node.expression.text === 'require';
            const isDynamicImport = node.expression.kind === typescript_1.default.SyntaxKind.ImportKeyword;
            if (!isRequireCall && !isDynamicImport) {
                typescript_1.default.forEachChild(node, visit);
                return;
            }
            if (!typescript_1.default.isStringLiteral(firstArg) && !typescript_1.default.isNoSubstitutionTemplateLiteral(firstArg)) {
                typescript_1.default.forEachChild(node, visit);
                return;
            }
            const importPath = firstArg.text;
            const line = getNodeLine(sourceFile, firstArg);
            registerLocalDependency(importPath, line, false);
            registerProhibitedImport(importPath, line, false);
        }
        typescript_1.default.forEachChild(node, visit);
    }
    visit(sourceFile);
    return { directViolations, localImports, localReExports, forbiddenReExports };
}
function findTsFiles(dir) {
    const files = [];
    function walk(currentDir) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                if (entry.name === 'node_modules' || entry.name === 'dist')
                    continue;
                if (entry.isSymbolicLink())
                    continue; // Skip symlinked directories to prevent out-of-scope traversal
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
function collectForbiddenReExports(filePath, parsedByFile, cache, visiting) {
    const cached = cache.get(filePath);
    if (cached)
        return cached;
    if (visiting.has(filePath)) {
        return [];
    }
    visiting.add(filePath);
    const parsed = parsedByFile.get(filePath);
    if (!parsed) {
        visiting.delete(filePath);
        cache.set(filePath, []);
        return [];
    }
    const traces = parsed.forbiddenReExports.map((hit) => ({
        viaFile: filePath,
        importPath: hit.importPath,
    }));
    for (const reExportTarget of parsed.localReExports) {
        traces.push(...collectForbiddenReExports(reExportTarget, parsedByFile, cache, visiting));
    }
    visiting.delete(filePath);
    const deduped = new Map();
    for (const trace of traces) {
        deduped.set(`${trace.viaFile}::${trace.importPath}`, trace);
    }
    const result = [...deduped.values()];
    cache.set(filePath, result);
    return result;
}
function dedupeViolations(violations) {
    const deduped = new Map();
    for (const violation of violations) {
        const key = [
            violation.file,
            String(violation.line),
            violation.importPath,
            violation.viaFile || '',
            violation.viaImportPath || '',
        ].join('::');
        deduped.set(key, violation);
    }
    return [...deduped.values()];
}
function main() {
    const allowlist = loadAllowlist();
    const tsFiles = findTsFiles(SCRIPTS_ROOT);
    const parsedByFile = new Map();
    const allViolations = [];
    for (const file of tsFiles) {
        const parsed = parseFile(file, allowlist);
        parsedByFile.set(file, parsed);
        allViolations.push(...parsed.directViolations);
    }
    const reExportCache = new Map();
    for (const [file, parsed] of parsedByFile.entries()) {
        for (const localImport of parsed.localImports) {
            const traces = collectForbiddenReExports(localImport.targetFile, parsedByFile, reExportCache, new Set());
            for (const trace of traces) {
                if (isAllowlisted(file, trace.importPath, allowlist)) {
                    continue;
                }
                allViolations.push({
                    file,
                    line: localImport.line,
                    importPath: localImport.importPath,
                    viaFile: trace.viaFile,
                    viaImportPath: trace.importPath,
                });
            }
        }
    }
    const violations = dedupeViolations(allViolations);
    if (violations.length === 0) {
        console.log('AST import policy check passed: no prohibited @spec-kit/mcp-server/{lib,core,handlers} internal imports found.');
        process.exit(0);
    }
    console.error(`AST import policy check FAILED: ${violations.length} violation(s) found:\n`);
    for (const violation of violations) {
        const relPath = path.relative(SCRIPTS_ROOT, violation.file);
        if (violation.viaFile) {
            const viaRelPath = path.relative(SCRIPTS_ROOT, violation.viaFile);
            const reExportDetail = violation.viaImportPath ? ` (re-exports ${violation.viaImportPath})` : '';
            console.error(`  ${relPath}:${violation.line} → ${violation.importPath} (transitive violation via ${viaRelPath}${reExportDetail})`);
            continue;
        }
        console.error(`  ${relPath}:${violation.line} → ${violation.importPath}`);
    }
    console.error('\nTo fix: use @spec-kit/mcp-server/api/* or add a governed allowlist exception.');
    process.exit(1);
}
main();
//# sourceMappingURL=check-no-mcp-lib-imports-ast.js.map