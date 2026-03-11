import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash', 'Bank'], default: 'Cash' },
  ownerId: { type: String, default: null }, // Stored as string to handle either Salesman ID or ExpenseOwner ID
  ownerType: { type: String, enum: ['salesman', 'owner', null], default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Expense = mongoose.model('Expense', expenseSchema);