import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMiniToolTag extends Document {
  name: string;
}

const miniToolTagSchema = new Schema<IMiniToolTag>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const MiniToolTag: Model<IMiniToolTag> =
  mongoose.models.MiniToolTag || mongoose.model<IMiniToolTag>("MiniToolTag", miniToolTagSchema);

export default MiniToolTag;

