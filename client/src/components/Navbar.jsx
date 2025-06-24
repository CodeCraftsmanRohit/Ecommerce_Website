import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, Menu } from 'lucide-react';

const Navbar = () => {
 const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <nav className="px-4 py-3 border-b shadow-sm bg-white">
      <div className="flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-lg font-semibold flex items-center gap-1">
            <span className="text-black text-xl">♻️</span>
            <span className="text-black text-lg">EcoChoice</span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm text-gray-700 hover:text-black">Home</Link>
          <Link to="/products" className="text-sm text-gray-700 hover:text-black">Products</Link>
          <Link to="/brands" className="text-sm text-gray-700 hover:text-black">Brands</Link>
          <Link to="/about" className="text-sm text-gray-700 hover:text-black">About</Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Search bar (hidden on small) */}
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

         {/* Avatar with Dropdown */}
          <div className="relative">
            <img
              src="https://i.pravatar.cc/30"
              alt="Avatar"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={() => setProfileOpen(!profileOpen)}
            />
            {profileOpen && (
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
                    // Add logout logic here
                    console.log("Logout clicked");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          {/* Hamburger for mobile */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
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
