import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'Water' },
  stock: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  sellingPrice: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);