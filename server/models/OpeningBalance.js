import mongoose from 'mongoose';

const openingBalanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  cash: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('OpeningBalance', openingBalanceSchema);