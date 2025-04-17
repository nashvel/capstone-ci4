import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Breadcrumb from "../../../components/breadcrums";
import Header from "../../../layouts/header";
import Sidemenu from "../../../layouts/sidemenu";

interface Promo {
  code: string;
  discount: string;
  validity: string;
  foodItem: string;
}

const PromoPage: React.FC = () => {
  const [promos, setPromos] = useState<Promo[]>([
    { code: "WELCOME10", discount: "-25php", validity: "2025-06-30", foodItem: "Burger" },
    { code: "SUMMER20", discount: "-50php", validity: "2025-07-31", foodItem: "Pizza" },
  ]);

  const [newPromo, setNewPromo] = useState<Promo>({ code: "", discount: "", validity: "", foodItem: "" });
  const reportRef = useRef<HTMLDivElement>(null);

  // Handle adding a new promo
  const handleAddPromo = () => {
    if (newPromo.code && newPromo.discount && newPromo.validity && newPromo.foodItem) {
      setPromos([...promos, newPromo]);
      setNewPromo({ code: "", discount: "", validity: "", foodItem: "" }); // Reset input fields
    }
  };

  // Function to export as PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Active Promotions & Coupons", 14, 10);

    autoTable(doc, {
      head: [["Promo Code", "Discount", "Valid Until", "Food Item"]],
      body: promos.map((promo) => [promo.code, promo.discount, promo.validity, promo.foodItem]),
    });

    doc.save("promo-list.pdf");
  };

  return (
    <>
      <Header />
      <Sidemenu />
      <div
        className="main-content app-content flex flex-col justify-start p-6 min-h-screen bg-gray-100"
        style={{
          background: 'linear-gradient(135deg, #f8e1e7, #ffffff, #f8e1e7, #d9e7ff, #fff7db)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginBottom: '0px',
          marginTop: '0px',
        }}
      >
        <Breadcrumb title="Promo Management" active="Promos" />

        <div ref={reportRef} className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Add Promo / Coupon</h2>

          {/* Add Promo Form */}
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              placeholder="Promo Code"
              className="border p-2 rounded w-1/4"
              value={newPromo.code}
              onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
            />
            <input
              type="text"
              placeholder="Discount (e.g., -50php)"
              className="border p-2 rounded w-1/4"
              value={newPromo.discount}
              onChange={(e) => setNewPromo({ ...newPromo, discount: e.target.value })}
            />
            <input
              type="date"
              className="border p-2 rounded w-1/4"
              value={newPromo.validity}
              onChange={(e) => setNewPromo({ ...newPromo, validity: e.target.value })}
            />
            <input
              type="text"
              placeholder="Food Item (optional)"
              className="border p-2 rounded w-1/4"
              value={newPromo.foodItem}
              onChange={(e) => setNewPromo({ ...newPromo, foodItem: e.target.value })}
            />
            <button
              onClick={handleAddPromo}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Promo
            </button>
          </div>

          {/* Promo Table */}
          <table id="promo-table" className="border-collapse border w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Promo Code</th>
                <th className="border p-2">Discount</th>
                <th className="border p-2">Valid Until</th>
                <th className="border p-2">Food Item</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo, index) => (
                <tr key={index} className="border">
                  <td className="border p-2">{promo.code}</td>
                  <td className="border p-2">{promo.discount}</td>
                  <td className="border p-2">{promo.validity}</td>
                  <td className="border p-2">{promo.foodItem}</td>
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
              Print Promo List
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

export default PromoPage;