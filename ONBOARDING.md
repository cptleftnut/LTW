# LTW — Developer Onboarding

## Welcome
Du arbejder nu på LTW — et real-time multiplayer system. Dette er IKKE et normalt webprojekt.

Du arbejder med:
- distributed systems
- real-time simulation
- live ops

---

## Mental Model
Tænk i flows — ikke features:
`Client → Server → Queue → Worker → DB → Metrics`

---

## Første ting du SKAL forstå

### 1. Server is authoritative
- client input = forslag
- server = beslutning

### 2. Determinism
Alle matches skal kunne replayes:
- samme inputs
- samme seed → samme resultat

### 3. Event-driven architecture
Intet kalder hinanden direkte. Alt går via:
- Redis events
- job queues

---

## Folder Structure (example)
```
apps/
  server/ → API + Socket
  worker/ → async jobs
shared/ → db, redis, utils
```

---

## Hvordan du arbejder

### Tilføje feature:
1.  Definér event
2.  Emit event
3.  Worker håndterer event
4.  Persist i DB
5.  Tilføj metrics

### Debugging flow
1.  Find matchId
2.  Check logs
3.  Følg trace
4.  Replay match

---

## Golden Rules
- ingen side effects i simulation
- ingen random uden seed
- ingen DB writes i hot path (brug workers)
- ingen console.log (brug logger)

---

## Testing
Du skal kunne:
- køre replay
- simulere 100+ matches
- køre load test

---

## Når noget går galt
Spørg:
1.  er det deterministisk?
2.  er det observable?
3.  kan vi rollback?

---

## Deployment flow
1.  deploy green
2.  verify health
3.  switch traffic
4.  monitor
5.  rollback hvis nødvendigt

---

## Før du merger code
- virker det under load?
- bryder det economy?
- kan det misbruges?

---

## Final Advice
Hvis du er i tvivl:
→ gør det simpelt
→ gør det observable
→ gør det reversible

---

## Reminder
Du bygger ikke bare features. Du bygger et system der skal:
- overleve load
- overleve failure
- fungere live

**Handle accordingly.**
