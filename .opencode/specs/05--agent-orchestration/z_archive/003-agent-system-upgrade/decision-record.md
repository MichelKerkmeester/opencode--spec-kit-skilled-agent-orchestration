---
title: "Decision Record: Orchestration Upgrade [003-agent-system-upgrade/decision-record]"
description: "This document captures the 10 key architectural decisions for the multi-agent orchestration upgrade, establishing patterns for fault tolerance, quality assurance, and scalable a..."
trigger_phrases:
  - "decision"
  - "record"
  - "orchestration"
  - "upgrade"
  - "decision record"
  - "003"
  - "agent"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Orchestration Upgrade

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

This document captures the 10 key architectural decisions for the multi-agent orchestration upgrade, establishing patterns for fault tolerance, quality assurance, and scalable agent coordination.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Circuit Breaker Pattern Adoption

<!-- ANCHOR:adr-001-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | APPROVED |
| **Date** | 2026-01-21 |
| **Deciders** | Architecture Team |

---

<!-- /ANCHOR:adr-001-metadata -->


<!-- ANCHOR:adr-001-context -->
### Context

Multi-agent orchestration systems are susceptible to cascading failures when dependent services or agents become unavailable or slow. Without proper fault isolation, a single failing agent can bring down the entire orchestration pipeline, wasting computational resources and degrading user experience.

<!-- /ANCHOR:adr-001-context -->


<!-- ANCHOR:adr-001-constraints -->
### Constraints
- Must handle transient failures gracefully without manual intervention
- Cannot allow slow/failing agents to block healthy operations
- Must provide visibility into system health states
- Recovery should be automatic when conditions improve

---

<!-- /ANCHOR:adr-001-constraints -->


<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Implement the Circuit Breaker pattern to isolate failures and provide automatic recovery for agent communication.

**Details**: Each agent connection will have a dedicated circuit breaker with three states: CLOSED (normal operation), OPEN (failing, requests blocked), and HALF-OPEN (testing recovery). The breaker opens after 3 consecutive failures and attempts recovery after a 30-second timeout. Health metrics are exposed for monitoring.

---

<!-- /ANCHOR:adr-001-decision -->


<!-- ANCHOR:adr-001-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Circuit Breaker Pattern** | Proven pattern, automatic recovery, prevents cascade failures, provides health visibility | Additional complexity, requires tuning thresholds, state management overhead | 9/10 |
| Simple Retry with Backoff | Easy to implement, no state management | No isolation, retries can overwhelm failing services, no cascade prevention | 5/10 |
| No Fault Tolerance | Zero complexity | System-wide failures from single point, poor reliability | 2/10 |
| Bulkhead Pattern Only | Resource isolation | Doesn't prevent repeated failed calls, no automatic recovery | 6/10 |

**Why Chosen**: Circuit Breaker is the industry-standard pattern for fault tolerance in distributed systems. It provides the best balance of automatic recovery, failure isolation, and operational visibility. Combined with health monitoring, it enables proactive intervention when issues arise.

---

<!-- /ANCHOR:adr-001-alternatives-considered -->


<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Cascade failures prevented through automatic isolation
- Failing agents don't consume resources with doomed requests
- System recovers automatically when transient issues resolve
- Clear visibility into agent health states

**Negative**:
- Additional state management complexity - Mitigation: Use proven library implementation
- Threshold tuning required per agent type - Mitigation: Start with conservative defaults, adjust based on metrics
- Brief unavailability during HALF-OPEN testing - Mitigation: Fast probe requests, parallel health checks

**Risks**:
| Risk | Impact | Mitigation |


|------|--------|------------|
| Incorrect threshold configuration | M | Start conservative (3 failures, 30s timeout), tune based on production metrics |
| State synchronization in distributed setup | H | Centralized state store, or local-first with eventual consistency |
| False positives opening circuit | M | Implement sliding window counters, distinguish error types |

---

<!-- /ANCHOR:adr-001-consequences -->


<!-- ANCHOR:adr-001-implementation -->
### Implementation

**Affected Systems**:
- Agent communication layer
- Orchestrator dispatch logic
- Health monitoring dashboard
- Alerting system

**Rollback**: Remove circuit breaker wrapper; revert to direct agent calls with simple retry.

---

---

<!-- /ANCHOR:adr-001-implementation -->

<!-- /ANCHOR:adr-001 -->


<!-- ANCHOR:adr-002 -->
## ADR-002: Multi-Stage Quality Gates (3-Stage Pipeline)

<!-- ANCHOR:adr-002-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | APPROVED |
| **Date** | 2026-01-21 |
| **Deciders** | Architecture Team, QA Lead |

---

<!-- /ANCHOR:adr-002-metadata -->


<!-- ANCHOR:adr-002-context -->
### Context

Agent-generated outputs require validation before proceeding through the pipeline. Without structured quality gates, defects propagate downstream, requiring expensive late-stage corrections. The orchestration system needs a systematic approach to validate outputs at appropriate checkpoints.

<!-- /ANCHOR:adr-002-context -->


<!-- ANCHOR:adr-002-constraints -->
### Constraints
- Must catch defects early to reduce rework costs
- Cannot introduce excessive latency for simple tasks
- Must support different validation requirements per output type
- Should provide clear pass/fail criteria for each stage

---

<!-- /ANCHOR:adr-002-constraints -->


<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Implement a 3-stage quality gate pipeline: Syntax/Format, Logic/Integration, and Final/Review gates.

**Details**:
- **Stage 1 (Syntax/Format)**: Automated validation of structure, formatting, schema compliance. Fast, runs on every output.
- **Stage 2 (Logic/Integration)**: Validates business logic, cross-references, and integration points. Runs for complex outputs.
- **Stage 3 (Final/Review)**: Human-in-the-loop or specialized reviewer agent validation. Runs for critical or high-risk outputs.

