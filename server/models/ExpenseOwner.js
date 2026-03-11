import mongoose from "mongoose";

const expenseOwnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const ExpenseOwner = mongoose.model('ExpenseOwner', expenseOwnerSchema);