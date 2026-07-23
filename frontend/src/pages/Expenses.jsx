import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AddExpenseModal from '../components/AddExpenseModal';

const Expenses = () => {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  // Function to fetch the data from our backend
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/expenses', {
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

  // Run the fetch function exactly once when the component loads
  useEffect(() => {
    fetchExpenses();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExpenses(); // Refresh the list automatically
    } catch (err) {
      alert('Failed to delete expense');
    }
  };

  const handleEdit = (expense) => {
    setExpenseToEdit(expense); // Pass the data to the modal
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setExpenseToEdit(null); // Clear the modal data
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 text-white bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <button 
          onClick={handleOpenNew}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          + Add Expense
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-400">Loading expenses...</p>
      ) : expenses.length === 0 ? (
        <p className="text-gray-400">No expenses yet. Add your first one!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="p-3">Date</th>
                <th className="p-3">Category</th>
                <th className="p-3">Note</th>
                <th className="p-3">Amount (₹)</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id} className="border-b border-gray-800 hover:bg-gray-800">
                  {/* Clean up the ugly ISO date format */}
                  <td className="p-3">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className="bg-gray-700 px-2 py-1 rounded text-sm">{expense.category}</span>
                  </td>
                  <td className="p-3 text-gray-300">{expense.note || '-'}</td>
                  <td className="p-3 font-bold">₹{expense.amount}</td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => handleEdit(expense)}
                      className="text-blue-400 hover:text-blue-300 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(expense._id)}
                      className="text-red-400 hover:text-red-300"
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