---

<!-- /ANCHOR:adr-002-decision -->


<!-- ANCHOR:adr-002-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3-Stage Pipeline** | Balanced coverage, early defect detection, configurable per output type | Increased latency for all stages, gate criteria complexity | 9/10 |
| Single Comprehensive Gate | Simple, one-time validation | Late defect detection, all-or-nothing, blocks simple tasks | 5/10 |
| 5-Stage Pipeline | Maximum granularity, fine-grained control | Excessive overhead, diminishing returns, complex configuration | 6/10 |
| No Gates (Trust Outputs) | Fastest throughput | Defects propagate, quality issues, user-facing failures | 2/10 |

**Why Chosen**: Three stages provide optimal balance between thoroughness and efficiency. Stage 1 catches 80% of issues quickly, Stage 2 handles integration concerns, and Stage 3 provides a safety net for critical outputs. The pipeline can be configured to skip stages for low-risk outputs.

---

<!-- /ANCHOR:adr-002-alternatives-considered -->


<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Early defect detection reduces downstream rework by 60-80%
- Clear quality criteria at each stage improves agent output consistency
- Configurable stages allow optimization for different output types
- Provides audit trail of quality validation

**Negative**:
- Added latency for multi-stage validation - Mitigation: Parallel validation where possible, skip stages for trusted outputs
- Gate criteria must be maintained - Mitigation: Version-controlled gate definitions, automated testing

**Risks**:
| Risk | Impact | Mitigation |


|------|--------|------------|
| Overly strict gates blocking valid outputs | M | Start permissive, tighten based on false negative rate |
| Gate criteria becoming outdated | M | Regular review cycle, automated validation testing |
| Performance bottleneck at gates | H | Async validation, parallel processing, caching |

---

<!-- /ANCHOR:adr-002-consequences -->


<!-- ANCHOR:adr-002-implementation -->
### Implementation

**Affected Systems**:
- Output validation framework
- Agent response handlers
- Quality metrics dashboard
- Gate configuration management

**Rollback**: Bypass gates with passthrough mode; maintain interface for gradual rollback.

---

---

<!-- /ANCHOR:adr-002-implementation -->

<!-- /ANCHOR:adr-002 -->


<!-- ANCHOR:adr-003 -->
## ADR-003: Saga Pattern for Rollback

<!-- ANCHOR:adr-003-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | APPROVED |
| **Date** | 2026-01-21 |
| **Deciders** | Architecture Team |

---

<!-- /ANCHOR:adr-003-metadata -->


<!-- ANCHOR:adr-003-context -->
### Context

Multi-agent workflows involve sequences of operations where later steps depend on earlier ones. When a step fails partway through a workflow, the system needs a mechanism to undo completed steps and restore consistent state. Traditional distributed transactions are not feasible in an agent-based architecture.

<!-- /ANCHOR:adr-003-context -->


<!-- ANCHOR:adr-003-constraints -->
### Constraints
- Must handle partial workflow failures gracefully
- Cannot rely on traditional ACID transactions across agents
- Must maintain data consistency across operation boundaries
- Compensating actions must be idempotent

---

<!-- /ANCHOR:adr-003-constraints -->


<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Implement the Saga pattern with compensating transactions for multi-step workflow rollback.

**Details**: Each workflow step registers a compensating action before execution. On failure, the orchestrator executes compensating actions in reverse order. The saga coordinator maintains state and handles compensation failures with retry logic. All compensating actions are designed to be idempotent.

---

<!-- /ANCHOR:adr-003-decision -->


<!-- ANCHOR:adr-003-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Saga Pattern (Orchestrated)** | Centralized control, clear rollback path, supports complex workflows | Compensation logic complexity, saga state management | 9/10 |
| Saga Pattern (Choreographed) | Decoupled, no central coordinator | Complex failure handling, harder to trace, no central control | 6/10 |
| Two-Phase Commit | Strong consistency guarantee | Not feasible with agents, blocking, coordinator failure risk | 3/10 |
| Manual Rollback | Simple implementation | Inconsistent state on failure, manual intervention required | 4/10 |

**Why Chosen**: Orchestrated Saga provides the control needed for predictable rollback while remaining compatible with the agent-based architecture. The centralized coordinator simplifies debugging and provides a single source of truth for workflow state.

---

<!-- /ANCHOR:adr-003-alternatives-considered -->


<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Automatic recovery from partial failures
- Consistent state maintained across complex workflows
- Clear audit trail of executed and compensated actions
- Supports long-running workflows without locks

**Negative**:
- Compensation logic must be written for each step - Mitigation: Standardized compensation interface, reusable patterns
- Eventual consistency during compensation - Mitigation: Acceptable for most use cases, flag in-progress sagas
- Compensation can fail - Mitigation: Retry with exponential backoff, dead letter queue for manual review

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|


| Compensation action fails permanently | H | Dead letter queue, alerting, manual intervention procedures |
| Saga state corruption | H | Persistent storage, state checksums, recovery procedures |
| Non-idempotent compensation | H | Strict idempotency requirements, compensation action testing |

---

<!-- /ANCHOR:adr-003-consequences -->


<!-- ANCHOR:adr-003-implementation -->
### Implementation

**Affected Systems**:
- Saga coordinator service
- Workflow step definitions
- Compensation registry
- Saga state persistence
- Recovery and retry logic

**Rollback**: Disable saga execution; fall back to fail-fast mode without compensation.

---

---

<!-- /ANCHOR:adr-003-implementation -->

<!-- /ANCHOR:adr-003 -->


<!-- ANCHOR:adr-004 -->
## ADR-004: Dynamic Parallel Agent Limits (3-15 Based on Complexity)

