# LTW — Architecture (Authoritative Reference)

## 1. Purpose
Dette dokument er den tekniske sandhed for systemet. Hvis kode og docs divergerer → denne doc vinder.

---

## 2. System Type
LTW er et:
- real-time multiplayer system
- server-authoritative simulation engine
- event-driven distributed backend
- live-operated service

---

## 3. Core Invariants (MÅ IKKE BRYDES)
1.  **Server is authoritative**
2.  **Simulation is deterministic**
3.  **No DB access in hot path**
4.  **All side effects are async** (workers)
5.  **All critical flows are observable**
6.  **All systems must be reversible** (rollback)

---

## 4. End-to-End Flow
```
Client Input → Gateway (auth + validation) → Game Server (tick simulation) → Redis (events) → Workers (async side effects) → Postgres (persistence) → Metrics/Logs → Orchestration (control)
```

---

## 5. Game Server (Core)

### Responsibilities
- input validation
- simulation
- state authority
- broadcasting state

### Tick Loop
```ts
tick():
  inputs = readInputs()
  validated = validate(inputs)
  state = simulate(validated)
  broadcast(state)
```

### Constraints
- **NO** async
- **NO** DB calls
- **NO** external dependencies
- **ONLY** pure logic + in-memory state

---

## 6. Determinism Model
Required for:
- replay system
- anti-cheat
- debugging

### Rules
- RNG must be seeded
- no `Date.now()`
- no `Math.random()`
- input order must be stable

---

## 7. Event System (Redis)

### Pattern
- emit event
- process async

### Example
```ts
emit("MATCH_COMPLETED", payload)
```

### Guarantees
- at-least-once delivery
- must be idempotent

---

## 8. Worker Layer

### Responsibilities
- economy updates
- persistence
- analytics
- anti-cheat

### Rules
- idempotent jobs
- retry-safe
- side effects isolated

---

## 9. Data Layer (Postgres)
Source of Truth

### Key Tables
- players
- matches
- replays
- wallets
- metrics

### Rules
- indexed queries only
- batch writes preferred
- no hot-path writes

---

## 10. Replay System

### Model
```ts
Replay { seed inputs[] }
```

### Guarantee
Same input → same output

---

## 11. Observability

### Logging
- structured JSON
- include `matchId`, `playerId`

### Metrics
- latency (p95/p99)
- error rate
- match throughput
- economy flow

### Tracing
- request → worker → DB

---

## 12. Orchestration Layer

### Responsibilities
- monitor system health
- trigger scaling
- enforce economy limits
- enable kill switches

### Example
```ts
if (errorRate > 0.05) rollback()
if (economyInflation > 0.2) clampRewards()
```

---

## 13. Multi-Region Strategy

### Principles
- route by latency
- isolate state per region
- minimal global sync

### Failure Mode
Region down → reroute traffic

---

## 14. Deployment Model
- Kubernetes
- blue/green deploy
- instant rollback

---

## 15. Failure Strategy

### Expected Failures
- Redis disconnect
- DB latency
- pod crashes

### Response
- retry
- degrade
- recover

---

## 16. Anti-Patterns (FORBUDT)
- DB calls in simulation
- client-trusted logic
- non-deterministic code
- hidden side effects

---

## 17. Final Rule
Hvis du er i tvivl:
→ beskyt determinisme
→ beskyt observability
→ beskyt rollback

Ellers bryder systemet.
