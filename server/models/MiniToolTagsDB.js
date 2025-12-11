const mongoose = require("mongoose");

const miniToolTagSchema = new mongoose.Schema(
    {
        tageName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Create index on tageName for faster lookups
miniToolTagSchema.index({ tageName: 1 });

// Ensure virtuals are included in JSON output
miniToolTagSchema.set('toJSON', { virtuals: true });
miniToolTagSchema.set('toObject', { virtuals: true });

// Model name "MiniToolTag" will create collection "minitooltags" (Mongoose pluralizes)
const MiniToolTagDB = mongoose.model("MiniToolTag", miniToolTagSchema);

module.exports = MiniToolTagDB;