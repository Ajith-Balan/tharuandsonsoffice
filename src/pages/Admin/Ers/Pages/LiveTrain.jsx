import React, { useState, useEffect } from "react";
import Layout from "../../../../components/layout/Layout";
import { useAuth } from "../../../../context/Auth";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import AdminMenu from "../AdminMenu";

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

  const fetchLiveTrains = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-livemcctrain`
      );
      setLiveTrains(res.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

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

    if (!filteredTrains.length)
      return (
        <tr>
          <td
            colSpan="7"
            className="py-5 text-gray-500 text-center bg-white rounded-lg"
          >
            No live trains available in {activeTab.toUpperCase()}
          </td>
        </tr>
      );

    const totalWorkers = filteredTrains.reduce(
      (sum, t) => sum + (t.workers?.length || 0),
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

            const multiplier =
              activeTab === "bio"
                ? 0.06
                : activeTab === "acca"
                ? 0.65
                : activeTab === "mcc"
                ? 0.6
                : null;

            const diff =
              multiplier !== null
                ? Math.round(
                    (train.workers?.length || 0) -
                      train.totalcoach * multiplier
                  )
                : null;

            const diffColor =
              diff === null
                ? "bg-gray-200"
                : diff < 0
                ? "bg-red-100 text-red-700"
                : diff > 0
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700";

            return (
              <tr
                key={train._id}
                className="hover:bg-gray-50 transition-all duration-300 border-b"
              >
                <td className="px-4 py-3">{train.trainno}</td>
                <td className="px-4 py-3 capitalize">{train.status}</td>
                <td className="px-4 py-3">{formatDateTime(train.createdAt)}</td>
                <td className="px-4 py-3">{train.workers?.length || 0}</td>

                <td className={`px-4 py-3 text-center font-semibold ${diffColor}`}>
                  {diff !== null ? Math.abs(diff || 0) : 0}
                </td>

                <td className="px-4 py-3">
                  {train.supervisor
                    ? supervisorData?.name || "Unknown"
                    : "Not Assigned"}
                </td>

                <td className="px-4 py-3">
                  <Link
                    to={`/dashboard/admin/ers/traindetails/${train._id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg shadow-sm transition flex items-center gap-2 text-sm"
                  >
                    <FaEdit />
                  </Link>
                </td>
              </tr>
            );
          })}

        {/* Total row */}
        <tr className="bg-gray-100 font-semibold">
          <td colSpan="3" className="px-4 py-3 text-right">
            Total Workers
          </td>
          <td className="px-4 py-3">{totalWorkers}</td>
          <td colSpan="3" className="px-4 py-3"></td>
        </tr>
      </>
    );
  };

  return (
    <Layout title="Live Work - Manager">
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
        <AdminMenu />

        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">📊 Live Trains Dashboard</h1>

          {/* Tabs */}
          <div className="bg-white p-2 rounded-lg shadow-sm mb-5 overflow-x-auto">
            <ul className="flex gap-3 border-b">
              {TABS.map((tab) => (
                <li
                  key={tab.id}
                  className={`cursor-pointer px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "text-red-600 border-b-2 border-red-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Table */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-200 text-gray-700 uppercase text-xs sticky top-0 shadow-sm">
                  <tr>
                    <th className="px-4 py-3">Train No</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created At</th>
                    <th className="px-4 py-3">Workers</th>
                    <th className="px-4 py-3">Manpwr ±</th>
                    <th className="px-4 py-3">Supervisor</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-4 text-center text-gray-500 animate-pulse"
                      >
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
      </div>
    </Layout>
  );
};

export default LiveTrain;
