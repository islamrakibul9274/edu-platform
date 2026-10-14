import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Course from '@/models/Course';
import Discussion from '@/models/Discussion';
import User from '@/models/User';

export async function POST() {
  try {
    await connectToDatabase();

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
          "Build production-grade responsive UI with Tailwind CSS v4 and Radix UI"
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
                title: "Next.js in 100 Seconds & Architecture Overview",
                duration: "08:30",
                videoUrl: "https://www.youtube.com/embed/Sklc_fQBmcs",
                summary: "A high-yield introduction to Next.js full-stack capabilities, SSR, and project anatomy.",
                isFreePreview: true
              },
              {
                id: "next-m1-l2",
                title: "App Router & TypeScript Foundations",
                duration: "14:15",
                videoUrl: "https://www.youtube.com/embed/ZVnjOPwW4ZA",
                summary: "Configure development tooling, directory structure, layout files, and page routing.",
                isFreePreview: false
              },
              {
                id: "next-m1-l3",
                title: "Server Components vs. Client Components Demystified",
                duration: "18:40",
                videoUrl: "https://www.youtube.com/embed/843nec-IvW0",
                summary: "Understand React Server Components, client boundaries, hydration, and streaming.",
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
                videoUrl: "https://www.youtube.com/embed/w2h54xz6Ndw",
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
        title: "The Complete YOLO Masterclass: From YOLOv5 to YOLO11",
        description: "Master the entire YOLO ecosystem (v5, v8, v9, v10, and YOLO11). Train custom models, build real-time multi-object tracking pipelines, implement instance segmentation, and benchmark edge performance with TensorRT.",
        level: "Advanced",
        category: "Artificial Intelligence",
        thumbnail: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80",
        duration: "12h 30m",
        rating: 4.96,
        reviewCount: 310,
        enrolledCount: 1150,
        videoUrl: "https://www.youtube.com/embed/Z-65nqxUdl4",
        instructor: {
          name: "Dr. Elena Rostov",
          role: "AI Research Scientist & Vision Engineer",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
          bio: "PhD in Machine Perception. Published author in IEEE CVPR with 10+ years deploying vision models across autonomous robotics and edge hardware."
        },
        learningOutcomes: [
          "Understand the architectural evolution from anchor-based YOLOv5 to NMS-free YOLOv10 and YOLO11",
          "Train and fine-tune custom vision models on PyTorch, Roboflow datasets, and Google Colab GPUs",
          "Implement real-time object tracking with ByteTrack, DeepSORT, and human pose estimation",
          "Benchmark inference latency across CPU, CUDA, ONNX Runtime, and NVIDIA TensorRT engines",
          "Deploy production vision services using FastAPI, WebRTC, and edge hardware"
        ],
        prerequisites: [
          "Intermediate Python programming proficiency",
          "Basic understanding of neural network layers and matrix operations"
        ],
        tags: ["YOLO11", "YOLOv10", "YOLOv8", "Computer Vision", "PyTorch", "Deep Learning", "TensorRT"],
        modules: [
          {
            title: "Module 1: The YOLO Evolution & Architecture",
            lessons: [
              {
                id: "yolo-m1-l1",
                title: "YOLO Evolution & Architecture: Detection, Classification & Pose",
                duration: "18:20",
                videoUrl: "https://www.youtube.com/embed/Z-65nqxUdl4",
                summary: "A deep architectural breakdown covering anchor-based vs. anchor-free paradigms and C2f/C3k2 modules.",
                isFreePreview: true
              },
              {
                id: "yolo-m1-l2",
                title: "Ultralytics YOLO11 for Real-Time Object Detection & Tracking",
                duration: "21:40",
                videoUrl: "https://www.youtube.com/embed/-JXwa-WlkU8",
                summary: "Setting up Ultralytics YOLO11, model weights selection, and running live webcam inference.",
                isFreePreview: false
              }
            ]
          },
          {
            title: "Module 2: Custom Dataset Training & Fine-Tuning",
            lessons: [
              {
                id: "yolo-m2-l1",
                title: "Training YOLOv10 on Custom Datasets - Complete Guide",
                duration: "25:30",
                videoUrl: "https://www.youtube.com/embed/PfQwNe0P-G4",
                summary: "NMS-free training, dual label assignments, loss functions, and custom dataset training runs.",
                isFreePreview: false
              },
              {
                id: "yolo-m2-l2",
                title: "Dataset Preparation & Augmentation with YOLOv8/v9",
                duration: "19:15",
                videoUrl: "https://www.youtube.com/embed/wuZtUMEiKWY",
                summary: "Bounding box annotations, Roboflow export formats, Mosaic augmentations, and validation checks.",
                isFreePreview: false
              }
            ]
          },
          {
            title: "Module 3: Segmentation & Edge Benchmarking",
            lessons: [
              {
                id: "yolo-m3-l1",
                title: "Real-Time Instance Segmentation & Polygon Masks",
                duration: "14:10",
                videoUrl: "https://www.youtube.com/embed/pFiGSrRtaU4",
                summary: "Pixel-level object segmentation, mask extraction, and area contour calculations.",
                isFreePreview: false
              },
              {
                id: "yolo-m3-l2",
                title: "Benchmarking YOLO Models & Hardware Acceleration (ONNX & TensorRT)",
                duration: "22:50",
                videoUrl: "https://www.youtube.com/embed/rEQlAaevEFc",
                summary: "Compare YOLOv8, v10, and YOLO11 throughput, mAP, and export to FP16 TensorRT for 60+ FPS.",
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
                title: "Complete Python Pandas Data Science Tutorial",
                duration: "16:20",
                videoUrl: "https://www.youtube.com/embed/vmEHCJofslg",
                summary: "Reading CSV/Excel files, sorting, filtering, groupby, and data wrangling.",
                isFreePreview: true
              },
              {
                id: "ds-m1-l2",
                title: "Python NumPy Tutorial for Beginners",
                duration: "14:50",
                videoUrl: "https://www.youtube.com/embed/QUT1VHiLmmI",
                summary: "Array operations, broadcasting rules, multidimensional slicing, and performance optimization.",
                isFreePreview: false
              }
            ]
          },
          {
            title: "Module 2: Machine Learning & Visualization",
            lessons: [
              {
                id: "ds-m2-l1",
                title: "Data Analysis with Python - Machine Learning & Statistics",
                duration: "26:40",
                videoUrl: "https://www.youtube.com/embed/r-uOLxNrNk8",
                summary: "Feature engineering, cross-validation, and predictive modeling.",
                isFreePreview: false
              },
              {
                id: "ds-m2-l2",
                title: "Data Visualization & Interactive Dashboard Building",
                duration: "21:15",
                videoUrl: "https://www.youtube.com/embed/GPVsHOlRBBI",
                summary: "Visual storytelling with Matplotlib, Seaborn, and dashboard deployments.",
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
                title: "Docker Tutorial for Beginners - Full DevOps Course",
                duration: "18:00",
                videoUrl: "https://www.youtube.com/embed/fqMOX6JJhGo",
                summary: "Learn how to containerize applications, manage layers, and optimize image size.",
                isFreePreview: true
              },
              {
                id: "k8s-m1-l2",
                title: "What is Kubernetes | Architecture Explained",
                duration: "15:30",
                videoUrl: "https://www.youtube.com/embed/VnvRFRk_51k",
                summary: "Control plane components, kubelet, kube-proxy, pods, and cluster networking.",
                isFreePreview: false
              }
            ]
          },
          {
            title: "Module 2: Ingress, Helm & GitOps",
            lessons: [
              {
                id: "k8s-m2-l1",
                title: "Kubernetes Services & Ingress Routing",
                duration: "22:15",
                videoUrl: "https://www.youtube.com/embed/X48VuDVv0do",
                summary: "Expose cluster pods with ClusterIP, NodePort, LoadBalancer, and Ingress controllers.",
                isFreePreview: false
              },
              {
                id: "k8s-m2-l2",
                title: "Docker and Kubernetes Full Course Production Guide",
                duration: "27:40",
                videoUrl: "https://www.youtube.com/embed/Wf2eSG3owoA",
                summary: "Declarative orchestration, automated rollouts, and rollback strategies.",
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
        videoUrl: "https://www.youtube.com/embed/ft30zcMlFao",
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
          "Create micro-interactions with modern CSS and animation frameworks"
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
                title: "Tokens, Variables, and Styles - Introduction to Design Systems",
                duration: "13:20",
                videoUrl: "https://www.youtube.com/embed/JyCmacSyDY4",
                summary: "Primitive tokens, semantic tokens, and component-specific variables.",
                isFreePreview: true
              },
              {
                id: "ui-m1-l2",
                title: "Build a Design System - Figma Tokens & Variables Setup",
                duration: "17:40",
                videoUrl: "https://www.youtube.com/embed/HNJmWKndUA4",
                summary: "Set up design tokens in Figma for automatic handoff to front-end engineering.",
                isFreePreview: false
              }
            ]
          },
          {
            title: "Module 2: Component Engineering",
            lessons: [
              {
                id: "ui-m2-l1",
                title: "Tailwind Crash Course - Project From Scratch",
                duration: "24:10",
                videoUrl: "https://www.youtube.com/embed/dFgzHOX84xQ",
                summary: "Tokenizing utility classes and building reusable components.",
                isFreePreview: false
              },
              {
                id: "ui-m2-l2",
                title: "Ultimate Tailwind CSS Tutorial - Build Animated UI",
                duration: "20:30",
                videoUrl: "https://www.youtube.com/embed/pfaSUYaSgRo",
                summary: "Interactive states, hover animations, and micro-interactions.",
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
                title: "React Native Tutorial for Beginners - Build a Mobile App",
                duration: "15:40",
                videoUrl: "https://www.youtube.com/embed/0-S5a0eXPoc",
                summary: "Scaffolding mobile projects, simulated environments, and core component architecture.",
                isFreePreview: true
              },
              {
                id: "rn-m1-l2",
                title: "Introduction to Expo Router Layout Files",
                duration: "21:30",
                videoUrl: "https://www.youtube.com/embed/Yh6Qlg2CYwQ",
                summary: "File-based mobile navigation, header configuration, and tab bars.",
                isFreePreview: false
              }
            ]
          },
          {
            title: "Module 2: Navigation & Full-Stack Deployment",
            lessons: [
              {
                id: "rn-m2-l1",
                title: "Using a Stack Navigator with Expo Router",
                duration: "26:50",
                videoUrl: "https://www.youtube.com/embed/izZv6a99Roo",
                summary: "Stack transitions, push/pop routes, and modal presentation.",
                isFreePreview: false
              },
              {
                id: "rn-m2-l2",
                title: "React Native Course in 2024 - Full Stack Mobile App",
                duration: "28:10",
                videoUrl: "https://www.youtube.com/embed/ZBCUegTZF7M",
                summary: "Backend integration, state management, and production store deployment.",
                isFreePreview: false
              }
            ]
          }
        ]
      }
    ];

    const insertedCourses = await Course.insertMany(richCourses);

    const sampleDiscussions = [
      {
        courseId: insertedCourses[0]._id.toString(),
        lessonId: insertedCourses[0].modules[0].lessons[0].id,
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
            userAvatar: insertedCourses[0].instructor.avatar,
            content: "Great question! Use Server Actions when submitting forms or mutating data coupled to your UI components — it simplifies state and allows automatic path revalidation. Use API Routes when exposing endpoints to external clients, webhooks, or mobile apps.",
            createdAt: new Date(Date.now() - 3600000 * 5)
          }
        ]
      },
      {
        courseId: insertedCourses[1]._id.toString(),
        lessonId: insertedCourses[1].modules[0].lessons[1].id,
        userName: "David Kim",
        userRole: "Student",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        title: "YOLO11 vs YOLOv10 latency comparison on edge GPUs",
        content: "Has anyone benchmarked YOLO11 against YOLOv10 on an NVIDIA Jetson Orin Nano? What mAP improvement did you observe?",
        upvotes: 11,
        replies: [
          {
            userName: "Dr. Elena Rostov",
            userRole: "Instructor",
            userAvatar: insertedCourses[1].instructor.avatar,
            content: "In our lab benchmarks, YOLO11-nano achieves ~18% faster inference latency over YOLOv10 while maintaining a +1.4% mAP gain on the COCO validation set. The C3k2 modules reduce FLOPs significantly.",
            createdAt: new Date(Date.now() - 3600000 * 2)
          }
        ]
      }
    ];

    await Discussion.insertMany(sampleDiscussions);

    // Update existing users
    const users = await User.find({});
    for (const u of users) {
      u.enrolledCourses = [insertedCourses[0]._id, insertedCourses[1]._id];
      u.completedCourses = [insertedCourses[1]._id];
      u.completedLessons = [
        { courseId: insertedCourses[0]._id.toString(), lessonId: insertedCourses[0].modules[0].lessons[0].id },
        { courseId: insertedCourses[0]._id.toString(), lessonId: insertedCourses[0].modules[0].lessons[1].id },
        ...insertedCourses[1].modules.flatMap((m: any) => m.lessons.map((l: any) => ({ courseId: insertedCourses[1]._id.toString(), lessonId: l.id })))
      ];
      u.certificates = [
        {
          courseId: insertedCourses[1]._id.toString(),
          courseTitle: insertedCourses[1].title,
          issueDate: new Date("2026-04-05"),
          certificateId: `CERT-YOLO-MASTER-9412`
        }
      ];
      await u.save();
    }

    return NextResponse.json({ 
      success: true, 
      message: `Database populated with ${insertedCourses.length} production-grade courses, community discussions, and user certificates!` 
    });
    
  } catch (error) {
    console.error("Seeding Error:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed database', error: String(error) }, 
      { status: 500 }
    );
  }
}