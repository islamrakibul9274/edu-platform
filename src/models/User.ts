import mongoose, { Schema, models } from "mongoose";

const CertificateSchema = new Schema({
  courseId: { type: String, required: true },
  courseTitle: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  certificateId: { type: String, required: true }
}, { _id: false });

const CompletedLessonSchema = new Schema({
  courseId: { type: String, required: true },
  lessonId: { type: String, required: true },
  completedAt: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "student" },
    avatar: { type: String },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    completedLessons: [CompletedLessonSchema],
    certificates: [CertificateSchema],
    streak: {
      count: { type: Number, default: 3 },
      lastActive: { type: Date, default: Date.now }
    }
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", UserSchema);
export default User;