import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout, token } = useAuth();
  const location = useLocation();

  // If there's no token, don't show the navbar (so it hides on login/signup pages)
  if (!token) return null;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Left side: App Name */}
        <div className="flex items-center">
          <Link to="/dashboard" className="text-2xl font-extrabold text-blue-500 tracking-wide flex items-center gap-2">
            <span className="text-3xl">💸</span> Spendly
          </Link>
        </div>

        {/* Middle: Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-white border-b-2 border-blue-500 pb-1' 
                    : 'text-gray-400 hover:text-white hover:border-b-2 hover:border-gray-500 pb-1'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right side: Logout Button */}
        <div>
          <button
            onClick={logout}
            className="bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation (Bottom row for small screens) */}
      <div className="md:hidden flex justify-around mt-4 pt-4 border-t border-gray-700">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`text-sm font-medium ${
              location.pathname === link.path ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
