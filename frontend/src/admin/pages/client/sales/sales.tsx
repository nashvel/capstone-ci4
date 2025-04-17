import React, { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Correct import
import Breadcrumb from "../../../components/breadcrums";
import Header from "../../../layouts/header";
import Sidemenu from "../../../layouts/sidemenu";

interface Sale {
  invoiceNo: string;
  date: string;
  foodItem: string;
  quantity: number;
  total: number;
}

// Updated sales data with quantity
const salesData: Sale[] = [
  { invoiceNo: "INV001", date: "2025-03-20", foodItem: "Kimchi Jiggae", quantity: 3, total: 550 },
  { invoiceNo: "INV002", date: "2025-03-20", foodItem: "Bibimbap", quantity: 13, total: 10580 },
  { invoiceNo: "INV003", date: "2025-03-19", foodItem: "Jjangmyeon", quantity: 41, total: 26000 },
  { invoiceNo: "INV004", date: "2025-03-18", foodItem: "Kimbap", quantity: 12, total: 1800 },
];

const SalesReport: React.FC = () => {
  const reportRef = useRef<HTMLDivElement>(null);

  // Function to export as PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Food Sales Report", 14, 10);

    autoTable(doc, {
      head: [["Invoice No", "Date", "Food Item", "Quantity", "Total (PHP)"]],
      body: salesData.map((sale) => [
        sale.invoiceNo,
        sale.date,
        sale.foodItem,
        sale.quantity,
        sale.total,
      ]),
    });

    doc.save("food-sales-report.pdf");
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div className="main-content app-content flex flex-col justify-start p-6 min-h-screen bg-gray-100"
              style={{
                background: 'linear-gradient(135deg, #f8e1e7, #ffffff, #f8e1e7, #d9e7ff, #fff7db)',
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}>
        <Breadcrumb title="Sales Report" active="POS" />

        <div ref={reportRef} className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Food Sales Report</h2>

          {/* Sales Table */}
          <table id="sales-table" className="border-collapse border w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Invoice No</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Food Item</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Total (PHP)</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale, index) => (
                <tr key={index} className="border">
                  <td className="border p-2">{sale.invoiceNo}</td>
                  <td className="border p-2">{sale.date}</td>
                  <td className="border p-2">{sale.foodItem}</td>
                  <td className="border p-2">{sale.quantity}</td>
                  <td className="border p-2">{sale.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Buttons for Printing and Exporting */}
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => window.print()}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Print Report
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Export as PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesReport;
