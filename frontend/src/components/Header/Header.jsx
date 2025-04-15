import React from "react";
import "./header.css";
function Header() {
  return (
    <>
      <div className="header">
        <div className="header-backdrop">
          <div className="header-content">
          <h2>Multi Cuisine Food Delivery</h2>
          <p>
          Order delicious cuisines online now! Choose from a variety of options, including savory dumplings, flavorful stir-fries, aromatic noodle dishes, and more. Treat yourself to authentic flavors delivered straight to your door.
          </p>
          <a href="#explore-menu"><button>View Restaurants &nbsp; &rarr;</button></a>
        </div> 
        </div>
       
      </div>
    </>
  );
}

export default Header;
