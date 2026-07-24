import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { token, user, logout } = useAuth();
  
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Load the current budget on page load
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBudget(response.data.monthlyBudget || 0);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) fetchBudget();
  }, [token]);

  // Handle form submission to update the budget
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      await axios.put(
        'http://localhost:5000/api/user/budget',
        { monthlyBudget: Number(budget) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: 'Budget updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error saving budget:', error);
      setMessage({ text: 'Failed to update budget.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 text-white bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        {/* Profile Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Name</p>
              <p className="text-white text-lg font-medium">{user?.name || 'User'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white text-lg font-medium">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Budget Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Financial Preferences</h2>
          
          {loading ? (
            <p className="text-gray-400">Loading settings...</p>
          ) : (
            <form onSubmit={handleSave}>
              <div className="mb-4 max-w-sm">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Monthly Budget (₹)
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>

              {message.text && (
                <div className={`mb-4 p-3 rounded flex items-center ${message.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-500' : 'bg-red-900/50 text-red-400 border border-red-500'}`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          )}
        </div>

        {/* Logout Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 border-l-4 border-l-red-500">
          <h2 className="text-xl font-bold text-white mb-2">Account Actions</h2>
          <p className="text-gray-400 mb-6 text-sm">
            Logging out will clear your session securely. You will need to log back in to access your dashboard.
          </p>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded transition-colors shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
