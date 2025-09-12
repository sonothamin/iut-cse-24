📘 IUT CSE’24 Community Platform

A student-built platform for the IUT CSE Batch of 2024.
The goal is simple: bring everyone together in one place — to connect, share, and showcase our journey at IUT.

This isn’t just another web app; it’s our own community hub, designed with modern tools and a clean interface.


---

🚀 Features

Authentication:

Supabase handles sessions & auth with custom SMTP mail server



Students Directory:

Profiles with avatars, rolls, sections, and tags

Quick navigation to any student’s profile page


UI/UX:

Built with Bootstrap 5.3 for a responsive grid and clean components

Font Awesome icons for a familiar, polished look

Typography powered by Geist (via next/font) for a modern feel


Developer Friendly:

Organized code structure with Next.js App Router

Strict typing with TypeScript

Supabase schema & RLS policies managed via supabase/schema.sql




---

🛠️ Tech Stack

Next.js 14 (App Router)

Supabase (DB, Auth, Storage)

Bootstrap 5.3 (UI framework)

Font Awesome (icons)

Vercel (deployment)



---

📂 Getting Started

1. Clone the repo:

git clone https://github.com/<your-repo>.git
cd iut-cse24


2. Create a .env.local with your Supabase creds:

NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>


3. Install dependencies & run dev server:

npm install
npm run dev


4. Open http://localhost:3000




---

🗄️ Database Setup

Copy the schema from supabase/schema.sql

Run it in Supabase SQL Editor to create tables + RLS policies

Configure Auth redirect URL in Supabase:

https://<your-domain>/auth/callback



---

🌍 Deployment

Host on Vercel for zero-config deploys

Add the env vars in Vercel project settings

Set the production redirect URL in Supabase (/auth/callback)



---

🎨 UI / Dev Notes

Home Page: Hero section with batch intro, call-to-action buttons, and a community-themed illustration

Students Page: Card-based grid with avatars, rolls, tags, and profile links

Profile Page: Minimalist design to keep focus on people, not clutter


As the dev, I aimed for:

✨ Clean UI (Bootstrap defaults, subtle shadows, consistent spacing)

⚡ Fast iteration (Supabase for auth/storage/db)

🔒 Secure defaults (RLS policies applied from day one)

👨‍💻 Maintainable codebase (typed models, reusable components like ProfileCard)



---

🤝 Contributing

This is a community project. PRs, issues, or ideas are welcome, especially from batchmates who want to extend features (messaging, events, resources, etc.).


---

📜 License

MIT : free to use and adapt.


---

Do you want me to also add a screenshots/demo section with placeholders so later you can drop in UI previews of the homepage, student directory, and profile pages?

