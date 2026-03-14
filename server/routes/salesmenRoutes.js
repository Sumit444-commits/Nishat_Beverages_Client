import express from 'express';
import { Salesman } from "../models/SalesmanModel.js";


const router = express.Router();

// ========== SALESMAN ROUTES ========== //
router.get("/salesmen", async (req, res) => {
  try {
    const { active = "true", search } = req.query;

    const query = { isActive: active === "true" };

    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const salesmen = await Salesman.find(query).sort({ createdAt: -1 }).lean();

    const formattedSalesmen = salesmen.map((salesman) => ({
      id: salesman._id,
      _id: salesman._id,
      name: salesman.name,
      mobile: salesman.mobile,
      address: salesman.address || "",
      hireDate: salesman.hireDate
        ? salesman.hireDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      monthlySalary: salesman.monthlySalary,
      areasAssigned: salesman.areasAssigned || [],
      customersAssigned: salesman.customersAssigned,
      totalSales: salesman.totalSales,
      totalCommission: salesman.totalCommission,
      notes: salesman.notes || "",
      isActive: salesman.isActive,
      createdAt: salesman.createdAt.toISOString(),
      updatedAt: salesman.updatedAt.toISOString(),
    }));

    res.json({
      success: true,
      data: formattedSalesmen,
    });
  } catch (error) {
    console.error("Error fetching salesmen:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

router.get("/salesmen/:id", async (req, res) => {
  try {
    const salesman = await Salesman.findById(req.params.id).lean();

    if (!salesman) {
      return res.status(404).json({
        success: false,
        message: "Salesman not found",
      });
    }

    const formattedSalesman = {
      id: salesman._id,
      _id: salesman._id,
      name: salesman.name,
      mobile: salesman.mobile,
      address: salesman.address || "",
      hireDate: salesman.hireDate
        ? salesman.hireDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      monthlySalary: salesman.monthlySalary,
      areasAssigned: salesman.areasAssigned || [],
      customersAssigned: salesman.customersAssigned,
      totalSales: salesman.totalSales,
      totalCommission: salesman.totalCommission,
      notes: salesman.notes || "",
      isActive: salesman.isActive,
      createdAt: salesman.createdAt.toISOString(),
      updatedAt: salesman.updatedAt.toISOString(),
    };

    res.json({
      success: true,
      data: formattedSalesman,
    });
  } catch (error) {
    console.error("Error fetching salesman:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

router.post("/salesmen", async (req, res) => {
  try {
    console.log("📝 Creating new salesman:", req.body);

    const {
      name,
      mobile,
      address = "",
      hireDate,
      monthlySalary = 0,
      areasAssigned = [],
      notes = "",
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Salesman name is required",
      });
    }

    if (!mobile || !mobile.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const existingSalesman = await Salesman.findOne({ mobile: mobile.trim() });
    if (existingSalesman) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already registered to another salesman",
      });
    }

    const salesman = new Salesman({
      name: name.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      hireDate: hireDate ? new Date(hireDate) : new Date(),
      monthlySalary: parseFloat(monthlySalary) || 0,
      areasAssigned: Array.isArray(areasAssigned)
        ? areasAssigned.map((area) => area.trim())
        : [],
      notes: notes.trim(),
      isActive: true,
      customersAssigned: 0,
      totalSales: 0,
      totalCommission: 0,
    });

    await salesman.save();
    console.log("✅ Salesman created successfully:", salesman._id);

    const responseSalesman = {
      id: salesman._id,
      _id: salesman._id,
      name: salesman.name,
      mobile: salesman.mobile,
      address: salesman.address || "",
      hireDate: salesman.hireDate
        ? salesman.hireDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      monthlySalary: salesman.monthlySalary,
      areasAssigned: salesman.areasAssigned || [],
      customersAssigned: salesman.customersAssigned,
      totalSales: salesman.totalSales,
      totalCommission: salesman.totalCommission,
      notes: salesman.notes || "",
      isActive: salesman.isActive,
      createdAt: salesman.createdAt.toISOString(),
      updatedAt: salesman.updatedAt.toISOString(),
    };

    res.status(201).json({
      success: true,
      message: "Salesman added successfully",
      data: responseSalesman,
    });
  } catch (error) {
    console.error("❌ Error creating salesman:", error);

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

router.put("/salesmen/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.id;
    delete updates.customersAssigned;
    delete updates.totalSales;
    delete updates.totalCommission;

    const existingSalesman = await Salesman.findById(id);
    if (!existingSalesman) {
      return res.status(404).json({
        success: false,
        message: "Salesman not found",
      });
    }

    if (updates.mobile && updates.mobile !== existingSalesman.mobile) {
      const mobileExists = await Salesman.findOne({
        mobile: updates.mobile,
        _id: { $ne: id },
      });
      if (mobileExists) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already registered to another salesman",
        });
      }
    }

    if (updates.areasAssigned && Array.isArray(updates.areasAssigned)) {
      updates.areasAssigned = updates.areasAssigned.map((area) => area.trim());
    }

    if (updates.hireDate) {
      updates.hireDate = new Date(updates.hireDate);
    }

    const salesman = await Salesman.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    ).lean();

    const formattedSalesman = {
      id: salesman._id,
      _id: salesman._id,
      name: salesman.name,
      mobile: salesman.mobile,
      address: salesman.address || "",
      hireDate: salesman.hireDate
        ? salesman.hireDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      monthlySalary: salesman.monthlySalary,
      areasAssigned: salesman.areasAssigned || [],
      customersAssigned: salesman.customersAssigned,
      totalSales: salesman.totalSales,
      totalCommission: salesman.totalCommission,
      notes: salesman.notes || "",
      isActive: salesman.isActive,
      createdAt: salesman.createdAt.toISOString(),
      updatedAt: salesman.updatedAt.toISOString(),
    };

    res.json({
      success: true,
      message: "Salesman updated successfully",
      data: formattedSalesman,
    });
  } catch (error) {
    console.error("Error updating salesman:", error);

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

router.delete("/salesmen/:id", async (req, res) => {
  try {
    const salesman = await Salesman.findById(req.params.id);

    if (!salesman) {
      return res.status(404).json({
        success: false,
        message: "Salesman not found",
      });
    }

    salesman.isActive = false;
    await salesman.save();

    res.json({
      success: true,
      message: "Salesman deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting salesman:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

router.get("/salesmen/stats/summary", async (req, res) => {
  try {
    const totalSalesmen = await Salesman.countDocuments({ isActive: true });

    const totalSalaryResult = await Salesman.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: "$monthlySalary" } } },
    ]);

    const totalCustomersAssignedResult = await Salesman.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: "$customersAssigned" } } },
    ]);

    const topSalesmen = await Salesman.find({ isActive: true })
      .sort({ customersAssigned: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: {
        totalSalesmen,
        totalMonthlySalary: totalSalaryResult[0]?.total || 0,
        totalCustomersAssigned: totalCustomersAssignedResult[0]?.total || 0,
        topSalesmen: topSalesmen.map((s) => ({
          id: s._id,
          name: s.name,
          customersAssigned: s.customersAssigned,
          totalSales: s.totalSales,
        })),
      },
    });
  } catch (error) {
    console.error("Error getting salesman stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});


export default router;