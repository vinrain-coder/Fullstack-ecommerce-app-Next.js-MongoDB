import { Document, Model, model, models, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  name: string;
  role: string;
  password?: string;
  image?: string;
  emailVerified: boolean;
  verificationToken?: string;
  wishlist: Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true, default: "User" },
    password: { type: String },
    image: { type: String },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", userSchema);
export default User;
