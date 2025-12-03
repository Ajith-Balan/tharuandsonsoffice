import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import Adminpanel from "../../components/layout/Adminpanel";
import { FaEdit, FaSave, FaTrash ,FaTimes, FaFileInvoiceDollar, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

const AllBills = () => {
  const [auth] = useAuth();
  const [bills, setBills] = useState([]);
  const [billstvm, settvmBills] = useState([]);
  
  const [activeTab, setActiveTab] = useState("mcc");

  const TABS = [
    { id: "ERMCD", label: "ERMCD" },

  ];

  const fetchBills = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/getbills`
      );
      const sortedBills = (res.data.bills || []).sort(
        (a, b) => new Date(b.month + "-01") - new Date(a.month + "-01")
      );
      setBills(sortedBills);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

    const fetchBillstvm = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/getbillstvm`
      );
      const sortedBills = (res.data.bills || []).sort(
        (a, b) => new Date(b.month + "-01") - new Date(a.month + "-01")
      );
      settvmBills(sortedBills);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  useEffect(() => {
    if (auth?.user) {fetchBills();
      fetchBillstvm();
    }
  }, [auth?.user]);


  const formatINR = (num) =>
  num.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  });



  const filteredBills = [...bills, ...billstvm];

  const totalBillValue = filteredBills.reduce(
    (sum, b) => sum + (Number(b.billvalue) || 0),
    0
  );
  const totalNetAmount = filteredBills.reduce(
    (sum, b) => sum + (Number(b.netamount) || 0),
    0
  );
  const totalPenalty = filteredBills.reduce(
    (sum, b) => sum + (Number(b.penalty) || 0),
    0
  );
  const contractperiod =
    filteredBills.length > 0 ? filteredBills[0].contractperiod : "—";



 const pendingBills = filteredBills.filter((bill) => bill.status !== "Bill Passed");
  const passedBills = filteredBills.filter((bill) => bill.status === "Bill Passed");
const passedBillsSorted = [...passedBills].sort(
  (a, b) => new Date(a.month) - new Date(b.month)
);

const lastPassedMonth = passedBillsSorted.length
  ? new Date(passedBillsSorted.at(-1).month).toLocaleString("default", {
      month: "long",
      year: "numeric",
    })
  : "No bills passed yet";


  return (
    <Layout title="Bill Details - Admin">
      <div className="flex flex-col lg:flex-row bg-gray-100 min-h-screen">
        <Adminpanel/>
        <main className="flex-1 p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-0">
              Bill Details
            </h1>
       
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white shadow-md text-center     rounded-2xl p-6 border-l-4 text-blue-600 hover:shadow-lg transition-transform hover:scale-[1.02]">
               <FaFileInvoiceDollar className="text-green-500 " />
              <h2 className="text-gray-700 font-semibold">Bill Value</h2> 
              <p className="text-blue-600 font-bold">{formatINR(totalBillValue)}</p>
            </div>
            <div className="bg-white shadow-md text-center     rounded-2xl p-6 border-l-4 text-green-600 hover:shadow-lg transition-transform hover:scale-[1.02]">
               <FaFileInvoiceDollar className="text-green-500  mr-4" />
              <h2 className="text-gray-700 font-semibold">Net Amount</h2>
              <p className="text-green-600 font-bold">{formatINR(totalNetAmount)}</p>
            </div>
            <div className="bg-white shadow-md text-center     rounded-2xl p-6 border-l-4 text-red-600 hover:shadow-lg transition-transform hover:scale-[1.02]">
                   <FaExclamationTriangle className="text-red-500  mr-4" />
              <h2 className="text-gray-700 font-semibold">Penalty</h2>
              <p className="text-red-600 font-bold">{formatINR(totalPenalty)}</p>
            </div>
            <div className="bg-white shadow-md text-center     rounded-2xl p-6 border-l-4 text-purple-600 hover:shadow-lg transition-transform hover:scale-[1.02]">
              <h2 className="text-gray-700 font-semibold">Contract Period</h2>
              <p className="text-purple-600 font-bold">{contractperiod}</p>
            </div>
          </div>

                  {/* ====== Summary Section ====== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-2xl shadow-md text-center">
            <h2 className="text-gray-600 text-sm">Last Passed Bill Month</h2>
            <p className="text-lg font-semibold text-gray-800 mt-1">{lastPassedMonth}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-md text-center">
            <h2 className="text-gray-600 text-sm">Pending Bills</h2>
            <p className="text-lg font-semibold text-red-600 mt-1">{pendingBills.length}</p>
          </div>
        </div>

          {/* Bills */}
          {filteredBills.length === 0 ? (
            <p className="text-gray-600 text-center">
              No bills found for {activeTab.toUpperCase()}.
            </p>
          ) : (
            <>
              {/* 💻 Desktop / Tablet View */}
              <div className="hidden sm:block overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
                <table className="min-w-full text-sm text-gray-700">
                  <thead className="bg-gray-100 text-gray-800">
                    <tr>
                      <th className="px-3 py-2 border">Month</th>
                      <th className="px-3 py-2 border">Bill Value</th>
                      <th className="px-3 py-2 border">Net Amount</th>
                      <th className="px-3 py-2 border">Penalty</th>
                      <th className="px-3 py-2 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBills.map((bill) => (
                      <tr
                        key={bill._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-2 border text-center">
                          {new Date(bill.month + "-01").toLocaleString(
                            "default",
                            { month: "long", year: "numeric" }
                          )
                          
                          }
                          <br />
                          <h2 className="bold">{bill.work}</h2>
                          
                        </td>

                        {["billvalue", "netamount", "penalty", ].map(
                          (field) => (
                            <td key={field} className="px-3 py-2 border text-center">
                            {(
                                formatINR(bill[field])
                              )}
                            </td>
                          )
                        )}

                        <td className="px-3 py-2 border text-center">
                           (
                            <span
                              className={`${
                                bill.status === "Bill Passed"
                                  ? "text-green-600 font-semibold"
                                  : "text-gray-600"
                              }`}
                            >
                              {bill.status || "N/A"}
                            </span>
                          )
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 📱 Mobile View - Card Layout */}
              <div className="block sm:hidden space-y-4">
                {filteredBills.map((bill) => (
                  <div
                    key={bill._id}
                    className="bg-white p-4 rounded-lg shadow border border-gray-200"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700">
                        {new Date(bill.month + "-01").toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                     
                    </div>

                    {["billvalue", "netamount", "penalty", ].map(
                      (field) => (
                        <p key={field} className="text-sm text-gray-700 mb-1">
                          <span className="font-medium capitalize">
                            {field.replace(/([A-Z])/g, " $1")}:
                          </span>{" "}
                          ({
                            formatINR(bill[field])
                          }
                          )
                        </p>
                      )
                    )}

                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Status:</span>{" "}
                    (
                        <span
                          className={`${
                            bill.status === "Bill Passed"
                              ? "text-green-600 font-semibold"
                              : "text-gray-600"
                          }`}
                        >
                          {bill.status || "N/A"}
                        </span>
                      )
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default AllBills;
