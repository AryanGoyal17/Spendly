import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SummaryCards = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalSpent: 0,
    transactionCount: 0,
    highestCategory: 'N/A',
    averageDaily: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentMonthExpenses = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        // getMonth() is 0-indexed, so we add 1. padStart ensures '7' becomes '07'
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        
        // Safely build the local first day (YYYY-MM-01)
        const firstDay = `${year}-${month}-01`;

        // Safely build the local last day
        const lastDayDate = new Date(year, today.getMonth() + 1, 0);
        const lastDay = `${year}-${month}-${String(lastDayDate.getDate()).padStart(2, '0')}`;

        // Fetch only this month's expenses using our backend filters
        const response = await axios.get(
          `http://localhost:5000/api/expenses?startDate=${firstDay}&endDate=${lastDay}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const expenses = response.data;

        // 1. Calculate Total spent this month
        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        // 2. Count Number of transactions
        const transactionCount = expenses.length;

        // 3. Find Highest spending category
        const categoryTotals = {};
        expenses.forEach(exp => {
          categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        });
        
        // Find the category key with the highest total value
        const highestCategory = expenses.length > 0 
          ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b)
          : 'N/A';

        // 4. Calculate Average daily spend
        const currentDay = today.getDate();
        const averageDaily = totalSpent > 0 ? (totalSpent / currentDay).toFixed(2) : 0;

        // Update the state
        setStats({
          totalSpent,
          transactionCount,
          highestCategory,
          averageDaily
        });
      } catch (error) {
        console.error('Error fetching summary stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentMonthExpenses();
  }, [token]);

  if (loading) return <div className="text-gray-400">Loading summary...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Spent Card */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <p className="text-gray-400 text-sm font-medium">Total Spent (This Month)</p>
        <h3 className="text-3xl font-bold text-white mt-2">₹{stats.totalSpent.toLocaleString()}</h3>
      </div>

      {/* Transaction Count Card */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <p className="text-gray-400 text-sm font-medium">Transactions</p>
        <h3 className="text-3xl font-bold text-white mt-2">{stats.transactionCount}</h3>
      </div>

      {/* Highest Category Card */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-purple-500">
        <p className="text-gray-400 text-sm font-medium">Highest Spend Category</p>
        <h3 className="text-2xl font-bold text-white mt-2 truncate">{stats.highestCategory}</h3>
      </div>

      {/* Average Daily Spend Card */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-orange-500">
        <p className="text-gray-400 text-sm font-medium">Avg. Daily Spend</p>
        <h3 className="text-3xl font-bold text-white mt-2">₹{stats.averageDaily}</h3>
      </div>
    </div>
  );
};

export default SummaryCards;
