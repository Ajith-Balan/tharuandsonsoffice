import React from "react";
import Layout from "../../components/layout/Layout";
import Adminpanel from "../../components/layout/Adminpanel";
import { Link } from "react-router-dom";

const Allsites = () => {
  const sites = [
    {
      name: "ERS",
      manager: "Kiran Binoy",
      phone: "9876543210",
      link: "/dashboard/admin/ers/bills",
    },
  ];

  return (
    <Layout title="All Sites">
      <div className="bg-gray-100 min-h-screen">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <Adminpanel />

          {/* Main Content */}
          <div className="flex-1 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left">
              All Sites
            </h1>

            <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Site Name</th>
                    <th className="py-3 px-4 text-left">Manager Name</th>
                    <th className="py-3 px-4 text-left">Manager Phone</th>
                  </tr>
                </thead>

                <tbody>
                  {sites.map((site, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-indigo-100 transition`}
                    >
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        <Link
                          to={site.link}
                          className="text-indigo-600 hover:underline"
                        >
                          {site.name}
                        </Link>
                      </td>

                      <td className="py-3 px-4 text-gray-700">
                        {site.manager}
                      </td>

                      <td className="py-3 px-4 text-gray-700">
                        {site.phone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Allsites;
