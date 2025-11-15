import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/Auth";
import AdminMenu from '../../components/layout/AdminMenu';
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
const Completedtrain = () => {
  const [auth] = useAuth();
  const [completedDates, setCompletedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("mcc"); // Default tab
  const [supervisors, setSupervisors] = useState([]); // store all supervisors

  const options = ["mcc", "acca", "bio", "laundry", "pftr", "pit & yard"];

  // Fetch completed trains
  useEffect(() => {
    if (auth?.user && selected) {
      fetchCompletedTrains();
    }
  }, [auth?.user, selected]);

  const fetchCompletedTrains = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-completedmcctrain`
      );
      const completed =
        res.data?.filter(
          (train) => train.work?.toLowerCase() === selected.toLowerCase()
        ).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ) || [];
      setCompletedDates(completed);
    } catch (err) {
      console.error("Error fetching completed trains:", err);
    } finally {
      setLoading(false);
    }
  };

   const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this work?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/deletework/${id}`
      );
      toast.success("work Deleted Successfully");
      fetchCompletedTrains();
    } catch {
      toast.error("Error deleting work");
    }
  };

  // Fetch supervisors once
  const fetchSupervisors = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/auth/getsupervisor`
      );
      setSupervisors(res.data.supervisor || []);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  return (
    <Layout title="Manager Completed Trains">
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <AdminMenu />
        <main className="flex-1 p-4 md:p-6">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Completed Trains</h1>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                className={`px-4 py-2 rounded text-sm font-medium flex-shrink-0 transition ${
                  selected === opt
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {opt.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 overflow-x-auto">
            <table className="min-w-full bg-white text-sm md:text-base">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-2 md:px-4 py-2 text-left font-semibold">Train No</th>
                  <th className="px-2 md:px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-2 md:px-4 py-2 text-left font-semibold">Date</th>
                  <th className="px-2 md:px-4 py-2 text-left font-semibold">Workers Count</th>

                  {/* Conditionally render columns */}
                  {selected === "acca" ? (
                    <>
                      <th className="px-2 md:px-4 py-2 text-left font-semibold">
                        Manpwr -  <span className="text-green-800 ">Excess</span> /<span className="text-red-800">Short</span>
                      </th>
                      <th className="px-2 md:px-4 py-2 text-left font-semibold">
                        Bedsheets - <span className="text-green-800 ">Excess</span> /<span className="text-red-800">Short</span>
                      </th>
                    </>
                  ) : (
                    <th className="px-2 md:px-4 py-2 text-left font-semibold">
                      Manpwr - Excess/Short
                    </th>
                  )}

                  <th className="px-2 md:px-4 py-2 text-left font-semibold">Supervisor</th>
                  <th className="px-2 md:px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={selected === "acca" ? 8 : 7} className="text-center py-4 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : completedDates.length > 0 ? (
                  completedDates.map((train) => {
const manpowerDiff = (() => {
  const workers = train.workers?.length || 0;
  let multiplier =
    selected === "bio"
      ? 0.06
      : selected === "acca"
      ? 0.65
      : selected === "mcc"
      ? 0.6
      : null;

  if (multiplier === null) return 0; // ✅ return 0 if no tab match

  return Math.round(workers - train.totalcoach * multiplier) || 0;
})();
                    const bedsheetDiff = (train.suppliedBedsheet || 0) - (train.returned || 0);

                    return (
                      <tr key={train._id} className="hover:bg-gray-50 border border-gray-200">
                        <td className="px-2 md:px-4 py-2 border">{train.trainno}</td>
                        <td className="px-2 md:px-4 py-2 border capitalize">{train.status}</td>
                        <td className="px-2 md:px-4 py-2 border">{new Date(train.createdAt).toLocaleDateString("en-IN")}</td>
                        <td className="px-2 md:px-4 py-2 border">{train.workers?.length || 0}</td>

                        {selected === "acca" ? (
                          <>
                            <td className={`px-2 md:px-4 py-2 border ${manpowerDiff < 0 ? "bg-red-500 text-white" : manpowerDiff > 0 ? "bg-green-500 text-white" : ""}`}>
                              {Math.abs(Math.round(manpowerDiff)) || 0}
                            </td>
                            <td className={`px-2 md:px-4 py-2 border ${bedsheetDiff > 0 ? "bg-red-500 text-white" : bedsheetDiff < 0 ? "bg-green-500 text-white" : ""}`}>
                             {Math.abs(Math.round(bedsheetDiff)) || 0}
                            </td>
                          </>
                        ) : (
                          <td className={`px-2 md:px-4 py-2 border ${manpowerDiff < 0 ? "bg-red-500 text-white" : manpowerDiff > 0 ? "bg-green-500 text-white" : ""}`}>
                               {(Math.round(manpowerDiff)) || 0}
                          </td>
                        )}

                        <td className="px-2 md:px-4 py-2 border">
                          {train.supervisor
                            ? supervisors.find((sup) => sup._id === train.supervisor)?.name || "Unknown"
                            : "Not Assigned"}
                        </td>

                        <td className="px-2 md:px-4 flex gap-5 py-2 border">
                          <Link to={`/dashboard/manager/traindetail/${train._id}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                            Details <FaEdit />
                          </Link>
                          <button onClick={()=> handleDelete(train._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={selected === "acca" ? 8 : 7} className="text-center py-4 text-gray-500">
                      No completed trains found in {selected.toUpperCase()}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Completedtrain;