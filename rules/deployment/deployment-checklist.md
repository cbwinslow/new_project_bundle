# Deployment Checklist Rules

**Category:** Deployment  
**Tags:** #deployment #production #checklist #release

## Description

Pre-deployment checklist to ensure safe and successful releases.

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests pass in CI/CD
- [ ] Code review approved
- [ ] No merge conflicts
- [ ] Linter passes with no errors
- [ ] Security scan completed
- [ ] Performance tests pass

### Documentation
- [ ] CHANGELOG.md updated
- [ ] API documentation updated
- [ ] README updated (if needed)
- [ ] Migration guides written (for breaking changes)
- [ ] Runbook updated

### Configuration
- [ ] Environment variables documented
- [ ] Secrets rotated (if needed)
- [ ] Feature flags configured
- [ ] Database migrations tested
- [ ] Configuration files updated

### Testing
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Load testing completed (for major changes)
- [ ] Security testing completed
- [ ] Tested in staging environment

### Monitoring & Alerts
- [ ] Monitoring dashboards ready
- [ ] Alerts configured
- [ ] Log aggregation working
- [ ] Error tracking enabled
- [ ] Performance monitoring active

### Rollback Plan
- [ ] Rollback procedure documented
- [ ] Database rollback plan ready
- [ ] Previous version tagged
- [ ] Backup completed
- [ ] Team notified of deployment

### Communication
- [ ] Stakeholders notified
- [ ] Maintenance window scheduled (if needed)
- [ ] User communication prepared
- [ ] Support team briefed
- [ ] Post-deployment verification plan

## Deployment Process

1. **Pre-deployment**
   - Run checklist above
   - Create deployment ticket
   - Schedule deployment window

2. **During Deployment**
   - Monitor logs in real-time
   - Watch error rates
   - Check key metrics
   - Verify health checks

3. **Post-deployment**
   - Smoke test critical paths
   - Verify metrics are normal
   - Check error logs
   - Monitor for 24 hours
   - Close deployment ticket

## Emergency Procedures

### If Issues Found
1. Assess severity
2. Attempt quick fix if minor
3. Rollback if critical
4. Communicate status
5. Post-mortem after resolution

### Rollback Triggers
- Critical functionality broken
- Error rate spike >10%
- Performance degradation >50%
- Security vulnerability exposed
- Data corruption detected

## Examples

### Good Deployment
```bash
# 1. Verify staging
./scripts/verify-staging.sh

# 2. Run deployment
./scripts/deploy.sh production

# 3. Smoke tests
./scripts/smoke-test.sh production

# 4. Monitor
./scripts/monitor-deployment.sh --duration 30m
```

### Deployment Notes Template
```
## Deployment v2.3.0

Date: 2024-01-15 14:00 UTC
Deployer: @username

### Changes
- Feature: New user dashboard
- Fix: Login redirect issue
- Perf: Optimized database queries

### Risks
- Database migration may take 5 minutes
- Cache will be cleared

### Rollback Plan
git checkout v2.2.1 && ./scripts/deploy.sh production

### Verification
- [ ] Login works
- [ ] Dashboard loads
- [ ] API response times normal
```

## Benefits
- Fewer production incidents
- Faster issue detection
- Clearer rollback path
- Better team coordination
- Reduced downtime
