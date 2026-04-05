---
title: Deployment Guide - CI/CD Workflows and Deployment Patterns
description: CI/CD workflows, versioning strategy, and deployment patterns for backend systems using GitHub Actions, ECR/S3 artifacts, and GitOps deployment.
---

# Deployment Guide - CI/CD Workflows and Deployment Patterns

CI/CD workflows, versioning strategy, and deployment patterns for backend systems using GitHub Actions, ECR/S3 artifacts, and GitOps deployment.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This document describes the deployment workflows and CI/CD patterns for backend systems using GitHub Actions. Understanding these patterns ensures proper release management and troubleshooting deployment issues.

### Progressive Disclosure

| If you need to... | Read section... |
|-------------------|-----------------|
| Deploy to development | 3 (Dev Workflow) |
| Deploy to production | 4 (Production Workflow) |
| Understand versioning | 5 (Version Tagging) |
| Troubleshoot failures | 9 (Troubleshooting) |
| Check deployment status | 7 (Deployment Checklist) |

### File Relationships

```
deployment.md (this file)
    ├── Workflow files → .github/workflows/
    ├── Makefile targets → Makefile, common.mk
    ├── Docker configs → misc/dockerfiles/
    └── Config files → misc/configs/, misc/envs/
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:build-system -->
## 2. BUILD SYSTEM

### Makefile Targets

```bash
# Build all microservices
make build-pipeline-ms

# Build all (MS + Lambdas + CLIs)
make build-pipeline

# Get microservice names for deployment
make get-ms-names

# Get CLI names for deployment
make get-cli-names

# Push Docker images
make push-ms-dockers ECR_REGISTRY=$REGISTRY
make push-cli-dockers ECR_REGISTRY=$REGISTRY
```

### Binary Output Structure

| Directory | Contents |
|-----------|----------|
| `bin_arm64/ms/` | ARM64 microservice binaries |
| `bin_arm64/lambdas/` | ARM64 lambda binaries |
| `bin_arm64/cli/` | ARM64 CLI binaries |
| `bin_amd64/` | AMD64 binaries (when needed) |

---

<!-- /ANCHOR:build-system -->
<!-- ANCHOR:development-workflow -->
## 3. DEVELOPMENT WORKFLOW

### How do I deploy to development?

**Trigger:** Create a tag matching `v[0-9]+.[0-9]+.[0-9]+-alpha.[0-9]+` or `v[0-9]+.[0-9]+.[0-9]+-beta.[0-9]+`

```bash
# Example
git tag v1.2.3-alpha.1
git push origin v1.2.3-alpha.1
```

**Workflow:** `.github/workflows/build-ms-dev.yaml`

**Pipeline Steps:**

| Step | Description | Command/Action |
|------|-------------|----------------|
| 1 | Checkout | Clone repository |
| 2 | Setup Go 1.24 | Install Go toolchain |
| 3 | Setup Bun | Install Bun runtime |
| 4 | Configure AWS | Setup AWS credentials for ECR/S3 |
| 5 | Login to ECR | Authenticate with AWS ECR |
| 6 | Parse MS Routes | `make parse-ms-routes` |
| 7 | Build | `make build-pipeline-ms` |
| 8 | Extract Version | Parse git tag |
| 9 | Get MS Names | `make get-ms-names` |
| 10 | Push to ECR | `make push-ms-dockers` |
| 11 | Upload to S3 | Copy ARM64 binaries |
| 12 | Deploy to Dev | Trigger GitOps workflow |

**Target Environment:** Development/Testing clusters

---

<!-- /ANCHOR:development-workflow -->
<!-- ANCHOR:production-workflow -->
## 4. PRODUCTION WORKFLOW

### How do I deploy to production?

**Trigger:** Create a tag matching `v[0-9]+.[0-9]+.[0-9]+` (semantic version, no suffix)

```bash
# Example
git tag v1.2.3
git push origin v1.2.3
```

**Workflow:** `.github/workflows/build-prod.yaml`

**Pipeline Steps:**

| Step | Description | Command/Action |
|------|-------------|----------------|
| 1 | Checkout | Clone repository |
| 2 | Setup Go 1.24 | Install Go toolchain |
| 3 | Setup Bun | Install Bun runtime |
| 4 | Configure AWS | Setup AWS credentials |
| 5 | Login to ECR | Authenticate with AWS ECR |
| 6 | Build Full Pipeline | `make build-pipeline` (MS + Lambdas + CLIs) |
| 7 | Extract Version | Parse git tag |
| 8 | Get MS Names | `make get-ms-names` |
| 9 | Get CLI Names | `make get-cli-names` |
| 10 | Push MS to ECR | `make push-ms-dockers` |
| 11 | Push CLI to ECR | `make push-cli-dockers` |
| 12 | Upload to S3 | Copy ARM64 binaries (lambdas + ms) |
| 13 | Deploy API Gateway | Trigger Terraform workflow |
| 14 | Deploy to Production | Trigger GitOps workflow |

**Target Environment:** Production clusters
**Runner:** Uses `ubuntu-latest-8-cores` for faster builds

### Staging (RC) Workflow

**Trigger:** Tags matching `v[0-9]+.[0-9]+.[0-9]+-rc.[0-9]+`

**Workflow:** `.github/workflows/build-ms.yaml`

Same as development but targets staging environment.

---

<!-- /ANCHOR:production-workflow -->
<!-- ANCHOR:version-tagging-strategy -->
## 5. VERSION TAGGING STRATEGY

### Version Format

| Environment | Pattern | Example |
|-------------|---------|---------|
| Development | `vX.Y.Z-alpha.N` | `v1.2.3-alpha.1` |
| Development | `vX.Y.Z-beta.N` | `v1.2.3-beta.2` |
| Staging | `vX.Y.Z-rc.N` | `v1.2.3-rc.1` |
| Production | `vX.Y.Z` | `v1.2.3` |

### How do I create a release?

```bash
# Development release
git tag v1.2.3-alpha.1
git push origin v1.2.3-alpha.1

