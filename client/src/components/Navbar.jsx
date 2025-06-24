import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, Menu } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setUserData(null);
        setIsLoggedin(false);
        toast.success("Logged out successfully");
        navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <nav className="px-4 py-3 border-b shadow-sm bg-white">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-lg font-semibold flex items-center gap-1">
            <span className="text-black text-xl">♻️</span>
            <span className="text-black text-lg">EcoChoice</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm text-gray-700 hover:text-black">Home</Link>
          <Link to="/products" className="text-sm text-gray-700 hover:text-black">Products</Link>
          <Link to="/brands" className="text-sm text-gray-700 hover:text-black">Brands</Link>
          <Link to="/about" className="text-sm text-gray-700 hover:text-black">About</Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-md px-2 py-1">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-sm px-2 w-32"
            />
          </div>

          <Heart className="text-gray-700 hidden sm:inline" />
          <ShoppingCart className="text-gray-700 hidden sm:inline" />

          {/* Profile Avatar */}
          <div className="relative">
            <div
  className="w-8 h-8 rounded-full overflow-hidden bg-green-700 text-white flex items-center justify-center cursor-pointer"
  onClick={() => setProfileOpen(!profileOpen)}
>
  {userData?.coverImage ? (
    <img
      src={userData.coverImage}
      alt="Profile"
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-sm font-semibold">
      {userData?.name ? userData.name[0].toUpperCase() : "?"}
    </span>
  )}
</div>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-10">
                {userData ? (
                  <>
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
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-2">
          <Link to="/" className="text-sm text-gray-700 hover:text-black">Home</Link>
          <Link to="/products" className="text-sm text-gray-700 hover:text-black">Products</Link>
          <Link to="/brands" className="text-sm text-gray-700 hover:text-black">Brands</Link>
          <Link to="/about" className="text-sm text-gray-700 hover:text-black">About</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
