import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, User, ChevronDown } from "lucide-react";
import { AdminContext } from "../context/AdminContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAdminAuthenticated, logout } = useContext(AdminContext);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="px-4 py-3 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo & Toggle */}
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="text-gray-700" size={24} />
            </button>
            <Link to="/" className="text-blue-600 font-bold text-2xl">Eco-Mart Admin</Link>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/users" className="hover:text-blue-600">Users</Link>
            <Link to="/add-product" className="hover:text-blue-600">Add Product</Link>
          </div>

          {/* Right Profile / Login / Signup */}
          <div className="relative hidden md:flex items-center gap-4">
            {isAdminAuthenticated ? (
              <>
                <div
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-600"
                >
                  <User size={20} />
                  <span className="text-sm">Admin</span>
                  <ChevronDown size={16} />
                </div>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-10">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        logout();
                        navigate("/login");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <User size={20} />
                  <span className="text-sm">Login</span>
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="flex items-center gap-1 hover:text-blue-600"
                >
                  <User size={20} />
                  <span className="text-sm">Signup</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 flex flex-col gap-2 border-t pt-3">
            <Link to="/" className="py-2 text-gray-700 hover:text-blue-600">Dashboard</Link>
            <Link to="/users" className="py-2 text-gray-700 hover:text-blue-600">Users</Link>
            <Link to="/add-product" className="py-2 text-gray-700 hover:text-blue-600">Add Product</Link>

            {isAdminAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                  navigate("/login");
                }}
                className="text-left py-2 text-gray-700 hover:text-blue-600"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/login");
                  }}
                  className="text-left py-2 text-gray-700 hover:text-blue-600"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/signup");
                  }}
                  className="text-left py-2 text-gray-700 hover:text-blue-600"
                >
                  Signup
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
