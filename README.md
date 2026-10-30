# Lucky Kids Sports

A lightweight, responsive static storefront for Lucky Kids Sports with six linked pages: Home, Our Story, What We Do, Our Projects, Join Us, and Contact Us. The home page includes the original coming-soon details, a launch countdown, product highlights, a clearly unconfigured early-access signup, and the customer Q&A assistant.

## Confirmed store information

- Kids' sports gear to encourage active play outdoors.
- Planned products include skipping ropes, agility ladders, and mini soccer goals.
- The launch copy describes sturdy, kid-friendly gear selected for backyard use.
- Delivery is described as Australia-wide and tracked.
- The previously published launch date is 15 November 2026 at 9:00 AM Melbourne time. Verify it is still current before launch.
- Specific stock, prices, shipping costs and timeframes, returns, warranties, and detailed product specifications are not confirmed.

The assistant uses these facts and is instructed not to guess. The Contact Us page does not invent an email or phone number; add verified details when available.

## GitHub Pages

The site is static and can be deployed from the repository root using **Settings → Pages → Deploy from a branch**. All page, style, and script files are linked by relative paths so the menu works under the repository URL.

### Optional Q&A backend

GitHub Pages cannot run the AI endpoint or protect an API key. To enable the Q&A assistant:

1. Deploy `api/chat.js` to Vercel or another compatible serverless Node host.
2. Set `OPENAI_API_KEY` in the host's secret environment configuration. Optionally set `OPENAI_MODEL`, `ALLOWED_ORIGIN` (for this GitHub Pages site, `https://malca1.github.io`), and `BUSINESS_CONTACT_URL` to a verified contact page.
3. Set `AI_CHAT_ENDPOINT` in `site.js` to the backend's public HTTPS endpoint, such as `https://your-project.vercel.app/api/chat`.

The endpoint accepts `POST` JSON `{ "message": "..." }`, limits message length and output size, uses a fixed business-facts prompt, and returns `{ "reply": "..." }` with an optional contact URL. Provider credentials stay server-side. The in-memory rate limit is best-effort; use durable rate limiting and monitoring for a public storefront. Until the endpoint is configured, chat clearly says it is not connected and does not send questions.

The Join Us form also does not collect or store addresses until a real mailing-list service is configured.

## Local preview

Open `index.html` directly or serve the repository root with any static file server. No build step or dependencies are required.
