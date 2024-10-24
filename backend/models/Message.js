import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true, maxlength: 250 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  viewed: { type: Boolean, default: false },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