# After testing, promote to RC
git tag v1.2.3-rc.1
git push origin v1.2.3-rc.1

# After staging validation, release to production
git tag v1.2.3
git push origin v1.2.3
```

### Version Extraction

The workflow extracts version from git ref:
```bash
VV=$(echo $GITHUB_REF | sed 's/refs\/tags\///')
echo "VERSION=$VV" >> $GITHUB_ENV
```

---

<!-- /ANCHOR:version-tagging-strategy -->
<!-- ANCHOR:docker-container-registry -->
## 6. DOCKER & CONTAINER REGISTRY

### ECR Image Naming

| Type | Pattern | Example |
|------|---------|---------|
| Microservices | `{ecr-registry}/ms_{name}:{version}` | `123456.dkr.ecr.eu-west-1.amazonaws.com/ms_core:v1.2.3` |
| CLIs | `{ecr-registry}/cli_{name}:{version}` | `123456.dkr.ecr.eu-west-1.amazonaws.com/cli_core:v1.2.3` |

### ECR Push Commands

```bash
# Login (handled by workflow)
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $REGISTRY

# Push images
make push-ms-dockers ECR_REGISTRY=${{ steps.login-ecr.outputs.registry }}
make push-cli-dockers ECR_REGISTRY=${{ steps.login-ecr.outputs.registry }}
```

---

<!-- /ANCHOR:docker-container-registry -->
<!-- ANCHOR:artifact-storage -->
## 7. ARTIFACT STORAGE

### S3 Bucket Structure

```
s3://{bucket}/{path}/{version}/
├── ms_core
├── ms_payments
├── ms_chat
├── lambda_webhook_handler
├── lambda_auth_handler
└── ...
```

### Upload Pattern

```bash
aws s3 cp ./bin_arm64/ms/ s3://$BUCKET/$PATH/$VERSION/ --recursive
aws s3 cp ./bin_arm64/lambdas/ s3://$BUCKET/$PATH/$VERSION/ --recursive
```

---

<!-- /ANCHOR:artifact-storage -->
<!-- ANCHOR:gitops-deployment -->
## 8. GITOPS DEPLOYMENT

### How does GitOps deployment work?

Deployment triggers a workflow in a separate GitOps repository:

```yaml
- name: Deploy to Dev MS
  uses: benc-uk/workflow-dispatch@v1
  with:
    workflow: Update Project List Version
    repo: example-org/gitops-development
    ref: main
    token: ${{ secrets.WORKFLOW_PAT }}
    inputs: '{
      "newVersion": "${{ env.VERSION }}",
      "projectNames": "${{ env.MS_NAMES_K8S }}",
      "updatesRoutes": "true"
    }'
```

### GitOps Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `newVersion` | Git tag version | `v1.2.3` |
| `projectNames` | Space-separated MS names | `ms_core ms_payments` |
| `updatesRoutes` | Update API Gateway routes | `true` / `false` |

### GitOps Repositories

| Environment | Repository |
|-------------|------------|
| Development | `example-org/gitops-development` |
| Staging | `example-org/gitops-staging` |
| Production | `example-org/gitops-production` |

### Production API Gateway

Production additionally triggers Terraform for API Gateway:

```yaml
- name: Deploy API Gateway Routes
  uses: benc-uk/workflow-dispatch@v1
  with:
    workflow: Update API Gateway Routes
    repo: example-org/terraform-apps-production
