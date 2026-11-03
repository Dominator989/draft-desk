# DraftDesk

A small tool that helps a tradie or small business turn a customer enquiry into a
ready-to-send quote or reply in seconds, and keeps every job in one place.

The owner pastes in an enquiry ("Hi, after a price to re-do the deck, about 20sqm,
Ormeau"), and DraftDesk uses an LLM to draft a professional reply they can tweak and
send. Each enquiry is tracked through simple stages: **New → Quoted → Won → Done**.

> Built to kill the most annoying part of running a small trade business: writing the
> same quotes and replies over and over.

## Why it exists

Small operators lose hours every week writing quotes and chasing which job is at what
stage. Existing CRMs are bloated and expensive. DraftDesk does one job well and runs
for almost nothing.

## Features (MVP)

- Log an incoming enquiry (customer, contact, job details)
- One-click AI draft of a quote/reply, editable before sending
- Track each job through New → Quoted → Won → Done
- Everything stored locally in a single database file — no server bill

## Tech stack

| Layer    | Choice             | Why |
|----------|--------------------|-----|
| Backend  | Node.js + Express  | Small footprint, fast to build |
| Database | SQLite (better-sqlite3) | Relational, zero hosting cost, one file |
| AI       | Anthropic API (Claude Haiku) | Cheapest model that drafts well |
| Frontend | Plain HTML/JS      | No build step; keeps it simple |

Deliberately boring and cheap to run. Postgres + a hosted frontend are the obvious
upgrade path once there are real users.

## Running it locally

```bash
npm install
cp .env.example .env     # then add your Anthropic API key
npm run init-db          # creates the database and tables
npm run dev              # starts the server on http://localhost:3000
```

## Architecture

```
Browser (web/index.html)
      │  fetch
      ▼
Express API (src/server.js)
      ├── /api/enquiries        CRUD + status  (src/routes/enquiries.js)
      └── /api/enquiries/:id/draft  → draft service (src/services/draft.js)
                                              │
                                              ▼
                                     Anthropic API
      │
      ▼
SQLite database (db/draftdesk.db)
```

## Roadmap

- [ ] Multiple users / login
- [ ] Save business details so drafts match the owner's tone and pricing
- [ ] Email/SMS the draft straight from the app
- [ ] Deploy to a hosted environment

## Status

Early build — first working version in progress. See the roadmap for what's next.
