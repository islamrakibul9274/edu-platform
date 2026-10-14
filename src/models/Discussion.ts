import mongoose, { Schema, Document, models } from "mongoose";

export interface IReply {
  _id?: string;
  userName: string;
  userRole?: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
}

export interface IDiscussion extends Document {
  courseId: string;
  lessonId?: string;
  userName: string;
  userRole?: string;
  userAvatar?: string;
  title: string;
  content: string;
  upvotes: number;
  replies: IReply[];
  createdAt: Date;
  updatedAt: Date;
}

const ReplySchema = new Schema<IReply>({
  userName: { type: String, required: true },
  userRole: { type: String, default: 'Student' },
  userAvatar: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const DiscussionSchema = new Schema<IDiscussion>({
  courseId: { type: String, required: true, index: true },
  lessonId: { type: String },
  userName: { type: String, required: true },
  userRole: { type: String, default: 'Student' },
  userAvatar: { type: String },
  title: { type: String, required: true },
  content: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  replies: [ReplySchema]
}, { timestamps: true });

const Discussion = models.Discussion || mongoose.model<IDiscussion>("Discussion", DiscussionSchema);
export default Discussion;
