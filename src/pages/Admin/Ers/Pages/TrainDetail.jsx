import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/layout/Layout';
import axios from 'axios';
import { useAuth } from '../../context/Auth';
import { useParams } from 'react-router-dom';
import { FaEdit, FaSave } from 'react-icons/fa';
import AdminMenu from '../../components/layout/AdminMenu'

const TrainDetails = () => {
  const [auth] = useAuth();
  const { id } = useParams();
  const [supervisors, setSupervisors] = useState([]);
  const [supervisorName, setSupervisorName] = useState("");
  const [liveTrains, setLiveTrains] = useState({});
  const [allWorkers, setAllWorkers] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [loading, setLoading] = useState(false);

  const workerMap = useMemo(() => {
    const map = {};
    allWorkers.forEach((w) => {
      map[w._id] = w.name;
    });
    return map;
  }, [allWorkers]);

  useEffect(() => {
    if (auth?.user) getLiveTrain();
  }, [auth?.user]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND}/api/v1/worker/get-workers`
        );
        setAllWorkers(res.data);
      } catch (err) {
        console.error('Failed to fetch workers:', err);
      }
    };
    fetchWorkers();
  }, []);

  const getLiveTrain = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/getone-mcctrain/${id}`
      );
      setLiveTrains(res.data);
    } catch (err) {
      console.error('Error fetching train:', err);
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

  useEffect(() => { fetchSupervisors(); }, []);

  useEffect(() => {
    if (liveTrains?.supervisor && supervisors.length > 0) {
      const sup = supervisors.find((s) => s._id === liveTrains.supervisor);
      setSupervisorName(sup ? sup.name : "Not Assigned");
    }
  }, [liveTrains, supervisors]);

  const handleEditClick = (train) => {
    const detailed = (train.workers || []).map((workerId) =>
      allWorkers.find((w) => w._id === workerId)
    ).filter(Boolean);

    setEditRowId(train._id);
    setEditableData({
      ...train,
      workerSearch: '',
      workersDetailed: detailed,
      workers: train.workers || [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async (trainId) => {
 if (!window.confirm("Are you sure you want to update this Duty?")) return;

    try {
      const updateData = { ...editableData };
      delete updateData.workerSearch;
      await axios.put(
        `${import.meta.env.VITE_APP_BACKEND}/api/v1/mcctrain/update-mcctrain/${trainId}`,
        updateData
      );
      setEditRowId(null);
      getLiveTrain();
    } catch (err) {
      console.error('Error saving train:', err);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white shadow-md">
          <AdminMenu />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-6 mx-auto w-full">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">Live Work Details</h1>
              {editRowId === liveTrains._id ? (
                <button
                  onClick={() => handleSaveClick(liveTrains._id)}
                  className="bg-green-600 w-full md:w-auto text-white px-4 py-2 rounded flex items-center gap-2 justify-center"
                >
                  <FaSave /> Save
                </button>
              ) : (
                <button
                  onClick={() => handleEditClick(liveTrains)}
                  className="bg-yellow-500 w-full md:w-auto text-white px-4 py-2 rounded flex items-center gap-2 justify-center"
                >
                  <FaEdit /> Edit
                </button>
              )}
            </div>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <div className="space-y-4">
                {/* Created & Updated */}
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span className="font-medium">Created:</span>
                    <span>
                      {new Date(liveTrains.createdAt).toLocaleString('en-GB', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕒</span>
                    <span className="font-medium">Updated:</span>
                    <span>
                      {new Date(liveTrains.updatedAt).toLocaleString('en-GB', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true
                      })}
                    </span>
                  </div>
                </div>

                {/* Train No */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Train No</label>
                  {editRowId === liveTrains._id ? (
                    <input
                      type="text"
                      name="trainno"
                      value={editableData.trainno || ''}
                      onChange={handleInputChange}
                      className="border p-2 w-full rounded"
                    />
                  ) : (
                    <p className="text-gray-800">{liveTrains.trainno}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Status</label>
                  {editRowId === liveTrains._id ? (
                    <select
                      name="status"
                      value={editableData.status || ''}
                      onChange={handleInputChange}
                      className="border p-2 w-full rounded"
                    >
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    <p className="capitalize text-gray-800">{liveTrains.status}</p>
                  )}
                </div>

                {/* Supervisor */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Supervisor</label>
                  <p className="capitalize text-gray-800">{supervisorName}</p>
                </div>

                {/* Total Coaches */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Total Coaches</label>
                  {editRowId === liveTrains._id ? (
                    <input
                      type="number"
                      name="totalcoach"
                      value={editableData.totalcoach || ''}
                      onChange={handleInputChange}
                      className="border p-2 w-full rounded"
                    />
                  ) : (
                    <p className="text-gray-800">{liveTrains.totalcoach}</p>
                  )}
                </div>

                {/* Workers */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Assigned Workers</label>
                  {editRowId === liveTrains._id ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {(editableData.workersDetailed || []).map(worker => (
                          <span
                            key={worker._id}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1"
                          >
                            {worker.name}
                            <button
                              onClick={() => {
                                const updated = editableData.workersDetailed.filter(w => w._id !== worker._id);
                                setEditableData({
                                  ...editableData,
                                  workersDetailed: updated,
                                  workers: updated.map(w => w._id),
                                });
                              }}
                              className="text-red-500 font-bold"
                            >&times;</button>
                          </span>
                        ))}
                      </div>

                      <input
                        type="text"
                        placeholder="Search workers"
                        value={editableData.workerSearch || ''}
                        onChange={(e) => setEditableData(prev => ({ ...prev, workerSearch: e.target.value }))}
                        className="border p-2 w-full rounded"
                      />

                      {editableData.workerSearch && (
                        <ul className="border rounded bg-white max-h-40 overflow-y-auto">
                          {allWorkers
                            .filter(
                              w => w.name.toLowerCase().includes(editableData.workerSearch.toLowerCase()) &&
                                !editableData.workersDetailed?.some(sel => sel._id === w._id)
                            )
                            .map(worker => (
                              <li
                                key={worker._id}
                                onClick={() => {
                                  const updated = [...(editableData.workersDetailed || []), worker];
                                  setEditableData({
                                    ...editableData,
                                    workersDetailed: updated,
                                    workers: updated.map(w => w._id),
                                    workerSearch: '',
                                  });
                                }}
                                className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                              >
                                {worker.name}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(liveTrains.workers || []).map(workerId => (
                        <span
                          key={workerId}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                        >
                          {workerMap[workerId] || 'Unknown'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrainDetails;
