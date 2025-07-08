import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import Users from "./pages/Users";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserOrders from "./pages/UserOrders";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-product" element={<AddProduct />} />
<Route path="/admin/user-orders/:userId" element={<UserOrders />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
