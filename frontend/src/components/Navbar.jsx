import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { logout, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // If there's no token, don't show the navbar (so it hides on login/signup pages)
  if (!token) return null;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-50 shadow-md transition-colors">
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
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1' 
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-500 pb-1'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-xl"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          <button
            onClick={logout}
            className="bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation (Bottom row for small screens) */}
      <div className="md:hidden flex justify-around mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`text-sm font-medium ${
              location.pathname === link.path ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
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
