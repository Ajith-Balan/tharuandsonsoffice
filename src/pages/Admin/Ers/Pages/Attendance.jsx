import React, { useState, useEffect } from "react";
import Layout from "../../../../components/layout/Layout";
import axios from "axios";
import { useAuth } from "../../../../context/Auth";
import * as XLSX from "xlsx";
import AdminMenu from "../AdminMenu";
import { RiArrowGoBackFill } from "react-icons/ri";
import { Link } from "react-router-dom";
const Attendance = () => {
  const [auth] = useAuth();
  const [allWorkers, setAllWorkers] = useState([]);
  const [completedTrains, setCompletedTrains] = useState([]);
  const [loading, setLoading] = useState(false);

  const workCategories = ["MCC", "ACCA", "BIO", "Laundry", "PFTR", "Pit & yard"];
  const [activeTab, setActiveTab] = useState(workCategories[0]);

  // Get current date and prepare month options (current + previous 2)
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const monthOptions = Array.from({ length: 3 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return {
      label: date.toLocaleString("default", { month: "long", year: "numeric" }),
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  });

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const fetchWorkers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/worker/get-workers`
      );
      setAllWorkers(res.data || []);
    } catch (err) {
      console.error("Error fetching workers:", err);
    }
  };

  const fetchCompletedTrains = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/get-completedmcctrain`
      );
      const completed = res.data?.filter((train) => train.status === "completed");
      setCompletedTrains(completed || []);
    } catch (err) {
      console.error("Error fetching completed trains:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      fetchWorkers();
      fetchCompletedTrains();
    }
  }, [auth?.user]);

  const getAttendanceStatus = (workerId, day) => {
    const today = new Date();
    const isFutureDate =
      selectedYear === today.getFullYear() &&
      selectedMonth === today.getMonth() &&
      day > today.getDate();
    if (isFutureDate) return "-";

    const trainCount = completedTrains.filter((train) => {
      const trainDate = new Date(train.createdAt);
      return (
        trainDate.getDate() === day &&
        trainDate.getMonth() === selectedMonth &&
        trainDate.getFullYear() === selectedYear &&
        train.workers?.includes(workerId)
      );
    }).length;

    if (trainCount === 0) return "A";
    if (trainCount === 1) return "P";
    if (trainCount === 2) return "P2";
    if (trainCount === 4) return "P4";
    if (trainCount === 5) return "P5";
    if (trainCount === 6) return "P6";
    return "P";
  };

  const downloadExcel = () => {
    const monthName = new Date(selectedYear, selectedMonth).toLocaleString("default", { month: "long" });
    const title = `Attendance - ${monthName} ${selectedYear}`;
    const header = ["Name", ...daysArray.map((day) => `${day}`), "Total"];

    const categoryWorkers = allWorkers.filter(
      (w) => w.work?.toLowerCase() === activeTab.toLowerCase()
    );

    const data = categoryWorkers.map((worker) => {
      let total = 0;
      const row = [worker.name];
      daysArray.forEach((day) => {
        const status = getAttendanceStatus(worker._id, day);
        row.push(status);
        if (status === "P") total += 1;
        else if (status === "P2") total += 2;
        else if (status === "P3") total += 3;
         else if (status === "P4") total += 4;
          else if (status === "P5") total += 5;
      });
      row.push(total);
      return row;
    });

    const worksheetData = [[title], header, ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    worksheet["!cols"] = [{ wch: 20 }, ...daysArray.map(() => ({ wch: 4 })), { wch: 6 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `Attendance_${activeTab}_${monthName}_${selectedYear}.xlsx`);
  };

  const filteredWorkers = allWorkers.filter(
    (worker) => worker.work?.toLowerCase() === activeTab.toLowerCase()
  );

  return (
  <Layout title="Attendance - Manager">
    <div className="p-4">
      

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6 mt-3 bg-white p-4 rounded-xl shadow">
       <Link 
  to="/dashboard/admin/ers/bills"
  className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black"
>
  <RiArrowGoBackFill className="text-lg" />
  Go Back
</Link>

        <h1 className="text-2xl font-bold text-gray-800">
          Attendance -{" "}
          {new Date(selectedYear, selectedMonth).toLocaleString("default", {
            month: "long",
          })}{" "}
          {selectedYear}
        </h1>

        <div className="flex items-center gap-3">
          <select
            value={`${selectedMonth}-${selectedYear}`}
            onChange={(e) => {
              const [m, y] = e.target.value.split("-");
              setSelectedMonth(parseInt(m));
              setSelectedYear(parseInt(y));
            }}
            className="border p-2 rounded-lg shadow-sm focus:outline-none bg-gray-50"
          >
            {monthOptions.map((opt) => (
              <option
                key={`${opt.month}-${opt.year}`}
                value={`${opt.month}-${opt.year}`}
              >
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Download Excel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {workCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-4 py-2 rounded-lg transition font-semibold ${
              activeTab === category
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {category.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Main Table Container */}
      {loading ? (
        <p className="text-gray-600 text-center py-6">Loading data...</p>
      ) : filteredWorkers.length === 0 ? (
        <p className="text-gray-600">No workers in this category.</p>
      ) : (
        <div className="overflow-auto max-h-[75vh] bg-white rounded-xl shadow border">
          <table className="min-w-full table-auto border-collapse">
            <thead className="sticky top-0 bg-gray-100 shadow-sm z-20">
              <tr>
                <th className="border p-2 sticky left-0 bg-gray-100 z-30 text-sm font-semibold">
                  Name
                </th>
                {daysArray.map((day) => (
                  <th
                    key={day}
                    className="border p-2 text-sm text-gray-700 font-semibold"
                  >
                    {day}
                  </th>
                ))}
                <th className="border p-2 text-sm font-semibold">Total</th>
              </tr>
            </thead>

            <tbody>
              {filteredWorkers.map((worker) => {
                let total = 0;
                const dayStatus = daysArray.map((day) => {
                  const status = getAttendanceStatus(worker._id, day);
                  if (status.startsWith("P")) {
                    const count = parseInt(status.replace("P", "")) || 1;
                    total += count;
                  }
                  return status;
                });

                return (
                  <tr
                    key={worker._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="border p-2 sticky left-0 bg-white z-10 font-medium text-gray-900">
                      {worker.name}
                    </td>

                    {dayStatus.map((status, index) => (
                      <td
                        key={index}
                        className={`border p-1 text-center text-sm font-medium
                          ${
                            status === "A"
                              ? "bg-red-100 text-red-600"
                              : status.startsWith("P")
                              ? "bg-green-100 text-green-700"
                              : "text-gray-400"
                          }
                        `}
                      >
                        {status}
                      </td>
                    ))}

                    <td className="border p-1 text-center font-semibold text-blue-800">
                      {total}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Footer Total Row */}
            <tfoot className="sticky bottom-0 bg-gray-50 shadow-inner">
              <tr className="font-semibold">
                <td className="border p-2 sticky left-0 bg-gray-50">
                  Total
                </td>

                {daysArray.map((day, index) => {
                  let totalPresent = 0;
                  filteredWorkers.forEach((worker) => {
                    const status = getAttendanceStatus(worker._id, day);
                    if (status.startsWith("P")) totalPresent += 1;
                  });
                  return (
                    <td
                      key={index}
                      className="border p-1 text-center text-sm text-blue-700"
                    >
                      {totalPresent}
                    </td>
                  );
                })}

                <td className="border p-1 text-center text-blue-900 font-bold">
                  {filteredWorkers.reduce((sum, worker) => {
                    return (
                      sum +
                      daysArray.reduce((cnt, day) => {
                        const s = getAttendanceStatus(worker._id, day);
                        const val = parseInt(s.replace("P", "")) || 0;
                        return cnt + val;
                      }, 0)
                    );
                  }, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  </Layout>
);

};

export default Attendance;
