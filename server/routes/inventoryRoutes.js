import express from "express";
import { InventoryItem } from "../models/InventoryItem.js";


const router = express.Router();



// ========== INVENTORY ROUTES ========== //

router.get("/inventory", async (req, res) => {
  try {
    const inventory = await InventoryItem.find({ isActive: true }).lean();

    // Format to match what the React frontend expects
    const formattedInventory = inventory.map((item) => ({
      id: item._id,
      _id: item._id,
      name: item.name,
      category: item.category,
      stock: item.stock,
      lowStockThreshold: item.lowStockThreshold,
      sellingPrice: item.sellingPrice,
    }));

    res.json({ success: true, data: formattedInventory });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/inventory/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    delete updates._id; // Ensure we don't try to overwrite the Mongo ID

    const updatedItem = await InventoryItem.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedItem)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    res.json({ success: true, data: { ...updatedItem, id: updatedItem._id } });
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Optional: A route to quickly seed the database with your default bottles
router.post("/inventory/seed", async (req, res) => {
  try {
    const items = [
      {
        name: "19 Ltr Bottle",
        sellingPrice: 150,
        stock: 100,
        category: "Water",
      },
      { name: "6 Ltr Bottle", sellingPrice: 80, stock: 50, category: "Water" },
    ];
    await InventoryItem.insertMany(items);
    res.json({ success: true, message: "Default inventory seeded!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// POST route to add a new inventory item
router.post("/inventory", async (req, res) => {
  try {
    const itemData = req.body;
    const newItem = new InventoryItem(itemData);
    await newItem.save();

    res.status(201).json({
      success: true,
      message: "Item added to inventory",
      data: { ...newItem.toObject(), id: newItem._id },
    });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    res.status(500).json({ success: false, message: "Failed to create item" });
  }
});

export default router;
