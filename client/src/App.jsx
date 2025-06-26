import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

import Brands from "./pages/Brands";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import BarcodeScanner from "./components/BarcodeScanner";
import GreenProducts from "./pages/GreenProducts";
import AddToCart from "./pages/AddToCart";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/green-products" element={<GreenProducts />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/scan" element={<BarcodeScanner />} />

        <Route path="/cart" element={<AddToCart />} />
      </Routes>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="rounded-lg"
        bodyClassName="font-sans"
      />
    </>
  );
}

export default App;
