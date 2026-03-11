import express from "express";
import { Customer } from "../models/Customer.js";

const router = express.Router();

// ========== CUSTOMER ROUTES ========== //
router.get("/customers", async (req, res) => {
  try {
    const {
      area,
      salesmanId,
      search,
      page = 1,
      limit = 20,
      active = "true",
    } = req.query;

    const query = { isActive: active === "true" };

    if (area && area !== "all" && area !== "") {
      query.area = area;
    }

    if (salesmanId && salesmanId !== "all" && salesmanId !== "") {
      query.salesmanId = salesmanId;
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Customer.countDocuments(query);

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const formattedCustomers = customers.map((customer) => ({
      id: customer._id,
      _id: customer._id,
      name: customer.name,
      address: customer.address,
      mobile: customer.mobile,
      area: customer.area,
      salesmanId: customer.salesmanId,
      totalBalance: customer.totalBalance,
      totalBottlesPurchased: customer.totalBottlesPurchased,
      deliveryFrequencyDays: customer.deliveryFrequencyDays,
      emptyBottlesHeld: customer.emptyBottlesHeld,
      lastEmptiesCollectionDate: customer.lastEmptiesCollectionDate
        ? customer.lastEmptiesCollectionDate.toISOString()
        : null,
      notes: customer.notes || "",
      isActive: customer.isActive,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    }));

    res.json({
      success: true,
      data: formattedCustomers,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

router.get("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const formattedCustomer = {
      id: customer._id,
      _id: customer._id,
      name: customer.name,
      address: customer.address,
      mobile: customer.mobile,
      area: customer.area,
      salesmanId: customer.salesmanId,
      totalBalance: customer.totalBalance,
      totalBottlesPurchased: customer.totalBottlesPurchased,
      deliveryFrequencyDays: customer.deliveryFrequencyDays,
      emptyBottlesHeld: customer.emptyBottlesHeld,
      lastEmptiesCollectionDate: customer.lastEmptiesCollectionDate
        ? customer.lastEmptiesCollectionDate.toISOString()
        : null,
      notes: customer.notes || "",
      isActive: customer.isActive,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    };

    res.json({
      success: true,
      data: formattedCustomer,
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

router.post("/customers", async (req, res) => {
  try {
    console.log("📝 Creating new customer:", req.body);

    const {
      name,
      address,
      mobile,
      area,
      salesmanId,
      totalBalance = 0,
      deliveryFrequencyDays = 1,
      emptyBottlesHeld = 0,
      notes = "",
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    if (!mobile || !mobile.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    if (!area || !area.trim()) {
      return res.status(400).json({
        success: false,
        message: "Area is required",
      });
    }

    const existingCustomer = await Customer.findOne({ mobile: mobile.trim() });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already registered to another customer",
      });
    }

    const customer = new Customer({
      name: name.trim(),
      address: address.trim(),
      mobile: mobile.trim(),
      area: area.trim(),
      salesmanId:
        salesmanId === "unassigned" || !salesmanId ? null : salesmanId,
      totalBalance: parseFloat(totalBalance) || 0,
      deliveryFrequencyDays: parseInt(deliveryFrequencyDays) || 1,
      emptyBottlesHeld: parseInt(emptyBottlesHeld) || 0,
      notes: notes.trim(),
      isActive: true,
      lastEmptiesCollectionDate: null,
    });

    await customer.save();
    console.log("✅ Customer created successfully:", customer._id);

    // Update area customer count
    await updateAreaCustomerCount(area);

    // Update salesman customers count if assigned
    if (customer.salesmanId) {
      await updateSalesmanCustomerCount(customer.salesmanId);
    }

    const responseCustomer = {
      id: customer._id,
      _id: customer._id,
      name: customer.name,
      address: customer.address,
      mobile: customer.mobile,
      area: customer.area,
      salesmanId: customer.salesmanId,
      totalBalance: customer.totalBalance,
      totalBottlesPurchased: customer.totalBottlesPurchased,
      deliveryFrequencyDays: customer.deliveryFrequencyDays,
      emptyBottlesHeld: customer.emptyBottlesHeld,
      lastEmptiesCollectionDate: customer.lastEmptiesCollectionDate
        ? customer.lastEmptiesCollectionDate.toISOString()
        : null,
      notes: customer.notes || "",
      isActive: customer.isActive,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    };

    res.status(201).json({
      success: true,
      message: "Customer added successfully",
      data: responseCustomer,
    });
  } catch (error) {
    console.error("❌ Error creating customer:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

router.put("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.id;

    const existingCustomer = await Customer.findById(id);
    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const oldArea = existingCustomer.area;
    const oldSalesmanId = existingCustomer.salesmanId;

    if (updates.mobile && updates.mobile !== existingCustomer.mobile) {
      const mobileExists = await Customer.findOne({
        mobile: updates.mobile,
        _id: { $ne: id },
      });
      if (mobileExists) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already registered to another customer",
        });
      }
    }

    const customer = await Customer.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    // Update area customer counts
    if (updates.area && updates.area !== oldArea) {
      await updateAreaCustomerCount(oldArea);
      await updateAreaCustomerCount(updates.area);
    }

    // Update salesman customers counts
    if (updates.salesmanId && updates.salesmanId !== oldSalesmanId) {
      if (oldSalesmanId) await updateSalesmanCustomerCount(oldSalesmanId);
      if (updates.salesmanId)
        await updateSalesmanCustomerCount(updates.salesmanId);
    }

    const formattedCustomer = {
      id: customer._id,
      _id: customer._id,
      name: customer.name,
      address: customer.address,
      mobile: customer.mobile,
      area: customer.area,
      salesmanId: customer.salesmanId,
      totalBalance: customer.totalBalance,
      totalBottlesPurchased: customer.totalBottlesPurchased,
      deliveryFrequencyDays: customer.deliveryFrequencyDays,
      emptyBottlesHeld: customer.emptyBottlesHeld,
      lastEmptiesCollectionDate: customer.lastEmptiesCollectionDate
        ? customer.lastEmptiesCollectionDate.toISOString()
        : null,
      notes: customer.notes || "",
      isActive: customer.isActive,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
    };

    res.json({
      success: true,
      message: "Customer updated successfully",
      data: formattedCustomer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

router.delete("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const area = customer.area;
    const salesmanId = customer.salesmanId;

    customer.isActive = false;
    await customer.save();

    // Update area customer count
    await updateAreaCustomerCount(area);

    // Update salesman customers count
    if (salesmanId) {
      await updateSalesmanCustomerCount(salesmanId);
    }

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

router.get("/customers/stats/summary", async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments({ isActive: true });

    const totalBalanceResult = await Customer.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: "$totalBalance" } } },
    ]);

    const totalEmptyBottlesResult = await Customer.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: "$emptyBottlesHeld" } } },
    ]);

    const customersByArea = await Customer.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$area",
          count: { $sum: 1 },
          totalBalance: { $sum: "$totalBalance" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalBalance: totalBalanceResult[0]?.total || 0,
        totalEmptyBottles: totalEmptyBottlesResult[0]?.total || 0,
        customersByArea,
      },
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

router.get("/customers/areas/list", async (req, res) => {
  try {
    const areas = await Customer.distinct("area", { isActive: true });
    res.json({
      success: true,
      data: areas.sort(),
    });
  } catch (error) {
    console.error("Error getting areas:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

router.get("/customers/search/:query", async (req, res) => {
  try {
    const query = req.params.query;

    const customers = await Customer.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { mobile: { $regex: query, $options: "i" } },
      ],
    })
      .limit(10)
      .lean();

    const formattedCustomers = customers.map((customer) => ({
      id: customer._id,
      name: customer.name,
      mobile: customer.mobile,
      area: customer.area,
      totalBalance: customer.totalBalance,
    }));

    res.json({
      success: true,
      data: formattedCustomers,
    });
  } catch (error) {
    console.error("Error searching customers:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});


export default router;