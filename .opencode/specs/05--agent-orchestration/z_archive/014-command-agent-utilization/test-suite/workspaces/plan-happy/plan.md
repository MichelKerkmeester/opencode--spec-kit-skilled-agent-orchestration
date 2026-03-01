---
title: "Implementation Plan: JWT Authentication with RS256 Signing [plan-happy/plan]"
description: "This plan implements JWT authentication using RS256 asymmetric signing within the NestJS framework. The approach follows NestJS module conventions: a dedicated AuthModule encaps..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "jwt"
  - "authentication"
  - "with"
  - "happy"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: JWT Authentication with RS256 Signing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript 5.x, Node.js 20 |
| **Framework** | NestJS 10.x |
| **Storage** | In-memory Map (Phase 1), Redis (Phase 2) |
| **Testing** | Jest with supertest |

### Overview
This plan implements JWT authentication using RS256 asymmetric signing within the NestJS framework. The approach follows NestJS module conventions: a dedicated AuthModule encapsulating JwtService, AuthController, AuthGuard, and middleware. RS256 keys are loaded from environment configuration, tokens are signed server-side with the private key, and validated using the public key. Refresh token rotation ensures session security.

[SOURCE: NestJS Documentation - Authentication | https://docs.nestjs.com/security/authentication]

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)

---

## 3. ARCHITECTURE

### Pattern
Modular Monolith (NestJS Module-based architecture)

### Key Components
- **JwtService**: Core service handling token generation (sign), validation (verify), and refresh logic using RS256 keys
- **AuthController**: REST endpoints for /auth/login, /auth/refresh, /auth/logout
- **AuthGuard**: NestJS CanActivate guard that validates JWT from Authorization header
- **AuthMiddleware**: Express middleware that extracts and decodes JWT for request context
- **JwtConfig**: Configuration module loading RSA key pair from env/files

### Data Flow
1. Client sends credentials to POST /auth/login
2. AuthController validates credentials, calls JwtService.sign() to generate access + refresh tokens
3. Client includes access token in Authorization: Bearer header for subsequent requests
4. AuthGuard intercepts protected routes, calls JwtService.verify() with public key
5. On token expiry, client calls POST /auth/refresh with refresh token
6. JwtService validates refresh token, rotates it, issues new token pair

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Generate RSA key pair (RS256) for development
- [ ] Create AuthModule scaffold with NestJS CLI
- [ ] Configure jwt.config.ts with key loading from env
- [ ] Install dependencies: @nestjs/jwt, @nestjs/passport, passport-jwt

### Phase 2: Core Implementation
- [ ] Implement JwtService with sign(), verify(), refresh() methods
- [ ] Create AuthController with login, refresh, logout endpoints
- [ ] Implement AuthGuard with CanActivate interface
- [ ] Create AuthMiddleware for token extraction
- [ ] Define DTOs for login request and token response
- [ ] Implement refresh token rotation with in-memory store

### Phase 3: Verification
- [ ] Unit tests for JwtService (sign/verify/refresh/expiry)
- [ ] Integration tests for AuthController endpoints
- [ ] Manual testing of protected route rejection
- [ ] Edge case testing (expired tokens, malformed tokens, reused refresh tokens)
- [ ] Documentation updated (spec/plan/tasks marked complete)

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | JwtService sign/verify/refresh methods | Jest |
| Integration | AuthController login/refresh/logout endpoints | Jest + supertest |
| Manual | Full authentication flow, token expiry, protected routes | Postman / curl |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| @nestjs/jwt | External | Green | Cannot generate tokens - use jsonwebtoken directly as fallback |
| @nestjs/passport | External | Green | Cannot use passport strategies - implement custom guard |
| RSA Key Pair | Internal | Green | Generate during Phase 1 setup |
| User Entity/Service | Internal | Yellow | Need basic user lookup - can stub initially |

---

## 7. ROLLBACK PLAN

- **Trigger**: Auth module causes application startup failures or security vulnerability discovered
- **Procedure**: Remove AuthModule from app.module.ts imports, redeploy without auth (all routes become public)

---


---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                       ├──> Phase 2 (Core) ──> Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Medium | 4-6 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **7-11 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured (AUTH_ENABLED=true/false)
- [ ] Monitoring alerts set for 401/403 spike

### Rollback Procedure
1. Set AUTH_ENABLED=false in environment
2. Redeploy application (auth guard bypassed)
3. Verify all routes accessible without tokens
4. Notify team of auth rollback and timeline for fix

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - no database changes in Phase 1

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
