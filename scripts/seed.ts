import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, required: true },
  category: { type: String, default: "Web Development" },
  thumbnail: { type: String },
  duration: { type: String, default: "6h 30m" },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 128 },
  enrolledCount: { type: Number, default: 520 },
  videoUrl: { type: String },
  instructor: {
    name: String,
    role: String,
    avatar: String,
    bio: String
  },
  learningOutcomes: [String],
  prerequisites: [String],
  tags: [String],
  modules: [{
    title: String,
    lessons: [{
      id: String,
      title: String,
      duration: String,
      videoUrl: String,
      summary: String,
      isFreePreview: Boolean
    }]
  }]
}, { timestamps: true });

const DiscussionSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  lessonId: { type: String },
  userName: { type: String, required: true },
  userRole: { type: String, default: "Student" },
  userAvatar: { type: String },
  title: { type: String, required: true },
  content: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  replies: [{
    userName: String,
    userRole: String,
    userAvatar: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("No MONGODB_URI");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
  const Discussion = mongoose.models.Discussion || mongoose.model("Discussion", DiscussionSchema);

  await Course.deleteMany({});
  await Discussion.deleteMany({});

  const richCourses = [
    {
      title: "Next.js 16 & React 19 Full-Stack Mastery",
      description: "Master modern App Router, Turbopack, Server Actions, NextAuth, and MongoDB to architect scalable production SaaS applications.",
      level: "Beginner",
      category: "Web Development",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      duration: "8h 45m",
      rating: 4.9,
      reviewCount: 342,
      enrolledCount: 1420,
      videoUrl: "https://www.youtube.com/embed/wm5gMKuwSYk",
      instructor: {
        name: "Alex Rivera",
        role: "Principal Full-Stack Architect",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        bio: "Former Staff Engineer at Vercel ecosystem partner, building production React apps since 2016."
      },
      learningOutcomes: [
        "Master Next.js 16 App Router architecture and React 19 Server Components",
        "Implement end-to-end authentication with NextAuth and encrypted sessions",
        "Architect database models with Mongoose, indexing, and optimistic updates",
        "Deploy globally with Vercel edge networks, CI/CD, and custom domains",
        "Build production-grade responsive UI with Tailwind CSS v4 and Shadcn"
      ],
      prerequisites: [
        "Basic understanding of modern JavaScript (ES6+)",
        "Familiarity with HTML, CSS, and component basics"
      ],
      tags: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "MongoDB"],
      modules: [
        {
          title: "Module 1: Foundations & Architecture",
          lessons: [
            {
              id: "next-m1-l1",
              title: "Course Overview & Project Architecture",
              duration: "08:30",
              videoUrl: "https://www.youtube.com/embed/wm5gMKuwSYk",
              summary: "Deep-dive into modern Next.js App Router, SSR, Turbopack, and project structure.",
              isFreePreview: true
            },
            {
              id: "next-m1-l2",
              title: "Setting Up Development Environment & Tailwind v4",
              duration: "14:15",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              summary: "Configure modern tooling, linting, Tailwind 4 theme tokens, and component directories.",
              isFreePreview: false
            },
            {
              id: "next-m1-l3",
              title: "Server Components vs. Client Components Demystified",
              duration: "18:40",
              videoUrl: "https://www.youtube.com/embed/wm5gMKuwSYk",
              summary: "Understand the React Server Component boundary, hydration, and streaming with Suspense.",
              isFreePreview: false
            }
          ]
        },
        {
          title: "Module 2: Database Modeling & Data Fetching",
          lessons: [
            {
              id: "next-m2-l1",
              title: "MongoDB Atlas Connection & Global Cache Pattern",
              duration: "15:20",
              videoUrl: "https://www.youtube.com/embed/wm5gMKuwSYk",
              summary: "Implement connection pooling, hot-reload safety, and resilient retry logic.",
              isFreePreview: false
            },
            {
              id: "next-m2-l2",
              title: "CRUD Operations with Server Actions & Route Handlers",
              duration: "22:10",
              videoUrl: "https://www.youtube.com/embed/wm5gMKuwSYk",
              summary: "Mutate database records safely with Next.js Server Actions and revalidate paths.",
              isFreePreview: false
            }
          ]
        },
        {
          title: "Module 3: Authentication, Security & Deployment",
          lessons: [
            {
              id: "next-m3-l1",
              title: "NextAuth Credentials Provider & Password Hashing",
              duration: "25:00",
              videoUrl: "https://www.youtube.com/embed/wm5gMKuwSYk",
              summary: "Set up JWT-based session tokens, bcrypt password hashing, and middleware guards.",
              isFreePreview: false
            },
            {
              id: "next-m3-l2",
              title: "Production Optimization & Vercel Zero-Downtime Deployment",
              duration: "16:45",
              videoUrl: "https://www.youtube.com/embed/wm5gMKuwSYk",
              summary: "Audit bundle size, configure caching headers, and deploy to Vercel edge networks.",
              isFreePreview: false
            }
          ]
        }
      ]
    },
    {
      title: "Computer Vision & Deep Learning with YOLOv8",
      description: "Build real-world object detection, segmentation, and tracking pipelines with Python, PyTorch, and YOLOv8 for industrial automation.",
      level: "Advanced",
      category: "Artificial Intelligence",
      thumbnail: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80",
      duration: "11h 20m",
      rating: 4.95,
      reviewCount: 289,
      enrolledCount: 980,
      videoUrl: "https://www.youtube.com/embed/m9OSBJaQTlM",
      instructor: {
        name: "Dr. Elena Rostov",
        role: "AI Research Scientist & Vision Engineer",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
        bio: "PhD in Machine Perception. Published author in IEEE CVPR with 10+ years in robotics and computer vision."
      },
      learningOutcomes: [
        "Train customized YOLOv8 models on custom datasets using Roboflow and PyTorch",
        "Implement real-time object tracking with ByteTrack and DeepSORT",
        "Export models to ONNX and TensorRT for low-latency edge deployment",
        "Build web-based inference dashboards using FastAPI and WebRTC"
      ],
      prerequisites: [
        "Intermediate Python programming proficiency",
        "Basic understanding of matrix math and neural network concepts"
      ],
      tags: ["YOLOv8", "PyTorch", "Computer Vision", "Python", "Deep Learning"],
      modules: [
        {
          title: "Module 1: Vision Fundamentals & YOLO Architecture",
          lessons: [
            {
              id: "yolo-m1-l1",
              title: "Introduction to Modern Convolutional Perception",
              duration: "12:15",
              videoUrl: "https://www.youtube.com/embed/m9OSBJaQTlM",
              summary: "Explore anchor-free detection, C2f modules, and feature pyramid networks.",
              isFreePreview: true
            },
            {
              id: "yolo-m1-l2",
              title: "Preparing Custom Datasets & Bounding Box Annotation",
              duration: "19:40",
              videoUrl: "https://www.youtube.com/embed/m9OSBJaQTlM",
              summary: "Clean, augment, and export custom datasets using Roboflow format.",
              isFreePreview: false
            }
          ]
        },
        {
          title: "Module 2: Model Training & Hyperparameter Tuning",
          lessons: [
            {
              id: "yolo-m2-l1",
              title: "Fine-Tuning YOLOv8 on GPU Accelerators",
              duration: "24:30",
              videoUrl: "https://www.youtube.com/embed/m9OSBJaQTlM",
              summary: "Run distributed training runs, log mAP metrics, and prevent overfitting.",
              isFreePreview: false
            },
            {
              id: "yolo-m2-l2",
              title: "Instance Segmentation & Pose Estimation",
              duration: "28:10",
              videoUrl: "https://www.youtube.com/embed/m9OSBJaQTlM",
              summary: "Extend detection into polygon mask segmentation and human pose keypoints.",
              isFreePreview: false
            }
          ]
        },
        {
          title: "Module 3: Edge Inference & Production Deployment",
          lessons: [
            {
              id: "yolo-m3-l1",
              title: "Exporting to TensorRT & Real-Time Video Streaming",
              duration: "22:50",
              videoUrl: "https://www.youtube.com/embed/m9OSBJaQTlM",
              summary: "Achieve 60+ FPS on edge hardware using FP16 quantization and TensorRT engine.",
              isFreePreview: false
            }
          ]
        }
      ]
    },
    {
      title: "Python for Data Science & Predictive Analytics",
      description: "Turn raw datasets into actionable intelligence. Master Pandas, NumPy, Scikit-Learn, data storytelling, and interactive dashboards.",
      level: "Intermediate",
      category: "Data Science",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      duration: "9h 15m",
      rating: 4.88,
      reviewCount: 412,
      enrolledCount: 1850,
      videoUrl: "https://www.youtube.com/embed/LHBE6Q9XlzI",
      instructor: {
        name: "Marcus Vance",
        role: "Head of Data Science",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        bio: "12 years leading data engineering and predictive modeling teams at Fortune 50 fintech companies."
      },
      learningOutcomes: [
        "Wrangle large, messy real-world datasets with high-performance Pandas techniques",
        "Build statistical machine learning regression and classification models",
        "Design high-impact visual storytelling charts with Plotly and Seaborn",
        "Deploy end-to-end data applications with Streamlit and cloud hosting"
      ],
      prerequisites: [
        "Fundamental Python knowledge (variables, loops, functions)",
        "High-school level algebra and statistics interest"
      ],
      tags: ["Python", "Pandas", "Scikit-Learn", "Machine Learning", "Data Analysis"],
      modules: [
        {
          title: "Module 1: Exploratory Data Analysis & Manipulation",
          lessons: [
            {
              id: "ds-m1-l1",
              title: "Data Manipulation Masterclass with Pandas",
              duration: "16:20",
              videoUrl: "https://www.youtube.com/embed/LHBE6Q9XlzI",
              summary: "Advanced grouping, merging, pivoting, and handling missing data.",
              isFreePreview: true
            },
            {
              id: "ds-m1-l2",
              title: "Vectorized Operations with NumPy",
              duration: "14:50",
              videoUrl: "https://www.youtube.com/embed/LHBE6Q9XlzI",
              summary: "Broadcasting rules, multidimensional slicing, and performance optimization.",
              isFreePreview: false
            }
          ]
        },
        {
          title: "Module 2: Machine Learning Modeling",
          lessons: [
            {
              id: "ds-m2-l1",
              title: "Supervised Learning: Regressors & Classifiers",
              duration: "26:40",
              videoUrl: "https://www.youtube.com/embed/LHBE6Q9XlzI",
              summary: "Feature engineering, cross-validation, and ROC-AUC evaluation.",
              isFreePreview: false
            },
            {
              id: "ds-m2-l2",
              title: "Building an Interactive Portfolio Dashboard",
              duration: "21:15",
              videoUrl: "https://www.youtube.com/embed/LHBE6Q9XlzI",
              summary: "Package your insights into an interactive Streamlit application.",
              isFreePreview: false
            }
          ]
        }
      ]
    },
    {
      title: "Cloud Native DevOps & Kubernetes at Scale",
      description: "Architect self-healing, multi-tenant Kubernetes clusters. Master Docker, Helm, GitOps with ArgoCD, and automated cloud deployments.",
      level: "Advanced",
      category: "Cloud & DevOps",
      thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80",
      duration: "10h 30m",
      rating: 4.92,
      reviewCount: 195,
      enrolledCount: 740,
      videoUrl: "https://www.youtube.com/embed/X48VuDVv0do",
      instructor: {
        name: "Karan Patel",
        role: "Lead Infrastructure Architect",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        bio: "Kubernetes ecosystem contributor and cloud architect specializing in zero-trust infrastructure."
      },
      learningOutcomes: [
        "Containerize microservices with multi-stage, secure Dockerfiles",
        "Configure declarative Kubernetes Deployments, Services, and Ingress",
        "Implement continuous delivery with ArgoCD and GitOps principles",
        "Set up Prometheus and Grafana alerting for production telemetry"
      ],
      prerequisites: [
        "Basic Linux terminal command knowledge",
        "Understanding of networking concepts (DNS, TCP/IP, HTTP)"
      ],
      tags: ["Kubernetes", "Docker", "DevOps", "CI/CD", "Cloud"],
      modules: [
        {
          title: "Module 1: Containerization Best Practices",
          lessons: [
            {
              id: "k8s-m1-l1",
              title: "Production Docker Mastery & Security Hardening",
              duration: "18:00",
              videoUrl: "https://www.youtube.com/embed/X48VuDVv0do",
              summary: "Non-root containers, multi-stage builds, and vulnerability scanning.",
              isFreePreview: true
            },
            {
              id: "k8s-m1-l2",
              title: "Kubernetes Core Architecture & Pod Lifecycle",
              duration: "25:30",
              videoUrl: "https://www.youtube.com/embed/X48VuDVv0do",
              summary: "Control plane components, kubelet, kube-proxy, and etcd.",
              isFreePreview: false
            }
          ]
        },
        {
          title: "Module 2: Ingress, Helm & GitOps",
          lessons: [
            {
              id: "k8s-m2-l1",
              title: "Packaging Applications with Helm Charts",
              duration: "22:15",
              videoUrl: "https://www.youtube.com/embed/X48VuDVv0do",
              summary: "Template variables, release management, and repository hosting.",
              isFreePreview: false
            },
            {
              id: "k8s-m2-l2",
              title: "Automated Deployments with ArgoCD",
              duration: "27:40",
              videoUrl: "https://www.youtube.com/embed/X48VuDVv0do",
              summary: "Sync policies, drift detection, and rollback strategies.",
              isFreePreview: false
            }
          ]
        }
      ]
    },
    {
      title: "Modern UI/UX Design Systems with Tailwind & Figma",
      description: "Craft award-winning design systems from scratch. Learn tokenization, accessibility, micro-interactions, and component engineering.",
      level: "Beginner",
      category: "Web Development",
      thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
      duration: "7h 10m",
      rating: 4.86,
      reviewCount: 167,
      enrolledCount: 910,
      videoUrl: "https://www.youtube.com/embed/c8I_VjC_Xm0",
      instructor: {
        name: "Amara Okonjo",
        role: "Design Systems Lead",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        bio: "Specializing in WCAG AAA accessibility and component architecture for consumer web apps."
      },
      learningOutcomes: [
        "Build cohesive Figma design token libraries (colors, typography, spacing)",
        "Bridge Figma tokens directly into Tailwind CSS v4 variables",
        "Implement keyboard navigation and screen-reader accessibility",
        "Create micro-interactions with Framer Motion and modern CSS"
      ],
      prerequisites: [
        "No previous design experience required",
        "Basic interest in user interface creation"
      ],
      tags: ["UI/UX", "Tailwind CSS", "Figma", "Design Systems", "Accessibility"],
      modules: [
        {
          title: "Module 1: Design Tokens & Visual Hierarchy",
          lessons: [
            {
              id: "ui-m1-l1",
              title: "The Anatomy of a Modern Design System",
              duration: "13:20",
              videoUrl: "https://www.youtube.com/embed/c8I_VjC_Xm0",
              summary: "Primitive tokens, semantic tokens, and component-specific variables.",
              isFreePreview: true
            },
            {
              id: "ui-m1-l2",
              title: "Typography Scales & Color Harmony in OKLCH",
              duration: "17:40",
              videoUrl: "https://www.youtube.com/embed/c8I_VjC_Xm0",
              summary: "Perceptually uniform color spaces and responsive type ramps.",
              isFreePreview: false
            }
          ]
        },
        {
          title: "Module 2: Component Engineering",
          lessons: [
            {
              id: "ui-m2-l1",
              title: "Accessible Dialogs, Dropdowns & Tooltips",
              duration: "24:10",
              videoUrl: "https://www.youtube.com/embed/c8I_VjC_Xm0",
              summary: "Focus trapping, ARIA live regions, and Radix UI primitives.",
              isFreePreview: false
            }
          ]
        }
      ]
    },
    {
      title: "Cross-Platform Mobile Apps with React Native & Expo",
      description: "Build, test, and ship native iOS and Android apps using React Native, Expo Router, offline persistence, and gesture handlers.",
      level: "Intermediate",
      category: "Mobile Development",
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
      duration: "8h 50m",
      rating: 4.89,
      reviewCount: 224,
      enrolledCount: 1120,
      videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc",
      instructor: {
        name: "Daniel Cho",
        role: "Senior Mobile Engineer",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
        bio: "Shipped 15+ native iOS/Android applications with over 2M combined App Store downloads."
      },
      learningOutcomes: [
        "Build multi-screen mobile experiences with Expo Router file-based navigation",
        "Integrate device hardware: camera, biometric FaceID, geolocation, and push notifications",
        "Implement offline-first data caching with WatermelonDB and SQLite",
        "Deploy builds through Expo EAS to Google Play Store and Apple TestFlight"
      ],
      prerequisites: [
        "Comfortable with React and JavaScript/TypeScript",
        "Basic terminal usage"
      ],
      tags: ["React Native", "Expo", "iOS", "Android", "Mobile"],
      modules: [
        {
          title: "Module 1: Expo Architecture & File-Based Routing",
          lessons: [
            {
              id: "rn-m1-l1",
              title: "Starting with Expo 52 & Native Modules",
              duration: "15:40",
              videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc",
              summary: "Project scaffolding, Metro bundler, and real-device live reload.",
              isFreePreview: true
            },
            {
              id: "rn-m1-l2",
              title: "Expo Router: Tabs, Stacks & Modals",
              duration: "21:30",
              videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc",
              summary: "Deep linking, tab bar styling, and native sheet transitions.",
              isFreePreview: false
            }
          ]
        },
        {
          title: "Module 2: Gesture Handlers & Native Storage",
          lessons: [
            {
              id: "rn-m2-l1",
              title: "Fluid Micro-Interactions with Reanimated 3",
              duration: "26:50",
              videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc",
              summary: "Pan gestures, spring physics, and 60FPS UI thread animations.",
              isFreePreview: false
            }
          ]
        }
      ]
    }
  ];

  const inserted = await Course.insertMany(richCourses);
  console.log(`Inserted ${inserted.length} courses!`);

  const sampleDiscussions = [
    {
      courseId: inserted[0]._id.toString(),
      lessonId: inserted[0].modules[0].lessons[0].id,
      userName: "Jordan Miller",
      userRole: "Student",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      title: "Difference between Server Actions and API Route handlers in Next 16?",
      content: "When should I prefer using a Server Action directly in a form versus defining an explicit /api route?",
      upvotes: 8,
      replies: [
        {
          userName: "Alex Rivera",
          userRole: "Instructor",
          userAvatar: inserted[0].instructor.avatar,
          content: "Great question! Use Server Actions when submitting forms or mutating data coupled to your UI components — it simplifies state and allows automatic path revalidation. Use API Routes when exposing endpoints to external clients, webhooks, or mobile apps.",
          createdAt: new Date(Date.now() - 3600000 * 5)
        }
      ]
    },
    {
      courseId: inserted[0]._id.toString(),
      lessonId: inserted[0].modules[0].lessons[1].id,
      userName: "Sophia Zhao",
      userRole: "Student",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      title: "Tailwind v4 theme variables configuration tip",
      content: "If you're using CSS variables with @theme, remember to wrap the custom colors in var()! This solved my dark mode token issue.",
      upvotes: 14,
      replies: []
    }
  ];

  await Discussion.insertMany(sampleDiscussions);
  console.log("Inserted sample discussions!");

  // Also auto-enroll existing users into the first two courses so their dashboard has instant activity!
  const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    completedLessons: [{ courseId: String, lessonId: String }],
    certificates: [{ courseId: String, courseTitle: String, issueDate: Date, certificateId: String }]
  }));

  const users = await User.find({});
  for (const u of users) {
    u.enrolledCourses = [inserted[0]._id, inserted[1]._id];
    u.completedCourses = [inserted[1]._id]; // YOLOv8 completed
    u.completedLessons = [
      { courseId: inserted[0]._id.toString(), lessonId: inserted[0].modules[0].lessons[0].id },
      { courseId: inserted[0]._id.toString(), lessonId: inserted[0].modules[0].lessons[1].id },
      // All lessons for YOLOv8
      ...inserted[1].modules.flatMap((m: any) => m.lessons.map((l: any) => ({ courseId: inserted[1]._id.toString(), lessonId: l.id })))
    ];
    u.certificates = [
      {
        courseId: inserted[1]._id.toString(),
        courseTitle: inserted[1].title,
        issueDate: new Date("2026-04-05"),
        certificateId: `CERT-YOLO8-9412`
      }
    ];
    await u.save();
  }
  console.log(`Updated ${users.length} users with enrollments and certificates!`);

  process.exit(0);
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
