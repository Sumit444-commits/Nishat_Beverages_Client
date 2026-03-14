import express from "express";
import { Expense } from "../models/ExpenseModel.js";
import { ExpenseOwner } from "../models/ExpenseOwnerModel.js";

const router = express.Router();


// ========== EXPENSE OWNER ROUTES ========== //

router.get("/expense-owners", async (req, res) => {
  try {
    const owners = await ExpenseOwner.find({ isActive: true }).lean();

    const formattedOwners = owners.map((owner) => ({
      id: owner._id,
      _id: owner._id,
      name: owner.name,
    }));

    res.json({ success: true, data: formattedOwners });
  } catch (error) {
    console.error("Error fetching expense owners:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/expense-owners", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Owner name is required" });
    }

    const newOwner = new ExpenseOwner({ name: name.trim() });
    await newOwner.save();

    res.status(201).json({
      success: true,
      data: { id: newOwner._id, _id: newOwner._id, name: newOwner.name },
    });
  } catch (error) {
    console.error("Error creating expense owner:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create expense owner" });
  }
});

// ========== EXPENSE ROUTES ========== //

router.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find({ isActive: true })
      .sort({ date: -1 })
      .limit(500) // Optional: limit to recent expenses to keep load times fast
      .lean();

    const formattedExpenses = expenses.map((expense) => ({
      ...expense,
      id: expense._id,
    }));

    res.json({ success: true, data: formattedExpenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/expenses", async (req, res) => {
  try {
    const expenseData = req.body;

    const newExpense = new Expense(expenseData);
    await newExpense.save();

    res.status(201).json({
      success: true,
      data: { ...newExpense.toObject(), id: newExpense._id },
    });
  } catch (error) {
    console.error("Error recording expense:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to record expense" });
  }
});

// PUT route to update an existing expense
router.put("/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent accidentally overwriting the database ID or creation timestamp
    delete updates._id;
    delete updates.createdAt;

    const existingExpense = await Expense.findById(id);
    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }, // Returns the newly updated document
    ).lean();

    res.json({
      success: true,
      message: "Expense updated successfully",
      data: { ...updatedExpense, id: updatedExpense._id }, // Safely map _id to id for React
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating expense.",
    });
  }
});

// DELETE route to (soft) delete an expense
router.delete("/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Soft delete to maintain historical financial integrity
    expense.isActive = false;
    await expense.save();

    res.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting expense.",
    });
  }
});

export default router;
