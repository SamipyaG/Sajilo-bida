import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LeaveTypeList = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get('http://localhost:5000/api/leavetypes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log('Full API response:', response);

        const leaveTypeData = response?.data?.data;

        if (!Array.isArray(leaveTypeData)) {
          throw new Error('Leave type data is not an array');
        }

        setLeaveTypes(leaveTypeData);
      } catch (err) {
        console.error('Error fetching leave types:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load leave types');
        setLeaveTypes([]); // Ensure it's always an array
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveTypes();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading leave types...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <h3 className="font-bold">Error Loading Leave Types</h3>
        <p>{error}</p>
        <p className="text-sm mt-2">Check browser console for more details</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Leave Types</h2>
        <Link
          to="/leavetypes/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add New Leave Type
        </Link>
      </div>

      {Array.isArray(leaveTypes) && leaveTypes.length === 0 ? (
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          No leave types found in the system
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Leave Type</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Days Allowed</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(leaveTypes) &&
                leaveTypes.map((leaveType) => (
                  <tr key={leaveType._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{leaveType.name || 'N/A'}</td>
                    <td className="px-4 py-3">{leaveType.description || 'N/A'}</td>
                    <td className="px-4 py-3">{leaveType.daysAllowed || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          leaveType.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {leaveType.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Link
                          to={`/leavetypes/${leaveType._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                        <Link
                          to={`/leavetypes/edit/${leaveType._id}`}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveTypeList;