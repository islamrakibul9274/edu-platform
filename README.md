# EduPlatform 🎓 // Systems Engineering & Modern AI LMS

A production-grade, full-stack Learning Management System (LMS) engineered for software developers, AI practitioners, and cloud architects. Built with **Next.js 16 (Turbopack)**, **React 19**, **Tailwind CSS v4**, **MongoDB Atlas**, and **NextAuth**.

Designed with a strict **2026 Dark Obsidian & Precision Technical Aesthetic** — zero purple/violet gradients, hairline borders, monospace telemetry tags, and responsive engineering layouts.

**🌐 Live Production Deployment:** [https://edu-platform-s6x6.vercel.app](https://edu-platform-s6x6.vercel.app)  
*(Backup/Mirror: [https://edu-platform-rumel9274-6063s-projects.vercel.app](https://edu-platform-rumel9274-6063s-projects.vercel.app))*

---

## ⚡ Core Highlights & Capabilities

### 1. 🛡️ Strict Authentication & Anti-Leak Video Streaming Gating
- **Zero Access Without Login**: Unauthenticated visitors attempting to access the course catalog (`/courses`) or classrooms (`/courses/[id]`) are immediately redirected to `/login` with automatic `callbackUrl` destination preservation.
- **Server-Side Video Anti-Leak Gating**: If a student is not enrolled in a track, all lecture video URLs (`videoUrl`) are **completely stripped on the server** before sending data to the client. Props, DOM, and network bundles never expose raw stream links to unenrolled users.
- **Cinematic Locked Classroom Portal**: Unenrolled students are greeted with a high-security paywall container detailing curriculum specifications, learning outcomes, and a 1-click **"Enroll to Unlock Track"** action that instantly decrypts the video stream without page reload jitter.
- **Hardened API Security**: Endpoints (`/api/enroll`, `/api/complete-lesson`, `/api/complete`, `/api/discussions`) enforce active session verification (`401 Unauthorized`) and enrollment authorization (`403 Forbidden`).

### 2. 🧠 Production Engineering Curricula
- **The Complete YOLO Masterclass: From YOLOv5 to YOLO11**:
  - Module 1: Architectural evolution (anchor-based vs. anchor-free, C2f/C3k2 modules) and Ultralytics YOLO11 real-time detection & tracking.
  - Module 2: Custom dataset training on YOLOv10 (NMS-free dual label assignments) and YOLOv8/v9 dataset augmentation.
  - Module 3: Real-time instance segmentation (polygon masks) and hardware acceleration benchmarking with ONNX & NVIDIA TensorRT.
- **Next.js 16 & React 19 Full-Stack Mastery**: App Router, Turbopack, React 19 Server Components, Server Actions, NextAuth credentials, and MongoDB connection pooling.
- **Cloud Native DevOps & Kubernetes at Scale**: Multi-stage Dockerfiles, declarative Kubernetes Deployments, Ingress controllers, Helm, and GitOps with ArgoCD.
- **Python for Data Science & Predictive Analytics**: Pandas wrangling, NumPy broadcasting, Scikit-Learn pipelines, and interactive Plotly visualization.
- **Modern UI/UX Design Systems with Tailwind & Figma**: Design tokenization, WCAG AAA accessibility, and 60 FPS micro-interactions.
- **Cross-Platform Mobile Apps with React Native & Expo**: Expo Router file-based routing, native gesture handlers, and SQLite offline persistence.

### 3. 🎓 Verifiable Swiss-Style Cryptographic Certificates
- Students who complete 100% of a track's lectures unlock a cryptographically signed completion certificate.
- Features a unique SHA-256 verification serial, accredited timestamp, reviewer signature, and built-in Print-to-PDF export.

### 4. 📊 Student Telemetry Console (`/dashboard`)
- Real-time learning streak index and active track progress percentage bars.
- Instant module resumption jumping directly to the active lesson.
- Directory of earned certificates with quick modal inspection.
- Smart curriculum recommendation engine suggesting non-enrolled tracks.

### 5. 💬 Interactive Classroom Community
- In-classroom discussion threads categorized per lecture and track.
- Instructor-badged responses and community upvoting.
- Fully protected: only enrolled students can post questions or contribute solutions.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16.2.1 (App Router, Turbopack Engine) |
| **UI Library** | React 19.2.4, Radix UI Primitives, Lucide Icons |
| **Styling** | Tailwind CSS v4, Custom Obsidian Theme (`#09090b`), CSS Grid/Bento |
| **Authentication** | NextAuth.js v4 (JWT session strategy, bcrypt password hashing) |
| **Database** | MongoDB Atlas, Mongoose 9 (Connection Pooling, Strict Lean Typing) |
| **Type Safety** | TypeScript 5 (Strict Mode, 100% type-checked builds) |
| **Deployment** | Vercel Edge Network |

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/islamrakibul9274/edu-platform.git
cd edu-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_generated_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### 4. Seed the database with verified curricula
Populate MongoDB with high-definition, verified educational video streams, modules, and demo enrollments:
```bash
npx --yes tsx scripts/seed.ts
```

### 5. Launch the Turbopack development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Test Credentials

For quick evaluation, use the pre-configured demo account:
- **Email**: `demo@eduplatform.dev`
- **Password**: `password123`
*(Pre-enrolled in Next.js 16 and YOLO Masterclass with completed credentials)*

---

## 🔒 Security Best Practices Implemented

1. **Defense-in-Depth Authentication**: Route guards implemented at both Server Component entry points (`getServerSession`) and API route handlers.
2. **Deep BSON Sanitization**: Recursive serialization (`JSON.parse(JSON.stringify(...))`) guarantees zero raw Mongoose BSON `_id` buffers cross Server $\to$ Client boundaries, preventing Next.js 16 Turbopack overlay errors.
3. **DRM Stream Gating**: Unenrolled clients never receive YouTube stream identifiers or lecture URLs.
4. **Hydration Consistency**: Dynamic session containers and branding elements use `suppressHydrationWarning` and `data-scroll-behavior="smooth"` to eliminate React 19 hydration mismatch warnings.

---

## 📄 License
MIT © EduPlatform Academic Council.
