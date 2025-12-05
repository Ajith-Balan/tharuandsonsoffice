import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../../../components/layout/Layout";
import { useAuth } from "../../../../context/Auth";
import AdminMenu from "../AdminMenu";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const Completedtrain = () => {
  const [auth] = useAuth();
  const [completedDates, setCompletedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("mcc");
  const [supervisors, setSupervisors] = useState([]);

  const options = ["mcc", "acca", "bio", "laundry", "pftr", "pit & yard"];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const groupByDate = (data) => {
    const today = new Date().setHours(0, 0, 0, 0);

    const map = {};
    data.forEach((item) => {
      const dateKey = formatDate(item.createdAt);
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(item);
    });

    const sorted = Object.keys(map).sort((a, b) => {
      const dateA = new Date(a.split("/").reverse().join("-")).setHours(0, 0, 0, 0);
      const dateB = new Date(b.split("/").reverse().join("-")).setHours(0, 0, 0, 0);
      return dateB - dateA;
    });

    return sorted.map((dateKey) => ({
      date: dateKey,
      trains: map[dateKey].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ),
    }));
  };

  const fetchCompletedTrains = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-completedmcctrain`
      );

      const filtered =
        res.data?.filter(
          (train) => train.work?.toLowerCase() === selected.toLowerCase()
        ) || [];

      setCompletedDates(groupByDate(filtered));
    } catch (err) {
      console.error("Error fetching:", err);
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
    fetchSupervisors();
  }, []);

  useEffect(() => {
    if (auth?.user && selected) fetchCompletedTrains();
  }, [auth?.user, selected]);

  return (
    <Layout title="Manager Completed Trains">
      <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
        <AdminMenu />

        <main className="flex-1 p-4 md:p-6">
          <h1 className="text-3xl font-semibold text-green-700 mb-6">
            Completed Works
          </h1>

          {/* TABS */}
          <div className="flex flex-wrap gap-3 mb-6">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                className={`px-4 py-2 rounded-xl shadow-sm transition-all text-sm font-medium ${
                  selected === opt
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {opt.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Table container */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Train No</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Workers</th>

                    {selected === "acca" ? (
                      <>
                        <th className="px-4 py-3 font-semibold">Manpwr ±</th>
                        <th className="px-4 py-3 font-semibold">Bedsheets ±</th>
                      </>
                    ) : (
                      <th className="px-4 py-3 font-semibold">Manpwr ±</th>
                    )}

                    <th className="px-4 py-3 font-semibold">Supervisor</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={selected === "acca" ? 8 : 7}
                        className="text-center py-6 text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : completedDates.length ? (
                    completedDates.map((section) => (
                      <React.Fragment key={section.date}>
                        {/* Date Row */}
                        <tr className="bg-blue-50 border-y">
                          <td
                            colSpan={selected === "acca" ? 8 : 7}
                            className="px-4 py-2 font-semibold text-blue-800"
                          >
                            📅 {section.date}
                          </td>
                        </tr>

                        {section.trains.map((train) => {
                          const manpowerDiff = (() => {
                            const workers = train.workers?.length || 0;
                            let multiplier =
                              selected === "bio"
                                ? 0.06
                                : selected === "acca"
                                ? 0.65
                                : selected === "mcc"
                                ? 0.6
                                : 0;

                            return Math.round(workers - train.totalcoach * multiplier);
                          })();

                          const bedsheetDiff =
                            (train.suppliedBedsheet || 0) -
                            (train.returned || 0);

                          return (
                            <tr
                              key={train._id}
                              className="hover:bg-gray-50 transition"
                            >
                              <td className="px-4 py-3 border-b">{train.trainno}</td>
                              <td className="px-4 py-3 border-b capitalize">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg">
                                  {train.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 border-b">
                                {formatDate(train.createdAt)}
                              </td>
                              <td className="px-4 py-3 border-b text-center">
                                {train.workers?.length || 0}
                              </td>

                              {selected === "acca" ? (
                                <>
                                  <td
                                    className={`px-4 py-3 border-b text-center rounded ${
                                      manpowerDiff < 0
                                        ? "text-red-600 font-bold"
                                        : manpowerDiff > 0
                                        ? "text-green-600 font-bold"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {Math.abs(manpowerDiff)}
                                  </td>

                                  <td
                                    className={`px-4 py-3 border-b text-center ${
                                      bedsheetDiff > 0
                                        ? "text-red-600 font-bold"
                                        : bedsheetDiff < 0
                                        ? "text-green-600 font-bold"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {Math.abs(bedsheetDiff)}
                                  </td>
                                </>
                              ) : (
                                <td
                                  className={`px-4 py-3 border-b text-center ${
                                    manpowerDiff < 0
                                      ? "text-red-600 font-bold"
                                      : manpowerDiff > 0
                                      ? "text-green-600 font-bold"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {manpowerDiff}
                                </td>
                              )}

                              <td className="px-4 py-3 border-b">
                                {train.supervisor
                                  ? supervisors.find(
                                      (sup) => sup._id === train.supervisor
                                    )?.name || "Unknown"
                                  : "Not Assigned"}
                              </td>

                              <td className="px-4 py-3 border-b">
                                <Link
                                  to={`/dashboard/admin/ers/traindetails/${train._id}`}
                                  className="text-blue-600 hover:underline flex items-center gap-2"
                                >
                                  Details <FaEdit />
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={selected === "acca" ? 8 : 7}
                        className="text-center py-6 text-gray-500"
                      >
                        No completed trains found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Completedtrain;
