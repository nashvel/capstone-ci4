import React, { useContext, useState, useRef, useEffect } from "react";
import "./foodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const categories = ["What's NEW", "Bestseller Deals", "Noodles", "Beverages"];

function FoodDisplay({ category, setCategory }) {
  const { food_list, loading } = useContext(StoreContext);
  const [sortOrder, setSortOrder] = useState("asc");
  const foodDisplayRef = useRef(null);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowCategories(true), 500);
  }, []);

  useEffect(() => {
    if (category && category !== "All" && foodDisplayRef.current) {
      foodDisplayRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [category]);

  const handleSort = (event) => {
    setSortOrder(event.target.value);
  };

  const filteredFoodList = food_list
    ?.filter((item) => category === "All" || category === item.category)
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

  return (
    <div className="food-display-container">
      {/* Categories disappear when no category is selected */}
      {category && category !== "All" && (
        <div className={`categories ${showCategories ? "fade-in" : ""}`}>
          {categories.map((cat, index) => (
            <button
              key={cat}
              className={`category-button ${category === cat ? "active" : ""} ${showCategories ? "show" : ""}`}
              onClick={() => setCategory(cat)}
              style={{ animationDelay: `${3 + index}s` }} // Staggered animation
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Food Display */}
      <div className="food-display-content">
        {category && category !== "All" && (
          <>
            <div className="title" ref={foodDisplayRef}>
              <h2>Top Dishes</h2>
              {!loading && (
                <div className="controls">
                  <div className="sort-container">
                    <select id="sort" value={sortOrder} onChange={handleSort}>
                      <option value="asc">Low to High</option>
                      <option value="desc">High to Low</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="food-display">
              {loading ? (
                <div className="loader-wrapper">
                  <div className="loader"></div>
                </div>
              ) : (
                <div className="food-display-list">
                  {filteredFoodList.length > 0 ? (
                    filteredFoodList.map((item) => (
                      <FoodItem
                        key={item.id || item._id}
                        id={item.id || item._id}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        image={item.image}
                        category={item.category}
                        available={true}
                        veg={item.veg}
                      />
                    ))
                  ) : (
                    <div className="no-food">
                      <h6>:(</h6>
                      <p>No food items available in this category.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FoodDisplay;
