import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/Auth";
import * as XLSX from "xlsx";
import AdminMenu from "../../components/layout/AdminMenu";

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
    if (trainCount === 3) return "P3";
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
        {/* <AdminMenu /> */}

        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
          <h1 className="text-xl font-bold">
            Attendance - {new Date(selectedYear, selectedMonth).toLocaleString("default", { month: "long" })} {selectedYear}
          </h1>

          <div className="flex items-center gap-2">
            <select
              value={`${selectedMonth}-${selectedYear}`}
              onChange={(e) => {
                const [m, y] = e.target.value.split("-");
                setSelectedMonth(parseInt(m));
                setSelectedYear(parseInt(y));
              }}
              className="border p-2 rounded"
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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
              className={`px-4 py-2 rounded ${
                activeTab === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {category.toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading data...</p>
        ) : filteredWorkers.length === 0 ? (
          <p>No workers in this category.</p>
        ) : (
         <div className="overflow-auto max-h-[70vh] border rounded-lg">
  <table className="min-w-full table-auto border border-gray-300">
    <thead>
      <tr className="bg-gray-100">
        <th className="border p-2 sticky left-0 top-0 bg-gray-100 z-10">
          Name
        </th>
        {daysArray.map((day) => (
          <th
            key={day}
            className="border p-2 text-sm sticky top-0 bg-gray-100 z-10"
          >
            {day}
          </th>
        ))}
        <th className="border p-2 text-sm sticky top-0 bg-gray-100 z-10">
          Total
        </th>
      </tr>
    </thead>

    <tbody>
      {filteredWorkers.map((worker) => {
        let total = 0;
        const dayStatus = daysArray.map((day) => {
          const status = getAttendanceStatus(worker._id, day);
          if (status === "P") total += 1;
          else if (status === "P2") total += 2;
          else if (status === "P3") total += 3;
          else if (status === "P4") total += 4;
          return status;
        });

        return (
          <tr key={worker._id}>
            <td className="border p-2 sticky left-0 bg-white font-medium z-10">
              {worker.name}
            </td>
            {dayStatus.map((status, index) => (
              <td
                key={index}
                className={`border p-1 text-center text-sm ${
                  status === "A"
                    ? "bg-red-100 text-red-600"
                    : status.startsWith("P")
                    ? "bg-green-100 text-green-700"
                    : "text-gray-400"
                }`}
              >
                {status}
              </td>
            ))}
            <td className="border p-1 text-center font-semibold">{total}</td>
          </tr>
        );
      })}
    </tbody>

    {/* ✅ Total Row */}
    <tfoot>
      <tr className="bg-gray-50 font-semibold">
        <td className="border p-2 sticky left-0 bg-gray-50 z-10">Total</td>
        {daysArray.map((day, index) => {
          let totalPresent = 0;
          filteredWorkers.forEach((worker) => {
            const status = getAttendanceStatus(worker._id, day);
            if (status === "P") totalPresent += 1;
            else if (status === "P2") totalPresent += 1;
            else if (status === "P3") totalPresent += 1;
            else if (status === "P4") totalPresent += 1;
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

        {/* ✅ Grand Total */}
        <td className="border p-1 text-center text-blue-800 font-bold">
          {filteredWorkers.reduce((sum, worker) => {
            return (
              sum +
              daysArray.reduce((count, day) => {
                const status = getAttendanceStatus(worker._id, day);
                if (status === "P") return count + 1;
                if (status === "P2") return count + 2;
                if (status === "P3") return count + 3;
                if (status === "P4") return count + 4;
                return count;
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
