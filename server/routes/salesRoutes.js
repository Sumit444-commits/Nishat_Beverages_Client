
import express from "express";

import { InventoryItem } from "../models/InventoryItemModel.js";
import { Sale } from "../models/SaleModel.js";
import { Customer } from "../models/CustomerModel.js";

const router = express.Router();
// ========== SALES ROUTES ========== //

router.get("/sales", async (req, res) => {
  try {
    const sales = await Sale.find({ isActive: true })
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
    const saleData = { ...req.body };

    // Sanitize empty strings to null to prevent Mongoose CastErrors
    if (!saleData.customerId || saleData.customerId === "") saleData.customerId = null;
    if (!saleData.salesmanId || saleData.salesmanId === "") saleData.salesmanId = null;
    if (!saleData.inventoryItemId || saleData.inventoryItemId === "") saleData.inventoryItemId = null;
    
    const newSale = new Sale(saleData);
    await newSale.save();

    // Deduct stock from inventory
    if (newSale.inventoryItemId && newSale.quantity > 0) {
      await InventoryItem.findByIdAndUpdate(newSale.inventoryItemId, {
        $inc: { stock: -newSale.quantity },
      });
    }

    // 💡 2. THE FIX: Update BOTH Total Balance AND Empty Bottles!
    if (newSale.customerId) {
      // Financial Math
      const amountBilled = Number(newSale.amount) || 0;
      const amountPaid = Number(newSale.amountReceived) || 0;
      const balanceChange = amountBilled - amountPaid; 

      // Physical Bottles Math
      const bottlesGiven = Number(newSale.quantity) || 0;
      const emptiesReturned = Number(newSale.emptiesCollected) || 0;
      const emptiesChange = bottlesGiven - emptiesReturned;

      await Customer.findByIdAndUpdate(newSale.customerId, {
        $inc: { 
            totalBalance: balanceChange,
            emptyBottlesHeld: emptiesChange 
        },
        // If they returned empties today, update the "last collection" date
        ...(emptiesReturned > 0 && { lastEmptiesCollectionDate: new Date() })
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
    const saleData = { ...req.body };
    
    // Sanitize empty strings to null to prevent Mongoose CastErrors
    if (!saleData.customerId || saleData.customerId === "") saleData.customerId = null;
    if (!saleData.salesmanId || saleData.salesmanId === "") saleData.salesmanId = null;
    if (!saleData.inventoryItemId || saleData.inventoryItemId === "") saleData.inventoryItemId = null;
    
    const sale = await Sale.findByIdAndUpdate(
      req.params.id, 
      saleData, 
      { new: true, runValidators: true } 
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

    // 💡 3. THE FIX: Reverse BOTH the Balance and the Empties!
    if (sale.customerId) {
      // Financial Reversal
      const amountBilled = Number(sale.amount) || 0;
      const amountPaid = Number(sale.amountReceived) || 0;
      const balanceChangeToReverse = amountBilled - amountPaid;

      // Physical Bottles Reversal
      const bottlesGiven = Number(sale.quantity) || 0;
      const emptiesReturned = Number(sale.emptiesCollected) || 0;
      const emptiesChangeToReverse = bottlesGiven - emptiesReturned;

      await Customer.findByIdAndUpdate(sale.customerId, {
        $inc: { 
            totalBalance: -balanceChangeToReverse,
            emptyBottlesHeld: -emptiesChangeToReverse 
        } 
      });
    }

    res.json({ success: true, message: "Sale deleted and stock restored" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    res.status(500).json({ success: false, message: "Failed to delete sale" });
  }
});

export default router;