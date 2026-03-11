import express from "express";

import { InventoryItem } from "../models/InventoryItem.js";
import { Sale } from "../models/sale.js";


const router = express.Router();
// ========== SALES ROUTES ========== //

// Inside your Express backend (routes/sales.js)
router.get("/sales", async (req, res) => {
  try {
    const sales = await Sale.find({ isActive: true })
      // Populating grabs the actual name from the related collections!
      .populate("customerId", "name") 
      .populate("salesmanId", "name")
      .populate("inventoryItemId", "name")
      .sort({ date: -1 })
      .limit(500)
      .lean();

    const formattedSales = sales.map((sale) => ({
      ...sale,
      id: sale._id,
    }));

    res.json({ success: true, data: formattedSales });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/sales", async (req, res) => {
  try {
    const saleData = req.body;

    const newSale = new Sale(saleData);
    await newSale.save();

    // Deduct stock from inventory
    if (newSale.inventoryItemId && newSale.quantity > 0) {
      await InventoryItem.findByIdAndUpdate(newSale.inventoryItemId, {
        $inc: { stock: -newSale.quantity },
      });
    }

    res.status(201).json({
      success: true,
      data: { ...newSale.toObject(), id: newSale._id },
    });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ success: false, message: "Failed to record sale" });
  }
});

router.put('/sales/:id', async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // Returns the updated document
    );
    
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    
    res.json({ success: true, data: sale });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/sales/:id", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res
        .status(404)
        .json({ success: false, message: "Sale not found" });
    }

    // Soft delete
    sale.isActive = false;
    await sale.save();

    // Restore stock to inventory since the sale was reversed
    if (sale.inventoryItemId && sale.quantity > 0) {
      await InventoryItem.findByIdAndUpdate(sale.inventoryItemId, {
        $inc: { stock: sale.quantity },
      });
    }

    res.json({ success: true, message: "Sale deleted and stock restored" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    res.status(500).json({ success: false, message: "Failed to delete sale" });
  }
});


export default router;