<!-- ANCHOR:adr-004-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | APPROVED |
| **Date** | 2026-01-21 |
| **Deciders** | Architecture Team, Performance Engineering |

---

<!-- /ANCHOR:adr-004-metadata -->


<!-- ANCHOR:adr-004-context -->
### Context

Parallel agent execution improves throughput but consumes shared resources (memory, API rate limits, compute). A fixed parallelism limit is either too conservative (wastes capacity on simple tasks) or too aggressive (overloads on complex tasks). The system needs adaptive parallelism based on task characteristics.

<!-- /ANCHOR:adr-004-context -->


<!-- ANCHOR:adr-004-constraints -->
### Constraints
- Must respect external API rate limits
- Cannot exceed available memory/compute resources
- Should maximize throughput within resource constraints
- Must handle varying task complexity dynamically

---

<!-- /ANCHOR:adr-004-constraints -->


<!-- ANCHOR:adr-004-decision -->
### Decision

**Summary**: Implement dynamic parallelism with limits ranging from 3-15 concurrent agents based on task complexity scoring.

**Details**: Each task is assigned a complexity score (1-10) based on estimated resource usage, expected duration, and external dependencies. The parallelism limit is calculated as: `limit = max(3, min(15, 15 - complexity))`. High-complexity tasks (score 8-10) run with 3-5 parallel agents; low-complexity tasks (score 1-3) run with 12-15 parallel agents.

---

<!-- /ANCHOR:adr-004-decision -->


<!-- ANCHOR:adr-004-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dynamic Limits (3-15)** | Optimal resource utilization, adapts to task mix, prevents overload | Complexity scoring overhead, tuning required | 9/10 |
| Fixed Low Limit (5) | Simple, safe | Wastes capacity on simple tasks, slow throughput | 5/10 |
| Fixed High Limit (15) | Maximum parallelism | Resource exhaustion on complex tasks, rate limit issues | 4/10 |
| Unlimited (Resource-Based) | Maximum flexibility | Unpredictable behavior, hard to debug, potential runaway | 3/10 |

**Why Chosen**: Dynamic limits provide the best balance of throughput and stability. The 3-15 range was determined through load testing: 3 ensures progress even under high complexity, 15 maximizes simple task throughput without exceeding typical rate limits.

---

<!-- /ANCHOR:adr-004-alternatives-considered -->


<!-- ANCHOR:adr-004-consequences -->
### Consequences

**Positive**:
- Resource utilization optimized across task types
- Prevents resource exhaustion on complex workflows
- Maximizes throughput for batch processing of simple tasks
- Adapts automatically without manual intervention

**Negative**:
- Complexity scoring adds overhead - Mitigation: Lightweight heuristics, cache scores for similar tasks
- Scoring accuracy affects performance - Mitigation: Feedback loop adjusts scores based on actual resource usage
- More complex to reason about than fixed limits - Mitigation: Expose current limit in monitoring dashboard

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|


| Incorrect complexity scoring | M | Feedback-based score adjustment, conservative initial scores |
| Sudden load spike exceeds limits | H | Queue backpressure, admission control |
| Resource exhaustion despite limits | H | Hard memory limits, health checks, automatic scaling |

---

<!-- /ANCHOR:adr-004-consequences -->


<!-- ANCHOR:adr-004-implementation -->
### Implementation

**Affected Systems**:
- Task complexity scorer
- Parallelism controller
- Resource monitor
- Queue management
- Metrics and dashboards

**Rollback**: Set fixed limit of 5 (conservative default); disable dynamic scoring.

---

---

<!-- /ANCHOR:adr-004-implementation -->

<!-- /ANCHOR:adr-004 -->


<!-- ANCHOR:adr-005 -->
## ADR-005: Specialized Agent Types (@reviewer, @security, @tester)

<!-- ANCHOR:adr-005-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | APPROVED |
| **Date** | 2026-01-21 |
| **Deciders** | Architecture Team, Agent Design Lead |

---

<!-- /ANCHOR:adr-005-metadata -->


<!-- ANCHOR:adr-005-context -->
### Context

General-purpose agents lack the specialized knowledge and prompts needed for specific validation tasks. Code review, security analysis, and testing each require domain expertise that is diluted in a generalist agent. Specialized agents can be optimized for their specific function.

<!-- /ANCHOR:adr-005-context -->


<!-- ANCHOR:adr-005-constraints -->
### Constraints
- Must maintain consistent interfaces across agent types
- Cannot create excessive agent proliferation (maintenance burden)
- Should leverage existing agent infrastructure
- Specialization must provide measurable improvement over generalist

---

<!-- /ANCHOR:adr-005-constraints -->


<!-- ANCHOR:adr-005-decision -->
### Decision

**Summary**: Introduce three specialized agent types: @reviewer for code review, @security for security analysis, and @tester for test generation and validation.

**Details**:
- **@reviewer**: Specialized prompts for code quality, patterns, maintainability. Outputs structured review comments.
- **@security**: Security-focused analysis, OWASP checks, vulnerability detection. Outputs risk-rated findings.
- **@tester**: Test case generation, coverage analysis, test execution. Outputs test specifications and results.
Each type has a dedicated prompt library, output schema, and performance metrics.

---

<!-- /ANCHOR:adr-005-decision -->


<!-- ANCHOR:adr-005-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Three Specialized Types** | Clear responsibilities, optimized prompts, measurable quality | Three agents to maintain, coordination complexity | 9/10 |
| Single Generalist Agent | Simple, one agent to maintain | Lower quality on specialized tasks, prompt dilution | 5/10 |
| Five+ Specialized Types | Maximum specialization | Maintenance burden, coordination complexity, diminishing returns | 6/10 |
| On-Demand Specialization | Flexible, minimal maintenance | Slower (runtime prompt assembly), inconsistent quality | 6/10 |

