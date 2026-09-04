---
name: aetheris-security-guard
description: "Antigravity developer skill to audit, threat-model, and verify Google Cloud Run AI Challenge deployments."
---

# Aetheris Security Guard (Antigravity Agent Skill)

This skill provides automated security audits and TDD verification for the **Aetheris AI** application before deploying to Google Cloud Run.

## Audit Checklist:
1. **Zero-Hardcoding Check**:
   - Scans all files for patterns matching `AIzaSy[A-Za-z0-9_-]{33}` or raw API keys.
   - Verifies that `lib/secretManager.ts` dynamically resolves credentials from Google Cloud Secret Manager.
2. **Database Isolation Check**:
   - Verifies that all Firestore reads and writes are path-scoped to `/users/${uid}/*`.
   - Confirms that `config/firestore.rules` enforces `request.auth.uid == userId` and default-deny.
3. **OWASP LLM Defense Check**:
   - Verifies that `lib/threatDefense.ts` is invoked at the boundary of all API routes (`/api/journal/analyze`, `/api/journal/chat`).
4. **Cloud Run Verification Tag**:
   - Ensures `deploy-cloudrun.sh` contains `--update-labels=dev-tutorial=cloud-run-ai-challenge`.
