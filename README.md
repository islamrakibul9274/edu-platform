# EduPlatform 🎓

A modern, full-stack Learning Management System (LMS) built to deliver premium educational content, track student progress, and handle secure authentication. 

**Live Demo:** [View Deployed Application](https://edu-platform-s6x6-hatv21gj3-rumel9274-6063s-projects.vercel.app/)

## 🚀 Features

- **Secure Authentication:** Custom credentials login and registration system utilizing NextAuth.js and bcrypt password hashing.
- **Route Protection:** Server-side session verification prevents unauthorized access to premium course materials and video content.
- **Dynamic Student Dashboard:** A personalized hub that tracks enrolled courses, calculates total study hours, and displays earned completion certificates.
- **Enrollment Engine:** Interactive Mongoose database transactions that lock/unlock content based on a user's enrollment status.
- **Progress Tracking:** Students can mark modules as completed, dynamically updating their UI and database profile in real-time.
- **Modern UI/UX:** Built with Tailwind CSS and Shadcn UI components for a highly responsive, accessible, and clean user experience.

## 💻 Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Shadcn UI, Lucide Icons
- **Backend:** Next.js Server Components, Next.js Route Handlers (API)
- **Database:** MongoDB, Mongoose (Models & Population)
- **Authentication:** NextAuth.js (Auth.js), bcryptjs
- **Deployment:** Vercel

## ⚙️ Getting Started (Local Development)

If you want to run this project locally, follow these steps:

**1. Clone the repository**
```bash
git clone [https://github.com/yourusername/edu-platform.git](https://github.com/yourusername/edu-platform.git)
cd edu-platform



**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**
Create a `.env.local` file in the root directory and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_generated_secret_key
NEXTAUTH_URL=http://localhost:3000
```

**4. Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

## 🏗️ Architecture Highlights

  - **Server-Side Rendering (SSR):** Utilizes Next.js App Router for optimal performance and SEO.
  - **Mongoose Population:** Efficiently maps relational data (User enrollments to Course objects) using single-query `.populate()` methods.
  - **Optimistic UI Updates:** Client components use `router.refresh()` to fetch fresh server data instantly without full page reloads after database mutations.

````

