import mongoose, { Schema, Document, models } from 'mongoose';

// 1. The TypeScript Interface
export interface ICourse extends Document {
  title: string;
  description: string;
  level: string;
  videoUrl?: string; // Optional for now!
}

// 2. The Mongoose Schema
const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { 
    type: String, 
    required: true, 
    enum: ['Beginner', 'Intermediate', 'Advanced'] // Restricts to these exact words
  },
  videoUrl: { type: String },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt dates

// 3. Export the Model (prevents redefining the model during hot-reloads)
const Course = models.Course || mongoose.model<ICourse>('Course', CourseSchema);
export default Course;