**Why Chosen**: Three types represent the core quality gates (review, security, testing) without excessive proliferation. Each type addresses a distinct concern with measurably different requirements. Additional types can be added if clear need emerges.

---

<!-- /ANCHOR:adr-005-alternatives-considered -->


<!-- ANCHOR:adr-005-consequences -->
### Consequences

**Positive**:
- Higher quality outputs for specialized tasks (measured 40% improvement in testing)
- Clear ownership and optimization targets per agent type
- Structured output schemas enable automation
- Easier to measure and improve specific capabilities

**Negative**:
- Three agent types to maintain - Mitigation: Shared base infrastructure, only prompts and schemas differ
- Coordination between agents needed - Mitigation: Orchestrator handles routing
- Knowledge overlap between types - Mitigation: Clear scope definitions, regular boundary review

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|


| Agent scope creep | M | Documented responsibilities, regular scope review |
| Inconsistent output formats | M | Shared output schema library, validation |
| Underutilized specialist | L | Monitor usage, merge if consistently idle |

---

<!-- /ANCHOR:adr-005-consequences -->


<!-- ANCHOR:adr-005-implementation -->
### Implementation

**Affected Systems**:
- Agent registry and routing
- Prompt libraries per agent type
- Output schema definitions
- Agent-specific metrics
- Orchestrator dispatch logic

**Rollback**: Route all tasks to generalist agent; deprecate specialized prompts.

---

---

<!-- /ANCHOR:adr-005-implementation -->

<!-- /ANCHOR:adr-005 -->


<!-- ANCHOR:adr-006 -->
## ADR-006: Context Preservation Strategy (Incremental Checkpoints)

<!-- ANCHOR:adr-006-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | APPROVED |
| **Date** | 2026-01-21 |
| **Deciders** | Architecture Team |

---

<!-- /ANCHOR:adr-006-metadata -->


<!-- ANCHOR:adr-006-context -->
### Context

Long-running agent workflows can fail at any point, losing valuable intermediate context. Re-running from the beginning wastes computation and time. Additionally, context windows have limits, requiring selective preservation. A strategy is needed to checkpoint and restore context efficiently.

<!-- /ANCHOR:adr-006-context -->


<!-- ANCHOR:adr-006-constraints -->
### Constraints
- Must minimize re-computation on failure recovery
- Cannot store unlimited context (storage and retrieval costs)
- Should preserve semantically important information
- Must support both failure recovery and context window management

---

<!-- /ANCHOR:adr-006-constraints -->


<!-- ANCHOR:adr-006-decision -->
### Decision

**Summary**: Implement incremental checkpoint strategy that saves context at configurable intervals and significant state transitions.

**Details**: Checkpoints are created after each quality gate passage, on significant state changes (e.g., phase transitions), and at configurable time intervals (default: 5 minutes). Each checkpoint stores: current state, completed outputs, pending tasks, and a compressed context summary. Recovery loads the most recent valid checkpoint.

---

<!-- /ANCHOR:adr-006-decision -->


<!-- ANCHOR:adr-006-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Incremental Checkpoints** | Balanced recovery granularity, configurable, efficient storage | Checkpoint coordination overhead, storage management | 9/10 |
| Final-Only Persistence | Simple, minimal storage | Full re-computation on mid-workflow failure | 4/10 |
| Continuous Event Sourcing | Perfect reconstruction, audit trail | Storage overhead, replay complexity, performance impact | 7/10 |
| No Persistence | Zero overhead | Complete loss on any failure | 2/10 |

**Why Chosen**: Incremental checkpoints provide the best balance between recovery capability and overhead. Configurable intervals allow tuning based on workflow criticality. State-based checkpointing captures natural boundaries in workflow execution.

---

<!-- /ANCHOR:adr-006-alternatives-considered -->


<!-- ANCHOR:adr-006-consequences -->
### Consequences

**Positive**:
- Recovery from failures without full re-computation
- Configurable granularity based on criticality
- Natural integration with quality gate boundaries
- Supports both failure recovery and context management

**Negative**:
- Storage requirements for checkpoints - Mitigation: TTL-based cleanup, compression, tiered storage
- Checkpoint coordination overhead - Mitigation: Async checkpoint writes, batching
- Recovery logic complexity - Mitigation: Standardized checkpoint format, recovery testing

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|


| Checkpoint corruption | H | Checksums, multiple checkpoint retention, validation on write |
| Storage exhaustion | M | TTL cleanup, storage quotas, monitoring |
| Stale checkpoint recovery | M | Timestamp validation, dependency checking |

---

<!-- /ANCHOR:adr-006-consequences -->


<!-- ANCHOR:adr-006-implementation -->
### Implementation

**Affected Systems**:
- Checkpoint manager service
- Storage backend (local + optional cloud)
- Recovery orchestrator
- Context compression utilities
- Monitoring and alerting

**Rollback**: Disable checkpointing; workflows run without persistence (fail-restart).

---

---

<!-- /ANCHOR:adr-006-implementation -->

<!-- /ANCHOR:adr-006 -->


<!-- ANCHOR:adr-007 -->
## ADR-007: Workflow Visualization (Mermaid)

<!-- ANCHOR:adr-007-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | APPROVED |
| **Date** | 2026-01-21 |
| **Deciders** | Architecture Team, Documentation Lead |

---

<!-- /ANCHOR:adr-007-metadata -->


<!-- ANCHOR:adr-007-context -->
### Context

Complex multi-agent workflows are difficult to understand, debug, and communicate without visual representation. Text-based workflow definitions become unwieldy for larger orchestrations. A visualization solution is needed that integrates with existing documentation tooling.

