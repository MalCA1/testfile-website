# Lucky Kids Sports

A lightweight, responsive static storefront for Lucky Kids Sports with six linked pages: Home, Our Story, What We Do, Our Projects, Join Us, and Contact Us. The home page includes the original coming-soon details, a launch countdown, product highlights, a clearly unconfigured early-access signup, and a local FAQ widget.

## Confirmed store information

- Kids' sports gear to encourage active play outdoors.
- Planned products include skipping ropes, agility ladders, and mini soccer goals.
- The launch copy describes sturdy, kid-friendly gear selected for backyard use.
- Delivery is described as Australia-wide and tracked.
- The previously published launch date is 15 November 2026 at 9:00 AM Melbourne time. Verify it is still current before launch.
- Specific stock, prices, shipping costs and timeframes, returns, warranties, and detailed product specifications are not confirmed.

The FAQ widget uses these facts and a small set of written responses; it does not generate answers or send questions to a server. Unknown questions receive an explicit fallback. The Contact Us page opens a prefilled email draft to `heritagecanvas@gmail.com`; visitors must review and send it in their own email app. The static site does not store or transmit enquiry form contents.

## GitHub Pages

The site is static and can be deployed from the repository root using **Settings → Pages → Deploy from a branch**. All page, style, and script files are linked by relative paths so the menu works under the repository URL.

### FAQ widget

The Q&A widget is a client-side FAQ matcher in `site.js`. Add or update the `faqAnswers` entries there when confirmed store details change. It works on GitHub Pages and does not require Vercel, an AI provider, API keys, or network access. Because it is not generative AI, it can only answer questions covered by its written FAQ entries; other questions receive an honest fallback.

The Join Us form also does not collect or store addresses until a real mailing-list service is configured.

## Local preview

Open `index.html` directly or serve the repository root with any static file server. No build step or dependencies are required.
