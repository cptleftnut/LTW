# LTW — Runbook (Production Operations)

## 1. Goal
Minimér downtime + beskyt economy + stabilisér hurtigt.

---

## 2. Priorities (ALWAYS)
1.  **Stop damage**
2.  **Restore service**
3.  **Diagnose**
4.  **Fix**

---

## 3. Severity Levels

### P0 — Critical
- system nede
- economy exploit
- matchmaking død
**ACTION**: immediate mitigation

### P1 — High
- høj error rate
- latency spikes

### P2 — Medium
- non-critical bugs

---

## 4. Immediate Actions (CHEAT SHEET)

### Stop matchmaking
```ts
disableMatchmaking()
```

### Disable rewards
```ts
setRewardMultiplier(0)
```

### Scale up
```bash
kubectl scale deployment ltw-server --replicas=10
```

### Rollback
```bash
kubectl patch service ltw-service \
  -p '{"spec":{"selector":{"version":"blue"}}}'
```

---

## 5. Incident Playbooks

### 🔴 High Error Rate
- Check recent deploy
- Rollback immediately
- Inspect logs

### 🔴 Latency Spike
- Check CPU/Memory metrics
- Scale up if necessary
- Check DB/Redis latency

---

## 6. Economy Protection
Hvis economy inflation stiger over 20%:
1.  Stop reward emission
2.  Analyze recent matches for exploits
3.  Apply fix
4.  Resume rewards gradvist

---

## 7. Communication
1.  Post status i Discord
2.  Notify stakeholders
3.  Post RCA (Root Cause Analysis) efter fix
