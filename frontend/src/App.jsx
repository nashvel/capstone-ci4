import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import { useState } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/Myorders/MyOrders";
import MyProfile from "./pages/MyProfile/MyProfile";
import "bootstrap/dist/css/bootstrap.min.css";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import "@fortawesome/fontawesome-free/css/all.min.css";

//admin
import Dashboard from "./admin/pages/dashboard";
import { SidebarProvider } from "./admin/layouts/sidebarcontent"; 
import Header from "./admin/layouts/header";
import Sidemenu from "./admin/layouts/sidemenu";
import ThemeEditor from "./admin/pages/client/theme-editor/theme-editor";
import ChatToAdmin from "./admin/pages/client/chat-admin/chat-admin";
import FoodMenu from "./admin/pages/client/managemenu/FoodMenu";
import SalesReport from "./admin/pages/client/sales/sales";
import PromoPage from "./admin/pages/client/promo/promo";
function App() {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Slide}
      />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <ScrollToTop />

      <div className="app">
        {!isAdminRoute && <Navbar setShowLogin={setShowLogin} showLogin={showLogin} />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/myorders" element={<MyOrders />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/theme" element={<ThemeEditor />} />
          <Route path="/admin/chat-admin" element={<ChatToAdmin />} />
          <Route path="/admin/foodmenu" element={<FoodMenu />} />
          <Route path="/admin/sales" element={<SalesReport />} />
          <Route path="/admin/promo" element={<PromoPage />} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
