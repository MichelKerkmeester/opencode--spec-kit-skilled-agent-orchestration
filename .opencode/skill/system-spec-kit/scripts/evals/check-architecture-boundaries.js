"use strict";
// ───────────────────────────────────────────────────────────────
// 1. CHECK ARCHITECTURE BOUNDARIES
// ───────────────────────────────────────────────────────────────
// Enforces two rules from ARCHITECTURE.md that were
// Previously documentation-only:
//   GAP A — shared/ must not import from mcp_server/ or scripts/
//   GAP B — mcp_server/scripts/ files must be thin wrappers only
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
exports.checkSharedNeutrality = checkSharedNeutrality;
exports.checkWrapperOnly = checkWrapperOnly;
exports.countSubstantiveLines = countSubstantiveLines;
exports.extractModuleSpecifiers = extractModuleSpecifiers;
exports.findTsFiles = findTsFiles;
exports.resolvePackageRoot = resolvePackageRoot;
exports.runArchitectureBoundaryCheck = runArchitectureBoundaryCheck;
// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const typescript_1 = __importDefault(require("typescript"));
// ───────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────
const REQUIRED_ROOT_DIRS = ['shared', 'mcp_server', 'scripts'];
// Absolute prohibition — shared/ must remain neutral (no allowlist)
const SHARED_PROHIBITED_PACKAGE_PREFIXES = ['@spec-kit/mcp-server', '@spec-kit/scripts'];
// 50 lines is generous for a spawn+exit wrapper; anything larger
// Indicates logic that belongs in scripts/ instead
const MAX_SUBSTANTIVE_LINES = 50;
const PACKAGE_ROOT = resolvePackageRoot(__dirname);
const CHILD_PROCESS_MODULE_SPECIFIERS = new Set(['child_process', 'node:child_process']);
const CHILD_PROCESS_WRAPPER_APIS = new Set(['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync', 'fork']);
// ───────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────
function findTsFiles(dir) {
    const files = [];
    function walk(currentDir) {
        if (!fs.existsSync(currentDir))
            return;
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
function resolvePackageRoot(startDir) {
    let cursor = path.resolve(startDir);
    while (true) {
        const hasRequiredDirs = REQUIRED_ROOT_DIRS.every((dirName) => fs.existsSync(path.join(cursor, dirName)));
        if (hasRequiredDirs)
            return cursor;
        const parent = path.dirname(cursor);
        if (parent === cursor) {
            throw new Error(`Unable to resolve package root from: ${startDir}`);
        }
        cursor = parent;
    }
}
function resolveCheckRoot(packageRoot) {
    const resolvedRoot = path.resolve(packageRoot);
    const missingDirs = REQUIRED_ROOT_DIRS.filter((dirName) => !fs.existsSync(path.join(resolvedRoot, dirName)));
    if (missingDirs.length > 0) {
        throw new Error(`Invalid package root "${resolvedRoot}" — missing directories: ${missingDirs.join(', ')}`);
    }
    return resolvedRoot;
}
function normalizeImportPath(importPath) {
    return importPath.replace(/\\/g, '/');
}
function isWithinDirectory(candidatePath, directoryPath) {
    const relative = path.relative(directoryPath, candidatePath);
    return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}
function isStringLiteralLike(node) {
    return typescript_1.default.isStringLiteral(node) || typescript_1.default.isNoSubstitutionTemplateLiteral(node);
}
function isChildProcessModuleSpecifier(moduleSpecifier) {
    return CHILD_PROCESS_MODULE_SPECIFIERS.has(moduleSpecifier);
}
function isScriptsDistReference(importPath) {
    const normalized = normalizeImportPath(importPath);
    return normalized.includes('scripts/dist/') || normalized.endsWith('scripts/dist') || normalized.startsWith('@spec-kit/scripts/dist');
}
function isScriptsSourceReference(importPath) {
    const normalized = normalizeImportPath(importPath);
    if (normalized.startsWith('@spec-kit/scripts'))
        return true;
    return normalized.includes('/scripts/') || normalized.startsWith('scripts/');
}
function isProhibitedForShared(importPath, sourceFilePath, packageRoot) {
    const normalizedImportPath = normalizeImportPath(importPath);
    const isProhibitedPackageImport = SHARED_PROHIBITED_PACKAGE_PREFIXES.some((prefix) => {
        return normalizedImportPath === prefix || normalizedImportPath.startsWith(`${prefix}/`);
    });
    if (isProhibitedPackageImport)
        return true;
    if (path.isAbsolute(importPath)) {
        const resolvedAbsolutePath = path.resolve(importPath);
        return (isWithinDirectory(resolvedAbsolutePath, path.join(packageRoot, 'mcp_server')) ||
            isWithinDirectory(resolvedAbsolutePath, path.join(packageRoot, 'scripts')));
    }
    if (!normalizedImportPath.startsWith('.'))
        return false;
    const resolvedImportPath = path.resolve(path.dirname(sourceFilePath), normalizedImportPath);
    return (isWithinDirectory(resolvedImportPath, path.join(packageRoot, 'mcp_server')) ||
        isWithinDirectory(resolvedImportPath, path.join(packageRoot, 'scripts')));
}
function extractModuleSpecifiers(content, filePath) {
    const sourceFile = typescript_1.default.createSourceFile(filePath, content, typescript_1.default.ScriptTarget.Latest, true, typescript_1.default.ScriptKind.TS);
    const hits = [];
    function pushHit(moduleSpecifier) {
        if (!isStringLiteralLike(moduleSpecifier))
            return;
        const { line } = sourceFile.getLineAndCharacterOfPosition(moduleSpecifier.getStart(sourceFile));
        hits.push({ importPath: moduleSpecifier.text, line: line + 1 });
    }
    function visit(node) {
        if (typescript_1.default.isImportDeclaration(node) && node.moduleSpecifier) {
            pushHit(node.moduleSpecifier);
        }
        if (typescript_1.default.isExportDeclaration(node) && node.moduleSpecifier) {
            pushHit(node.moduleSpecifier);
        }
        if (typescript_1.default.isImportEqualsDeclaration(node) && typescript_1.default.isExternalModuleReference(node.moduleReference) && node.moduleReference.expression) {
            pushHit(node.moduleReference.expression);
        }
        if (typescript_1.default.isImportTypeNode(node) && typescript_1.default.isLiteralTypeNode(node.argument) && isStringLiteralLike(node.argument.literal)) {
            pushHit(node.argument.literal);
        }
        if (typescript_1.default.isCallExpression(node) && node.arguments.length > 0) {
            const firstArg = node.arguments[0];
            const isRequireCall = typescript_1.default.isIdentifier(node.expression) && node.expression.text === 'require';
            const isDynamicImport = node.expression.kind === typescript_1.default.SyntaxKind.ImportKeyword;
            if ((isRequireCall || isDynamicImport) && isStringLiteralLike(firstArg)) {
                const { line } = sourceFile.getLineAndCharacterOfPosition(firstArg.getStart(sourceFile));
                hits.push({ importPath: firstArg.text, line: line + 1 });
            }
        }
        typescript_1.default.forEachChild(node, visit);
    }
    visit(sourceFile);
    return hits;
}
function countSubstantiveLines(content) {
    const lines = content.split('\n');
    let count = 0;
    let inBlockComment = false;
    for (const line of lines) {
        if (inBlockComment) {
            if (line.indexOf('*/') !== -1)
                inBlockComment = false;
            continue;
        }
        const openIdx = line.indexOf('/*');
        if (openIdx !== -1) {
            const closeIdx = line.indexOf('*/', openIdx + 2);
            if (closeIdx === -1) {
                inBlockComment = true;
                continue;
            }
        }
        const trimmed = line.trim();
        if (trimmed === '' || trimmed.startsWith('//'))
            continue;
        count++;
    }
    return count;
}
function collectWrapperSignals(content, filePath) {
    const sourceFile = typescript_1.default.createSourceFile(filePath, content, typescript_1.default.ScriptTarget.Latest, true, typescript_1.default.ScriptKind.TS);
    const childProcessCallableBindings = new Set();
    const childProcessNamespaceBindings = new Set();
    let hasChildProcessImport = false;
    let hasChildProcessSpawnExecUsage = false;
    let hasScriptsDistReference = false;
    let hasScriptsSourceReference = false;
    function markPathReference(rawPath) {
        if (!rawPath.includes('/') && !rawPath.includes('@spec-kit'))
            return;
        if (isScriptsSourceReference(rawPath))
            hasScriptsSourceReference = true;
        if (isScriptsDistReference(rawPath))
            hasScriptsDistReference = true;
    }
    function registerChildProcessImportClause(importClause) {
        if (!importClause)
            return;
        if (importClause.name) {
            childProcessNamespaceBindings.add(importClause.name.text);
        }
        const namedBindings = importClause.namedBindings;
        if (!namedBindings)
            return;
        if (typescript_1.default.isNamespaceImport(namedBindings)) {
            childProcessNamespaceBindings.add(namedBindings.name.text);
            return;
        }
        for (const element of namedBindings.elements) {
            const importedName = element.propertyName?.text ?? element.name.text;
            if (CHILD_PROCESS_WRAPPER_APIS.has(importedName)) {
                childProcessCallableBindings.add(element.name.text);
            }
        }
    }
    function registerChildProcessRequireBinding(name) {
        if (typescript_1.default.isIdentifier(name)) {
            childProcessNamespaceBindings.add(name.text);
            return;
        }
        if (!typescript_1.default.isObjectBindingPattern(name))
            return;
        for (const element of name.elements) {
            if (!typescript_1.default.isIdentifier(element.name))
                continue;
            const importedName = element.propertyName && typescript_1.default.isIdentifier(element.propertyName)
                ? element.propertyName.text
                : element.name.text;
            if (CHILD_PROCESS_WRAPPER_APIS.has(importedName)) {
                childProcessCallableBindings.add(element.name.text);
            }
        }
    }
    function isRequireCall(node) {
        return typescript_1.default.isIdentifier(node.expression) && node.expression.text === 'require';
    }
    function markSpawnExecUsage(node) {
        const expression = node.expression;
        if (typescript_1.default.isIdentifier(expression) && childProcessCallableBindings.has(expression.text)) {
            hasChildProcessSpawnExecUsage = true;
            return;
        }
        if (!typescript_1.default.isPropertyAccessExpression(expression))
            return;
        if (!typescript_1.default.isIdentifier(expression.expression))
            return;
        if (!childProcessNamespaceBindings.has(expression.expression.text))
            return;
        if (CHILD_PROCESS_WRAPPER_APIS.has(expression.name.text)) {
            hasChildProcessSpawnExecUsage = true;
        }
    }
    function visit(node) {
        if (isStringLiteralLike(node)) {
            markPathReference(node.text);
        }
        if (typescript_1.default.isImportDeclaration(node) && isStringLiteralLike(node.moduleSpecifier)) {
            const moduleSpecifier = node.moduleSpecifier.text;
            markPathReference(moduleSpecifier);
            if (isChildProcessModuleSpecifier(moduleSpecifier)) {
                hasChildProcessImport = true;
                registerChildProcessImportClause(node.importClause);
            }
        }
        if (typescript_1.default.isImportEqualsDeclaration(node) && typescript_1.default.isExternalModuleReference(node.moduleReference) && node.moduleReference.expression && isStringLiteralLike(node.moduleReference.expression)) {
            const moduleSpecifier = node.moduleReference.expression.text;
            markPathReference(moduleSpecifier);
            if (isChildProcessModuleSpecifier(moduleSpecifier)) {
                hasChildProcessImport = true;
                childProcessNamespaceBindings.add(node.name.text);
            }
        }
        if (typescript_1.default.isVariableDeclaration(node) && node.initializer && typescript_1.default.isCallExpression(node.initializer) && isRequireCall(node.initializer) && node.initializer.arguments.length > 0 && isStringLiteralLike(node.initializer.arguments[0])) {
            const moduleSpecifier = node.initializer.arguments[0].text;
            markPathReference(moduleSpecifier);
            if (isChildProcessModuleSpecifier(moduleSpecifier)) {
                hasChildProcessImport = true;
                registerChildProcessRequireBinding(node.name);
            }
        }
        if (typescript_1.default.isCallExpression(node)) {
            if (isRequireCall(node) && node.arguments.length > 0 && isStringLiteralLike(node.arguments[0])) {
                const moduleSpecifier = node.arguments[0].text;
                markPathReference(moduleSpecifier);
                if (isChildProcessModuleSpecifier(moduleSpecifier)) {
                    hasChildProcessImport = true;
                }
            }
            if (node.expression.kind === typescript_1.default.SyntaxKind.ImportKeyword && node.arguments.length > 0 && isStringLiteralLike(node.arguments[0])) {
                markPathReference(node.arguments[0].text);
            }
            markSpawnExecUsage(node);
        }
        typescript_1.default.forEachChild(node, visit);
    }
    visit(sourceFile);
    return {
        substantiveLines: countSubstantiveLines(content),
        hasChildProcessImport,
        hasChildProcessSpawnExecUsage,
        hasScriptsDistReference,
        hasScriptsSourceReference,
    };
}
// ───────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────
function checkSharedNeutrality(packageRoot = PACKAGE_ROOT) {
    const resolvedRoot = resolveCheckRoot(packageRoot);
    const sharedDir = path.join(resolvedRoot, 'shared');
    const tsFiles = findTsFiles(sharedDir);
    const violations = [];
    for (const file of tsFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        const moduleSpecifiers = extractModuleSpecifiers(content, file);
        for (const specifier of moduleSpecifiers) {
            if (isProhibitedForShared(specifier.importPath, file, resolvedRoot)) {
                violations.push({ file, line: specifier.line, importPath: specifier.importPath });
            }
        }
    }
    return violations;
}
function checkWrapperOnly(packageRoot = PACKAGE_ROOT) {
    const resolvedRoot = resolveCheckRoot(packageRoot);
    const wrappersDir = path.join(resolvedRoot, 'mcp_server', 'scripts');
    const violations = [];
    if (!fs.existsSync(wrappersDir))
        return violations;
    // Non-recursive scan — only top-level wrappers, not nested dirs
    const entries = fs.readdirSync(wrappersDir, { withFileTypes: true });
    for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith('.ts') || entry.name.endsWith('.d.ts'))
            continue;
        const fullPath = path.join(wrappersDir, entry.name);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const reasons = [];
        const signals = collectWrapperSignals(content, fullPath);
        if (signals.substantiveLines > MAX_SUBSTANTIVE_LINES) {
            reasons.push(`${signals.substantiveLines} substantive lines (max ${MAX_SUBSTANTIVE_LINES})`);
        }
        if (!signals.hasChildProcessImport) {
            reasons.push('missing child_process import');
        }
        if (!signals.hasChildProcessSpawnExecUsage) {
            reasons.push('no child_process spawn/exec usage');
        }
        if (!signals.hasScriptsDistReference) {
            reasons.push('no reference to scripts/dist/');
        }
        if (signals.hasScriptsSourceReference && !signals.hasScriptsDistReference) {
            reasons.push('references scripts/ without scripts/dist/');
        }
        if (reasons.length > 0) {
            violations.push({ file: fullPath, reasons });
        }
    }
    return violations;
}
function runArchitectureBoundaryCheck(packageRoot = PACKAGE_ROOT) {
    const resolvedRoot = resolveCheckRoot(packageRoot);
    const gapAViolations = checkSharedNeutrality(resolvedRoot);
    const gapBViolations = checkWrapperOnly(resolvedRoot);
    return { gapAViolations, gapBViolations };
}
// ───────────────────────────────────────────────────────────────
// 6. MAIN
// ───────────────────────────────────────────────────────────────
function main() {
    const { gapAViolations, gapBViolations } = runArchitectureBoundaryCheck();
    const resolvedRoot = resolveCheckRoot(PACKAGE_ROOT);
    let failed = false;
    if (gapAViolations.length > 0) {
        failed = true;
        console.error(`GAP A FAILED: shared/ neutrality — ${gapAViolations.length} violation(s):\n`);
        for (const v of gapAViolations) {
            const relPath = path.relative(resolvedRoot, v.file);
            console.error(`  ${relPath}:${v.line} → ${v.importPath}`);
        }
        console.error('\nFix: shared/ must not import from mcp_server/ or scripts/. Use only external packages or peer shared/ modules.\n');
    }
    if (gapBViolations.length > 0) {
        failed = true;
        console.error(`GAP B FAILED: mcp_server/scripts/ wrapper-only — ${gapBViolations.length} violation(s):\n`);
        for (const v of gapBViolations) {
            const relPath = path.relative(resolvedRoot, v.file);
            console.error(`  ${relPath}: ${v.reasons.join('; ')}`);
        }
        console.error('\nFix: mcp_server/scripts/ files must be thin wrappers (≤50 lines, child_process import, scripts/dist/ reference).\n');
    }
    if (failed) {
        process.exit(1);
    }
    console.log('Architecture boundary check passed: shared/ neutrality OK, mcp_server/scripts/ wrappers OK.');
    process.exit(0);
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=check-architecture-boundaries.js.map