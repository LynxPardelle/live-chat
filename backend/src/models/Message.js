/**
 * Message model for MongoDB using Mongoose
 * Represents a chat message in the real-time chat application
 */
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [1, "Username must be at least 1 character"],
      maxlength: [50, "Username cannot exceed 50 characters"],
      match: [
        /^[a-zA-Z0-9\s]+$/,
        "Username can only contain letters, numbers, and spaces",
      ],
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      minlength: [1, "Message cannot be empty"],
      maxlength: [500, "Message cannot exceed 500 characters"],
      validate: {
        validator: function (value) {
          // Ensure message is not just whitespace
          return value.trim().length > 0;
        },
        message: "Message cannot be empty or contain only whitespace",
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true, // Index for efficient sorting and querying
    },
  },
  {
    // Add automatic createdAt and updatedAt fields
    timestamps: true,
    // Transform output to clean up _id and __v
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create index for efficient pagination and sorting
messageSchema.index({ timestamp: -1 });
messageSchema.index({ createdAt: -1 });

// Static method to get paginated messages
messageSchema.statics.getPaginated = function (page = 1, limit = 50) {
  const skip = (page - 1) * limit;

  return this.find()
    .sort({ timestamp: -1 }) // Most recent first
    .skip(skip)
    .limit(limit)
    .lean(); // Return plain JS objects for better performance
};

// Static method to count total messages
messageSchema.statics.getTotalCount = function () {
  return this.countDocuments();
};

// Instance method to format message for socket emission
messageSchema.methods.toSocketFormat = function () {
  return {
    id: this._id,
    username: this.username,
    content: this.content,
    timestamp: this.timestamp,
  };
};

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
