import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Spinner from './Spinner';

const ExpenseBarChart = () => {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to generate an array of the last 6 months (safely using local time)
  const getLast6Months = () => {
    const result = [];
    const today = new Date();
    // Loop backwards from 5 months ago to this current month
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      result.push({
        monthKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, // e.g., "2026-07"
        name: d.toLocaleString('default', { month: 'short' }), // e.g., "Jul"
        value: 0 // Starting value is 0
      });
    }
    return result;
  };

  useEffect(() => {
    const fetchSixMonthExpenses = async () => {
      try {
        const monthsData = getLast6Months();
        
        // Calculate the first day of the oldest month (5 months ago)
        const firstMonth = monthsData[0].monthKey; 
        const startDate = `${firstMonth}-01`;
        
        // Calculate the absolute last day of the current month
        const today = new Date();
        const lastDayDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(lastDayDate.getDate()).padStart(2, '0')}`;

        // Fetch expenses for the entire 6-month window
        const response = await axios.get(
          `http://localhost:5000/api/expenses?startDate=${startDate}&endDate=${endDate}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const expenses = response.data;

        // Group expenses by month and sum the amounts
        expenses.forEach(exp => {
          // Extract "YYYY-MM" from the database date string (e.g., "2026-07-24..." -> "2026-07")
          const expMonthKey = exp.date.substring(0, 7); 
          
          // Find the matching month in our blank canvas array and add the amount
          const monthIndex = monthsData.findIndex(m => m.monthKey === expMonthKey);
          if (monthIndex !== -1) {
            monthsData[monthIndex].value += exp.amount;
          }
        });

        setData(monthsData);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSixMonthExpenses();
  }, [token]);

  if (loading) return <Spinner message="Loading chart..." />;

  const totalSpent = data.reduce((sum, item) => sum + item.value, 0);

  if (totalSpent === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-96 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="text-5xl mb-3 opacity-50">📊</div>
        <p>No data for the last 6 months.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-96 border border-gray-200 dark:border-gray-700 transition-colors">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Spending (Last 6 Months)</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {/* Subtle horizontal grid lines */}
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#9CA3AF' }} 
            axisLine={{ stroke: '#4B5563' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#9CA3AF' }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₹${value}`} // Formats the Y axis numbers with the Rupee symbol
          />
          <Tooltip 
            formatter={(value) => [`₹${value}`, 'Spent']}
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
            cursor={{ fill: '#374151' }} // Subtle highlight behind the bar when hovering
          />
          <Bar 
            dataKey="value" 
            fill="#10B981" // Vibrant green color
            radius={[4, 4, 0, 0]} // Rounds only the top corners of the bars
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseBarChart;
