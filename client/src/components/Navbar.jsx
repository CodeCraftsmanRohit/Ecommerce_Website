import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  ChevronDown,
  MapPin,
  User,
} from "lucide-react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
const Navbar = () => {
  const { ecoCart } = useContext(AppContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContext);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setUserData(null);
        setIsLoggedin(false);
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      {/* Main Navbar */}
      <div className="px-4 py-3 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo and Hamburger */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="text-gray-700" size={24} />
            </button>
            <Link to="/" className="flex items-center gap-1">
              <span className="text-blue-600 font-bold text-2xl">Eco-Mart</span>
            </Link>
          </div>

          {/* Departments Dropdown */}
          <div className="hidden md:flex items-center relative">
            <button
              className="flex items-center gap-1 px-4 py-2 font-medium hover:bg-gray-100 rounded"
              onClick={() => setDepartmentOpen(!departmentOpen)}
            >
              <span>Departments</span>
              <ChevronDown size={16} />
            </button>
            {departmentOpen && (
              <div className="absolute top-full left-0 w-64 bg-white border rounded-md shadow-lg z-20 mt-1">
                <Link
                  to="/products"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  All Products
                </Link>
                <Link
                  to="/category/electronics"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Electronics
                </Link>
                <Link
                  to="/category/clothing"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Clothing
                </Link>
                <Link
                  to="/category/home"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Home Goods
                </Link>
                <Link
                  to="/category/grocery"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Grocery
                </Link>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search everything at Eco-Mart online and in store"
                className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-blue-600 text-white rounded-r-full">
                <Search size={20} />
              </button>
            </div>
          </div>


         <div className="flex items-center gap-4">
  {/* Shopping Cart Icon */}
  <Link to="/cart" className="relative">
    <ShoppingCart className="text-gray-700 hover:text-blue-600" size={24} />
    {ecoCart.length > 0 && (
      <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {ecoCart.length}
      </span>
    )}
  </Link>

  {/* Profile/Login */}
  <div className="relative hidden md:block">
    {userData ? (
      <div
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex items-center gap-1 cursor-pointer hover:text-blue-600"
      >
        <User size={20} />
        <span className="text-sm">Account</span>
        <ChevronDown size={16} />
      </div>
    ) : (
      <button
        onClick={() => navigate('/login')}
        className="flex items-center gap-1 hover:text-blue-600"
      >
        <User size={20} />
        <span className="text-sm">Sign In</span>
      </button>
    )}
  </div>
</div>


          {profileOpen && userData && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-10">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setProfileOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Search */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none"
            />
            <button className="absolute right-0 top-0 h-full px-4 text-gray-500">
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 flex flex-col gap-2 border-t pt-3">
            <Link to="/" className="py-2 text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link
              to="/products"
              className="py-2 text-gray-700 hover:text-blue-600"
            >
              Products
            </Link>
            <Link
              to="/brands"
              className="py-2 text-gray-700 hover:text-blue-600"
            >
              Brands
            </Link>
            <Link
              to="/about"
              className="py-2 text-gray-700 hover:text-blue-600"
            >
              About
            </Link>
            <Link to="/cart" className="py-2 text-gray-700 hover:text-blue-600">
  Eco Cart ({ecoCart.length})
</Link>

            {userData ? (
              <>
                <Link
                  to="/profile"
                  className="py-2 text-gray-700 hover:text-blue-600"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left py-2 text-gray-700 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="w-full text-left py-2 text-gray-700 hover:text-blue-600"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
