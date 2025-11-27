import React from "react";
import Layout from "../../components/Layout/Layout";
import Adminpanel from "../../components/layout/Adminpanel";

const Allsites = () => {
  // Example site data — you can later fetch this from your backend
  const sites = [
    { name: "ERS", manager: "Ramesh Kumar", phone: "9876543210" },
    { name: "TVM", manager: "Anil Raj", phone: "9123456780" },
    { name: "KLM", manager: "Vijay Menon", phone: "9988776655" },
    { name: "EKM", manager: "Arun Dev", phone: "9090909090" },
  ];

  return (
    <Layout title="All Sites">
      <div className=" bg-gray-50   sm:px-6 lg:px-8">
       

        <div className=" flex flex-col lg:flex-row min-h-screen bg-gray-100">
          <Adminpanel/>
           <h1 className="text-2xl sm:text-3xl my-10 font-bold text-gray-800  text-center">
          All Sites
        </h1>
          <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Site Name</th>
                <th className="py-3 px-4 text-left">Manager Name</th>
                <th className="py-3 px-4 text-left">Manager Number</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-indigo-50 transition`}
                >
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {site.name}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{site.manager}</td>
                  <td className="py-3 px-4 text-gray-700">{site.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Allsites;
