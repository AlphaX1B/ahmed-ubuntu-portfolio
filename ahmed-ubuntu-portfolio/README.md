# Ahmed Siddiq — Ubuntu-Inspired DevOps Portfolio

A responsive, interactive desktop-style portfolio inspired by Ubuntu. Built with plain HTML, CSS and JavaScript so it can be hosted as a static site on Netlify, GitHub Pages, Cloudflare Pages or S3 static website hosting.

## Features

- Ubuntu-inspired desktop, top bar, dock and system menu
- Interactive About, Projects, Tech Stack, Experience and Contact windows
- Browser-only simulated terminal with a fixed allowlist of commands
- Draggable and maximizable windows on desktop
- Mobile-responsive layout
- Contact form opens the visitor's email application; no form data is stored or sent by a server
- Basic security headers via `netlify.toml`
- No build step or framework dependencies

## Before publishing — personalize it

1. Open `index.html` and update the About, project, experience and contact content.
2. Search `script.js` for `REPLACE_WITH_YOUR_EMAIL@example.com` and replace it with your public contact email.
3. Confirm that every project, metric, certification and technology listed is accurate and approved for public disclosure.
4. Update GitHub and LinkedIn URLs if needed.
5. If you do not want to publish client names or production metrics, remove those details.

## Run locally

You can double-click `index.html`, but a local web server is a better test:

### Python
```bash
python -m http.server 8080
```
Then visit http://localhost:8080

### Node.js (optional)
```bash
npx serve .
```

No `npm install` is needed because the project has no npm dependencies.

## Deploy to Netlify using GitHub (recommended)

1. Create a new repository on GitHub, for example `ahmed-ubuntu-portfolio`.
2. Extract this ZIP and open a terminal in the extracted folder.
3. Initialize and push the project:

```bash
git init
git add .
git commit -m "Add Ubuntu-inspired portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ahmed-ubuntu-portfolio.git
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub username. If the repository already has a README/license, follow GitHub's instructions to reconcile it rather than overwriting files blindly.

4. Sign in to Netlify.
5. Choose **Add new project** → **Import an existing project**.
6. Connect GitHub and authorize access to this repository.
7. Configure the project:
   - **Branch to deploy:** `main`
   - **Build command:** leave blank
   - **Publish directory:** `.`
8. Click **Deploy**.
9. Once the deploy succeeds, open the generated `*.netlify.app` URL.
10. Future pushes to `main` will trigger automatic deployments.

`netlify.toml` declares the publish directory and adds a few basic response headers. These are a starting point, not a complete security policy. Test your site after deployment.

## Deploy by drag and drop

1. Sign in to Netlify.
2. Open the manual deploy / deploy manually area for a new site.
3. Extract the ZIP first.
4. Drag the extracted project folder (the folder containing `index.html`) into the Netlify drop area.
5. Wait for the deploy to finish and test the generated URL.

Manual drag-and-drop deployments do not automatically publish future Git changes. Use Git integration for ongoing development.

## Alternative hosting options

### GitHub Pages
1. Push the files to a GitHub repository.
2. Open **Settings → Pages**.
3. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Wait for the Pages URL to become available.

### Cloudflare Pages
1. Import the GitHub repository in Cloudflare Pages.
2. Choose no build command and set the output directory to `.`.
3. Deploy.

### Amazon S3 static website hosting
1. Create a dedicated S3 bucket for the site.
2. Upload the static files.
3. Enable static website hosting and set `index.html` as the index document.
4. Configure access using an appropriate public-read policy or CloudFront origin access pattern.
5. For HTTPS and a custom domain, prefer CloudFront with ACM rather than relying on the S3 website endpoint.

Avoid exposing private buckets or AWS credentials. Never put AWS access keys, private API tokens, or other server secrets in browser JavaScript.

## Security notes

- The terminal is only a browser simulation. It is not a real OS shell and should never be connected to a privileged backend without a separate security design.
- The contact form uses `mailto:` and does not send messages directly. For a production form, use a trusted form service or a serverless function with validation, spam protection and rate limiting.
- Do not add private credentials to frontend files, `.env` files that are committed, or public build artifacts.
- Run dependency/security checks if you later add libraries or a build tool.
- Review Netlify response headers and test them in the deployed site. `X-Frame-Options: SAMEORIGIN` permits same-origin framing; use `DENY` if the site should never be framed.
- Keep all portfolio claims and metrics accurate and approved for public disclosure.

## Project structure

```text
ahmed-ubuntu-portfolio/
├── index.html
├── styles.css
├── script.js
├── netlify.toml
├── README.md
└── assets/
    └── favicon.svg
```

## Customization quick reference

- Text and links: `index.html`
- Colors, desktop and window styling: `styles.css` (`:root` variables near the top)
- Window behavior, terminal commands and contact action: `script.js`
- Netlify publish directory and response headers: `netlify.toml`
