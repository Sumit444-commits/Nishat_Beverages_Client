import mongoose from 'mongoose';

const dailyReminderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  date: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('DailyReminder', dailyReminderSchema);