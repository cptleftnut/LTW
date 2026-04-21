# LTW — Line Tower Wars

## Overview
LTW er et real-time, server-authoritative multiplayer tower defense PvP spil designet til Discord. Systemet er bygget som en distribueret backend med:
- deterministisk simulation
- global matchmaking
- økonomi + progression
- live ops kontrol

---

## Core Principles
- **Server is truth** (no client trust)
- **Deterministic simulation** (replayable matches)
- **Short competitive sessions** (3–10 min)
- **Social-first** (Discord-native)
- **Observable + controllable system**

---

## Architecture
![System Diagram](system_diagram.png)

Client (Pixi / UI)
↓
Socket.io (real-time input)
↓
Game Server (authoritative)
↓
Redis (event bus + queue)
↓
Workers (async processing)
↓
Postgres (source of truth)
↓
Observability (logs + metrics)
↓
Orchestration (control layer)

---

## Tech Stack
- Node.js / TypeScript
- Socket.io
- Redis (ioredis + BullMQ)
- Postgres
- Docker + Kubernetes
- Prometheus + Grafana
- OpenTelemetry

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start services (local)
```bash
docker-compose up
```

### 3. Run server
```bash
npm run dev
```

### Environment Variables
```
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ltw
JWT_SECRET=secret
```

---

## Key Systems

### 🎮 Gameplay
- Tick-based simulation (~20 TPS)
- Server authoritative
- Input-driven

### 🎯 Matchmaking
- MMR-based
- Region-aware
- Queue expansion over time

### 💰 Economy
- Reward from performance
- Controlled via orchestration
- No infinite loops allowed

### 🧠 Identity
- Trust score system
- Anti-cheat integration

### 🔁 Replay System
- Stores seed + inputs
- Enables deterministic re-simulation

---

## Deployment

### Local
```bash
docker-compose up
```

### Kubernetes
```bash
kubectl apply -f k8s/
```

---

## Observability
- **Logs**: JSON (pino)
- **Metrics**: /metrics (Prometheus)
- **Tracing**: OpenTelemetry

---

## Live Ops Controls
Systemet understøtter:
- disable matchmaking
- adjust rewards
- rollback deploy
- kick players

---

## Non-Negotiable Rules
- Never trust the client
- Everything must be observable
- Everything must be reversible
- Economy must be controlled

---

## Status
🚧 **Active development**
🚀 **Production-ready architecture**

---

## Final Note
Dette er ikke bare et spil. Det er et live distribueret system. **Handle accordingly.**
