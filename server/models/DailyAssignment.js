import mongoose from 'mongoose';

const dailyAssignmentSchema = new mongoose.Schema({
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true },
  date: { type: String, required: true },
  bottlesAssigned: { type: Number, required: true },
  bottlesReturned: { type: Number, default: null },
}, { timestamps: true });

export default mongoose.model('DailyAssignment', dailyAssignmentSchema);