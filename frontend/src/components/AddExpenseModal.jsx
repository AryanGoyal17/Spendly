import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddExpenseModal = ({ isOpen, onClose, onExpenseAdded }) => {
  const { token } = useAuth(); // Grab the token to authorize the request
  
  // Set default date to today in YYYY-MM-DD format for the date picker
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    note: '',
    date: today
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If the modal isn't open, don't render anything on the screen
  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Pass the token in the headers exactly how our backend protect middleware expects it
      await axios.post('http://localhost:5000/api/expenses', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // On success: close modal, tell parent to refresh the expense list, reset form
      onExpenseAdded(); 
      onClose();
      setFormData({ amount: '', category: 'Food', note: '', date: today });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
      <div className="bg-gray-800 rounded shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Add Expense</h2>
        
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Amount (₹)</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="1" className="w-full p-2 rounded bg-gray-700 text-white" />
          </div>
          
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 text-white">
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
            <label className="text-gray-400 text-sm mb-1 block">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-2 rounded bg-gray-700 text-white" />
          </div>
          
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Note (Optional)</label>
            <input type="text" name="note" value={formData.note} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" placeholder="What was this for?" />
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-green-500 text-white rounded font-bold hover:bg-green-600 disabled:opacity-50">
              {loading ? 'Saving...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
