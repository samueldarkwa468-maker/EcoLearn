# EcoLearn — Cloudflare Pages Edition

EcoLearn is a responsive learning-platform demonstration built with plain HTML, CSS, and JavaScript. It has no framework build step and no production package installation. This structure is designed specifically for reliable deployment through GitHub to Cloudflare Pages.

## What is included

- Responsive professional homepage
- Course catalogue with search, category, level, certificate, and sorting controls
- Ten demonstration courses
- Course details and curriculum pages
- Lesson player with notes, resources, transcript, quiz feedback, and progress controls
- Browser-based demo accounts
- Enrollment, saved courses, learning progress, and certificates using local storage
- Student dashboard and My Learning page
- Instructor profiles and teacher application form
- Instructor dashboard demonstration
- Administrator dashboard demonstration
- Contact, About, FAQ, Terms, and Privacy pages
- Cloudflare Pages Function at `/api/contact`
- Security headers through `public/_headers`
- Manifest, favicon, robots file, and basic sitemap

## Important product status

This is a complete deployable front-end demonstration. It is not yet a production learning-management backend.

The following data is stored only in the current browser:

- Demo account
- Saved courses
- Enrollments
- Lesson progress
- Certificates
- Instructor applications

For real accounts shared across devices, connect a database and authentication service such as Supabase. For real videos, connect a video host. For real support messages, connect the included Pages Function to D1, KV, an email provider, or a helpdesk.

## Preview on Windows

Node.js is already enough. No Visual Studio Code is required.

1. Extract the ZIP.
2. Open the extracted `EcoLearn_Cloudflare_Pages` folder.
3. Double-click `start-local.bat`.
4. Open `http://localhost:3000` in Chrome or Edge.
5. Keep the black terminal window open.
6. Press `Ctrl + C` to stop the local server.

## Upload to GitHub

Create a new empty GitHub repository. Open this extracted project folder and upload its contents so the repository's first page shows:

```text
public/
functions/
.gitignore
CLOUDFLARE-SETTINGS.txt
README.md
server.js
start-local.bat
start-local.sh
```

Do not upload the ZIP file itself into the repository.

## Deploy through Cloudflare Pages

1. Open the Cloudflare dashboard.
2. Open **Workers & Pages**.
3. Choose **Create application** and select **Pages** or **Import an existing Git repository**.
4. Connect GitHub and select the EcoLearn repository.
5. Use these settings:

```text
Framework preset: None
Production branch: main
Root directory: /
Build command: leave empty
Build output directory: public
```

6. Do not add environment variables.
7. Select **Save and Deploy**.
8. Open the generated `.pages.dev` address after the deployment succeeds.

Cloudflare should publish the files directly. There is no `npm install`, no `npm run build`, no Next.js adapter, no `.next` directory, and no Wrangler deploy command in the Git build settings.

## Updating the site

Edit files inside `public`, commit the changes to the GitHub `main` branch, and Cloudflare Pages will create a new deployment automatically.

## Main files

```text
public/index.html          Application shell
public/assets/styles.css   Complete visual design
public/assets/data.js      Courses, categories, and instructors
public/assets/app.js       Routing and application behavior
functions/api/contact.js   Cloudflare Pages Function
server.js                  Dependency-free local preview server
```

## Before a real public launch

- Replace demonstration instructors, learner counts, reviews, and course materials with verified content.
- Connect authentication and a database.
- Add real video hosting, captions, and transcripts.
- Add instructor file uploads with validation.
- Connect email delivery and support storage.
- Add rate limiting and moderation workflows.
- Replace the example domain in `public/sitemap.xml`.
- Have the Terms and Privacy pages reviewed for the target jurisdictions.
