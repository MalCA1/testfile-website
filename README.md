# Kids Sports Gear customer assistant

A responsive Kids Sports Gear coming-soon landing page with a customer Q&A assistant at the bottom. The original launch countdown, signup form, product details, and store features are shown above the assistant. The assistant is instructed to answer only from the business details below and to admit when the site does not confirm an answer.

## Confirmed information used by the assistant

- The store is for kids' sports gear that encourages active outdoor play.
- The launch copy names skipping ropes, agility ladders, and mini soccer goals.
- The launch copy describes sturdy, kid-friendly gear selected for backyard use.
- The launch copy says delivery will be available Australia-wide and tracked.
- The previous website copy set the launch date to 15 November 2026 at 9:00 AM Melbourne time.
- Stock, prices, delivery timeframes or costs, returns, warranties, and detailed product specifications are not confirmed.

Review these facts against the current store copy before deployment, especially the launch date and any information that may have changed.

## Deploy the site and assistant

GitHub Pages can serve `index.html`, but it cannot run the AI endpoint or keep an API key private. Deploy `api/chat.js` to Vercel (or another compatible serverless Node host) and configure these server-side environment variables:

- `OPENAI_API_KEY` — required provider secret; never add it to the repository or browser code.
- `OPENAI_MODEL` — optional model override; defaults to `gpt-4.1-mini`.
- `ALLOWED_ORIGIN` — exact website origin. For the Pages URL in this project, set `https://malca1.github.io` (no trailing slash). This is used for CORS.
- `BUSINESS_CONTACT_URL` — optional official contact page URL. Add this once the store has a confirmed contact path so unsupported questions can be routed there.

For the Pages frontend, set `AI_CHAT_ENDPOINT` near the top of the inline script in `index.html` to the full public HTTPS endpoint, such as `https://your-project.vercel.app/api/chat`, then publish the updated page. Do not put credentials in the endpoint URL. Alternatively, deploy the whole repository on Vercel and set the endpoint to `/api/chat`. It is blank by default so the page does not pretend the assistant is connected before setup.

The endpoint accepts `POST` JSON `{ "message": "..." }` and returns `{ "reply": "..." }` plus an optional `contactUrl`. It validates messages (up to 1,000 characters), limits output length, and applies a small per-instance rate limit. The in-memory limit is best-effort and resets with serverless instances; use a durable rate limiter and monitoring before relying on it for a high-traffic public storefront. Provider keys remain server-side.

## Local preview

Open `index.html` directly or use a static file server. Without a deployed backend, the assistant cannot answer and will show a clear setup message; it will not pretend to be connected. The signup form also needs a real email-service endpoint before it can collect addresses.
