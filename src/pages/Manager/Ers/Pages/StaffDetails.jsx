import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import AdminMenu from "../../components/layout/AdminMenu";
import { Link } from "react-router-dom";

const StaffDetails = () => {
  const [auth] = useAuth();
  const [allWorkers, setAllWorkers] = useState([]);
  const [activeTab, setActiveTab] = useState("MCC");

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const workersPerPage = 30;

  const tabs = ["MCC", "BIO", "ACCA", "Laundry", "Pit & Yard", "PFTR"];

  const fetchWorkers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/worker/get-workers`
      );
      const workers = (res.data || []).sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt)
          : new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
        const dateB = b.createdAt
          ? new Date(b.createdAt)
          : new Date(parseInt(b._id.substring(0, 8), 16) * 1000);
        return dateB - dateA;
      });
      setAllWorkers(workers || []);
    } catch (err) {
      console.error("Error fetching workers:", err);
    }
  };

  useEffect(() => {
    if (auth?.user) fetchWorkers();
  }, [auth?.user]);

  const filteredWorkers = allWorkers.filter(
    (worker) => worker.work?.toLowerCase() === activeTab.toLowerCase()
  );

  // ✅ Pagination Calculation
  const indexOfLast = currentPage * workersPerPage;
  const indexOfFirst = indexOfLast - workersPerPage;
  const currentWorkers = filteredWorkers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredWorkers.length / workersPerPage);

  // ✅ Reset page when switching tabs
  useEffect(() => setCurrentPage(1), [activeTab]);

  return (
    <Layout title="Staff Details - Manager">
      {/* ✅ Responsive Flex Layout */}
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
        {/* Left Sidebar - Admin Menu */}
        <aside className="w-full md:w-64 bg-white shadow-md mb-4 md:mb-0">
          <AdminMenu />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            All Staff Members
          </h1>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base font-medium ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
            <table className="min-w-full text-sm md:text-base border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 md:px-4 py-2 text-left border-b">Name</th>
                  <th className="px-2 md:px-4 py-2 text-left border-b">Phone</th>
                  <th className="px-2 md:px-4 py-2 text-left border-b">Emp ID</th>
                  <th className="px-2 md:px-4 py-2 text-left border-b">Aadhar</th>
                  <th className="px-2 md:px-4 py-2 text-left border-b">Status</th>
                  <th className="px-2 md:px-4 py-2 text-left border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentWorkers.length > 0 ? (
                  currentWorkers.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="px-2 md:px-4 py-2 border-b">{s.name}</td>
                      <td className="px-2 md:px-4 py-2 border-b">{s.phone}</td>
                      <td className="px-2 md:px-4 py-2 border-b">{s.empid}</td>
                      <td className="px-2 md:px-4 py-2 border-b">{s.aadhar}</td>
                      <td className="px-2 md:px-4 py-2 border-b">
                        <span
                          className={`px-2 py-1 rounded text-xs md:text-sm ${
                            s.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-2 md:px-4 py-2 border-b">
                        <Link
                          to={`/dashboard/manager/editstaff/${s._id}`}
                          className="text-blue-600 hover:text-blue-800 text-lg"
                        >
                          <FaEdit />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-3 text-center text-gray-600"
                    >
                      No staff found in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 md:gap-3 mt-5 flex-wrap">
            <button
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-sm md:text-base"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded text-sm md:text-base ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-sm md:text-base"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default StaffDetails;