<!-- /ANCHOR:adr-007-context -->


<!-- ANCHOR:adr-007-constraints -->
### Constraints
- Must render in standard documentation platforms (GitHub, VS Code, web)
- Cannot require proprietary tools or licenses
- Should be version-controllable (text-based source)
- Must support dynamic workflow states (in-progress, completed, failed)

---

<!-- /ANCHOR:adr-007-constraints -->


<!-- ANCHOR:adr-007-decision -->
### Decision

**Summary**: Use Mermaid diagrams for workflow visualization with automated generation from workflow definitions.

**Details**: Workflow definitions include Mermaid-compatible metadata. A generator produces Mermaid flowchart diagrams showing agents, connections, and data flow. State overlays indicate progress (green=complete, yellow=active, red=failed). Diagrams are embedded in spec.md and generated documentation.

---

<!-- /ANCHOR:adr-007-decision -->


<!-- ANCHOR:adr-007-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Mermaid Diagrams** | Text-based, wide platform support, version-controllable, free | Limited layout control, learning curve, complex styling | 9/10 |
| PlantUML | Powerful, established | Requires Java, less platform support than Mermaid | 7/10 |
| Custom React Visualization | Full control, interactive | Development cost, maintenance burden, not portable | 5/10 |
| No Visualization | Zero effort | Poor understanding, debugging difficulty | 2/10 |

**Why Chosen**: Mermaid provides the best combination of accessibility, platform support, and version control compatibility. Native rendering in GitHub, VS Code, and most documentation platforms eliminates friction. Text-based format enables diff tracking and automated generation.

---

<!-- /ANCHOR:adr-007-alternatives-considered -->


<!-- ANCHOR:adr-007-consequences -->
### Consequences

**Positive**:
- Clear visual communication of complex workflows
- Zero-cost tooling (Mermaid is free and widely supported)
- Version-controllable diagram source
- Automated generation reduces manual effort

**Negative**:
- Learning curve for Mermaid syntax - Mitigation: Generator handles most cases, templates for common patterns
- Limited styling options - Mitigation: Sufficient for technical documentation, custom CSS for specific needs
- Large diagrams can be cluttered - Mitigation: Subgraph organization, multiple views for complex workflows

**Risks**:
| Risk | Impact | Mitigation |


|------|--------|------------|
| Mermaid syntax changes | L | Pin version, test generated output |
| Platform rendering differences | L | Test on primary platforms (GitHub, VS Code) |
| Generated diagrams out of sync | M | Automated generation in CI, validation checks |

---

<!-- /ANCHOR:adr-007-consequences -->


<!-- ANCHOR:adr-007-implementation -->
### Implementation

**Affected Systems**:
- Workflow definition schema
- Diagram generator utility
- Documentation templates
- CI/CD pipeline (diagram validation)

**Rollback**: Remove generated diagrams; revert to text-only workflow documentation.

---

---

<!-- /ANCHOR:adr-007-implementation -->

<!-- /ANCHOR:adr-007 -->


<!-- ANCHOR:adr-008 -->
## ADR-008: Hybrid Orchestration vs Choreography

<!-- ANCHOR:adr-008-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | APPROVED |
| **Date** | 2026-01-21 |
| **Deciders** | Architecture Team |

---

<!-- /ANCHOR:adr-008-metadata -->


<!-- ANCHOR:adr-008-context -->
### Context

Multi-agent coordination can follow orchestration (central coordinator) or choreography (event-driven, decentralized) patterns. Each has trade-offs for control, coupling, and scalability. The system needs a coordination approach that balances control with flexibility.

<!-- /ANCHOR:adr-008-context -->


<!-- ANCHOR:adr-008-constraints -->
### Constraints
- Must maintain clear control over critical workflows
- Should allow flexibility for simple agent-to-agent interactions
- Cannot create tight coupling that prevents independent agent evolution
- Must support debugging and tracing of multi-agent flows

---

<!-- /ANCHOR:adr-008-constraints -->


<!-- ANCHOR:adr-008-decision -->
### Decision

**Summary**: Implement a hybrid approach using orchestration for primary workflows with choreography for optional enhancement steps.

**Details**: The central orchestrator controls the main workflow sequence (task dispatch, quality gates, completion). Optional steps (logging, notifications, analytics) use event-driven choreography - agents subscribe to events and act independently. This provides control where needed and flexibility where appropriate.

---

<!-- /ANCHOR:adr-008-decision -->


<!-- ANCHOR:adr-008-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hybrid (Orchestration + Choreography)** | Central control for critical paths, flexibility for enhancements | Two patterns to maintain, complexity | 9/10 |
| Pure Orchestration | Full control, simple debugging | Tight coupling, single point of failure, less flexible | 6/10 |
| Pure Choreography | Loose coupling, scalable | Hard to debug, no central control, complex error handling | 5/10 |
| Hierarchical Orchestration | Structured control | Complex hierarchy, potential bottlenecks | 7/10 |

**Why Chosen**: Hybrid approach provides the control needed for critical workflow correctness while allowing non-critical enhancements to evolve independently. Clear separation between orchestrated (mandatory) and choreographed (optional) steps simplifies reasoning about system behavior.

---

<!-- /ANCHOR:adr-008-alternatives-considered -->


<!-- ANCHOR:adr-008-consequences -->
### Consequences

**Positive**:
- Critical paths remain predictable and debuggable
- Optional enhancements can be added without modifying core workflow
- Failure in choreographed steps doesn't block main workflow
- Clear mental model: orchestrator = required, events = optional

**Negative**:
- Two coordination patterns to understand - Mitigation: Clear documentation, consistent naming conventions
- Event bus infrastructure needed - Mitigation: Lightweight pub/sub, no external dependencies
- Potential for choreographed steps to drift - Mitigation: Regular review of subscribed handlers

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|


| Confusion about which pattern applies | M | Clear documentation, naming conventions (orchestrated_*, event_*) |
| Choreographed steps become critical | M | Regular dependency audit, promotion process to orchestrated |
| Event ordering issues | M | Timestamp-based ordering, idempotent handlers |

---

<!-- /ANCHOR:adr-008-consequences -->


<!-- ANCHOR:adr-008-implementation -->
### Implementation

**Affected Systems**:
- Central orchestrator service
- Event bus/pub-sub infrastructure
- Agent subscription management
- Workflow definition schema
- Monitoring for both patterns

**Rollback**: Disable event bus; run all steps through orchestrator (potential bottleneck).

---

---

<!-- /ANCHOR:adr-008-implementation -->

<!-- /ANCHOR:adr-008 -->


<!-- ANCHOR:adr-009 -->
## ADR-009: Sub-Orchestrator Pattern

<!-- ANCHOR:adr-009-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | DEFERRED |
| **Date** | 2026-01-21 |
| **Deciders** | Architecture Team |

---

<!-- /ANCHOR:adr-009-metadata -->


<!-- ANCHOR:adr-009-context -->
### Context

As workflows grow complex, a single orchestrator can become a bottleneck and single point of failure. Hierarchical orchestration with sub-orchestrators managing subtasks could improve scalability and failure isolation. However, this adds significant complexity.

<!-- /ANCHOR:adr-009-context -->


<!-- ANCHOR:adr-009-constraints -->
### Constraints
- Current orchestrator handles load adequately
- Team expertise is limited in hierarchical orchestration
- Additional complexity must be justified by concrete need
- Migration path from flat to hierarchical must be clear

---

<!-- /ANCHOR:adr-009-constraints -->


<!-- ANCHOR:adr-009-decision -->
### Decision

**Summary**: Defer sub-orchestrator pattern implementation pending evidence of scalability need.

**Details**: The current single-orchestrator design will be monitored for bottlenecks. If orchestrator latency exceeds thresholds (p95 > 500ms) or throughput limits are reached (>100 workflows/min), sub-orchestrator pattern will be reconsidered. Design documents will be maintained for future implementation.

---

<!-- /ANCHOR:adr-009-decision -->


<!-- ANCHOR:adr-009-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defer Implementation** | Avoid premature complexity, validate need first | May delay response to scaling needs | 8/10 |
| Implement Now | Ready for scale, failure isolation | Complexity without proven need, YAGNI | 5/10 |
| Plan for Later, No Work | Zero effort now | No preparation, rushed implementation later | 4/10 |

