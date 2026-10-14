import mongoose, { Schema, Document, models } from 'mongoose';

export interface ILesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  summary?: string;
  isFreePreview?: boolean;
}

export interface IModule {
  title: string;
  lessons: ILesson[];
}

export interface IInstructor {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail?: string;
  duration?: string;
  rating?: number;
  reviewCount?: number;
  enrolledCount?: number;
  videoUrl?: string;
  instructor?: IInstructor;
  learningOutcomes?: string[];
  prerequisites?: string[];
  tags?: string[];
  modules?: IModule[];
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, default: '10:00' },
  videoUrl: { type: String, required: true },
  summary: { type: String },
  isFreePreview: { type: Boolean, default: false }
}, { _id: false });

const ModuleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  lessons: [LessonSchema]
}, { _id: false });

const InstructorSchema = new Schema<IInstructor>({
  name: { type: String, required: true },
  role: { type: String, default: 'Senior Instructor' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  bio: { type: String, default: 'Experienced software engineer and educator.' }
}, { _id: false });

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { 
    type: String, 
    required: true, 
    enum: ['Beginner', 'Intermediate', 'Advanced'] 
  },
  category: { 
    type: String, 
    default: 'Web Development' 
  },
  thumbnail: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80' 
  },
  duration: { type: String, default: '6h 30m' },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 128 },
  enrolledCount: { type: Number, default: 520 },
  videoUrl: { type: String, default: 'https://www.youtube.com/watch?v=kqtD5dpn9C8' },
  instructor: { type: InstructorSchema, default: () => ({
    name: 'Sarah Chen',
    role: 'Staff Engineer & Educator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Passionate about distributed systems, modern full-stack web, and computer science pedagogy.'
  }) },
  learningOutcomes: [{ type: String }],
  prerequisites: [{ type: String }],
  tags: [{ type: String }],
  modules: [ModuleSchema]
}, { timestamps: true });

// Export the Model (prevents re-registration in hot reload)
const Course = models.Course || mongoose.model<ICourse>('Course', CourseSchema);
export default Course;