import mongoose from 'mongoose';

const closingRecordSchema = new mongoose.Schema({
  period: { type: String, required: true },
  periodName: { type: String, required: true },
  cashRevenue: { type: Number, default: 0 },
  bankRevenue: { type: Number, default: 0 },
  cashExpenses: { type: Number, default: 0 },
  bankExpenses: { type: Number, default: 0 },
  netBalance: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('ClosingRecord', closingRecordSchema);