# Runbook Template 📓

> Operations runbook for incident response and system maintenance

## Document Information

| Field | Value |
|-------|-------|
| **Service** | [Service Name] |
| **Version** | 1.0.0 |
| **Last Updated** | YYYY-MM-DD |
| **Owner** | [Team/Person] |
| **On-Call** | [Rotation/Schedule] |

---

## Table of Contents

1. [Service Overview](#service-overview)
2. [Architecture](#architecture)
3. [Monitoring & Alerts](#monitoring--alerts)
4. [Common Incidents](#common-incidents)
5. [Operational Procedures](#operational-procedures)
6. [Emergency Contacts](#emergency-contacts)

---

## Service Overview

### Description

> [Brief description of the service and its purpose]

### Dependencies

| Dependency | Type | Critical | Notes |
|------------|------|----------|-------|
| PostgreSQL | Database | Yes | Primary data store |
| Redis | Cache | Yes | Session and cache |
| External API | Service | No | Feature X integration |

### SLAs

| Metric | Target | Alerting Threshold |
|--------|--------|-------------------|
| Availability | 99.9% | < 99.5% |
| Latency (p95) | < 200ms | > 500ms |
| Error Rate | < 0.1% | > 1% |

---

## Architecture

### System Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Load      │────▶│   App       │
│             │     │   Balancer  │     │   Servers   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌──────────────────────────┼──────────────┐
                    │                          │              │
               ┌────▼────┐              ┌──────▼─────┐  ┌─────▼─────┐
               │ Database │              │   Cache    │  │  Message  │
               │ (Primary)│              │  (Redis)   │  │   Queue   │
               └────┬────┘              └────────────┘  └───────────┘
                    │
               ┌────▼────┐
               │ Database │
               │ (Replica)│
               └─────────┘
```

### Key Components

| Component | Purpose | Health Check |
|-----------|---------|--------------|
| App Server | API handling | `GET /health` |
| Worker | Background jobs | Queue depth < 1000 |
| Database | Data persistence | Connections < 80% |
| Cache | Session/caching | Memory < 80% |

---

## Monitoring & Alerts

### Dashboards

| Dashboard | URL | Purpose |
|-----------|-----|---------|
| Main Dashboard | [Link] | Overview metrics |
| Error Dashboard | [Link] | Error analysis |
| Performance | [Link] | Latency & throughput |

### Key Metrics

| Metric | Query/Location | Normal Range |
|--------|---------------|--------------|
| Request Rate | `sum(rate(http_requests_total[5m]))` | 100-1000 req/s |
| Error Rate | `sum(rate(http_requests_total{status=~"5.."}[5m]))` | < 1 req/s |
| Latency p95 | `histogram_quantile(0.95, rate(http_duration_seconds_bucket[5m]))` | < 200ms |

### Alert Severity Levels

| Level | Response Time | Escalation |
|-------|--------------|------------|
| P1 - Critical | Immediate | Page on-call |
| P2 - High | 15 minutes | Page on-call |
| P3 - Medium | 1 hour | Slack notification |
| P4 - Low | Next business day | Email |

---

## Common Incidents

### INC-001: High Error Rate

**Symptoms:**

- Error rate > 1%
- 5xx responses increasing
- Alert: "High Error Rate"

**Diagnosis:**

- [ ] Check application logs: `kubectl logs -f deployment/app`
- [ ] Check error dashboard for patterns
- [ ] Verify database connectivity
- [ ] Check external service health

**Resolution Steps:**

1. [ ] Identify error pattern in logs
2. [ ] If database issue: [See Database section](#database-issues)
3. [ ] If memory issue: Scale or restart pods
4. [ ] If external service: Enable circuit breaker

**Commands:**

```bash
# Check logs
kubectl logs -f deployment/app --since=10m

# Check pod status
kubectl get pods -l app=myservice

# Restart deployment
kubectl rollout restart deployment/app
```

---

### INC-002: High Latency

**Symptoms:**

- Latency p95 > 500ms
- Slow response times reported
- Alert: "High Latency"

**Diagnosis:**

- [ ] Check database query times
- [ ] Check cache hit rate
- [ ] Check CPU/memory utilization
- [ ] Review recent deployments

**Resolution Steps:**

1. [ ] Check slow query log
2. [ ] Verify cache is functioning
3. [ ] Scale horizontally if CPU-bound
4. [ ] Rollback recent deployment if correlated

---

### INC-003: Database Issues

**Symptoms:**

- Connection errors
- Slow queries
- Replication lag

**Diagnosis:**

```bash
# Check connections
SELECT count(*) FROM pg_stat_activity;

# Check long-running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

# Check replication lag
SELECT client_addr, state, sent_lsn, write_lsn,
       (sent_lsn - write_lsn) AS lag
FROM pg_stat_replication;
```

**Resolution Steps:**

1. [ ] Kill long-running queries if safe
2. [ ] Increase connection pool if needed
3. [ ] Failover to replica if primary unhealthy
4. [ ] Contact DBA for further investigation

---

### INC-004: Out of Memory

**Symptoms:**

- OOMKilled pods
- Slow performance
- Alert: "Memory Critical"

**Diagnosis:**

```bash
# Check memory usage
kubectl top pods -l app=myservice

# Check for OOMKilled
kubectl describe pod <pod-name> | grep -A5 "Last State"
```

**Resolution Steps:**

1. [ ] Increase memory limits temporarily
2. [ ] Identify memory leak source
3. [ ] Scale horizontally
4. [ ] Investigate heap dumps

---

### INC-005: [Add Your Incident Type]

**Symptoms:**

- [Symptom 1]
- [Symptom 2]

**Diagnosis:**

- [ ] [Check 1]
- [ ] [Check 2]

**Resolution Steps:**

1. [ ] [Step 1]
2. [ ] [Step 2]

---

## Operational Procedures

### Deployment

```bash
# Deploy new version
kubectl set image deployment/app app=myapp:v1.2.3

# Watch rollout
kubectl rollout status deployment/app

# Rollback if needed
kubectl rollout undo deployment/app
```

### Scaling

```bash
# Scale horizontally
kubectl scale deployment/app --replicas=5

# Enable autoscaling
kubectl autoscale deployment/app --min=3 --max=10 --cpu-percent=70
```

### Database Maintenance

```bash
# Backup database
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > backup.sql

# Run migrations
./migrate up

# Vacuum analyze (schedule during low traffic)
VACUUM ANALYZE;
```

### Cache Operations

```bash
# Connect to Redis
redis-cli -h $REDIS_HOST

# Flush specific keys
redis-cli -h $REDIS_HOST KEYS "cache:*" | xargs redis-cli DEL

# Check memory usage
redis-cli -h $REDIS_HOST INFO memory
```

### Log Access

```bash
# Application logs
kubectl logs -f deployment/app --since=1h

# Search logs
kubectl logs deployment/app | grep ERROR

# Centralized logging
# [Link to Splunk/ELK/CloudWatch]
```

---

## Emergency Contacts

### Escalation Path

| Level | Contact | Method | Response Time |
|-------|---------|--------|---------------|
| L1 | On-Call Engineer | PagerDuty | 5 min |
| L2 | Team Lead | Phone | 15 min |
| L3 | Engineering Manager | Phone | 30 min |
| L4 | VP Engineering | Phone | 1 hour |

### Key Contacts

| Role | Name | Contact |
|------|------|---------|
| On-Call Schedule | [Link] | PagerDuty |
| Team Slack | #team-oncall | Slack |
| DBA | Database Team | #dba-support |
| Security | Security Team | security@example.com |

### External Contacts

| Service | Support | SLA |
|---------|---------|-----|
| AWS Support | [Case Portal] | Business (< 1hr for Urgent) |
| Database Vendor | support@vendor.com | 24/7 |

---

## Post-Incident

### Post-Incident Review Template

- [ ] Timeline created
- [ ] Root cause identified
- [ ] Impact assessed
- [ ] Action items assigned
- [ ] Runbook updated

### Checklist After Resolution

- [ ] Verify service is healthy
- [ ] Monitor for recurrence
- [ ] Notify stakeholders
- [ ] Create incident ticket
- [ ] Schedule post-mortem if P1/P2

---

**Last Review Date:** YYYY-MM-DD
**Next Review Date:** YYYY-MM-DD
