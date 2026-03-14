import mongoose from 'mongoose';

const salesmanPaymentSchema = new mongoose.Schema({
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash' },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model('SalesmanPayment', salesmanPaymentSchema);