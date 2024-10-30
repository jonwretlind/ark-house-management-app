import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userStatuses: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    viewedAt: {
      type: Date,
      default: null
    }
  }]
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;
