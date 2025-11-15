import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/Auth";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import AdminMenu from "../../components/layout/AdminMenu";

const LiveTrain = () => {
  const [auth] = useAuth();
  const [liveTrains, setLiveTrains] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [activeTab, setActiveTab] = useState("mcc");
  const [loading, setLoading] = useState(false);
  const [editableData] = useState({ status: "completed" });

  const TABS = [
    { id: "mcc", label: "MCC" },
    { id: "acca", label: "ACCA" },
    { id: "bio", label: "BIO" },
    { id: "pftr", label: "PFTR" },
    { id: "laundry", label: "Laundry" },
    { id: "pit & yard", label: "Pit & Yard" },
  ];

  // Fetch all live trains
  const fetchLiveTrains = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-livemcctrain`
      );
      setLiveTrains(res.data || []);
    } catch (error) {
      console.error("Error fetching live trains:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all supervisors
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
    fetchLiveTrains();
    fetchSupervisors();
  }, []);

  const handleMarkCompleted = async (id) => {
            if (!window.confirm("Are you sure you want to Mark this Duty Completed?")) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/update-mcctrain/${id}`,
        editableData
      );
      fetchLiveTrains();
    } catch (error) {
      console.error("Error marking train completed:", error);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderLiveTrainRows = () => {
    const filteredTrains = liveTrains.filter(
      (train) => train.work?.toLowerCase() === activeTab.toLowerCase()
    );

    if (!filteredTrains.length) {
      return (
        <tr>
          <td colSpan="7" className="text-center py-4 text-gray-500">
            No live trains available in {activeTab.toUpperCase()}.
          </td>
        </tr>
      );
    }

    const totalWorkers = filteredTrains.reduce(
      (sum, train) => sum + (train.workers?.length || 0),
      0
    );

    return (
      <>
        {filteredTrains
          .slice()
          .reverse()
          .map((train) => {
            const supervisorData = supervisors.find(
              (sup) => sup._id === train.supervisor
            );

            return (
              <tr
                key={train._id}
                className="hover:bg-gray-50 odd:bg-white even:bg-gray-50"
              >
                <td className="border px-2 md:px-4 py-2">{train.trainno}</td>
                <td className="border px-2 md:px-4 py-2 capitalize">{train.status}</td>
                <td className="border px-2 md:px-4 py-2">{formatDateTime(train.createdAt)}</td>
                <td className="border px-2 md:px-4 py-2">{train.workers?.length || 0}</td>
        <td
  className={`border px-2 md:px-4 py-2 text-center ${
    (() => {
      let multiplier =
        activeTab === "bio"
          ? 0.06
          : activeTab === "acca"
          ? 0.65
          : activeTab === "mcc"
          ? 0.6
          : null;

      if (multiplier === null) return "bg-gray-100"; // no calculation

      const diff = Math.round(
        (train.workers?.length || 0) - train.totalcoach * multiplier
      );

      return diff < 0 ? "bg-red-500" : diff > 0 ? "bg-green-500" : "bg-yellow-100";
    })()
  }`}
>
  {(() => {
    let multiplier =
      activeTab === "bio"
        ? 0.06
        : activeTab === "acca"
        ? 0.65
        : activeTab === "mcc"
        ? 0.6
        : null;

    if (multiplier === null) return 0;

    const diff = Math.round(
      (train.workers?.length || 0) - train.totalcoach * multiplier
    );

    return Math.abs(diff) || 0;
  })()}
</td>



                <td className="border px-2 md:px-4 py-2">
                  {train.supervisor ? supervisorData?.name || "Unknown" : "Not Assigned"}
                </td>
                <td className="border px-2 md:px-4 py-2">
                  <div className="flex flex-wrap gap-2">
                    {train.status !== "completed" && (
                      <button
                        onClick={() => handleMarkCompleted(train._id)}
                        className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Mark Completed
                      </button>
                    )}
                    <Link
                      to={`/dashboard/manager/traindetail/${train._id}`}
                      className="text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                    >
                      <FaEdit />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}

        <tr className="bg-gray-200 font-semibold">
          <td colSpan="3" className="border px-2 md:px-4 py-2 text-right">
            Total Workers
          </td>
          <td className="border px-2 md:px-4 py-2">{totalWorkers}</td>
          <td colSpan="3" className="border px-2 md:px-4 py-2"></td>
        </tr>
      </>
    );
  };

  return (
    <Layout title="Live work - Manager">
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
        <AdminMenu />
        <div className="p-4 md:p-6 flex-1 w-full">
          <h1 className="text-2xl font-bold mb-4">Live Trains Dashboard</h1>

          {/* Tabs */}
          <ul className="flex overflow-x-auto border-b mb-4">
            {TABS.map((tab) => (
              <li
                key={tab.id}
                className={`cursor-pointer px-4 py-2 md:px-6 md:py-3 font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-red-500 text-red-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </li>
            ))}
          </ul>

          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="min-w-full border border-gray-300 text-sm md:text-base">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs md:text-sm">
                <tr>
                  <th className="border px-2 md:px-4 py-2">Train No</th>
                  <th className="border px-2 md:px-4 py-2">Status</th>
                  <th className="border px-2 md:px-4 py-2">Created At</th>
                  <th className="border px-2 md:px-4 py-2">Workers</th>
                  <th className="border px-2 md:px-4 py-2">Manpwr - Excess/Short</th>
                  <th className="border px-2 md:px-4 py-2">Supervisor</th>
                  <th className="border px-2 md:px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  renderLiveTrainRows()
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LiveTrain;