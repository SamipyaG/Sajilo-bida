import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ListLeaveSetup = () => {
    const [leaveSetups, setLeaveSetups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLeaveSetups();
    }, []);

    const fetchLeaveSetups = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/leave-setup/list`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            setLeaveSetups(response.data);
        } catch (error) {
            console.error("Error fetching leave setups:", error.response?.data || error.message);
            alert("An error occurred while fetching leave setups.");
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin-dashboard/leave-setup/edit/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                `http://localhost:5000/api/leave-setup/delete/${id}`,
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            if (response.data.success) {
                fetchLeaveSetups(); // Refresh the list after deletion
            } else {
                alert(response.data.error || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error deleting leave setup:", error.response?.data || error.message);
            alert("An error occurred while deleting the leave setup.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-6">Leave Setup List</h2>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Leave Type</th>
                        <th className="p-2 border">Max Days</th>
                        <th className="p-2 border">Description</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveSetups.map((leaveSetup) => (
                        <tr key={leaveSetup._id} className="border">
                            <td className="p-2 border">{leaveSetup.leaveType}</td>
                            <td className="p-2 border">{leaveSetup.maxDays}</td>
                            <td className="p-2 border">{leaveSetup.description}</td>
                            <td className="p-2 border">
                                <button
                                    onClick={() => handleEdit(leaveSetup._id)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(leaveSetup._id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListLeaveSetup;