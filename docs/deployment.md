# Deployment (OHAMS-21)

Target: **Vercel**, deployed from the `main` branch of this repo.

**Production URL:** https://sepm-two.vercel.app

## Steps

1. Vercel → *Add New Project* → import `nithinj25/sepm`. Vercel reads [`vercel.json`](../vercel.json): no build step, serves `frontend/`.
2. Production branch = `main`. Every pull request gets its own preview URL.
3. Create a managed PostgreSQL database (Neon / Supabase free tier) and run [`docs/design/schema.sql`](design/schema.sql).
4. Add environment variables in Vercel (names in [`.env.example`](../.env.example)). Never commit real values.
5. Seed demo data: one admin, two departments, two doctors.
6. Smoke test on the live URL: log in as doctor → mark an appointment done → edit availability → log in as admin → add a doctor.
7. Put the live URL in the README.

## Environment variables

| Variable | Used for |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Signing login tokens |
| `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` | Sending notifications |
| `FRONTEND_URL` | Allowed origin for CORS |

The current demo build is static and uses mock data, so steps 3–5 apply once the backend (OHAMS-3) is connected.

## Status

| Step | Status |
|---|---|
| `vercel.json` and `.env.example` in repo | Done |
| Environment variables in Vercel | Not needed yet – the static demo reads none; add the `.env.example` names when the backend is connected |
| Vercel project created and linked | Done – project `sepm`, Git-connected to `main` |
| Database provisioned | Not needed for the demo build (mock data); schema ready in `docs/design/schema.sql` for when the backend is connected |
| Smoke test on live URL | Done – login, doctor dashboard (mark done, availability), role guard, admin dashboard; no console errors |
