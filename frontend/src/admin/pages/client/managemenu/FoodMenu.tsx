import React, { useState } from "react";
import Breadcrumb from "../../../components/breadcrums";
import Header from "../../../layouts/header";
import Sidemenu from "../../../layouts/sidemenu";

interface FoodItem {
  name: string;
  description: string;
  price: string;
  image: string;
}

const FoodMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([
    { name: "Grilled Chicken Cheeseburger", description: "Delicious Chicken with 150g of Meat", price: "$25", image: "/images/chicken_burger.jpg" },
    { name: "Tendercrisp Bacon Cheeseburger", description: "Tendercrisp Bacon with 200g Chicken", price: "$30", image: "/images/bacon_burger.jpg" },
    { name: "Double Bacon Cheeseburger", description: "Bacon Burger with 200g of Meat", price: "$35", image: "/images/double_bacon.jpg" },
    { name: "Double Angus & Bacon Cheeseburger", description: "Best Burger in Town with 350g of Meat", price: "$50", image: "/images/angus_bacon.jpg" },
    { name: "Smokey BBQ Angus Burger", description: "Try Smokey BBQ Angus Burger with...", price: "$55", image: "/images/bbq_angus.jpg" },
    { name: "Fiery Angus Burger", description: "Best Angus Meets Best Burger", price: "$50", image: "/images/fiery_angus.jpg" },
  ]);

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
          marginTop: '0',
        }}
      >
        <Breadcrumb title="Food Menu" active="Menu" />

        {/* Featured Products Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Featured Products</h2>
          <div className="grid grid-cols-3 gap-4">
            {menuItems.slice(0, 3).map((item, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-md bg-white">
                <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded" />
                <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-lg font-bold mt-2">{item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Special Burgers Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Special Burgers</h2>
          <div className="grid grid-cols-3 gap-4">
            {menuItems.slice(3).map((item, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-md bg-white">
                <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded" />
                <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-lg font-bold mt-2">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodMenu;
