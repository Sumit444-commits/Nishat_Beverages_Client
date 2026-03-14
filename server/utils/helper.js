import { AreaAssignment } from "../models/AreaAssignmentModel.js";
import { Customer } from "../models/CustomerModel.js";
import { Salesman } from "../models/SalesmanModel.js";

// Helper function to update area customer count
export const updateAreaCustomerCount = async (areaName) => {
  try {
    const area = await AreaAssignment.findOne({
      area: areaName,
      isActive: true,
    });
    if (area) {
      const customerCount = await Customer.countDocuments({
        area: areaName,
        isActive: true,
      });
      area.customerCount = customerCount;
      await area.save();
    }
  } catch (error) {
    console.error("Error updating area customer count:", error);
  }
}

// Helper function to update salesman customer count
export const  updateSalesmanCustomerCount = async (salesmanId) => {
  try {
    const customerCount = await Customer.countDocuments({
      salesmanId: salesmanId?.toString(),
      isActive: true,
    });
    await Salesman.findByIdAndUpdate(salesmanId, {
      customersAssigned: customerCount,
    });
  } catch (error) {
    console.error("Error updating salesman customer count:", error);
  }
}
