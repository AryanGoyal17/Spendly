import { useAuth } from '../context/AuthContext';
import SummaryCards from '../components/SummaryCards';
import ExpensePieChart from '../components/ExpensePieChart';
import ExpenseBarChart from '../components/ExpenseBarChart';
import BudgetStatusBar from '../components/BudgetStatusBar';

const Dashboard = () => {
  const { user } = useAuth(); // Grab the logged-in user to say hello
  
  // Format today's date nicely: e.g., "Monday, July 24, 2026"
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-8 text-white bg-gray-900 min-h-screen">
      
      {/* Top: Welcome Message + Current Date */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="text-gray-400 mt-2">{todayDate}</p>
      </div>

      {/* Row 1: Summary Cards Grid */}
      <SummaryCards />

      {/* Row 2: Charts Grid (Pie Chart left, Bar Chart right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ExpensePieChart />
        <ExpenseBarChart />
      </div>

      {/* Row 3: Budget Status Bar */}
      <BudgetStatusBar />
      
    </div>
  );
};

export default Dashboard;