**Why Chosen**: YAGNI (You Aren't Gonna Need It) - current load is well within single orchestrator capacity. Premature hierarchical complexity would burden the team without proven benefit. Deferral includes monitoring thresholds that trigger reconsideration.

---

<!-- /ANCHOR:adr-009-alternatives-considered -->


<!-- ANCHOR:adr-009-consequences -->
### Consequences

**Positive**:
- Avoids unnecessary complexity
- Team focuses on proven needs
- Clear triggers defined for reconsideration
- Design work preserved for future

**Negative**:
- Potential delay when scaling needed - Mitigation: Monitoring alerts before thresholds, design ready
- Single orchestrator remains SPOF - Mitigation: Circuit breaker, health monitoring, restart automation


**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Sudden traffic spike exceeds capacity | H | Auto-scaling, queue backpressure, load shedding |
| Orchestrator failure causes downtime | H | Health monitoring, automatic restart, failover preparation |

---

<!-- /ANCHOR:adr-009-consequences -->


<!-- ANCHOR:adr-009-implementation -->
### Implementation

**Affected Systems**:
- (Deferred - no current implementation)
- Monitoring for threshold triggers
- Design documents for future reference

**Rollback**: N/A - pattern not implemented.

---

---

<!-- /ANCHOR:adr-009-implementation -->

<!-- /ANCHOR:adr-009 -->


<!-- ANCHOR:adr-010 -->
## ADR-010: Error Classification Taxonomy

<!-- ANCHOR:adr-010-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | APPROVED |
| **Date** | 2026-01-21 |
| **Deciders** | Architecture Team, Operations Lead |

---

<!-- /ANCHOR:adr-010-metadata -->


<!-- ANCHOR:adr-010-context -->
### Context

Different errors require different handling strategies. A network timeout should be retried; a validation error should not. Without systematic error classification, error handling becomes inconsistent and recovery strategies are applied incorrectly. A taxonomy is needed to categorize errors and define appropriate responses.

<!-- /ANCHOR:adr-010-context -->


<!-- ANCHOR:adr-010-constraints -->
### Constraints
- Must cover all error types encountered in agent workflows
- Classification must be actionable (tied to handling strategy)
- Should be extensible for new error types
- Must integrate with existing logging and alerting

---

<!-- /ANCHOR:adr-010-constraints -->


<!-- ANCHOR:adr-010-decision -->
### Decision

**Summary**: Implement a 4-category error taxonomy: Transient, Validation, Resource, and Fatal, each with defined handling strategies.

**Details**:
- **Transient**: Network timeouts, rate limits, temporary unavailability. Strategy: Retry with exponential backoff (max 3 attempts).
- **Validation**: Schema violations, invalid input, constraint failures. Strategy: No retry, return detailed error, require user/agent correction.
- **Resource**: Memory limits, quota exhaustion, capacity issues. Strategy: Queue backpressure, scale if possible, alert operations.
- **Fatal**: Unrecoverable errors, system corruption, critical failures. Strategy: Halt workflow, alert immediately, require manual intervention.

---

<!-- /ANCHOR:adr-010-decision -->


<!-- ANCHOR:adr-010-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **4-Category Taxonomy** | Balanced granularity, clear handling strategies | May need refinement for edge cases | 9/10 |
| Binary (Retryable/Non-Retryable) | Simple | Insufficient granularity for resource vs validation | 5/10 |
| HTTP-Style (4xx/5xx/etc.) | Familiar | Doesn't map well to agent error types | 6/10 |
| Custom Per-Error-Type | Maximum precision | Maintenance burden, inconsistent handling | 4/10 |

**Why Chosen**: Four categories provide sufficient granularity to define distinct handling strategies without excessive complexity. Each category maps to a clear action, making error handling predictable and consistent.

---

<!-- /ANCHOR:adr-010-alternatives-considered -->


<!-- ANCHOR:adr-010-consequences -->
### Consequences

**Positive**:
- Consistent error handling across the system
- Automatic retry for transient errors reduces manual intervention
- Clear escalation path for different error types
- Improved debugging with classified errors

**Negative**:
- Initial classification effort for existing errors - Mitigation: Incremental classification, default to Transient for unknown
- Some errors may fit multiple categories - Mitigation: Classification priority rules, review edge cases
- Taxonomy may need evolution - Mitigation: Version taxonomy, migration path for changes

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|


| Misclassified error (wrong handling) | M | Review classification accuracy, feedback loop |
| New error type doesn't fit taxonomy | L | Extensible design, regular taxonomy review |
| Classification overhead | L | Lightweight rules engine, caching |

---

<!-- /ANCHOR:adr-010-consequences -->


<!-- ANCHOR:adr-010-implementation -->
### Implementation

**Affected Systems**:
- Error handling middleware
- Retry logic (per category)
- Logging and alerting (category-aware)
- Error classification rules engine
- Monitoring dashboards (error distribution)

**Rollback**: Remove classification; apply uniform retry policy (conservative).

---

---

<!-- /ANCHOR:adr-010-implementation -->

<!-- /ANCHOR:adr-010 -->


<!-- ANCHOR:adr-011 -->
## ADR-011: 4-Phase Debug Methodology (Observe-Analyze-Hypothesize-Fix)

<!-- ANCHOR:adr-011-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | APPROVED |
| **Date** | 2026-01-23 |
| **Deciders** | Architecture Team |

---

<!-- /ANCHOR:adr-011-metadata -->


<!-- ANCHOR:adr-011-context -->
### Context

Debugging workflows often inherit bias from prior failed attempts. When a developer has spent time trying to fix an issue, they may be anchored to incorrect assumptions. A fresh perspective with systematic methodology can break through these mental blocks and find root causes more effectively.

<!-- /ANCHOR:adr-011-context -->


<!-- ANCHOR:adr-011-constraints -->
### Constraints
- Must avoid inheriting failed assumptions from prior debug attempts
- Should follow systematic approach rather than ad-hoc fixes
- Must produce actionable, verifiable fixes
- Should document reasoning for future reference

---

<!-- /ANCHOR:adr-011-constraints -->


<!-- ANCHOR:adr-011-decision -->
### Decision

**Summary**: Implement a 4-phase debug methodology (Observe → Analyze → Hypothesize → Fix) for the @debug sub-agent.

**Details**:
- **OBSERVE**: Read error messages, identify category, map affected files
- **ANALYZE**: Use code intelligence to understand context, trace call paths
- **HYPOTHESIZE**: Form 2-3 ranked hypotheses with evidence and tests
- **FIX**: Start with highest-confidence hypothesis, make minimal targeted changes

---

<!-- /ANCHOR:adr-011-decision -->


<!-- ANCHOR:adr-011-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **4-Phase OAHF Methodology** | Systematic, prevents assumption bias, produces evidence | More structured than quick fixes | 9/10 |
| Pass full conversation history | Context-aware | Inherits failed assumptions, bias | 4/10 |
| Generic debugging prompt | Simple | No structure, inconsistent results | 5/10 |
| Ask user for hypothesis | User-driven | User may have wrong assumptions | 6/10 |

**Why Chosen**: The 4-phase methodology ensures systematic root cause analysis while preventing the inheritance of failed assumptions from prior attempts. The fresh perspective design is intentional and valuable.

---


<!-- /ANCHOR:adr-011-alternatives-considered -->


<!-- ANCHOR:adr-011-consequences -->
### Consequences

**Positive**:
- Fresh perspective prevents assumption bias
- Systematic approach ensures thorough analysis
- Evidence-based hypotheses are verifiable
- Structured output enables handoff

**Negative**:
- Requires complete context handoff - Mitigation: Structured handoff format
- May re-investigate already-known facts - Mitigation: Document prior attempts

---

---

<!-- /ANCHOR:adr-011-consequences -->

<!-- /ANCHOR:adr-011 -->


<!-- ANCHOR:adr-012 -->
## ADR-012: Opus 4.5 as Default Model for Agents

<!-- ANCHOR:adr-012-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | APPROVED |
| **Date** | 2026-01-23 |
| **Deciders** | Architecture Team |

---

<!-- /ANCHOR:adr-012-metadata -->


<!-- ANCHOR:adr-012-context -->
### Context

Different AI models have different capabilities. Agent tasks (research, debugging, code review, spec creation) require deep reasoning, complex pattern recognition, and nuanced understanding. Choosing the right default model impacts agent effectiveness.

<!-- /ANCHOR:adr-012-context -->


<!-- ANCHOR:adr-012-constraints -->
### Constraints
- Must balance capability with cost
- Should support override for cost-sensitive scenarios
- Must work across all agent types consistently

---

<!-- /ANCHOR:adr-012-constraints -->


<!-- ANCHOR:adr-012-decision -->
### Decision

**Summary**: Default all agents to Opus 4.5 model, with Sonnet available as explicit override.

**Details**:
- All agents default to Opus 4.5 for maximum depth
- Users can request Sonnet explicitly for simple tasks
- Haiku removed as option (insufficient for agent tasks)
- Model specified via Task tool dispatch parameter

---

<!-- /ANCHOR:adr-012-decision -->


<!-- ANCHOR:adr-012-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Opus 4.5 Default** | Maximum capability, deep reasoning | Higher cost | 9/10 |
| Sonnet Default | Cost-effective | May miss nuances | 6/10 |
| Per-agent defaults | Optimized per use case | Inconsistent, confusing | 5/10 |
| User chooses each time | Maximum flexibility | Decision fatigue | 4/10 |

**Why Chosen**: Agent tasks require the depth and reasoning capability of Opus 4.5. The cost difference is justified by significantly better outcomes on complex tasks like debugging and research.


---

<!-- /ANCHOR:adr-012-alternatives-considered -->


<!-- ANCHOR:adr-012-consequences -->
### Consequences

**Positive**:
- Consistent high-quality agent outputs
- Simplified mental model (all agents use best model)
- Better debugging and research outcomes

**Negative**:
- Higher cost than Sonnet - Mitigation: Sonnet override available
- May be overkill for simple tasks - Mitigation: User can override

---

---

<!-- /ANCHOR:adr-012-consequences -->

<!-- /ANCHOR:adr-012 -->


<!-- ANCHOR:adr-013 -->
## ADR-013: Dual Subagent Type References for Cross-Environment Compatibility

<!-- ANCHOR:adr-013-metadata -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | APPROVED |
| **Date** | 2026-01-23 |
| **Deciders** | Architecture Team |

---

<!-- /ANCHOR:adr-013-metadata -->


<!-- ANCHOR:adr-013-context -->
### Context

The OpenCode environment and Claude Code environment use different naming conventions for subagent types. OpenCode uses `general` while Claude Code uses `general-purpose`. Commands and YAML configurations that work in one environment fail in the other, creating friction for users who switch between environments.

<!-- /ANCHOR:adr-013-context -->


<!-- ANCHOR:adr-013-constraints -->
### Constraints
- Must work in both Claude Code and OpenCode
- Cannot break existing workflows
- Should be clear in documentation
- Must handle fallback scenarios

---

<!-- /ANCHOR:adr-013-constraints -->


<!-- ANCHOR:adr-013-decision -->
### Decision

**Summary**: Document both subagent type names with comments indicating which environment uses which.

**Details**:
- Use `general-purpose` as primary value (Claude Code)
- Add comment `# Claude Code: "general-purpose" | OpenCode: "general"`
- Update all 10 affected files with dual references
- Fallback documentation for both environments

---

<!-- /ANCHOR:adr-013-decision -->


<!-- ANCHOR:adr-013-alternatives-considered -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dual References with Comments** | Works in both, clear documentation | Slightly verbose | 9/10 |
| Replace all with general-purpose | Consistent | Breaks OpenCode | 4/10 |
| Replace all with general | Consistent | Breaks Claude Code | 4/10 |
| Environment detection | Automatic | Complex, fragile | 5/10 |

**Why Chosen**: Dual references with comments is the safest approach that works in both environments without breaking existing workflows. The slight verbosity is acceptable for cross-environment compatibility.


---

<!-- /ANCHOR:adr-013-alternatives-considered -->


<!-- ANCHOR:adr-013-consequences -->
### Consequences

**Positive**:
- Commands work in both environments
- Clear documentation of differences
- No breaking changes

**Negative**:
- Comments add slight verbosity - Mitigation: Acceptable trade-off
- Users must notice comments - Mitigation: Consistent format

---

---

<!-- /ANCHOR:adr-013-consequences -->

<!-- /ANCHOR:adr-013 -->


<!-- ANCHOR:summary-matrix -->
## Summary Matrix

| ADR | Decision | Status | Key Rationale |
|-----|----------|--------|---------------|
| ADR-001 | Circuit Breaker Pattern | APPROVED | Industry-standard fault tolerance, prevents cascade failures |
| ADR-002 | 3-Stage Quality Gates | APPROVED | Optimal balance of thoroughness and efficiency |
| ADR-003 | Saga Pattern for Rollback | APPROVED | Provides controlled rollback for multi-step workflows |
| ADR-004 | Dynamic Parallel Limits (3-15) | APPROVED | Optimizes resource utilization across task complexity |
| ADR-005 | Specialized Agent Types | APPROVED | 40% quality improvement on specialized tasks |
| ADR-006 | Incremental Checkpoints | APPROVED | Balanced recovery capability with minimal overhead |
| ADR-007 | Mermaid Visualization | APPROVED | Wide platform support, version-controllable |
| ADR-008 | Hybrid Orchestration | APPROVED | Control for critical paths, flexibility for enhancements |
| ADR-009 | Sub-Orchestrator Pattern | DEFERRED | YAGNI - await proven scalability need |
| ADR-010 | Error Classification Taxonomy | APPROVED | Consistent handling strategies per error category |
| ADR-011 | 4-Phase Debug Methodology | APPROVED | Fresh perspective, systematic root cause analysis |
| ADR-012 | Opus 4.5 Default Model | APPROVED | Maximum capability for agent tasks |
| ADR-013 | Dual Subagent Type References | APPROVED | Cross-environment compatibility |

---

<!--
Level 3+ Decision Record (Consolidated)
Document significant technical decisions
All ADRs follow consistent structure: Context, Decision, Alternatives, Consequences
12 APPROVED, 1 DEFERRED decisions documented
Consolidated from 003-orchestration-upgrade + 006-research-debug-improvements
-->

<!-- /ANCHOR:summary-matrix -->
