import LeaveType from '../models/LeaveType.js';

// Get all leave types
const getAllLeaveSetups = async (req, res) => {
    try {
        const leaveTypes = await LeaveType.find();
        return res.status(200).json({ 
            success: true, 
            data: leaveTypes,
            message: "Leave types fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching leave types:", error);
        return res.status(500).json({ 
            success: false, 
            error: "Server error while fetching leave types",
            details: error.message
        });
    }
};

// Create a new leave type
const createLeaveSetup = async (req, res) => {
    try {
        const { name, code, description, daysAllowed, isActive } = req.body;

        // Validate required fields
        if (!name || !code || daysAllowed === undefined) {
            return res.status(400).json({ 
                success: false, 
                error: "Name, code, and days allowed are required fields" 
            });
        }

        // Check if leave type name or code already exists
        const existingByName = await LeaveType.findOne({ name });
        if (existingByName) {
            return res.status(400).json({ 
                success: false, 
                error: "Leave type with this name already exists" 
            });
        }

        const existingByCode = await LeaveType.findOne({ code });
        if (existingByCode) {
            return res.status(400).json({ 
                success: false, 
                error: "Leave type with this code already exists" 
            });
        }

        // Create new leave type
        const newLeaveType = new LeaveType({ 
            name,
            code,
            description,
            daysAllowed,
            isActive: isActive !== undefined ? isActive : true // Default to active
        });

        await newLeaveType.save();
        
        return res.status(201).json({ 
            success: true, 
            data: newLeaveType,
            message: "Leave type created successfully" 
        });

    } catch (error) {
        console.error("Error creating leave type:", error);
        return res.status(500).json({ 
            success: false, 
            error: "Server error while creating leave type",
            details: error.message
        });
    }
};

// Get a single leave type by ID
const getLeaveSetupById = async (req, res) => {
    try {
        const { id } = req.params;
        const leaveType = await LeaveType.findById(id);

        if (!leaveType) {
            return res.status(404).json({ 
                success: false, 
                error: "Leave type not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: leaveType,
            message: "Leave type fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching leave type:", error);
        return res.status(500).json({ 
            success: false, 
            error: "Server error while fetching leave type",
            details: error.message
        });
    }
};

// Update a leave type
const updateLeaveSetup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, description, daysAllowed, isActive } = req.body;

        // Validate required fields
        if (!name || !code || daysAllowed === undefined) {
            return res.status(400).json({ 
                success: false, 
                error: "Name, code, and days allowed are required fields" 
            });
        }

        // Check if name or code is being used by another leave type
        const existingByName = await LeaveType.findOne({ name, _id: { $ne: id } });
        if (existingByName) {
            return res.status(400).json({ 
                success: false, 
                error: "Another leave type with this name already exists" 
            });
        }

        const existingByCode = await LeaveType.findOne({ code, _id: { $ne: id } });
        if (existingByCode) {
            return res.status(400).json({ 
                success: false, 
                error: "Another leave type with this code already exists" 
            });
        }

        // Update leave type
        const updatedLeaveType = await LeaveType.findByIdAndUpdate(
            id,
            { 
                name,
                code,
                description,
                daysAllowed,
                isActive,
                updatedAt: Date.now() 
            },
            { new: true, runValidators: true }
        );

        if (!updatedLeaveType) {
            return res.status(404).json({ 
                success: false, 
                error: "Leave type not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: updatedLeaveType,
            message: "Leave type updated successfully" 
        });
    } catch (error) {
        console.error("Error updating leave type:", error);
        return res.status(500).json({ 
            success: false, 
            error: "Server error while updating leave type",
            details: error.message
        });
    }
};

// Delete a leave type
const deleteLeaveSetup = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLeaveType = await LeaveType.findByIdAndDelete(id);

        if (!deletedLeaveType) {
            return res.status(404).json({ 
                success: false, 
                error: "Leave type not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Leave type deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting leave type:", error);
        return res.status(500).json({ 
            success: false, 
            error: "Server error while deleting leave type",
            details: error.message
        });
    }
};

export { 
    getAllLeaveSetups, 
    createLeaveSetup, 
    getLeaveSetupById, 
    updateLeaveSetup, 
    deleteLeaveSetup 
};