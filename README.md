# OHAMS – Online Hospital Appointment Management System

Allow patients to book appointments and doctors to manage their schedules.

**Live demo:** https://sepm-two.vercel.app (pick Doctor or Admin on the login page – mock data, no password)

Software Engineering & Project Management (SEPM) team project – BMSIT&M.

## Team

| Member | Area | Jira epic |
|---|---|---|
| Medha S Harish | Requirements, tech stack, patient-facing frontend | OHAMS-1, OHAMS-4 |
| Nithin J | System design, doctor/admin dashboards, deployment | OHAMS-2, OHAMS-6 |
| Ashish Sharma | Backend modules, API integration, testing | OHAMS-3, OHAMS-5 |
| Manya Sahgal | Project management deliverables, report | OHAMS-7 |

Project board: Jira project **OHAMS**.

## Repository layout

```
docs/
  design/        system design: ER diagram, schema, architecture, workflow, wireframes
  deployment.md  how the app is deployed to Vercel
frontend/        static demo UI (doctor and admin dashboards, mock data)
```

## Workflow

- One branch per Jira story: `feature/OHAMS-<id>-short-name`
- Every commit message starts with the Jira key (e.g. `OHAMS-28 Add ER diagram`) so it links to the ticket
- Branches are merged into `main` once the story's acceptance criteria are met

## Running the demo

Use the live demo above, or open `frontend/index.html` in a browser (no build step). Pick a role to see the doctor or admin dashboard. Data is mock data stored in the browser.