```

---

<!-- /ANCHOR:gitops-deployment -->
<!-- ANCHOR:deployment-checklist -->
## 9. DEPLOYMENT CHECKLIST

### Before Tagging Release

- [ ] All tests passing locally
- [ ] `sk-code-review` baseline completed (P0/P1 resolved or explicitly deferred with approval)
- [ ] Migrations tested (if any)
- [ ] Configuration changes documented
- [ ] Breaking changes communicated

### Development/Staging Deployment

- [ ] Create alpha/beta/rc tag
- [ ] Monitor GitHub Actions workflow
- [ ] Verify ECR images pushed
- [ ] Check S3 artifacts uploaded
- [ ] Verify GitOps deployment completed
- [ ] Test deployed services
- [ ] Check logs for errors

### Production Deployment

- [ ] Create production tag (`vX.Y.Z`)
- [ ] Monitor GitHub Actions workflow (8-core runner)
- [ ] Verify ECR images pushed (MS + CLI)
- [ ] Check S3 artifacts uploaded (MS + Lambdas)
- [ ] Verify Terraform workflow completed (API Gateway)
- [ ] Verify GitOps workflow completed (Kubernetes)
- [ ] Run smoke tests
- [ ] Monitor metrics and logs
- [ ] Rollback plan ready

---

<!-- /ANCHOR:deployment-checklist -->
<!-- ANCHOR:secrets-configuration -->
## 10. SECRETS & CONFIGURATION

### Required GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `APP_ARCHIVER_AWS_ACCESS_KEY_ID` | AWS access key for S3/ECR |
| `APP_ARCHIVER_AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `WORKFLOW_PAT` | GitHub PAT for cross-repo workflows |

### Required GitHub Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `APP_ARCHIVER_AWS_REGION` | AWS region | `eu-west-1` |
| `APP_ARCHIVER_BUCKET` | S3 bucket name | `app-artifacts` |
| `APP_ARCHIVER_PATH` | S3 path prefix | `binaries` |

---

<!-- /ANCHOR:secrets-configuration -->
<!-- ANCHOR:troubleshooting -->
## 11. TROUBLESHOOTING

### Build Failures

| Issue | Check |
|-------|-------|
| Go version mismatch | Ensure Go 1.24 |
| Bun installation fails | Check Bun setup action |
| Makefile target missing | Verify target exists |
| Dependencies fail | Run `go mod download` |

### ECR Push Failures

| Issue | Check |
|-------|-------|
| Authentication fails | AWS credentials configured |
| Repository not found | ECR repository exists |
| Region mismatch | Verify region configuration |
| Permission denied | IAM permissions |

### S3 Upload Failures

| Issue | Check |
|-------|-------|
| Access denied | Bucket permissions |
| Path not found | Path configuration |
| Empty upload | Binaries built successfully |

### GitOps Deployment Failures

| Issue | Check |
|-------|-------|
| Workflow not found | Workflow name correct |
| Auth fails | WORKFLOW_PAT token validity |
| Repository error | Target repo and ref |

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:maintenance-workflows -->
## 12. MAINTENANCE WORKFLOWS

### Additional Workflows

| Workflow | Purpose | Trigger |
|----------|---------|---------|
| `build-only.yaml` | Build without deployment | Manual / PR |
| `tests-only.yaml` | Run tests only | PR validation |
| `build-lambdas.yaml` | Build lambdas separately | Tag pattern |

### Running Build Locally

```bash
# Build all microservices
make build-pipeline-ms

# Build specific microservice
go build -o bin_arm64/ms/ms_core ./cmd/ms/ms_core/

# Build all lambdas
make build-pipeline-lambdas

# Run tests
go test ./...
```

---

<!-- /ANCHOR:maintenance-workflows -->
<!-- ANCHOR:rules -->
## 13. RULES

### ✅ ALWAYS

- Test locally before tagging
- Follow semantic versioning
- Wait for CI to complete before checking deployment
- Check logs after deployment
- Have a rollback plan for production
- Communicate breaking changes

### ❌ NEVER

- Push directly to production without staging validation
- Skip the version tagging strategy
- Ignore failing CI pipelines
- Deploy without monitoring
- Modify workflow files without `sk-code-review` baseline and explicit approval

### ⚠️ ESCALATE IF

- Production deployment fails
- Multiple services fail simultaneously
- Rollback doesn't work
- Secrets or credentials are compromised
- CI/CD infrastructure is unavailable

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 14. RELATED RESOURCES

| Topic | Document | Section |
|-------|----------|---------|
| Microservice architecture | [microservice_bootstrap_architecture.md](./microservice_bootstrap_architecture.md) | Bootstrap pattern |
| Configuration | [di_configuration.md](./di_configuration.md) | Config structure |
| Workflow files | `.github/workflows/` | YAML definitions |
| Docker setup | `misc/dockerfiles/` | Dockerfile templates |
<!-- /ANCHOR:related-resources -->
