import React, { useState,useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import {
  FaFileInvoiceDollar,
  FaExclamationTriangle,
  FaUsers,
  FaMapMarkedAlt,
  FaBars,
  FaFilter,
  FaRupeeSign 
} from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { BsCalendar2Event } from "react-icons/bs";
import Adminpanel from "../../components/layout/Adminpanel";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import axios from "axios";
const Dashboard = () => {
    const [auth] = useAuth();
  
    const [open, setOpen] = useState(false);
  const [bills, setBills] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

const [selected, setSelected] = useState("all");

  const sites = ["All","ERS"];
  const formatINR = (num) =>
  num.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  });

const stats = {
  totalBillValue: bills.reduce((sum, b) => sum + (b.billvalue || 0), 0),

  totalPenalty: bills.reduce((sum, b) => sum + (b.penalty || 0), 0),

  totalSites: [
    { name: "ERS", count: 1 },
  ],

  totalManagers: 1,

  passedBills: bills.filter(b => b.status === "Bill Passed").length,

  pendingBills: bills.filter(b => b.status !== "Bill Passed").length,

  expiringContracts: 4,
};




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

  useEffect(() => {
    if (auth?.user) fetchBills();
  }, [auth?.user]);


  return (
    <Layout title="Admin Dashboard">
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
     
          <Adminpanel />
        
        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
       <div className="relative inline-block">
      {/* Filter button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
      >
        <FaFilter size={16} />
        {selected}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute mt-2 w-40 bg-white shadow-lg rounded-xl border border-gray-200 z-50">
          {sites.map((site, index) => (
            <button
              key={index}
              onClick={() => {
                setSelected(site);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 border-b last:border-none transition-all duration-200
                ${
                  selected === site
                    ? "bg-blue-600 text-white font-semibold"
                    : "bg-white text-gray-700 hover:bg-blue-50"
                }`}
            >
              {site}
            </button>
          ))}
        </div>
      )}
    </div>
        

          {/* Heading */}
          <h1 className="hidden lg:block text-3xl font-bold text-gray-800 mb-8 text-center">
            Admin Dashboard Overview
          </h1>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Total Bill */}
            <div className="bg-white shadow-md rounded-2xl p-6 border-l-4 border-green-500 hover:shadow-lg transition-transform hover:scale-[1.02]">
              <div className="flex items-center">
                <FaFileInvoiceDollar className="text-green-500 text-4xl mr-4" />
                <div>
                  <p className="text-gray-500 text-sm">Total Bill Value</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                   <FaRupeeSign className="text-xl" /> {formatINR(stats.totalBillValue)}
                  </h2>
                </div>
              </div>
            </div>

            {/* Total Penalty */}
            <div className="bg-white shadow-md rounded-2xl p-6 border-l-4 border-red-500 hover:shadow-lg transition-transform hover:scale-[1.02]">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-500 text-4xl mr-4" />
                <div>
                  <p className="text-gray-500 text-sm">Total Penalty</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                  <FaRupeeSign className="text-xl" />  {formatINR(stats.totalPenalty)}
                  </h2>
                </div>
              </div>
            </div>

            {/* Total Sites */}
            <Link to={'allsites'} className="bg-white shadow-md rounded-2xl p-6 border-l-4 border-blue-500 hover:shadow-lg transition-transform hover:scale-[1.02]">
              <div className="flex items-center">
                <FaMapMarkedAlt className="text-blue-500 text-4xl mr-4" />
                <div>
                  <p className="text-gray-500 text-sm">Total Sites</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    1
                  </h2>
                </div>
              </div>
            </Link>

            {/* Total Managers */}
            {/* <div className="bg-white shadow-md rounded-2xl p-6 border-l-4 border-purple-500 hover:shadow-lg transition-transform hover:scale-[1.02]">
              <div className="flex items-center">
                <FaUsers className="text-purple-500 text-4xl mr-4" />
                <div>
                  <p className="text-gray-500 text-sm">Site Managers</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {stats.totalManagers}
                  </h2>
                </div>
              </div>
            </div> */}
          </div>

          {/* Middle Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {/* Passed Bills */}
            <div className="bg-gradient-to-r from-green-100 to-green-200 shadow-md rounded-2xl p-6 hover:shadow-lg transition-transform hover:scale-[1.02]">
              <div className="flex items-center">
                <FaFileInvoiceDollar className="text-green-700 text-3xl mr-4" />
                <div>
                  <p className="text-green-700 text-sm font-medium">
                    Passed Bills
                  </p>
                  <h2 className="text-2xl font-semibold text-green-900">
                    {stats.passedBills}
                  </h2>
                </div>
              </div>
            </div>

            {/* Pending Bills */}
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-md rounded-2xl p-6 hover:shadow-lg transition-transform hover:scale-[1.02]">
              <div className="flex items-center">
                <MdPendingActions className="text-yellow-600 text-3xl mr-4" />
                <div>
                  <p className="text-yellow-600 text-sm font-medium">
                    Pending Bills
                  </p>
                  <h2 className="text-2xl font-semibold text-yellow-800">
                    {stats.pendingBills}
                  </h2>
                </div>
              </div>
            </div>

            {/* Expiring Contracts */}
            {/* <div className="bg-gradient-to-r from-red-100 to-red-200 shadow-md rounded-2xl p-6 hover:shadow-lg transition-transform hover:scale-[1.02]">
              <div className="flex items-center">
                <BsCalendar2Event className="text-red-600 text-3xl mr-4" />
                <div>
                  <p className="text-red-600 text-sm font-medium">
                    Expiring Contracts (1 month)
                  </p>
                  <h2 className="text-2xl font-semibold text-red-800">
                    {stats.expiringContracts}
                  </h2>
                </div>
              </div>
            </div> */}
          </div>

          {/* Site Summary */}
          {/* <div className="mt-10 bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
              Site Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.totalSites.map((site, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition-transform hover:scale-[1.02]"
                >
                  <span className="text-gray-700 font-semibold">
                    {site.name}
                  </span>
                  <span className="text-lg font-bold text-blue-800">
                    {site.count}
                  </span>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
