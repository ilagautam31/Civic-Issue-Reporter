# Civic Issue Reporter — Interview Prep Guide

## 30-second pitch (memorize this)
"I built a full-stack platform where citizens can report local civic issues like
potholes or garbage with a photo and location. I integrated an AI classification
layer that automatically categorizes each report and assigns a priority — so
instead of a human manually triaging hundreds of reports, high-priority safety
issues surface immediately. It's a MERN stack app with JWT auth, role-based
access for citizens vs admins, and a REST API I designed myself."

## Why I built this (have a real answer ready)
Talk about the real problem: unorganized civic complaint systems, no
transparency on status, no prioritization — most municipal complaint systems
are either phone calls or forms nobody tracks.

## Architecture decisions you should be able to explain

**Why MongoDB over SQL?**
Reports have a flexible-ish structure (optional image, optional address) and
the app is read-heavy on the feed (lots of GET /reports), so a document model
maps naturally to a "report" as one JSON object. If asked "when would you pick
SQL instead," a good answer: if you needed strong relational integrity across
many linked tables (e.g. multi-department workflows, audit trails with joins),
Postgres would be a better fit.

**Why JWT instead of sessions?**
Stateless — no server-side session store needed, scales horizontally more
easily since any backend instance can verify a token without shared session
storage. Trade-off: harder to instantly revoke a token before it expires
(a session store makes revocation trivial).

**Why the two indexes on Report (`{status, priority}` and `{lat, lng}`)?**
The admin dashboard's most common query is "give me open reports sorted by
priority" — that's exactly `{status, priority}`. The location index is for
future "reports near me" geo-queries. Indexes trade write speed / storage for
read speed — worth it here because reads (viewing the feed) vastly outnumber
writes (submitting a report).

**How does the AI integration actually work?**
When a report is created, the backend sends the title + description to an LLM
with a structured prompt asking for JSON output (category, priority, one-line
reasoning). This is called **prompt engineering** — I'm not training a model,
I'm using an existing model with a carefully designed prompt and parsing its
structured output. Be ready to explain: what happens if the AI call fails
(fallback defaults, so the report still gets created — never let an external
API failure break your core flow), and why I asked for a "reasoning" field
(transparency — a user or admin can see *why* something got flagged high
priority, which matters for trust in an automated system).

**Why store `aiReasoning` at all?**
Explainability. If a citizen's report gets marked "low priority" and they
disagree, there's a stated reason, not a black box. Good practice for any
system making automated decisions about people.

**How does auth/role-based access work?**
JWT is issued at login/register, stored in localStorage on the frontend,
attached via an Axios interceptor to every request's Authorization header.
Backend middleware (`protect`) verifies the token and attaches the user to
`req.user`; a second middleware (`adminOnly`) checks `req.user.role` before
allowing access to admin-only routes (like updating report status).

**How does image upload work?**
Multer middleware handles multipart/form-data on the backend, storing files
to disk with a unique filename and validating file type/size. In production
I'd move this to cloud storage (S3/Cloudinary) instead of local disk, since
local storage doesn't survive redeploys on most hosting platforms — good to
mention this as a known limitation if asked "how would you improve this."

## Likely theory questions to prep alongside this project
- Explain REST principles / what makes an API RESTful
- Difference between PUT and PATCH (I used PATCH for partial updates — status,
  upvote)
- What is middleware in Express, and how does it work (I use it for auth,
  file upload, error handling)
- SQL vs NoSQL trade-offs
- How does JWT work internally (header.payload.signature, how verification
  works without a database lookup)
- What's the N+1 query problem, and does this app have that risk (the
  `.populate("reportedBy")` call, why it's used)
- How would you scale this if traffic spiked 100x (caching the feed, indexing,
  moving image storage off local disk, rate limiting the AI API calls since
  those cost money per call)

## Honest weaknesses to be ready for (don't get caught off guard)
- No pagination on the reports feed yet — fine to admit, and say how you'd add
  it (`limit`/`skip` or cursor-based pagination)
- No rate limiting on report submission (could be spammed) — mention you'd add
  `express-rate-limit`
- Local file storage for images — not production-durable, would move to S3/Cloudinary
- No tests written — if asked, be honest, say you'd add Jest/Supertest for the
  API given more time

Being upfront about known gaps, with a clear idea of how you'd fix them, reads
as *more* senior than pretending the project is perfect.
