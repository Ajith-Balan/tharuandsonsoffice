import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import AdminMenu from "../../components/layout/AdminMenu";
import { FaEdit, FaSave, FaTrash ,FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const Billdetails = () => {
  const [auth] = useAuth();
  const [bills, setBills] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [activeTab, setActiveTab] = useState("mcc");

  const TABS = [
    { id: "mcc", label: "MCC" },
    { id: "acca", label: "ACCA" },
    { id: "bio", label: "BIO" },
    { id: "pftr", label: "PFTR" },
    { id: "laundry", label: "Laundry" },
    { id: "pit & yard", label: "Pit & Yard" },
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

  useEffect(() => {
    if (auth?.user) fetchBills();
  }, [auth?.user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/delete-bill/${id}`
      );
      toast.success("Bill Deleted Successfully");
      fetchBills();
    } catch {
      toast.error("Error deleting bill");
    }
  };

  const handleEditClick = (bill) => {
    setEditId(bill._id);
    setEditedData({
      netamount: bill.netamount,
      billvalue: bill.billvalue,
      penalty: bill.penalty,
      consumedcoach: bill.consumedcoach,
      status: bill.status || "",
    });
  };

  const handleInputChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () => {
  setEditId(null); // exits edit mode
};


  const handleSaveClick = async (id) => {
        if (!window.confirm("Are you sure you want to Update this bill?")) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/update-bill/${id}`,
        editedData
      );
      toast.success("Bill Updated Successfully");
      setEditId(null);
      fetchBills();
    } catch {
      toast.error("Error updating bill");
    }
  };

  const filteredBills = bills.filter(
    (b) => b.work?.toLowerCase() === activeTab.toLowerCase()
  );

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

  const lastPassedMonth =
    passedBills.length > 0
      ? new Date(passedBills[passedBills.length - 1].month).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })
      : "No bills passed yet";



  return (
    <Layout title="Bill Details - Manager">
      <div className="flex flex-col lg:flex-row bg-gray-100 min-h-screen">
        <AdminMenu />
        <main className="flex-1 p-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-0">
              Bill Details
            </h1>
            <Link
              to="/dashboard/manager/addbills"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Add Bill
            </Link>
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
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h2 className="text-gray-700 font-semibold">Bill Value</h2>
              <p className="text-blue-600 font-bold">{totalBillValue}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h2 className="text-gray-700 font-semibold">Net Amount</h2>
              <p className="text-green-600 font-bold">{totalNetAmount}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <h2 className="text-gray-700 font-semibold">Penalty</h2>
              <p className="text-red-600 font-bold">{totalPenalty}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
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
                      <th className="px-3 py-2 border text-center">Actions</th>
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
                          )}
                        </td>

                        {["billvalue", "netamount", "penalty", ].map(
                          (field) => (
                            <td key={field} className="px-3 py-2 border text-center">
                              {editId === bill._id ? (
                                <input
                                  type="number"
                                  name={field}
                                  value={editedData[field]}
                                  onChange={handleInputChange}
                                  className="border rounded px-2 py-1 w-20 text-center"
                                />
                              ) : (
                                bill[field]
                              )}
                            </td>
                          )
                        )}

                        <td className="px-3 py-2 border text-center">
                          {editId === bill._id ? (
                            <select
                              name="status"
                              value={editedData.status}
                              onChange={handleInputChange}
                              className="border rounded px-2 py-1"
                            >
                              <option value="">-- Select --</option>
                              <option value="Processing">Processing</option>
                              <option value="Passed to Division">
                                Passed to Division
                              </option>
                              <option value="Accounts">Accounts</option>
                              <option value="Bill Passed">Bill Passed</option>
                            </select>
                          ) : (
                            <span
                              className={`${
                                bill.status === "Bill Passed"
                                  ? "text-green-600 font-semibold"
                                  : "text-gray-600"
                              }`}
                            >
                              {bill.status || "N/A"}
                            </span>
                          )}
                        </td>


<td className="px-3 py-2 border text-center">
  <div className="flex justify-center items-center gap-3">
    {editId === bill._id ? (
      <>
        <button
          onClick={() => handleSaveClick(bill._id)}
          className="text-green-600 hover:text-green-800 transition-colors"
          title="Save"
        >
          <FaSave size={18} />
        </button>
        <button
          onClick={handleCancelEdit}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Cancel"
        >
          <FaTimes size={18} />
        </button>
      </>
    ) : (
      <button
        onClick={() => handleEditClick(bill)}
        className="text-blue-600 hover:text-blue-800 transition-colors"
        title="Edit"
      >
        <FaEdit size={18} />
      </button>
    )}

    <button
      onClick={() => handleDelete(bill._id)}
      className="text-red-600 hover:text-red-800 transition-colors"
      title="Delete"
    >
      <FaTrash size={18} />
    </button>
  </div>
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
                      <div className="p-4">
                        {editId === bill._id ? (
                          <div>

                         
                          <button
                            onClick={() => handleSaveClick(bill._id)}
                            className="text-green-600 mx-1"
                          >
                            <FaSave />
                          </button>

                          <button
        onClick={handleCancelEdit}
        className="text-gray-500 mx-1"
      >
        <FaTimes /> {/* cancel icon */}
      </button>

       </div>
                          
                        ) : (
                          <button
                            onClick={() => handleEditClick(bill)}
                            className="text-blue-600 mx-1"
                          >
                            <FaEdit />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(bill._id)}
                          className="text-red-600 mx-1"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {["billvalue", "netamount", "penalty", ].map(
                      (field) => (
                        <p key={field} className="text-sm text-gray-700 mb-1">
                          <span className="font-medium capitalize">
                            {field.replace(/([A-Z])/g, " $1")}:
                          </span>{" "}
                          {editId === bill._id ? (
                            <input
                              type="number"
                              name={field}
                              value={editedData[field]}
                              onChange={handleInputChange}
                              className="border px-2 py-1 rounded w-1/2 ml-2"
                            />
                          ) : (
                            bill[field]
                          )}
                        </p>
                      )
                    )}

                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Status:</span>{" "}
                      {editId === bill._id ? (
                        <select
                          name="status"
                          value={editedData.status}
                          onChange={handleInputChange}
                          className="border rounded px-2 py-1 ml-2"
                        >
                          <option value="">-- Select --</option>
                          <option value="Processing">Processing</option>
                          <option value="Passed to Division">
                            Passed to Division
                          </option>
                          <option value="Accounts">Accounts</option>
                          <option value="Bill Passed">Bill Passed</option>
                        </select>
                      ) : (
                        <span
                          className={`${
                            bill.status === "Bill Passed"
                              ? "text-green-600 font-semibold"
                              : "text-gray-600"
                          }`}
                        >
                          {bill.status || "N/A"}
                        </span>
                      )}
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

export default Billdetails;
