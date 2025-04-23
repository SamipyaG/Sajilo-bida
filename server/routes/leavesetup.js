import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import {
  createLeaveSetup,
  getAllLeaveSetups,
  getLeaveSetupById,
  updateLeaveSetup,
  deleteLeaveSetup
} from "../controllers/leaveSetupController.js";
const router = express.Router();

// Get all leave types
router.get("/", authMiddleware, getAllLeaveSetups);

// Add a new leave type
router.post("/add", authMiddleware, createLeaveSetup);

// Get a single leave type by ID
router.get("/:id", authMiddleware, getLeaveSetupById);

// Update a leave type by ID
router.put("/:id", authMiddleware, updateLeaveSetup);

// Delete a leave type by ID
router.delete("/:id", authMiddleware, deleteLeaveSetup);

// ✅ Check if leave type name is unique before adding
router.get("/check-name/:name", authMiddleware, async (req, res) => {
  try {
    const leaveType = await LeaveType.findOne({ name: req.params.name });
    if (leaveType) {
      return res.json({ available: false, message: "Leave type name already exists." });
    }
    return res.json({ available: true });
  } catch (error) {
    console.error("Error checking leave type name:", error);
    return res.status(500).json({ success: false, error: "Error checking leave type name" });
  }
});

// ✅ Check if leave type code is unique before adding
router.get("/check-code/:code", authMiddleware, async (req, res) => {
  try {
    const leaveType = await LeaveType.findOne({ code: req.params.code });
    if (leaveType) {
      return res.json({ available: false, message: "Leave type code already exists." });
    }
    return res.json({ available: true });
  } catch (error) {
    console.error("Error checking leave type code:", error);
    return res.status(500).json({ success: false, error: "Error checking leave type code" });
  }
});

export default router;