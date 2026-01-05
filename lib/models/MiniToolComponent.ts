import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMiniToolComponent extends Document {
  name: string;
}

const miniToolComponentSchema = new Schema<IMiniToolComponent>(
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

const MiniToolComponent: Model<IMiniToolComponent> =
  mongoose.models.MiniToolComponent || mongoose.model<IMiniToolComponent>("MiniToolComponent", miniToolComponentSchema);

export default MiniToolComponent;
