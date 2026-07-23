import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      login(
        { _id: response.data._id, name: response.data.name, email: response.data.email, monthlyBudget: response.data.monthlyBudget }, 
        response.data.token
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-md w-96">
        <h2 className="text-2xl text-white mb-6 font-bold text-center">Sign Up for Spendly</h2>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        <input type="text" name="name" value={formData.name} placeholder="Name" onChange={handleChange} required className="w-full mb-4 p-2 rounded bg-gray-700 text-white" />
        <input type="email" name="email" value={formData.email} placeholder="Email" onChange={handleChange} required className="w-full mb-4 p-2 rounded bg-gray-700 text-white" />
        <input type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} required className="w-full mb-6 p-2 rounded bg-gray-700 text-white" />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded font-bold hover:bg-green-600">Sign Up</button>
        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account? <Link to="/" className="text-green-400 hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
