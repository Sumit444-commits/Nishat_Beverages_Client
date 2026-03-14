import express from "express";
import { Customer } from "../models/CustomerModel.js";
import { Salesman } from "../models/SalesmanModel.js";
import { AreaAssignment } from "../models/AreaAssignmentModel.js";
import { updateSalesmanCustomerCount, updateAreaCustomerCount } from "../utils/helper.js";
const router = express.Router();

// ========== AREA ASSIGNMENT ROUTES ========== //

// Get all area assignments
router.get("/area-assignments", async (req, res) => {
  try {
    console.log("📥 Fetching area assignments...");
    const { active = "true", salesmanId, search } = req.query;

    const query = { isActive: active === "true" };

    if (salesmanId && salesmanId !== "all" && salesmanId !== "unassigned") {
      query.salesmanId = salesmanId;
    } else if (salesmanId === "unassigned") {
      query.salesmanId = null;
    }

    if (search && search.trim() !== "") {
      query.area = { $regex: search, $options: "i" };
    }

    const areaAssignments = await AreaAssignment.find(query)
      .populate("salesmanId", "name mobile")
      .sort({ area: 1 })
      .lean();

    for (let area of areaAssignments) {
      const customerCount = await Customer.countDocuments({
        area: area.area,
        isActive: true,
      });
      area.customerCount = customerCount;
    }

    const formattedAreas = areaAssignments.map((area) => ({
      id: area._id,
      _id: area._id,
      area: area.area,
      salesmanId: area.salesmanId?._id || null,
      salesman: area.salesmanId || null,
      customerCount: area.customerCount,
      isActive: area.isActive,
      createdAt: area.createdAt,
      updatedAt: area.updatedAt,
    }));

    console.log(`✅ Found ${formattedAreas.length} area assignments`);
    res.json({
      success: true,
      data: formattedAreas,
    });
  } catch (error) {
    console.error("❌ Error fetching area assignments:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get single area assignment by ID
router.get("/area-assignments/:id", async (req, res) => {
  try {
    const area = await AreaAssignment.findById({ _id: req.params.id })
      .populate("salesmanId", "name mobile")
      .lean();

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    const customerCount = await Customer.countDocuments({
      area: area.area,
      isActive: true,
    });

    const formattedArea = {
      id: area._id,
      _id: area._id,
      area: area.area,
      salesmanId: area.salesmanId?._id || null,
      salesman: area.salesmanId || null,
      customerCount,
      isActive: area.isActive,
      createdAt: area.createdAt,
      updatedAt: area.updatedAt,
    };

    res.json({
      success: true,
      data: formattedArea,
    });
  } catch (error) {
    console.error("❌ Error fetching area:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

// Create new area
router.post("/area-assignments", async (req, res) => {
  try {
    console.log("📝 Creating new area:", req.body);

    const { area, salesmanId } = req.body;

    if (!area || !area.trim()) {
      return res.status(400).json({
        success: false,
        message: "Area name is required",
      });
    }

    const existingArea = await AreaAssignment.findOne({
      area: area.trim(),
      isActive: true,
    });

    if (existingArea) {
      return res.status(400).json({
        success: false,
        message: "Area already exists",
      });
    }

    if (
      salesmanId &&
      salesmanId !== "unassigned" &&
      salesmanId !== "null" &&
      salesmanId !== null
    ) {
      const salesman = await Salesman.findById(salesmanId);
      if (!salesman) {
        return res.status(400).json({
          success: false,
          message: "Selected salesman not found",
        });
      }
    }

    const areaAssignment = new AreaAssignment({
      area: area.trim(),
      salesmanId:
        salesmanId &&
        salesmanId !== "unassigned" &&
        salesmanId !== "null" &&
        salesmanId !== null
          ? salesmanId
          : null,
      customerCount: 0,
    });

    await areaAssignment.save();

    if (areaAssignment.salesmanId) {
      await Salesman.findByIdAndUpdate(areaAssignment.salesmanId, {
        $addToSet: { areasAssigned: area.trim() },
      });
    }

    console.log("✅ Area created successfully:", areaAssignment._id);

    const customerCount = await Customer.countDocuments({
      area: areaAssignment.area,
      isActive: true,
    });

    const responseArea = {
      id: areaAssignment._id,
      _id: areaAssignment._id,
      area: areaAssignment.area,
      salesmanId: areaAssignment.salesmanId,
      customerCount,
      isActive: areaAssignment.isActive,
      createdAt: areaAssignment.createdAt,
      updatedAt: areaAssignment.updatedAt,
    };

    res.status(201).json({
      success: true,
      message: "Area added successfully",
      data: responseArea,
    });
  } catch (error) {
    console.error("❌ Error creating area:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Area already exists",
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

// Update area assignment
router.put("/area-assignments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { area, salesmanId } = req.body;

    console.log("📝 Updating area:", id, req.body);

    const existingArea = await AreaAssignment.findById(id);
    if (!existingArea) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    if (area && area.trim() !== existingArea.area) {
      const areaExists = await AreaAssignment.findOne({
        area: area.trim(),
        _id: { $ne: id },
        isActive: true,
      });
      if (areaExists) {
        return res.status(400).json({
          success: false,
          message: "Area name already exists",
        });
      }
    }

    const newSalesmanId =
      salesmanId &&
      salesmanId !== "unassigned" &&
      salesmanId !== "null" &&
      salesmanId !== null
        ? salesmanId
        : null;

    if (newSalesmanId) {
      const salesman = await Salesman.findById(newSalesmanId);
      if (!salesman) {
        return res.status(400).json({
          success: false,
          message: "Selected salesman not found",
        });
      }
    }

    const oldSalesmanId = existingArea.salesmanId;
    const oldAreaName = existingArea.area;
    const newAreaName = area ? area.trim() : existingArea.area;

    existingArea.area = newAreaName;
    existingArea.salesmanId = newSalesmanId;
    await existingArea.save();

    if (oldSalesmanId) {
      await Salesman.findByIdAndUpdate(oldSalesmanId, {
        $pull: { areasAssigned: oldAreaName },
      });
    }

    if (newSalesmanId) {
      await Salesman.findByIdAndUpdate(newSalesmanId, {
        $addToSet: { areasAssigned: newAreaName },
      });
    }

    await Customer.updateMany(
      { area: oldAreaName, isActive: true },
      { $set: { salesmanId: newSalesmanId ? newSalesmanId.toString() : null } },
    );

    if (oldSalesmanId) {
      await updateSalesmanCustomerCount(oldSalesmanId);
    }

    if (newSalesmanId) {
      await updateSalesmanCustomerCount(newSalesmanId);
    }

    await updateAreaCustomerCount(oldAreaName);
    if (oldAreaName !== newAreaName) {
      await updateAreaCustomerCount(newAreaName);
    }

    const updatedArea = await AreaAssignment.findById(id)
      .populate("salesmanId", "name mobile")
      .lean();

    const customerCount = await Customer.countDocuments({
      area: updatedArea.area,
      isActive: true,
    });

    const responseArea = {
      id: updatedArea._id,
      _id: updatedArea._id,
      area: updatedArea.area,
      salesmanId: updatedArea.salesmanId?._id || null,
      salesman: updatedArea.salesmanId || null,
      customerCount,
      isActive: updatedArea.isActive,
      createdAt: updatedArea.createdAt,
      updatedAt: updatedArea.updatedAt,
    };

    console.log("✅ Area updated successfully");
    res.json({
      success: true,
      message: "Area updated successfully",
      data: responseArea,
    });
  } catch (error) {
    console.error("❌ Error updating area:", error);

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

// Delete area (soft delete)
router.delete("/area-assignments/:id", async (req, res) => {
  try {
    console.log("🗑️ Deleting area:", req.params.id);

    const area = await AreaAssignment.findById(req.params.id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    const customerCount = await Customer.countDocuments({
      area: area.area,
      isActive: true,
    });

    if (customerCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete area with ${customerCount} customer(s). Please reassign customers first.`,
        customerCount,
      });
    }

    if (area.salesmanId) {
      await Salesman.findByIdAndUpdate(area.salesmanId, {
        $pull: { areasAssigned: area.area },
      });
    }

    area.isActive = false;
    await area.save();

    console.log("✅ Area deleted successfully");
    res.json({
      success: true,
      message: "Area deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting area:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

// Get area statistics
router.get("/area-assignments/stats/summary", async (req, res) => {
  try {
    console.log("📊 Fetching area statistics...");

    const totalAreas = await AreaAssignment.countDocuments({ isActive: true });

    const unassignedAreas = await AreaAssignment.countDocuments({
      isActive: true,
      salesmanId: null,
    });

    const assignedAreas = totalAreas - unassignedAreas;

    const areasWithCustomers = await AreaAssignment.aggregate([
      { $match: { isActive: true } },
      { $project: { area: 1 } },
      {
        $lookup: {
          from: "customers",
          let: { areaName: "$area" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$area", "$$areaName"] },
                isActive: true,
              },
            },
            { $count: "count" },
          ],
          as: "customerData",
        },
      },
      {
        $addFields: {
          customerCount: {
            $ifNull: [{ $arrayElemAt: ["$customerData.count", 0] }, 0],
          },
        },
      },
    ]);

    const totalCustomersInAreas = areasWithCustomers.reduce(
      (sum, area) => sum + area.customerCount,
      0,
    );

    const topAreas = [...areasWithCustomers]
      .sort((a, b) => b.customerCount - a.customerCount)
      .slice(0, 5)
      .map((area) => ({
        id: area._id,
        area: area.area,
        customerCount: area.customerCount,
      }));

    console.log("✅ Area statistics fetched successfully");
    res.json({
      success: true,
      data: {
        totalAreas,
        unassignedAreas,
        assignedAreas,
        totalCustomersInAreas,
        topAreas,
      },
    });
  } catch (error) {
    console.error("❌ Error getting area stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
});

export default router;