# Lucky Kids Sports

A lightweight, responsive static storefront for Lucky Kids Sports with six linked pages: Home, Our Story, What We Do, Our Projects, Join Us, and Contact Us. The home page includes the original coming-soon details, a launch countdown, product highlights, a clearly unconfigured early-access signup, and a local FAQ widget.

## Confirmed store information

- Kids' sports gear to encourage active play outdoors.
- Planned products include skipping ropes, agility ladders, and mini soccer goals.
- The launch copy describes sturdy, kid-friendly gear selected for backyard use.
- Delivery is described as Australia-wide and tracked.
- The previously published launch date is 15 November 2026 at 9:00 AM Melbourne time. Verify it is still current before launch.
- Specific stock, prices, shipping costs and timeframes, returns, warranties, and detailed product specifications are not confirmed.

The FAQ widget uses these facts and a small set of written responses; it does not generate answers or send questions to a server. Unknown questions receive an explicit fallback. The Contact Us page can send enquiries through the server-side email endpoint to `heritagecanvas@gmail.com`.

## GitHub Pages

The site is static and can be deployed from the repository root using **Settings → Pages → Deploy from a branch**. All page, style, and script files are linked by relative paths so the menu works under the repository URL.

### FAQ widget

The Q&A widget is a client-side FAQ matcher in `site.js`. Add or update the `faqAnswers` entries there when confirmed store details change. It works on GitHub Pages and does not require Vercel, an AI provider, API keys, or network access. Because it is not generative AI, it can only answer questions covered by its written FAQ entries; other questions receive an honest fallback.

The Join Us form also does not collect or store addresses until a real mailing-list service is configured.

### Email enquiries

GitHub Pages is static, so the Contact Us form sends its request to a serverless endpoint. Deploy `api/enquiry.js` to Vercel and add these server-side environment variables:

- `RESEND_API_KEY` — a Resend API key. Keep it in Vercel, never in the browser or repository.
- `RESEND_FROM_EMAIL` — a sender address on a domain verified with Resend.
- `ALLOWED_ORIGIN` — `https://malca1.github.io` for this GitHub Pages site.

The endpoint sends plain-text enquiries to `heritagecanvas@gmail.com` and uses the visitor's address as `reply_to`. In `site.js`, set `ENQUIRY_API_ENDPOINT` to the full Vercel function URL, for example `https://your-project.vercel.app/api/enquiry`, then publish the updated static site. Until configured, the form offers a prefilled Gmail web draft as a fallback; the visitor must be signed in to Gmail and click Send themselves.

The endpoint validates fields, includes a honeypot, checks the allowed browser origin, and applies a best-effort per-instance rate limit. For a public form, use a durable rate limiter and monitor delivery. Configure and verify a sender domain in Resend before expecting messages to arrive.

## Local preview

Open `index.html` directly or serve the repository root with any static file server. No build step or dependencies are required.
