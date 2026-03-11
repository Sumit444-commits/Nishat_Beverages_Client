import mongoose from 'mongoose';

const stockAdjustmentSchema = new mongoose.Schema({
  inventoryItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  date: { type: String, required: true },
  quantity: { type: Number, required: true },
  reason: { type: String },
  newStockLevel: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('StockAdjustment', stockAdjustmentSchema);