import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', default: null },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
  inventoryItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', default: null },
  quantity: { type: Number, default: 0 },
  emptiesCollected: { type: Number, default: 0 },
  amount: { type: Number, required: true },
  amountReceived: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash', 'Bank','Pending'], default: 'Cash' },
  paymentForCategory: { type: String, default: 'Water Sale' },
  description: { type: String },
  date: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Sale = mongoose.model('Sale', saleSchema);