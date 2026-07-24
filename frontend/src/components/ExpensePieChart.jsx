import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Spinner from './Spinner';

// Distinct colors for different categories
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919', '#19FFD5'];

const ExpensePieChart = () => {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentMonthExpenses = async () => {
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        
        const firstDay = `${year}-${month}-01`;
        const lastDayDate = new Date(year, today.getMonth() + 1, 0);
        const lastDay = `${year}-${month}-${String(lastDayDate.getDate()).padStart(2, '0')}`;

        const response = await axios.get(
          `http://localhost:5000/api/expenses?startDate=${firstDay}&endDate=${lastDay}`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const expenses = response.data;

        // Group expenses by category and sum the amounts
        const categoryTotals = {};
        expenses.forEach(exp => {
          categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        });

        // Convert the object into the exact array format Recharts expects
        const chartData = Object.keys(categoryTotals).map(category => ({
          name: category,
          value: categoryTotals[category]
        }));

        // Sort data so the biggest slices appear first
        chartData.sort((a, b) => b.value - a.value);

        setData(chartData);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentMonthExpenses();
  }, [token]);

  if (loading) return <Spinner message="Loading chart..." />;

  if (data.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-md h-96 flex flex-col items-center justify-center text-gray-400 border border-gray-700">
        <div className="text-5xl mb-3 opacity-50">🍩</div>
        <p>No expenses this month to chart.</p>
      </div>
    );
  }

  // Custom legend formatter to show the exact amount next to the category name
  const renderLegend = (value, entry) => {
    return <span className="text-gray-300 ml-1">{value} (₹{entry.payload.value})</span>;
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md h-96">
      <h3 className="text-xl font-bold text-white mb-4">Spending by Category (This Month)</h3>
      
      {/* ResponsiveContainer makes sure the chart shrinks/grows with the screen size */}
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60} // Makes it a donut chart
            outerRadius={100}
            paddingAngle={5} // Adds space between slices
            dataKey="value"
          >
            {/* Give each slice a different color from our COLORS array */}
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `₹${value}`}
            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend formatter={renderLegend} verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensePieChart;
