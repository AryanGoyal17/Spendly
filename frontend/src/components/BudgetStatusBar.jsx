import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const BudgetStatusBar = () => {
  const { token } = useAuth();
  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // 1. Fetch User Data to get the budget
        const userRes = await axios.get('http://localhost:5000/api/user/me', config);
        setBudget(userRes.data.monthlyBudget || 0);

        // 2. Fetch Current Month Expenses to get total spent
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const firstDay = `${year}-${month}-01`;
        const lastDayDate = new Date(year, today.getMonth() + 1, 0);
        const lastDay = `${year}-${month}-${String(lastDayDate.getDate()).padStart(2, '0')}`;

        const expRes = await axios.get(
          `http://localhost:5000/api/expenses?startDate=${firstDay}&endDate=${lastDay}`, 
          config
        );

        const totalSpent = expRes.data.reduce((sum, exp) => sum + exp.amount, 0);
        setSpent(totalSpent);

      } catch (error) {
        console.error('Error fetching budget data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <Spinner message="Loading budget status..." />;

  // Calculate percentage (prevent dividing by zero)
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  
  // Determine color based on how close we are to the budget
  let barColor = 'bg-green-500';
  if (percentage >= 75 && percentage <= 100) barColor = 'bg-yellow-500';
  if (percentage > 100) barColor = 'bg-red-500';

  // Cap the visual width at 100% so the bar doesn't break out of its container!
  const barWidth = percentage > 100 ? 100 : percentage;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex justify-between items-end mb-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Budget Status</h3>
        <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">
          You have spent <span className="text-gray-900 dark:text-white font-bold">₹{spent.toLocaleString()}</span> of your <span className="text-gray-900 dark:text-white font-bold">₹{budget.toLocaleString()}</span> budget
        </p>
      </div>

      {budget === 0 ? (
        <p className="text-yellow-500 text-sm mt-2">No budget set. You can update your budget in Settings.</p>
      ) : (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-4 overflow-hidden">
          <div 
            className={`${barColor} h-4 rounded-full transition-all duration-500`}
            style={{ width: `${barWidth}%` }}
          ></div>
        </div>
      )}
      
      {percentage > 100 && (
        <p className="text-red-500 text-sm mt-2 font-bold flex items-center">
          ⚠️ You are over budget by ₹{(spent - budget).toLocaleString()}!
        </p>
      )}
    </div>
  );
};

export default BudgetStatusBar;
