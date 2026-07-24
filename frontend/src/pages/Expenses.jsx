import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AddExpenseModal from '../components/AddExpenseModal';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const Expenses = () => {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter State
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // Safely build the query string based on active filters
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const queryString = params.toString();
      const url = `http://localhost:5000/api/expenses${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch automatically whenever a filter changes
  useEffect(() => {
    fetchExpenses();
  }, [token, filters.category, filters.startDate, filters.endDate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Expense deleted successfully!');
      fetchExpenses();
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const handleEdit = (expense) => {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setExpenseToEdit(null);
    setIsModalOpen(true);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ category: '', startDate: '', endDate: '' });
  };

  return (
    <div className="p-8 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <button 
          onClick={handleOpenNew}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          + Add Expense
        </button>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded mb-6 flex flex-wrap gap-4 items-end shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
        <div>
          <label className="text-gray-600 dark:text-gray-400 text-sm mb-1 block">Category</label>
          <select 
            name="category" 
            value={filters.category} 
            onChange={handleFilterChange} 
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="text-gray-600 dark:text-gray-400 text-sm mb-1 block">From</label>
          <input 
            type="date" 
            name="startDate" 
            value={filters.startDate} 
            onChange={handleFilterChange} 
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent" 
          />
        </div>
        <div>
          <label className="text-gray-600 dark:text-gray-400 text-sm mb-1 block">To</label>
          <input 
            type="date" 
            name="endDate" 
            value={filters.endDate} 
            onChange={handleFilterChange} 
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-transparent" 
          />
        </div>
        <button 
          onClick={clearFilters} 
          className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-bold py-2 px-4 rounded h-[40px] transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <Spinner message="Loading expenses..." />
      ) : expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-gray-100 dark:bg-gray-800/30 rounded-lg border-2 border-gray-300 dark:border-gray-700 border-dashed mt-4">
          <div className="text-7xl mb-4 drop-shadow-lg animate-bounce">📭</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No expenses yet!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
            It looks pretty quiet here. Add your first expense to start tracking your spending.
          </p>
          <button 
            onClick={handleOpenNew}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded shadow-lg transition-colors"
          >
            + Add Expense
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-transparent rounded-lg shadow-sm border border-gray-200 dark:border-transparent transition-colors">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Note</th>
                <th className="p-3">Amount (₹)</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="p-3">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-700 dark:text-white">{expense.category}</span>
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{expense.note || '-'}</td>
                  <td className="p-3 font-bold">₹{expense.amount}</td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => handleEdit(expense)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(expense._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onExpenseAdded={fetchExpenses}
        expenseToEdit={expenseToEdit}
      />
    </div>
  );
};

export default Expenses;
