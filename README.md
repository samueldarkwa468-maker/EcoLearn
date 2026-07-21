# EcoLearn

EcoLearn is a responsive education-platform MVP built with Next.js, React, TypeScript, and custom CSS. It includes a professional public website, course discovery, course details, a lesson player, student progress features, instructor pages, certificate verification, and demonstration dashboards.

## Run the project

### Requirements

- Node.js 20.9 or newer
- npm

### Windows

1. Extract the ZIP file.
2. Open the `ecolearn` folder.
3. Double-click `start-ecolearn.bat`.
4. Open `http://localhost:3000` if it does not open automatically.

### Terminal

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Production test

```bash
npm run build
npm start
```

## Included routes

- `/` — Homepage
- `/courses` — Searchable and filterable course catalogue
- `/courses/html-css-for-beginners` — Course-details example
- `/learn/html-css-for-beginners` — Interactive lesson-player example
- `/dashboard` — Student dashboard
- `/my-learning` — Enrolled-course library
- `/saved` — Saved-course library
- `/certificates` — Certificate design
- `/verify-certificate` — Certificate verification; demo ID: `ECO-2026-DEMO`
- `/categories` — Learning categories
- `/instructors` — Instructor directory
- `/become-instructor` — Instructor application
- `/instructor-dashboard` — Instructor workspace
- `/admin` — Administration workspace
- `/login`, `/signup`, `/forgot-password` — Authentication screens
- `/about`, `/contact`, `/faq`, `/terms`, `/privacy` — Supporting pages

## Working demonstration features

- Course search, category filters, level filters, duration filters, certificate filter, rating filter, sorting, and grid/list views
- Save and unsave courses using browser local storage
- Enroll in courses and store course progress using browser local storage
- Responsive lesson player with curriculum navigation, tabs, downloadable sample resources, code-copy interaction, and quiz feedback
- Responsive desktop, tablet, and mobile layouts
- Mobile menu and mobile student navigation
- Demo authentication, contact, and instructor application validation states
- Certificate verification demo
- Sitemap, robots file, metadata, web manifest, accessible focus states, and reduced-motion support

## Important scope note

This download is a complete runnable front-end MVP. It does not create real accounts, send email, upload files to cloud storage, persist data to a remote database, host video, process instructor approvals, or generate real PDF certificates. Those operations require a configured backend and service credentials.

The `supabase/schema.sql` file provides a starter PostgreSQL/Supabase schema for integrating real users, courses, lessons, enrollments, progress, quizzes, applications, discussions, and certificates. Review and harden all row-level security rules before production use.

## Main folders

```text
app/          Next.js routes and global styles
components/   Reusable interface and interactive components
data/         Sample courses, categories, instructors, and learning paths
lib/          Shared types and helper functions
public/       Downloadable demonstration lesson files
supabase/     Optional backend starter schema
```

## Before public deployment

1. Replace `https://ecolearn.example` in metadata, sitemap, and robots configuration with the real domain.
2. Connect Supabase or another backend.
3. Replace sample course content, instructors, learner reviews, analytics, and certificate data.
4. Add real video hosting and secure upload validation.
5. Obtain professional legal review for the Terms and Privacy Policy.
6. Add transactional email, monitoring, backups, content moderation, and production analytics.
