import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) {
    // Redirect them to the login page, but don't save the redirect in history
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
