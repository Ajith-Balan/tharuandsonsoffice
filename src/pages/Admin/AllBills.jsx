
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import Adminpanel from "../../components/layout/Adminpanel";
import axios from "axios";
import { useAuth } from "../../context/Auth";


import React,{useState,useEffect} from 'react'
import Layout from '../../components/layout/Layout'
import Adminpanel from '../../components/layout/Adminpanel'
import axios from 'axios'
import { useAuth } from '../../context/Auth'

const AllBills = () => {
  const [auth] = useAuth();
  const [bills, setBills] = useState([]);

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

  // Status color mapping
  const statusColor = {
    "Processing": "bg-yellow-100 text-yellow-700",
    "Passed to Division": "bg-blue-100 text-blue-700",
    "Bill Passed": " bg-green-100 text-green-700"
  }

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
        <Adminpanel />

        <div className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ernakulam Bills</h2>

          {bills.length === 0 && (
            <p className="text-gray-500 text-center mt-10">No bills found.</p>
          )}

          {/* Bills List */}
          <div className="space-y-6">
            {bills.map((bill, index) => (
              <div
                key={bill._id || index}
                className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Top Row */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Month: {bill.month}
                  </h3>

                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      statusColor[bill.status] || "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {bill.status}
                  </span>
                </div>

                <hr className="my-3 border-gray-200" />

                {/* Details Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500">Bill Value</span>
                    <span className="font-medium text-gray-800">
                      ₹{bill.billvalue}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-500">Net Amount</span>
                    <span className="font-medium text-gray-800">
                      ₹{bill.netamount}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-500">Penalty</span>
                    <span className="font-medium text-gray-800">
                      ₹{bill.penalty}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-500">Work</span>
                    <span className="font-medium text-gray-800">{bill.work}</span>
                  </div>
                </div>

                {/* Bottom Buttons (Optional) */}
          
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllBills;
