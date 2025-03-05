import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import axios from 'axios';

const AdminSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summary = await axios.get('http://localhost:5000/api/dashboard/summary', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log(summary.data);
        setSummary(summary.data);
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error);
        }
        console.log(error.message);
      }
    };
    fetchSummary();
  }, []);

  if (!summary) {
    return <div className="flex items-center justify-center h-screen text-2xl font-bold">Loading...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h3 className="text-3xl font-bold text-blue-800 mb-8">Dashboard Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          icon={<FaUsers className="text-4xl text-white" />}
          text="Total Employees"
          number={summary.totalEmployees}
          color="bg-blue-600 hover:bg-blue-700"
        />
        <SummaryCard
          icon={<FaBuilding className="text-4xl text-white" />}
          text="Total Departments"
          number={summary.totalDepartments}
          color="bg-orange-500 hover:bg-orange-600"
        />
        <SummaryCard
          icon={<FaMoneyBillWave className="text-4xl text-white" />}
          text=" Average Monthly Salary"
          number={`$${summary.totalSalary}`}
          color="bg-blue-600 hover:bg-blue-700"
        />
      </div>

      <div className="mt-12">
        <h4 className="text-center text-3xl font-bold text-blue-800 mb-8">Leave Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummaryCard
            icon={<FaFileAlt className="text-4xl text-white" />}
            text="Leave Applied"
            number={summary.leaveSummary.appliedFor}
            color="bg-blue-600 hover:bg-blue-700"
          />
          <SummaryCard
            icon={<FaCheckCircle className="text-4xl text-white" />}
            text="Leave Approved"
            number={summary.leaveSummary.approved}
            color="bg-green-500 hover:bg-green-600"
          />
          <SummaryCard
            icon={<FaHourglassHalf className="text-4xl text-white" />}
            text="Leave Pending"
            number={summary.leaveSummary.pending}
            color="bg-orange-500 hover:bg-orange-600"
          />
          <SummaryCard
            icon={<FaTimesCircle className="text-4xl text-white" />}
            text="Leave Rejected"
            number={summary.leaveSummary.rejected}
            color="bg-red-500 hover:bg-red-600"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;